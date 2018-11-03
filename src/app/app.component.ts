import { ActivatedRoute, NavigationEnd, Router, NavigationStart } from '@angular/router';
/**
 * Angular 2 decorators and services
 */
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from './store/roots';
import { GeneralService } from './services/general.service';
import { pick } from './lodash-optimized';
import { VersionCheckService } from './version-check.service';

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
    <div id="loader-1" *ngIf="!IAmLoaded" class="giddh-spinner vertical-center-spinner"></div>
    <router-outlet></router-outlet>
  `,
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements AfterViewInit, OnInit {
  public IAmLoaded: boolean = false;
  private newVersionAvailableForWebApp: boolean = false;

  constructor(private store: Store<AppState>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _generalService: GeneralService,
    private _cdr: ChangeDetectorRef,
    private _versionCheckService: VersionCheckService) {

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
    this._generalService.IAmLoaded.subscribe(s => {
      this.IAmLoaded = s;
    });

  }

  public ngOnInit() {
    // Need to implement for Web app only
    if (!AppUrl.includes('localapp.giddh.com') && !isElectron) {
      this._versionCheckService.initVersionCheck(AppUrl + 'app/version.json');

      this._versionCheckService.onVersionChange$.subscribe((isChanged: boolean) => {
        if (isChanged) {
          this.newVersionAvailableForWebApp = _.clone(isChanged);
        }
      });
    }
  }

  public ngAfterViewInit() {

    this._generalService.IAmLoaded.next(true);
    this._cdr.detectChanges();
    this.router.events.subscribe((evt) => {
      if ((evt instanceof NavigationStart) && this.newVersionAvailableForWebApp && !isElectron) {
        return window.location.reload(true);
      }
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
