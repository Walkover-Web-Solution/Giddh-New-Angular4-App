import { Observable } from 'rxjs/Observable';
import { HttpWrapperService } from './httpWrapper.service';
import { Injectable, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { AccountMergeRequest, AccountRequest, AccountUnMergeRequest, AccountResponse, AccountMoveRequest, ShareAccountRequest, AccountSharedWithResponse, FlattenAccountsResponse, AccountsTaxHierarchyResponse } from '../models/api-models/Account';
import { ACCOUNTS_API } from './apiurls/account.api';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { UserDetails } from '../models/api-models/loginModels';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { HandleCatch } from './catchManager/catchmanger';
import { APPLY_TAX_API } from './apiurls/applyTax.api';
import { ApplyTaxRequest } from '../models/api-models/ApplyTax';

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
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.put(ACCOUNTS_API.UPDATE.replace(':companyUniqueName', this.companyUniqueName).replace(':accountName', accountName), model)
      .map((res) => {
        let data: BaseResponse<AccountResponse> = res.json();
        return data;
      })
      .catch((e) => HandleCatch<AccountResponse>(e));
  }

  public GetAccountDetails(accountUniqueName: string): Observable<BaseResponse<AccountResponse>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(ACCOUNTS_API.DETAILS.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', accountUniqueName)).map((res) => {
      let data: BaseResponse<AccountResponse> = res.json();
      return data;
    }).catch((e) => HandleCatch<AccountResponse>(e));
  }

  public MergeAccount(model: AccountMergeRequest[], accountUniqueName: string): Observable<BaseResponse<string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
        this.companyUniqueName = s.session.companyUniqueName;
      }
    });
    return this._http.put(ACCOUNTS_API.MERGE_ACCOUNT.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', accountUniqueName), model)
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

  public ApplyTax(model: ApplyTaxRequest): Observable<BaseResponse<string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
        this.companyUniqueName = s.session.companyUniqueName;
      }
    });
    let mod = [];
    mod.push(model);
    return this._http.post(APPLY_TAX_API.APPLY_TAX.replace(':companyUniqueName', this.companyUniqueName), mod)
      .map((res) => {
        let data: BaseResponse<string> = res.json();
        return data;
      })
      .catch((e) => HandleCatch<string>(e));
  }
  public AccountMove(model: AccountMoveRequest, accountUniqueName: string): Observable<BaseResponse<string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
        this.companyUniqueName = s.session.companyUniqueName;
      }
    });
    return this._http.put(ACCOUNTS_API.MOVE.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', accountUniqueName), model)
      .map((res) => {
        let data: BaseResponse<string> = res.json();
        return data;
      })
      .catch((e) => HandleCatch<string>(e));
  }

  public AccountShare(model: ShareAccountRequest, accountUniqueName: string): Observable<BaseResponse<string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
        this.companyUniqueName = s.session.companyUniqueName;
      }
    });
    return this._http.put(ACCOUNTS_API.SHARE.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', accountUniqueName), model)
      .map((res) => {
        let data: BaseResponse<string> = res.json();
        return data;
      })
      .catch((e) => HandleCatch<string>(e));
  }

  public AccountUnshare(userEmail: string, accountUniqueName: string): Observable<BaseResponse<string>> {
    debugger
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });

    return this._http.put(ACCOUNTS_API.UNSHARE.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', accountUniqueName), { user: userEmail }).map((res) => {
      let data: BaseResponse<string> = res.json();
      return data;
    }).catch((e) => HandleCatch<string>(e));
  }
  public AccountShareWith(accountUniqueName: string): Observable<BaseResponse<AccountSharedWithResponse[]>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
        this.companyUniqueName = s.session.companyUniqueName;
      }
    });
    return this._http.get(ACCOUNTS_API.SHARED_WITH.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', accountUniqueName))
      .map((res) => {
        let data: BaseResponse<AccountSharedWithResponse[]> = res.json();
        return data;
      })
      .catch((e) => HandleCatch<AccountSharedWithResponse[]>(e));
  }
  public GetFlattenAccounts(q: string, refresh: string): Observable<BaseResponse<FlattenAccountsResponse[]>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(ACCOUNTS_API.FLATTEN_ACCOUNTS.replace(':companyUniqueName', this.companyUniqueName).replace(':q', q).replace(':refresh', refresh)).map((res) => {
      let data: BaseResponse<FlattenAccountsResponse[]> = res.json();
      return data;
    }).catch((e) => HandleCatch<FlattenAccountsResponse[]>(e));
  }

  public GetTaxHierarchy(accountUniqueName: string): Observable<BaseResponse<AccountsTaxHierarchyResponse>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(ACCOUNTS_API.TAX_HIERARCHY.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', accountUniqueName)).map((res) => {
      let data: BaseResponse<AccountsTaxHierarchyResponse> = res.json();
      return data;
    }).catch((e) => HandleCatch<AccountsTaxHierarchyResponse>(e));
  }
}
