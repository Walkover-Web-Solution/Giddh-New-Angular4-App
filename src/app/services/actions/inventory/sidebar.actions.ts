import { GroupsWithStocksHierarchyMin } from '../../../models/api-models/GroupsWithStocks';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { StockGroupResponse } from '../../../models/api-models/Inventory';
import { InventoryActionsConst } from './inventory.const';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../../toaster.service';
import { Store, Action } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { InventoryService } from '../../inventory.service';

@Injectable()
export class SidebarAction {
  @Effect()
  public GetInventoryGroup$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.GetInventoryGroup)
    .switchMap(action => {
      let groupRespce: BaseResponse<StockGroupResponse, string> = {queryString: { stockUniqueName: action.payload.stockUniqueName }, request: 'daal0032', status: 'success', body: { uniqueName: 'daal0032', parentStockGroup: { uniqueName: 'daal0032', name: 'Daal223' }, childStockGroups: [], stocks: [{ uniqueName: 'sabji', name: 'Sabji' }, { uniqueName: 'kadi', name: 'Kadi' }], parentStockGroupNames: ['Daal223'], name: 'Rise111' } };
      let groupRespceError: BaseResponse<StockGroupResponse, string> = { request: 'daal0032', status: 'error', code: 'Invalid', message: 'this is cool' };
      if (action.payload.groupUniqueName === 'daal0032') {
        return Observable.of(groupRespce);
      } else {
        return Observable.of(groupRespceError);
      }
    })
    .map(response => {
      return this.GetInventoryGroupResponse(response);
    });

  @Effect()
  public GetInventoryGroupResponse$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.GetInventoryGroupResponse)
    .map(action => {
      let data: BaseResponse<StockGroupResponse, string> = action.payload;
      if (action.payload.status === 'error') {
        this._toasty.errorToast(action.payload.message, action.payload.code);
      }
      return { type: '' };
    });

  @Effect()
  public GetGroupsWithStocksHierarchyMin$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.GetGroupsWithStocksHierarchyMin)
    .switchMap(action => this._inventoryService.GetGroupsWithStocksHierarchyMin(action.payload))
    .map(response => {
      return this.GetGroupsWithStocksHierarchyMinResponse(response);
    });

  @Effect()
  public GetGroupsWithStocksHierarchyMinResponse$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.GetGroupsWithStocksHierarchyMinResponse)
    .map(action => {
      let data: BaseResponse<StockGroupResponse, string> = action.payload;
      if (action.payload.status === 'error') {
        this._toasty.errorToast(action.payload.message, action.payload.code);
      }
      return { type: '' };
    });
  constructor(
    private action$: Actions,
    private _toasty: ToasterService,
    private store: Store<AppState>,
    private _inventoryService: InventoryService,
  ) {
  }
  public OpenGroup(groupUniqueName: string): Action {
    return {
      type: InventoryActionsConst.InventoryGroupToggleOpen,
      payload: groupUniqueName
    };
  }
  public GetInventoryGroup(groupUniqueName: string, stockUniqueName?: string): Action {
    return {
      type: InventoryActionsConst.GetInventoryGroup,
      payload: {groupUniqueName, stockUniqueName}
    };
  }

  public GetInventoryGroupResponse(value: BaseResponse<StockGroupResponse, string>): Action {
    return {
      type: InventoryActionsConst.GetInventoryGroupResponse,
      payload: value
    };
  }

  public GetInventoryStock(stockUniqueName: string): Action {
    return {
      type: InventoryActionsConst.GetInventoryStock,
      payload: stockUniqueName
    };
  }

  public GetInventoryStockResponse(value: BaseResponse<StockGroupResponse, string>): Action {
    return {
      type: InventoryActionsConst.GetInventoryStockResponse,
      payload: value
    };
  }

  public GetGroupsWithStocksHierarchyMin(): Action {
    return {
      type: InventoryActionsConst.GetGroupsWithStocksHierarchyMin
    };
  }

  public GetGroupsWithStocksHierarchyMinResponse(value: BaseResponse<GroupsWithStocksHierarchyMin, string>): Action {
    return {
      type: InventoryActionsConst.GetGroupsWithStocksHierarchyMinResponse,
      payload: value
    };
  }
}
