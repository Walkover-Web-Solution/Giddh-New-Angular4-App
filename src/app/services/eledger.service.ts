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
import { EledgerResponse, EledgerMapRequest } from '../models/api-models/Eledger';

@Injectable()
export class EledgerService {
  private companyUniqueName: string;
  private user: UserDetails;

  constructor(public _http: HttpWrapperService, public _router: Router, private store: Store<AppState>) {}

  /*
  * Eledger get transactions
  * Response will be an array of EledgerResponse in body
  * refresh is optional
  * conditional making url
  */
  public GetEledgerTransactions(accountUniqueName: string, refresh: boolean = false): Observable<BaseResponse<EledgerResponse[], string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    let URL = ELEDGER_API.GET.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', accountUniqueName);
    if (refresh) {
      URL = URL + '?refresh=true';
    }
    return this._http.get(URL).map((res) => {
      let data: BaseResponse<EledgerResponse[], string> = res.json();
      data.queryString = { accountUniqueName, refresh };
      return data;
    }).catch((e) => HandleCatch<EledgerResponse[], string>(e, '', { accountUniqueName, refresh }));
  }

  /*
  * Trash Eledger transaction
  * Response will be string in body
  */
  public TrashEledgerTransaction(accountUniqueName: string, transactionId: string): Observable<BaseResponse<string, string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.delete(ELEDGER_API.TRASH.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', accountUniqueName).replace(':transactionId', transactionId)).map((res) => {
      let data: BaseResponse<string, string> = res.json();
      data.queryString = { accountUniqueName, transactionId };
      return data;
    }).catch((e) => HandleCatch<string, string>(e, '', { accountUniqueName, transactionId }));
  }

  /*
  * Map Eledger transaction
  * Response will be string in body
  */
  public MapEledgerTransaction(model: EledgerMapRequest, accountUniqueName: string, transactionId: string): Observable<BaseResponse<string, EledgerMapRequest>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
        this.companyUniqueName = s.session.companyUniqueName;
      }
    });
    return this._http.put(ELEDGER_API.MAP.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', accountUniqueName).replace(':transactionId', transactionId), model)
      .map((res) => {
        let data: BaseResponse<string, EledgerMapRequest> = res.json();
        data.request = model;
        data.queryString = { accountUniqueName, transactionId };
        return data;
      })
      .catch((e) => HandleCatch<string, EledgerMapRequest>(e, model, { accountUniqueName, transactionId }));
  }

}
