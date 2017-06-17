import { Component } from '@angular/core';

@Component({
   selector: 'body',
   template: `
    <router-outlet></router-outlet>
   `
})
export class PageComponent  {
    // tslint:disable-next-line:no-empty
    constructor() {
    }
}
