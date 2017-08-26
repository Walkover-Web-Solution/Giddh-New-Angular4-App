/**
 * Created by ad on 04-07-2017.
 */

import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../../toaster.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { Observable } from 'rxjs/Rx';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { SalesService } from '../../sales.service';
import { SALES_ACTIONS } from './sales.const';
import { Router } from '@angular/router';
import { AccountResponse } from '../../../models/api-models/Account';
import { AccountService } from '../../account.service';
import { GroupsWithAccountsResponse } from '../../../models/api-models/GroupsWithAccounts';
import { GroupService } from '../../group.service';

@Injectable()
export class SalesActions {

  @Effect()
  public GetAccountDetails$: Observable<Action> = this.action$
    .ofType(SALES_ACTIONS.GET_ACCOUNT_DETAILS)
    .switchMap(action => this._accountService.GetAccountDetails(action.payload))
    .map(response => {
      return this.getAccountDetailsForSalesResponse(response);
    });

  @Effect()
  public GetAccountDetailsResponse$: Observable<Action> = this.action$
    .ofType(SALES_ACTIONS.GET_ACCOUNT_DETAILS_RESPONSE)
    .map(action => {
      let data: BaseResponse<AccountResponse, string> = action.payload;
      if (action.payload.status === 'error') {
        this._toasty.errorToast(action.payload.message, action.payload.code);
      }
      return {
        type: ''
      };
    });

  // @Effect()
  // public GetGroupsListForSales$: Observable<Action> = this.action$
  //   .ofType(SALES_ACTIONS.GET_GROUPS_FOR_SALES)
  //   .switchMap(action => this._groupService.GetGroupsWithAccounts(action.payload))
  //   .map(response => this.getGroupsListForSalesResponse(response));

  // @Effect()
  // public GetGroupsListForSalesResponse$: Observable<Action> = this.action$
  //   .ofType(SALES_ACTIONS.GET_GROUPS_FOR_SALES_RESPONSE)
  //   .map(action => {
  //     if (action.payload.status === 'error') {
  //       this._toasty.errorToast(action.payload.message, action.payload.code);
  //     }
  //     return {
  //       type: ''
  //     };
  //   });

  constructor(private action$: Actions,
    private _toasty: ToasterService,
    private _router: Router,
    private store: Store<AppState>,
    private _salesService: SalesService,
    private _accountService: AccountService,
    private _groupService: GroupService
  ) {
  }

  public getAccountDetailsForSales(value: string): Action {
    return {
      type: SALES_ACTIONS.GET_ACCOUNT_DETAILS,
      payload: value
    };
  }

  public getAccountDetailsForSalesResponse(value: BaseResponse<AccountResponse, string>): Action {
    return {
      type: SALES_ACTIONS.GET_ACCOUNT_DETAILS_RESPONSE,
      payload: value
    };
  }

  // public getGroupsListForSales(value?: string): Action {
  //   return {
  //     type: SALES_ACTIONS.GET_GROUPS_FOR_SALES,
  //     payload: value
  //   };
  // }

  // public getGroupsListForSalesResponse(value: BaseResponse<GroupsWithAccountsResponse[], string>): Action {
  //   return {
  //     type: SALES_ACTIONS.GET_GROUPS_FOR_SALES_RESPONSE,
  //     payload: value
  //   };
  // }

  private validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: Action, showToast: boolean = false, errorAction: Action = { type: '' }): Action {
    if (response.status === 'error') {
      if (showToast) {
        this._toasty.errorToast(response.message);
      }
      return errorAction;
    }
    return successAction;
  }
}
