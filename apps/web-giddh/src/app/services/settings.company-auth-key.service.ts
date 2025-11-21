import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpWrapperService } from './http-wrapper.service';
import { Inject, Injectable, Optional } from '@angular/core';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { CreateCompanyAuthKeyRequest, UpdateCompanyAuthKeyRequest, ICompanyAuthKey } from '../models/api-models/SettingsCompanyAuthKey';
import { SETTINGS_COMPANY_AUTH_KEY_API } from './apiurls/settings.company-auth-key';

@Injectable()
export class CompanyAuthKeyService {
    private companyUniqueName: string;

    constructor(private errorHandler: GiddhErrorHandler, private http: HttpWrapperService,
        private generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    /**
     * Get All Auth Keys
     */
    public GetAllAuthKeys(): Observable<BaseResponse<ICompanyAuthKey[], string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + SETTINGS_COMPANY_AUTH_KEY_API.GET_ALL_AUTH_KEYS?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<ICompanyAuthKey[], string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<ICompanyAuthKey[], string>(e, '')));
    }

    /**
     * Get Auth Key by Role User
     */
    public GetAuthKey(roleUser: string): Observable<BaseResponse<ICompanyAuthKey, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + SETTINGS_COMPANY_AUTH_KEY_API.GET_AUTH_KEY
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':roleUser', encodeURIComponent(roleUser))).pipe(map((res) => {
                let data: BaseResponse<ICompanyAuthKey, string> = res;
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<ICompanyAuthKey, string>(e, roleUser)));
    }

    /**
     * Create Auth Key
     */
    public CreateAuthKey(roleUniqueName: string, model: CreateCompanyAuthKeyRequest): Observable<BaseResponse<ICompanyAuthKey, CreateCompanyAuthKeyRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + SETTINGS_COMPANY_AUTH_KEY_API.CREATE_AUTH_KEY
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':roleUniqueName', encodeURIComponent(roleUniqueName)),
            model).pipe(map((res) => {
                let data: BaseResponse<ICompanyAuthKey, CreateCompanyAuthKeyRequest> = res;
                data.request = model;
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<ICompanyAuthKey, CreateCompanyAuthKeyRequest>(e, model)));
    }

    /**
     * Update Auth Key
     */
    public UpdateAuthKey(userRoleUniqueName: string, model: UpdateCompanyAuthKeyRequest): Observable<BaseResponse<ICompanyAuthKey, UpdateCompanyAuthKeyRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + SETTINGS_COMPANY_AUTH_KEY_API.UPDATE_AUTH_KEY
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':userRoleUniqueName', encodeURIComponent(userRoleUniqueName)), model).pipe(map((res) => {
                let data: BaseResponse<ICompanyAuthKey, UpdateCompanyAuthKeyRequest> = res;
                data.request = model;
                data.queryString = userRoleUniqueName;
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<ICompanyAuthKey, UpdateCompanyAuthKeyRequest>(e, model)));
    }

    /**
     * Delete Auth Key
     */
    public DeleteAuthKey(userRoleUniqueName: string): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + SETTINGS_COMPANY_AUTH_KEY_API.DELETE_AUTH_KEY
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':userRoleUniqueName', encodeURIComponent(userRoleUniqueName))).pipe(map((res) => {
                let data: BaseResponse<any, any> = res;
                data.request = userRoleUniqueName;
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, userRoleUniqueName)));
    }
}
