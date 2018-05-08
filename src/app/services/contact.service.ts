import { Injectable, Optional, Inject } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Configuration, URLS } from '../app.constants';
import { Router } from '@angular/router';
import { HttpWrapperService } from './httpWrapper.service';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { ErrorHandler } from './catchManager/catchmanger';
import { DASHBOARD_API } from './apiurls/dashboard.api';
import { BankAccountsResponse } from '../models/api-models/Dashboard';
import { GeneralService } from './general.service';
import { ServiceConfig, IServiceConfigArgs } from './service.config';
import { PayNowRequest } from '../contact/contact.component';

@Injectable()
export class ContactService {
  private companyUniqueName: string;

  constructor(private errorHandler: ErrorHandler, public _http: HttpWrapperService, public _router: Router,
              private _generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
  }

  public payNow(body: PayNowRequest): Observable<BaseResponse<any, any>> {
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + 'company/:companyUniqueName/cashfree/transfer'.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), body).map((res) => {
      let data: BaseResponse<any, any> = res;
      data.request = body;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<any, any>(e, body, ''));
  }

  public GetContacts(groupUniqueName: string, pageNumber: number): Observable<BaseResponse<any, string>> {
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + 'v2/company/:companyUniqueName/groups/:groupUniqueName/account-balances?page=:page&count=15'.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':groupUniqueName', encodeURIComponent(groupUniqueName)).replace(':page', pageNumber.toString())).map((res) => {
      // return this._http.get(this.config.apiUrl + 'v2/company/:companyUniqueName/groups/customer-vendor-report'.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).map((res) => {
      let data: BaseResponse<any, string> = res;
      data.request = '';
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<any, string>(e, '', ''));
  }

  public GetCashFreeBalance(): Observable<BaseResponse<any, string>> {
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + 'company/:companyUniqueName/cashfree/balance'.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).map((res) => {
      let data: BaseResponse<any, string> = res;
      data.request = '';
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<any, string>(e, '', ''));
  }
}
