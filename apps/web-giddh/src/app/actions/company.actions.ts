import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store, select } from '@ngrx/store';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { BaseResponse } from '../models/api-models/BaseResponse';
import {
    CompanyCountry,
    CompanyCreateRequest,
    CompanyRequest,
    CompanyResponse,
    CreateCompanyUsersPlan,
    Organization,
    StateDetailsRequest,
    StateDetailsResponse,
    TaxResponse,
} from '../models/api-models/Company';
import { IRegistration } from '../models/interfaces/registration.interface';
import { OrganizationType } from '../models/user-login-state';
import { CompanyService } from '../services/companyService.service';
import { LocaleService } from '../services/locale.service';
import { ToasterService } from '../services/toaster.service';
import { CustomActions } from '../store/customActions';
import { AppState } from '../store/roots';
import { COMMON_ACTIONS } from './common.const';

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

    public static GET_TAX = 'GroupTax';
    public static GET_TAX_RESPONSE = 'GroupTaxResponse';
    public static USER_SELECTED_PLANS = 'USER_SELECTED_PLANS';
    public static CURRENT_COMPANY_CURRENCY = 'CURRENT_COMPANY_CURRENCY';
    public static USER_CAREATE_COMPANY = 'USER_CAREATE_COMPANY';
    public static USER_CAREATE_BRANCH = 'USER_CAREATE_BRANCH';
    public static GET_REGISTRATION_ACCOUNT_RESPONSE = 'GET_REGISTRATION_ACCOUNT_RESPONSE';
    public static GET_REGISTRATION_ACCOUNT = 'GET_REGISTRATION_ACCOUNT';
    public static SET_MULTIPLE_CURRENCY_FIELD = 'SET_MULTIPLE_CURRENCY_FIELD';
    public static GET_OTP = 'GET_OTP';
    public static TOTAL_COMPANIES = 'TOTAL_COMPANIES';

    public static USER_REMOVE_COMPANY_CREATE_SESSION = "USER_REMOVE_COMPANY_CREATE_SESSION";
    public static SET_IS_TCS_TDS_APPLICABLE = 'SET_IS_TCS_TDS_APPLICABLE';
    public static SET_USER_CHOSEN_FINANCIAL_YEAR = 'SET_USER_CHOSEN_FINANCIAL_YEAR';
    public static RESET_USER_CHOSEN_FINANCIAL_YEAR = 'RESET_USER_CHOSEN_FINANCIAL_YEAR';

    public static GET_ALL_INTEGRATED_BANK = 'GET_ALL_INTEGRATED_BANK';
    public static GET_ALL_INTEGRATED_BANK_RESPONSE = 'GET_ALL_INTEGRATED_BANK_RESPONSE';
    public static SET_COMPANY_BRANCH = 'SET_COMPANY_BRANCH';

    public static SET_ACTIVE_COMPANY_DATA = 'SET_ACTIVE_COMPANY_DATA';
    public static RESET_ACTIVE_COMPANY_DATA = 'ResetActiveCompanyData';
    public static GET_COMPANY_USER = 'GET_COMPANY_USER';
    public static GET_COMPANY_USER_RESPONSE = 'GET_COMPANY_USER_RESPONSE';

    public static SET_STATE_DETAILS_REQUEST = 'SET_STATE_DETAILS_REQUEST';

    public createNewCompany$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(CompanyActions.CREATE_NEW_COMPANY),
            switchMap((action: CustomActions) => this._companyService.CreateNewCompany(action.payload)),
            map(response => this.CreateNewCompanyResponse(response))));

    public createCompanyResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(CompanyActions.CREATE_COMPANY_RESPONSE),
            map((action: CustomActions) => {
                let response = action.payload as BaseResponse<CompanyResponse, CompanyRequest>;
                if (response?.status === 'error') {
                    this._toasty.errorToast(response.message, response.code);
                    return { type: 'EmptyAction' };
                }
                this._toasty.successToast(this.localeService.translate("app_messages.company_created"), this.localeService.translate("app_success"));

                if (response.request.isBranch) {
                    let branchUniqueName: any[] = [];
                    branchUniqueName.push(response.request?.uniqueName);
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
                this.store.pipe(select(s => s.session), take(1)).subscribe(s => {
                    isNewUser = s.userLoginState === 2;
                    prevTab = s.lastState;
                });

                if (isNewUser) {
                    this.store.dispatch({
                        type: 'SetLoginStatus',
                        payload: 1
                    });
                }

                let stateDetailsObj = new StateDetailsRequest();
                stateDetailsObj.companyUniqueName = response.request?.uniqueName;
                if (!response.request.isBranch) {
                    /**
                     * if user is signed up on their own take him to sales module
                     */
                    if (this._generalService.user.isNewUser) {
                        stateDetailsObj.lastState = isNewUser ? 'welcome' : 'sales';
                    } else {
                        stateDetailsObj.lastState = 'home';
                    }
                    if (prevTab !== 'user-details') {
                        this.store.dispatch(this.setStateDetailsRequest(stateDetailsObj));
                        this.store.dispatch(this.SetStateDetails(stateDetailsObj));
                    }
                }
                return this.RefreshCompanies();
            })));

    // CreateNewCompanyPage Response

    public createNewCompanyResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(CompanyActions.CREATE_NEW_COMPANY_RESPONSE),
            map((action: CustomActions) => {
                let response = action.payload as BaseResponse<CompanyResponse, CompanyCreateRequest>;
                if (response?.status === 'error') {
                    this._toasty.errorToast(response.message, response.code);
                    return { type: 'EmptyAction' };
                }
                this.store.dispatch({
                    type: 'USER_CAREATE_COMPANY',
                    payload: null
                });
                this._toasty.successToast(this.localeService.translate("app_messages.new_company_created"), this.localeService.translate("app_success"));

                if (response.request.isBranch) {
                    this.store.dispatch(this.userStoreCreateBranch(null));
                    let branchUniqueName: any[] = [];
                    branchUniqueName.push(response.request?.uniqueName);
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
                this.store.pipe(select(s => s.session), take(1)).subscribe(s => {
                    isNewUser = s.userLoginState === 2;
                    prevTab = s.lastState;
                });

                if (isNewUser) {
                    this.store.dispatch({
                        type: 'SetLoginStatus',
                        payload: 1
                    });
                }

                let stateDetailsObj = new StateDetailsRequest();
                stateDetailsObj.companyUniqueName = response.request?.uniqueName;
                if (!response.request.isBranch) {
                    /**
                     * if user is signed up on their own take him to sales module
                     */
                    if (this._generalService.user.isNewUser) {
                        stateDetailsObj.lastState = 'pages/onboarding';
                    } else {
                        stateDetailsObj.lastState = 'home';
                    }
                    if (prevTab !== 'user-details') {
                        this.store.dispatch(this.setStateDetailsRequest(stateDetailsObj));
                        this.store.dispatch(this.SetStateDetails(stateDetailsObj));
                    }
                }
                this.store.dispatch(this.removeCompanyCreateSession());
                return this.RefreshCompanies();
            })));

    public RefreshCompanies$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(CompanyActions.REFRESH_COMPANIES),
            switchMap((action: CustomActions) => this._companyService.CompanyList()),
            map(response => {
                if (response?.status === 'error') {
                    this._toasty.errorToast(response.message, response.code);
                    return { type: 'EmptyAction' };
                }
                return this.RefreshCompaniesResponse(response);
            })));

    public RefreshCompaniesResponse$: Observable<CustomActions> = createEffect(() => this.action$
        .pipe(
            ofType(CompanyActions.REFRESH_COMPANIES_RESPONSE),
            map((action: CustomActions) => {
                let response: BaseResponse<CompanyResponse[], string> = action.payload;
                if (response?.status === 'error') {
                    this._toasty.errorToast(response.message, response.code);
                    return { type: 'EmptyAction' };
                }
                // check if user have companies
                if (response?.body?.length) {
                    let activeCompanyName = null;
                    let totalCompany = 0;
                    this.store.pipe(select(s => s.session.companyUniqueName), take(1)).subscribe(a => activeCompanyName = a);
                    this.store.pipe(select(s => s.session.totalNumberOfcompanies), take(1)).subscribe(res => totalCompany = res);

                    if (activeCompanyName) {
                        let companyIndex = response.body.findIndex(cmp => cmp?.uniqueName === activeCompanyName);
                        if (companyIndex > -1) {
                            // if active company find no action needed
                            if (response.body.length === totalCompany) { // if company created success then only change to new created company otherwise refresh Api call will return null action
                                return { type: 'EmptyAction' };
                            } else {
                                return { type: 'EmptyAction' };
                            }
                        } else {
                            // if no active company active next company from companies list
                            return {
                                type: 'CHANGE_COMPANY',
                                payload: response.body[0]?.uniqueName
                            };
                        }
                    } else {
                        // if no active company active next company from companies list
                        return {
                            type: 'CHANGE_COMPANY',
                            payload: response.body[0]?.uniqueName
                        };
                    }
                } else {
                    //  if no companies available open create new company popup
                    return {
                        type: 'SetLoginStatus',
                        payload: 2
                    } as CustomActions;
                }
            })));

    public SetStateDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(CompanyActions.SET_STATE_DETAILS),
            switchMap((action: CustomActions) => this._companyService.setStateDetails(action.payload)),
            map(response => {
                if (response && response.status === 'error') {
                    this._toasty.errorToast(response.message, response.code);
                    return { type: 'EmptyAction' };
                }
                return this.SetStateDetailsResponse(response);
            })));

    public GetApplicationDate$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(CompanyActions.GET_APPLICATION_DATE),
            switchMap((action: CustomActions) => this._companyService.getApplicationDate()),
            map(response => {
                if (response && response.status === 'error') {
                    this._toasty.errorToast(response.message, response.code);
                    return { type: 'EmptyAction' };
                }
                return this.SeApplicationDateResponse(response);
            })));

    public SetApplicationDate$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(CompanyActions.SET_APPLICATION_DATE),
            switchMap((action: CustomActions) => this._companyService.setApplicationDate(action.payload)),
            map(response => {
                if (response?.status === 'error') {
                    this._toasty.errorToast(response.message, response.code);
                    return { type: 'EmptyAction' };
                } else if (response?.status === 'success') {
                    this._toasty.successToast(this.localeService.translate("app_messages.universal_date_updated"), this.localeService.translate("app_success"));
                    return this.SeApplicationDateResponse(response);
                }
            })));

    public CompanyTax$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(CompanyActions.GET_TAX),
            switchMap((action: CustomActions) => this._companyService.getCompanyTaxes()),
            map(response => {
                return this.getTaxResponse(response);
            })));

    public CompanyTaxResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(CompanyActions.GET_TAX_RESPONSE),
            map((action: CustomActions) => {
                if (action.payload?.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                }
                return { type: 'EmptyAction' };
            })));

    public GetRegisteredAccount$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(CompanyActions.GET_REGISTRATION_ACCOUNT),
            switchMap((action: CustomActions) => this._companyService.getRegisteredAccount()),
            map(response => {
                return this.getAllRegistrationsResponse(response);
            })));

    public GetRegisteredAccountResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(CompanyActions.GET_REGISTRATION_ACCOUNT_RESPONSE),
            map((action: CustomActions) => {
                if (action.payload?.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                }
                return { type: 'EmptyAction' };
            })));

    public getAllIntegratedBankInCompany$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(CompanyActions.GET_ALL_INTEGRATED_BANK),
            switchMap((action: CustomActions) => this._companyService.getIntegratedBankInCompany(action.payload)),
            map(response => {
                return this.getAllIntegratedBankInCompanyResponse(response);
            })));

    public getAllIntegratedBankInCompanyResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(CompanyActions.GET_ALL_INTEGRATED_BANK_RESPONSE),
            map((action: CustomActions) => {
                if (action.payload?.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                }
                return { type: 'EmptyAction' };
            })));

    public getCompanyUser$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(CompanyActions.GET_COMPANY_USER),
            switchMap((action: CustomActions) => this._companyService.getCompanyUser(action.payload)),
            map(response => {
                return this.getCompanyUserResponse(response);
            })));

    public getCompanyUserResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(CompanyActions.GET_COMPANY_USER_RESPONSE),
            map((action: CustomActions) => {
                if (action.payload?.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                }
                return { type: 'EmptyAction' };
            })));

    constructor(
        private action$: Actions,
        private _companyService: CompanyService,
        private _toasty: ToasterService,
        private store: Store<AppState>,
        private _generalService: GeneralService,
        private localeService: LocaleService
    ) {
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

    public selectedPlan(value: CreateCompanyUsersPlan): CustomActions {
        return {
            type: CompanyActions.USER_SELECTED_PLANS,
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

    public CreateNewCompanyResponse(value: BaseResponse<CompanyResponse, CompanyCreateRequest>): CustomActions {
        this.store.dispatch(this.ResetApplicationData());
        const details = {
            branchDetails: {
                uniqueName: ''
            }
        };
        const organization: Organization = {
            type: OrganizationType.Company, // Mode to which user is switched to
            uniqueName: '',
            details
        };
        this.store.dispatch(this.setCompanyBranch(organization));
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

    public GetStateDetailsResponse(value: BaseResponse<StateDetailsResponse, string>): CustomActions {
        return {
            type: CompanyActions.GET_STATE_DETAILS_RESPONSE,
            payload: value
        };
    }

    /**
     * This will set the newly created company uniquename and last state in store
     *
     * @param {*} value
     * @returns {CustomActions}
     * @memberof CompanyActions
     */
    public setStateDetailsRequest(value: any): CustomActions {
        return {
            type: CompanyActions.SET_STATE_DETAILS_REQUEST,
            payload: value
        }
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

    /**
     * Returns the action to set the financial year chosen in either sales or purchase register
     *
     * @param {string} filterValues Stores the filter values
     * @returns {CustomActions} Action to set the financial year
     * @memberof CompanyActions
     */
    public setUserChosenFinancialYear(filterValues: { financialYear: string, branchUniqueName: string, timeFilter: string }): CustomActions {
        return { type: CompanyActions.SET_USER_CHOSEN_FINANCIAL_YEAR, payload: filterValues };
    }

    /**
     * Returns the action to reset the financial year chosen in either sales or purchase register
     * when user leaves these modules
     *
     * @returns {CustomActions} Action to reset the financial year
     * @memberof CompanyActions
     */
    public resetUserChosenFinancialYear(): CustomActions {
        return { type: CompanyActions.RESET_USER_CHOSEN_FINANCIAL_YEAR };
    }
    /**
     * Get all bank integration
     *
     * @param {string} companyUniqueName
     * @returns {CustomActions}
     * @memberof CompanyActions
     */
    public getAllIntegratedBankInCompany(companyUniqueName: string): CustomActions {
        return {
            type: CompanyActions.GET_ALL_INTEGRATED_BANK,
            payload: companyUniqueName
        };
    }

    /**
     * to get all integrated banks list
     *
     * @param {BaseResponse<any, string>} value company unique name
     * @returns {CustomActions}
     * @memberof CompanyActions
     */
    public getAllIntegratedBankInCompanyResponse(value: BaseResponse<any, string>): CustomActions {
        return {
            type: CompanyActions.GET_ALL_INTEGRATED_BANK_RESPONSE,
            payload: value
        };
    }

    /**
     * Set the branch detail for a company
     *
     * @param {Organization} organizationDetails Details of the organization (branch)
     * @returns {CustomActions} Action to be dispatche
     * @memberof CompanyActions
     */
    public setCompanyBranch(organizationDetails: Organization): CustomActions {
        return {
            type: CompanyActions.SET_COMPANY_BRANCH,
            payload: organizationDetails
        };
    }

    /**
     * This will set the active company data in store
     *
     * @param {*} data
     * @returns {CustomActions}
     * @memberof CompanyActions
     */
    public setActiveCompanyData(data: any): CustomActions {
        return {
            type: CompanyActions.SET_ACTIVE_COMPANY_DATA,
            payload: data
        };
    }

    /**
     * This will initiate get company uer api
     *
     * @param {*} data
     * @returns {CustomActions}
     * @memberof CompanyActions
     */
    public getCompanyUser(data: any): CustomActions {
        return {
            type: CompanyActions.GET_COMPANY_USER,
            payload: data
        };
    }

    /**
     * This will set the company uer data in store
     *
     * @param {BaseResponse<any, string>} value
     * @returns {CustomActions}
     * @memberof CompanyActions
     */
    public getCompanyUserResponse(value: BaseResponse<any, string>): CustomActions {
        return {
            type: CompanyActions.GET_COMPANY_USER_RESPONSE,
            payload: value
        };
    }

    /**
     * This will reset the active company data in store
     *
     * @param {*} data
     * @returns {CustomActions}
     * @memberof CompanyActions
     */
    public resetActiveCompanyData(): CustomActions {
        return {
            type: CompanyActions.RESET_ACTIVE_COMPANY_DATA,
            payload: null
        };
    }
}
