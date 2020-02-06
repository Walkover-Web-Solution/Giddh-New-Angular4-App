import {take, takeUntil, distinctUntilChanged} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, AfterViewInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {VerifyMobileActions} from '../../../../actions/verifyMobile.actions';
import {LocationService} from '../../../../services/location.service';
import {CompanyActions} from '../../../../actions/company.actions';
import {GeneralActions} from '../../../../actions/general/general.actions';
import {LoginActions} from '../../../../actions/login.action';
import {CommonActions} from '../../../../actions/common.actions';
import {select, Store} from '@ngrx/store';
import {Router} from '@angular/router';
import {AuthService} from '../../../../theme/ng-social-login-module/index';
import {GeneralService} from '../../../../services/general.service';
import {AuthenticationService} from '../../../../services/authentication.service';
import {AppState} from '../../../../store';
import {
    CompanyRequest,
    CompanyResponse,
    SocketNewCompanyRequest,
    StateDetailsRequest,
    CompanyCreateRequest
} from '../../../../models/api-models/Company';
import {Observable, of as observableOf, ReplaySubject} from 'rxjs';
import {IOption} from '../../../../theme/ng-virtual-select/sh-options.interface';
import {CompanyService} from '../../../../services/companyService.service';
import {ToasterService} from '../../../../services/toaster.service';
import {userLoginStateEnum} from '../../../../models/user-login-state';
import {UserDetails} from 'apps/web-giddh/src/app/models/api-models/loginModels';
import {NgForm} from '@angular/forms';
import {CountryRequest} from "../../../../models/api-models/Common";
import * as googleLibphonenumber from 'google-libphonenumber';

@Component({
    selector: 'company-add-new-ui-component',
    templateUrl: './company-add-new-ui.component.html',
    styleUrls: ['./company-add-new-ui.component.scss']
})

export class CompanyAddNewUiComponent implements OnInit, OnDestroy {
    @Output() public closeCompanyModal: EventEmitter<any> = new EventEmitter();
    @Output() public closeCompanyModalAndShowAddManege: EventEmitter<string> = new EventEmitter();
    @ViewChild('logoutModal') public logoutModal: ModalDirective;
    @ViewChild('companyForm') public companyForm: NgForm;
    @Input() public createBranch: boolean = false;

    public imgPath: string = '';
    public countrySource: IOption[] = [];
    public countrySource$: Observable<IOption[]> = observableOf([]);
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
    public logedInuser: UserDetails;
    public isLoggedInWithSocialAccount$: Observable<boolean>;
    public currencies: IOption[] = [];
    public currencySource$: Observable<IOption[]> = observableOf([]);
    public countryPhoneCode: IOption[] = [];
    public callingCodesSource$: Observable<IOption[]> = observableOf([]);
    public countryCurrency: any[] = [];
    public isMobileNumberValid: boolean = false;

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public isNewUser: boolean = false;
    public phoneUtility: any = googleLibphonenumber.PhoneNumberUtil.getInstance();
    public selectedCountry: string = '';

    constructor(private socialAuthService: AuthService,
                private store: Store<AppState>, private verifyActions: VerifyMobileActions, private companyActions: CompanyActions,
                private _location: LocationService, private _route: Router, private _loginAction: LoginActions, private _companyService: CompanyService,
                private _aunthenticationService: AuthenticationService, private _generalActions: GeneralActions, private _generalService: GeneralService,
                private _toaster: ToasterService, private commonActions: CommonActions
    ) {
        this.getCountry();
        this.getCurrency();
        this.getCallingCodes();

        this.isLoggedInWithSocialAccount$ = this.store.select(p => p.login.isLoggedInWithSocialAccount).pipe(takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.imgPath = (isElectron || isCordova) ? '' : AppUrl + APP_FOLDER + '';
        this.logedInuser = this._generalService.user;
        if (this._generalService.createNewCompany) {
            this.company = this._generalService.createNewCompany;
            if (this.company.contactNo.toString().includes('-')) {
                let contact = this.company.contactNo.split('-');
                this.company.contactNo = contact[1];
            }
            this.isMobileNumberValid = true;
        }
        this._generalService.createNewCompany = null;
        this.companies$ = this.store.select(s => s.session.companies).pipe(takeUntil(this.destroyed$));
        this.isCompanyCreationInProcess$ = this.store.select(s => s.session.isCompanyCreationInProcess).pipe(takeUntil(this.destroyed$));
        this.isCompanyCreated$ = this.store.select(s => s.session.isCompanyCreated).pipe(takeUntil(this.destroyed$));
        this.isCompanyCreated$.subscribe(s => {
            if (s && !this.createBranch) {
                this.store.select(state => state.session.userLoginState).pipe(take(1)).subscribe(st => {
                    this.isNewUser = st === userLoginStateEnum.newUserLoggedIn;
                });
                let prevTab = '';
                this.store.select(ss => ss.session.lastState).pipe(take(1)).subscribe(se => {
                    prevTab = se;
                });
                let stateDetailsRequest = new StateDetailsRequest();
                stateDetailsRequest.companyUniqueName = this.company.uniqueName;
                stateDetailsRequest.lastState = this.isNewUser ? 'welcome' : 'onboarding';
                this._generalService.companyUniqueName = this.company.uniqueName;
                if (prevTab !== 'user-details') {
                    this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
                }
                setTimeout(() => {
                    if (prevTab !== 'user-details') {
                        this.store.dispatch(this._loginAction.ChangeCompany(this.company.uniqueName));
                        this._route.navigate([this.isNewUser ? 'welcome' : 'onboarding']);
                    }
                    this.closeModal();
                }, 500);
            }
        });
        this.store.select(p => p.session.companyUniqueName).pipe(distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(a => {
            if (a && a !== '' && this.company.uniqueName) {
                if (a.includes(this.company.uniqueName.substring(0, 8))) {
                    this.company.name = '';
                    this.company.country = '';
                    this.company.baseCurrency = '';
                    this.company.contactNo = '';
                    this.company.phoneCode = '';
                }
            }
        });

        this.store.pipe(select(s => s.session.createCompanyUserStoreRequestObj), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                this.company = res;
            }
        });
    }

    /**
     * createCompany
     */
    public createCompany(mobileNoEl) {
        this.checkMobileNo(mobileNoEl);

        if (!this.isMobileNumberValid) {
            if (mobileNoEl) {
                mobileNoEl.focus();
            }
            return;
        } else {
            let companies = null;
            this.companies$.pipe(take(1)).subscribe(c => companies = c);
            this.company.uniqueName = this.getRandomString(this.company.name, this.company.country);
            this.company.isBranch = this.createBranch;
            this._generalService.createNewCompany = this.company;
            this.store.dispatch(this.companyActions.userStoreCreateCompany(this.company));
            this.closeCompanyModal.emit();
            this._route.navigate(['welcome']);

            if (companies) {
                if (companies.length === 0) {
                    this.fireSocketCompanyCreateRequest();
                }
            }
        }
    }

    public fireSocketCompanyCreateRequest() {
        this.socketCompanyRequest.CompanyName = this.company.name;
        this.socketCompanyRequest.Timestamp = Date.now();
        this.socketCompanyRequest.LoggedInEmailID = this._generalService.user.email;
        this.socketCompanyRequest.MobileNo = this.company.contactNo.toString();
        this.socketCompanyRequest.Name = this._generalService.user.name;
        this.socketCompanyRequest.utm_source = this._generalService.getUtmParameter('utm_source');
        this.socketCompanyRequest.utm_medium = this._generalService.getUtmParameter('utm_medium');
        this.socketCompanyRequest.utm_campaign = this._generalService.getUtmParameter('utm_campaign');
        this.socketCompanyRequest.utm_term = this._generalService.getUtmParameter('utm_term');
        this.socketCompanyRequest.utm_content = this._generalService.getUtmParameter('utm_content');
        this._companyService.SocketCreateCompany(this.socketCompanyRequest).subscribe();

        this._generalService.removeUtmParameters();
    }

    public closeModal() {
        let companies = null;
        this.companies$.pipe(take(1)).subscribe(c => companies = c);
        if (companies) {
            if (companies.length > 0) {
                let previousState;
                this.store.dispatch(this._generalActions.getGroupWithAccounts());
                this.store.dispatch(this._generalActions.getFlattenAccount());
                this.store.select(ss => ss.session.lastState).pipe(take(1)).subscribe(se => {
                    previousState = se;
                });
                if (previousState) {
                    if (!this.createBranch) {
                        previousState = previousState.replace('pages/', '');
                        this._route.navigate([`pages/${previousState}`]);
                    }
                }
                this.closeCompanyModal.emit();
            } else {
                this.showLogoutModal();
            }
        } else {
            this.showLogoutModal();
        }
    }

    public showLogoutModal() {
        this.logoutModal.show();
    }

    public hideLogoutModal() {
        this.logoutModal.hide();
    }

    public logoutUser() {
        this.store.dispatch(this.verifyActions.hideVerifyBox());
        this.hideLogoutModal();
        this.closeCompanyModal.emit();
        if (isElectron) {
            this.store.dispatch(this._loginAction.ClearSession());
        } else if (isCordova) {
            (window as any).plugins.googleplus.logout(
                (msg) => {
                    this.store.dispatch(this._loginAction.ClearSession());
                }
            );
        } else {
            this.isLoggedInWithSocialAccount$.subscribe((val) => {
                if (val) {
                    this.socialAuthService.signOut().then().catch((err) => {
                    });
                    this.store.dispatch(this._loginAction.ClearSession());
                    this.store.dispatch(this._loginAction.socialLogoutAttempt());
                } else {
                    this.store.dispatch(this._loginAction.ClearSession());
                }
            });
        }
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public makeMeCaptialize(companyName: string) {
        if (companyName) {
            companyName = companyName.trim();
            if (companyName) {
                this.company.name = companyName[0].toUpperCase() + companyName.substr(1, companyName.length);
            } else {
                this.company.name = '';
            }
        }
    }

    public isValidMobileNumber(ele: HTMLInputElement) {
        if (ele.value) {
            this.checkMobileNo(ele);
        }
    }

    public checkMobileNo(ele) {
        try {
            let parsedNumber = this.phoneUtility.parse('+' + this.company.phoneCode + ele.value, this.company.country);
            if (this.phoneUtility.isValidNumber(parsedNumber)) {
                ele.classList.remove('error-box');
                this.isMobileNumberValid = true;
            } else {
                this.isMobileNumberValid = false;
                this._toaster.errorToast('Invalid Contact number');
                ele.classList.add('error-box');
            }
        } catch (error) {
            this.isMobileNumberValid = false;
            this._toaster.errorToast('Invalid Contact number');
            ele.classList.add('error-box');
        }
    }

    public selectCountry(event: IOption) {
        if (event) {
            let phoneCode = event.additional;
            this.company.phoneCode = phoneCode;
            this.company.baseCurrency = this.countryCurrency[event.value];
        }
    }

    private getRandomString(comnanyName, city) {
        // tslint:disable-next-line:one-variable-per-declaration
        let d, dateString, randomGenerate, strings;
        comnanyName = this.removeSpecialCharacters(comnanyName);
        city = this.removeSpecialCharacters(city);
        d = new Date();
        dateString = d.getTime().toString();
        randomGenerate = this.getSixCharRandom();
        strings = [comnanyName, city, dateString, randomGenerate];
        return strings.join('');
    }

    private removeSpecialCharacters(str) {
        let finalString;
        finalString = str.replace(/[^a-zA-Z0-9]/g, '');
        return finalString.substr(0, 6).toLowerCase();
    }

    private getSixCharRandom() {
        return Math.random().toString(36).replace(/[^a-zA-Z0-9]+/g, '').substr(0, 6);
    }

    public getCountry() {
        this.store.pipe(select(s => s.common.countries), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                Object.keys(res).forEach(key => {
                    // Creating Country List
                    this.countrySource.push({
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
                this.countrySource$ = observableOf(this.countrySource);
            } else {
                let countryRequest = new CountryRequest();
                countryRequest.formName = 'onboarding';
                this.store.dispatch(this.commonActions.GetCountry(countryRequest));
            }
        });
    }

    public getCurrency() {
        this.store.pipe(select(s => s.common.currencies), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                Object.keys(res).forEach(key => {
                    this.currencies.push({label: res[key].code, value: res[key].code});
                });
                this.currencySource$ = observableOf(this.currencies);
            } else {
                this.store.dispatch(this.commonActions.GetCurrency());
            }
        });
    }

    public getCallingCodes() {
        this.store.pipe(select(s => s.common.callingcodes), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                Object.keys(res.callingCodes).forEach(key => {
                    this.countryPhoneCode.push({label: res.callingCodes[key], value: res.callingCodes[key]});
                });
                this.callingCodesSource$ = observableOf(this.countryPhoneCode);
            } else {
                this.store.dispatch(this.commonActions.GetCallingCodes());
            }
        });
    }

    public removeCompanySessionData() {
        this._generalService.createNewCompany = null;
        this.store.dispatch(this.commonActions.resetCountry());
        this.store.dispatch(this.companyActions.removeCompanyCreateSession());
    }
}
