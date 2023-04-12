import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, ViewChildren, QueryList, Output, EventEmitter } from "@angular/core";
import { GeneralService } from "../../../services/general.service";
import * as dayjs from "dayjs";
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from "../../../shared/helpers/defaultDateFormat";
import { ReplaySubject } from "rxjs";
import { select, Store } from "@ngrx/store";
import { AppState } from "../../../store";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSort } from "@angular/material/sort";
import { cloneDeep } from "../../../lodash-optimized";
import { BalanceStockTransactionReportRequest, InventoryReportBalanceResponse, StockTransactionReportRequest } from "../../../models/api-models/Inventory";
import { InventoryService } from "../../../services/inventory.service";
import { ToasterService } from "../../../services/toaster.service";
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { giddhRoundOff } from "../../../shared/helpers/helperFunctions";
import { ReportFiltersComponent } from "../report-filters/report-filters.component";
import { ActivatedRoute, Router } from "@angular/router";
import { InventoryModuleName, InventoryReportType } from "../../inventory.enum";
import { OrganizationType } from "../../../models/user-login-state";

@Component({
    selector: "inventory-transaction-list",
    templateUrl: "./inventory-transaction-list.component.html",
    styleUrls: ["./inventory-transaction-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryTransactionListComponent implements OnInit {
    @ViewChild(ReportFiltersComponent, { read: ReportFiltersComponent, static: false }) public reportFiltersComponent: ReportFiltersComponent;
    /** Instance of  account name searching column */
    @ViewChild('accountName', { static: true }) public accountName: ElementRef;
    /** Instance of sort header */
    @ViewChild(MatSort) sort: MatSort;
    /** Instance of cdk virtual scroller */
    @ViewChildren(CdkVirtualScrollViewport) virtualScroll: QueryList<CdkVirtualScrollViewport>;
    /** Emits the scroll to bottom event when pagination is required  */
    @Output() public scrollEnd: EventEmitter<void> = new EventEmitter();
    /** This will use for searching for column */
    public searchAccountName: FormControl = new FormControl();
    /* dayjs object */
    public dayjs = dayjs;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Stock Transactional Object */
    public stockReportRequest: StockTransactionReportRequest = new StockTransactionReportRequest();
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
    /** This will use for stock report voucher types column check values */
    public voucherTypes: any[] = [];
    /** This will use for stock report displayed columns */
    public displayedColumns: string[] = [];
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
    /** Holds module name */
    public moduleName = InventoryModuleName.transaction;
    /** Holds report type */
    public reportType: string = InventoryReportType.transaction;
    /** Holds report unique name */
    public reportUniqueName: string = '';
    /** True  if report is loaded */
    public isReportLoaded: boolean = false;
    /** True if translations loaded */
    public translationLoaded: boolean = false;
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    public isCompany: boolean;
    /** False if pull unitversal date  */
    public pullUniversalDate: boolean = true;
    /** Hold current url */
    private currentUrl: string = "";
    /** Holds filters in store */
    private storeFilters: any;
    /** Hold advance search modal response */
    public advanceSearchModalResponse: any = null;
    /** Observable to cancel api on reports api call */
    private cancelApi$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holds module type for reports */
    public moduleType: string = '';

    constructor(
        private generalService: GeneralService,
        public dialog: MatDialog,
        private changeDetection: ChangeDetectorRef,
        private inventoryService: InventoryService,
        public route: ActivatedRoute,
        public router: Router,
        private toaster: ToasterService,
        private store: Store<AppState>) {
        this.store.pipe(select(state => state.settings.profile), takeUntil(this.destroyed$)).subscribe((profile) => {
            if (profile) {
                this.giddhBalanceDecimalPlaces = profile.balanceDecimalPlaces;
            }
        });
        this.currentUrl = this.router.url;

        this.store.pipe(select(state => state.session?.filters), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.storeFilters = response;
                if (this.storeFilters[this.currentUrl]) {
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
                    this.pullUniversalDate = false;
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
        this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch;

        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';

        this.searchAccountName.valueChanges.pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(search => {
            if (this.showAccountSearchInput) {
                this.stockReportRequest.accountName = search;
                this.balanceStockReportRequest.accountName = search;
                this.stockReportRequest.page = 1;
                if (search === '') {
                    this.showAccountSearchInput = false;
                }
                this.reportFiltersComponent.isFilterActive();
                this.showClearFilter = true;
                this.getStockTransactionalReport();
            }
        });

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompany = activeCompany;
            }
        });

        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.reportUniqueName = response?.uniqueName;
                if (response?.type?.toUpperCase() === 'FIXEDASSETS') {
                    this.moduleType = 'FIXED_ASSETS';
                } else {
                    this.moduleType = response?.type?.toUpperCase();
                }
                if (this.isReportLoaded) {
                    this.getStockTransactionalReport(true);
                }
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
        this.isReportLoaded = true;
        this.cancelApi$.next();
        setTimeout(() => {
            this.cancelApi$ = new ReplaySubject(1);
            if (!this.isCompany) {
                this.stockReportRequest.branchUniqueNames = [this.generalService.currentBranchUniqueName];
                this.balanceStockReportRequest.branchUniqueNames = [this.generalService.currentBranchUniqueName];
            }
            this.stockReportRequest.type = this.moduleType;
            let stockReportRequest = cloneDeep(this.stockReportRequest);
            stockReportRequest.stockGroups = undefined;
            stockReportRequest.stocks = undefined;
            stockReportRequest.variants = undefined;

            this.inventoryService.getStockTransactionReport(stockReportRequest).pipe(takeUntil(this.cancelApi$)).subscribe(response => {
                this.isLoading = false;
                if (response && response.body && response.status === 'success') {
                    this.isDataAvailable = (response.body.transactions?.length) ? true : false;
                    this.dataSource = response.body.transactions;
                    this.stockReportRequest.page = response.body.page;
                    this.stockReportRequest.totalItems = response.body.totalItems;
                    this.stockReportRequest.totalPages = response.body.totalPages;
                    this.stockReportRequest.count = response.body.count;
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
                } else {
                    this.toaster.errorToast(response?.message);
                    this.dataSource = [];
                    this.stockReportRequest.totalItems = 0;
                    if (!this.isCompany) {
                        this.stockReportRequest.branchUniqueNames = [this.generalService.currentBranchUniqueName];
                        this.balanceStockReportRequest.branchUniqueNames = [this.generalService.currentBranchUniqueName];
                    }
                }
                this.changeDetection.detectChanges();
            });
            if (fetchBalance) {
                let balanceReportRequest = cloneDeep(this.balanceStockReportRequest);
                let queryParams = {
                    from: balanceReportRequest.from ?? '',
                    to: balanceReportRequest.to ?? '',
                    type: this.moduleType ?? '',
                    stockGroupUniqueName: ''
                };
                balanceReportRequest.from = undefined;
                balanceReportRequest.to = undefined;
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
     * This will use for toggle account name columns search
     *
     * @param {string} fieldName
     * @memberof InventoryTransactionListComponent
     */
    public toggleSearch(fieldName: string): void {
        if (fieldName === "name") {
            this.showAccountSearchInput = true;
        }
    }

    /**
     * This will use for get search field value
     *
     * @param {string} fieldName
     * @return {*}  {string}
     * @memberof InventoryTransactionListComponent
     */
    public getSearchFieldText(fieldName: string): string {
        if (fieldName === "name") {
            return this.localeData?.reports?.account_name;
        }
        return "";
    }

    /**
     *Handle the click outside event
     *
     * @param {*} event
     * @param {*} element
     * @param {string} searchedFieldName
     * @return {*}  {void}
     * @memberof InventoryTransactionListComponent
     */
    public handleClickOutside(event: any, element: any, searchedFieldName: string): void {
        if (searchedFieldName === "name") {
            if (this.searchAccountName?.value) {
                return;
            }
            if (this.generalService.childOf(event?.target, element)) {
                return;
            } else {
                this.showAccountSearchInput = false;
            }
        }
    }

    /**
     * This will use for reset filters
     *
     * @memberof InventoryTransactionListComponent
     */
    public resetFilter(): void {
        this.showAccountSearchInput = false;
        this.voucherTypes.forEach(response => {
            response.checked = false;
        });
        this.searchAccountName.reset();
        this.changeDetection.detectChanges();
    }

    /**
     * This will use for filter by check for Voucher types column
     *
     * @param {string} type
     * @memberof InventoryTransactionListComponent
     */
    public filterByVoucherTypes(): void {
        let checkedValues = this.voucherTypes?.filter(value => value?.checked === true);
        const currentVoucherTypes = cloneDeep(this.stockReportRequest.voucherTypes);
        if (checkedValues?.length) {
            this.stockReportRequest.voucherTypes = [];
            checkedValues?.forEach(type => {
                this.stockReportRequest.voucherTypes?.push(type?.value);
            });
        } else {
            this.stockReportRequest.voucherTypes = [];
        }
        let difference = currentVoucherTypes?.filter(x => !this.stockReportRequest.voucherTypes?.includes(x));
        let hasDifference = (difference?.length || currentVoucherTypes?.length !== this.stockReportRequest.voucherTypes?.length)
        this.balanceStockReportRequest.voucherTypes = this.stockReportRequest.voucherTypes;
        if (hasDifference) {
            this.stockReportRequest.page = 1;
            this.getStockTransactionalReport();
        }
        this.reportFiltersComponent.isFilterActive();
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
        this.cancelApi$.next(true);
        this.cancelApi$.complete();
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

    /**
     * This will use for translation complete
     *
     * @param {*} event
     * @memberof InventoryTransactionListComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.translationLoaded = true;
            this.voucherTypes = [
                {
                    value: "SALES",
                    label: this.localeData?.reports?.sales,
                    checked: false
                },
                {
                    value: "PURCHASE",
                    label: this.localeData?.reports?.purchase,
                    checked: false
                },
                {
                    value: "SALES_CREDIT_NOTE",
                    label: this.localeData?.reports?.sales_credit_note,
                    checked: false
                },
                {
                    value: "SALES_DEBIT_NOTE",
                    label: this.localeData?.reports?.sales_debit_note,
                    checked: false
                },
                {
                    value: "PURCHASE_DEBIT_NOTE",
                    label: this.localeData?.reports?.purchase_debit_note,
                    checked: false
                },
                {
                    value: "PURCHASE_CREDIT_NOTE",
                    label: this.localeData?.reports?.purchase_credit_note,
                    checked: false
                },
                {
                    value: "DELIVERY_NOTE",
                    label: this.localeData?.reports?.delivery_challan,
                    checked: false
                },
                {
                    value: "RECEIPT_NOTE",
                    label: this.localeData?.reports?.receipt_note,
                    checked: false
                },
                {
                    value: "MANUFACTURED",
                    label: this.localeData?.reports?.manufactured,
                    checked: false
                },
                {
                    value: "RAW_MATERIAL",
                    label: this.localeData?.reports?.raw_material,
                    checked: false
                },
            ];
            this.customiseColumns = [
                {
                    value: "entry_date",
                    label: this.localeData?.reports?.date,
                    checked: true
                },
                {
                    value: "voucherType",
                    label: this.localeData?.reports?.voucher_type,
                    checked: true
                },
                {
                    value: "account_name",
                    label: this.localeData?.reports?.account_name,
                    checked: true

                },
                {
                    value: "stock_name",
                    label: this.localeData?.reports?.stock_name,
                    checked: true

                },
                {
                    value: "variant_name",
                    label: this.localeData?.reports?.variant_name,
                    checked: true

                },
                {
                    value: "inward_quantity",
                    label: this.localeData?.reports?.inwards,
                    checked: true

                },
                {
                    value: "outward_quantity",
                    label: this.localeData?.reports?.outwards,
                    checked: true

                },
                {
                    value: "rate",
                    label: this.localeData?.reports?.rate,
                    checked: true

                },
                {
                    value: "transaction_val",
                    label: this.localeData?.reports?.value,
                    checked: true
                }
            ];
            this.changeDetection.detectChanges();
        }
    }
}
