import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { LocaleService } from '../../../services/locale.service';
import { SettingsWarehouseService } from '../../../services/settings.warehouse.service';
import { ToasterService } from '../../../services/toaster.service';
import { CustomActions } from '../../../store/custom-actions';

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
    /** Action to update warehouse */
    public static readonly UPDATE_WAREHOUSE = 'UPDATE_WAREHOUSE';
    /** Action to handle update warehouse response */
    public static readonly UPDATE_WAREHOUSE_RESPONSE = 'UPDATE_WAREHOUSE_RESPONSE';
    /** Action to set the default warehouse */
    public static readonly SET_AS_DEFAULT_WAREHOUSE = 'SET_AS_DEFAULT_WAREHOUSE';
    /** Action to set the default warehouse response */
    public static readonly SET_AS_DEFAULT_WAREHOUSE_RESPONSE = 'SET_AS_DEFAULT_WAREHOUSE_RESPONSE';
    /** Action to reset the default warehouse response */
    public static readonly RESET_DEFAULT_WAREHOUSE_DATA = 'RESET_DEFAULT_WAREHOUSE_DATA';
    /** Action to reset update warehouse flag (triggered after successful warehouse updation) */
    public static readonly RESET_UPDATE_WAREHOUSE = 'RESET_UPDATE_WAREHOUSE';
    /** Action to reset create warehouse flag (triggered after successful warehouse creation) */
    public static readonly RESET_CREATE_WAREHOUSE = 'RESET_CREATE_WAREHOUSE';
    /** Action to handle reset warehouse response */
    public static readonly RESET_WAREHOUSES = 'RESET_WAREHOUSES';

    /**
     * Create warehouse effect
     *
     * @private
     * @memberof WarehouseActions
     */
    public createWarehouse$ = createEffect(() => this.action$.pipe(
        ofType(WarehouseActions.CREATE_WAREHOUSE),
        switchMap((action: CustomActions) => this.settingsWarehouseService.createWarehouse(action.payload)),
        map((response: BaseResponse<any, any>) => {
            if (response?.status === 'error') {
                this.toast.errorToast(response.message, response.code);
                return { type: 'EmptyAction' };
            }
            this.toast.successToast(this.localeService.translate("app_messages.warehouse_created"), this.localeService.translate("app_success"));
            return this.createWarehouseResponse(response);
        })
    ));

    /**
     * Effect to fetch all the warehouses for a company
     *
     * @private
     * @memberof WarehouseActions
     */
    public getAllWarehouse$ = createEffect(() => this.action$.pipe(
        ofType(WarehouseActions.GET_ALL_WAREHOUSE),
        switchMap((action: CustomActions) => this.settingsWarehouseService.fetchAllWarehouse(action.payload)),
        map((response: BaseResponse<any, any>) => {
            if (response?.status === 'error') {
                this.toast.errorToast(response.message, response.code);
                return { type: 'EmptyAction' };
            }
            return this.fetchAllWarehousesResponse(response);
        })
    ));

    /**
     * Effect to update warehouse
     *
     * @private
     * @memberof WarehouseActions
     */

    public updateWarehouse$ = createEffect(() => this.action$.pipe(
        ofType(WarehouseActions.UPDATE_WAREHOUSE),
        switchMap((action: CustomActions) => this.settingsWarehouseService.updateWarehouse(action.payload)),
        map((response: BaseResponse<any, any>) => {
            if (response?.status === 'error') {
                this.toast.errorToast(response.message, response.code);
                return { type: 'EmptyAction' };
            }
            this.toast.successToast(this.localeService.translate("app_messages.warehouse_updated"), this.localeService.translate("app_success"));
            return this.updateWarehouseResponse(response);
        })
    ));

    /**
     * Effect to update warehouse
     *
     * @private
     * @memberof WarehouseActions
     */

    public setDefaultWarehouse$ = createEffect(() => this.action$.pipe(
        ofType(WarehouseActions.SET_AS_DEFAULT_WAREHOUSE),
        switchMap((action: CustomActions) => this.settingsWarehouseService.setAsDefaultWarehouse(action.payload)),
        map((response: BaseResponse<any, any>) => {
            if (response?.status === 'error') {
                this.toast.errorToast(response.message, response.code);
                return { type: 'EmptyAction' };
            }
            this.toast.successToast(this.localeService.translate("app_messages.warehouse_updated"), this.localeService.translate("app_success"));
            return this.setAsDefaultWarehouseResponse(response);
        })
    ));

    /** @ignore */
    constructor(
        private action$: Actions,
        private settingsWarehouseService: SettingsWarehouseService,
        private toast: ToasterService,
        private localeService: LocaleService
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
     * @param {*} params Request parameter required for fetch all warehouse service
     * @returns {CustomActions} Action to fetch all warehouse
     * @memberof WarehouseActions
     */
    public fetchAllWarehouses(params: any): CustomActions {
        return { type: WarehouseActions.GET_ALL_WAREHOUSE, payload: params };
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

    /**
     * Returns the action to trigger update warehouse service
     *
     * @param {*} params Request parameter required for update warehouse service
     * @returns {CustomActions} Action to perform update warehouse operation
     * @memberof WarehouseActions
     */
    public updateWarehouse(params: any): CustomActions {
        return { type: WarehouseActions.UPDATE_WAREHOUSE, payload: params };
    }

    /**
     * Returns the action to handle update warehouse response
     *
     * @param {BaseResponse<any, any>} response Response received from service
     * @returns {CustomActions} Action to handle update warehouse response
     * @memberof WarehouseActions
     */
    public updateWarehouseResponse(response: BaseResponse<any, any>): CustomActions {
        return { type: WarehouseActions.UPDATE_WAREHOUSE_RESPONSE, payload: response };
    }

    /**
     * Resets the warehouse updation flag in store
     *
     * @returns {CustomActions} Action to reset create warehouse operation
     * @memberof WarehouseActions
     */
    public resetUpdateWarehouse(): CustomActions {
        return { type: WarehouseActions.RESET_UPDATE_WAREHOUSE };
    }

    /**
     * Returns the action to handle set default warehouse operation
     *
     * @param {*} param Params required for set as default warehouse
     * @returns {CustomActions} Action to handle set default warehouse operation
     * @memberof WarehouseActions
     */
    public setAsDefaultWarehouse(param: any): CustomActions {
        return { type: WarehouseActions.SET_AS_DEFAULT_WAREHOUSE, payload: param };
    }

    /**
     * Returns the action to handle set default warehouse operation
     *
     * @param {*} response Response from set default warehouse service
     * @returns {CustomActions} Action to handle set default warehouse response
     * @memberof WarehouseActions
     */
    public setAsDefaultWarehouseResponse(response: any): CustomActions {
        return { type: WarehouseActions.SET_AS_DEFAULT_WAREHOUSE_RESPONSE, payload: response };
    }

    /**
     * Returns the action to reset default warehouse data
     *
     * @returns {CustomActions} Action to reset default warehouse data
     * @memberof WarehouseActions
     */
    public resetDefaultWarehouseResponse(): CustomActions {
        return { type: WarehouseActions.RESET_DEFAULT_WAREHOUSE_DATA };
    }

    /**
     * Returns the action to reset warehouse data
     *
     * @returns {CustomActions} Action to reset default warehouse data
     * @memberof WarehouseActions
     */
    public resetWarehouseResponse(): CustomActions {
        return { type: WarehouseActions.RESET_WAREHOUSES };
    }
}
