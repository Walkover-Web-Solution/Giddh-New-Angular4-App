import { Inject, Injectable, Optional } from '@angular/core';
import { HttpWrapperService } from './http-wrapper.service';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { SEARCH_API } from './apiurls/search.api';
import { SearchRequest, SearchResponse } from '../models/api-models/Search';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';

@Injectable()
export class SearchService {
    private companyUniqueName: string;

    constructor(private errorHandler: GiddhErrorHandler, public http: HttpWrapperService,
        private generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    /**
     * get GetStocksReport
     */
    public Search(reqPayload: { request: SearchRequest, searchReqBody: any }): Observable<BaseResponse<SearchResponse[], SearchRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        const request = reqPayload.request;
        let url = this.config.apiUrl + SEARCH_API.SEARCH
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':groupName', encodeURIComponent(request.groupName))
            ?.replace(':count', encodeURIComponent('15'))
            ?.replace(':from', encodeURIComponent(request.fromDate))
            ?.replace(':to', encodeURIComponent(request.toDate))
            ?.replace(':refresh', String(request.refresh))
            ?.replace(':page', String(request.page));
        if (request.branchUniqueName) {
            request.branchUniqueName = request.branchUniqueName !== this.companyUniqueName ? request.branchUniqueName : '';
            url = url.concat(`&branchUniqueName=${encodeURIComponent(request.branchUniqueName)}`);
        }
        return this.http.post(url,
            reqPayload.searchReqBody)
            .pipe(map((res) => {
                res.body.groupName = request.groupName;
                res.body.page = request.page;
                return res;
            }),
                catchError((e) => this.errorHandler.HandleCatch<SearchResponse[], SearchRequest>(e)));
    }

    /**
     * Searches account
     *
     * @param {*} params Request payload for API call
     * @returns {Observable<any>} Observable to carry out further operations
     * @memberof SearchService
     */
    public searchAccount(params: any): Observable<any> {
        const companyUniqueName = this.generalService.companyUniqueName;
        let contextPath = `${this.config.apiUrl}${SEARCH_API.ACCOUNT_SEARCH}`?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName)).replace(':version/', String(this.generalService.voucherApiVersion === 1 ? '' : 'v3/'));
        if (params) {
            Object.keys(params).forEach((key, index) => {
                const delimiter = index === 0 ? '?' : '&'
                if (params[key] !== undefined) {
                    if (key === 'branchUniqueName') {
                        params[key] = params[key] === companyUniqueName ? '' : params[key];
                    }
                    contextPath += `${delimiter}${key}=${params[key]}`
                }
            });
        }
        return this.http.get(contextPath)
            .pipe(catchError((error) => this.errorHandler.HandleCatch<SearchResponse[], SearchRequest>(error)));
    }

    /**
     * Searches accounts v2
     *
     * @param {*} params Request payload for API call
     * @returns {Observable<any>} Observable to carry out further operations
     * @memberof SearchService
     */
    public searchAccountV2(params: any): Observable<any> {
        const companyUniqueName = this.generalService.companyUniqueName;
        let contextPath = `${this.config.apiUrl}${SEARCH_API.ACCOUNT_SEARCH_V2}`?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName));
        if (params) {
            Object.keys(params).forEach((key, index) => {
                const delimiter = index === 0 ? '?' : '&'
                if (params[key] !== undefined) {
                    if (key === 'branchUniqueName') {
                        params[key] = params[key] === companyUniqueName ? '' : params[key];
                    }
                    contextPath += `${delimiter}${key}=${params[key]}`
                }
            });
        }
        return this.http.get(contextPath)
            .pipe(catchError((error) => this.errorHandler.HandleCatch<SearchResponse[], SearchRequest>(error)));
    }

    /**
     * Loads the detail of the searched item
     *
     * @param {string} uniqueName Unique name of searched item
     * @param {*} [params] Request payload
     * @returns {Observable<any>} Observable to carry out further operation
     * @memberof SearchService
     */
    public loadDetails(uniqueName: string, params?: any): Observable<any> {
        const companyUniqueName = this.generalService.companyUniqueName;
        let contextPath = `${this.config.apiUrl}${SEARCH_API.ACCOUNT_DETAIL}`
            ?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName))
            ?.replace(':accountUniqueName', encodeURIComponent(uniqueName))
            ?.replace(':version', this.generalService.voucherApiVersion === 1 ? 'v2' : 'v3');
        if (params) {
            Object.keys(params).forEach((key, index) => {
                const delimiter = index === 0 ? '?' : '&';
                if (key === 'branchUniqueName') {
                    params[key] = params[key] === companyUniqueName ? '' : params[key];
                }
                contextPath += `${delimiter}${key}=${params[key]}`
            });
        }

        return this.http.get(contextPath)
            .pipe(catchError((error) => this.errorHandler.HandleCatch<SearchResponse[], SearchRequest>(error)));
    }

    /**
     * Searches account
     *
     * @param {*} params Request payload for API call
     * @returns {Observable<any>} Observable to carry out further operations
     * @memberof SearchService
     */
    public searchAccountV3(params: any): Observable<any> {
        const companyUniqueName = this.generalService.companyUniqueName;
        let contextPath = `${this.config.apiUrl}${SEARCH_API.ACCOUNT_SEARCH_V3}`?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName));
        if (params) {
            Object.keys(params).forEach((key, index) => {
                const delimiter = index === 0 ? '?' : '&'
                if (params[key] !== undefined) {
                    if (key === 'branchUniqueName') {
                        params[key] = params[key] === companyUniqueName ? '' : params[key];
                    }
                    contextPath += `${delimiter}${key}=${params[key]}`
                }
            });
        }
        return this.http.get(contextPath)
            .pipe(catchError((error) => this.errorHandler.HandleCatch<SearchResponse[], SearchRequest>(error)));
    }
}
