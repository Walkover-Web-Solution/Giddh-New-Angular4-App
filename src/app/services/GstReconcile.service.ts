import { Inject, Injectable, Optional } from '@angular/core';
import { HttpWrapperService } from './httpWrapper.service';
import { Observable } from 'rxjs';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { UserDetails } from '../models/api-models/loginModels';
import { ErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { GST_RECONCILE_API } from './apiurls/GstReconcile.api';
import { GstReconcileInvoiceResponse, VerifyOtpRequest } from '../models/api-models/GstReconcile';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class GstReconcileService {
  private companyUniqueName: string;
  private user: UserDetails;

  constructor(private errorHandler: ErrorHandler, public _http: HttpWrapperService,
              private _generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
  }

  public GstReconcileGenerateOtp(userName: string): Observable<BaseResponse<string, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;

    return this._http.get(this.config.apiUrl + GST_RECONCILE_API.GENERATE_OTP
      .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
      .replace(':userName', encodeURIComponent(userName))
    )
      .pipe(
        map((res) => {
          let data: BaseResponse<string, string> = res;
          data.queryString = userName;
          return data;
        })
        , catchError((e) => this.errorHandler.HandleCatch<string, string>(e, '')));
  }

  public GstReconcileVerifyOtp(model: VerifyOtpRequest): Observable<BaseResponse<string, VerifyOtpRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;

    return this._http.post(this.config.apiUrl + GST_RECONCILE_API.VERIFY_OTP
      .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)),
      model)
      .pipe(
        map((res) => {
          let data: BaseResponse<string, VerifyOtpRequest> = res;
          data.request = model;
          return data;
        })
        , catchError((e) => this.errorHandler.HandleCatch<string, VerifyOtpRequest>(e, '')));
  }

  public GstReconcileGetInvoices(period: string, action: string, page: string, count: string, refresh: boolean): Observable<BaseResponse<GstReconcileInvoiceResponse, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;

    return this._http.get(this.config.apiUrl + GST_RECONCILE_API.GET_INVOICES
      .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
      .replace(':period', encodeURIComponent(period))
      .replace(':action', encodeURIComponent(action))
      .replace(':page', encodeURIComponent(page))
      .replace(':count', encodeURIComponent(count))
      .replace(':refresh', refresh ? 'true' : 'false')
    )
      .pipe(
        map((res) => {
          let data: BaseResponse<GstReconcileInvoiceResponse, string> = res;
          data.queryString = {period, action, page, count};
          return data;
        })
        , catchError((e) => this.errorHandler.HandleCatch<GstReconcileInvoiceResponse, string>(e, '')));
  }
}
