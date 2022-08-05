import { catchError, map } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { HttpWrapperService } from './httpWrapper.service';
import { DueAmountReportQueryRequest, DueAmountReportRequest, DueAmountReportResponse, DueRangeRequest } from '../models/api-models/Contact';
import { empty, Observable } from 'rxjs';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { DUEAMOUNTREPORT_API_V2, DUEDAYSRANGE_API_V2 } from './apiurls/aging-reporting';
import { GeneralService } from './general.service';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';

@Injectable()
export class AgingreportingService {
    private companyUniqueName: string;

    constructor(private errorHandler: GiddhErrorHandler, private http: HttpWrapperService,
        private generalService: GeneralService,
        @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
        this.companyUniqueName = this.generalService.companyUniqueName;
    }

    public CreateDueDaysRange(model: DueRangeRequest): Observable<BaseResponse<string, DueRangeRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + DUEDAYSRANGE_API_V2.CREATE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(
            map((res) => {
                let data: BaseResponse<string, DueRangeRequest> = res;
                data.request = model;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<string, DueRangeRequest>(e, model, {})));
    }

    public GetDueDaysRange(): Observable<BaseResponse<string[], string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + DUEDAYSRANGE_API_V2.CREATE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(
            map((res) => {
                let data: BaseResponse<string[], string> = res;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<string[], string>(e, null, {})));
    }

    public GetDueAmountReport(model: DueAmountReportRequest, queryRequest: DueAmountReportQueryRequest, branchUniqueName: string): Observable<BaseResponse<DueAmountReportResponse, DueAmountReportRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + DUEAMOUNTREPORT_API_V2.GET.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            .replace(':q', encodeURIComponent(queryRequest.q || ''))
            .replace(':page', encodeURIComponent(queryRequest.page.toString()))
            .replace(':count', encodeURIComponent(queryRequest.count.toString()))
            .replace(':sort', encodeURIComponent(queryRequest.sort.toString()))
            .replace(':sortBy', encodeURIComponent(queryRequest.sortBy.toString()))
            .replace(':rangeCol', encodeURIComponent(queryRequest.rangeCol ? queryRequest.rangeCol.toString() : ''));
        if (branchUniqueName) {
            branchUniqueName = branchUniqueName !== this.companyUniqueName ? branchUniqueName : '';
            url = url.concat(`&branchUniqueName=${branchUniqueName}`);
        }
        if (this.companyUniqueName) {
            return this.http.post(url, model).pipe(
                map((res) => {
                    let data: BaseResponse<DueAmountReportResponse, DueAmountReportRequest> = res;
                    data.request = model;
                    data.queryString = queryRequest;
                    return data;
                }), catchError((e) => this.errorHandler.HandleCatch<DueAmountReportResponse, DueAmountReportRequest>(e, model, queryRequest)));
        } else {
            return empty();
        }
    }

}
