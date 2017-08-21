import { Observable } from 'rxjs/Observable';
import { HttpWrapperService } from './httpWrapper.service';
import { Injectable, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { UserDetails } from '../models/api-models/loginModels';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { HandleCatch } from './catchManager/catchmanger';

@Injectable()
export class SalesService {

    private user: UserDetails;
    private companyUniqueName: string;
    private roleUniqueName: string;

    constructor(private _http: HttpWrapperService, private store: Store<AppState>) {
    }

    /*
     * Get all roles
    */
    // public GetAllRoles(): Observable<BaseResponse<IRoleCommonResponseAndRequest[], string>> {

    //     this.store.take(1).subscribe(s => {
    //         if (s.session.user) {
    //             this.user = s.session.user.user;
    //         }
    //         if (s.session.companyUniqueName) {
    //             this.companyUniqueName = s.session.companyUniqueName;
    //         }
    //     });

    //     return this._http.get(PERMISSION_API.GET_ROLE.replace(':companyUniqueName', this.companyUniqueName)).map((res) => {
    //         let data: BaseResponse<IRoleCommonResponseAndRequest[], string> = res.json();
    //         data.queryString = {};
    //         return data;
    //     }).catch((e) => HandleCatch<IRoleCommonResponseAndRequest[], string>(e));
    // }
}
