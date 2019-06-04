import { Inject, Optional } from '@angular/core';
import { UserDetails } from '../models/api-models/loginModels';
import { GeneralService } from './general.service';
import { HttpWrapperService } from './httpWrapper.service';
import { HttpClient } from '@angular/common/http';
import { ErrorHandler } from './catchManager/catchmanger';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { InvoiceReceiptFilter } from '../models/api-models/recipt';
import { Observable } from 'rxjs';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { catchError, map } from 'rxjs/operators';
import { ProformaFilter, ProformaGetRequest, ProformaResponse } from '../models/api-models/proforma';
import { PROFORMA_API } from './apiurls/proforma.api';
import { GenericRequestForGenerateSCD } from '../models/api-models/Sales';

export class ProformaService {
  private companyUniqueName: string;
  private user: UserDetails;

  constructor(private _generalService: GeneralService, private _http: HttpWrapperService,
              private _httpClient: HttpClient, private errorHandler: ErrorHandler,
              @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    this.companyUniqueName = this._generalService.companyUniqueName;
  }

  public getAll(body: InvoiceReceiptFilter, voucherType: string): Observable<BaseResponse<ProformaResponse, ProformaFilter>> {
    this.companyUniqueName = this._generalService.companyUniqueName;
    let url = this._generalService.createQueryString(this.config.apiUrl + PROFORMA_API.getAll, {
      page: body.page, count: body.count, from: body.from, to: body.to, q: body.q, sort: body.sort, sortBy: body.sortBy
    });

    return this._http.post(url
      .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
      .replace(':vouchers', voucherType)
      .replace(':accountUniqueName', encodeURIComponent(body.accountUniqueName)), body)
      .pipe(
        map((res) => {
          let data: BaseResponse<ProformaResponse, ProformaFilter> = res;
          data.queryString = {page: body.page, count: body.count, from: body.from, to: body.to, type: 'pdf'};
          data.request = body;
          return data;
        }),
        catchError((e) => this.errorHandler.HandleCatch<ProformaResponse, ProformaFilter>(e, body, {page: body.page, count: body.count, from: body.from, to: body.to, type: 'pdf'})));
  }

  public get(request: ProformaGetRequest, voucherType: string): Observable<BaseResponse<GenericRequestForGenerateSCD, ProformaGetRequest>> {
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + PROFORMA_API.base
      .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
      .replace(':vouchers', voucherType)
      .replace(':accountUniqueName', encodeURIComponent(request.accountUniqueName)),
      request
    ).pipe(
      map((res) => {
        let data: BaseResponse<GenericRequestForGenerateSCD, ProformaGetRequest> = res;
        data.queryString = request.accountUniqueName;
        data.request = request;
        return data;
      }),
      catchError((e) => this.errorHandler.HandleCatch<GenericRequestForGenerateSCD, ProformaGetRequest>(e, request)));
  }
}
