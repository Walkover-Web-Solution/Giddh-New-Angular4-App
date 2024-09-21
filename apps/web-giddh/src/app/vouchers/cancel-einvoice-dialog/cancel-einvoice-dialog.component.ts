import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { VoucherComponentStore } from '../utility/vouchers.store';
import { Observable, ReplaySubject, take, takeUntil } from 'rxjs';
import { CustomTemplateResponse } from '../../models/api-models/Invoice';
import { GeneralService } from '../../services/general.service';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { ToasterService } from '../../services/toaster.service';
import { ConfirmModalComponent } from '../../theme/new-confirm-modal/confirm-modal.component';
import { IOption } from '../../theme/ng-select/option.interface';
import { BULK_UPDATE_FIELDS } from '../../shared/helpers/purchaseOrderStatus';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import { WarehouseActions } from '../../settings/warehouse/action/warehouse.action';
import { SettingsUtilityService } from '../../settings/services/settings-utility.service';
import { C } from '@angular/cdk/keycodes';

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
    /** Holds Bulk Update Voucher in progress Observable */
    public bulkUpdateVoucherInProgress$: Observable<any> = this.componentStore.bulkUpdateVoucherInProgress$;
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
        if (!this.inputData) {
            return;
        }

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

        this.componentStore.cancelEInvoiceInProgress$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
            }
        });


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
        console.log("submitEInvoiceCancellation", this.eInvoiceCancelForm.value);
        const eInvoiceCancelForm = this.eInvoiceCancelForm.value;

        if (eInvoiceCancelForm) {
            const requestObject: any = {
                cnlRsn: eInvoiceCancelForm.cancellationReason,
                cnlRem: eInvoiceCancelForm.cancellationRemarks?.trim()
            };

            const postObject: any = {};
            // let apiCallObservable;

            postObject.uniqueName = this.selectedEInvoice?.uniqueName;
            postObject.voucherType = this.voucherType;

            requestObject.accountUniqueName = this.selectedEInvoice?.account?.uniqueName
            requestObject.voucherVersion = 2;

            // apiCallObservable = this._invoiceService.cancelEInvoiceV2(requestObject, postObject);
            this.componentStore.cancelEInvoice({ getRequestObject: requestObject, postRequestObject: postObject });

            // apiCallObservable.pipe(take(1)).subscribe(response => {
            //     this.getVoucher(this.isUniversalDateApplicable);
            //     if (response?.status === 'success') {
            //         this._toaster.successToast(response.body);

            //     } 
            //     // else if (response?.status === 'error') {
            //     //     this._toaster.errorToast(response.message, response.code);
            //     // }
            // });
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
            cancellationRemarksControl.patchValue(cancellationRemarksControl.value.trim());
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
