import { Injectable } from '@angular/core';
import { StockGroupRequest, StockGroupResponse } from '../../../models/api-models/Inventory';
import { Action, Store } from '@ngrx/store';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { AppState } from '../../../store/roots';
import { InventoryService } from '../../inventory.service';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { ToasterService } from '../../toaster.service';
import { InventoryActionsConst } from './inventory.const';

@Injectable()
export  class  InventoryAction {
  @Effect()
  public  addNewGroup$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.AddNewGroup)
    .switchMap(action => this._inventoryService.CreateStockGroup(action.payload))
    .map(response => this.addNewGroupResponse(response));

  @Effect()
  public  addNewGroupResponse$: Observable<Action> = this.action$
    .ofType(InventoryActionsConst.AddNewGroupResponse)
    .map(response => {
      let data: BaseResponse<StockGroupResponse, StockGroupRequest> = response;
      if (response.status === 'error') {
        this._toasty.errorToast(data.message, data.code);
      } else {
        this._toasty.successToast('Group Created Successfully');
      }
      return { type: '' };
    });

    @Effect()
    public  updateGroup$: Observable<Action> = this.action$
      .ofType(InventoryActionsConst.UpdateGroup)
      .switchMap(action => this._inventoryService.UpdateStockGroup(action.payload.body, action.payload.stockGroupUniquename))
      .map(response => this.updateGroupResponse(response));

    @Effect()
    public  updateGroupResponse$: Observable<Action> = this.action$
      .ofType(InventoryActionsConst.UpdateGroupResponse)
      .map(response => {
        let data: BaseResponse<StockGroupResponse, StockGroupRequest> = response.payload;
        if (response.status === 'error') {
          this._toasty.errorToast(data.message, data.code);
        } else {
          this._toasty.successToast('Group Updated Successfully');
        }
        return { type: '' };
      });

      @Effect()
      public  removeGroup$: Observable<Action> = this.action$
        .ofType(InventoryActionsConst.RemoveGroup)
        .switchMap(action => this._inventoryService.DeleteStockGroup(action.payload))
        .map(response => this.removeGroupResponse(response));

      @Effect()
      public  removeGroupResponse$: Observable<Action> = this.action$
        .ofType(InventoryActionsConst.RemoveGroupResponse)
        .map(response => {
          let data: BaseResponse<string, string> = response.payload;
          if (response.status === 'error') {
            this._toasty.errorToast(data.message, data.code);
          } else {
            this._toasty.successToast(data.body, '');
          }
          return { type: '' };
        });

  constructor(private  store: Store<AppState>, private _inventoryService: InventoryService, private action$: Actions, private _toasty: ToasterService) {

  }

  public addNewGroup(value: StockGroupRequest): Action {
    return {
      type: InventoryActionsConst.AddNewGroup,
      payload: value
    };
  }

  public  addNewGroupResponse(value: BaseResponse<StockGroupResponse, StockGroupRequest>): Action {
    return {
      type: InventoryActionsConst.AddNewGroupResponse,
      payload: value
    };
  }

  public updateGroup(value: StockGroupRequest, stockGroupUniquename: string): Action {
    return {
      type: InventoryActionsConst.UpdateGroup,
      payload: {body: value, stockGroupUniquename }
    };
  }

  public  updateGroupResponse(value: BaseResponse<StockGroupResponse, StockGroupRequest>): Action {
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

  public  removeGroupResponse(value: BaseResponse<string, string>): Action {
    return {
      type: InventoryActionsConst.RemoveGroupResponse,
      payload: value
    };
  }

  public resetActiveGroup(): Action {
    return {
      type: InventoryActionsConst.ResetActiveGroup
    };
  }
}
