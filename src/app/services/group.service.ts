import { GROUP_API } from './apiurls/group.api';
import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Configuration, URLS } from '../app.constants';
import { Router } from '@angular/router';
import { HttpWrapperService } from './httpWrapper.service';
import { ErrorHandlerService } from './errorhandler.service';
import { LoaderService } from './loader.service';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { VerifyEmailModel, VerifyEmailResponseModel } from '../models/api-models/loginModels';
import { HandleCatch } from './catchManager/catchmanger';
import { GroupResponse, GroupCreateRequest, ShareGroupRequest } from '../models/api-models/Group';

// import { UserManager, Log, MetadataService, User } from 'oidc-client';
@Injectable()
export class GroupService {

  constructor(public _http: HttpWrapperService,
    public _router: Router
  ) {
  }
  public CreateGroup(modele: GroupCreateRequest): Observable<BaseResponse<GroupResponse>> {
    return this._http.post(GROUP_API.CREATE, modele).map((res) => {
      let data: BaseResponse<GroupResponse> = res.json();
      return data;
    }).catch((e) => HandleCatch<GroupResponse>(e));
  }
  public ShareGroup(modele: ShareGroupRequest): Observable<BaseResponse<string>> {
    return this._http.put(GROUP_API.CREATE, modele).map((res) => {
      let data: BaseResponse<string> = res.json();
      return data;
    }).catch((e) => HandleCatch<string>(e));
  }

  public ShareWithGroup(modele: ShareGroupRequest): Observable<BaseResponse<string>> {
    return this._http.put(GROUP_API.CREATE, modele).map((res) => {
      let data: BaseResponse<string> = res.json();
      return data;
    }).catch((e) => HandleCatch<string>(e));
  }

}
