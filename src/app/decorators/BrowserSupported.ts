import { AppState } from '../store';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { userLoginStateEnum } from '../store/authentication/authentication.reducer';
import { ROUTES } from '../app.routes';

@Injectable()
export class BrowserSupported implements CanActivate {
  constructor(public _router: Router, private store: Store<AppState>) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    var ua = window.navigator.userAgent;
    var browserSupport = true;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
      browserSupport = false;
      this._router.navigate(['/browser-support']);
    }
    return browserSupport;
  }
}
