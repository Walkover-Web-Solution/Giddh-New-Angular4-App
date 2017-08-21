/**
 * Created by ad on 04-07-2017.
 */

import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../../toaster.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { Observable } from 'rxjs/Rx';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { SalesService } from '../../sales.service';
import { SALES_ACTIONS } from './sales.const';
import { Router } from '@angular/router';

@Injectable()
export class SalesActions {

  // @Effect()
  // private GetAllPages$: Observable<Action> = this.action$
  //   .ofType(SALES_ACTIONS.GET)
  //   .switchMap(action => this._permissionService.GetAllPageNames())
  //   .map(response => {
  //     return this.GetAllPagesResponse(response);
  //   });

  constructor(private action$: Actions,
    private _toasty: ToasterService,
    private _router: Router,
    private store: Store<AppState>,
    private _salesService: SalesService) {
  }

  public Get(): Action {
    return {
      type: SALES_ACTIONS.GET,
    };
  }

  public GetResponse(value: any): Action {
    return {
      type: SALES_ACTIONS.GET_RESPONSE,
      payload: value
    };
  }

  private validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: Action, showToast: boolean = false, errorAction: Action = { type: '' }): Action {
    if (response.status === 'error') {
      if (showToast) {
        this._toasty.errorToast(response.message);
      }
      return errorAction;
    }
    return successAction;
  }
}
