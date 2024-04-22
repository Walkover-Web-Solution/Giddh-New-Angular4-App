import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivateDialogComponent } from '../activate-dialog/activate-dialog.component';
import { BuyPlanComponentStore } from './utility/buy-plan.store';
import { Observable, ReplaySubject, takeUntil, of as observableOf, distinctUntilChanged, debounceTime } from 'rxjs';
import { ToasterService } from '../../services/toaster.service';
import { IOption } from '../../theme/ng-virtual-select/sh-options.interface';
import { CountryRequest, OnboardingFormRequest } from '../../models/api-models/Common';
import { CommonActions } from '../../actions/common.actions';
import { IntlPhoneLib } from "../../theme/mobile-number-field/intl-phone-lib.class";
import { SubscriptionsService } from '../../services/subscriptions.service';
import { AppState } from '../../store';
import { select, Store } from '@ngrx/store';
import { StatesRequest } from '../../models/api-models/Company';
import { GeneralActions } from '../../actions/general/general.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { userLoginStateEnum } from '../../models/user-login-state';

@Component({
    selector: 'buy-plan',
    templateUrl: './buy-plan.component.html',
    styleUrls: ['./buy-plan.component.scss'],
    providers: [BuyPlanComponentStore]
})

export class BuyPlanComponent implements OnInit, OnDestroy {
    /** Stepper Form instance */
    @ViewChild('stepper') stepperIcon: any;
    /** This will use for table content scroll in mobile */
    @ViewChild('tableContent', { read: ElementRef }) public tableContent: ElementRef<any>;
    /** This will use for hold table data */
    public inputData: any[] = [];
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Form Group for subscription buy plan form */
    public subscriptionForm: FormGroup;
    /** Subject to unsubscribe from listeners */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Hold selected tab */
    public selectedStep: number = 0;
    /** Form Group for subscription first step form form */
    public firstStepForm: FormGroup;
    /** Form Group for subscription second step form */
    public secondStepForm: FormGroup;
    /** Form Group for subscription third step form */
    public thirdStepForm: FormGroup;
    /** True if gstin number valid */
    public isGstinValid: boolean = false;
    /** Hold selected country */
    public selectedCountry: string = '';
    /** Hold selected state */
    public selectedState: string = '';
    /** Hold state gst code list */
    public stateGstCode: any[] = [];
    /** Hold states list */
    public states: any[] = [];
    /** List of counties of country */
    public countyList: IOption[] = [];
    /** Hold selected state */
    public selectedStateCode: string = '';
    /** Hold form fields from forms api */
    public formFields: any[] = [];
    /** Hold active company */
    public activeCompany: any;
    /** This will hold disable State */
    public disabledState: boolean = false;
    /** Holds Store Plan list observable*/
    public planList$ = this.componentStore.select(state => state.planList);
    /** Holds Store Plan list API success state as observable*/
    public planListInProgress$ = this.componentStore.select(state => state.planListInProgress);
    /** Holds Store Create Plan API in progress state as observable*/
    public createSubscriptionInProgress$ = this.componentStore.select(state => state.createSubscriptionInProgress);
    /** Holds Store Create Plan API succes state as observable*/
    public createSubscriptionSuccess$ = this.componentStore.select(state => state.createSubscriptionSuccess);
    /** Holds Store Create Plan API succes state as observable*/
    public createSubscriptionResponse$ = this.componentStore.select(state => state.createSubscriptionResponse);
    /** Holds Store Apply Promocode API in progress state as observable*/
    public applyPromoCodeInProgress$ = this.componentStore.select(state => state.applyPromoCodeInProgress);
    /** Holds Store Apply Promocode  API success state as observable*/
    public applyPromoCodeSuccess$ = this.componentStore.select(state => state.applyPromoCodeSuccess);
    /** Holds Store Apply Promocode API response state as observable*/
    public promoCodeResponse$ = this.componentStore.select(state => state.promoCodeResponse);
    /** Mobile number library instance */
    public intlClass: any;
    /** This will hold onboarding api form request */
    public onboardingFormRequest: OnboardingFormRequest = { formName: '', country: '' };
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
    /** True if form is submitted to show error if available */
    public isFormSubmitted: boolean = false;
    /** Hold selected plan*/
    public selectedPlan: any;
    /** Hold popular plan*/
    public popularPlan: any;
    /** Hold session source observable*/
    public session$: Observable<userLoginStateEnum>;
    /** Hold state source observable*/
    public stateSource$: Observable<IOption[]> = observableOf([]);
    /** Hold country source*/
    public countrySource: IOption[] = [];
    /** Hold country source observable*/
    public countrySource$: Observable<IOption[]> = observableOf([]);
    /** Hold plan data source*/
    public changePlan: any;
    /** Hold plan data source*/
    public promoCodeResponse: any[] = [];
    /** This will use for tax percentage */
    public taxPercentage: number = 0.18;
    /** Hold api response subscription id*/
    public responseSubscriptionId: any;
    /** Hold api response redirect link*/
    public redirectLink: any;
    /** Hold final plan amount */
    public finalPlanAmount: number = 0;
    /** True if new user logged in */
    public isNewUserLoggedIn: boolean = false;
    /** Razorpay instance */
    public razorpay: any;
    /** Holds subscription response */
    private subscriptionResponse: any = {};
    /** Holds Store Apply Promocode API response state as observable*/
    public updateSubscriptionPaymentIsSuccess$ = this.componentStore.select(state => state.updateSubscriptionPaymentIsSuccess);
    /** Holds filtered monthly plans */
    public monthlyPlans: any[] = [];
    /** Holds filtered yearly plans */
    public yearlyPlans: any[] = [];
    /** Hold new user selected country */
    public newUserSelectedCountry: string = '';
    /** Hold subscription id */
    public subscriptionId: string = '';
    /** True if api call in progress */
    public isLoading: boolean = false;

    constructor(
        public dialog: MatDialog,
        private readonly componentStore: BuyPlanComponentStore,
        private toasterService: ToasterService,
        private commonActions: CommonActions,
        private store: Store<AppState>,
        private changeDetection: ChangeDetectorRef,
        private generalActions: GeneralActions,
        private formBuilder: FormBuilder,
        private subscriptionService: SubscriptionsService,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location
    ) {
        this.session$ = this.store.pipe(select(p => p.session.userLoginState), distinctUntilChanged(), takeUntil(this.destroyed$));
        this.store.dispatch(this.generalActions.openSideMenu(false));
    }

    /**
     * Hook cycle for component initialization
     *
     * @memberof BuyPlanComponent
     */
    public ngOnInit(): void {
        document.body?.classList?.add("plan-page");

        this.initSubscriptionForm();
        this.getAllPlans();
        this.getCountry();
        this.getStates();
        this.getCompanyProfile();
        this.getOnboardingFormData();
        this.getActiveCompany();

        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe((params: any) => {
            if (params) {
                this.changePlan = params.change;
            }
        });

        this.createSubscriptionResponse$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.responseSubscriptionId = response.subscriptionId;
                if (response.duration === "YEARLY") {
                    this.isLoading = true;
                    this.subscriptionResponse = response;
                    this.initializePayment(response);
                } else {
                    this.openCashfreeDialog(response?.redirectLink);
                }
            }
        });

        this.updateSubscriptionPaymentIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isLoading = false;
                this.router.navigate(['/pages/new-company/' + this.subscriptionId]);
            }
        });

        this.session$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.isNewUserLoggedIn = response === userLoginStateEnum.newUserLoggedIn;
            if (this.isNewUserLoggedIn) {
                this.newUserSelectCountry({
                    "label": "US - United States of America",
                    "value": "US",
                    "additional": {
                        "value": "US",
                        "label": "US - United States of America"
                    }
                });
            }
        });

        window.addEventListener('message', event => {
            if (event?.data && typeof event?.data === "string" && event?.data === "CASHFREE") {
                this.router.navigate(['/pages/new-company/' + this.responseSubscriptionId]);
            }
        });

        this.applyPromoCodeSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.getPromoCodeData();
            }
        });

        this.firstStepForm?.get('promoCode').valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText === "" || searchedText === undefined) {
                this.promoCodeResponse = [];
                this.firstStepForm?.get('promoCode').setValue("");
                this.setFinalAmount();
            }
        });
    }

    /**
     * This will be use for toggle duration event
     *
     * @param {*} event
     * @memberof BuyPlanComponent
     */
    public toggleDuration(event: any): void {
        if (event) {
            this.setFinalAmount();
        }
    }

    /**
     * This will be use for set final amount
     *
     * @memberof BuyPlanComponent
     */
    public setFinalAmount(): void {
        if (this.secondStepForm?.get('country')?.value?.value?.toLowerCase() === 'in' && !this.promoCodeResponse?.length) {
            this.planList$.pipe(takeUntil(this.destroyed$)).subscribe(result => {
                if (result) {
                    this.selectedPlan = result.find(plan => plan?.uniqueName === this.firstStepForm.get('planUniqueName').value);
                    if (this.firstStepForm.get('duration').value === 'YEARLY') {
                        this.finalPlanAmount = this.selectedPlan?.yearlyAmountAfterDiscount;
                    } else {
                        this.finalPlanAmount = this.selectedPlan?.monthlyAmountAfterDiscount;
                    }
                    if (this.secondStepForm?.get('country')?.value?.value?.toLowerCase() === 'in') {
                        this.finalPlanAmount = this.finalPlanAmount + (this.finalPlanAmount * this.taxPercentage);
                    } else {
                        if (this.firstStepForm.get('duration').value === 'YEARLY') {
                            this.finalPlanAmount = this.selectedPlan?.yearlyAmountAfterDiscount;
                        } else {
                            this.finalPlanAmount = this.selectedPlan?.monthlyAmountAfterDiscount;
                        }
                    }
                }
            });
        } else {
            if (this.firstStepForm.get('duration').value === 'YEARLY') {
                this.finalPlanAmount = this.selectedPlan?.yearlyAmountAfterDiscount;
            } else {
                this.finalPlanAmount = this.selectedPlan?.monthlyAmountAfterDiscount;
            }
        }
    }

    /**
    * Hook cycle for after component initialization
    *
    * @memberof BuyPlanComponent
    */
    public ngAfterViewInit(): void {
        this.stepperIcon._getIndicatorType = () => 'number';
    }

    /**
     * This will be use for initializing the subscription form
     *
     * @private
     * @memberof BuyPlanComponent
     */
    private initSubscriptionForm(): void {
        this.firstStepForm = this.formBuilder.group({
            duration: [''],
            planUniqueName: ['', Validators.required],
            promoCode: ['']
        });

        this.secondStepForm = this.formBuilder.group({
            billingName: ['', Validators.required],
            companyName: ['', Validators.required],
            email: ['', [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
            pincode: [''],
            mobileNumber: ['', Validators.required],
            taxNumber: null,
            country: ['', Validators.required],
            state: ['', Validators.required],
            address: ['']
        });

        this.thirdStepForm = this.formBuilder.group({
            userUniqueName: [''],
            paymentProvider: ['']
        });

        this.subscriptionForm = this.formBuilder.group({
            firstStepForm: this.firstStepForm,
            secondStepForm: this.secondStepForm,
            thirdStepForm: this.thirdStepForm
        });
    }

    /**
     * This will be use for get promocode data
     *
     * @memberof BuyPlanComponent
     */
    public getPromoCodeData(): void {
        this.promoCodeResponse$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.promoCodeResponse[0] = response;
                if (this.secondStepForm?.get('country')?.value?.value?.toLowerCase() === 'in' && this.promoCodeResponse?.length) {
                    this.finalPlanAmount = response?.finalAmount + (response?.finalAmount * this.taxPercentage);
                } else {
                    this.finalPlanAmount = response?.finalAmount;
                }
            }
        });
    }

    /**
     * This will be use for back to previous page
     *
     * @memberof BuyPlanComponent
     */
    public back(): void {
        this.location.back();
    }

    /**
     * Gets active company details
     *
     * @private
     * @memberof BuyPlanComponent
     */
    private getActiveCompany(): void {
        this.componentStore.activeCompany$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.activeCompany = response;
                this.company.addresses = response.addresses;
            }
        });
    }

    /**
     * This will be use for apply promo code discount on plans
     *
     * @memberof BuyPlanComponent
     */
    public applyPromoCode(type: string): void {
        let request;
        if (this.firstStepForm.get('promoCode')?.value) {
            if (type === 'add') {
                request = {
                    promoCode: this.firstStepForm.get('promoCode')?.value,
                    planUniqueName: this.firstStepForm.get('planUniqueName')?.value,
                    duration: this.firstStepForm.get('duration')?.value
                }
            } else {
                request = {
                    promoCode: "",
                    planUniqueName: this.firstStepForm.get('planUniqueName')?.value,
                    duration: this.firstStepForm.get('duration')?.value
                }
            }
            this.componentStore.applyPromocode(request);
        }
    }



    /**
    * Gets company profile
    *
    * @private
    * @memberof BuyPlanComponent
    */
    private getCompanyProfile(): void {
        this.componentStore.companyProfile$.pipe(takeUntil(this.destroyed$)).subscribe(profile => {
            if (profile && Object.keys(profile).length) {
                this.company.countryName = profile.country;
                this.company.countryCode = profile.countryCode || profile.countryV2.alpha2CountryCode;
                this.company.baseCurrency = profile.baseCurrency;
                this.company.baseCurrencySymbol = profile.baseCurrencySymbol;
                this.company.inputMaskFormat = profile.balanceDisplayFormat?.toLowerCase() || '';
                this.company.giddhBalanceDecimalPlaces = profile.balanceDecimalPlaces;
                this.showTaxTypeByCountry(this.company.countryCode);
                this.componentStore.getAllPlans({ params: { countryCode: this.company.countryCode } });
            }
        });
    }

    /**
     * Finds tax type by country and calls onboarding form api
     *
     * @private
     * @param {string} countryCode
     * @memberof BuyPlanComponent
     */
    private showTaxTypeByCountry(countryCode: string): void {
        this.company.taxType = this.subscriptionService.showTaxTypeByCountry(countryCode, this.activeCompany?.countryV2?.alpha2CountryCode);
        if (this.company.taxType) {
            this.getOnboardingForm(countryCode);
        }
    }

    /**
    * Calls onboarding form data api
    *
    * @private
    * @param {string} countryCode
    * @memberof BuyPlanComponent
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
     * @memberof BuyPlanComponent
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
     * Initializes the int-tel input
     *
     * @memberof BuyPlanComponent
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
     * @memberof BuyPlanComponent
     */
    public validateMobileField(): void {
        setTimeout(() => {
            if (!this.intlClass?.isRequiredValidNumber) {
                this.secondStepForm.get("mobileNumber")?.setErrors({ invalidNumber: true });
            } else {
                this.secondStepForm.get("mobileNumber")?.setErrors(null);
            }
        }, 100);
    }

    /**
     * This will be use for get countries
     *
     * @memberof BuyPlanComponent
     */
    public getCountry(): void {
        this.componentStore.commonCountries$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.countrySource = [];
                Object.keys(response).forEach(key => {
                    this.countrySource.push({
                        value: response[key].alpha2CountryCode,
                        label: response[key].alpha2CountryCode + ' - ' + response[key].countryName
                    });
                });
                this.countrySource$ = observableOf(this.countrySource);
            } else {
                let countryRequest = new CountryRequest();
                countryRequest.formName = 'onboarding';
                this.store.dispatch(this.commonActions.GetCountry(countryRequest));
            }
        });
    }

    /**
     * This will use for get states list
     *
     * @memberof BuyPlanComponent
     */
    public getStates(): void {
        this.componentStore.generalState$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.states = [];
                this.countyList = [];

                if (response.stateList) {
                    Object.keys(response.stateList).forEach(key => {
                        if (key) {
                            if (response.stateList[key].stateGstCode !== null) {
                                this.stateGstCode[response.stateList[key].stateGstCode] = [];
                                this.stateGstCode[response.stateList[key].stateGstCode] = response.stateList[key].code;
                            }
                            this.states.push({
                                label: response.stateList[key].code + ' - ' + response.stateList[key].name,
                                value: response.stateList[key].code,
                                stateGstCode: response.stateList[key].stateGstCode
                            });
                        }
                    });
                }

                if (response.countyList) {
                    this.countyList = response.countyList?.map(county => {
                        return { label: county.name, value: county.code };
                    });
                }
            }
        });
    }

    /**
     * This will use validate gst number
     *
     * @memberof BuyPlanComponent
     */
    public validateGstNumber(): void {
        let isValid: boolean = false;
        if (this.secondStepForm.get('taxNumber')?.value) {
            if (this.formFields['taxName']?.label) {
                if (this.formFields['taxName']['regex'] !== "" && this.formFields['taxName']['regex']?.length > 0) {
                    for (let key = 0; key < this.formFields['taxName']['regex']?.length; key++) {
                        let regex = new RegExp(this.formFields['taxName']['regex'][key]);
                        if (regex.test(this.secondStepForm.get('taxNumber')?.value)) {
                            isValid = true;
                        }
                    }
                } else {
                    isValid = true;
                }

                if (!isValid) {
                    let text = this.commonLocaleData?.app_invalid_tax_name;
                    text = text?.replace("[TAX_NAME]", this.formFields['taxName'].label);
                    this.toasterService.showSnackBar("error", text);
                    this.selectedState = '';
                    this.selectedStateCode = '';
                    this.isGstinValid = false;
                } else {
                    this.isGstinValid = true;
                }
            }
        }

        if (this.secondStepForm.get('taxNumber')?.value?.length >= 2) {
            this.states?.find((state) => {
                let code = this.secondStepForm.get('taxNumber')?.value?.substr(0, 2);
                let matchCode = state.stateGstCode == code;
                this.disabledState = false;
                if (matchCode) {
                    this.disabledState = true;
                    this.selectedState = state.label;
                    this.selectedStateCode = state.value;
                    this.secondStepForm.controls['state'].setValue({ label: state?.label, value: state?.value });
                    return true;
                }
            });
        } else {
            this.disabledState = false;
            this.isGstinValid = false;
            this.selectedState = '';
            this.selectedStateCode = '';
        }
        this.changeDetection.detectChanges();
    }

    /**
    * This will return enter tax text
    *
    * @returns {string}
    * @memberof BuyPlanComponent
    */
    public getEnterTaxText(): string {
        let text = this.commonLocaleData?.app_enter_tax_name;
        text = text?.replace("[TAX_NAME]", this.formFields['taxName']?.label ?? this.commonLocaleData?.app_tax_number);
        return text;
    }

    /**
     *  This will be use for selecting plan
     *
     * @param {*} plan
     * @memberof BuyPlanComponent
     */
    public selectPlan(plan: any): void {
        this.firstStepForm.get('planUniqueName').setValue(plan?.uniqueName);
        this.planList$.pipe(takeUntil(this.destroyed$)).subscribe(result => {
            if (result) {
                this.selectedPlan = result.find(plan => plan?.uniqueName === this.firstStepForm.get('planUniqueName').value);
                if (this.firstStepForm.get('duration').value === 'YEARLY') {
                    this.finalPlanAmount = this.selectedPlan?.yearlyAmountAfterDiscount;
                } else {
                    this.finalPlanAmount = this.selectedPlan?.monthlyAmountAfterDiscount;
                }
                if (this.secondStepForm?.get('country')?.value?.value?.toLowerCase() === 'in') {
                    this.finalPlanAmount = this.finalPlanAmount + this.finalPlanAmount * this.taxPercentage;
                } else {
                    if (this.firstStepForm.get('duration').value === 'YEARLY') {
                        this.finalPlanAmount = this.selectedPlan?.yearlyAmountAfterDiscount;
                    } else {
                        this.finalPlanAmount = this.selectedPlan?.monthlyAmountAfterDiscount;
                    }
                }
            }
        });
    }

    /**
     * This will use for next step form
     *
     * @return {*}  {void}
     * @memberof BuyPlanComponent
     */
    public nextStepForm(): void {
        this.isFormSubmitted = false;
        if (this.selectedStep === 0 && this.firstStepForm.invalid) {
            this.isFormSubmitted = true;
            return;
        }

        if (this.selectedStep === 1 && this.secondStepForm.invalid) {
            this.isFormSubmitted = true;
            return;
        }
        if (this.selectedStep === 2 && this.thirdStepForm.invalid) {
            this.isFormSubmitted = true;
            return;
        }

        this.planList$.pipe(takeUntil(this.destroyed$)).subscribe(result => {
            if (result) {
                this.selectedPlan = result.find(plan => plan.uniqueName === this.firstStepForm.get('planUniqueName').value);
            }
        });
        if (this.firstStepForm?.get('promoCode')?.value) {
            this.firstStepForm?.get('promoCode')?.setValue(this.firstStepForm?.get('promoCode')?.value);
        }
        this.selectedStep++;
    }


    /**
     * This will use for selected tab index
     *
     * @param {*} event
     * @memberof BuyPlanComponent
     */
    public onSelectedTab(event: any): void {
        this.selectedStep = event?.selectedIndex;
        if (this.selectedStep === 1) {
            this.initIntl();
        }
    }

    /**
     * Get All Plan API Call
     *
     * @memberof BuyPlanComponent
     */
    public getAllPlans(): void {
        this.planList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.inputData = [];
            if (response?.length) {
                this.selectedPlan = response?.length === 1 ? response[0] : response[1];
                this.popularPlan = response[1];

                this.firstStepForm.get('planUniqueName').setValue(this.selectedPlan?.uniqueName);

                response?.forEach(plan => {
                    this.inputData.push(plan);
                });

                this.monthlyPlans = response?.filter(plan => plan?.monthlyAmountAfterDiscount > 0);
                this.yearlyPlans = response?.filter(plan => plan?.yearlyAmountAfterDiscount > 0);

                if (this.yearlyPlans?.length) {
                    this.firstStepForm.get('duration').setValue('YEARLY');
                } else {
                    this.firstStepForm.get('duration').setValue('MONTHLY');
                }

                if (this.firstStepForm.get('duration').value === 'YEARLY') {
                    this.finalPlanAmount = this.selectedPlan?.yearlyAmountAfterDiscount;
                } else {
                    this.finalPlanAmount = this.selectedPlan?.monthlyAmountAfterDiscount;
                }

            } else {
                this.inputData = [];
            }
        });
    }

    public newUserSelectCountry(event: any): void {
        if (this.isNewUserLoggedIn) {
            this.componentStore.getAllPlans({ params: { countryCode: event?.value } });
            this.newUserSelectedCountry = event.label;
        }
    }

    /**
     * This will use for select country
     *
     * @param {*} event
     * @memberof BuyPlanComponent
     */
    public selectCountry(event: any): void {
        if (event?.value) {

            if (event?.value.toLowerCase() === 'in') {
                this.finalPlanAmount = this.finalPlanAmount + this.finalPlanAmount * this.taxPercentage;
            } else {
                if (this.firstStepForm.get('duration').value === 'YEARLY') {
                    this.finalPlanAmount = this.selectedPlan?.yearlyAmountAfterDiscount;
                } else {
                    this.finalPlanAmount = this.selectedPlan?.monthlyAmountAfterDiscount;
                }
            }

            this.selectedCountry = event.label;
            this.secondStepForm.controls['country'].setValue(event);

            this.secondStepForm.get('taxNumber')?.setValue('');
            this.secondStepForm.get('state')?.setValue('');
            this.selectedState = "";
            this.selectedStateCode = "";
            this.disabledState = false;

            let onboardingFormRequest = new OnboardingFormRequest();
            onboardingFormRequest.formName = 'onboarding';
            onboardingFormRequest.country = event.value;
            this.store.dispatch(this.commonActions.GetOnboardingForm(onboardingFormRequest));

            let statesRequest = new StatesRequest();
            statesRequest.country = event.value;
            this.store.dispatch(this.generalActions.getAllState(statesRequest));
            this.changeDetection.detectChanges();
        }
    }

    /**
     * This will use for on submit company form
     *
     * @return {*}  {void}
     * @memberof BuyPlanComponent
     */
    public onSubmit(): void {
        this.isFormSubmitted = false;
        if (this.subscriptionForm.invalid) {
            this.isFormSubmitted = true;
            return;
        }
        let request = {
            planUniqueName: this.subscriptionForm.value.firstStepForm.planUniqueName,
            duration: this.subscriptionForm.value.firstStepForm.duration,
            userUniqueName: null,
            billingAccount: {
                billingName: this.subscriptionForm.value.secondStepForm.billingName,
                companyName: this.subscriptionForm.value.secondStepForm.companyName,
                taxNumber: this.subscriptionForm.value.secondStepForm.taxNumber,
                email: this.subscriptionForm.value.secondStepForm.email,
                pincode: this.subscriptionForm.value.secondStepForm.pincode,
                mobileNumber: this.intlClass.selectedCountryData?.dialCode + this.subscriptionForm.value.secondStepForm.mobileNumber,
                country: {
                    name: this.subscriptionForm.value.secondStepForm.country.label,
                    code: this.subscriptionForm.value.secondStepForm.country.value
                },
                address: this.subscriptionForm.value.secondStepForm.address
            },
            promoCode: this.subscriptionForm.value.firstStepForm.promoCode ? this.subscriptionForm.value.firstStepForm.promoCode : null,
            paymentProvider: this.subscriptionForm.value.firstStepForm.duration === "YEARLY" ? "RAZORPAY" : "CASHFREE"
        }
        if (this.subscriptionForm.value.secondStepForm.country.value === 'UK') {
            request.billingAccount['county'] = {
                name: this.subscriptionForm.value.secondStepForm.state.label,
                code: this.subscriptionForm.value.secondStepForm.state.value
            };
        } else {
            request.billingAccount['state'] = {
                name: this.subscriptionForm.value.secondStepForm.state.label,
                code: this.subscriptionForm.value.secondStepForm.state.value
            };
        }
        if (this.changePlan) {
            this.componentStore.updateSubscription(request);
        } else {
            this.componentStore.createSubscription(request);
        }
    }

    /**
    * This will use for select state
    *
    * @param {*} event
    * @memberof BuyPlanComponent
    */
    public selectState(event: any): void {
        if (event?.value) {
            this.selectedState = event.label;
            this.secondStepForm.controls['state'].setValue(event);
        }
    }

    /**
     *This will be use for open activate key dialog
     *
     * @memberof BuyPlanComponent
     */
    public activateDialog(): void {
        this.dialog.open(ActivateDialogComponent, {
            width: '600px'
        })
    }

    /**
     * Shows cashfree dialog
     *
     * @memberof BuyPlanComponent
     */
    public openCashfreeDialog(redirectLink: any): void {
        window.open(redirectLink, '_blank');
    }

    /**
    * This will scroll the right slide in mobile view for table
    *
    * @memberof BuyPlanComponent
    */
    public scrollRight(): void {
        this.tableContent.nativeElement.scrollTo({ left: (this.tableContent.nativeElement?.scrollLeft + 150), behavior: 'smooth' });
    }

    /**
     *This will scroll the left slide in mobile view for table
     *
     * @memberof BuyPlanComponent
     */
    public scrollLeft(): void {
        this.tableContent.nativeElement.scrollTo({ left: (this.tableContent.nativeElement?.scrollLeft - 150), behavior: 'smooth' });
    }

    /**
     * This will call on component destroy
     *
     * @memberof BuyPlanComponent
     */
    public ngOnDestroy(): void {
        document.body?.classList?.remove("plan-page");
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * This hook will be called when payment is initialized
     *
     * @memberof BuyPlanComponent
     */
    public initializePayment(request: any): void {
        let that = this;

        let options = {
            key: RAZORPAY_KEY,
            image: 'data:image/png;base64,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',
            handler: function (res) {
                that.updateSubscriptionPayment(res);
            },
            order_id: request.razorpayOrderId,
            theme: {
                color: '#F37254'
            },
            amount: request.dueAmount,
            currency: request.planDetails?.currency?.code || this.activeCompany?.baseCurrency,
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

    /**
     * Updates payment in subscription
     *
     * @param {*} razorPayResponse
     * @memberof BuyPlanComponent
     */
    public updateSubscriptionPayment(razorPayResponse: any): void {
        let request;
        if (razorPayResponse) {
            request = {
                subscriptionRequest: {
                    subscriptionId: this.subscriptionResponse?.subscriptionId
                },
                paymentId: razorPayResponse.razorpay_payment_id,
                razorpaySignature: razorPayResponse.razorpay_signature,
                amountPaid: this.subscriptionResponse?.dueAmount,
                callNewPlanApi: true,
                razorpayOrderId: razorPayResponse?.razorpay_order_id
            };
            this.subscriptionId = request?.subscriptionRequest?.subscriptionId;
            this.componentStore.updateNewLoginSubscriptionPayment({ request: request });
        }
    }
}