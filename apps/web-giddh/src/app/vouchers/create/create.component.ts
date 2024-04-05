import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
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
import { PreviousInvoicesVm, ProformaFilter, ProformaResponse } from "../../models/api-models/proforma";
import { InvoiceReceiptFilter, ReciptResponse } from "../../models/api-models/recipt";
import { VouchersUtilityService } from "../utility/vouchers.utility.service";
import { FormBuilder, FormArray, FormGroup, Validators } from "@angular/forms";
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
import { cloneDeep } from "../../lodash-optimized";
import { ENTRY_DESCRIPTION_LENGTH, HIGH_RATE_FIELD_PRECISION, RATE_FIELD_PRECISION, SubVoucher } from "../../app.constant";
import { IntlPhoneLib } from "../../theme/mobile-number-field/intl-phone-lib.class";
import { SalesOtherTaxesCalculationMethodEnum } from "../../models/api-models/Sales";
import { giddhRoundOff } from "../../shared/helpers/helperFunctions";
import { VoucherService } from "../../services/voucher.service";
import { ConfirmModalComponent } from "../../theme/new-confirm-modal/confirm-modal.component";
import { AddBulkItemsComponent } from "../../theme/add-bulk-items/add-bulk-items.component";

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
    /* Selector for send email  modal */
    @ViewChild('sendEmailModal', { static: true }) public sendEmailModal: any;
    /* Selector for print  modal */
    @ViewChild('printVoucherModal', { static: true }) public printVoucherModal: any;
    /** Date change confirmation modal */
    @ViewChild('dateChangeConfirmationModel', { static: true }) public dateChangeConfirmationModel: any;
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
    /** Other tax dialog ref  */
    public otherTaxAsideMenuRef: MatDialogRef<any>;
    /** Bulk stock dialog ref  */
    public bulkStockAsideMenuRef: MatDialogRef<any>;
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
    /** Entry form group */
    private entryFormGroup: FormGroup;
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
        roundOff: 0
    };
    /** Holds account types */
    public accountType: any = AccountType;
    /** Holds list of other tax types */
    public otherTaxTypes: any[] = OtherTaxTypes;

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
    public get showHideTaxColumn(): boolean {
        let accountPartyType = '';
        this.account?.addresses?.forEach(address => {
            if (address.isDefault) {
                accountPartyType = address.partyType.toLowerCase();
            }
        });
        if ((this.invoiceType?.isSalesInvoice || this.invoiceType?.isCreditNote) && !this.activeCompany?.withPay && (this.activeCompany?.country !== this.account?.countryCode || accountPartyType === 'sez' || accountPartyType === 'deemed export')) {
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
    public getActiveSameBillingAddress: boolean = false;

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
        private voucherService: VoucherService
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
                    this.activeEntryIndex = 0;
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
                    if (!this.isUpdateMode) {
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

                if (response?.results?.length === 1) {
                    this.selectVariant(response.results[0], response.entryIndex);
                }
            }
        });

        /** Particular details */
        this.componentStore.particularDetails$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.body) {
                const entryFormGroup = this.getEntryFormGroup(response.entryIndex);
                const transactionFormGroup = this.getTransactionFormGroup(entryFormGroup);

                if (response.body.stock) {
                    transactionFormGroup.get('stock').get('skuCode')?.patchValue(response.body.stock.skuCode);
                    transactionFormGroup.get('stock').get('skuCodeHeading')?.patchValue(response.body.stock.skuCodeHeading);

                    this.stockUnits[response.entryIndex] = observableOf(response.body.stock.variant.unitRates);
                } else {
                    this.stockUnits[response.entryIndex] = observableOf([]);
                }

                const taxes = this.generalService.fetchTaxesOnPriority(
                    response.body.stock?.taxes ?? [],
                    response.body.stock?.groupTaxes ?? [],
                    response.body.taxes ?? [],
                    response.body.groupTaxes ?? []);

                const taxesFormArray = entryFormGroup.get('taxes') as FormArray;
                taxesFormArray.clear();

                taxes?.forEach(tax => {
                    taxesFormArray.push(this.getTransactionTaxFormGroup(tax));
                });
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
                        this.componentStore.getStockVariants({ q: entry.transactions[0]?.stock?.uniqueName, index: index });
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
            }
        });
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
                } else if (this.voucherType === VoucherTypeEnum.purchase) {
                    this.applyRoundOff = settings.invoiceSettings.purchaseRoundOff;
                } else if (this.voucherType === VoucherTypeEnum.debitNote) {
                    this.applyRoundOff = settings.invoiceSettings.debitNoteRoundOff;
                } else if (this.voucherType === VoucherTypeEnum.creditNote) {
                    this.applyRoundOff = settings.invoiceSettings.creditNoteRoundOff;
                } else if (this.voucherType === VoucherTypeEnum.estimate || this.voucherType === VoucherTypeEnum.generateEstimate || this.voucherType === VoucherTypeEnum.proforma || this.voucherType === VoucherTypeEnum.generateProforma) {
                    this.applyRoundOff = true;
                }
                this.updateDueDate();
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
                Object.keys(response.fields).forEach(key => {
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
                this.companyTaxes = response;
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
                let warehouseResults = response.results?.filter(wh => !wh.isArchived);
                const warehouseData = this.settingsUtilityService.getFormattedWarehouseData(warehouseResults);
                this.warehouses = warehouseData.formattedWarehouses;
                this.showWarehouse = true;
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
        });
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

        if (this.invoiceType.isPurchaseInvoice) {
            let request = { companyUniqueName: this.activeCompany?.uniqueName, accountUniqueName: accountUniqueName, page: 1, count: 100, sort: '', sortBy: '' };
            let payload = { statuses: [PURCHASE_ORDER_STATUS.open, PURCHASE_ORDER_STATUS.partiallyConverted] };
            this.componentStore.getVendorPurchaseOrders({ request: request, payload: payload, commonLocaleData: this.commonLocaleData });
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
            this.invoiceForm.reset();
        } else {
            this.invoiceForm.controls["account"].get("customerName")?.patchValue(event?.label);
            this.getAccountDetails(event?.value);
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

            if (isClear) {

            } else {
                let keysToUpdate = {
                    accountName: event?.label,
                    stockName: "",
                    stockUniqueName: ""
                };

                if (event?.additional?.stock?.uniqueName) {
                    keysToUpdate.stockName = event?.additional?.stock?.name;
                    keysToUpdate.stockUniqueName = event?.additional?.stock?.uniqueName;
                }

                transactionFormGroup.get('account').get('name')?.patchValue(keysToUpdate.accountName);
                transactionFormGroup.get('stock').get('name')?.patchValue(keysToUpdate.stockName);
                transactionFormGroup.get('stock').get('uniqueName')?.patchValue(keysToUpdate.stockUniqueName);

                if (event?.additional?.hasVariants) {
                    this.componentStore.getStockVariants({ q: event?.additional?.stock?.uniqueName, index: entryIndex });
                } else {
                    let payload = {};

                    if (keysToUpdate.stockUniqueName) {
                        payload = { stockUniqueName: keysToUpdate.stockUniqueName, customerUniqueName: this.invoiceForm.get('account.uniqueName')?.value };
                    }

                    this.componentStore.getParticularDetails({ accountUniqueName: transactionFormGroup.get("account.uniqueName")?.value, payload: payload, entryIndex: entryIndex });
                }
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

        this.isMultiCurrencyVoucher = this.account.baseCurrency !== this.company.baseCurrency;
        if (this.isMultiCurrencyVoucher) {
            this.getExchangeRate(this.account.baseCurrency, this.company.baseCurrency, this.invoiceForm.get('date')?.value);
        }

        this.invoiceForm.controls["account"].get("attentionTo").setValue(accountData?.attentionTo);
        this.invoiceForm.controls["account"].get("email").setValue(accountData?.email);
        this.invoiceForm.controls["account"].get("mobileNumber").setValue(accountData?.mobileNo);
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
            generateEInvoice: [null]
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
            date: [this.invoiceForm?.get('date')?.value || this.universalDate || dayjs().format(GIDDH_DATE_FORMAT)],
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
            otherTax: this.formBuilder.group({ //temp
                name: [''],
                amount: [''],
                type: [''],
                calculationMethod: [''],
                isChecked: [false]
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
                        rate: this.formBuilder.group({
                            rateForAccount: [entryData ? entryData?.transactions[0]?.stock?.rate?.rateForAccount : 1]
                        }),
                        stockUnit: this.formBuilder.group({
                            code: [entryData ? entryData?.transactions[0]?.stock?.stockUnit?.code : ''],
                            uniqueName: [entryData ? entryData?.transactions[0]?.stock?.stockUnit?.uniqueName : '']
                        }),
                        variant: this.formBuilder.group({
                            name: [entryData ? entryData?.transactions[0]?.stock?.variant?.name : ''],
                            uniqueName: [entryData ? entryData?.transactions[0]?.stock?.variant?.uniqueName : '']
                        }),
                        skuCodeHeading: [entryData ? entryData?.transactions[0]?.stock?.skuCodeHeading : ''],
                        skuCode: [entryData ? entryData?.transactions[0]?.stock?.sku : ''],
                        uniqueName: [entryData ? entryData?.transactions[0]?.stock?.uniqueName : '']
                    })
                })
            ]),
            total: this.formBuilder.group({ //temp
                amountForAccount: [0],
                amountForCompany: [0]
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
                console.log(response);

                let index = this.invoiceForm.get('entries')['controls']?.length;

                this.invoiceForm.get('entries')['controls']?.forEach((control: any, entryIndex: number) => {
                    if (!control.get('transactions.0.account.uniqueName')?.value) {
                        this.deleteLineEntry(entryIndex);
                    }
                });

                response?.forEach(item => {
                    if (item.additional?.stock) {
                        this.stockUnits[index] = observableOf(item.additional?.stock?.variant?.unitRates);
                    }

                    let entry = {
                        hsnNumber: item.additional?.stock?.hsnNumber,
                        sacNumber: item.additional?.stock?.sacNumber,
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
                                    uniqueName: item.additional?.stock?.variant?.uniqueName
                                },
                                sku: item.additional?.stock?.skuCode,
                                skuCodeHeading: item.additional?.stock?.skuCodeHeading
                            }
                        }]
                    }

                    this.invoiceForm.get('entries')['controls'].push(this.getEntriesFormGroup(entry));
                    index++;
                });
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
                entryIndex: entryIndex
            },
            position: {
                top: '0',
                right: '0'
            }
        });

        this.otherTaxAsideMenuRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
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

        entryFormGroup.get('otherTax.name').patchValue(tax.name);
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
     * @param {*} [event]
     * @memberof VoucherCreateComponent
     */
    public toggleAccountAsidePane(accountType: AccountType, event?: any): void {
        if (event) {
            event.preventDefault();
        }

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

        this.accountAsideMenuRef.afterClosed().pipe(take(1)).subscribe((response) => {
            if (this.showPageLeaveConfirmation) {
                this.pageLeaveUtilityService.addBrowserConfirmationDialog();
            }

            if (this.accountParentGroup === "bankaccounts") {
                this.getBriefAccounts();
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
    }

    /**
     * Shows create new tax dialog
     *
     * @memberof VoucherCreateComponent
     */
    public showCreateTaxDialog(): void {
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
        let discountDialogRef = this.dialog.open(CreateDiscountComponent, {
            position: {
                right: '0',
                top: '0'
            }
        });

        discountDialogRef.afterClosed().pipe(take(1)).subscribe(response => {
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
        this.saveVoucher(() => {
            let dialogRef = this.dialog.open(this.sendEmailModal, {
                width: '650px'
            });

            dialogRef.afterClosed().pipe(takeUntil(this.destroyed$)).subscribe(response => {

            });
        });
    }

    /**
     * This will be use for create and print voucher
     *
     * @memberof VoucherCreateComponent
     */
    public createPrintVoucher(): void {
        this.saveVoucher(() => {
            let dialogRef = this.dialog.open(this.printVoucherModal, {
                width: '60vw',
                height: '80vh'
            });

            dialogRef.afterClosed().pipe(takeUntil(this.destroyed$)).subscribe(response => {

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
    public onBlurEntryDate(entryFormGroup: FormGroup): void {
        if (typeof (entryFormGroup.get('date')?.value) === "object") {
            entryFormGroup.get('date')?.patchValue(dayjs(entryFormGroup.get('date')?.value).format(GIDDH_DATE_FORMAT));
        }

        if (this.invoiceForm.get("entries")?.value.length > 1) {
            this.dateChangeType = "entry";
            this.entryFormGroup = entryFormGroup;
            this.dateChangeConfiguration = this.generalService.getDateChangeConfiguration(this.localeData, this.commonLocaleData, false);
            this.dialog.open(this.dateChangeConfirmationModel, {
                width: '650px',
            });
        }
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
                this.invoiceForm?.get('entries')['controls'].forEach(entry => {
                    entry.get('date')?.patchValue(dayjs(this.invoiceForm.get('date')?.value).format(GIDDH_DATE_FORMAT));
                });
            } else if (this.dateChangeType === "entry") {
                if (typeof (this.entryFormGroup.get('date')?.value === "object")) {
                    this.entryFormGroup.get('date')?.patchValue(dayjs(this.entryFormGroup.get('date')?.value).format(GIDDH_DATE_FORMAT));
                } else {
                    this.entryFormGroup.get('date')?.patchValue(dayjs(this.entryFormGroup.get('date')?.value, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT));
                }
            }
        }
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
    public addNewLineEntry(): void {
        this.invoiceForm.get('entries')['controls'].push(this.getEntriesFormGroup());
        const entries = this.invoiceForm.get('entries') as FormArray;
        this.activeEntryIndex = entries?.length - 1;
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
    }

    /**
     * Handles outside click from entry table
     *
     * @param {*} event
     * @memberof VoucherCreateComponent
     */
    public handleOutsideClick(event: any): void {
        if ((typeof event?.target?.className === "string" && event?.target?.className?.indexOf("option") === -1 && event?.target?.className?.indexOf("cdk-overlay-backdrop") === -1) && event?.currentTarget?.activeElement?.className?.indexOf("select-field-input") === -1 && !this.dialog.getDialogById(this.otherTaxAsideMenuRef?.id) && !this.dialog.getDialogById(this.bulkStockAsideMenuRef?.id) && !this.dialog.getDialogById(this.accountAsideMenuRef?.id) && !this.dialog.getDialogById(this.taxAsideMenuRef?.id) && !this.dialog.getDialogById(this.productServiceAsideMenuRef?.id)) {
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
        this.voucherTotals = this.vouchersUtilityService.getVoucherTotals(this.invoiceForm.get('entries')?.value, this.company.giddhBalanceDecimalPlaces, this.applyRoundOff);
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
        if (this.invoiceForm.invalid || this.taxNumberValidations.account.billingAddress !== null || this.taxNumberValidations.account.shippingAddress !== null || this.taxNumberValidations.company.billingAddress !== null || this.taxNumberValidations.company.shippingAddress !== null) {
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

            if (!hasTaxes) {
                return false;
            }
        }

        return true;
    }

    /**
     * Saves voucher
     *
     * @param {Function} [callback]
     * @memberof VoucherCreateComponent
     */
    public saveVoucher(callback?: Function): void {
        let invoiceForm = this.vouchersUtilityService.cleanVoucherObject(this.invoiceForm.value);

        if (!this.isFormValid(invoiceForm)) {
            return;
        }

        invoiceForm = this.vouchersUtilityService.formatVoucherObject(invoiceForm);

        this.voucherService.generateVoucher(invoiceForm.account.uniqueName, invoiceForm).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                let message = (invoiceForm.number) ? `${this.localeData?.entry_created}: ${invoiceForm.number}` : this.commonLocaleData?.app_messages?.voucher_saved;
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

    /**
     * This will be use for set billing address to shipping address
     *
     * @memberof VoucherCreateComponent
     */
    public setBillingAddressToShippingAddress() {
        if (this.getActiveSameBillingAddress) {
            const billingAddress = this.invoiceForm.get('account.billingAddress').value;
            this.invoiceForm.get('account.shippingAddress').patchValue(billingAddress);
        }
    }

    /**
     * This will be use for send email after create voucher 
     *
     * @param {(string | { email: string, invoiceType: string[] })} request
     * @memberof VoucherCreateComponent
     */
    public sendEmail(request: string | { email: string, invoiceType: string[] }) {
        console.log(request);
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
}