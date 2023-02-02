import { CustomActions } from '../customActions';
import { PROFORMA_ACTIONS } from '../../actions/proforma/proforma.const';
import { ProformaFilter, ProformaGetAllVersionsResponse, ProformaGetRequest, ProformaResponse, ProformaVersionItem } from '../../models/api-models/proforma';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { VoucherClass } from '../../models/api-models/Sales';
import { cloneDeep } from '../../lodash-optimized';
import { UNAUTHORISED } from '../../app.constant';

export interface ProformaState {
    isGenerateInProcess: boolean;
    isGenerateSuccess: boolean;
    getAllInProcess: boolean;
    vouchers: ProformaResponse;
    lastVouchers: ProformaResponse;
    isGetDetailsInProcess: boolean;
    lastGeneratedVoucherDetails: { voucherNo: string, accountUniqueName: string };
    activeVoucher: VoucherClass;
    activeVoucherVersions: ProformaVersionItem[];
    isUpdateProformaInProcess: boolean;
    isUpdateProformaSuccess: boolean;
    isDeleteProformaInProcess: boolean;
    isDeleteProformaSuccess: boolean;
    isUpdateProformaActionInProcess: boolean;
    isUpdateProformaActionSuccess: boolean;
    isGetVoucherVersionInProcess: boolean;
    isGenerateSalesOrderFromEstimateInProcess: boolean;
    isGenerateSalesOrderFromEstimateSuccess: boolean;
    isGenerateInvoiceFromProformaOrEstimatesInProcess: boolean;
    isGenerateInvoiceFromProformaOrEstimatesSuccess: boolean;
    voucherNoForDetails: string;
    voucherNoForDetailsAction: string;
    hasVoucherListPermissions: boolean;
}

const initialState: ProformaState = {
    isGenerateInProcess: false,
    isGenerateSuccess: false,
    getAllInProcess: false,
    vouchers: null,
    lastVouchers: null,
    isGetDetailsInProcess: false,
    lastGeneratedVoucherDetails: null,
    activeVoucher: null,
    activeVoucherVersions: [],
    isUpdateProformaInProcess: false,
    isUpdateProformaSuccess: false,
    isDeleteProformaInProcess: false,
    isDeleteProformaSuccess: false,
    isUpdateProformaActionInProcess: false,
    isUpdateProformaActionSuccess: false,
    isGetVoucherVersionInProcess: false,
    isGenerateSalesOrderFromEstimateInProcess: false,
    isGenerateSalesOrderFromEstimateSuccess: false,
    isGenerateInvoiceFromProformaOrEstimatesInProcess: false,
    isGenerateInvoiceFromProformaOrEstimatesSuccess: false,
    voucherNoForDetails: null,
    voucherNoForDetailsAction: null,
    hasVoucherListPermissions: true
};

export function ProformaReducer(state: ProformaState = initialState, action: CustomActions): ProformaState {
    switch (action.type) {
        // region generate proforma
        case PROFORMA_ACTIONS.GENERATE_PROFORMA_REQUEST: {
            return {
                ...state,
                isGenerateInProcess: true,
                isGenerateSuccess: false,
                lastGeneratedVoucherDetails: null
            }
        }

        case PROFORMA_ACTIONS.GENERATE_PROFORMA_RESPONSE: {
            let response: BaseResponse<VoucherClass, VoucherClass> = action.payload;
            if (response?.status === 'success') {
                let no: string;
                switch (response.request.voucherDetails.voucherType) {
                    case 'proformas':
                        no = response.body.number;
                        break;
                    case 'estimates':
                        no = response.body.number;
                        break;
                    default:
                        no = response.body.voucherDetails.voucherNumber;
                }
                return cloneDeep({
                    ...state,
                    isGenerateInProcess: false,
                    isGenerateSuccess: true,
                    lastGeneratedVoucherDetails: { voucherNo: no, accountUniqueName: response.request.accountDetails?.uniqueName }
                });
            }
            return cloneDeep({
                ...state,
                isGenerateInProcess: false,
                isGenerateSuccess: false,
                lastGeneratedVoucherDetails: null
            });
        }
        // endregion

        // region get all proforma
        case PROFORMA_ACTIONS.GET_ALL_PROFORMA_REQUEST: {
            return {
                ...state,
                getAllInProcess: true
            }
        }

        case PROFORMA_ACTIONS.GET_ALL_PROFORMA_RESPONSE: {
            let response: BaseResponse<ProformaResponse, ProformaFilter> = action.payload;
            return {
                ...state,
                getAllInProcess: false,
                [response.request && response.request.isLastInvoicesRequest ? 'lastVouchers' : 'vouchers']: response?.status === 'success' ? response.body : null,
                hasVoucherListPermissions: !(response?.status === 'error' && response.statusCode === UNAUTHORISED)
            }
        }
        // endregion

        // region get proforma details
        case PROFORMA_ACTIONS.GET_PROFORMA_DETAILS_REQUEST: {
            return {
                ...state,
                isGetDetailsInProcess: true,
                activeVoucher: null
            }
        }

        case PROFORMA_ACTIONS.GET_PROFORMA_DETAILS_RESPONSE: {
            let response: BaseResponse<VoucherClass, ProformaGetRequest> = action.payload;
            return {
                ...state,
                isGetDetailsInProcess: false,
                activeVoucher: response?.status === 'success' ? response.body : null
            }
        }
        // endregion

        // region update proforma
        case PROFORMA_ACTIONS.UPDATE_PROFORMA_REQUEST: {
            return {
                ...state,
                isUpdateProformaInProcess: true, isUpdateProformaSuccess: false
            }
        }

        case PROFORMA_ACTIONS.UPDATE_PROFORMA_RESPONSE: {
            let vouchers = { ...state.vouchers };
            let result = action.payload as BaseResponse<any, VoucherClass>;
            if (result?.status === 'success') {
                return {
                    ...state,
                    isUpdateProformaInProcess: false,
                    isUpdateProformaSuccess: true,
                    vouchers: {
                        ...vouchers,
                        results: vouchers.results.map(m => {
                            if (m.estimateNumber === result.body.number) {
                                m.grandTotal = result.body.grandTotal;
                            }
                            return m;
                        })
                    }
                }
            } else {
                return {
                    ...state,
                    isUpdateProformaInProcess: false, isUpdateProformaSuccess: false
                }
            }
        }
        // endregion

        // region delete proforma
        case PROFORMA_ACTIONS.DELETE_PROFORMA_REQUEST: {
            return {
                ...state,
                isDeleteProformaInProcess: true, isDeleteProformaSuccess: false
            }
        }

        case PROFORMA_ACTIONS.DELETE_PROFORMA_RESPONSE: {
            return {
                ...state,
                isDeleteProformaInProcess: false,
                isDeleteProformaSuccess: action.payload?.status === 'success'
            }
        }
        // endregion

        // region update proforma action
        case PROFORMA_ACTIONS.UPDATE_PROFORMA_ACTION: {
            return {
                ...state,
                isUpdateProformaActionInProcess: true, isUpdateProformaActionSuccess: false
            }
        }

        case PROFORMA_ACTIONS.UPDATE_PROFORMA_ACTION_RESPONSE: {
            return {
                ...state,
                isUpdateProformaActionInProcess: false,
                isUpdateProformaActionSuccess: action.payload?.status === 'success'
            }
        }
        // endregion

        // region get estimate versions
        case PROFORMA_ACTIONS.GET_ESTIMATE_VERSIONS: {
            return {
                ...state,
                activeVoucherVersions: [],
                isGetVoucherVersionInProcess: true
            }
        }

        case PROFORMA_ACTIONS.GET_ESTIMATE_VERSIONS_RESPONSE: {
            let res: BaseResponse<ProformaGetAllVersionsResponse, ProformaGetRequest> = action.payload;
            return {
                ...state,
                activeVoucherVersions: res?.status === 'success' ? res.body.results : [],
                isGetVoucherVersionInProcess: true
            }
        }
        // endregion

        // region generate sales order from estimate
        case PROFORMA_ACTIONS.GENERATE_PROFORMA_FROM_ESTIMATE:
            return {
                ...state,
                isGenerateSalesOrderFromEstimateInProcess: true,
                isGenerateSalesOrderFromEstimateSuccess: action.payload?.status === 'success'
            };

        case PROFORMA_ACTIONS.GENERATE_PROFORMA_FROM_ESTIMATE_RESPONSE:
            if (action.payload?.status === 'success') {
                return {
                    ...state,
                    isGenerateSalesOrderFromEstimateInProcess: false,
                    isGenerateSalesOrderFromEstimateSuccess: true
                }
            }
            return {
                ...state,
                isGenerateSalesOrderFromEstimateInProcess: false,
                isGenerateSalesOrderFromEstimateSuccess: false
            };
        //  endregion

        // region generate invoice from estimate or proforma
        case PROFORMA_ACTIONS.GENERATE_INVOICE_FROM_PROFORMA_OR_ESTIMATES:
            return {
                ...state,
                isGenerateInvoiceFromProformaOrEstimatesInProcess: true,
                isGenerateInvoiceFromProformaOrEstimatesSuccess: false
            };

        case PROFORMA_ACTIONS.GENERATE_INVOICE_FROM_PROFORMA_OR_ESTIMATES_RESPONSE:
            if (action.payload?.status === 'success') {
                return {
                    ...state,
                    isGenerateInvoiceFromProformaOrEstimatesInProcess: false,
                    isGenerateInvoiceFromProformaOrEstimatesSuccess: true
                }
            }
            return {
                ...state,
                isGenerateInvoiceFromProformaOrEstimatesInProcess: false,
                isGenerateInvoiceFromProformaOrEstimatesSuccess: false
            };
        //  endregion

        // region reset active voucher
        case PROFORMA_ACTIONS.RESET_ACTIVE_VOUCHER: {
            return {
                ...state,
                activeVoucher: null,
                isUpdateProformaSuccess: false,
                isGenerateSuccess: false
            }
        }
        // endregion

        case PROFORMA_ACTIONS.SET_VOUCHER_FOR_DETAILS: {
            return {
                ...state,
                voucherNoForDetails: action.payload.voucherNo,
                voucherNoForDetailsAction: action.payload.action
            }
        }

        case PROFORMA_ACTIONS.RESET_VOUCHER_FOR_DETAILS: {
            return {
                ...state,
                voucherNoForDetails: null,
                voucherNoForDetailsAction: null
            }
        }
        default:
            return state;
    }
}
