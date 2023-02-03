import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToasterService } from '../../services/toaster.service';
import { InventoryService } from '../../services/inventory.service';
import { CustomActions } from '../../store/customActions';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { INVENTORY_REPORT_ACTIONS } from './inventory.const';
import { InventoryFilter, InventoryReport } from '../../models/api-models/Inventory-in-out';
import { Observable } from 'rxjs';

@Injectable()
export class InventoryReportActions {

    public genReport$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(INVENTORY_REPORT_ACTIONS.GENERATE_REPORT),
            switchMap((action: CustomActions) => this._inventoryService.GetInventoryReport_v2(action.payload)),
            map(response => {
                if (response?.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(response.message, response.code);
                } else {
                    return this.genReportResponse(response);
                }
                return { type: 'EmptyAction' };
            })));

    constructor(private _inventoryService: InventoryService, private action$: Actions,
        private _toasty: ToasterService) {

    }

    public genReport(stockUniqueName: string, from?: string, to?: string, page?: number, count?: number, reportFilters?: InventoryFilter): CustomActions {
        return {
            type: INVENTORY_REPORT_ACTIONS.GENERATE_REPORT,
            payload: { stockUniqueName, reportFilters, from, to, page, count }
        };
    }

    public genReportResponse(value: BaseResponse<InventoryReport, string>): CustomActions {
        return {
            type: INVENTORY_REPORT_ACTIONS.GENERATE_REPORT_RESPONSE,
            payload: value
        };
    }
}
