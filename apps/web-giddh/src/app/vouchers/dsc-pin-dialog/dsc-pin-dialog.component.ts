import { ChangeDetectorRef, Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReplaySubject, takeUntil } from 'rxjs';
import { DscCertificate, DscService } from '../../services/dsc.service';
import { ToasterService } from '../../services/toaster.service';
import { VoucherTypeEnum } from '../utility/vouchers.const';

/** Data required to open the DSC PIN dialog. */
export interface DscPinDialogData {
    /** Voucher object (must contain uniqueName and voucher/estimate/proforma number). */
    voucher: any;
    /** Voucher type expected by the DSC signing API. */
    voucherType: string;
    /** Local locale data containing dsc_pin_dialog keys. */
    localeData: any;
    /** Common locale data for cancel/confirm labels. */
    commonLocaleData: any;
}

/**
 * Dialog component that lets the user select a DSC certificate, enter the token PIN,
 * and download the digitally signed invoice PDF.
 *
 * @export
 * @class DscPinDialogComponent
 */
@Component({
    selector: 'app-dsc-pin-dialog',
    templateUrl: './dsc-pin-dialog.component.html',
    styleUrls: ['./dsc-pin-dialog.component.scss'],
    standalone: false
})
export class DscPinDialogComponent implements OnDestroy {
    /** Local locale data */
    public localeData: any;
    /** Common locale data */
    public commonLocaleData: any;
    /** Current voucher being signed */
    public voucher: any;
    /** Voucher type forwarded to the signing API */
    public voucherType: string;
    /** List of certificates read from the token */
    public dscCertificates: DscCertificate[] = [];
    /** Index of the currently selected certificate */
    public selectedDscCertificateIndex: number | null = null;
    /** Token PIN entered by the user */
    public dscPin: string = '';
    /** Validation or error message for the PIN field */
    public dscPinError: string = '';
    /** True while certificates are being read from the token */
    public isDscCertificateLoading: boolean = false;
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: DscPinDialogData,
        public dialogRef: MatDialogRef<DscPinDialogComponent>,
        private dscService: DscService,
        private changeDetectorRef: ChangeDetectorRef,
        private toasterService: ToasterService
    ) {
        this.localeData = data.localeData;
        this.commonLocaleData = data.commonLocaleData;
        this.voucher = data.voucher;
        this.voucherType = data.voucherType;
    }

    /**
     * Lifecycle hook: loads available DSC certificates when the dialog opens.
     *
     * @memberof DscPinDialogComponent
     */
    public ngOnInit(): void {
        this.loadCertificates();
    }

    /**
     * Reads certificates from the DSC token via the bridge extension.
     *
     * @private
     * @memberof DscPinDialogComponent
     */
    private loadCertificates(): void {
        this.dscPin = '';
        this.dscPinError = '';
        this.dscCertificates = [];
        this.selectedDscCertificateIndex = null;
        this.isDscCertificateLoading = true;

        this.dscService.getCertificates().pipe(
            takeUntil(this.destroyed$)
        ).subscribe({
            next: (certificates) => {
                this.dscCertificates = certificates;
                this.selectedDscCertificateIndex = certificates.length ? 0 : null;
                this.isDscCertificateLoading = false;
                this.changeDetectorRef.detectChanges();
            },
            error: (error) => {
                this.isDscCertificateLoading = false;
                this.changeDetectorRef.detectChanges();
                this.dscPinError = error?.message;
            }
        });
    }

    /**
     * Sets the selected DSC certificate index.
     *
     * @param {number} index Index of the selected certificate
     * @memberof DscPinDialogComponent
     */
    public selectDscCertificate(index: number): void {
        this.selectedDscCertificateIndex = index;
    }

    /**
     * Submits the entered PIN and triggers the full DSC signing flow.
     *
     * @memberof DscPinDialogComponent
     */
    public submitDscPin(): void {
        if (!this.dscPin || this.selectedDscCertificateIndex === null || !this.voucher) {
            return;
        }
        this.dscPinError = '';
        const certificate = this.dscCertificates[this.selectedDscCertificateIndex];
        const voucherDetails = {
            uniqueName: this.voucher?.uniqueName,
            voucherType: this.voucherType,
        };

        this.dscService.downloadSignedInvoice(voucherDetails, certificate, this.dscPin).pipe(
            takeUntil(this.destroyed$)
        ).subscribe({
            next: (pdfBlob: Blob) => {
                console.log('[DSC DEBUG] downloadSignedInvoice success, blob size:', pdfBlob?.size);
                this.closeDscPinDialog();
                let fileName = this.voucher?.voucherNumber || this.voucher?.number;
                if (this.voucherType === VoucherTypeEnum.generateEstimate || this.voucherType === VoucherTypeEnum.generateProforma) {
                    fileName = this.voucher?.proformaNumber || this.voucher?.estimateNumber || fileName;
                }
                this.downloadBlob(pdfBlob, `${fileName || 'signed-invoice'}.pdf`);
                this.toasterService.showSnackBar('success', this.localeData?.dsc_pin_dialog?.download_success);
            },
            error: (error) => {
                console.error('[DSC DEBUG] downloadSignedInvoice error:', error);
                const message = error?.message || '';
                if (message.toLowerCase().includes('incorrect pin')) {
                    this.dscPinError = this.localeData?.dsc_pin_dialog?.incorrect_pin;
                    this.dscPin = '';
                } else {
                    this.closeDscPinDialog();
                    this.toasterService.showSnackBar('error', message || this.localeData?.dsc_pin_dialog?.download_error);
                }
            }
        });
    }

    /**
     * Closes the DSC PIN dialog and resets its state.
     *
     * @memberof DscPinDialogComponent
     */
    public closeDscPinDialog(): void {
        this.dialogRef.close();
    }

    /**
     * Triggers browser download for a Blob with the given file name.
     *
     * @private
     * @param {Blob} blob The file Blob to download
     * @param {string} fileName The name to save the downloaded file as
     * @memberof DscPinDialogComponent
     */
    private downloadBlob(blob: Blob, fileName: string): void {
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = fileName;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        window.URL.revokeObjectURL(url);
    }

    /**
     * Lifecycle hook for destroy
     *
     * @memberof DscPinDialogComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
