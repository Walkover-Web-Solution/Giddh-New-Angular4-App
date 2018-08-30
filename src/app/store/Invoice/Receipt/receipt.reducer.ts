import { CustomActions } from '../../customActions';
import { INVOICE_RECEIPT_ACTIONS } from '../../../actions/invoice/receipt/receipt.const';
import { ReciptDeleteRequest, ReciptRequest, ReciptRequestParams, ReciptResponse } from '../../../models/api-models/recipt';
import { BaseResponse } from '../../../models/api-models/BaseResponse';

export interface ReceiptState {
  data: ReciptResponse;
  isGetAllRequestInProcess: boolean;
  isGetAllRequestSuccess: boolean;
  isDeleteInProcess: boolean;
  isDeleteSuccess: boolean;
}

const initialState: ReceiptState = {
  data: null,
  isGetAllRequestInProcess: false,
  isGetAllRequestSuccess: false,
  isDeleteInProcess: false,
  isDeleteSuccess: false
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

    default:
      return state;
  }
}
