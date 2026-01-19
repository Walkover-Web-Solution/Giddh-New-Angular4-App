import { empty as observableEmpty, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpWrapperService } from './http-wrapper.service';
import { Inject, Injectable, Optional } from '@angular/core';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { CUSTOM_EMAIL_TEMPLATE, EWAYBILL_API, INVOICE_API, INVOICE_API_2 } from './apiurls/invoice.api';
import { CommonPaginatedRequest, GenerateBulkInvoiceRequest, GenerateInvoiceRequestClass, GetAllLedgersForInvoiceResponse, IEwayBillAllList, IEwayBillCancel, IEwayBillfilter, IEwayBillTransporter, InvoiceFilterClass, InvoiceTemplateDetailsResponse, PreviewInvoiceRequest, PreviewInvoiceResponseClass, UpdateEwayVehicle } from '../models/api-models/Invoice';
import { InvoiceSetting } from '../models/interfaces/invoice.setting.interface';
import { RazorPayDetailsResponse } from '../models/api-models/SettingsIntegraion';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ValidateInvoice } from '../models/api-models/Company';
import { VoucherTypeEnum } from '../models/api-models/Sales';
import { cloneDeep, concat, forEach, get, keys } from '../lodash-optimized';

declare var _: any;

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * InvoiceService service
 * Provides invoice related business logic and data operations
 */
export class InvoiceService {
    public selectedInvoicesLists: any[] = [];
    private companyUniqueName: string;
    private _: any;
    private voucherType: string = '';

    /**
     * Creates an instance of service
     * Initializes component dependencies and sets up initial state
     */
    constructor(private errorHandler: GiddhErrorHandler, private http: HttpWrapperService, private httpClient: HttpClient, private generalService: GeneralService,
        @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
        this._ = config._;
        _ = config._;
    }

    /*
    * get all Ledgers for Invoice
    */

    /**
     * Handles GetAllLedgersForInvoice functionality
     */
    public GetAllLedgersForInvoice(reqObj: CommonPaginatedRequest, model: InvoiceFilterClass): Observable<BaseResponse<GetAllLedgersForInvoiceResponse, CommonPaginatedRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        // create url conditionally
        let url = this.createQueryString(this.config.apiUrl + INVOICE_API.GET_ALL_LEDGERS_FOR_INVOICE, reqObj);
        return this.http.post(url?.replace(':companyUniqueName', this.companyUniqueName), model).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<GetAllLedgersForInvoiceResponse, CommonPaginatedRequest> = res;
                data.request = model;
                data.queryString = { reqObj };
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<GetAllLedgersForInvoiceResponse, CommonPaginatedRequest>(e, reqObj, model)));
    }

    /*
    * get url ready with querystring params
    * pass url and model obj
    */

    /**
     * Creates new querystring
     */
    private createQueryString(str, model) {
        let url = str;
        /**
         * Handles if functionality
         */
        if ((model.from)) {
            url = url + 'from=' + model.from + '&';
        }
        /**
         * Handles if functionality
         */
        if ((model.to)) {
            url = url + 'to=' + model.to + '&';
        }
        /**
         * Handles if functionality
         */
        if ((model.page)) {
            url = url + 'page=' + model.page + '&';
        }
        /**
         * Handles if functionality
         */
        if ((model.count)) {
            url = url + 'count=' + model.count + '&';
        }
        /**
         * Handles if functionality
         */
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

    /**
     * Handles GenerateBulkInvoice functionality
     */
    public GenerateBulkInvoice(reqObj: { combined: boolean }, model: any, requestedFrom?: string): Observable<BaseResponse<any, any[]>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        // create url
        let url;
        /**
         * Handles if functionality
         */
        if (this.generalService.voucherApiVersion === 2) {
            url = this.config.apiUrl + INVOICE_API_2.GENERATE_BULK_INVOICE + '=' + reqObj.combined;
            url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
        } else {
            url = this.config.apiUrl + INVOICE_API.GENERATE_BULK_INVOICE + '=' + reqObj.combined;
            url = url?.replace(':accountuniquename', encodeURIComponent(model[0].accountUniqueName));
        }
        return this.http.post(url?.replace(':companyUniqueName', this.companyUniqueName), model).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<any, any[]> = res;
                data.request = model;
                data.queryString = { reqObj, requestedFrom };
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<any, any[]>(e, reqObj, model)));
    }

    /**
     * PREVIEW OF GENERATED INVOICE
     * URL:: v2/company/{companyUniqueName}/accounts/{accountUniqueName}/invoices/{invoiceNumber}/preview
     */
    public GetGeneratedInvoicePreview(accountUniqueName: string, invoiceNumber: string): Observable<BaseResponse<PreviewInvoiceResponseClass, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + INVOICE_API_2.GENERATED_INVOICE_PREVIEW?.replace(':companyUniqueName', this.companyUniqueName)?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName)), { invoiceNumber }).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<PreviewInvoiceResponseClass, string> = res;
                data.request = invoiceNumber;
                data.queryString = { invoiceNumber, accountUniqueName };
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<PreviewInvoiceResponseClass, string>(e, invoiceNumber)));
    }

    /**
     * Update Generated Invoice
     */
    public UpdateGeneratedInvoice(accountUniqueName: string, model: GenerateInvoiceRequestClass): Observable<BaseResponse<string, GenerateInvoiceRequestClass>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + INVOICE_API_2.UPDATE_GENERATED_INVOICE?.replace(':companyUniqueName', this.companyUniqueName)?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName)), model).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<string, GenerateInvoiceRequestClass> = res;
                data.request = model;
                data.queryString = { accountUniqueName };
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<string, GenerateInvoiceRequestClass>(e, model)));
    }

    /*
    * Preview Invoice
    * method: 'POST'
    * url: '/company/:companyUniqueName/accounts/:accountUniqueName/invoices/preview'
    */

    public PreviewInvoice(accountUniqueName: string, model: PreviewInvoiceRequest): Observable<BaseResponse<PreviewInvoiceResponseClass, PreviewInvoiceRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl;

        /**
         * Handles if functionality
         */
        if (this.generalService.voucherApiVersion === 2) {
            url = url + INVOICE_API_2.PREVIEW_VOUCHERS_V4;
        } else {
            url = url + INVOICE_API_2.PREVIEW_VOUCHERS;
        }

        url = url?.replace(':companyUniqueName', this.companyUniqueName)
            ?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName));
        /**
         * Handles if functionality
         */
        if (this.generalService.voucherApiVersion === 2) {
            url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
        }
        return this.http.post(url, model).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<PreviewInvoiceResponseClass, PreviewInvoiceRequest> = res;
                data.request = model;
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<PreviewInvoiceResponseClass, PreviewInvoiceRequest>(e, model)));
    }

    /**
     * Generate Invoice
     */
    public GenerateInvoice(accountUniqueName: string, model: GenerateInvoiceRequestClass): Observable<BaseResponse<GenerateInvoiceRequestClass, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + INVOICE_API_2.GENERATE_INVOICE?.replace(':companyUniqueName', this.companyUniqueName)?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName)), model).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<GenerateInvoiceRequestClass, string> = res;
                data.request = '';
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<GenerateInvoiceRequestClass, string>(e, model)));
    }

    /**
     * get template by uniquename
     * URL:: company/:companyUniqueName/templates-v2/templateUniqueName
     */
    public GetInvoiceTemplateDetails(templateUniqueName: string): Observable<BaseResponse<InvoiceTemplateDetailsResponse, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + INVOICE_API_2.GET_INVOICE_TEMPLATE_DETAILS?.replace(':companyUniqueName', this.companyUniqueName)?.replace(':templateUniqueName', templateUniqueName)).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<InvoiceTemplateDetailsResponse, string> = res;
                data.request = templateUniqueName;
                data.queryString = { templateUniqueName };
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<InvoiceTemplateDetailsResponse, string>(e, templateUniqueName)));
    }

    /**
     * Delete invoice
     * URL:: company/:companyUniqueName/accounts/:accountUniqueName:/vouchers/
     */
    public DeleteInvoice(model: object, accountUniqueName): Observable<BaseResponse<string, string>> {
        let sessionId = this.generalService.sessionId;
        let args: any = { headers: {} };
        /**
         * Handles if functionality
         */
        if (sessionId) {
            args.headers['Session-Id'] = sessionId;
        }
        args.headers['Content-Type'] = 'application/json';
        args.headers['Accept'] = 'application/json';
        args.headers = new HttpHeaders(args.headers);

        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.httpClient.request('delete', this.config.apiUrl + INVOICE_API_2.DELETE_VOUCHER?.replace(':companyUniqueName', this.companyUniqueName)?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName)), { body: model, headers: args.headers }).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: any = res;
                data.request = model;
                data.queryString = { model };
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<string, string>(e, model)));
    }

    /**
     * Perform Action On Invoice
     * URL:: company/:companyUniqueName/invoices/:invoiceUniqueName
     */
    public PerformActionOnInvoice(invoiceUniqueName: string, action: { action: string, amount?: number }): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + INVOICE_API.ACTION_ON_INVOICE?.replace(':companyUniqueName', this.companyUniqueName)?.replace(':invoiceUniqueName', invoiceUniqueName);
        /**
         * Handles if functionality
         */
        if (this.generalService.voucherApiVersion === 2) {
            url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
        }
        return this.http.post(url, action).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<string, string> = res;
                data.request = invoiceUniqueName;
                data.queryString = { invoiceUniqueName, action };
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<string, string>(e, invoiceUniqueName)));
    }

    /**
     * get invoice setting
     * URL:: company/:companyUniqueName/settings
     */
    public GetInvoiceSetting(): Observable<BaseResponse<InvoiceSetting, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        /**
         * Handles if functionality
         */
        if (this.companyUniqueName) {
            return this.http.get(this.config.apiUrl + INVOICE_API.SETTING_INVOICE?.replace(':companyUniqueName', this.companyUniqueName)).pipe(
                /**
                 * Handles map functionality
                 */
                map((res) => {
                    let data: BaseResponse<InvoiceSetting, string> = res;
                    return data;
                }),
                /**
                 * Handles catchError functionality
                 */
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
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + INVOICE_API.DELETE_WEBHOOK?.replace(':companyUniqueName', this.companyUniqueName)?.replace(':webhookUniquename', uniquename)).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<string, string> = res;
                data.queryString = { uniquename };
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    /**
     * update invoice emailId
     * URL:: company/:companyUniqueName/invoice-setting
     */
    public UpdateInvoiceEmail(emailId): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + INVOICE_API.UPDATE_INVOICE_EMAIL?.replace(':companyUniqueName', this.companyUniqueName), { emailAddress: emailId }).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<string, string> = res;
                data.queryString = { emailId };
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    /**
     * Save Invoice Webhook
     * URL:: company/:companyUniqueName/settings/webhooks
     */
    public SaveInvoiceWebhook(webhook): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + INVOICE_API.SAVE_INVOICE_WEBHOOK?.replace(':companyUniqueName', this.companyUniqueName), webhook).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<string, string> = res;
                data.queryString = { webhook };
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    /**
     * Update Invoice Setting
     * URL:: company/:companyUniqueName/settings/
     */
    public UpdateInvoiceSetting(form): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + INVOICE_API.SETTING_INVOICE?.replace(':companyUniqueName', this.companyUniqueName), form).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<string, string> = res;
                data.queryString = { form };
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    /**
     * Get razorPay details
     * URL:: company/:companyUniqueName/razorpay
     */
    public GetRazorPayDetail(): Observable<BaseResponse<RazorPayDetailsResponse, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + INVOICE_API.GET_RAZORPAY_DETAIL?.replace(':companyUniqueName', this.companyUniqueName)).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<RazorPayDetailsResponse, string> = res;
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<RazorPayDetailsResponse, string>(e)));
    }

    /**
     * Update razorPay details
     * URL:: company/:companyUniqueName/razorpay
     */
    public UpdateRazorPayDetail(form): Observable<BaseResponse<RazorPayDetailsResponse, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let newForm = cloneDeep(form);
        newForm.companyName = this.companyUniqueName;
        form = cloneDeep(newForm);
        return this.http.put(this.config.apiUrl + INVOICE_API.GET_RAZORPAY_DETAIL?.replace(':companyUniqueName', this.companyUniqueName), form).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<RazorPayDetailsResponse, string> = res;
                data.queryString = { form };
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<RazorPayDetailsResponse, string>(e)));
    }

    /**
     * Delete razorPay details
     * URL:: company/:companyUniqueName/razorpay
     */
    public DeleteRazorPayDetail(): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + INVOICE_API.GET_RAZORPAY_DETAIL?.replace(':companyUniqueName', this.companyUniqueName)).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<string, string> = res;
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    /**
     * Delete Invoice emailID
     * URL:: company/:companyUniqueName/razorpay
     */
    public DeleteInvoiceEmail(emailId): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + INVOICE_API.UPDATE_INVOICE_EMAIL?.replace(':companyUniqueName', this.companyUniqueName), { emailAddress: emailId }).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<string, string> = res;
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    /**
     * Save razorPay details
     * URL:: company/:companyUniqueName/razorpay
     */
    public SaveRazorPayDetail(form): Observable<BaseResponse<RazorPayDetailsResponse, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let newForm = cloneDeep(form);
        newForm.companyName = this.companyUniqueName;
        form = cloneDeep(newForm);
        return this.http.post(this.config.apiUrl + INVOICE_API.GET_RAZORPAY_DETAIL?.replace(':companyUniqueName', this.companyUniqueName), form).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<RazorPayDetailsResponse, string> = res;
                data.queryString = { form };
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<RazorPayDetailsResponse, string>(e)));
    }

    /*
    * Download Invoice
    * API: 'accounts/:accountUniqueName/invoices/download'
    * Method: POST
    */
    public DownloadInvoice(accountUniqueName: string, dataToSend: { voucherNumber: string[], typeOfInvoice?: string[], voucherType?: string }): Observable<any> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + INVOICE_API_2.DOWNLOAD_INVOICE?.replace(':companyUniqueName', this.companyUniqueName)
            ?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName));

        /**
         * Handles if functionality
         */
        if (this.generalService.voucherApiVersion === 2) {
            url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
        }

        return this.http.post(url, dataToSend, { responseType: 'blob' }).pipe(map((res) => {
            return res;
        }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e)));
    }

    /*
    * Send Invoice On Mail
    * API: 'accounts/:accountUniqueName/invoices/mail'
    * Method: POST
    */
    public SendInvoiceOnMail(accountUniqueName: string, dataToSend: any): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + INVOICE_API_2.SEND_INVOICE_ON_MAIL?.replace(':companyUniqueName', this.companyUniqueName)
            ?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName));
        /**
         * Handles if functionality
         */
        if (this.generalService.voucherApiVersion === 2) {
            url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
        }
        return this.http.post(url, dataToSend).pipe(map((res) => {
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
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + INVOICE_API_2.SEND_INVOICE_ON_SMS?.replace(':companyUniqueName', this.companyUniqueName)?.replace(':accountUniqueName', encodeURIComponent(accountUniqueName))?.replace(':voucherNumber', voucherNumber), dataToSend).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            data.queryString = { accountUniqueName, dataToSend };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    // Login eway bill user
    /**
     * Handles LoginEwaybillUser functionality
     */
    public LoginEwaybillUser(dataToSend: any): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + EWAYBILL_API.LOGIN_EWAYBILL_USER?.replace(':companyUniqueName', this.companyUniqueName), dataToSend).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    // Is User Logged In eway bill
    /**
     * Handles IsUserLoginEwayBill functionality
     */
    public IsUserLoginEwayBill(): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + EWAYBILL_API.LOGIN_EWAYBILL_USER?.replace(':companyUniqueName', this.companyUniqueName)).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    // GENERATE EWAY BILL
    /**
     * Handles GenerateNewEwaybill functionality
     */
    public GenerateNewEwaybill(dataToSend: any): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + EWAYBILL_API.GENERATE_EWAYBILL?.replace(':companyUniqueName', this.companyUniqueName), dataToSend).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    /**
     * Retrieves allewaybillslist data
     */
    public getAllEwaybillsList(): Observable<BaseResponse<IEwayBillAllList, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + EWAYBILL_API.GENERATE_EWAYBILL?.replace(':companyUniqueName', this.companyUniqueName)).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<IEwayBillAllList, any> = res;
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<IEwayBillAllList, string>(e)));
    }

    /**
     * Retrieves allewaybillsfilterlist data
     */
    public getAllEwaybillsfilterList(body: IEwayBillfilter): Observable<BaseResponse<IEwayBillAllList, IEwayBillfilter>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.createQueryStringForEway(this.config.apiUrl + EWAYBILL_API.GENERATE_EWAYBILL, {
            page: body?.page, count: body?.count, fromDate: body?.fromDate, toDate: body?.toDate, sort: body?.sort, sortBy: body?.sortBy, searchTerm: body?.searchTerm, searchOn: body?.searchOn, gstin: body?.gstin,
            failedRequestLog: body?.failedRequestLog
        });
        /**
         * Handles if functionality
         */
        if (body?.branchUniqueName) {
            body.branchUniqueName = body?.branchUniqueName !== this.companyUniqueName ? body?.branchUniqueName : '';
            url = url.concat(`&branchUniqueName=${body?.branchUniqueName}`);
        }
        return this.http.get(url?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<IEwayBillAllList, IEwayBillfilter> = res;
                data.queryString = { sort: body?.sort, sortBy: body?.sortBy, searchTerm: body?.searchTerm, searchOn: body?.searchOn, gstin: body?.gstin };
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<IEwayBillAllList, IEwayBillfilter>(e)));
    }

    /**
     * Creates new querystringforeway
     */
    public createQueryStringForEway(str, model) {

        let url = str + '?';
        /**
         * Handles if functionality
         */
        if ((model.fromDate)) {
            url = url + 'fromDate=' + model.fromDate + '&';
        }
        /**
         * Handles if functionality
         */
        if ((model.toDate)) {
            url = url + 'toDate=' + model.toDate + '&';
        }
        /**
         * Handles if functionality
         */
        if ((model.gstin)) {
            url = url + 'gstin=' + model.gstin + '&';
        }
        /**
         * Handles if functionality
         */
        if ((model.page)) {
            url = url + 'page=' + model.page + '&';
        }
        /**
         * Handles if functionality
         */
        if ((model.sort)) {
            url = url + 'sort=' + model.sort + '&';
        }
        /**
         * Handles if functionality
         */
        if ((model.sortBy)) {
            url = url + 'sortBy=' + model.sortBy + '&';
        }
        /**
         * Handles if functionality
         */
        if ((model.searchTerm)) {
            url = url + 'searchTerm=' + model.searchTerm + '&';
        }
        /**
         * Handles if functionality
         */
        if ((model.searchOn)) {
            url = url + 'searchOn=' + model.searchOn + '&';
        }
        /**
         * Handles if functionality
         */
        if ((model.count)) {
            url = url + 'count=' + model.count;
        }
        /**
         * Handles if functionality
         */
        if (model.failedRequestLog) {
            url = url + '&failedRequestLog=' + model.failedRequestLog;
        }

        return url;
    }

    // Download Eway
    /**
     * Handles DownloadEwayBills functionality
     */
    public DownloadEwayBills(ewayBillNo: any): Observable<BaseResponse<string, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + EWAYBILL_API.DOWNLOAD_EWAY
            ?.replace(':companyUniqueName', this.companyUniqueName)
            ?.replace(':ewaybillNumber', encodeURIComponent(ewayBillNo)))
            .pipe(
                /**
                 * Handles map functionality
                 */
                map((res) => {
                    let data: BaseResponse<string, any> = res;
                    return data;
                }),
                /**
                 * Handles catchError functionality
                 */
                catchError((e) => this.errorHandler.HandleCatch<string, any>(e)));
    }

    // Download detailed Eway

    /**
     * Handles DownloadDetailedEwayBills functionality
     */
    public DownloadDetailedEwayBills(ewayBillNo: any): Observable<BaseResponse<string, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + EWAYBILL_API.DOWNLOAD_DETAILED_EWAY
            ?.replace(':companyUniqueName', this.companyUniqueName)
            ?.replace(':ewaybillNumber', encodeURIComponent(ewayBillNo)))
            .pipe(
                /**
                 * Handles map functionality
                 */
                map((res) => {
                    let data: BaseResponse<string, any> = res;
                    return data;
                }),
                /**
                 * Handles catchError functionality
                 */
                catchError((e) => this.errorHandler.HandleCatch<string, any>(e)));
    }

    // cancel eway
    /**
     * Handles cancelEwayBill functionality
     */
    public cancelEwayBill(dataToSend: IEwayBillCancel): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + EWAYBILL_API.CANCEL_EWAY_BILL?.replace(':companyUniqueName', this.companyUniqueName), dataToSend).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    // Add eway Transporter
    /**
     * Handles addEwayTransporter functionality
     */
    public addEwayTransporter(dataToSend: any): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + EWAYBILL_API.ADD_TRANSPORTER?.replace(':companyUniqueName', this.companyUniqueName), dataToSend).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
    }

    /**
     * Retrieves alltransporterlist data
     */
    public getAllTransporterList(body?: IEwayBillfilter): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;

        let url = this.createQueryStringForEway(this.config.apiUrl + EWAYBILL_API.ADD_TRANSPORTER, {
            page: body?.page, count: body?.count, sort: body?.sort, sortBy: body?.sortBy
        });
        return this.http.get(url?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<any, any> = res;
                data.queryString = { sort: body?.sort, sortBy: body?.sortBy };
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    /**
     * Handles UpdateGeneratedTransporter functionality
     */
    public UpdateGeneratedTransporter(transporterId: string, model: IEwayBillTransporter): Observable<BaseResponse<string, IEwayBillTransporter>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + EWAYBILL_API.UPDATE_TRANSPORTER?.replace(':companyUniqueName', this.companyUniqueName)?.replace(':transporterId', transporterId), model).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<string, any> = res;
                data.request = model;
                data.queryString = { transporterId };
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<string, any>(e, model)));
    }

    // Update vehicle
    /**
     * Updates existing ewayvehicle
     */
    public updateEwayVehicle(model: UpdateEwayVehicle): Observable<BaseResponse<string, UpdateEwayVehicle>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + EWAYBILL_API.UPDATE_EWAY_VEHICLE?.replace(':companyUniqueName', this.companyUniqueName), model).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<string, UpdateEwayVehicle> = res;
                data.request = model;
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<string, UpdateEwayVehicle>(e, model)));
    }

    /**
     * Deletes transporterbyid
     */
    public deleteTransporterById(transporterId: string): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + EWAYBILL_API.UPDATE_TRANSPORTER?.replace(':companyUniqueName', this.companyUniqueName)?.replace(':transporterId', transporterId)).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = transporterId;
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<string, any>(e, transporterId)));
    }

    /**
     * Validates invoiceforewaybill input
     */
    public validateInvoiceForEwaybill(dataToSend: ValidateInvoice): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + EWAYBILL_API.VALIDATE_INVOICE_EWAYBILL?.replace(':companyUniqueName', this.companyUniqueName), dataToSend).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<any, string> = res;

                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<any, string>(e, dataToSend)));
    }

    /**
     * Handles exportCsvInvoiceDownload functionality
     */
    public exportCsvInvoiceDownload(model: any): Observable<BaseResponse<string, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + INVOICE_API.DOWNLOAD_INVOICE_EXPORT_CSV?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':from', encodeURIComponent(model.from))?.replace(':to', encodeURIComponent(model.to));

        /**
         * Handles if functionality
         */
        if (this.generalService.voucherApiVersion === 2) {
            delete model.dataToSend.from;
            delete model.dataToSend.to;
            url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
        }

        return this.http.post(url, model.dataToSend).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<string, any> = res;
                data.request = model;
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<string, any>(model)));
    }

    /**
     * Sets selectedinvoiceslist value
     */
    public setSelectedInvoicesList(invoiceList: any[]) {
        this.selectedInvoicesLists = invoiceList;
    }

    public get getSelectedInvoicesList(): any[] {
        return this.selectedInvoicesLists;
    }

    /**
     * Retrieves vouchertype data
     */
    public getVoucherType(): string {
        return this.voucherType;
    }

    get VoucherType(): string {
        return this.voucherType;
    }

    set VoucherType(val) {
        this.voucherType = val;
    }

    /**
     * Removes the image signature
     *
     * @param {string} signatureUniqueName Unique name of the signature to be removed
     * @return {*} {Observable<BaseResponse<any, any>>} To carry out further operation
     * @memberof InvoiceService
     */
    public removeSignature(signatureUniqueName: string): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl +
            INVOICE_API.REMOVE_IMAGE_SIGNATURE
                ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
                ?.replace(':imgUniqueName', signatureUniqueName)).pipe(
                    /**
                     * Handles catchError functionality
                     */
                    catchError((error) => this.errorHandler.HandleCatch<string, any>(error)));
    }

    /**
     * Handler for cancellation of E-invoice
     *
     * @param {*} requestObject Request object for the API
     * @return {*}  {Observable<BaseResponse<any, any>>} Observable to carry out further operation
     * @memberof InvoiceService
     */
    public cancelEInvoice(requestObject: any): Observable<BaseResponse<any, any>> {
        let contextPath = `${this.config.apiUrl}${(requestObject.voucherType === VoucherTypeEnum.creditNote || requestObject.voucherType === VoucherTypeEnum.debitNote) ?
            INVOICE_API.CANCEL_CN_DN_E_INVOICE_API : INVOICE_API.CANCEL_E_INVOICE_API}`;
        this.companyUniqueName = this.generalService.companyUniqueName;
        contextPath = contextPath?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName));
        /**
         * Handles if functionality
         */
        if (requestObject.voucherType) {
            contextPath = contextPath?.replace(':voucherUniqueName', encodeURIComponent(requestObject.voucherUniqueName));
            delete requestObject.voucherUniqueName;
        } else {
            contextPath = contextPath?.replace(':invoiceUniqueName', encodeURIComponent(requestObject.invoiceUniqueName));
        }
        Object.keys(requestObject).forEach((key, index) => {
            const delimiter = index === 0 ? '?' : '&'
            /**
             * Handles if functionality
             */
            if (requestObject[key] !== undefined) {
                contextPath += `${delimiter}${key}=${encodeURIComponent(requestObject[key])}`
            }
        });
        return this.http.post(contextPath, {}).pipe(
            /**
             * Handles catchError functionality
             */
            catchError((error) => this.errorHandler.HandleCatch<string, any>(error)));
    }

    /**
     * Handler for cancellation of E-invoice for voucher version 2
     *
     * @param {*} requestObject
     * @param {*} postObject
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof InvoiceService
     */
    public cancelEInvoiceV2(requestObject: any, postObject: any): Observable<BaseResponse<any, any>> {
        let contextPath = `${this.config.apiUrl}${(requestObject.voucherType === VoucherTypeEnum.creditNote || requestObject.voucherType === VoucherTypeEnum.debitNote) ?
            INVOICE_API.CANCEL_CN_DN_E_INVOICE_API : INVOICE_API_2.CANCEL_E_INVOICE}`;
        this.companyUniqueName = this.generalService.companyUniqueName;
        contextPath = contextPath?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName));
        /**
         * Handles if functionality
         */
        if (requestObject.accountUniqueName) {
            contextPath = contextPath?.replace(':accountUniqueName', encodeURIComponent(requestObject.accountUniqueName));
            delete requestObject.accountUniqueName;
        }
        Object.keys(requestObject).forEach((key, index) => {
            const delimiter = index === 0 ? '?' : '&'
            /**
             * Handles if functionality
             */
            if (requestObject[key] !== undefined) {
                contextPath += `${delimiter}${key}=${encodeURIComponent(requestObject[key])}`
            }
        });

        /**
         * Handles if functionality
         */
        if (this.generalService.voucherApiVersion === 2) {
            contextPath = this.generalService.addVoucherVersion(contextPath, this.generalService.voucherApiVersion);
        }

        return this.http.post(contextPath, postObject).pipe(
            /**
             * Handles catchError functionality
             */
            catchError((error) => this.errorHandler.HandleCatch<string, any>(error)));
    }

    /**
     * This will verify the email
     *
     * @param {*} params
     * @returns {Observable<BaseResponse<any, string>>}
     * @memberof InvoiceService
     */
    public verifyEmail(params: any): Observable<BaseResponse<any, string>> {
        let url = this.config.apiUrl + INVOICE_API.VERIFY_EMAIL?.replace(':companyUniqueName', params.companyUniqueName)?.replace(':branchUniqueName', params.branchUniqueName)?.replace(':emailAddress', params.emailAddress)?.replace(':scope', params.scope);
        return this.http.get(url).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<any, string> = res;
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<any, string>(e)));
    }

    /**
     * This will get voucher versions
     *
     * @param {*} params
     * @param {string} voucherUniqueName
     * @return {*}  {Observable<BaseResponse<any, string>>}
     * @memberof InvoiceService
     */
    public getVoucherVersions(params: any, voucherUniqueName: string): Observable<BaseResponse<any, string>> {
        let url = this.config.apiUrl + INVOICE_API.GET_ALL_VERSIONS;
        url = url?.replace(':companyUniqueName', params.companyUniqueName);
        url = url?.replace(':voucherUniqueName', voucherUniqueName);
        url = url?.replace(':page', params.page);
        url = url?.replace(':count', params.count);

        /**
         * Handles if functionality
         */
        if (this.generalService.voucherApiVersion === 2) {
            url = this.generalService.addVoucherVersion(url, this.generalService.voucherApiVersion);
        }

        return this.http.get(url).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<any, string> = res;
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<any, string>(e)));
    }

    /**
     * Update custom email template
     *
     * @param {*} templateReq
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof InvoiceService
     */
    public updateCustomEmailTemplate(templateReq: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let voucherType = templateReq?.voucherType;
        delete templateReq?.voucherType;
        let url = this.config.apiUrl + CUSTOM_EMAIL_TEMPLATE.UPDATE_EMAIL_TEMPLATE?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':voucherType', voucherType);
        return this.http.put(url, templateReq.model).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = templateReq?.model;
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<any, any>(templateReq?.model)));
    }

    /**
     * Get email content suggestions
     *
     * @param {string} type Content suggestions type to get ('customer' or 'vendor')
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof InvoiceService
     */
    public getEmailContentSuggestions(type: string): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + CUSTOM_EMAIL_TEMPLATE.GET_EMAIL_CONTENT;
        url = url?.replace(':companyUniqueName', this.generalService.companyUniqueName);

        // Add additional query parameter based on type
        /**
         * Handles if functionality
         */
        if (type === 'customer') {
            url += '?isForCustomer=true';
        } else if (type === 'vendor') {
            url += '?isForVendor=true';
        } else if (type === 'account') {
            url += '?isForAccount=true';
        }

        return this.http.get(url).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<any, any> = res;
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    /**
     * Get email condition suggestions
     *
     * @param {string} triggerModule
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof InvoiceService
     */
    public getEmailConditions(triggerModule: string): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + CUSTOM_EMAIL_TEMPLATE.GET_EMAIL_CONDITIONS;
        url = url?.replace(':companyUniqueName', this.generalService.companyUniqueName);
        url = url?.replace(':triggerModule', triggerModule);
        return this.http.get(url).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<any, any> = res;
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    /**
     * Get email template
     *
     * @param {string} voucherType
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof InvoiceService
     */
    public getEmailTemplate(voucherType: string): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + CUSTOM_EMAIL_TEMPLATE.GET_EMAIL_TEMPLATE;
        url = url?.replace(':companyUniqueName', this.generalService.companyUniqueName);
        url = url?.replace(':voucherType', voucherType);
        return this.http.get(url).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<any, any> = res;
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    /**
    * Create trigger
    *
    * @param {any} model
    * @return {*}  {Observable<BaseResponse<any, any>>}
    * @memberof InvoiceService
    */
    public createTrigger(model: any): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + CUSTOM_EMAIL_TEMPLATE.CREATE_TRIGGERS
            ?.replace(':companyUniqueName', this.generalService.companyUniqueName);
        return this.http.post(url, model).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<any, any> = res;
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    /**
     * Update trigger
     *
     * @param {any} model
     * @param {string} uniqueName
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof InvoiceService
     */
    public updateTrigger(model: any, uniqueName: string): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + CUSTOM_EMAIL_TEMPLATE.UPDATE_TRIGGERS
            ?.replace(':companyUniqueName', this.generalService.companyUniqueName)
            ?.replace(':uniqueName', uniqueName);
        return this.http.put(url, model).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<any, any> = res;
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    /**
     * Get Trigger List
     *
     * @param {Object} request
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof InvoiceService
     */
    public getTriggerList(request: { page: number, count: number }): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + CUSTOM_EMAIL_TEMPLATE.GET_ALL_TRIGGERS
            ?.replace(':companyUniqueName', this.generalService.companyUniqueName)
            ?.replace(':page', request.page?.toString())
            ?.replace(':count', request.count?.toString());
        return this.http.get(url).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<any, any> = res;
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    /**
     * Get Trigger Details
     *
     * @param {string} uniqueName
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof InvoiceService
     */
    public getTriggerDetails(uniqueName: string): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + CUSTOM_EMAIL_TEMPLATE.GET_TRIGGER_DETAILS
            ?.replace(':companyUniqueName', this.generalService.companyUniqueName)
            ?.replace(':uniqueName', uniqueName);
        return this.http.get(url).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<any, any> = res;
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    /**
     * Delete Trigger
     *
     * @param {string} uniqueName
     * @return {*}  {Observable<BaseResponse<any, any>>}
     * @memberof InvoiceService
     */
    public deleteTrigger(uniqueName: string): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + CUSTOM_EMAIL_TEMPLATE.DELETE_TRIGGER
            ?.replace(':companyUniqueName', this.generalService.companyUniqueName)
            ?.replace(':uniqueName', uniqueName);
        return this.http.delete(url).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<any, any> = res;
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }
    
    /**
     * Get eway bill from place by pincode
     *
     * @param {string} pinCode Pincode to get eway bill from place
     * @returns {Observable<BaseResponse<any, string>>} Eway bill from place
     * @memberof InvoiceService
     */
    public getEwayBillFromPlace(pinCode: string): Observable<BaseResponse<any, string>> {
        const url = this.config.apiUrl + EWAYBILL_API.EWAYBILL_FROM_PLACE.replace(':pinCode', pinCode);
        return this.http.get(url).pipe(
            /**
             * Handles map functionality
             */
            map((res) => res as BaseResponse<any, string>),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<any, string>(e))
        );
    }
}
