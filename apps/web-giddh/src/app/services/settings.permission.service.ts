import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpWrapperService } from './httpWrapper.service';
import { Inject, Injectable, Optional } from '@angular/core';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { SETTINGS_PERMISSION_API } from './apiurls/settings.permission.api';
import { IUpdatePermissionResponse, ShareRequestForm } from '../models/api-models/Permission';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';

@Injectable()
export class SettingsPermissionService {
    private companyUniqueName: string;

    constructor(private errorHandler: GiddhErrorHandler, private http: HttpWrapperService,
        private generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    /*
    * Get Users With Company Permissions
    */
    public GetUsersWithCompanyPermissions(companyUniqueName: string): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + SETTINGS_PERMISSION_API.GET?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<any, string> = res;
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e)));
    }

    /**
     * Update permission
     */
    public UpdatePermission(model: ShareRequestForm): Observable<BaseResponse<IUpdatePermissionResponse, ShareRequestForm>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + SETTINGS_PERMISSION_API.UPDATE_PERMISSION?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':ueruniquename', model?.uniqueName), model).pipe(map((res) => {
            let data: BaseResponse<IUpdatePermissionResponse, ShareRequestForm> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<IUpdatePermissionResponse, ShareRequestForm>(e, model)));
    }

}
