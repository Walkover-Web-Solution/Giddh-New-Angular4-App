import { HttpClient } from "@angular/common/http";
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { select, Store } from "@ngrx/store";
import { Observable, ReplaySubject } from "rxjs";
import { distinctUntilChanged, take, takeUntil } from "rxjs/operators";
import { CommonActions } from "../actions/common.actions";
import { CompanyActions } from "../actions/company.actions";
import { LoginActions } from "../actions/login.action";
import { MOBILE_NUMBER_UTIL_URL, MOBILE_NUMBER_SELF_URL, MOBILE_NUMBER_IP_ADDRESS_URL, MOBILE_NUMBER_ADDRESS_JSON_URL } from '../app.constant';
import { CountryRequest } from "../models/api-models/Common";
import { CompanyCreateRequest, CompanyResponse, SocketNewCompanyRequest } from "../models/api-models/Company";
import { userLoginStateEnum } from "../models/user-login-state";
import { CompanyService } from "../services/company.service";
import { GeneralService } from "../services/general.service";
import { ToasterService } from "../services/toaster.service";
import { AppState } from "../store";
import { IOption } from "../theme/ng-select/option.interface";

@Component({
    selector: 'add-company',
    templateUrl: './add-company.component.html',
    styleUrls: ['./add-company.component.scss']
})

export class AddCompanyComponent implements OnInit, AfterViewInit {
    @ViewChild('stepper') stepperIcon: any;
    /** Mobile Number state instance */
    @ViewChild('initContactProforma', { static: false }) initContactProforma: ElementRef;
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

    constructor(
        private formBuilder: FormBuilder,
        private _toasty: ToasterService,
        private http: HttpClient,
        private store: Store<AppState>,
        private generalService: GeneralService,
        private commonActions: CommonActions,
        private companyActions: CompanyActions,
        private companyService: CompanyService,
        private loginAction: LoginActions
    ) { }

    public ngOnInit(): void {
        this.companies$ = this.store.pipe(select(s => s.session.companies), takeUntil(this.destroyed$));
        this.isCompanyCreationInProcess$ = this.store.pipe(select(s => s.session.isCompanyCreationInProcess), takeUntil(this.destroyed$));
        this.isCompanyCreated$ = this.store.pipe(select(s => s.session.isCompanyCreated), takeUntil(this.destroyed$));
        this.isCompanyCreated$.subscribe(s => {
            if (s) {
                this.store.pipe(select(state => state.session.userLoginState), take(1)).subscribe(st => {
                    this.isNewUser = st === userLoginStateEnum.newUserLoggedIn;
                });
                let prevTab = '';
                this.store.pipe(select(ss => ss.session.lastState), take(1)).subscribe(se => {
                    prevTab = se;
                });
                this.generalService.companyUniqueName = this.company?.uniqueName;
                // setTimeout(() => {
                //     if (prevTab !== 'user-details') {
                //         this.store.dispatch(this.loginAction.ChangeCompany(this.company?.uniqueName));
                //         this._route.navigate([this.isNewUser ? 'welcome' : 'onboarding']);
                //     }
                //     this.closeModal();
                // }, 500);
            }
        });
        this.store.pipe(select(p => p.session.companyUniqueName), distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(a => {
            if (a && a !== '' && this.company?.uniqueName) {
                if (a.includes(this.company?.uniqueName?.substring(0, 8))) {
                    this.company.name = '';
                    this.company.country = '';
                    this.company.baseCurrency = '';
                    this.company.contactNo = '';
                    this.company.phoneCode = '';
                }
            }
        });
        this.isProdMode = PRODUCTION_ENV;
        this.getCountry();
        this.initCompanyForm();
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
            country: [''],
            currency: [''],
            mobile: ['']
        });
        this.secondStepForm = this.formBuilder.group({
            businessType: [''],
            businessNature: [''],
            gstin: [''],
            state: [''],
            tax: null,
            pincode: [''],
            address: ['']
        });
        this.companyForm = this.formBuilder.group({
            firstStepForm: this.firstStepForm,
            secondStepForm: this.secondStepForm
        });
    }

    public ngAfterViewInit(): void {
        this.stepperIcon._getIndicatorType = () => 'number';
        let interval = setInterval(() => {
            if (this.initContactProforma) {
                this.onlyPhoneNumber();
                clearInterval(interval);
            }
        }, 500);
    }

    public getCountry() :void{
        this.store.pipe(select(s => s.common.countries), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                Object.keys(res).forEach(key => {
                    // Creating Country List
                    this.countries.push({
                        value: res[key].alpha2CountryCode,
                        label: res[key].alpha2CountryCode + ' - ' + res[key].countryName,
                        additional: res[key].callingCode
                    });
                    // Creating Country Currency List
                    if (res[key].currency !== undefined && res[key].currency !== null) {
                        this.countryCurrency[res[key].alpha2CountryCode] = [];
                        this.countryCurrency[res[key].alpha2CountryCode] = res[key].currency.code;
                    }

                    if (this.company.country === res[key].alpha2CountryCode) {
                        this.selectedCountry = res[key].alpha2CountryCode + ' - ' + res[key].countryName;
                    }
                });

                this.getCurrency();
            } else {
                let countryRequest = new CountryRequest();
                countryRequest.formName = 'onboarding';
                this.store.dispatch(this.commonActions.GetCountry(countryRequest));
            }
        });
    }

    public getCurrency() : void {
        this.store.pipe(select(s => s.session.currencies), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                Object.keys(res).forEach(key => {
                    this.currencies.push({ label: res[key].code, value: res[key].code });
                });
            }
        });
    }

    public selectCountry(event: any): void {
        if (event) {
            this.selectedCountry = event.value;
            this.selectedCountryName = event.label
            const currentCountry = Object.entries(this.countryCurrency).map(([label, value]) => ({ label, value }));
            let currentCurrency = currentCountry.filter(currency => currency.label == event.value);
            this.selectedCurrencyName = currentCurrency[0].value;
            this.selectedCurrency = currentCurrency[0].value;
            this.intl?.setCountry(currentCurrency[0]?.label?.toLowerCase());
            this.company.baseCurrency = this.countryCurrency[event.value];
        }
    }


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
    }

    public onSubmitFirstStep(): void {
        let phoneNumber = this.intl?.getNumber();
        this.firstStepForm.controls['currency'].setValue(this.selectedCurrency);
        this.firstStepForm.controls['country'].setValue(this.selectedCountry);
        this.firstStepForm.controls['mobile'].setValue(phoneNumber);
        let companies = null;
        this.companies$.pipe(takeUntil(this.destroyed$)).subscribe(company => companies = company);
        this.company.uniqueName = this.getRandomString(this.company.name, this.company.country);
        this.generalService.createNewCompany = this.company;
        this.store.dispatch(this.companyActions.userStoreCreateCompany(this.company));
        console.log(this.intl);
        this.company.name = this.firstStepForm.controls['name'].value;
        this.company.country = this.firstStepForm.controls['country'].value;
        this.company.baseCurrency = this.firstStepForm.controls['currency'].value;
        console.log("called1", this.firstStepForm);
        this.isProdMode = true;
        if (this.isProdMode && companies) {
            if (companies?.length !== 0) {
                this.sendNewUserInfo();
                this.fireSocketCompanyCreateRequest();
            }
        }
    }

    private getRandomString(companyName: string, city: string) {
        let d, dateString, randomGenerate, strings;
        companyName = this.removeSpecialCharacters(companyName);
        city = this.removeSpecialCharacters(city);
        d = new Date();
        dateString = d.getTime()?.toString();
        randomGenerate = this.getSixCharRandom();
        strings = [companyName, city, dateString, randomGenerate];
        return strings.join('');
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

        this.companyService.sendNewUserInfo(newUserInfo).pipe(take(1)).subscribe(response => {
            console.log(response);

         });
    }

    public onSubmit(): void {
        // this.groupForm.controls['type'].setValue(this.stockType);
        console.log("called2", this.companyForm, this.firstStepForm, this.secondStepForm);

    }
}
