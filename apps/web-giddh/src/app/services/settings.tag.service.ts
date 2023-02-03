import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpWrapperService } from './httpWrapper.service';
import { Inject, Injectable, Optional } from '@angular/core';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { SETTINGS_TAG_API } from './apiurls/settings.tag.api';
import { TagRequest } from '../models/api-models/settingsTags';

@Injectable()
export class SettingsTagService {
    private companyUniqueName: string;

    constructor(private errorHandler: GiddhErrorHandler, private http: HttpWrapperService,
        private generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    /*
    * Get all branches
    */
    public GetAllTags(): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + SETTINGS_TAG_API.GET_ALL_TAGS?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e)));
    }

    /**
     * Create Tag
     */
    public CreateTag(model: TagRequest): Observable<BaseResponse<TagRequest, TagRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + SETTINGS_TAG_API.CREATE_TAG?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
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
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + SETTINGS_TAG_API.UPDATE_TAG?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':tagUniqueName', encodeURIComponent(model?.uniqueName)), body).pipe(map((res) => {
            let data: BaseResponse<TagRequest, TagRequest> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<TagRequest, TagRequest>(e, model)));
    }

    /**
     * Delete Tag
     */
    public DeleteTag(model: TagRequest): Observable<BaseResponse<TagRequest, TagRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + SETTINGS_TAG_API.DELETE_TAG?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':tagUniqueName', encodeURIComponent(model?.uniqueName))).pipe(map((res) => {
            let data: BaseResponse<TagRequest, TagRequest> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<TagRequest, TagRequest>(e, model)));
    }
}
