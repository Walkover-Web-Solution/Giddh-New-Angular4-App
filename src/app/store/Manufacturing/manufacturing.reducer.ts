import { Action } from '@ngrx/store';
import { IManufacturingUnqItemObj, ICommonResponseOfManufactureItem, IManufacturingItemRequest } from '../../../models/interfaces/manufacturing.interface';
import { MANUFACTURING_ACTIONS } from '../../services/actions/manufacturing/manufacturing.const';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import * as _ from 'lodash';
import { StocksResponse } from '../../models/api-models/Inventory';
import { IMfStockSearchRequest } from '../../models/interfaces/manufacturing.interface';

export interface ManufacturingState {
    reportData: StocksResponse;
}

export const initialState: ManufacturingState = {
    reportData: null
};

export function ManufacturingReducer(state = initialState, action: Action): ManufacturingState {
    switch (action.type) {
        case MANUFACTURING_ACTIONS.MF_REPORT: {
            return state;
        }
        case MANUFACTURING_ACTIONS.MF_REPORT_RESPONSE: {
            let newState = _.cloneDeep(state);
            let res: BaseResponse<StocksResponse, IMfStockSearchRequest> = action.payload;
            if (res.status === 'success') {
                newState.reportData = res.body;
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case MANUFACTURING_ACTIONS.GET_MF_ITEM_DETAILS: {
            return state;
        }
        case MANUFACTURING_ACTIONS.GET_MF_ITEM_DETAILS_RESPONSE: {
            return state;
        }
        case MANUFACTURING_ACTIONS.CREATE_MF_ITEM: {
            return state;
        }
        case MANUFACTURING_ACTIONS.CREATE_MF_ITEM_RESPONSE: {
            return state;
        }
        case MANUFACTURING_ACTIONS.UPDATE_MF_ITEM: {
            return state;
        }
        case MANUFACTURING_ACTIONS.UPDATE_MF_ITEM_RESPONSE: {
            return state;
        }
        case MANUFACTURING_ACTIONS.DELETE_MF_ITEM: {
            return state;
        }
        case MANUFACTURING_ACTIONS.DELETE_MF_ITEM_RESPONSE: {
            return state;
        }
        default:
        {
            return state;
        }
    }
}
