import { take, takeUntil } from "rxjs/operators";
import { LoginActions } from "../actions/login.action";
import { AppState } from "../store";
import { Component, Inject, NgZone, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TemplateRef } from '@angular/core';
import { ELECTRON_OTP_PROVIDER_URL, IOption, OTP_PROVIDER_URL } from "../app.constant";
import { Store, select } from "@ngrx/store";
import { Observable, ReplaySubject, Subscription } from "rxjs";
import {
    SignupwithEmaillModel,
    SignupWithMobile,
    VerifyEmailModel,
    VerifyEmailResponseModel,
    VerifyMobileModel
} from "../models/api-models/loginModels";
// COMMENTED OUT - MISSING MODULE: import { AuthService, GoogleLoginProvider, SocialLoginModule } from "../theme/ng-social-login-module/index";
import { DOCUMENT } from "@angular/common";
import { userLoginStateEnum } from "../models/user-login-state";
import { contriesWithCodes } from "../shared/helpers/countryWithCodes";
import { LoaderService } from "../loader/loader.service";
import { ToasterService } from "../services/toaster.service";
import { AuthenticationService } from "../services/authentication.service";
import { GeneralService } from "../services/general.service";
import { ServiceConfig } from "../services/service.config";
import { environment } from "../../environments/environment";
import { Configuration } from "../app.constant";
import { filter } from '../lodash-optimized';

declare var initSendOTP: any;

@Component({
    selector: 'signup',
    standalone: false,
    templateUrl: "./signup.component.html",
    styleUrls: ["./signup.component.scss"]
})
export class SignupComponent implements OnInit, OnDestroy {
    public isLoginWithMobileSubmited$: Observable<boolean>;
    public isLoginWithEmailSubmited$: Observable<boolean>;
    public isLoginWithEmailInProcess$: Observable<boolean>;
    public isVerifyEmailInProcess$: Observable<boolean>;
    public isLoginWithMobileInProcess$: Observable<boolean>;
    public isVerifyMobileInProcess$: Observable<boolean>;
    public isSignupWithPasswordInProcess$: Observable<boolean>;
    public signupVerifyEmail$: Observable<string>;
    public isLoginWithGoogleInProcess$: Observable<boolean>;
    public isLoginWithPasswordIsShowVerifyOtp$: Observable<boolean>;
        public isTwoWayAuthInProcess$: Observable<boolean>;

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Track subscriptions manually for Angular 21 compatibility */
    private subscriptions: Subscription[] = [];
    /** Flag to track component destruction state */
    private isDestroying = false;

    public giddhLogoSrc: string = '';
    public giddhDomainUrl: string = "";
    public imgPath: string = "";
    public urlPath: string = "";
    public selectedBanner: string = "";
    public selectedCountry: string = "";

    @ViewChild('emailVerifyTemplate', { static: true }) public emailVerifyTemplate: TemplateRef<any>;
    @ViewChild('mobileVerifyTemplate', { static: true }) public mobileVerifyTemplate: TemplateRef<any>;
    @ViewChild('twoWayAuthTemplate', { static: true }) public twoWayAuthTemplate: TemplateRef<any>;

    private emailVerifyDialogRef: MatDialogRef<any>;
    private mobileVerifyDialogRef: MatDialogRef<any>;
    private twoWayAuthDialogRef: MatDialogRef<any>;

    constructor(
        private fb: UntypedFormBuilder,
        private store: Store<AppState>,
        private loginAction: LoginActions,
        // COMMENTED OUT - MISSING AUTH SERVICE: private authService: AuthService,
        @Inject(DOCUMENT) private document: Document,
        private loaderService: LoaderService,
        // private toaster: ToasterService,
        private authenticationService: AuthenticationService,
        private ngZone: NgZone,
        @Inject(ServiceConfig) private serviceConfig: any,
        private generalService: GeneralService,
        private dialog: MatDialog
    ) {
        this.urlPath = (typeof Configuration.isElectron !== 'undefined' && Configuration.isElectron) ? "" : (this.serviceConfig?.AppUrl || environment.AppUrl || '') + (environment.APP_FOLDER || '');
        this.giddhDomainUrl = this.serviceConfig?.AppUrl || 'https://giddh.com';

        this.isLoginWithEmailInProcess$ = this.store.pipe(select(state => {
            return state?.login?.isLoginWithEmailInProcess || false;
        }), takeUntil(this.destroyed$));

        this.isVerifyEmailInProcess$ = this.store.pipe(select(state => {
            return state?.login?.isVerifyEmailInProcess || false;
        }), takeUntil(this.destroyed$));

        this.isLoginWithMobileInProcess$ = this.store.pipe(select(state => {
            return state?.login?.isLoginWithMobileInProcess || false;
        }), takeUntil(this.destroyed$));

        this.isVerifyMobileInProcess$ = this.store.pipe(select(state => {
            return state?.login?.isVerifyMobileInProcess || false;
        }), takeUntil(this.destroyed$));

        this.isLoginWithMobileSubmited$ = this.store.pipe(select(state => {
            return state?.login?.isLoginWithMobileSubmited || false;
        }), takeUntil(this.destroyed$));

        this.isLoginWithEmailSubmited$ = this.store.pipe(select(state => {
            return state?.login?.isLoginWithEmailSubmited || false;
        }), takeUntil(this.destroyed$));

        this.isSignupWithPasswordInProcess$ = this.store.pipe(select(state => {
            return state?.login?.isSignupWithPasswordInProcess || false;
        }), takeUntil(this.destroyed$));

        this.signupVerifyEmail$ = this.store.pipe(select(state => {
            return state?.login?.signupVerifyEmail || '';
        }), takeUntil(this.destroyed$));

        this.isLoginWithGoogleInProcess$ = this.store.pipe(select(state => {
            return state?.login?.isLoginWithGoogleInProcess || false;
        }), takeUntil(this.destroyed$));

        this.isLoginWithPasswordIsShowVerifyOtp$ = this.store.pipe(select(state => {
            return state?.login?.isLoginWithPasswordIsShowVerifyOtp || false;
        }), takeUntil(this.destroyed$));

        this.isTwoWayAuthInProcess$ = this.store.pipe(select(state => {
            return state?.login?.isTwoWayAuthInProcess || false;
        }), takeUntil(this.destroyed$));
    }

    ngOnInit() {
        this.imgPath = (typeof Configuration.isElectron !== 'undefined' && Configuration.isElectron) ? 'assets/images/' : (environment.AppUrl || '') + (environment.APP_FOLDER || '') + 'assets/images/';
        this.giddhLogoSrc = this.imgPath + 'giddh-logo.png';
        this.generateRandomBanner();

        // Set default country
        const country = contriesWithCodes?.filter(c => c?.value === 'IN');
        if (country && country.length > 0) {
            this.selectedCountry = (country[0] as any)?.label || 'India';
        }
    }

    ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public generateRandomBanner() {
        const selectedSlide = Math.floor(Math.random() * 3) + 1;
        this.selectedBanner = "slide" + selectedSlide;
    }

    public SignupWithPasswd(model: UntypedFormGroup) {
        if (model?.valid) {
            const objToSend = model?.value;
            this.store?.dispatch(this.loginAction?.SignupWithPasswdRequest(objToSend));
        }
    }

    // PLACEHOLDER METHOD - REPLACE WITH WORKING IMPLEMENTATION
    public signUpWithOtp(): void {
        console.log('signUpWithOtp method placeholder - implement when original files are restored');
        // TODO: Implement OTP signup functionality
    }

    // PLACEHOLDER METHOD - REPLACE WITH WORKING IMPLEMENTATION
    private initiateSignup(data: any): void {
        console.log('initiateSignup method placeholder - implement when original files are restored');
        // TODO: Implement signup initiation functionality
    }

    /**
     * Helper method to track subscriptions for Angular 21 compatibility
     */
    protected addSubscription(subscription: Subscription): void {
        if (subscription && !subscription.closed) {
            this.subscriptions.push(subscription);
        }
    }


}
