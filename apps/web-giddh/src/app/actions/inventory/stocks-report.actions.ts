import { map, switchMap } from 'rxjs/operators';
/**
 * Created by ad on 04-07-2017.
 */
import { GroupStockReportRequest, GroupStockReportResponse, StockReportRequest, StockReportResponse } from '../../models/api-models/Inventory';
import { STOCKS_REPORT_ACTIONS } from './inventory.const';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../../services/toaster.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { Observable } from 'rxjs';
import { InventoryService } from '../../services/inventory.service';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { CustomActions } from '../../store/customActions';

@Injectable()
export class StockReportActions {

    @Effect() private GetStocksReport$: Observable<Action> = this.action$
        .ofType(STOCKS_REPORT_ACTIONS.GET_STOCKS_REPORT).pipe(
            switchMap((action: CustomActions) => {
                // let activeGroup: StockGroupResponse = null;
                // let sub = this.store.select(a => a.inventory.activeGroup);
                // sub.take(1).subscribe(a => {
                //   activeGroup = a;
                // });
                // if (activeGroup) {
                //   this.store.dispatch()
                // }
                return this._inventoryService.GetStocksReport_v2(action.payload).pipe(
                    map((response) => {
                        const isStockNotFound = response && response.status === 'error' && response.code === 'STOCK_NOT_FOUND';
                        if (response) {
                            return this.validateResponse<StockReportResponse, StockReportRequest>(response, {
                                type: STOCKS_REPORT_ACTIONS.GET_STOCKS_REPORT_RESPONSE,
                                payload: response.body
                            }, !isStockNotFound, {
                                type: STOCKS_REPORT_ACTIONS.GET_STOCKS_REPORT_RESPONSE,
                                payload: (isStockNotFound) ? {
                                    isStockNotFound,
                                    message: response.message
                                } : response.body
                            });
                        } else {
                            return { type: 'EmptyAction' };
                        }
                    }));

            }));

    @Effect() private GetGroupStocksReport$: Observable<Action> = this.action$
        .ofType(STOCKS_REPORT_ACTIONS.GET_GROUP_STOCKS_REPORT).pipe(
            switchMap((action: CustomActions) => {
                return this._inventoryService.GetGroupStocksReport_V3(action.payload).pipe(
                    map((response) => {
                        const isGroupNotFound = response && response.status === 'error' && response.code === 'STOCK_GROUP_NOT_FOUND';
                        return this.validateResponse<GroupStockReportResponse, GroupStockReportRequest>(response, {
                            type: STOCKS_REPORT_ACTIONS.GET_GROUP_STOCKS_REPORT_RESPONSE,
                            payload: response.body
                        }, !isGroupNotFound, {
                            type: STOCKS_REPORT_ACTIONS.GET_GROUP_STOCKS_REPORT_RESPONSE,
                            payload: (isGroupNotFound) ? {
                                isGroupNotFound,
                                message: response.message
                            } : response.body
                        });
                    }));
            }));

    constructor(private action$: Actions,
        private _toasty: ToasterService,
        private store: Store<AppState>,
        private _inventoryService: InventoryService) {
    }

    public GetStocksReport(stockReportRequest: StockReportRequest): CustomActions {
        return {
            type: STOCKS_REPORT_ACTIONS.GET_STOCKS_REPORT,
            payload: stockReportRequest
        };
    }

    public GetGroupStocksReport(stockReportRequest: StockReportRequest): CustomActions {
        return {
            type: STOCKS_REPORT_ACTIONS.GET_GROUP_STOCKS_REPORT,
            payload: stockReportRequest
        };
    }

    private validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: CustomActions, showToast: boolean = false, errorAction: CustomActions = { type: 'EmptyAction' }): CustomActions {
        if (response.status === 'error') {
            if (showToast) {
                this._toasty.errorToast(response.message);
            }
            return errorAction;
        }
        return successAction;
    }
}
