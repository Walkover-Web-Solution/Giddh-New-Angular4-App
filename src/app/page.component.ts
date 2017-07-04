import { Component } from '@angular/core';

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
export class PageComponent {
  // tslint:disable-next-line:no-empty
  constructor() {
  }
}
