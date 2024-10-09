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
import { Observable, ReplaySubject, debounceTime, delay, distinctUntilChanged, merge, take, takeUntil } from "rxjs";
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
import { SettingsProfileActions } from "../../actions/settings/profile/settings.profile.action";
import { BulkUpdateComponent } from "../bulk-update/bulk-update.component";
import { CancelEInvoiceDialogComponent } from "../cancel-einvoice-dialog/cancel-einvoice-dialog.component";

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

export interface VoucherBalances {
    grandTotal: Number;
    totalDue?: Number;
    advanceReceiptTotal?: Number;
    normalReceiptTotal?: Number;
}

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
    /** Hold all voucher list data source for table */
    public dataSource: any[] = [];
    /** Holds Table Display columns for Sales Voucher */
    public displayedColumns: string[] = ['index', 'invoice', 'customer', 'voucherDate', 'grandTotal', 'balanceDue', 'dueDate', 'einvoicestatus', 'status'];
    /** Holds Table data source for Pending */
    public dataSourcePending = new MatTableDataSource<PeriodicElementPending>(PENDING_DATA);
    /** Holds Table Display columns for Estimate Voucher */
    public displayedColumnEstimate: string[] = ['index', 'estimate', 'customer', 'proformaDate', 'grandTotal', 'dueDate', 'status', 'action'];
    /** Holds Table Display columns for Proforma Voucher */
    public displayedColumnProforma: string[] = ['position', 'proforma', 'customer', 'proformaDate', 'grandTotal', 'dueDate', 'status', 'action'];
    /** Holds Table Display columns for Pending Voucher */
    public displayedColumnPending: string[] = ['position', 'date', 'particular', 'amount', 'account', 'total', 'description'];
    /** Holds Table Display columns for Credit Voucher */
    public displayedColumnsCredit: string[] = ['index', 'credit', 'customer', 'voucherDate', 'linked', 'grandTotal', 'status'];
    /** Holds Table Display columns for Purchase Order Voucher */
    public displayedColumnPurchase: string[] = ['index', 'date', 'purchase', 'vendorname', 'grandTotal', 'dueDate', 'status'];
    /** Holds Table Display columns for Purchase Bill Voucher */
    public displayedColumnsBill: string[] = ['index', 'bill', 'vendor', 'voucherDate', 'order', 'grandTotal', 'dueDate', 'status'];
    /** Holds Table Display columns for Receipt Voucher */
    public displayedColumnReceipt: string[] = ['index', 'receipt', 'voucherDate', 'type', 'customer', 'paymentMode', 'invoiceNumber', 'grandTotal', 'balanceDue'];
    /** Holds Table Display columns for Payment Voucher */
    public displayedColumnPayment: string[] = ['index', 'payment', 'voucherDate', 'vendor', 'paymentMode', 'invoiceNumber', 'grandTotal', 'balanceDue'];

    /** Template Reference for Generic aside menu account */
    @ViewChild("accountAsideMenu") public accountAsideMenu: TemplateRef<any>;
    /** Holds advance search dailog template reference */
    @ViewChild('advanceSearch', { static: true }) public advanceSearch: TemplateRef<any>;
    /** Holds export dailog template reference */
    @ViewChild('bulkExport', { static: true }) public bulkExport: TemplateRef<any>;
    /** Holds Payment template reference */
    @ViewChild('paymentDialog', { static: true }) public paymentDialog: TemplateRef<any>;
    /** Holds adjust payment dailog template reference */
    @ViewChild('adjustPaymentDialog', { static: true }) public adjustPaymentDialog: TemplateRef<any>;
    // Holds table sorting reference
    @ViewChild(MatSort) sort: MatSort;
    /** Holds table paginator reference */
    @ViewChild(MatPaginator) paginator: MatPaginator;
    /** Holds bill dailog template reference */
    @ViewChild('convertBill', { static: true }) public convertBill: TemplateRef<any>;
    /** Holds E-way bill dailog template reference */
    @ViewChild('ewayBill', { static: true }) public ewayBill: TemplateRef<any>;
    /** Directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: TemplateRef<any>;
    /** Holds send email dailog template reference send email */
    @ViewChild('sendEmailModal', { static: true }) public sendEmailModal: any;
    /** Holds show Customer Search input visibility status */
    public showCustomerSearch: boolean = false;
    /** Holds show Invoice No Search input visibility status */
    public showInvoiceNoSearch: boolean = false;
    /** Holds show Purchase Order Number Search input visibility status */
    public showPurchaseOrderNumberSearch: boolean = false;
    /** Holds voucher Number form control */
    public voucherNumberInput: FormControl = new FormControl(null);
    /** Holds account Unique Name form control */
    public accountUniqueNameInput: FormControl = new FormControl(null);
    /** Holds Purchase Order Unique Name form control */
    public purchaseOrderUniqueNameInput: FormControl = new FormControl(null);
    /** Holds true if searching is in progress */
    public isSearching: boolean = false;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Hold invoice  type */
    public voucherType: any = '';
    /** Hold url Voucher Type */
    public urlVoucherType: string = '';
    /** Hold day js reference */
    public dayjs: any = dayjs;
    /** Hold Bootstrap Modal Reference */
    public modalRef: BsModalRef;
    public selectedDateRange: any;
    /** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /** This will store available date ranges */
    public datePickerOption: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /* Selected range label */
    public selectedRangeLabel: any = "";
    /** This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Last vouchers get in progress Observable */
    public getVouchersInProgress$: Observable<any> = this.componentStore.getLastVouchersInProgress$;
    /** Holds invoice Selected Date range  */
    public invoiceSelectedDate: any = {
        fromDates: '',
        toDates: ''
    };
    /** Holds true if universal date is applied */
    public isUniversalDateApplicable: boolean = false;
    /** Holds active tab group number */
    public activeTabGroup: number = 0;
    /** Holds active Module */
    public activeModule: string = "list";
    /** Holds list tabs groups */
    public tabsGroups: any[][] = [
        ["estimates", "proformas", "sales"],
        ["debit note", "credit note"],
        ["purchase-order", "purchase"],
        ["receipt"],
        ["payment"]
    ];
    /** Holds active selected Tab Index  */
    public selectedTabIndex: number = 2;
    /** Holds universal date */
    public universalDate: any;
    /** Holds advance Filters keys */
    public advanceFilters: any = {};
    /** Holds Advance Filters Applied Status */
    public advanceFiltersApplied: boolean = false;
    /** Holds Voucher Balances */
    public voucherBalances: VoucherBalances = {
        grandTotal: 0,
        totalDue: 0,
        advanceReceiptTotal: 0,
        normalReceiptTotal: 0
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
    /** Holds page Size Options for pagination */
    public pageSizeOptions: any[] = PAGE_SIZE_OPTIONS;
    /** Holds Total Results Count */
    public totalResults: number = 0;
    /** Holds Selected Vouchers */
    public selectedVouchers: any[] = [];
    /** Holds Voucher Name that suports csv file export */
    public csvSupportVoucherType: string[] = ['sales', 'debit note', 'credit note', 'purchase', 'receipt', 'payment'];
    /** Holds True if all Vouchers are Selected */
    public allVouchersSelected: boolean = false;
    /** Holds Eway Bill Dialog Ref */
    public ewayBillDialogRef: any;
    /** Holds Advance Search Dialog Ref */
    public advanceSearchDialogRef: any;
    /** Holds Voucher Details Dialog Ref */
    public voucherDetails: any;
    /** Stores the adjustment data */
    public advanceReceiptAdjustmentData: VoucherAdjustments;
    /** Holds true if update mode */
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
    /** Deposit Amount */
    public depositAmount: number = 0;
    /** Hold account aside menu reference  */
    public accountAsideMenuRef: MatDialogRef<any>;
    /** Holds Account Parent Group */
    public accountParentGroup: string = "";
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    public isCompany: boolean;
    /** Send Email Dialog Ref */
    public sendEmailModalDialogRef: MatDialogRef<any>;
    /** Holds Currently used Voucher */
    private currentVoucher: any = null;
    /** Holds Advance Search Filter Temp Keys to show label on filter dialog */
    private advanceSearchTempKeyObj: any = {};
    /** Holds Id of active search input field */
    public activeSearchField: any = null;
    /** Holds invoice type */
    public invoiceType: any = {
        isSalesInvoice: true,
        isCashInvoice: false,
        isCreditNote: false,
        isDebitNote: false,
        isPurchaseInvoice: false,
        isProformaInvoice: false,
        isEstimateInvoice: false,
        isPurchaseOrder: false,
        isReceiptInvoice: false,
        isPaymentInvoice: false
    };

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
        private salesAction: SalesActions,
        private settingsProfileActions: SettingsProfileActions
    ) {
        this.componentStore.companyProfile$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (Object.keys(response)?.length) {
                this.company.baseCurrency = response.baseCurrency;
                this.company.baseCurrencySymbol = response.baseCurrencySymbol;
                this.company.inputMaskFormat = response.balanceDisplayFormat?.toLowerCase() || '';
                this.company.giddhBalanceDecimalPlaces = response.balanceDecimalPlaces;
            }
        });
        this.store.dispatch(this.settingsProfileActions.GetInventoryInfo());
    }

    /**
     * Initializes the component
     *
     * @memberof VoucherListComponent
     */
    public ngOnInit(): void {
        this.setInitialAdvanceFilter(true);
        this.getInvoiceSettings();

        this.activatedRoute.params.pipe(delay(0), takeUntil(this.destroyed$)).subscribe(params => {
            if (params) {
                this.urlVoucherType = params?.voucherType;
                this.voucherType = this.vouchersUtilityService.parseVoucherType(params.voucherType);
                this.invoiceType = this.vouchersUtilityService.getVoucherType(this.voucherType);
                this.activeModule = params.module;
                this.selectedVouchers = [];
                this.allVouchersSelected = false;
                this.setInitialAdvanceFilter(true);

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

        this.isCompany = this.generalService.currentOrganizationType === OrganizationType.Company;

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

        merge(this.componentStore.lastVouchers$, this.componentStore.purchaseOrdersList$)
            .pipe(takeUntil(this.destroyed$)).subscribe((response) => {
                this.handleGetAllVoucherResponse(response);
            });

        this.componentStore.exportVouchersFile$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                const blob = this.generalService.base64ToBlob(response, 'application/xls', 512);
                const fileName = `${this.vouchersUtilityService.getExportFileNameByVoucherType(this.voucherType, this.allVouchersSelected, this.localeData)}.xls`;
                this.selectedVouchers = [];
                this.allVouchersSelected = false;
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

        merge(this.componentStore.deleteVoucherIsSuccess$, this.componentStore.convertToInvoiceIsSuccess$)
            .pipe(takeUntil(this.destroyed$)).subscribe((response) => {
                if (response) {
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

        this.componentStore.convertToProformaIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.toasterService.showSnackBar("success", this.localeData?.proforma_generated);
                this.getVouchers(this.isUniversalDateApplicable);
            }
        });

        this.componentStore.sendEmailIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.sendEmailModalDialogRef?.close();
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
            if (search || search === '') {
                if (this.voucherType === VoucherTypeEnum.generateEstimate || this.voucherType === VoucherTypeEnum.generateProforma) {
                    if (this.voucherType === VoucherTypeEnum.generateProforma) {
                        this.advanceFilters.proformaNumber = search;
                    } else {
                        this.advanceFilters.estimateNumber = search;
                    }
                } else if (this.voucherType === VoucherTypeEnum.purchaseOrder) {
                    this.advanceFilters.purchaseOrderNumber = search;
                } else {
                    this.advanceFilters.q = search;
                }
                this.isSearching = true;
                this.checkSearchingIsEmpty();
                this.advanceFilters.page = 1;
                this.getVouchers(this.isUniversalDateApplicable);
            }
        });

        this.accountUniqueNameInput.valueChanges.pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(search => {
            if (search || search === '') {
                if (this.voucherType === VoucherTypeEnum.purchaseOrder) {
                    this.advanceFilters.vendorName = search;
                } else {
                    this.advanceFilters.q = search;
                }
                this.isSearching = true;
                this.checkSearchingIsEmpty();
                this.advanceFilters.page = 1;
                this.getVouchers(this.isUniversalDateApplicable);
            }
        });

        this.purchaseOrderUniqueNameInput.valueChanges.pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(search => {
            if (search || search === '') {
                if (this.voucherType === VoucherTypeEnum.purchase) {
                    this.advanceFilters.purchaseOrderNumber = search;
                }
                this.isSearching = true;
                this.checkSearchingIsEmpty();
                this.advanceFilters.page = 1;
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

        this.componentStore.bulkExportVoucherResponse$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.selectedVouchers = [];
                this.allVouchersSelected = false;
            }
        });
    }

    /**
     * Check Searching is empty in all search fields
     *
     * @private
     * @memberof VoucherListComponent
     */
    private checkSearchingIsEmpty(): void {
        let seachingFieldIsEmpty: boolean = false;

        if (this.voucherType === VoucherTypeEnum.purchase) {
            seachingFieldIsEmpty = this.purchaseOrderUniqueNameInput.value === "" && this.accountUniqueNameInput.value === "" && this.voucherNumberInput.value === "";
        } else {
            seachingFieldIsEmpty = this.accountUniqueNameInput.value === "" && this.voucherNumberInput.value === "";
        }

        this.advanceFiltersApplied = !seachingFieldIsEmpty;
        this.isSearching = !seachingFieldIsEmpty;
    }

    /**
     * Handle Get All Voucher Response
     *
     * @private
     * @param {*} response
     * @memberof VoucherListComponent
     */
    private handleGetAllVoucherResponse(response: any): void {
        if (response && response.voucherType === this.voucherType) {
            this.dataSource = [];
            this.totalResults = response?.totalItems;
            this.selectAllVouchers({ checked: false });
            response.items?.forEach((item: any, index: number) => {
                item.index = index + 1;

                if (item.balanceStatus) {
                    item.balanceStatus = item.balanceStatus.toLocaleLowerCase();
                }

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

                if (this.voucherType === VoucherTypeEnum.purchase) {
                    let dueDate = item.dueDate ? dayjs(item.dueDate, GIDDH_DATE_FORMAT) : null;
                    if (dueDate) {
                        if (dueDate.isAfter(dayjs()) || ['paid', 'cancel'].includes(item.balanceStatus)) {
                            item.dueDays = null;
                        } else {
                            let dueDays = dueDate ? dayjs().diff(dueDate, 'day') : null;
                            item.dueDays = dueDays;
                        }
                    } else {
                        item.dueDays = null;
                    }
                }
                this.dataSource.push(item);
            });

            // When user search in table header then after api call focus on respective search field
            if (this.activeSearchField) {
                setTimeout(() => {
                    document.getElementById(this.activeSearchField).focus();
                }, 200);
            }
        }
    }

    /**
     * Set all invoice to service variable and redirect to view page
     *
     * @memberof VoucherListComponent
     */
    public showVoucherPreview(voucherUniqueName: string): void {
        this.router.navigate([`/pages/vouchers/view/${this.urlVoucherType}/${voucherUniqueName}`], {
            queryParams: { page: this.advanceFilters.page, from: this.advanceFilters.from, to: this.advanceFilters.to }
        });
    }

    /**
     * Set Selected Tab Index
     *
     * @private
     * @memberof VoucherListComponent
     */
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
        } else if (this.activeTabGroup === 3) {
            if (this.voucherType === 'receipt' && this.activeModule === 'list') {
                this.selectedTabIndex = 0;
            }
        } else if (this.activeTabGroup === 4) {
            if (this.voucherType === 'payment' && this.activeModule === 'list') {
                this.selectedTabIndex = 0;
            }
        }
    }

    /**
     * Redirect To Selected Tab
     *
     * @private
     * @param {number} selectedTabIndex
     * @memberof VoucherListComponent
     */
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
        } else if (this.activeTabGroup === 3) {
            if (selectedTabIndex === 0) {
                voucherType = "receipt";
                activeModule = "list";
            }
        } else if (this.activeTabGroup === 4) {
            if (selectedTabIndex === 0) {
                voucherType = "payment";
                activeModule = "list";
            }
        }

        this.router.navigate(['/pages/vouchers/preview/' + voucherType + '/' + activeModule]);
    }
    /**
     * Handle Tab Change event
     *
     * @param {*} selectedTabIndex
     * @memberof VoucherListComponent
     */
    public tabChanged(selectedTabIndex: any): void {
        this.selectedTabIndex = selectedTabIndex;
        this.redirectToSelectedTab(selectedTabIndex);
    }

    /**
     * Call function for Get all Vouchers
     *
     * @param {boolean} isUniversalDateApplicable
     * @memberof VoucherListComponent
     */
    public getVouchers(isUniversalDateApplicable: boolean): void {
        this.getAllVouchers();
    }

    /**
     * API Call Get Voucher Balances
     *
     * @memberof VoucherListComponent
     */
    public getVoucherBalances(): void {
        if (this.voucherType === VoucherTypeEnum.sales || this.voucherType === VoucherTypeEnum.creditNote || this.voucherType === VoucherTypeEnum.debitNote || this.voucherType === VoucherTypeEnum.purchase || this.voucherType === VoucherTypeEnum.payment || this.voucherType === VoucherTypeEnum.receipt) {
            this.componentStore.getVoucherBalances({ requestType: this.voucherType, payload: cloneDeep(this.advanceFilters) });
        }
    }

    /**
     * API Call Get All Vouchers
     *
     * @private
     * @memberof VoucherListComponent
     */
    private getAllVouchers(): void {
        if (this.voucherType?.length) {
            if (this.voucherType === VoucherTypeEnum.generateEstimate || this.voucherType === VoucherTypeEnum.generateProforma) {
                this.componentStore.getPreviousProformaEstimates({ model: cloneDeep(this.advanceFilters), type: this.voucherType });
            } else if (this.voucherType === VoucherTypeEnum.purchaseOrder) {
                this.componentStore.getPurchaseOrders({ request: cloneDeep(this.advanceFilters) });
            } else {
                this.componentStore.getPreviousVouchers({ model: cloneDeep(this.advanceFilters), type: this.voucherType });
            }
        }
    }

    /**
     *  Handle Mat table sort event
     *
     * @param {*} event
     * @memberof VoucherListComponent
     */
    public sortChange(event: any): void {
        this.advanceFilters.sort = event?.direction ? event?.direction : 'asc';
        this.advanceFilters.sortBy = event?.active;
        this.advanceFilters.page = 1;
        this.advanceFiltersApplied = true;
        this.getVouchers(false);
    }

    /**
     * Handle Page Change event and Make API Call
     *
     * @param {*} event
     * @memberof VoucherListComponent
     */
    public handlePageChange(event: any): void {
        this.advanceFilters.count = event.pageSize;
        this.advanceFilters.page = event.pageIndex + 1;
        this.getVouchers(false);
    }

    /**
     * Handle Select table item event
     *
     * @param {*} event
     * @param {*} voucher
     * @memberof VoucherListComponent
     */
    public selectVoucher(event: any, voucher: any): void {
        if (event?.checked) {
            this.selectedVouchers.push(voucher);
        } else {
            this.selectedVouchers = this.selectedVouchers?.filter(selectedVoucher => selectedVoucher?.uniqueName !== voucher?.uniqueName);
        }
        this.allVouchersSelected = this.dataSource?.length === this.selectedVouchers?.length;
    }

    /**
     * Handle Select All Items
     *
     * @param {*} event
     * @memberof VoucherListComponent
     */
    public selectAllVouchers(event: any): void {
        this.selectedVouchers = [];
        this.allVouchersSelected = event?.checked;
        if (event?.checked) {
            this.dataSource?.forEach(voucher => {
                this.selectedVouchers.push(voucher);
            });
        }
    }

    /**
     * Export CSV File and Download
     *
     * @return {*}  {*}
     * @memberof VoucherListComponent
     */
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

    /**
     * Generate E-Invoice API Call
     *
     * @memberof VoucherListComponent
     */
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
            this.advanceFiltersApplied = true;
            this.getVouchers(this.isUniversalDateApplicable);
            this.getVoucherBalances();
        }
    }

    /**
     * Lifecycle hook for destroy
     *
     * @memberof VoucherListComponent
     */
    public ngOnDestroy(): void {
        if (window.localStorage) {
            localStorage.removeItem('universalSelectedDate');
            localStorage.removeItem('invoiceSelectedDate');
        }
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Open Advance Search Dialog
     *
     * @memberof VoucherListComponent
     */
    public advanceSearchDialog(): void {
        this.advanceFilters = { ...this.advanceFilters, ...this.advanceSearchTempKeyObj };
        this.advanceSearchDialogRef = this.dialog.open(this.advanceSearch, {
            panelClass: ['mat-dialog-md']
        });
    }

    /**
     * Open Bulk Export Dialog
     *
     * @memberof VoucherListComponent
     */
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

    /**
     * Open Payment Dialog
     *
     * @param {*} voucher
     * @memberof VoucherListComponent
     */
    public showPaymentDialog(voucher: any): void {
        this.voucherDetails = voucher;
        this.dialog.open(this.paymentDialog, {
            panelClass: ['mat-dialog-md']
        });
    }

    /**
     * Open Adjust payment dialog
     *
     * @param {*} voucher
     * @memberof VoucherListComponent
     */
    public showAdjustmentDialog(voucher: any): void {
        this.componentStore.getVoucherDetails({ isCopyVoucher: false, accountUniqueName: voucher?.account?.uniqueName, payload: { uniqueName: voucher?.uniqueName, voucherType: this.voucherType } });
    }

    /**
     * Open bulk update dialog for Purchase order
     *
     * @param {boolean} [isPOBulkUpdate=false]
     * @memberof VoucherListComponent
     */
    public bulkUpdateDialog(isPOBulkUpdate: boolean = false): void {
        const dataToSend = {
            voucherType: this.voucherType,
            localeData: this.localeData,
            commonLocaleData: this.commonLocaleData
        };

        if (isPOBulkUpdate) {
            dataToSend['purchaseNumbers'] = this.selectedVouchers?.map(voucher => { return voucher?.voucherNumber });
        } else {
            dataToSend['voucherUniqueNames'] = this.selectedVouchers?.map(voucher => { return voucher?.uniqueName });
        }


        let dialogRef = this.dialog.open(BulkUpdateComponent, {
            panelClass: ['mat-dialog-md'],
            data: dataToSend
        });

        dialogRef.afterClosed().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.selectedVouchers = [];
                this.allVouchersSelected = false;
                this.getVouchers(this.isUniversalDateApplicable);
            }
        })
    }

    /**
     * Open Cancel EInvoice Dialog
     *
     * @memberof VoucherListComponent
     */
    public openCancelEInvoiceDialog(): void {
        const dataToSend = {
            voucherType: this.voucherType,
            selectedEInvoice: this.selectedVouchers[0],
            localeData: this.localeData,
            commonLocaleData: this.commonLocaleData
        };

        let dialogRef = this.dialog.open(CancelEInvoiceDialogComponent, {
            panelClass: ['mat-dialog-md'],
            data: dataToSend
        });

        dialogRef.afterClosed().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.selectedVouchers = [];
                this.allVouchersSelected = false;
                this.getVouchers(this.isUniversalDateApplicable);
            }
        })
    }

    /**
     * Handle Delete Voucher Dialog
     *
     * @param {*} [voucher]
     * @memberof VoucherListComponent
     */
    public deleteVoucherDialog(voucher?: any): void {
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
                if (this.voucherType === VoucherTypeEnum.purchase) {
                    this.componentStore.deleteVoucher({
                        accountUniqueName: voucher?.account?.uniqueName, model: {
                            uniqueName: voucher?.uniqueName,
                            voucherType: this.voucherType
                        }
                    });
                } else if (this.voucherType === VoucherTypeEnum.purchaseOrder) {
                    if (voucher?.uniqueName) {
                        this.componentStore.deleteSinglePOVoucher(voucher?.uniqueName);
                    } else {
                        this.poBulkAction('delete');
                    }
                } else if (this.voucherType === VoucherTypeEnum.generateEstimate || this.voucherType === VoucherTypeEnum.generateProforma) {
                    const voucher = this.selectedVouchers[0];
                    const payload = {
                        accountUniqueName: voucher.customerUniqueName
                    }
                    if (this.voucherType === VoucherTypeEnum.generateEstimate) {
                        payload['estimateNumber'] = voucher?.estimateNumber;
                    } else {
                        payload['proformaNumber'] = voucher?.proformaNumber;
                    }
                    this.componentStore.deleteEstimsteProformaVoucher({ payload: payload, voucherType: this.voucherType });
                } else {
                    const payload = {
                        voucherUniqueNames: this.selectedVouchers?.map(voucher => { return voucher?.uniqueName }),
                        voucherType: this.voucherType
                    };
                    this.componentStore.bulkUpdateInvoice({ payload: payload, actionType: 'delete' });
                }
            }
        });
    }

    /**
     * Open template dialog
     *
     * @memberof VoucherListComponent
     */
    public templateDialog(): void {
        this.dialog.open(TemplatePreviewDialogComponent, {
            width: '980px'
        });
    }

    /**
     * Open template edit dialog
     *
     * @memberof VoucherListComponent
     */
    public templateEdit(): void {
        this.dialog.open(TemplateEditDialogComponent, {
            width: '100%',
            height: '100vh'
        });
    }

    /**
     * Toggle between table header title and search input field
     *
     * @param {*} event
     * @param {string} fieldName
     * @param {string} voucherType
     * @memberof VoucherListComponent
     */
    public toggleSearch(event: any, fieldName: string, voucherType: string): void {
        switch (voucherType) {
            case VoucherTypeEnum.sales:
                if (fieldName === "accountUniqueName") {
                    this.showCustomerSearch = true;
                } else if (fieldName === "invoiceNumber") {
                    this.showInvoiceNoSearch = true;
                }
                break;
            case VoucherTypeEnum.estimate:
                if (fieldName === "accountUniqueName") {
                    this.showCustomerSearch = true;
                } else if (fieldName === "estimateNumber") {
                    this.showInvoiceNoSearch = true;
                }
                break;
            case VoucherTypeEnum.proforma:
                if (fieldName === "accountUniqueName") {
                    this.showCustomerSearch = true;
                } else if (fieldName === "proformaNumber") {
                    this.showInvoiceNoSearch = true;
                }
                break;
            case VoucherTypeEnum.purchaseOrder:
                if (fieldName === "accountUniqueName") {
                    this.showCustomerSearch = true;
                } else if (fieldName === "purchaseOrderNumber") {
                    this.showInvoiceNoSearch = true;
                }
                break;
            case VoucherTypeEnum.receipt:
                if (fieldName === "accountUniqueName") {
                    this.showCustomerSearch = true;
                } else if (fieldName === "receiptNumber") {
                    this.showInvoiceNoSearch = true;
                }
                break;
            case VoucherTypeEnum.payment:
                if (fieldName === "accountUniqueName") {
                    this.showCustomerSearch = true;
                } else if (fieldName === "paymentNumber") {
                    this.showInvoiceNoSearch = true;
                }
                break;
            case VoucherTypeEnum.creditNote:
                if (fieldName === "accountUniqueName") {
                    this.showCustomerSearch = true;
                } else if (fieldName === "creditNoteNumber") {
                    this.showInvoiceNoSearch = true;
                }
                break;
            case VoucherTypeEnum.debitNote:
                if (fieldName === "accountUniqueName") {
                    this.showCustomerSearch = true;
                } else if (fieldName === "debitNoteNumber") {
                    this.showInvoiceNoSearch = true;
                }
                break;
            case VoucherTypeEnum.purchase:
                if (fieldName === "accountUniqueName") {
                    this.showCustomerSearch = true;
                } else if (fieldName === "billNumber") {
                    this.showInvoiceNoSearch = true;
                } else if (fieldName === "purchaseOrderNumbers") {
                    this.showPurchaseOrderNumberSearch = true;
                }
                break;
        }

        event.stopPropagation();
    }

    /**
     * This will be use for click outsie for search field hidden
     *
     * @param {*} event
     * @param {*} element
     * @param {string} searchedFieldName
     * @return {*}  {void}
     * @memberof ListBranchTransferComponent
     */
    public handleClickOutside(event: any, element: any, searchedFieldName: string): void {
        const searchedFieldNameArray: string[] = ['invoiceNumber', 'estimateNumber', 'proformaNumber', 'purchaseOrderNumber', 'receiptNumber', 'paymentNumber', 'creditNoteNumber', 'debitNoteNumber', 'billNumber'];
        if (searchedFieldNameArray.includes(searchedFieldName)) {
            if (this.voucherNumberInput.value !== null && this.voucherNumberInput.value !== '') {
                return;
            }
        } else if (searchedFieldName === 'accountUniqueName') {
            if (this.accountUniqueNameInput.value !== null && this.accountUniqueNameInput.value !== '') {
                return;
            }
        } else if (searchedFieldName === 'purchaseOrderNumbers') {
            if (this.purchaseOrderUniqueNameInput.value !== null && this.purchaseOrderUniqueNameInput.value !== '') {
                return;
            }
        }

        if (this.generalService.childOf(event?.target, element)) {
            return;
        } else {
            if (searchedFieldNameArray.includes(searchedFieldName)) {
                this.showInvoiceNoSearch = false;
            } else if (searchedFieldName === 'accountUniqueName') {
                this.showCustomerSearch = false;
            } else if (searchedFieldName === 'purchaseOrderNumbers') {
                this.showPurchaseOrderNumberSearch = false;
            }
        }
    }

    /**
     * Open Eway Bill Dialog
     *
     * @param {*} [voucher]
     * @memberof VoucherListComponent
     */
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

    /**
     * Create Eway Bill Dailog
     *
     * @memberof VoucherListComponent
     */
    public createEwayBill(): void {
        this.componentStore.createEwayBill$.pipe(take(1)).subscribe(response => {
            if (!response?.account?.billingDetails?.pincode) {
                this.toasterService.showSnackBar("error", this.localeData?.pincode_required);
            } else {
                this.router.navigate(['pages', 'invoice', 'ewaybill', 'create']);
            }
        });
    }

    /**
     * Check voucher is selected
     *
     * @param {*} voucher
     * @return {*}  {boolean}
     * @memberof VoucherListComponent
     */
    public isVoucherSelected(voucher: any): boolean {
        const isSelected = this.selectedVouchers?.filter(selectedVoucher => selectedVoucher?.uniqueName === voucher?.uniqueName);
        return isSelected?.length ? true : false;
    }

    /**
     * Apply Advance Search/ Filter
     *
     * @param {*} event
     * @memberof VoucherListComponent
     */

    public applyAdvanceSearch(event: any): void {
        const tempKeysInAdvanceFiltersForm = ['dueAmount', 'dateRange', 'grandTotalOperation', 'invoiceTotalAmount', 'invoiceDateRange'];
        this.advanceSearchDialogRef?.close();
        this.advanceFiltersApplied = true;
        let advanceFilters = {
            sortBy: this.advanceFilters.sortBy,
            sort: this.advanceFilters.sort,
            from: this.advanceFilters.from,
            to: this.advanceFilters.to,
            page: 1,
            count: PAGINATION_LIMIT,
            q: this.advanceFilters.q
        };

        this.advanceFilters = event;
        this.advanceFilters.sortBy = advanceFilters.sortBy;
        this.advanceFilters.sort = advanceFilters.sort;
        this.advanceFilters.from = advanceFilters.from;
        this.advanceFilters.to = advanceFilters.to;
        this.advanceFilters.page = advanceFilters.page;
        this.advanceFilters.count = advanceFilters.count;
        this.advanceFilters.q = advanceFilters.q;

        tempKeysInAdvanceFiltersForm.forEach(keys => {
            this.advanceSearchTempKeyObj = { ...this.advanceSearchTempKeyObj, [keys]: this.advanceFilters[keys] };
            delete this.advanceFilters[keys];
        });
        this.advanceFilters = this.vouchersUtilityService.cleanObject(this.advanceFilters);
        this.getVouchers(false);
        this.getVoucherBalances();
    }

    /**
     * Apply Receipt type filter
     *
     * @param {boolean} isAdvanceReceipt
     * @memberof VoucherListComponent
     */
    public applyReceiptTypeFilter(isAdvanceReceipt: boolean): void {
        this.advanceFiltersApplied = true;
        this.advanceFilters['receiptType'] = isAdvanceReceipt ? "ADVANCE_RECEIPT" : "NORMAL_RECEIPT";
        this.getVouchers(false);
        this.getVoucherBalances();
    }

    /**
     * Close Advance Search Dialog
     *
     *
     * @memberof VoucherListComponent
     */
    public closeAdvanceSearchDialog(): void {
        this.advanceSearchDialogRef?.close();
    }

    /**
     * Handle Voucher Actions API Call
     *
     * @param {*} voucher
     * @param {string} action
     * @memberof VoucherListComponent
     */
    public actionVoucher(voucher: any, action: string): void {
        this.componentStore.actionVoucher({ voucherUniqueName: voucher?.uniqueName, payload: { action: action, voucherType: voucher?.voucherType ?? this.voucherType } });
    }

    /**
     * Handle Estimate Proforma Actions API Call
     *
     * @param {*} voucher
     * @param {string} action
     * @memberof VoucherListComponent
     */
    public actionEstimateProforma(voucher: any, action: string): void {
        const model = {
            accountUniqueName: voucher.customerUniqueName,
            action: action
        };
        if (this.voucherType === VoucherTypeEnum.generateEstimate) {
            model['estimateNumber'] = voucher.voucherNumber;
        } else {
            model['proformaNumber'] = voucher.voucherNumber;
        }
        this.componentStore.actionEstimateProforma({
            request: model,
            voucherType: voucher?.voucherType ?? this.voucherType
        });
    }

    /**
     * Convert To Invoice API Call
     *
     * @param {*} voucher
     * @memberof VoucherListComponent
     */
    public convertToInvoice(voucher: any): void {
        const model = {
            accountUniqueName: voucher.customerUniqueName
        };

        if (voucher === VoucherTypeEnum.generateEstimate) {
            model['estimateNumber'] = voucher.voucherNumber;
        } else {
            model['proformaNumber'] = voucher.voucherNumber;
        }

        this.componentStore.convertToInvoice({
            request: model,
            voucherType: voucher?.voucherType ?? this.voucherType
        });
    }

    /**
     * Convert To Proforma API Call
     *
     * @param {*} voucher
     * @memberof VoucherListComponent
     */
    public convertToProforma(voucher: any): void {
        this.componentStore.convertToProforma({
            request: {
                accountUniqueName: voucher.customerUniqueName,
                estimateNumber: voucher.voucherNumber,
            },
            voucherType: voucher?.voucherType ?? this.voucherType
        });
    }

    /**
     * Handle Payment Submit
     *
     * @param {*} event
     * @memberof VoucherListComponent
     */
    public paymentSubmitted(event: any): void {
        this.componentStore.actionVoucher({ voucherUniqueName: event?.uniqueName, payload: event });
    }

    /**
     * Close Advance Receipt Dialog
     *
     * @memberof VoucherListComponent
     */
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

    /**
     * Go to ledger account with date range
     *
     * @param {*} voucher
     * @memberof VoucherListComponent
     */
    public goToLedger(voucher: any): void {
        let url = '/pages/ledger/' + voucher?.account?.uniqueName + '/' + this.advanceFilters.from + '/' + this.advanceFilters.to;
        this.openUrl(url);
    }

    /**
     * Create Generate Voucher Url based on Voucher type
     *
     * @param {*} voucher
     * @memberof VoucherListComponent
     */
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

    /**
     * Redirect to URL
     *
     * @private
     * @param {string} url
     * @memberof VoucherListComponent
     */
    private openUrl(url: string): void {
        if (isElectron) {
            let ipcRenderer = (window as any).require('electron').ipcRenderer;
            url = location.origin + location.pathname + `#./pages/${url}`;
            ipcRenderer.send('open-url', url);
        } else {
            (window as any).open(url);
        }
    }

    /**
     * Get Parent Group For Account Create
     *
     * @param {string} voucherType
     * @return {*}  {string}
     * @memberof VoucherListComponent
     */
    public getParentGroupForAccountCreate(voucherType: string): string {
        if (voucherType === VoucherTypeEnum.debitNote || voucherType === VoucherTypeEnum.purchase || voucherType === VoucherTypeEnum.purchaseOrder || voucherType === VoucherTypeEnum.cashBill || voucherType === VoucherTypeEnum.cashDebitNote) {
            return 'sundrycreditors';
        } else {
            return 'sundrydebtors';
        }
    }

    /**
     * Handle Edit Account
     *
     * @param {*} voucher
     * @memberof VoucherListComponent
     */
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

    /**
     * Reset Advance Filter
     *
     * @memberof VoucherListComponent
     */
    public setInitialAdvanceFilter(onlyResetValue: boolean = false): void {
        let universalDate;
        // get application date
        this.componentStore.universalDate$.pipe(take(1)).subscribe(date => {
            universalDate = date;
        });

        // set date picker date as application date
        if (universalDate?.length > 1) {
            this.selectedDateRange = { startDate: dayjs(universalDate[0]), endDate: dayjs(universalDate[1]) };
            this.selectedDateRangeUi = dayjs(universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
        }
        this.advanceFilters = {
            sortBy: '',
            sort: '',
            from: dayjs(this.selectedDateRange?.startDate).format(GIDDH_DATE_FORMAT) ?? '',
            to: dayjs(this.selectedDateRange?.endDate).format(GIDDH_DATE_FORMAT) ?? '',
            page: 1,
            count: this.pageSizeOptions[2], // Set default Count 50
            q: ''
        };
        this.voucherNumberInput.patchValue(null, { emitEvent: false });
        this.accountUniqueNameInput.patchValue(null, { emitEvent: false });
        this.purchaseOrderUniqueNameInput.patchValue(null, { emitEvent: false });
        this.showCustomerSearch = false;
        this.showInvoiceNoSearch = false;
        this.showPurchaseOrderNumberSearch = false;
        this.advanceFiltersApplied = false;
        this.isSearching = false;
        this.advanceSearchTempKeyObj = {};
        this.activeSearchField = null;
        if (!onlyResetValue) {
            this.getVouchers(false);
        }
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

    /**
     * This will return delivery days text
     *
     * @param {number} dueDays
     * @returns {string}
     * @memberof VoucherCreateComponent
     */
    public getDeliveryDaysText(dueDays: number): string {
        let text = "";

        if (dueDays > 0) {
            if (dueDays === 1) {
                text = this.localeData?.delivery_in_day;
            } else {
                text = this.localeData?.delivery_in_days;
            }
            text = text?.replace("[DAYS]", String(dueDays));
        } else {
            text = this.localeData?.delayed_by_days;
            text = text?.replace("[DAYS]", String(Math.abs(dueDays)));
        }

        return text;
    }

    /**
     * Open Send Email Dialog
     *
     * @param {*} voucher
     * @memberof VoucherListComponent
     */
    public openEmailSendDialog(voucher: any): void {
        this.sendEmailModalDialogRef = this.dialog.open(this.sendEmailModal, {
            panelClass: ['mat-dialog-sm']
        });
        this.currentVoucher = voucher;
    }

    /**
     * Send Email API Call
     *
     * @param {*} email
     * @memberof VoucherListComponent
     */
    public sendEmail(email: any): void {
        if (email && email.length) {
            if (this.voucherType === VoucherTypeEnum.purchaseOrder) {
                const request = {
                    accountUniqueName: this.currentVoucher?.vendor?.uniqueName,
                    uniqueName: this.currentVoucher?.uniqueName,
                    voucherType: this.voucherType
                };
                this.componentStore.sendEmail({ request, model: { emailId: [email] } });
            } else if (this.voucherType === VoucherTypeEnum.purchase) {
                this.componentStore.sendVoucherOnEmail({
                    accountUniqueName: this.currentVoucher?.account?.uniqueName,
                    payload: {
                        copyTypes: [],
                        email: {
                            to: email?.split(',').map(email => email.trim())
                        },
                        voucherType: this.voucherType,
                        uniqueName: this.currentVoucher?.uniqueName
                    }
                });
            }
        }
    }

    /**
     * Open convert bill dialog
     *
     * @param {*} [voucher]
     * @param {string} [action]
     * @memberof VoucherListComponent
     */
    public convertBillDialog(voucher?: any): void {
        const vouchers = voucher ? [voucher] : this.selectedVouchers;
        this.dialog.open(this.convertBill, {
            data: vouchers,
            width: '600px',
            maxHeight: '80vh'
        });
    }

    /**
     * Handle Purchase Order Bulk Actions
     *
     * @param {string} actionType
     * @param {*} [event]
     * @memberof VoucherListComponent
     */
    public poBulkAction(actionType: string, event?: any): void {
        if (actionType === 'delete' || actionType === 'expire') {
            const purchaseNumbers = this.selectedVouchers.map(voucher => voucher?.voucherNumber);
            this.componentStore.purchaseOrderBulkUpdateAction({ payload: { purchaseNumbers }, actionType: actionType });
        } else if (event?.purchaseOrders) {
            this.componentStore.purchaseOrderBulkUpdateAction({ payload: event, actionType: actionType });
        }
    }
}
