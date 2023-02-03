import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToasterService } from '../../services/toaster.service';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { PermissionService } from '../../services/permission.service';
import { PERMISSION_ACTIONS } from './permission.const';
import { CreateNewRoleRequest, CreateNewRoleResponse, IRoleCommonResponseAndRequest } from '../../models/api-models/Permission';
import { CustomActions } from '../../store/customActions';
import { LocaleService } from '../../services/locale.service';

@Injectable()
export class PermissionActions {

    public GetAllPages$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(PERMISSION_ACTIONS.GET_ALL_PAGES),
            switchMap((action: CustomActions) => this._permissionService.GetAllPageNames()),
            map(response => {
                return this.GetAllPagesResponse(response);
            })));

    public GetAllPagesResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(PERMISSION_ACTIONS.GET_ALL_PAGES_RESPONSE),
            map(response => {
                return { type: 'EmptyAction' };
            })));

    public GetAllPermissions$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(PERMISSION_ACTIONS.GET_ALL_PERMISSIONS),
            switchMap((action: CustomActions) => this._permissionService.GetAllRoles()),
            map(response => {
                return this.GetAllPermissionsResponse(response);
            })));

    public GetAllPermissionsResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(PERMISSION_ACTIONS.GET_ALL_PERMISSIONS_RESPONSE),
            map(response => {
                return { type: 'EmptyAction' };
            })));

    public GetRoles$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(PERMISSION_ACTIONS.GET_ROLES),
            switchMap((action: CustomActions) => this._permissionService.GetAllRoles()),
            map(response => {
                return this.GetRolesResponse(response);
            })));

    public GetRolesResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(PERMISSION_ACTIONS.GET_ROLES_RESPONSE),
            map(response => {
                return { type: 'EmptyAction' };
            })));

    public CreateRole$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(PERMISSION_ACTIONS.CREATE_ROLE),
            switchMap((action: CustomActions) => {
                return this._permissionService.CreateNewRole(action.payload).pipe(
                    map(response => this.CreateRoleResponse(response)));
            })));

    public CreateRoleResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(PERMISSION_ACTIONS.CREATE_ROLE_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<CreateNewRoleResponse, CreateNewRoleRequest> = response.payload;
                if (data?.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast(this.localeService.translate("app_messages.role_created"));
                    return { type: PERMISSION_ACTIONS.GET_ROLES };
                }
                return { type: 'EmptyAction' };
            })));

    public UpdateRole$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(PERMISSION_ACTIONS.UPDATE_ROLE),
            switchMap((action: CustomActions) => this._permissionService.UpdateRole(action.payload)),
            map(response => {
                return this.UpdateRoleResponse(response);
            })));

    public UpdateRoleResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(PERMISSION_ACTIONS.UPDATE_ROLE_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<IRoleCommonResponseAndRequest, IRoleCommonResponseAndRequest> = response.payload;
                if (data?.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast(this.localeService.translate("app_messages.role_updated"));
                    return { type: PERMISSION_ACTIONS.GET_ROLES };
                }
                return { type: 'EmptyAction' };
            })));

    public DeleteRole$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(PERMISSION_ACTIONS.DELETE_ROLE),
            switchMap((action: CustomActions) => this._permissionService.DeleteRole(action.payload)),
            map(response => {
                return this.DeleteRoleResponse(response);
            })));

    public DeleteRoleResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(PERMISSION_ACTIONS.DELETE_ROLE_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<string, string> = response.payload;
                if (data?.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast(this.localeService.translate("app_messages.role_deleted"));
                }
                return { type: 'EmptyAction' };
            })));

    constructor(private action$: Actions,
        private _toasty: ToasterService,
        private localeService: LocaleService,
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
}
