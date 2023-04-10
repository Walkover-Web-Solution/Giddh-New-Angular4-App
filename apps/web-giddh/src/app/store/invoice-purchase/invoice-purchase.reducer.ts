import { BaseResponse } from '../../models/api-models/BaseResponse';
import { ITaxResponse } from '../../services/purchase-invoice.service';
import { PURCHASE_INVOICE_ACTIONS } from '../../actions/purchase-invoice/purchase-invoice.const';
import { CustomActions } from '../custom-actions';
import { cloneDeep } from '../../lodash-optimized';

export interface InvoicePurchaseState {
    taxes: ITaxResponse[];
}

export const initialState: InvoicePurchaseState = {
    taxes: [],
};

export function InvoicePurchaseReducer(state = initialState, action: CustomActions): InvoicePurchaseState {
    switch (action.type) {
        case PURCHASE_INVOICE_ACTIONS.SET_TAXES_FOR_COMPANY: {
            let response: BaseResponse<ITaxResponse[], string> = action.payload;
            if (response?.status === 'success') {
                let newState = cloneDeep(state);
                newState.taxes = response.body;
                return Object.assign({}, state, newState);
            }
            return state;
        }

        default: {
            return state;
        }
    }
}
