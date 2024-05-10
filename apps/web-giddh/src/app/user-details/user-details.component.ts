import { takeUntil } from 'rxjs/operators';
import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store/roots';
import { ToasterService } from '../services/toaster.service';
import { SignupWithMobile, UserDetails, VerifyMobileModel } from '../models/api-models/loginModels';
import { LoginActions } from '../actions/login.action';
import { AuthenticationService } from '../services/authentication.service';
import { CompanyResponse } from '../models/api-models/Company';
import { cloneDeep } from '../lodash-optimized';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionActions } from '../actions/session.action';
import * as dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';
dayjs.extend(duration)
import { GIDDH_DATE_FORMAT_DD_MM_YYYY, GIDDH_DATE_FORMAT_UI } from '../shared/helpers/defaultDateFormat';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { GeneralActions } from '../actions/general/general.actions';
import { API_POSTMAN_DOC_URL, BootstrapToggleSwitch } from '../app.constant';
import { BreakpointObserver } from '@angular/cdk/layout';
import { SettingsProfileActions } from '../actions/settings/profile/settings.profile.action';

@Component({
    selector: 'user-details',
    templateUrl: './user-details.component.html',
    styleUrls: [`./user-details.component.scss`],
})
export class UserDetailsComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('staticTabs', { static: true }) public staticTabs: TabsetComponent;
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
    public dayjs = dayjs;
    public giddhDateFormatUI: string = GIDDH_DATE_FORMAT_UI;
    public userSessionId: any = null;
    public modalRef: BsModalRef;
    public activeTab: string = '';
    public isUpdateCompanyInProgress$: Observable<boolean>;
    public isCreateAndSwitchCompanyInProcess: boolean;
    public isMobileScreen: boolean = true;
    public apiPostmanDocUrl: String = API_POSTMAN_DOC_URL;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** This will hold toggle buttons value and size */
    public bootstrapToggleSwitch = BootstrapToggleSwitch;

    constructor(private store: Store<AppState>,
        private toasty: ToasterService,
        private loginService: AuthenticationService,
        private loginAction: LoginActions,
        private router: Router,
        private sessionAction: SessionActions,
        private route: ActivatedRoute,
        private breakPointObservar: BreakpointObserver,
        private generalActions: GeneralActions, private settingsProfileActions: SettingsProfileActions) {
        this.contactNo$ = this.store.pipe(select(s => {
            if (s.session.user) {
                return s.session.user.user.contactNo;
            }
        }), takeUntil(this.destroyed$));
        this.countryCode$ = this.store.pipe(select(s => {
            if (s.session.user) {
                return s.session.user.countryCode;
            }
        }), takeUntil(this.destroyed$));

        this.isAddNewMobileNoInProcess$ = this.store.pipe(select(s => s.login.isAddNewMobileNoInProcess), takeUntil(this.destroyed$));
        this.isAddNewMobileNoSuccess$ = this.store.pipe(select(s => s.login.isAddNewMobileNoSuccess), takeUntil(this.destroyed$));
        this.isVerifyAddNewMobileNoInProcess$ = this.store.pipe(select(s => s.login.isVerifyAddNewMobileNoInProcess), takeUntil(this.destroyed$));
        this.isVerifyAddNewMobileNoSuccess$ = this.store.pipe(select(s => s.login.isVerifyAddNewMobileNoSuccess), takeUntil(this.destroyed$));
        this.userSessionResponse$ = this.store.pipe(select(s => s.userLoggedInSessions.Usersession), takeUntil(this.destroyed$));
        this.isUpdateCompanyInProgress$ = this.store.pipe(select(s => s.settings.updateProfileInProgress), takeUntil(this.destroyed$));

        this.authenticateTwoWay$ = this.store.pipe(select(s => {
            if (s.session.user) {
                return s.session.user.user.authenticateTwoWay;
            }
        }), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        document.querySelector('body').classList.add('setting-sidebar-open');
        /** To reset isUpdateCompanyInProgress in case of subscription module */
        this.store.dispatch(this.settingsProfileActions.resetPatchProfile());

        this.breakPointObservar.observe([
            '(max-width:767px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileScreen = result.matches;
        });

        if (!this.isCreateAndSwitchCompanyInProcess) {
            document.querySelector('body').classList.add('tabs-page');
        } else {
            document.querySelector('body').classList.remove('tabs-page');
        }

        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if (params['type'] && this.activeTab !== params['type']) {
                this.activeTab = params['type'];
            } else if (!params['type'] && !this.activeTab) {
                this.activeTab = "auth-key";
            }
        });

        this.route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if (params && params.tabIndex) {
                if (params && params.tabIndex == "0") {
                    this.activeTab = "auth-key";
                } else if (params && params.tabIndex == "1") {
                    this.activeTab = "mobile-number";
                } else if (params && params.tabIndex == "2") {
                    this.activeTab = "session";
                } else if (params && params.tabIndex == "3") {
                    this.activeTab = "subscription";
                }
                this.router.navigate(['pages/user-details/', this.activeTab], { replaceUrl: true });
            }
        });

        this.contactNo$.subscribe(s => this.phoneNumber = s);
        this.countryCode$.subscribe(s => this.countryCode = s);
        this.isAddNewMobileNoSuccess$.subscribe(s => this.showVerificationBox = s);
        this.isVerifyAddNewMobileNoSuccess$.subscribe(s => {
            if (s) {
                this.oneTimePassword = '';
                this.showVerificationBox = false;
            }
        });
        this.authenticateTwoWay$.subscribe(response => {
            this.twoWayAuth = (response) ? true : false;
        });
        this.store.dispatch(this.loginAction.FetchUserDetails());
        this.loginService.GetAuthKey().pipe(takeUntil(this.destroyed$)).subscribe(a => {
            if (a?.status === 'success') {
                this.userAuthKey = a?.body?.authKey;
            } else {
                this.toasty.errorToast(a?.message, a?.status);
            }
        });
        this.store.pipe(select(s => s.subscriptions.companies), takeUntil(this.destroyed$))
            .subscribe(s => this.companies = s);
        this.store.pipe(select(s => s.subscriptions.companyTransactions), takeUntil(this.destroyed$))
            .subscribe(s => this.companyTransactions = s);

        this.store.pipe(select(s => s.session.user), takeUntil(this.destroyed$)).subscribe((user) => {
            if (user) {
                this.user = cloneDeep(user.user);
                this.userSessionId = _.cloneDeep(user.session?.id);
            }
        });

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.selectedCompany = activeCompany;
            }
        });

        this.store.dispatch(this.sessionAction.getAllSession());

        this.userSessionResponse$.subscribe(s => {
            if (s && s.length) {
                this.userSessionList = s.map(session => {
                    // Calculate sign in date
                    session.signInDate = dayjs(session.createdAt).format(GIDDH_DATE_FORMAT_DD_MM_YYYY);
                    // Calculate sign in time
                    session.signInTime = dayjs(session.createdAt).format('LTS');
                    // Calculate duration
                    const duration = dayjs.duration(dayjs().diff(session.createdAt));
                    session.sessionDuration = `${duration.days()}/${duration.hours()}/${duration.minutes()}/${duration.seconds()}`;
                    return session;
                });
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
        this.route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe((val) => {
            if (val && val.tab && val.tabIndex) {
                this.selectTab(val.tabIndex);
            }
        });

        if (document.getElementsByClassName('nav-item') && document.getElementsByClassName('nav-item')[3]) {
            document.getElementsByClassName('nav-item')[3].addEventListener('click', (event) => {
                this.onTabChanged("subscription");
            });
        }
    }

    public addNumber(no: string) {
        this.oneTimePassword = '';
        const mobileRegex = /^[0-9]{1,10}$/;
        if (mobileRegex.test(no) && (no?.length === 10)) {
            const request: SignupWithMobile = new SignupWithMobile();
            request.countryCode = Number(this.countryCode) || 91;
            request.mobileNumber = this.phoneNumber;
            this.store.dispatch(this.loginAction.AddNewMobileNo(request));
        } else {
            this.toasty.errorToast(this.localeData?.mobile_number?.mobile_number_validation_error);
        }
    }

    public verifyNumber() {
        const request: VerifyMobileModel = new VerifyMobileModel();
        request.countryCode = Number(this.countryCode) || 91;
        request.mobileNumber = this.phoneNumber;
        request.oneTimePassword = this.oneTimePassword;
        this.store.dispatch(this.loginAction.VerifyAddNewMobileNo(request));
    }

    public changeTwoWayAuth() {
        this.loginService.SetSettings({ authenticateTwoWay: this.twoWayAuth }).pipe(takeUntil(this.destroyed$)).subscribe(res => {
            if (res?.status === 'success') {
                this.toasty.successToast(res.body);
            } else {
                this.toasty.errorToast(res?.message);
            }
        });
    }

    public regenerateKey() {
        this.loginService.RegenerateAuthKey().pipe(takeUntil(this.destroyed$)).subscribe(a => {
            if (a?.status === 'success') {
                this.userAuthKey = a.body?.authKey;
            } else {
                this.toasty.errorToast(a?.message, a?.status);
            }
        });
    }

    public selectTab(id: number) {
        if (this.staticTabs && this.staticTabs.tabs && this.staticTabs.tabs[id]) {
            this.staticTabs.tabs[id].active = true;
        }
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body').classList.remove('setting-sidebar-open');
    }

    /**
     * Deletes the session
     *
     * @param {string} sessionId Session ID
     * @param {number} sessionIndex Index of session to be deleted required to delete the session from store
     * @memberof UserDetailsComponent
     */
    public deleteSession(sessionId: string, sessionIndex: number): void {
        const requestPayload = {
            sessionId,
            sessionIndex
        };
        this.store.dispatch(this.sessionAction.deleteSession(requestPayload));
    }

    public clearAllSession() {
        this.store.dispatch(this.sessionAction.deleteAllSession());
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
        this.store.dispatch(this.generalActions.setAppTitle(`pages/user-details/${tabName}`));
        this.router.navigate(['pages/user-details/', tabName], { replaceUrl: true });
    }

    /**
     * This will return page heading based on active tab
     *
     * @param {boolean} event
     * @memberof UserDetailsComponent
     */
    public getPageHeading(): string {
        let pageHeading = "";

        if (this.isMobileScreen) {
            switch (this.activeTab) {
                case 'auth-key':
                    pageHeading = this.localeData?.auth_key?.tab_heading;
                    break;
                case 'mobile-number':
                    pageHeading = this.localeData?.mobile_number?.tab_heading;
                    break;
                case 'session':
                    pageHeading = this.localeData?.session?.tab_heading;
                    break;
                case 'subscription':
                    pageHeading = this.localeData?.subscription?.tab_heading;
                    break;
            }
        }
        return pageHeading;
    }

    /**
     * Tracks by sessionId
     *
     * @param {number} index Index of current session
     * @param {*} item Session ID instance
     * @return {*} {string} Session's ID for unique identification
     * @memberof UserDetailsComponent
     */
    public trackBySessionId(index: number, item: any): string {
        return item.sessionId;
    }
}
