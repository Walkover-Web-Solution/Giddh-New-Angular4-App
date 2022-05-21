import { catchError, map } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { HttpWrapperService } from './httpWrapper.service';
import { Observable } from 'rxjs';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { ACTIVITY_LOGS_API } from './apiurls/activity-logs.api';
import { LogsRequest, LogsResponse, GetAuditLogsRequest, AuditLogsResponse } from '../models/api-models/Logs';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';

@Injectable()
export class ActivityLogsService {
    private companyUniqueName: string;

    constructor(private errorHandler: GiddhErrorHandler, public http: HttpWrapperService,
        private generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    /**
     * get transactions
     */
    public GetActivityLogs(model: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + ACTIVITY_LOGS_API.GET_ACTIVITY_LOGS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = model;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
    }

    /**
    * API call to get selected filters operations
    *
    * @returns {Observable<BaseResponse<LogsResponse, LogsRequest>>} Observable of service call to carry out further operations
    * @memberof LogsService
    */
    // public getAuditLogFormFilters(): Observable<BaseResponse<any, any>> {
    //     return this.http.get(`${this.config.apiUrl}${ACTIVITY_LOGS.GET_AUDIT_LOG_FORM_FILTERS}`).pipe(
    //         catchError((error) => this.errorHandler.HandleCatch<any, any>(error)));
    // }

    /**
     * API call to get audit log
     *
     * @param {LogsRequest} model Request model
     * @returns {Observable<BaseResponse<any, GetAuditLogsRequest>>}
     * @memberof LogsService
     */
    // public getAuditLogs(model: GetAuditLogsRequest): Observable<BaseResponse<AuditLogsResponse, GetAuditLogsRequest>> {
    //     this.companyUniqueName = this.generalService.companyUniqueName;
    //     return this.http.post(this.config.apiUrl + ACTIVITY_LOGS.GET_AUDIT_LOGS_V2.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(
    //         map((res) => {
    //             let data: BaseResponse<AuditLogsResponse, GetAuditLogsRequest> = res;
    //             data.request = model;
    //             return data;
    //         }),
    //         catchError((e) => this.errorHandler.HandleCatch<AuditLogsResponse, GetAuditLogsRequest>(e, model)));
    // }

}
