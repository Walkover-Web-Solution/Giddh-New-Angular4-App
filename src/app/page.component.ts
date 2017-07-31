import { Router, ActivatedRoute } from '@angular/router';
import { AppState } from './store/roots';
import { Store } from '@ngrx/store';
import { Component, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'page',
  template: `<div id="main">
    <app-header></app-header>
    <layout-main>
      <router-outlet></router-outlet>
    </layout-main>
    <app-footer></app-footer>
  </div>`
})
export class PageComponent implements AfterViewInit {
  // tslint:disable-next-line:no-empty
  constructor(private store: Store<AppState>, private router: Router, private activatedRoute: ActivatedRoute, private location: Location) {
  }
  public ngAfterViewInit() {
    if (this.location.path() === '/pages') {
      this.router.navigate(['/pages', 'home']);
    }
  }
}
