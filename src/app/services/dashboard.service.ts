import { Injectable, Optional, Inject } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Configuration, URLS } from '../app.constants';
import { Router } from '@angular/router';
import { HttpWrapperService } from './httpWrapper.service';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { UserDetails } from '../models/api-models/loginModels';
import { ErrorHandler } from './catchManager/catchmanger';
import { DASHBOARD_API } from './apiurls/dashboard.api';
import { BankAccountsResponse, ClosingBalanceResponse, DashboardResponse, GroupHistoryRequest, GroupHistoryResponse, RefreshBankAccountResponse } from '../models/api-models/Dashboard';
import { GeneralService } from './general.service';
import { ServiceConfig, IServiceConfigArgs } from './service.config';

@Injectable()
export class DashboardService {
  private companyUniqueName: string;
  private user: UserDetails;

  constructor(private errorHandler: ErrorHandler, public _http: HttpWrapperService, public _router: Router,
              private _generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
  }

  public Dashboard(fromDate: string = '', toDate: string = '', interval: string = 'monthly', refresh: boolean = false): Observable<BaseResponse<DashboardResponse, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + DASHBOARD_API.DASHBOARD.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':from', encodeURIComponent(fromDate)).replace(':to', encodeURIComponent(toDate)).replace(':interval', interval).replace(':refresh', refresh.toString())).map((res) => {
      let data: BaseResponse<DashboardResponse, string> = res;
      data.queryString = {fromDate, toDate, interval, refresh};
      data.request = '';
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<DashboardResponse, string>(e, '', {fromDate, toDate, interval, refresh}));
  }

  public GetGroupHistory(model: GroupHistoryRequest, fromDate: string = '', toDate: string = '', interval: string = 'monthly', refresh: boolean = false): Observable<BaseResponse<GroupHistoryResponse, GroupHistoryRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + DASHBOARD_API.GROUP_HISTORY.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':from', encodeURIComponent(fromDate)).replace(':to', encodeURIComponent(toDate)).replace(':interval', interval).replace(':refresh', refresh.toString()), model).map((res) => {
      let data: BaseResponse<GroupHistoryResponse, GroupHistoryRequest> = res;
      data.request = model;
      data.queryString = {fromDate, toDate, interval, refresh};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<GroupHistoryResponse, GroupHistoryRequest>(e, model, {
      fromDate,
      toDate,
      interval,
      refresh
    }));
  }

  public GetClosingBalance(groupUniqueName: string = '', fromDate: string = '', toDate: string = '', refresh: boolean = false): Observable<BaseResponse<ClosingBalanceResponse, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + DASHBOARD_API.CLOSING_BALANCE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':fromDate', fromDate).replace(':toDate', toDate).replace(':groupUniqueName', encodeURIComponent(groupUniqueName)).replace(':refresh', refresh.toString())).map((res) => {
      let data: BaseResponse<ClosingBalanceResponse, string> = res;
      data.queryString = {fromDate, toDate, groupUniqueName, refresh};
      data.request = '';
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<ClosingBalanceResponse, string>(e, '', {fromDate, toDate, groupUniqueName, refresh}));
  }

  public GetBankAccounts(): Observable<BaseResponse<BankAccountsResponse[], string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + DASHBOARD_API.BANK_ACCOUNTS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).map((res) => {
      let data: BaseResponse<BankAccountsResponse[], string> = res;
      data.request = '';
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<BankAccountsResponse[], string>(e, ''));
  }

  public RefreshBankAccount(loginId: string): Observable<BaseResponse<RefreshBankAccountResponse, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + DASHBOARD_API.REFRESH_BANK_ACCOUNT.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':loginId', loginId)).map((res) => {
      let data: BaseResponse<RefreshBankAccountResponse, string> = res;
      data.request = '';
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<RefreshBankAccountResponse, string>(e, ''));
  }

  public ReconnectBankAccount(loginId: string): Observable<BaseResponse<RefreshBankAccountResponse, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + DASHBOARD_API.RECONNECT_BANK_ACCOUNT.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':loginId', loginId)).map((res) => {
      let data: BaseResponse<RefreshBankAccountResponse, string> = res;
      data.request = '';
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<RefreshBankAccountResponse, string>(e, ''));
  }

  public GetRationAnalysis(date: string): Observable<BaseResponse<BankAccountsResponse[], string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + DASHBOARD_API.RATIO_ANALYSIS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':date', date)).map((res) => {
      let data: BaseResponse<BankAccountsResponse[], string> = res;
      data.request = date;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<BankAccountsResponse[], string>(e, ''));
  }
}
