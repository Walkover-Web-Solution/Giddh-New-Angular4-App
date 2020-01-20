import { CustomActions } from '../customActions';
import { DayBookResponseModel } from 'apps/web-giddh/src/app/models/api-models/Daybook';
import { DaybookActions } from 'apps/web-giddh/src/app/actions/daybook/daybook.actions';
import { COMMON_ACTIONS } from '../../actions/common.const';

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
        case COMMON_ACTIONS.RESET_APPLICATION_DATA: {
            return Object.assign({}, state, initialState);
        }
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
