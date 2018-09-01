import { Inject, Injectable, Optional } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpWrapperService } from './httpWrapper.service';
import { Observable } from 'rxjs/Observable';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { UserDetails } from '../models/api-models/loginModels';
import { ErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { GST_RECONCILE_API } from './apiurls/GstReconcile.api';
import { VerifyOtpRequest } from '../models/api-models/GstReconcile';

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
      .map((res) => {
        let data: BaseResponse<string, string> = res;
        data.queryString = userName;
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<string, string>(e, ''));
  }

  public GstReconcileVerifyOtp(model: VerifyOtpRequest): Observable<BaseResponse<string, VerifyOtpRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;

    return this._http.post(this.config.apiUrl + GST_RECONCILE_API.VERIFY_OTP
      .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)),
      model)
      .map((res) => {
        let data: BaseResponse<string, VerifyOtpRequest> = res;
        data.request = model;
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<string, VerifyOtpRequest>(e, ''));
  }

  public GstReconcileGetInvoices(period: string): Observable<BaseResponse<string, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;

    return this._http.get(this.config.apiUrl + GST_RECONCILE_API.GET_INVOICES
      .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
      .replace(':period', encodeURIComponent(period))
    )
      .map((res) => {
        let data: BaseResponse<string, string> = res;
        data.queryString = period;
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<string, string>(e, ''));
  }
}
