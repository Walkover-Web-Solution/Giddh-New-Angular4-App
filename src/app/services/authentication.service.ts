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
import { VerifyEmailModel, VerifyEmailResponseModel, SignupWithMobile, VerifyMobileModel, VerifyLoginOTPResponse } from '../models/api-models/loginModels';
import { HandleCatch, ErrorHandler } from './catchManager/catchmanger';

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

  public VerifyEmail(modele: VerifyEmailModel): Observable<BaseResponse<VerifyEmailResponseModel, VerifyEmailModel>> {
    return this._http.post(LOGIN_API.VerifyEmail, modele).map((res) => {
      let data: BaseResponse<VerifyEmailResponseModel, VerifyEmailModel> = res.json();
      data.request = modele;
      return data;
    }).catch((e) => HandleCatch<VerifyEmailResponseModel, VerifyEmailModel>(e, modele));
  }

  public SignupWithMobile(email: SignupWithMobile): Observable<BaseResponse<string, SignupWithMobile>> {
    return this._http.post(LOGIN_API.SignupWithMobile, email).map((res) => {
      let data: BaseResponse<string, SignupWithMobile> = res.json();
      data.request = email;
      return data;
    }).catch((e) => HandleCatch<string, SignupWithMobile>(e, email));
  }

  public VerifyOTP(modele: VerifyEmailModel): Observable<BaseResponse<VerifyEmailResponseModel, VerifyEmailModel>> {
    return this._http.post(LOGIN_API.VerifyOTP, modele).map((res) => {
      let data: BaseResponse<VerifyEmailResponseModel, VerifyEmailModel> = res.json();
      data.request = modele;
      return data;
    }).catch((e) => HandleCatch<VerifyEmailResponseModel, VerifyEmailModel>(e, modele));
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

  public VerifyLoginOTP(model: VerifyMobileModel): Observable<BaseResponse<VerifyLoginOTPResponse, VerifyMobileModel>> {
    // NOTE:: we have to pass headers in this request
    return this._http.post(LOGIN_API.VerifyLoginOTP, model).map((res) => {
      let data: BaseResponse<VerifyLoginOTPResponse, VerifyMobileModel> = res.json();
      data.request = model;
      return data;
    }).catch((e) => HandleCatch<VerifyLoginOTPResponse, VerifyMobileModel>(e));
  }

  public LoginWithNumber(countryCode: string = '91', mobileNumber: string = '' ): Observable<BaseResponse<VerifyLoginOTPResponse, string>> {
    // NOTE:: we have to pass headers in this request
    return this._http.get(LOGIN_API.VerifyLoginOTP.replace(':countryCode', countryCode).replace(':mobileNumber', mobileNumber), '').map((res) => {
      let data: BaseResponse<VerifyLoginOTPResponse, string> = res.json();
      data.request = '';
      data.queryString = { countryCode, mobileNumber };
      return data;
    }).catch((e) => HandleCatch<VerifyLoginOTPResponse, string>(e, { countryCode, mobileNumber }));
  }
}
