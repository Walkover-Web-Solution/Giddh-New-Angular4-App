import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
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
import { GroupUpateRequest, GroupSharedWithResponse, GroupResponse, GroupCreateRequest, ShareGroupRequest, MoveGroupRequest } from '../models/api-models/Group';
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
  public CreateGroup(modele: GroupCreateRequest): Observable<BaseResponse<GroupResponse>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.post(GROUP_API.CREATE.replace(':companyUniqueName', this.companyUniqueName), modele).map((res) => {
      let data: BaseResponse<GroupResponse> = res.json();
      return data;
    }).catch((e) => HandleCatch<GroupResponse>(e));
  }

  public UpdateGroup(modele: GroupUpateRequest, groupUniqueName: string): Observable<BaseResponse<GroupResponse>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.put(GROUP_API.UPDATE.replace(':companyUniqueName', this.companyUniqueName).replace(':groupUniqueName', groupUniqueName), modele).map((res) => {
      let data: BaseResponse<GroupResponse> = res.json();
      return data;
    }).catch((e) => HandleCatch<GroupResponse>(e));
  }
  public ShareGroup(modele: ShareGroupRequest, groupUniqueName: string): Observable<BaseResponse<string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.put(GROUP_API.SHARE.replace(':companyUniqueName', this.companyUniqueName).replace(':groupUniqueName', groupUniqueName), modele).map((res) => {
      let data: BaseResponse<string> = res.json();
      return data;
    }).catch((e) => HandleCatch<string>(e));
  }

  public ShareWithGroup(modele: GroupSharedWithResponse, groupUniqueName: string): Observable<BaseResponse<string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(GROUP_API.SHARED_WITH.replace(':companyUniqueName', this.companyUniqueName).replace(':groupUniqueName', groupUniqueName), modele).map((res) => {
      let data: BaseResponse<string> = res.json();
      return data;
    }).catch((e) => HandleCatch<string>(e));
  }

  public GetGroupsWithAccounts(q: string): Observable<BaseResponse<GroupsWithAccountsResponse[]>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(GROUP_API.GROUPS_WITH_ACCOUNT.replace(':companyUniqueName', this.companyUniqueName).replace(':q', q)).map((res) => {
      let data: BaseResponse<GroupsWithAccountsResponse[]> = res.json();
      return data;
    }).catch((e) => HandleCatch<GroupsWithAccountsResponse[]>(e));
  }

  public MoveGroup(modele: MoveGroupRequest, groupUniqueName: string): Observable<BaseResponse<string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(GROUP_API.MOVA_GROUP.replace(':companyUniqueName', this.companyUniqueName).replace(':groupUniqueName', groupUniqueName), modele).map((res) => {
      let data: BaseResponse<string> = res.json();
      return data;
    }).catch((e) => HandleCatch<string>(e));
  }

  public DeleteGroup(groupUniqueName: string): Observable<BaseResponse<string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.delete(GROUP_API.DELETE_GROUP.replace(':companyUniqueName', this.companyUniqueName).replace(':groupUniqueName', groupUniqueName)).map((res) => {
      let data: BaseResponse<string> = res.json();
      return data;
    }).catch((e) => HandleCatch<string>(e));
  }

  public GetSubGroup(groupUniqueName: string): Observable<BaseResponse<GroupResponse[]>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(GROUP_API.GROUPS_WITH_ACCOUNT.replace(':companyUniqueName', this.companyUniqueName).replace(':groupUniqueName', groupUniqueName)).map((res) => {
      let data: BaseResponse<GroupResponse[]> = res.json();
      return data;
    }).catch((e) => HandleCatch<GroupResponse[]>(e));
  }

}
