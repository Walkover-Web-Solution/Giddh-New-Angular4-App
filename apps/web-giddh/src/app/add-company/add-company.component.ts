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
import { MOBILE_NUMBER_UTIL_URL, MOBILE_NUMBER_SELF_URL, MOBILE_NUMBER_IP_ADDRESS_URL, MOBILE_NUMBER_ADDRESS_JSON_URL, BusinessTypes } from '../app.constant';
import { isEqual } from "../lodash-optimized";
import { CountryRequest, OnboardingFormRequest } from "../models/api-models/Common";
import { Addresses, CompanyCreateRequest, CompanyResponse, CreateCompanyUsersPlan, SocketNewCompanyRequest, StatesRequest, SubscriptionRequest } from "../models/api-models/Company";
import { UserDetails } from "../models/api-models/loginModels";
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
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** Subject to unsubscribe from listeners */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if form is submitted to show error if available */
    public isFormSubmitted: boolean = false;
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
        pincode: '',
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
    public businessTypeList: IOption[] = [];
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
    /** Observable to company created */
    public isCompanyCreated$: Observable<boolean>;
    /** True if other country selected */
    public isOtherCountry: boolean = false;
    /** Constant for business type */
    public businessTypes = BusinessTypes;
    /** Hold current flag*/
    public currentFlag: any;
    /** Hold selected tab*/
    public selectedStep: number = 0;
    /** List of counties of country */
    public countyList: IOption[] = [];
    /** List of registered business type countries */
    public registeredTypeCountryList: any[] = ["IN", "GB", "AE"];
    /** This will hold disable State */
    public disabledState: boolean = false;

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
        this.getCountry();
        this.getStates();
        this.getCurrency();

        this.loggedInUser = this.generalService.user;
        this.subscriptionRequestObj.userUniqueName = (this.loggedInUser) ? this.loggedInUser.uniqueName : "";

        this.companies$ = this.store.pipe(select(response => response.session.companies), takeUntil(this.destroyed$));
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

        this.firstStepForm.controls['mobile']?.valueChanges?.pipe(debounceTime(700), distinctUntilChanged(isEqual)).subscribe(data => {
            setTimeout(() => {
                let currencyFlag = this.intl?.getSelectedCountryData();
                this.currentFlag = currencyFlag?.iso2;
                this.changeDetection.detectChanges();
            }, 500);
        });

        this.changeDetection.detectChanges();
    }

    /**
    * Initializing the company form
    *
    * @private
    * @memberof AddCompanyComponent
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
            gstin: [''],
            state: [''],
            county: [''],
            taxes: null,
            pincode: [''],
            address: [''],
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
                    this.showPhoneNumberField();
                }, 100);
                clearInterval(interval);
            }
        }, 500);
    }

    /**
     * This will use validate gst number
     *
     * @param {*} event
     * @memberof AddCompanyComponent
     */
    public validateGstNumber(event: any): void {
        let isValid: boolean = false;
        if (this.secondStepForm.get('gstin')?.value) {
            if (this.formFields['taxName']['regex'] !== "" && this.formFields['taxName']['regex']?.length > 0) {
                for (let key = 0; key < this.formFields['taxName']['regex']?.length; key++) {
                    let regex = new RegExp(this.formFields['taxName']['regex'][key]);
                    if (regex.test(this.secondStepForm.get('gstin')?.value)) {
                        isValid = true;
                    }
                }
            } else {
                isValid = true;
            }

            if (!isValid) {
                let text = this.localeData?.invalid_tax;
                text = text?.replace("[TAX_NAME]", this.formFields['taxName'].label);
                this.toaster.showSnackBar("error", text);
                this.selectedState = '';
                this.selectedStateCode = '';
                this.isGstinValid = false;
            } else {
                this.isGstinValid = true;
            }
        }

            if (this.secondStepForm.get('gstin')?.value?.length >= 2) {
                this.states?.find((state) => {
                    let code = this.secondStepForm.get('gstin')?.value?.substr(0, 2);
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
     * Get countries list
     *
     * @memberof AddCompanyComponent
     */
    public getCountry(): void {
        this.store.pipe(select(response => response.common.countries), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.countries = [];
                Object.keys(response).forEach(key => {
                    this.countries.push({
                        value: response[key].alpha2CountryCode,
                        label: response[key].alpha2CountryCode + ' - ' + response[key].countryName,
                        additional: response[key]
                    });
                });
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
                this.currencies = [];
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
     * This will use for selected tab index
     *
     * @param {*} event
     * @memberof AddCompanyComponent
     */
    public onSelectedTab(event: any): void {
        this.selectedStep = event?.selectedIndex;
    }

    /**
     * This will use for select country
     *
     * @param {*} event
     * @memberof AddCompanyComponent
     */
    public selectCountry(event: any): void {
        if (event?.value) {
            this.businessTypeList = [];
            if (!this.registeredTypeCountryList.includes(event.value)) {
                this.isOtherCountry = true;
                this.secondStepForm.controls['businessType'].setValue(this.businessTypes.Unregistered);
                this.businessTypeList.push({ label: this.localeData.unregistered, value: this.businessTypes.Unregistered });
            } else {
                this.isOtherCountry = false;
                this.businessTypeList.push({ label: this.localeData.registered, value: this.businessTypes.Registered }, { label: this.localeData.unregistered, value: this.businessTypes.Unregistered });
            }
            this.firstStepForm.controls['country'].setValue(event);
            this.company.baseCurrency = event?.additional?.currency?.code;
            this.firstStepForm.controls['currency'].setValue({ label: event?.additional?.currency?.code, value: event?.additional?.currency?.code });
            this.intl?.setCountry(event.value?.toLowerCase());

            let phoneNumber = this.intl?.getNumber();
            if (phoneNumber?.length) {
                let input = document.getElementById('init-contact-proforma');
                const errorMsg = document.querySelector("#init-contact-proforma-error-msg");
                const validMsg = document.querySelector("#init-contact-proforma-valid-msg");
                let errorMap = [this.localeData?.invalid_contact_number, this.commonLocaleData?.app_invalid_country_code, this.commonLocaleData?.app_invalid_contact_too_short, this.commonLocaleData?.app_invalid_contact_too_long, this.localeData?.invalid_contact_number];
                if (input) {
                    if (this.intl?.isValidNumber()) {
                        validMsg?.classList?.remove("d-none");
                        this.isMobileNumberInvalid = false;
                    } else {
                        input?.classList?.add("error");
                        this.isMobileNumberInvalid = true;
                        let errorCode = this.intl?.getValidationError();
                        if (errorMsg && errorMap[errorCode]) {
                            this.toaster.showSnackBar("error", this.localeData?.invalid_contact_number);
                            errorMsg.innerHTML = errorMap[errorCode];
                            errorMsg.classList.remove("d-none");
                        }
                    }
                }
            }

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
            this.changeDetection.detectChanges();
        }
    }

    /**
     * This will use for mobile number
     *
     * @memberof AddCompanyComponent
     */
    public showPhoneNumberField(): void {
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
                                this.toaster.showSnackBar("error", this.localeData?.invalid_contact_number);
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
            this.selectedStep = 0;
            return;
        }
        this.firstStepForm.controls['mobile'].setValue(this.intl?.getNumber());
        this.selectedStep = 1;
        let companies = null;
        this.company.name = this.firstStepForm.controls['name'].value;
        this.company.country = this.firstStepForm.controls['country'].value.value;
        this.company.baseCurrency = this.firstStepForm.controls['currency'].value.value;
        this.company.uniqueName = this.getRandomString(this.company.name, this.company.country);
        this.generalService.createNewCompany = this.company;

        this.companies$.pipe(takeUntil(this.destroyed$)).subscribe(companyList => companies = companyList);
        if (PRODUCTION_ENV && companies?.length === 0) {
            this.sendNewUserInfo();
            this.fireSocketCompanyCreateRequest();
        }
    }

    /**
     * Get random string for company
     *
     * @private
     * @param {string} companyName
     * @param {string} country
     * @return {*}
     * @memberof AddCompanyComponent
     */
    private getRandomString(companyName: string, country: string): string {
        if (companyName) {
            let date, dateString, randomGenerate, strings;
            companyName = this.removeSpecialCharacters(companyName);
            country = this.removeSpecialCharacters(country);
            date = new Date();
            dateString = date.getTime()?.toString();
            randomGenerate = this.getSixCharRandom();
            strings = [companyName, country, dateString, randomGenerate];
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
    private removeSpecialCharacters(value: string): string {
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
    private getSixCharRandom(): string {
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
        this.companyService.SocketCreateCompany(this.socketCompanyRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => { });
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

    public selectState(event: any): void {
        this.selectedStateCode = event?.value;
        this.selectedState = event?.label;
        this.secondStepForm.controls['state']?.setValue(this.selectedStateCode);
        this.changeDetection.detectChanges();
    }

    /**
     * This will use for on submit company form
     *
     * @return {*}  {void}
     * @memberof AddCompanyComponent
     */
    public onSubmit(): void {
        this.isFormSubmitted = false;
        if (this.companyForm.invalid || !this.isGstinValid) {
            this.isFormSubmitted = true;
            return;
        }
        let taxDetails = this.prepareTaxDetail(this.companyForm);
        const phoneNumber = this.intl.getNumber();
        const countryCode = this.intl.getSelectedCountryData().dialCode;
        let number = phoneNumber.replace(countryCode, '').trim();
        number = number.substring(1);
        this.company.name = this.firstStepForm.value.name;
        this.company.country = this.firstStepForm.value.country.value;
        this.company.businessNature = this.secondStepForm.value.businessNature;
        this.company.businessType = this.secondStepForm.value.businessType;
        this.company.contactNo = number;
        this.company.phoneCode = countryCode;
        this.company.addresses = [taxDetails];
        this.company.pincode = taxDetails[0]?.pincode;
        this.company.address = taxDetails[0]?.address;
        this.company.taxes = this.secondStepForm.value.taxes;
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

        this.isCompanyCreated$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.generalService.companyUniqueName = this.company?.uniqueName;
                setTimeout(() => {
                    this.store.dispatch(this.loginAction.ChangeCompany(this.company?.uniqueName));
                    this.route.navigate(['/pages', 'onboarding']);
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
            this.secondStepForm.get('gstin').removeValidators(Validators.required);
            this.secondStepForm.get('state').removeValidators(Validators.required);
            this.secondStepForm.get('county').removeValidators(Validators.required);
            this.secondStepForm.get('address').removeValidators(Validators.required);

            if (event.value === this.businessTypes.Registered) {
                this.secondStepForm.get('gstin').setValidators(Validators.required);
                if (this.countyList?.length) {
                    this.secondStepForm.get('county').setValidators(Validators.required);
                } else {
                    this.secondStepForm.get('state').setValidators(Validators.required);
                }
                this.secondStepForm.get('address').setValidators(Validators.required);
            } else {
                this.secondStepForm.get('gstin')?.setValue('');
                this.isGstinValid = false;
            }
            this.secondStepForm.get('gstin')?.updateValueAndValidity();
            this.secondStepForm.get('address')?.updateValueAndValidity();
            this.secondStepForm.get('state')?.updateValueAndValidity();
            this.secondStepForm.get('country')?.updateValueAndValidity();
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
     * This will use for prepare tax details
     *
     * @param {*} form
     * @return {*}
     * @memberof AddCompanyComponent
     */
    public prepareTaxDetail(form: any): any {
        if (form?.value) {
            this.addressesObj.taxNumber = form.value.secondStepForm.gstin;
            if (this.countyList?.length) {
                this.addressesObj.county = { code: form.value.secondStepForm.county?.value };
            } else {
                this.addressesObj.stateCode = this.selectedStateCode;
            }
            this.addressesObj.address = form.value.secondStepForm.address;
            this.addressesObj.pincode = form.value.secondStepForm.pincode;
            this.addressesObj.isDefault = false;
            this.addressesObj.stateName = this.selectedState;
            return this.addressesObj;
        }

        return null;
    }

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof AddCompanyComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.businessTypeList = [
                {
                    label: this.localeData?.registered,
                    value: this.businessTypes.Registered,
                },
                {
                    label: this.localeData?.unregistered,
                    value: this.businessTypes.Unregistered,
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
