import { catchError, map } from 'rxjs/operators';
import { Inject, Injectable, OnInit, Optional } from '@angular/core';
import { GeneralService } from './general.service';
import { DownloadVoucherRequest, InvoiceReceiptFilter, ReceiptVoucherDetailsRequest, ReciptDeleteRequest, ReciptRequest, ReciptResponse, Voucher } from '../models/api-models/recipt';
import { Observable } from 'rxjs';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { HttpWrapperService } from './httpWrapper.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { RECEIPT_API } from './apiurls/recipt.api';
import { ErrorHandler } from './catchManager/catchmanger';
import { UserDetails } from '../models/api-models/loginModels';

@Injectable()
export class ReceiptService implements OnInit {
  private companyUniqueName: string;
  private user: UserDetails;

  constructor(private _generalService: GeneralService, private _http: HttpWrapperService,
              private _httpClient: HttpClient, private errorHandler: ErrorHandler,
              @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    this.companyUniqueName = this._generalService.companyUniqueName;
  }

  public ngOnInit() {
    //
  }

  public UpdateReceipt(accountUniqueName: string, model: ReciptRequest): Observable<BaseResponse<string, ReciptRequest>> {
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.put(this.config.apiUrl + RECEIPT_API.PUT
      .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
      .replace(':accountUniqueName', encodeURIComponent(accountUniqueName)), model).pipe(
      map((res) => {
        let data: BaseResponse<string, ReciptRequest> = res;
        data.request = model;
        data.queryString = {accountUniqueName};
        return data;
      }),
      catchError((e) => this.errorHandler.HandleCatch<string, ReciptRequest>(e, model)));
  }

  public GetAllReceipt(body: InvoiceReceiptFilter, type: string): Observable<BaseResponse<ReciptResponse, InvoiceReceiptFilter>> {
    this.companyUniqueName = this._generalService.companyUniqueName;

    let url = this.createQueryString(this.config.apiUrl + RECEIPT_API.GET_ALL, {
      page: body.page, count: body.count, from: body.from, to: body.to, type
    });
    return this._http.post(url
      .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), body).pipe(
      map((res) => {
        let data: BaseResponse<ReciptResponse, InvoiceReceiptFilter> = res;
        data.queryString = {page: body.page, count: body.count, from: body.from, to: body.to, type: 'pdf'};
        data.request = body;
        return data;
      }),
      catchError((e) => this.errorHandler.HandleCatch<ReciptResponse, InvoiceReceiptFilter>(e, body, {page: body.page, count: body.count, from: body.from, to: body.to, type: 'pdf'})));
  }

  public DeleteReceipt(accountUniqueName: string, queryRequest: ReciptDeleteRequest): Observable<BaseResponse<string, ReciptDeleteRequest>> {
    this.companyUniqueName = this._generalService.companyUniqueName;
    let sessionId = this._generalService.sessionId;
    let args: any = {headers: {}};
    if (sessionId) {
      args.headers['Session-Id'] = sessionId;
    }
    args.headers['Content-Type'] = 'application/json';
    args.headers['Accept'] = 'application/json';
    args.headers = new HttpHeaders(args.headers);

    return this._httpClient.request('delete', this.config.apiUrl + RECEIPT_API.DELETE
      .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
      .replace(':accountUniqueName', encodeURIComponent(accountUniqueName)),
      {
        body: queryRequest,
        headers: args.headers,
      }).pipe(
      map((res) => {
        let data: any = res;
        data.request = queryRequest;
        data.queryString = {accountUniqueName};
        return data;
      }), catchError((e) => this.errorHandler.HandleCatch<string, ReciptDeleteRequest>(e, accountUniqueName)));
  }

  public DownloadVoucher(model: DownloadVoucherRequest, accountUniqueName: string, isPreview: boolean = false): any {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + RECEIPT_API.DOWNLOAD_VOUCHER
      .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
      .replace(':accountUniqueName', encodeURIComponent(accountUniqueName))
      , model, {responseType: isPreview ? 'text' : 'blob'}).pipe(
      map((res) => {
        let data: BaseResponse<any, any> = res;
        data.queryString = accountUniqueName;
        data.request = model;
        return data;
      }),
      catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model, {accountUniqueName}))
    );
  }

  public GetVoucherDetails(accountUniqueName: string, model: ReceiptVoucherDetailsRequest): Observable<BaseResponse<Voucher, ReceiptVoucherDetailsRequest>> {
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + RECEIPT_API.GET_DETAILS
      .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
      .replace(':accountUniqueName', encodeURIComponent(accountUniqueName)),
      model
    ).pipe(
      map((res) => {
        let data: BaseResponse<Voucher, ReceiptVoucherDetailsRequest> = res;
        data.queryString = accountUniqueName;
        data.request = model;
        return data;
      }),
      catchError((e) => this.errorHandler.HandleCatch<Voucher, ReceiptVoucherDetailsRequest>(e, model, {accountUniqueName})));
  }

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
      url = url + 'count=' + model.count;
    }

    if ((model.type)) {
      url = url + '&type=' + model.type;
    }
    return url;
  }
}
