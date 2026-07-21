import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    computed,
    ElementRef,
    HostListener,
    Inject,
    NgZone,
    OnDestroy,
    OnInit,
    QueryList,
    TemplateRef,
    ViewChild,
    ViewChildren,
    signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router } from "@angular/router";
import { VoucherComponentStore } from "../utility/vouchers.store";
import { AppState } from "../../store";
import { select, Store } from "@ngrx/store";
import {
    BehaviorSubject,
    Observable,
    ReplaySubject,
    combineLatest,
    debounceTime,
    delay,
    distinctUntilChanged,
    filter,
    of as observableOf,
    skip,
    take,
    takeUntil,
    tap
} from "rxjs";
import * as dayjs from "dayjs";
import { GeneralService } from "../../services/general.service";
import { UiSettingsService } from "../../services/ui-settings.service";
import { OnboardingFormRequest } from "../../models/api-models/Common";
import { CommonActions } from "../../actions/common.actions";
import { CompanyActions } from "../../actions/company.actions";
import { TaxResponse } from "../../models/api-models/Company";
import { AccountingGroupEnum } from "../../shared/Enums/common.enum";
import { WarehouseActions } from "../../settings/warehouse/action/warehouse.action";
import { SettingsUtilityService } from "../../settings/services/settings-utility.service";
import { SettingsBranchActions } from "../../actions/settings/branch/settings.branch.action";
import { OrganizationType } from "../../models/user-login-state";
import {
    PreviousInvoicesVm,
    ProformaDownloadRequest,
    ProformaFilter,
    ProformaGetRequest,
    ProformaResponse,
} from "../../models/api-models/proforma";
import { InvoiceReceiptFilter, ReciptResponse } from "../../models/api-models/recipt";
import { VouchersUtilityService } from "../utility/vouchers.utility.service";
import { FormBuilder, FormArray, FormGroup, Validators, FormControl, AbstractControl } from "@angular/forms";
import { GIDDH_DATE_FORMAT } from "../../shared/helpers/defaultDateFormat";
import {
    AccountType,
    BriedAccountsGroup,
    InteractionType,
    OtherTaxTypeEnum,
    OtherTaxTypes,
    SearchType,
    TaxCollectionDeductionType,
    TaxType,
    VoucherTypeEnum,
} from "../utility/vouchers.const";
import { SearchService } from "../../services/search.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { MatMenuTrigger, MenuCloseReason } from "@angular/material/menu";
import { OtherTaxComponent } from "../../theme/other-tax/other-tax.component";
import { CommonTaxComponent } from "../../shared/common-tax/common-tax.component";
import { CommonDiscountComponent } from "../../shared/common-discount/common-discount.component";
import { LastInvoices, OptionInterface, VoucherForm } from "../../models/api-models/Voucher";
import { PageLeaveUtilityService } from "../../services/page-leave-utility.service";
import { AddAccountRequest, UpdateAccountRequest } from "../../models/api-models/Account";
import { SalesActions } from "../../actions/sales/sales.action";
import { CreateDiscountComponent } from "../../theme/create-discount/create-discount.component";
import { ConfirmationModalConfiguration } from "../../theme/confirmation-modal/confirmation-modal.interface";
import { NewConfirmationModalComponent } from "../../theme/new-confirmation-modal/confirmation-modal.component";
import { ToasterService } from "../../services/toaster.service";
import { CommonService } from "../../services/common.service";
import { PURCHASE_ORDER_STATUS } from "../../shared/helpers/purchaseOrderStatus";
import { cloneDeep, isEqual, uniqBy } from "../../lodash-optimized";
import {
    AdjustedVoucherType,
    BranchHierarchyType,
    ENTRY_DESCRIPTION_LENGTH,
    FILE_ATTACHMENT_TYPE,
    HIGH_RATE_FIELD_PRECISION,
    HtmlElementEnum,
    KeyCodesEnum,
    RATE_FIELD_PRECISION,
    SubVoucher,
    ASIDE_PANE_CONFIG,
    IOption,
    API_BULK_FETCH_LIMIT,
    FormFieldsType,
    PAGE_SIZE_OPTIONS
} from "../../app.constant";
import { SalesOtherTaxesCalculationMethodEnum } from "../../models/api-models/Sales";
import { giddhRoundOff } from "../../shared/helpers/helperFunctions";
import { VoucherService } from "../../services/voucher.service";
import { ConfirmModalComponent } from "../../theme/new-confirm-modal/confirm-modal.component";
import { AddBulkItemsComponent } from "../../theme/add-bulk-items/add-bulk-items.component";
import { AdjustAdvancePaymentModal, VoucherAdjustments } from "../../models/api-models/AdvanceReceiptsAdjust";
import { PurchaseOrderService } from "../../services/purchase-order.service";
import { AdjustmentUtilityService } from "../../shared/advance-receipt-adjustment/services/adjustment-utility.service";
import { SettingsTaxesActions } from "../../actions/settings/taxes/settings.taxes.action";
import { ProformaService } from "../../services/proforma.service";
import { SettingsProfileActions } from "../../actions/settings/profile/settings.profile.action";
import { TitleCasePipe } from "@angular/common";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { MatSelectChange } from "@angular/material/select";
import { ServiceConfig } from "../../services/service.config";
import { SalesPersonComponent } from "../../shared/sales-person/sales-person.component";
import { SalesPersonComponentStore } from "../../shared/sales-person/utility/sales-person.store";
import { OcrAction } from "../../ai-ocr/ai-ocr.component";
import { AiOcrStore } from "../../ai-ocr/utility/ai-ocr.store";
import { AiOcrService } from "../../services/ai-ocr.service";
import { EWayBillCreateComponent } from "../../shared/eWayBill/create/e-way-bill-create-component";
import { ReactiveDropdownFieldComponent } from "../../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { ActionTypeEnum } from "../../shared/sales-person/utility/sales-person.constant";
import { GiddhDatepickerComponent } from "../../theme/giddh-datepicker/giddh-datepicker.component";
import { FocusMonitor } from "@angular/cdk/a11y";
import { Platform } from "@angular/cdk/platform";
import { GeneralActions } from "../../actions/general/general.actions";
import { CustomFieldsService } from "../../services/custom-fields.service";
import { RecurrenceFormService } from "../../services/aside-recurring-voucher.service";
import { RecurringEndType, RecurringRepeatOption, RecurringFrequencyUnit, RecurringRepeatType, RecurringMonthlyMode } from "../../models/enums/recurring-voucher.enum";
import { AccountCategoryEnum } from "../../shared/Enums/common.enum";
import { CopyParticularDialogComponent } from "../copy-particular-dialog/copy-particular-dialog.component";
@Component({
    selector: "create",
    templateUrl: "./create.component.html",
    styleUrls: ["./create.component.scss"],
    providers: [VoucherComponentStore, SalesPersonComponentStore, AiOcrStore],
    standalone: false
})
export class VoucherCreateComponent implements OnInit, OnDestroy, AfterViewInit {
    /** Instance of voucher date picker */
    @ViewChild("voucherDatePicker") public voucherDatePicker: GiddhDatepickerComponent
    /** Instance of RCM checkbox */
    @ViewChild("rcmCheckbox") public rcmCheckbox: ElementRef;
    /** Template Reference for Generic aside menu account */
    @ViewChild("accountAsideMenu") public accountAsideMenu: TemplateRef<any>;
    /** Instance of aside Menu Product Service modal */
    @ViewChild("asideMenuProductService") asideMenuProductService: TemplateRef<any>;
    /* Selector for send email modal */
    @ViewChild("sendEmailModal", { static: true }) public sendEmailModal: any;
    /* Selector for print modal */
    @ViewChild("printVoucherModal", { static: true }) public printVoucherModal: any;
    /* Selector for adjustment modal */
    @ViewChild("adjustmentModal", { static: true }) public adjustmentModal: any;
    /** Selector for account dropdown */
    @ViewChild("accountDropdown") accountDropdown: ReactiveDropdownFieldComponent;
    /** Instance of fileInput */
    @ViewChild('fileInput', { static: false }) fileInput?: ElementRef<HTMLInputElement>;
    /** Billing details menu trigger */
    @ViewChild('billingDetailsTrigger') billingDetailsTrigger!: MatMenuTrigger;
    /** Shipping details menu trigger */
    @ViewChild('shippingDetailsTrigger') shippingDetailsTrigger!: MatMenuTrigger;
    /** Copy Voucher div element for focusing */
    @ViewChild('copyVoucherElement') copyVoucherElement!: ElementRef<HTMLDivElement>;
    /** Template reference for the recent vouchers aside pane */
    @ViewChild('recentVouchersTemplate', { static: true }) recentVouchersTemplate: TemplateRef<any>;
    /** Template reference for the voucher PDF preview dialog */
    @ViewChild('voucherPdfPreviewTemplate', { static: true }) voucherPdfPreviewTemplate: TemplateRef<any>;
    /** Description textarea element for focusing */
    @ViewChild('inputDescription', { static: false }) inputDescription?: ElementRef<HTMLTextAreaElement>;
    /** Reference to the "Add new row/line" span element for focusing */
    @ViewChild('addNewParticular') addNewParticular!: ElementRef<HTMLSpanElement>;
    /** Reference to the "Add new row/line" span element for focusing */
    @ViewChild('addNewDeposit') addNewDeposit!: ElementRef<HTMLSpanElement>;
    /** Reference to the "Add new row/line" span element for focusing */
    @ViewChild('customerVendorDropdown') customerVendorDropdown!: ReactiveDropdownFieldComponent;
    /** Reference to all tax dropdown components (one per entry row) */
    @ViewChildren('commonTaxControll') commonTaxControll!: QueryList<CommonTaxComponent>;
    /** Reference to all discount dropdown components (one per entry row) */
    @ViewChildren('discountDropdown') discountDropdowns!: QueryList<CommonDiscountComponent>;
    /** Reference to the recurrence component */
    @ViewChild('asideRecurrenceVoucher') asideRecurrenceVoucher: any;
    /**  This will use for dayjs */
    public dayjs: any = dayjs;
    /** Holds current voucher type */
    public voucherType: string = VoucherTypeEnum.sales.toString();
    /** Hold url Voucher Type */
    public urlVoucherType: string = "";
    /** Holds images folder path */
    public imgPath: string = '';
    /** Loading Observable */
    public isLoading$: Observable<any> = this.componentStore.isLoading$;
    /** Discounts list Observable */
    public discountsList$: Observable<any> = this.componentStore.discountsList$;
    /** Discounts list Observable */
    public companyTaxes$: Observable<any> = this.componentStore.companyTaxes$;
    /** Voucher account results Observable */
    public voucherAccountResults$: Observable<OptionInterface[]> = observableOf(null);
    /** Brief accounts Observable */
    public briefAccounts$: Observable<OptionInterface[]> = observableOf(null);
    /** Last vouchers get in progress Observable */
    public getLastVouchersInProgress$: Observable<any> = this.componentStore.getLastVouchersInProgress$;
    /** Signal indicating company vouchers fetch is in progress */
    protected readonly isCompanyVouchersLoading = toSignal(this.componentStore.getLastVouchersCompanyInProgress$, { initialValue: false });
    /** Signal indicating account vouchers fetch is in progress */
    protected readonly isAccountVouchersLoading = toSignal(this.componentStore.getLastVouchersAccountInProgress$, { initialValue: false });
    /** Vendor purchase orders Observable */
    public vendorPurchaseOrders$: Observable<any> = this.componentStore.vendorPurchaseOrders$;
    /** Vendor purchase orders Observable */
    public linkedPoOrders$: Observable<any> = this.componentStore.linkedPoOrders$;
    /** Pending purchase orders Observable */
    public pendingPurchaseOrders$: Observable<any> = this.componentStore.pendingPurchaseOrders$;
    /** Account search request */
    public accountSearchRequest: any;
    /** Annexure account search request */
    public annexureAccountSearchRequest: any = { q: "", page: 1, loadMore: false, isLoading: false };
    /** Stock search request by entry row */
    public stockSearchRequestByEntry: Map<number, any> = new Map();
    /** Stores the voucher API version of current company */
    public voucherApiVersion: number;
    /** Invoice Settings */
    public invoiceSettings: any;
    /** True if round off will be applicable */
    public applyRoundOff: boolean = true;
    /** Holds company specific data */
    public company: any = {
        countryName: "",
        countryCode: "",
        baseCurrency: "",
        baseCurrencySymbol: "",
        inputMaskFormat: "",
        taxType: "",
        taxTypeLabel: "",
        isTcsTdsApplicable: false,
        isActive: false,
        branch: null,
        addresses: null,
        giddhBalanceDecimalPlaces: 2,
        salesAsReceipt: null,
        purchaseAsPayment: null,
    };
    /** Holds account specific data */
    public account: any = {
        countryName: "",
        countryCode: "",
        baseCurrency: "",
        baseCurrencySymbol: "",
        addresses: null,
        otherApplicableTaxes: null,
        applicableDiscounts: null,
        applicableTaxes: null,
        excludeTax: false,
        taxType: '',
        taxTypeLabel: '',
        mobileNumber: '',
        branch: null,
        duePeriod: null,
        customFields: null
    };
    /** Invoice Settings */
    public activeCompany: any;
    /** This will hold onboarding api form request */
    public onboardingFormRequest: OnboardingFormRequest = { formName: "", country: "" };
    /** Onboarding account form fields */
    public accountFormFields: any[] = [];
    /** Onboarding company form fields */
    public companyFormFields: any[] = [];
    /** Holds company tax list  */
    public allCompanyTaxes: TaxResponse[] = [];
    /** Holds company tax list  */
    public companyTaxes: TaxResponse[] = [];
    /** Holds indirect expenses ledgers for annexure charges */
    public indirectExpensesLedgers: any[] = [];
    /** Allowed taxes list contains the unique name of all
     * tax types within a company and count upto which they are allowed
     */
    public allowedSelectionOfAType: any = { type: [], count: 1 };
    /** Reference to the current RCM checkbox element for focus management */
    private currentRcmCheckboxElement: any;
    /** Holds company discounts */
    public discountsList = signal<any[]>([]);
    /** Holds company warehouses */
    public warehouses: Array<any>;
    /** Holds company branches */
    public branches: Array<any>;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
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
        isPaymentInvoice: false,
    };
    /** Holds template data */
    public templateData: any = {
        customField1Label: "",
        customField2Label: "",
        customField3Label: "",
        shippedViaLabel: "",
        shippedDateLabel: "",
        trackingNumber: "",
        showNotesAtLastPage: false,
    };
    /** Signal holding recent company vouchers for the aside pane */
    protected readonly lastVouchersCompanyList = signal<LastInvoices[]>([]);
    /** Signal holding recent account vouchers for the aside pane */
    protected readonly lastVouchersAccountList = signal<LastInvoices[]>([]);
    /** Dialog ref for recent vouchers aside pane */
    private recentVouchersAsideRef: MatDialogRef<any>;
    /** Signal holding the voucher number shown in the PDF preview dialog title */
    protected readonly selectedPdfVoucherNumber = signal<string>('');
    /** Signal holding the sanitized URL for the PDF preview iframe */
    protected readonly previewPdfUrl = signal<SafeResourceUrl>(null);
    /** Holds URL string for revoking blob object */
    private previewPdfFileURL: string = '';
    /** Form Group for invoice form */
    public invoiceForm: FormGroup;
    /** This will open account dropdown by default */
    public openAccountDropdown: boolean = false;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if warehouse field will be visible */
    public showWarehouse: boolean = false;
    /** Holds account state list */
    public accountStateList$: Observable<OptionInterface[]> = observableOf(null);
    /** Holds company state list */
    public companyStateList$: Observable<OptionInterface[]> = observableOf(null);
    /** Hold account aside menu reference  */
    public accountAsideMenuRef: MatDialogRef<any>;
    /** True if it's voucher update mode */
    public isUpdateMode: boolean = false;
    /** True if voucher copy mode */
    public isCopyMode: boolean = false;
    /** Holds parent group unique name for create account modal */
    public accountParentGroup: string = "";
    /** True if account has unsaved changes */
    public hasUnsavedChanges: boolean = false;
    /** Holds tax types */
    public taxTypes: any = TaxType;
    /** Hold aside menu state for product service  */
    public productServiceAsideMenuRef: MatDialogRef<any>;
    /** Other tax dialog ref */
    public otherTaxAsideMenuRef: MatDialogRef<any>;
    /** Bulk stock dialog ref */
    public bulkStockAsideMenuRef: MatDialogRef<any>;
    /** Discount dialog ref */
    public discountDialogRef: MatDialogRef<any>;
    /** Stores the current voucher form detail */
    public currentVoucherFormDetails: VoucherForm;
    /** RCM modal configuration */
    public rcmConfiguration: ConfirmationModalConfiguration;
    /** True if einvoice is generated for the voucher */
    public isEinvoiceGenerated: boolean = false;
    /** True if voucher is multi currency */
    public isMultiCurrencyVoucher: boolean = false;
    /** True if we need to show exchange rate edit field */
    public showExchangeRateEditField: boolean = false;
    /** True if file upload in progress */
    public isFileUploading: boolean = false;
    /** Name of the selected file */
    public selectedFileName: string = "";
    /** Length of entry description */
    public entryDescriptionLength: number = ENTRY_DESCRIPTION_LENGTH;
    /** Holds universal date */
    public universalDate: any;
    /** List of stock variants */
    public stockVariants: any[] = [];
    /** List of stock units */
    public stockUnits: any[] = [];
    /** True if we need to show entry datepicker */
    // public openEntryDatepicker: boolean = false;
    /** Entry index */
    private updatedEntryIndex: number;
    /** Annexure charge index */
    private updatedAnnexureIndex: number;
    /** Date change type (voucher/entry/annexure) */
    private dateChangeType: string = "";
    /** Date Change modal configuration */
    public dateChangeConfiguration: ConfirmationModalConfiguration;
    /** Holds hsn/sac before edit */
    public currentHsnSac: any = {
        hsnNumber: "",
        sacNumber: "",
    };
    /** Subject backing the active entry index for reactive consumption */
    private readonly activeEntryIndexSubject$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
    /** Observable to react when the active (open in edit mode) entry row changes */
    public readonly activeEntryIndex$: Observable<number | null> = this.activeEntryIndexSubject$.asObservable();
    /** Entry index which is open in edit mode */
    public get activeEntryIndex(): number | null {
        return this.activeEntryIndexSubject$.value;
    }
    public set activeEntryIndex(value: number | null) {
        if (this.activeEntryIndexSubject$.value !== value) {
            this.activeEntryIndexSubject$.next(value);
        }
    }
    /** Reference to the copy particular dialog */
    private copyParticularDialogRef: MatDialogRef<any>;
    /** Instance of copy particular dialog component */
    private copyParticularDialogComponentInstance: CopyParticularDialogComponent | null = null;
    /** Copy particular dialog list */
    public copyParticularHistory: any = { items: [], totalItems: 0, totalPages: 0, page: 1 };
    /** Copy particular dialog loading state */
    public isCopyParticularLoading: boolean = false;
    /** Copy particular dialog title */
    public copyParticularDialogTitle: string = "";
    /** Pagination information for copy particular dialog */
    public copyParticularPagination: { page: number } = {
        page: 1
    };
    /** Page size options */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    /** Rate precision value that will be visible on UI */
    public ratePrecision = RATE_FIELD_PRECISION;
    /** Rate precision value that will be sent to API */
    public highPrecisionRate = HIGH_RATE_FIELD_PRECISION;
    /** Holds voucher totals */
    public voucherTotals: any = {
        totalAmount: 0,
        totalDiscount: 0,
        totalTaxableValue: 0,
        totalTaxWithoutCess: 0,
        totalCess: 0,
        grandTotal: 0,
        roundOff: { value: 0, isPositive: true },
        tcsTotal: 0,
        tdsTotal: 0,
        balanceDue: 0,
    };
    /** Holds account types */
    public accountType: any = AccountType;
    /** Holds list of other tax types */
    public otherTaxTypes: any[] = OtherTaxTypes;
    /** Voucher details */
    public voucherDetails: any = {};
    /** Send email dialog ref */
    public emailDialogRef: MatDialogRef<any>;
    /** Stores the last focused element before dialog opens for focus restoration */
    private lastFocusedElement: HTMLElement | null = null;
    /** Stores the trigger button for copy particular dialog focus restoration */
    private copyParticularTriggerElement: HTMLElement | null = null;
    /** Stores the entry index for copy particular trigger focus restoration */
    private copyParticularTriggerEntryIndex: number | null = null;
    /** Skip trigger restore when copy particular selects a row */
    private shouldFocusAddNewParticularAfterCopy: boolean = false;
    /** Entry index currently associated with copy particular dialog */
    private copyParticularEntryIndex: number | null = null;
    /** List of vouchers available for adjustment */
    public vouchersForAdjustment: any[] = [];
    /** Stores the adjustment data */
    public advanceReceiptAdjustmentData: VoucherAdjustments;
    /** Show advance receipts adjust */
    public showAdvanceReceiptAdjust: boolean = false;
    /** True if adjustment is done */
    public isAdjustAmount = false;
    /** Holds adjustment data */
    public adjustPaymentData: AdjustAdvancePaymentModal = {
        customerName: "",
        customerUniquename: "",
        voucherDate: "",
        balanceDue: 0,
        dueDate: "",
        grandTotal: 0,
        gstTaxesTotal: 0,
        subTotal: 0,
        totalTaxableValue: 0,
        totalAdjustedAmount: 0,
        convertedTotalAdjustedAmount: 0,
    };
    /** Total balance due date for adjustment */
    public adjustPaymentBalanceDueData: number = 0;
    /** Total advance receipts adjustment amount */
    public totalAdvanceReceiptsAdjustedAmount: number = 0;
    /** To check is selected invoice already adjusted with at least one advance receipts  */
    public isInvoiceAdjustedWithAdvanceReceipts: boolean = false;
    /** Current page for reference vouchers */
    private referenceVouchersCurrentPage: number = 1;
    /** Total pages for reference vouchers */
    private referenceVouchersTotalPages: number = 1;
    /** Reference voucher search field */
    private searchReferenceVoucher: any = "";
    /** Vouchers list for credit/debit note */
    private vouchersListForCreditDebitNote: any[] = [];
    /** Observable for vouchers list for credit/debit note */
    public vouchersListForCreditDebitNote$: Observable<any> = observableOf(null);
    /* This will hold if PO linking is updated */
    public poLinkUpdated: boolean = false;
    /* This will hold the purchase orders */
    public purchaseOrders: any[] = [];
    /* This will hold linked PO items*/
    public linkedPoNumbers: any[] = [];
    /* This will hold filter dates for PO */
    public poFilterDates: any = { from: "", to: "" };
    /** This will use for instance of linkPO Dropdown */
    public linkPoDropdown: FormControl = new FormControl();
    /** Filtered options to show in autocomplete list */
    public fieldFilteredOptions: any[] = [];
    /** Stores the purchase order number value mapping */
    public purchaseOrderNumberValueMapping: any[] = [];
    /* This will hold selected PO */
    public selectedPoItems: any[] = [];
    /* This will hold the existing PO entries with quantity */
    public existingPoEntries: any[] = [];
    /** Show/Hide page loader */
    public showLoader = signal<boolean>(false);
    /** Holds true if table entry has at least single stock is selected  */
    public hasStock: boolean = false;
    /** Tracks if account unique name should be shown in dropdowns */
    public showAccountUniqueName: boolean = false;
    /** This will hold if voucher date is manually changed */
    public isVoucherDateChanged: boolean = false;
    /** True if voucher number field is enabled */
    public useCustomVoucherNumber: boolean = false;
    /** Stores the adjustments as a backup that are present on the current opened entry */
    public originalVoucherAdjustments: VoucherAdjustments;
    /** True if barcode maching is typing */
    public isBarcodeMachineTyping: boolean = false;
    /**Hold barcode scan start time */
    public startTime: number = 0;
    /**Hold barcode scan end time */
    public endTime: number = 0;
    /** Tracks the last interaction type for conditional focus behavior */
    public lastInteraction: InteractionType | null = null;
    /** Timestamp of last interaction to prevent rapid overrides */
    private lastInteractionTimestamp: number = 0;
    /** Global event listeners for cleanup */
    private globalKeydownListener?: (event: KeyboardEvent) => void;
    private globalMousedownListener?: () => void;
    private globalClickListener?: () => void;
    /**Hold barcode scan total time */
    public totalTime: number = 0;
    /** This will hold barcode value*/
    public barcodeValue: string = "";
    /**Hold barcode last scanned key */
    public lastScannedKey: string = "";
    /* This will hold po unique name for preview */
    public purchaseOrderPreviewUniqueName: string = "";
    /* This will hold po account unique name for preview */
    public purchaseOrderPreviewAccountUniqueName: string = "";
    /** List of EU countries */
    public europeanCountryList: any[] = [];
    /** Create new account */
    public createNewAccount: boolean = true;
    /** True if currency switched */
    public currencySwitched: boolean = false;
    /** Label for voucher date */
    public voucherDateLabel: string = "";
    /** Label for voucher due date */
    public voucherDueDateLabel: string = "";
    /** True if we need to same billing to shipping address */
    public copyAccountBillingInShippingAddress: boolean = true;
    /** True if we need to same billing to shipping address */
    public copyCompanyBillingInShippingAddress: boolean = true;
    /** True if we need to fill default account details in voucher */
    private useDefaultAccountDetails: boolean = true;
    /** Holds redirect url to redirect after voucher update */
    private redirectUrl: string = "";
    /** Holds text for update voucher button */
    public updateVoucherText: string = "";
    /** Holds purchase order details to put PO in PO list if not available */
    public purchaseOrderDetailsForEdit: any[] = [];
    /** True if creating voucher from pending tab */
    public isPendingEntries: boolean = false;
    /** Holds deposit account name */
    public depositAccountName: string = "";
    /** Total Deposit Amount  */
    private totalDepositAmount: number = 0;
    /** Holds current route query parameters */
    public queryParams: any = {};
    /** E-way bill dialog response */
    public eWayBillResponse: any = {};
    /** True if we need to calculate tax in tax dropdown */
    public calculateTaxInTaxDropdown: boolean;
    /** Enum for Other tax types */
    public otherTaxTypeEnum: typeof OtherTaxTypeEnum = OtherTaxTypeEnum;
    /** Sales Person List */
    public salesPersonList$: Observable<any> = this.salesPersonStore.salesPersonList$;
    /** Holds transfer info if active sales person is transfer */
    private activeSalePersonIsTransfer: any;
    /** True if OCR data is enabled for voucher creation. */
    public ocrDataEnabled: boolean = false;
    /** Get ocr voucher details observable */
    public aiOcrDetails$: Observable<any> = this.aiOcrService.aiOcrDetails$;
    /** Get ocr voucher details */
    public aiOcrDetails: any = {};
    /** Get ocr token */
    public aiOcrToken: string = "";
    /** True if main create voucher module */
    public isMainVoucher: boolean = false;
    /** Holds OCR voucher type */
    public ocrVoucherType: string = '';
    /** This will use for ocr type */
    public ocrType: string = "";
    /** This will use for transaction options */
    public transactionOptions: Array<{ label: string; value: string }> = [];
    /** This will use for ocr voucher type */
    public selectedVoucherType: string = "";
    /** This will use for row data */
    public rowData: any = null;
    /** This will use for force clear reactive dropdown */
    public forceClear: boolean = false;
    /** Holds active deposit index */
    public activeDepositIndex: number | null = null;
    /** Holds active annexure charge index */
    public activeAnnexureIndex: number | null = null;
    /** Tracks if sidebar was previously open to restore it on component destroy */
    private wasSidebarOpen = false;
    /** Invoice templates */
    public sampleTemplates$: BehaviorSubject<IOption[]> = new BehaviorSubject<IOption[]>([]);
    /** Account custom fields */
    public accountCustomFields$: BehaviorSubject<IOption[]> = new BehaviorSubject<IOption[]>([]);
    /** Holds enum of FormFieldsType */
    public formFieldsType: typeof FormFieldsType = FormFieldsType;
    /** True if account changed */
    public isAccountChanged: boolean = false;
    /** True if recurring voucher */
    public isRecurringVoucher: any;
    /** store branch current address information */
    public branchCurrentAddressInfo: any = {};

    /**
     * Returns true, if invoice type is sales, proforma or estimate, for these vouchers we
     * need to apply max characters limit on Notes/notes2/messsage2
     *
     * @readonly
     * @type {boolean}
     * @memberof VoucherCreateComponent
     */
    public get shouldApplyMaxLengthOnNotes(): boolean {
        return (
            this.invoiceType?.isSalesInvoice ||
            this.invoiceType?.isProformaInvoice ||
            this.invoiceType?.isEstimateInvoice
        );
    }

    /** Returns true if account is selected else false */
    public get showPageLeaveConfirmation(): boolean {
        return !this.isUpdateMode && this.invoiceForm?.controls["account"]?.get("customerName")?.value ? true : false;
    }

    /**
     * Show/Hide tax column if condition fulfills
     *
     * @readonly
     * @type {boolean}
     * @memberof VoucherCreateComponent
     */
    public get showTaxColumn() {
        if (this.invoiceType.isReceiptInvoice || this.invoiceType.isPaymentInvoice) {
            return false;
        }

        if (
            this.company.countryName === "United Kingdom" &&
            this.europeanCountryList?.includes(this.account?.countryCode)
        ) {
            return true;
        }

        if (this.invoiceForm.get("touristSchemeApplicable")?.value) {
            return true;
        }

        let accountPartyType = "";
        this.account?.addresses?.forEach((address) => {
            if (address.isDefault) {
                accountPartyType = address.partyType.toLowerCase();
            }
        });
        if (
            (this.invoiceType?.isSalesInvoice ||
                this.invoiceType?.isCreditNote ||
                this.invoiceType?.isProformaInvoice ||
                this.invoiceType?.isEstimateInvoice) &&
            !this.activeCompany?.withPay &&
            (this.activeCompany?.countryV2?.alpha2CountryCode !== this.account?.countryCode ||
                accountPartyType === "sez" ||
                accountPartyType === "deemed export")
        ) {
            return false;
        } else {
            return true;
        }
    };

    /**
     * True if it's UK company
     *
     * @readonly
     * @type {boolean}
     * @memberof VoucherCreateComponent
     */
    public get isUkCompany(): boolean {
        return this.company.countryName === "United Kingdom";
    }

    /**
     *
     * @readonly
     * @type {boolean}
     * @memberof VoucherCreateComponent
     */
    public get isUkAccount(): boolean {
        return this.account.countryName === "United Kingdom";
    }

    /**
     * True if company country is India
     *
     * @readonly
     * @type {boolean}
     * @memberof VoucherCreateComponent
     */
    public get isIndianCompanyAndAccount(): boolean {
        return this.company.countryCode === 'IN' && this.account.countryCode === 'IN';
    }

    

    /**
     * True if voucher is a cash sales invoice (not purchase, debit note, or credit note)
     *
     * @readonly
     * @type {boolean}
     * @memberof VoucherCreateComponent
     */
    public get isCashSalesInvoice(): boolean {
        return this.invoiceType.isCashInvoice && !this.invoiceType.isPurchaseInvoice && !this.invoiceType.isDebitNote && !this.invoiceType.isCreditNote;
    }

    /**
     * True if Place of Supply field should be shown (invoice / credit note / estimate / proforma)
     *
     * @readonly
     * @type {boolean}
     * @memberof VoucherCreateComponent
     */
    public get showPlaceOfSupply(): boolean {
        return (
            this.invoiceType.isSalesInvoice ||
            this.isCashSalesInvoice ||
            this.invoiceType.isCreditNote ||
            this.invoiceType.isEstimateInvoice ||
            this.invoiceType.isProformaInvoice
        );
    }

    /**
     * True if Source of Supply and Destination of Supply fields should be shown (purchase bill / debit note / PO)
     *
     * @readonly
     * @type {boolean}
     * @memberof VoucherCreateComponent
     */
    public get showSourceDestinationOfSupply(): boolean {
        return (
            this.invoiceType.isPurchaseInvoice ||
            this.invoiceType.isDebitNote ||
            this.invoiceType.isPurchaseOrder
        );
    }

    /**
     * Returns true when the due date field should be visible.
     * Mirrors the *ngIf condition on the due date datepicker in the template.
     *
     * @readonly
     * @type {boolean}
     * @memberof VoucherCreateComponent
     */
    public get showDueDate(): boolean {
        return (
            this.currentVoucherFormDetails?.dueDate ||
            this.invoiceType.isSalesInvoice ||
            this.invoiceType.isPurchaseInvoice ||
            this.invoiceType.isPurchaseOrder ||
            this.invoiceType.isProformaInvoice ||
            this.invoiceType.isEstimateInvoice
        ) && !this.invoiceType.isCashInvoice;
    }

    /**
     * True when copy particular search should be available for current voucher type.
     *
     * @readonly
     * @type {boolean}
     * @memberof VoucherCreateComponent
     */
    public get shouldShowCopyParticularSearchButton(): boolean {
        if (this.invoiceType.isCashInvoice) {
            return false;
        }

        return (
            this.invoiceType.isSalesInvoice ||
            this.invoiceType.isPurchaseInvoice ||
            this.invoiceType.isEstimateInvoice ||
            this.invoiceType.isProformaInvoice ||
            this.invoiceType.isPurchaseOrder ||
            this.invoiceType.isCreditNote ||
            this.invoiceType.isDebitNote
        );
    }

    /**
     *
     * @readonly
     * @type {FormGroup}
     * @memberof VoucherCreateComponent
     */
    public get recurrenceFormGroup(): FormGroup {
        return this.invoiceForm.get('recurrencePreviewRequest') as FormGroup;
    }


    /** Tax validations */
    public taxNumberValidations: any = {
        account: {
            billingDetails: null,
            shippingDetails: null,
        },
        company: {
            billingDetails: null,
            shippingDetails: null,
        },
    };

    /**
     * Converts a date string in DD-MM-YYYY format to a Date object
     * @param {string | Date | null} dateValue - The date value to convert
     * @returns {Date | null} Date object or null if input is null/undefined
     */
    private convertToDateObject(dateValue: string | Date | null): Date | null {
        if (!dateValue) {
            return null;
        }
        if (typeof dateValue === 'string') {
            const [day, month, year] = dateValue.split('-').map(Number);
            return new Date(year, month - 1, day);
        }
        return dateValue;
    }

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        @Inject(ServiceConfig) private serviceConfig,
        private componentStore: VoucherComponentStore,
        private aiOcrStore: AiOcrStore,
        private store: Store<AppState>,
        protected generalService: GeneralService,
        private uiSettingsService: UiSettingsService,
        private vouchersUtilityService: VouchersUtilityService,
        private commonActions: CommonActions,
        private companyActions: CompanyActions,
        private warehouseActions: WarehouseActions,
        private settingsUtilityService: SettingsUtilityService,
        private settingsBranchAction: SettingsBranchActions,
        private formBuilder: FormBuilder,
        private searchService: SearchService,
        private dialog: MatDialog,
        private pageLeaveUtilityService: PageLeaveUtilityService,
        private salesAction: SalesActions,
        private toasterService: ToasterService,
        private commonService: CommonService,
        private voucherService: VoucherService,
        private purchaseOrderService: PurchaseOrderService,
        private adjustmentUtilityService: AdjustmentUtilityService,
        private settingsTaxesAction: SettingsTaxesActions,
        private proformaService: ProformaService,
        private settingsProfileActions: SettingsProfileActions,
        private titleCasePipe: TitleCasePipe,
        private changeDetection: ChangeDetectorRef,
        private aiOcrService: AiOcrService,
        private salesPersonStore: SalesPersonComponentStore,
        private focusMonitor: FocusMonitor,
        private platform: Platform,
        private ngZone: NgZone,
        private generalActions: GeneralActions,
        private customFieldsService: CustomFieldsService,
        private recurrenceService: RecurrenceFormService,
        private domSanitizer: DomSanitizer
    ) {
        this.imgPath = this.serviceConfig.IMG_PATH;
    }

    /**
     * Lifecycle hook for component initialization
     *
     * @memberof VoucherCreateComponent
     */
    public ngOnInit(): void {
        this.showAccountUniqueName = this.uiSettingsService.getShowAccountUniqueName();
        
        // Set up global interaction tracking
        this.setupGlobalInteractionTracking();

        // Close side menu on voucher create/update page
        this.store.pipe(select(state => state.general.openSideMenu), take(1)).subscribe(response => {
            if (response) {
                this.wasSidebarOpen = true;
                this.store.dispatch(this.generalActions.openSideMenu(false));
            }
        });
        this.getVoucherVersion();
        this.initVoucherForm();
        this.getCustomFields();
        this.getCountryList();
        this.getDiscountsList();
        this.getCompanyBranches();
        this.getCompanyTaxes();
        this.getSalesPersonList();
        this.searchAnnexureAccount("");

        /** Trigger row-specific stock search whenever the active entry row changes */
        this.activeEntryIndex$
            .pipe(distinctUntilChanged(), takeUntil(this.destroyed$))
            .subscribe((index) => {
                if (index === null || index < 0) {
                    return;
                }
                if (this.stockSearchRequestByEntry.get(index)?.results !== undefined) {
                    return;
                }
                const entryFormGroup = this.getEntryFormGroup(index);
                const transactionFormGroup = entryFormGroup ? this.getTransactionFormGroup(entryFormGroup) : null;
                const query = transactionFormGroup?.get("stock.name")?.value || transactionFormGroup?.get("account.name")?.value || "";
                this.searchStock(query, 1, index);
            });

        combineLatest([this.activatedRoute.params, this.activatedRoute.queryParams])
            .pipe(delay(1), takeUntil(this.destroyed$))
            .subscribe((response) => {
                if (response) {
                    // Clear cached per-row stock search results so a new voucher/route starts fresh
                    this.stockSearchRequestByEntry.clear();
                    let params = response[0];
                    if (params?.uniqueName && params.action !== "copy") {
                        this.isUpdateMode = true;
                    }
                    this.isRecurringVoucher = response;
                    if (params?.voucherType) {
                        this.isMainVoucher = true;
                        this.aiOcrStore.reset();
                        this.aiOcrService.getOcrData$.next(null);
                        this.aiOcrService.aiOcrDetails$.next(null);
                        this.aiOcrService.saveAndNext$.next(null);
                        this.aiOcrService.skipAndNext$.next(null);
                        this.selectedVoucherType = "";
                        this.ocrType = "";
                        this.transactionOptions = [];
                        this.queryParams = cloneDeep(response[1]);

                        // Reset exchange rate when route changes
                        this.componentStore.resetExchangeRate();

                        if (this.queryParams?.redirect) {
                            this.redirectUrl = this.queryParams.redirect;
                        }

                        this.company.countryName = "";
                        this.openAccountDropdown = false;
                        this.urlVoucherType = params.voucherType;
                        this.voucherType = this.vouchersUtilityService.parseVoucherType(params.voucherType);

                        if (this.voucherApiVersion !== 2) {
                            this.router.navigate(["/pages/proforma-invoice/invoice/" + this.voucherType]);
                        }

                        this.resetVoucherForm(!params?.uniqueName, true);
                        this.invoiceForm.get('isRecurringVoucher')?.patchValue(this.queryParams.isRecurringVoucher ? true : false);
                        // Initialize recurring voucher form after resetVoucherForm creates the form structure
                        if (this.queryParams.isRecurringVoucher && !this.isUpdateMode) {
                            this.isRecurringVoucherSelected();
                        }

                        /** Open account dropdown on create */
                        this.getVoucherType();

                        if (params?.accountUniqueName && this.queryParams?.entryUniqueNames) {
                            this.isPendingEntries = true;
                            this.componentStore.getEntriesByEntryUniqueNames({
                                accountUniqueName: params?.accountUniqueName,
                                payload: { entryUniqueNames: this.queryParams?.entryUniqueNames.split(",") },
                            });
                        } else {
                            this.isPendingEntries = false;
                        }

                        this.getCompanyProfile();
                        this.getIsTcsTdsApplicable();
                        this.getInvoiceSettings();
                        this.getCreatedTemplates();
                        this.getAccountOnboardingFormData();
                        this.setDefaultSupplyFields();

                        if (!this.invoiceType.isPaymentInvoice && !this.invoiceType.isReceiptInvoice) {
                            this.getWarehouses();
                        }

                        if (this.invoiceType.isCashInvoice) {
                            this.invoiceForm.get("account.uniqueName")?.patchValue("cash");
                            this.componentStore.getBriefAccounts({
                                currency: this.company.baseCurrency,
                                group: BriedAccountsGroup,
                            });
                        } else {
                            this.invoiceForm.get("account.uniqueName")?.patchValue(null);
                        }
                        this.invoiceForm.get("type").patchValue(this.voucherType);

                        if (params?.uniqueName) {
                            if (params?.action === "copy") {
                                this.isCopyMode = true;
                            } else {
                                this.invoiceForm.get("uniqueName").patchValue(params?.uniqueName);
                            }
                            this.useDefaultAccountDetails = false;
                            this.getVoucherDetails(params);
                            this.getUpdateVoucherText();
                        } else {
                            this.depositAccountName = "";
                    }

                        if (params?.accountUniqueName === "cash") {
                            this.invoiceType.isCashInvoice = true;
                        }

                        if (params?.accountUniqueName && !params?.uniqueName) {
                            this.searchAccount(params?.accountUniqueName, 1, true);
                        } else {
                            this.searchAccount();
                        }
                    } else {
                        this.isMainVoucher = false;
                        this.ocrType = params.type;
                        this.transactionOptions = this.ocrType === 'income'
                            ? [
                                { label: this.commonLocaleData?.app_invoice, value: VoucherTypeEnum.invoice },
                                { label: this.commonLocaleData?.app_voucher_types?.credit_note, value: VoucherTypeEnum.creditNote },
                                { label: this.commonLocaleData?.app_voucher_types?.receipt, value: VoucherTypeEnum.receipt }
                            ]
                            : [
                                { label: this.commonLocaleData?.app_bill, value: VoucherTypeEnum.bill },
                                { label: this.commonLocaleData?.app_voucher_types?.debit_note, value: VoucherTypeEnum.debitNote },
                                { label: this.commonLocaleData?.app_voucher_types?.payment, value: VoucherTypeEnum.payment }
                            ];
                        this.aiOcrService.getOcrData$
                            .pipe(skip(1), takeUntil(this.destroyed$))
                            .subscribe((response) => {
                                if (response) {
                                    this.ocrDataEnabled = true;
                                } else {
                                    this.ocrDataEnabled = false;
                                }
                            });

                        this.aiOcrService.aiOcrDetails$.pipe(takeUntil(this.destroyed$)).subscribe((voucherDetails) => {
                            if (voucherDetails && voucherDetails.type) {
                                this.aiOcrDetails = voucherDetails;
                                if (!this.rowData) {
                                    this.selectedVoucherType = voucherDetails.type?.toLowerCase() === VoucherTypeEnum.sales ? VoucherTypeEnum.invoice : voucherDetails.type?.toLowerCase() === VoucherTypeEnum.purchase ? VoucherTypeEnum.bill : voucherDetails.type;
                                    this.voucherType = voucherDetails.type;
                                    this.getVoucherType();
                                    this.invoiceForm.get("type").patchValue(this.voucherType);
                                    this.changeDetection.detectChanges();
                                }
                            }
                        });

                        this.aiOcrService.saveAndNext$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
                            if (response && response !== null) {
                                this.generateVoucher('save');
                            }
                        });
                    }
                }
            });

        this.aiOcrService.ocrListToCreate$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response && response.type && response.row) {
                this.selectedVoucherType = response.type?.toLowerCase() === VoucherTypeEnum.sales ? VoucherTypeEnum.invoice : response.type?.toLowerCase() === VoucherTypeEnum.purchase ? VoucherTypeEnum.bill : response.type;
                this.rowData = response.row;
            } else if (response && response.type && response.row == null) {
                this.rowData = null;
                this.selectedVoucherType = response.type?.toLowerCase() === VoucherTypeEnum.sales ? VoucherTypeEnum.invoice : response.type?.toLowerCase() === VoucherTypeEnum.purchase ? VoucherTypeEnum.bill : response.type;
            }
        });

        /** Universal date */
        this.componentStore.universalDate$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                try {
                    this.universalDate = dayjs(response[1]).format(GIDDH_DATE_FORMAT);
                    if (!this.isUpdateMode && !this.isVoucherDateChanged) {
                        this.invoiceForm.get("date")?.patchValue(this.universalDate);

                        let entryFields = [];
                        entryFields.push({ key: "date", value: this.universalDate });
                        this.updateEntry(0, entryFields);

                        // Update annexure charges date at index 0
                        const annexureCharges = this.annexureChargesArray;
                        if (annexureCharges && annexureCharges.length > 0) {
                            annexureCharges.at(0)?.get("date")?.patchValue(this.universalDate);
                        }
                    }
                } catch (e) {
                    this.universalDate = dayjs().format(GIDDH_DATE_FORMAT);
                }
            }
        });

        /** Account details */
        this.componentStore.accountDetails$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.updateAccountDataInForm(response, true);
            }
        });

        /** Company Country states */
        this.componentStore.countryData$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                const list = response?.stateList ? response?.stateList : response?.countyList;
                this.companyStateList$ = observableOf(
                    list?.map((res) => {
                        return { label: res.name, value: res.code };
                    })
                );
            }
        });

        /** Account Country states */
        this.componentStore.accountCountryData$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                const list = response?.stateList ? response?.stateList : response?.countyList;
                this.accountStateList$ = observableOf(
                    list?.map((res) => {
                        return { label: res.name, value: res.code };
                    })
                );
            }
        });

        /** Has unsaved changes */
        this.componentStore.hasSavedChanges$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            this.hasUnsavedChanges = response;
        });

        /** New account details */
        this.store.dispatch(this.salesAction.resetAccountDetailsForSales());
        this.componentStore.newAccountDetails$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.createUpdateAccountCallback(response, true);
            }
        });

        /** Updated account details */
        this.componentStore.updatedAccountDetails$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.createUpdateAccountCallback(response);
            }
        });

        /** Exchange rate */
        this.componentStore.exchangeRate$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.invoiceForm.get("exchangeRate")?.patchValue(response);
            }
        });

        /** Stock Variants */
        this.componentStore.stockVariants$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                if (response.autoSelectVariant) {
                    this.stockVariants[response.entryIndex] = observableOf(response.results);
                    this.selectVariant(response.results[0], response.entryIndex);
                } else {
                    this.invoiceForm.get("entries")["controls"]?.forEach((control, entryIndex) => {
                        let entryFormGroup = this.getEntryFormGroup(response.entryIndex);
                        let transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);

                        if (
                            transactionFormGroup.get("stock.uniqueName")?.value === response.stockUniqueName &&
                            response.entryIndex === entryIndex
                        ) {
                            this.stockVariants[entryIndex] = observableOf(response.results);

                            if (!transactionFormGroup.get("stock.variant.name")?.value) {
                                const selectedVariant = response.results?.filter(
                                    (variant) =>
                                        variant.value === transactionFormGroup.get("stock.variant.uniqueName")?.value
                                );
                                if (selectedVariant?.length) {
                                    transactionFormGroup
                                        .get("stock.variant.name")
                                        ?.patchValue(selectedVariant[0].label);
                                }
                            }
                        }
                    });
                }
            }
        });

        /** Particular details */
        this.componentStore.particularDetails$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response?.body) {
                this.prefillParticularDetails(response.entryIndex, response.body);
                this.changeDetection.detectChanges();
            }
        });

        /** Account billing address tax number observable */
        this.invoiceForm.controls["account"]
            ?.get("billingDetails")
            .get("taxNumber")
            ?.valueChanges.pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$))
            .subscribe((searchedText) => {
                this.checkAccountTaxValidation(
                    searchedText,
                    "account",
                    "billingDetails",
                    this.localeData?.billing_address
                );
            });

        /** Account shipping address tax number observable */
        this.invoiceForm.controls["account"]
            ?.get("shippingDetails")
            .get("taxNumber")
            ?.valueChanges.pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$))
            .subscribe((searchedText) => {
                this.checkAccountTaxValidation(
                    searchedText,
                    "account",
                    "shippingDetails",
                    this.localeData?.shipping_address
                );
            });

        /** Company billing address tax number observable */
        this.invoiceForm.controls["company"]
            ?.get("billingDetails")
            .get("taxNumber")
            ?.valueChanges.pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$))
            .subscribe((searchedText) => {
                this.checkCompanyTaxValidation(
                    searchedText,
                    "company",
                    "billingDetails",
                    this.localeData?.billing_address
                );
            });

        /** Company shipping address tax number observable */
        this.invoiceForm.controls["company"]
            ?.get("shippingDetails")
            .get("taxNumber")
            ?.valueChanges.pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$))
            .subscribe((searchedText) => {
                this.checkCompanyTaxValidation(
                    searchedText,
                    "company",
                    "shippingDetails",
                    this.localeData?.shipping_address
                );
            });

        this.invoiceForm
            .get("isAdvanceReceipt")
            ?.valueChanges.pipe(takeUntil(this.destroyed$))
            .subscribe((response) => {
                if (response) {
                    this.invoiceForm.get("entries")["controls"]?.forEach((entryFormGroup: any) => {
                        entryFormGroup.get("calculateAmount")?.patchValue(false);
                        entryFormGroup.get("calculateTotal")?.patchValue(false);
                        const taxesFormArray = entryFormGroup.get("taxes") as FormArray;
                        taxesFormArray.clear();
                        this.account.excludeTax = false;
                    });
                } else {
                    this.invoiceForm.get("entries")["controls"]?.forEach((entryFormGroup: any) => {
                        const transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);
                        transactionFormGroup
                            .get("amount.amountForAccount")
                            .patchValue(Number(entryFormGroup.get("total.amountForAccount")?.value));
                        entryFormGroup.get("calculateAmount")?.patchValue(true);
                        entryFormGroup.get("calculateTotal")?.patchValue(true);
                        const taxesFormArray = entryFormGroup.get("taxes") as FormArray;
                        taxesFormArray.clear();
                        this.account.excludeTax = true;
                    });
                }
            });

        /** Voucher details */
        combineLatest([this.componentStore.voucherDetails$, this.aiOcrService.aiOcrDetails$])
            .pipe(delay(1), takeUntil(this.destroyed$))
            .subscribe(([voucherDetails, aiOcrDetails]) => {
                if (!this.isMainVoucher && aiOcrDetails?.token) {
                    this.ocrDataEnabled = true;
                    this.uploadFile(true);
                } else {
                    this.ocrDataEnabled = false;
                }
                if (this.ocrDataEnabled) {
                    voucherDetails = aiOcrDetails;
                    this.aiOcrToken = aiOcrDetails?.token;
                    this.company.countryName = "";
                    this.openAccountDropdown = false;
                    this.urlVoucherType = aiOcrDetails.type;
                    this.voucherType = this.vouchersUtilityService.parseVoucherType(this.urlVoucherType);
                    this.ocrVoucherType = aiOcrDetails.type;
                    this.aiOcrService.saveAndNext$.next(null);
                    this.aiOcrService.skipAndNext$.next(null);

                    this.resetVoucherForm(true, true);

                    /** Open account dropdown on create */
                    this.getVoucherType();

                    this.isPendingEntries = false;

                    this.getCompanyProfile();
                    this.getIsTcsTdsApplicable();
                    this.getInvoiceSettings();
                    this.getCreatedTemplates();
                    this.getAccountOnboardingFormData();
                    if (this.invoiceType.isCashInvoice) {
                        this.invoiceForm.get("account.uniqueName")?.patchValue("cash");
                        this.componentStore.getBriefAccounts({
                            currency: this.company.baseCurrency,
                            group: BriedAccountsGroup,
                        });
                    } else {
                        this.invoiceForm.get("account.uniqueName")?.patchValue(null);
                    }
                    this.invoiceForm.get("type").patchValue(this.voucherType);
                    this.getUpdateVoucherText();
                    this.depositAccountName = "";

                    if (voucherDetails?.account?.uniqueName === "cash") {
                        this.invoiceType.isCashInvoice = true;
                    }

                    this.searchAccount();
                }
                const processVoucherDetails = () => {
                    if (voucherDetails) {
                        this.account.branch = voucherDetails?.branch ?? null;
                        if (!voucherDetails.isCopyVoucher) {
                            if (voucherDetails?.cashVoucher) {
                                this.getVoucherType(voucherDetails);
                            }
                            if (voucherDetails.account?.uniqueName) {
                                this.invoiceForm.controls["account"]
                                    ?.get("customerName")
                                    ?.patchValue(
                                        this.invoiceType.isCashInvoice
                                            ? voucherDetails.account?.customerName
                                            : voucherDetails.account?.name
                                    );
                            } else {
                                this.invoiceForm.controls["account"]?.get("customerName")?.patchValue(null);
                            }
                            this.invoiceForm.controls["account"]
                                ?.get("uniqueName")
                                ?.patchValue(voucherDetails.account?.uniqueName ?? null);
                            this.invoiceForm.controls["account"]
                                ?.get("attentionTo")
                                .patchValue(voucherDetails.account?.attentionTo ?? "");
                            this.invoiceForm.controls["account"]
                                ?.get("email")
                                .patchValue(voucherDetails.account?.email ?? "");
                            this.invoiceForm.controls["account"]
                                ?.get("mobileNumber")
                                .patchValue(voucherDetails.account?.mobileNumber ?? "");
                            this.account.mobileNumber = voucherDetails.account?.mobileNumber ?? "";
                        }
                        this.populateCustomFields(voucherDetails?.account?.customFields);

                        if (voucherDetails?.purchaseOrderDetails?.length && !this.isCopyMode) {
                            this.purchaseOrderDetailsForEdit = voucherDetails?.purchaseOrderDetails;
                            this.invoiceForm.get("linkedPo")?.patchValue(
                                voucherDetails?.purchaseOrderDetails?.map((po) => {
                                    return po.uniqueName;
                                })
                            );
                            this.selectedPoItems = this.invoiceForm.get("linkedPo")?.value;
                        }
                        if (this.invoiceType.isCashInvoice) {
                            this.depositAccountName = voucherDetails.account?.name;
                        }

                        if (!voucherDetails.isCopyVoucher) {
                            this.getAccountDetails(voucherDetails.account?.uniqueName);
                            this.fillBillingShippingAddress(
                                "account",
                                "billingDetails",
                                voucherDetails.account?.billingDetails,
                                0
                            );
                            this.fillBillingShippingAddress(
                                "account",
                                "shippingDetails",
                                voucherDetails.account?.shippingDetails,
                                0
                            );

                            this.copyAccountBillingInShippingAddress = isEqual(
                                voucherDetails.account?.billingDetails,
                                voucherDetails.account?.shippingDetails
                            );

                            if (
                                this.invoiceType.isPurchaseOrder ||
                                (this.invoiceType.isPurchaseInvoice && !this.invoiceType.isCashInvoice)
                            ) {
                                this.fillBillingShippingAddress(
                                    "company",
                                    "billingDetails",
                                    voucherDetails.company?.billingDetails,
                                    0
                                );
                                this.fillBillingShippingAddress(
                                    "company",
                                    "shippingDetails",
                                    voucherDetails.company?.shippingDetails,
                                    0
                                );

                                this.copyCompanyBillingInShippingAddress = isEqual(
                                    voucherDetails.company?.billingDetails,
                                    voucherDetails.company?.shippingDetails
                                );
                            }
                            this.invoiceForm.get('account.placeOfSupply.name')?.setValue(voucherDetails.account?.placeOfSupply?.name || '');
                            this.invoiceForm.get('account.placeOfSupply.code')?.setValue(voucherDetails.account?.placeOfSupply?.code || '');
                            this.invoiceForm.get('account.sourceOfSupply.name')?.setValue(voucherDetails.account?.sourceOfSupply?.name || '');
                            this.invoiceForm.get('account.sourceOfSupply.code')?.setValue(voucherDetails.account?.sourceOfSupply?.code || '');
                            this.invoiceForm.get('account.destinationOfSupply.name')?.setValue(voucherDetails.account?.destinationOfSupply?.name || '');
                            this.invoiceForm.get('account.destinationOfSupply.code')?.setValue(voucherDetails.account?.destinationOfSupply?.code || '');

                            this.invoiceForm.get("exchangeRate")?.patchValue(voucherDetails.exchangeRate);
                            this.invoiceForm.get("number")?.patchValue(this.isCopyMode ? null : voucherDetails.number);
                            this.invoiceForm
                                .get("touristSchemeApplicable")
                                ?.patchValue(voucherDetails?.touristSchemeApplicable);
                            this.invoiceForm.get("passportNumber").patchValue(voucherDetails?.passportNumber);

                            this.invoiceForm.get("date").patchValue(voucherDetails.date);
                            this.invoiceForm.get("dueDate").patchValue(voucherDetails.dueDate);

                            if (voucherDetails.referenceVoucher) {
                                this.creditDebitNoteInvoiceSelected({
                                    value: voucherDetails.referenceVoucher.uniqueName,
                                    additional: {
                                        voucherType: voucherDetails.referenceVoucher.voucherType,
                                        voucherNumber: this.isCopyMode ? null : voucherDetails.referenceVoucher.number,
                                        voucherDate: this.isCopyMode
                                            ? dayjs(new Date()).format(GIDDH_DATE_FORMAT)
                                            : voucherDetails.referenceVoucher.date,
                                    },
                                });
                            }

                            if (voucherDetails.warehouse) {
                                this.invoiceForm.controls["warehouse"]
                                    ?.get("name")
                                    .patchValue(voucherDetails.warehouse?.name);
                                this.invoiceForm.controls["warehouse"]
                                    ?.get("uniqueName")
                                    .patchValue(voucherDetails.warehouse?.uniqueName);
                            }

                            this.invoiceForm
                                .get("templateDetails.other.customField1")
                                ?.patchValue(voucherDetails.templateDetails?.other?.customField1);
                            this.invoiceForm
                                .get("templateDetails.other.customField2")
                                ?.patchValue(voucherDetails.templateDetails?.other?.customField2);
                            this.invoiceForm
                                .get("templateDetails.other.customField3")
                                ?.patchValue(voucherDetails.templateDetails?.other?.customField3);
                            this.invoiceForm
                                .get("templateDetails.other.message2")
                                ?.patchValue(voucherDetails.templateDetails?.other?.message2);
                            this.invoiceForm
                                .get("templateDetails.other.shippedVia")
                                ?.patchValue(voucherDetails.templateDetails?.other?.shippedVia);
                            this.invoiceForm
                                .get("templateDetails.other.shippingDate")
                                ?.patchValue(voucherDetails.templateDetails?.other?.shippingDate);
                            this.invoiceForm
                                .get("templateDetails.other.trackingNumber")
                                ?.patchValue(voucherDetails.templateDetails?.other?.trackingNumber);
                            this.invoiceForm
                                .get("templateDetails.templateUniqueName")
                                ?.patchValue(voucherDetails.templateDetails?.templateUniqueName);

                            if (voucherDetails.attachedFiles) {
                                this.invoiceForm.get("attachedFiles")?.patchValue(voucherDetails.attachedFiles);
                                this.selectedFileName = voucherDetails.attachedFileName;
                            }

                            this.invoiceForm
                                .get("isRcmEntry")
                                .patchValue(voucherDetails.subVoucher === SubVoucher.ReverseCharge ? true : false);
                            this.checkRcm(true);
                            if (voucherDetails.adjustments?.length && !this.isCopyMode) {
                                voucherDetails.adjustments = voucherDetails.adjustments?.map((adjustment) => {
                                    adjustment.adjustmentAmount = adjustment.amount;
                                    return adjustment;
                                });
                                this.advanceReceiptAdjustmentData = { adjustments: voucherDetails.adjustments };
                                this.calculateAdjustedVoucherTotal(voucherDetails.adjustments);
                            }

                            this.invoiceForm
                                .get("templateDetails.other.customField1")
                                ?.patchValue(voucherDetails.templateDetails?.other?.customField1);
                            this.invoiceForm
                                .get("templateDetails.other.customField2")
                                ?.patchValue(voucherDetails.templateDetails?.other?.customField2);
                            this.invoiceForm
                                .get("templateDetails.other.customField3")
                                ?.patchValue(voucherDetails.templateDetails?.other?.customField3);
                            this.invoiceForm
                                .get("templateDetails.other.message2")
                                ?.patchValue(voucherDetails.templateDetails?.other?.message2);
                            this.invoiceForm
                                .get("templateDetails.other.shippedVia")
                                ?.patchValue(voucherDetails.templateDetails?.other?.shippedVia);
                            this.invoiceForm
                                .get("templateDetails.other.shippingDate")
                                ?.patchValue(voucherDetails.templateDetails?.other?.shippingDate);
                            this.invoiceForm
                                .get("templateDetails.other.trackingNumber")
                                ?.patchValue(voucherDetails.templateDetails?.other?.trackingNumber);
                            this.invoiceForm
                                .get("templateDetails.templateUniqueName")
                                ?.patchValue(voucherDetails.templateDetails?.templateUniqueName);

                            if (voucherDetails.attachedFiles) {
                                this.invoiceForm.get("attachedFiles")?.patchValue(voucherDetails.attachedFiles);
                                this.selectedFileName = voucherDetails.attachedFileName;
                            }

                            this.invoiceForm
                                .get("isRcmEntry")
                                .patchValue(voucherDetails.subVoucher === SubVoucher.ReverseCharge ? true : false);
                            this.checkRcm(true);
                            if (voucherDetails.adjustments?.length && !this.isCopyMode) {
                                voucherDetails.adjustments = voucherDetails.adjustments?.map((adjustment) => {
                                    adjustment.adjustmentAmount = adjustment.amount;
                                    return adjustment;
                                });
                                this.advanceReceiptAdjustmentData = { adjustments: voucherDetails.adjustments };
                                this.calculateAdjustedVoucherTotal(voucherDetails.adjustments);
                            }
                        }
                        this.invoiceForm.get('salesPersonName').patchValue(voucherDetails?.salesPerson?.name || '');
                        this.invoiceForm.get('salesPersonUniqueName').patchValue(voucherDetails?.salesPerson?.uniqueName || null);

                        if (this.isRecurringVoucher[1]?.isRecurringVoucher || voucherDetails?.recurrencePreviewRequest) {
                            const recurrencePreviewRequest = voucherDetails.recurrencePreviewRequest;
                            this.invoiceForm.get('isRecurringVoucher')?.patchValue(voucherDetails.recurrencePreviewRequest || this.isRecurringVoucher[1]?.isRecurringVoucher ? true : false);

                            const startDate = this.convertToDateObject(recurrencePreviewRequest?.startDate || this.invoiceForm.get('recurrencePreviewRequest.startDate')?.value);
                            this.invoiceForm.get('recurrencePreviewRequest.startDate')?.patchValue(startDate);
                            this.invoiceForm.get('recurrencePreviewRequest.repeatOption')?.patchValue(voucherDetails?.recurrencePreviewRequest?.repeatOption || this.invoiceForm.get('recurrencePreviewRequest.repeatOption')?.value);

                            this.invoiceForm.get('recurrencePreviewRequest.frequency.unit')?.patchValue(recurrencePreviewRequest?.frequency?.unit || this.invoiceForm.get('recurrencePreviewRequest.frequency.unit')?.value);
                            this.invoiceForm.get('recurrencePreviewRequest.frequency.interval')?.patchValue(recurrencePreviewRequest?.frequency?.interval || this.invoiceForm.get('recurrencePreviewRequest.frequency.interval')?.value);

                            this.invoiceForm.get('recurrencePreviewRequest.repeatOn.type')?.patchValue(recurrencePreviewRequest?.repeatOn?.type || this.invoiceForm.get('recurrencePreviewRequest.repeatOn.type')?.value);
                            this.invoiceForm.get('recurrencePreviewRequest.repeatOn.dayOfMonth')?.patchValue(recurrencePreviewRequest?.repeatOn?.dayOfMonth || this.invoiceForm.get('recurrencePreviewRequest.repeatOn.dayOfMonth')?.value);
                            this.invoiceForm.get('recurrencePreviewRequest.repeatOn.weekday')?.patchValue(recurrencePreviewRequest?.repeatOn?.weekday || this.invoiceForm.get('recurrencePreviewRequest.repeatOn.weekday')?.value);
                            this.invoiceForm.get('recurrencePreviewRequest.repeatOn.nth')?.patchValue(recurrencePreviewRequest?.repeatOn?.nth || this.invoiceForm.get('recurrencePreviewRequest.repeatOn.nth')?.value);
                            this.invoiceForm.get('recurrencePreviewRequest.repeatOn.monthlyMode')?.patchValue(recurrencePreviewRequest?.repeatOn?.monthlyMode || this.invoiceForm.get('recurrencePreviewRequest.repeatOn.monthlyMode')?.value);

                            if (recurrencePreviewRequest?.repeatOn?.weekdays && Array.isArray(recurrencePreviewRequest.repeatOn.weekdays)) {
                                const weekdaysArray = this.invoiceForm.get('recurrencePreviewRequest.repeatOn.weekdays') as FormArray;
                                weekdaysArray.clear();
                                recurrencePreviewRequest.repeatOn.weekdays.forEach((weekday: any) => {
                                    weekdaysArray.push(this.formBuilder.control(weekday));
                                });
                            }

                            this.invoiceForm.get('recurrencePreviewRequest.end.type')?.patchValue(recurrencePreviewRequest?.end?.type || this.invoiceForm.get('recurrencePreviewRequest.end.type')?.value);

                            const endDate = this.convertToDateObject(recurrencePreviewRequest?.end?.endDate || this.invoiceForm.get('recurrencePreviewRequest.end.endDate')?.value);
                            this.invoiceForm.get('recurrencePreviewRequest.end.endDate')?.patchValue(endDate);
                        }

                        const entriesFormArray = this.invoiceForm.get("entries") as FormArray;
                        const annexureChargesArray = this.invoiceForm.get("annexureCharges") as FormArray;
                        entriesFormArray.clear();
                        annexureChargesArray.clear();

                        voucherDetails.entries?.forEach((entry: any, index: number) => {
                            if (entry.entryClass === "ANNEXURE") {
                                annexureChargesArray.push(this.getAnnexureChargeFormGroup(entry));
                                this.calculateAnnexureChargeTax(annexureChargesArray.length - 1, false, entry.taxes);
                                return;
                            }
                            if (this.invoiceType.isReceiptInvoice || this.invoiceType.isPaymentInvoice) {
                                this.invoiceForm
                                    .get("isAdvanceReceipt")
                                    .patchValue(entry.subVoucher === SubVoucher.AdvanceReceipt ? true : false);
                                this.invoiceForm.get("chequeClearanceDate")?.patchValue(entry?.chequeClearanceDate);
                                this.invoiceForm.get("chequeNumber")?.patchValue(entry?.chequeNumber);
                            }
                            if (entry.transactions[0]?.stock) {
                                this.stockUnits[index] = observableOf(entry.transactions[0]?.stock.unitRates);
                            }
                            this.invoiceForm
                                .get("entries")
                            ["controls"].push(this.getEntriesFormGroup(entry, !voucherDetails.isCopyVoucher));
                            this.applyEntryTaxesAndDiscounts(
                                index,
                                entry,
                                this.invoiceForm.get("isAdvanceReceipt")?.value
                            );
                        });

                        if (annexureChargesArray.length === 0) {
                            annexureChargesArray.push(this.getAnnexureChargeFormGroup());
                        }

                        this.checkIfEntriesHasStock();

                        if (voucherDetails.isCopyVoucher) {
                            this.recentVouchersAsideRef?.close();
                            this.focusOnCopyPreviousBtn();
                        } else if (this.isUpdateMode) {
                            setTimeout(() => {
                                this.customerVendorDropdown.focusInputField();
                            }, 100);
                        } else {
                            this.customerVendorDropdownOpen();
                        }
                        this.startLoader(false);
                    }
                };
                if (this.isRecurringVoucher[1]?.isRecurringVoucher && this.isUpdateMode) {
                    setTimeout(() => {
                        processVoucherDetails();
                    }, 300);
                } else {
                    processVoucherDetails();
                }
                setTimeout(() => {
                    this.changeDetection.detectChanges();
                }, 200);
            });

        /** Send email success */
        this.componentStore.sendEmailIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.emailDialogRef?.close();
            }
        });

        /** Vouchers list for adjustment */
        this.componentStore.vouchersForAdjustment$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                const results = response.body?.results || response.body?.items || response.body;
                this.vouchersForAdjustment = results?.map((result) => ({
                    ...result,
                    adjustmentAmount: {
                        amountForAccount: result.balanceDue?.amountForAccount,
                        amountForCompany: result.balanceDue?.amountForCompany,
                    },
                }));
            }
        });

        /** Vouchers list for reference voucher */
        this.componentStore.voucherListForCreditDebitNote$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response?.body) {
                this.referenceVouchersTotalPages = response.body.totalPages;
                if (response.body.results || response.body.items) {
                    let items = [];
                    if (response.body.results) {
                        items = response.body.results;
                    } else if (response.body.items) {
                        items = response.body.items;
                    }

                    if (!this.vouchersListForCreditDebitNote) {
                        this.vouchersListForCreditDebitNote = [];
                    }

                    items?.forEach((invoice) => {
                        this.vouchersListForCreditDebitNote.push({
                            label: invoice.voucherNumber
                                ? invoice.voucherNumber
                                : this.commonLocaleData?.app_not_available,
                            value: invoice?.uniqueName,
                            additional: invoice,
                        });
                    });
                }

                if (this.isUpdateMode) {
                    const referenceVoucher = this.invoiceForm.controls["referenceVoucher"];
                    if (referenceVoucher) {
                        let invoiceSelected = {
                            label: referenceVoucher.get("number")?.value
                                ? referenceVoucher.get("number")?.value
                                : this.commonLocaleData?.app_not_available,
                            value: referenceVoucher.get("uniqueName")?.value,
                            additional: referenceVoucher,
                        };
                        const linkedInvoice = this.vouchersListForCreditDebitNote.find(
                            (invoice) => invoice?.value === invoiceSelected?.value
                        );
                        if (!linkedInvoice) {
                            this.vouchersListForCreditDebitNote.push(invoiceSelected);
                        }
                    }
                }
                uniqBy(this.vouchersListForCreditDebitNote, "value");
                this.vouchersListForCreditDebitNote$ = observableOf(this.vouchersListForCreditDebitNote);
            }
        });

        /** Search for purchase order dropdown */
        this.linkPoDropdown.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe((search) => {
            this.filterPurchaseOrder(search);
        });

        /** Vendor purchase orders */
        this.vendorPurchaseOrders$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            this.purchaseOrders = response;
            this.filterPurchaseOrder("");
        });

        /** Linked purchase orders list */
        this.componentStore.linkedPoOrders$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (!this.isCopyMode) {
                this.linkedPoNumbers = response;

                if (this.purchaseOrderDetailsForEdit && this.isUpdateMode) {
                    setTimeout(() => {
                        this.purchaseOrderDetailsForEdit?.forEach((order) => {
                            if (!this.linkedPoNumbers || !this.linkedPoNumbers[order?.uniqueName]) {
                                this.purchaseOrders.push({
                                    label: order?.number,
                                    value: order?.uniqueName,
                                    additional: {
                                        grandTotal: order?.grandTotal?.amountForAccount,
                                        totalPending: order?.entries?.length,
                                    },
                                });

                                this.linkedPoNumbers[order?.uniqueName] = [];
                                this.linkedPoNumbers[order?.uniqueName]["voucherNumber"] = order?.number;
                                this.linkedPoNumbers[order?.uniqueName]["items"] = order?.entries;
                            }
                        });

                        this.filterPurchaseOrder("");
                    }, 200);
                }
            }
        });

        this.componentStore.deleteAttachmentIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.selectedFileName = "";
                this.invoiceForm.get("attachedFiles")?.patchValue([]);
                this.componentStore.resetAttachmentState();
                this.changeDetection.detectChanges();
            }
        });

        this.invoiceForm
            .get("exchangeRate")
            ?.valueChanges.pipe(debounceTime(100), distinctUntilChanged(), takeUntil(this.destroyed$))
            .subscribe((response) => {
                this.calculateVoucherTotals();
            });

        this.componentStore.lastVouchersCompany$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                const res = response as any;
                this.lastVouchersCompanyList.set(
                    (res?.items ?? []).map((item: any) => ({
                        voucherNumber: item.voucherNumber,
                        date: item.voucherDate,
                        grandTotal: item.grandTotal,
                        account: { name: item.account?.name, uniqueName: item.account?.uniqueName },
                        uniqueName: item?.uniqueName,
                    }))
                );
            }
        });

        this.componentStore.lastVouchersAccount$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                const res = response as any;
                this.lastVouchersAccountList.set(
                    (res?.items ?? []).map((item: any) => ({
                        voucherNumber: item.voucherNumber,
                        date: item.voucherDate,
                        grandTotal: item.grandTotal,
                        account: { name: item.account?.name, uniqueName: item.account?.uniqueName },
                        uniqueName: item?.uniqueName,
                    }))
                );
            }
        });

        this.componentStore.downloadVoucherFileResponse$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.handlePreviewVoucherPdfResponse(response);
            }
        });

        this.componentStore.briefAccounts$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.briefAccounts$ = observableOf(response);
            }
        });

        this.componentStore.ledgerEntries$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                response?.forEach((entry, entryIndex) => {
                    let item = entry.transactions[0];

                    if (item.stock) {
                        let stockUniqueName = item.stock.uniqueName;
                        item.stock.uniqueName = item.account.uniqueName + "#" + item.stock.uniqueName;
                        item.uniqueName = item.stock.uniqueName;
                        item.label = item.stock?.name;
                        item.value = item.stock.uniqueName;
                        item.additional = item.stock;
                        item.additional.uniqueName = item.account.uniqueName;
                        item.additional.stock = {};
                        item.additional.stock.uniqueName = stockUniqueName;
                    } else {
                        item.stock = undefined;
                        item.uniqueName = item.account?.uniqueName;
                        item.label = item.account?.name;
                        item.value = item.account?.uniqueName;
                        item.additional = item.account;
                    }

                    let lastIndex = 0;
                    let entryFormGroup;
                    if (entryIndex === 0) {
                        lastIndex = entryIndex;
                        entryFormGroup = this.getEntryFormGroup(lastIndex);
                    } else {
                        this.addNewLineEntry();
                        lastIndex = this.invoiceForm.get("entries")["controls"]?.length - 1;
                        entryFormGroup = this.getEntryFormGroup(lastIndex);
                    }

                    this.activeEntryIndex = lastIndex;
                    const entryDate = this.invoiceForm.get("date")?.value || this.universalDate;

                    let transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);
                    if (typeof entryDate === "object") {
                        transactionFormGroup.get("date")?.patchValue(dayjs(entryDate).format(GIDDH_DATE_FORMAT));
                    } else {
                        transactionFormGroup
                            .get("date")
                            ?.patchValue(dayjs(entryDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT));
                    }

                    entryFormGroup.get("description")?.patchValue(entry.description);
                    entryFormGroup.get("uniqueName")?.patchValue(entry.uniqueName);

                    const discountsFormArray = entryFormGroup.get("discounts") as FormArray;
                    discountsFormArray.clear();
                    if (entry.discounts?.length) {
                        entry.discounts?.forEach((discount) => {
                            discountsFormArray.push(this.getTransactionDiscountFormGroup(discount));
                        });
                    } else {
                        this.account.applicableDiscounts?.forEach((selectedDiscount) => {
                            this.discountsList()?.forEach((discount) => {
                                if (discount?.uniqueName === selectedDiscount?.uniqueName) {
                                    discountsFormArray.push(this.getTransactionDiscountFormGroup(discount));
                                }
                            });
                        });
                    }

                    const taxesFormArray = entryFormGroup.get("taxes") as FormArray;
                    taxesFormArray.clear();

                    const selectedTaxes = [];
                    let otherTax = null;
                    entry?.taxes?.forEach((selectedTax) => {
                        this.allCompanyTaxes?.forEach((tax) => {
                            if (tax.uniqueName === selectedTax?.uniqueName) {
                                if (this.otherTaxTypes.includes(tax.taxType)) {
                                    otherTax = tax;
                                } else {
                                    selectedTaxes.push(tax);
                                }
                            }
                        });
                    });

                    selectedTaxes?.forEach((tax) => {
                        taxesFormArray.push(this.getTransactionTaxFormGroup(tax));
                    });

                    if (!otherTax && this.account?.applicableTaxes?.length) {
                        this.allCompanyTaxes?.forEach((tax) => {
                            if (
                                this.getApplicableOtherTaxes()[0]?.uniqueName === tax?.uniqueName &&
                                this.otherTaxTypes.includes(tax.taxType)
                            ) {
                                otherTax = tax;
                            }
                        });
                    }

                    if (otherTax) {
                        const selectedOtherTax = this.allCompanyTaxes?.filter(
                            (tax) => tax.uniqueName === otherTax.uniqueName
                        );
                        otherTax["taxDetail"] = selectedOtherTax[0].taxDetail;
                        otherTax["name"] = selectedOtherTax[0].name;
                        this.getSelectedOtherTax(entryIndex, otherTax, otherTax.calculationMethod);
                    }

                    this.activeEntryIndex = entryIndex;

                    transactionFormGroup.get("account.name")?.patchValue(item.account?.name);
                    transactionFormGroup.get("account.uniqueName")?.patchValue(item.account?.uniqueName);
                    transactionFormGroup.get("amount.amountForAccount").patchValue(item.amount.amountForAccount);
                    entryFormGroup.get("hsnNumber")?.patchValue(item.hsnNumber);
                    entryFormGroup.get("sacNumber")?.patchValue(item.sacNumber);
                    entryFormGroup.get("showCodeType")?.patchValue(item.hsnNumber ? "hsn" : "sac");

                    if (item.stock) {
                        transactionFormGroup.get("stock.name")?.patchValue(item.stock.name);
                        transactionFormGroup.get("stock.uniqueName")?.patchValue(item.additional?.stock?.uniqueName);
                        transactionFormGroup.get("stock.quantity")?.patchValue(item.stock.quantity);
                        transactionFormGroup
                            .get("stock.rate.rateForAccount")
                            ?.patchValue(item.stock.rate.rateForAccount);
                        transactionFormGroup.get("stock.skuCode")?.patchValue(item.stock.sku);
                        transactionFormGroup.get("stock.skuCodeHeading")?.patchValue(item.stock.skuCodeHeading);
                        transactionFormGroup.get("stock.stockUnit.code")?.patchValue(item.stock.stockUnit?.code);
                        transactionFormGroup
                            .get("stock.stockUnit.uniqueName")
                            ?.patchValue(item.stock.stockUnit?.uniqueName);
                        transactionFormGroup.get("stock.variant.getParticular")?.patchValue(false);
                        transactionFormGroup.get("stock.variant.name")?.patchValue(item.additional?.variant?.name);
                        transactionFormGroup
                            .get("stock.variant.uniqueName")
                            ?.patchValue(item.additional?.variant?.uniqueName);
                        transactionFormGroup.get("stock.variant.salesTaxInclusive")?.patchValue(false);
                        transactionFormGroup
                            .get("stock.variant.purchaseTaxInclusive")
                            ?.patchValue(item.stock.taxInclusive);
                        transactionFormGroup.get("stock.hasVariants")?.patchValue(item.stock.hasVariants);
                        this.stockUnits[entryIndex] = observableOf(item.stock.unitRates);
                    } else {
                        this.stockVariants[entryIndex] = observableOf([]);
                        this.stockUnits[entryIndex] = observableOf([]);
                    }
                    this.checkIfEntriesHasStock();
                });
            }
        });

        this.salesPersonList$.pipe(takeUntil(this.destroyed$), filter(Boolean)).subscribe((salesPersonList: IOption[]) => {
            if (!this.isUpdateMode) {
                if (!this.isSalesPersonExists(this.invoiceForm.get('salesPersonUniqueName').value, salesPersonList)) {
                    let salesPersonName = "";
                    let salesPersonUniqueName = null;
                    if (this.activeSalePersonIsTransfer?.model?.action === ActionTypeEnum.TRANSFER) {
                        const salesPerson = salesPersonList?.find(item => item.value === this.activeSalePersonIsTransfer.model.uniqueName);
                        if (salesPerson) {
                            salesPersonName = salesPerson.label
                            salesPersonUniqueName = salesPerson.value
                        }
                    }
                    this.invoiceForm.get('salesPersonName').patchValue(salesPersonName);
                    this.invoiceForm.get('salesPersonUniqueName').patchValue(salesPersonUniqueName);
                }
            }
        });
    }

    /**
     * Credit/Debit note voucher selection callback
     *
     * @param {*} event
     * @memberof VoucherCreateComponent
     */
    public creditDebitNoteInvoiceSelected(event: any): void {
        if (event && event.additional && event.value) {
            const referenceVoucher = this.invoiceForm.controls["referenceVoucher"];
            referenceVoucher.get("uniqueName")?.patchValue(event.value);
            referenceVoucher.get("voucherType")?.patchValue(event.additional?.voucherType);
            referenceVoucher.get("number")?.patchValue(event.additional?.voucherNumber);
            referenceVoucher.get("date")?.patchValue(event.additional?.voucherDate);
        }
    }

    /**
     * Credit/Debit note voucher clear selection callback
     *
     * @param {*} event
     * @memberof VoucherCreateComponent
     */
    public resetCreditDebitNoteSelectedInvoice(): void {
        const referenceVoucher = this.invoiceForm.controls["referenceVoucher"];
        referenceVoucher.get("uniqueName")?.patchValue("");
        referenceVoucher.get("voucherType")?.patchValue("");
        referenceVoucher.get("number")?.patchValue("");
        referenceVoucher.get("date")?.patchValue("");
    }

    /**
     * Resets invoice list and current page
     *
     * @memberof VoucherCreateComponent
     */
    public resetVoucherListForCreditDebitNote(): void {
        this.vouchersListForCreditDebitNote = [];
        this.vouchersListForCreditDebitNote$ = observableOf([]);
        this.referenceVouchersCurrentPage = 1;
        this.referenceVouchersTotalPages = 1;
    }

    /**
     * Lifecycle hook for load component after view initialization
     *
     * @memberof VoucherCreateComponent
     */
    public ngAfterViewInit(): void {
    }

    /**
     * Finds voucher type
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private getVoucherType(response?: any): void {
        if (response) {
            let isCashInvoice = response.cashVoucher ? true : false;
            this.invoiceType = this.vouchersUtilityService.getVoucherType(this.voucherType, isCashInvoice);
        } else {
            this.invoiceType = this.vouchersUtilityService.getVoucherType(this.voucherType);
        }
        this.currentVoucherFormDetails = this.vouchersUtilityService.prepareVoucherForm(this.voucherType);
        let voucherType = this.currentVoucherFormDetails;
        if (response && voucherType) {
            if (response?.cashVoucher && (voucherType.type === "credit note" || voucherType.type === "debit note")) {
                voucherType.depositAllowed = true;
            }

            if (
                !response?.cashVoucher &&
                (voucherType.type === "payment" ||
                    voucherType.type === "receipt" ||
                    voucherType.type === "estimate" ||
                    voucherType.type === "proformas" ||
                    voucherType.type === "credit note" ||
                    voucherType.type === "debit note")
            ) {
                voucherType.depositAllowed = false;
            }
        }
    }

    /**
     * Updates voucher date/due date label
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    public getVoucherDateLabelPlaceholder(): void {
        if (this.invoiceType.isProformaInvoice || this.invoiceType.isEstimateInvoice) {
            this.voucherDateLabel = this.invoiceType.isProformaInvoice
                ? this.localeData?.proforma_date
                : this.localeData?.estimate_date;
            this.voucherDueDateLabel = this.localeData?.expiry_date;
        } else if (this.invoiceType.isCreditNote) {
            this.voucherDateLabel = this.localeData?.cr_note_date;
        } else if (this.invoiceType.isDebitNote) {
            this.voucherDateLabel = this.localeData?.dr_note_date;
        } else if (this.invoiceType.isPurchaseInvoice) {
            this.voucherDateLabel = this.localeData?.bill_date;
        } else if (this.invoiceType.isReceiptInvoice) {
            this.voucherDateLabel = this.localeData?.receipt_date;
        } else if (this.invoiceType.isPaymentInvoice) {
            this.voucherDateLabel = this.localeData?.payment_date;
        } else {
            this.voucherDateLabel = this.commonLocaleData?.app_invoice_date;
            this.voucherDueDateLabel = this.localeData?.due_date;
        }
    }

    /**
     * Gets voucher version
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private getVoucherVersion(): void {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
    }

    /**
     * Finds if tcs/tds is applicable
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private getIsTcsTdsApplicable(): void {
        this.componentStore.isTcsTdsApplicable$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            this.company.isTcsTdsApplicable = response;
        });
    }

    /**
     * Gets invoice settings
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private getInvoiceSettings(): void {
        this.componentStore.voucherSettings$.pipe(takeUntil(this.destroyed$)).subscribe((settings) => {
            if (!settings) {
                this.componentStore.getInvoiceSettings();
            } else {
                this.invoiceSettings = settings;
                if (this.voucherType === VoucherTypeEnum.sales || this.voucherType === VoucherTypeEnum.cash) {
                    this.applyRoundOff = settings.invoiceSettings.salesRoundOff;
                    this.useCustomVoucherNumber = settings.invoiceSettings?.useCustomInvoiceNumber;
                } else if (this.voucherType === VoucherTypeEnum.purchase || this.voucherType === VoucherTypeEnum.cashBill) {
                    this.applyRoundOff = settings.invoiceSettings.purchaseRoundOff;
                    this.useCustomVoucherNumber = true;
                } else if (this.voucherType === VoucherTypeEnum.debitNote) {
                    this.applyRoundOff = settings.invoiceSettings.debitNoteRoundOff;
                    this.useCustomVoucherNumber = settings.invoiceSettings?.useCustomDebitNoteNumber;
                } else if (this.voucherType === VoucherTypeEnum.creditNote) {
                    this.applyRoundOff = settings.invoiceSettings.creditNoteRoundOff;
                    this.useCustomVoucherNumber = settings.invoiceSettings?.useCustomCreditNoteNumber;
                } if (this.voucherType === VoucherTypeEnum.receipt) {
                    this.useCustomVoucherNumber = settings?.invoiceSettings?.useCustomReceiptNumber;
                } else if (this.voucherType === VoucherTypeEnum.payment) {
                    this.useCustomVoucherNumber = settings?.invoiceSettings?.useCustomPaymentNumber;
                } else if (this.voucherType === VoucherTypeEnum.estimate || this.voucherType === VoucherTypeEnum.generateEstimate) {
                    this.applyRoundOff = settings.estimateSettings.estimateRoundOff;
                    this.useCustomVoucherNumber = false;
                } else if (this.voucherType === VoucherTypeEnum.proforma || this.voucherType === VoucherTypeEnum.generateProforma) {
                    this.applyRoundOff = settings.proformaSettings?.proformaRoundOff;
                    this.useCustomVoucherNumber = false;
                } else if (this.voucherType === VoucherTypeEnum.purchaseOrder) {
                    this.useCustomVoucherNumber = settings?.purchaseBillSettings?.useCustomPONumber;
                    this.applyRoundOff = settings.purchaseBillSettings?.purchaseOrderRoundOff;
                }

                this.invoiceForm.get("roundOffApplicable")?.patchValue(this.applyRoundOff);

                this.updateDueDate();
            }
        });
    }

    /**
     * Get country list
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private getCountryList(): void {
        this.componentStore.countryList$.pipe(takeUntil(this.destroyed$)).subscribe((countryList) => {
            if (!countryList) {
                this.componentStore.getCountryList({ formName: "" });
            } else {
                this.europeanCountryList = countryList
                    ?.filter((country) => country.europeanUnionCountry)
                    ?.map((country) => {
                        return country.alpha2CountryCode;
                    });
            }
        });
    }

    /**
     * Gets company discount list
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private getDiscountsList(callback?: () => void): void {
        this.componentStore.getDiscountsList();

        this.discountsList$.pipe(takeUntil(this.destroyed$)).subscribe((discountsList) => {
            if (discountsList) {
                this.discountsList.set(discountsList);
            }
            callback?.();
        });
    }

    /**
     * Gets company profile
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private getCompanyProfile(): void {
        this.componentStore.activeCompany$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.activeCompany = response;
                this.company.addresses = response.addresses;
                this.componentStore.companyProfile$.pipe(takeUntil(this.destroyed$)).subscribe((profile) => {
                    if (profile && Object.keys(profile).length && !this.company?.countryName) {
                        this.company.countryName = profile.country;
                        this.company.countryCode = profile.countryCode || profile.countryV2.alpha2CountryCode;
                        this.company.baseCurrency = profile.baseCurrency;
                        this.company.baseCurrencySymbol = profile.baseCurrencySymbol;
                        this.company.inputMaskFormat = profile.balanceDisplayFormat?.toLowerCase() || "";
                        this.company.giddhBalanceDecimalPlaces = profile.balanceDecimalPlaces;
                        this.company.salesAsReceipt = profile.salesAsReceipt;
                        this.company.purchaseAsPayment = profile.purchaseAsPayment;
                        const isCashSalesPurchaseInvoice =
                            this.invoiceType.isCashInvoice &&
                            ((!this.invoiceType.isDebitNote && !this.invoiceType.isCreditNote && !this.invoiceType.isReceiptInvoice && !this.invoiceType.isPaymentInvoice) ||
                                this.invoiceType.isPurchaseInvoice);

                        if (isCashSalesPurchaseInvoice) {
                            this.invoiceForm
                                .get("salesPurchaseAsReceiptPayment")
                                .patchValue(
                                    this.invoiceType.isCashInvoice && this.invoiceType.isPurchaseInvoice
                                        ? profile.purchaseAsPayment
                                        : profile.salesAsReceipt
                                );
                        }
                        this.showCompanyTaxTypeByCountry(this.company.countryCode);

                        this.getCountryData(this.company.countryCode);

                        if (this.invoiceType.isCashInvoice) {
                            this.componentStore.getAccountCountryStates(this.company.countryCode);
                        }

                        if (this.invoiceType.isCashInvoice) {
                            this.account.countryName = profile.country;
                            this.account.countryCode = profile.countryCode || profile.countryV2.alpha2CountryCode;
                            this.account.baseCurrency = profile.baseCurrency;
                            this.account.baseCurrencySymbol = profile.baseCurrencySymbol;
                        }
                    }
                });
            }
        });
    }

    /**
     * Finds tax type by country and calls onboarding form api
     *
     * @private
     * @param {string} countryCode
     * @memberof VoucherCreateComponent
     */
    private showAccountTaxTypeByCountry(countryCode: string): void {
        this.account.taxType = this.vouchersUtilityService.showTaxTypeByCountry(
            countryCode,
            this.activeCompany?.countryV2?.alpha2CountryCode
        );
        if (this.account.taxType) {
            if (this.account.taxType === TaxType.GST) {
                this.account.taxTypeLabel = this.commonLocaleData?.app_gstin;
            } else if (this.account.taxType === TaxType.VAT) {
                this.account.taxTypeLabel = this.commonLocaleData?.app_enter_vat;
            } else if (this.account.taxType === TaxType.TRN) {
                this.account.taxTypeLabel = this.commonLocaleData?.app_trn;
            } else if (this.account.taxType === TaxType.SALES_TAX) {
                this.account.taxTypeLabel = this.commonLocaleData?.app_sales_tax;
            }

            this.getOnboardingForm(countryCode);
        } else {
            this.account.taxTypeLabel = "";
        }
    }

    /**
     * Finds tax type by country and calls onboarding form api
     *
     * @private
     * @param {string} countryCode
     * @memberof VoucherCreateComponent
     */
    private showCompanyTaxTypeByCountry(countryCode: string): void {
        this.company.taxType = this.vouchersUtilityService.showTaxTypeByCountry(
            countryCode,
            this.activeCompany?.countryV2?.alpha2CountryCode
        );
        if (this.company.taxType) {
            if (this.company.taxType === TaxType.GST) {
                this.company.taxTypeLabel = this.commonLocaleData?.app_gstin;
            } else if (this.company.taxType === TaxType.VAT) {
                this.company.taxTypeLabel = this.commonLocaleData?.app_enter_vat;
            } else if (this.company.taxType === TaxType.TRN) {
                this.company.taxTypeLabel = this.commonLocaleData?.app_trn;
            } else if (this.company.taxType === TaxType.SALES_TAX) {
                this.company.taxTypeLabel = this.commonLocaleData?.app_sales_tax;
            }

            const onboardingFormRequest = {
                formName: "onboarding",
                country: countryCode,
            };

            this.commonService
                .getOnboardingForm(onboardingFormRequest)
                .pipe(takeUntil(this.destroyed$))
                .subscribe((response) => {
                    if (response) {
                        this.companyFormFields = [];
                        Object.keys(response.body?.fields)?.forEach((key) => {
                            if (response?.body?.fields[key]) {
                                this.companyFormFields[response.body?.fields[key]?.name] = [];
                                this.companyFormFields[response.body?.fields[key]?.name] = response.body?.fields[key];
                            }
                        });

                        if (this.invoiceType.isCashInvoice) {
                            this.accountFormFields = cloneDeep(this.companyFormFields);
                            this.account.taxTypeLabel = cloneDeep(this.company.taxTypeLabel);
                            this.account.taxType = cloneDeep(this.company.taxType);
                        }
                    }
                });
        } else {
            this.company.taxTypeLabel = "";
        }
    }

    /**
     * Calls onboarding form data api
     *
     * @private
     * @param {string} countryCode
     * @memberof VoucherCreateComponent
     */
    private getOnboardingForm(countryCode: string): void {
        if (this.onboardingFormRequest.country !== countryCode) {
            this.onboardingFormRequest.formName = "onboarding";
            this.onboardingFormRequest.country = countryCode;
            this.store.dispatch(this.commonActions.GetOnboardingForm(this.onboardingFormRequest));
        }
    }

    /**
     * Gets onboarding form data
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private getAccountOnboardingFormData(): void {
        this.componentStore.onboardingForm$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.accountFormFields = [];
                Object.keys(response.fields)?.forEach((key) => {
                    if (response?.fields[key]) {
                        this.accountFormFields[response.fields[key]?.name] = [];
                        this.accountFormFields[response.fields[key]?.name] = response.fields[key];
                    }
                });
            }
        });
    }

    /**
     * Gets company taxes
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private getCompanyTaxes(): void {
        this.store.dispatch(this.companyActions.getTax());
        this.componentStore.companyTaxes$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.allCompanyTaxes = response;
                this.companyTaxes = response?.filter((tax) => !this.otherTaxTypes.includes(tax.taxType));

            }
            (Array.isArray(response) ? response : []).forEach((tax) => {
                if (!this.allowedSelectionOfAType.type.includes(tax.taxType)) {
                    this.allowedSelectionOfAType.type.push(tax.taxType);
                }
            });

        });
    }

    /**
     * Gets company warehouses
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private getWarehouses(): void {
        this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: 1, count: 0 }));

        this.componentStore.warehouseList$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                let warehouseResults = response.results?.filter((warehouse) => !warehouse.isArchived);
                const warehouseData = this.settingsUtilityService.getFormattedWarehouseData(warehouseResults);
                this.warehouses = warehouseData.formattedWarehouses;
                this.checkIfEntriesHasStock();
            }
        });
    }

    /**
     * Gets company branches
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private getCompanyBranches(): void {
        this.store.dispatch(
            this.settingsBranchAction.GetALLBranches({ from: "", to: "", hierarchyType: BranchHierarchyType.Flatten })
        );
        this.componentStore.branchList$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.branches = response;
                this.company.isActive =
                    this.generalService.currentOrganizationType !== OrganizationType.Branch &&
                    this.branches?.length > 1;

                if (this.generalService.currentOrganizationType === OrganizationType.Branch) {
                    // Find the current checked out branch
                    this.company.branch = response.find(
                        (branch) => branch?.uniqueName === this.generalService.currentBranchUniqueName
                    );
                } else {
                    // Find the HO branch
                    this.company.branch = response.find((branch) => !branch.parentBranch);
                }
                this.branchCurrentAddressInfo = this.company.branch.addresses.find((address)=>address.isDefault);
                this.invoiceForm.get('account.destinationOfSupply')?.patchValue({
                    name: this.branchCurrentAddressInfo.stateName || '',
                    code: this.branchCurrentAddressInfo.stateCode || '',
                });
            }
        });
    }

    /**
     * Fetches last 10 vouchers for both company-wide and account-specific lists.
     * - Company request: fetches without account filter.
     * - Account request: fetches with q = account uniqueName to filter by current account.
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private fetchPreviousVouchers(): void {
        if (this.invoiceType.isProformaInvoice || this.invoiceType.isEstimateInvoice) {
            let filterRequest: ProformaFilter = new ProformaFilter();
            filterRequest.sortBy = this.invoiceType.isProformaInvoice ? "proformaDate" : "estimateDate";
            filterRequest.sort = "desc";
            filterRequest.count = 10;
            filterRequest.isLastInvoicesRequest = true;
            this.componentStore.getPreviousProformaEstimates({
                model: filterRequest,
                type: this.invoiceType.isProformaInvoice ? "proformas" : "estimates",
            });
        } else if (this.invoiceType.isSalesInvoice || this.invoiceType.isPurchaseInvoice || this.invoiceType.isCreditNote || this.invoiceType.isDebitNote) {
            const baseRequest: Partial<InvoiceReceiptFilter> = {
                sortBy: "voucherDate",
                sort: "desc",
                count: 10,
                isLastInvoicesRequest: true,
            };

            const companyRequest: InvoiceReceiptFilter = Object.assign(new InvoiceReceiptFilter(), baseRequest);
            this.componentStore.getPreviousVouchersCompany({ model: companyRequest, type: this.voucherType });

            const accountRequest: InvoiceReceiptFilter = Object.assign(new InvoiceReceiptFilter(), baseRequest);
            accountRequest.q = this.invoiceForm.controls['account']?.get('customerName')?.value;
            this.componentStore.getPreviousVouchersAccount({ model: accountRequest, type: this.voucherType });
        }
    }

    /**
     * Gets template list and use labels from default template
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private getCreatedTemplates(): void {
        this.componentStore.createdTemplates$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            let templateType = VoucherTypeEnum.invoice;
            if (this.voucherType === VoucherTypeEnum.purchase) {
                templateType = VoucherTypeEnum.purchase_bill;
            } else if (this.voucherType === VoucherTypeEnum.purchaseOrder) {
                templateType = VoucherTypeEnum.purchase_order;
            } else if (this.voucherType === VoucherTypeEnum.debitNote || this.voucherType === VoucherTypeEnum.creditNote) {
                templateType = VoucherTypeEnum.voucher;
            }

            if (!response) {
                this.componentStore.createdTemplatesIsLoading$.pipe(take(1)).subscribe((isLoading) => {
                    if (!isLoading) {
                        this.componentStore.getCreatedTemplates(templateType);
                    }
                });
            } else {
                // Convert templates to IOption format for dropdown
                const templateOptions = this.convertTemplatesToOptions(response);
                this.sampleTemplates$.next(templateOptions);

                const defaultTemplate = response.find((template) => template.isDefault || template.isDefaultForVoucher);
                if (defaultTemplate && defaultTemplate.sections) {
                    const sections = defaultTemplate.sections;
                    if (sections.header && sections.header.data) {
                        const {
                            customField1: { label: customField1Label },
                            customField2: { label: customField2Label },
                            customField3: { label: customField3Label },
                            shippedVia: { label: shippedViaLabel },
                            shippingDate: { label: shippedDateLabel },
                            trackingNumber: { label: trackingNumber },
                        } = sections.header.data;

                        this.templateData = {
                            customField1Label,
                            customField2Label,
                            customField3Label,
                            shippedViaLabel,
                            shippedDateLabel,
                            trackingNumber,
                            showNotesAtLastPage: sections?.footer?.data
                                ? sections.footer.data.showNotesAtLastPage?.display
                                : false,
                        };
                    }
                }
            }
        });
    }

    /**
     * Gets list of account with searching
     *
     * @param {string} [query='']
     * @param {number} [page=1]
     * @return {*}  {void}
     * @memberof VoucherCreateComponent
     */
    public searchAccount(query: string = "", page: number = 1, selectAccount: boolean = false): void {
        if (this.voucherType === VoucherTypeEnum.cash) {
            return;
        }

        if (this.accountSearchRequest?.isLoading) {
            return;
        }

        let accountSearchRequest = this.vouchersUtilityService.getSearchRequestObject(
            this.voucherType,
            query,
            page,
            SearchType.CUSTOMER
        );
        if (selectAccount) {
            accountSearchRequest.group = undefined;
        }
        this.accountSearchRequest = cloneDeep(accountSearchRequest);
        this.accountSearchRequest.isLoading = true;

        this.searchService
            .searchAccountV3(accountSearchRequest)
            .pipe(takeUntil(this.destroyed$))
            .subscribe((response) => {
                if (response?.body?.results?.length) {
                    this.accountSearchRequest.loadMore = true;
                    let voucherAccountResults = [];
                    if (page > 1) {
                        this.voucherAccountResults$.subscribe((res) => (voucherAccountResults = res));
                    }
                    const newResults = response?.body?.results?.map((res) => {
                        return { label: res.name, value: res.uniqueName, additional: res };
                    });

                    if (selectAccount) {
                        this.invoiceForm.controls["account"]?.get("uniqueName")?.patchValue(query);
                        const selectedAccount = newResults?.filter((account) => account.value === query);
                        if (selectedAccount?.length && selectedAccount[0]) {
                            this.selectAccount(selectedAccount[0]);
                        } else {
                            this.selectAccount({ label: "", value: query });
                        }
                        this.openAccountDropdown = false;
                    }
                    this.voucherAccountResults$ = observableOf(voucherAccountResults.concat(...newResults));
                } else {
                    this.accountSearchRequest.loadMore = false;
                    if (page === 1) {
                        this.voucherAccountResults$ = observableOf(null);
                    }

                    if (selectAccount) {
                        this.invoiceForm.controls["account"]?.get("uniqueName")?.patchValue(query);
                        this.selectAccount({ label: "", value: query });
                    }
                }
                this.accountSearchRequest.isLoading = false;
                this.changeDetection.detectChanges();
            });
    }

    /**
     * Gets list of stock with searching
     *
     * @param {string} [query='']
     * @param {number} [page=1]
     * @return {*}  {void}
     * @memberof VoucherCreateComponent
     */
    public searchStock(query: string, page: number, entryIndex: number): void {
        const requestState = this.stockSearchRequestByEntry.get(entryIndex);

        if (requestState?.isLoading) {
            return;
        }

        const stockSearchRequest = this.vouchersUtilityService.getSearchRequestObject(
            this.voucherType,
            query,
            page,
            SearchType.ITEM
        );

        const updatedRequest = cloneDeep(stockSearchRequest);
        updatedRequest.isLoading = true;
        updatedRequest.results = requestState?.results;

        this.stockSearchRequestByEntry.set(entryIndex, updatedRequest);

        this.searchService
            .searchAccountV3(stockSearchRequest)
            .pipe(takeUntil(this.destroyed$))
            .subscribe((response) => {
                const activeRequest = this.stockSearchRequestByEntry.get(entryIndex);

                if (response?.body?.results?.length) {
                    activeRequest.loadMore = true;
                    const priorResults: OptionInterface[] = page > 1 ? (activeRequest.results || []) : [];

                    const newResults = response.body.results.map((res) => {
                        return { label: res.stock?.name || res.name, value: res.uniqueName, additional: res, tooltip: `${res.stock?.name ? res.name + ' (' + res.stock.name + ')' : res.name}` };
                    });

                    activeRequest.results = priorResults.concat(...newResults);
                } else {
                    activeRequest.loadMore = false;
                    if (page === 1) {
                        activeRequest.results = null;
                    }
                }
                activeRequest.isLoading = false;
                this.changeDetection.detectChanges();
            });
    }
    /**
     * Gets exchange rate
     *
     * @param {string} fromCurrency
     * @param {string} toCurrency
     * @param {*} voucherDate
     * @memberof VoucherCreateComponent
     */
    public getExchangeRate(fromCurrency: string, toCurrency: string, voucherDate: any): void {
        if (fromCurrency && toCurrency) {
            let date;
            if (typeof voucherDate === "string") {
                date = voucherDate;
            } else {
                date = dayjs(voucherDate).format(GIDDH_DATE_FORMAT);
            }
            this.componentStore.getExchangeRate({ fromCurrency, toCurrency, date });
        }
    }

    /**
     * Calls api to get account data
     *
     * @private
     * @param {string} accountUniqueName
     * @memberof VoucherCreateComponent
     */
    private getAccountDetails(accountUniqueName: string): void {
        if (!accountUniqueName) {
            return;
        }
        this.componentStore.getAccountDetails(accountUniqueName);

        if (
            !this.invoiceType.isCashInvoice &&
            (this.invoiceType.isSalesInvoice ||
                this.invoiceType.isPurchaseInvoice ||
                this.invoiceType.isCreditNote ||
                this.invoiceType.isDebitNote)
        ) {
            this.fetchPreviousVouchers();
            this.getAllVouchersForAdjustment();
            this.getVoucherListForCreditDebitNote();
        }

        if (this.invoiceType.isReceiptInvoice || this.invoiceType.isPaymentInvoice) {
            this.getAllVouchersForAdjustment();
        }

        if (this.invoiceType.isPurchaseInvoice && !this.invoiceType.isCashInvoice) {
            let request = {
                companyUniqueName: this.activeCompany?.uniqueName,
                accountUniqueName: accountUniqueName,
                page: 1,
                count: 100,
                sort: "",
                sortBy: "",
            };
            let payload = { statuses: [PURCHASE_ORDER_STATUS.open, PURCHASE_ORDER_STATUS.partiallyConverted] };
            this.componentStore.getVendorPurchaseOrders({
                request: request,
                payload: payload,
                commonLocaleData: this.commonLocaleData,
            });
        }

        if (this.invoiceType.isPurchaseOrder) {
            let request = {
                companyUniqueName: this.activeCompany.uniqueName,
                accountUniqueName: accountUniqueName,
                page: 1,
                count: 10,
                sort: "",
                sortBy: "",
            };
            let payload = {
                statuses: [
                    PURCHASE_ORDER_STATUS.open,
                    PURCHASE_ORDER_STATUS.partiallyConverted,
                    PURCHASE_ORDER_STATUS.expired,
                    PURCHASE_ORDER_STATUS.cancelled,
                ],
            };

            if (request.companyUniqueName && accountUniqueName) {
                this.componentStore.getPendingPurchaseOrders({ request: request, payload: payload });
            }
        }
    }

    /**
     * Calls api to get country data
     *
     * @private
     * @param {string} countryCode
     * @memberof VoucherCreateComponent
     */
    private getCountryData(countryCode: string): void {
        this.componentStore.getCountryStates(countryCode);
    }

    /**
     * Callback for account scroll end
     *
     * @memberof VoucherCreateComponent
     */
    public handleSearchAccountScrollEnd(): void {
        if (this.accountSearchRequest.loadMore) {
            let page = this.accountSearchRequest.page + 1;
            this.searchAccount(this.accountSearchRequest.query, page);
        }
    }

    /**
     * Callback for stock scroll end
     *
     * @memberof VoucherCreateComponent
     */
    public handleSearchStockScrollEnd(entryIndex: number): void {
        const requestState = this.stockSearchRequestByEntry.get(entryIndex);

        if (requestState?.loadMore) {
            const page = requestState.page + 1;
            this.searchStock(decodeURIComponent(requestState.q || ""), page, entryIndex);
        }
    }
    /**
     * Callback for select account
     *
     * @param {*} event
     * @param {boolean} [isClear=false]
     * @memberof VoucherCreateComponent
     */
    public selectAccount(event: any, isClear: boolean = false): void {
        this.useDefaultAccountDetails = true;
        this.isAccountChanged = true;
        if (isClear) {
            if (
                this.invoiceForm.controls["account"]?.get("customerName")?.value ||
                this.invoiceForm.controls["account"]?.get("uniqueName")?.value
            ) {
                this.resetVoucherForm();
            }
        } else {
            this.invoiceForm.controls["account"]?.get("customerName")?.patchValue(event?.label);
            this.getAccountDetails(event?.value);
        }
        this.openAccountDropdown = false;

        if (this.showPageLeaveConfirmation) {
            this.pageLeaveUtilityService.addBrowserConfirmationDialog();
        } else {
            this.pageLeaveUtilityService.removeBrowserConfirmationDialog();
        }
    }

    /**
     * Gets the display label for account dropdown
     *
     * @param {*} transaction
     * @returns {string}
     * @memberof VoucherCreateComponent
     */
    public getAccountDisplayLabel(transaction: any): string {
        try {
            const accountName = transaction?.get('account.name')?.value;
            const stockName = transaction?.get('stock.name')?.value;
            
            if (accountName) {
                return stockName ? stockName : accountName;
            }
            return '';
        } catch (error) {
            console.error('Error getting account display label:', error);
            return '';
        }
    }

    /**
     * Determines if dropdown should be opened
     * 
     * @param {number} entryIndex - Index of the entry
     * @param {string} accountUniqueName - Unique name of the account from transaction
     * @returns {boolean}
     * @memberof VoucherCreateComponent
     */
    public shouldOpenDropdown(entryIndex: number, accountUniqueName: string): boolean {
        try {
            if (entryIndex !== this.activeEntryIndex) {
                return false;
            }

            const accountControl = this.invoiceForm.controls['account'];
            if (!accountControl) {
                return false;
            }

            if (this.invoiceType?.isCashInvoice) {
                return Boolean(accountControl.get('customerName')?.value) && !Boolean(accountUniqueName);
            } else {
                return Boolean(accountControl.get('uniqueName')?.value) && !Boolean(accountUniqueName);
            }
        } catch (error) {
            return false;
        }
    }

    /**
     * Callback for select stock
     *
     * @param {*} event
     * @param {number} entryIndex
     * @param {boolean} [isClear=false]
     * @memberof VoucherCreateComponent
     */
    public selectStock(event: any, entryIndex: number, isClear: boolean = false): void {
        if (this.isBarcodeMachineTyping) {
            const entries = this.invoiceForm.get("entries") as FormArray;
            const account = entries.at(entryIndex)?.value?.transactions?.[0]?.account;
            // Delete entry if account is not selected
            if (!(account?.uniqueName && account?.name)) {
                this.deleteLineEntry(entryIndex);
            }
            return;
        }

        if (event) {
            const entryFormGroup = this.getEntryFormGroup(entryIndex);
            const transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);

            if (isClear) {
                transactionFormGroup.reset();
                return;
            }

            transactionFormGroup.get("account.name")?.patchValue(event?.label);
            transactionFormGroup.get("account.uniqueName")?.patchValue(event?.account?.uniqueName || event?.value);
            if (event?.additional?.stock?.uniqueName) {
                transactionFormGroup.get("stock.name")?.patchValue(event?.additional?.stock?.name);
                transactionFormGroup.get("stock.uniqueName")?.patchValue(event?.additional?.stock?.uniqueName);

                if (event.additional.stock.customField1?.value) {
                    transactionFormGroup.get("stock.customField1")?.patchValue({
                        key: event.additional.stock.customField1.key || '',
                        value: event.additional.stock.customField1.value
                    });
                } else {
                    transactionFormGroup.get("stock.customField1")?.patchValue({
                        key: '',
                        value: ''
                    });
                }
                if (event.additional.stock.customField2?.value) {
                    transactionFormGroup.get("stock.customField2")?.patchValue({
                        key: event.additional.stock.customField2.key || '',
                        value: event.additional.stock.customField2.value
                    });
                } else {
                    transactionFormGroup.get("stock.customField2")?.patchValue({
                        key: '',
                        value: ''
                    });
                }
            } else {
                const stockFormGroup = transactionFormGroup.get("stock") as FormGroup;
                const newStockFormGroup = this.getStockFormGroup();
                stockFormGroup.patchValue(newStockFormGroup.value);
            }

            if (event?.additional?.hasVariants) {
                this.componentStore.getStockVariants({
                    q: event?.additional?.stock?.uniqueName,
                    index: entryIndex,
                    autoSelectVariant: true,
                });
            } else {
                this.stockVariants[entryIndex] = observableOf([]);
                this.stockUnits[entryIndex] = observableOf([]);

                if (transactionFormGroup.get("stock.variant.getParticular")?.value) {
                    let payload = {};

                    if (event?.additional?.stock?.uniqueName) {
                        payload = {
                            stockUniqueName: event?.additional?.stock?.uniqueName,
                            customerUniqueName: this.invoiceForm.get("account.uniqueName")?.value,
                        };
                    }
                    if (this.isMultiCurrencyVoucher) {
                        combineLatest([
                            this.componentStore.exchangeRateInProgress$,
                            this.componentStore.exchangeRate$,
                            this.componentStore.voucherDetails$
                        ]).pipe(
                            filter(([inProgress, exchangeRate, voucherDetails]) => !inProgress), // Only proceed when API call is complete
                            take(1) // Subscribe only once and automatically unsubscribe
                        ).subscribe(([inProgress, exchangeRate, voucherDetails]) => {
                            if ((exchangeRate && exchangeRate !== 1) || (voucherDetails?.exchangeRate && voucherDetails?.exchangeRate !== 1)) {
                                // Exchange rate fetched successfully, proceed immediately
                                this.componentStore.getParticularDetails({
                                    accountUniqueName: transactionFormGroup.get("account.uniqueName")?.value,
                                    payload: payload,
                                    entryIndex: entryIndex,
                                });
                            } else {
                                // Exchange rate API failed or returned default value, wait 15 seconds then proceed
                                setTimeout(() => {
                                    this.componentStore.getParticularDetails({
                                        accountUniqueName: transactionFormGroup.get("account.uniqueName")?.value,
                                        payload: payload,
                                        entryIndex: entryIndex,
                                    });
                                }, 15000); // 15 second timeout
                            }
                        });
                    } else {
                        this.componentStore.getParticularDetails({
                            accountUniqueName: transactionFormGroup.get("account.uniqueName")?.value,
                            payload: payload,
                            entryIndex: entryIndex,
                        });
                    }
                } else {
                    transactionFormGroup.get("stock.variant.getParticular")?.patchValue(true);
                }
            }

            this.checkIfEntriesHasStock();

            if (event?.additional?.stock?.uniqueName && this.lastInteraction === InteractionType.KEYBOARD) {
                this.focusCopyParticularSearchButton(entryIndex);
            }
        }
    }

    /**
     * Focuses copy particular search button after stock selection when it becomes available in DOM.
     *
     * @private
     * @param {number} entryIndex
     * @memberof VoucherCreateComponent
     */
    private focusCopyParticularSearchButton(entryIndex: number): void {
        setTimeout(() => {
            this.changeDetection.detectChanges();
            const searchButton = this.getCopyParticularSearchButtonByEntryIndex(entryIndex);
            if (searchButton) {
                this.focusMonitor.focusVia(searchButton, 'keyboard');
            }
        }, 150);
    }

    /**
     * Applies entry-level taxes and discounts to a given entry form group.
     * Shared logic used by voucherDetails$ subscription and useCopyParticularHistory.
     *
     * @private
     * @param {number} entryIndex
     * @param {*} entryData
     * @param {boolean} [isAdvanceReceipt=false]
     * @memberof VoucherCreateComponent
     */
    private applyEntryTaxesAndDiscounts(
        entryIndex: number,
        entryData: any,
        isAdvanceReceipt: boolean = false
    ): void {
        const entryFormGroup = this.getEntryFormGroup(entryIndex);

        if (entryData.discounts?.length) {
            this.getSelectedDiscounts(entryIndex, entryData.discounts);
        }
        entryFormGroup.get("totalDiscount")?.patchValue(Number(entryData?.discount) || 0);

        if (entryData.taxes) {
            let normalTaxes = [];
            let otherTax = null;
            entryData.taxes?.forEach((tax) => {
                if (this.otherTaxTypes.includes(tax.taxType)) {
                    otherTax = tax;
                } else {
                    if (!tax.taxDetail) {
                        tax.taxDetail = [{ taxValue: tax.taxPercent }];
                    }
                    normalTaxes.push(tax);
                }
            });

            if (isAdvanceReceipt) {
                let totalAmount = entryData.transactions?.[0]?.amount?.amountForAccount + normalTaxes[0]?.amount?.amountForAccount + (([TaxCollectionDeductionType.TCS_RECEIVABLE, TaxCollectionDeductionType.TCS_PAYABLE].includes(otherTax?.taxType) ? 1 : -1) * (otherTax?.amount?.amountForAccount ?? 0));
                if (totalAmount > 0) {
                    entryFormGroup.get('total.amountForAccount')?.patchValue(totalAmount);
                }
            }

            if (normalTaxes?.length) {
                this.getSelectedTaxes(entryIndex, normalTaxes, false);
            }

            if (!otherTax && this.account?.applicableTaxes?.length) {
                this.allCompanyTaxes?.forEach((tax) => {
                    if (
                        this.getApplicableOtherTaxes()[0]?.uniqueName === tax?.uniqueName &&
                        this.otherTaxTypes.includes(tax.taxType)
                    ) {
                        otherTax = tax;
                    }
                });
            }

            if (otherTax) {
                const selectedOtherTax = this.allCompanyTaxes?.filter(
                    (tax) => tax.uniqueName === otherTax.uniqueName
                );
                if (selectedOtherTax?.length && selectedOtherTax[0]) {
                    otherTax["taxDetail"] = selectedOtherTax[0].taxDetail;
                    otherTax["name"] = selectedOtherTax[0].name;
                    this.getSelectedOtherTax(entryIndex, otherTax, otherTax.calculationMethod, true);
                } else {
                    // Fallback: patch directly if company tax not found
                    const isTcs = ["tcsrc", "tcspay"].includes(otherTax?.taxType);
                    entryFormGroup.get("otherTax.name")?.patchValue(otherTax?.accountName || "");
                    entryFormGroup.get("otherTax.uniqueName")?.patchValue(otherTax?.uniqueName || "");
                    entryFormGroup.get("otherTax.amount")?.patchValue(Number(otherTax?.amount?.amountForAccount) || 0);
                    entryFormGroup.get("otherTax.type")?.patchValue(isTcs ? this.otherTaxTypeEnum.TCS : this.otherTaxTypeEnum.TDS);
                    entryFormGroup.get("otherTax.calculationMethod")?.patchValue(otherTax?.calculationMethod || "");
                    entryFormGroup.get("otherTax.isChecked")?.patchValue(true);
                    entryFormGroup.get("otherTax.taxValue")?.patchValue(otherTax?.taxPercent ?? 0);
                    entryFormGroup.get("otherTax.taxDetail")?.patchValue([{ taxValue: otherTax?.taxPercent ?? 0, date: null }]);
                }
            } else if (this.invoiceForm.get("isAdvanceReceipt").value && normalTaxes?.length) {
                this.calculateReceiptPaymentAmount(entryFormGroup, true);
            } else {
                entryFormGroup.get("otherTax.name")?.patchValue("");
                entryFormGroup.get("otherTax.uniqueName")?.patchValue("");
                entryFormGroup.get("otherTax.amount")?.patchValue("");
                entryFormGroup.get("otherTax.type")?.patchValue("");
                entryFormGroup.get("otherTax.calculationMethod")?.patchValue("");
                entryFormGroup.get("otherTax.isChecked")?.patchValue(false);
                entryFormGroup.get("otherTax.taxValue")?.patchValue(0);
                entryFormGroup.get("otherTax.taxDetail")?.patchValue([]);
            }
        }
    }

    /**
     * Callback for select variant
     *
     * @param {*} event
     * @param {number} entryIndex
     * @param {boolean} [isClear=false]
     * @memberof VoucherCreateComponent
     */
    public selectVariant(event: any, entryIndex: number, isClear: boolean = false): void {
        if (event && !isClear) {
            const entryFormGroup = this.getEntryFormGroup(entryIndex);
            const transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);
            const transactionStockVariantFormGroup = transactionFormGroup.get("stock").get("variant");

            transactionStockVariantFormGroup.get("name")?.patchValue(event?.label);
            transactionStockVariantFormGroup.get("uniqueName")?.patchValue(event?.value);

            if (transactionFormGroup.get("stock.variant.getParticular")?.value) {
                this.componentStore.getParticularDetails({
                    accountUniqueName: transactionFormGroup.get("account.uniqueName")?.value,
                    payload: {
                        variantUniqueName: event?.value,
                        customerUniqueName: this.invoiceForm.get("account.uniqueName")?.value,
                    },
                    entryIndex: entryIndex,
                });
            } else {
                transactionFormGroup.get("stock.variant.getParticular")?.patchValue(true);
            }
        }
    }

    /**
     * Fills default billing and shipping addresses for account
     *
     * @private
     * @param {*} accountData
     * @memberof VoucherCreateComponent
     */
    private fillDefaultAccountAddresses(accountData: any): void {
        let defaultAddress = null;
        let accountDefaultAddress = this.vouchersUtilityService.getDefaultAddress(accountData);
        defaultAddress = accountDefaultAddress.defaultAddress;
        const index = accountDefaultAddress.defaultAddressIndex;

        if (defaultAddress) {
            this.fillBillingShippingAddress("account", "billingDetails", defaultAddress, index);
            this.fillBillingShippingAddress("account", "shippingDetails", defaultAddress, index);
            if (!this.isUpdateMode) {
                this.setDefaultSupplyFields();
            }
        }
    }

    /**
     * Returns the gstNumber of the default address (lowercased), or empty string if not found
     *
     * @private
     * @param {any[]} addresses
     * @returns {string}
     * @memberof VoucherCreateComponent
     */
    private getDefaultAddressGstNumber(addresses: any[]): string {
        if (!addresses?.length) {
            return '';
        }
        const defaultAddr = addresses.find((a) => a.isDefault);
        return defaultAddr?.gstNumber;
    }

    /**
     * Sets default values for placeOfSupply, sourceOfSupply, destinationOfSupply
     * based on account gstNumber (B2B vs B2C) and billing/shipping address states.
     * Only applies when company country is India.
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private setDefaultSupplyFields(): void {
        if (!this.isIndianCompanyAndAccount || !this.invoiceForm) {
            return;
        }

        const isB2C = !!this.getDefaultAddressGstNumber(this.account?.addresses);

        if (this.showPlaceOfSupply) {
            const stateSource = isB2C
                ? this.invoiceForm.get('account.billingDetails.state')
                : this.invoiceForm.get('account.shippingDetails.state');

            this.invoiceForm.get('account.placeOfSupply')?.patchValue({
                name: stateSource?.get('name')?.value || '',
                code: stateSource?.get('code')?.value || '',
            });
        } else if (this.showSourceDestinationOfSupply) {
            const sourceStateKey = isB2C ? 'account.billingDetails.state' : 'account.shippingDetails.state';

            const sourceState = this.invoiceForm.get(sourceStateKey);

            this.invoiceForm.get('account.sourceOfSupply')?.patchValue({
                name: sourceState?.get('name')?.value || '',
                code: sourceState?.get('code')?.value || '',
            });
            this.invoiceForm.get('account.destinationOfSupply')?.patchValue({
                name: this.branchCurrentAddressInfo.stateName || '',
                code: this.branchCurrentAddressInfo.stateCode || '',
            });
        }
    }

    /**
     * Callback when user selects a state from Place of Supply / Source of Supply / Destination of Supply dropdown
     *
     * @param {string} fieldName - 'placeOfSupply' | 'sourceOfSupply' | 'destinationOfSupply'
     * @param {any} selectedOption
     * @memberof VoucherCreateComponent
     */
    public onSupplyStateSelect(fieldName: string, selectedOption: any): void {
        this.invoiceForm.get(`account.${fieldName}`)?.patchValue({
            name: selectedOption?.label || ''
        });
    }

    /**
     * Assigns account data in object
     *
     * @private
     * @param {*} accountData
     * @memberof VoucherCreateComponent
     */
    private updateAccountDataInForm(accountData: any, fetchStates: boolean = false): void {
        if (fetchStates) {
            this.componentStore.getAccountCountryStates(accountData.country?.countryCode);
        }

        this.showAccountTaxTypeByCountry(accountData.country?.countryCode);

        if (
            !this.invoiceType.isReceiptInvoice &&
            !this.invoiceType.isPaymentInvoice &&
            this.account?.baseCurrency !== accountData.currency
        ) {
            this.componentStore.getBriefAccounts({
                currency: accountData?.baseCurrency + ", " + this.company.baseCurrency,
                group: BriedAccountsGroup,
            });
        }

        this.account.countryName = accountData.country?.countryName;
        this.account.countryCode = accountData.country?.countryCode;
        this.account.baseCurrency = accountData.currency;
        this.account.baseCurrencySymbol = accountData.currencySymbol;
        this.account.addresses = accountData.addresses;
        this.account.duePeriod = accountData.duePeriod;
        this.account.otherApplicableTaxes = accountData.otherApplicableTaxes;
        this.account.applicableDiscounts = accountData.applicableDiscounts || accountData.inheritedDiscounts;
        this.account.applicableTaxes = accountData.applicableTaxes;
        if (!this.isUpdateMode || this.isAccountChangeInUpdateMode()) {
            this.populateCustomFields(accountData.customFields);
        }
        this.account.excludeTax = !this.showTaxColumn;
        this.isMultiCurrencyVoucher = this.account.baseCurrency !== this.company.baseCurrency;

        let index = 0;
        if (!this.isUpdateMode) { // Take sales person details only if account is new else assign from get voucher response
            this.salesPersonList$.pipe(take(1)).subscribe(salesPersonList => {
                if (this.isSalesPersonExists(accountData?.salesPerson?.uniqueName, salesPersonList)) {
                    this.invoiceForm.get('salesPersonName').patchValue(accountData?.salesPerson?.name || '');
                    this.invoiceForm.get('salesPersonUniqueName').patchValue(accountData?.salesPerson?.uniqueName || null);
                }
            });
        }
        if (this.useDefaultAccountDetails) {
            if (this.isMultiCurrencyVoucher) {
                this.getExchangeRate(
                    this.account.baseCurrency,
                    this.company.baseCurrency,
                    this.invoiceForm.get("date")?.value
                );
            } else {
                this.invoiceForm.get("exchangeRate").patchValue(1);
            }
            this.fillDefaultAccountAddresses(accountData);

            if (
                this.invoiceType.isPurchaseOrder ||
                (this.invoiceType.isPurchaseInvoice && !this.invoiceType.isCashInvoice)
            ) {
                let companyDefaultAddress = this.vouchersUtilityService.getDefaultAddress(this.company?.branch);
                let defaultAddress = companyDefaultAddress.defaultAddress;
                const findIndex = this.company.addresses.findIndex((address: any) => address.uniqueName === companyDefaultAddress.defaultAddress?.uniqueName);
                let index = findIndex > -1 ? findIndex : 0;

                if (defaultAddress) {
                    this.fillBillingShippingAddress("company", "billingDetails", defaultAddress, index);
                    this.fillBillingShippingAddress("company", "shippingDetails", defaultAddress, index);
                    if (!this.isUpdateMode) {
                        this.setDefaultSupplyFields();
                    }
                }
            }

            this.invoiceForm.controls["account"]?.get("customerName")?.patchValue(accountData?.name);
            this.invoiceForm.controls["account"]?.get("attentionTo").setValue(accountData?.attentionTo);
            this.invoiceForm.controls["account"]?.get("email").setValue(accountData?.email);
            this.invoiceForm.controls["account"]?.get("mobileNumber").setValue(accountData?.mobileNo ?? "");
            this.account.mobileNumber = accountData?.mobileNo ?? "";
            this.updateDueDate();
        } else {
            if (
                !this.invoiceSettings?.invoiceSettings?.voucherAddressManualEnabled &&
                !this.invoiceType.isCashInvoice
            ) {
                const accountBillingAddressIndex = this.vouchersUtilityService.getSelectedAddressIndex(
                    accountData.addresses,
                    this.invoiceForm.controls["account"]?.get("billingDetails")?.value
                );
                const accountShippingAddressIndex = this.vouchersUtilityService.getSelectedAddressIndex(
                    accountData.addresses,
                    this.invoiceForm.controls["account"]?.get("shippingDetails")?.value
                );

                if (accountBillingAddressIndex > -1) {
                    this.invoiceForm.controls["account"]
                        ?.get("billingDetails")
                        .get("index")
                        .patchValue(accountBillingAddressIndex);
                }

                if (accountShippingAddressIndex > -1) {
                    this.invoiceForm.controls["account"]
                        ?.get("shippingDetails")
                        .get("index")
                        .patchValue(accountShippingAddressIndex);
                }

                if (
                    this.invoiceType.isPurchaseOrder ||
                    (this.invoiceType.isPurchaseInvoice && !this.invoiceType.isCashInvoice)
                ) {
                    const companyBillingAddressIndex = this.vouchersUtilityService.getSelectedAddressIndex(
                        this.company?.addresses,
                        this.invoiceForm.controls["company"]?.get("billingDetails")?.value
                    );
                    const companyShippingAddressIndex = this.vouchersUtilityService.getSelectedAddressIndex(
                        this.company?.addresses,
                        this.invoiceForm.controls["company"]?.get("shippingDetails")?.value
                    );

                    if (companyBillingAddressIndex > -1) {
                        this.invoiceForm.controls["company"]
                            ?.get("billingDetails")
                            .get("index")
                            .patchValue(companyBillingAddressIndex);
                    }
                    if (companyShippingAddressIndex > -1) {
                        this.invoiceForm.controls["company"]
                            ?.get("shippingDetails")
                            .get("index")
                            .patchValue(companyShippingAddressIndex);
                    }
                }
            }
        }
        this.changeDetection.detectChanges();
    }

    /**
     * Fills billing / shipping address in form group
     *
     * @param {string} addressType
     * @param {*} address
     * @memberof VoucherCreateComponent
     */
    public fillBillingShippingAddress(entityType: string, addressType: string, address: any, index: number): void {
        this.invoiceForm.controls[entityType]?.get(addressType).get("index").patchValue(index);
        this.invoiceForm.controls[entityType]?.get(addressType).get("name").patchValue(address?.name);
        this.invoiceForm.controls[entityType]
            ?.get(addressType)
            .get("address")
            .patchValue(typeof address?.address === "string" ? [address?.address] : address?.address);
        this.invoiceForm.controls[entityType]?.get(addressType).get("pincode").patchValue(address?.pincode);
        this.invoiceForm.controls[entityType]
            ?.get(addressType)
            .get("taxNumber")
            .patchValue(address?.gstNumber || address?.taxNumber);
        const state = { name: "", code: "" };
        if (address?.state) {
            state.name = address.state?.name;
            state.code = address.state?.code;
        } else if (address?.stateName && address?.stateCode && !address?.county) {
            state.name = address.stateName;
            state.code = address.stateCode;
        } else if (address?.county) {
            state.name = address.county?.name;
            state.code = address.county?.code;
        }
        this.invoiceForm.controls[entityType]?.get(addressType).get("state").get("name").patchValue(state.name);
        this.invoiceForm.controls[entityType]?.get(addressType).get("state").get("code").patchValue(state.code);
    }

    /**
     * Initializes voucher form
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private initVoucherForm(): void {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const { weekday } = this.generalService.getDateMeta(today);
        const nth = Math.ceil(today.getDate() / 7);
        this.invoiceForm = this.formBuilder.group({
            account: this.formBuilder.group({
                customerName: [""],
                uniqueName: ["", Validators.required],
                attentionTo: [""],
                mobileNumber: [""],
                email: ["", Validators.email],
                billingDetails: this.getAddressFormGroup(),
                shippingDetails: this.getAddressFormGroup(),
                customFields: this.formBuilder.array([]),
                placeOfSupply: this.formBuilder.group({
                    name: [''],
                    code: [''],
                }),
                sourceOfSupply: this.formBuilder.group({
                    name: [''],
                    code: [''],
                }),
                destinationOfSupply: this.formBuilder.group({
                    name: [''],
                    code: [''],
                })
            }),
            company: this.formBuilder.group({
                billingDetails: this.getAddressFormGroup(),
                shippingDetails: this.getAddressFormGroup(),
            }),
            date: ["", Validators.required],
            dueDate: ["", Validators.required],
            exchangeRate: [1, Validators.required],
            number: [""],
            roundOffApplicable: [true],
            type: ["", Validators.required],
            updateAccountDetails: [false],
            subVoucher: [""],
            deposits: this.formBuilder.array([this.getDepositFormGroup()]),
            warehouse: this.formBuilder.group({
                name: [""],
                uniqueName: [""],
            }),
            templateDetails: this.formBuilder.group({
                other: this.formBuilder.group({
                    customField1: [""],
                    customField2: [""],
                    customField3: [""],
                    message2: [""],
                    shippedVia: [""],
                    shippingDate: [""],
                    trackingNumber: [""],
                }),
                templateUniqueName: [""]
            }),
            entries: this.formBuilder.array([this.getEntriesFormGroup()]),
            uniqueName: [""],
            isRcmEntry: [false],
            touristSchemeApplicable: [false],
            passportNumber: [""],
            generateEInvoice: [null],
            voucherUniqueName: [""], //temp
            referenceVoucher: this.formBuilder.group({
                uniqueName: [""],
                voucherType: [""],
                number: [""],
                date: [""],
            }),
            isRecurringVoucher: [false], // toggle from parent
            recurrencePreviewRequest: this.formBuilder.group({
                startDate: [null, Validators.required],

                frequency: this.formBuilder.group({
                    unit: [RecurringFrequencyUnit.MONTH, Validators.required],
                    interval: [1, [Validators.required, Validators.min(1)]]
                }),

                repeatOn: this.formBuilder.group({
                    type: [RecurringRepeatType.DAY_OF_MONTH],
                    weekdays: this.formBuilder.array([]),   // ✅ ALWAYS exists
                    dayOfMonth: [null],
                    nth: [null],
                    weekday: [null],
                    monthlyMode: [RecurringMonthlyMode.DAY]
                }),

                end: this.formBuilder.group({
                    type: [RecurringEndType.NEVER],
                    endDate: [null],
                }),
                repeatOption: RecurringRepeatOption.MONTHLY_DATE
            }),
            einvoiceGenerated: [false],
            linkedPo: [null], //temp
            grandTotalMultiCurrency: [0], //temp
            chequeNumber: [null], //temp
            chequeClearanceDate: [null], //temp
            isAdvanceReceipt: [false], //temp
            attachedFiles: [],
            salesPurchaseAsReceiptPayment: [null], //temp
            salesPersonName: [''],
            salesPersonUniqueName: [''],
            annexureCharges: this.formBuilder.array([this.getAnnexureChargeFormGroup()])
        });
    }

    /**
     * When checkbox is checked, populate recurrencePreviewRequest form with today's date
     *
     * @memberof VoucherCreateComponent
     */
    public isRecurringVoucherSelected(): void {
        // When checkbox is checked, populate recurrencePreviewRequest form with today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const { weekday } = this.generalService.getDateMeta(today);
        const nth = Math.ceil(today.getDate() / 7);

        const recurrenceForm = this.invoiceForm.get('recurrencePreviewRequest') as FormGroup;
        recurrenceForm.patchValue({
            startDate: today,
            frequency: {
                unit: RecurringFrequencyUnit.MONTH,
                interval: 1
            },
            repeatOn: {
                type: RecurringRepeatType.DAY_OF_MONTH,
                weekdays: [],
                dayOfMonth: today.getDate(),
                nth: nth,
                weekday: weekday,
                monthlyMode: RecurringMonthlyMode.DAY
            },
            end: {
                type: RecurringEndType.NEVER,
                endDate: today
            },
            repeatOption: RecurringRepeatOption.MONTHLY_DATE
        });
    }

    /**
     * Returns deposit form group
     *
     * @private
     * @return {*}  {FormGroup}
     * @memberof VoucherCreateComponent
     */
    private getDepositFormGroup(): FormGroup {
        return this.formBuilder.group({
            accountUniqueName: [null],
            amount: [""],
            currencySymbol: [""],
            type: ["DEBIT"],
        });
    }
    /**
     * Returns address form group
     *
     * @private
     * @return {*}  {FormGroup}
     * @memberof VoucherCreateComponent
     */
    private getAddressFormGroup(): FormGroup {
        return this.formBuilder.group({
            index: [""], //temp
            name: [""],
            address: [""],
            pincode: [""],
            taxNumber: [""],
            state: this.formBuilder.group({
                name: [""],
                code: [""],
            }),
        });
    }

    /**
     * Returns entries form group
     *
     * @private
     * @return {*}  {FormGroup}
     * @memberof VoucherCreateComponent
     */
    private getEntriesFormGroup(entryData?: any, copyUniqueName: boolean = true): FormGroup {
        let voucherDate = "";

        if (typeof this.invoiceForm?.get("date")?.value === "object") {
            voucherDate = dayjs(this.invoiceForm?.get("date")?.value).format(GIDDH_DATE_FORMAT);
        } else {
            voucherDate = this.invoiceForm?.get("date")?.value;
        }
        return this.formBuilder.group({
            date: [
                !this.invoiceType.isPurchaseOrder &&
                    !this.invoiceType.isEstimateInvoice &&
                    !this.invoiceType.isProformaInvoice
                    ? voucherDate || this.universalDate || dayjs().format(GIDDH_DATE_FORMAT)
                    : null,
            ],
            description: [entryData ? entryData?.description : ""],
            voucherType: [this.voucherType],
            uniqueName: [this.isCopyMode ? "" : entryData && copyUniqueName ? entryData?.uniqueName : ""],
            showCodeType: [entryData && entryData?.hsnNumber ? "hsn" : "sac"], //temp
            hsnNumber: [entryData ? entryData?.hsnNumber : ""],
            sacNumber: [entryData ? entryData?.sacNumber : ""],
            totalDiscount: [""], // temp
            totalTax: [0], // temp
            totalTaxWithoutCess: [""], //temp
            totalCess: [""], //temp
            calculateTotal: [true], //temp
            calculateAmount: [true], //temp
            otherTax: this.formBuilder.group({
                //temp
                name: [""],
                uniqueName: [""],
                amount: [""],
                type: [""],
                taxType: [""],
                calculationMethod: [""],
                isChecked: [false],
                taxValue: [0],
                taxDetail: [], //temp
            }),
            requiredTax: [false], //temp
            discounts: this.formBuilder.array([this.getTransactionDiscountFormGroup()]),
            taxes: this.formBuilder.array([this.getTransactionTaxFormGroup()]),
            transactions: this.formBuilder.array([
                this.formBuilder.group({
                    account: this.formBuilder.group({
                        name: [
                            entryData
                                ? this.ocrDataEnabled
                                    ? entryData?.transactions[0]?.account?.uniqueName
                                    : entryData?.transactions[0]?.account?.name
                                : "",
                        ],
                        uniqueName: [entryData ? entryData?.transactions[0]?.account?.uniqueName : ""],
                    }),
                    amount: this.formBuilder.group({
                        amountForAccount: [entryData ? entryData?.transactions[0]?.amount?.amountForAccount : 0],
                        amountForCompany: [entryData ? entryData?.transactions[0]?.amount?.amountForCompany : 0],
                        type: ["DEBIT"],
                    }),
                    stock: this.getStockFormGroup(entryData),
                }),
            ]),
            total: this.formBuilder.group({
                //temp
                amountForAccount: [entryData ? entryData?.transactions[0]?.amount?.amountForAccount : 0],
                amountForCompany: [entryData ? entryData?.transactions[0]?.amount?.amountForCompany : 0],
            }),
            purchaseOrderItemMapping: this.formBuilder.group({
                uniqueName: [entryData ? entryData?.purchaseOrderItemMapping?.uniqueName : ""],
                entryUniqueName: [entryData ? entryData?.purchaseOrderItemMapping?.entryUniqueName : ""],
            }),
        });
    }

    /**
     * Returns address form group
     *
     * @private
     * @return {*}  {FormGroup}
     * @memberof VoucherCreateComponent
     */
    private getTransactionDiscountFormGroup(discount?: any): FormGroup {
        return this.formBuilder.group({
            amount: this.formBuilder.group({
                amountForAccount: [discount?.discountValue],
                amountForCompany: [""],
                type: ["DEBIT"],
            }),
            calculationMethod: [discount?.discountType || discount?.calculationMethod || "FIX_AMOUNT"],
            discountType: [discount?.discountType || discount?.calculationMethod || "FIX_AMOUNT"],
            discountValue: [discount?.discountValue],
            name: [discount?.name],
            particular: [""],
            uniqueName: [discount?.uniqueName],
        });
    }

    /**
     * Returns stock form group
     *
     * @private
     * @param {*} [entryData] - Entry data for initialization
     * @return {*}  {FormGroup}
     * @memberof VoucherCreateComponent
     */
    private getStockFormGroup(entryData?: any): FormGroup {
        return this.formBuilder.group({
            name: [entryData ? entryData?.transactions[0]?.stock?.name : ""],
            quantity: [entryData ? entryData?.transactions[0]?.stock?.quantity : 1],
            maxQuantity: [this.getStockMaxQuantity(entryData)], //temp (for PO linking in PB)
            rate: this.formBuilder.group({
                rateForAccount: [
                    entryData
                        ? entryData?.transactions[0]?.stock?.rate?.rateForAccount ??
                        entryData?.transactions[0]?.stock?.rate?.amountForAccount
                        : 1,
                ],
            }),
            stockUnit: this.formBuilder.group({
                code: [entryData ? entryData?.transactions[0]?.stock?.stockUnit?.code : ""],
                uniqueName: [entryData ? entryData?.transactions[0]?.stock?.stockUnit?.uniqueName : ""],
            }),
            variant: this.formBuilder.group({
                name: [entryData ? entryData?.transactions[0]?.stock?.variant?.name : ""],
                uniqueName: [entryData ? entryData?.transactions[0]?.stock?.variant?.uniqueName : ""],
                salesTaxInclusive: [
                    entryData ? entryData?.transactions[0]?.stock?.variant?.salesTaxInclusive : false,
                ],
                purchaseTaxInclusive: [
                    entryData ? entryData?.transactions[0]?.stock?.variant?.purchaseTaxInclusive : false,
                ],
                getParticular: [true],
            }),
            skuCodeHeading: [entryData ? entryData?.transactions[0]?.stock?.skuCodeHeading : ""],
            skuCode: [entryData ? entryData?.transactions[0]?.stock?.sku : ""],
            uniqueName: [entryData ? entryData?.transactions[0]?.stock?.uniqueName : ""],
            customField1: this.formBuilder.group({
                key: [
                    entryData?.transactions[0]?.stock?.customField1?.value
                        ? entryData?.transactions[0]?.stock?.customField1?.key
                        : "",
                ],
                value: [
                    entryData?.transactions[0]?.stock?.customField1?.value
                        ? entryData?.transactions[0]?.stock?.customField1?.value
                        : "",
                ],
            }),
            customField2: this.formBuilder.group({
                key: [
                    entryData?.transactions[0]?.stock?.customField2?.value
                        ? entryData?.transactions[0]?.stock?.customField2?.key
                        : "",
                ],
                value: [
                    entryData?.transactions[0]?.stock?.customField2?.value
                        ? entryData?.transactions[0]?.stock?.customField2?.value
                        : "",
                ],
            }),
            hasVariants: [entryData ? entryData?.transactions[0]?.stock?.hasVariants : false],
        });
    }

    /**
     * Returns transaction tax form group
     *
     * @private
     * @param {*} [tax]
     * @return {*}  {FormGroup}
     * @memberof VoucherCreateComponent
     */
    private getTransactionTaxFormGroup(tax?: any): FormGroup {
        const taxDetailGroup = this.formBuilder.group({
            taxValue: [tax?.taxDetail?.[0]?.taxValue ?? 0],
            date: [tax?.taxDetail?.[0]?.date ?? null],
        });

        return this.formBuilder.group({
            calculationMethod: [tax?.calculationMethod],
            uniqueName: [tax?.uniqueName],
            taxType: [tax?.taxType],
            taxDetail: this.formBuilder.array([taxDetailGroup])
        });
    }

    /**
     * Returns annexure charge form group
     *
     * @private
     * @param {*} [annexureData] - Annexure data for initialization
     * @return {*}  {FormGroup}
     * @memberof VoucherCreateComponent
     */
    private getAnnexureChargeFormGroup(annexureData?: any): FormGroup {
        let voucherDate;

        if (this.invoiceForm?.get("date")?.value && (typeof this.invoiceForm?.get("date")?.value === "object")) {
            voucherDate = dayjs(this.invoiceForm?.get("date")?.value).format(GIDDH_DATE_FORMAT);
        } else {
            voucherDate = this.invoiceForm?.get("date")?.value ?? "";
        }
        return this.formBuilder.group({
            date: [annexureData?.date || voucherDate || this.universalDate || "", Validators.required],
            voucherType: [this.voucherType],
            calculateAmount: [true],
            entryClass: ["ANNEXURE"],
            taxes: this.formBuilder.array(annexureData?.taxes || []),
            totalTaxWithoutCess: [annexureData?.totalTaxWithoutCess || 0],
            totalCess: [annexureData?.totalCess || 0],
            total: this.formBuilder.group({
                amountForAccount: [annexureData?.total?.amountForAccount || 0, [Validators.required, Validators.min(0)]],
                amountForCompany: [annexureData?.total?.amountForCompany || 0],
            }),
            transactions: this.formBuilder.array([
                this.formBuilder.group({
                    account: this.formBuilder.group({
                        name: [annexureData?.transactions?.[0]?.account?.name || annexureData?.accountName || ""],
                        uniqueName: [annexureData?.transactions?.[0]?.account?.uniqueName || annexureData?.accountUniqueName || "", Validators.required],
                    }),
                    amount: this.formBuilder.group({
                        amountForAccount: [annexureData?.transactions?.[0]?.amount?.amountForAccount || annexureData?.amount || 0, [Validators.required, Validators.min(0)]],
                        amountForCompany: [annexureData?.transactions?.[0]?.amount?.amountForCompany || 0],
                    }),
                }),
            ]),
        });
    }

    /**
     * Calculate max quantity for PO linking in PB
     *
     * @private
     * @param entryData
     * @returns
     */
    private getStockMaxQuantity(entryData: any): number | undefined {
        let maxQuantity = undefined;
        if (this.invoiceType.isPurchaseInvoice && entryData?.purchaseOrderLinkSummaries?.length > 0) {
            entryData.purchaseOrderLinkSummaries.forEach((summary) => {
                if (!isNaN(Number(summary.unUsedQuantity))) {
                    if (entryData?.transactions[0]?.stock) {
                        maxQuantity = summary.unUsedQuantity + entryData?.transactions[0]?.stock?.quantity;
                    } else {
                        maxQuantity = summary.usedQuantity;
                    }
                }
            });
        }
        return maxQuantity;
    }

    /**
     * Opens the copy particular dialog
     *
     * @memberof VoucherCreateComponent
     */
    public openCopyDialog(entryIndex: number, event?: Event): void {
        const entryFormGroup = this.getEntryFormGroup(entryIndex);
        const transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);
        const stockUniqueName = transactionFormGroup.get("stock.uniqueName")?.value;
        const accountUniqueName = this.invoiceForm.get("account.uniqueName")?.value;

        if (!stockUniqueName || !accountUniqueName) {
            return;
        }

        const accountName =
            this.invoiceForm?.controls["account"]?.get("customerName")?.value ||
            this.invoiceForm?.controls["account"]?.get("name")?.value ||
            "";
        const stockName = transactionFormGroup.get("stock.name")?.value || "";
        const variantName = transactionFormGroup.get("stock.variant.name")?.value || "";

        this.copyParticularEntryIndex = entryIndex;
        this.copyParticularDialogTitle = stockName
            ? `${accountName} (${stockName}${variantName ? ` - ${variantName}` : ""})`
            : accountName;
        this.copyParticularPagination = {
            page: 1
        };
        this.copyParticularHistory = { items: [], totalItems: 0, totalPages: 0, page: 1 };
        this.copyParticularTriggerElement = (event?.currentTarget as HTMLElement) || (document.activeElement as HTMLElement) || null;
        this.copyParticularTriggerEntryIndex = entryIndex;

        this.copyParticularDialogRef = this.dialog.open(CopyParticularDialogComponent, {
            panelClass: 'mat-dialog-lg',
            data: {
                parent: this
            }
        });
        this.copyParticularDialogComponentInstance = this.copyParticularDialogRef.componentInstance;

        this.getCopyParticularHistory();

        this.copyParticularDialogRef.afterClosed().pipe(take(1)).subscribe(() => {
            this.copyParticularEntryIndex = null;
            this.copyParticularHistory = { items: [], totalItems: 0, totalPages: 0, page: 1 };
            this.isCopyParticularLoading = false;
            this.copyParticularDialogTitle = "";
            this.copyParticularDialogComponentInstance = null;
            this.copyParticularDialogRef = null;
            if (this.shouldFocusAddNewParticularAfterCopy) {
                this.focusAddNewParticularElement();
                this.shouldFocusAddNewParticularAfterCopy = false;
                this.copyParticularTriggerElement = null;
                this.copyParticularTriggerEntryIndex = null;
            } else {
                this.restoreCopyParticularTriggerFocus();
            }
        });
    }

    /**
     * Restores focus to the copy particular trigger button if available,
     * otherwise focuses the next logical element from the original trigger.
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private restoreCopyParticularTriggerFocus(): void {
        setTimeout(() => {
            const triggerElement = this.getCopyParticularTriggerButton();

            if (triggerElement) {
                triggerElement.focus();
            } else if (this.copyParticularTriggerElement) {
                const nextElement = this.findNextFocusableElementSimple(this.copyParticularTriggerElement);
                if (nextElement) {
                    nextElement.focus();
                } else {
                    this.copyParticularTriggerElement.focus();
                }
            }

            this.copyParticularTriggerElement = null;
            this.copyParticularTriggerEntryIndex = null;
        }, 100);
    }

    /**
     * Finds the current copy particular trigger button in DOM for the stored entry index.
     *
     * @private
     * @returns {(HTMLElement | null)}
     * @memberof VoucherCreateComponent
     */
    private getCopyParticularTriggerButton(): HTMLElement | null {
        if (this.copyParticularTriggerEntryIndex === null || !this.platform.isBrowser) {
            return null;
        }

        return this.getCopyParticularSearchButtonByEntryIndex(this.copyParticularTriggerEntryIndex);
    }

    /**
     * Finds copy particular search button in DOM for the provided entry index.
     *
     * @private
     * @param {number} entryIndex
     * @returns {(HTMLElement | null)}
     * @memberof VoucherCreateComponent
     */
    private getCopyParticularSearchButtonByEntryIndex(entryIndex: number): HTMLElement | null {
        if (!this.platform.isBrowser || entryIndex === null || entryIndex === undefined) {
            return null;
        }

        const productColumn = document.querySelectorAll('td.product-column')[entryIndex] as HTMLElement | undefined;
        if (!productColumn) {
            return null;
        }

        return productColumn.querySelector('.copy-particular-search-btn') as HTMLElement | null;
    }

    /**
     * Handles page change for copy particular dialog
     *
     * @param {PageEvent} event
     * @memberof VoucherCreateComponent
     */
    public handleCopyParticularPageChange(event: PageEvent): void {
        if (!event) {
            return;
        }

        this.copyParticularPagination.page = event.pageIndex + 1;
        this.getCopyParticularHistory();
    }

    /**
     * Populates selected history row in active entry
     *
     * @param {*} item
     * @memberof VoucherCreateComponent
     */
    public useCopyParticularHistory(item: any): void {
        if (this.copyParticularEntryIndex === null || !item) {
            return;
        }

        const entryFormGroup = this.getEntryFormGroup(this.copyParticularEntryIndex);
        const transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);
        const exchangeRate = Number(this.invoiceForm.get("exchangeRate")?.value ?? 1) || 1;
        const amountForAccount = Number(item?.amount) || 0;
        const totalForAccount = Number(item?.total) || 0;
        const quantity = Number(item?.quantity) || 0;
        const rate = Number(item?.rate) || 0;

        this.activeEntryIndex = this.copyParticularEntryIndex;

        entryFormGroup.get("description")?.patchValue(item?.description || "");

        this.applyEntryTaxesAndDiscounts(
            this.copyParticularEntryIndex,
            item,
            this.invoiceForm.get("isAdvanceReceipt")?.value
        );

        // Override with exact API amounts per tax type (non-CESS vs CESS split)
        const taxWithoutCess = (item?.taxes ?? [])
            .filter((t: any) => t?.taxType !== "CESS" && !this.otherTaxTypes.includes(t?.taxType))
            .reduce((sum: number, t: any) => sum + (Number(t?.amount?.amountForAccount) || 0), 0);
        const cessTotal = (item?.taxes ?? [])
            .filter((t: any) => t?.taxType === "CESS")
            .reduce((sum: number, t: any) => sum + (Number(t?.amount?.amountForAccount) || 0), 0);
        entryFormGroup.get("totalTax")?.patchValue(Number(item?.tax) || 0);
        entryFormGroup.get("totalTaxWithoutCess")?.patchValue(taxWithoutCess || (Number(item?.tax) || 0));
        entryFormGroup.get("totalCess")?.patchValue(cessTotal);
        entryFormGroup.get("total.amountForAccount")?.patchValue(totalForAccount);
        entryFormGroup.get("total.amountForCompany")?.patchValue(
            giddhRoundOff(totalForAccount * exchangeRate, this.company.giddhBalanceDecimalPlaces)
        );

        transactionFormGroup.get("stock.name")?.patchValue(item?.stockName || transactionFormGroup.get("stock.name")?.value);
        transactionFormGroup.get("stock.uniqueName")?.patchValue(item?.stockUniqueName || transactionFormGroup.get("stock.uniqueName")?.value);
        transactionFormGroup.get("stock.quantity")?.patchValue(quantity);
        transactionFormGroup.get("stock.rate.rateForAccount")?.patchValue(rate);
        transactionFormGroup.get("amount.amountForAccount")?.patchValue(amountForAccount);
        transactionFormGroup.get("amount.amountForCompany")?.patchValue(
            giddhRoundOff(amountForAccount * exchangeRate, this.company.giddhBalanceDecimalPlaces)
        );
        transactionFormGroup.get("stock.stockUnit.code")?.patchValue(item?.stockUnit || "");

        if (item?.hasVariants) {
            transactionFormGroup.get("stock.variant.name")?.patchValue(item?.variantName || "");
            transactionFormGroup.get("stock.variant.uniqueName")?.patchValue(item?.variantUniqueName || "");
            transactionFormGroup.get("stock.hasVariants")?.patchValue(true);
            this.componentStore.getStockVariants({
                q: transactionFormGroup.get("stock.uniqueName")?.value,
                index: this.copyParticularEntryIndex,
                autoSelectVariant: false,
            });
        } else {
            transactionFormGroup.get("stock.variant.name")?.patchValue("");
            transactionFormGroup.get("stock.variant.uniqueName")?.patchValue("");
            transactionFormGroup.get("stock.hasVariants")?.patchValue(false);
        }

        this.updateCopyParticularStockUnit(this.copyParticularEntryIndex, item?.stockUnit);
        this.checkIfEntriesHasStock();
        this.calculateVoucherTotals();
        this.shouldFocusAddNewParticularAfterCopy = true;
        this.copyParticularDialogRef?.close();
    }

    /**
     * Focuses add new particular element.
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private focusAddNewParticularElement(): void {
        if (this.addNewParticular?.nativeElement) {
            setTimeout(() => {
                this.addNewParticular.nativeElement.focus();
            }, 100);
        }
    }

    /**
     * Updates stock unit in selected entry from loaded unit options
     *
     * @private
     * @param {number} entryIndex
     * @param {string} stockUnitCode
     * @memberof VoucherCreateComponent
     */
    private updateCopyParticularStockUnit(entryIndex: number, stockUnitCode: string): void {
        if (!stockUnitCode || !this.stockUnits[entryIndex]) {
            return;
        }

        this.stockUnits[entryIndex].pipe(take(1)).subscribe((units: any[]) => {
            const matchedUnit = units?.find((unit) => unit?.stockUnitCode === stockUnitCode);
            if (!matchedUnit) {
                return;
            }

            const entryFormGroup = this.getEntryFormGroup(entryIndex);
            const transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);

            transactionFormGroup.get("stock.stockUnit.code")?.patchValue(matchedUnit.stockUnitCode);
            transactionFormGroup.get("stock.stockUnit.uniqueName")?.patchValue(matchedUnit.stockUnitUniqueName);
        });
    }

    /**
     * Gets stock history for copy particular dialog
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private getCopyParticularHistory(): void {
        const request = this.getCopyParticularHistoryRequest();

        if (!request) {
            return;
        }

        this.ngZone.run(() => {
            this.isCopyParticularLoading = true;
            this.changeDetection.detectChanges();
        });
        this.voucherService
            .getStockHistory(request)
            .pipe(take(1))
            .subscribe((response) => {
                this.ngZone.run(() => {
                    this.isCopyParticularLoading = false;
                    this.copyParticularHistory = response?.status === "success"
                        ? (response?.body ?? { items: [], totalItems: 0, totalPages: 0, page: 1 })
                        : { items: [], totalItems: 0, totalPages: 0, page: 1 };
                    this.changeDetection.detectChanges();
                    this.copyParticularDialogComponentInstance?.refreshView();
                });
            }, () => {
                this.ngZone.run(() => {
                    this.isCopyParticularLoading = false;
                    this.copyParticularHistory = { items: [], totalItems: 0, totalPages: 0, page: 1 };
                    this.changeDetection.detectChanges();
                    this.copyParticularDialogComponentInstance?.refreshView();
                });
            });
    }

    /**
     * Builds request payload for copy particular dialog API
     *
     * @private
     * @return {*}
     * @memberof VoucherCreateComponent
     */
    private getCopyParticularHistoryRequest(): any {
        if (this.copyParticularEntryIndex === null) {
            return null;
        }

        const entryFormGroup = this.getEntryFormGroup(this.copyParticularEntryIndex);
        const transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);
        const stockUniqueName = transactionFormGroup.get("stock.uniqueName")?.value;
        const accountUniqueName = this.invoiceForm.get("account.uniqueName")?.value;

        if (!stockUniqueName || !accountUniqueName) {
            return null;
        }

        return {
            stockUniqueName,
            accountUniqueName,
            variantUniqueName: transactionFormGroup.get("stock.variant.uniqueName")?.value || "",
            voucherType: this.voucherType === VoucherTypeEnum.purchaseOrder ? VoucherTypeEnum.purchase_order : 
                            this.voucherType === VoucherTypeEnum.generateEstimate ? VoucherTypeEnum.estimate 
                                : (this.voucherType === VoucherTypeEnum.generateProforma ? VoucherTypeEnum.proforma 
                                    : this.voucherType),
            page: this.copyParticularPagination.page
        };
    }

    /**
     * Opens bulk entry dialog
     *
     * @memberof VoucherCreateComponent
     */
    public openBulkEntryDialog(): void {
        this.bulkStockAsideMenuRef = this.openDialogWithFocusManagement(() =>
            this.dialog.open(AddBulkItemsComponent, {
                data: {
                    voucherType: this.voucherType,
                    exchangeRate: this.invoiceForm.get("exchangeRate")?.value ?? 1,
                    highPrecisionRate: this.highPrecisionRate,
                    customerUniqueName: this.invoiceForm.get("account.uniqueName")?.value
                },
                disableClose: true
            })
        );

        this.bulkStockAsideMenuRef.afterClosed().pipe(take(1)).subscribe((response) => {
            if (response) {
                const entries = this.invoiceForm.get("entries") as FormArray;
                this.invoiceForm.get("entries")["controls"]?.forEach((control: any, entryIndex: number) => {
                    if (!control.get("transactions.0.account.uniqueName")?.value) {
                        entries.removeAt(entryIndex);
                    }
                });

                let index = entries?.length;

                response?.forEach((item) => {
                    if (item.additional?.stock) {
                        this.stockUnits[index] = observableOf(item.additional?.stock?.variant?.unitRates);

                        if (item.additional?.variants) {
                            this.stockVariants[index] = item.additional?.variants;
                        }
                    }

                    // Calculate rate with exchange rate conversion (multicurrency support)
                    const exchangeRateValue = this.invoiceForm.get("exchangeRate")?.value || 1;
                    const baseRate = Number(item.additional.stock?.rate) || 0;
                    const rateForAccount = giddhRoundOff(baseRate / exchangeRateValue, this.company.giddhBalanceDecimalPlaces);
                    const amountForAccount = giddhRoundOff(
                        Number(item.quantity) * rateForAccount,
                        this.company.giddhBalanceDecimalPlaces
                    );

                    let entry = {
                        hsnNumber: item.additional?.stock?.hsnNumber,
                        sacNumber: item.additional?.stock?.sacNumber,
                        showCodeType: item.additional?.stock?.hsnNumber ? "hsn" : "sac",
                        transactions: [
                            {
                                account: {
                                    name: item.additional?.label,
                                    uniqueName: item.additional?.uniqueName,
                                },
                                amount: {
                                    amountForAccount: amountForAccount,
                                    amountForCompany: giddhRoundOff(
                                        amountForAccount * exchangeRateValue,
                                        this.company.giddhBalanceDecimalPlaces
                                    ),
                                },
                                stock: {
                                    name: item.additional?.stock?.name,
                                    uniqueName: item.additional?.stock?.uniqueName,
                                    quantity: item.quantity,
                                    rate: {
                                        rateForAccount: rateForAccount,
                                        amountForAccount: rateForAccount,
                                    },
                                    stockUnit: {
                                        code: item.additional?.stock?.variant?.unitRates?.length
                                            ? item.additional?.stock?.variant?.unitRates[0].stockUnitCode
                                            : "",
                                        uniqueName: item.additional?.stock?.variant?.unitRates?.length
                                            ? item.additional?.stock?.variant?.unitRates[0].stockUnitUniqueName
                                            : "",
                                    },
                                    variant: {
                                        name: item.variantName,
                                        uniqueName: item.additional?.stock?.variant?.uniqueName,
                                        salesTaxInclusive: item.additional?.stock?.variant?.salesTaxInclusive,
                                        purchaseTaxInclusive: item.additional?.stock?.variant?.purchaseTaxInclusive,
                                    },
                                    sku: item.additional?.stock?.skuCode,
                                    skuCodeHeading: item.additional?.stock?.skuCodeHeading,
                                    customField1: {
                                        key: item.additional?.stock?.customField1Heading,
                                        value: item.additional?.stock?.customField1Value,
                                    },
                                    customField2: {
                                        key: item.additional?.stock?.customField2Heading,
                                        value: item.additional?.stock?.customField2Value,
                                    },
                                },
                            },
                        ],
                    };

                    this.invoiceForm.get("entries")["controls"].push(this.getEntriesFormGroup(entry));

                    let entryFormGroup = this.getEntryFormGroup(index);
                    let transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);

                    const discountsFormArray = entryFormGroup.get("discounts") as FormArray;
                    discountsFormArray.clear();
                    if (item.additional?.stock?.variant?.variantDiscount?.discounts) {
                        item.additional?.stock?.variant?.variantDiscount?.discounts?.forEach((selectedDiscount) => {
                            this.discountsList()?.forEach((discount) => {
                                if (discount?.uniqueName === selectedDiscount?.discount?.uniqueName) {
                                    discountsFormArray.push(this.getTransactionDiscountFormGroup(discount));
                                }
                            });
                        });
                    } else {
                        this.account.applicableDiscounts?.forEach((selectedDiscount) => {
                            this.discountsList()?.forEach((discount) => {
                                if (discount?.uniqueName === selectedDiscount?.uniqueName) {
                                    discountsFormArray.push(this.getTransactionDiscountFormGroup(discount));
                                }
                            });
                        });
                    }

                    const taxes = this.generalService.fetchTaxesOnPriority(
                        item.additional.stock?.taxes ?? [],
                        item.additional.stock?.groupTaxes ?? [],
                        item.additional.taxes ?? [],
                        item.additional.groupTaxes ?? []
                    );

                    const taxesFormArray = entryFormGroup.get("taxes") as FormArray;
                    taxesFormArray.clear();

                    const selectedTaxes = [];
                    let otherTax = null;
                    taxes?.forEach((selectedTax) => {
                        this.allCompanyTaxes?.forEach((tax) => {
                            if (tax.uniqueName === selectedTax) {
                                if (this.otherTaxTypes.includes(tax.taxType)) {
                                    otherTax = tax;
                                } else {
                                    selectedTaxes.push(tax);
                                }
                            }
                        });
                    });

                    selectedTaxes?.forEach((tax) => {
                        taxesFormArray.push(this.getTransactionTaxFormGroup(tax));
                    });

                    if (!otherTax && this.account?.applicableTaxes?.length) {
                        this.allCompanyTaxes?.forEach((tax) => {
                            if (
                                this.getApplicableOtherTaxes()[0]?.uniqueName === tax?.uniqueName &&
                                this.otherTaxTypes.includes(tax.taxType)
                            ) {
                                otherTax = tax;
                            }
                        });
                    }

                    if (otherTax) {
                        const selectedOtherTax = this.allCompanyTaxes?.filter(
                            (tax) => tax.uniqueName === otherTax.uniqueName
                        );
                        otherTax["taxDetail"] = selectedOtherTax[0].taxDetail;
                        otherTax["name"] = selectedOtherTax[0].name;
                        this.getSelectedOtherTax(index, otherTax, otherTax.calculationMethod);
                    }

                    if (
                        (item.additional.stock?.variant?.salesTaxInclusive && item.additional?.category === AccountCategoryEnum.INCOME) ||
                        (item.additional.stock?.variant?.purchaseTaxInclusive && item.additional?.category === AccountCategoryEnum.EXPENSE)
                    ) {
                        const amount = this.vouchersUtilityService.calculateInclusiveRate(
                            entryFormGroup?.value,
                            this.companyTaxes,
                            this.company.giddhBalanceDecimalPlaces
                        );
                        transactionFormGroup.get("amount.amountForAccount").patchValue(amount);
                        transactionFormGroup
                            .get("stock.rate.rateForAccount")
                            ?.patchValue(amount / transactionFormGroup.get("stock.quantity")?.value);
                    }

                    index++;
                });

                this.checkIfEntriesHasStock();
                this.activeEntryIndex = null;
                this.changeDetection.detectChanges();
            }
        });
    }

    public getApplicableOtherTaxes() : any[] {
        const accountApplicableTaxes = this.account?.applicableTaxes ?? [];
        const accountOtherApplicableTaxes = this.account?.otherApplicableTaxes ?? [];
        const applicableTaxesExcludingOtherTaxes = accountApplicableTaxes.filter(applicableTax =>
            !accountOtherApplicableTaxes.some(otherApplicableTax => (otherApplicableTax?.uniqueName ?? otherApplicableTax) === (applicableTax?.uniqueName ?? applicableTax))
        );
        const prioritizedApplicableTaxes = applicableTaxesExcludingOtherTaxes.length ? applicableTaxesExcludingOtherTaxes : accountOtherApplicableTaxes;
        return prioritizedApplicableTaxes;
    }

    /**
     * Opens other tax dialog
     *
     * @param entry
     * @param entryIndex
     * @memberof VoucherCreateComponent
     */
    public openOtherTaxDialog(entry: FormGroup, entryIndex: number): void {
        if (!entry.get("otherTax.isChecked")?.value) {
            const entryFormGroup = this.getEntryFormGroup(entryIndex);
            entryFormGroup.get("otherTax").reset();
            return;
        }
        this.storeFocus();

        this.otherTaxAsideMenuRef = this.dialog.open(OtherTaxComponent, {
            ...ASIDE_PANE_CONFIG,
            data: {
                entryIndex: entryIndex,
                appliedOtherTax: entry.get("otherTax")?.value,
            },
            autoFocus: false
        });

        this.otherTaxAsideMenuRef
            .afterClosed()
            .pipe(take(1))
            .subscribe((response) => {
                const entryFormGroup = this.getEntryFormGroup(entryIndex);
                if (response) {
                    if (response?.tax) {
                        this.getSelectedOtherTax(response.entryIndex, response.tax, response.calculationMethod);
                        this.restoreFocus();
                    } else {
                        const taxesFormArray = entryFormGroup.get("taxes") as FormArray;

                        for (let taxIndex = 0; taxIndex < taxesFormArray.length; taxIndex++) {
                            const taxFormGroup = taxesFormArray.at(taxIndex) as FormGroup;
                            if (
                                taxFormGroup.get("uniqueName")?.value ===
                                entryFormGroup.get("otherTax.uniqueName")?.value
                            ) {
                                taxesFormArray.removeAt(taxIndex);
                            }
                        }
                        entryFormGroup.get("otherTax").reset();
                        entryFormGroup.get("otherTax.isChecked")?.setValue(false);
                        this.focusOtherTaxCheckbox();
                        this.calculateReceiptPaymentAmount(entryFormGroup);
                    }
                } else {
                    if (entryFormGroup.get("otherTax.uniqueName")?.value) {
                        this.restoreFocus();
                    } else {
                        this.focusOtherTaxCheckbox();
                    }
                }
            });
    }

    /**
     * Focuses on the other tax checkbox element with a delay
     *
     * @memberof VoucherCreateComponent
     */
    private focusOtherTaxCheckbox(): void {
        setTimeout(() => {
            const checkboxElement = document.getElementById('otherTaxRef');
            if (checkboxElement) {
                const inputElement = checkboxElement.querySelector('input[type="checkbox"]');
                if (inputElement) {
                    (inputElement as HTMLElement).focus();
                }
            }
        }, 100);
    }

    /**
     * Updates the other tax in form control
     *
     * @param {number} entryIndex
     * @param {boolean} isUpdate
     * @param {*} tax
     * @param {SalesOtherTaxesCalculationMethodEnum} calculationMethod
     * @memberof VoucherCreateComponent
     */
    public getSelectedOtherTax(
        entryIndex: number,
        tax: any,
        calculationMethod: SalesOtherTaxesCalculationMethodEnum,
        isUpdate: boolean = false
    ): void {
        const entryFormGroup = this.getEntryFormGroup(entryIndex);
        const transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);
        let taxableValue = 0;

        if (!calculationMethod) {
            calculationMethod = SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount;
        }

        if (["tcsrc", "tcspay"].includes(tax?.taxType)) {
            if (calculationMethod === SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount) {
                taxableValue =
                    Number(transactionFormGroup.get("amount.amountForAccount")?.value) -
                    entryFormGroup.get("totalDiscount")?.value;
            } else if (calculationMethod === SalesOtherTaxesCalculationMethodEnum.OnTotalAmount) {
                let rawAmount =
                    Number(transactionFormGroup.get("amount.amountForAccount")?.value) -
                    entryFormGroup.get("totalDiscount")?.value;
                taxableValue =
                    rawAmount +
                    entryFormGroup.get("totalTaxWithoutCess")?.value +
                    entryFormGroup.get("totalCess")?.value;
            }
            entryFormGroup.get("otherTax.type").patchValue(this.otherTaxTypeEnum.TCS);
        } else {
            if (calculationMethod === SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount) {
                taxableValue =
                    Number(transactionFormGroup.get("amount.amountForAccount")?.value) -
                    entryFormGroup.get("totalDiscount")?.value;
            } else if (calculationMethod === SalesOtherTaxesCalculationMethodEnum.OnTotalAmount) {
                let rawAmount =
                    Number(transactionFormGroup.get("amount.amountForAccount")?.value) -
                    entryFormGroup.get("totalDiscount")?.value;
                taxableValue =
                    rawAmount +
                    entryFormGroup.get("totalTaxWithoutCess")?.value +
                    entryFormGroup.get("totalCess")?.value;
            }
            entryFormGroup.get("otherTax.type").patchValue(this.otherTaxTypeEnum.TDS);
        }

        entryFormGroup.get("otherTax.isChecked")?.patchValue(true);
        entryFormGroup.get("otherTax.name").patchValue(tax?.name);
        entryFormGroup.get("otherTax.uniqueName").patchValue(tax?.uniqueName);
        entryFormGroup.get("otherTax.taxType").patchValue(tax?.taxType);
        entryFormGroup.get("otherTax.taxValue").patchValue(tax?.taxDetail[0]?.taxValue);
        entryFormGroup.get("otherTax.taxDetail").patchValue(tax?.taxDetail);
        entryFormGroup
            .get("otherTax.amount")
            .patchValue(giddhRoundOff((taxableValue * tax?.taxDetail[0]?.taxValue) / 100, this.highPrecisionRate));

        entryFormGroup.get("otherTax.calculationMethod").patchValue(calculationMethod);
        this.calculateReceiptPaymentAmount(entryFormGroup, isUpdate);
        this.changeDetection.detectChanges();
    }

    /**
     * Finds parent group for new account create modal by voucher type
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    public getParentGroupForCreateAccount(): void {
        this.accountParentGroup = this.vouchersUtilityService.getParentGroupForAccountCreate(this.voucherType);
    }

    /**
     * Toggle's account create/update dialog
     *
     * @param {AccountType} accountType
     * @param {boolean} [createNewAccount=true]
     * @memberof VoucherCreateComponent
     */
    public toggleAccountAsidePane(accountType: AccountType, createNewAccount: boolean = true, customFocusElement?: any): void {
        if (this.accountAsideMenuRef) return;

        this.createNewAccount = createNewAccount;
        if (accountType === this.accountType.customer) {
            this.getParentGroupForCreateAccount();
        } else if (accountType === this.accountType.indirectExpense) {
            this.accountParentGroup = `${AccountingGroupEnum.IndirectExpenses}, ${AccountingGroupEnum.OtherIncome}`;
        } else {
            this.accountParentGroup = "bankaccounts";
        }

        // Store focus - if customFocusElement is provided, use its native element
        if (customFocusElement) {
            // Handle MatMenuTrigger reference - use _element property (confirmed working)
            if (customFocusElement._element && customFocusElement._element.nativeElement) {
                this.storeFocus(customFocusElement._element.nativeElement);
            }
            // Handle direct ElementRef
            else if (customFocusElement.nativeElement) {
                this.storeFocus(customFocusElement.nativeElement);
            }
            // Handle if it's already an HTMLElement
            else if (customFocusElement instanceof HTMLElement) {
                this.storeFocus(customFocusElement);
            }
            else {
                this.storeFocus();
            }
        } else {
            this.storeFocus();
        }

        this.accountAsideMenuRef = this.dialog.open(this.accountAsideMenu, ASIDE_PANE_CONFIG);

        this.accountAsideMenuRef
            .afterClosed()
            .pipe(take(1))
            .subscribe(() => {
                if (this.showPageLeaveConfirmation) {
                    this.pageLeaveUtilityService.addBrowserConfirmationDialog();
                }

                if (this.accountParentGroup === "bankaccounts") {
                    this.componentStore.getBriefAccounts({
                        currency: this.account?.baseCurrency + ", " + this.company.baseCurrency,
                        group: BriedAccountsGroup,
                    });
                }
                this.accountAsideMenuRef = null;
                this.restoreFocus();
            });
    }

    /**
     * Toggle's stock create dialog
     *
     * @param {*} [event]
     * @memberof VoucherCreateComponent
     */
    public toggleStockAsidePane(event?: any): void {
        if (event) {
            event.preventDefault();
        }
        this.storeFocus();

        this.productServiceAsideMenuRef = this.dialog.open(this.asideMenuProductService, {
            position: {
                right: "0",
                top: "0",
            },
            width: "760px",
            height: "100vh !important",
            disableClose: true,
        });

        this.productServiceAsideMenuRef
            .afterClosed()
            .pipe(take(1))
            .subscribe((response) => {
                setTimeout(() => {
                    if (this.showPageLeaveConfirmation) {
                        this.pageLeaveUtilityService.addBrowserConfirmationDialog();
                    }
                }, 100);
                this.restoreFocus();
            });
    }

    /**
     * This Function is used to close Aside Menu Sidebar
     *
     * @memberof VoucherCreateComponent
     */
    public closeAsideMenuProductServiceModal(): void {
        this.productServiceAsideMenuRef?.close();
    }

    /**
     * Callback for add new account
     *
     * @param {AddAccountRequest} item
     * @memberof VoucherCreateComponent
     */
    public addNewAccount(item: AddAccountRequest): void {
        this.store.dispatch(this.salesAction.addAccountDetailsForSales(item));
        if (item?.salesPersonCreated) {
            this.getSalesPersonList();
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
        if (item?.salesPersonCreated) {
            this.getSalesPersonList();
        }
    }

    /**
     * Callback after create/update account
     *
     * @private
     * @param {*} response
     * @memberof VoucherCreateComponent
     */
    private createUpdateAccountCallback(response: any, fetchStates: boolean = false): void {
        this.getParentGroupForCreateAccount();
        if (response.parentGroups?.some((group: any) => group.uniqueName === this.accountParentGroup)) {
            this.searchAccount();
            this.invoiceForm.controls["account"]?.get("uniqueName")?.patchValue(response?.uniqueName);
            this.invoiceForm.controls["account"]?.get("customerName")?.patchValue(response?.name);
            this.updateAccountDataInForm(response, fetchStates);
            this.fillDefaultAccountAddresses(response);
            this.fetchPreviousVouchers();
        } else {
            if (response.parentGroups?.some((group: any) => group.uniqueName === AccountingGroupEnum.IndirectExpenses || group.uniqueName === AccountingGroupEnum.OtherIncome)){
                this.searchAnnexureAccount("");
            }
        }
        this.accountAsideMenuRef?.close();
    }


    /**
    * Open and close discount dropdown
    * if isOpen is true it will open the dropdown
    * if isOpen is false it will close the dropdown
    *
    * @memberof NewLedgerEntryPanelComponent
    */
    public openAndCloseDiscountDropdown(isOpen: boolean = false): void {
        if (this.activeEntryIndex !== null && this.discountDropdowns) {
            const discountComponent = this.discountDropdowns.toArray()[this.activeEntryIndex];
            if (discountComponent) {
                discountComponent.toggleDiscountMenu(!isOpen);
            }
        }
    }

    /**
     * Shows create new discount dialog
     *
     * @memberof VoucherCreateComponent
     */
    public showCreateDiscountDialog(): void {
        this.storeFocus();
        this.discountDialogRef = this.dialog.open(CreateDiscountComponent, ASIDE_PANE_CONFIG);

        this.discountDialogRef.afterClosed().pipe(take(1)).subscribe((response) => {
            if (response) {
                this.getDiscountsList(() => {
                    this.openAndCloseDiscountDropdown(true);
                });
            } else {
                this.openAndCloseDiscountDropdown(true);
            }
        });
    }

    /**
     * Copies billing details in shipping details
     *
     * @param {*} event
     * @memberof VoucherCreateComponent
     */
    public copyBillingInShipping(entityType: string, event: any): void {
        if (entityType === "company") {
            this.copyCompanyBillingInShippingAddress = event?.checked;
        } else {
            this.copyAccountBillingInShippingAddress = event?.checked;
        }

        if (event?.checked) {
            let defaultAddress = {
                index: this.invoiceForm.controls[entityType]?.get("billingDetails").get("index")?.value || 0,
                address: this.invoiceForm.controls[entityType]?.get("billingDetails").get("address")?.value,
                pincode: this.invoiceForm.controls[entityType]?.get("billingDetails").get("pincode")?.value,
                gstNumber: this.invoiceForm.controls[entityType]?.get("billingDetails").get("taxNumber")?.value,
                state: {
                    name: this.invoiceForm.controls[entityType]?.get("billingDetails").get("state").get("name")?.value,
                    code: this.invoiceForm.controls[entityType]?.get("billingDetails").get("state").get("code")?.value,
                },
            };
            this.fillBillingShippingAddress(entityType, "shippingDetails", defaultAddress, defaultAddress.index);
        }
    }

    /**
     * Callback for state
     *
     * @param {string} addressType
     * @param {*} event
     * @memberof VoucherCreateComponent
     */
    public selectState(entity: string, addressType: string, event: any): void {
        this.invoiceForm.controls[entity]?.get(addressType).get("state").get("name").patchValue(event?.label);
    }

    /**
     * Toggle the RCM checkbox based on user confirmation
     *
     * @param {*} event Click event
     * @memberof VoucherCreateComponent
     */
    public toggleRcmCheckbox(event: any, element: string): void {
        // Store the checkbox element reference for focus management
        this.currentRcmCheckboxElement = event;

        let isChecked;
        if (element === "checkbox") {
            isChecked = event?.checked;
            this.rcmCheckbox["checked"] = !isChecked;
        } else {
            isChecked = !event?._checked;
        }

        this.rcmConfiguration = this.generalService.getRcmConfiguration(isChecked, this.commonLocaleData);

        const dialogRef = this.dialog.open(NewConfirmationModalComponent, {
            width: "630px",
            data: {
                configuration: this.rcmConfiguration,
            },
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe((response) => {
            document.querySelector("body").classList.remove("fixed");
            this.handleRcmChange(response);

            // Focus back on the RCM checkbox after dialog closes
            setTimeout(() => {
                if (this.currentRcmCheckboxElement && this.currentRcmCheckboxElement.focus) {
                    // Use MatCheckbox's built-in focus method
                    this.currentRcmCheckboxElement.focus();
                } else {
                    // Fallback: find the checkbox by selector and focus
                    const checkboxElement = document.querySelector('mat-checkbox#reverse-charge input');
                    if (checkboxElement) {
                        (checkboxElement as HTMLElement).focus();
                    } else {
                        // Last fallback: focus the mat-checkbox container
                        const matCheckboxContainer = document.querySelector('mat-checkbox#reverse-charge');
                        if (matCheckboxContainer) {
                            (matCheckboxContainer as HTMLElement).focus();
                        }
                    }
                }
            }, 150);
        });
        this.changeDetection.detectChanges();
    }

    /**
     * RCM change handler, triggerreed when the user performs any
     * action with the RCM popup
     *
     * @param {string} action Action performed by user
     * @memberof VoucherCreateComponent
     */
    public handleRcmChange(action: string): void {
        if (action === this.commonLocaleData?.app_yes) {
            // Toggle the state of RCM as user accepted the terms of RCM modal
            this.invoiceForm.get("isRcmEntry").patchValue(!this.invoiceForm.get("isRcmEntry")?.value);
            this.rcmCheckbox["checked"] = this.invoiceForm.get("isRcmEntry")?.value;
            this.checkRcm();
        }
    }

    /**
     * This will reset the state of checkbox and ngModel to make sure we update it based on user confirmation later
     *
     * @param {*} event
     * @memberof VoucherCreateComponent
     */
    public changeRcmCheckboxState(event: any): void {
        this.invoiceForm.get("isRcmEntry").patchValue(!this.invoiceForm.get("isRcmEntry")?.value);
        this.toggleRcmCheckbox(event, "checkbox");
    }

    /**
     * Removes the passport number if tourist scheme applicable checkbox toggled
     *
     * @memberof VoucherCreateComponent
     */
    public toggleTouristSchemeApplicable(): void {
        this.invoiceForm.get("passportNumber").patchValue("");
    }

    /**
     * Allows alphanumeric characters only in passport number field
     *
     * @memberof VoucherCreateComponent
     */
    public allowAlphanumericChar(): void {
        this.generalService.allowAlphanumericChar(this.invoiceForm.get("passportNumber")?.value);
    }

    /**
     * Returns entry form group
     *
     * @private
     * @param {number} index
     * @return {FormGroup}  {*}
     * @memberof VoucherCreateComponent
     */
    private getEntryFormGroup(index: number): FormGroup {
        const entriesArray = this.invoiceForm.get("entries") as FormArray;
        return entriesArray.at(index) as FormGroup;
    }

    /**
     * Returns transaction form group
     *
     * @private
     * @param {number} index
     * @return {FormGroup}  {*}
     * @memberof VoucherCreateComponent
     */
    private getTransactionFormGroup(entryFormGroup: FormGroup): FormGroup {
        const transactionsArray = entryFormGroup.get("transactions") as FormArray;
        return transactionsArray.at(0) as FormGroup;
    }

    /**
     * Updates entry key value
     *
     * @param {number} index
     * @param {string} field
     * @param {*} value
     * @memberof VoucherCreateComponent
     */
    public updateEntry(index: number, fields: any[]): void {
        const entryFormGroup = this.getEntryFormGroup(index);

        fields?.forEach((field) => {
            entryFormGroup?.get(field.key)?.patchValue(field.value);
        });
    }

    /**
     * Uploads attachment
     *
     * @memberof VoucherCreateComponent
     */
    public uploadFile(isOcr: boolean): void {
        const selectedFile: any = document.getElementById("invoiceFile");
        this.selectedFileName = "";
        if (selectedFile?.files?.length || isOcr) {
            let mimeType = null;
            let file = null;
            if (isOcr) {
                const fileExtention = this.aiOcrDetails?.fileExtention?.toLowerCase();
                if (FILE_ATTACHMENT_TYPE.IMAGE.includes(fileExtention)) {
                    mimeType = `image/${fileExtention}`;
                } else if (FILE_ATTACHMENT_TYPE.PDF.includes(fileExtention)) {
                    mimeType = 'application/pdf';
                }
                this.selectedFileName = this.aiOcrDetails?.fileName ? `${this.aiOcrDetails?.fileName}.${fileExtention}` : `${Date.now()}.${fileExtention}`;
                // Convert base64 to Blob/File and upload
                const blob = this.generalService.base64ToBlob(this.aiOcrDetails?.encodedData, mimeType, 512);
                file = new File([blob], this.selectedFileName, { type: mimeType });
            } else {
                file = selectedFile?.files[0];
            }

            this.generalService.getSelectedFile(file, (blob: any, file: any) => {
                this.isFileUploading = true;
                this.selectedFileName = file.name;
                this.commonService
                    .uploadFile({ file: blob, fileName: file.name })
                    .pipe(takeUntil(this.destroyed$))
                    .subscribe((response) => {
                        this.isFileUploading = false;
                        if (response?.status === "success") {
                            this.invoiceForm.get("attachedFiles")?.patchValue([response.body?.uniqueName]);
                            if (!this.ocrDataEnabled) {
                                this.toasterService.showSnackBar("success", this.localeData?.file_uploaded);
                                this.focusOnDeleteAttachment();
                            }
                        } else {
                            this.selectedFileName = "";
                            this.invoiceForm.get("attachedFiles")?.patchValue([]);
                            if (!this.ocrDataEnabled) {
                                this.toasterService.showSnackBar("error", response.message);
                            }
                        }
                        this.changeDetection.detectChanges();
                    });
            });
        }
    }

    /**
     * Focuses on delete attachment button
     *
     * @memberof VoucherCreateComponent
     */
    private focusOnDeleteAttachment(): void {
        setTimeout(() => {
            const deleteAttachmentButton = document.getElementById("deleteAttachment");
            if (deleteAttachmentButton) {
                deleteAttachmentButton?.focus();
            }
        }, 200);
    }

    /**
     * Shows confirmation modal to delete attachment
     *
     * @param {any} event
     * @memberof VoucherCreateComponent
     */
    public deleteAttachementConfirmation(event: any): void {
        let attachmentDeleteConfiguration = this.generalService.getAttachmentDeleteConfiguration(
            this.localeData,
            this.commonLocaleData
        );
        let dialogRef = this.dialog.open(NewConfirmationModalComponent, {
            width: "630px",
            data: {
                configuration: attachmentDeleteConfiguration,
            },
        });

        dialogRef
            .afterClosed()
            .pipe(take(1))
            .subscribe((response) => {
                if (response === this.commonLocaleData?.app_yes) {
                    this.componentStore.deleteAttachment(this.invoiceForm.get("attachedFiles")?.value[0]);
                    this.focusNextElement(event);
                } else {
                    this.dialog.closeAll();
                    this.focusOnDeleteAttachment();
                }
                this.changeDetection.detectChanges();
            });
    }

    /**
     * This will be use for create and send voucher
     *
     * @memberof VoucherCreateComponent
     */
    public createSendVoucher(): void {
        this.storeFocus();
        this.saveVoucher((voucher) => {
            this.voucherDetails = voucher?.body;
            this.emailDialogRef = this.dialog.open(this.sendEmailModal, {
                width: "650px",
            });
            this.emailDialogRef.afterClosed().subscribe(() => {
                this.customerVendorDropdownOpen();
            });
        });
    }

    /**
     * This will be use for create and print voucher
     *
     * @memberof VoucherCreateComponent
     */
    public createPrintVoucher(): void {
        this.storeFocus();
        this.saveVoucher((voucher) => {
            this.voucherDetails = voucher?.body;
            const dialogRef = this.dialog.open(this.printVoucherModal, {
                width: "60vw",
                height: "80vh",
            });
            dialogRef.afterClosed().subscribe(() => {
                this.customerVendorDropdownOpen();
            });
        });
    }

    /**
     * This will use for cancel email modal
     *
     * @memberof VoucherCreateComponent
     */
    public cancelEmailModal(): void {
        this.dialog.closeAll();
        this.restoreFocus();
    }

    /**
     * Callback for annexure date change
     *
     * @param {FormGroup} annexureCharge
     * @param {number} index
     * @memberof VoucherCreateComponent
     */
    public onBlurAnnexureDate(annexureCharge: FormGroup, index: number): void {
        if (typeof annexureCharge.get("date")?.value === "object") {
            annexureCharge.get("date")?.patchValue(dayjs(annexureCharge.get("date")?.value).format(GIDDH_DATE_FORMAT));
        }
        this.updatedAnnexureIndex = index;
        this.dateChangeType = "annexure";

        this.openDateChangeConfirmationDialog();
    }

    /**
     * Opens confirmation dialog for date change
     *
     * @memberof VoucherCreateComponent
     */
    private openDateChangeConfirmationDialog(): void {
        const entries = this.getEntries();
        if (entries?.length >= 1) {
            const dialogRef = this.openDialogWithFocusManagement(() =>
                this.dialog.open(NewConfirmationModalComponent, {
                    panelClass: "mat-dialog-sm",
                    data: {
                        configuration: this.generalService.deleteConfiguration(this.localeData?.change_all_entry_dates, this.commonLocaleData),
                    },
                })
            );

            dialogRef.afterClosed().subscribe((response) => {
                this.handleDateChangeConfirmation(response);
            });
        }
    }

    /**
     * Callback for entry date change
     *
     * @param {FormGroup} entry
     * @memberof VoucherCreateComponent
     */
    public onBlurEntryDate(entryFormGroup: FormGroup, updatedEntryIndex: number): void {
        if (typeof entryFormGroup.get("date")?.value === "object") {
            entryFormGroup.get("date")?.patchValue(dayjs(entryFormGroup.get("date")?.value).format(GIDDH_DATE_FORMAT));
        }
        this.updatedEntryIndex = updatedEntryIndex;
        this.dateChangeType = "entry";

        this.openDateChangeConfirmationDialog();
    }

    /**
     * Sets interaction type with timestamp protection
     *
     * @private
     * @param {InteractionType} type - Interaction type
     * @param {string} source - Source of the interaction for debugging
     * @memberof VoucherCreateComponent
     */
    private setInteractionType(type: InteractionType, source: string): void {
        const now = Date.now();
        const timeSinceLastInteraction = now - this.lastInteractionTimestamp;

        // If this is a keyboard interaction, always accept it (keyboard has priority)
        // If this is a mouse interaction, only accept it if enough time has passed or if the last interaction wasn't keyboard
        if (type === InteractionType.KEYBOARD || (type === InteractionType.MOUSE && (this.lastInteraction !== InteractionType.KEYBOARD || timeSinceLastInteraction > 500))) {
            this.lastInteraction = type;
            this.lastInteractionTimestamp = now;
        }
    }

    /**
     * Voucher date change callback
     *
     * @memberof VoucherCreateComponent
     */
    public onChangeVoucherDate(): void {
        if (this.isMultiCurrencyVoucher) {
            this.getExchangeRate(
                this.account.baseCurrency,
                this.company.baseCurrency,
                this.invoiceForm.get("date")?.value
            );
        }

        this.isVoucherDateChanged = true;
        if (
            !this.invoiceType.isCashInvoice &&
            (this.invoiceType.isSalesInvoice ||
                this.invoiceType.isPurchaseInvoice ||
                this.invoiceType.isCreditNote ||
                this.invoiceType.isDebitNote)
        ) {
            this.getAllVouchersForAdjustment();
            this.getVoucherListForCreditDebitNote();
        }

        if (this.invoiceType.isReceiptInvoice || this.invoiceType.isPaymentInvoice) {
            this.getAllVouchersForAdjustment();
        }

        this.dateChangeType = "voucher";
        if (!(this.invoiceType.isEstimateInvoice || this.invoiceType.isProformaInvoice || this.invoiceType.isPurchaseOrder)) {
            const dialogRef = this.dialog.open(NewConfirmationModalComponent, {
                panelClass: "mat-dialog-sm",
                data: {
                    configuration: this.generalService.deleteConfiguration(this.localeData?.change_single_entry_date, this.commonLocaleData),
                },
            });
            dialogRef.afterClosed().subscribe((response) => {
                this.handleDateChangeConfirmation(response);
                // Conditional focus based on last interaction type
                this.ngZone.runOutsideAngular(() => {
                    setTimeout(() => {
                        this.ngZone.run(() => {
                            if (this.voucherDatePicker) {
                                if (this.lastInteraction === InteractionType.KEYBOARD) {
                                    // Keyboard interaction - move to next element
                                    this.voucherDatePicker.focus();

                                    setTimeout(() => {
                                        const datePickerInput = this.voucherDatePicker.dateInput?.nativeElement;
                                        if (datePickerInput) {
                                            const enterEvent = new KeyboardEvent('keydown', {
                                                key: 'Enter',
                                                code: 'Enter',
                                                keyCode: 13,
                                                which: 13,
                                                bubbles: true,
                                                cancelable: true
                                            });
                                            datePickerInput.dispatchEvent(enterEvent);
                                        }
                                    }, 100);
                                } else {
                                    // Mouse or programmatic interaction - stay on datepicker
                                    this.voucherDatePicker.focus();
                                }
                            }
                        });
                    });
                });
            });
        }

    }

    /**
     * This will handle date change modal confirmation
     *
     * @param {string} action
     * @memberof VoucherCreateComponent
     */
    public handleDateChangeConfirmation(action: string): void {
        if (action === this.commonLocaleData?.app_yes) {
            if (this.dateChangeType === "voucher") {
                this.invoiceForm?.get("entries")["controls"]?.forEach((entry) => {
                    entry.get("date")?.patchValue(dayjs(this.invoiceForm.get("date")?.value).format(GIDDH_DATE_FORMAT));
                });
                const annexureCharges = this.annexureChargesArray;
                const voucherDateValue = dayjs(this.invoiceForm.get("date")?.value).format(GIDDH_DATE_FORMAT);
                    annexureCharges.controls?.forEach((annexureCharge) => {
                    annexureCharge.get("date")?.setValue(voucherDateValue);
                });
                if (this.queryParams.page) {
                    let voucherDate = this.invoiceForm?.get("date")?.value;
                    if (typeof voucherDate === "object") {
                        voucherDate = dayjs(voucherDate).format(GIDDH_DATE_FORMAT);
                    }
                    this.queryParams.page = 1;
                    this.queryParams.to = voucherDate;
                    this.queryParams.from = voucherDate;
                }
            } else if (this.dateChangeType === "entry") {
                let entryFormGroup = this.getEntryFormGroup(this.updatedEntryIndex);
                let entryDateValue = entryFormGroup.get("date")?.value;

                this.invoiceForm?.get("entries")["controls"]?.forEach((entry, entryLoop) => {
                    if (entryLoop !== this.updatedEntryIndex) {
                        let currentEntryFormGroup = this.getEntryFormGroup(entryLoop);
                        currentEntryFormGroup.get("date")?.patchValue(entryDateValue);
                    }
                });

                let annexureCharges = this.annexureChargesArray;
                annexureCharges.controls?.forEach((annexureCharge) => {
                    annexureCharge.get("date")?.patchValue(entryDateValue);
                });
            } else if (this.dateChangeType === "annexure") {
                const annexureCharges = this.annexureChargesArray;
                const updatedAnnexure = annexureCharges.at(this.updatedAnnexureIndex);
                const annexureDateValue = updatedAnnexure?.get("date")?.value;

                annexureCharges.controls?.forEach((annexureCharge, annexureLoop) => {
                    if (annexureLoop !== this.updatedAnnexureIndex) {
                        annexureCharge.get("date")?.patchValue(annexureDateValue);
                    }
                });

                this.invoiceForm?.get("entries")["controls"]?.forEach((entry, entryLoop) => {
                    let currentEntryFormGroup = this.getEntryFormGroup(entryLoop);
                    currentEntryFormGroup.get("date")?.patchValue(annexureDateValue);
                });
            }
            this.changeDetection.detectChanges();
        }

        this.dialog.closeAll();
    }

    /**
     * Updated hsn/sac before edit
     *
     * @memberof VoucherCreateComponent
     */
    public updateCurrentHsnSac(entry: FormGroup): void {
        this.currentHsnSac = {
            hsnNumber: entry.get("hsnNumber")?.value,
            sacNumber: entry.get("sacNumber")?.value,
        };
    }

    /**
     * Updates previous hsn/sac
     *
     * @param {FormGroup} entry
     * @memberof VoucherCreateComponent
     */
    public cancelHsnSacEdit(entry: FormGroup): void {
        entry.get("hsnNumber")?.patchValue(this.currentHsnSac.hsnNumber);
        entry.get("sacNumber")?.patchValue(this.currentHsnSac.sacNumber);
    }

    /**
     * Handles HSN/SAC menu closed event and resets values if closed by escape
     *
     * @param {MenuCloseReason} reason - The reason the menu was closed
     * @param {FormGroup} entry - The form group entry
     * @memberof VoucherCreateComponent
     */
    public handleHsnSacMenuClosed(reason: MenuCloseReason, entry: FormGroup): void {
        // Focus to description field after closing HSN/SAC menu
        setTimeout(() => {
            if (this.lastInteraction === InteractionType.KEYBOARD && this.inputDescription?.nativeElement) {
                this.inputDescription.nativeElement.focus();
            }
        }, 150);

        if (!reason) return;
        const isClosedByEscape = reason === 'keydown';
        if (isClosedByEscape) {
            // Reset to saved values when closed by escape key
            this.cancelHsnSacEdit(entry);
        }
    }

    /**
     * Add new deposit row
     *
     * @param {boolean} activeDropdown = false
     * @memberof VoucherCreateComponent
     */
    public addNewDepositRow(activeDropdown: boolean = false): void {
        this.invoiceForm.get("deposits")["controls"].push(this.getDepositFormGroup());
        if (activeDropdown) {
            this.activeDepositIndex = this.invoiceForm.get("deposits")["controls"].length - 1;
        }
    }

    /**
     * Adds new line entry
     *
     * @memberof VoucherCreateComponent
     */
    public addNewLineEntry(setActiveIndex: boolean = true): void {
        this.invoiceForm.get("entries")["controls"].push(this.getEntriesFormGroup());
        if (setActiveIndex) {
            const entries = this.invoiceForm.get("entries") as FormArray;
            setTimeout(() => {
                this.activeEntryIndex = entries?.length - 1;
                this.changeDetection.detectChanges();
            }, 10);
        }
    }
    /**
     * Remove deposit row
     *
     * @param {number} entryIndex
     * @memberof VoucherCreateComponent
     */
    public deleteDepositRow(entryIndex: number): void {
        const deposits = this.invoiceForm.get("deposits") as FormArray;
        if (deposits?.length === 1) {
            deposits.reset();
            this.calculateBalanceDue();
            this.activeDepositIndex = null;
            setTimeout(() => {
                this.activeDepositIndex = 0;
            }, 50);
            return;
        } else if (this.lastInteraction === InteractionType.KEYBOARD && deposits?.length > 1 && this.addNewDeposit.nativeElement) {
            setTimeout(() => {
                this.addNewDeposit.nativeElement.focus();
            }, 100);
        }
        deposits.removeAt(entryIndex);
        this.calculateBalanceDue();
    }
    /**
     * Removes line entry
     *
     * @param {number} entryIndex
     * @memberof VoucherCreateComponent
     */
    public deleteLineEntry(entryIndex: number): void {
        const entries = this.invoiceForm.get("entries") as FormArray;
        entries.removeAt(entryIndex);
        // Re-index per-row state so it stays aligned with the FormArray after removal
        this.stockVariants.splice(entryIndex, 1);
        this.stockUnits.splice(entryIndex, 1);
        this.reindexStockSearchRequestByEntry(entryIndex);
        if (!entries?.length) {
            this.addNewLineEntry();
        }
        this.checkIfEntriesHasStock();
        this.calculateVoucherTotals();
        if (this.lastInteraction === InteractionType.KEYBOARD && entries.length >= 1 && this.addNewParticular.nativeElement) {
            setTimeout(() => {
                this.addNewParticular.nativeElement.focus();
            }, 100);
        }
    }

    /**
     * Gets the annexure charges FormArray
     *
     * @return {*}  {FormArray}
     * @memberof VoucherCreateComponent
     */
    public get annexureChargesArray(): FormArray {
        return this.invoiceForm.get("annexureCharges") as FormArray;
    }

    /**
     * Searches for annexure accounts based on search term and page number
     *
     * @param {string} searchTerm
     * @param {number} pageNumber
     * @memberof VoucherCreateComponent
     */
    public searchAnnexureAccount(searchTerm: string, pageNumber: number = 1): void {
        
        if (this.annexureAccountSearchRequest?.isLoading) {
            return;
        }

        let accountSearchRequest = this.vouchersUtilityService.getSearchRequestObject(
            this.voucherType,
            searchTerm,
            pageNumber,
            SearchType.CUSTOMER
        );
        accountSearchRequest.group = `${AccountingGroupEnum.IndirectExpenses}, ${AccountingGroupEnum.OtherIncome}`;
        accountSearchRequest.q = searchTerm;
        this.annexureAccountSearchRequest = cloneDeep(accountSearchRequest);
        this.annexureAccountSearchRequest.isLoading = true;

        this.searchService
            .searchAccountV3(accountSearchRequest)
            .pipe(takeUntil(this.destroyed$))
            .subscribe((response) => {
                if (response?.body?.results?.length) {
                    this.annexureAccountSearchRequest.loadMore = true;
                    let annexureResults = [];
                    if (pageNumber > 1) {
                        annexureResults = this.indirectExpensesLedgers;
                    }
                    const newResults = response?.body?.results?.map((res: any) => {
                        return { label: res.name, value: res.uniqueName, additional: res };
                    });
                    this.indirectExpensesLedgers = annexureResults.concat(...newResults);
                } else {
                    this.annexureAccountSearchRequest.loadMore = false;
                    if (pageNumber === 1) {
                        this.indirectExpensesLedgers = [];
                    }
                }
                this.annexureAccountSearchRequest.isLoading = false;
            });
    }

    /**
     * Handles scroll end event for annexure account dropdown pagination
     *
     * @memberof VoucherCreateComponent
     */
    public handleSearchAnnexureAccountScrollEnd(): void {
        if (this.annexureAccountSearchRequest?.loadMore) {
            let page = this.annexureAccountSearchRequest.page + 1;
            this.searchAnnexureAccount(this.annexureAccountSearchRequest.q, page);
        }
    }

    /**
     * Adds a new annexure charge row
     *
     * @memberof VoucherCreateComponent
     */
    public addAnnexureCharge(activeDropdown: boolean = false): void {
        const annexureCharges = this.annexureChargesArray;
        annexureCharges.push(this.getAnnexureChargeFormGroup());
        if (activeDropdown) {
            this.activeAnnexureIndex = annexureCharges.length - 1;
        }
    }

    /**
     * Removes an annexure charge row
     *
     * @param {number} index
     * @memberof VoucherCreateComponent
     */
    public removeAnnexureCharge(index: number): void {
        const annexureCharges = this.annexureChargesArray;
        
        if (annexureCharges.length > 1) {
            annexureCharges.removeAt(index);
        } else {
            annexureCharges.at(index).reset({
                date: this.invoiceForm?.get('date')?.value || "",
                voucherType: this.voucherType,
                calculateAmount: true,
                entryClass: "ANNEXURE",
                taxes: [],
                totalTaxWithoutCess: 0,
                totalCess: 0,
                total: {
                    amountForAccount: 0,
                    amountForCompany: 0
                },
                transactions: [
                    {
                        account: {
                            name: "",
                            uniqueName: ""
                        },
                        amount: {
                            amountForAccount: 0,
                            amountForCompany: 0
                        }
                    }
                ]
            });
        }
        
        this.calculateVoucherTotals();
    }

    /**
     * Handles annexure account selection change
     *
     * @param {number} index
     * @param {*} event
     * @memberof VoucherCreateComponent
     */
    public onAnnexureAccountChange(index: number, event: any): void {
        const annexureCharges = this.annexureChargesArray;
        const annexureCharge = annexureCharges.at(index);
        this.activeAnnexureIndex = null;
        
        if (event && event.name) {
            annexureCharge.get("transactions.0.account.name")?.patchValue(event.label);
        }
    }

    /**
     * Calculates tax amount for annexure charge
     *
     * @param {number} index
     * @memberof VoucherCreateComponent
     */
    public calculateAnnexureChargeTax(index: number, amountInclusive: boolean, taxes?: any): void {
        const annexureCharges = this.annexureChargesArray;
        const annexureCharge = annexureCharges.at(index);

        if (!annexureCharge) {
            return;
        }

        let amount = Number(annexureCharge.get("transactions.0.amount.amountForAccount")?.value) || 0;

        if (taxes && taxes.length > 0) {
            const taxesFormArray = annexureCharge.get("taxes") as FormArray;
            taxesFormArray.clear();
            let totalTaxWithoutCess: number = 0;
            let cessPercentage: number = 0;

            taxes.forEach((tax: any) => {
                if (tax.taxType === TaxCollectionDeductionType.GST_CESS) {
                    cessPercentage += tax?.taxDetail?.[0]?.taxValue;
                } else {
                    totalTaxWithoutCess += tax?.taxDetail?.[0]?.taxValue;
                }
                taxesFormArray.push(this.getTransactionTaxFormGroup(tax));
            });

            if (amountInclusive) {
                let entryTotal = annexureCharge.get("total.amountForAccount")?.value;
                amount = giddhRoundOff((entryTotal / (1 + 0.01 * Number(cessPercentage + totalTaxWithoutCess))), this.company.giddhBalanceDecimalPlaces);
                annexureCharge.get("transactions.0.amount.amountForAccount").patchValue(amount);
            }

            annexureCharge
                .get("totalTaxWithoutCess")
                ?.patchValue(
                    giddhRoundOff(
                        (totalTaxWithoutCess * annexureCharge.get("transactions.0.amount.amountForAccount")?.value) / 100,
                        this.company.giddhBalanceDecimalPlaces
                    )
                );
            annexureCharge
                .get("totalCess")
                ?.patchValue(
                    giddhRoundOff(
                        (cessPercentage * annexureCharge.get("transactions.0.amount.amountForAccount")?.value) / 100,
                        this.company.giddhBalanceDecimalPlaces
                    )
                );
        } else {
            annexureCharge.get("taxes").reset();
            annexureCharge.get("taxAmount")?.patchValue(0);
            annexureCharge.get("totalTaxWithoutCess")?.patchValue(0);
            annexureCharge.get("totalCess")?.patchValue(0);
            if (amountInclusive) {
                const total = annexureCharge.get("total.amountForAccount").value;
                annexureCharge.get("transactions.0.amount.amountForAccount").patchValue(Number(total));
            } else {
                annexureCharge.get("total.amountForAccount")?.patchValue(amount);
            }
        }

        this.calculateVoucherTotals();
    }

    /**
     * Updates annexure tax amount from common-tax component
     *
     * @param {number} taxAmount - Total tax amount
     * @param {number} index - Index of the annexure charge
     * @memberof VoucherCreateComponent
     */
    public updateAnnexureTaxAmount(taxAmount: number, index: number): void {
        const annexureCharges = this.annexureChargesArray;
        const annexureCharge = annexureCharges.at(index);

        if (annexureCharge) {
            annexureCharge.get("taxAmount")?.patchValue(taxAmount);
            const amount = Number(annexureCharge.get("transactions.0.amount.amountForAccount")?.value) || 0;
            const totalAmount = amount + taxAmount;
            annexureCharge.get("total.amountForAccount")?.patchValue(giddhRoundOff(totalAmount, this.company.giddhBalanceDecimalPlaces));
            this.calculateVoucherTotals();
        }
    }

    /**
     * Re-indexes the stockSearchRequestByEntry Map after a row at removedIndex is deleted.
     * Removes the entry for removedIndex and shifts every higher key down by 1 so the
     * cached search results stay aligned with the FormArray row indices.
     *
     * @private
     * @param {number} removedIndex Index of the row that was just removed
     * @memberof VoucherCreateComponent
     */
    private reindexStockSearchRequestByEntry(removedIndex: number): void {
        if (this.stockSearchRequestByEntry?.size <= 1) {
            if (this.activeEntryIndex === 0) {
                this.searchStock('', 1, 0);
            }
            return;
        }
        const sortedKeys = Array.from(this.stockSearchRequestByEntry.keys()).sort((a, b) => a - b);
        const reindexed: Map<number, any> = new Map();
        for (const key of sortedKeys) {
            if (key < removedIndex) {
                reindexed.set(key, this.stockSearchRequestByEntry.get(key));
            } else if (key > removedIndex) {
                reindexed.set(key - 1, this.stockSearchRequestByEntry.get(key));
            }
        }
        this.stockSearchRequestByEntry = reindexed;
    }

    /**
     * Handles outside click from entry table
     *
     * @param {*} event
     * @memberof VoucherCreateComponent
     */
    public handleOutsideClick(event: any): void {
        const activeTaxComponent = this.activeEntryIndex !== null && this.commonTaxControll 
            ? this.commonTaxControll.toArray()[this.activeEntryIndex] 
            : null;

        if (
            typeof event?.target?.className === "string" &&
            event?.target?.className?.indexOf("option") === -1 &&
            event?.target?.className?.indexOf("cdk-overlay-backdrop") === -1 &&
            event?.currentTarget?.activeElement?.className?.indexOf("select-field-input") === -1 &&
            !this.dialog.getDialogById(this.otherTaxAsideMenuRef?.id) &&
            !this.dialog.getDialogById(this.bulkStockAsideMenuRef?.id) &&
            !this.dialog.getDialogById(this.accountAsideMenuRef?.id) &&
            !activeTaxComponent?.isTaxDialogOpen &&
            !this.dialog.getDialogById(this.productServiceAsideMenuRef?.id) &&
            !this.dialog.getDialogById(this.discountDialogRef?.id)
        ) {
            this.activeEntryIndex = null;
        }
    }

    /**
     * Selected discount callback
     *
     * @param {number} entryIndex
     * @param {*} [discounts]
     * @memberof VoucherCreateComponent
     */
    public getSelectedDiscounts(entryIndex: number, discounts?: any): void {
        const entryFormGroup = this.getEntryFormGroup(entryIndex);
        const discountsFormArray = entryFormGroup.get("discounts") as FormArray;
        discountsFormArray.clear();
        if (discounts?.length) {
            discounts.forEach((discount) => {
                discountsFormArray.push(this.getTransactionDiscountFormGroup(discount));
            });
        }
    }

    /**
     * Discount total amount callback
     *
     * @param {*} totalDiscount
     * @param {FormGroup} entry
     * @memberof VoucherCreateComponent
     */
    public updateTotalDiscount(totalDiscount: any, entry: FormGroup, isActiveEntry: boolean): void {
        entry.get("totalDiscount").patchValue(totalDiscount);
        this.calculateOtherTaxAmount(entry, isActiveEntry);
    }

    /**
     * Calculate other tax amount based on taxable value
     *
     * @private
     * @param {FormGroup} entry
     * @param {boolean} isActiveEntry
     * @memberof VoucherCreateComponent
     */
    private calculateOtherTaxAmount(entry: FormGroup, isActiveEntry: boolean): void {
        let taxableValue = 0;
        if (!entry.get("otherTax").value || !entry.get("transactions").value[0]?.amount?.amountForAccount || isActiveEntry) {
            return;
        }
        const amountForAccount = Number(entry.get("transactions").value[0].amount.amountForAccount);
        const totalDiscount = Number(entry.get("totalDiscount").value);

        if (entry.get("otherTax").value?.calculationMethod === SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount) {
            taxableValue = amountForAccount - totalDiscount;
        } else {
            taxableValue = amountForAccount - totalDiscount + entry.get("totalTaxWithoutCess").value + entry.get("totalCess").value;
        }
        const amount = giddhRoundOff(((taxableValue * entry.get("otherTax").value?.taxValue) / 100), HIGH_RATE_FIELD_PRECISION);
        entry.get("otherTax.amount").patchValue(amount);
    }

    /**
     * Selected taxes callback
     *
     * @param {number} entryIndex
     * @param {*} [taxes]
     * @param {*} [amountCalculate]
     * @memberof VoucherCreateComponent
     */
    public getSelectedTaxes(entryIndex: number, taxes?: any, amountCalculate = true): void {
        const entryFormGroup = this.getEntryFormGroup(entryIndex);
        const taxesFormArray = entryFormGroup.get("taxes") as FormArray;

        taxesFormArray.clear();
        let totalTaxWithoutCess: number = 0;
        let cessPercentage: number = 0;

        taxes?.forEach((tax) => {
            if (tax.taxType === TaxCollectionDeductionType.GST_CESS) {
                cessPercentage += tax?.taxDetail?.[0]?.taxValue;
            } else {
                totalTaxWithoutCess += tax?.taxDetail?.[0]?.taxValue;
            }

            taxesFormArray.push(this.getTransactionTaxFormGroup(tax));
        });

        if (this.invoiceType.isReceiptInvoice || this.invoiceType.isPaymentInvoice) {
            entryFormGroup.get("totalTaxWithoutCess")?.patchValue(giddhRoundOff(totalTaxWithoutCess));
            entryFormGroup.get("totalCess")?.patchValue(giddhRoundOff(cessPercentage));

            if (this.invoiceForm.get("isAdvanceReceipt").value && amountCalculate) {
                const transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);
                const amount = this.vouchersUtilityService.calculateInclusiveRate(
                    entryFormGroup?.value,
                    this.companyTaxes,
                    this.company.giddhBalanceDecimalPlaces,
                    Number(entryFormGroup.get("total.amountForAccount")?.value)
                );
                transactionFormGroup.get("amount.amountForAccount").patchValue(amount);
            }
        }

        this.calculateTotalTax();
        this.calculateOtherTaxAmount(entryFormGroup, false);
    }

    /**
     * Calculates total tax
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private calculateTotalTax(): void {
        let taxPercentage: number = 0;
        let cessPercentage: number = 0;

        const entriesArray = this.invoiceForm.get("entries") as FormArray;
        for (let entryIndex = 0; entryIndex < entriesArray.length; entryIndex++) {
            taxPercentage = 0;
            cessPercentage = 0;

            const entryFormGroup = this.getEntryFormGroup(entryIndex);
            const transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);
            const taxesFormArray = entryFormGroup.get("taxes") as FormArray;

            for (let taxIndex = 0; taxIndex < taxesFormArray.length; taxIndex++) {
                const taxFormGroup = taxesFormArray.at(taxIndex) as FormGroup;
                const taxDetailArray = taxFormGroup.get("taxDetail") as FormArray;

                if (taxFormGroup.get("taxType")?.value === TaxCollectionDeductionType.GST_CESS) {
                    cessPercentage += taxDetailArray.at(0)?.get("taxValue")?.value ?? 0;
                } else {
                    taxPercentage += taxDetailArray.at(0)?.get("taxValue")?.value ?? 0;
                }
            }

            entryFormGroup
                .get("totalTaxWithoutCess")
                ?.patchValue(
                    giddhRoundOff(
                        (taxPercentage *
                            (transactionFormGroup.get("amount.amountForAccount")?.value -
                                entryFormGroup.get("totalDiscount")?.value)) /
                        100,
                        this.company.giddhBalanceDecimalPlaces
                    )
                );
            entryFormGroup
                .get("totalCess")
                ?.patchValue(
                    giddhRoundOff(
                        (cessPercentage *
                            (transactionFormGroup.get("amount.amountForAccount")?.value -
                                entryFormGroup.get("totalDiscount")?.value)) /
                        100,
                        this.company.giddhBalanceDecimalPlaces
                    )
                );

            if (isNaN(entryFormGroup.get("totalTaxWithoutCess")?.value)) {
                entryFormGroup.get("totalTaxWithoutCess")?.patchValue(0);
            }

            if (isNaN(entryFormGroup.get("totalCess")?.value)) {
                entryFormGroup.get("totalCess")?.patchValue(0);
            }
        }
    }

    /**
     * Tax total amount callback
     *
     * @param {*} totalTax
     * @param {FormGroup} entry
     * @memberof VoucherCreateComponent
     */
    public updateTotalTax(totalTax: any, entryFormGroup: FormGroup): void {
        entryFormGroup.get("totalTax").patchValue(totalTax);
    }

    /**
     * Copies invoice
     *
     * @param {PreviousInvoicesVm} item
     * @memberof VoucherCreateComponent
     */
    public copyInvoice(item: PreviousInvoicesVm): void {
        this.startLoader(true);
        this.invoiceForm.get("voucherUniqueName")?.patchValue(item?.uniqueName);
        this.componentStore.getVoucherDetails({
            isCopyVoucher: true,
            accountUniqueName: item.account?.uniqueName,
            payload: { uniqueName: item?.uniqueName, voucherType: this.voucherType },
        });
    }

    /**
     * Opens the recent vouchers aside pane showing company and account voucher lists.
     *
     * @memberof VoucherCreateComponent
     */
    public openRecentVouchersPane(): void {
        this.recentVouchersAsideRef = this.dialog.open(this.recentVouchersTemplate, {
            ...ASIDE_PANE_CONFIG
        });
        this.recentVouchersAsideRef.afterClosed().pipe(take(1)).subscribe(() => {
            this.focusOnCopyPreviousBtn();
        });
    }

    /**
     * Triggers PDF download for the given voucher and opens the preview dialog.
     *
     * @param {LastInvoices} voucher - Voucher to preview
     * @memberof VoucherCreateComponent
     */
    public openVoucherPdfPreview(voucher: LastInvoices): void {
        this.selectedPdfVoucherNumber.set(voucher?.voucherNumber ?? '');
        this.previewPdfUrl.set(null);
        this.componentStore.downloadVoucherPdf({
            model: {
                voucherType: this.voucherType,
                uniqueName: voucher?.uniqueName
            },
            type: 'ALL',
            fileType: 'base64',
            voucherType: this.voucherType,
            isDownloadFromDialog: true
        });
        const dialogRef = this.dialog.open(this.voucherPdfPreviewTemplate, {
            width: '60vw',
            maxWidth: '90vw',
            height: '90vh',
            maxHeight: '90vh'
        });
        dialogRef.afterClosed().pipe(take(1)).subscribe(() => {
            const container = (this.recentVouchersAsideRef as any)?._containerInstance?._elementRef?.nativeElement as HTMLElement | undefined;
            (container?.querySelector('button[aria-label="close"]') as HTMLElement | null)?.focus();
        });
    }

    /**
     * Opens the PDF preview for a voucher from the copy particular dialog.
     * After preview closes, focus returns to the copy particular dialog.
     *
     * @param {*} item - Stock history item from the copy particular dialog
     * @memberof VoucherCreateComponent
     */
    public openCopyParticularVoucherPreview(item: any): void {
        if (!item?.voucherUniqueName) {
            return;
        }

        const previewVoucherType = this.getCopyParticularPreviewVoucherType(item);
        const previewRequest = this.getCopyParticularPreviewRequest(item, previewVoucherType);

        if (!previewRequest) {
            return;
        }

        this.selectedPdfVoucherNumber.set(item?.voucherNumber ?? '');
        this.previewPdfUrl.set(null);
        this.componentStore.downloadVoucherPdf({
            model: previewRequest,
            type: 'ALL',
            fileType: 'base64',
            voucherType: previewVoucherType,
            isDownloadFromDialog: true
        });
        const dialogRef = this.dialog.open(this.voucherPdfPreviewTemplate, {
            width: '60vw',
            maxWidth: '90vw',
            height: '90vh',
            maxHeight: '90vh'
        });
        dialogRef.afterClosed().pipe(take(1)).subscribe(() => {
            const container = (this.copyParticularDialogRef as any)?._containerInstance?._elementRef?.nativeElement as HTMLElement | undefined;
            (container?.querySelector('.dialog-header button[mat-icon-button]') as HTMLElement | null)?.focus();
        });
    }

    /**
     * Returns normalized voucher type for copy particular preview API.
     *
     * @private
     * @param {*} item
     * @returns {string}
     * @memberof VoucherCreateComponent
     */
    private getCopyParticularPreviewVoucherType(item: any): string {
        const voucherType = item?.voucherType || this.voucherType;

        if (voucherType === VoucherTypeEnum.purchase_order || voucherType === VoucherTypeEnum.purchaseOrder) {
            return VoucherTypeEnum.purchaseOrder;
        } else if (voucherType === VoucherTypeEnum.estimate || voucherType === VoucherTypeEnum.estimates || voucherType === VoucherTypeEnum.generateEstimate) {
            return VoucherTypeEnum.generateEstimate;
        } else if (voucherType === VoucherTypeEnum.proforma || voucherType === VoucherTypeEnum.proformas || voucherType === VoucherTypeEnum.generateProforma) {
            return VoucherTypeEnum.generateProforma;
        }

        return voucherType;
    }

    /**
     * Builds preview request payload for copy particular preview API based on voucher type.
     *
     * @private
     * @param {*} item
     * @param {string} voucherType
     * @returns {*}
     * @memberof VoucherCreateComponent
     */
    private getCopyParticularPreviewRequest(item: any, voucherType: string): any {
        if ([VoucherTypeEnum.sales, VoucherTypeEnum.creditNote, VoucherTypeEnum.debitNote, VoucherTypeEnum.purchase, VoucherTypeEnum.payment, VoucherTypeEnum.receipt].includes(voucherType as VoucherTypeEnum)) {
            return {
                voucherType,
                uniqueName: item?.voucherUniqueName
            };
        } else if ([VoucherTypeEnum.generateProforma, VoucherTypeEnum.generateEstimate].includes(voucherType as VoucherTypeEnum)) {
            const request = new ProformaDownloadRequest();
            request.fileType = "base64";
            request.accountUniqueName = item?.accountUniqueName;

            if (voucherType === VoucherTypeEnum.generateProforma) {
                request.proformaNumber = item?.voucherNumber;
            } else {
                request.estimateNumber = item?.voucherNumber;
            }

            return request;
        } else if (voucherType === VoucherTypeEnum.purchaseOrder) {
            return {
                accountUniqueName: item?.accountUniqueName,
                poUniqueName: item?.voucherUniqueName
            };
        }

        return null;
    }

    /**
     * Handles the PDF response for the inline voucher preview dialog.
     * Converts base64 data to a blob URL and sets it as the sanitized iframe src.
     *
     * @private
     * @param {*} response - API response containing base64 PDF data
     * @memberof VoucherCreateComponent
     */
    private handlePreviewVoucherPdfResponse(response: any): void {
        if (response?.data || typeof response === 'string') {
            const blob: Blob = this.generalService.base64ToBlob(response?.data ?? response, 'application/pdf', 512);
            const file = new Blob([blob], { type: 'application/pdf' });
            URL.revokeObjectURL(this.previewPdfFileURL);
            this.previewPdfFileURL = URL.createObjectURL(file);
            this.previewPdfUrl.set(this.domSanitizer.bypassSecurityTrustResourceUrl(this.previewPdfFileURL));
            this.componentStore.resetPreviewPdfResponse();
            this.changeDetection.detectChanges();
        }
    }

    /**
     * Updates due date based on voucher date
     *
     * @memberof VoucherCreateComponent
     */
    public updateDueDate(): void {
        if (this.invoiceForm.get("date").value) {
            let duePeriod: number;
            if (this.account.duePeriod) {
                duePeriod = this.account.duePeriod;
            } else if (this.invoiceType.isEstimateInvoice) {
                duePeriod = this.invoiceSettings?.estimateSettings
                    ? this.invoiceSettings?.estimateSettings.duePeriod
                    : 0;
            } else if (this.invoiceType.isProformaInvoice) {
                duePeriod = this.invoiceSettings?.proformaSettings
                    ? this.invoiceSettings?.proformaSettings.duePeriod
                    : 0;
            } else if (this.invoiceType.isPurchaseOrder) {
                duePeriod = this.invoiceSettings?.purchaseBillSettings
                    ? this.invoiceSettings?.purchaseBillSettings.poDuePeriod
                    : 0;
            } else {
                duePeriod = this.invoiceSettings?.invoiceSettings
                    ? this.invoiceSettings?.invoiceSettings?.duePeriod
                    : 0;
            }

            if (typeof this.invoiceForm.get("date").value === "object") {
                this.invoiceForm
                    .get("date")
                    .setValue(
                        duePeriod > 0
                            ? dayjs(this.invoiceForm.get("date").value).add(duePeriod, "day").toDate()
                            : dayjs(this.invoiceForm.get("date").value).toDate()
                    );
            } else {
                this.invoiceForm
                    .get("dueDate")
                    .setValue(
                        duePeriod > 0
                            ? dayjs(this.invoiceForm.get("date").value, GIDDH_DATE_FORMAT)
                                .add(duePeriod, "day")
                                .toDate()
                            : dayjs(this.invoiceForm.get("date").value, GIDDH_DATE_FORMAT).toDate()
                    );
            }
        }
    }

    /**
     * Callback to update transaction amount
     *
     * @param {FormGroup} transactionFormGroup
     * @param {*} amount
     * @memberof VoucherCreateComponent
     */
    public updateTransactionAmount(transactionFormGroup: FormGroup, amount: any): void {
        transactionFormGroup.get("amount.amountForAccount").patchValue(amount);
    }

    /**
     * Calculates voucher totals
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private calculateVoucherTotals(): void {
        setTimeout(() => {
            const entries = this.getEntries();
            this.voucherTotals = this.vouchersUtilityService.getVoucherTotals(
                entries,
                this.company.giddhBalanceDecimalPlaces,
                this.applyRoundOff,
                this.invoiceForm.get("exchangeRate")?.value,
                { applyTcsToGrandTotal: !this.invoiceType.isReceiptInvoice && !this.invoiceType.isPaymentInvoice && !this.invoiceForm.get("isAdvanceReceipt")?.value }
            );
            this.invoiceForm.get("grandTotalMultiCurrency")?.patchValue(this.voucherTotals?.grandTotalMultiCurrency);
            this.calculateBalanceDue();
            this.changeDetection.detectChanges();
        }, 100);
    }

    /**
     * Updates entry total amount
     *
     * @param {FormGroup} entryFormGroup
     * @param {*} amount
     * @memberof VoucherCreateComponent
     */
    public updateEntryTotal(entryFormGroup: FormGroup, amount: any): void {
        if (!this.invoiceType.isReceiptInvoice && !this.invoiceType.isPaymentInvoice) {
            entryFormGroup.get("total.amountForAccount").patchValue(amount);
        }
        if (
            (this.invoiceType.isReceiptInvoice || this.invoiceType.isPaymentInvoice) &&
            entryFormGroup.get("otherTax.taxValue").value
        ) {
            this.calculateReceiptPaymentAmount(entryFormGroup);
        }
        this.calculateTotalTax();
        this.calculateVoucherTotals();
    }

    /**
     * Calculates tax in tax dropdown component
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private handleCalculateTaxInTaxDropdown(): void {
        this.calculateTaxInTaxDropdown = true;
        setTimeout(() => {
            this.calculateTaxInTaxDropdown = false;
        }, 1000);
    }

    /**
     * Callback for deposit account selection
     *
     * @param {*} event
     * @param {boolean} [isClear=false]
     * @memberof VoucherCreateComponent
     */
    public selectedDepositAccount(event: any, isClear: boolean = false, index: number = 0): void {
        let deposits = this.invoiceForm.get("deposits") as FormArray;
        let currentDepositFormGroup = deposits.at(index) as FormGroup;
        if (isClear) {
            currentDepositFormGroup.get("currencySymbol")?.patchValue("");
            currentDepositFormGroup.get("accountUniqueName")?.patchValue("");
        } else {
            currentDepositFormGroup.get("currencySymbol")?.patchValue(event?.additional?.currency?.symbol);
        }
        this.calculateBalanceDue();
    }

    /**
     * To check Tax number validation using regex get by API
     *
     * @param {*} value
     * @memberof VoucherCreateComponent
     */
    public checkAccountTaxValidation(value: any, entity: string, type: string, fieldName: string): void {
        if (this.company.taxType === TaxType.GST) {
            let isValid: boolean = false;
            if (value?.trim()) {
                if (
                    this.accountFormFields["taxName"] &&
                    this.accountFormFields["taxName"]["regex"] !== "" &&
                    this.accountFormFields["taxName"]["regex"]?.length > 0
                ) {
                    for (let key = 0; key < this.accountFormFields["taxName"]["regex"].length; key++) {
                        let regex = new RegExp(this.accountFormFields["taxName"]["regex"][key]);
                        if (regex && regex.test(value)) {
                            isValid = true;
                            break;
                        }
                    }
                } else {
                    isValid = true;
                }
                if (!isValid) {
                    let invalidTax = this.localeData?.invalid_tax_field;
                    invalidTax = invalidTax?.replace("[TAX_NAME]", this.accountFormFields["taxName"]?.label);
                    invalidTax = invalidTax?.replace("[FIELD_NAME]", fieldName);
                    this.toasterService.showSnackBar("error", invalidTax);
                    this.taxNumberValidations[entity][type] = observableOf(true);
                } else {
                    this.taxNumberValidations[entity][type] = null;
                }
            } else {
                this.taxNumberValidations[entity][type] = null;
            }
        }
    }

    /**
     * To check Tax number validation using regex get by API
     *
     * @param {*} value
     * @memberof VoucherCreateComponent
     */
    public checkCompanyTaxValidation(value: any, entity: string, type: string, fieldName: string): void {
        if (this.company.taxType === TaxType.GST) {
            let isValid: boolean = false;
            if (value?.trim()) {
                if (
                    this.companyFormFields["taxName"]["regex"] !== "" &&
                    this.companyFormFields["taxName"]["regex"]?.length > 0
                ) {
                    for (let key = 0; key < this.companyFormFields["taxName"]["regex"].length; key++) {
                        let regex = new RegExp(this.companyFormFields["taxName"]["regex"][key]);
                        if (regex.test(value)) {
                            isValid = true;
                            break;
                        }
                    }
                } else {
                    isValid = true;
                }
                if (!isValid) {
                    let invalidTax = this.localeData?.invalid_tax_field;
                    invalidTax = invalidTax?.replace("[TAX_NAME]", this.companyFormFields["taxName"]?.label);
                    invalidTax = invalidTax?.replace("[FIELD_NAME]", fieldName);
                    this.toasterService.showSnackBar("error", invalidTax);
                    this.taxNumberValidations[entity][type] = observableOf(true);
                } else {
                    this.taxNumberValidations[entity][type] = null;
                }
            } else {
                this.taxNumberValidations[entity][type] = null;
            }
        }
    }

    /*
     * Updates account and generate voucher
     *
     * @memberof VoucherCreateComponent
     */
    public updateAccountAndGenerateVoucher(): void {
        this.invoiceForm.get("updateAccountDetails")?.patchValue(true);
        this.saveVoucher();
    }

    /**
     * Open E-Way Bill dialog for creating or editing an E-Way Bill.
     * @param {any} event using for pinCode and gstNumber
     * @returns {void}
     *
     * @memberof VoucherCreateComponent
     */
    public openEwayBillDialog(): void {
        this.dialog?.closeAll();
        const dialogRef = this.dialog.open(EWayBillCreateComponent, {
            panelClass: ['mat-dialog-md'],
            disableClose: true,
            autoFocus: false,
            data: {
                pincode: this.invoiceForm.controls["account"]?.get("billingDetails").get("pincode")?.value,
                gstNumber: this.invoiceForm.controls["account"]?.get("billingDetails").get("taxNumber")?.value
            }
        });
        dialogRef.afterClosed().subscribe(response => {
            this.eWayBillResponse = response;
            this.saveVoucher();
        });
    }

    /**
     * Generates a voucher
     *
     * @memberof VoucherCreateComponent
     */
    public generateVoucher(type?: string): void {
        if (type === OcrAction.Skip) {
            this.aiOcrService.skipAndNext$.next({ type: OcrAction.Skip, token: this.aiOcrToken });
        } else {
            this.invoiceForm.get("updateAccountDetails")?.patchValue(false);
            if (this.isPendingEntries && !this.ocrDataEnabled) {
                this.saveVoucher(() => {
                    this.router.navigate([`/pages/vouchers/preview/${this.queryParams.voucherType}/pending`]);
                });
            } else {
                if (this.voucherType === "sales" && this.invoiceSettings?.invoiceSettings?.generateAutoEWayBill && this.invoiceSettings?.invoiceSettings?.gstEInvoiceEnable) {
                    this.openEwayBillDialog();
                } else {
                    this.saveVoucher();
                }
            }
        }
    }

    /**
     * Redirect to Voucher Preview page
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private redirectToVoucherPreview(): void {
        const uniqueName = this.invoiceForm.get("uniqueName").value;
        const queryParams: any = {
            page: this.queryParams?.page ?? 1,
            count: this.queryParams?.count ?? "",
            from: this.queryParams?.from ?? "",
            to: this.queryParams?.to ?? ""
        };

        if (this.queryParams?.search?.length) {
            queryParams.search = this.queryParams.search;
        }

        const recurringPath = this.isRecurringVoucher?.[1]?.isRecurringVoucher ? "/recurring" : "";
        if (this.isRecurringVoucher?.[1]?.isRecurringVoucher) {
            queryParams.recurringVoucherUniqueName = uniqueName;
        }

        this.router.navigate(
            [`/pages/vouchers/view/${this.urlVoucherType}${recurringPath}/${uniqueName}`],
            { queryParams }
        );
    }

    /**
     * Cancel update voucher and return to get all vouchers
     *
     * @memberof VoucherCreateComponent
     */
    public cancelUpdateVoucher(): void {
        if (this.redirectUrl) {
            this.router.navigateByUrl(this.redirectUrl);
        } else {
            this.redirectToVoucherPreview();
        }
    }

    /**
     * Updates voucher
     *
     * @memberof VoucherCreateComponent
     */
    public updateVoucher(): void {
        if (this.redirectUrl) {
            this.saveVoucher(() => {
                this.router.navigateByUrl(this.redirectUrl);
            });
        } else {
            this.saveVoucher();
        }
    }

    /**
     * Validates form
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private isFormValid(invoiceForm: any): boolean {
        if (
            this.taxNumberValidations.account.billingDetails !== null ||
            this.taxNumberValidations.account.shippingDetails !== null ||
            this.taxNumberValidations.company.billingDetails !== null ||
            this.taxNumberValidations.company.shippingDetails !== null
        ) {
            return false;
        }

        if (this.showDueDate) {
            const parsedDate = invoiceForm.date instanceof Date ? dayjs(invoiceForm.date) : dayjs(invoiceForm.date, GIDDH_DATE_FORMAT);
            const parsedDueDate = invoiceForm.dueDate instanceof Date ? dayjs(invoiceForm.dueDate) : dayjs(invoiceForm.dueDate, GIDDH_DATE_FORMAT);
            if (parsedDate.isValid() && parsedDueDate.isValid() && parsedDueDate.isBefore(parsedDate, "d")) {
                let dateText = this.commonLocaleData?.app_invoice;

                if (this.invoiceType.isProformaInvoice) {
                    dateText = this.localeData?.invoice_types?.proforma;
                }

                if (this.invoiceType.isEstimateInvoice) {
                    dateText = this.localeData?.invoice_types?.estimate;
                }

                let dueDateError = this.localeData?.due_date_error;
                dueDateError = dueDateError?.replace("[INVOICE_TYPE]", dateText);
                this.toasterService.showSnackBar("error", dueDateError);
                this.invoiceForm.get('dueDate')?.setErrors({ dueDateBeforeVoucherDate: true });
                return false;
            }
        }

        let hasTransactions = false;
        const entriesArray = this.invoiceForm.get("entries") as FormArray;
        for (let entryIndex = 0; entryIndex < entriesArray.length; entryIndex++) {
            const entryFormGroup = this.getEntryFormGroup(entryIndex);
            const transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);

            if (transactionFormGroup.get("account.uniqueName")?.value) {
                hasTransactions = true;
            }
        }

        if (this.localeData?.no_product_error) {
            if (!hasTransactions) {
                this.toasterService.showSnackBar("warning", this.localeData?.no_product_error);
                this.invoiceForm.get('entries')?.setErrors({ noProduct: true });
                return false;
            }
        }

        if (this.isIndianCompanyAndAccount && !!this.branchCurrentAddressInfo.taxNumber) {
            if (this.showPlaceOfSupply && !this.invoiceForm.get('account.placeOfSupply.code')?.value) {
                this.invoiceForm.get('account.placeOfSupply.code')?.markAsTouched();
                return false;
            }
            if (this.showSourceDestinationOfSupply) {
                if (!this.invoiceForm.get('account.sourceOfSupply.code')?.value) {
                    this.invoiceForm.get('account.sourceOfSupply.code')?.markAsTouched();
                    return false;
                }
                if (!this.invoiceForm.get('account.destinationOfSupply.code')?.value) {
                    this.invoiceForm.get('account.destinationOfSupply.code')?.markAsTouched();
                    return false;
                }
            }
        }

        if (invoiceForm.isRcmEntry) {
            let hasTaxes = true;
            const entriesArray = this.invoiceForm.get("entries") as FormArray;
            for (let entryIndex = 0; entryIndex < entriesArray.length; entryIndex++) {
                const entryFormGroup = this.getEntryFormGroup(entryIndex);
                const transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);
                const taxesFormArray = entryFormGroup.get("taxes") as FormArray;
                if (transactionFormGroup.get("account.uniqueName")?.value && !taxesFormArray?.length) {
                    entryFormGroup.get("requiredTax")?.patchValue(true);
                    hasTaxes = false;
                } else {
                    entryFormGroup.get("requiredTax")?.patchValue(false);
                }
            }

            if (this.showTaxColumn && !hasTaxes) {
                return false;
            }
        }

        return true;
    }

    /**
     * Scrolls the #content-wrapper to the first invalid form element in the DOM
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private scrollToFirstInvalidElement(): void {
        const contentWrapper = document.getElementById('content-wrapper');
        const allInvalid = contentWrapper?.querySelectorAll<HTMLElement>(
            'input.ng-invalid, select.ng-invalid, textarea.ng-invalid, table.ng-invalid, mat-select.ng-invalid, reactive-dropdown-field.ng-invalid, ng-select.ng-invalid, text-field.ng-invalid, input-field.ng-invalid, select-field.ng-invalid, select-multiple-fields.ng-invalid, giddh-datepicker.ng-invalid'
        );
        const firstInvalid = allInvalid?.[0];
        if (firstInvalid && contentWrapper) {
            const top = firstInvalid.getBoundingClientRect().top
                - contentWrapper.getBoundingClientRect().top
                + contentWrapper.scrollTop;
            contentWrapper.scrollTo({ top: top - 20, behavior: 'smooth' });
        }
    }

    /**
     * Returns voucher entries
     *
     * @return {*}  {any[]}
     * @memberof VoucherCreateComponent
     */
    public getEntries(): any[] {
        const entries = [];
        this.invoiceForm.get("entries")["controls"]?.forEach((control) => {
            if (control?.value?.transactions[0]?.account?.uniqueName) {
                entries.push(cloneDeep(control?.value));
            }
        });

        const annexureCharges = this.invoiceForm.get("annexureCharges") as FormArray;
        annexureCharges["controls"]?.forEach((control) => {
            const annexureCharge = control.value;
            const accountUniqueName = annexureCharge?.transactions?.[0]?.account?.uniqueName;
            
            if (accountUniqueName) {
                const annexureEntry = {
                    ...annexureCharge, 
                    voucherType: this.voucherType,
                    calculateAmount: true,
                    entryClass: "ANNEXURE",
                };
                entries.push(annexureEntry);
            }
        });

        return entries;
    }
    /**
     * Returns voucher deposits
     *
     * @return {*}  {any[]}
     * @memberof VoucherCreateComponent
     */
    public getDeposits(): any[] {
        const deposits = [];
        this.invoiceForm.get("deposits")["controls"]?.forEach((control) => {
            if (
                !this.invoiceType.isCashInvoice &&
                control.get("accountUniqueName").value &&
                control.get("amount").value
            ) {
                if (this.account.baseCurrencySymbol !== control.get("currencySymbol").value) {
                    deposits.push({
                        amountForCompany: control.get("amount").value,
                        accountUniqueName: control.get("accountUniqueName").value,
                    });
                } else {
                    deposits.push({
                        amountForAccount: control.get("amount").value,
                        accountUniqueName: control.get("accountUniqueName").value,
                    });
                }
            } else if (this.invoiceType.isCashInvoice && control.get("accountUniqueName").value) {
                deposits.push({ accountUniqueName: control.get("accountUniqueName").value });
            }
        });
        return deposits;
    }

    /**
     * Checks RCM
     *
     * @memberof VoucherCreateComponent
     */
    public checkRcm(waitForElement: boolean = false): void {
        const updateRcmState = () => {
            if (this.invoiceForm.get("isRcmEntry")?.value) {
                this.invoiceForm.get("subVoucher")?.patchValue(SubVoucher.ReverseCharge);
            } else {
                this.invoiceForm.get("subVoucher")?.patchValue("");
            }

            if (this.rcmCheckbox) {
                this.rcmCheckbox["checked"] = this.invoiceForm.get("isRcmEntry")?.value;
            }
        };

        // Always update form state immediately
        updateRcmState();

        // If we need to wait for element and it's not available, retry with exponential backoff
        if (waitForElement && !this.rcmCheckbox) {
            this.waitForRcmElement(0);
        }
    }

    /**
     * Waits for RCM checkbox element to be available with exponential backoff
     *
     * @private
     * @param {number} [attempt=0]
     * @return {*}  {void}
     * @memberof VoucherCreateComponent
     */
    private waitForRcmElement(attempt: number = 0): void {
        const maxAttempts = 10;
        const baseDelay = 50; // Start with 50ms

        if (attempt >= maxAttempts) {
            return;
        }

        if (this.rcmCheckbox) {
            // Element found, update checkbox state
            this.rcmCheckbox["checked"] = this.invoiceForm.get("isRcmEntry")?.value;
            return;
        }

        // Exponential backoff: 50ms, 100ms, 200ms, 400ms, etc.
        const delay = baseDelay * Math.pow(2, attempt);

        setTimeout(() => {
            this.waitForRcmElement(attempt + 1);
        }, delay);
    }

    /**
     * Saves voucher
     *
     * @param {Function} [callback]
     * @memberof VoucherCreateComponent
     */
    public saveVoucher(callback?: Function): void {
        this.startLoader(true);

        const entries = this.getEntries();
        const deposits = this.getDeposits();
        this.checkRcm();
        let invoiceForm = cloneDeep(this.invoiceForm.value);

        invoiceForm.entries = entries;
        invoiceForm.deposits = deposits;
        delete invoiceForm.annexureCharges;

        if (
            this.invoiceType.isEstimateInvoice ||
            this.invoiceType.isProformaInvoice ||
            this.invoiceType.isPurchaseOrder
        ) {
            invoiceForm.entries.forEach((control) => {
                if (control?.date) {
                    delete control.date;
                }
            });
        }

        if (this.currencySwitched) {
            invoiceForm.exchangeRate = 1 / invoiceForm.exchangeRate;
        }

        if (!this.isFormValid(invoiceForm)) {
            this.startLoader(false);
            this.invoiceForm.markAllAsTouched();
            this.changeDetection.detectChanges();
            this.scrollToFirstInvalidElement();
            return;
        }

        invoiceForm = this.vouchersUtilityService.formatVoucherObject(invoiceForm);

        if (!this.isIndianCompanyAndAccount) {
            delete invoiceForm.account?.placeOfSupply;
            delete invoiceForm.account?.sourceOfSupply;
            delete invoiceForm.account?.destinationOfSupply;
        } else if (this.showPlaceOfSupply) {
            delete invoiceForm.account?.sourceOfSupply;
            delete invoiceForm.account?.destinationOfSupply;
        } else if (this.showSourceDestinationOfSupply) {
            delete invoiceForm.account?.placeOfSupply;
        }
        if (this.isIndianCompanyAndAccount && !this.branchCurrentAddressInfo.taxNumber) {
            if (this.showPlaceOfSupply && !invoiceForm.account?.placeOfSupply.code) {
                delete invoiceForm.account?.placeOfSupply;
            } else if (this.showSourceDestinationOfSupply) {
                if (!invoiceForm.account?.sourceOfSupply.code) {
                    delete invoiceForm.account?.sourceOfSupply;
                }
                if (!invoiceForm.account?.destinationOfSupply.code) {
                    delete invoiceForm.account?.destinationOfSupply;
                }
            }
        }

        if (!this.currentVoucherFormDetails?.depositAllowed) {
            delete invoiceForm.deposits;
        }

        if (this.hasStock && this.warehouses?.length === 1) {
            invoiceForm.warehouse = {
                name: this.warehouses[0]?.name,
                uniqueName: this.warehouses[0]?.uniqueName,
            };
        }

        if (this.invoiceType.isCreditNote || this.invoiceType.isDebitNote) {
            invoiceForm.invoiceNumberAgainstVoucher = invoiceForm.number;
        }

        if (
            (this.invoiceType.isSalesInvoice ||
                this.invoiceType.isPurchaseInvoice ||
                this.invoiceType.isCreditNote ||
                this.invoiceType.isDebitNote ||
                this.invoiceType.isReceiptInvoice ||
                this.invoiceType.isPaymentInvoice) &&
            this.advanceReceiptAdjustmentData &&
            this.advanceReceiptAdjustmentData.adjustments
        ) {
            if (this.advanceReceiptAdjustmentData.adjustments.length && !this.invoiceForm.get('voucherUniqueName')?.value) {
                const adjustments = cloneDeep(this.advanceReceiptAdjustmentData.adjustments);
                if (adjustments) {
                    adjustments.forEach((adjustment) => {
                        if (adjustment.balanceDue !== undefined) {
                            delete adjustment.balanceDue;
                        }
                    });
                    invoiceForm.voucherAdjustments = {
                        adjustments,
                    };

                    if (
                        invoiceForm.voucherAdjustments &&
                        invoiceForm.voucherAdjustments.adjustments &&
                        invoiceForm.voucherAdjustments.adjustments.length > 0
                    ) {
                        invoiceForm.voucherAdjustments.adjustments.map((item) => {
                            if (item && item.voucherDate) {
                                item.voucherDate = item.voucherDate?.replace(/\//g, "-");
                            }
                        });
                    }
                }
            } else {
                this.advanceReceiptAdjustmentData.adjustments = [];
                invoiceForm.voucherAdjustments = this.advanceReceiptAdjustmentData;
            }

            invoiceForm = this.adjustmentUtilityService.getAdjustmentObjectVoucherModule(invoiceForm);
        }

        if (this.isUkCompany) {
            invoiceForm = this.vouchersUtilityService.copyCompanyStateToCounty(invoiceForm);
        }

        if (this.isUkAccount) {
            invoiceForm = this.vouchersUtilityService.copyAccountStateToCounty(invoiceForm);
        }

        // Filter out custom fields with empty values
        if (invoiceForm.account?.customFields?.length) {
            invoiceForm.account.customFields = invoiceForm.account.customFields.map((field: { uniqueName: string; value: any }) => {
                // Clear field value if it's null, undefined, or empty/whitespace string
                if (field.value == null || (typeof field.value === 'string' && !field.value.trim())) {
                    field.value = "";
                }
                return field;
            });
        }

        if (!this.invoiceType.isPurchaseOrder) {
            if (this.isUkAccount) {
                if (invoiceForm.account?.billingDetails) {
                    delete invoiceForm.account.billingDetails.state;
                }
                if (invoiceForm.account?.shippingDetails) {
                    delete invoiceForm.account.shippingDetails.state;
                }
            }

            if (this.isUkCompany) {
                if (invoiceForm.company?.billingDetails) {
                    delete invoiceForm.company.billingDetails.state;
                }
                if (invoiceForm.company?.shippingDetails) {
                    delete invoiceForm.company.shippingDetails.state;
                }
            }
        }

        if (this.invoiceType.isPurchaseOrder) {
            invoiceForm.type = VoucherTypeEnum.purchase;

            let getRequestObject = {
                companyUniqueName: this.activeCompany?.uniqueName,
                accountUniqueName: invoiceForm.account?.uniqueName,
            };

            if (this.account.branch) {
                getRequestObject["branchUniqueName"] = this.account.branch.uniqueName;
            }

            if (!this.isUkAccount) {
                if (invoiceForm.account?.billingDetails?.state?.code) {
                    invoiceForm.account.billingDetails.stateCode = invoiceForm.account.billingDetails.state?.code;
                    invoiceForm.account.billingDetails.stateName = invoiceForm.account.billingDetails.state?.name;
                }

                if (invoiceForm.account?.shippingDetails?.state?.code) {
                    invoiceForm.account.shippingDetails.stateCode = invoiceForm.account.shippingDetails.state?.code;
                    invoiceForm.account.shippingDetails.stateName = invoiceForm.account.shippingDetails.state?.name;
                }
            } else {
                delete invoiceForm.account.billingDetails.state;
                delete invoiceForm.account.shippingDetails.state;
            }

            if (!this.isUkCompany) {
                if (invoiceForm.company?.billingDetails?.state?.code) {
                    invoiceForm.company.billingDetails.stateCode = invoiceForm.company.billingDetails.state?.code;
                    invoiceForm.company.billingDetails.stateName = invoiceForm.company.billingDetails.state?.name;
                }

                if (invoiceForm.company?.shippingDetails?.state?.code) {
                    invoiceForm.company.shippingDetails.stateCode = invoiceForm.company.shippingDetails.state?.code;
                    invoiceForm.company.shippingDetails.stateName = invoiceForm.company.shippingDetails.state?.name;
                }
            } else {
                delete invoiceForm.company.billingDetails.state;
                delete invoiceForm.company.shippingDetails.state;
            }

            invoiceForm = this.vouchersUtilityService.cleanVoucherObject(invoiceForm);

            if (this.isUpdateMode) {
                this.purchaseOrderService
                    .update(getRequestObject, invoiceForm)
                    .pipe(takeUntil(this.destroyed$))
                    .subscribe((response) => {
                        this.startLoader(false);
                        if (response && response.status === "success") {
                            this.toasterService.showSnackBar("success", this.localeData?.po_updated);
                            if (callback) {
                                callback(response);
                            } else {
                                this.redirectToVoucherPreview();
                            }
                        } else {
                            this.toasterService.showSnackBar("error", response.message);
                        }
                    });
            } else {
                this.purchaseOrderService
                    .create(getRequestObject, invoiceForm)
                    .pipe(takeUntil(this.destroyed$))
                    .subscribe((response) => {
                        this.startLoader(false);
                        if (response && response.status === "success") {
                            this.aiOcrService.saveAndNextSuccess$.next({
                                token: this.aiOcrToken,
                                type: OcrAction.Save,
                                ocrType: this.ocrType
                            });
                            this.resetVoucherForm();

                            let message = this.localeData?.po_created;
                            message = message?.replace("[PO_NUMBER]", response.body?.number);
                            this.toasterService.showSnackBar("success", message);
                        } else {
                            this.toasterService.showSnackBar("error", response?.message, response?.code);
                        }
                    });
            }
        } else if (this.invoiceType.isEstimateInvoice || this.invoiceType.isProformaInvoice) {
            invoiceForm.type = VoucherTypeEnum.sales;

            if (!this.isUkAccount) {
                if (invoiceForm.account?.billingDetails?.state?.code) {
                    invoiceForm.account.billingDetails.stateCode = invoiceForm.account.billingDetails.state?.code;
                    invoiceForm.account.billingDetails.stateName = invoiceForm.account.billingDetails.state?.name;
                }

                if (invoiceForm.account?.shippingDetails?.state?.code) {
                    invoiceForm.account.shippingDetails.stateCode = invoiceForm.account.shippingDetails.state?.code;
                    invoiceForm.account.shippingDetails.stateName = invoiceForm.account.shippingDetails.state?.name;
                }
            }

            if (this.totalDepositAmount) {
                const deposits = this.invoiceForm.get("deposits") as FormArray;
                invoiceForm.paymentAction = {
                    action: "paid",
                    amount: this.totalDepositAmount,
                    depositAccountUniqueName: this.invoiceType.isCashInvoice
                        ? invoiceForm.account?.uniqueName
                        : deposits.at(0).get("accountUniqueName")?.value,
                };
            }

            invoiceForm.voucherDetails = {
                voucherType: this.invoiceType.isEstimateInvoice
                    ? VoucherTypeEnum.generateEstimate
                    : VoucherTypeEnum.generateProforma,
            };
            invoiceForm.accountDetails = { uniqueName: invoiceForm.account?.uniqueName };

            invoiceForm = this.vouchersUtilityService.cleanVoucherObject(invoiceForm);
            if (this.isUpdateMode) {
                this.proformaService
                    .update(invoiceForm)
                    .pipe(takeUntil(this.destroyed$))
                    .subscribe((response) => {
                        this.startLoader(false);
                        if (response?.status === "success") {
                            this.toasterService.showSnackBar("success", this.localeData?.voucher_updated);
                            if (callback) {
                                callback(response);
                            } else {
                                this.invoiceForm.get("uniqueName").patchValue(response.body?.number);
                                this.redirectToVoucherPreview();
                            }
                        } else {
                            this.toasterService.showSnackBar("error", response?.message, response?.code);
                        }
                    });
            } else {
                this.proformaService
                    .generate(invoiceForm)
                    .pipe(takeUntil(this.destroyed$))
                    .subscribe((response) => {
                        this.startLoader(false);
                        if (response?.status === "success") {
                            this.aiOcrService.saveAndNextSuccess$.next({
                                token: this.aiOcrToken,
                                type: OcrAction.Save,
                                ocrType: this.ocrType
                            });
                            if (callback) {
                                this.resetVoucherForm(false);
                            } else {
                                this.resetVoucherForm();
                            }

                            let message = response?.body.number
                                ? `${this.localeData?.entry_created}: ${response?.body.number}`
                                : this.commonLocaleData?.app_messages?.voucher_saved;
                            this.toasterService.showSnackBar("success", message);
                            if (callback) {
                                callback(response);
                            }
                        } else {
                            this.toasterService.showSnackBar("error", response?.message, response?.code);
                        }
                    });
            }
        } else {
            if (this.invoiceType.isCashInvoice) {
                invoiceForm.type = this.invoiceType.isPurchaseInvoice
                    ? "purchase"
                    : this.invoiceType.isCreditNote
                        ? "credit note"
                        : this.invoiceType.isDebitNote
                            ? "debit note"
                            : "sales";

                if (this.invoiceForm.get("salesPurchaseAsReceiptPayment").value) {
                    if (this.invoiceType.isPurchaseInvoice) {
                        invoiceForm.type = VoucherTypeEnum.payment;
                    } else if (!this.invoiceType.isDebitNote && !this.invoiceType.isCreditNote) {
                        invoiceForm.type = VoucherTypeEnum.receipt;
                    }
                }

                invoiceForm.entries = invoiceForm.entries?.map((entry) => {
                    entry.voucherType = invoiceForm.type;
                    return entry;
                });
            }

            if (this.invoiceType.isPurchaseInvoice && invoiceForm.linkedPo?.length) {
                invoiceForm.purchaseOrders = [];
                invoiceForm.linkedPo?.forEach((order) => {
                    invoiceForm.purchaseOrders.push({
                        name: this.linkedPoNumbers[order]?.voucherNumber,
                        uniqueName: order,
                    });
                });
            }

            if (this.invoiceType.isReceiptInvoice || this.invoiceType.isPaymentInvoice) {
                invoiceForm.entries = invoiceForm.entries?.map((entry) => {
                    let chequeClearanceDate;
                    if (invoiceForm.chequeClearanceDate) {
                        if (typeof invoiceForm.chequeClearanceDate === "string") {
                            chequeClearanceDate = invoiceForm.chequeClearanceDate;
                        } else {
                            chequeClearanceDate = dayjs(invoiceForm.chequeClearanceDate).format(GIDDH_DATE_FORMAT);
                        }
                    }

                    entry.chequeNumber = invoiceForm.chequeNumber;
                    entry.chequeClearanceDate = chequeClearanceDate;

                    if (
                        entry.otherTax.type === this.otherTaxTypeEnum.TDS ||
                        entry.otherTax.type === this.otherTaxTypeEnum.TCS
                    ) {
                        entry.transactions[0].amount.amountForAccount = entry?.total?.amountForAccount;
                        entry.transactions[0].amount.amountForCompany = entry?.total?.amountForCompany;
                    }

                    if (!invoiceForm.isAdvanceReceipt) {
                        delete entry.taxes;
                    }

                    return entry;
                });

                if (invoiceForm.isAdvanceReceipt) {
                    invoiceForm.subVoucher = SubVoucher.AdvanceReceipt;
                    if (invoiceForm.entries[0].otherTax.type === this.otherTaxTypeEnum.TDS) {
                        invoiceForm.entries[0].transactions[0].amount.amountForAccount =
                            invoiceForm.entries[0]?.total?.amountForAccount;
                        invoiceForm.entries[0].transactions[0].amount.amountForCompany =
                            invoiceForm.entries[0]?.total?.amountForCompany;
                    }
                }
            }

            invoiceForm = this.vouchersUtilityService.cleanVoucherObject(invoiceForm);
            const deposits = this.invoiceForm.get("deposits") as FormArray;
            let accountUniqueName = this.invoiceType.isCashInvoice
                ? deposits.at(0).get("accountUniqueName")?.value || invoiceForm.account?.uniqueName || "cash"
                : invoiceForm.account?.uniqueName;
            if (invoiceForm?.account?.uniqueName) {
                invoiceForm.account.uniqueName = accountUniqueName;
            }

            // Handle Recurring Voucher
            if (this.invoiceForm.get('isRecurringVoucher')?.value && this.isRecurringVoucherSupported()) {
                if (this.asideRecurrenceVoucher) {
                    this.asideRecurrenceVoucher.setSubmitting(true);
                }
                invoiceForm.recurrencePreviewRequest = this.recurrenceService.getCleanFormValue(this.recurrenceFormGroup);
                setTimeout(() => {
                    if (this.asideRecurrenceVoucher) {
                        this.asideRecurrenceVoucher.setSubmitting(false);
                    }
                }, 800);
            } else {
                delete invoiceForm.recurrencePreviewRequest;
            }
            if (!this.queryParams?.isRecurringVoucher) {
                delete invoiceForm.isRecurringVoucher;
            }

            if (this.isUpdateMode) {
                this.voucherService
                    .updateVoucher(invoiceForm)
                    .pipe(takeUntil(this.destroyed$))
                    .subscribe((response) => {
                        this.startLoader(false);
                        if (response?.status === "success") {
                            this.toasterService.showSnackBar("success", this.localeData?.voucher_updated);
                            if (callback) {
                                callback(response);
                            } else {
                                this.redirectToVoucherPreview();
                            }
                        } else {
                            this.toasterService.showSnackBar("error", response?.message, response?.code);
                        }
                    });
            } else {
                if (this.eWayBillResponse && Object.keys(this.eWayBillResponse).length > 0) {
                    invoiceForm.ewayBillDetails = this.eWayBillResponse;
                    this.eWayBillResponse = null;
                }
                invoiceForm.isRecurringVoucher = this.queryParams.isRecurringVoucher ? true : false;
                this.voucherService
                    .generateVoucher(invoiceForm.account?.uniqueName, invoiceForm)
                    .pipe(takeUntil(this.destroyed$))
                    .subscribe((response) => {
                        this.startLoader(false);
                        if (response?.status === "success") {
                            this.aiOcrService.saveAndNextSuccess$.next({
                                token: this.aiOcrToken,
                                type: OcrAction.Save,
                                ocrType: this.ocrType
                            });
                            const isCashSalesPurchaseInvoice =
                                this.invoiceType.isCashInvoice &&
                                ((!this.invoiceType.isDebitNote && !this.invoiceType.isCreditNote) ||
                                    this.invoiceType.isPurchaseInvoice);

                            if (isCashSalesPurchaseInvoice) {
                                const salesPurchaseAsReceiptPayment = this.invoiceForm.get(
                                    "salesPurchaseAsReceiptPayment"
                                ).value;

                                if (
                                    this.invoiceType.isPurchaseInvoice &&
                                    salesPurchaseAsReceiptPayment !== this.company.purchaseAsPayment
                                ) {
                                    this.updateProfileSetting({ purchaseAsPayment: salesPurchaseAsReceiptPayment });
                                } else if (salesPurchaseAsReceiptPayment !== this.company.salesAsReceipt) {
                                    this.updateProfileSetting({ salesAsReceipt: salesPurchaseAsReceiptPayment });
                                }
                            }

                            if (callback) {
                                this.resetVoucherForm(false);
                            } else {
                                let salesPurchaseAsReceiptPayment =
                                    this.invoiceForm.value.salesPurchaseAsReceiptPayment;
                                this.resetVoucherForm();

                                if (isCashSalesPurchaseInvoice) {
                                    this.invoiceForm
                                        .get("salesPurchaseAsReceiptPayment")
                                        .patchValue(salesPurchaseAsReceiptPayment);
                                }
                            }

                            let message = response?.body.number
                                ? `${this.localeData?.entry_created}: ${response?.body.number}`
                                : this.commonLocaleData?.app_messages?.voucher_saved;
                            this.toasterService.showSnackBar("success", message);
                            if (callback) {
                                callback(response);
                            }
                        } else if (response?.status === "einvoice-confirm") {
                            let dialogRef = this.dialog.open(ConfirmModalComponent, {
                                data: {
                                    title: this.commonLocaleData?.app_confirm,
                                    body: response?.message,
                                    ok: this.commonLocaleData?.app_yes,
                                    cancel: this.commonLocaleData?.app_no,
                                    permanentlyDeleteMessage: " ",
                                },
                            });

                            dialogRef
                                .afterClosed()
                                .pipe(take(1))
                                .subscribe((response) => {
                                    if (response) {
                                        this.invoiceForm.get("generateEInvoice")?.patchValue(true);
                                    } else {
                                        this.invoiceForm.get("generateEInvoice")?.patchValue(false);
                                    }
                                    this.saveVoucher(callback);
                                });
                        } else {
                            this.toasterService.showSnackBar("error", response?.message, response?.code);
                        }
                    });
            }
        }
    }

    /**
     * Handles single toggle button change between OCR voucher type and cash mode
     *
     * @memberof VoucherCreateComponent
     */
    public onSingleToggleChange(): void {
        // Toggle between cash and OCR voucher type
        const newType = this.invoiceType.isCashInvoice ? this.ocrVoucherType : VoucherTypeEnum.cash;
        this.onToggleChange(newType);
        this.changeDetection.detectChanges();
    }



    /**
     * Toggles between create and list
     *
     * @param {string} type
     * @memberof VoucherCreateComponent
     */
    public onToggleChange(type: string): void {
        this.invoiceType.isCashInvoice = type === VoucherTypeEnum.cash ? true : false;
        if (this.invoiceType.isCashInvoice) {
            this.accountFormFields = cloneDeep(this.companyFormFields);
            this.account.taxTypeLabel = cloneDeep(this.company.taxTypeLabel);
            this.account.taxType = cloneDeep(this.company.taxType);
            this.invoiceForm.get("account.uniqueName")?.patchValue(VoucherTypeEnum.cash);
        }
        let label: VoucherTypeEnum | string;
        if (this.invoiceType.isCashInvoice && this.invoiceType.isSalesInvoice) {
            label = VoucherTypeEnum.cash;
        } else if (this.invoiceType.isCashInvoice && this.invoiceType.isPurchaseInvoice) {
            label = VoucherTypeEnum.cashBill;
        } else if (this.invoiceType.isCashInvoice && this.invoiceType.isDebitNote) {
            label = VoucherTypeEnum.cashDebitNote;
        } else if (this.invoiceType.isCashInvoice && this.invoiceType.isCreditNote) {
            label = VoucherTypeEnum.cashCreditNote;
        } else {
            label = this.ocrVoucherType;
        }
        if (!this.invoiceType.isPaymentInvoice && !this.invoiceType.isReceiptInvoice) {
            this.getWarehouses();
        }
        this.voucherType = this.vouchersUtilityService.parseVoucherType(label);
        this.company.countryName = null;
        this.getAccountOnboardingFormData();
        this.getCompanyProfile();
        this.getCountryList();
        this.getDiscountsList();
        this.getCompanyBranches();
        this.getCompanyTaxes();
        this.getIsTcsTdsApplicable();
        this.getInvoiceSettings();
        this.getCreatedTemplates();
        this.searchAccount();
        this.componentStore.getBriefAccounts({ currency: this.company.baseCurrency, group: BriedAccountsGroup });
        this.changeDetection.detectChanges();
    }

    /**
     * Resets voucher form
     *
     * @memberof VoucherCreateComponent
     */
    public resetVoucherForm(openAccountDropdown: boolean = true, initialLoad: boolean = false): void {
        if (!initialLoad) {
            this.ocrDataEnabled = false;
        }

        const entriesFormArray = this.invoiceForm.get("entries") as FormArray;
        entriesFormArray.clear();
        const depositFormArray = this.invoiceForm.get("deposits") as FormArray;
        depositFormArray.clear();
        const annexureChargesFormArray = this.invoiceForm.get("annexureCharges") as FormArray;
        annexureChargesFormArray.clear();

        // Store custom fields data before form reset
        const customFieldsFormArray = this.customFieldsFormArray;
        let customFieldsData: any[] = [];
        if (customFieldsFormArray && customFieldsFormArray.length > 0) {
            customFieldsData = customFieldsFormArray.controls.map((control: FormGroup) => ({
                uniqueName: control.get('uniqueName')?.value,
                value: '' // Clear the value but preserve uniqueName
            }));
        }

        this.invoiceForm.reset();

        // Restore custom fields with preserved uniqueName but cleared values
        if (customFieldsData.length > 0) {
            const restoredCustomFieldsFormArray = this.customFieldsFormArray;
            if (restoredCustomFieldsFormArray) {
                this.resetCustomFieldsValue(restoredCustomFieldsFormArray, customFieldsData);
            }
        }

        this.copyAccountBillingInShippingAddress =
            this.invoiceType.isReceiptInvoice || this.invoiceType.isPaymentInvoice ? false : true;
        this.copyCompanyBillingInShippingAddress =
            this.invoiceType.isReceiptInvoice || this.invoiceType.isPaymentInvoice ? false : true;
        this.currencySwitched = false;

        this.accountFormFields = [];
        this.selectedFileName = "";
        this.depositAccountName = "";

        this.account = {
            countryName: "",
            countryCode: "",
            baseCurrency: "",
            baseCurrencySymbol: "",
            addresses: null,
            otherApplicableTaxes: null,
            applicableDiscounts: null,
            applicableTaxes: null,
            excludeTax: false,
            taxTypeLabel: "",
            branch: null,
        };

        if (this.invoiceType.isCashInvoice) {
            this.accountFormFields = cloneDeep(this.companyFormFields);
            this.account.taxTypeLabel = cloneDeep(this.company.taxTypeLabel);
            this.account.taxType = cloneDeep(this.company.taxType);

            this.invoiceForm.get("account.uniqueName")?.patchValue("cash");
            this.componentStore.getBriefAccounts({ currency: this.company.baseCurrency, group: BriedAccountsGroup });
            this.company.countryName = '';
            this.getCompanyProfile();
        }
        
        this.addNewLineEntry(false);
        this.addNewDepositRow();
        this.addAnnexureCharge();
        if (!initialLoad) {
            this.setInitialRecurrencePreviewRequest();
        }

        this.voucherTotals = {
            totalAmount: 0,
            totalDiscount: 0,
            totalTaxableValue: 0,
            totalTaxWithoutCess: 0,
            totalCess: 0,
            grandTotal: 0,
            grandTotalMultiCurrency: 0,
            roundOff: { value: 0, isPositive: true },
            tcsTotal: 0,
            tdsTotal: 0,
            balanceDue: 0,
        };
        this.hasStock = false;
        this.showWarehouse = false;
        this.isAccountChanged = false;

        this.isAdjustAmount = false;
        this.adjustPaymentData = {
            customerName: "",
            customerUniquename: "",
            voucherDate: "",
            balanceDue: 0,
            dueDate: "",
            grandTotal: 0,
            gstTaxesTotal: 0,
            subTotal: 0,
            totalTaxableValue: 0,
            totalAdjustedAmount: 0,
            convertedTotalAdjustedAmount: 0,
        };
        this.totalDepositAmount = 0;
        this.advanceReceiptAdjustmentData = null;
        this.vouchersForAdjustment = [];
        this.adjustPaymentBalanceDueData = 0;
        this.totalAdvanceReceiptsAdjustedAmount = 0;

        this.invoiceForm.get("type").patchValue(this.voucherType);
        this.invoiceForm.get("date")?.patchValue(this.universalDate);
        this.invoiceForm.get("roundOffApplicable")?.patchValue(this.applyRoundOff);
        this.isVoucherDateChanged = false;

        let entryFields = [];
        entryFields.push({ key: "date", value: this.universalDate });
        this.updateEntry(0, entryFields);
        this.updateDueDate();
        this.pageLeaveUtilityService.removeBrowserConfirmationDialog();
        this.stockVariants = [];
        this.stockUnits = [];

        this.componentStore.resetAll();
        this.resetVoucherListForCreditDebitNote();

        if (!initialLoad) {
            this.searchAccount();
        }

        if (this.invoiceType.isCashInvoice) {
            this.invoiceForm.get("account.uniqueName")?.patchValue("cash");
        }

        this.invoiceForm.get("isRcmEntry").patchValue(false);
        if (this.rcmCheckbox) {
            this.rcmCheckbox["checked"] = false;
        }
        this.checkRcm();

        // Only trigger forceClear if not in update mode or if there's no existing account data
        const accountFormGroup = this.invoiceForm.get('account');
        const hasExistingAccountData = accountFormGroup?.get('customerName')?.value ||
            accountFormGroup?.get('uniqueName')?.value ||
            accountFormGroup?.get('email')?.value;


        // Don't trigger forceClear during initial load or when in update mode with data
        if (initialLoad || this.isUpdateMode || hasExistingAccountData) {
            this.forceClear = false;
        } else {
            this.forceClear = true;
        }
        if (openAccountDropdown) {
            this.openAccountDropdown = false;
        }
        setTimeout(() => {
            this.forceClear = false;
            this.openAccountDropdown = openAccountDropdown;
        }, 200);
    }

    /**
     * This will be used to set account billing address to shipping address
     *
     * @memberof VoucherCreateComponent
     */
    public copyAccountBillingAddressToShippingAddress(): void {
        if (this.copyAccountBillingInShippingAddress) {
            const billingDetails = this.invoiceForm.get("account.billingDetails").value;
            this.invoiceForm.get("account.shippingDetails").patchValue(billingDetails);
        }
    }

    /**
     * This will be used to set company billing address to shipping address
     *
     * @memberof VoucherCreateComponent
     */
    public copyCompanyBillingAddressToShippingAddress(): void {
        if (this.copyCompanyBillingInShippingAddress) {
            const billingDetails = this.invoiceForm.get("company.billingDetails").value;
            this.invoiceForm.get("company.shippingDetails").patchValue(billingDetails);
        }
    }

    /**
     * This will be use for send email after create voucher
     *
     * @param {*} email
     * @memberof VoucherCreateComponent
     */
    public sendEmail(email: any): void {
        if (email) {
            if (this.invoiceType.isEstimateInvoice || this.invoiceType.isProformaInvoice) {
                let req: ProformaGetRequest = new ProformaGetRequest();

                req.accountUniqueName = this.voucherDetails?.account?.uniqueName;

                if (this.invoiceType.isProformaInvoice) {
                    req.proformaNumber = this.voucherDetails?.number;
                } else {
                    req.estimateNumber = this.voucherDetails?.number;
                }
                req.emailId = email;
                this.componentStore.sendProformaEstimateOnEmail({ request: req, voucherType: this.voucherType });
            } else {
                this.componentStore.sendVoucherOnEmail({
                    accountUniqueName: this.voucherDetails?.account?.uniqueName,
                    payload: {
                        email: { to: email.email },
                        voucherType: this.voucherDetails?.type,
                        copyTypes: email.invoiceType ? email.invoiceType : [],
                        uniqueName: email.uniqueName,
                    },
                });
            }
        }
    }

    /**
     * Lifecycle hook for component destroy
     *
     * @memberof VoucherCreateComponent
     */
    public ngOnDestroy(): void {
        this.componentStore.resetAll();
        if (this.wasSidebarOpen) {
            this.store.dispatch(this.generalActions.openSideMenu(true));
        }
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Get list of all vouchers for adjustment
     *
     * @memberof VoucherCreateComponent
     */
    public getAllVouchersForAdjustment(): void {
        this.vouchersForAdjustment = [];
        let voucherDate = this.invoiceForm.get("date")?.value;

        if (typeof voucherDate !== "string") {
            voucherDate = dayjs(voucherDate).format(GIDDH_DATE_FORMAT);
        }

        if (this.invoiceForm.controls["account"]?.get("uniqueName")?.value && voucherDate) {
            const requestObject = {
                accountUniqueName: this.invoiceForm.controls["account"]?.get("uniqueName")?.value,
                voucherType: this.voucherType,
            };
            this.componentStore.getVouchersList({ request: requestObject, date: voucherDate });
        }
    }

    /**
     * Opens adjustment dialog
     *
     * @memberof VoucherCreateComponent
     */
    public openAdjustmentDialog(open: boolean): void {
        if (open) {
            this.isAdjustAmount = true;
            if (
                !this.advanceReceiptAdjustmentData?.adjustments?.length &&
                this.originalVoucherAdjustments?.adjustments?.length
            ) {
                this.advanceReceiptAdjustmentData = cloneDeep(this.originalVoucherAdjustments);
                this.calculateAdjustedVoucherTotal(this.originalVoucherAdjustments?.adjustments);
            }
            this.openDialogWithFocusManagement(() =>
                this.dialog.open(this.adjustmentModal, {
                    width: "800px",
                })
            );
        } else {
            this.isAdjustAmount = false;
            this.adjustPaymentBalanceDueData = 0;
            this.adjustPaymentData.totalAdjustedAmount = 0;
            this.totalAdvanceReceiptsAdjustedAmount = 0;
            this.advanceReceiptAdjustmentData.adjustments = [];
            this.calculateBalanceDue();
        }
    }

    /**
     * Closes advance receipt modal
     *
     * @memberof VoucherCreateComponent
     */
    public closeAdvanceReceiptModal(): void {
        this.showAdvanceReceiptAdjust = false;
        this.dialog.closeAll();
        if (this.advanceReceiptAdjustmentData && this.advanceReceiptAdjustmentData.adjustments) {
            this.isAdjustAmount = this.advanceReceiptAdjustmentData.adjustments.length ? true : false;
        } else {
            this.isAdjustAmount = false;
        }
    }

    /**
     * To get all advance adjusted data
     *
     * @param {{ adjustVoucherData: VoucherAdjustments, adjustPaymentData: AdjustAdvancePaymentModal }} advanceReceiptsAdjustEvent event that contains advance receipts adjusted data
     * @memberof VoucherCreateComponent
     */
    public getAdvanceReceiptAdjustData(advanceReceiptsAdjustEvent: {
        adjustVoucherData: VoucherAdjustments;
        adjustPaymentData: AdjustAdvancePaymentModal;
    }): void {
        this.advanceReceiptAdjustmentData = advanceReceiptsAdjustEvent.adjustVoucherData;
        if (this.advanceReceiptAdjustmentData && this.advanceReceiptAdjustmentData.adjustments) {
            this.advanceReceiptAdjustmentData.adjustments?.forEach((adjustment) => {
                adjustment.voucherNumber =
                    adjustment.voucherNumber === this.commonLocaleData?.app_not_available
                        ? ""
                        : adjustment.voucherNumber;
            });
        }
        this.adjustPaymentData = advanceReceiptsAdjustEvent.adjustPaymentData;
        this.calculateAdjustedVoucherTotal(advanceReceiptsAdjustEvent.adjustVoucherData.adjustments);
        this.adjustPaymentBalanceDueData = this.getCalculatedBalanceDueAfterAdvanceReceiptsAdjustment();
        this.calculateBalanceDue();
        this.closeAdvanceReceiptModal();
    }

    /**
     * Calculates adjustment total
     *
     * @param {any[]} voucherObjectArray
     * @memberof VoucherCreateComponent
     */
    public calculateAdjustedVoucherTotal(voucherObjectArray: any[]): void {
        this.totalAdvanceReceiptsAdjustedAmount = 0;
        if (voucherObjectArray) {
            let adjustments = cloneDeep(voucherObjectArray);
            let totalAmount = 0;
            if (adjustments) {
                adjustments.forEach((item) => {
                    if (
                        (this.voucherType === AdjustedVoucherType.SalesInvoice &&
                            item?.voucherType === AdjustedVoucherType.DebitNote) ||
                        (this.voucherType === AdjustedVoucherType.PurchaseInvoice &&
                            item?.voucherType === AdjustedVoucherType.CreditNote) ||
                        (this.voucherType === AdjustedVoucherType.DebitNote &&
                            item?.voucherType === AdjustedVoucherType.OpeningBalance &&
                            item.voucherBalanceType === "dr") ||
                        ((this.voucherType === AdjustedVoucherType.DebitNote ||
                            this.voucherType === AdjustedVoucherType.SalesInvoice ||
                            this.voucherType === AdjustedVoucherType.Sales ||
                            this.voucherType === AdjustedVoucherType.Payment) &&
                            (item?.voucherType === AdjustedVoucherType.Journal ||
                                item?.voucherType === AdjustedVoucherType.JournalVoucher) &&
                            item?.voucherBalanceType === "dr") ||
                        (this.voucherType === AdjustedVoucherType.CreditNote &&
                            item?.voucherType === AdjustedVoucherType.OpeningBalance &&
                            item.voucherBalanceType === "cr") ||
                        ((this.voucherType === AdjustedVoucherType.CreditNote ||
                            this.voucherType === AdjustedVoucherType.Purchase ||
                            this.voucherType === AdjustedVoucherType.Receipt ||
                            this.voucherType === AdjustedVoucherType.AdvanceReceipt) &&
                            (item?.voucherType === AdjustedVoucherType.Journal ||
                                item?.voucherType === AdjustedVoucherType.JournalVoucher) &&
                            item?.voucherBalanceType === "cr") ||
                        ((this.voucherType === AdjustedVoucherType.Purchase ||
                            this.voucherType === AdjustedVoucherType.PurchaseInvoice) &&
                            (item?.voucherType === AdjustedVoucherType.Journal ||
                                item?.voucherType === AdjustedVoucherType.JournalVoucher) &&
                            item?.voucherBalanceType === "cr")
                    ) {
                        totalAmount -= Number(item.adjustmentAmount ? item.adjustmentAmount.amountForAccount : 0);
                    } else {
                        totalAmount += Number(item.adjustmentAmount ? item.adjustmentAmount.amountForAccount : 0);
                    }
                });
            }
            this.totalAdvanceReceiptsAdjustedAmount = totalAmount;
            this.adjustPaymentData.totalAdjustedAmount = this.totalAdvanceReceiptsAdjustedAmount;
            if (this.adjustPaymentData.totalAdjustedAmount !== 0) {
                this.isAdjustAmount = true;
            } else {
                this.isAdjustAmount = false;
            }
        } else {
            this.advanceReceiptAdjustmentData.adjustments = [];
        }
    }

    /**
     * To calculate balance due amount after adjustment of advance receipts
     *
     * @returns {number} Balance due amount
     * @memberof VoucherCreateComponent
     */
    public getCalculatedBalanceDueAfterAdvanceReceiptsAdjustment(): number {
        const tcsAdjustment = this.invoiceForm.get("isAdvanceReceipt")?.value ? this.voucherTotals.tcsTotal : 0;
        return parseFloat(
            Number(
                this.voucherTotals.grandTotal -
                this.voucherTotals.tdsTotal +
                tcsAdjustment -
                this.adjustPaymentData.totalAdjustedAmount -
                this.totalDepositAmount
            ).toFixed(this.company?.giddhBalanceDecimalPlaces)
        );
    }

    /**
     * Calculates balance due
     *
     * @memberof VoucherCreateComponent
     */
    public calculateBalanceDue(): void {
        this.getTotalDepositAmount();
        const tcsAdjustment = this.invoiceForm.get("isAdvanceReceipt")?.value ? this.voucherTotals.tcsTotal : 0;
        let depositAmount = this.totalDepositAmount;
        if (this.isMultiCurrencyVoucher) {
            const deposits = this.invoiceForm.get("deposits") as FormArray;
            if (deposits.at(0).get("currencySymbol")?.value === this.account.baseCurrencySymbol) {
                depositAmount = depositAmount * this.invoiceForm.get("exchangeRate")?.value;
            }
            depositAmount = depositAmount / this.invoiceForm.get("exchangeRate")?.value || 0;
        }

        if (isNaN(this.voucherTotals.grandTotal)) {
            this.voucherTotals.grandTotal = 0;
        }

        if (
            (this.vouchersForAdjustment?.length || this.isInvoiceAdjustedWithAdvanceReceipts) &&
            this.adjustPaymentData.totalAdjustedAmount
        ) {
            this.adjustPaymentBalanceDueData = this.getCalculatedBalanceDueAfterAdvanceReceiptsAdjustment();
        } else {
            this.adjustPaymentBalanceDueData = 0;
        }

        this.voucherTotals.balanceDue = giddhRoundOff(
            this.voucherTotals.grandTotal +
            tcsAdjustment -
            this.voucherTotals.tdsTotal -
            depositAmount -
            this.totalAdvanceReceiptsAdjustedAmount,
            this.company?.giddhBalanceDecimalPlaces
        );

        if (
            this.isUpdateMode &&
            this.isInvoiceAdjustedWithAdvanceReceipts &&
            !this.adjustPaymentData.totalAdjustedAmount
        ) {
            this.voucherTotals.balanceDue = giddhRoundOff(
                this.voucherTotals.grandTotal +
                tcsAdjustment -
                this.voucherTotals.tdsTotal -
                this.totalAdvanceReceiptsAdjustedAmount,
                this.company?.giddhBalanceDecimalPlaces
            );
        }
    }
    /**
     * Gets vouchers list for credit/debit note
     *
     * @return {*} count all deposite value
     * @memberof VoucherCreateComponent
     */
    private getTotalDepositAmount(): void {
        this.totalDepositAmount = 0;
        this.invoiceForm.get("deposits")["controls"]?.forEach((control: any) => {
            if (control.get("accountUniqueName").value && control.get("amount").value) {
                this.totalDepositAmount += Number(control.get("amount").value);
            }
        });
    }
    /**
     * Deposit account error
     *
     * @param {number} index
     * @return {*}  {boolean}
     * @memberof VoucherCreateComponent
     */
    public getEmptyDepositAccountError(index: number): boolean {
        let deposits = this.invoiceForm?.get("deposits")["controls"] as FormArray;
        let currentDepositFormGroup = deposits.at(index) as FormGroup;
        if (!currentDepositFormGroup.get("accountUniqueName").value && currentDepositFormGroup.get("amount").value) {
            return true;
        }
        return false;
    }

    /**
     * Gets vouchers list for credit/debit note
     *
     * @return {*}  {void}
     * @memberof VoucherCreateComponent
     */
    public getVoucherListForCreditDebitNote(): void {
        if (
            this.invoiceForm.controls["account"]?.get("uniqueName")?.value &&
            !this.invoiceType.isCashInvoice &&
            (this.invoiceType.isCreditNote || this.invoiceType.isDebitNote)
        ) {
            let request = {
                accountUniqueName: this.invoiceForm.controls["account"]?.get("uniqueName")?.value,
                voucherType: this.invoiceType.isCreditNote ? VoucherTypeEnum.creditNote : VoucherTypeEnum.debitNote,
                number: "",
                page: 1,
            };

            request.number = this.searchReferenceVoucher;
            request.page = this.referenceVouchersCurrentPage;

            if (request.page > 1 && this.referenceVouchersTotalPages < request.page) {
                return;
            }

            this.referenceVouchersCurrentPage++;

            if (request.page === 1) {
                this.vouchersListForCreditDebitNote = [];
                this.vouchersListForCreditDebitNote$ = observableOf(null);
            }

            let date;
            if (typeof this.invoiceForm.get("date")?.value === "string") {
                date = this.invoiceForm.get("date")?.value;
            } else {
                date = dayjs(this.invoiceForm.get("date")?.value).format(GIDDH_DATE_FORMAT);
            }

            this.componentStore.getVoucherListForCreditDebitNote({ request: request, date: date });
        }
    }

    /**
     * Gets purchase order
     *
     * @param {*} event
     * @param {boolean} addRemove
     * @memberof VoucherCreateComponent
     */
    public getPurchaseOrder(event: any, addRemove: boolean): void {
        if (event) {
            let newPo = this.invoiceForm.get("linkedPo")?.value?.filter((po) => !this.selectedPoItems?.includes(po));
            let selectedOption = this.fieldFilteredOptions?.filter((option) => option?.value === newPo[0]);
            let order = selectedOption[0];
            if (order && !this.selectedPoItems.includes(order?.value)) {
                let getRequest = { companyUniqueName: this.activeCompany?.uniqueName, poUniqueName: order?.value };
                this.purchaseOrderService
                    .get(getRequest)
                    .pipe(takeUntil(this.destroyed$))
                    .subscribe((response) => {
                        if (response) {
                            if (response.status === "success" && response.body) {
                                if (this.invoiceForm.get("linkedPo")?.value.includes(response.body.uniqueName)) {
                                    if (response.body && response.body.entries && response.body.entries.length > 0) {
                                        this.selectedPoItems.push(response.body.uniqueName);
                                        this.linkedPoNumbers[order?.value]["items"] = response.body.entries;
                                        if (addRemove) {
                                            this.addPoItems(response.body.uniqueName, response.body.entries, 0);
                                        }
                                    } else {
                                        this.linkedPoNumbers[order?.value]["items"] = [];
                                    }
                                }
                            } else {
                                this.toasterService.showSnackBar("error", response.message);
                            }
                        }
                    });
            } else {
                if (addRemove) {
                    this.removePoItem();
                }
            }
        } else {
            if (addRemove) {
                this.removePoItem();
            }
        }
    }

    /**
     * This will add the items if linked PO is selected
     *
     * @param {*} entries
     * @memberof VoucherCreateComponent
     */
    public addPoItems(poUniqueName: string, entries: any, entryIndex: number): void {
        let entry = entries[entryIndex];
        let item = entry.transactions[0];
        let blankItemIndex = -1;

        this.invoiceForm.get("entries")["controls"]?.forEach((control: any, entryIndex: number) => {
            if (!control.get("transactions.0.account.uniqueName")?.value) {
                blankItemIndex = entryIndex;
            }
        });

        if (entry.totalQuantity && entry.usedQuantity && entry.transactions && item && item.stock) {
            if (this.existingPoEntries[entry.uniqueName]) {
                item.stock.quantity = entry.usedQuantity;
            } else {
                item.stock.quantity = entry.totalQuantity - entry.usedQuantity;
            }
        }

        if (item.stock) {
            let stockUniqueName = item.stock.uniqueName;
            item.stock.uniqueName = "purchases#" + item.stock.uniqueName;
            item.uniqueName = item.stock.uniqueName;
            item.label = item.stock?.name;
            item.value = item.stock.uniqueName;
            item.additional = item.stock;
            item.additional.uniqueName = "purchases";
            item.additional.stock = {};
            item.additional.stock.uniqueName = stockUniqueName;
            if (this.existingPoEntries[entry.uniqueName]) {
                item.additional.maxQuantity = this.existingPoEntries[entry?.uniqueName];
            } else {
                item.additional.maxQuantity = item.stock.quantity;
            }
        } else {
            item.stock = undefined;
            item.uniqueName = item.account?.uniqueName;
            item.label = item.account?.name;
            item.value = item.account?.uniqueName;
            item.additional = item.account;
            if (this.existingPoEntries[entry?.uniqueName]) {
                item.additional.maxQuantity = this.existingPoEntries[entry?.uniqueName];
            } else {
                item.additional.maxQuantity = entry.totalQuantity - entry.usedQuantity;
            }
        }

        if (item.additional.maxQuantity > 0) {
            let lastIndex = -1;
            let entryFormGroup;
            if (blankItemIndex > -1) {
                lastIndex = blankItemIndex;
                entryFormGroup = this.getEntryFormGroup(lastIndex);
            } else {
                this.addNewLineEntry();
                lastIndex = this.invoiceForm.get("entries")["controls"]?.length - 1;
                entryFormGroup = this.getEntryFormGroup(lastIndex);
            }

            this.activeEntryIndex = lastIndex;
            const entryDate = this.invoiceForm.get("date")?.value || this.universalDate;

            let transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);

            if (typeof entryDate === "object") {
                transactionFormGroup.get("date")?.patchValue(dayjs(entryDate).format(GIDDH_DATE_FORMAT));
            } else {
                transactionFormGroup
                    .get("date")
                    ?.patchValue(dayjs(entryDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT));
            }

            entryFormGroup.get("description")?.patchValue(entry.description);

            const discountsFormArray = entryFormGroup.get("discounts") as FormArray;
            discountsFormArray.clear();
            if (entry.discounts?.length) {
                entry.discounts?.forEach((discount) => {
                    discountsFormArray.push(this.getTransactionDiscountFormGroup(discount));
                });
            } else {
                this.account.applicableDiscounts?.forEach((selectedDiscount) => {
                    this.discountsList()?.forEach((discount) => {
                        if (discount?.uniqueName === selectedDiscount?.uniqueName) {
                            discountsFormArray.push(this.getTransactionDiscountFormGroup(discount));
                        }
                    });
                });
            }

            const taxesFormArray = entryFormGroup.get("taxes") as FormArray;
            taxesFormArray.clear();

            const selectedTaxes = [];
            let otherTax = null;
            entry?.taxes?.forEach((selectedTax) => {
                this.allCompanyTaxes?.forEach((tax) => {
                    if (tax.uniqueName === selectedTax?.uniqueName) {
                        if (this.otherTaxTypes.includes(tax.taxType)) {
                            otherTax = tax;
                        } else {
                            selectedTaxes.push(tax);
                        }
                    }
                });
            });

            selectedTaxes?.forEach((tax) => {
                taxesFormArray.push(this.getTransactionTaxFormGroup(tax));
            });

            if (!otherTax && this.account?.applicableTaxes?.length) {
                this.allCompanyTaxes?.forEach((tax) => {
                    if (
                        this.getApplicableOtherTaxes()[0]?.uniqueName === tax?.uniqueName &&
                        this.otherTaxTypes.includes(tax.taxType)
                    ) {
                        otherTax = tax;
                    }
                });
            }

            if (otherTax) {
                const selectedOtherTax = this.allCompanyTaxes?.filter((tax) => tax.uniqueName === otherTax.uniqueName);
                otherTax["taxDetail"] = selectedOtherTax[0].taxDetail;
                otherTax["name"] = selectedOtherTax[0].name;
                this.getSelectedOtherTax(entryIndex, otherTax, otherTax.calculationMethod);
            }

            entryFormGroup
                .get("purchaseOrderItemMapping")
                ?.patchValue({ uniqueName: poUniqueName, entryUniqueName: entry?.uniqueName });

            this.activeEntryIndex = entryIndex;

            transactionFormGroup.get("account.name")?.patchValue(item.account?.name);
            transactionFormGroup.get("account.uniqueName")?.patchValue(item.account?.uniqueName);
            transactionFormGroup.get("amount.amountForAccount").patchValue(item.amount.amountForAccount);
            entryFormGroup.get("hsnNumber")?.patchValue(item.hsnNumber);
            entryFormGroup.get("sacNumber")?.patchValue(item.sacNumber);
            entryFormGroup.get("showCodeType")?.patchValue(item.hsnNumber ? "hsn" : "sac");

            if (item.stock) {
                transactionFormGroup.get("stock.name")?.patchValue(item.stock.name);
                transactionFormGroup.get("stock.uniqueName")?.patchValue(item.additional?.stock?.uniqueName);
                transactionFormGroup.get("stock.quantity")?.patchValue(item.stock.quantity);
                transactionFormGroup.get("stock.rate.rateForAccount")?.patchValue(item.stock.rate.amountForAccount);
                transactionFormGroup.get("stock.skuCode")?.patchValue(item.stock.sku);
                transactionFormGroup.get("stock.skuCodeHeading")?.patchValue(item.stock.skuCodeHeading);
                transactionFormGroup.get("stock.stockUnit.code")?.patchValue(item.stock.stockUnit?.code);
                transactionFormGroup.get("stock.stockUnit.uniqueName")?.patchValue(item.stock.stockUnit?.uniqueName);
                transactionFormGroup.get("stock.variant.getParticular")?.patchValue(false);
                transactionFormGroup.get("stock.variant.name")?.patchValue(item.additional?.variant?.name);
                transactionFormGroup.get("stock.variant.uniqueName")?.patchValue(item.additional?.variant?.uniqueName);
                transactionFormGroup.get("stock.variant.salesTaxInclusive")?.patchValue(false);
                transactionFormGroup.get("stock.variant.purchaseTaxInclusive")?.patchValue(item.stock.taxInclusive);

                this.stockUnits[entryIndex] = observableOf(item.stock.unitRates);
                this.componentStore.getStockVariants({
                    q: item.additional.stock.uniqueName,
                    index: entryIndex,
                    autoSelectVariant: false,
                });
            } else {
                this.stockVariants[entryIndex] = observableOf([]);
                this.stockUnits[entryIndex] = observableOf([]);
            }

            this.checkIfEntriesHasStock();

            if (entries?.length !== entryIndex + 1) {
                entryIndex++;
                this.addPoItems(poUniqueName, entries, entryIndex);
            }
        }
    }

    /**
     * This will remove the Items if linked PO is removed
     *
     * @memberof VoucherCreateComponent
     */
    public removePoItem(): void {
        if (this.selectedPoItems && this.selectedPoItems.length > 0) {
            setTimeout(() => {
                let selectedPoItems = [];
                this.selectedPoItems?.forEach((order) => {
                    if (!this.invoiceForm.get("linkedPo")?.value.includes(order)) {
                        let entries = this.linkedPoNumbers[order] ? this.linkedPoNumbers[order]["items"] : [];
                        let voucherEntries = this.getEntries();

                        if (entries && entries.length > 0 && voucherEntries?.length > 0) {
                            entries.forEach((entry) => {
                                entry.transactions?.forEach((item) => {
                                    let entryLoop = 0;
                                    let remainingQuantity =
                                        item.stock && item.stock.quantity !== undefined && item.stock.quantity !== null
                                            ? item.stock.quantity
                                            : 1;

                                    voucherEntries?.forEach((entry) => {
                                        let entryFormGroup = this.getEntryFormGroup(entryLoop);
                                        let entryRemoved = false;

                                        if (
                                            entryFormGroup &&
                                            remainingQuantity > 0 &&
                                            entryFormGroup.get("purchaseOrderItemMapping.uniqueName")?.value === order
                                        ) {
                                            let transactionLoop = 0;
                                            entry.transactions?.forEach((transaction) => {
                                                let transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);

                                                if (remainingQuantity > 0) {
                                                    let accountUniqueName =
                                                        transactionFormGroup.get("account.uniqueName")?.value;
                                                    if (accountUniqueName) {
                                                        accountUniqueName = accountUniqueName?.replace(
                                                            "purchases#",
                                                            ""
                                                        );
                                                    }

                                                    let stockUniqueName =
                                                        item.stock && item.stock.uniqueName
                                                            ? item.stock.uniqueName
                                                            : "";
                                                    if (stockUniqueName) {
                                                        stockUniqueName = stockUniqueName?.replace("purchases#", "");
                                                    }

                                                    if (item.stock && item.stock.uniqueName && accountUniqueName) {
                                                        if (stockUniqueName === accountUniqueName) {
                                                            if (
                                                                transactionFormGroup.get("stock.quantity")?.value >
                                                                remainingQuantity
                                                            ) {
                                                                transactionFormGroup
                                                                    .get("stock.quantity")
                                                                    ?.patchValue(
                                                                        transactionFormGroup.get("stock.quantity")
                                                                            ?.value - remainingQuantity
                                                                    );
                                                                remainingQuantity -= remainingQuantity;
                                                            } else {
                                                                remainingQuantity -=
                                                                    transactionFormGroup.get("stock.quantity")?.value;
                                                                entryRemoved = true;
                                                                this.deleteLineEntry(entryLoop);
                                                            }
                                                        }
                                                    } else if (
                                                        item.account &&
                                                        item.account.uniqueName &&
                                                        accountUniqueName
                                                    ) {
                                                        if (item.account.uniqueName === accountUniqueName) {
                                                            remainingQuantity = 0;
                                                            entryRemoved = true;
                                                            this.deleteLineEntry(entryLoop);
                                                        }
                                                    }
                                                }
                                                transactionLoop++;
                                            });
                                        }
                                        if (!entryRemoved) {
                                            entryLoop++;
                                        }
                                    });
                                });
                            });
                        }
                    } else {
                        selectedPoItems.push(order);
                    }
                });

                this.selectedPoItems = selectedPoItems;
            }, 100);
        }
    }

    /**
     * Show/hide loader
     *
     * @param {boolean} isLoading
     * @memberof VoucherCreateComponent
     */
    public startLoader(isLoading: boolean): void {
        this.showLoader.set(isLoading);
    }

    /**
     * This will use for filter purchase orders
     *
     * @param {*} search
     * @memberof VoucherCreateComponent
     */
    public filterPurchaseOrder(search: any): void {
        let filteredOptions: any[] = [];
        this.purchaseOrderNumberValueMapping = [];
        this.purchaseOrders?.forEach((option) => {
            if (typeof search !== "string" || option?.label?.toLowerCase()?.indexOf(search?.toLowerCase()) > -1) {
                filteredOptions.push({ label: option.label, value: option?.value, additional: option?.additional });
                this.purchaseOrderNumberValueMapping[option?.value] = option.label;
            }
        });
        this.fieldFilteredOptions = filteredOptions;
    }

    /**
     * Quantity change callback
     *
     * @param {*} transaction
     * @memberof VoucherCreateComponent
     */
    public handleQuantityBlur(transaction: any): void {
        if (
            this.invoiceType.isPurchaseInvoice &&
            transaction.get("stock.quantity")?.value !== undefined &&
            transaction.get("stock.maxQuantity")?.value !== undefined &&
            transaction.get("stock.maxQuantity")?.value !== null
        ) {
            if (transaction.get("stock.quantity")?.value > transaction.get("stock.maxQuantity")?.value) {
                transaction.get("stock.quantity")?.patchValue(transaction.get("stock.maxQuantity")?.value);
                this.toasterService.showSnackBar(
                    "error",
                    this.localeData?.quantity_error + " (" + transaction.get("stock.maxQuantity")?.value + ")"
                );
            }
        }
    }

    /**
     * Checks if entries has stock
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private checkIfEntriesHasStock(): void {
        this.hasStock = false;
        const entries = this.getEntries();
        entries?.forEach((entry) => {
            if (entry.transactions[0]?.stock?.uniqueName) {
                this.hasStock = true;
            }
        });
        this.showWarehouse = this.warehouses?.length && this.hasStock;
    }

    /**
     * Updates exchange rate
     *
     * @param {*} amount
     * @memberof VoucherCreateComponent
     */
    public updateExchangeRate(amount: any): void {
        amount = amount?.target?.value;
        amount = amount ? String(amount)?.replace(this.company.baseCurrencySymbol, "") : "";
        let total = amount ? parseFloat(this.generalService.removeSpecialCharactersFromAmount(amount)) || 0 : 0;
        const grandTotal = this.voucherTotals.grandTotal > 0 ? this.voucherTotals.grandTotal : 1;
        this.invoiceForm.get("exchangeRate")?.patchValue(total / grandTotal);
    }

    /**
     * Updates other tax of entry
     *
     * @param {FormGroup} entryFormGroup
     * @param {*} amount
     * @memberof VoucherCreateComponent
     */
    public updateEntryOtherTax(entryFormGroup: FormGroup, amount: any): void {
        entryFormGroup.get("otherTax.amount").patchValue(amount);
    }


    /**
     * Prefils entry
     *
     * @private
     * @param {number} entryIndex
     * @param {*} response
     * @memberof VoucherCreateComponent
     */
    private prefillParticularDetails(entryIndex: number, response: any): void {
        const entryFormGroup = this.getEntryFormGroup(entryIndex);
        const transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);

        this.activeEntryIndex = entryIndex;

        transactionFormGroup.get("account.name")?.patchValue(response.name);
        transactionFormGroup.get("account.uniqueName")?.patchValue(response.uniqueName);
        const taxesFormArray = entryFormGroup.get("taxes") as FormArray;
        taxesFormArray.clear();
        const discountsFormArray = entryFormGroup.get("discounts") as FormArray;
        discountsFormArray.clear();

        if (response.stock) {
            transactionFormGroup.get("stock.name")?.patchValue(response.stock.name);
            transactionFormGroup.get("stock.uniqueName")?.patchValue(response.stock.uniqueName);

            if (response?.stock?.customField1Value) {
                if (response?.stock?.customField1Heading) {
                    transactionFormGroup
                        .get("stock.customField1.key")
                        ?.patchValue(response?.stock?.customField1Heading);
                } else {
                    transactionFormGroup.get("stock.customField1.key")?.patchValue(this.localeData?.custom_field1);
                }
                transactionFormGroup.get("stock.customField1.value")?.patchValue(response?.stock?.customField1Value);
            }

            if (response?.stock?.customField2Value) {
                if (response?.stock?.customField2Heading) {
                    transactionFormGroup
                        .get("stock.customField2.key")
                        ?.patchValue(response?.stock?.customField2Heading);
                } else {
                    transactionFormGroup.get("stock.customField2.key")?.patchValue(this.localeData?.custom_field2);
                }
                transactionFormGroup.get("stock.customField2.value")?.patchValue(response?.stock?.customField2Value);
            }

            entryFormGroup.get("hsnNumber")?.patchValue(response.stock.hsnNumber || response.hsnNumber);
            entryFormGroup.get("sacNumber")?.patchValue(response.stock.sacNumber || response.sacNumber);
            entryFormGroup.get("showCodeType")?.patchValue(response.stock.hsnNumber || response.hsnNumber ? "hsn" : "sac");

            transactionFormGroup.get("stock.stockUnit.code")?.patchValue(response.stock.variant?.unitRates[0]?.stockUnitCode);
            transactionFormGroup.get("stock.stockUnit.uniqueName")?.patchValue(response.stock.variant?.unitRates[0]?.stockUnitUniqueName);

            let baseRate: number;
            if (response.stock.variant?.unitRates?.length) {
                baseRate = this.getRateByUnit(transactionFormGroup.get("stock.stockUnit.uniqueName")?.value, response.stock.variant?.unitRates);
            } else {
                baseRate = response.stock.rate;
            }
            const exchangeRateValue = this.invoiceForm.get("exchangeRate")?.value ?? 1;
            const rate = giddhRoundOff(baseRate / exchangeRateValue, this.company.giddhBalanceDecimalPlaces);
            transactionFormGroup.get("stock.rate.rateForAccount")?.patchValue(rate);
            transactionFormGroup.get("stock.skuCode")?.patchValue(response.stock.skuCode);
            transactionFormGroup.get("stock.skuCodeHeading")?.patchValue(response.stock.skuCodeHeading);

            if (response.stock.variant?.name) {
                transactionFormGroup.get("stock.variant.name")?.patchValue(response.stock.variant?.name);
            }
            transactionFormGroup.get("stock.variant.uniqueName")?.patchValue(response.stock.variant?.uniqueName);

            transactionFormGroup
                .get("stock.variant.salesTaxInclusive")
                ?.patchValue(response.stock.variant?.salesTaxInclusive);
            transactionFormGroup
                .get("stock.variant.purchaseTaxInclusive")
                ?.patchValue(response.stock.variant?.purchaseTaxInclusive);

            if ((response.stock.variant?.salesTaxInclusive && response.category === AccountCategoryEnum.INCOME) || (response.stock.variant?.purchaseTaxInclusive && response.category === AccountCategoryEnum.EXPENSE)) {
                transactionFormGroup
                    .get("amount.amountForAccount")
                    .patchValue(rate * transactionFormGroup.get("stock.quantity")?.value);
            }
            if (!this.invoiceType.isReceiptInvoice && !this.invoiceType.isPaymentInvoice) {
                if (response.stock.variant?.variantDiscount?.discounts) {
                    response.stock.variant?.variantDiscount?.discounts?.forEach((selectedDiscount) => {
                        this.discountsList()?.forEach((discount) => {
                            if (discount?.uniqueName === selectedDiscount?.discount?.uniqueName) {
                                discountsFormArray.push(this.getTransactionDiscountFormGroup(discount));
                            }
                        });
                    });
                } else {
                    this.account.applicableDiscounts?.forEach((selectedDiscount) => {
                        this.discountsList()?.forEach((discount) => {
                            if (discount?.uniqueName === selectedDiscount?.uniqueName) {
                                discountsFormArray.push(this.getTransactionDiscountFormGroup(discount));
                            }
                        });
                    });
                }
            }

            this.stockUnits[entryIndex] = observableOf(response.stock.variant.unitRates);
        } else {
            this.stockVariants[entryIndex] = observableOf([]);
            this.stockUnits[entryIndex] = observableOf([]);

            entryFormGroup.get("hsnNumber")?.patchValue(response.hsnNumber);
            entryFormGroup.get("sacNumber")?.patchValue(response.sacNumber);
            entryFormGroup.get("showCodeType")?.patchValue(response.hsnNumber ? "hsn" : "sac");
            if (!this.invoiceType.isReceiptInvoice && !this.invoiceType.isPaymentInvoice) {
                this.account.applicableDiscounts?.forEach((selectedDiscount) => {
                    this.discountsList()?.forEach((discount) => {
                        if (discount?.uniqueName === selectedDiscount?.uniqueName) {
                            discountsFormArray.push(this.getTransactionDiscountFormGroup(discount));
                        }
                    });
                });
            }
        }

        const taxes = this.generalService.fetchTaxesOnPriority(
            response.stock?.taxes ?? [],
            response.stock?.groupTaxes ?? [],
            response.taxes ?? [],
            response.groupTaxes ?? []
        );

        const selectedTaxes = [];
        let otherTax = null;
        taxes?.forEach((selectedTax) => {
            this.allCompanyTaxes?.forEach((tax) => {
                if (tax.uniqueName === selectedTax) {
                    if (this.otherTaxTypes.includes(tax.taxType)) {
                        otherTax = tax;
                    } else {
                        selectedTaxes.push(tax);
                    }
                }
            });
        });

        selectedTaxes?.forEach((tax) => {
            taxesFormArray.push(this.getTransactionTaxFormGroup(tax));
        });

        if (!otherTax && this.account?.applicableTaxes?.length) {
            this.allCompanyTaxes?.forEach((tax) => {
                if (
                    this.getApplicableOtherTaxes()[0]?.uniqueName === tax?.uniqueName &&
                    this.otherTaxTypes.includes(tax.taxType)
                ) {
                    otherTax = tax;
                }
            });
        }

        if (otherTax) {
            const selectedOtherTax = this.allCompanyTaxes?.filter((tax) => tax.uniqueName === otherTax.uniqueName);
            otherTax["taxDetail"] = selectedOtherTax[0].taxDetail;
            otherTax["name"] = selectedOtherTax[0].name;
            this.getSelectedOtherTax(entryIndex, otherTax, otherTax.calculationMethod);
        }

        if ((response.stock?.variant?.salesTaxInclusive && response.category === AccountCategoryEnum.INCOME) || (response.stock?.variant?.purchaseTaxInclusive && response.category === AccountCategoryEnum.EXPENSE)) {
            const amount = this.vouchersUtilityService.calculateInclusiveRate(
                entryFormGroup?.value,
                this.companyTaxes,
                this.company.giddhBalanceDecimalPlaces
            );
            transactionFormGroup.get("amount.amountForAccount").patchValue(amount);
            transactionFormGroup
                .get("stock.rate.rateForAccount")
                ?.patchValue(amount / transactionFormGroup.get("stock.quantity")?.value);
        }
        this.checkIfEntriesHasStock();
    }

    /**
    * Get rate by unit
    *
    * @param {string} stockUnitUniqueName
    * @param {any[]} unitRates
    * @returns {number}
    * @memberof VoucherCreateComponent
    */
    private getRateByUnit(stockUnitUniqueName: string, unitRates: any[]): number {
        return unitRates.find((unitRate) => unitRate.stockUnitUniqueName === stockUnitUniqueName || unitRate.stockUnitCode === stockUnitUniqueName)?.rate;
    }

    /**
     * Set barcode machine typing to false if user clicked on dropdown
     *
     * @memberof VoucherCreateComponent
     */
    public setUserManuallyClicked(): void {
        this.isBarcodeMachineTyping = false;
    }

    // CMD + G functionality
    @HostListener("document:keydown", ["$event"])
    public handleKeyboardDownEvent(event: KeyboardEvent) {
        this.startTime = event.timeStamp;
        this.handleEnterPress(event);
    }

    // detecting keyup event for barcode scan
    @HostListener("document:keyup", ["$event"])
    public handleKeyboardUpEvent(event: KeyboardEvent): void {
        const barcodeValue = this.detectBarcode(event);

        if (event.timeStamp - this.startTime < 2) {
            this.isBarcodeMachineTyping = true;
        }

        if (barcodeValue && this.startTime) {
            this.endTime = event.timeStamp;
            const scanTime = this.endTime - this.startTime;
            this.totalTime += scanTime;
            if (scanTime < 8) {
                this.isBarcodeMachineTyping = false;
                this.getStockByBarcode();
            }
            this.startTime = null;
            this.barcodeValue = "";
        }

        setTimeout(() => {
            this.isBarcodeMachineTyping = false;
            this.barcodeValue = "";
        }, 1000);
    }

    /**
     * Handles Enter key press events for voucher navigation and generation
     *
     * @private
     * @param {KeyboardEvent} event - The keyboard event
     * @memberof CreateComponent
     */
    private handleEnterPress(event: KeyboardEvent): void {
        const activeElement = document.activeElement;
        const isInputFocused = activeElement && (activeElement.tagName === HtmlElementEnum.Button || activeElement.tagName === HtmlElementEnum.Textarea);

        if (!isInputFocused && event.key === KeyCodesEnum.ENTER) {
            if (event.shiftKey) {
                // Shift+Enter: Generate voucher without preventing default
                this.generateVoucher();
            } else {
                // Regular Enter: Prevent default navigation
                event.preventDefault();
            }
        }
    }

    /**
     * Returns the string when barcode machine finishes typing the word
     *
     * @param {KeyboardEvent} event
     * @returns {(string | null)}
     * @memberof VoucherCreateComponent
     */
    public detectBarcode(event: KeyboardEvent): string | null {
        let ignoreKeyList = ["Shift", "Meta", "Backspace"];
        const key = event.key;
        if (key === "Enter") {
            if (this.barcodeValue.length) {
                return this.barcodeValue;
            } else {
                return null;
            }
        } else {
            if (!ignoreKeyList.includes(key)) {
                this.barcodeValue += this.lastScannedKey === "Shift" ? key?.toUpperCase() : key;
            }
            this.lastScannedKey = key;
            return null;
        }
    }

    /**
     * Get stock details by barcode and create transaction for it
     *
     * @returns {void}
     * @memberof VoucherCreateComponent
     */
    public getStockByBarcode(): void {
        if (!this.barcodeValue) {
            return;
        }

        const params: any = {
            barcodeValue: this.barcodeValue,
            customerUniqueName: this.invoiceForm.controls["account"]?.get("uniqueName")?.value ?? ""
        };

        if (this.invoiceType.isPurchaseOrder) {
            params.invoiceType = VoucherTypeEnum.purchase;
        } else if (this.invoiceType.isCashInvoice) {
            params.customerUniqueName = "";
            params.invoiceType = VoucherTypeEnum.sales;
        } else {
            params.invoiceType = this.invoiceForm.get("type")?.value || VoucherTypeEnum.sales;
        }

        this.commonService
            .getBarcodeScanData(params)
            .pipe(takeUntil(this.destroyed$))
            .subscribe((response) => {
                if (response && response.body && response.status === "success") {
                    this.barcodeValue = "";

                    if (!response.body?.uniqueName) {
                        this.toasterService.showSnackBar(
                            "warning",
                            response.body?.parentGroups[1] + " " + this.localeData?.account_missing_in_stock
                        );
                        return;
                    }
                    this.accountDropdown?.closeDropdownPanel();
                    let isExistingEntry = -1;
                    this.invoiceForm.get("entries")["controls"]?.forEach((control: any, entryIndex: number) => {
                        if (
                            isExistingEntry === -1 &&
                            control.get("transactions.0.stock.variant.uniqueName")?.value ===
                            response.body?.stock?.variant?.uniqueName
                        ) {
                            isExistingEntry = entryIndex;
                        }
                    });

                    if (isExistingEntry === -1) {
                        let entryFormGroup = this.getEntryFormGroup(
                            this.invoiceForm.get("entries")["controls"]?.length - 1
                        );
                        let transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);

                        if (transactionFormGroup.get("account.uniqueName")?.value) {
                            this.addNewLineEntry();
                        }

                        let activeEntryIndex = this.invoiceForm.get("entries")["controls"]?.length - 1;
                        if (response?.body?.stock) {
                            this.componentStore.getStockVariants({
                                q: response?.body?.stock?.uniqueName,
                                index: activeEntryIndex,
                                autoSelectVariant: false,
                            });
                        }

                        entryFormGroup = this.getEntryFormGroup(activeEntryIndex);
                        transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);

                        transactionFormGroup.get("stock.variant.getParticular")?.patchValue(false);

                        this.prefillParticularDetails(activeEntryIndex, response.body);
                    } else {
                        this.activeEntryIndex = isExistingEntry;

                        let entryFormGroup = this.getEntryFormGroup(this.activeEntryIndex);
                        let transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);
                        transactionFormGroup
                            .get("stock.quantity")
                            ?.patchValue(transactionFormGroup.get("stock.quantity")?.value + 1);
                        transactionFormGroup.get("stock.variant.getParticular")?.patchValue(true);
                    }
                } else {
                    this.toasterService.showSnackBar("error", response.message);
                }
            });
    }

    /**
     * This will open the purchase order preview popup
     *
     * @param {TemplateRef<any>} template
     * @param {*} purchaseOrderUniqueName
     * @memberof VoucherCreateComponent
     */
    public openPurchaseOrderPreviewPopup(
        template: TemplateRef<any>,
        purchaseOrderUniqueName: any,
        accountUniqueName: any
    ): void {
        this.purchaseOrderPreviewUniqueName = purchaseOrderUniqueName;
        this.purchaseOrderPreviewAccountUniqueName = accountUniqueName;

        this.dialog.open(template, {
            width: "980px",
        });
    }

    /**
     * Updates hsn/sac value into each other
     *
     * @param {FormGroup} entryFormGroup
     * @memberof VoucherCreateComponent
     */
    public onChangeHsnSacType(entryFormGroup: FormGroup): void {
        if (entryFormGroup.get("showCodeType")?.value === "hsn") {
            entryFormGroup.get("hsnNumber")?.patchValue(entryFormGroup.get("sacNumber")?.value);
            entryFormGroup.get("sacNumber")?.patchValue(null);
        } else {
            entryFormGroup.get("sacNumber")?.patchValue(entryFormGroup.get("hsnNumber")?.value);
            entryFormGroup.get("hsnNumber")?.patchValue(null);
        }
    }

    /**
     * Does reverse calculation if entry total changes
     *
     * @param {FormGroup} entryFormGroup
     * @memberof VoucherCreateComponent
     */
    public doReverseCalculation(entryFormGroup: FormGroup, calculateEntryTotal: boolean = false): void {
        setTimeout(() => {
            const transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);

            let entryTotal = null;
            if (!calculateEntryTotal) {
                entryTotal = Number(entryFormGroup.get("total.amountForAccount")?.value);
            }

            if (this.invoiceForm?.get('isAdvanceReceipt')?.value) {
                if (entryFormGroup.get("otherTax.type").value === this.otherTaxTypeEnum.TDS) {
                    entryTotal =
                        (entryFormGroup.get("total.amountForAccount").value ?? 0) -
                        (entryFormGroup.get("otherTax.amount").value ?? 0)
                } else if (entryFormGroup.get("otherTax.type").value === this.otherTaxTypeEnum.TCS) {
                    entryTotal =
                        (entryFormGroup.get("total.amountForAccount").value ?? 0) +
                        (entryFormGroup.get("otherTax.amount").value ?? 0)
                }
            }

            const amount = this.vouchersUtilityService.calculateInclusiveRate(
                entryFormGroup?.value,
                this.companyTaxes,
                this.company.giddhBalanceDecimalPlaces,
                entryTotal
            );
            transactionFormGroup.get("amount.amountForAccount").patchValue(amount);
            transactionFormGroup
                .get("stock.rate.rateForAccount")
                ?.patchValue(amount / transactionFormGroup.get("stock.quantity")?.value);
        }, 100);
    }

    /**
     * Calculates and updates the rate per account based on amount and quantity
     *
     * @param {number} amount - The total amount
     * @param {FormGroup} entryFormGroup - The entry form group containing transaction data
     * @memberof VoucherCreateComponent
     */
    public calculateRatePerAccount(amount: number, entryFormGroup: FormGroup): void {
        const transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);
        transactionFormGroup.get("stock.rate.rateForAccount")?.patchValue(amount / transactionFormGroup.get("stock.quantity")?.value);
    }

    /**
     * Switches currency
     *
     * @memberof VoucherCreateComponent
     */
    public switchCurrency(): void {
        this.currencySwitched = !this.currencySwitched;
        this.invoiceForm.get("exchangeRate")?.patchValue(1 / this.invoiceForm.get("exchangeRate")?.value);
    }

    /**
     * Gets voucher details
     *
     * @private
     * @param {*} params
     * @memberof VoucherCreateComponent
     */
    private getVoucherDetails(params: any): void {
        // Only proceed if params are complete
        if (!params || !params.uniqueName || !this.voucherType || !this.invoiceType) {
            return;
        }

        this.startLoader(true);

        if (this.invoiceType.isPurchaseOrder) {
            this.componentStore.getPurchaseOrderDetails(params?.uniqueName);
        } else if (this.invoiceType.isEstimateInvoice) {
            this.componentStore.getEstimateProformaDetails({
                voucherType: this.voucherType,
                payload: {
                    accountUniqueName: params?.accountUniqueName,
                    estimateNumber: params?.uniqueName,
                    voucherType: this.voucherType,
                },
            });
        } else if (this.invoiceType.isProformaInvoice) {
            this.componentStore.getEstimateProformaDetails({
                voucherType: this.voucherType,
                payload: {
                    accountUniqueName: params?.accountUniqueName,
                    proformaNumber: params?.uniqueName,
                    voucherType: this.voucherType,
                },
            });
        } else {
            if (!this.isRecurringVoucher?.[1]?.isRecurringVoucher) {
                this.componentStore.getVoucherDetails({
                    isCopyVoucher: false,
                    accountUniqueName: params?.accountUniqueName,
                    payload: { uniqueName: params?.uniqueName, voucherType: this.voucherType },
                });
            } else {
                this.componentStore.getVoucherDetails({
                    isCopyVoucher: false,
                    accountUniqueName: params?.accountUniqueName,
                    payload: { recurringVoucherUniqueName: params?.uniqueName, voucherType: this.voucherType, isRecurringVoucher: true },
                });
            }
        }
    }

    /**
         * Calculates amount if advance receipt
     *
     * @private
         * @param {FormGroup} entryFormGroup
         * @param {boolean} isUpdate
     * @memberof VoucherCreateComponent
     */
    private calculateReceiptPaymentAmount(entryFormGroup: FormGroup, isUpdate: boolean = false): void {
        if (this.invoiceType.isReceiptInvoice || this.invoiceType.isPaymentInvoice) {
            if (
                (entryFormGroup.get("otherTax.calculationMethod")?.value &&
                    entryFormGroup.get("otherTax.type")?.value) ||
                this.invoiceForm.get("isAdvanceReceipt").value
            ) {
                let taxPercentage: number = 0;
                let tdsPercentage: number = 0;
                let tcsPercentage: number = 0;
                let totalAmount: number = null;
                if (this.invoiceForm.get("isAdvanceReceipt").value) {
                    if (isUpdate) {
                        let transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);
                        totalAmount = transactionFormGroup.get("amount.amountForAccount").value;
                        if (entryFormGroup.get("otherTax")?.value?.amount) {
                            let totalTaxRate = 0;
                            const taxesArray = entryFormGroup.get("taxes") as FormArray;
                            for (let i = 0; i < taxesArray.length; i++) {
                                const taxFormGroup = taxesArray.at(i) as FormGroup;
                                const taxDetailArray = taxFormGroup.get("taxDetail") as FormArray;
                                totalTaxRate += Number(taxDetailArray.at(0)?.get("taxValue")?.value ?? 0);
                            }
                            if (totalTaxRate > 0) {
                                if (entryFormGroup.get("otherTax").value.type === this.otherTaxTypeEnum.TDS) {
                                    if (
                                        entryFormGroup.get("otherTax.calculationMethod")?.value ===
                                        SalesOtherTaxesCalculationMethodEnum.OnTotalAmount
                                    ) {
                                        totalAmount =
                                            totalAmount *
                                            (1 + totalTaxRate / 100) *
                                            (1 - entryFormGroup.get("otherTax.taxValue")?.value / 100);
                                    } else {
                                        totalAmount =
                                            totalAmount +
                                            (totalAmount * totalTaxRate) / 100 -
                                            Number(entryFormGroup.get("otherTax").value.amount);
                                    }
                                } else {
                                    if (
                                        entryFormGroup.get("otherTax.calculationMethod")?.value ===
                                        SalesOtherTaxesCalculationMethodEnum.OnTotalAmount
                                    ) {
                                        totalAmount =
                                            totalAmount *
                                            (1 + totalTaxRate / 100) *
                                            (1 + entryFormGroup.get("otherTax.taxValue")?.value / 100);
                                    } else {
                                        totalAmount =
                                            totalAmount +
                                            (totalAmount * totalTaxRate) / 100 +
                                            Number(entryFormGroup.get("otherTax").value.amount);
                                    }
                                }
                            } else {
                                if (entryFormGroup.get("otherTax").value.type === this.otherTaxTypeEnum.TDS) {
                                    totalAmount -= Number(entryFormGroup.get("otherTax").value.amount);
                                } else {
                                    totalAmount += Number(entryFormGroup.get("otherTax").value.amount);
                                }
                            }
                            totalAmount = giddhRoundOff(totalAmount, this.company.giddhBalanceDecimalPlaces);
                        } else if (entryFormGroup.get("taxes")?.value?.length > 0) {
                            let totalTaxRate = 0;
                            const taxesArray = entryFormGroup.get("taxes") as FormArray;
                            for (let i = 0; i < taxesArray.length; i++) {
                                const taxFormGroup = taxesArray.at(i) as FormGroup;
                                const taxDetailArray = taxFormGroup.get("taxDetail") as FormArray;
                                totalTaxRate += Number(taxDetailArray.at(0)?.get("taxValue")?.value ?? 0);
                            }
                            totalAmount += (totalAmount * totalTaxRate) / 100;
                            totalAmount = giddhRoundOff(totalAmount, this.company.giddhBalanceDecimalPlaces);
                        }
                    } else {
                        totalAmount = Number(entryFormGroup.get("total.amountForAccount")?.value);
                    }

                    const taxesArray = entryFormGroup.get("taxes") as FormArray;
                    for (let i = 0; i < taxesArray.length; i++) {
                        const taxFormGroup = taxesArray.at(i) as FormGroup;
                        const taxDetailArray = taxFormGroup.get("taxDetail") as FormArray;
                        taxPercentage += Number(taxDetailArray.at(0)?.get("taxValue")?.value ?? 0);
                    }
                } else {
                    totalAmount = Number(entryFormGroup.get("total.amountForAccount")?.value);
                    if (isUpdate) {
                        if (entryFormGroup.get("otherTax")?.value?.amount) {
                            if (entryFormGroup.get("otherTax.type")?.value === this.otherTaxTypeEnum.TCS) {
                                totalAmount += Number(entryFormGroup.get("otherTax").value.amount);
                            } else if (entryFormGroup.get("otherTax.type")?.value === this.otherTaxTypeEnum.TDS) {
                                totalAmount -= Number(entryFormGroup.get("otherTax").value.amount);
                            }
                            totalAmount = giddhRoundOff(totalAmount, this.company.giddhBalanceDecimalPlaces);
                        }
                    }
                }

                if (entryFormGroup.get("otherTax.type")?.value === this.otherTaxTypeEnum.TCS) {
                    tcsPercentage += entryFormGroup.get("otherTax.taxValue")?.value;
                } else {
                    tdsPercentage += entryFormGroup.get("otherTax.taxValue")?.value;
                }

                let taxableValue = this.generalService.getReceiptPaymentOtherTaxAmount(
                    entryFormGroup.get("otherTax.calculationMethod")?.value,
                    totalAmount,
                    taxPercentage,
                    tdsPercentage,
                    tcsPercentage
                );

                let taxAmount: number = null;
                if (
                    entryFormGroup.get("otherTax.calculationMethod")?.value ===
                    SalesOtherTaxesCalculationMethodEnum.OnTotalAmount
                ) {
                    taxAmount = taxableValue + (taxableValue * taxPercentage) / 100;
                }

                entryFormGroup
                    .get("otherTax.amount")
                    .patchValue(((taxAmount ?? taxableValue) * +entryFormGroup.get("otherTax.taxValue")?.value) / 100);

                let transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);
                transactionFormGroup.get("amount.amountForAccount").patchValue(taxableValue || totalAmount);
                transactionFormGroup
                    .get("amount.amountForCompany")
                    .patchValue((taxableValue || totalAmount)* (this.invoiceForm.get("exchangeRate")?.value ?? 1));

                entryFormGroup.get("total.amountForAccount").patchValue(totalAmount);
                entryFormGroup
                    .get("total.amountForCompany")
                    .patchValue(totalAmount * (this.invoiceForm.get("exchangeRate")?.value ?? 1));
                this.handleCalculateTaxInTaxDropdown();
                this.calculateVoucherTotals();
            } else {
                this.doReverseCalculation(entryFormGroup);
            }
            this.calculateVoucherTotals();
        }
    }

    /**
     * Patch profile settings
     *
     * @private
     * @param {*} keyToUpdate
     * @memberof VoucherCreateComponent
     */
    private updateProfileSetting(keyToUpdate: any): void {
        this.store.dispatch(this.settingsProfileActions.PatchProfile(keyToUpdate));
    }

    /**
     * Assigns update voucher button text
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private getUpdateVoucherText(): void {
        let updateVoucherText = this.localeData?.update_invoice;
        let invoiceType = this.invoiceType.isProformaInvoice
            ? this.localeData?.invoice_types?.proforma
            : this.invoiceType.isEstimateInvoice
                ? this.localeData?.invoice_types?.estimate
                : this.invoiceType.isSalesInvoice && !this.invoiceType.isCashInvoice
                    ? this.localeData?.invoice_types?.invoice
                    : this.invoiceType.isCreditNote && !this.invoiceType.isCashInvoice
                        ? this.localeData?.invoice_types?.credit_note
                        : this.invoiceType.isDebitNote && !this.invoiceType.isCashInvoice
                            ? this.localeData?.invoice_types?.debit_note
                            : this.invoiceType.isPurchaseInvoice && !this.invoiceType.isCashInvoice
                                ? this.localeData?.invoice_types?.purchase
                                : this.invoiceType.isCashInvoice
                                    ? this.localeData?.invoice_types?.cash_invoice
                                    : this.invoiceType.isPurchaseInvoice && this.invoiceType.isCashInvoice
                                        ? this.localeData?.invoice_types?.cash_bill
                                        : this.invoiceType.isCreditNote && this.invoiceType.isCashInvoice
                                            ? this.localeData?.invoice_types?.cash_credit_note
                                            : this.invoiceType.isDebitNote && this.invoiceType.isCashInvoice
                                                ? this.localeData?.invoice_types?.cash_debit_note
                                                : this.invoiceType.isReceiptInvoice
                                                    ? this.localeData?.invoice_types?.receipt
                                                    : this.invoiceType.isPaymentInvoice
                                                        ? this.localeData?.invoice_types?.payment
                                                        : this.localeData?.invoice_types?.purchase_order;

        invoiceType = this.titleCasePipe.transform(invoiceType);
        this.updateVoucherText = updateVoucherText?.replace("[INVOICE_TYPE]", invoiceType);
    }

    /**
     * Callback for translation complete event
     *
     * @memberof VoucherCreateComponent
     */
    public translationComplete(): void {
        this.getVoucherDateLabelPlaceholder();
        if (this.isUpdateMode) {
            this.getUpdateVoucherText();
        }
    }

    /**
     * Get stock variants
     *
     * @param {*} entry
     * @param {number} entryIndex
     * @memberof VoucherCreateComponent
     */
    public getStockVariants(entry: any, entryIndex: number): void {
        if (!this.stockVariants[entryIndex] && entry.transactions[0]?.stock?.hasVariants) {
            this.componentStore.getStockVariants({
                q: entry.transactions[0]?.stock?.uniqueName,
                index: entryIndex,
                autoSelectVariant: false,
            });
        }
    }

    /**
     * This will be use for select unit in transaction
     *
     * @param {MatSelectChange} event
     * @param {AbstractControl} transaction
     * @param {any[]} resolvedUnits
     * @memberof VoucherCreateComponent
     */
    public selectUnit(event: MatSelectChange, transaction: AbstractControl, resolvedUnits: any[]): void {
        const selectedUnitCode = resolvedUnits.find(
            (unit) => unit?.stockUnitUniqueName === event?.value
        )?.stockUnitCode;
        if (selectedUnitCode) {
            transaction.get("stock.stockUnit.code")?.patchValue(selectedUnitCode);
            transaction.get("stock.rate.rateForAccount")?.patchValue(this.getRateByUnit(selectedUnitCode, resolvedUnits));
        }
    }

    /**
     * Open sales person dialog
     *
     * @memberof VoucherCreateComponent
     */
    public openSalesPersonDialog(): void {
        const dialogRef = this.openDialogWithFocusManagement(() =>
            this.dialog.open(SalesPersonComponent, {
                ...ASIDE_PANE_CONFIG,
                autoFocus: false,
                data: { activeSalePersonUniqueName: this.invoiceForm.get('salesPersonUniqueName').value || "" }
            })
        );

        dialogRef.afterClosed().pipe(filter(Boolean), take(1), tap((res) => {
            this.getSalesPersonList();
            this.activeSalePersonIsTransfer = res.isTransfer;
        })).subscribe();
    }

    /**
     * Get sales person list as label value
     *
     * @memberof VoucherCreateComponent
     */
    public getSalesPersonList(): void {
        this.salesPersonStore.getAllSalesPerson({ isDropdown: true, params: { page: 1, count: API_BULK_FETCH_LIMIT } });
    }

    /**
     * Checks if a sales person exists by unique name
     *
     * @private
     * @param {string} uniqueName - The unique name to search for
     * @param {any[]} salesPersonList - Array of sales persons to search in
     * @returns {boolean} True if sales person exists, false otherwise
     * @memberof VoucherCreateComponent
     */
    private isSalesPersonExists(uniqueName: string, salesPersonList: IOption[]): boolean {
        if (!uniqueName || !salesPersonList?.length) return false;
        return salesPersonList.some(salesPerson => salesPerson?.value === uniqueName);
    }

    /**
      * Select voucher type
      *
      * @private
      * @param {string} type - The unique name to search for
      * @memberof VoucherCreateComponent
      */
    public selectVoucherType(value: string): void {
        this.selectedVoucherType = value?.toLowerCase();

        // Optimize type mapping using object lookup instead of if-else chain
        const typeMapping = { 'bill': 'purchase', 'invoice': 'sales' };
        const mappedType = typeMapping[this.selectedVoucherType] || this.selectedVoucherType;

        const req = {
            row: this.rowData,
            type: mappedType,
            list: this.transactionOptions,
            aiOcrDetails: this.aiOcrDetails,
            ocrType: this.ocrType
        }
        this.voucherType = this.vouchersUtilityService.parseVoucherType(req.type);
        this.getVoucherType();
        this.invoiceForm.get("type").patchValue(this.voucherType);
        this.aiOcrService.ocrListToCreate$.next(req);
    }

    /**
     * Set active entry index
     *
     * @param {number | null} index - The index to set as active
     * @memberof VoucherCreateComponent
     */
    public setActiveEntryIndex(index: number | null): void {
        this.activeEntryIndex = null;
        setTimeout(() => {
            this.activeEntryIndex = index;
            this.changeDetection.detectChanges();
        }, 1);
    }

    /**
    * Programmatically click to file input
    *
    * @memberof VoucherCreateComponent
    */
    public triggerFileInput(): void {
        this.fileInput?.nativeElement.click();
    }

    /**
     * Enhanced dialog opener with automatic focus management
     *
     * @private
     * @param dialogOpener Function that opens the dialog and returns MatDialogRef
     * @returns MatDialogRef with focus management attached
     * @memberof VoucherCreateComponent
     */
    private openDialogWithFocusManagement<T>(dialogOpener: () => MatDialogRef<T>): MatDialogRef<T> {
        if (this.lastInteraction !== InteractionType.KEYBOARD) {
            return dialogOpener();
        }
        // Store current focus
        this.lastFocusedElement = document.activeElement as HTMLElement;

        // Open dialog
        const dialogRef = dialogOpener();

        // Auto-restore focus when dialog closes
        dialogRef.afterClosed().pipe(take(1)).subscribe(() => this.restoreFocus());

        return dialogRef;
    }

    /**
     * Restores focus to the next focusable element after dialog closes
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private restoreFocus(): void {
        if (this.lastInteraction !== InteractionType.KEYBOARD) {
            return;
        }
        if (!this.lastFocusedElement) return;

        setTimeout(() => {
            try {
                // Find the next focusable element using simple utility logic
                const nextElement = this.findNextFocusableElementSimple(this.lastFocusedElement);
                if (nextElement) {
                    nextElement.focus();
                } else {
                    // Fallback to the original element if no next element found
                    this.lastFocusedElement?.focus();
                }
            } catch {
                // Fallback to first focusable element
                document.querySelector<HTMLElement>('input, button, select, textarea, [tabindex]:not([tabindex="-1"])')?.focus();
            }
            this.lastFocusedElement = null;
        }, 100);
    }

    /**
     * Finds the next focusable element after the given element using simple logic
     *
     * @private
     * @param {HTMLElement} currentElement - The current element
     * @returns {HTMLElement | null} The next focusable element or null
     * @memberof VoucherCreateComponent
     */
    private findNextFocusableElementSimple(currentElement: HTMLElement): HTMLElement | null {
        const form = currentElement.closest('form');
        if (!form) return null;

        const selector = 'input:not([tabindex="-1"]):not([disabled]), select:not([tabindex="-1"]):not([disabled]), textarea:not([tabindex="-1"]):not([disabled]), button:not([tabindex="-1"]):not([disabled]), [tabindex]:not([tabindex="-1"])';
        const elements = Array.from(form.querySelectorAll(selector)) as HTMLElement[];
        const currentIndex = elements.indexOf(currentElement);

        for (let i = currentIndex + 1; i < elements.length; i++) {
            if (this.isElementAvailableSimple(elements[i])) {
                return elements[i];
            }
        }
        return null;
    }

    /**
     * Checks if an element is available for focus using simple logic
     *
     * @private
     * @param {HTMLElement} element - Element to check
     * @returns {boolean} True if element is available for focus
     * @memberof VoucherCreateComponent
     */
    private isElementAvailableSimple(element: HTMLElement): boolean {
        if (element.offsetParent === null) return false;
        const style = window.getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden') return false;

        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
            return !element.disabled && !element.readOnly;
        }
        if (element instanceof HTMLSelectElement || element instanceof HTMLButtonElement) {
            return !element.disabled;
        }
        return true;
    }

    /**
     * Simple focus storage for dialogs without afterClosed subscriptions
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private storeFocus(customFocusElement?: HTMLElement): void {
        if (customFocusElement) {
            this.lastFocusedElement = customFocusElement as HTMLElement;
        } else {
            this.lastFocusedElement = document.activeElement as HTMLElement;
        }
    }

    /**
     * Moves focus to the next focusable element using Angular CDK, simulating Tab key behavior
     *
     * @public
     * @param {Event} event - The keyboard event
     * @memberof VoucherCreateComponent
     */
    public focusNextElement(event: Event): void {
        if (!this.platform.isBrowser) {
            return;
        }

        if (this.lastInteraction !== InteractionType.KEYBOARD) {
            return;
        }

        const currentElement = event.target as HTMLElement;
        if (!currentElement) {
            return;
        }

        // Check if this is a dropdown close event (from tax-dropdown or discount-dropdown)
        const isDropdownCloseEvent = currentElement.classList.contains('total-tax-amount') ||
            currentElement.classList.contains('total-discount-amount');

        // For dropdown close events, always proceed and set keyboard interaction
        if (isDropdownCloseEvent) {
            this.setInteractionType(InteractionType.KEYBOARD, 'Dropdown close event');
        } else if (this.lastInteraction !== InteractionType.KEYBOARD) {
            // For non-dropdown events, check interaction type
            return;
        }

        // Use Angular CDK to find focusable elements within the component's view
        const focusableElements = this.getFocusableElements();
        const currentIndex = focusableElements.indexOf(currentElement);

        if (currentIndex !== -1 && currentIndex < focusableElements.length - 1) {
            const nextElement = focusableElements[currentIndex + 1];

            // Add a small delay to ensure the dropdown has fully closed
            setTimeout(() => {
                // Use NgZone for Angular-optimized async operations
                this.ngZone.run(() => {
                    // Use FocusMonitor for better focus management
                    this.focusMonitor.focusVia(nextElement, 'keyboard');
                });
            }, 150);
        }
    }

    /**
     * Gets all focusable elements using Angular CDK patterns
     *
     * @private
     * @returns {HTMLElement[]} Array of focusable elements
     * @memberof VoucherCreateComponent
     */
    private getFocusableElements(): HTMLElement[] {
        const focusableSelectors = [
            'input:not([disabled]):not([tabindex="-1"])',
            'button:not([disabled]):not([tabindex="-1"])',
            'select:not([disabled]):not([tabindex="-1"])',
            'textarea:not([disabled]):not([tabindex="-1"])',
            '[tabindex]:not([tabindex="-1"]):not([disabled])',
            'mat-select:not([disabled])',
            'mat-checkbox:not([disabled])',
            'mat-radio-button:not([disabled])',
            '[cdkMonitorElementFocus]:not([disabled])'
        ];

        return Array.from(
            document.querySelectorAll<HTMLElement>(focusableSelectors.join(', '))
        ).filter(element => {
            // Additional Angular-specific filtering
            return element.offsetParent !== null && // Element is visible
                !element.hasAttribute('aria-hidden') && // Not hidden from screen readers
                element.tabIndex !== -1; // Can receive focus
        });
    }

    /**
     * Checks if customer/vendor is selected
     *
     * @returns {boolean} True if customer/vendor is selected
     * @memberof VoucherCreateComponent
     */
    public isCustomerVendorSelected(): boolean {
        return this.invoiceType.isCashInvoice
            ? this.invoiceForm.controls['account'].get('customerName')?.value
            : this.invoiceForm.controls['account'].get('uniqueName')?.value;
    }

    /**
     * Converts sample templates to IOption format for dropdown usage
     *
     * @param {any[]} templates - Array of template objects
     * @returns {IOption[]} Converted templates in IOption format
     * @memberof VoucherCreateComponent
     */
    public convertTemplatesToOptions(templates: any[]): IOption[] {
        if (!templates || !Array.isArray(templates)) {
            return [];
        }

        return templates.map(template => ({
            value: template?.uniqueName || template?.templateType,
            label: template?.name || template?.templateType
        }));
    }

    /**
     * Sets up global interaction tracking for the entire page
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private setupGlobalInteractionTracking(): void {
        // Create event listeners with proper binding
        this.globalKeydownListener = (event: KeyboardEvent) => {
            if (['Enter', ' ', 'ArrowDown', 'ArrowUp', 'Tab', 'Escape'].includes(event.key)) {
                this.setInteractionType(InteractionType.KEYBOARD, 'Global keydown');
            }
        };

        this.globalMousedownListener = () => {
            this.setInteractionType(InteractionType.MOUSE, 'Global mousedown');
        };

        this.globalClickListener = () => {
            this.setInteractionType(InteractionType.MOUSE, 'Global click');
        };

        // Add event listeners to document
        document.addEventListener('keydown', this.globalKeydownListener);
        document.addEventListener('mousedown', this.globalMousedownListener);
        document.addEventListener('click', this.globalClickListener);
    }

    /**
     * Opens customer/vendor dropdown
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private customerVendorDropdownOpen(): void {
        this.openAccountDropdown = false;
        setTimeout(() => {
            this.openAccountDropdown = true;
            this.changeDetection.detectChanges();
        }, 50);
    }

    /**
     * Get custom fields API call
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private getCustomFields(): void {
        this.customFieldsService.list({
            page: 1,
            count: API_BULK_FETCH_LIMIT,
            moduleUniqueName: 'account'
        }).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                if (response.status === 'success') {
                    const customFields = response.body?.results || [];
                    this.accountCustomFields$.next(customFields);
                    this.populateCustomFieldsFormArray(customFields);
                } else if (response.message) {
                    this.toasterService.errorToast(response.message);
                }
            }
        });
    }

    /**
     * Populates the custom fields form array with form groups containing uniqueName and value
     *
     * @private
     * @param {any[]} customFields - Array of custom field definitions
     * @memberof VoucherCreateComponent
     */
    private populateCustomFieldsFormArray(customFields: any[]): void {
        const customFieldsArray = this.customFieldsFormArray;

        if (!customFieldsArray) {
            return;
        }

        // Clear existing form controls
        while (customFieldsArray.length !== 0) {
            customFieldsArray.removeAt(0);
        }

        // Create form groups for each custom field
        customFields.forEach(field => {
            const customFieldGroup = this.formBuilder.group({
                uniqueName: [field.uniqueName || ''],
                value: ['']
            });
            customFieldsArray.push(customFieldGroup);
        });
    }

    /**
     * Checks if custom field should show validation errors
     *
     * @param {number} index - The index of the custom field in the FormArray
     * @returns {boolean} - True if field is dirty, has value, and is invalid
     * @memberof VoucherCreateComponent
     */
    public shouldShowCustomFieldError(index: number): boolean {
        const customFieldControl = this.invoiceForm.get(`account.customFields.${index}.value`);
        return !!(customFieldControl?.dirty && customFieldControl?.value && customFieldControl?.invalid);
    }

    /**
     * Gets the custom fields form array safely
     *
     * @public
     * @returns {FormArray} The custom fields form array
     * @memberof VoucherCreateComponent
     */
    public get customFieldsFormArray(): FormArray {
        return this.invoiceForm?.get('account.customFields') as FormArray;
    }

    /**
     * Reset the value of custom fields while preserving uniqueName
     *
     * @param {FormArray} customFieldsArray - The FormArray containing custom field controls
     * @param {any[]} customFieldsData - Optional array of custom field data to restore uniqueName values
     * @memberof VoucherCreateComponent
     */
    private resetCustomFieldsValue(customFieldsArray: FormArray, customFieldsData?: any[]): void {
        if (customFieldsData && customFieldsData.length > 0) {
            // Restore custom fields with preserved uniqueName but cleared values
            customFieldsArray.controls.forEach((customField: FormGroup, index: number) => {
                if (customFieldsData[index]) {
                    customField.get('uniqueName')?.patchValue(customFieldsData[index].uniqueName);
                    customField.get('value')?.patchValue('');
                }
            });
        } else {
            // Just clear the values, preserve existing uniqueName
            customFieldsArray.controls.forEach((customField: FormGroup) => {
                customField.get('value')?.patchValue('');
            });
        }
    }

    /**
     * Populates custom fields form array with account custom fields data
     *
     * @param {any[]} customFields - Array of custom fields from account data
     * @memberof VoucherCreateComponent
     */
    private populateCustomFields(customFields: any[]): void {
        const customFieldsFormArray = this.customFieldsFormArray;
        if (customFieldsFormArray) {
            this.resetCustomFieldsValue(customFieldsFormArray);
        }
        if (customFields?.length) {
            this.account.customFields = customFields;
            const customFieldsMap = new Map(
                customFields.map((field: any) => [field.uniqueName, field])
            );

            customFieldsFormArray.controls.forEach((customField: FormGroup) => {
                const uniqueName = customField.get('uniqueName')?.value;
                const matchingCustomField = customFieldsMap.get(uniqueName);

                if (matchingCustomField) {
                    // Convert values before patching
                    const convertedField = this.parseCustomFieldValue(matchingCustomField);
                    customField.patchValue(convertedField);
                }
            });
        }
    }

    /**
     * Parses and converts custom field values to their appropriate types
     *
     * @param {any} field - The custom field object containing value to be parsed
     * @returns {any} The field object with converted value property
     * @memberof VoucherCreateComponent
     */
    private parseCustomFieldValue(field: any): any {
        if (!field || field.value === null || field.value === undefined) {
            return field;
        }

        return {
            ...field,
            value: this.convertValueToAppropriateType(field.value)
        };
    }

    /**
     * Converts string values to their appropriate JavaScript types (boolean, number, or string)
     *
     * @param {any} value - The value to be converted
     * @returns {boolean | number | string} The converted value in its appropriate type
     * @memberof VoucherCreateComponent
     */
    private convertValueToAppropriateType(value: any): boolean | number | string {
        if (typeof value !== 'string') return value;

        const trimmed = value.trim();
        if (trimmed === '') return trimmed;

        const lower = trimmed.toLowerCase();
        if (lower === 'true') return true;
        if (lower === 'false') return false;

        const num = Number(trimmed);
        if (!isNaN(num) && isFinite(num)) return num;

        return value;
    }

    /**
     * Gets the address display text for billing or shipping details
     *
     * @param {string} addressType - Type of address ('billing' or 'shipping')
     * @param {string} entityType - Type of entity ('account' or 'company')
     * @returns {string} The formatted address display text
     * @memberof VoucherCreateComponent
     */
    public getAddressDisplayText(addressType: string, entityType: string): string {
        const addressControl = this.invoiceForm?.controls?.[entityType]?.get(`${addressType}Details`);

        if (!addressControl) {
            return '';
        }

        const name = addressControl.get('name')?.value;
        const index = addressControl.get('index')?.value;

        // If name exists, use it; otherwise use index + 1
        const displayValue = name || (index !== null && index !== undefined ? `${this.commonLocaleData?.app_address} ${index + 1}` : '');
        return displayValue ? `(${displayValue})` : '';
    }

    /**
     * Checks if the account has changed in update mode
     *
     * @returns {boolean} True if the account has changed in update mode
     * @memberof VoucherCreateComponent
     */
    public isAccountChangeInUpdateMode(): boolean {
        return this.isUpdateMode && this.isAccountChanged;
    }

    /**
     * Initializes the recurrence preview request based on query parameters
     * Sets the isRecurringVoucher flag and triggers the recurrence voucher selection logic
     * 
     * @private
     * @memberof VoucherCreateComponent
     */
    private setInitialRecurrencePreviewRequest(): void {
        this.invoiceForm.get('isRecurringVoucher')?.patchValue(Boolean(this.queryParams.isRecurringVoucher));
        this.isRecurringVoucherSelected();
    }

    /**
     * Checks if recurring voucher functionality is supported for the current voucher type
     * Recurring vouchers are not supported for Estimates, Proformas, and Purchase Orders
     * 
     * @protected
     * @returns {boolean} True if recurring voucher is supported for current voucher type
     * @memberof VoucherCreateComponent
     */
    protected isRecurringVoucherSupported(): boolean {
        return !this.invoiceType.isEstimateInvoice && !this.invoiceType.isProformaInvoice && !this.invoiceType.isPurchaseOrder;
    }

    /**
     * Gets the display name for the current voucher
     *
     * @param {boolean} isRecurring - Whether this is a recurring voucher
     * @returns {string} Display name for the voucher
     * @memberof VoucherCreateComponent
     */
    public getVoucherDisplayName(isRecurring: boolean = false): string {
        return this.vouchersUtilityService.getVoucherDisplayName(
            this.voucherType,
            this.localeData,
            this.invoiceType,
            isRecurring
        );
    }

    /**
     * Gets the primary action buttons configuration for create mode
     *
     * @protected
     * @returns {Array<{label: string, action: () => void, condition: boolean}>} Array of button configurations
     * @memberof VoucherCreateComponent
     */
    protected getPrimaryActionButtons(): Array<{label: string, action: () => void, condition: boolean}> {
        return [
            {
                label: this.localeData?.generate_sales_update_account,
                action: () => this.updateAccountAndGenerateVoucher(),
                condition: this.invoiceType.isSalesInvoice && !this.isPendingEntries && !this.queryParams.isRecurringVoucher
            },
            {
                label: this.commonLocaleData?.app_create,
                action: () => this.generateVoucher(),
                condition: this.invoiceType.isEstimateInvoice
            },
            {
                label: this.commonLocaleData?.app_create,
                action: () => this.generateVoucher(),
                condition: this.invoiceType.isProformaInvoice
            },
            {
                label: this.queryParams.isRecurringVoucher ? this.localeData?.generate_recurring_invoice : this.localeData?.generate_sales,
                action: () => this.generateVoucher(),
                condition: this.invoiceType.isSalesInvoice && !this.isPendingEntries
            },
            {
                label: this.localeData?.generate_invoice,
                action: () => this.generateVoucher(),
                condition: this.isPendingEntries && !this.invoiceType.isCashInvoice
            },
            {
                label: this.localeData?.generate_cash,
                action: () => this.generateVoucher(),
                condition: this.invoiceType.isCashInvoice && !this.invoiceType.isPurchaseInvoice && !this.invoiceType.isDebitNote && !this.invoiceType.isCreditNote
            },
            {
                label: this.queryParams.isRecurringVoucher ? this.localeData?.generate_recurring_bill : this.localeData?.generate_cash_bill,
                action: () => this.generateVoucher(),
                condition: this.invoiceType.isCashInvoice && this.invoiceType.isPurchaseInvoice
            },
            {
                label: this.localeData?.generate_cn_update_account,
                action: () => this.updateAccountAndGenerateVoucher(),
                condition: !this.invoiceType.isCashInvoice && this.invoiceType.isCreditNote && !this.queryParams.isRecurringVoucher
            },
            {
                label: this.queryParams.isRecurringVoucher ? this.localeData?.generate_recurring_credit_note : this.localeData?.generate_cn,
                action: () => this.generateVoucher(),
                condition: this.invoiceType.isCreditNote
            },
            {
                label: this.localeData?.generate_dn_update_account,
                action: () => this.updateAccountAndGenerateVoucher(),
                condition: !this.invoiceType.isCashInvoice && this.invoiceType.isDebitNote && !this.queryParams.isRecurringVoucher
            },
            {
                label: this.queryParams.isRecurringVoucher ? this.localeData?.generate_recurring_debit_note : this.localeData?.generate_dn,
                action: () => this.generateVoucher(),
                condition: this.invoiceType.isDebitNote
            },
            {
                label: this.commonLocaleData?.app_save,
                action: () => this.generateVoucher(),
                condition: !this.invoiceType.isCashInvoice && (this.invoiceType.isPurchaseInvoice || this.invoiceType.isPurchaseOrder)
            },
            {
                label: this.queryParams.isRecurringVoucher ? this.localeData?.generate_recurring_receipt : this.localeData?.create_receipt,
                action: () => this.generateVoucher(),
                condition: this.invoiceType.isReceiptInvoice
            },
            {
                label: this.queryParams.isRecurringVoucher ? this.localeData?.generate_recurring_payment : this.localeData?.create_payment,
                action: () => this.generateVoucher(),
                condition: this.invoiceType.isPaymentInvoice
            }
        ];
    }

    /**
     * Checks if more options menu should be shown
     *
     * @protected
     * @returns {boolean} True if more options menu should be displayed
     * @memberof VoucherCreateComponent
     */
    protected shouldShowMoreOptions(): boolean {
        return !this.queryParams.isRecurringVoucher && (
            this.invoiceType.isSalesInvoice ||
            this.invoiceType.isEstimateInvoice ||
            this.invoiceType.isProformaInvoice ||
            this.invoiceType.isReceiptInvoice ||
            this.invoiceType.isPaymentInvoice
        );
    }

    /**
     * Gets the update button label text
     *
     * @protected
     * @returns {string} Update button label
     * @memberof VoucherCreateComponent
     */
    protected getUpdateButtonLabel(): string {
        if (!this.queryParams.isRecurringVoucher) {
            return this.updateVoucherText;
        }
        const recurringLabels = {
            isSalesInvoice: this.localeData?.update_recurring_invoice,
            isPurchaseInvoice: this.localeData?.update_recurring_purchase,
            isCreditNote: this.localeData?.update_recurring_credit_note,
            isDebitNote: this.localeData?.update_recurring_debit_note,
            isReceiptInvoice: this.localeData?.update_recurring_receipt,
            isPaymentInvoice: this.localeData?.update_recurring_payment
        };
        const matchedKey = Object.keys(recurringLabels).find(key => this.invoiceType[key]);
        return matchedKey ? recurringLabels[matchedKey] : this.updateVoucherText;
    }

     /**
     * Focus on copy Previous 
     * 
     * @private
     * @memberof VoucherCreateComponent
     */
    private focusOnCopyPreviousBtn(): void {
         setTimeout(() => {
            this.copyVoucherElement?.nativeElement?.focus();
        }, 100);
    }
}
