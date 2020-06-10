import { take, takeUntil } from "rxjs/operators";
import { LoginActions } from "../actions/login.action";
import { AppState } from "../store";
import { Router } from "@angular/router";
import { Component, Inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalDirective } from "ngx-bootstrap";
import { Configuration } from "../app.constant";
import { Store } from "@ngrx/store";
import { Observable, ReplaySubject } from "rxjs";
import {
    LinkedInRequestModel,
    SignupwithEmaillModel,
    SignupWithMobile,
    VerifyEmailModel,
    VerifyEmailResponseModel,
    VerifyMobileModel
} from "../models/api-models/loginModels";
import {
    AuthService,
    GoogleLoginProvider,
    LinkedinLoginProvider,
    SocialUser
} from "../theme/ng-social-login-module/index";
import { contriesWithCodes } from "../shared/helpers/countryWithCodes";

import { IOption } from "../theme/ng-virtual-select/sh-options.interface";
import { DOCUMENT } from "@angular/platform-browser";
import { ToasterService } from "../services/toaster.service";
import { AuthenticationService } from "../services/authentication.service";
import { userLoginStateEnum } from "../models/user-login-state";
import { isCordova, isIOS } from "@giddh-workspaces/utils";
import { GeneralService } from "../services/general.service";
import { AppModule } from '..';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

@Component({
    selector: "login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit, OnDestroy {


    public isLoginWithMobileSubmited$: Observable<boolean>;
    @ViewChild("emailVerifyModal") public emailVerifyModal: ModalDirective;
    public isLoginWithEmailSubmited$: Observable<boolean>;
    @ViewChild("mobileVerifyModal") public mobileVerifyModal: ModalDirective;
    @ViewChild("twoWayAuthModal") public twoWayAuthModal: ModalDirective;
    // @ViewChild('forgotPasswordModal') public forgotPasswordModal: ModalDirective;

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
    public apkVersion: string;
    private imageURL: string;
    private email: string;
    private name: string;
    private token: string;
    private userUniqueKey: string;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    //Button to hide linkedIn button till functionality is available
    public showLinkedInButton = false;
    public deviceDetails: any;
    public isCordovaAppleApp: boolean = false;

    // tslint:disable-next-line:no-empty
    constructor(private _fb: FormBuilder,
        private store: Store<AppState>,
        private router: Router,
        private loginAction: LoginActions,
        private authService: AuthService,
        @Inject(DOCUMENT) private document: Document,
        private _toaster: ToasterService,
        private _authService: AuthenticationService,
        private _generalService: GeneralService
    ) {
        this.urlPath = (isElectron || isCordova()) ? "" : AppUrl + APP_FOLDER;
        this.isLoginWithEmailInProcess$ = store.select(state => {
            return state.login.isLoginWithEmailInProcess;
        }).pipe(takeUntil(this.destroyed$));
        this.isVerifyEmailInProcess$ = store.select(state => {
            return state.login.isVerifyEmailInProcess;
        }).pipe(takeUntil(this.destroyed$));
        this.isLoginWithMobileInProcess$ = store.select(state => {
            return state.login.isLoginWithMobileInProcess;
        }).pipe(takeUntil(this.destroyed$));
        this.isVerifyMobileInProcess$ = store.select(state => {
            return state.login.isVerifyMobileInProcess;
        }).pipe(takeUntil(this.destroyed$));

        this.isLoginWithMobileSubmited$ = store.select(state => {
            return state.login.isLoginWithMobileSubmited;
        }).pipe(takeUntil(this.destroyed$));
        this.isLoginWithEmailSubmited$ = store.select(state => {
            return state.login.isLoginWithEmailSubmited;
        }).pipe(takeUntil(this.destroyed$));
        store.select(state => {
            return state.login.isVerifyEmailSuccess;
        }).pipe(takeUntil(this.destroyed$)).subscribe((value) => {
            if (value) {
                // this.router.navigate(['home']);
            }
        });
        store.select(state => {
            return state.login.isVerifyMobileSuccess;
        }).pipe(takeUntil(this.destroyed$)).subscribe((value) => {
            if (value) {
                // this.router.navigate(['home']);
            }
        });
        this.isLoginWithPasswordInProcess$ = store.select(state => {
            return state.login.isLoginWithPasswordInProcess;
        }).pipe(takeUntil(this.destroyed$));
        this.isForgotPasswordInProgress$ = store.select(state => {
            return state.login.isForgotPasswordInProcess;
        }).pipe(takeUntil(this.destroyed$));
        this.isResetPasswordInSuccess$ = store.select(state => {
            return state.login.isResetPasswordInSuccess;
        }).pipe(takeUntil(this.destroyed$));
        this.isLoginWithPasswordSuccessNotVerified$ = store.select(state => {
            return state.login.isLoginWithPasswordSuccessNotVerified;
        }).pipe(takeUntil(this.destroyed$));
        this.isLoginWithPasswordIsShowVerifyOtp$ = store.select(state => {
            return state.login.isLoginWithPasswordIsShowVerifyOtp;
        }).pipe(takeUntil(this.destroyed$));
        this.isSocialLogoutAttempted$ = this.store.select(p => p.login.isSocialLogoutAttempted).pipe(takeUntil(this.destroyed$));

        contriesWithCodes.map(c => {
            this.countryCodeList.push({ value: c.countryName, label: c.value });
        });
        this.userLoginState$ = this.store.select(p => p.session.userLoginState);
        this.userDetails$ = this.store.select(p => p.session.user);
        this.isTwoWayAuthInProcess$ = this.store.select(p => p.login.isTwoWayAuthInProcess);
        this.isTwoWayAuthInSuccess$ = this.store.select(p => p.login.isTwoWayAuthSuccess);

        if (isCordova()) {
            const bootstrap = () => {
                platformBrowserDynamic().bootstrapModule(AppModule);
            };

            if (typeof window['cordova'] !== 'undefined') {
                document.addEventListener('deviceready', (device) => {
                    bootstrap();

                    if (isIOS()) {
                        this.isCordovaAppleApp = true;
                    }
                }, false);
            } else {
                bootstrap();
            }
        }
    }

    // tslint:disable-next-line:no-empty
    public ngOnInit() {

        this.emailVerifyModal.config = { backdrop: "static" };
        this.twoWayAuthModal.config = { backdrop: "static" };
        this.mobileVerifyModal.config = { backdrop: "static" };

        this.getElectronAppVersion();
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
        if (!(Configuration.isElectron || Configuration.isCordova)) {
            this.authService.authState.pipe(takeUntil(this.destroyed$)).subscribe((user: SocialUser) => {
                this.isSocialLogoutAttempted$.subscribe((res) => {
                    if (!res && user) {
                        switch (user.provider) {
                            case "GOOGLE": {
                                this.store.dispatch(this.loginAction.signupWithGoogle(user.token));
                                break;
                            }
                            case "LINKEDIN": {
                                let obj: LinkedInRequestModel = new LinkedInRequestModel();
                                obj.email = user.email;
                                obj.token = user.token;
                                this.store.dispatch(this.loginAction.signupWithLinkedin(obj));
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

        this.twoWayAuthModal.onHidden.subscribe(e => {
            if (e && e.dismissReason === "esc") {
                return this.resetTwoWayAuthModal();
            }
        });
        this.isLoginWithPasswordSuccessNotVerified$.subscribe(res => {
            if (res) {
                //
            }
        });
        this.isLoginWithPasswordIsShowVerifyOtp$.subscribe(res => {
            if (res) {
                this.showTwoWayAuthModal();
            }
        });
    }

    public showEmailModal() {
        this.emailVerifyModal.show();
        this.emailVerifyModal.onShow.pipe(takeUntil(this.destroyed$)).subscribe(() => {
            this.isSubmited = false;
        });
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
        data.countryCode = Number(user.countryCode);
        data.mobileNumber = user.contactNumber;
        data.oneTimePassword = this.twoWayOthForm.value.otp;
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

    /**
     * Getting data from browser's local storage
     */
    public getData() {
        this.token = localStorage.getItem("token");
        this.imageURL = localStorage.getItem("image");
        this.name = localStorage.getItem("name");
        this.email = localStorage.getItem("email");
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
                // linked in
                // const t = ipcRenderer.send("authenticate", provider);
                // this.store.dispatch(this.loginAction.LinkedInElectronLogin(t));
                const t = ipcRenderer.send("authenticate", provider);
                ipcRenderer.once('take-your-gmail-token', (sender, arg) => {
                    this.store.dispatch(this.loginAction.signupWithGoogle(arg.access_token));
                });
            }
        } else if (isCordova()) {
            if (provider === "google") {
                (window as any).plugins.googleplus.login(
                    {
                        'scopes': 'email', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
                        'webClientId': this._generalService.getGoogleCredentials().GOOGLE_CLIENT_ID,
                        'offline': true // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
                    },
                    (obj) => {
                        this.store.dispatch(this.loginAction.signupWithGoogle(obj.accessToken));
                        // console.log((JSON.stringify(obj))); // do something useful instead of alerting
                    },
                    (msg) => {
                        console.log(('error: ' + msg));
                    }
                );
            } else if (provider === "apple") {
                (cordova.plugins as any).SignInWithApple.signin(
                    { requestedScopes: [0, 1] },
                    function (response) {
                        this.store.dispatch(this.loginAction.signupWithApple(response));
                    },
                    function (error) {
                        alert('Apple login is not supported on your IOS version.');
                    }
                )
            }
        } else {
            //  web social authentication
            this.store.dispatch(this.loginAction.resetSocialLogoutAttempt());
            if (provider === "google") {
                this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
            } else if (provider === "linkedin") {
                this.authService.signIn(LinkedinLoginProvider.PROVIDER_ID);
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
        if (event.value) {
            let country = this.countryCodeList.filter((obj) => obj.value === event.value);
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
        let ObjToSend = model.value;
        if (ObjToSend) {
            this.store.dispatch(this.loginAction.LoginWithPasswdRequest(ObjToSend));
        }
        // let pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,20}$/g;
        // if (pattern.test(ObjToSend.password)) {
        // } else {
        //   return this._toaster.errorToast('Password is weak');
        // }
    }

    public showForgotPasswordModal() {
        this.showForgotPassword = true;
        this.loginUsing = "forgot";
        this.forgotStep = 1;
    }

    public forgotPassword(userId) {
        this.resetPasswordForm.patchValue({ uniqueKey: userId });
        this.userUniqueKey = userId;
        this.store.dispatch(this.loginAction.forgotPasswordRequest(userId));
    }

    public resetPassword(form) {
        let ObjToSend = form.value;
        ObjToSend.uniqueKey = _.cloneDeep(this.userUniqueKey);
        this.store.dispatch(this.loginAction.resetPasswordRequest(ObjToSend));
    }

    public resetForgotPasswordProcess() {
        this.forgotPasswordForm.reset();
        this.resetPasswordForm.reset();
        this.forgotStep = 1;
        this.userUniqueKey = null;
    }

    private getElectronAppVersion() {
        this._authService.GetElectronAppVersion().subscribe((res: string) => {
            if (res && typeof res === "string") {
                let version = res.split("files")[0];
                let versNum = version.split(" ")[1];
                this.apkVersion = versNum;
            }
        });
    }
}
