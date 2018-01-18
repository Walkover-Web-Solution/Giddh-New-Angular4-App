import { Observable } from 'rxjs/Observable';
import { HttpWrapperService } from './httpWrapper.service';
import { Injectable, Optional, Inject } from '@angular/core';
import { UserDetails } from '../models/api-models/loginModels';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { ErrorHandler } from './catchManager/catchmanger';
import { EmailKeyClass, RazorPayClass, RazorPayDetailsResponse, SmsKeyClass } from '../models/api-models/SettingsIntegraion';
import { SETTINGS_INTEGRATION_API } from './apiurls/settings.integration.api';
import { GeneralService } from './general.service';
import { ServiceConfig, IServiceConfigArgs } from './service.config';

@Injectable()
export class SettingsIntegrationService {

  private user: UserDetails;
  private companyUniqueName: string;

  constructor(private errorHandler: ErrorHandler, private _http: HttpWrapperService,
              private _generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
  }

  /*
  * Get SMS key
  */
  public GetSMSKey(): Observable<BaseResponse<SmsKeyClass, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + SETTINGS_INTEGRATION_API.SMS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).map((res) => {
      let data: BaseResponse<SmsKeyClass, string> = res;
      data.queryString = {};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<SmsKeyClass, string>(e));
  }

  /**
   * Save SMS Key
   */
  public SaveSMSKey(model: SmsKeyClass): Observable<BaseResponse<string, SmsKeyClass>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + SETTINGS_INTEGRATION_API.SMS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).map((res) => {
      let data: BaseResponse<string, SmsKeyClass> = res;
      data.request = model;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<string, SmsKeyClass>(e, model));
  }

  /*
  * Get Email key
  */
  public GetEmailKey(): Observable<BaseResponse<EmailKeyClass, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + SETTINGS_INTEGRATION_API.EMAIL.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).map((res) => {
      let data: BaseResponse<EmailKeyClass, string> = res;
      data.queryString = {};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<EmailKeyClass, string>(e));
  }

  /**
   * Save Email Key
   */
  public SaveEmailKey(model: EmailKeyClass): Observable<BaseResponse<string, EmailKeyClass>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + SETTINGS_INTEGRATION_API.EMAIL.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).map((res) => {
      let data: BaseResponse<string, EmailKeyClass> = res;
      data.request = model;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<string, EmailKeyClass>(e, model));
  }

  /*
  * Get Razor pay details
  */
  public GetRazorPayDetails(): Observable<BaseResponse<RazorPayDetailsResponse, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + SETTINGS_INTEGRATION_API.RAZORPAY.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).map((res) => {
      let data: BaseResponse<RazorPayDetailsResponse, string> = res;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<RazorPayDetailsResponse, string>(e));
  }

  /*
  * Save Razor pay details
  */
  public SaveRazorPayDetails(model: RazorPayClass): Observable<BaseResponse<RazorPayDetailsResponse, RazorPayClass>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + SETTINGS_INTEGRATION_API.RAZORPAY.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).map((res) => {
      let data: BaseResponse<RazorPayDetailsResponse, RazorPayClass> = res;
      data.request = model;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<RazorPayDetailsResponse, RazorPayClass>(e, model));
  }

  /*
  * Update Razor pay details
  */
  public UpdateRazorPayDetails(model: RazorPayClass): Observable<BaseResponse<RazorPayDetailsResponse, RazorPayClass>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.put(this.config.apiUrl + SETTINGS_INTEGRATION_API.RAZORPAY.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).map((res) => {
      let data: BaseResponse<RazorPayDetailsResponse, RazorPayClass> = res;
      data.request = model;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<RazorPayDetailsResponse, RazorPayClass>(e, model));
  }

  /*
  * Delete Razor pay details
  */
  public DeleteRazorPayDetails(): Observable<BaseResponse<string, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.delete(this.config.apiUrl + SETTINGS_INTEGRATION_API.RAZORPAY.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).map((res) => {
      let data: BaseResponse<string, string> = res;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<string, string>(e));
  }

}
