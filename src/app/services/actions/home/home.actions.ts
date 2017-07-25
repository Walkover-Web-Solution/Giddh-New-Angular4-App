import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Action } from '@ngrx/store';
import { HOME } from 'home.const';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { ToasterService } from '../../toaster.service';
import { DashboardService } from '../../dashboard.service';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { ClosingBalanceResponse } from '../../../models/api-models/Dashboard';

@Injectable()

export class HomeActions {

  @Effect()
  public GetTransactions$: Observable<Action> = this.action$
    .ofType(HOME.GET_EXPENSES_CHART_DATA)
    .switchMap(action => {
      return this._dashboardService.GetClosingBalance(action.payload.groupUniqueName, action.payload.fromDate, action.payload.toDate, action.payload.refresh);
    }).map(res => this.validateResponse<ClosingBalanceResponse, string>(res, {
      type: HOME.GET_EXPENSES_CHART_DATA_RESPONSE,
      payload: res
    }, true, {
      type: HOME.GET_EXPENSES_CHART_DATA_RESPONSE,
      payload: res
    }));

  constructor(private action$: Actions, private _toasty: ToasterService, private _dashboardService: DashboardService) {
    //
  }

  public getExpensesChartData(groupUniqueName: string, fromDate: string = '', toDate: string = '', refresh: boolean = false): Action {
    return {
      type: HOME.GET_EXPENSES_CHART_DATA,
      payload: {groupUniqueName, fromDate, toDate, refresh}
    };
  }

  private validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: Action, showToast: boolean = false, errorAction: Action = {type: ''}): Action {
    if (response.status === 'error') {
      if (showToast) {
        this._toasty.errorToast(response.message);
      }
      return errorAction;
    } else {
      if (showToast && typeof response.body === 'string') {
        this._toasty.successToast(response.body);
      }
    }
    return successAction;
  }
}
