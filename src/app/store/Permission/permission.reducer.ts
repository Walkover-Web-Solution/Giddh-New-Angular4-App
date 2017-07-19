import { Action } from '@ngrx/store';
import { PermissionRequest, PermissionResponse, CreateNewRoleRespone } from '../../models/api-models/Permission';
import { PERMISSION_ACTIONS } from '../../services/actions/permission/permission.const';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import * as _ from 'lodash';

export interface PermissionState {
	roles: PermissionResponse[];
	newRole: object;
}

export const initialState: PermissionState = {
	roles: [],
	newRole: {}
};

export function PermissionReducer(state = initialState, action: Action): PermissionState {
	switch (action.type) {

		case PERMISSION_ACTIONS.GET_ROLES_RESPONSE:
			{
				let newState = _.cloneDeep(state);
				let res = action.payload as BaseResponse<PermissionResponse[], string>;
				if (res.status === 'success') {
					newState.roles = res.body;
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
		case PERMISSION_ACTIONS.CREATE_NEW_ROLE_RESPONSE:
			{
				let newState = _.cloneDeep(state);
				let res = action.payload;
				newState.roles.push(res);
				return Object.assign({}, state, newState);
			}
		case PERMISSION_ACTIONS.DELETE_ROLE:
			{
				//delete role action fired
				return state;
			}
		case PERMISSION_ACTIONS.ROLE_DELETED: {
			//role is successfully deleted now remove deleted role from store
			let newState = _.cloneDeep(state);
			let res = action.payload as BaseResponse<string, string>;
			// res contains deleted role's uniqueName
			newState.roles.splice(newState.roles.findIndex((role) => { return role.uniqueName == res }), 1);
			return Object.assign({}, state, newState);
		}
		default: {
			return state;
		}
	}
}
