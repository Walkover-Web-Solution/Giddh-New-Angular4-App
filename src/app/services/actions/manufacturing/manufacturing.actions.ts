import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { AppState } from '../../../store/roots';

const MANUFACTURING_ACTIONS = {
  GET_STOCK_LIST: 'GET_STOCK_LIST',
  GET_STOCK_LIST_LOADED: 'GET_STOCK_LIST_LOADED'
};

@Injectable()



export class ManufacturingActions {

  // @Effect()
  // private AllPages$: Observable<Action> = this.action$
  //   .ofType(MANUFACTURING_ACTIONS.GET_STOCK_LIST)
  //   .switchMap(action => {
  //     return this._eledgerService.GetAllPageNames()
  //       .map((r) => {
  //         return this.validateResponse<LoadAllPageNamesResponse[], string>(r, {
  //           type: MANUFACTURING_ACTIONS.GET_STOCK_LIST_LOADED,
  //           payload: r
  //         }, true, {
  //             type: MANUFACTURING_ACTIONS.GET_STOCK_LIST_LOADED,
  //             payload: r
  //           });
  //       });
  //   });
  constructor(private action$: Actions) {}

  public GetStockList(): Action {
    return {
      type: MANUFACTURING_ACTIONS.GET_STOCK_LIST
    };
  }
}
