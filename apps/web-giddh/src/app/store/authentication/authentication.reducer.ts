import { ICurrencyResponse, CompanyCreateRequest } from './../../models/api-models/Company';
import { SETTINGS_PROFILE_ACTIONS } from './../../actions/settings/profile/settings.profile.const';
import { LoginActions } from '../../actions/login.action';
import { CompanyActions } from '../../actions/company.actions';
import { LinkedInRequestModel, SignupWithMobile, UserDetails, VerifyEmailModel, VerifyEmailResponseModel, VerifyMobileModel, VerifyMobileResponseModel } from '../../models/api-models/loginModels';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { CompanyRequest, CompanyResponse, StateDetailsRequest, StateDetailsResponse } from '../../models/api-models/Company';
import * as _ from '../../lodash-optimized';
import { CustomActions } from '../customActions';
import * as moment from 'moment';
import { GIDDH_DATE_FORMAT }  from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import { userLoginStateEnum } from '../../models/user-login-state';

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
  needsToRedirectToLedger: boolean;
  isAddNewMobileNoInProcess: boolean;
  isAddNewMobileNoSuccess: boolean;
  isVerifyAddNewMobileNoInProcess: boolean;
  isVerifyAddNewMobileNoSuccess: boolean;
  isLoginWithPasswordInProcess: boolean;
  isSignupWithPasswordInProcess: boolean;
  isSignupWithPasswordSuccess: boolean;
  isLoginWithPasswordSuccessNotVerified: boolean;
  signupVerifyEmail: string;
  isForgotPasswordInProcess: boolean;
  isResetPasswordInSuccess: boolean;
}



export interface SessionState {
  user?: VerifyEmailResponseModel;
  lastState: string;
  applicationDate: any;
  todaySelected: any;
  companyUniqueName: string;                   // current user | null
  companies: CompanyResponse[];
  isRefreshing: boolean;
  isCompanyCreationInProcess: boolean;
  isCompanyCreationSuccess: boolean;
  isCompanyCreated: boolean;
  userLoginState: userLoginStateEnum;
  currencies: ICurrencyResponse[];
  createCompanyRequestObj: CompanyCreateRequest
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
  isAddNewMobileNoInProcess: false,
  isAddNewMobileNoSuccess: false,
  isVerifyAddNewMobileNoInProcess: false,
  isVerifyAddNewMobileNoSuccess: false,
  needsToRedirectToLedger: false,
  isLoginWithPasswordInProcess: false,
  isSignupWithPasswordInProcess: false,
  isSignupWithPasswordSuccess: false,
  isLoginWithPasswordSuccessNotVerified: false,
  signupVerifyEmail: null,
  isForgotPasswordInProcess: false,
  isResetPasswordInSuccess: false
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
  userLoginState: userLoginStateEnum.notLoggedIn,
  currencies: null,
  todaySelected: false,
  createCompanyRequestObj: null
};

export function AuthenticationReducer(state: AuthenticationState = initialState, action: CustomActions): AuthenticationState {

  switch (action.type) {
    case LoginActions.RESET_NEEDS_TO_REDIRECT_TO_LEDGER: {
      return {...state, needsToRedirectToLedger: false};
    }
    case LoginActions.NEEDS_TO_REDIRECT_TO_LEDGER: {
      return {...state, needsToRedirectToLedger: true};
    }
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
        isTwoWayAuthInProcess: false,
        needsToRedirectToLedger: false,
        isAddNewMobileNoInProcess: false,
        isAddNewMobileNoSuccess: false,
        isVerifyAddNewMobileNoInProcess: false,
        isVerifyAddNewMobileNoSuccess: false
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
    case LoginActions.AddNewMobileNo:
      return {
        ...state,
        isAddNewMobileNoInProcess: true,
        isAddNewMobileNoSuccess: false
      };
    case LoginActions.AddNewMobileNoResponse:
      let resp1: BaseResponse<string, SignupWithMobile> = action.payload;
      if (resp1.status === 'success') {
        return {
          ...state,
          isAddNewMobileNoInProcess: false,
          isAddNewMobileNoSuccess: true
        };
      }
      return {
        ...state,
        isAddNewMobileNoInProcess: false,
        isAddNewMobileNoSuccess: false
      };

    case LoginActions.VerifyAddNewMobileNo:
      return {
        ...state,
        isVerifyAddNewMobileNoInProcess: true,
      };
    case LoginActions.VerifyAddNewMobileNoResponse:
      let resp: BaseResponse<VerifyMobileResponseModel, VerifyMobileModel> = action.payload;
      if (resp.status === 'success') {
        return {
          ...state,
          user: Object.assign({}, state.user, {
            contactNumber: resp.request.mobileNumber,
            countryCode: resp.request.countryCode
          }),
          isVerifyAddNewMobileNoInProcess: false,
          isVerifyAddNewMobileNoSuccess: true
        };
      }
      return {
        ...state,
        isVerifyAddNewMobileNoInProcess: false,
        isVerifyAddNewMobileNoSuccess: false
      };
    case LoginActions.LoginWithPasswdRequest:
      return Object.assign({}, state, {
        isLoginWithPasswordInProcess: true
      });
      case LoginActions.LoginWithPasswdResponse: {
        let res: BaseResponse<any, any> = action.payload;
        if (res.status === 'success') {
          if (!res.body.user.isVerified) {
            return Object.assign({}, state, {
              isLoginWithPasswordInProcess: false,
              isLoginWithPasswordSuccessNotVerified: true,
              user: res.body
            });
          }
        }
        return state;
      }
    case LoginActions.SignupWithPasswdRequest:
      return Object.assign({}, state, {
        isSignupWithPasswordInProcess: true,
        isSignupWithPasswordSuccess: false,
        signupVerifyEmail: null
      });
    case LoginActions.SignupWithPasswdResponse: {
      let res: BaseResponse<any, any> = action.payload;
      if (res.status === 'success') {
        return Object.assign({}, state, {
          isSignupWithPasswordInProcess: false,
          isSignupWithPasswordSuccess: true,
          signupVerifyEmail: res.request.email
        });
      }
      return state;
    }
    case LoginActions.forgotPasswordRequest:
      return Object.assign({}, state, {
        isForgotPasswordInProcess: false
      });
    case LoginActions.forgotPasswordResponse: {
      let res: BaseResponse<any, any> = action.payload;
      if (res.status === 'success') {
        return Object.assign({}, state, {
          isForgotPasswordInProcess: true,
        });
      }
      return state;
    }
    case LoginActions.resetPasswordRequest:
      return Object.assign({}, state, {
        isResetPasswordInSuccess: false
      });
    case LoginActions.resetPasswordResponse: {
      let res: BaseResponse<any, any> = action.payload;
      if (res.status === 'success') {
        return Object.assign({}, state, {
          isResetPasswordInSuccess: true,
          isForgotPasswordInProcess: false
        });
      }
      return state;
    }
    default:
      return state;
  }
}

export function SessionReducer(state: SessionState = sessionInitialState, action: CustomActions): SessionState {
  switch (action.type) {
    case LoginActions.renewSessionResponse: {
      let data: BaseResponse<VerifyEmailResponseModel, string> = action.payload as BaseResponse<VerifyEmailResponseModel, string>;
      if (data.status === 'success') {
        return Object.assign({}, state, {
          user: data.body
        });
      }
      return state;
    }
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
    case CompanyActions.SET_APPLICATION_DATE_RESPONSE:
      let dateResponse: BaseResponse<string, any> = action.payload;
      if (dateResponse.status === 'success') {
        let latestState = _.cloneDeep(state);
        let data: any = dateResponse.body;
        // let fromDate: any = moment(data.fromDate, GIDDH_DATE_FORMAT);
        // let toDate: any = moment(data.toDate, GIDDH_DATE_FORMAT);
        // console.log('fromDate', fromDate);
        // console.log('toDate', toDate);
        if (!data.fromDate) {
          latestState.todaySelected = true;
        } else {
          latestState.todaySelected = false;
        }
        let fromDate: any = data.fromDate ? moment(data.fromDate, GIDDH_DATE_FORMAT) : moment().subtract(30, 'days');
        let toDate: any = data.toDate ? moment(data.toDate, GIDDH_DATE_FORMAT) : moment();
        latestState.applicationDate = [fromDate._d, toDate._d];
        return Object.assign({}, state, latestState);
      }
      return state;
    case CompanyActions.RESET_APPLICATION_DATE: {
      let latestState = _.cloneDeep(state);
      latestState.applicationDate = null;
      return Object.assign({}, state, latestState);
    }
    case CompanyActions.SET_CONTACT_NO: {
      let s = _.cloneDeep(state);
      s.user.user.mobileNo = action.payload;
      return s;
    }
    case CompanyActions.CREATE_COMPANY:
      return Object.assign({}, state, {isCompanyCreationInProcess: true, isCompanyCreationSuccess: false});
    case CompanyActions.RESET_CREATE_COMPANY_FLAG:
      return Object.assign({}, state, {isCompanyCreated: false, isCompanyCreationInProcess: false, isCompanyCreationSuccess: false});
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
        isCompanyCreated: false
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
    case LoginActions.SetCurrencyInStore: {
      return Object.assign({}, state, {
        currencies: action.payload
      });
    }
    case SETTINGS_PROFILE_ACTIONS.UPDATE_PROFILE_RESPONSE: {
      let response: BaseResponse<CompanyResponse, string> = action.payload;
      if (response.status === 'success') {
        let d = _.cloneDeep(state);
        let currentCompanyIndx = _.findIndex(d.companies, (company) => company.uniqueName === response.body.uniqueName);
        if (currentCompanyIndx !== -1) {
          d.companies[currentCompanyIndx].country = response.body.country;
          return Object.assign({}, state, d);
        }
      }
      return state;
    }
    case SETTINGS_PROFILE_ACTIONS.PATCH_PROFILE_RESPONSE: {
      let response: BaseResponse<CompanyResponse, string> = action.payload;
      if (response.status === 'success') {
        let d = _.cloneDeep(state);
        localStorage.setItem('currencyDesimalType', response.body.balanceDecimalPlaces);
         localStorage.setItem('currencyNumberType', response.body.balanceDisplayFormat);
        let currentCompanyIndx = _.findIndex(d.companies, (company) => company.uniqueName === response.body.uniqueName);
        if (currentCompanyIndx !== -1) {
          d.companies[currentCompanyIndx].country = response.body.country;
          return Object.assign({}, state, d);
        }
      }
      return state;
    }
    case LoginActions.LoginWithPasswdResponse: {
      let res: BaseResponse<any, any> = action.payload;
      if (res.status === 'success') {
        return Object.assign({}, state, {
          user: res.body,
          isLoginWithPasswordInProcess: false
        });
      }
      return state;
    }
    default:
      return state;
  }
}
