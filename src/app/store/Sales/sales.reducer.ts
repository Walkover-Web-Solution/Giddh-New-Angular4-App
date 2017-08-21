import { Action } from '@ngrx/store';
import * as _ from 'lodash';
import { SALES_ACTIONS } from '../../services/actions/sales/sales.const';

export interface SalesState {
  invObj: any;
}
const initialState = {
  invObj: null
};

export function salesReducer(state = initialState, action: Action): SalesState {
  switch (action.type) {
    case SALES_ACTIONS.GET : {
      return state;
    }
    default: {
      return state;
    }
  }
}
