import { Component } from '@angular/core';

@Component({
  selector: 'page',
  template: `
    <layout-main>
      <router-outlet></router-outlet>
    </layout-main>
   `
})
export class PageComponent {
  // tslint:disable-next-line:no-empty
  constructor() {
  }
}
