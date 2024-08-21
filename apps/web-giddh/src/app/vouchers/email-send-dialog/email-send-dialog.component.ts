import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { VoucherTypeEnum } from '../utility/vouchers.const';
import { VoucherComponentStore } from '../utility/vouchers.store';
import { Observable, ReplaySubject } from 'rxjs';
import { ToasterService } from '../../services/toaster.service';

@Component({
    selector: 'app-email-send-dialog',
    templateUrl: './email-send-dialog.component.html',
    styleUrls: ['./email-send-dialog.component.scss'],
    providers: [VoucherComponentStore]
})
export class EmailSendDialogComponent implements OnInit, OnDestroy {
    /** Holds invoice type */
    @Input() public invoiceType: any;
    /** Holds voucher type */
    @Input() public voucherType: string;
    /** Voucher data */
    @Input() selectedItem: any;
    /** Success event emitter */
    @Output() public successEvent: EventEmitter<any> = new EventEmitter<any>();
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Form Group for send email form */
    public sendEmailForm: FormGroup;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Send email in progress Observable */
    public sendEmailInProgress$: Observable<any> = this.componentStore.sendEmailInProgress$;
    /** Getter for copy type form array*/
    get copyTypes(): FormArray {
        return this.sendEmailForm.get('copyTypes') as FormArray;
    }

    constructor(
        private formBuilder: FormBuilder,
        private componentStore: VoucherComponentStore,
        private toasterService: ToasterService
    ) {

    }

    /**
     * Lifecycle hook for component init
     *
     * @memberof EmailSendDialogComponent
     */
    public ngOnInit(): void {
        this.initializeForm();

        if (this.selectedItem) {
            if (this.selectedItem.account?.email) {
                this.sendEmailForm.get('email.to').setValue(this.selectedItem.account.email);
            }
            this.sendEmailForm.get('uniqueName').setValue(this.selectedItem.uniqueName);
            this.sendEmailForm.get('voucherType').setValue(this.selectedItem.type);
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
            copyTypes: this.formBuilder.array(["Original"]),
            copyTypeOriginal: [true],
            copyTypeCustomer: [false],
            copyTypeTransport: [false],
            email: this.formBuilder.group({
                to: ['']
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
    public onCopyTypeChange(event: any, value: string): void {
        if (event?.checked) {
            this.copyTypes.push(this.formBuilder.control(value));
        } else {
            const index = this.copyTypes.controls.findIndex(copyType => copyType.value === value);
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
        if (!this.sendEmailForm.get('email.to').value) {
            this.toasterService.showSnackBar("error", this.localeData?.enter_valid_email_error);
            return;
        }

        if (!this.copyTypes?.value?.length && this.voucherType !== VoucherTypeEnum.purchaseOrder) {
            this.toasterService.showSnackBar("error", this.localeData?.select_invoice_copy);
            return;
        }

        if ([VoucherTypeEnum.estimate, VoucherTypeEnum.generateEstimate, VoucherTypeEnum.proforma, VoucherTypeEnum.generateProforma, VoucherTypeEnum.purchaseOrder].includes(this.selectedItem?.type ?? this.voucherType)) {
            this.successEvent.emit(this.sendEmailForm.get('email.to').value);
        } else {
            this.successEvent.emit({ email: this.sendEmailForm.get('email.to').value, invoiceType: this.copyTypes.value, uniqueName: this.selectedItem?.uniqueName });
        }
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
