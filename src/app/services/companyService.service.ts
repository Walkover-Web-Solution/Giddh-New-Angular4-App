import { Observable } from 'rxjs/Observable';
import { HttpWrapperService } from './httpWrapper.service';
import { Injectable, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { CompanyRequest, ComapnyResponse, StateDetailsResponse } from '../models';
import { COMPANY_API } from './apiurls';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { UserDetails } from '../models/api-models/loginModels';
import { BaseResponse } from '../models/api-models/BaseResponse';

@Injectable()
export class CompanyService implements OnInit {

  private user: UserDetails;
  constructor(private _http: HttpWrapperService, private store: Store<AppState>) {
  }

  public ngOnInit() {
//
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
      .catch((e) => {
        let data: BaseResponse<ComapnyResponse> = {
        body: null,
        code: 'Internal Error',
        message: 'something went wrong',
        status: 'error'
      };
      return new Observable<BaseResponse<ComapnyResponse>>((o) => { o.next(data); });
      });
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
      .catch((e) => {
        let data: BaseResponse<ComapnyResponse[]> = {
        body: null,
        code: 'Internal Error',
        message: 'something went wrong',
        status: 'error'
      };
      return new Observable<BaseResponse<ComapnyResponse[]>>((o) => { o.next(data); });
      });
  }

  /**
   * DeleteCompany
   */
  public DeleteCompany(uniqueName: string): Observable<Response> {
    return this._http.delete(COMPANY_API.CREATE_COMPANY, { uniqueName })
      .map((res) => {
        return res;
      })
      .catch((e) => {
        return Observable.throw(e);
      });
  }

  /**
   * get state details
   */
  public getStateDetails(): Observable<BaseResponse<StateDetailsResponse>> {
    return this._http.get(COMPANY_API.GET_STATE_DETAILS).map((res) => {
      let data: BaseResponse<StateDetailsResponse> = res.json();
      return data;
    }).catch((e) => {
      let data: BaseResponse<StateDetailsResponse> = {
        body: null,
        code: 'Internal Error',
        message: 'Internal Error',
        status: 'error'
      };
      return new Observable<BaseResponse<StateDetailsResponse>>((o) => { o.next(data); });
    });
  }
}
