import { catchError, map } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';

import { HttpWrapperService } from './httpWrapper.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { UserDetails } from '../models/api-models/loginModels';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { LOGS_API } from './apiurls/logs.api';
import { LogsRequest, LogsResponse } from '../models/api-models/Logs';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';

@Injectable()
export class LogsService {
    private companyUniqueName: string;
    private user: UserDetails;

    constructor(private errorHandler: GiddhErrorHandler, public _http: HttpWrapperService, public _router: Router,
        private _generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    /**
     * get transactions
     */
    public GetAuditLogs(model: LogsRequest, page: number = 1): Observable<BaseResponse<LogsResponse, LogsRequest>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(this.config.apiUrl + LOGS_API.AUDIT_LOGS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':page', page.toString()), model).pipe(
            map((res) => {
                let data: BaseResponse<LogsResponse, LogsRequest> = res;
                data.request = model;
                data.queryString = { page };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<LogsResponse, LogsRequest>(e, model, { page })));
    }

    /**
     * Returns the observable of get filters service call to carry out further operations
     *
     * @returns {Observable<BaseResponse<LogsResponse, LogsRequest>>} Observable of service call to carry out further operations
     * @memberof LogsService
     */
    public getFilters(): Observable<BaseResponse<LogsResponse, LogsRequest>> {
        return this._http.get(`${this.config.apiUrl}${LOGS_API.GET_FILTERS}`, {}).pipe(
            catchError((error) => this.errorHandler.HandleCatch<LogsResponse, LogsRequest>(error)));
    }

    /**
    * API call to get selected filters operations
    *
    * @returns {Observable<BaseResponse<LogsResponse, LogsRequest>>} Observable of service call to carry out further operations
    * @memberof LogsService
    */
    public getAuditLogFormFilters(): Observable<BaseResponse<any, any>> {
        return this._http.get(`${this.config.apiUrl}${LOGS_API.GET_AUDIT_LOG_FORM_FILTERS}`).pipe(
            catchError((error) => this.errorHandler.HandleCatch<any, any>(error)));
    }
}
