import { AccountSharedWithResponse } from '../models/api-models/Account';
import { TaxResponse } from './../models/api-models/Company';
import { Observable } from 'rxjs/Observable';
import { HttpWrapperService } from './httpWrapper.service';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { UserDetails } from '../models/api-models/loginModels';
import { BaseResponse } from '../models/api-models/BaseResponse';
import {
  ComapnyResponse,
  CompanyRequest,
  StateDetailsRequest,
  StateDetailsResponse,
  States,
  GetCouponResp
} from '../models/api-models/Company';
import { COMPANY_API } from './apiurls/comapny.api';
import { ErrorHandler } from './catchManager/catchmanger';
import { BulkEmailRequest } from '../models/api-models/Search';

@Injectable()
export class CompanyService {

  private user: UserDetails;
  private companyUniqueName: string;

  constructor(private errorHandler: ErrorHandler, private _http: HttpWrapperService, private store: Store<AppState>) {
  }

  /**
   * CreateCompany
   */
  public CreateCompany(company: CompanyRequest): Observable<BaseResponse<ComapnyResponse, CompanyRequest>> {
    return this._http.post(COMPANY_API.CREATE_COMPANY, company)
      .map((res) => {
        let data: BaseResponse<ComapnyResponse, CompanyRequest> = res.json();
        data.request = company;
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<ComapnyResponse, CompanyRequest>(e, company));
  }

  /**
   * CompanyList
   */
  public CompanyList(): Observable<BaseResponse<ComapnyResponse[], string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
    });
    return this._http.get(COMPANY_API.COMPANY_LIST.replace(':uniqueName', this.user.uniqueName))
      .map((res) => {
        let data: BaseResponse<ComapnyResponse[], string> = res.json();
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<ComapnyResponse[], string>(e, ''));
  }

  /**
   * DeleteCompany
   */
  public DeleteCompany(uniqueName: string): Observable<BaseResponse<string, string>> {
    return this._http.delete(COMPANY_API.DELETE_COMPANY.replace(':uniqueName', uniqueName))
      .map((res) => {
        let data: BaseResponse<string, string> = res.json();
        data.queryString = { uniqueName };
        return data;
      }).catch((e) => this.errorHandler.HandleCatch<string, string>(e, ''));
  }

  /**
   * get state details
   */
  public getStateDetails(cmpUniqueName?: string): Observable<BaseResponse<StateDetailsResponse, string>> {
    let url = '';
    if (cmpUniqueName) {
      url = COMPANY_API.GET_STATE_DETAILS.replace(':companyUniqueName', encodeURIComponent(cmpUniqueName ? cmpUniqueName : ''));
    } else {
      url = COMPANY_API.GET_STATE_DETAILS.replace('?companyUniqueName=:companyUniqueName', '');
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
      url = COMPANY_API.GET_STATE_DETAILS.replace(':companyUniqueName', encodeURIComponent(cmpUniqueName ? cmpUniqueName : ''));
    } else {
      url = COMPANY_API.GET_STATE_DETAILS.replace('?companyUniqueName=:companyUniqueName', '');
    }
    return this._http.get(url).map((res) => {
      let data: BaseResponse<StateDetailsResponse, string> = res.json();
      return data;
    });
  }

  // Effects need to be review
  public setStateDetails(stateDetails: StateDetailsRequest): Observable<BaseResponse<string, StateDetailsRequest>> {
    return this._http.post(COMPANY_API.SET_STATE_DETAILS, stateDetails).map((res) => {
      let data: BaseResponse<string, StateDetailsRequest> = res.json();
      data.request = stateDetails;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<string, StateDetailsRequest>(e, stateDetails));
  }

  public getComapnyTaxes(): Observable<BaseResponse<TaxResponse[], string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(COMPANY_API.TAX.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).map((res) => {
      let data: BaseResponse<TaxResponse[], string> = res.json();
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<TaxResponse[], string>(e));
  }

  public getComapnyUsers(): Observable<BaseResponse<AccountSharedWithResponse[], string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(COMPANY_API.GET_COMPANY_USERS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).map((res) => {
      let data: BaseResponse<AccountSharedWithResponse[], string> = res.json();
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<AccountSharedWithResponse[], string>(e));
  }

  public sendEmail(request: BulkEmailRequest): Observable<BaseResponse<string, BulkEmailRequest>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.post(COMPANY_API.SEND_EMAIL
      .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
      .replace(':from', encodeURIComponent(request.params.from))
      .replace(':to', encodeURIComponent(request.params.to))
      , request.data).map((res) => {
        return res.json();
      }).catch((e) => this.errorHandler.HandleCatch<string, BulkEmailRequest>(e));
  }

  public sendSms(request: BulkEmailRequest): Observable<BaseResponse<string, BulkEmailRequest>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.post(COMPANY_API.SEND_SMS
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
    return this._http.get(COMPANY_API.GET_ALL_STATES).map((res) => {
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
    return this._http.get(COMPANY_API.GET_COUPON
      .replace(':couponCode', encodeURIComponent(couponCode))).map((res) => {
      let data: BaseResponse<GetCouponResp, string> = res.json();
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<GetCouponResp, string>(e));
  }
}
