import { Action } from '@ngrx/store';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import * as _ from 'lodash';
import { INVOICE_ACTIONS, INVOICE } from '../../services/actions/invoice/invoice.const';
import { CommonPaginatedRequest, GetAllLedgersOfInvoicesResponse, GetAllInvoicesPaginatedResponse, PreviewInvoiceResponseClass, PreviewInvoiceRequest, GenerateInvoiceRequestClass, GenerateBulkInvoiceRequest, InvoiceTemplateDetailsResponse, ILedgersInvoiceResult } from '../../models/api-models/Invoice';
import { InvoiceSetting } from '../../models/interfaces/invoice.setting.interface';
import { RazorPayDetailsResponse } from '../../models/api-models/SettingsIntegraion';

export interface InvoiceState {
  invoices: GetAllInvoicesPaginatedResponse;
  base64Data: string;
  ledgers: GetAllLedgersOfInvoicesResponse;
  invoiceData: PreviewInvoiceResponseClass;
  invoiceTemplateConditions: InvoiceTemplateDetailsResponse;
  isInvoiceGenerated: boolean;
  visitedFromPreview: boolean;
  settings: InvoiceSetting;
  isLoadingInvoices: boolean;
}

export const initialState: InvoiceState = {
  invoices: null,
  base64Data: null,
  ledgers: null,
  invoiceData: null,
  invoiceTemplateConditions: null,
  isInvoiceGenerated: false,
  visitedFromPreview: false,
  settings: null,
  isLoadingInvoices: false,
};

export function InvoiceReducer(state = initialState, action: Action): InvoiceState {
    switch (action.type) {
        case INVOICE_ACTIONS.GET_ALL_INVOICES: {
            // let newState = _.cloneDeep(state);
            // newState.isLoadingInvoices = true;
            // return Object.assign({}, state, newState);
        }
        case INVOICE_ACTIONS.GET_ALL_INVOICES_RESPONSE: {
          let newState = _.cloneDeep(state);
          let res: BaseResponse<GetAllInvoicesPaginatedResponse, CommonPaginatedRequest> = action.payload;
          if (res.status === 'success') {
            newState.invoices = res.body;
            return Object.assign({}, state, newState);
          }
          return state;
        }
        case INVOICE_ACTIONS.DOWNLOAD_INVOICE_RESPONSE: {
          let newState = _.cloneDeep(state);
          let res: BaseResponse<string, string> = action.payload;
          if (res.status === 'success') {
            newState.base64Data = res.body;
            return Object.assign({}, state, newState);
          }
          return state;
        }
        case INVOICE_ACTIONS.GET_ALL_LEDGERS_FOR_INVOICE_RESPONSE: {
            let newState = _.cloneDeep(state);
            let res: BaseResponse<GetAllLedgersOfInvoicesResponse, CommonPaginatedRequest> = action.payload;
            if (res.status === 'success') {
                let body = _.cloneDeep(res.body);
                if (body.results.length > 0) {
                  body.results.map((item: ILedgersInvoiceResult) => {
                    item.isSelected = (item.isSelected) ? true : false;
                  });
                }
                newState.ledgers = body;
                return Object.assign({}, state, newState);
            }else {
              let o: GetAllLedgersOfInvoicesResponse = new GetAllLedgersOfInvoicesResponse();
              o.results = [];
              newState.ledgers = o;
              return Object.assign({}, state, newState);
            }
        }
        case INVOICE_ACTIONS.MODIFIED_INVOICE_STATE_DATA: {
          let newState = _.cloneDeep(state);
          let uniq: string[] = action.payload;
          newState.ledgers.results.map((item: ILedgersInvoiceResult) => {
            let idx = _.indexOf(uniq, item.uniqueName);
            if (idx !== -1) {
              return item.isSelected = true;
            }else {
              return item.isSelected = false;
            }
          });
          return Object.assign({}, state, newState);
        }
        case INVOICE_ACTIONS.PREVIEW_INVOICE_RESPONSE: {
          let newState = _.cloneDeep(state);
          let res: BaseResponse<PreviewInvoiceResponseClass, PreviewInvoiceRequest> = action.payload;
          if (res.status === 'success') {
            newState.invoiceData = res.body;
            return Object.assign({}, state, newState);
          }
          return state;
        }
        case INVOICE_ACTIONS.PREVIEW_OF_GENERATED_INVOICE_RESPONSE: {
          let newState = _.cloneDeep(state);
          let res: BaseResponse<PreviewInvoiceResponseClass, string> = action.payload;
          if (res.status === 'success') {
            newState.invoiceData = res.body;
            return Object.assign({}, state, newState);
          }
          return state;
        }
        case INVOICE_ACTIONS.VISIT_FROM_PREVIEW: {
          return Object.assign({}, state, { visitedFromPreview: true });
        }
        case INVOICE_ACTIONS.UPDATE_GENERATED_INVOICE_RESPONSE: {
          return Object.assign({}, state, {
            isInvoiceGenerated: true
          });
        }
        case INVOICE_ACTIONS.RESET_INVOICE_DATA: {
          return Object.assign({}, state, {
            isInvoiceGenerated: false,
            invoiceTemplateConditions: null,
            invoiceData: null,
            visitedFromPreview: false
          });
        }
        case INVOICE_ACTIONS.INVOICE_GENERATION_COMPLETED: {
          let newState = _.cloneDeep(state);
          newState.isInvoiceGenerated = false;
          return Object.assign({}, state, newState);
        }
        case INVOICE_ACTIONS.GENERATE_INVOICE_RESPONSE: {
          let newState = _.cloneDeep(state);
          let res: BaseResponse<string, string> = action.payload;
          if (res.status === 'success') {
            newState.isInvoiceGenerated = true;
            newState.ledgers.results = _.remove(newState.ledgers.results, (item: ILedgersInvoiceResult) => {
              return !item.isSelected;
            });
            return Object.assign({}, state, newState);
          }
          return state;
        }
        case INVOICE_ACTIONS.GENERATE_BULK_INVOICE_RESPONSE: {
            let newState = _.cloneDeep(state);
            let res: BaseResponse<string, GenerateBulkInvoiceRequest> = action.payload;
            let reqObj: GenerateBulkInvoiceRequest[] = action.payload.request;
            if (res.status === 'success' && reqObj.length > 0) {
              _.forEach(reqObj, (item: GenerateBulkInvoiceRequest) => {
                _.forEach(item.entries, (uniqueName: string) => {
                  newState.ledgers.results = _.remove(newState.ledgers.results, (o: ILedgersInvoiceResult) => {
                    return o.uniqueName !== uniqueName;
                  });
                });
              });
              return Object.assign({}, state, newState);
            }
            return state;
        }
        case INVOICE_ACTIONS.GET_INVOICE_TEMPLATE_DETAILS_RESPONSE: {
            let newState = _.cloneDeep(state);
            let res: BaseResponse<InvoiceTemplateDetailsResponse, string> = action.payload;
            if (res.status === 'success') {
                newState.invoiceTemplateConditions = res.body;
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case INVOICE_ACTIONS.DELETE_INVOICE_RESPONSE: {
            let newState = _.cloneDeep(state);
            let res: BaseResponse<string, string> = action.payload;
            if (res.status === 'success') {
                let indx = newState.invoices.results.findIndex((o) => o.invoiceNumber === res.request);
                if (indx > -1) {
                    newState.invoices.results.splice(indx, 1);
                }
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case INVOICE.SETTING.GET_INVOICE_SETTING_RESPONSE: {
            let newState = _.cloneDeep(state);
            let res: BaseResponse<InvoiceSetting, string> = action.payload;
            if (res.status === 'success') {
                newState.settings = res.body;
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case INVOICE.SETTING.DELETE_WEBHOOK_RESPONSE: {
            let newState = _.cloneDeep(state);
            let res: BaseResponse<string, string> = action.payload;
            if (res.status === 'success') {
                let uniqueName = res.queryString.uniquename;
                let indx = newState.settings.webhooks.findIndex((obj) => obj.uniqueName === uniqueName);
                if (indx > -1) {
                    newState.settings.webhooks.splice(indx, 1);
                }
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case INVOICE.SETTING.UPDATE_INVOICE_EMAIL_RESPONSE: {
            let newState = _.cloneDeep(state);
            let res: BaseResponse<string, string> = action.payload;
            if (res.status === 'success') {
                let emailId = res.queryString.emailId;
                newState.settings.invoiceSettings.email = emailId;
                newState.settings.invoiceSettings.emailVerified = false;
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case INVOICE.SETTING.SAVE_INVOICE_WEBHOOK_RESPONSE: {
            let newState = _.cloneDeep(state);
            let res: BaseResponse<string, string> = action.payload;
            // let blankWebhook = {
            //     url: '',
            //     triggerAt: 0,
            //     entity: '',
            //     uniqueName: ''
            // };
            if (res.status === 'success') {
                newState.settings.webhooks = null;
                // let newWebhook = res.queryString.webhook;
                // newState.settings.webhooks.push(newWebhook);
                // newState.settings.webhooks.push(blankWebhook);
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case INVOICE.SETTING.UPDATE_INVOICE_SETTING_RESPONSE: {
            let newState = _.cloneDeep(state);
            let res: BaseResponse<string, string> = action.payload;
            if (res.status === 'success') {
                let form = res.queryString.form;
                newState.settings.invoiceSettings = form.invoiceSettings;
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case INVOICE.SETTING.GET_RAZORPAY_DETAIL_RESPONSE: {
            let newState = _.cloneDeep(state);
            let res: BaseResponse<RazorPayDetailsResponse, string> = action.payload;
            if (res.status === 'success') {
                newState.settings.razorPayform = res.body;
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case INVOICE.SETTING.UPDATE_RAZORPAY_DETAIL_RESPONSE: {
            let newState = _.cloneDeep(state);
            let res: BaseResponse<RazorPayDetailsResponse, string> = action.payload;
            if (res.status === 'success') {
                let form = res.queryString.form;
                newState.settings.razorPayform = form;
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case INVOICE.SETTING.DELETE_RAZORPAY_DETAIL_RESPONSE: {
            let newState = _.cloneDeep(state);
            let res: BaseResponse<string, string> = action.payload;
            if (res.status === 'success') {
                newState.settings.razorPayform = new RazorPayDetailsResponse();
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case INVOICE.SETTING.DELETE_INVOICE_EMAIL_RESPONSE: {
            let newState = _.cloneDeep(state);
            let res: BaseResponse<string, string> = action.payload;
            if (res.status === 'success') {
                newState.settings.invoiceSettings.email = null;
                newState.settings.invoiceSettings.emailVerified = false;
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case INVOICE.SETTING.SAVE_RAZORPAY_DETAIL_RESPONSE: {
            let newState = _.cloneDeep(state);
            let res: BaseResponse<RazorPayDetailsResponse, string> = action.payload;
            if (res.status === 'success') {
                let form = res.queryString.form;
                newState.settings.razorPayform = form;
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case INVOICE_ACTIONS.ACTION_ON_INVOICE_RESPONSE: {
            let newState = _.cloneDeep(state);
            let res: BaseResponse<string, string> = action.payload;
            if (res.status === 'success') {

                // Client side modification can useful when using pagination
                /* let status = res.queryString.action.action;
                let uniqueName = res.queryString.invoiceUniqueName;
                let indx = newState.invoices.results.findIndex((o) => o.uniqueName === uniqueName);
                if (indx > -1) {
                    newState.invoices.results[indx].balanceStatus = status;
                    if (status === 'paid') {
                        newState.invoices.results[indx].balanceDue = newState.invoices.results[indx].grandTotal - res.queryString.action.amount;
                        if (newState.invoices.results[indx].grandTotal > newState.invoices.results[indx].balanceDue) {
                            newState.invoices.results[indx].balanceStatus = 'Partial-Paid';
                        }
                    }
                } */

                // Just refreshing the list for now
                newState.invoices = null;
                return Object.assign({}, state, newState);
            }
            return state;
        }
        default: {
            return state;
        }
    }
}
