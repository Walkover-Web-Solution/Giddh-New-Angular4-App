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
    // let checkMSIE = 'MSIE';
    // let  checkTreident = 'Trident';
    // let  checkEdge = 'Edge';
let chrom = ua.indexOf('chrom');
    let msie = ua.indexOf('msie');
    let Trident = ua.indexOf('trident');
    let Edge = ua.indexOf('edge');

    if (msie !== -1 || Trident !== -1 || Edge !== -1) {
      browserSupport = false;

      console.log('inside index...', msie, Trident, Edge);
      this._router.navigate(['/browser-support']);
    }
    return browserSupport;
  }
}
