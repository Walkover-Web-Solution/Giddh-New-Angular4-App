import { Action, ActionReducer } from '@ngrx/store';
import { GroupsWithAccountsResponse } from '../../models/api-models/GroupsWithAccounts';
import { BaseResponse } from '../../models/api-models/BaseResponse';

/**
 * Keeping Track of the GroupAndAccountStates
 */
export interface CurrentGroupAndAccountState {
  groupswithaccounts?: GroupsWithAccountsResponse[];
}

/**
 * Setting the InitialState for this Reducer's Store
 */
const initialState: CurrentGroupAndAccountState = {
  groupswithaccounts: null
};

export const GroupsWithAccountsReducer: ActionReducer<CurrentGroupAndAccountState> = (state: CurrentGroupAndAccountState = initialState, action: Action) => {

  switch (action.type) {
    default:
      return state;
  }
};
