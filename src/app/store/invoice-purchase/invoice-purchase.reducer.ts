import { Action } from '@ngrx/store';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import * as _ from 'lodash';
import { IInvoicePurchaseResponse, ITaxResponse } from '../../services/purchase-invoice.service';
import { PURCHASE_INVOICE_ACTIONS } from '../../services/actions/purchase-invoice/purchase-invoice.const';

export interface InvoicePurchaseState {
    purchaseInvoices: IInvoicePurchaseResponse[];
    taxes: ITaxResponse[];
    isDownloadingFile: boolean;
}

export const initialState: InvoicePurchaseState = {
    purchaseInvoices: [],
    taxes: [],
    isDownloadingFile: false
};

export function InvoicePurchaseReducer(state = initialState, action: Action): InvoicePurchaseState {
    switch (action.type) {
        case PURCHASE_INVOICE_ACTIONS.GET_PURCHASE_INVOICES_RESPONSE:
        {
            let response: BaseResponse<IInvoicePurchaseResponse[], string> = action.payload;
            if (response.status === 'success') {
              let newState = _.cloneDeep(state);
              newState.purchaseInvoices =  response.body;
              return Object.assign({}, state, newState);
            }
            return state;
        }
        case PURCHASE_INVOICE_ACTIONS.SET_TAXES_FOR_COMPANY:
        {
            let response: BaseResponse<ITaxResponse[], string> = action.payload;
            if (response.status === 'success') {
              let newState = _.cloneDeep(state);
              newState.taxes =  response.body;
              return Object.assign({}, state, newState);
            }
            return state;
        }
        case PURCHASE_INVOICE_ACTIONS.UPDATE_PURCHASE_INVOICE_RESPONSE:
        {
            let response: BaseResponse<IInvoicePurchaseResponse[], string> = action.payload;
            if (response.status === 'success') {
              let newState = _.cloneDeep(state);
              newState.purchaseInvoices =  [];
              return Object.assign({}, state, newState);
            }
            return state;
        }
        case PURCHASE_INVOICE_ACTIONS.DOWNLOAD_GSTR1_SHEET:
        {
            let newState = _.cloneDeep(state);
            newState.isDownloadingFile = true;
            return Object.assign({}, state, newState);
        }
        case PURCHASE_INVOICE_ACTIONS.DOWNLOAD_GSTR1_SHEET_RESPONSE:
        {
            let newState = _.cloneDeep(state);
            newState.isDownloadingFile = false;
            return Object.assign({}, state, newState);
        }
        case PURCHASE_INVOICE_ACTIONS.DOWNLOAD_GSTR1_ERROR_SHEET:
        {
            let newState = _.cloneDeep(state);
            newState.isDownloadingFile = true;
            return Object.assign({}, state, newState);
        }
        case PURCHASE_INVOICE_ACTIONS.DOWNLOAD_GSTR1_ERROR_SHEET_RESPONSE:
        {
            let newState = _.cloneDeep(state);
            newState.isDownloadingFile = false;
            return Object.assign({}, state, newState);
        }
        default:
        {
            return state;
        }
    }
}
