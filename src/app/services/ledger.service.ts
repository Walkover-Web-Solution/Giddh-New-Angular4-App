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
import {
  TransactionsResponse, ReconcileResponse, LedgerResponse, LedgerRequest, TransactionsRequest,
  DownloadLedgerRequest
} from '../models/api-models/Ledger';
import { BlankLedgerVM } from '../ledger/ledger.vm';

@Injectable()
export class LedgerService {
  private companyUniqueName: string;
  private user: UserDetails;

  constructor(public _http: HttpWrapperService, public _router: Router, private store: Store<AppState>) {
  }

  /**
   * get ledger transactions
   */
  public GetLedgerTranscations(q: string = '', page: number = 1, count: number = 15, accountUniqueName: string = '', from: string = '', to: string = '', sort: string = 'asc', reversePage: boolean = false): Observable<BaseResponse<TransactionsResponse, TransactionsRequest>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    let request = new TransactionsRequest();
    request.q = q;
    request.accountUniqueName = accountUniqueName;
    request.count = count;
    request.from = from;
    request.page = page;
    request.reversePage = reversePage;
    request.sort = sort;
    request.to = to;
    return this._http.get(LEDGER_API.GET.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':q', encodeURIComponent(q || '')).replace(':page', page.toString()).replace(':count', encodeURIComponent(count.toString())).replace(':accountUniqueName', encodeURIComponent(accountUniqueName)).replace(':from', from).replace(':sort', encodeURIComponent(sort)).replace(':to', encodeURIComponent(to)).replace(':reversePage', reversePage.toString())).map((res) => {
      let data: BaseResponse<TransactionsResponse, TransactionsRequest> = res.json();
      data.request = request;
      data.queryString = { q, page, count, accountUniqueName, from, to, reversePage, sort };
      return data;
    }).catch((e) => HandleCatch<TransactionsResponse, TransactionsRequest>(e, request, { q, page, count, accountUniqueName, from, to, reversePage, sort }));
  }

  /*
  * create Ledger transaction
  */

  public CreateLedger(model: BlankLedgerVM, accountUniqueName: string): Observable<BaseResponse<LedgerResponse[], BlankLedgerVM>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
        this.companyUniqueName = s.session.companyUniqueName;
      }
    });
    return this._http.post(LEDGER_API.CREATE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', encodeURIComponent(accountUniqueName)), model)
      .map((res) => {
        let data: BaseResponse<LedgerResponse[], BlankLedgerVM> = res.json();
        data.request = model;
        data.queryString = { accountUniqueName };
        return data;
      })
      .catch((e) => HandleCatch<LedgerResponse[], BlankLedgerVM>(e, model, { accountUniqueName }));
  }

  /*
  * update Ledger transaction
  */
  public UpdateLedgerTransactions(model: LedgerRequest, accountUniqueName: string, entryUniqueName: string): Observable<BaseResponse<LedgerResponse, LedgerRequest>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
        this.companyUniqueName = s.session.companyUniqueName;
      }
    });
    return this._http.put(LEDGER_API.UNIVERSAL.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', encodeURIComponent(accountUniqueName)).replace(':entryUniqueName', entryUniqueName), model)
      .map((res) => {
        let data: BaseResponse<LedgerResponse, LedgerRequest> = res.json();
        data.request = model;
        data.queryString = { accountUniqueName, entryUniqueName };
        return data;
      })
      .catch((e) => HandleCatch<LedgerResponse, LedgerRequest>(e, model, { accountUniqueName, entryUniqueName }));
  }

  /*
  * delete Ledger transaction
  */
  public DeleteLedgerTransaction(accountUniqueName: string, entryUniqueName: string): Observable<BaseResponse<string, string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.delete(LEDGER_API.UNIVERSAL.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', encodeURIComponent(accountUniqueName)).replace(':entryUniqueName', entryUniqueName)).map((res) => {
      let data: BaseResponse<string, string> = res.json();
      data.queryString = { accountUniqueName, entryUniqueName };
      return data;
    }).catch((e) => HandleCatch<string, string>(e, accountUniqueName, { accountUniqueName, entryUniqueName }));
  }

  /*
  * Ledger get transaction details
  */
  public GetLedgerTransactionDetails(accountUniqueName: string, entryUniqueName: string): Observable<BaseResponse<LedgerResponse[], string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(LEDGER_API.UNIVERSAL.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', encodeURIComponent(accountUniqueName)).replace(':entryUniqueName', entryUniqueName)).map((res) => {
      let data: BaseResponse<LedgerResponse[], string> = res.json();
      data.queryString = { accountUniqueName, entryUniqueName };
      return data;
    }).catch((e) => HandleCatch<LedgerResponse[], string>(e, accountUniqueName, { accountUniqueName, entryUniqueName }));
  }

  /**
   * Ledger get reconcile entries
   * It will internally call Eledger API with condition
   * Note in response user only get check number entries
   * /ledgers/reconcile?from=24-06-2017&to=24-07-2017
   */
  public GetReconcile(accountUniqueName: string = '', from: string = '', to: string = '', chequeNumber: string = '', ): Observable<BaseResponse<ReconcileResponse, string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(LEDGER_API.RECONCILE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', encodeURIComponent(accountUniqueName)).replace(':from', from).replace(':to', to).replace(':chequeNumber', chequeNumber)).map((res) => {
      let data: BaseResponse<ReconcileResponse, string> = res.json();
      data.queryString = { accountUniqueName, from, to, chequeNumber };
      return data;
    }).catch((e) => HandleCatch<ReconcileResponse, string>(e, '', { accountUniqueName, from, to, chequeNumber }));
  }

  public DownloadInvoice(model: DownloadLedgerRequest, accountUniqueName: string): Observable<BaseResponse<string, DownloadLedgerRequest>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
        this.companyUniqueName = s.session.companyUniqueName;
      }
    });
    return this._http.post(LEDGER_API.DOWNLOAD_INVOICE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', encodeURIComponent(accountUniqueName)), model)
      .map((res) => {
        let data: BaseResponse<string, DownloadLedgerRequest> = res.json();
        data.request = model;
        data.queryString = { accountUniqueName };
        return data;
      })
      .catch((e) => HandleCatch<string, DownloadLedgerRequest>(e, model, { accountUniqueName }));
  }
}
