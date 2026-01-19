import { Injectable } from '@angular/core';
import { CustomActions } from '../../store/custom-actions';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { GST_RECONCILE_ACTIONS, GSTR_ACTIONS } from './gst-reconcile.const';
import { FileGstr1Request, GetGspSessionResponse, GstOverViewRequest, GstOverViewResult, Gstr1SummaryRequest, Gstr1SummaryResponse, GstReconcileInvoiceRequest, GstReconcileInvoiceResponse, GstrSheetDownloadRequest, GstSaveGspSessionRequest, GStTransactionRequest, GstTransactionResult, VerifyOtpRequest, Gstr3bOverviewResult } from '../../models/api-models/GstReconcile';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { ToasterService } from '../../services/toaster.service';
import { GstReconcileService } from '../../services/gst-reconcile.service';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import { GstReport } from '../../gst/constants/gst.constant';
import { LocaleService } from '../../services/locale.service';
import { GeneralService } from '../../services/general.service';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * GstReconcileActions actions
 * Defines gstreconcile related action creators for state management
 */
export class GstReconcileActions {

    public GstReconcileOtpRequest$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(GST_RECONCILE_ACTIONS.GST_RECONCILE_OTP_REQUEST)
            , switchMap((action: CustomActions) => {

                return this._reconcileService.GstReconcileGenerateOtp(action.payload.userName)
                    .pipe(
                        /**
                         * Handles map functionality
                         */
                        map((response: BaseResponse<string, string>) => {
                            /**
                             * Handles if functionality
                             */
                            if (response?.status === 'success') {
                                this._toasty.successToast(response?.body);
                            } else {
                                this._toasty.errorToast(response.message);
                            }
                            return this.GstReconcileOtpResponse(response);
                        }));
            })));

    public GstReconcileVerifyOtpRequest$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(GST_RECONCILE_ACTIONS.GST_RECONCILE_VERIFY_OTP_REQUEST)
            , switchMap((action: CustomActions) => {

                return this._reconcileService.GstReconcileVerifyOtp(action.payload.model)
                    .pipe(
                        /**
                         * Handles map functionality
                         */
                        map((response: BaseResponse<string, VerifyOtpRequest>) => {
                            /**
                             * Handles if functionality
                             */
                            if (response?.status === 'success') {
                                this._toasty.successToast(response?.body);
                            } else {
                                this._toasty.errorToast(response.message);
                            }
                            return this.GstReconcileVerifyOtpResponse(response);
                        }));
            })));

    public GstReconcileInvoicePeriodRequest$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(GST_RECONCILE_ACTIONS.GST_RECONCILE_INVOICE_REQUEST)
            , switchMap((action: CustomActions) => {

                return this._reconcileService.GstReconcileGetInvoices(action.payload)
                    .pipe(
                        /**
                         * Handles map functionality
                         */
                        map((response: BaseResponse<GstReconcileInvoiceResponse, GstReconcileInvoiceRequest>) => {
                            /**
                             * Handles if functionality
                             */
                            if (response?.status !== 'success') {
                                this._toasty.errorToast(response.message);
                            }
                            return this.GstReconcileInvoiceResponse(response);
                        }));
            })));

    public GetGstr1OverView$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(GSTR_ACTIONS.GET_GSTR1_OVERVIEW)
            , switchMap((action: CustomActions) => {

                return this._reconcileService.GetGstrOverview(action.payload.type, action.payload.model)
                    .pipe(
                        /**
                         * Handles map functionality
                         */
                        map((response: BaseResponse<GstOverViewResult, GstOverViewRequest>) => {
                            /**
                             * Handles if functionality
                             */
                            if (response?.status !== 'success') {
                                this._toasty.errorToast(response.message);
                            }
                            return this.GetOverViewResponse(response);
                        }));
            })));

    public GetGstr2OverView$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(GSTR_ACTIONS.GET_GSTR2_OVERVIEW)
            , switchMap((action: CustomActions) => {

                return this._reconcileService.GetGstrOverview(action.payload.type, action.payload.model)
                    .pipe(
                        /**
                         * Handles map functionality
                         */
                        map((response: BaseResponse<GstOverViewResult, GstOverViewRequest>) => {
                            /**
                             * Handles if functionality
                             */
                            if (response?.status !== 'success') {
                                this._toasty.errorToast(response.message);
                            }
                            return this.GetOverViewResponse(response);
                        }));
            })));
    public GetGstr3BOverView$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(GSTR_ACTIONS.GET_GSTR3B_OVERVIEW)
            , switchMap((action: CustomActions) => {

                return this._reconcileService.GetGstr3BOverview(action.payload.type, action.payload.model)
                    .pipe(
                        /**
                         * Handles map functionality
                         */
                        map((response: BaseResponse<Gstr3bOverviewResult, GstOverViewRequest>) => {
                            return this.GetGstr3BOverViewResponse(response);
                        }));
            })));

    public GetGstr3BOverViewResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(GSTR_ACTIONS.GET_GSTR3B_OVERVIEW_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, GstOverViewRequest> = response.payload;
                /**
                 * Handles if functionality
                 */
                if (data?.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                }
                return { type: 'EmptyAction' };
            })));

    public GetSummaryTransaction$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(GSTR_ACTIONS.GET_SUMMARY_TRANSACTIONS)
            , switchMap((action: CustomActions) => {

                return this._reconcileService.GetSummaryTransaction(action.payload.type, action.payload.model)
                    .pipe(
                        /**
                         * Handles map functionality
                         */
                        map((response: BaseResponse<GstTransactionResult, GStTransactionRequest>) => {
                            /**
                             * Handles if functionality
                             */
                            if (response?.status !== 'success') {
                                this._toasty.errorToast(response.message);
                            }
                            return this.GetSummaryTransactionResponse(response);
                        }));
            })));

    public GetGSTR1SummaryDetails$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(GSTR_ACTIONS.GET_GSTR1_SUMMARY_DETAILS)
            , switchMap((action: CustomActions) => {

                return this._reconcileService.GetGstr1SummaryDetails(action.payload)
                    .pipe(
                        /**
                         * Handles map functionality
                         */
                        map((response: BaseResponse<Gstr1SummaryResponse, Gstr1SummaryRequest>) => {
                            /**
                             * Handles if functionality
                             */
                            if (response?.status !== 'success') {
                                this._toasty.errorToast(response.message);
                            }
                            return this.GetGSTR1SummaryDetailsResponse(response);
                        }));
            })));


    public DownloadGSTRSheet$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(GSTR_ACTIONS.DOWNLOAD_GSTR_SHEET),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this._reconcileService.DownloadGSTRSheet(action.payload).pipe(
                    /**
                     * Handles map functionality
                     */
                    map(response => this.DownloadGstrSheetResponse(response)));
            })));


    public DownloadGSTRSheetResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(GSTR_ACTIONS.DOWNLOAD_GSTR_SHEET_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, GstrSheetDownloadRequest> = response.payload;
                /**
                 * Handles if functionality
                 */
                if (data?.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this.downloadFile(data);
                    this._toasty.successToast(this.localeService.translate("app_messages.sheet_downloaded"));
                }
                return { type: 'EmptyAction' };
            })));


    public GstSaveGSPSession$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(GSTR_ACTIONS.GST_SAVE_GSP_SESSION),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this._reconcileService.SaveGSPSession(action.payload).pipe(
                    /**
                     * Handles map functionality
                     */
                    map(response => this.SaveGSPSessionResponse(response)));
            })));

    /**
     * Save Tax Pro RESPONSE
     */

    public GstSaveGSPSessionResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(GSTR_ACTIONS.GST_SAVE_GSP_SESSION_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, GstSaveGspSessionRequest> = response.payload;
                /**
                 * Handles if functionality
                 */
                if (data?.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast(data?.body);
                }
                return { type: 'EmptyAction' };
            })));


    public GstSaveGSPSessionWithOTP$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(GSTR_ACTIONS.GST_SAVE_GSP_SESSION_WITH_OTP),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this._reconcileService.SaveGSPSessionWithOTP(action.payload).pipe(
                    /**
                     * Handles map functionality
                     */
                    map(response => this.SaveGSPSessionWithOTPResponse(response)));
            })));


    public GstSaveGSPSessionWithOTPResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(GSTR_ACTIONS.GST_SAVE_GSP_SESSION_WITH_OTP_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, GstSaveGspSessionRequest> = response.payload;
                /**
                 * Handles if functionality
                 */
                if (data?.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast(data?.body);
                }
                return { type: 'EmptyAction' };
            })));

    public FileGstr1$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(GSTR_ACTIONS.FILE_GSTR1)
            , switchMap((action: CustomActions) => {

                return this._reconcileService.FileGstr1(action.payload)
                    .pipe(
                        /**
                         * Handles map functionality
                         */
                        map((response: BaseResponse<string, FileGstr1Request>) => {
                            /**
                             * Handles if functionality
                             */
                            if (response?.status === 'success') {
                                this._toasty.successToast(response?.body);
                            } else {
                                this._toasty.errorToast(response.message);
                            }
                            return this.FileGstr1Response(response);
                        }));
            })));


    public GetGSPSession$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(GSTR_ACTIONS.GST_GET_GSP_SESSION),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this._reconcileService.GetGSPSession(action.payload).pipe(
                    /**
                     * Handles map functionality
                     */
                    map(response => this.GetGSPSessionResponse(response)));
            })));

    /**
     * Creates an instance of actions
     * Initializes component dependencies and sets up initial state
     */
    constructor(private action$: Actions,
        private _toasty: ToasterService,
        private localeService: LocaleService,
        private _reconcileService: GstReconcileService,
        private generalService: GeneralService) {

    }

    /**
     * Handles GstReconcileOtpRequest functionality
     */
    public GstReconcileOtpRequest(userName: string): CustomActions {
        return {
            type: GST_RECONCILE_ACTIONS.GST_RECONCILE_OTP_REQUEST,
            payload: { userName }
        };
    }

    /**
     * Handles GstReconcileOtpResponse functionality
     */
    public GstReconcileOtpResponse(response: BaseResponse<string, string>): CustomActions {
        return {
            type: GST_RECONCILE_ACTIONS.GST_RECONCILE_OTP_RESPONSE,
            payload: response
        };
    }

    /**
     * Handles GstReconcileInvoiceRequest functionality
     */
    public GstReconcileInvoiceRequest(model: GstReconcileInvoiceRequest): CustomActions {
        return {
            type: GST_RECONCILE_ACTIONS.GST_RECONCILE_INVOICE_REQUEST,
            payload: model
        };
    }

    /**
     * Handles GstReconcileInvoiceResponse functionality
     */
    public GstReconcileInvoiceResponse(response: BaseResponse<GstReconcileInvoiceResponse, GstReconcileInvoiceRequest>): CustomActions {
        return {
            type: GST_RECONCILE_ACTIONS.GST_RECONCILE_INVOICE_RESPONSE,
            payload: response
        };
    }

    /**
     * Handles GstReconcileVerifyOtpRequest functionality
     */
    public GstReconcileVerifyOtpRequest(model: VerifyOtpRequest): CustomActions {
        return {
            type: GST_RECONCILE_ACTIONS.GST_RECONCILE_VERIFY_OTP_REQUEST,
            payload: { model }
        };
    }

    /**
     * Handles GstReconcileVerifyOtpResponse functionality
     */
    public GstReconcileVerifyOtpResponse(response: BaseResponse<string, VerifyOtpRequest>): CustomActions {
        return {
            type: GST_RECONCILE_ACTIONS.GST_RECONCILE_VERIFY_OTP_RESPONSE,
            payload: response
        };
    }

    /**
     * GetOverView
     */
    public GetOverView(type, model: GstOverViewRequest) {

        /**
         * Handles if functionality
         */
        if (type === GstReport.Gstr1 || type === GstReport.Gstr2) {
            return {
                type: type === GstReport.Gstr1 ? GSTR_ACTIONS.GET_GSTR1_OVERVIEW : GSTR_ACTIONS.GET_GSTR2_OVERVIEW,
                payload: { type, model }
            };
        }
        /**
         * Handles if functionality
         */
        if (type === GstReport.Gstr3b) {
            return {
                type: GSTR_ACTIONS.GET_GSTR3B_OVERVIEW,
                payload: { type, model }
            };
        }

    }

    /**
     * Handles GetOverViewResponse functionality
     */
    public GetOverViewResponse(res: BaseResponse<GstOverViewResult, GstOverViewRequest>) {
        let type = res.queryString?.type;
        return {
            type: type === GstReport.Gstr1 ? GSTR_ACTIONS.GET_GSTR1_OVERVIEW_RESPONSE : GSTR_ACTIONS.GET_GSTR2_OVERVIEW_RESPONSE,
            payload: res
        };
    }
    /**
     * Handles GetGstr3BOverViewResponse functionality
     */
    public GetGstr3BOverViewResponse(res: BaseResponse<Gstr3bOverviewResult, GstOverViewRequest>) {
        return {
            type: GSTR_ACTIONS.GET_GSTR3B_OVERVIEW_RESPONSE,
            payload: res
        };
    }

    /**
     * GetSummaryTransaction
     */
    public GetSummaryTransaction(type, model: GStTransactionRequest) {
        return {
            type: GSTR_ACTIONS.GET_SUMMARY_TRANSACTIONS,
            payload: { type, model }
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

    /**
     * Handles SetActiveCompanyGstin functionality
     */
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

    /**
     * Handles GetGSTR1SummaryDetailsResponse functionality
     */
    public GetGSTR1SummaryDetailsResponse(result: BaseResponse<Gstr1SummaryResponse, Gstr1SummaryRequest>): CustomActions {
        return {
            type: GSTR_ACTIONS.GET_GSTR1_SUMMARY_DETAILS_RESPONSE,
            payload: result
        };
    }

    /*
      Download Gstr sheet
     */
    public DownloadGstrSheet(model: GstrSheetDownloadRequest): CustomActions {
        return {
            type: GSTR_ACTIONS.DOWNLOAD_GSTR_SHEET,
            payload: model
        };
    }

    /**
     * Handles DownloadGstrSheetResponse functionality
     */
    public DownloadGstrSheetResponse(result: BaseResponse<any, GstrSheetDownloadRequest>): CustomActions {
        return {
            type: GSTR_ACTIONS.DOWNLOAD_GSTR_SHEET_RESPONSE,
            payload: result
        };
    }

    /**
     * Handles downloadFile functionality
     */
    public downloadFile(data: BaseResponse<any, GstrSheetDownloadRequest>) {
        let blob = this.generalService.base64ToBlob(data?.body.data, 'application/xls', 512);
        return saveAs(blob, data?.body.name);
    }

    /**
     * Handles SetSelectedPeriod functionality
     */
    public SetSelectedPeriod(period) {
        return {
            type: GSTR_ACTIONS.CURRENT_PERIOD,
            payload: period
        };
    }

    /*
      Save Session
    */
    public SaveGSPSession(model: GstSaveGspSessionRequest): CustomActions {
        return {
            type: GSTR_ACTIONS.GST_SAVE_GSP_SESSION,
            payload: model
        };
    }

    /**
     * Handles SaveGSPSessionResponse functionality
     */
    public SaveGSPSessionResponse(response: BaseResponse<any, GstSaveGspSessionRequest>): CustomActions {
        return {
            type: GSTR_ACTIONS.GST_SAVE_GSP_SESSION_RESPONSE,
            payload: response
        };
    }

    /*
      Save Session with OTP
    */
    public SaveGSPSessionWithOTP(model: GstSaveGspSessionRequest): CustomActions {
        return {
            type: GSTR_ACTIONS.GST_SAVE_GSP_SESSION_WITH_OTP,
            payload: model
        };
    }

    /**
     * Handles ResetGstAsideFlags functionality
     */
    public ResetGstAsideFlags() {
        return {
            type: GSTR_ACTIONS.GST_RESET_ASIDE_FLAGS
        };
    }

    /**
     * Handles SaveGSPSessionWithOTPResponse functionality
     */
    public SaveGSPSessionWithOTPResponse(response: BaseResponse<any, GstSaveGspSessionRequest>): CustomActions {
        return {
            type: GSTR_ACTIONS.GST_SAVE_GSP_SESSION_WITH_OTP_RESPONSE,
            payload: response
        };
    }

    // File Gstr 1
    /**
     * Handles FileGstr1 functionality
     */
    public FileGstr1(model: FileGstr1Request): CustomActions {
        return {
            type: GSTR_ACTIONS.FILE_GSTR1,
            payload: model
        };
    }

    /**
     * Handles FileGstr1Response functionality
     */
    public FileGstr1Response(result: BaseResponse<string, FileGstr1Request>): CustomActions {
        return {
            type: GSTR_ACTIONS.FILE_GSTR1_RESPONSE,
            payload: result
        };
    }

    // Get Gst Gsp Session
    /**
     * Handles GetGSPSession functionality
     */
    public GetGSPSession(gstIn: string): CustomActions {
        return {
            type: GSTR_ACTIONS.GST_GET_GSP_SESSION,
            payload: gstIn
        };
    }

    /**
     * Handles GetGSPSessionResponse functionality
     */
    public GetGSPSessionResponse(response: BaseResponse<GetGspSessionResponse, string>): CustomActions {
        return {
            type: GSTR_ACTIONS.GST_GET_GSP_SESSION_RESPONSE,
            payload: response
        };
    }

    /**
     * Resets the gstr3b response
     *
     * @returns {CustomActions}
     * @memberof GstReconcileActions
     */
    public resetGstr3BOverViewResponse(): CustomActions {
        return {
            type: GSTR_ACTIONS.RESET_GSTR3B_OVERVIEW_RESPONSE
        };
    }

    /**
     * Resets the gstr1 response
     *
     * @returns {CustomActions}
     * @memberof GstReconcileActions
     */
    public resetGstr1OverViewResponse(): CustomActions {
        return {
            type: GSTR_ACTIONS.RESET_GSTR1_OVERVIEW_RESPONSE
        };
    }

    /**
     * Resets the gstr2 response
     *
     * @returns {CustomActions}
     * @memberof GstReconcileActions
     */
    public resetGstr2OverViewResponse(): CustomActions {
        return {
            type: GSTR_ACTIONS.RESET_GSTR2_OVERVIEW_RESPONSE
        };
    }
}
