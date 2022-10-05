import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { ConnectionService } from 'ng-connection-service';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoginActions } from '../actions/login.action';
import { AuthenticationService } from '../services/authentication.service';
import { GeneralService } from '../services/general.service';
import { AppState } from '../store';

@Component({
    selector: "token-verify",
    templateUrl: "./token-verify.component.html",
})
export class TokenVerifyComponent implements OnInit, OnDestroy {
    public loading = false;
    public returnUrl: string;
    public token: string;
    public request: any;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public isConnected: boolean = true;

    constructor(
        private route: ActivatedRoute,
        private store: Store<AppState>,
        private generalService: GeneralService,
        private authenticationService: AuthenticationService,
        private _loginAction: LoginActions,
        private connectionService: ConnectionService,
        private authService: AuthenticationService
    ) {
        
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public ngOnInit() {
        this.connectionService.monitor().pipe(takeUntil(this.destroyed$)).subscribe(isConnected => {
            if (!isConnected) {
                this.isConnected = false;
            } else {
                if (!this.isConnected) {
                    this.isConnected = true;
                    this.refreshPage();
                }
            }
        });
        
        if (this.route.snapshot.queryParams['signup'] && this.generalService.user) {
            this.authService.ClearSession().pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response?.status === 'success') {
                    this.store.dispatch(this._loginAction.socialLogoutAttempt());
                    this.processLogin();
                }
            });
        } else {
            this.store.dispatch(this._loginAction.socialLogoutAttempt());
            this.processLogin();
        }
    }

    /**
     * This will process the login
     *
     * @memberof TokenVerifyComponent
     */
    public processLogin(): void {
        this.generalService.storeUtmParameters(this.route.snapshot.queryParams);
        if (this.route.snapshot.queryParams['token']) {
            this.token = this.route.snapshot.queryParams['token'];
            this.verifyToken();
        }

        if (this.route.snapshot.queryParams['request']) {
            const sessionId = decodeURIComponent(this.route.snapshot.queryParams['request']);
            this.authenticationService.getUserDetails(sessionId).pipe(takeUntil(this.destroyed$)).subscribe((data) => {
                this.request = data;
                if (data?.status === "success" && data?.body && data?.body?.session && data?.body?.session?.id) {
                    this.generalService.setCookie("giddh_session_id", data.body.session.id, 30);
                }
                this.verifyUser();
            });
        }
    }

    /**
     * Verifies the Gmail token
     *
     * @memberof TokenVerifyComponent
     */
    public verifyToken(): void {
        this.store.dispatch(this._loginAction.signupWithGoogle(this.token));
    }

    /**
     * Verifies the user response data
     *
     * @memberof TokenVerifyComponent
     */
    public verifyUser(): void {
        this.store.dispatch(this._loginAction.LoginWithPasswdResponse(this.request));
    }

    /**
     * Refreshes the page
     *
     * @memberof TokenVerifyComponent
     */
    public refreshPage(): void {
        if (this.route.snapshot.queryParams['token']) {
            this.token = this.route.snapshot.queryParams['token'];
            window.location.href = "/token-verify?token=" + this.token;
        }

        if (this.route.snapshot.queryParams['request']) {
            const sessionId = decodeURIComponent(this.route.snapshot.queryParams['request']);
            window.location.href = "/token-verify?request=" + sessionId;
        }
    }
}
