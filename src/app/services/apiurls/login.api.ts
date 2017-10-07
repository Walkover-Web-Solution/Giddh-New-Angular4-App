import { Configuration } from '../../app.constant';

export const LOGIN_API = {
  SignupWithEmail: Configuration.ApiUrl + 'signup-with-email',
  VerifyEmail: Configuration.ApiUrl + 'v2/verify-email',
  SignupWithMobile: Configuration.ApiUrl + 'generate-otp',
  VerifyOTP: Configuration.ApiUrl + 'v2/verify-number',
  VerifyNumber: Configuration.ApiUrl + 'users/system_admin/verify-number',
  LoginWithNumber: Configuration.ApiUrl + 'login-with-number?countryCode=:countryCode&mobileNumber=:mobileNumber', // get call
  LOGIN_WITH_GOOGLE: Configuration.ApiUrl + 'v2/login-with-google',
  LOGIN_WITH_LINKEDIN: Configuration.ApiUrl + 'v3/login-with-linkedIn',
  CLEAR_SESSION: Configuration.ApiUrl + 'users/:userUniqueName/destroy-session',
  SET_SETTINGS: Configuration.ApiUrl + 'users/:userUniqueName/settings',
  FETCH_DETAILS: Configuration.ApiUrl + 'users/:sessionId',
  SUBSCRIBED_COMPANIES: Configuration.ApiUrl + 'users/:userUniqueName/subscribed-companies',
  ADD_BALANCE: Configuration.ApiUrl + 'users/:uniqueName/balance',
  GET_AUTH_KEY: Configuration.ApiUrl + 'users/:uniqueName/get-auth-key',
  REGENERATE_AUTH_KEY: Configuration.ApiUrl + 'users/:userEmail/generate-auth-key',
};
