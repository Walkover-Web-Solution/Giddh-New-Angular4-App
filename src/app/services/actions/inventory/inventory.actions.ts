import { Injectable } from '@angular/core';
import { StockGroupRequest, StockGroupResponse, StockDetailResponse, StocksResponse, CreateStockRequest } from '../../../models/api-models/Inventory';
import { Action, Store } from '@ngrx/store';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { AppState } from '../../../store/roots';
import { InventoryService } from '../../inventory.service';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { ToasterService } from '../../toaster.service';
import { InventoryActionsConst } from './inventory.const';
import { Router } from '@angular/router';

@Injectable()
export class InventoryAction {
  @Effect()
  public addNewGroup$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.AddNewGroup)
    .switchMap(action => this._inventoryService.CreateStockGroup(action.payload))
    .map(response => this.addNewGroupResponse(response));

  @Effect()
  public addNewGroupResponse$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.AddNewGroupResponse)
    .map(response => {
      let data: BaseResponse<StockGroupResponse, StockGroupRequest> = response.payload;
      if (data.status === 'error') {
        this._toasty.clearAllToaster();
        this._toasty.errorToast(data.message, data.code);
      } else {
        this._toasty.successToast('Group Created Successfully');
      }
      return { type: '' };
    });

  @Effect()
  public updateGroup$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.UpdateGroup)
    .switchMap(action => this._inventoryService.UpdateStockGroup(action.payload.body, action.payload.stockGroupUniquename))
    .map(response => this.updateGroupResponse(response));

  @Effect()
  public updateGroupResponse$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.UpdateGroupResponse)
    .map(response => {
      let data: BaseResponse<StockGroupResponse, StockGroupRequest> = response.payload;
      if (data.status === 'error') {
        this._toasty.clearAllToaster();
        this._toasty.errorToast(data.message, data.code);
      } else {
        this._toasty.successToast('Group Updated Successfully');
      }
      return { type: '' };
    });

  @Effect()
  public removeGroup$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.RemoveGroup)
    .switchMap(action => this._inventoryService.DeleteStockGroup(action.payload))
    .map(response => this.removeGroupResponse(response));

  @Effect()
  public removeGroupResponse$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.RemoveGroupResponse)
    .map(response => {
      let data: BaseResponse<string, string> = response.payload;
      if (data.status === 'error') {
        this._toasty.errorToast(data.message, data.code);
      } else {
        this._toasty.successToast(data.body, '');
      }
      return { type: '' };
    });

  @Effect()
  public GetStockUniqueName$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.GetStockUniqueName)
    .switchMap(action => this._inventoryService.GetStockDetails(action.payload.stockGroupUniqueName, action.payload.stockUniqueName))
    .map(response => {
      return this.GetStockUniqueNameResponse(response);
    });

  @Effect()
  public GetStockUniqueNameResponse$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.GetStockUniqueNameResponse)
    .map(action => {
      return { type: '' };
    });

  @Effect()
  public GetStock$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.GetStock)
    .switchMap(action => this._inventoryService.GetStocks())
    .map(response => {
      return this.GetStockResponse(response);
    });

  @Effect()
  public GetStockResponse$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.GetStockResponse)
    .map(action => {
      return { type: '' };
    });

  // Get manufacturing stock
  @Effect()
  public GetManufacturingStock$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.GetManufacturingStock)
    .switchMap(action => this._inventoryService.GetManufacturingStocks())
    .map(response => {
      return this.GetManufacturingStockResponse(response);
    });

  @Effect()
  public GetManufacturingStockResponse$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.GetManufacturingStockResponse)
    .map(action => {
      return { type: '' };
    });

  @Effect()
  public createStock$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.CreateStock)
    .switchMap(action => this._inventoryService.CreateStock(action.payload.stock, action.payload.stockGroupUniqueName))
    .map(response => this.createStockResponse(response));

  @Effect()
  public createStockResponse$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.CreateStockResponse)
    .map(response => {
      let data: BaseResponse<StockDetailResponse, CreateStockRequest> = response.payload;
      if (data.status === 'error') {
        this._toasty.clearAllToaster();
        this._toasty.errorToast(data.message, data.code);
      } else {
        this.router.navigate(['/pages', 'inventory', 'add-group', data.queryString.stockGroupUniqueName, 'add-stock']);
        this._toasty.successToast('Stock Created Successfully');
        return this.resetActiveStock();
      }
      return { type: '' };
    });

  @Effect()
  public updateStock$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.UpdateStock)
    .switchMap(action => this._inventoryService.UpdateStock(action.payload.stock, action.payload.stockGroupUniqueName, action.payload.stockUniqueName))
    .map(response => this.updateStockResponse(response));

  @Effect()
  public updateStockResponse$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.UpdateStockResponse)
    .map(response => {
      let data: BaseResponse<StockDetailResponse, CreateStockRequest> = response.payload;
      if (data.status === 'error') {
        this._toasty.clearAllToaster();
        this._toasty.errorToast(data.message, data.code);
      } else {
        this.router.navigate(['/pages', 'inventory', 'add-group', data.queryString.stockGroupUniqueName, 'add-stock', data.body.uniqueName]);
        this._toasty.successToast('Stock Updated Successfully');
      }
      return { type: '' };
    });

  @Effect()
  public removeStock$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.RemoveStock)
    .switchMap(action => this._inventoryService.DeleteStock(action.payload.stockGroupUniqueName, action.payload.stockUniqueName))
    .map(response => this.removeStockResponse(response));

  @Effect()
  public removeStockResponse$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.RemoveStockResponse)
    .map(response => {
      let data: BaseResponse<string, string> = response.payload;
      if (data.status === 'error') {
        this._toasty.errorToast(data.message, data.code);
      } else {
        this._toasty.successToast(data.body, '');
        this.router.navigate(['/pages', 'inventory', 'add-group', data.queryString.stockGroupUniqueName]);
      }
      return { type: '' };
    });

  constructor(private store: Store<AppState>, private _inventoryService: InventoryService, private action$: Actions,
    private _toasty: ToasterService, private router: Router) {

  }

  public addNewGroup(value: StockGroupRequest): Action {
    return {
      type: InventoryActionsConst.AddNewGroup,
      payload: value
    };
  }

  public addNewGroupResponse(value: BaseResponse<StockGroupResponse, StockGroupRequest>): Action {
    return {
      type: InventoryActionsConst.AddNewGroupResponse,
      payload: value
    };
  }

  public createStock(value: CreateStockRequest, stockGroupUniqueName: string): Action {
    return {
      type: InventoryActionsConst.CreateStock,
      payload: { stock: value, stockGroupUniqueName }
    };
  }

  public createStockResponse(value: BaseResponse<StockDetailResponse, CreateStockRequest>): Action {
    return {
      type: InventoryActionsConst.CreateStockResponse,
      payload: value
    };
  }

  public updateStock(value: CreateStockRequest, stockGroupUniqueName: string, stockUniqueName: string): Action {
    return {
      type: InventoryActionsConst.UpdateStock,
      payload: { stock: value, stockGroupUniqueName, stockUniqueName }
    };
  }

  public updateStockResponse(value: BaseResponse<StockDetailResponse, CreateStockRequest>): Action {
    return {
      type: InventoryActionsConst.UpdateStockResponse,
      payload: value
    };
  }

  public updateGroup(value: StockGroupRequest, stockGroupUniquename: string): Action {
    return {
      type: InventoryActionsConst.UpdateGroup,
      payload: { body: value, stockGroupUniquename }
    };
  }

  public updateGroupResponse(value: BaseResponse<StockGroupResponse, StockGroupRequest>): Action {
    return {
      type: InventoryActionsConst.UpdateGroupResponse,
      payload: value
    };
  }

  public removeGroup(value: string): Action {
    return {
      type: InventoryActionsConst.RemoveGroup,
      payload: value
    };
  }

  public removeGroupResponse(value: BaseResponse<string, string>): Action {
    return {
      type: InventoryActionsConst.RemoveGroupResponse,
      payload: value
    };
  }

  public removeStock(stockGroupUniqueName: string, stockUniqueName: string): Action {
    return {
      type: InventoryActionsConst.RemoveStock,
      payload: { stockGroupUniqueName, stockUniqueName }
    };
  }

  public removeStockResponse(value: BaseResponse<string, string>): Action {
    return {
      type: InventoryActionsConst.RemoveStockResponse,
      payload: value
    };
  }

  public resetActiveGroup(): Action {
    return {
      type: InventoryActionsConst.ResetActiveGroup
    };
  }

  public GetStockUniqueName(stockGroupUniqueName: string, stockUniqueName: string): Action {
    return {
      type: InventoryActionsConst.GetStockUniqueName,
      payload: { stockGroupUniqueName, stockUniqueName }
    };
  }

  public GetStockUniqueNameResponse(value: BaseResponse<StockDetailResponse, string>): Action {
    return {
      type: InventoryActionsConst.GetStockUniqueNameResponse,
      payload: value
    };
  }

  public GetStock(): Action {
    return {
      type: InventoryActionsConst.GetStock
    };
  }

  public GetStockResponse(value: BaseResponse<StocksResponse, string>): Action {
    return {
      type: InventoryActionsConst.GetStockResponse,
      payload: value
    };
  }

  // Get Stock for manufacturing
  public GetManufacturingStock(): Action {
    return {
      type: InventoryActionsConst.GetManufacturingStock
    };
  }

  public GetManufacturingStockResponse(value: BaseResponse<StocksResponse, string>): Action {
    return {
      type: InventoryActionsConst.GetManufacturingStockResponse,
      payload: value
    };
  }

  public resetActiveStock(): Action {
    return {
      type: InventoryActionsConst.ResetActiveStock
    };
  }
  public showLoaderForStock(): Action {
    return {
      type: InventoryActionsConst.ShowLoadingForStockEditInProcess
    };
  }

  public hideLoaderForStock(): Action {
    return {
      type: InventoryActionsConst.HideLoadingForStockEditInProcess
    };
  }

  public ResetInventoryState(): Action {
    return {
      type: InventoryActionsConst.ResetInventoryState
    };
  }
}
