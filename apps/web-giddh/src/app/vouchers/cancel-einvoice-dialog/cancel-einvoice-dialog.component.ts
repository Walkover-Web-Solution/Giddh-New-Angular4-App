import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VoucherComponentStore } from '../utility/vouchers.store';
import { Observable, ReplaySubject, takeUntil } from 'rxjs';
import { IOption } from '../../theme/ng-select/option.interface';


@Component({
    selector: 'cancel-einvoice-dialog',
    templateUrl: './cancel-einvoice-dialog.component.html',
    styleUrls: ['./cancel-einvoice-dialog.component.scss'],
    providers: [VoucherComponentStore]
})
export class CancelEInvoiceDialogComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holds cancel EInvoice Voucher is in progress Observable */
    public cancelEInvoiceInProgress$: Observable<any> = this.componentStore.cancelEInvoiceInProgress$;
    /** Holds Bulk Update Form */
    public eInvoiceCancelForm: FormGroup;
    /** Holds Invoice Details */
    public selectedEInvoice: any;
    /** Holds EInvoice Cancellation Reason Options Array */
    public eInvoiceCancellationReasonOptions: IOption[] = [];
    /** Holds Voucher Type */
    public voucherType: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) public inputData,
        public dialogRef: MatDialogRef<any>,
        private formBuilder: FormBuilder,
        private componentStore: VoucherComponentStore,
    ) { }

    /**
     * Initializes the component
     *
     * @memberof CancelEInvoiceDialogComponent
     */
    public ngOnInit(): void {
        this.localeData = this.inputData?.localeData;
        this.commonLocaleData = this.inputData?.commonLocaleData;
        this.selectedEInvoice = this.inputData.selectedEInvoice;
        this.voucherType = this.inputData.voucherType;

        this.eInvoiceCancelForm = this.formBuilder.group({
            cancellationReason: [''],
            cancellationRemarks: ['']
        });

        this.eInvoiceCancellationReasonOptions = [
            { label: this.localeData?.cancel_e_invoice_reasons?.duplicate, value: '1' },
            { label: this.localeData?.cancel_e_invoice_reasons?.data_entry_mistake, value: '2' },
            { label: this.localeData?.cancel_e_invoice_reasons?.order_cancelled, value: '3' },
            { label: this.localeData?.cancel_e_invoice_reasons?.other, value: '4' }
        ];

        this.componentStore.cancelEInvoiceIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.dialogRef.close();
            }
        });
    }

    /**
     * Submit EInvoice Cancellation form
     *
     * @memberof CancelEInvoiceDialogComponent
     */
    public submitEInvoiceCancellation(): void {
        const eInvoiceCancelForm = this.eInvoiceCancelForm.value;

        if (eInvoiceCancelForm) {
            const requestObject: any = {
                cnlRsn: eInvoiceCancelForm.cancellationReason,
                cnlRem: eInvoiceCancelForm.cancellationRemarks?.trim()
            };

            const postObject: any = {};
            postObject.uniqueName = this.selectedEInvoice?.uniqueName;
            postObject.voucherType = this.voucherType;
            requestObject.accountUniqueName = this.selectedEInvoice?.account?.uniqueName
            this.componentStore.cancelEInvoice({ getRequestObject: requestObject, postRequestObject: postObject });
        }
    }

    /**
    * Trims the cancellation remarks
    *
    * @memberof CancelEInvoiceDialogComponent
    */
    public handleBlurOnCancellationRemarks(): void {
        const cancellationRemarksControl = this.eInvoiceCancelForm?.get('cancellationRemarks');
        if (cancellationRemarksControl) {
            cancellationRemarksControl.patchValue(cancellationRemarksControl.value?.trim());
        }
    }


    /**
     * This hook will be use for component destroyed
     *
     * @memberof CancelEInvoiceDialogComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
