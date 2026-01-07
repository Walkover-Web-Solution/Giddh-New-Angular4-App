import { Component } from '@angular/core';

@Component({
    selector: 'name',
    template: `
    <router-outlet></router-outlet>
  `,
    standalone:false
})

export class InvoiceRendererComponent {
    constructor() {

    }
}
