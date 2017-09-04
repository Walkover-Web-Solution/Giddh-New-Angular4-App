import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Configuration, URLS } from '../app.constants';
import { Router } from '@angular/router';
import { HttpWrapperService } from './httpWrapper.service';
import { LoaderService } from './loader.service';
import { LOGIN_API } from './apiurls/login.api';
import { BaseResponse } from '../models/api-models/BaseResponse';
import {
  SignupWithMobile,
  VerifyEmailModel,
  VerifyEmailResponseModel,
  VerifyMobileModel,
  VerifyMobileResponseModel
} from '../models/api-models/loginModels';
import { ErrorHandler, HandleCatch } from './catchManager/catchmanger';

// import { UserManager, Log, MetadataService, User } from 'oidc-client';
@Injectable()
export class AuthenticationService {

  constructor(public _http: HttpWrapperService,
    public _router: Router,
    private _error: ErrorHandler
  ) {
  }

  public SignupWithEmail(email: string): Observable<BaseResponse<string, string>> {
    return this._http.post(LOGIN_API.SignupWithEmail, { email }).map((res) => {
      let data: BaseResponse<string, string> = res.json();
      return data;
    }).catch((e) => HandleCatch<string, string>(e, email));
  }

  public VerifyEmail(model: VerifyEmailModel): Observable<BaseResponse<VerifyEmailResponseModel, VerifyEmailModel>> {
    return this._http.post(LOGIN_API.VerifyEmail, model).map((res) => {
      let data: BaseResponse<VerifyEmailResponseModel, VerifyEmailModel> = res.json();
      data.request = model;
      console.log(data);
      return data;
    }).catch((e) => HandleCatch<VerifyEmailResponseModel, VerifyEmailModel>(e, model));
  }

  public SignupWithMobile(model: SignupWithMobile): Observable<BaseResponse<string, SignupWithMobile>> {
    return this._http.post(LOGIN_API.SignupWithMobile, model).map((res) => {
      let data: BaseResponse<string, SignupWithMobile> = res.json();
      data.request = model;
      return data;
    }).catch((e) => HandleCatch<string, SignupWithMobile>(e, model));
  }

  public VerifyOTP(modele: VerifyMobileModel): Observable<BaseResponse<VerifyMobileResponseModel, VerifyMobileModel>> {
    return this._http.post(LOGIN_API.VerifyOTP, modele).map((res) => {
      let data: BaseResponse<VerifyMobileResponseModel, VerifyMobileModel> = res.json();
      data.request = modele;
      console.log(data);
      return data;
    }).catch((e) => HandleCatch<VerifyMobileResponseModel, VerifyMobileModel>(e, modele));
  }

  public VerifyNumber(modele: SignupWithMobile): Observable<BaseResponse<string, SignupWithMobile>> {
    return this._http.post(LOGIN_API.VerifyNumber, modele).map((res) => {
      let data: BaseResponse<string, SignupWithMobile> = res.json();
      data.request = modele;
      return data;
    }).catch((e) => HandleCatch<string, SignupWithMobile>(e, modele));
  }

  public VerifyNumberOTP(modele: VerifyMobileModel): Observable<BaseResponse<string, VerifyMobileModel>> {
    return this._http.put(LOGIN_API.VerifyNumber, modele).map((res) => {
      let data: BaseResponse<string, VerifyMobileModel> = res.json();
      data.request = modele;
      return data;
    }).catch((e) => HandleCatch<string, VerifyMobileModel>(e));
  }
}
