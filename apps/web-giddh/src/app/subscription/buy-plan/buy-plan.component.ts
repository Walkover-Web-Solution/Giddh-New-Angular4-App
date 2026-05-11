import { ViewSubscriptionComponentStore } from './../view-subscription/utility/view-subscription.store';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, computed, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivateDialogComponent } from '../activate-dialog/activate-dialog.component';
import { BuyPlanComponentStore } from './utility/buy-plan.store';
import { Observable, ReplaySubject, takeUntil, of as observableOf, distinctUntilChanged, debounceTime, delay, take, filter } from 'rxjs';
import { ToasterService } from '../../services/toaster.service';
import { CountryRequest, OnboardingFormRequest } from '../../models/api-models/Common';
import { CommonActions } from '../../actions/common.actions';
import { SubscriptionsService } from '../../services/subscriptions.service';
import { AppState } from '../../store';
import { select, Store } from '@ngrx/store';
import { StatesRequest } from '../../models/api-models/Company';
import { GeneralActions } from '../../actions/general/general.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { userLoginStateEnum } from '../../models/user-login-state';
import { ChangeBillingComponentStore } from '../change-billing/utility/change-billing.store';
import { SubscriptionComponentStore } from '../utility/subscription.store';
import { GeneralService } from '../../services/general.service';
import { MatSelect } from '@angular/material/select';
import { gulfCountriesCode, regionCountriesCode } from '../../shared/helpers/countryWithCodes';
import { SettingsProfileActions } from '../../actions/settings/profile/settings.profile.action';
import { EntityCode, IOption, PaymentProvider, PlanDuration } from '../../app.constant';
import { ServiceConfig } from '../../services/service.config';
import { environment } from 'apps/web-giddh/src/environments/environment.generated';
import { SessionState } from '../../store/authentication/authentication.reducer';

@Component({
    selector: 'buy-plan',
    templateUrl: './buy-plan.component.html',
    styleUrls: ['./buy-plan.component.scss'],
    providers: [BuyPlanComponentStore, ChangeBillingComponentStore, ViewSubscriptionComponentStore, SubscriptionComponentStore],
    standalone:false
})

export class BuyPlanComponent implements OnInit, OnDestroy {
    /** Stepper Form instance */
    @ViewChild('stepper') stepperIcon: any;
    /** This will use for table content scroll in mobile */
    @ViewChild('tableContent', { read: ElementRef }) public tableContent: ElementRef<any>;
    /** Holds Country list Mat Trigger Reference  */
    @ViewChild('countryList', { static: false }) public countryList: MatSelect;
    /** Stripe Payment Element container reference */
    @ViewChild('stripePaymentElement') public stripePaymentElementRef: ElementRef;
    /** This will use for hold table data */
    public inputData: any[] | null = null;
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
    public planList$: Observable<any> = this.componentStore.select(state => state.planList);
    /** Holds Store Plan list API success state as observable*/
    public planListInProgress$: Observable<any> = this.componentStore.select(state => state.planListInProgress);
    /** Holds Store Create Plan API in progress state as observable*/
    public createSubscriptionInProgress$: Observable<any> = this.componentStore.select(state => state.createSubscriptionInProgress);
    /** Holds Store Create Plan API succes state as observable*/
    public createSubscriptionSuccess$: Observable<any> = this.componentStore.select(state => state.createSubscriptionSuccess);
    /** Holds Store Create Plan API succes state as observable*/
    public createSubscriptionResponse$: Observable<any> = this.componentStore.select(state => state.createSubscriptionResponse);
    /** Holds Store Change plan API response state as observable*/
    public updatePlanSuccess$: Observable<any> = this.componentStore.select(state => state.updatePlanSuccess);
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
    /** Signal to track if form is submitted to show error if available */
    public isFormSubmitted = signal<boolean>(false);
    /** Hold selected plan*/
    public selectedPlan = signal<any>(null);
    /** Hold session source observable*/
    public session$: Observable<SessionState>;
    /** Hold state source observable*/
    public stateSource$: Observable<IOption[]> = observableOf([]);
    /** Hold country source*/
    public countrySource: IOption[] = [];
    /** Hold  common country source*/
    public commonCountrySource: IOption[] = [];
    /** Hold common country source observable*/
    public commonCountrySource$: Observable<IOption[]> = observableOf([]);
    /** Hold country source observable*/
    public countrySource$: Observable<IOption[]> = observableOf([]);
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
    public isNewUserLoggedIn: boolean;
    /** Razorpay instance */
    public razorpay: any;
    /** Holds subscription response */
    private subscriptionResponse: any = {};
    /** Holds Store Apply Promocode API response state as observable*/
    public updateSubscriptionPaymentIsSuccess$: Observable<any> = this.componentStore.select(state => state.updateSubscriptionPaymentIsSuccess);
    /** Holds filtered monthly plans */
    public monthlyPlans: any[] = [];
    /** Holds filtered yearly plans */
    public yearlyPlans: any[] = [];
    /** Hold new user selected country */
    public newUserSelectedCountry: string = '';
    /** Hold new user selected country */
    public currentCountry: FormControl = new FormControl(null);
    /** Hold subscription id */
    public subscriptionId: string = '';
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** True if it is change plan */
    public isChangePlan: boolean = false;
    /** Holds Store Get Billing Details observable*/
    public getBillingDetails$: Observable<any> = this.changeBillingComponentStore.select(state => state.getBillingDetails);
    /** True if it have billing details */
    public getBillingData: boolean = false;
    /** Holds Store Get Billing Details observable*/
    public changePlanDetails$: Observable<any> = this.componentStore.select(state => state.changePlanDetails);
    /** Holds Store Get Country list observable*/
    public getCountryList$: Observable<any> = this.componentStore.select(state => state.countryList);
    /** Holds subscription request */
    public subscriptionRequest: any;
    /** Holds View Subscription list observable*/
    public viewSubscriptionData$: Observable<any> = this.viewSubscriptionComponentStore.select(state => state.viewSubscription);
    /** Hold pay type*/
    public payType: string = '';
    /** Holds Store Buy Plan Success observable*/
    public buyPlanSuccess$: Observable<any> = this.subscriptionComponentStore.select(state => state.buyPlanSuccess);
    /** This will use for open window */
    private openedWindow: Window | null = null;
    /** Holds Store Plan list API success state as observable*/
    public subscriptionRazorpayOrderDetails$: Observable<any> = this.componentStore.select(state => state.subscriptionRazorpayOrderDetails);
    /** Holds Store Plan Calculation Plan Data API success state as observable*/
    public calculateData$: Observable<any> = this.componentStore.select(state => state.calculateData);
    /** Holds Store Plan Calculation Plan Data API in progress state as observable*/
    public calculateDataInProgress$: Observable<any> = this.componentStore.select(state => state.calculateDataInProgress);
    /** True if it is subscription region */
    public isSubscriptionRegion: boolean = false;
    /** Hold current time stamp  */
    public currentTimeStamp: string;
    /** Holds Store Activate Plan Success observable*/
    public activatePlanSuccess$ = this.componentStore.select(state => state.activatePlanSuccess);
    /** True if it is upgrade plan */
    public upgradePlan: boolean = false;
    /** Hold upgrade subscription id  */
    public upgradeSubscriptionId: any;
    /** Hold upgrade billing request id  */
    public goCardLessBillingRequestId: any;
    /** Hold upgrade region  */
    public upgradeRegion: any;
    /** Hold get subscription data */
    public viewSubscriptionData: any;
    /** Hold all plans */
    public allPlans: any[] = [];
    /** True if user change manualy plan */
    public isUserManualChangePlan: boolean = false;
    /** True if user renew  plan */
    public isRenewPlan: boolean = false;
    /** Razorpay API success state as observable  */
    public razorpaySuccess$ = this.componentStore.select((state) => state.razorpaySuccess);
    /** True if user trial  plan */
    public isTrialPlan: boolean = false;
    /** Hold calculation amount response*/
    public calculationResponse: any;
    /** Hold new user selected country value */
    public newUserSelectedCountryValue: string = '';
    /** Hold broadcast event */
    public broadcast: any;
    /** Hold paypal capture order id */
    public paypalCaptureOrderId: any = '';
    /** Holds Store Paypal Order Id Success observable*/
    public paypalCaptureOrderIdSuccess$: Observable<boolean> = this.componentStore.select(state => state.paypalCaptureOrderIdSuccess);
    /** Hold filtered payment providers */
    public filteredPaymentProviders: any[] = [];
    /** Hold all payment providers */
    public allPaymentProviders: any[] = [];
    /** Hold callback broadcast event */
    public callBackBroadcast: any;
    /** Hold callback event */
    public callBackEvent: boolean = false;
    /** Hold create subscription success event */
    public createSubscriptionSuccess: any;
    /** Request object for generate order id */
    public generateOrderIdRequest: any
    // Add retry count for Razorpay payment failures
    public razorpayRetryCount: number = 0;
    public maxRazorpayRetryCount: number = 3;
    /** Hold payment provider */
    public paymentProvider: typeof PaymentProvider = PaymentProvider;
    /** Hold plan duration constant reference for template usage */
    public readonly planDuration: typeof PlanDuration = PlanDuration;
    /** Signal holding the currently selected plan duration value */
    protected readonly selectedDuration = signal<string>('');
    /** Computed signal: true when selected duration is MONTHLY */
    protected readonly isMonthly = computed(() => this.selectedDuration() === PlanDuration.MONTHLY);
    /** Computed signal: true when selected duration is YEARLY */
    protected readonly isYearly = computed(() => this.selectedDuration() === PlanDuration.YEARLY);
    /** Computed signal: true when selected duration is DAILY */
    protected readonly isDaily = computed(() => this.selectedDuration() === PlanDuration.DAILY);
    /** Computed signal: true when selected plan entity code is IND */
    protected readonly isIndian = computed(() => this.selectedPlan()?.entityCode === EntityCode.IND);
    /** Hold entity code constant reference for template usage */
    public readonly entityCode: typeof EntityCode = EntityCode;
    /** This will hold razorpay key */
    public razorpayKey: string = '';
    /** This will hold stripe key */
    public stripeKey: string = '';
    /** Stripe instance */
    public stripe: any;
    /** Stripe elements instance */
    public stripeElements: any;
    /** Holds stripe client secret */
    public stripeClientSecret: string = '';
    /** True if stripe payment element is visible */
    public showStripePaymentElement: boolean = false;
    /** True if stripe payment is in progress */
    public stripePaymentInProgress: boolean = false;
    /** Stripe error message */
    public stripeError: string = '';
    /** Holds store save stripe payment success observable */
    public saveStripePaymentSuccess$: Observable<any> = this.componentStore.select(state => state.saveStripePaymentSuccess);
    /** True if promo code is removed */
    public removePromoCode: boolean = false;
    /** Hold true in production environment */
    public isProdMode: boolean = environment.PRODUCTION_ENV;
    /** This will hold option selected state */
    public optionSelected: boolean = false;
    /** Holds user information  by user ip */
    private detectUserInfoByIp: any = {}

    constructor(
        public dialog: MatDialog,
        private readonly componentStore: BuyPlanComponentStore,
        private readonly changeBillingComponentStore: ChangeBillingComponentStore,
        private readonly subscriptionComponentStore: SubscriptionComponentStore,
        private toasterService: ToasterService,
        private commonActions: CommonActions,
        private store: Store<AppState>,
        private changeDetection: ChangeDetectorRef,
        private generalActions: GeneralActions,
        private formBuilder: FormBuilder,
        private subscriptionService: SubscriptionsService,
        private settingsProfileActions: SettingsProfileActions,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        private elementRef: ElementRef,
        private viewSubscriptionComponentStore: ViewSubscriptionComponentStore,
        protected generalService: GeneralService,
        @Inject(ServiceConfig) private serviceConfig
    ) {
        this.session$ = this.store.pipe(select(p => p.session), distinctUntilChanged(), takeUntil(this.destroyed$));
        this.store.dispatch(this.generalActions.openSideMenu(false));
        this.razorpayKey = this.serviceConfig.RAZORPAY_KEY;
        this.stripeKey = this.serviceConfig.STRIPE_PUBLISHABLE_KEY
    }

    /**
     * Hook cycle for component initialization
     *
     * @memberof BuyPlanComponent
     */
    public ngOnInit(): void {
        document.body?.classList?.add("plan-page");
        this.currentTimeStamp = this.generalService.getTimeStamp();
        this.initSubscriptionForm();
        this.getCountry();
        this.getAllPlans();
        this.getStates();
        this.getCompanyProfile();
        this.getOnboardingFormData();
        this.getActiveCompany();
        this.setUserCountry();

        // Handle Stripe redirect return
        const urlParams = new URLSearchParams(window.location.search);
        const redirectSecret = urlParams.get('payment_intent_client_secret');
        const redirectIntentId = urlParams.get('payment_intent');
        if (redirectSecret && redirectIntentId) {
            this.handleStripeRedirectReturn(redirectSecret, redirectIntentId);
        }

        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe((params: any) => {
            if (params?.id) {
                this.subscriptionId = params.id;
                this.viewSubscriptionComponentStore.viewSubscriptionsById(this.subscriptionId);
                this.isChangePlan = true;
            }
        });

        this.route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe((queryParams: any) => {
            if (queryParams?.renew) {
                this.isRenewPlan = true;
            } else if (queryParams?.trial) {
                this.isTrialPlan = true;
            }
        });

        this.razorpaySuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                if (this.subscriptionId && this.isChangePlan) {
                    this.navigateToRoute('/pages/user-details/subscription');
                } else {
                    this.navigateToNewCompany(this.subscriptionId);
                };
            }
        });

        this.saveStripePaymentSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                const paymentIntentId = sessionStorage.getItem('stripe_payment_intent_id');
                const subscriptionId = sessionStorage.getItem('stripe_subscription_id');
                if (paymentIntentId && subscriptionId) {
                    const subscriptionRequestStr = sessionStorage.getItem('stripe_subscription_request');
                    const subscriptionRequest = subscriptionRequestStr ? JSON.parse(subscriptionRequestStr) : {};
                    const model = {
                        paymentIntentId: paymentIntentId,
                        subscriptionId: subscriptionId,
                        callNewPlanApi: true,
                        duration: sessionStorage.getItem('stripe_duration'),
                        planUniqueName: sessionStorage.getItem('stripe_plan_unique_name'),
                        amountPaid: Number(sessionStorage.getItem('stripe_amount_paid')) || 0
                    };
                    const data = { ...model, ...subscriptionRequest };
                    this.componentStore.changePlan(data);
                }
                sessionStorage.removeItem('stripe_subscription_id');
                sessionStorage.removeItem('stripe_payment_intent_id');
                sessionStorage.removeItem('stripe_is_change_plan');
                sessionStorage.removeItem('stripe_subscription_request');
                sessionStorage.removeItem('stripe_duration');
                sessionStorage.removeItem('stripe_plan_unique_name');
                sessionStorage.removeItem('stripe_amount_paid');
            }
        });

        this.subscriptionRazorpayOrderDetails$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                if (response?.stripeClientSecret) {
                    this.initializeStripePayment(response);
                    return;
                }
                this.setBroadcastEvent();
                const value = response?.region?.code !== EntityCode.IND ? 1 : response?.duration === PlanDuration.MONTHLY ? 1 : 10;
                if (response.dueAmount >= value) {
                    this.initializePayment(response, 'generateOrderId');
                } else {
                    if (this.subscriptionId && this.isChangePlan) {
                        this.navigateToRoute('/pages/user-details/subscription');
                    } else {
                        this.navigateToNewCompany(this.responseSubscriptionId);
                    };
                }
            }
        });

        this.calculateData$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && Object.keys(response)?.length) {
                this.calculationResponse = response;
                if (response?.promoCode) {
                    this.toasterService.showSnackBar('success', this.localeData?.promocode_message);
                    this.promoCodeResponse[0] = response;
                    this.firstStepForm?.get('promoCode')?.patchValue(response?.promoCode);
                } else if (this.firstStepForm?.get('promoCode')?.value) {
                    this.toasterService.showSnackBar('success', this.localeData?.promocode_discount_message);
                    this.promoCodeResponse[0] = [];
                    this.firstStepForm?.get('promoCode')?.patchValue(null);
                }
                this.finalPlanAmount = response?.planAmountAfterTax ? (response?.planAmountAfterTax ?? 0) : (response?.planAmountBeforeTax ?? 0);
                this.planList$.pipe(filter(Boolean), take(1)).subscribe(result => {
                    if (result) {
                        this.selectedPlan.set(result.find(plan => plan?.uniqueName === this.firstStepForm.get('planUniqueName').value));
                        this.selectedPlan.set({ ...this.selectedPlan(), ...response });
                    }
                });
            } else {
                this.planList$.pipe(filter(Boolean), take(1)).subscribe(result => {
                    if (result) {
                        this.selectedPlan.set(result.find(plan => plan?.uniqueName === this.firstStepForm.get('planUniqueName').value));
                        this.selectedPlan.set({ ...this.selectedPlan(), ...this.calculationResponse });
                    }
                });
            }
            this.changeDetection.detectChanges();
        });

        this.getCountryList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.countrySource = [];
                Object.keys(response).forEach(key => {
                    this.countrySource.push({
                        value: response[key].alpha3CountryCode,
                        label: response[key].alpha3CountryCode + ' - ' + response[key].countryName,
                        additional: response[key]
                    });
                });
                this.countrySource$ = observableOf(this.countrySource);
                this.patchCurrentCountryFromSelection();
                if (this.countrySource.length === 1 && !this.newUserSelectedCountryValue) {
                    this.selectFirstPlanFromList();
                } else {
                    this.getDefaultPlan();
                    setTimeout(() => {
                        this.countryList?.open();
                    }, 400);
                }
            } else {
                let countryRequest = new CountryRequest();
                countryRequest.formName = 'onboarding';
                this.store.dispatch(this.commonActions.GetCountry(countryRequest));
            }
        });

        this.componentStore.commonCountries$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.commonCountrySource = [];
                Object.keys(response).forEach(key => {
                    this.commonCountrySource.push({
                        value: response[key].alpha2CountryCode,
                        label: response[key].alpha2CountryCode + ' - ' + response[key].countryName
                    });
                });
                this.commonCountrySource$ = observableOf(this.commonCountrySource);
                this.patchCurrentCountryFromSelection();
                if (this.detectUserInfoByIp?.alpha2CountryCode) {
                    const countryObject = this.commonCountrySource.find(item => item.label.includes(this.detectUserInfoByIp.alpha2CountryCode));
                    if (countryObject) {
                        this.selectCountry(countryObject);
                        this.selectedCountry = countryObject.label;
                    }
                }
            } else {
                let countryRequest = new CountryRequest();
                countryRequest.formName = 'onboarding';
                this.store.dispatch(this.commonActions.GetCountry(countryRequest));
            }
        });

        this.secondStepForm.get('country.code').valueChanges.pipe(debounceTime(500), filter(Boolean), distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                let statesRequest = new StatesRequest();
                statesRequest.country = response;
                this.store.dispatch(this.generalActions.getAllState(statesRequest));
            }
        });

        this.session$.pipe(filter(Boolean), takeUntil(this.destroyed$)).subscribe(response => {
            this.isNewUserLoggedIn = response.userLoginState === userLoginStateEnum.newUserLoggedIn;
            if (!this.isNewUserLoggedIn) {
                this.getBillingDetails();
                this.getBillingDetails$.pipe(delay(1000), takeUntil(this.destroyed$)).subscribe(data => {
                    if (data && data?.uniqueName) {
                        this.getBillingData = true;
                        this.setFormValues(data);
                        this.selectedCountry = data.country?.name;
                        this.selectedState = data?.state ? data.state?.name : data.county?.name;
                        if (this.secondStepForm.get('taxNumber')?.value && this.secondStepForm.get('taxNumber')?.value?.length >= 2) {
                            setTimeout(() => {
                                this.validateGstNumber();
                            }, 50);
                        }
                    }
                });
            }
            const userInfo = response?.user?.user;
            if (userInfo && !userInfo.hasSubscriptionPermission) {
                if (userInfo?.name !== userInfo?.email) {
                    this.secondStepForm.get("billingName").patchValue(userInfo.name);
                }
                this.secondStepForm.get("email").patchValue(userInfo.email || "");
                this.secondStepForm.get("mobileNumber").patchValue(userInfo.contactNo || "");
            }

        });

        this.callBackBroadcast = new BroadcastChannel("call-back-subscription");
        this.callBackBroadcast.onmessage = (event) => {
            if (event?.data?.success) {
                const model = {
                    orderId: this.paypalCaptureOrderId,
                    subscriptionId: this.subscriptionId
                }
                this.componentStore.paypalCaptureOrderId(model);
            }
        };

        this.paypalCaptureOrderIdSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.callBackEvent = true;
                this.paypalCallBackEvent(this.createSubscriptionSuccess);
            }
        });

        this.createSubscriptionResponse$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.setBroadcastEvent();
                this.responseSubscriptionId = response.subscriptionId;
                this.paypalCaptureOrderId = response.paypalOrderId;
                this.createSubscriptionSuccess = response;
                // if (response.duration === "YEARLY") {
                //     this.isLoading = true;
                //     this.subscriptionResponse = response;
                //     this.initializePayment(response);
                // } else {
                //     this.openCashfreeDialog(response?.redirectLink);
                // }
                this.subscriptionId = response.subscriptionId;
                if (response?.clientSecret) {
                    this.initializeStripePayment(response);
                    return;
                }
                if (response?.paypalOrderId) {
                    if ((response?.duration === PlanDuration.MONTHLY || response?.duration === PlanDuration.DAILY)) {
                        if (response?.paypalOrderId && this.payType === 'buy') {
                            this.openWindow(response.paypalApprovalLink);
                        } else {
                            this.navigateToNewCompany(response.subscriptionId);
                        }
                        return;
                    }
                } else if (response?.payuHtml) {
                    this.openPayUPayment(response.payuHtml);
                } else {
                    if (response?.paypalOrderId && this.payType === 'buy') {
                        this.openWindow(response.paypalApprovalLink);
                    } else {
                        if ((response?.duration === PlanDuration.MONTHLY || response?.duration === PlanDuration.DAILY) && response?.region?.code !== EntityCode.GBR) {
                            if (response.razorpayCustomerId && this.payType === 'buy') {
                                this.initializePayment(response, 'createSubscription');
                            } else {
                                this.navigateToNewCompany(response.subscriptionId);
                            }
                            return;
                        }
                        if (this.subscriptionId && this.isChangePlan) {
                            this.navigateToRoute('/pages/user-details/subscription');
                        } else {
                            if (this.payType === 'trial') {
                                this.navigateToNewCompany(response.subscriptionId);
                            } else {
                                if (((this.isMonthly() || this.isDaily()) && response?.region?.code !== EntityCode.IND)) {
                                    if (response?.status?.toLowerCase() === 'active') {
                                        this.navigateToNewCompany(response?.subscriptionId);
                                    } else {
                                        const model = {
                                            planUniqueName: response?.planDetails?.uniqueName,
                                            paymentProvider: this.thirdStepForm.value.paymentProvider,
                                            subscriptionId: response.subscriptionId,
                                            duration: this.firstStepForm.get('duration')?.value,
                                            promoCode: this.firstStepForm?.get('promoCode')?.value ?? null
                                        };
                                        this.subscriptionComponentStore.buyPlan(model);
                                    }
                                } else if (this.isYearly() && response?.region?.code === EntityCode.IND && response?.status?.toLowerCase() === 'active') {
                                        this.navigateToNewCompany(response?.subscriptionId);
                                } else {
                                    const reqObj = {
                                        subscriptionId: response?.subscriptionId,
                                        promoCode: this.firstStepForm?.get('promoCode')?.value ?? null
                                    }
                                    this.generateOrderIdRequest = reqObj;
                                    this.componentStore.generateOrderBySubscriptionId(reqObj);
                                }
                            }
                        };
                    }
                }
            }
        });

        this.buyPlanSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.stripeClientSecret) {
                this.initializeStripePayment(response);
            } else if (response?.paypalApprovalLink) {
                this.paypalCaptureOrderId = response.paypalOrderId;
                this.openWindow(response.paypalApprovalLink);
            } else if (response?.redirectLink) {
                this.goCardLessBillingRequestId = response.goCardLessBillingRequestId;
                this.openWindow(response.redirectLink);
            } else if (response?.subscriptionId) {
                this.navigateToNewCompany(response.subscriptionId);
            }
        });

        this.updatePlanSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.setBroadcastEvent();
                this.responseSubscriptionId = response.subscriptionId;
                // if (response.duration === "YEARLY") {
                //     this.isLoading = true;
                //     this.subscriptionResponse = response;
                //     this.initializePayment(response);
                // } else {
                //     this.openCashfreeDialog(response?.redirectLink);
                // }
                if (this.subscriptionId && this.isChangePlan) {
                    this.navigateToRoute('/pages/user-details/subscription');
                } else {
                    this.navigateToNewCompany(this.responseSubscriptionId);
                };
            }
        });

        this.updateSubscriptionPaymentIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.setBroadcastEvent();
                this.isLoading = false;
                if (this.subscriptionId && this.isChangePlan) {
                    this.navigateToRoute('/pages/user-details/subscription');
                } else {
                    this.navigateToNewCompany(this.subscriptionId);
                };
            }
        });

        window.addEventListener('message', event => {
            if ((this.router.url !== '/pages/user-details/subscription' && (this.router.url === '/pages/user-details/subscription/buy-plan/' + this.subscriptionId || this.router.url === '/pages/user-details/subscription/buy-plan/' + this.subscriptionId + '?trial=true' || this.router.url === '/pages/user-details/subscription/buy-plan/' + this.subscriptionId + '?renew=true' || this.router.url === '/pages/user-details/subscription/buy-plan'))) {
                if ((event?.data && typeof event?.data === "string" && event?.data === PaymentProvider.GOCARDLESS)) {
                    if (this.upgradePlan && this.upgradeRegion === EntityCode.GBR) {
                        const reqObj = {
                            subscriptionId: this.upgradeSubscriptionId,
                            billingRequestId: this.goCardLessBillingRequestId
                        }
                        this.componentStore.activatePlan(reqObj);
                        this.activatePlanSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
                            if (response) {
                                if (this.subscriptionId && this.isChangePlan) {
                                    this.navigateToRoute('/pages/user-details/subscription');
                                } else {
                                    this.navigateToNewCompany(this.subscriptionId);
                                };
                            }
                        });
                    } else {
                        setTimeout(() => {
                            if (this.subscriptionId && this.isChangePlan) {
                                this.navigateToRoute('/pages/user-details/subscription');
                            } else {
                                this.navigateToNewCompany(this.subscriptionId);
                            }
                        }, 100);
                    }
                }
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
                this.changeDetection.detectChanges();
            }
        });

        this.changePlanDetails$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.upgrade) {
                this.upgradePlan = response?.upgrade;
                this.upgradeSubscriptionId = response?.subscriptionId;
                this.upgradeRegion = response?.region?.code;

            }
            if (response?.stripeClientSecret) {
                this.initializeStripePayment(response);
                return;
            }
            const value = response?.region?.code !== EntityCode.IND ? 1 : (this.isMonthly() || this.isDaily()) ? 1 : 10;
            if (response?.payuHtml) {
                this.openPayUPayment(response.payuHtml);
            } else if (response && response.dueAmount >= value) {
                if ((this.isMonthly() || this.isDaily()) && response?.region?.code !== EntityCode.IND) {
                    let model = {
                        planUniqueName: response?.planDetails?.uniqueName,
                        paymentProvider: this.thirdStepForm.value.paymentProvider,
                        subscriptionId: response.subscriptionId,
                        duration: this.firstStepForm.get('duration')?.value,
                        promoCode: this.firstStepForm?.get('promoCode')?.value ?? null
                    };
                    this.subscriptionComponentStore.buyPlan(model);
                } else {
                    this.initializePayment(response, 'changePlan');
                }
            } else {
                if (response) {
                    if (response.region?.code !== 'IND') {
                        this.toasterService.showSnackBar("success", this.localeData?.plan_purchased_success_message);
                        this.navigateToRoute('/pages/user-details/subscription');
                    } else {
                        this.updateSubscriptionPayment(response, true);
                    }
                }
            }
        });

        this.viewSubscriptionData$.pipe(filter(Boolean), takeUntil(this.destroyed$)).subscribe(response => {
            this.viewSubscriptionData = response;
            if (this.subscriptionId && response?.region) {
                this.newUserSelectCountry({
                    "label": response.region?.code + " - " + response.region?.name,
                    "value": response.region?.code,
                    "additional": {
                        "value": response.region?.code,
                        "label": response.region?.code + " - " + response.region?.name,
                    }
                });
            } else if (this.activeCompany?.subscription?.region) {
                this.newUserSelectCountry({
                    "label": this.activeCompany?.subscription?.region?.code + " - " + this.activeCompany?.subscription?.region?.name,
                    "value": this.activeCompany?.subscription?.region?.code,
                    "additional": {
                        "value": this.activeCompany?.subscription?.region?.code,
                        "label": this.activeCompany?.subscription?.region?.code + " - " + this.activeCompany?.subscription?.region?.name
                    }
                });
            } else if (localStorage.getItem('Country-Region') === 'IN') {
                this.newUserSelectCountry({
                    "label": "IND - India",
                    "value": "IND",
                    "additional": {
                        "value": "IND",
                        "label": "IND - India"
                    }
                });
            } else if (localStorage.getItem('Country-Region') === 'GB') {
                this.newUserSelectCountry({
                    "label": "GBR - United Kingdom",
                    "value": "GBR",
                    "additional": {
                        "value": "GBR",
                        "label": "GBR - United Kingdom"
                    }
                });
            } else if (localStorage.getItem('Country-Region') === 'AE') {
                this.newUserSelectCountry({
                    "label": "ARE - United Arab Emirates",
                    "value": "ARE",
                    "additional": {
                        "value": "ARE",
                        "label": "ARE - United Arab Emirates"
                    }

                });
            } else if (!this.isChangePlan && !this.activeCompany?.uniqueName && localStorage.getItem('Country-Region') === 'GL') {
                this.newUserSelectCountry({
                    "label": "GLB - Global",
                    "value": "GLB",
                    "additional": {
                        "value": "GLB",
                        "label": "GLB - Global"
                    }
                });
            } else {
                this.isSubscriptionRegion = true;
            }
        });

        this.secondStepForm.get('taxNumber')?.valueChanges.pipe(delay(500), takeUntil(this.destroyed$)).subscribe(value => {
            if (value) {
                this.optionSelected = false;
            }
        });

    }
    /**
     * This will be used to set a broadcast event to call the 'get Company' API for subscription and header.
     *
     * @memberof BuyPlanComponent
     */
    public setBroadcastEvent(): void {
        this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
        this.broadcast = new BroadcastChannel("subscription");
        this.broadcast.postMessage({ activeCompany: 'activeCompany' });
    }
    /**
     * This will be use for paypal callback event
     *
     * @param {*} response
     * @memberof BuyPlanComponent
     */
    public paypalCallBackEvent(response: any): void {
        if (this.subscriptionId && this.isChangePlan) {
            this.navigateToRoute('/pages/user-details/subscription');
        } else {
            if (this.payType === 'trial') {
                this.navigateToNewCompany(response.subscriptionId);
            } else {
                if (response?.region?.code === EntityCode.GBR) {
                    let model = {
                        planUniqueName: response?.planDetails?.uniqueName,
                        paymentProvider: this.thirdStepForm.value.paymentProvider,
                        subscriptionId: response.subscriptionId,
                        duration: response?.duration,
                        promoCode: this.firstStepForm?.get('promoCode')?.value ?? null
                    };
                    if (this.callBackEvent) {
                        this.navigateToNewCompany(response?.subscriptionId);
                    } else {
                        this.subscriptionComponentStore.buyPlan(model);
                    }
                }
            }
        }
        if (this.upgradePlan && this.upgradeRegion === EntityCode.GBR) {
            const reqObj = {
                subscriptionId: this.upgradeSubscriptionId,
                goCardLessBillingRequestId : this.goCardLessBillingRequestId
            }
            this.componentStore.activatePlan(reqObj);
            this.activatePlanSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response) {
                    if (this.subscriptionId && this.isChangePlan) {
                        this.navigateToRoute('/pages/user-details/subscription');
                    } else {
                        this.navigateToNewCompany(this.subscriptionId);
                    };
                }
            });
        } else {
            if (this.subscriptionId && this.isChangePlan) {
                this.navigateToRoute('/pages/user-details/subscription');
            } else {
                this.navigateToNewCompany(this.subscriptionId);
            }
        }
    }

    /**
     * Navigates to the specified route with optional query parameters
     *
     * @private
     * @param {string} route - The route path to navigate to
     * @param {any} [queryParams] - Optional query parameters to include in navigation
     * @memberof BuyPlanComponent
     */
    private navigateToRoute(route: string, queryParams?: any): void {
        if (queryParams) {
            this.router.navigate([route], { queryParams });
        } else {
            this.router.navigate([route]);
        }
    }

    /**
     * This will be use for set user country
     *
     * @private
     * @memberof BuyPlanComponent
     */
    private setUserCountry(): void {
        this.generalService.getClientIp()
            .pipe(takeUntil(this.destroyed$))
            .subscribe(result => {
                if (result) {
                    const { alpha3CountryCode, alpha2CountryCode, countryName, stateName, completeResponse } = this.determineCountryCodes(result);
                    this.detectUserInfoByIp = { alpha3CountryCode, alpha2CountryCode, countryName, stateName, completeResponse };
                    this.getDefaultPlan();
                    this.secondStepForm.get("country")?.patchValue({code: alpha2CountryCode, name: countryName, additional: ''});
                } else {
                    const { alpha3CountryCode, alpha2CountryCode, countryName, stateName, completeResponse } = this.determineCountryCodes(null);
                    this.detectUserInfoByIp = { alpha3CountryCode, alpha2CountryCode, countryName, stateName, completeResponse };
                    this.getDefaultPlan();
                }
            });
    }

    /**
     * Selects the first available region from the country list.
     *
     * @private
     * @memberof BuyPlanComponent
     */
    private selectFirstPlanFromList(): void {
        if (!this.countrySource?.length) {
            return;
        }
        this.newUserSelectCountry(this.countrySource[0], true);
    }

    /**
     * Selects a default region using detected IP information when available.
     * Falls back to the first available region if no matching region exists.
     *
     * @private
     * @memberof BuyPlanComponent
     */
    private getDefaultPlan(): void {
        if (!this.countrySource?.length || this.inputData?.length || !this.detectUserInfoByIp?.alpha3CountryCode) {
            return;
        }

        let isPlanListInProgress = false;
        this.planListInProgress$.pipe(take(1)).subscribe(planListInProgress => {
            isPlanListInProgress = !!planListInProgress;
        });
        if (isPlanListInProgress) {
            return;
        }

        const isRegionCode = this.isRegionCountryCode(this.detectUserInfoByIp.alpha3CountryCode);
        const selectionCode = !isRegionCode ? this.detectUserInfoByIp.alpha3CountryCode : this.detectUserInfoByIp.alpha2CountryCode;
        const matchedCountry = this.countrySource?.find(country => country.value === this.detectUserInfoByIp.alpha3CountryCode);
        if (matchedCountry) {
            this.newUserSelectCountry({
                ...matchedCountry,
                label: `${selectionCode} - ${this.detectUserInfoByIp.countryName}`,
                value: this.detectUserInfoByIp.alpha3CountryCode
            });
        } else {
            this.selectFirstPlanFromList();
        }
    }

    /**
     * This function checks if the provided country code is a regional country code.
     *
     * @param {string} countryCode - The country code to check.
     * @returns {boolean} - Returns true if the code is a regional country code, false otherwise.
     */
    private isRegionCountryCode(countryCode: string): boolean {
        return regionCountriesCode.includes(countryCode?.toLowerCase());
    }

    /**
     * This function determines the country codes based on the provided IP address result.
     *
     * @param {any} result - The result object containing the country code, country name, and other relevant information.
     * @returns {{ alpha3CountryCode: string, alpha2CountryCode: string, countryName: string }} - An object containing the determined alpha-3 country code, alpha-2 country code, and country name.
     */
    private determineCountryCodes(result: any): { alpha3CountryCode: string, alpha2CountryCode: string, countryName: string, stateName: string, completeResponse } {
        let alpha3CountryCode = 'GLB';
        let alpha2CountryCode = '';
        let countryName = 'Global';

        if (result) {
            switch (result.countryCode) {
                case 'IN':
                    alpha3CountryCode = 'IND';
                    alpha2CountryCode = 'IN';
                    countryName = result.countryName;
                    break;
                case 'GB':
                    alpha3CountryCode = 'GBR';
                    alpha2CountryCode = 'GB';
                    countryName = result.countryName;
                    break;
                case 'AE':
                    alpha3CountryCode = 'ARE';
                    alpha2CountryCode = 'AE';
                    countryName = result.countryName;
                    break;
                default:
                    if (this.isGulfCountry(result.countryCode)) {
                        alpha3CountryCode = 'GLF';
                        alpha2CountryCode = 'GL';
                        countryName = 'Gulf';
                    } else if (result.continentCode === 'EU' && result.countryCode !== 'GB') {
                        alpha3CountryCode = 'EUR';
                        alpha2CountryCode = 'EU';
                        countryName = 'Europe';
                    }
                    break;
            }
        }

        return { alpha3CountryCode, alpha2CountryCode, countryName, stateName: result?.stateProv || '', completeResponse: result };
    }

    /**
     * This function checks if the provided country code is a Gulf country code.
     *
     * @param {string} code - The country code to check.
     * @returns {boolean} - Returns true if the code is a Gulf country code, false otherwise.
     */
    private isGulfCountry(code: string): boolean {
        return gulfCountriesCode.includes(code?.toLowerCase());
    }

    /**
     * This will be use for toggle duration event
     *
     * @param {*} event
     * @memberof BuyPlanComponent
     */
    public toggleDuration(event: any): void {
        if (event) {
            this.firstStepForm.get('duration').setValue(event?.value);
            this.setPlans(true);
        }
    }

    /**
   * This will be open window by url
   *
   * @param {string} url
   * @memberof BuyPlanComponent
   */
    public openWindow(url: string): void {
        const width = 800;
        const height = 900;

        this.openedWindow = this.generalService.openCenteredWindow(url, '', width, height);
    }

    /**
     * This will close the current window
     *
     * @memberof BuyPlanComponent
     */
    public closeWindow(): void {
        if (this.openedWindow) {
            this.openedWindow.close();
            this.openedWindow = null;
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
            country: this.formBuilder.group({name: [''], code: ['', Validators.required], additional: ''}),
            state: this.formBuilder.group({name: [''], code: ['', Validators.required], additional: ''}),
            address: ['']
        });

        this.thirdStepForm = this.formBuilder.group({
            userUniqueName: [''],
            paymentProvider: [''],
            razorpayAuthType: ['']
        });

        this.subscriptionForm = this.formBuilder.group({
            firstStepForm: this.firstStepForm,
            secondStepForm: this.secondStepForm,
            thirdStepForm: this.thirdStepForm
        });

        this.firstStepForm.get('duration').valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(value => {
            this.selectedDuration.set(value ?? '');
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
     * This will be use for back to previous page
     *
     * @memberof BuyPlanComponent
     */
    public backToPreviousPage(): void {
        if (this.firstStepForm?.get('promoCode')?.value) {
            this.firstStepForm?.get('promoCode')?.setValue(this.firstStepForm?.get('promoCode')?.value);
        }
    }

    /**
     * Gets active company details
     *
     * @private
     * @memberof BuyPlanComponent
     */
    private getActiveCompany(): void {
        this.componentStore.activeCompany$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.activeCompany?.uniqueName !== response?.uniqueName) {
                this.company.addresses = response.addresses;
                this.activeCompany = response;
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
                this.removePromoCode = false;
            } else {
                request = {
                    promoCode: "",
                    planUniqueName: this.firstStepForm.get('planUniqueName')?.value,
                    duration: this.firstStepForm.get('duration')?.value
                }
                this.firstStepForm.get('promoCode')?.setValue("");
                this.removePromoCode = true;
            }
            this.setFinalAmount();
            this.changeDetection.detectChanges();
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
     * This will be use for get countries
     *
     * @memberof BuyPlanComponent
     */
    public getCountry(): void {
        this.componentStore.getCountryList(null);
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

                const useStateList = response.stateList && Object.keys(response.stateList).length > 0;
                const stateCountyObj = useStateList
                    ? Object.values(response.stateList).find((state: any) => state.name === this.detectUserInfoByIp.stateName)
                    : response.countyList?.find((county: any) => county.name === this.detectUserInfoByIp.stateName);
                if (stateCountyObj) {
                    const label = useStateList
                        ? (stateCountyObj as any).code + ' - ' + (stateCountyObj as any).name
                        : (stateCountyObj as any).name;
                    this.secondStepForm.get("state").patchValue({
                        name: label,
                        code: (stateCountyObj as any).code,
                    });
                    this.selectedState = label;
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
            if (this.formFields['taxName']) {
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
            this.changeDetection.detectChanges();
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
                    this.secondStepForm.controls['state'].patchValue({ name: state?.label, code: state?.value, additional: '' });
                    return true;
                }
            });
            this.changeDetection.detectChanges();
        } else {
            this.disabledState = false;
            this.isGstinValid = false;
            this.selectedState = '';
            this.selectedStateCode = '';
            if (!this.optionSelected) {
                this.secondStepForm.controls['state'].patchValue({ name: '', code: '', additional: '' });
            }
            this.changeDetection.detectChanges();
        }
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
        if (this.firstStepForm?.get('promoCode')?.value) {
            this.applyPromoCode('add');
        }
        this.planList$.pipe(filter(Boolean), take(1)).subscribe(result => {
            if (result) {
                this.selectedPlan.set(result.find(plan => plan?.uniqueName === this.firstStepForm.get('planUniqueName').value));
                this.isUserManualChangePlan = this.selectedPlan()?.uniqueName !== this.viewSubscriptionData?.planUniqueName;
                this.setFinalAmount();
                this.changeDetection.detectChanges();
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
        this.isFormSubmitted.set(false);
        if (this.selectedStep === 0 && this.firstStepForm.invalid) {
            this.isFormSubmitted.set(true);
            return;
        }
        if (this.selectedStep === 1 && this.secondStepForm.invalid) {
            this.isFormSubmitted.set(true);
            return;
        }
        if (this.selectedStep === 2 && this.thirdStepForm.invalid) {
            this.isFormSubmitted.set(true);
            return;
        }

        this.planList$.pipe(filter(Boolean), take(1)).subscribe(result => {
            if (result) {
                this.selectedPlan.set(result.find(plan => plan?.uniqueName === this.firstStepForm.get('planUniqueName').value));
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
        this.setFinalAmount();
        if (this.selectedStep !== 2) {
            this.showStripePaymentElement = false;
            this.stripeClientSecret = '';
            this.stripeError = '';
            this.stripePaymentInProgress = false;
            this.stripeElements = null;
            this.stripe = null;
        }
        this.changeDetection.detectChanges();
    }

    /**
     * Called when payment provider selection changes inside the shared component.
     * Triggers change detection so parent template re-evaluates dependent *ngIf blocks.
     *
     * @protected
     * @memberof BuyPlanComponent
     */
    protected onPaymentProviderChange(): void {
        this.showStripePaymentElement = false;
        this.stripeClientSecret = '';
        this.stripeError = '';
        this.stripePaymentInProgress = false;
        this.stripeElements = null;
        this.stripe = null;
        this.changeDetection.detectChanges();
    }

    /**
     * Get All Plan API Call
     *
     * @memberof BuyPlanComponent
     */
    public getAllPlans(): void {
        this.planList$.pipe(filter(Boolean), take(1)).subscribe(response => {
            if (response?.length) {
                this.allPlans = response;
                this.monthlyPlans = response?.filter(plan =>
                    plan.hasOwnProperty('monthlyAmount') && plan?.monthlyAmount !== null
                );

                this.yearlyPlans = response?.filter(plan =>
                    plan.hasOwnProperty('yearlyAmount') && plan?.yearlyAmount !== null
                );
                this.monthlyPlans = this.monthlyPlans.sort((a, b) => a.monthlyAmount - b.monthlyAmount);
                this.yearlyPlans = this.yearlyPlans.sort((a, b) => a.yearlyAmount - b.yearlyAmount);
                if (!this.subscriptionId) {
                    if (this.yearlyPlans?.length) {
                        this.firstStepForm.get('duration').patchValue(PlanDuration.YEARLY);
                    } else {
                        this.firstStepForm.get('duration').patchValue(PlanDuration.MONTHLY);
                    }
                } else if (this.viewSubscriptionData?.period) {
                    this.firstStepForm.get('duration').patchValue(this.viewSubscriptionData?.period);
                } else {
                    if (this.yearlyPlans?.length) {
                        this.firstStepForm.get('duration').patchValue(PlanDuration.YEARLY);
                    } else {
                        this.firstStepForm.get('duration').patchValue(PlanDuration.MONTHLY);
                    }
                }
                this.setPlans();
            } else {
                this.inputData = [];
            }
            this.changeDetection.detectChanges();
        });
    }

    /**
     * This will be use for set plan details
     *
     * @private
     * @memberof BuyPlanComponent
     */
    private setPlans(isToggle: boolean = false): void {
        this.inputData = [];
        if (!this.subscriptionId) {
            const filteredPlans = this.isYearly() ? this.yearlyPlans : this.monthlyPlans;
            this.selectedPlan.set(filteredPlans?.length === 1 ? filteredPlans[0] : filteredPlans[1]);
            filteredPlans?.forEach(plan => {
                this.inputData.push(plan);
            });
        } else if (isToggle) {
            const filteredPlans = this.isYearly() ? this.yearlyPlans : this.monthlyPlans;
            this.selectedPlan.set(filteredPlans?.length === 1 ? filteredPlans[0] : filteredPlans[1]);
            this.inputData.push(...filteredPlans);
        } else {
            let subscriptionPlan = this.allPlans?.filter(plan => plan?.uniqueName === this.viewSubscriptionData?.planUniqueName);
            this.selectedPlan.set(subscriptionPlan[0]);
            const filteredPlans = this.viewSubscriptionData?.period === PlanDuration.YEARLY ? this.yearlyPlans : this.monthlyPlans;
            filteredPlans?.forEach(plan => {
                this.inputData.push(plan);
            });
        }
        this.firstStepForm.get('planUniqueName').setValue(this.selectedPlan()?.uniqueName);
        this.thirdStepForm.get('paymentProvider')?.patchValue(null);
        this.setFinalAmount();
        this.changeDetection.detectChanges();
    }

    /**
     * This will be use for set final amount
     *
     * @memberof BuyPlanComponent
     */
    public setFinalAmount(): void {
        let isCalculating = false;
        this.calculateDataInProgress$.pipe(take(1)).subscribe(inProgress => {
            isCalculating = inProgress;
        });

        if (isCalculating) {
            return;
        }
        const reqObj = {
            planUniqueName: this.selectedPlan()?.uniqueName,
            promoCode: this.firstStepForm?.get('promoCode')?.value,
            duration: this.firstStepForm.get('duration').value,
            countryCode: this.isNewUserLoggedIn ? this.selectedPlan()?.entityCode : (this.secondStepForm.get('country').value?.code ?? this.viewSubscriptionData?.region?.code)
        }

        if (this.isChangePlan || this.isRenewPlan) {
            reqObj['subscriptionId'] = this.subscriptionId;
        }
        if (this.selectedPlan()?.uniqueName && reqObj?.countryCode) {
            this.componentStore.getCalculationData(reqObj);
        }
        if (!this.removePromoCode && !this.thirdStepForm.get('paymentProvider')?.value) {
            // Clear the payment provider initially
            this.thirdStepForm.get('paymentProvider')?.patchValue(null);
        }

        const entityCode = this.selectedPlan()?.entityCode;

        const filterProviders = (providers: string[]) => {
            this.filteredPaymentProviders = this.allPaymentProviders.filter(provider => providers.includes(provider.value));
            if (this.filteredPaymentProviders?.length === 1) {
                this.thirdStepForm.get('paymentProvider')?.patchValue(providers[0]);
            }
        };

        if (entityCode === EntityCode.GBR) {
            // GBR: GoCardless/PayPal/PayU for recurring, Razorpay/PayU for yearly
            if (this.isMonthly() || this.isDaily()) {
                this.filteredPaymentProviders = this.allPaymentProviders.filter(provider => [PaymentProvider.GOCARDLESS, PaymentProvider.PAYPAL].includes(provider.value));
            } else if (this.isYearly()) {
                filterProviders([PaymentProvider.RAZORPAY]);
            }
        } else if (entityCode !== EntityCode.IND) {
            // Non-IND: Stripe/PayPal for monthly, Stripe/Razorpay for yearly
            if (this.isMonthly() || this.isDaily()) {
                filterProviders([PaymentProvider.STRIPE, PaymentProvider.PAYPAL]);
            } else if (this.isYearly()) {
                filterProviders([PaymentProvider.STRIPE, PaymentProvider.RAZORPAY]);
            }
        } else {
            // IND: Razorpay + PayU for all durations
            filterProviders([PaymentProvider.RAZORPAY]);
        }

        // Auto-select CARD auth type when Razorpay is chosen for recurring plans
        const isRazorpay = this.thirdStepForm.get('paymentProvider')?.value === PaymentProvider.RAZORPAY;
        this.thirdStepForm.get('razorpayAuthType')?.patchValue(isRazorpay && (this.isMonthly() || this.isDaily()) ? 'CARD' : null);
        this.changeDetection.detectChanges();
    }

    /**
     * Returns true if the given plan is free for the specified duration.
     * A plan is considered free when its amount is 0 and no discount is applied.
     *
     * @param {*} plan - The plan object to check
     * @param {string} duration - The duration to check against (use PlanDuration constant)
     * @returns {boolean}
     * @memberof BuyPlanComponent
     */
    protected isFreePlan(plan: any, duration: string): boolean {
        if (duration === PlanDuration.YEARLY) {
            return plan?.yearlyAmount === 0 && !plan?.yearlyDiscount;
        } else if (duration === PlanDuration.MONTHLY) {
            return plan?.monthlyAmount === 0 && !plan?.monthlyDiscount;
        } else if (duration === PlanDuration.DAILY) {
            return plan?.monthlyAmount === 0 && !plan?.monthlyDiscount;
        }
        return false;
    }

    /**
     * This will be use for new user select country
     *
     * @param {*} event Country option selected
     * @param {boolean} [isAutoSelect=false] True when triggered programmatically (e.g. single-region auto-select)
     * @memberof BuyPlanComponent
     */
    public newUserSelectCountry(event: any, isAutoSelect: boolean = false): void {
        if (event?.value) {
            this.componentStore.getAllPlans({ params: { regionCode: event?.value } });
            this.newUserSelectedCountry = event.label;
            this.newUserSelectedCountryValue = event.value;

            setTimeout(() => {
                this.getAllPlans();
                this.patchCurrentCountryFromSelection();
            }, 200);
        }
    }

    /**
     * Patches currentCountry control from countrySource using a stable code match.
     * Safe to call multiple times; no-ops until both selection and source are ready.
     *
     * @private
     * @memberof BuyPlanComponent
     */
    private patchCurrentCountryFromSelection(): void {
        if (!this.countrySource?.length || !this.newUserSelectedCountryValue) {
            return;
        }
        const selectionValue = this.newUserSelectedCountryValue;
        const match = this.countrySource.find(country =>
            country.value === selectionValue ||
            country.label === this.newUserSelectedCountry ||
            country.additional?.alpha2CountryCode === selectionValue ||
            country.additional?.alpha3CountryCode === selectionValue
        );
        if (match) {
            this.currentCountry.patchValue(match);
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
            this.selectedCountry = event.label;
            this.secondStepForm.controls['country'].patchValue({ name: event.label, code: event.value, additional: event.additional });
            this.secondStepForm.get('taxNumber')?.setValue('');
            this.secondStepForm.get('state')?.patchValue({name: '', code: '', additional: ''});
            this.selectedState = "";
            this.selectedStateCode = "";
            this.disabledState = false;

            let onboardingFormRequest = new OnboardingFormRequest();
            onboardingFormRequest.formName = 'onboarding';
            onboardingFormRequest.country = event.value;
            this.store.dispatch(this.commonActions.GetOnboardingForm(onboardingFormRequest));
            this.changeDetection.detectChanges();
        }
    }

    /**
     * This will use for on submit company form
     *
     * @param {('buy' | 'trial')} type
     * @return {*}  {void}
     * @memberof BuyPlanComponent
     */
    public onSubmit(type: 'buy' | 'trial'): void {
        const isTrial = type === 'trial';
        this.payType = type;
        this.isFormSubmitted.set(false);
        
        // If the plan is free else payment provider not selected, payment provider is not required
        const isPaymentProviderRequired = !this.isFreePlan(this.selectedPlan(), this.selectedDuration()) && (this.payType === 'buy' && !this.subscriptionForm.value.thirdStepForm?.paymentProvider);
        
        if (isPaymentProviderRequired) {
            this.thirdStepForm.get('paymentProvider')?.setErrors({ required: true });
            this.thirdStepForm.get('paymentProvider')?.markAsTouched();
        } else {
            this.thirdStepForm.get('paymentProvider')?.setErrors(null);
            this.thirdStepForm.get('paymentProvider')?.updateValueAndValidity();
        }
       setTimeout(() => {
            if (this.subscriptionForm.invalid) {
                this.isFormSubmitted.set(true);
                return;
            }
            let mobileNumber = this.subscriptionForm.value.secondStepForm.mobileNumber?.replace(/\+/g, '');
            let request: any = {
                planUniqueName: this.subscriptionForm.value.firstStepForm.planUniqueName,
                duration: this.subscriptionForm.value.firstStepForm.duration,
                userUniqueName: null,
                billingAccount: {
                    billingName: this.subscriptionForm.value.secondStepForm.billingName,
                    companyName: this.subscriptionForm.value.secondStepForm.companyName,
                    taxNumber: this.subscriptionForm.value.secondStepForm.taxNumber,
                    email: this.subscriptionForm.value.secondStepForm.email,
                    pincode: this.subscriptionForm.value.secondStepForm.pincode,
                    mobileNumber: mobileNumber,
                    country: {
                        name: this.subscriptionForm.value.secondStepForm.country.name,
                        code: this.subscriptionForm.value.secondStepForm.country.code
                    },
                    address: this.subscriptionForm.value.secondStepForm.address
                },
                promoCode: this.subscriptionForm.value.firstStepForm.promoCode ? this.subscriptionForm.value.firstStepForm.promoCode : null,
                paymentProvider: this.thirdStepForm.value.paymentProvider,
                subscriptionId: null
            }

            if ((this.isMonthly() || this.isDaily()) && this.selectedPlan()?.entityCode !== EntityCode.GBR) {
                request['razorpayAuthType'] = this.subscriptionForm.value.thirdStepForm.razorpayAuthType;
            }

            if (this.subscriptionForm.value.secondStepForm.country.value === 'GB') {
                request.billingAccount['county'] = {
                    name: this.subscriptionForm.value.secondStepForm.state.name,
                    code: this.subscriptionForm.value.secondStepForm.state.code
                };
            } else {
                request.billingAccount['state'] = {
                    name: this.subscriptionForm.value.secondStepForm.state.name,
                    code: this.subscriptionForm.value.secondStepForm.state.code
                };
            }

            request['payNow'] = !isTrial;
            // if (isTrial) {
            //     delete request.razorpayAuthType;
            //     delete request.subscriptionId;
            //     delete request.userUniqueName;
            //     delete request.paymentProvider;
            //     delete request.promoCode;
            // }
            if (this.subscriptionId && this.isChangePlan) {
                request.subscriptionId = this.subscriptionId;
                this.subscriptionRequest = request;
                this.componentStore.getChangePlanDetails(request);
            } else {
                this.componentStore.createSubscription(request);
            }
        }, 100);
    }

    /**
    * This will use for select state
    *
    * @param {*} event
    * @memberof BuyPlanComponent
    */
    public selectState(event: any): void {
        if (event?.value) {
            this.optionSelected = true;
            this.selectedState = event.label;

            this.secondStepForm.controls['state'].patchValue({
                name: event.label,
                code: event.value
            });
        }
    }

    /**
     *This will be use for open activate key dialog
     *
     * @memberof BuyPlanComponent
     */
    public activateDialog(): void {
        this.dialog.open(ActivateDialogComponent, {
            panelClass: 'mat-dialog-md'
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
        this.broadcast?.close();
        this.callBackBroadcast?.close();
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * This hook will be called when payment is initialized
     *
     * @memberof BuyPlanComponent
     */
    public initializePayment(request: any, type: string): void {
        const that = this;
        // On any alert (error) from Razorpay, close all popups and retry
        window.alert = (msg: string) => {
            that.razorpay?.close();
            that.closeWindow(); // close any external window, e.g. PayPal
            that.handleRazorpayFailure(type);
        };
        // Override window.open to detect blocked Popup and trigger retry
        const origWindowOpen = window.open.bind(window);
        window.open = (...args: any[]) => {
            const win = origWindowOpen(...args);
            if (!win) {
                that.handleRazorpayFailure(type);
            }
            return win;
        };
        let options = {
            key: this.razorpayKey,
            handler: function (res) {
                that.updateSubscriptionPayment(res, false, request);
                that.razorpayRetryCount = 0;
            },
            order_id: request.razorpayOrderId,
            theme: {
                color: '#F37254'
            },
            amount: request.dueAmount,
            currency: request.planDetails?.currency?.code || this.activeCompany?.baseCurrency,
            name: this.serviceConfig.BRAND_NAME,
            description: this.serviceConfig.LEGAL_NAME,
        };
        const razorpayRecurringSubscriptionConfig = {
            key: this.razorpayKey,
            order_id: request.razorpayOrderId,
            customer_id: request.razorpayCustomerId,
            recurring: "1",
            handler: (response: any) => {
                that.updateSubscriptionPayment(response, false, request);
                that.razorpayRetryCount = 0;
            },
            theme: {
                "color": "#F37254",
            },
            amount: request.dueAmount,
            currency: request.planDetails?.currency?.code || this.activeCompany?.baseCurrency,
            name: this.serviceConfig.BRAND_NAME,
            description: this.serviceConfig.LEGAL_NAME
        };

        try {
            const isChangePlan = this.isChangePlan ? (
                this.firstStepForm.get('duration')?.value === 'MONTHLY' 
                || this.firstStepForm.get('duration')?.value === 'DAILY')
                : (request?.duration === 'MONTHLY' || request?.duration === 'DAILY');
            this.razorpay = new window['Razorpay']((isChangePlan && request?.region?.code !== 'GBR')
                ? razorpayRecurringSubscriptionConfig : options);
            setTimeout(() => { this.razorpay?.open(); }, 100);
        } catch { }
    }

    /**
     * Handles a Razorpay payment failure: closes popup, retries up to max count.
     *
     * @private
     * @param {*} request
     * @param {string} type
     * @memberof BuyPlanComponent
     */
    private handleRazorpayFailure(type: string): void {
        this.razorpay?.close();
        if (this.razorpayRetryCount < this.maxRazorpayRetryCount) {
            this.razorpayRetryCount++;
            setTimeout(() => {
                if (type === 'generateOrderId') {
                    this.componentStore.generateOrderBySubscriptionId(this.generateOrderIdRequest);
                } else if (type === 'changePlan') {
                    this.componentStore.getChangePlanDetails(this.subscriptionRequest);
                } else {
                    this.componentStore.createSubscription(this.subscriptionRequest);
                }
            }, 3000);
        } else {
            this.toasterService.showSnackBar('error', this.localeData?.razorpay_error_message);
        }
    }

    /**
     * Updates payment in subscription
     *
     * @param {*} payResponse
     * @memberof BuyPlanComponent
     */
    public updateSubscriptionPayment(payResponse: any, zeroAmount: boolean = false, subscription?: any): void {
        let request;
        if (payResponse) {
            request = {
                paymentId: !zeroAmount ? payResponse.razorpay_payment_id : null,
                razorpaySignature: !zeroAmount ? payResponse.razorpay_signature : null,
                amountPaid: !zeroAmount ? this.subscriptionResponse?.dueAmount : 0,
                callNewPlanApi: true,
                duration: subscription?.duration,
                razorpayOrderId: !zeroAmount ? payResponse?.razorpay_order_id : payResponse?.razorpayOrderId,
                subscriptionId: subscription?.subscriptionId,
                planUniqueName: subscription?.planDetails?.uniqueName
            };
            if (request.subscriptionId) {
                this.subscriptionId = request.subscriptionId;
            }
            let data = { ...request, ...this.subscriptionRequest };
            if (request.paymentId && (this.firstStepForm.get('duration')?.value === 'MONTHLY' || this.firstStepForm.get('duration')?.value === 'DAILY') && payResponse?.region?.code !== 'GBR') {
                this.componentStore.saveRazorpayToken({ subscriptionId: this.subscriptionId, paymentId: request.paymentId, orderId: request.razorpayOrderId });
            } else {
                this.componentStore.changePlan(data);
            }
        }
    }

    /**
     * Loads Stripe.js script dynamically
     *
     * @private
     * @returns {Promise<void>}
     * @memberof BuyPlanComponent
     */
    private loadStripeScript(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (window['Stripe']) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://js.stripe.com/v3/';
            script.onload = () => resolve();
            script.onerror = () => {
                this.toasterService.showSnackBar('error', 'Failed to load Stripe payment library');
                reject();
            };
            document.head.appendChild(script);
        });
    }

    /**
     * Initializes Stripe Payment Element with the client secret from API response
     *
     * @param {*} response
     * @memberof BuyPlanComponent
     */
    public initializeStripePayment(response: any): void {
        this.stripeClientSecret = response.clientSecret;
        this.subscriptionResponse = response;
        this.showStripePaymentElement = true;

        if (!this.stripeClientSecret) {
            this.toasterService.showSnackBar('error', 'Invalid Stripe configuration');
            return;
        }

        this.loadStripeScript().then(() => {
            const stripe = window['Stripe'](this.stripeKey);
            this.stripe = stripe;
            const elements = stripe.elements({
                clientSecret: this.stripeClientSecret,
                appearance: { theme: 'stripe' }
            });
            this.stripeElements = elements;
            const paymentElement = elements.create('payment');

            setTimeout(() => {
                if (this.stripePaymentElementRef?.nativeElement) {
                    paymentElement.mount(this.stripePaymentElementRef.nativeElement);
                }
                this.changeDetection.detectChanges();
            }, 100);
        }).catch(() => {
            this.stripePaymentInProgress = false;
            this.changeDetection.detectChanges();
        });
    }

    /**
     * Confirms Stripe payment and handles redirect return
     *
     * @memberof BuyPlanComponent
     */
    public async confirmStripePayment(): Promise<void> {
        if (!this.stripe || !this.stripeElements) {
            return;
        }
        this.stripePaymentInProgress = true;
        this.stripeError = '';
        this.changeDetection.detectChanges();

        const subscriptionId = this.subscriptionResponse?.subscriptionId || this.responseSubscriptionId || this.subscriptionId;
        sessionStorage.setItem('stripe_subscription_id', subscriptionId);
        sessionStorage.setItem('stripe_is_change_plan', String(this.isChangePlan));
        sessionStorage.setItem('stripe_payment_intent_id', this.extractPaymentIntentId(this.stripeClientSecret));
        sessionStorage.setItem('stripe_plan_unique_name', this.subscriptionResponse?.planDetails?.uniqueName || this.firstStepForm.get('planUniqueName')?.value);
        sessionStorage.setItem('stripe_duration', this.subscriptionResponse?.duration || this.firstStepForm.get('duration')?.value);
        sessionStorage.setItem('stripe_amount_paid', String(this.subscriptionResponse?.dueAmount || 0));
        if (this.subscriptionRequest) {
            sessionStorage.setItem('stripe_subscription_request', JSON.stringify(this.subscriptionRequest));
        }

        const returnUrl = window.location.origin + window.location.pathname;
        const { error } = await this.stripe.confirmPayment({
            elements: this.stripeElements,
            confirmParams: { return_url: returnUrl }
        });

        if (error) {
            this.stripePaymentInProgress = false;
            this.stripeError = error.message;
            this.changeDetection.detectChanges();
        }
    }

    /**
     * Handles Stripe redirect return after payment confirmation
     *
     * @private
     * @param {string} piClientSecret
     * @param {string} piId
     * @memberof BuyPlanComponent
     */
    private handleStripeRedirectReturn(piClientSecret: string, piId: string): void {
        this.isLoading = true;
        this.changeDetection.detectChanges();

        this.loadStripeScript().then(() => {
            const stripe = window['Stripe'](this.stripeKey);
            stripe.retrievePaymentIntent(piClientSecret).then(({ paymentIntent, error }: any) => {
                this.isLoading = false;
                if (error || !paymentIntent) {
                    this.toasterService.showSnackBar('error', error?.message || 'Could not retrieve payment status.');
                    this.changeDetection.detectChanges();
                    return;
                }
                if (paymentIntent.status === 'succeeded') {
                    const subscriptionId = sessionStorage.getItem('stripe_subscription_id');
                    if (subscriptionId) {
                        sessionStorage.setItem('stripe_payment_intent_id', piId);
                        this.componentStore.saveStripePayment({ subscriptionId, paymentIntentId: piId });
                    } else {
                        this.toasterService.showSnackBar('error', 'Subscription ID not found.');
                    }
                } else if (['processing', 'requires_action'].includes(paymentIntent.status)) {
                    this.toasterService.showSnackBar('success', 'Payment is processing... status: ' + paymentIntent.status);
                } else {
                    this.toasterService.showSnackBar('error', 'Payment status: ' + paymentIntent.status);
                }
                this.changeDetection.detectChanges();
            });
        });

        // Clean up Stripe query params from URL
        const queryParams = { ...this.route.snapshot.queryParams };
        delete queryParams['payment_intent'];
        delete queryParams['payment_intent_client_secret'];
        this.router.navigate([], { queryParams, replaceUrl: true });
    }

    /**
     * Extracts payment intent ID from client secret
     *
     * @private
     * @param {string} clientSecret
     * @returns {string}
     * @memberof BuyPlanComponent
     */
    private extractPaymentIntentId(clientSecret: string): string {
        return clientSecret?.split('_secret_')[0] || '';
    }

    /**
     * This will be use for get billing details
     *
     *
     * @memberof BuyPlanComponent
     */
    public getBillingDetails(): void {
        this.changeBillingComponentStore.getBillingDetails(null);
    }

    /**
     * This will be use for set form values
     *
     * @param {*} data
     * @memberof BuyPlanComponent
     */
    public setFormValues(data: any): void {
        this.secondStepForm.controls['billingName'].setValue(data.billingName);
        this.secondStepForm.controls['companyName'].setValue(data.companyName);
        this.secondStepForm.controls['email'].setValue(data.email);
        this.secondStepForm.controls['pincode'].setValue(data.pincode);
        this.secondStepForm.controls['taxNumber'].setValue(data.taxNumber);
        this.secondStepForm.controls['mobileNumber'].setValue(data.mobileNumber);
        this.secondStepForm.controls['address'].setValue(data?.address);
        if (data?.country) {
            this.secondStepForm.controls['country'].patchValue({ name: data.country.name, code: data.country.code, additional: data.country });
        }
        if (data?.state) {
            this.secondStepForm.controls['state'].patchValue({ name: data.state.name, code: data.state.code, additional: data.state });
        } else {
            this.secondStepForm.controls['state'].patchValue({ name: data.county.name, code: data.county.code, additional: data.county });
        }

        this.subscriptionForm.markAsPristine();
        this.changeDetection.detectChanges();
    }

    /**
     * Get country flag image url by alpha2country code and if region get by alpha3code
     *
     * @param {string} countryRegionCode
     * @returns {string}
     * @memberof BuyPlanComponent
     */
    public getFlagUrl(countryRegionCode: string): string {
        return this.generalService.getCountryFlagUrl(countryRegionCode) || this.serviceConfig.IMG_PATH + 'exclamation-black.svg';
    }

    /**
   * Callback for translation response complete
   *
   * @param {*} event
   * @memberof BuyPlanComponent
   */
    public translationComplete(event: any): void {
        if (event) {
            this.allPaymentProviders = [
                {
                    label: this.localeData?.gocardless,
                    value: PaymentProvider.GOCARDLESS
                },
                {
                    label: this.localeData?.paypal,
                    value: PaymentProvider.PAYPAL
                },
                {
                    label: this.localeData?.payu,
                    value: PaymentProvider.PAYU
                },
                {
                    label: this.localeData?.razorpay,
                    value: PaymentProvider.RAZORPAY,
                },
                {
                    label: this.localeData?.stripe,
                    value: PaymentProvider.STRIPE
                }
            ];
            this.changeDetection.detectChanges();
        }
    }

    /**
     * Open PayU HTML in new window and listen for PayU response
     * then update subscription
     *
     * @param {string} html - PayU HTML
     */
    private openPayUPayment(html: string): void {
        // Open PayU HTML in new window
        const blob = new Blob([html], { type: 'text/html' });
        this.openWindow(URL.createObjectURL(blob));

        // Listen for PayU response from new window
        const handlePayUMessage = (event: MessageEvent<{
            status: string;
            transactionId: string;
            provider: string;
        }>) => {
            if (event.data?.status?.toLocaleLowerCase() === 'success' && event.data.transactionId) {
                const model = {
                    payuTransactionId: event.data.transactionId,
                    paymentProvider: event.data.provider,
                    subscriptionId: this.subscriptionId,
                    duration: this.firstStepForm.get('duration')?.value
                };
                this.componentStore.changePlan(model);

                // remove listener
                window.removeEventListener("message", handlePayUMessage);
            } else if (event.data?.status?.toLocaleLowerCase() === 'failed') {
                // remove listener
                window.removeEventListener("message", handlePayUMessage);
            }
        };
        window.addEventListener("message", handlePayUMessage);
    }

    /**
     * Navigate to new company page with billing form data as query parameters
     *
     * @param {string} subscriptionId - Subscription ID
     * @memberof BuyPlanComponent
     */ 
    private navigateToNewCompany(subscriptionId: string): void {
        const billingForm = this.secondStepForm.value;
        delete billingForm.billingName;

        billingForm.country = billingForm.country?.value;
        billingForm.state = billingForm.state?.value;
        const queryParams: any = {};

        Object.keys(billingForm).forEach(key => {
            if (billingForm[key] !== null && billingForm[key] !== undefined && billingForm[key] !== '') {
                queryParams[key] = billingForm[key];
            }
        });

        this.navigateToRoute(`/pages/new-company/${subscriptionId}`, queryParams);
    }
}
