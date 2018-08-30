import { Inject, Injectable, OnInit, Optional } from '@angular/core';
import { GeneralService } from './general.service';
import { DownloadVoucherRequest, InvoiceReceiptFilter, ReciptDeleteRequest, ReciptRequest, ReciptRequestParams, ReciptResponse } from '../models/api-models/recipt';
import { Observable } from 'rxjs';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { HttpWrapperService } from './httpWrapper.service';
import { HttpClient } from '@angular/common/http';
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
      .replace(':accountUniqueName', encodeURIComponent(accountUniqueName)), model)
      .map((res) => {
        let data: BaseResponse<string, ReciptRequest> = res;
        data.request = model;
        data.queryString = {accountUniqueName};
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<string, ReciptRequest>(e, model));
  }

  public GetAllReceipt(body: InvoiceReceiptFilter): Observable<BaseResponse<ReciptResponse, InvoiceReceiptFilter>> {
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + RECEIPT_API.GET
      .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
      .replace(':page', body.page.toString())
      .replace(':count', body.count.toString())
      .replace(':from', body.from.toString())
      .replace(':to', body.to.toString())
      .replace(':type', 'pdf'))
      .map((res) => {
        let data: BaseResponse<ReciptResponse, InvoiceReceiptFilter> = res;
        data.queryString = {page: body.page, count: body.count, from: body.from, to: body.to, type: 'pdf'};
        data.request = body;
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<ReciptResponse, InvoiceReceiptFilter>(e, body, {page: body.page, count: body.count, from: body.from, to: body.to, type: 'pdf'}));
  }

  public DeleteReceipt(accountUniqueName: string, querRequest: ReciptDeleteRequest): Observable<BaseResponse<string, ReciptDeleteRequest>> {
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.delete(this.config.apiUrl + RECEIPT_API.DELETE
      .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
      .replace(':accountUniqueName', encodeURIComponent(accountUniqueName)))
      .map((res) => {
        let data: BaseResponse<any, any> = res;
        data.request = querRequest;
        return data;
      }).catch((e) => this.errorHandler.HandleCatch<any, any>(e, accountUniqueName));
  }

  public DownloadVoucher(model: DownloadVoucherRequest, accountUniqueName: string): Observable<BaseResponse<any, DownloadVoucherRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + RECEIPT_API.DOWNLOAD_VOUCHER
      .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
      .replace(':accountUniqueName', encodeURIComponent(accountUniqueName)), model)
      .map((res) => {
        let data: BaseResponse<any, DownloadVoucherRequest> = res;
        data.request = model;
        data.queryString = {accountUniqueName};
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<any, DownloadVoucherRequest>(e, model, {accountUniqueName}));
  }
}
