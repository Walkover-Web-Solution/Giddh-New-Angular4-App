import { Action } from '@ngrx/store';
import { IManufacturingUnqItemObj, ICommonResponseOfManufactureItem, IManufacturingItemRequest } from '../../../models/interfaces/manufacturing.interface';
import { MANUFACTURING_ACTIONS } from '../../services/actions/manufacturing/manufacturing.const';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import * as _ from 'lodash';

export interface ManufacturingState {
    someKey: object;
}

export const initialState: ManufacturingState = {
    someKey: {}
};

export function ManufacturingReducer(state = initialState, action: Action): ManufacturingState {
    switch (action.type) {
        case MANUFACTURING_ACTIONS.GET_STOCK_LIST: {
            return state;
        }
        case MANUFACTURING_ACTIONS.GET_STOCK_LIST_RESPONSE: {
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
