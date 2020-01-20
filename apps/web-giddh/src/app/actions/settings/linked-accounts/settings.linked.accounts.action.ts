import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../../../services/toaster.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { Router } from '@angular/router';
import { SettingsLinkedAccountsService } from '../../../services/settings.linked.accounts.service';
import { SETTINGS_LINKED_ACCOUNTS_ACTIONS } from './settings.linked.accounts.const';
import { IGetAllEbankAccountResponse } from '../../../models/api-models/SettingsLinkedAccounts';
import { CustomActions } from '../../../store/customActions';

@Injectable()
export class SettingsLinkedAccountsActions {

    @Effect()
    public GetEbankAccounts$: Observable<Action> = this.action$
        .ofType(SETTINGS_LINKED_ACCOUNTS_ACTIONS.GET_ALL_ACCOUNTS).pipe(
            switchMap((action: CustomActions) => this._settingsLinkedAccountsService.GetYodleeAccounts()),
            map(res => this.validateResponse<any[], string>(res, {
                type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.GET_ALL_ACCOUNTS_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.GET_ALL_ACCOUNTS_RESPONSE,
                payload: res
            })));

    @Effect()
    public RefreshEbankAccounts$: Observable<Action> = this.action$
        .ofType(SETTINGS_LINKED_ACCOUNTS_ACTIONS.REFRESH_ALL_ACCOUNTS).pipe(
            switchMap((action: CustomActions) => this._settingsLinkedAccountsService.RefreshAllEbankAccounts()),
            map(res => this.validateResponse<any[], string>(res, {
                type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.REFRESH_ALL_ACCOUNTS_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.REFRESH_ALL_ACCOUNTS_RESPONSE,
                payload: res
            })));

    @Effect()
    public ReconnectEbankAccount$: Observable<Action> = this.action$
        .ofType(SETTINGS_LINKED_ACCOUNTS_ACTIONS.RECONNECT_ACCOUNT).pipe(
            switchMap((action: CustomActions) => this._settingsLinkedAccountsService.ReconnectAccount(action.payload)),
            map(res => this.validateResponse<any, string>(res, {
                type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.RECONNECT_ACCOUNT_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.RECONNECT_ACCOUNT_RESPONSE,
                payload: res
            })));

    @Effect()
    public DeleteAccount$: Observable<Action> = this.action$
        .ofType(SETTINGS_LINKED_ACCOUNTS_ACTIONS.DELETE_BANK_ACCOUNT).pipe(
            switchMap((action: CustomActions) => this._settingsLinkedAccountsService.DeleteBankAccount(action.payload.loginId, action.payload.deleteWithAccountId)),
            map(res => this.validateResponse<any, string>(res, {
                type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.DELETE_BANK_ACCOUNT_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.DELETE_BANK_ACCOUNT_RESPONSE,
                payload: res
            })));

    @Effect()
    public RefreshAccount$: Observable<Action> = this.action$
        .ofType(SETTINGS_LINKED_ACCOUNTS_ACTIONS.REFRESH_BANK_ACCOUNT).pipe(
            switchMap((action: CustomActions) => this._settingsLinkedAccountsService.RefreshBankAccount(action.payload.ebankItemId, action.payload.requestObj)),
            map(res => this.validateResponse<any, string>(res, {
                type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.REFRESH_BANK_ACCOUNT_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.REFRESH_BANK_ACCOUNT_RESPONSE,
                payload: res
            })));

    @Effect()
    public LinkAccount$: Observable<Action> = this.action$
        .ofType(SETTINGS_LINKED_ACCOUNTS_ACTIONS.LINK_BANK_ACCOUNT).pipe(
            switchMap((action: CustomActions) => this._settingsLinkedAccountsService.LinkBankAccount(action.payload.data, action.payload.loginId)),
            map(res => this.validateResponse<any, string>(res, {
                type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.LINK_BANK_ACCOUNT_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.LINK_BANK_ACCOUNT_RESPONSE,
                payload: res
            })));

    @Effect()
    public UnlinkAccount$: Observable<Action> = this.action$
        .ofType(SETTINGS_LINKED_ACCOUNTS_ACTIONS.UNLINK_BANK_ACCOUNT).pipe(
            switchMap((action: CustomActions) => this._settingsLinkedAccountsService.UnlinkBankAccount(action.payload.loginId, action.payload.accountUniqueName)),
            map(res => this.validateResponse<any, string>(res, {
                type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.UNLINK_BANK_ACCOUNT_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.UNLINK_BANK_ACCOUNT_RESPONSE,
                payload: res
            })));

    @Effect()
    public UpdateDate$: Observable<Action> = this.action$
        .ofType(SETTINGS_LINKED_ACCOUNTS_ACTIONS.UPDATE_DATE).pipe(
            switchMap((action: CustomActions) => this._settingsLinkedAccountsService.UpdateDate(action.payload.date, action.payload.loginId)),
            map(res => this.validateResponse<any, string>(res, {
                type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.UPDATE_DATE_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.UPDATE_DATE_RESPONSE,
                payload: res
            })));

    constructor(private action$: Actions,
        private toasty: ToasterService,
        private router: Router,
        private store: Store<AppState>,
        private _settingsLinkedAccountsService: SettingsLinkedAccountsService) {
    }

    public GetAllAccounts() {
        return {
            type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.GET_ALL_ACCOUNTS
        };
    }

    public GetAllAccountsResponse(response: IGetAllEbankAccountResponse[]) {
        return {
            type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.GET_ALL_ACCOUNTS_RESPONSE,
            payload: response
        };
    }

    public RefreshAllAccounts() {
        return {
            type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.REFRESH_ALL_ACCOUNTS
        };
    }

    public RefreshAllAccountsResponse(response: IGetAllEbankAccountResponse[]) {
        return {
            type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.REFRESH_ALL_ACCOUNTS_RESPONSE,
            payload: response
        };
    }

    public ReconnectAccount(loginId: string) {
        return {
            type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.RECONNECT_ACCOUNT,
            payload: loginId
        };
    }

    public ReconnectAccountResponse(response: any) {
        return {
            type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.RECONNECT_ACCOUNT_RESPONSE,
            payload: response
        };
    }

    public DeleteBankAccount(loginId: number, deleteWithAccountId) {
        return {
            type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.DELETE_BANK_ACCOUNT,
            payload: { loginId, deleteWithAccountId }
        };
    }

    public DeleteBankAccountResponse(response: any) {
        return {
            type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.DELETE_BANK_ACCOUNT_RESPONSE,
            payload: response
        };
    }

    public RefreshBankAccount(ebankItemId: string, requestObj?) {
        return {
            type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.REFRESH_BANK_ACCOUNT,
            payload: { ebankItemId, requestObj }
        };
    }

    public RefreshBankAccountResponse(response: any) {
        return {
            type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.REFRESH_BANK_ACCOUNT_RESPONSE,
            payload: response
        };
    }

    public LinkBankAccount(data: object, loginId: number) {
        return {
            type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.LINK_BANK_ACCOUNT,
            payload: { loginId, data }
        };
    }

    public LinkBankAccountResponse(response: any) {
        return {
            type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.LINK_BANK_ACCOUNT_RESPONSE,
            payload: response
        };
    }

    public UnlinkBankAccount(loginId: number, accountUniqueName: string) {
        return {
            type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.UNLINK_BANK_ACCOUNT,
            payload: { loginId, accountUniqueName }
        };
    }

    public UnlinkBankAccountResponse(response: any) {
        return {
            type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.UNLINK_BANK_ACCOUNT_RESPONSE,
            payload: response
        };
    }

    public UpdateDate(date: string, loginId: number) {
        return {
            type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.UPDATE_DATE,
            payload: { date, loginId }
        };
    }

    public UpdateDateResponse(response: any) {
        return {
            type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.UPDATE_DATE_RESPONSE,
            payload: response
        };
    }

    public validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: CustomActions, showToast: boolean = false, errorAction: CustomActions = { type: 'EmptyAction' }): CustomActions {
        if (response.status === 'error') {
            if (showToast) {
                this.toasty.errorToast(response.message);
            }
            return errorAction;
        } else {
            if (showToast && typeof response.body === 'string') {
                this.toasty.successToast(response.body);
            }
        }
        return successAction;
    }

}
