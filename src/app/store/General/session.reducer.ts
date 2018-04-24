import { LoginActions } from '../../actions/login.action';
import { CompanyActions } from '../../actions/company.actions';
import { Action, ActionReducer } from '@ngrx/store';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { StateDetailsResponse, StateDetailsRequest } from '../../models/api-models/Company';
import { CustomActions } from '../customActions';
import { SessionActions } from '../../actions/session.action';

/**
 * Keeping Track of the AuthenticationState
 */
export interface SessionState {
  Usersession: any[];
}

/**
 * Setting the InitialState for this Reducer's Store
 */
const initialState = {
  Usersession: []
};

export function SessionReducer(state: any = initialState, action: CustomActions): any {
  let newState = _.cloneDeep(state);
  switch (action.type) {
    case SessionActions.GET_ALL_SESSION_RESPONSE:
      newState.Usersession = action.payload.body;
      return Object.assign({}, state, newState);
    case SessionActions.DELETE_SESSION_RESPONSE:
      newState.Usersession = action.payload.body;
      return Object.assign({}, state, newState);
    case SessionActions.DELETE_ALL_SESSION_RESPONSE:
      newState.Usersession = [];
      return Object.assign({}, state, newState);
    default:
      return state;
  }
}
