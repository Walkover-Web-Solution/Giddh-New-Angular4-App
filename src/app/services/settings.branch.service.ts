import { Observable } from 'rxjs/Observable';
import { HttpWrapperService } from './httpWrapper.service';
import { Injectable, Optional, Inject } from '@angular/core';
import { UserDetails } from '../models/api-models/loginModels';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { ErrorHandler } from './catchManager/catchmanger';
import { SmsKeyClass } from '../models/api-models/SettingsIntegraion';
import { GeneralService } from './general.service';
import { ServiceConfig, IServiceConfigArgs } from './service.config';
import { SETTINGS_BRANCH_API } from './apiurls/settings.branch.api';

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
  public GetAllBranches(): Observable<BaseResponse<any, any>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + SETTINGS_BRANCH_API.GET_ALL_BRANCHES.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).map((res) => {
      let data: BaseResponse<any, any> = res;
      data.queryString = {};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<any, any>(e));
  }

  /**
   * Create Branches
   */
  public CreateBranches(model): Observable<BaseResponse<any, any>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + SETTINGS_BRANCH_API.CREATE_BRANCHES.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).map((res) => {
      let data: BaseResponse<any, any> = res;
      data.request = model;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<any, any>(e, model));
  }

  /*
  * Remove branch
  */
 public RemoveBranch(branchUniqueName: string): Observable<BaseResponse<any, any>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.delete(this.config.apiUrl + SETTINGS_BRANCH_API.REMOVE_BRANCH.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':childUniqueName', encodeURIComponent(branchUniqueName))).map((res) => {
      let data: BaseResponse<any, any> = res;
      data.queryString = {};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<any, any>(e));
  }

/*
  * Get all branches
  */
 public GetParentCompany(): Observable<BaseResponse<any, any>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + SETTINGS_BRANCH_API.GET_PARENT_COMPANY.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).map((res) => {
      let data: BaseResponse<any, any> = res;
      data.queryString = {};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<any, any>(e));
  }
}
