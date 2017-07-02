import { GroupsWithStocksHierarchyMin } from '../../../models/api-models/GroupsWithStocks';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { StockGroupResponse } from '../../../models/api-models/Inventory';
import { InventoryActionsConst } from './inventory.const';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../../toaster.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class SidebarAction {
  @Effect()
  public GetInventoryGroup$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.GetInventoryGroup)
    .switchMap(action => {
      let groupRespce: BaseResponse<StockGroupResponse, string> = {
        queryString: { stockUniqueName: action.payload.stockUniqueName },
        request: 'daal0032',
        status: 'success',
        body: {
          uniqueName: 'daal0032',
          parentStockGroup: { uniqueName: 'daal0032', name: 'Daal223' },
          childStockGroups: [],
          stocks: [{ uniqueName: 'sabji', name: 'Sabji' }, { uniqueName: 'kadi', name: 'Kadi' }],
          parentStockGroupNames: ['Daal223'],
          name: 'Rise111'
        }
      };
      let groupRespceError: BaseResponse<StockGroupResponse, string> = {
        request: 'daal0032',
        status: 'error',
        code: 'Invalid',
        message: 'this is cool'
      };
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
    .switchMap(action => {
      let groupRespce: BaseResponse<GroupsWithStocksHierarchyMin, string> = {
        status: 'success', body: {
          page: 1, count: 9, totalPages: 1, totalItems: 9, results: [{
            uniqueName: 'bhaari0028',
            childStockGroups: [{ uniqueName: 'halka0023', childStockGroups: [], name: 'Halka' }],
            name: 'Bhaari'
          }, { uniqueName: 'sh', childStockGroups: [], name: 'Shares' }, {
            uniqueName: 'soup0034',
            childStockGroups: [],
            name: 'Soup'
          },
            { uniqueName: 'daal00321', childStockGroups: [], name: 'Daal' }, {
              uniqueName: 'puri0040',
              childStockGroups: [],
              name: 'puri'
            },
            { uniqueName: 'sav0039', childStockGroups: [], name: 'Sav22' }, {
              uniqueName: 'daal0032',
              childStockGroups: [{ uniqueName: 'bhaji0038', childStockGroups: [], name: 'Bhaji' },
                { uniqueName: 'rise0037', childStockGroups: [], name: 'Rise111' }],
              name: 'Daal223'
            }, { uniqueName: 'sharma&sons', childStockGroups: [], name: 'Sharma & Sons' }, {
              uniqueName: 'dummy',
              childStockGroups: [],
              name: 'Dummy'
            }], size: 9
        }
      };
      // if (action.payload === 'rise0037') {
      return Observable.of(groupRespce);
    })
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

  constructor(private action$: Actions,
              private _toasty: ToasterService,
              private store: Store<AppState>,
              private router: ActivatedRoute) {
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
      payload: { groupUniqueName, stockUniqueName }
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
