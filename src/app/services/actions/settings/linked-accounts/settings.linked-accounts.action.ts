import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../../../toaster.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../../../store/roots';
import { Observable } from 'rxjs/Rx';
import { BaseResponse } from '../../../../models/api-models/BaseResponse';
import { SETTINGS_LINKED_ACCOUNTS_ACTIONS } from './settings.linked-accounts.const';
import { SettingsLinkedAccountsService } from '../../../settings.linked-accounts.service';
import { BankAccountsResponse } from '../../../../models/api-models/Dashboard';

@Injectable()
export class SettingsLinkedAccountsActions {

  @Effect()
  public GetBankAccounts$: Observable<Action> = this.action$
    .ofType(SETTINGS_LINKED_ACCOUNTS_ACTIONS.GET_BANKS_ACCOUNTS)
    .switchMap(action => this.settingsLinkedAccountsService.GetBankAccounts())
    .map(res => {
      return this.validateResponse<BankAccountsResponse[], string>(res, {
        type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.GET_BANKS_ACCOUNTS_RESPONSE,
        payload: res
      }, true, {
          type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.GET_BANKS_ACCOUNTS_RESPONSE,
          payload: res
        });
    });

  @Effect()
  public DeleteBankAccounts$: Observable<Action> = this.action$
    .ofType(SETTINGS_LINKED_ACCOUNTS_ACTIONS.DELETE_BANKS_ACCOUNTS)
    .switchMap(action => this.settingsLinkedAccountsService.DeleteBankAccounts(action.payload))
    .map(res => {
      return this.validateResponse<string, string>(res, {
        type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.DELETE_BANKS_ACCOUNTS_RESPONSE,
        payload: res
      }, true, {
          type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.DELETE_BANKS_ACCOUNTS_RESPONSE,
          payload: res
        });
    });
  constructor(private action$: Actions,
    private toasty: ToasterService,
    private store: Store<AppState>,
    private settingsLinkedAccountsService: SettingsLinkedAccountsService) {
  }

  public GetBankAccounts(): Action {
    return {
      type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.GET_BANKS_ACCOUNTS
    };
  }

  public DeleteBankAccounts(value: string): Action {
    return {
      type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.DELETE_BANKS_ACCOUNTS,
      payload: value
    };
  }

  public validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: Action, showToast: boolean = false, errorAction: Action = { type: '' }): Action {
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
