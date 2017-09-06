
import { Configuration } from '../../app.constant';

export const LOGIN_API = {
  SignupWithEmail: Configuration.ApiUrl + 'signup-with-email',
  VerifyEmail: Configuration.ApiUrl + 'verify-email',
  SignupWithMobile: Configuration.ApiUrl + 'generate-otp',
  VerifyOTP: Configuration.ApiUrl + 'verify-number',
  VerifyNumber: Configuration.ApiUrl + 'users/system_admin/verify-number',
  LoginWithNumber: Configuration.ApiUrl + 'login-with-number?countryCode=:countryCode&mobileNumber=:mobileNumber', // get call
  // LoginWithGoogle:
};
