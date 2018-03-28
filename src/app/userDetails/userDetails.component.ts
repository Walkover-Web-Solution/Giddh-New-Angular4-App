import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { ToasterService } from '../services/toaster.service';
import { SignupWithMobile, UserDetails, VerifyMobileModel } from '../models/api-models/loginModels';
import { LoginActions } from '../actions/login.action';
import { AuthenticationService } from '../services/authentication.service';
import { CompanyService } from '../services/companyService.service';
import { CompanyResponse, GetCouponResp, StateDetailsRequest } from '../models/api-models/Company';
import { cloneDeep } from '../lodash-optimized';
import { CompanyActions } from '../actions/company.actions';

@Component({
  selector: 'user-details',
  templateUrl: './userDetails.component.html'
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  public userAuthKey: string = '';
  public expandLongCode: boolean = false;
  public twoWayAuth: boolean = false;
  public phoneNumber: string = '';
  public oneTimePassword: string = '';
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
  public coupRes: GetCouponResp = new GetCouponResp();
  public contactNo$: Observable<string>;
  public countryCode$: Observable<string>;
  public isAddNewMobileNoInProcess$: Observable<boolean>;
  public isAddNewMobileNoSuccess$: Observable<boolean>;
  public isVerifyAddNewMobileNoInProcess$: Observable<boolean>;
  public isVerifyAddNewMobileNoSuccess$: Observable<boolean>;
  public authenticateTwoWay$: Observable<boolean>;
  public selectedCompany: CompanyResponse = null;
  public user: UserDetails = null;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private _toasty: ToasterService, private _loginAction: LoginActions,
    private _loginService: AuthenticationService, private loginAction: LoginActions, private _companyService: CompanyService,
    private _companyActions: CompanyActions) {
    this.contactNo$ = this.store.select(s => {
      if (s.session.user) {
        return s.session.user.user.contactNo;
      }
    }).takeUntil(this.destroyed$);
    this.countryCode$ = this.store.select(s => {
      if (s.session.user) {
        return s.session.user.countryCode;
      }
    }).takeUntil(this.destroyed$);
    this.isAddNewMobileNoInProcess$ = this.store.select(s => s.login.isAddNewMobileNoInProcess).takeUntil(this.destroyed$);
    this.isAddNewMobileNoSuccess$ = this.store.select(s => s.login.isAddNewMobileNoSuccess).takeUntil(this.destroyed$);
    this.isVerifyAddNewMobileNoInProcess$ = this.store.select(s => s.login.isVerifyAddNewMobileNoInProcess).takeUntil(this.destroyed$);
    this.isVerifyAddNewMobileNoSuccess$ = this.store.select(s => s.login.isVerifyAddNewMobileNoSuccess).takeUntil(this.destroyed$);
    this.authenticateTwoWay$ = this.store.select(s => {
      if (s.session.user) {
        console.log(s.session.user);
        return s.session.user.user.authenticateTwoWay;
      }
    }).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    // console.log(RazorPay);
    this.contactNo$.subscribe(s => this.phoneNumber = s);
    this.countryCode$.subscribe(s => this.countryCode = s);
    this.isAddNewMobileNoSuccess$.subscribe(s => this.showVerificationBox = s);
    this.isVerifyAddNewMobileNoSuccess$.subscribe(s => {
      if (s) {
        this.oneTimePassword = '';
        this.showVerificationBox = false;
      }
    });
    this.authenticateTwoWay$.subscribe(s => this.twoWayAuth = s);
    this.store.dispatch(this.loginAction.FetchUserDetails());
    this._loginService.GetAuthKey().subscribe(a => {
      if (a.status === 'success') {
        this.userAuthKey = a.body.authKey;
      } else {
        this._toasty.errorToast(a.message, a.status);
      }
    });

    this.store.select(s => s.session).takeUntil(this.destroyed$).subscribe((session) => {
      let companyUniqueName: string;
      if (session.companyUniqueName) {
        companyUniqueName = cloneDeep(session.companyUniqueName);
      }
      if (session.companies && session.companies.length) {
        let companies = cloneDeep(session.companies);
        this.selectedCompany = companies.find((company) => company.uniqueName === companyUniqueName);
      }
      if (session.user) {
        this.user = cloneDeep(session.user.user);
      }
    });

    let cmpUniqueName = null;
    this.store.select(c => c.session.companyUniqueName).take(1).subscribe(s => cmpUniqueName = s);
    let stateDetailsRequest = new StateDetailsRequest();
    stateDetailsRequest.companyUniqueName = cmpUniqueName;
    stateDetailsRequest.lastState = 'user-details';

    this.store.dispatch(this._companyActions.SetStateDetails(stateDetailsRequest));
  }

  public addNumber(no: string) {
    this.oneTimePassword = '';
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

  public verifyNumber() {
    const request: VerifyMobileModel = new VerifyMobileModel();
    request.countryCode = Number(this.countryCode) || 91;
    request.mobileNumber = this.phoneNumber;
    request.oneTimePassword = this.oneTimePassword;
    this.store.dispatch(this._loginAction.VerifyAddNewMobileNo(request));
  }

  public getSubscriptionList() {
    this.store.dispatch(this._loginAction.SubscribedCompanies());
  }

  public changeTwoWayAuth() {
    this._loginService.SetSettings({ authenticateTwoWay: this.twoWayAuth }).subscribe(res => {
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
    this._companyService.getCoupon(this.couponcode).subscribe(res => {
      if (res.status === 'success') {
        this.coupRes = res.body;
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
        this.payAlert.push({ msg: res.message, type: 'warning' });
      }
    });
  }

  public checkDiffAndAlert(type) {
    this.directPay = false;
    switch (type) {
      case 'cashback_discount':
        this.disableRazorPay = false;
        return this.payAlert.push({ msg: `Your cashback amount will be credited in your account withing 48 hours after payment has been done. Your will get a refund of Rs. {$scope.cbDiscount}` });
      case 'cashback':
        if (this.amount < this.coupRes.value) {
          this.disableRazorPay = true;
          return this.payAlert.push({ msg: `Your coupon is redeemed but to avail coupon, You need to make a payment of Rs. ${this.coupRes.value}` });
        } else {
          this.disableRazorPay = false;
          return this.payAlert.push({ type: 'success', msg: `Your cashback amount will be credited in your account withing 48 hours after payment has been done. Your will get a refund of Rs. ${this.coupRes.value}` });
        }

      case 'discount':
        let diff = this.amount - this.discount;
        if (diff < 100) {
          this.disableRazorPay = true;
          return this.payAlert.push({ msg: `After discount amount cannot be less than 100 Rs. To avail coupon you have to add more money. Currently payable amount is Rs. ${diff}` });
        } else {
          this.disableRazorPay = false;
          return this.payAlert.push({ type: 'success', msg: `Hurray you have availed a discount of Rs. ${this.discount}. Now payable amount is Rs. ${diff}` });
        }
      case 'discount_amount':
        diff = this.amount - this.discount;
        if (diff < 100) {
          this.disableRazorPay = true;
          return this.payAlert.push({ msg: `After discount amount cannot be less than 100 Rs. To avail coupon you have to add more money. Currently payable amount is Rs. ${diff}` });
        } else if (this.amount < this.coupRes.value) {
          this.disableRazorPay = true;
          return this.payAlert.push({ msg: `Your coupon is redeemed but to avail coupon, You need to make a payment of Rs. ${this.coupRes.value}` });
        } else {
          this.disableRazorPay = false;
          return this.payAlert.push({ type: 'success', msg: `Hurray you have availed a discount of Rs. ${this.discount}. Now payable amount is Rs. ${diff}` });
        }
    }
  }

  public closeAlert(index: number) {
    this.payAlert.splice(index, 1);
  }

  public regenerateKey() {
    this._loginService.RegenerateAuthKey().subscribe(a => {
      if (a.status === 'success') {
        this.userAuthKey = a.body.authKey;
      } else {
        this._toasty.errorToast(a.message, a.status);
      }
    });
  }

  public payWithRazor() {
    let options: any = {
      key: 'rzp_live_rM2Ub3IHfDnvBq',
      amount: this.amount, // 2000 paise = INR 20
      name: 'Giddh',
      description: `${this.selectedCompany.name} Subscription for Giddh`,
      // tslint:disable-next-line:max-line-length
      image: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAAtCAMAAAAwerGLAAAAA3NCSVQICAjb4U/gAAAAXVBMVEX////HPBMjHyDHPBMjHyDHPBMjHyDHPBMjHyDHPBMjHyDHPBMjHyDHPBMjHyDHPBMjHyDHPBMjHyDHPBMjHyDHPBMjHyDHPBMjHyDHPBMjHyDHPBMjHyDHPBMjHyB24UK9AAAAH3RSTlMAEREiIjMzRERVVWZmd3eIiJmZqqq7u8zM3d3u7v//6qauNwAAAAlwSFlzAAAK8AAACvABQqw0mAAAABh0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzT7MfTgAAA/BJREFUWIXdme2CqiAQhlsjInN1ouSYy3r/l3lAvpFK0raz5/1FSPgwwMyAm81/oe2xObVte2oO23ejzNSuuX47XZtl3Kik5aQS1xTpYlHZ4vPat9+xzrsn+0LA+mEYIKgkwETdQOTzEjpRxAuRt1NkqdPHU72RYVQIDaqycMWFzIevJLNYJM8ZG5XSktHyIDXXpKi+LIdubiBLHZ/rstIrIRBzpN1S6JPH2DZSbRY1DLyK68gDaLYQ2tn5fDB1H8d2NrU06hB7ghnQ3QLmgzVyuH73f8yDB+sahgTgDGj2PPPW7MHPySMzBdf7PgQLFB5Xvhb6rMC+9olnR03d3O+ipDBxuS+F3muuFLOjzg+OL4Vub60NJe1YTtn9vhJ6p/fgrecfOh3JjoyvhG4eTf9x4vZEOGMMAiACF/ejqIAxRkNoVFPGLn0MjUXTy8THP5Iy5Dmjhc4bBgaSDcv3+t6jAD4YWWjMbJ0PPcZ6oa7IYt4qOx7uNPlUTcxPYUFeEUtGNqUagsETxuwB1HMDLaMPBaARtFPeQlGT/zVjXDv3fskyoo6WFmvDvRYJWCoLhbc8xH84MSPyoTktEYZUPL2r5v42HHX1J6M30bfzLOmgO1tyGxGJUu1IHbReFXJ4Wcv6NCN2tF4bYrNk8PJlC125fNRBX9yKT3oPMsSZ9wO1E2hUi/1c+zujSUJXKWgPykJLQxvfkoRGi6G1b/BTzRhavatMQXt7ykL7DdN+eik0tRu6TkK73AgSaxqnoGF16GhNV54bsk42GFhvdk3v5cOGVYL2r4eOvEfvQdsYF3gPOdnSf0l3bTM7A4087xVAm+GtA30I/DT2Hb7pPfTTajJ6GTum0Bvu3m+hiTeSdaDDiEgCaP2iKCJuEJVoXd05agtN3VgsdMGdqdfxHmFmkYS+lZ1AYCrmOhijH2J2M48OicneSsmPLXTv3poH3fiTn1oeUZYnUji4iNxivCFSTZCk4iVBBnDomd4cvRxLodKijul8pQPZjSxV8j9YTk9HJmnsHYX59HQjRvl0zb0Wyrwm61PWsr9UQsSRoxa/VP/UTSm4xCnH1MHJZerywpNLHUyFyh0IaKk/EHl3xCnG/FJb61XdaOGCdlDhcXK00KY0xRzo8IzogovqJDojcj3RjCVuvX5S4Wk8DOPRaRy7JxvUZeZmqyq690DgEqb43iM490lXlrN71tX8GyYU7BdwMfsNmn+XxyPovBPHupp9awr+7ovO2z+uuffTYh335nxAcp3r6pr7JQDzgdfS0xKqwsRbdeObSxPfLGE/aGbeV7xAM79uFWCx6duZN/O/I2J5twTVv4A8Sn+xbX7PF9vfob+6UM+V7KGTkAAAAABJRU5ErkJggg==`,
      prefill: {
        name: this.user.name,
        email: this.user.email,
        contact: this.user.contactNo
      },
      notes: {
        address: this.selectedCompany.address
      },
      theme: {
        color: '#449d44'
      },
      modal: {
      }
    };
    options.handler = ((response) => {
      //
    });
    let rzp1 = new (window as any).Razorpay(options);
    rzp1.open();
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
