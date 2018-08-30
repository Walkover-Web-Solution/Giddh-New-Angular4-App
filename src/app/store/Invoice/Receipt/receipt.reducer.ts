import { CustomActions } from '../../customActions';
import { INVOICE_RECEIPT_ACTIONS } from '../../../actions/invoice/receipt/receipt.const';
import { ReciptDeleteRequest, ReciptRequest, ReciptRequestParams, ReciptResponse } from '../../../models/api-models/recipt';
import { BaseResponse } from '../../../models/api-models/BaseResponse';

export interface ReceiptState {
  reciptResponseData: ReciptResponse;
  reciptDelete: ReciptDeleteRequest;
}

export const initialState: ReceiptState = {
  reciptResponseData: null,
  reciptDelete: null,
}

export function Receiptreducer(state = initialState, action: CustomActions): ReceiptState {
  switch (action.type) {
    case INVOICE_RECEIPT_ACTIONS.GET_ALL_INVOICE_RECEIPT_RESPONSE: {
      let newState = _.cloneDeep(state);
      let res: BaseResponse<ReciptResponse, ReciptRequestParams> = action.payload;
      if (res.status === 'sucess') {
        newState.reciptResponseData = res.body;
        return Object.assign({}, state, newState);
      }
      return Object.assign({}, state, newState);
    }
    case INVOICE_RECEIPT_ACTIONS.DELETE_INVOICE_RECEIPT_RESPONSE: {
      let newState = _.cloneDeep(state);
      let res: BaseResponse<string, ReciptDeleteRequest> = action.payload;
      if (res.status === 'sucess') {
        let indx = newState.reciptResponseData.items.findIndex(f => f.voucherNumber === res.request.invoiceNumber);
        if (indx > -1) {
          newState.reciptResponse.items.splice(indx, 1);
        }
        return Object.assign({}, state, newState);
      }
      return state;
    }

    case INVOICE_RECEIPT_ACTIONS.UPDATE_INVOICE_RECEIPT_RESPONSE: {
      let newState = _.cloneDeep(state);
      let res: BaseResponse<string, ReciptRequest> = action.payload;
      if (res.status === 'sucess') {
        newState.reciptResponseData.items.map(a => {
          if (a.voucherNumber === res.request.voucher.voucherDetails.voucherNumber) {
            a = res.request;
          }
          return a;
        });

        return Object.assign({}, state, newState);
      }
      return state;
    }
  }
}
