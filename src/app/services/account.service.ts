import { Observable } from 'rxjs/Observable';
import { HttpWrapperService } from './httpWrapper.service';
import { Injectable, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { AccountMergeRequest, AccountRequest, AccountUnMergeRequest, AccountResponse } from '../models/api-models/Account';
import { ACCOUNTS_API } from './apiurls/account.api';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { UserDetails } from '../models/api-models/loginModels';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { HandleCatch } from './catchManager/catchmanger';

@Injectable()
export class AccountService implements OnInit {

  private user: UserDetails;
  private companyUniqueName: string;
  constructor(private _http: HttpWrapperService, private store: Store<AppState>) {
  }

  public ngOnInit() {
    //
  }

  /**
   * Create Account Service
   */
  public CreateAccount(model: AccountRequest, groupUniqueName: string): Observable<BaseResponse<AccountResponse>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
        this.companyUniqueName = s.session.companyUniqueName;
      }
    });
    return this._http.post(ACCOUNTS_API.CREATE.replace(':companyUniqueName', this.companyUniqueName).replace(':groupUniqueName', groupUniqueName), model)
      .map((res) => {
        let data: BaseResponse<AccountResponse> = res.json();
        return data;
      })
      .catch((e) => HandleCatch<AccountResponse>(e));
  }

  public UpdateAccount(model: AccountRequest, accountName: string): Observable<BaseResponse<AccountResponse>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
        this.companyUniqueName = s.session.companyUniqueName;
      }
    });
    return this._http.post(ACCOUNTS_API.UPDATE.replace(':companyUniqueName', this.companyUniqueName).replace(':accountName', accountName), model)
      .map((res) => {
        let data: BaseResponse<AccountResponse> = res.json();
        return data;
      })
      .catch((e) => HandleCatch<AccountResponse>(e));
  }

  public MergeAccount(model: AccountMergeRequest[], accountUniqueName: string): Observable<BaseResponse<string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
        this.companyUniqueName = s.session.companyUniqueName;
      }
    });
    return this._http.post(ACCOUNTS_API.MERGE_ACCOUNT.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', accountUniqueName), model)
      .map((res) => {
        let data: BaseResponse<string> = res.json();
        return data;
      })
      .catch((e) => HandleCatch<string>(e));
  }

  public UnmergeAccount(model: AccountUnMergeRequest, accountUniqueName: string): Observable<BaseResponse<string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
        this.companyUniqueName = s.session.companyUniqueName;
      }
    });
    return this._http.post(ACCOUNTS_API.UNMERGE_ACCOUNT.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', accountUniqueName), model)
      .map((res) => {
        let data: BaseResponse<string> = res.json();
        return data;
      })
      .catch((e) => HandleCatch<string>(e));
  }

  public ApplyTax(model: AccountUnMergeRequest, accountUniqueName: string): Observable<BaseResponse<string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
        this.companyUniqueName = s.session.companyUniqueName;
      }
    });
    return this._http.post(ACCOUNTS_API.UNMERGE_ACCOUNT.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', accountUniqueName), model)
      .map((res) => {
        let data: BaseResponse<string> = res.json();
        return data;
      })
      .catch((e) => HandleCatch<string>(e));
  }
}
