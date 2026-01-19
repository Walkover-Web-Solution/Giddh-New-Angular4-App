import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ILedgersInvoiceResult } from '../../models/api-models/Invoice';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'delete-voucher-confirmation-modal',
    templateUrl: './delete-voucher-confirmation-modal.component.html',
    standalone: false
})
/**
 * DeleteVoucherConfirmationModalComponent component
 * Handles deletevoucherconfirmationmodal functionality and user interactions
 */
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

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor() {

    }

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof DeleteVoucherConfirmationModalComponent
     */
    public translationComplete(event: any): void {
        /**
         * Handles if functionality
         */
        if (event) {
            this.localeData?.confirmation_messages?.map(c => {
                this.confirmationMessages[c.module] = c;
            });
            this.translationLoaded = true;
        }
    }

    /**
     * Handles confirmation event
     */
    public onConfirmation() {
        this.confirmDeleteEvent.emit(true);
    }

    /**
     * Handles cancel event
     */
    public onCancel() {
        this.closeModelEvent.emit(true);
    }
}
