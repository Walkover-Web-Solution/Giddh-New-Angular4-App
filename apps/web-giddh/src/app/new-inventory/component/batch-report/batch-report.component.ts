import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { MatMenuTrigger } from "@angular/material/menu";
import { ActivatedRoute, Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { ReplaySubject } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
import * as dayjs from "dayjs";
import * as customParseFormat from "dayjs/plugin/customParseFormat";
import { ASIDE_PANE_CONFIG, GIDDH_DATE_RANGE_PICKER_RANGES, PAGE_SIZE_OPTIONS, PAGINATION_LIMIT } from "../../../app.constant";
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from "../../../shared/helpers/defaultDateFormat";
import { InventoryReportRequest } from "../../../models/api-models/Inventory";
import { BatchReportFilter, BatchReportItem, BatchReportTotals } from "../../../models/interfaces/batch-report.interface";
import { OrganizationType } from "../../../models/user-login-state";
import { GeneralService } from "../../../services/general.service";
import { InventoryService } from "../../../services/inventory.service";
import { ToasterService } from "../../../services/toaster.service";
import { AppState } from "../../../store";
import { ConfirmModalComponent } from "../../../theme/new-confirm-modal/confirm-modal.component";
import { BatchCreateEditComponent } from "../batch-create-edit/batch-create-edit.component";
import { BatchArchiveDialogComponent } from "../batch-archive-dialog/batch-archive-dialog.component";
import { BatchTransferDialogComponent } from "../batch-transfer-dialog/batch-transfer-dialog.component";

export { mapAvailabilityBatches } from "./batch-report.helper";

dayjs.extend(customParseFormat);

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
    public displayedColumns: string[] = ["batchNumber", "name", "stock", "warehouse", "manufacturingDate", "expiryDate", "openingQuantity", "inwardQuantity", "outwardQuantity", "availableQuantity", "action"];
    /** Current page (1-based). */
    public page: number = 1;
    /** Page size. */
    public count: number = PAGINATION_LIMIT;
    /** Total rows from API. */
    public totalItems: number = 0;
    /** Quantity totals from the list response. */
    public totals: BatchReportTotals = {};
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
    /** Variant options for the filter dropdown. */
    public variants: Array<{ label: string; value: string }> = [];
    /** Warehouse options for the filter dropdown. */
    public warehouses: any[] = [];
    /** Full branches list from API. */
    public allBranches: any[] = [];
    /** True when the current org is a company. */
    public isCompany: boolean = false;
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
    /** From date sent on get-all (`DD-MM-YYYY`). */
    public fromDate: string = "";
    /** To date sent on get-all (`DD-MM-YYYY`). */
    public toDate: string = "";
    /** Selected date range object for the datepicker. */
    public selectedDateRange: any;
    /** Selected date range text shown on the datepicker input. */
    public selectedDateRangeUi: string = "";
    /** Datepicker preset ranges. */
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /** Selected range label in the datepicker. */
    public selectedRangeLabel: string = "";
    /** Datepicker menu trigger. */
    @ViewChild("universalDatepickerTrigger", { read: MatMenuTrigger }) public universalDatepickerTrigger: MatMenuTrigger;
    /** Advance filter dialog template. */
    @ViewChild("advanceFilterDialog") public advanceFilterDialog: TemplateRef<any>;
    /** Draft within-days value while the filter dialog is open. */
    public filterWithinDays: FormControl = new FormControl("");
    /** Draft expiry-status value while the filter dialog is open. */
    public filterExpiredOnly: boolean | null = null;
    /** True when from/to came from reports query params, so universal date must not overwrite them. */
    private useQueryDateRange: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
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
                if (!this.useQueryDateRange) {
                    this.fromDate = dayjs(dateObj[0]).format(GIDDH_DATE_FORMAT);
                    this.toDate = dayjs(dateObj[1]).format(GIDDH_DATE_FORMAT);
                    this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                    this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                }
                if (this.categoryUniqueName) {
                    this.loadStocks();
                    this.loadVariants();
                    this.getBatches();
                }
                this.cdr.detectChanges();
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
            const query = this.route.snapshot.queryParams;
            this.applyQueryFilters(query);
            this.loadStocks();
            this.loadVariants();
            this.loadBranchesAndWarehouses();
            if (this.hasQueryFilters(query)) {
                this.clearQueryParams();
            }
        });

        this.route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe(query => {
            if (!this.hasQueryFilters(query) || !this.inventoryType) {
                return;
            }
            this.applyQueryFilters(query);
            this.clearQueryParams();
            this.page = 1;
            this.pageIndex = 0;
            this.loadVariants();
            this.getBatches();
            this.cdr.detectChanges();
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
     * True when within-days or expiry-status advance filters are applied.
     *
     * @readonly
     * @type {boolean}
     * @memberof BatchReportComponent
     */
    public get hasAdvanceFilters(): boolean {
        return this.withinDaysValue > 0 || this.expiredOnly !== null;
    }

    /**
     * Count of applied advance filters (badge on the Filters button).
     *
     * @readonly
     * @type {number}
     * @memberof BatchReportComponent
     */
    public get advanceFilterCount(): number {
        let count = 0;
        if (this.withinDaysValue > 0) {
            count++;
        }
        if (this.expiredOnly !== null) {
            count++;
        }
        return count;
    }

    /**
     * Applied within-days value as a number (0 when empty).
     *
     * @readonly
     * @type {number}
     * @memberof BatchReportComponent
     */
    public get withinDaysValue(): number {
        return Number(this.withinDaysControl.value) || 0;
    }

    /**
     * Label for the applied expiry-status chip.
     *
     * @readonly
     * @type {string}
     * @memberof BatchReportComponent
     */
    public get expiryStatusLabel(): string {
        if (this.expiredOnly === true) {
            return this.localeData?.already_expired ?? "";
        }
        if (this.expiredOnly === false) {
            return this.localeData?.will_expire ?? "";
        }
        return "";
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
     * Open the advance filter dialog with the current applied values.
     *
     * @memberof BatchReportComponent
     */
    public openAdvanceFilterDialog(): void {
        this.filterWithinDays.setValue(this.withinDaysControl.value ?? "", { emitEvent: false });
        this.filterExpiredOnly = this.expiredOnly;
        this.dialog.open(this.advanceFilterDialog, {
            width: "500px",
            autoFocus: false,
            role: "alertdialog",
            ariaLabel: "Advance filter Dialog"
        });
    }

    /**
     * Apply draft advance filters and refetch from page 1.
     *
     * @memberof BatchReportComponent
     */
    public applyAdvanceFilters(): void {
        this.withinDaysControl.setValue(this.filterWithinDays.value ?? "", { emitEvent: false });
        this.expiredOnly = this.filterExpiredOnly;
        this.page = 1;
        this.pageIndex = 0;
        this.getBatches();
        this.cdr.detectChanges();
    }

    /**
     * Remove one applied advance filter and refetch.
     *
     * @param {("withinDays" | "expiredOnly")} type Filter to clear
     * @memberof BatchReportComponent
     */
    public removeAdvanceFilter(type: "withinDays" | "expiredOnly"): void {
        if (type === "withinDays") {
            this.withinDaysControl.setValue("", { emitEvent: false });
        } else {
            this.expiredOnly = null;
        }
        this.page = 1;
        this.pageIndex = 0;
        this.getBatches();
        this.cdr.detectChanges();
    }

    /**
     * Clear only the two advance filters (within days and expiry status).
     *
     * @memberof BatchReportComponent
     */
    public clearAdvanceFilters(): void {
        this.withinDaysControl.setValue("", { emitEvent: false });
        this.expiredOnly = null;
        this.page = 1;
        this.pageIndex = 0;
        this.getBatches();
        this.cdr.detectChanges();
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
     * Confirm and delete a batch.
     *
     * @param {BatchReportItem} row Selected row
     * @memberof BatchReportComponent
     */
    public deleteBatch(row: BatchReportItem): void {
        if (!row?.uniqueName) {
            return;
        }
        if (this.isBatchUsed(row)) {
            const entities = (row.linkedEntities ?? []).filter(item => !!item).join(", ") || "entry/voucher";
            const dialogRef = this.dialog.open(ConfirmModalComponent, {
                width: "40%",
                role: "alertdialog",
                ariaLabel: "Confirm Archive Dialog",
                data: {
                    title: this.commonLocaleData?.app_confirmation,
                    body: (this.localeData?.cannot_delete_used_batch ?? "").replace("[ENTITIES]", entities),
                    ok: this.commonLocaleData?.app_yes,
                    cancel: this.commonLocaleData?.app_no
                }
            });
            dialogRef.afterClosed().pipe(takeUntil(this.destroyed$)).subscribe(confirmed => {
                if (confirmed) {
                    this.openArchiveDialog(row);
                }
            });
            return;
        }
        const dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: "40%",
            role: "alertdialog",
            ariaLabel: "Confirm Delete Dialog",
            data: {
                title: this.commonLocaleData?.app_confirmation,
                body: this.localeData?.delete_batch,
                permanentlyDeleteMessage: this.commonLocaleData?.app_permanently_delete_message,
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no
            }
        });
        dialogRef.afterClosed().pipe(takeUntil(this.destroyed$)).subscribe(confirmed => {
            if (!confirmed) {
                return;
            }
            this.inventoryService.deleteBatch(row.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response?.status === "success") {
                    this.toaster.showSnackBar("success", this.localeData?.batch_deleted);
                    this.getBatches();
                } else if (response?.message) {
                    this.toaster.errorToast(response.message);
                }
                this.cdr.detectChanges();
            });
        });
    }

    /**
     * True when the batch is already used on an entry or voucher.
     *
     * @param {BatchReportItem} row Selected row
     * @return {*}  {boolean}
     * @memberof BatchReportComponent
     */
    public isBatchUsed(row: BatchReportItem): boolean {
        return !!(row?.isUsed || row?.linkedEntities?.length);
    }

    /**
     * True when the batch can be edited, deleted or archived.
     *
     * @param {BatchReportItem} row Selected row
     * @return {*}  {boolean}
     * @memberof BatchReportComponent
     */
    public isBatchUnarchived(row: BatchReportItem): boolean {
        return (row?.archiveStatus ?? "UNARCHIVED") === "UNARCHIVED";
    }

    /**
     * Open the archive / transfer dialog from the action menu.
     *
     * @param {BatchReportItem} row Selected row
     * @memberof BatchReportComponent
     */
    public archiveBatch(row: BatchReportItem): void {
        this.openArchiveDialog(row);
    }

    /**
     * Open the batch-to-batch transfer dialog.
     *
     * @param {BatchReportItem} row Source batch
     * @memberof BatchReportComponent
     */
    public transferBatch(row: BatchReportItem): void {
        if (!row?.uniqueName) {
            return;
        }
        const dialogRef = this.dialog.open(BatchTransferDialogComponent, {
            width: "500px",
            autoFocus: false,
            role: "alertdialog",
            ariaLabel: "Transfer Batch Dialog",
            data: {
                batch: row,
                localeData: this.localeData,
                commonLocaleData: this.commonLocaleData
            }
        });
        dialogRef.afterClosed().pipe(takeUntil(this.destroyed$)).subscribe(payload => {
            if (!payload) {
                return;
            }
            this.inventoryService.transferBatch(payload).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response?.status === "success") {
                    this.toaster.showSnackBar("success", this.localeData?.batch_transferred);
                    this.getBatches();
                } else if (response?.message) {
                    this.toaster.errorToast(response.message);
                }
                this.cdr.detectChanges();
            });
        });
    }

    /**
     * Confirm and unarchive a batch.
     *
     * @param {BatchReportItem} row Selected row
     * @memberof BatchReportComponent
     */
    public unarchiveBatch(row: BatchReportItem): void {
        if (!row?.uniqueName) {
            return;
        }
        const dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: "40%",
            role: "alertdialog",
            ariaLabel: "Confirm Unarchive Dialog",
            data: {
                title: this.commonLocaleData?.app_confirmation,
                body: this.localeData?.unarchive_batch,
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no
            }
        });
        dialogRef.afterClosed().pipe(takeUntil(this.destroyed$)).subscribe(confirmed => {
            if (confirmed) {
                this.submitArchiveAction(row.uniqueName, { action: "UNARCHIVED" }, this.localeData?.batch_unarchived);
            }
        });
    }

    /**
     * Open the archive dialog and post transfer or unassigned archive.
     *
     * @private
     * @param {BatchReportItem} row Selected row
     * @memberof BatchReportComponent
     */
    private openArchiveDialog(row: BatchReportItem): void {
        if (!row?.uniqueName) {
            return;
        }
        const dialogRef = this.dialog.open(BatchArchiveDialogComponent, {
            width: "500px",
            autoFocus: false,
            role: "alertdialog",
            ariaLabel: "Archive Batch Dialog",
            data: {
                batch: row,
                localeData: this.localeData,
                commonLocaleData: this.commonLocaleData
            }
        });
        dialogRef.afterClosed().pipe(takeUntil(this.destroyed$)).subscribe(payload => {
            if (payload) {
                this.submitArchiveAction(row.uniqueName, payload, this.localeData?.batch_archived);
            }
        });
    }

    /**
     * POST archive / transfer / unarchive and refresh the list.
     *
     * @private
     * @param {string} batchUniqueName Batch unique name
     * @param {*} payload Archive payload
     * @param {string} successMessage Toast on success
     * @memberof BatchReportComponent
     */
    private submitArchiveAction(batchUniqueName: string, payload: any, successMessage: string): void {
        this.inventoryService.archiveBatch(batchUniqueName, payload).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                this.toaster.showSnackBar("success", successMessage);
                this.getBatches();
            } else if (response?.message) {
                this.toaster.errorToast(response.message);
            }
            this.cdr.detectChanges();
        });
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
        this.inventoryService.getAllBatches({ q: name, page: this.page, count: this.count, from: this.fromDate, to: this.toDate }, payload)
            .pipe(takeUntil(this.cancelApi$), takeUntil(this.destroyed$))
            .subscribe(response => {
                this.isLoading = false;
                if (response?.status === "success" && response?.body) {
                    this.dataSource = new MatTableDataSource<BatchReportItem>(response.body.results ?? []);
                    this.totalItems = response.body.totalItems ?? 0;
                    this.pageIndex = (this.page || 1) - 1;
                    this.totals = {
                        openingQuantity: response.body.openingQuantity,
                        inwardQuantity: response.body.inwardQuantity,
                        outwardQuantity: response.body.outwardQuantity,
                        availableQuantity: response.body.availableQuantity
                    };
                } else {
                    this.dataSource = new MatTableDataSource<BatchReportItem>([]);
                    this.totalItems = 0;
                    this.totals = {};
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
        const queryParams = { from: this.fromDate, to: this.toDate, count: PAGINATION_LIMIT, page: 1, sort: "", sortBy: "" };
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
        const queryParams = { from: this.fromDate, to: this.toDate, count: PAGINATION_LIMIT, page: 1, sort: "", sortBy: "" };
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
    }

    /**
     * Color class for days remaining under expiry date.
     *
     * @param {number} daysRemaining Days until expiry (negative if expired)
     * @return {*}  {string} Utility class
     * @memberof BatchReportComponent
     */
    public getDaysRemainingClass(daysRemaining: number): string {
        if (daysRemaining < 0) {
            return "text-danger";
        }
        if (daysRemaining <= 30) {
            return "text-orange";
        }
        return "text-green";
    }

    /**
     * Date range selected in the datepicker.
     *
     * @param {*} [value] Selected range
     * @memberof BatchReportComponent
     */
    public dateSelectedCallback(value?: any): void {
        if (value && value.event === "cancel") {
            this.toggleGiddhDatepicker(false);
            return;
        }
        this.selectedRangeLabel = "";
        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.toggleGiddhDatepicker(false);
        if (value && value.startDate && value.endDate) {
            this.useQueryDateRange = false;
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
            this.page = 1;
            this.pageIndex = 0;
            this.loadStocks();
            this.loadVariants();
            this.getBatches();
        }
        this.cdr.detectChanges();
    }

    /**
     * Open or close the datepicker menu.
     *
     * @param {boolean} isOpen True to open
     * @memberof BatchReportComponent
     */
    public toggleGiddhDatepicker(isOpen: boolean = true): void {
        if (isOpen) {
            this.universalDatepickerTrigger?.openMenu();
        } else {
            this.universalDatepickerTrigger?.closeMenu();
        }
    }

    /**
     * Apply stock/variant/warehouse/date query params from the reports page.
     *
     * @private
     * @param {*} query Route query params
     * @memberof BatchReportComponent
     */
    private applyQueryFilters(query: any): void {
        if (!this.hasQueryFilters(query)) {
            return;
        }
        const stock = this.parseQueryList(query?.stockUniqueNames);
        const variant = this.parseQueryList(query?.variantUniqueNames);
        const warehouse = this.parseQueryList(query?.warehouseUniqueNames);
        if (stock.length) {
            this.selectedStock = stock;
        }
        if (variant.length) {
            this.selectedVariant = variant;
        }
        if (warehouse.length) {
            this.selectedWarehouse = warehouse;
        }
        this.applyQueryDateRange(query?.from, query?.to);
    }

    /**
     * Set the datepicker and get-all range from reports `from`/`to` query params.
     *
     * @private
     * @param {string} from From date (`DD-MM-YYYY`)
     * @param {string} to To date (`DD-MM-YYYY`)
     * @memberof BatchReportComponent
     */
    private applyQueryDateRange(from: string, to: string): void {
        if (!from || !to) {
            return;
        }
        const startDate = dayjs(from, GIDDH_DATE_FORMAT);
        const endDate = dayjs(to, GIDDH_DATE_FORMAT);
        if (!startDate.isValid() || !endDate.isValid()) {
            return;
        }
        this.useQueryDateRange = true;
        this.fromDate = startDate.format(GIDDH_DATE_FORMAT);
        this.toDate = endDate.format(GIDDH_DATE_FORMAT);
        this.selectedDateRange = { startDate, endDate };
        this.selectedDateRangeUi = startDate.format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + endDate.format(GIDDH_NEW_DATE_FORMAT_UI);
    }

    /**
     * True when the URL has stock, variant, warehouse or date query params.
     *
     * @private
     * @param {*} query Route query params
     * @return {*}  {boolean}
     * @memberof BatchReportComponent
     */
    private hasQueryFilters(query: any): boolean {
        return !!(query?.stockUniqueNames || query?.variantUniqueNames || query?.warehouseUniqueNames || query?.from || query?.to);
    }

    /**
     * Parse a query param that may be a string or string[].
     *
     * @private
     * @param {(string | string[])} value Query value
     * @return {*}  {string[]}
     * @memberof BatchReportComponent
     */
    private parseQueryList(value: string | string[]): string[] {
        if (!value) {
            return [];
        }
        const values = Array.isArray(value) ? value : String(value).split(',');
        return values.map(item => item?.trim()).filter(item => !!item);
    }

    /**
     * Strip filter query params from the URL after they are applied.
     *
     * @private
     * @memberof BatchReportComponent
     */
    private clearQueryParams(): void {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {},
            replaceUrl: true
        });
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
