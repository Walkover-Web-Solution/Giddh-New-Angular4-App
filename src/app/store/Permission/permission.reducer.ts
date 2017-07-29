import { Action } from '@ngrx/store';
import { IRoleCommonResponseAndRequest } from '../../models/api-models/Permission';
import { PERMISSION_ACTIONS } from '../../services/actions/permission/permission.const';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import * as _ from 'lodash';

export interface PermissionState {
    roles: IRoleCommonResponseAndRequest[];
    newRole: object;
    pages: string[];
}

export const initialState: PermissionState = {
    roles: [],
    newRole: {},
    pages: []
};

export function PermissionReducer(state = initialState, action: Action): PermissionState {
    switch (action.type) {
        case PERMISSION_ACTIONS.GET_ROLES:
            {
                return state;
            }
        case PERMISSION_ACTIONS.GET_ROLES_RESPONSE:
            {
                let newState = _.cloneDeep(state);
                let res = action.payload as BaseResponse < IRoleCommonResponseAndRequest[],
                    string > ;
                if (res.status === 'success') {
                    newState.roles = res.body;
                    return Object.assign({}, state, newState);
                }
                return state;
            }
        case PERMISSION_ACTIONS.CREATE_ROLE:
            {
                return state;
            }
        case PERMISSION_ACTIONS.CREATE_ROLE_RESPONSE:
            {
                let newState = _.cloneDeep(state);
                let res = action.payload;
                newState.newRole = {};
                newState.roles.push(res);
                return Object.assign({}, state, newState);
            }
        case PERMISSION_ACTIONS.UPDATE_ROLE:
            {
                return state;
            }
        case PERMISSION_ACTIONS.UPDATE_ROLE_RESPONSE:
            {
                let newState = _.cloneDeep(state);
                let roleIndx = newState.roles.findIndex((role) => role.uniqueName === action.payload.roleUniqueName);
                if (roleIndx > -1) {
                    newState.roles[roleIndx] = action.payload;
                    return Object.assign({}, state, newState);
                } else {
                    return state;
                }
            }
        case PERMISSION_ACTIONS.DELETE_ROLE:
            {
                return state;
            }
        case PERMISSION_ACTIONS.DELETE_ROLE_RESPONSE:
            {
                // role is successfully deleted now remove deleted role from store
                let newState = _.cloneDeep(state);
                // res contains deleted role's uniqueName
                newState.roles.splice(newState.roles.findIndex((role: IRoleCommonResponseAndRequest) => {
                    return role.uniqueName === action.payload.queryString.roleUniqueName;
                }), 1);
                return Object.assign({}, state, newState);
            }
        case PERMISSION_ACTIONS.GET_ALL_PAGES:
            {
                return state;
            }
        case PERMISSION_ACTIONS.GET_ALL_PAGES_RESPONSE:
            {
                let newState = _.cloneDeep(state);
                let res = action.payload as BaseResponse<string[], string> ;
                if (res.status === 'success') {
                    newState.pages = res.body;
                    return Object.assign({}, state, newState);
                }
                return state;
            }
        case PERMISSION_ACTIONS.PUSH_TEMP_ROLE_IN_STORE:
            {
                let newState = _.cloneDeep(state);
                let res = action.payload;
                newState.newRole = res;
                return Object.assign({}, state, newState);
            }
        case PERMISSION_ACTIONS.REMOVE_NEWLY_CREATED_ROLE_FROM_STORE:
        {
            let newState = _.cloneDeep(state);
            newState.newRole = {};
            return Object.assign({}, state, newState);
        }
        default:
        {
            return state;
        }
    }
}