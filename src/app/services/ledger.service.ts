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
import { LEDGER_API } from './apiurls/ledger.api';
import { TransactionsResponse, ReconcileResponse, LedgerResponse, LedgerRequest } from '../models/api-models/Ledger';

@Injectable()
export class LedgerService {
  private companyUniqueName: string;
  private user: UserDetails;

  constructor(public _http: HttpWrapperService, public _router: Router, private store: Store<AppState>) {
  }

  /**
   * get transactions
   */
  public GetTranscations(q: string = '', page: number = 1, count: number = 15, accountUniqueName: string = '', fromDate: string = '', toDate: string = '', sort: string = 'asc', reversePage: boolean = false): Observable<BaseResponse<TransactionsResponse, string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(LEDGER_API.TRANSACTIONS.replace(':companyUniqueName', this.companyUniqueName).replace(':q', q).replace(':page', page.toString()).replace(':count', count.toString()).replace(':accountUniqueName', accountUniqueName).replace(':fromDate', fromDate).replace(':sort', sort).replace(':toDate', toDate).replace(':reversePage', reversePage.toString())).map((res) => {
      let data: BaseResponse<TransactionsResponse, string> = res.json();
      data.request = '';
      data.queryString = { q, page, count, accountUniqueName, fromDate, toDate, reversePage, sort };
      return data;
    }).catch((e) => HandleCatch<TransactionsResponse, string>(e, '', { q, page, count, accountUniqueName, fromDate, toDate, reversePage, sort }));
  }

  /**
   * get reconcile
   */
  public GetReconcile(accountUniqueName: string = ''): Observable<BaseResponse<ReconcileResponse, string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(LEDGER_API.RECONCILE.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', accountUniqueName)).map((res) => {
      let data: BaseResponse<ReconcileResponse, string> = res.json();
      data.request = '';
      data.queryString = { accountUniqueName };
      return data;
    }).catch((e) => HandleCatch<ReconcileResponse, string>(e, '', { accountUniqueName }));
  }

  public CreateLEdger(model: LedgerRequest, accountUniqueName: string): Observable<BaseResponse<LedgerResponse, LedgerRequest>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
        this.companyUniqueName = s.session.companyUniqueName;
      }
    });
    return this._http.post(LEDGER_API.CREATE.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', accountUniqueName), model)
      .map((res) => {
        let data: BaseResponse<LedgerResponse, LedgerRequest> = res.json();
        data.request = model;
        data.queryString = { accountUniqueName };
        return data;
      })
      .catch((e) => HandleCatch<LedgerResponse, LedgerRequest>(e, model, { accountUniqueName }));
  }
}
