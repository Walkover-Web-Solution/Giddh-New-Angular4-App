import { AppState } from '../store';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable, NgZone } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { distinctUntilChanged, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { userLoginStateEnum } from '../models/user-login-state';
import { ROUTES } from '../routes-array';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class UserAuthenticated  {
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    constructor(public router: Router, private store: Store<AppState>, private zone: NgZone) {
    }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.store.pipe(
            select(state => state.session),
            map(s => ({ userLoginState: s.userLoginState, lastState: s.lastState })),
            distinctUntilChanged((a, b) => a.userLoginState === b.userLoginState && a.lastState === b.lastState),
            take(1),
            map(p => {
                if (p.userLoginState === userLoginStateEnum.userLoggedIn) {
                    // If navigating to login/token-verify with a returnUrl, prioritize it
                    const qpMap = (route as any)?.queryParamMap;
                    const rawReturnUrl: string = qpMap?.get ? (qpMap.get('returnUrl') || qpMap.get('returnurl')) : ((route as any)?.queryParams ? ((route as any).queryParams['returnUrl'] || (route as any).queryParams['returnurl']) : null);
                    if (rawReturnUrl) {
                        try {
                            let decoded = decodeURIComponent(rawReturnUrl);
                            if (decoded.startsWith('/')) { decoded = decoded.substring(1); }
                            const target = decoded.startsWith('pages/') ? decoded : `pages/${decoded}`;
                            this.router.navigateByUrl(`/${target}`);
                            return false;
                        } catch (_) {
                            // fallback to existing flow if decode fails
                        }
                    }
                    if (ROUTES.findIndex(q => q.path.split('/')[0] === p.lastState.split('/')[0]) > -1) {
                        let lastStateHaveParams: boolean = p.lastState.includes('?');
                        if (lastStateHaveParams) {
                            let tempParams = p.lastState.substr(p.lastState.lastIndexOf('?'));
                            let urlParams = new URLSearchParams(tempParams);
                            let queryParams = {};
                            urlParams.forEach((val, key) => {
                                queryParams[key] = val;
                            });
                            this.router.navigate([p.lastState?.replace(tempParams, '')], { queryParams });
                        } else {
                            if (p.lastState) {
                                this.router.navigate([p.lastState]);
                            } else {
                                this.router.navigate(['home']);
                            }
                        }
                    } else {
                        this.router.navigate(['home']);
                    }
                } else {
                   const qpMap = (route as any)?.queryParamMap;
                   const rawReturnUrl: string = qpMap?.get ? (qpMap.get('returnUrl') || qpMap.get('returnurl')) : ((route as any)?.queryParams ? ((route as any).queryParams['returnUrl'] || (route as any).queryParams['returnurl']) : null);
                   if (rawReturnUrl) {
                       try {
                           sessionStorage.setItem('returnUrl', rawReturnUrl);
                       } catch (_) {}
                   }
                }
                if (p.userLoginState === userLoginStateEnum.newUserLoggedIn) {
                    this.zone.run(() => {
                        this.store.pipe(
                            select(state => state.session.user),
                            take(1), // take only the first emission
                            tap(response => {
                                const hasSubscriptionPermission = response?.user?.hasSubscriptionPermission;
                                if (hasSubscriptionPermission) {
                                    this.router.navigate(['/pages/user-details/subscription']);
                                } else {
                                    this.router.navigate(['/pages/user-details/subscription/buy-plan']);
                                }
                            })
                        ).subscribe();
                    });
                }
                return !(p.userLoginState === userLoginStateEnum.userLoggedIn || p.userLoginState === userLoginStateEnum.newUserLoggedIn);
            })
        );
    }
}
