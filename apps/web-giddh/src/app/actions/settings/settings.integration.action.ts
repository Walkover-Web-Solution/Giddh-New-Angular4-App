import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../../services/toaster.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { Router } from '@angular/router';
import { SETTINGS_INTEGRATION_ACTIONS } from './settings.integration.const';
import { SettingsIntegrationService } from '../../services/settings.integraion.service';
import { AmazonSellerClass, CashfreeClass, EmailKeyClass, RazorPayClass, RazorPayDetailsResponse, SmsKeyClass, PaymentClass } from '../../models/api-models/SettingsIntegraion';
import { CustomActions } from '../../store/customActions';
import { CompanyActions } from "../company.actions";

@Injectable()
export class SettingsIntegrationActions {

    @Effect()
    public GetSMSKey$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.GET_SMS_KEY).pipe(
            switchMap((action: CustomActions) => this.settingsIntegrationService.GetSMSKey()),
            map(res => this.validateResponse<SmsKeyClass, string>(res, {
                type: SETTINGS_INTEGRATION_ACTIONS.GET_SMS_KEY_RESPONSE,
                payload: res
            }, false, {
                type: SETTINGS_INTEGRATION_ACTIONS.GET_SMS_KEY_RESPONSE,
                payload: res
            })));

    @Effect()
    public GetEmailKey$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.GET_EMAIL_KEY).pipe(
            switchMap((action: CustomActions) => this.settingsIntegrationService.GetEmailKey()),
            map(res => this.validateResponse<EmailKeyClass, string>(res, {
                type: SETTINGS_INTEGRATION_ACTIONS.GET_EMAIL_KEY_RESPONSE,
                payload: res
            }, false, {
                type: SETTINGS_INTEGRATION_ACTIONS.GET_EMAIL_KEY_RESPONSE,
                payload: res
            })));

    @Effect()
    public SaveSMSKey$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.CREATE_SMS_KEY).pipe(
            switchMap((action: CustomActions) => this.settingsIntegrationService.SaveSMSKey(action.payload)),
            map(res => this.validateResponse<string, SmsKeyClass>(res, {
                type: SETTINGS_INTEGRATION_ACTIONS.CREATE_SMS_KEY_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_INTEGRATION_ACTIONS.CREATE_SMS_KEY_RESPONSE,
                payload: res
            })));

    @Effect()
    public SaveEmailKey$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.CREATE_EMAIL_KEY).pipe(
            switchMap((action: CustomActions) => this.settingsIntegrationService.SaveEmailKey(action.payload)),
            map(res => this.validateResponse<string, EmailKeyClass>(res, {
                type: SETTINGS_INTEGRATION_ACTIONS.CREATE_EMAIL_KEY_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_INTEGRATION_ACTIONS.CREATE_EMAIL_KEY_RESPONSE,
                payload: res
            })));
    @Effect()
    public SavePaymentKey$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.CREATE_PAYMENT_KEY).pipe(
            switchMap((action: CustomActions) => this.settingsIntegrationService.SavePaymentKey(action.payload)),
            map(res => this.validateResponse<string, PaymentClass>(res, {
                type: SETTINGS_INTEGRATION_ACTIONS.CREATE_PAYMENT_KEY_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_INTEGRATION_ACTIONS.CREATE_PAYMENT_KEY_RESPONSE,
                payload: res
            })));
    @Effect()
    public SavePaymentKeyResponse$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.CREATE_PAYMENT_KEY_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<string, string> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.store.dispatch(this._companyAction.getAllRegistrations());
                    this.toasty.successToast('Account created successfully', '');
                }
                return { type: 'EmptyAction' };

            }));
    @Effect()
    public UpdatePaymentKey$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_PAYMENT_KEY).pipe(
            switchMap((action: CustomActions) => this.settingsIntegrationService.updatePaymentKey(action.payload)),
            map(res => this.validateResponse<string, PaymentClass>(res, {
                type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_PAYMENT_KEY_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_PAYMENT_KEY_RESPONSE,
                payload: res
            })));
    @Effect()
    public UpdatePaymentKeyResponse$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_PAYMENT_KEY_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<string, string> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                    this.store.dispatch(this._companyAction.getAllRegistrations());
                } else {
                    this.store.dispatch(this._companyAction.getAllRegistrations());
                    this.toasty.successToast(data.body, '');
                }
                return { type: 'EmptyAction' };

            }));

    @Effect()
    public GetRazorPayDetails$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.GET_RAZOR_PAY_DETAILS).pipe(
            switchMap((action: CustomActions) => this.settingsIntegrationService.GetRazorPayDetails()),
            map(res => this.validateResponse<RazorPayDetailsResponse, string>(res, {
                type: SETTINGS_INTEGRATION_ACTIONS.GET_RAZOR_PAY_DETAILS_RESPONSE,
                payload: res
            }, false, {
                type: SETTINGS_INTEGRATION_ACTIONS.GET_RAZOR_PAY_DETAILS_RESPONSE,
                payload: res
            })));

    @Effect()
    public SaveRazorPayDetails$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.SAVE_RAZOR_PAY_DETAILS).pipe(
            switchMap((action: CustomActions) => this.settingsIntegrationService.SaveRazorPayDetails(action.payload)),
            map(res => this.validatePayIntegrationResponse<RazorPayDetailsResponse, RazorPayClass>(res, {
                type: SETTINGS_INTEGRATION_ACTIONS.SAVE_RAZOR_PAY_DETAILS_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_INTEGRATION_ACTIONS.SAVE_RAZOR_PAY_DETAILS_RESPONSE,
                payload: res
            })));

    @Effect()
    public DeleteRazorPayDetails$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.DELETE_RAZOR_PAY_DETAILS).pipe(
            switchMap((action: CustomActions) => this.settingsIntegrationService.DeleteRazorPayDetails()),
            map(res => this.validateResponse<string, string>(res, {
                type: SETTINGS_INTEGRATION_ACTIONS.DELETE_RAZOR_PAY_DETAILS_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_INTEGRATION_ACTIONS.DELETE_RAZOR_PAY_DETAILS_RESPONSE,
                payload: res
            })));

    @Effect()
    public UpdateRazorPayDetails$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_RAZOR_PAY_DETAILS).pipe(
            switchMap((action: CustomActions) => this.settingsIntegrationService.UpdateRazorPayDetails(action.payload)),
            map(res => this.validatePayIntegrationResponse<RazorPayDetailsResponse, RazorPayClass>(res, {
                type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_RAZOR_PAY_DETAILS_RESPONSE,
                payload: res
            }, true, {
                type: SETTINGS_INTEGRATION_ACTIONS.UPDATE_RAZOR_PAY_DETAILS_RESPONSE,
                payload: res
            })));

    @Effect()
    public SaveCashfreeDetails$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.SAVE_CASHFREE_DETAILS).pipe(
            switchMap((action: CustomActions) => this.settingsIntegrationService.SaveCashFreeDetail(action.payload)),
            map(response => this.SaveCashfreeDetailsResponse(response)));

    @Effect()
    public SaveCashfreeDetailsResponse$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.SAVE_CASHFREE_DETAILS_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data.status === 'error') {
                    this.toasty.clearAllToaster();
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body, '');
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public DeleteCashfreeDetails$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.DELETE_CASHFREE_DETAILS).pipe(
            switchMap((action: CustomActions) => this.settingsIntegrationService.DeleteCashFreeDetail()),
            map(response => this.DeleteCashfreeDetailsResponse(response)));

    @Effect()
    public DeleteCashfreeDetailsResponse$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.DELETE_CASHFREE_DETAILS_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<string, string> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body, '');
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public AddAutoCollectUser$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.ADD_AUTOCOLLECT_USER).pipe(
            switchMap((action: CustomActions) => this.settingsIntegrationService.AddAutoCollectUser(action.payload)),
            map(response => this.AddAutoCollectUserResponse(response)));

    @Effect()
    public AddAutoCollectUserResponse$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.ADD_AUTOCOLLECT_USER_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data.status === 'error') {
                    this.toasty.clearAllToaster();
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body, '');
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public DeleteAutoCollectUser$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.DELETE_AUTOCOLLECT_USER).pipe(
            switchMap((action: CustomActions) => this.settingsIntegrationService.DeleteAutoCollectUser()),
            map(response => this.DeleteAutoCollectUserResponse(response)));

    @Effect()
    public DeleteAutoCollectUserResponse$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.DELETE_AUTOCOLLECT_USER_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data.status === 'error') {
                    this.toasty.clearAllToaster();
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.message, '');
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public GetCashfreeDetails$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.GET_CASHFREE_DETAILS).pipe(
            switchMap((action: CustomActions) => this.settingsIntegrationService.GetCashFreeDetail()),
            map(response => this.GetCashfreeDetailsResponse(response)));

    @Effect()
    public GetCashfreeDetailsResponse$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.GET_CASHFREE_DETAILS_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public GetAutoCollectDetails$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.GET_AUTOCOLLECT_USER).pipe(
            switchMap((action: CustomActions) => this.settingsIntegrationService.GetAutoCollectUser()),
            map(response => this.GetAutoCollectDetailsResponse(response)));

    @Effect()
    public GetAutoCollectDetailsResponse$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.GET_AUTOCOLLECT_USER_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public UpdateCashfreeDetails$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_CASHFREE_DETAILS).pipe(
            switchMap((action: CustomActions) => this.settingsIntegrationService.UpdateCashFreeDetail(action.payload)),
            map(response => this.UpdateCashfreeDetailsResponse(response)));

    @Effect()
    public UpdateCashfreeDetailsResponse$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_CASHFREE_DETAILS_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data.status === 'error') {
                    this.toasty.clearAllToaster();
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body, '');
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public GetPaymentGateway$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.GET_PAYMENT_GATEWAY).pipe(
            switchMap((action: CustomActions) => this.settingsIntegrationService.GetPaymentGateway()),
            map(response => this.GetPaymentGatewayResponse(response)));

    @Effect()
    public GetPaymentGatewayResponse$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.GET_PAYMENT_GATEWAY_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public AddPaymentGateway$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.ADD_PAYMENT_GATEWAY).pipe(
            switchMap((action: CustomActions) => this.settingsIntegrationService.AddPaymentGateway(action.payload)),
            map(response => this.AddPaymentGatewayResponse(response)));

    @Effect()
    public AddPaymentGatewayResponse$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.ADD_PAYMENT_GATEWAY_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body, '');
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public UpdatePaymentGateway$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_PAYMENT_GATEWAY).pipe(
            switchMap((action: CustomActions) => this.settingsIntegrationService.UpdatePaymentGateway(action.payload)),
            map(response => this.UpdatePaymentGatewayResponse(response)));

    @Effect()
    public UpdatePaymentGatewayResponse$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_PAYMENT_GATEWAY_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body, '');
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public DeletePaymentGateway$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.DELETE_PAYMENT_GATEWAY).pipe(
            switchMap((action: CustomActions) => this.settingsIntegrationService.DeletePaymentGateway()),
            map(response => this.DeletePaymentGatewayResponse(response)));

    @Effect()
    public DeletePaymentGatewayResponse$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.DELETE_PAYMENT_GATEWAY_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    this.toasty.successToast(data.body, '');
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public UpdateAutoCollectUser$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_AUTOCOLLECT_USER).pipe(
            switchMap((action: CustomActions) => this.settingsIntegrationService.UpdateAutoCollectUser(action.payload)),
            map(response => this.UpdateAutoCollectUserResponse(response)));

    @Effect()
    public UpdateAutoCollectUserResponse$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_AUTOCOLLECT_USER_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data.status === 'error') {
                    this.toasty.errorToast(data.message, data.code);
                } else {
                    // this.toasty.successToast(data.body, '');
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public AddAmazonSeller$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.ADD_AMAZON_SELLER)
        .pipe(switchMap((action: CustomActions) => this.settingsIntegrationService.AddAmazonSeller(action.payload))
            , map(response => this.AddAmazonSellerResponse(response)));

    @Effect()
    public AddAmazonSellerResponse$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.ADD_AMAZON_SELLER_RESPONSE)
        .pipe(map((response: CustomActions) => {
            let data: BaseResponse<any, any> = response.payload;
            if (data.status === 'error') {
                this.toasty.errorToast(data.message, data.code);
            } else {
                this.toasty.successToast(data.body, '');
            }
            return { type: 'EmptyAction' };
        }));

    @Effect()
    public UpdateAmazonSeller$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_AMAZON_SELLER)
        .pipe(switchMap((action: CustomActions) => this.settingsIntegrationService.UpdateAmazonSeller(action.payload))
            , map(response => this.UpdateAmazonSellerResponse(response)));

    @Effect()
    public UpdateAmazonSellerResponse$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.UPDATE_AMAZON_SELLER_RESPONSE)
        .pipe(map((response: CustomActions) => {
            let data: BaseResponse<any, any> = response.payload;
            if (data.status === 'error') {
                this.toasty.errorToast(data.message, data.code);
            } else {
                this.toasty.successToast('Seller Updated Successfully', '');
            }
            return { type: 'EmptyAction' };
        }));

    @Effect()
    public DeleteAmazonSeller$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.DELETE_AMAZON_SELLER)
        .pipe(switchMap((action: CustomActions) => this.settingsIntegrationService.DeleteAmazonSeller(action.payload))
            , map(response => this.DeleteAmazonSellerResponse(response)));

    @Effect()
    public DeleteAmazonSellerResponse$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.DELETE_AMAZON_SELLER_RESPONSE)
        .pipe(map((response: CustomActions) => {
            let data: BaseResponse<any, any> = response.payload;
            if (data.status === 'error') {
                this.toasty.errorToast(data.message, data.code);
            } else {
                this.toasty.successToast(data.body, '');
            }
            return { type: 'EmptyAction' };
        }));

    @Effect()
    public GetAmazonSellers$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.GET_AMAZON_SELLER)
        .pipe(switchMap((action: CustomActions) => this.settingsIntegrationService.GetAmazonSeller())
            , map(response => this.GetAmazonSellersResponse(response)));

    @Effect()
    public GetAmazonSellersResponse$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.GET_AMAZON_SELLER_RESPONSE)
        .pipe(map((response: CustomActions) => {
            let data: BaseResponse<any, any> = response.payload;
            return { type: 'EmptyAction' };
        }));

    @Effect()
    public GetGmailIntegrationStatus$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.GET_GMAIL_INTEGRATION_STATUS).pipe(
            switchMap((action: CustomActions) => this.settingsIntegrationService.GetGmailIntegrationStatus()),
            map(response => this.GetGmailIntegrationStatusResponse(response)));

    @Effect()
    public RemoveICICI$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.REMOVE_ICICI_PAYMENT)
        .pipe(switchMap((action: CustomActions) => this.settingsIntegrationService.RemoveICICI(action.payload))
            , map(response => this.RemovePaymentInfoResponse(response)));

    @Effect()
    public RemoveICICIResponse$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.REMOVE_ICICI_PAYMENT_RESPONSE)
        .pipe(map((response: CustomActions) => {
            let data: BaseResponse<any, any> = response.payload;
            if (data.status === 'error') {
                this.toasty.errorToast(data.message, data.code);
            } else {
                this.toasty.successToast('Account removed successfully');
                this.store.dispatch(this._companyAction.getAllRegistrations());
            }
            return { type: 'EmptyAction' };
        }));

    @Effect()
    public RemoveGmailIntegration$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.REMOVE_GMAIL_INTEGRATION)
        .pipe(switchMap((action: CustomActions) => this.settingsIntegrationService.RemoveGmailIntegration())
            , map(response => this.RemoveGmailIntegrationResponse(response)));

    @Effect()
    public RemoveGmailIntegrationResponse$: Observable<Action> = this.action$
        .ofType(SETTINGS_INTEGRATION_ACTIONS.REMOVE_GMAIL_INTEGRATION_RESPONSE)
        .pipe(map((response: CustomActions) => {
            let data: BaseResponse<any, any> = response.payload;
            if (data.status === 'error') {
                this.toasty.errorToast(data.message, data.code);
            } else {
                this.toasty.successToast(data.body, '');
            }
            return { type: 'EmptyAction' };
        }));

    constructor(private action$: Actions,
        private toasty: ToasterService,
        private router: Router,
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

    public RemovePaymentInfo(URN: string): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.REMOVE_ICICI_PAYMENT,
            payload: URN
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

    public validatePayIntegrationResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: CustomActions, showToast: boolean = false, errorAction: CustomActions = { type: 'EmptyAction' }): CustomActions {
        if (response.status === 'error') {
            if (showToast) {
                this.toasty.errorToast(response.message);
            }
            return errorAction;
        } else {
            this.toasty.successToast("Razorpay Details have been verified successfully.");
        }
        return successAction;
    }
}
