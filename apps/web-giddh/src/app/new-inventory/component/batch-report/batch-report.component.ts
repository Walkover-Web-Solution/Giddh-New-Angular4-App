import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { ReplaySubject } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
import * as dayjs from "dayjs";
import { ASIDE_PANE_CONFIG, DROPDOWN_ITEMS_COUNT_LIMIT, PAGE_SIZE_OPTIONS, PAGINATION_LIMIT } from "../../../app.constant";
import { GIDDH_DATE_FORMAT } from "../../../shared/helpers/defaultDateFormat";
import { InventoryReportRequest } from "../../../models/api-models/Inventory";
import { BatchReportFilter, BatchReportItem } from "../../../models/interfaces/batch-report.interface";
import { OrganizationType } from "../../../models/user-login-state";
import { cloneDeep } from "../../../lodash-optimized";
import { GeneralService } from "../../../services/general.service";
import { InventoryService } from "../../../services/inventory.service";
import { ToasterService } from "../../../services/toaster.service";
import { AppState } from "../../../store";
import { BatchCreateEditComponent } from "../batch-create-edit/batch-create-edit.component";

@Component({
    selector: "batch-report",
    templateUrl: "./batch-report.component.html",
    styleUrls: ["./batch-report.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class BatchReportComponent implements OnInit, OnDestroy {
    /** RxJS teardown signal fired on destroy. */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Cancels in-flight list requests when filters change. */
    private cancelApi$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Locale data from translation directive. */
    public localeData: any = {};
    /** Common locale data from translation directive. */
    public commonLocaleData: any = {};
    /** True while a list request is in flight. */
    public isLoading: boolean = false;
    /** Table data source. */
    public dataSource: MatTableDataSource<BatchReportItem> = new MatTableDataSource<BatchReportItem>([]);
    /** Table column ids. */
    public displayedColumns: string[] = ["batchNumber", "name", "stock", "variant", "manufacturingDate", "expiryDate", "availableQuantity", "daysRemaining", "action"];
    /** Current page (1-based). */
    public page: number = 1;
    /** Page size. */
    public count: number = PAGINATION_LIMIT;
    /** Total rows from API. */
    public totalItems: number = 0;
    /** Paginator page index (0-based). */
    public pageIndex: number = 0;
    /** Page-size options. */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    /** Route inventory type (`product` / `service` / `fixedassets`). */
    public inventoryType: string = "";
    /** Category unique name sent as `categoryUniqueNames`. */
    public categoryUniqueName: string = "";
    /** Selected stock unique names. */
    public selectedStock: string[] = [];
    /** Selected variant unique names. */
    public selectedVariant: string[] = [];
    /** Selected warehouse unique names. */
    public selectedWarehouse: string[] = [];
    /** Stock options for the filter dropdown. */
    public stocks: Array<{ label: string; value: string }> = [];
    /** Stock options after local search. */
    public filteredStocks: Array<{ label: string; value: string }> = [];
    /** Variant options for the filter dropdown. */
    public variants: Array<{ label: string; value: string }> = [];
    /** Variant options after local search. */
    public filteredVariants: Array<{ label: string; value: string }> = [];
    /** Warehouses currently shown in the dropdown (after search). */
    public warehouses: any[] = [];
    /** Warehouses source list (before dropdown search). */
    public currentWarehouses: any[] = [];
    /** Full branches list from API. */
    public allBranches: any[] = [];
    /** True when the current org is a company. */
    public isCompany: boolean = false;
    /** Search form control for the stock dropdown. */
    public stocksDropdown: FormControl = new FormControl();
    /** Search form control for the variant dropdown. */
    public variantsDropdown: FormControl = new FormControl();
    /** Search form control for the warehouse dropdown. */
    public warehousesDropdown: FormControl = new FormControl();
    /** Inline search for batch number column. */
    public searchBatchNumber: FormControl = new FormControl("");
    /** Inline search for name column. */
    public searchName: FormControl = new FormControl("");
    /** True when the batch-number header search input is expanded. */
    public showBatchNumberSearchInput: boolean = false;
    /** True when the name header search input is expanded. */
    public showNameSearchInput: boolean = false;
    /** Latest batch-number search text sent as `batchNumbers`. */
    public batchNumberSearchText: string = "";
    /** Latest name search text sent as `q`. */
    public nameSearchText: string = "";
    /** Days remaining filter. */
    public withinDaysControl: FormControl = new FormControl("");
    /** Expired-only filter (`true` already expired, `false` will expire). */
    public expiredOnly: boolean | null = null;
    /** Universal from date used by stock/variant report APIs. */
    private fromDate: string = "";
    /** Universal to date used by stock/variant report APIs. */
    private toDate: string = "";

    constructor(
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef,
        private inventoryService: InventoryService,
        private toaster: ToasterService,
        private generalService: GeneralService,
        private store: Store<AppState>,
        private dialog: MatDialog
    ) {
        this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch;
    }

    /**
     * Initializes route, filters and data loaders.
     *
     * @memberof BatchReportComponent
     */
    public ngOnInit(): void {
        this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$)).subscribe(dateObj => {
            if (dateObj) {
                this.fromDate = dayjs(dateObj[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = dayjs(dateObj[1]).format(GIDDH_DATE_FORMAT);
                if (this.categoryUniqueName) {
                    this.loadStocks();
                    this.loadVariants();
                }
            }
        });

        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            const type = params?.type || "";
            const category = type?.toLowerCase() === "fixedassets" ? "FIXED_ASSETS" : type?.toUpperCase();
            if (this.inventoryType === type && this.categoryUniqueName === category) {
                return;
            }
            this.inventoryType = type;
            this.categoryUniqueName = category;
            this.resetFilters(false);
            this.loadStocks();
            this.loadVariants();
            this.loadBranchesAndWarehouses();
        });

        this.stocksDropdown.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(search => {
            const options = cloneDeep(this.stocks);
            this.filteredStocks = search
                ? options?.filter(stock => stock?.label?.toLowerCase()?.includes(search?.toLowerCase()))
                : options;
        });

        this.variantsDropdown.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(search => {
            const options = cloneDeep(this.variants);
            this.filteredVariants = search
                ? options?.filter(variant => variant?.label?.toLowerCase()?.includes(search?.toLowerCase()))
                : options;
        });

        this.warehousesDropdown.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(search => {
            const options = cloneDeep(this.currentWarehouses);
            this.warehouses = search
                ? options?.filter((warehouse: any) => warehouse?.name?.toLowerCase()?.includes(search?.toLowerCase()))
                : options;
        });

        this.searchBatchNumber.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe((search: string) => {
            this.batchNumberSearchText = (search ?? "").trim();
            this.page = 1;
            this.pageIndex = 0;
            this.getBatches();
        });

        this.searchName.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe((search: string) => {
            this.nameSearchText = (search ?? "").trim();
            this.page = 1;
            this.pageIndex = 0;
            this.getBatches();
        });

        this.withinDaysControl.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe(() => {
            this.page = 1;
            this.pageIndex = 0;
            this.getBatches();
        });
    }

    /**
     * True when any list filter is active.
     *
     * @readonly
     * @type {boolean}
     * @memberof BatchReportComponent
     */
    public get hasActiveFilters(): boolean {
        return !!(this.selectedStock?.length
            || this.selectedVariant?.length
            || this.selectedWarehouse?.length
            || this.batchNumberSearchText
            || this.nameSearchText
            || this.withinDaysControl.value
            || this.expiredOnly !== null);
    }

    /**
     * Stock selection changed — reload variants and the list.
     *
     * @memberof BatchReportComponent
     */
    public onStockChange(): void {
        this.selectedVariant = [];
        this.page = 1;
        this.pageIndex = 0;
        this.loadVariants();
        this.getBatches();
    }

    /**
     * Variant selection changed — refetch from page 1.
     *
     * @memberof BatchReportComponent
     */
    public onVariantChange(): void {
        this.page = 1;
        this.pageIndex = 0;
        this.getBatches();
    }

    /**
     * Warehouse selection changed — refetch from page 1.
     *
     * @memberof BatchReportComponent
     */
    public onWarehouseChange(): void {
        this.page = 1;
        this.pageIndex = 0;
        this.getBatches();
    }

    /**
     * Expired-only toggle changed — refetch from page 1.
     *
     * @memberof BatchReportComponent
     */
    public onExpiredOnlyChange(): void {
        this.page = 1;
        this.pageIndex = 0;
        this.getBatches();
    }

    /**
     * Reset filters and optionally refetch.
     *
     * @param {boolean} [refetch=true] Whether to reload the list after reset
     * @memberof BatchReportComponent
     */
    public resetFilters(refetch: boolean = true): void {
        this.selectedStock = [];
        this.selectedVariant = [];
        this.selectedWarehouse = [];
        this.batchNumberSearchText = "";
        this.nameSearchText = "";
        this.searchBatchNumber.setValue("", { emitEvent: false });
        this.searchName.setValue("", { emitEvent: false });
        this.showBatchNumberSearchInput = false;
        this.showNameSearchInput = false;
        this.withinDaysControl.setValue("", { emitEvent: false });
        this.expiredOnly = null;
        this.page = 1;
        this.pageIndex = 0;
        if (refetch) {
            this.loadVariants();
            this.getBatches();
        }
    }

    /**
     * Handle paginator page change.
     *
     * @param {PageEvent} event Paginator event
     * @memberof BatchReportComponent
     */
    public handlePageChange(event: PageEvent): void {
        this.page = event.pageIndex + 1;
        this.pageIndex = event.pageIndex;
        this.count = event.pageSize;
        this.getBatches();
    }

    /**
     * Reveal the inline search input for the given column header.
     *
     * @param {string} fieldName Column identifier (`batchNumber` or `name`)
     * @memberof BatchReportComponent
     */
    public toggleSearch(fieldName: string): void {
        if (fieldName === "batchNumber") {
            this.showBatchNumberSearchInput = true;
        } else if (fieldName === "name") {
            this.showNameSearchInput = true;
        }
    }

    /**
     * Collapse a column search input on outside-click when no active term is present.
     *
     * @param {*} event Original DOM event
     * @param {*} element Container element used for the child check
     * @param {string} searchedFieldName Column identifier
     * @memberof BatchReportComponent
     */
    public handleClickOutside(event: any, element: any, searchedFieldName: string): void {
        if (searchedFieldName === "batchNumber") {
            if (this.searchBatchNumber?.value) {
                return;
            }
            if (this.generalService.childOf(event?.target, element)) {
                return;
            }
            this.showBatchNumberSearchInput = false;
        } else if (searchedFieldName === "name") {
            if (this.searchName?.value) {
                return;
            }
            if (this.generalService.childOf(event?.target, element)) {
                return;
            }
            this.showNameSearchInput = false;
        }
    }

    /**
     * Open create or edit batch in an aside dialog.
     *
     * @param {string} [batchUniqueName] Batch unique name for edit mode
     * @memberof BatchReportComponent
     */
    public openBatchDialog(batchUniqueName?: string, batch?: BatchReportItem): void {
        const dialogRef = this.dialog.open(BatchCreateEditComponent, {
            ...ASIDE_PANE_CONFIG,
            data: {
                inventoryType: this.inventoryType,
                batchUniqueName: batchUniqueName || batch?.uniqueName || "",
                batch
            }
        });
        dialogRef.afterClosed().pipe(takeUntil(this.destroyed$)).subscribe(saved => {
            if (saved) {
                this.getBatches();
            }
        });
    }

    /**
     * Open edit batch dialog.
     *
     * @param {BatchReportItem} row Selected row
     * @memberof BatchReportComponent
     */
    public editBatch(row: BatchReportItem): void {
        if (!row?.uniqueName) {
            return;
        }
        this.openBatchDialog(row.uniqueName, row);
    }

    /**
     * Fetch the batch list with current filters.
     *
     * @private
     * @memberof BatchReportComponent
     */
    private getBatches(): void {
        if (!this.categoryUniqueName) {
            return;
        }
        this.cancelApi$.next(true);
        this.cancelApi$.complete();
        this.cancelApi$ = new ReplaySubject(1);
        this.isLoading = true;
        const batchNumber = this.batchNumberSearchText;
        const name = this.nameSearchText;
        const withinDays = Number(this.withinDaysControl.value);
        const payload: BatchReportFilter = {
            stockUniqueNames: this.selectedStock ?? [],
            variantUniqueNames: this.selectedVariant ?? [],
            warehouseUniqueNames: this.selectedWarehouse ?? [],
            batchUniqueNames: name ? [name] : [],
            batchNumbers: batchNumber ? [batchNumber] : [],
            categoryUniqueNames: [this.categoryUniqueName]
        };
        if (withinDays > 0) {
            payload.withinDays = withinDays;
        }
        if (this.expiredOnly !== null) {
            payload.expiredOnly = this.expiredOnly;
        }
        this.inventoryService.getAllBatches({ q: name, page: this.page, count: this.count }, payload)
            .pipe(takeUntil(this.cancelApi$), takeUntil(this.destroyed$))
            .subscribe(response => {
                this.isLoading = false;
                response =  {
                        "status": "success",
                        "body": {
                            "page": 1,
                            "count": 4,
                            "totalPages": 1,
                            "totalItems": 4,
                            "results": [
                                {
                                    "uniqueName": "l7o1787058642557",
                                    "name": "Batch B002",
                                    "batchNumber": "B002",
                                    "archive": false,
                                    "manufacturingDate": "18-08-2026",
                                    "expiryDate": "01-02-2027",
                                    "availableQuantity": -200.00,
                                    "daysRemaining": 159,
                                    "stock": {
                                        "name": "Jeans",
                                        "uniqueName": "jeans"
                                    },
                                    "variant": {
                                        "name": "Baggy",
                                        "uniqueName": "baggy178654239161072p2z6r5m0"
                                    }
                                },
                                {
                                    "uniqueName": "hfd1787308330055",
                                    "name": "Batch B003",
                                    "batchNumber": "B003",
                                    "archive": false,
                                    "manufacturingDate": "01-08-2026",
                                    "expiryDate": "01-02-2027",
                                    "availableQuantity": 100.00,
                                    "daysRemaining": 159,
                                    "stock": {
                                        "name": "Batch1Stock",
                                        "uniqueName": "batch1stock"
                                    },
                                    "variant": {
                                        "name": "A2",
                                        "uniqueName": "a217873280029105l2o0kiitg"
                                    }
                                },
                                {
                                    "uniqueName": "e2b1787559673527",
                                    "name": "W-B001",
                                    "batchNumber": "W-B001",
                                    "archive": false,
                                    "manufacturingDate": "01-08-2026",
                                    "expiryDate": "01-02-2027",
                                    "availableQuantity": 600.00,
                                    "daysRemaining": 159,
                                    "stock": {
                                        "name": "Cloth 3",
                                        "uniqueName": "cloth3"
                                    },
                                    "variant": {
                                        "name": "white",
                                        "uniqueName": "white17875596726475cqc1yug7k"
                                    }
                                },
                                {
                                    "uniqueName": "pbg1787559673672",
                                    "name": "W-B002",
                                    "batchNumber": "W-B002",
                                    "archive": false,
                                    "manufacturingDate": "15-08-2026",
                                    "expiryDate": "15-02-2027",
                                    "availableQuantity": 400.00,
                                    "daysRemaining": 173,
                                    "stock": {
                                        "name": "Cloth 3",
                                        "uniqueName": "cloth3"
                                    },
                                    "variant": {
                                        "name": "white",
                                        "uniqueName": "white17875596726475cqc1yug7k"
                                    }
                                }
                            ]
                        }
                    }
                if (response?.status === "success" && response?.body) {
                    this.dataSource = new MatTableDataSource<BatchReportItem>(response.body.results ?? []);
                    this.totalItems = response.body.totalItems ?? 0;
                    this.page = response.body.page ?? this.page;
                    this.count = response.body.count ?? this.count;
                    this.pageIndex = (this.page || 1) - 1;
                } else {
                    this.dataSource = new MatTableDataSource<BatchReportItem>([]);
                    this.totalItems = 0;
                    if (response?.message) {
                        this.toaster.errorToast(response.message);
                    }
                }
                this.cdr.detectChanges();
            }, () => {
                this.isLoading = false;
                this.cdr.detectChanges();
            });
    }

    /**
     * Load stock options from the item-wise report API.
     *
     * @private
     * @memberof BatchReportComponent
     */
    private loadStocks(): void {
        if (!this.categoryUniqueName) {
            return;
        }
        const stockReportRequest = new InventoryReportRequest();
        stockReportRequest["inventoryType"] = this.categoryUniqueName;
        const queryParams = { from: this.fromDate, to: this.toDate, count: DROPDOWN_ITEMS_COUNT_LIMIT, page: 1, sort: "", sortBy: "" };
        this.inventoryService.getItemWiseReport(queryParams, stockReportRequest)
            .pipe(takeUntil(this.destroyed$))
            .subscribe(response => {
                if (response?.status === "success") {
                    const unique = new Map<string, { label: string; value: string }>();
                    (response.body?.results ?? []).forEach((row: any) => {
                        const uniqueName = row?.stock?.uniqueName;
                        if (uniqueName && !unique.has(uniqueName)) {
                            unique.set(uniqueName, { label: row?.stock?.name ?? uniqueName, value: uniqueName });
                        }
                    });
                    this.stocks = Array.from(unique.values());
                    this.filteredStocks = cloneDeep(this.stocks);
                    this.cdr.detectChanges();
                }
            });
    }

    /**
     * Load variant options from the variant-wise report API.
     *
     * @private
     * @memberof BatchReportComponent
     */
    private loadVariants(): void {
        if (!this.categoryUniqueName) {
            return;
        }
        const stockReportRequest = new InventoryReportRequest();
        stockReportRequest["inventoryType"] = this.categoryUniqueName;
        stockReportRequest.stockUniqueNames = this.selectedStock ?? [];
        const queryParams = { from: this.fromDate, to: this.toDate, count: DROPDOWN_ITEMS_COUNT_LIMIT, page: 1, sort: "", sortBy: "" };
        this.inventoryService.getVariantWiseReport(queryParams, stockReportRequest)
            .pipe(takeUntil(this.destroyed$))
            .subscribe(response => {
                if (response?.status === "success") {
                    const unique = new Map<string, { label: string; value: string }>();
                    (response.body?.results ?? []).forEach((row: any) => {
                        const uniqueName = row?.variant?.uniqueName;
                        if (uniqueName && !unique.has(uniqueName)) {
                            unique.set(uniqueName, { label: row?.variant?.name ?? uniqueName, value: uniqueName });
                        }
                    });
                    this.variants = Array.from(unique.values());
                    this.filteredVariants = cloneDeep(this.variants);
                    this.cdr.detectChanges();
                }
            });
    }

    /**
     * Load branch + warehouse hierarchy for the warehouse filter.
     *
     * @private
     * @memberof BatchReportComponent
     */
    private loadBranchesAndWarehouses(): void {
        this.inventoryService.getLinkedStocks().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.body) {
                this.allBranches = response.body?.results?.filter((branch: any) => branch?.isCompany !== true) ?? [];
            }
            this.recomputeWarehouses();
            this.getBatches();
            this.cdr.detectChanges();
        });
    }

    /**
     * Recompute warehouses from the current branch context.
     *
     * @private
     * @memberof BatchReportComponent
     */
    private recomputeWarehouses(): void {
        const branches = this.allBranches ?? [];
        if (this.isCompany) {
            this.warehouses = branches.flatMap((branch: any) => branch?.warehouses ?? []);
        } else {
            const currentBranch = branches.find((branch: any) => branch?.uniqueName === this.generalService.currentBranchUniqueName);
            this.warehouses = currentBranch?.warehouses ?? [];
        }
        this.currentWarehouses = this.warehouses;
    }

    /**
     * Releases subscriptions.
     *
     * @memberof BatchReportComponent
     */
    public ngOnDestroy(): void {
        this.cancelApi$.next(true);
        this.cancelApi$.complete();
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
