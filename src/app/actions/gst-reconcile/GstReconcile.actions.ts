import { Injectable } from '@angular/core';
import { CustomActions } from '../../store/customActions';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { GST_RECONCILE_ACTIONS } from './GstReconcile.const';
import { GstReconcileInvoiceResponse, VerifyOtpRequest } from '../../models/api-models/GstReconcile';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { ToasterService } from '../../services/toaster.service';
import { AppState } from '../../store';
import { GstReconcileService } from '../../services/GstReconcile.service';
import { Observable } from 'rxjs';

@Injectable()
export class GstReconcileActions {

  @Effect() private GstReconcileOtpRequest$: Observable<Action> = this.action$
    .ofType(GST_RECONCILE_ACTIONS.GST_RECONCILE_OTP_REQUEST)
    .switchMap((action: CustomActions) => {

      return this._reconcileService.GstReconcileGenerateOtp(action.payload.userName)
        .map((response: BaseResponse<string, string>) => {
          if (response.status === 'success') {
            this._toasty.successToast(response.body);
          } else {
            this._toasty.errorToast(response.message);
          }
          return this.GstReconcileOtpResponse(response);
        });
    });

  @Effect() private GstReconcileVerifyOtpRequest$: Observable<Action> = this.action$
    .ofType(GST_RECONCILE_ACTIONS.GST_RECONCILE_VERIFY_OTP_REQUEST)
    .switchMap((action: CustomActions) => {

      return this._reconcileService.GstReconcileVerifyOtp(action.payload.model)
        .map((response: BaseResponse<string, VerifyOtpRequest>) => {
          if (response.status === 'success') {
            this._toasty.successToast(response.body);
          } else {
            this._toasty.errorToast(response.message);
          }
          return this.GstReconcileVerifyOtpResponse(response);
        });
    });

  @Effect() private GstReconcileInvoicePeriodRequest$: Observable<Action> = this.action$
    .ofType(GST_RECONCILE_ACTIONS.GST_RECONCILE_INVOICE_REQUEST)
    .switchMap((action: CustomActions) => {

      return this._reconcileService.GstReconcileGetInvoices(action.payload.period, action.payload.action, action.payload.page, action.payload.count)
        .map((response: BaseResponse<GstReconcileInvoiceResponse, string>) => {
          if (response.status === 'success') {
            // this._toasty.successToast('su');
          } else {
            this._toasty.errorToast(response.message);
          }
          return this.GstReconcileInvoiceResponse(response);
        });
    });

  constructor(private action$: Actions,
              private _toasty: ToasterService,
              private store: Store<AppState>,
              private _reconcileService: GstReconcileService) {
    //
  }

  public GstReconcileOtpRequest(userName: string): CustomActions {
    return {
      type: GST_RECONCILE_ACTIONS.GST_RECONCILE_OTP_REQUEST,
      payload: {userName}
    };
  }

  public GstReconcileOtpResponse(response: BaseResponse<string, string>): CustomActions {
    return {
      type: GST_RECONCILE_ACTIONS.GST_RECONCILE_OTP_RESPONSE,
      payload: response
    };
  }

  public GstReconcileInvoiceRequest(period: string, action: string, page: string, count: string = '10'): CustomActions {
    return {
      type: GST_RECONCILE_ACTIONS.GST_RECONCILE_INVOICE_REQUEST,
      payload: {period, action, page, count}
    };
  }

  public GstReconcileInvoiceResponse(response: BaseResponse<GstReconcileInvoiceResponse, string>): CustomActions {
    return {
      type: GST_RECONCILE_ACTIONS.GST_RECONCILE_INVOICE_RESPONSE,
      payload: response
    };
  }

  public GstReconcileVerifyOtpRequest(model: VerifyOtpRequest): CustomActions {
    return {
      type: GST_RECONCILE_ACTIONS.GST_RECONCILE_VERIFY_OTP_REQUEST,
      payload: {model}
    };
  }

  public GstReconcileVerifyOtpResponse(response: BaseResponse<string, VerifyOtpRequest>): CustomActions {
    return {
      type: GST_RECONCILE_ACTIONS.GST_RECONCILE_VERIFY_OTP_RESPONSE,
      payload: response
    };
  }
}
