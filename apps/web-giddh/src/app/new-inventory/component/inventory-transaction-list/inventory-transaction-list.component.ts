import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, ViewChildren, QueryList, Input, Output, EventEmitter } from "@angular/core";
import { GeneralService } from "../../../services/general.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { GIDDH_DATE_RANGE_PICKER_RANGES, PAGINATION_LIMIT } from "../../../app.constant";
import * as dayjs from "dayjs";
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from "../../../shared/helpers/defaultDateFormat";
import { Observable, ReplaySubject } from "rxjs";
import { select, Store } from "@ngrx/store";
import { AppState } from "../../../store";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSort } from "@angular/material/sort";
import { OrganizationType } from "../../../models/user-login-state";
import { cloneDeep } from "../../../lodash-optimized";
import { BalanceStockTransactionReportRequest, SearchStockTransactionReportRequest, StockTransactionReportRequest, TransactionStockReportResponse } from "../../../models/api-models/Inventory";
import { InventoryService } from "../../../services/inventory.service";
import { NewInventoryAdavanceSearch } from "../new-inventory-advance-search/new-inventory-advance-search.component";
import { ToasterService } from "../../../services/toaster.service";
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
@Component({
    selector: "inventory-transaction-list",
    templateUrl: "./inventory-transaction-list.component.html",
    styleUrls: ["./inventory-transaction-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class InventoryTransactionListComponent implements OnInit {

    /** Instance of datepicker */
    @ViewChild('datepickerTemplate') public datepickerTemplate: ElementRef;
    /** Instance of  account name searching column */
    @ViewChild('accountName', { static: true }) public accountName: ElementRef;
    /** Instance of sort header */
    @ViewChild(MatSort) sort: MatSort;
    /** Instance of cdk virtual scroller */
    @ViewChildren(CdkVirtualScrollViewport) virtualScroll: QueryList<CdkVirtualScrollViewport>;
    /** Emits the scroll to bottom event when pagination is required  */
    @Output() public scrollEnd: EventEmitter<void> = new EventEmitter();
    /** This will use for instance of warehouses Dropdown */
    public warehousesDropdown: FormControl = new FormControl();
    /** This will use for instance of branches Dropdown */
    public branchesDropdown: FormControl = new FormControl();
    /** Thsi will use for searching for stock */
    public searchAccountName: FormControl = new FormControl();
    /** Search field form control */
    public searchFilters: FormControl = new FormControl();
    /* This will store datepicker modal reference */
    public modalRef: BsModalRef;
    /* dayjs object */
    public dayjs = dayjs;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Stock Transactional Object */
    public stockReportRequest: StockTransactionReportRequest = new StockTransactionReportRequest();
    /** Stock Transactional Object */
    public searchStockReportRequest: SearchStockTransactionReportRequest = new SearchStockTransactionReportRequest();
    /** Stock Transactional Object */
    public balanceStockReportRequest: BalanceStockTransactionReportRequest = new BalanceStockTransactionReportRequest();
    /** Stock Transactional Report Balance Response */
    public stockTransactionReportBalance: TransactionStockReportResponse;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /* This will hold active company data */
    public activeCompany: any = {};
    /** This will store universalDate */
    public universalDate: any;
    /** Image path variable */
    public imgPath: string = '';
    /** Universal date observer */
    public universalDate$: Observable<any>;
    /** This will store selected date range to use in api */
    public selectedDateRange: any;
    /** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /** This will store available date ranges */
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /** Selected range label */
    public selectedRangeLabel: any = "";
    /** This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /** Hold warehouse checked  */
    public selectedWarehouse: any[] = [];
    /** List of warehouses */
    public warehouses: any[] = [];
    /** Hold branches checked  */
    public selectedBranch: any[] = [];
    /*Hold stock transaction report data */
    public dataSource = [];
    /**Hold branches */
    public branches: any[] = [];
    /** This will use for stock report voucher types column check values */
    public voucherTypes: any[] = [
        {
            "value": "SALES",
            "label": "Sales",
            "checked": false
        },
        {
            "value": "PURCHASE",
            "label": "Purchase",
            "checked": false
        },
        {
            "value": "SALES_CREDIT_NOTE",
            "label": "Sales credit note",
            "checked": false
        },
        {
            "value": "SALES_DEBIT_NOTE",
            "label": "Sales debit note",
            "checked": false
        },
        {
            "value": "PURCHASE_DEBIT_NOTE",
            "label": "Purchase debit note",
            "checked": false
        },
        {
            "value": "PURCHASE_CREDIT_NOTE",
            "label": "Purchase credit note",
            "checked": false
        },
        {
            "value": "DELIVERY_NOTE",
            "label": "Delivery challan",
            "checked": false
        },
        {
            "value": "RECEIPT_NOTE",
            "label": "Receipt note",
            "checked": false
        },
        {
            "value": "MANUFACTURED",
            "label": "Manufactured",
            "checked": false
        },
        {
            "value": "RAW_MATERIAL",
            "label": "Raw material",
            "checked": false
        },
    ];
    /** This will use for stock report displayed columns */
    public displayedColumns: string[] = [];
    /** This will use for stock report voucher types column check values */
    public customiseColumns = [
        {
            "value": "entry_date",
            "label": "Date",
            "checked": true
        },
        {
            "value": "voucherType",
            "label": "Voucher Type",
            "checked": true
        },
        {
            "value": "accountName",
            "label": "Account Name",
            "checked": true

        },
        {
            "value": "stockName",
            "label": "Stock Name",
            "checked": true

        },
        {
            "value": "variantName",
            "label": "Variant Name",
            "checked": true

        },
        {
            "value": "inward_quantity",
            "label": "Invards",
            "checked": true

        },
        {
            "value": "outward_quantity",
            "label": "Outwards",
            "checked": true

        },
        {
            "value": "rate",
            "label": "Rate",
            "checked": true

        },
        {
            "value": "transaction_val",
            "label": "Value",
            "checked": true

        }
    ];
    /** Hold all warehouses */
    public allWarehouses: any[] = [];
    /** Hold all warehouses */
    public allBranches: any[] = [];
    /** Hold current warehouses */
    public currentWarehouses: any[] = [];
    /** List of chips based on selected values */
    public filtersChipList: any[] = [];
    /** Filtered options to show in autocomplete list */
    public fieldFilteredOptions: any[] = [];
    /** Hold all branch warehouses */
    public allBranchWarehouses: any;
    /** Emit with seperate code for filtersChipList */
    public separatorKeysCodes: number[] = [ENTER, COMMA];
    /** Hold group unique name */
    public groupUniqueName: string;
    /** Hold stockunique name */
    public stockUniqueName: string;
    /** Hold From Date*/
    public toDate: string;
    /** Hold To Date*/
    public fromDate: string;
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    public isCompany: boolean;
    /** True if show clear */
    public showClearFilter: boolean = false;
    /** True if show advance search model*/
    public showAdvanceSearchModal: boolean = false;
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** True if search account name */
    public showAccountSearchInput: boolean = false;
    /** Hold advance search modal response */
    public advanceSearchModalResponse: object = null;
    /** True if data available */
    public isDataAvailable: boolean = false;

    constructor(
        private generalService: GeneralService,
        public dialog: MatDialog,
        public modalService: BsModalService,
        private changeDetection: ChangeDetectorRef,
        private inventoryService: InventoryService,
        private toaster: ToasterService,
        private store: Store<AppState>) {
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));
    }

    /**
     * This hook will use  on component initialization
     *
     * @memberof InventoryTransactionListComponent
     */
    public ngOnInit(): void {
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
        /** Universal date observer */
        this.universalDate$.subscribe(dateObj => {
            if (dateObj) {
                this.fromDate = dayjs(dateObj[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = dayjs(dateObj[1]).format(GIDDH_DATE_FORMAT);
                this.universalDate = _.cloneDeep(dateObj);
                this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.stockReportRequest.from = this.fromDate;
                this.stockReportRequest.to = this.toDate;
                this.balanceStockReportRequest.from = this.fromDate;
                this.balanceStockReportRequest.to = this.toDate;
                this.getStockTransactionalReport(true);
                this.getReportColumns();
            }
        });

        this.searchAccountName.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe(search => {
            this.stockReportRequest.accountName = search;
            this.balanceStockReportRequest.accountName = search;
            this.isFilterActive();
            this.getStockTransactionalReport();
            if (search === '') {
                this.showAccountSearchInput = false;
            }
        });

        this.branchesDropdown.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(search => {
            let branchesClone = cloneDeep(this.allBranches);
            if (search) {
                branchesClone = this.allBranches?.filter(branch => (branch.alias?.toLowerCase()?.indexOf(search?.toLowerCase()) > -1));
            }
            this.branches = branchesClone;
        });

        this.warehousesDropdown.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(search => {
            let warehousesClone = cloneDeep(this.currentWarehouses);
            if (search) {
                warehousesClone = this.currentWarehouses?.filter(warehouse => (warehouse.name?.toLowerCase()?.indexOf(search?.toLowerCase()) > -1));
            }
            this.warehouses = warehousesClone;
        });

        this.searchFilters?.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText !== null && searchedText !== undefined && typeof searchedText === 'string') {
                this.searchStockReportRequest.q = searchedText;
                this.searchStockTransactionReport();
            }
        });
        this.getBranchWiseWarehouse();
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompany = activeCompany;
            }
        });
        this.searchStockTransactionReport();
    }

    /**
     *  This will use for select filters in chiplist
     *
     * @param {*} option
     * @return {*}  {void}
     * @memberof InventoryTransactionListComponent
     */
    public selectChiplistValue(option: any): void {
        const selectOptionValue = option?.option?.value;
        if (option?.option?.value?.type === 'STOCK GROUP') {
            this.stockReportRequest.stockGroupUniqueNames = [option?.option?.value?.uniqueName];
        } else if (option?.option?.value?.type === 'STOCK') {
            const findStockColumnCheck = this.customiseColumns?.find(value => value?.value === "stockName");
            if (this.stockReportRequest.stockUniqueNames?.length === 0 && findStockColumnCheck?.checked) {
                findStockColumnCheck.checked = false;
                this.displayedColumns = this.displayedColumns?.filter(value => value !== "stockName");
            } else if (this.stockReportRequest.stockUniqueNames?.length > 0 && !findStockColumnCheck?.checked) {
                findStockColumnCheck.checked = true;
                this.filteredDisplayColumns();
            }
            this.stockReportRequest.stockUniqueNames?.push(option?.option?.value?.uniqueName);
        } else {
            const findVariantColumnCheck = this.customiseColumns?.find(value => value?.value === "variantName");
            if (this.stockReportRequest.variantUniqueNames?.length === 0 && findVariantColumnCheck?.checked) {
                findVariantColumnCheck.checked = false;
                this.displayedColumns = this.displayedColumns.filter(value => value !== "variantName");
            } else if (this.stockReportRequest.variantUniqueNames?.length > 0 && !findVariantColumnCheck?.checked) {
                findVariantColumnCheck.checked = true;
                this.filteredDisplayColumns();
            }
            this.stockReportRequest.variantUniqueNames?.push(option?.option?.value?.uniqueName);
        }
        this.balanceStockReportRequest.stockGroupUniqueNames = this.stockReportRequest.stockGroupUniqueNames;
        this.balanceStockReportRequest.stockUniqueNames = this.stockReportRequest.stockUniqueNames;
        this.balanceStockReportRequest.variantUniqueNames = this.stockReportRequest.variantUniqueNames;
        this.filtersChipList?.push(selectOptionValue);
        this.isFilterActive();
        this.searchStockReportRequest.q = "";
        this.searchStockTransactionReport();
        this.getStockTransactionalReport();
    }

    /**
     * This will use for remove chiplist from search filter
     *
     * @param {*} selectOptionValue
     * @param {number} index
     * @memberof InventoryTransactionListComponent
     */
    public removeOption(selectOptionValue: any, index: number): void {
        this.filtersChipList?.splice(index, 1);
        if (selectOptionValue) {
            if (selectOptionValue.type === "STOCK GROUP") {
                this.stockReportRequest.stockGroupUniqueNames = this.stockReportRequest.stockGroupUniqueNames?.filter(value => value != selectOptionValue.uniqueName);
            }
            if (selectOptionValue.type === "STOCK") {
                this.stockReportRequest.stockUniqueNames = this.stockReportRequest.stockUniqueNames.filter(value => value != selectOptionValue.uniqueName);
                if (this.stockReportRequest.stockUniqueNames.length <= 1) {
                    this.customiseColumns.find(value => value?.value === "stockName").checked = (this.stockReportRequest.stockUniqueNames?.length === 1 ? false : true);
                    this.filteredDisplayColumns();
                }
            }
            if (selectOptionValue.type === "VARIANT") {
                this.stockReportRequest.variantUniqueNames = this.stockReportRequest.variantUniqueNames?.filter(value => value != selectOptionValue.uniqueName);
                if (this.stockReportRequest.variantUniqueNames?.length <= 1) {
                    this.customiseColumns.find(value => value?.value === "variantName").checked = (this.stockReportRequest.variantUniqueNames.length === 1 ? false : true);
                    this.filteredDisplayColumns();
                }
            }
            this.balanceStockReportRequest.stockGroupUniqueNames = this.stockReportRequest.stockGroupUniqueNames;
            this.balanceStockReportRequest.stockUniqueNames = this.stockReportRequest.stockUniqueNames;
            this.balanceStockReportRequest.variantUniqueNames = this.stockReportRequest.variantUniqueNames;
            this.isFilterActive();
            this.searchStockTransactionReport();
            this.getStockTransactionalReport();
            this.changeDetection.detectChanges();
        }
    }

    /**
     * This will use for get stock transaction report filters
     *
     * @memberof InventoryTransactionListComponent
     */
    public searchStockTransactionReport(loadMore?: boolean): void {
        this.searchStockReportRequest.stockGroupUniqueNames = this.stockReportRequest.stockGroupUniqueNames;
        this.searchStockReportRequest.stockUniqueNames = this.stockReportRequest.stockUniqueNames;
        this.searchStockReportRequest.variantUniqueNames = this.stockReportRequest.variantUniqueNames;
        this.balanceStockReportRequest.stockGroupUniqueNames = this.stockReportRequest.stockGroupUniqueNames;
        this.balanceStockReportRequest.stockUniqueNames = this.stockReportRequest.stockUniqueNames;
        this.balanceStockReportRequest.variantUniqueNames = this.stockReportRequest.variantUniqueNames;
        if (loadMore) {
            this.searchStockReportRequest.page++;
        } else {
            this.searchStockReportRequest.page = 1;
        }
        if (this.searchStockReportRequest.page === 1 || this.searchStockReportRequest.page <= this.searchStockReportRequest.totalPages) {
            delete this.searchStockReportRequest.totalItems;
            delete this.searchStockReportRequest.totalPages;
            this.inventoryService.searchStockTransactionReport(this.searchStockReportRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response && response.body && response.status === 'success') {
                    this.fieldFilteredOptions = response.body.results;
                    this.searchStockReportRequest.totalItems = response.body.totalItems;
                    this.searchStockReportRequest.totalPages = response.body.totalPages;
                } else {
                    this.fieldFilteredOptions = [];
                    this.searchStockReportRequest.totalItems = 0;
                    this.toaster.showSnackBar("warning", response?.body);
                }
                this.changeDetection.detectChanges();
            });
        }
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
        if (!this.showAdvanceSearchModal) {
            this.stockReportRequest.from = this.fromDate;
            this.stockReportRequest.to = this.toDate;
            this.balanceStockReportRequest.from = this.fromDate;
            this.balanceStockReportRequest.to = this.toDate;
        }

        this.dataSource = [];
        this.isLoading = true;

        if (!this.isCompany) {
            this.stockReportRequest.branchUniqueNames = this.generalService.currentBranchUniqueName ? [this.generalService.currentBranchUniqueName] : [];
            this.balanceStockReportRequest.branchUniqueNames = this.generalService.currentBranchUniqueName ? [this.generalService.currentBranchUniqueName] : [];
        }
        this.inventoryService.getStockTransactionReport(cloneDeep(this.stockReportRequest)).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.isLoading = false;
            if (response && response.body && response.status === 'success') {
                this.isDataAvailable = (response.body.transactions?.length) ? true : this.showClearFilter;
                this.dataSource = response.body.transactions;
                this.stockReportRequest.page = response.body.page;
                this.stockReportRequest.totalItems = response.body.totalItems;
                this.stockReportRequest.totalPages = response.body.totalPages;
                this.stockReportRequest.count = response.body.count;
            } else {
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
     *Call back function for date/range selection in datepicker
     *
     * @param {*} [value]
     * @return {*}  {void}
     * @memberof InventoryTransactionListComponent
     */
    public dateSelectedCallback(value?: any): void {
        if (value && value.event === "cancel") {
            this.hideGiddhDatepicker();
            return;
        }
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.hideGiddhDatepicker();
        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
            this.stockReportRequest.from = this.fromDate;
            this.stockReportRequest.to = this.toDate;
            this.balanceStockReportRequest.from = this.fromDate;
            this.balanceStockReportRequest.to = this.toDate;

        }
        this.getStockTransactionalReport();
    }

    /**
   * This will hide the datepicker
   *
   * @memberof InventoryTransactionListComponent
   */
    public hideGiddhDatepicker(): void {
        this.modalRef?.hide();
    }

    /**
     *To show the datepicker
     *
     * @param {*} element
     * @memberof InventoryTransactionListComponent
     */
    public showGiddhDatepicker(element: any): void {
        if (element) {
            this.dateFieldPosition = this.generalService.getPosition(element.target);
        }
        this.modalRef = this.modalService.show(
            this.datepickerTemplate,
            Object.assign({}, { class: 'modal-lg giddh-datepicker-modal', backdrop: false, ignoreBackdropClick: false })
        );
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
            this.searchStockReportRequest.page = event?.page;
            this.getStockTransactionalReport();
        }
    }

    /**
     * This will use for open modal dialog
     *
     * @memberof InventoryTransactionListComponent
     */
    public openModal(): void {
        this.showAdvanceSearchModal = true;
        let dialogRef = this.dialog?.open(NewInventoryAdavanceSearch, {
            panelClass: 'advance-search-container',
            data: {
                stockReportRequest: this.stockReportRequest,
                advanceSearchResponse: this.advanceSearchModalResponse
            }
        });
        dialogRef.afterClosed().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.advanceSearchModalResponse = response;
                this.isFilterActive();
                this.onShowAdvanceSearchFilter(response);
            }
            this.changeDetection.detectChanges();
        });
        this.changeDetection.detectChanges();
    }

    /**
     * This will use for on show advance search filter modal
     *
     * @param {*} data
     * @memberof InventoryTransactionListComponent
     */
    public onShowAdvanceSearchFilter(data: any): void {
        if (data) {
            this.stockReportRequest.param = data.stockReportRequest?.param;
            this.stockReportRequest.expression = data.stockReportRequest?.expression;
            this.stockReportRequest.from = data.stockReportRequest?.fromDate;
            this.stockReportRequest.to = data.stockReportRequest?.toDate;
            this.stockReportRequest.val = data.stockReportRequest?.val;
            this.balanceStockReportRequest.param = data.stockReportRequest?.param;
            this.balanceStockReportRequest.expression = data.stockReportRequest?.expression;
            this.balanceStockReportRequest.val = data.stockReportRequest?.val;
            this.balanceStockReportRequest.from = data.stockReportRequest?.fromDate;
            this.balanceStockReportRequest.to = data.stockReportRequest?.toDate;
        }
        this.showAdvanceSearchModal = true;
        this.getStockTransactionalReport();
        this.changeDetection.detectChanges();
    }

    /**
     * This will use for sorting filters
     *
     * @param {*} event
     * @memberof InventoryTransactionListComponent
     */
    public sortChange(event: any): void {
        this.stockReportRequest.sort = event?.direction;
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
            return "Account Name";
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
     *  This will use for get branch wise warehouse
     *
     * @memberof InventoryTransactionListComponent
     */
    public getBranchWiseWarehouse(): void {
        this.inventoryService.getLinkedStocks().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.body) {
                this.allBranchWarehouses = response.body;
                this.allBranches = response.body.results?.filter(branch => branch?.isCompany !== true);
                this.branches = response.body.results?.filter(branch => branch?.isCompany !== true);
                this.allWarehouses = [];
                this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch;
            }
            this.getBranches(false);
            this.changeDetection.detectChanges();
        });
    }

    /**
     * This will use for get warehouses
     *
     * @memberof InventoryTransactionListComponent
     */
    public getWarehouses(): void {
        this.stockReportRequest.warehouseUniqueNames = this.selectedWarehouse;
        this.balanceStockReportRequest.warehouseUniqueNames = this.selectedWarehouse;
        this.isFilterActive();
        this.getStockTransactionalReport();
    }

    /**
     * This will use for get branches
     *
     * @param {boolean} [apiCall=true]
     * @memberof InventoryTransactionListComponent
     */
    public getBranches(apiCall: boolean = true): void {
        this.selectedWarehouse = [];
        this.allWarehouses = [];
        if (!this.isCompany) {
            let currentBranch = this.allBranches?.filter(branch => branch?.uniqueName === this.generalService.currentBranchUniqueName);
            this.allWarehouses = currentBranch[0]?.warehouses;
        } else {
            this.allBranches?.forEach((branches) => {
                this.allWarehouses = this.allWarehouses?.concat(branches?.warehouses);
            });
        }

        if (this.selectedBranch?.length === 0) {
            this.warehouses = this.allWarehouses;
        } else {
            let warehouses = [];
            this.branches?.filter(value => this.selectedBranch?.includes(value?.uniqueName))?.forEach((branches) => {
                warehouses = warehouses?.concat(branches?.warehouses);
            });
            this.warehouses = warehouses;
        }
        this.currentWarehouses = this.warehouses;
        this.stockReportRequest.branchUniqueNames = this.selectedBranch?.length ? this.selectedBranch : [];
        this.stockReportRequest.warehouseUniqueNames = [];
        this.balanceStockReportRequest.branchUniqueNames = this.selectedBranch?.length ? this.selectedBranch : [];
        this.balanceStockReportRequest.warehouseUniqueNames = [];
        if (apiCall) {
            this.getStockTransactionalReport();
        }

        this.isFilterActive();
        this.changeDetection.detectChanges();
    }

    /**
     * This will use for reset filters
     *
     * @param {boolean} [isReset]
     * @memberof InventoryTransactionListComponent
     */
    public resetFilter(isReset?: boolean) {
        this.showClearFilter = false;
        this.showAccountSearchInput = false;
        this.advanceSearchModalResponse = null;
        this.stockReportRequest = new StockTransactionReportRequest();
        this.balanceStockReportRequest = new BalanceStockTransactionReportRequest();
        this.searchStockReportRequest = new SearchStockTransactionReportRequest();
        this.filtersChipList = [];
        this.selectedBranch = [];
        this.getBranches(false);
        //Reset Date with universal date
        this.universalDate$.subscribe(dateObj => {
            if (dateObj) {
                this.stockReportRequest.from = dayjs(dateObj[0]).format(GIDDH_DATE_FORMAT);
                this.stockReportRequest.to = dayjs(dateObj[1]).format(GIDDH_DATE_FORMAT);
                this.balanceStockReportRequest.from = dayjs(dateObj[0]).format(GIDDH_DATE_FORMAT);
                this.balanceStockReportRequest.to = dayjs(dateObj[1]).format(GIDDH_DATE_FORMAT);
                this.fromDate = dayjs(dateObj[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = dayjs(dateObj[1]).format(GIDDH_DATE_FORMAT);
                let universalDate = cloneDeep(dateObj);
                this.selectedDateRange = { startDate: dayjs(universalDate[0]), endDate: dayjs(universalDate[1]) };
                this.selectedDateRangeUi = dayjs(universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
            }
        });
        this.voucherTypes.forEach(response => {
            response.checked = false;
        });
        if (this.searchAccountName.value === null) {
            this.getStockTransactionalReport(true);
        } else {
            this.searchAccountName.reset();
        }
        this.changeDetection.detectChanges();
    }

    /**
     *This will use for check is any filter active
     *
     * @memberof InventoryTransactionListComponent
     */
    public isFilterActive(): void {
        if (this.selectedBranch?.length || this.selectedWarehouse?.length
            || this.filtersChipList?.length || this.advanceSearchModalResponse || this.stockReportRequest?.voucherTypes?.length || this.stockReportRequest.accountName?.length) {
            this.showClearFilter = true;
        } else {
            this.showClearFilter = false;
        }
    }

    /**
     * This will use for filter by check for Voucher type s column
     *
     * @param {string} type
     * @memberof InventoryTransactionListComponent
     */
    public filterByCheck(type: string): void {
        setTimeout(() => {
            if (!this.stockReportRequest.voucherTypes?.includes(type)) {
                this.stockReportRequest.voucherTypes?.push(type);
            } else {
                this.stockReportRequest.voucherTypes = this.stockReportRequest.voucherTypes?.filter(value => value != type);
            }
            this.balanceStockReportRequest.voucherTypes = this.stockReportRequest.voucherTypes;
            this.stockReportRequest.page = 1;
            this.isFilterActive();
            this.getStockTransactionalReport();
            this.changeDetection.detectChanges();
        });
    }

    /**
     *This will use for get customise columns
     *
     * @memberof InventoryTransactionListComponent
     */
    public getReportColumns(): void {
        this.inventoryService.getStockTransactionReportColumns("INVENTORY_TRANSACTION_REPORT").pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.body && response.status === 'success') {
                if (response.body?.columns) {
                    this.customiseColumns?.forEach(column => {
                        if (!response.body.columns?.includes(column?.value)) {
                            column.checked = false;
                        }
                    });
                }
            }
            this.filteredDisplayColumns();
        });
    }

    /**
     *This will use for save customise columns
     *
     * @memberof InventoryTransactionListComponent
     */
    public saveColumns(): void {
        setTimeout(() => {
            this.filteredDisplayColumns();
            let saveColumnReq = {
                module: "INVENTORY_TRANSACTION_REPORT",
                columns: this.displayedColumns
            }
            this.inventoryService.saveStockTransactionReportColumns(saveColumnReq).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                this.isLoading = false;
            });
        });
    }

    /**
     *This will use for select all customse columns
     *
     * @param {*} event
     * @memberof InventoryTransactionListComponent
     */
    public selectAllColumns(event: any): void {
        this.customiseColumns?.forEach(column => {
            if (column) {
                column.checked = event;
            }
        });
        this.filteredDisplayColumns();
        this.saveColumns();
        this.changeDetection.detectChanges();
    }

    /**
     *This will use for filtering the display columns
     *
     * @memberof InventoryTransactionListComponent
     */
    public filteredDisplayColumns(): void {
        this.displayedColumns = this.customiseColumns?.filter(value => value?.checked).map(column => column?.value);
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

}
