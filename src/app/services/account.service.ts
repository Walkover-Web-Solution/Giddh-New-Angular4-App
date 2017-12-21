import { ShareRequestForm } from '../models/api-models/Permission';
import { AccountMergeRequest, AccountMoveRequest, AccountRequest, AccountRequestV2, AccountResponse, AccountResponseV2, AccountSharedWithResponse, AccountsTaxHierarchyResponse, AccountUnMergeRequest, FlattenAccountsResponse, ShareAccountRequest, ShareEntityRequest } from '../models/api-models/Account';
import { Observable } from 'rxjs/Observable';
import { HttpWrapperService } from './httpWrapper.service';
import { Injectable, OnInit, Inject, Optional } from '@angular/core';
import { ACCOUNTS_API, ACCOUNTS_API_V2 } from './apiurls/account.api';
import { UserDetails } from '../models/api-models/loginModels';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { ErrorHandler } from './catchManager/catchmanger';
import { APPLY_TAX_API } from './apiurls/applyTax.api';
import { ApplyTaxRequest } from '../models/api-models/ApplyTax';
import { GeneralService } from './general.service';
import { ServiceConfig, IServiceConfigArgs } from './service.config';

@Injectable()
export class AccountService implements OnInit {

  private user: UserDetails;
  private companyUniqueName: string;

  constructor(private errorHandler: ErrorHandler, private _http: HttpWrapperService,
    private _generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
  }

  public ngOnInit() {
    //
  }

  /**
   * Create Account Service
   */
  public CreateAccount(model: AccountRequest, groupUniqueName: string): Observable<BaseResponse<AccountResponse, AccountRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + ACCOUNTS_API.CREATE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':groupUniqueName', encodeURIComponent(groupUniqueName)), model)
      .map((res) => {
        let data: BaseResponse<AccountResponse, AccountRequest> = res.json();
        data.request = model;
        data.queryString = { groupUniqueName };
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<AccountResponse, AccountRequest>(e, model, { groupUniqueName }));
  }

  public UpdateAccount(model: AccountRequest, accountUniqueName: string): Observable<BaseResponse<AccountResponse, AccountRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.put(this.config.apiUrl + ACCOUNTS_API.UPDATE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', accountUniqueName), model)
      .map((res) => {
        let data: BaseResponse<AccountResponse, AccountRequest> = res.json();
        data.request = model;
        data.queryString = { accountUniqueName };
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<AccountResponse, AccountRequest>(e));
  }

  public GetAccountDetails(accountUniqueName: string): Observable<BaseResponse<AccountResponse, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + ACCOUNTS_API.DETAILS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', encodeURIComponent(accountUniqueName))).map((res) => {
      let data: BaseResponse<AccountResponse, string> = res.json();
      data.queryString = { accountUniqueName };
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<AccountResponse, string>(e));
  }

  public GetAccountUniqueName(accountUniqueName: string): Observable<BaseResponse<AccountResponse, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + ACCOUNTS_API.DETAILS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', encodeURIComponent(accountUniqueName))).map((res) => {
      let data: BaseResponse<AccountResponse, string> = res.json();
      data.queryString = { accountUniqueName };
      data.request = accountUniqueName;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<AccountResponse, string>(e));
  }

  public MergeAccount(model: AccountMergeRequest[], accountUniqueName: string): Observable<BaseResponse<string, AccountMergeRequest[]>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.put(this.config.apiUrl + ACCOUNTS_API.MERGE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', encodeURIComponent(accountUniqueName)), model)
      .map((res) => {
        let data: BaseResponse<string, AccountMergeRequest[]> = res.json();
        data.request = model;
        data.queryString = { accountUniqueName };
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<string, AccountMergeRequest[]>(e));
  }

  public UnmergeAccount(model: AccountUnMergeRequest, accountUniqueName: string): Observable<BaseResponse<string, AccountUnMergeRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + ACCOUNTS_API.UNMERGE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', encodeURIComponent(accountUniqueName)), model)
      .map((res) => {
        let data: BaseResponse<string, AccountUnMergeRequest> = res.json();
        data.request = model;
        data.queryString = { accountUniqueName };
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<string, AccountUnMergeRequest>(e));
  }

  public ApplyTax(model: ApplyTaxRequest): Observable<BaseResponse<string, ApplyTaxRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    let mod = [];
    mod.push(model);
    return this._http.post(this.config.apiUrl + APPLY_TAX_API.APPLY_TAX.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), mod)
      .map((res) => {
        let data: BaseResponse<string, ApplyTaxRequest> = res.json();
        data.request = model;
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<string, ApplyTaxRequest>(e));
  }

  public AccountMove(model: AccountMoveRequest, accountUniqueName: string): Observable<BaseResponse<string, AccountMoveRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.put(this.config.apiUrl + ACCOUNTS_API.MOVE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', encodeURIComponent(accountUniqueName)), model)
      .map((res) => {
        let data: BaseResponse<string, AccountMoveRequest> = res.json();
        data.request = model;
        data.queryString = { accountUniqueName };
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<string, AccountMoveRequest>(e));
  }

  public AccountShare(model: ShareAccountRequest, accountUniqueName: string): Observable<BaseResponse<string, ShareAccountRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.put(this.config.apiUrl + ACCOUNTS_API.SHARE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', encodeURIComponent(accountUniqueName)), model)
      .map((res) => {
        let data: BaseResponse<string, ShareAccountRequest> = res.json();
        data.request = model;
        data.queryString = { accountUniqueName };
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<string, ShareAccountRequest>(e));
  }

  public Share(model: ShareEntityRequest, roleUniqueName: string): Observable<BaseResponse<string, ShareEntityRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + ACCOUNTS_API.SHARE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':roleUniqueName', encodeURIComponent(roleUniqueName)), model)
      .map((res) => {
        let data: BaseResponse<string, ShareEntityRequest> = res.json();
        data.request = model;
        data.queryString = { roleUniqueName, entity: model.entity, entityUniqueName: model.entityUniqueName };
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<string, ShareEntityRequest>(e));
  }

  public UnShare(entryUniqueName: string, entity: string, entityUniqueName: string): Observable<BaseResponse<string, ShareEntityRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.delete(this.config.apiUrl + ACCOUNTS_API.CHANGE_PERMISSION.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':assignRoleEntryUniqueName', encodeURIComponent(entryUniqueName)))
      .map((res) => {
        let data: BaseResponse<string, ShareEntityRequest> = res.json();
        data.queryString = { entryUniqueName, entityUniqueName, entity };
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<string, ShareEntityRequest>(e));
  }

  public UpdateEntityPermission(model: ShareRequestForm, entity: string, newRoleUniqueName: string): Observable<BaseResponse<string, ShareEntityRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;

    return this._http.put(this.config.apiUrl + ACCOUNTS_API.CHANGE_PERMISSION.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':assignRoleEntryUniqueName', encodeURIComponent(model.uniqueName)), model)
      .map((res) => {
        let data: BaseResponse<string, ShareEntityRequest> = res.json();
        data.queryString = { model, newRoleUniqueName, entity };
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<string, ShareEntityRequest>(e));
  }

  public AccountUnshare(userEmail: string, accountUniqueName: string): Observable<BaseResponse<string, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;

    return this._http.put(this.config.apiUrl + ACCOUNTS_API.CHANGE_PERMISSION.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', encodeURIComponent(accountUniqueName)), { user: userEmail }).map((res) => {
      let data: BaseResponse<string, string> = res.json();
      data.request = userEmail;
      data.queryString = { accountUniqueName };
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<string, string>(e));
  }

  public AccountShareWith(accountUniqueName: string): Observable<BaseResponse<AccountSharedWithResponse[], string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + ACCOUNTS_API.SHARED_WITH.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', encodeURIComponent(accountUniqueName)))
      .map((res) => {
        let data: BaseResponse<AccountSharedWithResponse[], string> = res.json();
        data.request = '';
        data.queryString = { accountUniqueName };
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<AccountSharedWithResponse[], string>(e));
  }

  public DeleteAccount(accountUniqueName: string): Observable<BaseResponse<string, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.delete(this.config.apiUrl + ACCOUNTS_API.DELETE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', encodeURIComponent(accountUniqueName))).map((res) => {
      let data: BaseResponse<string, string> = res.json();
      data.request = accountUniqueName;
      data.queryString = { accountUniqueName };
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<string, string>(e, accountUniqueName, { accountUniqueName }));
  }

  public GetFlattenAccounts(q?: string, page?: string, count?: string): Observable<BaseResponse<FlattenAccountsResponse, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + ACCOUNTS_API.FLATTEN_ACCOUNTS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':q', encodeURIComponent(q || '')).replace(':count', count || '').replace(':page', encodeURIComponent(page || ''))).map((res) => {
      let data: BaseResponse<FlattenAccountsResponse, string> = res.json();
      data.request = '';
      data.queryString = { q, page, count };
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<FlattenAccountsResponse, string>(e));
  }

  public GetFlatternAccountsOfGroup(groupUniqueNames: { groupUniqueNames: string[] }, count?: any, q?: string, page?: any): Observable<BaseResponse<FlattenAccountsResponse, { groupUniqueNames: string[] }>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + ACCOUNTS_API.FLATTEN_ACCOUNTS_OF_GROUPS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':count', count || 0).replace(':q', encodeURIComponent(q || '')).replace(':page', encodeURIComponent(page || 1)), groupUniqueNames).map((res) => {
      let data: BaseResponse<FlattenAccountsResponse, { groupUniqueNames: string[] }> = res.json();
      data.request = groupUniqueNames;
      data.queryString = { count, q, page };
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<FlattenAccountsResponse, { groupUniqueNames: string[] }>(e));
  }

  public GetTaxHierarchy(accountUniqueName: string): Observable<BaseResponse<AccountsTaxHierarchyResponse, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + ACCOUNTS_API.TAX_HIERARCHY.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', encodeURIComponent(accountUniqueName))).map((res) => {
      let data: BaseResponse<AccountsTaxHierarchyResponse, string> = res.json();
      data.request = '';
      data.queryString = { accountUniqueName };
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<AccountsTaxHierarchyResponse, string>(e));
  }

  /**
   * accounts v2 api's
   */
  public GetAccountDetailsV2(accountUniqueName: string): Observable<BaseResponse<AccountResponseV2, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + ACCOUNTS_API_V2.GET.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':accountUniqueName', encodeURIComponent(accountUniqueName))).map((res) => {
      let data: BaseResponse<AccountResponseV2, string> = res.json();
      data.queryString = { accountUniqueName };
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<AccountResponseV2, string>(e));
  }

  public CreateAccountV2(model: AccountRequestV2, groupUniqueName: string): Observable<BaseResponse<AccountResponseV2, AccountRequestV2>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + ACCOUNTS_API_V2.CREATE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':groupUniqueName', encodeURIComponent(groupUniqueName)), model)
      .map((res) => {
        let data: BaseResponse<AccountResponseV2, AccountRequestV2> = res.json();
        data.request = model;
        data.queryString = { groupUniqueName };
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<AccountResponseV2, AccountRequestV2>(e, model, { groupUniqueName }));
  }

  public UpdateAccountV2(model: AccountRequestV2, reqObj: { groupUniqueName: string, accountUniqueName: string }): Observable<BaseResponse<AccountResponseV2, AccountRequestV2>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.put(this.config.apiUrl + ACCOUNTS_API_V2.UPDATE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
      .replace(':groupUniqueName', encodeURIComponent(reqObj.groupUniqueName))
      .replace(':accountUniqueName', reqObj.accountUniqueName), model)
      .map((res) => {
        let data: BaseResponse<AccountResponseV2, AccountRequestV2> = res.json();
        data.request = model;
        data.queryString = reqObj;
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<AccountResponseV2, AccountRequestV2>(e));
  }
}
