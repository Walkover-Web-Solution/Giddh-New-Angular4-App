import { Observable } from 'rxjs/Observable';
import { HttpWrapperService } from './httpWrapper.service';
import { Injectable, Optional, Inject } from '@angular/core';
import { UserDetails } from '../models/api-models/loginModels';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { ErrorHandler } from './catchManager/catchmanger';
import { EBANKS, YODLEE_FASTLINK } from './apiurls/settings.linked.accounts.api';
import { IGetAllEbankAccountResponse, IGetEbankTokenResponse, IAccessTokenResponse } from '../models/api-models/SettingsLinkedAccounts';
import { GeneralService } from './general.service';
import { ServiceConfig, IServiceConfigArgs } from './service.config';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Injectable()
export class SettingsLinkedAccountsService {

  private user: UserDetails;
  private companyUniqueName: string;

  constructor(private errorHandler: ErrorHandler, private _http: HttpWrapperService,
              private _generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
  }

  /**
   * Get ebank token
   */
  public GetEbankToken(): Observable<BaseResponse<IGetEbankTokenResponse, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + EBANKS.GET_TOKEN.replace(':companyUniqueName', this.companyUniqueName)).map((res) => {
      let data: BaseResponse<IGetEbankTokenResponse, string> = res;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<IGetEbankTokenResponse, string>(e));
  }

  /**
   * Get all ebank accounts
   */
  public GetAllEbankAccounts(): Observable<BaseResponse<IGetAllEbankAccountResponse[], string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + EBANKS.GET_ALL_ACCOUNTS.replace(':companyUniqueName', this.companyUniqueName)).map((res) => {
      let data: BaseResponse<IGetAllEbankAccountResponse[], string> = res;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<IGetAllEbankAccountResponse[], string>(e));
  }

  /**
   * Refresh all ebank accounts
   */
  public RefreshAllEbankAccounts(): Observable<BaseResponse<IGetAllEbankAccountResponse[], string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + EBANKS.REFRESH_ACCOUNTS.replace(':companyUniqueName', this.companyUniqueName)).map((res) => {
      let data: BaseResponse<IGetAllEbankAccountResponse[], string> = res;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<IGetAllEbankAccountResponse[], string>(e));
  }

  /**
   * Reconnect account
   */
  public ReconnectAccount(loginId: string): Observable<BaseResponse<any, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + EBANKS.RECONNECT_ACCOUNT.replace(':companyUniqueName', this.companyUniqueName).replace(':loginId', loginId)).map((res) => {
      let data: BaseResponse<any, string> = res;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<any, string>(e));
  }

  /**
   * Delete account
   */
  public DeleteBankAccount(loginId: string): Observable<BaseResponse<any, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.delete(this.config.apiUrl + EBANKS.DELETE_BANK_ACCOUNT.replace(':companyUniqueName', this.companyUniqueName).replace(':accountId', loginId)).map((res) => {
      let data: BaseResponse<any, string> = res;
      data.queryString = {loginId};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<any, string>(e));
  }

  /**
   * Refresh account
   */
  public RefreshBankAccount(loginId: string): Observable<BaseResponse<any, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + EBANKS.REFREST_ACCOUNT.replace(':companyUniqueName', this.companyUniqueName).replace(':loginId', loginId)).map((res) => {
      let data: BaseResponse<any, string> = res;
      data.queryString = {loginId};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<any, string>(e));
  }

  /**
   * Link bank account
   */
  public LinkBankAccount(dataToSend: object, accountId: string): Observable<BaseResponse<any, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.put(this.config.apiUrl + EBANKS.LINK_ACCOUNT.replace(':companyUniqueName', this.companyUniqueName).replace(':accountId', accountId), dataToSend).map((res) => {
      let data: BaseResponse<any, string> = res;
      data.queryString = {accountId};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<any, string>(e));
  }

  /**
   * Unlink bank account
   */
  public UnlinkBankAccount(accountId: string, accountUniqueName): Observable<BaseResponse<any, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.delete(this.config.apiUrl + EBANKS.UNLINK_ACCOUNT.replace(':companyUniqueName', this.companyUniqueName).replace(':accountId', accountId).replace(':accountUniqueName', accountUniqueName)).map((res) => {
      let data: BaseResponse<any, string> = res;
      data.queryString = {accountId};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<any, string>(e));
  }

  /**
   * Update Date
   */
  public UpdateDate(date: string, accountId: string): Observable<BaseResponse<any, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.put(this.config.apiUrl + EBANKS.UPDATE_DATE.replace(':companyUniqueName', this.companyUniqueName).replace(':accountId', accountId).replace(':date', date), {}).map((res) => {
      let data: BaseResponse<any, string> = res;
      data.queryString = {accountId};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<any, string>(e));
  }

  /**
   * Get yodlee token
   */
  public GetYodleeToken(): Observable<BaseResponse<IAccessTokenResponse, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + YODLEE_FASTLINK.ACCESS_TOKEN.replace(':companyUniqueName', this.companyUniqueName)).map((res) => {
      let data: BaseResponse<IAccessTokenResponse, string> = res;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<IAccessTokenResponse, string>(e));
  }

  /**
   * Get yodlee accounts
   */
  public GetYodleeAccounts(): Observable<BaseResponse<any, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + YODLEE_FASTLINK.GET_ACCOUNTS.replace(':companyUniqueName', this.companyUniqueName)).map((res) => {
      let data: BaseResponse<any, string> = res;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<any, string>(e));
  }

  /**
   * Search Bank Accounts
   */
  public SearchBank(value): Observable<BaseResponse<any, any>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + YODLEE_FASTLINK.SEARCH_BANKS.replace(':companyUniqueName', this.companyUniqueName).replace(':queryString', value)).map((res) => {
      let data: BaseResponse<any, any> = res;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<any, any>(e));
  }

  /**
   * Provider login Form
   */
  public GetLoginForm(value): Observable<BaseResponse<any, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + YODLEE_FASTLINK.GET_LOGIN_FORM.replace(':companyUniqueName', this.companyUniqueName).replace(':providerId', value)).map((res) => {
      let data: BaseResponse<any, string> = res;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<any, string>(e));
  }

  /**
   * Add Provider
   */
  public AddProvider(objToSend, providerId): Observable<BaseResponse<any, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + YODLEE_FASTLINK.ADD_PROVIDER.replace(':companyUniqueName', this.companyUniqueName).replace(':providerId', providerId), objToSend).map((res) => {
      let data: BaseResponse<any, string> = res;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<any, string>(e));
  }

  public toFormGroup(response) {
    let group: any = {};

    response.row.forEach(row => {
      group[row.field] = row.isOptional ? new FormControl(row.value || '', Validators.required) : new FormControl(row.value || '');
    });
    return new FormGroup(group);
  }
}
