import { take, takeUntil } from "rxjs/operators";
import { LoginActions } from "../actions/login.action";
import { AppState } from "../store";
import { Component, Inject, NgZone, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TemplateRef } from '@angular/core';
import { Configuration, ELECTRON_OTP_PROVIDER_URL, IOption, OTP_PROVIDER_URL } from "../app.constant";
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
import { LoaderService } from "../loader/loader.service";
import { ToasterService } from "../services/toaster.service";
import { AuthenticationService } from "../services/authentication.service";
import { GeneralService } from "../services/general.service";
import { ServiceConfig } from "../services/service.config";
import { environment } from "../../environments/environment";

declare var initSendOTP: any;

@Component({
    selector: "signup",
    templateUrl: "./signup.component.html",
    styleUrls: ["./signup.component.scss"],
    standalone:false
})
export class SignupComponent implements OnInit, OnDestroy {
    public isLoginWithMobileSubmited$: Observable<boolean>;
    public isLoginWithEmailSubmited$: Observable<boolean>;
    /** Template reference for email verification dialog */
    @ViewChild('emailVerifyTemplate', { static: true }) public emailVerifyTemplate: TemplateRef<any>;
    /** Template reference for mobile verification dialog */
    @ViewChild('mobileVerifyTemplate', { static: true }) public mobileVerifyTemplate: TemplateRef<any>;
    /** Template reference for two-way authentication dialog */
    @ViewChild('twoWayAuthTemplate', { static: true }) public twoWayAuthTemplate: TemplateRef<any>;
    /** Dialog reference for email verify modal */
    private emailVerifyDialogRef: MatDialogRef<any>;
    /** Dialog reference for mobile verify modal */
    private mobileVerifyDialogRef: MatDialogRef<any>;
    /** Dialog reference for two way auth modal */
    private twoWayAuthDialogRef: MatDialogRef<any>;
    public urlPath: string = "";
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
    public signUpWithPasswdForm: UntypedFormGroup;
    public isSignupWithPasswordInProcess$: Observable<boolean>;
    public signupVerifyForm: UntypedFormGroup;
    public isSignupWithPasswordSuccess$: Observable<boolean>;
    public retryCount: number = 0;
    public signupVerifyEmail$: Observable<string>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** To Observe is google login inprocess */
    public isLoginWithGoogleInProcess$: Observable<boolean>;
    public isLoginWithPasswordIsShowVerifyOtp$: Observable<boolean>;
    /* Hold giddh logo source */
    public giddhLogoSrc: string = '';
    /* Hold domain url */
    public giddhDomainUrl: string = "";
    /** Holds images folder path */
    public imgPath: string = "";

    // tslint:disable-next-line:no-empty
    constructor(private fb: UntypedFormBuilder,
        private store: Store<AppState>,
        private loginAction: LoginActions,
        private authService: AuthService,
        @Inject(DOCUMENT) private document: Document,
        private loaderService: LoaderService,
        private toaster: ToasterService,
        private authenticationService: AuthenticationService,
        private ngZone: NgZone,
        @Inject(ServiceConfig) private serviceConfig,
        private generalService: GeneralService,
        private dialog: MatDialog
    ) {
        this.urlPath = isElectron ? "" : (this.serviceConfig.AppUrl || AppUrl) + APP_FOLDER;
        this.giddhDomainUrl = this.serviceConfig.AppUrl || 'https://giddh.com';
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

        this.isSignupWithPasswordInProcess$ = this.store.pipe(select(state => {
            return state.login.isSignupWithPasswordInProcess;
        }), takeUntil(this.destroyed$));

        this.isSignupWithPasswordSuccess$ = this.store.pipe(select(state => {
            return state.login.isSignupWithPasswordSuccess;
        }), takeUntil(this.destroyed$));
        this.isLoginWithGoogleInProcess$ = this.store.pipe(select(state => {
            return state.login.isLoginWithGoogleInProcess;
        }), takeUntil(this.destroyed$));
        this.signupVerifyEmail$ = this.store.pipe(select(p => p.login.signupVerifyEmail), takeUntil(this.destroyed$));

        this.isSocialLogoutAttempted$ = this.store.pipe(select(p => p.login.isSocialLogoutAttempted), takeUntil(this.destroyed$));
        contriesWithCodes.map(c => {
            this.countryCodeList.push({ value: c.countryName, label: c?.value });
        });
        this.userLoginState$ = this.store.pipe(select(p => p.session.userLoginState), takeUntil(this.destroyed$));
        this.userDetails$ = this.store.pipe(select(p => p.session.user), takeUntil(this.destroyed$));
        this.isTwoWayAuthInProcess$ = this.store.pipe(select(p => p.login.isTwoWayAuthInProcess), takeUntil(this.destroyed$));
        this.isTwoWayAuthInSuccess$ = this.store.pipe(select(p => p.login.isTwoWayAuthSuccess), takeUntil(this.destroyed$));
        this.isLoginWithPasswordIsShowVerifyOtp$ = this.store.pipe(select(state => state.login.isLoginWithPasswordIsShowVerifyOtp), takeUntil(this.destroyed$));
    }

    // tslint:disable-next-line:no-empty
    public ngOnInit() {
        this.imgPath = Configuration.isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || environment.AppUrl) + environment.APP_FOLDER + 'assets/images/';
        const whiteLabel = this.generalService.getDecodedWhiteLabel();
        this.giddhLogoSrc = whiteLabel?.giddhWhiteLabel?.logo || this.imgPath + 'giddh-white-logo.svg';
        this.generateRandomBanner();
        this.mobileVerifyForm = this.fb.group({
            country: ["India", [Validators.required]],
            mobileNumber: ["", [Validators.required]],
            otp: ["", [Validators.required]]
        });

        this.emailVerifyForm = this.fb.group({
            email: ["", [Validators.required, Validators.email]],
            token: ["", Validators.required]
        });
        this.twoWayOthForm = this.fb.group({
            otp: ["", [Validators.required]]
        });
        this.signUpWithPasswdForm = this.fb.group({
            email: ["", [Validators.required, Validators.email]],
            password: ["", [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,20}$")]]
        });
        this.signupVerifyForm = this.fb.group({
            email: ["", [Validators.required, Validators.email]],
            verificationCode: ["", Validators.required]
        });
        this.setCountryCode({ value: "India", label: "India" });

        // get user object when google auth is complete
        if (!Configuration.isElectron) {
            this.authService.authState.pipe(takeUntil(this.destroyed$)).subscribe((user: SocialUser) => {
                this.isSocialLogoutAttempted$.subscribe((res) => {
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

        this.isLoginWithPasswordIsShowVerifyOtp$.subscribe(res => {
            if (res) {
                this.showTwoWayAuthModal();
                this.store.dispatch(this.loginAction.hideTwoWayOtpPopup());
            }
        });

        // check if two way auth is successfully done
        this.isTwoWayAuthInSuccess$.subscribe(a => {
            if (a) {
                this.hideTowWayAuthModal();
                this.store.dispatch(this.loginAction.resetTwoWayAuthModal());
            }
        });

        this.signupVerifyEmail$.subscribe(a => {
            if (a) {
                this.signupVerifyForm.get("email")?.patchValue(a);
            }
        });
    }

    /**
     * Shows the email verification modal dialog
     *
     * @memberof SignupComponent
     */
    public showEmailModal() {
        this.emailVerifyDialogRef = this.dialog.open(this.emailVerifyTemplate, {
            panelClass: 'mat-dialog-md',
            disableClose: true
        });
        this.emailVerifyDialogRef.afterOpened().subscribe(() => {
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
        data.oneTimePassword = this.twoWayOthForm?.value.otp;
        this.store.dispatch(this.loginAction.VerifyTwoWayAuthRequest(data));
    }

    /**
     * Hides the email verification modal dialog
     *
     * @memberof SignupComponent
     */
    public hideEmailModal() {
        this.emailVerifyDialogRef?.close();
        this.store.dispatch(this.loginAction.ResetSignupWithEmailState());
        this.emailVerifyForm.reset();
    }

    /**
     * Shows the mobile verification modal dialog
     *
     * @memberof SignupComponent
     */
    public showMobileModal() {
        this.mobileVerifyDialogRef = this.dialog.open(this.mobileVerifyTemplate, {
            panelClass: 'mat-dialog-md',
            disableClose: true
        });
    }

    /**
     * Hides the mobile verification modal dialog
     *
     * @memberof SignupComponent
     */
    public hideMobileModal() {
        this.mobileVerifyDialogRef?.close();
        this.store.dispatch(this.loginAction.ResetSignupWithMobileState());
        this.mobileVerifyForm.get("mobileNumber").reset();
    }

    public showTwoWayAuthModal() {
        this.twoWayAuthDialogRef = this.dialog.open(this.twoWayAuthTemplate, {
            panelClass: 'mat-dialog-md',
            disableClose: true
        });
    }

    public hideTowWayAuthModal() {
        this.twoWayAuthDialogRef?.close();
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
     * This will use for sign with providers
     *
     * @param {string} provider
     * @memberof SignupComponent
     */
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
            }
        }
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Sets country code
     *
     * @param {IOption} event
     * @memberof SignupComponent
     */
    public setCountryCode(event: IOption) {
        if (event?.value) {
            let country = this.countryCodeList?.filter((obj) => obj?.value === event.value);
            this.selectedCountry = country[0].label;
        }
    }

    /**
     * Generates random banner
     *
     * @memberof SignupComponent
     */
    public generateRandomBanner() {
        let bannerArr = ["1", "2", "3"];
        let selectedSlide = bannerArr[Math.floor(Math.random() * bannerArr.length)];
        this.selectedBanner = "slide" + selectedSlide;
    }

    public SignupWithPasswd(model: UntypedFormGroup) {
        let ObjToSend = model?.value;
        if (ObjToSend) {
            this.store.dispatch(this.loginAction.SignupWithPasswdRequest(ObjToSend));
        }
    }

    /**
     * This will open the signup with otp popup
     *
     * @memberof SignupComponent
     */
    public signUpWithOtp(): void {
        this.loaderService.show();

        let configuration = {
            widgetId: this.serviceConfig.OTP_WIDGET_ID || OTP_WIDGET_ID,
            tokenAuth: this.serviceConfig.OTP_TOKEN_AUTH || OTP_TOKEN_AUTH,
            success: (data: any) => {
                this.ngZone.run(() => {
                    this.initiateSignup(data);
                });
            },
            failure: (error: any) => {
                this.toaster.errorToast(error?.message);
            }
        };

        /* OTP SIGNUP */
        if (window['initSendOTP'] === undefined) {
            let scriptTag = document.createElement('script');
            scriptTag.src = isElectron ? ELECTRON_OTP_PROVIDER_URL : OTP_PROVIDER_URL;
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
     * Initiate the signup process using otp
     *
     * @private
     * @param {*} data
     * @memberof SignupComponent
     */
    private initiateSignup(data: any): void {
        this.authenticationService.loginWithOtp({ accessToken: data?.message }).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                this.store.dispatch(this.loginAction.LoginWithPasswdResponse(response));
            } else {
                this.toaster.errorToast(response?.message);
            }
        });
    }
}
