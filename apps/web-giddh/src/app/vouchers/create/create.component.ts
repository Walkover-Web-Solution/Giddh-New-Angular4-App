import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { VoucherComponentStore } from "../utility/vouchers.store";
import { AppState } from "../../store";
import { Store } from "@ngrx/store";
import { Observable, ReplaySubject, combineLatest, debounceTime, delay, distinctUntilChanged, of as observableOf, take, takeUntil } from "rxjs";
import * as dayjs from "dayjs";
import { GeneralService } from "../../services/general.service";
import { OnboardingFormRequest } from "../../models/api-models/Common";
import { CommonActions } from "../../actions/common.actions";
import { CompanyActions } from "../../actions/company.actions";
import { TaxResponse } from "../../models/api-models/Company";
import { WarehouseActions } from "../../settings/warehouse/action/warehouse.action";
import { SettingsUtilityService } from "../../settings/services/settings-utility.service";
import { SettingsBranchActions } from "../../actions/settings/branch/settings.branch.action";
import { OrganizationType } from "../../models/user-login-state";
import { PreviousInvoicesVm, ProformaFilter, ProformaGetRequest, ProformaResponse } from "../../models/api-models/proforma";
import { InvoiceReceiptFilter, ReciptResponse } from "../../models/api-models/recipt";
import { VouchersUtilityService } from "../utility/vouchers.utility.service";
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from "@angular/forms";
import { GIDDH_DATE_FORMAT } from "../../shared/helpers/defaultDateFormat";
import { AccountType, BriedAccountsGroup, OtherTaxTypes, SearchType, TaxType, VoucherTypeEnum } from "../utility/vouchers.const";
import { SearchService } from "../../services/search.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { OtherTaxComponent } from "../../theme/other-tax/other-tax.component";
import { LastInvoices, OptionInterface, VoucherForm } from "../../models/api-models/Voucher";
import { PageLeaveUtilityService } from "../../services/page-leave-utility.service";
import { AddAccountRequest, UpdateAccountRequest } from "../../models/api-models/Account";
import { SalesActions } from "../../actions/sales/sales.action";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { CreateDiscountComponent } from "../../theme/create-discount/create-discount.component";
import { ConfirmationModalConfiguration } from "../../theme/confirmation-modal/confirmation-modal.interface";
import { NewConfirmationModalComponent } from "../../theme/new-confirmation-modal/confirmation-modal.component";
import { ToasterService } from "../../services/toaster.service";
import { CommonService } from "../../services/common.service";
import { PURCHASE_ORDER_STATUS } from "../../shared/helpers/purchaseOrderStatus";
import { cloneDeep, isEqual, uniqBy } from "../../lodash-optimized";
import { AdjustedVoucherType, ENTRY_DESCRIPTION_LENGTH, HIGH_RATE_FIELD_PRECISION, RATE_FIELD_PRECISION, SubVoucher } from "../../app.constant";
import { IntlPhoneLib } from "../../theme/mobile-number-field/intl-phone-lib.class";
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

@Component({
    selector: "create",
    templateUrl: "./create.component.html",
    styleUrls: ["./create.component.scss"],
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
export class VoucherCreateComponent implements OnInit, OnDestroy, AfterViewInit {
    /** Instance of RCM checkbox */
    @ViewChild("rcmCheckbox") public rcmCheckbox: ElementRef;
    /** Template Reference for Generic aside menu account */
    @ViewChild("accountAsideMenu") public accountAsideMenu: TemplateRef<any>;
    /** Instance of aside Menu Product Service modal */
    @ViewChild('asideMenuProductService') asideMenuProductService: TemplateRef<any>;
    /** Template Reference for Create Tax aside menu */
    @ViewChild("createTax") public createTax: TemplateRef<any>;
    /* Selector for send email modal */
    @ViewChild('sendEmailModal', { static: true }) public sendEmailModal: any;
    /* Selector for print modal */
    @ViewChild('printVoucherModal', { static: true }) public printVoucherModal: any;
    /** Date change confirmation modal */
    @ViewChild('dateChangeConfirmationModel', { static: true }) public dateChangeConfirmationModel: any;
    /* Selector for adjustment modal */
    @ViewChild('adjustmentModal', { static: true }) public adjustmentModal: any;
    /**  This will use for dayjs */
    public dayjs = dayjs;
    /** Holds current voucher type */
    public voucherType: string = VoucherTypeEnum.sales.toString();
    /** Holds images folder path */
    public imgPath: string = isElectron ? "assets/images/" : AppUrl + APP_FOLDER + "assets/images/";
    /** Loading Observable */
    public isLoading$: Observable<any> = this.componentStore.isLoading$;
    /** Discounts list Observable */
    public discountsList$: Observable<any> = this.componentStore.discountsList$;
    /** Discounts list Observable */
    public companyTaxes$: Observable<any> = this.componentStore.companyTaxes$;
    /** Voucher account results Observable */
    public voucherAccountResults$: Observable<OptionInterface[]> = observableOf(null);
    /** Voucher stock results Observable */
    public voucherStockResults$: Observable<OptionInterface[]> = observableOf(null);
    /** Brief accounts Observable */
    public briefAccounts$: Observable<OptionInterface[]> = observableOf(null);
    /** Last vouchers get in progress Observable */
    public getLastVouchersInProgress$: Observable<any> = this.componentStore.getLastVouchersInProgress$;
    /** Vendor purchase orders Observable */
    public vendorPurchaseOrders$: Observable<any> = this.componentStore.vendorPurchaseOrders$;
    /** Vendor purchase orders Observable */
    public linkedPoOrders$: Observable<any> = this.componentStore.linkedPoOrders$;
    /** Pending purchase orders Observable */
    public pendingPurchaseOrders$: Observable<any> = this.componentStore.pendingPurchaseOrders$;
    /** Account search request */
    public accountSearchRequest: any;
    /** Stock search request */
    public stockSearchRequest: any;
    /** Stores the voucher API version of current company */
    public voucherApiVersion: 1 | 2 = 2;
    /** Invoice Settings */
    public invoiceSettings: any;
    /** True if round off will be applicable */
    public applyRoundOff: boolean = true;
    /** Holds company specific data */
    public company: any = {
        countryName: '',
        countryCode: '',
        baseCurrency: '',
        baseCurrencySymbol: '',
        inputMaskFormat: '',
        taxType: '',
        taxTypeLabel: '',
        isTcsTdsApplicable: false,
        isActive: false,
        branch: null,
        addresses: null,
        giddhBalanceDecimalPlaces: 2,
        salesAsReceipt: null,
        purchaseAsPayment: null
    };
    /** Holds account specific data */
    public account: any = {
        countryName: '',
        countryCode: '',
        baseCurrency: '',
        baseCurrencySymbol: '',
        addresses: null,
        otherApplicableTaxes: null,
        applicableDiscounts: null,
        applicableTaxes: null,
        excludeTax: false,
        taxType: '',
        taxTypeLabel: ''
    };
    /** Invoice Settings */
    public activeCompany: any;
    /** This will hold onboarding api form request */
    public onboardingFormRequest: OnboardingFormRequest = { formName: '', country: '' };
    /** Onboarding account form fields */
    public accountFormFields: any[] = [];
    /** Onboarding company form fields */
    public companyFormFields: any[] = [];
    /** Holds company tax list  */
    public allCompanyTaxes: TaxResponse[] = [];
    /** Holds company tax list  */
    public companyTaxes: TaxResponse[] = [];
    /** Holds company discounts */
    public discountsList: any[] = [];
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
        isPurchaseOrder: false
    };
    /** Holds template data */
    public templateData: any = {
        customField1Label: '',
        customField2Label: '',
        customField3Label: '',
        shippedViaLabel: '',
        shippedDateLabel: '',
        trackingNumber: '',
        showNotesAtLastPage: false
    };
    /** Holds list of last vouchers */
    public lastVouchersList$: Observable<LastInvoices[]> = observableOf(null);
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
    /** Holds parent group unique name for create account modal */
    public accountParentGroup: string = '';
    /** True if account has unsaved changes */
    public hasUnsavedChanges: boolean = false;
    /** Holds tax types */
    public taxTypes: any = TaxType;
    /** Create tax dialog ref  */
    public taxAsideMenuRef: MatDialogRef<any>;
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
    public selectedFileName: string = '';
    /** Length of entry description */
    public entryDescriptionLength: number = ENTRY_DESCRIPTION_LENGTH;
    /** Holds universal date */
    public universalDate: any;
    /** List of stock variants */
    public stockVariants: any[] = [];
    /** List of stock units */
    public stockUnits: any[] = [];
    /** True if we need to show entry datepicker */
    public openEntryDatepicker: boolean = false;
    /** Entry index */
    private updatedEntryIndex: number;
    /** Date change type (voucher/entry) */
    private dateChangeType: string = '';
    /** Date Change modal configuration */
    public dateChangeConfiguration: ConfirmationModalConfiguration;
    /** Holds hsn/sac before edit */
    public currentHsnSac: any = {
        hsnNumber: '',
        sacNumber: ''
    };
    /** Entry index which is open in edit mode */
    public activeEntryIndex: number = null;
    /** Rate precision value that will be visible on UI */
    public ratePrecision = RATE_FIELD_PRECISION;
    /** Rate precision value that will be sent to API */
    public highPrecisionRate = HIGH_RATE_FIELD_PRECISION;
    /** Mobile number library instance */
    public intlClass: any;
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
    /** Holds account types */
    public accountType: any = AccountType;
    /** Holds list of other tax types */
    public otherTaxTypes: any[] = OtherTaxTypes;
    /** Voucher details */
    public voucherDetails: any = {};
    /** Send email dialog ref */
    public emailDialogRef: MatDialogRef<any>;
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
        customerName: '',
        customerUniquename: '',
        voucherDate: '',
        balanceDue: 0,
        dueDate: '',
        grandTotal: 0,
        gstTaxesTotal: 0,
        subTotal: 0,
        totalTaxableValue: 0,
        totalAdjustedAmount: 0,
        convertedTotalAdjustedAmount: 0
    }
    /** Total balance due date for adjustment */
    public adjustPaymentBalanceDueData: number = 0;
    /** Total advance receipts adjustment amount */
    public totalAdvanceReceiptsAdjustedAmount: number = 0;
    /** To check is selected invoice already adjusted with at least one advance receipts  */
    public isInvoiceAdjustedWithAdvanceReceipts: boolean = false;
    /**  This will use for deposit amount before update  */
    public depositAmountBeforeUpdate: number = 0;
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
    public poFilterDates: any = { from: '', to: '' };
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
    public showLoader: boolean = false;
    /** Holds true if table entry has at least single stock is selected  */
    public hasStock: boolean = false;
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
    /**Hold barcode scan total time */
    public totalTime: number = 0;
    /** This will hold barcode value*/
    public barcodeValue: string = "";
    /**Hold barcode last scanned key */
    public lastScannedKey: string = '';
    /* This will hold po unique name for preview */
    public purchaseOrderPreviewUniqueName: string = '';
    /* This will hold po account unique name for preview */
    public purchaseOrderPreviewAccountUniqueName: string = '';
    /** List of EU countries */
    public europeanCountryList: any[] = [];
    /** Create new account */
    public createNewAccount: boolean = true;
    /** True if currency switched */
    private currencySwitched: boolean = false;
    /** Label for voucher date */
    public voucherDateLabel: string = '';
    /** Label for voucher due date */
    public voucherDueDateLabel: string = '';
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
    public depositAccountName: string = '';

    /**
     * Returns true, if invoice type is sales, proforma or estimate, for these vouchers we
     * need to apply max characters limit on Notes/notes2/messsage2
     *
     * @readonly
     * @type {boolean}
     * @memberof VoucherComponent
     */
    public get shouldApplyMaxLengthOnNotes(): boolean {
        return (this.invoiceType?.isSalesInvoice || this.invoiceType?.isProformaInvoice || this.invoiceType?.isEstimateInvoice);
    }

    /** Returns true if account is selected else false */
    public get showPageLeaveConfirmation(): boolean {
        return (!this.isUpdateMode && (this.invoiceForm?.controls['account']?.get('customerName')?.value)) ? true : false;
    }

    /**
     * Show/Hide tax column if condition fulfills
     *
     * @readonly
     * @type {boolean}
     * @memberof VoucherCreateComponent
     */
    public get showTaxColumn(): boolean {
        if (this.company.countryName === 'United Kingdom' && this.europeanCountryList?.includes(this.account?.countryCode)) {
            return true;
        }

        if (this.invoiceForm.get('touristSchemeApplicable')?.value) {
            return true;
        }

        let accountPartyType = '';
        this.account?.addresses?.forEach(address => {
            if (address.isDefault) {
                accountPartyType = address.partyType.toLowerCase();
            }
        });
        if ((this.invoiceType?.isSalesInvoice || this.invoiceType?.isCreditNote) && !this.activeCompany?.withPay && (this.activeCompany?.countryV2?.alpha2CountryCode !== this.account?.countryCode || accountPartyType === 'sez' || accountPartyType === 'deemed export')) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * True if it's UK company
     *
     * @readonly
     * @type {boolean}
     * @memberof VoucherCreateComponent
     */
    public get isUkCompany(): boolean {
        return this.company.countryName === 'United Kingdom';
    }

    /**
     * True if it's UK account
     *
     * @readonly
     * @type {boolean}
     * @memberof VoucherCreateComponent
     */
    public get isUkAccount(): boolean {
        return this.account.countryName === 'United Kingdom';
    }

    /** Tax validations */
    public taxNumberValidations: any = {
        account: {
            billingDetails: null,
            shippingDetails: null
        },
        company: {
            billingDetails: null,
            shippingDetails: null
        }
    };

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private componentStore: VoucherComponentStore,
        private store: Store<AppState>,
        private generalService: GeneralService,
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
        private titleCasePipe: TitleCasePipe
    ) {

    }

    /**
     * Lifecycle hook for component initialization
     *
     * @memberof VoucherCreateComponent
     */
    public ngOnInit(): void {
        this.getVoucherVersion();
        this.initVoucherForm();
        this.getCountryList();
        this.getDiscountsList();
        this.getCompanyBranches();
        this.getCompanyTaxes();
        this.getWarehouses();

        combineLatest([this.activatedRoute.params, this.activatedRoute.queryParams]).pipe(delay(0), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                let params = response[0];
                let queryParams = response[1];

                if (queryParams?.redirect) {
                    this.redirectUrl = queryParams?.redirect;
                }

                this.company.countryName = "";
                this.openAccountDropdown = false;
                this.voucherType = this.vouchersUtilityService.parseVoucherType(params.voucherType);

                if (this.voucherApiVersion !== 2) {
                    this.router.navigate(["/pages/proforma-invoice/invoice/" + this.voucherType]);
                }

                this.resetVoucherForm(!params?.uniqueName, true);

                /** Open account dropdown on create */
                if (params?.uniqueName) {
                    this.invoiceForm.get('uniqueName').patchValue(params?.uniqueName);
                } else {
                    this.depositAccountName = "";
                }

                this.getVoucherType();


                if (params?.accountUniqueName && !params?.uniqueName) {
                    this.searchAccount(params?.accountUniqueName, 1, true);
                } else {
                    this.searchAccount();
                }

                if (params?.accountUniqueName && queryParams?.entryUniqueNames) {
                    this.isPendingEntries = true;
                    this.componentStore.getEntriesByEntryUniqueNames({ accountUniqueName: params?.accountUniqueName, payload: { entryUniqueNames: queryParams?.entryUniqueNames.split(",") } });
                } else {
                    this.isPendingEntries = false;
                }

                this.getCompanyProfile();
                this.getIsTcsTdsApplicable();
                this.getInvoiceSettings();
                this.getCreatedTemplates();
                this.getAccountOnboardingFormData();
                this.searchStock();

                if (this.invoiceType.isCashInvoice) {
                    this.invoiceForm.get('account.uniqueName')?.patchValue("cash");
                    this.componentStore.getBriefAccounts({ currency: this.company.baseCurrency, group: BriedAccountsGroup });
                } else {
                    this.invoiceForm.get('account.uniqueName')?.patchValue(null);
                }
                this.invoiceForm.get('type').patchValue(this.voucherType);

                if (params?.uniqueName) {
                    this.isUpdateMode = true;
                    this.useDefaultAccountDetails = false;
                    this.getVoucherDetails(params);
                }

                if (params?.accountUniqueName === "cash") {
                    this.invoiceType.isCashInvoice = true;
                }
            }
        });

        /** Universal date */
        this.componentStore.universalDate$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                try {
                    this.universalDate = dayjs(response[1]).format(GIDDH_DATE_FORMAT);
                    if (!this.isUpdateMode && !this.isVoucherDateChanged) {
                        this.invoiceForm.get('date')?.patchValue(this.universalDate);

                        let entryFields = [];
                        entryFields.push({ key: 'date', value: this.universalDate });
                        this.updateEntry(0, entryFields);
                    }
                } catch (e) {
                    this.universalDate = dayjs().format(GIDDH_DATE_FORMAT);
                }
            }
        });

        /** Account details */
        this.componentStore.accountDetails$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.updateAccountDataInForm(response, true);
            }
        });

        /** Company Country states */
        this.componentStore.countryData$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                const list = response?.stateList ? response?.stateList : response?.countyList;
                this.companyStateList$ = observableOf(list?.map(res => { return { label: res.name, value: res.code } }));
            }
        });

        /** Account Country states */
        this.componentStore.accountCountryData$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                const list = response?.stateList ? response?.stateList : response?.countyList;
                this.accountStateList$ = observableOf(list?.map(res => { return { label: res.name, value: res.code } }));
            }
        });

        /** Has unsaved changes */
        this.componentStore.hasSavedChanges$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.hasUnsavedChanges = response;
        });

        /** New account details */
        this.componentStore.newAccountDetails$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.createUpdateAccountCallback(response, true);
            }
        });

        /** Updated account details */
        this.componentStore.updatedAccountDetails$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.createUpdateAccountCallback(response);
            }
        });

        /** Exchange rate */
        this.componentStore.exchangeRate$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.invoiceForm.get('exchangeRate')?.patchValue(response);
            }
        });

        /** Stock Variants */
        this.componentStore.stockVariants$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                if (response.autoSelectVariant) {
                    this.stockVariants[response.entryIndex] = observableOf(response.results);
                    this.selectVariant(response.results[0], response.entryIndex);
                } else {
                    this.invoiceForm.get('entries')['controls']?.forEach((control, entryIndex) => {
                        let entryFormGroup = this.getEntryFormGroup(response.entryIndex);
                        let transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);

                        if (transactionFormGroup.get('stock.uniqueName')?.value === response.stockUniqueName && response.entryIndex === entryIndex) {
                            this.stockVariants[entryIndex] = observableOf(response.results);

                            if (!transactionFormGroup.get('stock.variant.name')?.value) {
                                const selectedVariant = response.results?.filter(variant => variant.value === transactionFormGroup.get('stock.variant.uniqueName')?.value);
                                if (selectedVariant?.length) {
                                    transactionFormGroup.get('stock.variant.name')?.patchValue(selectedVariant[0].label);
                                }
                            }
                        }
                    });
                }
            }
        });

        /** Particular details */
        this.componentStore.particularDetails$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.body) {
                this.prefillParticularDetails(response.entryIndex, response.body);
            }
        });

        /** Account billing address tax number observable */
        this.invoiceForm.controls['account'].get("billingDetails").get("taxNumber")?.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            this.checkAccountTaxValidation(searchedText, "account", "billingDetails", this.localeData?.billing_address);
        });

        /** Account shipping address tax number observable */
        this.invoiceForm.controls['account'].get("shippingDetails").get("taxNumber")?.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            this.checkAccountTaxValidation(searchedText, "account", "shippingDetails", this.localeData?.shipping_address);
        });

        /** Company billing address tax number observable */
        this.invoiceForm.controls['company'].get("billingDetails").get("taxNumber")?.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            this.checkCompanyTaxValidation(searchedText, "company", "billingDetails", this.localeData?.billing_address);
        });

        /** Company shipping address tax number observable */
        this.invoiceForm.controls['company'].get("shippingDetails").get("taxNumber")?.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            this.checkCompanyTaxValidation(searchedText, "company", "shippingDetails", this.localeData?.shipping_address);
        });

        /** Voucher details */
        this.componentStore.voucherDetails$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.getVoucherType(response);
                if (!response.isCopyVoucher) {
                    this.invoiceForm.controls["account"].get("customerName")?.patchValue(this.invoiceType.isCashInvoice ? response.account?.customerName : response.account?.name);
                    this.invoiceForm.controls["account"].get("uniqueName")?.patchValue(response.account?.uniqueName);
                    this.invoiceForm.controls["account"].get("attentionTo").patchValue(response.account?.attentionTo);
                    this.invoiceForm.controls["account"].get("email").patchValue(response.account?.email);
                    this.invoiceForm.controls["account"].get("mobileNumber").patchValue(response.account?.mobileNumber);
                }

                if (response?.purchaseOrderDetails?.length) {
                    this.purchaseOrderDetailsForEdit = response?.purchaseOrderDetails;
                    this.invoiceForm.get("linkedPo")?.patchValue(response?.purchaseOrderDetails?.map(po => { return po.uniqueName; }));
                    this.selectedPoItems = this.invoiceForm.get("linkedPo")?.value;
                }
                if (this.invoiceType.isCashInvoice) {
                    this.depositAccountName = response.account?.name;
                }

                this.getAccountDetails(response.account?.uniqueName);

                if (!response.isCopyVoucher) {
                    this.fillBillingShippingAddress("account", "billingDetails", response.account?.billingDetails, 0);
                    this.fillBillingShippingAddress("account", "shippingDetails", response.account?.shippingDetails, 0);

                    this.copyAccountBillingInShippingAddress = isEqual(response.account?.billingDetails, response.account?.shippingDetails);

                    if (this.invoiceType.isPurchaseOrder || (this.invoiceType.isPurchaseInvoice && !this.invoiceType.isCashInvoice)) {
                        this.fillBillingShippingAddress("company", "billingDetails", response.company?.billingDetails, 0);
                        this.fillBillingShippingAddress("company", "shippingDetails", response.company?.shippingDetails, 0);

                        this.copyCompanyBillingInShippingAddress = isEqual(response.company?.billingDetails, response.company?.shippingDetails);
                    }

                    this.invoiceForm.get('exchangeRate')?.patchValue(response.exchangeRate);
                    this.invoiceForm.get('number')?.patchValue(response.number);
                    this.invoiceForm.get('touristSchemeApplicable')?.patchValue(response?.touristSchemeApplicable);
                    this.invoiceForm.get('passportNumber').patchValue(response?.passportNumber);

                    this.invoiceForm.get("date").patchValue(response.date);
                    this.invoiceForm.get("dueDate").patchValue(response.dueDate);

                    if (response.referenceVoucher) {
                        this.creditDebitNoteInvoiceSelected({
                            value: response.referenceVoucher.uniqueName,
                            additional: {
                                voucherType: response.referenceVoucher.voucherType,
                                voucherNumber: response.referenceVoucher.number,
                                voucherDate: response.referenceVoucher.date
                            }
                        });
                    }

                    if (response.warehouse) {
                        this.invoiceForm.controls["warehouse"].get("name").patchValue(response.warehouse?.name);
                        this.invoiceForm.controls["warehouse"].get("uniqueName").patchValue(response.warehouse?.uniqueName);
                    }

                    this.invoiceForm.get("templateDetails.other.customField1")?.patchValue(response.templateDetails?.other?.customField1);
                    this.invoiceForm.get("templateDetails.other.customField2")?.patchValue(response.templateDetails?.other?.customField2);
                    this.invoiceForm.get("templateDetails.other.customField3")?.patchValue(response.templateDetails?.other?.customField3);
                    this.invoiceForm.get("templateDetails.other.message2")?.patchValue(response.templateDetails?.other?.message2);
                    this.invoiceForm.get("templateDetails.other.shippedVia")?.patchValue(response.templateDetails?.other?.shippedVia);
                    this.invoiceForm.get("templateDetails.other.shippingDate")?.patchValue(response.templateDetails?.other?.shippingDate);
                    this.invoiceForm.get("templateDetails.other.trackingNumber")?.patchValue(response.templateDetails?.other?.trackingNumber);

                    if (response.attachedFiles) {
                        this.invoiceForm.get("attachedFiles")?.patchValue(response.attachedFiles);
                        this.selectedFileName = response.attachedFileName;
                    }

                    this.invoiceForm.get('isRcmEntry').patchValue((response.subVoucher === SubVoucher.ReverseCharge) ? true : false);

                    if (response.adjustments?.length) {
                        response.adjustments = response.adjustments?.map(adjustment => {
                            adjustment.adjustmentAmount = adjustment.amount;
                            return adjustment;
                        });
                        this.advanceReceiptAdjustmentData = { adjustments: response.adjustments };
                        this.calculateAdjustedVoucherTotal(response.adjustments);
                    }
                }

                const entriesFormArray = this.invoiceForm.get('entries') as FormArray;
                entriesFormArray.clear();

                response.entries?.forEach((entry: any, index: number) => {
                    if (entry.transactions[0]?.stock) {
                        this.stockUnits[index] = observableOf(entry.transactions[0]?.stock.unitRates);
                    }
                    this.invoiceForm.get('entries')['controls'].push(this.getEntriesFormGroup(entry, true));

                    if (entry.discounts?.length) {
                        this.getSelectedDiscounts(index, entry.discounts);
                    }

                    if (entry.taxes) {
                        let normalTaxes = [];
                        let otherTax = null;
                        entry.taxes?.forEach(tax => {
                            if (this.otherTaxTypes.includes(tax.taxType)) {
                                otherTax = tax;
                            } else {
                                if (!tax.taxDetail) {
                                    tax.taxDetail = [{ taxValue: tax.taxPercent }];
                                }
                                normalTaxes.push(tax);
                            }
                        });

                        if (normalTaxes?.length) {
                            this.getSelectedTaxes(index, normalTaxes);
                        }

                        if (!otherTax && this.account?.otherApplicableTaxes?.length) {
                            this.allCompanyTaxes?.forEach(tax => {
                                if (this.account?.otherApplicableTaxes[0]?.uniqueName === tax?.uniqueName && this.otherTaxTypes.includes(tax.taxType)) {
                                    otherTax = tax;
                                }
                            });
                        }

                        if (otherTax) {
                            const selectedOtherTax = this.allCompanyTaxes?.filter(tax => tax.uniqueName === otherTax.uniqueName);
                            if (selectedOtherTax?.length && selectedOtherTax[0]) {
                                otherTax['taxDetail'] = selectedOtherTax[0].taxDetail;
                                otherTax['name'] = selectedOtherTax[0].name;
                                this.getSelectedOtherTax(index, otherTax, otherTax.calculationMethod);
                            }
                        }
                    }
                });

                this.checkIfEntriesHasStock();

                this.startLoader(false);
            }
        });

        /** Send email success */
        this.componentStore.sendEmailIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.emailDialogRef?.close();
            }
        });

        /** Vouchers list for adjustment */
        this.componentStore.vouchersForAdjustment$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                const results = (response.body?.results || response.body?.items || response.body);
                this.vouchersForAdjustment = results?.map(result => ({ ...result, adjustmentAmount: { amountForAccount: result.balanceDue?.amountForAccount, amountForCompany: result.balanceDue?.amountForCompany } }));
            }
        });

        /** Vouchers list for reference voucher */
        this.componentStore.voucherListForCreditDebitNote$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.body) {
                this.referenceVouchersTotalPages = response.body.totalPages;
                if (response.body.results || response.body.items) {
                    let items = [];
                    if (response.body.results) {
                        items = response.body.results;
                    } else if (response.body.items) {
                        items = response.body.items;
                    }

                    items?.forEach(invoice => this.vouchersListForCreditDebitNote?.push({ label: invoice.voucherNumber ? invoice.voucherNumber : this.commonLocaleData?.app_not_available, value: invoice?.uniqueName, additional: invoice }));
                }

                if (this.isUpdateMode) {
                    const referenceVoucher = this.invoiceForm.controls["referenceVoucher"];
                    if (referenceVoucher) {
                        let invoiceSelected = {
                            label: referenceVoucher.get("number")?.value ? referenceVoucher.get("number")?.value : this.commonLocaleData?.app_not_available,
                            value: referenceVoucher.get("uniqueName")?.value,
                            additional: referenceVoucher
                        };
                        const linkedInvoice = this.vouchersListForCreditDebitNote.find(invoice => invoice?.value === invoiceSelected?.value);
                        if (!linkedInvoice) {
                            this.vouchersListForCreditDebitNote.push(invoiceSelected);
                        }
                    }
                }
                uniqBy(this.vouchersListForCreditDebitNote, 'value');
                this.vouchersListForCreditDebitNote$ = observableOf(this.vouchersListForCreditDebitNote);
            }
        });

        /** Search for purchase order dropdown */
        this.linkPoDropdown.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(search => {
            this.filterPurchaseOrder(search);
        });

        /** Vendor purchase orders */
        this.vendorPurchaseOrders$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.purchaseOrders = response;
            this.filterPurchaseOrder("");
        });

        /** Linked purchase orders list */
        this.componentStore.linkedPoOrders$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.linkedPoNumbers = response;

            if (this.purchaseOrderDetailsForEdit && this.isUpdateMode) {
                setTimeout(() => {
                    this.purchaseOrderDetailsForEdit?.forEach(order => {
                        if (!this.linkedPoNumbers || !this.linkedPoNumbers[order?.uniqueName]) {
                            this.purchaseOrders.push({ label: order?.number, value: order?.uniqueName, additional: { grandTotal: order?.grandTotal?.amountForAccount, totalPending: order?.entries?.length } });

                            this.linkedPoNumbers[order?.uniqueName] = [];
                            this.linkedPoNumbers[order?.uniqueName]['voucherNumber'] = order?.number;
                            this.linkedPoNumbers[order?.uniqueName]['items'] = order?.entries;
                        }
                    });

                    this.filterPurchaseOrder("");
                }, 200);
            }
        });

        this.componentStore.deleteAttachmentIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.selectedFileName = "";
                this.invoiceForm.get("attachedFiles")?.patchValue([]);
                this.componentStore.resetAttachmentState();
            }
        });

        /** Deposit amount change */
        this.invoiceForm.controls['deposit'].get("amountForAccount")?.valueChanges.pipe(
            debounceTime(100),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(response => {
            this.calculateBalanceDue();
        });

        this.invoiceForm.get("exchangeRate")?.valueChanges.pipe(debounceTime(100), distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(response => {
            this.calculateVoucherTotals();
        });

        this.componentStore.lastVouchers$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                const lastVouchers: LastInvoices[] = [];
                if (!this.invoiceType.isProformaInvoice && !this.invoiceType.isEstimateInvoice) {
                    if (response) {
                        response = response as ReciptResponse;
                        response?.items?.forEach(item => {
                            lastVouchers.push({
                                voucherNumber: item.voucherNumber,
                                date: item.voucherDate,
                                grandTotal: item.grandTotal,
                                account: { name: item.account?.name, uniqueName: item.account?.uniqueName },
                                uniqueName: item?.uniqueName
                            });
                        });
                    }
                } else {
                    if (response) {
                        response = response as ProformaResponse;
                        if (response?.items?.length) {
                            response.items.forEach(item => {
                                lastVouchers.push({
                                    voucherNumber: this.invoiceType.isProformaInvoice ? item.proformaNumber : item.estimateNumber,
                                    date: item.voucherDate,
                                    grandTotal: item.grandTotal,
                                    account: { name: item.customerName, uniqueName: item.customerUniqueName },
                                    uniqueName: item?.uniqueName
                                });
                            });
                        }
                    }
                }
                this.lastVouchersList$ = observableOf([...lastVouchers]);
            }
        });

        this.componentStore.briefAccounts$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.briefAccounts$ = observableOf(response);
            }
        });

        this.componentStore.ledgerEntries$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
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
                        lastIndex = this.invoiceForm.get('entries')['controls']?.length - 1;
                        entryFormGroup = this.getEntryFormGroup(lastIndex);
                    }

                    this.activeEntryIndex = lastIndex;
                    const entryDate = this.invoiceForm.get("date")?.value || this.universalDate;

                    let transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);

                    if (typeof (entryDate) === "object") {
                        transactionFormGroup.get("date")?.patchValue(dayjs(entryDate).format(GIDDH_DATE_FORMAT));
                    } else {
                        transactionFormGroup.get("date")?.patchValue(dayjs(entryDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT));
                    }

                    entryFormGroup.get("description")?.patchValue(entry.description);

                    const discountsFormArray = entryFormGroup.get('discounts') as FormArray;
                    discountsFormArray.clear();
                    if (entry.discounts?.length) {
                        entry.discounts?.forEach(discount => {
                            discountsFormArray.push(this.getTransactionDiscountFormGroup(discount));
                        });
                    } else {
                        this.account.applicableDiscounts?.forEach(selectedDiscount => {
                            this.discountsList?.forEach(discount => {
                                if (discount?.uniqueName === selectedDiscount?.uniqueName) {
                                    discountsFormArray.push(this.getTransactionDiscountFormGroup(discount));
                                }
                            });
                        });
                    }

                    const taxesFormArray = entryFormGroup.get('taxes') as FormArray;
                    taxesFormArray.clear();

                    const selectedTaxes = [];
                    let otherTax = null;
                    entry?.taxes?.forEach(selectedTax => {
                        this.allCompanyTaxes?.forEach(tax => {
                            if (tax.uniqueName === selectedTax?.uniqueName) {
                                if (this.otherTaxTypes.includes(tax.taxType)) {
                                    otherTax = tax;
                                } else {
                                    selectedTaxes.push(tax);
                                }
                            }
                        });
                    });

                    selectedTaxes?.forEach(tax => {
                        taxesFormArray.push(this.getTransactionTaxFormGroup(tax));
                    });

                    if (!otherTax && this.account?.otherApplicableTaxes?.length) {
                        this.allCompanyTaxes?.forEach(tax => {
                            if (this.account?.otherApplicableTaxes[0]?.uniqueName === tax?.uniqueName && this.otherTaxTypes.includes(tax.taxType)) {
                                otherTax = tax;
                            }
                        });
                    }

                    if (otherTax) {
                        const selectedOtherTax = this.allCompanyTaxes?.filter(tax => tax.uniqueName === otherTax.uniqueName);
                        otherTax['taxDetail'] = selectedOtherTax[0].taxDetail;
                        otherTax['name'] = selectedOtherTax[0].name;
                        this.getSelectedOtherTax(entryIndex, otherTax, otherTax.calculationMethod);
                    }

                    this.activeEntryIndex = entryIndex;

                    transactionFormGroup.get('account.name')?.patchValue(item.account?.name);
                    transactionFormGroup.get('account.uniqueName')?.patchValue(item.account?.uniqueName);
                    transactionFormGroup.get('amount.amountForAccount').patchValue(item.amount.amountForAccount);
                    entryFormGroup.get('hsnNumber')?.patchValue(item.hsnNumber);
                    entryFormGroup.get('sacNumber')?.patchValue(item.sacNumber);
                    entryFormGroup.get('showCodeType')?.patchValue(item.hsnNumber ? 'hsn' : 'sac');

                    if (item.stock) {
                        transactionFormGroup.get('stock.name')?.patchValue(item.stock.name);
                        transactionFormGroup.get('stock.uniqueName')?.patchValue(item.additional?.stock?.uniqueName);
                        transactionFormGroup.get('stock.quantity')?.patchValue(item.stock.quantity);
                        transactionFormGroup.get('stock.rate.rateForAccount')?.patchValue(item.stock.rate.amountForAccount);
                        transactionFormGroup.get('stock.skuCode')?.patchValue(item.stock.sku);
                        transactionFormGroup.get('stock.skuCodeHeading')?.patchValue(item.stock.skuCodeHeading);
                        transactionFormGroup.get('stock.stockUnit.code')?.patchValue(item.stock.stockUnit?.code);
                        transactionFormGroup.get('stock.stockUnit.uniqueName')?.patchValue(item.stock.stockUnit?.uniqueName);
                        transactionFormGroup.get('stock.variant.getParticular')?.patchValue(false);
                        transactionFormGroup.get('stock.variant.name')?.patchValue(item.additional?.variant?.name);
                        transactionFormGroup.get('stock.variant.uniqueName')?.patchValue(item.additional?.variant?.uniqueName);
                        transactionFormGroup.get('stock.variant.salesTaxInclusive')?.patchValue(false);
                        transactionFormGroup.get('stock.variant.purchaseTaxInclusive')?.patchValue(item.stock.taxInclusive);

                        this.stockUnits[entryIndex] = observableOf(item.stock.unitRates);
                        this.componentStore.getStockVariants({ q: item.additional.stock.uniqueName, index: entryIndex, autoSelectVariant: false });
                    } else {
                        this.stockVariants[entryIndex] = observableOf([]);
                        this.stockUnits[entryIndex] = observableOf([]);
                    }

                    this.checkIfEntriesHasStock();
                });
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
        this.initIntl();
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
            this.currentVoucherFormDetails = this.vouchersUtilityService.prepareVoucherForm(this.voucherType);
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
            this.voucherDateLabel = this.invoiceType.isProformaInvoice ? this.localeData?.proforma_date : this.localeData?.estimate_date;
            this.voucherDueDateLabel = this.localeData?.expiry_date;
        } else if (this.invoiceType.isCreditNote) {
            this.voucherDateLabel = this.localeData?.cr_note_date;
        } else if (this.invoiceType.isDebitNote) {
            this.voucherDateLabel = this.localeData?.dr_note_date;
        } else if (this.invoiceType.isPurchaseInvoice) {
            this.voucherDateLabel = this.localeData?.bill_date;
            this.voucherDueDateLabel = this.localeData?.due_date;
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
        this.componentStore.isTcsTdsApplicable$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
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
        this.componentStore.invoiceSettings$.pipe(takeUntil(this.destroyed$)).subscribe(settings => {
            if (!settings) {
                this.componentStore.getInvoiceSettings();
            } else {
                this.invoiceSettings = settings;
                if (this.voucherType === VoucherTypeEnum.sales || this.voucherType === VoucherTypeEnum.cash) {
                    this.applyRoundOff = settings.invoiceSettings.salesRoundOff;
                    this.useCustomVoucherNumber = settings.invoiceSettings?.useCustomInvoiceNumber;
                } else if (this.voucherType === VoucherTypeEnum.purchase) {
                    this.applyRoundOff = settings.invoiceSettings.purchaseRoundOff;
                    this.useCustomVoucherNumber = true;
                } else if (this.voucherType === VoucherTypeEnum.debitNote) {
                    this.applyRoundOff = settings.invoiceSettings.debitNoteRoundOff;
                    this.useCustomVoucherNumber = true;
                } else if (this.voucherType === VoucherTypeEnum.creditNote) {
                    this.applyRoundOff = settings.invoiceSettings.creditNoteRoundOff;
                    this.useCustomVoucherNumber = settings.invoiceSettings?.useCustomCreditNoteNumber;
                } else if (this.voucherType === VoucherTypeEnum.estimate || this.voucherType === VoucherTypeEnum.generateEstimate || this.voucherType === VoucherTypeEnum.proforma || this.voucherType === VoucherTypeEnum.generateProforma) {
                    this.applyRoundOff = true;
                    this.useCustomVoucherNumber = true;
                } else if (this.voucherType === VoucherTypeEnum.purchaseOrder) {
                    this.useCustomVoucherNumber = settings?.purchaseBillSettings?.useCustomPONumber;
                }

                this.invoiceForm.get('roundOffApplicable')?.patchValue(this.applyRoundOff);

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
        this.componentStore.countryList$.pipe(takeUntil(this.destroyed$)).subscribe(countryList => {
            if (!countryList) {
                this.componentStore.getCountryList({ formName: '' });
            } else {
                this.europeanCountryList = countryList?.filter(country => country.europeanUnionCountry)?.map(country => { return country.alpha2CountryCode; });
            }
        });
    }

    /**
     * Gets company discount list
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private getDiscountsList(): void {
        this.componentStore.getDiscountsList();

        this.discountsList$.pipe(takeUntil(this.destroyed$)).subscribe(discountsList => {
            if (discountsList) {
                this.discountsList = discountsList;
            }
        });
    }

    /**
     * Gets company profile
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private getCompanyProfile(): void {
        this.componentStore.activeCompany$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.activeCompany = response;
                this.company.addresses = response.addresses;
                this.componentStore.companyProfile$.pipe(takeUntil(this.destroyed$)).subscribe(profile => {
                    if (profile && Object.keys(profile).length && !this.company?.countryName) {
                        this.company.countryName = profile.country;
                        this.company.countryCode = profile.countryCode || profile.countryV2.alpha2CountryCode;
                        this.company.baseCurrency = profile.baseCurrency;
                        this.company.baseCurrencySymbol = profile.baseCurrencySymbol;
                        this.company.inputMaskFormat = profile.balanceDisplayFormat?.toLowerCase() || '';
                        this.company.giddhBalanceDecimalPlaces = profile.balanceDecimalPlaces;
                        this.company.salesAsReceipt = profile.salesAsReceipt;
                        this.company.purchaseAsPayment = profile.purchaseAsPayment;
                        this.invoiceForm.get('salesPurchaseAsReceiptPayment').patchValue(this.invoiceType.isCashInvoice && this.invoiceType.isPurchaseInvoice ? profile.purchaseAsPayment : profile.salesAsReceipt);
                        this.showCompanyTaxTypeByCountry(this.company.countryCode);

                        this.getCountryData(this.company.countryCode);

                        if (this.invoiceType.isCashInvoice) {
                            this.componentStore.getAccountCountryStates(this.company.countryCode);
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
        this.account.taxType = this.vouchersUtilityService.showTaxTypeByCountry(countryCode, this.activeCompany?.countryV2?.alpha2CountryCode);
        if (this.account.taxType) {
            if (this.account.taxType === TaxType.GST) {
                this.account.taxTypeLabel = this.commonLocaleData?.app_gstin;
            } else if (this.account.taxType === TaxType.VAT) {
                this.account.taxTypeLabel = this.commonLocaleData?.app_enter_vat;
            } else if (this.account.taxType === TaxType.TRN) {
                this.account.taxTypeLabel = this.commonLocaleData?.app_trn;
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
        this.company.taxType = this.vouchersUtilityService.showTaxTypeByCountry(countryCode, this.activeCompany?.countryV2?.alpha2CountryCode);
        if (this.company.taxType) {
            if (this.company.taxType === TaxType.GST) {
                this.company.taxTypeLabel = this.commonLocaleData?.app_gstin;
            } else if (this.company.taxType === TaxType.VAT) {
                this.company.taxTypeLabel = this.commonLocaleData?.app_enter_vat;
            } else if (this.company.taxType === TaxType.TRN) {
                this.company.taxTypeLabel = this.commonLocaleData?.app_trn;
            }

            const onboardingFormRequest = {
                formName: 'onboarding',
                country: countryCode
            };

            this.commonService.getOnboardingForm(onboardingFormRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response) {
                    this.companyFormFields = [];
                    Object.keys(response.body?.fields)?.forEach(key => {
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
            this.onboardingFormRequest.formName = 'onboarding';
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
        this.componentStore.onboardingForm$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.accountFormFields = [];
                Object.keys(response.fields)?.forEach(key => {
                    if (response?.fields[key]) {
                        this.accountFormFields[response.fields[key]?.name] = [];
                        this.accountFormFields[response.fields[key]?.name] = response.fields[key];
                    }
                });
            }
        })
    }

    /**
     * Gets company taxes
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private getCompanyTaxes(): void {
        this.store.dispatch(this.companyActions.getTax());

        this.componentStore.companyTaxes$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.allCompanyTaxes = response;
                this.companyTaxes = response?.filter(tax => !this.otherTaxTypes.includes(tax.taxType));
            }
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

        this.componentStore.warehouseList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                let warehouseResults = response.results?.filter(warehouse => !warehouse.isArchived);
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
        this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '' }));

        this.componentStore.branchList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.branches = response;
                this.company.isActive = this.generalService.currentOrganizationType !== OrganizationType.Branch && this.branches?.length > 1;

                if (this.generalService.currentOrganizationType === OrganizationType.Branch) {
                    // Find the current checked out branch
                    this.company.branch = response.find(branch => branch?.uniqueName === this.generalService.currentBranchUniqueName);
                } else {
                    // Find the HO branch
                    this.company.branch = response.find(branch => !branch.parentBranch);
                }
            }
        });
    }

    /**
     * Fetches last 5 vouchers
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private fetchPreviousVouchers(): void {
        if (this.invoiceType.isProformaInvoice || this.invoiceType.isEstimateInvoice) {
            let filterRequest: ProformaFilter = new ProformaFilter();
            filterRequest.sortBy = this.invoiceType.isProformaInvoice ? 'proformaDate' : 'estimateDate';
            filterRequest.sort = 'desc';
            filterRequest.count = 5;
            filterRequest.isLastInvoicesRequest = true;
            this.componentStore.getPreviousProformaEstimates({ model: filterRequest, type: this.invoiceType.isProformaInvoice ? 'proformas' : 'estimates' });
        } else {
            let request: InvoiceReceiptFilter = new InvoiceReceiptFilter();
            request.sortBy = 'voucherDate';
            request.sort = 'desc';
            request.count = 5;
            request.isLastInvoicesRequest = true;
            this.componentStore.getPreviousVouchers({ model: request, type: this.voucherType });
        }
    }

    /**
     * Gets template list and use labels from default template
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private getCreatedTemplates(): void {
        this.componentStore.createdTemplates$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (!response) {
                this.componentStore.getCreatedTemplates(this.invoiceType.isDebitNote || this.invoiceType.isCreditNote ? 'voucher' : 'invoice');
            } else {
                const defaultTemplate = response.find(template => (template.isDefault || template.isDefaultForVoucher));
                if (defaultTemplate && defaultTemplate.sections) {
                    const sections = defaultTemplate.sections;
                    if (sections.header && sections.header.data) {
                        const {
                            customField1: { label: customField1Label },
                            customField2: { label: customField2Label },
                            customField3: { label: customField3Label },
                            shippedVia: { label: shippedViaLabel },
                            shippingDate: { label: shippedDateLabel },
                            trackingNumber: { label: trackingNumber }
                        } = sections.header.data;

                        this.templateData = {
                            customField1Label,
                            customField2Label,
                            customField3Label,
                            shippedViaLabel,
                            shippedDateLabel,
                            trackingNumber,
                            showNotesAtLastPage: (sections?.footer?.data) ? sections.footer.data.showNotesAtLastPage?.display : false
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
    public searchAccount(query: string = '', page: number = 1, selectAccount: boolean = false): void {
        if (this.voucherType === VoucherTypeEnum.cash) {
            return;
        }

        if (this.accountSearchRequest?.isLoading) {
            return;
        }

        let accountSearchRequest = this.vouchersUtilityService.getSearchRequestObject(this.voucherType, query, page, SearchType.CUSTOMER);
        if (selectAccount) {
            accountSearchRequest.group = undefined;
        }
        this.accountSearchRequest = cloneDeep(accountSearchRequest);
        this.accountSearchRequest.isLoading = true;

        this.searchService.searchAccountV3(accountSearchRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.body?.results?.length) {
                this.accountSearchRequest.loadMore = true;
                let voucherAccountResults = [];
                if (page > 1) {
                    this.voucherAccountResults$.subscribe(res => voucherAccountResults = res);
                }
                const newResults = response?.body?.results?.map(res => { return { label: res.name, value: res.uniqueName, additional: res } });

                if (selectAccount) {
                    this.invoiceForm.controls["account"].get("uniqueName")?.patchValue(query);
                    const selectedAccount = newResults?.filter(account => account.value === query);
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
                    this.invoiceForm.controls["account"].get("uniqueName")?.patchValue(query);
                    this.selectAccount({ label: "", value: query });
                }
            }
            this.accountSearchRequest.isLoading = false;
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
    public searchStock(query: string = '', page: number = 1): void {
        if (this.stockSearchRequest?.isLoading) {
            return;
        }

        let stockSearchRequest = this.vouchersUtilityService.getSearchRequestObject(this.voucherType, query, page, SearchType.ITEM);
        this.stockSearchRequest = cloneDeep(stockSearchRequest);
        this.stockSearchRequest.isLoading = true;

        this.searchService.searchAccountV3(stockSearchRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.body?.results?.length) {
                this.stockSearchRequest.loadMore = true;
                let voucherStockResults = [];
                if (page > 1) {
                    this.voucherStockResults$.subscribe(res => voucherStockResults = res);
                }
                const newResults = response?.body?.results?.map(res => { return { label: res.name, value: res.uniqueName, additional: res } });
                this.voucherStockResults$ = observableOf(voucherStockResults.concat(...newResults));
            } else {
                this.stockSearchRequest.loadMore = false;
                if (page === 1) {
                    this.voucherStockResults$ = observableOf(null);
                }
            }
            this.stockSearchRequest.isLoading = false;
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
            if (typeof voucherDate === 'string') {
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
        this.componentStore.getAccountDetails(accountUniqueName);

        if (!this.invoiceType.isCashInvoice && (this.invoiceType.isSalesInvoice || this.invoiceType.isPurchaseInvoice || this.invoiceType.isCreditNote || this.invoiceType.isDebitNote)) {
            this.fetchPreviousVouchers();
            this.getAllVouchersForAdjustment();
            this.getVoucherListForCreditDebitNote();
        }

        if (this.invoiceType.isPurchaseInvoice && !this.invoiceType.isCashInvoice) {
            let request = { companyUniqueName: this.activeCompany?.uniqueName, accountUniqueName: accountUniqueName, page: 1, count: 100, sort: '', sortBy: '' };
            let payload = { statuses: [PURCHASE_ORDER_STATUS.open, PURCHASE_ORDER_STATUS.partiallyConverted] };
            this.componentStore.getVendorPurchaseOrders({ request: request, payload: payload, commonLocaleData: this.commonLocaleData });
        }

        if (this.invoiceType.isPurchaseOrder) {
            let request = { companyUniqueName: this.activeCompany.uniqueName, accountUniqueName: accountUniqueName, page: 1, count: 10, sort: '', sortBy: '' };
            let payload = { statuses: [PURCHASE_ORDER_STATUS.open, PURCHASE_ORDER_STATUS.partiallyConverted, PURCHASE_ORDER_STATUS.expired, PURCHASE_ORDER_STATUS.cancelled] };

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
    public handleSearchStockScrollEnd(): void {
        if (this.stockSearchRequest.loadMore) {
            let page = this.stockSearchRequest.page + 1;
            this.searchStock(this.stockSearchRequest.query, page);
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
        if (isClear) {
            if (this.invoiceForm.controls["account"].get("customerName")?.value || this.invoiceForm.controls["account"].get("uniqueName")?.value) {
                this.resetVoucherForm();
            }
        } else {
            this.invoiceForm.controls["account"].get("customerName")?.patchValue(event?.label);
            this.getAccountDetails(event?.value);
            this.activeEntryIndex = 0;
        }
        this.openAccountDropdown = false;

        if (this.showPageLeaveConfirmation) {
            this.pageLeaveUtilityService.addBrowserConfirmationDialog();
        } else {
            this.pageLeaveUtilityService.removeBrowserConfirmationDialog();
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
            this.deleteLineEntry(entryIndex);
            return;
        }

        if (event && !isClear) {
            const entryFormGroup = this.getEntryFormGroup(entryIndex);
            const transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);

            transactionFormGroup.get('account.name')?.patchValue(event?.label);
            transactionFormGroup.get('account.uniqueName')?.patchValue(event?.account?.uniqueName || event?.value);

            if (event?.additional?.stock?.uniqueName) {
                transactionFormGroup.get('stock.name')?.patchValue(event?.additional?.stock?.name);
                transactionFormGroup.get('stock.uniqueName')?.patchValue(event?.additional?.stock?.uniqueName);
            }

            if (event?.additional?.hasVariants) {
                this.componentStore.getStockVariants({ q: event?.additional?.stock?.uniqueName, index: entryIndex, autoSelectVariant: true });
            } else {
                this.stockVariants[entryIndex] = observableOf([]);
                this.stockUnits[entryIndex] = observableOf([]);

                if (transactionFormGroup.get('stock.variant.getParticular')?.value) {
                    let payload = {};

                    if (event?.additional?.stock?.uniqueName) {
                        payload = { stockUniqueName: event?.additional?.stock?.uniqueName, customerUniqueName: this.invoiceForm.get('account.uniqueName')?.value };
                    }

                    this.componentStore.getParticularDetails({ accountUniqueName: transactionFormGroup.get("account.uniqueName")?.value, payload: payload, entryIndex: entryIndex });
                } else {
                    transactionFormGroup.get('stock.variant.getParticular')?.patchValue(true);
                }
            }

            this.checkIfEntriesHasStock();
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
            const transactionStockVariantFormGroup = transactionFormGroup.get('stock').get('variant');

            transactionStockVariantFormGroup.get('name')?.patchValue(event?.label);
            transactionStockVariantFormGroup.get('uniqueName')?.patchValue(event?.value);

            if (transactionFormGroup.get('stock.variant.getParticular')?.value) {
                this.componentStore.getParticularDetails({ accountUniqueName: transactionFormGroup.get("account.uniqueName")?.value, payload: { variantUniqueName: event?.value, customerUniqueName: this.invoiceForm.get('account.uniqueName')?.value }, entryIndex: entryIndex });
            } else {
                transactionFormGroup.get('stock.variant.getParticular')?.patchValue(true);
            }
        }
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

        let isPartyTypeSez = false;
        if (accountData?.addresses?.length > 0) {
            accountData.addresses.forEach(address => {
                if (address.partyType && address.partyType.toLowerCase() === "sez") {
                    isPartyTypeSez = true;
                }
            });
        }

        if (this.account?.baseCurrency !== accountData.currency) {
            this.componentStore.getBriefAccounts({ currency: accountData?.baseCurrency + ', ' + this.company.baseCurrency, group: BriedAccountsGroup });
        }

        this.account.countryName = accountData.country?.countryName;
        this.account.countryCode = accountData.country?.countryCode;
        this.account.baseCurrency = accountData.currency;
        this.account.baseCurrencySymbol = accountData.currencySymbol;
        this.account.addresses = accountData.addresses;
        this.account.otherApplicableTaxes = accountData.otherApplicableTaxes;
        this.account.applicableDiscounts = accountData.applicableDiscounts || accountData.inheritedDiscounts;
        this.account.applicableTaxes = accountData.applicableTaxes;
        this.account.excludeTax = (this.company.countryName === "India" && accountData.country?.countryName !== "India") || isPartyTypeSez;

        this.isMultiCurrencyVoucher = this.account.baseCurrency !== this.company.baseCurrency;

        let index = 0;

        if (this.useDefaultAccountDetails) {
            if (this.isMultiCurrencyVoucher) {
                this.getExchangeRate(this.account.baseCurrency, this.company.baseCurrency, this.invoiceForm.get('date')?.value);
            }

            let defaultAddress = null;

            let accountDefaultAddress = this.vouchersUtilityService.getDefaultAddress(accountData);
            defaultAddress = accountDefaultAddress.defaultAddress;
            index = accountDefaultAddress.defaultAddressIndex;

            if (defaultAddress) {
                this.fillBillingShippingAddress("account", "billingDetails", defaultAddress, index);
                this.fillBillingShippingAddress("account", "shippingDetails", defaultAddress, index);
            }

            if (this.invoiceType.isPurchaseOrder || (this.invoiceType.isPurchaseInvoice && !this.invoiceType.isCashInvoice)) {
                let companyDefaultAddress = this.vouchersUtilityService.getDefaultAddress(this.company?.branch);
                defaultAddress = companyDefaultAddress.defaultAddress;
                index = companyDefaultAddress.defaultAddressIndex;

                if (defaultAddress) {
                    this.fillBillingShippingAddress("company", "billingDetails", defaultAddress, index);
                    this.fillBillingShippingAddress("company", "shippingDetails", defaultAddress, index);
                }
            }

            this.invoiceForm.controls["account"].get("customerName")?.patchValue(accountData?.name);
            this.invoiceForm.controls["account"].get("attentionTo").setValue(accountData?.attentionTo);
            this.invoiceForm.controls["account"].get("email").setValue(accountData?.email);
            this.invoiceForm.controls["account"].get("mobileNumber").setValue(accountData?.mobileNo);
        } else {
            if (!this.invoiceSettings?.invoiceSettings?.voucherAddressManualEnabled && !this.invoiceType.isCashInvoice) {
                const accountBillingAddressIndex = this.vouchersUtilityService.getSelectedAddressIndex(accountData.addresses, this.invoiceForm.controls["account"].get("billingDetails")?.value);
                const accountShippingAddressIndex = this.vouchersUtilityService.getSelectedAddressIndex(accountData.addresses, this.invoiceForm.controls["account"].get("shippingDetails")?.value);

                if (accountBillingAddressIndex > -1) {
                    this.invoiceForm.controls["account"].get("billingDetails").get("index").patchValue(accountBillingAddressIndex);
                }

                if (accountShippingAddressIndex > -1) {
                    this.invoiceForm.controls["account"].get("shippingDetails").get("index").patchValue(accountShippingAddressIndex);
                }

                if (this.invoiceType.isPurchaseOrder || (this.invoiceType.isPurchaseInvoice && !this.invoiceType.isCashInvoice)) {
                    const companyBillingAddressIndex = this.vouchersUtilityService.getSelectedAddressIndex(this.company?.addresses, this.invoiceForm.controls["company"].get("billingDetails")?.value);
                    const companyShippingAddressIndex = this.vouchersUtilityService.getSelectedAddressIndex(this.company?.addresses, this.invoiceForm.controls["company"].get("shippingDetails")?.value);

                    if (companyBillingAddressIndex > -1) {
                        this.invoiceForm.controls["company"].get("billingDetails").get("index").patchValue(companyBillingAddressIndex);
                    }
                    if (companyShippingAddressIndex > -1) {
                        this.invoiceForm.controls["company"].get("shippingDetails").get("index").patchValue(companyShippingAddressIndex);
                    }
                }
            }
        }
    }

    /**
     * Fills billing / shipping address in form group
     *
     * @param {string} addressType
     * @param {*} address
     * @memberof VoucherCreateComponent
     */
    public fillBillingShippingAddress(entityType: string, addressType: string, address: any, index: number): void {
        this.invoiceForm.controls[entityType].get(addressType).get("index").patchValue(index);
        this.invoiceForm.controls[entityType].get(addressType).get("address").patchValue(typeof address?.address === "string" ? [address?.address] : address?.address);
        this.invoiceForm.controls[entityType].get(addressType).get("pincode").patchValue(address?.pincode);
        this.invoiceForm.controls[entityType].get(addressType).get("taxNumber").patchValue(address?.gstNumber || address?.taxNumber);
        this.invoiceForm.controls[entityType].get(addressType).get("state").get("name").patchValue(address?.state?.name ? address?.state?.name : address?.stateName ? address?.stateName : "");
        this.invoiceForm.controls[entityType].get(addressType).get("state").get("code").patchValue(address?.state?.code ? address?.state?.code : address?.stateCode ? address?.stateCode : "");
    }

    /**
     * Initializes voucher form
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private initVoucherForm(): void {
        this.invoiceForm = this.formBuilder.group({
            account: this.formBuilder.group({
                customerName: [''],
                uniqueName: ['', Validators.required],
                attentionTo: [''],
                mobileNumber: [''],
                email: ['', Validators.email],
                billingDetails: this.getAddressFormGroup(),
                shippingDetails: this.getAddressFormGroup()
            }),
            company: this.formBuilder.group({
                billingDetails: this.getAddressFormGroup(),
                shippingDetails: this.getAddressFormGroup()
            }),
            date: ['', Validators.required],
            dueDate: ['', Validators.required],
            exchangeRate: [1, Validators.required],
            number: [''],
            roundOffApplicable: [true],
            type: ['', Validators.required],
            updateAccountDetails: [false],
            subVoucher: [''],
            deposit: this.formBuilder.group({
                accountUniqueName: [''],
                amountForAccount: [''],
                currencySymbol: [''], //temp
                type: ['DEBIT']
            }),
            warehouse: this.formBuilder.group({
                name: [''],
                uniqueName: ['']
            }),
            templateDetails: this.formBuilder.group({
                other: this.formBuilder.group({
                    customField1: [''],
                    customField2: [''],
                    customField3: [''],
                    message2: [''],
                    shippedVia: [''],
                    shippingDate: [''],
                    trackingNumber: ['']
                })
            }),
            entries: this.formBuilder.array([this.getEntriesFormGroup()]),
            uniqueName: [''],
            isRcmEntry: [false],
            touristSchemeApplicable: [false],
            passportNumber: [''],
            generateEInvoice: [null],
            voucherUniqueName: [''], //temp
            referenceVoucher: this.formBuilder.group({
                uniqueName: [''],
                voucherType: [''],
                number: [''],
                date: ['']
            }),
            einvoiceGenerated: [false],
            linkedPo: [null], //temp
            grandTotalMultiCurrency: [0], // temp
            attachedFiles: [], //temp
            salesPurchaseAsReceiptPayment: [null], //temp
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
            index: [''], //temp
            address: [''],
            pincode: [''],
            taxNumber: [''],
            state: this.formBuilder.group({
                name: [''],
                code: ['']
            })
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

        if (typeof (this.invoiceForm?.get('date')?.value) === "object") {
            voucherDate = dayjs(this.invoiceForm?.get('date')?.value).format(GIDDH_DATE_FORMAT);
        } else {
            voucherDate = this.invoiceForm?.get('date')?.value;
        }

        return this.formBuilder.group({
            date: [!this.invoiceType.isPurchaseOrder && !this.invoiceType.isEstimateInvoice && !this.invoiceType.isProformaInvoice ? voucherDate || this.universalDate || dayjs().format(GIDDH_DATE_FORMAT) : null],
            description: [entryData ? entryData?.description : ''],
            voucherType: [this.voucherType],
            uniqueName: [entryData && copyUniqueName ? entryData?.uniqueName : ''],
            showCodeType: [entryData && entryData?.hsnNumber ? 'hsn' : 'sac'], //temp
            hsnNumber: [entryData ? entryData?.hsnNumber : ''],
            sacNumber: [entryData ? entryData?.sacNumber : ''],
            totalDiscount: [''], // temp
            totalTax: [''], // temp
            totalTaxWithoutCess: [''], //temp
            totalCess: [''], //temp
            calculateTotal: [true], //temp
            otherTax: this.formBuilder.group({ //temp
                name: [''],
                uniqueName: [''],
                amount: [''],
                type: [''],
                calculationMethod: [''],
                isChecked: [false],
                taxValue: [0],
                taxDetail: [] //temp
            }),
            requiredTax: [false], //temp
            discounts: this.formBuilder.array([
                this.getTransactionDiscountFormGroup()
            ]),
            taxes: this.formBuilder.array([
                this.getTransactionTaxFormGroup()
            ]),
            transactions: this.formBuilder.array([
                this.formBuilder.group({
                    account: this.formBuilder.group({
                        name: [entryData ? entryData?.transactions[0]?.account?.name : ''],
                        uniqueName: [entryData ? entryData?.transactions[0]?.account?.uniqueName : '']
                    }),
                    amount: this.formBuilder.group({
                        amountForAccount: [entryData ? entryData?.transactions[0]?.amount?.amountForAccount : 0],
                        amountForCompany: [entryData ? entryData?.transactions[0]?.amount?.amountForCompany : 0],
                        type: ['DEBIT']
                    }),
                    stock: this.formBuilder.group({
                        name: [entryData ? entryData?.transactions[0]?.stock?.name : ''],
                        quantity: [entryData ? entryData?.transactions[0]?.stock?.quantity : 1],
                        maxQuantity: [entryData ? entryData?.transactions[0]?.stock?.quantity : undefined], //temp (for PO linking in PB)
                        rate: this.formBuilder.group({
                            rateForAccount: [entryData ? entryData?.transactions[0]?.stock?.rate?.rateForAccount ?? entryData?.transactions[0]?.stock?.rate?.amountForAccount : 1]
                        }),
                        stockUnit: this.formBuilder.group({
                            code: [entryData ? entryData?.transactions[0]?.stock?.stockUnit?.code : ''],
                            uniqueName: [entryData ? entryData?.transactions[0]?.stock?.stockUnit?.uniqueName : '']
                        }),
                        variant: this.formBuilder.group({
                            name: [entryData ? entryData?.transactions[0]?.stock?.variant?.name : ''],
                            uniqueName: [entryData ? entryData?.transactions[0]?.stock?.variant?.uniqueName : ''],
                            salesTaxInclusive: [entryData ? entryData?.transactions[0]?.stock?.variant?.salesTaxInclusive : false],
                            purchaseTaxInclusive: [entryData ? entryData?.transactions[0]?.stock?.variant?.purchaseTaxInclusive : false],
                            getParticular: [true]
                        }),
                        skuCodeHeading: [entryData ? entryData?.transactions[0]?.stock?.skuCodeHeading : ''],
                        skuCode: [entryData ? entryData?.transactions[0]?.stock?.sku : ''],
                        uniqueName: [entryData ? entryData?.transactions[0]?.stock?.uniqueName : ''],
                        customField1: this.formBuilder.group({
                            key: [entryData?.transactions[0]?.stock?.customField1?.value ? entryData?.transactions[0]?.stock?.customField1?.key : ''],
                            value: [entryData?.transactions[0]?.stock?.customField1?.value ? entryData?.transactions[0]?.stock?.customField1?.value : '']
                        }),
                        customField2: this.formBuilder.group({
                            key: [entryData?.transactions[0]?.stock?.customField2?.value ? entryData?.transactions[0]?.stock?.customField2?.key : ''],
                            value: [entryData?.transactions[0]?.stock?.customField2?.value ? entryData?.transactions[0]?.stock?.customField2?.value : '']
                        }),
                        hasVariants: [entryData ? entryData?.transactions[0]?.stock?.hasVariants : false]
                    })
                })
            ]),
            total: this.formBuilder.group({ //temp
                amountForAccount: [0],
                amountForCompany: [0]
            }),
            purchaseOrderItemMapping: this.formBuilder.group({
                uniqueName: [entryData ? entryData?.purchaseOrderItemMapping?.uniqueName : ''],
                entryUniqueName: [entryData ? entryData?.purchaseOrderItemMapping?.entryUniqueName : '']
            })
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
                amountForCompany: [''],
                type: ['DEBIT']
            }),
            calculationMethod: [discount?.discountType || discount?.calculationMethod || 'FIX_AMOUNT'],
            discountValue: [discount?.discountValue],
            name: [discount?.name],
            particular: [''],
            uniqueName: [discount?.uniqueName]
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
        return this.formBuilder.group({
            calculationMethod: [tax?.calculationMethod],
            uniqueName: [tax?.uniqueName],
            taxType: [tax?.taxType], //temp
            taxDetail: [tax?.taxDetail] //temp
        });
    }

    /**
     * Opens bulk entry dialog
     *
     * @memberof VoucherCreateComponent
     */
    public openBulkEntryDialog(): void {
        this.bulkStockAsideMenuRef = this.dialog.open(AddBulkItemsComponent, {
            data: {
                voucherType: this.voucherType,
                customerUniqueName: this.invoiceForm.get('account.uniqueName')?.value
            }
        });

        this.bulkStockAsideMenuRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                const entries = this.invoiceForm.get('entries') as FormArray;
                this.invoiceForm.get('entries')['controls']?.forEach((control: any, entryIndex: number) => {
                    if (!control.get('transactions.0.account.uniqueName')?.value) {
                        entries.removeAt(entryIndex);
                    }
                });

                let index = entries?.length;

                response?.forEach(item => {
                    if (item.additional?.stock) {
                        this.stockUnits[index] = observableOf(item.additional?.stock?.variant?.unitRates);

                        if (item.additional?.variants) {
                            this.stockVariants[index] = item.additional?.variants;
                        }
                    }

                    let entry = {
                        hsnNumber: item.additional?.stock?.hsnNumber,
                        sacNumber: item.additional?.stock?.sacNumber,
                        showCodeType: item.additional?.stock?.hsnNumber ? 'hsn' : 'sac',
                        transactions: [{
                            account: {
                                name: item.additional?.label,
                                uniqueName: item.additional?.uniqueName
                            },
                            amount: {
                                amountForAccount: giddhRoundOff(Number(item.quantity) * Number(item.rate), this.company.giddhBalanceDecimalPlaces),
                                amountForCompany: giddhRoundOff(Number(item.quantity) * Number(item.rate), this.company.giddhBalanceDecimalPlaces) * this.invoiceForm.get('exchangeRate')?.value
                            },
                            stock: {
                                name: item.additional?.stock?.name,
                                uniqueName: item.additional?.stock?.uniqueName,
                                quantity: item.quantity,
                                rate: {
                                    rateForAccount: item.rate,
                                    amountForAccount: item.rate
                                },
                                stockUnit: {
                                    code: item.additional?.stock?.variant?.unitRates?.length ? item.additional?.stock?.variant?.unitRates[0].stockUnitCode : '',
                                    uniqueName: item.additional?.stock?.variant?.unitRates?.length ? item.additional?.stock?.variant?.unitRates[0].stockUnitUniqueName : ''
                                },
                                variant: {
                                    name: item.variantName,
                                    uniqueName: item.additional?.stock?.variant?.uniqueName,
                                    salesTaxInclusive: item.additional?.stock?.variant?.salesTaxInclusive,
                                    purchaseTaxInclusive: item.additional?.stock?.variant?.purchaseTaxInclusive
                                },
                                sku: item.additional?.stock?.skuCode,
                                skuCodeHeading: item.additional?.stock?.skuCodeHeading,
                                customField1: {
                                    key: item.additional?.stock?.customField1Heading,
                                    value: item.additional?.stock?.customField1Value
                                },
                                customField2: {
                                    key: item.additional?.stock?.customField2Heading,
                                    value: item.additional?.stock?.customField2Value
                                }
                            }
                        }]
                    };

                    this.invoiceForm.get('entries')['controls'].push(this.getEntriesFormGroup(entry));

                    let entryFormGroup = this.getEntryFormGroup(index);
                    let transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);

                    const discountsFormArray = entryFormGroup.get('discounts') as FormArray;
                    discountsFormArray.clear();
                    if (item.additional?.stock?.variant?.variantDiscount?.discounts) {
                        item.additional?.stock?.variant?.variantDiscount?.discounts?.forEach(selectedDiscount => {
                            this.discountsList?.forEach(discount => {
                                if (discount?.uniqueName === selectedDiscount?.discount?.uniqueName) {
                                    discountsFormArray.push(this.getTransactionDiscountFormGroup(discount));
                                }
                            });
                        });
                    } else {
                        this.account.applicableDiscounts?.forEach(selectedDiscount => {
                            this.discountsList?.forEach(discount => {
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
                        item.additional.groupTaxes ?? []);

                    const taxesFormArray = entryFormGroup.get('taxes') as FormArray;
                    taxesFormArray.clear();

                    const selectedTaxes = [];
                    let otherTax = null;
                    taxes?.forEach(selectedTax => {
                        this.allCompanyTaxes?.forEach(tax => {
                            if (tax.uniqueName === selectedTax) {
                                if (this.otherTaxTypes.includes(tax.taxType)) {
                                    otherTax = tax;
                                } else {
                                    selectedTaxes.push(tax);
                                }
                            }
                        });
                    });

                    selectedTaxes?.forEach(tax => {
                        taxesFormArray.push(this.getTransactionTaxFormGroup(tax));
                    });

                    if (!otherTax && this.account?.otherApplicableTaxes?.length) {
                        this.allCompanyTaxes?.forEach(tax => {
                            if (this.account?.otherApplicableTaxes[0]?.uniqueName === tax?.uniqueName && this.otherTaxTypes.includes(tax.taxType)) {
                                otherTax = tax;
                            }
                        });
                    }

                    if (otherTax) {
                        const selectedOtherTax = this.allCompanyTaxes?.filter(tax => tax.uniqueName === otherTax.uniqueName);
                        otherTax['taxDetail'] = selectedOtherTax[0].taxDetail;
                        otherTax['name'] = selectedOtherTax[0].name;
                        this.getSelectedOtherTax(index, otherTax, otherTax.calculationMethod);
                    }

                    if (item.additional.stock?.variant?.salesTaxInclusive || item.additional.stock?.variant?.purchaseTaxInclusive) {
                        const amount = this.vouchersUtilityService.calculateInclusiveRate(entryFormGroup?.value, this.companyTaxes, this.company.giddhBalanceDecimalPlaces);
                        transactionFormGroup.get('amount.amountForAccount').patchValue(amount);
                        transactionFormGroup.get('stock.rate.rateForAccount')?.patchValue((amount / transactionFormGroup.get('stock.quantity')?.value));
                    }

                    index++;
                });

                this.checkIfEntriesHasStock();
            }
        });
    }

    /**
     * Opens other tax dialog
     *
     * @memberof VoucherCreateComponent
     */
    public openOtherTaxDialog(entry: FormGroup, entryIndex: number): void {
        if (!entry.get('otherTax.isChecked')?.value) {
            const entryFormGroup = this.getEntryFormGroup(entryIndex);
            entryFormGroup.get('otherTax').reset();
            return;
        }

        this.otherTaxAsideMenuRef = this.dialog.open(OtherTaxComponent, {
            data: {
                entryIndex: entryIndex,
                appliedOtherTax: entry.get('otherTax')?.value
            },
            position: {
                top: '0',
                right: '0'
            }
        });

        this.otherTaxAsideMenuRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                if (response?.tax) {
                    this.getSelectedOtherTax(response.entryIndex, response.tax, response.calculationMethod);
                } else {
                    const entryFormGroup = this.getEntryFormGroup(entryIndex);
                    entryFormGroup.get('otherTax').reset();
                }
            }
        });
    }

    /**
     * Updates the other tax in form control
     *
     * @param {number} entryIndex
     * @param {*} tax
     * @param {SalesOtherTaxesCalculationMethodEnum} calculationMethod
     * @memberof VoucherCreateComponent
     */
    public getSelectedOtherTax(entryIndex: number, tax: any, calculationMethod: SalesOtherTaxesCalculationMethodEnum): void {
        const entryFormGroup = this.getEntryFormGroup(entryIndex);
        const transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);
        let taxableValue = 0;

        if (!calculationMethod) {
            calculationMethod = SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount;
        }

        if (['tcsrc', 'tcspay'].includes(tax?.taxType)) {
            if (calculationMethod === SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount) {
                taxableValue = Number(transactionFormGroup.get('amount.amountForAccount')?.value) - entryFormGroup.get('totalDiscount')?.value;
            } else if (calculationMethod === SalesOtherTaxesCalculationMethodEnum.OnTotalAmount) {
                let rawAmount = Number(transactionFormGroup.get('amount.amountForAccount')?.value) - entryFormGroup.get('totalDiscount')?.value;
                taxableValue = (rawAmount + entryFormGroup.get('totalTaxWithoutCess')?.value + entryFormGroup.get('totalCess')?.value);
            }
            entryFormGroup.get('otherTax.type').patchValue('tcs');
        } else {
            if (calculationMethod === SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount) {
                taxableValue = Number(transactionFormGroup.get('amount.amountForAccount')?.value) - entryFormGroup.get('totalDiscount')?.value;
            } else if (calculationMethod === SalesOtherTaxesCalculationMethodEnum.OnTotalAmount) {
                let rawAmount = Number(transactionFormGroup.get('amount.amountForAccount')?.value) - entryFormGroup.get('totalDiscount')?.value;
                taxableValue = (rawAmount + entryFormGroup.get('totalTaxWithoutCess')?.value + entryFormGroup.get('totalCess')?.value);
            }
            entryFormGroup.get('otherTax.type').patchValue('tds');
        }

        entryFormGroup.get('otherTax.isChecked')?.patchValue(true);
        entryFormGroup.get('otherTax.name').patchValue(tax?.name);
        entryFormGroup.get('otherTax.uniqueName').patchValue(tax?.uniqueName);
        entryFormGroup.get('otherTax.taxValue').patchValue(tax?.taxDetail[0]?.taxValue);
        entryFormGroup.get('otherTax.taxDetail').patchValue(tax?.taxDetail);
        entryFormGroup.get('otherTax.amount').patchValue(giddhRoundOff(((taxableValue * tax?.taxDetail[0]?.taxValue) / 100), this.highPrecisionRate));
        entryFormGroup.get('otherTax.calculationMethod').patchValue(calculationMethod);
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
    public toggleAccountAsidePane(accountType: AccountType, createNewAccount: boolean = true): void {
        this.createNewAccount = createNewAccount;
        if (accountType === this.accountType.customer) {
            this.getParentGroupForCreateAccount();
        } else {
            this.accountParentGroup = "bankaccounts";
        }

        this.accountAsideMenuRef = this.dialog.open(this.accountAsideMenu, {
            position: {
                right: '0',
                top: '0'
            }
        });

        this.accountAsideMenuRef.afterClosed().pipe(take(1)).subscribe(() => {
            if (this.showPageLeaveConfirmation) {
                this.pageLeaveUtilityService.addBrowserConfirmationDialog();
            }

            if (this.accountParentGroup === "bankaccounts") {
                this.componentStore.getBriefAccounts({ currency: this.account?.baseCurrency + ', ' + this.company.baseCurrency, group: BriedAccountsGroup });
            }
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

        this.productServiceAsideMenuRef = this.dialog.open(this.asideMenuProductService, {
            position: {
                right: '0',
                top: '0'
            },
            width: '760px',
            height: '100vh !important',
            disableClose: true
        });

        this.productServiceAsideMenuRef.afterClosed().pipe(take(1)).subscribe(response => {
            setTimeout(() => {
                if (this.showPageLeaveConfirmation) {
                    this.pageLeaveUtilityService.addBrowserConfirmationDialog();
                }
            }, 100);
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
     * Callback after create/update account
     *
     * @private
     * @param {*} response
     * @memberof VoucherCreateComponent
     */
    private createUpdateAccountCallback(response: any, fetchStates: boolean = false): void {
        this.searchAccount();
        this.invoiceForm.controls["account"].get("uniqueName")?.patchValue(response?.uniqueName);
        this.invoiceForm.controls["account"].get("customerName")?.patchValue(response?.name);
        this.updateAccountDataInForm(response, fetchStates);
        this.accountAsideMenuRef?.close();
    }

    /**
     * Shows create new tax dialog
     *
     * @memberof VoucherCreateComponent
     */
    public showCreateTaxDialog(): void {
        this.store.dispatch(this.settingsTaxesAction.CreateTaxResponse(null));
        this.taxAsideMenuRef = this.dialog.open(this.createTax, {
            position: {
                right: '0',
                top: '0'
            }
        });
    }

    /**
     * Shows create new discount dialog
     *
     * @memberof VoucherCreateComponent
     */
    public showCreateDiscountDialog(): void {
        this.discountDialogRef = this.dialog.open(CreateDiscountComponent, {
            position: {
                right: '0',
                top: '0'
            }
        });

        this.discountDialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                this.componentStore.getDiscountsList();
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
        if (entityType === 'company') {
            this.copyCompanyBillingInShippingAddress = event?.checked;
        } else {
            this.copyAccountBillingInShippingAddress = event?.checked;
        }

        if (event?.checked) {
            let defaultAddress = {
                index: this.invoiceForm.controls[entityType].get("billingDetails").get("index")?.value || 0,
                address: this.invoiceForm.controls[entityType].get("billingDetails").get("address")?.value,
                pincode: this.invoiceForm.controls[entityType].get("billingDetails").get("pincode")?.value,
                gstNumber: this.invoiceForm.controls[entityType].get("billingDetails").get("taxNumber")?.value,
                state: { name: this.invoiceForm.controls[entityType].get("billingDetails").get("state").get("name")?.value, code: this.invoiceForm.controls[entityType].get("billingDetails").get("state").get("code")?.value }
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
        this.invoiceForm.controls[entity].get(addressType).get("state").get("name").patchValue(event?.label);
    }

    /**
     * Toggle the RCM checkbox based on user confirmation
     *
     * @param {*} event Click event
     * @memberof VoucherCreateComponent
     */
    public toggleRcmCheckbox(event: any, element: string): void {
        let isChecked;
        if (element === "checkbox") {
            isChecked = event?.checked;
            this.rcmCheckbox['checked'] = !isChecked;
        } else {
            isChecked = !event?._checked;
        }

        this.rcmConfiguration = this.generalService.getRcmConfiguration(isChecked, this.commonLocaleData);
        let dialogRef = this.dialog.open(NewConfirmationModalComponent, {
            width: '630px',
            data: {
                configuration: this.rcmConfiguration
            }
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            document.querySelector('body').classList.remove('fixed');
            this.handleRcmChange(response);
        });
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
            this.invoiceForm.get('isRcmEntry').patchValue(!this.invoiceForm.get('isRcmEntry')?.value);
            this.rcmCheckbox['checked'] = this.invoiceForm.get('isRcmEntry')?.value;

            if (this.invoiceForm.get('isRcmEntry')?.value) {
                this.invoiceForm.get('subVoucher')?.patchValue(SubVoucher.ReverseCharge);
            } else {
                this.invoiceForm.get('subVoucher')?.patchValue('');
            }
        }
    }

    /**
     * This will reset the state of checkbox and ngModel to make sure we update it based on user confirmation later
     *
     * @param {*} event
     * @memberof VoucherCreateComponent
     */
    public changeRcmCheckboxState(event: any): void {
        this.invoiceForm.get('isRcmEntry').patchValue(!this.invoiceForm.get('isRcmEntry')?.value);
        this.toggleRcmCheckbox(event, 'checkbox');
    }

    /**
     * Removes the passport number if tourist scheme applicable checkbox toggled
     *
     * @memberof VoucherCreateComponent
     */
    public toggleTouristSchemeApplicable(): void {
        this.invoiceForm.get('passportNumber').patchValue('');
    }

    /**
     * Allows alphanumeric characters only in passport number field
     *
     * @memberof VoucherCreateComponent
     */
    public allowAlphanumericChar(): void {
        this.generalService.allowAlphanumericChar(this.invoiceForm.get('passportNumber')?.value);
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
        const entriesArray = this.invoiceForm.get('entries') as FormArray;
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
        const transactionsArray = entryFormGroup.get('transactions') as FormArray;
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

        fields?.forEach(field => {
            entryFormGroup?.get(field.key)?.patchValue(field.value);
        });
    }

    /**
     * Uploads attachment
     *
     * @memberof VoucherCreateComponent
     */
    public uploadFile(): void {
        const selectedFile: any = document.getElementById("invoiceFile");
        this.selectedFileName = '';
        if (selectedFile?.files?.length) {
            const file = selectedFile?.files[0];

            this.generalService.getSelectedFile(file, (blob: any, file: any) => {
                this.isFileUploading = true;
                this.selectedFileName = file.name;

                this.commonService.uploadFile({ file: blob, fileName: file.name }).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    this.isFileUploading = false;

                    if (response?.status === 'success') {
                        this.invoiceForm.get("attachedFiles")?.patchValue([response.body?.uniqueName]);
                        this.toasterService.showSnackBar("success", this.localeData?.file_uploaded);
                    } else {
                        this.invoiceForm.get("attachedFiles")?.patchValue([]);
                        this.toasterService.showSnackBar("error", response.message);
                    }
                });
            });
        }
    }

    /**
     * Shows confirmation modal to delete attachment
     *
     * @memberof VoucherCreateComponent
     */
    public deleteAttachementConfirmation(): void {
        let attachmentDeleteConfiguration = this.generalService.getAttachmentDeleteConfiguration(this.localeData, this.commonLocaleData);
        let dialogRef = this.dialog.open(NewConfirmationModalComponent, {
            width: '630px',
            data: {
                configuration: attachmentDeleteConfiguration
            }
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response === this.commonLocaleData?.app_yes) {
                this.componentStore.deleteAttachment(this.invoiceForm.get("attachedFiles")?.value[0]);
            } else {
                this.dialog.closeAll();
            }
        });
    }

    /**
     * This will be use for create and send voucher
     *
     * @memberof VoucherCreateComponent
     */
    public createSendVoucher(): void {
        this.saveVoucher(voucher => {
            this.voucherDetails = voucher?.body;
            this.emailDialogRef = this.dialog.open(this.sendEmailModal, {
                width: '650px'
            });
        });
    }

    /**
     * This will be use for create and print voucher
     *
     * @memberof VoucherCreateComponent
     */
    public createPrintVoucher(): void {
        this.saveVoucher(voucher => {
            this.voucherDetails = voucher?.body;
            this.dialog.open(this.printVoucherModal, {
                width: '60vw',
                height: '80vh'
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
    }

    /**
     * Callback for entry date change
     *
     * @param {FormGroup} entry
     * @memberof VoucherComponent
     */
    public onBlurEntryDate(entryFormGroup: FormGroup, updatedEntryIndex: number): void {
        if (typeof (entryFormGroup.get('date')?.value) === "object") {
            entryFormGroup.get('date')?.patchValue(dayjs(entryFormGroup.get('date')?.value).format(GIDDH_DATE_FORMAT));
        }

        const entries = this.getEntries();
        if (entries?.length > 1) {
            this.dateChangeType = "entry";
            this.updatedEntryIndex = updatedEntryIndex;
            this.dateChangeConfiguration = this.generalService.getDateChangeConfiguration(this.localeData, this.commonLocaleData, false);
            this.dialog.open(this.dateChangeConfirmationModel, {
                width: '650px',
            });
        }
    }

    public onBlueVoucherDate(): void {
        if (this.isMultiCurrencyVoucher) {
            this.getExchangeRate(this.account.baseCurrency, this.company.baseCurrency, this.invoiceForm.get('date')?.value);
        }

        this.isVoucherDateChanged = true;
        if (!this.invoiceType.isCashInvoice && (this.invoiceType.isSalesInvoice || this.invoiceType.isPurchaseInvoice || this.invoiceType.isCreditNote || this.invoiceType.isDebitNote)) {
            this.getAllVouchersForAdjustment();
            this.getVoucherListForCreditDebitNote();
        }
        this.dateChangeType = "voucher";

        this.dateChangeConfiguration = this.generalService.getDateChangeConfiguration(this.localeData, this.commonLocaleData, true);
        this.dialog.open(this.dateChangeConfirmationModel, {
            width: '650px',
        });
    }

    /**
     * This will handle date change modal confirmation
     *
     * @param {string} action
     * @memberof VoucherComponent
     */
    public handleDateChangeConfirmation(action: string): void {
        if (action === this.commonLocaleData?.app_yes) {
            if (this.dateChangeType === "voucher") {
                this.invoiceForm?.get('entries')['controls']?.forEach(entry => {
                    entry.get('date')?.patchValue(dayjs(this.invoiceForm.get('date')?.value).format(GIDDH_DATE_FORMAT));
                });
            } else if (this.dateChangeType === "entry") {
                let entryDate = null;
                let entryFormGroup = this.getEntryFormGroup(this.updatedEntryIndex);

                if (typeof (entryFormGroup.get('date')?.value === "object")) {
                    entryDate = dayjs(entryFormGroup.get('date')?.value).format(GIDDH_DATE_FORMAT);
                } else {
                    entryDate = dayjs(entryFormGroup.get('date')?.value, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                }

                this.invoiceForm?.get('entries')['controls']?.forEach((entry, entryLoop) => {
                    if (entryLoop !== this.updatedEntryIndex) {
                        let currentEntryFormGroup = this.getEntryFormGroup(entryLoop);
                        currentEntryFormGroup.get('date')?.patchValue(entryFormGroup.get('date')?.value);
                    }
                });
            }
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
            hsnNumber: entry.get('hsnNumber')?.value,
            sacNumber: entry.get('sacNumber')?.value
        };
    }

    /**
     * Updates previous hsn/sac
     *
     * @param {FormGroup} entry
     * @memberof VoucherCreateComponent
     */
    public cancelHsnSacEdit(entry: FormGroup): void {
        entry.get('hsnNumber')?.patchValue(this.currentHsnSac.hsnNumber);
        entry.get('sacNumber')?.patchValue(this.currentHsnSac.sacNumber);
    }

    /**
     * Adds new line entry
     *
     * @memberof VoucherCreateComponent
     */
    public addNewLineEntry(setActiveIndex: boolean = true): void {
        this.invoiceForm.get('entries')['controls'].push(this.getEntriesFormGroup());
        if (setActiveIndex) {
            const entries = this.invoiceForm.get('entries') as FormArray;
            setTimeout(() => {
                this.activeEntryIndex = entries?.length - 1;
            }, 10);
        }
    }

    /**
     * Removes line entry
     *
     * @param {number} entryIndex
     * @memberof VoucherCreateComponent
     */
    public deleteLineEntry(entryIndex: number): void {
        const entries = this.invoiceForm.get('entries') as FormArray;
        entries.removeAt(entryIndex);
        this.stockVariants[entryIndex] = observableOf([]);
        this.stockUnits[entryIndex] = observableOf([]);
        if (!entries?.length) {
            this.addNewLineEntry();
        }
        this.checkIfEntriesHasStock();
        this.calculateVoucherTotals();
    }

    /**
     * Handles outside click from entry table
     *
     * @param {*} event
     * @memberof VoucherCreateComponent
     */
    public handleOutsideClick(event: any): void {
        if ((typeof event?.target?.className === "string" && event?.target?.className?.indexOf("option") === -1 && event?.target?.className?.indexOf("cdk-overlay-backdrop") === -1) && event?.currentTarget?.activeElement?.className?.indexOf("select-field-input") === -1 && !this.dialog.getDialogById(this.otherTaxAsideMenuRef?.id) && !this.dialog.getDialogById(this.bulkStockAsideMenuRef?.id) && !this.dialog.getDialogById(this.accountAsideMenuRef?.id) && !this.dialog.getDialogById(this.taxAsideMenuRef?.id) && !this.dialog.getDialogById(this.productServiceAsideMenuRef?.id) && !this.dialog.getDialogById(this.discountDialogRef?.id)) {
            this.activeEntryIndex = null;
        }
    }

    /**
     * Initializes the int-tel input
     *
     * @memberof VoucherCreateComponent
     */
    public initIntl(): void {
        const parentDom = document.querySelector('create');
        const input = document.getElementById('init-contact');
        if (input) {
            this.intlClass = new IntlPhoneLib(
                input,
                parentDom,
                false
            );
        }
    }

    /**
     * Validate the mobile number
     *
     * @memberof VoucherCreateComponent
     */
    public validateMobileField(): void {
        setTimeout(() => {
            if (!this.intlClass?.isRequiredValidNumber) {
                this.invoiceForm.controls["account"].get("mobileNumber")?.setErrors({ invalidNumber: true });
            } else {
                this.invoiceForm.controls["account"].get("mobileNumber")?.setErrors(null);
            }
        }, 100);
    }

    /**
     * Selected discount callback
     *
     * @param {number} entryIndex
     * @param {*} [discounts]
     * @memberof VoucherCreateComponent
     */
    public getSelectedDiscounts(entryIndex: number, discounts?: any): void {
        if (discounts?.length) {
            const entryFormGroup = this.getEntryFormGroup(entryIndex);
            const discountsFormArray = entryFormGroup.get('discounts') as FormArray;
            discountsFormArray.clear();
            discounts?.forEach(discount => {
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
    public updateTotalDiscount(totalDiscount: any, entry: FormGroup): void {
        entry.get('totalDiscount').patchValue(totalDiscount);
    }

    /**
     * Selected taxes callback
     *
     * @param {number} entryIndex
     * @param {*} [taxes]
     * @memberof VoucherCreateComponent
     */
    public getSelectedTaxes(entryIndex: number, taxes?: any): void {
        const entryFormGroup = this.getEntryFormGroup(entryIndex);
        const taxesFormArray = entryFormGroup.get('taxes') as FormArray;

        taxesFormArray.clear();

        taxes?.forEach(tax => {
            taxesFormArray.push(this.getTransactionTaxFormGroup(tax));
        });

        this.calculateTotalTax();
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

        const entriesArray = this.invoiceForm.get('entries') as FormArray;
        for (let entryIndex = 0; entryIndex < entriesArray.length; entryIndex++) {
            taxPercentage = 0;
            cessPercentage = 0;

            const entryFormGroup = this.getEntryFormGroup(entryIndex);
            const transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);
            const taxesFormArray = entryFormGroup.get('taxes') as FormArray;

            for (let taxIndex = 0; taxIndex < taxesFormArray.length; taxIndex++) {
                const taxFormGroup = taxesFormArray.at(taxIndex) as FormGroup;

                if (taxFormGroup.get('taxType')?.value === 'gstcess') {
                    cessPercentage += taxFormGroup.get('taxDetail')?.value?.taxValue;
                } else {
                    taxPercentage += taxFormGroup.get('taxDetail')?.value?.taxValue;
                }
            }

            entryFormGroup.get("totalTaxWithoutCess")?.patchValue(giddhRoundOff(((taxPercentage * (transactionFormGroup.get('amount.amountForAccount')?.value - entryFormGroup.get('totalDiscount')?.value)) / 100), this.company.giddhBalanceDecimalPlaces));
            entryFormGroup.get("totalCess")?.patchValue(giddhRoundOff(((cessPercentage * (transactionFormGroup.get('amount.amountForAccount')?.value - entryFormGroup.get('totalDiscount')?.value)) / 100), this.company.giddhBalanceDecimalPlaces));

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
    public updateTotalTax(totalTax: any, entry: FormGroup): void {
        entry.get('totalTax').patchValue(totalTax);
    }

    /**
     * This will be use for copy invoice
     *
     * @param {PreviousInvoicesVm} item
     * @memberof VoucherCreateComponent
     */
    public copyInvoice(item: PreviousInvoicesVm): void {
        this.startLoader(true);
        this.invoiceForm.get("voucherUniqueName")?.patchValue(item?.uniqueName);
        this.componentStore.getVoucherDetails({ isCopyVoucher: true, accountUniqueName: item.account?.uniqueName, payload: { uniqueName: item?.uniqueName, voucherType: this.voucherType } });
    }

    /**
     * This will update due date based on voucher date
     *
     * @memberof VoucherCreateComponent
     */
    public updateDueDate(): void {
        if (this.invoiceForm.get("date").value) {
            let duePeriod: number;
            if (this.invoiceType.isEstimateInvoice) {
                duePeriod = this.invoiceSettings?.estimateSettings ? this.invoiceSettings?.estimateSettings.duePeriod : 0;
            } else if (this.invoiceType.isProformaInvoice) {
                duePeriod = this.invoiceSettings?.proformaSettings ? this.invoiceSettings?.proformaSettings.duePeriod : 0;
            } else if (this.invoiceType.isPurchaseOrder) {
                duePeriod = this.invoiceSettings?.purchaseBillSettings ? this.invoiceSettings?.purchaseBillSettings.poDuePeriod : 0;
            } else {
                duePeriod = this.invoiceSettings?.invoiceSettings ? this.invoiceSettings?.invoiceSettings?.duePeriod : 0;
            }

            if (typeof (this.invoiceForm.get("date").value) === "object") {
                this.invoiceForm.get("date").setValue(duePeriod > 0 ? dayjs(this.invoiceForm.get("date").value).add(duePeriod, 'day').toDate() : dayjs(this.invoiceForm.get("date").value).toDate());
            } else {
                this.invoiceForm.get("dueDate").setValue(duePeriod > 0 ? dayjs(this.invoiceForm.get("date").value, GIDDH_DATE_FORMAT).add(duePeriod, 'day').toDate() : dayjs(this.invoiceForm.get("date").value, GIDDH_DATE_FORMAT).toDate());
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
        transactionFormGroup.get('amount.amountForAccount').patchValue(amount);
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
            this.voucherTotals = this.vouchersUtilityService.getVoucherTotals(entries, this.company.giddhBalanceDecimalPlaces, this.applyRoundOff, this.invoiceForm.get('exchangeRate')?.value);
            this.invoiceForm.get('grandTotalMultiCurrency')?.patchValue(this.voucherTotals?.grandTotalMultiCurrency);
            this.calculateBalanceDue();
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
        entryFormGroup.get('total.amountForAccount').patchValue(amount);

        this.calculateTotalTax();
        this.calculateVoucherTotals();
    }

    /**
     * Callback for deposit account selection
     *
     * @param {*} event
     * @param {boolean} [isClear=false]
     * @memberof VoucherCreateComponent
     */
    public selectedDepositAccount(event: any, isClear: boolean = false): void {
        if (isClear) {
            this.invoiceForm.get("deposit.currencySymbol")?.patchValue("");
        } else {
            this.invoiceForm.get("deposit.currencySymbol")?.patchValue(event?.additional?.currency?.symbol);
        }
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
                if (this.accountFormFields['taxName'] && this.accountFormFields['taxName']['regex'] !== "" && this.accountFormFields['taxName']['regex']?.length > 0) {
                    for (let key = 0; key < this.accountFormFields['taxName']['regex'].length; key++) {
                        let regex = new RegExp(this.accountFormFields['taxName']['regex'][key]);
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
                    invalidTax = invalidTax?.replace("[TAX_NAME]", this.accountFormFields['taxName']?.label);
                    invalidTax = invalidTax?.replace("[FIELD_NAME]", fieldName);
                    this.toasterService.showSnackBar('error', invalidTax);
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
                if (this.companyFormFields['taxName']['regex'] !== "" && this.companyFormFields['taxName']['regex']?.length > 0) {
                    for (let key = 0; key < this.companyFormFields['taxName']['regex'].length; key++) {
                        let regex = new RegExp(this.companyFormFields['taxName']['regex'][key]);
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
                    invalidTax = invalidTax?.replace("[TAX_NAME]", this.companyFormFields['taxName']?.label);
                    invalidTax = invalidTax?.replace("[FIELD_NAME]", fieldName);
                    this.toasterService.showSnackBar('error', invalidTax);
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
        this.invoiceForm.get('updateAccountDetails')?.patchValue(true);
        this.saveVoucher();
    }

    /**
     * Generate voucher
     *
     * @memberof VoucherCreateComponent
     */
    public generateVoucher(): void {
        this.invoiceForm.get('updateAccountDetails')?.patchValue(false);
        if (this.isPendingEntries) {
            this.saveVoucher(() => {
                this.router.navigate(['/pages/invoice/preview/pending/sales']);
            });
        } else {
            this.saveVoucher();
        }
    }

    private redirectToGetAll(): void {
        if (this.invoiceType.isPurchaseOrder) {
            this.router.navigate(['/pages/purchase-management/purchase/order']);
        } else {
            if (this.invoiceType.isCashInvoice) {
                if (this.invoiceType.isSalesInvoice) {
                    this.router.navigate(['/pages/invoice/preview/sales']);
                } else if (this.invoiceType.isDebitNote) {
                    this.router.navigate(['/pages/invoice/preview/debit note']);
                } else if (this.invoiceType.isCreditNote) {
                    this.router.navigate(['/pages/invoice/preview/credit note']);
                } else if (this.invoiceType.isPurchaseInvoice) {
                    this.router.navigate(['/pages/purchase-management/purchase/bill']);
                } else {
                    this.router.navigate(['/pages/invoice/preview/sales']);
                }
            } else if (this.invoiceType.isPurchaseInvoice) {
                this.router.navigate(['/pages/purchase-management/purchase/bill']);
            } else {
                this.router.navigate(['/pages/invoice/preview/' + this.voucherType]);
            }
        }
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
            this.redirectToGetAll();
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
        if (this.taxNumberValidations.account.billingDetails !== null || this.taxNumberValidations.account.shippingDetails !== null || this.taxNumberValidations.company.billingDetails !== null || this.taxNumberValidations.company.shippingDetails !== null) {
            return false;
        }

        if (dayjs(invoiceForm.dueDate, GIDDH_DATE_FORMAT).isBefore(dayjs(invoiceForm.date, GIDDH_DATE_FORMAT), 'd')) {
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
            return false;
        }

        let hasTransactions = false;
        const entriesArray = this.invoiceForm.get('entries') as FormArray;
        for (let entryIndex = 0; entryIndex < entriesArray.length; entryIndex++) {
            const entryFormGroup = this.getEntryFormGroup(entryIndex);
            const transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);

            if (transactionFormGroup.get('account.uniqueName')?.value) {
                hasTransactions = true;
            }
        }

        if (!hasTransactions) {
            this.toasterService.showSnackBar("warning", this.localeData?.no_product_error);
            return false;
        }

        if (invoiceForm.isRcmEntry) {
            let hasTaxes = true;
            const entriesArray = this.invoiceForm.get('entries') as FormArray;
            for (let entryIndex = 0; entryIndex < entriesArray.length; entryIndex++) {
                const entryFormGroup = this.getEntryFormGroup(entryIndex);
                const transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);
                const taxesFormArray = entryFormGroup.get('taxes') as FormArray;
                if (transactionFormGroup.get('account.uniqueName')?.value && !taxesFormArray?.length) {
                    entryFormGroup.get('requiredTax')?.patchValue(true);
                    hasTaxes = false;
                } else {
                    entryFormGroup.get('requiredTax')?.patchValue(false);
                }
            }

            if (this.showTaxColumn && !hasTaxes) {
                return false;
            }
        }

        return true;
    }

    /**
     * Returns voucher entries
     *
     * @return {*}  {any[]}
     * @memberof VoucherCreateComponent
     */
    public getEntries(): any[] {
        const entries = [];
        this.invoiceForm.get('entries')['controls']?.forEach(control => {
            if (control?.value?.transactions[0]?.account?.uniqueName) {
                entries.push(control?.value);
            }
        });
        return entries;
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

        let invoiceForm = cloneDeep(this.invoiceForm.value);
        invoiceForm.entries = entries;

        if (this.currencySwitched) {
            invoiceForm.exchangeRate = 1 / invoiceForm.exchangeRate;
        }

        invoiceForm = this.vouchersUtilityService.cleanVoucherObject(invoiceForm);

        if (!this.isFormValid(invoiceForm)) {
            this.startLoader(false);
            return;
        }

        invoiceForm = this.vouchersUtilityService.formatVoucherObject(invoiceForm);
        if (!this.currentVoucherFormDetails?.depositAllowed) {
            delete invoiceForm.deposit;
        }

        if (this.hasStock && this.warehouses?.length === 1) {
            invoiceForm.warehouse = {
                name: this.warehouses[0]?.name,
                uniqueName: this.warehouses[0]?.uniqueName
            }
        }

        if (this.invoiceType.isCreditNote || this.invoiceType.isDebitNote) {
            invoiceForm.invoiceNumberAgainstVoucher = invoiceForm.number;
        }

        if ((this.invoiceType.isSalesInvoice || this.invoiceType.isCreditNote || this.invoiceType.isDebitNote) && this.advanceReceiptAdjustmentData && this.advanceReceiptAdjustmentData.adjustments) {
            if (this.advanceReceiptAdjustmentData.adjustments.length) {
                const adjustments = cloneDeep(this.advanceReceiptAdjustmentData.adjustments);
                if (adjustments) {
                    adjustments.forEach(adjustment => {
                        if (adjustment.balanceDue !== undefined) {
                            delete adjustment.balanceDue;
                        }
                    });
                    invoiceForm.voucherAdjustments = {
                        adjustments
                    };

                    if (invoiceForm.voucherAdjustments && invoiceForm.voucherAdjustments.adjustments && invoiceForm.voucherAdjustments.adjustments.length > 0) {
                        invoiceForm.voucherAdjustments.adjustments.map(item => {
                            if (item && item.voucherDate) {
                                item.voucherDate = item.voucherDate?.replace(/\//g, '-');
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
                accountUniqueName: invoiceForm.account.uniqueName
            };

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

            if (this.isUpdateMode) {
                this.purchaseOrderService.update(getRequestObject, invoiceForm).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    this.startLoader(false);
                    if (response && response.status === "success") {
                        this.toasterService.showSnackBar("success", this.localeData?.po_updated);
                        if (callback) {
                            callback(response);
                        } else {
                            this.router.navigate(['/pages/purchase-management/purchase/order']);
                        }
                    } else {
                        this.toasterService.showSnackBar("error", response.message);
                    }
                });
            } else {
                this.purchaseOrderService.create(getRequestObject, invoiceForm).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    this.startLoader(false);
                    if (response && response.status === "success") {
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

            if (invoiceForm.deposit?.amountForAccount) {
                invoiceForm.paymentAction = {
                    action: 'paid',
                    amount: Number(invoiceForm.deposit?.amountForAccount),
                    depositAccountUniqueName: this.invoiceType.isCashInvoice ? invoiceForm.account?.uniqueName : invoiceForm.deposit?.accountUniqueName
                };
            }

            invoiceForm.voucherDetails = { voucherType: this.invoiceType.isEstimateInvoice ? VoucherTypeEnum.generateEstimate : VoucherTypeEnum.generateProforma };
            invoiceForm.accountDetails = { uniqueName: invoiceForm.account?.uniqueName };

            if (this.isUpdateMode) {
                this.proformaService.update(invoiceForm).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    this.startLoader(false);
                    if (response?.status === "success") {
                        this.toasterService.showSnackBar("success", this.localeData?.voucher_updated);
                        if (callback) {
                            callback(response);
                        } else {
                            this.router.navigate(['/pages/invoice/preview/' + this.voucherType]);
                        }
                    } else {
                        this.toasterService.showSnackBar("error", response?.message, response?.code);
                    }
                });
            } else {
                this.proformaService.generate(invoiceForm).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    this.startLoader(false);
                    if (response?.status === "success") {
                        if (callback) {
                            this.resetVoucherForm(false);
                        } else {
                            this.resetVoucherForm();
                        }

                        let message = (response?.body.number) ? `${this.localeData?.entry_created}: ${response?.body.number}` : this.commonLocaleData?.app_messages?.voucher_saved;
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
                invoiceForm.type = this.invoiceType.isPurchaseInvoice ? "purchase" : this.invoiceType.isCreditNote ? "credit note" : this.invoiceType.isDebitNote ? "debit note" : "sales";

                if (this.invoiceForm.get('salesPurchaseAsReceiptPayment').value) {
                    if (this.invoiceType.isPurchaseInvoice) {
                        invoiceForm.type = VoucherTypeEnum.payment;
                    } else if (!this.invoiceType.isDebitNote && !this.invoiceType.isCreditNote) {
                        invoiceForm.type = VoucherTypeEnum.receipt;
                    }
                }

                invoiceForm.entries = invoiceForm.entries?.map(entry => {
                    entry.voucherType = invoiceForm.type;
                    return entry;
                });
            }

            if (this.invoiceType.isPurchaseInvoice && invoiceForm.linkedPo?.length) {
                invoiceForm.purchaseOrders = [];
                invoiceForm.linkedPo?.forEach(order => {
                    invoiceForm.purchaseOrders.push({ name: this.linkedPoNumbers[order]?.voucherNumber, uniqueName: order });
                });
            }
            let accountUniqueName = this.invoiceType.isCashInvoice ? (invoiceForm.deposit?.accountUniqueName ? invoiceForm.deposit?.accountUniqueName : 'cash') : invoiceForm.account?.uniqueName;
            invoiceForm.account.uniqueName = accountUniqueName;
            if (this.isUpdateMode) {
                this.voucherService.updateVoucher(invoiceForm).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    this.startLoader(false);
                    if (response?.status === "success") {
                        this.toasterService.showSnackBar("success", this.localeData?.voucher_updated);
                        if (callback) {
                            callback(response);
                        } else {
                            this.redirectToGetAll();
                        }
                    } else {
                        this.toasterService.showSnackBar("error", response?.message, response?.code);
                    }
                });
            } else {
                this.voucherService.generateVoucher(invoiceForm.account.uniqueName, invoiceForm).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    this.startLoader(false);
                    if (response?.status === "success") {
                        const isCashSalesPurchaseInvoice = this.invoiceType.isCashInvoice && ((!this.invoiceType.isDebitNote && !this.invoiceType.isCreditNote) || this.invoiceType.isPurchaseInvoice);

                        if (isCashSalesPurchaseInvoice) {
                            const salesPurchaseAsReceiptPayment = this.invoiceForm.get('salesPurchaseAsReceiptPayment').value;

                            if (this.invoiceType.isPurchaseInvoice && (salesPurchaseAsReceiptPayment !== this.company.purchaseAsPayment)) {
                                this.updateProfileSetting({ purchaseAsPayment: salesPurchaseAsReceiptPayment });
                            } else if (salesPurchaseAsReceiptPayment !== this.company.salesAsReceipt) {
                                this.updateProfileSetting({ salesAsReceipt: salesPurchaseAsReceiptPayment });
                            }
                        }

                        if (callback) {
                            this.resetVoucherForm(false);
                        } else {
                            let salesPurchaseAsReceiptPayment = this.invoiceForm.value.salesPurchaseAsReceiptPayment;
                            this.resetVoucherForm();

                            if (isCashSalesPurchaseInvoice) {
                                this.invoiceForm.get('salesPurchaseAsReceiptPayment').patchValue(salesPurchaseAsReceiptPayment);
                            }
                        }

                        let message = (response?.body.number) ? `${this.localeData?.entry_created}: ${response?.body.number}` : this.commonLocaleData?.app_messages?.voucher_saved;
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
                                permanentlyDeleteMessage: ' '
                            }
                        });

                        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
                            if (response) {
                                this.invoiceForm.get('generateEInvoice')?.patchValue(true);
                            } else {
                                this.invoiceForm.get('generateEInvoice')?.patchValue(false);
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
     * Resets voucher form
     *
     * @memberof VoucherCreateComponent
     */
    public resetVoucherForm(openAccountDropdown: boolean = true, initialLoad: boolean = false): void {
        const exchangeRate = this.invoiceForm.get('exchangeRate')?.value;
        const entriesFormArray = this.invoiceForm.get('entries') as FormArray;
        entriesFormArray.clear();
        this.invoiceForm.reset();

        this.copyAccountBillingInShippingAddress = true;
        this.copyCompanyBillingInShippingAddress = true;
        this.currencySwitched = false;

        this.accountFormFields = [];
        this.selectedFileName = "";
        this.depositAccountName = "";

        this.account = {
            countryName: '',
            countryCode: '',
            baseCurrency: '',
            baseCurrencySymbol: '',
            addresses: null,
            otherApplicableTaxes: null,
            applicableDiscounts: null,
            applicableTaxes: null,
            excludeTax: false,
            taxTypeLabel: ''
        };

        if (this.invoiceType.isCashInvoice) {
            this.accountFormFields = cloneDeep(this.companyFormFields);
            this.account.taxTypeLabel = cloneDeep(this.company.taxTypeLabel);
            this.account.taxType = cloneDeep(this.company.taxType);
        }

        this.addNewLineEntry(false);

        this.voucherTotals = {
            totalAmount: 0,
            totalDiscount: 0,
            totalTaxableValue: 0,
            totalTaxWithoutCess: 0,
            totalCess: 0,
            grandTotal: 0,
            grandTotalMultiCurrency: 0,
            roundOff: 0,
            tcsTotal: 0,
            tdsTotal: 0,
            balanceDue: 0
        };
        this.hasStock = false;

        this.isAdjustAmount = false;
        this.adjustPaymentData = {
            customerName: '',
            customerUniquename: '',
            voucherDate: '',
            balanceDue: 0,
            dueDate: '',
            grandTotal: 0,
            gstTaxesTotal: 0,
            subTotal: 0,
            totalTaxableValue: 0,
            totalAdjustedAmount: 0,
            convertedTotalAdjustedAmount: 0
        };

        this.invoiceForm.get('type').patchValue(this.voucherType);
        this.invoiceForm.get('exchangeRate').patchValue(exchangeRate);
        this.invoiceForm.get('date')?.patchValue(this.universalDate);
        this.invoiceForm.get('roundOffApplicable')?.patchValue(this.applyRoundOff);
        this.isVoucherDateChanged = false;

        let entryFields = [];
        entryFields.push({ key: 'date', value: this.universalDate });
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
            this.invoiceForm.get('account.uniqueName')?.patchValue("cash");
        }


        setTimeout(() => {
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
            const billingDetails = this.invoiceForm.get('account.billingDetails').value;
            this.invoiceForm.get('account.shippingDetails').patchValue(billingDetails);
        }
    }

    /**
     * This will be used to set company billing address to shipping address
     *
     * @memberof VoucherCreateComponent
     */
    public copyCompanyBillingAddressToShippingAddress(): void {
        if (this.copyCompanyBillingInShippingAddress) {
            const billingDetails = this.invoiceForm.get('company.billingDetails').value;
            this.invoiceForm.get('company.shippingDetails').patchValue(billingDetails);
        }
    }

    /**
     * This will be use for send email after create voucher
     *
     * @param {*} response
     * @memberof VoucherCreateComponent
     */
    public sendEmail(response: any): void {
        if (response) {
            if (this.invoiceType.isEstimateInvoice || this.invoiceType.isProformaInvoice) {
                let req: ProformaGetRequest = new ProformaGetRequest();

                req.accountUniqueName = this.voucherDetails?.account?.uniqueName;

                if (this.invoiceType.isProformaInvoice) {
                    req.proformaNumber = this.voucherDetails?.number;
                } else {
                    req.estimateNumber = this.voucherDetails?.number;
                }
                req.emailId = (response.email as string).split(',');
                this.componentStore.sendProformaEstimateOnEmail({ request: req, voucherType: this.voucherType });
            } else {
                this.componentStore.sendVoucherOnEmail({
                    accountUniqueName: this.voucherDetails?.account?.uniqueName, payload: {
                        email: { to: response.email.split(',') },
                        voucherType: this.voucherDetails?.type,
                        copyTypes: response.invoiceType ? response.invoiceType : [],
                        uniqueName: response.uniqueName
                    }
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

        if (typeof voucherDate !== 'string') {
            voucherDate = dayjs(voucherDate).format(GIDDH_DATE_FORMAT);
        }

        if (this.invoiceForm.controls['account'].get('uniqueName')?.value && voucherDate) {
            const requestObject = {
                accountUniqueName: this.invoiceForm.controls['account'].get('uniqueName')?.value,
                voucherType: this.voucherType
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
            if (!this.advanceReceiptAdjustmentData?.adjustments?.length && this.originalVoucherAdjustments?.adjustments?.length) {
                this.advanceReceiptAdjustmentData = cloneDeep(this.originalVoucherAdjustments);
                this.calculateAdjustedVoucherTotal(this.originalVoucherAdjustments?.adjustments);
            }
            this.dialog.open(this.adjustmentModal, {
                width: '800px'
            });
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
     * @memberof VoucherComponent
     */
    public getAdvanceReceiptAdjustData(advanceReceiptsAdjustEvent: { adjustVoucherData: VoucherAdjustments, adjustPaymentData: AdjustAdvancePaymentModal }) {
        this.advanceReceiptAdjustmentData = advanceReceiptsAdjustEvent.adjustVoucherData;
        if (this.advanceReceiptAdjustmentData && this.advanceReceiptAdjustmentData.adjustments) {
            this.advanceReceiptAdjustmentData.adjustments?.forEach(adjustment => {
                adjustment.voucherNumber = adjustment.voucherNumber === this.commonLocaleData?.app_not_available ? '' : adjustment.voucherNumber;
            });
        }
        this.adjustPaymentData = advanceReceiptsAdjustEvent.adjustPaymentData;
        this.calculateAdjustedVoucherTotal(advanceReceiptsAdjustEvent.adjustVoucherData.adjustments)
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
                    if (((this.voucherType === AdjustedVoucherType.SalesInvoice && item?.voucherType === AdjustedVoucherType.DebitNote) || (this.voucherType === AdjustedVoucherType.PurchaseInvoice && item?.voucherType === AdjustedVoucherType.CreditNote) ||
                        (this.voucherType === AdjustedVoucherType.DebitNote && item?.voucherType === AdjustedVoucherType.OpeningBalance && item.voucherBalanceType === "dr") ||
                        ((this.voucherType === AdjustedVoucherType.DebitNote || this.voucherType === AdjustedVoucherType.SalesInvoice || this.voucherType === AdjustedVoucherType.Sales || this.voucherType === AdjustedVoucherType.Payment) && (item?.voucherType === AdjustedVoucherType.Journal || item?.voucherType === AdjustedVoucherType.JournalVoucher) && item?.voucherBalanceType === "dr") ||
                        (this.voucherType === AdjustedVoucherType.CreditNote && item?.voucherType === AdjustedVoucherType.OpeningBalance && item.voucherBalanceType === "cr") ||
                        ((this.voucherType === AdjustedVoucherType.CreditNote || this.voucherType === AdjustedVoucherType.Purchase || this.voucherType === AdjustedVoucherType.Receipt || this.voucherType === AdjustedVoucherType.AdvanceReceipt) && (item?.voucherType === AdjustedVoucherType.Journal || item?.voucherType === AdjustedVoucherType.JournalVoucher) && item?.voucherBalanceType === "cr") ||
                        ((this.voucherType === AdjustedVoucherType.Purchase || this.voucherType === AdjustedVoucherType.PurchaseInvoice) && (item?.voucherType === AdjustedVoucherType.Journal || item?.voucherType === AdjustedVoucherType.JournalVoucher) && item?.voucherBalanceType === "cr"))) {
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
        return parseFloat(Number(this.voucherTotals.grandTotal + this.voucherTotals.tcsTotal - this.adjustPaymentData.totalAdjustedAmount - this.invoiceForm.get('deposit.amountForAccount')?.value - this.voucherTotals.tdsTotal).toFixed(this.company?.giddhBalanceDecimalPlaces));
    }

    /**
     * Calculates balance due
     *
     * @memberof VoucherCreateComponent
     */
    public calculateBalanceDue(): void {
        let depositAmount = Number(this.invoiceForm.get('deposit.amountForAccount')?.value);
        if (this.isMultiCurrencyVoucher) {
            if (this.invoiceForm.get("deposit.currencySymbol")?.value === this.account.baseCurrencySymbol) {
                depositAmount = depositAmount * this.invoiceForm.get('exchangeRate')?.value;
            }
            depositAmount = depositAmount / this.invoiceForm.get('exchangeRate')?.value || 0;
        }

        if (isNaN(this.voucherTotals.grandTotal)) {
            this.voucherTotals.grandTotal = 0;
        }

        if ((this.vouchersForAdjustment?.length || this.isInvoiceAdjustedWithAdvanceReceipts) && this.adjustPaymentData.totalAdjustedAmount) {
            this.adjustPaymentBalanceDueData = this.getCalculatedBalanceDueAfterAdvanceReceiptsAdjustment();
        } else {
            this.adjustPaymentBalanceDueData = 0;
        }

        this.voucherTotals.balanceDue =
            giddhRoundOff((((this.voucherTotals.grandTotal + this.voucherTotals.tcsTotal + this.voucherTotals.roundOff) - this.voucherTotals.tdsTotal) - depositAmount - Number(this.depositAmountBeforeUpdate) - this.totalAdvanceReceiptsAdjustedAmount), this.company?.giddhBalanceDecimalPlaces);

        if (this.isUpdateMode && this.isInvoiceAdjustedWithAdvanceReceipts && !this.adjustPaymentData.totalAdjustedAmount) {
            this.voucherTotals.balanceDue =
                giddhRoundOff((((this.voucherTotals.grandTotal + this.voucherTotals.tcsTotal + this.voucherTotals.roundOff) - this.voucherTotals.tdsTotal) - Number(this.depositAmountBeforeUpdate) - this.totalAdvanceReceiptsAdjustedAmount), this.company?.giddhBalanceDecimalPlaces);
        }
    }

    /**
     * Gets vouchers list for credit/debit note
     *
     * @return {*}  {void}
     * @memberof VoucherCreateComponent
     */
    public getVoucherListForCreditDebitNote(): void {
        if (this.invoiceForm.controls['account'].get('uniqueName')?.value && !this.invoiceType.isCashInvoice && (this.invoiceType.isCreditNote || this.invoiceType.isDebitNote)) {
            let request = {
                accountUniqueName: this.invoiceForm.controls['account'].get('uniqueName')?.value,
                voucherType: this.invoiceType.isCreditNote ? VoucherTypeEnum.creditNote : VoucherTypeEnum.debitNote,
                number: '',
                page: 1
            }

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
            if (typeof this.invoiceForm.get("date")?.value === 'string') {
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
            let newPo = this.invoiceForm.get("linkedPo")?.value?.filter(po => !this.selectedPoItems?.includes(po));
            let selectedOption = this.fieldFilteredOptions?.filter(option => option?.value === newPo[0]);
            let order = selectedOption[0];
            if (order && !this.selectedPoItems.includes(order?.value)) {
                let getRequest = { companyUniqueName: this.activeCompany?.uniqueName, poUniqueName: order?.value };
                this.purchaseOrderService.get(getRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    if (response) {
                        if (response.status === "success" && response.body) {
                            if (this.invoiceForm.get("linkedPo")?.value.includes(response.body.uniqueName)) {
                                if (response.body && response.body.entries && response.body.entries.length > 0) {
                                    this.selectedPoItems.push(response.body.uniqueName);
                                    this.linkedPoNumbers[order?.value]['items'] = response.body.entries;
                                    if (addRemove) {
                                        this.addPoItems(response.body.uniqueName, response.body.entries, 0);
                                    }
                                } else {
                                    this.linkedPoNumbers[order?.value]['items'] = [];
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

        this.invoiceForm.get('entries')['controls']?.forEach((control: any, entryIndex: number) => {
            if (!control.get('transactions.0.account.uniqueName')?.value) {
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
                lastIndex = this.invoiceForm.get('entries')['controls']?.length - 1;
                entryFormGroup = this.getEntryFormGroup(lastIndex);
            }

            this.activeEntryIndex = lastIndex;
            const entryDate = this.invoiceForm.get("date")?.value || this.universalDate;

            let transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);

            if (typeof (entryDate) === "object") {
                transactionFormGroup.get("date")?.patchValue(dayjs(entryDate).format(GIDDH_DATE_FORMAT));
            } else {
                transactionFormGroup.get("date")?.patchValue(dayjs(entryDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT));
            }

            entryFormGroup.get("description")?.patchValue(entry.description);

            const discountsFormArray = entryFormGroup.get('discounts') as FormArray;
            discountsFormArray.clear();
            if (entry.discounts?.length) {
                entry.discounts?.forEach(discount => {
                    discountsFormArray.push(this.getTransactionDiscountFormGroup(discount));
                });
            } else {
                this.account.applicableDiscounts?.forEach(selectedDiscount => {
                    this.discountsList?.forEach(discount => {
                        if (discount?.uniqueName === selectedDiscount?.uniqueName) {
                            discountsFormArray.push(this.getTransactionDiscountFormGroup(discount));
                        }
                    });
                });
            }

            const taxesFormArray = entryFormGroup.get('taxes') as FormArray;
            taxesFormArray.clear();

            const selectedTaxes = [];
            let otherTax = null;
            entry?.taxes?.forEach(selectedTax => {
                this.allCompanyTaxes?.forEach(tax => {
                    if (tax.uniqueName === selectedTax?.uniqueName) {
                        if (this.otherTaxTypes.includes(tax.taxType)) {
                            otherTax = tax;
                        } else {
                            selectedTaxes.push(tax);
                        }
                    }
                });
            });

            selectedTaxes?.forEach(tax => {
                taxesFormArray.push(this.getTransactionTaxFormGroup(tax));
            });

            if (!otherTax && this.account?.otherApplicableTaxes?.length) {
                this.allCompanyTaxes?.forEach(tax => {
                    if (this.account?.otherApplicableTaxes[0]?.uniqueName === tax?.uniqueName && this.otherTaxTypes.includes(tax.taxType)) {
                        otherTax = tax;
                    }
                });
            }

            if (otherTax) {
                const selectedOtherTax = this.allCompanyTaxes?.filter(tax => tax.uniqueName === otherTax.uniqueName);
                otherTax['taxDetail'] = selectedOtherTax[0].taxDetail;
                otherTax['name'] = selectedOtherTax[0].name;
                this.getSelectedOtherTax(entryIndex, otherTax, otherTax.calculationMethod);
            }

            entryFormGroup.get("purchaseOrderItemMapping")?.patchValue({ uniqueName: poUniqueName, entryUniqueName: entry?.uniqueName });

            this.activeEntryIndex = entryIndex;

            transactionFormGroup.get('account.name')?.patchValue(item.account?.name);
            transactionFormGroup.get('account.uniqueName')?.patchValue(item.account?.uniqueName);
            transactionFormGroup.get('amount.amountForAccount').patchValue(item.amount.amountForAccount);
            entryFormGroup.get('hsnNumber')?.patchValue(item.hsnNumber);
            entryFormGroup.get('sacNumber')?.patchValue(item.sacNumber);
            entryFormGroup.get('showCodeType')?.patchValue(item.hsnNumber ? 'hsn' : 'sac');

            if (item.stock) {
                transactionFormGroup.get('stock.name')?.patchValue(item.stock.name);
                transactionFormGroup.get('stock.uniqueName')?.patchValue(item.additional?.stock?.uniqueName);
                transactionFormGroup.get('stock.quantity')?.patchValue(item.stock.quantity);
                transactionFormGroup.get('stock.rate.rateForAccount')?.patchValue(item.stock.rate.amountForAccount);
                transactionFormGroup.get('stock.skuCode')?.patchValue(item.stock.sku);
                transactionFormGroup.get('stock.skuCodeHeading')?.patchValue(item.stock.skuCodeHeading);
                transactionFormGroup.get('stock.stockUnit.code')?.patchValue(item.stock.stockUnit?.code);
                transactionFormGroup.get('stock.stockUnit.uniqueName')?.patchValue(item.stock.stockUnit?.uniqueName);
                transactionFormGroup.get('stock.variant.getParticular')?.patchValue(false);
                transactionFormGroup.get('stock.variant.name')?.patchValue(item.additional?.variant?.name);
                transactionFormGroup.get('stock.variant.uniqueName')?.patchValue(item.additional?.variant?.uniqueName);
                transactionFormGroup.get('stock.variant.salesTaxInclusive')?.patchValue(false);
                transactionFormGroup.get('stock.variant.purchaseTaxInclusive')?.patchValue(item.stock.taxInclusive);

                this.stockUnits[entryIndex] = observableOf(item.stock.unitRates);
                this.componentStore.getStockVariants({ q: item.additional.stock.uniqueName, index: entryIndex, autoSelectVariant: false });
            } else {
                this.stockVariants[entryIndex] = observableOf([]);
                this.stockUnits[entryIndex] = observableOf([]);
            }

            this.checkIfEntriesHasStock();

            if (entries?.length !== (entryIndex + 1)) {
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
                this.selectedPoItems?.forEach(order => {
                    if (!this.invoiceForm.get("linkedPo")?.value.includes(order)) {
                        let entries = (this.linkedPoNumbers[order]) ? this.linkedPoNumbers[order]['items'] : [];
                        let voucherEntries = this.getEntries();

                        if (entries && entries.length > 0 && voucherEntries?.length > 0) {
                            entries.forEach(entry => {
                                entry.transactions?.forEach(item => {
                                    let entryLoop = 0;
                                    let remainingQuantity = (item.stock && item.stock.quantity !== undefined && item.stock.quantity !== null) ? item.stock.quantity : 1;

                                    voucherEntries?.forEach(entry => {
                                        let entryFormGroup = this.getEntryFormGroup(entryLoop);
                                        let entryRemoved = false;

                                        if (entryFormGroup && remainingQuantity > 0 && entryFormGroup.get("purchaseOrderItemMapping.uniqueName")?.value === order) {
                                            let transactionLoop = 0;
                                            entry.transactions?.forEach(transaction => {
                                                let transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);

                                                if (remainingQuantity > 0) {
                                                    let accountUniqueName = transactionFormGroup.get("account.uniqueName")?.value;
                                                    if (accountUniqueName) {
                                                        accountUniqueName = accountUniqueName?.replace("purchases#", "");
                                                    }

                                                    let stockUniqueName = (item.stock && item.stock.uniqueName) ? item.stock.uniqueName : "";
                                                    if (stockUniqueName) {
                                                        stockUniqueName = stockUniqueName?.replace("purchases#", "");
                                                    }

                                                    if (item.stock && item.stock.uniqueName && accountUniqueName) {
                                                        if (stockUniqueName === accountUniqueName) {
                                                            if (transactionFormGroup.get("stock.quantity")?.value > remainingQuantity) {
                                                                transactionFormGroup.get("stock.quantity")?.patchValue(transactionFormGroup.get("stock.quantity")?.value - remainingQuantity);
                                                                remainingQuantity -= remainingQuantity;
                                                            } else {
                                                                remainingQuantity -= transactionFormGroup.get("stock.quantity")?.value;
                                                                entryRemoved = true;
                                                                this.deleteLineEntry(entryLoop);
                                                            }
                                                        }
                                                    } else if (item.account && item.account.uniqueName && accountUniqueName) {
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
        this.showLoader = isLoading;
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
        this.purchaseOrders?.forEach(option => {
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
        if (transaction.get("stock.quantity")?.value !== undefined && this.invoiceType.isPurchaseInvoice && transaction.get("stock.maxQuantity")?.value !== undefined && transaction.get("stock.maxQuantity")?.value !== null) {
            if (transaction.get("stock.quantity")?.value > transaction.get("stock.maxQuantity")?.value) {
                transaction.get("stock.quantity")?.patchValue(transaction.get("stock.maxQuantity")?.value);
                this.toasterService.showSnackBar("error", this.localeData?.quantity_error + " (" + transaction.get("stock.maxQuantity")?.value + ")");
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
        entries?.forEach(entry => {
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
        amount = (amount) ? String(amount)?.replace(this.company.baseCurrencySymbol, '') : '';
        let total = (amount) ? (parseFloat(this.generalService.removeSpecialCharactersFromAmount(amount)) || 0) : 0;
        this.invoiceForm.get('exchangeRate')?.patchValue(total / this.voucherTotals.grandTotal || 0);
    }

    /**
     * Updates other tax of entry
     *
     * @param {FormGroup} entryFormGroup
     * @param {*} amount
     * @memberof VoucherCreateComponent
     */
    public updateEntryOtherTax(entryFormGroup: FormGroup, amount: any): void {
        entryFormGroup.get('otherTax.amount').patchValue(amount);
    }

    /**
     * Close tax modal
     *
     * @memberof VoucherCreateComponent
     */
    public closeTaxModal(): void {
        this.store.dispatch(this.companyActions.getTax());
        this.taxAsideMenuRef.close();
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

        transactionFormGroup.get('account.name')?.patchValue(response.name);
        transactionFormGroup.get('account.uniqueName')?.patchValue(response.uniqueName);

        if (response.stock) {
            transactionFormGroup.get('stock.name')?.patchValue(response.stock.name);
            transactionFormGroup.get('stock.uniqueName')?.patchValue(response.stock.uniqueName);

            if (response?.stock?.customField1Value) {
                if (response?.stock?.customField1Heading) {
                    transactionFormGroup.get('stock.customField1.key')?.patchValue(response?.stock?.customField1Heading);
                } else {
                    transactionFormGroup.get('stock.customField1.key')?.patchValue(this.localeData?.custom_field1);
                }
                transactionFormGroup.get('stock.customField1.value')?.patchValue(response?.stock?.customField1Value);
            }

            if (response?.stock?.customField2Value) {
                if (response?.stock?.customField2Heading) {
                    transactionFormGroup.get('stock.customField2.key')?.patchValue(response?.stock?.customField2Heading);
                } else {
                    transactionFormGroup.get('stock.customField2.key')?.patchValue(this.localeData?.custom_field2);
                }
                transactionFormGroup.get('stock.customField2.value')?.patchValue(response?.stock?.customField2Value);
            }

            entryFormGroup.get('hsnNumber')?.patchValue(response.stock.hsnNumber || response.hsnNumber);
            entryFormGroup.get('sacNumber')?.patchValue(response.stock.sacNumber || response.sacNumber);
            entryFormGroup.get('showCodeType')?.patchValue(response.stock.hsnNumber || response.hsnNumber ? 'hsn' : 'sac');

            let rate = Number((response.stock.variant?.unitRates[0].rate / this.invoiceForm.get('exchangeRate')?.value).toFixed(this.highPrecisionRate));
            transactionFormGroup.get('stock.rate.rateForAccount')?.patchValue(rate);
            transactionFormGroup.get('stock.skuCode')?.patchValue(response.stock.skuCode);
            transactionFormGroup.get('stock.skuCodeHeading')?.patchValue(response.stock.skuCodeHeading);
            transactionFormGroup.get('stock.stockUnit.code')?.patchValue(response.stock.variant?.unitRates[0]?.stockUnitCode);
            transactionFormGroup.get('stock.stockUnit.uniqueName')?.patchValue(response.stock.variant?.unitRates[0]?.stockUnitUniqueName);

            if (response.stock.variant?.name) {
                transactionFormGroup.get('stock.variant.name')?.patchValue(response.stock.variant?.name);
            }
            transactionFormGroup.get('stock.variant.uniqueName')?.patchValue(response.stock.variant?.uniqueName);

            transactionFormGroup.get('stock.variant.salesTaxInclusive')?.patchValue(response.stock.variant?.salesTaxInclusive);
            transactionFormGroup.get('stock.variant.purchaseTaxInclusive')?.patchValue(response.stock.variant?.purchaseTaxInclusive);

            if (response.stock.variant?.salesTaxInclusive || response.stock.variant?.purchaseTaxInclusive) {
                transactionFormGroup.get('amount.amountForAccount').patchValue(rate * transactionFormGroup.get('stock.quantity')?.value);
            }

            const discountsFormArray = entryFormGroup.get('discounts') as FormArray;
            discountsFormArray.clear();
            if (response.stock.variant?.variantDiscount?.discounts) {
                response.stock.variant?.variantDiscount?.discounts?.forEach(selectedDiscount => {
                    this.discountsList?.forEach(discount => {
                        if (discount?.uniqueName === selectedDiscount?.discount?.uniqueName) {
                            discountsFormArray.push(this.getTransactionDiscountFormGroup(discount));
                        }
                    });
                });
            } else {
                this.account.applicableDiscounts?.forEach(selectedDiscount => {
                    this.discountsList?.forEach(discount => {
                        if (discount?.uniqueName === selectedDiscount?.uniqueName) {
                            discountsFormArray.push(this.getTransactionDiscountFormGroup(discount));
                        }
                    });
                });
            }

            this.stockUnits[entryIndex] = observableOf(response.stock.variant.unitRates);
        } else {
            this.stockVariants[entryIndex] = observableOf([]);
            this.stockUnits[entryIndex] = observableOf([]);

            entryFormGroup.get('hsnNumber')?.patchValue(response.hsnNumber);
            entryFormGroup.get('sacNumber')?.patchValue(response.sacNumber);
            entryFormGroup.get('showCodeType')?.patchValue(response.hsnNumber ? 'hsn' : 'sac');

            const discountsFormArray = entryFormGroup.get('discounts') as FormArray;
            discountsFormArray.clear();

            this.account.applicableDiscounts?.forEach(selectedDiscount => {
                this.discountsList?.forEach(discount => {
                    if (discount?.uniqueName === selectedDiscount?.uniqueName) {
                        discountsFormArray.push(this.getTransactionDiscountFormGroup(discount));
                    }
                });
            });
        }

        const taxes = this.generalService.fetchTaxesOnPriority(
            response.stock?.taxes ?? [],
            response.stock?.groupTaxes ?? [],
            response.taxes ?? [],
            response.groupTaxes ?? []);

        const taxesFormArray = entryFormGroup.get('taxes') as FormArray;
        taxesFormArray.clear();

        const selectedTaxes = [];
        let otherTax = null;
        taxes?.forEach(selectedTax => {
            this.allCompanyTaxes?.forEach(tax => {
                if (tax.uniqueName === selectedTax) {
                    if (this.otherTaxTypes.includes(tax.taxType)) {
                        otherTax = tax;
                    } else {
                        selectedTaxes.push(tax);
                    }
                }
            });
        });

        selectedTaxes?.forEach(tax => {
            taxesFormArray.push(this.getTransactionTaxFormGroup(tax));
        });

        if (!otherTax && this.account?.otherApplicableTaxes?.length) {
            this.allCompanyTaxes?.forEach(tax => {
                if (this.account?.otherApplicableTaxes[0]?.uniqueName === tax?.uniqueName && this.otherTaxTypes.includes(tax.taxType)) {
                    otherTax = tax;
                }
            });
        }

        if (otherTax) {
            const selectedOtherTax = this.allCompanyTaxes?.filter(tax => tax.uniqueName === otherTax.uniqueName);
            otherTax['taxDetail'] = selectedOtherTax[0].taxDetail;
            otherTax['name'] = selectedOtherTax[0].name;
            this.getSelectedOtherTax(entryIndex, otherTax, otherTax.calculationMethod);
        }

        if (response.stock?.variant?.salesTaxInclusive || response.stock?.variant?.purchaseTaxInclusive) {
            const amount = this.vouchersUtilityService.calculateInclusiveRate(entryFormGroup?.value, this.companyTaxes, this.company.giddhBalanceDecimalPlaces);
            transactionFormGroup.get('amount.amountForAccount').patchValue(amount);
            transactionFormGroup.get('stock.rate.rateForAccount')?.patchValue((amount / transactionFormGroup.get('stock.quantity')?.value));
        }

        this.checkIfEntriesHasStock();
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
    @HostListener('document:keydown', ['$event'])
    public handleKeyboardDownEvent(event: KeyboardEvent) {
        this.startTime = event.timeStamp;
    }

    // detecting keyup event for barcode scan
    @HostListener('document:keyup', ['$event'])
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
            this.barcodeValue = '';
        }

        setTimeout(() => {
            this.isBarcodeMachineTyping = false;
            this.barcodeValue = "";
        }, 1000);
    }

    /**
     * Returns the string when barcode machine finishes typing the word
     *
     * @param {KeyboardEvent} event
     * @returns {(string | null)}
     * @memberof VoucherCreateComponent
     */
    public detectBarcode(event: KeyboardEvent): string | null {
        let ignoreKeyList = ['Shift', 'Meta', 'Backspace'];
        const key = event.key;
        if (key === 'Enter') {
            if (this.barcodeValue.length) {
                return this.barcodeValue;
            } else {
                return null;
            }
        } else {
            if (!ignoreKeyList.includes(key)) {
                this.barcodeValue += (this.lastScannedKey === 'Shift') ? key?.toUpperCase() : key;
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
        let params = {
            barcode: this.barcodeValue,
            customerUniqueName: this.invoiceForm.controls['account'].get('uniqueName')?.value ?? "",
            invoiceType: this.invoiceType.isPurchaseOrder ? "purchase" : this.invoiceForm.get('type')?.value
        };

        this.commonService.getBarcodeScanData(this.barcodeValue, params).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.body && response.status === 'success') {
                this.barcodeValue = '';

                if (!response.body?.uniqueName) {
                    this.toasterService.showSnackBar("warning", response.body?.parentGroups[1] + " " + this.localeData?.account_missing_in_stock);
                    return;
                }

                let isExistingEntry = -1;
                this.invoiceForm.get('entries')['controls']?.forEach((control: any, entryIndex: number) => {
                    if (isExistingEntry === -1 && control.get('transactions.0.stock.variant.uniqueName')?.value === response.body?.stock?.variant?.uniqueName) {
                        isExistingEntry = entryIndex;
                    }
                });

                if (isExistingEntry === -1) {
                    let entryFormGroup = this.getEntryFormGroup(this.invoiceForm.get('entries')['controls']?.length - 1);
                    let transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);

                    if (transactionFormGroup.get('account.uniqueName')?.value) {
                        this.addNewLineEntry();
                    }

                    let activeEntryIndex = this.invoiceForm.get('entries')['controls']?.length - 1;
                    if (response?.body?.stock) {
                        this.componentStore.getStockVariants({ q: response?.body?.stock?.uniqueName, index: activeEntryIndex, autoSelectVariant: false });
                    }

                    entryFormGroup = this.getEntryFormGroup(activeEntryIndex);
                    transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);

                    transactionFormGroup.get('stock.variant.getParticular')?.patchValue(false);

                    this.prefillParticularDetails(activeEntryIndex, response.body);
                } else {
                    this.activeEntryIndex = isExistingEntry;

                    let entryFormGroup = this.getEntryFormGroup(this.activeEntryIndex);
                    let transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);
                    transactionFormGroup.get('stock.quantity')?.patchValue(transactionFormGroup.get('stock.quantity')?.value + 1);
                    transactionFormGroup.get('stock.variant.getParticular')?.patchValue(true);
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
    public openPurchaseOrderPreviewPopup(template: TemplateRef<any>, purchaseOrderUniqueName: any, accountUniqueName: any): void {
        this.purchaseOrderPreviewUniqueName = purchaseOrderUniqueName;
        this.purchaseOrderPreviewAccountUniqueName = accountUniqueName;

        this.dialog.open(template, {
            width: '980px'
        });
    }

    /**
     * Updates hsn/sac value into each other
     *
     * @param {FormGroup} entryFormGroup
     * @memberof VoucherCreateComponent
     */
    public onChangeHsnSacType(entryFormGroup: FormGroup): void {
        if (entryFormGroup.get('showCodeType')?.value === "hsn") {
            entryFormGroup.get('hsnNumber')?.patchValue(entryFormGroup.get('sacNumber')?.value);
            entryFormGroup.get('sacNumber')?.patchValue(null);
        } else {
            entryFormGroup.get('sacNumber')?.patchValue(entryFormGroup.get('hsnNumber')?.value);
            entryFormGroup.get('hsnNumber')?.patchValue(null);
        }
    }

    /**
     * Does reverse calculation if entry total changes
     *
     * @param {FormGroup} entryFormGroup
     * @memberof VoucherCreateComponent
     */
    public doReverseCalculation(entryFormGroup: FormGroup): void {
        setTimeout(() => {
            const transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);
            const amount = this.vouchersUtilityService.calculateInclusiveRate(entryFormGroup?.value, this.companyTaxes, this.company.giddhBalanceDecimalPlaces, Number(entryFormGroup.get('total.amountForAccount')?.value));
            transactionFormGroup.get('amount.amountForAccount').patchValue(amount);
            transactionFormGroup.get('stock.rate.rateForAccount')?.patchValue((amount / transactionFormGroup.get('stock.quantity')?.value));
        }, 10);
    }

    /**
     * Switches currency
     *
     * @memberof VoucherCreateComponent
     */
    public switchCurrency(): void {
        this.currencySwitched = !this.currencySwitched;
        this.invoiceForm.get('exchangeRate')?.patchValue(1 / this.invoiceForm.get('exchangeRate')?.value);
    }

    /**
     * Gets voucher details
     *
     * @private
     * @param {*} params
     * @memberof VoucherCreateComponent
     */
    private getVoucherDetails(params: any): void {
        this.startLoader(true);
        if (this.invoiceType.isPurchaseOrder) {
            this.componentStore.getPurchaseOrderDetails(params?.uniqueName);
        } else if (this.invoiceType.isEstimateInvoice) {
            this.componentStore.getEstimateProformaDetails({ voucherType: this.voucherType, payload: { accountUniqueName: params?.accountUniqueName, estimateNumber: params?.uniqueName, voucherType: this.voucherType } });
        } else if (this.invoiceType.isProformaInvoice) {
            this.componentStore.getEstimateProformaDetails({ voucherType: this.voucherType, payload: { accountUniqueName: params?.accountUniqueName, proformaNumber: params?.uniqueName, voucherType: this.voucherType } });
        } else {
            this.componentStore.getVoucherDetails({ isCopyVoucher: false, accountUniqueName: params?.accountUniqueName, payload: { uniqueName: params?.uniqueName, voucherType: this.voucherType } });
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
        let invoiceType = (this.invoiceType.isProformaInvoice ? this.localeData?.invoice_types?.proforma
            : this.invoiceType.isEstimateInvoice ? this.localeData?.invoice_types?.estimate
                : this.invoiceType.isSalesInvoice && !this.invoiceType.isCashInvoice ? this.localeData?.invoice_types?.invoice : this.invoiceType.isCreditNote && !this.invoiceType.isCashInvoice ? this.localeData?.invoice_types?.credit_note : this.invoiceType.isDebitNote && !this.invoiceType.isCashInvoice ? this.localeData?.invoice_types?.debit_note : this.invoiceType.isPurchaseInvoice && !this.invoiceType.isCashInvoice ? this.localeData?.invoice_types?.purchase : this.invoiceType.isCashInvoice ? this.localeData?.invoice_types?.cash_invoice
                    : this.invoiceType.isPurchaseInvoice && this.invoiceType.isCashInvoice ? this.localeData?.invoice_types?.cash_bill : this.invoiceType.isCreditNote && this.invoiceType.isCashInvoice ? this.localeData?.invoice_types?.cash_credit_note : this.invoiceType.isDebitNote && this.invoiceType.isCashInvoice ? this.localeData?.invoice_types?.cash_debit_note : this.localeData?.invoice_types?.purchase_order);

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
            this.componentStore.getStockVariants({ q: entry.transactions[0]?.stock?.uniqueName, index: entryIndex, autoSelectVariant: false });
        }
    }
}
