import { Observable } from 'rxjs/Observable';
import { HttpWrapperService } from './httpWrapper.service';
import { Injectable, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { PermissionResponse, PermissionRequest } from '../models/api-models/Permission';
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
            if (s.session.companyUniqueName)
                this.companyUniqueName = s.session.companyUniqueName;
        });

        return this._http.get(PERMISSION_API.GET_ROLE.replace(':companyUniqueName', this.companyUniqueName)).map((res) => {
            let data: BaseResponse<PermissionResponse[], string> = res.json();
            data.queryString = {};
            return data;
        }).catch((e) => HandleCatch<PermissionResponse[], string>(e));
    }

}
