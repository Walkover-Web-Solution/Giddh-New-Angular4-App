import { map, switchMap, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CompanyService } from '../services/companyService.service';
import { Actions, Effect } from '@ngrx/effects';
import { CompanyRequest, CompanyResponse, StateDetailsRequest, StateDetailsResponse, TaxResponse, CompanyCreateRequest, CreateCompanyUsersPlan, CompanyCountry } from '../models/api-models/Company';
import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { ToasterService } from '../services/toaster.service';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { AppState } from '../store/roots';
import { CustomActions } from '../store/customActions';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { COMMON_ACTIONS } from './common.const';
import { IRegistration } from "../models/interfaces/registration.interface";

@Injectable()

export class CompanyActions {
    public static CREATE_COMPANY = 'CompanyCreate';
    public static CREATE_NEW_COMPANY = 'CompanynewCreate';
    public static CREATE_COMPANY_RESPONSE = 'CompanyResponse';
    public static CREATE_NEW_COMPANY_RESPONSE = 'CompanyNewResponse';
    public static RESET_CREATE_COMPANY_FLAG = 'RESET_CREATE_COMPANY_FLAG';
    public static REFRESH_COMPANIES = 'CompanyRefresh';
    public static REFRESH_COMPANIES_RESPONSE = 'CompanyRefreshResponse';
    public static GET_STATE_DETAILS = 'CompanyGetStateDetails';
    public static GET_STATE_DETAILS_RESPONSE = 'CompanyGetStateDetailsResponse';
    public static SET_STATE_DETAILS = 'CompanySetStateDetails';
    public static SET_STATE_DETAILS_RESPONSE = 'CompanySetStateDetailsResponse';
    public static GET_APPLICATION_DATE = 'GetApplicationDate';
    public static SET_APPLICATION_DATE = 'SetApplicationDate';
    public static SET_APPLICATION_DATE_RESPONSE = 'SetApplicationDateResponse';
    public static RESET_APPLICATION_DATE = 'ResetApplicationDate';

    public static CHANGE_COMPANY = 'CHANGE_COMPANY';
    public static CHANGE_COMPANY_RESPONSE = 'CHANGE_COMPANY_RESPONSE';

    public static SET_ACTIVE_COMPANY = 'CompanyActiveCompany';
    public static SET_CONTACT_NO = 'SET_CONTACT_NO';

    public static DELETE_COMPANY = 'CompanyDelete';
    public static DELETE_COMPANY_RESPONSE = 'CompanyDeleteResponse';
    public static GET_TAX = 'GroupTax';
    public static GET_TAX_RESPONSE = 'GroupTaxResponse';
    public static USER_SELECTED_PLANS = 'USER_SELECTED_PLANS';
    public static CURRENT_COMPANY_SUBSCRIPTIONS_PLANS = 'CURRENT_COMPANY_SUBSCRIPTIONS_PLANS';
    public static CURRENT_COMPANY_CURRENCY = 'CURRENT_COMPANY_CURRENCY';
    public static USER_CAREATE_COMPANY = 'USER_CAREATE_COMPANY';
    public static USER_CAREATE_BRANCH = 'USER_CAREATE_BRANCH';
    public static GET_REGISTRATION_ACCOUNT_RESPONSE = 'GET_REGISTRATION_ACCOUNT_RESPONSE';
    public static GET_REGISTRATION_ACCOUNT = 'GET_REGISTRATION_ACCOUNT';
    public static SET_MULTIPLE_CURRENCY_FIELD = 'SET_MULTIPLE_CURRENCY_FIELD';
    public static GET_OTP = 'GET_OTP';
    public static TOTAL_COMPANIES = 'TOTAL_COMPANIES';

    public static SET_ACTIVE_FINANCIAL_YEAR = 'SET_ACTIVE_FINANCIAL_YEAR';

    public static USER_REMOVE_COMPANY_CREATE_SESSION = "USER_REMOVE_COMPANY_CREATE_SESSION";
    public static SET_IS_TCS_TDS_APPLICABLE = 'SET_IS_TCS_TDS_APPLICABLE';

    @Effect()
    public createCompany$: Observable<Action> = this.action$
        .ofType(CompanyActions.CREATE_COMPANY).pipe(
            switchMap((action: CustomActions) => this._companyService.CreateCompany(action.payload)),
            map(response => this.CreateCompanyResponse(response)));

    @Effect()
    public createNewCompany$: Observable<Action> = this.action$
        .ofType(CompanyActions.CREATE_NEW_COMPANY).pipe(
            switchMap((action: CustomActions) => this._companyService.CreateNewCompany(action.payload)),
            map(response => this.CreateNewCompanyResponse(response)));

    @Effect()
    public createCompanyResponse$: Observable<Action> = this.action$
        .ofType(CompanyActions.CREATE_COMPANY_RESPONSE).pipe(
            map((action: CustomActions) => {
                let response = action.payload as BaseResponse<CompanyResponse, CompanyRequest>;
                if (response.status === 'error') {
                    this._toasty.errorToast(response.message, response.code);
                    return { type: 'EmptyAction' };
                }
                this._toasty.successToast('Company created successfully', 'Success');

                // is brahch set
                if (response.request.isBranch) {
                    //
                    let branchUniqueName: any[] = [];
                    branchUniqueName.push(response.request.uniqueName);
                    let dataToSend = { childCompanyUniqueNames: branchUniqueName };
                    this.store.dispatch({
                        type: 'CREATE_BRANCHES',
                        payload: dataToSend
                    });
                }

                // set newly created company as active company

                // check if new uer has created first company then set newUserLoggedIn false
                let isNewUser = false;
                let prevTab = '';
                this.store.select(s => s.session).pipe(take(1)).subscribe(s => {
                    isNewUser = s.userLoginState === 2;
                    prevTab = s.lastState;
                });
                //
                if (isNewUser) {
                    this.store.dispatch({
                        type: 'SetLoginStatus',
                        payload: 1
                    });
                }

                let stateDetailsObj = new StateDetailsRequest();
                stateDetailsObj.companyUniqueName = response.request.uniqueName;
                if (!response.request.isBranch) {
                    /**
                     * if user is signed up on their own take him to sales module
                     */
                    if (this._generalService.user.isNewUser) {
                        // stateDetailsObj.lastState = 'sales';
                        stateDetailsObj.lastState = isNewUser ? 'welcome' : 'sales';
                    } else {
                        stateDetailsObj.lastState = 'home';
                    }
                    if (prevTab !== 'user-details') {
                        this.store.dispatch(this.SetStateDetails(stateDetailsObj));
                    }
                }
                return this.RefreshCompanies();
            }));


    // CreateNewCompany Response

    @Effect()
    public createNewCompanyResponse$: Observable<Action> = this.action$
        .ofType(CompanyActions.CREATE_NEW_COMPANY_RESPONSE).pipe(
            map((action: CustomActions) => {
                let response = action.payload as BaseResponse<CompanyResponse, CompanyCreateRequest>;
                if (response.status === 'error') {
                    this._toasty.errorToast(response.message, response.code);
                    return { type: 'EmptyAction' };
                }
                this.store.dispatch({
                    type: 'USER_CAREATE_COMPANY',
                    payload: null
                });
                this._toasty.successToast('New company created successfully', 'Success');

                // is brahch set
                if (response.request.isBranch) {
                    //
                    this.store.dispatch(this.userStoreCreateBranch(null));
                    let branchUniqueName: any[] = [];
                    branchUniqueName.push(response.request.uniqueName);
                    let dataToSend = { childCompanyUniqueNames: branchUniqueName };
                    this.store.dispatch({
                        type: 'CREATE_BRANCHES',
                        payload: dataToSend
                    });
                }

                // set newly created company as active company

                // check if new uer has created first company then set newUserLoggedIn false
                let isNewUser = false;
                let prevTab = '';
                this.store.select(s => s.session).pipe(take(1)).subscribe(s => {
                    isNewUser = s.userLoginState === 2;
                    prevTab = s.lastState;
                });
                //
                if (isNewUser) {
                    this.store.dispatch({
                        type: 'SetLoginStatus',
                        payload: 1
                    });
                }

                let stateDetailsObj = new StateDetailsRequest();
                stateDetailsObj.companyUniqueName = response.request.uniqueName;
                if (!response.request.isBranch) {
                    /**
                     * if user is signed up on their own take him to sales module
                     */
                    if (this._generalService.user.isNewUser) {
                        stateDetailsObj.lastState = 'pages/onboarding';
                        // stateDetailsObj.lastState = isNewUser ? 'onboarding' : 'sales';
                    } else {
                        stateDetailsObj.lastState = 'home';
                    }
                    if (prevTab !== 'user-details') {
                        this.store.dispatch(this.SetStateDetails(stateDetailsObj));
                    }
                }
                this.store.dispatch(this.removeCompanyCreateSession());
                return this.RefreshCompanies();
            }));

    @Effect()
    public RefreshCompanies$: Observable<Action> = this.action$
        .ofType(CompanyActions.REFRESH_COMPANIES).pipe(
            switchMap((action: CustomActions) => this._companyService.CompanyList()),
            map(response => {
                if (response.status === 'error') {
                    this._toasty.errorToast(response.message, response.code);
                    return { type: 'EmptyAction' };
                }
                return this.RefreshCompaniesResponse(response);
            }));

    @Effect()
    public RefreshCompaniesResponse$: Observable<CustomActions> = this.action$
        .ofType(CompanyActions.REFRESH_COMPANIES_RESPONSE).pipe(
            map((action: CustomActions) => {
                let response: BaseResponse<CompanyResponse[], string> = action.payload;
                if (response.status === 'error') {
                    this._toasty.errorToast(response.message, response.code);
                    return { type: 'EmptyAction' };
                }
                // check if user have companies
                if (response.body.length) {
                    let activeCompanyName = null;
                    let totalCompany = 0;
                    this.store.select(s => s.session.companyUniqueName).pipe(take(1)).subscribe(a => activeCompanyName = a);
                    this.store.select(s => s.session.totalNumberOfcompanies).pipe(take(1)).subscribe(res => totalCompany = res);

                    if (activeCompanyName) {
                        let companyIndex = response.body.findIndex(cmp => cmp.uniqueName === activeCompanyName);
                        if (companyIndex > -1) {
                            // if active company find no action needed
                            if (response.body.length === totalCompany) {     // if company created success then only change to new created company otherwise refres Api call will return null action
                                return { type: 'EmptyAction' };

                            } else {
                                return {
                                    type: 'CHANGE_COMPANY',
                                    payload: response.body[companyIndex].uniqueName
                                };
                            }

                            // return { type: 'EmptyAction' };
                        } else {
                            // if no active company active next company from companies list
                            return {
                                type: 'CHANGE_COMPANY',
                                payload: response.body[0].uniqueName
                            };
                        }
                    } else {
                        // if no active company active next company from companies list
                        return {
                            type: 'CHANGE_COMPANY',
                            payload: response.body[0].uniqueName
                        };
                    }
                } else {
                    //  if no companies available open create new company popup
                    return {
                        type: 'SetLoginStatus',
                        payload: 2
                    } as CustomActions;
                }
            }));

    @Effect()
    public GetStateDetails$: Observable<Action> = this.action$
        .ofType(CompanyActions.GET_STATE_DETAILS).pipe(
            switchMap((action: CustomActions) => this._companyService.getStateDetails(action.payload)),
            map(response => {
                if (response.status === 'error') {
                    this._toasty.errorToast(response.message, response.code);
                    return { type: 'EmptyAction' };
                }
                return this.GetStateDetailsResponse(response);
            }));

    @Effect()
    public SetStateDetails$: Observable<Action> = this.action$
        .ofType(CompanyActions.SET_STATE_DETAILS).pipe(
            switchMap((action: CustomActions) => this._companyService.setStateDetails(action.payload)),
            map(response => {
                if (response && response.status === 'error') {
                    this._toasty.errorToast(response.message, response.code);
                    return { type: 'EmptyAction' };
                }
                return this.SetStateDetailsResponse(response);
            }));

    @Effect()
    public GetApplicationDate$: Observable<Action> = this.action$
        .ofType(CompanyActions.GET_APPLICATION_DATE).pipe(
            switchMap((action: CustomActions) => this._companyService.getApplicationDate()),
            map(response => {
                if (response && response.status === 'error') {
                    this._toasty.errorToast(response.message, response.code);
                    return { type: 'EmptyAction' };
                }
                return this.SeApplicationDateResponse(response);
            }));

    @Effect()
    public SetApplicationDate$: Observable<Action> = this.action$
        .ofType(CompanyActions.SET_APPLICATION_DATE).pipe(
            switchMap((action: CustomActions) => this._companyService.setApplicationDate(action.payload)),
            map(response => {
                if (response.status === 'error') {
                    this._toasty.errorToast(response.message, response.code);
                    return { type: 'EmptyAction' };
                } else if (response.status === 'success') {
                    this._toasty.successToast('Application date updated successfully.', 'Success');
                    return this.SeApplicationDateResponse(response);
                }
            }));

    @Effect()
    public DeleteCompany$: Observable<Action> = this.action$
        .ofType(CompanyActions.DELETE_COMPANY).pipe(
            switchMap((action: CustomActions) => this._companyService.DeleteCompany(action.payload)),
            map(response => {
                return this.DeleteCompanyResponse(response);
            }));

    @Effect()
    public DeleteCompanyResponse$: Observable<Action> = this.action$
        .ofType(CompanyActions.DELETE_COMPANY_RESPONSE).pipe(
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                    return { type: 'EmptyAction' };
                } else {
                    this._toasty.successToast(action.payload.body, 'success');
                }
                this.store.dispatch(this.RefreshCompanies());
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public CompanyTax$: Observable<Action> = this.action$
        .ofType(CompanyActions.GET_TAX).pipe(
            switchMap((action: CustomActions) => this._companyService.getComapnyTaxes()),
            map(response => {
                return this.getTaxResponse(response);
            }));

    @Effect()
    public CompanyTaxResponse$: Observable<Action> = this.action$
        .ofType(CompanyActions.GET_TAX_RESPONSE).pipe(
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public GetRegisteredAccount$: Observable<Action> = this.action$
        .ofType(CompanyActions.GET_REGISTRATION_ACCOUNT).pipe(
            switchMap((action: CustomActions) => this._companyService.getRegisteredAccount()),
            map(response => {
                return this.getAllRegistrationsResponse(response);
            }));

    @Effect()
    public GetRegisteredAccountResponse$: Observable<Action> = this.action$
        .ofType(CompanyActions.GET_REGISTRATION_ACCOUNT_RESPONSE).pipe(
            map((action: CustomActions) => {
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                }
                return { type: 'EmptyAction' };
            }));

    constructor(
        private action$: Actions,
        private _companyService: CompanyService,
        private _toasty: ToasterService,
        private store: Store<AppState>,
        private _generalService: GeneralService
    ) {
    }

    public CreateCompany(value: CompanyRequest): CustomActions {
        return {
            type: CompanyActions.CREATE_COMPANY,
            payload: value
        };
    }
    public CreateNewCompany(value: CompanyCreateRequest): CustomActions {
        return {
            type: CompanyActions.CREATE_NEW_COMPANY,
            payload: value
        };
    }

    public RefreshCompanies(): CustomActions {
        return {
            type: CompanyActions.REFRESH_COMPANIES
        };
    }

    public RefreshCompaniesResponse(response: BaseResponse<CompanyResponse[], string>): CustomActions {
        return {
            type: CompanyActions.REFRESH_COMPANIES_RESPONSE,
            payload: response
        };
    }

    public SetActiveCompany(value: string): CustomActions {
        return {
            type: CompanyActions.SET_ACTIVE_COMPANY,
            payload: value
        };
    }

    public selectedPlan(value: CreateCompanyUsersPlan): CustomActions {
        return {
            type: CompanyActions.USER_SELECTED_PLANS,
            payload: value
        };
    }
    public setCurrentCompanySubscriptionPlan(value: CreateCompanyUsersPlan): CustomActions {
        return {
            type: CompanyActions.CURRENT_COMPANY_SUBSCRIPTIONS_PLANS,
            payload: value
        };
    }
    public setTotalNumberofCompanies(value: number): CustomActions {
        return {
            type: CompanyActions.TOTAL_COMPANIES,
            payload: value
        };
    }
    public setCurrentCompanyCurrency(value: CompanyCountry): CustomActions {
        return {
            type: CompanyActions.CURRENT_COMPANY_CURRENCY,
            payload: value
        };
    }
    public userStoreCreateCompany(value: CompanyCreateRequest): CustomActions {
        return {
            type: CompanyActions.USER_CAREATE_COMPANY,
            payload: value
        };
    }
    public userStoreCreateBranch(value: CompanyCreateRequest): CustomActions {
        return {
            type: CompanyActions.USER_CAREATE_BRANCH,
            payload: value
        };
    }

    public CreateCompanyResponse(value: BaseResponse<CompanyResponse, CompanyRequest>): CustomActions {
        this.store.dispatch(this.ResetApplicationData());
        return {
            type: CompanyActions.CREATE_COMPANY_RESPONSE,
            payload: value
        };
    }
    public CreateNewCompanyResponse(value: BaseResponse<CompanyResponse, CompanyCreateRequest>): CustomActions {
        this.store.dispatch(this.ResetApplicationData());
        return {
            type: CompanyActions.CREATE_NEW_COMPANY_RESPONSE,
            payload: value
        };
    }

    public ResetApplicationData(): CustomActions {
        return {
            type: COMMON_ACTIONS.RESET_APPLICATION_DATA
        };
    }

    public GetStateDetails(cmpUniqueName?: string): CustomActions {
        return {
            type: CompanyActions.GET_STATE_DETAILS,
            payload: cmpUniqueName
        };
    }

    public GetStateDetailsResponse(value: BaseResponse<StateDetailsResponse, string>): CustomActions {
        return {
            type: CompanyActions.GET_STATE_DETAILS_RESPONSE,
            payload: value
        };
    }

    public SetStateDetails(value: StateDetailsRequest): CustomActions {
        return {
            type: CompanyActions.SET_STATE_DETAILS,
            payload: value
        };
    }

    public GetApplicationDate(): CustomActions {
        return {
            type: CompanyActions.GET_APPLICATION_DATE,
            payload: null
        };
    }

    public SetApplicationDate(value: any): CustomActions {
        return {
            type: CompanyActions.SET_APPLICATION_DATE,
            payload: value
        };
    }

    public SeApplicationDateResponse(value: BaseResponse<string, any>): CustomActions {
        return {
            type: CompanyActions.SET_APPLICATION_DATE_RESPONSE,
            payload: value
        };
    }

    public ResetApplicationDate(): CustomActions {
        return {
            type: CompanyActions.RESET_APPLICATION_DATE,
        };
    }

    public SetStateDetailsResponse(value: BaseResponse<string, StateDetailsRequest>): CustomActions {
        return {
            type: CompanyActions.SET_STATE_DETAILS_RESPONSE,
            payload: value
        };
    }

    public DeleteCompany(value: string) {
        return {
            type: CompanyActions.DELETE_COMPANY,
            payload: value
        };
    }

    public DeleteCompanyResponse(value: BaseResponse<string, string>) {
        return {
            type: CompanyActions.DELETE_COMPANY_RESPONSE,
            payload: value
        };
    }

    public getTax(): CustomActions {
        return {
            type: CompanyActions.GET_TAX
        };
    }

    public getTaxResponse(value: BaseResponse<TaxResponse[], string>): CustomActions {
        return {
            type: CompanyActions.GET_TAX_RESPONSE,
            payload: value
        };
    }

    public SetContactNumber(value: string): CustomActions {
        return {
            type: CompanyActions.SET_CONTACT_NO,
            payload: value
        };
    }

    public ResetCompanyPopup(): CustomActions {
        return { type: CompanyActions.RESET_CREATE_COMPANY_FLAG };
    }

    /**
     * setActiveFinancialYear
     */
    public setActiveFinancialYear(activeFinancialYear) {
        return {
            type: CompanyActions.SET_ACTIVE_FINANCIAL_YEAR,
            payload: activeFinancialYear
        };
    }

    public getAllRegistrations(): CustomActions {
        return {
            type: CompanyActions.GET_REGISTRATION_ACCOUNT
        };
    }

    public getAllRegistrationsResponse(value: BaseResponse<IRegistration, string>): CustomActions {
        return {
            type: CompanyActions.GET_REGISTRATION_ACCOUNT_RESPONSE,
            payload: value
        };
    }

    public removeCompanyCreateSession(): CustomActions {
        return { type: CompanyActions.USER_REMOVE_COMPANY_CREATE_SESSION };
    }

    /**
     * Returns the action to set whether company country is
     * eligible for other tax (TCS/TDS)
     *
     * @param {string} isTcsTdsApplicable True if the company country has other tax (TCS/TDS)
     * @returns {CustomActions} Action to set country eligibility for other tax (TCS/TDS)
     * @memberof CompanyActions
     */
    public setCompanyTcsTdsApplicability(isTcsTdsApplicable: boolean): CustomActions {
        return { type: CompanyActions.SET_IS_TCS_TDS_APPLICABLE, payload: isTcsTdsApplicable };
    }
}
