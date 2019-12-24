import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { LoginActions } from '../actions/login.action';
import { Store } from '@ngrx/store';
import { AppState } from '../store';

@Component({
    template: `<h2>Please wait...</h2>`
})
export class TokenVerifyComponent implements OnInit, OnDestroy {
    public loading = false;
    public returnUrl: string;
    public token: string;
    public request: string;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private store: Store<AppState>,
        private _authService: AuthenticationService,
        private _loginAction: LoginActions,
    ) {
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public ngOnInit() {
        // http://test.giddh.com/app/login/verify-token?token=lkajf93809438lajf09803&returnUrl=dashboard
        if (this.route.snapshot.queryParams['token']) {
            this.token = this.route.snapshot.queryParams['token'];
            this.verifyToken();
        }

        if (this.route.snapshot.queryParams['request']) {
            this.request = this.route.snapshot.queryParams['request'];
            this.verifyUser();
        }
    }

    public verifyToken() {
        this.store.dispatch(this._loginAction.signupWithGoogle(this.token));
    }

    public verifyUser() {
        this.store.dispatch(this._loginAction.userAutoLoginResponse(JSON.parse(this.request)));
    }
}
