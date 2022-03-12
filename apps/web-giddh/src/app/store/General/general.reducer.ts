import { GroupsWithAccountsResponse } from '../../models/api-models/GroupsWithAccounts';
import { GENERAL_ACTIONS } from '../../actions/general/general.const';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import {
    AccountMergeRequest,
    AccountMoveRequest,
    AccountRequestV2,
    AccountResponse,
    AccountResponseV2
} from '../../models/api-models/Account';
import { IFlattenAccountsResultItem } from '../../models/interfaces/flattenAccountsResultItem.interface';
import { States } from '../../models/api-models/Company';
import {
    GroupCreateRequest,
    GroupResponse,
    GroupUpateRequest,
    MoveGroupRequest,
    MoveGroupResponse
} from '../../models/api-models/Group';
import { cloneDeep } from '../../lodash-optimized';
import { GroupWithAccountsAction } from '../../actions/groupwithaccounts.actions';
import { IGroupsWithAccounts } from '../../models/interfaces/groupsWithAccounts.interface';
import { AccountsAction } from '../../actions/accounts.actions';
import { IAccountsInfo } from '../../models/interfaces/accountInfo.interface';
import { CustomActions } from '../customActions';
import { COMMON_ACTIONS } from '../../actions/common.const';
import { SALES_ACTIONS } from '../../actions/sales/sales.const';
import { CurrentPage } from '../../models/api-models/Common';

export interface GeneralState {
    groupswithaccounts: GroupsWithAccountsResponse[];
    flattenAccounts: IFlattenAccountsResultItem[];
    states: States;
    addAndManageClosed: boolean;
    sideMenuBarOpen: boolean;
    headerTitle: { uniqueName: string, additional: { tab: string, tabIndex: number } };
    currentPage: CurrentPage;
    updateIndexDbInProcess: boolean;
    updateIndexDbComplete: boolean;
    openSideMenu: boolean;
    menuItems: Array<any>;
    openGstSideMenu: boolean;
    isCalendlyModelOpen: boolean;
}

const initialState: GeneralState = {
    groupswithaccounts: null,
    flattenAccounts: null,
    states: null,
    addAndManageClosed: false,
    sideMenuBarOpen: false,
    headerTitle: null,
    currentPage: null,
    updateIndexDbComplete: false,
    updateIndexDbInProcess: false,
    openSideMenu: true,
    menuItems: [],
    openGstSideMenu: false,
    isCalendlyModelOpen: false
};
const AddAndActiveGroupFunc = (groups: IGroupsWithAccounts[], gData: BaseResponse<GroupResponse, GroupCreateRequest>, myChildElementIsOpen: boolean): boolean => {
    for (const grp of groups) {
        if (grp.uniqueName === gData.request.parentGroupUniqueName) {
            const newData = new GroupsWithAccountsResponse();
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
    for (const grp of groups) {
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
    if (groups) {
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
    }
};

const addNewGroupFunc = (groups: IGroupsWithAccounts[], gData: IGroupsWithAccounts, parentUniqueName: string, result: boolean): boolean => {
    if (result) {
        return result;
    }
    for (const grp of groups) {
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
    for (const grp of groups) {
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
    for (const grp of groups) {
        if (grp.uniqueName === grpUniqueName) {
            grp.isOpen = true;
            const index = grp.accounts.findIndex(p => p.uniqueName === accountUniqueName);
            if (index > -1) {
                grp.accounts[index].uniqueName = aData.uniqueName;
                grp.accounts[index].name = aData.name;
                grp.accounts[index].isActive = true;
                grp.accounts[index].stocks = aData.stocks;
                grp.accounts[index].mergedAccounts = aData.mergedAccounts;
                result = true;
                return result;
            }
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
    for (const grp of groups) {
        if (grp.uniqueName === uniqueName) {
            const index = grp.accounts.findIndex(a => a.uniqueName === accountUniqueName);
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
    for (const grp of groups) {
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
    for (const grp of groups) {
        const accIndex = grp.accounts.findIndex(f => f.uniqueName === uniqueName);

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

export function GeneRalReducer(state: GeneralState = initialState, action: CustomActions): GeneralState {
    switch (action.type) {
        case COMMON_ACTIONS.RESET_APPLICATION_DATA: {
            return Object.assign({}, state, initialState);
        }
        case 'EmptyAction': {
            return state;
        }
        case GENERAL_ACTIONS.GENERAL_GET_GROUP_WITH_ACCOUNTS_RESPONSE: {
            const result: BaseResponse<GroupsWithAccountsResponse[], string> = action.payload;
            if (result.status === 'success') {
                return {
                    ...state,
                    groupswithaccounts: result.body
                };
            }
            return state;
        }
        case GENERAL_ACTIONS.GENERAL_GET_ALL_STATES_RESPONSE: {
            const result: BaseResponse<States, string> = action.payload;
            if (result.status === 'success') {
                return {
                    ...state,
                    states: result.body
                };
            }
            return state;
        }
        case GENERAL_ACTIONS.RESET_STATES_LIST: {
            return { ...state, states: null };
        }

        // groups with accounts actions
        case GroupWithAccountsAction.CREATE_GROUP_RESPONSE: {
            const gData: BaseResponse<GroupResponse, GroupCreateRequest> = action.payload;
            if (gData.status === 'success') {
                const groupArray: GroupsWithAccountsResponse[] = _.cloneDeep(state.groupswithaccounts);
                if (groupArray) {
                    const myChildElementIsOpen = false;
                    AddAndActiveGroupFunc(groupArray, gData, myChildElementIsOpen);
                    return {
                        ...state,
                        groupswithaccounts: groupArray
                    };
                }
            }
            return state;
        }
        case GroupWithAccountsAction.UPDATE_GROUP_RESPONSE: {
            const activeGrpData: BaseResponse<GroupResponse, GroupUpateRequest> = action.payload;
            if (activeGrpData.status === 'success') {
                Object.assign({}, activeGrpData.body, { isOpen: true, isActive: true });
                const groupArray: GroupsWithAccountsResponse[] = _.cloneDeep(state.groupswithaccounts);
                if (groupArray) {
                    updateActiveGroupFunc(groupArray, activeGrpData.queryString?.groupUniqueName, activeGrpData.body, false);
                    return {
                        ...state,
                        groupswithaccounts: groupArray
                    };
                }
            }
            return state;
        }
        case GroupWithAccountsAction.DELETE_GROUP_RESPONSE: {
            const g: BaseResponse<string, string> = action.payload;
            if (g.status === 'success') {
                const groupArray: GroupsWithAccountsResponse[] = _.cloneDeep(state.groupswithaccounts);
                if (groupArray) {
                    removeGroupFunc(groupArray, g.request, null);
                    return {
                        ...state,
                        groupswithaccounts: groupArray
                    };
                }
            }
            return state;
        }
        case GroupWithAccountsAction.MOVE_GROUP_RESPONSE: {
            const m: BaseResponse<MoveGroupResponse, MoveGroupRequest> = action.payload;
            if (m.status === 'success') {
                const groupArray: GroupsWithAccountsResponse[] = _.cloneDeep(state.groupswithaccounts);
                if (groupArray) {
                    const deletedItem = removeGroupFunc(groupArray, m.queryString?.groupUniqueName, null);
                    addNewGroupFunc(groupArray, deletedItem, m.request.parentGroupUniqueName, false);
                    return {
                        ...state,
                        groupswithaccounts: groupArray
                    };
                }
            }
            return state;
        }
        //  accounts actions
        case AccountsAction.CREATE_ACCOUNT_RESPONSEV2: {
            const accountData: BaseResponse<AccountResponseV2, AccountRequestV2> = action.payload;
            const groupArray: GroupsWithAccountsResponse[] = _.cloneDeep(state.groupswithaccounts);
            if (accountData.status === 'success' && groupArray) {
                addCreatedAccountFunc(groupArray, accountData.body, accountData.queryString?.groupUniqueName, false);
                return {
                    ...state,
                    groupswithaccounts: groupArray
                };
            }
            return state;
        }
        case AccountsAction.UPDATE_ACCOUNT_RESPONSEV2: {
            const updatedAccount: BaseResponse<AccountResponseV2, AccountRequestV2> = action.payload;
            if (updatedAccount.status === 'success') {
                const groupArray: GroupsWithAccountsResponse[] = _.cloneDeep(state.groupswithaccounts);
                if (groupArray) {
                    UpdateAccountFunc(groupArray, updatedAccount.body, updatedAccount.queryString?.groupUniqueName, updatedAccount.queryString.accountUniqueName, false);
                    return {
                        ...state,
                        groupswithaccounts: groupArray
                    };
                }
            }
            return state;
        }

        //  add item to flatten accounts as we are adding item from side bar account
        case SALES_ACTIONS.ADD_ACCOUNT_DETAILS_RESPONSE: {
            const accountData: BaseResponse<AccountResponseV2, AccountRequestV2> = action.payload;
            const groupArray: GroupsWithAccountsResponse[] = _.cloneDeep(state.groupswithaccounts);
            if (accountData.status === 'success' && groupArray) {
                addCreatedAccountFunc(groupArray, accountData.body, accountData.queryString?.groupUniqueName, false);

                const flattenItem = cloneDeep(accountData.body);
                flattenItem.uNameStr = flattenItem.parentGroups.map(mp => mp.uniqueName).join(', ');

                if (state.flattenAccounts) {
                    return {
                        ...state,
                        groupswithaccounts: groupArray,
                        flattenAccounts: [...state.flattenAccounts, flattenItem]
                    };
                } else {
                    return {
                        ...state,
                        groupswithaccounts: groupArray,
                        flattenAccounts: [flattenItem]
                    };
                }
            }
            return state;
        }

        // update flatten accounts as because we are updating account through sidebar in sales/ proforma/ estimate module
        case SALES_ACTIONS.UPDATE_ACCOUNT_DETAILS_RESPONSE: {
            const updatedAccount: BaseResponse<AccountResponseV2, AccountRequestV2> = action.payload;
            if (updatedAccount.status === 'success') {
                const groupArray: GroupsWithAccountsResponse[] = _.cloneDeep(state.groupswithaccounts);
                if (groupArray) {
                    UpdateAccountFunc(groupArray, updatedAccount.body, updatedAccount.queryString?.groupUniqueName, updatedAccount.queryString.accountUniqueName, false);
                    return {
                        ...state,
                        groupswithaccounts: groupArray
                    };
                }
            }
            return state;
        }

        case AccountsAction.DELETE_ACCOUNT_RESPONSE: {
            const d: BaseResponse<string, any> = action.payload;
            if (d.status === 'success') {
                const groupArray: GroupsWithAccountsResponse[] = _.cloneDeep(state.groupswithaccounts);
                if (groupArray) {
                    removeAccountFunc(groupArray, action?.payload?.request?.groupUniqueName, d.request.accountUniqueName, null);
                    return {
                        ...state,
                        groupswithaccounts: groupArray
                    };
                }
            }
            return state;
        }
        case AccountsAction.MOVE_ACCOUNT_RESPONSE: {
            const mAcc: BaseResponse<string, AccountMoveRequest> = action.payload;
            if (mAcc.status === 'success') {
                const groupArray: GroupsWithAccountsResponse[] = _.cloneDeep(state.groupswithaccounts);
                if (groupArray) {
                    const deletedItem = removeAccountFunc(groupArray, action?.payload?.queryString?.activeGroupUniqueName, mAcc.queryString.accountUniqueName, null);
                    addNewAccountFunc(groupArray, deletedItem, mAcc.request.uniqueName, false);
                    return {
                        ...state,
                        groupswithaccounts: groupArray
                    };
                }
            }
            return state;
        }
        case AccountsAction.MERGE_ACCOUNT_RESPONSE: {
            const dd: BaseResponse<string, AccountMergeRequest[]> = action.payload;
            if (dd.status === 'success') {
                const groupArray: GroupsWithAccountsResponse[] = _.cloneDeep(state.groupswithaccounts);
                if (groupArray) {
                    dd.request.forEach(f => {
                        findAndRemoveAccountFunc(groupArray, f.uniqueName, false);
                    });

                    return {
                        ...state,
                        groupswithaccounts: groupArray
                    };
                }
            }
            return {
                ...state
            }
        }
        case GENERAL_ACTIONS.CLOSE_ADD_AND_MANAGE: {
            const newState = _.cloneDeep(state);
            newState.addAndManageClosed = !newState.addAndManageClosed;
            return Object.assign({}, state, newState);
        }

        case GENERAL_ACTIONS.SET_SIDE_MENU_BAR_STATE: {
            return {
                ...state, sideMenuBarOpen: action.payload
            }
        }

        case GENERAL_ACTIONS.SET_APP_HEADER_TITLE: {
            return {
                ...state, headerTitle: { uniqueName: action.payload.uniqueName, additional: action.payload.additional }
            }
        }

        case GENERAL_ACTIONS.SET_PAGE_HEADER_TITLE: {
            return {
                ...state, currentPage: action.payload
            }
        }
        case GENERAL_ACTIONS.OPEN_SIDE_MENU: {
            return {
                ...state, openSideMenu: action.payload
            }
        }
        case GENERAL_ACTIONS.UPDATE_CURRENT_LIABILITIES: {
            if(state?.flattenAccounts){
               let flattenAccountsArray = [...state.flattenAccounts];
               flattenAccountsArray = flattenAccountsArray.filter(account => account.uniqueName !== action.payload);
               return {
                ...state,
                flattenAccounts: flattenAccountsArray
               }
            }
            return {
              ...state,
              flattenAccounts: []
            }
        }
        case GENERAL_ACTIONS.UPDATE_INDEX_DB: {
            return {
                ...state,
                updateIndexDbInProcess: true,
                updateIndexDbComplete: false,
            }
        }
        case GENERAL_ACTIONS.UPDATE_INDEX_DB_COMPLETE: {
            return {
                ...state,
                updateIndexDbComplete: true,
                updateIndexDbInProcess: false
            }
        }
        case GENERAL_ACTIONS.DELETE_ENTRY_FROM_INDEX_DB: {
            return {
                ...state,
                updateIndexDbInProcess: true,
                updateIndexDbComplete: false,
            }
        }
        case GENERAL_ACTIONS.DELETE_ENTRY_FROM_INDEX_DB_COMPLETE: {
            return {
                ...state,
                updateIndexDbComplete: true,
                updateIndexDbInProcess: false
            }
        }
        case GENERAL_ACTIONS.DELETE_ENTRY_FROM_INDEX_DB_ERROR: {
            return {
                ...state,
                updateIndexDbInProcess: false,
                updateIndexDbComplete: false,
            }
        }
        case GENERAL_ACTIONS.UPDATE_UI_FROM_DB: {
            return {
                ...state,
                updateIndexDbInProcess: false,
                updateIndexDbComplete: false,
            }
        }
        case GENERAL_ACTIONS.SAVE_SIDE_MENU_ITEMS: {
            return {
                ...state,
                menuItems: action.payload
            }
        }
        case GENERAL_ACTIONS.OPEN_GST_SIDE_MENU: {
            return {
                ...state,
                openGstSideMenu: action.payload
            };
        }
        case GENERAL_ACTIONS.OPEN_CALENDLY_MODEL: {
            return {
                ...state, isCalendlyModelOpen: action.payload
            }
        }
        default:
            return state;
    }
}
