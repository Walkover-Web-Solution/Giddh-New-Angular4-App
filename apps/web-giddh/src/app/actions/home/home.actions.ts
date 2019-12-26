import { Observable, zip as observableZip } from 'rxjs';

import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { API_TO_CALL, CHART_CALLED_FROM, HOME } from './home.const';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { ToasterService } from '../../services/toaster.service';
import { DashboardService } from '../../services/dashboard.service';
import { Actions, Effect } from '@ngrx/effects';
import { IComparisionChartResponse, IExpensesChartClosingBalanceResponse, IRevenueChartClosingBalanceResponse, ITotalOverDuesResponse } from '../../models/interfaces/dashboard.interface';
import { BankAccountsResponse, DashboardResponse, GroupHistoryRequest, GroupHistoryResponse, RefreshBankAccountResponse, GraphTypesResponse, RevenueGraphDataRequest, RevenueGraphDataResponse } from '../../models/api-models/Dashboard';
import * as _ from '../../lodash-optimized';
import { CustomActions } from '../../store/customActions';

@Injectable()

export class HomeActions {

    @Effect()
    public GetExpensesChartActiveYear$: Observable<Action> = this.action$
        .ofType(HOME.EXPENSES_CHART.GET_EXPENSES_CHART_DATA_ACTIVE_YEAR).pipe(
            switchMap((action: CustomActions) => {
                return observableZip(
                    this._dashboardService.GetClosingBalance('operatingcost', action.payload.fromDate, action.payload.toDate, action.payload.refresh),
                    this._dashboardService.GetClosingBalance('indirectexpenses', action.payload.fromDate, action.payload.toDate, action.payload.refresh)
                );
            }), map((res) => {
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
                    type: HOME.EXPENSES_CHART.GET_EXPENSES_CHART_DATA_ACTIVE_YEAR_ERROR_RESPONSE,
                    payload: { operatingcostActiveyear: res[0], indirectexpensesActiveyear: res[1] }
                };
            }));

    @Effect()
    public GetExpensesChartLastYear$: Observable<Action> = this.action$
        .ofType(HOME.EXPENSES_CHART.GET_EXPENSES_CHART_DATA_LAST_YEAR).pipe(
            switchMap((action: CustomActions) => {
                return observableZip(
                    this._dashboardService.GetClosingBalance('operatingcost', action.payload.fromDate, action.payload.toDate, action.payload.refresh),
                    this._dashboardService.GetClosingBalance('indirectexpenses', action.payload.fromDate, action.payload.toDate, action.payload.refresh)
                );
            }), map((res) => {
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
                    type: 'EmptyAction'
                };
            }));

    @Effect()
    public GetRevenueChartActiveYear$: Observable<Action> = this.action$
        .ofType(HOME.REVENUE_CHART.GET_REVENUE_CHART_DATA_ACTIVE_YEAR).pipe(
            switchMap((action: CustomActions) => {
                return observableZip(
                    this._dashboardService.GetClosingBalance('revenuefromoperations', action.payload.fromDate, action.payload.toDate, action.payload.refresh),
                    this._dashboardService.GetClosingBalance('otherincome', action.payload.fromDate, action.payload.toDate, action.payload.refresh)
                );
            }), map((res) => {
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
                    type: HOME.REVENUE_CHART.GET_REVENUE_CHART_DATA_ACTIVE_YEAR_ERROR_RESPONSE,
                    payload: { revenuefromoperationsActiveyear: res[0], otherincomeActiveyear: res[1] }
                };
            }));

    @Effect()
    public GetRevenueChartLastYear$: Observable<Action> = this.action$
        .ofType(HOME.REVENUE_CHART.GET_REVENUE_CHART_DATA_LAST_YEAR).pipe(
            switchMap((action: CustomActions) => {
                return observableZip(
                    this._dashboardService.GetClosingBalance('revenuefromoperations', action.payload.fromDate, action.payload.toDate, action.payload.refresh),
                    this._dashboardService.GetClosingBalance('otherincome', action.payload.fromDate, action.payload.toDate, action.payload.refresh)
                );
            }), map((res) => {
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
                    type: 'EmptyAction'
                };
            }));

    @Effect()
    public GetComparisionChartActiveYear$: Observable<Action> = this.action$
        .ofType(HOME.COMPARISION_CHART.GET_COMPARISION_CHART_DATA_ACTIVE_YEAR).pipe(
            switchMap((action: CustomActions) => {
                let revenueModel: GroupHistoryRequest = {
                    groups: ['revenuefromoperations']
                };
                let expenseModel: GroupHistoryRequest = {
                    groups: ['indirectexpenses', 'operatingcost']
                };
                let ExpenceResp: Observable<BaseResponse<GroupHistoryResponse, GroupHistoryRequest>> = new Observable<BaseResponse<GroupHistoryResponse, GroupHistoryRequest>>
                    ((o) => {
                        o.next({ status: 'success', body: { groups: [] } });
                    });

                let RevenueResp: Observable<BaseResponse<GroupHistoryResponse, GroupHistoryRequest>> = new Observable<BaseResponse<GroupHistoryResponse, GroupHistoryRequest>>
                    ((o) => {
                        o.next({ status: 'success', body: { groups: [] } });
                    });
                let PlResp: Observable<BaseResponse<DashboardResponse, string>> = new Observable<BaseResponse<DashboardResponse, string>>((o) => {
                    o.next({ status: 'success', body: { networth: [], profitLoss: [] } });
                });
                let a: Observable<Action> = new Observable<Action>((o) => {
                    o.next(action);
                });
                (action.payload.ApiToCall as API_TO_CALL[]).forEach(element => {
                    if (element === API_TO_CALL.EXPENCE) {
                        ExpenceResp = this._dashboardService.GetGroupHistory(expenseModel, action.payload.fromDate, action.payload.toDate, 'monthly', action.payload.refresh);
                    }
                    if (element === API_TO_CALL.REVENUE) {
                        RevenueResp = this._dashboardService.GetGroupHistory(revenueModel, action.payload.fromDate, action.payload.toDate, 'monthly', action.payload.refresh);
                    }
                    if (element === API_TO_CALL.PL) {
                        PlResp = this._dashboardService.Dashboard(action.payload.fromDate, action.payload.toDate, 'monthly', action.payload.refresh);
                    }
                });
                return observableZip(
                    RevenueResp, ExpenceResp, PlResp, a
                );
            }), map((res) => {
                if ((res[3] as CustomActions).payload.CalledFrom === CHART_CALLED_FROM.PAGEINIT) {
                    if ((res[0] === null || res[0].status === 'success') && (res[1] === null || res[1].status === 'success') && (res[2] === null || res[2].status === 'success')) {
                        let obj: IComparisionChartResponse = {
                            revenueActiveYear: res[0].body ? res[0].body.groups : null,
                            ExpensesActiveYear: res[1].body ? res[1].body.groups : null,
                            ProfitLossActiveYear: res[2].body,
                            NetworthActiveYear: _.cloneDeep(res[2].body),
                            refresh: (res[3] as CustomActions).payload.refresh
                        };
                        return {
                            type: HOME.COMPARISION_CHART.GET_PAGEINIT_CHART_DATA_ACTIVE_YEAR_RESPONSE,
                            payload: obj
                        };
                    }
                } else if ((res[3] as CustomActions).payload.CalledFrom === CHART_CALLED_FROM.COMPARISION) {
                    if ((res[0] === null || res[0].status === 'success') && (res[1] === null || res[1].status === 'success') && (res[2] === null || res[2].status === 'success')) {
                        let obj: IComparisionChartResponse = {
                            revenueActiveYear: res[0].body ? res[0].body.groups : null,
                            ExpensesActiveYear: res[1].body ? res[1].body.groups : null,
                            ProfitLossActiveYear: res[2].body,
                            NetworthActiveYear: _.cloneDeep(res[2].body),
                            refresh: (res[3] as CustomActions).payload.refresh
                        };
                        return {
                            type: HOME.COMPARISION_CHART.GET_COMPARISION_CHART_DATA_ACTIVE_YEAR_RESPONSE,
                            payload: obj
                        };
                    }
                } else if ((res[3] as CustomActions).payload.CalledFrom === CHART_CALLED_FROM.HISTORY) {
                    if ((res[0] === null || res[0].status === 'success') && (res[1] === null || res[1].status === 'success') && (res[2] === null || res[2].status === 'success')) {
                        let obj: IComparisionChartResponse = {
                            revenueActiveYear: res[0].body ? res[0].body.groups : null,
                            ExpensesActiveYear: res[1].body ? res[1].body.groups : null,
                            ProfitLossActiveYear: res[2].body,
                            NetworthActiveYear: _.cloneDeep(res[2].body),
                            refresh: (res[3] as CustomActions).payload.refresh
                        };
                        return {
                            type: HOME.COMPARISION_CHART.GET_HISTORY_CHART_DATA_ACTIVE_YEAR_RESPONSE,
                            payload: obj
                        };
                    }
                } else if ((res[3] as CustomActions).payload.CalledFrom === CHART_CALLED_FROM.NETWORTH) {
                    if ((res[0] === null || res[0].status === 'success') && (res[1] === null || res[1].status === 'success') && (res[2] === null || res[2].status === 'success')) {
                        let obj: IComparisionChartResponse = {
                            revenueActiveYear: res[0].body ? res[0].body.groups : null,
                            ExpensesActiveYear: res[1].body ? res[1].body.groups : null,
                            ProfitLossActiveYear: res[2].body,
                            NetworthActiveYear: _.cloneDeep(res[2].body),
                            refresh: (res[3] as CustomActions).payload.refresh
                        };
                        return {
                            type: HOME.COMPARISION_CHART.GET_NETWORTH_CHART_DATA_ACTIVE_YEAR_RESPONSE,
                            payload: obj
                        };
                    }
                }
                return {
                    type: 'EmptyAction'
                };
            }));

    @Effect()
    public GetComparisionChartLastYear$: Observable<Action> = this.action$
        .ofType(HOME.COMPARISION_CHART.GET_COMPARISION_CHART_DATA_LAST_YEAR).pipe(
            switchMap((action: CustomActions) => {
                let revenueModel: GroupHistoryRequest = {
                    groups: ['revenuefromoperations']
                };
                let expenseModel: GroupHistoryRequest = {
                    groups: ['indirectexpenses', 'operatingcost']
                };
                let ExpenceResp: Observable<BaseResponse<GroupHistoryResponse, GroupHistoryRequest>> = new Observable<BaseResponse<GroupHistoryResponse, GroupHistoryRequest>>
                    ((o) => {
                        o.next({ status: 'success', body: { groups: [] } });
                    });

                let RevenueResp: Observable<BaseResponse<GroupHistoryResponse, GroupHistoryRequest>> = new Observable<BaseResponse<GroupHistoryResponse, GroupHistoryRequest>>
                    ((o) => {
                        o.next({ status: 'success', body: { groups: [] } });
                    });
                let PlResp: Observable<BaseResponse<DashboardResponse, string>> = new Observable<BaseResponse<DashboardResponse, string>>((o) => {
                    o.next({ status: 'success', body: { networth: [], profitLoss: [] } });
                });
                let a: Observable<Action> = new Observable<Action>((o) => {
                    o.next(action);
                });
                (action.payload.ApiToCall as API_TO_CALL[]).forEach(element => {
                    if (element === API_TO_CALL.EXPENCE) {
                        ExpenceResp = this._dashboardService.GetGroupHistory(expenseModel, action.payload.fromDate, action.payload.toDate, 'monthly', action.payload.refresh);
                    }
                    if (element === API_TO_CALL.REVENUE) {
                        RevenueResp = this._dashboardService.GetGroupHistory(revenueModel, action.payload.fromDate, action.payload.toDate, 'monthly', action.payload.refresh);
                    }
                    if (element === API_TO_CALL.PL) {
                        PlResp = this._dashboardService.Dashboard(action.payload.fromDate, action.payload.toDate, 'monthly', action.payload.refresh);
                    }
                });
                return observableZip(
                    RevenueResp, ExpenceResp, PlResp, a
                );
            }), map((res) => {
                if ((res[3] as CustomActions).payload.CalledFrom === CHART_CALLED_FROM.PAGEINIT) {
                    if ((res[0] === null || res[0].status === 'success') && (res[1] === null || res[1].status === 'success') && (res[2] === null || res[2].status === 'success')) {
                        let obj: IComparisionChartResponse = {
                            revenueLastYear: res[0].body ? res[0].body.groups : null,
                            ExpensesLastYear: res[1].body ? res[1].body.groups : null,
                            ProfitLossLastYear: res[2].body,
                            NetworthLastYear: _.cloneDeep(res[2].body),
                            refresh: (res[3] as CustomActions).payload.refresh
                        };
                        return {
                            type: HOME.COMPARISION_CHART.GET_PAGEINIT_CHART_DATA_ACTIVE_YEAR_RESPONSE,
                            payload: obj
                        };
                    }
                } else if ((res[3] as CustomActions).payload.CalledFrom === CHART_CALLED_FROM.COMPARISION) {
                    if ((res[0] === null || res[0].status === 'success') && (res[1] === null || res[1].status === 'success') && (res[2] === null || res[2].status === 'success')) {
                        let obj: IComparisionChartResponse = {
                            revenueLastYear: res[0].body ? res[0].body.groups : null,
                            ExpensesLastYear: res[1].body ? res[1].body.groups : null,
                            ProfitLossLastYear: res[2].body,
                            NetworthLastYear: _.cloneDeep(res[2].body),
                            refresh: (res[3] as CustomActions).payload.refresh
                        };
                        return {
                            type: HOME.COMPARISION_CHART.GET_COMPARISION_CHART_DATA_LAST_YEAR_RESPONSE,
                            payload: obj
                        };
                    }
                } else if ((res[3] as CustomActions).payload.CalledFrom === CHART_CALLED_FROM.HISTORY) {
                    if ((res[0] === null || res[0].status === 'success') && (res[1] === null || res[1].status === 'success') && (res[2] === null || res[2].status === 'success')) {
                        let obj: IComparisionChartResponse = {
                            revenueLastYear: res[0].body ? res[0].body.groups : null,
                            ExpensesLastYear: res[1].body ? res[1].body.groups : null,
                            ProfitLossLastYear: res[2].body,
                            NetworthLastYear: _.cloneDeep(res[2].body),
                            refresh: (res[3] as CustomActions).payload.refresh
                        };
                        return {
                            type: HOME.COMPARISION_CHART.GET_HISTORY_CHART_DATA_LAST_YEAR_RESPONSE,
                            payload: obj
                        };
                    }
                } else if ((res[3] as CustomActions).payload.CalledFrom === CHART_CALLED_FROM.NETWORTH) {
                    if ((res[0] === null || res[0].status === 'success') && (res[1] === null || res[1].status === 'success') && (res[2] === null || res[2].status === 'success')) {
                        let obj: IComparisionChartResponse = {
                            revenueLastYear: res[0].body ? res[0].body.groups : null,
                            ExpensesLastYear: res[1].body ? res[1].body.groups : null,
                            ProfitLossLastYear: res[2].body,
                            NetworthLastYear: _.cloneDeep(res[2].body),
                            refresh: (res[3] as CustomActions).payload.refresh
                        };
                        return {
                            type: HOME.COMPARISION_CHART.GET_NETWORTH_CHART_DATA_LAST_YEAR_RESPONSE,
                            payload: obj
                        };
                    }
                }
                return {
                    type: 'EmptyAction'
                };
            }));

    @Effect()
    public GetNetworthChartActiveYear$: Observable<Action> = this.action$
        .ofType(HOME.NETWORTH_CHART.GET_NETWORTH_CHART_DATA_ACTIVE_YEAR).pipe(
            switchMap((action: CustomActions) => {
                let a: Observable<Action> = new Observable<Action>((o) => {
                    o.next(action);
                });
                return observableZip(
                    this._dashboardService.Dashboard(action.payload.fromDate, action.payload.toDate, 'monthly', action.payload.refresh),
                    a
                );
            }), map((res) => {
                if (res[0].status === 'success') {
                    let obj: IComparisionChartResponse = {
                        NetworthActiveYear: res[0].body,
                        refresh: (res[1] as CustomActions).payload.refresh
                    };
                    return {
                        type: HOME.COMPARISION_CHART.GET_NETWORTH_CHART_DATA_ACTIVE_YEAR_RESPONSE,
                        payload: obj
                    };
                }
                return {
                    type: 'EmptyAction'
                };
            }));

    @Effect()
    public GetBankAccounts$: Observable<Action> = this.action$

        .ofType(HOME.BANK_ACCOUNTS.GET_BANK_ACCOUNTS).pipe(
            switchMap((action: CustomActions) => {
                return this._dashboardService.GetBankAccounts();
            }), map((res) => this.validateResponse<BankAccountsResponse[], string>(res, {
                type: HOME.BANK_ACCOUNTS.GET_BANK_ACCOUNTS_RESPONSE,
                payload: res
            }, true, {
                type: HOME.BANK_ACCOUNTS.GET_BANK_ACCOUNTS_RESPONSE,
                payload: res
            })));
    @Effect()
    public RefereshBankAccounts$: Observable<Action> = this.action$
        .ofType(HOME.BANK_ACCOUNTS.REFRESH_BANK_ACCOUNT).pipe(
            switchMap((action: CustomActions) => {
                return this._dashboardService.RefreshBankAccount(action.payload);
            }), map((res) => this.validateResponse<RefreshBankAccountResponse, string>(res, {
                type: HOME.BANK_ACCOUNTS.REFRESH_BANK_ACCOUNT_RESPONSE,
                payload: res
            }, true, {
                type: HOME.BANK_ACCOUNTS.REFRESH_BANK_ACCOUNT_RESPONSE,
                payload: res
            })));

    @Effect()
    public ReConnectBankAccounts$: Observable<Action> = this.action$
        .ofType(HOME.BANK_ACCOUNTS.RECONNECT_BANK_ACCOUNT).pipe(
            switchMap((action: CustomActions) => {
                return this._dashboardService.ReconnectBankAccount(action.payload);
            }), map((res) => this.validateResponse<RefreshBankAccountResponse, string>(res, {
                type: HOME.BANK_ACCOUNTS.RECONNECT_BANK_ACCOUNT_RESPONSE,
                payload: res
            }, true, {
                type: HOME.BANK_ACCOUNTS.RECONNECT_BANK_ACCOUNT_RESPONSE,
                payload: res
            })));

    @Effect()
    public GetRatioAnalysis$: Observable<Action> = this.action$

        .ofType(HOME.GET_RATIO_ANALYSIS).pipe(
            switchMap((action: CustomActions) => {
                return this._dashboardService.GetRationAnalysis(action.payload.date, action.payload.refresh);
            }), map((res) => this.validateResponse<BankAccountsResponse[], string>(res, {
                type: HOME.GET_RATIO_ANALYSIS_RESPONSE,
                payload: res
            }, true, {
                type: HOME.GET_RATIO_ANALYSIS_RESPONSE,
                payload: res
            })));

    @Effect()
    public GetTotalOverdues$: Observable<Action> = this.action$
        .ofType(HOME.TOTAL_OVERDUES.GET_TOTALOVER_DUES).pipe(
            switchMap((action: CustomActions) => {
                return observableZip(
                    this._dashboardService.GetClosingBalance('sundrydebtors', action.payload.fromDate, action.payload.toDate, action.payload.refresh),
                    this._dashboardService.GetClosingBalance('sundrycreditors', action.payload.fromDate, action.payload.toDate, action.payload.refresh)
                );
            }), map((res) => {
                if (res[0].status === 'success' && res[1].status === 'success') {
                    let obj: ITotalOverDuesResponse[] = [];
                    obj.push(res[0].body[0]);
                    obj.push(res[1].body[0]);
                    return {
                        type: HOME.TOTAL_OVERDUES.GET_TOTALOVER_DUES_RESPONSE,
                        payload: obj
                    };
                }

                return {
                    type: HOME.TOTAL_OVERDUES.GET_TOTALOVER_DUES_RESPONSE,
                    payload: null
                };
            }));

    @Effect()
    public getRevenueGraphTypes$: Observable<Action> = this.action$
        .ofType(HOME.GET_REVENUE_GRAPH_TYPES).pipe(
            switchMap((action: CustomActions) => this._dashboardService.GetRevenueGraphTypes()),
            map(response => this.getRevenueGraphTypesResponse(response)));

    @Effect()
    public getRevenueGraphData$: Observable<Action> = this.action$
        .ofType(HOME.GET_REVENUE_GRAPH_DATA).pipe(
            switchMap((action: CustomActions) => this._dashboardService.GetRevenueGraphData(action.payload)), map((res) => this.validateResponse<RevenueGraphDataResponse, string>(res, {
                type: HOME.GET_REVENUE_GRAPH_DATA_RESPONSE,
                payload: res
            }, true, {
                type: HOME.GET_REVENUE_GRAPH_DATA_RESPONSE,
                payload: res
            })));

    constructor(private action$: Actions, private _toasty: ToasterService, private _dashboardService: DashboardService) {
        //
    }

    public getExpensesChartDataOfActiveYear(fromDate: string = '', toDate: string = '', refresh: boolean = false): CustomActions {
        return {
            type: HOME.EXPENSES_CHART.GET_EXPENSES_CHART_DATA_ACTIVE_YEAR,
            payload: { fromDate, toDate, refresh }
        };
    }

    public getExpensesChartDataOfLastYear(fromDate: string = '', toDate: string = '', refresh: boolean = false): CustomActions {
        return {
            type: HOME.EXPENSES_CHART.GET_EXPENSES_CHART_DATA_LAST_YEAR,
            payload: { fromDate, toDate, refresh }
        };
    }

    public getRevenueChartDataOfActiveYear(fromDate: string = '', toDate: string = '', refresh: boolean = false): CustomActions {
        return {
            type: HOME.REVENUE_CHART.GET_REVENUE_CHART_DATA_ACTIVE_YEAR,
            payload: { fromDate, toDate, refresh }
        };
    }

    public getRevenueChartDataOfLastYear(fromDate: string = '', toDate: string = '', refresh: boolean = false): CustomActions {
        return {
            type: HOME.REVENUE_CHART.GET_REVENUE_CHART_DATA_LAST_YEAR,
            payload: { fromDate, toDate, refresh }
        };
    }

    public getComparisionChartDataOfActiveYear(fromDate: string = '', toDate: string = '', refresh: boolean = false, CalledFrom: CHART_CALLED_FROM, ApiToCall: API_TO_CALL[]): CustomActions {
        return {
            type: HOME.COMPARISION_CHART.GET_COMPARISION_CHART_DATA_ACTIVE_YEAR,
            payload: { fromDate, toDate, refresh, CalledFrom, ApiToCall }
        };
    }

    public getComparisionChartDataOfLastYear(fromDate: string = '', toDate: string = '', refresh: boolean = false, CalledFrom: CHART_CALLED_FROM, ApiToCall: API_TO_CALL[]): CustomActions {
        return {
            type: HOME.COMPARISION_CHART.GET_COMPARISION_CHART_DATA_LAST_YEAR,
            payload: { fromDate, toDate, refresh, CalledFrom, ApiToCall }
        };
    }

    public getNetworthChartDataOfActiveYear(fromDate: string = '', toDate: string = '', refresh: boolean = false): CustomActions {
        return {
            type: HOME.NETWORTH_CHART.GET_NETWORTH_CHART_DATA_ACTIVE_YEAR,
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

    public ResetHomeState(): CustomActions {
        return {
            type: HOME.RESET_HOME_STATE
        };
    }

    public getRatioAnalysis(date: string, refresh: boolean) {
        return {
            type: HOME.GET_RATIO_ANALYSIS,
            payload: { date, refresh }
        };
    }

    public getRatioAnalysisResponse(res) {
        return {
            type: HOME.GET_RATIO_ANALYSIS_RESPONSE,
            payload: res
        };
    }

    public getTotalOverdues(fromDate: string, toDate: string, refresh: boolean) {
        return {
            type: HOME.TOTAL_OVERDUES.GET_TOTALOVER_DUES,
            payload: { fromDate, toDate, refresh }
        };
    }

    public getTotalOverduesResponse(res) {
        return {
            type: HOME.TOTAL_OVERDUES.GET_TOTALOVER_DUES_RESPONSE,
            payload: res
        };
    }

    private validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: CustomActions, showToast: boolean = false, errorAction: CustomActions = { type: 'EmptyAction' }): CustomActions {
        if (response.status === 'error') {
            if (showToast) {
                this._toasty.errorToast(response.message);
            }
            return errorAction;
        }
        return successAction;
    }

    public getRevenueGraphTypes(): CustomActions {
        return {
            type: HOME.GET_REVENUE_GRAPH_TYPES,
            payload: null
        };
    }

    public getRevenueGraphTypesResponse(value: BaseResponse<GraphTypesResponse, any>): CustomActions {
        return {
            type: HOME.GET_REVENUE_GRAPH_TYPES_RESPONSE,
            payload: value
        };
    }

    public getRevenueGraphData(request: RevenueGraphDataRequest): CustomActions {
        return {
            type: HOME.GET_REVENUE_GRAPH_DATA,
            payload: request
        };
    }

    public getRevenueGraphDataResponse(value: BaseResponse<RevenueGraphDataResponse, any>): CustomActions {
        return {
            type: HOME.GET_REVENUE_GRAPH_DATA_RESPONSE,
            payload: value
        };
    }

    public resetRevenueGraphData(): CustomActions {
        return {
            type: HOME.RESET_REVENUE_GRAPH_DATA_RESPONSE
        };
    }
}
