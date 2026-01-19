import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { InvoiceService } from '../../services/invoice.service';
import { InvoiceTemplatesService } from '../../services/invoice.templates.service';
import { EWAYBILL_ACTIONS, INVOICE, INVOICE_ACTIONS } from './invoice.const';
import { ToasterService } from '../../services/toaster.service';
import { Router } from '@angular/router';
import {
    CommonPaginatedRequest,
    GenerateInvoiceRequestClass,
    GetAllLedgersForInvoiceResponse,
    GetInvoiceTemplateDetailsResponse,
    IBulkInvoiceGenerationFalingError,
    IEwayBillAllList,
    IEwayBillCancel,
    IEwayBillfilter,
    IEwayBillTransporter,
    InvoiceFilterClass,
    InvoiceTemplateDetailsResponse,
    PreviewInvoiceRequest,
    PreviewInvoiceResponseClass,
    UpdateEwayVehicle
} from '../../models/api-models/Invoice';
import { InvoiceSetting } from '../../models/interfaces/invoice.setting.interface';
import { RazorPayDetailsResponse } from '../../models/api-models/SettingsIntegraion';
import { saveAs } from 'file-saver';
import { CustomActions } from '../../store/custom-actions';
import { RecurringInvoice } from '../../models/interfaces/recurring-invoice';
import { RecurringVoucherService } from '../../services/recurring-voucher.service';
import { InvoiceBulkUpdateService } from '../../services/invoice.bulkupdate.service';
import { LocaleService } from '../../services/locale.service';
import { GeneralService } from '../../services/general.service';
import { PAGINATION_LIMIT } from '../../app.constant';
import { forEach, isArray } from '../../lodash-optimized';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * InvoiceActions actions
 * Defines invoice related action creators for state management
 */
export class InvoiceActions {

    // get all ledgers for invoice

    public GetAllLedgersForInvoice$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE_ACTIONS.GET_ALL_LEDGERS_FOR_INVOICE),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._invoiceService.GetAllLedgersForInvoice(action.payload.model, action.payload?.body)),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<GetAllLedgersForInvoiceResponse, CommonPaginatedRequest>(res, {
                type: INVOICE_ACTIONS.GET_ALL_LEDGERS_FOR_INVOICE_RESPONSE,
                payload: res
            }, true, {
                type: INVOICE_ACTIONS.GET_ALL_LEDGERS_FOR_INVOICE_RESPONSE,
                payload: res
            }))));

    // Preview Invoice

    public PreviewInvoice$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE_ACTIONS.PREVIEW_INVOICE),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._invoiceService.PreviewInvoice(action.payload.accountUniqueName, action.payload?.body)),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<PreviewInvoiceResponseClass, PreviewInvoiceRequest>(res, {
                type: INVOICE_ACTIONS.PREVIEW_INVOICE_RESPONSE,
                payload: res
            }, true, {
                type: INVOICE_ACTIONS.PREVIEW_INVOICE_RESPONSE,
                payload: res
            }))));

    // Preview of Generated Invoice

    public PreviewOfGeneratedInvoice$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE_ACTIONS.PREVIEW_OF_GENERATED_INVOICE),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._invoiceService.GetGeneratedInvoicePreview(action.payload.accountUniqueName, action.payload.invoiceNumber)),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<PreviewInvoiceResponseClass, string>(res, {
                type: INVOICE_ACTIONS.PREVIEW_OF_GENERATED_INVOICE_RESPONSE,
                payload: res
            }, true, {
                type: INVOICE_ACTIONS.PREVIEW_OF_GENERATED_INVOICE_RESPONSE,
                payload: res
            }))));

    // Preview of Generated Invoice

    public UpdateGeneratedInvoice$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE_ACTIONS.UPDATE_GENERATED_INVOICE),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._invoiceService.UpdateGeneratedInvoice(action.payload.accountUniqueName, action.payload?.body)),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<string, GenerateInvoiceRequestClass>(res, {
                type: INVOICE_ACTIONS.UPDATE_GENERATED_INVOICE_RESPONSE,
                payload: res
            }, true, {
                type: INVOICE_ACTIONS.UPDATE_GENERATED_INVOICE_RESPONSE,
                payload: res
            }))));

    // Generate Invoice

    public GenerateInvoice$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE_ACTIONS.GENERATE_INVOICE),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._invoiceService.GenerateInvoice(action.payload.accountUniqueName, action.payload?.body)),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<GenerateInvoiceRequestClass, string>(res, {
                type: INVOICE_ACTIONS.GENERATE_INVOICE_RESPONSE,
                payload: res
            }, true, {
                type: INVOICE_ACTIONS.GENERATE_INVOICE_RESPONSE,
                payload: res
            }))));

    public GenerateBulkInvoice$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE_ACTIONS.GENERATE_BULK_INVOICE),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._invoiceService.GenerateBulkInvoice(action.payload.reqObj, action.payload?.body, action.payload.requestedFrom)),
            /**
             * Handles map functionality
             */
            map(response => {
                return this.GenerateBulkInvoiceResponse(response);
            })));

    public GenerateBulkInvoiceResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE_ACTIONS.GENERATE_BULK_INVOICE_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                /**
                 * Handles if functionality
                 */
                if (data?.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else if (data?.status === 'einvoice-confirm') {
                    return this.setBulkGenerateConfirm(data);
                } else {
                    /**
                     * Handles if functionality
                     */
                    if (typeof data?.body === 'string') {
                        this._toasty.successToast(data?.body);
                    } else if (isArray(data?.body) && data?.body?.length > 0) {
                        /**
                         * Handles forEach functionality
                         */
                        forEach(data?.body, (item: IBulkInvoiceGenerationFalingError) => {
                            this._toasty.warningToast(item.reason);
                        });
                    }
                }
                return { type: 'EmptyAction' };
            })));

    // Delete Invoice

    public DeleteInvoice$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE_ACTIONS.DELETE_INVOICE),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._invoiceService.DeleteInvoice(action.payload.model, action.payload.accountUniqueName)),
            /**
             * Handles map functionality
             */
            map(response => {
                return this.DeleteInvoiceResponse(response);
            })));

    public DeleteInvoiceResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE_ACTIONS.DELETE_INVOICE_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<string, string> = response.payload;
                /**
                 * Handles if functionality
                 */
                if (data?.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast(this.localeService.translate("app_messages.invoice_deleted"));
                }
                return { type: 'EmptyAction' };
            })));

    // Action On Invoice

    public ActionOnInvoice$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE_ACTIONS.ACTION_ON_INVOICE),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._invoiceService.PerformActionOnInvoice(action.payload.invoiceUniqueName, action.payload.action)),
            /**
             * Handles map functionality
             */
            map(response => {
                return this.ActionOnInvoiceResponse(response);
            })));

    public ActionOnInvoiceResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE_ACTIONS.ACTION_ON_INVOICE_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<string, string> = response.payload;
                /**
                 * Handles if functionality
                 */
                if (data?.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast(this.localeService.translate("app_messages.invoice_updated"));
                }
                return { type: 'EmptyAction' }; // Refresh the list
            })));

    public GetTemplateDetailsOfInvoice$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE_ACTIONS.GET_INVOICE_TEMPLATE_DETAILS),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._invoiceService.GetInvoiceTemplateDetails(action.payload)),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<InvoiceTemplateDetailsResponse, string>(res, {
                type: INVOICE_ACTIONS.GET_INVOICE_TEMPLATE_DETAILS_RESPONSE,
                payload: res
            }, true, {
                type: INVOICE_ACTIONS.GET_INVOICE_TEMPLATE_DETAILS_RESPONSE,
                payload: res
            }))));

    /**
     * GET_ALL INVOICE SETTING
     */

    public getInvoiceSetting$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE.SETTING.GET_INVOICE_SETTING),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._invoiceService.GetInvoiceSetting()),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<InvoiceSetting, string>(res, {
                type: INVOICE.SETTING.GET_INVOICE_SETTING_RESPONSE,
                payload: res
            }, true, {
                type: INVOICE.SETTING.GET_INVOICE_SETTING_RESPONSE,
                payload: res
            }))));

    /**
     * DELETE INVOICE WEBHOOK
     */

    public DeleteWebhook$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE.SETTING.DELETE_WEBHOOK),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._invoiceService.DeleteInvoiceWebhook(action.payload)),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<string, string>(res, {
                type: INVOICE.SETTING.DELETE_WEBHOOK_RESPONSE,
                payload: res
            }, true, {
                type: INVOICE.SETTING.DELETE_WEBHOOK_RESPONSE,
                payload: res
            }))));

    /**
     * UPDATE INVOICE EMAILID
     */

    public UpdateInvoiceEmail$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE.SETTING.UPDATE_INVOICE_EMAIL),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._invoiceService.UpdateInvoiceEmail(action.payload)),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<string, string>(res, {
                type: INVOICE.SETTING.UPDATE_INVOICE_EMAIL_RESPONSE,
                payload: res
            }, true, {
                type: INVOICE.SETTING.UPDATE_INVOICE_EMAIL_RESPONSE,
                payload: res
            }))));

    /**
     * SAVE INVOICE WEBHOOK
     */

    public SaveInvoiceWebhook$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE.SETTING.SAVE_INVOICE_WEBHOOK),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._invoiceService.SaveInvoiceWebhook(action.payload)),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<string, string>(res, {
                type: INVOICE.SETTING.SAVE_INVOICE_WEBHOOK_RESPONSE,
                payload: res
            }, true, {
                type: INVOICE.SETTING.SAVE_INVOICE_WEBHOOK_RESPONSE,
                payload: res
            }))));

    /**
     * UPDATE INVOICE SETTING
     */

    public updateInvoiceSetting$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE.SETTING.UPDATE_INVOICE_SETTING),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._invoiceService.UpdateInvoiceSetting(action.payload)),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<string, string>(res, {
                type: INVOICE.SETTING.UPDATE_INVOICE_SETTING_RESPONSE,
                payload: res
            }, true, {
                type: INVOICE.SETTING.UPDATE_INVOICE_SETTING_RESPONSE,
                payload: res
            }))));

    /**
     * GET_ALL RAZORPAY DETAIL
     */

    public GetRazorPayDetail$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE.SETTING.GET_RAZORPAY_DETAIL),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._invoiceService.GetRazorPayDetail()),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<RazorPayDetailsResponse, string>(res, {
                type: INVOICE.SETTING.GET_RAZORPAY_DETAIL_RESPONSE,
                payload: res
            }, true, {
                type: INVOICE.SETTING.GET_RAZORPAY_DETAIL_RESPONSE,
                payload: res
            }))));

    /**
     * UPDATE RAZORPAY DETAIL
     */

    public UpdateRazorPayDetail$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE.SETTING.UPDATE_RAZORPAY_DETAIL),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._invoiceService.UpdateRazorPayDetail(action.payload)),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<RazorPayDetailsResponse, string>(res, {
                type: INVOICE.SETTING.UPDATE_RAZORPAY_DETAIL_RESPONSE,
                payload: res
            }, true, {
                type: INVOICE.SETTING.UPDATE_RAZORPAY_DETAIL_RESPONSE,
                payload: res
            }))));

    /**
     * DELETE RAZORPAY DETAIL
     */

    public DeleteRazorPayDetail$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE.SETTING.DELETE_RAZORPAY_DETAIL),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._invoiceService.DeleteRazorPayDetail()),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<string, string>(res, {
                type: INVOICE.SETTING.DELETE_RAZORPAY_DETAIL_RESPONSE,
                payload: res
            }, true, {
                type: INVOICE.SETTING.UPDATE_RAZORPAY_DETAIL_RESPONSE,
                payload: res
            }))));

    /**
     * DELETE INVOICE EMAIL
     */

    public DeleteInvoiceEmail$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE.SETTING.DELETE_INVOICE_EMAIL),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._invoiceService.DeleteInvoiceEmail(action.payload)),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<string, string>(res, {
                type: INVOICE.SETTING.DELETE_INVOICE_EMAIL_RESPONSE,
                payload: res
            }, true, {
                type: INVOICE.SETTING.DELETE_INVOICE_EMAIL_RESPONSE,
                payload: res
            }))));

    /**
     * SAVE RAZORPAY DETAIL
     */

    public SaveRazorPayDetail$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE.SETTING.SAVE_RAZORPAY_DETAIL),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._invoiceService.SaveRazorPayDetail(action.payload)),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<RazorPayDetailsResponse, string>(res, {
                type: INVOICE.SETTING.SAVE_RAZORPAY_DETAIL_RESPONSE,
                payload: res
            }, true, {
                type: INVOICE.SETTING.SAVE_RAZORPAY_DETAIL_RESPONSE,
                payload: res
            }))));

    public DownloadInvoice$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE_ACTIONS.DOWNLOAD_INVOICE),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this._invoiceService.DownloadInvoice(action.payload.accountUniqueName, action.payload.dataToSend).pipe(
                    /**
                     * Handles map functionality
                     */
                    map(response => this.DownloadInvoiceResponse(response)));
            })));

    public DownloadInvoiceResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE_ACTIONS.DOWNLOAD_INVOICE_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, string> = response.payload;
                /**
                 * Handles if functionality
                 */
                if (data?.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    let type = 'pdf';
                    let req = data.queryString.dataToSend;
                    /**
                     * Handles if functionality
                     */
                    if (req?.typeOfInvoice?.length > 1) {
                        type = 'zip';
                    }
                    let fileName = req?.voucherNumber[0];
                    this.downloadFile(data?.body, type, fileName);
                }
                return { type: 'EmptyAction' };
            })));

    public DownloadExportedInvoice$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE_ACTIONS.DOWNLOAD_INVOICE_EXPORTED),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this._invoiceService.exportCsvInvoiceDownload(action.payload).pipe(
                    /**
                     * Handles map functionality
                     */
                    map(response => this.DownloadExportedInvoiceResponse(response)));
            })));

    public SendInvoiceOnMail$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE_ACTIONS.SEND_MAIL),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this._invoiceService.SendInvoiceOnMail(action.payload.accountUniqueName, action.payload.dataToSend).pipe(
                    /**
                     * Handles map functionality
                     */
                    map(response => this.SendInvoiceOnMailResponse(response)));
            })));

    public SendInvoiceOnMailResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE_ACTIONS.SEND_MAIL_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, string> = response.payload;
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

    public SendInvoiceOnSms$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE_ACTIONS.SEND_SMS),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this._invoiceService.SendInvoiceOnSms(action.payload.accountUniqueName, action.payload.dataToSend, action.payload.voucherNumber).pipe(
                    /**
                     * Handles map functionality
                     */
                    map(response => this.SendInvoiceOnSmsResponse(response)));
            })));

    public SendInvoiceOnSmsResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE_ACTIONS.SEND_SMS_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, string> = response.payload;
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

    // Transporter effects

    public addEwayBillTransporter$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(EWAYBILL_ACTIONS.ADD_TRANSPORTER),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this._invoiceService.addEwayTransporter(action.payload).pipe(
                    /**
                     * Handles map functionality
                     */
                    map(response => this.addEwayBillTransporterResponse(response)));
            })));

    public addEwayBillTransporterResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(EWAYBILL_ACTIONS.ADD_TRANSPORTER_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, string> = response.payload;
                /**
                 * Handles if functionality
                 */
                if (data?.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast(this.localeService.translate("app_messages.transporter_added"));
                }
                return { type: 'EmptyAction' };
            })));

    public updateEwayBillTransporter$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(EWAYBILL_ACTIONS.UPDATE_TRANSPORTER),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this._invoiceService.UpdateGeneratedTransporter(action.payload.currentTransportId, action.payload.transportObj).pipe(
                    /**
                     * Handles map functionality
                     */
                    map(response => this.updateEwayBillTransporterResponse(response)));
            })));

    public updateEwayBillTransporterResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(EWAYBILL_ACTIONS.UPDATE_TRANSPORTER_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, string> = response.payload;
                /**
                 * Handles if functionality
                 */
                if (data?.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast(this.localeService.translate("app_messages.transporter_updated"));
                }
                return { type: 'EmptyAction' };
            })));

    public UpdateEwayVehicle$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(EWAYBILL_ACTIONS.UPDATE_EWAY_VEHICLE),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._invoiceService.updateEwayVehicle(action.payload)),
            /**
             * Handles map functionality
             */
            map(response => this.UpdateEwayVehicleResponse(response))));

    public LoginEwaybillUser$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(EWAYBILL_ACTIONS.LOGIN_EAYBILL_USER),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this._invoiceService.LoginEwaybillUser(action.payload).pipe(
                    /**
                     * Handles map functionality
                     */
                    map(response => this.LoginEwaybillUserResponse(response)));
            })));

    //  EWAYBILL_ACTIONS.LOGIN_EAYBILL_USER

    public LoginEwaybillUserResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(EWAYBILL_ACTIONS.LOGIN_EAYBILL_USER_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, string> = response.payload;
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
    // Is logged in user in Eway Bill IsUserLoginEwayBill

    public isLoggedInUserEwayBill$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(EWAYBILL_ACTIONS.IS_LOOGEDIN_USER_EWAYBILL),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this._invoiceService.IsUserLoginEwayBill().pipe(
                    /**
                     * Handles map functionality
                     */
                    map(response => this.isLoggedInUserEwayBillResponse(response)));
            })));
    // Is logged in user in Eway Bill response

    public isLoggedInUserEwayBillResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(EWAYBILL_ACTIONS.IS_LOOGEDIN_USER_EWAYBILL_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, string> = response.payload;
                return { type: 'EmptyAction' };
            })));
    // generate Eway bill request

    public GenerateNewEwaybill$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(EWAYBILL_ACTIONS.GENERATE_EWAYBILL),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this._invoiceService.GenerateNewEwaybill(action.payload).pipe(
                    /**
                     * Handles map functionality
                     */
                    map(response => this.GenerateNewEwaybillResponse(response)));
            })));

    // Generate eway bill respone

    public GenerateNewEwaybillResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(EWAYBILL_ACTIONS.GENERATE_EWAYBILL_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, string> = response.payload;
                /**
                 * Handles if functionality
                 */
                if (data?.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    let text = this.localeService.translate("app_messages.eway_bill_generated");
                    text = text?.replace("[EWAY_BILL_NO]", data?.body?.ewayBillNo);
                    this._toasty.successToast(text);
                    this._router.navigate(['/pages/invoice/ewaybill']);
                }
                return { type: 'EmptyAction' };
            })));
    // CANCEL Eway bill request

    public cancelEwayBill$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(EWAYBILL_ACTIONS.CANCEL_EWAYBILL),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this._invoiceService.cancelEwayBill(action.payload).pipe(
                    /**
                     * Handles map functionality
                     */
                    map(response => this.cancelEwayBillResponse(response)));
            })));

    // CANCEL eway bill respone

    public cancelEwayBillResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(EWAYBILL_ACTIONS.CANCEL_EWAYBILL_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, string> = response.payload;
                /**
                 * Handles if functionality
                 */
                if (data?.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    /**
                     * Handles if functionality
                     */
                    if (data?.status === 'success') {
                        this._toasty.successToast(data?.body);
                    }
                }
                return { type: 'EmptyAction' };
            })));

    public UpdateEwayVehicleResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(EWAYBILL_ACTIONS.UPDATE_EWAY_VEHICLE_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                /**
                 * Handles if functionality
                 */
                if (data?.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    let text = this.localeService.translate("app_messages.vehicle_data_updated");
                    text = text?.replace("[VEHICLE_UPDATE_DATE]", data?.body?.vehUpdDate)?.replace("[VALID_UPTO]", data?.body?.validUpto);
                    this._toasty.successToast(text);
                }
                return { type: 'EmptyAction' };
            })));

    // Get all eway bill request

    public getALLEwaybillList$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(EWAYBILL_ACTIONS.GET_All_LIST_EWAYBILLS),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._invoiceService.getAllEwaybillsList()),
            /**
             * Handles map functionality
             */
            map((response: BaseResponse<IEwayBillAllList, any>) => {
                /**
                 * Handles if functionality
                 */
                if (response?.status === 'success') {
                    // this.showToaster('');
                } else {
                    this._toasty.errorToast(response.message);
                }
                return this.getALLEwaybillListResponse(response);
            })));

    // Get all eway bill list response

    public getALLEwaybillListResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(EWAYBILL_ACTIONS.GET_All_LIST_EWAYBILLS_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<IEwayBillAllList, any> = response.payload;
                /**
                 * Handles if functionality
                 */
                if (data && data.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                }
                /**
                 * Handles if functionality
                 */
                if (data && data.status === 'success' && data?.body?.results?.length === 0) {
                    this._toasty.errorToast(this.localeService.translate("app_no_entries_found"));
                }
                return { type: 'EmptyAction' };
            })));

    public getALLTransporterList$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(EWAYBILL_ACTIONS.GET_ALL_TRANSPORTER),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._invoiceService.getAllTransporterList(action.payload)),
            /**
             * Handles map functionality
             */
            map((response: BaseResponse<IEwayBillTransporter, any>) => {
                /**
                 * Handles if functionality
                 */
                if (response?.status === 'success') {
                    // this.showToaster('');
                } else {
                    this._toasty.errorToast(response.message);
                }
                return this.getALLTransporterListResponse(response);
            })));

    // Get all eway bill list response

    public getALLTransporterListResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(EWAYBILL_ACTIONS.GET_ALL_TRANSPORTER_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<IEwayBillTransporter, any> = response.payload;
                /**
                 * Handles if functionality
                 */
                if (data && data.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                }
                return { type: 'EmptyAction' };
            })));
    // transporter effects

    public deleteTransporter$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(EWAYBILL_ACTIONS.DELETE_TRANSPORTER),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._invoiceService.deleteTransporterById(action.payload)),
            /**
             * Handles map functionality
             */
            map(response => {
                return this.deleteTransporteResponse(response);
            })));

    public deleteTransporterResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(EWAYBILL_ACTIONS.DELETE_TRANSPORTER_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
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

    public GetAllEwayfilterRequest$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(EWAYBILL_ACTIONS.GET_All_FILTERED_LIST_EWAYBILLS),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._invoiceService.getAllEwaybillsfilterList(action.payload?.body)),
            /**
             * Handles map functionality
             */
            map((response: BaseResponse<IEwayBillAllList, IEwayBillfilter>) => {
                return this.GetAllEwayfilterResponse(response);
            })));

    // GET_ALL SAMPLE TEMPLATES

    public GetSampleTemplates$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE.TEMPLATE.GET_SAMPLE_TEMPLATES),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._invoiceTemplatesService.getTemplates()),
            /**
             * Handles map functionality
             */
            map(response => {
                return this.getSampleTemplateResponse(response);
            })));

    public getSampleTemplateResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE.TEMPLATE.GET_SAMPLE_TEMPLATES_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                /**
                 * Handles if functionality
                 */
                if (data && data.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                }
                return { type: 'EmptyAction' };
            })));

    // GET_ALL CUSTOM CREATED TEMPLATES

    public getAllCreatedTemplates$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE.TEMPLATE.GET_ALL_CREATED_TEMPLATES),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._invoiceTemplatesService.getAllCreatedTemplates(action.payload)),
            /**
             * Handles map functionality
             */
            map(response => {
                return this.getAllCreatedTemplatesResponse(response);
            })));

    public getAllCreatedTemplatesResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE.TEMPLATE.GET_ALL_CREATED_TEMPLATES_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                /**
                 * Handles if functionality
                 */
                if (data && data.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                }
                return { type: 'EmptyAction' };
            })));

    // SET TEMPLATE AS DEFAULT

    public setTemplateAsDefault$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE.TEMPLATE.SET_TEMPLATE_AS_DEFAULT),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._invoiceTemplatesService.setTemplateAsDefault(action.payload?.templateUniqueName, action.payload?.templateType)),
            /**
             * Handles map functionality
             */
            map(response => {
                return this.setTemplateAsDefaultResponse(response);
            })));

    public setTemplateAsDefaultResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE.TEMPLATE.SET_TEMPLATE_AS_DEFAULT_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                /**
                 * Handles if functionality
                 */
                if (data?.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast(this.localeService.translate("app_messages.template_marked_default"));
                }
                return { type: 'EmptyAction' };
            })));

    // DELETE TEMPLATE

    public deleteTemplate$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE.TEMPLATE.DELETE_TEMPLATE),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._invoiceTemplatesService.deleteTemplate(action.payload)),
            /**
             * Handles map functionality
             */
            map(response => {
                return this.deleteTemplateResponse(response);
            })));

    public deleteTemplateResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE.TEMPLATE.DELETE_TEMPLATE_RESPONSE),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                /**
                 * Handles if functionality
                 */
                if (data?.status === 'error') {
                    this._toasty.errorToast(data?.message, data?.code);
                } else {
                    this._toasty.successToast(data?.body);
                }
                return { type: 'EmptyAction' };
            })));
    // GET_ALL All Recurring Vouchers

    public GetAllRecurringInvoices$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE.RECURRING.GET_RECURRING_INVOICE_DATA),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._recurringService.getRecurringVouchers(action.payload)),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<RecurringInvoice[], string>(res, this.GetAllRecurringInvoicesResponse(res?.body), true, this.noPermissionsRecurringInvoice()))));
    /**
     * SAVE Recurring Voucher
     */

    public SaveRecurrigVoucher$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE.RECURRING.CREATE_RECURRING_INVOICE),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._recurringService.createRecurringVouchers(action.payload)),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<RecurringInvoice, string>(res, this.createRecurringInvoiceResponse(res?.body), true, this.createRecurringInvoiceResponse(res?.body), this.localeService.translate("app_messages.recurring_invoice_created")))));

    /**
     * UPDATE Recurring Vouchers
     */

    public UpdateRecurringVouchers$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE.RECURRING.UPDATE_RECURRING_INVOICE),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._recurringService.updateRecurringVouchers(action.payload)),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<RecurringInvoice, string>(res, this.updateRecurringInvoiceResponse(res?.body), true,
                this.updateRecurringInvoiceResponse(null), this.localeService.translate("app_messages.recurring_invoice_updated")))));

    public GenerateBulkEInvoice$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVOICE_ACTIONS.GENERATE_BULK_E_INVOICE),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this.bulkUpdateInvoice.bulkUpdateInvoice(action.payload.model, action.payload.actionType)),
            /**
             * Handles map functionality
             */
            map(res => this.validateResponse<GetAllLedgersForInvoiceResponse, CommonPaginatedRequest>(res, {
                type: INVOICE_ACTIONS.GENERATE_BULK_E_INVOICE_RESPONSE
            }, true, {
                type: INVOICE_ACTIONS.GENERATE_BULK_E_INVOICE_RESPONSE
            }))));

    /**
     * Creates an instance of actions
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private action$: Actions,
        private _invoiceService: InvoiceService,
        private bulkUpdateInvoice: InvoiceBulkUpdateService,
        private _recurringService: RecurringVoucherService,
        private _invoiceTemplatesService: InvoiceTemplatesService,
        private _toasty: ToasterService,
        private _router: Router,
        private localeService: LocaleService,
        private generalService: GeneralService
    ) {
    }

    /**
     * Handles downloadFile functionality
     */
    public downloadFile(data: Response, type: string, fileName) {
        let blob = this.generalService.base64ToBlob(data, 'application/' + type, 512);
        return saveAs(blob, `${fileName}.` + type);
    }

    /**
     * Handles GetAllRecurringInvoices functionality
     */
    public GetAllRecurringInvoices(filter?, page: number = 1, count: number = PAGINATION_LIMIT): CustomActions {
        return {
            type: INVOICE.RECURRING.GET_RECURRING_INVOICE_DATA,
            payload: { filter, page, count }
        };
    }

    /**
     * Handles GetAllRecurringInvoicesResponse functionality
     */
    public GetAllRecurringInvoicesResponse(model: RecurringInvoice[]): CustomActions {
        return {
            type: INVOICE.RECURRING.GET_RECURRING_INVOICE_DATA_RESPONSE,
            payload: model
        };
    }

    /**
     * Handles GetAllLedgersForInvoice functionality
     */
    public GetAllLedgersForInvoice(model: CommonPaginatedRequest, data: InvoiceFilterClass): CustomActions {
        return {
            type: INVOICE_ACTIONS.GET_ALL_LEDGERS_FOR_INVOICE,
            payload: { model, body: data }
        };
    }

    /**
     * Handles GetAllLedgersForInvoiceResponse functionality
     */
    public GetAllLedgersForInvoiceResponse(model: GetAllLedgersForInvoiceResponse): CustomActions {
        return {
            type: INVOICE_ACTIONS.GET_ALL_LEDGERS_FOR_INVOICE_RESPONSE,
            payload: model
        };
    }

    /**
     * Handles PreviewInvoice functionality
     */
    public PreviewInvoice(accountUniqueName: string, model: PreviewInvoiceRequest): CustomActions {
        return {
            type: INVOICE_ACTIONS.PREVIEW_INVOICE,
            payload: { accountUniqueName, body: model }
        };
    }

    /**
     * Handles PreviewInvoiceResponse functionality
     */
    public PreviewInvoiceResponse(model: PreviewInvoiceResponseClass): CustomActions {
        return {
            type: INVOICE_ACTIONS.PREVIEW_INVOICE_RESPONSE,
            payload: model
        };
    }

    /**
     * Handles PreviewOfGeneratedInvoice functionality
     */
    public PreviewOfGeneratedInvoice(accountUniqueName: string, invoiceNumber: string): CustomActions {
        return {
            type: INVOICE_ACTIONS.PREVIEW_OF_GENERATED_INVOICE,
            payload: { accountUniqueName, invoiceNumber }
        };
    }

    /**
     * Handles PreviewOfGeneratedInvoiceResponse functionality
     */
    public PreviewOfGeneratedInvoiceResponse(model: PreviewInvoiceResponseClass): CustomActions {
        return {
            type: INVOICE_ACTIONS.PREVIEW_OF_GENERATED_INVOICE_RESPONSE,
            payload: model
        };
    }

    /**
     * Handles UpdateGeneratedInvoice functionality
     */
    public UpdateGeneratedInvoice(accountUniqueName: string, model: GenerateInvoiceRequestClass): CustomActions {
        return {
            type: INVOICE_ACTIONS.UPDATE_GENERATED_INVOICE,
            payload: { accountUniqueName, body: model }
        };
    }

    /**
     * Handles GenerateInvoice functionality
     */
    public GenerateInvoice(accountUniqueName: string, model: GenerateInvoiceRequestClass): CustomActions {
        return {
            type: INVOICE_ACTIONS.GENERATE_INVOICE,
            payload: { accountUniqueName, body: model }
        };
    }

    /**
     * Handles GenerateInvoiceResponse functionality
     */
    public GenerateInvoiceResponse(model: GenerateInvoiceRequestClass): CustomActions {
        return {
            type: INVOICE_ACTIONS.GENERATE_INVOICE_RESPONSE,
            payload: model
        };
    }

    /**
     * Handles GenerateBulkInvoice functionality
     */
    public GenerateBulkInvoice(reqObj: { combined: boolean }, model: any, requestedFrom?: string): CustomActions {
        return {
            type: INVOICE_ACTIONS.GENERATE_BULK_INVOICE,
            payload: { reqObj, body: model, requestedFrom }
        };
    }

    /**
     * Handles GenerateBulkInvoiceResponse functionality
     */
    public GenerateBulkInvoiceResponse(model: any): CustomActions {
        return {
            type: INVOICE_ACTIONS.GENERATE_BULK_INVOICE_RESPONSE,
            payload: model
        };
    }

    /**
     * Handles GetTemplateDetailsOfInvoice functionality
     */
    public GetTemplateDetailsOfInvoice(model: string): CustomActions {
        return {
            type: INVOICE_ACTIONS.GET_INVOICE_TEMPLATE_DETAILS,
            payload: model
        };
    }

    /**
     * Handles GetTemplateDetailsOfInvoiceResponse functionality
     */
    public GetTemplateDetailsOfInvoiceResponse(model: BaseResponse<GetInvoiceTemplateDetailsResponse, string>): CustomActions {
        return {
            type: INVOICE_ACTIONS.GET_INVOICE_TEMPLATE_DETAILS_RESPONSE,
            payload: model
        };
    }

    /**
     * Handles DeleteInvoice functionality
     */
    public DeleteInvoice(model: object, accountUniqueName): CustomActions {
        return {
            type: INVOICE_ACTIONS.DELETE_INVOICE,
            payload: { model, accountUniqueName }
        };
    }

    /**
     * Handles DeleteInvoiceResponse functionality
     */
    public DeleteInvoiceResponse(model): CustomActions {
        return {
            type: INVOICE_ACTIONS.DELETE_INVOICE_RESPONSE,
            payload: model
        };
    }

    /**
     * Handles ActionOnInvoice functionality
     */
    public ActionOnInvoice(invoiceUniqueName: string, action: object): CustomActions {
        return {
            type: INVOICE_ACTIONS.ACTION_ON_INVOICE,
            payload: { invoiceUniqueName, action }
        };
    }

    /**
     * Handles ActionOnInvoiceResponse functionality
     */
    public ActionOnInvoiceResponse(model: any): CustomActions {
        return {
            type: INVOICE_ACTIONS.ACTION_ON_INVOICE_RESPONSE,
            payload: model
        };
    }

    /**
     * Resets invoice action
     *
     * @returns {CustomActions}
     * @memberof InvoiceActions
     */
    public resetActionOnInvoice(): CustomActions {
        return {
            type: INVOICE_ACTIONS.RESET_ACTION_ON_INVOICE
        };
    }

    /**
     * Handles ModifiedInvoiceStateData functionality
     */
    public ModifiedInvoiceStateData(model: string[]): CustomActions {
        return {
            type: INVOICE_ACTIONS.MODIFIED_INVOICE_STATE_DATA,
            payload: model
        };
    }

    /**
     * Handles InvoiceGenerationCompleted functionality
     */
    public InvoiceGenerationCompleted(): CustomActions {
        return {
            type: INVOICE_ACTIONS.INVOICE_GENERATION_COMPLETED,
            payload: ''
        };
    }

    /**
     * Handles ResetInvoiceData functionality
     */
    public ResetInvoiceData(): CustomActions {
        return {
            type: INVOICE_ACTIONS.RESET_INVOICE_DATA,
            payload: ''
        };
    }

    /**
     * Retrieves templatestate data
     */
    public getTemplateState(): CustomActions {
        return {
            type: INVOICE.TEMPLATE.GET_SAMPLE_TEMPLATES
        };
    }

    /**
     * Retrieves allcreatedtemplates data
     */
    public getAllCreatedTemplates(templateType: any): CustomActions {
        return {
            type: INVOICE.TEMPLATE.GET_ALL_CREATED_TEMPLATES,
            payload: templateType
        };
    }

    /**
     * Retrieves allcreatedtemplatesresponse data
     */
    public getAllCreatedTemplatesResponse(response: any): CustomActions {
        return {
            type: INVOICE.TEMPLATE.GET_ALL_CREATED_TEMPLATES_RESPONSE,
            payload: response
        };
    }

    /**
     * Sets templateasdefault value
     */
    public setTemplateAsDefault(templateUniqueName: string, templateType: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.SET_TEMPLATE_AS_DEFAULT,
            payload: { templateUniqueName, templateType }
        };
    }

    /**
     * Sets templateasdefaultresponse value
     */
    public setTemplateAsDefaultResponse(response: any): CustomActions {
        return {
            type: INVOICE.TEMPLATE.SET_TEMPLATE_AS_DEFAULT_RESPONSE,
            payload: response
        };
    }

    /**
     * Deletes template
     */
    public deleteTemplate(templateUniqueName: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.DELETE_TEMPLATE,
            payload: templateUniqueName
        };
    }

    /**
     * Deletes templateresponse
     */
    public deleteTemplateResponse(response: any): CustomActions {
        return {
            type: INVOICE.TEMPLATE.DELETE_TEMPLATE_RESPONSE,
            payload: response
        };
    }

    /**
     * Retrieves sampletemplateresponse data
     */
    public getSampleTemplateResponse(response): CustomActions {
        return {
            type: INVOICE.TEMPLATE.GET_SAMPLE_TEMPLATES_RESPONSE,
            payload: response
        };
    }

    /**
     * Retrieves invoicesetting data
     */
    public getInvoiceSetting(): CustomActions {
        return {
            type: INVOICE.SETTING.GET_INVOICE_SETTING
        };
    }

    /**
     * Deletes webhook
     */
    public deleteWebhook(uniqueName: string): CustomActions {
        return {
            type: INVOICE.SETTING.DELETE_WEBHOOK,
            payload: uniqueName
        };
    }

    /**
     * Updates existing invoiceemail
     */
    public updateInvoiceEmail(emailId: string): CustomActions {
        return {
            type: INVOICE.SETTING.UPDATE_INVOICE_EMAIL,
            payload: emailId
        };
    }

    /**
     * Saves invoicewebhook data
     */
    public saveInvoiceWebhook(webhook: object): CustomActions {
        return {
            type: INVOICE.SETTING.SAVE_INVOICE_WEBHOOK,
            payload: webhook
        };
    }

    /**
     * Updates existing invoicesetting
     */
    public updateInvoiceSetting(form: object): CustomActions {
        return {
            type: INVOICE.SETTING.UPDATE_INVOICE_SETTING,
            payload: form
        };
    }

    /**
     * Retrieves razorpaydetail data
     */
    public getRazorPayDetail(): CustomActions {
        return {
            type: INVOICE.SETTING.GET_RAZORPAY_DETAIL
        };
    }

    /**
     * Updates existing razorpaydetail
     */
    public updateRazorPayDetail(form: object): CustomActions {
        return {
            type: INVOICE.SETTING.UPDATE_RAZORPAY_DETAIL,
            payload: form
        };
    }

    /**
     * Deletes razorpaydetail
     */
    public deleteRazorPayDetail(): CustomActions {
        return {
            type: INVOICE.SETTING.DELETE_RAZORPAY_DETAIL
        };
    }

    /**
     * Deletes invoiceemail
     */
    public deleteInvoiceEmail(emailId: string): CustomActions {
        return {
            type: INVOICE.SETTING.DELETE_INVOICE_EMAIL,
            payload: emailId
        };
    }

    /**
     * Handles SaveRazorPayDetail functionality
     */
    public SaveRazorPayDetail(form: object): CustomActions {
        return {
            type: INVOICE.SETTING.SAVE_RAZORPAY_DETAIL,
            payload: form
        };
    }

    /**
     * Handles DownloadInvoice functionality
     */
    public DownloadInvoice(accountUniqueName: string, dataToSend: { voucherNumber: string[], typeOfInvoice?: string[], voucherType?: string }): CustomActions {
        return {
            type: INVOICE_ACTIONS.DOWNLOAD_INVOICE,
            payload: { accountUniqueName, dataToSend }
        };
    }

    /**
     * Handles DownloadInvoiceResponse functionality
     */
    public DownloadInvoiceResponse(model: BaseResponse<string, string>): CustomActions {
        return {
            type: INVOICE_ACTIONS.DOWNLOAD_INVOICE_RESPONSE,
            payload: model
        };
    }

    /**
     * Handles DownloadExportedInvoice functionality
     */
    public DownloadExportedInvoice(model: any): CustomActions {
        return {
            type: INVOICE_ACTIONS.DOWNLOAD_INVOICE_EXPORTED,
            payload: model
        };
    }

    /**
     * Handles DownloadExportedInvoiceResponse functionality
     */
    public DownloadExportedInvoiceResponse(model: BaseResponse<string, string>): CustomActions {
        return {
            type: INVOICE_ACTIONS.DOWNLOAD_INVOICE_EXPORTED_RESPONSE,
            payload: model
        };
    }

    /**
     * Handles SendInvoiceOnMail functionality
     */
    public SendInvoiceOnMail(accountUniqueName: string, dataToSend: any): CustomActions {
        return {
            type: INVOICE_ACTIONS.SEND_MAIL,
            payload: { accountUniqueName, dataToSend }
        };
    }

    /**
     * Handles SendInvoiceOnMailResponse functionality
     */
    public SendInvoiceOnMailResponse(model: BaseResponse<string, string>): CustomActions {
        return {
            type: INVOICE_ACTIONS.SEND_MAIL_RESPONSE,
            payload: model
        };
    }

    /**
     * Creates new recurringinvoice
     */
    public createRecurringInvoice(model: RecurringInvoice): CustomActions {
        return {
            type: INVOICE.RECURRING.CREATE_RECURRING_INVOICE,
            payload: model
        };
    }

    /**
     * Creates new recurringinvoiceresponse
     */
    public createRecurringInvoiceResponse(model: RecurringInvoice): CustomActions {
        return {
            type: INVOICE.RECURRING.CREATE_RECURRING_INVOICE_RESPONSE,
            payload: model
        };
    }

    /**
     * Updates existing recurringinvoice
     */
    public updateRecurringInvoice(model: RecurringInvoice): CustomActions {
        return {
            type: INVOICE.RECURRING.UPDATE_RECURRING_INVOICE,
            payload: model
        };
    }

    /**
     * Updates existing recurringinvoiceresponse
     */
    public updateRecurringInvoiceResponse(model: RecurringInvoice): CustomActions {
        return {
            type: INVOICE.RECURRING.UPDATE_RECURRING_INVOICE_RESPONSE,
            payload: model
        };
    }

    /**
     * Resets recurringinvoicerequest to default state
     */
    public resetRecurringInvoiceRequest(): CustomActions {
        return {
            type: INVOICE.RECURRING.RESET_RECURRING_INVOICE_REQUEST
        };
    }

    /**
     * Handles SendInvoiceOnSms functionality
     */
    public SendInvoiceOnSms(accountUniqueName: string, dataToSend: { numbers: string[] }, voucherNumber): CustomActions {
        return {
            type: INVOICE_ACTIONS.SEND_SMS,
            payload: { accountUniqueName, dataToSend, voucherNumber }
        };
    }

    /**
     * Handles SendInvoiceOnSmsResponse functionality
     */
    public SendInvoiceOnSmsResponse(model: BaseResponse<string, string>): CustomActions {
        return {
            type: INVOICE_ACTIONS.SEND_SMS_RESPONSE,
            payload: model
        };
    }

    /**
     * Handles LoginEwaybillUser functionality
     */
    public LoginEwaybillUser(model: BaseResponse<string, string>): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.LOGIN_EAYBILL_USER,
            payload: model
        };
    }

    /**
     * Handles LoginEwaybillUserResponse functionality
     */
    public LoginEwaybillUserResponse(model: BaseResponse<string, string>): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.LOGIN_EAYBILL_USER_RESPONSE,
            payload: model
        };
    }

    /**
     * Handles isLoggedInUserEwayBill functionality
     */
    public isLoggedInUserEwayBill(): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.IS_LOOGEDIN_USER_EWAYBILL
        };
    }

    /**
     * Handles isLoggedInUserEwayBillResponse functionality
     */
    public isLoggedInUserEwayBillResponse(model: BaseResponse<string, string>): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.IS_LOOGEDIN_USER_EWAYBILL_RESPONSE,
            payload: model
        };
    }

    /**
     * Handles GenerateNewEwaybill functionality
     */
    public GenerateNewEwaybill(model: BaseResponse<string, string>): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.GENERATE_EWAYBILL,
            payload: model
        };
    }

    /**
     * Handles GenerateNewEwaybillResponse functionality
     */
    public GenerateNewEwaybillResponse(model: BaseResponse<string, string>): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.GENERATE_EWAYBILL_RESPONSE,
            payload: model
        };
    }

    /**
     * Retrieves allewaybilllist data
     */
    public getALLEwaybillList(): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.GET_All_LIST_EWAYBILLS
        };
    }

    /**
     * Retrieves allewaybilllistresponse data
     */
    public getALLEwaybillListResponse(response: BaseResponse<IEwayBillAllList, any>): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.GET_All_LIST_EWAYBILLS_RESPONSE,
            payload: response
        };
    }

    // TRANSPORTER API
    /**
     * Handles addEwayBillTransporter functionality
     */
    public addEwayBillTransporter(model: IEwayBillTransporter): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.ADD_TRANSPORTER,
            payload: model
        };
    }

    /**
     * Handles addEwayBillTransporterResponse functionality
     */
    public addEwayBillTransporterResponse(model: BaseResponse<string, string>): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.ADD_TRANSPORTER_RESPONSE,
            payload: model
        };
    }

    /**
     * Updates existing ewaybilltransporter
     */
    public updateEwayBillTransporter(currentTransportId, transportObj: IEwayBillTransporter): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.UPDATE_TRANSPORTER,
            payload: { currentTransportId, transportObj }
        };
    }

    /**
     * Updates existing ewaybilltransporterresponse
     */
    public updateEwayBillTransporterResponse(model: BaseResponse<string, any>): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.UPDATE_TRANSPORTER_RESPONSE,
            payload: model
        };
    }

    /**
     * Retrieves alltransporterlist data
     */
    public getALLTransporterList(model?: IEwayBillfilter): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.GET_ALL_TRANSPORTER,
            payload: model
        };
    }

    /**
     * Retrieves alltransporterlistresponse data
     */
    public getALLTransporterListResponse(response: BaseResponse<any, any>): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.GET_ALL_TRANSPORTER_RESPONSE,
            payload: response
        };
    }

    /**
     * Deletes transporter
     */
    public deleteTransporter(transporterId: string): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.DELETE_TRANSPORTER,
            payload: transporterId
        };
    }

    /**
     * Deletes transporteresponse
     */
    public deleteTransporteResponse(response: any): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.DELETE_TRANSPORTER_RESPONSE,
            payload: response
        };
    }

    /**
     * Handles UpdateEwayVehicle functionality
     */
    public UpdateEwayVehicle(model: UpdateEwayVehicle): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.UPDATE_EWAY_VEHICLE,
            payload: model
        };
    }

    /**
     * Handles UpdateEwayVehicleResponse functionality
     */
    public UpdateEwayVehicleResponse(response: any): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.UPDATE_EWAY_VEHICLE_RESPONSE,
            payload: response
        };
    }

    /**
     * Handles cancelEwayBill functionality
     */
    public cancelEwayBill(EwaycancelReq: IEwayBillCancel): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.CANCEL_EWAYBILL,
            payload: EwaycancelReq
        };
    }

    /**
     * Handles cancelEwayBillResponse functionality
     */
    public cancelEwayBillResponse(response: any): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.CANCEL_EWAYBILL_RESPONSE,
            payload: response
        };
    }

    /**
     * Handles GetAllEwayfilterRequest functionality
     */
    public GetAllEwayfilterRequest(model: IEwayBillfilter): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.GET_All_FILTERED_LIST_EWAYBILLS,
            payload: { body: model }
        };
    }

    /**
     * Handles GetAllEwayfilterResponse functionality
     */
    public GetAllEwayfilterResponse(model: BaseResponse<IEwayBillAllList, IEwayBillfilter>): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.GET_All_FILTERED_LIST_EWAYBILLS_RESPONSE,
            payload: model
        };
    }

    private validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>,
        successAction: CustomActions,
        showToast: boolean = false,
        errorAction: CustomActions = { type: 'EmptyAction' },
        message?: string): CustomActions {
        /**
         * Handles if functionality
         */
        if (response?.status === 'error') {
            /**
             * Handles if functionality
             */
            if (showToast) {
                this._toasty.errorToast(response.message);
            }
            return errorAction;
        } else {
            /**
             * Handles if functionality
             */
            if (showToast && typeof response?.body === 'string') {
                this._toasty.successToast(response?.body);
            } else if (message) {
                this._toasty.successToast(message);
            }
        }
        return successAction;

    }

    /**
     * Resets transporterlistresponse to default state
     */
    public resetTransporterListResponse(): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.RESET_ALL_TRANSPORTER_RESPONSE
        };
    }

    /**
     * Resets the pending data of pending invoices section
     *
     * @returns {CustomActions}
     * @memberof InvoiceActions
     */
    public resetPendingData(): CustomActions {
        return {
            type: INVOICE_ACTIONS.RESET_PENDING_DATA
        };
    }

    /**
     * Generates bullk e-invoice
     *
     * @returns {CustomActions} Generate bulk e-invoice action
     * @memberof InvoiceActions
     */
    public generateBulkEInvoice(model: any): CustomActions {
        return {
            type: INVOICE_ACTIONS.GENERATE_BULK_E_INVOICE,
            payload: model
        };
    }

    /**
     * Resets the bulk e-invoice flag
     *
     * @returns {CustomActions} Resets bulk e-invoice action
     * @memberof InvoiceActions
     */
    public resetBulkEInvoice(): CustomActions {
        return {
            type: INVOICE_ACTIONS.RESET_BULK_E_INVOICE_RESPONSE
        };
    }

    /**
     * Sets no permissions flag
     *
     * @returns {CustomActions}
     * @memberof InvoiceActions
     */
    public noPermissionsRecurringInvoice(): CustomActions {
        return {
            type: INVOICE.RECURRING.NO_PERMISSIONS_RECURRING_INVOICE
        };
    }

    /**
     * Sets bulkgenerateconfirm value
     */
    public setBulkGenerateConfirm(body: any): CustomActions {
        return {
            type: INVOICE_ACTIONS.SHOW_BULK_GENERATE_VOUCHER_CONFIRMATION,
            payload: body
        };
    }
}
