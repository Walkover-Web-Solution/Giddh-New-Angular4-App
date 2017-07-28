/**
 * Created by ad on 04-07-2017.
 */

import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../../toaster.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { Observable } from 'rxjs/Rx';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { PermissionService } from '../../permission.service';
import { PERMISSION_ACTIONS } from './permission.const';
import { NewRole, CreateNewRoleRequest, PermissionResponse } from '../../../models/api-models/Permission';

@Injectable()
export class PermissionActions {

  @Effect()
  private GetRoles$: Observable<Action> = this.action$
    .ofType(PERMISSION_ACTIONS.GET_ROLES)
    .switchMap(action => {
      return this._permissionService.GetAllRoles()
        .map((r) => {
          return this.validateResponse<PermissionResponse[], string>(r, {
            type: PERMISSION_ACTIONS.GET_ROLES_RESPONSE,
            payload: r
          }, true, {
              type: PERMISSION_ACTIONS.GET_ROLES_RESPONSE,
              payload: r
            });
        });
    });

  @Effect()
  private CreateNewRole$: Observable<Action> = this.action$
    .ofType(PERMISSION_ACTIONS.CREATE_NEW_ROLE)
    .switchMap(action => {
      return this._permissionService.CreateNewRole(action.payload)
        .map((r) =>
          this.validateResponse(r, {
            type: PERMISSION_ACTIONS.CREATE_NEW_ROLE_RESPONSE,
            payload: action.payload
          }, true));
    });

  @Effect()
  private UpdateRole$: Observable<Action> = this.action$
    .ofType(PERMISSION_ACTIONS.UPDATE_ROLE)
    .switchMap(action => {
      return this._permissionService.UpdateRole(action.payload)
        .map((r) =>
          this.validateResponse(r, {
            type: PERMISSION_ACTIONS.UPDATE_ROLE_RESPONSE,
            payload: action.payload
          }, true));
    });

  @Effect()
  private DeleteRole$: Observable<Action> = this.action$
    .ofType(PERMISSION_ACTIONS.DELETE_ROLE)
    .switchMap(action => {
      return this._permissionService.DeleteRole(action.payload)
        .map((r) =>
          this.validateResponse(r, {
            type: PERMISSION_ACTIONS.ROLE_DELETED,
            payload: action.payload
          }, true));
    });

  @Effect()
  private AllPages$: Observable<Action> = this.action$
    .ofType(PERMISSION_ACTIONS.LOAD_ADD_PAGE_NAMES)
    .switchMap(action => {
      return this._permissionService.GetAllPageNames()
        .map((r) => {
          return this.validateResponse<string[], string>(r, {
            type: PERMISSION_ACTIONS.ALL_PAGE_NAMES_LOADED,
            payload: r
          }, true, {
              type: PERMISSION_ACTIONS.ALL_PAGE_NAMES_LOADED,
              payload: r
            });
        });
    });

  constructor(private action$: Actions,
    private _toasty: ToasterService,
    private store: Store<AppState>,
    private _permissionService: PermissionService) {
  }

  public GetRoles() {
    return { type: PERMISSION_ACTIONS.GET_ROLES };
  }

  public GetRolesResponse(value: BaseResponse<PermissionResponse[], string>) {
    return {
      type: PERMISSION_ACTIONS.GET_ROLES_RESPONSE,
      payload: value
    };
  }

  public PushTempRoleInStore(value): Action {
    return {
      type: PERMISSION_ACTIONS.PUSH_TEMP_ROLE_IN_STORE,
      payload: value
    };
  }

  public LoadAllPageNames(): Action {
    return {
      type: PERMISSION_ACTIONS.LOAD_ADD_PAGE_NAMES,
    };
  }

  public SaveNewRole(data: CreateNewRoleRequest): Action {
    return {
      type: PERMISSION_ACTIONS.CREATE_NEW_ROLE,
      payload: data
    };
  }

  public UpdateRole(data: CreateNewRoleRequest): Action {
    return {
      type: PERMISSION_ACTIONS.UPDATE_ROLE,
      payload: data
    };
  }

  public DeleteRole(data: any): Action {
    return {
      type: PERMISSION_ACTIONS.DELETE_ROLE,
      payload: data.roleUniqueName
    };
  }

   public RemoveNewlyCreatedRoleFromStore(): Action {
    return {
      type: PERMISSION_ACTIONS.REMOVE_NEWLY_CREATED_ROLE_FROM_STORE
    };
  }

  private validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: Action, showToast: boolean = false, errorAction: Action = { type: '' }): Action {
    if (response.status === 'error') {
      if (showToast) {
        this._toasty.errorToast(response.message);
      }
      return errorAction;
    }
    return successAction;
  }
}
