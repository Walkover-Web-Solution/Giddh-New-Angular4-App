import { Action } from '@ngrx/store';

export interface AuthenticationState {
    isVerifyMobileInProcess: boolean;
    isLoginWithMobileSubmited: boolean;
    isLoginWithEmailSubmited: boolean;
    isLoginWithPasswordInProcess: boolean;
    isForgotPasswordInProcess: boolean;
    isResetPasswordInSuccess: boolean;
    isLoginWithPasswordSuccessNotVerified: boolean;
    isLoginWithPasswordIsShowVerifyOtp: boolean;
    isSocialLogoutAttempted: boolean;
    isLoginWithGoogleInProcess: boolean;
    isTwoWayAuthInProcess: boolean;
    isTwoWayAuthSuccess: boolean;
    isLoginWithEmailInProcess: boolean;
    isVerifyEmailInProcess: boolean;
    isLoginWithMobileInProcess: boolean;
    isSignupWithPasswordInProcess: boolean;
    signupVerifyEmail: string;
}

export interface SessionState {
    userLoginState: any;
    user: any;
    activeCompany: any;
    companyUniqueName: string;
    currentLocale: string;
    activeTheme: string;
    lastState: any;
}

export interface IBranchConsolidatedState {
    branches: any[];
    isBranchConsolidated: boolean;
}

const initialAuthState: AuthenticationState = {
    isVerifyMobileInProcess: false,
    isLoginWithMobileSubmited: false,
    isLoginWithEmailSubmited: false,
    isLoginWithPasswordInProcess: false,
    isForgotPasswordInProcess: false,
    isResetPasswordInSuccess: false,
    isLoginWithPasswordSuccessNotVerified: false,
    isLoginWithPasswordIsShowVerifyOtp: false,
    isSocialLogoutAttempted: false,
    isLoginWithGoogleInProcess: false,
    isTwoWayAuthInProcess: false,
    isTwoWayAuthSuccess: false,
    isLoginWithEmailInProcess: false,
    isVerifyEmailInProcess: false,
    isLoginWithMobileInProcess: false,
    isSignupWithPasswordInProcess: false,
    signupVerifyEmail: ''
};

const initialSessionState: SessionState = {
    userLoginState: null,
    user: null,
    activeCompany: null,
    companyUniqueName: '',
    currentLocale: 'en',
    activeTheme: 'default',
    lastState: null
};

const initialBranchState: IBranchConsolidatedState = {
    branches: [],
    isBranchConsolidated: false
};

export function AuthenticationReducer(state: AuthenticationState = initialAuthState, action: Action): AuthenticationState {
    return state;
}

export function SessionReducer(state: SessionState = initialSessionState, action: Action): SessionState {
    return state;
}

export function BranchConsolidatedReducer(state: IBranchConsolidatedState = initialBranchState, action: Action): IBranchConsolidatedState {
    return state;
}
