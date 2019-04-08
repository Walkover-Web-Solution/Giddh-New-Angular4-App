import { CustomActions } from '../../customActions';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { INVOICE_ACTIONS, EWAYBILL_ACTIONS } from 'app/actions/invoice/invoice.const';
import { IEwayBillListsResponse } from 'app/models/api-models/Invoice';

export interface EwayBillState {
  EwayBillLists: IEwayBillListsResponse;
  isGetAllEwaybillRequestInProcess: boolean;
  isGetAllEwaybillRequestSuccess: boolean;
  isDeleteEwqaybillInProcess: boolean;
  isDeleteSuccess: boolean;
}

const initialState: EwayBillState = {
  EwayBillLists: null,
  isGetAllEwaybillRequestInProcess: true,
  isGetAllEwaybillRequestSuccess: false,
  isDeleteEwqaybillInProcess: false,
  isDeleteSuccess: false,
};

export function EwayBillreducer(state: EwayBillState = initialState, action: CustomActions): EwayBillState {
  switch (action.type) {

    case EWAYBILL_ACTIONS.GET_GENERATED_EWAYBILLS: {
      let res: BaseResponse<IEwayBillListsResponse, any> = action.payload;
      return Object.assign({}, state, {
        isGetAllEwaybillRequestSuccess: false,
        isGetAllEwaybillRequestInProcess: true
      });
    }

    case EWAYBILL_ACTIONS.GET_GENERATED_EWAYBILLS_RESPONSE: {
      let newState = _.cloneDeep(state);
      let res: BaseResponse<IEwayBillListsResponse, any> = action.payload;
      if (res.status === 'success') {
        newState.EwayBillLists = res.body;
        newState.isGetAllEwaybillRequestSuccess = true;
      }
      newState.isGetAllEwaybillRequestInProcess = false;
      return Object.assign({}, state, newState);
    }

    // case INVOICE_ACTIONS.PREVIEW_OF_GENERATED_INVOICE_RESPONSE: {
    //   let newState = _.cloneDeep(state);
    //   let res: BaseResponse<PreviewInvoiceResponseClass, string> = action.payload;
    //   if (res.status === 'success') {
    //     newState.voucher = res.body;
    //   } else {
    //     newState.invoiceDataHasError = true;
    //   }
    //   return {...state, ...newState};
    // }
    // case INVOICE_ACTIONS.RESET_INVOICE_DATA: {
    //   return Object.assign({}, state, {
    //     voucher: null
    //     // base64Data:
    //   });
    // }
    default:
      return state;
  }
}
