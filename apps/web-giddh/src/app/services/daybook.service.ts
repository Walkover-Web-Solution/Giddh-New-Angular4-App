import { catchError, map } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { HttpWrapperService } from './http-wrapper.service';
import { Observable } from 'rxjs';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from '../services/service.config';
import { DaybookQueryRequest, DayBookRequestModel } from '../models/api-models/DaybookRequest';
import { DayBookResponseModel } from '../models/api-models/Daybook';
import { DAYBOOK_SEARCH_API } from './apiurls/daybook.api';
import { concat, get } from '../lodash-optimized';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * DaybookService service
 * Provides daybook related business logic and data operations
 */
export class DaybookService {
    private companyUniqueName: string;

    /**
     * Creates an instance of service
     * Initializes component dependencies and sets up initial state
     */
    constructor(private errorHandler: GiddhErrorHandler, public http: HttpWrapperService,
        private generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    /**
     * Handles GetDaybook functionality
     */
    public GetDaybook(request: DayBookRequestModel, queryRequest: DaybookQueryRequest): Observable<BaseResponse<DayBookResponseModel, DayBookRequestModel>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + DAYBOOK_SEARCH_API.SEARCH
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':page', queryRequest.page?.toString())
            ?.replace(':count', queryRequest.count?.toString())
            ?.replace(':from', encodeURIComponent(queryRequest.from))
            ?.replace(':to', encodeURIComponent(queryRequest.to));
        url = url.concat(`&branchUniqueName=${queryRequest.branchUniqueName !== this.companyUniqueName ? encodeURIComponent(queryRequest.branchUniqueName) : ''}`);
        return this.http.post(url, request).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<DayBookResponseModel, DayBookRequestModel> = res;
                data.request = request;
                data.queryString = queryRequest;
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<DayBookResponseModel, DayBookRequestModel>(e, request, queryRequest)));
    }

    /**
     * Handles ExportDaybook functionality
     */
    public ExportDaybook(request: DayBookRequestModel, queryRequest: DaybookQueryRequest): Observable<BaseResponse<DayBookResponseModel, DayBookRequestModel>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + DAYBOOK_SEARCH_API.EXPORT
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':page', queryRequest.page?.toString())
            ?.replace(':count', queryRequest.count?.toString())
            ?.replace(':from', encodeURIComponent(queryRequest.from))
            ?.replace(':to', encodeURIComponent(queryRequest.to))
            ?.replace(':format', queryRequest.format?.toString())
            ?.replace(':type', queryRequest.type?.toString())
            ?.replace(':sort', queryRequest.sort?.toString());
        /**
         * Handles if functionality
         */
        if (queryRequest.branchUniqueName) {
            queryRequest.branchUniqueName = queryRequest.branchUniqueName !== this.companyUniqueName ? queryRequest.branchUniqueName : '';
            url = url.concat(`&branchUniqueName=${queryRequest.branchUniqueName}`);
        }
        return this.http.get(url).pipe(
            /**
             * Handles map functionality
             */
            map((res) => {
                let data: BaseResponse<DayBookResponseModel, DayBookRequestModel> = res;
                data.queryString = queryRequest;
                data.queryString.requestType = queryRequest.format === 'pdf' ? 'application/pdf' : 'application/vnd.ms-excel';
                return data;
            }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<DayBookResponseModel, DayBookRequestModel>(e, request)));
    }

    /**
     * Handles ExportDaybookPost functionality
     */
    public ExportDaybookPost(request: DayBookRequestModel, queryRequest: DaybookQueryRequest): Observable<BaseResponse<DayBookResponseModel, DayBookRequestModel>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + DAYBOOK_SEARCH_API.EXPORT
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':page', queryRequest.page?.toString())
            ?.replace(':count', queryRequest.count?.toString())
            ?.replace(':from', encodeURIComponent(queryRequest.from))
            ?.replace(':to', encodeURIComponent(queryRequest.to))
            ?.replace(':format', queryRequest.format?.toString())
            ?.replace(':type', queryRequest.type?.toString())
            ?.replace(':sort', queryRequest.sort?.toString());
        /**
         * Handles if functionality
         */
        if (queryRequest.branchUniqueName) {
            queryRequest.branchUniqueName = queryRequest.branchUniqueName !== this.companyUniqueName ? queryRequest.branchUniqueName : '';
            url = url.concat(`&branchUniqueName=${queryRequest.branchUniqueName}`);
        }
        return this.http.post(url, request).pipe(map((res) => {
            let data: BaseResponse<DayBookResponseModel, DayBookRequestModel> = res;
            data.request = request;
            data.queryString = queryRequest;
            data.queryString.requestType = queryRequest.format === 'pdf' ? 'application/pdf' : 'application/vnd.ms-excel';
            return data;
        }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<DayBookResponseModel, DayBookRequestModel>(e, request)));
    }

    /**
     * For Export Daybook expanded
     * @param request 
     * @param branchUniqueName 
     * @memberof DaybookService 
     */
    public exportDaybookExpandedPost(request: any, branchUniqueName: string): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + DAYBOOK_SEARCH_API.ENTRIES_EXPORT
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':output', request.fileType?.toString());
        /**
         * Handles if functionality
         */
        if (branchUniqueName) {
            branchUniqueName = branchUniqueName !== this.companyUniqueName ? branchUniqueName : '';
            url = url.concat(`&branchUniqueName=${branchUniqueName}`);
        }
        let reqObj = request;
        delete request.fileType;
        return this.http.post(url, request).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.queryString = request;
            data.request = reqObj;
            return data;
        }),
            /**
             * Handles catchError functionality
             */
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e, request)));
    }
}
