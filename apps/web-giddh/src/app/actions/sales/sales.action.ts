import { map, switchMap, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToasterService } from '../../services/toaster.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { SALES_ACTIONS } from './sales.const';
import { AccountRequestV2, AccountResponseV2, AddAccountRequest, UpdateAccountRequest } from '../../models/api-models/Account';
import { AccountService } from '../../services/account.service';
import { CustomActions } from '../../store/custom-actions';
import { IUpdateDbRequest } from "../../models/interfaces/ulist.interface";
import { GeneralActions } from "../general/general.actions";
import { GeneralService } from "../../services/general.service";
import { LocaleService } from '../../services/locale.service';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * SalesActions class
 * Implements SalesActions functionality
 */
export class SalesActions {

    public GetAccountDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SALES_ACTIONS.GET_ACCOUNT_DETAILS),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._accountService.GetAccountDetailsV2(action.payload)),
            /**
             * Handles map functionality
             */
            map(response => {
                return this.getAccountDetailsForSalesResponse(response);
            })));

    public GetAccountDetailsResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SALES_ACTIONS.GET_ACCOUNT_DETAILS_RESPONSE),
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
                return {
                    type: 'EmptyAction'
                };
            })));

    public CreateAccountDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SALES_ACTIONS.ADD_ACCOUNT_DETAILS),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._accountService.CreateAccountV2(action.payload.accountRequest, action.payload.activeGroupUniqueName)),
            /**
             * Handles map functionality
             */
            map(response => {
                /**
                 * Handles if functionality
                 */
                if (response.request.portalDomain) {
                    this._accountService.createPortalUser(response.request.portalDomain, response.body.uniqueName).pipe(take(1)).subscribe(data => {
                        /**
                         * Handles if functionality
                         */
                        if (data?.status === 'error') {
                            this._toasty.errorToast(data.message, data.code);
                        }
                    });
                }
                return this.addAccountDetailsForSalesResponse(response);
            })));                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           

    public CreateAccountResponseDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SALES_ACTIONS.ADD_ACCOUNT_DETAILS_RESPONSE),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => {
                /**
                 * Handles if functionality
                 */
                if (action.payload?.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                    return {
                        type: 'EmptyAction'
                    };
                } else {
                    this._toasty.successToast(this.localeService.translate("app_messages.account_created"));
                }
                return { type: 'EmptyAction' };
            })));

    public UpdateAccountDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SALES_ACTIONS.UPDATE_ACCOUNT_DETAILS),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => 
                action.payload?.usePatchApi 
                ? this._accountService.UpdateAccountWithoutGroupUniqueName(action.payload.accountRequest, action.payload?.value.accountUniqueName) 
                : this._accountService.UpdateAccountV2(action.payload.accountRequest, action.payload?.value)),
            /**
             * Handles map functionality
             */
            map(response => {
                /**
                 * Handles if functionality
                 */
                if (response && response.body && response.queryString) {
                    const updateIndexDb: IUpdateDbRequest = {
                        newUniqueName: response.body?.uniqueName,
                        oldUniqueName: response.queryString.accountUniqueName,
                        latestName: response.request.name,
                        uniqueName: this._generalServices.companyUniqueName,
                        type: "accounts",
                        isActive: false,
                        name: response.body?.name
                    }
                    this.store.dispatch(this._generalActions.updateIndexDb(updateIndexDb));
                }
                return this.updateAccountDetailsForSalesResponse(response);
            })));

    public UpdateAccountDetailsResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SALES_ACTIONS.UPDATE_ACCOUNT_DETAILS_RESPONSE),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => {
                /**
                 * Handles if functionality
                 */
                if (action.payload?.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                } else {
                    this._toasty.successToast(this.localeService.translate("app_messages.account_updated"));
                }
                return { type: 'EmptyAction' };
            })));

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor(private action$: Actions,
        private _toasty: ToasterService,
        private localeService: LocaleService,
        private store: Store<AppState>,
        private _accountService: AccountService,
        private _generalActions: GeneralActions,
        private _generalServices: GeneralService
    ) {
    }

    /**
     * Resets accountdetailsforsales to default state
     */
    public resetAccountDetailsForSales(): CustomActions {
        return {
            type: SALES_ACTIONS.RESET_ACCOUNT_DETAILS
        };
    }

    /**
     * Retrieves accountdetailsforsales data
     */
    public getAccountDetailsForSales(value: string): CustomActions {
        return {
            type: SALES_ACTIONS.GET_ACCOUNT_DETAILS,
            payload: value
        };
    }

    /**
     * Retrieves accountdetailsforsalesresponse data
     */
    public getAccountDetailsForSalesResponse(value: BaseResponse<AccountResponseV2, string>): CustomActions {
        return {
            type: SALES_ACTIONS.GET_ACCOUNT_DETAILS_RESPONSE,
            payload: value
        };
    }

    /**
     * Handles addAccountDetailsForSales functionality
     */
    public addAccountDetailsForSales(value: AddAccountRequest): CustomActions {
        return {
            type: SALES_ACTIONS.ADD_ACCOUNT_DETAILS,
            payload: value
        };
    }

    /**
     * Handles addAccountDetailsForSalesResponse functionality
     */
    public addAccountDetailsForSalesResponse(value: BaseResponse<AccountResponseV2, AccountRequestV2>): CustomActions {
        return {
            type: SALES_ACTIONS.ADD_ACCOUNT_DETAILS_RESPONSE,
            payload: value
        };
    }

    /**
     * Updates existing accountdetailsforsales
     */
    public updateAccountDetailsForSales(value: UpdateAccountRequest, usePatchApi: boolean = false): CustomActions {
        return {
            type: SALES_ACTIONS.UPDATE_ACCOUNT_DETAILS,
            payload: {...value, usePatchApi},
        };
    }

    /**
     * Updates existing accountdetailsforsalesresponse
     */
    public updateAccountDetailsForSalesResponse(value: BaseResponse<AccountResponseV2, AccountRequestV2>): CustomActions {
        return {
            type: SALES_ACTIONS.UPDATE_ACCOUNT_DETAILS_RESPONSE,
            payload: value
        };
    }

    /**
     * Creates new stockacsuccess
     */
    public createStockAcSuccess(value: any): CustomActions {
        return {
            type: SALES_ACTIONS.STOCK_AC_SUCCESS,
            payload: value
        };
    }
}
