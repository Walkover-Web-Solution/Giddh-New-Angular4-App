import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
/**
 * Angular 2 decorators and services
 */
import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from './store/roots';
import { GeneralService } from './services/general.service';
import { pick } from './lodash-optimized';
import { BehaviorSubject } from 'rxjs';

/**
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'body',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css'
  ],
  template: `
    <noscript>
      <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-K2L9QG" height="0" width="0" style="display:none;visibility:hidden"></iframe>
    </noscript>
    <div id="loader-1" *ngIf="!(IAmLoaded | async)" class="giddh-spinner vertical-center-spinner"></div>
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements AfterViewInit {
  public IAmLoaded: BehaviorSubject<boolean>;

  constructor(private store: Store<AppState>, private router: Router, private activatedRoute: ActivatedRoute, private _generalService: GeneralService) {
    this.store.select(s => s.session).subscribe(ss => {
      if (ss.user && ss.user.session && ss.user.session.id) {
        let a = pick(ss.user, ['isNewUser']);
        a.isNewUser = true;
        this._generalService.user = {...ss.user.user, ...a};
        if (ss.user.statusCode !== 'AUTHENTICATE_TWO_WAY') {
          this._generalService.sessionId = ss.user.session.id;
        }
      } else {
        this._generalService.user = null;
        this._generalService.sessionId = null;
      }
      this._generalService.companyUniqueName = ss.companyUniqueName;
    });
    this.IAmLoaded = this._generalService.IAmLoaded;
  }

  public ngAfterViewInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    if (location.href.includes('returnUrl')) {
      let tUrl = location.href.split('=');
      if (tUrl[1]) {
        if (!isElectron) {
          this.router.navigate([tUrl[1]]);
        }
      }
    }
  }

}
