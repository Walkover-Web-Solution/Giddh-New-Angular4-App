import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToasterService } from '../../services/toaster.service';
import { InventoryService } from '../../services/inventory.service';
import { CustomActions } from '../../store/custom-actions';
import { INVENTORY_USER_ACTIONS } from './inventory.const';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { InventoryUser } from '../../models/api-models/Inventory-in-out';
import { Observable } from 'rxjs';
import { IPaginatedResponse } from '../../models/interfaces/paginated-response.interface';

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
                if (data?.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast('User Created Successfully');
                }
                return { type: 'EmptyAction' };
            })));

    public getAllUsers$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(INVENTORY_USER_ACTIONS.GET_ALL_USERS),
            switchMap((action: CustomActions) => this._inventoryService.GetAllInventoryUser()),
            map(data => {
                if (data?.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    return this.getAllUsersResponse(data);
                }
                return { type: 'EmptyAction' };
            })));

    constructor(private _inventoryService: InventoryService, private action$: Actions,
        private _toasty: ToasterService) {
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
}
