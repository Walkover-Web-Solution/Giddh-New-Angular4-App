import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToasterService } from '../../services/toaster.service';
import { InventoryService } from '../../services/inventory.service';
import { CustomActions } from '../../store/custom-actions';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { INVENTORY_REPORT_ACTIONS } from './inventory.const';
import { InventoryFilter, InventoryReport } from '../../models/api-models/Inventory-in-out';
import { Observable } from 'rxjs';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * InventoryReportActions actions
 * Defines inventoryreport related action creators for state management
 */
export class InventoryReportActions {

    public genReport$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVENTORY_REPORT_ACTIONS.GENERATE_REPORT),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._inventoryService.GetInventoryReport_v2(action.payload)),
            /**
             * Handles map functionality
             */
            map(response => {
                /**
                 * Handles if functionality
                 */
                if (response?.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(response.message, response.code);
                } else {
                    return this.genReportResponse(response);
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
     * Handles genReport functionality
     */
    public genReport(stockUniqueName: string, from?: string, to?: string, page?: number, count?: number, reportFilters?: InventoryFilter): CustomActions {
        return {
            type: INVENTORY_REPORT_ACTIONS.GENERATE_REPORT,
            payload: { stockUniqueName, reportFilters, from, to, page, count }
        };
    }

    /**
     * Handles genReportResponse functionality
     */
    public genReportResponse(value: BaseResponse<InventoryReport, string>): CustomActions {
        return {
            type: INVENTORY_REPORT_ACTIONS.GENERATE_REPORT_RESPONSE,
            payload: value
        };
    }
}
