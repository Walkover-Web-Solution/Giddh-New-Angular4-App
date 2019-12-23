import { BaseResponse } from '../../models/api-models/BaseResponse';
import { HOME } from '../../actions/home/home.const';
import { IComparisionChartResponse, IExpensesChartClosingBalanceResponse, IGroupHistoryGroups, IRevenueChartClosingBalanceResponse } from '../../models/interfaces/dashboard.interface';
import * as moment from 'moment/moment';
import * as _ from '../../lodash-optimized';
import {
    BankAccountsResponse,
    RefreshBankAccountResponse,
    GraphTypesResponse,
    RevenueGraphDataResponse
} from '../../models/api-models/Dashboard';
import { CustomActions } from '../customActions';
import { COMMON_ACTIONS } from '../../actions/common.const';

export interface HomeState {
    value?: string;
    expensesChart?: IExpensesChartClosingBalanceResponse;
    expensesChartError?: string;
    revenueChart?: IRevenueChartClosingBalanceResponse;
    revenueChartError?: string;

    // ComparisionChart
    comparisionChart: IComparisionChartResponse;
    comparisionChartError?: string;

    history_comparisionChart: IComparisionChartResponse;
    history_comparisionChartError?: string;

    networth_comparisionChart: IComparisionChartResponse;
    networth_comparisionChartError?: string;

    isExpensesChartDataInProcess: boolean;
    isExpensesChartDataAvailable: boolean;
    isRevenueChartDataInProcess: boolean;
    isRevenueChartDataAvailable: boolean;
    isGetBankAccountsInProcess: boolean;
    getBankAccountError?: string;
    BankAccounts?: BankAccountsResponse[];
    isRefereshBankAccount: boolean;
    RefereshBankAccount?: RefreshBankAccountResponse;
    isReConnectBankAccount: boolean;
    ReConnectBankAccount?: RefreshBankAccountResponse;
    RatioAnalysis?: any;
    totalOverDues?: any;
    revenueGraphTypes: any;
    revenueGraphData: any;
}

export const initialState: HomeState = {
    expensesChart: null,
    revenueChart: null,
    isExpensesChartDataInProcess: false,
    isExpensesChartDataAvailable: false,
    isRevenueChartDataInProcess: false,
    isRevenueChartDataAvailable: false,
    isGetBankAccountsInProcess: false,
    isRefereshBankAccount: false,
    isReConnectBankAccount: false,
    comparisionChart: {
        // revenue
        revenueActiveYear: [],
        revenueActiveYearMonthly: [],
        revenueActiveYearYearly: [],
        revenueLastYear: [],
        revenueLastYearMonthly: [],
        revenueLastYearYearly: [],
        // expenses
        ExpensesActiveYear: [],
        ExpensesActiveYearMonthly: [],
        ExpensesActiveYearYearly: [],
        ExpensesLastYear: [],
        ExpensesLastYearMonthly: [],
        ExpensesLastYearYearly: [],
        // networth
        NetworthActiveYear: {
            networth: [],
            profitLoss: [],
            monthlyBalances: []
        },
        NetworthActiveYearMonthly: [],
        NetworthActiveYearYearly: [],
        NetworthLastYear: {
            networth: [],
            profitLoss: [],
            monthlyBalances: []
        },
        NetworthLastYearMonthly: [],
        NetworthLastYearYearly: [],
        // P/L
        ProfitLossActiveYear: {
            networth: [],
            profitLoss: [],
            monthlyBalances: []
        },
        ProfitLossActiveYearMonthly: [],
        ProfitLossActiveYearYearly: [],
        ProfitLossLastYear: {
            networth: [],
            profitLoss: [],
            monthlyBalances: []
        },
        ProfitLossLastYearMonthly: [],
        ProfitLossLastYearYearly: [],
    },
    history_comparisionChart: {
        // revenue
        revenueActiveYear: [],
        revenueActiveYearMonthly: [],
        revenueActiveYearYearly: [],
        revenueLastYear: [],
        revenueLastYearMonthly: [],
        revenueLastYearYearly: [],
        // expenses
        ExpensesActiveYear: [],
        ExpensesActiveYearMonthly: [],
        ExpensesActiveYearYearly: [],
        ExpensesLastYear: [],
        ExpensesLastYearMonthly: [],
        ExpensesLastYearYearly: [],
        // networth
        NetworthActiveYear: {
            networth: [],
            profitLoss: [],
            monthlyBalances: []
        },
        NetworthActiveYearMonthly: [],
        NetworthActiveYearYearly: [],
        NetworthLastYear: {
            networth: [],
            profitLoss: [],
            monthlyBalances: []
        },
        NetworthLastYearMonthly: [],
        NetworthLastYearYearly: [],
        // P/L
        ProfitLossActiveYear: {
            networth: [],
            profitLoss: [],
            monthlyBalances: []
        },
        ProfitLossActiveYearMonthly: [],
        ProfitLossActiveYearYearly: [],
        ProfitLossLastYear: {
            networth: [],
            profitLoss: [],
            monthlyBalances: []
        },
        ProfitLossLastYearMonthly: [],
        ProfitLossLastYearYearly: [],
    },
    networth_comparisionChart: {
        // revenue
        revenueActiveYear: [],
        revenueActiveYearMonthly: [],
        revenueActiveYearYearly: [],
        revenueLastYear: [],
        revenueLastYearMonthly: [],
        revenueLastYearYearly: [],
        // expenses
        ExpensesActiveYear: [],
        ExpensesActiveYearMonthly: [],
        ExpensesActiveYearYearly: [],
        ExpensesLastYear: [],
        ExpensesLastYearMonthly: [],
        ExpensesLastYearYearly: [],
        // networth
        NetworthActiveYear: {
            networth: [],
            profitLoss: [],
            monthlyBalances: []
        },
        NetworthActiveYearMonthly: [],
        NetworthActiveYearYearly: [],
        NetworthLastYear: {
            networth: [],
            profitLoss: [],
            monthlyBalances: []
        },
        NetworthLastYearMonthly: [],
        NetworthLastYearYearly: [],
        // P/L
        ProfitLossActiveYear: {
            networth: [],
            profitLoss: [],
            monthlyBalances: []
        },
        ProfitLossActiveYearMonthly: [],
        ProfitLossActiveYearYearly: [],
        ProfitLossLastYear: {
            networth: [],
            profitLoss: [],
            monthlyBalances: []
        },
        ProfitLossLastYearMonthly: [],
        ProfitLossLastYearYearly: [],
    },
    totalOverDues: [],
    revenueGraphTypes: [],
    revenueGraphData: []
};

export function homeReducer(state = initialState, action: CustomActions): HomeState {
    switch (action.type) {
        case COMMON_ACTIONS.RESET_APPLICATION_DATA: {
            return Object.assign({}, state, initialState);
        }
        case HOME.EXPENSES_CHART.GET_EXPENSES_CHART_DATA_ACTIVE_YEAR_RESPONSE: {
            let data = action.payload as IExpensesChartClosingBalanceResponse;
            return Object.assign({}, state, {
                expensesChart: {
                    ...state.expensesChart,
                    operatingcostActiveyear: data.operatingcostActiveyear,
                    indirectexpensesActiveyear: data.indirectexpensesActiveyear
                }
            });
        }
        case HOME.EXPENSES_CHART.GET_EXPENSES_CHART_DATA_ACTIVE_YEAR_ERROR_RESPONSE: {
            let data = action.payload;
            if (data.operatingcostActiveyear.status !== 'success') {
                return Object.assign({}, state, {
                    expensesChartError: data.operatingcostActiveyear.message
                });
            }
            if (data.operatingcostActiveyear.status !== 'success') {
                return Object.assign({}, state, {
                    expensesChartError: data.indirectexpensesActiveyear.message
                });
            }
            return state;
        }

        case HOME.EXPENSES_CHART.GET_EXPENSES_CHART_DATA_LAST_YEAR_RESPONSE: {
            let data = action.payload as IExpensesChartClosingBalanceResponse;
            return Object.assign({}, state, {
                expensesChart: {
                    ...state.expensesChart,
                    operatingcostLastyear: data.operatingcostLastyear,
                    indirectexpensesLastyear: data.indirectexpensesLastyear
                }
            });
        }
        case HOME.EXPENSES_CHART.GET_EXPENSES_CHART_DATA_LAST_YEAR_ERROR_RESPONSE: {
            let data = action.payload;
            if (data.operatingcostActiveyear.status !== 'success') {
                return Object.assign({}, state, {
                    expensesChartError: data.operatingcostActiveyear.message
                });
            }
            if (data.operatingcostActiveyear.status !== 'success') {
                return Object.assign({}, state, {
                    expensesChartError: data.operatingcostActiveyear.message
                });
            }
            return state;
        }

        // Revenue CHART API
        case HOME.REVENUE_CHART.GET_REVENUE_CHART_DATA_LAST_YEAR_RESPONSE: {
            let data = action.payload as IRevenueChartClosingBalanceResponse;
            return Object.assign({}, state, {
                revenueChart: {
                    ...state.revenueChart,
                    revenuefromoperationsLastyear: data.revenuefromoperationsLastyear,
                    otherincomeLastyear: data.otherincomeLastyear
                }
            });
        }
        case HOME.REVENUE_CHART.GET_REVENUE_CHART_DATA_ACTIVE_YEAR_RESPONSE: {
            let data = action.payload as IRevenueChartClosingBalanceResponse;
            return Object.assign({}, state, {
                revenueChart: {
                    ...state.revenueChart,
                    revenuefromoperationsActiveyear: data.revenuefromoperationsActiveyear,
                    otherincomeActiveyear: data.otherincomeActiveyear
                }
            });
        }
        case HOME.REVENUE_CHART.GET_REVENUE_CHART_DATA_ACTIVE_YEAR_ERROR_RESPONSE: {
            let data = action.payload;
            if (data.revenuefromoperationsActiveyear.status !== 'success') {
                return Object.assign({}, state, {
                    revenueChartError: data.revenuefromoperationsActiveyear.message
                });
            }
            if (data.otherincomeActiveyear.status !== 'success') {
                return Object.assign({}, state, {
                    revenueChartError: data.otherincomeActiveyear.message
                });
            }
            return state;
        }
        // End Revenue Chart
        // START COMPARISION CHART API
        case HOME.COMPARISION_CHART.GET_PAGEINIT_CHART_DATA_ACTIVE_YEAR_RESPONSE: {
            let data = action.payload as IComparisionChartResponse;
            let revenueActiveYear = (data.refresh || (state.comparisionChart && state.comparisionChart.revenueActiveYear && (state.comparisionChart.revenueActiveYear.length === 0))) ? processDataForGroupHistory(data.revenueActiveYear) : _.cloneDeep(state.comparisionChart.revenueActiveYear);
            let ExpensesActiveYear = (data.refresh || (state.comparisionChart && state.comparisionChart.ExpensesActiveYear && (state.comparisionChart.ExpensesActiveYear.length === 0))) ? processDataForGroupHistory(data.ExpensesActiveYear) : _.cloneDeep(state.comparisionChart.ExpensesActiveYear);
            let ProfitLossActiveYear = (data.refresh || (state.comparisionChart && state.comparisionChart.ProfitLossActiveYear && (state.comparisionChart.ProfitLossActiveYear.monthlyBalances.length === 0))) ? processDataForProfitLoss(data.ProfitLossActiveYear) : _.cloneDeep(state.comparisionChart.ProfitLossActiveYear);
            let NetworthActiveYear = (data.refresh || (state.comparisionChart && state.comparisionChart.NetworthActiveYear && (state.comparisionChart.NetworthActiveYear.monthlyBalances.length === 0))) ? processDataForNetworth(data.NetworthActiveYear) : _.cloneDeep(state.comparisionChart.NetworthActiveYear);
            return Object.assign({}, state, {
                comparisionChart: {
                    ...state.comparisionChart,
                    revenueActiveYear,
                    revenueActiveYearMonthly: revenueActiveYear.map(p => p.closingBalance.amount),
                    revenueActiveYearYearly: revenueActiveYear.map(p => p.total.amount),
                    ExpensesActiveYear,
                    ExpensesActiveYearMonthly: ExpensesActiveYear.map(p => p.closingBalance.amount),
                    ExpensesActiveYearYearly: ExpensesActiveYear.map(p => p.total.amount),
                    ProfitLossActiveYear,
                    ProfitLossActiveYearMonthly: ProfitLossActiveYear.monthlyBalances,
                    ProfitLossActiveYearYearly: ProfitLossActiveYear.yearlyBalances,
                    NetworthActiveYear,
                    NetworthActiveYearMonthly: NetworthActiveYear.monthlyBalances,
                    NetworthActiveYearYearly: NetworthActiveYear.yearlyBalances,
                },
                history_comparisionChart: {
                    ...state.history_comparisionChart,
                    revenueActiveYear,
                    revenueActiveYearMonthly: revenueActiveYear.map(p => p.closingBalance.amount),
                    revenueActiveYearYearly: revenueActiveYear.map(p => p.total.amount),
                    ExpensesActiveYear,
                    ExpensesActiveYearMonthly: ExpensesActiveYear.map(p => p.closingBalance.amount),
                    ExpensesActiveYearYearly: ExpensesActiveYear.map(p => p.total.amount),
                    ProfitLossActiveYear,
                    ProfitLossActiveYearMonthly: ProfitLossActiveYear.monthlyBalances,
                    ProfitLossActiveYearYearly: ProfitLossActiveYear.yearlyBalances,
                    NetworthActiveYear,
                    NetworthActiveYearMonthly: NetworthActiveYear.monthlyBalances,
                    NetworthActiveYearYearly: NetworthActiveYear.yearlyBalances,
                },
                networth_comparisionChart: {
                    ...state.networth_comparisionChart,
                    revenueActiveYear,
                    revenueActiveYearMonthly: revenueActiveYear.map(p => p.closingBalance.amount),
                    revenueActiveYearYearly: revenueActiveYear.map(p => p.total.amount),
                    ExpensesActiveYear,
                    ExpensesActiveYearMonthly: ExpensesActiveYear.map(p => p.closingBalance.amount),
                    ExpensesActiveYearYearly: ExpensesActiveYear.map(p => p.total.amount),
                    ProfitLossActiveYear,
                    ProfitLossActiveYearMonthly: ProfitLossActiveYear.monthlyBalances,
                    ProfitLossActiveYearYearly: ProfitLossActiveYear.yearlyBalances,
                    NetworthActiveYear,
                    NetworthActiveYearMonthly: NetworthActiveYear.monthlyBalances,
                    NetworthActiveYearYearly: NetworthActiveYear.yearlyBalances,
                }
            });
        }
        case HOME.COMPARISION_CHART.GET_PAGEINIT_CHART_DATA_LAST_YEAR_RESPONSE: {
            let data = action.payload as IComparisionChartResponse;
            let revenueLastYear = (data.refresh || (state.comparisionChart && state.comparisionChart.revenueLastYear && (state.comparisionChart.revenueLastYear.length === 0))) ? processDataForGroupHistory(data.revenueLastYear) : _.cloneDeep(state.comparisionChart.revenueLastYear);
            let ExpensesLastYear = (data.refresh || (state.comparisionChart && state.comparisionChart.ExpensesLastYear && (state.comparisionChart.ExpensesLastYear.length === 0))) ? processDataForGroupHistory(data.ExpensesLastYear) : _.cloneDeep(state.comparisionChart.ExpensesLastYear);
            let ProfitLossLastYear = (data.refresh || (state.comparisionChart && state.comparisionChart.ProfitLossLastYear && (state.comparisionChart.ProfitLossLastYear.monthlyBalances.length === 0))) ? processDataForProfitLoss(data.ProfitLossLastYear) : _.cloneDeep(state.comparisionChart.ProfitLossLastYear);
            let NetworthLastYear = (data.refresh || (state.comparisionChart && state.comparisionChart.NetworthLastYear && (state.comparisionChart.NetworthLastYear.monthlyBalances.length === 0))) ? processDataForNetworth(data.NetworthLastYear) : _.cloneDeep(state.comparisionChart.NetworthLastYear);
            return Object.assign({}, state, {
                comparisionChart: {
                    ...state.comparisionChart,
                    revenueLastYear,
                    revenueLastYearMonthly: revenueLastYear.map(p => p.closingBalance.amount),
                    revenueLastYearYearly: revenueLastYear.map(p => p.total.amount),
                    ExpensesLastYear,
                    ExpensesLastYearMonthly: ExpensesLastYear.map(p => p.closingBalance.amount),
                    ExpensesLastYearYearly: ExpensesLastYear.map(p => p.total.amount),
                    ProfitLossLastYear,
                    ProfitLossLastYearMonthly: ProfitLossLastYear.monthlyBalances,
                    ProfitLossLastYearYearly: ProfitLossLastYear.yearlyBalances,
                    NetworthLastYear,
                    NetworthLastYearMonthly: NetworthLastYear.monthlyBalances,
                    NetworthLastYearYearly: NetworthLastYear.yearlyBalances,
                },
                history_comparisionChart: {
                    ...state.history_comparisionChart,
                    revenueLastYear,
                    revenueLastYearMonthly: revenueLastYear.map(p => p.closingBalance.amount),
                    revenueLastYearYearly: revenueLastYear.map(p => p.total.amount),
                    ExpensesLastYear,
                    ExpensesLastYearMonthly: ExpensesLastYear.map(p => p.closingBalance.amount),
                    ExpensesLastYearYearly: ExpensesLastYear.map(p => p.total.amount),
                    ProfitLossLastYear,
                    ProfitLossLastYearMonthly: ProfitLossLastYear.monthlyBalances,
                    ProfitLossLastYearYearly: ProfitLossLastYear.yearlyBalances,
                    NetworthLastYear,
                    NetworthLastYearMonthly: NetworthLastYear.monthlyBalances,
                    NetworthLastYearYearly: NetworthLastYear.yearlyBalances,
                },
                networth_comparisionChart: {
                    ...state.networth_comparisionChart,
                    revenueLastYear,
                    revenueLastYearMonthly: revenueLastYear.map(p => p.closingBalance.amount),
                    revenueLastYearYearly: revenueLastYear.map(p => p.total.amount),
                    ExpensesLastYear,
                    ExpensesLastYearMonthly: ExpensesLastYear.map(p => p.closingBalance.amount),
                    ExpensesLastYearYearly: ExpensesLastYear.map(p => p.total.amount),
                    ProfitLossLastYear,
                    ProfitLossLastYearMonthly: ProfitLossLastYear.monthlyBalances,
                    ProfitLossLastYearYearly: ProfitLossLastYear.yearlyBalances,
                    NetworthLastYear,
                    NetworthLastYearMonthly: NetworthLastYear.monthlyBalances,
                    NetworthLastYearYearly: NetworthLastYear.yearlyBalances,
                }
            });
        }
        case HOME.COMPARISION_CHART.GET_COMPARISION_CHART_DATA_ACTIVE_YEAR_RESPONSE: {
            let data = action.payload as IComparisionChartResponse;
            let revenueActiveYear = (data.refresh || (state.comparisionChart && state.comparisionChart.revenueActiveYear && (state.comparisionChart.revenueActiveYear.length === 0))) ? processDataForGroupHistory(data.revenueActiveYear) : _.cloneDeep(state.comparisionChart.revenueActiveYear);
            let ExpensesActiveYear = (data.refresh || (state.comparisionChart && state.comparisionChart.ExpensesActiveYear && (state.comparisionChart.ExpensesActiveYear.length === 0))) ? processDataForGroupHistory(data.ExpensesActiveYear) : _.cloneDeep(state.comparisionChart.ExpensesActiveYear);
            let ProfitLossActiveYear = (data.refresh || (state.comparisionChart && state.comparisionChart.ProfitLossActiveYear && (state.comparisionChart.ProfitLossActiveYear.monthlyBalances.length === 0))) ? processDataForProfitLoss(data.ProfitLossActiveYear) : _.cloneDeep(state.comparisionChart.ProfitLossActiveYear);
            let NetworthActiveYear = (data.refresh || (state.comparisionChart && state.comparisionChart.NetworthActiveYear && (state.comparisionChart.NetworthActiveYear.monthlyBalances.length === 0))) ? processDataForNetworth(data.NetworthActiveYear) : _.cloneDeep(state.comparisionChart.NetworthActiveYear);
            return Object.assign({}, state, {
                comparisionChart: {
                    ...state.comparisionChart,
                    revenueActiveYear,
                    revenueActiveYearMonthly: revenueActiveYear.map(p => p.closingBalance.amount),
                    revenueActiveYearYearly: revenueActiveYear.map(p => p.total.amount),
                    ExpensesActiveYear,
                    ExpensesActiveYearMonthly: ExpensesActiveYear.map(p => p.closingBalance.amount),
                    ExpensesActiveYearYearly: ExpensesActiveYear.map(p => p.total.amount),
                    ProfitLossActiveYear,
                    ProfitLossActiveYearMonthly: ProfitLossActiveYear.monthlyBalances,
                    ProfitLossActiveYearYearly: ProfitLossActiveYear.yearlyBalances,
                    NetworthActiveYear,
                    NetworthActiveYearMonthly: NetworthActiveYear.monthlyBalances,
                    NetworthActiveYearYearly: NetworthActiveYear.yearlyBalances,
                }
            });
        }
        case HOME.COMPARISION_CHART.GET_COMPARISION_CHART_DATA_LAST_YEAR_RESPONSE: {
            let data = action.payload as IComparisionChartResponse;
            let revenueLastYear = (data.refresh || (state.comparisionChart && state.comparisionChart.revenueLastYear && (state.comparisionChart.revenueLastYear.length === 0))) ? processDataForGroupHistory(data.revenueLastYear) : _.cloneDeep(state.comparisionChart.revenueLastYear);
            let ExpensesLastYear = (data.refresh || (state.comparisionChart && state.comparisionChart.ExpensesLastYear && (state.comparisionChart.ExpensesLastYear.length === 0))) ? processDataForGroupHistory(data.ExpensesLastYear) : _.cloneDeep(state.comparisionChart.ExpensesLastYear);
            let ProfitLossLastYear = (data.refresh || (state.comparisionChart && state.comparisionChart.ProfitLossLastYear && (state.comparisionChart.ProfitLossLastYear.monthlyBalances.length === 0))) ? processDataForProfitLoss(data.ProfitLossLastYear) : _.cloneDeep(state.comparisionChart.ProfitLossLastYear);
            let NetworthLastYear = (data.refresh || (state.comparisionChart && state.comparisionChart.NetworthLastYear && (state.comparisionChart.NetworthLastYear.monthlyBalances.length === 0))) ? processDataForNetworth(data.NetworthLastYear) : _.cloneDeep(state.comparisionChart.NetworthLastYear);
            return Object.assign({}, state, {
                comparisionChart: {
                    ...state.comparisionChart,
                    revenueLastYear,
                    revenueLastYearMonthly: revenueLastYear.map(p => p.closingBalance.amount),
                    revenueLastYearYearly: revenueLastYear.map(p => p.total.amount),
                    ExpensesLastYear,
                    ExpensesLastYearMonthly: ExpensesLastYear.map(p => p.closingBalance.amount),
                    ExpensesLastYearYearly: ExpensesLastYear.map(p => p.total.amount),
                    ProfitLossLastYear,
                    ProfitLossLastYearMonthly: ProfitLossLastYear.monthlyBalances,
                    ProfitLossLastYearYearly: ProfitLossLastYear.yearlyBalances,
                    NetworthLastYear,
                    NetworthLastYearMonthly: NetworthLastYear.monthlyBalances,
                    NetworthLastYearYearly: NetworthLastYear.yearlyBalances,
                }
            });
        }
        case HOME.COMPARISION_CHART.GET_HISTORY_CHART_DATA_ACTIVE_YEAR_RESPONSE: {
            let data = action.payload as IComparisionChartResponse;
            let revenueActiveYear = (data.refresh || (state.history_comparisionChart && state.history_comparisionChart.revenueActiveYear && (state.history_comparisionChart.revenueActiveYear.length === 0))) ? processDataForGroupHistory(data.revenueActiveYear) : _.cloneDeep(state.history_comparisionChart.revenueActiveYear);
            let ExpensesActiveYear = (data.refresh || (state.history_comparisionChart && state.history_comparisionChart.ExpensesActiveYear && (state.history_comparisionChart.ExpensesActiveYear.length === 0))) ? processDataForGroupHistory(data.ExpensesActiveYear) : _.cloneDeep(state.history_comparisionChart.ExpensesActiveYear);
            let ProfitLossActiveYear = (data.refresh || (state.history_comparisionChart && state.history_comparisionChart.ProfitLossActiveYear && (state.history_comparisionChart.ProfitLossActiveYear.monthlyBalances.length === 0))) ? processDataForProfitLoss(data.ProfitLossActiveYear) : _.cloneDeep(state.history_comparisionChart.ProfitLossActiveYear);
            let NetworthActiveYear = (data.refresh || (state.history_comparisionChart && state.history_comparisionChart.NetworthActiveYear && (state.history_comparisionChart.NetworthActiveYear.monthlyBalances.length === 0))) ? processDataForNetworth(data.NetworthActiveYear) : _.cloneDeep(state.history_comparisionChart.NetworthActiveYear);
            return Object.assign({}, state, {
                history_comparisionChart: {
                    ...state.history_comparisionChart,
                    revenueActiveYear,
                    revenueActiveYearMonthly: revenueActiveYear.map(p => p.closingBalance.amount),
                    revenueActiveYearYearly: revenueActiveYear.map(p => p.total.amount),
                    ExpensesActiveYear,
                    ExpensesActiveYearMonthly: ExpensesActiveYear.map(p => p.closingBalance.amount),
                    ExpensesActiveYearYearly: ExpensesActiveYear.map(p => p.total.amount),
                    ProfitLossActiveYear,
                    ProfitLossActiveYearMonthly: ProfitLossActiveYear.monthlyBalances,
                    ProfitLossActiveYearYearly: ProfitLossActiveYear.yearlyBalances,
                    NetworthActiveYear,
                    NetworthActiveYearMonthly: NetworthActiveYear.monthlyBalances,
                    NetworthActiveYearYearly: NetworthActiveYear.yearlyBalances,
                }
            });
        }
        case HOME.COMPARISION_CHART.GET_HISTORY_CHART_DATA_LAST_YEAR_RESPONSE: {
            let data = action.payload as IComparisionChartResponse;
            let revenueLastYear = (data.refresh || (state.history_comparisionChart && state.history_comparisionChart.revenueLastYear && (state.history_comparisionChart.revenueLastYear.length === 0))) ? processDataForGroupHistory(data.revenueLastYear) : _.cloneDeep(state.history_comparisionChart.revenueLastYear);
            let ExpensesLastYear = (data.refresh || (state.history_comparisionChart && state.history_comparisionChart.ExpensesLastYear && (state.history_comparisionChart.ExpensesLastYear.length === 0))) ? processDataForGroupHistory(data.ExpensesLastYear) : _.cloneDeep(state.history_comparisionChart.ExpensesLastYear);
            let ProfitLossLastYear = (data.refresh || (state.history_comparisionChart && state.history_comparisionChart.ProfitLossLastYear && (state.history_comparisionChart.ProfitLossLastYear.monthlyBalances.length === 0))) ? processDataForProfitLoss(data.ProfitLossLastYear) : _.cloneDeep(state.history_comparisionChart.ProfitLossLastYear);
            let NetworthLastYear = (data.refresh || (state.history_comparisionChart && state.history_comparisionChart.NetworthLastYear && (state.history_comparisionChart.NetworthLastYear.monthlyBalances.length === 0))) ? processDataForNetworth(data.NetworthLastYear) : _.cloneDeep(state.history_comparisionChart.NetworthLastYear);
            return Object.assign({}, state, {
                history_comparisionChart: {
                    ...state.history_comparisionChart,
                    revenueLastYear,
                    revenueLastYearMonthly: revenueLastYear.map(p => p.closingBalance.amount),
                    revenueLastYearYearly: revenueLastYear.map(p => p.total.amount),
                    ExpensesLastYear,
                    ExpensesLastYearMonthly: ExpensesLastYear.map(p => p.closingBalance.amount),
                    ExpensesLastYearYearly: ExpensesLastYear.map(p => p.total.amount),
                    ProfitLossLastYear,
                    ProfitLossLastYearMonthly: ProfitLossLastYear.monthlyBalances,
                    ProfitLossLastYearYearly: ProfitLossLastYear.yearlyBalances,
                    NetworthLastYear,
                    NetworthLastYearMonthly: NetworthLastYear.monthlyBalances,
                    NetworthLastYearYearly: NetworthLastYear.yearlyBalances,
                }
            });
        }
        case HOME.COMPARISION_CHART.GET_NETWORTH_CHART_DATA_ACTIVE_YEAR_RESPONSE: {
            let data = action.payload as IComparisionChartResponse;
            let NetworthActiveYear = (data.refresh || (state.comparisionChart && state.comparisionChart.NetworthActiveYear && (state.comparisionChart.NetworthActiveYear.monthlyBalances.length === 0))) ? processDataForNetworth(data.NetworthActiveYear) : _.cloneDeep(state.comparisionChart.NetworthActiveYear);
            return Object.assign({}, state, {
                networth_comparisionChart: {
                    ...state.networth_comparisionChart,
                    NetworthActiveYear,
                    NetworthActiveYearMonthly: NetworthActiveYear.monthlyBalances,
                    NetworthActiveYearYearly: NetworthActiveYear.yearlyBalances,
                }
            });
        }
        case HOME.COMPARISION_CHART.GET_NETWORTH_CHART_DATA_LAST_YEAR_RESPONSE: {
            let data = action.payload as IComparisionChartResponse;
            let revenueLastYear = (data.refresh || (state.comparisionChart && state.comparisionChart.revenueLastYear && (state.comparisionChart.revenueLastYear.length === 0))) ? processDataForGroupHistory(data.revenueLastYear) : _.cloneDeep(state.comparisionChart.revenueLastYear);
            let ExpensesLastYear = (data.refresh || (state.comparisionChart && state.comparisionChart.ExpensesLastYear && (state.comparisionChart.ExpensesLastYear.length === 0))) ? processDataForGroupHistory(data.ExpensesLastYear) : _.cloneDeep(state.comparisionChart.ExpensesLastYear);
            let NetworthLastYear = processDataForNetworth(data.NetworthLastYear);
            return Object.assign({}, state, {
                networth_comparisionChart: {
                    ...state.networth_comparisionChart,
                    NetworthLastYear,
                    NetworthLastYearMonthly: NetworthLastYear.monthlyBalances,
                    NetworthLastYearYearly: NetworthLastYear.yearlyBalances,
                }
            });
        }

        // End COMPARISSION CHART API
        // Bank API
        case HOME.BANK_ACCOUNTS.GET_BANK_ACCOUNTS: {
            return Object.assign({}, state, { isGetBankAccountsInProcess: true, });
        }
        case HOME.BANK_ACCOUNTS.GET_BANK_ACCOUNTS_RESPONSE: {
            let bankresponse: BaseResponse<BankAccountsResponse[], string> = action.payload;
            if (bankresponse.status === 'success') {
                return Object.assign({}, state, { isGetBankAccountsInProcess: false, BankAccounts: bankresponse.body, getBankAccountError: bankresponse.body.length === 0 ? 'No data Available' : null });
            }
            return Object.assign({}, state, { isGetBankAccountsInProcess: false, getBankAccountError: bankresponse.message });
        }
        case HOME.BANK_ACCOUNTS.RECONNECT_BANK_ACCOUNT: {
            return Object.assign({}, state, { isReConnectBankAccount: true });
        }
        case HOME.BANK_ACCOUNTS.RECONNECT_BANK_ACCOUNT_RESPONSE: {
            let reconnectResponse: BaseResponse<RefreshBankAccountResponse, string> = action.payload;
            if (reconnectResponse.status === 'success') {
                return Object.assign({}, state, { isReConnectBankAccount: false, ReConnectBankAccount: reconnectResponse.body });
            }
            return Object.assign({}, state, { isReConnectBankAccount: false });
        }
        case HOME.BANK_ACCOUNTS.REFRESH_BANK_ACCOUNT: {
            return Object.assign({}, state, { isRefereshBankAccount: true });
        }
        case HOME.BANK_ACCOUNTS.REFRESH_BANK_ACCOUNT_RESPONSE: {
            let refereshResponse: BaseResponse<RefreshBankAccountResponse, string> = action.payload;
            if (refereshResponse.status === 'success') {
                return Object.assign({}, state, { isRefereshBankAccount: false, RefereshBankAccount: refereshResponse.body });
            }
            return Object.assign({}, state, { isRefereshBankAccount: false });
        }
        case HOME.BANK_ACCOUNTS.RESET_RECONNECT_BANK_ACCOUNT: {
            return Object.assign({}, state, { isReConnectBankAccount: false, ReConnectBankAccount: null });
        }
        case HOME.BANK_ACCOUNTS.RESET_REFRESH_BANK_ACCOUNT_RESPONSE: {
            return Object.assign({}, state, { isRefereshBankAccount: false, RefereshBankAccount: null });
        }
        case HOME.RESET_HOME_STATE: {
            return initialState;
        }
        // End Bank API
        // case HOME.NETWORTH_CHART.GET_NETWORTH_CHART_DATA_ACTIVE_YEAR_RESPONSE: {
        //   let data = action.payload as IComparisionChartResponse;
        //   let NetworthActiveYear = processDataForNetworth(data.NetworthActiveYear);
        //   return Object.assign({}, state, {
        //     comparisionChart: {
        //       ...state.comparisionChart,
        //       NetworthActiveYear,
        //       NetworthActiveYearMonthly: NetworthActiveYear.monthlyBalances,
        //       NetworthActiveYearYearly: NetworthActiveYear.yearlyBalances,
        //     }
        //   });
        // }
        case HOME.GET_RATIO_ANALYSIS_RESPONSE: {
            let rationAnalysisRes: BaseResponse<any, string> = action.payload;
            if (rationAnalysisRes.status === 'success') {
                return Object.assign({}, state, { RatioAnalysis: rationAnalysisRes.body });
            }
            return Object.assign({}, state, { RatioAnalysis: null });
        }

        case HOME.TOTAL_OVERDUES.GET_TOTALOVER_DUES_RESPONSE: {
            let overduesRes: any[] = action.payload;
            if (overduesRes && overduesRes.length) {
                return Object.assign({}, state, { totalOverDues: overduesRes });
            }
            return Object.assign({}, state, { totalOverDues: null });
        }

        case HOME.GET_REVENUE_GRAPH_TYPES_RESPONSE: {
            let revenueGraphTypes: BaseResponse<GraphTypesResponse, string> = action.payload;
            if (revenueGraphTypes.status === 'success') {
                return Object.assign({}, state, { revenueGraphTypes: revenueGraphTypes.body });
            }
            return Object.assign({}, state, { revenueGraphTypes: null });
        }

        case HOME.GET_REVENUE_GRAPH_DATA_RESPONSE: {
            let revenueGraphData: BaseResponse<RevenueGraphDataResponse, string> = action.payload;
            if (revenueGraphData.status === 'success') {
                return Object.assign({}, state, { revenueGraphData: revenueGraphData.body });
            }
            return Object.assign({}, state, { revenueGraphData: null });
        }

        case HOME.RESET_REVENUE_GRAPH_DATA_RESPONSE: {
            return Object.assign({}, state, { revenueGraphData: null });
        }

        default: {
            return state;
        }
    }
}

const monthArray = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
const processDataForGroupHistory = (result: IGroupHistoryGroups[]) => {
    let categoryWise = _.groupBy(result, p => p.category);
    let addInThis = [];
    _.each(categoryWise, groups => {
        let category;
        let duration;
        let interval;
        category = groups[0].category;
        duration = '';
        interval = _.toArray(_.groupBy(_.flatten(_.map(groups, p => p.intervalBalances)), 'to'));
        return _.each(interval, group => {
            let closingBalance;
            let intB;
            let month;
            let monthNum;
            let total;
            let year;
            closingBalance = {};
            closingBalance.amount = 0;
            closingBalance.type = 'DEBIT';
            total = {};
            total.amount = 0;
            total.type = 'DEBIT';
            duration = '';
            year = moment().get('y');
            month = '';
            monthNum = 0;
            _.each(group, (grp: any) => {
                let sum;
                duration = monthArray[moment(grp.to, 'YYYY-MM-DD').get('months')] + moment(grp.to, 'YYYY-MM-DD').get('years');
                month = monthArray[moment(grp.to, 'YYYY-MM-DD').get('months')];
                monthNum = moment(grp.to, 'YYYY-MM-DD').get('months') + 1;
                year = moment(grp.to, 'YYYY-MM-DD').get('years');
                if (category === 'income') {
                    total.amount = total.amount + (grp.creditTotal - grp.debitTotal);
                } else {
                    sum = grp.debitTotal - grp.creditTotal;
                    total.amount = total.amount + sum;
                }
                if (category === 'income') {
                    if (grp.closingBalance.type === 'DEBIT') {
                        closingBalance.amount = closingBalance.amount - grp.closingBalance.amount;
                    } else {
                        closingBalance.amount = closingBalance.amount + grp.closingBalance.amount;
                    }
                } else {
                    if (grp.closingBalance.type === 'DEBIT') {
                        closingBalance.amount = closingBalance.amount + grp.closingBalance.amount;
                    } else {
                        closingBalance.amount = closingBalance.amount - grp.closingBalance.amount;
                    }
                }
                if (closingBalance.amount < 0) {
                    closingBalance.type = 'CREDIT';
                } else {
                    closingBalance.type = 'DEBIT';
                }
                if (total.amount < 0) {
                    return total.type = 'CREDIT';
                } else {
                    return total.type = 'DEBIT';
                }
            });
            intB = {};
            intB.closingBalance = closingBalance;
            intB.duration = duration;
            intB.year = year;
            intB.month = month;
            intB.monthNum = monthNum;
            intB.category = category;
            intB.total = total;
            return addInThis.push(intB);
        });
    });
    return addInThis;
};
const processDataForProfitLoss = plData => {
    let monthlyBalances;
    let yearlyBalances;
    let nwSeries = [];
    let nwLabels = [];
    monthlyBalances = [];
    yearlyBalances = [];
    if (plData && plData.profitLoss) {
        _.each(plData.profitLoss.periodBalances, (nw: any) => {
            let str;
            str = monthArray[moment(nw.to, 'DD-MM-YYYY').get('months')] + moment(nw.to, 'DD-MM-YYYY').get('y');
            nwLabels.push(str);
            monthlyBalances.push(nw.monthlyBalance);
            nwSeries.push('Monthly Balances');
            yearlyBalances.push(nw.yearlyBalance);
            nwSeries.push('Yearly Balances');
        });
    }
    return { monthlyBalances, yearlyBalances };
};

const processDataForNetworth = plData => {
    let monthlyBalances;
    let yearlyBalances;
    let nwSeries = [];
    let nwLabels = [];
    monthlyBalances = [];
    yearlyBalances = [];
    if (plData && plData.networth) {
        _.each(plData.networth.periodBalances, (nw: any) => {
            let str;
            str = monthArray[moment(nw.to, 'DD-MM-YYYY').get('months')] + moment(nw.to, 'DD-MM-YYYY').get('y');
            nwLabels.push(str);
            monthlyBalances.push(nw.monthlyBalance);
            nwSeries.push('Monthly Balances');
            yearlyBalances.push(nw.yearlyBalance);
            nwSeries.push('Yearly Balances');
        });
    }
    return { monthlyBalances, yearlyBalances };
};
