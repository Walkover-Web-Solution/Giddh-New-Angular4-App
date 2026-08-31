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

/** Certificate list item rendered in the dialog; `connected` reflects the latest token read. */
export interface DscCertificateItem extends DscCertificate {
    /** False when the certificate only exists in the cache and was not found in the latest token read. */
    connected: boolean;
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
    /** List of certificates rendered in the dialog (cached + freshly read, with connection state) */
    public dscCertificates: DscCertificateItem[] = [];
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
    /** Duration options rendered in the retention dropdown */
    public durationOptions: IOption[] = [];
    /** Current signing stage (null when not signing); drives the busy overlay message */
    public signingStage: DscSigningStage = null;
    /** True when the current PIN was auto-filled from storage (used to forget on failure) */
    private usedRememberedPin: boolean = false;
    /** Exact PIN value auto-filled from storage; distinguishes a real user edit from the ngModel echo fired when the value is written programmatically */
    private rememberedPinValue: string | null = null;
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
     * Lifecycle hook: renders the cached certificate list immediately so the dialog opens
     * instantly, then refreshes the list from the token in the background.
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
        const keys: DscPinDuration[] = ['15m', '2h', '1d', '7d', '30d'];
        return keys.map((key) => ({
            value: key,
            label: this.localeData?.[`remember_duration_${key}`]
        }));
    }

    /**
     * Renders the cached certificate list immediately (no spinner when a cache exists).
     * When a token read already completed in this session (parent preload or a previous
     * sync), its result is reused directly - the token is not read again. When a preload
     * is still in flight, the dialog joins that same in-flight read instead of starting
     * a duplicate one. Only when no read has happened yet does the dialog trigger the
     * token read itself. The spinner is only shown when there is no cached device at all.
     *
     * @private
     * @param {boolean} [force=false] Force a fresh token read (bypasses the cache)
     * @memberof DscPinDialogComponent
     */
    private loadCertificates(force: boolean = false): void {
        this.dscPinError = '';
        if (force) {
            this.dscService.clearCertificatesCache();
        }
        const previousCertificate = this.getSelectedCertificate();
        const cached = force ? [] : this.dscService.getCachedCertificatesSnapshot();
        this.dscCertificates = cached.map((certificate) => ({ ...certificate, connected: true }));
        this.isDscCertificateLoading = cached.length === 0;
        this.updateSelection(previousCertificate, previousCertificate);

        if (!force && this.dscService.hasCompletedCertificateSync()) {
            // A token read already completed (parent preload) - reuse its result instead
            // of reading the token again.
            console.info('[DSC Dialog] Reusing completed certificate read. Success:', this.dscService.wasLastCertificateSyncSuccessful());
            if (!this.dscService.wasLastCertificateSyncSuccessful()) {
                this.applyFailedReadState(this.dscService.getCertificateSyncError());
            }
            this.isDscCertificateLoading = false;
            this.changeDetectorRef.detectChanges();
            return;
        }

        this.dscService.syncCertificates().pipe(
            takeUntil(this.destroyed$)
        ).subscribe({
            next: (certificates) => {
                console.info('[DSC Dialog] Background certificate read completed:', certificates.length);
                const selectedCertificate = this.getSelectedCertificate();
                const disconnected = this.dscCertificates
                    .filter((certificate) => !certificates.some((fresh) => this.isSameCertificate(fresh, certificate)))
                    .map((certificate) => ({ ...certificate, connected: false }));
                this.dscCertificates = [
                    ...certificates.map((certificate) => ({ ...certificate, connected: true })),
                    ...disconnected
                ];
                this.isDscCertificateLoading = false;
                this.updateSelection(selectedCertificate, selectedCertificate);
                this.changeDetectorRef.detectChanges();
            },
            error: (error) => {
                console.error('[DSC Dialog] Background certificate read failed:', error?.message);
                this.isDscCertificateLoading = false;
                this.applyFailedReadState(error?.message);
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    /**
     * Applies the UI state for a failed token read: cached certificates are marked as
     * not connected, or an error message is shown when nothing was cached.
     *
     * @private
     * @param {(string | null | undefined)} message Error message from the failed read
     * @memberof DscPinDialogComponent
     */
    private applyFailedReadState(message: string | null | undefined): void {
        if (this.dscCertificates.length) {
            this.dscCertificates = this.dscCertificates.map((certificate) => ({ ...certificate, connected: false }));
            this.selectedDscCertificateIndex = null;
            this.dscPin = '';
            this.usedRememberedPin = false;
            this.rememberedPinValue = null;
        } else {
            this.selectedDscCertificateIndex = null;
            this.dscPinError = message || this.localeData?.device_not_connected;
        }
    }

    /**
     * True when two certificates refer to the same physical token certificate. Matching
     * prefers the serial because Windows enumerations can return different certIds
     * (CSP provider path casing) for the same certificate across reads.
     *
     * @private
     * @param {(DscCertificate | null)} a First certificate
     * @param {(DscCertificate | null)} b Second certificate
     * @returns {boolean}
     * @memberof DscPinDialogComponent
     */
    private isSameCertificate(a: DscCertificate | null, b: DscCertificate | null): boolean {
        if (!a || !b) {
            return false;
        }
        if (a.serial && b.serial) {
            return a.serial === b.serial;
        }
        return a.certId === b.certId;
    }

    /**
     * Selects the certificate matching the preferred certificate when it is connected,
     * otherwise the first connected certificate. Only re-applies the remembered PIN
     * when the effective selection changed, so a PIN typed before the background read
     * completed is never wiped.
     *
     * @private
     * @param {(DscCertificate | null)} preferredCertificate Cert to keep selected when possible
     * @param {(DscCertificate | null)} previousCertificate Previously selected cert used for change detection
     * @memberof DscPinDialogComponent
     */
    private updateSelection(preferredCertificate: DscCertificate | null, previousCertificate: DscCertificate | null): void {
        let nextIndex = preferredCertificate
            ? this.dscCertificates.findIndex((certificate) => certificate.connected && this.isSameCertificate(certificate, preferredCertificate))
            : -1;
        if (nextIndex < 0) {
            nextIndex = this.dscCertificates.findIndex((certificate) => certificate.connected);
        }
        this.selectedDscCertificateIndex = nextIndex >= 0 ? nextIndex : null;
        const nextCertificate = this.getSelectedCertificate();
        const unchanged = nextCertificate && previousCertificate
            ? this.isSameCertificate(nextCertificate, previousCertificate)
            : nextCertificate === previousCertificate;
        if (!unchanged) {
            this.applyRememberedPin();
        }
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
        this.rememberedPinValue = null;
        this.pendingRememberDuration = null;
        if (!certificate) {
            this.applyRememberDuration('15m');
            return;
        }
        this.dscPinStorage.getPin(certificate).then((result) => {
            if (result) {
                console.info('[DSC Dialog] Remembered PIN auto-filled for certificate:', certificate.certId, 'duration:', result.duration);
                this.dscPin = result.pin;
                this.rememberedPinValue = result.pin;
                this.usedRememberedPin = true;
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
     * @returns {(DscCertificateItem | null)}
     * @memberof DscPinDialogComponent
     */
    private getSelectedCertificate(): DscCertificateItem | null {
        if (this.selectedDscCertificateIndex === null) {
            return null;
        }
        return this.dscCertificates[this.selectedDscCertificateIndex] || null;
    }

    /**
     * Sets the selected DSC certificate index and refreshes any remembered PIN.
     * Disconnected (cached-only) certificates cannot be selected.
     *
     * @param {number} index Index of the selected certificate
     * @memberof DscPinDialogComponent
     */
    public selectDscCertificate(index: number): void {
        const certificate = this.dscCertificates[index];
        if (!certificate?.connected) {
            return;
        }
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
     * Called whenever the PIN input value changes. Only a real user edit (value differs
     * from the auto-filled remembered PIN) marks the PIN as non-remembered - the
     * programmatic auto-fill also fires ngModelChange through the input-field's
     * writeValue, and that echo must be ignored.
     *
     * @memberof DscPinDialogComponent
     */
    public onDscPinChange(): void {
        if (this.usedRememberedPin && this.dscPin !== this.rememberedPinValue) {
            console.info('[DSC Dialog] PIN edited by user - marking as non-remembered');
            this.usedRememberedPin = false;
        }
    }

    /**
     * Starts the DSC signing flow.
     *
     * When the current PIN is the unmodified one auto-filled from encrypted storage, it was
     * already verified when saved, so the token certificate re-read and the dummy-hash PIN
     * verification are skipped entirely - signing proceeds with the cached certificate data
     * and the device is only used to sign the real hash.
     *
     * For a new or edited PIN the certificate is first re-read from the token to make sure
     * the device is still plugged in (no server API is called when it is not), followed by
     * the dummy-hash PIN verification.
     *
     * @memberof DscPinDialogComponent
     */
    public submitDscPin(): void {
        const certificate = this.getSelectedCertificate();
        console.info('[DSC Dialog] Confirm clicked. Selected certificate:', { subjectCn: certificate?.subjectCn, serial: certificate?.serial, certId: certificate?.certId });
        if (!this.dscPin || !certificate || !certificate.connected || !this.voucher || this.isBusy) {
            return;
        }
        this.dscPinError = '';

        if (!this.rememberPin) {
            // Confirmed with the remember toggle off -> forget the saved PIN for this certificate.
            this.dscPinStorage.forgetPin(certificate);
        }

        if (this.usedRememberedPin && this.dscPin === this.rememberedPinValue) {
            console.info('[DSC Dialog] Remembered PIN unchanged. Signing directly with cached certificate - skipping device re-read and dummy PIN verification.');
            this.runSigning(certificate).pipe(
                takeUntil(this.destroyed$)
            ).subscribe();
            return;
        }

        this.signingStage = 'verifying_device';

        this.dscService.syncCertificates().pipe(
            takeUntil(this.destroyed$),
            switchMap((certificates) => {
                // Match by serial: Windows enumerations can return a different certId
                // (provider path casing) for the same token on every read.
                const freshCertificate = certificates.find((cert) => this.isSameCertificate(cert, certificate));
                if (!freshCertificate) {
                    console.info('[DSC Dialog] Selected device not connected. Available certificates:', certificates.length);
                    this.signingStage = null;
                    this.dscCertificates = certificates.map((cert) => ({ ...cert, connected: true }));
                    this.selectedDscCertificateIndex = certificates.length ? 0 : null;
                    this.applyRememberedPin();
                    this.dscPinError = this.localeData?.device_not_connected;
                    this.changeDetectorRef.detectChanges();
                    return EMPTY;
                }

                console.info('[DSC Dialog] Selected device is connected. Proceeding to PIN verification.');
                this.signingStage = 'verifying_pin';
                this.changeDetectorRef.detectChanges();
                return this.dscService.verifyPin(freshCertificate, this.dscPin).pipe(
                    switchMap(() => {
                        if (this.rememberPin) {
                            this.dscPinStorage.savePin(freshCertificate, this.dscPin, this.rememberDurationControl.value as DscPinDuration);
                        } else {
                            this.dscPinStorage.forgetPin(freshCertificate);
                        }
                        return this.runSigning(freshCertificate);
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
                        // The PIN is deliberately NOT re-saved here. Saving already happened
                        // after verifyPin for a new/edited PIN, and re-saving on every sign
                        // would reset the expiry clock so the remembered PIN never expires.
                        return this.dscService.finishDscSigning(prepareResponse.body.nonce, signature);
                    }),
                    catchError((error) => {
                        // Token sign failed -> wrong PIN, locked token or device unplugged. Keep dialog open
                        // and show the bridge error verbatim (e.g. "Device not connected").
                        this.signingStage = null;
                        if (this.usedRememberedPin) {
                            this.dscPinStorage.forgetPin(certificate);
                            this.usedRememberedPin = false;
                            this.rememberedPinValue = null;
                        }
                        this.dscPin = '';
                        this.dscPinError = error?.message || this.localeData?.incorrect_pin;
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
