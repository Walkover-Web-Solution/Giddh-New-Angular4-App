import { CustomActions } from '../../customActions';
import { INVOICE_RECEIPT_ACTIONS } from '../../../actions/invoice/receipt/receipt.const';
import { ReciptDeleteRequest, ReciptRequest, ReciptRequestParams, ReciptResponse, Voucher } from '../../../models/api-models/recipt';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { INVOICE_ACTIONS } from 'app/actions/invoice/invoice.const';
import { PreviewInvoiceResponseClass, PreviewInvoiceRequest } from 'app/models/api-models/Invoice';

export interface ReceiptState {
  data: ReciptResponse;
  isGetAllRequestInProcess: boolean;
  isGetAllRequestSuccess: boolean;
  isDeleteInProcess: boolean;
  isDeleteSuccess: boolean;
  voucher: Voucher;
  voucherDetailsInProcess: boolean;
  base64Data: string;
}

const initialState: ReceiptState = {
  data: null,
  isGetAllRequestInProcess: false,
  isGetAllRequestSuccess: false,
  isDeleteInProcess: false,
  isDeleteSuccess: false,
  voucher: null,
  voucherDetailsInProcess: false,
  base64Data: null
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
      let res: BaseResponse<ReciptResponse, ReciptRequestParams> = action.payload;
      if (res.status === 'success') {
        return Object.assign({}, state, {
          data: res.body,
          isGetAllRequestSuccess: true,
          isGetAllRequestInProcess: false
        });
      }
      return Object.assign({}, state, {
        data: null,
        isGetAllRequestSuccess: false,
        isGetAllRequestInProcess: false
      });
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
        let indx = newState.data.items.findIndex(f => f.voucherNumber === res.request.invoiceNumber);
        if (indx > -1) {
          newState.data.items.splice(indx, 1);
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
        newState.data.items.map(a => {
          if (a.voucherNumber === res.request.voucher.voucherDetails.voucherNumber) {
            a = res.request;
          }
          return a;
        });

        return Object.assign({}, state, newState);
      }
      return state;
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
    case INVOICE_RECEIPT_ACTIONS.DOWNLOAD_VOUCHER_RESPONSE: {
      let newState = _.cloneDeep(state);
      let res: BaseResponse<any, any> = action.payload;
      if (res) {
        newState.base64Data = res;
        return Object.assign({}, state, newState);
      }
      return state;
    }

    case INVOICE_ACTIONS.ACTION_ON_INVOICE_RESPONSE: {
      let newState = _.cloneDeep(state);
      let res: BaseResponse<string, string> = action.payload;
      if (res.status === 'success') {
        // Just refreshing the list for now
        newState.data = null;
        return Object.assign({}, state, newState);
      }
      return state;
    }

    case INVOICE_ACTIONS.DELETE_INVOICE_RESPONSE: {
      let newState = _.cloneDeep(state);
      let res: BaseResponse<string, string> = action.payload;
      if (res.status === 'success') {
        let indx = newState.data.items.findIndex((o) => o.voucherNumber === res.request);
        if (indx > -1) {
          newState.data.items.splice(indx, 1);
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
      return {...state, ...newState};
    }
    default:
      return state;
  }
}
