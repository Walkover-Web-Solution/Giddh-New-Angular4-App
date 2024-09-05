import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, ReplaySubject, take, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from '../store';
import { select, Store } from '@ngrx/store';
import { GeneralActions } from '../actions/general/general.actions';
import { ToasterService } from '../services/toaster.service';
import { CompanyResponse } from '../models/api-models/Company';
import { SignupWithMobile, UserDetails, VerifyMobileModel } from '../models/api-models/loginModels';
import { GIDDH_DATE_FORMAT_DD_MM_YYYY, GIDDH_DATE_FORMAT_UI } from '../shared/helpers/defaultDateFormat';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ClipboardService } from 'ngx-clipboard';
import { LoginActions } from '../actions/login.action';
import { SessionActions } from '../actions/session.action';
import { API_POSTMAN_DOC_URL, BootstrapToggleSwitch } from '../app.constant';
import { cloneDeep } from '../lodash-optimized';
import { AuthenticationService } from '../services/authentication.service';
import * as dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';
import { ConfirmationModalButton } from '../theme/confirmation-modal/confirmation-modal.interface';
import { NewConfirmationModalComponent } from '../theme/new-confirmation-modal/confirmation-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { GeneralService } from '../services/general.service';
dayjs.extend(duration)
@Component({
    selector: 'app-subscription',
    templateUrl: './subscription.component.html',
    styleUrls: ['./subscription.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionComponent implements OnInit, OnDestroy {
    /** True If Auth key copied and used toggle Copy text */
    public isCopied: boolean = false;
    public userAuthKey: string = '';
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
    /* Holds Mat Table Columns*/
    public displayedColumns: string[] = ['ipaddress', 'signindate', 'signintime', 'duration', 'agent', 'action'];
    /** Holds Active Tab Index */
    public activeTabIndex: number = 0;
    /** Holds Tab Name */
    private tabName = ['auth-key', 'mobile-number', 'session', 'subscription'];
    /** Holds True if API calling in progress in old subscription page */
    public isSubscriptionLoading: boolean = false;
    /** Holds subscription id */
    public subscriptionId: string = '';

    constructor(private store: Store<AppState>,
        private toasty: ToasterService,
        private loginService: AuthenticationService,
        private loginAction: LoginActions,
        private router: Router,
        private sessionAction: SessionActions,
        private route: ActivatedRoute,
        private breakPointObservar: BreakpointObserver,
        private generalActions: GeneralActions,
        private changeDetectionRef: ChangeDetectorRef,
        private dialog: MatDialog,
        private generalService: GeneralService,
        private clipboardService: ClipboardService) {
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

    /**
     * Copy Authkey to Clipboard
     *
     * @memberof SubscriptionComponent
     */
    public toggleIsCopied(): void {
        this.isCopied = true;
        this.clipboardService.copyFromContent(this.userAuthKey);
        setTimeout(() => {
            this.isCopied = false;
        }, 3000);
    }

    public ngOnInit() {
        document.querySelector('body').classList.add('setting-sidebar-open');

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
            if (params['type'] && this.tabName[this.activeTabIndex] !== params['type']) {
                this.activeTabIndex = this.tabName.indexOf(params['type']);
            } else if (!params['type'] && !this.activeTabIndex) {
                this.activeTabIndex = 0;
            }
        });

        this.route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if (params && params.tabIndex) {
                if (params && params.tabIndex == "0") {
                    this.activeTabIndex = 0;
                } else if (params && params.tabIndex == "1") {
                    this.activeTabIndex = 1;
                } else if (params && params.tabIndex == "2") {
                    this.activeTabIndex = 2;
                } else if (params && params.tabIndex == "3") {
                    this.activeTabIndex = 3;
                }
                this.router.navigate(['pages/user-details/', this.tabName[this.activeTabIndex]], { replaceUrl: true });
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
            this.changeDetectionRef.detectChanges();
        });

    }

    /**
     * Lifecycle method that is triggered once all the view child are rendered
     *
     * @memberof SubscriptionComponent
     */
    public ngAfterViewInit(): void {
        this.route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe((val) => {
            if (val && val.tab && val.tabIndex) {
                this.selectTab({ index: val.tabIndex });
            }
        });
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

    public selectTab(event: any): void {
        this.activeTabIndex = event?.index;
        this.onTabChanged();
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
     * @memberof SubscriptionComponent
     */
    public deleteSession(sessionId: string, sessionIndex: number): void {
        const requestPayload = {
            sessionId,
            sessionIndex
        };
        let dialogRef = this.dialog.open(NewConfirmationModalComponent, {
            panelClass: ['mat-dialog-md'],
            data: {
                configuration: this.generalService.deleteConfiguration(this.localeData?.session?.delete_single_session, this.commonLocaleData)
            }
        });
        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response === this.commonLocaleData?.app_yes) {
                this.store.dispatch(this.sessionAction.deleteSession(requestPayload));
            }
        });
    }

    /**
     * Deletes All sessions
     *
     * @memberof SubscriptionComponent
     */
    public clearAllSession(): void {
        const dialogRef = this.dialog.open(NewConfirmationModalComponent, {
            panelClass: ['mat-dialog-md'],
            data: {
                configuration: this.generalService.deleteConfiguration(this.localeData?.session?.delete_all_sessions, this.commonLocaleData)
            }
        });
        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response === this.commonLocaleData?.app_yes) {
                this.store.dispatch(this.sessionAction.deleteAllSession());
            }
        });
    }

    /**
     * Tab change handler, used to set the state for selected page
     * which is used by header component, update menu panel and
     * change the route URL as per selected tab
     *
     * @memberof SubscriptionComponent
     */
    public onTabChanged(): void {
        this.store.dispatch(this.generalActions.setAppTitle(`pages/user-details/${this.tabName[this.activeTabIndex]}`));
        this.router.navigate(['pages/user-details/', this.tabName[this.activeTabIndex]], { replaceUrl: true });
    }

    /**
     * This will return page heading based on active tab
     *
     * @param {boolean} event
     * @memberof SubscriptionComponent
     */
    public getPageHeading(): string {
        let pageHeading = "";

        if (this.isMobileScreen) {
            switch (this.activeTabIndex) {
                case 0:
                    pageHeading = this.localeData?.auth_key?.tab_heading;
                    break;
                case 1:
                    pageHeading = this.localeData?.mobile_number?.tab_heading;
                    break;
                case 2:
                    pageHeading = this.localeData?.session?.tab_heading;
                    break;
                case 3:
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
     * @memberof SubscriptionComponent
     */
    public trackBySessionId(index: number, item: any): string {
        return item.sessionId;
    }
}
