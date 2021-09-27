import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class BrowserSupported implements CanActivate {
    constructor(public router: Router) {
    }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let ua = window.navigator.userAgent;
        let browserSupport = true;
        ua = ua.toLowerCase();

        let msie = ua.indexOf('MSIE ');
        let Trident = ua.indexOf('Trident');
        let Edge = ua.indexOf('Edge');

        if (msie > 0) {
            browserSupport = false;
            this.router.navigate(['/browser-support']);
        } else if (Trident > 0) {
            browserSupport = false;
            this.router.navigate(['/browser-support']);
        } else if (Edge > 0) {
            browserSupport = false;
            this.router.navigate(['/browser-support']);
        }
        return browserSupport;
    }
}
