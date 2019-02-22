import { BaseResponse } from '../../models/api-models/BaseResponse';
import * as _ from '../../lodash-optimized';
import { INVOICE, INVOICE_ACTIONS } from '../../actions/invoice/invoice.const';
import { CommonPaginatedRequest, GenerateBulkInvoiceRequest, GetAllInvoicesPaginatedResponse, GetAllLedgersOfInvoicesResponse, IBulkInvoiceGenerationFalingError, ILedgersInvoiceResult, InvoiceTemplateDetailsResponse, PreviewInvoiceResponseClass } from '../../models/api-models/Invoice';
import { InvoiceSetting } from '../../models/interfaces/invoice.setting.interface';
import { RazorPayDetailsResponse } from '../../models/api-models/SettingsIntegraion';
import { CustomActions } from '../customActions';
import { RecurringInvoices } from '../../models/interfaces/RecurringInvoice';
import { COMMON_ACTIONS } from '../../actions/common.const';
import { INVOICE_RECEIPT_ACTIONS } from 'app/actions/invoice/receipt/receipt.const';
import { LEDGER } from 'app/actions/ledger/ledger.const';

export interface InvoiceState {
  invoices: GetAllInvoicesPaginatedResponse;
  base64Data: string;
  ledgers: GetAllLedgersOfInvoicesResponse;
  invoiceData: PreviewInvoiceResponseClass;
  invoiceDataHasError: boolean;
  invoiceTemplateConditions: InvoiceTemplateDetailsResponse;
  isInvoiceGenerated: boolean;
  visitedFromPreview: boolean;
  settings: InvoiceSetting;
  isLoadingInvoices: boolean;
  isBulkInvoiceGenerated: boolean;
  isBulkInvoiceGeneratedWithoutErrors: boolean;
  recurringInvoiceData: {
    recurringInvoices: RecurringInvoices,
    isRequestSuccess?: boolean,
    isRequestInFlight?: boolean
    isDeleteRequestInFlight?: boolean
  };
  invoiceActionUpdated: boolean;
}

export const initialState: InvoiceState = {
  invoices: null,
  base64Data: null,
  ledgers: null,
  invoiceData: null,
  invoiceDataHasError: false,
  invoiceTemplateConditions: null,
  isInvoiceGenerated: false,
  visitedFromPreview: false,
  settings: null,
  isLoadingInvoices: false,
  isBulkInvoiceGenerated: false,
  isBulkInvoiceGeneratedWithoutErrors: false,
  recurringInvoiceData: {
    recurringInvoices: null,
  },
  invoiceActionUpdated: false
};

export function InvoiceReducer(state = initialState, action: CustomActions): InvoiceState {
  switch (action.type) {
    case COMMON_ACTIONS.RESET_APPLICATION_DATA: {
      return Object.assign({}, state, initialState);
    }
    case INVOICE_ACTIONS.GET_ALL_INVOICES_RESPONSE: {
      let newState = _.cloneDeep(state);
      let res: BaseResponse<GetAllInvoicesPaginatedResponse, CommonPaginatedRequest> = action.payload;
      if (res.status === 'success') {
        newState.invoices = res.body;
        return Object.assign({}, state, newState);
      }
      return Object.assign({}, state, newState);
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
      newState.isBulkInvoiceGenerated = false;
      newState.isBulkInvoiceGeneratedWithoutErrors = false;
      let res: BaseResponse<GetAllLedgersOfInvoicesResponse, CommonPaginatedRequest> = action.payload;
      if (res.status === 'success') {
        let body = _.cloneDeep(res.body);
        if (body.results.length > 0) {
          body.results.map((item: ILedgersInvoiceResult) => {
            item.isSelected = (item.isSelected) ? true : false;
            item.hasGenerationErr = false;
          });
        }
        newState.ledgers = body;
        return Object.assign({}, state, newState);
      } else {
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
        } else {
          return item.isSelected = false;
        }
      });
      return Object.assign({}, state, newState);
    }
    // case INVOICE_ACTIONS.PREVIEW_INVOICE_RESPONSE: {
    //   let newState = _.cloneDeep(state);
    //   let res: BaseResponse<PreviewInvoiceResponseClass, PreviewInvoiceRequest> = action.payload;
    //   if (res.status === 'success') {
    //     newState.invoiceData = res.body;
    //   } else {
    //     newState.invoiceDataHasError = true;
    //   }
    //   return {...state, ...newState};
    // }
    case INVOICE_ACTIONS.PREVIEW_INVOICE:
    case INVOICE_ACTIONS.PREVIEW_OF_GENERATED_INVOICE: {
      return {...state, invoiceData: null, invoiceDataHasError: false};
    }
    case INVOICE_ACTIONS.PREVIEW_OF_GENERATED_INVOICE_RESPONSE: {
      let newState = _.cloneDeep(state);
      let res: BaseResponse<PreviewInvoiceResponseClass, string> = action.payload;
      if (res.status === 'success') {
        newState.invoiceData = res.body;
      } else {
        newState.invoiceDataHasError = true;
      }
      return {...state, ...newState};
    }
    case INVOICE_ACTIONS.VISIT_FROM_PREVIEW: {
      return Object.assign({}, state, {visitedFromPreview: true});
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
        visitedFromPreview: false,
        isBulkInvoiceGenerated: false,
        isBulkInvoiceGeneratedWithoutErrors: false
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
        // newState.isInvoiceGenerated = true;
        newState.ledgers.results = _.remove(newState.ledgers.results, (item: ILedgersInvoiceResult) => {
          return !item.isSelected;
        });
        return Object.assign({}, state, newState);
      }
      return state;
    }

    case INVOICE_ACTIONS.GENERATE_BULK_INVOICE_RESPONSE: {
      let newState = _.cloneDeep(state);
      let res: BaseResponse<any, GenerateBulkInvoiceRequest[]> = action.payload;
      let reqObj: GenerateBulkInvoiceRequest[] = action.payload.request;
      // Check if requested form ledger
      if (res.status === 'success' && action.payload.queryString && action.payload.queryString.requestedFrom === 'ledger') {
        return state;
      }
      if (res.status === 'success' && reqObj.length > 0) {
        // check for failed entries
        if (_.isArray(res.body) && res.body.length > 0) {
          let failedEntriesArr: string[] = [];
          let needToRemoveEleArr: string[] = [];
          _.forEach(res.body, (item: IBulkInvoiceGenerationFalingError) => {
            _.forEach(item.failedEntries, (uniqueName: string) => {
              failedEntriesArr.push(uniqueName);
              newState.ledgers.results = _.map(newState.ledgers.results, (o: ILedgersInvoiceResult) => {
                if (o.uniqueName === uniqueName) {
                  o.hasGenerationErr = true;
                  o.errMsg = item.reason;
                }
                return o;
              });
            });
          });
          _.forEach(reqObj, (item: GenerateBulkInvoiceRequest) => {
            _.forEach(item.entries, (uniqueName: string) => {
              // find index and push
              if (_.indexOf(failedEntriesArr, uniqueName) === -1) {
                needToRemoveEleArr.push(uniqueName);
              }
            });
          });

          _.forEach(needToRemoveEleArr, (uniqueName: string) => {
            newState.ledgers.results = _.remove(newState.ledgers.results, (o: ILedgersInvoiceResult) => {
              return o.uniqueName !== uniqueName;
            });
          });

        } else if (typeof res.body === 'string') {
          _.forEach(reqObj, (item: GenerateBulkInvoiceRequest) => {
            _.forEach(item.entries, (uniqueName: string) => {
              newState.ledgers.results = _.remove(newState.ledgers.results, (o: ILedgersInvoiceResult) => {
                return o.uniqueName !== uniqueName;
              });
            });
          });
          if (newState.ledgers.results.length === 0) {
            newState.isBulkInvoiceGeneratedWithoutErrors = true;
          }
        }
        newState.isBulkInvoiceGenerated = true;
        return Object.assign({}, state, newState);
      }
      newState.isBulkInvoiceGenerated = true;
      return Object.assign({}, state, newState);
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
    // case INVOICE_ACTIONS.DELETE_INVOICE_RESPONSE: {
    //   let newState = _.cloneDeep(state);
    //   let res: BaseResponse<string, string> = action.payload;
    //   if (res.status === 'success') {
    //     let indx = newState.invoices.results.findIndex((o) => o.invoiceNumber === res.request);
    //     if (indx > -1) {
    //       newState.invoices.results.splice(indx, 1);
    //     }
    //     return Object.assign({}, state, newState);
    //   }
    //   return state;
    // }
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
        newState.settings.companyCashFreeSettings = form.companyCashFreeSettings;
        newState.settings.companyEmailSettings = form.companyEmailSettings;
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
    case INVOICE_ACTIONS.ACTION_ON_INVOICE: {
      let newState = _.cloneDeep(state);
      newState.invoiceActionUpdated = false;
      return Object.assign({}, state, newState);
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
        newState.invoiceActionUpdated = true;
        return Object.assign({}, state, newState);
      }
      return state;
    }
    case INVOICE.RECURRING.GET_RECURRING_INVOICE_DATA_RESPONSE: {
      const s = {...state, recurringInvoiceData: {...state.recurringInvoiceData, recurringInvoices: prepareObject(action.payload)}};
      return s;
    }
    case INVOICE.RECURRING.CREATE_RECURRING_INVOICE: {
      const s = {...state, recurringInvoiceData: {...state.recurringInvoiceData, isRequestInFlight: true, isRequestSuccess: false}};
      return s;
    }
    case INVOICE.RECURRING.CREATE_RECURRING_INVOICE_RESPONSE: {
      const s = {...state, recurringInvoiceData: {...state.recurringInvoiceData, isRequestInFlight: false, isRequestSuccess: !!action.payload}};
      return s;
    }
    case INVOICE.RECURRING.UPDATE_RECURRING_INVOICE: {
      const s = {...state, recurringInvoiceData: {...state.recurringInvoiceData, isRequestInFlight: true, isRequestSuccess: false}};
      return s;
    }
    case INVOICE.RECURRING.DELETE_RECURRING_INVOICE: {
      const s = {...state, recurringInvoiceData: {...state.recurringInvoiceData, isDeRequestInFlight: true, isRequestSuccess: false}};
      return s;
    }
    case INVOICE.RECURRING.DELETE_RECURRING_INVOICE_RESPONSE: {
      if (action.payload) {
        const invoice = state.recurringInvoiceData.recurringInvoices.recurringVoucherDetails
          .find(p => p.uniqueName === action.payload);
        invoice.status = 'inactive';
        const recurringVoucherDetails = state.recurringInvoiceData.recurringInvoices.recurringVoucherDetails
          .filter(p => p.uniqueName !== action.payload)
          .concat(invoice);
        return {
          ...state, recurringInvoiceData: {
            ...state.recurringInvoiceData,
            recurringInvoices: {...state.recurringInvoiceData.recurringInvoices, recurringVoucherDetails},
            isDeleteRequestInFlight: false, isRequestSuccess: true
          }
        };
      }
      return {...state, recurringInvoiceData: {...state.recurringInvoiceData, isDeleteRequestInFlight: false, isRequestSuccess: false}};
    }
    case INVOICE.RECURRING.UPDATE_RECURRING_INVOICE_RESPONSE: {
      if (action.payload) {
        const recurringVoucherDetails = state.recurringInvoiceData.recurringInvoices.recurringVoucherDetails
          .filter(p => p.uniqueName !== action.payload.uniqueName)
          .concat(action.payload);
        return {
          ...state, recurringInvoiceData: {
            ...state.recurringInvoiceData,
            recurringInvoices: {...state.recurringInvoiceData.recurringInvoices, recurringVoucherDetails},
            isRequestInFlight: false, isRequestSuccess: true
          }
        };
      }
      return {...state, recurringInvoiceData: {...state.recurringInvoiceData, isRequestInFlight: false, isRequestSuccess: false}};
    }
    case INVOICE_RECEIPT_ACTIONS.UPDATE_INVOICE_RECEIPT_RESPONSE: {
      return Object.assign({}, state, {
        isInvoiceGenerated: true
      });
    }
    case LEDGER.GENERATE_BULK_LEDGER_INVOICE_RESPONSE: {
      let newState = _.cloneDeep(state);
      let res: BaseResponse<any, GenerateBulkInvoiceRequest[]> = action.payload;
      let reqObj: GenerateBulkInvoiceRequest[] = action.payload.request;
      // Check if requested form ledger
      if (res.status === 'success' && action.payload.queryString && action.payload.queryString.requestedFrom === 'ledger') {
        return state;
      }
      if (res.status === 'success' && reqObj.length > 0) {
        // check for failed entries
        if (_.isArray(res.body) && res.body.length > 0) {
          let failedEntriesArr: string[] = [];
          let needToRemoveEleArr: string[] = [];
          _.forEach(res.body, (item: IBulkInvoiceGenerationFalingError) => {
            _.forEach(item.failedEntries, (uniqueName: string) => {
              failedEntriesArr.push(uniqueName);
              newState.ledgers.results = _.map(newState.ledgers.results, (o: ILedgersInvoiceResult) => {
                if (o.uniqueName === uniqueName) {
                  o.hasGenerationErr = true;
                  o.errMsg = item.reason;
                }
                return o;
              });
            });
          });
          _.forEach(reqObj, (item: GenerateBulkInvoiceRequest) => {
            _.forEach(item.entries, (uniqueName: string) => {
              // find index and push
              if (_.indexOf(failedEntriesArr, uniqueName) === -1) {
                needToRemoveEleArr.push(uniqueName);
              }
            });
          });

          _.forEach(needToRemoveEleArr, (uniqueName: string) => {
            newState.ledgers.results = _.remove(newState.ledgers.results, (o: ILedgersInvoiceResult) => {
              return o.uniqueName !== uniqueName;
            });
          });

        } else if (typeof res.body === 'string') {
          _.forEach(reqObj, (item: GenerateBulkInvoiceRequest) => {
            _.forEach(item.entries, (uniqueName: string) => {
              newState.ledgers.results = _.remove(newState.ledgers.results, (o: ILedgersInvoiceResult) => {
                return o.uniqueName !== uniqueName;
              });
            });
          });
          if (newState.ledgers.results.length === 0) {
            newState.isBulkInvoiceGeneratedWithoutErrors = true;
          }
        }
        newState.isBulkInvoiceGenerated = true;
        newState.isInvoiceGenerated = true;
        return Object.assign({}, state, newState);
      }
      newState.isBulkInvoiceGenerated = true;
      newState.isInvoiceGenerated = true;
      return Object.assign({}, state, newState);
    }
    default: {
      return state;
    }
  }
}

const prepareObject = (obj: RecurringInvoices) => {
  if (obj) {
    obj.recurringVoucherDetails = obj.recurringVoucherDetails.map(m => {
      m.isSelected = false;
      return m;
    });
  }
  return obj;
};
