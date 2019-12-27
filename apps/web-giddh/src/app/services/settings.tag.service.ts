import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpWrapperService } from './httpWrapper.service';
import { Inject, Injectable, Optional } from '@angular/core';
import { UserDetails } from '../models/api-models/loginModels';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { ErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { SETTINGS_TAG_API } from './apiurls/settings.tag.api';
import { TagRequest } from '../models/api-models/settingsTags';

@Injectable()
export class SettingsTagService {

    private user: UserDetails;
    private companyUniqueName: string;

    constructor(private errorHandler: ErrorHandler, private _http: HttpWrapperService,
        private _generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    /*
    * Get all branches
    */
    public GetAllTags(): Observable<BaseResponse<any, any>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.get(this.config.apiUrl + SETTINGS_TAG_API.GET_ALL_TAGS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    /**
     * Create Tag
     */
    public CreateTag(model: TagRequest): Observable<BaseResponse<TagRequest, TagRequest>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(this.config.apiUrl + SETTINGS_TAG_API.CREATE_TAG.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<TagRequest, TagRequest> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<TagRequest, TagRequest>(e, model)));
    }

    /**
     * Update Tag
     */
    public UpdateTag(model: TagRequest): Observable<BaseResponse<TagRequest, TagRequest>> {
        let body = {
            name: model.name,
            description: model.description
        };
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.put(this.config.apiUrl + SETTINGS_TAG_API.UPDATE_TAG.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':tagUniqueName', encodeURIComponent(model.uniqueName)), body).pipe(map((res) => {
            let data: BaseResponse<TagRequest, TagRequest> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<TagRequest, TagRequest>(e, model)));
    }

    /**
     * Delete Tag
     */
    public DeleteTag(model: TagRequest): Observable<BaseResponse<TagRequest, TagRequest>> {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.delete(this.config.apiUrl + SETTINGS_TAG_API.DELETE_TAG.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':tagUniqueName', encodeURIComponent(model.uniqueName))).pipe(map((res) => {
            let data: BaseResponse<TagRequest, TagRequest> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<TagRequest, TagRequest>(e, model)));
    }

    //   /*
    //   * Remove branch
    //   */
    //  public RemoveBranch(branchUniqueName: string): Observable<BaseResponse<any, any>> {
    //     this.user = this._generalService.user;
    //     this.companyUniqueName = this._generalService.companyUniqueName;
    //     return this._http.delete(this.config.apiUrl + SETTINGS_TAG_API.REMOVE_BRANCH.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':childUniqueName', encodeURIComponent(branchUniqueName))).map((res) => {
    //       let data: BaseResponse<any, any> = res;
    //       data.queryString = {};
    //       return data;
    //     }).catch((e) => this.errorHandler.HandleCatch<any, any>(e));
    //   }

    // /*
    //   * Get all branches
    //   */
    //  public GetParentCompany(): Observable<BaseResponse<any, any>> {
    //     this.user = this._generalService.user;
    //     this.companyUniqueName = this._generalService.companyUniqueName;
    //     return this._http.get(this.config.apiUrl + SETTINGS_TAG_API.GET_PARENT_COMPANY.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).map((res) => {
    //       let data: BaseResponse<any, any> = res;
    //       data.queryString = {};
    //       return data;
    //     }).catch((e) => this.errorHandler.HandleCatch<any, any>(e));
    //   }
}
