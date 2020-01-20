import { NewVsOldInvoicesResponse } from '../../models/api-models/new-vs-old-invoices';
import { CustomActions } from '../customActions';
import { NewVsOldInvoicesActions } from '../../actions/new-vs-old-invoices.actions';

export interface NewVsOldInvoiceState {
    data?: NewVsOldInvoicesResponse;
    showLoader: boolean;
    noData: boolean;
    requestInSuccess: boolean;
}

export const initialState: NewVsOldInvoiceState = {
    data: null,
    noData: true,
    showLoader: false,
    requestInSuccess: false
};

export function newVsOldInvoicesReduce(state = initialState, action: CustomActions) {
    switch (action.type) {
        case NewVsOldInvoicesActions.GET_NEW_VS_OLD_INVOICE_RESPONSE: {
            if (action.payload) {
                let data: NewVsOldInvoicesResponse = _.cloneDeep(action.payload) as NewVsOldInvoicesResponse;
                let noData = false;
                let showLoader = false;
                if (data && data.totalSales && data.newSales && data.carriedSales.length < 1) {
                    noData = true;
                }
                return { ...state, data, noData, showLoader, requestInSuccess: true };
            } else {
                return { ...state, showLoader: false, data: null, noData: true, requestInSuccess: true };
            }
        }
        case NewVsOldInvoicesActions.GET_NEW_VS_OLD_INVOICE_REQUEST: {
            return { ...state, showLoader: true, requestInSuccess: false };
        }
        case NewVsOldInvoicesActions.GET_NULL: {
            return { ...state, data: null, noData: true };
        }
        default: {
            return state;
        }
    }
}
