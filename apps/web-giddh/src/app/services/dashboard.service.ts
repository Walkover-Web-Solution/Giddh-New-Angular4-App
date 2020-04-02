import { catchError, map } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';

import { Observable } from 'rxjs';
import { Configuration, URLS } from '../app.constants';
import { Router } from '@angular/router';
import { HttpWrapperService } from './httpWrapper.service';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { UserDetails } from '../models/api-models/loginModels';
import { ErrorHandler } from './catchManager/catchmanger';
import { DASHBOARD_API } from './apiurls/dashboard.api';
import {
    BankAccountsResponse,
    ClosingBalanceResponse,
    DashboardResponse,
    GroupHistoryRequest,
    GroupHistoryResponse,
    RefreshBankAccountResponse,
    GraphTypesResponse,
    RevenueGraphDataRequest,
    RevenueGraphDataResponse
} from '../models/api-models/Dashboard';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';

@Injectable()
export class DashboardService {
    private companyUniqueName: string;
    private user: UserDetails;

    constructor(private errorHandler: ErrorHandler, public _http: HttpWrapperService, public _router: Router, private _generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    public Dashboard(fromDate: string = '', toDate: string = '', interval: string = 'monthly', refresh: boolean = false): Observable<BaseResponse<DashboardResponse, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + DASHBOARD_API.DASHBOARD.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':from', encodeURIComponent(fromDate)).replace(':to', encodeURIComponent(toDate)).replace(':interval', interval).replace(':refresh', refresh.toString())).pipe(map((res) => {
            let data: BaseResponse<DashboardResponse, string> = res;
            data.queryString = { fromDate, toDate, interval, refresh };
            data.request = '';
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<DashboardResponse, string>(e, '', { fromDate, toDate, interval, refresh })));
    }

    public GetGroupHistory(model: GroupHistoryRequest, fromDate: string = '', toDate: string = '', interval: string = 'monthly', refresh: boolean = false): Observable<BaseResponse<GroupHistoryResponse, GroupHistoryRequest>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(this.config.apiUrl + DASHBOARD_API.GROUP_HISTORY.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':from', encodeURIComponent(fromDate)).replace(':to', encodeURIComponent(toDate)).replace(':interval', interval).replace(':refresh', refresh.toString()), model).pipe(map((res) => {
            let data: BaseResponse<GroupHistoryResponse, GroupHistoryRequest> = res;
            data.request = model;
            data.queryString = { fromDate, toDate, interval, refresh };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<GroupHistoryResponse, GroupHistoryRequest>(e, model, {
            fromDate,
            toDate,
            interval,
            refresh
        })));
    }

    public getClosingBalance(groupUniqueName: string = '', fromDate: string = '', toDate: string = '', refresh: boolean = false): Observable<BaseResponse<ClosingBalanceResponse, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + DASHBOARD_API.CLOSING_BALANCE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':fromDate', fromDate).replace(':toDate', toDate).replace(':groupUniqueName', encodeURIComponent(groupUniqueName)).replace(':refresh', refresh.toString())).pipe(map((res) => {
            let data: BaseResponse<ClosingBalanceResponse, string> = res;
            data.queryString = { fromDate, toDate, groupUniqueName, refresh };
            data.request = '';
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<ClosingBalanceResponse, string>(e, '', { fromDate, toDate, groupUniqueName, refresh })));
    }

    public GetBankAccounts(): Observable<BaseResponse<BankAccountsResponse[], string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + DASHBOARD_API.BANK_ACCOUNTS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<BankAccountsResponse[], string> = res;
            data.request = '';
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<BankAccountsResponse[], string>(e, '')));
    }

    public RefreshBankAccount(loginId: string): Observable<BaseResponse<RefreshBankAccountResponse, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + DASHBOARD_API.REFRESH_BANK_ACCOUNT.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':loginId', loginId)).pipe(map((res) => {
            let data: BaseResponse<RefreshBankAccountResponse, string> = res;
            data.request = '';
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<RefreshBankAccountResponse, string>(e, '')));
    }

    public ReconnectBankAccount(loginId: string): Observable<BaseResponse<RefreshBankAccountResponse, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + DASHBOARD_API.RECONNECT_BANK_ACCOUNT.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':loginId', loginId)).pipe(map((res) => {
            let data: BaseResponse<RefreshBankAccountResponse, string> = res;
            data.request = '';
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<RefreshBankAccountResponse, string>(e, '')));
    }

    public GetRationAnalysis(date: string, refresh): Observable<BaseResponse<BankAccountsResponse[], string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + DASHBOARD_API.RATIO_ANALYSIS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':date', date).replace(':refresh', refresh)).pipe(map((res) => {
            let data: BaseResponse<BankAccountsResponse[], string> = res;
            data.request = date;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<BankAccountsResponse[], string>(e, '')));
    }

    public GetRevenueGraphTypes(): Observable<BaseResponse<GraphTypesResponse, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + DASHBOARD_API.REVENUE_GRAPH_TYPES).pipe(map((res) => {
            let data: BaseResponse<GraphTypesResponse, string> = res;
            data.request = '';
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<GraphTypesResponse, string>(e, '')));
    }

    public GetRevenueGraphData(request: RevenueGraphDataRequest): Observable<BaseResponse<RevenueGraphDataResponse, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;

        let url = this.config.apiUrl + DASHBOARD_API.REVENUE_GRAPH_DATA;
        url = url.replace(":companyUniqueName", this.companyUniqueName);
        url = url.replace(":currentFrom", request.currentFrom);
        url = url.replace(":currentTo", request.currentTo);
        url = url.replace(":previousFrom", request.previousFrom);
        url = url.replace(":previousTo", request.previousTo);
        url = url.replace(":interval", request.interval);
        url = url.replace(":type", request.type);
        url = url.replace(":uniqueName", request.uniqueName);
        url = url.replace(":refresh", request.refresh);

        return this._http.get(url).pipe(map((res) => {
            let data: BaseResponse<RevenueGraphDataResponse, string> = res;
            data.request = '';
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<RevenueGraphDataResponse, string>(e, '')));
    }
}
