import { map, switchMap } from 'rxjs/operators';
import { GroupStockReportRequest, GroupStockReportResponse, StockReportRequest, StockReportResponse } from '../../models/api-models/Inventory';
import { STOCKS_REPORT_ACTIONS } from './inventory.const';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToasterService } from '../../services/toaster.service';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { InventoryService } from '../../services/inventory.service';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { CustomActions } from '../../store/custom-actions';

@Injectable()
export class StockReportActions {

    public GetStocksReport$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(STOCKS_REPORT_ACTIONS.GET_STOCKS_REPORT),
            switchMap((action: CustomActions) => {
                return this._inventoryService.GetStocksReport_v2(action.payload).pipe(
                    map((response) => {
                        const isStockNotFound = response && response?.status === 'error' && response.code === 'STOCK_NOT_FOUND';
                        if (response) {
                            return this.validateResponse<StockReportResponse, StockReportRequest>(response, {
                                type: STOCKS_REPORT_ACTIONS.GET_STOCKS_REPORT_RESPONSE,
                                payload: response?.body
                            }, !isStockNotFound, {
                                type: STOCKS_REPORT_ACTIONS.GET_STOCKS_REPORT_RESPONSE,
                                payload: (isStockNotFound) ? {
                                    isStockNotFound,
                                    message: response.message
                                } : response?.body
                            });
                        } else {
                            return { type: 'EmptyAction' };
                        }
                    }));
            })));

    public GetGroupStocksReport$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(STOCKS_REPORT_ACTIONS.GET_GROUP_STOCKS_REPORT),
            switchMap((action: CustomActions) => {
                return this._inventoryService.GetGroupStocksReport_V3(action.payload).pipe(
                    map((response) => {
                        const isGroupNotFound = response && response?.status === 'error' && response.code === 'STOCK_GROUP_NOT_FOUND';
                        return this.validateResponse<GroupStockReportResponse, GroupStockReportRequest>(response, {
                            type: STOCKS_REPORT_ACTIONS.GET_GROUP_STOCKS_REPORT_RESPONSE,
                            payload: response?.body
                        }, !isGroupNotFound, {
                            type: STOCKS_REPORT_ACTIONS.GET_GROUP_STOCKS_REPORT_RESPONSE,
                            payload: (isGroupNotFound) ? {
                                isGroupNotFound,
                                message: response.message
                            } : response?.body
                        });
                    }));
            })));

    constructor(private action$: Actions,
        private _toasty: ToasterService,
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
        if (response?.status === 'error') {
            if (showToast) {
                this._toasty.errorToast(response.message);
            }
            return errorAction;
        }
        return successAction;
    }
}
