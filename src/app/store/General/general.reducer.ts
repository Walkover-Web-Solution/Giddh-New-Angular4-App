import { GroupsWithAccountsResponse } from '../../models/api-models/GroupsWithAccounts';
import { GENERAL_ACTIONS } from '../../actions/general/general.const';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { AccountMergeRequest, AccountMoveRequest, AccountRequestV2, AccountResponse, AccountResponseV2, FlattenAccountsResponse } from '../../models/api-models/Account';
import { IFlattenAccountsResultItem } from '../../models/interfaces/flattenAccountsResultItem.interface';
import { States } from '../../models/api-models/Company';
import { GroupCreateRequest, GroupResponse, GroupUpateRequest, MoveGroupRequest, MoveGroupResponse } from '../../models/api-models/Group';
import * as _ from '../../lodash-optimized';
import { GroupWithAccountsAction } from '../../actions/groupwithaccounts.actions';
import { IGroupsWithAccounts } from '../../models/interfaces/groupsWithAccounts.interface';
import { AccountsAction } from '../../actions/accounts.actions';
import { IAccountsInfo } from '../../models/interfaces/accountInfo.interface';
import { CustomActions } from '../customActions';
import { COMMON_ACTIONS } from '../../actions/common.const';

export interface GeneralState {
  groupswithaccounts: GroupsWithAccountsResponse[];
  flattenAccounts: IFlattenAccountsResultItem[];
  states: States[];
  addAndManageClosed: boolean;
}

const initialState: GeneralState = {
  groupswithaccounts: null,
  flattenAccounts: null,
  states: null,
  addAndManageClosed: false
};

export function GeneRalReducer(state: GeneralState = initialState, action: CustomActions): GeneralState {
  switch (action.type) {
    case COMMON_ACTIONS.RESET_APPLICATION_DATA: {
      return Object.assign({}, state, initialState);
    }
    case 'EmptyAction': {
      return state;
    }
    case GENERAL_ACTIONS.GENERAL_GET_GROUP_WITH_ACCOUNTS_RESPONSE: {
      let result: BaseResponse<GroupsWithAccountsResponse[], string> = action.payload;
      if (result.status === 'success') {
        return {
          ...state,
          groupswithaccounts: result.body
        };
      }
      return state;
    }
    case GENERAL_ACTIONS.GENERAL_GET_FLATTEN_ACCOUNTS_RESPONSE: {
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
      return state;
    }

    // groups with accounts actions
    case GroupWithAccountsAction.CREATE_GROUP_RESPONSE:
      let gData: BaseResponse<GroupResponse, GroupCreateRequest> = action.payload;
      if (gData.status === 'success') {
        let groupArray: GroupsWithAccountsResponse[] = _.cloneDeep(state.groupswithaccounts);
        let myChildElementIsOpen = false;
        AddAndActiveGroupFunc(groupArray, gData, myChildElementIsOpen);
        return {
          ...state,
          groupswithaccounts: groupArray
        };
      }
      return state;
    case GroupWithAccountsAction.UPDATE_GROUP_RESPONSE: {
      let activeGrpData: BaseResponse<GroupResponse, GroupUpateRequest> = action.payload;
      if (activeGrpData.status === 'success') {
        Object.assign({}, activeGrpData.body, { isOpen: true, isActive: true });
        let groupArray: GroupsWithAccountsResponse[] = _.cloneDeep(state.groupswithaccounts);
        updateActiveGroupFunc(groupArray, activeGrpData.queryString.groupUniqueName, activeGrpData.body, false);
        return {
          ...state,
          groupswithaccounts: groupArray
        };
      }
      return state;
    }
    case GroupWithAccountsAction.DELETE_GROUP_RESPONSE:
      let g: BaseResponse<string, string> = action.payload;
      if (g.status === 'success') {
        let groupArray: GroupsWithAccountsResponse[] = _.cloneDeep(state.groupswithaccounts);
        removeGroupFunc(groupArray, g.request, null);
        return {
          ...state,
          groupswithaccounts: groupArray
        };
      }
      return state;
    case GroupWithAccountsAction.MOVE_GROUP_RESPONSE:
      let m: BaseResponse<MoveGroupResponse, MoveGroupRequest> = action.payload;
      if (m.status === 'success') {
        let groupArray: GroupsWithAccountsResponse[] = _.cloneDeep(state.groupswithaccounts);
        let deletedItem = removeGroupFunc(groupArray, m.queryString.groupUniqueName, null);
        addNewGroupFunc(groupArray, deletedItem, m.request.parentGroupUniqueName, false);
        return {
          ...state,
          groupswithaccounts: groupArray
        };
      }
      return state;

    //  accounts actions
    case AccountsAction.CREATE_ACCOUNT_RESPONSEV2: {
      let accountData: BaseResponse<AccountResponseV2, AccountRequestV2> = action.payload;
      if (accountData.status === 'success') {
        let groupArray: GroupsWithAccountsResponse[] = _.cloneDeep(state.groupswithaccounts);
        addCreatedAccountFunc(groupArray, accountData.body, accountData.queryString.groupUniqueName, false);
        return {
          ...state,
          groupswithaccounts: groupArray,
          flattenAccounts: [...state.flattenAccounts, accountData.body]
        };
      }
      return state;
    }
    case AccountsAction.UPDATE_ACCOUNT_RESPONSEV2: {
      let updatedAccount: BaseResponse<AccountResponseV2, AccountRequestV2> = action.payload;
      if (updatedAccount.status === 'success') {
        let groupArray: GroupsWithAccountsResponse[] = _.cloneDeep(state.groupswithaccounts);
        let flattenAccountsArray: IFlattenAccountsResultItem[] = _.cloneDeep(state.flattenAccounts);
        UpdateAccountFunc(groupArray, updatedAccount.body, updatedAccount.queryString.groupUniqueName, updatedAccount.queryString.accountUniqueName, false);
        let index = flattenAccountsArray.findIndex(fa => fa.uniqueName === updatedAccount.queryString.accountUniqueName);
        flattenAccountsArray[index] = updatedAccount.body;
        return {
          ...state,
          groupswithaccounts: groupArray,
          flattenAccounts: flattenAccountsArray
        };
      }
      return state;
    }
    case AccountsAction.DELETE_ACCOUNT_RESPONSE: {
      let d: BaseResponse<string, any> = action.payload;
      if (d.status === 'success') {
        let groupArray: GroupsWithAccountsResponse[] = _.cloneDeep(state.groupswithaccounts);
        let flattenAccountsArray: IFlattenAccountsResultItem[] = _.cloneDeep(state.flattenAccounts);
        let accountForDelete: IFlattenAccountsResultItem = flattenAccountsArray.find(f => f.uniqueName === d.request.accountUniqueName);
        let parentGroupsLength = accountForDelete.parentGroups.length;
        removeAccountFunc(groupArray, accountForDelete.parentGroups[parentGroupsLength - 1].uniqueName, d.request.accountUniqueName, null);
        let index = flattenAccountsArray.findIndex(fa => fa.uniqueName === accountForDelete.uniqueName);
        flattenAccountsArray.splice(index, 1);
        return {
          ...state,
          groupswithaccounts: groupArray,
          flattenAccounts: flattenAccountsArray
        };
      }
      return state;
    }
    case AccountsAction.MOVE_ACCOUNT_RESPONSE: {
      let mAcc: BaseResponse<string, AccountMoveRequest> = action.payload;
      if (mAcc.status === 'success') {
        let groupArray: GroupsWithAccountsResponse[] = _.cloneDeep(state.groupswithaccounts);
        let flattenAccountsArray: IFlattenAccountsResultItem[] = _.cloneDeep(state.flattenAccounts);
        let accountForDelete: IFlattenAccountsResultItem = flattenAccountsArray.find(f => f.uniqueName === mAcc.queryString.accountUniqueName);
        let parentGroupsLength = accountForDelete.parentGroups.length;
        let deletedItem = removeAccountFunc(groupArray, accountForDelete.parentGroups[parentGroupsLength - 1].uniqueName, mAcc.queryString.accountUniqueName, null);
        let parentPath = [];
        addNewAccountFunc(groupArray, deletedItem, mAcc.request.uniqueName, false, parentPath);
        accountForDelete.parentGroups = parentPath.reverse();
        flattenAccountsArray.map(fa => {
          if (fa.uniqueName === accountForDelete.uniqueName) {
            fa = accountForDelete;
          }
          return fa;
        });
        return {
          ...state,
          groupswithaccounts: groupArray,
          flattenAccounts: flattenAccountsArray
        };
      }
      return state;
    }
    case AccountsAction.MERGE_ACCOUNT_RESPONSE: {
      let dd: BaseResponse<string, AccountMergeRequest[]> = action.payload;
      if (dd.status === 'success') {
        let groupArray: GroupsWithAccountsResponse[] = _.cloneDeep(state.groupswithaccounts);
        dd.request.forEach(f => {
          findAndRemoveAccountFunc(groupArray, f.uniqueName, false);
        });

        return {
          ...state,
          groupswithaccounts: groupArray
        };
      }
    }
    case GENERAL_ACTIONS.CLOSE_ADD_AND_MANAGE: {
      let newState = _.cloneDeep(state);
      newState.addAndManageClosed = !newState.addAndManageClosed;
      return Object.assign({}, state, newState);
    }
    default:
      return state;
  }
}

const AddAndActiveGroupFunc = (groups: IGroupsWithAccounts[], gData: BaseResponse<GroupResponse, GroupCreateRequest>, myChildElementIsOpen: boolean): boolean => {
  // let myChildElementIsOpen = false;
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
      myChildElementIsOpen = AddAndActiveGroupFunc(grp.groups, gData, myChildElementIsOpen);
      if (myChildElementIsOpen) {
        return myChildElementIsOpen;
      }
    }
  }
  return myChildElementIsOpen;
};

const updateActiveGroupFunc = (groups: IGroupsWithAccounts[], uniqueName: string, updatedGroup: GroupResponse, result: boolean): boolean => {
  if (result) {
    return result;
  }
  for (let grp of groups) {
    if (grp.uniqueName === uniqueName) {
      grp.name = updatedGroup.name;
      grp.uniqueName = updatedGroup.uniqueName;
      grp.isActive = true;
      grp.isOpen = false;
      result = true;
      break;
    }
    if (grp.groups) {
      result = updateActiveGroupFunc(grp.groups, uniqueName, updatedGroup, result);
      if (result) {
        break;
      }
    }
  }
  return result;
};

const removeGroupFunc = (groups: IGroupsWithAccounts[], uniqueName: string, result: IGroupsWithAccounts) => {
  for (let i = 0; i < groups.length; i++) {
    if (groups[i].uniqueName === uniqueName) {
      result = groups[i];
      groups.splice(i, 1);
      return result;
    }
    if (groups[i].groups) {
      result = removeGroupFunc(groups[i].groups, uniqueName, result);
      if (result) {
        return result;
      }
    }
  }
};

const addNewGroupFunc = (groups: IGroupsWithAccounts[], gData: IGroupsWithAccounts, parentUniqueName: string, result: boolean): boolean => {
  if (result) {
    return result;
  }
  for (let grp of groups) {
    if (grp.uniqueName === parentUniqueName) {
      grp.groups.push(gData);
      result = true;
      return result;
    }
    if (grp.groups) {
      result = addNewGroupFunc(grp.groups, gData, parentUniqueName, result);
      if (result) {
        return result;
      }
    }
  }
  return result;
};

const addCreatedAccountFunc = (groups: IGroupsWithAccounts[], aData: AccountResponseV2 | AccountResponse, grpUniqueName: string, result: boolean): boolean => {
  if (result) {
    return result;
  }
  for (let grp of groups) {
    if (grp.uniqueName === grpUniqueName) {
      grp.isOpen = true;
      grp.accounts.push(
        {
          uniqueName: aData.uniqueName,
          name: aData.name,
          isActive: true,
          stocks: aData.stocks,
          mergedAccounts: aData.mergedAccounts
        }
      );
      result = true;
      return result;
    }
    if (grp.groups) {
      result = addCreatedAccountFunc(grp.groups, aData, grpUniqueName, result);
      if (result) {
        return result;
      }
    }
  }
  return result;
};

const UpdateAccountFunc = (groups: IGroupsWithAccounts[],
  aData: AccountResponseV2, grpUniqueName: string, accountUniqueName: string, result: boolean): boolean => {
  if (result) {
    return result;
  }
  for (let grp of groups) {
    if (grp.uniqueName === grpUniqueName) {
      grp.isOpen = true;
      let index = grp.accounts.findIndex(p => p.uniqueName === accountUniqueName);
      grp.accounts[index].uniqueName = aData.uniqueName;
      grp.accounts[index].name = aData.name;
      grp.accounts[index].isActive = true;
      grp.accounts[index].stocks = aData.stocks;
      grp.accounts[index].mergedAccounts = aData.mergedAccounts;
      result = true;
      return result;
    }
    if (grp.groups) {
      result = UpdateAccountFunc(grp.groups, aData, grpUniqueName, accountUniqueName, result);
      if (result) {
        return result;
      }
    }
  }
  return result;
};

const removeAccountFunc = (groups: IGroupsWithAccounts[], uniqueName: string, accountUniqueName: string, result: IAccountsInfo): IAccountsInfo => {
  for (let grp of groups) {
    if (grp.uniqueName === uniqueName) {
      let index = grp.accounts.findIndex(a => a.uniqueName === accountUniqueName);
      result = grp.accounts[index];
      grp.accounts.splice(index, 1);
      return result;
    }
    if (grp.groups) {
      result = removeAccountFunc(grp.groups, uniqueName, accountUniqueName, result);
      if (result) {
        return result;
      }
    }
  }
};

const addNewAccountFunc = (groups: IGroupsWithAccounts[], aData: IAccountsInfo, grpUniqueName: string, result: boolean, parentPath = null): boolean => {
  if (result) {
    return result;
  }
  for (let grp of groups) {
    if (grp.uniqueName === grpUniqueName) {
      grp.isOpen = true;
      grp.accounts.push(aData);
      if (Array.isArray(parentPath)) {
        parentPath.push({
          name: grp.name,
          uniqueName: grp.uniqueName
        });
      }
      result = true;
      return result;
    }
    if (grp.groups) {
      result = addNewAccountFunc(grp.groups, aData, grpUniqueName, result, parentPath);
      if (result) {
        if (Array.isArray(parentPath)) {
          parentPath.push({
            name: grp.name,
            uniqueName: grp.uniqueName
          });
        }
        return result;
      }
    }
  }
  return result;
};

const findAndRemoveAccountFunc = (groups: IGroupsWithAccounts[], uniqueName: string, result: boolean) => {
  for (let grp of groups) {
    let accIndex = grp.accounts.findIndex(f => f.uniqueName === uniqueName);

    if (accIndex > -1) {
      grp.accounts.splice(accIndex, 1);
      result = true;
      return result;
    }
    if (grp.groups) {
      result = findAndRemoveAccountFunc(grp.groups, uniqueName, result);
      if (result) {
        return result;
      }
    }
  }
};
