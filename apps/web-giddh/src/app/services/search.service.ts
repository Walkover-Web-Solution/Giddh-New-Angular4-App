import { Inject, Injectable, Optional } from '@angular/core';

import { HttpWrapperService } from './httpWrapper.service';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { UserDetails } from '../models/api-models/loginModels';
import { SEARCH_API } from './apiurls/search.api';
import { SearchRequest, SearchResponse } from '../models/api-models/Search';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';

@Injectable()
export class SearchService {
    private companyUniqueName: string;
    private user: UserDetails;

    constructor(private errorHandler: GiddhErrorHandler, public _http: HttpWrapperService, public _router: Router,
        private _generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    /**
     * get GetStocksReport
     */
    public Search(reqPayload: { request: SearchRequest, searchReqBody: any }): Observable<BaseResponse<SearchResponse[], SearchRequest>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        const request = reqPayload.request;
        return this._http.post(this.config.apiUrl + SEARCH_API.SEARCH
            .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            .replace(':groupName', encodeURIComponent(request.groupName))
            .replace(':count', encodeURIComponent('15'))
            .replace(':from', encodeURIComponent(request.fromDate))
            .replace(':to', encodeURIComponent(request.toDate))
            .replace(':refresh', String(request.refresh))
            .replace(':page', String(request.page)),
            reqPayload.searchReqBody)
            .pipe(map((res) => {
                res.body.groupName = request.groupName;
                res.body.page = request.page;
                return res;
            }),
                catchError((e) => this.errorHandler.HandleCatch<SearchResponse[], SearchRequest>(e)));
    }

}
