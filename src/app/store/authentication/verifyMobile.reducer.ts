import { VerifyMobileActions } from '../../actions/verifyMobile.actions';
import { LoginActions } from '../../actions/login.action';
import { CompanyActions } from '../../actions/company.actions';
import { Action, ActionReducer } from '@ngrx/store';
import { UserDetails, VerifyEmailResponseModel } from '../../models/api-models/loginModels';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { StateDetailsResponse, StateDetailsRequest } from '../../models/api-models/Company';
import { CustomActions } from '../customActions';

/**
 * Keeping Track of the AuthenticationState
 */
export interface VerifyMobileState {
  phoneNumber: string;
  showVerificationBox: boolean;
  isMobileVerified: boolean;
}

/**
 * Setting the InitialState for this Reducer's Store
 */
const initialState = {
  phoneNumber: '',
  showVerificationBox: false,
  isMobileVerified: false
};

export const VerifyMobileReducer: ActionReducer<VerifyMobileState> = (state: VerifyMobileState = initialState, action: CustomActions) => {

  switch (action.type) {
    case VerifyMobileActions.SET_VERIFIACATION_MOBILENO:
      return Object.assign({}, state, {
        phoneNumber: action.payload
      });
    case VerifyMobileActions.SHOW_VERIFICATION_BOX:
      return Object.assign({}, state, {
        showVerificationBox: action.payload
      });
    case VerifyMobileActions.VERIFY_MOBILE_CODE_RESPONSE:
      return Object.assign({}, state, {
        isMobileVerified: true
      });
    default:
      return state;
  }
};
