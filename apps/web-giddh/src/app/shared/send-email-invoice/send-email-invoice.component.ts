import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { VoucherTypeEnum } from '../../models/api-models/Sales';

@Component({
  selector: 'app-send-email-invoice-component',
  templateUrl: './send-email-invoice.component.html',
  styleUrls: ['./send-email-invoice.component.scss']
})

export class SendEmailInvoiceComponent implements OnInit, OnDestroy {
  @Input() voucherType: VoucherTypeEnum;
  @Output() public successEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() public cancelEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  public emailAddresses: string = '';
  public mobileNo: string;
  public invoiceType: string[] = [];
  public isTransport: boolean = false;
  public isCustomer: boolean = false;
  public activeTab: string = 'email';
  public showSmsTab: boolean = true;

  constructor() {
  }

  ngOnInit() {
    this.showSmsTab = (this.voucherType !== 'proforma' && this.voucherType !== 'proformas' && this.voucherType !== 'estimates' && this.voucherType !== 'estimate');
  }

  tabChanged() {
    this.resetModal();
  }

  invoiceTypeChanged(event) {
    let val = event.target.value;
    if (event.target.checked) {
      this.invoiceType.push(val);
    } else {
      this.invoiceType = this.invoiceType.filter(f => f !== val);
    }
  }

  send() {
    if (this.activeTab === 'email') {
      this.sendEmail();
    } else {
      this.sendSms();
    }
  }

  sendEmail() {
    if ([VoucherTypeEnum.estimate, VoucherTypeEnum.generateEstimate, VoucherTypeEnum.proforma, VoucherTypeEnum.generateProforma].includes(this.voucherType)) {
      this.successEvent.emit(this.emailAddresses);
    } else {
      this.successEvent.emit({email: this.emailAddresses, invoiceType: this.invoiceType});
    }
    this.cancel();
  }

  sendSms() {
    this.successEvent.emit({numbers: this.mobileNo, invoiceType: this.invoiceType});
  }

  cancel() {
    this.cancelEvent.emit(true);
    this.resetModal();
  }

  resetModal() {
    this.emailAddresses = '';
    this.mobileNo = '';
    this.invoiceType = [];
    this.isTransport = false;
    this.isCustomer = false;
  }

  ngOnDestroy(): void {
  }
}
