import { VerifyMobileResponseModel, VerifyMobileModel, SignupWithMobileResponse, SignupWithMobile } from '../../models/api-models/loginModels';
import { ToasterService } from '../toaster.service';
import { AuthenticationService } from '../authentication.service';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import {
  VerifyEmailResponseModel,
  VerifyEmailModel
} from '../../models/api-models/loginModels';
import { AppState } from '../../store/roots';
import { CompanyActions } from './company.actions';
import { Router } from '@angular/router';
import { go, replace, search, show, back, forward } from '@ngrx/router-store';
@Injectable()
export class LoginActions {

  public static SIGNUP_WITH_GOOGLE_REQUEST = 'SIGNUP_WITH_GOOGLE_REQUEST';
  public static SIGNUP_WITH_GOOGLE_RESPONSE = 'SIGNUP_WITH_GOOGLE_RESPONSE';

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
    .map(action => {
      let cmpUniqueName = '';
      this.store.select(s => s.session.companyUniqueName).take(1).subscribe(s => {
        if (s) {
          cmpUniqueName = s;
        }
      });
      debugger;
      this.store.dispatch(this.comapnyActions.GetStateDetails(cmpUniqueName));
      this.store.dispatch(this.comapnyActions.RefreshCompanies());
      console.log('login success to dummy Login Action');
      // this._router.navigate(['/dummy'], { skipLocationChange: true }).then(() => {
      // console.log('login success to home Login Action');
      go(['/pages/home']);
      // });
      return { type: '' };
    });

  @Effect()
  public logoutSuccess$: Observable<Action> = this.actions$
    .ofType(LoginActions.LogOut)
    .map(action => {
      // console.log('logout success to dummy Login Action');
      // this._router.navigate(['/dummy'], { skipLocationChange: true }).then(() => {
      //   console.log('logout success to home Login Action');
      //   this._router.navigate(['/login']);
      // });
      debugger;
      go(['/login']);
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
  constructor(
    public _router: Router,
    private actions$: Actions,
    private auth: AuthenticationService,
    public _toaster: ToasterService,
    private store: Store<AppState>,
    private comapnyActions: CompanyActions
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
}
