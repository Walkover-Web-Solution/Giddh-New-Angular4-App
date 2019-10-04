import { CustomActions } from '../customActions';
import { COMMON_ACTIONS } from '../../actions/common.const';
import { PettyCashReportResponse } from '../../models/api-models/Expences';
import { ExpencesAction } from '../../actions/expences/expence.action';
import { BaseResponse } from '../../models/api-models/BaseResponse';

export interface ExpensePettyCash {
  pettycashReport?: PettyCashReportResponse;
  pettycashRejectedReport?: PettyCashReportResponse;
  showLoader: boolean;
  getPettycashReportInprocess: boolean;
  getPettycashReportSuccess: boolean;
  noData: boolean;
}

export const initialState: ExpensePettyCash = {
  pettycashReport: null,
  pettycashRejectedReport: null,
  noData: true,
  getPettycashReportInprocess: false,
  getPettycashReportSuccess: false,
  showLoader: false
};

export function expensesReducer(state = initialState, action: CustomActions): ExpensePettyCash {
  switch (action.type) {
    case COMMON_ACTIONS.RESET_APPLICATION_DATA: {
      return Object.assign({}, state, initialState);
    }

    case ExpencesAction.GET_PETTYCASH_REPORT_REQUEST: {
      return { ...state, getPettycashReportInprocess: true, getPettycashReportSuccess: false };
    }
    case ExpencesAction.GET_PETTYCASH_REPORT_RESPONSE: {
      let res: BaseResponse<any, string> = action.payload;
      if (res.status === 'success') {
        if (action.payload.request.status === 'rejected') {
          return {
            ...state, pettycashRejectedReport: res.body,
            getPettycashReportInprocess: false,
            getPettycashReportSuccess: true,
          };
        } else {
          return {
            ...state, pettycashReport: res.body,
            getPettycashReportInprocess: false,
            getPettycashReportSuccess: true,
          };
        }

      } else {
        return {
          ...state,
          getPettycashReportInprocess: false,
          getPettycashReportSuccess: false,
        }
      }

    }

    default: {
      return state;
    }
  }
}
