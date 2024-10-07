import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, ReplaySubject, takeUntil } from 'rxjs';
import { VoucherTypeEnum } from '../utility/vouchers.const';
import { saveAs } from 'file-saver';
import { GeneralService } from '../../services/general.service';
import { VoucherComponentStore } from '../utility/vouchers.store';
import { InvoicePreviewDetailsVm } from '../../models/api-models/Invoice';

@Component({
    selector: 'download-voucher',
    templateUrl: './download-voucher.component.html',
    styleUrls: ['./download-voucher.component.scss'],
    providers: [VoucherComponentStore]
})
export class DownloadVoucherComponent implements OnInit, OnDestroy {
    /** Last vouchers get in progress Observable */
    public isVoucherFileDownloading$: Observable<any> = this.componentStore.isVoucherFileDownloading$;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Form Group Instance */
    public downloadForm: FormGroup;
    /** Holds true if voucher type is Proforma or Estimates */
    public isProformaEstimatesInvoice: boolean = false;
    /** Hold current voucher details */
    public selectedItem: InvoicePreviewDetailsVm;
    /** Holds Voucher type */
    public voucherType: any;
    /** Holds List of invoice type */
    public invoiceType: string[] = ['Original'];
    /** Holds to API Model to send */
    public dataToSend: any = {};
    /** Hold Download file type */
    public fileType: "base64" | "pdf";

    constructor(
        @Inject(MAT_DIALOG_DATA) public inputData,
        public dialogRef: MatDialogRef<any>,
        private formBuilder: FormBuilder,
        private generalService: GeneralService,
        private componentStore: VoucherComponentStore
    ) { }

    /**
     * Initializes the component
     *
     * @memberof DownloadVoucherComponent
     */
    public ngOnInit(): void {
        if (this.inputData) {
            this.localeData = this.inputData.localeData;
            this.commonLocaleData = this.inputData.commonLocaleData;
            this.selectedItem = this.inputData.selectedItem;
            this.voucherType = this.inputData.voucherType;
            this.isProformaEstimatesInvoice = [VoucherTypeEnum.estimate, VoucherTypeEnum.generateEstimate, VoucherTypeEnum.proforma, VoucherTypeEnum.generateProforma].includes(this.voucherType);
        }
        this.downloadForm = this.formBuilder.group({
            isOriginal: [true],
            isTransport: [null],
            isCustomer: [null],
            isAttachment: [null]
        });

        this.componentStore.downloadVoucherFileResponse$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                let voucherNumber = (this.selectedItem?.voucherNumber) ? this.selectedItem?.voucherNumber : this.commonLocaleData?.app_not_available;
                if (this.dataToSend.copyTypes?.length > 1 || this.downloadForm?.get('isAttachment').value) {
                    if (this.fileType === "base64") {
                        saveAs((this.generalService.base64ToBlob(response?.attachments[0]?.encodedData, '', 512)), response?.attachments[0]?.name);
                    } else {
                        saveAs(response, `${voucherNumber}.` + 'zip');
                    }
                } else {
                    saveAs(response, `${voucherNumber}.` + 'pdf');
                }
                this.dialogRef.close();
            }
        });
    }

    /**
     * Handle Invoice Type Changed
     *
     * @param {*} event
     * @memberof DownloadVoucherComponent
     */
    public invoiceTypeChanged(event: any, controlName: string): void {
        let value = event.source.value;
        if (event?.checked) {
            this.invoiceType.push(value);
        } else {
            this.invoiceType = this.invoiceType?.filter(item => item !== value);
        }
    }

    /**
     * Download Vouchers API Call
     *
     * @return {*}  {void}
     * @memberof DownloadVoucherComponent
     */
    public downloadVouchers(): void {
        let voucherType = this.selectedItem && this.selectedItem.voucherType === VoucherTypeEnum.cash ? VoucherTypeEnum.sales : this.selectedItem?.voucherType;

        this.dataToSend = {
            copyTypes: this.invoiceType,
            voucherType: voucherType,
            uniqueName: this.selectedItem?.uniqueName
        };

        let downloadOption = "";
        this.fileType = "pdf";
        if (this.downloadForm?.get('isAttachment').value) {
            if (this.invoiceType?.length > 0) {
                downloadOption = "ALL";
            } else {
                downloadOption = "ATTACHMENT";
                this.fileType = "base64";
            }
        } else {
            downloadOption = "VOUCHER";
        }
        this.componentStore.downloadVoucherPdf({ model: this.dataToSend, type: downloadOption, fileType: this.fileType, voucherType: this.voucherType, isDownloadFromDialog: true });
    }

    /**
     * Lifecycle hook for destroy
     *
     * @memberof DownloadVoucherComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
