import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ILedgersInvoiceResult } from '../../models/api-models/Invoice';

@Component({
    selector: 'delete-voucher-confirmation-modal',
    templateUrl: './delete-voucher-confirmation-modal.component.html'
})
export class DeleteVoucherConfirmationModalComponent {
    /* Taking module name as input to show confirmation message based on module */
    @Input() public module: string = '';
    @Input() public selectedInvoiceForDelete: ILedgersInvoiceResult;
    @Output() public confirmDeleteEvent: EventEmitter<boolean> = new EventEmitter(true);
    @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);

    public confirmationMessages: any[] = [];
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if translations loaded */
    public translationLoaded: boolean = false;

    constructor() {

    }

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof DeleteVoucherConfirmationModalComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.localeData?.confirmation_messages?.map(c => {
                this.confirmationMessages[c.module] = c;
            });
            this.translationLoaded = true;
        }
    }

    public onConfirmation() {
        this.confirmDeleteEvent.emit(true);
    }

    public onCancel() {
        this.closeModelEvent.emit(true);
    }
}