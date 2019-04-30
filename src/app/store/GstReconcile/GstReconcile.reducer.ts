import { CustomActions } from '../customActions';
import { GST_RECONCILE_ACTIONS } from '../../actions/gst-reconcile/GstReconcile.const';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { GstReconcileInvoiceDetails, GstReconcileInvoiceRequest, GstReconcileInvoiceResponse } from '../../models/api-models/GstReconcile';

export interface GstReconcileState {
  isGenerateOtpInProcess: boolean;
  isGenerateOtpSuccess: boolean;
  isGstReconcileInvoiceInProcess: boolean;
  isGstReconcileInvoiceSuccess: boolean;
  isGstReconcileVerifyOtpInProcess: boolean;
  isGstReconcileVerifyOtpSuccess: boolean;
  // gstAuthenticated: boolean;
  gstFoundOnGiddh: boolean;
  gstReconcileData: GstReconcileInvoiceResponse;
  isPullFromGstInProgress: boolean;
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
  // gstAuthenticated: false,
  gstFoundOnGiddh: true,
  gstReconcileData: new GstReconcileInvoiceResponse(),
  isPullFromGstInProgress: false
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
      let response: BaseResponse<GstReconcileInvoiceResponse, GstReconcileInvoiceRequest> = action.payload;
      let newState = _.cloneDeep(state);
      newState.isGstReconcileInvoiceInProcess = false;

      if (response.status === 'success') {
        newState.isGstReconcileInvoiceSuccess = true;
        newState.gstFoundOnGiddh = true;

        if (response.queryString.action) {
          newState.gstReconcileData.notFoundOnGiddh = response.body.notFoundOnGiddh;
          newState.gstReconcileData.notFoundOnPortal = response.body.notFoundOnPortal;
          newState.gstReconcileData.matchedCount = response.body.matchedCount;
          newState.gstReconcileData.partiallyMatched = response.body.partially_matched;
          switch (response.queryString.action) {
            case 'NOT_ON_GIDDH':
              newState.gstReconcileData.notFoundOnGiddh = response.body.not_found_on_giddh;
              break;
            case 'NOT_ON_PORTAL':
              newState.gstReconcileData.notFoundOnPortal = response.body.not_found_on_portal;
              break;
            case 'MATCHED':
              newState.gstReconcileData.matched = response.body.matched;
              break;
            case 'PARTIALLY_MATCHED':
              newState.gstReconcileData.partiallyMatched = response.body.partially_matched;
              break;
          }
        } else {
          newState.gstReconcileData = response.body;
        }

        // let gstData = newState.gstReconcileData;
        // gstData.notFoundOnGiddh.count = response.body.notFoundOnGiddh;
        // gstData.notFoundOnPortal.count = response.body.notFoundOnPortal;
        // gstData.matched.count = response.body.matched;
        // gstData.partiallyMatched.count = response.body.partiallyMatched;

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

    case GST_RECONCILE_ACTIONS.RESET_GST_RECONCILE_STATE:
      return initialState;

    case GST_RECONCILE_ACTIONS.PULL_FROM_GSTIN:
      return {
        ...state,
        isPullFromGstInProgress: true
      };

    default:
      return state;
  }
}
