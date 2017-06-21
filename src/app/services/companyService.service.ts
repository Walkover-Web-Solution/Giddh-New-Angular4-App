import { Observable } from 'rxjs/Observable';
import { HttpWrapperService } from './httpWrapper.service';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { CompanyRequest } from '../models';
import { COMPANY_API } from './apiurls';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { UserDetails } from '../models/api-models/loginModels';

@Injectable()
export class CompanyService {

  private user: UserDetails;
  constructor(private _http: HttpWrapperService, private store: Store<AppState>) {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
    });
  }

  /**
   * CreateCompany
   */
  public CreateCompany(company: CompanyRequest): Observable<Response> {
    return this._http.post(COMPANY_API.CREATE_COMPANY, { company })
      .map((res) => {
        return res;
      })
      .catch((e) => {
        return Observable.throw(e);
      });
    }

  /**
   * CompanyList
   */
  public CompanyList(): Observable<Response> {
    return this._http.get(COMPANY_API.COMPANY_LIST.replace(':uniqueName', this.user.uniqueName))
      .map((res) => {
        return res;
      })
      .catch((e) => {
        return Observable.throw(e);
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

}
