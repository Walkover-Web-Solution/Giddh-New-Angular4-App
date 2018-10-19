import { CustomActions } from '../customActions';
import { GST_RECONCILE_ACTIONS, GSTR_ACTIONS } from '../../actions/gst-reconcile/GstReconcile.const';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { GstReconcileInvoiceDetails, GstReconcileInvoiceResponse } from '../../models/api-models/GstReconcile';

export interface GstRReducerState {
  isGenerateOtpInProcess: boolean;
  isGenerateOtpSuccess: boolean;
  isGstReconcileInvoiceInProcess: boolean;
  isGstReconcileInvoiceSuccess: boolean;
  isGstReconcileVerifyOtpInProcess: boolean;
  isGstReconcileVerifyOtpSuccess: boolean;
  gstAuthenticated: boolean;
  gstFoundOnGiddh: boolean;
  isPullFromGstInProgress: boolean;
  overViewData: GstOverViewResponse;
}

export class GstOverViewResponse {
  public totalTransactions: number;
  public transactionSummary: TransactionSummary[];
}

export class TransactionSummary {
  public gstReturnType: string;
  public totalTransactions: number;
  public taxableAmount: number;
  public igstAmount: number;
  public cgstAmount: number;
  public sgstAmount: number;
  public cessAmount: number;
  public rate: number;
  public type: string;
  public pos: any;
  }

const initialState: GstRReducerState = {
  isGenerateOtpInProcess: false,
  isGenerateOtpSuccess: false,
  isGstReconcileInvoiceInProcess: false,
  isGstReconcileInvoiceSuccess: false,
  isGstReconcileVerifyOtpInProcess: false,
  isGstReconcileVerifyOtpSuccess: false,
  gstAuthenticated: true,
  gstFoundOnGiddh: true,
  isPullFromGstInProgress: false,
  overViewData: new GstOverViewResponse()
};

export function GstRReducer(state: GstRReducerState = initialState, action: CustomActions): GstRReducerState {

  switch (action.type) {
    case GSTR_ACTIONS.GET_GSTR_OVERVIEW_RESOPONSE:
      let response: BaseResponse<any, string> = action.payload;
      let newState = _.cloneDeep(state);

      if (response.status === 'success') {
        newState.overViewData = response.body;
      }
      return newState;

    default:
      return state;
  }
}
