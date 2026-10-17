import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Observable, ReplaySubject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from '../store';
import { select, Store } from '@ngrx/store';
import { GeneralActions } from '../actions/general/general.actions';
import { ToasterService } from '../services/toaster.service';
import { UpdateUserContactRequest, UserDetails } from '../models/api-models/loginModels';
import { GIDDH_DATE_FORMAT_DD_MM_YYYY, GIDDH_DATE_FORMAT_UI } from '../shared/helpers/defaultDateFormat';
import { ClipboardService } from 'ngx-clipboard';
import { LoginActions } from '../actions/login.action';
import { SessionActions } from '../actions/session.action';
import { cloneDeep } from '../lodash-optimized';
import { AuthenticationService } from '../services/authentication.service';
import * as dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';
import { NewConfirmationModalComponent } from '../theme/new-confirmation-modal/confirmation-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { GeneralService } from '../services/general.service';
import { IServiceConfigArgs, ServiceConfig } from '../services/service.config';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Configuration, ELECTRON_OTP_PROVIDER_URL, OTP_PROVIDER_URL } from '../app.constant';

declare var initSendOTP: (config: Record<string, unknown>) => void;

dayjs.extend(duration)
@Component({
    selector: 'app-subscription',
    templateUrl: './subscription.component.html',
    styleUrls: ['./subscription.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone:false
})
export class SubscriptionComponent implements OnInit, OnDestroy {
    /** True If Auth key copied and used toggle Copy text */
    public isCopied: boolean = false;
    public userAuthKey: string = '';
    public twoWayAuth: boolean = false;
    public subscriptions: any;
    public transactions: any;
    public companies: any;
    public companyTransactions: any;
    public authenticateTwoWay$: Observable<boolean>;
    public user: UserDetails = null;
    public apiTabActivated: boolean = false;
    public userSessionResponse$: Observable<any>;
    public userSessionList: any[] = [];
    public dayjs = dayjs;
    public giddhDateFormatUI: string = GIDDH_DATE_FORMAT_UI;
    public userSessionId: any = null;
    public isUpdateCompanyInProgress$: Observable<boolean>;
    public isCreateAndSwitchCompanyInProcess: boolean;
    public apiPostmanDocUrl: string = '';
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /* Holds Mat Table Columns*/
    public displayedColumns: string[] = ['ipaddress', 'signindate', 'signintime', 'duration', 'agent', 'action'];
    /** Holds Active Tab Index */
    public activeTabIndex: number = 0;
    /** Holds Tab Name — contact-details replaces deprecated mobile-number */
    private tabName = ['auth-key', 'contact-details', 'session', 'subscription'];
    /** Holds True if API calling in progress in old subscription page */
    public isSubscriptionLoading: boolean = false;
    /** Holds subscription id */
    public subscriptionId: string = '';
    /** Holds profile data */
    public profileData: any = null;

    /** Original email loaded from session (for change detection) */
    public originalEmail: string = '';
    /** Original mobile with country code digits only */
    public originalMobile: string = '';
    /** Editable email value */
    public email: string = '';
    /** Mobile form control for mobile-number-input (value includes +countryCode) */
    public mobileControl: UntypedFormControl = new UntypedFormControl({ value: '', disabled: true });
    /** Email OTP input */
    public emailOtp: string = '';
    /** Mobile OTP input */
    public mobileOtp: string = '';
    /** MSG91 request id for email OTP */
    public emailOtpRequestId: string = '';
    /** MSG91 request id for mobile OTP */
    public mobileOtpRequestId: string = '';
    /** MSG91 access token after email OTP verify */
    public emailAccessToken: string = '';
    /** MSG91 access token after mobile OTP verify */
    public mobileAccessToken: string = '';
    public showEmailOtp: boolean = false;
    public showMobileOtp: boolean = false;
    public isEmailVerified: boolean = false;
    public isMobileVerified: boolean = false;
    public emailSendOtpInProgress: boolean = false;
    public mobileSendOtpInProgress: boolean = false;
    public emailVerifyOtpInProgress: boolean = false;
    public mobileVerifyOtpInProgress: boolean = false;
    public emailResendOtpInProgress: boolean = false;
    public mobileResendOtpInProgress: boolean = false;
    public isSavingContact: boolean = false;
    public isEditingEmail: boolean = false;
    public isEditingMobile: boolean = false;
    /** True once MSG91 widget script is initialized */
    private isOtpWidgetReady: boolean = false;
    /** MSG91 mobile resend channels (VOICE / SMS / WHATSAPP), excludes email channel 3 */
    public otpResendChannels: Array<{ name: string; value: string | number }> = [];


    constructor(private store: Store<AppState>,
        private toasty: ToasterService,
        private loginService: AuthenticationService,
        private loginAction: LoginActions,
        private router: Router,
        private sessionAction: SessionActions,
        private route: ActivatedRoute,
        private generalActions: GeneralActions,
        private changeDetectionRef: ChangeDetectorRef,
        private dialog: MatDialog,
        private generalService: GeneralService,
        private clipboardService: ClipboardService,
        @Inject(ServiceConfig) private serviceConfig: IServiceConfigArgs
    ) {
        this.apiPostmanDocUrl = this.serviceConfig.API_DOC_URL;
        this.userSessionResponse$ = this.store.pipe(select(appState => appState.userLoggedInSessions.Usersession), takeUntil(this.destroyed$));
        this.isUpdateCompanyInProgress$ = this.store.pipe(select(appState => appState.settings.getProfileInProgress), takeUntil(this.destroyed$));

        this.authenticateTwoWay$ = this.store.pipe(select(appState => {
            if (appState.session.user) {
                return appState.session.user.user.authenticateTwoWay;
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


        if (!this.isCreateAndSwitchCompanyInProcess) {
            document.querySelector('body').classList.add('tabs-page');
        } else {
            document.querySelector('body').classList.remove('tabs-page');
        }

        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            const routeType = params['type'] === 'mobile-number' ? 'contact-details' : params['type'];
            if (params['type'] === 'mobile-number') {
                this.router.navigate(['pages/user-details/contact-details'], { replaceUrl: true });
            }
            if (routeType && this.tabName[this.activeTabIndex] !== routeType) {
                const tabIndex = this.tabName.indexOf(routeType);
                if (tabIndex > -1) {
                    this.activeTabIndex = tabIndex;
                }
            } else if (!params['type'] && !this.activeTabIndex) {
                this.activeTabIndex = 0;
            }
            if (this.activeTabIndex === 1) {
                this.initOtpWidget();
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
        this.store.pipe(select(appState => appState.subscriptions.companies), takeUntil(this.destroyed$))
            .subscribe(appState => this.companies = appState);
        this.store.pipe(select(appState => appState.subscriptions.companyTransactions), takeUntil(this.destroyed$))
            .subscribe(appState => this.companyTransactions = appState);

        this.store.pipe(select(appState => appState.session.user), takeUntil(this.destroyed$)).subscribe((user) => {
            if (user) {
                this.user = cloneDeep(user.user);
                this.userSessionId = cloneDeep(user.session?.id);
                this.patchContactFieldsFromUser();
            }
        });

        this.mobileControl.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(() => {
            if (this.isEditingMobile) {
                this.resetMobileOtpState();
            }
            this.changeDetectionRef.detectChanges();
        });

        this.store.pipe(select(profile => profile.settings.profile), takeUntil(this.destroyed$)).subscribe((response: any) => {
            if (response) {
                this.profileData = response;
            }
            this.changeDetectionRef.detectChanges();
        });

        this.store.dispatch(this.sessionAction.getAllSession());

        this.userSessionResponse$.subscribe(appState => {
            if (appState && appState.length) {
                this.userSessionList = appState.map(session => {
                    // Calculate sign in date
                    session.signInDate = dayjs(session.createdAt).format(GIDDH_DATE_FORMAT_DD_MM_YYYY);
                    // Calculate sign in time
                    session.signInTime = dayjs(session.createdAt).format('LTS');
                    // Calculate duration
                    const duration = dayjs.duration(dayjs().diff(session.createdAt));
                    session.sessionDuration = `${duration.days()}/${duration.hours()}/${duration.minutes()}/${duration.seconds()}`;
                    return session;
                });
                this.changeDetectionRef.detectChanges();
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
                this.activeTabIndex = val.tabIndex;
                this.onTabChanged();
            }
        });
    }

    /**
     * Loads email/mobile from session user into editable fields
     *
     * @private
     * @param {boolean} [force=false] When true, overwrites in-progress edits (e.g. after save)
     * @memberof SubscriptionComponent
     */
    private patchContactFieldsFromUser(force: boolean = false): void {
        if (!this.user) {
            return;
        }
        if (!force && (this.isEditingEmail || this.isEditingMobile)) {
            return;
        }
        this.originalEmail = (this.user.email ?? '').trim();
        this.email = this.originalEmail;
        this.originalMobile = this.normalizeMobile(this.user.contactNo ?? this.user.mobileNo ?? '');
        const mobileWithPlus = this.originalMobile ? `+${this.originalMobile}` : '';
        this.mobileControl.setValue(mobileWithPlus, { emitEvent: false });
        this.resetEmailOtpState();
        this.resetMobileOtpState();
        this.isEditingEmail = false;
        this.isEditingMobile = false;
        this.mobileControl.disable({ emitEvent: false });
        this.changeDetectionRef.detectChanges();
    }

    /**
     * Strips non-digits from mobile (API expects e.g. 919876543210)
     *
     * @private
     * @param {string} value
     * @returns {string}
     * @memberof SubscriptionComponent
     */
    private normalizeMobile(value: string): string {
        return (value ?? '').replace(/\D/g, '');
    }

    /**
     * Current mobile digits from control (country code included)
     *
     * @returns {string}
     * @memberof SubscriptionComponent
     */
    public getCurrentMobileDigits(): string {
        return this.normalizeMobile(this.mobileControl.value ?? '');
    }

    /**
     * Whether email value differs from original
     *
     * @returns {boolean}
     * @memberof SubscriptionComponent
     */
    public isEmailChanged(): boolean {
        return this.email.trim().toLowerCase() !== this.originalEmail.toLowerCase();
    }

    /**
     * Whether mobile value differs from original
     *
     * @returns {boolean}
     * @memberof SubscriptionComponent
     */
    public isMobileChanged(): boolean {
        return this.getCurrentMobileDigits() !== this.originalMobile;
    }

    /**
     * Enables email editing
     *
     * @memberof SubscriptionComponent
     */
    public enableEmailEdit(): void {
        this.isEditingEmail = true;
        this.changeDetectionRef.detectChanges();
    }

    /**
     * Enables mobile editing
     *
     * @memberof SubscriptionComponent
     */
    public enableMobileEdit(): void {
        this.isEditingMobile = true;
        this.mobileControl.enable({ emitEvent: false });
        this.changeDetectionRef.detectChanges();
    }

    /**
     * Resets email OTP verification state when value changes
     *
     * @memberof SubscriptionComponent
     */
    public onEmailInputChange(): void {
        this.resetEmailOtpState();
        this.changeDetectionRef.detectChanges();
    }

    /**
     * Initializes MSG91 OTP widget (same pattern as add-company / signup)
     *
     * @private
     * @memberof SubscriptionComponent
     */
    private initOtpWidget(): void {
        if (this.isOtpWidgetReady && typeof window['sendOtp'] === 'function') {
            this.loadOtpResendChannels();
            return;
        }

        const configuration = {
            widgetId: this.serviceConfig.OTP_WIDGET_ID_WEB || this.serviceConfig.OTP_WIDGET_ID,
            tokenAuth: this.serviceConfig.OTP_WIDGET_TOKEN_WEB || this.serviceConfig.OTP_TOKEN_AUTH,
            exposeMethods: true,
            success: () => { },
            failure: (error: { message?: string }) => {
                this.toasty.errorToast(error?.message);
            }
        };

        if (window['initSendOTP'] === undefined) {
            const scriptTag = document.createElement('script');
            scriptTag.src = Configuration.isElectron ? ELECTRON_OTP_PROVIDER_URL : OTP_PROVIDER_URL;
            scriptTag.type = 'text/javascript';
            scriptTag.defer = true;
            scriptTag.onload = () => {
                initSendOTP(configuration);
                this.isOtpWidgetReady = true;
                // Widget channel list is available shortly after init (same delay as website signup)
                setTimeout(() => this.loadOtpResendChannels(), 2000);
            };
            document.body.appendChild(scriptTag);
        } else {
            initSendOTP(configuration);
            this.isOtpWidgetReady = true;
            setTimeout(() => this.loadOtpResendChannels(), 2000);
        }
    }

    /**
     * Loads MSG91 resend channels for mobile (VOICE / SMS / WHATSAPP).
     * Email channel value "3" is excluded — same as website signup.js / msg91Otp.getResendChannels.
     *
     * @private
     * @memberof SubscriptionComponent
     */
    private loadOtpResendChannels(): void {
        if (typeof window['getWidgetData'] !== 'function') {
            return;
        }
        const widgetData = window['getWidgetData']();
        if (!widgetData?.processes?.length) {
            return;
        }
        const seen = new Set<string>();
        const channels: Array<{ name: string; value: string | number }> = [];
        widgetData.processes.forEach((process: { channel?: { name?: string; value?: string | number } }) => {
            const channel = process?.channel;
            if (!channel || channel.value == null || String(channel.value) === '3' || seen.has(String(channel.value))) {
                return;
            }
            seen.add(String(channel.value));
            channels.push({ name: channel.name ?? String(channel.value), value: channel.value });
        });
        this.otpResendChannels = channels;
        this.changeDetectionRef.detectChanges();
    }

    /**
     * Sends OTP to email via MSG91
     *
     * @memberof SubscriptionComponent
     */
    public sendEmailOtp(): void {
        const email = this.email?.trim();
        if (!email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
            this.toasty.errorToast(this.localeData?.mobile_number?.email_validation_error);
            return;
        }
        if (!this.isEmailChanged()) {
            return;
        }
        this.initOtpWidget();
        if (typeof window['sendOtp'] !== 'function') {
            this.toasty.errorToast(this.localeData?.mobile_number?.email_validation_error);
            return;
        }
        this.emailSendOtpInProgress = true;
        this.resetEmailOtpState(false);
        window['sendOtp'](
            email,
            (data: { message?: string }) => {
                this.emailSendOtpInProgress = false;
                this.emailOtpRequestId = data?.message ?? '';
                this.showEmailOtp = true;
                this.toasty.successToast(this.localeData?.mobile_number?.otp_sent);
                this.changeDetectionRef.detectChanges();
            },
            (error: { message?: string } | string) => {
                this.emailSendOtpInProgress = false;
                this.showEmailOtp = false;
                this.toasty.errorToast(typeof error === 'string' ? error : error?.message);
                this.changeDetectionRef.detectChanges();
            }
        );
        this.changeDetectionRef.detectChanges();
    }

    /**
     * Sends OTP to mobile via MSG91
     *
     * @memberof SubscriptionComponent
     */
    public sendMobileOtp(): void {
        const mobile = this.getCurrentMobileDigits();
        if (!mobile || this.mobileControl.invalid) {
            this.toasty.errorToast(this.localeData?.mobile_number?.mobile_number_validation_error);
            return;
        }
        if (!this.isMobileChanged()) {
            return;
        }
        this.initOtpWidget();
        if (typeof window['sendOtp'] !== 'function') {
            this.toasty.errorToast(this.localeData?.mobile_number?.mobile_number_validation_error);
            return;
        }
        this.mobileSendOtpInProgress = true;
        this.resetMobileOtpState(false);
        window['sendOtp'](
            mobile,
            (data: { message?: string }) => {
                this.mobileSendOtpInProgress = false;
                this.mobileOtpRequestId = data?.message ?? '';
                this.showMobileOtp = true;
                this.loadOtpResendChannels();
                this.toasty.successToast(this.localeData?.mobile_number?.otp_sent);
                this.changeDetectionRef.detectChanges();
            },
            (error: { message?: string } | string) => {
                this.mobileSendOtpInProgress = false;
                this.showMobileOtp = false;
                this.toasty.errorToast(typeof error === 'string' ? error : error?.message);
                this.changeDetectionRef.detectChanges();
            }
        );
        this.changeDetectionRef.detectChanges();
    }

    /**
     * Resends email OTP (MSG91 channel 3 = email)
     *
     * @memberof SubscriptionComponent
     */
    public resendEmailOtp(): void {
        if (!this.emailOtpRequestId || typeof window['retryOtp'] !== 'function') {
            return;
        }
        this.emailResendOtpInProgress = true;
        this.emailOtp = '';
        this.isEmailVerified = false;
        this.emailAccessToken = '';
        window['retryOtp'](
            3,
            () => {
                this.emailResendOtpInProgress = false;
                this.toasty.successToast(this.localeData?.mobile_number?.otp_resent);
                this.changeDetectionRef.detectChanges();
            },
            (error: { message?: string } | string) => {
                this.emailResendOtpInProgress = false;
                this.toasty.errorToast(typeof error === 'string' ? error : error?.message);
                this.changeDetectionRef.detectChanges();
            },
            this.emailOtpRequestId
        );
        this.changeDetectionRef.detectChanges();
    }

    /**
     * Resends mobile OTP on selected MSG91 channel (VOICE / SMS / WHATSAPP)
     *
     * @param {string | number} channel Channel value from widget processes
     * @memberof SubscriptionComponent
     */
    public resendMobileOtp(channel: string | number): void {
        if (!this.mobileOtpRequestId || typeof window['retryOtp'] !== 'function' || this.mobileResendOtpInProgress) {
            return;
        }
        this.mobileResendOtpInProgress = true;
        this.mobileOtp = '';
        this.isMobileVerified = false;
        this.mobileAccessToken = '';
        window['retryOtp'](
            channel,
            () => {
                this.mobileResendOtpInProgress = false;
                this.toasty.successToast(this.localeData?.mobile_number?.otp_resent);
                this.changeDetectionRef.detectChanges();
            },
            (error: { message?: string } | string) => {
                this.mobileResendOtpInProgress = false;
                this.toasty.errorToast(typeof error === 'string' ? error : error?.message);
                this.changeDetectionRef.detectChanges();
            },
            this.mobileOtpRequestId
        );
        this.changeDetectionRef.detectChanges();
    }

    /**
     * Verifies email OTP via MSG91 and stores access token
     *
     * @memberof SubscriptionComponent
     */
    public verifyEmailOtp(): void {
        if (!this.emailOtp?.trim()) {
            this.toasty.errorToast(this.localeData?.mobile_number?.enter_valid_otp);
            return;
        }
        if (!this.emailOtpRequestId || typeof window['verifyOtp'] !== 'function') {
            return;
        }
        this.emailVerifyOtpInProgress = true;
        window['verifyOtp'](
            this.emailOtp.trim(),
            (data: { message?: string }) => {
                this.emailVerifyOtpInProgress = false;
                this.isEmailVerified = true;
                this.emailAccessToken = data?.message ?? '';
                this.showEmailOtp = false;
                this.toasty.successToast(this.localeData?.mobile_number?.otp_verified);
                this.changeDetectionRef.detectChanges();
            },
            (error: { message?: string } | string) => {
                this.emailVerifyOtpInProgress = false;
                this.isEmailVerified = false;
                this.emailAccessToken = '';
                this.toasty.errorToast(typeof error === 'string' ? error : error?.message);
                this.changeDetectionRef.detectChanges();
            },
            this.emailOtpRequestId
        );
        this.changeDetectionRef.detectChanges();
    }

    /**
     * Verifies mobile OTP via MSG91 and stores access token
     *
     * @memberof SubscriptionComponent
     */
    public verifyMobileOtp(): void {
        if (!this.mobileOtp?.trim()) {
            this.toasty.errorToast(this.localeData?.mobile_number?.enter_valid_otp);
            return;
        }
        if (!this.mobileOtpRequestId || typeof window['verifyOtp'] !== 'function') {
            return;
        }
        this.mobileVerifyOtpInProgress = true;
        window['verifyOtp'](
            this.mobileOtp.trim(),
            (data: { message?: string }) => {
                this.mobileVerifyOtpInProgress = false;
                this.isMobileVerified = true;
                this.mobileAccessToken = data?.message ?? '';
                this.showMobileOtp = false;
                this.toasty.successToast(this.localeData?.mobile_number?.otp_verified);
                this.changeDetectionRef.detectChanges();
            },
            (error: { message?: string } | string) => {
                this.mobileVerifyOtpInProgress = false;
                this.isMobileVerified = false;
                this.mobileAccessToken = '';
                this.toasty.errorToast(typeof error === 'string' ? error : error?.message);
                this.changeDetectionRef.detectChanges();
            },
            this.mobileOtpRequestId
        );
        this.changeDetectionRef.detectChanges();
    }

    /**
     * Saves only changed + OTP-verified contact fields via POST /users/{uniqueName}/contact
     *
     * @memberof SubscriptionComponent
     */
    public saveContactChanges(): void {
        const emailChanged = this.isEmailChanged();
        const mobileChanged = this.isMobileChanged();

        if (!emailChanged && !mobileChanged) {
            this.toasty.errorToast(this.localeData?.mobile_number?.no_changes_to_save);
            return;
        }

        if ((emailChanged && !this.isEmailVerified) || (mobileChanged && !this.isMobileVerified)) {
            this.toasty.errorToast(this.localeData?.mobile_number?.verify_before_save);
            return;
        }

        const payload: UpdateUserContactRequest = {};
        if (emailChanged && this.isEmailVerified && this.emailAccessToken) {
            payload.email = this.email.trim();
            payload.emailAccessToken = this.emailAccessToken;
        }
        if (mobileChanged && this.isMobileVerified && this.mobileAccessToken) {
            payload.mobile = this.getCurrentMobileDigits();
            payload.mobileAccessToken = this.mobileAccessToken;
        }

        if (!payload.email && !payload.mobile) {
            this.toasty.errorToast(this.localeData?.mobile_number?.no_changes_to_save);
            return;
        }

        this.isSavingContact = true;
        this.loginService.updateUserContact(payload).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.isSavingContact = false;
            if (response?.status === 'success') {
                const body = response.body;
                if (body?.authKey) {
                    this.userAuthKey = body.authKey;
                    this.toasty.successToast(this.localeData?.mobile_number?.new_auth_key_message);
                } else {
                    this.toasty.successToast(this.localeData?.mobile_number?.contact_update_success);
                }
                if (this.user && body) {
                    this.user.email = body.email;
                    this.user.contactNo = body.contactNo;
                    if (body.uniqueName) {
                        this.user.uniqueName = body.uniqueName;
                    }
                    this.generalService.user = {
                        ...this.generalService.user,
                        email: body.email,
                        contactNo: body.contactNo,
                        uniqueName: body.uniqueName || this.generalService.user?.uniqueName
                    };
                }
                if (body) {
                    this.originalEmail = (body.email ?? '').trim();
                    this.email = this.originalEmail;
                    this.originalMobile = this.normalizeMobile(body.contactNo ?? '');
                    const mobileWithPlus = this.originalMobile ? `+${this.originalMobile}` : '';
                    this.mobileControl.setValue(mobileWithPlus, { emitEvent: false });
                    this.resetEmailOtpState();
                    this.resetMobileOtpState();
                    this.isEditingEmail = false;
                    this.isEditingMobile = false;
                    this.mobileControl.disable({ emitEvent: false });
                }
                this.store.dispatch(this.loginAction.FetchUserDetails());
            } else {
                this.toasty.errorToast(response?.message);
            }
            this.changeDetectionRef.detectChanges();
        });
    }

    /**
     * @private
     * @param {boolean} [clearRequestId=true]
     * @memberof SubscriptionComponent
     */
    private resetEmailOtpState(clearRequestId: boolean = true): void {
        this.emailOtp = '';
        this.emailAccessToken = '';
        this.isEmailVerified = false;
        this.showEmailOtp = false;
        if (clearRequestId) {
            this.emailOtpRequestId = '';
        }
    }

    /**
     * @private
     * @param {boolean} [clearRequestId=true]
     * @memberof SubscriptionComponent
     */
    private resetMobileOtpState(clearRequestId: boolean = true): void {
        this.mobileOtp = '';
        this.mobileAccessToken = '';
        this.isMobileVerified = false;
        this.showMobileOtp = false;
        if (clearRequestId) {
            this.mobileOtpRequestId = '';
        }
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



    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body').classList.remove('setting-sidebar-open');
        document.querySelector('body').classList.remove('tabs-page');
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
        dialogRef.afterClosed().subscribe(response => {
            if (response === this.commonLocaleData?.app_yes) {
                this.store.dispatch(this.sessionAction.deleteSession(requestPayload));
                this.store.dispatch(this.sessionAction.getAllSession());
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
        dialogRef.afterClosed().subscribe(response => {
            if (response === this.commonLocaleData?.app_yes) {
                this.store.dispatch(this.sessionAction.deleteAllSession());
                this.router.navigate(['/login']);
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
     * Select tab handler
     *
     * @param {MatTabChangeEvent} event
     * @memberof SubscriptionComponent
     */
    public selectTab(event: MatTabChangeEvent): void {
        this.activeTabIndex = event?.index;
        if (this.activeTabIndex === 1) {
            this.initOtpWidget();
        }
        this.onTabChanged();
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
