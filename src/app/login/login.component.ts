import { LoginActions } from '../services/actions/login.action';
import { AppState } from '../store/roots';
import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { Configuration } from '../app.constant';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { VerifyMobileModel, SignupWithMobile, VerifyEmailModel, VerifyEmailResponseModel, LinkedInRequestModel } from '../models/api-models/loginModels';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { AuthService, GoogleLoginProvider, LinkedinLoginProvider, SocialUser } from 'ng4-social-login';

import { HttpWrapperService } from '../services/httpWrapper.service';
import { Headers } from '@angular/http';
import { RequestOptionsArgs } from '@angular/http';
import { ToasterService } from '../services/toaster.service';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GoogleLoginElectronConfig, AdditionalGoogleLoginParams, LinkedinLoginElectronConfig, AdditionalLinkedinLoginParams } from '../../mainprocess/main-auth.config';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  public isLoginWithMobileSubmited$: Observable<boolean>;
  @ViewChild('emailVerifyModal') public emailVerifyModal: ModalDirective;
  public isLoginWithEmailSubmited$: Observable<boolean>;
  @ViewChild('mobileVerifyModal') public mobileVerifyModal: ModalDirective;
  public isSubmited: boolean = false;
  public mobileVerifyForm: FormGroup;
  public emailVerifyForm: FormGroup;
  public isVerifyMobileInProcess$: Observable<boolean>;
  public isLoginWithMobileInProcess$: Observable<boolean>;
  public isVerifyEmailInProcess$: Observable<boolean>;
  public isLoginWithEmailInProcess$: Observable<boolean>;
  public isSocialLogoutAttempted$: Observable<boolean>;
  private imageURL: string;
  private email: string;
  private name: string;
  private token: string;
  private socialLoginKeys: any;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  // tslint:disable-next-line:no-empty
  constructor(
    private _fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router,
    public _http: HttpWrapperService,
    private loginAction: LoginActions,
    private authService: AuthService,
    private _toaster: ToasterService,
    private zone: NgZone
  ) {
    this.isLoginWithEmailInProcess$ = store.select(state => {
      return state.login.isLoginWithEmailInProcess;
    }).takeUntil(this.destroyed$);
    this.isVerifyEmailInProcess$ = store.select(state => {
      return state.login.isVerifyEmailInProcess;
    }).takeUntil(this.destroyed$);
    this.isLoginWithMobileInProcess$ = store.select(state => {
      return state.login.isLoginWithMobileInProcess;
    }).takeUntil(this.destroyed$);
    this.isVerifyMobileInProcess$ = store.select(state => {
      return state.login.isVerifyMobileInProcess;
    }).takeUntil(this.destroyed$);

    this.isLoginWithMobileSubmited$ = store.select(state => {
      return state.login.isLoginWithMobileSubmited;
    }).takeUntil(this.destroyed$);
    this.isLoginWithEmailSubmited$ = store.select(state => {
      return state.login.isLoginWithEmailSubmited;
    }).takeUntil(this.destroyed$);
    store.select(state => {
      return state.login.isVerifyEmailSuccess;
    }).takeUntil(this.destroyed$).subscribe((value) => {
      if (value) {
        // this.router.navigate(['home']);
      }
    });
    store.select(state => {
      return state.login.isVerifyMobileSuccess;
    }).takeUntil(this.destroyed$).subscribe((value) => {
      if (value) {
        // this.router.navigate(['home']);
      }
    });
    this.isSocialLogoutAttempted$ = this.store.select(p => p.login.isSocialLogoutAttempted).takeUntil(this.destroyed$);
  }

  // tslint:disable-next-line:no-empty
  public ngOnInit() {

    // get user object when google auth is complete
    if (!Configuration.isElectron) {
      this.authService.authState.subscribe((user: SocialUser) => {
        console.log ('auth', user);
        this.isSocialLogoutAttempted$.subscribe((res) => {
          if (!res && user) {
            switch (user.provider) {
              case 'GOOGLE': {
                this.store.dispatch(this.loginAction.signupWithGoogle(user.token));
                break;
              }
              case 'LINKEDIN': {
                let obj: LinkedInRequestModel = new LinkedInRequestModel();
                obj.email = user.email;
                obj.token = user.token;
                this.store.dispatch(this.loginAction.signupWithLinkedin(obj));
                break;
              }
              default: {
                // do something
                break;
              }
            }
          }
        });
      });
    }
  }

  public showEmailModal() {
    this.emailVerifyModal.show();
    this.emailVerifyModal.onShow.takeUntil(this.destroyed$).subscribe(() => {
      this.isSubmited = false;
    });
  }

  public LoginWithEmail(email: string) {
    this.store.dispatch(this.loginAction.SignupWithEmailRequest(email));
  }
  public VerifyEmail(email: string, code: string) {
    let data = new VerifyEmailModel();
    data.email = email;
    data.verificationCode = code;
    this.store.dispatch(this.loginAction.VerifyEmailRequest(data));
  }
  public VerifyCode(mobile: string, code: string) {
    let data = new VerifyMobileModel();
    data.countryCode = 91;
    data.mobileNumber = mobile;
    data.oneTimePassword = code;
    this.store.dispatch(this.loginAction.VerifyMobileRequest(data));
  }
  public hideEmailModal() {
    this.emailVerifyModal.hide();
  }

  public showMobileModal() {
    this.mobileVerifyModal.show();
  }

  public hideMobileModal() {
    this.mobileVerifyModal.hide();
  }

  // tslint:disable-next-line:no-empty
  public getOtp(mobileNumber: string) {
    let data: SignupWithMobile = new SignupWithMobile();
    data.mobileNumber = mobileNumber;
    data.countryCode = 91;
    this.store.dispatch(this.loginAction.SignupWithMobileRequest(data));
  }

  /**
   * Getting data from browser's local storage
   */
  public getData() {
    this.token = localStorage.getItem('token');
    this.imageURL = localStorage.getItem('image');
    this.name = localStorage.getItem('name');
    this.email = localStorage.getItem('email');
  }

  public async signInWithProviders(provider: string) {
    if (Configuration.isElectron) {

      // electronOauth2
      let electronOauth2 = (window as any).require('electron-oauth');

      let config = {};
      let bodyParams = {};
      if (provider === 'google') {
        // google
        config = GoogleLoginElectronConfig;
        bodyParams = AdditionalGoogleLoginParams;
      } else {
        // linked in
        config = LinkedinLoginElectronConfig;
        bodyParams = AdditionalLinkedinLoginParams;
      }
      try {
        const myApiOauth = electronOauth2(config, {
          alwaysOnTop: true,
          autoHideMenuBar: true,
          webPreferences: {
            nodeIntegration: false,
            devTools: true,
            partition: 'oauth2'
          }
        });
        let token = await myApiOauth.getAccessToken(bodyParams);
        let options: RequestOptionsArgs = {};

        options.headers = new Headers();
        options.headers.append('Access-Token', token.access_token);

        if (provider === 'google') {
          // google
          this.store.dispatch(this.loginAction.GoogleElectronLogin(options));
        } else {
          // linked in
          this.store.dispatch(this.loginAction.LinkedInElectronLogin(options));
        }
      } catch (e) {
        //
      }
    } else {
      //  web social authentication
      this.store.dispatch(this.loginAction.resetSocialLogoutAttempt());
      if (provider === 'google') {
        this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
      } else if (provider === 'linkedin') {
        this.authService.signIn(LinkedinLoginProvider.PROVIDER_ID);
      }
    }
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
