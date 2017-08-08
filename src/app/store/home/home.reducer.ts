import { BaseResponse } from '../../models/api-models/BaseResponse';
import { HOME } from '../../services/actions/home/home.const';
import { Action } from '@ngrx/store';
import {
  IComparisionChartResponse,
  IExpensesChartClosingBalanceResponse,
  IGroupHistoryGroups,
  IRevenueChartClosingBalanceResponse
} from '../../models/interfaces/dashboard.interface';
import moment from 'moment';
import * as _ from 'lodash';
import { RefreshBankAccountResponse, BankAccountsResponse } from '../../models/api-models/Dashboard';

export interface HomeState {
  value?: string;
  expensesChart?: IExpensesChartClosingBalanceResponse;
  revenueChart?: IRevenueChartClosingBalanceResponse;
  comparisionChart?: IComparisionChartResponse;
  isExpensesChartDataInProcess: boolean;
  isExpensesChartDataAvailable: boolean;
  isRevenueChartDataInProcess: boolean;
  isRevenueChartDataAvailable: boolean;
  isGetBankAccountsInProcess: boolean;
  BankAccounts?: BankAccountsResponse[];
  isRefereshBankAccount: boolean;
  RefereshBankAccount?: RefreshBankAccountResponse;
  isReConnectBankAccount: boolean;
  ReConnectBankAccount?: RefreshBankAccountResponse;
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
  isReConnectBankAccount: false
};

export function homeReducer(state = initialState, action: Action): HomeState {
  switch (action.type) {
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
    case HOME.BANK_ACCOUNTS.GET_BANK_ACCOUNTS: {
      return Object.assign({}, state, { isGetBankAccountsInProcess: true });
    }
    case HOME.BANK_ACCOUNTS.GET_BANK_ACCOUNTS_RESPONSE: {
      let bankresponse: BaseResponse<BankAccountsResponse[], string> = action.payload;
      if (bankresponse.status === 'success') {
        return Object.assign({}, state, { isGetBankAccountsInProcess: false, BankAccounts: bankresponse.body });
      }
      return Object.assign({}, state, { isGetBankAccountsInProcess: false });
    }
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
    case HOME.COMPARISION_CHART.GET_COMPARISION_CHART_DATA_ACTIVE_YEAR_RESPONSE: {
      let data = action.payload as IComparisionChartResponse;
      let revenueActiveYear = processDataForGroupHistory(data.revenueActiveYear);
      let ExpensesActiveYear = processDataForGroupHistory(data.ExpensesActiveYear);
      let ProfitLossActiveYear = processDataForProfitLoss(data.ProfitLossActiveYear);
      let NetworthActiveYear = processDataForNetworth(data.NetworthActiveYear);
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
      let revenueLastYear = processDataForGroupHistory(data.revenueLastYear);
      let ExpensesLastYear = processDataForGroupHistory(data.ExpensesLastYear);
      let ProfitLossLastYear = processDataForProfitLoss(data.ProfitLossLastYear);
      let NetworthLastYear = processDataForNetworth(data.NetworthLastYear);
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
    case HOME.NETWORTH_CHART.GET_NETWORTH_CHART_DATA_ACTIVE_YEAR_RESPONSE: {
      let data = action.payload as IComparisionChartResponse;
      let NetworthActiveYear = processDataForNetworth(data.NetworthActiveYear);
      return Object.assign({}, state, {
        comparisionChart: {
          NetworthActiveYear,
          NetworthActiveYearMonthly: NetworthActiveYear.monthlyBalances,
          NetworthActiveYearYearly: NetworthActiveYear.yearlyBalances,
        }
      });
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
      _.each(group, grp => {
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
  if (plData.profitLoss) {
    _.each(plData.profitLoss.periodBalances, nw => {
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
  if (plData.networth) {
    _.each(plData.networth.periodBalances, nw => {
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
