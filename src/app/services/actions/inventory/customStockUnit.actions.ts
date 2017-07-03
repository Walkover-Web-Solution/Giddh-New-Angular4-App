import { StockUnitRequest } from '../../../models/api-models/Inventory';
import { CUSTOM_STOCK_UNIT_ACTIONS } from './inventory.const';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../../toaster.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { Observable } from 'rxjs/Rx';
import { InventoryService } from '../../inventory.service';
import { BaseResponse } from '../../../models/api-models/BaseResponse';

@Injectable()
export class CustomStockUnitAction {
  @Effect() private CreateStockUnit$: Observable<Action> = this.action$
    .ofType(CUSTOM_STOCK_UNIT_ACTIONS.CREATE_STOCK_UNIT)
    .switchMap(action => {
      return this._inventoryService.CreateStockUnit(action.payload)
        .map((r) => this.validateResponse(r, {
          type: CUSTOM_STOCK_UNIT_ACTIONS.CREATE_STOCK_UNIT_RESPONSE,
          payload: action.payload
        }, true));
    });

  @Effect() private GetStockUnit$: Observable<Action> = this.action$
    .ofType(CUSTOM_STOCK_UNIT_ACTIONS.GET_STOCK_UNIT)
    .switchMap(action => {
      return this._inventoryService.GetStockUnit()
        .map((r) => this.validateResponse(r, {
          type: CUSTOM_STOCK_UNIT_ACTIONS.GET_STOCK_UNIT_RESPONSE,
          payload: r.body
        }));
    });

  @Effect() private UpdateStockUnit$: Observable<Action> = this.action$
    .ofType(CUSTOM_STOCK_UNIT_ACTIONS.UPDATE_STOCK_UNIT)
    .switchMap(action => {
      return this._inventoryService.UpdateStockUnit(action.payload.unit, action.payload.code)
        .map((r) => this.validateResponse(r, {
          type: CUSTOM_STOCK_UNIT_ACTIONS.UPDATE_STOCK_UNIT_RESPONSE,
          payload: action.payload
        }, true));
    });

  @Effect() private DeleteStockUnit$: Observable<Action> = this.action$
    .ofType(CUSTOM_STOCK_UNIT_ACTIONS.DELETE_STOCK_UNIT)
    .switchMap(action => {
      return this._inventoryService.DeleteStockUnit(action.payload)
        .map((r) => this.validateResponse(r, {
          type: CUSTOM_STOCK_UNIT_ACTIONS.DELETE_STOCK_UNIT_RESPONSE,
          payload: action.payload
        }));
    });

  constructor(private action$: Actions,
              private _toasty: ToasterService,
              private store: Store<AppState>,
              private  _inventoryService: InventoryService) {
  }

  public CreateStockUnit(unit: StockUnitRequest): Action {
    return {
      type: CUSTOM_STOCK_UNIT_ACTIONS.CREATE_STOCK_UNIT,
      payload: unit
    };
  }

  public UpdateStockUnit(unit: StockUnitRequest, code: string): Action {
    return {
      type: CUSTOM_STOCK_UNIT_ACTIONS.UPDATE_STOCK_UNIT,
      payload: { unit, code }
    };
  }

  public DeleteStockUnit(code: string): Action {
    return {
      type: CUSTOM_STOCK_UNIT_ACTIONS.DELETE_STOCK_UNIT,
      payload: code
    };
  }

  public GetStockUnit(): Action {
    return {
      type: CUSTOM_STOCK_UNIT_ACTIONS.GET_STOCK_UNIT,
    };
  }

  private validateResponse(response: BaseResponse<any, any>, successAction: Action, showToast: boolean = false, errorAction: Action = { type: '' }): Action {
    if (response.status === 'error') {
      if (showToast) {
        this._toasty.errorToast(response.message);
      }
      return errorAction;
    }
    return successAction;
  }
}
