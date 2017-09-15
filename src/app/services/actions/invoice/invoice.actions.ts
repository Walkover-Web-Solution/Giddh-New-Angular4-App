import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { InvoiceService } from '../../invoice.service';
import { InvoiceTemplatesService } from '../../invoice.templates.service';
import { AppState } from '../../../store/roots';
import { INVOICE_ACTIONS, INVOICE } from './invoice.const';
import { ToasterService } from '../../toaster.service';
import { Router } from '@angular/router';
import {
  IGetAllInvoicesResponse,
  CommonPaginatedRequest,
  GetAllLedgersForInvoiceResponse,
  InvoiceFilterClass,
  PreviewInvoiceRequest,
  PreviewInvoiceResponseClass,
  GetInvoiceTemplateDetailsResponse,
  Template,
  InvoiceTemplateDetailsResponse,
  GenerateInvoiceRequestClass,
  GenerateBulkInvoiceRequest
} from '../../../models/api-models/Invoice';
import { Font } from 'ngx-font-picker';
import {
  IsDivVisible,
  TaxInvoiceLabel
} from '../../../invoice/templates/edit-template/filters-container/content-filters/content.filters.component';
import { InvoiceSetting } from '../../../models/interfaces/invoice.setting.interface';
import { RazorPayDetailsResponse } from '../../../models/api-models/SettingsIntegraion';
// import {Section, Template} from "../../../models/api-models/invoice";
import { saveAs } from 'file-saver';

@Injectable()
export class InvoiceActions {

  // GET All Invoices
  @Effect()
  public GetAllInvoices$: Observable<Action> = this.action$
    .ofType(INVOICE_ACTIONS.GET_ALL_INVOICES)
    .switchMap(action => this._invoiceService.GetAllInvoices(action.payload))
    .map(response => {
      return this.GetAllInvoicesResponse(response);
    });

  @Effect()
  public GetAllInvoicesResponse$: Observable<Action> = this.action$
    .ofType(INVOICE_ACTIONS.GET_ALL_INVOICES_RESPONSE)
    .map(response => {
      return { type: '' };
    });

  // get all ledgers for invoice
  @Effect()
  public GetAllLedgersForInvoice$: Observable<Action> = this.action$
    .ofType(INVOICE_ACTIONS.GET_ALL_LEDGERS_FOR_INVOICE)
    .switchMap(action => this._invoiceService.GetAllLedgersForInvoice(action.payload.model, action.payload.body))
    .map(res => this.validateResponse<GetAllLedgersForInvoiceResponse, CommonPaginatedRequest>(res, {
      type: INVOICE_ACTIONS.GET_ALL_LEDGERS_FOR_INVOICE_RESPONSE,
      payload: res
    }, true, {
        type: INVOICE_ACTIONS.GET_ALL_LEDGERS_FOR_INVOICE_RESPONSE,
        payload: res
      }));

  // Preview Invoice
  @Effect()
  public PreviewInvoice$: Observable<Action> = this.action$
    .ofType(INVOICE_ACTIONS.PREVIEW_INVOICE)
    .switchMap(action => this._invoiceService.PreviewInvoice(action.payload.accountUniqueName, action.payload.body))
    .map(res => this.validateResponse<PreviewInvoiceResponseClass, PreviewInvoiceRequest>(res, {
      type: INVOICE_ACTIONS.PREVIEW_INVOICE_RESPONSE,
      payload: res
    }, true, {
        type: INVOICE_ACTIONS.PREVIEW_INVOICE_RESPONSE,
        payload: res
      }));

  // Generate Invoice
  @Effect()
  public GenerateInvoice$: Observable<Action> = this.action$
    .ofType(INVOICE_ACTIONS.GENERATE_INVOICE)
    .switchMap(action => this._invoiceService.GenerateInvoice(action.payload.accountUniqueName, action.payload.body))
    .map(res => this.validateResponse<GenerateInvoiceRequestClass, string>(res, {
      type: INVOICE_ACTIONS.GENERATE_INVOICE_RESPONSE,
      payload: res
    }, true, {
        type: INVOICE_ACTIONS.GENERATE_INVOICE_RESPONSE,
        payload: res
      }));

  // Generate Bulk Invoice
  @Effect()
  public GenerateBulkInvoice$: Observable<Action> = this.action$
    .ofType(INVOICE_ACTIONS.GENERATE_BULK_INVOICE)
    .switchMap(action => this._invoiceService.GenerateBulkInvoice(action.payload.reqObj, action.payload.body))
    .map(res => this.validateResponse<string, GenerateBulkInvoiceRequest[]>(res, {
      type: INVOICE_ACTIONS.GENERATE_BULK_INVOICE_RESPONSE,
      payload: res
    }, true, {
        type: INVOICE_ACTIONS.GENERATE_BULK_INVOICE_RESPONSE,
        payload: res
      }));

  // Delete Invoice
  @Effect()
  public DeleteInvoice$: Observable<Action> = this.action$
    .ofType(INVOICE_ACTIONS.DELETE_INVOICE)
    .switchMap(action => this._invoiceService.DeleteInvoice(action.payload))
    .map(response => {
      return this.DeleteInvoiceResponse(response);
    });

  @Effect()
  public DeleteInvoiceResponse$: Observable<Action> = this.action$
    .ofType(INVOICE_ACTIONS.DELETE_INVOICE_RESPONSE)
    .map(response => {
      let data: BaseResponse<string, string> = response.payload;
      if (data.status === 'error') {
        this._toasty.errorToast(data.message, data.code);
      } else {
        this._toasty.successToast('Invoice Deleted Successfully');
      }
      return { type: '' };
    });

  // Action On Invoice
  @Effect()
  public ActionOnInvoice$: Observable<Action> = this.action$
    .ofType(INVOICE_ACTIONS.ACTION_ON_INVOICE)
    .switchMap(action => this._invoiceService.PerformActionOnInvoice(action.payload.invoiceUniqueName, action.payload.action))
    .map(response => {
      return this.ActionOnInvoiceResponse(response);
    });

  @Effect()
  public ActionOnInvoiceResponse$: Observable<Action> = this.action$
    .ofType(INVOICE_ACTIONS.ACTION_ON_INVOICE_RESPONSE)
    .map(response => {
      let data: BaseResponse<string, string> = response.payload;
      if (data.status === 'error') {
        this._toasty.errorToast(data.message, data.code);
      } else {
        this._toasty.successToast('Invoice Successfully Updated.');
      }
      return { type: '' }; // Refresh the list
    });

  @Effect()
  public GetTemplateDetailsOfInvoice$: Observable<Action> = this.action$
    .ofType(INVOICE_ACTIONS.GET_INVOICE_TEMPLATE_DETAILS)
    .switchMap(action => this._invoiceService.GetInvoiceTemplateDetails(action.payload))
    .map(res => this.validateResponse<InvoiceTemplateDetailsResponse, string>(res, {
      type: INVOICE_ACTIONS.GET_INVOICE_TEMPLATE_DETAILS_RESPONSE,
      payload: res
    }, true, {
        type: INVOICE_ACTIONS.GET_INVOICE_TEMPLATE_DETAILS_RESPONSE,
        payload: res
      }));

  // *********************************** MUSTAFA //***********************************\\

  /**
   * GET INVOICE SETTING
   */
  @Effect()
  public getInvoiceSetting$: Observable<Action> = this.action$
    .ofType(INVOICE.SETTING.GET_INVOICE_SETTING)
    .switchMap(action => this._invoiceService.GetInvoiceSetting())
    .map(res => this.validateResponse<InvoiceSetting, string>(res, {
      type: INVOICE.SETTING.GET_INVOICE_SETTING_RESPONSE,
      payload: res
    }, true, {
        type: INVOICE.SETTING.GET_INVOICE_SETTING_RESPONSE,
        payload: res
      }));

  /**
   * DELETE INVOICE WEBHOOK
   */
  @Effect()
  public DeleteWebhook$: Observable<Action> = this.action$
    .ofType(INVOICE.SETTING.DELETE_WEBHOOK)
    .switchMap(action => this._invoiceService.DeleteInvoiceWebhook(action.payload))
    .map(res => this.validateResponse<string, string>(res, {
      type: INVOICE.SETTING.DELETE_WEBHOOK_RESPONSE,
      payload: res
    }, true, {
        type: INVOICE.SETTING.DELETE_WEBHOOK_RESPONSE,
        payload: res
      }));

  /**
   * UPDATE INVOICE EMAILID
   */
  @Effect()
  public UpdateInvoiceEmail$: Observable<Action> = this.action$
    .ofType(INVOICE.SETTING.UPDATE_INVOICE_EMAIL)
    .switchMap(action => this._invoiceService.UpdateInvoiceEmail(action.payload))
    .map(res => this.validateResponse<string, string>(res, {
      type: INVOICE.SETTING.UPDATE_INVOICE_EMAIL_RESPONSE,
      payload: res
    }, true, {
        type: INVOICE.SETTING.UPDATE_INVOICE_EMAIL_RESPONSE,
        payload: res
      }));

  /**
   * SAVE INVOICE WEBHOOK
   */
  @Effect()
  public SaveInvoiceWebhook$: Observable<Action> = this.action$
    .ofType(INVOICE.SETTING.SAVE_INVOICE_WEBHOOK)
    .switchMap(action => this._invoiceService.SaveInvoiceWebhook(action.payload))
    .map(res => this.validateResponse<string, string>(res, {
      type: INVOICE.SETTING.SAVE_INVOICE_WEBHOOK_RESPONSE,
      payload: res
    }, true, {
        type: INVOICE.SETTING.SAVE_INVOICE_WEBHOOK_RESPONSE,
        payload: res
      }));

  /**
   * UPDATE INVOICE SETTING
   */
  @Effect()
  public updateInvoiceSetting$: Observable<Action> = this.action$
    .ofType(INVOICE.SETTING.UPDATE_INVOICE_SETTING)
    .switchMap(action => this._invoiceService.UpdateInvoiceSetting(action.payload))
    .map(res => this.validateResponse<string, string>(res, {
      type: INVOICE.SETTING.UPDATE_INVOICE_SETTING_RESPONSE,
      payload: res
    }, true, {
        type: INVOICE.SETTING.UPDATE_INVOICE_SETTING_RESPONSE,
        payload: res
      }));

  /**
   * GET RAZORPAY DETAIL
   */
  @Effect()
  public GetRazorPayDetail$: Observable<Action> = this.action$
    .ofType(INVOICE.SETTING.GET_RAZORPAY_DETAIL)
    .switchMap(action => this._invoiceService.GetRazorPayDetail())
    .map(res => this.validateResponse<RazorPayDetailsResponse, string>(res, {
      type: INVOICE.SETTING.GET_RAZORPAY_DETAIL_RESPONSE,
      payload: res
    }, true, {
        type: INVOICE.SETTING.GET_RAZORPAY_DETAIL_RESPONSE,
        payload: res
      }));

  /**
   * UPDATE RAZORPAY DETAIL
   */
  @Effect()
  public UpdateRazorPayDetail$: Observable<Action> = this.action$
    .ofType(INVOICE.SETTING.UPDATE_RAZORPAY_DETAIL)
    .switchMap(action => this._invoiceService.UpdateRazorPayDetail(action.payload))
    .map(res => this.validateResponse<RazorPayDetailsResponse, string>(res, {
      type: INVOICE.SETTING.UPDATE_RAZORPAY_DETAIL_RESPONSE,
      payload: res
    }, true, {
        type: INVOICE.SETTING.UPDATE_RAZORPAY_DETAIL_RESPONSE,
        payload: res
      }));

  /**
   * DELETE RAZORPAY DETAIL
   */
  @Effect()
  public DeleteRazorPayDetail$: Observable<Action> = this.action$
    .ofType(INVOICE.SETTING.DELETE_RAZORPAY_DETAIL)
    .switchMap(action => this._invoiceService.DeleteRazorPayDetail())
    .map(res => this.validateResponse<string, string>(res, {
      type: INVOICE.SETTING.DELETE_RAZORPAY_DETAIL_RESPONSE,
      payload: res
    }, true, {
        type: INVOICE.SETTING.UPDATE_RAZORPAY_DETAIL_RESPONSE,
        payload: res
      }));

  /**
   * DELETE INVOICE EMAIL
   */
  @Effect()
  public DeleteInvoiceEmail$: Observable<Action> = this.action$
    .ofType(INVOICE.SETTING.DELETE_INVOICE_EMAIL)
    .switchMap(action => this._invoiceService.DeleteInvoiceEmail(action.payload))
    .map(res => this.validateResponse<string, string>(res, {
      type: INVOICE.SETTING.DELETE_INVOICE_EMAIL_RESPONSE,
      payload: res
    }, true, {
        type: INVOICE.SETTING.DELETE_INVOICE_EMAIL_RESPONSE,
        payload: res
      }));

  /**
   * SAVE RAZORPAY DETAIL
   */
  @Effect()
  public SaveRazorPayDetail$: Observable<Action> = this.action$
    .ofType(INVOICE.SETTING.SAVE_RAZORPAY_DETAIL)
    .switchMap(action => this._invoiceService.SaveRazorPayDetail(action.payload))
    .map(res => this.validateResponse<RazorPayDetailsResponse, string>(res, {
      type: INVOICE.SETTING.SAVE_RAZORPAY_DETAIL_RESPONSE,
      payload: res
    }, true, {
        type: INVOICE.SETTING.SAVE_RAZORPAY_DETAIL_RESPONSE,
        payload: res
      }));

  @Effect()
  public DownloadInvoice$: Observable<Action> = this.action$
    .ofType(INVOICE_ACTIONS.DOWNLOAD_INVOICE)
    .switchMap(action => {
      return this._invoiceService.DownloadInvoice(action.payload.accountUniqueName, action.payload.dataToSend)
        .map(response => this.DownloadInvoiceResponse(response));
    });

  @Effect()
  public DownloadInvoiceResponse$: Observable<Action> = this.action$
    .ofType(INVOICE_ACTIONS.DOWNLOAD_INVOICE_RESPONSE)
    .map(response => {
      let data: BaseResponse<any, string> = response.payload;
      if (data.status === 'error') {
        this._toasty.errorToast(data.message, data.code);
      } else {
        this.downloadFile(data.body, data.queryString.dataToSend.invoiceNumber[0]);
        this._toasty.successToast('Invoice Downloaded Successfully.');
      }
      return { type: '' };
    });

  @Effect()
  public SendInvoiceOnMail$: Observable<Action> = this.action$
    .ofType(INVOICE_ACTIONS.SEND_MAIL)
    .switchMap(action => {
      return this._invoiceService.SendInvoiceOnMail(action.payload.accountUniqueName, action.payload.dataToSend)
        .map(response => this.SendInvoiceOnMailResponse(response));
    });

  @Effect()
  public SendInvoiceOnMailResponse$: Observable<Action> = this.action$
    .ofType(INVOICE_ACTIONS.SEND_MAIL_RESPONSE)
    .map(response => {
      let data: BaseResponse<any, string> = response.payload;
      if (data.status === 'error') {
        this._toasty.errorToast(data.message, data.code);
      } else {
        this._toasty.successToast(data.body);
      }
      return { type: '' };
    });
  // *********************************** MUSTAFA //***********************************\\

  // write above except kunal
  // get all templates
  @Effect()
  public GetUserTemplates$ = this.action$
    .ofType(INVOICE.TEMPLATE.GET_USER_TEMPLATES)
    .switchMap(action => this._invoiceTemplatesService.getTemplates())
    .map((response: Template) => {
      // console.log('SET STATE ACTION CALLED');
      return this.setTemplateState(response);
    });

  // GET CUSTOM CREATED TEMPLATES
  @Effect()
  private getAllCreatedTemplates$: Observable<Action> = this.action$
    .ofType(INVOICE.TEMPLATE.GET_ALL_CREATED_TEMPLATES)
    .switchMap(action => this._invoiceTemplatesService.getAllCreatedTemplates())
    .map(response => {
      return this.getAllCreatedTemplatesResponse(response);
    });

  @Effect()
  private getAllCreatedTemplatesResponse$: Observable<Action> = this.action$
    .ofType(INVOICE.TEMPLATE.GET_ALL_CREATED_TEMPLATES_RESPONSE)
    .map(response => {
      let data: BaseResponse<any, any> = response.payload;
      if (data.status === 'error') {
        this._toasty.errorToast(data.message, data.code);
      }
      return { type : ''};
    });

  // SET TEMPLATE AS DEFAULT
  @Effect()
  private setTemplateAsDefault$: Observable<Action> = this.action$
    .ofType(INVOICE.TEMPLATE.SET_TEMPLATE_AS_DEFAULT)
    .switchMap(action => this._invoiceTemplatesService.setTemplateAsDefault(action.payload))
    .map(response => {
      return this.setTemplateAsDefaultResponse(response);
    });

  @Effect()
  private setTemplateAsDefaultResponse$: Observable<Action> = this.action$
    .ofType(INVOICE.TEMPLATE.SET_TEMPLATE_AS_DEFAULT_RESPONSE)
    .map(response => {
      let data: BaseResponse<any, any> = response.payload;
      if (data.status === 'error') {
        this._toasty.errorToast(data.message, data.code);
      } else {
        this._toasty.successToast('Template was set as default.');
      }
      return { type : ''};
    });

  // DELETE TEMPLATE
  @Effect()
  private deleteTemplate$: Observable<Action> = this.action$
    .ofType(INVOICE.TEMPLATE.DELETE_TEMPLATE)
    .switchMap(action => this._invoiceTemplatesService.deleteTemplate(action.payload))
    .map(response => {
      return this.deleteTemplateResponse(response);
    });

  @Effect()
  private deleteTemplateResponse$: Observable<Action> = this.action$
    .ofType(INVOICE.TEMPLATE.DELETE_TEMPLATE_RESPONSE)
    .map(response => {
      let data: BaseResponse<any, any> = response.payload;
      if (data.status === 'error') {
        this._toasty.errorToast(data.message, data.code);
      } else {
        this._toasty.successToast(data.body);
      }
      return { type : ''};
    });

  constructor(
    private action$: Actions,
    private _invoiceService: InvoiceService,
    private _invoiceTemplatesService: InvoiceTemplatesService,
    private _toasty: ToasterService,
    private _router: Router
  ) { }

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

  public downloadFile(data: Response, invoiceUniqueName: string) {
    let blob = this.base64ToBlob(data, 'application/pdf', 512);
    return saveAs(blob, `Invoice-${invoiceUniqueName}.pdf`);
  }

  public GetAllInvoices(model: CommonPaginatedRequest): Action {
    return {
      type: INVOICE_ACTIONS.GET_ALL_INVOICES,
      payload: model
    };
  }

  public GetAllInvoicesResponse(model: BaseResponse<IGetAllInvoicesResponse, CommonPaginatedRequest>): Action {
    return {
      type: INVOICE_ACTIONS.GET_ALL_INVOICES_RESPONSE,
      payload: model
    };
  }

  public GetAllLedgersForInvoice(model: CommonPaginatedRequest, data: InvoiceFilterClass): Action {
    return {
      type: INVOICE_ACTIONS.GET_ALL_LEDGERS_FOR_INVOICE,
      payload: { model, body: data }
    };
  }

  public GetAllLedgersForInvoiceResponse(model: GetAllLedgersForInvoiceResponse): Action {
    return {
      type: INVOICE_ACTIONS.GET_ALL_LEDGERS_FOR_INVOICE_RESPONSE,
      payload: model
    };
  }

  public PreviewInvoice(accountUniqueName: string, model: PreviewInvoiceRequest): Action {
    return {
      type: INVOICE_ACTIONS.PREVIEW_INVOICE,
      payload: { accountUniqueName, body: model }
    };
  }

  public PreviewInvoiceResponse(model: PreviewInvoiceResponseClass): Action {
    return {
      type: INVOICE_ACTIONS.PREVIEW_INVOICE_RESPONSE,
      payload: model
    };
  }

  public GenerateInvoice(accountUniqueName: string, model: GenerateInvoiceRequestClass): Action {
    return {
      type: INVOICE_ACTIONS.GENERATE_INVOICE,
      payload: { accountUniqueName, body: model }
    };
  }

  public GenerateInvoiceResponse(model: GenerateInvoiceRequestClass): Action {
    return {
      type: INVOICE_ACTIONS.GENERATE_INVOICE_RESPONSE,
      payload: model
    };
  }

  public GenerateBulkInvoice(reqObj: { combined: boolean }, model: GenerateBulkInvoiceRequest[]): Action {
    return {
      type: INVOICE_ACTIONS.GENERATE_BULK_INVOICE,
      payload: { reqObj, body: model }
    };
  }

  public GenerateBulkInvoiceResponse(): Action {
    return {
      type: INVOICE_ACTIONS.GENERATE_BULK_INVOICE_RESPONSE,
      payload: ''
    };
  }

  public GetTemplateDetailsOfInvoice(model: string): Action {
    return {
      type: INVOICE_ACTIONS.GET_INVOICE_TEMPLATE_DETAILS,
      payload: model
    };
  }

  public GetTemplateDetailsOfInvoiceResponse(model: BaseResponse<GetInvoiceTemplateDetailsResponse, string>): Action {
    return {
      type: INVOICE_ACTIONS.GET_INVOICE_TEMPLATE_DETAILS_RESPONSE,
      payload: model
    };
  }

  public DeleteInvoice(model: string): Action {
    return {
      type: INVOICE_ACTIONS.DELETE_INVOICE,
      payload: model
    };
  }

  public DeleteInvoiceResponse(model): Action {
    return {
      type: INVOICE_ACTIONS.DELETE_INVOICE_RESPONSE,
      payload: model
    };
  }

  public ActionOnInvoice(invoiceUniqueName: string, action: object, ): Action {
    return {
      type: INVOICE_ACTIONS.ACTION_ON_INVOICE,
      payload: { invoiceUniqueName, action }
    };
  }

  public ActionOnInvoiceResponse(model: any): Action {
    return {
      type: INVOICE_ACTIONS.ACTION_ON_INVOICE_RESPONSE,
      payload: model
    };
  }

  public ModifiedInvoiceStateData(model: string[]): Action {
    return {
      type: INVOICE_ACTIONS.MODIFIED_INVOICE_STATE_DATA,
      payload: model
    };
  }

  public InvoiceGenerationCompleted(): Action {
    return {
      type: INVOICE_ACTIONS.INVOICE_GENERATION_COMPLETED,
      payload: ''
    };
  }

  public setTemplateData(section: any) {
    return {
      payload: section,
      type: INVOICE.TEMPLATE.SET_TEMPLATE_DATA
    };
  }

  public getTemplateState(): Action {
    return {
      type: INVOICE.TEMPLATE.GET_USER_TEMPLATES
    };
  }

  public getAllCreatedTemplates(): Action {
    return {
      type: INVOICE.TEMPLATE.GET_ALL_CREATED_TEMPLATES
    };
  }

  public getAllCreatedTemplatesResponse(response: any): Action {
    return {
      type: INVOICE.TEMPLATE.GET_ALL_CREATED_TEMPLATES_RESPONSE,
      payload: response
    };
  }

  public setTemplateAsDefault(templateUniqueName: string): Action {
    return {
      type: INVOICE.TEMPLATE.SET_TEMPLATE_AS_DEFAULT,
      payload: templateUniqueName
    };
  }

  public setTemplateAsDefaultResponse(response: any): Action {
    return {
      type: INVOICE.TEMPLATE.SET_TEMPLATE_AS_DEFAULT_RESPONSE,
      payload: response
    };
  }

  public deleteTemplate(templateUniqueName: string): Action {
    return {
      type: INVOICE.TEMPLATE.DELETE_TEMPLATE,
      payload: templateUniqueName
    };
  }

  public deleteTemplateResponse(response: any): Action {
    return {
      type: INVOICE.TEMPLATE.DELETE_TEMPLATE_RESPONSE,
      payload: response
    };
  }

  public getCurrentTemplateSate(uniqueName: string): Action {
    return {
      payload: uniqueName,
      type: INVOICE.TEMPLATE.GET_CURRENT_TEMPLATE
    };
  }

  public setTemplateState(temp: Template): Action {
    return {
      type: INVOICE.TEMPLATE.SET_TEMPLATE_STATE,
      payload: { temp }
    };
  }

  public setTemplateId(id: string): Action {
    return {
      type: INVOICE.TEMPLATE.SELECT_TEMPLATE,
      payload: { id }
    };
  }
  public setFont(font: string): Action {
    return {
      type: INVOICE.TEMPLATE.SET_FONT,
      payload: { font }
    };
  }
  public setColor(color: string): Action {
    return {
      type: INVOICE.TEMPLATE.SET_COLOR,
      payload: { color }
    };
  }
  public updateGSTIN(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_GSTIN,
      payload: { data }
    };
  }

  public updatePAN(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_PAN,
      payload: { data }
    };
  }

  public update(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_PAN,
      payload: { data }
    };
  }

  public setColumnWidth(width: number, colName: string): Action {
    return {
      type: INVOICE.CONTENT.SET_COLUMN_WIDTH,
      payload: { width, colName }
    };

  }

  public updateInvoiceDate(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_INVOICE_DATE,
      payload: { data }
    };
  }

  public updateInvoiceNo(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_INVOICE_NO,
      payload: { data }
    };
  }

  public updateShippingDate(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_SHIPPING_DATE,
      payload: { data }
    };
  }

  public updateShippingNo(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_SHIPPING_NO,
      payload: { data }
    };
  }

  public updateShippingVia(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_SHIPPING_VIA,
      payload: { data }
    };
  }

  public updateTrackingDate(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_TRACKING_DATE,
      payload: { data }
    };
  }

  public updateTrackingNo(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_TRACKING_NO,
      payload: { data }
    };
  }

  public updateCustomerName(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_CUSTOMER_NAME,
      payload: { data }
    };
  }

  public updateCustomerEmail(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_CUSTOMER_EMAIL,
      payload: { data }
    };
  }

  public updateCustomerMobileNo(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_CUSTOMER_MOBILE_NO,
      payload: { data }
    };
  }

  public updateDueDate(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_DUE_DATE,
      payload: { data }
    };
  }

  public updateBillingState(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_BILLING_STATE,
      payload: { data }
    };
  }

  public updateBillingAddress(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_BILLING_ADDRESS,
      payload: { data }
    };
  }

  public updateBillingGSTIN(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_BILLING_GSTIN,
      payload: { data }
    };
  }

  public updateShippingState(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_SHIPPING_STATE,
      payload: { data }
    };
  }

  public updateShippingAddress(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_SHIPPING_ADDRESS,
      payload: { data }
    };
  }

  public updateShippingGSTIN(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_SHIPPING_GSTIN,
      payload: { data }
    };
  }

  public updateCustomField1(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_CUSTOM_FIELD_1,
      payload: { data }
    };
  }

  public updateCustomField2(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_CUSTOM_FIELD_2,
      payload: { data }
    };
  }

  public updateCustomField3(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_CUSTOM_FIELD_3,
      payload: { data }
    };
  }

  public updateFormNameInvoice(ti: TaxInvoiceLabel): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_FORM_NAME_INVOICE,
      payload: { ti }
    };
  }

  public updateFormNameTaxInvoice(ti: TaxInvoiceLabel): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_FORM_NAME_TAX_INVOICE,
      payload: { ti }
    };
  }

  public updateSnoLabel(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_SNOLABEL,
      payload: { data }
    };
  }

  public updateDateLabel(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_DATE_LABEL,
      payload: { data }
    };
  }

  public updateItemLabel(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_ITEM_LABEL,
      payload: { data }
    };
  }

  public updateHsnSacLabel(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_HSNSAC_LABEL,
      payload: { data }
    };
  }

  public updateItemCodeLabel(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_ITEM_CODE_LABEL,
      payload: { data }
    };
  }

  public updateDescLabel(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_DESC_LABEL,
      payload: { data }
    };
  }

  public updateRateLabel(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_RATE_LABEL,
      payload: { data }
    };
  }

  public updateDiscountLabel(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_DISCOUNT_LABEL,
      payload: { data }
    };
  }

  public updateTaxableValueLabel(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_TAXABLE_VALUE_LABEL,
      payload: { data }
    };
  }

  public updateTaxLabel(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_TAX_LABEL,
      payload: { data }
    };
  }

  public updateTotalLabel(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_TOTAL_LABEL,
      payload: { data }
    };
  }

  public updateQuantityLabel(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_QUANTITY_LABEL,
      payload: { data }
    };
  }

  public setTopPageMargin(data: number): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_TOP_MARGIN,
      payload: { data }
    };
  }

  public setLeftPageMargin(data: number): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_LEFT_MARGIN,
      payload: { data }
    };
  }

  public setBottomPageMargin(data: number): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_BOTTOM_MARGIN,
      payload: { data }
    };
  }

  public setRightPageMargin(data: number): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_RIGHT_MARGIN,
      payload: { data }
    };
  }

  public updateMessage1(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_MESSAGE1,
      payload: { data }
    };
  }

  public updateMessage2(data: string): Action {
    return {
      type: INVOICE.TEMPLATE.UPDATE_MESSAGE2,
      payload: { data }
    };
  }
  public setDivVisible(div: IsDivVisible): Action {
    // console.log(div);
    return {
      type: INVOICE.TEMPLATE.SET_VISIBLE,
      payload: { div }
    };
  }

  public getInvoiceSetting(): Action {
    return {
      type: INVOICE.SETTING.GET_INVOICE_SETTING
    };
  }

  public deleteWebhook(uniqueName: string): Action {
    return {
      type: INVOICE.SETTING.DELETE_WEBHOOK,
      payload: uniqueName
    };
  }

  public updateInvoiceEmail(emailId: string): Action {
    return {
      type: INVOICE.SETTING.UPDATE_INVOICE_EMAIL,
      payload: emailId
    };
  }

  public saveInvoiceWebhook(webhook: object): Action {
    return {
      type: INVOICE.SETTING.SAVE_INVOICE_WEBHOOK,
      payload: webhook
    };
  }

  public updateInvoiceSetting(form: object): Action {
    return {
      type: INVOICE.SETTING.UPDATE_INVOICE_SETTING,
      payload: form
    };
  }

  public getRazorPayDetail(): Action {
    return {
      type: INVOICE.SETTING.GET_RAZORPAY_DETAIL
    };
  }

  public updateRazorPayDetail(form: object): Action {
    return {
      type: INVOICE.SETTING.UPDATE_RAZORPAY_DETAIL,
      payload: form
    };
  }

  public deleteRazorPayDetail(): Action {
    return {
      type: INVOICE.SETTING.DELETE_RAZORPAY_DETAIL
    };
  }

  public deleteInvoiceEmail(emailId: string): Action {
    return {
      type: INVOICE.SETTING.DELETE_INVOICE_EMAIL,
      payload: emailId
    };
  }

  public SaveRazorPayDetail(form: object): Action {
    return {
      type: INVOICE.SETTING.SAVE_RAZORPAY_DETAIL,
      payload: form
    };
  }

  public DownloadInvoice(accountUniqueName: string, dataToSend: { invoiceNumber: string[], template: string }): Action {
    return {
      type: INVOICE_ACTIONS.DOWNLOAD_INVOICE,
      payload: { accountUniqueName, dataToSend}
    };
  }

  public DownloadInvoiceResponse(model: BaseResponse<string, string>): Action {
    return {
      type: INVOICE_ACTIONS.DOWNLOAD_INVOICE_RESPONSE,
      payload: model
    };
  }

  public SendInvoiceOnMail(accountUniqueName: string, dataToSend: { emailId: string[], invoiceNumber: string[]}): Action {
    return {
      type: INVOICE_ACTIONS.SEND_MAIL,
      payload: { accountUniqueName, dataToSend }
    };
  }

  public SendInvoiceOnMailResponse(model: BaseResponse<string, string>): Action {
    return {
      type: INVOICE_ACTIONS.SEND_MAIL_RESPONSE,
      payload: model
    };
  }

  private validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: Action, showToast: boolean = false, errorAction: Action = { type: '' }): Action {
    if (response.status === 'error') {
      if (showToast) {
        this._toasty.errorToast(response.message);
      }
      return errorAction;
    } else {
      if (showToast && typeof response.body === 'string') {
        this._toasty.successToast(response.body);
      }
    }
    return successAction;
  }
}
