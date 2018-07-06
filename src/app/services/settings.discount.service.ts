import { Observable } from 'rxjs/Observable';
import { HttpWrapperService } from './httpWrapper.service';
import { Inject, Injectable, Optional } from '@angular/core';
import { UserDetails } from '../models/api-models/loginModels';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { ErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { CreateDiscountRequest, IDiscountList } from '../models/api-models/SettingsDiscount';
import { AccountResponse } from '../models/api-models/Account';
import { SETTINGS_DISCOUNT_API } from './apiurls/settings.discount';

@Injectable()
export class SettingsDiscountService {

  private user: UserDetails;
  private companyUniqueName: string;

  constructor(private errorHandler: ErrorHandler, private _http: HttpWrapperService,
              private _generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
  }

  /**
   * Get Discount
   */
  public GetDiscounts(): Observable<BaseResponse<IDiscountList, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + SETTINGS_DISCOUNT_API.COMMON.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).map((res) => {
      let data: BaseResponse<IDiscountList, string> = res;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<IDiscountList, string>(e, ''));
  }

  /**
   * Create Discount
   */
  public CreateDiscount(model): Observable<BaseResponse<AccountResponse, CreateDiscountRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + SETTINGS_DISCOUNT_API.COMMON.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).map((res) => {
      let data: BaseResponse<AccountResponse, CreateDiscountRequest> = res;
      data.request = model;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<AccountResponse, CreateDiscountRequest>(e, model));
  }

  /**
   * Update Discount
   */
  public UpdateDiscount(model, uniqueName: string): Observable<BaseResponse<any, any>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.put(this.config.apiUrl + SETTINGS_DISCOUNT_API.COMMON.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)) + '/' + uniqueName, model).map((res) => {
      let data: BaseResponse<any, any> = res;
      data.request = model;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<any, any>(e, model));
  }

  /**
   * Delete Discount
   */
  public DeleteDiscount(uniqueName: string): Observable<BaseResponse<string, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.delete(this.config.apiUrl + SETTINGS_DISCOUNT_API.COMMON.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)) + '/' + uniqueName).map((res) => {
      let data: BaseResponse<any, any> = res;
      data.request = uniqueName;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<any, any>(e, uniqueName));
  }
}
