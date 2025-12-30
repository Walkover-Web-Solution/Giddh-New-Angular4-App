import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { NewConfirmationModalComponent } from "../../theme/new-confirmation-modal/confirmation-modal.component";
import { GeneralService } from "../../services/general.service";
import { TemplatePreviewDialogComponent } from "../template-preview-dialog/template-preview-dialog.component";
import { TemplateEditDialogComponent } from "../template-edit-dialog/template-edit-dialog.component";
import { Observable, ReplaySubject, debounceTime, delay, distinctUntilChanged, filter, merge, of as observableOf, skip, take, takeUntil } from "rxjs";
import { VouchersUtilityService } from "../utility/vouchers.utility.service";
import { VoucherComponentStore } from "../utility/vouchers.store";
import { AppState } from "../../store";
import { select, Store } from "@ngrx/store";
import * as dayjs from "dayjs";
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from "../../shared/helpers/defaultDateFormat";
import { CreditDebitNoteTableColumnsEnum, EstimateTableColumnsEnum, MULTI_CURRENCY_MODULES, PaymentTableColumnsEnum, ProformaTableColumnsEnum, PurchaseBillTableColumnsEnum, PurchaseOrderTableColumnsEnum, ReceiptTableColumnsEnum, SalesTableColumnsEnum, VoucherReportFilterModuleEnum, VoucherTypeEnum } from "../utility/vouchers.const";
import { ASIDE_PANE_CONFIG, Configuration, GIDDH_DATE_RANGE_PICKER_RANGES, PAGE_SIZE_OPTIONS, PAGINATION_LIMIT } from "../../app.constant";
import { cloneDeep, forEach, groupBy, orderBy } from "../../lodash-optimized";
import { FormControl, Validators } from "@angular/forms";
import { ToasterService } from "../../services/toaster.service";
import { InvoiceReceiptActions } from "../../actions/invoice/receipt/receipt.actions";
import { InvoiceService } from "../../services/invoice.service";
import { InvoiceTemplatesService } from "../../services/invoice.templates.service";
import { AdjustAdvancePaymentModal, VoucherAdjustments } from "../../models/api-models/AdvanceReceiptsAdjust";
import { AdjustmentUtilityService } from "../../shared/advance-receipt-adjustment/services/adjustment-utility.service";
import { UpdateAccountRequest } from "../../models/api-models/Account";
import { SalesActions } from "../../actions/sales/sales.action";
import { OrganizationType } from "../../models/user-login-state";
import { BulkUpdateComponent } from "../bulk-update/bulk-update.component";
import { CancelEInvoiceDialogComponent } from "../cancel-einvoice-dialog/cancel-einvoice-dialog.component";
import { BulkExportComponent } from "../bulk-export/bulk-export.component";
import { GenBulkInvoiceGroupByObj, GenerateBulkInvoiceObject, GetAllLedgersForInvoiceResponse, ILedgersInvoiceResult, InvoiceFilterClass, InvoicePreviewDetailsVm } from "../../models/api-models/Invoice";
import { InvoiceActions } from "../../actions/invoice/invoice.actions";
import { ServiceConfig } from "../../services/service.config";
import { FormBuilder, FormGroup } from "@angular/forms";
import { TemplateFroalaComponent } from '../../shared/template-froala/template-froala.component';
import { RestrictedModules } from '../../app.constant';
import { SettingsIntegrationActions } from "../../actions/settings/settings.integration.action";
import { CommonActions } from "../../actions/common.actions";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { MatMenuTrigger } from "@angular/material/menu";
import { ConfirmModalComponent } from "../../theme/new-confirm-modal/confirm-modal.component";
import { InvoiceUiDataService, TemplateContentUISectionVisibility } from '../../services/invoice.ui.data.service';
import { TemplateModeEnum } from "../../models/api-models/Sales";
import { environment } from "apps/web-giddh/src/environments/environment";

export interface VoucherBalances {
    grandTotal: Number;
    totalDue?: Number;
    advanceReceiptTotal?: Number;
    normalReceiptTotal?: Number;
}

/** Interface for report filter table column */
interface IReportFilterTableColumn {
    value: string;
    label?: string;
    checked: boolean;
}

@Component({
    selector: "list",
    templateUrl: "./list.component.html",
    styleUrls: ["./list.component.scss"],
    providers: [VoucherComponentStore],
    standalone: false
})
export class VoucherListComponent implements OnInit, OnDestroy {
    /** Hold all voucher list data source for table */
    public dataSource: any[] = [];
    /** This will use for displayed table columns */
    public displayedColumns: string[] = [];
    /** Holds Table Display columns for Pending Voucher */
    public displayedColumnPending: string[] = ['position', 'date', 'particular', 'amount', 'account', 'total', 'description'];
    /** This will use for dynamic customise column check values */
    public dynamicCustomColumns: IReportFilterTableColumn[] = [];
    /** Enum for voucher report filter module */
    public voucherReportFilterModuleEnum: typeof VoucherReportFilterModuleEnum = VoucherReportFilterModuleEnum;
    /** Holds module type for voucher report filter  */
    public moduleType: string;

    /** Template Reference for Generic aside menu account */
    @ViewChild("accountAsideMenu") public accountAsideMenu: TemplateRef<any>;
    /** Holds advance search dailog template reference */
    @ViewChild('advanceSearch', { static: true }) public advanceSearch: TemplateRef<any>;
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
    /** Holds send email dailog template reference send email */
    @ViewChild('sendEmailModal', { static: true }) public sendEmailModal: any;
    /** Instance of universal datepicker menu trigger */
    @ViewChild('universalDatepickerTrigger', { read: MatMenuTrigger }) public universalDatepickerTrigger: MatMenuTrigger;

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
    /** True if searching is in progress */
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
    /** Holds selected date range */
    public selectedDateRange: any;
    /** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /** This will store available date ranges */
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /* Selected range label */
    public selectedRangeLabel: any = "";
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Last vouchers get in progress Observable */
    public getVouchersInProgress$: Observable<boolean> = this.componentStore.getLastVouchersInProgress$;
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
    public selectedTabIndex: number;
    /** Holds active inner selected Tab Index  */
    public selectedInnerTabIndex: number;
    /** Holds universal date */
    public universalDate: any;
    /** Holds advance Filters keys */
    public advanceFilters: any = {};
    /** Holds Sort Key Map */
    public sortKeyMap: object = {};
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
    public isEInvoiceEnabled: boolean = null;
    /** Holds page size options for pagination */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    /** Holds Total Results Count */
    public totalResults: number = 0;
    /** Holds Pending Total Results Count */
    public pendingTotalResults: number = 0;
    /** Holds Selected Vouchers */
    public selectedVouchers: any[] = [];
    /** Holds Selected Pending Vouchers */
    public selectedPendingVouchers: any[] = [];
    /** Holds Voucher Name that suports csv file export */
    public csvSupportVoucherType: string[] = ['sales', 'debit note', 'credit note', 'purchase', 'receipt', 'payment'];
    /** Holds True if all Vouchers are Selected */
    public allVouchersSelected: boolean = false;
    /** Holds True if all Pending Vouchers are Selected */
    public allPendingVouchersSelected: boolean = false;
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
    /** True if consolidated branch */
    public isConsolidatedBranch: boolean;
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
    /** Holds current route query parameters */
    public queryParams: any = {};
    /** True if voucher generate in process */
    public generateVoucherInProcess: boolean = false;
    /** Decimal places from company settings */
    public giddhBalanceDecimalPlaces: number = 2;
    /** Duplicate copy of entry unique names for bulk action variable */
    public entryUniqueNamesForBulkActionDuplicateCopy: GenerateBulkInvoiceObject[] = [];
    /** Selected pending voucher */
    public selectedItem: InvoicePreviewDetailsVm;
    /** Selected account unique name */
    public selectedAccountUniqueName: string = '';
    /** selected profile currency symbol */
    public baseCurrencySymbol: string = '';
    /** selected profile currency type */
    public baseCurrency: string = '';
    /** True if custom date selected */
    public customDateSelected: boolean = false;
    /** Instance of ledger search request */
    public ledgerSearchRequest: InvoiceFilterClass = new InvoiceFilterClass();
    /** Loading Observable */
    public isGetAllRequestInProcess$: Observable<any> = this.componentStore.getLedgerDataInProcess$;
    /** Holds Ledger Data */
    public ledgersData: any[] = [];
    /** Holds voucher type for credit/debit note*/
    public voucherTypes: any[] = [];
    /** Holds voucher type enum */
    public voucherTypeEnum: any = VoucherTypeEnum;
    /** Returns true if all selected pending vouchers have the same account */
    public get hasSameVoucherAccount(): boolean {
        if (!this.selectedPendingVouchers?.length) {
            return false;
        }
        const firstAccountUniqueName = this.selectedPendingVouchers[0]?.account?.uniqueName;
        return this.selectedPendingVouchers.every(voucher =>
            voucher?.account?.uniqueName === firstAccountUniqueName
        );
    }
    /** Holds images folder path */
    public imgPath: string = "";
    /** Enum for restricted modules */
    public restrictedModules: any = RestrictedModules;
    /** Hold active company */
    public activeCompany: any;
    /* This will hold the PB lock date */
    public lockDate: Date = new Date();
    /* This will hold if email updated */
    public isEmailChanged: boolean = false;
    /* This will hold the original email*/
    public originalEmail: string;
    /* This will hold if gmail is integrated */
    public isGmailIntegrated: boolean;
    /* Observable for gmail auth code url */
    public gmailAuthCodeUrl$: Observable<string> = null;
    /* This holds gmail auth code url */
    private gmailAuthCodeStaticUrl: string = 'https://accounts.google.com/o/oauth2/auth?redirect_uri=:redirect_url&response_type=code&client_id=:client_id&scope=https://www.googleapis.com/auth/gmail.send&approval_prompt=force&access_type=offline';
    /** True if user has invoice setting permissions */
    public hasInvoiceSettingPermissions: boolean = true;
    /** Stores the form fields of onboard form API, required for GST validation in E-Invoice */
    public formFields: any[] = [];
    /** Stores the voucher API version of company */
    public voucherApiVersion: number;
    /** Form Group for setting form */
    public settingForm: FormGroup;
    /** Hold setting api response */
    public settingResponse: any;
    /** Hold request object for setting form to save */
    public formToSave: any;
    /** Holds true if update setting mode */
    public isSettingUpdateMode: boolean = false;
    /** Hold route params */
    public isRouteApplied: boolean = false;
    /** Hold current url */
    private currentUrl: string = "";
    /** Enum for estimate table columns */
    public estimateTableColumnsEnum: typeof EstimateTableColumnsEnum = EstimateTableColumnsEnum;
    /** Enum for proforma table columns */
    public proformaTableColumnsEnum: typeof ProformaTableColumnsEnum = ProformaTableColumnsEnum;
    /** Enum for sales table columns */
    public salesTableColumnsEnum: typeof SalesTableColumnsEnum = SalesTableColumnsEnum;
    /** Enum for Debit Note table columns */
    public creditDebitNoteTableColumnsEnum: typeof CreditDebitNoteTableColumnsEnum = CreditDebitNoteTableColumnsEnum;
    /** Enum for purchase order table columns */
    public purchaseOrderTableColumnsEnum: typeof PurchaseOrderTableColumnsEnum = PurchaseOrderTableColumnsEnum;
    /** Enum for purchase bill table columns */
    public purchaseBillTableColumnsEnum: typeof PurchaseBillTableColumnsEnum = PurchaseBillTableColumnsEnum;
    /** Enum for receipt table columns */
    public receiptTableColumnsEnum: typeof ReceiptTableColumnsEnum = ReceiptTableColumnsEnum;
    /** Enum for payment table columns */
    public paymentTableColumnsEnum: typeof PaymentTableColumnsEnum = PaymentTableColumnsEnum;
    /** True if columns loading */
    public isColumnsLoading: boolean = true;
    /** List of all templates fetched from the service */
    public templatesList: any[] = [];
    /** List of all created templates for a given type */
    public createdTemplatesList: any[] = [];
    /** True if datepicker menu is open */
    public isDatepickerMenuOpen: boolean = false;
    /** List of all created templates for a given type */
    public purchaseTemplatesList: any[] = [];
    /** Selected template */
    public selectedTemplate: any;
    /** True if columns loading */
    public showContent: boolean = true;
    /** Show invoice lock date */
    public showInvoiceDate: boolean = true;
    /** Show purchase lock date */
    public showPurchaseDate: boolean = true;
    public templateFor: string = '';

    constructor(
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        private router: Router,
        public dialog: MatDialog,
        @Inject(ServiceConfig) private serviceConfig,
        private componentStore: VoucherComponentStore,
        private store: Store<AppState>,
        private generalService: GeneralService,
        private vouchersUtilityService: VouchersUtilityService,
        private toasterService: ToasterService,
        private invoiceReceiptActions: InvoiceReceiptActions,
        private invoiceService: InvoiceService,
        private invoiceTemplatesService: InvoiceTemplatesService,
        private invoiceUiDataService: InvoiceUiDataService,
        private adjustmentUtilityService: AdjustmentUtilityService,
        private invoiceActions: InvoiceActions,
        private salesAction: SalesActions,
        private settingsIntegrationActions: SettingsIntegrationActions,
        private commonActions: CommonActions
    ) {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        this.store.dispatch(this.settingsIntegrationActions.GetGmailIntegrationStatus());

        this.gmailAuthCodeStaticUrl = this.gmailAuthCodeStaticUrl?.replace(':redirect_url', this.getRedirectUrl())?.replace(':client_id', GOOGLE_CLIENT_ID);
        this.gmailAuthCodeUrl$ = observableOf(this.gmailAuthCodeStaticUrl);

        this.componentStore.companyProfile$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (Object.keys(response)?.length) {
                this.company.baseCurrency = response.baseCurrency;
                this.company.baseCurrencySymbol = response.baseCurrencySymbol;
                this.company.inputMaskFormat = response.balanceDisplayFormat?.toLowerCase() || '';
                this.company.giddhBalanceDecimalPlaces = response.balanceDecimalPlaces;
            }
        });

        this.activatedRoute.queryParams.pipe(delay(0), takeUntil(this.destroyed$)).subscribe(params => {
            if (params && ((params.page && params.from && params.to) || params.tabIndex)) {
                this.queryParams = params;
                this.selectedInnerTabIndex = 4;
            }

            this.componentStore.activeCompany$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response) {
                    this.activeCompany = response;
                }
            });


            if (params?.code) {
                this.saveGmailAuthCode(params.code);
            }
        });
        this.initSettingsForm();
    }

    /**
     * Initializes the component
     *
     * @memberof VoucherListComponent
     */
    public ngOnInit(): void {
        this.currentUrl = this.router.url;
        this.settingForm.get('invoiceSettings.autoPaid')?.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(value => {
            if (value !== null && value !== undefined) {
                if (this.settingForm.get('invoiceSettings.autoPaid').value) {
                    return;
                } else {
                    this.settingForm.get('invoiceSettings.autoGenerateVoucherFromEntry').patchValue(false);
                }
            }
        });

        this.componentStore.hasInvoiceSettingPermissions$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.hasInvoiceSettingPermissions = response;
            }
        });

        this.settingForm.get('invoiceSettings.gstEInvoiceEnable')?.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(value => {

            if (value !== null && value !== undefined) {
                if (this.settingForm.get('invoiceSettings.gstEInvoiceEnable').value) {
                    return;
                } else {
                    this.settingForm.get('invoiceSettings.generateEinvoiceShowPopUp').patchValue(false);
                }
            }
        });

        this.componentStore.verifyEmailIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.store.dispatch(this.invoiceActions.getInvoiceSetting());
            }
        });

        this.imgPath = Configuration.isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || environment.AppUrl) + environment.APP_FOLDER + 'assets/images/';
        this.setInitialAdvanceFilter(true);
        this.isCompany = this.generalService.currentOrganizationType === OrganizationType.Company;

        /** If this is true, it means we are in branch consolidated mode.  */
        this.store.pipe(select(select => select.branchConsolidated), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isConsolidatedBranch = response.isBranchConsolidated;
            }
        });

        this.activatedRoute.params.pipe(delay(0), takeUntil(this.destroyed$)).subscribe(params => {
            if (params) {
                this.showContent = false;
                setTimeout(() => {
                    this.showContent = true;
                }, 50);
                this.isColumnsLoading = true;
                this.urlVoucherType = params?.voucherType;
                this.voucherType = this.vouchersUtilityService.parseVoucherType(params.voucherType);
                this.invoiceType = this.vouchersUtilityService.getVoucherType(this.voucherType);
                this.activeModule = params.module;
                if (this.activeModule === 'templates') {
                    if (this.urlVoucherType === VoucherTypeEnum.purchase) {
                        this.fetchTemplates(VoucherTypeEnum.purchase_bill);
                        this.fetchAllCreatedTemplates(VoucherTypeEnum.purchase_bill);
                    } else if (this.urlVoucherType === 'debit-note' || this.urlVoucherType === 'credit-note') {
                        this.fetchTemplates(VoucherTypeEnum.voucher);
                        this.fetchAllCreatedTemplates(VoucherTypeEnum.voucher);
                    } else if (this.urlVoucherType === VoucherTypeEnum.sales) {
                        this.fetchTemplates(VoucherTypeEnum.invoice);
                        this.fetchAllCreatedTemplates(VoucherTypeEnum.invoice);
                    }
                }
                setTimeout(() => {
                    if (this.urlVoucherType === VoucherTypeEnum.purchase) {
                        this.purchaseTemplatesList = [
                            { label: this.commonLocaleData?.app_purchase_bill, value: this.voucherTypeEnum.purchase_bill },
                            { label: this.commonLocaleData?.app_voucher_types?.purchase_order, value: this.voucherTypeEnum.purchase_order }
                        ];
                        this.selectedTemplate = this.purchaseTemplatesList[0];
                        this.templateFor = this.purchaseTemplatesList[0]?.value || null;
                    }  else {
                        this.selectedTemplate = null;
                        this.templateFor = null;
                    }
                }, 100);
                if ([VoucherTypeEnum.sales, VoucherTypeEnum.debitNote, VoucherTypeEnum.creditNote, VoucherTypeEnum.generateEstimate, VoucherTypeEnum.generateProforma, VoucherTypeEnum.purchase, VoucherTypeEnum.purchaseOrder, VoucherTypeEnum.receipt, VoucherTypeEnum.payment].includes(this.voucherType)) {
                    this.setModuleType();
                }

                if (this.activeModule === 'templates') {
                    document.querySelector('body').classList.add('template-wrapper');
                } else {
                    document.querySelector('body').classList.remove('template-wrapper');
                }
                this.selectedVouchers = [];
                this.allVouchersSelected = false;
                this.sortKeyMap = {};
                this.setInitialAdvanceFilter(true);
                if (this.settingResponse?.invoiceSettings) {
                    this.settingForm.patchValue({
                        purchaseBillSettings: this.settingResponse.purchaseBillSettings || {},
                        invoiceSettings: this.settingResponse.invoiceSettings || {},
                        proformaSettings: this.settingResponse.proformaSettings || {},
                        estimateSettings: this.settingResponse.estimateSettings || {},
                        companyEmailSettings: this.settingResponse.companyEmailSettings || {},
                        companyInventorySettings: this.settingResponse.companyInventorySettings || {}
                    });
                }
                if (this.isEInvoiceEnabled === null || params?.voucherType) {
                    this.initSettingObj();
                }
                if (this.queryParams.page) {
                    this.advanceFilters.page = this.queryParams.page;
                    this.advanceFilters.count = this.queryParams.count ?? this.pageSizeOptions[2];
                    this.advanceFilters.from = this.queryParams.from;
                    this.advanceFilters.to = this.queryParams.to;
                }
                this.activeTabGroup = this.tabsGroups.findIndex(group => group.includes(this.voucherType));

                if (this.activeTabGroup === -1) {
                    this.activeTabGroup = 0; // default to the first group if not found
                }

                this.getSelectedTabIndex();
                this.ledgerSearchRequest.page = 1;
                this.ledgerSearchRequest.count = PAGINATION_LIMIT;
                if (this.universalDate && !['list', 'settings', 'templates'].includes(this.activeModule)) {
                    this.customDateSelected = false;
                    this.getLedgersOfInvoice();
                }
                this.componentStore.isGmailIntegrated$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    this.isGmailIntegrated = response;
                    if (!this.isGmailIntegrated) {
                        this.settingForm.get('companyEmailSettings.sendThroughGmail')?.disable();
                        this.settingForm.get('purchaseBillSettings.sendThroughGmail')?.disable();
                    } else {
                        this.settingForm.get('companyEmailSettings.sendThroughGmail')?.enable();
                        this.settingForm.get('purchaseBillSettings.sendThroughGmail')?.enable();
                    }
                });
                if (!this.activeCompany?.subscription?.planDetails?.restrictedModules.hasOwnProperty(
                    this.restrictedModules.EInvoice)) {
                    this.settingForm.get('invoiceSettings.gstEInvoiceEnable')?.enable();
                } else {
                    this.settingForm.get('invoiceSettings.gstEInvoiceEnable')?.disable();
                }
            }
        });

        this.componentStore.onboardingForm$.pipe(takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                if (res.fields) {
                    this.formFields = [];
                    Object.keys(res.fields)?.forEach(key => {
                        if (res.fields[key]) {
                            this.formFields[res.fields[key].name] = [];
                            this.formFields[res.fields[key].name] = res.fields[key];
                        }
                    });
                }
            } else {
                let companyCountry = this.activeCompany?.countryV2?.alpha2CountryCode;
                if (companyCountry === 'IN') {
                    const requestObject = {
                        formName: 'onboarding',
                        country: companyCountry
                    };
                    this.store.dispatch(this.commonActions.GetOnboardingForm(requestObject));
                }
            }
        });

        /** Universal date */
        this.componentStore.universalDate$.pipe(filter(Boolean), skip(1), takeUntil(this.destroyed$)).subscribe(response => {
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

                if (this.queryParams.page) {
                    if (this.activeModule === 'list') {
                        this.generalService.updateActivatedRouteQueryParams({ from: this.advanceFilters.from, to: this.advanceFilters.to });
                    }
                    this.advanceFilters.page = this.queryParams.page;
                }
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
                this.toasterService.showSnackBar("success", (this.voucherType === VoucherTypeEnum.generateEstimate || this.voucherType === VoucherTypeEnum.generateProforma) ? this.localeData?.status_updated : this.commonLocaleData?.app_messages?.invoice_updated);
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
                (Array.isArray(response.body?.entries) ? response.body?.entries : []).forEach(entry => {
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
                    panelClass: ['mat-dialog-md'],
                    disableClose: true
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
                if (this.activeModule === 'pending') {
                    this.getLedgersOfInvoice();
                }
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

        this.componentStore.universalPendingDate$.pipe(takeUntil(this.destroyed$)).subscribe(dateObj => {
            if (dateObj) {
                this.universalDate = cloneDeep(dateObj);
                if (this.universalDate) {
                    this.ledgerSearchRequest.dateRange = this.universalDate;
                    this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                    this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                    this.isUniversalDateApplicable = true;
                    this.ledgerSearchRequest.from = dayjs(dateObj[0]).format(GIDDH_DATE_FORMAT);
                    this.ledgerSearchRequest.to = dayjs(dateObj[1]).format(GIDDH_DATE_FORMAT);
                } else {
                    this.universalDate = [];
                    this.ledgerSearchRequest.dateRange = this.universalDate;
                    this.ledgerSearchRequest.from = "";
                    this.ledgerSearchRequest.to = "";
                    this.isUniversalDateApplicable = false;
                }
                if (this.activeModule === 'pending') {
                    this.getLedgersOfInvoice();
                }
            }
        });

        this.componentStore.pendingVoucherList$.pipe(takeUntil(this.destroyed$)).subscribe((res: GetAllLedgersForInvoiceResponse) => {
            if (res && res.results) {
                let response = cloneDeep(res);
                this.ledgersData = [];
                this.pendingTotalResults = response?.totalItems;
                this.selectAllPendingVouchers({ checked: false });
                response.results = orderBy(response.results, (item: ILedgersInvoiceResult) => {
                    return dayjs(item.entryDate, GIDDH_DATE_FORMAT);
                }, 'desc');

                if (response && response.results) {
                    response.results.map(item => {
                        item = this.addToolTipText(item);
                        item.isSelected = this.generalService.checkIfValueExistsInArray(this.selectedPendingVouchers, item?.uniqueName);
                    });
                }
                this.ledgersData = response?.results;
            }
        });

        // listen for bulk invoice generate and successfully generate and do the things
        this.componentStore.isBulkInvoiceGenerated$.subscribe(result => {
            if (result) {
                this.selectAllPendingVouchers({ checked: false });
                this.getLedgersOfInvoice();
            }
        });

        this.componentStore.saveGmailAuthCodeIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                this.toasterService.showSnackBar('success', this.localeData?.gmail_account_added);
                this.store.dispatch(this.settingsIntegrationActions.GetGmailIntegrationStatus());
                if (this.urlVoucherType === VoucherTypeEnum.invoice) {
                    this.router.navigateByUrl('/pages/invoice/preview/settings/email');
                }
            }
        });
        const broadcast = new BroadcastChannel("settings");
        broadcast.onmessage = (event) => {
            if (event?.data?.form !== undefined && event?.data?.form !== null) {
                this.isSettingUpdateMode = false;
                let formValues = event?.data?.form;
                this.settingForm.patchValue({
                    purchaseBillSettings: formValues.purchaseBillSettings || {},
                    invoiceSettings: formValues.invoiceSettings || {},
                    proformaSettings: formValues.proformaSettings || {},
                    estimateSettings: formValues.estimateSettings || {},
                    companyEmailSettings: formValues.companyEmailSettings || {},
                    companyInventorySettings: formValues.companyInventorySettings || {}
                });
                this.isEInvoiceEnabled = formValues.invoiceSettings?.gstEInvoiceEnable;
                this.settingResponse = formValues;
                if (this.urlVoucherType === VoucherTypeEnum.purchase) {
                    if (!this.settingForm.get('purchaseBillSettings.enableVoucherDownload').value) {
                        this.settingForm.get('purchaseBillSettings.enableVoucherDownload').patchValue(false);
                    }
                    if (!this.settingForm.get('invoiceSettings.purchaseRoundOff').value) {
                        this.settingForm.get('invoiceSettings.purchaseRoundOff').patchValue(false);
                    }

                    if (!this.settingForm.get('invoiceSettings.generateAutoPurchaseNumber').value) {
                        this.settingForm.get('invoiceSettings.generateAutoPurchaseNumber').patchValue(false);
                    }
                    this.originalEmail = cloneDeep(formValues.purchaseBillSettings.email);
                } else {
                    this.originalEmail = cloneDeep(formValues.invoiceSettings.email);

                    this.settingForm.get('invoiceSettings.autoPaid')?.setValue(
                        this.settingForm.get('invoiceSettings.autoPaid')?.value === 'runtime'
                    );

                    if (formValues.companyEmailSettings) {
                        this.settingForm.get('companyEmailSettings.sendThroughGmail')?.setValue(
                            cloneDeep(formValues.companyEmailSettings.sendThroughGmail)
                        );
                    } else {
                        this.settingForm.get('companyEmailSettings.sendThroughGmail')?.setValue(false);
                    }
                }
            }
        };
    }

    /**
     * Check Searching is empty in all search fields
     *
     * @private
     * @memberof VoucherListComponent
     */
    private checkSearchingIsEmpty(): void {
        let searchingFieldIsEmpty: boolean = false;

        if (this.voucherType === VoucherTypeEnum.purchase) {
            searchingFieldIsEmpty = (this.purchaseOrderUniqueNameInput.value?.length > 0) || (this.accountUniqueNameInput.value?.length > 0) || (this.voucherNumberInput.value?.length > 0);
        } else {
            searchingFieldIsEmpty = (this.accountUniqueNameInput.value?.length > 0) || (this.voucherNumberInput.value?.length > 0);
        }

        this.advanceFiltersApplied = this.isSearching = searchingFieldIsEmpty;
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
            this.isColumnsLoading = false;
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
                    document.getElementById(this.activeSearchField)?.focus();
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
        const queryParams = {
            page: this.advanceFilters.page,
            count: this.advanceFilters.count,
            from: this.advanceFilters.from,
            to: this.advanceFilters.to,
        };

        const searchString = this.advanceFilters.q ?? this.advanceFilters.proformaNumber ?? this.advanceFilters.estimateNumber ?? this.advanceFilters.purchaseOrderNumber;
        if (searchString?.length) {
            queryParams['search'] = searchString;
        };

        this.router.navigate([`/pages/vouchers/view/${this.urlVoucherType}/${voucherUniqueName}`], {
            queryParams: queryParams
        });
    }

    /**
     * Set Selected Tab Index
     *
     * @private
     * @memberof VoucherListComponent
     */
    private getSelectedTabIndex(): void {
        if (!this.isCompany && !this.isConsolidatedBranch) {
            if (this.activeTabGroup === 0) {
                if (this.voucherType === 'estimates' && this.activeModule === 'list') {
                    this.selectedTabIndex = 0;
                } else if (this.voucherType === 'proformas' && this.activeModule === 'list') {
                    this.selectedTabIndex = 1;
                } else if (this.voucherType === 'sales' && this.activeModule === 'list') {
                    this.selectedTabIndex = 2;
                } else if (this.voucherType === 'sales' && this.activeModule === 'pending') {
                    this.selectedTabIndex = 3;
                } else if (this.voucherType === VoucherTypeEnum.sales && this.activeModule === 'settings') {
                    this.selectedTabIndex = 4;
                } else if (this.voucherType === VoucherTypeEnum.sales && this.activeModule === 'templates') {
                    this.selectedTabIndex = 5;
                }
            } else if (this.activeTabGroup === 1) {
                if (this.voucherType === VoucherTypeEnum.debitNote && this.activeModule === 'list') {
                    this.selectedTabIndex = 0;
                } else if (this.voucherType === VoucherTypeEnum.creditNote && this.activeModule === 'list') {
                    this.selectedTabIndex = 1;
                } else if (this.voucherType === VoucherTypeEnum.debitNote && this.activeModule === 'pending') {
                    this.selectedTabIndex = 2;
                } else if (this.voucherType === VoucherTypeEnum.debitNote && this.activeModule === 'settings') {
                    this.selectedTabIndex = 3;
                } else if (this.voucherType === VoucherTypeEnum.debitNote && this.activeModule === 'templates') {
                    this.selectedTabIndex = 4;
                }
            } else if (this.activeTabGroup === 2) {
                if (this.voucherType === 'purchase-order' && this.activeModule === 'list') {
                    this.selectedTabIndex = 0;
                } else if (this.voucherType === 'purchase' && this.activeModule === 'list') {
                    this.selectedTabIndex = 1;
                } else if (this.voucherType === 'purchase' && this.activeModule === 'settings') {
                    this.selectedTabIndex = 2;
                } else if (this.voucherType === 'purchase' && this.activeModule === 'templates') {
                    this.selectedTabIndex = 3;
                }
            } else if (this.activeTabGroup === 3) {
                if (this.voucherType === 'receipt' && this.activeModule === 'list') {
                    this.selectedTabIndex = 0;
                } else if ((this.voucherType === this.voucherTypeEnum.receipt) && this.activeModule === 'pending') {
                    this.selectedTabIndex = 1;
                } else if ((this.voucherType === this.voucherTypeEnum.receipt) && this.activeModule === 'settings') {
                    this.selectedTabIndex = 2;
                }
            } else if (this.activeTabGroup === 4) {
                if (this.voucherType === 'payment' && this.activeModule === 'list') {
                    this.selectedTabIndex = 0;
                } else if (this.voucherType === this.voucherTypeEnum.payment && this.activeModule === 'pending') {
                    this.selectedTabIndex = 1;
                } else if (this.voucherType === this.voucherTypeEnum.payment && this.activeModule === 'settings') {
                    this.selectedTabIndex = 2;
                }
            }
        } else {
            if (this.activeTabGroup === 0) {
                if (this.voucherType === 'estimates' && this.activeModule === 'list') {
                    this.selectedTabIndex = 0;
                } else if (this.voucherType === 'proformas' && this.activeModule === 'list') {
                    this.selectedTabIndex = 1;
                } else if (this.voucherType === 'sales' && this.activeModule === 'list') {
                    this.selectedTabIndex = 2;
                } else if (this.voucherType === 'sales' && this.activeModule === 'pending') {
                    this.selectedTabIndex = 3;
                } else if (this.voucherType === 'sales' && this.activeModule === 'templates') {
                    this.selectedTabIndex = 4;
                }
            } else if (this.activeTabGroup === 1) {
                if (this.voucherType === 'debit note' && this.activeModule === 'list') {
                    this.selectedTabIndex = 0;
                } else if (this.voucherType === 'credit note' && this.activeModule === 'list') {
                    this.selectedTabIndex = 1;
                } else if (this.voucherType === 'debit note' && this.activeModule === 'pending') {
                    this.selectedTabIndex = 2;
                } else if (this.voucherType === 'debit note' && this.activeModule === 'templates') {
                    this.selectedTabIndex = 3;
                }
            } else if (this.activeTabGroup === 2) {
                if (this.voucherType === 'purchase-order' && this.activeModule === 'list') {
                    this.selectedTabIndex = 0;
                } else if (this.voucherType === 'purchase' && this.activeModule === 'list') {
                    this.selectedTabIndex = 1;
                } else if (this.voucherType === 'purchase' && this.activeModule === 'templates') {
                    this.selectedTabIndex = 2;
                }
            } else if (this.activeTabGroup === 3) {
                if (this.voucherType === this.voucherTypeEnum.receipt && this.activeModule === 'list') {
                    this.selectedTabIndex = 0;
                } else if (this.voucherType === this.voucherTypeEnum.receipt && this.activeModule === 'pending') {
                    this.selectedTabIndex = 1;
                }
            } else if (this.activeTabGroup === 4) {
                if (this.voucherType === this.voucherTypeEnum.payment && this.activeModule === 'list') {
                    this.selectedTabIndex = 0;
                } else if (this.voucherType === this.voucherTypeEnum.payment && this.activeModule === 'pending') {
                    this.selectedTabIndex = 1;
                }
            }
        }
        this.isRouteApplied = false;
        if (this.queryParams.tabIndex === '4') {
            this.isRouteApplied = true;
            this.selectedTabIndex = this.queryParams.tabIndex;
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
        if (!this.isCompany && !this.isConsolidatedBranch) {
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
                } else if (selectedTabIndex === 3) {
                    voucherType = "purchase";
                    activeModule = "templates";
                }
            } else if (this.activeTabGroup === 3) {
                if (selectedTabIndex === 0) {
                    voucherType = "receipt";
                    activeModule = "list";
                } else if (selectedTabIndex === 1) {
                    voucherType = this.voucherTypeEnum.receipt;
                    activeModule = "pending";
                } else if (selectedTabIndex === 2) {
                    voucherType = this.voucherTypeEnum.receipt;
                    activeModule = "settings";
                }
            } else if (this.activeTabGroup === 4) {
                if (selectedTabIndex === 0) {
                    voucherType = "payment";
                    activeModule = "list";
                } else if (selectedTabIndex === 1) {
                    voucherType = this.voucherTypeEnum.payment;
                    activeModule = "pending";
                } else if (selectedTabIndex === 2) {
                    voucherType = this.voucherTypeEnum.payment;
                    activeModule = "settings";
                }
            }
        } else {
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
                    activeModule = "templates";
                }
            } else if (this.activeTabGroup === 3) {
                if (selectedTabIndex === 0) {
                    voucherType = this.voucherTypeEnum.receipt;
                    activeModule = "list";
                } else if (selectedTabIndex === 1) {
                    voucherType = this.voucherTypeEnum.receipt;
                    activeModule = "pending";
                }
            } else if (this.activeTabGroup === 4) {
                if (selectedTabIndex === 0) {
                    voucherType = this.voucherTypeEnum.payment;
                    activeModule = "list";
                } else if (selectedTabIndex === 1) {
                    voucherType = this.voucherTypeEnum.payment;
                    activeModule = "pending";
                }
            }
        }
        if (this.queryParams.page) {
            this.router.navigate(['/pages/vouchers/preview/' + voucherType + '/' + activeModule], {
                queryParams: {
                    page: this.queryParams.page ?? 1,
                    from: this.queryParams.from,
                    to: this.queryParams.to
                }
            });
        } else if (this.queryParams.tabIndex) {
            this.router.navigate(['/pages/vouchers/preview/' + voucherType + '/' + activeModule], {
                queryParams: {
                    tabIndex: this.queryParams.tabIndex ?? 0,
                }
            });
        } else {
            this.router.navigate(['/pages/vouchers/preview/' + voucherType + '/' + activeModule]);
        }
    }
    /**
     * Handle Tab Change event
     *
     * @param {*} selectedTabIndex
     * @memberof VoucherListComponent
     */
    public tabChanged(event: MatTabChangeEvent): void {
        this.selectedTabIndex = event.index;
        this.redirectToSelectedTab(event.index);
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
        if (this.sortKeyMap?.[event?.active]) {
            const sortValue = this.sortKeyMap?.[event?.active] === 'asc' ? 'desc' : 'asc';
            this.advanceFilters.sort = sortValue;
            this.sortKeyMap[event?.active] = sortValue;
        } else {
            this.advanceFilters.sort = event?.direction ?? 'asc';
            this.sortKeyMap = {
                ...this.sortKeyMap,
                [event?.active]: event?.direction
            };
        }
        this.advanceFilters.sortBy = event?.active;
        this.advanceFilters.page = 1;
        this.advanceFiltersApplied = true;
        this.getVouchers(false);
    }

    /**
     * Handle page change event and make API call
     *
     * @param {*} event
     * @memberof VoucherListComponent
     */
    public handlePageChange(event: any): void {
        if (this.activeModule === 'pending') {
            this.ledgerSearchRequest.page = event.pageIndex + 1;
            this.ledgerSearchRequest.count = event.pageSize;
            this.getLedgersOfInvoice();
        } else {
            this.advanceFilters.page = this.advanceFilters.count !== event.pageSize ? 1 : event.pageIndex + 1;
            this.advanceFilters.count = event.pageSize;
            this.getVouchers(false);
        }
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
      * Handle Select table pending item event
      *
      * @param {*} event
      * @param {*} voucher
      * @memberof VoucherListComponent
      */
    public selectPendingVoucher(event: any, voucher: any): void {
        if (event?.checked) {
            this.selectedPendingVouchers.push(voucher);
        } else {
            this.selectedPendingVouchers = this.selectedPendingVouchers?.filter(selectedVoucher => selectedVoucher?.uniqueName !== voucher?.uniqueName);
        }
        this.allPendingVouchersSelected = this.ledgersData?.length === this.selectedPendingVouchers?.length;
    }

    /**
    * Handle Select All Pending items
    *
    * @param {*} event
    * @memberof VoucherListComponent
    */
    public selectAllPendingVouchers(event: any): void {
        this.selectedPendingVouchers = [];
        this.allPendingVouchersSelected = event?.checked;
        if (event?.checked) {
            this.ledgersData?.forEach(voucher => {
                this.selectedPendingVouchers.push(voucher);
            });
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
     * @memberof VoucherListComponent
     */
    public getOverdueDaysText(days: any): string {
        let overdueDays = this.localeData?.overdue_days;
        overdueDays = overdueDays?.replace("[DAYS]", days);
        return overdueDays;
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof VoucherListComponent
     */
    public dateSelectedCallback(value?: any): void {
        if (value && value.event === "cancel") {
            this.toggleGiddhDatepicker(false);
            return;
        }
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.toggleGiddhDatepicker(false);
        if (value && value.startDate && value.endDate) {
            this.customDateSelected = true;
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.advanceFilters.from = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.advanceFilters.to = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
            this.ledgerSearchRequest.from = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.ledgerSearchRequest.to = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
            this.isUniversalDateApplicable = false;
            this.advanceFiltersApplied = true;
            this.ledgerSearchRequest.page = 1;
            this.advanceFilters.page = 1;

            if (window.localStorage) {
                localStorage.setItem('invoiceSelectedDate', JSON.stringify(this.invoiceSelectedDate));
            }

            if (this.activeModule === 'pending') {
                this.getLedgersOfInvoice();
            } else {
                this.getVouchers(this.isUniversalDateApplicable);
                this.getVoucherBalances();
            }
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
        document.querySelector('body').classList.remove('template-wrapper');
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
            panelClass: ['mat-dialog-md'],
            disableClose: true
        });
    }

    /**
     * Open Bulk Export Dialog
     *
     * @memberof VoucherListComponent
     */
    public showBulkExportDialog(): void {
        let voucherType = this.voucherType;
        if (this.voucherType === VoucherTypeEnum.generateEstimate || this.voucherType === VoucherTypeEnum.generateProforma) {
            voucherType = this.voucherType === VoucherTypeEnum.generateEstimate ? VoucherTypeEnum.estimate : VoucherTypeEnum.proforma;
        } else if (this.voucherType === VoucherTypeEnum.purchaseOrder) {
            voucherType = "purchase order";
        }
        const dialogRef = this.dialog.open(BulkExportComponent, {
            data: {
                voucherUniqueNames: this.selectedVouchers?.map(voucher => { return voucher?.uniqueName }),
                voucherType: voucherType,
                advanceFilters: this.advanceFilters,
                totalItems: this.selectedVouchers?.length || this.totalResults,
                allVouchersSelected: this.allVouchersSelected,
                localeData: this.localeData
            },
            maxHeight: '80vh',
            disableClose: true
        });

        dialogRef.afterClosed().subscribe((response) => {
            if (response) {
                this.selectedVouchers = [];
                this.allVouchersSelected = false;
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
            panelClass: ['mat-dialog-md'],
            disableClose: true
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
            data: dataToSend,
            disableClose: true
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
            data: dataToSend,
            disableClose: true
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
            },
            disableClose: true
        });

        dialogRef.afterClosed().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response === this.commonLocaleData?.app_yes) {
                this.advanceFilters.page = this.generalService.adjustPageIndex(this.dataSource?.length, this.advanceFilters.page, this.advanceFilters.count, voucher?.uniqueName ? 1 : this.selectedVouchers?.length);
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
                    const selectedVoucher = voucher ?? this.selectedVouchers[0];
                    const payload = {
                        accountUniqueName: selectedVoucher.customerUniqueName
                    }
                    if (this.voucherType === VoucherTypeEnum.generateEstimate) {
                        payload['estimateNumber'] = selectedVoucher?.estimateNumber;
                    } else {
                        payload['proformaNumber'] = selectedVoucher?.proformaNumber;
                    }
                    this.componentStore.deleteEstimsteProformaVoucher({ payload: payload, voucherType: this.voucherType });
                } else {
                    const payload = {
                        voucherUniqueNames: voucher?.uniqueName ? [voucher.uniqueName] : this.selectedVouchers?.map(voucher => { return voucher?.uniqueName }),
                        voucherType: this.voucherType
                    };
                    this.componentStore.bulkUpdateInvoice({ payload: payload, actionType: 'delete' });
                }
            }
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
                    width: '600px',
                    disableClose: true
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
    * Check pending voucher is selected
    *
    * @param {*} voucher
    * @return {*}  {boolean}
    * @memberof VoucherListComponent
    */
    public isPendingVoucherSelected(voucher: any): boolean {
        const isSelected = this.selectedPendingVouchers?.filter(selectedVoucher => selectedVoucher?.uniqueName === voucher?.uniqueName);
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

        (Array.isArray(tempKeysInAdvanceFiltersForm) ? tempKeysInAdvanceFiltersForm : []).forEach(keys => {
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
     * Handle Cancel Voucher Dialog
     *
     * @param {*} voucher
     * @memberof VoucherListComponent
     */
    public openCancelVoucherDialog(voucher: any): void {
        const dialogRef = this.dialog.open(NewConfirmationModalComponent, {
            panelClass: ['mat-dialog-md'],
            data: {
                configuration: this.generalService.deleteConfiguration(this.localeData?.cancel_voucher_confirmation_message, this.commonLocaleData)
            }
        });

        dialogRef.afterClosed().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response === this.commonLocaleData?.app_yes) {
                this.actionVoucher(voucher, 'cancel');
            }
        });
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

        if (this.voucherType === VoucherTypeEnum.generateEstimate) {
            model['estimateNumber'] = voucher.voucherNumber;
        } else {
            model['proformaNumber'] = voucher.voucherNumber;
        }

        this.componentStore.convertToInvoice({
            request: model,
            voucherType: this.voucherType
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
    * @memberof VoucherListComponent
    */
    public getAdvanceReceiptAdjustData(advanceReceiptsAdjustEvent: { adjustVoucherData: VoucherAdjustments, adjustPaymentData: AdjustAdvancePaymentModal }): void {
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
        const fromDate = this.activeModule === 'pending'
            ? this.ledgerSearchRequest?.from
            : this.advanceFilters?.from;

        const toDate = this.activeModule === 'pending'
            ? this.ledgerSearchRequest?.to
            : this.advanceFilters?.to;

        const accountUniqueName = voucher?.account?.uniqueName;

        if (accountUniqueName && fromDate && toDate) {
            let url = `/pages/ledger/${accountUniqueName}/${fromDate}/${toDate}`;
            const separator = url.includes('?') ? '&' : '?';
            url = url + `${separator}redirectUrl=${encodeURIComponent(this.currentUrl)}`;
            this.openUrl(url);
        }
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
            try {
                let electronIpcAvailable = false;

                // Try electronAPI first (secure context)
                if ((window as any).electronAPI && (window as any).electronAPI.send) {
                    try {
                        const electronUrl = location.origin + location.pathname + `#.${url}`;
                        (window as any).electronAPI.send('open-url', electronUrl);
                        electronIpcAvailable = true;
                    } catch (ipcError) {
                        console.warn('ElectronAPI send failed:', ipcError);
                    }
                }

                // Try legacy electron require (fallback)
                if (!electronIpcAvailable && (window as any).require) {
                    try {
                        const electron = (window as any).require('electron');
                        if (electron && electron.ipcRenderer && electron.ipcRenderer.send) {
                            const electronUrl = location.origin + location.pathname + `#.${url}`;
                            electron.ipcRenderer.send('open-url', electronUrl);
                            electronIpcAvailable = true;
                        }
                    } catch (requireError) {
                        console.warn('Electron require failed:', requireError);
                    }
                }

                // Fallback to regular window.open if IPC not available
                if (!electronIpcAvailable) {
                    console.warn('Electron IPC not available for page leave utility, using window.open');
                    (window as any).open(url);
                }
            } catch (error) {
                console.warn('Electron navigation failed, using window.open:', error);
                (window as any).open(url);
            }
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

        this.accountAsideMenuRef = this.dialog.open(this.accountAsideMenu, ASIDE_PANE_CONFIG);
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
        this.sortKeyMap = {};
        if (!onlyResetValue) {
            this.getVouchers(false);
        }
    }

    /**
     * Callback for update account
     *
     * @param {UpdateAccountRequest} item
     * @param {boolean} [usePatchApi=false]
     * @memberof VoucherCreateComponent
     */
    public updateAccount(item: UpdateAccountRequest, usePatchApi: boolean = false): void {
        this.store.dispatch(this.salesAction.updateAccountDetailsForSales(item, usePatchApi));
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
            panelClass: ['mat-dialog-sm'],
            disableClose: true
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
                this.componentStore.sendEmailOnPurchaseOrder({ request, model: { emailId: email } });
            } else if (this.voucherType === VoucherTypeEnum.purchase) {
                this.componentStore.sendVoucherOnEmail({
                    accountUniqueName: this.currentVoucher?.account?.uniqueName,
                    payload: {
                        copyTypes: [],
                        email: {
                            to: email
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
                    maxHeight: '80vh',
                    disableClose: true
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

    /**
     * Handle Copy voucher redirect to voucher create page with respective voucher
     *
     * @memberof VoucherListComponent
     */
    public copyVoucher(voucher: any): void {
        const queryParams = {
            from: this.advanceFilters.from,
            to: this.advanceFilters.to,
            page: this.advanceFilters.page,
            count: this.advanceFilters.count ?? PAGINATION_LIMIT
        }

        const searchString = this.advanceFilters.q ?? this.advanceFilters.proformaNumber ?? this.advanceFilters.estimateNumber ?? this.advanceFilters.purchaseOrderNumber;
        if (searchString?.length) {
            queryParams['search'] = searchString;
        }

        if (this.voucherType === VoucherTypeEnum.generateEstimate) {
            this.router.navigate([`/pages/vouchers/estimates/${voucher?.account?.uniqueName}/${voucher?.voucherNumber}/copy`], { queryParams: queryParams });
        } else if (this.voucherType === VoucherTypeEnum.generateProforma) {
            this.router.navigate([`/pages/vouchers/proformas/${voucher?.account?.uniqueName}/${voucher?.voucherNumber}/copy`], { queryParams: queryParams });
        } else {
            this.router.navigate([`/pages/vouchers/${this.urlVoucherType}/${voucher?.account?.uniqueName ?? voucher?.vendor?.uniqueName}/${voucher?.uniqueName}/copy`], { queryParams: queryParams });
        }
    }

    /**
     * Fetch ledgers for invoices.
     *
     * @memberof VoucherListComponent
     */
    public getLedgersOfInvoice(): void {
        if (this.isLedgerDataEmpty()) {
            this.decrementPageIfNeeded();
        }
        this.fetchLedgers();

        this.selectedPendingVouchers = [];
    }

    /**
     * Dispatches a request to fetch ledgers.
     *
     * @private
     * @memberof VoucherListComponent
     */
    private fetchLedgers(): void {
        this.store.dispatch(
            this.invoiceActions.GetAllLedgersForInvoice(
                this.prepareQueryParamsForLedgerApi(),
                this.prepareModelForLedgerApi()
            )
        );
    }

    /**
     * Checks if ledger data is empty.
     *
     * @private
     * @return {*}  {boolean}
     * @memberof VoucherListComponent
     */
    private isLedgerDataEmpty(): boolean {
        return !this.ledgersData || this.ledgersData.length === 0;
    }

    /**
     * Decrements the page if it's greater than 1.
     *
     * @private
     * @memberof VoucherListComponent
     */
    private decrementPageIfNeeded(): void {
        if (this.ledgerSearchRequest.page > 1) {
            this.ledgerSearchRequest.page -= 1;
        }
    }

    /**
     *  Prepares the model for the ledger API request.
     *
     * @return {*}  {*}
     * @memberof VoucherListComponent
     */
    public prepareModelForLedgerApi(): any {
        const model: Partial<InvoiceFilterClass> = {};
        const reqObj = cloneDeep(this.ledgerSearchRequest);

        if (reqObj.accountUniqueName) model.accountUniqueName = reqObj.accountUniqueName;
        if (reqObj.entryTotal) model.entryTotal = reqObj.entryTotal;
        if (reqObj.description) model.description = reqObj.description;

        return model;
    }

    /**
     *  Prepares query parameters for the ledger API request.
     *
     * @return {*}  {*}
     * @memberof VoucherListComponent
     */
    public prepareQueryParamsForLedgerApi(): any {
        const reqObj = cloneDeep(this.ledgerSearchRequest);
        const fromDate = this.isUniversalDateApplicable
            ? dayjs(this.universalDate[0]).format(GIDDH_DATE_FORMAT)
            : reqObj.from;
        const toDate = this.isUniversalDateApplicable
            ? dayjs(this.universalDate[1]).format(GIDDH_DATE_FORMAT)
            : reqObj.to;

        return { from: fromDate, to: toDate, count: reqObj.count, page: reqObj.page, voucherType: this.voucherType };
    }

    /**
     * Resets the date search filters.
     *
     * @memberof VoucherListComponent
     */
    public resetDateSearch(): void {
        this.customDateSelected = false;
        if (this.universalDate) {
            this.applyUniversalDate();
        } else {
            this.clearDateFilters();
        }
        this.getLedgersOfInvoice();
    }

    /**
     * Applies the universal date to the search filters.
     *
     * @private
     * @memberof VoucherListComponent
     */
    private applyUniversalDate(): void {
        this.isUniversalDateApplicable = true;
        this.selectedDateRange = {
            startDate: dayjs(this.universalDate[0]),
            endDate: dayjs(this.universalDate[1])
        };
        this.selectedDateRangeUi = `${dayjs(this.universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI)} - ${dayjs(this.universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI)}`;
    }

    /**
     * Clears date filters.
     *
     * @private
     * @memberof VoucherListComponent
     */
    private clearDateFilters(): void {
        this.universalDate = [];
        this.isUniversalDateApplicable = false;
    }

    /**
     * This will be check account of same accouunt on selected pending vouchers
     *
     * @return {*}  {boolean}
     * @memberof VoucherListComponent
     */
    public isSameAccount(): boolean {
        if (!this.selectedPendingVouchers?.length) {
            return false;
        }
        const firstAccountUniqueName = this.selectedPendingVouchers[0]?.account?.uniqueName;
        return this.selectedPendingVouchers.every(voucher =>
            voucher?.account?.uniqueName === firstAccountUniqueName
        );
    }

    /**
     *  Navigates to the preview invoice page.
     *
     * @memberof VoucherListComponent
     */
    public invoiceGenerate(): void {
        const voucher = this.selectedPendingVouchers[0];
        const uniqueNames = this.selectedPendingVouchers.map(voucher => voucher.uniqueName).join(',');
        if (voucher) {
            let url = `/pages/vouchers/${voucher.voucherType}/${voucher.account?.uniqueName}/create?entryUniqueNames=${uniqueNames}&voucherType=${this.voucherType}`;
            this.openUrl(url);
        }
    }

    /**
     * Generates bulk invoices.
     *
     * @param {boolean} action
     * @param {boolean} [generateEInvoice]
     * @return {*}  {boolean}
     * @memberof VoucherListComponent
     */
    public generateBulkInvoice(action: boolean, generateEInvoice?: boolean): void {
        if (this.selectedPendingVouchers?.length === 0 && typeof generateEInvoice !== 'boolean') {
            return;
        }

        const groupedVouchers = this.groupPendingVouchersByAccount();
        const model = typeof generateEInvoice === 'boolean'
            ? this.entryUniqueNamesForBulkActionDuplicateCopy
            : this.flattenGroupedVouchers(groupedVouchers);

        this.entryUniqueNamesForBulkActionDuplicateCopy = cloneDeep(model);
        this.store.dispatch(
            this.invoiceActions.GenerateBulkInvoice(
                { combined: action },
                { entryUniqueNames: model, generateEInvoice }
            )
        );

        this.selectedPendingVouchers = [];
    }

    /**
     * Groups pending vouchers by account unique name.
     *
     * @private
     * @return {*}  {Record<string, GenBulkInvoiceGroupByObj[]>}
     * @memberof VoucherListComponent
     */
    private groupPendingVouchersByAccount(): Record<string, GenBulkInvoiceGroupByObj[]> {
        const arr: GenBulkInvoiceGroupByObj[] = this.selectedPendingVouchers.map(item => ({
            accUniqueName: item.account?.uniqueName,
            uniqueName: item?.uniqueName
        }));
        return groupBy(arr, 'accUniqueName');
    }

    /**
     *  Flattens grouped vouchers into an array of unique names.
     *
     * @private
     * @param {Record<string, GenBulkInvoiceGroupByObj[]>} grouped
     * @return {*}  {string[]}
     * @memberof VoucherListComponent
     */
    private flattenGroupedVouchers(groupedVoucher: Record<string, GenBulkInvoiceGroupByObj[]>): string[] {
        const model: string[] = [];
        forEach(groupedVoucher, items => {
            (Array.isArray(items) ? items : []).forEach(obj => model.push(obj?.uniqueName));
        });
        return model;
    }

    /**
     * Add tooltip text in ledger invoices
     *
     * @private
     * @param {ILedgersInvoiceResult} item
     * @return {*}  {ILedgersInvoiceResult}
     * @memberof VoucherListComponent
     */
    private addToolTipText(item: ILedgersInvoiceResult): ILedgersInvoiceResult {
        if (!item?.total || !item?.totalForCompany) {
            return item;
        }

        const grandTotalAmountForCompany = Number(item.totalForCompany.amount) || 0;
        const grandTotalAmountForAccount = Number(item.total.amount) || 0;

        // Calculate conversion rate
        const grandTotalConversionRate = grandTotalAmountForAccount
            ? +(grandTotalAmountForCompany / grandTotalAmountForAccount).toFixed(this.giddhBalanceDecimalPlaces)
            : 0;

        // Replace placeholders in the tooltip template
        const currencyConversion = this.localeData?.currency_conversion
            ?.replace("[BASE_CURRENCY]", this.baseCurrency)
            ?.replace("[AMOUNT]", grandTotalAmountForCompany.toLocaleString())
            ?.replace("[CONVERSION_RATE]", grandTotalConversionRate.toString());

        // Assign tooltip text to the item
        item.totalTooltipText = currencyConversion || '';

        return item;
    }

    /**
     * Callback for translation response complete
     *
     * @param {boolean} event
     * @memberof VoucherListComponent
     */
    public translationComplete(event: boolean): void {
        if (event) {
            this.voucherTypes = [
                { label: this.localeData.tabs.credit_note, value: VoucherTypeEnum.creditNote },
                { label: this.localeData.tabs.debit_note, value: VoucherTypeEnum.debitNote }
            ];
        }
    }

    /**
     * This will update the gmail integration
     *
     * @private
     * @param {string} authCode
     * @memberof VoucherListComponent
     */
    private saveGmailAuthCode(authCode: string): void {
        const dataToSave = {
            code: authCode,
            client_secret: GOOGLE_CLIENT_SECRET,
            client_id: GOOGLE_CLIENT_ID,
            grant_type: 'authorization_code',
            redirect_uri: this.getRedirectUrl()
        };
        this.componentStore.saveGmailAuthCode(dataToSave);
    }

    /**
     * This will return page url
     *
     * @returns {string}
     * @memberof VoucherListComponent
     */
    public getRedirectUrl(): string {
        if (this.urlVoucherType === VoucherTypeEnum.purchase) {
            return AppUrl + 'pages/purchase-management/purchase/settings';
        } else {
            return AppUrl + 'pages/vouchers/preview/sales/settings';
        }
    }

    /**
     * Reset setting form
     *
     * @memberof VoucherListComponent
     */
    public resetForm(): void {
        this.initSettingObj();
    }

    /**
 * This will update the settings email
 *
 * @param {*} emailAddress
 * @memberof VoucherListComponent
 */
    public updateSettingsEmail(emailAddress: any): void {
        let getRequestObject = {
            companyUniqueName: this.activeCompany.uniqueName
        };

        let postRequestObject = {
            emailAddress: emailAddress
        };
        this.componentStore.verifyPurchaseEmail({ getRequestObject: getRequestObject, postRequestObject: postRequestObject });
    }

    /**
     * Open custom email dialog
     *
     * @param {string} voucherType
     * @memberof VoucherListComponent
     */
    public openCustomEmailDialog(voucherType: string): void {
        this.dialog.open(TemplateFroalaComponent, {
            data: voucherType,
            ...ASIDE_PANE_CONFIG
        });
    }

    /**
     * Navigates to the page for buy plan.
     * @param subscriptionId
     * @memberof  VoucherListComponent
     */
    public buyPlan(subscriptionId: string): void {
        this.router.navigate(['/pages/user-details/subscription/buy-plan/' + subscriptionId]);
    }

    /**
   * Handler for E-invoice authentication change
   *
   * @param {*} event
   * @memberof VoucherListComponent
   */
    public handleEInvoiceChange(event: any): void {
        if (!event) {
            // E-Invoice unchecked reset the credentials
            this.settingForm.get('invoiceSetting.gstEInvoiceGstin')?.patchValue('');
            this.settingForm.get('invoiceSetting.gstEInvoiceUserName')?.patchValue('');
            this.settingForm.get('invoiceSetting.gstEInvoiceUserPassword')?.patchValue('');
        } else {
            this.fetchCompanyGstDetails();
        }
    }

    /**
     * Send voucher type whatsapp option.
     *
     * @param {string} voucherType
     * @returns {boolean}
     * @memberof VoucherListComponent
     */
    public getWhatsappSettingLabel(voucherType: string): string {
        return this.commonLocaleData?.app_send_voucher_type_whatsapp?.replace("[VOUCHER_TYPE]", voucherType);
    }

    /**
     * Send voucher type for payment and receipt whatsapp option.
     *
     * @param {string} voucherType
     * @returns {boolean}
     * @memberof VoucherListComponent
     */
    public getWhatsappPaymentReceiptSettingLabel(voucherType: string): string {
        return this.commonLocaleData?.app_send_payment_receipt_type_whatsapp?.replace("[VOUCHER_TYPE]", voucherType);
    }

    /**
     * Auto-fills the GST number field for E-invoice
     *
     * @private
     * @memberof VoucherListComponent
     */
    private fetchCompanyGstDetails(): void {
        let branches = [];
        let currentBranch;
        this.componentStore.branchList$.pipe(take(1)).subscribe(response => {
            if (response && response.length) {
                branches = response;

                if (this.generalService.currentOrganizationType === OrganizationType.Branch) {
                    // Find the current checked out branch
                    currentBranch = branches.find(branch => branch?.uniqueName === this.generalService.currentBranchUniqueName);
                } else {
                    // Find the HO branch
                    currentBranch = branches.find(branch => !branch.parentBranch);
                }
                if (currentBranch && currentBranch.addresses) {
                    const defaultAddress = currentBranch.addresses.find(address => (address && address.isDefault));
                    if (defaultAddress) {
                        this.settingForm.get('invoiceSetting.gstEInvoiceGstin')?.patchValue(defaultAddress.taxNumber);
                    }
                }
            }
        });
    }

    /**
     * Handles email change event
     *
     * @param {string} email
     * @memberof VoucherListComponent
     */
    public onChangeEmail(email: string): void {
        this.isEmailChanged = email !== this.originalEmail;
    }

    /**
     * Deletes email ID
     *
     * @param {string} emailId
     * @return {*}
     * @memberof VoucherListComponent
     */
    public deleteEmail(emailId: string) {
        if (!emailId) {
            return false;
        }

        const dialogRef = this.dialog.open(NewConfirmationModalComponent, {
            panelClass: ['mat-dialog-sm'],
            data: {
                configuration: this.generalService.deleteConfiguration(this.localeData?.delete_email_confirmation_message, this.commonLocaleData)
            }
        });

        dialogRef.afterClosed().subscribe(response => {
            if (response && response === this.commonLocaleData?.app_yes) {
                if (this.urlVoucherType === VoucherTypeEnum.purchase) {
                    this.updateSettingsEmail(null);
                    return true;
                } else {
                    this.store.dispatch(this.invoiceActions.deleteInvoiceEmail(null)); // send null to delete email
                }
            }
        });
    }

    /**
     * Verifies email format and updates settings
     *
     * @param {string} emailId
     * @param {string} voucherType
     * @return {*}
     * @memberof VoucherListComponent
     */
    public verifyEmail(emailId: string, voucherType: string) {
        let email = new RegExp(/[a-z0-9!#$%&'*+=?^_{|}~-]+(?:.[a-z0-9!#$%&’*+=?^_{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g);
        if (email.test(emailId)) {
            if (voucherType === 'purchase') {
                this.updateSettingsEmail(emailId);
            } else {
                this.store.dispatch(this.invoiceActions.updateInvoiceEmail(emailId));
            }
        } else {
            this.toasterService.showSnackBar("warning", this.localeData?.invalid_email);
            return false;
        }
    }

    /**
     * Initializes settings form
     *
     * @memberof VoucherListComponent
     */
    public initSettingsForm(): void {
        this.settingForm = this.fb.group({
            purchaseBillSettings: this.createPurchaseBillSettingsForm(), // Define controls if needed
            invoiceSettings: this.createInvoiceSettingsForm(),
            proformaSettings: this.createProformaSettingsForm(),
            estimateSettings: this.createEstimateSettingsForm(),
            companyEmailSettings: this.createCompanyEmailSettingsForm(),
            companyInventorySettings: this.createCompanyInventorySettingsForm()
        });
    }

    /**
     * Creates purchase bill settings form
     *
     * @return {*}  {FormGroup}
     * @memberof VoucherListComponent
     */
    public createPurchaseBillSettingsForm(): FormGroup {
        return this.fb.group({
            email: [null],
            emailVerified: [false],
            sendPOLinkOnSms: [false],
            poSmsContent: [null],
            poNumberPrefix: [null],
            poDuePeriod: [null],
            initialPONumber: [null],
            lockDate: [""],
            enableNarration: [false],
            autoDeleteEntries: [true],
            sendThroughGmail: [false],
            branchPurchaseBillNumberPrefix: [null],
            poAutoWhatsApp: [false],
            autoWhatsApp: [false],
            changePOStatusOnExpiry: [false],
            useCustomPONumber: [false],
            enableVoucherDownload: [true],
            invoiceSettings: this.createInvoiceSettingsForm()
        });
    }

    /**
     * Creates invoice settings form
     *
     * @return {*}  {FormGroup}
     * @memberof VoucherListComponent
     */
    public createInvoiceSettingsForm(): FormGroup {
        return this.fb.group({
            autoMail: [true],
            duePeriod: [null],
            autoEntryAndInvoice: [false],
            generateEinvoiceShowPopUp: [false],
            showSeal: [true],
            autoPaid: [null],
            autoGenerateVoucherFromEntry: [true],
            autoMailDebitNote: [true],
            autoMailCreditNote: [true],
            branchInvoiceNumberPrefix: [null],
            invoiceNumberPrefix: [null],
            initialInvoiceNumber: [null],
            createPaymentEntry: [false],
            email: [null],
            emailVerified: [null],
            autoEntryVoucherAndEmail: [false],
            lockDate: [""],
            useCustomInvoiceNumber: [false],
            useCustomCreditNoteNumber: [false],
            useCustomDebitNoteNumber: [false],
            useCustomReceiptNumber: [false],
            autoWhatsAppReceipt: [false],
            receiptNumberPrefix: [null],
            initialReceiptNumber: [null],
            branchReceiptNumberPrefix: [null],
            autoMailReceipt: [true],
            autoMailPayment: [true],
            useCustomPaymentNumber: [false],
            useCustomContraNumber: [false],
            useCustomPurchaseNumber: [false],
            defaultPaymentGateway: ["razorpay"],
            enableNarrationOnInvAndVoucher: [false],
            voucherAddressManualEnabled: [false],
            sendInvLinkOnSms: [false],
            smsContent: [null],
            autoDeleteEntries: [true],
            gstEInvoiceEnable: [false],
            gstEInvoiceGstin: [null],
            gstEInvoiceUserName: [null],
            gstEInvoiceUserPassword: [null],
            salesRoundOff: [true],
            purchaseRoundOff: [true],
            generateAutoPurchaseNumber: [false],
            debitNoteRoundOff: [true],
            creditNoteRoundOff: [true],
            autoWhatsAppInvoice: [true],
            autoWhatsAppCreditNote: [true],
            autoWhatsAppDebitNote: [false],
            autoWhatsAppPayment: [false],
            branchContraNumberPrefix: [null],
            branchCreditNoteNumberPrefix: [null],
            branchDebitNoteNumberPrefix: [null],
            adjustmentNumberPrefix: [null],
            autoWhatsApp: [null],
            contraNumberPrefix: [null],
            creditNoteNumberPrefix: [null],
            debitNoteNumberPrefix: [null],
            generateAutoEWayBill: [null],
            initialContraNumber: [null],
            initialCreditNoteNumber: [null],
            initialDebitNoteNumber: [null],
            initialPaymentNumber: [null],
            initialPurchaseNumber: [null],
            paymentNumberPrefix: [null],
            purchaseNumberPrefix: [null]
        });
    }

    /**
     * Creates proforma settings form
     *
     * @return {*}  {FormGroup}
     * @memberof VoucherListComponent
     */
    public createProformaSettingsForm(): FormGroup {
        return this.fb.group({
            duePeriod: [null],
            autoMail: [true],
            autoEntryAndInvoice: [false],
            showSeal: [true],
            autoPaid: [null],
            createPaymentEntry: [false],
            email: [null],
            emailVerified: [null],
            headerName: [null, Validators.required],
            autoChangeStatusOnExp: [false],
            sendSms: [null],
            enableProforma: [false],
            autoWhatsApp: [false],
            branchProformaNumberPrefix: [null]
        });
    }

    /**
     * Creates estimate settings form
     *
     * @return {*}  {FormGroup}
     * @memberof VoucherListComponent
     */
    public createEstimateSettingsForm(): FormGroup {
        return this.fb.group({
            headerName: [null, Validators.required],
            nextStepToEstimate: [null, Validators.required],
            autoChangeStatusOnExp: [false],
            sendSms: [false],
            duePeriod: [null],
            autoMail: [true],
            enableEstimate: [false],
            autoWhatsApp: [false],
            branchEstimateNumberPrefix: [null]
        });
    }

    /**
     * Creates company email settings form
     *
     * @return {*}  {FormGroup}
     * @memberof VoucherListComponent
     */
    public createCompanyEmailSettingsForm(): FormGroup {
        return this.fb.group({
            sendThroughSendgrid: [false],
            sendThroughGmail: [false]
        });
    }

    /**
     * Creates company inventory settings form
     *
     * @return {*}  {FormGroup}
     * @memberof VoucherListComponent
     */
    public createCompanyInventorySettingsForm(): FormGroup {
        return this.fb.group({
            manageInventory: [null]
        });
    }

    /**
     * Initializes setting object
     *
     * @memberof VoucherListComponent
     */
    public initSettingObj(): void {
        if (!this.isSettingUpdateMode) {
            this.componentStore.invoiceSettings$.pipe(takeUntil(this.destroyed$)).subscribe(setting => {
                if (setting && setting.invoiceSettings) {
                    this.isEInvoiceEnabled = setting.invoiceSettings?.gstEInvoiceEnable;
                    this.setEInvoiceColumns();
                    this.settingResponse = setting;
                    this.settingForm.patchValue({
                        purchaseBillSettings: setting.purchaseBillSettings || {},
                        invoiceSettings: setting.invoiceSettings || {},
                        proformaSettings: setting.proformaSettings || {},
                        estimateSettings: setting.estimateSettings || {},
                        companyEmailSettings: setting.companyEmailSettings || {},
                        companyInventorySettings: setting.companyInventorySettings || {}
                    });
                    if (this.urlVoucherType === VoucherTypeEnum.purchase) {
                        if (!this.settingForm.get('purchaseBillSettings.enableVoucherDownload').value) {
                            this.settingForm.get('purchaseBillSettings.enableVoucherDownload').patchValue(false);
                        }
                        if (!this.settingForm.get('invoiceSettings.purchaseRoundOff').value) {
                            this.settingForm.get('invoiceSettings.purchaseRoundOff').patchValue(false);
                        }

                        const lockDateValue = this.settingForm.get('purchaseBillSettings.lockDate').value;
                        if (lockDateValue === null || lockDateValue === '') {
                            this.showPurchaseDate = false;
                            setTimeout(() => {
                                this.showPurchaseDate = true;
                            }, 0);
                        }

                        if (!this.settingForm.get('invoiceSettings.generateAutoPurchaseNumber').value) {
                            this.settingForm.get('invoiceSettings.generateAutoPurchaseNumber').patchValue(false);
                        }
                        this.originalEmail = cloneDeep(setting.purchaseBillSettings.email);
                    } else {
                        this.originalEmail = cloneDeep(setting.invoiceSettings.email);

                        this.settingForm.get('invoiceSettings.autoPaid')?.setValue(
                            this.settingForm.get('invoiceSettings.autoPaid')?.value === 'runtime'
                        );


                        const invoiceLockDateValue = this.settingForm.get('invoiceSettings.lockDate').value;
                        if (invoiceLockDateValue === null || invoiceLockDateValue === '') {
                            this.showInvoiceDate = false;
                            setTimeout(() => {
                                this.showInvoiceDate = true;
                            }, 0);
                        }

                        if (setting.companyEmailSettings) {
                            this.settingForm.get('companyEmailSettings.sendThroughGmail')?.setValue(
                                cloneDeep(setting.companyEmailSettings.sendThroughGmail)
                            );
                        } else {
                            this.settingForm.get('companyEmailSettings.sendThroughGmail')?.setValue(false);
                        }
                    }

                    if (this.voucherType === VoucherTypeEnum.sales || this.voucherType === VoucherTypeEnum.cash) {
                        this.applyRoundOff = setting.invoiceSettings.salesRoundOff;
                    } else if (this.voucherType === VoucherTypeEnum.purchase) {
                        this.applyRoundOff = setting.invoiceSettings.purchaseRoundOff;
                    } else if (this.voucherType === VoucherTypeEnum.debitNote) {
                        this.applyRoundOff = setting.invoiceSettings.debitNoteRoundOff;
                    } else if (this.voucherType === VoucherTypeEnum.creditNote) {
                        this.applyRoundOff = setting.invoiceSettings.creditNoteRoundOff;
                    } else if (this.voucherType === VoucherTypeEnum.estimate || this.voucherType === VoucherTypeEnum.generateEstimate || this.voucherType === VoucherTypeEnum.proforma || this.voucherType === VoucherTypeEnum.generateProforma) {
                        this.applyRoundOff = true;
                    } else if (this.voucherType === VoucherTypeEnum.purchaseOrder) {
                        this.applyRoundOff = true;
                    }
                } else if (!setting) {
                    this.store.dispatch(this.invoiceActions.getInvoiceSetting());
                }
            });
        }
    }

    /**
      * Submits the form
      *
      * @return {*}  {void}
      * @memberof VoucherListComponent
      */
    public onSubmit(): void {
        this.isSettingUpdateMode = true;
        if (this.settingForm.get('invoiceSettings.autoPaid').value) {
            this.settingForm.get('invoiceSettings.autoPaid').patchValue('runtime');
        } else {
            this.settingForm.get('invoiceSettings.autoPaid').patchValue('never');
        }
        this.formToSave = cloneDeep(this.settingResponse);
        this.formToSave.invoiceSettings = cloneDeep(this.settingForm.get('invoiceSettings').value);
        this.formToSave.estimateSettings = cloneDeep(this.settingForm.get('estimateSettings').value);
        this.formToSave.proformaSettings = cloneDeep(this.settingForm.get('proformaSettings').value);
        if (this.urlVoucherType === VoucherTypeEnum.purchase) {
            this.formToSave.purchaseBillSettings = cloneDeep(this.settingForm.get('purchaseBillSettings').value);
            delete this.formToSave.purchaseBillSettings.invoiceSettings;
            if (this.formToSave.purchaseBillSettings.lockDate instanceof Date) {
                this.formToSave.purchaseBillSettings.lockDate = dayjs(this.formToSave.purchaseBillSettings.lockDate).format(GIDDH_DATE_FORMAT);
            }
        } else {
            this.formToSave.companyEmailSettings = {
                sendThroughGmail: cloneDeep(this.settingForm.get('companyEmailSettings.sendThroughGmail').value) ? cloneDeep(this.settingForm.get('companyEmailSettings.sendThroughGmail').value) : false,
                sendThroughSendgrid: false
            };
            delete this.formToSave.sendThroughGmail;
            if (this.formToSave.invoiceSettings.lockDate instanceof Date) {
                this.formToSave.invoiceSettings.lockDate = dayjs(this.settingForm.get('invoiceSettings.lockDate').value).format(GIDDH_DATE_FORMAT);
            }
            if (this.formToSave?.invoiceSettings?.gstEInvoiceEnable) {
                const invoiceSettings = this.formToSave.invoiceSettings;
                if (!invoiceSettings.gstEInvoiceUserName || !invoiceSettings.gstEInvoiceUserPassword || !invoiceSettings.gstEInvoiceGstin) {
                    this.toasterService.showSnackBar('error', this.localeData?.e_invoice_fields_required_error_message);
                    return;
                }
                if (this.formFields['taxName'] && this.formFields['taxName']['regex'] && this.formFields['taxName']['regex'].length > 0) {
                    let isValid = false;
                    for (let key = 0; key < this.formFields['taxName']['regex'].length; key++) {
                        let regex = new RegExp(this.formFields['taxName']['regex'][key]);
                        if (regex.test(invoiceSettings.gstEInvoiceGstin)) {
                            isValid = true;
                        }
                    }
                    if (!isValid) {
                        this.toasterService.showSnackBar('error', this.localeData?.e_invoice_invalid_gstin_error_message);
                        return;
                    }
                }
            }

        }
        this.store.dispatch(this.invoiceActions.updateInvoiceSetting(this.formToSave));
    }

    /**
     * This will be use for validation for delete email
     *
     * @return {*}  {boolean}
     * @memberof VoucherListComponent
     */
    public shouldDeleteEmail(voucherType?: string): boolean {
        const email = voucherType === 'invoice' ? this.settingForm.get('invoiceSettings.email')?.value : this.settingForm.get('purchaseBillSettings.email')?.value;
        return email && email.length >= 4;
    }

    /**
    * This will use for show hide main table headers from dynamic columns with new columns
    *
    * @param {*} event
    * @memberof VoucherListComponent
    */
    public getCustomiseDynamicHeaderColumns(event: any): void {
        if (!event || !Array.isArray(event)) {
            return;
        }
        this.getVouchersInProgress$.pipe(filter(inProgress => !inProgress), take(1)).subscribe(() => {
            this.isColumnsLoading = true;
            this.dynamicCustomColumns = [];
            this.displayedColumns = [];
            this.dataSource = [];
            this.dynamicCustomColumns = event as IReportFilterTableColumn[];
            this.displayedColumns = event
                .filter(item => item?.checked)
                .map(item => item.value);
            if (!this.displayedColumns.includes('index')) {
                this.displayedColumns.unshift('index');
            }
            if (!this.displayedColumns.includes('more_options') && ![VoucherTypeEnum.receipt, VoucherTypeEnum.payment].includes(this.voucherType)) {
                this.displayedColumns.push('more_options');
            } else if ([VoucherTypeEnum.receipt, VoucherTypeEnum.payment].includes(this.voucherType) && this.displayedColumns.includes('more_options')) {
                this.displayedColumns = this.displayedColumns.filter(column => column !== 'more_options');
            }
            this.setEInvoiceColumns();
            this.getVouchers(false);
            this.getVoucherBalances();
        });
        setTimeout(() => {
            this.isColumnsLoading = false;
        }, 400);
    }

    /**
     * This will set module type for voucher report filter
     *
     * @private
     * @memberof VoucherListComponent
     */
    private setModuleType(): void {
        switch (this.voucherType) {
            case VoucherTypeEnum.sales:
                this.moduleType = VoucherReportFilterModuleEnum.Sales;
                break;
            case VoucherTypeEnum.debitNote:
                this.moduleType = VoucherReportFilterModuleEnum.DebitNote;
                break;
            case VoucherTypeEnum.creditNote:
                this.moduleType = VoucherReportFilterModuleEnum.CreditNote;
                break;
            case VoucherTypeEnum.generateEstimate:
                this.moduleType = VoucherReportFilterModuleEnum.Estimate;
                break;
            case VoucherTypeEnum.generateProforma:
                this.moduleType = VoucherReportFilterModuleEnum.Proforma;
                break;
            case VoucherTypeEnum.purchase:
                this.moduleType = VoucherReportFilterModuleEnum.Purchase;
                break;
            case VoucherTypeEnum.purchaseOrder:
                this.moduleType = VoucherReportFilterModuleEnum.PurchaseOrder;
                break;
            case VoucherTypeEnum.receipt:
                this.moduleType = VoucherReportFilterModuleEnum.Receipt;
                break;
            case VoucherTypeEnum.payment:
                this.moduleType = VoucherReportFilterModuleEnum.Payment;
                break;
            default:
                this.moduleType = '';
                break;
        }
    }

    /**
     * Fetches all user templates.
     * Calls InvoiceTemplatesService.getTemplates() and updates the templatesList.
     * Handles errors and shows a toaster message if needed.
     */
    public fetchTemplates(templateType?: string): void {
        this.invoiceTemplatesService.getTemplates(templateType).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res?.status === 'success') {
                this.templatesList = res.body || [];
            } else {
                this.templatesList = [];
            }
        });
    }

    /**
     * Fetches all created templates of a given type.
     * Calls InvoiceTemplatesService.getAllCreatedTemplates(templateType) and updates the createdTemplatesList.
     * @param templateType The type of template to fetch
     */
    public fetchAllCreatedTemplates(templateType: string): void {
        this.createdTemplatesList = [];
        this.invoiceTemplatesService.getAllCreatedTemplates(templateType).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res?.status === 'success') {
                this.createdTemplatesList = res?.body || [];
            } else {
                this.createdTemplatesList = [];
            }
        });
    }

    /**
     * Sets a template as default.
     * Calls InvoiceTemplatesService.setTemplateAsDefault and shows feedback.
     * @param templateUniqueName The unique name of the template
     * @param templateType The type of template
     */
    public setTemplateAsDefault(templateUniqueName: string, templateType: string): void {
        this.invoiceTemplatesService.setTemplateAsDefault(templateUniqueName, templateType).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res?.status === 'success') {
                this.toasterService.showSnackBar('success', this.localeData?.template_set_as_default_successfully);
                // Update the UI immediately
                (Array.isArray(this.createdTemplatesList) ? this.createdTemplatesList : []).forEach(template => {
                    if (this.voucherType === 'credit note' || this.voucherType === 'debit note') {
                        template.isDefaultForVoucher = (template.uniqueName === templateUniqueName);
                    } else {
                        template.isDefault = (template.uniqueName === templateUniqueName);
                    }
                });
            } else {
                this.toasterService.showSnackBar('error', res?.message);
            }
        });
    }

    /**
     * Deletes a template by its unique name.
     * Calls InvoiceTemplatesService.deleteTemplate and updates the list.
     * @param templateUniqueName The unique name of the template to delete
     * @param templateType The type of template (optional, for refresh)
     */
    public deleteTemplate(template: any, templateType?: string): void {
        let dialogRef = this.dialog.open(ConfirmModalComponent, {
            data: {
                title: this.commonLocaleData?.app_confirmation,
                body: this.localeData?.are_you_sure_you_want_to_delete.replace('${template.name}', template.name),
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no,
                permanentlyDeleteMessage: this.commonLocaleData?.app_permanently_delete_message
            },
            panelClass: ['mat-dialog-sm'],
            role: 'alertdialog',
            ariaLabel: 'Confirm Dialog'
        });

        dialogRef.afterClosed().subscribe(response => {
            if (response) {
                this.invoiceTemplatesService.deleteTemplate(template.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                    if (res?.status === 'success') {
                        this.toasterService.showSnackBar('success', this.localeData?.template_deleted_successfully);
                        this.fetchAllCreatedTemplates(templateType);
                        this.fetchTemplates(templateType);
                    } else {
                        this.toasterService.showSnackBar('error', res?.message);
                    }
                });
            }
        });
    }

    /**
     * Open template dialog
     *
     * @param {*} template
     * @memberof VoucherListComponent
     */
    public previewTemplate(template: any): void {
        const reqObj = {
            ...template,
            localeData: this.localeData,
            commonLocaleData: this.commonLocaleData
        };
        this.dialog.open(TemplatePreviewDialogComponent, {
            panelClass: ['mat-dialog-lg'],
            height: '90vh',
            maxHeight: '90vh',
            data: reqObj
        });
    }

    /**
     * Open template edit dialog
     *
     * @param {*} template
     * @param {string} type
     * @memberof VoucherListComponent
     */
    public templateAction(template: any, type: string): void {
        const templateType =
            this.voucherType === VoucherTypeEnum.creditNote || this.voucherType === VoucherTypeEnum.debitNote ? VoucherTypeEnum.voucher
                : this.voucherType === VoucherTypeEnum.purchaseOrder ? VoucherTypeEnum.purchase_order : this.voucherType === VoucherTypeEnum.purchase ? VoucherTypeEnum.purchase_bill : this.voucherType === VoucherTypeEnum.sales ? VoucherTypeEnum.invoice : this.voucherType;
        const voucherType = this.voucherType === VoucherTypeEnum.creditNote || this.voucherType === VoucherTypeEnum.debitNote ? VoucherTypeEnum.voucher : VoucherTypeEnum.sales;
        const templatesType = this.urlVoucherType === VoucherTypeEnum.purchase ? this.selectedTemplate?.value : templateType;
        const dataToSend = {
            templateList: this.templatesList,
            voucherType: voucherType,
            templateType: templatesType,
            createTemplateList: this.createdTemplatesList,
            updateTemplate: type === TemplateModeEnum.Edit ? template : null,
            mode: type === TemplateModeEnum.Edit ? TemplateModeEnum.Update : TemplateModeEnum.Create,
            localeData: this.localeData,
            commonLocaleData: this.commonLocaleData
        };
        const dialogRef = this.dialog.open(TemplateEditDialogComponent, {
                    width: '100%',
                    height: '95vh',
                    maxHeight: '95vh',
                    data: dataToSend,
                    disableClose: true
                });

        dialogRef.afterClosed().subscribe(response => {
            if (response) {
                this.fetchAllCreatedTemplates(templatesType);
            }
        });
    }

    /**
     * This will use for show hide e-invoice status column
     *
     * @private
     * @memberof VoucherListComponent
     */
    private setEInvoiceColumns(): void {
        if (![VoucherTypeEnum.debitNote, VoucherTypeEnum.creditNote, VoucherTypeEnum.sales].includes(this.voucherType)) {
            return;
        }
        if (!this.isEInvoiceEnabled) {
            this.displayedColumns = this.displayedColumns?.filter(column => column !== "e_invoice_status");
        } else {
            if (!this.displayedColumns?.includes("e_invoice_status")) {
                this.displayedColumns.splice(this.displayedColumns.length - 1, 0, "e_invoice_status");
            }
        }
    }

    /**
    * This will show the datepicker
    *
    * @param {boolean} isOpen
    * @memberof VoucherListComponent
    */
    public toggleGiddhDatepicker(isOpen: boolean = true): void {
        if (isOpen) {
            this.universalDatepickerTrigger?.openMenu();
        } else {
            this.universalDatepickerTrigger?.closeMenu();
        }
    }

    /**
     * This will use for select template
     *
     * @private
     * @memberof VoucherListComponent
     */
    public templateSelect(template: any): void {
        this.selectedTemplate = template;
        this.fetchAllCreatedTemplates(template.value);
        this.fetchTemplates(template.value);
    }
}
