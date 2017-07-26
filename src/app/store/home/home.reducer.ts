import { HOME } from '../../services/actions/home/home.const';
import { Action } from '@ngrx/store';
import { ClosingBalanceResponse } from '../../models/api-models/Dashboard';
import { IExpensesChartClosingBalanceResponse } from '../../models/interfaces/dashboard.interface';

export interface HomeState {
  value?: string;
  expensesChart?: IExpensesChartClosingBalanceResponse;
}

export const initialState: HomeState = {
  expensesChart: null
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

    default: {
      return state;
    }
  }
}
