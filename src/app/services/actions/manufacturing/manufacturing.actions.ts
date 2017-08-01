import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { AppState } from '../../../store/roots';
import { MANUFACTURING_ACTIONS } from './manufacturing.const';

@Injectable()
export class ManufacturingActions {

  constructor(private action$: Actions) {}

  public GetStockList(): Action {
    return {
      type: MANUFACTURING_ACTIONS.GET_STOCK_LIST
    };
  }
  public GetStockListResponse(): Action {
    return {
      type: MANUFACTURING_ACTIONS.GET_STOCK_LIST_RESPONSE
    };
  }
  public GetMfItemDetails(): Action {
    return {
      type: MANUFACTURING_ACTIONS.GET_MF_ITEM_DETAILS
    };
  }
  public GetMfItemDetailsResponse(): Action {
    return {
      type: MANUFACTURING_ACTIONS.GET_MF_ITEM_DETAILS_RESPONSE
    };
  }
  public CreateMfItem(value): Action {
    return {
      type: MANUFACTURING_ACTIONS.CREATE_MF_ITEM,
      payload: value
    };
  }
  public CreateMfItemResponse(): Action {
    return {
      type: MANUFACTURING_ACTIONS.CREATE_MF_ITEM_RESPONSE
    };
  }
  public UpdateMfItem(): Action {
    return {
      type: MANUFACTURING_ACTIONS.UPDATE_MF_ITEM
    };
  }
  public UpdateMfItemResponse(): Action {
    return {
      type: MANUFACTURING_ACTIONS.UPDATE_MF_ITEM_RESPONSE
    };
  }
  public DeleteMfItem(): Action {
    return {
      type: MANUFACTURING_ACTIONS.DELETE_MF_ITEM
    };
  }
  public DeleteMfItemResponse(): Action {
    return {
      type: MANUFACTURING_ACTIONS.DELETE_MF_ITEM_RESPONSE
    };
  }
}
