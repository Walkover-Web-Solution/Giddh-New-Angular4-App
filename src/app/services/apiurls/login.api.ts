
export const LOGIN_API = {
  SignupWithPassword: 'signup',
  LoginWithPassword: 'login-with-password',
  SignupWithEmail: 'signup-with-email',
  VerifyEmail: 'v2/verify-email',
  SignupWithMobile: 'generate-otp',
  VerifyOTP: 'v2/verify-number',
  VerifyNumber: 'users/system_admin/verify-number',
  LoginWithNumber: 'login-with-number?countryCode=:countryCode&mobileNumber=:mobileNumber', // get call
  LOGIN_WITH_GOOGLE: 'v2/signup-with-google',
  LOGIN_WITH_LINKEDIN: 'v3/signup-with-linkedIn',
  CLEAR_SESSION: 'users/:userUniqueName/destroy-session',
  SET_SETTINGS: 'users/:userUniqueName/settings',
  FETCH_DETAILS: 'users/:sessionId',
  SUBSCRIBED_COMPANIES: 'users/:userUniqueName/subscribed-companies',
  ADD_BALANCE: 'users/:uniqueName/balance',
  GET_AUTH_KEY: 'users/:uniqueName/get-auth-key',
  REGENERATE_AUTH_KEY: 'users/:userEmail/generate-auth-key',
  GET_SESSION: 'users/:userEmail/sessions',
  DELETE_SESSION: 'users/:userEmail/destroy-session',
  UPDATE_SESSION: 'users/:userEmail/increment-session',
  DELETE_ALL_SESSION: 'users/:userEmail/sessions'
};
