import { distinctUntilKeyChanged, map } from 'rxjs/operators';
import { AppState } from '../store';
import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { userLoginStateEnum } from '../store/authentication/authentication.reducer';
import { ROUTES } from '../app.routes';

@Injectable()
export class UserAuthenticated implements CanActivate {
  constructor(public _router: Router, private store: Store<AppState>) {
  }

  public canActivate() {
    return this.store.select(p => p.session).pipe(distinctUntilKeyChanged('companyUniqueName'), map(p => {
      if (p.userLoginState === userLoginStateEnum.userLoggedIn) {
        if (ROUTES.findIndex(q => q.path.split('/')[0] === p.lastState.split('/')[0]) > -1) {
          console.log('UserAuthenticated');
          this._router.navigate([p.lastState]);
        } else {
          this._router.navigate(['home']);
        }
      }
      if (p.userLoginState === userLoginStateEnum.newUserLoggedIn) {
        this._router.navigate(['/new-user']);
      }
      return !(p.userLoginState === userLoginStateEnum.userLoggedIn || p.userLoginState === userLoginStateEnum.newUserLoggedIn);
    }),);
  }
}
