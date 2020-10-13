import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpWrapperService } from './httpWrapper.service';
import { Inject, Injectable, Optional } from '@angular/core';
import { UserDetails } from '../models/api-models/loginModels';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { SmsKeyClass } from '../models/api-models/SettingsIntegraion';
import { SETTINGS_PROFILE_API } from './apiurls/settings.profile.api';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';

@Injectable()
export class SettingsProfileService {

    private user: UserDetails;
    private companyUniqueName: string;

    constructor(private errorHandler: GiddhErrorHandler, private _http: HttpWrapperService,
        private _generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    /*
    * Get company profile
    */
    public GetProfileInfo(): Observable<BaseResponse<SmsKeyClass, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + SETTINGS_PROFILE_API.GET.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<SmsKeyClass, string> = res;
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<SmsKeyClass, string>(e)));
    }

    /**
     * Update company profile
     */
    public UpdateProfile(model): Observable<BaseResponse<any, any>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.put(this.config.apiUrl + SETTINGS_PROFILE_API.GET.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
    }

    /**
     * Patch company profile
     */
    public PatchProfile(model): Observable<BaseResponse<any, any>> {
        this.user = this._generalService.user;
        this.companyUniqueName = (model.moveCompany) ? model.moveCompany : this._generalService.companyUniqueName;
        const contextPath = (model.callNewPlanApi) ? SETTINGS_PROFILE_API.UPDATE_COMPANY_PLAN : SETTINGS_PROFILE_API.GET;
        return this._http.patch(this.config.apiUrl + contextPath.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
    }

    /**
     * Get Company Inventory Settings
     */
    public GetInventoryInfo(): Observable<BaseResponse<SmsKeyClass, string>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + SETTINGS_PROFILE_API.GET.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)) + '/settings').pipe(map((res) => {
            let data: BaseResponse<SmsKeyClass, string> = res;
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<SmsKeyClass, string>(e)));
    }

    /**
     * Update company profile
     */
    public UpdateInventory(model): Observable<BaseResponse<any, any>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.put(this.config.apiUrl + SETTINGS_PROFILE_API.GET.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)) + '/settings', model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
    }

    /**
     * Retrieves the branch info
     *
     * @returns {Observable<BaseResponse<any, any>>} Observable to carry out further operations
     * @memberof SettingsProfileService
     */
    public getBranchInfo(): Observable<BaseResponse<any, any>> {
        const companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + SETTINGS_PROFILE_API.GET_BRANCH_INFO.replace(':companyUniqueName', encodeURIComponent(companyUniqueName)))
            .pipe(catchError((error) => this.errorHandler.HandleCatch<any, any>(error)));
    }

    /**
     * Retrieves all the addresses of a company
     *
     * @returns {Observable<BaseResponse<any, any>>} Observable to carry out further operations
     * @memberof SettingsProfileService
     */
    public getCompanyAddresses(method: string, params?: any): Observable<BaseResponse<any, any>> {
        const companyUniqueName = this._generalService.companyUniqueName;
        let contextPath = `${this.config.apiUrl}${SETTINGS_PROFILE_API.GET_COMPANY_ADDRESSES}`
            .replace(':companyUniqueName', encodeURIComponent(companyUniqueName));
        if (method === 'GET') {
            if (params) {
                Object.keys(params).forEach((key, index) => {
                    const delimiter = index === 0 ? '?' : '&'
                    if (params[key]) {
                        contextPath += `${delimiter}${key}=${params[key]}`
                    }
                });
            }
            return this._http.get(contextPath).pipe(catchError((error) => this.errorHandler.HandleCatch<any, any>(error)));
        } else if (method === 'POST') {
            contextPath = contextPath.concat(`?page=${[params.page]}`);
            return this._http.post(contextPath, params).pipe(catchError((error) => this.errorHandler.HandleCatch<any, any>(error)));
        }
    }
}
