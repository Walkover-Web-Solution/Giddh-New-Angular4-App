import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToasterService } from '../../services/toaster.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { SETTINGS_INTEGRATION_ACTIONS } from './settings.integration.const';
import { SettingsIntegrationService } from '../../services/settings.integration.service';
import { AmazonSellerClass, CashfreeClass, EmailKeyClass, RazorPayClass, RazorPayDetailsResponse, SmsKeyClass, PaymentClass, PayPalClass, PaypalDetailsResponse } from '../../models/api-models/SettingsIntegraion';
import { CustomActions } from '../../store/custom-actions';
import { CompanyActions } from "../company.actions";
import { LocaleService } from '../../services/locale.service';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * SettingsIntegrationActions class
 * Implements SettingsIntegrationActions functionality
 */
export class SettingsIntegrationActions {

    public GetSMSKey$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.GET_SMS_KEY),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.settingsIntegrationService.GetSMSKey()),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<SmsKeyClass, string>(res, {
                type: SETTINGS_INTEGRATION_ACTIONS.GET_SMS_KEY_RESPONSE,
                payload: res
            }, false, {
                type: SETTINGS_INTEGRATION_ACTIONS.GET_SMS_KEY_RESPONSE,
                payload: res
            }))));

    public GetEmailKey$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.GET_EMAIL_KEY),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.settingsIntegrationService.GetEmailKey()),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<EmailKeyClass, string>(res, {
                type: SETTINGS_INTEGRATION_ACTIONS.GET_EMAIL_KEY_RESPONSE,
                payload: res
            }, false, {
                type: SETTINGS_INTEGRATION_ACTIONS.GET_EMAIL_KEY_RESPONSE,
                payload: res
            }))));

    public SaveSMSKey$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.CREATE_SMS_KEY),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.settingsIntegrationService.SaveSMSKey(action.payload)),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<string, SmsKeyClass>(res, {
                type: SETTINGS_INTEGRATION_ACTIONS.CREATE_SMS_KEY_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_INTEGRATION_ACTIONS.CREATE_SMS_KEY_RESPONSE,
                payload: res
            }))));

    public SaveEmailKey$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.CREATE_EMAIL_KEY),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.settingsIntegrationService.SaveEmailKey(action.payload)),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<string, EmailKeyClass>(res, {
                type: SETTINGS_INTEGRATION_ACTIONS.CREATE_EMAIL_KEY_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_INTEGRATION_ACTIONS.CREATE_EMAIL_KEY_RESPONSE,
                payload: res
            }))));

    public SavePaymentKey$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.CREATE_PAYMENT_KEY),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.settingsIntegrationService.SavePaymentKey(action.payload)),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<string, PaymentClass>(res, {
                type: SETTINGS_INTEGRATION_ACTIONS.CREATE_PAYMENT_KEY_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_INTEGRATION_ACTIONS.CREATE_PAYMENT_KEY_RESPONSE,
                payload: res
            }))));

    public SavePaymentKeyResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.CREATE_PAYMENT_KEY_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<string, string> | any = response.payload;
                /**
                 * Handles if functionality
                 */
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
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_PAYMENT_KEY),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.settingsIntegrationService.updatePaymentKey(action.payload)),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<any, PaymentClass>(res, {
                type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_PAYMENT_KEY_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_PAYMENT_KEY_RESPONSE,
                payload: res
            }))));

    public UpdatePaymentKeyResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_PAYMENT_KEY_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, string> = response.payload;
                /**
                 * Handles if functionality
                 */
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
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.GET_PAYPAL_DETAILS),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.settingsIntegrationService.getPaypalDetails()),
            /**
             * Handles map functionality
             */
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
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.SAVE_PAYPAL_DETAILS),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.settingsIntegrationService.savePaypalDetails(action.payload)),
            /**
             * Handles map functionality
             */
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
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.DELETE_PAYPAL_DETAILS),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.settingsIntegrationService.deletePaypalDetails()),
            /**
             * Handles map functionality
             */
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
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_PAYPAL_DETAILS),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.settingsIntegrationService.updatePaypalDetails(action.payload)),
            /**
             * Handles map functionality
             */
            map(res => this.validatePaypalIntegrationResponse<PaypalDetailsResponse, PayPalClass>(res, {
                type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_PAYPAL_DETAILS_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_PAYPAL_DETAILS_RESPONSE,
                payload: res
            }))));

    public GetRazorPayDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.GET_RAZOR_PAY_DETAILS),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.settingsIntegrationService.GetRazorPayDetails()),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<RazorPayDetailsResponse, string>(res, {
                type: SETTINGS_INTEGRATION_ACTIONS.GET_RAZOR_PAY_DETAILS_RESPONSE,
                payload: res
            }, false, {
                type: SETTINGS_INTEGRATION_ACTIONS.GET_RAZOR_PAY_DETAILS_RESPONSE,
                payload: res
            }))));

    public SaveRazorPayDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.SAVE_RAZOR_PAY_DETAILS),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.settingsIntegrationService.SaveRazorPayDetails(action.payload)),
            /**
             * Handles map functionality
             */
            map(res => this.validatePayIntegrationResponse<RazorPayDetailsResponse, RazorPayClass>(res, {
                type: SETTINGS_INTEGRATION_ACTIONS.SAVE_RAZOR_PAY_DETAILS_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_INTEGRATION_ACTIONS.SAVE_RAZOR_PAY_DETAILS_RESPONSE,
                payload: res
            }))));

    public DeleteRazorPayDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.DELETE_RAZOR_PAY_DETAILS),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.settingsIntegrationService.DeleteRazorPayDetails()),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<string, string>(res, {
                type: SETTINGS_INTEGRATION_ACTIONS.DELETE_RAZOR_PAY_DETAILS_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_INTEGRATION_ACTIONS.DELETE_RAZOR_PAY_DETAILS_RESPONSE,
                payload: res
            }))));

    public UpdateRazorPayDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_RAZOR_PAY_DETAILS),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.settingsIntegrationService.UpdateRazorPayDetails(action.payload)),
            /**
             * Handles map functionality
             */
            map(res => this.validatePayIntegrationResponse<RazorPayDetailsResponse, RazorPayClass>(res, {
                type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_RAZOR_PAY_DETAILS_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_RAZOR_PAY_DETAILS_RESPONSE,
                payload: res
            }))));

    public SaveCashfreeDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.SAVE_CASHFREE_DETAILS),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.settingsIntegrationService.SaveCashFreeDetail(action.payload)),
            /**
             * Handles map functionality
             */
            map(response => this.SaveCashfreeDetailsResponse(response))));

    public SaveCashfreeDetailsResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.SAVE_CASHFREE_DETAILS_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                /**
                 * Handles if functionality
                 */
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
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.DELETE_CASHFREE_DETAILS),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.settingsIntegrationService.DeleteCashFreeDetail()),
            /**
             * Handles map functionality
             */
            map(response => this.DeleteCashfreeDetailsResponse(response))));

    public DeleteCashfreeDetailsResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.DELETE_CASHFREE_DETAILS_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<string, string> = response.payload;
                /**
                 * Handles if functionality
                 */
                if (data?.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body, '');
                }
                return { type: 'EmptyAction' };
            })));

    public AddAutoCollectUser$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.ADD_AUTOCOLLECT_USER),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.settingsIntegrationService.AddAutoCollectUser(action.payload)),
            /**
             * Handles map functionality
             */
            map(response => this.AddAutoCollectUserResponse(response))));

    public AddAutoCollectUserResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.ADD_AUTOCOLLECT_USER_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                /**
                 * Handles if functionality
                 */
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
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.DELETE_AUTOCOLLECT_USER),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.settingsIntegrationService.DeleteAutoCollectUser()),
            /**
             * Handles map functionality
             */
            map(response => this.DeleteAutoCollectUserResponse(response))));

    public DeleteAutoCollectUserResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.DELETE_AUTOCOLLECT_USER_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                /**
                 * Handles if functionality
                 */
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
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.GET_CASHFREE_DETAILS),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.settingsIntegrationService.GetCashFreeDetail()),
            /**
             * Handles map functionality
             */
            map(response => this.GetCashfreeDetailsResponse(response))));

    public GetCashfreeDetailsResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.GET_CASHFREE_DETAILS_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                return { type: 'EmptyAction' };
            })));

    public GetAutoCollectDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.GET_AUTOCOLLECT_USER),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.settingsIntegrationService.GetAutoCollectUser()),
            /**
             * Handles map functionality
             */
            map(response => this.GetAutoCollectDetailsResponse(response))));

    public GetAutoCollectDetailsResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.GET_AUTOCOLLECT_USER_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                return { type: 'EmptyAction' };
            })));

    public UpdateCashfreeDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_CASHFREE_DETAILS),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.settingsIntegrationService.UpdateCashFreeDetail(action.payload)),
            /**
             * Handles map functionality
             */
            map(response => this.UpdateCashfreeDetailsResponse(response))));

    public UpdateCashfreeDetailsResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_CASHFREE_DETAILS_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                /**
                 * Handles if functionality
                 */
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
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.GET_PAYMENT_GATEWAY),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.settingsIntegrationService.GetPaymentGateway()),
            /**
             * Handles map functionality
             */
            map(response => this.GetPaymentGatewayResponse(response))));

    public GetPaymentGatewayResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.GET_PAYMENT_GATEWAY_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                return { type: 'EmptyAction' };
            })));

    public AddPaymentGateway$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.ADD_PAYMENT_GATEWAY),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.settingsIntegrationService.AddPaymentGateway(action.payload)),
            /**
             * Handles map functionality
             */
            map(response => this.AddPaymentGatewayResponse(response))));

    public AddPaymentGatewayResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.ADD_PAYMENT_GATEWAY_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                /**
                 * Handles if functionality
                 */
                if (data?.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body, '');
                }
                return { type: 'EmptyAction' };
            })));

    public UpdatePaymentGateway$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_PAYMENT_GATEWAY),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.settingsIntegrationService.UpdatePaymentGateway(action.payload)),
            /**
             * Handles map functionality
             */
            map(response => this.UpdatePaymentGatewayResponse(response))));

    public UpdatePaymentGatewayResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_PAYMENT_GATEWAY_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                /**
                 * Handles if functionality
                 */
                if (data?.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body, '');
                }
                return { type: 'EmptyAction' };
            })));

    public DeletePaymentGateway$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.DELETE_PAYMENT_GATEWAY),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.settingsIntegrationService.DeletePaymentGateway()),
            /**
             * Handles map functionality
             */
            map(response => this.DeletePaymentGatewayResponse(response))));

    public DeletePaymentGatewayResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.DELETE_PAYMENT_GATEWAY_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                /**
                 * Handles if functionality
                 */
                if (data?.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body, '');
                }
                return { type: 'EmptyAction' };
            })));

    public UpdateAutoCollectUser$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_AUTOCOLLECT_USER),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.settingsIntegrationService.UpdateAutoCollectUser(action.payload)),
            /**
             * Handles map functionality
             */
            map(response => this.UpdateAutoCollectUserResponse(response))));

    public UpdateAutoCollectUserResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_AUTOCOLLECT_USER_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                /**
                 * Handles if functionality
                 */
                if (data?.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                }
                return { type: 'EmptyAction' };
            })));

    public AddAmazonSeller$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.ADD_AMAZON_SELLER),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.settingsIntegrationService.AddAmazonSeller(action.payload))
            , map(response => this.AddAmazonSellerResponse(response))));

    public AddAmazonSellerResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.ADD_AMAZON_SELLER_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                /**
                 * Handles if functionality
                 */
                if (data?.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body, '');
                }
                return { type: 'EmptyAction' };
            })));

    public UpdateAmazonSeller$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_AMAZON_SELLER),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.settingsIntegrationService.UpdateAmazonSeller(action.payload))
            , map(response => this.UpdateAmazonSellerResponse(response))));

    public UpdateAmazonSellerResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_AMAZON_SELLER_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                /**
                 * Handles if functionality
                 */
                if (data?.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(this.localeService.translate("app_messages.seller_updated"), '');
                }
                return { type: 'EmptyAction' };
            })));

    public DeleteAmazonSeller$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.DELETE_AMAZON_SELLER),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.settingsIntegrationService.DeleteAmazonSeller(action.payload))
            , map(response => this.DeleteAmazonSellerResponse(response))));

    public DeleteAmazonSellerResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.DELETE_AMAZON_SELLER_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                /**
                 * Handles if functionality
                 */
                if (data?.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body, '');
                }
                return { type: 'EmptyAction' };
            })));

    public GetAmazonSellers$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.GET_AMAZON_SELLER),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.settingsIntegrationService.GetAmazonSeller())
            , map(response => this.GetAmazonSellersResponse(response))));

    public GetAmazonSellersResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.GET_AMAZON_SELLER_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                return { type: 'EmptyAction' };
            })));

    public GetGmailIntegrationStatus$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.GET_GMAIL_INTEGRATION_STATUS),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.settingsIntegrationService.GetGmailIntegrationStatus()),
            /**
             * Handles map functionality
             */
            map(response => this.GetGmailIntegrationStatusResponse(response))));

    public RemoveICICI$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.REMOVE_ICICI_PAYMENT),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.settingsIntegrationService.RemoveICICI(action.payload))
            , map(response => this.RemovePaymentInfoResponse(response))));

    public RemoveICICIResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.REMOVE_ICICI_PAYMENT_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                /**
                 * Handles if functionality
                 */
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
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.REMOVE_GMAIL_INTEGRATION),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.settingsIntegrationService.RemoveGmailIntegration())
            , map(response => this.RemoveGmailIntegrationResponse(response))));

    public RemoveGmailIntegrationResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(SETTINGS_INTEGRATION_ACTIONS.REMOVE_GMAIL_INTEGRATION_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                /**
                 * Handles if functionality
                 */
                if (data?.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body, '');
                }
                return { type: 'EmptyAction' };
            })));

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor(private action$: Actions,
        private toasty: ToasterService,
        private localeService: LocaleService,
        private store: Store<AppState>,
        private settingsIntegrationService: SettingsIntegrationService,
        private _companyAction: CompanyActions) {
    }

    /**
     * Handles GetSMSKey functionality
     */
    public GetSMSKey(): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.GET_SMS_KEY,
        };
    }

    /**
     * Handles GetEmailKey functionality
     */
    public GetEmailKey(): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.GET_EMAIL_KEY,
        };
    }

    /**
     * Handles SaveSMSKey functionality
     */
    public SaveSMSKey(value: SmsKeyClass): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.CREATE_SMS_KEY,
            payload: value
        };
    }

    /**
     * Handles SaveEmailKey functionality
     */
    public SaveEmailKey(value: EmailKeyClass): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.CREATE_EMAIL_KEY,
            payload: value
        };
    }

    /**
     * Handles SavePaymentInfo functionality
     */
    public SavePaymentInfo(value: PaymentClass): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.CREATE_PAYMENT_KEY,
            payload: value
        };
    }

    /**
     * Handles UpdatePaymentInfo functionality
     */
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

    /**
     * Handles GetRazorPayDetails functionality
     */
    public GetRazorPayDetails(): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.GET_RAZOR_PAY_DETAILS,
        };
    }

    /**
     * Handles SaveRazorPayDetails functionality
     */
    public SaveRazorPayDetails(value: RazorPayClass): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.SAVE_RAZOR_PAY_DETAILS,
            payload: value
        };
    }


    /**
     * Handles DeleteRazorPayDetails functionality
     */
    public DeleteRazorPayDetails(): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.DELETE_RAZOR_PAY_DETAILS,
        };
    }

    /**
     * Handles UpdateRazorPayDetails functionality
     */
    public UpdateRazorPayDetails(value: RazorPayClass): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_RAZOR_PAY_DETAILS,
            payload: value
        };
    }

    /**
     * Handles SaveCashfreeDetails functionality
     */
    public SaveCashfreeDetails(value: CashfreeClass): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.SAVE_CASHFREE_DETAILS,
            payload: value
        };
    }

    /**
     * Handles SaveCashfreeDetailsResponse functionality
     */
    public SaveCashfreeDetailsResponse(res): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.SAVE_CASHFREE_DETAILS_RESPONSE,
            payload: res
        };
    }

    /**
     * Handles UpdateCashfreeDetails functionality
     */
    public UpdateCashfreeDetails(value: CashfreeClass): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_CASHFREE_DETAILS,
            payload: value
        };
    }

    /**
     * Handles UpdateCashfreeDetailsResponse functionality
     */
    public UpdateCashfreeDetailsResponse(res): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_CASHFREE_DETAILS_RESPONSE,
            payload: res
        };
    }

    /**
     * Handles DeleteCashfreeDetails functionality
     */
    public DeleteCashfreeDetails(): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.DELETE_CASHFREE_DETAILS,
        };
    }

    /**
     * Handles DeleteCashfreeDetailsResponse functionality
     */
    public DeleteCashfreeDetailsResponse(res): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.DELETE_CASHFREE_DETAILS_RESPONSE,
            payload: res
        };
    }

    /**
     * Handles AddAutoCollectUser functionality
     */
    public AddAutoCollectUser(value: CashfreeClass): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.ADD_AUTOCOLLECT_USER,
            payload: value
        };
    }

    /**
     * Handles AddAutoCollectUserResponse functionality
     */
    public AddAutoCollectUserResponse(res): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.ADD_AUTOCOLLECT_USER_RESPONSE,
            payload: res
        };
    }

    /**
     * Handles UpdateAutoCollectUser functionality
     */
    public UpdateAutoCollectUser(value: CashfreeClass): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_AUTOCOLLECT_USER,
            payload: value
        };
    }

    /**
     * Handles UpdateAutoCollectUserResponse functionality
     */
    public UpdateAutoCollectUserResponse(res): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_AUTOCOLLECT_USER_RESPONSE,
            payload: res
        };
    }

    /**
     * Handles DeleteAutoCollectUser functionality
     */
    public DeleteAutoCollectUser(): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.DELETE_AUTOCOLLECT_USER,
        };
    }

    /**
     * Handles DeleteAutoCollectUserResponse functionality
     */
    public DeleteAutoCollectUserResponse(res): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.DELETE_AUTOCOLLECT_USER_RESPONSE,
            payload: res
        };
    }

    /**
     * Handles GetCashfreeDetails functionality
     */
    public GetCashfreeDetails(): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.GET_CASHFREE_DETAILS,
        };
    }

    /**
     * Handles GetCashfreeDetailsResponse functionality
     */
    public GetCashfreeDetailsResponse(models): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.GET_CASHFREE_DETAILS_RESPONSE,
            payload: models
        };
    }

    /**
     * Handles GetAutoCollectDetails functionality
     */
    public GetAutoCollectDetails(): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.GET_AUTOCOLLECT_USER,
        };
    }

    /**
     * Handles GetAutoCollectDetailsResponse functionality
     */
    public GetAutoCollectDetailsResponse(models): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.GET_AUTOCOLLECT_USER_RESPONSE,
            payload: models
        };
    }

    /**
     * Handles GetPaymentGateway functionality
     */
    public GetPaymentGateway(): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.GET_PAYMENT_GATEWAY,
        };
    }

    /**
     * Handles GetPaymentGatewayResponse functionality
     */
    public GetPaymentGatewayResponse(models): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.GET_PAYMENT_GATEWAY_RESPONSE,
            payload: models
        };
    }

    /**
     * Handles AddPaymentGateway functionality
     */
    public AddPaymentGateway(models): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.ADD_PAYMENT_GATEWAY,
            payload: models
        };
    }

    /**
     * Handles AddPaymentGatewayResponse functionality
     */
    public AddPaymentGatewayResponse(models): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.ADD_PAYMENT_GATEWAY_RESPONSE,
            payload: models
        };
    }

    /**
     * Handles UpdatePaymentGateway functionality
     */
    public UpdatePaymentGateway(models): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_PAYMENT_GATEWAY,
            payload: models
        };
    }

    /**
     * Handles UpdatePaymentGatewayResponse functionality
     */
    public UpdatePaymentGatewayResponse(models): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_PAYMENT_GATEWAY_RESPONSE,
            payload: models
        };
    }

    /**
     * Handles DeletePaymentGateway functionality
     */
    public DeletePaymentGateway(): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.DELETE_PAYMENT_GATEWAY,
        };
    }

    /**
     * Handles DeletePaymentGatewayResponse functionality
     */
    public DeletePaymentGatewayResponse(models): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.DELETE_PAYMENT_GATEWAY_RESPONSE,
            payload: models
        };
    }

    /**
     * Handles GetAmazonSellers functionality
     */
    public GetAmazonSellers(): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.GET_AMAZON_SELLER,
        };
    }

    /**
     * Handles GetAmazonSellersResponse functionality
     */
    public GetAmazonSellersResponse(models): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.GET_AMAZON_SELLER_RESPONSE,
            payload: models
        };
    }

    /**
     * Handles AddAmazonSeller functionality
     */
    public AddAmazonSeller(models: AmazonSellerClass[]): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.ADD_AMAZON_SELLER,
            payload: models
        };
    }

    /**
     * Handles AddAmazonSellerResponse functionality
     */
    public AddAmazonSellerResponse(models): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.ADD_AMAZON_SELLER_RESPONSE,
            payload: models
        };
    }

    /**
     * Handles UpdateAmazonSeller functionality
     */
    public UpdateAmazonSeller(request: AmazonSellerClass): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_AMAZON_SELLER,
            payload: request
        };
    }

    /**
     * Handles UpdateAmazonSellerResponse functionality
     */
    public UpdateAmazonSellerResponse(models): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_AMAZON_SELLER_RESPONSE,
            payload: models
        };
    }

    /**
     * Handles DeleteAmazonSeller functionality
     */
    public DeleteAmazonSeller(sellerId): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.DELETE_AMAZON_SELLER,
            payload: sellerId
        };
    }

    /**
     * Handles DeleteAmazonSellerResponse functionality
     */
    public DeleteAmazonSellerResponse(response): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.DELETE_AMAZON_SELLER_RESPONSE,
            payload: response
        };
    }

    /**
     * Handles GetGmailIntegrationStatus functionality
     */
    public GetGmailIntegrationStatus(): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.GET_GMAIL_INTEGRATION_STATUS
        };
    }

    /**
     * Handles GetGmailIntegrationStatusResponse functionality
     */
    public GetGmailIntegrationStatusResponse(response): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.GET_GMAIL_INTEGRATION_STATUS_RESPONSE,
            payload: response
        };
    }

    /**
     * Handles RemoveGmailIntegration functionality
     */
    public RemoveGmailIntegration(): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.REMOVE_GMAIL_INTEGRATION
        };
    }

    /**
     * Handles RemoveGmailIntegrationResponse functionality
     */
    public RemoveGmailIntegrationResponse(response): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.REMOVE_GMAIL_INTEGRATION_RESPONSE,
            payload: response
        };
    }

    /**
     * Handles RemovePaymentInfo functionality
     */
    public RemovePaymentInfo(bankUserId: string): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.REMOVE_ICICI_PAYMENT,
            payload: bankUserId
        };
    }

    /**
     * Handles RemovePaymentInfoResponse functionality
     */
    public RemovePaymentInfoResponse(response): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.REMOVE_ICICI_PAYMENT_RESPONSE,
            payload: response
        };
    }

    /**
     * Handles ResetICICIFlags functionality
     */
    public ResetICICIFlags(): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.RESET_PAYMENT_STATUS_RESPONSE
        };
    }

    public validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: CustomActions, showToast: boolean = false, errorAction: CustomActions = { type: 'EmptyAction' }): CustomActions {
        /**
         * Handles if functionality
         */
        if (response?.status === 'error') {
            /**
             * Handles if functionality
             */
            if (showToast) {
                this.toasty.errorToast(response.message);
            }
            return errorAction;
        } else {
            /**
             * Handles if functionality
             */
            if (showToast && typeof response.body === 'string') {
                this.toasty.successToast(response.body);
            }
        }
        return successAction;
    }

    public validatePayIntegrationResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: CustomActions, showToast: boolean = false, errorAction: CustomActions = { type: 'EmptyAction' }): CustomActions {
        /**
         * Handles if functionality
         */
        if (response?.status === 'error') {
            /**
             * Handles if functionality
             */
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
        /**
         * Handles if functionality
         */
        if (response?.status === 'error') {
            /**
             * Handles if functionality
             */
            if (showToast) {
                this.toasty.errorToast(response.message);
            }
            return errorAction;
        } else {
            /**
             * Handles message functionality
             */
            message = (response?.request['message']);
            this.store.dispatch(this.getPaypalDetails());
            this.toasty.successToast(message);
        }
        return successAction;
    }
}
