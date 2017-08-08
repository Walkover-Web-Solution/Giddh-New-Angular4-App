ximport { GroupUpateRequest, MoveGroupResponse } from './../models/api-models/Group';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Configuration, URLS } from '../app.constants';
import { Router } from '@angular/router';
import { HttpWrapperService } from './httpWrapper.service';
import { LoaderService } from './loader.service';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { UserDetails } from '../models/api-models/loginModels';
import { HandleCatch } from './catchManager/catchmanger';
import {
  FlattenGroupsAccountsResponse,
  GroupCreateRequest,
  GroupResponse,
  GroupSharedWithResponse,
  GroupsTaxHierarchyResponse,
  MoveGroupRequest,
  ShareGroupRequest
} from '../models/api-models/Group';
import { AppState } from '../store/roots';
import { GROUP_API } from './apiurls/group.api';
import { GroupsWithAccountsResponse } from '../models/api-models/GroupsWithAccounts';

// import { UserManager, Log, MetadataService, User } from 'oidc-client';
@Injectable()
export class GroupService {
  private companyUniqueName: string;
  private user: UserDetails;
  constructor(public _http: HttpWrapperService,
    public _router: Router,
    private store: Store<AppState>
  ) {
  }
  public CreateGroup(model: GroupCreateRequest): Observable<BaseResponse<GroupResponse, GroupCreateRequest>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.post(GROUP_API.CREATE.replace(':companyUniqueName', this.companyUniqueName), model).map((res) => {
      let data: BaseResponse<GroupResponse, GroupCreateRequest> = res.json();
      data.request = model;
      return data;
    }).catch((e) => HandleCatch<GroupResponse, GroupCreateRequest>(e, model));
  }

  public UpdateGroup(modele: GroupUpateRequest, groupUniqueName: string): Observable<BaseResponse<GroupResponse, GroupUpateRequest>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.put(GROUP_API.UPDATE.replace(':companyUniqueName', this.companyUniqueName).replace(':groupUniqueName', groupUniqueName), modele).map((res) => {
      let data: BaseResponse<GroupResponse, GroupUpateRequest> = res.json();
      data.queryString = { groupUniqueName };
      data.request = modele;
      return data;
    }).catch((e) => HandleCatch<GroupResponse, GroupUpateRequest>(e, modele, { groupUniqueName }));
  }
  public ShareGroup(modele: ShareGroupRequest, groupUniqueName: string): Observable<BaseResponse<string, ShareGroupRequest>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });

    return this._http.put(GROUP_API.SHARE.replace(':companyUniqueName', this.companyUniqueName).replace(':groupUniqueName', groupUniqueName), modele).map((res) => {
      let data: BaseResponse<string, ShareGroupRequest> = res.json();
      data.queryString = { groupUniqueName };
      data.request = modele;
      return data;
    }).catch((e) => HandleCatch<string, ShareGroupRequest>(e, modele, { groupUniqueName }));
  }

  public GetGrouptDetails(groupUniqueName: string): Observable<BaseResponse<GroupResponse, string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(GROUP_API.GET_GROUP_DETAILS.replace(':companyUniqueName', this.companyUniqueName).replace(':groupUniqueName', groupUniqueName)).map((res) => {
      let data: BaseResponse<GroupResponse, string> = res.json();
      data.queryString = { groupUniqueName };
      return data;
    }).catch((e) => HandleCatch<GroupResponse, string>(e));
  }

  // need to check on Effect
  public UnShareGroup(userEmail: string, groupUniqueName: string): Observable<BaseResponse<string, string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });

    return this._http.put(GROUP_API.UNSHARE.replace(':companyUniqueName', this.companyUniqueName).replace(':groupUniqueName', groupUniqueName), { user: userEmail }).map((res) => {
      let data: BaseResponse<string, string> = res.json();
      data.request = userEmail;
      data.queryString = { groupUniqueName };
      return data;
    }).catch((e) => HandleCatch<string, string>(e, userEmail, { groupUniqueName }));
  }

  public ShareWithGroup(groupUniqueName: string): Observable<BaseResponse<GroupSharedWithResponse[], string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(GROUP_API.SHARED_WITH.replace(':companyUniqueName', this.companyUniqueName).replace(':groupUniqueName', groupUniqueName)).map((res) => {
      let data: BaseResponse<GroupSharedWithResponse[], string> = res.json();
      data.queryString = { groupUniqueName };
      data.request = groupUniqueName;
      return data;
    }).catch((e) => HandleCatch<GroupSharedWithResponse[], string>(e, groupUniqueName, { groupUniqueName }));
  }

  public GetGroupsWithAccounts(q: string): Observable<BaseResponse<GroupsWithAccountsResponse[], string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(GROUP_API.GROUPS_WITH_ACCOUNT.replace(':companyUniqueName', this.companyUniqueName).replace(':q', q)).map((res) => {
      let data: BaseResponse<GroupsWithAccountsResponse[], string> = res.json();
      data.request = q;
      return data;
    }).catch((e) => HandleCatch<GroupsWithAccountsResponse[], string>(e, q));
  }

  public MoveGroup(modele: MoveGroupRequest, groupUniqueName: string): Observable<BaseResponse<MoveGroupResponse, MoveGroupRequest>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.put(GROUP_API.MOVE_GROUP.replace(':companyUniqueName', this.companyUniqueName).replace(':groupUniqueName', groupUniqueName), modele).map((res) => {
      let data: BaseResponse<MoveGroupResponse, MoveGroupRequest> = res.json();
      data.request = modele;
      data.queryString = { groupUniqueName };
      return data;
    }).catch((e) => HandleCatch<MoveGroupResponse, MoveGroupRequest>(e, modele, { groupUniqueName }));
  }

  public GetGroupDetails(groupUniqueName: string): Observable<BaseResponse<GroupResponse, string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(GROUP_API.GET_GROUP_DETAILS.replace(':companyUniqueName', this.companyUniqueName).replace(':groupUniqueName', groupUniqueName)).map((res) => {
      let data: BaseResponse<GroupResponse, string> = res.json();
      data.request = groupUniqueName;
      data.queryString = { groupUniqueName };
      return data;
    }).catch((e) => HandleCatch<GroupResponse, string>(e, groupUniqueName, { groupUniqueName }));
  }

  public DeleteGroup(groupUniqueName: string): Observable<BaseResponse<string, string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.delete(GROUP_API.DELETE_GROUP.replace(':companyUniqueName', this.companyUniqueName).replace(':groupUniqueName', groupUniqueName)).map((res) => {
      let data: BaseResponse<string, string> = res.json();
      data.request = groupUniqueName;
      data.queryString = { groupUniqueName };
      return data;
    }).catch((e) => HandleCatch<string, string>(e, groupUniqueName, { groupUniqueName }));
  }

  public  GetFlattenGroupsAccounts(q: string = '', page: number = 1, count: number = 20000, showEmptyGroups: string = 'false'): Observable<BaseResponse<FlattenGroupsAccountsResponse, string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(GROUP_API.FLATTEN_GROUP_WITH_ACCOUNTS.replace(':companyUniqueName', this.companyUniqueName)
      .replace(':q', q)
      .replace(':page', page.toString())
      .replace(':count', count.toString())
      .replace(':showEmptyGroups', showEmptyGroups)).map((res) => {
      let data: BaseResponse<FlattenGroupsAccountsResponse, string> = res.json();
      data.request = '';
      data.queryString = { q, page, count, showEmptyGroups };
      // data.response.results.forEach(p => p.isOpen = false);
      return data;
    }).catch((e) => HandleCatch<FlattenGroupsAccountsResponse, string>(e, '', { q, page, count, showEmptyGroups }));
  }

  public GetTaxHierarchy(groupUniqueName: string): Observable<BaseResponse<GroupsTaxHierarchyResponse, string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(GROUP_API.TAX_HIERARCHY.replace(':companyUniqueName', this.companyUniqueName).replace(':groupUniqueName', groupUniqueName)).map((res) => {
      let data: BaseResponse<GroupsTaxHierarchyResponse, string> = res.json();
      data.request = groupUniqueName;
      data.queryString = { groupUniqueName };
      return data;
    }).catch((e) => HandleCatch<GroupsTaxHierarchyResponse, string>(e, groupUniqueName, { groupUniqueName }));
  }

}
