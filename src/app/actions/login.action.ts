import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { CompanyActions } from './company.actions';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomActions } from '../store/customActions';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { LinkedInRequestModel, SignupWithMobile, UserDetails, VerifyEmailModel, VerifyEmailResponseModel, VerifyMobileModel, VerifyMobileResponseModel } from '../models/api-models/loginModels';
import { userLoginStateEnum } from '../store/authentication/authentication.reducer';
import { CompanyResponse, StateDetailsResponse } from '../models/api-models/Company';
import { ROUTES } from '../app.routes';
import { Configuration } from '../app.constant';
import { AuthenticationService } from '../services/authentication.service';
import { ToasterService } from '../services/toaster.service';
import { AppState } from '../store/index';
import { CompanyService } from '../services/companyService.service';
import { GeneralService } from '../services/general.service';
import { sortBy } from 'app/lodash-optimized';
import { AccountService } from 'app/services/account.service';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Injectable()
export class LoginActions {

  public static RESET_SOCIAL_LOGOUT_ATTEMPT = 'RESET_SOCIAL_LOGOUT_ATTEMPT';
  public static SOCIAL_LOGOUT_ATTEMPT = 'SOCIAL_LOGOUT_ATTEMPT';
  public static SIGNUP_WITH_GOOGLE_REQUEST = 'SIGNUP_WITH_GOOGLE_REQUEST';
  public static SIGNUP_WITH_GOOGLE_RESPONSE = 'SIGNUP_WITH_GOOGLE_RESPONSE';

  public static SIGNUP_WITH_LINKEDIN_REQUEST = 'SIGNUP_WITH_LINKEDIN_REQUEST';
  public static SIGNUP_WITH_LINKEDIN_RESPONSE = 'SIGNUP_WITH_LINKEDIN_RESPONSE';

  public static SignupWithEmailRequest = 'SignupWithEmailRequest';
  public static SignupWithEmailResponce = 'SignupWithEmailResponce';
  public static ResetSignupWithEmailState = 'ResetSignupWithEmailState';
  public static SignupWithMobileRequest = 'SignupWithMobileRequest';
  public static SignupWithMobileResponce = 'SignupWithMobileResponce';

  public static ResetSignupWithMobileState = 'ResetSignupWithMobileState';
  public static VerifyEmailRequest = 'VerifyEmailRequest';
  public static VerifyEmailResponce = 'VerifyEmailResponce';

  public static VerifyMobileRequest = 'VerifyMobileRequest';
  public static VerifyMobileResponce = 'VerifyMobileResponce';
  public static VerifyTwoWayAuthRequest = 'VerifyTwoWayAuthRequest';
  public static VerifyTwoWayAuthResponse = 'VerifyTwoWayAuthResponse';
  public static LoginSuccess = 'LoginSuccess';
  public static LogOut = 'LoginOut';
  public static ClearSession = 'ClearSession';
  public static SetLoginStatus = 'SetLoginStatus';
  public static GoogleLoginElectron = 'GoogleLoginElectron';
  public static LinkedInLoginElectron = 'LinkedInLoginElectron';
  public static AddNewMobileNo = 'AddNewMobileNo';
  public static AddNewMobileNoResponse = 'AddNewMobileNoResponse';

  public static VerifyAddNewMobileNo = 'VerifyAddNewMobileNo';
  public static VerifyAddNewMobileNoResponse = 'VerifyAddNewMobileNoResponse';
  public static FetchUserDetails = 'FetchUserDetails';
  public static FetchUserDetailsResponse = 'FetchUserDetailsResponse';
  public static SubscribedCompanies = 'SubscribedCompanies';
  public static SubscribedCompaniesResponse = 'SubscribedCompaniesResponse';
  public static AddBalance = 'AddBalance';
  public static AddBalanceResponse = 'AddBalanceResponse';
  public static ResetTwoWayAuthModal = 'ResetTwoWayAuthModal';

  public static NEEDS_TO_REDIRECT_TO_LEDGER = 'NEEDS_TO_REDIRECT_TO_LEDGER';
  public static RESET_NEEDS_TO_REDIRECT_TO_LEDGER = 'RESET_NEEDS_TO_REDIRECT_TO_LEDGER';

  @Effect()
  public signupWithGoogle$: Observable<Action> = this.actions$
    .ofType(LoginActions.SIGNUP_WITH_GOOGLE_REQUEST)
    .switchMap((action: CustomActions) =>
      this.auth.LoginWithGoogle(action.payload)
    )
    .map(response => {
      return this.signupWithGoogleResponse(response);
    });

  @Effect()
  public signupWithGoogleResponse$: Observable<Action> = this.actions$
    .ofType(LoginActions.SIGNUP_WITH_GOOGLE_RESPONSE)
    .map((action: CustomActions) => {
      let response: BaseResponse<VerifyEmailResponseModel, string> = action.payload;
      if (response.status === 'error') {
        this._toaster.errorToast(action.payload.message, action.payload.code);
        return { type: 'EmptyAction' };
      }
      if (response.body.statusCode === 'AUTHENTICATE_TWO_WAY') {
        this.store.dispatch(this.SetLoginStatus(userLoginStateEnum.needTwoWayAuth));
        return {
          type: 'EmptyAction'
        };
      } else {
        return this.LoginSuccess();
      }
    });

  @Effect()
  public signupWithLinkedin$: Observable<Action> = this.actions$
    .ofType(LoginActions.SIGNUP_WITH_LINKEDIN_REQUEST)
    .switchMap((action: CustomActions) =>
      this.auth.LoginWithLinkedin(action.payload)
    )
    .map(response => this.signupWithLinkedinResponse(response));

  @Effect()
  public signupWithLinkedinResponse$: Observable<Action> = this.actions$
    .ofType(LoginActions.SIGNUP_WITH_LINKEDIN_RESPONSE)
    .map((action: CustomActions) => {
      let response: BaseResponse<VerifyEmailResponseModel, string> = action.payload;
      if (response.status === 'error') {
        this._toaster.errorToast(action.payload.message, action.payload.code);
        return { type: 'EmptyAction' };
      }
      if (response.body.statusCode === 'AUTHENTICATE_TWO_WAY') {
        this.store.dispatch(this.SetLoginStatus(userLoginStateEnum.needTwoWayAuth));
        return {
          type: 'EmptyAction'
        };
      } else {
        return this.LoginSuccess();
      }
    });

  @Effect()
  public signupWithEmail$: Observable<Action> = this.actions$
    .ofType(LoginActions.SignupWithEmailRequest)
    .switchMap((action: CustomActions) => this.auth.SignupWithEmail(action.payload))
    .map(response => this.SignupWithEmailResponce(response));

  @Effect()
  public signupWithEmailResponse$: Observable<Action> = this.actions$
    .ofType(LoginActions.SignupWithEmailResponce)
    .map((action: CustomActions) => {
      if (action.payload.status === 'success') {
        this._toaster.successToast(action.payload.body);
      } else {
        this._toaster.errorToast(action.payload.message, action.payload.code);
      }
      return { type: 'EmptyAction' };
    });

  @Effect()
  public verifyEmail$: Observable<Action> = this.actions$
    .ofType(LoginActions.VerifyEmailRequest)
    .switchMap((action: CustomActions) =>
      this.auth.VerifyEmail(action.payload as VerifyEmailModel)
    )
    .map(response => this.VerifyEmailResponce(response));

  @Effect()
  public verifyEmailResponse$: Observable<Action> = this.actions$
    .ofType(LoginActions.VerifyEmailResponce)
    .map((action: CustomActions) => {
      let response: BaseResponse<VerifyEmailResponseModel, VerifyEmailModel> = action.payload;
      if (response.status === 'error') {
        this._toaster.errorToast(action.payload.message, action.payload.code);
        return { type: 'EmptyAction' };
      }
      return this.LoginSuccess();
    });

  @Effect()
  public signupWithMobile$: Observable<Action> = this.actions$
    .ofType(LoginActions.SignupWithMobileRequest)
    .switchMap((action: CustomActions) => this.auth.SignupWithMobile(action.payload))
    .map(response => this.SignupWithMobileResponce(response));

  @Effect()
  public signupWithMobileResponse$: Observable<Action> = this.actions$
    .ofType(LoginActions.SignupWithMobileResponce)
    .map((action: CustomActions) => {
      if (action.payload.status === 'success') {
        this._toaster.successToast(action.payload.body);
      } else {
        this._toaster.errorToast(action.payload.message, action.payload.code);
      }
      return { type: 'EmptyAction' };
    });

  @Effect()
  public loginSuccess$: Observable<Action> = this.actions$
    .ofType(LoginActions.LoginSuccess)
    .switchMap((action) => {
      return Observable.zip(this._companyService.getStateDetails(''), this._companyService.CompanyList());
    }).map((results: any[]) => {
      let cmpUniqueName = '';
      let stateDetail = results[0] as BaseResponse<StateDetailsResponse, string>;
      let companies = results[1] as BaseResponse<CompanyResponse[], string>;
      if (companies.body && companies.body.length === 0) {
        this.store.dispatch(this.SetLoginStatus(userLoginStateEnum.newUserLoggedIn));
        this._router.navigate(['/pages/new-user']);
        return { type: 'EmptyAction' };
      } else {
        if (stateDetail.body && stateDetail.status === 'success') {
          this._generalService.companyUniqueName = stateDetail.body.companyUniqueName;
          cmpUniqueName = stateDetail.body.companyUniqueName;
          if (companies.body.findIndex(p => p.uniqueName === cmpUniqueName) > -1 && ROUTES.findIndex(p => p.path.split('/')[0] === stateDetail.body.lastState.split('/')[0]) > -1) {
            return this.finalThingTodo(stateDetail, companies);
          } else {
            // old user fail safe scenerio
            return this.doSameStuffs(companies);
          }
        } else {
          /**
          * if user is new and signed up by shared entity
          * find the entity and redirect user according to terms.
          * shared entities [GROUP, COMPANY, ACCOUNT]
          */
          return this.doSameStuffs(companies);
        }
      }
    });

  @Effect()
  public logoutSuccess$: Observable<Action> = this.actions$
    .ofType(LoginActions.LogOut)
    .map((action: CustomActions) => {
      this._router.navigate(['/login']);
      return { type: 'EmptyAction' };
    });

  @Effect()
  public verifyMobile$: Observable<Action> = this.actions$
    .ofType(LoginActions.VerifyMobileRequest)
    .switchMap((action: CustomActions) =>
      this.auth.VerifyOTP(action.payload as VerifyMobileModel)
    )
    .map(response => this.VerifyMobileResponce(response));

  @Effect()
  public verifyMobileResponse$: Observable<Action> = this.actions$
    .ofType(LoginActions.VerifyMobileResponce)
    .map((action: CustomActions) => {
      let response: BaseResponse<VerifyMobileResponseModel, VerifyMobileModel> = action.payload;
      if (response.status === 'error') {
        this._toaster.errorToast(action.payload.message, action.payload.code);
        return { type: 'EmptyAction' };
      }
      return this.LoginSuccess();
    });

  @Effect()
  public verifyTwoWayAuth$: Observable<Action> = this.actions$
    .ofType(LoginActions.VerifyTwoWayAuthRequest)
    .switchMap((action: CustomActions) =>
      this.auth.VerifyOTP(action.payload as VerifyMobileModel)
    )
    .map(response => this.VerifyTwoWayAuthResponse(response));

  @Effect()
  public verifyTwoWayAuthResponse$: Observable<Action> = this.actions$
    .ofType(LoginActions.VerifyTwoWayAuthResponse)
    .map((action: CustomActions) => {
      let response: BaseResponse<VerifyMobileResponseModel, VerifyMobileModel> = action.payload;
      if (response.status === 'error') {
        this._toaster.errorToast(response.message, response.code);
        return { type: 'EmptyAction' };
      }
      return this.LoginSuccess();
    });

  @Effect()
  public GoogleElectronLogin$: Observable<Action> = this.actions$
    .ofType(LoginActions.GoogleLoginElectron)
    .switchMap((action: CustomActions) => {
      return this.http.get(Configuration.ApiUrl + 'v2/login-with-google', {
        headers: action.payload,
        responseType: 'json'
      }).map(p => p as BaseResponse<VerifyEmailResponseModel, string>);
    })
    .map(data => {
      if (data.status === 'error') {
        this._toaster.errorToast(data.message, data.code);
        return { type: 'EmptyAction' };
      }
      // return this.LoginSuccess();
      return this.signupWithGoogleResponse(data);
    });

  @Effect()
  public LinkedInElectronLogin$: Observable<Action> = this.actions$
    .ofType(LoginActions.LinkedInLoginElectron)
    .switchMap((action: CustomActions) => {
      let args: any = { headers: {} };
      args.headers['cache-control'] = 'no-cache';
      args.headers['Content-Type'] = 'application/json';
      args.headers['Accept'] = 'application/json';
      args.headers['Access-Token'] = action.payload;
      args.headers = new HttpHeaders(args.headers);
      return this.http.get(Configuration.ApiUrl + 'v2/login-with-linkedIn', {
        headers: args.headers,
        responseType: 'json'
      }).map(p => p as BaseResponse<VerifyEmailResponseModel, string>);
    })
    .map(data => {
      if (data.status === 'error') {
        this._toaster.errorToast(data.message, data.code);
        return { type: 'EmptyAction' };
      }
      // return this.LoginSuccess();
      return this.signupWithGoogleResponse(data);
    });

  @Effect()
  public ClearSession$: Observable<Action> = this.actions$
    .ofType(LoginActions.ClearSession)
    .switchMap((action: CustomActions) => {
      return this.auth.ClearSession();
    }).map(data => {
      return this.LogOut();
    });

  @Effect()
  public CHANGE_COMPANY$: Observable<Action> = this.actions$
    .ofType(CompanyActions.CHANGE_COMPANY)
    .switchMap((action: CustomActions) => this._companyService.getStateDetails(action.payload))
    .map(response => {
      if (response.status === 'error' || ROUTES.findIndex(p => p.path.split('/')[0] === response.body.lastState.split('/')[0]) === -1) {
        //
        let dummyResponse = new BaseResponse<StateDetailsResponse, string>();
        dummyResponse.body = new StateDetailsResponse();
        dummyResponse.body.companyUniqueName = response.request;
        dummyResponse.body.lastState = 'home';
        dummyResponse.status = 'success';
        return this.ChangeCompanyResponse(dummyResponse);
      }
      if (response.body.companyUniqueName) {
        if (response.body.lastState && ROUTES.findIndex(p => p.path.split('/')[0] === response.body.lastState.split('/')[0]) !== -1) {
          this._router.navigateByUrl('/dummy', { skipLocationChange: true }).then(() => {
            this._router.navigate([response.body.lastState]);
          });
        } else {
          if (this.activatedRoute.children && this.activatedRoute.children.length > 0) {
            if (this.activatedRoute.firstChild.children && this.activatedRoute.firstChild.children.length > 0) {
              let path = [];
              let parament = {};
              this.activatedRoute.firstChild.firstChild.url.take(1).subscribe(p => {
                if (p.length > 0) {
                  path = [p[0].path];
                  parament = { queryParams: p[0].parameters };
                }
              });
              if (path.length > 0 && parament) {
                this._router.navigateByUrl('/dummy', { skipLocationChange: true }).then(() => {
                  if (ROUTES.findIndex(p => p.path.split('/')[0] === path[0].split('/')[0]) > -1) {
                    this._router.navigate([path[0]], parament);
                  } else {
                    this._router.navigate(['home']);
                  }
                });
              }
            }
          }
        }
      }

      return this.ChangeCompanyResponse(response);
    });

  @Effect()
  public addNewMobile$: Observable<Action> = this.actions$
    .ofType(LoginActions.AddNewMobileNo)
    .switchMap((action: CustomActions) => this.auth.VerifyNumber(action.payload))
    .map(response => this.AddNewMobileNoResponce(response));

  @Effect()
  public addNewMobileResponse$: Observable<Action> = this.actions$
    .ofType(LoginActions.AddNewMobileNoResponse)
    .map((action: CustomActions) => {
      if (action.payload.status === 'success') {
        this._toaster.successToast('You will receive a verification code on your mobile shortly.');
      } else {
        this._toaster.errorToast(action.payload.message, action.payload.code);
      }
      return { type: 'EmptyAction' };
    });

  @Effect()
  public verifyAddNewMobile$: Observable<Action> = this.actions$
    .ofType(LoginActions.VerifyAddNewMobileNo)
    .switchMap((action: CustomActions) =>
      this.auth.VerifyNumberOTP(action.payload as VerifyMobileModel)
    )
    .map(response => this.VerifyAddNewMobileNoResponce(response));

  @Effect()
  public verifyAddNewMobileResponse$: Observable<Action> = this.actions$
    .ofType(LoginActions.VerifyAddNewMobileNoResponse)
    .map((action: CustomActions) => {
      let response: BaseResponse<string, VerifyMobileModel> = action.payload;
      if (response.status === 'error') {
        this._toaster.errorToast(response.message, response.code);
        return { type: 'EmptyAction' };
      }
      this._toaster.successToast(response.body);
      return this.FetchUserDetails();
    });

  @Effect()
  public FectchUserDetails$: Observable<Action> = this.actions$
    .ofType(LoginActions.FetchUserDetails)
    .switchMap((action: CustomActions) => this.auth.FetchUserDetails())
    .map(response => this.FetchUserDetailsResponse(response));

  @Effect()
  public FectchUserDetailsResponse$: Observable<Action> = this.actions$
    .ofType(LoginActions.FetchUserDetailsResponse)
    .map((action: CustomActions) => {
      if (action.payload.status === 'error') {
        this._toaster.errorToast(action.payload.message, action.payload.code);
      }
      return { type: 'EmptyAction' };
    });

  @Effect()
  public SubscribedCompanies$: Observable<Action> = this.actions$
    .ofType(LoginActions.SubscribedCompanies)
    .switchMap((action: CustomActions) => this.auth.GetSubScribedCompanies())
    .map(response => this.SubscribedCompaniesResponse(response));

  @Effect()
  public AddBalance$: Observable<Action> = this.actions$
    .ofType(LoginActions.AddBalance)
    .switchMap((action: CustomActions) => this.auth.AddBalance(action.payload))
    .map(response => this.AddBalanceResponse(response));

  @Effect()
  public AddBalanceResponse$: Observable<Action> = this.actions$
    .ofType(LoginActions.AddBalanceResponse)
    .map((action: CustomActions) => {
      if (action.payload.status === 'error') {
        this._toaster.errorToast(action.payload.message, action.payload.code);
      }
      return { type: 'EmptyAction' };
    });

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    public _router: Router,
    private actions$: Actions,
    private auth: AuthenticationService,
    public _toaster: ToasterService,
    private store: Store<AppState>,
    private comapnyActions: CompanyActions,
    private _companyService: CompanyService,
    private http: HttpClient,
    private _generalService: GeneralService,
    private _accountService: AccountService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  public SetRedirectToledger(): CustomActions {
    return {
      type: LoginActions.NEEDS_TO_REDIRECT_TO_LEDGER
    };
  }

  public ResetRedirectToledger(): CustomActions {
    return {
      type: LoginActions.RESET_NEEDS_TO_REDIRECT_TO_LEDGER
    };
  }

  public SignupWithEmailRequest(value: string): CustomActions {
    return {
      type: LoginActions.SignupWithEmailRequest,
      payload: value
    };
  }

  public SignupWithEmailResponce(value: BaseResponse<string, string>): CustomActions {
    return {
      type: LoginActions.SignupWithEmailResponce,
      payload: value
    };
  }

  public ResetSignupWithEmailState(): CustomActions {
    return {
      type: LoginActions.ResetSignupWithEmailState
    };
  }

  public SignupWithMobileRequest(value: SignupWithMobile): CustomActions {
    return {
      type: LoginActions.SignupWithMobileRequest,
      payload: value
    };
  }

  public SignupWithMobileResponce(value: BaseResponse<string, SignupWithMobile>): CustomActions {
    return {
      type: LoginActions.SignupWithMobileResponce,
      payload: value
    };
  }

  public ResetSignupWithMobileState(): CustomActions {
    return {
      type: LoginActions.ResetSignupWithMobileState
    };
  }

  public VerifyEmailRequest(value: VerifyEmailModel): CustomActions {
    return {
      type: LoginActions.VerifyEmailRequest,
      payload: value
    };
  }

  public VerifyEmailResponce(value: BaseResponse<VerifyEmailResponseModel, VerifyEmailModel>): CustomActions {
    return {
      type: LoginActions.VerifyEmailResponce,
      payload: value
    };
  }

  public signupWithGoogle(value: string): CustomActions {
    return {
      type: LoginActions.SIGNUP_WITH_GOOGLE_REQUEST,
      payload: value
    };
  }

  public signupWithGoogleResponse(value: BaseResponse<VerifyEmailResponseModel, string>): CustomActions {
    return {
      type: LoginActions.SIGNUP_WITH_GOOGLE_RESPONSE,
      payload: value
    };
  }

  public signupWithLinkedin(value: LinkedInRequestModel): CustomActions {
    return {
      type: LoginActions.SIGNUP_WITH_LINKEDIN_REQUEST,
      payload: value
    };
  }

  public signupWithLinkedinResponse(value: BaseResponse<VerifyEmailResponseModel, LinkedInRequestModel>): CustomActions {
    return {
      type: LoginActions.SIGNUP_WITH_LINKEDIN_RESPONSE,
      payload: value
    };
  }

  public resetSocialLogoutAttempt(): CustomActions {
    return {
      type: LoginActions.RESET_SOCIAL_LOGOUT_ATTEMPT
    };
  }

  public socialLogoutAttempt(): CustomActions {
    return {
      type: LoginActions.SOCIAL_LOGOUT_ATTEMPT
    };
  }

  public VerifyMobileRequest(value: VerifyMobileModel): CustomActions {
    return {
      type: LoginActions.VerifyMobileRequest,
      payload: value
    };
  }

  public VerifyMobileResponce(value: BaseResponse<VerifyMobileResponseModel, VerifyMobileModel>): CustomActions {
    return {
      type: LoginActions.VerifyMobileResponce,
      payload: value
    };
  }

  public VerifyTwoWayAuthRequest(value: VerifyMobileModel): CustomActions {
    return {
      type: LoginActions.VerifyTwoWayAuthRequest,
      payload: value
    };
  }

  public VerifyTwoWayAuthResponse(value: BaseResponse<VerifyMobileResponseModel, VerifyMobileModel>): CustomActions {
    return {
      type: LoginActions.VerifyTwoWayAuthResponse,
      payload: value
    };
  }

  public resetTwoWayAuthModal(): CustomActions {
    return {
      type: LoginActions.ResetTwoWayAuthModal
    };
  }

  public LoginSuccess(): CustomActions {
    return {
      type: LoginActions.LoginSuccess
    };
  }

  public LogOut(): CustomActions {
    return {
      type: LoginActions.LogOut
    };
  }

  public SetLoginStatus(value: userLoginStateEnum): CustomActions {
    return {
      type: LoginActions.SetLoginStatus,
      payload: value
    };
  }

  public GoogleElectronLogin(value: any): CustomActions {
    return {
      type: LoginActions.GoogleLoginElectron,
      payload: value
    };
  }

  public LinkedInElectronLogin(value: any): CustomActions {
    return {
      type: LoginActions.LinkedInLoginElectron,
      payload: value
    };
  }

  public ClearSession(): CustomActions {
    return {
      type: LoginActions.ClearSession
    };
  }

  public ChangeCompany(cmpUniqueName: string): CustomActions {
    return {
      type: CompanyActions.CHANGE_COMPANY,
      payload: cmpUniqueName
    };
  }

  public ChangeCompanyResponse(value: BaseResponse<StateDetailsResponse, string>): CustomActions {
    return {
      type: CompanyActions.CHANGE_COMPANY_RESPONSE,
      payload: value
    };
  }

  public AddNewMobileNo(value: SignupWithMobile): CustomActions {
    return {
      type: LoginActions.AddNewMobileNo,
      payload: value
    };
  }

  public AddNewMobileNoResponce(value: BaseResponse<string, SignupWithMobile>): CustomActions {
    return {
      type: LoginActions.AddNewMobileNoResponse,
      payload: value
    };
  }

  public VerifyAddNewMobileNo(value: VerifyMobileModel): CustomActions {
    return {
      type: LoginActions.VerifyAddNewMobileNo,
      payload: value
    };
  }

  public VerifyAddNewMobileNoResponce(value: BaseResponse<string, VerifyMobileModel>): CustomActions {
    return {
      type: LoginActions.VerifyAddNewMobileNoResponse,
      payload: value
    };
  }

  public FetchUserDetails(): CustomActions {
    return {
      type: LoginActions.FetchUserDetails
    };
  }

  public FetchUserDetailsResponse(resp: BaseResponse<UserDetails, string>): CustomActions {
    return {
      type: LoginActions.FetchUserDetailsResponse,
      payload: resp
    };
  }

  public SubscribedCompanies(): CustomActions {
    return {
      type: LoginActions.SubscribedCompanies
    };
  }

  public SubscribedCompaniesResponse(response): CustomActions {
    return {
      type: LoginActions.SubscribedCompaniesResponse,
      payload: {}
    };
  }

  public AddBalance(): CustomActions {
    return {
      type: LoginActions.AddBalance
    };
  }

  public AddBalanceResponse(resp: BaseResponse<string, string>): CustomActions {
    return {
      type: LoginActions.AddBalanceResponse,
      payload: resp
    };
  }

  private doSameStuffs(companies) {
    let respState = new BaseResponse<StateDetailsResponse, string>();
    respState.body = new StateDetailsResponse();
    companies.body = sortBy(companies.body, ['name']);
    // now take first company from the companies
    let cArr = companies.body.sort((a, b) => a.name.length - b.name.length);
    let company = cArr[0];
    respState.body.companyUniqueName = company.uniqueName;
    respState.status = 'success';
    respState.request = '';
    respState.body.lastState = 'home';
    // check for entity and override last state ['GROUP', 'ACCOUNT']
    try {
      if (company.userEntityRoles && company.userEntityRoles.length) {
        // find sorted userEntityRoles
        let entitiesArr = company.userEntityRoles.sort((a, b) => a.entity.name.length - b.entity.name.length);
        let entityObj = entitiesArr[0].entity;
        if (entityObj.entity === 'ACCOUNT') {
          respState.body.lastState = `ledger/${entityObj.uniqueName}`;
        } else if (entityObj.entity === 'GROUP') {
          // get a/c`s of group and set first a/c
          this.store.dispatch(this.SetRedirectToledger());
        } else {
          respState.body.lastState = 'home';
        }
      }
    } catch (error) {
      respState.body.lastState = 'home';
    }
    return this.finalThingTodo(respState, companies);
  }

  private finalThingTodo(stateDetail: any, companies: any) {
    // console.log('finalThingTodo');
    this.store.dispatch(this.comapnyActions.GetStateDetailsResponse(stateDetail));
    this.store.dispatch(this.comapnyActions.RefreshCompaniesResponse(companies));
    this.store.dispatch(this.SetLoginStatus(userLoginStateEnum.userLoggedIn));
    this._router.navigate([stateDetail.body.lastState]);
    return { type: 'EmptyAction' };
  }
}
