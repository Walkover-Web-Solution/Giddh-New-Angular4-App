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
import { CustomActions } from '../../store/custom-actions';
import { LocaleService } from '../../services/locale.service';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * PermissionActions class
 * Implements PermissionActions functionality
 */
export class PermissionActions {

    public GetAllPages$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(PERMISSION_ACTIONS.GET_ALL_PAGES),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._permissionService.GetAllPageNames()),
            /**
             * Handles map functionality
             */
            map(response => {
                return this.GetAllPagesResponse(response);
            })));

    public GetAllPagesResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(PERMISSION_ACTIONS.GET_ALL_PAGES_RESPONSE),
            /**
             * Handles map functionality
             */
            map(response => {
                return { type: 'EmptyAction' };
            })));

    public GetAllPermissions$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(PERMISSION_ACTIONS.GET_ALL_PERMISSIONS),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._permissionService.GetAllRoles()),
            /**
             * Handles map functionality
             */
            map(response => {
                return this.GetAllPermissionsResponse(response);
            })));

    public GetAllPermissionsResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(PERMISSION_ACTIONS.GET_ALL_PERMISSIONS_RESPONSE),
            /**
             * Handles map functionality
             */
            map(response => {
                return { type: 'EmptyAction' };
            })));

    public GetRoles$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(PERMISSION_ACTIONS.GET_ROLES),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._permissionService.GetAllRoles()),
            /**
             * Handles map functionality
             */
            map(response => {
                return this.GetRolesResponse(response);
            })));

    public GetRolesResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(PERMISSION_ACTIONS.GET_ROLES_RESPONSE),
            /**
             * Handles map functionality
             */
            map(response => {
                return { type: 'EmptyAction' };
            })));

    public CreateRole$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(PERMISSION_ACTIONS.CREATE_ROLE),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this._permissionService.CreateNewRole(action.payload).pipe(
                    /**
                     * Handles map functionality
                     */
                    map(response => this.CreateRoleResponse(response)));
            })));

    public CreateRoleResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(PERMISSION_ACTIONS.CREATE_ROLE_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<CreateNewRoleResponse, CreateNewRoleRequest> = response.payload;
                /**
                 * Handles if functionality
                 */
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
            /**
             * Handles ofType functionality
             */
            ofType(PERMISSION_ACTIONS.UPDATE_ROLE),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._permissionService.UpdateRole(action.payload)),
            /**
             * Handles map functionality
             */
            map(response => {
                return this.UpdateRoleResponse(response);
            })));

    public UpdateRoleResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(PERMISSION_ACTIONS.UPDATE_ROLE_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<IRoleCommonResponseAndRequest, IRoleCommonResponseAndRequest> = response.payload;
                /**
                 * Handles if functionality
                 */
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
            /**
             * Handles ofType functionality
             */
            ofType(PERMISSION_ACTIONS.DELETE_ROLE),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._permissionService.DeleteRole(action.payload)),
            /**
             * Handles map functionality
             */
            map(response => {
                return this.DeleteRoleResponse(response);
            })));

    public DeleteRoleResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(PERMISSION_ACTIONS.DELETE_ROLE_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<string, string> = response.payload;
                /**
                 * Handles if functionality
                 */
                if (data?.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast(this.localeService.translate("app_messages.role_deleted"));
                }
                return { type: 'EmptyAction' };
            })));

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor(private action$: Actions,
        private _toasty: ToasterService,
        private localeService: LocaleService,
        private _permissionService: PermissionService) {
    }

    /**
     * Handles GetAllPages functionality
     */
    public GetAllPages(): CustomActions {
        return {
            type: PERMISSION_ACTIONS.GET_ALL_PAGES,
        };
    }

    /**
     * Handles GetAllPagesResponse functionality
     */
    public GetAllPagesResponse(value: any): CustomActions {
        return {
            type: PERMISSION_ACTIONS.GET_ALL_PAGES_RESPONSE,
            payload: value
        };
    }

    /**
     * Handles GetAllPermissions functionality
     */
    public GetAllPermissions(): CustomActions {
        return {
            type: PERMISSION_ACTIONS.GET_ALL_PERMISSIONS,
        };
    }

    /**
     * Handles GetAllPermissionsResponse functionality
     */
    public GetAllPermissionsResponse(value: any): CustomActions {
        return {
            type: PERMISSION_ACTIONS.GET_ALL_PERMISSIONS_RESPONSE,
            payload: value
        };
    }

    /**
     * Handles GetRoles functionality
     */
    public GetRoles(): CustomActions {
        return { type: PERMISSION_ACTIONS.GET_ROLES };
    }

    /**
     * Handles GetRolesResponse functionality
     */
    public GetRolesResponse(value: BaseResponse<IRoleCommonResponseAndRequest[], string>) {
        return {
            type: PERMISSION_ACTIONS.GET_ROLES_RESPONSE,
            payload: value
        };
    }

    /**
     * Handles CreateRole functionality
     */
    public CreateRole(value: CreateNewRoleRequest): CustomActions {
        return {
            type: PERMISSION_ACTIONS.CREATE_ROLE,
            payload: value
        };
    }

    /**
     * Handles CreateRoleResponse functionality
     */
    public CreateRoleResponse(value: BaseResponse<CreateNewRoleResponse, CreateNewRoleRequest>): CustomActions {
        return {
            type: PERMISSION_ACTIONS.CREATE_ROLE_RESPONSE,
            payload: value
        };
    }

    /**
     * Handles UpdateRole functionality
     */
    public UpdateRole(value: IRoleCommonResponseAndRequest): CustomActions {
        return {
            type: PERMISSION_ACTIONS.UPDATE_ROLE,
            payload: value
        };
    }

    /**
     * Handles UpdateRoleResponse functionality
     */
    public UpdateRoleResponse(value: BaseResponse<IRoleCommonResponseAndRequest, IRoleCommonResponseAndRequest>): CustomActions {
        return {
            type: PERMISSION_ACTIONS.UPDATE_ROLE_RESPONSE,
            payload: value
        };
    }

    /**
     * Handles DeleteRole functionality
     */
    public DeleteRole(value: string): CustomActions {
        return {
            type: PERMISSION_ACTIONS.DELETE_ROLE,
            payload: value
        };
    }

    /**
     * Handles DeleteRoleResponse functionality
     */
    public DeleteRoleResponse(value: BaseResponse<string, string>): CustomActions {
        return {
            type: PERMISSION_ACTIONS.DELETE_ROLE_RESPONSE,
            payload: value
        };
    }

    /**
     * Handles PushTempRoleInStore functionality
     */
    public PushTempRoleInStore(value): CustomActions {
        return {
            type: PERMISSION_ACTIONS.PUSH_TEMP_ROLE_IN_STORE,
            payload: value
        };
    }

    /**
     * Handles RemoveNewlyCreatedRoleFromStore functionality
     */
    public RemoveNewlyCreatedRoleFromStore(): CustomActions {
        return {
            type: PERMISSION_ACTIONS.REMOVE_NEWLY_CREATED_ROLE_FROM_STORE
        };
    }
}
