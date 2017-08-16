import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../../../toaster.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../../../store/roots';
import { Observable } from 'rxjs/Rx';
import { BaseResponse } from '../../../../models/api-models/BaseResponse';
import { Router } from '@angular/router';
import { SETTINGS_PROFILE_ACTIONS } from './settings.profile.const';
import { SettingsProfileService } from '../../../settings.profile.service';
import { SmsKeyClass } from '../../../../models/api-models/SettingsIntegraion';

@Injectable()
export class SettingsProfileActions {

 @Effect()
  public GetSMSKey$: Observable<Action> = this.action$
    .ofType(SETTINGS_PROFILE_ACTIONS.GET_PROFILE_INFO)
    .switchMap(action => this.settingsProfileService.GetProfileInfo())
    .map(res => this.validateResponse<any, string>(res, {
      type: SETTINGS_PROFILE_ACTIONS.GET_PROFILE_RESPONSE,
      payload: res
    }, true, {
      type: SETTINGS_PROFILE_ACTIONS.GET_PROFILE_RESPONSE,
      payload: res
    }));

  @Effect()
  public UpdateProfile$: Observable<Action> = this.action$
    .ofType(SETTINGS_PROFILE_ACTIONS.UPDATE_PROFILE)
    .switchMap(action => {
      return this.settingsProfileService.UpdateProfile(action.payload)
        .map(response => this.UpdateProfileResponse(response));
    });

  @Effect()
  private UpdateProfileResponse$: Observable<Action> = this.action$
    .ofType(SETTINGS_PROFILE_ACTIONS.UPDATE_PROFILE_RESPONSE)
    .map(response => {
      let data: BaseResponse<any, any> = response.payload;
      if (data.status === 'error') {
        this.toasty.errorToast(data.message, data.code);
      } else {
        this.toasty.successToast('Profile Updated Successfully.');
      }
      return { type: '' };
    });

  constructor(private action$: Actions,
    private toasty: ToasterService,
    private router: Router,
    private store: Store<AppState>,
    private settingsProfileService: SettingsProfileService) {
  }

  public GetProfileInfo(): Action {
    return {
      type: SETTINGS_PROFILE_ACTIONS.GET_PROFILE_INFO,
    };
  }

  public UpdateProfile(value): Action {
    return {
      type: SETTINGS_PROFILE_ACTIONS.UPDATE_PROFILE,
      payload: value
    };
  }

  public UpdateProfileResponse(value): Action {
    return {
      type: SETTINGS_PROFILE_ACTIONS.UPDATE_PROFILE_RESPONSE,
      payload: value
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
