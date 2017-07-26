import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Action } from '@ngrx/store';
import { HOME } from './home.const';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { ToasterService } from '../../toaster.service';
import { DashboardService } from '../../dashboard.service';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { ClosingBalanceResponse } from '../../../models/api-models/Dashboard';
import { IExpensesChartClosingBalanceResponse } from '../../../models/interfaces/dashboard.interface';

@Injectable()

export class HomeActions {

  @Effect()
  public GetClosingBalanceActiveYear$: Observable<Action> = this.action$
    .ofType(HOME.EXPENSES_CHART.GET_EXPENSES_CHART_DATA_ACTIVE_YEAR)
    .switchMap(action => {
      return Observable.zip(
        this._dashboardService.GetClosingBalance('operatingcost', action.payload.fromDate, action.payload.toDate, action.payload.refresh),
        this._dashboardService.GetClosingBalance('indirectexpenses', action.payload.fromDate, action.payload.toDate, action.payload.refresh)
      );
    }).map((res) => {
      if (res[0].status === 'success' && res[1].status === 'success') {
        let obj: IExpensesChartClosingBalanceResponse = { operatingcostActiveyear: res[0].body[0], indirectexpensesActiveyear: res[1].body[0] };
        return {
          type: HOME.EXPENSES_CHART.GET_EXPENSES_CHART_DATA_ACTIVE_YEAR_RESPONSE,
          payload: obj
        };
      }
      return {
        type: ''
      };
    });

  @Effect()
  public GetClosingBalanceLastYear$: Observable<Action> = this.action$
    .ofType(HOME.EXPENSES_CHART.GET_EXPENSES_CHART_DATA_LAST_YEAR)
    .switchMap(action => {
      return Observable.zip(
        this._dashboardService.GetClosingBalance('operatingcost', action.payload.fromDate, action.payload.toDate, action.payload.refresh),
        this._dashboardService.GetClosingBalance('indirectexpenses', action.payload.fromDate, action.payload.toDate, action.payload.refresh)
      );
    }).map((res) => {
      if (res[0].status === 'success' && res[1].status === 'success') {
        let obj: IExpensesChartClosingBalanceResponse = { operatingcostLastyear: res[0].body[0], indirectexpensesLastyear: res[1].body[0] };
        return {
          type: HOME.EXPENSES_CHART.GET_EXPENSES_CHART_DATA_LAST_YEAR_RESPONSE,
          payload: obj
        };
      }
      return {
        type: ''
      };
    });

  constructor(private action$: Actions, private _toasty: ToasterService, private _dashboardService: DashboardService) {
    //
  }

  public getExpensesChartDataOfActiveYear(fromDate: string = '', toDate: string = '', refresh: boolean = false): Action {
    return {
      type: HOME.EXPENSES_CHART.GET_EXPENSES_CHART_DATA_ACTIVE_YEAR,
      payload: {fromDate, toDate, refresh}
    };
  }

  public getExpensesChartDataOfLastYear(fromDate: string = '', toDate: string = '', refresh: boolean = false): Action {
    return {
      type: HOME.EXPENSES_CHART.GET_EXPENSES_CHART_DATA_LAST_YEAR,
      payload: {fromDate, toDate, refresh}
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
