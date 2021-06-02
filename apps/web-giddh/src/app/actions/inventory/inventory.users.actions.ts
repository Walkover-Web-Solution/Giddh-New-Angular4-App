import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
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


    public addNewUser$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(INVENTORY_USER_ACTIONS.CREATE_USER),
            switchMap((action: CustomActions) => this._inventoryService.CreateInventoryUser(action.payload)),
            map(response => this.addNewUserResponse(response))));


    public addNewUserResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(INVENTORY_USER_ACTIONS.CREATE_USER_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<InventoryUser, string> = response.payload;
                if (data.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast('User Created Successfully');
                }
                return { type: 'EmptyAction' };
            })));


    public updateUser$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(INVENTORY_USER_ACTIONS.UPDATE_USER),
            switchMap((action: CustomActions) => this._inventoryService.UpdateInventoryUser(action.payload)),
            map(response => this.updateUserResponse(response))));


    public updateUserResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(INVENTORY_USER_ACTIONS.UPDATE_USER_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<InventoryUser, string> = response.payload;
                if (data.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast('User Updated Successfully');
                }
                return { type: 'EmptyAction' };
            })));


    public deleteUser$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(INVENTORY_USER_ACTIONS.DELETE_USER),
            switchMap((action: CustomActions) => this._inventoryService.DeleteInventoryUser(action.payload)),
            map(response => this.deleteUserResponse(response))));


    public deleteUserResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(INVENTORY_USER_ACTIONS.DELETE_USER_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<string, string> = response.payload;
                if (data.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast('User Deleted Successfully');
                }
                return { type: 'EmptyAction' };
            })));


    public getUser$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(INVENTORY_USER_ACTIONS.GET_USER),
            switchMap((action: CustomActions) => this._inventoryService.GetInventoryUser(action.payload)),
            map(response => this.getUserResponse(response))));


    public getUserResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(INVENTORY_USER_ACTIONS.GET_USER_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<InventoryUser, string> = response.payload;
                if (data.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    // this._toasty.successToast('User Updated Successfully');
                }
                return { type: 'EmptyAction' };
            })));


    public getAllUsers$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(INVENTORY_USER_ACTIONS.GET_ALL_USERS),
            switchMap((action: CustomActions) => this._inventoryService.GetAllInventoryUser()),
            map(data => {
                if (data.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    return this.getAllUsersResponse(data);
                }
                return { type: 'EmptyAction' };
            })));

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
