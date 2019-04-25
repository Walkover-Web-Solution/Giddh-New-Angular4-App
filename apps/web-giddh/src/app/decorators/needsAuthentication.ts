import { map } from 'rxjs/operators';
import { AppState } from '../store';
import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { userLoginStateEnum } from '../store/authentication/authentication.reducer';

@Injectable()
export class NeedsAuthentication implements CanActivate {
  constructor(public _router: Router, private store: Store<AppState>) {
  }

  public canActivate() {
    return this.store.select(p => p.session.userLoginState).pipe(map(p => {
      if (p === userLoginStateEnum.newUserLoggedIn) {
        this._router.navigate(['/new-user']);
      }
      if (p === userLoginStateEnum.notLoggedIn) {
        console.log('NeedsAuthentication');
        this._router.navigate(['/login']);
      }
      // console.log(userLoginStateEnum.userLoggedIn);
      // console.log('from nedd authentication' + (p === userLoginStateEnum.userLoggedIn));
      return p === userLoginStateEnum.userLoggedIn;
    }));
  }
}
