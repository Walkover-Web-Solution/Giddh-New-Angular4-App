import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { PAGE_SIZE_OPTIONS } from '../../../app.constant';
import { select, Store } from '@ngrx/store';
import { Observable, ReplaySubject, Subject, combineLatest } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { BalanceStockTransactionReportRequest, InventoryReportRequest, InventoryReportBalanceResponse, StockReportRequest, InventoryReportRequestExport } from '../../../models/api-models/Inventory';
import { InventoryService } from '../../../services/inventory.service';
import { ToasterService } from '../../../services/toaster.service';
import { AppState } from '../../../store';
import { ReportFiltersComponent } from '../report-filters/report-filters.component';
import { giddhRoundOff } from "../../../shared/helpers/helperFunctions";
import * as dayjs from "dayjs";
import { ActivatedRoute, Router } from '@angular/router';
import { INVENTORY_COMMON_COLUMNS, InventoryReportType, InventoryModuleName } from '../../inventory.enum';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { CommonActions } from '../../../actions/common.actions';
import { PAGINATION_LIMIT } from '../../../app.constant';
import { GeneralService } from '../../../services/general.service';
import { OrganizationType } from '../../../models/user-login-state';
import { ServiceConfig } from '../../../services/service.config';
import { InventoryComponentStore } from '../inventory.store';
import { Configuration } from '../../../app.constant';
import { environment } from '../../../../environments/environment.generated';
import { cloneDeep, filter, find, map } from '../../../lodash-optimized';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [InventoryComponentStore],
    standalone:false

})
export class ReportsComponent implements OnInit, OnDestroy {
    @ViewChild(ReportFiltersComponent, { read: ReportFiltersComponent, static: false }) public reportFiltersComponent: ReportFiltersComponent;
    /** Instance of sort header */
    @ViewChild(MatSort) sort: MatSort;
    /** Instance of cdk virtual scroller */
    @ViewChildren(CdkVirtualScrollViewport) virtualScroll: QueryList<CdkVirtualScrollViewport>;
    /** Emits the scroll to bottom event when pagination is required  */
    @Output() public scrollEnd: EventEmitter<void> = new EventEmitter();
    /* dayjs object */
    public dayjs = dayjs;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Stock Transactional Object */
    public stockReportRequest: InventoryReportRequest = new InventoryReportRequest();
    /** Stock Stock Export Table Data */
    public stockReportRequestExport: InventoryReportRequestExport = new InventoryReportRequestExport();
    /** Stock Transactional Object */
    public balanceStockReportRequest: BalanceStockTransactionReportRequest = new BalanceStockTransactionReportRequest();
    /** Stock Transactional Report Balance Response */
    public stockTransactionReportBalance: InventoryReportBalanceResponse;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if translations loaded */
    public translationLoaded: boolean = false;
    /* This will hold active company data */
    public activeCompany: any = {};
    /** Image path variable */
    public imgPath: string = '';
    /** This will store selected date range to use in api */
    public selectedDateRange: any;
    /** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /** Holds stock transaction report data */
    public dataSource = [];
    /** This will use for stock report displayed columns */
    public displayedColumns: any[] = [];
    /** This will use for stock report voucher types column check values */
    public customiseColumns = [];
    /** Hold From Date*/
    public toDate: string;
    /** Hold To Date*/
    public fromDate: string;
    /** True if show clear */
    public showClearFilter: boolean = false;
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** True if search account name */
    public showAccountSearchInput: boolean = false;
    /** True if data available */
    public isDataAvailable: boolean = null;
    /** This will use for round off value */
    public giddhRoundOff: any = giddhRoundOff;
    /** Decimal places from company settings */
    public giddhBalanceDecimalPlaces: number = 2;
    /** This will hold if today is selected in universal */
    public todaySelected: boolean = false;
    /** Holds from/to date */
    public fromToDate: any = {};
    /** Holds report type */
    public reportType: string = '';
    /** Holds report unique name */
    public reportUniqueName: string = '';
    /** Holds selected warehouse */
    public selectedWarehouse: string;
    /** Holds available page size options */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    /** Holds inventory type module  */
    public moduleType: string = '';
    /** Holds module name */
    public moduleName = '';
    /** True if initial load */
    private initialLoad: boolean = false;
    /** Holds filters in store */
    private storeFilters: any;
    /** Hold advance search modal response */
    public advanceSearchModalResponse: any = null;
    /** Hold current url */
    private currentUrl: string = "";
    /** Hold show content */
    public showContent: boolean = true;
    /** False if pull unitversal date  */
    public pullUniversalDate: boolean = true;
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    public isCompany: boolean;
    /** Observable to cancel api on reports api call */
    private cancelApi$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will use for stock report column check values */
    public newCustomFieldsColumns: any[] = [];
    /** Custom fields request */
    public customFieldsVariantRequest: any = {
        page: 0,
        count: 0,
        moduleUniqueName: 'variant'
    };
    /** Custom Fields list Observable */
    public customFieldsSuccess$: Observable<any> = this.inventoryStore.customFieldsSuccess$;
    /** Subject for filters changes */
    private filtersSubject$ = new Subject<any>();
    /** Subject for dynamic columns changes */
    private dynamicColumnsSubject$ = new Subject<any>();
    constructor(
        public route: ActivatedRoute,
        public router: Router,
        private changeDetection: ChangeDetectorRef,
        private inventoryService: InventoryService,
        private toaster: ToasterService,
        private generalService: GeneralService,
        private store: Store<AppState>,
        @Inject(ServiceConfig) private serviceConfig,
        private commonAction: CommonActions,
        private inventoryStore: InventoryComponentStore
    ) {
        this.store.pipe(select(state => state.settings.profile), takeUntil(this.destroyed$)).subscribe((profile) => {
            if (profile) {
                this.giddhBalanceDecimalPlaces = profile.balanceDecimalPlaces;
            }
        });

        this.currentUrl = this.router.url;

        this.store.pipe(select(state => state.session?.filters), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && !this.storeFilters?.length) {
                this.storeFilters = response;
                if (this.storeFilters[this.currentUrl]) {
                    this.initialLoad = true;
                    this.stockReportRequest = cloneDeep(this.storeFilters[this.currentUrl]?.stockReportRequest);
                    this.balanceStockReportRequest = cloneDeep(this.storeFilters[this.currentUrl]?.balanceStockReportRequest);
                    this.todaySelected = cloneDeep(this.storeFilters[this.currentUrl]?.todaySelected);
                    this.showClearFilter = cloneDeep(this.storeFilters[this.currentUrl]?.showClearFilter);
                    this.advanceSearchModalResponse = cloneDeep(this.storeFilters[this.currentUrl]?.advanceSearchModalResponse);

                    if (this.stockReportRequest?.from) {
                        this.fromDate = dayjs(this.stockReportRequest?.from, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                        this.toDate = dayjs(this.stockReportRequest?.to, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                        this.stockReportRequest.from = this.fromDate;
                        this.stockReportRequest.to = this.toDate;
                        this.balanceStockReportRequest.from = this.fromDate;
                        this.balanceStockReportRequest.to = this.toDate;
                        this.fromToDate = { from: this.fromDate, to: this.toDate };
                    }
                }
            } else {
                this.storeFilters = response;
            }
        });
    }

    /**
     * This hook will use  on component initialization
     *
     * @memberof ReportsComponent
     */
    public ngOnInit(): void {
        this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch;
        this.imgPath = Configuration.isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || environment.AppUrl) + environment.APP_FOLDER + 'assets/images/';
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompany = activeCompany;
            }
        });
        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            let lastReportType = this.reportType;
            this.currentUrl = this.router.url;
            this.reportUniqueName = response?.uniqueName;
            this.reportType = (response?.reportType)?.toUpperCase();
            if (this.reportType === InventoryReportType.stock || this.reportType === InventoryReportType.variant) {
                this.getCustomFields();
                this.customFieldsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    if (response) {
                        const results = response.map(result => {
                            return {
                                label: result.fieldName,
                                value: result.uniqueName,
                                checked: false,
                                type: result.fieldType
                            }
                        });
                        this.newCustomFieldsColumns = results;
                    }
                });
            }
            if (response?.type?.toUpperCase() === 'FIXEDASSETS') {
                this.moduleType = 'FIXED_ASSETS';
            } else {
                this.moduleType = response?.type?.toUpperCase();
            }
            if (this.storeFilters && this.storeFilters[this.currentUrl]) {
                this.showContent = false;
                this.changeDetection.detectChanges();

                this.stockReportRequest = new StockReportRequest();
                this.balanceStockReportRequest = new BalanceStockTransactionReportRequest();

                this.pullUniversalDate = false;
                this.initialLoad = true;
                this.stockReportRequest = cloneDeep(this.storeFilters[this.currentUrl]?.stockReportRequest);

                this.balanceStockReportRequest = cloneDeep(this.storeFilters[this.currentUrl]?.balanceStockReportRequest);
                this.todaySelected = cloneDeep(this.storeFilters[this.currentUrl]?.todaySelected);
                this.showClearFilter = cloneDeep(this.storeFilters[this.currentUrl]?.showClearFilter);
                this.advanceSearchModalResponse = cloneDeep(this.storeFilters[this.currentUrl]?.advanceSearchModalResponse);
                if (this.stockReportRequest?.from) {
                    this.fromDate = dayjs(this.stockReportRequest?.from, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                    this.toDate = dayjs(this.stockReportRequest?.to, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                    this.stockReportRequest.from = this.fromDate;
                    this.stockReportRequest.to = this.toDate;
                    this.balanceStockReportRequest.from = this.fromDate;
                    this.balanceStockReportRequest.to = this.toDate;
                    this.fromToDate = { from: this.fromDate, to: this.toDate };
                }
                if (!this.isCompany) {
                    this.stockReportRequest.branchUniqueNames = [this.generalService.currentBranchUniqueName];
                    this.balanceStockReportRequest.branchUniqueNames = [this.generalService.currentBranchUniqueName];
                }

                setTimeout(() => {
                    this.showContent = true;
                    this.changeDetection.detectChanges();
                }, 100);
            } else {
                if (!this.isCompany) {
                    this.stockReportRequest.branchUniqueNames = [this.generalService.currentBranchUniqueName];
                    this.balanceStockReportRequest.branchUniqueNames = [this.generalService.currentBranchUniqueName];
                }
                this.initialLoad = false;
                if (lastReportType) {
                    this.showContent = false;
                    this.changeDetection.detectChanges();
                    setTimeout(() => {
                        this.showContent = true;
                        this.changeDetection.detectChanges();
                    }, 100);
                }
            }

            this.customiseColumns = cloneDeep(INVENTORY_COMMON_COLUMNS);
            if (this.reportType === InventoryReportType.group) {
                this.customiseColumns.splice(0, 0, {
                    "value": "group_name",
                    "label": "Group Name",
                    "checked": true
                });
                this.moduleName = InventoryModuleName.group;
            }
            if (this.reportType === InventoryReportType.stock) {
                this.customiseColumns.splice(0, 0,
                    {
                        "value": "stock_name",
                        "label": "Stock Name",
                        "checked": true
                    },
                    {
                        "value": "group_name",
                        "label": "Group Name",
                        "checked": true
                    },
                    {
                        "value": "unit_name",
                        "label": "Unit",
                        "checked": true
                    }
                )
                this.moduleName = InventoryModuleName.stock;

            }
            if (this.reportType === InventoryReportType.variant) {
                this.customiseColumns.splice(0, 0,
                    {
                        "value": "variant_name",
                        "label": "Variant Name",
                        "checked": true
                    },
                    {
                        "value": "stock_name",
                        "label": "Stock Name",
                        "checked": true
                    },
                    {
                        "value": "group_name",
                        "label": "Group Name",
                        "checked": true
                    },
                    {
                        "value": "unit_name",
                        "label": "Unit",
                        "checked": true
                    }
                )
                this.moduleName = InventoryModuleName.variant;
            }
            if (lastReportType) {
                this.translationComplete(true);
            }
        });

        // Use combineLatest to ensure both data are processed when they emit at the same time
        combineLatest([this.filtersSubject$, this.dynamicColumnsSubject$]).pipe(
            debounceTime(300),
            takeUntil(this.destroyed$)
        ).subscribe(([filtersData, dynamicColumnsData]) => {
            // Only proceed if at least one event has actual data (not the initial null)
            if (!filtersData && !dynamicColumnsData) {
                return;
            }

            // Handle both events with their latest data
            if (filtersData) {
                this.handleFiltersChange(filtersData);
            }
            if (dynamicColumnsData) {
                this.handleDynamicColumnsChange(dynamicColumnsData);
            }
            setTimeout(() => {
                this.getReport(true);
            }, 100);
        });
    }

    /**
     * Handle filters change event
     *
     * @private
     * @param {*} event
     * @memberof ReportsComponent
     */
    private handleFiltersChange(event: any): void {
        if (!this.initialLoad) {
            if (!this.storeFilters) {
                this.storeFilters = [];
            }

            this.storeFilters[this.currentUrl] = event;
            this.store.dispatch(this.commonAction.setFilters(this.storeFilters));
            this.stockReportRequest = event?.stockReportRequest;
            this.stockReportRequestExport = event?.stockReportRequestExport;
            this.balanceStockReportRequest = event?.balanceStockReportRequest;
            this.todaySelected = event?.todaySelected;
            this.showClearFilter = event?.showClearFilter;
        } else {
            this.initialLoad = false;
        }
        this.pullUniversalDate = true;
    }

    /**
     * Handle dynamic columns change event
     *
     * @private
     * @param {*} event
     * @memberof ReportsComponent
     */
    private handleDynamicColumnsChange(event: any): void {
        if (this.moduleName === InventoryModuleName.stock || this.moduleName === InventoryModuleName.variant) {
            this.displayedColumns = event
                .filter(item => item?.checked)
                .map(item => item?.value);
        }
    }

    /**
     * This will be use for get custom fields
     *
     * @memberof ReportsComponent
     */
    public getCustomFields(): void {
        this.inventoryStore.getCustomFields(this.customFieldsVariantRequest);
    }

    /**
     * This will use for get stock report request obj
     *
     * @private
     * @return {*}  {*}
     * @memberof ReportsComponent
     */
    private getStockReportRequestObject(): any {
        let stockReportRequest = cloneDeep(this.stockReportRequest);
        stockReportRequest.stockGroups = undefined;
        stockReportRequest.stocks = undefined;
        stockReportRequest.variants = undefined;
        return stockReportRequest;
    }

    /**
     * This will use for get stock transactions report data
     *
     * @param {boolean} [apiCall=true]
     * @param {boolean} [type]
     * @return {*}  {void}
     * @memberof ReportsComponent
     */
    public getReport(fetchBalance: boolean = true): void {
        if (this.todaySelected) {
            this.stockReportRequest.from = '';
            this.stockReportRequest.to = '';
            this.balanceStockReportRequest.from = '';
            this.balanceStockReportRequest.to = '';
        }
        if (!this.reportType) {
            return;
        }
        this.cancelApi$.next(false);
        setTimeout(() => {
            this.cancelApi$ = new ReplaySubject(1);
            this.dataSource = [];
            this.isLoading = true;
            if (this.reportType === InventoryReportType.group) {
                let stockReportRequest = this.getStockReportRequestObject();
                let queryParams = {
                    from: stockReportRequest.from ?? '',
                    to: stockReportRequest.to ?? '',
                    count: stockReportRequest.count ?? PAGINATION_LIMIT,
                    page: stockReportRequest.page ?? 1,
                    sort: stockReportRequest.sort ?? '',
                    sortBy: stockReportRequest.sortBy ?? '',
                    stockGroupUniqueName: this.reportUniqueName ?? '',
                };

                stockReportRequest.from = undefined;
                stockReportRequest.to = undefined;
                stockReportRequest.count = undefined;
                stockReportRequest.page = undefined;
                stockReportRequest.sort = undefined;
                stockReportRequest.sortBy = undefined;
                stockReportRequest.totalItems = undefined;
                stockReportRequest.totalPages = undefined;
                stockReportRequest.inventoryType = this.moduleType;
                this.inventoryService.getGroupWiseReport(queryParams, stockReportRequest).pipe(takeUntil(this.cancelApi$)).subscribe(response => {
                    this.isLoading = false;
                    if (response && response.body && response.status === 'success') {
                        this.isDataAvailable = (response.body.results?.length) ? true : false;
                        this.dataSource = response.body.results;
                        this.stockReportRequest.page = response.body.page;
                        this.stockReportRequest.totalItems = response.body.totalItems;
                        this.stockReportRequest.totalPages = response.body.totalPages;
                        this.stockReportRequest.count = response.body.count;
                        if (response?.body?.fromDate && response?.body?.toDate) {
                            this.stockReportRequest.from = dayjs(response?.body?.fromDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                            this.stockReportRequest.to = dayjs(response?.body?.toDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                            this.fromDate = dayjs(response?.body?.fromDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                            this.toDate = dayjs(response?.body?.toDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                            this.selectedDateRange = { startDate: dayjs(response?.body?.fromDate, GIDDH_DATE_FORMAT), endDate: dayjs(response?.body?.toDate, GIDDH_DATE_FORMAT) };
                            this.selectedDateRangeUi = dayjs(response?.body?.fromDate, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(response?.body?.toDate, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI);
                            if (this.todaySelected) {
                                this.fromToDate = { from: response?.body?.fromDate, to: response?.body?.toDate };
                            } else {
                                this.fromToDate = null;
                            }

                            this.router.navigate([], { relativeTo: this.route, queryParams: { from: this.fromDate, to: this.toDate }, queryParamsHandling: 'merge', skipLocationChange: true });
                        }
                    } else {
                        this.toaster.errorToast(response?.message);
                        this.dataSource = [];
                        this.stockReportRequest.totalItems = 0;
                    }
                    this.changeDetection.detectChanges();
                });
            }
            if (this.reportType === InventoryReportType.stock) {

                let stockReportRequest = this.getStockReportRequestObject();
                let queryParams = {
                    from: stockReportRequest.from ?? '',
                    to: stockReportRequest.to ?? '',
                    count: stockReportRequest.count ?? PAGINATION_LIMIT,
                    page: stockReportRequest.page ?? 1,
                    sort: stockReportRequest.sort ?? '',
                    sortBy: stockReportRequest.sortBy ?? ''
                };
                stockReportRequest.inventoryType = this.moduleType;
                this.inventoryService.getItemWiseReport(queryParams, stockReportRequest).pipe(takeUntil(this.cancelApi$)).subscribe(response => {
                    this.handleReportResponse(response);
                });
            }

            if (this.reportType === InventoryReportType.variant) {
                let stockReportRequest = this.getStockReportRequestObject();
                let queryParams = {
                    from: stockReportRequest.from ?? '',
                    to: stockReportRequest.to ?? '',
                    count: stockReportRequest.count ?? PAGINATION_LIMIT,
                    page: stockReportRequest.page ?? 1,
                    sort: stockReportRequest.sort ?? '',
                    sortBy: stockReportRequest.sortBy ?? ''
                };
                stockReportRequest.inventoryType = this.moduleType;
                this.inventoryService.getVariantWiseReport(queryParams, stockReportRequest).pipe(takeUntil(this.cancelApi$)).subscribe(response => {
                    this.handleReportResponse(response);
                });
            }
            if (fetchBalance) {
                let balanceReportRequest = cloneDeep(this.balanceStockReportRequest);
                let queryParams = {}
                if (this.reportType === InventoryReportType.group) {
                    queryParams = {
                        from: balanceReportRequest.from ?? '',
                        to: balanceReportRequest.to ?? '',
                        stockGroupUniqueName: this.reportUniqueName ? this.reportUniqueName : '',
                        entity: 'group-wise'
                    };
                } else {
                    queryParams = {
                        from: balanceReportRequest.from ?? '',
                        to: balanceReportRequest.to ?? '',
                        stockGroupUniqueName: '',
                        entity: ''
                    };
                }
                balanceReportRequest.from = undefined;
                balanceReportRequest.to = undefined;
                balanceReportRequest.inventoryType = this.moduleType;
                this.inventoryService.getStockTransactionReportBalance(queryParams, balanceReportRequest).pipe(takeUntil(this.cancelApi$)).subscribe(response => {
                    if (response && response.body && response.status === 'success') {
                        this.stockTransactionReportBalance = response.body;
                    } else {
                        this.stockTransactionReportBalance = null;
                    }
                    this.changeDetection.detectChanges();
                });
            }
        });
    }

    /**
     * This will be use get custom fields value according to columns
     *
     * @param {*} element
     * @param {string} uniqueName
     * @return {*}  {string}
     * @memberof ReportsComponent
     */
    public getCustomFieldValue(element: any, uniqueName: string): string {
        const field = element?.customFields?.find((customField: any) => customField?.uniqueName === uniqueName);
        return field?.value ?? null;
    }

    /**
     * Handles pagination events for inventory reports
     *
     * @param {PageEvent} event - Contains pagination details
     * @memberof ReportsComponent
     */
    public handlePageEvent(event: PageEvent): void {
        if (this.stockReportRequest.count !== event.pageSize) {
            this.stockReportRequest.page = 1;
        } else {
            this.stockReportRequest.page = event.pageIndex + 1;
        }
        this.stockReportRequest.count = event.pageSize;
        this.getReport(false);
    }

    /**
     * This will use for sorting filters
     *
     * @param {*} event
     * @memberof ReportsComponent
     */
    public sortChange(event: any): void {
        this.stockReportRequest.sort = event?.direction ? event?.direction : 'asc';
        this.stockReportRequest.sortBy = event?.active;
        this.stockReportRequest.page = 1;
        this.getReport(false);
    }

    /**
     * This will use for reset filters
     *
     * @memberof ReportsComponent
     */
    public resetFilter(): void {
        this.showAccountSearchInput = false;
        this.changeDetection.detectChanges();
    }

    /**
     * This will use for show hide main table headers from customise columns
     *
     * @param {*} event
     * @memberof ReportsComponent
     */
    public getCustomiseHeaderColumns(event: any): void {
        this.displayedColumns = event;
    }

    /**
     * This will use for get reports by unqiue name
     *
     * @param {*} element
     * @memberof ReportsComponent
     */
    public getReportsByReportType(element: any): void {
        let currentUrl = '';
        let stockReportRequest = cloneDeep(this.stockReportRequest);
        let balanceStockReportRequest = cloneDeep(this.balanceStockReportRequest);

        stockReportRequest.stockGroupUniqueNames = undefined;
        stockReportRequest.stockUniqueNames = undefined;
        stockReportRequest.variantUniqueNames = undefined;
        stockReportRequest.stockGroups = undefined;
        stockReportRequest.stocks = undefined;
        stockReportRequest.variants = undefined;

        balanceStockReportRequest.stockGroupUniqueNames = undefined;
        balanceStockReportRequest.stockUniqueNames = undefined;
        balanceStockReportRequest.variantUniqueNames = undefined;
        stockReportRequest.stockGroups = undefined;
        stockReportRequest.stocks = undefined;
        stockReportRequest.variants = undefined;
        stockReportRequest.expression = undefined;
        stockReportRequest.param = undefined;
        stockReportRequest.val = undefined;

        if (this.reportType === InventoryReportType.group) {
            if (element?.stockGroupHasChild) {
                currentUrl = '/pages/inventory/v2/reports/' + this.moduleType?.toLowerCase() + '/group/' + element?.stockGroup?.uniqueName;
                this.storeFilters[currentUrl] = { stockReportRequest: stockReportRequest, balanceStockReportRequest: balanceStockReportRequest, todaySelected: this.todaySelected, showClearFilter: this.showClearFilter };
                this.store.dispatch(this.commonAction.setFilters(this.storeFilters));
                this.router.navigate(['/pages/inventory/v2/reports/', this.moduleType?.toLowerCase(), 'group', element?.stockGroup?.uniqueName]);
            } else {
                currentUrl = '/pages/inventory/v2/reports/' + this.moduleType?.toLowerCase() + '/stock/' + element?.stockGroup?.uniqueName;
                this.storeFilters[currentUrl] = { stockReportRequest: stockReportRequest, balanceStockReportRequest: balanceStockReportRequest, todaySelected: this.todaySelected, showClearFilter: this.showClearFilter };
                this.store.dispatch(this.commonAction.setFilters(this.storeFilters));
                this.router.navigate(['/pages/inventory/v2/reports/', this.moduleType?.toLowerCase(), 'stock', element?.stockGroup?.uniqueName]);
            }
        } else if (this.reportType === InventoryReportType.stock) {
            currentUrl = '/pages/inventory/v2/reports/' + this.moduleType?.toLowerCase() + '/variant/' + element?.stock?.uniqueName;
            this.storeFilters[currentUrl] = { stockReportRequest: stockReportRequest, balanceStockReportRequest: balanceStockReportRequest, todaySelected: this.todaySelected, showClearFilter: this.showClearFilter };
            this.store.dispatch(this.commonAction.setFilters(this.storeFilters));
            this.router.navigate(['/pages/inventory/v2/reports/', this.moduleType?.toLowerCase(), 'variant', element?.stock?.uniqueName]);
        } else if (this.reportType === InventoryReportType.variant) {
            currentUrl = '/pages/inventory/v2/reports/' + this.moduleType?.toLowerCase() + '/transaction/' + element?.variant?.uniqueName;
            this.storeFilters[currentUrl] = { stockReportRequest: stockReportRequest, balanceStockReportRequest: balanceStockReportRequest, todaySelected: this.todaySelected, showClearFilter: this.showClearFilter };
            this.store.dispatch(this.commonAction.setFilters(this.storeFilters));
            this.router.navigate(['/pages/inventory/v2/reports/', this.moduleType?.toLowerCase(), 'transaction', element?.variant?.uniqueName]);
        }
    }

    /**
     * This will use for translation complete
     *
     * @param {*} event
     * @memberof ReportsComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.translationLoaded = true;
            this.customiseColumns = this.customiseColumns?.map(column => {
                switch (column.value) {
                    case 'opening_amount':
                        column.label = this.localeData?.reports.opening_stock_value;
                        break;
                    default:
                        column.label = this.localeData?.reports[column.value];
                        break;
                }
                return column;
            });
            this.changeDetection.detectChanges();
        }
    }

    /**
     * This will use for redirect to edit group by reports
     *
     * @param {*} element
     * @memberof ReportsComponent
     */
    public editGroup(element: any): void {
        if (this.moduleType?.toUpperCase() === 'FIXED_ASSETS') {
            this.moduleType = 'fixedassets';
        }
        this.router.navigate(['/pages/inventory/v2', 'group', this.moduleType?.toLowerCase(), 'edit', element?.stockGroup?.uniqueName]);
    }

    /**
     *This will use for redirect to edit stock by reports
     *
     * @param {*} element
     * @memberof ReportsComponent
     */
    public editStock(element: any): void {
        if (this.moduleType?.toUpperCase() === 'FIXED_ASSETS') {
            this.moduleType = 'fixedassets';
        }
        this.router.navigate(['/pages/inventory/v2', 'stock', this.moduleType?.toLowerCase(), 'edit', element?.stock?.uniqueName]);
    }

    /**
     * This will use for redirect to edit variant by reports
     *
     * @param {*} element
     * @memberof ReportsComponent
     */
    public editVariant(element: any): void {
        if (this.moduleType?.toUpperCase() === 'FIXED_ASSETS') {
            this.moduleType = 'fixedassets';
        }

        this.router.navigate(['/pages/inventory/v2', 'stock', this.moduleType?.toLowerCase(), 'edit', element?.stock?.uniqueName], { queryParams: { tab: 1 } });
    }

    /**
     * Handles report response processing
     *
     * @private
     * @param {any} response - Response from inventory report API
     * @memberof ReportsComponent
     */
    private handleReportResponse(response: any): void {
        this.isLoading = false;
        if (response && response.body && response.status === 'success') {
            this.isDataAvailable = (response.body.results?.length) ? true : false;
            this.dataSource = response.body.results;
            this.stockReportRequest.page = response.body.page;
            this.stockReportRequest.totalItems = response.body.totalItems;
            this.stockReportRequest.totalPages = response.body.totalPages;
            this.stockReportRequest.count = response.body.count;
            if (response?.body?.fromDate && response?.body?.toDate) {
                this.stockReportRequest.from = dayjs(response?.body?.fromDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                this.stockReportRequest.to = dayjs(response?.body?.toDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                this.fromDate = dayjs(response?.body?.fromDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                this.toDate = dayjs(response?.body?.toDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                this.selectedDateRange = { startDate: dayjs(response?.body?.fromDate, GIDDH_DATE_FORMAT), endDate: dayjs(response?.body?.toDate, GIDDH_DATE_FORMAT) };
                this.selectedDateRangeUi = dayjs(response?.body?.fromDate, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(response?.body?.toDate, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI);
                if (this.todaySelected) {
                    this.fromToDate = { from: response?.body?.fromDate, to: response?.body?.toDate };
                } else {
                    this.fromToDate = null;
                }
            }
        } else {
            this.toaster.errorToast(response?.message);
            this.dataSource = [];
            this.stockReportRequest.totalItems = 0;
        }
        this.changeDetection.detectChanges();
    }

    /**
    * This hook will use for on destroyed component
    *
    * @memberof ReportsComponent
    */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        this.cancelApi$.next(true);
        this.cancelApi$.complete();
        this.filtersSubject$.complete();
        this.dynamicColumnsSubject$.complete();
    }
}
