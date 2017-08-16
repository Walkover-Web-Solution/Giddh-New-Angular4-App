import { Action, combineReducers } from '@ngrx/store';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import * as _ from 'lodash';
import { INVOICE_ACTIONS, INVOICE } from '../../services/actions/invoice/invoice.const';
import { CommonPaginatedRequest, GetAllLedgersOfInvoicesResponse, GetAllInvoicesPaginatedResponse, PreviewAndGenerateInvoiceResponse, PreviewAndGenerateInvoiceRequest, GetInvoiceTemplateDetailsResponse } from '../../models/api-models/Invoice';

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
  fontFamily: string;
  topMargin: number;
  leftMargin: number;
  bottomMargin: number;
  rightMargin: number;
}

export const initialStateTempMeta: InvoiceTemplateMetaState = {
  templateId: 'common_template_a',
  companyName: 'Walkover',
  GSTIN: '',
  PAN: '',
  address: '',
  invoiceDate: '',
  invoiceNumber: '',
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
  billingGstin: '',
  shippingAddress: '',
  shippingState: '',
  shippinGstin: '',
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
  fontFamily: 'Open Sans, sans-serif',
  topMargin: 20,
  leftMargin: 0,
  bottomMargin: 0,
  rightMargin: 10,
};

// export interface InvoiceTemplateState {
//   [uniqueName: string]: GetInvoiceTemplateDetailsResponse;
// }

export class GeneratePage {
  public ledgers: GetAllLedgersOfInvoicesResponse;
  public invoiceData: PreviewAndGenerateInvoiceResponse;
  public invoiceTemplateConditions: GetInvoiceTemplateDetailsResponse;
}

export class PreviewPage {
  public invoices: GetAllInvoicesPaginatedResponse;
}

export class TemplatesPage {
  public templatesList: GetInvoiceTemplateDetailsResponse[];
  public templateMetaData: InvoiceTemplateMetaState;
}

export interface InvoiceState {
    preview: PreviewPage;
    generate: GeneratePage;
    templates: TemplatesPage;
    settings: string;
}

export const initialState: InvoiceState = {
    preview: {invoices: null},
    generate: {ledgers: null, invoiceData: null, invoiceTemplateConditions: null},
    templates: {templatesList: null, templateMetaData: null},
    settings: null
};

export function templatesReducer(state = initialState, action: Action): InvoiceState {
  switch (action.type) {
    case INVOICE.TEMPLATE.SET_TEMPLATE_STATE: {
      let result = action.payload.temp.body;
      let newState = []; // Array
      if (result && result.length) {
        result.forEach((obj) => {
          let key = obj.uniqueName;
          let obj1 = {};
          obj1[obj.uniqueName] = obj;
          newState.push(obj1);
        });
      }
      return Object.assign({}, state, newState);
    }
    default: {
      return state;
    }
  }
}

export function templateMetaReducer(state = initialState, action: Action): InvoiceState {
  switch (action.type) {
    case INVOICE.TEMPLATE.SET_TEMPLATE_DATA:
      let headerSection = action.payload[0].content;
      let tableSection = action.payload[1].content;
      let newState = _.cloneDeep(state);
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
        quantityWidth: tableSection[11].width
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
    default: {
      return state;
    }
  }
}

// above kunal
// preview and generate related below
export function prevAndGenReducer(state = initialState, action: Action): InvoiceState {
  switch (action.type) {
    case INVOICE_ACTIONS.GET_ALL_INVOICES_RESPONSE: {
        let newState = _.cloneDeep(state);
        let res: BaseResponse<GetAllInvoicesPaginatedResponse, CommonPaginatedRequest> = action.payload;
        if (res.status === 'success') {
            newState.preview.invoices = res.body;
            return Object.assign({}, state, newState);
        }
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
    case INVOICE_ACTIONS.PREVIEW_INVOICE_RESPONSE: {
        let newState = _.cloneDeep(state);
        let res: BaseResponse<PreviewAndGenerateInvoiceResponse, PreviewAndGenerateInvoiceRequest> = action.payload;
        if (res.status === 'success') {
            newState.generate.invoiceData = res.body;
            return Object.assign({}, state, newState);
        }
        return state;
    }
    case INVOICE_ACTIONS.GET_INVOICE_TEMPLATE_DETAILS_RESPONSE: {
        let newState = _.cloneDeep(state);
        let res: BaseResponse<GetInvoiceTemplateDetailsResponse, string> = action.payload;
        if (res.status === 'success') {
            newState.generate.invoiceTemplateConditions = res.body;
            return Object.assign({}, state, newState);
        }
        return state;
    }
    default: {
        return state;
    }
  }
}

export const InvoiceReducers = {
  template: templatesReducer,
  templateMeta: templateMetaReducer,
  prevAndGen: prevAndGenReducer
};

export const InvoiceReducer = combineReducers(InvoiceReducers);
