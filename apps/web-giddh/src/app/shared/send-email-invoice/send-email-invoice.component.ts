import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VoucherTypeEnum } from '../../models/api-models/Sales';
import { GeneralService } from '../../services/general.service';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'app-send-email-invoice-component',
    templateUrl: './send-email-invoice.component.html',
    styleUrls: ['./send-email-invoice.component.scss'],
    standalone: false
})

/**
 * SendEmailInvoiceComponent component
 * Handles sendemailinvoice functionality and user interactions
 */
export class SendEmailInvoiceComponent implements OnInit {
    @Input() voucherType: VoucherTypeEnum;
    @Input() selectedItem: { voucherNumber: string, uniqueName: string, account: { email: string }, voucherUniqueName?: string };
    @Output() public successEvent: EventEmitter<any> = new EventEmitter<any>();
    @Output() public cancelEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
    public emailAddresses: string = '';
    public invoiceType: string[] = [];
    public isTransport: boolean = false;
    public isCustomer: boolean = false;
    public activeTab: string = 'email';
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True, when original copy is to be downloaded */
    public isOriginal: boolean = true;
    /** Stores the voucher API version of current company */
    public voucherApiVersion: number;
    /** Receipt voucher type constant */
    public receiptVoucherType = VoucherTypeEnum.receipt;
    /** Payment voucher type constant */
    public paymentVoucherType = VoucherTypeEnum.payment;
    /** Download copy options array */
    public downloadCopy: string[] = ['Original'];

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private generalService: GeneralService
    ) {
    }

    /**
     * Handles ngOnInit functionality
     */
    ngOnInit() {
        this.voucherApiVersion = this.generalService.voucherApiVersion;

        /**
         * Handles if functionality
         */
        if (this.voucherApiVersion === 2) {
            this.invoiceType.push('Original');
        }

        /**
         * Handles if functionality
         */
        if (this.selectedItem && this.selectedItem.account && this.selectedItem.account.email) {
            this.emailAddresses = this.selectedItem.account.email;
        }
    }

    /**
     * This will use for invoice type changes
     *
     * @param {*} event
     * @memberof SendEmailInvoiceComponent
     */
    public invoiceTypeChanged(event): void {
        let value = event?.source?.value;
        /**
         * Handles if functionality
         */
        if (event?.checked) {
            this.invoiceType.push(value);
        } else {
            this.invoiceType = this.invoiceType?.filter(response => response !== value);
        }
    }

    /**
     * Handles sendEmail functionality
     */
    sendEmail() {
        /**
         * Handles if functionality
         */
        if ([VoucherTypeEnum.estimate, VoucherTypeEnum.generateEstimate, VoucherTypeEnum.proforma, VoucherTypeEnum.generateProforma].includes(this.voucherType)) {
            this.successEvent.emit(this.emailAddresses);
        } else {
            /**
             * Handles if functionality
             */
            if (this.voucherApiVersion === 2) {
                this.successEvent.emit({ email: this.emailAddresses, invoiceType: this.invoiceType, uniqueName: this.selectedItem?.uniqueName });
            } else {
                this.successEvent.emit({ email: this.emailAddresses, invoiceType: this.invoiceType, invoiceNumber: this.selectedItem.voucherNumber });
            }
        }
        this.cancel();
    }

    /**
     * Handles cancel functionality
     */
    cancel() {
        this.cancelEvent.emit(true);
        this.resetModal();
    }

    /**
     * Resets modal to default state
     */
    resetModal() {
        /**
         * Handles if functionality
         */
        if (this.selectedItem && this.selectedItem.account && this.selectedItem.account.email) {
            this.emailAddresses = this.selectedItem.account.email;
        }
        this.invoiceType = [];
        this.isTransport = false;
        this.isCustomer = false;
    }
}
