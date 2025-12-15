import { VerifyMobileActions } from '../../actions/verify-mobile.actions';
import { CustomActions } from '../custom-actions';

/**
 * Keeping Track of the AuthenticationState
 */
export interface VerifyMobileState {
    phoneNumber: string;
    showVerificationBox: boolean;
    isMobileVerified: boolean;
}

/**
 * Setting the InitialState for this Reducer's Store
 */
const initialState = {
    phoneNumber: '',
    showVerificationBox: false,
    isMobileVerified: false
};

export function VerifyMobileReducer(state: VerifyMobileState = initialState, action: CustomActions): VerifyMobileState {

    switch (action.type) {
        case VerifyMobileActions.SET_VERIFIACATION_MOBILENO:
            return Object.assign({}, state, {
                phoneNumber: action.payload
            });
        case VerifyMobileActions.SHOW_VERIFICATION_BOX:
            return Object.assign({}, state, {
                showVerificationBox: action.payload
            });
        case VerifyMobileActions.VERIFY_MOBILE_CODE_RESPONSE:
            return Object.assign({}, state, {
                isMobileVerified: true
            });
        case VerifyMobileActions.HIDE_VERIFICATION_BOX:
            return Object.assign({}, state, {
                showVerificationBox: action.payload
            });
        default:
            return state;
    }
}
