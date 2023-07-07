import { HttpClient } from "@angular/common/http";
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { select, Store } from "@ngrx/store";
import { Observable, ReplaySubject } from "rxjs";
import { debounceTime, distinctUntilChanged, take, takeUntil } from "rxjs/operators";
import { CommonActions } from "../actions/common.actions";
import { CompanyActions } from "../actions/company.actions";
import { GeneralActions } from "../actions/general/general.actions";
import { MOBILE_NUMBER_UTIL_URL, MOBILE_NUMBER_SELF_URL, MOBILE_NUMBER_IP_ADDRESS_URL, MOBILE_NUMBER_ADDRESS_JSON_URL, GSTIN_REGEX } from '../app.constant';
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
    /**
     * Returns true, if onboarding of Warehouse is going on
     *
     * @readonly
     * @type {boolean}
     * @memberof AddCompanyComponent
     */
    public get isWarehouse(): boolean {
        return this.itemOnBoardingDetails && this.itemOnBoardingDetails.onBoardingType === 'Warehouse';
    }
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
    /* This will hold if it's production env or not */
    public isProdMode: boolean = false;
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
        businessNature: '',
        businessType: '',
        address: '',
        industry: '',
        baseCurrency: '',
        isMultipleCurrency: false,
        city: '',
        pincode: '',
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
    /** Hold selected tax */
    public selectedTaxes: string[] = [];
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
        private companyActions: CompanyActions
    ) { }

    /**
     * On init component hook
     *
     * @memberof AddCompanyComponent
     */
    public ngOnInit(): void {
        this.initCompanyForm();
        this.companies$ = this.store.pipe(select(s => s.session.companies), takeUntil(this.destroyed$));
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
                if (res.applicableTaxes) {
                    this.taxesList = [];
                    Object.keys(res.applicableTaxes).forEach(key => {
                        if (res.applicableTaxes[key]) {
                            this.taxesList.push({
                                label: res.applicableTaxes[key]?.name,
                                value: res.applicableTaxes[key]?.uniqueName,
                                isSelected: false
                            });
                            this.currentTaxList[res.applicableTaxes[key]?.uniqueName] = [];
                            this.currentTaxList[res.applicableTaxes[key]?.uniqueName] = res.applicableTaxes[key];
                        }
                    });
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
                        this.changeDetection.detectChanges();
                        return true;
                    }
                });
            }
        });
        this.isProdMode = PRODUCTION_ENV;
        this.getCountry();
        this.loggedInUser = this.generalService.user;
        this.subscriptionRequestObj.userUniqueName = (this.loggedInUser) ? this.loggedInUser.uniqueName : "";
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
            gstin: ['', Validators.required], //Validators.required
            state: [''], //Validators.required
            tax: null,
            pincode: [''],
            address: ['', Validators.required]
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
                this.onlyPhoneNumber();
                clearInterval(interval);
            }
        }, 500);
    }

    /**
     * This will use for get states list
     *
     * @memberof AddCompanyComponent
     */
    public getStates() {
        this.store.pipe(select(state => state.general.states), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                Object.keys(res.stateList).forEach(key => {
                    if (key) {
                        if (res.stateList[key].stateGstCode !== null) {
                            this.stateGstCode[res.stateList[key].stateGstCode] = [];
                            this.stateGstCode[res.stateList[key].stateGstCode] = res.stateList[key].code;
                        }
                        this.states.push({
                            label: res.stateList[key].code + ' - ' + res.stateList[key].name,
                            value: res.stateList[key].code,
                            stateGstCode: res.stateList[key].stateGstCode
                        });
                    }
                });
            }
        });
    }



    /**
     * Returns the default warehouse data
     *
     * @private
     * @returns {*} Default warehouse data
     * @memberof AddCompanyComponent
     */
    private getDefaultWarehouseDetails(): any {
        let defaultWarehouse: any;
        this.store.pipe(select(state => state.warehouse.warehouses), take(1)).subscribe((warehouses: any) => {
            if (warehouses) {
                for (let index = 0; index < warehouses.results?.length; index++) {
                    if (warehouses.results[index].isDefault) {
                        defaultWarehouse = warehouses.results[index];
                        break;
                    }
                }
            }
        });
        return defaultWarehouse;
    }
    /**
     * Get countries list
     *
     * @memberof AddCompanyComponent
     */
    public getCountry(): void {
        this.store.pipe(select(s => s.common.countries), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                Object.keys(res).forEach(key => {
                    this.countries.push({
                        value: res[key].alpha2CountryCode,
                        label: res[key].alpha2CountryCode + ' - ' + res[key].countryName,
                        additional: res[key]
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
        this.store.pipe(select(state => state.session.currencies), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                Object.keys(res).forEach(key => {
                    this.currencies.push({ label: res[key].code, value: res[key].code });
                });
            }
        });
    }

    /**
     * This will use for select country
     *
     * @param {*} event
     * @memberof AddCompanyComponent
     */
    public selectCountry(event: any): void {
        if (event) {
            this.firstStepForm.controls['country'].setValue(event);
            this.firstStepForm.controls['currency'].setValue({ label: event?.additional?.currency?.code, value: event?.additional?.currency?.code });
            this.intl?.setCountry(event.value?.toLowerCase());
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
    }

    /**
     * This will use for mobile number
     *
     * @memberof AddCompanyComponent
     */
    public onlyPhoneNumber(): void {
        let input = document.getElementById('mobile-no');
        const errorMsg = document.querySelector("#mobile-no-error-msg");
        const validMsg = document.querySelector("#mobile-no-valid-msg");
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
                        (res) => {
                            if (res?.ipAddress) {
                                const fetchCountryByIpApi = this.http.get<any>(MOBILE_NUMBER_IP_ADDRESS_URL + `${res.ipAddress}`);
                                fetchCountryByIpApi.subscribe(
                                    (fetchCountryByIpApiRes) => {
                                        if (fetchCountryByIpApiRes?.countryCode) {
                                            return success(fetchCountryByIpApiRes.countryCode);
                                        } else {
                                            return success(countryCode);
                                        }
                                    },
                                    (fetchCountryByIpApiErr) => {
                                        const fetchCountryByIpInfoApi = this.http.get<any>(MOBILE_NUMBER_ADDRESS_JSON_URL + `${res?.ipAddress}`);

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
     * This will use for on submit fist step form
     *
     * @return {*}  {void}
     * @memberof AddCompanyComponent
     */
    public onSubmitFirstStep(): void {
        this.isFormSubmitted = false;
        if (this.firstStepForm.invalid) {
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
        let d, dateString, randomGenerate, strings;
        if (companyName) {
            companyName = this.removeSpecialCharacters(companyName);
            city = this.removeSpecialCharacters(city);
            d = new Date();
            dateString = d.getTime()?.toString();
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
        return finalString.substr(0, 6)?.toLowerCase();
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
        let gstDetails = this.prepareGstDetail(this.companyForm);
        this.isFormSubmitted = false;
        if (this.companyForm.invalid) {
            this.isFormSubmitted = true;
            return;
        }
        this.company.name = this.companyForm.value.firstStepForm.name;
        this.company.country = this.companyForm.value.firstStepForm.country.value;
        this.company.businessNature = this.companyForm.value.secondStepForm.businessNature;
        this.company.businessType = this.companyForm.value.secondStepForm.businessType;
        this.company.contactNo = this.companyForm.value.firstStepForm.mobile;
        this.company.addresses.push(gstDetails);
        this.company.address = gstDetails[0]?.address;
        this.company.taxes = (this.selectedTaxes?.length > 0) ? this.selectedTaxes : [];
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
    public prepareGstDetail(form) {
        this.addressesObj.taxNumber = form.value.secondStepForm.gstin;
        this.addressesObj.stateCode = this.selectedStateCode;
        this.addressesObj.address = form.value.secondStepForm.address;
        this.addressesObj.pincode = form.value.secondStepForm.pincode;
        this.addressesObj.isDefault = false;
        this.addressesObj.stateName = this.selectedState;
        return this.addressesObj;
    }
}
