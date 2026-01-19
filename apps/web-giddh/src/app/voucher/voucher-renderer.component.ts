import { Component } from '@angular/core';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'voucher-renderer-component',
    template: `<router-outlet></router-outlet>`,
    standalone:false
})

/**
 * VoucherRendererComponent component
 * Handles voucherrenderer functionality and user interactions
 */
export class VoucherRendererComponent {
    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
    }
}
