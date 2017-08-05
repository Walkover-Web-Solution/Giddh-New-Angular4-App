import {Action, combineReducers} from '@ngrx/store';
import { INVOICE } from '../../services/actions/invoice/invoice.const';
import {TableColumnMeta} from "../../models/api-models/invoice";

export interface InvoiceTemplateState {
  templateId: string;
  heading: string;

}

export interface InvoiceTableState {
  [colName: string]: number;

}

export interface InvoiceState {

  template: InvoiceTemplateState;
  table: InvoiceTableState;
}

export const initialState: InvoiceTemplateState = {
  templateId: 'template1',
  heading: ''

};

export function invoiceTemplateReducer(state = initialState, action: Action): InvoiceTemplateState {
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

export const initialStateTable: InvoiceTableState = {

};

export function invoiceTableReducer(state = initialStateTable, action: Action): InvoiceTableState {
  switch (action.type) {
    case INVOICE.CONTENT.SET_COLUMN_WIDTH:
      return Object.assign({}, state, {
        [action.payload.colName]: action.payload.width
      });
    default: {
      return state;
    }
  }
}

export const invoiceReducers = {
  template: invoiceTemplateReducer,
  table: invoiceTableReducer
};

export const invoiceReducer = combineReducers(invoiceReducers);
