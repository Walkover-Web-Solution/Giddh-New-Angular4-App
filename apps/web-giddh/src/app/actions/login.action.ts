import { CompanyResponse, ICurrencyResponse, Organization, StateDetailsResponse } from '../models/api-models/Company';
import { Action, Store, select } from '@ngrx/store';
import {
    SignupwithEmaillModel,
    SignupWithMobile,
    UserDetails,
    VerifyEmailModel,
    VerifyEmailResponseModel,
    VerifyMobileModel,
    VerifyMobileResponseModel
} from '../models/api-models/loginModels';
import { ToasterService } from '../services/toaster.service';
import { GeneralActions } from './general/general.actions';
import { CompanyActions } from './company.actions';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { ActivatedRoute, Router } from '@angular/router';
import { sortBy } from '../lodash-optimized';
import { COMMON_ACTIONS } from './common.const';
import { AppState } from '../store';
import { Injectable, NgZone } from '@angular/core';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { OrganizationType, userLoginStateEnum } from '../models/user-login-state';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DbService } from '../services/db.service';
import { CompanyService } from '../services/company.service';
import { GeneralService } from '../services/general.service';
import { Observable, zip as observableZip } from 'rxjs';
import { CustomActions } from '../store/custom-actions';
import { LoginWithPassword, SignUpWithPassword } from '../models/api-models/login';
import { AuthenticationService } from '../services/authentication.service';
import { ROUTES } from '../routes-array';
import { SettingsProfileActions } from "./settings/profile/settings.profile.action";
import { LocaleService } from '../services/locale.service';

@Injectable()
export class LoginActions {

    public static RESET_SOCIAL_LOGOUT_ATTEMPT = 'RESET_SOCIAL_LOGOUT_ATTEMPT';
    public static SOCIAL_LOGOUT_ATTEMPT = 'SOCIAL_LOGOUT_ATTEMPT';
    public static SIGNUP_WITH_GOOGLE_REQUEST = 'SIGNUP_WITH_GOOGLE_REQUEST';
    public static SIGNUP_WITH_GOOGLE_RESPONSE = 'SIGNUP_WITH_GOOGLE_RESPONSE';

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
    public static AddNewMobileNo = 'AddNewMobileNo';
    public static AddNewMobileNoResponse = 'AddNewMobileNoResponse';

    public static VerifyAddNewMobileNo = 'VerifyAddNewMobileNo';
    public static VerifyAddNewMobileNoResponse = 'VerifyAddNewMobileNoResponse';
    public static FetchUserDetails = 'FetchUserDetails';
    public static FetchUserDetailsResponse = 'FetchUserDetailsResponse';

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

    public static hideTwoWayOtpPopup = 'hideTwoWayOtpPopup';

    public signupWithGoogle$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(LoginActions.SIGNUP_WITH_GOOGLE_REQUEST),
            switchMap((action: CustomActions) =>
                this.auth.LoginWithGoogle(action.payload)
            ),
            map(response => {
                return this.signupWithGoogleResponse(response);
            })));

    public signupWithGoogleResponse$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(LoginActions.SIGNUP_WITH_GOOGLE_RESPONSE),
            map((action: CustomActions) => {
                let response: BaseResponse<VerifyEmailResponseModel, string> = action?.payload;
                if (response) {
                    if (response.status === 'error') {
                        this._toaster.errorToast(action.payload.message, action.payload.code);
                        return { type: 'EmptyAction' };
                    }
                    if (response.body && response.body.statusCode === 'AUTHENTICATE_TWO_WAY') {
                        this.store.dispatch(this.SetLoginStatus(userLoginStateEnum.needTwoWayAuth));
                        return {
                            type: 'EmptyAction'
                        };
                    } else {
                        return this.LoginSuccess(response, true);
                    }
                } else {
                    return {
                        type: 'EmptyAction'
                    };
                }
            })));

    public signupWithEmail$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(LoginActions.SignupWithEmailRequest),
            switchMap((action: CustomActions) => this.auth.SignupWithEmail(action.payload)),
            map(response => this.SignupWithEmailResponce(response))));

    public signupWithEmailResponse$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(LoginActions.SignupWithEmailResponce),
            map((action: CustomActions) => {
                if (action.payload?.status === 'success') {
                    this._toaster.successToast(action.payload.body);
                } else {
                    this._toaster.errorToast(action.payload.message, action.payload.code);
                }
                return { type: 'EmptyAction' };
            })));

    public verifyEmail$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(LoginActions.VerifyEmailRequest),
            switchMap((action: CustomActions) =>
                this.auth.VerifyEmail(action.payload as VerifyEmailModel)
            ),
            map(response => this.VerifyEmailResponce(response))));

    public verifyEmailResponse$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(LoginActions.VerifyEmailResponce),
            map((action: CustomActions) => {
                let response: BaseResponse<VerifyEmailResponseModel, VerifyEmailModel> = action?.payload;
                if (response?.status === 'error') {
                    this._toaster.errorToast(action.payload.message, action.payload.code);
                    return { type: 'EmptyAction' };
                }
                return this.LoginSuccess();
            })));

    public signupWithMobile$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(LoginActions.SignupWithMobileRequest),
            switchMap((action: CustomActions) => this.auth.SignupWithMobile(action.payload)),
            map(response => this.SignupWithMobileResponce(response))));

    public signupWithMobileResponse$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(LoginActions.SignupWithMobileResponce),
            map((action: CustomActions) => {
                if (action.payload?.status === 'success') {
                    this._toaster.successToast(action.payload.body);
                } else {
                    this._toaster.errorToast(action.payload.message, action.payload.code);
                }
                return { type: 'EmptyAction' };
            })));

    public loginSuccessByURL$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(LoginActions.LoginSuccessBYUrl),
            switchMap((action) => {
                console.log("Login Init");
                return observableZip(this._companyService.getStateDetails('', true), this._companyService.CompanyList());
            }), map((results: any[]) => {
                console.log("Login Success");
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

                if (companies.body && companies.body.length === 0) {
                    this.store.dispatch(this.SetLoginStatus(userLoginStateEnum.newUserLoggedIn));
                    this.zone.run(() => {
                        this.store.pipe(
                            select(state => state.session.user),
                            take(1), // take only the first emission
                            tap(response => {
                                const hasSubscriptionPermission = response?.user?.hasSubscriptionPermission;
                                if (hasSubscriptionPermission) {
                                    this._router.navigate(['/pages/subscription']);
                                } else {
                                    this._router.navigate(['/pages/subscription/buy-plan/' + (localStorage.getItem('Country-Region') ?? '')]);
                                }
                            })
                        ).subscribe();
                    });
                    return { type: 'EmptyAction' };
                } else {
                    if (stateDetail.body && stateDetail?.status === 'success') {
                        this._generalService.companyUniqueName = stateDetail.body.companyUniqueName;
                        this._generalService.currentBranchUniqueName = stateDetail.body.branchUniqueName || '';
                        if (stateDetail.body.branchUniqueName) {
                            const details = {
                                branchDetails: {
                                    uniqueName: this._generalService.currentBranchUniqueName
                                }
                            };
                            const organization: Organization = {
                                type: OrganizationType.Branch,
                                uniqueName: this._generalService.companyUniqueName || '',
                                details
                            };
                            this.store.dispatch(this.companyActions.setCompanyBranch(organization));
                        }
                        cmpUniqueName = stateDetail.body.companyUniqueName;
                        if (companies?.body?.findIndex(p => p?.uniqueName === cmpUniqueName) > -1 && ROUTES.findIndex(p => p.path.split('/')[0] === stateDetail.body.lastState.split('/')[0]) > -1) {
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
            })));

    public loginSuccess$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(LoginActions.LoginSuccess),
            switchMap((action: CustomActions) => {
                console.log("Login Init");
                return observableZip(this._companyService.getStateDetails('', true), this._companyService.CompanyList(), [action.payload]);
            }), map((results: any[]) => {
                console.log("Login Success");
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

                if (companies.body && companies.body.length === 0) {
                    this.store.dispatch(this.SetLoginStatus(userLoginStateEnum.newUserLoggedIn));
                    this.zone.run(() => {
                        this.store.pipe(
                            select(state => state.session.user),
                            take(1), // take only the first emission
                            tap(response => {
                                const hasSubscriptionPermission = response?.user?.hasSubscriptionPermission;
                                if (hasSubscriptionPermission) {
                                    this._router.navigate(['/pages/subscription']);
                                } else {
                                    this._router.navigate(['/pages/subscription/buy-plan/' + (localStorage.getItem('Country-Region') ?? '')]);
                                }
                            })
                        ).subscribe();
                    });

                    return { type: 'EmptyAction' };
                } else {
                    if (stateDetail.body && stateDetail?.status === 'success') {
                        this._generalService.companyUniqueName = stateDetail.body.companyUniqueName;
                        this._generalService.currentBranchUniqueName = stateDetail.body.branchUniqueName || '';
                        this._generalService.voucherApiVersion = stateDetail.body.voucherVersion || 1;
                        if (stateDetail.body.branchUniqueName) {
                            const details = {
                                branchDetails: {
                                    uniqueName: this._generalService.currentBranchUniqueName
                                }
                            };
                            const organization: Organization = {
                                type: OrganizationType.Branch,
                                uniqueName: this._generalService.companyUniqueName || '',
                                details
                            };
                            this.store.dispatch(this.companyActions.setCompanyBranch(organization));
                        }
                        cmpUniqueName = stateDetail.body.companyUniqueName;
                        if (companies?.body?.findIndex(p => p?.uniqueName === cmpUniqueName) > -1 && ROUTES.findIndex(p => p.path.split('/')[0] === stateDetail.body.lastState.split('/')[0]) > -1) {
                            return this.finalThingTodo(stateDetail, companies, results[2]);
                        } else {
                            // old user fail safe scenerio
                            return this.doSameStuffs(companies, results[2]);
                        }
                    } else {
                        /**
                         * if user is new and signed up by shared entity
                         * find the entity and redirect user according to terms.
                         * shared entities [GROUP, COMPANY, ACCOUNT]
                         */
                        return this.doSameStuffs(companies, results[2]);
                    }
                }
            })));

    public logoutSuccess$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(LoginActions.LogOut),
            map((action: CustomActions) => {
                if (PRODUCTION_ENV && !isElectron) {
                    window.location.href = 'https://giddh.com/login/';
                } else if (isElectron) {
                    this._router.navigate(['/login']);
                    window.location.reload();
                } else {
                    window.location.href = AppUrl + 'login/';
                }
                return { type: 'EmptyAction' };
            })));

    public verifyMobile$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(LoginActions.VerifyMobileRequest),
            switchMap((action: CustomActions) =>
                this.auth.VerifyOTP(action.payload as VerifyMobileModel)
            ),
            map(response => this.VerifyMobileResponce(response))));

    public verifyMobileResponse$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(LoginActions.VerifyMobileResponce),
            map((action: CustomActions) => {
                let response: BaseResponse<VerifyMobileResponseModel, VerifyMobileModel> = action?.payload;
                if (response?.status === 'error') {
                    this._toaster.errorToast(action.payload.message, action.payload.code);
                    return { type: 'EmptyAction' };
                }
                return this.LoginSuccess(response);
            })));

    public verifyTwoWayAuth$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(LoginActions.VerifyTwoWayAuthRequest),
            switchMap((action: CustomActions) =>
                this.auth.VerifyOTP(action.payload as VerifyMobileModel)
            ),
            map(response => this.VerifyTwoWayAuthResponse(response))));

    public verifyTwoWayAuthResponse$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(LoginActions.VerifyTwoWayAuthResponse),
            map((action: CustomActions) => {
                let response: BaseResponse<VerifyMobileResponseModel, VerifyMobileModel> = action?.payload;
                if (response?.status === 'error') {
                    this._toaster.errorToast(response.message, response.code);
                    return { type: 'EmptyAction' };
                }
                return this.LoginSuccess(response);
            })));

    public ClearSession$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(LoginActions.ClearSession),
            switchMap((action: CustomActions) => {
                return this.auth.ClearSession();
            }), map(data => {
                return this.LogOut();
            })));

    public CHANGE_COMPANY$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(CompanyActions.CHANGE_COMPANY),
            switchMap((action: CustomActions) => this._companyService.getStateDetails(action.payload.cmpUniqueName, action.payload.fetchLastState)),
            map(response => {
                if ((response?.status === 'error' || ROUTES.findIndex(p => p.path.split('/')[0] === response.body?.lastState.split('/')[0]) === -1) || (response?.status === 'error' || response.code === 'NOT_FOUND')) {
                    let dummyResponse = new BaseResponse<StateDetailsResponse, string>();
                    dummyResponse.body = new StateDetailsResponse();
                    dummyResponse.body.companyUniqueName = response.request;
                    dummyResponse.body.lastState = 'sales';
                    dummyResponse.status = 'success';
                    this._router.navigateByUrl('/dummy', { skipLocationChange: true }).then(() => {
                        this.finalNavigate(dummyResponse.body.lastState);
                    });
                    return this.ChangeCompanyResponse(dummyResponse);
                }
                if (response.body?.companyUniqueName) {
                    this._generalService.currentBranchUniqueName = response?.body?.branchUniqueName || '';
                    if (response.body?.branchUniqueName) {
                        const details = {
                            branchDetails: {
                                uniqueName: this._generalService.currentBranchUniqueName
                            }
                        };
                        const organization: Organization = {
                            type: OrganizationType.Branch,
                            uniqueName: this._generalService.companyUniqueName || '',
                            details
                        };
                        this.store.dispatch(this.companyActions.setCompanyBranch(organization));
                    }
                    if (response.body?.lastState && ROUTES.findIndex(p => p.path.split('/')[0] === response.body?.lastState.split('/')[0]) !== -1) {
                        this._router.navigateByUrl('/dummy', { skipLocationChange: true }).then(() => {
                            this.finalNavigate(response.body?.lastState);
                        });
                    } else {
                        if (this.activatedRoute.children && this.activatedRoute.children.length > 0) {
                            if (this.activatedRoute.firstChild.children && this.activatedRoute.firstChild.children?.length > 0) {
                                let path = [];
                                let parament = {};
                                this.activatedRoute.firstChild.firstChild.url.pipe(take(1)).subscribe(p => {
                                    if (p?.length > 0) {
                                        path = [p[0].path];
                                        parament = { queryParams: p[0].parameters };
                                    }
                                });
                                if (path?.length > 0 && parament) {
                                    this._router.navigateByUrl('/dummy', { skipLocationChange: true }).then(() => {
                                        if (ROUTES.findIndex(p => p.path.split('/')[0] === path[0].split('/')[0]) > -1) {
                                            this.finalNavigate(path[0], parament);
                                        } else {
                                            this.finalNavigate('home');
                                        }
                                    });
                                }
                            }
                        }
                    }
                }

                return this.ChangeCompanyResponse(response);
            })));

    public ChangeCompanyResponse$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(CompanyActions.CHANGE_COMPANY_RESPONSE),
            map((action: CustomActions) => {
                if (action.payload?.status === 'success') {
                    this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
                }
                return { type: 'EmptyAction' };
            })));

    public addNewMobile$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(LoginActions.AddNewMobileNo),
            switchMap((action: CustomActions) => this.auth.VerifyNumber(action.payload)),
            map(response => this.AddNewMobileNoResponce(response))));

    public addNewMobileResponse$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(LoginActions.AddNewMobileNoResponse),
            map((action: CustomActions) => {
                if (action.payload?.status === 'success') {
                    this._toaster.successToast(this.localeService.translate("app_messages.receive_otp"));
                } else {
                    this._toaster.errorToast(action.payload.message, action.payload.code);
                }
                return { type: 'EmptyAction' };
            })));

    public verifyAddNewMobile$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(LoginActions.VerifyAddNewMobileNo),
            switchMap((action: CustomActions) =>
                this.auth.VerifyNumberOTP(action.payload as VerifyMobileModel)
            ),
            map(response => this.VerifyAddNewMobileNoResponce(response))));

    public verifyAddNewMobileResponse$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(LoginActions.VerifyAddNewMobileNoResponse),
            map((action: CustomActions) => {
                let response: BaseResponse<string, VerifyMobileModel> = action?.payload;
                if (response?.status === 'error') {
                    this._toaster.errorToast(response.message, response.code);
                    return { type: 'EmptyAction' };
                }
                this._toaster.successToast(response.body);
                return this.FetchUserDetails();
            })));

    public FectchUserDetails$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(LoginActions.FetchUserDetails),
            switchMap((action: CustomActions) => this.auth.FetchUserDetails()),
            map(response => this.FetchUserDetailsResponse(response))));

    public FectchUserDetailsResponse$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(LoginActions.FetchUserDetailsResponse),
            map((action: CustomActions) => {
                if (action.payload && action.payload.status === 'error') {
                    this._toaster.errorToast(action.payload.message, action.payload.code);
                }
                return { type: 'EmptyAction' };
            })));

    public ReportInvalidJSON$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType('REPORT_INVALID_JSON'),
            switchMap((action: CustomActions) => this.auth.ReportInvalidJSON(action.payload)),
            map((res) => {
                return { type: 'EmptyAction' };
            })));

    public SignupWithPasswdRequest$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(LoginActions.SignupWithPasswdRequest),
            switchMap((action: CustomActions) => this.auth.SignupWithPassword(action.payload)),
            map(response => this.SignupWithPasswdResponse(response))));

    public SignupWithPasswdResponse$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(LoginActions.SignupWithPasswdResponse),
            map((action: CustomActions) => {
                if (action.payload?.status === 'success') {
                    this._toaster.successToast(this.localeService.translate("app_messages.otp_sent_email"));
                } else {
                    this._toaster.errorToast(action.payload.message, action.payload.code, 6000);
                }
                return { type: 'EmptyAction' };
            })));

    public LoginWithPasswdRequest$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(LoginActions.LoginWithPasswdRequest),
            switchMap((action: CustomActions) => this.auth.LoginWithPassword(action.payload)),
            map(response => this.LoginWithPasswdResponse(response))));

    public LoginWithPasswdResponse$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(LoginActions.LoginWithPasswdResponse),
            map((action: CustomActions) => {
                if (action.payload?.status === 'success') {
                    if (action.payload.body?.statusCode === "AUTHENTICATE_TWO_WAY") {
                        if (action.payload.body?.text) {
                            this._toaster.successToast(action.payload.body?.text, action.payload.code);
                        }
                    } else if (action.payload.body?.user?.isVerified) {
                        return this.LoginSuccess();
                    }
                } else {
                    this._toaster.errorToast(action.payload.message, action.payload.code);
                }
                return { type: 'EmptyAction' };
            })));

    public forgotPasswordRequest$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(LoginActions.forgotPasswordRequest),
            switchMap((action: CustomActions) => this.auth.forgotPassword(action.payload)),
            map(response => this.forgotPasswordResponse(response))));

    public forgotPasswordResponse$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(LoginActions.forgotPasswordResponse),
            map((action: CustomActions) => {
                if (action.payload?.status === 'success') {
                    this._toaster.successToast(action.payload.body);
                } else {
                    this._toaster.errorToast(action.payload.message, action.payload.code);
                }
                return { type: 'EmptyAction' };
            })));

    public resetPasswordRequest$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(LoginActions.resetPasswordRequest),
            switchMap((action: CustomActions) => this.auth.resetPassword(action.payload)),
            map(response => this.resetPasswordResponse(response))));

    public resetPasswordResponse$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(LoginActions.resetPasswordResponse),
            map((action: CustomActions) => {
                if (action.payload?.status === 'success') {
                    this._toaster.successToast(action.payload.body);
                } else {
                    this._toaster.errorToast(action.payload.message, action.payload.code);
                }
                return { type: 'EmptyAction' };
            })));

    public renewSession$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(LoginActions.renewSessionRequest),
            switchMap((action: CustomActions) => this.auth.renewSession()),
            map(response => this.renewSessionResponse(response))));

    public renewSessionResponse$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(LoginActions.renewSessionResponse),
            map((action: CustomActions) => {
                if (action.payload?.status === 'success' && action.payload.body && action.payload.body.session) {
                    this._generalService.setCookie("giddh_session_id", action.payload.body.session.id, 30);
                }
                return { type: 'EmptyAction' };
            })));

    public autoLoginwithPasswordResponse$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType(LoginActions.AutoLoginWithPasswdResponse),
            map((action: CustomActions) => this.LoginSuccessByOtherUrl())));

    constructor(
        public _router: Router,
        private actions$: Actions,
        private auth: AuthenticationService,
        public _toaster: ToasterService,
        private store: Store<AppState>,
        private companyActions: CompanyActions,
        private _companyService: CompanyService,
        private _generalService: GeneralService,
        private activatedRoute: ActivatedRoute,
        private _generalAction: GeneralActions,
        private _dbService: DbService,
        private settingsProfileActions: SettingsProfileActions,
        private zone: NgZone,
        private localeService: LocaleService
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

    public LoginSuccess(response?: any, isSocialLogin?: boolean): CustomActions {
        if (response && response.body && response.body.session) {
            this._generalService.setCookie("giddh_session_id", response.body.session.id, 30);
        }
        return {
            type: LoginActions.LoginSuccess,
            payload: isSocialLogin
        };
    }

    public LoginSuccessByOtherUrl(): CustomActions {
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

    public ClearSession(): CustomActions {
        return {
            type: LoginActions.ClearSession
        };
    }

    public ChangeCompany(cmpUniqueName: string, fetchLastState?: boolean): CustomActions {
        return {
            type: CompanyActions.CHANGE_COMPANY,
            payload: { cmpUniqueName, fetchLastState }
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
        return {
            type: LoginActions.AutoLoginWithPasswdResponse,
            payload: response
        };
    }

    /**
     * Sets false in reducer
     *
     * @returns {CustomActions}
     * @memberof LoginActions
     */
    public hideTwoWayOtpPopup(): CustomActions {
        return {
            type: LoginActions.hideTwoWayOtpPopup
        }
    }

    private doSameStuffs(companies, isSocialLogin?: boolean) {
        let respState = new BaseResponse<StateDetailsResponse, string>();
        respState.body = new StateDetailsResponse();
        companies.body = sortBy(companies?.body, ['name']);
        // now take first company from the companies
        let cArr = companies?.body?.sort((a, b) => a?.name?.length - b?.name?.length);
        let company = cArr[0];
        if (company) {
            respState.body.companyUniqueName = company?.uniqueName;
        } else {
            respState.body.companyUniqueName = "";
        }
        respState.status = 'success';
        respState.request = '';
        respState.body.lastState = 'home';
        // check for entity and override last state ['GROUP', 'ACCOUNT']
        try {
            if (company && company.userEntityRoles && company.userEntityRoles.length) {
                // find sorted userEntityRoles
                let entitiesArr = company.userEntityRoles.sort((a, b) => a?.entity?.name?.length - b?.entity?.name?.length);
                let entityObj = entitiesArr[0].entity;
                if (entityObj.entity === 'ACCOUNT') {
                    respState.body.lastState = `ledger/${entityObj?.uniqueName}`;
                } else if (entityObj.entity === 'GROUP') {
                    // get a/c`s of group and set first a/c
                    this.store.dispatch(this.SetRedirectToledger());
                } else {
                    respState.body.lastState = 'home';
                }
            } else {
                respState.body.lastState = 'home';
            }
        } catch (error) {
            respState.body.lastState = 'home';
        }
        return this.finalThingTodo(respState, companies, isSocialLogin);
    }

    /**
     * This will be use for final things to do
     *
     * @private
     * @param {*} stateDetail
     * @param {*} companies
     * @param {boolean} [isSocialLogin]
     * @return {*}
     * @memberof LoginActions
     */
    private finalThingTodo(stateDetail: any, companies: any, isSocialLogin?: boolean) {
        this.store.pipe(select(state => state.session.user), take(1)).subscribe(response => {
            let request = { userUniqueName: response.user?.uniqueName, companyUniqueName: stateDetail?.body.companyUniqueName };
            this.store.dispatch(this.companyActions.getCompanyUser(request));
        });
        this.store.dispatch(this.companyActions.GetStateDetailsResponse(stateDetail));
        this.store.dispatch(this.companyActions.RefreshCompaniesResponse(companies));
        this.store.dispatch(this.SetLoginStatus(userLoginStateEnum.userLoggedIn));
        let route = (stateDetail?.body?.lastUpdated > 7 || !stateDetail?.body?.lastUpdated) ? '/pages/home' : stateDetail.body?.lastState;
        this.finalNavigate(route, false, isSocialLogin);
        return { type: 'EmptyAction' };
    }

    public finalNavigate(route: any, parameter?: any, isSocialLogin?: boolean): void {
        this._generalService.finalNavigate(route, parameter, isSocialLogin);
    }
}
