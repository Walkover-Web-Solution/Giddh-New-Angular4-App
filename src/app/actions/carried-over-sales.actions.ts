import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { CarriedOverSalesService } from '../services/carried-over-sales.service';
import { ToasterService } from '../services/toaster.service';
import { AppState } from '../store';
import { GeneralService } from '../services/general.service';
import { CustomActions } from '../store/customActions';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { CarriedOverSalesRequest, CarriedOverSalesResponse } from '../models/api-models/carried-over-sales';

@Injectable()
export class CarriedOverSalesActions {
  public static GET_CARRIED_SALES_REQUEST = 'GET_CARRIED_SALES_REQUEST';
  public static GET_CARRIED_SALES_RESPONSE = 'GET_CARRIED_SALES_RESPONSE';
  public static GET_NULL = 'GET_NULL';

  @Effect()
  private getCarriedOverSalesResponse$: Observable<Action> = this.action$
    .ofType(CarriedOverSalesActions.GET_CARRIED_SALES_REQUEST).pipe(
      switchMap((action: CustomActions) => {
        return this._carriedService.GetCarriedOverSales(action.payload.queryRequest).pipe(
          map((r) => this.validateResponse<CarriedOverSalesResponse, string>(r, {
            type: CarriedOverSalesActions.GET_CARRIED_SALES_RESPONSE,
            payload: r.body
          }, true, {
            type: CarriedOverSalesActions.GET_CARRIED_SALES_RESPONSE,
            payload: null
          })));
      }));

  constructor(private action$: Actions, private _carriedService: CarriedOverSalesService,
              private _toasty: ToasterService, private store: Store<AppState>, private _generalService: GeneralService) {
  }

  public GetCarriedOverSalesRequest(queryRequest: CarriedOverSalesRequest): CustomActions {
    return {
      type: CarriedOverSalesActions.GET_CARRIED_SALES_REQUEST,
      payload: {queryRequest}
    };
  }

  public GetResponseNull(): CustomActions {
    return {
      type: CarriedOverSalesActions.GET_NULL
    };
  }

  private validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: CustomActions, showToast: boolean = false, errorAction: CustomActions = {type: 'EmptyAction'}): CustomActions {
    if (response.status === 'error') {
      if (showToast) {
        this._toasty.errorToast(response.message);
      }
      return errorAction;
    }
    return successAction;
  }
}
