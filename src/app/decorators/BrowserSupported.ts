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
    let ua = window.navigator.userAgent;
    let browserSupport = true;
    ua = ua.toLowerCase();
    console.log('userAgent...', ua);
    let checkMSIE = 'MSIE';
    let  checkTreident = 'Trident';
    let msie = ua.indexOf( checkMSIE.toLowerCase() ||   checkTreident.toLowerCase());
    if (msie > 0) {
      browserSupport = false;

      console.log('msie index...', msie);
      this._router.navigate(['/browser-support']);
    }
    return browserSupport;
  }
}
