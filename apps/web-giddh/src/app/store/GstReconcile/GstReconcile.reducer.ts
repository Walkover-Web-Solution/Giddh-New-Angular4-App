import { CustomActions } from '../customActions';
import { GST_RECONCILE_ACTIONS } from '../../actions/gst-reconcile/GstReconcile.const';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { GstReconcileActionsEnum, GstReconcileInvoiceDetails, GstReconcileInvoiceRequest, GstReconcileInvoiceResponse } from '../../models/api-models/GstReconcile';

export interface GstReconcileState {
    isGenerateOtpInProcess: boolean;
    isGenerateOtpSuccess: boolean;
    isGstReconcileInvoiceInProcess: boolean;
    isGstReconcileInvoiceSuccess: boolean;
    isGstReconcileVerifyOtpInProcess: boolean;
    isGstReconcileVerifyOtpSuccess: boolean;
    gstFoundOnGiddh: boolean;
    gstReconcileData: GstReconcileDataState;
}

export class ReconcileActionState {
    public count: number = 0;
    public data: GstReconcileInvoiceDetails = new GstReconcileInvoiceDetails();
}

interface GstReconcileDataState {
    notFoundOnGiddh: ReconcileActionState;
    notFoundOnPortal: ReconcileActionState;
    matched: ReconcileActionState;
    partiallyMatched: ReconcileActionState;
}

const gstReconcileDataInitialState: GstReconcileDataState = {
    notFoundOnGiddh: new ReconcileActionState(),
    matched: new ReconcileActionState(),
    notFoundOnPortal: new ReconcileActionState(),
    partiallyMatched: new ReconcileActionState(),
};

const initialState: GstReconcileState = {
    isGenerateOtpInProcess: false,
    isGenerateOtpSuccess: false,
    isGstReconcileInvoiceInProcess: false,
    isGstReconcileInvoiceSuccess: false,
    isGstReconcileVerifyOtpInProcess: false,
    isGstReconcileVerifyOtpSuccess: false,
    gstFoundOnGiddh: true,
    gstReconcileData: gstReconcileDataInitialState
};

export function GstReconcileReducer(state: GstReconcileState = initialState, action: CustomActions): GstReconcileState {

    switch (action.type) {
        case GST_RECONCILE_ACTIONS.GST_RECONCILE_OTP_REQUEST:
            return {
                ...state,
                isGenerateOtpInProcess: true,
                isGenerateOtpSuccess: false
            };

        case GST_RECONCILE_ACTIONS.GST_RECONCILE_OTP_RESPONSE:
            return {
                ...state,
                isGenerateOtpInProcess: false,
                isGenerateOtpSuccess: action.payload?.status === 'success'
            };

        case GST_RECONCILE_ACTIONS.GST_RECONCILE_VERIFY_OTP_REQUEST:
            return {
                ...state,
                isGstReconcileVerifyOtpInProcess: true,
                isGstReconcileVerifyOtpSuccess: false
            };

        case GST_RECONCILE_ACTIONS.GST_RECONCILE_VERIFY_OTP_RESPONSE:
            return {
                ...state,
                isGstReconcileVerifyOtpInProcess: false,
                isGstReconcileVerifyOtpSuccess: action.payload?.status === 'success'
            };

        case GST_RECONCILE_ACTIONS.GST_RECONCILE_INVOICE_REQUEST:
            return {
                ...state,
                isGstReconcileInvoiceInProcess: true,
                isGstReconcileInvoiceSuccess: false
            };

        case GST_RECONCILE_ACTIONS.GST_RECONCILE_INVOICE_RESPONSE:
            let response: BaseResponse<GstReconcileInvoiceResponse, GstReconcileInvoiceRequest> = action.payload;
            let newState: GstReconcileState = _.cloneDeep(state);
            newState.isGstReconcileInvoiceInProcess = false;

            if (response?.status === 'success') {
                newState.isGstReconcileInvoiceSuccess = true;
                newState.gstFoundOnGiddh = true;

                // check if single action data is required
                if (response.queryString.action) {
                    switch (response.queryString.action) {
                        case GstReconcileActionsEnum.notfoundongiddh:
                            newState.gstReconcileData.notFoundOnGiddh = {
                                count: response.body.notFoundOnGiddh,
                                data: response.body.not_found_on_giddh
                            };

                            newState.gstReconcileData.notFoundOnPortal.count = response.body.notFoundOnPortal;
                            newState.gstReconcileData.matched.count = response.body.matchedCount;
                            newState.gstReconcileData.partiallyMatched.count = response.body.partiallyMatched;
                            break;
                        case GstReconcileActionsEnum.notfoundonportal:
                            newState.gstReconcileData.notFoundOnPortal = {
                                count: response.body.notFoundOnPortal,
                                data: response.body.not_found_on_portal
                            };

                            newState.gstReconcileData.notFoundOnGiddh.count = response.body.notFoundOnGiddh;
                            newState.gstReconcileData.matched.count = response.body.matchedCount;
                            newState.gstReconcileData.partiallyMatched.count = response.body.partiallyMatched;
                            break;
                        case GstReconcileActionsEnum.matched:
                            newState.gstReconcileData.matched = {
                                count: response.body.matchedCount,
                                data: response.body.matched
                            };

                            newState.gstReconcileData.notFoundOnPortal.count = response.body.notFoundOnPortal;
                            newState.gstReconcileData.notFoundOnGiddh.count = response.body.notFoundOnGiddh;
                            newState.gstReconcileData.partiallyMatched.count = response.body.partiallyMatched;
                            break;
                        case GstReconcileActionsEnum.partiallymatched:
                            newState.gstReconcileData.partiallyMatched = {
                                count: response.body.partiallyMatched,
                                data: response.body.partially_matched
                            };

                            newState.gstReconcileData.notFoundOnPortal.count = response.body.notFoundOnPortal;
                            newState.gstReconcileData.matched.count = response.body.matchedCount;
                            newState.gstReconcileData.notFoundOnGiddh.count = response.body.notFoundOnGiddh;
                            break;
                    }
                } else {
                    // if multiple actions data is required
                    newState.gstReconcileData = {
                        notFoundOnGiddh: {
                            count: response.body.notFoundOnGiddh,
                            data: response.body.not_found_on_giddh
                        },
                        notFoundOnPortal: {
                            count: response.body.notFoundOnPortal,
                            data: response.body.not_found_on_portal
                        },
                        matched: {
                            count: response.body.matchedCount,
                            data: response.body.matched
                        },
                        partiallyMatched: {
                            count: response.body.partiallyMatched,
                            data: response.body.partially_matched
                        }
                    };
                }

            } else {
                if (response.code === 'GST_AUTH_ERROR') {
                    newState.isGstReconcileInvoiceSuccess = false;
                    newState.gstFoundOnGiddh = true;
                } else if (response.code === 'GSTIN_NOT_FOUND') {
                    newState.isGstReconcileInvoiceSuccess = false;
                    newState.gstFoundOnGiddh = false;
                } else {
                    newState.isGstReconcileInvoiceSuccess = true;
                    newState.gstFoundOnGiddh = true;
                }

            }
            return newState;

        default:
            return state;
    }
}
