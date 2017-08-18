import { Action, combineReducers } from '@ngrx/store';
import { GetInvoiceTemplateDetailsResponse } from '../../models/api-models/Invoice';
import { INVOICE } from '../../services/actions/invoice/invoice.const';
import {Font} from "ngx-font-picker";

export interface InvoiceTemplateState {
  [uniqueName: string]: GetInvoiceTemplateDetailsResponse;
}

export interface InvoiceTemplateMetaState {
  templateId: string;
  companyName: string;
  GSTIN: string;
  PAN: string;
  address: string;
  invoiceDate: string;
  invoiceNumber: string;
  shippingDate: string;
  shippingNo: string;
  shippingVia: string;
  trackingNumber: string;
  trackingDate: string;
  trackingRecord: string;
  customerName: string;
  customerEmail: string;
  customerMobileNumber: string;
  dueDate: string;
  billingState: string;
  billingAddress: string;
  billingGstin: string;
  shippingAddress: string;
  shippingState: string;
  shippinGstin: string;
  customField1: string;
  customField2: string;
  customField3: string;
  formNameInvoice: string;
  formNameTaxInvoice: string;
  sNoLabel: string;
  sNoWidth: number;
  dateLabel: string;
  dateWidth: number;
  itemLabel: string;
  itemWidth: number;
  hsnSacLabel: string;
  hsnSacWidth: number;
  itemCodeLabel: string;
  itemCodeWidth: number;
  descLabel: string;
  descWidth: number;
  rateLabel: string;
  rateWidth: number;
  discountLabel: string;
  discountWidth: number;
  taxableValueLabel: string;
  taxableValueWidth: number;
  taxLabel: string;
  taxWidth: number;
  totalLabel: string;
  totalWidth: number;
  quantityLabel: string;
  quantityWidth: number;
  topMargin: number;
  leftMargin: number;
  bottomMargin: number;
  rightMargin: number;
  font: string;
  color: string;
  taxableAmount: string;
  totalTax: string;
  otherDeduction: string;
  total: string;
  totalInWords: string;
  thanks: string;
  message1: string;
  message2: string;
  companyAddress: string;
  imageSignature: string;
  slogan: string;
}

export interface InvoiceTableState {
  [colName: string]: number;
}

export interface InvoiceTempState {
  template: InvoiceTemplateState;
  templateMeta: InvoiceTemplateMetaState;
  table: InvoiceTableState;
}

export const initialTableState: InvoiceTableState = {

};

export function invoiceTableReducer(state = initialTableState, action: Action): InvoiceTableState {
  switch (action.type) {

    case INVOICE.CONTENT.SET_COLUMN_WIDTH:
      return Object.assign({}, state, {
        [action.payload.colName]: action.payload.width
      });

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

export const initialState: InvoiceTemplateState = {
};

export function invoiceTemplateReducer(state = initialState, action: Action): InvoiceTemplateState {
  switch (action.type) {

    case INVOICE.TEMPLATE.SET_TEMPLATE_STATE:
      let result = action.payload.temp.body;
      let newState = []; // Array
      if (result && result.templateId) {
        result.forEach((obj) => {
          let key = obj.uniqueName;
          let obj1 = {};
          obj1[obj.uniqueName] = obj;
          newState.push(obj1);
        });
      }
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
  templateId: 'common_template_a',
  companyName: 'Walkover',
  GSTIN: 'GSTIN',
  PAN: 'PAN',
  address: '',
  invoiceDate: 'Invoice Date',
  invoiceNumber: 'Invoice No.',
  shippingDate: '',
  shippingNo: '',
  shippingVia: '',
  trackingNumber: '',
  trackingDate: '',
  trackingRecord: '',
  customerName: '',
  customerEmail: '',
  customerMobileNumber: '',
  dueDate: '',
  billingState: '',
  billingAddress: '',
  billingGstin: 'GSTIN',
  shippingAddress: '',
  shippingState: '',
  shippinGstin: 'GSTIN',
  customField1: '',
  customField2: '',
  customField3: '',
  formNameInvoice: '',
  formNameTaxInvoice: '',
  sNoLabel: '',
  sNoWidth: 10,
  dateLabel: '',
  dateWidth: 10,
  itemLabel: '',
  itemWidth: 10,
  hsnSacLabel: '',
  hsnSacWidth: 10,
  itemCodeLabel: '',
  itemCodeWidth: 10,
  descLabel: '',
  descWidth: 10,
  rateLabel: '',
  rateWidth: 10,
  discountLabel: '',
  discountWidth: 10,
  taxableValueLabel: '',
  taxableValueWidth: 10,
  taxLabel: '',
  taxWidth: 10,
  totalLabel: '',
  totalWidth: 10,
  quantityLabel: '',
  quantityWidth: 10,
  topMargin: 20,
  leftMargin: 0,
  bottomMargin: 0,
  rightMargin: 10,
  font: 'Open Sans',
  color: '',
  taxableAmount: '',
  totalTax: '',
  otherDeduction: '',
  total: '',
  totalInWords: '',
  message1: '',
  message2: '',
  thanks: '',
  companyAddress: '',
  imageSignature: '',
  slogan: '',
};

export function invoiceTemplateMetaReducer(state = initialStateTempMeta, action: Action): InvoiceTemplateMetaState {
  switch (action.type) {
    case INVOICE.TEMPLATE.SET_TEMPLATE_DATA:
      let headerSection = action.payload[0].content;
      let tableSection = action.payload[1].content;
      let footerSection = action.payload[2].content;
      return Object.assign({}, state, {
        companyName: headerSection[0].label,
        GSTIN: headerSection[1].label,
        PAN: headerSection[2].label,
        address: headerSection[3].label,
        invoiceDate: headerSection[4].label,
        invoiceNumber: headerSection[5].label,
        shippingDate: headerSection[6].label,
        shippingVia: headerSection[7].label,
        trackingNumber: headerSection[8].label,
        trackingRecord: headerSection[9].label,
        customerName: headerSection[10].label,
        customerEmail: headerSection[11].label,
        customerMobileNumber: headerSection[12].label,
        dueDate: headerSection[13].label,
        billingState: headerSection[14].label,
        billingAddress: headerSection[15].label,
        billingGstin: headerSection[16].label,
        shippingAddress: headerSection[17].label,
        shippingState: headerSection[18].label,
        shippinGstin: headerSection[19].label,
        customField1: headerSection[20].label,
        customField2: headerSection[21].label,
        customField3: headerSection[22].label,
        formNameInvoice: headerSection[23].label,
        formNameTaxInvoice: headerSection[24].label,
        sNoLabel: tableSection[0].label,
        sNoWidth: tableSection[0].width,
        dateLabel: tableSection[1].label,
        dateWidth: tableSection[1].width,
        itemLabel: tableSection[2].label,
        itemWidth: tableSection[2].width,
        hsnSacLabel: tableSection[3].label,
        hsnSacWidth: tableSection[3].width,
        itemCodeLabel: tableSection[4].label,
        itemCodeWidth: tableSection[4].width,
        descLabel: tableSection[5].label,
        descWidth: tableSection[5].width,
        rateLabel: tableSection[6].label,
        rateWidth: tableSection[6].width,
        discountLabel: tableSection[7].label,
        discountWidth: tableSection[7].width,
        taxableValueLabel: tableSection[8].label,
        taxableValueWidth: tableSection[8].width,
        taxLabel: tableSection[9].label,
        taxWidth: tableSection[9].width,
        totalLabel: tableSection[10].label,
        totalWidth: tableSection[10].width,
        quantityLabel: tableSection[11].label,
        quantityWidth: tableSection[11].width,
        taxableAmount: footerSection[0].label,
        totalTax: footerSection[1].label,
        otherDeduction: footerSection[2].label,
        total: footerSection[3].label,
        totalInWords: footerSection[4].label,
        message1: footerSection[5].label,
        message2: footerSection[6].label,
        thanks: footerSection[7].label,
        companyAddress: footerSection[8].label,
        imageSignature: footerSection[9].label,
        slogan: footerSection[10].label
        // companyName: action.payload.
      });
    case INVOICE.TEMPLATE.SELECT_TEMPLATE:
      return Object.assign({}, state, {
        templateId: action.payload.id
      });

    case INVOICE.TEMPLATE.UPDATE_GSTIN:
      return Object.assign({}, state, {
        GSTIN: action.payload.data
      });

    case INVOICE.TEMPLATE.UPDATE_PAN:
      return Object.assign({}, state, {
        PAN: action.payload.data
      });

    case INVOICE.TEMPLATE.UPDATE_INVOICE_DATE:
      return Object.assign({}, state, {
        invoiceDate: action.payload.data
      });

    case INVOICE.TEMPLATE.UPDATE_INVOICE_NO:
      return Object.assign({}, state, {
        invoiceNo: action.payload.data
      });

    case INVOICE.TEMPLATE.UPDATE_DUE_DATE:
      return Object.assign({}, state, {
        dueDate: action.payload.data
      });

    case INVOICE.TEMPLATE.UPDATE_TOP_MARGIN:
      return Object.assign({}, state, {
        topMargin: action.payload.data
      });
    case INVOICE.TEMPLATE.UPDATE_LEFT_MARGIN:
      return Object.assign({}, state, {
        leftMargin: action.payload.data
      });
    case INVOICE.TEMPLATE.UPDATE_BOTTOM_MARGIN:
      return Object.assign({}, state, {
        bottomMargin: action.payload.data
      });
    case INVOICE.TEMPLATE.UPDATE_RIGHT_MARGIN:
      return Object.assign({}, state, {
        rightMargin: action.payload.data
      });
    case INVOICE.TEMPLATE.UPDATE_CUSTOM_FIELD_1:
      return Object.assign({}, state, {
        customField1: action.payload.data
      });
    case INVOICE.TEMPLATE.UPDATE_CUSTOM_FIELD_2:
      return Object.assign({}, state, {
        customField2: action.payload.data
      });
    case INVOICE.TEMPLATE.UPDATE_CUSTOM_FIELD_3:
      return Object.assign({}, state, {
        customField3: action.payload.data
      });
    case INVOICE.TEMPLATE.UPDATE_SHIPPING_ADDRESS:
      return Object.assign({}, state, {
        shippingAddress: action.payload.data
      });
    case INVOICE.TEMPLATE.UPDATE_SHIPPING_GSTIN:
      return Object.assign({}, state, {
        shippingGstin: action.payload.data
      });
    case INVOICE.TEMPLATE.UPDATE_BILLING_ADDRESS:
      return Object.assign({}, state, {
        shippingAddress: action.payload.data
      });
    case INVOICE.TEMPLATE.UPDATE_BILLING_GSTIN:
      return Object.assign({}, state, {
        billingGstin: action.payload.data
      });
    case INVOICE.TEMPLATE.SET_FONT:
      return Object.assign({}, state, {
        font: action.payload.font
      });
    case INVOICE.TEMPLATE.SET_COLOR:
      return Object.assign({}, state, {
        color : action.payload.color
      });
    case INVOICE.TEMPLATE.UPDATE_MESSAGE1:
      return Object.assign({}, state, {
        message1 : action.payload.data
      });
    case INVOICE.TEMPLATE.UPDATE_MESSAGE2:
      return Object.assign({}, state, {
        message2 : action.payload.data
      });
    default: {
      return state;
    }
  }
}

export const invReducers = {
  template: invoiceTemplateReducer,
  templateMeta: invoiceTemplateMetaReducer,
  table: invoiceTableReducer
};

export const InvoiceTemplateReducer = combineReducers(invReducers);
