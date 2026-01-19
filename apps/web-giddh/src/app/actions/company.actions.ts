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
import { CompanyService } from '../services/company.service';
import { LocaleService } from '../services/locale.service';
import { ToasterService } from '../services/toaster.service';
import { CustomActions } from '../store/custom-actions';
import { AppState } from '../store/roots';
import { COMMON_ACTIONS } from './common.const';
import { findIndex } from '../lodash-optimized';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})

/**
 * CompanyActions actions
 * Defines company related action creators for state management
 */
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
            /**
             * Handles ofType functionality
             */
            ofType(CompanyActions.CREATE_NEW_COMPANY),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._companyService.CreateNewCompany(action.payload)),
            /**
             * Handles map functionality
             */
            map(response => this.CreateNewCompanyResponse(response))));

    public createCompanyResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(CompanyActions.CREATE_COMPANY_RESPONSE),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => {
                let response = action.payload as BaseResponse<CompanyResponse, CompanyRequest>;
                /**
                 * Handles if functionality
                 */
                if (response?.status === 'error') {
                    this._toasty.errorToast(response.message, response.code);
                    return { type: 'EmptyAction' };
                }
                this._toasty.successToast(this.localeService.translate("app_messages.company_created"), this.localeService.translate("app_success"));

                /**
                 * Handles if functionality
                 */
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

                /**
                 * Handles if functionality
                 */
                if (isNewUser) {
                    this.store.dispatch({
                        type: 'SetLoginStatus',
                        payload: 1
                    });
                }

                let stateDetailsObj = new StateDetailsRequest();
                stateDetailsObj.companyUniqueName = response.request?.uniqueName;
                /**
                 * Handles if functionality
                 */
                if (!response.request.isBranch) {
                    /**
                     * if user is signed up on their own take him to sales module
                     */
                    if (this._generalService.user.isNewUser) {
                        stateDetailsObj.lastState = isNewUser ? 'welcome' : 'sales';
                    } else {
                        stateDetailsObj.lastState = 'home';
                    }
                    /**
                     * Handles if functionality
                     */
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
            /**
             * Handles ofType functionality
             */
            ofType(CompanyActions.CREATE_NEW_COMPANY_RESPONSE),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => {
                let response = action.payload as BaseResponse<CompanyResponse, CompanyCreateRequest>;
                /**
                 * Handles if functionality
                 */
                if (response?.status === 'error') {
                    this._toasty.errorToast(response.message, response.code);
                    return { type: 'EmptyAction' };
                }
                this.store.dispatch({
                    type: 'USER_CAREATE_COMPANY',
                    payload: null
                });
                this._toasty.successToast(this.localeService.translate("app_messages.new_company_created"), this.localeService.translate("app_success"));

                /**
                 * Handles if functionality
                 */
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

                /**
                 * Handles if functionality
                 */
                if (isNewUser) {
                    this.store.dispatch({
                        type: 'SetLoginStatus',
                        payload: 1
                    });
                }

                let stateDetailsObj = new StateDetailsRequest();
                stateDetailsObj.companyUniqueName = response.request?.uniqueName;
                /**
                 * Handles if functionality
                 */
                if (!response.request.isBranch) {
                    /**
                     * if user is signed up on their own take him to sales module
                     */
                    if (this._generalService.user.isNewUser) {
                        stateDetailsObj.lastState = 'pages/onboarding';
                    } else {
                        stateDetailsObj.lastState = 'home';
                    }
                    /**
                     * Handles if functionality
                     */
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
            /**
             * Handles ofType functionality
             */
            ofType(CompanyActions.REFRESH_COMPANIES),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._companyService.CompanyList()),
            /**
             * Handles map functionality
             */
            map(response => {
                /**
                 * Handles if functionality
                 */
                if (response?.status === 'error') {
                    this._toasty.errorToast(response.message, response.code);
                    return { type: 'EmptyAction' };
                }
                return this.RefreshCompaniesResponse(response);
            })));

    public RefreshCompaniesResponse$: Observable<CustomActions> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(CompanyActions.REFRESH_COMPANIES_RESPONSE),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => {
                let response: BaseResponse<CompanyResponse[], string> = action?.payload;
                /**
                 * Handles if functionality
                 */
                if (response?.status === 'error') {
                    this._toasty.errorToast(response.message, response.code);
                    return { type: 'EmptyAction' };
                }
                // check if user have companies
                /**
                 * Handles if functionality
                 */
                if (response?.body?.length) {
                    let activeCompanyName = null;
                    let totalCompany = 0;
                    this.store.pipe(select(s => s.session.companyUniqueName), take(1)).subscribe(a => activeCompanyName = a);
                    this.store.pipe(select(s => s.session.totalNumberOfcompanies), take(1)).subscribe(res => totalCompany = res);

                    /**
                     * Handles if functionality
                     */
                    if (activeCompanyName) {
                        let companyIndex = response.body?.findIndex(cmp => cmp?.uniqueName === activeCompanyName);
                        /**
                         * Handles if functionality
                         */
                        if (companyIndex > -1) {
                            // if active company find no action needed
                            /**
                             * Handles if functionality
                             */
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
            /**
             * Handles ofType functionality
             */
            ofType(CompanyActions.SET_STATE_DETAILS),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._companyService.setStateDetails(action.payload)),
            /**
             * Handles map functionality
             */
            map(response => {
                /**
                 * Handles if functionality
                 */
                if (response && response.status === 'error') {
                    this._toasty.errorToast(response.message, response.code);
                    return { type: 'EmptyAction' };
                }
                return this.SetStateDetailsResponse(response);
            })));

    public GetApplicationDate$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(CompanyActions.GET_APPLICATION_DATE),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._companyService.getApplicationDate()),
            /**
             * Handles map functionality
             */
            map(response => {
                /**
                 * Handles if functionality
                 */
                if (response && response.status === 'error') {
                    this._toasty.errorToast(response.message, response.code);
                    return { type: 'EmptyAction' };
                }
                return this.SeApplicationDateResponse(response);
            })));

    public SetApplicationDate$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(CompanyActions.SET_APPLICATION_DATE),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._companyService.setApplicationDate(action.payload)),
            /**
             * Handles map functionality
             */
            map(response => {
                /**
                 * Handles if functionality
                 */
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
            /**
             * Handles ofType functionality
             */
            ofType(CompanyActions.GET_TAX),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._companyService.getCompanyTaxes()),
            /**
             * Handles map functionality
             */
            map(response => {
                return this.getTaxResponse(response);
            })));

    public CompanyTaxResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(CompanyActions.GET_TAX_RESPONSE),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => {
                /**
                 * Handles if functionality
                 */
                if (action.payload?.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                }
                return { type: 'EmptyAction' };
            })));

    public GetRegisteredAccount$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(CompanyActions.GET_REGISTRATION_ACCOUNT),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._companyService.getRegisteredAccount()),
            /**
             * Handles map functionality
             */
            map(response => {
                return this.getAllRegistrationsResponse(response);
            })));

    public GetRegisteredAccountResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(CompanyActions.GET_REGISTRATION_ACCOUNT_RESPONSE),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => {
                /**
                 * Handles if functionality
                 */
                if (action.payload?.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                }
                return { type: 'EmptyAction' };
            })));

    public getAllIntegratedBankInCompany$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(CompanyActions.GET_ALL_INTEGRATED_BANK),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._companyService.getIntegratedBankInCompany(action.payload)),
            /**
             * Handles map functionality
             */
            map(response => {
                return this.getAllIntegratedBankInCompanyResponse(response);
            })));

    public getAllIntegratedBankInCompanyResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(CompanyActions.GET_ALL_INTEGRATED_BANK_RESPONSE),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => {
                /**
                 * Handles if functionality
                 */
                if (action.payload?.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                }
                return { type: 'EmptyAction' };
            })));

    public getCompanyUser$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(CompanyActions.GET_COMPANY_USER),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._companyService.getCompanyUser(action.payload)),
            /**
             * Handles map functionality
             */
            map(response => {
                return this.getCompanyUserResponse(response);
            })));

    public getCompanyUserResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(CompanyActions.GET_COMPANY_USER_RESPONSE),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => {
                /**
                 * Handles if functionality
                 */
                if (action.payload?.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                }
                return { type: 'EmptyAction' };
            })));

    /**
     * Creates an instance of actions
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private action$: Actions,
        private _companyService: CompanyService,
        private _toasty: ToasterService,
        private store: Store<AppState>,
        private _generalService: GeneralService,
        private localeService: LocaleService
    ) {
    }

    /**
     * Handles CreateNewCompany functionality
     */
    public CreateNewCompany(value: CompanyCreateRequest): CustomActions {
        return {
            type: CompanyActions.CREATE_NEW_COMPANY,
            payload: value
        };
    }

    /**
     * Handles RefreshCompanies functionality
     */
    public RefreshCompanies(): CustomActions {
        return {
            type: CompanyActions.REFRESH_COMPANIES
        };
    }

    /**
     * Handles RefreshCompaniesResponse functionality
     */
    public RefreshCompaniesResponse(response: BaseResponse<CompanyResponse[], string>): CustomActions {
        return {
            type: CompanyActions.REFRESH_COMPANIES_RESPONSE,
            payload: response
        };
    }

    /**
     * Handles selectedPlan functionality
     */
    public selectedPlan(value: CreateCompanyUsersPlan): CustomActions {
        return {
            type: CompanyActions.USER_SELECTED_PLANS,
            payload: value
        };
    }

    /**
     * Sets totalnumberofcompanies value
     */
    public setTotalNumberofCompanies(value: number): CustomActions {
        return {
            type: CompanyActions.TOTAL_COMPANIES,
            payload: value
        };
    }

    /**
     * Sets currentcompanycurrency value
     */
    public setCurrentCompanyCurrency(value: CompanyCountry): CustomActions {
        return {
            type: CompanyActions.CURRENT_COMPANY_CURRENCY,
            payload: value
        };
    }

    /**
     * Handles userStoreCreateCompany functionality
     */
    public userStoreCreateCompany(value: CompanyCreateRequest): CustomActions {
        return {
            type: CompanyActions.USER_CAREATE_COMPANY,
            payload: value
        };
    }

    /**
     * Handles userStoreCreateBranch functionality
     */
    public userStoreCreateBranch(value: CompanyCreateRequest): CustomActions {
        return {
            type: CompanyActions.USER_CAREATE_BRANCH,
            payload: value
        };
    }

    /**
     * Handles CreateNewCompanyResponse functionality
     */
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

    /**
     * Handles ResetApplicationData functionality
     */
    public ResetApplicationData(): CustomActions {
        return {
            type: COMMON_ACTIONS.RESET_APPLICATION_DATA
        };
    }

    /**
     * Handles GetStateDetailsResponse functionality
     */
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

    /**
     * Handles SetStateDetails functionality
     */
    public SetStateDetails(value: StateDetailsRequest): CustomActions {
        return {
            type: CompanyActions.SET_STATE_DETAILS,
            payload: value
        };
    }

    /**
     * Handles GetApplicationDate functionality
     */
    public GetApplicationDate(): CustomActions {
        return {
            type: CompanyActions.GET_APPLICATION_DATE,
            payload: null
        };
    }

    /**
     * Handles SetApplicationDate functionality
     */
    public SetApplicationDate(value: any): CustomActions {
        return {
            type: CompanyActions.SET_APPLICATION_DATE,
            payload: value
        };
    }

    /**
     * Handles SeApplicationDateResponse functionality
     */
    public SeApplicationDateResponse(value: BaseResponse<string, any>): CustomActions {
        return {
            type: CompanyActions.SET_APPLICATION_DATE_RESPONSE,
            payload: value
        };
    }

    /**
     * Handles ResetApplicationDate functionality
     */
    public ResetApplicationDate(): CustomActions {
        return {
            type: CompanyActions.RESET_APPLICATION_DATE,
        };
    }

    /**
     * Handles SetStateDetailsResponse functionality
     */
    public SetStateDetailsResponse(value: BaseResponse<string, StateDetailsRequest>): CustomActions {
        return {
            type: CompanyActions.SET_STATE_DETAILS_RESPONSE,
            payload: value
        };
    }

    /**
     * Retrieves tax data
     */
    public getTax(): CustomActions {
        return {
            type: CompanyActions.GET_TAX
        };
    }

    /**
     * Retrieves taxresponse data
     */
    public getTaxResponse(value: BaseResponse<TaxResponse[], string>): CustomActions {
        return {
            type: CompanyActions.GET_TAX_RESPONSE,
            payload: value
        };
    }

    /**
     * Handles SetContactNumber functionality
     */
    public SetContactNumber(value: string): CustomActions {
        return {
            type: CompanyActions.SET_CONTACT_NO,
            payload: value
        };
    }

    /**
     * Handles ResetCompanyPopup functionality
     */
    public ResetCompanyPopup(): CustomActions {
        return { type: CompanyActions.RESET_CREATE_COMPANY_FLAG };
    }

    /**
     * Retrieves allregistrations data
     */
    public getAllRegistrations(): CustomActions {
        return {
            type: CompanyActions.GET_REGISTRATION_ACCOUNT
        };
    }

    /**
     * Retrieves allregistrationsresponse data
     */
    public getAllRegistrationsResponse(value: BaseResponse<IRegistration, string>): CustomActions {
        return {
            type: CompanyActions.GET_REGISTRATION_ACCOUNT_RESPONSE,
            payload: value
        };
    }

    /**
     * Deletes companycreatesession
     */
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
    public setUserChosenFinancialYear(filterValues: { financialYear: string, branchUniqueName: string, timeFilter: string, salesPersonUniqueNames: string[], accountUniqueNames: string[], groupBy: string }): CustomActions {
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
