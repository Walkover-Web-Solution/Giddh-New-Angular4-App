import { CarriedOverSalesResponse } from '../../models/api-models/carried-over-sales';
import { CustomActions } from '../customActions';
import { CarriedOverSalesActions } from '../../actions/carried-over-sales.actions';
import { DaybookActions } from '../../actions/daybook/daybook.actions';

export interface CarriedOverSalesState {
  data?: CarriedOverSalesResponse;
  showLoader: boolean;
  noData: boolean;
}

export const initialState: CarriedOverSalesState = {
  data: null,
  noData: true,
  showLoader: false
};

export function carriedOverSalesReduce(state = initialState, action: CustomActions) {
  switch (action.type) {
    case CarriedOverSalesActions.GET_CARRIED_SALES_RESPONSE: {
      if (action.payload) {
        let data: CarriedOverSalesResponse = _.cloneDeep(action.payload) as CarriedOverSalesResponse;
        let noData = false;
        let showLoader = false;
        if (data && data.totalSales.length < 1 && data.newSales.length < 1 && data.carriedSales.length < 1) {
          noData = true;
        }
        return {...state, data, noData, showLoader};
      } else {
        return {...state, showLoader: false, data: null, noData: true};
      }
    }
    case CarriedOverSalesActions.GET_CARRIED_SALES_REQUEST: {
      return {...state, showLoader: true};
    }
    default: {
      return state;
    }
  }
}
