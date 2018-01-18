import { Action } from '@ngrx/store';
import { ICommonResponseOfManufactureItem, IManufacturingItemRequest, IManufacturingUnqItemObj } from '../../../models/interfaces/manufacturing.interface';
import { MANUFACTURING_ACTIONS } from '../../actions/manufacturing/manufacturing.const';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import * as _ from '../../lodash-optimized';
import { StockDetailResponse, StocksResponse } from '../../models/api-models/Inventory';
import { IMfStockSearchRequest, ManufacturingItemRequest } from '../../models/interfaces/manufacturing.interface';
import { IStocksItem } from '../../models/interfaces/stocksItem.interface';
import { CustomActions } from '../customActions';

export interface ManufacturingState {
    reportData: StocksResponse;
    stockWithRate: StockDetailResponse;
    stockToUpdate: string;
    isMFReportLoading: boolean;
}

export const initialState: ManufacturingState = {
    reportData: null,
    stockWithRate: null,
    stockToUpdate: null,
    isMFReportLoading: false
};

export function ManufacturingReducer(state = initialState, action: CustomActions): ManufacturingState {
    switch (action.type) {
        case MANUFACTURING_ACTIONS.MF_REPORT: {
            let newState = _.cloneDeep(state);
            newState.isMFReportLoading = true;
            return Object.assign({}, state, newState);
        }
        case MANUFACTURING_ACTIONS.MF_REPORT_RESPONSE: {
            let newState = _.cloneDeep(state);
            let res: BaseResponse<StocksResponse, IMfStockSearchRequest> = action.payload;
            if (res.status === 'success') {
                let response = _.cloneDeep(res.body);
                response.results = _.orderBy(res.body.results, [ (o) => o.voucherNumber ], 'desc');
                newState.reportData = response;
                newState.isMFReportLoading = false;
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
                let indx = newState.reportData.results.findIndex((obj) => obj.uniqueName === res.body.uniqueName);
                if (indx > -1) {
                    newState.reportData.results[indx] = res.body;
                }
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
