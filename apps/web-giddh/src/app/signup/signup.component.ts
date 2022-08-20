import { take, takeUntil } from "rxjs/operators";
import { LoginActions } from "../actions/login.action";
import { AppState } from "../store";
import { Component, Inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalDirective } from "ngx-bootstrap/modal";
import { Configuration } from "../app.constant";
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

@Component({
    selector: "signup",
    templateUrl: "./signup.component.html",
    styleUrls: ["./signup.component.scss"]
})
export class SignupComponent implements OnInit, OnDestroy {
    public isLoginWithMobileSubmited$: Observable<boolean>;
    @ViewChild("emailVerifyModal", { static: true }) public emailVerifyModal: ModalDirective;
    public isLoginWithEmailSubmited$: Observable<boolean>;
    @ViewChild("mobileVerifyModal", { static: true }) public mobileVerifyModal: ModalDirective;
    @ViewChild("twoWayAuthModal", { static: true }) public twoWayAuthModal: ModalDirective;
    public urlPath: string = "";
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
    public signUpWithPasswdForm: FormGroup;
    public isSignupWithPasswordInProcess$: Observable<boolean>;
    public signupVerifyForm: FormGroup;
    public isSignupWithPasswordSuccess$: Observable<boolean>;
    public retryCount: number = 0;
    public signupVerifyEmail$: Observable<string>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** To Observe is google login inprocess */
    public isLoginWithGoogleInProcess$: Observable<boolean>;

    // tslint:disable-next-line:no-empty
    constructor(private fb: FormBuilder,
        private store: Store<AppState>,
        private loginAction: LoginActions,
        private authService: AuthService,
        @Inject(DOCUMENT) private document: Document
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
            this.countryCodeList.push({ value: c.countryName, label: c.value });
        });
        this.userLoginState$ = this.store.pipe(select(p => p.session.userLoginState), takeUntil(this.destroyed$));
        this.userDetails$ = this.store.pipe(select(p => p.session.user), takeUntil(this.destroyed$));
        this.isTwoWayAuthInProcess$ = this.store.pipe(select(p => p.login.isTwoWayAuthInProcess), takeUntil(this.destroyed$));
        this.isTwoWayAuthInSuccess$ = this.store.pipe(select(p => p.login.isTwoWayAuthSuccess), takeUntil(this.destroyed$));
    }

    // tslint:disable-next-line:no-empty
    public ngOnInit() {
        this.document.body.classList.remove("unresponsive");
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
        this.document.body.classList.add("unresponsive");
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
        if (event.value) {
            let country = this.countryCodeList.filter((obj) => obj.value === event.value);
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

    public SignupWithPasswd(model: FormGroup) {
        let ObjToSend = model.value;
        if (ObjToSend) {
            this.store.dispatch(this.loginAction.SignupWithPasswdRequest(ObjToSend));
        }
    }
}
