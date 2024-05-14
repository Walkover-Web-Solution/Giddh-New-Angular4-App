import { map, take, takeUntil, tap } from 'rxjs/operators';
import { AppState } from '../store';
import { Router } from '@angular/router';
import { Injectable, NgZone } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { userLoginStateEnum } from '../models/user-login-state';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class NeedsAuthentication  {
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    constructor(public router: Router, private store: Store<AppState>, private zone: NgZone) {
    }

    public canActivate() {
        return this.store.pipe(select(p => p.session.userLoginState), map(p => {
            if (p === userLoginStateEnum.newUserLoggedIn) {
                this.zone.run(() => {
                    this.store.pipe(
                        select(state => state.session.user),
                        take(1), // take only the first emission
                        tap(response => {
                            const hasSubscriptionPermission = response?.user?.hasSubscriptionPermission;
                            if (hasSubscriptionPermission) {
                                this.router.navigate(['/pages/subscription']);
                            } else {
                                this.router.navigate(['/pages/subscription/buy-plan']);
                            }
                        })
                    ).subscribe();
                });
            }
            if (p === userLoginStateEnum.notLoggedIn) {
                this.router.navigate(['/login']);
            }
            return p === userLoginStateEnum.userLoggedIn;
        }));
    }
}
