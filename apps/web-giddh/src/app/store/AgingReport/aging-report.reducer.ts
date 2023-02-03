import { BaseResponse } from '../../models/api-models/BaseResponse';
import { CustomActions } from '../customActions';
import { AgingDropDownoptions, DueAmountReportRequest, DueAmountReportResponse, DueRangeRequest } from '../../models/api-models/Contact';
import { AgingReportActions } from '../../actions/aging-report.actions';

export interface AgingReportState {
    setDueRangeRequestInFlight: boolean;
    setDueRangeOpen: boolean;
    agingDropDownoptions: AgingDropDownoptions;
    getAgingReportRequestInFlight: boolean;
    data?: DueAmountReportResponse;
    dueAmountReportRequest: DueAmountReportRequest;
    noData: boolean;
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
    data: null,
    dueAmountReportRequest: {
        totalDueAmountGreaterThan: false,
        totalDueAmountLessThan: false,
        totalDueAmountEqualTo: false,
        totalDueAmount: 0,
        includeTotalDueAmount: false,
        name: [],
    },
    noData: true
};

export function agingReportReducer(state = initialState, action: CustomActions): AgingReportState {
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

            if (data?.status === 'error') {
                return Object.assign({}, state, { setDueRangeRequestInFlight: false });
            }
            let agingDropDownoptions: AgingDropDownoptions = {
                fourth: parseInt(data.request.range[0]),
                fifth: parseInt(data.request.range[1]),
                sixth: parseInt(data.request.range[2])
            };
            return Object.assign({}, state, { setDueRangeRequestInFlight: false, setDueRangeOpen: false, agingDropDownoptions });

        }
        case AgingReportActions.GET_DUE_DAY_RANGE_RESPONSE: {
            let data = action.payload as BaseResponse<string[], string>;
            if (data?.status === 'error') {
                return state;
            }
            let agingDropDownoptions: AgingDropDownoptions = {
                fourth: parseInt(data.body[0]),
                fifth: parseInt(data.body[1]),
                sixth: parseInt(data.body[2])
            };
            return Object.assign({}, state, { agingDropDownoptions });

        }
        case AgingReportActions.GET_DUE_DAY_REPORT_RESPONSE: {
            // no payload means error from server
            if (action.payload) {
                let data: DueAmountReportResponse = _.cloneDeep(action.payload) as DueAmountReportResponse;
                let noData = false;
                let getAgingReportRequestInFlight = false;
                if (data.results?.length < 1) {
                    noData = true;
                }
                return { ...state, getAgingReportRequestInFlight, data, noData };
            } else {
                return { ...state, getAgingReportRequestInFlight: false, data: null, noData: true };
            }
        }
        case AgingReportActions.GET_DUE_DAY_REPORT: {
            return { ...state, getAgingReportRequestInFlight: true };
        }
        default: {
            return state;
        }
    }
}
