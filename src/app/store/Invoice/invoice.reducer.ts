import { Action, combineReducers} from '@ngrx/store';

import {Template, TemplateBody} from '../../models/api-models/invoice';
import { INVOICE } from '../../services/actions/invoice/invoice.const';

export interface InvoiceTemplateState {
  [uniqueName: string]: TemplateBody;
}

export interface InvoiceTemplateMetaState {
  templateId: string;

}

export interface InvoiceState {

  template: InvoiceTemplateState;
  templateMeta: InvoiceTemplateMetaState;
}

export const initialState: InvoiceTemplateState = {
};

export function invoiceTemplateReducer(state = initialState, action: Action): InvoiceTemplateState {
  switch (action.type) {

    case INVOICE.TEMPLATE.SET_TEMPLATE_STATE:
      let result = action.payload.temp.body
      console.log("TEMP BODY", result)
      let newState = []; // Array
      result.forEach((obj) => {
        let key = obj.uniqueName;
        let obj1 = {};
        obj1[obj.uniqueName] = obj;
        newState.push(obj1);
      });
      return Object.assign({}, state, newState);

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
export const initialStateTempMeta: InvoiceTemplateMetaState = {
  templateId: 'common_template_a'
};

export function invoiceTemplateMetaReducer(state = initialStateTempMeta, action: Action): InvoiceTemplateMetaState {
  switch (action.type) {
    case INVOICE.TEMPLTATE
    case INVOICE.TEMPLATE.SELECT_TEMPLATE:
      return Object.assign({}, state, {
        templateId: action.payload.id
      });
    default: {
      return state;
    }
  }
}

export const invoiceReducers = {
  template: invoiceTemplateReducer,
  templateMeta: invoiceTemplateMetaReducer
};

export const invoiceReducer = combineReducers(invoiceReducers);
