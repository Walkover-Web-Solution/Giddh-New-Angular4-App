import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToasterService } from '../../services/toaster.service';
import { InventoryService } from '../../services/inventory.service';
import { CustomActions } from '../../store/custom-actions';
import { INVENTORY_ENTRY_ACTIONS } from './inventory.const';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { InventoryEntry, InventoryUser } from '../../models/api-models/Inventory-in-out';
import { Observable } from 'rxjs';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * InventoryEntryActions actions
 * Defines inventoryentry related action creators for state management
 */
export class InventoryEntryActions {

    public addNewEntry$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVENTORY_ENTRY_ACTIONS.CREATE_ENTRY),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._inventoryService.CreateInventoryEntry(action.payload.entry, action.payload.reciever)),
            /**
             * Handles map functionality
             */
            map(response => this.addNewEntryResponse(response))));

    public addNewEntryResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVENTORY_ENTRY_ACTIONS.CREATE_ENTRY_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<InventoryEntry, InventoryEntry> = response.payload;
                /**
                 * Handles if functionality
                 */
                if (data?.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast('Entry Created Successfully');
                }
                return { type: 'EmptyAction' };
            })));

    public addNewTransferEntry$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVENTORY_ENTRY_ACTIONS.CREATE_TRANSFER_ENTRY),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._inventoryService.CreateInventoryTransferEntry(action.payload.entry, action.payload.reciever)),
            /**
             * Handles map functionality
             */
            map(response => this.addNewEntryResponse(response))));

    public addNewTransferEntryResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVENTORY_ENTRY_ACTIONS.CREATE_TRANSFER_ENTRY_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<InventoryEntry, InventoryEntry> = response.payload;
                /**
                 * Handles if functionality
                 */
                if (data?.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast('Entry Created Successfully');
                }
                return { type: 'EmptyAction' };
            })));

    /**
     * Creates an instance of actions
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private _inventoryService: InventoryService, private action$: Actions,
        private _toasty: ToasterService) {
    }

    /**
     * Handles addNewEntry functionality
     */
    public addNewEntry(entry: InventoryEntry, reciever?: InventoryUser): CustomActions {
        return {
            type: INVENTORY_ENTRY_ACTIONS.CREATE_ENTRY,
            payload: { entry, reciever }
        };
    }

    /**
     * Handles addNewEntryResponse functionality
     */
    public addNewEntryResponse(value: BaseResponse<InventoryEntry, InventoryEntry>): CustomActions {
        return {
            type: INVENTORY_ENTRY_ACTIONS.CREATE_ENTRY_RESPONSE,
            payload: value
        };
    }

    /**
     * Handles addNewTransferEntry functionality
     */
    public addNewTransferEntry(entry: InventoryEntry, reciever?: InventoryUser): CustomActions {
        return {
            type: INVENTORY_ENTRY_ACTIONS.CREATE_TRANSFER_ENTRY,
            payload: { entry, reciever }
        };
    }

    /**
     * Handles addNewTransferEntryResponse functionality
     */
    public addNewTransferEntryResponse(value: BaseResponse<InventoryEntry, InventoryEntry>): CustomActions {
        return {
            type: INVENTORY_ENTRY_ACTIONS.CREATE_TRANSFER_ENTRY_RESPONSE,
            payload: value
        };
    }
}
