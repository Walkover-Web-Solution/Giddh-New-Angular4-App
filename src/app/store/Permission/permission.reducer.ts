import { Action } from '@ngrx/store';
import { PermissionRequest, PermissionResponse } from '../../models/api-models/Permission';
import { PERMISSION_ACTIONS } from '../../services/actions/permission/permission.const';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import * as _ from 'lodash';

export interface PermissionState {
	roles: PermissionResponse[]
}

export const initialState: PermissionState = {
	roles:[]
};

export function PermissionReducer(state = initialState, action: Action): PermissionState {
    switch (action.type) {

    	case PERMISSION_ACTIONS.GET_ROLES_RESPONSE:
    		{
    			let newState= _.cloneDeep(state);
    			let res = action.payload as BaseResponse<PermissionResponse[], string>;
    			if (res.status === 'success'){
    				newState.roles = res.body;
    				return Object.assign({}, state, newState);
    			}
    			return state;
    		}

      default: {
          return state;
      }
    }
}
