import { Component, OnInit, ViewChild, ElementRef, TemplateRef, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
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
import { CompanyResponse } from "../../../models/api-models/Company";
import { WarehouseActions } from "../../../settings/warehouse/action/warehouse.action";
import { cloneDeep } from "../../../lodash-optimized";
import { StockReportRequest, StockReportRequestNew, StockReportResponse } from "../../../models/api-models/Inventory";
import { InventoryService } from "../../../services/inventory.service";

export interface PeriodicElement {
    date: string;
    voucherType: string;
    accountName: string;
    inwards: string;
    outwards: string;
    rate: string;
    value: string;
}


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
    @ViewChild("inventoryAdvanceSearch") public inventoryAdvanceSearch: TemplateRef<any>;
    @ViewChild('accountName', { static: true }) public accountName: ElementRef;
    @ViewChild('searchBox', { static: true }) public searchBox: ElementRef;
    /** Instance of sort header */
    @ViewChild(MatSort) sortBy: MatSort;
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
    /** This will use for activity logs object */
    public inventoryObj = {
        count: PAGINATION_LIMIT,
        page: 1,
        totalPages: 0,
        totalItems: 0,
        fromDate: "",
        toDate: ""
    }
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
    public stockReportRequest: StockReportRequestNew;
    public stockReport: StockReportResponse;
    public toDate: string;
    public fromDate: string;



    constructor(
        private generalService: GeneralService,
        public dialog: MatDialog,
        public modalService: BsModalService,
        private warehouseAction: WarehouseActions,
        private changeDetection: ChangeDetectorRef,
        private inventoryService: InventoryService,
        private store: Store<AppState>) {
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));
        this.stockReportRequest = new StockReportRequestNew();
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
                this.getStockReport(true);
            }
        });
        this.store.dispatch(this.warehouseAction.fetchAllWarehouses({ page: 1, count: 0 }));

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
        this.initReport();
    }

    public initReport() {
        this.stockReportRequest.stockGroupUniqueNames = [];
        this.stockReportRequest.stockUniqueNames = [];
        this.stockReportRequest.transactionType = 'all';
        this.stockReportRequest.warehouseUniqueNames = [];
        this.stockReportRequest.branchUniqueNames = [];
        this.stockReportRequest.voucherTypes = null;
        this.stockReportRequest.val = 0;
        this.stockReportRequest.param = null;
        this.stockReportRequest.expression = null;
        this.inventoryService.GetStocksReportNew_v2(cloneDeep(this.stockReportRequest)).subscribe(res => {
            this.dataSource = res?.body?.transactions;
            this.changeDetection.detectChanges();
        });
    }


    public getStockReport(resetPage: boolean) {
        this.stockReportRequest.from = this.fromDate || null;
        this.stockReportRequest.to = this.toDate || null;
        if (resetPage) {
            this.stockReportRequest.page = 1;
        }
        if (!this.stockReportRequest.stockGroupUniqueNames || !this.stockReportRequest.stockUniqueNames) {
            return;
        }
        if (!this.stockReportRequest.expression || !this.stockReportRequest.param || !this.stockReportRequest.val) {
            delete this.stockReportRequest.expression;
            delete this.stockReportRequest.param;
            delete this.stockReportRequest.val;
        }
        this.inventoryService.GetStocksReportNew_v2(cloneDeep(this.stockReportRequest)).subscribe(res => {
            console.log(res);
        });
        this.changeDetection.detectChanges();

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
        }
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
        this.stockReportRequest.page = event.page;
        this.getStockReport(false);
    }
    /* advance serach modal */
    public openModal(): void {
        this.dialog.open(this.inventoryAdvanceSearch, {
            panelClass: 'advance-search-container'
        });
    }

    public sortChange(event: any): void {
    }


    public toggleSearch(fieldName: string, el: any) {
        if (fieldName === 'accountUniqueName') {
            this.showAccountSearch = true;
        }

        setTimeout(() => {
            el.focus();
        }, 200);
    }


    public getSearchFieldText(title: any): string {
        let searchField = "Search Account";
        // searchField = searchField?.replace("[FIELD]", title);
        return searchField;

    }


    public clickedOutside(event: Event, el, fieldName: string) {
        if (fieldName === 'accountUniqueName') {
            if (this.accountNameSearching?.value !== null && this.accountNameSearching?.value !== '') {
                return;
            }
        }
        if (fieldName === 'accountUniqueName') {
            this.showAccountSearch = false;
        }
        this.changeDetection.detectChanges();
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
        });
        this.changeDetection.detectChanges();
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }



}
