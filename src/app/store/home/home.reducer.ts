import { HOME } from '../../services/actions/home/home.const';
import { Action } from '@ngrx/store';
import {
  IExpensesChartClosingBalanceResponse,
  IRevenueChartClosingBalanceResponse
} from '../../models/interfaces/dashboard.interface';

export interface HomeState {
  value?: string;
  expensesChart?: IExpensesChartClosingBalanceResponse;
  revenueChart?: IRevenueChartClosingBalanceResponse;
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

    default: {
      return state;
    }
  }
}
