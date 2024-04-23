import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { VoucherComponentStore } from "../utility/vouchers.store";
import { AppState } from "../../store";
import { Store } from "@ngrx/store";
import { Observable, ReplaySubject, debounceTime, delay, distinctUntilChanged, of as observableOf, take, takeUntil } from "rxjs";
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
import { cloneDeep, uniqBy } from "../../lodash-optimized";
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
        giddhBalanceDecimalPlaces: 2
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
        excludeTax: false
    };
    /** Invoice Settings */
    public activeCompany: any;
    /** This will hold onboarding api form request */
    public onboardingFormRequest: OnboardingFormRequest = { formName: '', country: '' };
    /** Onboarding form fields */
    public formFields: any[] = [];
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
    public isAdjustAmount = false;
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
    public barcodeValue: string = "456";
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

    /** Tax validations */
    public taxNumberValidations: any = {
        account: {
            billingAddress: null,
            shippingAddress: null
        },
        company: {
            billingAddress: null,
            shippingAddress: null
        }
    };
    /** True if we need to same billing to shipping address */
    public getActiveSameBillingAddress: boolean = true;

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
        private proformaService: ProformaService
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
        this.getCompanyProfile();
        this.getCompanyTaxes();
        this.getWarehouses();

        this.activatedRoute.params.pipe(delay(0), takeUntil(this.destroyed$)).subscribe(params => {
            if (params) {
                this.voucherType = this.vouchersUtilityService.parseVoucherType(params.voucherType);
                if (this.voucherApiVersion !== 2) {
                    this.router.navigate(["/pages/proforma-invoice/invoice/" + this.voucherType]);
                }

                /** Open account dropdown on create */
                if (!params?.uniqueName) {
                    this.openAccountDropdown = true;
                } else {
                    this.invoiceForm.get('uniqueName').patchValue(params?.uniqueName);
                }

                this.getVoucherType();
                this.searchAccount();
                this.getIsTcsTdsApplicable();
                this.getActiveCompany();
                this.getInvoiceSettings();
                this.getCreatedTemplates();
                this.getOnboardingFormData();
                this.getBriefAccounts();
                this.searchStock();

                if (this.invoiceType.isCashInvoice) {
                    this.invoiceForm.get('account.uniqueName')?.patchValue("cash");
                }
                this.invoiceForm.get('type').patchValue(this.voucherType);
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
                this.updateAccountDataInForm(response);
            }
        });

        /** Country details */
        this.componentStore.countryData$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.accountStateList$ = observableOf(response?.stateList?.map(res => { return { label: res.name, value: res.code } }));
            }
        });

        /** Has unsaved changes */
        this.componentStore.hasSavedChanges$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.hasUnsavedChanges = response;
        });

        /** New account details */
        this.componentStore.newAccountDetails$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.createUpdateAccountCallback(response);
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
                this.stockVariants[response.entryIndex] = observableOf(response.results);
                this.selectVariant(response.results[0], response.entryIndex);
            }
        });

        /** Particular details */
        this.componentStore.particularDetails$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.body) {
                this.prefillParticularDetails(response.entryIndex, response.body);
            }
        });

        /** Account billing address tax number observable */
        this.invoiceForm.controls['account'].get("billingAddress").get("taxNumber")?.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            this.checkGstNumValidation(searchedText, "account", "billingAddress");
        });

        /** Account shipping address tax number observable */
        this.invoiceForm.controls['account'].get("shippingAddress").get("taxNumber")?.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            this.checkGstNumValidation(searchedText, "account", "shippingAddress");
        });

        /** Company billing address tax number observable */
        this.invoiceForm.controls['company'].get("billingAddress").get("taxNumber")?.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            this.checkGstNumValidation(searchedText, "company", "billingAddress");
        });

        /** Company shipping address tax number observable */
        this.invoiceForm.controls['company'].get("shippingAddress").get("taxNumber")?.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            this.checkGstNumValidation(searchedText, "company", "shippingAddress");
        });

        /** Voucher details observable */
        this.componentStore.voucherDetails$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.getAccountDetails(response?.account.uniqueName);

                const entriesFormArray = this.invoiceForm.get('entries') as FormArray;
                entriesFormArray.clear();

                response?.entries?.forEach((entry: any, index: number) => {
                    if (entry.transactions[0]?.stock) {
                        this.stockUnits[index] = observableOf(entry.transactions[0]?.stock.unitRates);
                        this.componentStore.getStockVariants({ q: entry.transactions[0]?.stock?.uniqueName, index: index, autoSelectVariant: true });
                    }
                    this.invoiceForm.get('entries')['controls'].push(this.getEntriesFormGroup(entry));

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
                                normalTaxes.push(tax);
                            }
                        });

                        if (normalTaxes?.length) {
                            this.getSelectedTaxes(index, normalTaxes);
                        }

                        if (otherTax) {
                            const selectedOtherTax = this.companyTaxes?.filter(tax => tax.uniqueName === otherTax.uniqueName);
                            otherTax['taxDetail'] = selectedOtherTax[0].taxDetail;
                            otherTax['name'] = selectedOtherTax[0].name;
                            this.getSelectedOtherTax(index, otherTax, otherTax.calculationMethod);
                        }
                    }
                });

                this.startLoader(false);
            }
        });

        this.componentStore.sendEmailIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.emailDialogRef?.close();
            }
        });

        this.componentStore.vouchersForAdjustment$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                const results = (response.body?.results || response.body?.items || response.body);
                this.vouchersForAdjustment = results?.map(result => ({ ...result, adjustmentAmount: { amountForAccount: result.balanceDue?.amountForAccount, amountForCompany: result.balanceDue?.amountForCompany } }));
            }
        });

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

        this.linkPoDropdown.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(search => {
            this.filterPurchaseOrder(search);
        });

        this.vendorPurchaseOrders$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.purchaseOrders = response;
            this.filterPurchaseOrder("");
        });

        this.componentStore.linkedPoOrders$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.linkedPoNumbers = response;
        });

        this.invoiceForm.controls['deposit'].get("amountForAccount")?.valueChanges.pipe(
            debounceTime(100),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(response => {
            this.calculateBalanceDue();
        });
    }

    public creditNoteInvoiceSelected(event: any): void {
        if (event && event.additional && event.value) {
            const referenceVoucher = this.invoiceForm.controls["referenceVoucher"];
            referenceVoucher.get("uniqueName")?.patchValue(event.value);
            referenceVoucher.get("voucherType")?.patchValue(event.additional?.voucherType);
            referenceVoucher.get("number")?.patchValue(event.additional?.voucherNumber);
            referenceVoucher.get("date")?.patchValue(event.additional?.voucherDate);
        }
    }

    /**
     * Resets invoice list and current page
     *
     * @memberof VoucherComponent
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
    private getVoucherType(): void {
        this.invoiceType = this.vouchersUtilityService.getVoucherType(this.voucherType);
        this.currentVoucherFormDetails = this.vouchersUtilityService.prepareVoucherForm(this.voucherType);
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
                    this.useCustomVoucherNumber = settings?.invoiceSettings?.useCustomInvoiceNumber;
                } else if (this.voucherType === VoucherTypeEnum.purchase) {
                    this.applyRoundOff = settings.invoiceSettings.purchaseRoundOff;
                    this.useCustomVoucherNumber = true;
                } else if (this.voucherType === VoucherTypeEnum.debitNote) {
                    this.applyRoundOff = settings.invoiceSettings.debitNoteRoundOff;
                    this.useCustomVoucherNumber = true;
                } else if (this.voucherType === VoucherTypeEnum.creditNote) {
                    this.applyRoundOff = settings.invoiceSettings.creditNoteRoundOff;
                    this.useCustomVoucherNumber = settings?.invoiceSettings?.useCustomCreditNoteNumber;
                } else if (this.voucherType === VoucherTypeEnum.estimate || this.voucherType === VoucherTypeEnum.generateEstimate || this.voucherType === VoucherTypeEnum.proforma || this.voucherType === VoucherTypeEnum.generateProforma) {
                    this.applyRoundOff = true;
                    this.useCustomVoucherNumber = true;
                } else if (this.voucherType === VoucherTypeEnum.purchaseOrder) {
                    this.useCustomVoucherNumber = settings?.purchaseBillSettings?.useCustomPONumber;
                }
                this.updateDueDate();
            }
        });
    }

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
        this.discountsList$.pipe(takeUntil(this.destroyed$)).subscribe(discountsList => {
            if (!discountsList) {
                this.componentStore.getDiscountsList();
            } else {
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
        this.componentStore.companyProfile$.pipe(takeUntil(this.destroyed$)).subscribe(profile => {
            if (profile && Object.keys(profile).length && !this.company?.countryName) {
                this.company.countryName = profile.country;
                this.company.countryCode = profile.countryCode || profile.countryV2.alpha2CountryCode;
                this.company.baseCurrency = profile.baseCurrency;
                this.company.baseCurrencySymbol = profile.baseCurrencySymbol;
                this.company.inputMaskFormat = profile.balanceDisplayFormat?.toLowerCase() || '';
                this.company.giddhBalanceDecimalPlaces = profile.balanceDecimalPlaces;
                this.showTaxTypeByCountry(this.company.countryCode);

                if (this.invoiceType.isCashInvoice) {
                    this.getCountryData(this.company.countryCode);
                }
            }
        });
    }

    /**
     * Gets active company details
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private getActiveCompany(): void {
        this.componentStore.activeCompany$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.activeCompany = response;
                this.company.addresses = response.addresses;
            }
        })
    }

    /**
     * Finds tax type by country and calls onboarding form api
     *
     * @private
     * @param {string} countryCode
     * @memberof VoucherCreateComponent
     */
    private showTaxTypeByCountry(countryCode: string): void {
        this.company.taxType = this.vouchersUtilityService.showTaxTypeByCountry(countryCode, this.activeCompany?.countryV2?.alpha2CountryCode);
        if (this.company.taxType) {
            if (this.company.taxType === TaxType.GST) {
                this.company.taxTypeLabel = this.commonLocaleData?.app_gstin;
            } else if (this.company.taxType === TaxType.VAT) {
                this.company.taxTypeLabel = this.commonLocaleData?.app_enter_vat;
            } else if (this.company.taxType === TaxType.TRN) {
                this.company.taxTypeLabel = this.commonLocaleData?.app_trn;
            }

            this.getOnboardingForm(countryCode);
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
    private getOnboardingFormData(): void {
        this.componentStore.onboardingForm$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.formFields = [];
                Object.keys(response.fields)?.forEach(key => {
                    if (response?.fields[key]) {
                        this.formFields[response.fields[key]?.name] = [];
                        this.formFields[response.fields[key]?.name] = response.fields[key];
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
        this.componentStore.companyTaxes$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (!response) {
                this.store.dispatch(this.companyActions.getTax());
            } else {
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
        this.componentStore.warehouseList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (!response) {
                this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: 1, count: 0 }));
            } else {
                let warehouseResults = response.results?.filter(warehouse => !warehouse.isArchived);
                const warehouseData = this.settingsUtilityService.getFormattedWarehouseData(warehouseResults);
                this.warehouses = warehouseData.formattedWarehouses;
                this.showWarehouse = this.warehouses?.length ? true : false;
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
        this.componentStore.branchList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (!response) {
                this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '' }));
            } else {
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
     * Gets list of last 5 vouchers
     *
     * @memberof VoucherCreateComponent
     */
    public getPreviousVouchers(): void {
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
            } else {
                this.fetchPreviousVouchers();
            }
        });
    }

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
    public searchAccount(query: string = '', page: number = 1): void {
        if (this.voucherType === VoucherTypeEnum.cash) {
            return;
        }

        if (this.accountSearchRequest?.isLoading) {
            return;
        }

        let accountSearchRequest = this.vouchersUtilityService.getSearchRequestObject(this.voucherType, query, page, SearchType.CUSTOMER);
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
                this.voucherAccountResults$ = observableOf(voucherAccountResults.concat(...newResults));
            } else {
                this.accountSearchRequest.loadMore = false;
                if (page === 1) {
                    this.voucherAccountResults$ = observableOf(null);
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
     * Gets bank accounts
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private getBriefAccounts(): void {
        this.componentStore.briefAccounts$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (!response) {
                this.componentStore.getBriefAccounts({ group: BriedAccountsGroup });
            } else {
                this.briefAccounts$ = observableOf(response);
            }
        });
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

        if (this.invoiceType.isSalesInvoice || this.invoiceType.isPurchaseInvoice || this.invoiceType.isCreditNote || this.invoiceType.isDebitNote) {
            this.getPreviousVouchers();
            this.getAllVouchersForAdjustment();
            this.getVoucherListForCreditDebitNote();
        }

        if (this.invoiceType.isPurchaseInvoice) {
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
        if (event || isClear) {
            const entryFormGroup = this.getEntryFormGroup(entryIndex);
            const transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);

            if (!isClear) {
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
                    let payload = {};

                    if (event?.additional?.stock?.uniqueName) {
                        payload = { stockUniqueName: event?.additional?.stock?.uniqueName, customerUniqueName: this.invoiceForm.get('account.uniqueName')?.value };
                    }

                    this.componentStore.getParticularDetails({ accountUniqueName: transactionFormGroup.get("account.uniqueName")?.value, payload: payload, entryIndex: entryIndex });
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
        if (event || isClear) {
            if (isClear) {

            } else {
                const entryFormGroup = this.getEntryFormGroup(entryIndex);
                const transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);
                const transactionStockVariantFormGroup = transactionFormGroup.get('stock').get('variant');

                transactionStockVariantFormGroup.get('name')?.patchValue(event?.label);
                transactionStockVariantFormGroup.get('uniqueName')?.patchValue(event?.value);

                this.componentStore.getParticularDetails({ accountUniqueName: transactionFormGroup.get("account.uniqueName")?.value, payload: { variantUniqueName: event?.value, customerUniqueName: this.invoiceForm.get('account.uniqueName')?.value }, entryIndex: entryIndex });
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
    private updateAccountDataInForm(accountData: any): void {
        this.showTaxTypeByCountry(accountData.country?.countryCode);

        let isPartyTypeSez = false;
        if (accountData?.addresses?.length > 0) {
            accountData.addresses.forEach(address => {
                if (address.partyType && address.partyType.toLowerCase() === "sez") {
                    isPartyTypeSez = true;
                }
            });
        }

        this.account = {
            countryName: accountData.country?.countryName,
            countryCode: accountData.country?.countryCode,
            baseCurrency: accountData.currency,
            baseCurrencySymbol: accountData.currencySymbol,
            addresses: accountData.addresses,
            otherApplicableTaxes: accountData.otherApplicableTaxes,
            applicableDiscounts: accountData.applicableDiscounts || accountData.inheritedDiscounts,
            applicableTaxes: accountData.applicableTaxes,
            excludeTax: (this.company.countryName === "India" && accountData.country?.countryName !== "India") || isPartyTypeSez
        };

        let defaultAddress = null;
        let index = 0;

        let accountDefaultAddress = this.vouchersUtilityService.getDefaultAddress(accountData);
        defaultAddress = accountDefaultAddress.defaultAddress;
        index = accountDefaultAddress.defaultAddressIndex;

        if (defaultAddress) {
            this.fillBillingShippingAddress("account", "billingAddress", defaultAddress, index);
            this.fillBillingShippingAddress("account", "shippingAddress", defaultAddress, index);
        }

        if (this.invoiceType.isPurchaseOrder) {
            let companyDefaultAddress = this.vouchersUtilityService.getDefaultAddress(this.company?.branch);
            defaultAddress = companyDefaultAddress.defaultAddress;
            index = companyDefaultAddress.defaultAddressIndex;

            if (defaultAddress) {
                this.fillBillingShippingAddress("company", "billingAddress", defaultAddress, index);
                this.fillBillingShippingAddress("company", "shippingAddress", defaultAddress, index);
            }
        }

        this.isMultiCurrencyVoucher = this.account.baseCurrency !== this.company.baseCurrency;
        if (this.isMultiCurrencyVoucher) {
            this.getExchangeRate(this.account.baseCurrency, this.company.baseCurrency, this.invoiceForm.get('date')?.value);
        }

        this.invoiceForm.controls["account"].get("attentionTo").setValue(accountData?.attentionTo);
        this.invoiceForm.controls["account"].get("email").setValue(accountData?.email);
        this.invoiceForm.controls["account"].get("mobileNumber").setValue(accountData?.mobileNo);

        this.getStockByBarcode();
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
        this.invoiceForm.controls[entityType].get(addressType).get("address").patchValue([address?.address]);
        this.invoiceForm.controls[entityType].get(addressType).get("pincode").patchValue(address?.pincode);
        this.invoiceForm.controls[entityType].get(addressType).get("taxNumber").patchValue(address?.gstNumber);
        this.invoiceForm.controls[entityType].get(addressType).get("state").get("name").patchValue(address?.state?.name);
        this.invoiceForm.controls[entityType].get(addressType).get("state").get("code").patchValue(address?.state?.code);
    }

    /**
     * Translation complete callback
     *
     * @param {*} event
     * @memberof VoucherCreateComponent
     */
    public translationComplete(event: any): void {
        if (event) {

        }
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
                billingAddress: this.getAddressFormGroup(),
                shippingAddress: this.getAddressFormGroup()
            }),
            company: this.formBuilder.group({
                billingAddress: this.getAddressFormGroup(),
                shippingAddress: this.getAddressFormGroup()
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
            grandTotalMultiCurrency: [0] //temp
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
    private getEntriesFormGroup(entryData?: any): FormGroup {
        return this.formBuilder.group({
            date: [!this.invoiceType.isPurchaseOrder && !this.invoiceType.isEstimateInvoice && !this.invoiceType.isProformaInvoice ? this.invoiceForm?.get('date')?.value || this.universalDate || dayjs().format(GIDDH_DATE_FORMAT) : null],
            description: [entryData ? entryData?.description : ''],
            voucherType: [this.voucherType],
            uniqueName: [''],
            showCodeType: [entryData && entryData?.hsnNumber ? 'hsn' : 'sac'], //temp
            hsnNumber: [entryData ? entryData?.hsnNumber : ''],
            sacNumber: [entryData ? entryData?.sacNumber : ''],
            attachedFile: [''],
            attachedFileName: [''],
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
                        maxQuantity: [entryData ? entryData?.transactions[0]?.stock?.quantity : 1], //temp (for PO linking in PB)
                        rate: this.formBuilder.group({
                            rateForAccount: [entryData ? entryData?.transactions[0]?.stock?.rate?.rateForAccount : 1]
                        }),
                        stockUnit: this.formBuilder.group({
                            code: [entryData ? entryData?.transactions[0]?.stock?.stockUnit?.code : ''],
                            uniqueName: [entryData ? entryData?.transactions[0]?.stock?.stockUnit?.uniqueName : '']
                        }),
                        variant: this.formBuilder.group({
                            name: [entryData ? entryData?.transactions[0]?.stock?.variant?.name : ''],
                            uniqueName: [entryData ? entryData?.transactions[0]?.stock?.variant?.uniqueName : ''],
                            salesTaxInclusive: [entryData ? entryData?.transactions[0]?.stock?.variant?.salesTaxInclusive : false],
                            purchaseTaxInclusive: [entryData ? entryData?.transactions[0]?.stock?.variant?.purchaseTaxInclusive : false]
                        }),
                        skuCodeHeading: [entryData ? entryData?.transactions[0]?.stock?.skuCodeHeading : ''],
                        skuCode: [entryData ? entryData?.transactions[0]?.stock?.sku : ''],
                        uniqueName: [entryData ? entryData?.transactions[0]?.stock?.uniqueName : ''],
                        customField1: this.formBuilder.group({
                            key: [entryData ? entryData?.transactions[0]?.stock?.customField1?.key : ''],
                            value: [entryData ? entryData?.transactions[0]?.stock?.customField1?.value : '']
                        }),
                        customField2: this.formBuilder.group({
                            key: [entryData ? entryData?.transactions[0]?.stock?.customField2?.key : ''],
                            value: [entryData ? entryData?.transactions[0]?.stock?.customField2?.value : '']
                        })
                    })
                })
            ]),
            total: this.formBuilder.group({ //temp
                amountForAccount: [0],
                amountForCompany: [0]
            }),
            purchaseOrderItemMapping: this.formBuilder.group({
                uniqueName: [''],
                entryUniqueName: ['']
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
                                    rateForAccount: item.rate
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
                        this.companyTaxes?.forEach(tax => {
                            if (this.otherTaxTypes.includes(tax.taxType)) {
                                otherTax = tax;
                            } else {
                                if (tax.uniqueName === selectedTax) {
                                    selectedTaxes.push(tax);
                                }
                            }
                        });
                    });

                    selectedTaxes?.forEach(tax => {
                        taxesFormArray.push(this.getTransactionTaxFormGroup(tax));
                    });

                    if (otherTax) {
                        const selectedOtherTax = this.companyTaxes?.filter(tax => tax.uniqueName === otherTax.uniqueName);
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
            if (response?.tax) {
                this.getSelectedOtherTax(response.entryIndex, response.tax, response.calculationMethod);
            } else {
                const entryFormGroup = this.getEntryFormGroup(entryIndex);
                entryFormGroup.get('otherTax').reset();
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
                this.componentStore.getBriefAccounts({ group: BriedAccountsGroup });
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
    private createUpdateAccountCallback(response: any): void {
        this.searchAccount();
        this.invoiceForm.controls["account"].get("uniqueName")?.patchValue(response?.uniqueName);
        this.invoiceForm.controls["account"].get("customerName")?.patchValue(response?.name);
        this.updateAccountDataInForm(response);
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
        if (event?.checked) {
            this.getActiveSameBillingAddress = true;
            let defaultAddress = {
                index: this.invoiceForm.controls['account'].get("billingAddress").get("index")?.value || 0,
                address: this.invoiceForm.controls['account'].get("billingAddress").get("address")?.value,
                pincode: this.invoiceForm.controls['account'].get("billingAddress").get("pincode")?.value,
                gstNumber: this.invoiceForm.controls['account'].get("billingAddress").get("taxNumber")?.value,
                state: { name: this.invoiceForm.controls['account'].get("billingAddress").get("state").get("name")?.value, code: this.invoiceForm.controls['account'].get("billingAddress").get("state").get("code")?.value }
            };
            this.fillBillingShippingAddress(entityType, "shippingAddress", defaultAddress, defaultAddress.index);
        } else {
            this.getActiveSameBillingAddress = false;
        }
    }



    /**
     * Callback for state
     *
     * @param {string} addressType
     * @param {*} event
     * @memberof VoucherCreateComponent
     */
    public selectState(addressType: string, event: any): void {
        this.invoiceForm.controls['account'].get(addressType).get("state").get("name").patchValue(event?.label);
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

                    let entryFields = [];

                    if (response?.status === 'success') {
                        entryFields.push({ key: 'attachedFile', value: response.body?.uniqueName });
                        entryFields.push({ key: 'attachedFileName', value: response.body?.name });
                        this.toasterService.showSnackBar("success", this.localeData?.file_uploaded);
                    } else {
                        entryFields.push({ key: 'attachedFile', value: "" });
                        entryFields.push({ key: 'attachedFileName', value: "" });
                        this.toasterService.showSnackBar("error", response.message);
                    }

                    this.updateEntry(0, entryFields);
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
                this.componentStore.deleteAttachment('');
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

    /* Callback for entry date change
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
        if (this.invoiceType.isSalesInvoice || this.invoiceType.isPurchaseInvoice || this.invoiceType.isCreditNote || this.invoiceType.isDebitNote) {
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
        this.componentStore.getVoucherDetails({ isCopy: true, accountUniqueName: item.account?.uniqueName, payload: { invoiceNo: item.versionNumber, uniqueName: item?.uniqueName, voucherType: this.voucherType } });
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
                duePeriod = this.invoiceSettings.estimateSettings ? this.invoiceSettings.estimateSettings.duePeriod : 0;
            } else if (this.invoiceType.isProformaInvoice) {
                duePeriod = this.invoiceSettings.proformaSettings ? this.invoiceSettings.proformaSettings.duePeriod : 0;
            } else if (this.invoiceType.isPurchaseOrder) {
                duePeriod = this.invoiceSettings.purchaseBillSettings ? this.invoiceSettings.purchaseBillSettings.poDuePeriod : 0;
            } else {
                duePeriod = this.invoiceSettings.invoiceSettings ? this.invoiceSettings.invoiceSettings.duePeriod : 0;
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
     *To check Tax number validation using regex get by API
     *
     * @param {*} value
     * @memberof VoucherCreateComponent
     */
    public checkGstNumValidation(value: any, entity: string, type: string): void {
        if (this.company.taxType === TaxType.GST) {
            let isValid: boolean = false;
            if (value?.trim()) {
                if (this.formFields['taxName']['regex'] !== "" && this.formFields['taxName']['regex']?.length > 0) {
                    for (let key = 0; key < this.formFields['taxName']['regex'].length; key++) {
                        let regex = new RegExp(this.formFields['taxName']['regex'][key]);
                        if (regex.test(value)) {
                            isValid = true;
                            break;
                        }
                    }
                } else {
                    isValid = true;
                }
                if (!isValid) {
                    this.toasterService.showSnackBar('error', 'Invalid ' + this.formFields['taxName']?.label);
                    this.taxNumberValidations[entity][type] = observableOf(true);
                } else {
                    this.taxNumberValidations[entity][type] = null;
                }
            } else {
                this.taxNumberValidations[entity][type] = null;
            }
        }
    }

    /* Updates account and generate voucher
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
        this.saveVoucher();
    }

    /**
     * Validates form
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private isFormValid(invoiceForm: any): boolean {
        if (this.taxNumberValidations.account.billingAddress !== null || this.taxNumberValidations.account.shippingAddress !== null || this.taxNumberValidations.company.billingAddress !== null || this.taxNumberValidations.company.shippingAddress !== null) {
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

        invoiceForm = this.vouchersUtilityService.cleanVoucherObject(invoiceForm);

        if (!this.isFormValid(invoiceForm)) {
            this.startLoader(false);
            return;
        }

        invoiceForm = this.vouchersUtilityService.formatVoucherObject(invoiceForm);

        if (!this.currentVoucherFormDetails?.depositAllowed || (this.invoiceType.isCashInvoice && !this.invoiceType.isPurchaseInvoice && !this.invoiceType.isCreditNote && !this.invoiceType.isDebitNote)) {
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

        if (this.invoiceType.isPurchaseOrder) {
            invoiceForm.type = VoucherTypeEnum.purchase;

            let getRequestObject = {
                companyUniqueName: this.activeCompany?.uniqueName,
                accountUniqueName: invoiceForm.account.uniqueName
            };

            invoiceForm = this.vouchersUtilityService.formatPurchaseOrderRequest(invoiceForm);

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
        } else if (this.invoiceType.isEstimateInvoice || this.invoiceType.isProformaInvoice) {
            invoiceForm.type = VoucherTypeEnum.sales;

            if (invoiceForm.deposit?.amountForAccount) {
                invoiceForm.paymentAction = {
                    action: 'paid',
                    amount: Number(invoiceForm.deposit?.amountForAccount),
                    depositAccountUniqueName: this.invoiceType.isCashInvoice ? invoiceForm.account?.uniqueName : invoiceForm.deposit?.accountUniqueName
                };
            }

            invoiceForm.voucherDetails = { voucherType: this.invoiceType.isEstimateInvoice ? VoucherTypeEnum.generateEstimate : VoucherTypeEnum.generateProforma };
            invoiceForm.accountDetails = { uniqueName: invoiceForm.account?.uniqueName };

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
        } else {
            if (this.invoiceType.isCashInvoice) {
                invoiceForm.type = this.invoiceType.isPurchaseInvoice ? "purchase" : this.invoiceType.isCreditNote ? "credit note" : this.invoiceType.isDebitNote ? "debit note" : "sales";

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

            this.voucherService.generateVoucher(invoiceForm.account.uniqueName, invoiceForm).pipe(takeUntil(this.destroyed$)).subscribe(response => {
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

    /**
     * Resets voucher form
     *
     * @memberof VoucherCreateComponent
     */
    public resetVoucherForm(openAccountDropdown: boolean = true): void {
        const exchangeRate = this.invoiceForm.get('exchangeRate')?.value;
        const entriesFormArray = this.invoiceForm.get('entries') as FormArray;
        entriesFormArray.clear();
        this.invoiceForm.reset();

        this.account = {
            countryName: '',
            countryCode: '',
            baseCurrency: '',
            baseCurrencySymbol: '',
            addresses: null,
            otherApplicableTaxes: null,
            applicableDiscounts: null,
            applicableTaxes: null,
            excludeTax: false
        };

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

        this.invoiceForm.get('type').patchValue(this.voucherType);
        this.invoiceForm.get('exchangeRate').patchValue(exchangeRate);
        this.invoiceForm.get('date')?.patchValue(this.universalDate);
        this.isVoucherDateChanged = false;

        let entryFields = [];
        entryFields.push({ key: 'date', value: this.universalDate });
        this.updateEntry(0, entryFields);
        this.updateDueDate();
        this.pageLeaveUtilityService.removeBrowserConfirmationDialog();
        this.stockVariants = [];
        this.stockUnits = [];

        this.componentStore.resetAll();

        this.searchAccount();

        this.openAccountDropdown = openAccountDropdown;
    }

    /**
     * This will be use for set billing address to shipping address
     *
     * @memberof VoucherCreateComponent
     */
    public setBillingAddressToShippingAddress(): void {
        if (this.getActiveSameBillingAddress) {
            const billingAddress = this.invoiceForm.get('account.billingAddress').value;
            this.invoiceForm.get('account.shippingAddress').patchValue(billingAddress);
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
                this.componentStore.sendProformaEstimateOnEmail({ request: req, voucherType: this.invoiceType });
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
                // If length of voucher adjustment is 0 i.e., user has changed its original adjustments but has not performed update operation
                // and voucher already has original adjustments to it then show the
                // original adjustments in adjustment popup
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

    public closeAdvanceReceiptModal() {
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
        if (this.adjustPaymentData.totalAdjustedAmount) {
            this.isAdjustAmount = true;
        } else {
            this.isAdjustAmount = false;
        }

        this.calculateAdjustedVoucherTotal(advanceReceiptsAdjustEvent.adjustVoucherData.adjustments)
        this.adjustPaymentBalanceDueData = this.getCalculatedBalanceDueAfterAdvanceReceiptsAdjustment();
        this.calculateBalanceDue();
        this.closeAdvanceReceiptModal();
    }

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
            if (this.adjustPaymentData.totalAdjustedAmount > 0) {
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
     * @memberof VoucherComponent
     */
    public getCalculatedBalanceDueAfterAdvanceReceiptsAdjustment(): number {
        return parseFloat(Number(this.voucherTotals.grandTotal + this.voucherTotals.tcsTotal - this.adjustPaymentData.totalAdjustedAmount - this.invoiceForm.get('deposit.amountForAccount')?.value - this.voucherTotals.tdsTotal).toFixed(this.company?.giddhBalanceDecimalPlaces));
    }

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

    public getVoucherListForCreditDebitNote(): void {
        if (this.invoiceForm.controls['account'].get('uniqueName')?.value && (this.invoiceType.isCreditNote || this.invoiceType.isDebitNote)) {
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
     * @memberof VoucherComponent
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
                this.companyTaxes?.forEach(tax => {
                    if (this.otherTaxTypes.includes(tax.taxType)) {
                        otherTax = tax;
                    } else {
                        if (tax.uniqueName === selectedTax?.uniqueName) {
                            selectedTaxes.push(tax);
                        }
                    }
                });
            });

            selectedTaxes?.forEach(tax => {
                taxesFormArray.push(this.getTransactionTaxFormGroup(tax));
            });

            if (otherTax) {
                const selectedOtherTax = this.companyTaxes?.filter(tax => tax.uniqueName === otherTax.uniqueName);
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
                transactionFormGroup.get('stock.uniqueName')?.patchValue(item.stock.uniqueName);
                transactionFormGroup.get('stock.quantity')?.patchValue(item.stock.quantity);
                transactionFormGroup.get('stock.rate.rateForAccount')?.patchValue(item.stock.rate.amountForAccount);
                transactionFormGroup.get('stock.skuCode')?.patchValue(item.stock.sku);
                transactionFormGroup.get('stock.skuCodeHeading')?.patchValue(item.stock.skuCodeHeading);
                transactionFormGroup.get('stock.stockUnit.code')?.patchValue(item.stock.stockUnit?.code);
                transactionFormGroup.get('stock.stockUnit.uniqueName')?.patchValue(item.stock.stockUnit?.uniqueName);
                transactionFormGroup.get('stock.variant.name')?.patchValue(item.stock.variant?.name);
                transactionFormGroup.get('stock.variant.uniqueName')?.patchValue(item.stock.variant?.uniqueName);
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
     * @memberof VoucherComponent
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

    public startLoader(isLoading: boolean): void {
        this.showLoader = isLoading;
    }

    /**
     * This will use for filter purchase orders
     *
     * @param {*} search
     * @memberof VoucherComponent
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

    public handleQuantityBlur(transaction: any): void {
        if (transaction.get("stock.quantity")?.value !== undefined && this.invoiceType.isPurchaseInvoice && transaction.get("stock.maxQuantity")?.value !== undefined) {
            if (transaction.get("stock.quantity")?.value > transaction.get("stock.maxQuantity")?.value) {
                transaction.get("stock.quantity")?.patchValue(transaction.get("stock.maxQuantity")?.value);
                this.toasterService.showSnackBar("error", this.localeData?.quantity_error + " (" + transaction.get("stock.maxQuantity")?.value + ")");
            }
        }
    }

    private checkIfEntriesHasStock(): void {
        this.hasStock = false;
        const entries = this.getEntries();
        entries?.forEach(entry => {
            if (entry.transactions[0]?.stock?.uniqueName) {
                this.hasStock = true;
            }
        });
        this.showWarehouse = this.hasStock;
    }

    public updateExchangeRate(amount: any): void {
        amount = amount?.target?.value;
        amount = (amount) ? String(amount)?.replace(this.company.baseCurrencySymbol, '') : '';
        let total = (amount) ? (parseFloat(this.generalService.removeSpecialCharactersFromAmount(amount)) || 0) : 0;
        this.invoiceForm.get('exchangeRate')?.patchValue(total / this.voucherTotals.grandTotal || 0);
    }

    public updateEntryOtherTax(entryFormGroup: FormGroup, amount: any): void {
        entryFormGroup.get('otherTax.amount').patchValue(amount);
    }

    public closeTaxModal(): void {
        this.store.dispatch(this.companyActions.getTax());
        this.taxAsideMenuRef.close();
    }

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

            entryFormGroup.get('hsnNumber')?.patchValue(response.stock.hsnNumber);
            entryFormGroup.get('sacNumber')?.patchValue(response.stock.sacNumber);
            entryFormGroup.get('showCodeType')?.patchValue(response.stock.hsnNumber ? 'hsn' : 'sac');

            let rate = Number((response.stock.variant?.unitRates[0].rate / this.invoiceForm.get('exchangeRate')?.value).toFixed(this.highPrecisionRate));
            transactionFormGroup.get('stock.rate.rateForAccount')?.patchValue(rate);
            transactionFormGroup.get('stock.skuCode')?.patchValue(response.stock.skuCode);
            transactionFormGroup.get('stock.skuCodeHeading')?.patchValue(response.stock.skuCodeHeading);
            transactionFormGroup.get('stock.stockUnit.code')?.patchValue(response.stock.variant?.unitRates[0]?.stockUnitCode);
            transactionFormGroup.get('stock.stockUnit.uniqueName')?.patchValue(response.stock.variant?.unitRates[0]?.stockUnitUniqueName);

            if (!transactionFormGroup.get('stock.variant.uniqueName')?.value) {
                transactionFormGroup.get('stock.variant.name')?.patchValue(response.stock.variant?.name);
                transactionFormGroup.get('stock.variant.uniqueName')?.patchValue(response.stock.variant?.uniqueName);
            }

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
            this.companyTaxes?.forEach(tax => {
                if (this.otherTaxTypes.includes(tax.taxType)) {
                    otherTax = tax;
                } else {
                    if (tax.uniqueName === selectedTax) {
                        selectedTaxes.push(tax);
                    }
                }
            });
        });

        selectedTaxes?.forEach(tax => {
            taxesFormArray.push(this.getTransactionTaxFormGroup(tax));
        });

        if (otherTax) {
            const selectedOtherTax = this.companyTaxes?.filter(tax => tax.uniqueName === otherTax.uniqueName);
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
     * @memberof VoucherComponent
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
        let uniqueName = this.detectBarcode(event);

        if (event.timeStamp - this.startTime < 2) {
            this.isBarcodeMachineTyping = true;
        } else {
            this.isBarcodeMachineTyping = false;
        }

        if (uniqueName && this.startTime) {
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

        if (!this.isBarcodeMachineTyping) {
            this.barcodeValue = "";
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
     * @memberof VoucherComponent
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
                this.barcodeValue += (this.lastScannedKey === 'Shift') ? key.toUpperCase() : key;
            }
            this.lastScannedKey = key;
            return null;
        }
    }

    /**
     * Get stock details by barcode and create transaction for it
     *
     * @returns {void}
     * @memberof VoucherComponent
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
                let group = response.body?.parentGroups[1];
                let accountUniqueName = response.body?.uniqueName;

                if (!accountUniqueName) {
                    this.toasterService.showSnackBar("warning", group + " " + this.localeData?.account_missing_in_stock);
                    return;
                }

                let isExistingEntry = -1;
                this.invoiceForm.get('entries')['controls']?.forEach((control: any, entryIndex: number) => {
                    if (isExistingEntry === -1 && control.get('transactions.0.stock.variant.uniqueName')?.value === response.body?.stock?.uniqueName) {
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

                    this.prefillParticularDetails(activeEntryIndex, response.body);
                } else {
                    this.activeEntryIndex = isExistingEntry;

                    let entryFormGroup = this.getEntryFormGroup(this.activeEntryIndex);
                    let transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);
                    transactionFormGroup.get('stock.quantity')?.patchValue(transactionFormGroup.get('stock.quantity')?.value + 1);
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
     * @memberof CreatePurchaseOrderComponent
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
        } else {
            entryFormGroup.get('sacNumber')?.patchValue(entryFormGroup.get('hsnNumber')?.value);
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
}