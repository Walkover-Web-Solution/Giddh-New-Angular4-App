import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
    /** This will use for  table report header displayed all columns */
    public displayHeaderColumns: any[] = [
        'entity_group_name',
        'opening_stock',
        'inwards',
        'outwards',
        'closing_stock'
    ];
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
    public isDataAvailable: boolean = false;
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
    /** True  if report is loaded */
    public isReportLoaded: boolean = false;
    /** Holds module name */
    public moduleName = '';
    /** True if initial load */
    private initialLoad: boolean = false;
    /** Holds filters in store */
    private storeFilters: any;
    /** Hold advance search modal response */
    public advanceSearchModalResponse: any = null;
    private currentUrl: string = "";
    public showContent: boolean = true;
    public pullUniversalDate: boolean = true;

    constructor(
        public dialog: MatDialog,
        public route: ActivatedRoute,
        public router: Router,
        private changeDetection: ChangeDetectorRef,
        private inventoryService: InventoryService,
        private toaster: ToasterService,
        private store: Store<AppState>,
        private commonAction: CommonActions) {
        this.store.pipe(select(state => state.settings.profile), takeUntil(this.destroyed$)).subscribe((profile) => {
            if (profile) {
                this.giddhBalanceDecimalPlaces = profile.balanceDecimalPlaces;
            }
        });

        this.currentUrl = this.router.url;

        this.store.pipe(select(state => state.session.filters), takeUntil(this.destroyed$)).subscribe(response => {
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
            }
        });
    }

    /**
     * This hook will use  on component initialization
     *
     * @memberof InventoryTransactionListComponent
     */
    public ngOnInit(): void {
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompany = activeCompany;
            }
        });
        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.currentUrl = this.router.url;
            if (this.reportType && (response?.reportType)?.toUpperCase() !== this.reportType) {
                this.reportType = (response?.reportType)?.toUpperCase();
                this.showContent = false;
                this.changeDetection.detectChanges();

                this.stockReportRequest = new StockReportRequest();
                this.balanceStockReportRequest = new BalanceStockTransactionReportRequest();

                if (this.storeFilters[this.currentUrl]) {
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
                }

                setTimeout(() => {
                    this.showContent = true;
                    this.changeDetection.detectChanges();
                });
            } else {
                this.reportType = (response?.reportType)?.toUpperCase();
                this.reportUniqueName = response?.uniqueName;
                this.customiseColumns = cloneDeep(INVENTORY_COMMON_COLUMNS);
                if (this.reportType === InventoryReportType.group.toUpperCase()) {
                    this.customiseColumns.splice(0, 0, {
                        "value": "group_name",
                        "label": "Group Name",
                        "checked": true
                    });
                    this.moduleName = InventoryModuleName.group;
                }
                if (this.reportType === InventoryReportType.stock.toUpperCase()) {
                    this.customiseColumns.splice(0, 0,
                        {
                            "value": "group_name",
                            "label": "Group Name",
                            "checked": true
                        },
                        {
                            "value": "stock_name",
                            "label": "Stock Name",
                            "checked": true
                        })
                    this.moduleName = InventoryModuleName.stock;

                }
                if (this.reportType === InventoryReportType.variant.toUpperCase()) {
                    this.customiseColumns.splice(0, 0,
                        {
                            "value": "group_name",
                            "label": "Group Name",
                            "checked": true
                        },
                        {
                            "value": "stock_name",
                            "label": "Stock Name",
                            "checked": true
                        },
                        {
                            "value": "variant_name",
                            "label": "Variant Name",
                            "checked": true
                        })
                    this.moduleName = InventoryModuleName.variant;
                }

                if (this.isReportLoaded) {
                    this.getReport(true);
                }
            }
        });
    }

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
     * @memberof InventoryTransactionListComponent
     */
    public getReport(fetchBalance: boolean = true): void {
        if (!this.reportType) {
            return;
        }
        this.dataSource = [];
        this.isLoading = true;
        this.isReportLoaded = true;
        if (this.reportType === InventoryReportType.group) {
            if (this.reportUniqueName) {
                this.stockReportRequest.stockGroupUniqueNames = [this.reportUniqueName];
                this.balanceStockReportRequest.stockGroupUniqueNames = [this.reportUniqueName];
            }

            let stockReportRequest = this.getStockReportRequestObject();

            this.inventoryService.getGroupWiseReport(cloneDeep(stockReportRequest)).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                this.isLoading = false;
                if (response && response.body && response.status === 'success') {
                    this.isDataAvailable = (response.body.results?.length) ? true : this.showClearFilter;
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

            if (this.reportUniqueName) {
                this.stockReportRequest.stockGroupUniqueNames = [this.reportUniqueName];
                this.balanceStockReportRequest.stockGroupUniqueNames = [this.reportUniqueName];
            }

            let stockReportRequest = this.getStockReportRequestObject();

            this.inventoryService.getItemWiseReport(cloneDeep(stockReportRequest)).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                this.isLoading = false;
                if (response && response.body && response.status === 'success') {
                    this.isDataAvailable = (response.body.results?.length) ? true : this.showClearFilter;
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
            if (this.reportUniqueName) {
                this.stockReportRequest.stockGroupUniqueNames = [this.reportUniqueName];
                this.balanceStockReportRequest.stockGroupUniqueNames = [this.reportUniqueName];
            }

            let stockReportRequest = this.getStockReportRequestObject();

            this.inventoryService.getVariantWiseReport(cloneDeep(stockReportRequest)).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                this.isLoading = false;
                if (response && response.body && response.status === 'success') {
                    this.isDataAvailable = (response.body.results?.length) ? true : this.showClearFilter;
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
            this.inventoryService.getStockTransactionReportBalance(cloneDeep(this.balanceStockReportRequest)).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response && response.body && response.status === 'success') {
                    this.stockTransactionReportBalance = response.body;
                } else {
                    this.stockTransactionReportBalance = null;
                }
                this.changeDetection.detectChanges();
            });
        }
    }

    /**
    * This function will change the page of activity logs
    *
    * @param {*} event
    * @memberof InventoryTransactionListComponent
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
     * @memberof InventoryTransactionListComponent
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
     * @memberof InventoryTransactionListComponent
     */
    public resetFilter(): void {
        this.showAccountSearchInput = false;
        this.changeDetection.detectChanges();
    }

    /**
     * This hook will use for on destroyed component
     *
     * @memberof InventoryTransactionListComponent
     */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Gets the data output by report filters
     *
     * @param {*} event
     * @memberof InventoryTransactionListComponent
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
        this.tableHeaderColumns = cloneDeep(this.displayHeaderColumns);
        if (!this.displayedColumns.includes("group_name")) {
            this.tableHeaderColumns = this.tableHeaderColumns.filter(value => value !== 'entity_group_name');
        }
        if (!this.displayedColumns.includes('opening_quantity') && !this.displayedColumns.includes('opening_amount')) {
            this.tableHeaderColumns = this.tableHeaderColumns.filter(value => value !== 'opening_stock');
        }
        if (!this.displayedColumns.includes('inward_quantity') && !this.displayedColumns.includes('inward_amount')) {
            this.tableHeaderColumns = this.tableHeaderColumns.filter(value => value !== 'inwards');
        }
        if (!this.displayedColumns.includes('outward_quantity') && !this.displayedColumns.includes('outward_amount')) {
            this.tableHeaderColumns = this.tableHeaderColumns.filter(value => value !== 'outwards');
        }
        if (!this.displayedColumns.includes('closing_quantity') && !this.displayedColumns.includes('closing_amount')) {
            this.tableHeaderColumns = this.tableHeaderColumns.filter(value => value !== 'closing');
        }
    }

    /**
      * This will use for get reports by unqiue name
     *
     * @param {*} event
     * @param {*} element
     * @memberof ReportsComponent
     */
    public getReportsByReportType(event: any, element: any): void {
        if (this.reportType === InventoryReportType.group) {
            if (element?.stockGroupHasChild) {
                this.router.navigate(['/pages', 'new-inventory', 'reports', 'group', element?.stockGroup?.uniqueName]);
            } else {
                this.router.navigate(['/pages', 'new-inventory', 'reports', 'stock', element?.stockGroup?.uniqueName]);
            }
        } else if (this.reportType === InventoryReportType.stock) {
            this.router.navigate(['/pages', 'new-inventory', 'reports', 'variant', element?.stock?.uniqueName]);
        } else if (this.reportType === InventoryReportType.variant) {
            this.router.navigate(['/pages', 'new-inventory', 'reports', 'transactions']);
        }
    }
}
