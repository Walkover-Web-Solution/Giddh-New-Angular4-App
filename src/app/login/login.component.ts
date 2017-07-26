import { LoginActions } from '../services/actions/login.action';
import { AppState } from '../store/roots';
import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';

import { ErrorHandlerService } from './../services/errorhandler.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { VerifyMobileModel, SignupWithMobile, VerifyEmailModel } from '../models/api-models/loginModels';
import { ReplaySubject } from 'rxjs/ReplaySubject';
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
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  // tslint:disable-next-line:no-empty
  constructor(
    private _fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router,
    private eh: ErrorHandlerService,
    private loginAction: LoginActions
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

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
  public loginWithProvider(provider: string) {
    //
  }

}
