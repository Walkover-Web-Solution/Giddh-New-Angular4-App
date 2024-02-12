import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VoucherTypeEnum } from '../utility/vouchers.const';

@Component({
  selector: 'app-email-send-dialog',
  templateUrl: './email-send-dialog.component.html',
  styleUrls: ['./email-send-dialog.component.scss']
})
export class EmailSendDialogComponent implements OnInit {
  @Input() voucherType: VoucherTypeEnum;
  @Input() selectedItem: { voucherNumber: string, uniqueName: string, account: { email: string }, voucherUniqueName?: string };
  @Output() public successEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() public cancelEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  public isTransport: boolean = false;
  public isCustomer: boolean = false;
  public activeTab: string = 'email';
  /* This will hold local JSON data */
  public localeData: any = {};
  /* This will hold common JSON data */
  public commonLocaleData: any = {};
  /** True, when original copy is to be downloaded */
  public isOriginal: boolean = true;
  /** Form Group for send email form */
  public sendEmailForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  public ngOnInit(): void {
    this.initializeForm();
    if (this.selectedItem && this.selectedItem.account && this.selectedItem.account.email) {
      this.sendEmailForm.get('email.to').setValue(this.selectedItem.account.email);
    }

  }

  /**
  * Initializes send email form
  *
  * @private
  * @memberof EmailSendDialogComponent
  */
  private initializeForm(): void {
    this.sendEmailForm = this.formBuilder.group({
      copyTypes: this.formBuilder.array([['Original']]),
      email: this.formBuilder.group({
        to: this.formBuilder.array([]),
      }),
      uniqueName: [''],
      voucherType: ['']
    });
  }

  /**
  * This will use for invoice type changes
  *
  * @param {*} event
  * @memberof SendEmailInvoiceComponent
  */
  public invoiceTypeChanged(event): void {
    let value = event?.source?.value;
    if (event?.checked) {
      const toControl = this.sendEmailForm.get('email.to') as FormArray;
      toControl.push(value);
    } else {
      //this.invoiceType = this.invoiceType?.filter(response => response !== value);
    }
  }

  sendEmail() {
    if ([VoucherTypeEnum.estimate, VoucherTypeEnum.generateEstimate, VoucherTypeEnum.proforma, VoucherTypeEnum.generateProforma].includes(this.voucherType)) {
      this.successEvent.emit(this.sendEmailForm.get('email.to').value);
    } else {
      this.successEvent.emit({ email: this.sendEmailForm.get('email.to').value, invoiceType: this.sendEmailForm.get('invoiceType').value, uniqueName: this.selectedItem?.uniqueName });
    }
    this.cancel();
  }

  cancel() {
    this.cancelEvent.emit(true);
    // this.resetModal();
  }
}
