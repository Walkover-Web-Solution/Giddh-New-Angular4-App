import { catchError, map } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { REVERSECHARGE_API } from './apiurls/reversecharge.api';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { ReverseChargeReportGetRequest, ReverseChargeReportPostRequest } from '../models/api-models/ReverseCharge';
import { GiddhErrorHandler } from "./catchManager/catchmanger";
import { HttpWrapperService } from "./http-wrapper.service";
import { Observable } from "rxjs";

@Injectable()
export class ReverseChargeService {
    constructor(private errorHandler: GiddhErrorHandler, private http: HttpWrapperService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {

    }

    public getReverseChargeReport(companyUniqueName: any, requestGet: ReverseChargeReportGetRequest, requestPost: ReverseChargeReportPostRequest): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + REVERSECHARGE_API.VIEW_REPORT;
        url = url?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName));
        url = url?.replace(':from', requestGet.from);
        url = url?.replace(':to', requestGet.to);
        url = url?.replace(':sort', requestGet.sort);
        url = url?.replace(':sortBy', requestGet.sortBy);
        url = url?.replace(':page', requestGet.page);
        url = url?.replace(':count', requestGet.count);
        if (requestGet.branchUniqueName) {
            url = url.concat(`&branchUniqueName=${requestGet.branchUniqueName !== companyUniqueName ? requestGet.branchUniqueName : ''}`);
        }
        return this.http.post(url, requestPost).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, requestGet)));
    }
}
