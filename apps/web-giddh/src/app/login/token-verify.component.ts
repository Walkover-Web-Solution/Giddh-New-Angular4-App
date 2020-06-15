import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { ReplaySubject } from 'rxjs';

import { LoginActions } from '../actions/login.action';
import { AuthenticationService } from '../services/authentication.service';
import { GeneralService } from '../services/general.service';
import { AppState } from '../store';

@Component({
    template: `<h2>Please wait...</h2>`
})
export class TokenVerifyComponent implements OnInit, OnDestroy {
    public loading = false;
    public returnUrl: string;
    public token: string;
    public request: any;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private route: ActivatedRoute,
        private store: Store<AppState>,
        private generalService: GeneralService,
        private authenticationService: AuthenticationService,
        private _loginAction: LoginActions,
    ) {
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public ngOnInit() {
        this.generalService.storeUtmParameters(this.route.snapshot.queryParams);
        if (this.route.snapshot.queryParams['token']) {
            this.token = this.route.snapshot.queryParams['token'];
            this.verifyToken();
        }

        if (this.route.snapshot.queryParams['request']) {
            const sessionId = decodeURIComponent(this.route.snapshot.queryParams['request']);
            this.authenticationService.getUserDetails(sessionId).subscribe((data) => {
                this.request = data;
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
}
