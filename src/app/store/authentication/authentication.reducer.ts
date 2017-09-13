import { LoginActions } from '../../services/actions/login.action';
import { CompanyActions } from '../../services/actions/company.actions';
import { Action, ActionReducer } from '@ngrx/store';
import {
  VerifyEmailModel,
  VerifyEmailResponseModel,
  VerifyMobileModel,
  VerifyMobileResponseModel
} from '../../models/api-models/loginModels';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { StateDetailsRequest, StateDetailsResponse, ComapnyResponse, CompanyRequest } from '../../models/api-models/Company';
import * as _ from 'lodash';

/**
 * Keeping Track of the AuthenticationState
 */
export interface AuthenticationState {
  isVerifyMobileSuccess: boolean;
  isVerifyEmailSuccess: boolean;
  isLoginWithMobileInProcess: boolean; // if true then We are checking with
  isVerifyMobileInProcess: boolean;
  isLoginWithEmailSubmited: boolean;
  isLoginWithMobileSubmited: boolean;
  isLoginWithEmailInProcess: boolean;
  isVerifyEmailInProcess: boolean;
  isLoginWithGoogleInProcess: boolean;
  isLoginWithLinkedInInProcess: boolean;
  isLoginWithTwitterInProcess: boolean;
  user?: VerifyEmailResponseModel;                   // current user | null
}

export enum userLoginStateEnum {
  notLoggedIn,
  userLoggedIn,
  newUserLoggedIn
}

export interface SessionState {
  user?: VerifyEmailResponseModel;
  lastState: string;
  companyUniqueName: string;                   // current user | null
  userLoginState: userLoginStateEnum;
  companies: ComapnyResponse[];
  isRefreshing: boolean;
  isCompanyCreationInProcess: boolean;

  isCompanyCreated: boolean;
}

/**
 * Setting the InitialState for this Reducer's Store
 */
const initialState = {
  isVerifyMobileSuccess: false,
  isLoginWithMobileInProcess: false, // if true then We are checking with
  isVerifyMobileInProcess: false,
  isLoginWithEmailInProcess: false,
  isVerifyEmailInProcess: false,
  isLoginWithGoogleInProcess: false,
  isLoginWithLinkedInInProcess: false,
  isLoginWithTwitterInProcess: false,
  isLoginWithEmailSubmited: false,
  isLoginWithMobileSubmited: false,
  isVerifyEmailSuccess: false,
  user: null
};

const sessionInitialState: SessionState = {
  user: null,
  lastState: '',
  companyUniqueName: '',
  userLoginState: userLoginStateEnum.notLoggedIn,
  companies: [],
  isCompanyCreated: false,
  isCompanyCreationInProcess: false,
  isRefreshing: false
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
      let data: BaseResponse<VerifyEmailResponseModel, VerifyEmailModel> = action.payload;
      if (data.status === 'success') {
        return Object.assign({}, state, {
          isVerifyEmailInProcess: false,
          isVerifyEmailSuccess: true,
        });
      } else {
        return Object.assign({}, state, {
          isVerifyEmailInProcess: false,
          isVerifyEmailSuccess: false
        });
      }
    case LoginActions.SignupWithMobileResponce:
      if (action.payload.status === 'success') {
        return Object.assign({}, state, {
          isLoginWithMobileSubmited: true,
          isLoginWithMobileInProcess: false
        });
      }
      if (action.payload.status === 'error') {
        return Object.assign({}, state, {
          isLoginWithMobileSubmited: false,
          isLoginWithMobileInProcess: false
        });
      }
    case LoginActions.SignupWithMobileRequest:
      return Object.assign({}, state, {
        isLoginWithMobileInProcess: true
      });

    case LoginActions.VerifyMobileRequest:
      return Object.assign({}, state, {
        isVerifyMobileInProcess: true
      });

    case LoginActions.VerifyMobileResponce:
      let data1: BaseResponse<VerifyMobileResponseModel, VerifyMobileModel> = action.payload;
      if (data1.status === 'success') {
        return Object.assign({}, state, {
          isVerifyMobileInProcess: false,
          isVerifyMobileSuccess: true,
        });
      } else {
        return Object.assign({}, state, {
          isVerifyMobileInProcess: false,
          isVerifyMobileSuccess: false
        });
      }
    case LoginActions.LogOut:
      return Object.assign({}, state, {
        isVerifyMobileSuccess: false,
        isLoginWithMobileInProcess: false, // if true then We are checking with
        isVerifyMobileInProcess: false,
        isLoginWithEmailInProcess: false,
        isVerifyEmailInProcess: false,
        isLoginWithGoogleInProcess: false,
        isLoginWithLinkedInInProcess: false,
        isLoginWithTwitterInProcess: false,
        isLoginWithEmailSubmited: false,
        isLoginWithMobileSubmited: false,
        isVerifyEmailSuccess: false,
        user: null
      });
    default:
      return state;
  }
};

export const SessionReducer: ActionReducer<SessionState> = (state: SessionState = sessionInitialState, action: Action) => {
  switch (action.type) {
    case LoginActions.SIGNUP_WITH_GOOGLE_RESPONSE: {
      let data: BaseResponse<VerifyEmailResponseModel, string> = action.payload as BaseResponse<VerifyEmailResponseModel, string>;
      if (data.status === 'success') {
        return Object.assign({}, state, {
          user: data.body
        });
      } else {
        return Object.assign({}, state, {
          user: null
        });
      }
    }
    case LoginActions.VerifyEmailResponce:
      {
        let data: BaseResponse<VerifyEmailResponseModel, VerifyEmailModel> = action.payload;
        if (data.status === 'success') {
          return Object.assign({}, state, {
            user: data.body
          });
        } else {
          return Object.assign({}, state, {
            user: null
          });
        }
      }
    case LoginActions.VerifyMobileResponce:
      let data1: BaseResponse<VerifyMobileResponseModel, VerifyMobileModel> = action.payload;
      if (data1.status === 'success') {
        return Object.assign({}, state, {
          user: data1.body
        });
      } else {
        return Object.assign({}, state, {
          user: null
        });
      }
    case LoginActions.LogOut:
      return Object.assign({}, state, {
        user: null,
        companyUniqueName: '',
        lastState: '',
        userLoginState: 0,
        companies: [],
        isCompanyCreated: false,
        isCompanyCreationInProcess: false,
        isRefreshing: false
      });
    case CompanyActions.GET_STATE_DETAILS_RESPONSE:
      let stateData: BaseResponse<StateDetailsResponse, string> = action.payload;
      if (stateData.status === 'success') {
        return Object.assign({}, state, {
          lastState: stateData.body.lastState,
          companyUniqueName: stateData.body.companyUniqueName
        });
      }
      return state;
    case CompanyActions.SET_STATE_DETAILS_RESPONSE:
      let setStateData: BaseResponse<string, StateDetailsRequest> = action.payload;
      if (setStateData.status === 'success') {
        return Object.assign({}, state, {
          lastState: setStateData.request.lastState,
          companyUniqueName: setStateData.request.companyUniqueName
        });
      }
      return state;
    case CompanyActions.SET_CONTACT_NO: {
      let newState = _.cloneDeep(state);
      newState.user.user.mobileNo = action.payload;
      return newState;
    }
    case CompanyActions.CREATE_COMPANY:
      return Object.assign({}, state, { isCompanyCreationInProcess: true });
    case CompanyActions.RESET_CREATE_COMPANY_FLAG:
      return Object.assign({}, state, { isCompanyCreated: false, isCompanyCreationInProcess: false });
    case CompanyActions.CREATE_COMPANY_RESPONSE: {
      let companyResp: BaseResponse<ComapnyResponse, CompanyRequest> = action.payload;
      if (companyResp.status === 'success') {
        let newState = _.cloneDeep(state);
        newState.isCompanyCreationInProcess = false;
        newState.isCompanyCreated = true;
        newState.companies.push(companyResp.body);
        return newState;
      }
      return state;
    }
    case CompanyActions.REFRESH_COMPANIES:
      return Object.assign({}, state, {
        isRefreshing: true,
        isCompanyCreated: false
      });
    case CompanyActions.REFRESH_COMPANIES_RESPONSE:
      let companies: BaseResponse<ComapnyResponse[], string> = action.payload;
      if (companies.status === 'success') {
        return Object.assign({}, state, {
          isRefreshing: false,
          companies: action.payload.body
        });
      }
      return state;
    case CompanyActions.DELETE_COMPANY_RESPONSE:
      let uniqueName: BaseResponse<string, string> = action.payload;
      if (uniqueName.status === 'success') {
        let array = state.companies.filter(cmp => cmp.uniqueName !== uniqueName.body);
        return Object.assign({}, state, {
          companies: array
        });
      }
      return state;
    case LoginActions.SetLoginStatus: {
      return Object.assign({}, state, {
        userLoginState: action.payload
      });
    }
    default:
      return state;
  }
};
