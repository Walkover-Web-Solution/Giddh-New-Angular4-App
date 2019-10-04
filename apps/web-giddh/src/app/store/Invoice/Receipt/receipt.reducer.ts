import { CustomActions } from '../../customActions';
import { INVOICE_RECEIPT_ACTIONS } from '../../../actions/invoice/receipt/receipt.const';
import { InvoiceReceiptFilter, ReciptDeleteRequest, ReciptRequest, ReciptRequestParams, ReciptResponse, Voucher } from '../../../models/api-models/recipt';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { INVOICE_ACTIONS } from 'apps/web-giddh/src/app/actions/invoice/invoice.const';
import { ILedgersInvoiceResult, PreviewInvoiceRequest, PreviewInvoiceResponseClass } from 'apps/web-giddh/src/app/models/api-models/Invoice';
import { GenericRequestForGenerateSCD, VoucherClass } from '../../../models/api-models/Sales';
import * as _ from '../../../lodash-optimized';
import { SalesRegisteDetailedResponse } from '../../../models/api-models/Reports';

export interface ReceiptState {
  vouchers: ReciptResponse;
  lastVouchers: ReciptResponse;
  isGetAllRequestInProcess: boolean;
  isGetAllRequestSuccess: boolean;
  isDeleteInProcess: boolean;
  isDeleteSuccess: boolean;
  voucher: Voucher | VoucherClass;
  voucherDetailsInProcess: boolean;
  base64Data: string;
  invoiceDataHasError: boolean;
  voucherNoForDetails: string;
  voucherNoForDetailsAction: string;
  actionOnInvoiceInProcess: boolean;
  actionOnInvoiceSuccess: boolean;
  isGetSalesDetailsInProcess: boolean;
  isGetSalesDetailsSuccess: boolean;
  SalesRegisteDetailedResponse: SalesRegisteDetailedResponse
}

const initialState: ReceiptState = {
  vouchers: null,
  lastVouchers: null,
  isGetAllRequestInProcess: true,
  isGetAllRequestSuccess: false,
  isDeleteInProcess: false,
  isDeleteSuccess: false,
  voucher: null,
  voucherDetailsInProcess: true,
  base64Data: null,
  invoiceDataHasError: false,
  voucherNoForDetails: null,
  voucherNoForDetailsAction: null,
  actionOnInvoiceInProcess: false,
  actionOnInvoiceSuccess: false,
  isGetSalesDetailsInProcess: false,
  isGetSalesDetailsSuccess: false,
  SalesRegisteDetailedResponse: null
};

export function Receiptreducer(state: ReceiptState = initialState, action: CustomActions): ReceiptState {
  switch (action.type) {

    case INVOICE_RECEIPT_ACTIONS.GET_ALL_INVOICE_RECEIPT: {
      let res: BaseResponse<ReciptResponse, ReciptRequestParams> = action.payload;
      return Object.assign({}, state, {
        isGetAllRequestSuccess: false,
        isGetAllRequestInProcess: true
      });
    }

    case INVOICE_RECEIPT_ACTIONS.GET_ALL_INVOICE_RECEIPT_RESPONSE: {
      let newState = _.cloneDeep(state);
      let res: BaseResponse<ReciptResponse, InvoiceReceiptFilter> = action.payload;
      if (res.status === 'success') {
        newState[res.request.isLastInvoicesRequest ? 'lastVouchers' : 'vouchers'] = res.body;
        newState.isGetAllRequestSuccess = true;
      }
      newState.isGetAllRequestInProcess = false;
      return Object.assign({}, state, newState);
    }

    case INVOICE_RECEIPT_ACTIONS.DELETE_INVOICE_RECEIPT: {
      return {
        ...state,
        isDeleteInProcess: true,
        isDeleteSuccess: false
      };
    }

    case INVOICE_RECEIPT_ACTIONS.DELETE_INVOICE_RECEIPT_RESPONSE: {
      let newState = _.cloneDeep(state);
      let res: BaseResponse<string, ReciptDeleteRequest> = action.payload;
      if (res.status === 'success') {
        let indx = newState.vouchers.items.findIndex(f => f.voucherNumber === res.request.invoiceNumber);
        if (indx > -1) {
          newState.vouchers.items.splice(indx, 1);
          newState.isDeleteSuccess = true;
          newState.isDeleteInProcess = false;
        }
        return Object.assign({}, state, newState);
      }
      return {
        ...state,
        isDeleteInProcess: false,
        isDeleteSuccess: false
      };
    }

    case INVOICE_RECEIPT_ACTIONS.UPDATE_INVOICE_RECEIPT_RESPONSE: {
      let newState = _.cloneDeep(state);
      let res: BaseResponse<string, ReciptRequest> = action.payload;
      if (res.status === 'success') {
        newState.vouchers.items.map(a => {
          if (a.voucherNumber === res.request.voucher.voucherDetails.voucherNumber) {
            a = res.request;
          }
          return a;
        });

        return Object.assign({}, state, newState);
      }
      return state;
    }

    case INVOICE_RECEIPT_ACTIONS.UPDATE_VOUCHER_DETAILS_AFTER_VOUCHER_UPDATE: {
      let vouchers = { ...state.vouchers };
      let result = action.payload as BaseResponse<VoucherClass, GenericRequestForGenerateSCD>;
      return {
        ...state,
        vouchers: {
          ...vouchers,
          items: vouchers.items.map(m => {
            if (m.voucherNumber === result.body.voucherDetails.voucherNumber) {
              m.grandTotal = result.body.voucherDetails.grandTotal;
            }
            return m;
          })
        }
      }
    }

    case INVOICE_RECEIPT_ACTIONS.GET_VOUCHER_DETAILS: {
      return {
        ...state,
        voucherDetailsInProcess: true
      };
    }

    case INVOICE_RECEIPT_ACTIONS.GET_VOUCHER_DETAILS_RESPONSE: {
      return {
        ...state,
        voucherDetailsInProcess: false,
        voucher: action.payload.body ? action.payload.body : null
      };
    }
    case INVOICE_RECEIPT_ACTIONS.GET_VOUCHER_DETAILS_RESPONSEV4: {
      return {
        ...state,
        voucherDetailsInProcess: false,
        voucher: action.payload.body ? action.payload.body : null
      };
    }
    case INVOICE_RECEIPT_ACTIONS.RESET_VOUCHER_DETAILS: {
      return {
        ...state,
        voucherDetailsInProcess: false,
        voucher: null
      };
    }

    case INVOICE_RECEIPT_ACTIONS.DOWNLOAD_VOUCHER_REQUEST: {
      let newState = _.cloneDeep(state);
      newState.base64Data = null;
      return Object.assign({}, state, newState);
    }

    case INVOICE_RECEIPT_ACTIONS.DOWNLOAD_VOUCHER_RESPONSE: {
      let newState = _.cloneDeep(state);
      let res: BaseResponse<any, any> = action.payload;
      if (res) {
        newState.base64Data = res;
        return Object.assign({}, state, newState);
      }
      return state;
    }

    case INVOICE_ACTIONS.ACTION_ON_INVOICE: {
      return {
        ...state,
        actionOnInvoiceInProcess: true,
        actionOnInvoiceSuccess: false
      }
    }

    case INVOICE_ACTIONS.ACTION_ON_INVOICE_RESPONSE: {
      return {
        ...state,
        actionOnInvoiceInProcess: false,
        actionOnInvoiceSuccess: action.payload.status === 'success'
      }
    }

    case INVOICE_ACTIONS.DELETE_INVOICE_RESPONSE: {
      let newState = _.cloneDeep(state);
      let res: BaseResponse<string, string> = action.payload;
      if (res.status === 'success') {
        let indx = newState.vouchers.items.findIndex((o) => o.voucherNumber === res.request);
        if (indx > -1) {
          newState.vouchers.items.splice(indx, 1);
        }
        return Object.assign({}, state, newState);
      }
      return state;
    }
    case INVOICE_ACTIONS.PREVIEW_INVOICE_RESPONSE: {
      let newState = _.cloneDeep(state);
      let res: BaseResponse<PreviewInvoiceResponseClass, PreviewInvoiceRequest> = action.payload;
      if (res.status === 'success') {
        newState.voucher = res.body;
      } else {
        newState.invoiceDataHasError = true;
      }
      return { ...state, ...newState };
    }

    case INVOICE_ACTIONS.PREVIEW_OF_GENERATED_INVOICE_RESPONSE: {
      let newState = _.cloneDeep(state);
      let res: BaseResponse<PreviewInvoiceResponseClass, string> = action.payload;
      if (res.status === 'success') {
        newState.voucher = res.body;
      } else {
        newState.invoiceDataHasError = true;
      }
      return { ...state, ...newState };
    }
    case INVOICE_ACTIONS.RESET_INVOICE_DATA: {
      return Object.assign({}, state, {
        voucher: null
        // base64Data:
      });
    }
    case INVOICE_ACTIONS.GENERATE_INVOICE_RESPONSE: {
      let newState = _.cloneDeep(state);
      let res: BaseResponse<string, string> = action.payload;
      if (res.status === 'success') {
        newState.isInvoiceGenerated = true;
        newState.ledgers.results = _.remove(newState.vouchers.results, (item: ILedgersInvoiceResult) => {
          return !item.isSelected;
        });
        return Object.assign({}, state, newState);
      }
      return state;
    }

    case INVOICE_RECEIPT_ACTIONS.INVOICE_SET_VOUCHER_FOR_DETAILS: {
      return {
        ...state,
        voucherNoForDetails: action.payload.voucherNo,
        voucherNoForDetailsAction: action.payload.action
      }
    }

    case INVOICE_RECEIPT_ACTIONS.INVOICE_RESET_VOUCHER_FOR_DETAILS: {
      return {
        ...state,
        voucherNoForDetails: null,
        voucherNoForDetailsAction: null
      }
    }
    case INVOICE_RECEIPT_ACTIONS.GET_SALESRAGISTED_DETAILS: {
      return Object.assign({}, state, {
        isGetSalesDetailsInProcess: true,
        isGetSalesDetailsSuccess: false
      });
    }

    case INVOICE_RECEIPT_ACTIONS.GET_SALESRAGISTED_DETAILS_RESPONSE: {
      let newState = _.cloneDeep(state);
      let res: BaseResponse<string, SalesRegisteDetailedResponse> = action.payload;
      if (res.status === 'success') {
        newState.isGetSalesDetailsInProcess = false;
        newState.isGetSalesDetailsSuccess = true;
        newState.SalesRegisteDetailedResponse = res.body;
        return Object.assign({}, state, newState);
      }
      return state;
    }

    default:
      return state;
  }
}
