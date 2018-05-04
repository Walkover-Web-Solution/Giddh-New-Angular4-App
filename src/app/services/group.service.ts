import { GroupUpateRequest, MoveGroupResponse } from './../models/api-models/Group';
import { Injectable, Optional, Inject } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Configuration, URLS } from '../app.constants';
import { Router } from '@angular/router';
import { HttpWrapperService } from './httpWrapper.service';
import { LoaderService } from './loader.service';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { UserDetails } from '../models/api-models/loginModels';
import { ErrorHandler } from './catchManager/catchmanger';
import { FlattenGroupsAccountsResponse, GroupCreateRequest, GroupResponse, GroupSharedWithResponse, GroupsTaxHierarchyResponse, MoveGroupRequest, ShareGroupRequest } from '../models/api-models/Group';
import { GROUP_API } from './apiurls/group.api';
import { GroupsWithAccountsResponse } from '../models/api-models/GroupsWithAccounts';
import { GeneralService } from './general.service';
import { ServiceConfig, IServiceConfigArgs } from './service.config';
declare var _: any;
// import { UserManager, Log, MetadataService, User } from 'oidc-client';
@Injectable()
export class GroupService {
  private companyUniqueName: string;
  private user: UserDetails;
  private _: any;

  constructor(private errorHandler: ErrorHandler, public _http: HttpWrapperService,
    public _router: Router,
    private _generalService: GeneralService,
    @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    this._ = config._;
    _ = config._;
  }

  public flattenGroup(rawList: any[], parents: any[] = []) {
    let listofUN;
    listofUN = _.map(rawList, (listItem) => {
      let newParents;
      let result;
      newParents = _.union([], parents);
      newParents.push({
        name: listItem.name,
        uniqueName: listItem.uniqueName
      });
      listItem = Object.assign({}, listItem, { parentGroups: [] });
      listItem.parentGroups = newParents;
      if (listItem.groups.length > 0) {
        result = this.flattenGroup(listItem.groups, newParents);
        result.push(_.omit(listItem, 'groups'));
      } else {
        result = _.omit(listItem, 'groups');
      }
      return result;
    });
    return _.flatten(listofUN);
  }

  public CreateGroup(model: GroupCreateRequest): Observable<BaseResponse<GroupResponse, GroupCreateRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + GROUP_API.CREATE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).map((res) => {
      let data: BaseResponse<GroupResponse, GroupCreateRequest> = res;
      data.request = model;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<GroupResponse, GroupCreateRequest>(e, model));
  }

  public UpdateGroup(modele: GroupUpateRequest, groupUniqueName: string): Observable<BaseResponse<GroupResponse, GroupUpateRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.put(this.config.apiUrl + GROUP_API.UPDATE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':groupUniqueName', encodeURIComponent(groupUniqueName)), modele).map((res) => {
      let data: BaseResponse<GroupResponse, GroupUpateRequest> = res;
      data.queryString = { groupUniqueName };
      data.request = modele;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<GroupResponse, GroupUpateRequest>(e, modele, { groupUniqueName }));
  }

  public ShareGroup(modele: ShareGroupRequest, groupUniqueName: string): Observable<BaseResponse<string, ShareGroupRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;

    return this._http.put(this.config.apiUrl + GROUP_API.SHARE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':groupUniqueName', encodeURIComponent(groupUniqueName)), modele).map((res) => {
      let data: BaseResponse<string, ShareGroupRequest> = res;
      data.queryString = { groupUniqueName };
      data.request = modele;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<string, ShareGroupRequest>(e, modele, { groupUniqueName }));
  }

  public GetGrouptDetails(groupUniqueName: string): Observable<BaseResponse<GroupResponse, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + GROUP_API.GET_GROUP_DETAILS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':groupUniqueName', encodeURIComponent(groupUniqueName))).map((res) => {
      let data: BaseResponse<GroupResponse, string> = res;
      data.queryString = { groupUniqueName };
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<GroupResponse, string>(e));
  }

  // need to check on Effect
  public UnShareGroup(userEmail: string, groupUniqueName: string): Observable<BaseResponse<string, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;

    return this._http.put(this.config.apiUrl + GROUP_API.UNSHARE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':groupUniqueName', encodeURIComponent(groupUniqueName)), { user: userEmail }).map((res) => {
      let data: BaseResponse<string, string> = res;
      data.request = userEmail;
      data.queryString = { groupUniqueName };
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<string, string>(e, userEmail, { groupUniqueName }));
  }

  public ShareWithGroup(groupUniqueName: string): Observable<BaseResponse<GroupSharedWithResponse[], string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + GROUP_API.SHARED_WITH.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':groupUniqueName', encodeURIComponent(groupUniqueName))).map((res) => {
      let data: BaseResponse<GroupSharedWithResponse[], string> = res;
      data.queryString = { groupUniqueName };
      data.request = groupUniqueName;
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<GroupSharedWithResponse[], string>(e, groupUniqueName, { groupUniqueName }));
  }

  public GetGroupsWithAccounts(q: string): Observable<BaseResponse<GroupsWithAccountsResponse[], string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    if (this.companyUniqueName) {
      return this._http.get(this.config.apiUrl + GROUP_API.GROUPS_WITH_ACCOUNT.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':q', encodeURIComponent(q || ''))).map((res) => {
        let data: BaseResponse<GroupsWithAccountsResponse[], string> = res;
        data.request = q;
        return data;
      }).catch((e) => this.errorHandler.HandleCatch<GroupsWithAccountsResponse[], string>(e, q));
    } else {
      return Observable.empty();
    }
  }

  public MoveGroup(modele: MoveGroupRequest, groupUniqueName: string): Observable<BaseResponse<MoveGroupResponse, MoveGroupRequest>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.put(this.config.apiUrl + GROUP_API.MOVE_GROUP.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':groupUniqueName', encodeURIComponent(groupUniqueName)), modele).map((res) => {
      let data: BaseResponse<MoveGroupResponse, MoveGroupRequest> = res;
      data.request = modele;
      data.queryString = { groupUniqueName };
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<MoveGroupResponse, MoveGroupRequest>(e, modele, { groupUniqueName }));
  }

  public GetGroupDetails(groupUniqueName: string): Observable<BaseResponse<GroupResponse, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + GROUP_API.GET_GROUP_DETAILS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':groupUniqueName', encodeURIComponent(groupUniqueName))).map((res) => {
      let data: BaseResponse<GroupResponse, string> = res;
      data.request = groupUniqueName;
      data.queryString = { groupUniqueName };
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<GroupResponse, string>(e, groupUniqueName, { groupUniqueName }));
  }

  public DeleteGroup(groupUniqueName: string): Observable<BaseResponse<string, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.delete(this.config.apiUrl + GROUP_API.DELETE_GROUP.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':groupUniqueName', encodeURIComponent(groupUniqueName))).map((res) => {
      let data: BaseResponse<string, string> = res;
      data.request = groupUniqueName;
      data.queryString = { groupUniqueName };
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<string, string>(e, groupUniqueName, { groupUniqueName }));
  }

  public GetFlattenGroupsAccounts(q: string = '', page: number = 1, count: number = 20000, showEmptyGroups: string = 'false'): Observable<BaseResponse<FlattenGroupsAccountsResponse, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + GROUP_API.FLATTEN_GROUP_WITH_ACCOUNTS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
      .replace(':q', encodeURIComponent(q || ''))
      .replace(':page', encodeURIComponent(page.toString()))
      .replace(':count', encodeURIComponent(count.toString()))
      .replace(':showEmptyGroups', encodeURIComponent(showEmptyGroups))).map((res) => {
        let data: BaseResponse<FlattenGroupsAccountsResponse, string> = res;
        data.request = '';
        data.queryString = { q, page, count, showEmptyGroups };
        // data.response.results.forEach(p => p.isOpen = false);
        return data;
      }).catch((e) => this.errorHandler.HandleCatch<FlattenGroupsAccountsResponse, string>(e, '', { q, page, count, showEmptyGroups }));
  }

  public GetTaxHierarchy(groupUniqueName: string): Observable<BaseResponse<GroupsTaxHierarchyResponse, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.get(this.config.apiUrl + GROUP_API.TAX_HIERARCHY.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':groupUniqueName', encodeURIComponent(groupUniqueName))).map((res) => {
      let data: BaseResponse<GroupsTaxHierarchyResponse, string> = res;
      data.request = groupUniqueName;
      data.queryString = { groupUniqueName };
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<GroupsTaxHierarchyResponse, string>(e, groupUniqueName, { groupUniqueName }));
  }

  /**
   * get subgroups of a group
   * @param groupUniqueName
   */
  public GetGroupSubgroups(groupUniqueName: string): Observable<BaseResponse<any, string>> {
    this.user = this._generalService.user;
    this.companyUniqueName = this._generalService.companyUniqueName;
    if (this.companyUniqueName) {
      return this._http.get(this.config.apiUrl + GROUP_API.GET_SUB_GROUPS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':groupUniqueName', encodeURIComponent(groupUniqueName))).map((res) => {
        let data: BaseResponse<any, string> = res;
        data.request = groupUniqueName;
        data.queryString = { groupUniqueName };
        return data;
      }).catch((e) => this.errorHandler.HandleCatch<any, string>(e, groupUniqueName, { groupUniqueName }));
    } else {
      return Observable.empty();
    }

  }

}
