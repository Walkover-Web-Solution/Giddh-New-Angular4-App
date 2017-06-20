import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Configuration, URLS } from '../app.constants';
import { Router } from '@angular/router';
import { HttpWrapperService } from './httpWrapper.service';
import { CurrentUserService } from './currentUser.service';
import { ErrorHandlerService } from './errorhandler.service';
import { LoaderService } from './loader.service';
import { LOGIN_API } from './apiurls/login.api';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { VerifyEmailModel, VerifyEmailResponseModel } from '../models/api-models/loginModels';

// import { UserManager, Log, MetadataService, User } from 'oidc-client';
@Injectable()
export class AuthenticationService {

  constructor(public _http: HttpWrapperService,
    public _router: Router,
    public _currentUserService: CurrentUserService,
  ) {
  }

  public SignupWithEmail(email: string): Observable<BaseResponse<string>> {
    return this._http.post(LOGIN_API.SignupWithEmail, { email }).map((res) => {
      let data: BaseResponse<string> = res.json();
      return data;
    }).catch((e) => {
      let data: BaseResponse<string> = {
        body: 'something went wrong',
        code: 'Internal Error',
        message: 'Internal Error',
        status: 'error'
      };
      return new Observable<BaseResponse<string>>((o) => { o.next(data); });
    });
  }

  public VerifyEmail(modele: VerifyEmailModel): Observable<BaseResponse<VerifyEmailResponseModel>> {
    return this._http.post(LOGIN_API.VerifyEmail, modele).map((res) => {
      let data: BaseResponse<VerifyEmailResponseModel> = res.json();
      return data;
    }).catch((e) => {
      let data: BaseResponse<VerifyEmailResponseModel> = {
        body: null,
        code: 'Internal Error',
        message: 'something went wrong',
        status: 'error'
      };
      return new Observable<BaseResponse<VerifyEmailResponseModel>>((o) => { o.next(data); });
    });
  }

  public HandleError(error: any) {
    console.log(error);
    if (error.status === 403) {
      this._router.navigate(['/Forbidden']);
    } else if (error.status === 401) {
      this._router.navigate(['/Unauthorized']);
    }
  }
}
