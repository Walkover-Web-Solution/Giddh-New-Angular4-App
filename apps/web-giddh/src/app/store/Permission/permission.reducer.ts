import { GetAllPermissionResponse } from './../../permissions/permission.utility';
import { IRoleCommonResponseAndRequest } from '../../models/api-models/Permission';
import { PERMISSION_ACTIONS } from '../../actions/permission/permission.const';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { AccountsAction } from '../../actions/accounts.actions';
import { CustomActions } from '../customActions';
import { COMMON_ACTIONS } from '../../actions/common.const';
import { cloneDeep, sortBy } from '../../lodash-optimized';

export interface PermissionState {
    roles: IRoleCommonResponseAndRequest[];
    newRole: object;
    pages: string[];
    createPermissionInProcess: boolean;
    createPermissionSuccess: boolean;
    addUpdateRoleInProcess: boolean;
    permissions: GetAllPermissionResponse[];
}

export const initialState: PermissionState = {
    roles: [],
    newRole: {},
    pages: [],
    createPermissionInProcess: false,
    createPermissionSuccess: false,
    addUpdateRoleInProcess: false,
    permissions: []
};

export function PermissionReducer(state = initialState, action: CustomActions): PermissionState {
    switch (action.type) {
        case COMMON_ACTIONS.RESET_APPLICATION_DATA: {
            return Object.assign({}, state, initialState);
        }
        case PERMISSION_ACTIONS.GET_ROLES: {
            return state;
        }
        case PERMISSION_ACTIONS.GET_ROLES_RESPONSE: {
            let newState = cloneDeep(state);
            let res = action.payload as BaseResponse<IRoleCommonResponseAndRequest[],
                string>;
            if (res?.status === 'success') {
                newState.roles = res.body;
                newState.roles = sortBy(newState.roles, [(o) => o.name]);
                newState.roles = sortBy(newState.roles, [(o) => !o.isFixed]);
                let sortedRoles = cloneDeep(newState);
                sortedRoles.roles.forEach((role) => {
                    role.scopes = sortBy(role.scopes, [(o) => o.name]);
                });

                newState = sortedRoles;
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case PERMISSION_ACTIONS.CREATE_ROLE: {
            return { ...state, addUpdateRoleInProcess: true };
        }
        case PERMISSION_ACTIONS.CREATE_ROLE_RESPONSE: {
            let newState = cloneDeep(state);
            newState.addUpdateRoleInProcess = false;
            let res = action.payload;
            if (res?.status === 'success') {
                newState.roles.push(res.body);
            }
            return { ...state, ...newState };
        }
        case PERMISSION_ACTIONS.UPDATE_ROLE: {
            return { ...state, addUpdateRoleInProcess: true };
        }
        case PERMISSION_ACTIONS.UPDATE_ROLE_RESPONSE: {
            let newState = cloneDeep(state);
            let roleIndx = newState.roles.findIndex((role) => role?.uniqueName === action.payload.roleUniqueName);
            if (roleIndx > -1) {
                newState.roles[roleIndx] = action.payload;
                return { ...state, ...newState, addUpdateRoleInProcess: false };
            } else {
                return { ...state, addUpdateRoleInProcess: false };
            }
        }
        case PERMISSION_ACTIONS.DELETE_ROLE: {
            return state;
        }
        case PERMISSION_ACTIONS.DELETE_ROLE_RESPONSE: {
            // filter out deleted role from permission role list, when status is success
            if (action.payload?.status === 'success') {
                return {
                    ...state,
                    roles: state.roles?.filter(role => role?.uniqueName !== action.payload.queryString.roleUniqueName)
                };
            }
            return state;
        }
        case PERMISSION_ACTIONS.GET_ALL_PAGES: {
            return state;
        }
        case PERMISSION_ACTIONS.GET_ALL_PAGES_RESPONSE: {
            let newState = cloneDeep(state);
            let res = action.payload as BaseResponse<string[], string>;
            if (res?.status === 'success') {
                newState.pages = res.body;
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case PERMISSION_ACTIONS.GET_ALL_PERMISSIONS_RESPONSE: {
            let newState = cloneDeep(state);
            let res = action.payload as BaseResponse<GetAllPermissionResponse[], string>;
            if (res?.status === 'success') {
                newState.permissions = res.body;
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case PERMISSION_ACTIONS.PUSH_TEMP_ROLE_IN_STORE: {
            let newState = cloneDeep(state);
            let res = action.payload;
            newState.newRole = res;
            return Object.assign({}, state, newState);
        }
        case PERMISSION_ACTIONS.REMOVE_NEWLY_CREATED_ROLE_FROM_STORE: {
            let newState = cloneDeep(state);
            newState.newRole = {};
            return Object.assign({}, state, newState);
        }
        case AccountsAction.SHARE_ENTITY: {
            return Object.assign({}, state, { createPermissionInProcess: true, createPermissionSuccess: false });
        }
        case AccountsAction.SHARE_ENTITY_RESPONSE: {
            let res = action.payload;
            if (res?.status === 'success') {
                return Object.assign({}, state, {
                    createPermissionInProcess: false, createPermissionSuccess: true
                });
            } else {
                return Object.assign({}, state, {
                    createPermissionInProcess: false, createPermissionSuccess: false
                });
            }
        }
        case AccountsAction.RESET_SHARE_ENTITY: {
            return Object.assign({}, state, { createPermissionInProcess: false, createPermissionSuccess: false });
        }
        default: {
            return state;
        }
    }
}
