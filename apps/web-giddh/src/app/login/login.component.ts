import { take, takeUntil } from "rxjs/operators";
import { LoginActions } from "../actions/login.action";
import { AppState } from "../store";
import { Component, Inject, NgZone, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalDirective } from "ngx-bootstrap/modal";
import { Configuration, OTP_PROVIDER_URL, OTP_TOKEN_AUTH, OTP_WIDGET_ID } from "../app.constant";
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
import { IOption } from "../theme/ng-virtual-select/sh-options.interface";
import { DOCUMENT } from "@angular/common";
import { userLoginStateEnum } from "../models/user-login-state";
import { contriesWithCodes } from "../shared/helpers/countryWithCodes";
import { LoaderService } from "../loader/loader.service";
import { ToasterService } from "../services/toaster.service";
import { AuthenticationService } from "../services/authentication.service";

declare var initSendOTP: any;

@Component({
    selector: "login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit, OnDestroy {
    public isLoginWithMobileSubmited$: Observable<boolean>;
    @ViewChild("emailVerifyModal", { static: true }) public emailVerifyModal: ModalDirective;
    public isLoginWithEmailSubmited$: Observable<boolean>;
    @ViewChild("mobileVerifyModal", { static: true }) public mobileVerifyModal: ModalDirective;
    @ViewChild("twoWayAuthModal", { static: false }) public twoWayAuthModal: ModalDirective;

    public isSubmited: boolean = false;
    public mobileVerifyForm: FormGroup;
    public emailVerifyForm: FormGroup;
    public twoWayOthForm: FormGroup;
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
    public loginWithPasswdForm: FormGroup;
    public isLoginWithPasswordInProcess$: Observable<boolean>;
    public forgotPasswordForm: FormGroup;
    public verifyOtpForm: FormGroup;
    public resetPasswordForm: FormGroup;
    public isForgotPasswordInProgress$: Observable<boolean>;
    public isForgotPasswordInSuccess$: Observable<boolean>;
    public isResetPasswordInSuccess$: Observable<boolean>;
    public signupVerifyForm: FormGroup;
    public isLoginWithPasswordSuccessNotVerified$: Observable<boolean>;
    public isLoginWithPasswordIsShowVerifyOtp$: Observable<boolean>;

    public showForgotPassword: boolean = false;
    public forgotStep: number = 0;
    public retryCount: number = 0;
    private userUniqueKey: string;
    /** To Observe is google login inprocess */
    public isLoginWithGoogleInProcess$: Observable<boolean>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    // tslint:disable-next-line:no-empty
    constructor(private _fb: FormBuilder,
        private store: Store<AppState>,
        private loginAction: LoginActions,
        private authService: AuthService,
        @Inject(DOCUMENT) private document: Document,
        private loaderService: LoaderService,
        private toaster: ToasterService,
        private authenticationService: AuthenticationService,
        private ngZone: NgZone
    ) {
        this.urlPath = isElectron ? "" : AppUrl + APP_FOLDER;
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
    public ngOnInit() {
        this.document.body.classList.remove("unresponsive");
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
        if (!Configuration.isElectron) {
            this.authService.authState.pipe(takeUntil(this.destroyed$)).subscribe((user: SocialUser) => {
                this.isSocialLogoutAttempted$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                    if (!res && user) {
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
        }

        //  get login state and check if twoWayAuth is needed
        this.userLoginState$.subscribe(status => {
            if (status === userLoginStateEnum.needTwoWayAuth) {
                this.showTwoWayAuthModal();
            }
        });
        // check if two way auth is successfully done
        this.isTwoWayAuthInSuccess$.subscribe(a => {
            if (a) {
                this.hideTowWayAuthModal();
                this.store.dispatch(this.loginAction.resetTwoWayAuthModal());
            }
        });

        this.isResetPasswordInSuccess$.subscribe(s => {
            if (s) {
                this.resetForgotPasswordProcess();
                this.loginUsing = "userName";
            }
        });
        this.isForgotPasswordInProgress$.subscribe(a => {
            if (!a) {
                this.forgotStep = 1;
            } else {
                this.forgotStep = 2;
            }
        });

        this.isLoginWithPasswordIsShowVerifyOtp$.subscribe(res => {
            if (res) {
                this.showTwoWayAuthModal();
            }
        });
    }

    public onHiddenAuthModal(event: any): void {
        if (event && event.dismissReason === "esc") {
            return this.resetTwoWayAuthModal();
        }
    }

    public LoginWithEmail(email: string) {
        let data = new SignupwithEmaillModel();
        this.retryCount++;
        data.email = email;
        data.retryCount = this.retryCount;
        this.store.dispatch(this.loginAction.SignupWithEmailRequest(data));
    }

    public VerifyEmail(email: string, code: string) {
        let data = new VerifyEmailModel();
        data.email = email;
        data.verificationCode = code;
        this.store.dispatch(this.loginAction.VerifyEmailRequest(data));
    }

    public VerifyCode(mobile: string, code: string) {
        let data = new VerifyMobileModel();
        data.countryCode = Number(this.selectedCountry);
        data.mobileNumber = mobile;
        data.oneTimePassword = code;
        this.store.dispatch(this.loginAction.VerifyMobileRequest(data));
    }

    public verifyTwoWayCode() {
        let user: VerifyEmailResponseModel;
        this.userDetails$.pipe(take(1)).subscribe(p => user = p);
        let data = new VerifyMobileModel();
        data.countryCode = Number(user?.countryCode);
        data.mobileNumber = user?.contactNumber;
        data.oneTimePassword = this.twoWayOthForm?.value?.otp;
        this.store.dispatch(this.loginAction.VerifyTwoWayAuthRequest(data));
    }

    public hideEmailModal() {
        this.emailVerifyModal.hide();
        this.store.dispatch(this.loginAction.ResetSignupWithEmailState());
        this.emailVerifyForm.reset();
    }

    public showMobileModal() {
        this.mobileVerifyModal.show();
    }

    public hideMobileModal() {
        this.mobileVerifyModal.hide();
        this.store.dispatch(this.loginAction.ResetSignupWithMobileState());
        this.mobileVerifyForm.get("mobileNumber").reset();
    }

    public showTwoWayAuthModal() {
        this.twoWayAuthModal.show();
    }

    public hideTowWayAuthModal() {
        this.twoWayAuthModal.hide();
    }

    public resetTwoWayAuthModal() {
        this.store.dispatch(this.loginAction.SetLoginStatus(userLoginStateEnum.notLoggedIn));
        this.hideTowWayAuthModal();
    }

    // tslint:disable-next-line:no-empty
    public getOtp(mobileNumber: string, code: string) {
        let data: SignupWithMobile = new SignupWithMobile();
        data.mobileNumber = mobileNumber;
        data.countryCode = Number(this.selectedCountry);
        this.store.dispatch(this.loginAction.SignupWithMobileRequest(data));
    }

    public async signInWithProviders(provider: string) {
        if (Configuration.isElectron) {
            // electronOauth2
            const { ipcRenderer } = (window as any).require("electron");
            if (provider === "google") {
                // google
                const t = ipcRenderer.send("authenticate", provider);
                ipcRenderer.once('take-your-gmail-token', (sender, arg) => {
                    this.store.dispatch(this.loginAction.signupWithGoogle(arg.access_token));
                });

            } else {
                ipcRenderer.once('take-your-gmail-token', (sender, arg) => {
                    this.store.dispatch(this.loginAction.signupWithGoogle(arg.access_token));
                });
            }
        } else {
            //  web social authentication
            this.store.dispatch(this.loginAction.resetSocialLogoutAttempt());
            if (provider === "google") {
                this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);

                if (!isElectron) {
                    setTimeout(() => {
                        this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
                    }, 500);
                }
            }
        }
    }

    public ngOnDestroy() {
        this.document.body.classList.add("unresponsive");
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * setCountryCode
     */
    public setCountryCode(event: IOption) {
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

    public loginWithPasswd(model: FormGroup) {
        let ObjToSend = model?.value;
        if (ObjToSend) {
            this.store.dispatch(this.loginAction.LoginWithPasswdRequest(ObjToSend));
        }
    }

    public showForgotPasswordModal() {
        this.showForgotPassword = true;
        this.loginUsing = "forgot";
        this.forgotStep = 1;
    }

    public forgotPassword(userId) {
        this.resetPasswordForm?.patchValue({ uniqueKey: userId });
        this.userUniqueKey = userId;
        this.store.dispatch(this.loginAction.forgotPasswordRequest(userId));
    }

    public resetPassword(form) {
        let ObjToSend = form?.value;
        ObjToSend.uniqueKey = _.cloneDeep(this.userUniqueKey);
        this.store.dispatch(this.loginAction.resetPasswordRequest(ObjToSend));
    }

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
            widgetId: OTP_WIDGET_ID,
            tokenAuth: OTP_TOKEN_AUTH,
            success: (data: any) => {
                this.ngZone.run(() => {
                    this.initiateLogin(data);
                });
            },
            failure: (error: any) => {
                this.toaster.errorToast(error?.message);
            }
        };

        /* OTP LOGIN */
        if (window['initSendOTP'] === undefined) {
            let scriptTag = document.createElement('script');
            scriptTag.src = OTP_PROVIDER_URL;
            scriptTag.type = 'text/javascript';
            scriptTag.defer = true;
            scriptTag.onload = () => {
                initSendOTP(configuration);
                this.loaderService.hide();
            };
            document.body.appendChild(scriptTag);
        } else {
            initSendOTP(configuration);
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
            if (response?.status === "success") {
                this.store.dispatch(this.loginAction.LoginWithPasswdResponse(response));
            } else {
                this.toaster.errorToast(response?.message);
            }
        });
    }
}
