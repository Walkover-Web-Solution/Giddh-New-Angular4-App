import { Observable } from 'rxjs/Observable';
import { HttpWrapperService } from './httpWrapper.service';
import { Injectable } from '@angular/core';
import { UserDetails } from '../models/api-models/loginModels';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { ErrorHandler } from './catchManager/catchmanger';
import { SmsKeyClass } from '../models/api-models/SettingsIntegraion';
import { SETTINGS_PROFILE_API } from './apiurls/settings.profile.api';
import { GeneralService } from './general.service';

@Injectable()
export class SettingsProfileService {

  private user: UserDetails;
  private companyUniqueName: string;

  constructor(private errorHandler: ErrorHandler, private _http: HttpWrapperService,
              private _generalService: GeneralService) {
  }

  /*
  * Get company profile
  */
  public GetProfileInfo(): Observable<BaseResponse<SmsKeyClass, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(SETTINGS_PROFILE_API.GET.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).map((res) => {
      let data: BaseResponse<SmsKeyClass, string> = res.json();
      data.queryString = {};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<SmsKeyClass, string>(e));
  }

  /**
   * Update company profile
   */
  public UpdateProfile(model): Observable<BaseResponse<any, any>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.put(SETTINGS_PROFILE_API.GET.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).map((res) => {
      let data: BaseResponse<any, any> = res.json();
      data.request = model;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<any, any>(e, model));
  }
}
