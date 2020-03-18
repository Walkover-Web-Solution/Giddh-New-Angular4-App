import {map} from 'rxjs/operators';
import {AppState} from '../store';
import {CanActivate, Router} from '@angular/router';
import {Injectable, NgZone} from '@angular/core';
import {Store} from '@ngrx/store';
import {userLoginStateEnum} from '../models/user-login-state';


@Injectable()
export class NeedsAuthentication implements CanActivate {
    constructor(public _router: Router, private store: Store<AppState>, private  zone: NgZone) {
    }

    public canActivate() {
        return this.store.select(p => p.session.userLoginState).pipe(map(p => {
            if (p === userLoginStateEnum.newUserLoggedIn) {
                this.zone.run(() => {
                    this._router.navigate(['/new-user']);
                });
            }
            if (p === userLoginStateEnum.notLoggedIn) {
                this._router.navigate(['/login']);
            }
            return p === userLoginStateEnum.userLoggedIn;
        }));
    }
}
