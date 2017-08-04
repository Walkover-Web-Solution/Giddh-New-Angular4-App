import { Action } from '@ngrx/store';
import { INVOICE } from '../../services/actions/invoice/invoice.const';

export interface InvoiceState {
  templateId: string;
  heading: string;
}

export const initialState: InvoiceState = {
  templateId: 'template1',
  heading: ''
};

export function invoiceReducer(state = initialState, action: Action): InvoiceState {
  switch (action.type) {
    case INVOICE.TEMPLATE.SELECT_TEMPLATE:
      return Object.assign({}, state, {
        templateId: action.payload.id
      });
    case INVOICE.CONTENT.SET_HEADING:
      return Object.assign({}, state, {
      heading: action.payload.data
    });
    default: {
      return state;
    }
  }
}
