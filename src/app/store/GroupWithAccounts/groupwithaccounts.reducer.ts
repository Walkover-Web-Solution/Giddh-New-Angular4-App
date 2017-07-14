import { GroupCreateRequest, GroupUpateRequest } from '../../models/api-models/Group';
import { AccountsAction } from '../../services/actions/accounts.actions';
import { BaseResponse } from './../../models/api-models/BaseResponse';
import {
  FlattenGroupsAccountsResponse,
  GroupResponse,
  GroupSharedWithResponse,
  GroupsTaxHierarchyResponse
} from './../../models/api-models/Group';
import { Action, ActionReducer } from '@ngrx/store';
import { GroupsWithAccountsResponse } from '../../models/api-models/GroupsWithAccounts';
import { IGroupsWithAccounts } from '../../models/interfaces/groupsWithAccounts.interface';
import * as _ from 'lodash';
import { IFlattenGroupsAccountsDetail } from '../../models/interfaces/flattenGroupsAccountsDetail.interface';
import {
  AccountRequest,
  AccountResponse,
  AccountSharedWithResponse,
  AccountsTaxHierarchyResponse
} from '../../models/api-models/Account';
import { GroupWithAccountsAction } from '../../services/actions/groupwithaccounts.actions';
/**
 * Keeping Track of the GroupAndAccountStates
 */
export interface CurrentGroupAndAccountState {
  showAddNew: boolean;
  showAddNewAccount: boolean;
  showAddNewGroup: boolean;
  showEditGroup: boolean;
  showEditAccount: boolean;
  groupswithaccounts: GroupsWithAccountsResponse[];
  isGroupWithAccountsLoading: boolean;
  activeGroup: GroupResponse;
  accountSearchString: string;
  flattenGroupsAccounts: IFlattenGroupsAccountsDetail[];
  isRefreshingFlattenGroupsAccounts: boolean;
  activeGroupInProgress: boolean;
  activeGroupSharedWith?: GroupSharedWithResponse[];
  activeAccountSharedWith?: AccountSharedWithResponse[];
  activeGroupTaxHierarchy?: GroupsTaxHierarchyResponse;
  activeAccountTaxHierarchy?: AccountsTaxHierarchyResponse;
  addAccountOpen: boolean;
  activeAccount: AccountResponse;
  fetchingGrpUniqueName: boolean;
  isGroupNameAvailable?: boolean;
  fetchingAccUniqueName: boolean;
  isAccountNameAvailable?: boolean;
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
  showAddNew: false,
  showAddNewAccount: false,
  showAddNewGroup: false,
  showEditGroup: false,
  showEditAccount: false,
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
  fetchingGrpUniqueName: false,
  fetchingAccUniqueName: false,
  flattenGroupsAccounts: []
};

export const GroupsWithAccountsReducer: ActionReducer<CurrentGroupAndAccountState> = (state: CurrentGroupAndAccountState = initialState, action: Action) => {
  switch (action.type) {
    case GroupWithAccountsAction.SHOW_ADD_NEW_FORM:

      return Object.assign({}, state, {
        showAddNew: true,
        showAddNewAccount: false,
        showAddNewGroup: false,
        showEditGroup: false,
        showEditAccount: false
      });
    case GroupWithAccountsAction.HIDE_ADD_NEW_FORM:
      return Object.assign({}, state, {
        showAddNew: false,
        showAddNewAccount: false,
        showAddNewGroup: false,
        showEditGroup: false,
        showEditAccount: false
      });
    case GroupWithAccountsAction.SET_ACTIVE_GROUP:
      let activeGroupData: IGroupsWithAccounts;
      return Object.assign({}, state, {
        activeGroup: activeGroupData,
        activeGroupInProgress: false,
        activeGroupTaxHierarchy: null,
        activeGroupSharedWith: null,
        showAddNew: false,
        showAddNewAccount: false,
        showAddNewGroup: false,
        showEditGroup: true,
        showEditAccount: false
      });
    case GroupWithAccountsAction.RESET_ACTIVE_GROUP:
      return Object.assign({}, state, {
        activeGroup: null,
        activeGroupTaxHierarchy: null,
        activeGroupSharedWith: null,
        showAddNew: false,
        showAddNewAccount: false,
        showAddNewGroup: false,
        showEditGroup: false,
        showEditAccount: false,
      });
    case GroupWithAccountsAction.GET_GROUP_WITH_ACCOUNTS:
      return Object.assign({}, state, {
        isGroupWithAccountsLoading: true
      });

    case GroupWithAccountsAction.SET_GROUP_ACCOUNTS_SEARCH_STRING:
      return Object.assign({}, state, {
        accountSearchString: action.payload
      });

    case GroupWithAccountsAction.GET_GROUP_WITH_ACCOUNTS_RESPONSE:
      let data: BaseResponse<GroupsWithAccountsResponse[], string> = action.payload;
      if (data.status === 'success') {
        let newData = prepare(data.body);
        return Object.assign({}, state, {
          isGroupWithAccountsLoading: false,
          groupswithaccounts: newData
        });
      }
      return state;
    case GroupWithAccountsAction.GET_GROUP_DETAILS:
      return Object.assign({}, state, {
        activeGroupInProgress: true
      });

    case GroupWithAccountsAction.GET_GROUP_DETAILS_RESPONSE:
      let grpData: BaseResponse<GroupResponse, string> = action.payload;
      if (grpData.status === 'success') {
        return Object.assign({}, state, {
          activeGroup: grpData.body,
          activeGroupInProgress: false,
          activeGroupTaxHierarchy: null,
          activeGroupSharedWith: null,
          showAddNew: false,
          showAddNewAccount: false,
          showAddNewGroup: false,
          showEditGroup: true,
          showEditAccount: false
        });
      }
      return state;
    case GroupWithAccountsAction.GET_FLATTEN_GROUPS_ACCOUNTS:
      return Object.assign({}, state, {
        isRefreshingFlattenGroupsAccounts: true
      });
    case GroupWithAccountsAction.GET_FLATTEN_GROUPS_ACCOUNTS_RESPONSE:
      let data1: BaseResponse<FlattenGroupsAccountsResponse, string> = action.payload;
      if (data1.status === 'success') {
        let newData = prepareFlattenGroupsAccounts(data1.body.results);
        return Object.assign({}, state, {
          flattenGroupsAccounts: newData,
          isRefreshingFlattenGroupsAccounts: false
        });
      }
      return state;
    case GroupWithAccountsAction.CREATE_GROUP_RESPONSE:
      let gData: BaseResponse<GroupResponse, GroupCreateRequest> = action.payload;
      if (gData.status === 'success') {
        let groupArray: GroupsWithAccountsResponse[] = _.cloneDeep(state.groupswithaccounts);
        for (let grp of groupArray) {
          if (grp.uniqueName === gData.request.parentGroupUniqueName) {
            let newData = new GroupsWithAccountsResponse();
            newData.accounts = [];
            newData.category = grp.category;
            newData.groups = [];
            newData.isActive = false;
            newData.name = gData.body.name;
            newData.synonyms = gData.body.synonyms;
            newData.uniqueName = gData.body.uniqueName;
            grp.isOpen = true;
            grp.groups.push(newData);
            break;
          }
          if (grp.groups) {
            if (AddAndActiveGroupFunc(grp.groups, gData)) {
              grp.isOpen = true;
              break;
            }
          }
        }
        return Object.assign({}, state, {
          groupswithaccounts: groupArray
        });
      }
      return state;

    case GroupWithAccountsAction.SHARED_GROUP_WITH_RESPONSE:
      let sharedData: BaseResponse<GroupSharedWithResponse[], string> = action.payload;
      if (sharedData.status === 'success') {
        return Object.assign({}, state, {
          activeGroupSharedWith: sharedData.body
        });
      }
      return state;
    case AccountsAction.SHARED_ACCOUNT_WITH_RESPONSE:
      let sharedAccountData: BaseResponse<AccountSharedWithResponse[], string> = action.payload;
      if (sharedAccountData.status === 'success') {
        return Object.assign({}, state, {
          activeAccountSharedWith: sharedAccountData.body
        });
      }
      return state;
    case GroupWithAccountsAction.UNSHARE_GROUP_RESPONSE:
      let unSharedData: BaseResponse<string, string> = action.payload;
      if (unSharedData.status === 'success') {
        let myGroupSharedWith = _.cloneDeep(state.activeGroupSharedWith).filter(ac => unSharedData.request !== ac.userEmail);
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
        activeGroupSharedWith: [],
        activeAccount: null
      });
    case GroupWithAccountsAction.GET_GROUP_TAX_HIERARCHY:

      return Object.assign({}, state, {
        activeGroupTaxHierarchy: null
      });
    case GroupWithAccountsAction.GET_GROUP_TAX_HIERARCHY_RESPONSE:
      let taxHierarchyData: BaseResponse<GroupsTaxHierarchyResponse, string> = action.payload;
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
      let accountTaxHierarchyData: BaseResponse<AccountsTaxHierarchyResponse, string> = action.payload;
      if (accountTaxHierarchyData.status === 'success') {
        return Object.assign({}, state, {
          activeAccountTaxHierarchy: accountTaxHierarchyData.body
        });
      }
      return state;
    case GroupWithAccountsAction.SHOW_ADD_GROUP_FORM:
      return Object.assign({}, state, {
        addAccountOpen: false,
        activeAccount: null,
        showAddNew: false,
        showAddNewAccount: false,
        showAddNewGroup: true,
        showEditGroup: false,
        showEditAccount: false
      });
    case GroupWithAccountsAction.HIDE_ADD_GROUP_FORM:
      return Object.assign({}, state, {
        addAccountOpen: false,
        activeAccount: null,
        showAddNew: false,
        showAddNewAccount: false,
        showAddNewGroup: false,
        showEditGroup: false,
        showEditAccount: false
      });

    case GroupWithAccountsAction.SHOW_EDIT_GROUP_FORM:
      return Object.assign({}, state, {
        addAccountOpen: false,
        activeAccount: null,
        showAddNew: false,
        showAddNewAccount: false,
        showAddNewGroup: false,
        showEditGroup: true,
        showEditAccount: false
      });
    case GroupWithAccountsAction.HIDE_EDIT_GROUP_FORM:
      return Object.assign({}, state, {
        addAccountOpen: false,
        activeAccount: null,
        showAddNew: false,
        showAddNewAccount: false,
        showAddNewGroup: false,
        showEditGroup: false,
        showEditAccount: false
      });
    case GroupWithAccountsAction.SHOW_ADD_ACCOUNT_FORM:
      return Object.assign({}, state, {
        addAccountOpen: true,
        activeAccount: null,
        showAddNew: false,
        showAddNewAccount: true,
        showAddNewGroup: false,
        showEditGroup: false,
        showEditAccount: false
      });
    case GroupWithAccountsAction.HIDE_ADD_ACCOUNT_FORM:
      return Object.assign({}, state, {
        addAccountOpen: false,
        activeAccount: null,
        showAddNew: false,
        showAddNewAccount: false,
        showAddNewGroup: false,
        showEditGroup: false,
        showEditAccount: false
      });
    case GroupWithAccountsAction.SHOW_EDIT_ACCOUNT_FORM:
      return Object.assign({}, state, {
        addAccountOpen: true,
        activeAccount: null,
        showAddNew: false,
        showAddNewAccount: false,
        showAddNewGroup: false,
        showEditGroup: false,
        showEditAccount: true
      });
    case GroupWithAccountsAction.HIDE_EDIT_ACCOUNT_FORM:
      return Object.assign({}, state, {
        addAccountOpen: false,
        activeAccount: null,
        showAddNew: false,
        showAddNewAccount: false,
        showAddNewGroup: false,
        showEditGroup: false,
        showEditAccount: false
      });
    case GroupWithAccountsAction.UPDATE_GROUP_RESPONSE:
      let activeGrpData: BaseResponse<GroupResponse, GroupUpateRequest> = action.payload;
      if (activeGrpData.status === 'success') {
        let newObj = Object.assign({}, activeGrpData.body, { isOpen: true, isActive: true });
        let groupArray: GroupsWithAccountsResponse[] = _.cloneDeep(state.groupswithaccounts);
        groupArray.forEach(grp => {
          if (grp.uniqueName === activeGrpData.body.uniqueName) {
            grp = Object.assign({}, grp, activeGrpData.body);
            return;
          } else {
            updateActiveGroupFunc(grp.groups, activeGrpData.body);
          }
        });
        return Object.assign({}, state, {
          activeGroup: newObj,
          activeGroupInProgress: false,
          groupswithaccounts: groupArray
        });
      }
      return state;
    case AccountsAction.GET_ACCOUNT_DETAILS_RESPONSE:
      let activeAccount: BaseResponse<AccountResponse, string> = action.payload;
      if (activeAccount.status === 'success') {
        return Object.assign({}, state, {
          activeAccount: action.payload.body,
          addAccountOpen: true
        });
      }
      return state;
    case AccountsAction.UPDATE_ACCOUNT_RESPONSE:
      let updatedAccount: BaseResponse<AccountResponse, AccountRequest> = action.payload;
      if (updatedAccount.status === 'success') {
        return Object.assign({}, state, {
          activeAccount: action.payload.body,
        });
      }
      return state;
    case AccountsAction.RESET_ACTIVE_ACCOUNT:
      return Object.assign({}, state, { activeAccount: null, addAccountOpen: false });
    case AccountsAction.GET_ACCOUNT_UNIQUENAME:
      return Object.assign({}, state, { fetchingAccUniqueName: true, isAccountNameAvailable: null });
    case AccountsAction.GET_ACCOUNT_UNIQUENAME_RESPONSE:
      let responseData: BaseResponse<AccountResponse, string> = action.payload;
      if (responseData.status === 'success') {
        return Object.assign({}, state, { fetchingAccUniqueName: false, isAccountNameAvailable: false });
      } else {
        if (responseData.code === 'ACCOUNT_NOT_FOUND') {
          return Object.assign({}, state, { fetchingAccUniqueName: false, isAccountNameAvailable: true });
        }
        return state;
      }
    case GroupWithAccountsAction.GET_GROUP_UNIQUENAME:
      return Object.assign({}, state, { fetchingGrpUniqueName: true, isGroupNameAvailable: null });
    case GroupWithAccountsAction.GET_GROUP_UNIQUENAME_RESPONSE:
      let resData: BaseResponse<AccountResponse, string> = action.payload;
      if (resData.status === 'success') {
        return Object.assign({}, state, { fetchingGrpUniqueName: false, isGroupNameAvailable: false });
      } else {
        if (resData.code === 'GROUP_NOT_FOUND') {
          return Object.assign({}, state, { fetchingGrpUniqueName: false, isGroupNameAvailable: true });
        }
        return state;
      }
    case AccountsAction.DELETE_ACCOUNT_RESPONSE:
      let d: BaseResponse<string, string> = action.payload;
      if (d.status === 'success') {
        let groupArray: GroupsWithAccountsResponse[] = _.cloneDeep(state.groupswithaccounts);
        groupArray.forEach(grp => {
          if (grp.uniqueName === state.activeGroup.uniqueName) {
            let index = grp.accounts.findIndex(a => a.uniqueName === d.request);
            grp.accounts.splice(index, 1);
            return;
          } else {
            removeAccountFunc(grp.groups, state.activeGroup.uniqueName, d.request);
          }
        });
        return Object.assign({}, state, {
          groupswithaccounts: groupArray
        });
      }
      return state;
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
      grp.name = updatedGroup.name;
      grp.uniqueName = updatedGroup.uniqueName;
      break;
    }
    if (grp.groups) {
      updateActiveGroupFunc(grp.groups, updatedGroup);
    }
  }
};
const AddAndActiveGroupFunc = (groups: IGroupsWithAccounts[], gData: BaseResponse<GroupResponse, GroupCreateRequest>): boolean => {
  let myChildElementIsOpen = false;
  for (let grp of groups) {
    if (grp.uniqueName === gData.request.parentGroupUniqueName) {
      let newData = new GroupsWithAccountsResponse();
      newData.accounts = [];
      newData.category = grp.category;
      newData.groups = [];
      newData.isActive = false;
      newData.name = gData.body.name;
      newData.synonyms = gData.body.synonyms;
      newData.uniqueName = gData.body.uniqueName;
      grp.isOpen = true;
      grp.groups.push(newData);
      myChildElementIsOpen = true;
      return myChildElementIsOpen;
    }
    if (grp.groups) {
      if (AddAndActiveGroupFunc(grp.groups, gData)) {
        // grp.isOpen = true;
        return true;
      } else {
        // grp.isOpen = false;
      }
    }
  }
  return myChildElementIsOpen;
};
const setActiveGroupFunc = (groups: IGroupsWithAccounts[], uniqueName: string, result: IGroupsWithAccounts) => {
  for (let el of groups) {
    if (el.uniqueName === uniqueName) {
      el.isActive = true;
      el.isOpen = true;
      result = el;
      return result;
    }
    if (el.groups) {
      result = setActiveGroupFunc(el.groups, uniqueName, result);
      if (result) {
        el.isOpen = true;
        result = el;
      } else {
        el.isOpen = false;
      }
    }
  }
  return result;
};
const removeAccountFunc = (groups: IGroupsWithAccounts[], uniqueName: string, accountUniqueName: string) => {
  for (let grp of groups) {
    if (grp.uniqueName === uniqueName) {
      let index = grp.accounts.findIndex(a => a.uniqueName === accountUniqueName);
      grp.accounts.splice(index, 1);
      break;
    }
    if (grp.groups) {
      removeAccountFunc(grp.groups, uniqueName, accountUniqueName);
    }
  }
};
