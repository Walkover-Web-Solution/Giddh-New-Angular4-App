import { Observable } from 'rxjs/Observable';
import { HttpWrapperService } from './httpWrapper.service';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Company } from '../models';
import { COMPANY_API } from './apiurls';

@Injectable()
export class CompanyService {

  constructor(private _http: HttpWrapperService) { }

  /**
   * CreateCompany
   */
  public CreateCompany(company: Company): Observable<Response> {
    return this._http.post(COMPANY_API.CREATE_COMPANY, { company })
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
