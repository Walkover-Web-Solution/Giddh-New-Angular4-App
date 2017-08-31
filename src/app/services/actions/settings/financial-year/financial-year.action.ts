import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../../../toaster.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../../../store/roots';
import { Observable } from 'rxjs/Rx';
import { BaseResponse } from '../../../../models/api-models/BaseResponse';
import { Router } from '@angular/router';
import { SettingsProfileService } from '../../../settings.profile.service';
import { SmsKeyClass } from '../../../../models/api-models/SettingsIntegraion';
import { SETTINGS_FINANCIAL_YEAR_ACTIONS } from './financial-year.const';

@Injectable()
export class SettingsFinancialYearActions {

  constructor(private action$: Actions,
    private toasty: ToasterService,
    private router: Router,
    private store: Store<AppState>,
    private settingsProfileService: SettingsProfileService) {
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
