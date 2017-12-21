import { Observable } from 'rxjs/Observable';
import { HttpWrapperService } from './httpWrapper.service';
import { Injectable, Optional, Inject } from '@angular/core';
import { UserDetails } from '../models/api-models/loginModels';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { ErrorHandler } from './catchManager/catchmanger';
import { COMPANY_API } from './apiurls/comapny.api';
import { GeneralService } from './general.service';
import { ServiceConfig, IServiceConfigArgs } from './service.config';

@Injectable()
export class SettingsTaxesService {

  private user: UserDetails;
  private companyUniqueName: string;

  constructor(private errorHandler: ErrorHandler, private _http: HttpWrapperService,
              private _generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
  }

  /**
   * Create Tax
   */
  public CreateTax(model): Observable<BaseResponse<any, any>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + COMPANY_API.TAX.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).map((res) => {
      let data: BaseResponse<any, any> = res.json();
      data.request = model;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<any, any>(e, model));
  }

  /**
   * Update Tax
   */
  public UpdateTax(model, taxUniqueName: string): Observable<BaseResponse<any, any>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.put(this.config.apiUrl + COMPANY_API.TAX.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)) + '/' + taxUniqueName, model).map((res) => {
      let data: BaseResponse<any, any> = res.json();
      data.request = model;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<any, any>(e, model));
  }

  /**
   * Delete Tax
   */
  public DeleteTax(taxUniqueName: string): Observable<BaseResponse<any, any>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.delete(this.config.apiUrl + COMPANY_API.TAX.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)) + '/' + taxUniqueName).map((res) => {
      let data: BaseResponse<any, any> = res.json();
      data.request = taxUniqueName;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<any, any>(e, taxUniqueName));
  }
}
