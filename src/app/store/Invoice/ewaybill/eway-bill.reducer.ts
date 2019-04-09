import { CustomActions } from '../../customActions';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { INVOICE_ACTIONS, EWAYBILL_ACTIONS } from 'app/actions/invoice/invoice.const';
import { IEwayBillListsResponse } from 'app/models/api-models/Invoice';

export interface EwayBillState {
  EwayBillLists: IEwayBillListsResponse;
  GeneratedEwayBillResponse: any;
  isGetAllEwaybillRequestInProcess: boolean;
  isGetAllEwaybillRequestSuccess: boolean;
  isDeleteEwqaybillInProcess: boolean;
  isDeleteSuccess: boolean;
  isEwaybillAddnewUserInProcess?: boolean;
  isEwaybillUserCreationSuccess?: boolean;
   isGenerateEwaybillInProcess?: boolean;
  isGenerateEwaybilSuccess?: boolean;
}

const initialState: EwayBillState = {
  EwayBillLists: null,
  GeneratedEwayBillResponse: null,
  isGetAllEwaybillRequestInProcess: false,
  isGetAllEwaybillRequestSuccess: false,
  isDeleteEwqaybillInProcess: false,
  isDeleteSuccess: false,
  isEwaybillAddnewUserInProcess: false,
  isEwaybillUserCreationSuccess: false,
   isGenerateEwaybillInProcess: false,
  isGenerateEwaybilSuccess: false,
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
       // newState.EwayBillLists = res.body;
        newState.isGetAllEwaybillRequestSuccess = true;
        newState.isGetAllEwaybillRequestInProcess = false;
      } else {
         newState.isGetAllEwaybillRequestSuccess = false;
         newState.isGetAllEwaybillRequestInProcess = false;
      }
      return Object.assign({}, state, newState);
    }// EWAYBILL_ACTIONS.LOGIN_EAYBILL_USER

case EWAYBILL_ACTIONS.LOGIN_EAYBILL_USER: {
      return Object.assign({}, state, {isEwaybillAddnewUserInProcess: true, isEwaybillUserCreationSuccess: false});
            }
    case EWAYBILL_ACTIONS.LOGIN_EAYBILL_USER_RESPONSE: {
      let ewaybillLoginResponse: BaseResponse<any, any> = action.payload;
      if (ewaybillLoginResponse.status === 'success') {
        let d = _.cloneDeep(state);
        console.log('created company', state);
        d.isEwaybillAddnewUserInProcess = false;
        d.isEwaybillUserCreationSuccess = true;
        return Object.assign({}, state, d);
      } if (ewaybillLoginResponse.status === 'error') {
        console.log('created company failed', state);
         let d = _.cloneDeep(state);
         d.isEwaybillAddnewUserInProcess = false;
        d.isEwaybillUserCreationSuccess = false;
          return Object.assign({}, state, d);
      }
      return state;
    }

      case EWAYBILL_ACTIONS.GENERATE_EWAYBILL: {
         return Object.assign({}, state, {isGenerateEwaybillInProcess: true, isGenerateEwaybilSuccess: false});
      // return {
      //   ...state,
      //   isGenerateEwaybillInProcess: true
      // };
    }

    case EWAYBILL_ACTIONS.GENERATE_EWAYBILL_RESPONSE: {

       let ewaybillGeneratedResponse: BaseResponse<any, any> = action.payload;
      if (ewaybillGeneratedResponse.status === 'success') {
        let d = _.cloneDeep(state);
        d.isGenerateEwaybillInProcess = false;
        d.isGenerateEwaybilSuccess = true;
        return Object.assign({}, state, d);
      } if (ewaybillGeneratedResponse.status === 'error') {
        console.log('created company failed', state);
         let d = _.cloneDeep(state);
         d.isGenerateEwaybillInProcess = false;
        d.isGenerateEwaybilSuccess = false;
          return Object.assign({}, state, d);
      }
      // return {
      //   ...state,
      //   isGenerateEwaybillInProcess: false,
      //   isGenerateEwaybilSuccess: true,
       // EwayBillLists: action.payload.body ? action.payload.body : null
      }

// EWAYBILL_ACTIONS.GENERATE_EWAYBILL
      // case CompanyActions.CREATE_COMPANY:
      // return Object.assign({}, state, {isCompanyCreationInProcess: true, isCompanyCreationSuccess: false});
    // case CompanyActions.CREATE_COMPANY_RESPONSE: {
    //   let companyResp: BaseResponse<CompanyResponse, CompanyRequest> = action.payload;
    //   if (companyResp.status === 'success') {
    //     let d = _.cloneDeep(state);
    //     d.isCompanyCreationInProcess = false;
    //     d.isCompanyCreationSuccess = true;
    //     d.isCompanyCreated = true;
    //     d.companies.push(companyResp.body);
    //     return Object.assign({}, state, d);
    //   }
    //   return state;
    // }
    // case INVOICE_ACTIONS.SEND_SMS_RESPONSE: {
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
