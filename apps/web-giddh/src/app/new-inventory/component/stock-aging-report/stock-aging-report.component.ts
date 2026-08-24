import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatMenuTrigger } from "@angular/material/menu";
import { AgeRangeEditorOptions } from "../../../theme/age-range-editor/age-range-editor.component";
import { Observable, ReplaySubject } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
import { Store, select } from "@ngrx/store";
import { AppState } from "../../../store";
import { AgingReportActions } from "../../../actions/aging-report.actions";
import { AgingDropDownoptions } from "../../../models/api-models/Contact";
import { PageEvent } from "@angular/material/paginator";
import { MatTable } from "@angular/material/table";
import { FormControl } from "@angular/forms";
import { cloneDeep } from "../../../lodash-optimized";
import * as dayjs from "dayjs";
import { GIDDH_DATE_FORMAT } from "../../../shared/helpers/defaultDateFormat";
import { InventoryService } from "../../../services/inventory.service";
import { ToasterService } from "../../../services/toaster.service";
import { GeneralService } from "../../../services/general.service";
import { ActivatedRoute, Router } from "@angular/router";
import { OrganizationType } from "../../../models/user-login-state";
import { IGroupsWithStocksHierarchyMinItem } from "../../../models/interfaces/groups-with-stocks.interface";
import { ASIDE_PANE_CONFIG, IOption, isSelectedAllOption, PAGE_SIZE_OPTIONS, PAGINATION_LIMIT } from "../../../app.constant";
import {
    BucketColumn,
    BucketSortState,
    ColumnWidths,
    StockAgingDetailsBody,
    StockAgingLeafColumn,
    StockAgingReportBody,
    StockAgingRow,
    StockAgingTotals,
    StockAgingTransaction,
    StockAgingVariantRow,
} from "../../../models/interfaces/stock-aging-report.interface";

/** Stock Aging Report: aging buckets + per-stock breakup with summary cards and a grouped-header table. */
@Component({
    selector: "stock-aging-report",
    templateUrl: "./stock-aging-report.component.html",
    styleUrls: ["./stock-aging-report.component.scss"],
    standalone: false
})
export class StockAgingReportComponent implements OnInit, AfterViewChecked, OnDestroy {
    /** RxJS teardown signal fired on destroy. */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True while a report request is in flight. */
    public isLoading: boolean = false;
    /** True only for the initial load; shows full-page loader. */
    public isFirstLoad: boolean = true;
    /** Latest aging report response body. */
    public reportData: StockAgingReportBody | null = null;
    /** Summary totals from the dedicated totals API. */
    public reportTotals: any = null;
    /** Bucket range labels driving the group-header columns. */
    public bucketRanges: string[] = ["0-30 days", "31-60 days", "61-90 days", "90+ days"];
    /** Editable aging boundaries backing `bucketRanges` and the popup. */
    public agingOptions: AgeRangeEditorOptions = { fourth: 30, fifth: 60, sixth: 90 };
    /** Index (0-3) of the bucket whose popup is open. */
    public activeInterval: number = 0;
    /** True once bucket ranges were overridden locally (user edit or store hydrate); disables API overwrite. */
    private bucketRangesOverridden: boolean = false;
    /** `vendorCustomerType` value sent to the shared due-days-range API for the inventory context. */
    public readonly INVENTORY_AGING_TYPE: string = 'inventory';
    /** Store observable of the persisted aging boundaries. */
    private agingDropDownoptions$: Observable<AgingDropDownoptions>;
    /** Current page number (1-based). */
    public page: number = 1;
    /** Page size used in the paginator. */
    public count: number = PAGINATION_LIMIT;
    /** Total number of rows reported by the API. */
    public totalItems: number = 0;
    /** Page-size options for the paginator. */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    /** As-on date form control (defaults to today). */
    public asOnDateControl: FormControl = new FormControl(new Date());
    /** Fixed leaf column definitions rendered before the bucket group columns (labels filled on translation complete). */
    public baseColumns: StockAgingLeafColumn[] = [
        { colId: 'sr',          label: '', isLeaf: true, align: 'center' },
        { colId: 'stockName',   label: '', isLeaf: true, align: 'left'   },
        { colId: 'uom',         label: '', isLeaf: true, align: 'left'   }
    ];
    /** Fixed leaf column definitions rendered after the bucket group columns (labels filled on translation complete). */
    public trailingColumns: StockAgingLeafColumn[] = [
        { colId: 'totalQty',    label: '', isLeaf: true, align: 'right' },
        { colId: 'totalValue',  label: '', isLeaf: true, align: 'right' }
    ];

    /** Selected branch unique names, or `[SELECTED_ALL_OPTION]` when All is chosen. */
    public selectedBranch: string[] = [];
    /** Selected warehouse unique names, or `[SELECTED_ALL_OPTION]` when All is chosen. */
    public selectedWarehouse: string[] = [];
    /** Currently active stock category (from route param). */
    public selectedStockCategory: string = '';
    /** Selected stock group unique names, or `[SELECTED_ALL_OPTION]` when All is chosen. */
    public selectedStockGroup: string[] = [];
    /** Full branches list from API. */
    public allBranches: any[] = [];
    /** Warehouses available for the current branch selection. */
    public currentWarehouses: any[] = [];
    /** Full stock groups list. */
    public stockGroups: IOption[] = [];
    /** True when the current org is a company (branch dropdown visible). */
    public isCompany: boolean = false;
    /** Debounced item-name search input; drives `searchText` in the payload. */
    public searchStockName: FormControl = new FormControl();
    /** True when the item-name search input is expanded in the column header. */
    public showStockNameSearchInput: boolean = false;
    /** Latest debounced item-name search text sent to the API. */
    public searchText: string = '';
    /** Trigger for the currently open bucket-header mat-menu (only one open at a time). */
    private activeAgingMenuTrigger: MatMenuTrigger | null = null;

    /** Ordinal names for the four bucket intervals used in the sort payload. */
    private readonly intervalOrdinals: readonly string[] = ['first', 'second', 'third', 'fourth'];
    /** Current sort state for bucket Qty/Value columns (`null` = no sort). */
    public bucketSort: BucketSortState | null = null;

    /** Static column id for the spanning group-header row. */
    public readonly groupHeaderColumns: readonly string[] = ['groupHeader'];
    /** Static column id for the expandable transaction-detail row. */
    public readonly detailRowColumns: readonly string[] = ['stockDetail'];
    /** Predicate for the detail mat-row — only the expanded stock gets a second row. */
    public isExpandedDetailRow = (_index: number, row: StockAgingRow): boolean => this.isStockExpanded(row);
    /** Fixed percentage width shared by the Sr and UOM columns. */
    public readonly srColWidthPct: number = 4;
    /** Extra % width given to Item Name on top of the equally shared width. */
    public readonly stockNameSearchExtraPct: number = 10;

    /** Precomputed column ids per aging bucket (kept in sync with `bucketRanges`). */
    public bucketCols: BucketColumn[] = [];
    /** Precomputed ordered leaf column ids for `mat-table [displayedColumns]`. */
    public displayedColumns: string[] = [];
    /** Cached percentage widths for every column (updated by `refreshLayoutCaches`). */
    public columnWidths: ColumnWidths = { sr: 0, stockName: 0, uom: 0, base: 0, bucketGroup: 0 };
    /** Cached total colspan for the group-header row. */
    public totalColspan: number = 0;
    /** Locale data from translation directive. */
    public localeData: any = {};
    /** Common locale data from translation directive. */
    public commonLocaleData: any = {};
    /** Active company profile used for currency display. */
    public activeCompanyProfile: any;

    /** Stock identifier of the row whose variants are expanded (`null` when none). */
    public expandedStockCode: string | null = null;
    /** Variant rows accumulated for the expanded stock. */
    public variantRows: StockAgingVariantRow[] = [];
    /** Totals of the expanded stock's variants. */
    public variantTotals: StockAgingTotals | null = null;
    /** True while a variants page request is in flight. */
    public isVariantLoading: boolean = false;
    /** Last variants page fetched (1-based). */
    private variantPage: number = 1;
    /** Total variant pages reported by the variants API. */
    private variantTotalPages: number = 0;
    /** Variants requested per page. */
    private readonly variantCount: number = 20;
    /** Latest transaction-detail response shown in the aside. */
    public detailData: StockAgingDetailsBody | null = null;
    /** Leaf column ids for the aside transaction mat-table. */
    public readonly detailDisplayedColumns: readonly string[] = [
        'purchaseDate',
        'purchaseInvoice',
        'voucherNumber',
        'qty',
        'balanceQty',
        'rate',
        'stockValue',
        'ageDays',
        'ageBucket',
    ];
    /** Transactions accumulated across the aside pages fetched so far. */
    public detailTransactions: StockAgingTransaction[] = [];
    /** True while a details page request is in flight. */
    public isDetailLoading: boolean = false;
    /** Last details page fetched (1-based). */
    private detailPage: number = 1;
    /** Total details pages reported by the details API. */
    private detailTotalPages: number = 0;
    /** Transactions requested per details page. */
    private readonly detailCount: number = PAGINATION_LIMIT;
    /** Distance in px from the bottom of a scroll list at which the next page is fetched. */
    private readonly detailScrollThreshold: number = 40;
    /** Stock unique name whose transactions are open in the aside. */
    private asideStockCode: string = '';
    /** Variant unique name sent with the details API when opened from a variant row. */
    private asideVariantUniqueName: string = '';
    /** Aging interval (`first`…`fourth`) sent with the details API when opened from a bucket cell. */
    private asideInterval: string = '';
    /** Scroll container of the aside transaction list. */
    @ViewChild('detailScroll') private detailScrollRef?: ElementRef<HTMLElement>;
    /** Aside template for the stock / variant transaction breakup. */
    @ViewChild('stockDetailsAside') private stockDetailsAside?: TemplateRef<any>;
    /** Open aside dialog ref. */
    private stockDetailsAsideRef?: MatDialogRef<any>;
    /** Main mat-table instance — needed to re-render expand rows on expand/collapse. */
    @ViewChild(MatTable) private stockAgingTable?: MatTable<StockAgingRow>;
    /** Native main table element used to copy rendered column widths onto the expand table. */
    @ViewChild('stockAgingTableEl', { read: ElementRef }) private stockAgingTableEl?: ElementRef<HTMLTableElement>;
    /** Pixel widths of the parent data columns, applied to the variant table. */
    public nestedColWidths: number[] = [];
    /** True when the next `ngAfterViewChecked` should recopy parent column widths. */
    private pendingWidthSync = false;
    /** Age-bucket badge classes, ordered to match the colours of the summary cards. */
    private readonly bucketBadgeClasses: readonly string[] = ['opening-box', 'sales-purchase', 'payment-receipt', 'due-box'];
    /** Static in-app routes for transaction types that do not open a voucher preview. */
    private readonly transactionListRoutes: Readonly<Record<string, string>> = {
        OPENING_BALANCE: '/pages/inventory/v2/stock-balance',
        JOURNAL: '/pages/journal-voucher',
        MANUFACTURED: '/pages/inventory/v2/manufacturing/list',
    };
    /** In-app edit routes that require the transaction unique name. */
    private readonly transactionEditRoutes: Readonly<Record<string, string>> = {
        RECEIPT_NOTE: '/pages/inventory/v2/branch-transfer/receipt-note/edit',
        DELIVERY_NOTE: '/pages/inventory/v2/branch-transfer/delivery-challan/edit',
    };
    /** Voucher-view path segment for types that open a specific voucher. */
    private readonly voucherPreviewPaths: Readonly<Record<string, string>> = {
        PURCHASE: 'purchase',
        SALES: 'sales',
        SALES_CREDIT_NOTE: 'credit-note',
        PURCHASE_CREDIT_NOTE: 'credit-note',
        SALES_DEBIT_NOTE: 'debit-note',
        PURCHASE_DEBIT_NOTE: 'debit-note',
    };

    /**
     * Cycle bucket-column sort (asc → desc → off) and refetch.
     * @param intervalIndex 0-based bucket index.
     * @param sortBy Which sub-column: `'qty'` or `'value'`.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    public toggleBucketSort(intervalIndex: number, sortBy: 'qty' | 'value'): void {
        const interval = this.intervalOrdinals[intervalIndex] ?? '';
        const isSameSortColumn = this.bucketSort
            && this.bucketSort.intervalIndex === intervalIndex
            && this.bucketSort.sortBy === sortBy;
        if (!isSameSortColumn) {
            this.bucketSort = { sortBy, sort: 'asc', interval, intervalIndex };
        } else if (this.bucketSort!.sort === 'asc') {
            this.bucketSort = { ...this.bucketSort!, sort: 'desc' };
        } else {
            this.bucketSort = null;
        }
        this.page = 1;
        this.getReport();
        this.getReportTotals();
    }

    /**
     * Return the sort direction currently applied to a bucket column.
     * @param intervalIndex 0-based bucket index.
     * @param sortBy Which sub-column: `'qty'` or `'value'`.
     * @returns `'asc' | 'desc' | null`.
     * @memberof StockAgingReportComponent
     */
    public getBucketSortDir(intervalIndex: number, sortBy: 'qty' | 'value'): 'asc' | 'desc' | null {
        if (this.bucketSort && this.bucketSort.intervalIndex === intervalIndex && this.bucketSort.sortBy === sortBy) {
            return this.bucketSort.sort;
        }
        return null;
    }

    /**
     * True when any filter (branch, warehouse, stock-group, search or sort) is active.
     * All (`[SELECTED_ALL_OPTION]`) is treated as no filter.
     * @returns boolean
     * @memberof StockAgingReportComponent
     */
    public get hasActiveFilters(): boolean {
        return this.hasSpecificSelection(this.selectedBranch)
            || this.hasSpecificSelection(this.selectedWarehouse)
            || this.hasSpecificSelection(this.selectedStockGroup)
            || !!this.searchText
            || !!this.bucketSort;
    }

    /**
     * Reset filters, search and sort to defaults then refetch the report.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    public clearFilters(): void {
        this.selectedBranch = [];
        this.selectedWarehouse = [];
        this.selectedStockGroup = [];
        this.recomputeWarehouses();
        this.searchText = '';
        this.searchStockName.setValue('', { emitEvent: false });
        this.showStockNameSearchInput = false;
        this.refreshLayoutCaches();
        this.bucketSort = null;
        this.page = 1;
        this.getReport();
        this.getReportTotals();
    }

    /**
     * Injects report services and hydrates persisted aging boundaries from the store.
     * @param {ChangeDetectorRef} cdr Marks the view for check after async updates.
     * @param {InventoryService} inventoryService Stock aging report APIs.
     * @param {ToasterService} toaster Error toasts for failed requests.
     * @param {GeneralService} generalService Org, branch and DOM helpers.
     * @param {Store<AppState>} store App store for profile and due-range options.
     * @param {AgingReportActions} agingReportActions Due-range load/close actions.
     * @param {ActivatedRoute} route Category route param.
     * @param {MatDialog} dialog Aside dialog for stock transactions.
     * @memberof StockAgingReportComponent
     */
    constructor(
        private cdr: ChangeDetectorRef,
        private inventoryService: InventoryService,
        private toaster: ToasterService,
        private generalService: GeneralService,
        private store: Store<AppState>,
        private agingReportActions: AgingReportActions,
        private route: ActivatedRoute,
        private dialog: MatDialog,
        private router: Router,
    ) {
        this.agingDropDownoptions$ = this.store.pipe(
            select(state => state.agingreport.agingDropDownoptions),
            takeUntil(this.destroyed$)
        );
    }

    /**
     * Angular lifecycle: wires up route params, dropdown searches, date-change refetch and store hydration.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    public ngOnInit(): void {
        this.refreshLayoutCaches();
        this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch;
        this.getProfile();
        // Route param `:category` drives the stock category filter for this
        // report (e.g. product, service, fixedassets, all).
        // Angular reuses this component when only `:category` changes, so
        // this subscription is the single source of truth for (re)loading
        // category-scoped data — it fires on initial navigation AND on any
        // subsequent category change.
        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            const category = params['category'] == 'fixedassets' ? 'FIXED_ASSETS' : params['category']?.toUpperCase() || '';
            if (category === this.selectedStockCategory) {
                return;
            }
            this.selectedStockCategory = category;
            this.page = 1;
            // Clear the previous category's selections so the new fetch is
            // scoped correctly and the stock-group dropdown starts empty.
            this.selectedStockGroup = [];
            this.searchText = '';
            this.searchStockName.setValue('', { emitEvent: false });
            this.showStockNameSearchInput = false;
            this.refreshLayoutCaches();
            this.loadStockGroups();
            this.loadBranchesAndWarehouses();
        });

        // Debounced item-name search — refetches the report with the value
        // sent as `searchText` in the payload.
        this.searchStockName.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe((search: string) => {
            this.searchText = (search ?? '').trim();
            this.page = 1;
            this.getReport();
            this.getReportTotals();
        });

        // Refetch when as-on date changes.
        this.asOnDateControl.valueChanges.pipe(
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(() => {
            this.page = 1;
            this.getReport();
            this.getReportTotals();
        });

        // Load persisted aging boundaries for the inventory context and
        // hydrate the local editor options from the store as they arrive.
        this.store.dispatch(this.agingReportActions.GetDueRange(this.INVENTORY_AGING_TYPE));
        this.agingDropDownoptions$.pipe(takeUntil(this.destroyed$)).subscribe(options => {
            if (options && (options.fourth || options.fifth || options.sixth)) {
                this.agingOptions = cloneDeep(options);
                this.setBucketRanges(this.buildBucketRangesFromOptions(this.agingOptions));
                this.bucketRangesOverridden = true;
                this.cdr.detectChanges();
            }
        });
        // Note: `getReport()` is invoked from the `route.params` subscription
        // above so it fires for the initial category and on every change.
    }


    /**
     * Assigns translated labels to the fixed leaf columns after locale files load.
     * @param {*} event Truthy when translation of this view is complete.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            const labels: Record<string, string> = {
                sr: this.localeData?.sr,
                stockName: this.localeData?.item_name,
                uom: this.localeData?.uom,
                totalQty: this.localeData?.total_qty,
                totalValue: this.commonLocaleData?.app_total_amount
            };
            this.baseColumns = this.baseColumns.map(column => ({ ...column, label: labels[column.colId] ?? column.label }));
            this.trailingColumns = this.trailingColumns.map(column => ({ ...column, label: labels[column.colId] ?? column.label }));
        }
    }

    /**
     * Subscribe to the company profile for currency symbols on summary cards.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    private getProfile(): void {
        this.store.pipe(select(state => state.settings.profile), takeUntil(this.destroyed$)).subscribe(async (profile) => {
            if (profile) {
                this.activeCompanyProfile = profile;
            }
        });
    }

    /**
     * Load the branch + warehouse hierarchy and recompute dependent lists.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    private loadBranchesAndWarehouses(): void {
        this.inventoryService.getLinkedStocks().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.body) {
                this.allBranches = response.body?.results?.filter((branch: any) => branch?.isCompany !== true) ?? [];
            }
            this.getReport();
            this.getReportTotals();
            this.recomputeWarehouses();
            this.cdr.detectChanges();
        });
    }

    /**
     * Load the flat stock-groups list for the dropdown (scoped by `selectedStockCategory`).
     * @returns void
     * @memberof StockAgingReportComponent
     */
    private loadStockGroups(): void {
        this.inventoryService.GetGroupsWithStocksFlatten(this.selectedStockCategory).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === 'success') {
                const groups: IOption[] = [];
                this.arrangeStockGroups(response.body?.results ?? [], groups);
                this.stockGroups = groups;
                this.cdr.detectChanges();
            }
        });
    }

    /**
     * Flatten a stock-group hierarchy into a linear `IOption[]` in-place.
     * @param groups Source hierarchical stock groups.
     * @param parents Accumulator array populated with `IOption` entries.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    private arrangeStockGroups(groups: IGroupsWithStocksHierarchyMinItem[], parents: IOption[] = []): void {
        groups?.forEach(group => {
            if (group) {
                parents.push({ label: group?.name, value: group?.uniqueName, additional: group });
                if (group?.childStockGroups?.length > 0) {
                    this.arrangeStockGroups(group?.childStockGroups, parents);
                }
            }
        });
    }

    /**
     * Recompute `currentWarehouses` from `allBranches` given the current branch selection.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    private recomputeWarehouses(): void {
        const branches = this.allBranches ?? [];
        if (this.hasSpecificSelection(this.selectedBranch)) {
            this.currentWarehouses = branches
                .filter((branch: any) => this.selectedBranch.includes(branch?.uniqueName))
                .flatMap((branch: any) => branch?.warehouses ?? []);
        } else if (this.isCompany) {
            this.currentWarehouses = branches.flatMap((branch: any) => branch?.warehouses ?? []);
        } else {
            const currentBranch = branches.find((branch: any) => branch?.uniqueName === this.generalService.currentBranchUniqueName);
            this.currentWarehouses = currentBranch?.warehouses ?? [];
        }
    }

    /**
     * Branch selection changed — reset warehouse selection and refetch.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    public onBranchChange(): void {
        this.selectedWarehouse = [];
        this.recomputeWarehouses();
        this.page = 1;
        this.getReport();
        this.getReportTotals();
    }

    /**
     * Warehouse selection changed — refetch the report from page 1.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    public onWarehouseChange(): void {
        this.page = 1;
        this.getReport();
        this.getReportTotals();
    }

    /**
     * Stock-group selection changed — refetch the report from page 1.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    public onStockGroupChange(): void {
        this.page = 1;
        this.getReport();
        this.getReportTotals();
    }

    /**
     * Reveal the inline search input for the given column header.
     * @param fieldName Column identifier (currently only `'stockName'`).
     * @returns void
     * @memberof StockAgingReportComponent
     */
    public toggleSearch(fieldName: string): void {
        if (fieldName === 'stockName') {
            this.showStockNameSearchInput = true;
            this.refreshLayoutCaches();
        }
    }

    /**
     * Collapse a column search input on outside-click when no active term is present.
     * @param event Original DOM event.
     * @param element Container element used for the child check.
     * @param searchedFieldName Column identifier the input belongs to.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    public handleClickOutside(event: any, element: any, searchedFieldName: string): void {
        if (searchedFieldName === 'stockName') {
            if (this.searchStockName?.value) {
                return;
            }
            if (this.generalService.childOf(event?.target, element)) {
                return;
            }
            this.showStockNameSearchInput = false;
            this.refreshLayoutCaches();
        }
    }

    /**
     * True when the multi-select has real values (not empty and not All).
     * @param selected Current control value.
     * @returns boolean
     * @memberof StockAgingReportComponent
     */
    private hasSpecificSelection(selected: string[]): boolean {
        return !!selected?.length && !isSelectedAllOption(selected);
    }

    /**
     * Unique names to send to the API. All is sent as an empty array (same as no filter).
     * @param selected Current control value.
     * @returns The unique names, or `[]` when All / nothing is selected.
     * @memberof StockAgingReportComponent
     */
    private getSelectedUniqueNames(selected: string[]): string[] {
        return this.hasSpecificSelection(selected) ? selected.filter(Boolean) : [];
    }

    /**
     * Build the filter payload shared by the report, totals and detail APIs.
     * @param includeSearchText Whether the item-name search term is part of the payload.
     * @returns The request payload.
     * @memberof StockAgingReportComponent
     */
    private buildFilterPayload(includeSearchText: boolean = true): any {
        const payload: any = {
            branchUniqueNames: (this.isCompany && this.allBranches?.length > 1)
                ? this.getSelectedUniqueNames(this.selectedBranch)
                : [this.generalService.currentBranchUniqueName],
            warehouseUniqueNames: this.getSelectedUniqueNames(this.selectedWarehouse),
            stockGroupUniqueNames: this.getSelectedUniqueNames(this.selectedStockGroup),
            categoryUniqueNames: [this.selectedStockCategory]
        };
        if (includeSearchText) {
            payload.searchText = this.searchText;
        }
        if (this.asOnDateControl.value) {
            payload.asOnDate = dayjs(this.asOnDateControl.value).format(GIDDH_DATE_FORMAT);
        }
        return payload;
    }

    /**
     * Fetch the stock aging report with current filters, sort and pagination.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    private getReport(): void {
        this.isLoading = true;
        this.collapseStockDetails();
        const payload: any = this.buildFilterPayload();
        if (this.bucketSort) {
            payload.sortBy = this.bucketSort.sortBy;
            payload.sort = this.bucketSort.sort;
            payload.interval = this.bucketSort.interval;
        }
        this.inventoryService.getStockAgingReport(payload, this.page, this.count)
            .pipe(takeUntil(this.destroyed$))
            .subscribe(response => {
                this.isLoading = false;
                this.isFirstLoad = false;
                // API may return either a BaseResponse-wrapped body ({status, body})
                // or raw payload (dev endpoint). Support both.
                const apiResponse: any = response as any;
                const responseBody = apiResponse?.body ?? apiResponse;
                const isSuccess = !apiResponse?.status || apiResponse?.status === "success";
                if (isSuccess && responseBody && (responseBody.totals || responseBody.items)) {
                    this.reportData = responseBody;
                    const buckets = this.reportData?.totals?.buckets;
                    if (Array.isArray(buckets) && buckets.length && !this.bucketRangesOverridden) {
                        this.setBucketRanges(buckets.map(bucket => bucket.range));
                    }
                    this.totalItems = this.reportData?.items?.totalItems ?? 0;
                    this.page = this.reportData?.items?.page ?? this.page;
                    this.pendingWidthSync = true;
                } else {
                    this.reportData = null;
                    this.toaster.showSnackBar("error", apiResponse?.message);
                }
                this.cdr.detectChanges();
            }, () => {
                this.isLoading = false;
                this.isFirstLoad = false;
            });
    }

    /**
     * Fetch the stock aging report totals (summary cards) with current filters.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    private getReportTotals(): void {
        const payload: any = this.buildFilterPayload();
        this.inventoryService.getStockAgingReportTotals(payload)
            .pipe(takeUntil(this.destroyed$))
            .subscribe(response => {
                const apiResponse: any = response as any;
                const responseBody = apiResponse?.body ?? apiResponse;
                const isSuccess = !apiResponse?.status || apiResponse?.status === "success";
                if (isSuccess && responseBody) {
                    this.reportTotals = responseBody?.totals || responseBody;
                    const buckets = this.reportTotals?.buckets;
                    if (Array.isArray(buckets) && buckets.length && !this.bucketRangesOverridden) {
                        this.setBucketRanges(buckets.map(bucket => bucket.range));
                    }
                }
                this.cdr.detectChanges();
            });
    }

    /**
     * Expand the clicked stock and load its variants, or collapse it when already open.
     * @param item Report row the user clicked.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    public toggleStockDetails(item: StockAgingRow): void {
        if (!item?.hasVariants) {
            return;
        }
        const stockCode = this.getStockCode(item);
        if (!stockCode || this.expandedStockCode === stockCode) {
            this.collapseStockDetails();
            return;
        }
        this.expandedStockCode = stockCode;
        this.variantRows = [];
        this.variantTotals = null;
        this.variantPage = 1;
        this.variantTotalPages = 0;
        this.loadStockVariants();
        this.refreshDetailRows();
    }

    /**
     * True when the given row is the one with its variants expanded.
     * @param item Report row to test.
     * @returns boolean
     * @memberof StockAgingReportComponent
     */
    public isStockExpanded(item: StockAgingRow): boolean {
        if (!item?.hasVariants) {
            return false;
        }
        const stockCode = this.getStockCode(item);
        return !!stockCode && this.expandedStockCode === stockCode;
    }

    /**
     * Close the expanded variant list and drop its loaded pages.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    public collapseStockDetails(): void {
        this.expandedStockCode = null;
        this.variantRows = [];
        this.variantTotals = null;
        this.variantPage = 1;
        this.variantTotalPages = 0;
        this.refreshDetailRows();
    }

    /**
     * Re-evaluate mat-row `when` predicates after expand/collapse state changes.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    private refreshDetailRows(): void {
        this.stockAgingTable?.renderRows();
        this.pendingWidthSync = true;
        this.cdr.detectChanges();
    }

    /**
     * Recopy parent column widths after the table has painted (expand, data load, resize).
     * @returns void
     * @memberof StockAgingReportComponent
     */
    public ngAfterViewChecked(): void {
        if (!this.pendingWidthSync) {
            return;
        }
        this.pendingWidthSync = false;
        this.syncNestedColumnWidths();
    }

    /**
     * Recopy parent column widths when the window size changes.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    @HostListener('window:resize')
    public onWindowResize(): void {
        this.pendingWidthSync = true;
    }

    /**
     * Read the first parent data row's cell widths and store them for the expand table.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    private syncNestedColumnWidths(): void {
        const table = this.stockAgingTableEl?.nativeElement;
        if (!table) {
            return;
        }
        const dataRow = table.querySelector('tr.mat-mdc-row:not(.sar-detail-row)');
        if (!dataRow) {
            return;
        }
        const cells = Array.from(dataRow.querySelectorAll(':scope > td.mat-mdc-cell')) as HTMLElement[];
        if (!cells.length) {
            return;
        }
        // Use the visual left/right edges so shared parent borders are not counted twice.
        const tableLeft = table.getBoundingClientRect().left;
        const edges = cells.map((cell) => cell.getBoundingClientRect().left - tableLeft);
        edges.push(cells[cells.length - 1].getBoundingClientRect().right - tableLeft);
        const widths = [];
        for (let edgeIndex = 0; edgeIndex < edges.length - 1; edgeIndex++) {
            widths.push(Math.round(edges[edgeIndex + 1] - edges[edgeIndex]));
        }
        const changed = widths.length !== this.nestedColWidths.length
            || widths.some((width, index) => width !== this.nestedColWidths[index]);
        if (changed) {
            this.nestedColWidths = widths;
            this.cdr.detectChanges();
        }
    }

    /**
     * Load the next variants page once the list is scrolled near its bottom.
     * @param event Scroll event of the variant list container.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    public onVariantScroll(event: Event): void {
        const element = event?.target as HTMLElement;
        if (!element || this.isVariantLoading || !this.variantTotalPages || this.variantPage >= this.variantTotalPages) {
            return;
        }
        const reachedBottom = (element.scrollTop + element.clientHeight) >= (element.scrollHeight - this.detailScrollThreshold);
        if (reachedBottom) {
            this.loadStockVariants(this.variantPage + 1);
        }
    }

    /**
     * Fetch a variants page of the expanded stock and append the rows on success.
     * @param page 1-based page to request; defaults to the last successful page.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    private loadStockVariants(page: number = this.variantPage): void {
        const stockCode = this.expandedStockCode;
        if (!stockCode || this.isVariantLoading) {
            return;
        }
        this.isVariantLoading = true;
        this.inventoryService.getStockAgingReportVariants(stockCode, this.buildFilterPayload(), page, this.variantCount)
            .pipe(takeUntil(this.destroyed$))
            .subscribe(response => {
                this.isVariantLoading = false;
                if (this.expandedStockCode !== stockCode) {
                    this.cdr.detectChanges();
                    return;
                }
                const apiResponse: any = response as any;
                const responseBody = apiResponse?.body ?? apiResponse;
                const isSuccess = !apiResponse?.status || apiResponse?.status === "success";
                if (isSuccess && responseBody) {
                    this.variantTotals = responseBody?.totals ?? null;
                    this.variantRows = [...this.variantRows, ...(responseBody?.items?.results ?? [])];
                    this.variantTotalPages = responseBody?.items?.totalPages ?? 0;
                    this.variantPage = responseBody?.items?.page ?? page;
                } else {
                    this.toaster.showSnackBar("error", apiResponse?.message);
                }
                this.cdr.detectChanges();
            }, () => {
                this.isVariantLoading = false;
                this.cdr.detectChanges();
            });
    }

    /**
     * Open the transaction-details aside for a stock row, or a variant row when `variant` is passed.
     * @param item Parent stock row.
     * @param variant Variant row when the click came from the expand table.
     * @param intervalIndex 0-based bucket index when the click came from a Qty/Value cell.
     * @param amount Clicked qty/value; aside is not opened when this is zero.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    public openDetailsAside(item: StockAgingRow, variant?: StockAgingVariantRow | null, intervalIndex?: number | null, amount?: number | string | null): void {
        if (!Number(amount)) {
            return;
        }
        const stockCode = this.getStockCode(item);
        if (!stockCode) {
            return;
        }
        this.asideStockCode = stockCode;
        this.asideVariantUniqueName = variant?.variantUniqueName ?? '';
        this.asideInterval = intervalIndex != null ? (this.intervalOrdinals[intervalIndex] ?? '') : '';
        this.detailData = null;
        this.detailTransactions = [];
        this.detailPage = 1;
        this.detailTotalPages = 0;
        if (!this.stockDetailsAsideRef && this.stockDetailsAside) {
            this.stockDetailsAsideRef = this.dialog.open(this.stockDetailsAside, {
                ...ASIDE_PANE_CONFIG,
                width: '80vw',
                maxWidth: '80vw',
                panelClass: 'sar-details-aside',
            });
            this.stockDetailsAsideRef.afterClosed().pipe(takeUntil(this.destroyed$)).subscribe(() => {
                this.stockDetailsAsideRef = undefined;
                this.asideStockCode = '';
                this.asideVariantUniqueName = '';
                this.asideInterval = '';
                this.detailData = null;
                this.detailTransactions = [];
            });
        }
        this.loadStockDetails();
    }

    /**
     * Load the next details page once the aside list is scrolled near its bottom.
     * @param event Scroll event of the aside list container.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    public onDetailScroll(event: Event): void {
        const element = event?.target as HTMLElement;
        if (!element || this.isDetailLoading || !this.detailTotalPages || this.detailPage >= this.detailTotalPages) {
            return;
        }
        const reachedBottom = (element.scrollTop + element.clientHeight) >= (element.scrollHeight - this.detailScrollThreshold);
        if (reachedBottom) {
            this.loadStockDetails(this.detailPage + 1);
        }
    }

    /**
     * After a details page is rendered, keep fetching while the aside list still does not overflow.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    private queueDetailScrollCheck(): void {
        setTimeout(() => this.loadMoreDetailsIfNeeded(), 0);
    }

    /**
     * Fetch the next details page when the aside scroll area has no overflow yet.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    private loadMoreDetailsIfNeeded(): void {
        const element = this.detailScrollRef?.nativeElement;
        if (!element || this.isDetailLoading || !this.detailTotalPages || this.detailPage >= this.detailTotalPages) {
            return;
        }
        const canScroll = element.scrollHeight > (element.clientHeight + 1);
        if (!canScroll) {
            this.loadStockDetails(this.detailPage + 1);
        }
    }

    /**
     * Fetch a details page of the aside's transactions and append them on success.
     * @param page 1-based page to request; defaults to the last successful page.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    private loadStockDetails(page: number = this.detailPage): void {
        const stockCode = this.asideStockCode;
        if (!stockCode || this.isDetailLoading) {
            return;
        }
        this.isDetailLoading = true;
        const payload: any = this.buildFilterPayload();
        if (this.asideVariantUniqueName) {
            payload.variantUniqueName = this.asideVariantUniqueName;
        }
        if (this.asideInterval) {
            payload.interval = this.asideInterval;
        }
        this.inventoryService.getStockAgingReportDetails(stockCode, payload, page, this.detailCount)
            .pipe(takeUntil(this.destroyed$))
            .subscribe(response => {
                this.isDetailLoading = false;
                if (this.asideStockCode !== stockCode) {
                    this.cdr.detectChanges();
                    return;
                }
                const apiResponse: any = response as any;
                const responseBody = apiResponse?.body ?? apiResponse;
                const isSuccess = !apiResponse?.status || apiResponse?.status === "success";
                if (isSuccess && responseBody) {
                    this.detailData = responseBody;
                    this.detailTransactions = [...this.detailTransactions, ...(responseBody?.transactions?.results ?? [])];
                    this.detailTotalPages = responseBody?.transactions?.totalPages ?? 0;
                    this.detailPage = responseBody?.transactions?.page ?? page;
                    this.queueDetailScrollCheck();
                } else {
                    this.toaster.showSnackBar("error", apiResponse?.message);
                }
                this.cdr.detectChanges();
            }, () => {
                this.isDetailLoading = false;
                this.cdr.detectChanges();
            });
    }

    /**
     * True when the aside transaction row has a known voucher type and can be opened.
     * @param transaction Aside transaction row.
     * @returns Whether the row should look and behave as a link.
     * @memberof StockAgingReportComponent
     */
    public isTransactionClickable(transaction: StockAgingTransaction): boolean {
        return !!this.getTransactionRedirectUrl(transaction);
    }

    /**
     * Open the page that matches the transaction voucher type in a new tab.
     * @param transaction Aside transaction row.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    public openTransaction(transaction: StockAgingTransaction): void {
        const url = this.getTransactionRedirectUrl(transaction);
        if (!url) {
            return;
        }
        window.open(url, '_blank');
    }

    /**
     * Build the redirect URL for a transaction, or `null` when the type is unknown.
     * @param transaction Aside transaction row.
     * @returns The in-app URL, or `null` when the row must stay non-clickable.
     * @memberof StockAgingReportComponent
     */
    private getTransactionRedirectUrl(transaction: StockAgingTransaction): string | null {
        const voucherType = transaction?.purchaseInvoice;
        if (!voucherType) {
            return null;
        }
        const editRoute = this.transactionEditRoutes[voucherType];
        if (editRoute) {
            const uniqueName = transaction?.purchaseInvoiceUniqueName;
            return uniqueName ? `${editRoute}/${uniqueName}` : null;
        }
        const listRoute = this.transactionListRoutes[voucherType];
        if (listRoute) {
            return listRoute;
        }
        const voucherPath = this.voucherPreviewPaths[voucherType];
        const uniqueName = transaction?.purchaseInvoiceUniqueName;
        if (!voucherPath || !transaction.isVoucher || !uniqueName) {
            return null;
        }
        const date = transaction?.purchaseDate;
        let url = `/pages/vouchers/view/${voucherPath}/${uniqueName}?page=1&count=${PAGINATION_LIMIT}&search=${uniqueName}`;
        if (date) {
            url += `&from=${date}&to=${date}`;
        }
        return url;
    }

    /**
     * Colour class for an age-bucket badge so it matches its summary card.
     * @param range Bucket label carried by the transaction.
     * @returns The badge class, or an empty string for an unknown bucket.
     * @memberof StockAgingReportComponent
     */
    public getAgeBucketClass(range: string): string {
        // Matched against the buckets of the detail response, whose labels are the
        // ones carried by its transactions; the header labels can differ by a day
        // when the ranges were edited locally.
        const ranges = this.detailData?.bucketSummary?.length
            ? this.detailData.bucketSummary.map(bucket => bucket.range)
            : this.bucketRanges;
        const index = ranges?.indexOf(range) ?? -1;
        return index > -1 ? (this.bucketBadgeClasses[index] ?? '') : '';
    }

    /**
     * Resolve the stock identifier used by the detail API for a report row.
     * @param item Report row.
     * @returns The stock unique name, or an empty string when unavailable.
     * @memberof StockAgingReportComponent
     */
    private getStockCode(item: StockAgingRow): string {
        return item?.stockUniqueName ?? '';
    }

    /**
     * Return the bucket at the given position (client/API label mismatch-safe).
     * @param buckets Buckets array from a row or totals.
     * @param index Zero-based bucket position.
     * @returns The bucket at `index`, or a zeroed placeholder.
     * @memberof StockAgingReportComponent
     */
    public getBucket(buckets: any[], index: number): any {
        if (!Array.isArray(buckets)) {
            return { quantity: 0, value: 0 };
        }
        return buckets[index] ?? { quantity: 0, value: 0 };
    }

    /**
     * Handle a paginator event (page change or page-size change) and refetch.
     * @param event Material paginator event.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    public handlePageEvent(event: PageEvent): void {
        this.page = this.count !== event.pageSize ? 1 : event.pageIndex + 1;
        this.count = event.pageSize;
        this.getReport();
    }

    /**
     * Build a safe column id from a bucket range label (e.g. `"0-30 days" -> "b_0_30_days_qty"`).
     * @param range Bucket range label.
     * @param suffix Which sub-column: `'qty'` or `'value'`.
     * @returns The generated column id.
     * @memberof StockAgingReportComponent
     */
    private bucketColId(range: string, suffix: 'qty' | 'value'): string {
        return 'b_' + (range || '').replace(/[^a-z0-9]+/gi, '_').toLowerCase() + '_' + suffix;
    }

    /**
     * Recompute derived layout caches (bucket cols, displayed cols, colspan, widths).
     * @returns void
     * @memberof StockAgingReportComponent
     */
    private refreshLayoutCaches(): void {
        this.bucketCols = this.bucketRanges.map(range => ({
            range,
            qtyColId: this.bucketColId(range, 'qty'),
            valueColId: this.bucketColId(range, 'value'),
        }));
        const leafBucketIds: string[] = [];
        for (const bucketColumn of this.bucketCols) {
            leafBucketIds.push(bucketColumn.qtyColId, bucketColumn.valueColId);
        }
        this.displayedColumns = [
            ...this.baseColumns.map(column => column.colId),
            ...leafBucketIds,
            ...this.trailingColumns.map(column => column.colId)
        ];
        this.totalColspan = this.baseColumns.length + this.trailingColumns.length + this.bucketCols.length * 2;

        const flexibleColumnCount = this.totalColspan - 3;
        const fixedColumnsWidth = this.srColWidthPct * 2 + this.stockNameSearchExtraPct;
        const baseColumnWidth = flexibleColumnCount > 0 ? (100 - fixedColumnsWidth) / flexibleColumnCount : 0;
        this.columnWidths = {
            sr: this.srColWidthPct,
            base: baseColumnWidth,
            stockName: this.stockNameSearchExtraPct,
            uom: this.srColWidthPct,
            bucketGroup: baseColumnWidth * 2,
        };
    }

    /**
     * Update `bucketRanges` and refresh derived layout caches atomically.
     * @param ranges New bucket range labels.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    private setBucketRanges(ranges: string[]): void {
        this.bucketRanges = ranges;
        this.refreshLayoutCaches();
    }

    /**
     * Prepare the age-range popup for the clicked bucket before the mat-menu opens.
     * @param intervalIndex 0-based bucket index (0 = first ... 3 = last).
     * @param trigger Menu trigger used to close the popup later.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    public openAgingEditor(intervalIndex: number, trigger?: MatMenuTrigger): void {
        this.activeInterval = intervalIndex;
        this.activeAgingMenuTrigger = trigger ?? null;
    }

    /**
     * Apply new aging boundaries locally, refetch the report and close the popup.
     * @param updatedOptions Updated aging boundaries from the editor.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    public onAgingRangeSave(updatedOptions: AgeRangeEditorOptions): void {
        this.agingOptions = { ...updatedOptions };
        this.setBucketRanges(this.buildBucketRangesFromOptions(this.agingOptions));
        this.bucketRangesOverridden = true;
        // Persistence to the due-days-range endpoint is handled inside
        // <age-range-editor> via the [vendorCustomerType] input. We only
        // refetch the report so the backend can regroup by the new buckets.
        this.getReport();
        this.getReportTotals();
        this.onAgingRangeClose();
    }

    /**
     * Close the age-range popup and clear the store-side open state.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    public onAgingRangeClose(): void {
        this.store.dispatch(this.agingReportActions.CloseDueRange());
        this.activeAgingMenuTrigger?.closeMenu();
        this.activeAgingMenuTrigger = null;
    }

    /**
     * Build the four bucket-range labels from numeric boundaries (pure helper).
     * @param options Numeric boundaries `{ fourth, fifth, sixth }`.
     * @returns The four bucket labels in ascending order.
     * @memberof StockAgingReportComponent
     */
    private buildBucketRangesFromOptions(options: AgeRangeEditorOptions): string[] {
        const firstRangeEnd = Number(options.fourth) || 0;
        const secondRangeEnd = Number(options.fifth) || 0;
        const thirdRangeEnd = Number(options.sixth) || 0;
        return [
            `0-${firstRangeEnd} days`,
            `${firstRangeEnd + 1}-${secondRangeEnd} days`,
            `${secondRangeEnd + 1}-${thirdRangeEnd} days`,
            `${thirdRangeEnd + 1}+ days`,
        ];
    }

    /**
     * Angular lifecycle: complete the teardown subject to unsubscribe all streams.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    public ngOnDestroy(): void {
        this.stockDetailsAsideRef?.close();
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
