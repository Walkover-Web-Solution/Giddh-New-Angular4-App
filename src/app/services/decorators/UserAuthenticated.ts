import { VerifyEmailResponseModel } from '../../models/api-models/loginModels';
import { AppState } from '../../store/roots';
import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

@Injectable()
export class UserAuthenticated implements CanActivate {
  private user: VerifyEmailResponseModel;
  constructor(public _router: Router, private store: Store<AppState>) {
  }
  public canActivate() {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user;
      }
    });
    if (this.user && this.user.session && this.user.session.id) {
      console.log('Request is authorized, redirect to Home Component!');
      // this._auth.Authorize();
      this._router.navigate(['/home']);
    } else {
      return true;
    }
  }
}
