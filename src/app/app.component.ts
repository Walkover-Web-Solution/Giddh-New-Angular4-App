import { Router, ActivatedRoute } from '@angular/router';
/**
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit
} from '@angular/core';
import { Location } from '@angular/common';

import { Observable } from 'rxjs/Observable';

import { Store } from '@ngrx/store';
import { AppState } from './store/roots';
import { ROUTES } from './app.routes';

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
      <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-K2L9QG"
       height="0" width="0" style="display:none;visibility:hidden"></iframe>
    </noscript>
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit, AfterViewInit {
  // tslint:disable-next-line:no-empty
  constructor(private store: Store<AppState>, private router: Router, private activatedRoute: ActivatedRoute, private location: Location) {

  }

  // tslint:disable-next-line:no-empty
  public ngOnInit() { }
  public ngAfterViewInit() {
    this.store.select(p => p.session).distinctUntilKeyChanged('companyUniqueName').subscribe((company) => {
      if (company && company.companyUniqueName && company.companyUniqueName !== '') {
        if (company.lastState && company.lastState !== '') {
          this.router.navigateByUrl('/dummy', { skipLocationChange: true }).then(() => {
            if (ROUTES.findIndex(p => p.path.split('/')[0] === company.lastState.split('/')[0]) > -1) {
              this.router.navigate([company.lastState]);
            } else {
              this.router.navigate(['home']);
            }
          });
        } else {
          // debugger;
          if (this.activatedRoute.children && this.activatedRoute.children.length > 0) {
            if (this.activatedRoute.firstChild.children && this.activatedRoute.firstChild.children.length > 0) {
              let path = [];
              let parament = {};
              this.activatedRoute.firstChild.firstChild.url.subscribe(p => {
                if (p.length > 0) {
                  path = [p[0].path];
                  parament = { queryParams: p[0].parameters };
                }
              });
              if (path.length > 0 && parament) {
                this.router.navigateByUrl('/dummy', { skipLocationChange: true }).then(() => {
                  if (ROUTES.findIndex(p => p.path.split('/')[0] === path[0].split('/')[0]) > -1) {
                    this.router.navigate([path[0]], parament);
                  } else {
                    this.router.navigate(['home']);
                  }
                });
              }
            }
          }
        }
      }
    });
  }

}

/**
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
