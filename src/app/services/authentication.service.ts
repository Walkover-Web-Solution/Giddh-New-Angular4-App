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
import { VerifyEmailModel, VerifyEmailResponseModel, SignupWithMobile, VerifyMobileModel } from '../models/api-models/loginModels';
import { HandleCatch, ErrorHandler } from './catchManager/catchmanger';

// import { UserManager, Log, MetadataService, User } from 'oidc-client';
@Injectable()
export class AuthenticationService {

  constructor(public _http: HttpWrapperService,
    public _router: Router,
    private _error: ErrorHandler
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

  public SignupWithMobile(email: SignupWithMobile): Observable<BaseResponse<string>> {
    return this._http.post(LOGIN_API.SignupWithMobile, email).map((res) => {
      let data: BaseResponse<string> = res.json();
      return data;
    }).catch((e) => HandleCatch<string>(e));
  }

  public VerifyOTP(modele: VerifyEmailModel): Observable<BaseResponse<VerifyEmailResponseModel>> {
    return this._http.post(LOGIN_API.VerifyOTP, modele).map((res) => {
      let data: BaseResponse<VerifyEmailResponseModel> = res.json();
      return data;
    }).catch((e) => HandleCatch<VerifyEmailResponseModel>(e));
  }

  public VerifyNumber(modele: SignupWithMobile): Observable<BaseResponse<string, SignupWithMobile>> {
    return this._http.post(LOGIN_API.VerifyNumber, modele).map((res) => {
      let data: BaseResponse<string, SignupWithMobile> = res.json();
      data.request = modele;
      return data;
    }).catch((e) => HandleCatch<string>(e));
  }

  public VerifyNumberOTP(modele: VerifyMobileModel): Observable<BaseResponse<string>> {
    return this._http.put(LOGIN_API.VerifyNumber, modele).map((res) => {
      let data: BaseResponse<string> = res.json();
      return data;
    }).catch((e) => HandleCatch<string>(e));
  }
}
