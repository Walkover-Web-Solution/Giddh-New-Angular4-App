import { catchError, map } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpWrapperService } from './httpWrapper.service';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { DASHBOARD_API } from './apiurls/dashboard.api';
import {
    BankAccountsResponse,
    ClosingBalanceResponse,
    GraphTypesResponse,
    RevenueGraphDataRequest,
    RevenueGraphDataResponse
} from '../models/api-models/Dashboard';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';

@Injectable()
export class DashboardService {
    private companyUniqueName: string;

    constructor(private errorHandler: GiddhErrorHandler, public http: HttpWrapperService, private generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    public getClosingBalance(groupUniqueName: string = '', fromDate: string = '', toDate: string = '', refresh: boolean = false): Observable<BaseResponse<ClosingBalanceResponse, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + DASHBOARD_API.CLOSING_BALANCE?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':fromDate', fromDate)?.replace(':toDate', toDate)?.replace(':groupUniqueName', encodeURIComponent(groupUniqueName))?.replace(':refresh', refresh?.toString())).pipe(map((res) => {
            let data: BaseResponse<ClosingBalanceResponse, string> = res;
            data.queryString = { fromDate, toDate, groupUniqueName, refresh };
            data.request = '';
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<ClosingBalanceResponse, string>(e, '', { fromDate, toDate, groupUniqueName, refresh })));
    }

    public GetRationAnalysis(date: string, refresh): Observable<BaseResponse<BankAccountsResponse[], string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + DASHBOARD_API.RATIO_ANALYSIS?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':date', date)?.replace(':refresh', refresh)).pipe(map((res) => {
            let data: BaseResponse<BankAccountsResponse[], string> = res;
            data.request = date;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<BankAccountsResponse[], string>(e, '')));
    }

    public GetRevenueGraphTypes(): Observable<BaseResponse<GraphTypesResponse, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + DASHBOARD_API.REVENUE_GRAPH_TYPES).pipe(map((res) => {
            let data: BaseResponse<GraphTypesResponse, string> = res;
            data.request = '';
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<GraphTypesResponse, string>(e, '')));
    }

    public GetRevenueGraphData(request: RevenueGraphDataRequest): Observable<BaseResponse<RevenueGraphDataResponse, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;

        let url = this.config.apiUrl + DASHBOARD_API.REVENUE_GRAPH_DATA;
        url = url?.replace(":companyUniqueName", this.companyUniqueName);
        url = url?.replace(":currentFrom", request.currentFrom);
        url = url?.replace(":currentTo", request.currentTo);
        url = url?.replace(":previousFrom", request.previousFrom);
        url = url?.replace(":previousTo", request.previousTo);
        url = url?.replace(":interval", request.interval);
        url = url?.replace(":type", request.type);
        url = url?.replace(":uniqueName", request.uniqueName);
        url = url?.replace(":refresh", request.refresh);

        return this.http.get(url).pipe(map((res) => {
            let data: BaseResponse<RevenueGraphDataResponse, string> = res;
            data.request = '';
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<RevenueGraphDataResponse, string>(e, '')));
    }
}
