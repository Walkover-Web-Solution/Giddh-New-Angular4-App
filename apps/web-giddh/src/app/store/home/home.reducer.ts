import { BaseResponse } from '../../models/api-models/BaseResponse';
import { HOME } from '../../actions/home/home.const';
import { GraphTypesResponse } from '../../models/api-models/Dashboard';
import { CustomActions } from '../customActions';
import { COMMON_ACTIONS } from '../../actions/common.const';

export interface HomeState {
    value?: string;
    RatioAnalysis?: any;
    revenueGraphTypes: any;
    revenueGraphData: any;
}

export const initialState: HomeState = {
    revenueGraphTypes: [],
    revenueGraphData: []
};

export function homeReducer(state = initialState, action: CustomActions): HomeState {
    switch (action.type) {
        case COMMON_ACTIONS.RESET_APPLICATION_DATA: {
            return Object.assign({}, state, initialState);
        }

        case HOME.RESET_HOME_STATE: {
            return initialState;
        }
        case HOME.GET_RATIO_ANALYSIS_RESPONSE: {
            let rationAnalysisRes: BaseResponse<any, string> = action.payload;
            if (rationAnalysisRes?.status === 'success') {
                return Object.assign({}, state, { RatioAnalysis: rationAnalysisRes.body });
            }
            return Object.assign({}, state, { RatioAnalysis: null });
        }

        case HOME.GET_REVENUE_GRAPH_TYPES_RESPONSE: {
            let revenueGraphTypes: BaseResponse<GraphTypesResponse, string> = action.payload;
            if (revenueGraphTypes?.status === 'success') {
                return Object.assign({}, state, { revenueGraphTypes: revenueGraphTypes.body });
            }
            return Object.assign({}, state, { revenueGraphTypes: null });
        }

        default: {
            return state;
        }
    }
}
