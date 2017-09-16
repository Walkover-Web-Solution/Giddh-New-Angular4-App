import { CompanyActions } from './services/actions/company.actions';
import { LoginActions } from './services/actions/login.action';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { AppState } from './store/roots';
import { Store } from '@ngrx/store';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'page',
  template: `
    <div id="main">
      <app-header></app-header>
      <layout-main>
        <router-outlet></router-outlet>
      </layout-main>
      <app-footer></app-footer>
    </div>`
})
export class PageComponent implements AfterViewInit, OnInit, OnDestroy {
  // tslint:disable-next-line:no-empty
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(private comapnyActions: CompanyActions, private store: Store<AppState>, private router: Router, private activatedRoute: ActivatedRoute, private location: Location) {
  }

  public ngOnInit() {
    // this.store.dispatch(this.comapnyActions.RefreshCompanies());
  }

  public ngAfterViewInit() {
    // if (this.location.path() === '/pages') {
    //   this.router.navigate(['/pages', 'home']);
    // }
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
