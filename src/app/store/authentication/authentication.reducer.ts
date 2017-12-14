import { LoginActions } from '../../actions/login.action';
import { CompanyActions } from '../../actions/company.actions';
import { LinkedInRequestModel, SignupWithMobile, UserDetails, VerifyEmailModel, VerifyEmailResponseModel, VerifyMobileModel, VerifyMobileResponseModel } from '../../models/api-models/loginModels';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { CompanyRequest, CompanyResponse, StateDetailsRequest, StateDetailsResponse } from '../../models/api-models/Company';
import * as _ from '../../lodash-optimized';
import { CustomActions } from '../customActions';

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
  user?: VerifyEmailResponseModel;   // current user | null
  isSocialLogoutAttempted: boolean;
  isLoggedInWithSocialAccount: boolean;
  isTwoWayAuthInProcess: boolean;
  isTwoWayAuthSuccess: boolean;
}

export enum userLoginStateEnum {
  notLoggedIn,
  userLoggedIn,
  newUserLoggedIn,
  needTwoWayAuth
}

export interface SessionState {
  user?: VerifyEmailResponseModel;
  lastState: string;
  applicationDate: any;
  companyUniqueName: string;                   // current user | null
  companies: CompanyResponse[];
  isRefreshing: boolean;
  isCompanyCreationInProcess: boolean;
  isCompanyCreationSuccess: boolean;
  isCompanyCreated: boolean;
  isAddNewMobileNoInProcess: boolean;
  isMobileNoVerifiedSuccess: boolean;
  userLoginState: userLoginStateEnum;
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
  user: null,
  isSocialLogoutAttempted: false,
  isLoggedInWithSocialAccount: false,
  isTwoWayAuthInProcess: false,
  isTwoWayAuthSuccess: false,
};

const sessionInitialState: SessionState = {
  user: null,
  lastState: '',
  applicationDate: null,
  companyUniqueName: '',
  companies: [],
  isCompanyCreated: false,
  isCompanyCreationInProcess: false,
  isCompanyCreationSuccess: false,
  isRefreshing: false,
  isAddNewMobileNoInProcess: false,
  isMobileNoVerifiedSuccess: false,
  userLoginState: userLoginStateEnum.notLoggedIn
};

export function AuthenticationReducer(state: AuthenticationState = initialState, action: CustomActions): AuthenticationState {

  switch (action.type) {
    case LoginActions.SignupWithEmailResponce:
      if (action.payload.status === 'success') {
        return Object.assign({}, state, {
          isLoginWithEmailSubmited: true,
          isLoginWithEmailInProcess: false
        });
      }

      return Object.assign({}, state, {
        isLoginWithEmailSubmited: false,
        isLoginWithEmailInProcess: false
      });

    case LoginActions.SignupWithEmailRequest:
      return Object.assign({}, state, {
        isLoginWithEmailInProcess: true
      });

    case LoginActions.ResetSignupWithEmailState:
      return {
        ...state,
        isLoginWithEmailSubmited: false,
        isLoginWithEmailInProcess: false
      };

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
      return Object.assign({}, state, {
        isLoginWithMobileSubmited: false,
        isLoginWithMobileInProcess: false
      });
    case LoginActions.SignupWithMobileRequest:
      return Object.assign({}, state, {
        isLoginWithMobileInProcess: true
      });

    case LoginActions.ResetSignupWithMobileState:
      return {
        ...state,
        isLoginWithMobileSubmited: false,
        isLoginWithMobileInProcess: false
      };

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
        user: null,
        isSocialLogoutAttempted: true,
        isTwoWayAuthInProcess: false
      });
    case LoginActions.SOCIAL_LOGOUT_ATTEMPT: {
      let newState = _.cloneDeep(state);
      newState.isSocialLogoutAttempted = true;
      return newState;
    }
    case LoginActions.RESET_SOCIAL_LOGOUT_ATTEMPT: {
      let newState = _.cloneDeep(state);
      newState.isSocialLogoutAttempted = false;
      return newState;
    }
    // important if logged in via social accounts for web only
    case LoginActions.SIGNUP_WITH_LINKEDIN_RESPONSE: {
      let newState = _.cloneDeep(state);
      let LINKEDIN_RESPONSE: BaseResponse<VerifyEmailResponseModel, LinkedInRequestModel> = action.payload as BaseResponse<VerifyEmailResponseModel, LinkedInRequestModel>;
      if (LINKEDIN_RESPONSE.status === 'success') {
        newState.isLoggedInWithSocialAccount = true;
      } else {
        newState.isLoggedInWithSocialAccount = false;
      }
      return newState;
    }
    case LoginActions.SIGNUP_WITH_GOOGLE_RESPONSE: {
      let newState = _.cloneDeep(state);
      let GOOGLE_RESPONSE: BaseResponse<VerifyEmailResponseModel, string> = action.payload as BaseResponse<VerifyEmailResponseModel, string>;
      if (GOOGLE_RESPONSE.status === 'success') {
        newState.isLoggedInWithSocialAccount = true;
      } else {
        newState.isLoggedInWithSocialAccount = false;
      }
      return newState;
    }
    case LoginActions.VerifyTwoWayAuthRequest: {
      return {
        ...state,
        isTwoWayAuthInProcess: true
      };
    }
    case LoginActions.VerifyTwoWayAuthResponse: {
      if (action.payload.status === 'success') {
        return {
          ...state,
          isTwoWayAuthInProcess: false,
          isTwoWayAuthSuccess: true
        };
      }
      return {
        ...state,
        isTwoWayAuthInProcess: false,
        isTwoWayAuthSuccess: false
      };
    }
    case LoginActions.ResetTwoWayAuthModal: {
      return {
        ...state,
        isTwoWayAuthInProcess: false,
        isTwoWayAuthSuccess: false
      };
    }
    default:
      return state;
  }
}

export function SessionReducer(state: SessionState = sessionInitialState, action: CustomActions): SessionState {
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
    case LoginActions.SIGNUP_WITH_LINKEDIN_RESPONSE: {
      let data: BaseResponse<VerifyEmailResponseModel, LinkedInRequestModel> = action.payload as BaseResponse<VerifyEmailResponseModel, LinkedInRequestModel>;
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
    case LoginActions.VerifyEmailResponce: {
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
    case LoginActions.VerifyMobileResponce: {
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
    }
    case LoginActions.VerifyTwoWayAuthResponse: {
      let data1: BaseResponse<VerifyMobileResponseModel, VerifyMobileModel> = action.payload;
      if (data1.status === 'success') {
        return Object.assign({}, state, {
          user: data1.body
        });
      }
      return state;
    }
    case LoginActions.LogOut:
    case LoginActions.SOCIAL_LOGOUT_ATTEMPT:
      return Object.assign({}, state, {
        user: null,
        companyUniqueName: '',
        lastState: '',
        companies: [],
        isCompanyCreated: false,
        isCompanyCreationInProcess: false,
        isRefreshing: false,
        userLoginState: 0
      });
    case CompanyActions.GET_STATE_DETAILS_RESPONSE: {
      let stateData: BaseResponse<StateDetailsResponse, string> = action.payload;
      if (stateData.status === 'success') {
        return Object.assign({}, state, {
          lastState: stateData.body.lastState,
          companyUniqueName: stateData.body.companyUniqueName
        });
      }
      return state;
    }
    case CompanyActions.SET_APPLICATION_DATE: {
      let stateData = action.payload;
      let latestState = _.cloneDeep(state);
      latestState.applicationDate = stateData;
      return Object.assign({}, state, latestState);
    }
    case CompanyActions.CHANGE_COMPANY_RESPONSE: {
      let stateData: BaseResponse<StateDetailsResponse, string> = action.payload;
      if (stateData.status === 'success') {
        return Object.assign({}, state, {
          lastState: stateData.body.lastState,
          companyUniqueName: stateData.body.companyUniqueName
        });
      }
      return state;
    }
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
      let s = _.cloneDeep(state);
      s.user.user.mobileNo = action.payload;
      return s;
    }
    case CompanyActions.CREATE_COMPANY:
      return Object.assign({}, state, { isCompanyCreationInProcess: true, isCompanyCreationSuccess: false });
    case CompanyActions.RESET_CREATE_COMPANY_FLAG:
      return Object.assign({}, state, { isCompanyCreated: false, isCompanyCreationInProcess: false, isCompanyCreationSuccess: false });
    case CompanyActions.CREATE_COMPANY_RESPONSE: {
      let companyResp: BaseResponse<CompanyResponse, CompanyRequest> = action.payload;
      if (companyResp.status === 'success') {
        let d = _.cloneDeep(state);
        d.isCompanyCreationInProcess = false;
        d.isCompanyCreationSuccess = true;
        d.isCompanyCreated = true;
        d.companies.push(companyResp.body);
        return Object.assign({}, state, d);
      }
      return state;
    }
    case CompanyActions.REFRESH_COMPANIES:
      return Object.assign({}, state, {
        isRefreshing: true,
        // isCompanyCreated: state.isCompanyCreated
      });
    case CompanyActions.REFRESH_COMPANIES_RESPONSE:
      let companies: BaseResponse<CompanyResponse[], string> = action.payload;
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

    case CompanyActions.SET_MULTIPLE_CURRENCY_FIELD:
      let companyInfo: { companyUniqueName: string, isMultipleCurrency: boolean } = action.payload;

      let newState = _.cloneDeep(state);

      let companiesList = _.cloneDeep(newState.companies);

      let selectedCompanyIndex = companiesList.findIndex((company) => company.uniqueName === companyInfo.companyUniqueName);

      if (selectedCompanyIndex > -1) {
        companiesList[selectedCompanyIndex].isMultipleCurrency = companyInfo.isMultipleCurrency;
        newState.companies = companiesList;
        return Object.assign({}, state, newState);
      }
      return state;

    case LoginActions.AddNewMobileNo:
      return {
        ...state,
        isAddNewMobileNoInProcess: true,
        isMobileNoVerifiedSuccess: false
      };
    case LoginActions.AddNewMobileNoResponse:
      let resp: BaseResponse<string, SignupWithMobile> = action.payload;
      if (resp.status === 'success') {
        return {
          ...state,
          user: Object.assign({}, state.user, {
            contactNumber: resp.request.mobileNumber,
            countryCode: resp.request.countryCode
          }),
          isAddNewMobileNoInProcess: false,
          isMobileNoVerifiedSuccess: true
        };
      }
      return {
        ...state,
        isAddNewMobileNoInProcess: false,
        isMobileNoVerifiedSuccess: false
      };
    case LoginActions.FetchUserDetailsResponse:
      let userResp: BaseResponse<UserDetails, string> = action.payload;
      if (userResp.status === 'success') {
        return {
          ...state,
          user: {
            ...state.user,
            user: userResp.body
          }
        };
      } else {
        return state;
      }
    case LoginActions.SetLoginStatus: {
      return Object.assign({}, state, {
        userLoginState: action.payload
      });
    }
    default:
      return state;
  }
}
