import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpWrapperService } from './httpWrapper.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { Observable } from 'rxjs/Observable';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { UserDetails } from '../models/api-models/loginModels';
import { HandleCatch } from './catchManager/catchmanger';
import { ELEDGER_API } from './apiurls/eledger.api';
import { EledgerResponse } from '../models/api-models/Eledger';

@Injectable()
export class EledgerService {
  private companyUniqueName: string;
  private user: UserDetails;

  constructor(public _http: HttpWrapperService, public _router: Router, private store: Store<AppState>) {}

  /*
  * Eledger get transactions
  * Response will be an array of objects in body
  */
  public GetEledgerTransactions(accountUniqueName: string, refresh: boolean = false): Observable<BaseResponse<EledgerResponse[], string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(ELEDGER_API.GET.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', accountUniqueName).replace(':refresh', refresh.toString())).map((res) => {
      let data: BaseResponse<EledgerResponse[], string> = res.json();
      data.queryString = { accountUniqueName, refresh };
      return data;
    }).catch((e) => HandleCatch<EledgerResponse[], string>(e, '', { accountUniqueName, refresh }));
  }

}
