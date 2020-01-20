import { Component, Input } from '@angular/core';
import { GstReconcileInvoiceDetails } from '../../../models/api-models/GstReconcile';

@Component({
    selector: 'reconcileDesign',
    templateUrl: './reconcileDesign.component.html'
})

export class ReconcileDesignComponent {
    @Input() public data: GstReconcileInvoiceDetails = null;
}
