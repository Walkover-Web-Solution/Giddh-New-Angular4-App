import { AccountsAction } from '../../services/actions/accounts.actions';
import { GroupWithAccountsAction } from './../../services/actions/groupwithaccounts.actions';
import { BaseResponse } from './../../models/api-models/BaseResponse';
import { GroupResponse, FlattenGroupsAccountsResponse, GroupSharedWithResponse, UnShareGroupResponse, GroupsTaxHierarchyResponse } from './../../models/api-models/Group';
import { Action, ActionReducer } from '@ngrx/store';
import { GroupsWithAccountsResponse } from '../../models/api-models/GroupsWithAccounts';
import { IGroupsWithAccounts } from '../../models/interfaces/groupsWithAccounts.interface';
import * as _ from 'lodash';
import { IFlattenGroupsAccountsDetail } from '../../models/interfaces/flattenGroupsAccountsDetail.interface';
import { AccountsTaxHierarchyResponse } from '../../models/api-models/Account';
import { AccountResponse, AccountSharedWithResponse } from '../../models/api-models/Account';
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
  activeAccountSharedWith?: AccountSharedWithResponse[];
  activeGroupTaxHierarchy?: GroupsTaxHierarchyResponse;
  activeAccountTaxHierarchy?: AccountsTaxHierarchyResponse;
  addAccountOpen: boolean;
  activeAccount: AccountResponse;
  fetchingUniqueName: boolean;
  isAccountNameAvailable: boolean;
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
  activeGroupSharedWith: null,
  activeAccountSharedWith: null,
  activeGroupTaxHierarchy: null,
  addAccountOpen: false,
  activeAccount: null,
  fetchingUniqueName: false,
  isAccountNameAvailable: false
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
            toggleActiveGroupFunc(grp.groups, grpData.body.uniqueName);
            grp.isActive = false;
          }
        });
        return Object.assign({}, state, {
          activeGroup: grpData.body,
          activeGroupInProgress: false,
          groupswithaccounts: groupArray,
          activeGroupTaxHierarchy: null,
          activeGroupSharedWith: null
        });
      }
      return state;
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
    case AccountsAction.SHARED_ACCOUNT_WITH_RESPONSE:
      let sharedAccountData: BaseResponse<AccountSharedWithResponse[]> = action.payload;
      if (sharedAccountData.status === 'success') {
        return Object.assign({}, state, {
          activeAccountSharedWith: sharedAccountData.body
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

    case GroupWithAccountsAction.RESET_GROUPS_STATE:
      return Object.assign({}, state, {
        groupswithaccounts: [],
        isGroupWithAccountsLoading: false,
        activeGroup: null,
        accountSearchString: '',
        isRefreshingFlattenGroupsAccounts: false,
        activeGroupInProgress: false,
        activeGroupSharedWith: []
      });
    case GroupWithAccountsAction.GET_GROUP_TAX_HIERARCHY:

      return Object.assign({}, state, {
        activeGroupTaxHierarchy: null
      });
    case GroupWithAccountsAction.GET_GROUP_TAX_HIERARCHY_RESPONSE:
      let taxHierarchyData: BaseResponse<GroupsTaxHierarchyResponse> = action.payload;
      if (taxHierarchyData.status === 'success') {
        return Object.assign({}, state, {
          activeGroupTaxHierarchy: taxHierarchyData.body
        });
      }
      return state;
    case AccountsAction.GET_ACCOUNT_TAX_HIERARCHY:
      return Object.assign({}, state, {
        activeAccountTaxHierarchy: null
      });
    case AccountsAction.GET_ACCOUNT_TAX_HIERARCHY_RESPONSE:
      let accountTaxHierarchyData: BaseResponse<AccountsTaxHierarchyResponse> = action.payload;
      if (accountTaxHierarchyData.status === 'success') {
        return Object.assign({}, state, {
          activeAccountTaxHierarchy: accountTaxHierarchyData.body
        });
      }
      return state;
    case GroupWithAccountsAction.SHOW_ADD_ACCOUNT_FORM:
      return Object.assign({}, state, {
        addAccountOpen: true,
        activeAccount: null
      });
    case GroupWithAccountsAction.HIDE_ADD_ACCOUNT_FORM:
      return Object.assign({}, state, {
        addAccountOpen: false,
        activeAccount: null
      });
    case GroupWithAccountsAction.UPDATE_GROUP_RESPONSE:
      let activeGrpData: BaseResponse<GroupResponse> = action.payload;
      if (activeGrpData.status === 'success') {
        let newObj = Object.assign({}, activeGrpData.body, {isOpen: true, isActive: true});
        // let groupArray: GroupsWithAccountsResponse[] = _.cloneDeep(state.groupswithaccounts);
        // groupArray.forEach(grp => {
        //   if (grp.uniqueName === activeGrpData.body.uniqueName) {
        //     grp = Object.assign({}, grp, activeGrpData.body);
        //     return;
        //   } else {
        //     updateActiveGroupFunc(grp.groups, activeGrpData.body);
        //   }
        // });
        return Object.assign({}, state, {
          activeGroup: newObj,
          activeGroupInProgress: false,
          // groupswithaccounts: groupArray
        });
      }
      return state;
    case AccountsAction.GET_ACCOUNT_DETAILS_RESPONSE:
      let activeAccount: BaseResponse<AccountResponse> = action.payload;
      if (activeAccount.status === 'success') {
        return Object.assign({}, state, {
          activeAccount: action.payload.body,
          addAccountOpen: true
        });
      }
      return state;
    case AccountsAction.UPDATE_ACCOUNT_RESPONSE:
      let updatedAccount: BaseResponse<AccountResponse> = action.payload;
      if (updatedAccount.status === 'success') {
        return Object.assign({}, state, {
          activeAccount: action.payload.body,
        });
      }
      return state;
    case AccountsAction.RESET_ACTIVE_ACCOUNT:
      return Object.assign({}, state, { activeAccount: null, addAccountOpen: false });
    case AccountsAction.GET_ACCOUNT_UNIQUENAME:
      return Object.assign({}, state, { fetchingUniqueName: true});
    case AccountsAction.GET_ACCOUNT_UNIQUENAME_RESPONSE:
    let responseData: BaseResponse<AccountResponse> = action.payload;
    if (responseData.status === 'success') {
      return Object.assign({}, state, { fetchingUniqueName: false, isAccountNameAvailable: false});
    } else {
      return Object.assign({}, state, { fetchingUniqueName: false, isAccountNameAvailable: true});
    }
    default:
      return state;
  }
};

const toggleActiveGroupFunc = (groups: IGroupsWithAccounts[], uniqueName: string): boolean => {
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
      myChildElementIsOpen = toggleActiveGroupFunc(grp.groups, uniqueName);
      // grp.isOpen = myChildElementIsOpen;
      if (grp.isOpen) {
        return myChildElementIsOpen;
      }
    }
  }
  return myChildElementIsOpen;
};

const updateActiveGroupFunc = (groups: IGroupsWithAccounts[], updatedGroup: GroupResponse) => {
  for (let grp of groups) {
    if (grp.uniqueName === updatedGroup.uniqueName) {
      grp = Object.assign({}, grp, updatedGroup);
      break;
    }
    if (grp.groups) {
      updateActiveGroupFunc(grp.groups, updatedGroup);
    }
  }
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
