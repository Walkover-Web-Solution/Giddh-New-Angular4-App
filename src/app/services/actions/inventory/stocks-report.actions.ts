/**
 * Created by ad on 04-07-2017.
 */
import {StockReportResponse, StockReportRequest} from '../../../models/api-models/Inventory';
import { STOCKS_REPORT_ACTIONS } from './inventory.const';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../../toaster.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { Observable } from 'rxjs/Rx';
import { InventoryService } from '../../inventory.service';
import { BaseResponse } from '../../../models/api-models/BaseResponse';

@Injectable()
export class StockReportActions {

  @Effect() private GetStocksReport$: Observable<Action> = this.action$
    .ofType(STOCKS_REPORT_ACTIONS.GET_STOCKS_REPORT)
    .switchMap(action => {
      return this._inventoryService.GetStocksReport(action.payload)
        .map((r) => this.validateResponse<StockReportResponse, StockReportRequest>(r, {
          type: STOCKS_REPORT_ACTIONS.GET_STOCKS_REPORT_RESPONSE,
          payload: r.body
        }));
    });

  constructor(private action$: Actions,
    private _toasty: ToasterService,
    private store: Store<AppState>,
    private _inventoryService: InventoryService) {
  }

  public GetStocksReport(stockReportRequest: StockReportRequest): Action {
    return {
      type: STOCKS_REPORT_ACTIONS.GET_STOCKS_REPORT,
      payload: stockReportRequest
    };
  }

  private validateResponse<TResponse, Trequest>(response: BaseResponse<TResponse, Trequest>, successAction: Action, showToast: boolean = false, errorAction: Action = { type: '' }): Action {
    if (response.status === 'error') {
      if (showToast) {
        this._toasty.errorToast(response.message);
      }
      return errorAction;
    }
    return successAction;
  }
}
