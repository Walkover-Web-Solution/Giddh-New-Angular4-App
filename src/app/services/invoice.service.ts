import { Observable } from 'rxjs/Observable';
import { HttpWrapperService } from './httpWrapper.service';
import { Inject, Injectable, Optional } from '@angular/core';
import { UserDetails } from '../models/api-models/loginModels';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { ErrorHandler } from './catchManager/catchmanger';
import { INVOICE_API, INVOICE_API_2 } from './apiurls/invoice.api';
import { CommonPaginatedRequest, GenerateBulkInvoiceRequest, GenerateInvoiceRequestClass, GetAllLedgersForInvoiceResponse, IGetAllInvoicesResponse, InvoiceFilterClass, InvoiceTemplateDetailsResponse, PreviewInvoiceRequest, PreviewInvoiceResponseClass } from '../models/api-models/Invoice';
import { InvoiceSetting } from '../models/interfaces/invoice.setting.interface';
import { RazorPayDetailsResponse } from '../models/api-models/SettingsIntegraion';
import { GeneralService } from './general.service';
import { ServiceConfig, IServiceConfigArgs } from './service.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
declare var _: any;
@Injectable()
export class InvoiceService {

  private user: UserDetails;
  private companyUniqueName: string;
  private _: any;
  constructor(private errorHandler: ErrorHandler, private _http: HttpWrapperService, private _httpClient: HttpClient,  private _generalService: GeneralService,
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

    return this._http.post(url.replace(':companyUniqueName', this.companyUniqueName), body)
      .map((res) => {
        let data: BaseResponse<IGetAllInvoicesResponse, CommonPaginatedRequest> = res;
        data.request = model;
        data.queryString = { model };
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<IGetAllInvoicesResponse, CommonPaginatedRequest>(e, ''));
  }

  /*
  * get all Ledgers for Invoice
  */

  public GetAllLedgersForInvoice(reqObj: CommonPaginatedRequest, model: InvoiceFilterClass): Observable<BaseResponse<GetAllLedgersForInvoiceResponse, CommonPaginatedRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    // create url conditionally
    let url = this.createQueryString(this.config.apiUrl + INVOICE_API.GET_ALL_LEDGERS_FOR_INVOICE, reqObj);
    return this._http.post(url.replace(':companyUniqueName', this.companyUniqueName), model)
      .map((res) => {
        let data: BaseResponse<GetAllLedgersForInvoiceResponse, CommonPaginatedRequest> = res;
        data.request = model;
        data.queryString = { reqObj };
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<GetAllLedgersForInvoiceResponse, CommonPaginatedRequest>(e, reqObj, model));
  }

  /*
  * get url ready with querystring params
  * pass url and model obj
  */

  public createQueryString(str, model) {
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
      url = url + 'count=' + model.count;
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
    return this._http.post(url.replace(':companyUniqueName', this.companyUniqueName), model)
      .map((res) => {
        let data: BaseResponse<any, GenerateBulkInvoiceRequest[]> = res;
        data.request = model;
        data.queryString = {reqObj, requestedFrom};
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<any, GenerateBulkInvoiceRequest[]>(e, reqObj, model));
  }

  /**
   * PREVIEW OF GENERATED INVOICE
   * URL:: v2/company/{companyUniqueName}/accounts/{accountUniqueName}/invoices/{invoiceNumber}/preview
   */
  public GetGeneratedInvoicePreview(accountUniqueName: string, invoiceNumber: string): Observable<BaseResponse<PreviewInvoiceResponseClass, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + INVOICE_API_2.GENERATED_INVOICE_PREVIEW.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', accountUniqueName), { invoiceNumber })
      .map((res) => {
        let data: BaseResponse<PreviewInvoiceResponseClass, string> = res;
        data.request = invoiceNumber;
        data.queryString = { invoiceNumber, accountUniqueName };
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<PreviewInvoiceResponseClass, string>(e, invoiceNumber));
  }

  /**
   * Update Generated Invoice
   */
  public UpdateGeneratedInvoice(accountUniqueName: string, model: GenerateInvoiceRequestClass): Observable<BaseResponse<string, GenerateInvoiceRequestClass>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.put(this.config.apiUrl + INVOICE_API_2.UPDATE_GENERATED_INVOICE.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', accountUniqueName), model)
      .map((res) => {
        let data: BaseResponse<string, GenerateInvoiceRequestClass> = res;
        data.request = model;
        data.queryString = { accountUniqueName };
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<string, GenerateInvoiceRequestClass>(e, model));
  }

  /*
  * Preview Invoice
  * method: 'POST'
  * url: '/company/:companyUniqueName/accounts/:accountUniqueName/invoices/preview'
  */

  public PreviewInvoice(accountUniqueName: string, model: PreviewInvoiceRequest): Observable<BaseResponse<PreviewInvoiceResponseClass, PreviewInvoiceRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + INVOICE_API_2.PREVIEW_INVOICE.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', accountUniqueName), model)
      .map((res) => {
        let data: BaseResponse<PreviewInvoiceResponseClass, PreviewInvoiceRequest> = res;
        data.request = model;
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<PreviewInvoiceResponseClass, PreviewInvoiceRequest>(e, model));
  }

  /**
   * Generate Invoice
   */
  public GenerateInvoice(accountUniqueName: string, model: GenerateInvoiceRequestClass): Observable<BaseResponse<GenerateInvoiceRequestClass, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + INVOICE_API_2.GENERATE_INVOICE.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', accountUniqueName), model)
      .map((res) => {
        let data: BaseResponse<GenerateInvoiceRequestClass, string> = res;
        data.request = '';
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<GenerateInvoiceRequestClass, string>(e, model));
  }

  /**
   * get template by uniquename
   * URL:: company/:companyUniqueName/templates-v2/templateUniqueName
   */
  public GetInvoiceTemplateDetails(templateUniqueName: string): Observable<BaseResponse<InvoiceTemplateDetailsResponse, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + INVOICE_API_2.GET_INVOICE_TEMPLATE_DETAILS.replace(':companyUniqueName', this.companyUniqueName).replace(':templateUniqueName', templateUniqueName))
      .map((res) => {
        let data: BaseResponse<InvoiceTemplateDetailsResponse, string> = res;
        data.request = templateUniqueName;
        data.queryString = { templateUniqueName };
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<InvoiceTemplateDetailsResponse, string>(e, templateUniqueName));
  }

  /**
   * Delete invoice
   * URL:: company/:companyUniqueName/invoices/:invoiceUniqueName
   */
  public DeleteInvoice(invoiceNumber: string): Observable<BaseResponse<string, string>> {
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
    return this._httpClient.request('delete', this.config.apiUrl + INVOICE_API.DELETE_INVOICE.replace(':companyUniqueName', this.companyUniqueName), { body : {invoiceNumber}, headers: args.headers })
      .map((res) => {
        // let data: BaseResponse<string, string> = res;
        let data: any = res;
        console.log('the data is :', data);
        data.request = invoiceNumber;
        data.queryString = { invoiceNumber };
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<string, string>(e, invoiceNumber));
  }

  /**
   * Perform Action On Invoice
   * URL:: company/:companyUniqueName/invoices/:invoiceUniqueName
   */
  public PerformActionOnInvoice(invoiceUniqueName: string, action: { action: string, amount?: number }): Observable<BaseResponse<string, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + INVOICE_API.ACTION_ON_INVOICE.replace(':companyUniqueName', this.companyUniqueName).replace(':invoiceUniqueName', invoiceUniqueName), action)
      .map((res) => {
        let data: BaseResponse<string, string> = res;
        data.request = invoiceUniqueName;
        data.queryString = { invoiceUniqueName, action };
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<string, string>(e, invoiceUniqueName));
  }

  /**
   * get invoice setting
   * URL:: company/:companyUniqueName/settings
   */
  public GetInvoiceSetting(): Observable<BaseResponse<InvoiceSetting, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    if (this.companyUniqueName) {
      return this._http.get(this.config.apiUrl + INVOICE_API.SETTING_INVOICE.replace(':companyUniqueName', this.companyUniqueName))
      .map((res) => {
        let data: BaseResponse<InvoiceSetting, string> = res;
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<InvoiceSetting, string>(e));
    } else {
      return Observable.empty();
    }
  }

  /**
   * delete invoice webhook
   * URL:: company/:companyUniqueName/settings/webhooks/:webhookUniqueName
   */
  public DeleteInvoiceWebhook(uniquename): Observable<BaseResponse<string, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.delete(this.config.apiUrl + INVOICE_API.DELETE_WEBHOOK.replace(':companyUniqueName', this.companyUniqueName).replace(':webhookUniquename', uniquename))
      .map((res) => {
        let data: BaseResponse<string, string> = res;
        data.queryString = { uniquename };
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<string, string>(e));
  }

  /**
   * update invoice emailId
   * URL:: company/:companyUniqueName/invoice-setting
   */
  public UpdateInvoiceEmail(emailId): Observable<BaseResponse<string, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.put(this.config.apiUrl + INVOICE_API.UPDATE_INVOICE_EMAIL.replace(':companyUniqueName', this.companyUniqueName), { emailAddress: emailId })
      .map((res) => {
        let data: BaseResponse<string, string> = res;
        data.queryString = { emailId };
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<string, string>(e));
  }

  /**
   * Save Invoice Webhook
   * URL:: company/:companyUniqueName/settings/webhooks
   */
  public SaveInvoiceWebhook(webhook): Observable<BaseResponse<string, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + INVOICE_API.SAVE_INVOICE_WEBHOOK.replace(':companyUniqueName', this.companyUniqueName), webhook)
      .map((res) => {
        let data: BaseResponse<string, string> = res;
        data.queryString = { webhook };
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<string, string>(e));
  }

  /**
   * Update Invoice Setting
   * URL:: company/:companyUniqueName/settings/
   */
  public UpdateInvoiceSetting(form): Observable<BaseResponse<string, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.put(this.config.apiUrl + INVOICE_API.SETTING_INVOICE.replace(':companyUniqueName', this.companyUniqueName), form)
      .map((res) => {
        let data: BaseResponse<string, string> = res;
        data.queryString = { form };
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<string, string>(e));
  }

  /**
   * Get razorPay details
   * URL:: company/:companyUniqueName/razorpay
   */
  public GetRazorPayDetail(): Observable<BaseResponse<RazorPayDetailsResponse, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + INVOICE_API.GET_RAZORPAY_DETAIL.replace(':companyUniqueName', this.companyUniqueName))
      .map((res) => {
        let data: BaseResponse<RazorPayDetailsResponse, string> = res;
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<RazorPayDetailsResponse, string>(e));
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
    return this._http.put(this.config.apiUrl + INVOICE_API.GET_RAZORPAY_DETAIL.replace(':companyUniqueName', this.companyUniqueName), form)
      .map((res) => {
        let data: BaseResponse<RazorPayDetailsResponse, string> = res;
        data.queryString = { form };
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<RazorPayDetailsResponse, string>(e));
  }

  /**
   * Delete razorPay details
   * URL:: company/:companyUniqueName/razorpay
   */
  public DeleteRazorPayDetail(): Observable<BaseResponse<string, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.delete(this.config.apiUrl + INVOICE_API.GET_RAZORPAY_DETAIL.replace(':companyUniqueName', this.companyUniqueName))
      .map((res) => {
        let data: BaseResponse<string, string> = res;
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<string, string>(e));
  }

  /**
   * Delete Invoice emailID
   * URL:: company/:companyUniqueName/razorpay
   */
  public DeleteInvoiceEmail(emailId): Observable<BaseResponse<string, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.put(this.config.apiUrl + INVOICE_API.UPDATE_INVOICE_EMAIL.replace(':companyUniqueName', this.companyUniqueName), { emailAddress: emailId })
      .map((res) => {
        let data: BaseResponse<string, string> = res;
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<string, string>(e));
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
    return this._http.post(this.config.apiUrl + INVOICE_API.GET_RAZORPAY_DETAIL.replace(':companyUniqueName', this.companyUniqueName), form)
      .map((res) => {
        let data: BaseResponse<RazorPayDetailsResponse, string> = res;
        data.queryString = { form };
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<RazorPayDetailsResponse, string>(e));
  }

  /*
  * Download Invoice
  * API: 'accounts/:accountUniqueName/invoices/download'
  * Method: POST
  */
  public DownloadInvoice(accountUniqueName: string, dataToSend: { invoiceNumber: string[], typeOfInvoice?: string[] }): Observable<BaseResponse<string, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + INVOICE_API_2.DOWNLOAD_INVOICE.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', accountUniqueName), dataToSend).map((res) => {
      let data: BaseResponse<string, string> = res;
      data.queryString = { accountUniqueName, dataToSend };
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<string, string>(e));
  }

  /*
  * Send Invoice On Mail
  * API: 'accounts/:accountUniqueName/invoices/mail'
  * Method: POST
  */
  public SendInvoiceOnMail(accountUniqueName: string, dataToSend: { emailId: string[], invoiceNumber: string[], typeOfInvoice: string[] }): Observable<BaseResponse<string, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + INVOICE_API_2.SEND_INVOICE_ON_MAIL.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', accountUniqueName), dataToSend).map((res) => {
      let data: BaseResponse<string, string> = res;
      data.queryString = { accountUniqueName, dataToSend };
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<string, string>(e));
  }

  /*
  * Send Invoice On Sms
  * API: 'accounts/:accountUniqueName/invoices/mail'
  * Method: POST
  */
  public SendInvoiceOnSms(accountUniqueName: string, dataToSend: { numbers: string[] }, voucherNumber: string): Observable<BaseResponse<string, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + INVOICE_API_2.SEND_INVOICE_ON_SMS.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', accountUniqueName).replace(':voucherNumber', voucherNumber), dataToSend).map((res) => {
      let data: BaseResponse<string, string> = res;
      data.queryString = { accountUniqueName, dataToSend };
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<string, string>(e));
  }

}
