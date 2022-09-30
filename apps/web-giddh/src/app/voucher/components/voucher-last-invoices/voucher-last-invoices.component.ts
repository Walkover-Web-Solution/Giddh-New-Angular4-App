import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PreviousInvoicesVm } from '../../../models/api-models/proforma';

@Component({
    selector: 'voucher-last-invoices-component',
    templateUrl: './voucher-last-invoices.component.html',
    styleUrls: [`./voucher-last-invoices.component.scss`]
})

export class VoucherLastInvoicesComponent {
    @Output() public invoiceSelected: EventEmitter<{ accountUniqueName: string, invoiceNo: string, uniqueName?: string }> = new EventEmitter();
    @Input() public data: PreviousInvoicesVm[] = [];

    constructor() {
    }

    onInvoiceSelected(item: PreviousInvoicesVm) {
        this.invoiceSelected.emit({ accountUniqueName: item.account?.uniqueName, invoiceNo: item.versionNumber, uniqueName: item.uniqueName });
    }

    public clickInside(event) {
        event.preventDefault();
        event.stopPropagation();
    }
}
