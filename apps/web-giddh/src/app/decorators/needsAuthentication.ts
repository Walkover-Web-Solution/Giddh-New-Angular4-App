import { map, take, takeUntil, tap } from 'rxjs/operators';
import { AppState } from '../store';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable, NgZone } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { userLoginStateEnum } from '../models/user-login-state';
import { ReplaySubject } from 'rxjs';
import { includes, startsWith } from '../lodash-optimized';

@Injectable()
export class NeedsAuthentication  {
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    constructor(public router: Router, private store: Store<AppState>, private zone: NgZone) {
    }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.store.pipe(select(p => p.session.userLoginState), map(p => {
            if (p === userLoginStateEnum.newUserLoggedIn) {
                // Check if we're already on a subscription page to prevent infinite loop
                const currentUrl = state?.url || this.router.url || (window.location.pathname + window.location.search);
                if (currentUrl?.includes('/user-details/subscription')) {
                    return true; // Already on subscription page, allow access
                }
                
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
                return false; // Block current navigation, redirect will happen
            }
            if (p === userLoginStateEnum.notLoggedIn) {
                const currentUrl = state?.url || this.router.url || (window.location.pathname + window.location.search);
                let returnUrl = '';
                if (currentUrl?.includes('/pages/')) {
                    returnUrl = currentUrl.split('/pages/')[1];
                } else if (currentUrl?.startsWith('/')) {
                    returnUrl = currentUrl.substring(1);
                } else {
                    returnUrl = currentUrl;
                }
                if (returnUrl && returnUrl !== 'login' && returnUrl !== 'token-verify') {
                    this.router.navigate(['/login'], { queryParams: { returnUrl } });
                } else {
                    this.router.navigate(['/login']);
                }
                return false;
            }
            return p === userLoginStateEnum.userLoggedIn;
        }));
    }
}
