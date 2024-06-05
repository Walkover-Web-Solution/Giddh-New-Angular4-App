import { ViewSubscriptionComponentStore } from './../view-subscription/utility/view-subscription.store';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
import { ChangeBillingComponentStore } from '../change-billing/utility/change-billing.store';
import { SubscriptionComponentStore } from '../utility/subscription.store';
import { GeneralService } from '../../services/general.service';
import { MatSelect } from '@angular/material/select';
import { gulfCountriesCode, regionCountriesCode } from '../../shared/helpers/countryWithCodes';

@Component({
    selector: 'buy-plan',
    templateUrl: './buy-plan.component.html',
    styleUrls: ['./buy-plan.component.scss'],
    providers: [BuyPlanComponentStore, ChangeBillingComponentStore, ViewSubscriptionComponentStore, SubscriptionComponentStore]
})

export class BuyPlanComponent implements OnInit, OnDestroy {
    /** Stepper Form instance */
    @ViewChild('stepper') stepperIcon: any;
    /** This will use for table content scroll in mobile */
    @ViewChild('tableContent', { read: ElementRef }) public tableContent: ElementRef<any>;
    /** Holds Country list Mat Trigger Reference  */
    @ViewChild('countryList', { static: false }) public countryList: MatSelect;
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
    /** Holds Store Change plan API response state as observable*/
    public updatePlanSuccess$ = this.componentStore.select(state => state.updatePlanSuccess);
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
    public updateSubscriptionPaymentIsSuccess$ = this.componentStore.select(state => state.updateSubscriptionPaymentIsSuccess);
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
    public getBillingDetails$ = this.changeBillingComponentStore.select(state => state.getBillingDetails);
    /** True if it have billing details */
    public getBillingData: boolean = false;
    /** Holds Store Get Billing Details observable*/
    public changePlanDetails$ = this.componentStore.select(state => state.changePlanDetails);
    /** Holds Store Get Country list observable*/
    public getCountryList$ = this.componentStore.select(state => state.countryList);
    /** Holds subscription request */
    public subscriptionRequest: any;
    /** Holds View Subscription list observable*/
    public viewSubscriptionData$ = this.viewSubscriptionComponentStore.select(state => state.viewSubscription);
    /** Hold pay type*/
    public payType: string = '';
    /** Holds Store Buy Plan Success observable*/
    public buyPlanSuccess$ = this.subscriptionComponentStore.select(state => state.buyPlanSuccess);
    /** This will use for open window */
    private openedWindow: Window | null = null;
    /** Holds Store Plan list API success state as observable*/
    public subscriptionRazorpayOrderDetails$ = this.componentStore.select(state => state.subscriptionRazorpayOrderDetails);
    /** True if it is subscription region */
    public isSubscriptionRegion: boolean = false;

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
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        private elementRef: ElementRef,
        private viewSubscriptionComponentStore: ViewSubscriptionComponentStore,
        private generalService: GeneralService
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
        this.getCountry();
        this.getAllPlans();
        this.getStates();
        this.getCompanyProfile();
        this.getOnboardingFormData();
        this.getActiveCompany();

        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe((params: any) => {
            if (params?.id) {
                this.subscriptionId = params.id;
                this.viewSubscriptionComponentStore.viewSubscriptionsById(this.subscriptionId);
                this.isChangePlan = true;
            }
        });

        this.buyPlanSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.redirectLink) {
                this.openWindow(response.redirectLink);
            } else if (response?.subscriptionId) {
                this.router.navigate(['/pages/new-company/' + response.subscriptionId]);
            }
        });

        this.createSubscriptionResponse$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.responseSubscriptionId = response.subscriptionId;
                // if (response.duration === "YEARLY") {
                //     this.isLoading = true;
                //     this.subscriptionResponse = response;
                //     this.initializePayment(response);
                // } else {
                //     this.openCashfreeDialog(response?.redirectLink);
                // }
                this.subscriptionId = response.subscriptionId;
                if (this.isChangePlan) {
                    this.router.navigate(['/pages/subscription']);
                } else {
                    if (this.payType === 'trial') {
                        this.router.navigate(['/pages/new-company/' + response.subscriptionId]);
                    } else {
                        if (response?.region?.code === 'GBR') {
                            let model = {
                                planUniqueName: response?.planDetails?.uniqueName,
                                paymentProvider: "GOCARDLESS",
                                subscriptionId: response.subscriptionId,
                                duration: response?.duration
                            };
                            if (response?.status?.toLowerCase() === 'active') {
                                this.router.navigate(['/pages/new-company/' + response?.subscriptionId]);
                            } else {
                                this.subscriptionComponentStore.buyPlanByGoCardless(model);
                            }
                        } else {
                            this.componentStore.generateOrderBySubscriptionId(response?.subscriptionId);
                        }
                    }
                };
            }
        });

        this.subscriptionRazorpayOrderDetails$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                if (response.dueAmount > 0) {
                    this.initializePayment(response);
                } else {
                    if (this.isChangePlan) {
                        this.router.navigate(['/pages/subscription']);
                    } else {
                        this.router.navigate(['/pages/new-company/' + this.responseSubscriptionId]);
                    };
                }
            }
        });

        this.updatePlanSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.responseSubscriptionId = response.subscriptionId;
                // if (response.duration === "YEARLY") {
                //     this.isLoading = true;
                //     this.subscriptionResponse = response;
                //     this.initializePayment(response);
                // } else {
                //     this.openCashfreeDialog(response?.redirectLink);
                // }
                if (this.isChangePlan) {
                    this.router.navigate(['/pages/subscription']);
                } else {
                    this.router.navigate(['/pages/new-company/' + this.responseSubscriptionId]);
                };
            }
        });


        this.updateSubscriptionPaymentIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isLoading = false;
                if (this.isChangePlan) {
                    this.router.navigate(['/pages/subscription']);
                } else {
                    this.router.navigate(['/pages/new-company/' + this.subscriptionId]);
                };
            }
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
                if (!this.isSubscriptionRegion) {
                    if (this.countrySource?.length) {
                        this.currentCountry.patchValue(this.countrySource.find(country => country.label === this.newUserSelectedCountry));
                    }
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
            } else {
                let countryRequest = new CountryRequest();
                countryRequest.formName = 'onboarding';
                this.store.dispatch(this.commonActions.GetCountry(countryRequest));
            }
        });


        this.session$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.isNewUserLoggedIn = response === userLoginStateEnum.newUserLoggedIn;
            if (!this.isNewUserLoggedIn) {
                this.getBillingDetails();
                this.getBillingDetails$.pipe(takeUntil(this.destroyed$)).subscribe(data => {
                    if (data && data?.uniqueName) {
                        this.getBillingData = true;
                        this.setFormValues(data);
                        this.selectedCountry = data.country?.name;
                        this.selectedState = data?.state ? data.state?.name : data.county?.name;
                    }
                });
            }
        });

        window.addEventListener('message', event => {
            if ((this.router.url === '/pages/subscription/buy-plan/' + this.subscriptionId || this.router.url === '/pages/subscription/buy-plan') && event?.data && typeof event?.data === "string" && event?.data === "GOCARDLESS") {
                if (this.isChangePlan) {
                    this.router.navigate(['/pages/subscription']);
                } else {
                    this.router.navigate(['/pages/new-company/' + this.subscriptionId]);
                }
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

        this.changePlanDetails$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.dueAmount > 0) {
                if (response?.region?.code === 'GBR') {
                    let model = {
                        planUniqueName: response?.planDetails?.uniqueName,
                        paymentProvider: "GOCARDLESS",
                        subscriptionId: response.subscriptionId,
                        duration: response?.duration
                    };
                    this.subscriptionComponentStore.buyPlanByGoCardless(model);
                } else {
                    this.initializePayment(response);
                }
            } else {
                if (response?.region?.code === 'GBR') {
                    this.toasterService.showSnackBar("success", this.localeData?.plan_purchased_success_message);
                    this.router.navigate(['/pages/subscription']);
                } else {
                    this.updateSubscriptionPayment(response, true);
                }
            }
        });
        this.viewSubscriptionData$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
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
                this.setUserCountry();
            }
        });

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
                    const { alpha3CountryCode, alpha2CountryCode, countryName } = this.determineCountryCodes(result);
                    const isRegionCode = this.isRegionCountryCode(alpha3CountryCode);
                    this.newUserSelectCountry({
                        label: `${!isRegionCode ? alpha3CountryCode : alpha2CountryCode} - ${countryName}`,
                        value: !isRegionCode ? alpha3CountryCode : alpha2CountryCode,
                        additional: {
                            value: !isRegionCode ? alpha3CountryCode : alpha2CountryCode,
                            label: `${!isRegionCode ? alpha3CountryCode : alpha2CountryCode}  - ${countryName}`,
                            alpha2CountryCode: alpha2CountryCode,
                            alpha3CountryCode: alpha3CountryCode
                        }
                    });
                } else {
                    this.newUserSelectCountry({
                        "label": "GLB - Global",
                        "value": "GLB",
                        "additional": {
                            "value": "GLB",
                            "label": "GLB - Global",
                            "alpha3CountryCode": "GLB"
                        }
                    });
                }
            });
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
    private determineCountryCodes(result: any): { alpha3CountryCode: string, alpha2CountryCode: string, countryName: string } {
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

        return { alpha3CountryCode, alpha2CountryCode, countryName };
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
            this.setPlans();
        }
    }

    /**
   * This will be open window by url
   *
   * @param {string} url
   * @memberof BuyPlanComponent
   */
    public openWindow(url: string): void {
        const width = 700;
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
            } else {
                request = {
                    promoCode: "",
                    planUniqueName: this.firstStepForm.get('planUniqueName')?.value,
                    duration: this.firstStepForm.get('duration')?.value
                }
                this.firstStepForm.get('promoCode')?.setValue("");
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
    public initIntl(inputValue?: string): void {
        let times = 0;
        const parentDom = this.elementRef?.nativeElement;
        const input = document.getElementById('init-contact');
        const interval = setInterval(() => {
            times += 1;
            if (input) {
                clearInterval(interval);
                this.intlClass = new IntlPhoneLib(
                    input,
                    parentDom,
                    false
                );
                if (inputValue) {
                    input.setAttribute('value', `+${inputValue}`);
                    this.changeDetection.detectChanges();
                }
            }
            if (times > 25) {
                clearInterval(interval);
            }
        }, 50);
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

                if (this.selectedPlan?.currency?.code?.toLowerCase() === 'inr' && this.secondStepForm?.get('country')?.value?.value?.toLowerCase() === 'in') {
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
        if (!this.intlClass) {
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
            if (response?.length) {
                this.monthlyPlans = response?.filter(plan => plan?.monthlyAmount !== null && plan?.monthlyAmount >= 0);
                this.yearlyPlans = response?.filter(plan => plan?.yearlyAmount !== null && plan?.yearlyAmount >= 0);
                this.monthlyPlans = this.monthlyPlans.sort((a, b) => a.monthlyAmount - b.monthlyAmount);
                this.yearlyPlans = this.yearlyPlans.sort((a, b) => a.yearlyAmount - b.yearlyAmount);
                if (this.yearlyPlans?.length) {
                    this.firstStepForm.get('duration').setValue('YEARLY');
                } else {
                    this.firstStepForm.get('duration').setValue('MONTHLY');
                }
                this.setPlans();
            } else {
                this.inputData = [];
                setTimeout(() => {
                    this.countryList?.open();
                }, 100);
            }
        });
    }

    /**
     * This will be use for set plan details
     *
     * @private
     * @memberof BuyPlanComponent
     */
    private setPlans(): void {
        this.inputData = [];
        const filteredPlans = this.firstStepForm.get('duration').value === 'YEARLY' ? this.yearlyPlans : this.monthlyPlans;
        this.selectedPlan = filteredPlans?.length === 1 ? filteredPlans[0] : filteredPlans[1];
        this.popularPlan = filteredPlans?.length === 1 ? filteredPlans[0] : filteredPlans[1];

        this.firstStepForm.get('planUniqueName').setValue(this.selectedPlan?.uniqueName);

        filteredPlans?.forEach(plan => {
            this.inputData.push(plan);
        });

        this.setFinalAmount();
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
                    if (this.selectedPlan?.currency?.code?.toLowerCase() === 'inr' && this.secondStepForm?.get('country')?.value?.value?.toLowerCase() === 'in') {
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
     * This will be use for new user select country
     *
     * @param {*} event
     * @memberof BuyPlanComponent
     */
    public newUserSelectCountry(event: any): void {
        if (event?.value) {
            this.componentStore.getAllPlans({ params: { regionCode: event?.value } });
            this.newUserSelectedCountry = event.label;
            setTimeout(() => {
                if (this.isSubscriptionRegion) {
                    this.currentCountry.patchValue(this.countrySource.find(country => country.label === this.newUserSelectedCountry));
                }
            }, 200);
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

            if (this.selectedPlan?.currency?.code?.toLowerCase() === 'inr' && event?.value.toLowerCase() === 'in') {
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
    public onSubmit(type: string): void {
        this.payType = type;
        this.isFormSubmitted = false;
        if (this.subscriptionForm.invalid) {
            this.isFormSubmitted = true;
            return;
        }
        let mobileNumber = this.subscriptionForm.value.secondStepForm.mobileNumber?.replace(/\+/g, '');
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
                mobileNumber: mobileNumber,
                country: {
                    name: this.subscriptionForm.value.secondStepForm.country.label ? this.subscriptionForm.value.secondStepForm.country.label : this.subscriptionForm.value.secondStepForm.country.name,
                    code: this.subscriptionForm.value.secondStepForm.country.value ? this.subscriptionForm.value.secondStepForm.country.value : this.subscriptionForm.value.secondStepForm.country.code
                },
                address: this.subscriptionForm.value.secondStepForm.address
            },
            promoCode: this.subscriptionForm.value.firstStepForm.promoCode ? this.subscriptionForm.value.firstStepForm.promoCode : null,
            paymentProvider: this.selectedPlan?.entityCode === 'GBR' ? 'GOCARDLESS' : 'RAZORPAY',
            subscriptionId: null
        }

        if (this.subscriptionForm.value.secondStepForm.country.value === 'GB') {
            request.billingAccount['county'] = {
                name: this.subscriptionForm.value.secondStepForm.state.label ? this.subscriptionForm.value.secondStepForm.state.label : this.subscriptionForm.value.secondStepForm.state.name,
                code: this.subscriptionForm.value.secondStepForm.state.value ? this.subscriptionForm.value.secondStepForm.state.value : this.subscriptionForm.value.secondStepForm.state.code
            };
        } else {
            request.billingAccount['state'] = {
                name: this.subscriptionForm.value.secondStepForm.state.label ? this.subscriptionForm.value.secondStepForm.state.label : this.subscriptionForm.value.secondStepForm.state.name,
                code: this.subscriptionForm.value.secondStepForm.state.value ? this.subscriptionForm.value.secondStepForm.state.value : this.subscriptionForm.value.secondStepForm.state.code
            };
        }
        request['payNow'] = (type === 'trial') ? false : true;
        if (this.isChangePlan) {
            request.subscriptionId = this.subscriptionId;
            this.subscriptionRequest = request;
            this.componentStore.getChangePlanDetails(request);
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
                that.updateSubscriptionPayment(res, false, request);
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
            this.subscriptionId = subscription?.subscriptionId;
            let data = { ...request, ...this.subscriptionRequest };
            this.componentStore.changePlan(data);
        }
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
        this.selectCountry({ label: data.country.name, value: data.country.code, additional: data.country });
        if (data?.state) {
            this.selectState({ label: data.state.name, value: data.state.code, additional: data.state });
        } else {
            this.selectState({ label: data.county.name, value: data.county.code, additional: data.county });
        }
        this.secondStepForm.controls['address'].setValue(data?.address);
        this.initIntl(this.secondStepForm.get('mobileNumber')?.value);
    }

    /**
     * Get country flag image url by alpha2country code and if region get by alpha3code
     *
     * @param {string} countryRegionCode
     * @returns {string}
     * @memberof BuyPlanComponent
     */
    public getFlagUrl(countryRegionCode: string): string {
        return this.generalService.getCountryFlagUrl(countryRegionCode);
    }
}
