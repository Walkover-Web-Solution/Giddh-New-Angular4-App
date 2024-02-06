import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { VoucherComponentStore } from "../utility/vouchers.store";
import { AppState } from "../../store";
import { Store } from "@ngrx/store";
import { Observable, ReplaySubject, delay, of, take, takeUntil } from "rxjs";
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
import { ProformaFilter, ProformaResponse } from "../../models/api-models/proforma";
import { InvoiceReceiptFilter, ReciptResponse } from "../../models/api-models/recipt";
import { VouchersUtilityService } from "../utility/vouchers.utility.service";
import { FormBuilder, UntypedFormArray, UntypedFormGroup, Validators } from "@angular/forms";
import { GIDDH_DATE_FORMAT } from "../../shared/helpers/defaultDateFormat";
import { BriedAccountsGroup, SearchType, TaxType, VoucherTypeEnum } from "../utility/vouchers.const";
import { SearchService } from "../../services/search.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AddBulkItemsComponent } from "../../theme/add-bulk-items/add-bulk-items.component";
import { OtherTaxComponent } from "../../theme/other-tax/other-tax.component";
import { LastInvoices, OptionInterface, VoucherForm } from "../../models/api-models/Voucher";
import { PrintVoucherComponent } from "../print-voucher/print-voucher.component";
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
import { ENTRY_DESCRIPTION_LENGTH } from "../../app.constant";

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
export class VoucherCreateComponent implements OnInit, OnDestroy {
    /** Instance of RCM checkbox */
    @ViewChild("rcmCheckbox") public rcmCheckbox: ElementRef;
    /** Template Reference for Generic aside menu account */
    @ViewChild("accountAsideMenu") public accountAsideMenu: TemplateRef<any>;
    /** Instance of aside Menu Product Service modal */
    @ViewChild('asideMenuProductService') asideMenuProductService: TemplateRef<any>;
    /** Template Reference for Create Tax aside menu */
    @ViewChild("createTax") public createTax: TemplateRef<any>;
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
    /** Voucher account results Observable */
    public voucherAccountResults$: Observable<OptionInterface[]> = of(null);
    /** Voucher stock results Observable */
    public voucherStockResults$: Observable<OptionInterface[]> = of(null);
    /** Brief accounts Observable */
    public briefAccounts$: Observable<OptionInterface[]> = of(null);
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
        addresses: null
    };
    /** Holds account specific data */
    public account: any = {
        countryName: '',
        countryCode: '',
        baseCurrency: '',
        baseCurrencySymbol: '',
        addresses: null
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
    public lastVouchersList$: Observable<LastInvoices[]> = of(null);
    /** Form Group for invoice form */
    public invoiceForm: UntypedFormGroup;
    /** This will open account dropdown by default */
    public openAccountDropdown: boolean = false;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if warehouse field will be visible */
    public showWarehouse: boolean = false;
    /** Holds account state list */
    public accountStateList$: Observable<OptionInterface[]> = of(null);
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
    /** True if we need to show entry datepicker */
    public openEntryDatepicker: boolean = false;
    /** Entry form group */
    private entryFormGroup: UntypedFormGroup;
    /** Date change type (voucher/entry) */
    private dateChangeType: string = '';
    /** Date Change modal configuration */
    public dateChangeConfiguration: ConfirmationModalConfiguration;

    /** Returns true if account is selected else false */
    public get showPageLeaveConfirmation(): boolean {
        return (!this.isUpdateMode && (this.invoiceForm?.controls['account']?.get('customerName')?.value)) ? true : false;
    }

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
        private commonService: CommonService
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
                this.getCompanyBranches();
                this.getCompanyProfile();
                this.getCreatedTemplates();
                this.getOnboardingFormData();
                this.getDiscountsList();
                this.getCompanyTaxes();
                this.getWarehouses();
                this.getBriefAccounts();
                this.getParentGroupForCreateAccount();
                this.searchStock();
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
                this.accountStateList$ = of(response?.stateList?.map(res => { return { label: res.name, value: res.code } }));
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
            this.invoiceForm.get('exchangeRate')?.patchValue(response);
        });

        /** Stock Variants */
        this.componentStore.stockVariants$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.stockVariants[response.entryIndex] = of(response.results);

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

                transactionFormGroup.get('stock').get('skuCode')?.patchValue(response.body.stock.skuCode);
                transactionFormGroup.get('stock').get('skuCodeHeading')?.patchValue(response.body.stock.skuCodeHeading);
            }
        });
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
                        response?.items.forEach(item => {
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
                this.lastVouchersList$ = of([...lastVouchers]);
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
                this.voucherAccountResults$ = of(voucherAccountResults.concat(...newResults));
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
                this.voucherStockResults$ = of(voucherStockResults.concat(...newResults));
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
                    this.componentStore.getStockVariants({ q: event?.additional?.stock?.uniqueName, index: entryIndex });
                }

                transactionFormGroup.get('account').get('name')?.patchValue(keysToUpdate.accountName);
                transactionFormGroup.get('stock').get('name')?.patchValue(keysToUpdate.stockName);
                transactionFormGroup.get('stock').get('uniqueName')?.patchValue(keysToUpdate.stockUniqueName);
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

                this.componentStore.getParticularDetails({ accountUniqueName: transactionFormGroup.get("account").get('uniqueName')?.value, payload: { variantUniqueName: event?.value, customerUniqueName: this.invoiceForm.controls['account'].get('uniqueName')?.value }, entryIndex: entryIndex });
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

        this.account = {
            countryName: accountData.country?.countryName,
            countryCode: accountData.country?.countryCode,
            baseCurrency: accountData.currency,
            baseCurrencySymbol: accountData.currencySymbol,
            addresses: accountData.addresses
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
                contactNumber: [''],
                mobileNumber: [''],
                email: [''],
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
                amountForCompany: [''],
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
            passportNumber: ['']
        });
    }

    /**
     * Returns address form group
     *
     * @private
     * @return {*}  {UntypedFormGroup}
     * @memberof VoucherCreateComponent
     */
    private getAddressFormGroup(): UntypedFormGroup {
        return this.formBuilder.group({
            index: [''],
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
     * @return {*}  {UntypedFormGroup}
     * @memberof VoucherCreateComponent
     */
    private getEntriesFormGroup(): UntypedFormGroup {
        return this.formBuilder.group({
            date: [this.universalDate || dayjs().format(GIDDH_DATE_FORMAT)],
            description: [''],
            voucherType: [''],
            uniqueName: [''],
            showCodeType: ['sac'],
            hsnNumber: [''],
            sacNumber: [''],
            attachedFile: [''],
            attachedFileName: [''],
            discounts: this.formBuilder.array([
                this.getTransactionDiscountFormGroup()
            ]),
            taxes: this.formBuilder.array([
                this.getTransactionTaxFormGroup()
            ]),
            transactions: this.formBuilder.array([
                this.formBuilder.group({
                    account: this.formBuilder.group({
                        name: [''],
                        uniqueName: ['']
                    }),
                    amount: this.formBuilder.group({
                        amountForAccount: [''],
                        type: ['DEBIT']
                    }),
                    stock: this.formBuilder.group({
                        name: [''],
                        quantity: [1],
                        rate: this.formBuilder.group({
                            rateForAccount: [1]
                        }),
                        stockUnit: this.formBuilder.group({
                            code: [''],
                            uniqueName: ['']
                        }),
                        variant: this.formBuilder.group({
                            name: [''],
                            uniqueName: ['']
                        }),
                        skuCodeHeading: [''],
                        skuCode: [''],
                        uniqueName: ['']
                    })
                })
            ])
        });
    }

    /**
     * Returns address form group
     *
     * @private
     * @return {*}  {UntypedFormGroup}
     * @memberof VoucherCreateComponent
     */
    private getTransactionDiscountFormGroup(): UntypedFormGroup {
        return this.formBuilder.group({
            amount: this.formBuilder.group({
                amountForAccount: [''],
                type: ['DEBIT']
            }),
            calculationMethod: ['FIX_AMOUNT'],
            discountValue: [''],
            name: [''],
            particular: [''],
            uniqueName: ['']
        });
    }


    private getTransactionTaxFormGroup(): UntypedFormGroup {
        return this.formBuilder.group({
            accountName: [''],
            accountUniqueName: [''],
            calculationMethod: [''],
            uniqueName: ['']
        });
    }

    /**
     * Opens bulk entry dialog
     *
     * @memberof VoucherCreateComponent
     */
    public openBulkEntryDialog(): void {
        const dialogRef = this.dialog.open(AddBulkItemsComponent);
        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                console.log("Close with true");
            } else {
                console.log("Close with false");
            }
        });
    }

    /**
     * Opens other tax dialog
     *
     * @memberof VoucherCreateComponent
     */
    public openOtherTaxDialog(): void {
        let dialogRef = this.dialog.open(OtherTaxComponent, {
            position: {
                top: '0',
                right: '0'
            }
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                console.log("Close with true");
            } else {
                console.log("Close with false");
            }
        });
    }

    public openPrintPreviewDialog(): void {
        this.dialog.open(PrintVoucherComponent, {
            width: '60vw',
            height: '80vh'
        });
    }

    /**
     * Finds parent group for new account create modal by voucher type
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private getParentGroupForCreateAccount(): void {
        this.accountParentGroup = this.vouchersUtilityService.getParentGroupForAccountCreate(this.voucherType);
    }

    /**
     * Toggle's account create/update dialog
     *
     * @param {*} [event]
     * @memberof VoucherCreateComponent
     */
    public toggleAccountAsidePane(event?: any): void {
        if (event) {
            event.preventDefault();
        }

        this.accountAsideMenuRef = this.dialog.open(this.accountAsideMenu, {
            position: {
                right: '0',
                top: '0'
            }
        })
        this.accountAsideMenuRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (this.showPageLeaveConfirmation) {
                this.pageLeaveUtilityService.addBrowserConfirmationDialog();
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
        this.toggleAccountAsidePane();
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
            let defaultAddress = {
                index: this.invoiceForm.controls['account'].get("billingAddress").get("index")?.value || 0,
                address: this.invoiceForm.controls['account'].get("billingAddress").get("address")?.value,
                pincode: this.invoiceForm.controls['account'].get("billingAddress").get("pincode")?.value,
                gstNumber: this.invoiceForm.controls['account'].get("billingAddress").get("taxNumber")?.value,
                state: { name: this.invoiceForm.controls['account'].get("billingAddress").get("state").get("name")?.value, code: this.invoiceForm.controls['account'].get("billingAddress").get("state").get("code")?.value }
            };
            this.fillBillingShippingAddress(entityType, "shippingAddress", defaultAddress, defaultAddress.index);
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
     * @return {UntypedFormGroup}  {*}
     * @memberof VoucherCreateComponent
     */
    private getEntryFormGroup(index: number): UntypedFormGroup {
        const entriesArray = this.invoiceForm.get('entries') as UntypedFormArray;
        return entriesArray.at(index) as UntypedFormGroup;
    }

    /**
     * Returns transaction form group
     *
     * @private
     * @param {number} index
     * @return {UntypedFormGroup}  {*}
     * @memberof VoucherCreateComponent
     */
    private getTransactionFormGroup(entryFormGroup: UntypedFormGroup): UntypedFormGroup {
        const transactionsArray = entryFormGroup.get('transactions') as UntypedFormArray;
        return transactionsArray.at(0) as UntypedFormGroup;
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
     * Callback for entry date change
     *
     * @param {UntypedFormGroup} entry
     * @memberof VoucherComponent
     */
    public onBlurEntryDate(entryFormGroup: UntypedFormGroup): void {
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

        this.dialog.closeAll();
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