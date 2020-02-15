import { take, takeUntil } from 'rxjs/operators';
import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store/roots';
import { ToasterService } from '../services/toaster.service';
import { SignupWithMobile, UserDetails, VerifyMobileModel } from '../models/api-models/loginModels';
import { LoginActions } from '../actions/login.action';
import { SubscriptionsActions } from '../actions/userSubscriptions/subscriptions.action';
import { AuthenticationService } from '../services/authentication.service';
import { CompanyService } from '../services/companyService.service';
import { CompanyResponse, GetCouponResp, StateDetailsRequest } from '../models/api-models/Company';
import { cloneDeep } from '../lodash-optimized';
import { CompanyActions } from '../actions/company.actions';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SessionActions } from '../actions/session.action';
import * as moment from 'moment';
import { GIDDH_DATE_FORMAT_UI } from '../shared/helpers/defaultDateFormat';
import { BsModalRef, TabsetComponent } from 'ngx-bootstrap';
import { GeneralActions } from '../actions/general/general.actions';

@Component({
    selector: 'user-details',
    templateUrl: './userDetails.component.html',
    styleUrls: [`./userDetails.component.scss`],
})
export class UserDetailsComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('staticTabs') public staticTabs: TabsetComponent;
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
    public subscriptions: any;
    public transactions: any;
    public companies: any;
    public companyTransactions: any;
    public countryCode$: Observable<string>;
    public isAddNewMobileNoInProcess$: Observable<boolean>;
    public isAddNewMobileNoSuccess$: Observable<boolean>;
    public isVerifyAddNewMobileNoInProcess$: Observable<boolean>;
    public isVerifyAddNewMobileNoSuccess$: Observable<boolean>;
    public authenticateTwoWay$: Observable<boolean>;
    public selectedCompany: CompanyResponse = null;
    public user: UserDetails = null;
    public apiTabActivated: boolean = false;
    public userSessionResponse$: Observable<any>;
    public userSessionList: any[] = [];
    public moment = moment;
    public giddhDateFormatUI: string = GIDDH_DATE_FORMAT_UI;
    public userSessionId: any = null;
    public modalRef: BsModalRef;
    public activeTab: string;
    public isUpdateCompanyInProgress$: Observable<boolean>;
    public isCreateAndSwitchCompanyInProcess: boolean;

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>,
        private _toasty: ToasterService,
        private _loginAction: LoginActions,
        private _loginService: AuthenticationService,
        private loginAction: LoginActions,
        private _subscriptionsActions: SubscriptionsActions,
        private _companyService: CompanyService,
        private companyActions: CompanyActions,
        private router: Router,
        private _sessionAction: SessionActions,
        public _route: ActivatedRoute,
        private generalActions: GeneralActions) {
        this.contactNo$ = this.store.select(s => {
            if (s.session.user) {
                return s.session.user.user.contactNo;
            }
        }).pipe(takeUntil(this.destroyed$));
        this.countryCode$ = this.store.select(s => {
            if (s.session.user) {
                return s.session.user.countryCode;
            }
        }).pipe(takeUntil(this.destroyed$));
        this.isAddNewMobileNoInProcess$ = this.store.select(s => s.login.isAddNewMobileNoInProcess).pipe(takeUntil(this.destroyed$));
        this.isAddNewMobileNoSuccess$ = this.store.select(s => s.login.isAddNewMobileNoSuccess).pipe(takeUntil(this.destroyed$));
        this.isVerifyAddNewMobileNoInProcess$ = this.store.select(s => s.login.isVerifyAddNewMobileNoInProcess).pipe(takeUntil(this.destroyed$));
        this.isVerifyAddNewMobileNoSuccess$ = this.store.select(s => s.login.isVerifyAddNewMobileNoSuccess).pipe(takeUntil(this.destroyed$));
        this.userSessionResponse$ = this.store.select(s => s.userLoggedInSessions.Usersession).pipe(takeUntil(this.destroyed$));
        this.isUpdateCompanyInProgress$ = this.store.select(s => s.settings.updateProfileInProgress).pipe(takeUntil(this.destroyed$));

        this.authenticateTwoWay$ = this.store.select(s => {
            if (s.session.user) {
                return s.session.user.user.authenticateTwoWay;
            }
        }).pipe(takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this._route.params.subscribe(params => {
            if (params['type'] && this.activeTab !== params['type']) {
                // if active tab is null or undefined then it means component initialized for the first time
                if (!this.activeTab) {
                    this.setStateDetails(params['type']);
                }
                this.activeTab = params['type'];
            }
        });

        this.router.events
            .subscribe((event) => {
                if (event instanceof NavigationEnd) {
                    if (event.urlAfterRedirects.indexOf('/profile') !== -1) {
                        this.apiTabActivated = false;
                    } else {
                        this.apiTabActivated = true;
                    }
                }
            });
        //  this.getSubscriptionList();     // commented due todesign and API get changed
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
        this.store.select(s => s.subscriptions.companies)
            .pipe(takeUntil(this.destroyed$))
            .subscribe(s => this.companies = s);
        this.store.select(s => s.subscriptions.companyTransactions)
            .pipe(takeUntil(this.destroyed$))
            .subscribe(s => this.companyTransactions = s);
        this.store.select(s => s.session).pipe(takeUntil(this.destroyed$)).subscribe((session) => {
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
                this.userSessionId = _.cloneDeep(session.user.session.id);
            }
        });

        this.userSessionResponse$.subscribe(s => {
            if (s && s.length) {
                this.userSessionList = s;
            } else {
                this.store.dispatch(this._sessionAction.getAllSession());
            }
        });
        this.isUpdateCompanyInProgress$.pipe(takeUntil(this.destroyed$)).subscribe(inProcess => {
            this.isCreateAndSwitchCompanyInProcess = inProcess;
        });
    }

    /**
     * Lifecycle method that is triggered once all the view child are rendered
     *
     * @memberof UserDetailsComponent
     */
    public ngAfterViewInit(): void {
        this._route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe((val) => {
            if (val && val.tab && val.tabIndex) {
                this.selectTab(val.tabIndex);
            }
        });
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

    // public getSubscriptionList() {
    //   this.store.dispatch(this._subscriptionsActions.SubscribedCompanies());
    //   this.store.select(s => s.subscriptions.subscriptions)
    //     .pipe(takeUntil(this.destroyed$))
    //     .subscribe(s => {
    //       if (s && s.length) {
    //         this.subscriptions = s;
    //         this.store.dispatch(this._subscriptionsActions.SubscribedCompaniesList(s && s[0]));
    //         this.store.dispatch(this._subscriptionsActions.SubscribedUserTransactions(s && s[0]));
    //         this.store.select(s => s.subscriptions.transactions)
    //           .pipe(takeUntil(this.destroyed$))
    //           .subscribe(s => this.transactions = s);
    //       }
    //     });
    // }

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
            modal: {}
        };
        options.handler = ((response) => {
            //
        });
        let rzp1 = new (window as any).Razorpay(options);
        rzp1.open();
    }

    public selectTab(id: number) {
        if(this.staticTabs) {
            this.staticTabs.tabs[id].active = true;
        }
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * deleteSession
     */
    public deleteSession(sessionId: string) {
        this.store.dispatch(this._sessionAction.deleteSession(sessionId));
    }

    public clearAllSession() {
        this.store.dispatch(this._sessionAction.deleteAllSession());
    }

    /**
     * Tab change handler, used to set the state for selected page
     * which is used by header component, update menu panel and
     * change the route URL as per selected tab
     *
     * @param {string} tabName Current selected tab
     * @memberof UserDetailsComponent
     */
    public onTabChanged(tabName: string): void {
        this.setStateDetails(tabName);
        this.store.dispatch(this.generalActions.setAppTitle(`pages/user-details/${tabName}`));
        this.router.navigate(['pages/user-details/', tabName], { replaceUrl: true });
    }

    /**
     * Sets the state for selected page
     * which is used by header component
     *
     * @private
     * @param {string} tabName Current selected tab
     * @memberof UserDetailsComponent
     */
    private setStateDetails(tabName: string): void {
        let companyUniqueName = null;
        this.store.pipe(select(c => c.session.companyUniqueName), take(1)).subscribe(s => companyUniqueName = s);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = `pages/user-details/${tabName}`;
        this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
    }

}






