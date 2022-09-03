import { Optional, Inject, Injectable } from '@angular/core';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { HttpWrapperService } from './httpWrapper.service';
import { ServiceConfig, IServiceConfigArgs } from './service.config';
import { GeneralService } from './general.service';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ImportsRequest, ImportsResponse } from '../models/api-models/imports';
import { IMPORTS_API } from './apiurls/imports.api';

@Injectable()
export class ImportsService {

    /** This will hold the company uniquename */
    private companyUniqueName: string;

    constructor(private errorHandler: GiddhErrorHandler, private http: HttpWrapperService,
        private generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }


    public getImports(importsRequest: ImportsRequest): Observable<BaseResponse<ImportsResponse, ImportsRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + IMPORTS_API.IMPORTS;
        if (importsRequest.branchUniqueName) {
            importsRequest.branchUniqueName = importsRequest.branchUniqueName !== this.companyUniqueName ? importsRequest.branchUniqueName : '';
            url = url.concat(`&branchUniqueName=${importsRequest.branchUniqueName}`);
        }
        return this.http.get(url.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            .replace(':from', encodeURIComponent(importsRequest.from))
            .replace(':to', encodeURIComponent(importsRequest.to))
            .replace(':count', encodeURIComponent(importsRequest.count))
            .replace(':page', encodeURIComponent(importsRequest.page))).pipe(
                map((res) => {
                    let data: BaseResponse<ImportsResponse, ImportsRequest> = res;
                    data.request = importsRequest;
                    data.queryString = {
                        from: importsRequest.from,
                        to: importsRequest.to,
                        count: importsRequest.count,
                        page: importsRequest.page
                    };
                    return data;
                }), catchError((e) => this.errorHandler.HandleCatch<ImportsResponse, ImportsRequest>(e, importsRequest, {
                    from: importsRequest.from,
                    to: importsRequest.to,
                    count: importsRequest.count,
                    page: importsRequest.page
                })));
    }
}
