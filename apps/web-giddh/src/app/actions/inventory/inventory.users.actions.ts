import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../../services/toaster.service';
import { InventoryService } from '../../services/inventory.service';
import { Router } from '@angular/router';
import { CustomActions } from '../../store/customActions';
import { INVENTORY_USER_ACTIONS } from './inventory.const';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { InventoryUser } from '../../models/api-models/Inventory-in-out';
import { Observable } from 'rxjs';
import { IPaginatedResponse } from '../../models/interfaces/paginatedResponse.interface';

@Injectable()
export class InventoryUsersActions {

    @Effect()
    public addNewUser$: Observable<Action> = this.action$
        .ofType(INVENTORY_USER_ACTIONS.CREATE_USER).pipe(
            switchMap((action: CustomActions) => this._inventoryService.CreateInventoryUser(action.payload)),
            map(response => this.addNewUserResponse(response)));

    @Effect()
    public addNewUserResponse$: Observable<Action> = this.action$
        .ofType(INVENTORY_USER_ACTIONS.CREATE_USER_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<InventoryUser, string> = response.payload;
                if (data.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast('User Created Successfully');
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public updateUser$: Observable<Action> = this.action$
        .ofType(INVENTORY_USER_ACTIONS.UPDATE_USER).pipe(
            switchMap((action: CustomActions) => this._inventoryService.UpdateInventoryUser(action.payload)),
            map(response => this.updateUserResponse(response)));

    @Effect()
    public updateUserResponse$: Observable<Action> = this.action$
        .ofType(INVENTORY_USER_ACTIONS.UPDATE_USER_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<InventoryUser, string> = response.payload;
                if (data.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast('User Updated Successfully');
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public deleteUser$: Observable<Action> = this.action$
        .ofType(INVENTORY_USER_ACTIONS.DELETE_USER).pipe(
            switchMap((action: CustomActions) => this._inventoryService.DeleteInventoryUser(action.payload)),
            map(response => this.deleteUserResponse(response)));

    @Effect()
    public deleteUserResponse$: Observable<Action> = this.action$
        .ofType(INVENTORY_USER_ACTIONS.DELETE_USER_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<string, string> = response.payload;
                if (data.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast('User Deleted Successfully');
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public getUser$: Observable<Action> = this.action$
        .ofType(INVENTORY_USER_ACTIONS.GET_USER).pipe(
            switchMap((action: CustomActions) => this._inventoryService.GetInventoryUser(action.payload)),
            map(response => this.getUserResponse(response)));

    @Effect()
    public getUserResponse$: Observable<Action> = this.action$
        .ofType(INVENTORY_USER_ACTIONS.GET_USER_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<InventoryUser, string> = response.payload;
                if (data.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    // this._toasty.successToast('User Updated Successfully');
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public getAllUsers$: Observable<Action> = this.action$
        .ofType(INVENTORY_USER_ACTIONS.GET_ALL_USERS).pipe(
            switchMap((action: CustomActions) => this._inventoryService.GetAllInventoryUser()),
            map(data => {
                if (data.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    return this.getAllUsersResponse(data);
                }
                return { type: 'EmptyAction' };
            }));

    constructor(private store: Store<AppState>, private _inventoryService: InventoryService, private action$: Actions,
        private _toasty: ToasterService, private router: Router) {
    }

    public getUser(name: string): CustomActions {
        return {
            type: INVENTORY_USER_ACTIONS.GET_USER,
            payload: name
        };
    }

    public getUserResponse(value: BaseResponse<InventoryUser, string>): CustomActions {
        return {
            type: INVENTORY_USER_ACTIONS.GET_USER_RESPONSE,
            payload: value
        };
    }

    public getAllUsers(): CustomActions {
        return {
            type: INVENTORY_USER_ACTIONS.GET_ALL_USERS,
        };
    }

    public getAllUsersResponse(value: BaseResponse<IPaginatedResponse<InventoryUser>, string>): CustomActions {
        return {
            type: INVENTORY_USER_ACTIONS.GET_ALL_USERS_RESPONSE,
            payload: value
        };
    }

    public addNewUser(name: string): CustomActions {
        return {
            type: INVENTORY_USER_ACTIONS.CREATE_USER,
            payload: name
        };
    }

    public addNewUserResponse(value: BaseResponse<InventoryUser, string>): CustomActions {
        return {
            type: INVENTORY_USER_ACTIONS.CREATE_USER_RESPONSE,
            payload: value
        };
    }

    public updateUser(name: string): CustomActions {
        return {
            type: INVENTORY_USER_ACTIONS.UPDATE_USER,
            payload: name
        };
    }

    public updateUserResponse(value: BaseResponse<InventoryUser, string>): CustomActions {
        return {
            type: INVENTORY_USER_ACTIONS.UPDATE_USER_RESPONSE,
            payload: value
        };
    }

    public deleteUser(name: string): CustomActions {
        return {
            type: INVENTORY_USER_ACTIONS.DELETE_USER,
            payload: name
        };
    }

    public deleteUserResponse(value: BaseResponse<string, string>): CustomActions {
        return {
            type: INVENTORY_USER_ACTIONS.DELETE_USER_RESPONSE,
            payload: value
        };
    }
}
