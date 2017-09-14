import { VerifyMobileResponseModel, VerifyMobileModel, SignupWithMobileResponse, SignupWithMobile } from '../../models/api-models/loginModels';
import { ToasterService } from '../toaster.service';
import { AuthenticationService } from '../authentication.service';
import { Injectable } from '@angular/core';
import { Response, RequestOptionsArgs, Http } from '@angular/http';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import {
  VerifyEmailResponseModel,
  VerifyEmailModel,
  LinkedInRequestModel
} from '../../models/api-models/loginModels';
import { AppState } from '../../store/roots';
import { CompanyActions } from './company.actions';
import { Router } from '@angular/router';
import { go, replace, search, show, back, forward } from '@ngrx/router-store';
import { userLoginStateEnum } from '../../store/authentication/authentication.reducer';
import { StateDetailsResponse, ComapnyResponse } from '../../models/api-models/Company';
import { CompanyService } from '../companyService.service';
import { Configuration } from '../../app.constant';
@Injectable()
export class LoginActions {

  public static SOCIAL_LOGOUT_ATTEMPT = 'SOCIAL_LOGOUT_ATTEMPT';
  public static SIGNUP_WITH_GOOGLE_REQUEST = 'SIGNUP_WITH_GOOGLE_REQUEST';
  public static SIGNUP_WITH_GOOGLE_RESPONSE = 'SIGNUP_WITH_GOOGLE_RESPONSE';

  public static SIGNUP_WITH_LINKEDIN_REQUEST = 'SIGNUP_WITH_LINKEDIN_REQUEST';
  public static SIGNUP_WITH_LINKEDIN_RESPONSE = 'SIGNUP_WITH_LINKEDIN_RESPONSE';

  public static SignupWithEmailRequest = 'SignupWithEmailRequest';
  public static SignupWithEmailResponce = 'SignupWithEmailResponce';
  public static SignupWithMobileRequest = 'SignupWithMobileRequest';
  public static SignupWithMobileResponce = 'SignupWithMobileResponce';

  public static VerifyEmailRequest = 'VerifyEmailRequest';
  public static VerifyEmailResponce = 'VerifyEmailResponce';

  public static VerifyMobileRequest = 'VerifyMobileRequest';
  public static VerifyMobileResponce = 'VerifyMobileResponce';
  public static LoginSuccess = 'LoginSuccess';
  public static LogOut = 'LoginOut';
  public static SetLoginStatus = 'SetLoginStatus';
  public static GoogleLoginElectron = 'GoogleLoginElectron';
  public static LinkedInLoginElectron = 'LinkedInLoginElectron';

  @Effect()
  public signupWithGoogle$: Observable<Action> = this.actions$
    .ofType(LoginActions.SIGNUP_WITH_GOOGLE_REQUEST)
    .switchMap(action =>
      this.auth.LoginWithGoogle(action.payload)
    )
    .map(response => this.signupWithGoogleResponse(response));

  @Effect()
  public signupWithGoogleResponse$: Observable<Action> = this.actions$
    .ofType(LoginActions.SIGNUP_WITH_GOOGLE_RESPONSE)
    .map(action => {
      if (action.payload.status === 'error') {
        this._toaster.errorToast(action.payload.message, action.payload.code);
        return { type: '' };
      }
      return this.LoginSuccess();
    });

    @Effect()
    public signupWithLinkedin$: Observable<Action> = this.actions$
      .ofType(LoginActions.SIGNUP_WITH_LINKEDIN_REQUEST)
      .switchMap(action =>
        this.auth.LoginWithLinkedin(action.payload)
      )
      .map(response => this.signupWithLinkedinResponse(response));

    @Effect()
    public signupWithLinkedinResponse$: Observable<Action> = this.actions$
      .ofType(LoginActions.SIGNUP_WITH_LINKEDIN_RESPONSE)
      .map(action => {
        if (action.payload.status === 'error') {
          this._toaster.errorToast(action.payload.message, action.payload.code);
          return { type: '' };
        }
        return this.LoginSuccess();
      });

  @Effect()
  public signupWithEmail$: Observable<Action> = this.actions$
    .ofType(LoginActions.SignupWithEmailRequest)
    .switchMap(action => this.auth.SignupWithEmail(action.payload))
    .map(response => this.SignupWithEmailResponce(response));

  @Effect()
  public signupWithEmailResponse$: Observable<Action> = this.actions$
    .ofType(LoginActions.SignupWithEmailResponce)
    .map(action => {
      if (action.payload.status === 'success') {
        this._toaster.successToast(action.payload.body);
      } else {
        this._toaster.errorToast(action.payload.message, action.payload.code);
      }
      return { type: '' };
    });

  @Effect()
  public verifyEmail$: Observable<Action> = this.actions$
    .ofType(LoginActions.VerifyEmailRequest)
    .switchMap(action =>
      this.auth.VerifyEmail(action.payload as VerifyEmailModel)
    )
    .map(response => this.VerifyEmailResponce(response));

  @Effect()
  public verifyEmailResponse$: Observable<Action> = this.actions$
    .ofType(LoginActions.VerifyEmailResponce)
    .map(action => {
      if (action.payload.status === 'error') {
        this._toaster.errorToast(action.payload.message, action.payload.code);
        return { type: '' };
      }
      return this.LoginSuccess();
    });

  @Effect()
  public signupWithMobile$: Observable<Action> = this.actions$
    .ofType(LoginActions.SignupWithMobileRequest)
    .switchMap(action => this.auth.SignupWithMobile(action.payload))
    .map(response => this.SignupWithMobileResponce(response));

  @Effect()
  public signupWithMobileResponse$: Observable<Action> = this.actions$
    .ofType(LoginActions.SignupWithMobileResponce)
    .map(action => {
      if (action.payload.status === 'success') {
        this._toaster.successToast(action.payload.body);
      } else {
        this._toaster.errorToast(action.payload.message, action.payload.code);
      }
      return { type: '' };
    });

  @Effect()
  public loginSuccess$: Observable<Action> = this.actions$
    .ofType(LoginActions.LoginSuccess)
    .switchMap((action) => {
      let stateDetail$ = this._companyService.getStateDetailsAuthGuard('');
      let companies$ = this._companyService.CompanyList();
      return Observable.forkJoin(stateDetail$, companies$);
    }).map((results: any[]) => {
      let cmpUniqueName = '';
      let stateDetail = results[0] as BaseResponse<StateDetailsResponse, string>;
      let companies = results[1] as BaseResponse<ComapnyResponse[], string>;
      if (companies.body.length === 0) {
        // this.store.dispatch(this.comapnyActions.RefreshCompaniesResponse(companies));
        this.store.dispatch(this.SetLoginStatus(userLoginStateEnum.newUserLoggedIn));
        return go(['/pages/new-user']);
      } else {
        if (stateDetail.body) {
          cmpUniqueName = stateDetail.body.companyUniqueName;
          if (companies.body.findIndex(p => p.uniqueName === cmpUniqueName) > -1) {
            this.store.dispatch(this.comapnyActions.GetStateDetailsResponse(stateDetail));
            this.store.dispatch(this.comapnyActions.RefreshCompaniesResponse(companies));
            this.store.dispatch(this.SetLoginStatus(userLoginStateEnum.userLoggedIn));
            // this.store.dispatch(replace(['/pages/home']));
            return go(['/pages/home']);
          } else {
            let respState = new BaseResponse<StateDetailsResponse, string>();
            respState.body = new StateDetailsResponse();
            respState.body.companyUniqueName = companies.body[0].uniqueName;
            respState.body.lastState = 'home';
            respState.status = 'success';
            respState.request = '';
            this.store.dispatch(this.comapnyActions.GetStateDetailsResponse(respState));
            this.store.dispatch(this.comapnyActions.RefreshCompaniesResponse(companies));
            this.store.dispatch(this.SetLoginStatus(userLoginStateEnum.userLoggedIn));
            return go(['/pages/home']);
          }
        } else {
          let respState = new BaseResponse<StateDetailsResponse, string>();
          respState.body = new StateDetailsResponse();
          respState.body.companyUniqueName = companies.body[0].uniqueName;
          respState.body.lastState = 'home';
          respState.status = 'success';
          respState.request = '';
          this.store.dispatch(this.comapnyActions.GetStateDetailsResponse(respState));
          this.store.dispatch(this.comapnyActions.RefreshCompaniesResponse(companies));
          this.store.dispatch(this.SetLoginStatus(userLoginStateEnum.userLoggedIn));
          return go(['/pages/home']);
        }
      }
      // return { type: '' };
    });

  @Effect()
  public logoutSuccess$: Observable<Action> = this.actions$
    .ofType(LoginActions.LogOut)
    .map(action => {
      this.store.dispatch(go(['/login']));
      return { type: '' };
    });

  @Effect()
  public verifyMobile$: Observable<Action> = this.actions$
    .ofType(LoginActions.VerifyMobileRequest)
    .switchMap(action =>
      this.auth.VerifyOTP(action.payload as VerifyMobileModel)
    )
    .map(response => this.VerifyMobileResponce(response));

  @Effect()
  public verifyMobileResponse$: Observable<Action> = this.actions$
    .ofType(LoginActions.VerifyMobileResponce)
    .map(action => {
      if (action.payload.status === 'error') {
        this._toaster.errorToast(action.payload.message, action.payload.code);
        return { type: '' };
      }
      return this.LoginSuccess();
    });

  @Effect()
  public GoogleElectronLogin$: Observable<Action> = this.actions$
    .ofType(LoginActions.GoogleLoginElectron)
    .switchMap(action => {
      return this.http.get(Configuration.ApiUrl + 'v2/login-with-google', action.payload).map(p => p.json());
    })
    .map(data => {
      if (data.status === 'error') {
        this._toaster.errorToast(data.message, data.code);
        return { type: '' };
      }
      // return this.LoginSuccess();
      return this.signupWithGoogleResponse(data);
    });

    @Effect()
    public LinkedInElectronLogin$: Observable<Action> = this.actions$
      .ofType(LoginActions.LinkedInLoginElectron)
      .switchMap(action => {
        return this.http.get(Configuration.ApiUrl + 'v2/login-with-linkedIn', action.payload).map(p => p.json());
      })
      .map(data => {
        if (data.status === 'error') {
          this._toaster.errorToast(data.message, data.code);
          return { type: '' };
        }
        // return this.LoginSuccess();
        return this.signupWithGoogleResponse(data);
      });
  constructor(
    public _router: Router,
    private actions$: Actions,
    private auth: AuthenticationService,
    public _toaster: ToasterService,
    private store: Store<AppState>,
    private comapnyActions: CompanyActions,
    private _companyService: CompanyService,
    private http: Http
  ) { }
  public SignupWithEmailRequest(value: string): Action {
    return {
      type: LoginActions.SignupWithEmailRequest,
      payload: value
    };
  }
  public SignupWithEmailResponce(value: BaseResponse<string, string>): Action {
    return {
      type: LoginActions.SignupWithEmailResponce,
      payload: value
    };
  }

  public SignupWithMobileRequest(value: SignupWithMobile): Action {
    return {
      type: LoginActions.SignupWithMobileRequest,
      payload: value
    };
  }
  public SignupWithMobileResponce(value: BaseResponse<string, SignupWithMobile>): Action {
    return {
      type: LoginActions.SignupWithMobileResponce,
      payload: value
    };
  }

  public VerifyEmailRequest(value: VerifyEmailModel): Action {
    return {
      type: LoginActions.VerifyEmailRequest,
      payload: value
    };
  }
  public VerifyEmailResponce(value: BaseResponse<VerifyEmailResponseModel, VerifyEmailModel>): Action {
    return {
      type: LoginActions.VerifyEmailResponce,
      payload: value
    };
  }

  public signupWithGoogle(value: string): Action {
    return {
      type: LoginActions.SIGNUP_WITH_GOOGLE_REQUEST,
      payload: value
    };
  }
  public signupWithGoogleResponse(value: BaseResponse<VerifyEmailResponseModel, string>): Action {
    return {
      type: LoginActions.SIGNUP_WITH_GOOGLE_RESPONSE,
      payload: value
    };
  }

  public signupWithLinkedin(value: LinkedInRequestModel): Action {
    return {
      type: LoginActions.SIGNUP_WITH_LINKEDIN_REQUEST,
      payload: value
    };
  }
  public signupWithLinkedinResponse(value: BaseResponse<VerifyEmailResponseModel, LinkedInRequestModel>): Action {
    return {
      type: LoginActions.SIGNUP_WITH_LINKEDIN_RESPONSE,
      payload: value
    };
  }

  public VerifyMobileRequest(value: VerifyMobileModel): Action {
    return {
      type: LoginActions.VerifyMobileRequest,
      payload: value
    };
  }
  public VerifyMobileResponce(value: BaseResponse<VerifyMobileResponseModel, VerifyMobileModel>): Action {
    return {
      type: LoginActions.VerifyMobileResponce,
      payload: value
    };
  }
  public LoginSuccess(): Action {
    return {
      type: LoginActions.LoginSuccess
    };
  }
  public LogOut(): Action {
    return {
      type: LoginActions.LogOut
    };
  }
  public socialLogoutAttempt(): Action {
    return {
      type: LoginActions.SOCIAL_LOGOUT_ATTEMPT
    };
  }

  public SetLoginStatus(value: userLoginStateEnum): Action {
    return {
      type: LoginActions.SetLoginStatus,
      payload: value
    };
  }

  public GoogleElectronLogin(value: RequestOptionsArgs): Action {
    return {
      type: LoginActions.GoogleLoginElectron,
      payload: value
    };
  }

  public LinkedInElectronLogin(value: RequestOptionsArgs): Action {
    return {
      type: LoginActions.LinkedInLoginElectron,
      payload: value
    };
  }
}
