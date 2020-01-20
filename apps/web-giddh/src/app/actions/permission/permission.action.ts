import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../../services/toaster.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { PermissionService } from '../../services/permission.service';
import { PERMISSION_ACTIONS } from './permission.const';
import { CreateNewRoleRequest, CreateNewRoleResponse, IRoleCommonResponseAndRequest } from '../../models/api-models/Permission';
import { Router } from '@angular/router';
import { CustomActions } from '../../store/customActions';

/**
 * Created by ad on 04-07-2017.
 */

@Injectable()
export class PermissionActions {

	@Effect()
	private GetAllPages$: Observable<Action> = this.action$
		.ofType(PERMISSION_ACTIONS.GET_ALL_PAGES).pipe(
			switchMap((action: CustomActions) => this._permissionService.GetAllPageNames()),
			map(response => {
				return this.GetAllPagesResponse(response);
			}));

	@Effect()
	private GetAllPagesResponse$: Observable<Action> = this.action$
		.ofType(PERMISSION_ACTIONS.GET_ALL_PAGES_RESPONSE).pipe(
			map(response => {
				return { type: 'EmptyAction' };
			}));

	@Effect()
	private GetAllPermissions$: Observable<Action> = this.action$
		.ofType(PERMISSION_ACTIONS.GET_ALL_PERMISSIONS).pipe(
			switchMap((action: CustomActions) => this._permissionService.GetAllRoles()),
			map(response => {
				return this.GetAllPermissionsResponse(response);
			}));

	@Effect()
	private GetAllPermissionsResponse$: Observable<Action> = this.action$
		.ofType(PERMISSION_ACTIONS.GET_ALL_PERMISSIONS_RESPONSE).pipe(
			map(response => {
				return { type: 'EmptyAction' };
			}));

	@Effect()
	private GetRoles$: Observable<Action> = this.action$
		.ofType(PERMISSION_ACTIONS.GET_ROLES).pipe(
			switchMap((action: CustomActions) => this._permissionService.GetAllRoles()),
			map(response => {
				return this.GetRolesResponse(response);
			}));

	@Effect()
	private GetRolesResponse$: Observable<Action> = this.action$
		.ofType(PERMISSION_ACTIONS.GET_ROLES_RESPONSE).pipe(
			map(response => {
				return { type: 'EmptyAction' };
			}));

	@Effect()
	private CreateRole$: Observable<Action> = this.action$
		.ofType(PERMISSION_ACTIONS.CREATE_ROLE).pipe(
			switchMap((action: CustomActions) => {
				return this._permissionService.CreateNewRole(action.payload).pipe(
					map(response => this.CreateRoleResponse(response)));
			}));

	@Effect()
	private CreateRoleResponse$: Observable<Action> = this.action$
		.ofType(PERMISSION_ACTIONS.CREATE_ROLE_RESPONSE).pipe(
			map((response: CustomActions) => {
				let data: BaseResponse<CreateNewRoleResponse, CreateNewRoleRequest> = response.payload;
				if (data.status === 'error') {
					this._toasty.errorToast(data.message, data.code);
				} else {
					this._toasty.successToast('New Role Created Successfully.');
					return { type: PERMISSION_ACTIONS.GET_ROLES };
				}
				return { type: 'EmptyAction' };
			}));

	@Effect()
	private UpdateRole$: Observable<Action> = this.action$
		.ofType(PERMISSION_ACTIONS.UPDATE_ROLE).pipe(
			switchMap((action: CustomActions) => this._permissionService.UpdateRole(action.payload)),
			map(response => {
				return this.UpdateRoleResponse(response);
			}));

	@Effect()
	private UpdateRoleResponse$: Observable<Action> = this.action$
		.ofType(PERMISSION_ACTIONS.UPDATE_ROLE_RESPONSE).pipe(
			map((response: CustomActions) => {
				let data: BaseResponse<IRoleCommonResponseAndRequest, IRoleCommonResponseAndRequest> = response.payload;
				if (data.status === 'error') {
					this._toasty.errorToast(data.message, data.code);
				} else {
					this._toasty.successToast('Role Updated Successfully.');
					return { type: PERMISSION_ACTIONS.GET_ROLES };
				}
				return { type: 'EmptyAction' };
			}));

	// @Effect()
	// private UpdateRole$: Observable<Action> = this.action$
	//   .ofType(PERMISSION_ACTIONS.UPDATE_ROLE)
	//   .switchMap((action: CustomActions) => {
	//     return this._permissionService.UpdateRole(action.payload)
	//       .map((r) =>
	//         this.validateResponse(r, {
	//           type: PERMISSION_ACTIONS.UPDATE_ROLE_RESPONSE,
	//           payload: action.payload
	//         }, true));
	//   });

	// @Effect()
	// private DeleteRole$: Observable<Action> = this.action$
	//   .ofType(PERMISSION_ACTIONS.DELETE_ROLE)
	//   .switchMap((action: CustomActions) => {
	//     return this._permissionService.DeleteRole(action.payload)
	//       .map((r) =>
	//         this.validateResponse(r, {
	//           type: PERMISSION_ACTIONS.DELETE_ROLE_RESPONSE,
	//           payload: action.payload
	//         }, true));
	//   });

	@Effect()
	private DeleteRole$: Observable<Action> = this.action$
		.ofType(PERMISSION_ACTIONS.DELETE_ROLE).pipe(
			switchMap((action: CustomActions) => this._permissionService.DeleteRole(action.payload)),
			map(response => {
				return this.DeleteRoleResponse(response);
			}));

	@Effect()
	private DeleteRoleResponse$: Observable<Action> = this.action$
		.ofType(PERMISSION_ACTIONS.DELETE_ROLE_RESPONSE).pipe(
			map((response: CustomActions) => {
				let data: BaseResponse<string, string> = response.payload;
				if (data.status === 'error') {
					this._toasty.errorToast(data.message, data.code);
				} else {
					this._toasty.successToast('Role Deleted Successfully.');
				}
				return { type: 'EmptyAction' };
			}));

	constructor(private action$: Actions,
		private _toasty: ToasterService,
		private _router: Router,
		private store: Store<AppState>,
		private _permissionService: PermissionService) {
	}

	public GetAllPages(): CustomActions {
		return {
			type: PERMISSION_ACTIONS.GET_ALL_PAGES,
		};
	}

	public GetAllPagesResponse(value: any): CustomActions {
		return {
			type: PERMISSION_ACTIONS.GET_ALL_PAGES_RESPONSE,
			payload: value
		};
	}

	public GetAllPermissions(): CustomActions {
		return {
			type: PERMISSION_ACTIONS.GET_ALL_PERMISSIONS,
		};
	}

	public GetAllPermissionsResponse(value: any): CustomActions {
		return {
			type: PERMISSION_ACTIONS.GET_ALL_PERMISSIONS_RESPONSE,
			payload: value
		};
	}

	public GetRoles(): CustomActions {
		return { type: PERMISSION_ACTIONS.GET_ROLES };
	}

	public GetRolesResponse(value: BaseResponse<IRoleCommonResponseAndRequest[], string>) {
		return {
			type: PERMISSION_ACTIONS.GET_ROLES_RESPONSE,
			payload: value
		};
	}

	public CreateRole(value: CreateNewRoleRequest): CustomActions {
		return {
			type: PERMISSION_ACTIONS.CREATE_ROLE,
			payload: value
		};
	}

	public CreateRoleResponse(value: BaseResponse<CreateNewRoleResponse, CreateNewRoleRequest>): CustomActions {
		return {
			type: PERMISSION_ACTIONS.CREATE_ROLE_RESPONSE,
			payload: value
		};
	}

	public UpdateRole(value: IRoleCommonResponseAndRequest): CustomActions {
		return {
			type: PERMISSION_ACTIONS.UPDATE_ROLE,
			payload: value
		};
	}

	public UpdateRoleResponse(value: BaseResponse<IRoleCommonResponseAndRequest, IRoleCommonResponseAndRequest>): CustomActions {
		return {
			type: PERMISSION_ACTIONS.UPDATE_ROLE_RESPONSE,
			payload: value
		};
	}

	public DeleteRole(value: string): CustomActions {
		return {
			type: PERMISSION_ACTIONS.DELETE_ROLE,
			payload: value
		};
	}

	public DeleteRoleResponse(value: BaseResponse<string, string>): CustomActions {
		return {
			type: PERMISSION_ACTIONS.DELETE_ROLE_RESPONSE,
			payload: value
		};
	}

	public PushTempRoleInStore(value): CustomActions {
		return {
			type: PERMISSION_ACTIONS.PUSH_TEMP_ROLE_IN_STORE,
			payload: value
		};
	}

	public RemoveNewlyCreatedRoleFromStore(): CustomActions {
		return {
			type: PERMISSION_ACTIONS.REMOVE_NEWLY_CREATED_ROLE_FROM_STORE
		};
	}

	private validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: CustomActions, showToast: boolean = false, errorAction: CustomActions = { type: 'EmptyAction' }): CustomActions {
		if (response.status === 'error') {
			if (showToast) {
				this._toasty.errorToast(response.message);
			}
			return errorAction;
		}
		return successAction;
	}
}
