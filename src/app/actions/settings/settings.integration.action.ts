
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../../services/toaster.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { Observable } from 'rxjs/Observable';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { Router } from '@angular/router';
import { SETTINGS_INTEGRATION_ACTIONS } from './settings.integration.const';
import { SettingsIntegrationService } from '../../services/settings.integraion.service';
import { SmsKeyClass, EmailKeyClass, RazorPayClass, RazorPayDetailsResponse, CashfreeClass } from '../../models/api-models/SettingsIntegraion';
import { CustomActions } from '../../store/customActions';

@Injectable()
export class SettingsIntegrationActions {

  @Effect()
  public GetSMSKey$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.GET_SMS_KEY)
    .switchMap((action: CustomActions) => this.settingsIntegrationService.GetSMSKey())
    .map(res => this.validateResponse<SmsKeyClass, string>(res, {
      type: SETTINGS_INTEGRATION_ACTIONS.GET_SMS_KEY_RESPONSE,
      payload: res
    }, false, {
        type: SETTINGS_INTEGRATION_ACTIONS.GET_SMS_KEY_RESPONSE,
        payload: res
      }));

  @Effect()
  public GetEmailKey$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.GET_EMAIL_KEY)
    .switchMap((action: CustomActions) => this.settingsIntegrationService.GetEmailKey())
    .map(res => this.validateResponse<EmailKeyClass, string>(res, {
      type: SETTINGS_INTEGRATION_ACTIONS.GET_EMAIL_KEY_RESPONSE,
      payload: res
    }, false, {
        type: SETTINGS_INTEGRATION_ACTIONS.GET_EMAIL_KEY_RESPONSE,
        payload: res
      }));

  @Effect()
  public SaveSMSKey$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.CREATE_SMS_KEY)
    .switchMap((action: CustomActions) => this.settingsIntegrationService.SaveSMSKey(action.payload))
    .map(res => this.validateResponse<string, SmsKeyClass>(res, {
      type: SETTINGS_INTEGRATION_ACTIONS.CREATE_SMS_KEY_RESPONSE,
      payload: res
    }, true, {
        type: SETTINGS_INTEGRATION_ACTIONS.CREATE_SMS_KEY_RESPONSE,
        payload: res
      }));

  @Effect()
  public SaveEmailKey$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.CREATE_EMAIL_KEY)
    .switchMap((action: CustomActions) => this.settingsIntegrationService.SaveEmailKey(action.payload))
    .map(res => this.validateResponse<string, EmailKeyClass>(res, {
      type: SETTINGS_INTEGRATION_ACTIONS.CREATE_EMAIL_KEY_RESPONSE,
      payload: res
    }, true, {
        type: SETTINGS_INTEGRATION_ACTIONS.CREATE_EMAIL_KEY_RESPONSE,
        payload: res
      }));

  @Effect()
  public GetRazorPayDetails$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.GET_RAZOR_PAY_DETAILS)
    .switchMap((action: CustomActions) => this.settingsIntegrationService.GetRazorPayDetails())
    .map(res => this.validateResponse<RazorPayDetailsResponse, string>(res, {
      type: SETTINGS_INTEGRATION_ACTIONS.GET_RAZOR_PAY_DETAILS_RESPONSE,
      payload: res
    }, false, {
        type: SETTINGS_INTEGRATION_ACTIONS.GET_RAZOR_PAY_DETAILS_RESPONSE,
        payload: res
      }));

  @Effect()
  public SaveRazorPayDetails$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.SAVE_RAZOR_PAY_DETAILS)
    .switchMap((action: CustomActions) => this.settingsIntegrationService.SaveRazorPayDetails(action.payload))
    .map(res => this.validateResponse<RazorPayDetailsResponse, RazorPayClass>(res, {
      type: SETTINGS_INTEGRATION_ACTIONS.SAVE_RAZOR_PAY_DETAILS_RESPONSE,
      payload: res
    }, true, {
        type: SETTINGS_INTEGRATION_ACTIONS.SAVE_RAZOR_PAY_DETAILS_RESPONSE,
        payload: res
      }));

  @Effect()
  public DeleteRazorPayDetails$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.DELETE_RAZOR_PAY_DETAILS)
    .switchMap((action: CustomActions) => this.settingsIntegrationService.DeleteRazorPayDetails())
    .map(res => this.validateResponse<string, string>(res, {
      type: SETTINGS_INTEGRATION_ACTIONS.DELETE_RAZOR_PAY_DETAILS_RESPONSE,
      payload: res
    }, true, {
        type: SETTINGS_INTEGRATION_ACTIONS.DELETE_RAZOR_PAY_DETAILS_RESPONSE,
        payload: res
      }));

  @Effect()
  public UpdateRazorPayDetails$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_RAZOR_PAY_DETAILS)
    .switchMap((action: CustomActions) => this.settingsIntegrationService.UpdateRazorPayDetails(action.payload))
    .map(res => this.validateResponse<RazorPayDetailsResponse, RazorPayClass>(res, {
      type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_RAZOR_PAY_DETAILS_RESPONSE,
      payload: res
    }, true, {
        type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_RAZOR_PAY_DETAILS_RESPONSE,
        payload: res
      }));

  @Effect()
  public SaveCashfreeDetails$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.SAVE_CASHFREE_DETAILS)
    .switchMap((action: CustomActions) => this.settingsIntegrationService.SaveCashFreeDetail(action.payload))
    .map(response => this.SaveCashfreeDetailsResponse(response));

  @Effect()
  public SaveCashfreeDetailsResponse$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.SAVE_CASHFREE_DETAILS_RESPONSE)
    .map((response: CustomActions) => {
      let data: BaseResponse<any, any> = response.payload;
      if (data.status === 'error') {
        this.toasty.clearAllToaster();
        this.toasty.errorToast(data.message, data.code);
      } else {
        this.toasty.successToast('CashFree Account has been successfully saved');
      }
      return { type: 'EmptyAction' };
    });

  @Effect()
  public DeleteCashfreeDetails$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.DELETE_CASHFREE_DETAILS)
    .switchMap((action: CustomActions) => this.settingsIntegrationService.DeleteCashFreeDetail())
    .map(response => this.DeleteCashfreeDetailsResponse(response));

  @Effect()
  public DeleteCashfreeDetailsResponse$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.DELETE_CASHFREE_DETAILS_RESPONSE)
    .map((response: CustomActions) => {
      let data: BaseResponse<string, string> = response.payload;
      if (data.status === 'error') {
        this.toasty.errorToast(data.message, data.code);
      } else {
        this.toasty.successToast(data.body, '');
      }
      return { type: 'EmptyAction' };
    });

  constructor(private action$: Actions,
    private toasty: ToasterService,
    private router: Router,
    private store: Store<AppState>,
    private settingsIntegrationService: SettingsIntegrationService) {
  }

  public GetSMSKey(): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.GET_SMS_KEY,
    };
  }

  public GetEmailKey(): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.GET_EMAIL_KEY,
    };
  }

  public SaveSMSKey(value: SmsKeyClass): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.CREATE_SMS_KEY,
      payload: value
    };
  }

  public SaveEmailKey(value: EmailKeyClass): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.CREATE_EMAIL_KEY,
      payload: value
    };
  }

  public GetRazorPayDetails(): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.GET_RAZOR_PAY_DETAILS,
    };
  }

  public SaveRazorPayDetails(value: RazorPayClass): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.SAVE_RAZOR_PAY_DETAILS,
      payload: value
    };
  }

  public DeleteRazorPayDetails(): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.DELETE_RAZOR_PAY_DETAILS,
    };
  }

  public UpdateRazorPayDetails(value: RazorPayClass): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_RAZOR_PAY_DETAILS,
      payload: value
    };
  }

  public SaveCashfreeDetails(value: CashfreeClass): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.SAVE_RAZOR_PAY_DETAILS,
      payload: value
    };
  }

  public SaveCashfreeDetailsResponse(res): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.SAVE_CASHFREE_DETAILS_RESPONSE,
      payload: res
    };
  }

  public DeleteCashfreeDetails(): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.DELETE_CASHFREE_DETAILS,
    };
  }

  public DeleteCashfreeDetailsResponse(res): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.DELETE_CASHFREE_DETAILS_RESPONSE,
      payload: res
    };
  }

  public AddAutoCollectUser(value: CashfreeClass): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.ADD_AUTOCOLLECT_USER,
      payload: value
    };
  }

  public AddAutoCollectUserResponse(res): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.ADD_AUTOCOLLECT_USER_RESPONSE,
      payload: res
    };
  }

  public UpdateAutoCollectUser(value: CashfreeClass): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_AUTOCOLLECT_USER,
      payload: value
    };
  }

  public UpdateAutoCollectUserResponse(res): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_AUTOCOLLECT_USER_RESPONSE,
      payload: res
    };
  }

  public DeleteAutoCollectUser(): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.DELETE_AUTOCOLLECT_USER,
    };
  }

  public DeleteAutoCollectUserResponse(res): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.DELETE_AUTOCOLLECT_USER_RESPONSE,
      payload: res
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
