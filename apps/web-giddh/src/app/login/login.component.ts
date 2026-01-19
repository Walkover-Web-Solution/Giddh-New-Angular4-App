/**
 * @fileoverview Login component for handling user interface and interactions
 * @author Giddh Development Team
 * @since 2026
 */

import { take, takeUntil } from "rxjs/operators";
import { LoginActions } from "../actions/login.action";
import { AppState } from "../store";
import { Component, Inject, NgZone, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { TemplateRef } from "@angular/core";
import { Configuration, ELECTRON_OTP_PROVIDER_URL, IOption, KeyCodesEnum, OTP_PROVIDER_URL } from "../app.constant";
import { Store, select } from "@ngrx/store";
import { Observable, ReplaySubject } from "rxjs";
import {
    SignupwithEmaillModel,
    SignupWithMobile,
    VerifyEmailModel,
    VerifyEmailResponseModel,
    VerifyMobileModel
} from "../models/api-models/loginModels";
import {
    AuthService,
    GoogleLoginProvider,
    SocialUser
} from "../theme/ng-social-login-module/index";
import { DOCUMENT } from "@angular/common";
import { userLoginStateEnum } from "../models/user-login-state";
import { contriesWithCodes } from "../shared/helpers/countryWithCodes";
import { environment } from '../../environments/environment.generated';
import { LoaderService } from "../loader/loader.service";
import { ToasterService } from "../services/toaster.service";
import { AuthenticationService } from "../services/authentication.service";
import { CommonActions } from "../actions/common.actions";
import { GeneralService } from "../services/general.service";
import { ServiceConfig } from "../services/service.config";
import { cloneDeep, filter, get, indexOf, map, set } from '../lodash-optimized';

declare var initSendOTP: any;

/**
 * Handles Component functionality
 */
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: false
})
/**
 * LoginComponent class - Handles logincomponent functionality
 * @export
 * @class LoginComponent
 */

export class LoginComponent implements OnInit, OnDestroy {
    public isLoginWithMobileSubmited$: Observable<boolean>;
    @ViewChild("emailVerifyTemplate", { static: true }) public emailVerifyTemplate: TemplateRef<any>;
    /** Dialog reference for email verification modal */
    private emailVerifyDialogRef: MatDialogRef<any>;
    public isLoginWithEmailSubmited$: Observable<boolean>;
    @ViewChild("mobileVerifyTemplate", { static: true }) public mobileVerifyTemplate: TemplateRef<any>;
    /** Dialog reference for mobile verification modal */
    private mobileVerifyDialogRef: MatDialogRef<any>;
    @ViewChild("twoWayAuthTemplate", { static: false }) public twoWayAuthTemplate: TemplateRef<any>;
    /** Dialog reference for two way auth modal */
    private twoWayAuthDialogRef: MatDialogRef<any>;

    public isSubmited: boolean = false;
    public mobileVerifyForm: UntypedFormGroup;
    public emailVerifyForm: UntypedFormGroup;
    public twoWayOthForm: UntypedFormGroup;
    public isVerifyMobileInProcess$: Observable<boolean>;
    public isLoginWithMobileInProcess$: Observable<boolean>;
    public isVerifyEmailInProcess$: Observable<boolean>;
    public isLoginWithEmailInProcess$: Observable<boolean>;
    public isSocialLogoutAttempted$: Observable<boolean>;
    public userLoginState$: Observable<userLoginStateEnum>;
    public userDetails$: Observable<VerifyEmailResponseModel>;
    public isTwoWayAuthInProcess$: Observable<boolean>;
    public isTwoWayAuthInSuccess$: Observable<boolean>;
    public countryCodeList: IOption[] = [];
    public selectedCountry: string;
    public selectedBanner: string = null;
    public loginUsing: string = null;
    public urlPath: string = "";
    public loginWithPasswdForm: UntypedFormGroup;
    public isLoginWithPasswordInProcess$: Observable<boolean>;
    public forgotPasswordForm: UntypedFormGroup;
    public verifyOtpForm: UntypedFormGroup;
    public resetPasswordForm: UntypedFormGroup;
    public isForgotPasswordInProgress$: Observable<boolean>;
    public isForgotPasswordInSuccess$: Observable<boolean>;
    public isResetPasswordInSuccess$: Observable<boolean>;
    public signupVerifyForm: UntypedFormGroup;
    public isLoginWithPasswordSuccessNotVerified$: Observable<boolean>;
    public isLoginWithPasswordIsShowVerifyOtp$: Observable<boolean>;

    public showForgotPassword: boolean = false;
    public forgotStep: number = 0;
    public retryCount: number = 0;
    private userUniqueKey: string;
    /** To Observe is google login inprocess */
    public isLoginWithGoogleInProcess$: Observable<boolean>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Show apple login if electron app and mac user */
    public showAppleLogin: boolean = false;
    /* Hold logo source */
    public giddhLogoSrc: string = '';
    /* Hold domain url */
    public giddhDomainUrl: string = "";
    /* Hold image path */
    public imgPath: string = '';

    // tslint:disable-next-line:no-empty
    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(private _fb: UntypedFormBuilder,
        private store: Store<AppState>,
        private loginAction: LoginActions,
        private authService: AuthService,
        @Inject(DOCUMENT) private document: Document,
        private loaderService: LoaderService,
        private toaster: ToasterService,
        private authenticationService: AuthenticationService,
        private ngZone: NgZone,
        private commonAction: CommonActions,
        private generalService: GeneralService,
        @Inject(ServiceConfig) private serviceConfig,
        private dialog: MatDialog
    ) {
        // Use relative paths for assets to avoid port/domain issues in Electron
        this.imgPath = Configuration.isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || environment.AppUrl) + environment.APP_FOLDER + 'assets/images/';
        this.urlPath = Configuration.isElectron ? "" : "";
        this.giddhDomainUrl = this.serviceConfig.AppUrl || environment.AppUrl || 'https://giddh.com';
        const whiteLabel = this.generalService.getDecodedWhiteLabel();
        this.giddhLogoSrc = whiteLabel?.giddhWhiteLabel?.logo || this.imgPath + 'giddh-white-logo.svg';
        this.isLoginWithEmailInProcess$ = this.store.pipe(select(state => {
            return state.login.isLoginWithEmailInProcess;
        }), takeUntil(this.destroyed$));
        this.isVerifyEmailInProcess$ = this.store.pipe(select(state => {
            return state.login.isVerifyEmailInProcess;
        }), takeUntil(this.destroyed$));
        this.isLoginWithMobileInProcess$ = this.store.pipe(select(state => {
            return state.login.isLoginWithMobileInProcess;
        }), takeUntil(this.destroyed$));
        this.isVerifyMobileInProcess$ = this.store.pipe(select(state => {
            return state.login.isVerifyMobileInProcess;
        }), takeUntil(this.destroyed$));

        this.isLoginWithMobileSubmited$ = this.store.pipe(select(state => {
            return state.login.isLoginWithMobileSubmited;
        }), takeUntil(this.destroyed$));
        this.isLoginWithEmailSubmited$ = this.store.pipe(select(state => {
            return state.login.isLoginWithEmailSubmited;
        }), takeUntil(this.destroyed$));

        this.isLoginWithPasswordInProcess$ = this.store.pipe(select(state => {
            return state.login.isLoginWithPasswordInProcess;
        }), takeUntil(this.destroyed$));
        this.isForgotPasswordInProgress$ = this.store.pipe(select(state => {
            return state.login.isForgotPasswordInProcess;
        }), takeUntil(this.destroyed$));
        this.isResetPasswordInSuccess$ = this.store.pipe(select(state => {
            return state.login.isResetPasswordInSuccess;
        }), takeUntil(this.destroyed$));
        this.isLoginWithPasswordSuccessNotVerified$ = this.store.pipe(select(state => {
            return state.login.isLoginWithPasswordSuccessNotVerified;
        }), takeUntil(this.destroyed$));
        this.isLoginWithPasswordIsShowVerifyOtp$ = this.store.pipe(select(state => {
            return state.login.isLoginWithPasswordIsShowVerifyOtp;
        }), takeUntil(this.destroyed$));
        this.isSocialLogoutAttempted$ = this.store.pipe(select(p => p.login.isSocialLogoutAttempted), takeUntil(this.destroyed$));
        this.isLoginWithGoogleInProcess$ = this.store.pipe(select(state => {
            return state.login.isLoginWithGoogleInProcess;
        }), takeUntil(this.destroyed$));
        contriesWithCodes.map(c => {
            this.countryCodeList.push({ value: c?.countryName, label: c?.value });
        });
        this.userLoginState$ = this.store.pipe(select(p => p?.session?.userLoginState), takeUntil(this.destroyed$));
        this.userDetails$ = this.store.pipe(select(p => p?.session?.user), takeUntil(this.destroyed$));
        this.isTwoWayAuthInProcess$ = this.store.pipe(select(p => p.login.isTwoWayAuthInProcess), takeUntil(this.destroyed$));
        this.isTwoWayAuthInSuccess$ = this.store.pipe(select(p => p.login.isTwoWayAuthSuccess), takeUntil(this.destroyed$));
    }

    // tslint:disable-next-line:no-empty
    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {
        this.store.dispatch(this.commonAction.setActiveTheme(null));
        this.generateRandomBanner();
        this.mobileVerifyForm = this._fb.group({
            country: ["India", [Validators.required]],
            mobileNumber: ["", [Validators.required]],
            otp: ["", [Validators.required]]
        });

        this.emailVerifyForm = this._fb.group({
            email: ["", [Validators.required, Validators.email]],
            token: ["", Validators.required]
        });
        this.twoWayOthForm = this._fb.group({
            otp: ["", [Validators.required]]
        });
        this.loginWithPasswdForm = this._fb.group({
            uniqueKey: ["", Validators.required],
            password: ["", [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,20}$")]]
        });

        this.forgotPasswordForm = this._fb.group({
            userId: ["", [Validators.required]]
        });
        this.verifyOtpForm = this._fb.group({
            oneTimePassword: ["", [Validators.required]]
        });
        this.resetPasswordForm = this._fb.group({
            verificationCode: ["", [Validators.required]],
            uniqueKey: ["", [Validators.required]],
            newPassword: ["", [Validators.required]]
        });
        this.signupVerifyForm = this._fb.group({
            email: ["", [Validators.required, Validators.email]],
            verificationCode: ["", Validators.required]
        });
        this.setCountryCode({ value: "India", label: "India" });

        // get user object when google auth is complete
        /**
         * Handles if functionality
         */
        if (!Configuration.isElectron) {
            // Only enable for web since Electron uses native OAuth
            this.authService.authState.pipe(takeUntil(this.destroyed$)).subscribe((user: SocialUser) => {
                this.isSocialLogoutAttempted$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                    /**
                     * Handles if functionality
                     */
                    if (!res && user) {
                        /**
                         * Handles switch functionality
                         */
                        switch (user.provider) {
                            case "GOOGLE": {
                                this.store.dispatch(this.loginAction.signupWithGoogle(user.token));
                                break;
                            }
                            default: {
                                // do something
                                break;
                            }
                        }
                    }
                });
            });
            this.showAppleLogin = false;
        } else {
            /**
             * Handles if functionality
             */
            if (navigator.userAgent.indexOf("Mac") > -1) {
                this.showAppleLogin = true;
            } else {
                this.showAppleLogin = false;
            }
        }

        //  get login state and check if twoWayAuth is needed
        this.userLoginState$.subscribe(status => {
            /**
             * Handles if functionality
             */
            if (status === userLoginStateEnum.needTwoWayAuth) {
                this.showTwoWayAuthModal();
            }
        });
        // check if two way auth is successfully done
        this.isTwoWayAuthInSuccess$.subscribe(a => {
            /**
             * Handles if functionality
             */
            if (a) {
                this.hideTowWayAuthModal();
                this.store.dispatch(this.loginAction.resetTwoWayAuthModal());
            }
        });

        this.isResetPasswordInSuccess$.subscribe(s => {
            /**
             * Handles if functionality
             */
            if (s) {
                this.resetForgotPasswordProcess();
                this.loginUsing = "userName";
            }
        });
        this.isForgotPasswordInProgress$.subscribe(a => {
            /**
             * Handles if functionality
             */
            if (!a) {
                this.forgotStep = 1;
            } else {
                this.forgotStep = 2;
            }
        });

        this.isLoginWithPasswordIsShowVerifyOtp$.subscribe(res => {
            /**
             * Handles if functionality
             */
            if (res) {
                this.showTwoWayAuthModal();
                this.store.dispatch(this.loginAction.hideTwoWayOtpPopup());
            }
        });

        window.addEventListener('message', event => {
            // Validate origin to prevent XSS attacks
            const allowedOrigins = [
                'https://appleid.apple.com',
                'https://accounts.google.com',
                window.location.origin
            ];

            /**
             * Handles if functionality
             */
            if (!allowedOrigins.includes(event.origin)) {
                console.warn('Blocked message from untrusted origin:', event.origin);
                return;
            }

            /**
             * Handles if functionality
             */
            if (event?.data && typeof event?.data === "string") {
                const data: any = event?.data?.split("&").reduce(function (prev, curr, i, arr) {
                    var params = curr.split("=");
                    prev[decodeURIComponent(params[0])] = decodeURIComponent(params[1]);
                    return prev;
                }, {});
                /**
                 * Handles if functionality
                 */
                if (data && data.id_token) {
                    this.loginWithApple(data.code);
                }
            }
        });

        /**
         * Handles if functionality
         */
        if (environment.PRODUCTION_ENV && !Configuration.isElectron) {
            window.location.href = this.generalService.getGiddhRegionUrl();
        }
    }

    /**
     * Handles hiddenauthmodal event
     */
    public onHiddenAuthModal(event: any): void {
        /**
         * Handles if functionality
         */
        if (event && event.dismissReason === "esc") {
            return this.resetTwoWayAuthModal();
        }
    }

    /**
     * Handles LoginWithEmail functionality
     */
    public LoginWithEmail(email: string) {
        let data = new SignupwithEmaillModel();
        this.retryCount++;
        data.email = email;
        data.retryCount = this.retryCount;
        this.store.dispatch(this.loginAction.SignupWithEmailRequest(data));
    }

    /**
     * Handles VerifyEmail functionality
     */
    public VerifyEmail(email: string, code: string) {
        let data = new VerifyEmailModel();
        data.email = email;
        data.verificationCode = code;
        this.store.dispatch(this.loginAction.VerifyEmailRequest(data));
    }

    /**
     * Handles VerifyCode functionality
     */
    public VerifyCode(mobile: string, code: string) {
        let data = new VerifyMobileModel();
        data.countryCode = Number(this.selectedCountry);
        data.mobileNumber = mobile;
        data.oneTimePassword = code;
        this.store.dispatch(this.loginAction.VerifyMobileRequest(data));
    }

    /**
     * Handles verifyTwoWayCode functionality
     */
    public verifyTwoWayCode() {
        let user: VerifyEmailResponseModel;
        this.userDetails$.pipe(take(1)).subscribe(p => user = p);
        let data = new VerifyMobileModel();
        data.countryCode = Number(user?.countryCode);
        data.mobileNumber = user?.contactNumber;
        data.oneTimePassword = this.twoWayOthForm?.value?.otp;
        this.store.dispatch(this.loginAction.VerifyTwoWayAuthRequest(data));
    }

    /**
     * Hides the email verification dialog
     *
     * @memberof LoginComponent
     */
    public hideEmailModal() {
        this.emailVerifyDialogRef?.close();
        this.store.dispatch(this.loginAction.ResetSignupWithEmailState());
        this.emailVerifyForm.reset();
    }

    /**
     * Shows the mobile verification dialog
     *
     * @memberof LoginComponent
     */
    public showMobileModal() {
        this.mobileVerifyDialogRef = this.dialog.open(this.mobileVerifyTemplate, {
            panelClass: 'mat-dialog-md',
            disableClose: true
        });
    }

    /**
     * Hides the mobile verification dialog
     *
     * @memberof LoginComponent
     */
    public hideMobileModal() {
        this.mobileVerifyDialogRef?.close();
        this.store.dispatch(this.loginAction.ResetSignupWithMobileState());
        this.mobileVerifyForm.get("mobileNumber").reset();
    }

    /**
     * Shows the two way authentication dialog
     *
     * @memberof LoginComponent
     */
    public showTwoWayAuthModal() {
        this.twoWayAuthDialogRef = this.dialog.open(this.twoWayAuthTemplate, {
            panelClass: 'mat-dialog-md',
            disableClose: true
        });

        // Handle dialog close event to replace onHidden functionality
        this.twoWayAuthDialogRef.afterClosed().subscribe(() => {
            this.onHiddenAuthModal({ dismissReason: KeyCodesEnum.ESC });
        });
    }

    /**
     * Hides the two way authentication dialog
     *
     * @memberof LoginComponent
     */
    public hideTowWayAuthModal() {
        this.twoWayAuthDialogRef?.close();
    }

    /**
     * Resets twowayauthmodal to default state
     */
    public resetTwoWayAuthModal() {
        this.store.dispatch(this.loginAction.SetLoginStatus(userLoginStateEnum.notLoggedIn));
        this.hideTowWayAuthModal();
    }

    // tslint:disable-next-line:no-empty
    /**
     * Retrieves otp data
     */
    public getOtp(mobileNumber: string, code: string) {
        let data: SignupWithMobile = new SignupWithMobile();
        data.mobileNumber = mobileNumber;
        data.countryCode = Number(this.selectedCountry);
        this.store.dispatch(this.loginAction.SignupWithMobileRequest(data));
    }

    /**
     * Handles signInWithProviders functionality
     */
    public async signInWithProviders(provider: string) {
        /**
         * Handles if functionality
         */
        if (Configuration.isElectron) {
            // Use native Electron OAuth exclusively for Electron
            try {
                const { ipcRenderer } = (window as any).require("electron");

                /**
                 * Handles if functionality
                 */
                if (provider === "google") {
                    // Send authentication request to main process
                    ipcRenderer.send("authenticate", provider);

                    // Listen for response from main process
                    ipcRenderer.once('take-your-gmail-token', (sender, arg) => {
                        // Handle error response from main process
                        /**
                         * Handles if functionality
                         */
                        if (arg && arg.error) {
                            this.toaster.errorToast('Google authentication failed: ' + arg.error);
                            return;
                        }

                        // Handle successful response
                        /**
                         * Handles if functionality
                         */
                        if (arg && arg.access_token) {
                            this.store.dispatch(this.loginAction.signupWithGoogle(arg.access_token));
                        } else {
                            this.toaster.errorToast('Google authentication failed - invalid token format');
                        }
                    });
                }
            } catch (error) {
                console.error('Electron Google login error:', error);
                this.toaster.errorToast('Google login is not available in this Electron version');
            }
        } else {
            // Web social authentication
            this.store.dispatch(this.loginAction.resetSocialLogoutAttempt());
            /**
             * Handles if functionality
             */
            if (provider === "google") {
                // Only call authService.signIn for web (non-Electron) environments
                /**
                 * Handles if functionality
                 */
                if (!Configuration.isElectron) {
                    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);

                    /**
                     * Sets timeout value
                     */
                    setTimeout(() => {
                        this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
                    }, 500);
                }
            }
        }
    }

    /**
     * Handles ngOnDestroy functionality
     */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * setCountryCode
     */
    public setCountryCode(event: IOption) {
        /**
         * Handles if functionality
         */
        if (event?.value) {
            let country = this.countryCodeList?.filter((obj) => obj?.value === event?.value);
            this.selectedCountry = country[0].label;
        }
    }

    /**
     * randomBanner
     */
    public generateRandomBanner() {
        let bannerArr = ["1", "2", "3", "4", "5"];
        let selectedSlide = bannerArr[Math.floor(Math.random() * bannerArr.length)];
        this.selectedBanner = "slide" + selectedSlide;
    }

    /**
     * Handles loginWithPasswd functionality
     */
    public loginWithPasswd(model: UntypedFormGroup) {
        let ObjToSend = model?.value;
        /**
         * Handles if functionality
         */
        if (ObjToSend) {
            this.store.dispatch(this.loginAction.LoginWithPasswdRequest(ObjToSend));
        }
    }

    /**
     * Shows forgotpasswordmodal element
     */
    public showForgotPasswordModal() {
        this.showForgotPassword = true;
        this.loginUsing = "forgot";
        this.forgotStep = 1;
    }

    /**
     * Handles forgotPassword functionality
     */
    public forgotPassword(userId) {
        this.resetPasswordForm?.patchValue({ uniqueKey: userId });
        this.userUniqueKey = userId;
        this.store.dispatch(this.loginAction.forgotPasswordRequest(userId));
    }

    /**
     * Resets password to default state
     */
    public resetPassword(form) {
        let ObjToSend = form?.value;
        ObjToSend.uniqueKey = cloneDeep(this.userUniqueKey);
        this.store.dispatch(this.loginAction.resetPasswordRequest(ObjToSend));
    }

    /**
     * Resets forgotpasswordprocess to default state
     */
    public resetForgotPasswordProcess() {
        this.forgotPasswordForm.reset();
        this.resetPasswordForm.reset();
        this.forgotStep = 1;
        this.userUniqueKey = null;
    }

    /**
     * This will open the login with otp popup
     *
     * @memberof LoginComponent
     */
    public signInWithOtp(): void {
        this.loaderService.show();
        let configuration = {
            widgetId: this.serviceConfig?.OTP_WIDGET_ID || environment.OTP_WIDGET_ID,
            tokenAuth: this.serviceConfig?.OTP_TOKEN_AUTH || environment.OTP_TOKEN_AUTH,
            /**
             * Handles success functionality
             */
            success: (data: any) => {
                this.ngZone.run(() => {

                    this.initiateLogin(data);
                });
            },
            /**
             * Handles failure functionality
             */
            failure: (error: any) => {
                this.toaster.errorToast(error?.message);
            }
        };

        /* OTP LOGIN */
        /**
         * Handles if functionality
         */
        if (window['initSendOTP'] === undefined) {
            let scriptTag = document.createElement('script');
            scriptTag.src = Configuration.isElectron ? ELECTRON_OTP_PROVIDER_URL : OTP_PROVIDER_URL;
            scriptTag.type = 'text/javascript';
            scriptTag.defer = true;
            scriptTag.onload = () => {
                try {
                    /**
                     * Handles if functionality
                     */
                    if (typeof window['initSendOTP'] === 'function') {
                        window['initSendOTP'](configuration);
                    } else {

                        this.toaster.errorToast('Unable to load OTP service. Please try again.');
                    }
                } catch (error) {

                    this.toaster.errorToast('An error occurred while loading OTP service.');
                }
                this.loaderService.hide();
            };
            scriptTag.onerror = () => {

                this.toaster.errorToast('Failed to load OTP service. Please check your connection.');
                this.loaderService.hide();
            };
            document.body.appendChild(scriptTag);
        } else {
            try {
                window['initSendOTP'](configuration);
            } catch (error) {

                this.toaster.errorToast('An error occurred while loading OTP service.');
            }
            this.loaderService.hide();
        }
    }

    /**
     * Initiate the login process using otp
     *
     * @private
     * @param {*} data
     * @memberof LoginComponent
     */
    private initiateLogin(data: any): void {
        this.authenticationService.loginWithOtp({ accessToken: data?.message }).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            /**
             * Handles if functionality
             */
            if (response?.status === "success") {
                this.store.dispatch(this.loginAction.LoginWithPasswdResponse(response));
            } else {
                this.toaster.errorToast(response?.message);
            }
        });
    }

    /**
     * Shows apple login
     *
     * @returns {Promise<void>}
     * @memberof LoginComponent
     */
    public async appleLogin(): Promise<void> {
        const whiteLabel = this.generalService.getDecodedWhiteLabel();
        const CLIENT_ID = "com.giddh.appsignin.client"
        const url = environment.production || Configuration.isElectron ? 'https://api.giddh.com' : whiteLabel?.giddhWhiteLabel?.apiDomain ? `${whiteLabel.giddhWhiteLabel.apiDomain}` : 'https://apitest.giddh.com';
        const REDIRECT_API_URL = url + "/v2/apple-login-callback";

        window.open(`https://appleid.apple.com/auth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_API_URL)}&response_type=code id_token&scope=name email&response_mode=form_post`, '_blank');
    }

    /**
     * This will login with apple
     *
     * @param {*} data
     * @param {*} parsedData
     * @memberof LoginComponent
     */
    public loginWithApple(authorizationCode: string): void {
        let model = {
            authorizationCode: authorizationCode,
            requestFromWeb: true
        };

        this.authenticationService.loginWithApple(model).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            /**
             * Handles if functionality
             */
            if (response?.status === "success") {
                /**
                 * Handles if functionality
                 */
                if (response.body?.user?.isVerified) {
                    this.store.dispatch(this.loginAction.LoginWithPasswdResponse(response));
                } else {
                    this.toaster.errorToast("Your account is not verified. Please contact support.");
                }
            } else {
                this.toaster.errorToast(response?.message);
            }
        });
    }
}
