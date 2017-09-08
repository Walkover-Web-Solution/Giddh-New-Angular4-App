import { Action } from '@ngrx/store';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import * as _ from 'lodash';
import { IInvoicePurchaseResponse } from '../../services/purchase-invoice.service';
import { PURCHASE_INVOICE_ACTIONS } from '../../services/actions/purchase-invoice/purchase-invoice.const';

export interface InvoicePurchaseState {
    purchaseInvoices: IInvoicePurchaseResponse[];
}

export const initialState: InvoicePurchaseState = {
    purchaseInvoices: []
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
        default:
        {
            return state;
        }
    }
}
