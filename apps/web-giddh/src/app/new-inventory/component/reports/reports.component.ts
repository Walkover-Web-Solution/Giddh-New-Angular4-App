import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { select, Store } from '@ngrx/store';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BalanceStockTransactionReportRequest, InventoryReportRequest, InventoryReportBalanceResponse, StockReportRequest } from '../../../models/api-models/Inventory';
import { InventoryService } from '../../../services/inventory.service';
import { ToasterService } from '../../../services/toaster.service';
import { AppState } from '../../../store';
import { ReportFiltersComponent } from '../report-filters/report-filters.component';
import { giddhRoundOff } from "../../../shared/helpers/helperFunctions";
import * as dayjs from "dayjs";
import { cloneDeep } from '../../../lodash-optimized';
import { ActivatedRoute, Router } from '@angular/router';
import { INVENTORY_COMMON_COLUMNS, InventoryReportType, InventoryModuleName } from '../../inventory.enum';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { CommonActions } from '../../../actions/common.actions';
import { PAGINATION_LIMIT } from '../../../app.constant';
import { GeneralService } from '../../../services/general.service';
import { OrganizationType } from '../../../models/user-login-state';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportsComponent implements OnInit {
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
    /** This will use for  table report header columns */
    public tableHeaderColumns: any[] = [];
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
    /** Holds module type for reports */
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
    /** This will use for  table report header displayed all columns */
    public headerColumns = {
        entity_group_name: {
            search: 'name',
            colSpan: 0
        },
        opening_stock: {
            search: 'opening',
            colSpan: 0
        },
        inwards: {
            search: 'inward',
            colSpan: 0
        },
        outwards: {
            search: 'outward',
            colSpan: 0
        },
        closing_stock: {
            search: 'closing',
            colSpan: 0
        },
    }
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    public isCompany: boolean;
    /** Observable to cancel api on reports api call */
    private cancelApi$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        public route: ActivatedRoute,
        public router: Router,
        private changeDetection: ChangeDetectorRef,
        private inventoryService: InventoryService,
        private toaster: ToasterService,
        private generalService: GeneralService,
        private store: Store<AppState>,
        private commonAction: CommonActions) {
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

                    this.fromDate = dayjs(this.stockReportRequest?.from, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                    this.toDate = dayjs(this.stockReportRequest?.to, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                    this.stockReportRequest.from = this.fromDate;
                    this.stockReportRequest.to = this.toDate;
                    this.balanceStockReportRequest.from = this.fromDate;
                    this.balanceStockReportRequest.to = this.toDate;

                    this.fromToDate = { from: this.fromDate, to: this.toDate };
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
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
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
                this.fromDate = dayjs(this.stockReportRequest?.from, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                this.toDate = dayjs(this.stockReportRequest?.to, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                this.stockReportRequest.from = this.fromDate;
                this.stockReportRequest.to = this.toDate;
                this.balanceStockReportRequest.from = this.fromDate;
                this.balanceStockReportRequest.to = this.toDate;
                this.fromToDate = { from: this.fromDate, to: this.toDate };
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
        this.cancelApi$.next();
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
                    type: this.moduleType ?? ''
                };

                stockReportRequest.from = undefined;
                stockReportRequest.to = undefined;
                stockReportRequest.count = undefined;
                stockReportRequest.page = undefined;
                stockReportRequest.sort = undefined;
                stockReportRequest.sortBy = undefined;
                stockReportRequest.totalItems = undefined;
                stockReportRequest.totalPages = undefined;

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
                    sortBy: stockReportRequest.sortBy ?? '',
                    type: this.moduleType ?? ''
                };
                this.inventoryService.getItemWiseReport(queryParams, stockReportRequest).pipe(takeUntil(this.cancelApi$)).subscribe(response => {
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
                    sortBy: stockReportRequest.sortBy ?? '',
                    type: this.moduleType ?? ''
                };
                this.inventoryService.getVariantWiseReport(queryParams, stockReportRequest).pipe(takeUntil(this.cancelApi$)).subscribe(response => {
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
                        type: this.moduleType ? this.moduleType : ''
                    };
                } else {
                    queryParams = {
                        from: balanceReportRequest.from ?? '',
                        to: balanceReportRequest.to ?? '',
                        stockGroupUniqueName: '',
                        type: this.moduleType ? this.moduleType : ''
                    };
                }
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
    * This function will change the page of activity logs
    *
    * @param {*} event
    * @memberof ReportsComponent
    */
    public pageChanged(event: any): void {
        if (this.stockReportRequest.page !== event?.page) {
            this.stockReportRequest.page = event?.page;
            this.getReport(false);
        }
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
     * Gets the data output by report filters
     *
     * @param {*} event
     * @memberof ReportsComponent
     */
    public getSelectedFilters(event: any): void {
        if (!this.initialLoad) {
            if (!this.storeFilters) {
                this.storeFilters = [];
            }

            this.storeFilters[this.currentUrl] = event;
            this.store.dispatch(this.commonAction.setFilters(this.storeFilters));
            this.stockReportRequest = event?.stockReportRequest;
            this.balanceStockReportRequest = event?.balanceStockReportRequest;
            this.todaySelected = event?.todaySelected;
            this.showClearFilter = event?.showClearFilter;
        } else {
            this.initialLoad = false;
        }
        this.pullUniversalDate = true;
        this.getReport(true);
    }

    /**
     * This will use for show hide main table headers from customise columns
     *
     * @param {*} event
     * @memberof ReportsComponent
     */
    public getCustomiseHeaderColumns(event: any): void {
        this.displayedColumns = event;
        this.tableHeaderColumns = [];
        Object.keys(this.headerColumns).forEach(key => {
            const colSpan = this.calculateColSpan(this.headerColumns[key].search);
            if (colSpan !== 0) {
                this.tableHeaderColumns.push(key);
                this.headerColumns[key].colSpan = colSpan;
            }
        });
    }

    /**
     *This will use for calculating the col span
     *
     * @param {string} column
     * @return {*}  {number}
     * @memberof ReportsComponent
     */
    public calculateColSpan(column: string): number {
        return this.displayedColumns?.filter(value => value?.includes(column))?.length;
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
                currentUrl = '/pages/new-inventory/reports/group/' + element?.stockGroup?.uniqueName;
                this.storeFilters[currentUrl] = { stockReportRequest: stockReportRequest, balanceStockReportRequest: balanceStockReportRequest, todaySelected: this.todaySelected, showClearFilter: this.showClearFilter };
                this.store.dispatch(this.commonAction.setFilters(this.storeFilters));
                this.router.navigate(['/pages', 'new-inventory', 'reports', 'group', element?.stockGroup?.uniqueName]);
            } else {
                currentUrl = '/pages/new-inventory/reports/stock/' + element?.stockGroup?.uniqueName;
                this.storeFilters[currentUrl] = { stockReportRequest: stockReportRequest, balanceStockReportRequest: balanceStockReportRequest, todaySelected: this.todaySelected, showClearFilter: this.showClearFilter };
                this.store.dispatch(this.commonAction.setFilters(this.storeFilters));
                this.router.navigate(['/pages', 'new-inventory', 'reports', 'stock', element?.stockGroup?.uniqueName]);
            }
        } else if (this.reportType === InventoryReportType.stock) {
            currentUrl = '/pages/new-inventory/reports/variant/' + element?.stock?.uniqueName;
            this.storeFilters[currentUrl] = { stockReportRequest: stockReportRequest, balanceStockReportRequest: balanceStockReportRequest, todaySelected: this.todaySelected, showClearFilter: this.showClearFilter };
            this.store.dispatch(this.commonAction.setFilters(this.storeFilters));
            this.router.navigate(['/pages', 'new-inventory', 'reports', 'variant', element?.stock?.uniqueName]);
        } else if (this.reportType === InventoryReportType.variant) {
            currentUrl = '/pages/new-inventory/reports/transaction/' + element?.variant?.uniqueName;
            this.storeFilters[currentUrl] = { stockReportRequest: stockReportRequest, balanceStockReportRequest: balanceStockReportRequest, todaySelected: this.todaySelected, showClearFilter: this.showClearFilter };
            this.store.dispatch(this.commonAction.setFilters(this.storeFilters));
            this.router.navigate(['/pages', 'new-inventory', 'reports', 'transaction', element?.variant?.uniqueName]);
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
    * This hook will use for on destroyed component
    *
    * @memberof ReportsComponent
    */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        this.cancelApi$.next(true);
        this.cancelApi$.complete();
    }
}
