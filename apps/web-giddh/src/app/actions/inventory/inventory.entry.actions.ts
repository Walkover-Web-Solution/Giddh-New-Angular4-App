import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToasterService } from '../../services/toaster.service';
import { InventoryService } from '../../services/inventory.service';
import { CustomActions } from '../../store/customActions';
import { INVENTORY_ENTRY_ACTIONS } from './inventory.const';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { InventoryEntry, InventoryUser } from '../../models/api-models/Inventory-in-out';
import { Observable } from 'rxjs';

@Injectable()
export class InventoryEntryActions {

    public addNewEntry$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(INVENTORY_ENTRY_ACTIONS.CREATE_ENTRY),
            switchMap((action: CustomActions) => this._inventoryService.CreateInventoryEntry(action.payload.entry, action.payload.reciever)),
            map(response => this.addNewEntryResponse(response))));

    public addNewEntryResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(INVENTORY_ENTRY_ACTIONS.CREATE_ENTRY_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<InventoryEntry, InventoryEntry> = response.payload;
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
            ofType(INVENTORY_ENTRY_ACTIONS.CREATE_TRANSFER_ENTRY),
            switchMap((action: CustomActions) => this._inventoryService.CreateInventoryTransferEntry(action.payload.entry, action.payload.reciever)),
            map(response => this.addNewEntryResponse(response))));

    public addNewTransferEntryResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(INVENTORY_ENTRY_ACTIONS.CREATE_TRANSFER_ENTRY_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<InventoryEntry, InventoryEntry> = response.payload;
                if (data?.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast('Entry Created Successfully');
                }
                return { type: 'EmptyAction' };
            })));

    constructor(
        private _inventoryService: InventoryService, private action$: Actions,
        private _toasty: ToasterService) {
    }

    public addNewEntry(entry: InventoryEntry, reciever?: InventoryUser): CustomActions {
        return {
            type: INVENTORY_ENTRY_ACTIONS.CREATE_ENTRY,
            payload: { entry, reciever }
        };
    }

    public addNewEntryResponse(value: BaseResponse<InventoryEntry, InventoryEntry>): CustomActions {
        return {
            type: INVENTORY_ENTRY_ACTIONS.CREATE_ENTRY_RESPONSE,
            payload: value
        };
    }

    public addNewTransferEntry(entry: InventoryEntry, reciever?: InventoryUser): CustomActions {
        return {
            type: INVENTORY_ENTRY_ACTIONS.CREATE_TRANSFER_ENTRY,
            payload: { entry, reciever }
        };
    }

    public addNewTransferEntryResponse(value: BaseResponse<InventoryEntry, InventoryEntry>): CustomActions {
        return {
            type: INVENTORY_ENTRY_ACTIONS.CREATE_TRANSFER_ENTRY_RESPONSE,
            payload: value
        };
    }
}
