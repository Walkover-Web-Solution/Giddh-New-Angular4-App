import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../../../toaster.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../../../store/roots';
import { Observable } from 'rxjs/Rx';
import { BaseResponse } from '../../../../models/api-models/BaseResponse';
import { Router } from '@angular/router';
import { SettingsLinkedAccountsService } from '../../../settings.linked.accounts.service';
import { SETTINGS_LINKED_ACCOUNTS_ACTIONS } from './settings.linked.accounts.const';
import { IGetAllEbankAccountResponse } from '../../../../models/api-models/SettingsLinkedAccounts';

@Injectable()
export class SettingsLinkedAccountsActions {

  @Effect()
  public GetEbankAccounts$: Observable<Action> = this.action$
    .ofType(SETTINGS_LINKED_ACCOUNTS_ACTIONS.GET_ALL_ACCOUNTS)
    .switchMap(action => this._settingsLinkedAccountsService.GetAllEbankAccounts())
    .map(res => this.validateResponse<IGetAllEbankAccountResponse[], string>(res, {
      type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.GET_ALL_ACCOUNTS_RESPONSE,
      payload: res
    }, true, {
      type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.GET_ALL_ACCOUNTS_RESPONSE,
      payload: res
    }));

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
      type: SETTINGS_LINKED_ACCOUNTS_ACTIONS.GET_ALL_ACCOUNTS,
      payload: response
    };
  }

  public validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: Action, showToast: boolean = false, errorAction: Action = {type: ''}): Action {
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
