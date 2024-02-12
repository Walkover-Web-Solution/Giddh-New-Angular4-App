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
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Form Group for send email form */
    public sendEmailForm: FormGroup;
    /** Getter for copy type form array*/
    get copyTypes(): FormArray {
        return this.sendEmailForm.get('copyTypes') as FormArray;
    }

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
    public onCopyTypeChange(event, value: string): void {
        if (event.checked) {
            this.copyTypes.push(this.formBuilder.control(value));
        } else {
            const index = this.copyTypes.controls.findIndex(x => x.value === value);
            if (index >= 0) {
                this.copyTypes.removeAt(index);
            }
        }
    }

    /**
     * This wil be use for send email
     *
     * @memberof EmailSendDialogComponent
     */
    public sendEmail(): void {
        console.log(this.sendEmailForm.value)
        if ([VoucherTypeEnum.estimate, VoucherTypeEnum.generateEstimate, VoucherTypeEnum.proforma, VoucherTypeEnum.generateProforma].includes(this.voucherType)) {
            this.successEvent.emit(this.sendEmailForm.get('email.to').value);
        } else {
            this.successEvent.emit({ email: this.sendEmailForm.get('email.to').value, invoiceType: this.sendEmailForm.get('copyTypes').value, uniqueName: this.selectedItem?.uniqueName });
        }
        this.cancel();
    }

    public cancel(): void {
        this.cancelEvent.emit(true);
    }
}
