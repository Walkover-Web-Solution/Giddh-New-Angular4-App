import { catchError, map } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';

import { HttpWrapperService } from './httpWrapper.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { UserDetails } from '../models/api-models/loginModels';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from '../services/service.config';
import { DaybookQueryRequest, DayBookRequestModel } from '../models/api-models/DaybookRequest';
import { DayBookResponseModel } from '../models/api-models/Daybook';
import { DAYBOOK_SEARCH_API } from './apiurls/daybook.api';

@Injectable()
export class DaybookService {
    private companyUniqueName: string;
    private user: UserDetails;

    constructor(private errorHandler: GiddhErrorHandler, public _http: HttpWrapperService, public _router: Router,
        private _generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    public GetDaybook(request: DayBookRequestModel, queryRequest: DaybookQueryRequest): Observable<BaseResponse<DayBookResponseModel, DayBookRequestModel>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(this.config.apiUrl + DAYBOOK_SEARCH_API.SEARCH
            .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            .replace(':page', queryRequest.page.toString())
            .replace(':count', queryRequest.count.toString())
            .replace(':from', encodeURIComponent(queryRequest.from))
            .replace(':to', encodeURIComponent(queryRequest.to)), request).pipe(
                map((res) => {
                    let data: BaseResponse<DayBookResponseModel, DayBookRequestModel> = res;
                    data.request = request;
                    data.queryString = queryRequest;
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<DayBookResponseModel, DayBookRequestModel>(e, request, queryRequest)));
    }

    public ExportDaybook(request: DayBookRequestModel, queryRequest: DaybookQueryRequest): Observable<BaseResponse<DayBookResponseModel, DayBookRequestModel>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + DAYBOOK_SEARCH_API.EXPORT
            .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            .replace(':page', queryRequest.page.toString())
            .replace(':count', queryRequest.count.toString())
            .replace(':from', encodeURIComponent(queryRequest.from))
            .replace(':to', encodeURIComponent(queryRequest.to))
            .replace(':format', queryRequest.format.toString())
            .replace(':type', queryRequest.type.toString())
            .replace(':sort', queryRequest.sort.toString())).pipe(
                map((res) => {
                    let data: BaseResponse<DayBookResponseModel, DayBookRequestModel> = res;
                    data.queryString = queryRequest;
                    data.queryString.requestType = queryRequest.format === 'pdf' ? 'application/pdf' : 'application/vnd.ms-excel';
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<DayBookResponseModel, DayBookRequestModel>(e, request)));
    }

    public ExportDaybookPost(request: DayBookRequestModel, queryRequest: DaybookQueryRequest): Observable<BaseResponse<DayBookResponseModel, DayBookRequestModel>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(this.config.apiUrl + DAYBOOK_SEARCH_API.EXPORT
            .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            .replace(':page', queryRequest.page.toString())
            .replace(':count', queryRequest.count.toString())
            .replace(':from', encodeURIComponent(queryRequest.from))
            .replace(':to', encodeURIComponent(queryRequest.to))
            .replace(':format', queryRequest.format.toString())
            .replace(':type', queryRequest.type.toString())
            .replace(':sort', queryRequest.sort.toString()), request).pipe(
                map((res) => {
                    let data: BaseResponse<DayBookResponseModel, DayBookRequestModel> = res;
                    data.request = request;
                    data.queryString = queryRequest;
                    data.queryString.requestType = queryRequest.format === 'pdf' ? 'application/pdf' : 'application/vnd.ms-excel';
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<DayBookResponseModel, DayBookRequestModel>(e, request)));
    }
}
