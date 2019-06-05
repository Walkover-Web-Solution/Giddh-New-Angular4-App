import { CustomActions } from '../customActions';
import { PROFORMA_ACTIONS } from '../../actions/proforma/proforma.const';

export interface ProformaState {
  isGenerateInProcess: boolean;
  isGenerateSuccess: boolean;
}

const initialState: ProformaState = {
  isGenerateInProcess: false,
  isGenerateSuccess: false
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
    default:
      return state;
  }
};
