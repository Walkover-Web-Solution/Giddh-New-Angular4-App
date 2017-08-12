import { Action } from '@ngrx/store';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import * as _ from 'lodash';
import { INVOICE_ACTIONS } from '../../services/actions/invoice/invoice.const';
import { CommonPaginatedRequest, GetAllLedgersOfInvoicesResponse, GetAllInvoicesPaginatedResponse } from '../../models/api-models/Invoice';

export class GeneratePage {
  public ledgers: GetAllLedgersOfInvoicesResponse;
}

export class PreviewPage {
  public invoices: GetAllInvoicesPaginatedResponse;
}

export interface InvoiceState {
    preview: PreviewPage;
    generate: GeneratePage;
    templates: string;
    settings: string;
}

export const initialState: InvoiceState = {
    preview: {invoices: null},
    generate: {ledgers: null},
    templates: null,
    settings: null
};

export function InvoiceReducer(state = initialState, action: Action): InvoiceState {
    switch (action.type) {
        case INVOICE_ACTIONS.GET_ALL_INVOICES: {
            return state;
        }
        case INVOICE_ACTIONS.GET_ALL_INVOICES_RESPONSE: {
            let newState = _.cloneDeep(state);
            let res: BaseResponse<GetAllInvoicesPaginatedResponse, CommonPaginatedRequest> = action.payload;
            if (res.status === 'success') {
                newState.preview.invoices = res.body;
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case INVOICE_ACTIONS.GET_ALL_LEDGERS_FOR_INVOICE: {
            return state;
        }
        case INVOICE_ACTIONS.GET_ALL_LEDGERS_FOR_INVOICE_RESPONSE: {
            let newState = _.cloneDeep(state);
            let res: BaseResponse<GetAllLedgersOfInvoicesResponse, CommonPaginatedRequest> = action.payload;
            if (res.status === 'success') {
                newState.generate.ledgers = res.body;
                return Object.assign({}, state, newState);
            }
        }
        default:
        {
            return state;
        }
    }
}
