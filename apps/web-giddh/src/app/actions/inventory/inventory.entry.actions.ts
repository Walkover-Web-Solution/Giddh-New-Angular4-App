import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { ToasterService } from '../../services/toaster.service';
import { InventoryService } from '../../services/inventory.service';
import { Router } from '@angular/router';
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
                if (data.status === 'error') {
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
                if (data.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast('Entry Created Successfully');
                }
                return { type: 'EmptyAction' };
            })));


    public updateEntry$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(INVENTORY_ENTRY_ACTIONS.UPDATE_ENTRY),
            switchMap((action: CustomActions) => this._inventoryService.UpdateInventoryEntry(action.payload.entry, action.payload.inventoryUserUniqueName, action.payload.inventoryEntryUniqueName)),
            map(response => this.updateEntryResponse(response))));


    public updateEntryResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(INVENTORY_ENTRY_ACTIONS.UPDATE_ENTRY_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<InventoryEntry, InventoryEntry> = response.payload;
                if (data.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast('Entry Updated Successfully');
                }
                return { type: 'EmptyAction' };
            })));


    public deleteEntry$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(INVENTORY_ENTRY_ACTIONS.DELETE_ENTRY),
            switchMap((action: CustomActions) => this._inventoryService.DeleteInventoryEntry(action.payload.inventoryUserUniqueName, action.payload.inventoryEntryUniqueName)),
            map(response => this.deleteEntryResponse(response))));


    public deleteEntryResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(INVENTORY_ENTRY_ACTIONS.DELETE_ENTRY_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<string, string> = response.payload;
                if (data.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast('Entry Deleted Successfully');
                }
                return { type: 'EmptyAction' };
            })));


    public getEntry$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(INVENTORY_ENTRY_ACTIONS.GET_ENTRY),
            switchMap((action: CustomActions) => this._inventoryService.GetInventoryEntry(action.payload.inventoryUserUniqueName, action.payload.inventoryEntryUniqueName)),
            map(response => this.getEntryResponse(response))));


    public getEntryResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(INVENTORY_ENTRY_ACTIONS.GET_ENTRY_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<InventoryEntry, string> = response.payload;
                if (data.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    // this._toasty.successToast('User Updated Successfully');
                }
                return { type: 'EmptyAction' };
            })));

    constructor(
        private store: Store<AppState>, private _inventoryService: InventoryService, private action$: Actions,
        private _toasty: ToasterService, private router: Router) {
    }

    public getEntry(inventoryUserUniqueName: string, inventoryEntryUniqueName: string): CustomActions {
        return {
            type: INVENTORY_ENTRY_ACTIONS.GET_ENTRY,
            payload: { inventoryUserUniqueName, inventoryEntryUniqueName }
        };
    }

    public getEntryResponse(value: BaseResponse<InventoryEntry, string>): CustomActions {
        return {
            type: INVENTORY_ENTRY_ACTIONS.GET_ENTRY_RESPONSE,
            payload: value
        };
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





    public updateEntry(inventoryUserUniqueName: string, entry: InventoryEntry, inventoryEntryUniqueName: string): CustomActions {
        return {
            type: INVENTORY_ENTRY_ACTIONS.UPDATE_ENTRY,
            payload: { inventoryUserUniqueName, entry, inventoryEntryUniqueName }
        };
    }

    public updateEntryResponse(value: BaseResponse<InventoryEntry, InventoryEntry>): CustomActions {
        return {
            type: INVENTORY_ENTRY_ACTIONS.UPDATE_ENTRY_RESPONSE,
            payload: value
        };
    }

    public deleteEntry(inventoryUserUniqueName: string, inventoryEntryUniqueName: string): CustomActions {
        return {
            type: INVENTORY_ENTRY_ACTIONS.DELETE_ENTRY,
            payload: { inventoryUserUniqueName, inventoryEntryUniqueName }
        };
    }

    public deleteEntryResponse(value: BaseResponse<string, string>): CustomActions {
        return {
            type: INVENTORY_ENTRY_ACTIONS.DELETE_ENTRY_RESPONSE,
            payload: value
        };
    }
}
