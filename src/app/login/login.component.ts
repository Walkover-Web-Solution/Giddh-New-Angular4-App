import { LoginActions } from '../services/actions/login.action';
import { AppState } from '../store/roots';
import { Router } from '@angular/router';
import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';

import { ErrorHandlerService } from './../services/errorhandler.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { VerifyEmailModel } from '../models/api-models/loginModels';
import { AuthService } from 'ng2-ui-auth/commonjs/ng2-ui-auth.module';
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
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
  // tslint:disable-next-line:no-empty
  constructor(
    private _fb: FormBuilder,
    private auth: AuthService,
    private store: Store<AppState>,
    private router: Router,
    private eh: ErrorHandlerService,
    private loginAction: LoginActions
  ) {
    this.isLoginWithEmailInProcess$ = store.select(state => {
      return state.login.isLoginWithEmailInProcess;
    });
    this.isVerifyEmailInProcess$ = store.select(state => {
      return state.login.isVerifyEmailInProcess;
    });
    this.isLoginWithMobileInProcess$ = store.select(state => {
      return state.login.isLoginWithMobileInProcess;
    });
    this.isVerifyMobileInProcess$ = store.select(state => {
      return state.login.isVerifyMobileInProcess;
    });

    this.isLoginWithEmailSubmited$ = store.select(state => {
      return state.login.isLoginWithEmailSubmited;
    });
    store.select(state => {
      return state.login.isVerifyEmailSuccess;
    }).subscribe((value) => {
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
  public getOtp() {
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

  public loginWithProvider(provider: string) {
    this.auth.authenticate(provider).subscribe({
      error: (err: any) => {
        // tslint:disable-next-line:no-debugger
        debugger;
        this.eh.handleError(err);
      },
      complete: () => {
        // tslint:disable-next-line:no-debugger
        debugger;
        this.router.navigateByUrl('main');
      }
    });
  }
}
