import { Action } from '@ngrx/store';
import { CustomActions } from '../customActions';
import { DayBookResponseModel } from 'app/models/api-models/Daybook';
import { DaybookActions } from 'app/actions/daybook/daybook.actions';
import { DayBookRequestModel, Inventory } from 'app/models/api-models/DaybookRequest';

export interface Daybook {
  data?: DayBookResponseModel;
  showLoader: boolean;
  noData: boolean;
}

export const initialState: Daybook = {
  data: null,
  noData: true,
  showLoader: false
};

export function daybookReducer(state = initialState, action: CustomActions): Daybook {
  switch (action.type) {
    case DaybookActions.GET_DAYBOOK_RESPONSE: {
      // no payload means error from server
      if (action.payload) {
        let data: DayBookResponseModel = _.cloneDeep(action.payload) as DayBookResponseModel;
        // data.groupDetails = removeZeroAmountAccount((data.groupDetails));
        let noData = false;
        let showLoader = false;
        if (data.entries.length < 1) {
          noData = true;
        }
        return { ...state, data, noData, showLoader };
      } else {
        return { ...state, showLoader: false, data: null, noData: true };
      }
    }
    case DaybookActions.GET_DAYBOOK_REQUEST: {
      return { ...state, showLoader: true };
    }
    default: {
      return state;
    }
  }
}
