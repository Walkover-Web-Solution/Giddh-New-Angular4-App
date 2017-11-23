import { GroupsWithAccountsResponse } from '../../models/api-models/GroupsWithAccounts';
import { Action, ActionReducer } from '@ngrx/store';
import { GENERAL_ACTIONS } from '../../services/actions/general/general.const';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { FlattenAccountsResponse } from '../../models/api-models/Account';
import { IFlattenAccountsResultItem } from '../../models/interfaces/flattenAccountsResultItem.interface';
import { States } from '../../models/api-models/Company';

export interface GeneralState {
  groupswithaccounts: GroupsWithAccountsResponse[];
  flattenAccounts: IFlattenAccountsResultItem[];
  states: States[];
}

const initialState: GeneralState = {
  groupswithaccounts: null,
  flattenAccounts: null,
  states: null
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
    case GENERAL_ACTIONS.GENERAL_GET_FLATTEN_ACCOUNTS_RESPONSE : {
      let result: BaseResponse<FlattenAccountsResponse, string> = action.payload;
      if (result.status === 'success') {
        return {
          ...state,
          flattenAccounts: result.body.results
        };
      }
      return state;
    }
    case GENERAL_ACTIONS.GENERAL_GET_ALL_STATES_RESPONSE: {
      let result: BaseResponse<States[], string> = action.payload;
      if (result.status === 'success') {
        return {
          ...state,
          states: result.body
        };
      }
    }
    default :
      return state;
  }
};
