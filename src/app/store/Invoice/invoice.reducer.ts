import { Action, combineReducers} from '@ngrx/store';

import { Section, Template } from '../../models/api-models/invoice';
import { INVOICE } from '../../services/actions/invoice/invoice.const';

export interface InvoiceTemplateState {
  [uniqueName: string]: Section;
  // templateId: string;
  // heading: string;
  // GSTIN: string;
  // PAN: string;
  // invoiceDate: string;
  // dueDate: string;
  // shipDate: string;
  // shipVia: string;
  // trackingNo: string;
  // invoiceNo: string;
  // invoiceTempTitle: string;
  // customerName: string;
  // companyName: string;
  // emailId: string;
  // mobileno: string;
  // billingAddress: string;
  // billingGSTIN: string;
  // content: Content;

}

export interface InvoiceTableState {
  [colName: string]: number;

}

export interface InvoiceState {

  template: InvoiceTemplateState;
  table: InvoiceTableState;
}

export const initialState: InvoiceTemplateState = {
  // templateId: 'template1',
  // heading: 'WAlkover',
  // GSTIN: 'fr41243tasgdgfadg',
  // PAN: 'tqwtqwtrqereqt',
  // invoiceDate: '10/05/2017',
  // dueDate: '15/05/2017',
  // shipDate: '20/05/2017',
  // shipVia: '20/07/2017',
  // trackingNo: '53252q34terg3',
  // invoiceNo: '4314235252',
  // invoiceTempTitle: 'INVOICE',
  // customerName: 'kunal',
  // companyName: 'walkover',
  // emailId: 'kunal1991@hotmail.com',
  // mobileno: '9789065478',
  // billingAddress: '4321 321fweqf f qwfwfewqf',
  // billingGSTIN: '4314321rt2fr1'
};

export function invoiceTemplateReducer(state = initialState, action: Action): InvoiceTemplateState {
  switch (action.type) {
    // case INVOICE.TEMPLATE.SELECT_TEMPLATE:
    //   return Object.assign({}, state, {
    //     templateId: action.payload.id
    //   });
    // case INVOICE.TEMPLATE.SET_TEMPLATE_STATE:
    //
    //   return Object.assign({}, state, {
    //      action.paylaod.sections.reduce((sec, sections) => {
    //       sec[sections.uniqueName] = {
    //         ...sec[sections.uniqueName],
    //         ...sec
    //       };
    //       }),
    //   case INVOICE.CONTENT.SET_HEADING:
    //   return Object.assign({}, state, {
    //   heading: action.payload.data.heading
    // });
    // case INVOICE.CONTENT.SET_HEADING:
    //   return Object.assign({}, state, {
    //     heading: action.payload.data
    //   });
    default: {
      return state;
    }
  }
}


export const initialStateTable: InvoiceTableState = {

};

// export function invoiceTableReducer(state = initialStateTable, action: Action): InvoiceTableState {
//   switch (action.type) {
//     case INVOICE.CONTENT.SET_COLUMN_WIDTH:
//       return Object.assign({}, state, {
//         [action.payload.colName]: action.payload.width
//       });
//     default: {
//       return state;
//     }
//   }
// }

export const invoiceReducers = {
  template: invoiceTemplateReducer,

};

export const invoiceReducer = combineReducers(invoiceReducers);
