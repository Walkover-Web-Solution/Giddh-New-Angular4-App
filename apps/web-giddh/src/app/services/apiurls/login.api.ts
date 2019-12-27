export const LOGIN_API = {
    // SignupWithPassword: 'signup',
    SignupWithPassword: 'v2/signup',
    // LoginWithPassword: 'login-with-password',
    LoginWithPassword: 'v2/login-with-password',
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
    ADD_BALANCE: 'users/:uniqueName/balance',
    GET_AUTH_KEY: 'users/:uniqueName/get-auth-key',
    REGENERATE_AUTH_KEY: 'users/:userEmail/generate-auth-key',
    GET_SESSION: 'users/:userEmail/sessions',
    GET_USER_SUBSCRIPTION_PLAN_API: 'subscriptions/all?countryCode=:countryCode',
    DELETE_SESSION: 'users/:userEmail/destroy-session',
    UPDATE_SESSION: 'users/:userEmail/increment-session',
    DELETE_ALL_SESSION: 'users/:userEmail/sessions',
    FORGOT_PASSWORD: 'users/:userEmail/forgot-password',
    RESET_PASSWORD: 'reset-password',
    RENEW_SESSION: 'users/:userUniqueName/increment-session', // PUT
};

export const GMAIL_API = {
    GENERATE_GMAIL_TOKEN: 'company/:companyUniqueName/generate-mail-token' // POST
};
