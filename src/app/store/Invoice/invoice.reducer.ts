import { Action } from '@ngrx/store';
import { INVOICE } from '../../services/actions/invoice/invoice.const';

export interface InvoiceState {
  templateId: string;
}

export const initialState: InvoiceState = {
  templateId: 'template1'
};

export function invoiceReducer(state = initialState, action: Action): InvoiceState {
  switch (action.type) {
    case INVOICE.TEMPLATE.SELECT_TEMPLATE:
      return Object.assign({}, state, {
        templateId: action.payload.id
      });

    default: {
      return state;
    }
  }
}
