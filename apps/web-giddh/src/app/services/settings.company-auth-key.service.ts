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
     * Gets all company auth keys for the current company
     *
     * @returns {Observable<BaseResponse<ICompanyAuthKey[], string>>} Observable with list of auth keys
     * @memberof CompanyAuthKeyService
     */
    public getAllAuthKeys(): Observable<BaseResponse<ICompanyAuthKey[], string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + SETTINGS_COMPANY_AUTH_KEY_API.GET_ALL_AUTH_KEYS?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            const data: BaseResponse<ICompanyAuthKey[], string> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<ICompanyAuthKey[], string>(e, '')));
    }

    /**
     * Gets auth key by role/user identifier
     *
     * @param {string} authKeyUniqueName Auth key unique name
     * @returns {Observable<BaseResponse<ICompanyAuthKey, string>>} Observable with auth key
     * @memberof CompanyAuthKeyService
     */
    public getAuthKey(authKeyUniqueName: string): Observable<BaseResponse<ICompanyAuthKey, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + SETTINGS_COMPANY_AUTH_KEY_API.GET_AUTH_KEY
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':authKeyUniqueName', encodeURIComponent(authKeyUniqueName))).pipe(map((res) => {
                let data: BaseResponse<ICompanyAuthKey, string> = res;
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<ICompanyAuthKey, string>(e, authKeyUniqueName)));
    }

    /**
     * Creates a new auth key for the given role
     *
     * @param {CreateCompanyAuthKeyRequest} model Payload for auth key creation
     * @returns {Observable<BaseResponse<ICompanyAuthKey, CreateCompanyAuthKeyRequest>>} Observable with created auth key
     * @memberof CompanyAuthKeyService
     */
    public createAuthKey(model: CreateCompanyAuthKeyRequest): Observable<BaseResponse<ICompanyAuthKey, CreateCompanyAuthKeyRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + SETTINGS_COMPANY_AUTH_KEY_API.CREATE_AUTH_KEY
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)),
            model).pipe(map((res) => {
                let data: BaseResponse<ICompanyAuthKey, CreateCompanyAuthKeyRequest> = res;
                data.request = model;
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<ICompanyAuthKey, CreateCompanyAuthKeyRequest>(e, model)));
    }

    /**
     * Updates an existing auth key for the given user role
     *
     * @param {string} authKeyUniqueName Auth key unique name
     * @param {UpdateCompanyAuthKeyRequest} model Payload for auth key update
     * @returns {Observable<BaseResponse<ICompanyAuthKey, UpdateCompanyAuthKeyRequest>>} Observable with updated auth key
     * @memberof CompanyAuthKeyService
     */
    public updateAuthKey(authKeyUniqueName: string, model: UpdateCompanyAuthKeyRequest): Observable<BaseResponse<ICompanyAuthKey, UpdateCompanyAuthKeyRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + SETTINGS_COMPANY_AUTH_KEY_API.UPDATE_AUTH_KEY
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':authKeyUniqueName', encodeURIComponent(authKeyUniqueName)), model).pipe(map((res) => {
                let data: BaseResponse<ICompanyAuthKey, UpdateCompanyAuthKeyRequest> = res;
                data.request = model;
                data.queryString = authKeyUniqueName;
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<ICompanyAuthKey, UpdateCompanyAuthKeyRequest>(e, model)));
    }

    /**
     * Deletes auth key for the given auth key
     *
     * @param {string} authKeyUniqueName Auth key unique name
     * @returns {Observable<BaseResponse<string, string>>} Observable with delete response
     * @memberof CompanyAuthKeyService
     */
    public deleteAuthKey(authKeyUniqueName: string): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + SETTINGS_COMPANY_AUTH_KEY_API.DELETE_AUTH_KEY
            ?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            ?.replace(':authKeyUniqueName', encodeURIComponent(authKeyUniqueName))).pipe(map((res) => {
                const data: BaseResponse<string, string> = res;
                data.request = authKeyUniqueName;
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e, authKeyUniqueName)));
    }
}
