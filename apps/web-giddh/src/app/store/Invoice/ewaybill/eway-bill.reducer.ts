import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { EWAYBILL_ACTIONS } from '../../../actions/invoice/invoice.const';
import { IAllTransporterDetails, IEwayBillAllList, IEwayBillGenerateResponse, IEwayBillTransporter, UpdateEwayVehicle } from '../../../models/api-models/Invoice';
import { CustomActions } from '../../customActions';

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

    updateTransporterInProcess: boolean;
    updateTransporterSuccess: boolean;

    updateEwayvehicleInProcess: boolean;
    updateEwayvehicleSuccess: boolean;
    cancelEwayInProcess: boolean;
    cancelEwaySuccess: boolean;
    deleteTransporterInProcessID: any[];
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
    updateTransporterSuccess: false,

    isAddnewTransporterInProcess: false,
    isAddnewTransporterInSuccess: false,
    updateTransporterInProcess: false,
    updateEwayvehicleInProcess: false,
    updateEwayvehicleSuccess: false,

    cancelEwayInProcess: false,
    cancelEwaySuccess: false,
    deleteTransporterInProcessID: []
};

export function EwayBillreducer(state: EwayBillState = initialState, action: CustomActions): EwayBillState {
    switch (action.type) {

        case EWAYBILL_ACTIONS.GET_All_LIST_EWAYBILLS: {
            return Object.assign({}, state, {
                isGetAllEwaybillRequestSuccess: false,
                isGetAllEwaybillRequestInProcess: true
            });
        }

        case EWAYBILL_ACTIONS.GET_All_FILTERED_LIST_EWAYBILLS: {
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

        case EWAYBILL_ACTIONS.GET_All_FILTERED_LIST_EWAYBILLS_RESPONSE: {
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
        }

        case EWAYBILL_ACTIONS.LOGIN_EAYBILL_USER: {
            return Object.assign({}, state, { isEwaybillAddnewUserInProcess: true, isEwaybillUserCreationSuccess: false });
        }
        case EWAYBILL_ACTIONS.LOGIN_EAYBILL_USER_RESPONSE: {
            let ewaybillLoginResponse: BaseResponse<any, any> = action.payload;
            if (ewaybillLoginResponse.status === 'success') {
                let d = _.cloneDeep(state);
                d.isEwaybillAddnewUserInProcess = false;
                d.isEwaybillUserCreationSuccess = true;
                return Object.assign({}, state, d);
            }
            if (ewaybillLoginResponse.status === 'error') {
                let d = _.cloneDeep(state);
                d.isEwaybillAddnewUserInProcess = false;
                d.isEwaybillUserCreationSuccess = false;
                return Object.assign({}, state, d);
            }
            return state;
        }

        case EWAYBILL_ACTIONS.GENERATE_EWAYBILL: {
            return Object.assign({}, state, { isGenerateEwaybillInProcess: true, isGenerateEwaybilSuccess: false });
        }

        case EWAYBILL_ACTIONS.GENERATE_EWAYBILL_RESPONSE: {

            let ewaybillGeneratedResponse: BaseResponse<any, any> = action.payload;
            if (ewaybillGeneratedResponse.status === 'success') {
                let d = _.cloneDeep(state);
                d.isGenerateEwaybillInProcess = false;
                d.isGenerateEwaybilSuccess = true;
                return Object.assign({}, state, d);
            }
            if (ewaybillGeneratedResponse.status === 'error') {
                let d = _.cloneDeep(state);
                d.isGenerateEwaybillInProcess = false;
                d.isGenerateEwaybilSuccess = false;
                return Object.assign({}, state, d);
            }
            return state;
        }
        // EWAYBILL_ACTIONS.IS_LOOGEDIN_USER_EWAYBILL_RESPONSE

        case EWAYBILL_ACTIONS.IS_LOOGEDIN_USER_EWAYBILL_RESPONSE: {

            let ewaybillGeneratedResponse: BaseResponse<any, any> = action.payload;
            if (ewaybillGeneratedResponse.status === 'success') {
                let d = _.cloneDeep(state);
                d.isUserLoggedInEwaybillSuccess = true;
                return Object.assign({}, state, d);
            }
            else {
                let d = _.cloneDeep(state);
                d.isUserLoggedInEwaybillSuccess = false;
                return Object.assign({}, state, d);
            }
        }
        // Transporter

        case EWAYBILL_ACTIONS.ADD_TRANSPORTER: {
            return Object.assign({}, state, { isAddnewTransporterInProcess: true, isAddnewTransporterInSuccess: false });
        }
        case EWAYBILL_ACTIONS.ADD_TRANSPORTER_RESPONSE: {

            let addTransportResponse: BaseResponse<any, any> = action.payload;
            if (addTransportResponse.status === 'success') {
                let d = _.cloneDeep(state);
                d.TransporterList = [];
                d.TransporterList = addTransportResponse.body;
                d.isAddnewTransporterInProcess = false;
                d.isAddnewTransporterInSuccess = true;
                return Object.assign({}, state, {
                    TransporterList: [...state.TransporterList, action.payload.body],
                    isAddnewTransporterInProcess: false,
                    isAddnewTransporterInSuccess: true,
                });
            }
            if (addTransportResponse.status === 'error') {
                let d = _.cloneDeep(state);
                d.TransporterList = [];
                d.isAddnewTransporterInProcess = false;
                d.isAddnewTransporterInSuccess = false;
                return Object.assign({}, state, d);
            }
            return state;
        }

        case EWAYBILL_ACTIONS.UPDATE_TRANSPORTER: {
            return Object.assign({}, state, { updateTransporterInProcess: true, updateTransporterSuccess: false });
        }
        case EWAYBILL_ACTIONS.UPDATE_TRANSPORTER_RESPONSE: {
            let addTransportResponse: BaseResponse<any, any> = action.payload;
            if (addTransportResponse.status === 'success') {
                let index = state.TransporterList.findIndex(item => item.transporterId === addTransportResponse.queryString.transporterId);
                state.TransporterList.splice(index, 1, addTransportResponse.body);
                return Object.assign({}, state, { TransporterList: state.TransporterList.map(p => p.transporterId === action.payload.transporterId ? action.payload.unit : p), updateTransporterInProcess: false, updateTransporterSuccess: true });
            }
            else {
                return Object.assign({}, state, { updateTransporterInProcess: false, updateTransporterSuccess: false });
            }
        }
        case EWAYBILL_ACTIONS.GET_ALL_TRANSPORTER_RESPONSE: {
            let newState = _.cloneDeep(state);
            let res: BaseResponse<IAllTransporterDetails, any> = action.payload;
            if (res.status === 'success') {
                newState.TransporterListDetails = res.body;
                newState.TransporterList = res.body.results;
            }
            return Object.assign({}, state, newState);
        }

        case EWAYBILL_ACTIONS.DELETE_TRANSPORTER_RESPONSE:
            if ((action.payload as BaseResponse<string, string>).status === 'success') {
                return Object.assign({}, state, {
                    TransporterList: state.TransporterList?.filter(p => p.transporterId !== (action.payload as BaseResponse<string, string>).request),
                });
            }
            return state;
        // UPDATE_EWAY_VEHICLE

        case EWAYBILL_ACTIONS.UPDATE_EWAY_VEHICLE: {
            return Object.assign({}, state, { updateEwayvehicleInProcess: true, updateEwayvehicleSuccess: false });
        }
        case EWAYBILL_ACTIONS.UPDATE_EWAY_VEHICLE_RESPONSE: {
            let newState = _.cloneDeep(state);
            let res: BaseResponse<string, UpdateEwayVehicle> = action.payload;
            if (res.status === 'success') {
                newState.updateEwayvehicleInProcess = false;
                newState.updateEwayvehicleSuccess = true;
                return Object.assign({}, state, newState);
            } else {
                newState.updateEwayvehicleInProcess = false;
                newState.updateEwayvehicleSuccess = false;
                return Object.assign({}, state, newState);
            }
        }
        // CANCEL EWAY BILL
        case EWAYBILL_ACTIONS.CANCEL_EWAYBILL: {
            return Object.assign({}, state, { cancelEwayInProcess: true, cancelEwaySuccess: false });
        }
        case EWAYBILL_ACTIONS.CANCEL_EWAYBILL_RESPONSE: {
            let newState = _.cloneDeep(state);
            let res: BaseResponse<string, UpdateEwayVehicle> = action.payload;
            if (res.status === 'success') {
                newState.cancelEwayInProcess = false;
                newState.cancelEwaySuccess = true;
                return Object.assign({}, state, newState);
            } else {
                newState.cancelEwayInProcess = false;
                newState.cancelEwaySuccess = false;
                return Object.assign({}, state, newState);
            }
        }

        case EWAYBILL_ACTIONS.RESET_ALL_TRANSPORTER_RESPONSE: {
            return Object.assign({}, state, { TransporterList: [], transporterListDetails: null });
        }

        default:
            return state;
    }
}
