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
import { IFlattenAccountsResultItem } from '../../models/interfaces/flatten-accounts-result-item.interface';
import { States } from '../../models/api-models/Company';
import {
    GroupCreateRequest,
    GroupResponse,
    GroupUpateRequest,
    MoveGroupRequest,
    MoveGroupResponse
} from '../../models/api-models/Group';
import { GroupWithAccountsAction } from '../../actions/groupwithaccounts.actions';
import { IGroupsWithAccounts } from '../../models/interfaces/groups-with-accounts.interface';
import { AccountsAction } from '../../actions/accounts.actions';
import { IAccountsInfo } from '../../models/interfaces/account-info.interface';
import { CustomActions } from '../custom-actions';
import { COMMON_ACTIONS } from '../../actions/common.const';
import { INameUniqueName } from '../../models/api-models/Inventory';
import { SALES_ACTIONS } from '../../actions/sales/sales.const';
import { CurrentPage } from '../../models/api-models/Common';
import { cloneDeep, filter, findIndex, forEach, isArray, map } from '../../lodash-optimized';

/**
 * GeneralState interface definition
 * Defines the structure and contract for GeneralState objects
 */
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

export function GeneRalReducer(state: GeneralState = initialState, action: CustomActions): GeneralState {
    /**
     * Handles switch functionality
     */
    switch (action.type) {
        case COMMON_ACTIONS.RESET_APPLICATION_DATA: {
            return Object.assign({}, state, initialState);
        }
        case 'EmptyAction': {
            return state;
        }
        case GENERAL_ACTIONS.GENERAL_GET_GROUP_WITH_ACCOUNTS_RESPONSE: {
            let result: BaseResponse<GroupsWithAccountsResponse[], string> = action.payload;
            /**
             * Handles if functionality
             */
            if (result?.status === 'success') {
                return {
                    ...state,
                    groupswithaccounts: result.body
                };
            }
            return state;
        }
        case GENERAL_ACTIONS.GENERAL_GET_ALL_STATES_RESPONSE: {
            let result: BaseResponse<States, string> = action.payload;
            /**
             * Handles if functionality
             */
            if (result?.status === 'success') {
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

        //  accounts actions
        case AccountsAction.CREATE_ACCOUNT_RESPONSEV2: {
            let accountData: BaseResponse<AccountResponseV2, AccountRequestV2> = action.payload;
            let groupArray: GroupsWithAccountsResponse[] = cloneDeep(state.groupswithaccounts);
            /**
             * Handles if functionality
             */
            if (accountData?.status === 'success' && groupArray) {
                /**
                 * Handles addCreatedAccountFunc functionality
                 */
                addCreatedAccountFunc(groupArray, accountData.body, accountData.queryString?.groupUniqueName, false);
                return {
                    ...state,
                    groupswithaccounts: groupArray
                };
            }
            return state;
        }
        case AccountsAction.UPDATE_ACCOUNT_RESPONSEV2: {
            let updatedAccount: BaseResponse<AccountResponseV2, AccountRequestV2> = action.payload;
            /**
             * Handles if functionality
             */
            if (updatedAccount?.status === 'success') {
                let groupArray: GroupsWithAccountsResponse[] = cloneDeep(state.groupswithaccounts);
                /**
                 * Handles if functionality
                 */
                if (groupArray) {
                    /**
                     * Handles UpdateAccountFunc functionality
                     */
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
            let accountData: BaseResponse<AccountResponseV2, AccountRequestV2> = action.payload;
            let groupArray: GroupsWithAccountsResponse[] = cloneDeep(state.groupswithaccounts);
            /**
             * Handles if functionality
             */
            if (accountData?.status === 'success' && groupArray) {
                /**
                 * Handles addCreatedAccountFunc functionality
                 */
                addCreatedAccountFunc(groupArray, accountData.body, accountData.queryString?.groupUniqueName, false);

                let flattenItem = cloneDeep(accountData.body);
                flattenItem.uNameStr = flattenItem?.parentGroups.map(mp => mp?.uniqueName)?.join(', ');

                /**
                 * Handles if functionality
                 */
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
            let updatedAccount: BaseResponse<AccountResponseV2, AccountRequestV2> = action.payload;
            /**
             * Handles if functionality
             */
            if (updatedAccount?.status === 'success') {
                let groupArray: GroupsWithAccountsResponse[] = cloneDeep(state.groupswithaccounts);
                /**
                 * Handles if functionality
                 */
                if (groupArray) {
                    /**
                     * Handles UpdateAccountFunc functionality
                     */
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
            let d: BaseResponse<string, any> = action.payload;
            /**
             * Handles if functionality
             */
            if (d?.status === 'success') {
                let groupArray: GroupsWithAccountsResponse[] = cloneDeep(state.groupswithaccounts);
                /**
                 * Handles if functionality
                 */
                if (groupArray) {
                    /**
                     * Deletes accountfunc
                     */
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
            let mAcc: BaseResponse<string, AccountMoveRequest> = action.payload;
            /**
             * Handles if functionality
             */
            if (mAcc?.status === 'success') {
                let groupArray: GroupsWithAccountsResponse[] = cloneDeep(state.groupswithaccounts);
                /**
                 * Handles if functionality
                 */
                if (groupArray) {
                    let deletedItem = removeAccountFunc(groupArray, action?.payload?.queryString?.activeGroupUniqueName, mAcc.queryString.accountUniqueName, null);
                    /**
                     * Handles addNewAccountFunc functionality
                     */
                    addNewAccountFunc(groupArray, deletedItem, mAcc.request?.uniqueName, false);
                    return {
                        ...state,
                        groupswithaccounts: groupArray
                    };
                }
            }
            return state;
        }
        case AccountsAction.MERGE_ACCOUNT_RESPONSE: {
            let dd: BaseResponse<string, AccountMergeRequest[]> = action.payload;
            /**
             * Handles if functionality
             */
            if (dd?.status === 'success') {
                let groupArray: GroupsWithAccountsResponse[] = cloneDeep(state.groupswithaccounts);
                /**
                 * Handles if functionality
                 */
                if (groupArray) {
                    (Array.isArray(dd.request) ? dd.request : []).forEach(f => {
                        /**
                         * Handles findAndRemoveAccountFunc functionality
                         */
                        findAndRemoveAccountFunc(groupArray, f?.uniqueName, false);
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
            let newState = cloneDeep(state);
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
                ...state, headerTitle: { uniqueName: action.payload?.uniqueName, additional: action.payload.additional }
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
            /**
             * Handles if functionality
             */
            if (state?.flattenAccounts) {
                let flattenAccountsArray = [...state.flattenAccounts];
                flattenAccountsArray = flattenAccountsArray?.filter(account => account?.uniqueName !== action.payload);
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

const AddAndActiveGroupFunc = (groups: IGroupsWithAccounts[], gData: BaseResponse<GroupResponse, GroupCreateRequest>, myChildElementIsOpen: boolean): boolean => {
    /**
     * Handles for functionality
     */
    for (let grp of groups) {
        /**
         * Handles if functionality
         */
        if (grp.uniqueName === gData.request?.parentGroupUniqueName) {
            let newData = new GroupsWithAccountsResponse();
            newData.accounts = [];
            newData.category = grp.category;
            newData.groups = [];
            newData.isActive = false;
            newData.name = gData.body?.name;
            newData.synonyms = gData.body?.synonyms;
            newData.uniqueName = gData.body?.uniqueName;
            grp.isOpen = true;
            grp.groups.push(newData);
            myChildElementIsOpen = true;
            return myChildElementIsOpen;
        }
        /**
         * Handles if functionality
         */
        if (grp.groups) {
            myChildElementIsOpen = AddAndActiveGroupFunc(grp.groups, gData, myChildElementIsOpen);
            /**
             * Handles if functionality
             */
            if (myChildElementIsOpen) {
                return myChildElementIsOpen;
            }
        }
    }
    return myChildElementIsOpen;
};

const updateActiveGroupFunc = (groups: IGroupsWithAccounts[], uniqueName: string, updatedGroup: GroupResponse, result: boolean): boolean => {
    /**
     * Handles if functionality
     */
    if (result) {
        return result;
    }
    /**
     * Handles for functionality
     */
    for (let grp of groups) {
        /**
         * Handles if functionality
         */
        if (grp?.uniqueName === uniqueName) {
            grp.name = updatedGroup.name;
            grp.uniqueName = updatedGroup?.uniqueName;
            grp.isActive = true;
            grp.isOpen = false;
            result = true;
            break;
        }
        /**
         * Handles if functionality
         */
        if (grp.groups) {
            result = updateActiveGroupFunc(grp.groups, uniqueName, updatedGroup, result);
            /**
             * Handles if functionality
             */
            if (result) {
                break;
            }
        }
    }
    return result;
};

const removeGroupFunc = (groups: IGroupsWithAccounts[], uniqueName: string, result: IGroupsWithAccounts) => {
    /**
     * Handles if functionality
     */
    if (groups) {
        /**
         * Handles for functionality
         */
        for (let i = 0; i < groups.length; i++) {
            /**
             * Handles if functionality
             */
            if (groups[i]?.uniqueName === uniqueName) {
                result = groups[i];
                groups.splice(i, 1);
                return result;
            }
            /**
             * Handles if functionality
             */
            if (groups[i].groups) {
                result = removeGroupFunc(groups[i].groups, uniqueName, result);
                /**
                 * Handles if functionality
                 */
                if (result) {
                    return result;
                }
            }
        }
    }
};

const addNewGroupFunc = (groups: IGroupsWithAccounts[], gData: IGroupsWithAccounts, parentUniqueName: string, result: boolean): boolean => {
    /**
     * Handles if functionality
     */
    if (result) {
        return result;
    }
    /**
     * Handles for functionality
     */
    for (let grp of groups) {
        /**
         * Handles if functionality
         */
        if (grp?.uniqueName === parentUniqueName) {
            grp.groups.push(gData);
            result = true;
            return result;
        }
        /**
         * Handles if functionality
         */
        if (grp.groups) {
            result = addNewGroupFunc(grp.groups, gData, parentUniqueName, result);
            /**
             * Handles if functionality
             */
            if (result) {
                return result;
            }
        }
    }
    return result;
};

const addCreatedAccountFunc = (groups: IGroupsWithAccounts[], aData: AccountResponseV2 | AccountResponse, grpUniqueName: string, result: boolean): boolean => {
    /**
     * Handles if functionality
     */
    if (result) {
        return result;
    }
    /**
     * Handles for functionality
     */
    for (let grp of groups) {
        /**
         * Handles if functionality
         */
        if (grp?.uniqueName === grpUniqueName) {
            grp.isOpen = true;
            grp.accounts.push(
                {
                    uniqueName: aData?.uniqueName,
                    name: aData.name,
                    isActive: true,
                    stocks: aData.stocks,
                    mergedAccounts: aData.mergedAccounts
                }
            );
            result = true;
            return result;
        }
        /**
         * Handles if functionality
         */
        if (grp.groups) {
            result = addCreatedAccountFunc(grp.groups, aData, grpUniqueName, result);
            /**
             * Handles if functionality
             */
            if (result) {
                return result;
            }
        }
    }
    return result;
};

const UpdateAccountFunc = (groups: IGroupsWithAccounts[],
    aData: AccountResponseV2, grpUniqueName: string, accountUniqueName: string, result: boolean): boolean => {
    /**
     * Handles if functionality
     */
    if (result) {
        return result;
    }
    /**
     * Handles for functionality
     */
    for (let grp of groups) {
        /**
         * Handles if functionality
         */
        if (grp?.uniqueName === grpUniqueName) {
            grp.isOpen = true;
            let index = grp.accounts?.findIndex(p => p?.uniqueName === accountUniqueName);
            /**
             * Handles if functionality
             */
            if (index > -1) {
                grp.accounts[index].uniqueName = aData?.uniqueName;
                grp.accounts[index].name = aData.name;
                grp.accounts[index].isActive = true;
                grp.accounts[index].stocks = aData.stocks;
                grp.accounts[index].mergedAccounts = aData.mergedAccounts;
                result = true;
                return result;
            }
        }
        /**
         * Handles if functionality
         */
        if (grp.groups) {
            result = UpdateAccountFunc(grp.groups, aData, grpUniqueName, accountUniqueName, result);
            /**
             * Handles if functionality
             */
            if (result) {
                return result;
            }
        }
    }
    return result;
};

const removeAccountFunc = (groups: IGroupsWithAccounts[], uniqueName: string, accountUniqueName: string, result: IAccountsInfo): IAccountsInfo => {
    /**
     * Handles for functionality
     */
    for (let grp of groups) {
        /**
         * Handles if functionality
         */
        if (grp?.uniqueName === uniqueName) {
            let index = grp.accounts?.findIndex(a => a?.uniqueName === accountUniqueName);
            result = grp.accounts[index];
            grp.accounts.splice(index, 1);
            return result;
        }
        /**
         * Handles if functionality
         */
        if (grp.groups) {
            result = removeAccountFunc(grp.groups, uniqueName, accountUniqueName, result);
            /**
             * Handles if functionality
             */
            if (result) {
                return result;
            }
        }
    }
};

const addNewAccountFunc = (groups: IGroupsWithAccounts[], aData: IAccountsInfo, grpUniqueName: string, result: boolean, parentPath = null): boolean => {
    /**
     * Handles if functionality
     */
    if (result) {
        return result;
    }
    /**
     * Handles for functionality
     */
    for (let grp of groups) {
        /**
         * Handles if functionality
         */
        if (grp?.uniqueName === grpUniqueName) {
            grp.isOpen = true;
            grp.accounts.push(aData);
            /**
             * Handles if functionality
             */
            if (Array.isArray(parentPath)) {
                parentPath.push({
                    name: grp.name,
                    uniqueName: grp?.uniqueName
                });
            }
            result = true;
            return result;
        }
        /**
         * Handles if functionality
         */
        if (grp.groups) {
            result = addNewAccountFunc(grp.groups, aData, grpUniqueName, result, parentPath);
            /**
             * Handles if functionality
             */
            if (result) {
                /**
                 * Handles if functionality
                 */
                if (Array.isArray(parentPath)) {
                    parentPath.push({
                        name: grp.name,
                        uniqueName: grp?.uniqueName
                    });
                }
                return result;
            }
        }
    }
    return result;
};

const findAndRemoveAccountFunc = (groups: IGroupsWithAccounts[], uniqueName: string, result: boolean) => {
    /**
     * Handles for functionality
     */
    for (let grp of groups) {
        let accIndex = grp.accounts?.findIndex(f => f?.uniqueName === uniqueName);

        /**
         * Handles if functionality
         */
        if (accIndex > -1) {
            grp.accounts.splice(accIndex, 1);
            result = true;
            return result;
        }
        /**
         * Handles if functionality
         */
        if (grp.groups) {
            result = findAndRemoveAccountFunc(grp.groups, uniqueName, result);
            /**
             * Handles if functionality
             */
            if (result) {
                return result;
            }
        }
    }
};

// consume array and return array on string
const provideStrings = (arr: any[]) => {
    let o = { nameStr: [], uNameStr: [] };
    let b = { nameStr: '', uNameStr: '' };
    try {
        (Array.isArray(arr) ? arr : []).forEach((item: INameUniqueName) => {
            o.nameStr.push(item.name);
            o.uNameStr.push(item?.uniqueName);
        });
        b.nameStr = o.nameStr.join(', ');
        b.uNameStr = o.uNameStr.join(', ');
    } catch (error) {
        //
    }
    return b;
};
