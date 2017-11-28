import { CompanyActions } from '../actions/company.actions';
import { CompanyService } from '../services/companyService.service';
import { AppState } from '../store';
import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { userLoginStateEnum } from '../store/authentication/authentication.reducer';

@Injectable()
export class NeedsAuthentication implements CanActivate {
  constructor(public _router: Router, private store: Store<AppState>, private _companyService: CompanyService, private companyActions: CompanyActions) {
  }
  public canActivate() {
    return this.store.select(p => p.session.userLoginState).map(p => {
      if (p === userLoginStateEnum.newUserLoggedIn) {
        this._router.navigate(['/new-user']);
      }
      if (p === userLoginStateEnum.notLoggedIn) {
        this._router.navigate(['/login']);
      }
      // console.log('from nedd authentication' + (p === userLoginStateEnum.userLoggedIn));
      return p === userLoginStateEnum.userLoggedIn;
    });
  }
}
