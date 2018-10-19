import { Injectable } from '@angular/core';
import { CustomActions } from '../../store/customActions';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { GST_RECONCILE_ACTIONS, GSTR_ACTIONS } from './GstReconcile.const';
import { GstReconcileInvoiceResponse, VerifyOtpRequest } from '../../models/api-models/GstReconcile';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { ToasterService } from '../../services/toaster.service';
import { AppState } from '../../store';
import { GstReconcileService } from '../../services/GstReconcile.service';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable()
export class GstReconcileActions {

  @Effect() private GstReconcileOtpRequest$: Observable<Action> = this.action$
    .pipe(
      ofType(GST_RECONCILE_ACTIONS.GST_RECONCILE_OTP_REQUEST)
      , switchMap((action: CustomActions) => {

        return this._reconcileService.GstReconcileGenerateOtp(action.payload.userName)
          .pipe(
            map((response: BaseResponse<string, string>) => {
              if (response.status === 'success') {
                this._toasty.successToast(response.body);
              } else {
                this._toasty.errorToast(response.message);
              }
              return this.GstReconcileOtpResponse(response);
            }));
      }));

  @Effect() private GstReconcileVerifyOtpRequest$: Observable<Action> = this.action$
    .pipe(
      ofType(GST_RECONCILE_ACTIONS.GST_RECONCILE_VERIFY_OTP_REQUEST)
      , switchMap((action: CustomActions) => {

        return this._reconcileService.GstReconcileVerifyOtp(action.payload.model)
          .pipe(
            map((response: BaseResponse<string, VerifyOtpRequest>) => {
              if (response.status === 'success') {
                this._toasty.successToast(response.body);
              } else {
                this._toasty.errorToast(response.message);
              }
              return this.GstReconcileVerifyOtpResponse(response);
            }));
      }));

  @Effect() private GstReconcileInvoicePeriodRequest$: Observable<Action> = this.action$
    .pipe(
      ofType(GST_RECONCILE_ACTIONS.GST_RECONCILE_INVOICE_REQUEST)
      , switchMap((action: CustomActions) => {

        return this._reconcileService.GstReconcileGetInvoices(action.payload.period, action.payload.action, action.payload.page, action.payload.count,
          action.payload.refresh)
          .pipe(
            map((response: BaseResponse<GstReconcileInvoiceResponse, string>) => {
              if (response.status === 'success') {
                // this._toasty.successToast('su');
              } else {
                this._toasty.errorToast(response.message);
              }
              return this.GstReconcileInvoiceResponse(response);
            }));
      }));

  @Effect() private GetOverView$: Observable<Action> = this.action$
    .pipe(
      ofType(GSTR_ACTIONS.GET_GSTR_OVERVIEW)
      , switchMap((action: CustomActions) => {

        return this._reconcileService.GetGstrOverview(action.payload)
          .pipe(
            map((response: BaseResponse<GstReconcileInvoiceResponse, string>) => {
              if (response.status === 'success') {
                // this._toasty.successToast('su');
              } else {
                this._toasty.errorToast(response.message);
              }
              return this.GetOverViewResponse(response);
            }));
      }));

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

  public GstReconcileInvoiceRequest(period: string, action: string, page: string, refresh: boolean = false, count: string = '10'): CustomActions {
    return {
      type: GST_RECONCILE_ACTIONS.GST_RECONCILE_INVOICE_REQUEST,
      payload: {period, action, page, refresh, count}
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

  public ResetGstReconcileState() {
    return {
      type: GST_RECONCILE_ACTIONS.RESET_GST_RECONCILE_STATE
    };
  }

  public showPullFromGstInModal() {
    return {
      type: GST_RECONCILE_ACTIONS.PULL_FROM_GSTIN
    };
  }

  /**
   * GetOverView
   */
  public GetOverView(model) {
    return {
      type: GSTR_ACTIONS.GET_GSTR_OVERVIEW,
      payload: model
    };
  }
  public GetOverViewResponse(res) {
    return {
      type: GSTR_ACTIONS.GET_GSTR_OVERVIEW_RESOPONSE,
      payload: {res}
    };
  }
}
