import { Observable } from 'rxjs/Observable';
import { HttpWrapperService } from './httpWrapper.service';
import { Injectable } from '@angular/core';
import { CreateNewRoleRequest, CreateNewRoleResponse, IRoleCommonResponseAndRequest } from '../models/api-models/Permission';
import { PERMISSION_API } from './apiurls/permission.api';
import { UserDetails } from '../models/api-models/loginModels';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { ErrorHandler } from './catchManager/catchmanger';
import { IPageStr } from '../permissions/permission.utility';
import { GeneralService } from './general.service';

@Injectable()
export class PermissionService {

  private user: UserDetails;
  private companyUniqueName: string;
  private roleUniqueName: string;

  constructor(private errorHandler: ErrorHandler, private _http: HttpWrapperService,
              private _generalService: GeneralService) {
  }

  /*
   * Get all roles
  */
  public GetAllRoles(): Observable<BaseResponse<IRoleCommonResponseAndRequest[], string>> {

    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;

    return this._http.get(PERMISSION_API.GET_ROLE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).map((res) => {
      let data: BaseResponse<IRoleCommonResponseAndRequest[], string> = res.json();
      data.queryString = {};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<IRoleCommonResponseAndRequest[], string>(e));
  }

  /**
   * Create new role
   */
  public CreateNewRole(model: CreateNewRoleRequest): Observable<BaseResponse<CreateNewRoleResponse, CreateNewRoleRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(PERMISSION_API.CREATE_ROLE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).map((res) => {
      let data: BaseResponse<CreateNewRoleResponse, CreateNewRoleRequest> = res.json();
      data.request = model;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<CreateNewRoleResponse, CreateNewRoleRequest>(e, model));
  }

  /**
   * Update new role
   */
  public UpdateRole(model: IRoleCommonResponseAndRequest): Observable<BaseResponse<IRoleCommonResponseAndRequest, IRoleCommonResponseAndRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.put(PERMISSION_API.UPDATE_ROLE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':roleUniqueName', model.uniqueName), model).map((res) => {
      let data: BaseResponse<IRoleCommonResponseAndRequest, IRoleCommonResponseAndRequest> = res.json();
      data.request = model;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<IRoleCommonResponseAndRequest, IRoleCommonResponseAndRequest>(e, model));
  }

  /**
   * Delete role
   */
  public DeleteRole(roleUniqueName: string): Observable<BaseResponse<string, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.delete(PERMISSION_API.DELETE_ROLE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':roleUniqueName', roleUniqueName)).map((res) => {
      let data: BaseResponse<string, string> = res.json();
      data.request = '';
      data.queryString = {roleUniqueName};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<string, string>(e, '', {roleUniqueName}));
  }

  /*
   * Get all page names
  */
  public GetAllPageNames(): Observable<BaseResponse<IPageStr[], string>> {
    return this._http.get(PERMISSION_API.GET_ALL_PAGE_NAMES).map((res) => {
      let data: BaseResponse<IPageStr[], string> = res.json();
      data.queryString = {};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<IPageStr[], string>(e));
  }

  /**
   * Share Company
   */
  public ShareCompany(model: { role: string, user: string }): Observable<BaseResponse<any, any>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.put(PERMISSION_API.SHARE_COMPANY.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).map((res) => {
      let data: BaseResponse<any, any> = res.json();
      data.request = model;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<any, any>(e, model));
  }

  /**
   * Share Company
   */
  public UnShareCompany(model: { user: string }): Observable<BaseResponse<any, any>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.put(PERMISSION_API.UN_SHARE_COMPANY.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).map((res) => {
      let data: BaseResponse<any, any> = res.json();
      data.request = model;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<any, any>(e, model));
  }

  /**
   * Share Company
   */
  public GetCompanySharedWith(): Observable<BaseResponse<any, any>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(PERMISSION_API.COMPANY_SHARED_WITH.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).map((res) => {
      let data: BaseResponse<any, any> = res.json();
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<any, any>(e));
  }
}
