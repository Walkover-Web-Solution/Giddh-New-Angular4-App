import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpWrapperService } from './http-wrapper.service';
import { Inject, Injectable, Optional } from '@angular/core';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { SETTINGS_BRANCH_API } from './apiurls/settings.branch.api';
import { BranchFilterRequest } from '../models/api-models/Company';
import { COMPANY_API } from './apiurls/company.api';

@Injectable()
export class SettingsBranchService {
    private companyUniqueName: string;

    constructor(private errorHandler: GiddhErrorHandler, private http: HttpWrapperService,
        private generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    /*
    * Get all branches
    */
    public GetAllBranches(request: BranchFilterRequest): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = (request.companyUniqueName) ? request.companyUniqueName : this.generalService.companyUniqueName;

        let from = (request.from) ? request.from : "";
        let to = (request.to) ? request.to : "";
        let url = this.config.apiUrl + COMPANY_API.GET_ALL_BRANCHES;
        url = url?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName));
        url = url?.replace(':from', from);
        url = url?.replace(':to', to);
        url = url?.replace(':hierarchyType', request.hierarchyType ?? '');

        let delimiter = '?';
        if (request.query !== undefined) {
            url = url.concat(`?q=${request.query}`);
            delimiter = '&';
        }
        url = url.concat(`${delimiter}branchUniqueName=`); // Empty branch unique name as we don't support sub-branch as of now

        return this.http.get(url).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    /**
     * Create Branches
     */
    public CreateBranches(model): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + SETTINGS_BRANCH_API.CREATE_BRANCHES?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
    }

    /*
    * Remove branch
    */
    public RemoveBranch(branchUniqueName: string): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + SETTINGS_BRANCH_API.REMOVE_BRANCH?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':childUniqueName', encodeURIComponent(branchUniqueName))).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    /**
     * Updates the branch status
     *
     * @param {*} model
     * @param {string} branchUniqueName
     * @returns {Observable<BaseResponse<any, any>>}
     * @memberof SettingsBranchService
     */
    public updateBranchStatus(model: any, branchUniqueName: string): Observable<BaseResponse<any, any>> {
        const companyUniqueName = this.generalService.companyUniqueName;
        return this.http.patch(this.config.apiUrl + SETTINGS_BRANCH_API.UPDATE_BRANCH_STATUS
            ?.replace(':companyUniqueName', companyUniqueName)
            ?.replace(':branchUniqueName', branchUniqueName), model).pipe(
                map((res) => {
                    let data: BaseResponse<any, string> = res;
                    data.queryString = {};
                    return data;
                }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e)));
    }
}
