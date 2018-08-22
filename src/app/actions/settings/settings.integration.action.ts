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
import { CashfreeClass, EmailKeyClass, RazorPayClass, RazorPayDetailsResponse, SmsKeyClass, AmazonSellerClass } from '../../models/api-models/SettingsIntegraion';
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
        this.toasty.successToast(data.body, '');
      }
      return {type: 'EmptyAction'};
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
      return {type: 'EmptyAction'};
    });

  @Effect()
  public AddAutoCollectUser$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.ADD_AUTOCOLLECT_USER)
    .switchMap((action: CustomActions) => this.settingsIntegrationService.AddAutoCollectUser(action.payload))
    .map(response => this.AddAutoCollectUserResponse(response));

  @Effect()
  public AddAutoCollectUserResponse$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.ADD_AUTOCOLLECT_USER_RESPONSE)
    .map((response: CustomActions) => {
      let data: BaseResponse<any, any> = response.payload;
      if (data.status === 'error') {
        this.toasty.clearAllToaster();
        this.toasty.errorToast(data.message, data.code);
      } else {
        this.toasty.successToast(data.body, '');
      }
      return {type: 'EmptyAction'};
    });

  @Effect()
  public DeleteAutoCollectUser$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.DELETE_AUTOCOLLECT_USER)
    .switchMap((action: CustomActions) => this.settingsIntegrationService.DeleteAutoCollectUser())
    .map(response => this.DeleteAutoCollectUserResponse(response));

  @Effect()
  public DeleteAutoCollectUserResponse$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.DELETE_AUTOCOLLECT_USER_RESPONSE)
    .map((response: CustomActions) => {
      let data: BaseResponse<any, any> = response.payload;
      if (data.status === 'error') {
        this.toasty.clearAllToaster();
        this.toasty.errorToast(data.message, data.code);
      } else {
        this.toasty.successToast(data.message, '');
      }
      return {type: 'EmptyAction'};
    });

  @Effect()
  public GetCashfreeDetails$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.GET_CASHFREE_DETAILS)
    .switchMap((action: CustomActions) => this.settingsIntegrationService.GetCashFreeDetail())
    .map(response => this.GetCashfreeDetailsResponse(response));

  @Effect()
  public GetCashfreeDetailsResponse$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.GET_CASHFREE_DETAILS_RESPONSE)
    .map((response: CustomActions) => {
      let data: BaseResponse<any, any> = response.payload;
      return {type: 'EmptyAction'};
    });

  @Effect()
  public GetAutoCollectDetails$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.GET_AUTOCOLLECT_USER)
    .switchMap((action: CustomActions) => this.settingsIntegrationService.GetAutoCollectUser())
    .map(response => this.GetAutoCollectDetailsResponse(response));

  @Effect()
  public GetAutoCollectDetailsResponse$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.GET_AUTOCOLLECT_USER_RESPONSE)
    .map((response: CustomActions) => {
      let data: BaseResponse<any, any> = response.payload;
      return {type: 'EmptyAction'};
    });

  @Effect()
  public UpdateCashfreeDetails$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_CASHFREE_DETAILS)
    .switchMap((action: CustomActions) => this.settingsIntegrationService.UpdateCashFreeDetail(action.payload))
    .map(response => this.UpdateCashfreeDetailsResponse(response));

  @Effect()
  public UpdateCashfreeDetailsResponse$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_CASHFREE_DETAILS_RESPONSE)
    .map((response: CustomActions) => {
      let data: BaseResponse<any, any> = response.payload;
      if (data.status === 'error') {
        this.toasty.clearAllToaster();
        this.toasty.errorToast(data.message, data.code);
      } else {
        // console.log(data);
        this.toasty.successToast(data.body, '');
      }
      return {type: 'EmptyAction'};
    });

  @Effect()
  public GetPaymentGateway$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.GET_PAYMENT_GATEWAY)
    .switchMap((action: CustomActions) => this.settingsIntegrationService.GetPaymentGateway())
    .map(response => this.GetPaymentGatewayResponse(response));

  @Effect()
  public GetPaymentGatewayResponse$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.GET_PAYMENT_GATEWAY_RESPONSE)
    .map((response: CustomActions) => {
      let data: BaseResponse<any, any> = response.payload;
      return {type: 'EmptyAction'};
    });

  @Effect()
  public AddPaymentGateway$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.ADD_PAYMENT_GATEWAY)
    .switchMap((action: CustomActions) => this.settingsIntegrationService.AddPaymentGateway(action.payload))
    .map(response => this.AddPaymentGatewayResponse(response));

  @Effect()
  public AddPaymentGatewayResponse$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.ADD_PAYMENT_GATEWAY_RESPONSE)
    .map((response: CustomActions) => {
      let data: BaseResponse<any, any> = response.payload;
      if (data.status === 'error') {
        this.toasty.errorToast(data.message, data.code);
      } else {
        this.toasty.successToast(data.body, '');
      }
      return {type: 'EmptyAction'};
    });

  @Effect()
  public UpdatePaymentGateway$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_PAYMENT_GATEWAY)
    .switchMap((action: CustomActions) => this.settingsIntegrationService.UpdatePaymentGateway(action.payload))
    .map(response => this.UpdatePaymentGatewayResponse(response));

  @Effect()
  public UpdatePaymentGatewayResponse$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_PAYMENT_GATEWAY_RESPONSE)
    .map((response: CustomActions) => {
      let data: BaseResponse<any, any> = response.payload;
      if (data.status === 'error') {
        this.toasty.errorToast(data.message, data.code);
      } else {
        // console.log(data);
        this.toasty.successToast(data.body, '');
      }
      return {type: 'EmptyAction'};
    });

  @Effect()
  public DeletePaymentGateway$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.DELETE_PAYMENT_GATEWAY)
    .switchMap((action: CustomActions) => this.settingsIntegrationService.DeletePaymentGateway())
    .map(response => this.DeletePaymentGatewayResponse(response));

  @Effect()
  public DeletePaymentGatewayResponse$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.DELETE_PAYMENT_GATEWAY_RESPONSE)
    .map((response: CustomActions) => {
      let data: BaseResponse<any, any> = response.payload;
      if (data.status === 'error') {
        this.toasty.errorToast(data.message, data.code);
      } else {
        // console.log(data);
        this.toasty.successToast(data.body, '');
      }
      return {type: 'EmptyAction'};
    });

  @Effect()
  public UpdateAutoCollectUser$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_AUTOCOLLECT_USER)
    .switchMap((action: CustomActions) => this.settingsIntegrationService.UpdateAutoCollectUser(action.payload))
    .map(response => this.UpdateAutoCollectUserResponse(response));

  @Effect()
  public UpdateAutoCollectUserResponse$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_AUTOCOLLECT_USER_RESPONSE)
    .map((response: CustomActions) => {
      let data: BaseResponse<any, any> = response.payload;
      if (data.status === 'error') {
        this.toasty.errorToast(data.message, data.code);
      } else {
        // console.log(data);
        // this.toasty.successToast(data.body, '');
      }
      return {type: 'EmptyAction'};
    });

  @Effect()
  public AddAmazonSeller$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.ADD_AMAZON_SELLER)
    .switchMap((action: CustomActions) => this.settingsIntegrationService.AddAmazonSeller(action.payload))
    .map(response => this.AddAmazonSellerResponse(response.body));

  @Effect()
  public AddAmazonSellerResponse$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.ADD_PAYMENT_GATEWAY_RESPONSE)
    .map((response: CustomActions) => {
      let data: BaseResponse<any, any> = response.payload;
      if (data.status === 'error') {
        this.toasty.errorToast(data.message, data.code);
      } else {
        this.toasty.successToast(data.body, '');
      }
      return {type: 'EmptyAction'};
    });

  @Effect()
  public DeleteAmazonSeller$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.DELETE_AMAZON_SELLER)
    .switchMap((action: CustomActions) => this.settingsIntegrationService.DeletePaymentGateway())
    .map(response => this.DeleteAmazonSellerResponse(response));

  @Effect()
  public DeleteAmazonSellerResponse$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.DELETE_AMAZON_SELLER_RESPONSE)
    .map((response: CustomActions) => {
      let data: BaseResponse<any, any> = response.payload;
      if (data.status === 'error') {
        this.toasty.errorToast(data.message, data.code);
      } else {
        // console.log(data);
        this.toasty.successToast(data.body, '');
      }
      return {type: 'EmptyAction'};
    });

  @Effect()
  public GetAmazonSeller$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.GET_AMAZON_SELLER)
    .switchMap((action: CustomActions) => this.settingsIntegrationService.GetAmazonSeller())
    .map(response => this.GetPaymentGatewayResponse(response));

  @Effect()
  public GetAmazonSellerResponse$: Observable<Action> = this.action$
    .ofType(SETTINGS_INTEGRATION_ACTIONS.GET_AMAZON_SELLER_RESPONSE)
    .map((response: CustomActions) => {
      let data: BaseResponse<any, any> = response.payload;
      return {type: 'EmptyAction'};
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
      type: SETTINGS_INTEGRATION_ACTIONS.SAVE_CASHFREE_DETAILS,
      payload: value
    };
  }

  public SaveCashfreeDetailsResponse(res): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.SAVE_CASHFREE_DETAILS_RESPONSE,
      payload: res
    };
  }

  public UpdateCashfreeDetails(value: CashfreeClass): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_CASHFREE_DETAILS,
      payload: value
    };
  }

  public UpdateCashfreeDetailsResponse(res): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_CASHFREE_DETAILS_RESPONSE,
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

  public GetCashfreeDetails(): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.GET_CASHFREE_DETAILS,
    };
  }

  public GetCashfreeDetailsResponse(models): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.GET_CASHFREE_DETAILS_RESPONSE,
      payload: models
    };
  }

  public GetAutoCollectDetails(): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.GET_AUTOCOLLECT_USER,
    };
  }

  public GetAutoCollectDetailsResponse(models): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.GET_AUTOCOLLECT_USER_RESPONSE,
      payload: models
    };
  }

  public GetPaymentGateway(): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.GET_PAYMENT_GATEWAY,
    };
  }

  public GetPaymentGatewayResponse(models): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.GET_PAYMENT_GATEWAY_RESPONSE,
      payload: models
    };
  }

  public AddPaymentGateway(models): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.ADD_PAYMENT_GATEWAY,
      payload: models
    };
  }

  public AddPaymentGatewayResponse(models): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.ADD_PAYMENT_GATEWAY_RESPONSE,
      payload: models
    };
  }

  public UpdatePaymentGateway(models): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_PAYMENT_GATEWAY,
      payload: models
    };
  }

  public UpdatePaymentGatewayResponse(models): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_PAYMENT_GATEWAY_RESPONSE,
      payload: models
    };
  }

  public DeletePaymentGateway(): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.DELETE_PAYMENT_GATEWAY,
    };
  }

  public DeletePaymentGatewayResponse(models): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.DELETE_PAYMENT_GATEWAY_RESPONSE,
      payload: models
    };
  }

  public GetAmazonSellers(): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.GET_AMAZON_SELLER,
    };
  }

  public GetAmazonSellersResponse(models): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.GET_AMAZON_SELLER_RESPONSE,
      payload: models
    };
  }

  public AddAmazonSeller(models: AmazonSellerClass[]): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.ADD_AMAZON_SELLER,
      payload: models
    };
  }

  public AddAmazonSellerResponse(models: AmazonSellerClass[]): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.ADD_AMAZON_SELLER_RESPONSE,
      payload: models
    };
  }

  public UpdateAmazonSeller(models: AmazonSellerClass[]): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_AMAZON_SELLER,
      payload: models
    };
  }

  public UpdateAmazonSellerResponse(models: AmazonSellerClass[]): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_AMAZON_SELLER_RESPONSE,
      payload: models
    };
  }

  public DeleteAmazonSeller(): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.DELETE_AMAZON_SELLER,
    };
  }

  public DeleteAmazonSellerResponse(models): CustomActions {
    return {
      type: SETTINGS_INTEGRATION_ACTIONS.DELETE_AMAZON_SELLER_RESPONSE,
      payload: models
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
