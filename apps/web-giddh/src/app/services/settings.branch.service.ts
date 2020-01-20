import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpWrapperService } from './httpWrapper.service';
import { Inject, Injectable, Optional } from '@angular/core';
import { UserDetails } from '../models/api-models/loginModels';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { ErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { SETTINGS_BRANCH_API } from './apiurls/settings.branch.api';
import { BranchFilterRequest } from '../models/api-models/Company';

@Injectable()
export class SettingsBranchService {

    private user: UserDetails;
    private companyUniqueName: string;

    constructor(private errorHandler: ErrorHandler, private _http: HttpWrapperService,
        private _generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

	/*
	* Get all branches
	*/
    public GetAllBranches(request: BranchFilterRequest): Observable<BaseResponse<any, any>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;

        let from = (request.from) ? request.from : "";
        let to = (request.to) ? request.to : "";

        let url = this.config.apiUrl + SETTINGS_BRANCH_API.GET_ALL_BRANCHES;
        url = url.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName));
        url = url.replace(':from', from);
        url = url.replace(':to', to);

        return this._http.get(url).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

	/**
	 * Create Branches
	 */
    public CreateBranches(model): Observable<BaseResponse<any, any>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(this.config.apiUrl + SETTINGS_BRANCH_API.CREATE_BRANCHES.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
    }

	/*
	* Remove branch
	*/
    public RemoveBranch(branchUniqueName: string): Observable<BaseResponse<any, any>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.delete(this.config.apiUrl + SETTINGS_BRANCH_API.REMOVE_BRANCH.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':childUniqueName', encodeURIComponent(branchUniqueName))).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

	/*
	  * Get all branches
	  */
    public GetParentCompany(): Observable<BaseResponse<any, any>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + SETTINGS_BRANCH_API.GET_PARENT_COMPANY.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }
}
