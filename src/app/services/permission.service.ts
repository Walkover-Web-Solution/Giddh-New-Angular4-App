import { Observable } from 'rxjs/Observable';
import { HttpWrapperService } from './httpWrapper.service';
import { Injectable, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import {
    PermissionResponse,
    PermissionRequest,
    CreateNewRoleRequest,
    CreateNewRoleRespone,
    UpdateRoleRequest
} from '../models/api-models/Permission';
import { PERMISSION_API } from './apiurls/permission.api';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { UserDetails } from '../models/api-models/loginModels';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { HandleCatch } from './catchManager/catchmanger';

@Injectable()
export class PermissionService {

    private user: UserDetails;
    private companyUniqueName: string;
    private roleUniqueName: string;

    constructor(private _http: HttpWrapperService, private store: Store<AppState>) {
    }

    /*
     * Get all roles
    */
    public GetAllRoles(): Observable<BaseResponse<PermissionResponse[], string>> {

        this.store.take(1).subscribe(s => {
            if (s.session.user) {
                this.user = s.session.user.user;
            }
            if (s.session.companyUniqueName) {
                this.companyUniqueName = s.session.companyUniqueName;
            }
        });

        return this._http.get(PERMISSION_API.GET_ROLE.replace(':companyUniqueName', this.companyUniqueName)).map((res) => {
            let data: BaseResponse<PermissionResponse[], string> = res.json();
            data.queryString = {};
            return data;
        }).catch((e) => HandleCatch<PermissionResponse[], string>(e));
    }

    /**
    * Create new role
    */
    public CreateNewRole(model: CreateNewRoleRequest): Observable<BaseResponse<CreateNewRoleRespone, CreateNewRoleRequest>> {
        this.store.take(1).subscribe(s => {
            if (s.session.user) {
                this.user = s.session.user.user;
            }
            this.companyUniqueName = s.session.companyUniqueName;
        });
        return this._http.post(PERMISSION_API.CREATE_ROLE.replace(':companyUniqueName', this.companyUniqueName), model).map((res) => {
            let data: BaseResponse<CreateNewRoleRespone, CreateNewRoleRequest> = res.json();
            data.request = model;
            return data;
        }).catch((e) => HandleCatch<CreateNewRoleRespone, CreateNewRoleRequest>(e, model));
    }

    /**
    * Update new role
    */
    public UpdateRole(model: UpdateRoleRequest): Observable<BaseResponse<any, UpdateRoleRequest>> {
        let roleUniqueName = model.roleUniqueName ? model.roleUniqueName : model.uniqueName;
        this.store.take(1).subscribe(s => {
            if (s.session.user) {
                this.user = s.session.user.user;
            }
            this.companyUniqueName = s.session.companyUniqueName;
        });
        return this._http.put(PERMISSION_API.UPDATE_ROLE.replace(':companyUniqueName', this.companyUniqueName).replace(':roleUniqueName', roleUniqueName), model).map((res) => {
            let data: BaseResponse<any, UpdateRoleRequest> = res.json();
            data.request = model;
            return data;
        }).catch((e) => HandleCatch<any, UpdateRoleRequest>(e, model));
    }

    /**
    * Delete role
    */
    public DeleteRole(roleUniqueName: string): Observable<BaseResponse<string, string>> {
        this.store.take(1).subscribe(s => {
            if (s.session.user) {
                this.user = s.session.user.user;
            }
            this.companyUniqueName = s.session.companyUniqueName;
        });
        return this._http.delete(PERMISSION_API.DELETE_ROLE.replace(':companyUniqueName', this.companyUniqueName).replace(':roleUniqueName', roleUniqueName)).map((res) => {
            let data: BaseResponse<string, string> = res.json();
            data.request = '';
            data.queryString = { roleUniqueName };
            return data;
        }).catch((e) => HandleCatch<string, string>(e, '', { roleUniqueName }));
    }

    /*
     * Get all page names
    */
    public GetAllPageNames(): Observable<BaseResponse<string[], string>> {

        return this._http.get(PERMISSION_API.GET_ALL_PAGE_NAMES).map((res) => {
            let data: BaseResponse<string[], string> = res.json();
            data.queryString = {};
            return data;
        }).catch((e) => HandleCatch<string[], string>(e));
    }
}
