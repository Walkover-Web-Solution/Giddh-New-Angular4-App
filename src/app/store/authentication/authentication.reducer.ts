import { LoginActions } from '../../services/actions/login.action';
import { Action, ActionReducer } from '@ngrx/store';

/**
 * Keeping Track of the AuthenticationState
 */
export interface AuthenticationState {
  isLoginWithMobileInProcess: boolean; // if true then We are checking with
  isVerifyMobileInProcess: boolean;
  isLoginWithEmailInProcess: boolean;
  isVerifyEmailInProcess: boolean;
  isLoginWithGoogleInProcess: boolean;
  isLoginWithLinkedInInProcess: boolean;
  isLoginWithTwitterInProcess: boolean;
  user: object;                   // current user | null
  error?: object;                 // if an error occurred | null

}

/**
 * Setting the InitialState for this Reducer's Store
 */
const initialState = {
  isLoginWithMobileInProcess: false, // if true then We are checking with
  isVerifyMobileInProcess: false,
  isLoginWithEmailInProcess: false,
  isVerifyEmailInProcess: false,
  isLoginWithGoogleInProcess: false,
  isLoginWithLinkedInInProcess: false,
  isLoginWithTwitterInProcess: false,
  user: null                   // current user | null
};

export const AuthenticationReducer: ActionReducer<AuthenticationState> = (state: AuthenticationState = initialState, action: Action) => {

  console.log(state);

  switch (action.type) {
    case LoginActions.SignupWithEmailResponce:
      return Object.assign({}, state, {
        isLoginWithEmailInProcess: false
      });
    case LoginActions.SignupWithEmail:
      return Object.assign({}, state, {
        isLoginWithEmailInProcess: true
      });
    default:
      return state;
  }
};
