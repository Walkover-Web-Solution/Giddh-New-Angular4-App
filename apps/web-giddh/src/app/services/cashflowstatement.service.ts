import { map, catchError } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { Report } from './apiurls/cashflowstatement.api';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { HttpWrapperService } from "./http-wrapper.service";
import { Observable } from "rxjs";
import { GiddhErrorHandler } from './catchManager/catchmanger';

@Injectable()
export class CashFlowStatementService {
    constructor(private errorHandler: GiddhErrorHandler, private http: HttpWrapperService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {

    }

    /**
     * This will call the api to download the cash flow statement for the company based on from/to dates
     *
     * @param {*} request
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof CashFlowStatementService
     */
    public downloadReport(request: any): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + Report;
        url = url?.replace(':companyUniqueName', request.companyUniqueName);
        url = url?.replace(':from', request.from);
        url = url?.replace(':to', request.to);
        return this.http.get(url).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e, request)));
    }
}
