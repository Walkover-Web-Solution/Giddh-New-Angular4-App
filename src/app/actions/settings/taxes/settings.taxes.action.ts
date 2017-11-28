import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../../../services/toaster.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { Observable } from 'rxjs/Rx';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { Router } from '@angular/router';
import { SETTINGS_TAXES_ACTIONS } from './settings.taxes.const';
import { SettingsProfileService } from '../../../services/settings.profile.service';
import { SmsKeyClass } from '../../../models/api-models/SettingsIntegraion';
import { SettingsTaxesService } from '../../../services/settings.taxes.service';
import { CustomActions } from '../../../store/customActions';

@Injectable()
export class SettingsTaxesActions {

  @Effect()
  public CreateTax$: Observable<Action> = this.action$
    .ofType(SETTINGS_TAXES_ACTIONS.CREATE_TAX)
    .switchMap((action: CustomActions) => {
      return this.settingsTaxesService.CreateTax(action.payload)
        .map(response => this.CreateTaxResponse(response));
    });

  @Effect()
  public CreateTaxResponse$: Observable<Action> = this.action$
    .ofType(SETTINGS_TAXES_ACTIONS.CREATE_TAX_RESPONSE)
    .map((response: CustomActions) => {
      let data: BaseResponse<any, any> = response.payload;
      if (data.status === 'error') {
        this.toasty.errorToast(data.message, data.code);
      } else {
        this.toasty.successToast('Tax Created Successfully.');
      }
      return { type: 'EmptyAction' };
    });

  @Effect()
  public UpdateTax$: Observable<Action> = this.action$
    .ofType(SETTINGS_TAXES_ACTIONS.UPDATE_TAX)
    .switchMap((action: CustomActions) => {
      return this.settingsTaxesService.UpdateTax(action.payload, action.payload.uniqueName)
        .map(response => this.UpdateTaxResponse(response));
    });

  @Effect()
  public UpdateTaxResponse$: Observable<Action> = this.action$
    .ofType(SETTINGS_TAXES_ACTIONS.UPDATE_TAX_RESPONSE)
    .map((response: CustomActions) => {
      let data: BaseResponse<any, any> = response.payload;
      if (data.status === 'error') {
        this.toasty.errorToast(data.message, data.code);
      } else {
        this.toasty.successToast('Tax Updated Successfully.');
      }
      return { type: 'EmptyAction' };
    });

  @Effect()
  public DeleteTax$: Observable<Action> = this.action$
    .ofType(SETTINGS_TAXES_ACTIONS.DELETE_TAX)
    .switchMap((action: CustomActions) => {
      return this.settingsTaxesService.DeleteTax(action.payload)
        .map(response => this.DeleteTaxResponse(response));
    });

  @Effect()
  public DeleteTaxResponse$: Observable<Action> = this.action$
    .ofType(SETTINGS_TAXES_ACTIONS.DELETE_TAX_RESPONSE)
    .map((response: CustomActions) => {
      let data: BaseResponse<any, any> = response.payload;
      if (data.status === 'error') {
        this.toasty.errorToast(data.message, data.code);
      } else {
        this.toasty.successToast('Tax Deleted Successfully.');
      }
      return { type: 'EmptyAction' };
    });

  constructor(private action$: Actions,
    private toasty: ToasterService,
    private router: Router,
    private store: Store<AppState>,
    private settingsTaxesService: SettingsTaxesService) {
  }

  public CreateTax(value): CustomActions {
    return {
      type: SETTINGS_TAXES_ACTIONS.CREATE_TAX,
      payload: value
    };
  }

  public CreateTaxResponse(value): CustomActions {
    return {
      type: SETTINGS_TAXES_ACTIONS.CREATE_TAX_RESPONSE,
      payload: value
    };
  }

  public UpdateTax(value): CustomActions {
    return {
      type: SETTINGS_TAXES_ACTIONS.UPDATE_TAX,
      payload: value
    };
  }

  public UpdateTaxResponse(value): CustomActions {
    return {
      type: SETTINGS_TAXES_ACTIONS.UPDATE_TAX_RESPONSE,
      payload: value
    };
  }

  public DeleteTax(value: string): CustomActions {
    return {
      type: SETTINGS_TAXES_ACTIONS.DELETE_TAX,
      payload: value
    };
  }

  public DeleteTaxResponse(value): CustomActions {
    return {
      type: SETTINGS_TAXES_ACTIONS.DELETE_TAX_RESPONSE,
      payload: value
    };
  }

  public validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: CustomActions, showToast: boolean = false, errorAction: CustomActions = { type: 'EmptyAction' }): CustomActions {
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
