import { map, catchError } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { HttpWrapperService } from "./httpWrapper.service";
import { Observable } from "rxjs";
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { CUSTOM_FIELDS } from './apiurls/custom-fields.api';
import { GeneralService } from './general.service';

@Injectable()
export class CustomFieldsService {
    constructor(private errorHandler: GiddhErrorHandler, private http: HttpWrapperService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs, private generalService: GeneralService) {

    }

    /**
     * Get all custom fields
     *
     * @param {*} request
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof CustomFieldsService
     */
    public list(request: any): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + CUSTOM_FIELDS.GET_ALL;
        url = url.replace(':companyUniqueName', this.generalService.companyUniqueName);
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

    /**
     * Creates custom fields
     *
     * @param {*} request
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof CustomFieldsService
     */
    public create(request: any): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + CUSTOM_FIELDS.CREATE;
        url = url.replace(':companyUniqueName', this.generalService.companyUniqueName);
        return this.http.post(url, request).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e, request)));
    }

    /**
     * Deletes the custom field
     *
     * @param {string} customFieldUniqueName
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof CustomFieldsService
     */
    public delete(customFieldUniqueName: string): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + CUSTOM_FIELDS.DELETE;
        url = url.replace(':companyUniqueName', this.generalService.companyUniqueName);
        url = url.replace(':customFieldUniqueName', customFieldUniqueName);
        return this.http.delete(url).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e, customFieldUniqueName)));
    }

    /**
     * Updates custom field
     *
     * @param {*} request
     * @param {string} customFieldUniqueName
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof CustomFieldsService
     */
    public update(request: any, customFieldUniqueName: string): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + CUSTOM_FIELDS.UPDATE;
        url = url.replace(':companyUniqueName', this.generalService.companyUniqueName);
        url = url.replace(':customFieldUniqueName', customFieldUniqueName);
        return this.http.patch(url, request).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e, request)));
    }

    /**
     * Get custom field
     *
     * @param {string} customFieldUniqueName
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof CustomFieldsService
     */
    public get(customFieldUniqueName: string): Observable<BaseResponse<any, any>> {
        let url = this.config.apiUrl + CUSTOM_FIELDS.GET;
        url = url.replace(':companyUniqueName', this.generalService.companyUniqueName);
        url = url.replace(':customFieldUniqueName', customFieldUniqueName);
        return this.http.get(url).pipe(
            map((res) => {
                let data: BaseResponse<any, any> = res;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, any>(e, customFieldUniqueName)));
    }
}
