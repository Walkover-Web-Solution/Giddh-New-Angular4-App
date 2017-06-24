import { GroupResponse } from './../../models/api-models/Group';
import { Action, ActionReducer } from '@ngrx/store';
import { GroupsWithAccountsResponse } from '../../models/api-models/GroupsWithAccounts';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { IGroupsWithAccounts } from '../../models/interfaces/groupsWithAccounts.interface';
import { GroupWithAccountsAction } from '../../services/actions/groupwithaccounts.actions';
import { mockData } from '../../shared/header/components/manage-groups-accounts/mock';
import * as _ from 'lodash';
/**
 * Keeping Track of the GroupAndAccountStates
 */
export interface CurrentGroupAndAccountState {
  groupswithaccounts: GroupsWithAccountsResponse[];
  isGroupWithAccountsLoading: boolean;
  activeGroup: GroupResponse;
  accountSearchString: string;
}

const prepare = (mockData: GroupsWithAccountsResponse[]): GroupsWithAccountsResponse[] => {
  return _.orderBy(mockData.map((m) => {
    m = Object.assign({}, m, {
        isActive: false,
        isOpen: false
    });

    m.groups = prepare(m.groups);
    return m;
  }), 'category');
};

/**
 * Setting the InitialState for this Reducer's Store
 */
const initialState: CurrentGroupAndAccountState = {
  groupswithaccounts: null,
  isGroupWithAccountsLoading: false,
  activeGroup: null,
  accountSearchString: ''
};

export const GroupsWithAccountsReducer: ActionReducer<CurrentGroupAndAccountState> = (state: CurrentGroupAndAccountState = initialState, action: Action) => {
  switch (action.type) {
    case GroupWithAccountsAction.GET_GROUP_WITH_ACCOUNTS:
      return Object.assign({}, state , {
        isGroupWithAccountsLoading: true
      });

    case GroupWithAccountsAction.SET_GROUP_ACCOUNTS_SEARCH_STRING:
      return Object.assign({}, state, {
        accountSearchString: action.payload
      });

    case GroupWithAccountsAction.GET_GROUP_WITH_ACCOUNTS_RESPONSE:
      let data: BaseResponse<GroupsWithAccountsResponse[]> = action.payload;
      if (data.status === 'success') {
        let newData = prepare(data.body);
        return Object.assign({} , state, {
          groupswithaccounts: newData,
          isGroupWithAccountsLoading: false
        });
      }
      return state;

    case GroupWithAccountsAction.GET_GROUP_DETAILS_RESPONSE:
      let grpData: BaseResponse<GroupResponse> = action.payload;
      if (grpData.status === 'success') {
        let groupArray: GroupsWithAccountsResponse[] = _.cloneDeep(state.groupswithaccounts);
        groupArray.forEach(grp => {
          if (grp.uniqueName === grpData.body.uniqueName) {
            grp.isActive = true;
            grp.isOpen = !grp.isOpen;
            return;
          } else {
            setActiveGroupFunc(grp.groups, grpData.body.uniqueName);
            grp.isActive = false;
          }
        });
        return Object.assign({}, state, {
          activeGroup: grpData.body,
          groupswithaccounts: groupArray
        });
      }
      return state;

    default:
      return state;
  }
};

const setActiveGroupFunc = (groups: IGroupsWithAccounts[], uniqueName: string): boolean => {
  let myChildElementIsOpen = false;
  for (let grp of groups) {
    if (grp.uniqueName === uniqueName) {
      grp.isActive = true;
      grp.isOpen = !grp.isOpen;
      myChildElementIsOpen = !grp.isOpen;
      break;
    } else {
      grp.isActive = false;
    }
    if (grp.groups) {
      myChildElementIsOpen = setActiveGroupFunc(grp.groups, uniqueName);
      // grp.isOpen = myChildElementIsOpen;
      if (grp.isOpen) {
        return myChildElementIsOpen;
      }
    }
  }
  return myChildElementIsOpen;
};
