import { UserDetails } from '../models/api-models/loginModels';
import { Observable } from 'rxjs/Observable';
import { HttpWrapperService } from './httpWrapper.service';
import { Injectable } from '@angular/core';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { ErrorHandler } from './catchManager/catchmanger';
import { SETTINGS_PERMISSION_API } from './apiurls/settings.permission.api';
import { IUpdatePermissionResponse, ShareRequestForm } from '../models/api-models/Permission';
import { GeneralService } from './general.service';

@Injectable()
export class SettingsPermissionService {

  private user: UserDetails;
  private companyUniqueName: string;

  constructor(private errorHandler: ErrorHandler, private _http: HttpWrapperService,
              private _generalService: GeneralService) {
  }

  /*
  * Get Users With Company Permissions
  */
  public GetUsersWithCompanyPermissions(companyUniqueName: string): Observable<BaseResponse<any, string>> {
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(SETTINGS_PERMISSION_API.GET.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).map((res) => {
      let data: BaseResponse<any, string> = res.json();
      data.queryString = {};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<any, string>(e));
  }

  /**
   * Update permission
   */
  public UpdatePermission(model: ShareRequestForm): Observable<BaseResponse<IUpdatePermissionResponse, ShareRequestForm>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.put(SETTINGS_PERMISSION_API.UPDATE_PERMISSION.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':ueruniquename', model.uniqueName), model).map((res) => {
      let data: BaseResponse<IUpdatePermissionResponse, ShareRequestForm> = res.json();
      data.request = model;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<IUpdatePermissionResponse, ShareRequestForm>(e, model));
  }

}
