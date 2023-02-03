import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PreviousInvoicesVm } from '../../../models/api-models/proforma';

@Component({
    selector: 'proforma-last-invoices-component',
    templateUrl: './proforma-last-invoices.component.html',
    styleUrls: [`./proforma-last-invoices.component.scss`]
})

export class ProformaLastInvoicesComponent {
    @Output() public invoiceSelected: EventEmitter<{ accountUniqueName: string, invoiceNo: string, uniqueName?: string }> = new EventEmitter();
    @Input() public data: PreviousInvoicesVm[] = [];

    constructor() {
    }

    onInvoiceSelected(item: PreviousInvoicesVm) {
        this.invoiceSelected.emit({ accountUniqueName: item.account?.uniqueName, invoiceNo: item.versionNumber, uniqueName: item?.uniqueName });
    }

    public clickInside(event) {
        event.preventDefault();
        event.stopPropagation();
    }
}
