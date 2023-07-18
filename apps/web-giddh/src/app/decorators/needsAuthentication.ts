import { map } from 'rxjs/operators';
import { AppState } from '../store';
import { CanActivate, Router } from '@angular/router';
import { Injectable, NgZone } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { userLoginStateEnum } from '../models/user-login-state';

@Injectable()
export class NeedsAuthentication implements CanActivate {
    constructor(public router: Router, private store: Store<AppState>, private zone: NgZone) {
    }

    public canActivate() {
        return this.store.pipe(select(p => p.session.userLoginState), map(p => {
            if (p === userLoginStateEnum.newUserLoggedIn) {
                this.zone.run(() => {
                    this.router.navigate(['/new-company']);
                });
            }
            if (p === userLoginStateEnum.notLoggedIn) {
                this.router.navigate(['/login']);
            }
            return p === userLoginStateEnum.userLoggedIn;
        }));
    }
}
