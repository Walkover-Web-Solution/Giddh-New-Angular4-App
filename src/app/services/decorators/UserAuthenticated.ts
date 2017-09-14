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
    return this.store.select(p => p.session.userLoginState).map(p => {
      if (p === userLoginStateEnum.userLoggedIn) {
        this._router.navigate(['/home']);
      }
      if (p === userLoginStateEnum.newUserLoggedIn) {
        this._router.navigate(['/new-user']);
      }
      return !(p === userLoginStateEnum.userLoggedIn || p === userLoginStateEnum.newUserLoggedIn);
    });
  }
}
