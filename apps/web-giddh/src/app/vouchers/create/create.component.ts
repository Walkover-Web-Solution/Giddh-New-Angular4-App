import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { VoucherComponentStore } from "../vouchers.store";
import { AppState } from "../../store";
import { Store } from "@ngrx/store";
import { Observable, ReplaySubject, delay, takeUntil } from "rxjs";
import { GeneralService } from "../../services/general.service";
import { VoucherTypeEnum } from "../../models/api-models/Sales";
import { VouchersUtilityService } from "../vouchers.utility.service";
import { OnboardingFormRequest } from "../../models/api-models/Common";
import { CommonActions } from "../../actions/common.actions";
import { CompanyActions } from "../../actions/company.actions";
import { TaxResponse } from "../../models/api-models/Company";
import { WarehouseActions } from "../../settings/warehouse/action/warehouse.action";
import { SettingsUtilityService } from "../../settings/services/settings-utility.service";
import { SettingsBranchActions } from "../../actions/settings/branch/settings.branch.action";
import { OrganizationType } from "../../models/user-login-state";

@Component({
    selector: "create",
    templateUrl: "./create.component.html",
    styleUrls: ["./create.component.scss"],
    providers: [VoucherComponentStore]
})
export class VoucherCreateComponent implements OnInit, OnDestroy {
    /** Holds current voucher type */
    public voucherType: string = "";
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
    /** Holds boolean of TCS/TDS Applicable Observable */
    public isTcsTdsApplicable$: Observable<any> = this.componentStore.isTcsTdsApplicable$;
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
        private settingsBranchAction: SettingsBranchActions
    ) {
        
    }

    public ngOnInit(): void {
        this.getVoucherType();
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
    }

    private getVoucherType(): void {
        this.activatedRoute.params.pipe(delay(0), takeUntil(this.destroyed$)).subscribe(params => {
            if (params) {
                this.voucherType = params.voucherType;
                console.log(params);
            }
        });
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
            if (profile && Object.keys(profile).length) {
                this.company.countryName = profile.country;
                this.company.countryCode = profile.countryCode || profile.countryV2.alpha2CountryCode;
                this.company.baseCurrency = profile.baseCurrency;
                this.company.baseCurrencySymbol = profile.baseCurrencySymbol;
                this.company.inputMaskFormat = profile.balanceDisplayFormat?.toLowerCase() || '';

                this.showTaxTypeByCountry(this.company.countryCode);
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
        
    }

    public selectDropdown(event: any): void {

    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}