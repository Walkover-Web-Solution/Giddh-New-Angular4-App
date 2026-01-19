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
import { COMMON_ACTIONS } from './common.const';
import { AppState } from '../store';
import { Inject, Injectable, NgZone } from '@angular/core';
import { environment } from '../../environments/environment.generated';
import { Configuration } from '../app.constant';
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
import { COUNTRY_REGION_MAP } from '../app.constant';
import { ServiceConfig } from '../services/service.config';
import { findIndex, get, sortBy, startsWith } from '../lodash-optimized';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * LoginActions class
 * Implements LoginActions functionality
 */
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
            /**
             * Handles ofType functionality
             */
            ofType(LoginActions.SIGNUP_WITH_GOOGLE_REQUEST),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) =>
                this.auth.LoginWithGoogle(action.payload)
            ),
            /**
             * Handles map functionality
             */
            map(response => {
                return this.signupWithGoogleResponse(response);
            })));

    public signupWithGoogleResponse$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(LoginActions.SIGNUP_WITH_GOOGLE_RESPONSE),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => {
                let response: BaseResponse<VerifyEmailResponseModel, string> = action?.payload;
                /**
                 * Handles if functionality
                 */
                if (response) {
                    /**
                     * Handles if functionality
                     */
                    if (response.status === 'error') {
                        this._toaster.errorToast(action.payload.message, action.payload.code);
                        return { type: 'EmptyAction' };
                    }
                    /**
                     * Handles if functionality
                     */
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
            /**
             * Handles ofType functionality
             */
            ofType(LoginActions.SignupWithEmailRequest),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.auth.SignupWithEmail(action.payload)),
            /**
             * Handles map functionality
             */
            map(response => this.SignupWithEmailResponce(response))));

    public signupWithEmailResponse$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(LoginActions.SignupWithEmailResponce),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => {
                /**
                 * Handles if functionality
                 */
                if (action.payload?.status === 'success') {
                    this._toaster.successToast(action.payload.body);
                } else {
                    this._toaster.errorToast(action.payload.message, action.payload.code);
                }
                return { type: 'EmptyAction' };
            })));

    public verifyEmail$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(LoginActions.VerifyEmailRequest),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) =>
                this.auth.VerifyEmail(action.payload as VerifyEmailModel)
            ),
            /**
             * Handles map functionality
             */
            map(response => this.VerifyEmailResponce(response))));

    public verifyEmailResponse$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(LoginActions.VerifyEmailResponce),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => {
                let response: BaseResponse<VerifyEmailResponseModel, VerifyEmailModel> = action?.payload;
                /**
                 * Handles if functionality
                 */
                if (response?.status === 'error') {
                    this._toaster.errorToast(action.payload.message, action.payload.code);
                    return { type: 'EmptyAction' };
                }
                return this.LoginSuccess();
            })));

    public signupWithMobile$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(LoginActions.SignupWithMobileRequest),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.auth.SignupWithMobile(action.payload)),
            /**
             * Handles map functionality
             */
            map(response => this.SignupWithMobileResponce(response))));

    public signupWithMobileResponse$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(LoginActions.SignupWithMobileResponce),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => {
                /**
                 * Handles if functionality
                 */
                if (action.payload?.status === 'success') {
                    this._toaster.successToast(action.payload.body);
                } else {
                    this._toaster.errorToast(action.payload.message, action.payload.code);
                }
                return { type: 'EmptyAction' };
            })));

    public loginSuccessByURL$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(LoginActions.LoginSuccessBYUrl),
            /**
             * Handles switchMap functionality
             */
            switchMap((action) => {
                console.log("Login Init");
                return observableZip(this._companyService.getStateDetails('', true), this._companyService.CompanyList());
            }), map((results: any[]) => {
                console.log("Login Success");
                /* check if local storage is cleared or not for first time
                 for application menu set up in localstorage */

                let isNewMenuSetted = localStorage.getItem('isNewMenuSetted');
                let isMenuUpdated = localStorage.getItem('isMenuUpdated');

                /**
                 * Handles if functionality
                 */
                if (!JSON.parse(isNewMenuSetted) || (JSON.parse(isNewMenuSetted) && !isMenuUpdated)) {
                    this._dbService.clearAllData();
                    localStorage.setItem('isNewMenuSetted', true.toString());
                    localStorage.setItem('isMenuUpdated', true.toString());
                }

                let cmpUniqueName = '';
                let stateDetail = results[0] as BaseResponse<StateDetailsResponse, string>;
                let companies = results[1] as BaseResponse<CompanyResponse[], string>;

                /**
                 * Handles if functionality
                 */
                if (companies.body && companies.body.length === 0) {
                    this.store.dispatch(this.SetLoginStatus(userLoginStateEnum.newUserLoggedIn));
                    this.zone.run(() => {
                        this.store.pipe(
                            /**
                             * Handles select functionality
                             */
                            select(state => state.session.user),
                            /**
                             * Handles take functionality
                             */
                            take(1), // take only the first emission
                            /**
                             * Handles tap functionality
                             */
                            tap(response => {
                                const hasSubscriptionPermission = response?.user?.hasSubscriptionPermission;
                                /**
                                 * Handles if functionality
                                 */
                                if (hasSubscriptionPermission) {
                                    this._router.navigate(['/pages/user-details/subscription']);
                                } else {
                                    this._router.navigate(['/pages/user-details/subscription/buy-plan']);
                                }
                            })
                        ).subscribe();
                    });
                    return { type: 'EmptyAction' };
                } else {
                    /**
                     * Handles if functionality
                     */
                    if (stateDetail.body && stateDetail?.status === 'success') {
                        this._generalService.companyUniqueName = stateDetail.body.companyUniqueName;
                        this._generalService.currentBranchUniqueName = stateDetail.body.branchUniqueName || '';
                        /**
                         * Handles if functionality
                         */
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
                        /**
                         * Handles if functionality
                         */
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
            /**
             * Handles ofType functionality
             */
            ofType(LoginActions.LoginSuccess),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                console.log("Login Init");
                return observableZip(this._companyService.getStateDetails('', true), this._companyService.CompanyList(), [action.payload]);
            }), map((results: any[]) => {
                console.log("Login Success");
                /* check if local storage is cleared or not for first time
                 for application menu set up in localstorage */

                let isNewMenuSetted = localStorage.getItem('isNewMenuSetted');
                let isMenuUpdated = localStorage.getItem('isMenuUpdated');

                /**
                 * Handles if functionality
                 */
                if (!JSON.parse(isNewMenuSetted) || (JSON.parse(isNewMenuSetted) && !isMenuUpdated)) {
                    this._dbService.clearAllData();
                    localStorage.setItem('isNewMenuSetted', true.toString());
                    localStorage.setItem('isMenuUpdated', true.toString());
                }

                let cmpUniqueName = '';
                let stateDetail = results[0] as BaseResponse<StateDetailsResponse, string>;
                let companies = results[1] as BaseResponse<CompanyResponse[], string>;

                /**
                 * Handles if functionality
                 */
                if (companies.body && companies.body.length === 0) {
                    this.store.dispatch(this.SetLoginStatus(userLoginStateEnum.newUserLoggedIn));
                    this.zone.run(() => {
                        this.store.pipe(
                            /**
                             * Handles select functionality
                             */
                            select(state => state.session.user),
                            /**
                             * Handles take functionality
                             */
                            take(1), // take only the first emission
                            /**
                             * Handles tap functionality
                             */
                            tap(response => {
                                const hasSubscriptionPermission = response?.user?.hasSubscriptionPermission;
                                /**
                                 * Handles if functionality
                                 */
                                if (hasSubscriptionPermission) {
                                    this._router.navigate(['/pages/user-details/subscription']);
                                } else {
                                    this._router.navigate(['/pages/user-details/subscription/buy-plan']);
                                }
                            })
                        ).subscribe();
                    });

                    return { type: 'EmptyAction' };
                } else {
                    /**
                     * Handles if functionality
                     */
                    if (stateDetail.body && stateDetail?.status === 'success') {
                        this._generalService.companyUniqueName = stateDetail.body.companyUniqueName;
                        this._generalService.currentBranchUniqueName = stateDetail.body.branchUniqueName || '';
                        this._generalService.voucherApiVersion = stateDetail.body.voucherVersion || 2;
                        /**
                         * Handles if functionality
                         */
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
                        /**
                         * Handles if functionality
                         */
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
            /**
             * Handles ofType functionality
             */
            ofType(LoginActions.LogOut),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => {
                /**
                 * Handles if functionality
                 */
                if (environment.PRODUCTION_ENV && !Configuration.isElectron) {
                    window.location.href = this._generalService.getGiddhRegionUrl();
                } else if (Configuration.isElectron) {
                    this._router.navigate(['/login']).then(() => {
                        // Wait for navigation to complete before reloading
                        /**
                         * Sets timeout value
                         */
                        setTimeout(() => {
                            window.location.reload();
                        }, 500);
                    }).catch(() => {
                        // Fallback if navigation fails
                        /**
                         * Sets timeout value
                         */
                        setTimeout(() => {
                            window.location.href = '/login';
                        }, 100);
                    });
                } else {
                    window.location.href = (this.serviceConfig.AppUrl || environment.AppUrl) + 'login/';
                }
                return { type: 'EmptyAction' };
            })));

    public verifyMobile$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(LoginActions.VerifyMobileRequest),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) =>
                this.auth.VerifyOTP(action.payload as VerifyMobileModel)
            ),
            /**
             * Handles map functionality
             */
            map(response => this.VerifyMobileResponce(response))));

    public verifyMobileResponse$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(LoginActions.VerifyMobileResponce),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => {
                let response: BaseResponse<VerifyMobileResponseModel, VerifyMobileModel> = action?.payload;
                /**
                 * Handles if functionality
                 */
                if (response?.status === 'error') {
                    this._toaster.errorToast(action.payload.message, action.payload.code);
                    return { type: 'EmptyAction' };
                }
                return this.LoginSuccess(response);
            })));

    public verifyTwoWayAuth$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(LoginActions.VerifyTwoWayAuthRequest),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) =>
                this.auth.VerifyOTP(action.payload as VerifyMobileModel)
            ),
            /**
             * Handles map functionality
             */
            map(response => this.VerifyTwoWayAuthResponse(response))));

    public verifyTwoWayAuthResponse$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(LoginActions.VerifyTwoWayAuthResponse),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => {
                let response: BaseResponse<VerifyMobileResponseModel, VerifyMobileModel> = action?.payload;
                /**
                 * Handles if functionality
                 */
                if (response?.status === 'error') {
                    this._toaster.errorToast(response.message, response.code);
                    return { type: 'EmptyAction' };
                }
                return this.LoginSuccess(response);
            })));

    public ClearSession$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(LoginActions.ClearSession),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this.auth.ClearSession();
            }), map(data => {
                return this.LogOut();
            })));

    public CHANGE_COMPANY$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(CompanyActions.CHANGE_COMPANY),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._companyService.getStateDetails(action.payload.cmpUniqueName, action.payload.fetchLastState)),
            /**
             * Handles map functionality
             */
            map(response => {
                /**
                 * Handles if functionality
                 */
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
                /**
                 * Handles if functionality
                 */
                if (response.body?.companyUniqueName) {
                    this._generalService.currentBranchUniqueName = response?.body?.branchUniqueName || '';
                    /**
                     * Handles if functionality
                     */
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
                    /**
                     * Handles if functionality
                     */
                    if (response.body?.lastState && ROUTES.findIndex(p => p.path.split('/')[0] === response.body?.lastState.split('/')[0]) !== -1) {
                        this._router.navigateByUrl('/dummy', { skipLocationChange: true }).then(() => {
                            this.finalNavigate(response.body?.lastState);
                        });
                    } else {
                        /**
                         * Handles if functionality
                         */
                        if (this.activatedRoute.children && this.activatedRoute.children.length > 0) {
                            /**
                             * Handles if functionality
                             */
                            if (this.activatedRoute.firstChild.children && this.activatedRoute.firstChild.children?.length > 0) {
                                let path = [];
                                let parament = {};
                                this.activatedRoute.firstChild.firstChild.url.pipe(take(1)).subscribe(p => {
                                    /**
                                     * Handles if functionality
                                     */
                                    if (p?.length > 0) {
                                        path = [p[0].path];
                                        parament = { queryParams: p[0].parameters };
                                    }
                                });
                                /**
                                 * Handles if functionality
                                 */
                                if (path?.length > 0 && parament) {
                                    this._router.navigateByUrl('/dummy', { skipLocationChange: true }).then(() => {
                                        /**
                                         * Handles if functionality
                                         */
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
            /**
             * Handles ofType functionality
             */
            ofType(CompanyActions.CHANGE_COMPANY_RESPONSE),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => {
                /**
                 * Handles if functionality
                 */
                if (action.payload?.status === 'success') {
                    this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
                }
                return { type: 'EmptyAction' };
            })));

    public addNewMobile$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(LoginActions.AddNewMobileNo),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.auth.VerifyNumber(action.payload)),
            /**
             * Handles map functionality
             */
            map(response => this.AddNewMobileNoResponce(response))));

    public addNewMobileResponse$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(LoginActions.AddNewMobileNoResponse),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => {
                /**
                 * Handles if functionality
                 */
                if (action.payload?.status === 'success') {
                    this._toaster.successToast(this.localeService.translate("app_messages.receive_otp"));
                } else {
                    this._toaster.errorToast(action.payload.message, action.payload.code);
                }
                return { type: 'EmptyAction' };
            })));

    public verifyAddNewMobile$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(LoginActions.VerifyAddNewMobileNo),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) =>
                this.auth.VerifyNumberOTP(action.payload as VerifyMobileModel)
            ),
            /**
             * Handles map functionality
             */
            map(response => this.VerifyAddNewMobileNoResponce(response))));

    public verifyAddNewMobileResponse$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(LoginActions.VerifyAddNewMobileNoResponse),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => {
                let response: BaseResponse<string, VerifyMobileModel> = action?.payload;
                /**
                 * Handles if functionality
                 */
                if (response?.status === 'error') {
                    this._toaster.errorToast(response.message, response.code);
                    return { type: 'EmptyAction' };
                }
                this._toaster.successToast(response.body);
                return this.FetchUserDetails();
            })));

    public FectchUserDetails$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(LoginActions.FetchUserDetails),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.auth.FetchUserDetails()),
            /**
             * Handles map functionality
             */
            map(response => this.FetchUserDetailsResponse(response))));

    public FectchUserDetailsResponse$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(LoginActions.FetchUserDetailsResponse),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => {
                /**
                 * Handles if functionality
                 */
                if (action.payload && action.payload.status === 'error') {
                    this._toaster.errorToast(action.payload.message, action.payload.code);
                }
                return { type: 'EmptyAction' };
            })));

    public ReportInvalidJSON$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType('REPORT_INVALID_JSON'),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.auth.ReportInvalidJSON(action.payload)),
            /**
             * Handles map functionality
             */
            map((res) => {
                return { type: 'EmptyAction' };
            })));

    public SignupWithPasswdRequest$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(LoginActions.SignupWithPasswdRequest),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.auth.SignupWithPassword(action.payload)),
            /**
             * Handles map functionality
             */
            map(response => this.SignupWithPasswdResponse(response))));

    public SignupWithPasswdResponse$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(LoginActions.SignupWithPasswdResponse),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => {
                /**
                 * Handles if functionality
                 */
                if (action.payload?.status === 'success') {
                    this._toaster.successToast(this.localeService.translate("app_messages.otp_sent_email"));
                } else {
                    this._toaster.errorToast(action.payload.message, action.payload.code, 6000);
                }
                return { type: 'EmptyAction' };
            })));

    public LoginWithPasswdRequest$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(LoginActions.LoginWithPasswdRequest),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.auth.LoginWithPassword(action.payload)),
            /**
             * Handles map functionality
             */
            map(response => this.LoginWithPasswdResponse(response))));

    public LoginWithPasswdResponse$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(LoginActions.LoginWithPasswdResponse),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => {
                /**
                 * Handles if functionality
                 */
                if (action.payload?.status === 'success') {
                    /**
                     * Handles if functionality
                     */
                    if (action.payload.body?.statusCode === "AUTHENTICATE_TWO_WAY") {
                        /**
                         * Handles if functionality
                         */
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
            /**
             * Handles ofType functionality
             */
            ofType(LoginActions.forgotPasswordRequest),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.auth.forgotPassword(action.payload)),
            /**
             * Handles map functionality
             */
            map(response => this.forgotPasswordResponse(response))));

    public forgotPasswordResponse$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(LoginActions.forgotPasswordResponse),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => {
                /**
                 * Handles if functionality
                 */
                if (action.payload?.status === 'success') {
                    this._toaster.successToast(action.payload.body);
                } else {
                    this._toaster.errorToast(action.payload.message, action.payload.code);
                }
                return { type: 'EmptyAction' };
            })));

    public resetPasswordRequest$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(LoginActions.resetPasswordRequest),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.auth.resetPassword(action.payload)),
            /**
             * Handles map functionality
             */
            map(response => this.resetPasswordResponse(response))));

    public resetPasswordResponse$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(LoginActions.resetPasswordResponse),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => {
                /**
                 * Handles if functionality
                 */
                if (action.payload?.status === 'success') {
                    this._toaster.successToast(action.payload.body);
                } else {
                    this._toaster.errorToast(action.payload.message, action.payload.code);
                }
                return { type: 'EmptyAction' };
            })));

    public renewSession$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(LoginActions.renewSessionRequest),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.auth.renewSession()),
            /**
             * Handles map functionality
             */
            map(response => this.renewSessionResponse(response))));

    public renewSessionResponse$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(LoginActions.renewSessionResponse),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => {
                /**
                 * Handles if functionality
                 */
                if (action.payload?.status === 'success' && action.payload.body && action.payload.body.session) {
                    this._generalService.setCookie("giddh_session_id", action.payload.body.session.id, 30);
                }
                return { type: 'EmptyAction' };
            })));

    public autoLoginwithPasswordResponse$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(LoginActions.AutoLoginWithPasswdResponse),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => this.LoginSuccessByOtherUrl())));

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
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
        private localeService: LocaleService,
        @Inject(ServiceConfig) private serviceConfig
    ) {
    }

    /**
     * Handles SetRedirectToledger functionality
     */
    public SetRedirectToledger(): CustomActions {
        return {
            type: LoginActions.NEEDS_TO_REDIRECT_TO_LEDGER
        };
    }

    /**
     * Handles ResetRedirectToledger functionality
     */
    public ResetRedirectToledger(): CustomActions {
        return {
            type: LoginActions.RESET_NEEDS_TO_REDIRECT_TO_LEDGER
        };
    }

    /**
     * Handles SignupWithEmailRequest functionality
     */
    public SignupWithEmailRequest(value: SignupwithEmaillModel): CustomActions {
        return {
            type: LoginActions.SignupWithEmailRequest,
            payload: value
        };
    }

    /**
     * Handles SignupWithEmailResponce functionality
     */
    public SignupWithEmailResponce(value: BaseResponse<string, string>): CustomActions {
        return {
            type: LoginActions.SignupWithEmailResponce,
            payload: value
        };
    }

    /**
     * Handles ResetSignupWithEmailState functionality
     */
    public ResetSignupWithEmailState(): CustomActions {
        return {
            type: LoginActions.ResetSignupWithEmailState
        };
    }

    /**
     * Handles SignupWithMobileRequest functionality
     */
    public SignupWithMobileRequest(value: SignupWithMobile): CustomActions {
        return {
            type: LoginActions.SignupWithMobileRequest,
            payload: value
        };
    }

    /**
     * Handles SignupWithMobileResponce functionality
     */
    public SignupWithMobileResponce(value: BaseResponse<string, SignupWithMobile>): CustomActions {
        return {
            type: LoginActions.SignupWithMobileResponce,
            payload: value
        };
    }

    /**
     * Handles ResetSignupWithMobileState functionality
     */
    public ResetSignupWithMobileState(): CustomActions {
        return {
            type: LoginActions.ResetSignupWithMobileState
        };
    }

    /**
     * Handles VerifyEmailRequest functionality
     */
    public VerifyEmailRequest(value: VerifyEmailModel): CustomActions {
        return {
            type: LoginActions.VerifyEmailRequest,
            payload: value
        };
    }

    /**
     * Handles VerifyEmailResponce functionality
     */
    public VerifyEmailResponce(value: BaseResponse<VerifyEmailResponseModel, VerifyEmailModel>): CustomActions {
        return {
            type: LoginActions.VerifyEmailResponce,
            payload: value
        };
    }

    /**
     * Handles signupWithGoogle functionality
     */
    public signupWithGoogle(value: string): CustomActions {
        return {
            type: LoginActions.SIGNUP_WITH_GOOGLE_REQUEST,
            payload: value
        };
    }

    /**
     * Handles signupWithGoogleResponse functionality
     */
    public signupWithGoogleResponse(value: BaseResponse<VerifyEmailResponseModel, string>): CustomActions {
        return {
            type: LoginActions.SIGNUP_WITH_GOOGLE_RESPONSE,
            payload: value
        };
    }

    /**
     * Resets sociallogoutattempt to default state
     */
    public resetSocialLogoutAttempt(): CustomActions {
        return {
            type: LoginActions.RESET_SOCIAL_LOGOUT_ATTEMPT
        };
    }

    /**
     * Handles socialLogoutAttempt functionality
     */
    public socialLogoutAttempt(): CustomActions {
        return {
            type: LoginActions.SOCIAL_LOGOUT_ATTEMPT
        };
    }

    /**
     * Handles VerifyMobileRequest functionality
     */
    public VerifyMobileRequest(value: VerifyMobileModel): CustomActions {
        return {
            type: LoginActions.VerifyMobileRequest,
            payload: value
        };
    }

    /**
     * Handles VerifyMobileResponce functionality
     */
    public VerifyMobileResponce(value: BaseResponse<VerifyMobileResponseModel, VerifyMobileModel>): CustomActions {
        return {
            type: LoginActions.VerifyMobileResponce,
            payload: value
        };
    }

    /**
     * Handles VerifyTwoWayAuthRequest functionality
     */
    public VerifyTwoWayAuthRequest(value: VerifyMobileModel): CustomActions {
        return {
            type: LoginActions.VerifyTwoWayAuthRequest,
            payload: value
        };
    }

    /**
     * Handles VerifyTwoWayAuthResponse functionality
     */
    public VerifyTwoWayAuthResponse(value: BaseResponse<VerifyMobileResponseModel, VerifyMobileModel>): CustomActions {
        return {
            type: LoginActions.VerifyTwoWayAuthResponse,
            payload: value
        };
    }

    /**
     * Resets twowayauthmodal to default state
     */
    public resetTwoWayAuthModal(): CustomActions {
        return {
            type: LoginActions.ResetTwoWayAuthModal
        };
    }

    /**
     * Handles LoginSuccess functionality
     */
    public LoginSuccess(response?: any, isSocialLogin?: boolean): CustomActions {
        /**
         * Handles if functionality
         */
        if (response && response.body && response.body.session) {
            this._generalService.setCookie("giddh_session_id", response.body.session.id, 30);
        }
        return {
            type: LoginActions.LoginSuccess,
            payload: isSocialLogin
        };
    }

    /**
     * Handles LoginSuccessByOtherUrl functionality
     */
    public LoginSuccessByOtherUrl(): CustomActions {
        return {
            type: LoginActions.LoginSuccessBYUrl,
            payload: null
        };
    }

    /**
     * Handles LogOut functionality
     */
    public LogOut(): CustomActions {
        return {
            type: LoginActions.LogOut
        };
    }

    /**
     * Handles SetLoginStatus functionality
     */
    public SetLoginStatus(value: userLoginStateEnum): CustomActions {
        return {
            type: LoginActions.SetLoginStatus,
            payload: value
        };
    }

    /**
     * Handles ClearSession functionality
     */
    public ClearSession(): CustomActions {
        return {
            type: LoginActions.ClearSession
        };
    }

    /**
     * Handles ChangeCompany functionality
     */
    public ChangeCompany(cmpUniqueName: string, fetchLastState?: boolean): CustomActions {
        return {
            type: CompanyActions.CHANGE_COMPANY,
            payload: { cmpUniqueName, fetchLastState }
        };
    }

    /**
     * Handles ChangeCompanyResponse functionality
     */
    public ChangeCompanyResponse(value: BaseResponse<StateDetailsResponse, string>): CustomActions {
        this.store.dispatch(this.ResetApplicationData());
        return {
            type: CompanyActions.CHANGE_COMPANY_RESPONSE,
            payload: value
        };
    }

    /**
     * Handles ResetApplicationData functionality
     */
    public ResetApplicationData(): CustomActions {
        return {
            type: COMMON_ACTIONS.RESET_APPLICATION_DATA
        };
    }

    /**
     * Handles AddNewMobileNo functionality
     */
    public AddNewMobileNo(value: SignupWithMobile): CustomActions {
        return {
            type: LoginActions.AddNewMobileNo,
            payload: value
        };
    }

    /**
     * Handles AddNewMobileNoResponce functionality
     */
    public AddNewMobileNoResponce(value: BaseResponse<string, SignupWithMobile>): CustomActions {
        return {
            type: LoginActions.AddNewMobileNoResponse,
            payload: value
        };
    }

    /**
     * Handles VerifyAddNewMobileNo functionality
     */
    public VerifyAddNewMobileNo(value: VerifyMobileModel): CustomActions {
        return {
            type: LoginActions.VerifyAddNewMobileNo,
            payload: value
        };
    }

    /**
     * Handles VerifyAddNewMobileNoResponce functionality
     */
    public VerifyAddNewMobileNoResponce(value: BaseResponse<string, VerifyMobileModel>): CustomActions {
        return {
            type: LoginActions.VerifyAddNewMobileNoResponse,
            payload: value
        };
    }

    /**
     * Handles FetchUserDetails functionality
     */
    public FetchUserDetails(): CustomActions {
        return {
            type: LoginActions.FetchUserDetails
        };
    }

    /**
     * Handles FetchUserDetailsResponse functionality
     */
    public FetchUserDetailsResponse(resp: BaseResponse<UserDetails, string>): CustomActions {
        return {
            type: LoginActions.FetchUserDetailsResponse,
            payload: resp
        };
    }

    /**
     * Handles SetCurrencyInStore functionality
     */
    public SetCurrencyInStore(resp: ICurrencyResponse[]): CustomActions {
        return {
            type: LoginActions.SetCurrencyInStore,
            payload: resp
        };
    }

    /**
     * Handles SignupWithPasswdRequest functionality
     */
    public SignupWithPasswdRequest(value: object): CustomActions {
        return {
            type: LoginActions.SignupWithPasswdRequest,
            payload: value
        };
    }

    /**
     * Handles SignupWithPasswdResponse functionality
     */
    public SignupWithPasswdResponse(value: BaseResponse<VerifyMobileResponseModel, SignUpWithPassword>): CustomActions {
        return {
            type: LoginActions.SignupWithPasswdResponse,
            payload: value
        };
    }

    /**
     * Handles LoginWithPasswdRequest functionality
     */
    public LoginWithPasswdRequest(value: LoginWithPassword): CustomActions {
        return {
            type: LoginActions.LoginWithPasswdRequest,
            payload: value
        };
    }

    /**
     * Handles LoginWithPasswdResponse functionality
     */
    public LoginWithPasswdResponse(value: BaseResponse<VerifyMobileResponseModel, LoginWithPassword>): CustomActions {
        return {
            type: LoginActions.LoginWithPasswdResponse,
            payload: value
        };
    }

    /**
     * Handles forgotPasswordRequest functionality
     */
    public forgotPasswordRequest(userId): CustomActions {
        return {
            type: LoginActions.forgotPasswordRequest,
            payload: userId
        };
    }

    /**
     * Handles forgotPasswordResponse functionality
     */
    public forgotPasswordResponse(response): CustomActions {
        return {
            type: LoginActions.forgotPasswordResponse,
            payload: response
        };
    }

    /**
     * Resets passwordrequest to default state
     */
    public resetPasswordRequest(model): CustomActions {
        return {
            type: LoginActions.resetPasswordRequest,
            payload: model
        };
    }

    /**
     * Resets passwordresponse to default state
     */
    public resetPasswordResponse(response): CustomActions {
        return {
            type: LoginActions.resetPasswordResponse,
            payload: response
        };
    }

    /**
     * Handles renewSession functionality
     */
    public renewSession(): CustomActions {
        return {
            type: LoginActions.renewSessionRequest,
        };
    }

    /**
     * Handles renewSessionResponse functionality
     */
    public renewSessionResponse(response): CustomActions {
        return {
            type: LoginActions.renewSessionResponse,
            payload: response
        };
    }

    /**
     * Handles userAutoLoginResponse functionality
     */
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

    /**
     * Handles doSameStuffs functionality
     */
    private doSameStuffs(companies, isSocialLogin?: boolean) {
        let respState = new BaseResponse<StateDetailsResponse, string>();
        respState.body = new StateDetailsResponse();
        companies.body = sortBy(companies?.body, ['name']);
        // now take first company from the companies
        let cArr = companies?.body?.sort((a, b) => a?.name?.length - b?.name?.length);
        let company = cArr[0];
        /**
         * Handles if functionality
         */
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
            /**
             * Handles if functionality
             */
            if (company && company.userEntityRoles && company.userEntityRoles.length) {
                // find sorted userEntityRoles
                let entitiesArr = company.userEntityRoles.sort((a, b) => a?.entity?.name?.length - b?.entity?.name?.length);
                let entityObj = entitiesArr[0].entity;
                /**
                 * Handles if functionality
                 */
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

        // Check for returnUrl first, before using lastState
        try {
            const search = window && window.location ? window.location.search : '';
            let raw = '';
            /**
             * Handles if functionality
             */
            if (search) {
                const params = new URLSearchParams(search);
                raw = params.get('returnUrl') || params.get('returnurl') || '';
            }
            /**
             * Handles if functionality
             */
            if (!raw) {
                try { raw = sessionStorage.getItem('returnUrl') || ''; } catch (_) {}
            }
            /**
             * Handles if functionality
             */
            if (raw && raw.trim()) {
                const decoded = decodeURIComponent(raw);
                const target = decoded.startsWith('pages/') ? decoded : `pages/${decoded.startsWith('/') ? decoded.substring(1) : decoded}`;
                try { sessionStorage.removeItem('returnUrl'); } catch (_) {}
                this.zone.run(() => this._router.navigateByUrl(`/${target}`));
                return { type: 'EmptyAction' };
            }
        } catch (_) {}

        // Fallback to normal lastState navigation
        let route = (stateDetail?.body?.lastUpdated > 7 || !stateDetail?.body?.lastUpdated) ? '/pages/home' : stateDetail.body?.lastState;
        this.finalNavigate(route, false, isSocialLogin);
        return { type: 'EmptyAction' };
    }

    /**
     * Handles finalNavigate functionality
     */
    public finalNavigate(route: any, parameter?: any, isSocialLogin?: boolean): void {
        this._generalService.finalNavigate(route, parameter, isSocialLogin);
    }
}
