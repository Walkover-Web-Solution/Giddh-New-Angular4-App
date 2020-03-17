import { AppState } from '../store';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import {Injectable, NgZone} from '@angular/core';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { userLoginStateEnum } from '../models/user-login-state';
import { ROUTES } from '../routes-array';

@Injectable()
export class UserAuthenticated implements CanActivate {
    constructor(public _router: Router, private store: Store<AppState>, private zone:NgZone) {
    }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.store.select(p => p.session.companyUniqueName).pipe(distinctUntilChanged(), switchMap((p) => {
            return this.store.select(k => k.session);
        }), map(p => {
            if (p.userLoginState === userLoginStateEnum.userLoggedIn) {
                if (ROUTES.findIndex(q => q.path.split('/')[0] === p.lastState.split('/')[0]) > -1) {
                    console.log('UserAuthenticated');
                    let lastStateHaveParams: boolean = p.lastState.includes('?');
                    if (lastStateHaveParams) {
                        let tempParams = p.lastState.substr(p.lastState.lastIndexOf('?'));
                        let urlParams = new URLSearchParams(tempParams);
                        let queryParams = {};
                        urlParams.forEach((val, key) => {
                            queryParams[key] = val;
                        });
                        this._router.navigate([p.lastState.replace(tempParams, '')], { queryParams });
                    } else {
                        this._router.navigate([p.lastState]);
                    }
                } else {
                    this._router.navigate(['home']);
                }
            }
            if (p.userLoginState === userLoginStateEnum.newUserLoggedIn) {
                this.zone.run(() => {
                    this._router.navigate(['/new-user']);
                });
            }
            return !(p.userLoginState === userLoginStateEnum.userLoggedIn || p.userLoginState === userLoginStateEnum.newUserLoggedIn);
        }));
    }
}
