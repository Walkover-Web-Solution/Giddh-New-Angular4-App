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
  viewTransactionData: TransactionSummary;
  activeCompanyGst: string;
  gstR1TotalTransactions: number;
  gstR2TotalTransactions: number;
  hsnSummary: HsnSummaryResponse;
  nilSummary: NilSummaryResponse;
  b2csSummary: TransactionSummary;
}

export class GstOverViewResponse {
  public totalTransactions: number;
  public transactionSummary: TransactionSummary;
}

export class HsnSummaryResponse {
  public page: number;
  public count: number;
  public totalPages: number;
  public totalItems: number;
  public results: HsnSummaryResult[];
  public size: number;
}
export class HsnSummaryResult {
  public totalTransactions: number;
  public transactionSummary: TransactionSummary[];
  public hsnsac: number;
  public desc: number;
  public qty: number;
  public txval: number;
  public iamt: number;
  public camt: number;
  public csamt: number;
  public samt: number;
  public total: number;
}

export class NilSummaryResponse {
  public page: number;
  public count: number;
  public totalPages: number;
  public totalItems: number;
  public results: NilSummaryResult[];
  public size: number;
}
export class NilSummaryResult {
  public supplyType: string;
  public registrationType: string;
  public nilAmount: number;
  public exemptAmount: number;
  public nonGstAmount: number;
}
export class TransactionSummary {
  public page: number;
  public count: number;
  public totalPages: number;
  public totalItems: number;
  public results: OverViewResult[];
  public size: number;
}

export class OverViewResult {
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
  public name: string;
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
  overViewData: new GstOverViewResponse(),
  viewTransactionData: new TransactionSummary(),
  activeCompanyGst: '',
  gstR1TotalTransactions: 0,
  gstR2TotalTransactions: 0,
  hsnSummary: null,
  nilSummary: null,
  b2csSummary: null
};

export function GstRReducer(state: GstRReducerState = initialState, action: CustomActions): GstRReducerState {

  switch (action.type) {
    case GSTR_ACTIONS.SET_ACTIVE_COMPANY_GSTIN:
      return {
        ...state,
        activeCompanyGst: action.payload
      };
    case GSTR_ACTIONS.GET_GSTR_OVERVIEW_RESPONSE: {
      let response: BaseResponse<any, string> = action.payload;
      let newState = _.cloneDeep(state);
      if (response.status === 'success') {
        if (action.payload.type === 'gstr1') {
          newState.gstR1TotalTransactions = response.body.totalTransactions;
        } else {
          newState.gstR2TotalTransactions = response.body.totalTransactions;
        }
        newState.overViewData = response.body;
      }
      return newState;
    }
    case GSTR_ACTIONS.GET_SUMMARY_TRANSACTIONS_RESPONSE: {
      let response: BaseResponse<any, string> = action.payload;
      let newState = _.cloneDeep(state);
      if (response.status === 'success') {
        newState.viewTransactionData = response.body;
      }
      return newState;
    }
    case GSTR_ACTIONS.GET_GST_RETURN_SUMMARY_RESPONSE: {
      let response: BaseResponse<any, string> = action.payload;
      let newState = _.cloneDeep(state);
      if (response.status === 'success') {
        switch (response.queryString.requestParam.gstReturnType) {
          case 'hsnsac':
            newState.hsnSummary = response.body;
            break;
          case 'nil':
            newState.nilSummary = response.body;
            break;
          case 'b2cs':
            newState.b2csSummary = response.body;
            break;
        }
      }
      return newState;
    }
    default:
      return state;
  }
}
