import { Router, ActivatedRoute } from '@angular/router';
import { AppState } from './store/roots';
import { Store } from '@ngrx/store';
import { Component, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'page',
  template: `
  <div id="main">
  <app-header></app-header>
    <layout-main>
      <router-outlet></router-outlet>
    </layout-main>
     <app-footer></app-footer>
    </div>
   `
})
export class PageComponent implements AfterViewInit {
  // tslint:disable-next-line:no-empty
  constructor(private store: Store<AppState>, private router: Router, private activatedRoute: ActivatedRoute, private location: Location) {
  }
  public ngAfterViewInit() {
    // this.store.select(p => p.session.companyUniqueName).delay(2000).distinctUntilChanged().subscribe((companyName) => {
    //   debugger;
    //   if (this.activatedRoute.children && this.activatedRoute.children.length > 0) {

    //     debugger;
    //     this.router.navigateByUrl('/dummy', { skipLocationChange: true });
    //     this.activatedRoute.firstChild.url.take(1).subscribe(p => {
    //       debugger;
    //       if (p.length > 0) {
    //         setTimeout(() => {
    //           this.router.navigate([p[0].path], { queryParams: p[0].parameters });
    //         }, 1000);
    //       }
    //       console.log(p);
    //     });

    //   }
    // });
  }
}
