import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { ToasterService } from '../services/toaster.service';
import { SignupWithMobile } from '../models/api-models/loginModels';
import { LoginActions } from '../services/actions/login.action';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'user-details',
  templateUrl: './userDetails.component.html'
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  public userAuthKey: string = '';
  public expandLongCode: boolean = false;
  public twoWayAuth: boolean = false;
  public phoneNumber: string = '';
  public countryCode: string = '';
  public showVerificationBox: boolean = false;
  public contactNo$: Observable<string>;
  public countryCode$: Observable<string>;
  public isAddNewMobileNoInProcess$: Observable<boolean>;
  public isMobileNoVerifiedSuccess$: Observable<boolean>;
  public authenticateTwoWay$: Observable<boolean>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(private store: Store<AppState>, private _toasty: ToasterService, private _loginAction: LoginActions,
    private _loginService: AuthenticationService, private loginAction: LoginActions) {
    this.contactNo$ = this.store.select(s => s.session.user.user.contactNo).takeUntil(this.destroyed$);
    this.countryCode$ = this.store.select(s => s.session.user.countryCode).takeUntil(this.destroyed$);
    this.isAddNewMobileNoInProcess$ = this.store.select(s => s.session.isAddNewMobileNoInProcess).takeUntil(this.destroyed$);
    this.isMobileNoVerifiedSuccess$ = this.store.select(s => s.session.isMobileNoVerifiedSuccess).takeUntil(this.destroyed$);
    this.authenticateTwoWay$ = this.store.select(s => s.session.user.user.authenticateTwoWay).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    this.contactNo$.subscribe(s => this.phoneNumber = s);
    this.countryCode$.subscribe(s => this.countryCode = s);
    this.isMobileNoVerifiedSuccess$.subscribe(s => this.showVerificationBox = s);
    this.authenticateTwoWay$.subscribe(s => this.twoWayAuth = s);
    this.store.dispatch(this.loginAction.FetchUserDetails());
    this.store.dispatch(this._loginAction.SubscribedCompanies());
  }

  public addNumber(no: string) {
    const mobileRegex = /^[0-9]{1,10}$/;
    if (mobileRegex.test(no) && (no.length === 10)) {
      const request: SignupWithMobile = new SignupWithMobile();
      request.countryCode = Number(this.countryCode) || 91;
      request.mobileNumber = this.phoneNumber;
      this.store.dispatch(this._loginAction.AddNewMobileNo(request));
    } else {
      this._toasty.errorToast('Please enter number in format: 9998899988');
    }
  }

  public changeTwoWayAuth() {
    this._loginService.SetSettings({authenticateTwoWay: this.twoWayAuth}).subscribe(res => {
      if (res.status === 'success') {
        this._toasty.successToast(res.body);
      } else {
        this._toasty.errorToast(res.message);
      }
    });
  }
  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
