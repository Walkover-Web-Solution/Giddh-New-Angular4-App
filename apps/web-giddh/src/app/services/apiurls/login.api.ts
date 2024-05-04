export const LOGIN_API = {
    SignupWithPassword: 'v2/signup',
    LoginWithPassword: 'v2/login-with-password',
    SignupWithEmail: 'signup-with-email',
    VerifyEmail: 'v2/verify-email',
    SignupWithMobile: 'generate-otp',
    VerifyOTP: 'v2/verify-number',
    VerifyNumber: 'users/system_admin/verify-number',
    LoginWithNumber: 'login-with-number?countryCode=:countryCode&mobileNumber=:mobileNumber', // get call
    LOGIN_WITH_GOOGLE: 'v2/signup-with-google',
    CLEAR_SESSION: 'users/:userUniqueName/destroy-session',
    SET_SETTINGS: 'users/:userUniqueName/settings',
    FETCH_DETAILS: 'users/:sessionId',
    GET_AUTH_KEY: 'users/:uniqueName/get-auth-key',
    REGENERATE_AUTH_KEY: 'users/:userEmail/generate-auth-key',
    GET_SESSION: 'users/:userEmail/sessions',
    GET_USER_SUBSCRIPTION_PLAN_API: 'subscriptions/all?countryCode=:countryCode',
    DELETE_SESSION: 'users/:userEmail/destroy-session',
    DELETE_ALL_SESSION: 'users/:userEmail/sessions',
    FORGOT_PASSWORD: 'users/:userEmail/forgot-password',
    RESET_PASSWORD: 'reset-password',
    RENEW_SESSION: 'users/:userUniqueName/increment-session', // PUT
    GET_USER_DETAILS_FROM_SESSION_ID: 'v2/user',
    LOGIN_WITH_OTP: 'v2/login'
};

export const GMAIL_API = {
    GENERATE_GMAIL_TOKEN: 'company/:companyUniqueName/generate-mail-token',// POST
    SAVE_GMAIL_TOKEN: "company/:companyUniqueName/save-mail-token"
};
