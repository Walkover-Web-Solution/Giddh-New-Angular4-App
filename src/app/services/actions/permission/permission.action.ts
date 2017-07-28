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
import { CreateNewRoleRequest, CreateNewRoleResponseAndRequest, CreateNewRoleResponse } from '../../../models/api-models/Permission';
import { Router } from '@angular/router';

@Injectable()
export class PermissionActions {

  @Effect()
  private GetRoles$: Observable<Action> = this.action$
    .ofType(PERMISSION_ACTIONS.GET_ROLES)
    .switchMap(action => this._permissionService.GetAllRoles())
    .map(response => {
      return this.GetRolesResponse(response);
    });

  @Effect()
  private GetRolesResponse$: Observable<Action> = this.action$
    .ofType(PERMISSION_ACTIONS.GET_ROLES_RESPONSE)
    .map(action => {
      return { type: '' };
    });

  @Effect()
  private CreateRole$: Observable<Action> = this.action$
    .ofType(PERMISSION_ACTIONS.CREATE_NEW_ROLE)
    .switchMap(action => {
      return this._permissionService.CreateNewRole(action.payload)
        .map(response => this.CreateRoleResponse(response));
    });

  @Effect()
  private CreateRoleResponse$: Observable<Action> = this.action$
    .ofType(PERMISSION_ACTIONS.CREATE_NEW_ROLE_RESPONSE)
    .map(response => {
      let data: BaseResponse<CreateNewRoleResponse, CreateNewRoleRequest> = response.payload;
      if (data.status === 'error') {
        this._toasty.errorToast(data.message, data.code);
      } else {
        this._toasty.successToast('New Role Created Successfully');
        this._router.navigate(['/pages', 'permissions', 'list']);
      }
      return { type: '' };
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
    private _router: Router,
    private store: Store<AppState>,
    private _permissionService: PermissionService) {
  }

  public GetRoles() {
    return { type: PERMISSION_ACTIONS.GET_ROLES };
  }

  public GetRolesResponse(value: BaseResponse<CreateNewRoleResponseAndRequest[], string>) {
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

  public CreateRole(value: CreateNewRoleRequest): Action {
    return {
      type: PERMISSION_ACTIONS.CREATE_NEW_ROLE,
      payload: value
    };
  }

  public CreateRoleResponse(value: BaseResponse<CreateNewRoleResponse, CreateNewRoleRequest>): Action {
    return {
      type: PERMISSION_ACTIONS.CREATE_NEW_ROLE_RESPONSE,
      payload: value
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
