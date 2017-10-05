import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { ToasterService } from '../services/toaster.service';
import { SignupWithMobile } from '../models/api-models/loginModels';
import { LoginActions } from '../services/actions/login.action';
import { AuthenticationService } from '../services/authentication.service';
import { TabsetComponent } from 'ngx-bootstrap';
import { CompanyService } from '../services/companyService.service';

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
  public amount: number = 0;
  public discount: number = 0;
  public payStep2: boolean = false;
  public payStep3: boolean = false;
  public isHaveCoupon: boolean = false;
  public couponcode: string = '';
  public payAlert: any[] = [];
  public directPay: boolean = false;
  public disableRazorPay: boolean = false;
  public contactNo$: Observable<string>;
  public countryCode$: Observable<string>;
  public isAddNewMobileNoInProcess$: Observable<boolean>;
  public isMobileNoVerifiedSuccess$: Observable<boolean>;
  public authenticateTwoWay$: Observable<boolean>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(private store: Store<AppState>, private _toasty: ToasterService, private _loginAction: LoginActions,
    private _loginService: AuthenticationService, private loginAction: LoginActions, private _companyService: CompanyService) {
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

  public addMoneyInWallet() {
    if (this.amount < 100) {
      this._toasty.warningToast('You cannot make payment', 'Warning');
    } else {
      this.payStep2 = true;
    }
  }

  public resetSteps() {
    this.amount = 0;
    this.payStep2 = false;
    this.payStep3 = false;
    this.isHaveCoupon = false;
  }

  public redeemCoupon() {
    this._companyService.getCoupon(this.couponcode).subscribe(res =>  {
      if (res.status === 'success') {
        switch (res.body.type) {
          case 'balance_add':
          this.directPay = true;
          this.disableRazorPay = true;
          break;
        case 'cashback':
          break;
        case 'cashback_discount':
          this.discount = 0;
          break;
        case 'discount':
          break;
        case 'discount_amount':
          break;
        default:
          this._toasty.warningToast('Something went wrong', 'Warning');
        }
      } else {
        this._toasty.errorToast(res.message, res.status);
        this.payAlert.push({msg: res.message, type: 'warning'});
      }
    });
  }

  public closeAlert(index: number) {
    this.payAlert.splice(index, 1);
  }
  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
