import { map, catchError } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { COMMON_API } from './apiurls/common.api';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { CommandKRequest } from '../models/api-models/Common';
import { HttpWrapperService } from "./http-wrapper.service";
import { Observable } from "rxjs";
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { get } from '../lodash-optimized';

@Injectable({
    providedIn: 'root'
})
export class CommandKService {
    constructor(private errorHandler: GiddhErrorHandler, private http: HttpWrapperService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {

    }

    public searchCommandK(request: CommandKRequest, companyUniqueName: string): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + COMMON_API.COMMAND_K;
        url = url?.replace(':companyUniqueName', encodeURIComponent(companyUniqueName));
        url = url?.replace(':page', request.page);
        url = url?.replace(':q', encodeURIComponent(request.q));
        url = url?.replace(':group', encodeURIComponent(request.group));
        url = url?.replace(':isMobile', encodeURIComponent(request.isMobile));
        return this.http.get(url).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e, request)));
    }
}
