import { empty as observableEmpty, Observable } from 'rxjs';

import { catchError, map } from 'rxjs/operators';
import { HttpWrapperService } from './httpWrapper.service';
import { Inject, Injectable, Optional } from '@angular/core';
import { UserDetails } from '../models/api-models/loginModels';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { EWAYBILL_API, INVOICE_API, INVOICE_API_2 } from './apiurls/invoice.api';
import { CommonPaginatedRequest, GenerateBulkInvoiceRequest, GenerateInvoiceRequestClass, GetAllLedgersForInvoiceResponse, IEwayBillAllList, IEwayBillCancel, IEwayBillfilter, IEwayBillGenerateResponse, IEwayBillTransporter, IGetAllInvoicesResponse, InvoiceFilterClass, InvoiceTemplateDetailsResponse, PreviewInvoiceRequest, PreviewInvoiceResponseClass, UpdateEwayVehicle } from '../models/api-models/Invoice';
import { InvoiceSetting } from '../models/interfaces/invoice.setting.interface';
import { RazorPayDetailsResponse } from '../models/api-models/SettingsIntegraion';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ValidateInvoice } from '../models/api-models/Company';

declare var _: any;

@Injectable()
export class InvoiceService {
    public selectedInvoicesLists: any[] = [];

    // public selectedInvoicesLists = new BehaviorSubject<any[]>([{}]);
    // public getselectedInvoicesListss = this.selectedInvoicesLists.asObservable();
    private user: UserDetails;
    private companyUniqueName: string;
    private _: any;
    private voucherType: string = '';

    constructor(private errorHandler: GiddhErrorHandler, private _http: HttpWrapperService, private _httpClient: HttpClient, private _generalService: GeneralService,
        @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
        this._ = config._;
        _ = config._;
    }

    /**
     * get INVOICES
     * URL:: company/:companyUniqueName/invoices?from=&to=
     */
    public GetAllInvoices(model: CommonPaginatedRequest, body): Observable<BaseResponse<IGetAllInvoicesResponse, CommonPaginatedRequest>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        // create url conditionally
        let url = this.createQueryString(this.config.apiUrl + INVOICE_API.GET_ALL_INVOICES, model);

        return this._http.post(url.replace(':companyUniqueName', this.companyUniqueName), body).pipe(
            map((res) => {
                let data: BaseResponse<IGetAllInvoicesResponse, CommonPaginatedRequest> = res;
                data.request = model;
                data.queryString = { model };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<IGetAllInvoicesResponse, CommonPaginatedRequest>(e, '')));
    }

    /*
    * get all Ledgers for Invoice
    */

    public GetAllLedgersForInvoice(reqObj: CommonPaginatedRequest, model: InvoiceFilterClass): Observable<BaseResponse<GetAllLedgersForInvoiceResponse, CommonPaginatedRequest>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        // create url conditionally
        let url = this.createQueryString(this.config.apiUrl + INVOICE_API.GET_ALL_LEDGERS_FOR_INVOICE, reqObj);
        return this._http.post(url.replace(':companyUniqueName', this.companyUniqueName), model).pipe(
            map((res) => {
                let data: BaseResponse<GetAllLedgersForInvoiceResponse, CommonPaginatedRequest> = res;
                data.request = model;
                data.queryString = { reqObj };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<GetAllLedgersForInvoiceResponse, CommonPaginatedRequest>(e, reqObj, model)));
    }

    /*
    * get url ready with querystring params
    * pass url and model obj
    */

    private createQueryString(str, model) {
        let url = str;
        if ((model.from)) {
            url = url + 'from=' + model.from + '&';
        }
        if ((model.to)) {
            url = url + 'to=' + model.to + '&';
        }
        if ((model.page)) {
            url = url + 'page=' + model.page + '&';
        }
        if ((model.count)) {
            url = url + 'count=' + model.count + '&';
        }
        if ((model.voucherType)) {
            url = url + 'voucherType=' + model.voucherType;
        }

        return url;
    }

    /*
    * Generate Bulk Invoice
    * method: 'POST'
    * url: '/company/:companyUniqueName/invoices/bulk-generate?combined=:combined'
    */

    public GenerateBulkInvoice(reqObj: { combined: boolean }, model: GenerateBulkInvoiceRequest[], requestedFrom?: string): Observable<BaseResponse<any, GenerateBulkInvoiceRequest[]>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        // create url
        let url = this.config.apiUrl + INVOICE_API.GENERATE_BULK_INVOICE + '=' + reqObj.combined;
        return this._http.post(url.replace(':companyUniqueName', this.companyUniqueName).replace(':accountuniquename', model[0].accountUniqueName), model).pipe(
            map((res) => {
                let data: BaseResponse<any, GenerateBulkInvoiceRequest[]> = res;
                data.request = model;
                data.queryString = { reqObj, requestedFrom };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, GenerateBulkInvoiceRequest[]>(e, reqObj, model)));
    }

    /**
     * PREVIEW OF GENERATED INVOICE
     * URL:: v2/company/{companyUniqueName}/accounts/{accountUniqueName}/invoices/{invoiceNumber}/preview
     */
    public GetGeneratedInvoicePreview(accountUniqueName: string, invoiceNumber: string): Observable<BaseResponse<PreviewInvoiceResponseClass, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(this.config.apiUrl + INVOICE_API_2.GENERATED_INVOICE_PREVIEW.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', accountUniqueName), { invoiceNumber }).pipe(
            map((res) => {
                let data: BaseResponse<PreviewInvoiceResponseClass, string> = res;
                data.request = invoiceNumber;
                data.queryString = { invoiceNumber, accountUniqueName };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<PreviewInvoiceResponseClass, string>(e, invoiceNumber)));
    }

    /**
     * Update Generated Invoice
     */
    public UpdateGeneratedInvoice(accountUniqueName: string, model: GenerateInvoiceRequestClass): Observable<BaseResponse<string, GenerateInvoiceRequestClass>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.put(this.config.apiUrl + INVOICE_API_2.UPDATE_GENERATED_INVOICE.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', accountUniqueName), model).pipe(
            map((res) => {
                let data: BaseResponse<string, GenerateInvoiceRequestClass> = res;
                data.request = model;
                data.queryString = { accountUniqueName };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<string, GenerateInvoiceRequestClass>(e, model)));
    }

    /*
    * Preview Invoice
    * method: 'POST'
    * url: '/company/:companyUniqueName/accounts/:accountUniqueName/invoices/preview'
    */

    public PreviewInvoice(accountUniqueName: string, model: PreviewInvoiceRequest): Observable<BaseResponse<PreviewInvoiceResponseClass, PreviewInvoiceRequest>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(this.config.apiUrl + INVOICE_API_2.PREVIEW_VOUCHERS.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', accountUniqueName), model).pipe(
            map((res) => {
                let data: BaseResponse<PreviewInvoiceResponseClass, PreviewInvoiceRequest> = res;
                data.request = model;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<PreviewInvoiceResponseClass, PreviewInvoiceRequest>(e, model)));
    }

    /**
     * Generate Invoice
     */
    public GenerateInvoice(accountUniqueName: string, model: GenerateInvoiceRequestClass): Observable<BaseResponse<GenerateInvoiceRequestClass, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(this.config.apiUrl + INVOICE_API_2.GENERATE_INVOICE.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', accountUniqueName), model).pipe(
            map((res) => {
                let data: BaseResponse<GenerateInvoiceRequestClass, string> = res;
                data.request = '';
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<GenerateInvoiceRequestClass, string>(e, model)));
    }

    /**
     * get template by uniquename
     * URL:: company/:companyUniqueName/templates-v2/templateUniqueName
     */
    public GetInvoiceTemplateDetails(templateUniqueName: string): Observable<BaseResponse<InvoiceTemplateDetailsResponse, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + INVOICE_API_2.GET_INVOICE_TEMPLATE_DETAILS.replace(':companyUniqueName', this.companyUniqueName).replace(':templateUniqueName', templateUniqueName)).pipe(
            map((res) => {
                let data: BaseResponse<InvoiceTemplateDetailsResponse, string> = res;
                data.request = templateUniqueName;
                data.queryString = { templateUniqueName };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<InvoiceTemplateDetailsResponse, string>(e, templateUniqueName)));
    }

    /**
     * Delete invoice
     * URL:: company/:companyUniqueName/accounts/:accountUniqueName:/vouchers/
     */
    public DeleteInvoice(model: object, accountUniqueName): Observable<BaseResponse<string, string>> {
        let sessionId = this._generalService.sessionId;
        let args: any = { headers: {} };
        if (sessionId) {
            args.headers['Session-Id'] = sessionId;
        }
        args.headers['Content-Type'] = 'application/json';
        args.headers['Accept'] = 'application/json';
        args.headers = new HttpHeaders(args.headers);

        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._httpClient.request('delete', this.config.apiUrl + INVOICE_API_2.DELETE_VOUCHER.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', accountUniqueName), { body: model, headers: args.headers }).pipe(
            map((res) => {
                // let data: BaseResponse<string, string> = res;
                let data: any = res;
                data.request = model;
                data.queryString = { model };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<string, string>(e, model)));
    }

    /**
     * Perform Action On Invoice
     * URL:: company/:companyUniqueName/invoices/:invoiceUniqueName
     */
    public PerformActionOnInvoice(invoiceUniqueName: string, action: { action: string, amount?: number }): Observable<BaseResponse<string, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(this.config.apiUrl + INVOICE_API.ACTION_ON_INVOICE.replace(':companyUniqueName', this.companyUniqueName).replace(':invoiceUniqueName', invoiceUniqueName), action).pipe(
            map((res) => {
                let data: BaseResponse<string, string> = res;
                data.request = invoiceUniqueName;
                data.queryString = { invoiceUniqueName, action };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<string, string>(e, invoiceUniqueName)));
    }

    /**
     * get invoice setting
     * URL:: company/:companyUniqueName/settings
     */
    public GetInvoiceSetting(): Observable<BaseResponse<InvoiceSetting, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        if (this.companyUniqueName) {
            return this._http.get(this.config.apiUrl + INVOICE_API.SETTING_INVOICE.replace(':companyUniqueName', this.companyUniqueName)).pipe(
                map((res) => {
                    let data: BaseResponse<InvoiceSetting, string> = res;
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<InvoiceSetting, string>(e)));
        } else {
            return observableEmpty();
        }
    }

    /**
     * delete invoice webhook
     * URL:: company/:companyUniqueName/settings/webhooks/:webhookUniqueName
     */
    public DeleteInvoiceWebhook(uniquename): Observable<BaseResponse<string, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.delete(this.config.apiUrl + INVOICE_API.DELETE_WEBHOOK.replace(':companyUniqueName', this.companyUniqueName).replace(':webhookUniquename', uniquename)).pipe(
            map((res) => {
                let data: BaseResponse<string, string> = res;
                data.queryString = { uniquename };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    /**
     * update invoice emailId
     * URL:: company/:companyUniqueName/invoice-setting
     */
    public UpdateInvoiceEmail(emailId): Observable<BaseResponse<string, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.put(this.config.apiUrl + INVOICE_API.UPDATE_INVOICE_EMAIL.replace(':companyUniqueName', this.companyUniqueName), { emailAddress: emailId }).pipe(
            map((res) => {
                let data: BaseResponse<string, string> = res;
                data.queryString = { emailId };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    /**
     * Save Invoice Webhook
     * URL:: company/:companyUniqueName/settings/webhooks
     */
    public SaveInvoiceWebhook(webhook): Observable<BaseResponse<string, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(this.config.apiUrl + INVOICE_API.SAVE_INVOICE_WEBHOOK.replace(':companyUniqueName', this.companyUniqueName), webhook).pipe(
            map((res) => {
                let data: BaseResponse<string, string> = res;
                data.queryString = { webhook };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    /**
     * Update Invoice Setting
     * URL:: company/:companyUniqueName/settings/
     */
    public UpdateInvoiceSetting(form): Observable<BaseResponse<string, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.put(this.config.apiUrl + INVOICE_API.SETTING_INVOICE.replace(':companyUniqueName', this.companyUniqueName), form).pipe(
            map((res) => {
                let data: BaseResponse<string, string> = res;
                data.queryString = { form };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    /**
     * Get razorPay details
     * URL:: company/:companyUniqueName/razorpay
     */
    public GetRazorPayDetail(): Observable<BaseResponse<RazorPayDetailsResponse, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + INVOICE_API.GET_RAZORPAY_DETAIL.replace(':companyUniqueName', this.companyUniqueName)).pipe(
            map((res) => {
                let data: BaseResponse<RazorPayDetailsResponse, string> = res;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<RazorPayDetailsResponse, string>(e)));
    }

    /**
     * Update razorPay details
     * URL:: company/:companyUniqueName/razorpay
     */
    public UpdateRazorPayDetail(form): Observable<BaseResponse<RazorPayDetailsResponse, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        let newForm = _.cloneDeep(form);
        newForm.companyName = this.companyUniqueName;
        form = _.cloneDeep(newForm);
        return this._http.put(this.config.apiUrl + INVOICE_API.GET_RAZORPAY_DETAIL.replace(':companyUniqueName', this.companyUniqueName), form).pipe(
            map((res) => {
                let data: BaseResponse<RazorPayDetailsResponse, string> = res;
                data.queryString = { form };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<RazorPayDetailsResponse, string>(e)));
    }

    /**
     * Delete razorPay details
     * URL:: company/:companyUniqueName/razorpay
     */
    public DeleteRazorPayDetail(): Observable<BaseResponse<string, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.delete(this.config.apiUrl + INVOICE_API.GET_RAZORPAY_DETAIL.replace(':companyUniqueName', this.companyUniqueName)).pipe(
            map((res) => {
                let data: BaseResponse<string, string> = res;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    /**
     * Delete Invoice emailID
     * URL:: company/:companyUniqueName/razorpay
     */
    public DeleteInvoiceEmail(emailId): Observable<BaseResponse<string, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.put(this.config.apiUrl + INVOICE_API.UPDATE_INVOICE_EMAIL.replace(':companyUniqueName', this.companyUniqueName), { emailAddress: emailId }).pipe(
            map((res) => {
                let data: BaseResponse<string, string> = res;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    /**
     * Save razorPay details
     * URL:: company/:companyUniqueName/razorpay
     */
    public SaveRazorPayDetail(form): Observable<BaseResponse<RazorPayDetailsResponse, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        let newForm = _.cloneDeep(form);
        newForm.companyName = this.companyUniqueName;
        form = _.cloneDeep(newForm);
        return this._http.post(this.config.apiUrl + INVOICE_API.GET_RAZORPAY_DETAIL.replace(':companyUniqueName', this.companyUniqueName), form).pipe(
            map((res) => {
                let data: BaseResponse<RazorPayDetailsResponse, string> = res;
                data.queryString = { form };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<RazorPayDetailsResponse, string>(e)));
    }

    /*
    * Download Invoice
    * API: 'accounts/:accountUniqueName/invoices/download'
    * Method: POST
    */
    public DownloadInvoice(accountUniqueName: string, dataToSend: { voucherNumber: string[], typeOfInvoice?: string[], voucherType?: string }): Observable<any> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(this.config.apiUrl + INVOICE_API_2.DOWNLOAD_INVOICE.replace(':companyUniqueName', this.companyUniqueName)
            .replace(':accountUniqueName', accountUniqueName), dataToSend, { responseType: 'blob' }).pipe(map((res) => {
                return res;
            }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e)));
    }

    /*
    * Send Invoice On Mail
    * API: 'accounts/:accountUniqueName/invoices/mail'
    * Method: POST
    */
    public SendInvoiceOnMail(accountUniqueName: string, dataToSend: { emailId: string[], voucherNumber: string[], typeOfInvoice: string[], voucherType?: string }): Observable<BaseResponse<string, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(this.config.apiUrl + INVOICE_API_2.SEND_INVOICE_ON_MAIL.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', accountUniqueName), dataToSend).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            data.queryString = { accountUniqueName, dataToSend };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    /*
    * Send Invoice On Sms
    * API: 'accounts/:accountUniqueName/invoices/mail'
    * Method: POST
    */
    public SendInvoiceOnSms(accountUniqueName: string, dataToSend: { numbers: string[] }, voucherNumber: string): Observable<BaseResponse<string, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(this.config.apiUrl + INVOICE_API_2.SEND_INVOICE_ON_SMS.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', accountUniqueName).replace(':voucherNumber', voucherNumber), dataToSend).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            data.queryString = { accountUniqueName, dataToSend };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    // Login eway bill user
    public LoginEwaybillUser(dataToSend: any): Observable<BaseResponse<string, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(this.config.apiUrl + EWAYBILL_API.LOGIN_EWAYBILL_USER.replace(':companyUniqueName', this.companyUniqueName), dataToSend).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    // Is User Logged In eway bill
    public IsUserLoginEwayBill(): Observable<BaseResponse<any, any>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + EWAYBILL_API.LOGIN_EWAYBILL_USER.replace(':companyUniqueName', this.companyUniqueName)).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    // GENERATE EWAY BILL
    public GenerateNewEwaybill(dataToSend: any): Observable<BaseResponse<string, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(this.config.apiUrl + EWAYBILL_API.GENERATE_EWAYBILL.replace(':companyUniqueName', this.companyUniqueName), dataToSend).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    // public getAllEwaybills(): Observable<BaseResponse<IEwayBillGenerateResponse, any>> {
    //   this.user = this._generalService.user;
    //   this.companyUniqueName = this._generalService.companyUniqueName;
    //   return this._http.get(this.config.apiUrl + EWAYBILL_API.GET_ALL_GENERATED_EWAYBILLS.replace(':companyUniqueName', this.companyUniqueName)).pipe(map((res) => {
    //     let data: BaseResponse<string, string> = res;
    //     return data;
    //   }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    // }

    // GET EWAY BILL USING EWAY BILL NO.
    public getEwaybillsDetails(EwayBillNumber: string): Observable<BaseResponse<IEwayBillGenerateResponse, any>> {
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + EWAYBILL_API.GET_ALL_GENERATED_EWAYBILLS.replace(':companyUniqueName', this.companyUniqueName).replace(':ewaybillNumber', EwayBillNumber)).pipe(
            map((res) => {
                let data: BaseResponse<IEwayBillGenerateResponse, any> = res;
                data.request = EwayBillNumber;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<IEwayBillGenerateResponse, string>(e, EwayBillNumber)));
    }

    public getAllEwaybillsList(): Observable<BaseResponse<IEwayBillAllList, any>> {
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + EWAYBILL_API.GENERATE_EWAYBILL.replace(':companyUniqueName', this.companyUniqueName)).pipe(
            map((res) => {
                let data: BaseResponse<IEwayBillAllList, any> = res;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<IEwayBillAllList, string>(e)));
    }

    public getAllEwaybillsfilterList(body: IEwayBillfilter): Observable<BaseResponse<IEwayBillAllList, IEwayBillfilter>> {
        this.companyUniqueName = this._generalService.companyUniqueName;
        let url = this.createQueryStringForEway(this.config.apiUrl + EWAYBILL_API.GENERATE_EWAYBILL, {
            page: body.page, count: body.count, fromDate: body.fromDate, toDate: body.toDate, sort: body.sort, sortBy: body.sortBy, searchTerm: body.searchTerm, searchOn: body.searchOn,
        });

        return this._http.get(url.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(
            map((res) => {
                let data: BaseResponse<IEwayBillAllList, IEwayBillfilter> = res;
                data.queryString = { sort: body.sort, sortBy: body.sortBy, searchTerm: body.searchTerm, searchOn: body.searchOn };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<IEwayBillAllList, IEwayBillfilter>(e)));
    }

    public createQueryStringForEway(str, model) {

        let url = str + '?';
        if ((model.fromDate)) {
            url = url + 'fromDate=' + model.fromDate + '&';
        }
        if ((model.toDate)) {
            url = url + 'toDate=' + model.toDate + '&';
        }
        if ((model.page)) {
            url = url + 'page=' + model.page + '&';
        }
        if ((model.sort)) {
            url = url + 'sort=' + model.sort + '&';
        }
        if ((model.sortBy)) {
            url = url + 'sortBy=' + model.sortBy + '&';
        }
        if ((model.searchTerm)) {
            url = url + 'searchTerm=' + model.searchTerm + '&';
        }
        if ((model.searchOn)) {
            url = url + 'searchOn=' + model.searchOn + '&';
        }
        if ((model.count)) {
            url = url + 'count=' + model.count;
        }

        return url;
    }

    //  public DownloadEwayBill(ewayBillNo: any, isPreview: boolean = false): any {
    //   this.user = this._generalService.user;
    //   this.companyUniqueName = this._generalService.companyUniqueName;
    //   return this._http.get(this.config.apiUrl + EWAYBILL_API.DOWNLOAD_EWAY
    //    .replace(':companyUniqueName', this.companyUniqueName)
    //     .replace(':ewaybillNumber', encodeURIComponent(ewayBillNo))
    //     , {responseType: isPreview ? 'text' : 'blob'}).pipe(
    //       map((res) => {
    //       let data: BaseResponse<any, any> = res;
    //       // data.queryString = accountUniqueName;
    //       // data.request = model;
    //       return data;
    //     }),
    //     catchError((e) => this.errorHandler.HandleCatch<any, any>(e))
    //   );
    // }
    // Download Eway
    public DownloadEwayBills(ewayBillNo: any): Observable<BaseResponse<string, any>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + EWAYBILL_API.DOWNLOAD_EWAY
            .replace(':companyUniqueName', this.companyUniqueName)
            .replace(':ewaybillNumber', encodeURIComponent(ewayBillNo)))
            .pipe(
                map((res) => {
                    let data: BaseResponse<string, any> = res;
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<string, any>(e)));
    }

    // Download detailed Eway

    public DownloadDetailedEwayBills(ewayBillNo: any): Observable<BaseResponse<string, any>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + EWAYBILL_API.DOWNLOAD_DETAILED_EWAY
            .replace(':companyUniqueName', this.companyUniqueName)
            .replace(':ewaybillNumber', encodeURIComponent(ewayBillNo)))
            .pipe(
                map((res) => {
                    let data: BaseResponse<string, any> = res;
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<string, any>(e)));
    }

    // cancel eway
    public cancelEwayBill(dataToSend: IEwayBillCancel): Observable<BaseResponse<string, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.put(this.config.apiUrl + EWAYBILL_API.CANCEL_EWAY_BILL.replace(':companyUniqueName', this.companyUniqueName), dataToSend).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    // Add eway Transporter
    public addEwayTransporter(dataToSend: any): Observable<BaseResponse<string, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(this.config.apiUrl + EWAYBILL_API.ADD_TRANSPORTER.replace(':companyUniqueName', this.companyUniqueName), dataToSend).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    public getTransporterByID(transporterId: string): Observable<BaseResponse<IEwayBillTransporter, any>> {
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + EWAYBILL_API.GET_TRANSPORTER_BYID.replace(':companyUniqueName', this.companyUniqueName).replace(':transporterId', transporterId)).pipe(
            map((res) => {
                let data: BaseResponse<IEwayBillTransporter, any> = res;
                data.request = transporterId;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<IEwayBillTransporter, string>(e, transporterId)));
    }

    public getAllTransporterList(body?: IEwayBillfilter): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this._generalService.companyUniqueName;

        let url = this.createQueryStringForEway(this.config.apiUrl + EWAYBILL_API.ADD_TRANSPORTER, {
            page: body.page, count: body.count, sort: body.sort, sortBy: body.sortBy
        });
        return this._http.get(url.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                data.queryString = { sort: body.sort, sortBy: body.sortBy };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
        // return this._http.get(this.config.apiUrl +  EWAYBILL_API.GET_ALL_TRANSPORTER.replace(':companyUniqueName', this.companyUniqueName)
        // .replace(':pageNo', model.page)).pipe(
        //   map((res) => {
        //     let data: BaseResponse<any, any> = res;
        //     return data;
        //   }),
        //   catchError((e) => this.errorHandler.HandleCatch<any, string>(e)));
    }

    public UpdateGeneratedTransporter(transporterId: string, model: IEwayBillTransporter): Observable<BaseResponse<string, IEwayBillTransporter>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.put(this.config.apiUrl + EWAYBILL_API.UPDATE_TRANSPORTER.replace(':companyUniqueName', this.companyUniqueName).replace(':transporterId', transporterId), model).pipe(
            map((res) => {
                let data: BaseResponse<string, any> = res;
                data.request = model;
                data.queryString = { transporterId };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<string, any>(e, model)));
    }

    // Update vehicle
    public updateEwayVehicle(model: UpdateEwayVehicle): Observable<BaseResponse<string, UpdateEwayVehicle>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.put(this.config.apiUrl + EWAYBILL_API.UPDATE_EWAY_VEHICLE.replace(':companyUniqueName', this.companyUniqueName), model).pipe(
            map((res) => {
                let data: BaseResponse<string, UpdateEwayVehicle> = res;
                data.request = model;
                // data.queryString = {};
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<string, UpdateEwayVehicle>(e, model)));
    }

    public deleteTransporterById(transporterId: string): Observable<BaseResponse<any, any>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.delete(this.config.apiUrl + EWAYBILL_API.UPDATE_TRANSPORTER.replace(':companyUniqueName', this.companyUniqueName).replace(':transporterId', transporterId)).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = transporterId;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<string, any>(e, transporterId)));
    }

    public validateInvoiceForEwaybill(dataToSend: ValidateInvoice): Observable<BaseResponse<any, any>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(this.config.apiUrl + EWAYBILL_API.VALIDATE_INVOICE_EWAYBILL.replace(':companyUniqueName', this.companyUniqueName), dataToSend).pipe(
            map((res) => {
                let data: BaseResponse<any, string> = res;

                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, string>(e, dataToSend)));
    }

    public exportCsvInvoiceDownload(model: any): Observable<BaseResponse<string, any>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(this.config.apiUrl + INVOICE_API.DOWNLOAD_INVOICE_EXPORT_CSV.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':from', encodeURIComponent(model.from)).replace(':to', encodeURIComponent(model.to)), model.dataToSend).pipe(
            map((res) => {
                let data: BaseResponse<string, any> = res;
                data.request = model;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<string, any>(model)));
    }

    public setSelectedInvoicesList(invoiceList: any[]) {
        this.selectedInvoicesLists = invoiceList;
    }

    public get getSelectedInvoicesList(): any[] {
        return this.selectedInvoicesLists;
    }

    public getVoucherType(): string {
        return this.voucherType;
    }

    get VoucherType(): string {
        return this.voucherType;
    }

    set VoucherType(val) {
        this.voucherType = val;
    }
}
