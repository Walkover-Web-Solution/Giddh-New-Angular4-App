import { CustomActions } from '../customActions';
import { PROFORMA_ACTIONS } from '../../actions/proforma/proforma.const';
import { ProformaFilter, ProformaGetRequest, ProformaResponse } from '../../models/api-models/proforma';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { GenericRequestForGenerateSCD } from '../../models/api-models/Sales';

export interface ProformaState {
  isGenerateInProcess: boolean;
  isGenerateSuccess: boolean;
  getAllInProcess: boolean;
  vouchers: ProformaResponse;
  isGetDetailsInProcess: boolean;
  activeVoucher: GenericRequestForGenerateSCD;
  activeVoucherVersions: any[];
  isUpdateProformaInProcess: boolean;
  isUpdateProformaSuccess: boolean;
  isDeleteProformaInProcess: boolean;
  isDeleteProformaSuccess: boolean;
  isUpdateProformaActionInProcess: boolean;
  isUpdateProformaActionSuccess: boolean;
  isGetVoucherVersionInProcess: boolean;
}

const initialState: ProformaState = {
  isGenerateInProcess: false,
  isGenerateSuccess: false,
  getAllInProcess: false,
  vouchers: null,
  isGetDetailsInProcess: false,
  activeVoucher: null,
  activeVoucherVersions: [],
  isUpdateProformaInProcess: false,
  isUpdateProformaSuccess: false,
  isDeleteProformaInProcess: false,
  isDeleteProformaSuccess: false,
  isUpdateProformaActionInProcess: false,
  isUpdateProformaActionSuccess: false,
  isGetVoucherVersionInProcess: false
};

export const ProformaReducer = (state: ProformaState = initialState, action: CustomActions): ProformaState => {
  switch (action.type) {
    // region generate proforma
    case PROFORMA_ACTIONS.GENERATE_PROFORMA_REQUEST: {
      return {
        ...state,
        isGenerateInProcess: true,
        isGenerateSuccess: false
      }
    }

    case PROFORMA_ACTIONS.GENERATE_PROFORMA_RESPONSE: {
      return {
        ...state,
        isGenerateInProcess: false,
        isGenerateSuccess: true
      }
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
        vouchers: response.status === 'success' ? response.body : null
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
      let response: BaseResponse<GenericRequestForGenerateSCD, ProformaGetRequest> = action.payload;
      return {
        ...state,
        isGetDetailsInProcess: false,
        activeVoucher: response.status === 'success' ? response.body : null
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
      return {
        ...state,
        isUpdateProformaInProcess: false, isUpdateProformaSuccess: true
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
        isDeleteProformaSuccess: true
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
        isUpdateProformaActionSuccess: true
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
      return {
        ...state,
        activeVoucherVersions: action.payload.staus === 'success' ? action.payload.body : [],
        isGetVoucherVersionInProcess: true
      }
    }
    // endregion

    // region reset active voucher
    case PROFORMA_ACTIONS.RESET_ACTIVE_VOUCHER: {
      return {
        ...state,
        activeVoucher: null
      }
    }
    // endregion
    default:
      return state;
  }
};
