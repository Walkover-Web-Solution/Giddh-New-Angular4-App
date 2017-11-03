import { GroupsWithAccountsResponse } from '../../models/api-models/GroupsWithAccounts';
import { Action, ActionReducer } from '@ngrx/store';

export interface GeneralState {
  groupswithaccounts: GroupsWithAccountsResponse[];
}

const initialState: GeneralState = {
  groupswithaccounts: null
};

export const GeneRalReducer: ActionReducer<GeneralState> = (state: GeneralState = initialState, action: Action) => {
  return state;
};
