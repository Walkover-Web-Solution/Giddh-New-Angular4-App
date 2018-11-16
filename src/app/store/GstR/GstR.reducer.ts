import { CustomActions } from '../customActions';
import { GST_RECONCILE_ACTIONS, GSTR_ACTIONS } from '../../actions/gst-reconcile/GstReconcile.const';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { GstReconcileInvoiceDetails, GstReconcileInvoiceResponse } from '../../models/api-models/GstReconcile';

export interface GstRReducerState {
  overViewDataInProgress: boolean;
  overViewData: GstOverViewResponse;
  viewTransactionData: TransactionSummary;
  activeCompanyGst: string;
  gstR1TotalTransactions: number;
  gstR2TotalTransactions: number;
  hsnSummary: HsnSummaryResponse;
  nilSummary: NilSummaryResponse;
  b2csSummary: TransactionSummary;
  transactionCounts: TransactionCounts;
  transactionCountsInProcess: boolean;
  hsnSummaryInProgress: boolean;
  nilSummaryInProgress: boolean;
  b2csSummaryInProgress: boolean;
  documentIssuedResponse: DocumentIssuedResponse;
  documentIssuedRequestInProgress: boolean;
  failedTransactionsSummary: any;
  failedTransactionsSummaryInProgress: boolean;
  viewTransactionInProgress: boolean;
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
  public transactions?: OverViewResult[];
}

export class TransactionCounts {
  public gstr1Transactions: string;
  public gstr2Transactions: string;
  public uncategorized: string;
}

export class DocumentIssuedResponse {
  public page: number;
  public count: number;
  public totalPages: number;
  public totalItems: number;
  public results: DocumentIssuedResult[];
  public size: number;
}

export class DocumentIssuedResult {
  public num: number;
  public doc: string;
  public from: string;
  public to: string;
  public totnum: number;
  public cancel: number;
  public netIssue: any;
  public action: string;
  public custom: string;
}

const initialState: GstRReducerState = {
  overViewDataInProgress: true,
  overViewData: new GstOverViewResponse(),
  viewTransactionData: new TransactionSummary(),
  activeCompanyGst: '',
  gstR1TotalTransactions: 0,
  gstR2TotalTransactions: 0,
  hsnSummary: null,
  nilSummary: null,
  b2csSummary: null,
  transactionCounts: new TransactionCounts(),
  hsnSummaryInProgress: false,
  nilSummaryInProgress: false,
  b2csSummaryInProgress: true,
  documentIssuedResponse: null,
  documentIssuedRequestInProgress: false,
  failedTransactionsSummary: null,
  failedTransactionsSummaryInProgress: true,
  transactionCountsInProcess: true,
  viewTransactionInProgress: true
};

export function GstRReducer(state: GstRReducerState = initialState, action: CustomActions): GstRReducerState {

  switch (action.type) {
    case GSTR_ACTIONS.SET_ACTIVE_COMPANY_GSTIN: {
      return {
        ...state,
        activeCompanyGst: action.payload
      };
    }
    case GSTR_ACTIONS.GET_GSTR_OVERVIEW: {
      return {
        ...state,
        overViewDataInProgress: true
      };
    }
    case GSTR_ACTIONS.GET_GSTR_OVERVIEW_RESPONSE: {
      let response: BaseResponse<any, string> = action.payload;
      let newState = _.cloneDeep(state);
      if (response.status === 'success') {
        if (action.payload.type === 'gstr1') {
          newState.gstR1TotalTransactions = response.body.totalTransactions;
        } else {
          newState.gstR2TotalTransactions = response.body.totalTransactions;
        }
        newState.overViewDataInProgress = false;
        newState.overViewData = response.body;
      }
      return newState;
    }
    case GSTR_ACTIONS.GET_SUMMARY_TRANSACTIONS: {
      return {
        ...state,
        viewTransactionInProgress: true
      };
    }
    case GSTR_ACTIONS.GET_SUMMARY_TRANSACTIONS_RESPONSE: {
      let response: BaseResponse<any, string> = action.payload;
      let newState = _.cloneDeep(state);
      if (response.status === 'success') {
        newState.viewTransactionData = response.body;
      }
      newState.viewTransactionInProgress = false;
      return newState;
    }
    case GSTR_ACTIONS.GET_GST_RETURN_SUMMARY: {
      return Object.assign({}, state, {
            nilSummaryInProgress: true,
            hsnSummaryInProgress: true,
            b2csSummaryInProgress: true
        });
    }
    case GSTR_ACTIONS.GET_GST_RETURN_SUMMARY_RESPONSE: {
      let response: BaseResponse<any, string> = action.payload;
      let newState = _.cloneDeep(state);
      if (response.status === 'success') {
        switch (response.queryString.requestParam.gstReturnType) {
          case 'hsnsac':
            newState.hsnSummary = response.body;
            newState.hsnSummaryInProgress = false;
            break;
          case 'nil':
            newState.nilSummary = response.body;
            newState.nilSummaryInProgress = false;
            break;
          case 'b2cs':
            newState.b2csSummary = response.body;
            newState.b2csSummaryInProgress = false;
            break;
          case 'failedtransactions':
            newState.failedTransactionsSummary = response.body;
            newState.failedTransactionsSummaryInProgress = false;
            break;
        }
      }
      return newState;
    }
    case GSTR_ACTIONS.GET_TRANSACTIONS_COUNT: {
      return {
        ...state,
        transactionCountsInProcess: true
      };
    }
    case GSTR_ACTIONS.GET_TRANSACTIONS_COUNT_RESPONSE: {
      let response: BaseResponse<any, string> = action.payload;
      let newState = _.cloneDeep(state);
      if (response.status === 'success') {
        newState.transactionCounts = response.body;
        newState.transactionCountsInProcess = false;
      }
      return newState;
    }
    case GSTR_ACTIONS.GET_DOCUMENT_ISSUED: {
      return {
        ...state,
        documentIssuedRequestInProgress: true
      };
    }
    case GSTR_ACTIONS.GET_DOCUMENT_ISSUED_RESPONSE: {
      let response: BaseResponse<any, string> = action.payload;
      let newState = _.cloneDeep(state);
      if (response.status === 'success') {
        newState.documentIssuedResponse = response.body;
        newState.documentIssuedRequestInProgress = false;
      }
      return newState;
    }
    default:
      return state;
  }
}
