import { CustomActions } from '../customActions';
import { GST_RECONCILE_ACTIONS } from '../../actions/gst-reconcile/GstReconcile.const';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { GstReconcileInvoiceDetails, GstReconcileInvoiceResponse } from '../../models/api-models/GstReconcile';

export interface GstReconcileState {
  isGenerateOtpInProcess: boolean;
  isGenerateOtpSuccess: boolean;
  isGstReconcileInvoiceInProcess: boolean;
  isGstReconcileInvoiceSuccess: boolean;
  isGstReconcileVerifyOtpInProcess: boolean;
  isGstReconcileVerifyOtpSuccess: boolean;
  gstAuthenticated: boolean;
  gstFoundOnGiddh: boolean;
  gstReconcileData: GstReconcileDataState;
}

export class ReconcileActionState {
  public count: number = 0;
  public data: GstReconcileInvoiceDetails;
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
  gstAuthenticated: true,
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
        isGenerateOtpSuccess: action.payload.status === 'success'
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
        isGstReconcileVerifyOtpSuccess: action.payload.status === 'success'
      };

    case GST_RECONCILE_ACTIONS.GST_RECONCILE_INVOICE_REQUEST:
      return {
        ...state,
        isGstReconcileInvoiceInProcess: true,
        isGstReconcileInvoiceSuccess: false
      };

    case GST_RECONCILE_ACTIONS.GST_RECONCILE_INVOICE_RESPONSE:
      let response: BaseResponse<GstReconcileInvoiceResponse, string> = action.payload;
      let newState = _.cloneDeep(state);
      newState.isGenerateOtpInProcess = false;
      if (response.status === 'success') {
        newState.isGstReconcileInvoiceSuccess = true;
        newState.gstAuthenticated = true;
        newState.gstFoundOnGiddh = true;
        let gstData = newState.gstReconcileData;
        switch (response.queryString.action) {
          case 'NOT_ON_GIDDH':
            gstData.notFoundOnGiddh = {
              count: response.body.notFoundOnGiddh,
              data: response.body.details
            };
            break;
          case 'NOT_ON_PORTAL':
            gstData.notFoundOnPortal = {
              count: response.body.notFoundOnPortal,
              data: response.body.details
            };
            break;
          case 'MATCHED':
            gstData.matched = {
              count: response.body.matched,
              data: response.body.details
            };
            break;
          case 'PARTIALLY_MATCHED':
            gstData.partiallyMatched = {
              count: response.body.partiallyMatched,
              data: response.body.details
            };
            break;
        }
      } else {
        if (response.code === 'GST_AUTH_ERROR') {
          newState.isGstReconcileInvoiceSuccess = false;
          newState.gstAuthenticated = false;
          newState.gstFoundOnGiddh = true;
        } else if (response.code === 'GSTIN_NOT_FOUND') {
          newState.isGstReconcileInvoiceSuccess = false;
          newState.gstFoundOnGiddh = false;
          newState.gstAuthenticated = true;
        } else {
          newState.isGstReconcileInvoiceSuccess = true;
          newState.gstAuthenticated = true;
          newState.gstFoundOnGiddh = true;
        }
      }
      return newState;
    default:
      return state;
  }
}
