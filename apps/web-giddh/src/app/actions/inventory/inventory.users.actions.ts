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

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * InventoryUsersActions actions
 * Defines inventoryusers related action creators for state management
 */
export class InventoryUsersActions {

    public addNewUser$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVENTORY_USER_ACTIONS.CREATE_USER),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._inventoryService.CreateInventoryUser(action.payload)),
            /**
             * Handles map functionality
             */
            map(response => this.addNewUserResponse(response))));

    public addNewUserResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVENTORY_USER_ACTIONS.CREATE_USER_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<InventoryUser, string> = response.payload;
                /**
                 * Handles if functionality
                 */
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
            /**
             * Handles ofType functionality
             */
            ofType(INVENTORY_USER_ACTIONS.GET_ALL_USERS),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._inventoryService.GetAllInventoryUser()),
            /**
             * Handles map functionality
             */
            map(data => {
                /**
                 * Handles if functionality
                 */
                if (data?.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    return this.getAllUsersResponse(data);
                }
                return { type: 'EmptyAction' };
            })));

    /**
     * Creates an instance of actions
     * Initializes component dependencies and sets up initial state
     */
    constructor(private _inventoryService: InventoryService, private action$: Actions,
        private _toasty: ToasterService) {
    }

    /**
     * Retrieves allusers data
     */
    public getAllUsers(): CustomActions {
        return {
            type: INVENTORY_USER_ACTIONS.GET_ALL_USERS,
        };
    }

    /**
     * Retrieves allusersresponse data
     */
    public getAllUsersResponse(value: BaseResponse<IPaginatedResponse<InventoryUser>, string>): CustomActions {
        return {
            type: INVENTORY_USER_ACTIONS.GET_ALL_USERS_RESPONSE,
            payload: value
        };
    }

    /**
     * Handles addNewUser functionality
     */
    public addNewUser(name: string): CustomActions {
        return {
            type: INVENTORY_USER_ACTIONS.CREATE_USER,
            payload: name
        };
    }

    /**
     * Handles addNewUserResponse functionality
     */
    public addNewUserResponse(value: BaseResponse<InventoryUser, string>): CustomActions {
        return {
            type: INVENTORY_USER_ACTIONS.CREATE_USER_RESPONSE,
            payload: value
        };
    }
}
