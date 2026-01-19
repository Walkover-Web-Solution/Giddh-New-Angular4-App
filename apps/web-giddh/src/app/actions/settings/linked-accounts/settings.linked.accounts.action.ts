import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ActionResponseValidatorHelper } from '../helpers/action-response-validator.helper';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToasterService } from '../../../services/toaster.service';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { SettingsLinkedAccountsService } from '../../../services/settings.linked.accounts.service';
import { SETTINGS_LINKED_ACCOUNTS_ACTIONS } from './settings.linked.accounts.const';
import { IGetAllEbankAccountResponse } from '../../../models/api-models/SettingsLinkedAccounts';
import { CustomActions } from '../../../store/custom-actions';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * SettingsLinkedAccountsActions class
 * Implements SettingsLinkedAccountsActions functionality
 */
export class SettingsLinkedAccountsActions {

    public GetEbankAccounts$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_LINKED_ACCOUNTS_ACTIONS.GET_ALL_ACCOUNTS),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._settingsLinkedAccountsService.GetYodleeAccounts()),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<any[], string>(res, {
                type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.GET_ALL_ACCOUNTS_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.GET_ALL_ACCOUNTS_RESPONSE,
                payload: res
            }))));

    public RefreshEbankAccounts$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_LINKED_ACCOUNTS_ACTIONS.REFRESH_ALL_ACCOUNTS),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._settingsLinkedAccountsService.RefreshAllEbankAccounts()),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<any[], string>(res, {
                type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.REFRESH_ALL_ACCOUNTS_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.REFRESH_ALL_ACCOUNTS_RESPONSE,
                payload: res
            }))));

    public ReconnectEbankAccount$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_LINKED_ACCOUNTS_ACTIONS.RECONNECT_ACCOUNT),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._settingsLinkedAccountsService.ReconnectAccount(action.payload)),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<any, string>(res, {
                type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.RECONNECT_ACCOUNT_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.RECONNECT_ACCOUNT_RESPONSE,
                payload: res
            }))));

    public DeleteAccount$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_LINKED_ACCOUNTS_ACTIONS.DELETE_BANK_ACCOUNT),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._settingsLinkedAccountsService.DeleteBankAccount(action.payload.loginId, action.payload.deleteWithAccountId)),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<any, string>(res, {
                type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.DELETE_BANK_ACCOUNT_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.DELETE_BANK_ACCOUNT_RESPONSE,
                payload: res
            }))));

    public RefreshAccount$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_LINKED_ACCOUNTS_ACTIONS.REFRESH_BANK_ACCOUNT),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._settingsLinkedAccountsService.RefreshBankAccount(action.payload.ebankItemId, action.payload.requestObj)),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<any, string>(res, {
                type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.REFRESH_BANK_ACCOUNT_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.REFRESH_BANK_ACCOUNT_RESPONSE,
                payload: res
            }))));

    public LinkAccount$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_LINKED_ACCOUNTS_ACTIONS.LINK_BANK_ACCOUNT),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._settingsLinkedAccountsService.LinkBankAccount(action.payload.data, action.payload.loginId)),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<any, string>(res, {
                type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.LINK_BANK_ACCOUNT_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.LINK_BANK_ACCOUNT_RESPONSE,
                payload: res
            }))));

    public UnlinkAccount$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_LINKED_ACCOUNTS_ACTIONS.UNLINK_BANK_ACCOUNT),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._settingsLinkedAccountsService.UnlinkBankAccount(action.payload.loginId, action.payload.accountUniqueName)),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<any, string>(res, {
                type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.UNLINK_BANK_ACCOUNT_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.UNLINK_BANK_ACCOUNT_RESPONSE,
                payload: res
            }))));

    public UpdateDate$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_LINKED_ACCOUNTS_ACTIONS.UPDATE_DATE),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._settingsLinkedAccountsService.UpdateDate(action.payload.date, action.payload.loginId)),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<any, string>(res, {
                type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.UPDATE_DATE_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.UPDATE_DATE_RESPONSE,
                payload: res
            }))));

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor(private action$: Actions,
        private toasty: ToasterService,
        private _settingsLinkedAccountsService: SettingsLinkedAccountsService) {
    }

    /**
     * Handles GetAllAccounts functionality
     */
    public GetAllAccounts() {
        return {
            type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.GET_ALL_ACCOUNTS
        };
    }

    /**
     * Handles GetAllAccountsResponse functionality
     */
    public GetAllAccountsResponse(response: IGetAllEbankAccountResponse[]) {
        return {
            type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.GET_ALL_ACCOUNTS_RESPONSE,
            payload: response
        };
    }

    /**
     * Handles RefreshAllAccounts functionality
     */
    public RefreshAllAccounts() {
        return {
            type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.REFRESH_ALL_ACCOUNTS
        };
    }

    /**
     * Handles RefreshAllAccountsResponse functionality
     */
    public RefreshAllAccountsResponse(response: IGetAllEbankAccountResponse[]) {
        return {
            type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.REFRESH_ALL_ACCOUNTS_RESPONSE,
            payload: response
        };
    }

    /**
     * Handles ReconnectAccount functionality
     */
    public ReconnectAccount(loginId: string) {
        return {
            type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.RECONNECT_ACCOUNT,
            payload: loginId
        };
    }

    /**
     * Handles ReconnectAccountResponse functionality
     */
    public ReconnectAccountResponse(response: any) {
        return {
            type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.RECONNECT_ACCOUNT_RESPONSE,
            payload: response
        };
    }

    /**
     * Handles DeleteBankAccount functionality
     */
    public DeleteBankAccount(loginId: number, deleteWithAccountId) {
        return {
            type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.DELETE_BANK_ACCOUNT,
            payload: { loginId, deleteWithAccountId }
        };
    }

    /**
     * Handles DeleteBankAccountResponse functionality
     */
    public DeleteBankAccountResponse(response: any) {
        return {
            type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.DELETE_BANK_ACCOUNT_RESPONSE,
            payload: response
        };
    }

    /**
     * Handles RefreshBankAccount functionality
     */
    public RefreshBankAccount(ebankItemId: string, requestObj?) {
        return {
            type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.REFRESH_BANK_ACCOUNT,
            payload: { ebankItemId, requestObj }
        };
    }

    /**
     * Handles RefreshBankAccountResponse functionality
     */
    public RefreshBankAccountResponse(response: any) {
        return {
            type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.REFRESH_BANK_ACCOUNT_RESPONSE,
            payload: response
        };
    }

    /**
     * Handles LinkBankAccount functionality
     */
    public LinkBankAccount(data: object, loginId: number) {
        return {
            type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.LINK_BANK_ACCOUNT,
            payload: { loginId, data }
        };
    }

    /**
     * Handles LinkBankAccountResponse functionality
     */
    public LinkBankAccountResponse(response: any) {
        return {
            type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.LINK_BANK_ACCOUNT_RESPONSE,
            payload: response
        };
    }

    /**
     * Handles UnlinkBankAccount functionality
     */
    public UnlinkBankAccount(loginId: number, accountUniqueName: string) {
        return {
            type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.UNLINK_BANK_ACCOUNT,
            payload: { loginId, accountUniqueName }
        };
    }

    /**
     * Handles UnlinkBankAccountResponse functionality
     */
    public UnlinkBankAccountResponse(response: any) {
        return {
            type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.UNLINK_BANK_ACCOUNT_RESPONSE,
            payload: response
        };
    }

    /**
     * Handles UpdateDate functionality
     */
    public UpdateDate(date: string, loginId: number) {
        return {
            type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.UPDATE_DATE,
            payload: { date, loginId }
        };
    }

    /**
     * Handles UpdateDateResponse functionality
     */
    public UpdateDateResponse(response: any) {
        return {
            type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.UPDATE_DATE_RESPONSE,
            payload: response
        };
    }

    public validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: CustomActions, showToast: boolean = false, errorAction: CustomActions = { type: 'EmptyAction' }): CustomActions {
        return ActionResponseValidatorHelper.validateResponse(response, successAction, this.toasty, showToast, errorAction);
    }

}
