import { catchError, map } from 'rxjs/operators';
import { Inject, Injectable, OnInit, Optional } from '@angular/core';
import { HttpWrapperService } from './httpWrapper.service';
import { DueAmountReportQueryRequest, DueAmountReportRequest, DueAmountReportResponse, DueRangeRequest } from '../models/api-models/Contact';
import { empty, Observable } from 'rxjs';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { DUEAMOUNTREPORT_API_V2, DUEDAYSRANGE_API_V2 } from './apiurls/aging-reporting';
import { GeneralService } from './general.service';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';

@Injectable()
export class AgingreportingService implements OnInit {
    private companyUniqueName: string;

    constructor(private errorHandler: GiddhErrorHandler, private _http: HttpWrapperService,
        private _generalService: GeneralService,
        @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
        this.companyUniqueName = this._generalService.companyUniqueName;
    }

    public ngOnInit() {
        //
    }

    public CreateDueDaysRange(model: DueRangeRequest): Observable<BaseResponse<string, DueRangeRequest>> {
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(this.config.apiUrl + DUEDAYSRANGE_API_V2.CREATE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(
            map((res) => {
                let data: BaseResponse<string, DueRangeRequest> = res;
                data.request = model;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<string, DueRangeRequest>(e, model, {})));
    }

    public GetDueDaysRange(): Observable<BaseResponse<string[], string>> {
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + DUEDAYSRANGE_API_V2.CREATE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(
            map((res) => {
                let data: BaseResponse<string[], string> = res;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<string[], string>(e, null, {})));
    }

    public GetDueAmountReport(model: DueAmountReportRequest, queryRequest: DueAmountReportQueryRequest): Observable<BaseResponse<DueAmountReportResponse, DueAmountReportRequest>> {
        this.companyUniqueName = this._generalService.companyUniqueName;
        if (this.companyUniqueName) {
            return this._http.post(
                this.config.apiUrl + DUEAMOUNTREPORT_API_V2.GET.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
                    .replace(':q', encodeURIComponent(queryRequest.q || ''))
                    .replace(':page', encodeURIComponent(queryRequest.page.toString()))
                    .replace(':count', encodeURIComponent(queryRequest.count.toString()))
                    .replace(':sort', encodeURIComponent(queryRequest.sort.toString()))
                    .replace(':sortBy', encodeURIComponent(queryRequest.sortBy.toString()))
                    .replace(':fromDate', encodeURIComponent(queryRequest.from))
                    .replace(':toDate', encodeURIComponent(queryRequest.to))
                    .replace(':rangeCol', encodeURIComponent(queryRequest.rangeCol ? queryRequest.rangeCol.toString() : ''))
                , model).pipe(
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
