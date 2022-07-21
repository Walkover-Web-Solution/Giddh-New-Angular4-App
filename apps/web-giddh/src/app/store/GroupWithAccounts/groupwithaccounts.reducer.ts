import { ShareRequestForm } from './../../models/api-models/Permission';
import { GroupCreateRequest, GroupResponse, GroupSharedWithResponse, GroupsTaxHierarchyResponse, GroupUpateRequest, MoveGroupRequest, MoveGroupResponse } from '../../models/api-models/Group';
import { AccountsAction } from '../../actions/accounts.actions';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { GroupsWithAccountsResponse } from '../../models/api-models/GroupsWithAccounts';
import { IGroupsWithAccounts } from '../../models/interfaces/groupsWithAccounts.interface';
import { IFlattenGroupsAccountsDetail } from '../../models/interfaces/flattenGroupsAccountsDetail.interface';
import { AccountMergeRequest, AccountMoveRequest, AccountRequest, AccountRequestV2, AccountResponse, AccountResponseV2, AccountSharedWithResponse, AccountsTaxHierarchyResponse } from '../../models/api-models/Account';
import { GroupWithAccountsAction } from '../../actions/groupwithaccounts.actions';
import { IAccountsInfo } from '../../models/interfaces/accountInfo.interface';
import { INameUniqueName } from '../../models/api-models/Inventory';
import { CustomActions } from '../customActions';
import { COMMON_ACTIONS } from '../../actions/common.const';

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
    isAddAndManageOpenedFromOutside: boolean;
    activeGroup: GroupResponse;
    activeGroupUniqueName: string;
    groupAndAccountSearchString: string;
    flattenGroupsAccounts: IFlattenGroupsAccountsDetail[];
    activeGroupInProgress: boolean;
    activeGroupSharedWith?: ShareRequestForm[];
    activeAccountSharedWith?: ShareRequestForm[];
    activeGroupTaxHierarchy?: GroupsTaxHierarchyResponse;
    activeAccountTaxHierarchy?: AccountsTaxHierarchyResponse;
    addAccountOpen: boolean;
    activeAccount: AccountResponseV2;
    fetchingGrpUniqueName: boolean;
    isCreateGroupInProcess?: boolean;
    isCreateGroupSuccess?: boolean;
    isUpdateGroupInProcess?: boolean;
    isUpdateGroupSuccess?: boolean;
    isDeleteGroupInProcess?: boolean;
    isDeleteGroupSuccess?: boolean;
    isMoveGroupInProcess?: boolean;
    isMoveGroupSuccess?: boolean;
    isGroupNameAvailable?: boolean;
    createAccountInProcess?: boolean;
    createAccountIsSuccess?: boolean;
    updateAccountInProcess?: boolean;
    updateAccountIsSuccess?: boolean;
    moveAccountSuccess?: boolean;
    newlyCreatedAccount: INameUniqueName;
    isDeleteAccInProcess: boolean;
    isDeleteAccSuccess: boolean;
    activeTab: number;
}

const prepare = (mockData: GroupsWithAccountsResponse[]): GroupsWithAccountsResponse[] => {
    return _.orderBy(mockData.map((m) => {
        m = {
            ...m,
            isActive: false,
            isOpen: false,
            isVisible: true
        };
        m.groups = prepare(m.groups);
        m.groups = _.sortBy(m.groups, ['name']);
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
    activeGroupUniqueName: null,
    groupAndAccountSearchString: '',
    activeGroupInProgress: false,
    activeGroupSharedWith: null,
    activeAccountSharedWith: null,
    activeGroupTaxHierarchy: null,
    addAccountOpen: false,
    activeAccount: null,
    fetchingGrpUniqueName: false,
    flattenGroupsAccounts: [],
    newlyCreatedAccount: null,
    isDeleteGroupSuccess: false,
    isDeleteGroupInProcess: false,
    isMoveGroupSuccess: false,
    isMoveGroupInProcess: false,
    isAddAndManageOpenedFromOutside: false,
    isDeleteAccSuccess: false,
    isDeleteAccInProcess: false,
    activeTab: 0
};

export function GroupsWithAccountsReducer(state: CurrentGroupAndAccountState = initialState, action: CustomActions): CurrentGroupAndAccountState {
    switch (action.type) {
        case COMMON_ACTIONS.RESET_APPLICATION_DATA: {
            return Object.assign({}, state, initialState);
        }
        case AccountsAction.RESET_ACTIVE_GROUP:
            return Object.assign({}, state, { activeGroup: null });

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
            return Object.assign({}, state, {
                activeGroupUniqueName: action.payload
            });
        case GroupWithAccountsAction.GET_GROUP_WITH_ACCOUNTS:
            return Object.assign({}, state, {
                isGroupWithAccountsLoading: true
            });

        case GroupWithAccountsAction.SET_GROUP_ACCOUNTS_SEARCH_STRING:
            return Object.assign({}, state, {
                groupAndAccountSearchString: action.payload
            });
        case GroupWithAccountsAction.OPEN_ADD_AND_MANAGE_FROM_OUTSIDE: {
            return Object.assign({}, state, {
                groupAndAccountSearchString: action.payload,
                isAddAndManageOpenedFromOutside: true
            });
        }
        case GroupWithAccountsAction.HIDE_ADD_AND_MANAGE_FROM_OUTSIDE: {
            return Object.assign({}, state, {
                groupAndAccountSearchString: '',
                isAddAndManageOpenedFromOutside: false,
                activeTab: 0
            });
        }
        case GroupWithAccountsAction.GET_GROUP_WITH_ACCOUNTS_RESPONSE:
            let data: BaseResponse<GroupsWithAccountsResponse[], string> = action.payload;
            if (data.status === 'success') {
                let newData = prepare(data.body);
                return Object.assign({}, state, {
                    isGroupWithAccountsLoading: false,
                    groupswithaccounts: newData,
                    activeGroup: null,
                    activeGroupUniqueName: null,
                    activeAccount: null,
                    showAddNew: false,
                    showAddNewAccount: false,
                    showAddNewGroup: false,
                    showEditGroup: false,
                    showEditAccount: false
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
                    activeGroupUniqueName: grpData.body.uniqueName,
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
        case GroupWithAccountsAction.CREATE_GROUP:
            return Object.assign({}, state, {
                isCreateGroupInProcess: true,
                isCreateGroupSuccess: false
            });
        case GroupWithAccountsAction.CREATE_GROUP_RESPONSE:
            let gData: BaseResponse<GroupResponse, GroupCreateRequest> = action.payload;
            if (gData.status === 'success') {
                let groupArray: GroupsWithAccountsResponse[] = _.cloneDeep(state.groupswithaccounts);
                let myChildElementIsOpen = false;
                AddAndActiveGroupFunc(groupArray, gData, myChildElementIsOpen);
                return Object.assign({}, state, {
                    groupswithaccounts: groupArray,
                    isCreateGroupInProcess: false,
                    isCreateGroupSuccess: true
                });
            }
            return Object.assign({}, state, {
                isCreateGroupInProcess: false,
                isCreateGroupSuccess: false
            });

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
        case AccountsAction.UNSHARE_ACCOUNT_RESPONSE:
            let unSharedAccData: BaseResponse<string, string> = action.payload;
            if (unSharedAccData.status === 'success') {
                let myAccountSharedWith = _.cloneDeep(state.activeAccountSharedWith).filter(ac => unSharedAccData.request !== ac.userEmail);
                return Object.assign({}, state, {
                    activeAccountSharedWith: myAccountSharedWith
                });
            }
            return state;
        case GroupWithAccountsAction.RESET_GROUPS_STATE:
            return Object.assign({}, state, {
                groupswithaccounts: [],
                isGroupWithAccountsLoading: false,
                activeGroup: null,
                activeGroupUniqueName: null,
                activeGroupInProgress: false,
                activeGroupSharedWith: [],
                activeAccount: null,
                addAccountOpen: false,
                showAddNew: false,
                showAddNewAccount: false,
                showAddNewGroup: false,
                showEditGroup: false,
                showEditAccount: false,
                isCreateGroupInProcess: false,
                isCreateGroupSuccess: false,
                isUpdateGroupInProcess: false,
                isUpdateGroupSuccess: false,
                isDeleteGroupSuccess: false,
                isDeleteGroupInProcess: false,
                isMoveGroupInProcess: false,
                isMoveGroupSuccess: false
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
        case GroupWithAccountsAction.UPDATE_GROUP:
            return Object.assign({}, state, {
                isUpdateGroupInProcess: true,
                isUpdateGroupSuccess: false
            });
        case GroupWithAccountsAction.UPDATE_GROUP_RESPONSE: {
            let activeGrpData: BaseResponse<GroupResponse, GroupUpateRequest> = action.payload;
            if (activeGrpData.status === 'success') {
                let newObj = Object.assign({}, activeGrpData.body, { isOpen: true, isActive: true });
                let groupArray: GroupsWithAccountsResponse[] = _.cloneDeep(state.groupswithaccounts);
                let result = false;
                updateActiveGroupFunc(groupArray, activeGrpData.queryString?.groupUniqueName, activeGrpData.body, result);
                return Object.assign({}, state, {
                    activeGroup: newObj,
                    activeGroupUniqueName: newObj.uniqueName,
                    activeGroupInProgress: false,
                    groupswithaccounts: groupArray,
                    isUpdateGroupInProcess: false,
                    isUpdateGroupSuccess: true
                });
            }
            return Object.assign({}, state, {
                isUpdateGroupInProcess: false,
                isUpdateGroupSuccess: false
            });
        }
        case AccountsAction.GET_ACCOUNT_DETAILS_RESPONSE:
            let activeAccount: BaseResponse<AccountResponseV2, string> = action.payload;
            if (activeAccount.status === 'success') {
                return Object.assign({}, state, {
                    activeAccount: action.payload.body,
                    addAccountOpen: true
                });
            }
            return state;
        case AccountsAction.UPDATE_ACCOUNTV2:
            return Object.assign({}, state, { updateAccountInProcess: true, updateAccountIsSuccess: false });
        case AccountsAction.RESET_UPDATE_ACCOUNTV2:
            return Object.assign({}, state, { updateAccountInProcess: false, updateAccountIsSuccess: false });
        case AccountsAction.UPDATE_ACCOUNT_RESPONSEV2: {
            let updatedAccount: BaseResponse<AccountResponseV2, AccountRequestV2> = action.payload;
            if (updatedAccount.status === 'success') {
                let groupArray: GroupsWithAccountsResponse[] = _.cloneDeep(state.groupswithaccounts);
                UpdateAccountFunc(groupArray, updatedAccount.body, updatedAccount.queryString?.groupUniqueName, updatedAccount.queryString?.accountUniqueName, false);
                return Object.assign({}, state, {
                    activeAccount: action.payload.body,
                    updateAccountInProcess: false,
                    groupswithaccounts: groupArray,
                    updateAccountIsSuccess: true
                });
            }
            return Object.assign({}, state, { updateAccountInProcess: false, updateAccountIsSuccess: false });
        }
        case AccountsAction.RESET_ACTIVE_ACCOUNT:
            return Object.assign({}, state, { activeAccount: null, addAccountOpen: false });
        case AccountsAction.DELETE_ACCOUNT:
            return {
                ...state,
                isDeleteAccSuccess: false,
                isDeleteAccInProcess: true
            };

        case AccountsAction.DELETE_ACCOUNT_RESPONSE:
            let d: BaseResponse<string, any> = action.payload;
            if (d.status === 'success') {
                let groupArray: GroupsWithAccountsResponse[] = _.cloneDeep(state.groupswithaccounts);
                removeAccountFunc(groupArray, d.request.accountUniqueName, d.request?.groupUniqueName, null);
                return Object.assign({}, state, {
                    groupswithaccounts: groupArray,
                    activeAccount: null,
                    activeGroup: { uniqueName: d.request?.groupUniqueName },
                    isDeleteAccSuccess: true,
                    isDeleteAccInProcess: false
                });
            }
            return state;

        case AccountsAction.RESET_DELETE_ACCOUNT_FLAGS:
            return {
                ...state, isDeleteAccSuccess: false, isDeleteAccInProcess: false
            }

        case GroupWithAccountsAction.DELETE_GROUP:
            return {
                ...state,
                isDeleteGroupInProcess: true,
                isDeleteGroupSuccess: false
            };
        case GroupWithAccountsAction.DELETE_GROUP_RESPONSE:
            let g: BaseResponse<string, string> = action.payload;
            if (g.status === 'success') {
                let groupArray: GroupsWithAccountsResponse[] = _.cloneDeep(state.groupswithaccounts);
                removeGroupFunc(groupArray, g.request, null);
                return Object.assign({}, state, {
                    groupswithaccounts: groupArray,
                    activeGroup: { uniqueName: g.queryString.parentUniqueName },
                    isDeleteGroupInProcess: false,
                    isDeleteGroupSuccess: true
                });
            }
            return {
                ...state,
                isDeleteGroupInProcess: false,
                isDeleteGroupSuccess: false
            };
        case GroupWithAccountsAction.MOVE_GROUP:
            return {
                ...state,
                isMoveGroupInProcess: true,
                isMoveGroupSuccess: false
            };
        case GroupWithAccountsAction.MOVE_GROUP_RESPONSE: {
            let m: BaseResponse<MoveGroupResponse, MoveGroupRequest> = action.payload;
            if (m.status === 'success') {
                let groupArray: GroupsWithAccountsResponse[] = _.cloneDeep(state.groupswithaccounts);
                let deletedItem = removeGroupFunc(groupArray, m.queryString?.groupUniqueName, null);
                addNewGroupFunc(groupArray, deletedItem, m.request.parentGroupUniqueName, false);
                return Object.assign({}, state, {
                    groupswithaccounts: groupArray,
                    activeGroup: { uniqueName: m.request.parentGroupUniqueName },
                    activeGroupUniqueName: m.request.parentGroupUniqueName,
                    isMoveGroupInProcess: false,
                    isMoveGroupSuccess: true
                });
            }
            return {
                ...state,
                isMoveGroupInProcess: false,
                isMoveGroupSuccess: false
            };
        }
        case GroupWithAccountsAction.GEN_ADD_AND_MANAGE_UI: {
            let groupArray: GroupsWithAccountsResponse[] = _.cloneDeep(action.payload.groups);
            genAddAndManageUi(groupArray, action.payload, null);
            return {
                ...state,
                groupswithaccounts: groupArray
            };
        }

        case AccountsAction.MOVE_ACCOUNT_RESPONSE: {
            let mAcc: BaseResponse<string, AccountMoveRequest> = action.payload;
            if (mAcc.status === 'success') {
                let groupArray: GroupsWithAccountsResponse[] = _.cloneDeep(state.groupswithaccounts);
                let deletedItem = removeAccountFunc(groupArray, mAcc.queryString.activeGroupUniqueName, mAcc.queryString.accountUniqueName, null);
                addNewAccountFunc(groupArray, deletedItem, mAcc.request.uniqueName, false);
                return Object.assign({}, state, {
                    groupswithaccounts: groupArray,
                    moveAccountSuccess: true,
                    activeAccount: null,
                    activeGroup: { uniqueName: mAcc.request.uniqueName },
                    activeGroupUniqueName: mAcc.request.uniqueName,
                    showEditGroup: true,
                    showEditAccount: false,
                    showAddNewAccount: false
                });
            }
            return Object.assign({}, state, {
                moveAccountSuccess: false
            });
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
        case AccountsAction.CREATE_ACCOUNTV2:
        case AccountsAction.CREATE_ACCOUNT: {
            return Object.assign({}, state, { createAccountInProcess: true, createAccountIsSuccess: false });
        }

        case AccountsAction.CREATE_ACCOUNT_RESPONSEV2: {
            let accountData: BaseResponse<AccountResponseV2, AccountRequestV2> = action.payload;
            if (accountData.status === 'success') {
                let o: INameUniqueName = {
                    name: accountData.body.name,
                    uniqueName: accountData.body.uniqueName
                };
                let groupArray: GroupsWithAccountsResponse[] = _.cloneDeep(state.groupswithaccounts);
                if (groupArray) {
                    addCreatedAccountFunc(groupArray, accountData.body, accountData.queryString?.groupUniqueName, false);
                }
                return Object.assign({}, state, {
                    createAccountInProcess: false,
                    createAccountIsSuccess: true,
                    groupswithaccounts: groupArray,
                    newlyCreatedAccount: o
                });
            } else {
                return Object.assign({}, state, { createAccountInProcess: false, createAccountIsSuccess: false, newlyCreatedAccount: null });
            }
        }

        case AccountsAction.CREATE_ACCOUNT_RESPONSE: {
            let accountData: BaseResponse<AccountResponse, AccountRequest> = action.payload;
            if (accountData.status === 'success') {
                let o: INameUniqueName = {
                    name: accountData.body.name,
                    uniqueName: accountData.body.uniqueName
                };
                let groupArray: GroupsWithAccountsResponse[] = _.cloneDeep(state.groupswithaccounts);
                if (groupArray) {
                    addCreatedAccountFunc(groupArray, accountData.body, accountData.queryString?.groupUniqueName, false);
                }
                return Object.assign({}, state, {
                    createAccountInProcess: false,
                    createAccountIsSuccess: true,
                    groupswithaccounts: groupArray,
                    newlyCreatedAccount: o
                });
            } else {
                return Object.assign({}, state, { createAccountInProcess: false, createAccountIsSuccess: false, newlyCreatedAccount: null });
            }
        }
        case GroupWithAccountsAction.MOVE_GROUP_COMPLETE:
            return {
                ...state,
                isMoveGroupSuccess: false
            };
        case GroupWithAccountsAction.UPDATE_ACTIVE_TAB_ADD_AND_MANAGE: {
            return Object.assign({}, state, {
                activeTab: action.payload
            });
        }
        default: {
            return state;
        }
    }
}

const toggleActiveGroupFunc = (groups: IGroupsWithAccounts[], uniqueName: string): boolean => {
    let myChildElementIsOpen = false;
    if (groups) {
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
                if (grp.isOpen) {
                    return myChildElementIsOpen;
                }
            }
        }
    }
    return myChildElementIsOpen;
};
const updateActiveGroupFunc = (groups: IGroupsWithAccounts[], uniqueName: string, updatedGroup: GroupResponse, result: boolean): boolean => {
    if (result) {
        return result;
    }
    if (groups) {
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
    }
    return result;
};
const AddAndActiveGroupFunc = (groups: IGroupsWithAccounts[], gData: BaseResponse<GroupResponse, GroupCreateRequest>, myChildElementIsOpen: boolean): boolean => {
    if (groups) {
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
const removeAccountFunc = (groups: IGroupsWithAccounts[], uniqueName: string, accountUniqueName: string, result: IAccountsInfo): IAccountsInfo => {
    if (groups) {
        for (let grp of groups) {
            if (grp.uniqueName === uniqueName) {
                let index = grp.accounts.findIndex(a => a.uniqueName === accountUniqueName);
                grp.isOpen = false;
                grp.isActive = false;
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
const addNewAccountFunc = (groups: IGroupsWithAccounts[], aData: IAccountsInfo, grpUniqueName: string, result: boolean): boolean => {
    if (result) {
        return result;
    }
    if (groups) {
        for (let grp of groups) {
            if (grp.uniqueName === grpUniqueName) {
                grp.isOpen = true;
                grp.accounts.push(aData);
                result = true;
                return result;
            }
            if (grp.groups) {
                result = addNewAccountFunc(grp.groups, aData, grpUniqueName, result);
                if (result) {
                    return result;
                }
            }
        }
    }
    return result;
};

const addCreatedAccountFunc = (groups: IGroupsWithAccounts[], aData: AccountResponseV2 | AccountResponse, grpUniqueName: string, result: boolean): boolean => {
    if (result) {
        return result;
    }
    if (groups) {
        for (let grp of groups) {
            if (grp.uniqueName === grpUniqueName) {
                grp.isOpen = true;
                grp.accounts.push(
                    {
                        uniqueName: aData.uniqueName,
                        name: aData.name,
                        isActive: true,
                        stocks: aData.stocks,
                        mergedAccounts: aData.mergedAccounts,
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
    }
    return result;
};

const UpdateAccountFunc = (groups: IGroupsWithAccounts[],
    aData: AccountResponseV2, grpUniqueName: string, accountUniqueName: string, result: boolean): boolean => {
    if (result) {
        return result;
    }
    if (groups) {
        for (let grp of groups) {
            if (grp.uniqueName === grpUniqueName) {
                grp.isOpen = true;
                let index = grp.accounts.findIndex(p => p.uniqueName === accountUniqueName);
                if (index > -1) {
                    grp.accounts[index].uniqueName = aData.uniqueName;
                    grp.accounts[index].name = aData.name;
                    grp.accounts[index].isActive = true;
                    grp.accounts[index].stocks = aData.stocks;
                    grp.accounts[index].mergedAccounts = aData.mergedAccounts;
                }
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

const genAddAndManageUi = (groups: IGroupsWithAccounts[], uniqueName: string, result: boolean) => {
    for (let grp of groups) {
        if (grp.uniqueName === uniqueName) {
            grp.isActive = true;
            grp.isOpen = true;
            result = true;
            return result;
        }

        if (grp.groups) {
            result = genAddAndManageUi(grp.groups, uniqueName, result);

            if (result) {
                grp.isOpen = true;
                return result;
            }
        }
    }
};
