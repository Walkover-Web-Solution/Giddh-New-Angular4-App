import { Observable } from 'rxjs/Observable';
import { HttpWrapperService } from './httpWrapper.service';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { UserDetails } from '../models/api-models/loginModels';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { HandleCatch } from './catchManager/catchmanger';
import { INVOICE_API } from './apiurls/invoice.api';
import { CommonPaginatedRequest, IGetAllInvoicesResponse, GetAllLedgersForInvoiceResponse, InvoiceFilterClass, GenerateBulkInvoiceRequest, PreviewAndGenerateInvoiceRequest, PreviewAndGenerateInvoiceResponse, ActionOnInvoiceRequest } from '../models/api-models/Invoice';

@Injectable()
export class InvoiceService {

  private user: UserDetails;
  private companyUniqueName: string;

  constructor(private _http: HttpWrapperService, private store: Store<AppState>) {
  }

  /**
   * get INVOICES
   * URL:: company/:companyUniqueName/invoices?from=&to=
   */
  public GetAllInvoices(model: CommonPaginatedRequest): Observable<BaseResponse<IGetAllInvoicesResponse, CommonPaginatedRequest>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    // create url conditionally
    let url = this.createQueryString(INVOICE_API.GET_ALL_INVOICES, model);

    return this._http.get(url.replace(':companyUniqueName', this.companyUniqueName))
      .map((res) => {
        let data: BaseResponse<IGetAllInvoicesResponse, CommonPaginatedRequest> = res.json();
        data.request = model;
        data.queryString = { model };
        return data;
      })
      .catch((e) => HandleCatch<IGetAllInvoicesResponse, CommonPaginatedRequest>(e, ''));
  }

  /*
  * get all Ledgers for Invoice
  */

  public GetAllLedgersForInvoice(reqObj: CommonPaginatedRequest, model: InvoiceFilterClass): Observable<BaseResponse<GetAllLedgersForInvoiceResponse, CommonPaginatedRequest>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
        this.companyUniqueName = s.session.companyUniqueName;
      }
    });
    // create url conditionally
    let url = this.createQueryString(INVOICE_API.GET_ALL_LEDGERS_FOR_INVOICE, reqObj);
    return this._http.post(url.replace(':companyUniqueName', this.companyUniqueName), model)
      .map((res) => {
        let data: BaseResponse<GetAllLedgersForInvoiceResponse, CommonPaginatedRequest> = res.json();
        data.request = model;
        data.queryString = { reqObj };
        return data;
      })
      .catch((e) => HandleCatch<GetAllLedgersForInvoiceResponse, CommonPaginatedRequest>(e, reqObj, model));
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

  public GenerateBulkInvoice(reqObj: { combined: boolean }, model: GenerateBulkInvoiceRequest): Observable<BaseResponse<string, GenerateBulkInvoiceRequest>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
        this.companyUniqueName = s.session.companyUniqueName;
      }
    });
    // create url
    let url = INVOICE_API.GENERATE_BULK_INVOICE +  '=' + reqObj.combined;
    return this._http.post(url.replace(':companyUniqueName', this.companyUniqueName), model)
      .map((res) => {
        let data: BaseResponse<string, GenerateBulkInvoiceRequest> = res.json();
        data.request = model;
        data.queryString = { reqObj };
        return data;
      })
      .catch((e) => HandleCatch<string, GenerateBulkInvoiceRequest>(e, reqObj, model));
  }

  /*
  * Preview and Generate Invoice
  * method: 'POST'
  * url: '/company/:companyUniqueName/accounts/:accountUniqueName/invoices/preview'
  */

  public PreviewAndGenerateInvoice(accountUniqueName: string, model: PreviewAndGenerateInvoiceRequest): Observable<BaseResponse<PreviewAndGenerateInvoiceResponse, PreviewAndGenerateInvoiceRequest>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
        this.companyUniqueName = s.session.companyUniqueName;
      }
    });
    return this._http.post(INVOICE_API.PREVIEW_AND_GENERATE.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', accountUniqueName), model)
      .map((res) => {
        let data: BaseResponse<PreviewAndGenerateInvoiceResponse, PreviewAndGenerateInvoiceRequest> = res.json();
        data.request = model;
        return data;
      })
      .catch((e) => HandleCatch<PreviewAndGenerateInvoiceResponse, PreviewAndGenerateInvoiceRequest>(e, model));
  }

  /**
   * get template by uniquename
   * URL:: company/:companyUniqueName/templates-v2/templateUniqueName
   */
  public GetTemplateDetails(templateUniqueName: string): Observable<BaseResponse<string, string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(INVOICE_API.GET_INVOICE_TEMPLATE.replace(':companyUniqueName', this.companyUniqueName).replace(':templateUniqueName', templateUniqueName))
      .map((res) => {
        let data: BaseResponse<string, string> = res.json();
        data.request = templateUniqueName;
        data.queryString = { templateUniqueName };
        return data;
      })
      .catch((e) => HandleCatch<string, string>(e, templateUniqueName));
  }
}
