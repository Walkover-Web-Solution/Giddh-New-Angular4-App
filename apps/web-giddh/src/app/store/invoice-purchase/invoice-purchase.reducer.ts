import { BaseResponse } from '../../models/api-models/BaseResponse';
import * as _ from '../../lodash-optimized';
import { IInvoicePurchaseItem, IInvoicePurchaseResponse, ITaxResponse } from '../../services/purchase-invoice.service';
import { GST_RETURN_ACTIONS, PURCHASE_INVOICE_ACTIONS } from '../../actions/purchase-invoice/purchase-invoice.const';
import { CustomActions } from '../customActions';

export interface InvoicePurchaseState {
    purchaseInvoices: IInvoicePurchaseResponse;
    taxes: ITaxResponse[];
    isDownloadingFile: boolean;
    invoiceGenerateSuccess: boolean;
    isTaxProOTPSentSuccessfully: boolean;
}

export const initialState: InvoicePurchaseState = {
    purchaseInvoices: new IInvoicePurchaseResponse(),
    taxes: [],
    isDownloadingFile: false,
    invoiceGenerateSuccess: false,
    isTaxProOTPSentSuccessfully: false
};

export function InvoicePurchaseReducer(state = initialState, action: CustomActions): InvoicePurchaseState {
    switch (action.type) {
        case PURCHASE_INVOICE_ACTIONS.GET_PURCHASE_INVOICES_RESPONSE: {
            let response: BaseResponse<IInvoicePurchaseResponse, string> = action.payload;
            if (response.status === 'success') {
                let newState = _.cloneDeep(state);
                newState.invoiceGenerateSuccess = false;
                newState.purchaseInvoices = response.body;
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case PURCHASE_INVOICE_ACTIONS.SET_TAXES_FOR_COMPANY: {
            let response: BaseResponse<ITaxResponse[], string> = action.payload;
            if (response.status === 'success') {
                let newState = _.cloneDeep(state);
                newState.taxes = response.body;
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case PURCHASE_INVOICE_ACTIONS.UPDATE_PURCHASE_INVOICE_RESPONSE: {
            let response: BaseResponse<IInvoicePurchaseItem, string> = action.payload;
            if (response.status === 'success') {
                let newState = _.cloneDeep(state);
                let uniqueName = response.body[0].entryUniqueName;
                let indx = newState.purchaseInvoices.items.findIndex((obj) => obj.entryUniqueName === uniqueName);
                newState.invoiceGenerateSuccess = true;
                if (indx > -1) {
                    newState.purchaseInvoices.items[indx] = response.body[0];
                }
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case PURCHASE_INVOICE_ACTIONS.DOWNLOAD_GSTR1_SHEET: {
            let newState = _.cloneDeep(state);
            newState.isDownloadingFile = true;
            return Object.assign({}, state, newState);
        }
        case PURCHASE_INVOICE_ACTIONS.DOWNLOAD_GSTR1_SHEET_RESPONSE: {
            let newState = _.cloneDeep(state);
            newState.isDownloadingFile = false;
            return Object.assign({}, state, newState);
        }
        case PURCHASE_INVOICE_ACTIONS.DOWNLOAD_GSTR1_ERROR_SHEET: {
            let newState = _.cloneDeep(state);
            newState.isDownloadingFile = true;
            return Object.assign({}, state, newState);
        }
        case PURCHASE_INVOICE_ACTIONS.DOWNLOAD_GSTR1_ERROR_SHEET_RESPONSE: {
            let newState = _.cloneDeep(state);
            newState.isDownloadingFile = false;
            return Object.assign({}, state, newState);
        }
        case PURCHASE_INVOICE_ACTIONS.UPDATE_ENTRY_RESPONSE: {
            let response: BaseResponse<any, string> = action.payload;
            if (response.status === 'success') {
                let newState = _.cloneDeep(state);
                let uniqueName = response.body.uniqueName;
                let indx = newState.purchaseInvoices.items.findIndex((obj) => obj.entryUniqueName === uniqueName);
                if (indx > -1) {
                    newState.purchaseInvoices.items[indx].invoiceNumber = response.body.invoiceNumberAgainstVoucher;
                    newState.purchaseInvoices.items[indx].sendToGstr2 = response.body.sendToGstr2;
                    newState.purchaseInvoices.items[indx].availItc = response.body.availItc;
                }
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case GST_RETURN_ACTIONS.SAVE_TAX_PRO: {
            let newState = _.cloneDeep(state);
            newState.isTaxProOTPSentSuccessfully = false;
            return Object.assign({}, state, newState);
        }
        case GST_RETURN_ACTIONS.SAVE_TAX_PRO_RESPONSE: {
            let response: BaseResponse<any, string> = action.payload;
            if (response.status === 'success') {
                let newState = _.cloneDeep(state);
                newState.isTaxProOTPSentSuccessfully = true;
                return Object.assign({}, state, newState);
            }
            return state;
        }

        default: {
            return state;
        }
    }
}
