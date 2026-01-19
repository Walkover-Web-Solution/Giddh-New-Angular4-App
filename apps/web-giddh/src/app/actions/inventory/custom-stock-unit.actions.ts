import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { StockUnitRequest, StockUnitResponse } from '../../models/api-models/Inventory';
import { InventoryService } from '../../services/inventory.service';
import { ToasterService } from '../../services/toaster.service';
import { CustomActions } from '../../store/custom-actions';
import { CUSTOM_STOCK_UNIT_ACTIONS } from './inventory.const';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * CustomStockUnitAction actions
 * Defines customstockunitaction related action creators for state management
 */
export class CustomStockUnitAction {

    public CreateStockUnit$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(CUSTOM_STOCK_UNIT_ACTIONS.CREATE_STOCK_UNIT),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this._inventoryService.CreateStockUnit(action.payload).pipe(
                    /**
                     * Handles map functionality
                     */
                    map((r) => {
                        return this.validateResponse(r, {
                            type: CUSTOM_STOCK_UNIT_ACTIONS.CREATE_STOCK_UNIT_RESPONSE,
                            payload: r
                        }, true, 'Unit Added Successfully', {
                            type: CUSTOM_STOCK_UNIT_ACTIONS.CREATE_STOCK_UNIT_RESPONSE,
                            payload: r
                        });
                    }));
            })));

    public GetStockUnit$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(CUSTOM_STOCK_UNIT_ACTIONS.GET_STOCK_UNIT),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this._inventoryService.GetStockUnit().pipe(
                    /**
                     * Handles map functionality
                     */
                    map((r) => this.validateResponse(r, {
                        type: CUSTOM_STOCK_UNIT_ACTIONS.GET_STOCK_UNIT_RESPONSE,
                        payload: r?.body
                    })));
            })));

    public UpdateStockUnit$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(CUSTOM_STOCK_UNIT_ACTIONS.UPDATE_STOCK_UNIT),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this._inventoryService.UpdateStockUnit(action.payload.unit, action.payload.uniqueName).pipe(
                    /**
                     * Handles map functionality
                     */
                    map((data: BaseResponse<StockUnitResponse, StockUnitRequest>) => this.validateResponse(data, {
                        type: CUSTOM_STOCK_UNIT_ACTIONS.UPDATE_STOCK_UNIT_RESPONSE,
                        payload: data?.body
                    }, true, 'Unit has been updated successfully')));
            })));

    /**
     * This with use for all get stock mapped units
     *
     * @type {Observable<Action>}
     * @memberof CustomStockUnitAction
     */
    public getStockMappedUnit$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(CUSTOM_STOCK_UNIT_ACTIONS.GET_STOCK_MAPPED_UNITS),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this._inventoryService.getStockMappedUnit().pipe(
                    /**
                     * Handles map functionality
                     */
                    map((r) => this.validateResponse(r, {
                        type: CUSTOM_STOCK_UNIT_ACTIONS.GET_STOCK_MAPPED_UNITS_RESPONSE,
                        payload: r?.body
                    })));
            })));

    /**
     * This  will use for get stock mapped unit by unique name
     *
     * @type {Observable<Action>}
     * @memberof CustomStockUnitAction
     */
    public getStockMappedUnitByUniqueName$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(CUSTOM_STOCK_UNIT_ACTIONS.GET_STOCK_MAPPED_UNIT_UNIQUE_NAME),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this._inventoryService.getStockMappedUnitByUniqueName(action.payload.uniqueName).pipe(
                    /**
                     * Handles map functionality
                     */
                    map((r) => this.validateResponse(r, {
                        type: CUSTOM_STOCK_UNIT_ACTIONS.GET_STOCK_MAPPED_UNIT_UNIQUE_NAME_RESPONSE,
                        payload: r?.body
                    })));
            })));


    public DeleteStockUnit$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(CUSTOM_STOCK_UNIT_ACTIONS.DELETE_STOCK_UNIT),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this._inventoryService.DeleteStockUnit(action.payload).pipe(
                    /**
                     * Handles map functionality
                     */
                    map((r) => this.validateResponse(r, {
                        type: CUSTOM_STOCK_UNIT_ACTIONS.DELETE_STOCK_UNIT_RESPONSE,
                        payload: r
                    }, true, r?.body, {
                        type: CUSTOM_STOCK_UNIT_ACTIONS.DELETE_STOCK_UNIT_RESPONSE,
                        payload: r
                    })));
            })));


    public GetStockUnitByName$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(CUSTOM_STOCK_UNIT_ACTIONS.GET_STOCK_UNIT_NAME),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._inventoryService.GetStockUnitByName(action.payload)),
            /**
             * Handles map functionality
             */
            map(response => {
                return this.GetStockUnitByNameResponse(response);
            })));


    public GetStockUnitByNameResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(CUSTOM_STOCK_UNIT_ACTIONS.GET_STOCK_UNIT_NAME_RESPONSE),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => {
                return { type: 'EmptyAction' };
            })));

    /**
     * Creates an instance of actions
     * Initializes component dependencies and sets up initial state
     */
    constructor(private action$: Actions,
        private _toasty: ToasterService,
        private _inventoryService: InventoryService) {
    }

    /**
     * Handles CreateStockUnit functionality
     */
    public CreateStockUnit(unit: StockUnitRequest): CustomActions {
        return {
            type: CUSTOM_STOCK_UNIT_ACTIONS.CREATE_STOCK_UNIT,
            payload: unit
        };
    }

    /**
     * Handles UpdateStockUnit functionality
     */
    public UpdateStockUnit(unit: StockUnitRequest, uniqueName: string): CustomActions {
        return {
            type: CUSTOM_STOCK_UNIT_ACTIONS.UPDATE_STOCK_UNIT,
            payload: { unit, uniqueName }
        };
    }

    /**
     * Handles DeleteStockUnit functionality
     */
    public DeleteStockUnit(code: string): CustomActions {
        return {
            type: CUSTOM_STOCK_UNIT_ACTIONS.DELETE_STOCK_UNIT,
            payload: code
        };
    }

    /**
     * Retrieves stockunit data
     */
    public getStockUnit(): CustomActions {
        return {
            type: CUSTOM_STOCK_UNIT_ACTIONS.GET_STOCK_UNIT,
        };
    }

    /**
      *This will use for get stock mapped units
     *
     * @return {*}  {CustomActions}
     * @memberof CustomStockUnitAction
     */
    public getStockMappedUnits(): CustomActions {
        return {
            type: CUSTOM_STOCK_UNIT_ACTIONS.GET_STOCK_MAPPED_UNITS,
        };
    }

    /**
     * This will use for get stock mapped units by unique name
     *
     * @param {string} uniqueName
     * @return {*}  {CustomActions}
     * @memberof CustomStockUnitAction
     */
    public getStockMappedUnitByUniqueName(uniqueName: string): CustomActions {
        return {
            type: CUSTOM_STOCK_UNIT_ACTIONS.GET_STOCK_MAPPED_UNIT_UNIQUE_NAME,
            payload: { uniqueName }
        };
    }

    /**
     * Handles GetStockUnitByName functionality
     */
    public GetStockUnitByName(unitName): CustomActions {
        return {
            type: CUSTOM_STOCK_UNIT_ACTIONS.GET_STOCK_UNIT_NAME,
            payload: unitName
        };
    }

    /**
     * Handles GetStockUnitByNameResponse functionality
     */
    public GetStockUnitByNameResponse(res): CustomActions {
        return {
            type: CUSTOM_STOCK_UNIT_ACTIONS.GET_STOCK_UNIT_NAME_RESPONSE,
            payload: res
        };
    }

    /**
     * Resets stockunitresponse to default state
     */
    public resetStockUnitResponse(): CustomActions {
        return {
            type: CUSTOM_STOCK_UNIT_ACTIONS.RESET_STOCK_UNIT_RESPONSE,
        };
    }

    /**
     * Validates response input
     */
    private validateResponse(response: BaseResponse<any, any>, successAction: CustomActions, showToast: boolean = false, ShowMessage: string = '', errorAction: CustomActions = { type: 'EmptyAction' }): CustomActions {
        /**
         * Handles if functionality
         */
        if (response?.status === 'error') {
            /**
             * Handles if functionality
             */
            if (showToast) {
                this._toasty.errorToast(response.message);
            }
            return errorAction;
        }
        /**
         * Handles if functionality
         */
        if (ShowMessage !== '') {
            this._toasty.successToast(ShowMessage);
        }
        return successAction;
    }
}
