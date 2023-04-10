import { CustomActions } from '../custom-actions';
import { GSTR_ACTIONS } from '../../actions/gst-reconcile/gst-reconcile.const';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { GetGspSessionResponse, GstOverViewRequest, GstOverViewResult, Gstr1SummaryRequest, Gstr1SummaryResponse, GstSaveGspSessionRequest, GStTransactionRequest, GstTransactionResult, Gstr3bOverviewResult, Gstr3bOverviewResult2 } from '../../models/api-models/GstReconcile';
import { GST_RETURN_ACTIONS } from '../../actions/purchase-invoice/purchase-invoice.const';
import { COMMON_ACTIONS } from '../../actions/common.const';

export interface GstRReducerState {
    gstr1OverViewDataInProgress: boolean;
    gstr1OverViewData: GstOverViewResult;
    gstr1OverViewDataFetchedSuccessfully: boolean;
    gstr2OverViewDataInProgress: boolean;
    gstr2OverViewData: GstOverViewResult;
    gstr2OverViewDataFetchedSuccessfully: boolean;
    gstr3BOverViewDate: Gstr3bOverviewResult2;
    gstr3BOverViewDataFetchedSuccessfully: boolean;
    gstr3BOverViewDataInProgress: boolean;
    viewTransactionData: GstTransactionResult;
    activeCompanyGst: string;
    gstR1TotalTransactions: number;
    gstR2TotalTransactions: number;
    hsnSummaryInProgress: boolean;
    nilSummaryInProgress: boolean;
    b2csSummaryInProgress: boolean;
    failedTransactionsSummary: any;
    failedTransactionsSummaryInProgress: boolean;
    viewTransactionInProgress: boolean;
    currentPeriod: any;
    gstAuthenticated: boolean;
    gstSessionResponse: GetGspSessionResponse;
    getGspSessionInProgress: boolean;
    gstReturnFileInProgress: boolean;
    gstReturnFileSuccess: boolean;
    gstr1SummaryDetailsInProcess: boolean;
    gstr1SummaryResponse: Gstr1SummaryResponse;
    saveGspSessionInProcess: boolean;
    saveGspSessionOtpSent: boolean;
    authorizeGspSessionOtpInProcess: boolean;
    gspSessionOtpAuthorized: boolean;
}

const initialState: GstRReducerState = {
    gstr1OverViewDataInProgress: false,
    gstr1OverViewData: new GstOverViewResult(),
    gstr1OverViewDataFetchedSuccessfully: false,
    gstr2OverViewDataInProgress: false,
    gstr2OverViewData: new GstOverViewResult(),
    gstr2OverViewDataFetchedSuccessfully: false,
    gstr3BOverViewDate: new Gstr3bOverviewResult2(),
    gstr3BOverViewDataFetchedSuccessfully: false,
    gstr3BOverViewDataInProgress: false,
    viewTransactionData: new GstTransactionResult(),
    activeCompanyGst: '',
    gstR1TotalTransactions: 0,
    gstR2TotalTransactions: 0,
    hsnSummaryInProgress: false,
    nilSummaryInProgress: false,
    b2csSummaryInProgress: true,
    failedTransactionsSummary: null,
    failedTransactionsSummaryInProgress: true,
    viewTransactionInProgress: true,
    currentPeriod: {},
    gstAuthenticated: false,
    gstSessionResponse: { taxpro: false, vayana: false },
    getGspSessionInProgress: false,
    gstReturnFileInProgress: false,
    gstReturnFileSuccess: false,
    gstr1SummaryDetailsInProcess: false,
    gstr1SummaryResponse: new Gstr1SummaryResponse(),
    saveGspSessionInProcess: false,
    saveGspSessionOtpSent: false,
    authorizeGspSessionOtpInProcess: false,
    gspSessionOtpAuthorized: false
};

export function GstRReducer(state: GstRReducerState = initialState, action: CustomActions): GstRReducerState {

    switch (action.type) {
        // region set active gstin
        case GSTR_ACTIONS.SET_ACTIVE_COMPANY_GSTIN: {
            return {
                ...state,
                activeCompanyGst: action.payload
            };
        }
        // endregion

        // region overview
        // region GSTR1
        case GSTR_ACTIONS.GET_GSTR1_OVERVIEW: {
            return {
                ...state,
                gstr1OverViewDataInProgress: true
            };
        }
        case GSTR_ACTIONS.GET_GSTR1_OVERVIEW_RESPONSE: {
            let response: BaseResponse<GstOverViewResult, GstOverViewRequest> = action.payload;

            let newState = _.cloneDeep(state);

            if (response?.status === 'success') {
                newState.gstR1TotalTransactions = response.body.count;
                newState.gstr1OverViewData = response.body;
                newState.gstr1OverViewDataFetchedSuccessfully = true;
                newState.gstr1OverViewDataInProgress = false;
                return newState;
            }
            newState.gstr1OverViewDataInProgress = false;
            newState.gstr1OverViewDataFetchedSuccessfully = false;
            newState.gstr1OverViewData = new GstOverViewResult();
            return newState;
        }

        case GSTR_ACTIONS.RESET_GSTR1_OVERVIEW_RESPONSE: {
            return {
                ...state,
                gstr1OverViewDataInProgress: false,
                gstr1OverViewDataFetchedSuccessfully: false
            };
        }

        case GSTR_ACTIONS.GET_GSTR3B_OVERVIEW: {
            return {
                ...state,
                gstr3BOverViewDataInProgress: true,
                gstr3BOverViewDataFetchedSuccessfully: false
            };
        }

        case GSTR_ACTIONS.GET_GSTR3B_OVERVIEW_RESPONSE: {
            let res: any = action.payload.body;

            let newState = _.cloneDeep(state);

            if (action.payload?.status === 'success') {
                newState.gstr3BOverViewDate = res.data;
                newState.gstr3BOverViewDataFetchedSuccessfully = true;
                newState.gstr3BOverViewDataInProgress = false;
                return newState;
            }
            newState.gstr3BOverViewDataInProgress = false;
            newState.gstr3BOverViewDataFetchedSuccessfully = false;
            newState.gstr3BOverViewData = new Gstr3bOverviewResult();
            return newState;
        }

        case GSTR_ACTIONS.RESET_GSTR3B_OVERVIEW_RESPONSE: {
            return {
                ...state,
                gstr3BOverViewDataInProgress: false,
                gstr3BOverViewDataFetchedSuccessfully: false
            };
        }

        // endregion

        // region GSTR2
        case GSTR_ACTIONS.GET_GSTR2_OVERVIEW: {
            return {
                ...state,
                gstr2OverViewDataInProgress: true
            };
        }
        case GSTR_ACTIONS.GET_GSTR2_OVERVIEW_RESPONSE: {
            let response: BaseResponse<GstOverViewResult, GstOverViewRequest> = action.payload;

            let newState = _.cloneDeep(state);

            if (response?.status === 'success') {
                newState.gstR2TotalTransactions = response.body.count;
                newState.gstr2OverViewData = response.body;
                newState.gstr2OverViewDataFetchedSuccessfully = true;
                newState.gstr2OverViewDataInProgress = false;
                return newState;
            }
            newState.gstr2OverViewDataInProgress = false;
            newState.gstr2OverViewDataFetchedSuccessfully = false;
            newState.gstr2OverViewData = new GstOverViewResult();
            return newState;
        }
        // endregion

        case GSTR_ACTIONS.RESET_GSTR2_OVERVIEW_RESPONSE: {
            return {
                ...state,
                gstr2OverViewDataInProgress: false,
                gstr2OverViewDataFetchedSuccessfully: false
            };
        }
        // endregion

        // region transactions
        case GSTR_ACTIONS.GET_SUMMARY_TRANSACTIONS: {
            return {
                ...state,
                viewTransactionInProgress: true
            };
        }
        case GSTR_ACTIONS.GET_SUMMARY_TRANSACTIONS_RESPONSE: {
            let response: BaseResponse<GstTransactionResult, GStTransactionRequest> = action.payload;
            let newState = _.cloneDeep(state);
            if (response?.status === 'success') {
                newState.viewTransactionData = response.body;
            }
            newState.viewTransactionInProgress = false;
            return newState;
        }
        // endregion

        // region gstr1 summary details
        case GSTR_ACTIONS.GET_GSTR1_SUMMARY_DETAILS: {
            return {
                ...state,
                gstr1SummaryDetailsInProcess: true
            };
        }

        case GSTR_ACTIONS.GET_GSTR1_SUMMARY_DETAILS_RESPONSE: {
            let result = action.payload as BaseResponse<Gstr1SummaryResponse, Gstr1SummaryRequest>;

            if (result?.status === 'success') {
                return {
                    ...state,
                    gstr1SummaryDetailsInProcess: false,
                    gstr1SummaryResponse: result.body
                };
            }
            return {
                ...state,
                gstr1SummaryDetailsInProcess: false
            };
        }
        // endregion

        // region set current period
        case GSTR_ACTIONS.CURRENT_PERIOD: {
            let response: BaseResponse<any, string> = action.payload;
            let newState = _.cloneDeep(state);
            newState.currentPeriod = response;
            return newState;
        }
        // endregion

        // region save GSP SESSION
        case GSTR_ACTIONS.GST_SAVE_GSP_SESSION: {
            return {
                ...state,
                saveGspSessionInProcess: true,
                saveGspSessionOtpSent: false
            };
        }

        case GSTR_ACTIONS.GST_SAVE_GSP_SESSION_RESPONSE: {
            let response: BaseResponse<any, GstSaveGspSessionRequest> = action.payload;
            if (response?.status === 'success') {
                let newState = _.cloneDeep(state);
                newState.saveGspSessionInProcess = false;
                newState.saveGspSessionOtpSent = true;
                return Object.assign({}, state, newState);
            }
            return { ...state, saveGspSessionInProcess: false, saveGspSessionOtpSent: false };
        }

        case GSTR_ACTIONS.GST_SAVE_GSP_SESSION_WITH_OTP: {
            return {
                ...state,
                authorizeGspSessionOtpInProcess: true,
                gstAuthenticated: false,
                gspSessionOtpAuthorized: false,
                gstSessionResponse: {
                    taxpro: false,
                    vayana: false
                }
            };
        }

        case GSTR_ACTIONS.GST_SAVE_GSP_SESSION_WITH_OTP_RESPONSE: {
            let response: BaseResponse<any, GstSaveGspSessionRequest> = action.payload;
            if (response?.status === 'success') {
                return {
                    ...state,
                    authorizeGspSessionOtpInProcess: false,
                    gstAuthenticated: true,
                    gspSessionOtpAuthorized: true,
                    gstSessionResponse: {
                        taxpro: response.queryString.gsp === 'TAXPRO',
                        vayana: response.queryString.gsp === 'VAYANA'
                    }
                };
            }
            return {
                ...state,
                authorizeGspSessionOtpInProcess: false,
                gstAuthenticated: false,
                gspSessionOtpAuthorized: false,
                gstSessionResponse: {
                    taxpro: false,
                    vayana: false
                }
            };
        }
        // endregion

        // region GET GST SESSION
        case GSTR_ACTIONS.GST_GET_GSP_SESSION: {
            return {
                ...state, gstAuthenticated: false,
                getGspSessionInProgress: true,
                gstSessionResponse: { ...state.gstSessionResponse, taxpro: false, vayana: false }
            };
        }

        case GSTR_ACTIONS.GST_GET_GSP_SESSION_RESPONSE: {
            let response: BaseResponse<any, string> = action.payload;
            if (response?.status === 'success') {
                let newState = _.cloneDeep(state);
                let session = response.body;
                if (session.taxpro) {
                    newState.gstAuthenticated = session.taxpro;
                } else {
                    newState.gstAuthenticated = session.vayana;
                }
                newState.gstSessionResponse = session;
                newState.getGspSessionInProgress = false;
                return Object.assign({}, state, newState);
            }
            return {
                ...state,
                gstAuthenticated: false,
                getGspSessionInProgress: false,
                gstSessionResponse: { ...state.gstSessionResponse, taxpro: false, vayana: false }
            };
        }
        // endregion

        // region FILE GSTR1
        case GSTR_ACTIONS.FILE_GSTR1: {
            return { ...state, gstReturnFileInProgress: true, gstReturnFileSuccess: false };
        }

        case GSTR_ACTIONS.FILE_GSTR1_RESPONSE: {
            let response: BaseResponse<any, string> = action.payload;
            if (response?.status === 'success') {
                return {
                    ...state, gstReturnFileSuccess: true, gstReturnFileInProgress: false
                };
            }
            return { ...state, gstReturnFileInProgress: false, gstReturnFileSuccess: false };
        }
        // endregion

        case GST_RETURN_ACTIONS.FILE_JIO_GST: {
            let newState = _.cloneDeep(state);
            newState.gstReturnFileInProgress = true;
            newState.gstReturnFileSuccess = false;
            return Object.assign({}, state, newState);
        }

        case GST_RETURN_ACTIONS.FILE_JIO_GST_RESPONSE: {
            let response: BaseResponse<any, string> = action.payload;
            if (response?.status === 'success') {
                let newState = _.cloneDeep(state);
                newState.gstReturnFileSuccess = true;
                newState.gstReturnFileInProgress = false;
                return Object.assign({}, state, newState);
            }
            return state;
        }

        case GSTR_ACTIONS.GST_RESET_ASIDE_FLAGS: {
            return {
                ...state,
                saveGspSessionInProcess: false,
                saveGspSessionOtpSent: false,
                authorizeGspSessionOtpInProcess: false,
                gspSessionOtpAuthorized: false
            };
        }
        case COMMON_ACTIONS.RESET_APPLICATION_DATA: {
            return Object.assign({}, state, initialState);
        }
        default:
            return state;
    }
}
