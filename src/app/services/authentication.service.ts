import { catchError, map } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';

import { Observable } from 'rxjs';
import { Configuration, URLS } from '../app.constants';
import { Router } from '@angular/router';
import { HttpWrapperService } from './httpWrapper.service';
import { LoaderService } from './loader.service';
import { LOGIN_API } from './apiurls/login.api';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { AuthKeyResponse, LinkedInRequestModel, SignupWithMobile, UserDetails, VerifyEmailModel, VerifyEmailResponseModel, VerifyMobileModel, VerifyMobileResponseModel } from '../models/api-models/loginModels';
import { ErrorHandler } from './catchManager/catchmanger';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { LoginWithPassword, SignUpWithPassword } from '../models/api-models/login';

@Injectable()
export class AuthenticationService {

  constructor(private errorHandler: ErrorHandler,
              public _httpClient: HttpClient,
              public _http: HttpWrapperService,
              public _router: Router,
              private _generalService: GeneralService,
              @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {

  }

  public SignupWithEmail(email: string): Observable<BaseResponse<string, string>> {
    return this._http.post(this.config.apiUrl + LOGIN_API.SignupWithEmail, {email}).pipe(map((res) => {
      let data: BaseResponse<string, string> = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e, email)));
  }

  public VerifyEmail(model: VerifyEmailModel): Observable<BaseResponse<VerifyEmailResponseModel, VerifyEmailModel>> {
    return this._http.post(this.config.apiUrl + LOGIN_API.VerifyEmail, model).pipe(map((res) => {
      let data: BaseResponse<VerifyEmailResponseModel, VerifyEmailModel> = res;
      data.request = model;
      // console.log(data);
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<VerifyEmailResponseModel, VerifyEmailModel>(e, model)));
  }

  public SignupWithMobile(model: SignupWithMobile): Observable<BaseResponse<string, SignupWithMobile>> {
    return this._http.post(this.config.apiUrl + LOGIN_API.SignupWithMobile, model).pipe(map((res) => {
      let data: BaseResponse<string, SignupWithMobile> = res;
      data.request = model;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<string, SignupWithMobile>(e, model)));
    // return this._http.get(this.config.apiUrl + LOGIN_API.LoginWithNumber.replace(':countryCode', String(model.countryCode)).replace(':mobileNumber', model.mobileNumber)).map((res) => {
    //   let data: BaseResponse<string, SignupWithMobile> = res;
    //   data.request = model;
    //   return data;
    // }).catch((e) => this.errorHandler.HandleCatch<string, SignupWithMobile>(e, model));
  }

  public VerifyOTP(modele: VerifyMobileModel): Observable<BaseResponse<VerifyMobileResponseModel, VerifyMobileModel>> {
    return this._http.post(this.config.apiUrl + LOGIN_API.VerifyOTP, modele).pipe(map((res) => {
      let data: BaseResponse<VerifyMobileResponseModel, VerifyMobileModel> = res;
      data.request = modele;
      // console.log(data);
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<VerifyMobileResponseModel, VerifyMobileModel>(e, modele)));
  }

  public SignupWithPassword(modele: SignUpWithPassword): Observable<BaseResponse<VerifyMobileResponseModel, SignUpWithPassword>> {
    return this._http.post(this.config.apiUrl + LOGIN_API.SignupWithPassword, modele).pipe(map((res) => {
      let data: BaseResponse<VerifyMobileResponseModel, SignUpWithPassword> = res;
      data.request = modele;
      // console.log(data);
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<VerifyMobileResponseModel, SignUpWithPassword>(e, modele)));
  }

  public LoginWithPassword(modele: LoginWithPassword): Observable<BaseResponse<VerifyMobileResponseModel, LoginWithPassword>> {
    return this._http.post(this.config.apiUrl + LOGIN_API.LoginWithPassword, modele).pipe(map((res) => {
      let data: BaseResponse<VerifyMobileResponseModel, LoginWithPassword> = res;
      data.request = modele;
      // console.log(data);
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<VerifyMobileResponseModel, LoginWithPassword>(e, modele)));
  }

  public VerifyNumber(modele: SignupWithMobile): Observable<BaseResponse<string, SignupWithMobile>> {
    return this._http.post(this.config.apiUrl + LOGIN_API.VerifyNumber, modele).pipe(map((res) => {
      let data: BaseResponse<string, SignupWithMobile> = res;
      data.request = modele;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<string, SignupWithMobile>(e, modele)));
  }

  public VerifyNumberOTP(modele: VerifyMobileModel): Observable<BaseResponse<string, VerifyMobileModel>> {
    return this._http.put(this.config.apiUrl + LOGIN_API.VerifyNumber, modele).pipe(map((res) => {
      let data: BaseResponse<string, VerifyMobileModel> = res;
      data.request = modele;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<string, VerifyMobileModel>(e)));
  }

  public ClearSession(): Observable<BaseResponse<string, string>> {
    let userName = this._generalService.user.uniqueName;
    return this._http.delete(this.config.apiUrl + LOGIN_API.CLEAR_SESSION.replace(':userUniqueName', encodeURIComponent(userName))).pipe(map((res) => {
      let data: BaseResponse<string, string> = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e)));
  }

  public LoginWithGoogle(token: string) {
    let args: any = {headers: {}};
    args.headers['cache-control'] = 'no-cache';
    args.headers['Content-Type'] = 'application/json';
    args.headers['Accept'] = 'application/json';
    args.headers['Access-Token'] = token;
    args.headers = new HttpHeaders(args.headers);
    return this._httpClient.get(this.config.apiUrl + LOGIN_API.LOGIN_WITH_GOOGLE, {
      headers: args.headers,
      responseType: 'json'
    }).pipe(map((res) => {
      let data: BaseResponse<VerifyEmailResponseModel, string> = res as BaseResponse<VerifyEmailResponseModel, string>;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<VerifyEmailResponseModel, string>(e, args)));
  }

  public LoginWithLinkedin(model: LinkedInRequestModel) {

    let args: any = {headers: {}};
    args.headers['cache-control'] = 'no-cache';
    args.headers['Content-Type'] = 'application/json';
    args.headers['Accept'] = 'application/json';
    args.headers['Access-Token'] = model.token;
    args.headers['User-Email'] = model.email;
    args.headers = new HttpHeaders(args.headers);

    return this._httpClient.get(this.config.apiUrl + LOGIN_API.LOGIN_WITH_LINKEDIN, {
      headers: args.headers,
      responseType: 'json'
    }).pipe(map((res) => {
      let data: BaseResponse<VerifyEmailResponseModel, LinkedInRequestModel> = res as BaseResponse<VerifyEmailResponseModel, LinkedInRequestModel>;
      data.request = model;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<VerifyEmailResponseModel, LinkedInRequestModel>(e, args)));
  }

  public SetSettings(model): Observable<BaseResponse<string, string>> {
    let uniqueName = this._generalService.user.uniqueName;

    return this._http.put(this.config.apiUrl + LOGIN_API.SET_SETTINGS
      .replace(':userUniqueName', encodeURIComponent(uniqueName)), model).pipe(map((res) => {
      let data: BaseResponse<string, string> = res;
      data.request = '';
      data.queryString = {};
      // data.response.results.forEach(p => p.isOpen = false);
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e, '')));
  }

  public FetchUserDetails(): Observable<BaseResponse<UserDetails, string>> {

    let sessionId = this._generalService.user.uniqueName;

    return this._http.get(this.config.apiUrl + LOGIN_API.FETCH_DETAILS
      .replace(':sessionId', sessionId)).pipe(map((res) => {
      let data: BaseResponse<UserDetails, string> = res;
      data.request = '';
      data.queryString = {};
      // data.response.results.forEach(p => p.isOpen = false);
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<UserDetails, string>(e, '')));
  }

  public GetSubScribedCompanies(): Observable<BaseResponse<string, string>> {
    let userUniqueName = this._generalService.user.uniqueName;

    return this._http.get(this.config.apiUrl + LOGIN_API.SUBSCRIBED_COMPANIES
      .replace(':userUniqueName', userUniqueName)).pipe(map((res) => {
      let data: BaseResponse<string, string> = res;
      data.request = '';
      data.queryString = {};
      // data.response.results.forEach(p => p.isOpen = false);
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e, '')));
  }

  public AddBalance(model): Observable<BaseResponse<string, string>> {
    let uniqueName = this._generalService.user.uniqueName;

    return this._http.get(this.config.apiUrl + LOGIN_API.ADD_BALANCE
      .replace(':uniqueName', uniqueName)).pipe(map((res) => {
      let data: BaseResponse<string, string> = res;
      data.request = '';
      data.queryString = {};
      // data.response.results.forEach(p => p.isOpen = false);
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e, '')));
  }

  public GetAuthKey(): Observable<BaseResponse<AuthKeyResponse, string>> {
    let uniqueName = this._generalService.user.uniqueName;

    return this._http.get(this.config.apiUrl + LOGIN_API.GET_AUTH_KEY
      .replace(':uniqueName', uniqueName)).pipe(map((res) => {
      let data: BaseResponse<AuthKeyResponse, string> = res;
      data.request = '';
      data.queryString = {};
      // data.response.results.forEach(p => p.isOpen = false);
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<AuthKeyResponse, string>(e, '')));
  }

  public RegenerateAuthKey(): Observable<BaseResponse<AuthKeyResponse, string>> {
    let userEmail = this._generalService.user.email;

    return this._http.put(this.config.apiUrl + LOGIN_API.REGENERATE_AUTH_KEY
      .replace(':userEmail', userEmail), {}).pipe(map((res) => {
      let data: BaseResponse<AuthKeyResponse, string> = res;
      data.request = '';
      data.queryString = {};
      // data.response.results.forEach(p => p.isOpen = false);
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<AuthKeyResponse, string>(e, '')));
  }

  public ReportInvalidJSON(model): Observable<BaseResponse<AuthKeyResponse, string>> {
    model.email = this._generalService.user.email;
    model.environment = this.config.apiUrl;
    model.userUniqueName = this._generalService.user.uniqueName;
    return this._http.post(this.config.apiUrl + 'exception/invalid-json', model).pipe(map((res) => {
      let data: BaseResponse<AuthKeyResponse, string> = res;
      data.request = '';
      data.queryString = {};
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<AuthKeyResponse, string>(e, '')));
  }

  // fetch user profile picture using emailId
  public getUserAvatar(userId) {
    return this._http.get('https://picasaweb.google.com/data/entry/api/user/:user_id?alt=json'
      .replace(':user_id', userId)).pipe(map(res => {
      let data = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }

  // Get User Sessions
  public GetUserSession() {
    let userEmail = this._generalService.user.email;
    return this._http.get(this.config.apiUrl + LOGIN_API.GET_SESSION
      .replace(':userEmail', userEmail)).pipe(map(res => {
      let data = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }

  // Delete Single Sessions
  public DeleteSession(sessionId) {
    let userEmail = this._generalService.user.email;
    let id = {sessionId};
    return this._http.post(this.config.apiUrl + LOGIN_API.DELETE_SESSION.replace(':userEmail', userEmail), id).pipe(map(res => {
      let data = res;
      data.queryString = id;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }

  // Delete All Sessions
  public DeleteAllSession() {
    let userEmail = this._generalService.user.email;
    return this._http.delete(this.config.apiUrl + LOGIN_API.DELETE_ALL_SESSION.replace(':userEmail', userEmail)).pipe(map(res => {
      let data = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }

  // Delete All Sessions
  public UpdateSession() {
    let userEmail = this._generalService.user.email;
    return this._http.put(this.config.apiUrl + LOGIN_API.UPDATE_SESSION
      .replace(':userEmail', userEmail), '').pipe(map(res => {
      let data = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }

  // Get Electron App Version
  public GetElectronAppVersion() {
    let args: any = {headers: {}};
    args.headers['cache-control'] = 'no-cache';
    args.headers['Content-Type'] = 'application/xml';
    // args.headers['Accept'] = 'application/xml';
    args.headers = new HttpHeaders(args.headers);
    return this._httpClient.get('https://s3-ap-south-1.amazonaws.com/giddh-app-builds/latest.yml', {
      headers: args.headers,
      responseType: 'text'
    }).pipe(map((res) => {
      // let data: BaseResponse<VerifyEmailResponseModel, LinkedInRequestModel> = res as BaseResponse<any, any>;
      return res;
    }), catchError((e) => this.errorHandler.HandleCatch<VerifyEmailResponseModel, LinkedInRequestModel>(e, args)));
  }

  public forgotPassword(userId): Observable<BaseResponse<string, any>> {
    let userName = userId;
    return this._http.put(this.config.apiUrl + LOGIN_API.FORGOT_PASSWORD.replace(':userEmail', userName), {}).pipe(map((res) => {
      let data: BaseResponse<string, any> = res;
      data.request = userId;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<string, any>(e)));
  }

  public resetPassword(model): Observable<BaseResponse<string, any>> {
    let objToSend = model;
    return this._http.put(this.config.apiUrl + LOGIN_API.RESET_PASSWORD, objToSend).pipe(map((res) => {
      let data: BaseResponse<string, any> = res;
      data.request = model;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<string, any>(e)));
  }

  public renewSession(): Observable<BaseResponse<any, any>> {
    let userName = this._generalService.user.uniqueName;
    return this._http.put(this.config.apiUrl + LOGIN_API.RENEW_SESSION.replace(':userUniqueName', encodeURIComponent(userName)), null).pipe(map((res) => {
      let data: BaseResponse<string, any> = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<string, any>(e)));
  }

  public saveGmailAuthCode(data) {
    return this._http.post(this.config.apiUrl + 'users/generate-mail-token', data);
  }
}
