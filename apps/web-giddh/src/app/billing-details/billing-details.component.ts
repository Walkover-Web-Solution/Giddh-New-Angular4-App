import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { GeneralService } from '../services/general.service';
import { BillingDetails, CompanyCreateRequest, CreateCompanyUsersPlan, StatesRequest, SubscriptionRequest } from '../models/api-models/Company';
import { UserDetails } from '../models/api-models/loginModels';
import { IOption } from '../theme/sales-ng-virtual-select/sh-options.interface';
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
import { EMAIL_VALIDATION_REGEX } from '../app.constant';
import { SalesService } from '../services/sales.service';
import { StateCode } from '../models/api-models/Sales';

@Component({
    selector: 'billing-details',
    templateUrl: 'billing-details.component.html',
    styleUrls: ['billing-details.component.scss']
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

    constructor(private store: Store<AppState>, private generalService: GeneralService, private toasty: ToasterService, private route: Router, private companyService: CompanyService, private generalActions: GeneralActions, private companyActions: CompanyActions, private cdRef: ChangeDetectorRef,
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

        console.log("Plan Amount : ", this.razorpayAmount);

        let activeCompany = null;
        this.store.pipe(select(state => state.session.activeCompany), take(1)).subscribe(activeCompany => activeCompany = activeCompany);

        let options = {
            key: RAZORPAY_KEY,
            image: 'data:image/png;base64,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',
            handler: function (res) {
                that.createPaidPlanCompany(res);
            },
            order_id: this.orderId,
            theme: {
                color: '#F37254'
            },
            amount: this.razorpayAmount,
            currency: this.planCurrency || activeCompany?.baseCurrency,
            name: 'GIDDH',
            description: 'Walkover Technologies Private Limited.'
        };
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
