import { Injectable } from '@angular/core';
import { CustomActions } from '../../store/customActions';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { GST_RECONCILE_ACTIONS, GSTR_ACTIONS } from './GstReconcile.const';
import { GstOverViewRequest, GstOverViewResult, Gstr1SummaryRequest, Gstr1SummaryResponse, GstReconcileInvoiceResponse, GStTransactionRequest, GstTransactionResult, VerifyOtpRequest } from '../../models/api-models/GstReconcile';
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

  @Effect() private GetGstr1OverView$: Observable<Action> = this.action$
    .pipe(
      ofType(GSTR_ACTIONS.GET_GSTR1_OVERVIEW)
      , switchMap((action: CustomActions) => {

        return this._reconcileService.GetGstrOverview(action.payload.type, action.payload.model)
          .pipe(
            map((response: BaseResponse<GstOverViewResult, GstOverViewRequest>) => {
              if (response.status === 'success') {
                // this._toasty.successToast('su');
              } else {
                this._toasty.errorToast(response.message);
              }
              return this.GetOverViewResponse(response);
            }));
      }));

  @Effect() private GetGstr2OverView$: Observable<Action> = this.action$
    .pipe(
      ofType(GSTR_ACTIONS.GET_GSTR2_OVERVIEW)
      , switchMap((action: CustomActions) => {

        return this._reconcileService.GetGstrOverview(action.payload.type, action.payload.model)
          .pipe(
            map((response: BaseResponse<GstOverViewResult, GstOverViewRequest>) => {
              if (response.status === 'success') {
                // this._toasty.successToast('su');
              } else {
                this._toasty.errorToast(response.message);
              }
              return this.GetOverViewResponse(response);
            }));
      }));

  @Effect() private GetSummaryTransaction$: Observable<Action> = this.action$
    .pipe(
      ofType(GSTR_ACTIONS.GET_SUMMARY_TRANSACTIONS)
      , switchMap((action: CustomActions) => {

        return this._reconcileService.GetSummaryTransaction(action.payload.type, action.payload.model)
          .pipe(
            map((response: BaseResponse<GstTransactionResult, GStTransactionRequest>) => {
              if (response.status === 'success') {
                // this._toasty.successToast('su');
              } else {
                this._toasty.errorToast(response.message);
              }
              return this.GetSummaryTransactionResponse(response);
            }));
      }));

  @Effect() private GetGSTR1SummaryDetails$: Observable<Action> = this.action$
    .pipe(
      ofType(GSTR_ACTIONS.GET_GSTR1_SUMMARY_DETAILS)
      , switchMap((action: CustomActions) => {

        return this._reconcileService.GetGstr1SummaryDetails(action.payload)
          .pipe(
            map((response: BaseResponse<Gstr1SummaryResponse, Gstr1SummaryRequest>) => {
              if (response.status === 'success') {
                //
              } else {
                this._toasty.errorToast(response.message);
              }
              return this.GetGSTR1SummaryDetailsResponse(response);
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

  public GstReconcileInvoiceRequest(period: any, action: string, page: string, refresh: boolean = false, count: string = '10'): CustomActions {
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
  public GetOverView(type, model: GstOverViewRequest) {
    return {
      type: type === 'gstr1' ? GSTR_ACTIONS.GET_GSTR1_OVERVIEW : GSTR_ACTIONS.GET_GSTR2_OVERVIEW,
      payload: {type, model}
    };
  }

  public GetOverViewResponse(res: BaseResponse<GstOverViewResult, GstOverViewRequest>) {
    let type = res.queryString.type;
    return {
      type: type === 'gstr1' ? GSTR_ACTIONS.GET_GSTR1_OVERVIEW_RESPONSE : GSTR_ACTIONS.GET_GSTR2_OVERVIEW_RESPONSE,
      payload: res
    };
  }

  /**
   * GetSummaryTransaction
   */
  public GetSummaryTransaction(type, model: GStTransactionRequest) {
    return {
      type: GSTR_ACTIONS.GET_SUMMARY_TRANSACTIONS,
      payload: {type, model}
    };
  }

  /**
   * viewSummaryTransaction
   */
  public GetSummaryTransactionResponse(res: BaseResponse<GstTransactionResult, GStTransactionRequest>) {
    return {
      type: GSTR_ACTIONS.GET_SUMMARY_TRANSACTIONS_RESPONSE,
      payload: res
    };
  }

  public SetActiveCompanyGstin(gstIn) {
    return {
      type: GSTR_ACTIONS.SET_ACTIVE_COMPANY_GSTIN,
      payload: gstIn
    };
  }

  /*
    GSTR1 Summary Details
  */
  public GetGSTR1SummaryDetails(model: Gstr1SummaryRequest): CustomActions {
    return {
      type: GSTR_ACTIONS.GET_GSTR1_SUMMARY_DETAILS,
      payload: model
    };
  }

  public GetGSTR1SummaryDetailsResponse(result: BaseResponse<Gstr1SummaryResponse, Gstr1SummaryRequest>): CustomActions {
    return {
      type: GSTR_ACTIONS.GET_GSTR1_SUMMARY_DETAILS_RESPONSE,
      payload: result
    };
  }

  public SetSelectedPeriod(period) {
    return {
      type: GSTR_ACTIONS.CURRENT_PERIOD,
      payload: period
    };
  }
}
