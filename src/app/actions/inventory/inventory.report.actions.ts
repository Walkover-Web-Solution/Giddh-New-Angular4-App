import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../../services/toaster.service';
import { InventoryService } from '../../services/inventory.service';
import { CustomActions } from '../../store/customActions';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { INVENTORY_ENTRY_ACTIONS, INVENTORY_REPORT_ACTIONS } from './inventory.const';
import { InventoryFilter, InventoryReport } from '../../models/api-models/Inventory';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class InventoryReportActions {
  @Effect()
  public genReport$: Observable<Action> = this.action$
    .ofType(INVENTORY_REPORT_ACTIONS.GENERATE_REPORT)
    .switchMap((action: CustomActions) => this._inventoryService.GetInventoryReport(action.payload))
    .map(response => this.genReportResponse(response));

  @Effect()
  public genReportResponse$: Observable<Action> = this.action$
    .ofType(INVENTORY_REPORT_ACTIONS.GENERATE_REPORT_RESPONSE)
    .map((response: CustomActions) => {
      let data: BaseResponse<string, string> = response.payload;
      if (data.status === 'error') {
        this._toasty.clearAllToaster();
        this._toasty.errorToast(data.message, data.code);
      } else {
        // this._toasty.successToast('User Created Successfully');
      }
      return {type: 'EmptyAction'};
    });
  constructor(private store: Store<AppState>, private _inventoryService: InventoryService, private action$: Actions,
              private _toasty: ToasterService) {

  }

  public genReport(stockUniqueName: string, from?: string, to?: string, page?: number, count?: number, reportFilters?: InventoryFilter): CustomActions {
    return {
      type: INVENTORY_REPORT_ACTIONS.GENERATE_REPORT,
      payload: {stockUniqueName, reportFilters, from, to, page, count}
    };
  }

  public genReportResponse(value: BaseResponse<InventoryReport, string>): CustomActions {
    return {
      type: INVENTORY_ENTRY_ACTIONS.GET_ENTRY_RESPONSE,
      payload: value
    };
  }
}
