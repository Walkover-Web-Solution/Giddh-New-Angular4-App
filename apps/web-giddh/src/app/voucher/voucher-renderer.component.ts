import { Component } from '@angular/core';

@Component({
    selector: 'voucher-renderer-component',
    template: `<router-outlet></router-outlet>`,
    standalone:false
})

export class VoucherRendererComponent {
    constructor() {
    }
}
