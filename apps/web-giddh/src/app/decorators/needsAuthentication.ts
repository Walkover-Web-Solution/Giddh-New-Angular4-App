import { map } from 'rxjs/operators';
import { AppState } from '../store';
import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { userLoginStateEnum } from '../models/user-login-state';
import { environment } from '../../environments/environment';


@Injectable()
export class NeedsAuthentication implements CanActivate {
    constructor(public _router: Router, private store: Store<AppState>) {
    }

    public canActivate() {
        return this.store.select(p => p.session.userLoginState).pipe(map(p => {
            if (p === userLoginStateEnum.newUserLoggedIn) {
                this._router.navigate(['/new-user']);
            }
            if (p === userLoginStateEnum.notLoggedIn) {
                if (isElectron) {
                    console.log('NeedsAuthentication');
                    this._router.navigate(['/login']); this._router.navigate(['/login']);
                } else {
                    window.location.href = (environment.production) ? `https://app.giddh.com/login?action=logout` : `https://test.giddh.com/login/?action=logout`;
                }
            }
            // console.log(userLoginStateEnum.userLoggedIn);
            // console.log('from nedd authentication' + (p === userLoginStateEnum.userLoggedIn));
            return p === userLoginStateEnum.userLoggedIn;
        }));
    }
}
