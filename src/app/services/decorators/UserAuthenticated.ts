import { AppState } from '../../store/roots';
import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { userLoginStateEnum } from '../../store/authentication/authentication.reducer';

@Injectable()
export class UserAuthenticated implements CanActivate {
  constructor(public _router: Router, private store: Store<AppState>) {
  }
  public canActivate() {
    return this.store.select(p => p.session).distinctUntilKeyChanged('companyUniqueName').map(p => {
      if (p.userLoginState === userLoginStateEnum.userLoggedIn) {
        this._router.navigate([p.lastState]);
      }
      if (p.userLoginState === userLoginStateEnum.newUserLoggedIn) {
        this._router.navigate(['/new-user']);
      }
      return !(p.userLoginState === userLoginStateEnum.userLoggedIn || p.userLoginState === userLoginStateEnum.newUserLoggedIn);
    });
  }
}
