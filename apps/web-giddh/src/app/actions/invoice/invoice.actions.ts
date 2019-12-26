import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { InvoiceService } from '../../services/invoice.service';
import { InvoiceTemplatesService } from '../../services/invoice.templates.service';
import { EWAYBILL_ACTIONS, INVOICE, INVOICE_ACTIONS } from './invoice.const';
import { ToasterService } from '../../services/toaster.service';
import { Router } from '@angular/router';
import {
    CommonPaginatedRequest,
    GenerateBulkInvoiceRequest,
    GenerateInvoiceRequestClass,
    GetAllLedgersForInvoiceResponse,
    GetInvoiceTemplateDetailsResponse,
    IBulkInvoiceGenerationFalingError,
    IEwayBillAllList,
    IEwayBillCancel,
    IEwayBillfilter,
    IEwayBillTransporter,
    IGetAllInvoicesResponse,
    InvoiceFilterClass,
    InvoiceTemplateDetailsResponse,
    PreviewInvoiceRequest,
    PreviewInvoiceResponseClass,
    UpdateEwayVehicle
} from '../../models/api-models/Invoice';
import { InvoiceSetting } from '../../models/interfaces/invoice.setting.interface';
import { RazorPayDetailsResponse } from '../../models/api-models/SettingsIntegraion';
import { saveAs } from 'file-saver';
import { CustomActions } from '../../store/customActions';
import { RecurringInvoice } from '../../models/interfaces/RecurringInvoice';
import { RecurringVoucherService } from '../../services/recurring-voucher.service';

@Injectable()
export class InvoiceActions {

    // GET_ALL All Invoices
    @Effect()
    public GetAllInvoices$: Observable<Action> = this.action$
        .ofType(INVOICE_ACTIONS.GET_ALL_INVOICES).pipe(
            switchMap((action: CustomActions) => this._invoiceService.GetAllInvoices(action.payload.model, action.payload.body)),
            map(response => {
                return this.GetAllInvoicesResponse(response);
            }));

    @Effect()
    public GetAllInvoicesResponse$: Observable<Action> = this.action$
        .ofType(INVOICE_ACTIONS.GET_ALL_INVOICES_RESPONSE).pipe(
            map(response => {
                return { type: 'EmptyAction' };
            }));

    // get all ledgers for invoice
    @Effect()
    public GetAllLedgersForInvoice$: Observable<Action> = this.action$
        .ofType(INVOICE_ACTIONS.GET_ALL_LEDGERS_FOR_INVOICE).pipe(
            switchMap((action: CustomActions) => this._invoiceService.GetAllLedgersForInvoice(action.payload.model, action.payload.body)),
            map(res => this.validateResponse<GetAllLedgersForInvoiceResponse, CommonPaginatedRequest>(res, {
                type: INVOICE_ACTIONS.GET_ALL_LEDGERS_FOR_INVOICE_RESPONSE,
                payload: res
            }, true, {
                type: INVOICE_ACTIONS.GET_ALL_LEDGERS_FOR_INVOICE_RESPONSE,
                payload: res
            })));

    // Preview Invoice
    @Effect()
    public PreviewInvoice$: Observable<Action> = this.action$
        .ofType(INVOICE_ACTIONS.PREVIEW_INVOICE).pipe(
            switchMap((action: CustomActions) => this._invoiceService.PreviewInvoice(action.payload.accountUniqueName, action.payload.body)),
            map(res => this.validateResponse<PreviewInvoiceResponseClass, PreviewInvoiceRequest>(res, {
                type: INVOICE_ACTIONS.PREVIEW_INVOICE_RESPONSE,
                payload: res
            }, true, {
                type: INVOICE_ACTIONS.PREVIEW_INVOICE_RESPONSE,
                payload: res
            })));

    // Preview of Generated Invoice
    @Effect()
    public PreviewOfGeneratedInvoice$: Observable<Action> = this.action$
        .ofType(INVOICE_ACTIONS.PREVIEW_OF_GENERATED_INVOICE).pipe(
            switchMap((action: CustomActions) => this._invoiceService.GetGeneratedInvoicePreview(action.payload.accountUniqueName, action.payload.invoiceNumber)),
            map(res => this.validateResponse<PreviewInvoiceResponseClass, string>(res, {
                type: INVOICE_ACTIONS.PREVIEW_OF_GENERATED_INVOICE_RESPONSE,
                payload: res
            }, true, {
                type: INVOICE_ACTIONS.PREVIEW_OF_GENERATED_INVOICE_RESPONSE,
                payload: res
            })));

    // Preview of Generated Invoice
    @Effect()
    public UpdateGeneratedInvoice$: Observable<Action> = this.action$
        .ofType(INVOICE_ACTIONS.UPDATE_GENERATED_INVOICE).pipe(
            switchMap((action: CustomActions) => this._invoiceService.UpdateGeneratedInvoice(action.payload.accountUniqueName, action.payload.body)),
            map(res => this.validateResponse<string, GenerateInvoiceRequestClass>(res, {
                type: INVOICE_ACTIONS.UPDATE_GENERATED_INVOICE_RESPONSE,
                payload: res
            }, true, {
                type: INVOICE_ACTIONS.UPDATE_GENERATED_INVOICE_RESPONSE,
                payload: res
            })));

    // Generate Invoice
    @Effect()
    public GenerateInvoice$: Observable<Action> = this.action$
        .ofType(INVOICE_ACTIONS.GENERATE_INVOICE).pipe(
            switchMap((action: CustomActions) => this._invoiceService.GenerateInvoice(action.payload.accountUniqueName, action.payload.body)),
            map(res => this.validateResponse<GenerateInvoiceRequestClass, string>(res, {
                type: INVOICE_ACTIONS.GENERATE_INVOICE_RESPONSE,
                payload: res
            }, true, {
                type: INVOICE_ACTIONS.GENERATE_INVOICE_RESPONSE,
                payload: res
            })));

    // Generate Bulk Invoice
    // @Effect()
    // public GenerateBulkInvoice$: Observable<Action> = this.action$
    //   .ofType(INVOICE_ACTIONS.GENERATE_BULK_INVOICE)
    //   .switchMap((action: CustomActions) =>  this._invoiceService.GenerateBulkInvoice(action.payload.reqObj, action.payload.body))
    //   .map(res => this.validateResponse<string, GenerateBulkInvoiceRequest[]>(res, {
    //     type: INVOICE_ACTIONS.GENERATE_BULK_INVOICE_RESPONSE,
    //     payload: res
    //   }, true, {
    //       type: INVOICE_ACTIONS.GENERATE_BULK_INVOICE_RESPONSE,
    //       payload: res
    //     }));
    @Effect()
    public GenerateBulkInvoice$: Observable<Action> = this.action$
        .ofType(INVOICE_ACTIONS.GENERATE_BULK_INVOICE).pipe(
            switchMap((action: CustomActions) => this._invoiceService.GenerateBulkInvoice(action.payload.reqObj, action.payload.body, action.payload.requestedFrom)),
            map(response => {
                return this.GenerateBulkInvoiceResponse(response);
            }));

    @Effect()
    public GenerateBulkInvoiceResponse$: Observable<Action> = this.action$
        .ofType(INVOICE_ACTIONS.GENERATE_BULK_INVOICE_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, GenerateBulkInvoiceRequest[]> = response.payload;
                if (data.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    if (typeof data.body === 'string') {
                        this._toasty.successToast(data.body);
                    } else if (_.isArray(data.body) && data.body.length > 0) {
                        _.forEach(data.body, (item: IBulkInvoiceGenerationFalingError) => {
                            this._toasty.warningToast(item.reason);
                        });
                    }
                }
                return { type: 'EmptyAction' };
            }));

    // Delete Invoice
    @Effect()
    public DeleteInvoice$: Observable<Action> = this.action$
        .ofType(INVOICE_ACTIONS.DELETE_INVOICE).pipe(
            switchMap((action: CustomActions) => this._invoiceService.DeleteInvoice(action.payload.model, action.payload.accountUniqueName)),
            map(response => {
                return this.DeleteInvoiceResponse(response);
            }));

    @Effect()
    public DeleteInvoiceResponse$: Observable<Action> = this.action$
        .ofType(INVOICE_ACTIONS.DELETE_INVOICE_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<string, string> = response.payload;
                if (data.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast('Invoice Deleted Successfully');
                }
                return { type: 'EmptyAction' };
            }));

    // Action On Invoice
    @Effect()
    public ActionOnInvoice$: Observable<Action> = this.action$
        .ofType(INVOICE_ACTIONS.ACTION_ON_INVOICE).pipe(
            switchMap((action: CustomActions) => this._invoiceService.PerformActionOnInvoice(action.payload.invoiceUniqueName, action.payload.action)),
            map(response => {
                return this.ActionOnInvoiceResponse(response);
            }));

    @Effect()
    public ActionOnInvoiceResponse$: Observable<Action> = this.action$
        .ofType(INVOICE_ACTIONS.ACTION_ON_INVOICE_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<string, string> = response.payload;
                if (data.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast('Invoice Successfully Updated.');
                }
                return { type: 'EmptyAction' }; // Refresh the list
            }));

    @Effect()
    public GetTemplateDetailsOfInvoice$: Observable<Action> = this.action$
        .ofType(INVOICE_ACTIONS.GET_INVOICE_TEMPLATE_DETAILS).pipe(
            switchMap((action: CustomActions) => this._invoiceService.GetInvoiceTemplateDetails(action.payload)),
            map(res => this.validateResponse<InvoiceTemplateDetailsResponse, string>(res, {
                type: INVOICE_ACTIONS.GET_INVOICE_TEMPLATE_DETAILS_RESPONSE,
                payload: res
            }, true, {
                type: INVOICE_ACTIONS.GET_INVOICE_TEMPLATE_DETAILS_RESPONSE,
                payload: res
            })));

    // *********************************** MUSTAFA //***********************************\\

    /**
     * GET_ALL INVOICE SETTING
     */
    @Effect()
    public getInvoiceSetting$: Observable<Action> = this.action$
        .ofType(INVOICE.SETTING.GET_INVOICE_SETTING).pipe(
            switchMap((action: CustomActions) => this._invoiceService.GetInvoiceSetting()),
            map(res => this.validateResponse<InvoiceSetting, string>(res, {
                type: INVOICE.SETTING.GET_INVOICE_SETTING_RESPONSE,
                payload: res
            }, true, {
                type: INVOICE.SETTING.GET_INVOICE_SETTING_RESPONSE,
                payload: res
            })));

    /**
     * DELETE INVOICE WEBHOOK
     */
    @Effect()
    public DeleteWebhook$: Observable<Action> = this.action$
        .ofType(INVOICE.SETTING.DELETE_WEBHOOK).pipe(
            switchMap((action: CustomActions) => this._invoiceService.DeleteInvoiceWebhook(action.payload)),
            map(res => this.validateResponse<string, string>(res, {
                type: INVOICE.SETTING.DELETE_WEBHOOK_RESPONSE,
                payload: res
            }, true, {
                type: INVOICE.SETTING.DELETE_WEBHOOK_RESPONSE,
                payload: res
            })));

    /**
     * UPDATE INVOICE EMAILID
     */
    @Effect()
    public UpdateInvoiceEmail$: Observable<Action> = this.action$
        .ofType(INVOICE.SETTING.UPDATE_INVOICE_EMAIL).pipe(
            switchMap((action: CustomActions) => this._invoiceService.UpdateInvoiceEmail(action.payload)),
            map(res => this.validateResponse<string, string>(res, {
                type: INVOICE.SETTING.UPDATE_INVOICE_EMAIL_RESPONSE,
                payload: res
            }, true, {
                type: INVOICE.SETTING.UPDATE_INVOICE_EMAIL_RESPONSE,
                payload: res
            })));

    /**
     * SAVE INVOICE WEBHOOK
     */
    @Effect()
    public SaveInvoiceWebhook$: Observable<Action> = this.action$
        .ofType(INVOICE.SETTING.SAVE_INVOICE_WEBHOOK).pipe(
            switchMap((action: CustomActions) => this._invoiceService.SaveInvoiceWebhook(action.payload)),
            map(res => this.validateResponse<string, string>(res, {
                type: INVOICE.SETTING.SAVE_INVOICE_WEBHOOK_RESPONSE,
                payload: res
            }, true, {
                type: INVOICE.SETTING.SAVE_INVOICE_WEBHOOK_RESPONSE,
                payload: res
            })));

    /**
     * UPDATE INVOICE SETTING
     */
    @Effect()
    public updateInvoiceSetting$: Observable<Action> = this.action$
        .ofType(INVOICE.SETTING.UPDATE_INVOICE_SETTING).pipe(
            switchMap((action: CustomActions) => this._invoiceService.UpdateInvoiceSetting(action.payload)),
            map(res => this.validateResponse<string, string>(res, {
                type: INVOICE.SETTING.UPDATE_INVOICE_SETTING_RESPONSE,
                payload: res
            }, true, {
                type: INVOICE.SETTING.UPDATE_INVOICE_SETTING_RESPONSE,
                payload: res
            })));

    /**
     * GET_ALL RAZORPAY DETAIL
     */
    @Effect()
    public GetRazorPayDetail$: Observable<Action> = this.action$
        .ofType(INVOICE.SETTING.GET_RAZORPAY_DETAIL).pipe(
            switchMap((action: CustomActions) => this._invoiceService.GetRazorPayDetail()),
            map(res => this.validateResponse<RazorPayDetailsResponse, string>(res, {
                type: INVOICE.SETTING.GET_RAZORPAY_DETAIL_RESPONSE,
                payload: res
            }, true, {
                type: INVOICE.SETTING.GET_RAZORPAY_DETAIL_RESPONSE,
                payload: res
            })));

    /**
     * UPDATE RAZORPAY DETAIL
     */
    @Effect()
    public UpdateRazorPayDetail$: Observable<Action> = this.action$
        .ofType(INVOICE.SETTING.UPDATE_RAZORPAY_DETAIL).pipe(
            switchMap((action: CustomActions) => this._invoiceService.UpdateRazorPayDetail(action.payload)),
            map(res => this.validateResponse<RazorPayDetailsResponse, string>(res, {
                type: INVOICE.SETTING.UPDATE_RAZORPAY_DETAIL_RESPONSE,
                payload: res
            }, true, {
                type: INVOICE.SETTING.UPDATE_RAZORPAY_DETAIL_RESPONSE,
                payload: res
            })));

    /**
     * DELETE RAZORPAY DETAIL
     */
    @Effect()
    public DeleteRazorPayDetail$: Observable<Action> = this.action$
        .ofType(INVOICE.SETTING.DELETE_RAZORPAY_DETAIL).pipe(
            switchMap((action: CustomActions) => this._invoiceService.DeleteRazorPayDetail()),
            map(res => this.validateResponse<string, string>(res, {
                type: INVOICE.SETTING.DELETE_RAZORPAY_DETAIL_RESPONSE,
                payload: res
            }, true, {
                type: INVOICE.SETTING.UPDATE_RAZORPAY_DETAIL_RESPONSE,
                payload: res
            })));

    /**
     * DELETE INVOICE EMAIL
     */
    @Effect()
    public DeleteInvoiceEmail$: Observable<Action> = this.action$
        .ofType(INVOICE.SETTING.DELETE_INVOICE_EMAIL).pipe(
            switchMap((action: CustomActions) => this._invoiceService.DeleteInvoiceEmail(action.payload)),
            map(res => this.validateResponse<string, string>(res, {
                type: INVOICE.SETTING.DELETE_INVOICE_EMAIL_RESPONSE,
                payload: res
            }, true, {
                type: INVOICE.SETTING.DELETE_INVOICE_EMAIL_RESPONSE,
                payload: res
            })));

    /**
     * SAVE RAZORPAY DETAIL
     */
    @Effect()
    public SaveRazorPayDetail$: Observable<Action> = this.action$
        .ofType(INVOICE.SETTING.SAVE_RAZORPAY_DETAIL).pipe(
            switchMap((action: CustomActions) => this._invoiceService.SaveRazorPayDetail(action.payload)),
            map(res => this.validateResponse<RazorPayDetailsResponse, string>(res, {
                type: INVOICE.SETTING.SAVE_RAZORPAY_DETAIL_RESPONSE,
                payload: res
            }, true, {
                type: INVOICE.SETTING.SAVE_RAZORPAY_DETAIL_RESPONSE,
                payload: res
            })));

    @Effect()
    public DownloadInvoice$: Observable<Action> = this.action$
        .ofType(INVOICE_ACTIONS.DOWNLOAD_INVOICE).pipe(
            switchMap((action: CustomActions) => {
                return this._invoiceService.DownloadInvoice(action.payload.accountUniqueName, action.payload.dataToSend).pipe(
                    map(response => this.DownloadInvoiceResponse(response)));
            }));

    @Effect()
    public DownloadInvoiceResponse$: Observable<Action> = this.action$
        .ofType(INVOICE_ACTIONS.DOWNLOAD_INVOICE_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, string> = response.payload;
                if (data.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    let type = 'pdf';
                    let req = data.queryString.dataToSend;
                    if (req.typeOfInvoice.length > 1) {
                        type = 'zip';
                    }
                    let fileName = req.voucherNumber[0];
                    this.downloadFile(data.body, type, fileName);
                }
                return { type: 'EmptyAction' };
            }));
    @Effect()
    public DownloadExportedInvoice$: Observable<Action> = this.action$
        .ofType(INVOICE_ACTIONS.DOWNLOAD_INVOICE_EXPORTED).pipe(
            switchMap((action: CustomActions) => {
                return this._invoiceService.exportCsvInvoiceDownload(action.payload).pipe(
                    map(response => this.DownloadExportedInvoiceResponse(response)));
            }));

    @Effect()
    public SendInvoiceOnMail$: Observable<Action> = this.action$
        .ofType(INVOICE_ACTIONS.SEND_MAIL).pipe(
            switchMap((action: CustomActions) => {
                return this._invoiceService.SendInvoiceOnMail(action.payload.accountUniqueName, action.payload.dataToSend).pipe(
                    map(response => this.SendInvoiceOnMailResponse(response)));
            }));

    @Effect()
    public SendInvoiceOnMailResponse$: Observable<Action> = this.action$
        .ofType(INVOICE_ACTIONS.SEND_MAIL_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, string> = response.payload;
                if (data.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast(data.body);
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public SendInvoiceOnSms$: Observable<Action> = this.action$
        .ofType(INVOICE_ACTIONS.SEND_SMS).pipe(
            switchMap((action: CustomActions) => {
                return this._invoiceService.SendInvoiceOnSms(action.payload.accountUniqueName, action.payload.dataToSend, action.payload.voucherNumber).pipe(
                    map(response => this.SendInvoiceOnSmsResponse(response)));
            }));

    @Effect()
    public SendInvoiceOnSmsResponse$: Observable<Action> = this.action$
        .ofType(INVOICE_ACTIONS.SEND_SMS_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, string> = response.payload;
                if (data.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast(data.body);
                }
                return { type: 'EmptyAction' };
            }));

    // Transporter effects
    @Effect()
    public addEwayBillTransporter$: Observable<Action> = this.action$
        .ofType(EWAYBILL_ACTIONS.ADD_TRANSPORTER).pipe(
            switchMap((action: CustomActions) => {
                return this._invoiceService.addEwayTransporter(action.payload).pipe(
                    map(response => this.addEwayBillTransporterResponse(response)));
            }));
    @Effect()
    public addEwayBillTransporterResponse$: Observable<Action> = this.action$
        .ofType(EWAYBILL_ACTIONS.ADD_TRANSPORTER_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, string> = response.payload;
                if (data.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast('transporter added  successfully');
                }
                return { type: 'EmptyAction' };
            }));
    @Effect()
    public updateEwayBillTransporter$: Observable<Action> = this.action$
        .ofType(EWAYBILL_ACTIONS.UPDATE_TRANSPORTER).pipe(
            switchMap((action: CustomActions) => {
                return this._invoiceService.UpdateGeneratedTransporter(action.payload.currentTransportId, action.payload.transportObj).pipe(
                    map(response => this.updateEwayBillTransporterResponse(response)));
            }));
    @Effect()
    public updateEwayBillTransporterResponse$: Observable<Action> = this.action$
        .ofType(EWAYBILL_ACTIONS.UPDATE_TRANSPORTER_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, string> = response.payload;
                if (data.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast('transporter updated  successfully');
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public UpdateEwayVehicle$: Observable<Action> = this.action$
        .ofType(EWAYBILL_ACTIONS.UPDATE_EWAY_VEHICLE).pipe(
            switchMap((action: CustomActions) => this._invoiceService.updateEwayVehicle(action.payload)),
            map(response => this.UpdateEwayVehicleResponse(response)));

    @Effect()
    public LoginEwaybillUser$: Observable<Action> = this.action$
        .ofType(EWAYBILL_ACTIONS.LOGIN_EAYBILL_USER).pipe(
            switchMap((action: CustomActions) => {
                return this._invoiceService.LoginEwaybillUser(action.payload).pipe(
                    map(response => this.LoginEwaybillUserResponse(response)));
            }));

    //  EWAYBILL_ACTIONS.LOGIN_EAYBILL_USER

    @Effect()
    public LoginEwaybillUserResponse$: Observable<Action> = this.action$
        .ofType(EWAYBILL_ACTIONS.LOGIN_EAYBILL_USER_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, string> = response.payload;
                if (data.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast(data.body);
                }
                return { type: 'EmptyAction' };
            }));
    // Is logged in user in Eway Bill IsUserLoginEwayBill
    @Effect()
    public isLoggedInUserEwayBill$: Observable<Action> = this.action$
        .ofType(EWAYBILL_ACTIONS.IS_LOOGEDIN_USER_EWAYBILL).pipe(
            switchMap((action: CustomActions) => {
                return this._invoiceService.IsUserLoginEwayBill().pipe(
                    map(response => this.isLoggedInUserEwayBillResponse(response)));
            }));
    // Is logged in user in Eway Bill response
    @Effect()
    public isLoggedInUserEwayBillResponse$: Observable<Action> = this.action$
        .ofType(EWAYBILL_ACTIONS.IS_LOOGEDIN_USER_EWAYBILL_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, string> = response.payload;
                return { type: 'EmptyAction' };
            }));
    // generate Eway bill request
    @Effect()
    public GenerateNewEwaybill$: Observable<Action> = this.action$
        .ofType(EWAYBILL_ACTIONS.GENERATE_EWAYBILL).pipe(
            switchMap((action: CustomActions) => {
                return this._invoiceService.GenerateNewEwaybill(action.payload).pipe(
                    map(response => this.GenerateNewEwaybillResponse(response)));
            }));

    // Generate eway bill respone
    @Effect()
    public GenerateNewEwaybillResponse$: Observable<Action> = this.action$
        .ofType(EWAYBILL_ACTIONS.GENERATE_EWAYBILL_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, string> = response.payload;
                if (data.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast('E-Way bill ' + data.body.ewayBillNo + 'generated successfully');
                    this._router.navigate(['/pages/invoice/ewaybill']);
                }
                return { type: 'EmptyAction' };
            }));
    // CANCEL Eway bill request
    @Effect()
    public cancelEwayBill$: Observable<Action> = this.action$
        .ofType(EWAYBILL_ACTIONS.CANCEL_EWAYBILL).pipe(
            switchMap((action: CustomActions) => {
                return this._invoiceService.cancelEwayBill(action.payload).pipe(
                    map(response => this.cancelEwayBillResponse(response)));
            }));

    // CANCEL eway bill respone
    @Effect()
    public cancelEwayBillResponse$: Observable<Action> = this.action$
        .ofType(EWAYBILL_ACTIONS.CANCEL_EWAYBILL_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, string> = response.payload;
                if (data.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    if (data.status === 'success') {
                        this._toasty.successToast(data.body);
                    }
                }
                return { type: 'EmptyAction' };
            }));
    @Effect()
    private UpdateEwayVehicleResponse$: Observable<Action> = this.action$
        .ofType(EWAYBILL_ACTIONS.UPDATE_EWAY_VEHICLE_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast(`vehicle updated date ${data.body.vehUpdDate} and valid upto ${data.body.validUpto} `);
                }
                return { type: 'EmptyAction' };
            }));

    // Get all eway bill request

    @Effect()
    private getALLEwaybillList$: Observable<Action> = this.action$
        .ofType(EWAYBILL_ACTIONS.GET_All_LIST_EWAYBILLS).pipe(
            switchMap((action: CustomActions) => this._invoiceService.getAllEwaybillsList()),
            map((response: BaseResponse<IEwayBillAllList, any>) => {
                if (response.status === 'success') {
                    // this.showToaster('');
                } else {
                    this._toasty.errorToast(response.message);
                }
                return this.getALLEwaybillListResponse(response);
            }));

    // Get all eway bill list response
    @Effect()
    private getALLEwaybillListResponse$: Observable<Action> = this.action$
        .ofType(EWAYBILL_ACTIONS.GET_All_LIST_EWAYBILLS_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<IEwayBillAllList, any> = response.payload;
                if (data && data.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                }
                if (data && data.status === 'success' && data.body.results.length === 0) {
                    this._toasty.errorToast('No entries found within given criteria.');
                }
                return { type: 'EmptyAction' };
            }));
    @Effect()
    private getALLTransporterList$: Observable<Action> = this.action$
        .ofType(EWAYBILL_ACTIONS.GET_ALL_TRANSPORTER).pipe(
            switchMap((action: CustomActions) => this._invoiceService.getAllTransporterList(action.payload)),
            map((response: BaseResponse<IEwayBillTransporter, any>) => {
                if (response.status === 'success') {
                    // this.showToaster('');
                } else {
                    this._toasty.errorToast(response.message);
                }
                return this.getALLTransporterListResponse(response);
            }));

    // Get all eway bill list response
    @Effect()
    private getALLTransporterListResponse$: Observable<Action> = this.action$
        .ofType(EWAYBILL_ACTIONS.GET_ALL_TRANSPORTER_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<IEwayBillTransporter, any> = response.payload;
                if (data && data.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                }
                // if (data && data.status === 'success' && data.body.results.length === 0 ) {
                //   this._toasty.errorToast('No entries found within given criteria.');
                // }
                return { type: 'EmptyAction' };
            }));
    // transporter effects
    @Effect()
    private deleteTransporter$: Observable<Action> = this.action$
        .ofType(EWAYBILL_ACTIONS.DELETE_TRANSPORTER).pipe(
            switchMap((action: CustomActions) => this._invoiceService.deleteTransporterById(action.payload)),
            map(response => {
                return this.deleteTransporteResponse(response);
            }));

    @Effect()
    private deleteTransporterResponse$: Observable<Action> = this.action$
        .ofType(EWAYBILL_ACTIONS.DELETE_TRANSPORTER_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast(data.body);
                }
                return { type: 'EmptyAction' };
            }));


    @Effect()
    private GetAllEwayfilterRequest$: Observable<Action> = this.action$
        .ofType(EWAYBILL_ACTIONS.GET_All_FILTERED_LIST_EWAYBILLS).pipe(
            switchMap((action: CustomActions) => this._invoiceService.getAllEwaybillsfilterList(action.payload.body)),
            map((response: BaseResponse<IEwayBillAllList, IEwayBillfilter>) => {
                if (response.status === 'success') {

                } else {
                    // this.showToaster(response.message, 'error');
                }
                return this.GetAllEwayfilterResponse(response);
            }));
    //      @Effect()
    // public addEwayBillTransporter$: Observable<Action> = this.action$
    //   .ofType(EWAYBILL_ACTIONS.ADD_TRANSPORTER).pipe(
    //     switchMap((action: CustomActions) => this._invoiceService.GenerateInvoice(action.payload.accountUniqueName, action.payload.body)),
    //     map(res => this.validateResponse<GenerateInvoiceRequestClass, string>(res, {
    //       type: INVOICE_ACTIONS.GENERATE_INVOICE_RESPONSE,
    //       payload: res
    //     }, true, {
    //       type: INVOICE_ACTIONS.GENERATE_INVOICE_RESPONSE,
    //       payload: res
    //     })));

    //      @Effect()
    // private downloadEwayBill$: Observable<Action> = this.action$
    //   .ofType(EWAYBILL_ACTIONS.DOWNLOAD_EWAYBILL).pipe(
    //     switchMap((action: CustomActions) => this._invoiceService.DownloadEwayBills(action.payload)),
    //     map((response: BaseResponse<any, any>) => {
    //       if (response) {
    //         // this.showToaster('');
    //       } else {
    //        // this.showToaster(response.message, 'error');
    //       }
    //       return this.ewaybillPreviewResponse(response);
    //     }));

    // *********************************** MUSTAFA //***********************************\\

    // write above except kunal
    // get all templates
    // @Effect()
    // public GetUserTemplates$ = this.action$
    //   .ofType(INVOICE.TEMPLATE.GET_SAMPLE_TEMPLATES)
    //   .switchMap((action: CustomActions) =>  this._invoiceTemplatesService.getTemplates())
    //   .map((response: BaseResponse<CustomTemplateResponse[], string>) => {
    //     if (response.status === 'error') {
    //       this._toasty.errorToast(response.message, response.code);
    //     } else {
    //        return this.getSampleTemplateResponse(response.body);
    //     }
    //     return { type: 'EmptyAction' };
    //   });

    // GET_ALL SAMPLE TEMPLATES
    @Effect()
    private GetSampleTemplates$: Observable<Action> = this.action$
        .ofType(INVOICE.TEMPLATE.GET_SAMPLE_TEMPLATES).pipe(
            switchMap((action: CustomActions) => this._invoiceTemplatesService.getTemplates()),
            map(response => {
                return this.getSampleTemplateResponse(response);
            }));

    @Effect()
    private getSampleTemplateResponse$: Observable<Action> = this.action$
        .ofType(INVOICE.TEMPLATE.GET_SAMPLE_TEMPLATES_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data && data.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                }
                return { type: 'EmptyAction' };
            }));

    // GET_ALL CUSTOM CREATED TEMPLATES
    @Effect()
    private getAllCreatedTemplates$: Observable<Action> = this.action$
        .ofType(INVOICE.TEMPLATE.GET_ALL_CREATED_TEMPLATES).pipe(
            switchMap((action: CustomActions) => this._invoiceTemplatesService.getAllCreatedTemplates(action.payload)),
            map(response => {
                return this.getAllCreatedTemplatesResponse(response);
            }));

    @Effect()
    private getAllCreatedTemplatesResponse$: Observable<Action> = this.action$
        .ofType(INVOICE.TEMPLATE.GET_ALL_CREATED_TEMPLATES_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data && data.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                }
                return { type: 'EmptyAction' };
            }));

    // SET TEMPLATE AS DEFAULT
    @Effect()
    private setTemplateAsDefault$: Observable<Action> = this.action$
        .ofType(INVOICE.TEMPLATE.SET_TEMPLATE_AS_DEFAULT).pipe(
            switchMap((action: CustomActions) => this._invoiceTemplatesService.setTemplateAsDefault(action.payload.templateUniqueName, action.payload.templateType)),
            map(response => {
                return this.setTemplateAsDefaultResponse(response);
            }));

    @Effect()
    private setTemplateAsDefaultResponse$: Observable<Action> = this.action$
        .ofType(INVOICE.TEMPLATE.SET_TEMPLATE_AS_DEFAULT_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast('Template successfully marked as default.');
                }
                return { type: 'EmptyAction' };
            }));

    // DELETE TEMPLATE
    @Effect()
    private deleteTemplate$: Observable<Action> = this.action$
        .ofType(INVOICE.TEMPLATE.DELETE_TEMPLATE).pipe(
            switchMap((action: CustomActions) => this._invoiceTemplatesService.deleteTemplate(action.payload)),
            map(response => {
                return this.deleteTemplateResponse(response);
            }));

    @Effect()
    private deleteTemplateResponse$: Observable<Action> = this.action$
        .ofType(INVOICE.TEMPLATE.DELETE_TEMPLATE_RESPONSE).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast(data.body);
                }
                return { type: 'EmptyAction' };
            }));
    // GET_ALL All Recurring Vouchers
    @Effect()
    private GetAllRecurringInvoices$: Observable<Action> = this.action$
        .ofType(INVOICE.RECURRING.GET_RECURRING_INVOICE_DATA).pipe(
            switchMap((action: CustomActions) => this._recurringService.getRecurringVouchers(action.payload)),
            map(res => this.validateResponse<RecurringInvoice[], string>(res, this.GetAllRecurringInvoicesResponse(res.body), true, this.GetAllRecurringInvoicesResponse(res.body))));
    /**
     * SAVE Recurring Voucher
     */
    @Effect()
    private SaveRecurrigVoucher$: Observable<Action> = this.action$
        .ofType(INVOICE.RECURRING.CREATE_RECURRING_INVOICE).pipe(
            switchMap((action: CustomActions) => this._recurringService.createRecurringVouchers(action.payload)),
            map(res => this.validateResponse<RecurringInvoice, string>(res, this.createRecurringInvoiceResponse(res.body), true, this.createRecurringInvoiceResponse(res.body), 'Recurring Invoice Created.')));

    /**
     * UPDATE Recurring Vouchers
     */
    @Effect()
    private UpdateRecurringVouchers$: Observable<Action> = this.action$
        .ofType(INVOICE.RECURRING.UPDATE_RECURRING_INVOICE).pipe(
            switchMap((action: CustomActions) => this._recurringService.updateRecurringVouchers(action.payload)),
            map(res => this.validateResponse<RecurringInvoice, string>(res, this.updateRecurringInvoiceResponse(res.body), true,
                this.updateRecurringInvoiceResponse(null), 'Recurring Invoice Updated.')));

    /**
     * DELETE Recurring Vouchers
     */
    @Effect()
    private DeleteRecurringVouchers$: Observable<Action> = this.action$
        .ofType(INVOICE.RECURRING.DELETE_RECURRING_INVOICE).pipe(
            switchMap((action: CustomActions) => this._recurringService.deleteRecurringVouchers(action.payload)),
            map(res => this.validateResponse<string, string>(res, this.deleteRecurringInvoiceResponse(res.request),
                true,
                this.deleteRecurringInvoiceResponse(null))));

    constructor(
        private action$: Actions,
        private _invoiceService: InvoiceService,
        private _recurringService: RecurringVoucherService,
        private _invoiceTemplatesService: InvoiceTemplatesService,
        private _toasty: ToasterService,
        private _router: Router
    ) {
    }

    public base64ToBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;
        let byteCharacters = atob(b64Data);
        let byteArrays = [];
        let offset = 0;
        while (offset < byteCharacters.length) {
            let slice = byteCharacters.slice(offset, offset + sliceSize);
            let byteNumbers = new Array(slice.length);
            let i = 0;
            while (i < slice.length) {
                byteNumbers[i] = slice.charCodeAt(i);
                i++;
            }
            let byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
            offset += sliceSize;
        }
        return new Blob(byteArrays, { type: contentType });
    }

    public downloadFile(data: Response, type: string, fileName) {
        let blob = this.base64ToBlob(data, 'application/' + type, 512);
        return saveAs(blob, `${fileName}.` + type);
    }

    public GetAllInvoices(model: CommonPaginatedRequest, body): CustomActions {
        return {
            type: INVOICE_ACTIONS.GET_ALL_INVOICES,
            payload: { model, body }
        };
    }

    public GetAllInvoicesResponse(model: BaseResponse<IGetAllInvoicesResponse, CommonPaginatedRequest>): CustomActions {
        return {
            type: INVOICE_ACTIONS.GET_ALL_INVOICES_RESPONSE,
            payload: model
        };
    }

    public GetAllRecurringInvoices(filter?, page: number = 1, count: number = 20): CustomActions {
        return {
            type: INVOICE.RECURRING.GET_RECURRING_INVOICE_DATA,
            payload: { filter, page, count }
        };
    }

    public GetAllRecurringInvoicesResponse(model: RecurringInvoice[]): CustomActions {
        return {
            type: INVOICE.RECURRING.GET_RECURRING_INVOICE_DATA_RESPONSE,
            payload: model
        };
    }

    public GetAllLedgersForInvoice(model: CommonPaginatedRequest, data: InvoiceFilterClass): CustomActions {
        return {
            type: INVOICE_ACTIONS.GET_ALL_LEDGERS_FOR_INVOICE,
            payload: { model, body: data }
        };
    }

    public GetAllLedgersForInvoiceResponse(model: GetAllLedgersForInvoiceResponse): CustomActions {
        return {
            type: INVOICE_ACTIONS.GET_ALL_LEDGERS_FOR_INVOICE_RESPONSE,
            payload: model
        };
    }

    public PreviewInvoice(accountUniqueName: string, model: PreviewInvoiceRequest): CustomActions {
        return {
            type: INVOICE_ACTIONS.PREVIEW_INVOICE,
            payload: { accountUniqueName, body: model }
        };
    }

    public PreviewInvoiceResponse(model: PreviewInvoiceResponseClass): CustomActions {
        return {
            type: INVOICE_ACTIONS.PREVIEW_INVOICE_RESPONSE,
            payload: model
        };
    }

    public VisitToInvoiceFromPreview(): CustomActions {
        return {
            type: INVOICE_ACTIONS.VISIT_FROM_PREVIEW,
            payload: {}
        };
    }

    public PreviewOfGeneratedInvoice(accountUniqueName: string, invoiceNumber: string): CustomActions {
        return {
            type: INVOICE_ACTIONS.PREVIEW_OF_GENERATED_INVOICE,
            payload: { accountUniqueName, invoiceNumber }
        };
    }

    public PreviewOfGeneratedInvoiceResponse(model: PreviewInvoiceResponseClass): CustomActions {
        return {
            type: INVOICE_ACTIONS.PREVIEW_OF_GENERATED_INVOICE_RESPONSE,
            payload: model
        };
    }

    public UpdateGeneratedInvoice(accountUniqueName: string, model: GenerateInvoiceRequestClass): CustomActions {
        return {
            type: INVOICE_ACTIONS.UPDATE_GENERATED_INVOICE,
            payload: { accountUniqueName, body: model }
        };
    }

    public GenerateInvoice(accountUniqueName: string, model: GenerateInvoiceRequestClass): CustomActions {
        return {
            type: INVOICE_ACTIONS.GENERATE_INVOICE,
            payload: { accountUniqueName, body: model }
        };
    }

    public GenerateInvoiceResponse(model: GenerateInvoiceRequestClass): CustomActions {
        return {
            type: INVOICE_ACTIONS.GENERATE_INVOICE_RESPONSE,
            payload: model
        };
    }

    public GenerateBulkInvoice(reqObj: { combined: boolean }, model: GenerateBulkInvoiceRequest[], requestedFrom?: string): CustomActions {
        return {
            type: INVOICE_ACTIONS.GENERATE_BULK_INVOICE,
            payload: { reqObj, body: model, requestedFrom }
        };
    }

    public GenerateBulkInvoiceResponse(model: any): CustomActions {
        return {
            type: INVOICE_ACTIONS.GENERATE_BULK_INVOICE_RESPONSE,
            payload: model
        };
    }

    public GetTemplateDetailsOfInvoice(model: string): CustomActions {
        return {
            type: INVOICE_ACTIONS.GET_INVOICE_TEMPLATE_DETAILS,
            payload: model
        };
    }

    public GetTemplateDetailsOfInvoiceResponse(model: BaseResponse<GetInvoiceTemplateDetailsResponse, string>): CustomActions {
        return {
            type: INVOICE_ACTIONS.GET_INVOICE_TEMPLATE_DETAILS_RESPONSE,
            payload: model
        };
    }

    public DeleteInvoice(model: object, accountUniqueName): CustomActions {
        return {
            type: INVOICE_ACTIONS.DELETE_INVOICE,
            payload: { model, accountUniqueName }
        };
    }

    public DeleteInvoiceResponse(model): CustomActions {
        return {
            type: INVOICE_ACTIONS.DELETE_INVOICE_RESPONSE,
            payload: model
        };
    }

    public ActionOnInvoice(invoiceUniqueName: string, action: object): CustomActions {
        return {
            type: INVOICE_ACTIONS.ACTION_ON_INVOICE,
            payload: { invoiceUniqueName, action }
        };
    }

    public ActionOnInvoiceResponse(model: any): CustomActions {
        return {
            type: INVOICE_ACTIONS.ACTION_ON_INVOICE_RESPONSE,
            payload: model
        };
    }

    public ModifiedInvoiceStateData(model: string[]): CustomActions {
        return {
            type: INVOICE_ACTIONS.MODIFIED_INVOICE_STATE_DATA,
            payload: model
        };
    }

    public InvoiceGenerationCompleted(): CustomActions {
        return {
            type: INVOICE_ACTIONS.INVOICE_GENERATION_COMPLETED,
            payload: ''
        };
    }

    public ResetInvoiceData(): CustomActions {
        return {
            type: INVOICE_ACTIONS.RESET_INVOICE_DATA,
            payload: ''
        };
    }

    public setTemplateData(section: any) {
        return {
            payload: section,
            type: INVOICE.TEMPLATE.SET_TEMPLATE_DATA
        };
    }

    public getTemplateState(): CustomActions {
        return {
            type: INVOICE.TEMPLATE.GET_SAMPLE_TEMPLATES
        };
    }

    public getAllCreatedTemplates(templateType: any): CustomActions {
        return {
            type: INVOICE.TEMPLATE.GET_ALL_CREATED_TEMPLATES,
            payload: templateType
        };
    }

    public getAllCreatedTemplatesResponse(response: any): CustomActions {
        return {
            type: INVOICE.TEMPLATE.GET_ALL_CREATED_TEMPLATES_RESPONSE,
            payload: response
        };
    }

    public setTemplateAsDefault(templateUniqueName: string, templateType: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.SET_TEMPLATE_AS_DEFAULT,
            payload: { templateUniqueName, templateType }
        };
    }

    public setTemplateAsDefaultResponse(response: any): CustomActions {
        return {
            type: INVOICE.TEMPLATE.SET_TEMPLATE_AS_DEFAULT_RESPONSE,
            payload: response
        };
    }

    public deleteTemplate(templateUniqueName: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.DELETE_TEMPLATE,
            payload: templateUniqueName
        };
    }

    public deleteTemplateResponse(response: any): CustomActions {
        return {
            type: INVOICE.TEMPLATE.DELETE_TEMPLATE_RESPONSE,
            payload: response
        };
    }

    public getCurrentTemplateSate(uniqueName: string): CustomActions {
        return {
            payload: uniqueName,
            type: INVOICE.TEMPLATE.GET_CURRENT_TEMPLATE
        };
    }

    public getSampleTemplateResponse(response): CustomActions {
        return {
            type: INVOICE.TEMPLATE.GET_SAMPLE_TEMPLATES_RESPONSE,
            payload: response
        };
    }

    public setTemplateId(id: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.SELECT_TEMPLATE,
            payload: { id }
        };
    }

    public setFont(font: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.SET_FONT,
            payload: { font }
        };
    }

    public setColor(primaryColor: string, secondaryColor: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.SET_COLOR,
            payload: { templateColor: primaryColor, tableColor: secondaryColor }
        };
    }

    public updateGSTIN(data: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_GSTIN,
            payload: { data }
        };
    }

    public updatePAN(data: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_PAN,
            payload: { data }
        };
    }

    public update(data: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_PAN,
            payload: { data }
        };
    }

    public setColumnWidth(width: number, colName: string): CustomActions {
        return {
            type: INVOICE.CONTENT.SET_COLUMN_WIDTH,
            payload: { width, colName }
        };

    }

    public updateInvoiceDate(data: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_INVOICE_DATE,
            payload: { data }
        };
    }

    public updateInvoiceNo(data: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_INVOICE_NO,
            payload: { data }
        };
    }

    public updateShippingDate(data: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_SHIPPING_DATE,
            payload: { data }
        };
    }

    public updateShippingNo(data: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_SHIPPING_NO,
            payload: { data }
        };
    }

    public updateShippingVia(data: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_SHIPPING_VIA,
            payload: { data }
        };
    }

    public updateTrackingDate(data: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_TRACKING_DATE,
            payload: { data }
        };
    }

    public updateTrackingNo(data: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_TRACKING_NO,
            payload: { data }
        };
    }

    public updateCustomerName(data: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_CUSTOMER_NAME,
            payload: { data }
        };
    }

    public updateCustomerEmail(data: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_CUSTOMER_EMAIL,
            payload: { data }
        };
    }

    public updateCustomerMobileNo(data: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_CUSTOMER_MOBILE_NO,
            payload: { data }
        };
    }

    public updateDueDate(data: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_DUE_DATE,
            payload: { data }
        };
    }

    public updateBillingState(data: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_BILLING_STATE,
            payload: { data }
        };
    }

    public updateBillingAddress(data: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_BILLING_ADDRESS,
            payload: { data }
        };
    }

    public updateBillingGSTIN(data: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_BILLING_GSTIN,
            payload: { data }
        };
    }

    public updateShippingState(data: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_SHIPPING_STATE,
            payload: { data }
        };
    }

    public updateShippingAddress(data: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_SHIPPING_ADDRESS,
            payload: { data }
        };
    }

    public updateShippingGSTIN(data: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_SHIPPING_GSTIN,
            payload: { data }
        };
    }

    public updateCustomField1(data: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_CUSTOM_FIELD_1,
            payload: { data }
        };
    }

    public updateCustomField2(data: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_CUSTOM_FIELD_2,
            payload: { data }
        };
    }

    public updateCustomField3(data: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_CUSTOM_FIELD_3,
            payload: { data }
        };
    }

    // public updateFormNameInvoice(ti: TaxInvoiceLabel): CustomActions {
    //   return {
    //     type: INVOICE.TEMPLATE.UPDATE_FORM_NAME_INVOICE,
    //     payload: { ti }
    //   };
    // }

    // public updateFormNameTaxInvoice(ti: TaxInvoiceLabel): CustomActions {
    //   return {
    //     type: INVOICE.TEMPLATE.UPDATE_FORM_NAME_TAX_INVOICE,
    //     payload: { ti }
    //   };
    // }

    public updateSnoLabel(data: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_SNOLABEL,
            payload: { data }
        };
    }

    public updateDateLabel(data: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_DATE_LABEL,
            payload: { data }
        };
    }

    public updateItemLabel(data: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_ITEM_LABEL,
            payload: { data }
        };
    }

    public updateHsnSacLabel(data: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_HSNSAC_LABEL,
            payload: { data }
        };
    }

    public updateItemCodeLabel(data: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_ITEM_CODE_LABEL,
            payload: { data }
        };
    }

    public updateDescLabel(data: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_DESC_LABEL,
            payload: { data }
        };
    }

    public updateRateLabel(data: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_RATE_LABEL,
            payload: { data }
        };
    }

    public updateDiscountLabel(data: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_DISCOUNT_LABEL,
            payload: { data }
        };
    }

    public updateTaxableValueLabel(data: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_TAXABLE_VALUE_LABEL,
            payload: { data }
        };
    }

    public updateTaxLabel(data: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_TAX_LABEL,
            payload: { data }
        };
    }

    public updateTotalLabel(data: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_TOTAL_LABEL,
            payload: { data }
        };
    }

    public updateQuantityLabel(data: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_QUANTITY_LABEL,
            payload: { data }
        };
    }

    public setTopPageMargin(data: number): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_TOP_MARGIN,
            payload: { data }
        };
    }

    public setLeftPageMargin(data: number): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_LEFT_MARGIN,
            payload: { data }
        };
    }

    public setBottomPageMargin(data: number): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_BOTTOM_MARGIN,
            payload: { data }
        };
    }

    public setRightPageMargin(data: number): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_RIGHT_MARGIN,
            payload: { data }
        };
    }

    public updateMessage1(data: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_MESSAGE1,
            payload: { data }
        };
    }

    public updateMessage2(data: string): CustomActions {
        return {
            type: INVOICE.TEMPLATE.UPDATE_MESSAGE2,
            payload: { data }
        };
    }

    public getInvoiceSetting(): CustomActions {
        return {
            type: INVOICE.SETTING.GET_INVOICE_SETTING
        };
    }

    public deleteWebhook(uniqueName: string): CustomActions {
        return {
            type: INVOICE.SETTING.DELETE_WEBHOOK,
            payload: uniqueName
        };
    }

    public updateInvoiceEmail(emailId: string): CustomActions {
        return {
            type: INVOICE.SETTING.UPDATE_INVOICE_EMAIL,
            payload: emailId
        };
    }

    public saveInvoiceWebhook(webhook: object): CustomActions {
        return {
            type: INVOICE.SETTING.SAVE_INVOICE_WEBHOOK,
            payload: webhook
        };
    }

    public updateInvoiceSetting(form: object): CustomActions {
        return {
            type: INVOICE.SETTING.UPDATE_INVOICE_SETTING,
            payload: form
        };
    }

    public getRazorPayDetail(): CustomActions {
        return {
            type: INVOICE.SETTING.GET_RAZORPAY_DETAIL
        };
    }

    public updateRazorPayDetail(form: object): CustomActions {
        return {
            type: INVOICE.SETTING.UPDATE_RAZORPAY_DETAIL,
            payload: form
        };
    }

    public deleteRazorPayDetail(): CustomActions {
        return {
            type: INVOICE.SETTING.DELETE_RAZORPAY_DETAIL
        };
    }

    public deleteInvoiceEmail(emailId: string): CustomActions {
        return {
            type: INVOICE.SETTING.DELETE_INVOICE_EMAIL,
            payload: emailId
        };
    }

    public SaveRazorPayDetail(form: object): CustomActions {
        return {
            type: INVOICE.SETTING.SAVE_RAZORPAY_DETAIL,
            payload: form
        };
    }

    public DownloadInvoice(accountUniqueName: string, dataToSend: { voucherNumber: string[], typeOfInvoice?: string[], voucherType?: string }): CustomActions {
        return {
            type: INVOICE_ACTIONS.DOWNLOAD_INVOICE,
            payload: { accountUniqueName, dataToSend }
        };
    }

    public DownloadInvoiceResponse(model: BaseResponse<string, string>): CustomActions {
        return {
            type: INVOICE_ACTIONS.DOWNLOAD_INVOICE_RESPONSE,
            payload: model
        };
    }

    public DownloadExportedInvoice(model: any): CustomActions {
        return {
            type: INVOICE_ACTIONS.DOWNLOAD_INVOICE_EXPORTED,
            payload: model
        };
    }

    public DownloadExportedInvoiceResponse(model: BaseResponse<string, string>): CustomActions {
        return {
            type: INVOICE_ACTIONS.DOWNLOAD_INVOICE_EXPORTED_RESPONSE,
            payload: model
        };
    }

    public SendInvoiceOnMail(accountUniqueName: string, dataToSend: { emailId: string[], voucherNumber: string[], typeOfInvoice: string[], voucherType?: string }): CustomActions {
        return {
            type: INVOICE_ACTIONS.SEND_MAIL,
            payload: { accountUniqueName, dataToSend }
        };
    }

    public SendInvoiceOnMailResponse(model: BaseResponse<string, string>): CustomActions {
        return {
            type: INVOICE_ACTIONS.SEND_MAIL_RESPONSE,
            payload: model
        };
    }

    public createRecurringInvoice(model: RecurringInvoice): CustomActions {
        return {
            type: INVOICE.RECURRING.CREATE_RECURRING_INVOICE,
            payload: model
        };
    }

    public createRecurringInvoiceResponse(model: RecurringInvoice): CustomActions {
        return {
            type: INVOICE.RECURRING.CREATE_RECURRING_INVOICE_RESPONSE,
            payload: model
        };
    }

    public updateRecurringInvoice(model: RecurringInvoice): CustomActions {
        return {
            type: INVOICE.RECURRING.UPDATE_RECURRING_INVOICE,
            payload: model
        };
    }

    public updateRecurringInvoiceResponse(model: RecurringInvoice): CustomActions {
        return {
            type: INVOICE.RECURRING.UPDATE_RECURRING_INVOICE_RESPONSE,
            payload: model
        };
    }

    public deleteRecurringInvoice(uniqueName: string): CustomActions {
        return {
            type: INVOICE.RECURRING.DELETE_RECURRING_INVOICE,
            payload: uniqueName
        };
    }

    public deleteRecurringInvoiceResponse(res: string): CustomActions {
        return {
            type: INVOICE.RECURRING.DELETE_RECURRING_INVOICE_RESPONSE,
            payload: res
        };
    }

    public SendInvoiceOnSms(accountUniqueName: string, dataToSend: { numbers: string[] }, voucherNumber): CustomActions {
        return {
            type: INVOICE_ACTIONS.SEND_SMS,
            payload: { accountUniqueName, dataToSend, voucherNumber }
        };
    }

    public SendInvoiceOnSmsResponse(model: BaseResponse<string, string>): CustomActions {
        return {
            type: INVOICE_ACTIONS.SEND_SMS_RESPONSE,
            payload: model
        };
    }

    public LoginEwaybillUser(model: BaseResponse<string, string>): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.LOGIN_EAYBILL_USER,
            payload: model
        };
    }

    public LoginEwaybillUserResponse(model: BaseResponse<string, string>): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.LOGIN_EAYBILL_USER_RESPONSE,
            payload: model
        };
    }

    public isLoggedInUserEwayBill(): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.IS_LOOGEDIN_USER_EWAYBILL
        };
    }

    public isLoggedInUserEwayBillResponse(model: BaseResponse<string, string>): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.IS_LOOGEDIN_USER_EWAYBILL_RESPONSE,
            payload: model
        };
    }

    public GenerateNewEwaybill(model: BaseResponse<string, string>): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.GENERATE_EWAYBILL,
            payload: model
        };
    }

    public GenerateNewEwaybillResponse(model: BaseResponse<string, string>): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.GENERATE_EWAYBILL_RESPONSE,
            payload: model
        };
    }

    public getALLEwaybillList(): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.GET_All_LIST_EWAYBILLS
        };
    }

    public getALLEwaybillListResponse(response: BaseResponse<IEwayBillAllList, any>): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.GET_All_LIST_EWAYBILLS_RESPONSE,
            payload: response
        };
    }

    // TRANSPORTER API
    public addEwayBillTransporter(model: IEwayBillTransporter): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.ADD_TRANSPORTER,
            payload: model
        };
    }

    public addEwayBillTransporterResponse(model: BaseResponse<string, string>): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.ADD_TRANSPORTER_RESPONSE,
            payload: model
        };
    }

    public updateEwayBillTransporter(currentTransportId, transportObj: IEwayBillTransporter): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.UPDATE_TRANSPORTER,
            payload: { currentTransportId, transportObj }
        };
    }

    public updateEwayBillTransporterResponse(model: BaseResponse<string, any>): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.UPDATE_TRANSPORTER_RESPONSE,
            payload: model
        };
    }

    public getALLTransporterList(model?: IEwayBillfilter): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.GET_ALL_TRANSPORTER,
            payload: model
        };
    }

    public getALLTransporterListResponse(response: BaseResponse<any, any>): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.GET_ALL_TRANSPORTER_RESPONSE,
            payload: response
        };
    }

    public deleteTransporter(transporterId: string): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.DELETE_TRANSPORTER,
            payload: transporterId
        };
    }

    public deleteTransporteResponse(response: any): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.DELETE_TRANSPORTER_RESPONSE,
            payload: response
        };
    }

    public UpdateEwayVehicle(model: UpdateEwayVehicle): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.UPDATE_EWAY_VEHICLE,
            payload: model
        };
    }

    public UpdateEwayVehicleResponse(response: any): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.UPDATE_EWAY_VEHICLE_RESPONSE,
            payload: response
        };
    }

    public cancelEwayBill(EwaycancelReq: IEwayBillCancel): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.CANCEL_EWAYBILL,
            payload: EwaycancelReq
        };
    }

    public cancelEwayBillResponse(response: any): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.CANCEL_EWAYBILL_RESPONSE,
            payload: response
        };
    }

    //  public downloadEwayBill(model: string): CustomActions {
    //     return {
    //       type: EWAYBILL_ACTIONS.DOWNLOAD_EWAYBILL,
    //       payload: model
    //     };
    //   }

    //    public ewaybillPreviewResponse(response) {
    //      return {
    //       type: EWAYBILL_ACTIONS.DOWNLOAD_EWAYBILL_RESPONSE,
    //       payload: response
    //     };
    //   }

    public GetAllEwayfilterRequest(model: IEwayBillfilter): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.GET_All_FILTERED_LIST_EWAYBILLS,
            payload: { body: model }
        };
    }

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
        if (response.status === 'error') {
            if (showToast) {
                this._toasty.errorToast(response.message);
            }
            return errorAction;
        } else {
            if (showToast && typeof response.body === 'string') {
                this._toasty.successToast(response.body);
            } else if (message) {
                this._toasty.successToast(message);
            }
        }
        return successAction;

    }

    public resetTransporterListResponse(): CustomActions {
        return {
            type: EWAYBILL_ACTIONS.RESET_ALL_TRANSPORTER_RESPONSE
        };
    }
}
