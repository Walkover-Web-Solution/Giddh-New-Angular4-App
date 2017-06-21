import { VerifyEmailResponseModel } from '../../models/api-models/loginModels';
import { AppState } from '../../store/roots';
import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Store } from '@ngrx/store';

@Injectable()
export class NeedsAuthentication implements CanActivate {
  private user: VerifyEmailResponseModel;
  constructor(public _router: Router, private store: Store<AppState>, ) {
    this.store.select(state => {
      this.user = state.login.user;
    });
  }
  public canActivate() {

    if (this.user && this.user.authKey) {
      return true;
    }
    console.log('Request is unauthorized, redirect to Login Component!');
    // this._auth.Authorize();
    this._router.navigate(['/login']);
  }
}
