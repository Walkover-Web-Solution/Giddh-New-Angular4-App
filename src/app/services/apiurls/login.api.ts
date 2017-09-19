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
  CLEAR_SESSION: Configuration.ApiUrl + 'users/:userUniqueName/destroy-session'
};
