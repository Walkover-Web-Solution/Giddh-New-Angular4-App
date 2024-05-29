import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { NewConfirmationModalComponent } from "../../theme/new-confirmation-modal/confirmation-modal.component";
import { ConfirmationModalConfiguration } from "../../theme/confirmation-modal/confirmation-modal.interface";
import { GeneralService } from "../../services/general.service";
import { TemplatePreviewDialogComponent } from "../template-preview-dialog/template-preview-dialog.component";
import { TemplateEditDialogComponent } from "../template-edit-dialog/template-edit-dialog.component";
import { Observable, ReplaySubject, debounceTime, delay, distinctUntilChanged, take, takeUntil } from "rxjs";
import { VouchersUtilityService } from "../utility/vouchers.utility.service";
import { VoucherComponentStore } from "../utility/vouchers.store";
import { AppState } from "../../store";
import { Store } from "@ngrx/store";
import * as dayjs from "dayjs";
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from "../../shared/helpers/defaultDateFormat";
import { MULTI_CURRENCY_MODULES, PAGE_SIZE_OPTIONS, VoucherTypeEnum } from "../utility/vouchers.const";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { GIDDH_DATE_RANGE_PICKER_RANGES, PAGINATION_LIMIT } from "../../app.constant";
import { cloneDeep } from "../../lodash-optimized";
import { FormControl } from "@angular/forms";
import * as saveAs from "file-saver";
import { ToasterService } from "../../services/toaster.service";
import { InvoiceReceiptActions } from "../../actions/invoice/receipt/receipt.actions";
import { InvoiceService } from "../../services/invoice.service";

// invoice-table
export interface PeriodicElement {
    invoice: string;
    position: number;
    customer: string;
    invoicedate: string;
    amount: string;
    balance: string;
    duedate: string;
    invoicestatus: string;
    status: string;
}

// estimate-table
export interface PeriodicElementEstimate {
    estimate: string;
    position: number;
    customer: string;
    estimatedate: string;
    amount: string;
    expirydate: string;
    status: string;
    action: string;
}
// estimate-table
const ESTIMATE_DATA: PeriodicElementEstimate[] = [
    { position: 1, estimate: 'EST-20240111-1', customer: '00000000', estimatedate: '11-01-2024', amount: 'H', expirydate: '11-01-2024', status: '', action: '' },
    { position: 2, estimate: 'EST-20240111-1', customer: '00000000', estimatedate: '11-01-2024', amount: 'H', expirydate: '11-01-2024', status: '', action: '' },
    { position: 3, estimate: 'EST-20240111-1', customer: '00000000', estimatedate: '11-01-2024', amount: 'H', expirydate: '11-01-2024', status: '', action: '' },
    { position: 4, estimate: 'EST-20240111-1', customer: '00000000', estimatedate: '11-01-2024', amount: 'H', expirydate: '11-01-2024', status: '', action: '' },
    { position: 5, estimate: 'EST-20240111-1', customer: '00000000', estimatedate: '11-01-2024', amount: 'H', expirydate: '11-01-2024', status: '', action: '' },
    { position: 6, estimate: 'EST-20240111-1', customer: '00000000', estimatedate: '11-01-2024', amount: 'H', expirydate: '11-01-2024', status: '', action: '' }
];

// prforma-table
export interface PeriodicElementProforma {
    proforma: string;
    position: number;
    customer: string;
    proformadate: string;
    amount: string;
    expirydate: string;
    status: string;
    action: string;
}
// prforma-table
const PROFORMA_DATA: PeriodicElementProforma[] = [
    { position: 1, proforma: 'PR-20240111-2', customer: '00000000', proformadate: '11-01-2024', amount: 'H', expirydate: '11-01-2024', status: '', action: '' }
];

// pending-table
export interface PeriodicElementPending {
    date: string;
    position: number;
    particular: string;
    amount: string;
    account: string;
    total: string;
    description: string;
}
// pending-table
const PENDING_DATA: PeriodicElementPending[] = [
    { position: 1, date: '08-04-2023', particular: 'Sales', amount: 'H', account: 'USA debtor', total: '₹23.1', description: '' }
];

// credit-table
export interface PeriodicElementCredit {
    credit: string;
    position: number;
    customer: string;
    date: string;
    linked: string;
    amount: string;
    einvoicestatus: string;
    status: string;
}
// credit-table
const CREDIT_DATA: PeriodicElementCredit[] = [
    { position: 1, credit: 'Hydrogen', customer: '1.0079', date: 'H', linked: 'H', amount: '', einvoicestatus: '', status: '' }
];

// purchase-table
export interface PeriodicElementPurchase {
    date: string;
    position: number;
    purchase: string;
    vendorname: string;
    amount: string;
    delivery: string;
    status: string;
}
// purchase-table
const PURCHASE_DATA: PeriodicElementPurchase[] = [
    { position: 1, date: '11-01-2024', purchase: '2116', vendorname: '14 April', amount: 'H', delivery: 'Delayed By 8 Days', status: '' },
    { position: 2, date: '11-01-2024', purchase: '2116', vendorname: '14 April', amount: 'H', delivery: 'Delayed By 8 Days', status: '' },
    { position: 3, date: '11-01-2024', purchase: '2116', vendorname: '14 April', amount: 'H', delivery: 'Delayed By 8 Days', status: '' },
    { position: 4, date: '11-01-2024', purchase: '2116', vendorname: '14 April', amount: 'H', delivery: 'Delayed By 8 Days', status: '' }
];

// bill-table
export interface PeriodicElementBill {
    bill: string;
    position: number;
    vendor: string;
    billdate: string;
    order: string;
    amount: string;
    duedate: string;
    status: string;
}
// bill-table
const BILL_DATA: PeriodicElementBill[] = [
    { position: 1, bill: 'Hydrogen', vendor: 'Ashish RANJAN', billdate: 'H', order: 'H', amount: '', duedate: '', status: '' }
];

@Component({
    selector: "list",
    templateUrl: "./list.component.html",
    styleUrls: ["./list.component.scss"],
    providers: [VoucherComponentStore]
})
export class VoucherListComponent implements OnInit, OnDestroy {
    public moduleType: string = "";
    // invoice table data
    public displayedColumns: string[] = ['index', 'invoice', 'customer', 'voucherDate', 'grandTotal', 'balanceDue', 'dueDate', 'invoicestatus', 'status'];
    public dataSource: any[] = [];

    // estimate-table
    displayedColumnEstimate: string[] = ['position', 'estimate', 'customer', 'estimatedate', 'amount', 'expirydate', 'status', 'action'];
    dataSourceEstimate = new MatTableDataSource<PeriodicElementEstimate>(ESTIMATE_DATA);
    // proforma-table
    displayedColumnProforma: string[] = ['position', 'proforma', 'customer', 'proformadate', 'amount', 'expirydate', 'status', 'action'];
    dataSourceProforma = new MatTableDataSource<PeriodicElementProforma>(PROFORMA_DATA);
    // pending-table
    displayedColumnPending: string[] = ['position', 'date', 'particular', 'amount', 'account', 'total', 'description'];
    dataSourcePending = new MatTableDataSource<PeriodicElementPending>(PENDING_DATA);
    // credit-table
    displayedColumnsCredit: string[] = ['position', 'credit', 'customer', 'date', 'linked', 'amount', 'einvoicestatus', 'status'];
    dataSourceCredit = new MatTableDataSource<PeriodicElementCredit>(CREDIT_DATA);
    // purchase-table
    displayedColumnPurchase: string[] = ['position', 'date', 'purchase', 'vendorname', 'amount', 'delivery', 'status'];
    dataSourcePurchase = new MatTableDataSource<PeriodicElementPurchase>(PURCHASE_DATA);
    // bill-table
    displayedColumnsBill: string[] = ['position', 'bill', 'vendor', 'billdate', 'order', 'amount', 'duedate', 'status'];
    dataSourceBill = new MatTableDataSource<PeriodicElementBill>(BILL_DATA);

    // advance search dialog
    @ViewChild('advanceSearch', { static: true }) public advanceSearch: TemplateRef<any>;
    // export dialog
    @ViewChild('bulkExport', { static: true }) public bulkExport: TemplateRef<any>;
    // export dialog
    @ViewChild('paidDialog', { static: true }) public paidDialog: TemplateRef<any>;
    // adjust payment dialog
    @ViewChild('adjustPaymentDialog', { static: true }) public adjustPaymentDialog: TemplateRef<any>;
    // bulk update dialog
    @ViewChild('bulkUpdate', { static: true }) public bulkUpdate: TemplateRef<any>;
    // table paginator
    @ViewChild(MatPaginator) paginator: MatPaginator;
    // convert bill dialog
    @ViewChild('convertBill', { static: true }) public convertBill: TemplateRef<any>;
    // E-way bill dialog
    @ViewChild('ewayBill', { static: true }) public ewayBill: TemplateRef<any>;
    // table sorting
    @ViewChild(MatSort) sort: MatSort;
    public showCustomerSearch: boolean = false;
    public showInvoiceNoSearch: boolean = false;
    public voucherNumberInput: FormControl = new FormControl();
    public accountUniqueNameInput: FormControl = new FormControl();
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /* Hold invoice  type*/
    public voucherType: any = '';
    public dayjs = dayjs;
    public modalRef: BsModalRef;
    /** directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: TemplateRef<any>;
    public selectedDateRange: any;
    /** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /** This will store available date ranges */
    public datePickerOption: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /** Selected range label */
    public selectedRangeLabel: any = "";
    /** This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Last vouchers get in progress Observable */
    public getVouchersInProgress$: Observable<any> = this.componentStore.getLastVouchersInProgress$;
    public invoiceSelectedDate: any = {
        fromDates: '',
        toDates: ''
    };
    public isUniversalDateApplicable: boolean = false;
    public activeTabGroup: number = 0;
    public activeModule: string = "list";
    public tabsGroups: any[][] = [
        ["estimates", "proformas", "sales"],
        ["debit note", "credit note"],
        ["purchase-order", "purchase"]
    ];
    public selectedTabIndex: number = 2;
    /** Holds universal date */
    public universalDate: any;
    public advanceFilters: any = {
        sortBy: 'voucherDate',
        sort: 'desc',
        type: 'sales',
        from: '',
        to: '',
        page: 1,
        count: PAGINATION_LIMIT,
        q: ''
    };
    public voucherBalances: any = {
        grandTotal: 0,
        totalDue: 0
    };
    /** Holds company specific data */
    public company: any = {
        baseCurrency: '',
        baseCurrencySymbol: '',
        inputMaskFormat: '',
        giddhBalanceDecimalPlaces: 0
    };
    /** True, if user has enable GST E-invoice */
    public isEInvoiceEnabled: boolean;
    public pageSizeOptions: any[] = PAGE_SIZE_OPTIONS;
    public totalResults: number = 0;
    public selectedVouchers: any[] = [];
    /** Holds Voucher Name that suports csv file export */
    public csvSupportVoucherType: string[] = ['sales', 'debit note', 'credit note', 'purchase'];
    public allVouchersSelected: boolean = false;
    public ewayBillDialogRef: any;
    public advanceSearchDialogRef: any;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private componentStore: VoucherComponentStore,
        private store: Store<AppState>,
        private generalService: GeneralService,
        private vouchersUtilityService: VouchersUtilityService,
        private modalService: BsModalService,
        private toasterService: ToasterService,
        private invoiceReceiptActions: InvoiceReceiptActions,
        private invoiceService: InvoiceService
    ) {

    }

    public ngOnInit(): void {
        this.getInvoiceSettings();

        this.componentStore.companyProfile$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.company.baseCurrency = response.baseCurrency;
                this.company.baseCurrencySymbol = response.baseCurrencySymbol;
                this.company.inputMaskFormat = response.balanceDisplayFormat?.toLowerCase() || '';
                this.company.giddhBalanceDecimalPlaces = response.balanceDecimalPlaces;
            }
        });

        this.activatedRoute.params.pipe(delay(0), takeUntil(this.destroyed$)).subscribe(params => {
            this.voucherType = this.vouchersUtilityService.parseVoucherType(params.voucherType);
            this.activeModule = params.module;
            this.advanceFilters.type = this.voucherType;

            this.activeTabGroup = this.tabsGroups.findIndex(group => group.includes(this.voucherType));
            if (this.activeTabGroup === -1) {
                this.activeTabGroup = 0; // default to the first group if not found
            }

            this.getSelectedTabIndex();

            if (this.universalDate) {
                this.getVouchers(true);
                this.getVoucherBalances();
            }
        });

        /** Universal date */
        this.componentStore.universalDate$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                if (localStorage.getItem('universalSelectedDate')) {
                    let universalStorageData = localStorage.getItem('universalSelectedDate').split(',');
                    if ((dayjs(universalStorageData[0]).format(GIDDH_DATE_FORMAT) === dayjs(response[0]).format(GIDDH_DATE_FORMAT)) && (dayjs(universalStorageData[1]).format(GIDDH_DATE_FORMAT) === dayjs(response[1]).format(GIDDH_DATE_FORMAT))) {
                        if (window.localStorage && localStorage.getItem('invoiceSelectedDate')) {
                            let storedSelectedDate = JSON.parse(localStorage.getItem('invoiceSelectedDate'));
                            let dateRange = { fromDate: '', toDate: '' };
                            dateRange = this.generalService.dateConversionToSetComponentDatePicker(storedSelectedDate.fromDates, storedSelectedDate.toDates);
                            this.selectedDateRange = { startDate: dayjs(dateRange.fromDate), endDate: dayjs(dateRange.toDate) };
                            this.selectedDateRangeUi = dayjs(dateRange.fromDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateRange.toDate).format(GIDDH_NEW_DATE_FORMAT_UI);
                            // assign dates
                            if (storedSelectedDate.fromDates && storedSelectedDate.toDates) {
                                this.advanceFilters.from = storedSelectedDate.fromDates;
                                this.advanceFilters.to = storedSelectedDate.toDates;
                                this.isUniversalDateApplicable = false;
                            }
                        } else {
                            this.selectedDateRange = { startDate: dayjs(response[0]), endDate: dayjs(response[1]) };
                            this.selectedDateRangeUi = dayjs(response[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(response[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                            // assign dates

                            this.advanceFilters.from = dayjs(response[0]).format(GIDDH_DATE_FORMAT);
                            this.advanceFilters.to = dayjs(response[1]).format(GIDDH_DATE_FORMAT);
                            this.isUniversalDateApplicable = true;
                        }
                    } else {
                        this.selectedDateRangeUi = dayjs(response[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(response[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                        this.selectedDateRange = { startDate: dayjs(response[0]), endDate: dayjs(response[1]) };
                        // assign dates

                        this.advanceFilters.from = dayjs(response[0]).format(GIDDH_DATE_FORMAT);
                        this.advanceFilters.to = dayjs(response[1]).format(GIDDH_DATE_FORMAT);
                        this.isUniversalDateApplicable = true;
                    }
                } else {
                    this.selectedDateRange = { startDate: dayjs(response[0]), endDate: dayjs(response[1]) };
                    this.selectedDateRangeUi = dayjs(response[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(response[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                    // assign dates

                    this.advanceFilters.from = dayjs(response[0]).format(GIDDH_DATE_FORMAT);
                    this.advanceFilters.to = dayjs(response[1]).format(GIDDH_DATE_FORMAT);
                    this.isUniversalDateApplicable = true;

                    if (window.localStorage) {
                        localStorage.setItem('universalSelectedDate', response);
                    }
                }
                this.universalDate = dayjs(response[1]).format(GIDDH_DATE_FORMAT);
                this.getVouchers(true);
                this.getVoucherBalances();
            }
        });

        this.componentStore.voucherBalances$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.voucherBalances = response;
            }
        });

        this.componentStore.lastVouchers$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.dataSource = [];
                this.totalResults = response?.totalItems;
                response.items?.forEach((item: any, index: number) => {
                    item.index = index + 1;

                    if (MULTI_CURRENCY_MODULES?.indexOf(this.voucherType) > -1) {
                        // For CR/DR note and Cash/Sales invoice
                        item = this.generalService.addToolTipText(this.voucherType, this.company.baseCurrency, item, this.localeData, this.commonLocaleData, this.company.giddhBalanceDecimalPlaces);

                        if (this.isEInvoiceEnabled) {
                            item.eInvoiceStatusTooltip = this.vouchersUtilityService.getEInvoiceTooltipText(item, this.localeData);
                        }
                    }

                    this.dataSource.push(item);
                });
            }
        });

        this.componentStore.exportVouchersFile$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.selectedVouchers = [];
                this.allVouchersSelected = false;
                let blob = this.generalService.base64ToBlob(response, 'application/xls', 512);
                const fileName = `${this.vouchersUtilityService.getExportFileNameByVoucherType(this.voucherType, this.allVouchersSelected, this.localeData)}.xls`
                return saveAs(blob, fileName);
            }
        });

        this.componentStore.eInvoiceGenerated$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.componentStore.resetGenerateEInvoice();
                this.getVouchers(this.isUniversalDateApplicable);
            }
        });

        this.componentStore.bulkUpdateVoucherIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.selectedVouchers = [];
                this.allVouchersSelected = false;
                this.getVouchers(this.isUniversalDateApplicable);
            }
        });

        this.voucherNumberInput.valueChanges.pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(search => {
            if (search !== null && search !== undefined) {
                this.advanceFilters.q = search;
                this.getVouchers(this.isUniversalDateApplicable);
            }
        });

        this.accountUniqueNameInput.valueChanges.pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(search => {
            if (search !== null && search !== undefined) {
                this.advanceFilters.q = search;
                this.getVouchers(this.isUniversalDateApplicable);
            }
        });
    }

    private getSelectedTabIndex(): void {
        if (this.activeTabGroup === 0) {
            if (this.voucherType === 'estimates' && this.activeModule === 'list') {
                this.selectedTabIndex = 0;
            } else if (this.voucherType === 'proformas' && this.activeModule === 'list') {
                this.selectedTabIndex = 1;
            } else if (this.voucherType === 'sales' && this.activeModule === 'list') {
                this.selectedTabIndex = 2;
            } else if (this.voucherType === 'sales' && this.activeModule === 'pending') {
                this.selectedTabIndex = 3;
            } else if (this.voucherType === 'sales' && this.activeModule === 'settings') {
                this.selectedTabIndex = 4;
            } else if (this.voucherType === 'sales' && this.activeModule === 'templates') {
                this.selectedTabIndex = 5;
            }
        } else if (this.activeTabGroup === 1) {
            if (this.voucherType === 'debit note' && this.activeModule === 'list') {
                this.selectedTabIndex = 0;
            } else if (this.voucherType === 'credit note' && this.activeModule === 'list') {
                this.selectedTabIndex = 1;
            } else if (this.voucherType === 'debit note' && this.activeModule === 'pending') {
                this.selectedTabIndex = 2;
            } else if (this.voucherType === 'debit note' && this.activeModule === 'settings') {
                this.selectedTabIndex = 3;
            } else if (this.voucherType === 'debit note' && this.activeModule === 'templates') {
                this.selectedTabIndex = 4;
            }
        } else if (this.activeTabGroup === 2) {
            if (this.voucherType === 'purchase-order' && this.activeModule === 'list') {
                this.selectedTabIndex = 0;
            } else if (this.voucherType === 'purchase' && this.activeModule === 'list') {
                this.selectedTabIndex = 1;
            } else if (this.voucherType === 'purchase' && this.activeModule === 'settings') {
                this.selectedTabIndex = 2;
            }
        }
    }

    private redirectToSelectedTab(selectedTabIndex: number): void {
        let voucherType = "";
        let activeModule = "";
        if (this.activeTabGroup === 0) {
            if (selectedTabIndex === 0) {
                voucherType = "estimates";
                activeModule = "list";
            } else if (selectedTabIndex === 1) {
                voucherType = "proformas";
                activeModule = "list";
            } else if (selectedTabIndex === 2) {
                voucherType = "sales";
                activeModule = "list";
            } else if (selectedTabIndex === 3) {
                voucherType = "sales";
                activeModule = "pending";
            } else if (selectedTabIndex === 4) {
                voucherType = "sales";
                activeModule = "settings";
            } else if (selectedTabIndex === 5) {
                voucherType = "sales";
                activeModule = "templates";
            }
        } else if (this.activeTabGroup === 1) {
            if (selectedTabIndex === 0) {
                voucherType = "debit-note";
                activeModule = "list";
            } else if (selectedTabIndex === 1) {
                voucherType = "credit-note";
                activeModule = "list";
            } else if (selectedTabIndex === 2) {
                voucherType = "debit-note";
                activeModule = "pending";
            } else if (selectedTabIndex === 3) {
                voucherType = "debit-note";
                activeModule = "settings";
            } else if (selectedTabIndex === 4) {
                voucherType = "debit-note";
                activeModule = "templates";
            }
        } else if (this.activeTabGroup === 2) {
            if (selectedTabIndex === 0) {
                voucherType = "purchase-order";
                activeModule = "list";
            } else if (selectedTabIndex === 1) {
                voucherType = "purchase";
                activeModule = "list";
            } else if (selectedTabIndex === 2) {
                voucherType = "purchase";
                activeModule = "settings";
            }
        }

        this.router.navigate(['/pages/vouchers/preview/' + voucherType + '/' + activeModule]);
    }

    public tabChanged(selectedTabIndex: any): void {
        this.selectedTabIndex = selectedTabIndex;
        this.redirectToSelectedTab(selectedTabIndex);
    }

    public getVouchers(isUniversalDateApplicable: boolean): void {
        if (this.voucherType === VoucherTypeEnum.generateProforma || this.voucherType === VoucherTypeEnum.generateEstimate) {

        } else {
            this.getAllVouchers();
        }
    }

    public getVoucherBalances(): void {
        if (this.voucherType === VoucherTypeEnum.sales) {
            this.componentStore.getVoucherBalances({ requestType: this.voucherType, payload: cloneDeep(this.advanceFilters) });
        }
    }

    private getAllVouchers(): void {
        this.componentStore.getPreviousVouchers({ model: cloneDeep(this.advanceFilters), type: this.voucherType });
    }

    public sortChange(event: any): void {
        this.advanceFilters.sort = event?.direction ? event?.direction : 'asc';
        this.advanceFilters.sortBy = event?.active;
        this.advanceFilters.page = 1;
        this.getVouchers(false);
    }

    public handlePageChange(event: any): void {
        this.advanceFilters.count = event.pageSize;
        this.advanceFilters.page = event.pageIndex + 1;
        this.getVouchers(false);
    }

    public selectVoucher(event: any, voucher: any): void {
        if (event?.checked) {
            this.selectedVouchers.push(voucher);
        } else {
            this.selectedVouchers = this.selectedVouchers?.filter(selectedVoucher => selectedVoucher?.uniqueName !== voucher?.uniqueName);
        }
    }

    public selectAllVouchers(event: any): void {
        this.selectedVouchers = [];
        this.allVouchersSelected = event?.checked;
        if (event?.checked) {
            this.dataSource?.forEach(voucher => {
                this.selectedVouchers.push(voucher);
            });
        }
    }

    public exportCsvDownload(): any {
        let exportCsvRequest = { from: '', to: '', dataToSend: null };
        exportCsvRequest.from = this.advanceFilters.from;
        exportCsvRequest.to = this.advanceFilters.to;
        let dataTosend = { uniqueNames: [], type: this.voucherType };
        if (this.selectedVouchers?.length) {
            dataTosend.uniqueNames = this.selectedVouchers?.map(voucher => { return voucher?.uniqueName });
            exportCsvRequest.dataToSend = dataTosend;
            this.componentStore.exportVouchers(exportCsvRequest);
        }
    }

    public generateEInvoice(): void {
        this.componentStore.generateEInvoice({ payload: { voucherUniqueNames: this.selectedVouchers?.map(voucher => { return voucher?.uniqueName }), voucherType: this.voucherType }, actionType: 'einvoice' });
    }

    /**
     * Returns the overdue days text
     *
     * @param {*} days
     * @returns {string}
     * @memberof InvoicePreviewComponent
     */
    public getOverdueDaysText(days: any): string {
        let overdueDays = this.localeData?.overdue_days;
        overdueDays = overdueDays?.replace("[DAYS]", days);
        return overdueDays;
    }

    /**
     * Gets invoice settings
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private getInvoiceSettings(): void {
        this.componentStore.invoiceSettings$.pipe(takeUntil(this.destroyed$)).subscribe(settings => {
            if (!settings) {
                this.componentStore.getInvoiceSettings();
            } else {
                this.isEInvoiceEnabled = settings.invoiceSettings?.gstEInvoiceEnable;
            }
        });
    }

    /**
    * To show the datepicker
    *
    * @param {*} element
    * @memberof VoucherListComponent
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
     * This will hide the datepicker
     *
     * @memberof VoucherListComponent
     */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof VoucherListComponent
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
            this.advanceFilters.from = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.advanceFilters.to = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);

            if (window.localStorage) {
                localStorage.setItem('invoiceSelectedDate', JSON.stringify(this.invoiceSelectedDate));
            }
            this.getVouchers(this.isUniversalDateApplicable);
            this.getVoucherBalances();
        }
    }

    public ngOnDestroy(): void {
        if (window.localStorage) {
            localStorage.removeItem('universalSelectedDate');
            localStorage.removeItem('invoiceSelectedDate');
        }
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    // filter dialog 
    public advanceSearchDialog(): void {
        this.advanceSearchDialogRef = this.dialog.open(this.advanceSearch, {
            panelClass: ['mat-dialog-md']
        });
    }

    // export dialog
    public showBulkExportDialog(): void {
        this.dialog.open(this.bulkExport, {
            width: '600px',
            data: {
                voucherUniqueNames: this.selectedVouchers?.map(voucher => { return voucher?.uniqueName }),
                voucherType: this.voucherType,
                advanceFilters: this.advanceFilters,
                totalItems: this.selectedVouchers?.length || this.totalResults
            }
        });
    }

    // paid dialog
    public onPerformAction(): void {
        this.dialog.open(this.paidDialog, {
            panelClass: ['mat-dialog-md']
        });
    }
    // adjust payment dialog
    public adjustPayment(): void {
        this.dialog.open(this.adjustPaymentDialog, {
            panelClass: ['mat-dialog-md']
        });
    }
    // bulk update dialog 
    public bulkUpdateDialog(): void {
        this.dialog.open(this.bulkUpdate, {
            panelClass: ['mat-dialog-md']
        });
    }
    // delete confirmation dialog
    public deleteVoucherDialog(): void {
        let confirmationMessages = [];
        this.localeData?.confirmation_messages?.map(message => {
            confirmationMessages[message.module] = message;
        });

        const configuration = this.generalService.getVoucherDeleteConfiguration(confirmationMessages[this.voucherType]?.title, confirmationMessages[this.voucherType]?.message1, confirmationMessages[this.voucherType]?.message2, this.commonLocaleData);

        const dialogRef = this.dialog.open(NewConfirmationModalComponent, {
            panelClass: ['mat-dialog-md'],
            data: {
                configuration: configuration
            }
        });

        dialogRef.afterClosed().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response === this.commonLocaleData?.app_yes) {
                let payload = {
                    voucherUniqueNames: this.selectedVouchers?.map(voucher => { return voucher?.uniqueName }),
                    voucherType: this.voucherType
                };

                this.componentStore.bulkUpdateInvoice({ payload: payload, actionType: 'delete' });
            }
        });
    }
    // template dialog
    public templateDialog(): void {
        this.dialog.open(TemplatePreviewDialogComponent, {
            width: '980px'
        });
    }
    // template edit dialog
    public templateEdit(): void {
        this.dialog.open(TemplateEditDialogComponent, {
            width: '100%',
            height: '100vh'
        });
    }

    public toggleSearch(event: any, fieldName: string): void {
        if (fieldName === "accountUniqueName") {
            this.showCustomerSearch = true;
        } else if (fieldName === "invoiceNumber") {
            this.showInvoiceNoSearch = true;
        }
        event.stopPropagation();
    }

    public hideSearchFields(): void {
        this.showCustomerSearch = false;
        this.showInvoiceNoSearch = false;
    }

    // convert bill dialog
    public ConvertBillDialog(): void {
        this.dialog.open(this.convertBill, {
            width: '600px'
        })
    }

    public showEwayBillDialog(): void {
        if (this.voucherType === VoucherTypeEnum.sales) {
            this.store.dispatch(this.invoiceReceiptActions.ResetVoucherDetails());
            // To get re-assign receipts voucher store
            if (this.selectedVouchers[0]?.account?.uniqueName) {
                this.store.dispatch(this.invoiceReceiptActions.getVoucherDetailsV4(this.selectedVouchers[0]?.account?.uniqueName, {
                    invoiceNumber: this.selectedVouchers[0]?.voucherNumber,
                    voucherType: VoucherTypeEnum.sales,
                    uniqueName: this.selectedVouchers[0]?.uniqueName
                }));
            }

            this.invoiceService.selectedInvoicesLists = [];
            this.invoiceService.VoucherType = this.voucherType;
            this.invoiceService.setSelectedInvoicesList(this.selectedVouchers);
        }

        this.ewayBillDialogRef = this.dialog.open(this.ewayBill, {
            width: '600px'
        });
    }

    public createEwayBill(): void {
        this.componentStore.createEwayBill$.pipe(take(1)).subscribe(response => {
            if (!response?.account?.billingDetails?.pincode) {
                this.toasterService.showSnackBar("error", this.localeData?.pincode_required);
            } else {
                this.router.navigate(['pages', 'invoice', 'ewaybill', 'create']);
            }
        });
    }

    public isVoucherSelected(voucher: any): boolean {
        const isSelected = this.selectedVouchers?.filter(selectedVoucher => selectedVoucher?.uniqueName === voucher?.uniqueName);
        return isSelected?.length ? true : false;
    }

    public applyAdvanceSearch(event: any): void {
        let advanceFilters = {
            sortBy: this.advanceFilters.sortBy,
            sort: this.advanceFilters.sort,
            type: this.advanceFilters.type,
            from: this.advanceFilters.from,
            to: this.advanceFilters.to,
            page: 1,
            count: PAGINATION_LIMIT,
            q: this.advanceFilters.q
        };

        this.advanceFilters = event;
        this.advanceFilters.sortBy = advanceFilters.sortBy;
        this.advanceFilters.sort = advanceFilters.sort;
        this.advanceFilters.type = advanceFilters.type;
        this.advanceFilters.from = advanceFilters.from;
        this.advanceFilters.to = advanceFilters.to;
        this.advanceFilters.page = advanceFilters.page;
        this.advanceFilters.count = advanceFilters.count;
        this.advanceFilters.q = advanceFilters.q;

        this.getVouchers(false);
        this.getVoucherBalances();
    }

    public closeAdvanceSearchDialog(isClosed: boolean): void {
        if (isClosed) {
            this.selectAllVouchers({ checked: false });
        }
        this.advanceSearchDialogRef?.close();
    }
}