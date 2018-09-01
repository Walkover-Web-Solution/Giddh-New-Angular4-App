import { CustomActions } from '../customActions';
import { GST_RECONCILE_ACTIONS } from '../../actions/gst-reconcile/GstReconcile.const';

export interface GstReconcileState {
  isGenerateOtpInProcess: boolean;
  isGenerateOtpSuccess: boolean;
  isGstReconcileInvoiceInProcess: boolean;
  isGstReconcileInvoiceSuccess: boolean;
  isGstReconcileVerifyOtpInProcess: boolean;
  isGstReconcileVerifyOtpSuccess: boolean;
}

const initialState: GstReconcileState = {
  isGenerateOtpInProcess: false,
  isGenerateOtpSuccess: false,
  isGstReconcileInvoiceInProcess: false,
  isGstReconcileInvoiceSuccess: false,
  isGstReconcileVerifyOtpInProcess: false,
  isGstReconcileVerifyOtpSuccess: false,
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

    case GST_RECONCILE_ACTIONS.GST_RECONCILE_INVOICE_PERIOD_REQUEST:
      return {
        ...state,
        isGstReconcileInvoiceInProcess: true,
        isGstReconcileInvoiceSuccess: false
      };

    case GST_RECONCILE_ACTIONS.GST_RECONCILE_INVOICE_PERIOD_RESPONSE:
      return {
        ...state,
        isGstReconcileInvoiceInProcess: false,
        isGstReconcileInvoiceSuccess: action.payload.status === 'success'
      };
    default:
      return state;
  }
}
