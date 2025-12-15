import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class WarehouseActions {

    constructor(private actions$: Actions) {}

    // Placeholder action constants
    public static readonly CREATE_WAREHOUSE = 'CREATE_WAREHOUSE';
    public static readonly GET_ALL_WAREHOUSES = 'GET_ALL_WAREHOUSES';
    public static readonly UPDATE_WAREHOUSE = 'UPDATE_WAREHOUSE';
    public static readonly DELETE_WAREHOUSE = 'DELETE_WAREHOUSE';

    // Placeholder methods
    createWarehouse(request: any): any {
        return {
            type: WarehouseActions.CREATE_WAREHOUSE,
            payload: request
        };
    }

    getAllWarehouses(): any {
        return {
            type: WarehouseActions.GET_ALL_WAREHOUSES
        };
    }

    updateWarehouse(request: any): any {
        return {
            type: WarehouseActions.UPDATE_WAREHOUSE,
            payload: request
        };
    }

    deleteWarehouse(warehouseUniqueName: string): any {
        return {
            type: WarehouseActions.DELETE_WAREHOUSE,
            payload: warehouseUniqueName
        };
    }

    resetWarehouseResponse(): any {
        return {
            type: 'RESET_WAREHOUSE_RESPONSE'
        };
    }
}
