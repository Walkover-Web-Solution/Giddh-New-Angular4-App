import { LoginActions } from '../services/actions/login.action';
import { AppState } from '../store/roots';
import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { Configuration } from '../app.constant';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { VerifyMobileModel, SignupWithMobile, VerifyEmailModel } from '../models/api-models/loginModels';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { AuthService, GoogleLoginProvider } from 'ng4-social-login';

import { HttpWrapperService } from '../services/httpWrapper.service';
import { Headers } from '@angular/http';
import { RequestOptionsArgs } from '@angular/http';
import { ToasterService } from '../services/toaster.service';

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
    private _toaster: ToasterService
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
        this.router.navigate(['home']);
      }
    });
    store.select(state => {
      return state.login.isVerifyMobileSuccess;
    }).takeUntil(this.destroyed$).subscribe((value) => {
      if (value) {
        this.router.navigate(['home']);
      }
    });
  }

  // tslint:disable-next-line:no-empty
  public ngOnInit() {
    this.mobileVerifyForm = this._fb.group({
      mobileNumber: ['', [Validators.required]],
      otp: ['', [Validators.required]],
    });

    this.emailVerifyForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      token: ['', Validators.required]
    });

    // get user object when google auth is complete
    this.authService.authState.subscribe((user) => {
      if (user) {
        this.store.dispatch(this.loginAction.signupWithGoogle(user.token));
      }
    });
  }

  public showEmailModal() {
    this.emailVerifyModal.show();
    this.emailVerifyModal.onShow.subscribe(() => {
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

  public signInWithProviders(provider: string) {
    console.log('Is Electron: -' + Configuration.isElectron);
    if (Configuration.isElectron) {
      // electron
      let electron = (window as any).require('electron');
      let electronOauth2 = (window as any).require('electron-oauth');

      let ipcRenderer = electron.ipcRenderer;
      // get config from main-process
      ipcRenderer.send('get-auth-configs');
      // set config
      ipcRenderer.on('set-auth-configs', (events, args) => {
        this.socialLoginKeys = args;

        let config = {};
        let bodyParams = {};
        if (provider === 'google') {
          // google
          config = this.socialLoginKeys.GoogleLoginElectronConfig;
          bodyParams = this.socialLoginKeys.AdditionalGoogleLoginParams;
        } else {
          // linked in
          config = this.socialLoginKeys.LinkedinLoginElectronConfig;
          bodyParams = this.socialLoginKeys.AdditionalLinkedinLoginParams;
        }
        const myApiOauth = electronOauth2(config, {
          alwaysOnTop: true,
          autoHideMenuBar: true,
          webPreferences: {
            nodeIntegration: false,
            devTools: true
          }
        });
        myApiOauth.getAccessToken(bodyParams)
          .then(token => {
            // use your token.access_token
            let url = '';
            if (provider === 'google') {
              url = Configuration.ApiUrl + 'v2/login-with-google';
            } else {
              url = Configuration.ApiUrl + 'v2/login-with-linkedIn';
            }
            let options: RequestOptionsArgs = {};

            options.headers = new Headers();
            options.headers.append('Access-Token', token.access_token);
            this._http.get(url, {}, options).map(res => res.json()).subscribe(d => {
              this.store.dispatch(this.loginAction.VerifyEmailResponce(d));
            }, (e) => {
              this._toaster.errorToast('Something Went Wrong Please Try Again', 'Giddh App');
            });
            // myApiOauth.refreshToken(token.refresh_token)
            //   .then(newToken => {
            //     //
            //   });
          }).catch(e => {
            if (e.message !== 'window was closed by user') {
              this._toaster.errorToast('Something Went Wrong Please Try Again', 'Giddh App');
            }
          });
      });

    } else {
      //  web
      if (provider === 'google') {
        this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
      } else {
        // linkedin
      }
    }
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
