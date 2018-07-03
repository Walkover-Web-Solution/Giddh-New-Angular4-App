import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../../../services/toaster.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { Observable } from 'rxjs/Observable';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { Router } from '@angular/router';
import { CustomActions } from '../../../store/customActions';
import { SETTINGS_DISCOUNT_ACTIONS } from './settings.discount.const';
import { SettingsDiscountService } from '../../../services/settings.discount.service';
import { IDiscountList } from '../../../models/api-models/SettingsDiscount';

@Injectable()
export class SettingsDiscountActions {

  @Effect()
  public GetDiscount$: Observable<Action> = this.action$
    .ofType(SETTINGS_DISCOUNT_ACTIONS.GET_DISCOUNT)
    .switchMap((action: CustomActions) => {
      return this.settingsDiscountService.GetDiscounts()
        .map(response => this.validateResponse<IDiscountList, string>(response, {
          type: SETTINGS_DISCOUNT_ACTIONS.GET_DISCOUNT_RESPONSE,
          payload: response.body
        }, true, {
          type: SETTINGS_DISCOUNT_ACTIONS.GET_DISCOUNT_RESPONSE,
          payload: []
        }));
    });

  @Effect()
  public CreateDiscount$: Observable<Action> = this.action$
    .ofType(SETTINGS_DISCOUNT_ACTIONS.CREATE_DISCOUNT)
    .switchMap((action: CustomActions) => {
      return this.settingsDiscountService.CreateDiscount(action.payload)
        .map(response => this.CreateDiscountResponse(response));
    });

  @Effect()
  public CreateDiscountResponse$: Observable<Action> = this.action$
    .ofType(SETTINGS_DISCOUNT_ACTIONS.CREATE_DISCOUNT_RESPONSE)
    .map((response: CustomActions) => {
      let data: BaseResponse<any, any> = response.payload;
      if (data.status === 'error') {
        this.toasty.errorToast(data.message, data.code);
      } else {
        this.toasty.successToast('Tax Created Successfully.');
      }
      return {type: 'EmptyAction'};
    });

  @Effect()
  public UpdateDiscount$: Observable<Action> = this.action$
    .ofType(SETTINGS_DISCOUNT_ACTIONS.UPDATE_DISCOUNT)
    .switchMap((action: CustomActions) => {
      return this.settingsDiscountService.UpdateDiscount(action.payload, action.payload.uniqueName)
        .map(response => this.UpdateDiscountResponse(response));
    });

  @Effect()
  public UpdateDiscountResponse$: Observable<Action> = this.action$
    .ofType(SETTINGS_DISCOUNT_ACTIONS.UPDATE_DISCOUNT_RESPONSE)
    .map((response: CustomActions) => {
      let data: BaseResponse<any, any> = response.payload;
      if (data.status === 'error') {
        this.toasty.errorToast(data.message, data.code);
      } else {
        this.toasty.successToast('Tax Updated Successfully.');
      }
      return {type: 'EmptyAction'};
    });

  @Effect()
  public DeleteDiscount$: Observable<Action> = this.action$
    .ofType(SETTINGS_DISCOUNT_ACTIONS.DELETE_DISCOUNT)
    .switchMap((action: CustomActions) => {
      return this.settingsDiscountService.DeleteDiscount(action.payload)
        .map(response => this.DeleteDiscountResponse(response));
    });

  @Effect()
  public DeleteDiscountResponse$: Observable<Action> = this.action$
    .ofType(SETTINGS_DISCOUNT_ACTIONS.DELETE_DISCOUNT_RESPONSE)
    .map((response: CustomActions) => {
      let data: BaseResponse<any, any> = response.payload;
      if (data.status === 'error') {
        this.toasty.errorToast(data.message, data.code);
      } else {
        this.toasty.successToast('Tax Deleted Successfully.');
      }
      return {type: 'EmptyAction'};
    });

  constructor(private action$: Actions,
              private toasty: ToasterService,
              private router: Router,
              private store: Store<AppState>,
              private settingsDiscountService: SettingsDiscountService) {
  }

  public GetDiscount(): CustomActions {
    return {
      type: SETTINGS_DISCOUNT_ACTIONS.GET_DISCOUNT,
    };
  }

  public CreateDiscount(value): CustomActions {
    return {
      type: SETTINGS_DISCOUNT_ACTIONS.CREATE_DISCOUNT,
      payload: value
    };
  }

  public CreateDiscountResponse(value): CustomActions {
    return {
      type: SETTINGS_DISCOUNT_ACTIONS.CREATE_DISCOUNT_RESPONSE,
      payload: value
    };
  }

  public UpdateDiscount(value): CustomActions {
    return {
      type: SETTINGS_DISCOUNT_ACTIONS.UPDATE_DISCOUNT,
      payload: value
    };
  }

  public UpdateDiscountResponse(value): CustomActions {
    return {
      type: SETTINGS_DISCOUNT_ACTIONS.UPDATE_DISCOUNT_RESPONSE,
      payload: value
    };
  }

  public DeleteDiscount(value: string): CustomActions {
    return {
      type: SETTINGS_DISCOUNT_ACTIONS.DELETE_DISCOUNT,
      payload: value
    };
  }

  public DeleteDiscountResponse(value): CustomActions {
    return {
      type: SETTINGS_DISCOUNT_ACTIONS.DELETE_DISCOUNT_RESPONSE,
      payload: value
    };
  }

  public validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: CustomActions, showToast: boolean = false, errorAction: CustomActions = {type: 'EmptyAction'}): CustomActions {
    if (response.status === 'error') {
      if (showToast) {
        this.toasty.errorToast(response.message);
      }
      return errorAction;
    } else {
      if (showToast && typeof response.body === 'string') {
        this.toasty.successToast(response.body);
      }
    }
    return successAction;
  }

}
