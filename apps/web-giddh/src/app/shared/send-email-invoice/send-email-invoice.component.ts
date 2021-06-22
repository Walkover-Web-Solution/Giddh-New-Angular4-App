import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VoucherTypeEnum } from '../../models/api-models/Sales';

@Component({
    selector: 'app-send-email-invoice-component',
    templateUrl: './send-email-invoice.component.html',
    styleUrls: ['./send-email-invoice.component.scss']
})

export class SendEmailInvoiceComponent implements OnInit {
    @Input() voucherType: VoucherTypeEnum;
    @Input() selectedItem: { voucherNumber: string, uniqueName: string, account: { email: string } };
    @Output() public successEvent: EventEmitter<any> = new EventEmitter<any>();
    @Output() public cancelEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
    public emailAddresses: string = '';
    public invoiceType: string[] = ['Original'];
    public isTransport: boolean = false;
    public isCustomer: boolean = false;
    public activeTab: string = 'email';
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True, when original copy is to be downloaded */
    public isOriginal: boolean = true;

    constructor() {
    }

    ngOnInit() {
        if (this.selectedItem && this.selectedItem.account && this.selectedItem.account.email) {
            this.emailAddresses = this.selectedItem.account.email;
        }
    }

    invoiceTypeChanged(event) {
        let val = event.target.value;
        if (event.target.checked) {
            this.invoiceType.push(val);
        } else {
            this.invoiceType = this.invoiceType.filter(f => f !== val);
        }
    }

    sendEmail() {
        if ([VoucherTypeEnum.estimate, VoucherTypeEnum.generateEstimate, VoucherTypeEnum.proforma, VoucherTypeEnum.generateProforma].includes(this.voucherType)) {
            this.successEvent.emit(this.emailAddresses);
        } else {
            this.successEvent.emit({ email: this.emailAddresses, invoiceType: this.invoiceType, invoiceNumber: this.selectedItem.voucherNumber });
        }
        this.cancel();
    }

    cancel() {
        this.cancelEvent.emit(true);
        this.resetModal();
    }

    resetModal() {
        if (this.selectedItem && this.selectedItem.account && this.selectedItem.account.email) {
            this.emailAddresses = this.selectedItem.account.email;
        }
        this.invoiceType = [];
        this.isTransport = false;
        this.isCustomer = false;
    }
}
