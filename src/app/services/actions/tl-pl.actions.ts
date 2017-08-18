import { FlattenGroupsAccountsResponse } from '../../models/api-models/Group';
/**
 * Created by ad on 04-07-2017.
 */
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../toaster.service';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { TlPlService } from '../tl-pl.service';
import { ProfitLossRequest, TrialBalanceRequest } from '../../models/api-models/tb-pl-bs';

@Injectable()
export class TBPlBsActions {
  public static readonly GET_TRIAL_BALANCE_REQUEST = 'GET_TRIAL_BALANCE_REQUEST';
  public static readonly GET_TRIAL_BALANCE_RESPONSE = 'GET_TRIAL_BALANCE_RESPONSE';
  public static readonly GET_PROFIT_LOSS_REQUEST = 'GET_PROFIT_LOSS_REQUEST';
  public static readonly GET_PROFIT_LOSS_RESPONSE = 'GET_PROFIT_LOSS_RESPONSE';

  public static readonly SET_DATE = 'SET_DATE';
  @Effect() private GetTrialBalance$: Observable<Action> = this.action$
    .ofType(TBPlBsActions.GET_TRIAL_BALANCE_REQUEST)
    .switchMap(action => {
      return this._tlPlService.GetTrailBalance(action.payload)
        .map((r) => this.validateResponse<FlattenGroupsAccountsResponse, string>(r, {
          type: TBPlBsActions.GET_TRIAL_BALANCE_RESPONSE,
          payload: r.body
        }, true, {
          type: TBPlBsActions.GET_TRIAL_BALANCE_RESPONSE,
          payload: []
        }));
    });

  @Effect() private GetProfitLoss$: Observable<Action> = this.action$
    .ofType(TBPlBsActions.GET_PROFIT_LOSS_REQUEST)
    .switchMap(action => {
      return this._tlPlService.GetProfitLoss(action.payload)
        .map((r) => this.validateResponse<FlattenGroupsAccountsResponse, string>(r, {
          type: TBPlBsActions.GET_PROFIT_LOSS_RESPONSE,
          payload: r.body
        }, true, {
          type: TBPlBsActions.GET_PROFIT_LOSS_RESPONSE,
          payload: []
        }));
    });

  constructor(private action$: Actions,
              private _toasty: ToasterService,
              private _tlPlService: TlPlService) {
  }

  public GetTrialBalance(request: TrialBalanceRequest): Action {
    return {
      type: TBPlBsActions.GET_TRIAL_BALANCE_REQUEST,
      payload: request
    };
  }

  public GetProfitLoss(request: ProfitLossRequest): Action {
    return {
      type: TBPlBsActions.GET_PROFIT_LOSS_REQUEST,
      payload: request
    };
  }

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
