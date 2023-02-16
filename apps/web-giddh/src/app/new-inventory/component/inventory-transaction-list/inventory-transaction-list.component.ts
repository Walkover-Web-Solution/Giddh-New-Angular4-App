import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { GeneralService } from "../../../services/general.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { GIDDH_DATE_RANGE_PICKER_RANGES, PAGINATION_LIMIT } from "../../../app.constant";
import * as dayjs from "dayjs";
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from "../../../shared/helpers/defaultDateFormat";
import { Observable, ReplaySubject } from "rxjs";
import { select, Store } from "@ngrx/store";
import { AppState } from "../../../store";
import { debounceTime, distinctUntilChanged, take, takeUntil } from "rxjs/operators";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSort } from "@angular/material/sort";
import { OrganizationType } from "../../../models/user-login-state";
import { WarehouseActions } from "../../../settings/warehouse/action/warehouse.action";
import { cloneDeep } from "../../../lodash-optimized";
import { StockReportRequestNew, TransactionalStockReportResponse } from "../../../models/api-models/Inventory";
import { InventoryService } from "../../../services/inventory.service";
import { NewInventoryAdavanceSearch } from "../new-inventory-advance-search/new-inventory-advance-search.component";
import { ToasterService } from "../../../services/toaster.service";

@Component({
    selector: "inventory-transaction-list",
    templateUrl: "./inventory-transaction-list.component.html",
    styleUrls: ["./inventory-transaction-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class InventoryTransactionListComponent implements OnInit {

    /** Directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: ElementRef;
    /** Instance of mail modal */
    @ViewChild('accountName', { static: true }) public accountName: ElementRef;
    @ViewChild('searchBox', { static: true }) public searchBox: ElementRef;
    /** Instance of sort header */
    @ViewChild(MatSort) sort: MatSort;
    public displayedColumns: string[] = ["date", "voucherType", "accountName", "inwards", "outwards", "rate", "value"];
    public dataSource = [];
    /* This will store modal reference */
    public modalRef: BsModalRef;
    /* dayjs object */
    public dayjs = dayjs;
    /** True, if custom date filter is selected or custom searching or sorting is performed */
    public showClearFilter: boolean = true;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** This will store universalDate */
    public universalDate: any;
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
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** Hold warehouse checked  */
    public selectedWarehouse: any[] = [];
    /** This will use for instance of lwarehouses Dropdown */
    public warehousesDropdown: FormControl = new FormControl();
    /** List of warehouses */
    public warehouses: any[] = [];
    /** Hold warehouse checked  */
    public selectedBranch: any[] = [];
    /** This will use for instance of lwarehouses Dropdown */
    public branchesDropdown: FormControl = new FormControl();
    public VOUCHER_TYPES: any[] = [
        {
            "value": "SALES",
            "label": "Sales",
            "checked": true
        },
        {
            "value": "PURCHASE",
            "label": "Purchase",
            "checked": true
        },
        {
            "value": "MANUFACTURING",
            "label": "Manufacturing",
            "checked": true
        },
        {
            "value": "TRANSFER",
            "label": "Transfer",
            "checked": true
        },
        {
            "value": "JOURNAL",
            "label": "Journal Voucher",
            "checked": true
        },
        {
            "value": "CREDIT_NOTE",
            "label": "Credit Note",
            "checked": true
        },
        {
            "value": "DEBIT_NOTE",
            "label": "Debit Note",
            "checked": true
        }
    ];

    public REPORT_COLUMNS: any[] = [
        {
            "value": "date",
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
            "value": "inwards",
            "label": "Invards",
            "checked": true
        },
        {
            "value": "outwards",
            "label": "Outwards",
            "checked": true
        },
        {
            "value": "rate",
            "label": "Rate",
            "checked": true
        },
        {
            "value": "value",
            "label": "Value",
            "checked": true
        }
    ];
    /** Thsi will use for searching for stock */
    public accountNameSearching: FormControl = new FormControl();
    /** Image path variable */
    public imgPath: string = '';
    public showAccountSearch: boolean = false;
    /** Current branches */
    public branches: Array<any>;
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    public isCompany: boolean;
    /** Hold all warehouses */
    public allWarehouses: any[] = [];
    /** Hold all warehouses */
    public allBranches: any[] = [];
    public groupUniqueName: string;
    public stockUniqueName: string;
    public stockReportRequest: StockReportRequestNew = new StockReportRequestNew();
    public toDate: string;
    public fromDate: string;
    public isFilterCorrect: boolean = false;
    public stockTransactionReportBalance: TransactionalStockReportResponse;
    public showAdvanceSearchModal: boolean = false;
    /** True/false if select all is checked */
    public selectAll: boolean = false;

    constructor(
        private generalService: GeneralService,
        public dialog: MatDialog,
        public modalService: BsModalService,
        private warehouseAction: WarehouseActions,
        private changeDetection: ChangeDetectorRef,
        private inventoryService: InventoryService,
        private toaster: ToasterService,
        private store: Store<AppState>) {
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));
    }


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
                this.stockReportRequest = Object.assign({}, this.stockReportRequest, {
                    dataToSend: Object.assign({}, this.stockReportRequest.dataToSend, {
                        bsRangeValue: [dateObj[0], dateObj[1]]
                    })
                });
                this.getStockTransactionalReport(false, true);
            }
        });

        this.accountNameSearching.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe(s => {
            this.isFilterCorrect = true;
            this.stockReportRequest.accountName = s;
            this.getStockTransactionalReport(false, true);
            if (s === '') {
                this.showAccountSearch = false;
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
            let warehousesClone = cloneDeep(this.allWarehouses);
            if (search) {
                warehousesClone = this.allWarehouses?.filter(warehouse => (warehouse.name?.toLowerCase()?.indexOf(search?.toLowerCase()) > -1));
            }
            this.warehouses = warehousesClone;
        });

        this.getBranches();
        this.getWarehouses();
        this.initVoucherType();
        this.getReportColumns();
    }


    public getStockTransactionalReport(resetPage?: boolean, type?: boolean): void {
        this.isLoading = true;
        if (!this.showAdvanceSearchModal) {
            this.stockReportRequest.from = this.fromDate;
            this.stockReportRequest.to = this.toDate;
        }
        // Condition sah krna h galat h API se issue h
        if (type) {
            this.stockReportRequest.voucherTypes = [];
        }
        if (!this.stockReportRequest.stockGroupUniqueNames || !this.stockReportRequest.stockUniqueNames) {
            return;
        }
        if (resetPage) {
            this.stockReportRequest.page = 1;
            this.stockReportRequest.count = PAGINATION_LIMIT;
        }
        delete this.stockReportRequest.dataToSend;
        this.inventoryService.GetStockTransactionReport(cloneDeep(this.stockReportRequest)).subscribe(response => {
            this.isLoading = false;
            if (response && response.body && response.status === 'success') {
                this.dataSource = response.body.transactions;
                this.stockReportRequest.page = response.body.page;
                this.stockReportRequest.totalItems = response.body.totalItems;
                this.stockReportRequest.totalPages = response.body.totalPages;
                this.stockReportRequest.count = response.body.count;
            } else {
                this.dataSource = [];
                this.stockReportRequest.totalItems = 0;
                // this.toaster.showSnackBar("error", response?.message);
            }
            this.changeDetection.detectChanges();
        });
        delete this.stockReportRequest.count;
        delete this.stockReportRequest.page;
        delete this.stockReportRequest.transactionType;
        this.inventoryService.GetStockTransactionReportBalance(cloneDeep(this.stockReportRequest)).subscribe(response => {
            this.isLoading = false;
            if (response && response.body && response.status === 'success') {
                this.stockTransactionReportBalance = response.body;
            } else {
                // this.toaster.showSnackBar("error", response?.message);
            }
            this.changeDetection.detectChanges();
        });
    }

    /**
     *Call back function for date/range selection in datepicker
     *
     * @param {*} [value]
     * @return {*}  {void}
     * @memberof InventoryTransactionListComponent
     */
    public dateSelectedCallback(value?: any, from?: any): void {
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
            this.stockReportRequest.from = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.stockReportRequest.to = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
            this.fromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
        }
        this.stockReportRequest = Object.assign({}, this.stockReportRequest, {
            dataToSend: Object.assign({}, this.stockReportRequest.dataToSend, {
                bsRangeValue: [value.startDate, value.endDate]
            })
        });
        this.isFilterCorrect = true;
        this.getStockTransactionalReport(false, true);

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
        if (this.stockReportRequest.page !== event.page) {
            this.stockReportRequest.page = event.page;
            this.getStockTransactionalReport(false, true);

        }
    }

    public openModal(): void {
        this.showAdvanceSearchModal = true;

        let dialogRef = this.dialog.open(NewInventoryAdavanceSearch, {
            panelClass: 'advance-search-container',
            data: {
                stockReportRequest: this.stockReportRequest
            }
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                this.onShowAdvanceSearchFilter(response);
            }
        });
    }

    public onShowAdvanceSearchFilter(data: any): void {
        console.log(data);

        // let advanceSearch = cloneDeep(this.stockReportRequest);
        if (data) {
            this.stockReportRequest.param = data.stockReportRequest.param;
            this.stockReportRequest.expression = data.stockReportRequest.expression;
            this.stockReportRequest.from = data.stockReportRequest.fromDate;
            this.stockReportRequest.to = data.stockReportRequest.toDate;
            this.stockReportRequest.val = data.stockReportRequest.val;
            this.isFilterCorrect = data.stockReportRequest.searching;
        }
        console.log(this.stockReportRequest);
        this.showAdvanceSearchModal = true;
        this.getStockTransactionalReport(false, false);

        this.changeDetection.detectChanges();
    }

    public sortChange(event: any): void {
        if (this.stockReportRequest.sort !== event?.direction) {
            this.stockReportRequest.sort = event?.direction;
            this.stockReportRequest.sortBy = event?.active;
            this.getStockTransactionalReport(false, true);

        }
        this.isFilterCorrect = true;
    }


    public toggleSearch(fieldName: string): void {
        if (fieldName === "name") {
            this.showAccountSearch = true;
        }
    }

    public getSearchFieldText(fieldName: string): string {
        if (fieldName === "name") {
            return "Account Name";
        }
        return "";
    }

    public handleClickOutside(event: any, element: any, searchedFieldName: string): void {
        if (searchedFieldName === "name") {
            if (this.accountNameSearching?.value) {
                return;
            }
            if (this.generalService.childOf(event.target, element)) {
                return;
            } else {
                this.showAccountSearch = false;
            }
        }
    }


    public getWarehouses(): void {
        this.store.pipe(select(state => state.warehouse.warehouses), takeUntil(this.destroyed$)).subscribe((warehouses: any) => {
            if (warehouses) {
                this.warehouses = warehouses.results;
                this.allWarehouses = warehouses.results;
            } else {
                this.store.dispatch(this.warehouseAction.fetchAllWarehouses({ page: 1, count: 0 }));
            }
            this.changeDetection.detectChanges();
        });
    }

    public getBranches(): void {
        this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.branches = response || [];
                this.allBranches = response;
                this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch && this.branches?.length > 1;
            }
            this.changeDetection.detectChanges();
        });
    }

    public initVoucherType() {
        // initialization for voucher type array inially all selected
        this.stockReportRequest.voucherTypes = [];
        this.VOUCHER_TYPES.forEach(element => {
            element.checked = true;
            this.stockReportRequest.voucherTypes.push(element.value);
            this.changeDetection.detectChanges();
        });
    }

    //******* Advance search modal *******//
    public resetFilter(isReset?: boolean) {
        this.accountNameSearching.reset();
        this.stockReportRequest.sort = null;
        this.stockReportRequest.sortBy = null;
        this.stockReportRequest.accountName = null;
        this.showAccountSearch = false;
        this.stockReportRequest.val = null;
        this.stockReportRequest.param = null;
        this.stockReportRequest.expression = null;

        this.initVoucherType();
        //Reset Date with universal date
        this.universalDate$.subscribe(dateObj => {
            if (dateObj) {
                this.stockReportRequest.from = dayjs(dateObj[0]).format(GIDDH_DATE_FORMAT);
                this.stockReportRequest.to = dayjs(dateObj[1]).format(GIDDH_DATE_FORMAT);
                this.fromDate = dayjs(dateObj[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = dayjs(dateObj[1]).format(GIDDH_DATE_FORMAT);
                let universalDate = cloneDeep(dateObj);
                this.selectedDateRange = { startDate: dayjs(universalDate[0]), endDate: dayjs(universalDate[1]) };
                this.selectedDateRangeUi = dayjs(universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
            }
            this.isFilterCorrect = false;
        });
        this.changeDetection.detectChanges();
    }


    public filterByCheck(type: string, event: boolean) {
        let idx = this.stockReportRequest.voucherTypes?.indexOf('ALL');
        if (idx !== -1) {
            this.initVoucherType();
        }
        if (event && type) {
            this.stockReportRequest.voucherTypes.push(type);
        } else {
            let index = this.stockReportRequest.voucherTypes?.indexOf(type);
            if (index !== -1) {
                this.stockReportRequest.voucherTypes.splice(index, 1);
            }
        }
        if (this.stockReportRequest.voucherTypes?.length > 0 && this.stockReportRequest.voucherTypes?.length < this.VOUCHER_TYPES.length) {
            idx = this.stockReportRequest.voucherTypes?.indexOf('ALL');
            if (idx !== -1) {
                this.stockReportRequest.voucherTypes.splice(idx, 1);
            }
            idx = this.stockReportRequest.voucherTypes?.indexOf('NONE');
            if (idx !== -1) {
                this.stockReportRequest.voucherTypes.splice(idx, 1);
            }
        }
        if (this.stockReportRequest.voucherTypes?.length === this.VOUCHER_TYPES.length) {
            this.stockReportRequest.voucherTypes = ['ALL'];
        }
        if (this.stockReportRequest.voucherTypes?.length === 0) {
            this.stockReportRequest.voucherTypes = ['NONE'];
        }
        this.getStockTransactionalReport(false, false);
        this.isFilterCorrect = true;
        this.changeDetection.detectChanges();
    }

    public getReportColumns(): void {
        this.inventoryService.getStockTransactionReportColumns("INVENTORY_TRANSACTION_REPORT").subscribe(response => {
            this.isLoading = false;
            if (response && response.body && response.status === 'success') {
                if (response.body?.columns && response.body?.columns.length > 0) {
                    this.REPORT_COLUMNS = response.body.columns;
                }
            } else {
                this.toaster.showSnackBar("error", response?.message);
            }
            this.changeDetection.detectChanges();
        });
    }

    public saveColumns(value: string, event: boolean): void {
        if (this.displayedColumns.includes(value)) {
            this.displayedColumns = this.displayedColumns.filter(col => col !== value);
        } else {
            this.displayedColumns.push(value);
        }
        console.log(this.REPORT_COLUMNS);
        // let columnsArr = cloneDeep(this.REPORT_COLUMNS);
        // let updatedColumns = columnsArr.filter(column => column.value === value)
        let saveColumnReq = {
            module: "INVENTORY_TRANSACTION_REPORT",
            columns: this.REPORT_COLUMNS
        }
        this.inventoryService.saveStockTransactionReportColumns(saveColumnReq).subscribe(response => {
            this.isLoading = false;
            if (response && response.body && response.status === 'success') {
                this.toaster.showSnackBar("success", response.message);
            } else {
                this.toaster.showSnackBar("error", response?.message);
            }
            this.changeDetection.detectChanges();
        });
    }

    public selectAllColumns(event:any): void {
        console.log(this.REPORT_COLUMNS);

        Object.keys(this.REPORT_COLUMNS).forEach(key => {
            console.log(key);

            this.REPORT_COLUMNS[key].visibility = event
        });
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }



}
