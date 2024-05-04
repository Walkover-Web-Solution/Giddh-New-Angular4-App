import { Optional, Inject, Injectable } from '@angular/core';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { HttpWrapperService } from './http-wrapper.service';
import { ServiceConfig, IServiceConfigArgs } from './service.config';
import { GeneralService } from './general.service';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { catchError, map } from 'rxjs/operators';
import { DOWNLOADS_API } from './apiurls/download.api';
import { Observable } from 'rxjs';
import { DownloadsRequest, DownloadsResponse } from '../models/api-models/downloads';

@Injectable()
export class DownloadsService {

    /** This will hold the company uniquename */
    private companyUniqueName: string;

    constructor(private errorHandler: GiddhErrorHandler, private http: HttpWrapperService,
        private generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    /**
     * This will use for get downloads data
     *
     * @param {DownloadsRequest} downloadsRequest
     * @return {*}  {Observable<BaseResponse<DownloadsResponse, DownloadsRequest>>}
     * @memberof DownloadsService
     */
    public getDownloads(downloadsRequest: DownloadsRequest): Observable<BaseResponse<DownloadsResponse, DownloadsRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + DOWNLOADS_API.DOWNLOADS?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':from', encodeURIComponent(downloadsRequest.from))
            ?.replace(':to', encodeURIComponent(downloadsRequest.to))
            ?.replace(':count', encodeURIComponent(downloadsRequest.count))
            ?.replace(':page', encodeURIComponent(downloadsRequest.page))).pipe(
                map((res) => {
                    let data: BaseResponse<DownloadsResponse, DownloadsRequest> = res;
                    data.request = downloadsRequest;
                    data.queryString = {
                        from: downloadsRequest.from,
                        to: downloadsRequest.to,
                        count: downloadsRequest.count,
                        page: downloadsRequest.page
                    };
                    return data;
                }), catchError((e) => this.errorHandler.HandleCatch<DownloadsResponse, DownloadsRequest>(e, downloadsRequest, {
                    from: downloadsRequest.from,
                    to: downloadsRequest.to,
                    count: downloadsRequest.count,
                    page: downloadsRequest.page
                })));
    }
}
