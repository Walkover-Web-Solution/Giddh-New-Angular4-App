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
}

const initialState: ProformaState = {
  isGenerateInProcess: false,
  isGenerateSuccess: false,
  getAllInProcess: false,
  vouchers: null,
  isGetDetailsInProcess: false,
  activeVoucher: null
};

export const ProformaReducer = (state: ProformaState = initialState, action: CustomActions): ProformaState => {
  switch (action.type) {
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
    default:
      return state;
  }
};
