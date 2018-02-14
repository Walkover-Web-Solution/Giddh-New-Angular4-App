import { Injectable } from '@angular/core';
import { CreateStockRequest, StockDetailResponse, StockGroupRequest, StockGroupResponse, StocksResponse } from '../../models/api-models/Inventory';
import { Action, Store } from '@ngrx/store';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { AppState } from '../../store/roots';
import { InventoryService } from '../../services/inventory.service';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { ToasterService } from '../../services/toaster.service';
import { InventoryActionsConst } from './inventory.const';
import { Router } from '@angular/router';
import { CustomActions } from '../../store/customActions';

@Injectable()
export class InventoryAction {
  @Effect()
  public addNewGroup$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.AddNewGroup)
    .switchMap((action: CustomActions) => this._inventoryService.CreateStockGroup(action.payload))
    .map(response => this.addNewGroupResponse(response));

  @Effect()
  public addNewGroupResponse$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.AddNewGroupResponse)
    .map((response: CustomActions) => {
      let data: BaseResponse<StockGroupResponse, StockGroupRequest> = response.payload;
      if (data.status === 'error') {
        this._toasty.clearAllToaster();
        this._toasty.errorToast(data.message, data.code);
      } else {
        this._toasty.successToast('Group Created Successfully');
      }
      return {type: 'EmptyAction'};
    });

  @Effect()
  public updateGroup$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.UpdateGroup)
    .switchMap((action: CustomActions) => this._inventoryService.UpdateStockGroup(action.payload.body, action.payload.stockGroupUniquename))
    .map(response => this.updateGroupResponse(response));

  @Effect()
  public updateGroupResponse$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.UpdateGroupResponse)
    .map((response: CustomActions) => {
      let data: BaseResponse<StockGroupResponse, StockGroupRequest> = response.payload;
      if (data.status === 'error') {
        this._toasty.clearAllToaster();
        this._toasty.errorToast(data.message, data.code);
      } else {
        this._toasty.successToast('Group Updated Successfully');
      }
      return {type: 'EmptyAction'};
    });

  @Effect()
  public removeGroup$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.RemoveGroup)
    .switchMap((action: CustomActions) => this._inventoryService.DeleteStockGroup(action.payload))
    .map(response => this.removeGroupResponse(response));

  @Effect()
  public removeGroupResponse$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.RemoveGroupResponse)
    .map((response: CustomActions) => {
      let data: BaseResponse<string, string> = response.payload;
      if (data.status === 'error') {
        this._toasty.errorToast(data.message, data.code);
      } else {
        this._toasty.successToast(data.body, '');
      }
      return {type: 'EmptyAction'};
    });

  @Effect()
  public GetStockUniqueName$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.GetStockUniqueName)
    .switchMap((action: CustomActions) => this._inventoryService.GetStockDetails(action.payload.stockGroupUniqueName, action.payload.stockUniqueName))
    .map(response => {
      return this.GetStockUniqueNameResponse(response);
    });

  @Effect()
  public GetStockUniqueNameResponse$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.GetStockUniqueNameResponse)
    .map((action: CustomActions) => {
      return {type: 'EmptyAction'};
    });

  @Effect()
  public GetStock$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.GetStock)
    .switchMap((action: CustomActions) => this._inventoryService.GetStocks())
    .map(response => {
      return this.GetStockResponse(response);
    });

  @Effect()
  public GetStockResponse$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.GetStockResponse)
    .map((action: CustomActions) => {
      return {type: 'EmptyAction'};
    });

  // Get manufacturing stock
  @Effect()
  public GetManufacturingStock$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.GetManufacturingStock)
    .switchMap((action: CustomActions) => this._inventoryService.GetManufacturingStocks())
    .map(response => {
      return this.GetManufacturingStockResponse(response);
    });

  @Effect()
  public GetManufacturingStockResponse$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.GetManufacturingStockResponse)
    .map((action: CustomActions) => {
      return {type: 'EmptyAction'};
    });

  // Get manufacturing stock for create manufacturing
  @Effect()
  public GetManufacturingStockForCreate$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.GetManufacturingStockForCreate)
    .switchMap((action: CustomActions) => this._inventoryService.GetManufacturingStocksForCreateMF())
    .map(response => {
      return this.GetManufacturingCreateStockResponse(response);
    });

  @Effect()
  public GetManufacturingStockForCreateResponse$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.GetManufacturingStockForCreateResponse)
    .map((action: CustomActions) => {
      return {type: 'EmptyAction'};
    });

  @Effect()
  public createStock$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.CreateStock)
    .switchMap((action: CustomActions) => this._inventoryService.CreateStock(action.payload.stock, action.payload.stockGroupUniqueName))
    .map(response => this.createStockResponse(response));

  @Effect()
  public createStockResponse$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.CreateStockResponse)
    .map((response: CustomActions) => {
      let data: BaseResponse<StockDetailResponse, CreateStockRequest> = response.payload;
      if (data.status === 'error') {
        this._toasty.clearAllToaster();
        this._toasty.errorToast(data.message, data.code);
      } else {
        // this.router.navigate(['/pages', 'inventory', 'add-group', data.queryString.stockGroupUniqueName, 'add-stock']);
        this._toasty.successToast('Stock Created Successfully');
        return this.resetActiveStock();
      }
      return {type: 'EmptyAction'};
    });

  @Effect()
  public updateStock$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.UpdateStock)
    .switchMap((action: CustomActions) => this._inventoryService.UpdateStock(action.payload.stock, action.payload.stockGroupUniqueName, action.payload.stockUniqueName))
    .map(response => this.updateStockResponse(response));

  @Effect()
  public updateStockResponse$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.UpdateStockResponse)
    .map((response: CustomActions) => {
      let data: BaseResponse<StockDetailResponse, CreateStockRequest> = response.payload;
      if (data.status === 'error') {
        this._toasty.clearAllToaster();
        this._toasty.errorToast(data.message, data.code);
      } else {
        this.router.navigate(['/pages', 'inventory', 'add-group', data.queryString.stockGroupUniqueName, 'add-stock', data.body.uniqueName]);
        this._toasty.successToast('Stock Updated Successfully');
      }
      return {type: 'EmptyAction'};
    });

  @Effect()
  public removeStock$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.RemoveStock)
    .switchMap((action: CustomActions) => this._inventoryService.DeleteStock(action.payload.stockGroupUniqueName, action.payload.stockUniqueName))
    .map(response => this.removeStockResponse(response));

  @Effect()
  public removeStockResponse$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.RemoveStockResponse)
    .map((response: CustomActions) => {
      let data: BaseResponse<string, string> = response.payload;
      if (data.status === 'error') {
        this._toasty.errorToast(data.message, data.code);
      } else {
        this._toasty.successToast(data.body, '');
        this.router.navigate(['/pages', 'inventory', 'add-group', data.queryString.stockGroupUniqueName]);
      }
      return {type: 'EmptyAction'};
    });

  @Effect()
  public GetStockWithUniqueName$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.GetStockWithUniqueName)
    .switchMap((action: CustomActions) => this._inventoryService.GetStockUniqueNameWithDetail(action.payload.stockUniqueName))
    .map(response => {
      return this.GetStockWithUniqueNameResponse(response);
    });

  @Effect()
  public GetStockWithUniqueNameResponse$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.GetStockWithUniqueNameResponse)
    .map((action: CustomActions) => {
      return {type: 'EmptyAction'};
    });

  constructor(private store: Store<AppState>, private _inventoryService: InventoryService, private action$: Actions,
              private _toasty: ToasterService, private router: Router) {

  }

  public addNewGroup(value: StockGroupRequest): CustomActions {
    return {
      type: InventoryActionsConst.AddNewGroup,
      payload: value
    };
  }

  public addNewGroupResponse(value: BaseResponse<StockGroupResponse, StockGroupRequest>): CustomActions {
    return {
      type: InventoryActionsConst.AddNewGroupResponse,
      payload: value
    };
  }

  public createStock(value: CreateStockRequest, stockGroupUniqueName: string): CustomActions {
    return {
      type: InventoryActionsConst.CreateStock,
      payload: {stock: value, stockGroupUniqueName}
    };
  }

  public createStockResponse(value: BaseResponse<StockDetailResponse, CreateStockRequest>): CustomActions {
    return {
      type: InventoryActionsConst.CreateStockResponse,
      payload: value
    };
  }

  public updateStock(value: CreateStockRequest, stockGroupUniqueName: string, stockUniqueName: string): CustomActions {
    return {
      type: InventoryActionsConst.UpdateStock,
      payload: {stock: value, stockGroupUniqueName, stockUniqueName}
    };
  }

  public updateStockResponse(value: BaseResponse<StockDetailResponse, CreateStockRequest>): CustomActions {
    return {
      type: InventoryActionsConst.UpdateStockResponse,
      payload: value
    };
  }

  public updateGroup(value: StockGroupRequest, stockGroupUniquename: string): CustomActions {
    return {
      type: InventoryActionsConst.UpdateGroup,
      payload: {body: value, stockGroupUniquename}
    };
  }

  public updateGroupResponse(value: BaseResponse<StockGroupResponse, StockGroupRequest>): CustomActions {
    return {
      type: InventoryActionsConst.UpdateGroupResponse,
      payload: value
    };
  }

  public removeGroup(value: string): CustomActions {
    return {
      type: InventoryActionsConst.RemoveGroup,
      payload: value
    };
  }

  public removeGroupResponse(value: BaseResponse<string, string>): CustomActions {
    return {
      type: InventoryActionsConst.RemoveGroupResponse,
      payload: value
    };
  }

  public removeStock(stockGroupUniqueName: string, stockUniqueName: string): CustomActions {
    return {
      type: InventoryActionsConst.RemoveStock,
      payload: {stockGroupUniqueName, stockUniqueName}
    };
  }

  public removeStockResponse(value: BaseResponse<string, string>): CustomActions {
    return {
      type: InventoryActionsConst.RemoveStockResponse,
      payload: value
    };
  }

  public resetActiveGroup(): CustomActions {
    return {
      type: InventoryActionsConst.ResetActiveGroup
    };
  }

  public GetStockUniqueName(stockGroupUniqueName: string, stockUniqueName: string): CustomActions {
    return {
      type: InventoryActionsConst.GetStockUniqueName,
      payload: {stockGroupUniqueName, stockUniqueName}
    };
  }

  public GetStockUniqueNameResponse(value: BaseResponse<StockDetailResponse, string>): CustomActions {
    return {
      type: InventoryActionsConst.GetStockUniqueNameResponse,
      payload: value
    };
  }

  public GetStock(): CustomActions {
    return {
      type: InventoryActionsConst.GetStock
    };
  }

  public GetStockResponse(value: BaseResponse<StocksResponse, string>): CustomActions {
    return {
      type: InventoryActionsConst.GetStockResponse,
      payload: value
    };
  }

  // Get Stock for manufacturing
  public GetManufacturingStock(): CustomActions {
    return {
      type: InventoryActionsConst.GetManufacturingStock
    };
  }

  public GetManufacturingStockResponse(value: BaseResponse<StocksResponse, string>): CustomActions {
    return {
      type: InventoryActionsConst.GetManufacturingStockResponse,
      payload: value
    };
  }

  // Get Stock for create manufacturing
  public GetManufacturingCreateStock(): CustomActions {
    return {
      type: InventoryActionsConst.GetManufacturingStockForCreate
    };
  }

  public GetManufacturingCreateStockResponse(value: BaseResponse<StocksResponse, string>): CustomActions {
    return {
      type: InventoryActionsConst.GetManufacturingStockForCreateResponse,
      payload: value
    };
  }

  public resetActiveStock(): CustomActions {
    return {
      type: InventoryActionsConst.ResetActiveStock
    };
  }

  public showLoaderForStock(): CustomActions {
    return {
      type: InventoryActionsConst.ShowLoadingForStockEditInProcess
    };
  }

  public hideLoaderForStock(): CustomActions {
    return {
      type: InventoryActionsConst.HideLoadingForStockEditInProcess
    };
  }

  public ResetInventoryState(): CustomActions {
    return {
      type: InventoryActionsConst.ResetInventoryState
    };
  }

  public OpenNewGroupAsidePane(value: boolean) {
    return {
      type : InventoryActionsConst.NewGroupAsidePane,
      payload: value
    };
  }

  public OpenCustomUnitPane(value: boolean) {
    return {
      type : InventoryActionsConst.NewCustomUnitAsidePane,
      payload: value
    };
  }

  public GetStockWithUniqueName(stockUniqueName: string): CustomActions {
    return {
      type: InventoryActionsConst.GetStockWithUniqueName,
      payload: {stockUniqueName}
    };
  }

  public GetStockWithUniqueNameResponse(value: BaseResponse<StockDetailResponse, string>): CustomActions {
    return {
      type: InventoryActionsConst.GetStockWithUniqueNameResponse,
      payload: value
    };
  }
}
