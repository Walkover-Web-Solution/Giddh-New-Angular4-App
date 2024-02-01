import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { VoucherComponentStore } from "../utility/vouchers.store";
import { AppState } from "../../store";
import { Store } from "@ngrx/store";
import { Observable, ReplaySubject, delay, of, take, takeUntil } from "rxjs";
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
import { FormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { GIDDH_DATE_FORMAT } from "../../shared/helpers/defaultDateFormat";
import * as dayjs from "dayjs";
import { BriedAccountsGroup, SearchType, VoucherTypeEnum } from "../utility/vouchers.const";
import { SearchService } from "../../services/search.service";
import { MatDialog } from "@angular/material/dialog";
import { AddBulkItemsComponent } from "../../theme/add-bulk-items/add-bulk-items.component";
import { OtherTaxComponent } from "../../theme/other-tax/other-tax.component";
import { LastInvoices, OptionInterface } from "../../models/api-models/Voucher";
import { PrintVoucherComponent } from "../print-voucher/print-voucher.component";

@Component({
    selector: "create",
    templateUrl: "./create.component.html",
    styleUrls: ["./create.component.scss"],
    providers: [VoucherComponentStore]
})
export class VoucherCreateComponent implements OnInit, OnDestroy {
    /**  This will use for dayjs */
    public dayjs = dayjs;
    /** Holds current voucher type */
    public voucherType: string = VoucherTypeEnum.sales.toString();
    /** Holds images folder path */
    public imgPath: string = isElectron ? "assets/images/" : AppUrl + APP_FOLDER + "assets/images/";
    /** Loading Observable */
    public isLoading$: Observable<any> = this.componentStore.isLoading$;
    /** Invoice settings Observable */
    public invoiceSettings$: Observable<any> = this.componentStore.invoiceSettings$;
    /** Discounts list Observable */
    public discountsList$: Observable<any> = this.componentStore.discountsList$;
    /** Company profile Observable */
    public companyProfile$: Observable<any> = this.componentStore.companyProfile$;
    /** Active company Observable */
    public activeCompany$: Observable<any> = this.componentStore.activeCompany$;
    /** Onboarding form Observable */
    public onboardingForm$: Observable<any> = this.componentStore.onboardingForm$;
    /** Company taxes Observable */
    public companyTaxes$: Observable<any> = this.componentStore.companyTaxes$;
    /** Warehouses Observable */
    public warehouseList$: Observable<any> = this.componentStore.warehouseList$;
    /** Branches Observable */
    public branchList$: Observable<any> = this.componentStore.branchList$;
    /** Created templates Observable */
    public createdTemplates$: Observable<any> = this.componentStore.createdTemplates$;
    /** Created templates Observable */
    public lastVouchers$: Observable<any> = this.componentStore.lastVouchers$;
    /** Voucher account results Observable */
    public voucherAccountResults$: Observable<OptionInterface[]> = of(null);
    /** Stock variants Observable */
    public stockVariants$: Observable<any> = this.componentStore.stockVariants$;
    /** Exchange rate Observable */
    public exchangeRate$: Observable<any> = this.componentStore.exchangeRate$;
    /** Brief accounts Observable */
    public briefAccounts$: Observable<any> = this.componentStore.briefAccounts$;
    /** Account details Observable */
    public accountDetails$: Observable<any> = this.componentStore.accountDetails$;
    /** Country data Observable */
    public countryData$: Observable<any> = this.componentStore.countryData$;
    /** Holds boolean of TCS/TDS Applicable Observable */
    public isTcsTdsApplicable$: Observable<any> = this.componentStore.isTcsTdsApplicable$;
    /** Last vouchers get in progress Observable */
    public getLastVouchersInProgress$: Observable<any> = this.componentStore.getLastVouchersInProgress$;
    /** Account search request */
    public accountSearchRequest: any;
    public dummyOptions: any[] = [
        { label: "Option 1", value: 1 },
        { label: "Option 2", value: 2 },
        { label: "Option 3", value: 3 },
        { label: "Option 4", value: 4 }
    ];
    /** Stores the voucher API version of current company */
    public voucherApiVersion: 1 | 2;
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
        branch: null
    };
    /** Holds account specific data */
    public account: any = {
        countryName: '',
        countryCode: '',
        baseCurrency: '',
        baseCurrencySymbol: ''
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
        private dialog: MatDialog
    ) {

    }

    public ngOnInit(): void {
        this.initVoucherForm();

        this.activatedRoute.params.pipe(delay(0), takeUntil(this.destroyed$)).subscribe(params => {
            if (params) {
                this.voucherType = this.vouchersUtilityService.parseVoucherType(params.voucherType);

                /** Open account dropdown on create */
                if (!params?.uniqueName) {
                    this.openAccountDropdown = true;
                } else {
                    this.invoiceForm.get('uniqueName').patchValue(params?.uniqueName);
                }

                this.getVoucherType();
                this.searchAccount();
                this.getVoucherVersion();
                this.getIsTcsTdsApplicable();
                this.getActiveCompany();
                this.getInvoiceSettings();
                this.getDiscountsList();
                this.getCompanyProfile();
                this.getOnboardingFormData();
                this.getCompanyTaxes();
                this.getWarehouses();
                this.getCompanyBranches();
                this.getCreatedTemplates();
                this.getBriefAccounts();
            }
        });

        this.accountDetails$.subscribe(response => {
            if (response) {
                console.log(response);
                this.account = {
                    countryName: response.country?.countryName,
                    countryCode: response.country?.countryCode,
                    baseCurrency: response.currency,
                    baseCurrencySymbol: response.currencySymbol
                }
            }
        });

        this.countryData$.subscribe(response => {
            if (response) {
                this.accountStateList$ = of(response?.stateList?.map(res => { return { label: res.name, value: res.code } }));
            }
        });
    }

    private getVoucherType(): void {
        this.invoiceType = this.vouchersUtilityService.getVoucherType(this.voucherType);
    }

    private getVoucherVersion(): void {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
    }

    private getIsTcsTdsApplicable(): void {
        this.isTcsTdsApplicable$.subscribe(response => {
            this.company.isTcsTdsApplicable = response;
        });
    }

    private getInvoiceSettings(): void {
        this.invoiceSettings$.subscribe(settings => {
            if (!settings) {
                this.componentStore.getInvoiceSettings();
            } else {
                this.invoiceSettings = settings;

                if (this.voucherApiVersion === 2) {
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
                } else {
                    this.applyRoundOff = true;
                }
            }
        });
    }

    private getDiscountsList(): void {
        this.discountsList$.subscribe(discountsList => {
            if (!discountsList) {
                this.componentStore.getDiscountsList();
            } else {
                this.discountsList = discountsList;
            }
        });
    }

    private getCompanyProfile(): void {
        this.companyProfile$.subscribe(profile => {
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

    private getActiveCompany(): void {
        this.activeCompany$.subscribe(activeCompany => {
            this.activeCompany = activeCompany;
        })
    }

    private showTaxTypeByCountry(countryCode: string): void {
        this.company.taxType = this.vouchersUtilityService.showTaxTypeByCountry(countryCode, this.activeCompany?.countryV2?.alpha2CountryCode);
        if (this.company.taxType) {
            this.getOnboardingForm(countryCode);
        }
    }

    private getOnboardingForm(countryCode: string): void {
        if (this.onboardingFormRequest.country !== countryCode) {
            this.onboardingFormRequest.formName = 'onboarding';
            this.onboardingFormRequest.country = countryCode;
            this.store.dispatch(this.commonActions.GetOnboardingForm(this.onboardingFormRequest));
        }
    }

    private getOnboardingFormData(): void {
        this.onboardingForm$.subscribe(response => {
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

    private getCompanyTaxes(): void {
        this.companyTaxes$.subscribe(response => {
            if (!response) {
                this.store.dispatch(this.companyActions.getTax());
            } else {
                this.companyTaxes = response;
            }
        });
    }

    private getWarehouses(): void {
        this.warehouseList$.subscribe(response => {
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

    private getCompanyBranches(): void {
        this.branchList$.subscribe(response => {
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

    public getPreviousVouchers(): void {
        this.lastVouchers$.subscribe(response => {
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
                        if (response && response.items) {
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
                } else if (!this.invoiceType.isPurchaseInvoice) {
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

    private getCreatedTemplates(): void {
        this.createdTemplates$.subscribe(response => {
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

    public searchAccount(query: string = '', page: number = 1): void {
        if (this.voucherType === VoucherTypeEnum.cash) {
            return;
        }

        if (this.accountSearchRequest?.isLoading) {
            return;
        }

        this.accountSearchRequest = this.vouchersUtilityService.getSearchRequestObject(this.voucherType, query, page, SearchType.CUSTOMER);
        this.accountSearchRequest.isLoading = true;

        this.searchService.searchAccountV3(this.accountSearchRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
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

    public searchStock(query: string = '', page: number = 1): void {
        if (this.voucherType === VoucherTypeEnum.cash) {
            return;
        }
        const requestObject = this.vouchersUtilityService.getSearchRequestObject(this.voucherType, query, page, SearchType.ITEM);

        this.searchService.searchAccountV3(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                console.log(response);
            }
        });
    }

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

        this.exchangeRate$.subscribe(response => {
            console.log(response);
        });
    }

    private getBriefAccounts(): void {
        this.briefAccounts$.subscribe(response => {
            if (!response) {
                let params = { group: (this.voucherApiVersion === 2) ? BriedAccountsGroup.V2 : BriedAccountsGroup.V1 };
                this.componentStore.getBriefAccounts(params);
            }
        });
    }

    private getAccountDetails(accountUniqueName: string): void {
        this.componentStore.getAccountDetails(accountUniqueName);
    }

    private getCountryData(countryCode: string): void {
        this.componentStore.getCountryStates(countryCode);
    }

    public handleSearchAccountScrollEnd(): void {
        if (this.accountSearchRequest.loadMore) {
            let page = this.accountSearchRequest.page;
            page = page + 1;
            this.searchAccount(this.accountSearchRequest.query, page);
        }
    }

    public selectAccount(event: any, isClear: boolean = false): void {
        if (isClear) {
            this.invoiceForm.reset();
        } else {
            this.invoiceForm.controls["account"].get("customerName")?.patchValue(event?.label);
            this.getAccountDetails(event?.value);
        }
    }

    public translationComplete(event: any): void {
        if (event) {
            
        }
    }

    private initVoucherForm(): void {
        this.invoiceForm = this.formBuilder.group({
            account: this.getAccountFormGroup(),
            uniqueName: ['']
        });
    }

    private getAccountFormGroup(): UntypedFormGroup {
        return this.formBuilder.group({
            customerName: [''],
            uniqueName: ['', Validators.required],
            attentionTo: [''],
            contactNumber: [''],
            mobileNumber: [''],
            email: [''],
            billingAddress: this.getAddressFormGroup(),
            shippingAddress: this.getAddressFormGroup()
        });
    }

    private getAddressFormGroup(): UntypedFormGroup {
        return this.formBuilder.group({
            address: [''],
            pincode: [''],
            taxNumber: [''],
            state: this.getStateFormGroup()
        });
    }

    private getStateFormGroup(): UntypedFormGroup {
        return this.formBuilder.group({
            code: [''],
        });
    }

    public openBulkEntryDialog(input: string = ''): void {
        let dialogRef
        if(input === 'othertax'){
            dialogRef = this.dialog.open(OtherTaxComponent, {
                position: {
                    top: '0',
                    right: '0'
                }
            });
        } else {
            dialogRef = this.dialog.open(AddBulkItemsComponent);
        }

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

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}