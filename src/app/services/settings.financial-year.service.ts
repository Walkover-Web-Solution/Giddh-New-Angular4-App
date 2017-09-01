import { Observable } from 'rxjs/Observable';
import { HttpWrapperService } from './httpWrapper.service';
import { Injectable, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { UserDetails } from '../models/api-models/loginModels';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { HandleCatch } from './catchManager/catchmanger';
import { SmsKeyClass, EmailKeyClass } from '../models/api-models/SettingsIntegraion';
import { SETTINGS_FINANCIAL_YEAR_API } from './apiurls/settings.financial-year.api';
import { ActiveFinancialYear } from '../models/api-models/Company';

export interface ILockFinancialYearRequest {
  lockAll: boolean;
  uniqueName: string;
}

export interface IFinancialYearResponse {
  companyName: string;
  companyUniqueName: string;
  financialYears: ActiveFinancialYear[];
}

@Injectable()
export class SettingsFinancialYearService {

  private user: UserDetails;
  private companyUniqueName: string;
  private roleUniqueName: string;

  constructor(private _http: HttpWrapperService, private store: Store<AppState>) {}

  /*
  * Get All Financial Years
  * API: 'company/:companyUniqueName/financial-year'
  * Method: GET
  */
  public GetAllFinancialYears(): Observable<BaseResponse<IFinancialYearResponse, string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(SETTINGS_FINANCIAL_YEAR_API.GET_ALL_FINANCIAL_YEARS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).map((res) => {
      let data: BaseResponse<IFinancialYearResponse, string> = res.json();
      data.queryString = {};
      return data;
    }).catch((e) => HandleCatch<IFinancialYearResponse, string>(e));
  }

  /*
  * Lock Financial Year
  * API: 'company/:companyUniqueName/financial-year-lock'
  * Method: PATCH
  */
  public LockFinancialYear(reqObj: ILockFinancialYearRequest): Observable<BaseResponse<IFinancialYearResponse, ILockFinancialYearRequest>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.patch(SETTINGS_FINANCIAL_YEAR_API.LOCK_FINANCIAL_YEAR.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), reqObj).map((res) => {
      let data: BaseResponse<IFinancialYearResponse, ILockFinancialYearRequest> = res.json();
      data.queryString = {};
      return data;
    }).catch((e) => HandleCatch<IFinancialYearResponse, ILockFinancialYearRequest>(e));
  }

  /*
  * Unlock Financial Year
  * API: 'company/:companyUniqueName/financial-year-unlock'
  * Method: PATCH
  */
  public UnlockFinancialYear(reqObj: ILockFinancialYearRequest): Observable<BaseResponse<IFinancialYearResponse, ILockFinancialYearRequest>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.patch(SETTINGS_FINANCIAL_YEAR_API.UNLOCK_FINANCIAL_YEAR.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), reqObj).map((res) => {
      let data: BaseResponse<IFinancialYearResponse, ILockFinancialYearRequest> = res.json();
      data.queryString = {};
      return data;
    }).catch((e) => HandleCatch<IFinancialYearResponse, ILockFinancialYearRequest>(e));
  }

  /*
  * Switch Financial Year
  * API: 'company/:companyUniqueName/financial-year-unlock'
  * Method: PATCH
  */
  public SwitchFinancialYear(uniqueName: string): Observable<BaseResponse<ActiveFinancialYear, string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.patch(SETTINGS_FINANCIAL_YEAR_API.SWITCH_FINANCIAL_YEAR.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), {uniqueName}).map((res) => {
      let data: BaseResponse<ActiveFinancialYear, string> = res.json();
      data.queryString = {};
      return data;
    }).catch((e) => HandleCatch<ActiveFinancialYear, string>(e));
  }

  /*
  * Add Financial Year
  * API: 'company/:companyUniqueName/financial-year'
  * Method: PATCH
  */
  public AddFinancialYear(fromYear: string): Observable<BaseResponse<IFinancialYearResponse, string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.post(SETTINGS_FINANCIAL_YEAR_API.ADD_FINANCIAL_YEAR.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), {fromYear}).map((res) => {
      let data: BaseResponse<IFinancialYearResponse, string> = res.json();
      data.queryString = {};
      return data;
    }).catch((e) => HandleCatch<IFinancialYearResponse, string>(e));
  }
}
