import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { NewConfirmationModalComponent } from "../../theme/new-confirmation-modal/confirmation-modal.component";
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
import { AdjustAdvancePaymentModal, VoucherAdjustments } from "../../models/api-models/AdvanceReceiptsAdjust";
import { AdjustmentUtilityService } from "../../shared/advance-receipt-adjustment/services/adjustment-utility.service";
import { trigger, state, style, transition, animate } from "@angular/animations";
import { UpdateAccountRequest } from "../../models/api-models/Account";
import { SalesActions } from "../../actions/sales/sales.action";
import { OrganizationType } from "../../models/user-login-state";

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

// // estimate-table
// export interface PeriodicElementEstimate {
//     estimate: string;
//     position: number;
//     customer: string;
//     estimatedate: string;
//     amount: string;
//     expirydate: string;
//     status: string;
//     action: string;
// }
// // estimate-table
// const ESTIMATE_DATA: PeriodicElementEstimate[] = [
//     { position: 1, estimate: 'EST-20240111-1', customer: '00000000', estimatedate: '11-01-2024', amount: 'H', expirydate: '11-01-2024', status: '', action: '' },
//     { position: 2, estimate: 'EST-20240111-1', customer: '00000000', estimatedate: '11-01-2024', amount: 'H', expirydate: '11-01-2024', status: '', action: '' },
//     { position: 3, estimate: 'EST-20240111-1', customer: '00000000', estimatedate: '11-01-2024', amount: 'H', expirydate: '11-01-2024', status: '', action: '' },
//     { position: 4, estimate: 'EST-20240111-1', customer: '00000000', estimatedate: '11-01-2024', amount: 'H', expirydate: '11-01-2024', status: '', action: '' },
//     { position: 5, estimate: 'EST-20240111-1', customer: '00000000', estimatedate: '11-01-2024', amount: 'H', expirydate: '11-01-2024', status: '', action: '' },
//     { position: 6, estimate: 'EST-20240111-1', customer: '00000000', estimatedate: '11-01-2024', amount: 'H', expirydate: '11-01-2024', status: '', action: '' }
// ];

// // prforma-table
// export interface PeriodicElementProforma {
//     proforma: string;
//     position: number;
//     customer: string;
//     proformadate: string;
//     amount: string;
//     expirydate: string;
//     status: string;
//     action: string;
// }
// // prforma-table
// const PROFORMA_DATA: PeriodicElementProforma[] = [
//     { position: 1, proforma: 'PR-20240111-2', customer: '00000000', proformadate: '11-01-2024', amount: 'H', expirydate: '11-01-2024', status: '', action: '' }
// ];

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
    providers: [VoucherComponentStore],
    animations: [
        trigger('slideInOut', [
            state('in', style({
                transform: 'translate3d(0, 0, 0)'
            })),
            state('out', style({
                transform: 'translate3d(100%, 0, 0)'
            })),
            transition('in => out', animate('400ms ease-in-out')),
            transition('out => in', animate('400ms ease-in-out'))
        ]),
    ]
})
export class VoucherListComponent implements OnInit, OnDestroy {
    public moduleType: string = "";
    // invoice table data
    public displayedColumns: string[] = ['index', 'invoice', 'customer', 'voucherDate', 'grandTotal', 'balanceDue', 'dueDate', 'einvoicestatus', 'status'];
    public dataSource: any[] = [];
    // estimate-table
    displayedColumnEstimate: string[] = ['index', 'estimate', 'customer', 'proformaDate', 'grandTotal', 'dueDate', 'status', 'action'];
    // proforma-table
    displayedColumnProforma: string[] = ['position', 'proforma', 'customer', 'proformaDate', 'grandTotal', 'dueDate', 'status', 'action'];
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

    /** Template Reference for Generic aside menu account */
    @ViewChild("accountAsideMenu") public accountAsideMenu: TemplateRef<any>;
    // advance search dialog
    @ViewChild('advanceSearch', { static: true }) public advanceSearch: TemplateRef<any>;
    // export dialog
    @ViewChild('bulkExport', { static: true }) public bulkExport: TemplateRef<any>;
    // export dialog
    @ViewChild('paymentDialog', { static: true }) public paymentDialog: TemplateRef<any>;
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
    public searchedName: FormControl = new FormControl();
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /* Hold invoice  type*/
    public voucherType: any = '';
    public urlVoucherType: any = '';
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
    public advanceFilters: any = {}
    public advanceFiltersApplied: boolean = false;
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
    public voucherDetails: any;
    /** Stores the adjustment data */
    public advanceReceiptAdjustmentData: VoucherAdjustments;
    public isUpdateMode: boolean;
    /** Holds voucher totals */
    public voucherTotals: any = {
        totalAmount: 0,
        totalDiscount: 0,
        totalTaxableValue: 0,
        totalTaxWithoutCess: 0,
        totalCess: 0,
        grandTotal: 0,
        roundOff: 0,
        tcsTotal: 0,
        tdsTotal: 0,
        balanceDue: 0
    };
    /** True if round off will be applicable */
    public applyRoundOff: boolean = true;
    public depositAmount: number = 0;
    /** Hold account aside menu reference  */
    public accountAsideMenuRef: MatDialogRef<any>;
    public accountParentGroup: string = "";
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    public isCompany: boolean;

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
        private invoiceService: InvoiceService,
        private adjustmentUtilityService: AdjustmentUtilityService,
        private salesAction: SalesActions
    ) {

    }

    public ngOnInit(): void {
        this.setInitialAdvanceFilter();
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
            if (params) {
                this.urlVoucherType = params?.voucherType;
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
                            // assign dates
                            if (storedSelectedDate.fromDates && storedSelectedDate.toDates) {
                                let dateRange = { fromDate: '', toDate: '' };
                                dateRange = this.generalService.dateConversionToSetComponentDatePicker(storedSelectedDate.fromDates, storedSelectedDate.toDates);
                                this.selectedDateRange = { startDate: dayjs(dateRange.fromDate), endDate: dayjs(dateRange.toDate) };
                                this.selectedDateRangeUi = dayjs(dateRange.fromDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateRange.toDate).format(GIDDH_NEW_DATE_FORMAT_UI);
                                this.advanceFilters.from = storedSelectedDate.fromDates;
                                this.advanceFilters.to = storedSelectedDate.toDates;
                                this.isUniversalDateApplicable = false;
                            } else {
                                this.selectedDateRange = { startDate: dayjs(response[0]), endDate: dayjs(response[1]) };
                                this.selectedDateRangeUi = dayjs(response[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(response[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
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

                    if (this.voucherType === VoucherTypeEnum.generateEstimate || this.voucherType === VoucherTypeEnum.generateProforma) {
                        item.isSelected = false;
                        item.uniqueName = item.proformaNumber || item.estimateNumber;
                        item.voucherNumber = item.proformaNumber || item.estimateNumber;
                        item.voucherDate = item.proformaDate || item.estimateDate;
                        item.account = { customerName: item.customerName, uniqueName: item.customerUniqueName };

                        let dueDate = item.expiryDate ? dayjs(item.expiryDate, GIDDH_DATE_FORMAT) : null;

                        if (dueDate) {
                            if (dueDate.isAfter(dayjs()) || ['paid', 'cancel'].includes(item.action)) {
                                item.expiredDays = null;
                            } else {
                                let dueDays = dueDate ? dayjs().diff(dueDate, 'day') : null;
                                item.isSelected = false;
                                item.expiredDays = dueDays;
                            }
                        } else {
                            item.expiredDays = null;
                        }

                        item = this.vouchersUtilityService.addEstimateProformaToolTiptext(item, this.company.giddhBalanceDecimalPlaces, this.company.baseCurrency);
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
                this.dialog.closeAll();
                this.selectedVouchers = [];
                this.allVouchersSelected = false;
                this.getVouchers(this.isUniversalDateApplicable);
            }
        });

        this.componentStore.actionVoucherIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.dialog.closeAll();
                this.toasterService.showSnackBar("success", (this.voucherType === 'estimates' || this.voucherType === 'proformas') ? this.localeData?.status_updated : this.commonLocaleData?.app_messages?.invoice_updated);
                this.getVouchers(this.isUniversalDateApplicable);
            }
        });

        this.componentStore.convertToInvoiceIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.getVouchers(this.isUniversalDateApplicable);
            }
        });

        this.componentStore.convertToProformaIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.toasterService.showSnackBar("success", this.localeData?.proforma_generated);
                this.getVouchers(this.isUniversalDateApplicable);
            }
        });

        this.componentStore.voucherDetails$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.voucherDetails = response;

                this.voucherTotals = this.vouchersUtilityService.getVoucherTotals(response?.entries, this.company.giddhBalanceDecimalPlaces, this.applyRoundOff, response?.exchangeRate);

                let tcsSum: number = 0;
                let tdsSum: number = 0;
                response.body?.entries.forEach(entry => {
                    entry.taxes?.forEach(tax => {
                        if (['tcsrc', 'tcspay'].includes(tax?.taxType)) {
                            tcsSum += tax.amount?.amountForAccount;
                        } else if (['tdsrc', 'tdspay'].includes(tax?.taxType)) {
                            tdsSum += tax.amount?.amountForAccount;
                        }
                    });
                });
                this.voucherTotals.tcsTotal = tcsSum;
                this.voucherTotals.tdsTotal = tdsSum;

                this.depositAmount = response.deposit?.amountForAccount ?? 0;

                this.advanceReceiptAdjustmentData = { adjustments: this.adjustmentUtilityService.formatAdjustmentsObject(response.adjustments) };
                this.isUpdateMode = (response?.body?.adjustments?.length) ? true : false;

                this.dialog.open(this.adjustPaymentDialog, {
                    panelClass: ['mat-dialog-md']
                });
            }
        });

        this.componentStore.adjustVoucherIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.toasterService.showSnackBar("success", this.localeData?.amount_adjusted);
                this.getVouchers(this.isUniversalDateApplicable);
            }
        });

        this.voucherNumberInput.valueChanges.pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(search => {
            if (search !== null && search !== undefined) {
                if (this.voucherType === VoucherTypeEnum.generateEstimate || this.voucherType === VoucherTypeEnum.generateProforma) {
                    if (this.voucherType === VoucherTypeEnum.generateProforma) {
                        this.advanceFilters.proformaNumber = search;
                    } else {
                        this.advanceFilters.estimateNumber = search;
                    }
                } else {
                    this.advanceFilters.q = search;
                }

                this.getVouchers(this.isUniversalDateApplicable);
            }
        });

        this.accountUniqueNameInput.valueChanges.pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(search => {
            if (search !== null && search !== undefined) {
                this.advanceFilters.q = search;
                this.getVouchers(this.isUniversalDateApplicable);
            }
        });

        this.componentStore.updatedAccountDetails$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.accountAsideMenuRef?.close();
            }
        });

        this.componentStore.branchList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch && response?.length > 1;
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
        this.getAllVouchers();
    }

    public getVoucherBalances(): void {
        if (this.voucherType === VoucherTypeEnum.sales) {
            this.componentStore.getVoucherBalances({ requestType: this.voucherType, payload: cloneDeep(this.advanceFilters) });
        }
    }

    private getAllVouchers(): void {
        console.log("getAllVouchers", this.voucherType);
        if (this.voucherType?.length) {
            
            if (this.voucherType === VoucherTypeEnum.generateEstimate || this.voucherType === VoucherTypeEnum.generateProforma) {
                this.componentStore.getPreviousProformaEstimates({ model: cloneDeep(this.advanceFilters), type: this.voucherType });
            } else {
                this.componentStore.getPreviousVouchers({ model: cloneDeep(this.advanceFilters), type: this.voucherType });
            }
        }
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

                if (this.voucherType === VoucherTypeEnum.sales || this.voucherType === VoucherTypeEnum.cash) {
                    this.applyRoundOff = settings.invoiceSettings.salesRoundOff;

                    if (!this.isEInvoiceEnabled) {
                        this.displayedColumns = this.displayedColumns?.filter(column => column !== "einvoicestatus");
                    }
                } else if (this.voucherType === VoucherTypeEnum.purchase) {
                    this.applyRoundOff = settings.invoiceSettings.purchaseRoundOff;
                } else if (this.voucherType === VoucherTypeEnum.debitNote) {
                    this.applyRoundOff = settings.invoiceSettings.debitNoteRoundOff;
                } else if (this.voucherType === VoucherTypeEnum.creditNote) {
                    this.applyRoundOff = settings.invoiceSettings.creditNoteRoundOff;
                } else if (this.voucherType === VoucherTypeEnum.estimate || this.voucherType === VoucherTypeEnum.generateEstimate || this.voucherType === VoucherTypeEnum.proforma || this.voucherType === VoucherTypeEnum.generateProforma) {
                    this.applyRoundOff = true;
                } else if (this.voucherType === VoucherTypeEnum.purchaseOrder) {
                    this.applyRoundOff = true;
                }
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
    public showPaymentDialog(voucher: any): void {
        this.voucherDetails = voucher;

        this.dialog.open(this.paymentDialog, {
            panelClass: ['mat-dialog-md']
        });
    }

    // adjust payment dialog
    public showAdjustmentDialog(voucher: any): void {
        this.componentStore.getVoucherDetails({ isCopyVoucher: false, accountUniqueName: voucher?.account?.uniqueName, payload: { uniqueName: voucher?.uniqueName, voucherType: this.voucherType } });
    }

    // bulk update dialog 
    public bulkUpdateDialog(): void {
        let dialogRef = this.dialog.open(this.bulkUpdate, {
            panelClass: ['mat-dialog-md'],
            data: {
                voucherUniqueNames: this.selectedVouchers?.map(voucher => { return voucher?.uniqueName }),
                voucherType: this.voucherType,
                localeData: this.localeData,
                commonLocaleData: this.commonLocaleData
            }
        });

        dialogRef.afterClosed().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.selectedVouchers = [];
                this.allVouchersSelected = false;
                this.getVouchers(this.isUniversalDateApplicable);
            }
        })
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

    public toggleSearch(event: any, fieldName: string, voucherType: string): void {
        switch(voucherType) {
            case VoucherTypeEnum.sales:  
                            this.showCustomerSearch = false;
                            this.showInvoiceNoSearch = false;
                            if (fieldName === "accountUniqueName") {
                                this.showCustomerSearch = true;
                            } else if (fieldName === "invoiceNumber") {
                                this.showInvoiceNoSearch = true;
                            }
                            break;
            case VoucherTypeEnum.estimate:
                            this.showCustomerSearch = false;
                            this.showInvoiceNoSearch = false;
                            if (fieldName === "accountUniqueName") {
                                this.showCustomerSearch = true;
                            } else if (fieldName === "estimateNumber") {
                                this.showInvoiceNoSearch = true;
                            }
                            break;
            case VoucherTypeEnum.proforma:
                            this.showCustomerSearch = false;
                            this.showInvoiceNoSearch = false;
                            if (fieldName === "accountUniqueName") {
                                this.showCustomerSearch = true;
                            } else if (fieldName === "proformaNumber") {
                                this.showInvoiceNoSearch = true;
                            }
                            break;
        }
        
        event.stopPropagation();
    }

    /**
     *This will be use for click outsie for search field hidden
     *
     * @param {*} event
     * @param {*} element
     * @param {string} searchedFieldName
     * @return {*}  {void}
     * @memberof ListBranchTransferComponent
     */
    public handleClickOutside(event: any, element: any, searchedFieldName: string): void {
        if (searchedFieldName === 'invoiceNumber') {
            if (this.voucherNumberInput.value !== null && this.voucherNumberInput.value !== '') {
                return;
            }
        } else if (searchedFieldName === 'accountUniqueName') {
            if (this.accountUniqueNameInput.value !== null && this.accountUniqueNameInput.value !== '') {
                return;
            }
        }

        if (this.generalService.childOf(event?.target, element)) {
            return;
        } else {
            if (['invoiceNumber', 'estimateNumber', 'proformaNumber'].includes(searchedFieldName)) {
                this.showInvoiceNoSearch = false;
            } else if (searchedFieldName === 'accountUniqueName') {
                this.showCustomerSearch = false;
            }
        }
    }

    // convert bill dialog
    public ConvertBillDialog(): void {
        this.dialog.open(this.convertBill, {
            width: '600px'
        })
    }

    public showEwayBillDialog(voucher?: any): void {
        if (this.voucherType === VoucherTypeEnum.sales) {
            this.store.dispatch(this.invoiceReceiptActions.ResetVoucherDetails());
            this.invoiceService.selectedInvoicesLists = [];
            this.invoiceService.VoucherType = this.voucherType;

            // To get re-assign receipts voucher store
            if (voucher) {
                this.store.dispatch(this.invoiceReceiptActions.getVoucherDetailsV4(voucher?.account?.uniqueName, {
                    invoiceNumber: voucher?.voucherNumber,
                    voucherType: VoucherTypeEnum.sales,
                    uniqueName: voucher?.uniqueName
                }));

                this.invoiceService.setSelectedInvoicesList([voucher]);
            } else if (this.selectedVouchers[0]?.account?.uniqueName) {
                this.store.dispatch(this.invoiceReceiptActions.getVoucherDetailsV4(this.selectedVouchers[0]?.account?.uniqueName, {
                    invoiceNumber: this.selectedVouchers[0]?.voucherNumber,
                    voucherType: VoucherTypeEnum.sales,
                    uniqueName: this.selectedVouchers[0]?.uniqueName
                }));

                this.invoiceService.setSelectedInvoicesList(this.selectedVouchers);
            }
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
        this.advanceSearchDialogRef?.close();
        this.advanceFiltersApplied = true;

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

        this.advanceFilters = this.vouchersUtilityService.cleanObject(this.advanceFilters);

        this.getVouchers(false);
        this.getVoucherBalances();
    }

    public closeAdvanceSearchDialog(isClosed: boolean): void {
        if (isClosed) {
            this.selectAllVouchers({ checked: false });
        }
        this.advanceSearchDialogRef?.close();
    }

    public actionVoucher(voucher: any, action: string): void {
        this.componentStore.actionVoucher({ voucherUniqueName: voucher?.uniqueName, payload: { action: action, voucherType: voucher?.voucherType ?? this.voucherType } });
    }

    public actionEstimateProforma(voucher: any, action: string): void {
        const model = { 
            accountUniqueName: voucher.customerUniqueName,
            action: action
        };
        if (voucher === 'estimates' ) {
            model['estimateNumber'] = voucher.voucherNumber;
        } else {
            model['proformaNumber'] = voucher.voucherNumber;
        }
        this.componentStore.actionEstimateProforma({ 
            request: model,
            voucherType: voucher?.voucherType ?? this.voucherType 
        });
    }

    public convertToInvoice(voucher): void {
        this.componentStore.convertToInvoice({ 
            request: { 
                accountUniqueName: voucher.customerUniqueName, 
                estimateNumber: voucher.voucherNumber,
            },
            voucherType: voucher?.voucherType ?? this.voucherType 
        });
    }

    public convertToProforma(voucher): void {
        this.componentStore.convertToProforma({ 
            request: { 
                accountUniqueName: voucher.customerUniqueName, 
                estimateNumber: voucher.voucherNumber,
            },
            voucherType: voucher?.voucherType ?? this.voucherType 
        });
    }

    public paymentSubmitted(event: any): void {
        this.componentStore.actionVoucher({ voucherUniqueName: event?.uniqueName, payload: event });
    }

    public closeAdvanceReceiptDialog(): void {
        this.advanceReceiptAdjustmentData = null;
        this.dialog.closeAll();
    }

    /**
    * To get all advance adjusted data
    *
    * @param {{ adjustVoucherData: VoucherAdjustments, adjustPaymentData: AdjustAdvancePaymentModal }} advanceReceiptsAdjustEvent event that contains advance receipts adjusted data
    * @memberof InvoicePreviewComponent
    */
    public getAdvanceReceiptAdjustData(advanceReceiptsAdjustEvent: { adjustVoucherData: VoucherAdjustments, adjustPaymentData: AdjustAdvancePaymentModal }) {
        this.closeAdvanceReceiptDialog();
        let advanceReceiptAdjustmentData = cloneDeep(advanceReceiptsAdjustEvent.adjustVoucherData);
        if (advanceReceiptAdjustmentData && advanceReceiptAdjustmentData.adjustments && advanceReceiptAdjustmentData.adjustments.length > 0) {
            advanceReceiptAdjustmentData.adjustments.map(item => {
                item.voucherDate = (item.voucherDate?.toString()?.includes('/')) ? item.voucherDate?.trim()?.replace(/\//g, '-') : item.voucherDate;
                item.voucherNumber = item.voucherNumber === '-' ? '' : item.voucherNumber;
                item.amount = item.adjustmentAmount;
                item.unadjustedAmount = item.balanceDue;

                delete item.adjustmentAmount;
                delete item.balanceDue;
            });
        }

        this.componentStore.adjustVoucherWithAdvanceReceipts({ adjustments: advanceReceiptAdjustmentData.adjustments, voucherUniqueName: this.voucherDetails?.uniqueName });
    }

    public goToLedger(voucher: any): void {
        let url = '/pages/ledger/' + voucher?.account?.uniqueName + '/' + this.advanceFilters.from + '/' + this.advanceFilters.to;
        this.openUrl(url);
    }

    public generateVoucher(voucher: any): void {
        let url = "";
        if (this.voucherType === VoucherTypeEnum.sales) {
            if (voucher?.account?.uniqueName === 'cash') {
                url = '/pages/vouchers/cash/create';
            } else {
                url = '/pages/vouchers/sales/' + voucher?.account?.uniqueName + '/create';
            }
        } else {
            let tempVoucherType = this.urlVoucherType === "purchase" ? "bill" : this.urlVoucherType;

            if (voucher?.account?.uniqueName === 'cash') {
                url = '/pages/vouchers/cash-' + tempVoucherType + '/create';
            } else {
                url = '/pages/vouchers/' + tempVoucherType + '/' + voucher?.account?.uniqueName + '/create';
            }
        }

        this.openUrl(url);
    }

    private openUrl(url: string): void {
        if (isElectron) {
            let ipcRenderer = (window as any).require('electron').ipcRenderer;
            url = location.origin + location.pathname + `#./pages/${url}`;
            ipcRenderer.send('open-url', url);
        } else {
            (window as any).open(url);
        }
    }

    public getParentGroupForAccountCreate(voucherType: string): string {
        if (voucherType === VoucherTypeEnum.debitNote || voucherType === VoucherTypeEnum.purchase || voucherType === VoucherTypeEnum.purchaseOrder || voucherType === VoucherTypeEnum.cashBill || voucherType === VoucherTypeEnum.cashDebitNote) {
            return 'sundrycreditors';
        } else {
            return 'sundrydebtors';
        }
    }

    public editAccount(voucher: any): void {
        this.voucherDetails = voucher;
        this.accountParentGroup = this.getParentGroupForAccountCreate(this.voucherType);

        this.accountAsideMenuRef = this.dialog.open(this.accountAsideMenu, {
            position: {
                right: '0',
                top: '0'
            }
        });
    }

    public setInitialAdvanceFilter(): void {
        this.advanceFilters = {
            sortBy: '', // need to set voucherDate
            sort: 'desc',
            type: 'sales',
            from: '',
            to: '',
            page: 1,
            count: PAGINATION_LIMIT,
            q: ''
        };
        this.advanceFiltersApplied = false;
        this.getVouchers(false);
    }

    /**
     * Callback for update account
     *
     * @param {UpdateAccountRequest} item
     * @memberof VoucherCreateComponent
     */
    public updateAccount(item: UpdateAccountRequest): void {
        this.store.dispatch(this.salesAction.updateAccountDetailsForSales(item));
    }
}