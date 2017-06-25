import { BaseResponse } from './../../models/api-models/BaseResponse';
import { GroupResponse, FlattenGroupsAccountsResponse, GroupSharedWithResponse, UnShareGroupResponse } from './../../models/api-models/Group';
import { Action, ActionReducer } from '@ngrx/store';
import { GroupsWithAccountsResponse } from '../../models/api-models/GroupsWithAccounts';
import { IGroupsWithAccounts } from '../../models/interfaces/groupsWithAccounts.interface';
import { GroupWithAccountsAction } from '../../services/actions/groupwithaccounts.actions';
import { mockData } from '../../shared/header/components/manage-groups-accounts/mock';
import * as _ from 'lodash';
import { IFlattenGroupsAccountsDetail } from '../../models/interfaces/flattenGroupsAccountsDetail.interface';
/**
 * Keeping Track of the GroupAndAccountStates
 */
export interface CurrentGroupAndAccountState {
  groupswithaccounts: GroupsWithAccountsResponse[];
  isGroupWithAccountsLoading: boolean;
  activeGroup: GroupResponse;
  accountSearchString: string;
  flattenGroupsAccounts?: IFlattenGroupsAccountsDetail[];
  isRefreshingFlattenGroupsAccounts: boolean;
  activeGroupInProgress: boolean;
  activeGroupSharedWith?: GroupSharedWithResponse[];
}

const prepare = (mockData: GroupsWithAccountsResponse[]): GroupsWithAccountsResponse[] => {
  return _.orderBy(mockData.map((m) => {
    m = Object.assign({}, m, {
      isActive: false,
      isOpen: false,
      isVisible: true
    });

    m.groups = prepare(m.groups);
    return m;
  }), 'category');
};

const prepareFlattenGroupsAccounts = (mockData: IFlattenGroupsAccountsDetail[]): IFlattenGroupsAccountsDetail[] => {
  return mockData.map((m) => {
    m = Object.assign({}, m, {
      isOpen: false
    });
    return m;
  });
};

/**
 * Setting the InitialState for this Reducer's Store
 */
const initialState: CurrentGroupAndAccountState = {
  groupswithaccounts: null,
  isGroupWithAccountsLoading: false,
  activeGroup: null,
  accountSearchString: '',
  isRefreshingFlattenGroupsAccounts: false,
  activeGroupInProgress: false,
  activeGroupSharedWith: null
};

export const GroupsWithAccountsReducer: ActionReducer<CurrentGroupAndAccountState> = (state: CurrentGroupAndAccountState = initialState, action: Action) => {
  switch (action.type) {
    case GroupWithAccountsAction.GET_GROUP_WITH_ACCOUNTS:
      return Object.assign({}, state, {
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
        return Object.assign({}, state, {
          groupswithaccounts: newData,
          isGroupWithAccountsLoading: false
        });
      }
      return state;
    case GroupWithAccountsAction.GET_GROUP_DETAILS:
      return Object.assign({}, state, {
        activeGroupInProgress: true
      });

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
          activeGroupInProgress: false,
          groupswithaccounts: groupArray
        });
      }

    case GroupWithAccountsAction.GET_FLATTEN_GROUPS_ACCOUNTS:
      return Object.assign({}, state, {
        isRefreshingFlattenGroupsAccounts: true
      });
    case GroupWithAccountsAction.GET_FLATTEN_GROUPS_ACCOUNTS_RESPONSE:
      let data1: BaseResponse<FlattenGroupsAccountsResponse> = action.payload;
      if (data1.status === 'success') {
        let newData = prepareFlattenGroupsAccounts(data1.body.results);
        return Object.assign({}, state, {
          flattenGroupsAccounts: newData,
          isRefreshingFlattenGroupsAccounts: false
        });
      }
      return state;
    case GroupWithAccountsAction.CREATE_GROUP_RESPONSE:
      let gData: BaseResponse<GroupResponse> = action.payload;
      if (gData.status === 'success') {
        let groupArray: GroupsWithAccountsResponse[] = _.cloneDeep(state.groupswithaccounts);
        groupArray.forEach(grp => {
          if (grp.isActive) {
            let newData = new GroupsWithAccountsResponse();
            newData.accounts = [];
            newData.category = grp.category;
            newData.groups = [];
            newData.isActive = false;
            newData.isOpen = true;
            newData.name = gData.body.name;
            newData.synonyms = gData.body.synonyms;
            newData.uniqueName = gData.body.uniqueName;
            grp.groups.push(newData);
            return;
          }
          if (grp.groups) {
            if (AddAndActiveGroupFunc(grp.groups, gData)) {
              return;
            }
          }
        });
        return Object.assign({}, state, {
          groupswithaccounts: groupArray
        });
      }
      return state;

    case GroupWithAccountsAction.SHARED_GROUP_WITH_RESPONSE:
      let sharedData: BaseResponse<GroupSharedWithResponse[]> = action.payload;
      if (sharedData.status === 'success') {
        return Object.assign({}, state, {
          activeGroupSharedWith: sharedData.body
        });
      }
      return state;
    case GroupWithAccountsAction.UNSHARE_GROUP_RESPONSE:
      let unSharedData: BaseResponse<UnShareGroupResponse> = action.payload;
      if (unSharedData.status === 'success') {
        let myGroupSharedWith = _.cloneDeep(state.activeGroupSharedWith).filter(ac => unSharedData.body.user !== ac.userEmail);
        return Object.assign({}, state, {
          activeGroupSharedWith: myGroupSharedWith
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

const AddAndActiveGroupFunc = (groups: IGroupsWithAccounts[], gData: BaseResponse<GroupResponse>): boolean => {
  let myChildElementIsOpen = false;
  for (let grp of groups) {
    if (grp.isActive) {
      let newData = new GroupsWithAccountsResponse();
      newData.accounts = [];
      newData.category = grp.category;
      newData.groups = [];
      newData.isActive = false;
      newData.isOpen = true;
      newData.name = gData.body.name;
      newData.synonyms = gData.body.synonyms;
      newData.uniqueName = gData.body.uniqueName;
      grp.groups.push(newData);
      myChildElementIsOpen = true;
      return myChildElementIsOpen;
    }
    if (grp.groups) {
      if (AddAndActiveGroupFunc(grp.groups, gData)) {
        return true;
      } else {
        return false;
      }
    }
  }
  return myChildElementIsOpen;
};
