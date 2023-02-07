import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from "@angular/core";
import { GeneralService } from "../../../services/general.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { GIDDH_DATE_RANGE_PICKER_RANGES, PAGINATION_LIMIT } from "../../../app.constant";
import * as dayjs from "dayjs";
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from "../../../shared/helpers/defaultDateFormat";
import { Observable, ReplaySubject } from "rxjs";
import { select, Store } from "@ngrx/store";
import { AppState } from "../../../store";
import { takeUntil } from "rxjs/operators";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";

export interface PeriodicElement {
    date: string;
    voucherType: string;
    accountName: string;
    inwards: string;
    outwards: string;
    rate: string;
    value: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {
        date: "09-10-2020",
        voucherType: "SALES",
        accountName: "USD Account",
        inwards: "-",
        outwards: "1.00 Box",
        rate: "1, 02, 378.60",
        value: "1,02,378.60",
    },
    {
        date: "09-10-2020",
        voucherType: "SALES",
        accountName: "USD Account",
        inwards: "-",
        outwards: "1.00 Box",
        rate: "1, 02, 378.60",
        value: "1,02,378.60",
    },
    {
        date: "09-10-2020",
        voucherType: "SALES",
        accountName: "USD Account",
        inwards: "-",
        outwards: "1.00 Box",
        rate: "1, 02, 378.60",
        value: "1,02,378.60",
    },
    {
        date: "09-10-2020",
        voucherType: "SALES",
        accountName: "USD Account",
        inwards: "-",
        outwards: "1.00 Box",
        rate: "1, 02, 378.60",
        value: "1,02,378.60",
    },
    {
        date: "09-10-2020",
        voucherType: "SALES",
        accountName: "USD Account",
        inwards: "-",
        outwards: "1.00 Box",
        rate: "1, 02, 378.60",
        value: "1,02,378.60",
    },
    {
        date: "09-10-2020",
        voucherType: "SALES",
        accountName: "USD Account",
        inwards: "-",
        outwards: "1.00 Box",
        rate: "1, 02, 378.60",
        value: "1,02,378.60",
    },

];

@Component({
    selector: "inventory-transaction-list",
    templateUrl: "./inventory-transaction-list.component.html",
    styleUrls: ["./inventory-transaction-list.component.scss"],
})

export class InventoryTransactionListComponent implements OnInit {

    /** Directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: ElementRef;
    /** Instance of mail modal */
    @ViewChild("inventoryAdvanceSearch") public inventoryAdvanceSearch: TemplateRef<any>;
    displayedColumns: string[] = ["date", "voucherType", "accountName", "inwards", "outwards", "rate", "value"];
    dataSource = ELEMENT_DATA;
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
    /** Warehouse data for warehouse drop down */
    public warehouses: Array<any>;
    /** Hold warehouse checked  */
    public selectedBranch: any[] = [];
    /** This will use for instance of lwarehouses Dropdown */
    public branchesDropdown: FormControl = new FormControl();



    constructor(
        private generalService: GeneralService,
        public dialog: MatDialog,
        public modalService: BsModalService,
        private store: Store<AppState>) {
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));
    }


    public ngOnInit(): void {
        /** Universal date observer */
        this.universalDate$.subscribe(dateObj => {
            if (dateObj) {
                this.universalDate = _.cloneDeep(dateObj);
                this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                // this.getStockTransactions(); This will use for intially api call
            }
        });
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
        if (this.inventoryObj.page !== event.page) {
            this.inventoryObj.page = event.page;
            // this.getStockTransactions(); This will use for get stock transaction according to page chnaged
        }
    }
    /* advance serach modal */
    public openModal(): void {
        this.dialog.open(this.inventoryAdvanceSearch, {
            panelClass: 'advance-search-container'
        });
    }
}
