import { NavigationEnd, NavigationStart, Router } from '@angular/router';
/**
 * Angular 2 decorators and services
 */
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from './store/roots';
import { GeneralService } from './services/general.service';
import { pick } from './lodash-optimized';
import { VersionCheckService } from './version-check.service';
import { ReplaySubject } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {reassignNavigationalArray} from './models/defaultMenus'
import { DbService } from './services/db.service';
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
    <noscript *ngIf="isProdMode && !isElectron">
      <iframe [src]="tagManagerUrl"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>
    </noscript>
    <div id="loader-1" *ngIf="!IAmLoaded" class="giddh-spinner vertical-center-spinner"></div>
    <router-outlet></router-outlet>    
  `,
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements AfterViewInit, OnInit, OnDestroy {
// tslint:disable-next-line:no-empty

  public sideMenu: { isopen: boolean } = {isopen: true};
  public companyMenu: { isopen: boolean } = {isopen: false};
  public isProdMode: boolean = false;
  public isElectron: boolean = false;
  public tagManagerUrl: SafeUrl;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  public isMobileSite: boolean;

  public sidebarStatusChange(event) {
    this.sideMenu.isopen = event;
  }

  public sideBarStateChange(event: boolean) {
    this.sideMenu.isopen = event;

  }

  public IAmLoaded: boolean = false;
  private newVersionAvailableForWebApp: boolean = false;

  constructor(private store: Store<AppState>,
              private router: Router,
              private _generalService: GeneralService,
              private _cdr: ChangeDetectorRef,
              private _versionCheckService: VersionCheckService,
              private sanitizer: DomSanitizer,
              private dbServices :DbService
              // private comapnyActions: CompanyActions,
              // private activatedRoute: ActivatedRoute, 
              // private location: Location
  ) {
    this.isProdMode = AppUrl === 'https://giddh.com/';
    this.isElectron = isElectron;
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

    this.tagManagerUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.googletagmanager.com/ns.html?id=GTM-K2L9QG');

    this._generalService.isMobileSite.subscribe(s => {
      this.isMobileSite = s;
    });
  }


  public ngOnInit() {
    this.sideBarStateChange(true);
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

      if ((evt instanceof NavigationStart) && !isElectron) {
        if(!this.isMobileSite){
          if(window.location.href.startsWith('m.')){
            this.dbServices.clearAllData();
            reassignNavigationalArray(true);
            this._generalService.setIsMobileView(true);
          }else{
            reassignNavigationalArray(false);
          }
        }
        if(this.newVersionAvailableForWebApp){
          // need to save last state
          const redirectState = this.getLastStateFromUrl(evt.url);
          localStorage.setItem('lastState', redirectState);
          return window.location.reload(true);
        }
      }
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    const lastState = localStorage.getItem('lastState');

    if (lastState) {
      localStorage.removeItem('lastState');
      return this.router.navigate([lastState]);
    }

    if (location.href.includes('returnUrl')) {
      let tUrl = location.href.split('returnUrl=');
      if (tUrl[1]) {
        if (!isElectron) {
          this.router.navigate(['pages/' + tUrl[1]]);
        }
      }
    }
  }

  private getLastStateFromUrl(url: string): string {
    if (url) {
      if (url.includes('/pages/')) {
        return url.substr(url.lastIndexOf('/') + 1, url.length);
      } else if (url.includes('/ledger/') || url.includes('/invoice/')) {
        return url;
      }
    }
    return 'home';
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
