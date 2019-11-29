import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';

import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { SettingsWarehouseService } from '../../../services/settings.warehouse.service';
import { ToasterService } from '../../../services/toaster.service';
import { CustomActions } from '../../../store/customActions';

/**
 * Warehouse actions
 *
 * @export
 * @class WarehouseActions
 */
@Injectable()
export class WarehouseActions {

    /** Action to create warehouse */
    public static readonly CREATE_WAREHOUSE = 'CREATE_WAREHOUSE';
    /** Action to handle warehouse response */
    public static readonly CREATE_WAREHOUSE_RESPONSE = 'CREATE_WAREHOUSE_RESPONSE';
    /** Action to get all warehouse */
    public static readonly GET_ALL_WAREHOUSE = 'GET_ALL_WAREHOUSE';
    /** Action to handle all warehouse response */
    public static readonly GET_ALL_WAREHOUSE_RESPONSE = 'GET_ALL_WAREHOUSE_RESPONSE';
    /** Action to reset create warehouse operation (triggered after successful warehouse creation) */
    public static readonly RESET_CREATE_WAREHOUSE = 'RESET_CREATE_WAREHOUSE';

    /**
     * Create warehouse effect
     *
     * @private
     * @memberof WarehouseActions
     */
    @Effect()
    private createWarehouse$ = this.action$.pipe(
        ofType(WarehouseActions.CREATE_WAREHOUSE),
        switchMap((action: CustomActions) => this.settingsWarehouseService.createWarehouse(action.payload)),
        map((response: BaseResponse<any, any>) => {
            if (response.status === 'error') {
                this.toast.errorToast(response.message, response.code);
                return { type: 'EmptyAction' };
            }
            this.toast.successToast('New warehouse created successfully', 'Success');
            return this.createWarehouseResponse(response);
        })
    );

    /**
     * Effect to fetch all the warehouses for a company
     *
     * @private
     * @memberof WarehouseActions
     */
    @Effect()
    private getAllWarehouse$ = this.action$.pipe(
        ofType(WarehouseActions.GET_ALL_WAREHOUSE),
        switchMap(() => this.settingsWarehouseService.fetchAllWarehouse()),
        map((response: BaseResponse<any, any>) => {
            if (response.status === 'error') {
                this.toast.errorToast(response.message, response.code);
                return { type: 'EmptyAction' };
            }
            return this.fetchAllWarehousesResponse(response);
        })
    );

    /** @ignore */
    constructor(
        private action$: Actions,
        private settingsWarehouseService: SettingsWarehouseService,
        private toast: ToasterService
    ) { }

    /**
     * Returns the action to create a warehouse
     *
     * @param {*} params Request parameters for create warehouse service
     * @returns {CustomActions} Action to create warehouse
     * @memberof WarehouseActions
     */
    public createWarehouse(params: any): CustomActions {
        return { type: WarehouseActions.CREATE_WAREHOUSE, payload: params };
    }

    /**
     * Returns the action to carry out further operations after
     * warehouse has been created
     *
     * @param {BaseResponse<any, any>} response Response received from service
     * @returns {CustomActions} Action to handle create warehouse response
     * @memberof WarehouseActions
     */
    public createWarehouseResponse(response: BaseResponse<any, any>): CustomActions {
        return { type: WarehouseActions.CREATE_WAREHOUSE_RESPONSE, payload: response };
    }

    /**
     * Resets the warehouse creation flag in store
     *
     * @returns {CustomActions} Action to reset create warehouse operation
     * @memberof WarehouseActions
     */
    public resetCreateWarehouse(): CustomActions {
        return { type: WarehouseActions.RESET_CREATE_WAREHOUSE };
    }

    /**
     * Fetches all warehouses for a particular company
     *
     * @returns {CustomActions} Action to fetch all warehouse
     * @memberof WarehouseActions
     */
    public fetchAllWarehouses(): CustomActions {
        return { type: WarehouseActions.GET_ALL_WAREHOUSE }
    }

    /**
     * All warehouses for a particular company are received
     *
     * @returns {CustomActions} Action to perform further operations with the response
     * @memberof WarehouseActions
     */
    public fetchAllWarehousesResponse(response: BaseResponse<any, any>): CustomActions {
        return { type: WarehouseActions.GET_ALL_WAREHOUSE_RESPONSE, payload: response };
    }

}
