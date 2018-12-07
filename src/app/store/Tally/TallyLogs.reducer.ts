import { BaseResponse } from '../../models/api-models/BaseResponse';
import { CustomActions } from '../customActions';
import { TallyActions } from '../../actions/tally/tally.action';

export interface TallyLogsState {
  tallyLogs: any;
  oldTallyLogs: any;
  downloadFile: any;
}

const initialState = {
  tallyLogs: null,
  oldTallyLogs: null,
  downloadFile: null
};

export function TallyLogsReducer(state: TallyLogsState = initialState, action: CustomActions): TallyLogsState {
  switch (action.type) {
    case TallyActions.GetCurrentTallyLogsResponse: {
      let data: BaseResponse<any, string> = action.payload;
      if (data.status === 'success') {
        return{ ...state, tallyLogs: data.body };
      }
      return state;
    }
    case TallyActions.GetOldTallyLogsResponse: {
      let data: BaseResponse<any, string> = action.payload;
      if (data.status === 'success') {
        return{ ...state, oldTallyLogs: data.body };
      }
      return state;
    }
    case TallyActions.DownloadFileResponse: {
      let data: BaseResponse<any, string> = action.payload;
      if (data.status === 'success') {
        return{ ...state, downloadFile: data.body };
      }
      return state;
    }
    default:
      return state;
  }
}
