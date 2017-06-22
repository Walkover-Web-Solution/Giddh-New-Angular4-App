import { LoginActions } from '../../services/actions/login.action';
import { CompanyActions } from '../../services/actions/company.actions';
import { Action, ActionReducer } from '@ngrx/store';
import { UserDetails, VerifyEmailResponseModel } from '../../models/api-models/loginModels';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { StateDetailsResponse, StateDetailsRequest } from '../../models/api-models/Company';

/**
 * Keeping Track of the AuthenticationState
 */
export interface AuthenticationState {
  isVerifyEmailSuccess: boolean;
  isLoginWithMobileInProcess: boolean; // if true then We are checking with
  isVerifyMobileInProcess: boolean;
  isLoginWithEmailSubmited: boolean;
  isLoginWithEmailInProcess: boolean;
  isVerifyEmailInProcess: boolean;
  isLoginWithGoogleInProcess: boolean;
  isLoginWithLinkedInInProcess: boolean;
  isLoginWithTwitterInProcess: boolean;
  user?: VerifyEmailResponseModel;                   // current user | null
}

export interface SessionState {
  user?: VerifyEmailResponseModel;
  lastState: string;
  companyUniqueName: string;                   // current user | null
}

/**
 * Setting the InitialState for this Reducer's Store
 */
const initialState = {
  isLoginWithMobileInProcess: false, // if true then We are checking with
  isVerifyMobileInProcess: false,
  isLoginWithEmailInProcess: false,
  isVerifyEmailInProcess: false,
  isLoginWithGoogleInProcess: false,
  isLoginWithLinkedInInProcess: false,
  isLoginWithTwitterInProcess: false,
  isLoginWithEmailSubmited: false,
  isVerifyEmailSuccess: false
};

const sessionInitialState = {
  user: null,
  lastState: '',
  companyUniqueName: ''
};

export const AuthenticationReducer: ActionReducer<AuthenticationState> = (state: AuthenticationState = initialState, action: Action) => {

  switch (action.type) {
    case LoginActions.SignupWithEmailResponce:
      if (action.payload.status === 'success') {
        return Object.assign({}, state, {
          isLoginWithEmailSubmited: true,
          isLoginWithEmailInProcess: false
        });
      }
      if (action.payload.status === 'error') {
        return Object.assign({}, state, {
          isLoginWithEmailSubmited: false,
          isLoginWithEmailInProcess: false
        });
      }
    case LoginActions.SignupWithEmailRequest:
      return Object.assign({}, state, {
        isLoginWithEmailInProcess: true
      });

    case LoginActions.VerifyEmailRequest:
      return Object.assign({}, state, {
        isVerifyEmailInProcess: true
      });

    case LoginActions.VerifyEmailResponce:
      let data: BaseResponse<VerifyEmailResponseModel> = action.payload;
      if (data.status === 'success') {
        return Object.assign({}, state, {
          isVerifyEmailInProcess: false,
          isVerifyEmailSuccess: true
        });
      } else {
        return Object.assign({}, state, {
          isVerifyEmailInProcess: false,
          isVerifyEmailSuccess: false
        });
      }
    default:
      return state;
  }
};

export const SessionReducer: ActionReducer<SessionState> = (state: SessionState = sessionInitialState, action: Action) => {
  switch (action.type) {
    case LoginActions.VerifyEmailResponce:
      let data: BaseResponse<VerifyEmailResponseModel> = action.payload;
      if (data.status === 'success') {
        return Object.assign({}, state, {
          user: data.body
        });
      } else {
        return Object.assign({}, state, {
          user: null
        });
      }
    case CompanyActions.GET_STATE_DETAILS_RESPONSE:
      let stateData: BaseResponse<StateDetailsResponse> = action.payload;
      return Object.assign({}, state, {
        lastState: stateData.body.lastState,
        companyUniqueName: stateData.body.companyUniqueName
      });
    case CompanyActions.SET_STATE_DETAILS_RESPONSE:
      let setStateData: BaseResponse<StateDetailsRequest> = action.payload;
      if (setStateData.status === 'success') {
        return Object.assign({}, state, {
          lastState: setStateData.body.lastState,
          companyUniqueName: setStateData.body.companyUniqueName
        });
      }
      return state;
    default:
      return state;
  }
};
