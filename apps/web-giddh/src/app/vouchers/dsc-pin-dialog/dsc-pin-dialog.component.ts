import { ChangeDetectorRef, Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { EMPTY, Observable, ReplaySubject, takeUntil } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { IOption } from '../../app.constant';
import { DscCertificate, DscService } from '../../services/dsc.service';
import { DscPinDuration, DscPinStorageService } from '../../services/dsc-pin-storage.service';
import { ToasterService } from '../../services/toaster.service';
import { VoucherTypeEnum } from '../utility/vouchers.const';

/** Data required to open the DSC PIN dialog. */
export interface DscPinDialogData {
    /** Voucher object (must contain uniqueName and voucher/estimate/proforma number). */
    voucher: any;
    /** Voucher type expected by the DSC signing API. */
    voucherType: string;
}

/** Stage of the signing flow the dialog is currently blocked on, used to pick the progress message. */
export type DscSigningStage = 'verifying_device' | 'verifying_pin' | 'preparing' | 'signing' | null;

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
    /** Whether to remember the PIN in this browser */
    public rememberPin: boolean = false;
    /** Reactive form control for the chosen retention duration of the remembered PIN. */
    public rememberDurationControl: FormControl<string | null> = new FormControl<string | null>('15m');
    /** True when a remembered PIN exists for the selected certificate */
    public hasSavedPin: boolean = false;
    /** Duration options rendered in the retention dropdown */
    public durationOptions: IOption[] = [];
    /** Current signing stage (null when not signing); drives the busy overlay message */
    public signingStage: DscSigningStage = null;
    /** True when the current PIN was auto-filled from storage (used to forget on failure) */
    private usedRememberedPin: boolean = false;
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    /** Pending duration from a remembered PIN, applied once locale/options are ready. */
    private pendingRememberDuration: DscPinDuration | null = null;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: DscPinDialogData,
        public dialogRef: MatDialogRef<DscPinDialogComponent>,
        private dscService: DscService,
        private dscPinStorage: DscPinStorageService,
        private changeDetectorRef: ChangeDetectorRef,
        private toasterService: ToasterService
    ) {
        this.voucher = data.voucher;
        this.voucherType = data.voucherType;
    }

    /**
     * True while the dialog is blocked on any long-running step (reading certificates
     * or signing) and should show a spinner instead of the form.
     *
     * @returns {boolean}
     * @memberof DscPinDialogComponent
     */
    public get isBusy(): boolean {
        return this.isDscCertificateLoading || this.signingStage !== null;
    }

    /**
     * Locale message describing what the dialog is currently waiting on, so the user
     * understands the reason for the wait instead of seeing a frozen dialog.
     *
     * @returns {string}
     * @memberof DscPinDialogComponent
     */
    public get progressMessage(): string {
        if (this.isDscCertificateLoading) {
            return this.localeData?.loading_certificates;
        }
        switch (this.signingStage) {
            case 'verifying_device':
                return this.localeData?.verifying_device;
            case 'verifying_pin':
                return this.localeData?.verifying_pin;
            case 'preparing':
                return this.localeData?.preparing_pdf;
            case 'signing':
                return this.localeData?.signing_pdf;
            default:
                return '';
        }
    }

    /**
     * Lifecycle hook: reads cached certificate list immediately (localStorage or parent
     * preload) so the dialog opens quickly. If the parent preload is still in flight,
     * the list updates automatically when the real response arrives.
     *
     * @memberof DscPinDialogComponent
     */
    public ngOnInit(): void {
        console.info('[DSC Dialog] ngOnInit - loading cached certificate list');
        this.loadCertificates(false);
    }

    /**
     * Stores locale data and builds the duration dropdown options once translations are available.
     *
     * @param {*} localeData
     * @memberof DscPinDialogComponent
     */
    public setLocaleData(localeData: any): void {
        this.localeData = localeData;
        this.durationOptions = this.buildDurationOptions();
        const currentValue = this.rememberDurationControl.value;
        if (!this.durationOptions.some((option) => option.value === currentValue)) {
            this.rememberDurationControl.setValue(this.durationOptions[0]?.value || '15m', { emitEvent: false });
        }
        if (this.pendingRememberDuration && this.durationOptions.some((option) => option.value === this.pendingRememberDuration)) {
            this.rememberDurationControl.setValue(this.pendingRememberDuration, { emitEvent: false });
            this.pendingRememberDuration = null;
        }
    }

    /**
     * Builds IOption list for the remember-PIN duration dropdown using translated labels.
     *
     * @private
     * @returns {IOption[]}
     * @memberof DscPinDialogComponent
     */
    private buildDurationOptions(): IOption[] {
        const keys: DscPinDuration[] = ['15m', '2h', '1d', '7d', 'permanent'];
        return keys.map((key) => ({
            value: key,
            label: this.localeData?.[`remember_duration_${key}`]
        }));
    }

    /**
     * Reads certificates from the DSC token via the bridge extension.
     *
     * @private
     * @param {boolean} [force=false] Force a fresh token read (bypasses the cache)
     * @memberof DscPinDialogComponent
     */
    private loadCertificates(force: boolean = false): void {
        this.dscPin = '';
        this.dscPinError = '';
        this.isDscCertificateLoading = true;
        if (force) {
            this.dscService.clearCertificatesCache();
        }

        const read$ = force ? this.dscService.syncCertificates() : this.dscService.getCachedCertificates();
        read$.pipe(
            takeUntil(this.destroyed$)
        ).subscribe({
            next: (certificates) => {
                console.info('[DSC Dialog] Certificate read loaded certificates:', certificates.length);
                this.dscCertificates = certificates;
                this.selectedDscCertificateIndex = certificates.length ? 0 : null;
                this.isDscCertificateLoading = false;
                this.applyRememberedPin();
                this.changeDetectorRef.detectChanges();
            },
            error: (error) => {
                console.error('[DSC Dialog] Certificate read failed:', error?.message);
                this.isDscCertificateLoading = false;
                this.dscService.clearCertificatesCache();
                this.dscCertificates = [];
                this.selectedDscCertificateIndex = null;
                this.dscPinError = error?.message || this.localeData?.device_not_connected;
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    /**
     * Auto-fills the PIN for the selected certificate from encrypted storage when a
     * valid, same-device entry exists. The user still clicks Confirm to proceed.
     *
     * @private
     * @memberof DscPinDialogComponent
     */
    private applyRememberedPin(): void {
        const certificate = this.getSelectedCertificate();
        console.info('[DSC Dialog] applyRememberedPin for certificate:', certificate?.certId);
        this.dscPin = '';
        this.usedRememberedPin = false;
        this.hasSavedPin = false;
        this.pendingRememberDuration = null;
        if (!certificate) {
            this.applyRememberDuration('15m');
            return;
        }
        this.dscPinStorage.getPin(certificate).then((result) => {
            if (result) {
                console.info('[DSC Dialog] Remembered PIN auto-filled for certificate:', certificate.certId, 'duration:', result.duration);
                this.dscPin = result.pin;
                this.usedRememberedPin = true;
                this.hasSavedPin = true;
                this.rememberPin = true;
                this.applyRememberDuration(result.duration);
                this.changeDetectorRef.detectChanges();
            } else {
                console.info('[DSC Dialog] No remembered PIN found for certificate:', certificate.certId);
                this.rememberPin = false;
                this.applyRememberDuration('15m');
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    /**
     * Sets the duration dropdown to the value stored with the remembered PIN.
     * If the options are not ready yet, the value is queued and applied when they are.
     *
     * @private
     * @param {DscPinDuration} duration
     * @memberof DscPinDialogComponent
     */
    private applyRememberDuration(duration: DscPinDuration): void {
        if (this.durationOptions.length && this.durationOptions.some((option) => option.value === duration)) {
            this.rememberDurationControl.setValue(duration, { emitEvent: false });
            this.pendingRememberDuration = null;
        } else {
            this.pendingRememberDuration = duration;
        }
    }

    /**
     * Returns the currently selected certificate, or null.
     *
     * @private
     * @returns {(DscCertificate | null)}
     * @memberof DscPinDialogComponent
     */
    private getSelectedCertificate(): DscCertificate | null {
        if (this.selectedDscCertificateIndex === null) {
            return null;
        }
        return this.dscCertificates[this.selectedDscCertificateIndex] || null;
    }

    /**
     * Sets the selected DSC certificate index and refreshes any remembered PIN.
     *
     * @param {number} index Index of the selected certificate
     * @memberof DscPinDialogComponent
     */
    public selectDscCertificate(index: number): void {
        const certificate = this.dscCertificates[index];
        console.info('[DSC Dialog] Certificate selected:', { index, subjectCn: certificate?.subjectCn, serial: certificate?.serial, certId: certificate?.certId });
        this.selectedDscCertificateIndex = index;
        this.dscPinError = '';
        this.applyRememberedPin();
    }

    /**
     * Forces a fresh certificate read from the token (manual refresh).
     *
     * @memberof DscPinDialogComponent
     */
    public refreshCertificates(): void {
        this.loadCertificates(true);
    }

    /**
     * Removes the remembered PIN for the selected certificate.
     *
     * @memberof DscPinDialogComponent
     */
    public forgetSavedPin(): void {
        const certificate = this.getSelectedCertificate();
        console.info('[DSC Dialog] Forgetting saved PIN for certificate:', certificate?.certId);
        if (!certificate) {
            return;
        }
        this.dscPinStorage.forgetPin(certificate);
        this.dscPin = '';
        this.rememberPin = false;
        this.hasSavedPin = false;
        this.usedRememberedPin = false;
        this.changeDetectorRef.detectChanges();
    }

    /**
     * Called whenever the PIN input value changes. Once the user edits an auto-filled
     * remembered PIN it is no longer considered the verified stored PIN, so the next
     * submit must run the dummy-hash PIN verification.
     *
     * @memberof DscPinDialogComponent
     */
    public onDscPinChange(): void {
        if (this.usedRememberedPin) {
            console.info('[DSC Dialog] PIN edited by user - marking as non-remembered');
            this.usedRememberedPin = false;
        }
    }

    /**
     * Starts the DSC signing flow. Before calling any API the selected certificate is
     * re-read from the token to make sure the device is still plugged in. If it is not,
     * the list is updated and the user is asked to insert the token - no server API is
     * called in that case.
     *
     * PIN verification is skipped when the current PIN value is the unmodified one that
     * was auto-filled from encrypted storage. If the user edited the PIN, or entered a
     * new one, the dummy-hash verification runs first.
     *
     * @memberof DscPinDialogComponent
     */
    public submitDscPin(): void {
        const certificate = this.getSelectedCertificate();
        console.info('[DSC Dialog] Confirm clicked. Selected certificate:', { subjectCn: certificate?.subjectCn, serial: certificate?.serial, certId: certificate?.certId });
        if (!this.dscPin || !certificate || !this.voucher || this.isBusy) {
            return;
        }
        this.dscPinError = '';
        this.signingStage = 'verifying_device';

        this.dscService.syncCertificates().pipe(
            takeUntil(this.destroyed$),
            switchMap((certificates) => {
                const stillConnected = certificates.some((cert) => cert.certId === certificate.certId);
                if (!stillConnected) {
                    console.info('[DSC Dialog] Selected device not connected. Available certificates:', certificates.length);
                    this.signingStage = null;
                    this.dscCertificates = certificates;
                    this.selectedDscCertificateIndex = certificates.length ? 0 : null;
                    this.applyRememberedPin();
                    this.dscPinError = this.localeData?.device_not_connected;
                    this.changeDetectorRef.detectChanges();
                    return EMPTY;
                }

                if (this.usedRememberedPin) {
                    console.info('[DSC Dialog] Device connected and remembered PIN is unchanged. Skipping dummy PIN verification.');
                    this.signingStage = 'preparing';
                    this.changeDetectorRef.detectChanges();
                    return this.runSigning(certificate);
                }

                console.info('[DSC Dialog] Selected device is connected. Proceeding to PIN verification.');
                this.signingStage = 'verifying_pin';
                this.changeDetectorRef.detectChanges();
                return this.dscService.verifyPin(certificate, this.dscPin).pipe(
                    switchMap(() => {
                        if (this.rememberPin) {
                            this.dscPinStorage.savePin(certificate, this.dscPin, this.rememberDurationControl.value as DscPinDuration);
                        } else {
                            this.dscPinStorage.forgetPin(certificate);
                        }
                        return this.runSigning(certificate);
                    }),
                    catchError((error) => {
                        this.signingStage = null;
                        this.dscPin = '';
                        this.dscPinError = this.localeData?.incorrect_pin || error?.message;
                        this.changeDetectorRef.detectChanges();
                        return EMPTY;
                    })
                );
            })
        ).subscribe({
            error: () => {
                this.signingStage = null;
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    /**
     * Runs the prepare/sign/finish flow for the selected certificate and returns the
     * signed PDF Blob. If the real token sign fails (wrong PIN / locked token), the
     * dialog stays open so the user can retry; prepare/finish failures are propagated.
     *
     * @private
     * @param {DscCertificate} certificate Selected DSC certificate
     * @returns {Observable<Blob>}
     * @memberof DscPinDialogComponent
     */
    private runSigning(certificate: DscCertificate): Observable<Blob> {
        const voucherDetails = {
            uniqueName: this.voucher?.uniqueName,
            voucherType: this.voucherType,
        };

        this.signingStage = 'preparing';
        console.info('[DSC Dialog] Signing stage: preparing PDF');
        this.changeDetectorRef.detectChanges();
        return this.dscService.prepareDscSigning(voucherDetails, certificate).pipe(
            takeUntil(this.destroyed$),
            switchMap((prepareResponse) => {
                this.signingStage = 'signing';
                console.info('[DSC Dialog] Signing stage: signing hash');
                this.changeDetectorRef.detectChanges();
                return this.dscService.signHash(prepareResponse.body.hash, certificate, this.dscPin).pipe(
                    switchMap((signature) => {
                        if (this.rememberPin) {
                            this.dscPinStorage.savePin(certificate, this.dscPin, this.rememberDurationControl.value as DscPinDuration);
                        } else {
                            this.dscPinStorage.forgetPin(certificate);
                        }
                        return this.dscService.finishDscSigning(prepareResponse.body.nonce, signature);
                    }),
                    catchError((error) => {
                        // Token sign failed -> almost certainly a PIN/session issue. Keep dialog open.
                        this.signingStage = null;
                        if (this.usedRememberedPin) {
                            this.dscPinStorage.forgetPin(certificate);
                            this.usedRememberedPin = false;
                            this.hasSavedPin = false;
                        }
                        this.dscPin = '';
                        this.dscPinError = this.localeData?.incorrect_pin || error?.message;
                        this.changeDetectorRef.detectChanges();
                        return EMPTY;
                    })
                );
            }),
            tap((pdfBlob: Blob) => {
                console.info('[DSC Dialog] Signing complete. PDF blob size:', pdfBlob.size);
                this.signingStage = null;
                this.closeDscPinDialog();
                let fileName = this.voucher?.voucherNumber || this.voucher?.number;
                if (this.voucherType === VoucherTypeEnum.generateEstimate || this.voucherType === VoucherTypeEnum.generateProforma) {
                    fileName = this.voucher?.proformaNumber || this.voucher?.estimateNumber || fileName;
                }
                this.downloadBlob(pdfBlob, `${fileName || 'signed-invoice'}.pdf`);
                this.toasterService.showSnackBar('success', this.localeData?.download_success);
            }),
            catchError((error) => {
                this.signingStage = null;
                const message = error?.message || '';
                this.closeDscPinDialog();
                this.toasterService.showSnackBar('error', message || this.localeData?.download_error);
                return EMPTY;
            })
        );
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
