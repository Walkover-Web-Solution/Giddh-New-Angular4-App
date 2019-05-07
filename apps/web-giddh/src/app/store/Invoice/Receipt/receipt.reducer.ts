import { CustomActions } from '../../customActions';
import { INVOICE_RECEIPT_ACTIONS } from '../../../actions/invoice/receipt/receipt.const';
import { ReciptDeleteRequest, ReciptRequest, ReciptRequestParams, ReciptResponse, Voucher } from '../../../models/api-models/recipt';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { INVOICE_ACTIONS }  from 'apps/web-giddh/src/app/actions/invoice/invoice.const';
import { ILedgersInvoiceResult, PreviewInvoiceRequest, PreviewInvoiceResponseClass }  from 'apps/web-giddh/src/app/models/api-models/Invoice';

export interface ReceiptState {
  vouchers: ReciptResponse;
  isGetAllRequestInProcess: boolean;
  isGetAllRequestSuccess: boolean;
  isDeleteInProcess: boolean;
  isDeleteSuccess: boolean;
  voucher: Voucher;
  voucherDetailsInProcess: boolean;
  base64Data: string;
  invoiceDataHasError: boolean;
}

const initialState: ReceiptState = {
  vouchers: null,
  isGetAllRequestInProcess: true,
  isGetAllRequestSuccess: false,
  isDeleteInProcess: false,
  isDeleteSuccess: false,
  voucher: null,
  voucherDetailsInProcess: true,
  base64Data: null,
  invoiceDataHasError: false
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
      let res: BaseResponse<ReciptResponse, ReciptRequestParams> = action.payload;
      if (res.status === 'success') {
        newState.vouchers = res.body;
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

    case INVOICE_ACTIONS.ACTION_ON_INVOICE_RESPONSE: {
      let newState = _.cloneDeep(state);
      let res: BaseResponse<string, string> = action.payload;
      if (res.status === 'success') {
        // Just refreshing the list for now
        newState.vouchers = null;
        return Object.assign({}, state, newState);
      }
      return state;
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
      return {...state, ...newState};
    }

    case INVOICE_ACTIONS.PREVIEW_OF_GENERATED_INVOICE_RESPONSE: {
      let newState = _.cloneDeep(state);
      let res: BaseResponse<PreviewInvoiceResponseClass, string> = action.payload;
      if (res.status === 'success') {
        newState.voucher = res.body;
      } else {
        newState.invoiceDataHasError = true;
      }
      return {...state, ...newState};
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
    default:
      return state;
  }
}
