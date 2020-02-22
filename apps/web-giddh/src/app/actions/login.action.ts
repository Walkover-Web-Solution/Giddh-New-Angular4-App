import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CompanyResponse, ICurrencyResponse, StateDetailsResponse} from '../models/api-models/Company';
import {Action, Store} from '@ngrx/store';
import {
    LinkedInRequestModel,
    SignupwithEmaillModel,
    SignupWithMobile,
    UserDetails,
    VerifyEmailModel,
    VerifyEmailResponseModel,
    VerifyMobileModel,
    VerifyMobileResponseModel
} from '../models/api-models/loginModels';
import {ToasterService} from '../services/toaster.service';
import {GeneralActions} from './general/general.actions';
import {CompanyActions} from './company.actions';
import {BaseResponse} from '../models/api-models/BaseResponse';
import {ActivatedRoute, Router} from '@angular/router';
import {sortBy} from '../lodash-optimized';
import {COMMON_ACTIONS} from './common.const';
import {AppState} from '../store';
import {Injectable, NgZone} from '@angular/core';
import {map, switchMap, take} from 'rxjs/operators';
import {userLoginStateEnum} from '../models/user-login-state';
import {Actions, Effect} from '@ngrx/effects';
import {DbService} from '../services/db.service';
import {CompanyService} from '../services/companyService.service';
import {GeneralService} from '../services/general.service';
import {Observable, ReplaySubject, zip as observableZip} from 'rxjs';
import {CustomActions} from '../store/customActions';
import {LoginWithPassword, SignUpWithPassword} from '../models/api-models/login';
import {AuthenticationService} from '../services/authentication.service';
import {AccountService} from '../services/account.service';
import {Configuration} from '../app.constant';
import {ROUTES} from '../routes-array';
import {SettingsProfileActions} from "./settings/profile/settings.profile.action";

@Injectable()
export class LoginActions {

    public static RESET_SOCIAL_LOGOUT_ATTEMPT = 'RESET_SOCIAL_LOGOUT_ATTEMPT';
    public static SOCIAL_LOGOUT_ATTEMPT = 'SOCIAL_LOGOUT_ATTEMPT';
    public static SIGNUP_WITH_GOOGLE_REQUEST = 'SIGNUP_WITH_GOOGLE_REQUEST';
    public static SIGNUP_WITH_GOOGLE_RESPONSE = 'SIGNUP_WITH_GOOGLE_RESPONSE';

    public static SIGNUP_WITH_LINKEDIN_REQUEST = 'SIGNUP_WITH_LINKEDIN_REQUEST';
    public static SIGNUP_WITH_LINKEDIN_RESPONSE = 'SIGNUP_WITH_LINKEDIN_RESPONSE';

    public static SignupWithEmailRequest = 'SignupWithEmailRequest';
    public static SignupWithEmailResponce = 'SignupWithEmailResponce';
    public static ResetSignupWithEmailState = 'ResetSignupWithEmailState';
    public static SignupWithMobileRequest = 'SignupWithMobileRequest';
    public static SignupWithMobileResponce = 'SignupWithMobileResponce';

    public static ResetSignupWithMobileState = 'ResetSignupWithMobileState';
    public static VerifyEmailRequest = 'VerifyEmailRequest';
    public static VerifyEmailResponce = 'VerifyEmailResponce';

    public static VerifyMobileRequest = 'VerifyMobileRequest';
    public static VerifyMobileResponce = 'VerifyMobileResponce';
    public static VerifyTwoWayAuthRequest = 'VerifyTwoWayAuthRequest';
    public static VerifyTwoWayAuthResponse = 'VerifyTwoWayAuthResponse';
    public static LoginSuccess = 'LoginSuccess';
    public static LoginSuccessBYUrl = 'LoginSuccessByUrl';
    public static LogOut = 'LoginOut';
    public static ClearSession = 'ClearSession';
    public static SetLoginStatus = 'SetLoginStatus';
    public static GoogleLoginElectron = 'GoogleLoginElectron';
    public static LinkedInLoginElectron = 'LinkedInLoginElectron';
    public static AddNewMobileNo = 'AddNewMobileNo';
    public static AddNewMobileNoResponse = 'AddNewMobileNoResponse';

    public static VerifyAddNewMobileNo = 'VerifyAddNewMobileNo';
    public static VerifyAddNewMobileNoResponse = 'VerifyAddNewMobileNoResponse';
    public static FetchUserDetails = 'FetchUserDetails';
    public static FetchUserDetailsResponse = 'FetchUserDetailsResponse';

    public static AddBalance = 'AddBalance';
    public static AddBalanceResponse = 'AddBalanceResponse';
    public static ResetTwoWayAuthModal = 'ResetTwoWayAuthModal';
    public static SetCurrencyInStore = 'SetCurrencyInStore';

    public static NEEDS_TO_REDIRECT_TO_LEDGER = 'NEEDS_TO_REDIRECT_TO_LEDGER';
    public static RESET_NEEDS_TO_REDIRECT_TO_LEDGER = 'RESET_NEEDS_TO_REDIRECT_TO_LEDGER';

    public static SignupWithPasswdRequest = 'SignupWithPasswdRequest';
    public static SignupWithPasswdResponse = 'SignupWithPasswdResponse';

    public static LoginWithPasswdRequest = 'LoginWithPasswdRequest';
    public static LoginWithPasswdResponse = 'LoginWithPasswdResponse';

    public static forgotPasswordRequest = 'forgotPasswordRequest';
    public static forgotPasswordResponse = 'forgotPasswordResponse';

    public static resetPasswordRequest = 'resetPasswordRequest';
    public static resetPasswordResponse = 'resetPasswordResponse';

    public static renewSessionRequest = 'renewSessionRequest';
    public static renewSessionResponse = 'renewSessionResponse';

    public static AutoLoginWithPasswdResponse = 'AutoLoginWithPasswdResponse';

    @Effect()
    public signupWithGoogle$: Observable<Action> = this.actions$
        .ofType(LoginActions.SIGNUP_WITH_GOOGLE_REQUEST).pipe(
            switchMap((action: CustomActions) =>
                this.auth.LoginWithGoogle(action.payload)
            ),
            map(response => {
                return this.signupWithGoogleResponse(response);
            }));

    @Effect()
    public signupWithGoogleResponse$: Observable<Action> = this.actions$
        .ofType(LoginActions.SIGNUP_WITH_GOOGLE_RESPONSE).pipe(
            map((action: CustomActions) => {
                let response: BaseResponse<VerifyEmailResponseModel, string> = action.payload;
                if (response.status === 'error') {
                    this._toaster.errorToast(action.payload.message, action.payload.code);
                    return {type: 'EmptyAction'};
                }
                if (response.body.statusCode === 'AUTHENTICATE_TWO_WAY') {
                    this.store.dispatch(this.SetLoginStatus(userLoginStateEnum.needTwoWayAuth));
                    return {
                        type: 'EmptyAction'
                    };
                } else {
                    return this.LoginSuccess();
                }
            }));

    @Effect()
    public signupWithLinkedin$: Observable<Action> = this.actions$
        .ofType(LoginActions.SIGNUP_WITH_LINKEDIN_REQUEST).pipe(
            switchMap((action: CustomActions) =>
                this.auth.LoginWithLinkedin(action.payload)
            ),
            map(response => this.signupWithLinkedinResponse(response)));

    @Effect()
    public signupWithLinkedinResponse$: Observable<Action> = this.actions$
        .ofType(LoginActions.SIGNUP_WITH_LINKEDIN_RESPONSE).pipe(
            map((action: CustomActions) => {
                let response: BaseResponse<VerifyEmailResponseModel, string> = action.payload;
                if (response.status === 'error') {
                    this._toaster.errorToast(action.payload.message, action.payload.code);
                    return {type: 'EmptyAction'};
                }
                if (response.body.statusCode === 'AUTHENTICATE_TWO_WAY') {
                    this.store.dispatch(this.SetLoginStatus(userLoginStateEnum.needTwoWayAuth));
                    return {
                        type: 'EmptyAction'
                    };
                } else {
                    return this.LoginSuccess();
                }
            }));

    @Effect()
    public signupWithEmail$: Observable<Action> = this.actions$
        .ofType(LoginActions.SignupWithEmailRequest).pipe(
            switchMap((action: CustomActions) => this.auth.SignupWithEmail(action.payload)),
            map(response => this.SignupWithEmailResponce(response)));

    @Effect()
    public signupWithEmailResponse$: Observable<Action> = this.actions$
        .ofType(LoginActions.SignupWithEmailResponce).pipe(
            map((action: CustomActions) => {
                if (action.payload.status === 'success') {
                    this._toaster.successToast(action.payload.body);
                } else {
                    this._toaster.errorToast(action.payload.message, action.payload.code);
                }
                return {type: 'EmptyAction'};
            }));

    @Effect()
    public verifyEmail$: Observable<Action> = this.actions$
        .ofType(LoginActions.VerifyEmailRequest).pipe(
            switchMap((action: CustomActions) =>
                this.auth.VerifyEmail(action.payload as VerifyEmailModel)
            ),
            map(response => this.VerifyEmailResponce(response)));

    @Effect()
    public verifyEmailResponse$: Observable<Action> = this.actions$
        .ofType(LoginActions.VerifyEmailResponce).pipe(
            map((action: CustomActions) => {
                let response: BaseResponse<VerifyEmailResponseModel, VerifyEmailModel> = action.payload;
                if (response.status === 'error') {
                    this._toaster.errorToast(action.payload.message, action.payload.code);
                    return {type: 'EmptyAction'};
                }
                return this.LoginSuccess();
            }));

    @Effect()
    public signupWithMobile$: Observable<Action> = this.actions$
        .ofType(LoginActions.SignupWithMobileRequest).pipe(
            switchMap((action: CustomActions) => this.auth.SignupWithMobile(action.payload)),
            map(response => this.SignupWithMobileResponce(response)));

    @Effect()
    public signupWithMobileResponse$: Observable<Action> = this.actions$
        .ofType(LoginActions.SignupWithMobileResponce).pipe(
            map((action: CustomActions) => {
                if (action.payload.status === 'success') {
                    this._toaster.successToast(action.payload.body);
                } else {
                    this._toaster.errorToast(action.payload.message, action.payload.code);
                }
                return {type: 'EmptyAction'};
            }));

    @Effect()
    public loginSuccessByURL$: Observable<Action> = this.actions$
        .ofType(LoginActions.LoginSuccessBYUrl).pipe(
            switchMap((action) => {
                console.log("YES");
                return observableZip(this._companyService.getStateDetails(''), this._companyService.CompanyList(), this._companyService.CurrencyList());
            }), map((results: any[]) => {
                console.log("YES2");
                /* check if local storage is cleared or not for first time
				 for application menu set up in localstorage */

                let isNewMenuSetted = localStorage.getItem('isNewMenuSetted');
                let isMenuUpdated = localStorage.getItem('isMenuUpdated');

                if (!JSON.parse(isNewMenuSetted) || (JSON.parse(isNewMenuSetted) && !isMenuUpdated)) {
                    this._dbService.clearAllData();
                    localStorage.setItem('isNewMenuSetted', true.toString());
                    localStorage.setItem('isMenuUpdated', true.toString());
                }

                let cmpUniqueName = '';
                let stateDetail = results[0] as BaseResponse<StateDetailsResponse, string>;
                let companies = results[1] as BaseResponse<CompanyResponse[], string>;
                let currencies = results[2] as BaseResponse<ICurrencyResponse[], string>;
                if (currencies.body && currencies.status === 'success') {
                    this.store.dispatch(this.SetCurrencyInStore(currencies.body));
                }
                if (companies.body && companies.body.length === 0) {
                    this.store.dispatch(this.SetLoginStatus(userLoginStateEnum.newUserLoggedIn));
                    this.zone.run(() => {
                        this._router.navigate(['/pages/new-user']);
                    });
                    return {type: 'EmptyAction'};
                } else {
                    if (stateDetail.body && stateDetail.status === 'success') {
                        this._generalService.companyUniqueName = stateDetail.body.companyUniqueName;
                        cmpUniqueName = stateDetail.body.companyUniqueName;
                        if (companies.body.findIndex(p => p.uniqueName === cmpUniqueName) > -1 && ROUTES.findIndex(p => p.path.split('/')[0] === stateDetail.body.lastState.split('/')[0]) > -1) {
                            return this.finalThingTodo(stateDetail, companies);
                        } else {
                            // old user fail safe scenerio
                            return this.doSameStuffs(companies);
                        }
                    } else {
                        /**
                         * if user is new and signed up by shared entity
                         * find the entity and redirect user according to terms.
                         * shared entities [GROUP, COMPANY, ACCOUNT]
                         */
                        return this.doSameStuffs(companies);
                    }
                }
            }));
    @Effect()
    public loginSuccess$: Observable<Action> = this.actions$
        .ofType(LoginActions.LoginSuccess).pipe(
            switchMap((action) => {
                console.log("YES");
                return observableZip(this._companyService.getStateDetails(''), this._companyService.CompanyList(), this._companyService.CurrencyList());
            }), map((results: any[]) => {
                console.log("YES2");
                /* check if local storage is cleared or not for first time
                 for application menu set up in localstorage */

                let isNewMenuSetted = localStorage.getItem('isNewMenuSetted');
                let isMenuUpdated = localStorage.getItem('isMenuUpdated');

                if (!JSON.parse(isNewMenuSetted) || (JSON.parse(isNewMenuSetted) && !isMenuUpdated)) {
                    this._dbService.clearAllData();
                    localStorage.setItem('isNewMenuSetted', true.toString());
                    localStorage.setItem('isMenuUpdated', true.toString());
                }

                let cmpUniqueName = '';
                let stateDetail = results[0] as BaseResponse<StateDetailsResponse, string>;
                let companies = results[1] as BaseResponse<CompanyResponse[], string>;
                let currencies = results[2] as BaseResponse<ICurrencyResponse[], string>;
                if (currencies.body && currencies.status === 'success') {
                    this.store.dispatch(this.SetCurrencyInStore(currencies.body));
                }
                if (companies.body && companies.body.length === 0) {
                    this.store.dispatch(this.SetLoginStatus(userLoginStateEnum.newUserLoggedIn));
                    this.zone.run(() => {
                        this._router.navigate(['/pages/new-user']);
                    });
                    return {type: 'EmptyAction'};
                } else {
                    if (stateDetail.body && stateDetail.status === 'success') {
                        this._generalService.companyUniqueName = stateDetail.body.companyUniqueName;
                        cmpUniqueName = stateDetail.body.companyUniqueName;
                        if (companies.body.findIndex(p => p.uniqueName === cmpUniqueName) > -1 && ROUTES.findIndex(p => p.path.split('/')[0] === stateDetail.body.lastState.split('/')[0]) > -1) {
                            return this.finalThingTodo(stateDetail, companies);
                        } else {
                            // old user fail safe scenerio
                            return this.doSameStuffs(companies);
                        }
                    } else {
                        /**
                         * if user is new and signed up by shared entity
                         * find the entity and redirect user according to terms.
                         * shared entities [GROUP, COMPANY, ACCOUNT]
                         */
                        return this.doSameStuffs(companies);
                    }
                }
            }));

    @Effect()
    public logoutSuccess$: Observable<Action> = this.actions$
        .ofType(LoginActions.LogOut).pipe(
            map((action: CustomActions) => {
                if (PRODUCTION_ENV && !(isElectron || isCordova)) {
                    window.location.href = 'https://giddh.com/login/';
                } else if (isCordova) {
                    this.zone.run(() => {
                        this._generalService.invokeEvent.next('logoutCordova');
                        this._router.navigate(['login']);
                    });
                } else {
                    window.location.href = AppUrl + 'login/';
                }
                return {type: 'EmptyAction'};
            }));

    @Effect()
    public verifyMobile$: Observable<Action> = this.actions$
        .ofType(LoginActions.VerifyMobileRequest).pipe(
            switchMap((action: CustomActions) =>
                this.auth.VerifyOTP(action.payload as VerifyMobileModel)
            ),
            map(response => this.VerifyMobileResponce(response)));

    @Effect()
    public verifyMobileResponse$: Observable<Action> = this.actions$
        .ofType(LoginActions.VerifyMobileResponce).pipe(
            map((action: CustomActions) => {
                let response: BaseResponse<VerifyMobileResponseModel, VerifyMobileModel> = action.payload;
                if (response.status === 'error') {
                    this._toaster.errorToast(action.payload.message, action.payload.code);
                    return {type: 'EmptyAction'};
                }
                return this.LoginSuccess();
            }));

    @Effect()
    public verifyTwoWayAuth$: Observable<Action> = this.actions$
        .ofType(LoginActions.VerifyTwoWayAuthRequest).pipe(
            switchMap((action: CustomActions) =>
                this.auth.VerifyOTP(action.payload as VerifyMobileModel)
            ),
            map(response => this.VerifyTwoWayAuthResponse(response)));

    @Effect()
    public verifyTwoWayAuthResponse$: Observable<Action> = this.actions$
        .ofType(LoginActions.VerifyTwoWayAuthResponse).pipe(
            map((action: CustomActions) => {
                let response: BaseResponse<VerifyMobileResponseModel, VerifyMobileModel> = action.payload;
                if (response.status === 'error') {
                    this._toaster.errorToast(response.message, response.code);
                    return {type: 'EmptyAction'};
                }
                return this.LoginSuccess();
            }));

    @Effect()
    public GoogleElectronLogin$: Observable<Action> = this.actions$
        .ofType(LoginActions.GoogleLoginElectron).pipe(
            switchMap((action: CustomActions) => {
                return this.http.get(Configuration.ApiUrl + 'v2/login-with-google', {
                    headers: action.payload,
                    responseType: 'json'
                }).pipe(map(p => p as BaseResponse<VerifyEmailResponseModel, string>));
            }),
            map(data => {
                if (data.status === 'error') {
                    this._toaster.errorToast(data.message, data.code);
                    return {type: 'EmptyAction'};
                }
                // return this.LoginSuccess();
                return this.signupWithGoogleResponse(data);
            }));

    @Effect()
    public LinkedInElectronLogin$: Observable<Action> = this.actions$
        .ofType(LoginActions.LinkedInLoginElectron).pipe(
            switchMap((action: CustomActions) => {
                let args: any = {headers: {}};
                args.headers['cache-control'] = 'no-cache';
                args.headers['Content-Type'] = 'application/json';
                args.headers['Accept'] = 'application/json';
                args.headers['Access-Token'] = action.payload;
                args.headers = new HttpHeaders(args.headers);
                return this.http.get(Configuration.ApiUrl + 'v2/login-with-linkedIn', {
                    headers: args.headers,
                    responseType: 'json'
                }).pipe(map(p => p as BaseResponse<VerifyEmailResponseModel, string>));
            }),
            map(data => {
                if (data.status === 'error') {
                    this._toaster.errorToast(data.message, data.code);
                    return {type: 'EmptyAction'};
                }
                // return this.LoginSuccess();
                return this.signupWithGoogleResponse(data);
            }));

    @Effect()
    public ClearSession$: Observable<Action> = this.actions$
        .ofType(LoginActions.ClearSession).pipe(
            switchMap((action: CustomActions) => {
                return this.auth.ClearSession();
            }), map(data => {
                return this.LogOut();
            }));

    @Effect()
    public CHANGE_COMPANY$: Observable<Action> = this.actions$
        .ofType(CompanyActions.CHANGE_COMPANY).pipe(
            switchMap((action: CustomActions) => this._companyService.getStateDetails(action.payload)),
            map(response => {
                if ((response.status === 'error' || ROUTES.findIndex(p => p.path.split('/')[0] === response.body.lastState.split('/')[0]) === -1) || (response.status === 'error' || response.code === 'NOT_FOUND')) {
                    //
                    let dummyResponse = new BaseResponse<StateDetailsResponse, string>();
                    dummyResponse.body = new StateDetailsResponse();
                    dummyResponse.body.companyUniqueName = response.request;
                    dummyResponse.body.lastState = 'sales';
                    dummyResponse.status = 'success';
                    this._router.navigateByUrl('/dummy', {skipLocationChange: true}).then(() => {
                        this._router.navigate([dummyResponse.body.lastState]);
                    });
                    return this.ChangeCompanyResponse(dummyResponse);
                }
                if (response.body.companyUniqueName) {
                    if (response.body.lastState && ROUTES.findIndex(p => p.path.split('/')[0] === response.body.lastState.split('/')[0]) !== -1) {
                        this._router.navigateByUrl('/dummy', {skipLocationChange: true}).then(() => {
                            this._router.navigate([response.body.lastState]);
                        });
                    } else {
                        if (this.activatedRoute.children && this.activatedRoute.children.length > 0) {
                            if (this.activatedRoute.firstChild.children && this.activatedRoute.firstChild.children.length > 0) {
                                let path = [];
                                let parament = {};
                                this.activatedRoute.firstChild.firstChild.url.pipe(take(1)).subscribe(p => {
                                    if (p.length > 0) {
                                        path = [p[0].path];
                                        parament = {queryParams: p[0].parameters};
                                    }
                                });
                                if (path.length > 0 && parament) {
                                    this._router.navigateByUrl('/dummy', {skipLocationChange: true}).then(() => {
                                        if (ROUTES.findIndex(p => p.path.split('/')[0] === path[0].split('/')[0]) > -1) {
                                            this._router.navigate([path[0]], parament);
                                        } else {
                                            this._router.navigate(['home']);
                                        }
                                    });
                                }
                            }
                        }
                    }
                }

                return this.ChangeCompanyResponse(response);
            }));

    @Effect()
    public ChangeCompanyResponse$: Observable<Action> = this.actions$
        .ofType(CompanyActions.CHANGE_COMPANY_RESPONSE).pipe(
            map((action: CustomActions) => {
                if (action.payload.status === 'success') {
                    // get groups with accounts for general use
                    this.store.dispatch(this._generalAction.getGroupWithAccounts());
                    this.store.dispatch(this._generalAction.getFlattenAccount());
                    this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
                }
                return {type: 'EmptyAction'};
            }));

    @Effect()
    public addNewMobile$: Observable<Action> = this.actions$
        .ofType(LoginActions.AddNewMobileNo).pipe(
            switchMap((action: CustomActions) => this.auth.VerifyNumber(action.payload)),
            map(response => this.AddNewMobileNoResponce(response)));

    @Effect()
    public addNewMobileResponse$: Observable<Action> = this.actions$
        .ofType(LoginActions.AddNewMobileNoResponse).pipe(
            map((action: CustomActions) => {
                if (action.payload.status === 'success') {
                    this._toaster.successToast('You will receive a verification code on your mobile shortly.');
                } else {
                    this._toaster.errorToast(action.payload.message, action.payload.code);
                }
                return {type: 'EmptyAction'};
            }));

    @Effect()
    public verifyAddNewMobile$: Observable<Action> = this.actions$
        .ofType(LoginActions.VerifyAddNewMobileNo).pipe(
            switchMap((action: CustomActions) =>
                this.auth.VerifyNumberOTP(action.payload as VerifyMobileModel)
            ),
            map(response => this.VerifyAddNewMobileNoResponce(response)));

    @Effect()
    public verifyAddNewMobileResponse$: Observable<Action> = this.actions$
        .ofType(LoginActions.VerifyAddNewMobileNoResponse).pipe(
            map((action: CustomActions) => {
                let response: BaseResponse<string, VerifyMobileModel> = action.payload;
                if (response.status === 'error') {
                    this._toaster.errorToast(response.message, response.code);
                    return {type: 'EmptyAction'};
                }
                this._toaster.successToast(response.body);
                return this.FetchUserDetails();
            }));

    @Effect()
    public FectchUserDetails$: Observable<Action> = this.actions$
        .ofType(LoginActions.FetchUserDetails).pipe(
            switchMap((action: CustomActions) => this.auth.FetchUserDetails()),
            map(response => this.FetchUserDetailsResponse(response)));

    @Effect()
    public FectchUserDetailsResponse$: Observable<Action> = this.actions$
        .ofType(LoginActions.FetchUserDetailsResponse).pipe(
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toaster.errorToast(action.payload.message, action.payload.code);
                }
                return {type: 'EmptyAction'};
            }));

    @Effect()
    public AddBalance$: Observable<Action> = this.actions$
        .ofType(LoginActions.AddBalance).pipe(
            switchMap((action: CustomActions) => this.auth.AddBalance(action.payload)),
            map(response => this.AddBalanceResponse(response)));

    @Effect()
    public AddBalanceResponse$: Observable<Action> = this.actions$
        .ofType(LoginActions.AddBalanceResponse).pipe(
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toaster.errorToast(action.payload.message, action.payload.code);
                }
                return {type: 'EmptyAction'};
            }));

    @Effect()
    public ReportInvalidJSON$: Observable<Action> = this.actions$
        .ofType('REPORT_INVALID_JSON').pipe(
            switchMap((action: CustomActions) => this.auth.ReportInvalidJSON(action.payload)),
            map((res) => {
                return {type: 'EmptyAction'};
            }));

    @Effect()
    public SignupWithPasswdRequest$: Observable<Action> = this.actions$
        .ofType(LoginActions.SignupWithPasswdRequest).pipe(
            switchMap((action: CustomActions) => this.auth.SignupWithPassword(action.payload)),
            map(response => this.SignupWithPasswdResponse(response)));

    @Effect()
    public SignupWithPasswdResponse$: Observable<Action> = this.actions$
        .ofType(LoginActions.SignupWithPasswdResponse).pipe(
            map((action: CustomActions) => {
                if (action.payload.status === 'success') {
                    this._toaster.successToast('A verification code has been sent to your email account.');
                    // this.store.dispatch(this.SetLoginStatus(userLoginStateEnum.newUserLoggedIn));
                    // this._router.navigate(['/pages/new-user']);
                    return {type: 'EmptyAction'};
                } else {
                    this._toaster.errorToast(action.payload.message, action.payload.code);
                }
                return {type: 'EmptyAction'};
            }));

    @Effect()
    public LoginWithPasswdRequest$: Observable<Action> = this.actions$
        .ofType(LoginActions.LoginWithPasswdRequest).pipe(
            switchMap((action: CustomActions) => this.auth.LoginWithPassword(action.payload)),
            map(response => this.LoginWithPasswdResponse(response)));

    @Effect()
    public LoginWithPasswdResponse$: Observable<Action> = this.actions$
        .ofType(LoginActions.LoginWithPasswdResponse).pipe(
            map((action: CustomActions) => {
                if (action.payload.status === 'success') {

                    if (action.payload.body.statusCode === "AUTHENTICATE_TWO_WAY") {
                        if (action.payload.body.text) {
                            this._toaster.successToast(action.payload.body.text, action.payload.code);
                        }
                    } else if (action.payload.body.user.isVerified) {
                        return this.LoginSuccess();
                    }
                } else {
                    this._toaster.errorToast(action.payload.message, action.payload.code);
                }
                return {type: 'EmptyAction'};
            }));

    @Effect()
    public forgotPasswordRequest$: Observable<Action> = this.actions$
        .ofType(LoginActions.forgotPasswordRequest).pipe(
            switchMap((action: CustomActions) => this.auth.forgotPassword(action.payload)),
            map(response => this.forgotPasswordResponse(response)));

    @Effect()
    public forgotPasswordResponse$: Observable<Action> = this.actions$
        .ofType(LoginActions.forgotPasswordResponse).pipe(
            map((action: CustomActions) => {
                if (action.payload.status === 'success') {
                    // return this.LoginSuccess();
                    this._toaster.successToast(action.payload.body);
                } else {
                    this._toaster.errorToast(action.payload.message, action.payload.code);
                }
                return {type: 'EmptyAction'};
            }));

    @Effect()
    public resetPasswordRequest$: Observable<Action> = this.actions$
        .ofType(LoginActions.resetPasswordRequest).pipe(
            switchMap((action: CustomActions) => this.auth.resetPassword(action.payload)),
            map(response => this.resetPasswordResponse(response)));

    @Effect()
    public resetPasswordResponse$: Observable<Action> = this.actions$
        .ofType(LoginActions.resetPasswordResponse).pipe(
            map((action: CustomActions) => {
                if (action.payload.status === 'success') {
                    // return this.LoginSuccess();
                    this._toaster.successToast(action.payload.body);
                } else {
                    this._toaster.errorToast(action.payload.message, action.payload.code);
                }
                return {type: 'EmptyAction'};
            }));

    @Effect()
    public renewSession$: Observable<Action> = this.actions$
        .ofType(LoginActions.renewSessionRequest).pipe(
            switchMap((action: CustomActions) => this.auth.renewSession()),
            map(response => this.renewSessionResponse(response)));

    @Effect()
    public renewSessionResponse$: Observable<Action> = this.actions$
        .ofType(LoginActions.renewSessionResponse).pipe(
            map((action: CustomActions) => {
                return {type: 'EmptyAction'};
            }));

    @Effect()
    public autoLoginwithPasswordResponse$: Observable<Action> = this.actions$
        .ofType(LoginActions.AutoLoginWithPasswdResponse).pipe(
            map((action: CustomActions) => this.LoginSuccessByOtherUrl()));

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        public _router: Router,
        private actions$: Actions,
        private auth: AuthenticationService,
        public _toaster: ToasterService,
        private store: Store<AppState>,
        private comapnyActions: CompanyActions,
        private _companyService: CompanyService,
        private http: HttpClient,
        private _generalService: GeneralService,
        private _accountService: AccountService,
        private activatedRoute: ActivatedRoute,
        private _generalAction: GeneralActions,
        private _dbService: DbService,
        private settingsProfileActions: SettingsProfileActions,
        private zone: NgZone
    ) {
    }

    public SetRedirectToledger(): CustomActions {
        return {
            type: LoginActions.NEEDS_TO_REDIRECT_TO_LEDGER
        };
    }

    public ResetRedirectToledger(): CustomActions {
        return {
            type: LoginActions.RESET_NEEDS_TO_REDIRECT_TO_LEDGER
        };
    }

    public SignupWithEmailRequest(value: SignupwithEmaillModel): CustomActions {
        return {
            type: LoginActions.SignupWithEmailRequest,
            payload: value
        };
    }

    public SignupWithEmailResponce(value: BaseResponse<string, string>): CustomActions {
        return {
            type: LoginActions.SignupWithEmailResponce,
            payload: value
        };
    }

    public ResetSignupWithEmailState(): CustomActions {
        return {
            type: LoginActions.ResetSignupWithEmailState
        };
    }

    public SignupWithMobileRequest(value: SignupWithMobile): CustomActions {
        return {
            type: LoginActions.SignupWithMobileRequest,
            payload: value
        };
    }

    public SignupWithMobileResponce(value: BaseResponse<string, SignupWithMobile>): CustomActions {
        return {
            type: LoginActions.SignupWithMobileResponce,
            payload: value
        };
    }

    public ResetSignupWithMobileState(): CustomActions {
        return {
            type: LoginActions.ResetSignupWithMobileState
        };
    }

    public VerifyEmailRequest(value: VerifyEmailModel): CustomActions {
        return {
            type: LoginActions.VerifyEmailRequest,
            payload: value
        };
    }

    public VerifyEmailResponce(value: BaseResponse<VerifyEmailResponseModel, VerifyEmailModel>): CustomActions {
        return {
            type: LoginActions.VerifyEmailResponce,
            payload: value
        };
    }

    public signupWithGoogle(value: string): CustomActions {
        return {
            type: LoginActions.SIGNUP_WITH_GOOGLE_REQUEST,
            payload: value
        };
    }

    public signupWithGoogleResponse(value: BaseResponse<VerifyEmailResponseModel, string>): CustomActions {
        return {
            type: LoginActions.SIGNUP_WITH_GOOGLE_RESPONSE,
            payload: value
        };
    }

    public signupWithLinkedin(value: LinkedInRequestModel): CustomActions {
        return {
            type: LoginActions.SIGNUP_WITH_LINKEDIN_REQUEST,
            payload: value
        };
    }

    public signupWithLinkedinResponse(value: BaseResponse<VerifyEmailResponseModel, LinkedInRequestModel>): CustomActions {
        return {
            type: LoginActions.SIGNUP_WITH_LINKEDIN_RESPONSE,
            payload: value
        };
    }

    public resetSocialLogoutAttempt(): CustomActions {
        return {
            type: LoginActions.RESET_SOCIAL_LOGOUT_ATTEMPT
        };
    }

    public socialLogoutAttempt(): CustomActions {
        return {
            type: LoginActions.SOCIAL_LOGOUT_ATTEMPT
        };
    }

    public VerifyMobileRequest(value: VerifyMobileModel): CustomActions {
        return {
            type: LoginActions.VerifyMobileRequest,
            payload: value
        };
    }

    public VerifyMobileResponce(value: BaseResponse<VerifyMobileResponseModel, VerifyMobileModel>): CustomActions {
        return {
            type: LoginActions.VerifyMobileResponce,
            payload: value
        };
    }

    public VerifyTwoWayAuthRequest(value: VerifyMobileModel): CustomActions {
        return {
            type: LoginActions.VerifyTwoWayAuthRequest,
            payload: value
        };
    }

    public VerifyTwoWayAuthResponse(value: BaseResponse<VerifyMobileResponseModel, VerifyMobileModel>): CustomActions {
        return {
            type: LoginActions.VerifyTwoWayAuthResponse,
            payload: value
        };
    }

    public resetTwoWayAuthModal(): CustomActions {
        return {
            type: LoginActions.ResetTwoWayAuthModal
        };
    }

    public LoginSuccess(): CustomActions {

        return {
            type: LoginActions.LoginSuccess,
            payload: null
        };
    }

    public LoginSuccessByOtherUrl(): CustomActions {
        console.log("LOGINS");
        return {
            type: LoginActions.LoginSuccessBYUrl,
            payload: null
        };
    }


    public LogOut(): CustomActions {
        return {
            type: LoginActions.LogOut
        };
    }

    public SetLoginStatus(value: userLoginStateEnum): CustomActions {
        return {
            type: LoginActions.SetLoginStatus,
            payload: value
        };
    }

    public GoogleElectronLogin(value: any): CustomActions {
        return {
            type: LoginActions.GoogleLoginElectron,
            payload: value
        };
    }

    public LinkedInElectronLogin(value: any): CustomActions {
        return {
            type: LoginActions.LinkedInLoginElectron,
            payload: value
        };
    }

    public ClearSession(): CustomActions {
        return {
            type: LoginActions.ClearSession
        };
    }

    public ChangeCompany(cmpUniqueName: string): CustomActions {
        return {
            type: CompanyActions.CHANGE_COMPANY,
            payload: cmpUniqueName
        };
    }

    public ChangeCompanyResponse(value: BaseResponse<StateDetailsResponse, string>): CustomActions {
        this.store.dispatch(this.ResetApplicationData());
        return {
            type: CompanyActions.CHANGE_COMPANY_RESPONSE,
            payload: value
        };
    }

    public ResetApplicationData(): CustomActions {
        return {
            type: COMMON_ACTIONS.RESET_APPLICATION_DATA
        };
    }

    public AddNewMobileNo(value: SignupWithMobile): CustomActions {
        return {
            type: LoginActions.AddNewMobileNo,
            payload: value
        };
    }

    public AddNewMobileNoResponce(value: BaseResponse<string, SignupWithMobile>): CustomActions {
        return {
            type: LoginActions.AddNewMobileNoResponse,
            payload: value
        };
    }

    public VerifyAddNewMobileNo(value: VerifyMobileModel): CustomActions {
        return {
            type: LoginActions.VerifyAddNewMobileNo,
            payload: value
        };
    }

    public VerifyAddNewMobileNoResponce(value: BaseResponse<string, VerifyMobileModel>): CustomActions {
        return {
            type: LoginActions.VerifyAddNewMobileNoResponse,
            payload: value
        };
    }

    public FetchUserDetails(): CustomActions {
        return {
            type: LoginActions.FetchUserDetails
        };
    }

    public FetchUserDetailsResponse(resp: BaseResponse<UserDetails, string>): CustomActions {
        return {
            type: LoginActions.FetchUserDetailsResponse,
            payload: resp
        };
    }

    public AddBalance(): CustomActions {
        return {
            type: LoginActions.AddBalance
        };
    }

    public AddBalanceResponse(resp: BaseResponse<string, string>): CustomActions {
        return {
            type: LoginActions.AddBalanceResponse,
            payload: resp
        };
    }

    public SetCurrencyInStore(resp: ICurrencyResponse[]): CustomActions {
        return {
            type: LoginActions.SetCurrencyInStore,
            payload: resp
        };
    }

    public SignupWithPasswdRequest(value: object): CustomActions {
        return {
            type: LoginActions.SignupWithPasswdRequest,
            payload: value
        };
    }

    public SignupWithPasswdResponse(value: BaseResponse<VerifyMobileResponseModel, SignUpWithPassword>): CustomActions {
        return {
            type: LoginActions.SignupWithPasswdResponse,
            payload: value
        };
    }

    public LoginWithPasswdRequest(value: LoginWithPassword): CustomActions {
        return {
            type: LoginActions.LoginWithPasswdRequest,
            payload: value
        };
    }

    public LoginWithPasswdResponse(value: BaseResponse<VerifyMobileResponseModel, LoginWithPassword>): CustomActions {
        return {
            type: LoginActions.LoginWithPasswdResponse,
            payload: value
        };
    }

    public forgotPasswordRequest(userId): CustomActions {
        return {
            type: LoginActions.forgotPasswordRequest,
            payload: userId
        };
    }

    public forgotPasswordResponse(response): CustomActions {
        return {
            type: LoginActions.forgotPasswordResponse,
            payload: response
        };
    }

    public resetPasswordRequest(model): CustomActions {
        return {
            type: LoginActions.resetPasswordRequest,
            payload: model
        };
    }

    public resetPasswordResponse(response): CustomActions {
        return {
            type: LoginActions.resetPasswordResponse,
            payload: response
        };
    }

    public renewSession(): CustomActions {
        return {
            type: LoginActions.renewSessionRequest,
        };
    }

    public renewSessionResponse(response): CustomActions {
        return {
            type: LoginActions.renewSessionResponse,
            payload: response
        };
    }

    public userAutoLoginResponse(response): CustomActions {
        console.log(response);
        return {
            type: LoginActions.AutoLoginWithPasswdResponse,
            payload: response
        };
    }

    private doSameStuffs(companies) {
        let respState = new BaseResponse<StateDetailsResponse, string>();
        respState.body = new StateDetailsResponse();
        companies.body = sortBy(companies.body, ['name']);
        // now take first company from the companies
        let cArr = companies.body.sort((a, b) => a.name.length - b.name.length);
        let company = cArr[0];
        respState.body.companyUniqueName = company.uniqueName;
        respState.status = 'success';
        respState.request = '';
        respState.body.lastState = 'home';
        // check for entity and override last state ['GROUP', 'ACCOUNT']
        try {
            if (company.userEntityRoles && company.userEntityRoles.length) {
                // find sorted userEntityRoles
                let entitiesArr = company.userEntityRoles.sort((a, b) => a.entity.name.length - b.entity.name.length);
                let entityObj = entitiesArr[0].entity;
                if (entityObj.entity === 'ACCOUNT') {
                    respState.body.lastState = `ledger/${entityObj.uniqueName}`;
                } else if (entityObj.entity === 'GROUP') {
                    // get a/c`s of group and set first a/c
                    this.store.dispatch(this.SetRedirectToledger());
                } else {
                    respState.body.lastState = 'home';
                }
            }
        } catch (error) {
            respState.body.lastState = 'home';
        }
        return this.finalThingTodo(respState, companies);
    }

    private finalThingTodo(stateDetail: any, companies: any) {
        this.store.dispatch(this.comapnyActions.GetStateDetailsResponse(stateDetail));
        this.store.dispatch(this.comapnyActions.RefreshCompaniesResponse(companies));
        this.store.dispatch(this.SetLoginStatus(userLoginStateEnum.userLoggedIn));
        this._router.navigate([stateDetail.body.lastState]);
        if (isElectron || isCordova) {
            window.location.reload();
        }
        return {type: 'EmptyAction'};
    }
}
