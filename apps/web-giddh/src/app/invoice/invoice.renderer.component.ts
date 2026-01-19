import { Component } from '@angular/core';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'name',
    template: `
    <router-outlet></router-outlet>
  `,
    standalone:false
})

/**
 * InvoiceRendererComponent component
 * Handles invoicerenderer functionality and user interactions
 */
export class InvoiceRendererComponent {
    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor() {

    }
}
