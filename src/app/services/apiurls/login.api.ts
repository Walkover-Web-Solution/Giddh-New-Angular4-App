
import { Configuration } from '../../app.constant';

export const LOGIN_API = {
  SignupWithEmail: Configuration.ApiUrl + 'signup-with-email',
  VerifyEmail: Configuration.ApiUrl + 'verify-email',
  SignupWithMobile: Configuration.ApiUrl + 'app/api/get-login-otp',
  VerifyOTP: Configuration.ApiUrl + 'verify-email',
  VerifyNumber: Configuration.ApiUrl + 'users/system_admin/verify-number'
};
