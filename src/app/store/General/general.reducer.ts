import { GroupsWithAccountsResponse } from '../../models/api-models/GroupsWithAccounts';
import { Action, ActionReducer } from '@ngrx/store';
import { GENERAL_ACTIONS } from '../../services/actions/general/general.const';
import { BaseResponse } from '../../models/api-models/BaseResponse';

export interface GeneralState {
  groupswithaccounts: GroupsWithAccountsResponse[];
}

const initialState: GeneralState = {
  groupswithaccounts: null
};

export const GeneRalReducer: ActionReducer<GeneralState> = (state: GeneralState = initialState, action: Action) => {
  switch (action.type) {
    case GENERAL_ACTIONS.GENERAL_GET_GROUP_WITH_ACCOUNTS_RESPONSE : {
      let result: BaseResponse<GroupsWithAccountsResponse[], string> = action.payload;
      if (result.status === 'success') {
        return {
          ...state,
          groupswithaccounts: result.body
        };
      }
      return state;
    }
    default :
      return state;
  }
};
