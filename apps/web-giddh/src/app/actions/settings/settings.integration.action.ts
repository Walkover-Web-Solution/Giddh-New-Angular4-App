import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToasterService } from '../../services/toaster.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { SETTINGS_INTEGRATION_ACTIONS } from './settings.integration.const';
import { SettingsIntegrationService } from '../../services/settings.integraion.service';
import { AmazonSellerClass, CashfreeClass, EmailKeyClass, RazorPayClass, RazorPayDetailsResponse, SmsKeyClass, PaymentClass, PayPalClass, PaypalDetailsResponse } from '../../models/api-models/SettingsIntegraion';
import { CustomActions } from '../../store/custom-actions';
import { CompanyActions } from "../company.actions";
import { LocaleService } from '../../services/locale.service';

@Injectable()
export class SettingsIntegrationActions {

    public GetSMSKey$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.GET_SMS_KEY),
            switchMap((action: CustomActions) => this.settingsIntegrationService.GetSMSKey()),
            map(res => this.validateResponse<SmsKeyClass, string>(res, {
                type: SETTINGS_INTEGRATION_ACTIONS.GET_SMS_KEY_RESPONSE,
                payload: res
            }, false, {
                type: SETTINGS_INTEGRATION_ACTIONS.GET_SMS_KEY_RESPONSE,
                payload: res
            }))));

    public GetEmailKey$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.GET_EMAIL_KEY),
            switchMap((action: CustomActions) => this.settingsIntegrationService.GetEmailKey()),
            map(res => this.validateResponse<EmailKeyClass, string>(res, {
                type: SETTINGS_INTEGRATION_ACTIONS.GET_EMAIL_KEY_RESPONSE,
                payload: res
            }, false, {
                type: SETTINGS_INTEGRATION_ACTIONS.GET_EMAIL_KEY_RESPONSE,
                payload: res
            }))));

    public SaveSMSKey$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.CREATE_SMS_KEY),
            switchMap((action: CustomActions) => this.settingsIntegrationService.SaveSMSKey(action.payload)),
            map(res => this.validateResponse<string, SmsKeyClass>(res, {
                type: SETTINGS_INTEGRATION_ACTIONS.CREATE_SMS_KEY_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_INTEGRATION_ACTIONS.CREATE_SMS_KEY_RESPONSE,
                payload: res
            }))));

    public SaveEmailKey$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.CREATE_EMAIL_KEY),
            switchMap((action: CustomActions) => this.settingsIntegrationService.SaveEmailKey(action.payload)),
            map(res => this.validateResponse<string, EmailKeyClass>(res, {
                type: SETTINGS_INTEGRATION_ACTIONS.CREATE_EMAIL_KEY_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_INTEGRATION_ACTIONS.CREATE_EMAIL_KEY_RESPONSE,
                payload: res
            }))));

    public SavePaymentKey$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.CREATE_PAYMENT_KEY),
            switchMap((action: CustomActions) => this.settingsIntegrationService.SavePaymentKey(action.payload)),
            map(res => this.validateResponse<string, PaymentClass>(res, {
                type: SETTINGS_INTEGRATION_ACTIONS.CREATE_PAYMENT_KEY_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_INTEGRATION_ACTIONS.CREATE_PAYMENT_KEY_RESPONSE,
                payload: res
            }))));

    public SavePaymentKeyResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.CREATE_PAYMENT_KEY_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<string, string> | any = response.payload;
                if (data?.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.store.dispatch(this._companyAction.getAllRegistrations());
                    this.toasty.successToast(data.message || data?.body?.Message);
                }
                return { type: 'EmptyAction' };
            })));

    public UpdatePaymentKey$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_PAYMENT_KEY),
            switchMap((action: CustomActions) => this.settingsIntegrationService.updatePaymentKey(action.payload)),
            map(res => this.validateResponse<any, PaymentClass>(res, {
                type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_PAYMENT_KEY_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_PAYMENT_KEY_RESPONSE,
                payload: res
            }))));

    public UpdatePaymentKeyResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_PAYMENT_KEY_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<any, string> = response.payload;
                if (data?.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.store.dispatch(this._companyAction.getAllRegistrations());
                    this.toasty.successToast(data.body?.message);
                }
                return { type: 'EmptyAction' };
            })));

    /**
     * This will be use for get paypal details
     *
     * @type {Observable<Action>}
     * @memberof SettingsIntegrationActions
     */
    public getPaypalDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.GET_PAYPAL_DETAILS),
            switchMap((action: CustomActions) => this.settingsIntegrationService.getPaypalDetails()),
            map(res => this.validateResponse<PaypalDetailsResponse, string>(res, {
                type: SETTINGS_INTEGRATION_ACTIONS.GET_PAYPAL_DETAILS_RESPONSE,
                payload: res
            }, false, {
                type: SETTINGS_INTEGRATION_ACTIONS.GET_PAYPAL_DETAILS_RESPONSE,
                payload: res
            }))));

    /**
     * This will be use for save paypal details
     *
     * @type {Observable<Action>}
     * @memberof SettingsIntegrationActions
     */
    public savePaypalDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.SAVE_PAYPAL_DETAILS),
            switchMap((action: CustomActions) => this.settingsIntegrationService.savePaypalDetails(action.payload)),
            map(res => this.validatePaypalIntegrationResponse<PaypalDetailsResponse, PayPalClass>(res, {
                type: SETTINGS_INTEGRATION_ACTIONS.SAVE_PAYPAL_DETAILS_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_INTEGRATION_ACTIONS.SAVE_PAYPAL_DETAILS_RESPONSE,
                payload: res
            }))));

    /**
     * This will be use for delete paypal details
     *
     * @type {Observable<Action>}
     * @memberof SettingsIntegrationActions
     */
    public deletePaypalDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.DELETE_PAYPAL_DETAILS),
            switchMap((action: CustomActions) => this.settingsIntegrationService.deletePaypalDetails()),
            map(res => this.validateResponse<string, string>(res, {
                type: SETTINGS_INTEGRATION_ACTIONS.DELETE_PAYPAL_DETAILS_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_INTEGRATION_ACTIONS.DELETE_PAYPAL_DETAILS_RESPONSE,
                payload: res
            }))));

    /**
     * This will be use for update paypal details
     *
     * @type {Observable<Action>}
     * @memberof SettingsIntegrationActions
     */
    public updatePaypalDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_PAYPAL_DETAILS),
            switchMap((action: CustomActions) => this.settingsIntegrationService.updatePaypalDetails(action.payload)),
            map(res => this.validatePaypalIntegrationResponse<PaypalDetailsResponse, PayPalClass>(res, {
                type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_PAYPAL_DETAILS_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_PAYPAL_DETAILS_RESPONSE,
                payload: res
            }))));

    public GetRazorPayDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.GET_RAZOR_PAY_DETAILS),
            switchMap((action: CustomActions) => this.settingsIntegrationService.GetRazorPayDetails()),
            map(res => this.validateResponse<RazorPayDetailsResponse, string>(res, {
                type: SETTINGS_INTEGRATION_ACTIONS.GET_RAZOR_PAY_DETAILS_RESPONSE,
                payload: res
            }, false, {
                type: SETTINGS_INTEGRATION_ACTIONS.GET_RAZOR_PAY_DETAILS_RESPONSE,
                payload: res
            }))));

    public SaveRazorPayDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.SAVE_RAZOR_PAY_DETAILS),
            switchMap((action: CustomActions) => this.settingsIntegrationService.SaveRazorPayDetails(action.payload)),
            map(res => this.validatePayIntegrationResponse<RazorPayDetailsResponse, RazorPayClass>(res, {
                type: SETTINGS_INTEGRATION_ACTIONS.SAVE_RAZOR_PAY_DETAILS_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_INTEGRATION_ACTIONS.SAVE_RAZOR_PAY_DETAILS_RESPONSE,
                payload: res
            }))));

    public DeleteRazorPayDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.DELETE_RAZOR_PAY_DETAILS),
            switchMap((action: CustomActions) => this.settingsIntegrationService.DeleteRazorPayDetails()),
            map(res => this.validateResponse<string, string>(res, {
                type: SETTINGS_INTEGRATION_ACTIONS.DELETE_RAZOR_PAY_DETAILS_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_INTEGRATION_ACTIONS.DELETE_RAZOR_PAY_DETAILS_RESPONSE,
                payload: res
            }))));

    public UpdateRazorPayDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_RAZOR_PAY_DETAILS),
            switchMap((action: CustomActions) => this.settingsIntegrationService.UpdateRazorPayDetails(action.payload)),
            map(res => this.validatePayIntegrationResponse<RazorPayDetailsResponse, RazorPayClass>(res, {
                type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_RAZOR_PAY_DETAILS_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_RAZOR_PAY_DETAILS_RESPONSE,
                payload: res
            }))));

    public SaveCashfreeDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.SAVE_CASHFREE_DETAILS),
            switchMap((action: CustomActions) => this.settingsIntegrationService.SaveCashFreeDetail(action.payload)),
            map(response => this.SaveCashfreeDetailsResponse(response))));

    public SaveCashfreeDetailsResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.SAVE_CASHFREE_DETAILS_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data?.status === 'error') {
                    this.toasty.clearAllToaster();
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body, '');
                }
                return { type: 'EmptyAction' };
            })));

    public DeleteCashfreeDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.DELETE_CASHFREE_DETAILS),
            switchMap((action: CustomActions) => this.settingsIntegrationService.DeleteCashFreeDetail()),
            map(response => this.DeleteCashfreeDetailsResponse(response))));

    public DeleteCashfreeDetailsResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.DELETE_CASHFREE_DETAILS_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<string, string> = response.payload;
                if (data?.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body, '');
                }
                return { type: 'EmptyAction' };
            })));

    public AddAutoCollectUser$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.ADD_AUTOCOLLECT_USER),
            switchMap((action: CustomActions) => this.settingsIntegrationService.AddAutoCollectUser(action.payload)),
            map(response => this.AddAutoCollectUserResponse(response))));

    public AddAutoCollectUserResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.ADD_AUTOCOLLECT_USER_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data?.status === 'error') {
                    this.toasty.clearAllToaster();
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body, '');
                }
                return { type: 'EmptyAction' };
            })));

    public DeleteAutoCollectUser$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.DELETE_AUTOCOLLECT_USER),
            switchMap((action: CustomActions) => this.settingsIntegrationService.DeleteAutoCollectUser()),
            map(response => this.DeleteAutoCollectUserResponse(response))));

    public DeleteAutoCollectUserResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.DELETE_AUTOCOLLECT_USER_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data?.status === 'error') {
                    this.toasty.clearAllToaster();
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.message, '');
                }
                return { type: 'EmptyAction' };
            })));

    public GetCashfreeDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.GET_CASHFREE_DETAILS),
            switchMap((action: CustomActions) => this.settingsIntegrationService.GetCashFreeDetail()),
            map(response => this.GetCashfreeDetailsResponse(response))));

    public GetCashfreeDetailsResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.GET_CASHFREE_DETAILS_RESPONSE),
            map((response: CustomActions) => {
                return { type: 'EmptyAction' };
            })));

    public GetAutoCollectDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.GET_AUTOCOLLECT_USER),
            switchMap((action: CustomActions) => this.settingsIntegrationService.GetAutoCollectUser()),
            map(response => this.GetAutoCollectDetailsResponse(response))));

    public GetAutoCollectDetailsResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.GET_AUTOCOLLECT_USER_RESPONSE),
            map((response: CustomActions) => {
                return { type: 'EmptyAction' };
            })));

    public UpdateCashfreeDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_CASHFREE_DETAILS),
            switchMap((action: CustomActions) => this.settingsIntegrationService.UpdateCashFreeDetail(action.payload)),
            map(response => this.UpdateCashfreeDetailsResponse(response))));

    public UpdateCashfreeDetailsResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_CASHFREE_DETAILS_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data?.status === 'error') {
                    this.toasty.clearAllToaster();
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body, '');
                }
                return { type: 'EmptyAction' };
            })));

    public GetPaymentGateway$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.GET_PAYMENT_GATEWAY),
            switchMap((action: CustomActions) => this.settingsIntegrationService.GetPaymentGateway()),
            map(response => this.GetPaymentGatewayResponse(response))));

    public GetPaymentGatewayResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.GET_PAYMENT_GATEWAY_RESPONSE),
            map((response: CustomActions) => {
                return { type: 'EmptyAction' };
            })));

    public AddPaymentGateway$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.ADD_PAYMENT_GATEWAY),
            switchMap((action: CustomActions) => this.settingsIntegrationService.AddPaymentGateway(action.payload)),
            map(response => this.AddPaymentGatewayResponse(response))));

    public AddPaymentGatewayResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.ADD_PAYMENT_GATEWAY_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data?.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body, '');
                }
                return { type: 'EmptyAction' };
            })));

    public UpdatePaymentGateway$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_PAYMENT_GATEWAY),
            switchMap((action: CustomActions) => this.settingsIntegrationService.UpdatePaymentGateway(action.payload)),
            map(response => this.UpdatePaymentGatewayResponse(response))));

    public UpdatePaymentGatewayResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_PAYMENT_GATEWAY_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data?.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body, '');
                }
                return { type: 'EmptyAction' };
            })));

    public DeletePaymentGateway$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.DELETE_PAYMENT_GATEWAY),
            switchMap((action: CustomActions) => this.settingsIntegrationService.DeletePaymentGateway()),
            map(response => this.DeletePaymentGatewayResponse(response))));

    public DeletePaymentGatewayResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.DELETE_PAYMENT_GATEWAY_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data?.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body, '');
                }
                return { type: 'EmptyAction' };
            })));

    public UpdateAutoCollectUser$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_AUTOCOLLECT_USER),
            switchMap((action: CustomActions) => this.settingsIntegrationService.UpdateAutoCollectUser(action.payload)),
            map(response => this.UpdateAutoCollectUserResponse(response))));

    public UpdateAutoCollectUserResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_AUTOCOLLECT_USER_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data?.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                }
                return { type: 'EmptyAction' };
            })));

    public AddAmazonSeller$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.ADD_AMAZON_SELLER),
            switchMap((action: CustomActions) => this.settingsIntegrationService.AddAmazonSeller(action.payload))
            , map(response => this.AddAmazonSellerResponse(response))));

    public AddAmazonSellerResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.ADD_AMAZON_SELLER_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data?.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body, '');
                }
                return { type: 'EmptyAction' };
            })));

    public UpdateAmazonSeller$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_AMAZON_SELLER),
            switchMap((action: CustomActions) => this.settingsIntegrationService.UpdateAmazonSeller(action.payload))
            , map(response => this.UpdateAmazonSellerResponse(response))));

    public UpdateAmazonSellerResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_AMAZON_SELLER_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data?.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(this.localeService.translate("app_messages.seller_updated"), '');
                }
                return { type: 'EmptyAction' };
            })));

    public DeleteAmazonSeller$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.DELETE_AMAZON_SELLER),
            switchMap((action: CustomActions) => this.settingsIntegrationService.DeleteAmazonSeller(action.payload))
            , map(response => this.DeleteAmazonSellerResponse(response))));

    public DeleteAmazonSellerResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.DELETE_AMAZON_SELLER_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data?.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body, '');
                }
                return { type: 'EmptyAction' };
            })));

    public GetAmazonSellers$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.GET_AMAZON_SELLER),
            switchMap((action: CustomActions) => this.settingsIntegrationService.GetAmazonSeller())
            , map(response => this.GetAmazonSellersResponse(response))));

    public GetAmazonSellersResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.GET_AMAZON_SELLER_RESPONSE),
            map((response: CustomActions) => {
                return { type: 'EmptyAction' };
            })));

    public GetGmailIntegrationStatus$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.GET_GMAIL_INTEGRATION_STATUS),
            switchMap((action: CustomActions) => this.settingsIntegrationService.GetGmailIntegrationStatus()),
            map(response => this.GetGmailIntegrationStatusResponse(response))));

    public RemoveICICI$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.REMOVE_ICICI_PAYMENT),
            switchMap((action: CustomActions) => this.settingsIntegrationService.RemoveICICI(action.payload))
            , map(response => this.RemovePaymentInfoResponse(response))));

    public RemoveICICIResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.REMOVE_ICICI_PAYMENT_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data?.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(this.localeService.translate("app_messages.account_removed"));
                    this.store.dispatch(this._companyAction.getAllRegistrations());
                }
                return { type: 'EmptyAction' };
            })));

    public RemoveGmailIntegration$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.REMOVE_GMAIL_INTEGRATION),
            switchMap((action: CustomActions) => this.settingsIntegrationService.RemoveGmailIntegration())
            , map(response => this.RemoveGmailIntegrationResponse(response))));

    public RemoveGmailIntegrationResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.REMOVE_GMAIL_INTEGRATION_RESPONSE),
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data?.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body, '');
                }
                return { type: 'EmptyAction' };
            })));

    constructor(private action$: Actions,
        private toasty: ToasterService,
        private localeService: LocaleService,
        private store: Store<AppState>,
        private settingsIntegrationService: SettingsIntegrationService,
        private _companyAction: CompanyActions) {
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

    public SavePaymentInfo(value: PaymentClass): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.CREATE_PAYMENT_KEY,
            payload: value
        };
    }

    public UpdatePaymentInfo(value): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_PAYMENT_KEY,
            payload: value
        };
    }

    /**
     * This will be use for get paypal details action
     *
     * @return {*}  {CustomActions}
     * @memberof SettingsIntegrationActions
     */
    public getPaypalDetails(): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.GET_PAYPAL_DETAILS,
        };
    }

    /**
     * This will be use for save paypal details action
     *
     * @param {PayPalClass} value
     * @return {*}  {CustomActions}
     * @memberof SettingsIntegrationActions
     */
    public savePaypalDetails(value: PayPalClass): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.SAVE_PAYPAL_DETAILS,
            payload: value
        };
    }

    /**
     * This wil be use for delete paypal details action
     *
     * @return {*}  {CustomActions}
     * @memberof SettingsIntegrationActions
     */
    public deletePaypalDetails(): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.DELETE_PAYPAL_DETAILS,
        };
    }
    /**
     * This will be use for update paypal details action
     *
     * @param {PayPalClass} value
     * @return {*}  {CustomActions}
     * @memberof SettingsIntegrationActions
     */
    public updatePaypalDetails(value: PayPalClass): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_PAYPAL_DETAILS,
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

    public AddAmazonSellerResponse(models): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.ADD_AMAZON_SELLER_RESPONSE,
            payload: models
        };
    }

    public UpdateAmazonSeller(request: AmazonSellerClass): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_AMAZON_SELLER,
            payload: request
        };
    }

    public UpdateAmazonSellerResponse(models): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_AMAZON_SELLER_RESPONSE,
            payload: models
        };
    }

    public DeleteAmazonSeller(sellerId): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.DELETE_AMAZON_SELLER,
            payload: sellerId
        };
    }

    public DeleteAmazonSellerResponse(response): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.DELETE_AMAZON_SELLER_RESPONSE,
            payload: response
        };
    }

    public GetGmailIntegrationStatus(): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.GET_GMAIL_INTEGRATION_STATUS
        };
    }

    public GetGmailIntegrationStatusResponse(response): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.GET_GMAIL_INTEGRATION_STATUS_RESPONSE,
            payload: response
        };
    }

    public RemoveGmailIntegration(): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.REMOVE_GMAIL_INTEGRATION
        };
    }

    public RemoveGmailIntegrationResponse(response): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.REMOVE_GMAIL_INTEGRATION_RESPONSE,
            payload: response
        };
    }

    public RemovePaymentInfo(bankUserId: string): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.REMOVE_ICICI_PAYMENT,
            payload: bankUserId
        };
    }

    public RemovePaymentInfoResponse(response): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.REMOVE_ICICI_PAYMENT_RESPONSE,
            payload: response
        };
    }

    public ResetICICIFlags(): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.RESET_PAYMENT_STATUS_RESPONSE
        };
    }

    public validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: CustomActions, showToast: boolean = false, errorAction: CustomActions = { type: 'EmptyAction' }): CustomActions {
        if (response?.status === 'error') {
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

    public validatePayIntegrationResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: CustomActions, showToast: boolean = false, errorAction: CustomActions = { type: 'EmptyAction' }): CustomActions {
        if (response?.status === 'error') {
            if (showToast) {
                this.toasty.errorToast(response.message);
            }
            return errorAction;
        } else {
            this.store.dispatch(this.GetRazorPayDetails());
            this.toasty.successToast("Razorpay Details have been verified successfully.");
        }
        return successAction;
    }
    /**
     * This will be use for validate paypal response
     *
     * @template TResponse
     * @template TRequest
     * @param {BaseResponse<TResponse, TRequest>} response
     * @param {CustomActions} successAction
     * @param {boolean} [showToast=false]
     * @param {CustomActions} [errorAction={ type: 'EmptyAction' }]
     * @return {*}  {CustomActions}
     * @memberof SettingsIntegrationActions
     */
    public validatePaypalIntegrationResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: CustomActions, showToast: boolean = false, errorAction: CustomActions = { type: 'EmptyAction' }): CustomActions {
        let message = '';
        if (response?.status === 'error') {
            if (showToast) {
                this.toasty.errorToast(response.message);
            }
            return errorAction;
        } else {
            message = (response?.request['message']);
            this.store.dispatch(this.getPaypalDetails());
            this.toasty.successToast(message);
        }
        return successAction;
    }
}
