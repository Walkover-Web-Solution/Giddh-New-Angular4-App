import { CustomActions } from '../../customActions';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { INVOICE_ACTIONS, EWAYBILL_ACTIONS } from 'app/actions/invoice/invoice.const';
import { IEwayBillGenerateResponse, IEwayBillAllList, IEwayBillTransporter, IAllTransporterDetails } from 'app/models/api-models/Invoice';

export interface EwayBillState {
  EwayBillGenerateResponse: IEwayBillGenerateResponse;
  EwayBillList: IEwayBillAllList;
  TransporterListDetails: IAllTransporterDetails;
  TransporterList: IEwayBillTransporter[];
  GeneratedEwayBillResponse: any;
  isGetAllEwaybillRequestInProcess: boolean;
  isGetAllEwaybillRequestSuccess: boolean;
  isDeleteEwqaybillInProcess: boolean;
  isDeleteSuccess: boolean;
  isEwaybillAddnewUserInProcess?: boolean;
  isEwaybillUserCreationSuccess?: boolean;
   isGenerateEwaybillInProcess?: boolean;
  isGenerateEwaybilSuccess?: boolean;

  isUserLoggedInEwaybillSuccess?: boolean;
  base64DataEway: string;

  isAddnewTransporterInProcess: boolean;
  isAddnewTransporterInSuccess: boolean;
}

const initialState: EwayBillState = {
  EwayBillGenerateResponse: null,
  EwayBillList: null,
  TransporterListDetails: null,
  TransporterList: [],
  GeneratedEwayBillResponse: null,
  isGetAllEwaybillRequestInProcess: false,
  isGetAllEwaybillRequestSuccess: false,
  isDeleteEwqaybillInProcess: false,
  isDeleteSuccess: false,
  isEwaybillAddnewUserInProcess: false,
  isEwaybillUserCreationSuccess: false,
   isGenerateEwaybillInProcess: false,
  isGenerateEwaybilSuccess: false,
  isUserLoggedInEwaybillSuccess: false,
  base64DataEway: null,

  isAddnewTransporterInProcess: false,
  isAddnewTransporterInSuccess: false
};

export function EwayBillreducer(state: EwayBillState = initialState, action: CustomActions): EwayBillState {
  switch (action.type) {

    case EWAYBILL_ACTIONS.GET_All_LIST_EWAYBILLS: {
      let res: BaseResponse<IEwayBillAllList, any> = action.payload;
      return Object.assign({}, state, {
        isGetAllEwaybillRequestSuccess: false,
        isGetAllEwaybillRequestInProcess: true
      });
    }

    case EWAYBILL_ACTIONS.GET_All_LIST_EWAYBILLS_RESPONSE: {
      let newState = _.cloneDeep(state);
      let res: BaseResponse<IEwayBillAllList, any> = action.payload;
      if (res.status === 'success') {
        newState.EwayBillList = res.body;
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
        d.isEwaybillAddnewUserInProcess = false;
        d.isEwaybillUserCreationSuccess = true;
        d.isUserLoggedInEwaybillSuccess = true;
        return Object.assign({}, state, d);
      } if (ewaybillLoginResponse.status === 'error') {
         let d = _.cloneDeep(state);
         d.isEwaybillAddnewUserInProcess = false;
        d.isEwaybillUserCreationSuccess = false;
         d.isUserLoggedInEwaybillSuccess = false;
          return Object.assign({}, state, d);
      }
      return state;
    }

      case EWAYBILL_ACTIONS.GENERATE_EWAYBILL: {
         return Object.assign({}, state, {isGenerateEwaybillInProcess: true, isGenerateEwaybilSuccess: false});
      // return {
      //   ...state,
      //   isGenerateEwaybillInProcess: true
      // };EWAYBILL_ACTIONS.GET_GENERATED_EWAYBILLS
    }

    case EWAYBILL_ACTIONS.GENERATE_EWAYBILL_RESPONSE: {

       let ewaybillGeneratedResponse: BaseResponse<any, any> = action.payload;
      if (ewaybillGeneratedResponse.status === 'success') {
        let d = _.cloneDeep(state);
        d.isGenerateEwaybillInProcess = false;
        d.isGenerateEwaybilSuccess = true;
        return Object.assign({}, state, d);
      } if (ewaybillGeneratedResponse.status === 'error') {
         let d = _.cloneDeep(state);
         d.isGenerateEwaybillInProcess = false;
        d.isGenerateEwaybilSuccess = false;
          return Object.assign({}, state, d);
      }
      }
      // EWAYBILL_ACTIONS.IS_LOOGEDIN_USER_EWAYBILL_RESPONSE

 case EWAYBILL_ACTIONS.IS_LOOGEDIN_USER_EWAYBILL_RESPONSE: {

       let ewaybillGeneratedResponse: BaseResponse<any, any> = action.payload;
      if (ewaybillGeneratedResponse.status === 'success') {
        let d = _.cloneDeep(state);
        d.isUserLoggedInEwaybillSuccess = true;
        return Object.assign({}, state, d);
      } if (ewaybillGeneratedResponse.status === 'error') {
         let d = _.cloneDeep(state);
         d.isUserLoggedInEwaybillSuccess = false;
          return Object.assign({}, state, d);
      }
      }
      // Transporter

case EWAYBILL_ACTIONS.ADD_TRANSPORTER: {
      return Object.assign({}, state, {isAddnewTransporterInProcess: true, isAddnewTransporterInSuccess: false});
            }
 case EWAYBILL_ACTIONS.ADD_TRANSPORTER_RESPONSE: {

       let addTransportResponse: BaseResponse<any, any> = action.payload;
      if (addTransportResponse.status === 'success') {
        let d = _.cloneDeep(state);
        d.TransporterList = addTransportResponse.body;
        d.isAddnewTransporterInProcess = false;
        d.isAddnewTransporterInSuccess = true;
        return Object.assign({}, state, {
          TransporterList: [...state.TransporterList, action.payload.body],
          isAddnewTransporterInProcess: false,
          isAddnewTransporterInSuccess: true,
        });
      } if (addTransportResponse.status === 'error') {
         let d = _.cloneDeep(state);
         d.isAddnewTransporterInProcess = false;
        d.isAddnewTransporterInSuccess = false;
          return Object.assign({}, state, d);
      }
      }
       case EWAYBILL_ACTIONS.GET_ALL_TRANSPORTER_RESPONSE: {
      let newState = _.cloneDeep(state);
      let res: BaseResponse<IAllTransporterDetails, any> = action.payload;
      if (res.status === 'success') {
        console.log('TransporterList', res);
        newState.TransporterListDetails = res.body;
         newState.TransporterList = res.body.results;
      } else {
        //  newState.isGetAllEwaybillRequestSuccess = false;
        //  newState.isGetAllEwaybillRequestInProcess = false;
      }
      return Object.assign({}, state, newState);
    }

    case EWAYBILL_ACTIONS.DELETE_TRANSPORTER_RESPONSE: {

       let res = action.payload;
 return Object.assign({}, state, {
          isAddnewTransporterInProcess: false,
          isAddnewTransporterInSuccess: true,
        });

    }
       // EWAYBILL_ACTIONS.DOWNLOAD_EWAYBILL_RESPONSE
//  case EWAYBILL_ACTIONS.DOWNLOAD_EWAYBILL_RESPONSE: {
//       let newState = _.cloneDeep(state);
//       let res: BaseResponse<any, any> = action.payload;
//       if (res) {
//         newState.base64Data = res;
//         console.log('reduc DOWNLOAD_EWAYBILL_RESPONSE ', res);
//         return Object.assign({}, state, newState);
//       }
//       return state;
//     }
// case EWAYBILL_ACTIONS.GET_All_LIST_EWAYBILLS_RESPONSE: {

//        let getEwaybillListResponse: BaseResponse<IEwayBillAllList, any> = action.payload;
//       if (getEwaybillListResponse.status === 'success') {
//         console.log('getEwaybillListResponse list success', getEwaybillListResponse);
//         // let d = _.cloneDeep(state);
//         // d.isGenerateEwaybillInProcess = false;
//         // d.isGenerateEwaybilSuccess = true;
//         // return Object.assign({}, state, d);
//       } if (getEwaybillListResponse.status === 'error') {
//         console.log('getEwaybillListResponse list failed', getEwaybillListResponse);
//         // console.log('created company failed', state);
//         //  let d = _.cloneDeep(state);
//         //  d.isGenerateEwaybillInProcess = false;
//         // d.isGenerateEwaybilSuccess = false;
//         //   return Object.assign({}, state, d);
//       }
//       }

    default:
      return state;
  }
}
