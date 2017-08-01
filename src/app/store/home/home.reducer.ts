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

export interface HomeState {
  value?: string;
  expensesChart?: IExpensesChartClosingBalanceResponse;
  revenueChart?: IRevenueChartClosingBalanceResponse;
  comparisionChart?: IComparisionChartResponse;
  isExpensesChartDataInProcess: boolean;
  isExpensesChartDataAvailable: boolean;
  isRevenueChartDataInProcess: boolean;
  isRevenueChartDataAvailable: boolean;
}

export const initialState: HomeState = {
  expensesChart: null,
  revenueChart: null,
  isExpensesChartDataInProcess: false,
  isExpensesChartDataAvailable: false,
  isRevenueChartDataInProcess: false,
  isRevenueChartDataAvailable: false,
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
        }
      });
    }
    case HOME.COMPARISION_CHART.GET_COMPARISION_CHART_DATA_LAST_YEAR_RESPONSE: {
      let data = action.payload as IComparisionChartResponse;
      let revenueLastYear = processDataForGroupHistory(data.revenueLastYear);
      let ExpensesLastYear = processDataForGroupHistory(data.ExpensesLastYear);
      let ProfitLossLastYear = processDataForProfitLoss(data.ProfitLossLastYear);
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
  _.each(plData.networth.periodBalances, nw => {
    let str;
    str = monthArray[moment(nw.to, 'DD-MM-YYYY').get('months')] + moment(nw.to, 'DD-MM-YYYY').get('y');
    nwLabels.push(str);
    monthlyBalances.push(nw.monthlyBalance);
    nwSeries.push('Monthly Balances');
    yearlyBalances.push(nw.yearlyBalance);
    nwSeries.push('Yearly Balances');
  });
  return { monthlyBalances, yearlyBalances };
};
