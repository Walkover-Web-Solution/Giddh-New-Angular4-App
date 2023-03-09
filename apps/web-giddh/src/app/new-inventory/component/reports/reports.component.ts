import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { select, Store } from '@ngrx/store';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BalanceStockTransactionReportRequest, InventoryReportRequest, InventoryReportBalanceResponse } from '../../../models/api-models/Inventory';
import { GeneralService } from '../../../services/general.service';
import { InventoryService } from '../../../services/inventory.service';
import { ToasterService } from '../../../services/toaster.service';
import { AppState } from '../../../store';
import { ReportFiltersComponent } from '../report-filters/report-filters.component';
import { giddhRoundOff } from "../../../shared/helpers/helperFunctions";
import * as dayjs from "dayjs";
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { cloneDeep } from '../../../lodash-optimized';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportsComponent implements OnInit {
    @ViewChild(ReportFiltersComponent, { read: ReportFiltersComponent, static: false }) public reportFiltersComponent: ReportFiltersComponent;
    /** Instance of  account name searching column */
    @ViewChild('accountName', { static: true }) public accountName: ElementRef;
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
    public displayedColumns: string[] = [];
    /** This will use for stock report voucher types column check values */
    public customiseColumns = [
        {
            "value": "group_name",
            "label": "Group Name",
            "checked": true
        },

        {
            "value": "opening_quantity",
            "label": "Qty",
            "checked": true
        },
        {
            "value": "opening_amount",
            "label": "Value",
            "checked": true
        },
        {
            "value": "inward_quantity",
            "label": "Qty",
            "checked": true
        },
        {
            "value": "inward_amount",
            "label": "Value",
            "checked": true
        },
        {
            "value": "outward_quantity",
            "label": "Qty",
            "checked": true
        },
        {
            "value": "outward_amount",
            "label": "Value",
            "checked": true
        },
        {
            "value": "closing_quantity",
            "label": "Qty",
            "checked": true
        },
        {
            "value": "closing_amount",
            "label": "Value",
            "checked": true
        }
    ];

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

    constructor(
        private generalService: GeneralService,
        public dialog: MatDialog,
        private changeDetection: ChangeDetectorRef,
        private inventoryService: InventoryService,
        private toaster: ToasterService,
        private store: Store<AppState>) {
        this.store.pipe(select(state => state.settings.profile), takeUntil(this.destroyed$)).subscribe((profile) => {
            if (profile) {
                this.giddhBalanceDecimalPlaces = profile.balanceDecimalPlaces;
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
    }

    /**
     * This will use for get stock transactions report data
     *
     * @param {boolean} [apiCall=true]
     * @param {boolean} [type]
     * @return {*}  {void}
     * @memberof InventoryTransactionListComponent
     */
    public getStockTransactionalReport(fetchBalance: boolean = true): void {
        this.dataSource = [];
        this.isLoading = true;

        this.inventoryService.getInventoryReport(cloneDeep(this.stockReportRequest)).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.isLoading = false;
            if (response && response.body && response.status === 'success') {
                this.isDataAvailable = (response.body.results?.length) ? true : this.showClearFilter;
                this.dataSource = response.body.results;
                this.stockReportRequest.page = response.body.page;
                this.stockReportRequest.totalItems = response.body.totalItems;
                this.stockReportRequest.totalPages = response.body.totalPages;
                this.stockReportRequest.count = response.body.count;
                // this.stockReportRequest.from = dayjs(response?.body?.fromDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                // this.stockReportRequest.to = dayjs(response?.body?.toDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                // this.fromDate = dayjs(response?.body?.fromDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                // this.toDate = dayjs(response?.body?.toDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                // this.selectedDateRange = { startDate: dayjs(response?.body?.fromDate, GIDDH_DATE_FORMAT), endDate: dayjs(response?.body?.toDate, GIDDH_DATE_FORMAT) };
                // this.selectedDateRangeUi = dayjs(response?.body?.fromDate, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(response?.body?.toDate, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI);

                // if (this.todaySelected) {
                //     this.fromToDate = { from: response?.body?.fromDate, to: response?.body?.toDate };
                // } else {
                //     this.fromToDate = null;
                // }
            } else {
                this.toaster.errorToast(response?.message);
                this.dataSource = [];
                this.stockReportRequest.totalItems = 0;
            }
            this.changeDetection.detectChanges();
        });
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
            this.getStockTransactionalReport(false);
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
        this.getStockTransactionalReport(false);
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
        this.stockReportRequest = event?.stockReportRequest;
        this.balanceStockReportRequest = event?.balanceStockReportRequest;
        this.displayedColumns = event?.displayedColumns;
        this.todaySelected = event?.todaySelected;
        this.showClearFilter = event?.showClearFilter;
        this.getStockTransactionalReport();
    }
}
