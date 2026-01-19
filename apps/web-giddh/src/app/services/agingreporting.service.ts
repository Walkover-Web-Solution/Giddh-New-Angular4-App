import { catchError, map } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { HttpWrapperService } from './http-wrapper.service';
import { DueAmountReportQueryRequest, DueAmountReportRequest, DueAmountReportResponse, DueRangeRequest } from '../models/api-models/Contact';
import { empty, Observable } from 'rxjs';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { AGINGREPORT_API, DUEAMOUNTREPORT_API_V2, DUEDAYSRANGE_API_V2 } from './apiurls/aging-reporting';
import { GeneralService } from './general.service';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { concat, get } from '../lodash-optimized';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * AgingreportingService service
 * Provides agingreporting related business logic and data operations
 */
export class AgingreportingService {
    private companyUniqueName: string;

    /**
     * Creates an instance of service
     * Initializes component dependencies and sets up initial state
     */
    constructor(private errorHandler: GiddhErrorHandler, private http: HttpWrapperService,
        private generalService: GeneralService,
        @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
        this.companyUniqueName = this.generalService.companyUniqueName;
    }

    /**
     * Handles CreateDueDaysRange functionality
     */
    public CreateDueDaysRange(model: DueRangeRequest): Observable<BaseResponse<string, DueRangeRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + DUEDAYSRANGE_API_V2.CREATE?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<string, DueRangeRequest> = res;
                data.request = model;
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<string, DueRangeRequest>(e, model, {})));
    }

    /**
     * Handles GetDueDaysRange functionality
     */
    public GetDueDaysRange(): Observable<BaseResponse<string[], string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + DUEDAYSRANGE_API_V2.CREATE?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<string[], string> = res;
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<string[], string>(e, null, {})));
    }

    /**
     * Handles GetDueAmountReport functionality
     */
    public GetDueAmountReport(model: DueAmountReportRequest, queryRequest: DueAmountReportQueryRequest, branchUniqueName: string): Observable<BaseResponse<DueAmountReportResponse, DueAmountReportRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + DUEAMOUNTREPORT_API_V2.GET?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':q', encodeURIComponent(queryRequest.q || ''))
            ?.replace(':page', encodeURIComponent(queryRequest.page?.toString()))
            ?.replace(':count', encodeURIComponent(queryRequest.count?.toString()))
            ?.replace(':sort', encodeURIComponent(queryRequest.sort?.toString()))
            ?.replace(':sortBy', encodeURIComponent(queryRequest.sortBy?.toString()))
            ?.replace(':rangeCol', encodeURIComponent(queryRequest.rangeCol ? queryRequest.rangeCol?.toString() : ''));
        /**
         * Handles if functionality
         */
        if (branchUniqueName) {
            branchUniqueName = branchUniqueName !== this.companyUniqueName ? branchUniqueName : '';
            url = url.concat(`&branchUniqueName=${branchUniqueName}`);
        }
        /**
         * Handles if functionality
         */
        if (this.companyUniqueName) {
            return this.http.post(url, model).pipe(
                /**
                 * Handles map functionality
                 */
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

    /**
     * This will be use for export aging report
     *
     * @param {*} model
     * @return {*}  {Observable<BaseResponse<string, any>>}
     * @memberof AgingreportingService
     */
    public exportAgingReport(model: any, branchUniqueName: string): Observable<BaseResponse<string, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + AGINGREPORT_API.EXPORT?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName));
        /**
         * Handles if functionality
         */
        if (branchUniqueName) {
            url = url.concat(`?branchUniqueName=${branchUniqueName}`);
        }
        return this.http.post(url, model).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<string, any> = res;
                data.request = model;
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<string, any>(e, model, {})));
    }
}
