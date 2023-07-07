import { HttpClient } from "@angular/common/http";
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { Observable, of, ReplaySubject } from "rxjs";
import { debounceTime, distinctUntilChanged, take, takeUntil } from "rxjs/operators";
import { CommonActions } from "../actions/common.actions";
import { CompanyActions } from "../actions/company.actions";
import { GeneralActions } from "../actions/general/general.actions";
import { LoginActions } from "../actions/login.action";
import { MOBILE_NUMBER_UTIL_URL, MOBILE_NUMBER_SELF_URL, MOBILE_NUMBER_IP_ADDRESS_URL, MOBILE_NUMBER_ADDRESS_JSON_URL } from '../app.constant';
import { isEqual } from "../lodash-optimized";
import { CountryRequest, OnboardingFormRequest } from "../models/api-models/Common";
import { Addresses, CompanyCreateRequest, CompanyResponse, CreateCompanyUsersPlan, SocketNewCompanyRequest, StatesRequest, SubscriptionRequest } from "../models/api-models/Company";
import { UserDetails } from "../models/api-models/loginModels";
import { userLoginStateEnum } from "../models/user-login-state";
import { CompanyService } from "../services/company.service";
import { GeneralService } from "../services/general.service";
import { ToasterService } from "../services/toaster.service";
import { AppState } from "../store";
import { ItemOnBoardingState } from "../store/item-on-boarding/item-on-boarding.reducer";
import { IOption } from "../theme/ng-select/option.interface";

@Component({
    selector: 'add-company',
    templateUrl: './add-company.component.html',
    styleUrls: ['./add-company.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AddCompanyComponent implements OnInit, AfterViewInit {
    @ViewChild('stepper') stepperIcon: any;
    /** Mobile Number state instance */
    @ViewChild('mobileNo', { static: false }) mobileNo: ElementRef;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** This will hold mobile number field input  */
    public intl: any;
    /** This will hold isMobileNumberInvalid */
    public isMobileNumberInvalid: boolean = false;
    /** Form Group for company form */
    public companyForm: FormGroup;
    /** Form Group for company form */
    public firstStepForm: FormGroup;
    /** Form Group for company address form */
    public secondStepForm: FormGroup;
    /* This will hold if it'response production env or not */
    public isProdMode: boolean = false;
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** Subject to unsubscribe from listeners */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if form is submitted to show error if available */
    public isFormSubmitted: boolean = false;
    /** True if translations loaded */
    public translationLoaded: boolean = false;
    /** This will hold company create object  */
    public company: CompanyCreateRequest = {
        name: '',
        country: '',
        phoneCode: '',
        contactNo: '',
        uniqueName: '',
        isBranch: false,
        subscriptionRequest: {
            planUniqueName: '',
            subscriptionId: '',
            userUniqueName: '',
            licenceKey: ''
        },
        addresses: [],
        pincode:'',
        businessNature: '',
        businessType: '',
        address: '',
        industry: '',
        baseCurrency: '',
        isMultipleCurrency: false,
        city: '',
        email: '',
        taxes: [],
        userBillingDetails: {
            name: '',
            email: '',
            contactNo: '',
            gstin: '',
            stateCode: '',
            address: '',
            autorenew: ''
        },
        nameAlias: '',
        paymentId: '',
        amountPaid: '',
        razorpaySignature: ''
    };
    /** Data for query params */
    public socketCompanyRequest: SocketNewCompanyRequest = new SocketNewCompanyRequest();
    /** Observable to company response */
    public companies$: Observable<CompanyResponse[]>;
    /** Hold countries list */
    public countries: IOption[] = [];
    /** Hold currencies list */
    public currencies: IOption[] = [];
    /** Hold taxes list */
    public taxesList: any = [];
    /** Hold current taxes list */
    public currentTaxList: any[] = [];
    /** Hold business type list */
    public businessTypeList: IOption[] = [{ label: "Registered", value: "Registered" }, { label: "Unregistered", value: "Unregistered" }];
    /** Hold business type for other country list */
    public businessTypeOtherCountryOptions: IOption[] = [{ label: "Unregistered", value: "Unregistered" }];
    /** Hold business nature list */
    public businessNatureList: IOption[] = [{ label: "Food", value: "Food" }, { label: "Service", value: "Service" }, { label: "Manufacturing", value: "Manufacturing" }, { label: "Retail", value: "Retail" }];
    /** True, if on boarding is going on */
    public isOnBoardingInProgress: boolean;
    /** Stores the item on boarding store data */
    public itemOnBoardingDetails: ItemOnBoardingState;
    /** Hold state gst code list */
    public stateGstCode: any[] = [];
    /** Hold states list */
    public states: IOption[] = [];
    /** True if gstin number valid */
    public isGstinValid: boolean = false;
    /** Hold selected state */
    public selectedState: string = '';
    /** Hold selected state */
    public selectedStateCode: string = '';
    /** Hold form fields from forms api */
    public formFields: any[] = [];
    /** Hold active company */
    public activeCompany: any;
    /** Hold subscription request form */
    public subscriptionRequestObj: SubscriptionRequest = {
        planUniqueName: '',
        subscriptionId: '',
        userUniqueName: '',
        licenceKey: ''
    };
    /** Hold subscription plan*/
    public subscriptionPlan: CreateCompanyUsersPlan = {
        companies: null,
        totalCompanies: 0,
        userDetails: null,
        additionalTransactions: 0,
        createdAt: null,
        planDetails: {
            countries: [],
            name: "",
            uniqueName: "",
            createdAt: "",
            amount: 0,
            ratePerExtraTransaction: 0,
            isCommonPlan: true,
            duration: 0,
            companiesLimit: 0,
            durationUnit: "",
            transactionLimit: 0
        },
        additionalCharges: null,
        status: null,
        subscriptionId: null,
        balance: null,
        expiry: null,
        startedAt: null,
        companiesWithTransactions: null,
        companyTotalTransactions: null,
        totalTransactions: 0
    };
    /** Hold address form */
    public addressesObj: Addresses = {
        stateCode: '',
        address: '',
        isDefault: false,
        stateName: '',
        taxNumber: '',
        pincode: ''
    };
    /** Hold logged user */
    public loggedInUser: UserDetails;
    /** Observable to create company process */
    public isCompanyCreationInProcess$: Observable<boolean>;
    /** Observable to company created */
    public isCompanyCreated$: Observable<boolean>;
    /** True if new user create company */
    public isNewUser: boolean = false;
    /** True if other country selected */
    public isOtherCountry: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private toaster: ToasterService,
        private http: HttpClient,
        private store: Store<AppState>,
        private generalService: GeneralService,
        private commonActions: CommonActions,
        private companyService: CompanyService,
        private changeDetection: ChangeDetectorRef,
        private generalActions: GeneralActions,
        private companyActions: CompanyActions,
        private route: Router,
        private loginAction: LoginActions
    ) { }

    /**
     * On init component hook
     *
     * @memberof AddCompanyComponent
     */
    public ngOnInit(): void {
        this.initCompanyForm();
        this.isProdMode = PRODUCTION_ENV;
        this.getCountry();
        this.loggedInUser = this.generalService.user;
        this.subscriptionRequestObj.userUniqueName = (this.loggedInUser) ? this.loggedInUser.uniqueName : "";
        this.companies$ = this.store.pipe(select(response => response.session.companies), takeUntil(this.destroyed$));
        this.isCompanyCreationInProcess$ = this.store.pipe(select(response => response.session.isCompanyCreationInProcess), takeUntil(this.destroyed$));
        this.isCompanyCreated$ = this.store.pipe(select(response => response.session.isCompanyCreated), takeUntil(this.destroyed$));
        this.store.pipe(select(response => response.common.onboardingform), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                if (response.fields) {
                    Object.keys(response.fields).forEach(key => {
                        if (response.fields[key]) {
                            this.formFields[response.fields[key].name] = [];
                            this.formFields[response.fields[key].name] = response.fields[key];
                        }
                    });
                    this.changeDetection.detectChanges();
                }
                if (response.applicableTaxes) {
                    this.taxesList = [];
                    Object.keys(response.applicableTaxes).forEach(key => {
                        if (response.applicableTaxes[key]) {
                            this.taxesList.push({
                                label: response.applicableTaxes[key]?.name,
                                value: response.applicableTaxes[key]?.uniqueName,
                                isSelected: false
                            });
                            this.currentTaxList[response.applicableTaxes[key]?.uniqueName] = [];
                            this.currentTaxList[response.applicableTaxes[key]?.uniqueName] = response.applicableTaxes[key];
                        }
                    });
                    this.changeDetection.detectChanges();
                }
            }
        });
        this.secondStepForm.valueChanges.pipe(debounceTime(700), distinctUntilChanged(isEqual)).subscribe(data => {
            this.isGstinValid = false;
            if (data?.gstin) {
                if (this.formFields['taxName']['regex'] !== "" && this.formFields['taxName']['regex']?.length > 0) {
                    for (let key = 0; key < this.formFields['taxName']['regex']?.length; key++) {
                        let regex = new RegExp(this.formFields['taxName']['regex'][key]);
                        if (regex.test(data?.gstin)) {
                            this.isGstinValid = true;
                        }
                    }
                } else {
                    this.isGstinValid = true;
                }
                if (!this.isGstinValid) {
                    let text = 'Invalid [TAX_NAME]';
                    text = text?.replace("[TAX_NAME]", this.formFields['taxName'].label);
                    this.toaster.errorToast(text);
                    this.isGstinValid = true;
                    this.selectedState = '';
                } else {
                    this.isGstinValid = false;
                }
            } else {
                this.isGstinValid = false;
            }
            this.isGstinValid = false;
            if (!data.gstin) {
                this.selectedState = '';
            } else {
                this.states.find((state) => {
                    let code = data?.gstin.substr(0, 2);
                    if (state.stateGstCode == code) {
                        this.isGstinValid = true;
                        this.selectedState = state.label;
                        this.selectedStateCode = state.value;
                        this.secondStepForm.controls['state'].setValue({ label: state?.label, value: state?.value });
                        this.changeDetection.detectChanges();
                        return true;
                    }
                });
            }
        });
        this.changeDetection.detectChanges();
    }

    /**
    * Initializing the group form
    *
    * @private
    * @memberof CreateUpdateGroupComponent
    */
    private initCompanyForm(): void {
        this.firstStepForm = this.formBuilder.group({
            name: ['', Validators.required],
            country: ['', Validators.required],
            currency: ['', Validators.required],
            mobile: ['', Validators.required]
        });
        this.secondStepForm = this.formBuilder.group({
            businessType: [''],
            businessNature: [''],
            gstin: ['', (this.secondStepForm?.controls['businessType']?.value === this.localeData?.registered) ? Validators.required : undefined],
            state: ['', (this.secondStepForm?.controls['businessType']?.value === this.localeData?.registered) ? Validators.required : undefined],
            taxes: null,
            pincode: [''],
            address: ['',Validators.required]
        });
        this.companyForm = this.formBuilder.group({
            firstStepForm: this.firstStepForm,
            secondStepForm: this.secondStepForm
        });
    }

    /**
     * This will called after component initialization
     *
     * @memberof AddCompanyComponent
     */
    public ngAfterViewInit(): void {
        this.stepperIcon._getIndicatorType = () => 'number';
        let interval = setInterval(() => {
            if (this.mobileNo) {
                setTimeout(() => {
                    this.onlyPhoneNumber();
                }, 100);
                clearInterval(interval);
            }
        }, 500);
    }

 /**
 * This will return enter tax text
 *
 * @returns {string}
 * @memberof AddCompanyComponent
 */
    public getEnterTaxText(): string {
        let text = this.localeData?.enter_tax;
        text = text?.replace("[TAX_NAME]", this.formFields['taxName']?.label);
        return text;
    }

    /**
     * This will use for get states list
     *
     * @memberof AddCompanyComponent
     */
    public getStates() {
        this.store.pipe(select(state => state.general.states), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.states = [];
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
        });
    }

    /**
     * Get countries list
     *
     * @memberof AddCompanyComponent
     */
    public getCountry(): void {
        this.store.pipe(select(response => response.common.countries), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                Object.keys(response).forEach(key => {
                    this.countries.push({
                        value: response[key].alpha2CountryCode,
                        label: response[key].alpha2CountryCode + ' - ' + response[key].countryName,
                        additional: response[key]
                    });
                });
                this.getStates();
                this.getCurrency();
            } else {
                let countryRequest = new CountryRequest();
                countryRequest.formName = 'onboarding';
                this.store.dispatch(this.commonActions.GetCountry(countryRequest));
            }
        });
    }

    /**
     * Get currencies list
     *
     * @memberof AddCompanyComponent
     */
    public getCurrency(): void {
        this.store.pipe(select(state => state.session.currencies), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                Object.keys(response).forEach(key => {
                    this.currencies.push({ label: response[key].code, value: response[key].code });
                });
            }
        });
    }

    /**
     *This will use for select currency
     *
     * @param {*} event
     * @memberof AddCompanyComponent
     */
    public selectCurrency(event: any): void {
        if (event) {
            this.firstStepForm.controls['currency'].setValue({ label: event?.label, value: event?.value });
            this.changeDetection.detectChanges();
        }
    }

    /**
     * This will use for select country
     *
     * @param {*} event
     * @memberof AddCompanyComponent
     */
    public selectCountry(event: any): void {
        if (event && event.value) {
            if (event.value !== 'IN') {
                this.isOtherCountry = true;
                this.secondStepForm.controls['businessType'].setValue('Unregistered');
            } else {
                this.isOtherCountry = false;
            }
            this.firstStepForm.controls['country'].setValue(event);
            this.firstStepForm.controls['currency'].setValue({ label: event?.additional?.currency?.code, value: event?.additional?.currency?.code });
            this.intl?.setCountry(event.value?.toLowerCase());
            this.changeDetection.detectChanges();

            let onboardingFormRequest = new OnboardingFormRequest();
            if (this.isOnBoardingInProgress && this.itemOnBoardingDetails) {
                onboardingFormRequest.formName = this.itemOnBoardingDetails.onBoardingType?.toLowerCase();
            } else {
                onboardingFormRequest.formName = 'onboarding';
            }
            onboardingFormRequest.country = event.value;
            this.store.dispatch(this.commonActions.GetOnboardingForm(onboardingFormRequest));

            let statesRequest = new StatesRequest();
            statesRequest.country = event.value;
            this.store.dispatch(this.generalActions.getAllState(statesRequest));
        }
        this.changeDetection.detectChanges();
    }

    /**
     * This will use for mobile number
     *
     * @memberof AddCompanyComponent
     */
    public onlyPhoneNumber(): void {
        let input = document.getElementById('init-contact-proforma');
        const errorMsg = document.querySelector("#init-contact-proforma-error-msg");
        const validMsg = document.querySelector("#init-contact-proforma-valid-msg");
        let errorMap = [this.localeData?.invalid_contact_number, this.commonLocaleData?.app_invalid_country_code, this.commonLocaleData?.app_invalid_contact_too_short, this.commonLocaleData?.app_invalid_contact_too_long, this.localeData?.invalid_contact_number];
        const intlTelInput = !isElectron ? window['intlTelInput'] : window['intlTelInputGlobals']['electron'];
        if (intlTelInput && input) {
            this.intl = intlTelInput(input, {
                nationalMode: true,
                utilsScript: MOBILE_NUMBER_UTIL_URL,
                autoHideDialCode: false,
                separateDialCode: false,
                initialCountry: 'auto',
                geoIpLookup: (success, failure) => {
                    let countryCode = 'in';
                    const fetchIPApi = this.http.get<any>(MOBILE_NUMBER_SELF_URL);
                    fetchIPApi.subscribe(
                        (response) => {
                            if (response?.ipAddress) {
                                const fetchCountryByIpApi = this.http.get<any>(MOBILE_NUMBER_IP_ADDRESS_URL + `${response.ipAddress}`);
                                fetchCountryByIpApi.subscribe(
                                    (fetchCountryByIpApiRes) => {
                                        if (fetchCountryByIpApiRes?.countryCode) {
                                            return success(fetchCountryByIpApiRes.countryCode);
                                        } else {
                                            return success(countryCode);
                                        }
                                    },
                                    (fetchCountryByIpApiErr) => {
                                        const fetchCountryByIpInfoApi = this.http.get<any>(MOBILE_NUMBER_ADDRESS_JSON_URL + `${response?.ipAddress}`);

                                        fetchCountryByIpInfoApi.subscribe(
                                            (fetchCountryByIpInfoApiRes) => {
                                                if (fetchCountryByIpInfoApiRes?.country) {
                                                    return success(fetchCountryByIpInfoApiRes.country);
                                                } else {
                                                    return success(countryCode);
                                                }
                                            },
                                            (fetchCountryByIpInfoApiErr) => {
                                                return success(countryCode);
                                            }
                                        );
                                    }
                                );
                            } else {
                                return success(countryCode);
                            }
                        },
                        (err) => {
                            return success(countryCode);
                        }
                    );
                },
            });
            let reset = () => {
                input?.classList?.remove("error");
                if (errorMsg && validMsg) {
                    errorMsg.innerHTML = "";
                    errorMsg.classList.add("d-none");
                    validMsg.classList.add("d-none");
                }
            };
            input.addEventListener('blur', () => {
                let phoneNumber = this.intl?.getNumber();
                reset();
                if (input) {
                    if (phoneNumber?.length) {
                        if (this.intl?.isValidNumber()) {
                            validMsg?.classList?.remove("d-none");
                            this.isMobileNumberInvalid = false;
                        } else {
                            input?.classList?.add("error");
                            this.isMobileNumberInvalid = true;
                            let errorCode = this.intl?.getValidationError();
                            if (errorMsg && errorMap[errorCode]) {
                                this.toaster.errorToast(this.localeData?.invalid_contact_number);
                                errorMsg.innerHTML = errorMap[errorCode];
                                errorMsg.classList.remove("d-none");
                            }
                        }
                    } else {
                        this.isMobileNumberInvalid = false;
                    }
                }
            });
        }
        this.changeDetection.detectChanges();
    }

    /**
     * This will use for next step form
     *
     * @return {*}  {void}
     * @memberof AddCompanyComponent
     */
    public nextStepForm(): void {
        this.isFormSubmitted = false;
        if (this.firstStepForm.invalid || this.isMobileNumberInvalid) {
            this.isFormSubmitted = true;
            return;
        }
        let companies = null;
        this.company.name = this.firstStepForm.controls['name'].value;
        this.company.country = this.firstStepForm.controls['country'].value.value;
        this.company.baseCurrency = this.firstStepForm.controls['currency'].value.value;
        this.companies$.pipe(takeUntil(this.destroyed$)).subscribe(company => companies = company);
        this.company.uniqueName = this.getRandomString(this.company.name, this.company.country);
        this.generalService.createNewCompany = this.company;
        if (this.isProdMode && companies) {
            if (companies?.length === 0) {
                this.sendNewUserInfo();
                this.fireSocketCompanyCreateRequest();
            }
        }
    }

    /**
     * Get random string for company
     *
     * @private
     * @param {string} companyName
     * @param {string} city
     * @return {*}
     * @memberof AddCompanyComponent
     */
    private getRandomString(companyName: string, city: string) {
        let date, dateString, randomGenerate, strings;
        if (companyName) {
            companyName = this.removeSpecialCharacters(companyName);
            city = this.removeSpecialCharacters(city);
            date = new Date();
            dateString = date.getTime()?.toString();
            randomGenerate = this.getSixCharRandom();
            strings = [companyName, city, dateString, randomGenerate];
            return strings.join('');
        }
    }

    /**
     * Remove special characters from company name
     *
     * @private
     * @param {string} value
     * @return {*}
     * @memberof AddCompanyComponent
     */
    private removeSpecialCharacters(value: string) {
        let finalString;
        finalString = value?.replace(/[^a-zA-Z0-9]/g, '');
        return finalString?.substr(0, 6)?.toLowerCase();
    }

    /**
     * Get six character random company name
     *
     * @private
     * @return {*}
     * @memberof AddCompanyComponent
     */
    private getSixCharRandom() {
        return Math.random().toString(36)?.replace(/[^a-zA-Z0-9]+/g, '')?.substr(0, 6);
    }

    /**
     * Fire socket api call on create company
     *
     * @memberof AddCompanyComponent
     */
    public fireSocketCompanyCreateRequest(): void {
        this.socketCompanyRequest.CompanyName = this.company.name;
        this.socketCompanyRequest.Timestamp = Date.now();
        this.socketCompanyRequest.LoggedInEmailID = this.generalService.user.email;
        this.socketCompanyRequest.MobileNo = this.firstStepForm.controls['mobile'].value;
        this.socketCompanyRequest.Name = this.generalService.user.name;
        this.socketCompanyRequest.utm_source = this.generalService.getUtmParameter('utm_source');
        this.socketCompanyRequest.utm_medium = this.generalService.getUtmParameter('utm_medium');
        this.socketCompanyRequest.utm_campaign = this.generalService.getUtmParameter('utm_campaign');
        this.socketCompanyRequest.utm_term = this.generalService.getUtmParameter('utm_term');
        this.socketCompanyRequest.utm_content = this.generalService.getUtmParameter('utm_content');
        this.companyService.SocketCreateCompany(this.socketCompanyRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
        });

        this.generalService.removeUtmParameters();
    }

    /**
     * Sends new user info to 3rd party
     *
     * @memberof AddCompanyComponent
     */
    public sendNewUserInfo(): void {
        let newUserInfo = {
            name: this.company.name,
            currency: this.company.baseCurrency,
            contactNo: this.firstStepForm.controls['mobile'].value,
            source: this.generalService.getUtmParameter('utm_source'),
            medium: this.generalService.getUtmParameter('utm_medium'),
            campaign: this.generalService.getUtmParameter('utm_campaign'),
            term: this.generalService.getUtmParameter('utm_term'),
            content: this.generalService.getUtmParameter('utm_content'),
            country: this.company.country
        };
        this.companyService.sendNewUserInfo(newUserInfo).pipe(take(1)).subscribe(response => { });
    }

    /**
     * This will use for on submit company form
     *
     * @return {*}  {void}
     * @memberof AddCompanyComponent
     */
    public onSubmit(): void {
        console.log(this.companyForm);

        this.isFormSubmitted = false;
        if (this.companyForm.invalid) {
            this.isFormSubmitted = true;
            return;
        }
        let gstDetails = this.prepareGstDetail(this.companyForm);
        const phoneNumber = this.intl.getNumber();
        const countryCode = this.intl.getSelectedCountryData().dialCode;
        let number = phoneNumber.replace(countryCode, '').trim();
        number = number.substring(1);
        this.secondStepForm.controls['gstin'].setValue(gstDetails[0]?.taxNumber);
        this.company.name = this.companyForm.value.firstStepForm.name;
        this.company.country = this.companyForm.value.firstStepForm.country.value;
        this.company.businessNature = this.companyForm.value.secondStepForm.businessNature;
        this.company.businessType = this.companyForm.value.secondStepForm.businessType;
        this.company.contactNo = number;
        this.company.phoneCode = countryCode;
        this.company.addresses.push(gstDetails);
        this.company.pincode = gstDetails[0]?.pincode;
        this.company.address = gstDetails[0]?.address;
        this.company.taxes = this.companyForm.value.secondStepForm.taxes;
        this.generalService.createNewCompany = this.company;
        this.subscriptionRequestObj.licenceKey = "";
        this.store.dispatch(this.companyActions.selectedPlan(this.subscriptionPlan));

        if (this.subscriptionPlan.subscriptionId) {
            this.subscriptionRequestObj.subscriptionId = this.subscriptionPlan.subscriptionId;
            this.company.subscriptionRequest = this.subscriptionRequestObj;
            this.store.dispatch(this.companyActions.CreateNewCompany(this.company));
        } else {
            this.subscriptionRequestObj.planUniqueName = this.subscriptionPlan.planDetails?.uniqueName;
            this.company.subscriptionRequest = this.subscriptionRequestObj;
            this.store.dispatch(this.companyActions.CreateNewCompany(this.company));
        }
        this.isCompanyCreated$.subscribe(response => {
            if (response) {
                this.store.pipe(select(state => state.session.userLoginState), take(1)).subscribe(st => {
                    this.isNewUser = st === userLoginStateEnum.newUserLoggedIn;
                });
                this.generalService.companyUniqueName = this.company?.uniqueName;
                setTimeout(() => {
                    this.store.dispatch(this.loginAction.ChangeCompany(this.company?.uniqueName));
                    this.route.navigate([this.isNewUser ? 'welcome' : 'onboarding']);
                }, 500);
            }
        });
    }

    /**
     * This will use for select businss type
     *
     * @param {*} event
     * @memberof AddCompanyComponent
     */
    public selectBusinessType(event: any): void {
        if (event) {
            this.secondStepForm.controls['businessType'].setValue(event.value);
            this.changeDetection.detectChanges();
        }
    }

    /**
     * This will use for select businss type
     *
     * @param {*} event
     * @memberof AddCompanyComponent
     */
    public selectBusinessNature(event: any): void {
        if (event) {
            this.secondStepForm.controls['businessNature'].setValue(event.value);
            this.changeDetection.detectChanges();
        }
    }

    /**
     * This will use for prepare gst details
     *
     * @param {*} form
     * @return {*}
     * @memberof AddCompanyComponent
     */
    public prepareGstDetail(form:any) {
        this.addressesObj.taxNumber = form.value.secondStepForm.gstin;
        this.addressesObj.stateCode = this.selectedStateCode;
        this.addressesObj.address = form.value.secondStepForm.address;
        this.addressesObj.pincode = form.value.secondStepForm.pincode;
        this.addressesObj.isDefault = false;
        this.addressesObj.stateName = this.selectedState;
        return this.addressesObj;
    }

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof AddCompanyComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.translationLoaded = true;
            this.businessTypeList = [
                {
                    label: this.localeData?.registered,
                    value: "Registered",
                },
                {
                    label: this.localeData?.unregistered,
                    value: "Unregistered",
                }
            ];
            this.businessTypeOtherCountryOptions = [
                {
                    label: this.localeData?.unregistered,
                    value: "Unregistered",
                }
            ];
            this.businessNatureList = [
                {
                    label: this.localeData?.food,
                    value: "Food",
                },
                {
                    label: this.localeData?.service,
                    value: "Service"
                },
                {
                    label: this.localeData?.manufacturing,
                    value: "Manufacturing"
                },
                {
                    label: this.localeData?.retails,
                    value: "Retail"
                }
            ];
            this.changeDetection.detectChanges();
        }
    }
}
