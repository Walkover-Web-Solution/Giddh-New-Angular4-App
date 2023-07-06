import { HttpClient } from "@angular/common/http";
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { select, Store } from "@ngrx/store";
import { Observable, ReplaySubject } from "rxjs";
import { debounceTime, distinctUntilChanged, take, takeUntil } from "rxjs/operators";
import { CommonActions } from "../actions/common.actions";
import { CompanyActions } from "../actions/company.actions";
import { GeneralActions } from "../actions/general/general.actions";
import { MOBILE_NUMBER_UTIL_URL, MOBILE_NUMBER_SELF_URL, MOBILE_NUMBER_IP_ADDRESS_URL, MOBILE_NUMBER_ADDRESS_JSON_URL, OnBoardingType } from '../app.constant';
import { isEqual } from "../lodash-optimized";
import { CountryRequest, OnboardingFormRequest } from "../models/api-models/Common";
import { CompanyCreateRequest, CompanyResponse, SocketNewCompanyRequest, StatesRequest } from "../models/api-models/Company";
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
    /* This will hold if it's production env or not */
    public isProdMode: boolean = false;
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** Subject to unsubscribe from listeners */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if form is submitted to show error if available */
    public isFormSubmitted: boolean = false;
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
    public socketCompanyRequest: SocketNewCompanyRequest = new SocketNewCompanyRequest();
    public companies$: Observable<CompanyResponse[]>;
    public isCompanyCreationInProcess$: Observable<boolean>;
    public isCompanyCreated$: Observable<boolean>;
    public countries: IOption[] = [];
    public currencies: IOption[] = [];
    public countryCurrency: any[] = [];
    public selectedCountry: string = '';
    public selectedCountryName: string = '';
    public selectedCurrency: string = '';
    public selectedCurrencyName: string = '';
    public isNewUser: boolean = false;
    public initialCountry: string = null;
    public businessType: IOption[] = [];
    public formFields: any[] = [];
    public taxesList: any = [];
    public currentTaxList: any[] = [];
    public businessTypeList: IOption[] = [{ label: "Registered", value: "Registered" }, { label: "Unregistered", value: "Unregistered" }];
    public businessNatureList: IOption[] = [{ label: "Food", value: "Food" }, { label: "Service", value: "Service" }, { label: "Manufacturing", value: "Manufacturing" }, { label: "Retail", value: "Retail" }];
    public selectedTaxes: string[] = [];
    public selectedBusinesstype: string = '';
    public companyProfileObj: any = null;
    public createNewCompany: any = {};
    /** True, if on boarding is going on */
    public isOnBoardingInProgress: boolean;
    /** Stores the item on boarding store data */
    public itemOnBoardingDetails: ItemOnBoardingState;
    public stateGstCode: any[] = [];
    public createNewCompanyPreparedObj: CompanyCreateRequest = {
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
    public states: IOption[] = [];
    /** True, if item update is in progress */
    public isItemUpdateInProgress: boolean;

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

    public activeCompany: any;
    public isTaxNumberSameAsHeadQuarter: number = 0;
    constructor(
        private formBuilder: FormBuilder,
        private _toasty: ToasterService,
        private http: HttpClient,
        private store: Store<AppState>,
        private generalService: GeneralService,
        private commonActions: CommonActions,
        private companyService: CompanyService,
        private changeDetection: ChangeDetectorRef,
        private generalActions: GeneralActions,
    ) { }

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

        this.isProdMode = PRODUCTION_ENV;
        this.getCountry();
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
            gstin: ['', Validators.required],
            state: [''],
            tax: null,
            pincode: ['', Validators.required],
            address: ['', Validators.required]
        });
        this.companyForm = this.formBuilder.group({
            firstStepForm: this.firstStepForm,
            secondStepForm: this.secondStepForm
        });
    }

    public ngAfterViewInit(): void {
        this.stepperIcon._getIndicatorType = () => 'number';
        let interval = setInterval(() => {
            if (this.mobileNo) {
                this.onlyPhoneNumber();
                clearInterval(interval);
            }
        }, 500);
    }

    public getStates() {
        this.store.pipe(select(state => state.general.states), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                Object.keys(res.stateList).forEach(key => {
                    if (res.stateList[key].stateGstCode !== null) {
                        this.stateGstCode[res.stateList[key].stateGstCode] = [];
                        this.stateGstCode[res.stateList[key].stateGstCode] = res.stateList[key].code;
                    }
                    this.states.push({
                        label: res.stateList[key].code + ' - ' + res.stateList[key].name,
                        value: res.stateList[key].code
                    });
                });
            }
        });
    }

    /**
     * Fills the form details with proovided entity type
     *
     * @private
     * @param {*} entity Entity with which the form details will get filled
     * @returns {boolean} True, if any one of the form field is filled with the entity details
     * @memberof AddCompanyComponent
     */
    private fillFormDetails(entity: any): boolean {
        if (entity) {
            this.companyProfileObj.address = entity.address;
            this.companyProfileObj.state = entity.stateCode;
            this.companyProfileObj.pincode = entity.pincode;
        }
        return !!(this.companyProfileObj.address || this.companyProfileObj.state);
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

    public getCurrency(): void {
        this.store.pipe(select(state => state.session.currencies), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                Object.keys(res).forEach(key => {
                    this.currencies.push({ label: res[key].code, value: res[key].code });
                });
            }
        });
    }

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
                initialCountry: this.initialCountry ?? 'auto',
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
                                this._toasty.errorToast(this.localeData?.invalid_contact_number);
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

    private removeSpecialCharacters(value: string) {
        let finalString;
        finalString = value?.replace(/[^a-zA-Z0-9]/g, '');
        return finalString.substr(0, 6)?.toLowerCase();
    }

    private getSixCharRandom() {
        return Math.random().toString(36)?.replace(/[^a-zA-Z0-9]+/g, '')?.substr(0, 6);
    }

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
     * @memberof CompanyAddNewUiComponent
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

    public onSubmit(): void {
        this.isFormSubmitted = false;
        if (this.secondStepForm.invalid) {
            this.isFormSubmitted = true;
            return;
        }
    }

    public selectBusinessType(event: any): void {
        if (event) {
            this.secondStepForm.controls['businessType'].setValue(event.value);
            this.changeDetection.detectChanges();
        }
    }

    public selectBusinessNature(event: any): void {
        if (event) {
            this.secondStepForm.controls['businessNature'].setValue(event.value);
            this.changeDetection.detectChanges();
        }
    }
}
