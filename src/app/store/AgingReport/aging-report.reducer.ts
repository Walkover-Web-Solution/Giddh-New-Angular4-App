import { LogsRequest, LogsResponse } from '../../models/api-models/Logs';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { ILogsItem } from '../../models/interfaces/logs.interface';
import { Action } from '@ngrx/store';
import * as _ from '../../lodash-optimized';
import { AUDIT_LOGS_ACTIONS } from '../../actions/audit-logs/audit-logs.const';
import { CustomActions } from '../customActions';
import { COMMON_ACTIONS } from '../../actions/common.const';
import { AgingDropDownoptions, Result, DueRangeRequest } from '../../models/api-models/Contact';
import { AgingReportActions } from '../../actions/aging-report.actions';

export interface AgingReportState {
  setDueRangeRequestInFlight: boolean;
  setDueRangeOpen: boolean;
  agingDropDownoptions: AgingDropDownoptions;
  getAgingReportRequestInFlight: boolean;
  page: number;
  count: number;
  totalPages: number;
  totalItems: number;
  results: Result[];
  size: number;
}

export const initialState: AgingReportState = {
  setDueRangeRequestInFlight: false,
  setDueRangeOpen: false,
  agingDropDownoptions: {
    fourth: 40,
    fifth: 80,
    sixth: 120
  },
  getAgingReportRequestInFlight: false,
  page: 1,
  count: 20,
  totalPages: 0,
  totalItems: 0,
  results: [],
  size: 0,
};

export function agingReportReducer(state = initialState, action: CustomActions): AgingReportState {
  // let data: BaseResponse<LogsResponse, LogsRequest> = null;
  let newState: AgingReportState = null;
  switch (action.type) {
    case AgingReportActions.CREATE_DUE_DAY_RANGE: {
      return Object.assign({}, state, { setDueRangeRequestInFlight: true });
    }
    case AgingReportActions.DUE_DAY_RANGE_POPUP_OPEN: {
      return Object.assign({}, state, { setDueRangeOpen: true });
    }
    case AgingReportActions.DUE_DAY_RANGE_POPUP_CLOSE: {
      return Object.assign({}, state, { setDueRangeOpen: false });
    }
    case AgingReportActions.CREATE_DUE_DAY_RANGE_RESPONSE: {
      let data = action.payload as BaseResponse<string, DueRangeRequest>;
      if (data.status === 'error') {
        return Object.assign({}, state, { setDueRangeRequestInFlight: false });
      }
      let agingDropDownoptions: AgingDropDownoptions = {
        fourth: parseInt(data.request.range[0]),
        fifth: parseInt(data.request.range[1]),
        sixth: parseInt(data.request.range[2])
      };
      return Object.assign({}, state, { setDueRangeRequestInFlight: false, setDueRangeOpen: false, agingDropDownoptions });

    }
    default: {
      return state;
    }
  }
}
