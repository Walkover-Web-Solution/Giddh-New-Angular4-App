import { CarriedOverSalesResponse } from '../../models/api-models/carried-over-sales';
import { CustomActions } from '../customActions';
import { CarriedOverSalesActions } from '../../actions/carried-over-sales.actions';

export interface CarriedOverSalesState {
  data?: CarriedOverSalesResponse;
  showLoader: boolean;
  noData: boolean;
  requestInSuccess: boolean;
}

export const initialState: CarriedOverSalesState = {
  data: null,
  noData: true,
  showLoader: false,
  requestInSuccess: false
};

export function carriedOverSalesReduce(state = initialState, action: CustomActions) {
  switch (action.type) {
    case CarriedOverSalesActions.GET_CARRIED_SALES_RESPONSE: {
      if (action.payload) {
        let data: CarriedOverSalesResponse = _.cloneDeep(action.payload) as CarriedOverSalesResponse;
        let noData = false;
        let showLoader = false;
        if (data && data.totalSales && data.newSales && data.carriedSales.length < 1) {
          noData = true;
        }
        return {...state, data, noData, showLoader, requestInSuccess: true};
      } else {
        return {...state, showLoader: false, data: null, noData: true, requestInSuccess: true};
      }
    }
    case CarriedOverSalesActions.GET_CARRIED_SALES_REQUEST: {
      return {...state, showLoader: true, requestInSuccess: false};
    }
    case CarriedOverSalesActions.GET_NULL: {
      return {...state, data: null, noData: true};
    }
    default: {
      return state;
    }
  }
}
