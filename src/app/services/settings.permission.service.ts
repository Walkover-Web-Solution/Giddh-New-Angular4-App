import { UserDetails } from './../models/api-models/loginModels';
import { Observable } from 'rxjs/Observable';
import { HttpWrapperService } from './httpWrapper.service';
import { Injectable, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { ErrorHandler } from './catchManager/catchmanger';
import { SETTINGS_PERMISSION_API } from './apiurls/settings.permission.api';

@Injectable()
export class SettingsPermissionService {

  private user: UserDetails;
  private companyUniqueName: string;
  private roleUniqueName: string;

  constructor(private errorHandler: ErrorHandler, private _http: HttpWrapperService, private store: Store<AppState>) { }

  /*
  * Get Users With Company Permissions
  */
  public GetUsersWithCompanyPermissions(companyUniqueName: string): Observable<BaseResponse<any, string>> {
    this.store.take(1).subscribe(s => {
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(SETTINGS_PERMISSION_API.GET.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).map((res) => {
      let data: BaseResponse<any, string> = res.json();
      data.queryString = {};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<any, string>(e));
  }

}
