import { Observable } from 'rxjs/Observable';
import { HttpWrapperService } from './httpWrapper.service';
import { Injectable, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { UserDetails } from '../models/api-models/loginModels';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { ComapnyResponse, CompanyRequest, StateDetailsResponse, StateDetailsRequest } from '../models/api-models/Company';
import { COMPANY_API } from './apiurls/comapny.api';
import { HandleCatch } from './catchManager/catchmanger';

@Injectable()
export class CompanyService  {

  private user: UserDetails;
  constructor(private _http: HttpWrapperService, private store: Store<AppState>) {
  }

  /**
   * CreateCompany
   */
  public CreateCompany(company: CompanyRequest): Observable<BaseResponse<ComapnyResponse>> {

    return this._http.post(COMPANY_API.CREATE_COMPANY, { company })
      .map((res) => {
        let data: BaseResponse<ComapnyResponse> = res.json();
        return data;
      })
      .catch((e) => HandleCatch<ComapnyResponse>(e));
    }

  /**
   * CompanyList
   */
  public CompanyList(): Observable<BaseResponse<ComapnyResponse[]>> {
     this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
    });
    return this._http.get(COMPANY_API.COMPANY_LIST.replace(':uniqueName', this.user.uniqueName))
      .map((res) => {
        let data: BaseResponse<ComapnyResponse[]> = res.json();
        return data;
      })
      .catch((e) => HandleCatch<ComapnyResponse[]>(e));
  }

  /**
   * DeleteCompany
   */
  public DeleteCompany(uniqueName: string): Observable<BaseResponse<string>> {
    return this._http.delete(COMPANY_API.DELETE_COMPANY.replace(':uniqueName', uniqueName))
      .map((res) => {
        let data: BaseResponse<string> = res.json();
        return data;
      }).catch((e) => HandleCatch<string>(e));
  }

  /**
   * get state details
   */
  public getStateDetails(): Observable<BaseResponse<StateDetailsResponse>> {
    return this._http.get(COMPANY_API.GET_STATE_DETAILS).map((res) => {
      let data: BaseResponse<StateDetailsResponse> = res.json();
      return data;
    }).catch((e) => HandleCatch<StateDetailsResponse>(e));
  }

  public setStateDetails(stateDetails: StateDetailsRequest): Observable<BaseResponse<StateDetailsResponse>> {
    return this._http.post(COMPANY_API.SET_STATE_DETAILS, stateDetails).map((res) => {
      let d: BaseResponse<string> = res.json();
      if (d.status === 'success') {
        let data: BaseResponse<StateDetailsResponse> = {
          body: stateDetails,
          code: 'success',
          message: 'success',
          status: 'success'
        };
        return data;
      }
    }).catch((e) => HandleCatch<StateDetailsRequest>(e));
  }
}
