import { AccountSharedWithResponse } from '../models/api-models/Account';
import { CompanyRequest, CompanyResponse, GetCouponResp, StateDetailsRequest, StateDetailsResponse, States, TaxResponse } from '../models/api-models/Company';
import { Observable } from 'rxjs/Observable';
import { HttpWrapperService } from './httpWrapper.service';
import { Injectable, Optional, Inject } from '@angular/core';
import { UserDetails } from '../models/api-models/loginModels';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { COMPANY_API } from './apiurls/comapny.api';
import { ErrorHandler } from './catchManager/catchmanger';
import { BulkEmailRequest } from '../models/api-models/Search';
import { GeneralService } from './general.service';
import { ServiceConfig, IServiceConfigArgs } from './service.config';

@Injectable()
export class CompanyService {

  private user: UserDetails;
  private companyUniqueName: string;

  constructor(private errorHandler: ErrorHandler, private _http: HttpWrapperService, private _generalService: GeneralService,
    @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
  }

  /**
   * CreateCompany
   */
  public CreateCompany(company: CompanyRequest): Observable<BaseResponse<CompanyResponse, CompanyRequest>> {
    return this._http.post(this.config.apiUrl + COMPANY_API.CREATE_COMPANY, company)
      .map((res) => {
        let data: BaseResponse<CompanyResponse, CompanyRequest> = res.json();
        data.request = company;
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<CompanyResponse, CompanyRequest>(e, company));
  }

  /**
   * CompanyList
   */
  public CompanyList(): Observable<BaseResponse<CompanyResponse[], string>> {
    this.user = this._generalService.user;
    return this._http.get(this.config.apiUrl + COMPANY_API.COMPANY_LIST.replace(':uniqueName', this.user.uniqueName))
      .map((res) => {
        let data: BaseResponse<CompanyResponse[], string> = res.json();
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<CompanyResponse[], string>(e, ''));
  }

  /**
   * DeleteCompany
   */
  public DeleteCompany(uniqueName: string): Observable<BaseResponse<string, string>> {
    return this._http.delete(this.config.apiUrl + COMPANY_API.DELETE_COMPANY.replace(':uniqueName', uniqueName))
      .map((res) => {
        let data: BaseResponse<string, string> = res.json();
        data.queryString = {uniqueName};
        return data;
      }).catch((e) => this.errorHandler.HandleCatch<string, string>(e, ''));
  }

  /**
   * get state details
   */
  public getStateDetails(cmpUniqueName?: string): Observable<BaseResponse<StateDetailsResponse, string>> {
    let url = '';
    if (cmpUniqueName) {
      url = this.config.apiUrl + COMPANY_API.GET_STATE_DETAILS.replace(':companyUniqueName', encodeURIComponent(cmpUniqueName ? cmpUniqueName : ''));
    } else {
      url = this.config.apiUrl + COMPANY_API.GET_STATE_DETAILS.replace('?companyUniqueName=:companyUniqueName', '');
    }
    return this._http.get(url).map((res) => {
      let data: BaseResponse<StateDetailsResponse, string> = res.json();
      data.queryString = cmpUniqueName;
      data.request = cmpUniqueName;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<StateDetailsResponse, string>(e, cmpUniqueName, cmpUniqueName));
  }

  public getStateDetailsAuthGuard(cmpUniqueName?: string): Observable<BaseResponse<StateDetailsResponse, string>> {
    let url = '';
    if (cmpUniqueName) {
      url = this.config.apiUrl + COMPANY_API.GET_STATE_DETAILS.replace(':companyUniqueName', encodeURIComponent(cmpUniqueName ? cmpUniqueName : ''));
    } else {
      url = this.config.apiUrl + COMPANY_API.GET_STATE_DETAILS.replace('?companyUniqueName=:companyUniqueName', '');
    }
    return this._http.get(url).map((res) => {
      let data: BaseResponse<StateDetailsResponse, string> = res.json();
      return data;
    });
  }

  // Effects need to be review
  public setStateDetails(stateDetails: StateDetailsRequest): Observable<BaseResponse<string, StateDetailsRequest>> {
    return this._http.post(this.config.apiUrl + COMPANY_API.SET_STATE_DETAILS, stateDetails).map((res) => {
      let data: BaseResponse<string, StateDetailsRequest> = res.json();
      data.request = stateDetails;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<string, StateDetailsRequest>(e, stateDetails));
  }

  public getComapnyTaxes(): Observable<BaseResponse<TaxResponse[], string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + COMPANY_API.TAX.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).map((res) => {
      let data: BaseResponse<TaxResponse[], string> = res.json();
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<TaxResponse[], string>(e));
  }

  public getComapnyUsers(): Observable<BaseResponse<AccountSharedWithResponse[], string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + COMPANY_API.GET_COMPANY_USERS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).map((res) => {
      let data: BaseResponse<AccountSharedWithResponse[], string> = res.json();
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<AccountSharedWithResponse[], string>(e));
  }

  public sendEmail(request: BulkEmailRequest): Observable<BaseResponse<string, BulkEmailRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + COMPANY_API.SEND_EMAIL
        .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
        .replace(':from', encodeURIComponent(request.params.from))
        .replace(':to', encodeURIComponent(request.params.to))
      , request.data).map((res) => {
      return res.json();
    }).catch((e) => this.errorHandler.HandleCatch<string, BulkEmailRequest>(e));
  }

  public sendSms(request: BulkEmailRequest): Observable<BaseResponse<string, BulkEmailRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + COMPANY_API.SEND_SMS
        .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
        .replace(':from', encodeURIComponent(request.params.from))
        .replace(':to', encodeURIComponent(request.params.to))
      , request.data).map((res) => {
      return res.json();
    }).catch((e) => this.errorHandler.HandleCatch<string, BulkEmailRequest>(e));
  }

  /**
   * get all states
   */
  public getAllStates(): Observable<BaseResponse<States[], string>> {
    return this._http.get(this.config.apiUrl + COMPANY_API.GET_ALL_STATES).map((res) => {
      let data: BaseResponse<States[], string> = res.json();
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<States[], string>(e));
  }

  /**
   * get coupon details
   * @param {string} couponCode
   * @returns {Observable<BaseResponse<GetCouponResp, string>>}
   * @memberof CompanyService
   */
  public getCoupon(couponCode: string): Observable<BaseResponse<GetCouponResp, string>> {
    return this._http.get(this.config.apiUrl + COMPANY_API.GET_COUPON
      .replace(':code', encodeURIComponent(couponCode))).map((res) => {
      let data: BaseResponse<GetCouponResp, string> = res.json();
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<GetCouponResp, string>(e));
  }
}
