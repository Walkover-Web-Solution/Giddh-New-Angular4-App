import { map, catchError } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { HttpWrapperService } from "./httpWrapper.service";
import { Observable } from "rxjs";
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { CUSTOM_FIELDS } from './apiurls/custom-fields.api';

@Injectable()
export class CustomFieldsService {
    constructor(private errorHandler: GiddhErrorHandler, private http: HttpWrapperService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {

    }

    /**
     * Get all custom fields
     *
     * @param {*} request
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof CommandKService
     */
    public getAll(request: any): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + CUSTOM_FIELDS.GET_ALL;
        url = url.replace(':companyUniqueName', request.companyUniqueName);
        url = url.replace(':moduleUniqueName', request.moduleUniqueName);
        url = url.replace(':page', request.page);
        url = url.replace(':count', request.count);
        return this.http.get(url).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e, request)));
    }
}
