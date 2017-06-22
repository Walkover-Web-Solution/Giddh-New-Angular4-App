import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Configuration, URLS } from '../app.constants';
import { Router } from '@angular/router';
import { HttpWrapperService } from './httpWrapper.service';
import { ErrorHandlerService } from './errorhandler.service';
import { LoaderService } from './loader.service';
import { LOGIN_API } from './apiurls/login.api';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { VerifyEmailModel, VerifyEmailResponseModel } from '../models/api-models/loginModels';
import { HandleCatch } from './catchManager/catchmanger';

// import { UserManager, Log, MetadataService, User } from 'oidc-client';
@Injectable()
export class AuthenticationService {

  constructor(public _http: HttpWrapperService,
    public _router: Router
  ) {
  }

  public SignupWithEmail(email: string): Observable<BaseResponse<string>> {
    return this._http.post(LOGIN_API.SignupWithEmail, { email }).map((res) => {
      let data: BaseResponse<string> = res.json();
      return data;
    }).catch((e) => HandleCatch<string>(e));
  }

  public VerifyEmail(modele: VerifyEmailModel): Observable<BaseResponse<VerifyEmailResponseModel>> {
    return this._http.post(LOGIN_API.VerifyEmail, modele).map((res) => {
      let data: BaseResponse<VerifyEmailResponseModel> = res.json();
      return data;
    }).catch((e) => HandleCatch<VerifyEmailResponseModel>(e));
  }

  public SignupWithMobile(email: string): Observable<BaseResponse<string>> {
    return this._http.post(LOGIN_API.SignupWithEmail, { email }).map((res) => {
      let data: BaseResponse<string> = res.json();
      return data;
    }).catch((e) => HandleCatch<string>(e));
  }

  public VerifyOTP(modele: VerifyEmailModel): Observable<BaseResponse<VerifyEmailResponseModel>> {
    return this._http.post(LOGIN_API.VerifyEmail, modele).map((res) => {
      let data: BaseResponse<VerifyEmailResponseModel> = res.json();
      return data;
    }).catch((e) => HandleCatch<VerifyEmailResponseModel>(e));
  }
}
