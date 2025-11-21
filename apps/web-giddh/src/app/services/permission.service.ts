import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpWrapperService } from './http-wrapper.service';
import { Inject, Injectable, Optional } from '@angular/core';
import { CreateNewRoleRequest, CreateNewRoleResponse, IRoleCommonResponseAndRequest } from '../models/api-models/Permission';
import { PERMISSION_API, COMPANY_WISE_AUTH_KEY_API } from './apiurls/permission.api';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { IPageStr } from '../permissions/permission.utility';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';

@Injectable()
export class PermissionService {
    private companyUniqueName: string;

    constructor(private errorHandler: GiddhErrorHandler, private http: HttpWrapperService,
        private generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    /*
     * Get all roles
    */
    public GetAllRoles(): Observable<BaseResponse<IRoleCommonResponseAndRequest[], string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;

        return this.http.get(this.config.apiUrl + PERMISSION_API.GET_ROLE?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<IRoleCommonResponseAndRequest[], string> = res;
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<IRoleCommonResponseAndRequest[], string>(e)));
    }

    /**
     * Create new role
     */
    public CreateNewRole(model: CreateNewRoleRequest): Observable<BaseResponse<CreateNewRoleResponse, CreateNewRoleRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + PERMISSION_API.CREATE_ROLE?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<CreateNewRoleResponse, CreateNewRoleRequest> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<CreateNewRoleResponse, CreateNewRoleRequest>(e, model)));
    }

    /**
     * Update new role
     */
    public UpdateRole(model: IRoleCommonResponseAndRequest): Observable<BaseResponse<IRoleCommonResponseAndRequest, IRoleCommonResponseAndRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + PERMISSION_API.UPDATE_ROLE?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':roleUniqueName', model?.uniqueName), model).pipe(map((res) => {
            let data: BaseResponse<IRoleCommonResponseAndRequest, IRoleCommonResponseAndRequest> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<IRoleCommonResponseAndRequest, IRoleCommonResponseAndRequest>(e, model)));
    }

    /**
     * Delete role
     */
    public DeleteRole(roleUniqueName: string): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + PERMISSION_API.DELETE_ROLE?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':roleUniqueName', roleUniqueName)).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            data.request = '';
            data.queryString = { roleUniqueName };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e, '', { roleUniqueName })));
    }

    /*
     * Get all page names
    */
    public GetAllPageNames(): Observable<BaseResponse<IPageStr[], string>> {
        return this.http.get(this.config.apiUrl + PERMISSION_API.GET_ALL_PAGE_NAMES).pipe(map((res) => {
            let data: BaseResponse<IPageStr[], string> = res;
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<IPageStr[], string>(e)));
    }

    /**
     * Updates authentication permissions for a specific role
     *
     * @param {any} model - The authentication update model containing permissions data
     * @param {string} roleUniqueName - The unique name of the role to update
     * @returns {Observable<BaseResponse<any, any>>} Observable containing the API response
     * @memberof PermissionService
     */
    public updateAuth(model: any, roleUniqueName: string): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + COMPANY_WISE_AUTH_KEY_API.UPDATE_AUTH?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':roleUniqueName', roleUniqueName), model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = model;
            data.queryString = { roleUniqueName };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model, { roleUniqueName })));
    }

    /**
     * Generates authentication key for a specific role
     *
     * @param {string} roleUniqueName - The unique name of the role to generate auth key for
     * @returns {Observable<BaseResponse<any, string>>} Observable containing the generated auth key response
     * @memberof PermissionService
     */
    public generateAuthKey(roleUniqueName: string): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + COMPANY_WISE_AUTH_KEY_API.GENERATE_AUTH_KEY?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(/:roleUniqueName/g, roleUniqueName), {}).pipe(map((res) => {
            let data: BaseResponse<any, string> = res;
            data.request = '';
            data.queryString = { roleUniqueName };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e, '', { roleUniqueName })));
    }

    /**
     * Removes authentication key for a specific role
     *
     * @param {string} roleUniqueName - The unique name of the role to remove auth key from
     * @returns {Observable<BaseResponse<any, string>>} Observable containing the removal response
     * @memberof PermissionService
     */
    public removeAuthKey(roleUniqueName: string): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + COMPANY_WISE_AUTH_KEY_API.REMOVE_AUTH_KEY?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':roleUniqueName', roleUniqueName)).pipe(map((res) => {
            let data: BaseResponse<any, string> = res;
            data.request = '';
            data.queryString = { roleUniqueName };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e, '', { roleUniqueName })));
    }

    /**
     * Gets role details by unique name
     *
     * @param {string} roleUniqueName - The unique name of the role to retrieve
     * @returns {Observable<BaseResponse<IRoleCommonResponseAndRequest, string>>} Observable containing the role details
     * @memberof PermissionService
     */
    public getRoleByUniqueName(roleUniqueName: string): Observable<BaseResponse<IRoleCommonResponseAndRequest, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + COMPANY_WISE_AUTH_KEY_API.GET_ROLE_BY_UNIQUE_NAME?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':roleUniqueName', roleUniqueName)).pipe(map((res) => {
            let data: BaseResponse<IRoleCommonResponseAndRequest, string> = res;
            data.request = '';
            data.queryString = { roleUniqueName };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<IRoleCommonResponseAndRequest, string>(e, '', { roleUniqueName })));
    }

    /**
     * Gets all roles for the company
     *
     * @returns {Observable<BaseResponse<IRoleCommonResponseAndRequest[], string>>} Observable containing all company roles
     * @memberof PermissionService
     */
    public getRoles(): Observable<BaseResponse<IRoleCommonResponseAndRequest[], string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + COMPANY_WISE_AUTH_KEY_API.GET_ROLES?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<IRoleCommonResponseAndRequest[], string> = res;
            data.request = '';
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<IRoleCommonResponseAndRequest[], string>(e, '', {})));
    }
}