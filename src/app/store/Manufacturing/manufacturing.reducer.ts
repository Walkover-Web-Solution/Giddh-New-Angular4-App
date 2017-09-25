import { Action } from '@ngrx/store';
import { IManufacturingUnqItemObj, ICommonResponseOfManufactureItem, IManufacturingItemRequest } from '../../../models/interfaces/manufacturing.interface';
import { MANUFACTURING_ACTIONS } from '../../services/actions/manufacturing/manufacturing.const';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import * as _ from 'lodash';
import { StocksResponse, StockDetailResponse } from '../../models/api-models/Inventory';
import { IMfStockSearchRequest, ManufacturingItemRequest } from '../../models/interfaces/manufacturing.interface';
import { IStocksItem } from '../../models/interfaces/stocksItem.interface';

export interface ManufacturingState {
    reportData: StocksResponse;
    stockWithRate: StockDetailResponse;
    stockToUpdate: string;
}

export const initialState: ManufacturingState = {
    reportData: null,
    stockWithRate: null,
    stockToUpdate: null
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
                let response = _.cloneDeep(res.body);
                response.results = _.orderBy(res.body.results, [ (o) => o.voucherNumber ], 'desc');
                newState.reportData = response;
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case MANUFACTURING_ACTIONS.GET_STOCK_WITH_RATE: {
            return state;
        }
        case MANUFACTURING_ACTIONS.GET_STOCK_WITH_RATE_RESPONSE: {
            let newState = _.cloneDeep(state);
            let res: BaseResponse<StockDetailResponse, IMfStockSearchRequest> = action.payload;
            if (res.status === 'success') {
                newState.stockWithRate = res.body;
                return Object.assign({}, state, newState);
            } else {
                newState.stockWithRate = null;
                return Object.assign({}, state, newState);
            }
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
            let newState = _.cloneDeep(state);
            let res: BaseResponse<IStocksItem, ManufacturingItemRequest> = action.payload;
            if (res.status === 'success') {
                if (newState.reportData && newState.reportData.results) {
                    newState.reportData.results.push(res.body);
                    return Object.assign({}, state, newState);
                }
            }
            return state;
        }
        case MANUFACTURING_ACTIONS.UPDATE_MF_ITEM: {
            return state;
        }
        case MANUFACTURING_ACTIONS.UPDATE_MF_ITEM_RESPONSE: {
            let newState = _.cloneDeep(state);
            let res: BaseResponse<IStocksItem, ManufacturingItemRequest> = action.payload;
            if (res.status === 'success') {
                // let indx = newState.reportData.results.findIndex((obj) => obj.uniqueName === res.body.uniqueName);
                // if (indx > -1) {
                //     newState.reportData.results[indx] = res.body;
                // }
                newState.reportData = null;
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case MANUFACTURING_ACTIONS.DELETE_MF_ITEM: {
            return state;
        }
        case MANUFACTURING_ACTIONS.DELETE_MF_ITEM_RESPONSE: {
            let res: BaseResponse<any, any> = action.payload;
            if (res.status === 'success') {
                let newState = _.cloneDeep(state);
                let indx = newState.reportData.results.findIndex((MFitem) => MFitem.uniqueName === res.queryString.model.manufacturingUniqueName);
                if (indx > -1) {
                    newState.reportData.results.splice(indx, 1);
                }
                newState.stockToUpdate = null;
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case MANUFACTURING_ACTIONS.SET_MF_ITEM_UNIQUENAME_IN_STORE: {
            if (action.payload) {
                let newState = _.cloneDeep(state);
                newState.stockToUpdate = action.payload;
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case MANUFACTURING_ACTIONS.REMOVE_MF_ITEM_UNIQUENAME_FROM_STORE: {
            let newState = _.cloneDeep(state);
            newState.stockToUpdate = null;
            return Object.assign({}, state, newState);
        }
        default:
        {
            return state;
        }
    }
}
