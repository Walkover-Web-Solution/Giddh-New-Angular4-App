import { Inject, Injectable, Optional } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Configuration, URLS } from '../app.constants';
import { Router } from '@angular/router';
import { HttpWrapperService } from './httpWrapper.service';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { ErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { PayNowRequest } from '../contact/contact.component';
import { CONTACT_API } from './apiurls/contact.api';

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

  public GetContacts(groupUniqueName: string, pageNumber: number, refresh: string, count: number = 20): Observable<BaseResponse<any, string>> {
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + 'v2/company/:companyUniqueName/groups/:groupUniqueName/account-balances?page=:page&count=:count&refresh=:refresh'.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':groupUniqueName', encodeURIComponent(groupUniqueName))
    .replace(':count', count.toString()).replace(':page', pageNumber.toString()).replace(':refresh', refresh)).map((res) => {
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

  public addComment(comment, accountUniqueName): Observable<BaseResponse<any, string>> {
    this.companyUniqueName = this._generalService.companyUniqueName;
    let description = comment;
    return this._http.post(this.config.apiUrl + CONTACT_API.ADD_COMMENT.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', accountUniqueName), { description }).map((res) => {
      let data: BaseResponse<any, string> = res;
      data.request = '';
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<any, string>(e, '', ''));
  }

  public deleteComment(accountUniqueName): Observable<BaseResponse<any, string>> {
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.delete(this.config.apiUrl + CONTACT_API.ADD_COMMENT.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', accountUniqueName)).map((res) => {
      let data: BaseResponse<any, string> = res;
      data.request = '';
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<any, string>(e, '', ''));
  }
}
