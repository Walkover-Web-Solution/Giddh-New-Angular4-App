import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { HOME } from './home.const';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { ToasterService } from '../../toaster.service';
import { DashboardService } from '../../dashboard.service';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import {
  IComparisionChartResponse,
  IExpensesChartClosingBalanceResponse,
  IRevenueChartClosingBalanceResponse
} from '../../../models/interfaces/dashboard.interface';
import { RefreshBankAccountResponse, GroupHistoryRequest, BankAccountsResponse } from '../../../models/api-models/Dashboard';

@Injectable()

export class HomeActions {

  @Effect()
  public GetExpensesChartActiveYear$: Observable<Action> = this.action$
    .ofType(HOME.EXPENSES_CHART.GET_EXPENSES_CHART_DATA_ACTIVE_YEAR)
    .switchMap(action => {
      return Observable.zip(
        this._dashboardService.GetClosingBalance('operatingcost', action.payload.fromDate, action.payload.toDate, action.payload.refresh),
        this._dashboardService.GetClosingBalance('indirectexpenses', action.payload.fromDate, action.payload.toDate, action.payload.refresh)
      );
    }).map((res) => {
      if (res[0].status === 'success' && res[1].status === 'success') {
        let obj: IExpensesChartClosingBalanceResponse = {
          operatingcostActiveyear: res[0].body[0],
          indirectexpensesActiveyear: res[1].body[0]
        };
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
  public GetExpensesChartLastYear$: Observable<Action> = this.action$
    .ofType(HOME.EXPENSES_CHART.GET_EXPENSES_CHART_DATA_LAST_YEAR)
    .switchMap(action => {
      return Observable.zip(
        this._dashboardService.GetClosingBalance('operatingcost', action.payload.fromDate, action.payload.toDate, action.payload.refresh),
        this._dashboardService.GetClosingBalance('indirectexpenses', action.payload.fromDate, action.payload.toDate, action.payload.refresh)
      );
    }).map((res) => {
      if (res[0].status === 'success' && res[1].status === 'success') {
        let obj: IExpensesChartClosingBalanceResponse = {
          operatingcostLastyear: res[0].body[0],
          indirectexpensesLastyear: res[1].body[0]
        };
        return {
          type: HOME.EXPENSES_CHART.GET_EXPENSES_CHART_DATA_LAST_YEAR_RESPONSE,
          payload: obj
        };
      }
      return {
        type: ''
      };
    });

  @Effect()
  public GetRevenueChartActiveYear$: Observable<Action> = this.action$
    .ofType(HOME.REVENUE_CHART.GET_REVENUE_CHART_DATA_ACTIVE_YEAR)
    .switchMap(action => {
      return Observable.zip(
        this._dashboardService.GetClosingBalance('revenuefromoperations', action.payload.fromDate, action.payload.toDate, action.payload.refresh),
        this._dashboardService.GetClosingBalance('otherincome', action.payload.fromDate, action.payload.toDate, action.payload.refresh)
      );
    }).map((res) => {
      if (res[0].status === 'success' && res[1].status === 'success') {
        let obj: IRevenueChartClosingBalanceResponse = {
          revenuefromoperationsActiveyear: res[0].body[0],
          otherincomeActiveyear: res[1].body[0]
        };
        return {
          type: HOME.REVENUE_CHART.GET_REVENUE_CHART_DATA_ACTIVE_YEAR_RESPONSE,
          payload: obj
        };
      }
      return {
        type: ''
      };
    });

  @Effect()
  public GetRevenueChartLastYear$: Observable<Action> = this.action$
    .ofType(HOME.REVENUE_CHART.GET_REVENUE_CHART_DATA_LAST_YEAR)
    .switchMap(action => {
      return Observable.zip(
        this._dashboardService.GetClosingBalance('revenuefromoperations', action.payload.fromDate, action.payload.toDate, action.payload.refresh),
        this._dashboardService.GetClosingBalance('otherincome', action.payload.fromDate, action.payload.toDate, action.payload.refresh)
      );
    }).map((res) => {
      if (res[0].status === 'success' && res[1].status === 'success') {
        let obj: IRevenueChartClosingBalanceResponse = {
          revenuefromoperationsLastyear: res[0].body[0],
          otherincomeLastyear: res[1].body[0]
        };
        return {
          type: HOME.REVENUE_CHART.GET_REVENUE_CHART_DATA_LAST_YEAR_RESPONSE,
          payload: obj
        };
      }
      return {
        type: ''
      };
    });

  @Effect()
  public GetComparisionChartActiveYear$: Observable<Action> = this.action$
    .ofType(HOME.COMPARISION_CHART.GET_COMPARISION_CHART_DATA_ACTIVE_YEAR)
    .switchMap(action => {
      let revenueModel: GroupHistoryRequest = {
        groups: ['revenuefromoperations']
      };
      let expenseModel: GroupHistoryRequest = {
        groups: ['indirectexpenses', 'operatingcost']
      };

      return Observable.zip(
        this._dashboardService.GetGroupHistory(revenueModel, action.payload.fromDate, action.payload.toDate, 'monthly', action.payload.refresh),
        this._dashboardService.GetGroupHistory(expenseModel, action.payload.fromDate, action.payload.toDate, 'monthly', action.payload.refresh),
        this._dashboardService.Dashboard(action.payload.fromDate, action.payload.toDate, 'monthly', action.payload.refresh),
      );
    }).map((res) => {
      if (res[0].status === 'success' && res[1].status === 'success' && res[2].status === 'success') {
        let obj: IComparisionChartResponse = {
          revenueActiveYear: res[0].body.groups,
          ExpensesActiveYear: res[1].body.groups,
          ProfitLossActiveYear: res[2].body,
          NetworthActiveYear: res[2].body
        };
        return {
          type: HOME.COMPARISION_CHART.GET_COMPARISION_CHART_DATA_ACTIVE_YEAR_RESPONSE,
          payload: obj
        };
      }
      return {
        type: ''
      };
    });

  @Effect()
  public GetComparisionChartLastYear$: Observable<Action> = this.action$

    .ofType(HOME.COMPARISION_CHART.GET_COMPARISION_CHART_DATA_LAST_YEAR)
    .switchMap(action => {
      let revenueModel: GroupHistoryRequest = {
        groups: ['revenuefromoperations']
      };
      let expenseModel: GroupHistoryRequest = {
        groups: ['indirectexpenses', 'operatingcost']
      };

      return Observable.zip(
        this._dashboardService.GetGroupHistory(revenueModel, action.payload.fromDate, action.payload.toDate, 'monthly', action.payload.refresh),
        this._dashboardService.GetGroupHistory(expenseModel, action.payload.fromDate, action.payload.toDate, 'monthly', action.payload.refresh),
        this._dashboardService.Dashboard(action.payload.fromDate, action.payload.toDate, 'monthly', action.payload.refresh),
      );
    }).map((res) => {
      if (res[0].status === 'success' && res[1].status === 'success') {
        let obj: IComparisionChartResponse = {
          revenueLastYear: res[0].body.groups,
          ExpensesLastYear: res[1].body.groups,
          ProfitLossLastYear: res[2].body,
        };
        return {
          type: HOME.COMPARISION_CHART.GET_COMPARISION_CHART_DATA_LAST_YEAR_RESPONSE,
          payload: obj
        };
      }
      return {
        type: ''
      };
    });

  @Effect()
  public GetBankAccounts$: Observable<Action> = this.action$

    .ofType(HOME.BANK_ACCOUNTS.GET_BANK_ACCOUNTS)
    .switchMap(action => {
      return this._dashboardService.GetBankAccounts();
    }).map((res) => this.validateResponse<BankAccountsResponse[], string>(res, {
      type: HOME.BANK_ACCOUNTS.GET_BANK_ACCOUNTS_RESPONSE,
      payload: res
    }, true, {
        type: HOME.BANK_ACCOUNTS.GET_BANK_ACCOUNTS_RESPONSE,
        payload: res
      }));
  @Effect()
  public RefereshBankAccounts$: Observable<Action> = this.action$
    .ofType(HOME.BANK_ACCOUNTS.REFRESH_BANK_ACCOUNT)
    .switchMap(action => {
      return this._dashboardService.RefreshBankAccount(action.payload);
    }).map((res) => this.validateResponse<RefreshBankAccountResponse, string>(res, {
      type: HOME.BANK_ACCOUNTS.REFRESH_BANK_ACCOUNT_RESPONSE,
      payload: res
    }, true, {
        type: HOME.BANK_ACCOUNTS.REFRESH_BANK_ACCOUNT_RESPONSE,
        payload: res
      }));

  @Effect()
  public ReConnectBankAccounts$: Observable<Action> = this.action$
    .ofType(HOME.BANK_ACCOUNTS.RECONNECT_BANK_ACCOUNT)
    .switchMap(action => {
      return this._dashboardService.ReconnectBankAccount(action.payload);
    }).map((res) => this.validateResponse<RefreshBankAccountResponse, string>(res, {
      type: HOME.BANK_ACCOUNTS.RECONNECT_BANK_ACCOUNT_RESPONSE,
      payload: res
    }, true, {
        type: HOME.BANK_ACCOUNTS.RECONNECT_BANK_ACCOUNT_RESPONSE,
        payload: res
      }));

  constructor(private action$: Actions, private _toasty: ToasterService, private _dashboardService: DashboardService) {
    //
  }

  public getExpensesChartDataOfActiveYear(fromDate: string = '', toDate: string = '', refresh: boolean = false): Action {
    return {
      type: HOME.EXPENSES_CHART.GET_EXPENSES_CHART_DATA_ACTIVE_YEAR,
      payload: { fromDate, toDate, refresh }
    };
  }

  public getExpensesChartDataOfLastYear(fromDate: string = '', toDate: string = '', refresh: boolean = false): Action {
    return {
      type: HOME.EXPENSES_CHART.GET_EXPENSES_CHART_DATA_LAST_YEAR,
      payload: { fromDate, toDate, refresh }
    };
  }

  public getRevenueChartDataOfActiveYear(fromDate: string = '', toDate: string = '', refresh: boolean = false): Action {
    return {
      type: HOME.REVENUE_CHART.GET_REVENUE_CHART_DATA_ACTIVE_YEAR,
      payload: { fromDate, toDate, refresh }
    };
  }

  public getRevenueChartDataOfLastYear(fromDate: string = '', toDate: string = '', refresh: boolean = false): Action {
    return {
      type: HOME.REVENUE_CHART.GET_REVENUE_CHART_DATA_LAST_YEAR,
      payload: { fromDate, toDate, refresh }
    };
  }

  public getComparisionChartDataOfLastYear(fromDate: string = '', toDate: string = '', refresh: boolean = false): Action {
    return {
      type: HOME.COMPARISION_CHART.GET_COMPARISION_CHART_DATA_LAST_YEAR,
      payload: { fromDate, toDate, refresh }
    };
  }

  public getComparisionChartDataOfActiveYear(fromDate: string = '', toDate: string = '', refresh: boolean = false): Action {
    return {
      type: HOME.COMPARISION_CHART.GET_COMPARISION_CHART_DATA_ACTIVE_YEAR,
      payload: { fromDate, toDate, refresh }
    };
  }
  public GetBankAccount() {
    return {
      type: HOME.BANK_ACCOUNTS.GET_BANK_ACCOUNTS
    };
  }

  public RefereshBankAccount(loginid: string) {
    return {
      type: HOME.BANK_ACCOUNTS.REFRESH_BANK_ACCOUNT,
      payload: loginid
    };
  }
  public ReConnectBankAccount(loginid: string) {
    return {
      type: HOME.BANK_ACCOUNTS.RECONNECT_BANK_ACCOUNT,
      payload: loginid
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
