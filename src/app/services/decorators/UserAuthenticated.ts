import { AppState } from '../../store/roots';
import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { userLoginStateEnum } from '../../store/authentication/authentication.reducer';
import { ROUTES } from '../../app.routes';

@Injectable()
export class UserAuthenticated implements CanActivate {
  constructor(public _router: Router, private store: Store<AppState>) {
  }

  public canActivate() {
    return this.store.select(p => p).distinctUntilChanged((x: AppState, y: AppState) => {
      return x.session.companyUniqueName !== y.session.companyUniqueName;
    }).map(p => {
      if (p.login.userLoginState === userLoginStateEnum.userLoggedIn) {
        if (ROUTES.findIndex(q => q.path.split('/')[0] === p.session.lastState.split('/')[0]) > -1) {
          this._router.navigate([p.session.lastState]);
        } else {
          this._router.navigate(['home']);
        }
      }
      if (p.login.userLoginState === userLoginStateEnum.newUserLoggedIn) {
        this._router.navigate(['/new-user']);
      }
      return !(p.login.userLoginState === userLoginStateEnum.userLoggedIn || p.login.userLoginState === userLoginStateEnum.newUserLoggedIn);
    });
  }
}
