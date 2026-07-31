import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { MatMenuTrigger } from "@angular/material/menu";
import { AgeRangeEditorOptions } from "../../../theme/age-range-editor/age-range-editor.component";
import { Observable, ReplaySubject } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
import { Store, select } from "@ngrx/store";
import { AppState } from "../../../store";
import { AgingReportActions } from "../../../actions/aging-report.actions";
import { AgingDropDownoptions } from "../../../models/api-models/Contact";
import { PageEvent } from "@angular/material/paginator";
import { FormControl } from "@angular/forms";
import { cloneDeep } from "../../../lodash-optimized";
import * as dayjs from "dayjs";
import { GIDDH_DATE_FORMAT } from "../../../shared/helpers/defaultDateFormat";
import { InventoryService } from "../../../services/inventory.service";
import { ToasterService } from "../../../services/toaster.service";
import { GeneralService } from "../../../services/general.service";
import { ActivatedRoute } from "@angular/router";
import { OrganizationType } from "../../../models/user-login-state";
import { IGroupsWithStocksHierarchyMinItem } from "../../../models/interfaces/groups-with-stocks.interface";
import { IOption, PAGE_SIZE_OPTIONS, PAGINATION_LIMIT } from "../../../app.constant";
import {
    BucketColumn,
    BucketSortState,
    ColumnWidths,
    StockAgingReportBody,
} from "../../../models/interfaces/stock-aging-report.interface";

/** Stock Aging Report: aging buckets + per-stock breakup with summary cards and a grouped-header table. */
@Component({
    selector: "stock-aging-report",
    templateUrl: "./stock-aging-report.component.html",
    styleUrls: ["./stock-aging-report.component.scss"],
    standalone: false
})
export class StockAgingReportComponent implements OnInit, OnDestroy {
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
    /** Locale strings for the age-range editor popup titles. */
    public agingEditorLocale: any = {
        first_interval: 'First Interval',
        second_interval: 'Second Interval',
        third_interval: 'Third Interval',
        last_interval: 'Last Interval',
    };
    /** True once bucket ranges were overridden locally (user edit or store hydrate); disables API overwrite. */
    private bucketRangesOverridden: boolean = false;
    /** `vendorCustomerType` value sent to the shared due-days-range API for the inventory context. */
    public readonly INVENTORY_AGING_TYPE: string = 'inventory';
    /** Store observable of the persisted aging boundaries. */
    public agingDropDownoptions$: Observable<AgingDropDownoptions>;
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
    /** Fixed leaf column definitions rendered before the bucket group columns. */
    public readonly baseColumns = [
        { colId: 'sr',          label: '#',          isLeaf: true, align: 'center' as const },
        { colId: 'stockName',   label: 'Item Name',   isLeaf: true, align: 'left'   as const },
        { colId: 'uom',         label: 'UOM',         isLeaf: true, align: 'left'   as const },
        { colId: 'totalQty',    label: 'Total Qty',   isLeaf: true, align: 'right'  as const },
        { colId: 'totalValue',  label: 'Total Value', isLeaf: true, align: 'right'  as const }
    ];

    /** Selected branch unique names. */
    public selectedBranch: string[] = [];
    /** Selected warehouse unique names. */
    public selectedWarehouse: string[] = [];
    /** Currently active stock category (from route param). */
    public selectedStockCategory: string = '';
    /** Selected stock group unique names (multi-select). */
    public selectedStockGroup: string[] = [];
    /** Stock groups filtered by the dropdown search. */
    public filteredStockGroups: IOption[] = [];
    /** Full branches list from API. */
    public allBranches: any[] = [];
    /** Branches filtered by the dropdown search. */
    public branches: any[] = [];
    /** Warehouses filtered by the dropdown search. */
    public warehouses: any[] = [];
    /** Warehouses source list (before dropdown search). */
    public currentWarehouses: any[] = [];
    /** Full stock groups list. */
    public stockGroups: IOption[] = [];
    /** True when the current org is a company (branch dropdown visible). */
    public isCompany: boolean = false;
    /** Search form control for the branch dropdown. */
    public branchesDropdown: FormControl = new FormControl();
    /** Search form control for the warehouse dropdown. */
    public warehousesDropdown: FormControl = new FormControl();
    /** Search form control for the stock-group dropdown. */
    public stockGroupsDropdown: FormControl = new FormControl();
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
    /** Fixed percentage width for the Sr column. */
    public readonly srColWidthPct: number = 4;
    /** Extra % width added to Item Name when the inline search is open (donated by UOM). */
    public readonly stockNameSearchExtraPct: number = 10;
    /** Minimum % width the UOM column must retain when donating space. */
    private readonly uomMinWidthPct: number = 3;

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
    /** Active company profile */
    public activeCompanyProfile: any;

    /**
     * Cycle bucket-column sort (asc → desc → off) and refetch.
     * @param intervalIndex 0-based bucket index.
     * @param sortBy Which sub-column: `'qty'` or `'value'`.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    public toggleBucketSort(intervalIndex: number, sortBy: 'qty' | 'value'): void {
        const interval = this.intervalOrdinals[intervalIndex] ?? '';
        const same = this.bucketSort
            && this.bucketSort.intervalIndex === intervalIndex
            && this.bucketSort.sortBy === sortBy;
        if (!same) {
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
     * @returns boolean
     * @memberof StockAgingReportComponent
     */
    public get hasActiveFilters(): boolean {
        return (this.selectedBranch?.length > 0)
            || (this.selectedWarehouse?.length > 0)
            || (this.selectedStockGroup?.length > 0)
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
        this.searchText = '';
        this.searchStockName.setValue('', { emitEvent: false });
        this.showStockNameSearchInput = false;
        this.refreshLayoutCaches();
        this.bucketSort = null;
        this.page = 1;
        this.getReport();
        this.getReportTotals();
    }

    constructor(
        private cdr: ChangeDetectorRef,
        private inventoryService: InventoryService,
        private toaster: ToasterService,
        private generalService: GeneralService,
        private store: Store<AppState>,
        private agingReportActions: AgingReportActions,
        private route: ActivatedRoute,
    ) {
        this.agingDropDownoptions$ = this.store.pipe(select(s => s.agingreport.agingDropDownoptions), takeUntil(this.destroyed$));
    }

    /**
     * Angular lifecycle: wires up route params, dropdown searches, date-change refetch and store hydration.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    public ngOnInit(): void {
        this.refreshLayoutCaches();
        this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch;
        this.loadBranchesAndWarehouses();
        this.getProfile();
        // Route param `:category` drives the stock category filter for this
        // report (e.g. product, service, fixedassets, all).
        // Angular reuses this component when only `:category` changes, so
        // this subscription is the single source of truth for (re)loading
        // category-scoped data — it fires on initial navigation AND on any
        // subsequent category change.
        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            const category = params['category']?.toUpperCase() || '';
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
            this.getReport();
            this.getReportTotals();
        });

        // Local search filtering for the branch dropdown
        this.branchesDropdown.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(search => {
            const clone = cloneDeep(this.allBranches);
            this.branches = search
                ? clone?.filter((b: any) => (b?.name?.toLowerCase()?.indexOf(search?.toLowerCase()) > -1))
                : clone;
        });

        // Local search filtering for the warehouse dropdown
        this.warehousesDropdown.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(search => {
            const clone = cloneDeep(this.currentWarehouses);
            this.warehouses = search
                ? clone?.filter((w: any) => (w?.name?.toLowerCase()?.indexOf(search?.toLowerCase()) > -1))
                : clone;
        });

        // Local search filtering for the stock group dropdown
        this.stockGroupsDropdown.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(search => {
            const clone = cloneDeep(this.stockGroups);
            this.filteredStockGroups = search
                ? clone?.filter((g: IOption) => (g?.label?.toLowerCase()?.indexOf(search?.toLowerCase()) > -1))
                : clone;
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
        this.agingDropDownoptions$.pipe(takeUntil(this.destroyed$)).subscribe(opts => {
            if (opts && (opts.fourth || opts.fifth || opts.sixth)) {
                this.agingOptions = cloneDeep(opts);
                this.setBucketRanges(this.buildBucketRangesFromOptions(this.agingOptions));
                this.bucketRangesOverridden = true;
                this.cdr.detectChanges();
            }
        });
        // Note: `getReport()` is invoked from the `route.params` subscription
        // above so it fires for the initial category and on every change.
    }


    /**
     * Gets profile information
     *
     * @private
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
    public loadBranchesAndWarehouses(): void {
        this.inventoryService.getLinkedStocks().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.body) {
                this.allBranches = response.body?.results?.filter((branch: any) => branch?.isCompany !== true) ?? [];
                this.branches = [...this.allBranches];
            }
            this.recomputeWarehouses();
            this.cdr.detectChanges();
        });
    }

    /**
     * Load the flat stock-groups list for the dropdown (scoped by `selectedStockCategory`).
     * @returns void
     * @memberof StockAgingReportComponent
     */
    public loadStockGroups(): void {
        this.inventoryService.GetGroupsWithStocksFlatten(this.selectedStockCategory).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === 'success') {
                const groups: IOption[] = [];
                this.arrangeStockGroups(response.body?.results ?? [], groups);
                this.stockGroups = groups;
                this.filteredStockGroups = cloneDeep(groups);
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
     * Recompute `warehouses` from `allBranches` given the current branch selection.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    private recomputeWarehouses(): void {
        const branches = this.allBranches ?? [];
        if (this.selectedBranch.length) {
            this.warehouses = branches
                .filter((b: any) => this.selectedBranch.includes(b?.uniqueName))
                .flatMap((b: any) => b?.warehouses ?? []);
        } else if (this.isCompany) {
            this.warehouses = branches.flatMap((b: any) => b?.warehouses ?? []);
        } else {
            const current = branches.find((b: any) => b?.uniqueName === this.generalService.currentBranchUniqueName);
            this.warehouses = current?.warehouses ?? [];
        }
        this.currentWarehouses = this.warehouses;
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
     * Fetch the stock aging report with current filters, sort and pagination.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    public getReport(): void {
        this.isLoading = true;
        const payload: any = {
            branchUniqueNames: (this.isCompany && this.allBranches?.length > 1) ? this.selectedBranch : [this.generalService.currentBranchUniqueName],
            warehouseUniqueNames: this.selectedWarehouse,
            stockGroupUniqueNames: this.selectedStockGroup,
            searchText: this.searchText,
            categoryUniqueNames: [this.selectedStockCategory]
        };
        if (this.asOnDateControl.value) {
            payload.asOnDate = dayjs(this.asOnDateControl.value).format(GIDDH_DATE_FORMAT);
        }
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
                const raw: any = response as any;
                const body = raw?.body ?? raw;
                const isSuccess = !raw?.status || raw?.status === "success";
                if (isSuccess && body && (body.totals || body.items)) {
                    this.reportData = body;
                    const buckets = this.reportData?.totals?.buckets;
                    if (Array.isArray(buckets) && buckets.length && !this.bucketRangesOverridden) {
                        this.setBucketRanges(buckets.map(b => b.range));
                    }
                    this.totalItems = this.reportData?.items?.totalItems ?? 0;
                    this.page = this.reportData?.items?.page ?? this.page;
                } else {
                    this.reportData = null;
                    this.toaster.showSnackBar("error", raw?.message);
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
    public getReportTotals(): void {
        const payload: any = {
            branchUniqueNames: (this.isCompany && this.allBranches?.length > 1) ? this.selectedBranch : [this.generalService.currentBranchUniqueName],
            warehouseUniqueNames: this.selectedWarehouse,
            stockGroupUniqueNames: this.selectedStockGroup,
            categoryUniqueNames: [this.selectedStockCategory]
        };
        if (this.asOnDateControl.value) {
            payload.asOnDate = dayjs(this.asOnDateControl.value).format(GIDDH_DATE_FORMAT);
        }
        this.inventoryService.getStockAgingReportTotals(payload)
            .pipe(takeUntil(this.destroyed$))
            .subscribe(response => {
                const raw: any = response as any;
                const body = raw?.body ?? raw;
                const isSuccess = !raw?.status || raw?.status === "success";
                if (isSuccess && body) {
                    this.reportTotals = body?.totals || body;
                    const buckets = this.reportTotals?.buckets;
                    if (Array.isArray(buckets) && buckets.length && !this.bucketRangesOverridden) {
                        this.setBucketRanges(buckets.map(b => b.range));
                    }
                }
                this.cdr.detectChanges();
            });
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
        for (const b of this.bucketCols) {
            leafBucketIds.push(b.qtyColId, b.valueColId);
        }
        this.displayedColumns = [...this.baseColumns.map(c => c.colId), ...leafBucketIds];
        this.totalColspan = this.baseColumns.length + this.bucketCols.length * 2;

        const nonSrCount = this.totalColspan - 1;
        const base = nonSrCount > 0 ? (100 - this.srColWidthPct) / nonSrCount : 0;
        const maxShift = Math.max(0, base - this.uomMinWidthPct);
        const shift = this.showStockNameSearchInput ? Math.min(this.stockNameSearchExtraPct, maxShift) : 0;
        this.columnWidths = {
            sr: this.srColWidthPct,
            base,
            stockName: base + shift,
            uom: base - shift,
            bucketGroup: base * 2,
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
     * @param next Updated aging boundaries from the editor.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    public onAgingRangeSave(next: AgeRangeEditorOptions): void {
        this.agingOptions = { ...next };
        this.setBucketRanges(this.buildBucketRangesFromOptions(this.agingOptions));
        this.bucketRangesOverridden = true;
        // Persistence to the due-days-range endpoint is handled inside
        // <age-range-editor> via the [vendorCustomerType] input. We only
        // refetch the report so the backend can regroup by the new buckets.
        this.getReport();
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
     * @param opts Numeric boundaries `{ fourth, fifth, sixth }`.
     * @returns The four bucket labels in ascending order.
     * @memberof StockAgingReportComponent
     */
    private buildBucketRangesFromOptions(opts: AgeRangeEditorOptions): string[] {
        const a = Number(opts.fourth) || 0;
        const b = Number(opts.fifth) || 0;
        const c = Number(opts.sixth) || 0;
        return [
            `0-${a} days`,
            `${a + 1}-${b} days`,
            `${b + 1}-${c} days`,
            `${c + 1}+ days`,
        ];
    }

    /**
     * Angular lifecycle: complete the teardown subject to unsubscribe all streams.
     * @returns void
     * @memberof StockAgingReportComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
