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
import {
  AccountDetails,
  BalanceSheetRequest,
  ProfitLossRequest,
  TrialBalanceRequest
} from '../../models/api-models/tb-pl-bs';

@Injectable()
export class TBPlBsActions {

  public static readonly GET_TRIAL_BALANCE_REQUEST = 'GET_TRIAL_BALANCE_REQUEST';
  public static readonly GET_TRIAL_BALANCE_RESPONSE = 'GET_TRIAL_BALANCE_RESPONSE';

  public static readonly GET_PROFIT_LOSS_REQUEST = 'GET_PROFIT_LOSS_REQUEST';
  public static readonly GET_PROFIT_LOSS_RESPONSE = 'GET_PROFIT_LOSS_RESPONSE';

  public static readonly GET_BALANCE_SHEET_REQUEST = 'GET_BALANCE_SHEET_REQUEST';
  public static readonly GET_BALANCE_SHEET_RESPONSE = 'GET_BALANCE_SHEET_RESPONSE';

  public static readonly DOWNLOAD_TRIAL_BALANCE_EXCEL_REQUEST = 'DOWNLOAD_TRIAL_BALANCE_EXCEL_REQUEST';

  public static readonly DOWNLOAD_PROFIT_LOSS_EXCEL_REQUEST = 'DOWNLOAD_PROFIT_LOSS_EXCEL_REQUEST';

  public static readonly DOWNLOAD_BALANCE_SHEET_EXCEL_REQUEST = 'DOWNLOAD_BALANCE_SHEET_EXCEL_REQUEST';

  @Effect() private GetTrialBalance$: Observable<Action> = this.action$
    .ofType(TBPlBsActions.GET_TRIAL_BALANCE_REQUEST)
    .switchMap(action => {
      return this._tlPlService.GetTrailBalance(action.payload)
        .map((r) => this.validateResponse<AccountDetails, TrialBalanceRequest>(r, {
          type: TBPlBsActions.GET_TRIAL_BALANCE_RESPONSE,
          payload: r.body
        }, true, {
          type: TBPlBsActions.GET_TRIAL_BALANCE_RESPONSE,
          payload: null
        }));
    });

  @Effect() private GetProfitLoss$: Observable<Action> = this.action$
    .ofType(TBPlBsActions.GET_PROFIT_LOSS_REQUEST)
    .switchMap(action => {
      return this._tlPlService.GetProfitLoss(action.payload)
        .map((r) => this.validateResponse<AccountDetails, ProfitLossRequest>(r, {
          type: TBPlBsActions.GET_PROFIT_LOSS_RESPONSE,
          payload: r.body
        }, true, {
          type: TBPlBsActions.GET_PROFIT_LOSS_RESPONSE,
          payload: []
        }));
    });

  @Effect() private GetBalanceSheet$: Observable<Action> = this.action$
    .ofType(TBPlBsActions.GET_BALANCE_SHEET_REQUEST)
    .switchMap(action => {
      return this._tlPlService.GetBalanceSheet(action.payload)
        .map((r) => this.validateResponse<AccountDetails, BalanceSheetRequest>(r, {
          type: TBPlBsActions.GET_BALANCE_SHEET_RESPONSE,
          payload: r.body
        }, true, {
          type: TBPlBsActions.GET_BALANCE_SHEET_RESPONSE,
          payload: []
        }));
    });

  @Effect() private DownloadTrailBalanceExcel$: Observable<Action> = this.action$
    .ofType(TBPlBsActions.DOWNLOAD_TRIAL_BALANCE_EXCEL_REQUEST)
    .switchMap(action => {
      return this._tlPlService.DownloadTrialBalanceExcel(action.payload)
        .map((r) => ({ type: '' }))
    });

  @Effect() private DownloadTBalanceSheetExcel$: Observable<Action> = this.action$
    .ofType(TBPlBsActions.DOWNLOAD_BALANCE_SHEET_EXCEL_REQUEST)
    .switchMap(action => {
      return this._tlPlService.DownloadBalanceSheetExcel(action.payload)
        .map((r) => ({ type: '' }))
    });

  @Effect() private DownloadProfitLossExcel$: Observable<Action> = this.action$
    .ofType(TBPlBsActions.DOWNLOAD_PROFIT_LOSS_EXCEL_REQUEST)
    .switchMap(action => {
      return this._tlPlService.DownloadProfitLossExcel(action.payload)
        .map((r) => ({ type: '' }))
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

  public DownloadTrialBalanceExcel(request: TrialBalanceExportExcelRequest): Action {
    return {
      type: TBPlBsActions.DOWNLOAD_TRIAL_BALANCE_EXCEL_REQUEST,
      payload: request
    };
  }

  public DownloadProfitLossExcel(request: ProfitLossRequest): Action {
    return {
      type: TBPlBsActions.DOWNLOAD_PROFIT_LOSS_EXCEL_REQUEST,
      payload: request
    };
  }

  public DownloadBalanceSheetExcel(request: ProfitLossRequest): Action {
    return {
      type: TBPlBsActions.DOWNLOAD_BALANCE_SHEET_EXCEL_REQUEST,
      payload: request
    };
  }

  public GetProfitLoss(request: ProfitLossRequest): Action {
    return {
      type: TBPlBsActions.GET_PROFIT_LOSS_REQUEST,
      payload: request
    };
  }

  public GetBalanceSheet(request: BalanceSheetRequest): Action {
    return {
      type: TBPlBsActions.GET_BALANCE_SHEET_REQUEST,
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
