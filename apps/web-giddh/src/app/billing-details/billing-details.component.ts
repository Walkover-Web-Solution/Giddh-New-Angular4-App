import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { GeneralService } from '../services/general.service';
import { BillingDetails, CompanyCreateRequest, CreateCompanyUsersPlan, StatesRequest, SubscriptionRequest } from '../models/api-models/Company';
import { UserDetails } from '../models/api-models/loginModels';
import { select, Store } from '@ngrx/store';
import { AppState } from '../store';
import { ToasterService } from '../services/toaster.service';
import { take, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UntypedFormControl, NgForm } from '@angular/forms';
import { CompanyService } from '../services/company.service';
import { GeneralActions } from '../actions/general/general.actions';
import { CompanyActions } from '../actions/company.actions';
import { SettingsProfileActions } from '../actions/settings/profile/settings.profile.action';
import { OnboardingFormRequest } from "../models/api-models/Common";
import { CommonActions } from '../actions/common.actions';
import { SettingsProfileService } from '../services/settings.profile.service';
import { EMAIL_VALIDATION_REGEX, GIDDH_PRIMARY_LOGO_BASE64, IOption } from '../app.constant';
import { SalesService } from '../services/sales.service';
import { StateCode } from '../models/api-models/Sales';
import { ServiceConfig } from '../services/service.config';

@Component({
selector: 'billing-details',
    templateUrl: 'billing-details.component.html',
    styleUrls: ['billing-details.component.scss'],
    standalone: false
})
export class BillingDetailComponent implements OnInit, OnDestroy {
    /** Form instance */
    @ViewChild('billingForm', { static: false }) billingForm: NgForm;
    public userDetails: UserDetails;
    public billingDetailsObj: BillingDetails = {
        name: '',
        email: '',
        contactNo: '',
        gstin: '',
        stateCode: '',
        address: '',
        autorenew: true,
        county: {
            name: '',
            code: ''
        }
    };
    public createNewCompany: CompanyCreateRequest;
    public statesSource$: Observable<IOption[]> = observableOf([]);
    public selectedPlans: CreateCompanyUsersPlan;
    public states: IOption[] = [];
    public selectedState: any = '';
    public subscriptionPrice: any = '';
    public razorpayAmount: any;
    public orderId: string;
    public fromSubscription: boolean = false;
    public razorpay: any;
    public isUpdateCompanySuccess$: Observable<boolean>;
    public SubscriptionRequestObj: SubscriptionRequest = {
        planUniqueName: '',
        subscriptionId: '',
        userUniqueName: '',
        licenceKey: ''
    };
    public planAmount: any = '';
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public formFields: any[] = [];
    public stateGstCode: any[] = [];
    public isMobileNumberValid: boolean = true;
    private activeCompany;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** control for the MatSelect filter keyword */
    public searchBillingStates: string = "";
    /** control for the MatSelect filter keyword */
    public searchCountry: UntypedFormControl = new UntypedFormControl();
    /** True if api call in progress */
    public showLoader: boolean = true;
    /** True if we need to show GSTIN number */
    public showGstinNo: boolean;
    /** True if we need to show Tax number */
    public showTrnNo: boolean;
    /** This will hold onboarding api form request */
    public onboardingFormRequest: OnboardingFormRequest = { formName: '', country: '' };
    /** This will hold states list with respect to country */
    public countryStates: any[] = [];
    public statesSource: IOption[] = [];
    /** This will hold company's country states */
    public companyStatesSource: IOption[] = [];
    /** This will hold company's country states */
    public countyList: IOption[] = [];
    /** This will use for tax percentage */
    public taxPercentage: number = 0.18;
    /** Holds if state field is disabled for selection */
    public isStateDisabled: boolean = false;
    /** Hold search region states */
    public searchRegionStates: string = "";
    /** Hold plan currency */
    public planCurrency: string = '';

    constructor(@Inject(ServiceConfig) private serviceConfig, private store: Store<AppState>, private generalService: GeneralService, private toasty: ToasterService, private route: Router, private companyService: CompanyService, private generalActions: GeneralActions, private companyActions: CompanyActions, private cdRef: ChangeDetectorRef,
        private settingsProfileActions: SettingsProfileActions, private commonActions: CommonActions, private settingsProfileService: SettingsProfileService, private salesService: SalesService,) {
        this.fromSubscription = this.route.routerState.snapshot.url.includes('buy-plan');
        this.isUpdateCompanySuccess$ = this.store.pipe(select(s => s.settings.updateProfileSuccess), takeUntil(this.destroyed$));
    }

    public ngOnInit(): void {
        this.store.dispatch(this.settingsProfileActions.resetPatchProfile());

        /** This will use for get active company data */
        this.settingsProfileService.GetProfileInfo().pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
            if (response?.status === "success") {
                this.getUpdatedStateCodes(response?.body?.countryV2?.alpha3CountryCode, true);
                this.activeCompany = response?.body;
                this.showGstAndTaxUsingCountryName(response?.body?.countryV2?.countryName);
                this.reFillForm();
                this.getStates();
                this.getOnboardingForm();
            }
        });

        this.userDetails = this.generalService.user;

        this.store.pipe(select(s => s.session.userSelectedSubscriptionPlan), takeUntil(this.destroyed$)).subscribe(res => {
            this.selectedPlans = res;
            if (this.selectedPlans) {
                this.subscriptionPrice = this.selectedPlans.planDetails.amount;
            }
        });

        this.isUpdateCompanySuccess$.pipe(takeUntil(this.destroyed$)).subscribe(success => {
            if (success) {
                this.route.navigate(['pages', 'user-details', 'subscription']);
            }
        });

        if (this.fromSubscription && this.selectedPlans) {
            this.prepareSelectedPlanFromSubscriptions(this.selectedPlans);
        } else {
            this.route.navigate(['pages', 'user-details', 'subscription'], { queryParams: { showPlans: true } });
        }

        this.cdRef.detectChanges();
    }

    public getPayAmountForRazorPay(amt: any): number {
        return amt * 100;
    }

    public checkGstNumValidation(ele: HTMLInputElement): void {
        let isValid: boolean = false;
        if (ele?.value) {
            if (this.formFields['taxName']['regex'] !== "" && this.formFields['taxName']['regex']?.length > 0) {
                for (let key = 0; key < this.formFields['taxName']['regex']?.length; key++) {
                    let regex = new RegExp(this.formFields['taxName']['regex'][key]);
                    if (regex.test(ele.value)) {
                        isValid = true;
                    }
                }
            } else {
                isValid = true;
            }

            if (!isValid) {
                let text = this.commonLocaleData?.app_invalid_tax_name;
                text = text?.replace("[TAX_NAME]", this.formFields['taxName'].label);
                this.toasty.errorToast(text);
                ele.classList.add('error-box');
            } else {
                ele.classList.remove('error-box');
            }
        } else {
            ele.classList.remove('error-box');
            this.isStateDisabled = false;
        }
    }

    public getStateCode(gstNo: HTMLInputElement): void {
        if (this.createNewCompany.country === "IN") {
            let gstVal: string = gstNo?.value;
            this.billingDetailsObj.gstin = gstVal;

            if (gstVal?.length >= 2) {
                this.statesSource$.pipe(take(1)).subscribe(state => {
                    let stateCode = this.stateGstCode[gstVal.substr(0, 2)];
                    let s = state.find(st => st?.value === stateCode);
                    this.isStateDisabled = false;

                    if (s) {
                        this.billingDetailsObj.stateCode = s.value;
                        this.searchBillingStates = s.label;
                        this.isStateDisabled = true;
                    } else {
                        this.isStateDisabled = false;
                        this.toasty.clearAllToaster();
                        if (this.formFields['taxName'] && !this.billingForm.form.get('gstin')?.valid) {
                            this.billingDetailsObj.stateCode = '';
                            let text = this.commonLocaleData?.app_invalid_tax_name;
                            text = text?.replace("[TAX_NAME]", this.formFields['taxName'].label);
                            this.toasty.warningToast(text);
                        }
                    }
                });
            } else {
                this.isStateDisabled = false;
                this.billingDetailsObj.stateCode = '';
            }
            this.cdRef.detectChanges();
        }
    }

    public validateEmail(emailStr: any): boolean {
        return EMAIL_VALIDATION_REGEX.test(emailStr);
    }

    public autoRenewSelected(event: any): void {
        if (event) {
            this.billingDetailsObj.autorenew = event.target?.checked;
        }
    }

    /**
     * API call to get razorpay data
     *
     * @param {CreateCompanyUsersPlan} plan
     * @memberof BillingDetailComponent
     */
    public prepareSelectedPlanFromSubscriptions(plan: CreateCompanyUsersPlan): void {
        this.subscriptionPrice = plan.planDetails.amount;
        this.SubscriptionRequestObj.userUniqueName = this.userDetails?.uniqueName;
        this.SubscriptionRequestObj.planUniqueName = plan.planDetails?.uniqueName;
        this.planCurrency = plan.planDetails?.currency?.code;
        if (this.subscriptionPrice && this.planCurrency) {
            this.companyService.getRazorPayOrderId(this.subscriptionPrice, this.planCurrency).pipe(takeUntil(this.destroyed$)).subscribe((res: any) => {
                if (res?.status === 'success') {
                    this.planAmount = res.body?.amount;
                    this.orderId = res.body?.id;
                    this.store.dispatch(this.companyActions.selectedPlan(plan));
                    this.razorpayAmount = this.getPayAmountForRazorPay(this.planAmount);
                } else if (res?.message) {
                    this.toasty.errorToast(res.message);
                }
            });
        }
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public backToSubscriptions(): void {
        this.route.navigate(['/pages', 'user-details', 'subscription'], {
            queryParams: {
                showPlans: true
            }
        });
    }

    public payWithRazor(billingDetail: NgForm): void {
        if (!(this.validateEmail(billingDetail?.value.email))) {
            this.toasty.warningToast(this.localeData?.invalid_email_error, this.commonLocaleData?.app_warning);
            return;
        }
        if (billingDetail.valid && this.createNewCompany) {
            this.createNewCompany.userBillingDetails = billingDetail?.value;

            if (this.billingDetailsObj) {
                if (this.billingDetailsObj.stateCode) {
                    this.createNewCompany.userBillingDetails.stateCode = this.billingDetailsObj.stateCode;
                } else if (this.billingDetailsObj.county) {
                    this.createNewCompany.userBillingDetails.county = this.billingDetailsObj.county;
                } else {
                    return;
                }
            }
        }
        this.initializePayment();
    }

    /**
     * This function will use for on select state change
     *
     * @param {*} event
     * @memberof BillingDetailComponent
     */
    public onStateChange(event: any): void {
        this.billingDetailsObj.stateCode = event?.value;
        this.cdRef.detectChanges();
    }

    /**
     * This function will use for on select region change
     *
     * @param {*} event
     * @memberof BillingDetailComponent
     */
    public onRegionChange(event: any): void {
        if (event?.value) {
            this.billingDetailsObj.county.name = event?.label;
            this.billingDetailsObj.county.code = event?.value;
        }
        this.cdRef.detectChanges();
    }

    /**
     * This will use for on clear value of region
     *
     * @param {*} event
     * @memberof BillingDetailComponent
     */
    public resetRegion(event: any): void {
        if (!event?.value) {
            this.billingDetailsObj.county.name = '';
            this.billingDetailsObj.county.code = '';
            this.searchRegionStates = '';
        }
        this.cdRef.detectChanges();
    }

    public patchProfile(obj: any): void {
        this.store.dispatch(this.settingsProfileActions.PatchProfile(obj));
    }

    public createPaidPlanCompany(razorPay_response: any): void {
        if (razorPay_response) {
            if (!this.fromSubscription) {
                this.createNewCompany.paymentId = razorPay_response.razorpay_payment_id;
                this.createNewCompany.razorpaySignature = razorPay_response.razorpay_signature;
                this.store.dispatch(this.companyActions.CreateNewCompany(this.createNewCompany));
            } else {
                let reQuestob = {
                    subscriptionRequest: this.SubscriptionRequestObj,
                    paymentId: razorPay_response.razorpay_payment_id,
                    razorpaySignature: razorPay_response.razorpay_signature,
                    amountPaid: this.planAmount,
                    userBillingDetails: this.billingDetailsObj,
                    country: this.createNewCompany ? this.createNewCompany.country : '',
                    callNewPlanApi: true
                };
                this.patchProfile(reQuestob);
            }
        }
        this.cdRef.detectChanges();
    }

    /**
     * This hook will be called when payment is initialized
     *
     * @memberof BillingDetailComponent
     */
    public initializePayment(): void {
        let that = this;

        let activeCompany = null;
        this.store.pipe(select(state => state.session.activeCompany), take(1)).subscribe(activeCompany => activeCompany = activeCompany);

        let options = {
            key: this.serviceConfig.RAZORPAY_KEY,
            handler: function (res) {
                that.createPaidPlanCompany(res);
            },
            order_id: this.orderId,
            theme: {
                color: '#F37254'
            },
            amount: this.razorpayAmount,
            currency: this.planCurrency || activeCompany?.baseCurrency,
            name: this.serviceConfig.BRAND_NAME,
            description: this.serviceConfig.LEGAL_NAME
        };
        if (this.serviceConfig.IS_GIDDH_DOMAIN) {
            options["image"] = GIDDH_PRIMARY_LOGO_BASE64;
        }
        try {
            this.razorpay = new window['Razorpay'](options);
            setTimeout(() => {
                this.razorpay?.open();
            }, 100);
        } catch (exception) { }
    }

    public reFillForm(): void {
        // if createNewCompany is undefined or null
        // it means user came from user derails => subscription => buy new plan
        // then get current company data and assign it to createNewCompany object
        if (!this.createNewCompany) {
            this.createNewCompany = new CompanyCreateRequest();
            this.createNewCompany.name = this.activeCompany.name;
            this.createNewCompany.contactNo = this.activeCompany.contactNo;
            this.createNewCompany.phoneCode = this.activeCompany.countryV2 ? this.activeCompany.countryV2.callingCode : '';
            this.createNewCompany.country = this.activeCompany.countryV2 ? this.activeCompany.countryV2.alpha2CountryCode : '';
            this.createNewCompany.uniqueName = this.activeCompany?.uniqueName;
            this.createNewCompany.address = this.activeCompany.address;
            this.createNewCompany.addresses = this.activeCompany.addresses;
            this.createNewCompany.businessType = this.activeCompany.businessType;
            this.createNewCompany.businessNature = this.activeCompany.businessNature;
            this.createNewCompany.subscriptionRequest = new SubscriptionRequest();
            this.createNewCompany.subscriptionRequest.userUniqueName = this.activeCompany.subscription ? this.activeCompany.subscription.userDetails?.uniqueName : '';

            // assign state code to billing details object
            if (this.activeCompany.state) {
                this.billingDetailsObj.stateCode = this.activeCompany.state;
            } else {
                let selectedState = this.activeCompany.addresses.find((address) => address.isDefault);
                if (selectedState) {
                    this.billingDetailsObj.stateCode = selectedState.stateCode;
                }
            }
        }

        this.billingDetailsObj.name = this.createNewCompany.name;
        this.billingDetailsObj.contactNo = this.createNewCompany.contactNo;
        this.billingDetailsObj.email = this.createNewCompany.subscriptionRequest.userUniqueName;

        if (this.createNewCompany.addresses?.length) {
            this.createNewCompany.addresses?.forEach(address => {
                if (!this.billingDetailsObj.gstin && address.taxNumber) {
                    this.billingDetailsObj.gstin = address.taxNumber;
                    this.isStateDisabled = true;
                }
            });
        }
        this.billingDetailsObj.address = this.createNewCompany.address;
    }

    /**
     *This  will get the states data
     *
     * @memberof BillingDetailComponent
     */
    public getStates(): void {
        this.store.pipe(select(s => s.general.states), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                this.states = [];
                this.countyList = [];
                if (res.stateList) {
                    Object.keys(res.stateList)?.forEach(key => {
                        if (res.stateList[key].stateGstCode !== null) {
                            this.stateGstCode[res.stateList[key].stateGstCode] = [];
                            this.stateGstCode[res.stateList[key].stateGstCode] = res.stateList[key].code;
                        }

                        this.states.push({ label: res.stateList[key].name, value: res.stateList[key].code });
                        if (this.createNewCompany !== undefined && this.createNewCompany.addresses !== undefined && this.createNewCompany.addresses[0] !== undefined) {
                            if (res.stateList[key].code === this.createNewCompany.addresses[0].stateCode) {
                                this.searchBillingStates = res.stateList[key].name;
                                this.selectedState = res.stateList[key].name;
                                this.billingDetailsObj.stateCode = res.stateList[key].code;
                            }
                        }
                    });
                }

                if (res.countyList) {
                    if (this.createNewCompany !== undefined && this.createNewCompany.addresses !== undefined && this.createNewCompany.addresses[0] !== undefined) {
                        this.searchRegionStates = this.createNewCompany.addresses[0].county?.name;
                        this.billingDetailsObj.county.name = this.createNewCompany.addresses[0].county?.name;
                        this.billingDetailsObj.county.code = this.createNewCompany.addresses[0].county?.code;
                    }
                    this.countyList = res.countyList?.map(county => {
                        return { label: county.name, value: county.code };
                    });
                }

                this.statesSource$ = observableOf(this.states);
                this.showLoader = false;
                this.cdRef.detectChanges();
            } else {
                // initialize new StatesRequest();
                let statesRequest = new StatesRequest();

                // check if createNewCompany object is initialized if not then user current company country code
                statesRequest.country = this.createNewCompany ? this.createNewCompany.country : this.activeCompany.countryV2 ? this.activeCompany.countryV2.alpha2CountryCode : '';
                this.store.dispatch(this.generalActions.getAllState(statesRequest));
                this.cdRef.detectChanges();
            }
        });
    }

    public getOnboardingForm(): void {
        this.store.pipe(select(s => s.common.onboardingform), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                if (res.fields) {
                    Object.keys(res.fields).forEach(key => {
                        if (res.fields[key]) {
                            this.formFields[res.fields[key].name] = [];
                            this.formFields[res.fields[key].name] = res.fields[key];
                        }
                    });
                }
            } else {
                let onboardingFormRequest = new OnboardingFormRequest();
                onboardingFormRequest.formName = 'onboarding';
                onboardingFormRequest.country = this.createNewCompany?.country || this.activeCompany?.countryV2?.alpha2CountryCode || '';
                this.store.dispatch(this.commonActions.GetOnboardingForm(onboardingFormRequest));
            }
        });
    }

    /**
     * This will return hi user text
     *
     * @returns {string}
     * @memberof BillingDetailComponent
     */
    public getHelloUserText(): string {
        let text = this.localeData?.hello_user;
        text = text?.replace("[USER]", this.userDetails?.name);
        return text;
    }

    /**
     * This will use for  hide/show GSTIN/Tax Number Label by default based on country
     *
     * @public
     * @param {string} name
     * @memberof BillingDetailComponent
     */
    public showGstAndTaxUsingCountryName(name: string): void {
        if (this.activeCompany?.country === name) {
            if (name === 'India') {
                this.showGstinNo = true;
                this.showTrnNo = false;
            } else {
                this.showGstinNo = false;
                this.showTrnNo = true;
            }
        }
    }

    /**
      * Returns the promise once the state list is successfully
      * fetched to carry outn further operations
      *
      * @public
      * @param {*} countryCode Country code for the user
      * @param {boolean} isCompanyStates
      * @returns Promise to carry out further operations
      * @memberof BillingDetailComponent
      */
    public getUpdatedStateCodes(countryCode: any, isCompanyStates?: boolean): Promise<any> {
        return new Promise((resolve: Function) => {
            if (countryCode) {
                if (this.countryStates[countryCode]) {
                    if (!isCompanyStates) {
                        this.statesSource = this.countryStates[countryCode];
                    } else {
                        this.companyStatesSource = this.countryStates[countryCode];
                    }
                    resolve();
                } else {
                    this.salesService.getStateCode(countryCode).pipe(takeUntil(this.destroyed$)).subscribe(resp => {
                        if (!isCompanyStates) {
                            this.statesSource = this.modifyStateResp((resp.body) ? resp.body?.stateList : [], countryCode);
                        } else {
                            this.companyStatesSource = this.modifyStateResp((resp.body) ? resp.body?.stateList : [], countryCode);
                        }
                        resolve();
                    }, () => {
                        resolve();
                    });
                }
            } else {
                resolve();
            }
        });
    }

    /**
     * This will use for modify state response by country
     *
     * @param {StateCode[]} stateList
     * @param {string} countryCode
     * @return {IOption[]}
     * @memberof BillingDetailComponent
     */
    public modifyStateResp(stateList: StateCode[], countryCode: string): IOption[] {
        let stateListRet: IOption[] = [];
        stateList?.forEach(stateR => {
            stateListRet.push({
                label: stateR.name,
                value: stateR.code ? stateR.code : stateR.stateGstCode,
            });
        });
        this.countryStates[countryCode] = stateListRet;
        return stateListRet;
    }
}
