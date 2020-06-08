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
}
