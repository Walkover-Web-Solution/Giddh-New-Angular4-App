import { Action, ActionReducer } from '@ngrx/store';
import { GroupsWithAccountsResponse } from '../../models/api-models/GroupsWithAccounts';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { IGroupsWithAccounts } from '../../models/interfaces/groupsWithAccounts.interface';
import { GroupWithAccountsAction } from '../../services/actions/groupwithaccounts.actions';
import { mockData } from '../../shared/header/components/manage-groups-accounts/mock';
/**
 * Keeping Track of the GroupAndAccountStates
 */
export interface CurrentGroupAndAccountState {
  groupswithaccounts: GroupsWithAccountsResponse[];
}

const prepare = (mockData: GroupsWithAccountsResponse[]): GroupsWithAccountsResponse[] => {
  return mockData.map((m) => {
    m = m as GroupsWithAccountsResponse;
    m.isActive = false;
    m.isOpen = false;
    m.groups = prepare(m.groups);
    return m;
  });
};

/**
 * Setting the InitialState for this Reducer's Store
 */
const initialState: CurrentGroupAndAccountState = {
  groupswithaccounts: prepare(mockData)
};

export const GroupsWithAccountsReducer: ActionReducer<CurrentGroupAndAccountState> = (state: CurrentGroupAndAccountState = initialState, action: Action) => {
  switch (action.type) {
    case GroupWithAccountsAction.SET_ACTIVE_GROUP:
      let groupArray: GroupsWithAccountsResponse[] = Object.assign([], state.groupswithaccounts);
      groupArray.map(grp => {
        if (grp.uniqueName === action.payload) {
          grp.isActive = true;
          grp.isOpen = true;
        } else {
          grp.isOpen = setActiveGroupFunc(grp.groups, action.payload);
          grp.isActive = false;
        }
      });
      return Object.assign({}, state, {
        groupswithaccounts: groupArray
      });
    default:
      return state;
  }
};

const setActiveGroupFunc = (groups: IGroupsWithAccounts[], uniqueName: string): boolean => {
  let myChildElementIsOpen = false;
  for (let grp of groups) {
    if (grp.uniqueName === uniqueName) {
      grp.isActive = true;
      grp.isOpen = true;
      myChildElementIsOpen = true;
      break;
    } else {
      grp.isActive = false;
      grp.isOpen = false;
    }
    if (grp.groups) {
      myChildElementIsOpen = setActiveGroupFunc(grp.groups, uniqueName);
      grp.isOpen = myChildElementIsOpen;
      if (grp.isOpen) {
        return myChildElementIsOpen;
      }
    }
  }
  return myChildElementIsOpen;
};
