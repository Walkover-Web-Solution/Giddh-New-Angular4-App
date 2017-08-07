
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../../toaster.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { Observable } from 'rxjs/Rx';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { Router } from '@angular/router';
import { SETTINGS_INTEGRATION_ACTIONS } from './settings.integration.const';
import { SettingsIntegrationService } from '../../settings.integraion.service';
import { SmsKeyClass } from '../../../models/api-models/SettingsIntegraion';

@Injectable()
export class SettingsIntegrationActions {

  @Effect()
  public GetSMSKey$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.GET_SMS_KEY)
    .switchMap(action => this.settingsIntegrationService.GetSMSKey())
    .map(res => this.validateResponse<SmsKeyClass, string>(res, {
      type: SETTINGS_INTEGRATION_ACTIONS.GET_SMS_KEY_RESPONSE,
      payload: res
    }, true, {
      type: SETTINGS_INTEGRATION_ACTIONS.GET_SMS_KEY_RESPONSE,
      payload: res
    }));

  constructor(private action$: Actions,
    private toasty: ToasterService,
    private router: Router,
    private store: Store<AppState>,
    private settingsIntegrationService: SettingsIntegrationService) {
  }

  public GetSMSKey(): Action {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.GET_SMS_KEY,
    };
  }

  public validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: Action, showToast: boolean = false, errorAction: Action = {type: ''}): Action {
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
