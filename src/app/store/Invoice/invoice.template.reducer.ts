import { Action, combineReducers } from '@ngrx/store';
import { GetInvoiceTemplateDetailsResponse, ISection } from '../../models/api-models/Invoice';
import { INVOICE } from '../../services/actions/invoice/invoice.const';
import { Font } from 'ngx-font-picker';
import {
  IsDivVisible,
  IsFieldVisible
} from '../../invoice/templates/edit-template/filters-container/content-filters/content.filters.component';
import * as _ from 'lodash';

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
  setInvoiceFlag: boolean;
  div: IsDivVisible;
  setFieldDisplay: IsFieldVisible;
}

export interface InvoiceTableState {
  theTestState: GetInvoiceTemplateDetailsResponse;
}

export interface InvoiceTempState {
  template: InvoiceTemplateState;
  templateMeta: InvoiceTemplateMetaState;
  table: InvoiceTableState;
}

export const initialTableState: InvoiceTableState = {
  theTestState : null
};

export function invoiceTableReducer(state = initialTableState, action: Action): InvoiceTableState {
  switch (action.type) {

    case INVOICE.CONTENT.SET_COLUMN_WIDTH:
      let newState = _.cloneDeep(state);
      newState.theTestState = action.payload;
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

export const initialState: InvoiceTemplateState = {
};

export function invoiceTemplateReducer(state = initialState, action: Action): InvoiceTemplateState {
  switch (action.type) {

    case INVOICE.TEMPLATE.SET_TEMPLATE_STATE:
      console.log('SET TEMPLATE STATE');
      let result = action.payload.temp.body;
      let newState = []; // Array
      console.log(result);
      if (result) {
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
  companyName: 'Walkover Web Solution',
  GSTIN: 'GSTIN',
  PAN: 'PAN',
  address: 'Walkover Web Solutions Private Limited, 405-406, Capt. C. S. Naydu Arcade, 10/2, Old Palasia, near Greater Kailash Hospital, Indore 452001(M. P.)',
  invoiceDate: 'Invoice Date',
  invoiceNumber: 'Invoice No.',
  shippingDate: 'Ship Date',
  shippingNo: 'Shipping No.',
  shippingVia: 'Ship Via',
  trackingNumber: 'Tracking No.',
  trackingDate: 'Tracking Date',
  trackingRecord: 'Tracking Record',
  customerName: 'Mr. Alok Gangrade',
  customerEmail: 'alokgangrade@gmail.com',
  customerMobileNumber: '+91 9876543210',
  dueDate: 'Due Date',
  billingState: '',
  billingAddress: 'Billing Address',
  billingGstin: 'GSTIN',
  shippingAddress: 'Shipping Address',
  shippingState: '',
  shippinGstin: 'GSTIN',
  customField1: 'Field 1',
  customField2: 'Field 2',
  customField3: 'Field 3',
  formNameInvoice: 'INVOICE',
  formNameTaxInvoice: 'HI THIS IS THE TEXT INVOICE',
  sNoLabel: 'S no.',
  sNoWidth: 10,
  dateLabel: 'Date',
  dateWidth: 10,
  itemLabel: 'Item',
  itemWidth: 10,
  hsnSacLabel: 'HSN/ SAC',
  hsnSacWidth: 10,
  itemCodeLabel: 'Item Code',
  itemCodeWidth: 10,
  descLabel: 'Desc.',
  descWidth: 10,
  rateLabel: 'Rate',
  rateWidth: 10,
  discountLabel: 'Disc.',
  discountWidth: 10,
  taxableValueLabel: 'Taxable Value',
  taxableValueWidth: 10,
  taxLabel: 'Tax',
  taxWidth: 10,
  totalLabel: 'Total',
  totalWidth: 10,
  quantityLabel: 'Qty.',
  quantityWidth: 10,
  topMargin: 20,
  leftMargin: 0,
  bottomMargin: 0,
  rightMargin: 10,
  font: 'Roboto',
  color: '#df4927',
  taxableAmount: 'Taxable Amount',
  totalTax: 'Total Tax*',
  otherDeduction: 'Other Deduction',
  total: 'Invoice Total',
  totalInWords: 'Invoice Total (In words)',
  message1: 'sample message 1',
  message2: 'sample message 2',
  thanks: 'Thank You for your business.',
  companyAddress: 'Walkover Web Solutions Private Limited, 405-406, Capt. C. S. Naydu Arcade, 10/2, Old Palasia, near Greater Kailash Hospital, Indore 452001(M. P.)',
  imageSignature: '',
  slogan: 'Walkover Web Solutions Private Limited',
  setInvoiceFlag: false,
  div: null,
  setFieldDisplay: null
};

export function invoiceTemplateMetaReducer(state = initialStateTempMeta, action: Action): InvoiceTemplateMetaState {
  switch (action.type) {
    case INVOICE.TEMPLATE.SELECT_TEMPLATE:
      console.log(action.payload.id);
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
        invoiceNumber: action.payload.data
      });

    case INVOICE.TEMPLATE.UPDATE_DUE_DATE:
      return Object.assign({}, state, {
        dueDate: action.payload.data
      });

    case INVOICE.TEMPLATE.UPDATE_SHIPPING_DATE:
      return Object.assign({}, state, {
        shippingDate: action.payload.data
      });

    case INVOICE.TEMPLATE.UPDATE_SHIPPING_VIA:
      return Object.assign({}, state, {
        shippingVia: action.payload.data
      });

    case INVOICE.TEMPLATE.UPDATE_TRACKING_NO:
      return Object.assign({}, state, {
        trackingNumber: action.payload.data
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

    case INVOICE.TEMPLATE.UPDATE_SNOLABEL:
      return Object.assign({}, state, {
        sNoLabel: action.payload.data
      });

    case INVOICE.TEMPLATE.UPDATE_ITEM_LABEL:
      return Object.assign({}, state, {
        itemLabel: action.payload.data
      });
    case INVOICE.TEMPLATE.UPDATE_DATE_LABEL:
      return Object.assign({}, state, {
        dateLabel: action.payload.data
      });
    case INVOICE.TEMPLATE.UPDATE_HSNSAC_LABEL:
      return Object.assign({}, state, {
        hsnSacLabel: action.payload.data
      });
    case INVOICE.TEMPLATE.UPDATE_HSNSAC_LABEL:
      return Object.assign({}, state, {
        hsnSacLabel: action.payload.data
      });
    case INVOICE.TEMPLATE.UPDATE_QUANTITY_LABEL:
      return Object.assign({}, state, {
        quantityLabel: action.payload.data
      });
    case INVOICE.TEMPLATE.SET_VISIBLE:
      console.log('DIV VISIBLE REDUCER CALLED');
      return Object.assign({}, state, {
        div: {
          header: action.payload.divVis.header,
          grid: action.payload.divVis.grid,
          footer: action.payload.divVis.footer
        },
      });
    case INVOICE.TEMPLATE.UPDATE_DISCOUNT_LABEL:
      return Object.assign({}, state, {
        discountLabel: action.payload.data
      });
    case INVOICE.TEMPLATE.UPDATE_TAXABLE_VALUE_LABEL:
      return Object.assign({}, state, {
        taxableValueLabel: action.payload.data
      });
    case INVOICE.TEMPLATE.UPDATE_TAX_LABEL:
      return Object.assign({}, state, {
        taxLabel: action.payload.data
      });
    case INVOICE.TEMPLATE.UPDATE_TOTAL_LABEL:
      return Object.assign({}, state, {
        totalLabel: action.payload.data
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
    case INVOICE.TEMPLATE.UPDATE_FORM_NAME_INVOICE:
      return Object.assign({}, state, {
        formNameInvoice : action.payload.ti.data,
        setInvoiceFlag: action.payload.ti.setTaxInvoiceActive
      });
    case INVOICE.TEMPLATE.UPDATE_FORM_NAME_TAX_INVOICE:
      return Object.assign({}, state, {
        formNameTaxInvoice : action.payload.ti.data,
        setInvoiceFlag: action.payload.ti.setTaxInvoiceActive
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
