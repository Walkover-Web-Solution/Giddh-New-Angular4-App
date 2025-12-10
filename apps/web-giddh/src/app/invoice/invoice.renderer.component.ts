import { Component } from '@angular/core';

@Component({
    selector: 'invoice.renderer',
    templateUrl: './invoice.renderer.component.html',
standalone: false,
    template: `
    <router-outlet></router-outlet>
  `
})

export class InvoiceRendererComponent {
    constructor() {
        
    }
}
