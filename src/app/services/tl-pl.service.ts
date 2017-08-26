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
import { TB_PL_BS_API } from './apiurls/tl-pl.api';
import { ProfitLossRequest, TrialBalanceExportRequest, TrialBalanceRequest, BalanceSheetRequest, AccountDetails } from '../models/api-models/tb-pl-bs';

@Injectable()
export class TlPlService {
  private companyUniqueName: string;
  private user: UserDetails;

  constructor(public _http: HttpWrapperService, public _router: Router, private store: Store<AppState>) {
  }

  /**
   * Get Trial Balance
   */
  public GetTrailBalance(request: TrialBalanceRequest): Observable<BaseResponse<AccountDetails, TrialBalanceRequest>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(TB_PL_BS_API.GET_TRIAL_BALANCE
      .replace(':companyUniqueName', this.companyUniqueName), request)
      .map((res) => {
        let data: BaseResponse<AccountDetails, TrialBalanceRequest> = res.json();
        data.request = request;
        return data;
      })
      .catch((e) => HandleCatch<AccountDetails, TrialBalanceRequest>(e, request));
  }

  /**
   * get Profit/Loss
   */
  public GetProfitLoss(request: ProfitLossRequest): Observable<BaseResponse<AccountDetails, ProfitLossRequest>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    let filteredRequest = (Object.keys(request)
      .filter(p => request[p] != null)
      .reduce((r, i) => ({ ...r, [i]: request[i] }), {}));

    return this._http.get(TB_PL_BS_API.GET_PROFIT_LOSS
      .replace(':companyUniqueName', this.companyUniqueName), filteredRequest)
      .map((res) => {
        let data: BaseResponse<AccountDetails, ProfitLossRequest> = res.json();
        data.request = request;
        return data;
      })
      .catch((e) => HandleCatch<AccountDetails, ProfitLossRequest>(e, request));
  }

  /**
  * get BalanceSheet
  */
  public GetBalanceSheet(request: BalanceSheetRequest): Observable<BaseResponse<AccountDetails, BalanceSheetRequest>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    let filteredRequest = (Object.keys(request)
      .filter(p => request[p] != null)
      .reduce((r, i) => ({ ...r, [i]: request[i] }), {}));

    return this._http.get(TB_PL_BS_API.GET_BALANCE_SHEET
      .replace(':companyUniqueName', this.companyUniqueName), filteredRequest)
      .map((res) => {
        let data: BaseResponse<AccountDetails, BalanceSheetRequest> = res.json();
        data.request = request;
        return data;
      })
      .catch((e) => HandleCatch<any, any>(e));
  }

  public ExportTrialBalance(request: TrialBalanceExportRequest): Observable<BaseResponse<any, any>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(TB_PL_BS_API.GET_PROFIT_LOSS
      .replace(':companyUniqueName', this.companyUniqueName), request)
      .map((res) => {
        return res.json();
      })
      .catch((e) => HandleCatch<any, any>(e));
  }

  public ExportBalanceSheet(request: TrialBalanceExportRequest): Observable<BaseResponse<any, any>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(TB_PL_BS_API.GET_PROFIT_LOSS
      .replace(':companyUniqueName', this.companyUniqueName), request)
      .map((res) => {
        return res.json();
      })
      .catch((e) => HandleCatch<any, any>(e));
  }

  public ExportProfitLoss(request: TrialBalanceExportRequest): Observable<BaseResponse<any, any>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(TB_PL_BS_API.GET_PROFIT_LOSS
      .replace(':companyUniqueName', this.companyUniqueName), request)
      .map((res) => {
        return res.json();
      })
      .catch((e) => HandleCatch<any, any>(e));
  }
}
