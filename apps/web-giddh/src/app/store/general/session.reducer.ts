import { CustomActions } from '../custom-actions';
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
            if (action.payload?.status === 'success') {
                const deletedSessionIndex = action.payload.queryString.sessionIndex;
                newState.Usersession.splice(deletedSessionIndex, 1);
                return Object.assign({}, state, newState);
            }
            return state;
        case SessionActions.DELETE_ALL_SESSION_RESPONSE:
            newState.Usersession = [];
            return Object.assign({}, state, newState);
        default:
            return state;
    }
}
