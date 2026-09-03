import { ChangeDetectorRef, Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { EMPTY, Observable, ReplaySubject, takeUntil } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { IOption, SUPPORTED_OPERATING_SYSTEMS, GIDDH_DSC_WINDOWS_APP_URL, GIDDH_DSC_MAC_APP_URL, GIDDH_DSC_LINUX_APP_URL } from '../../app.constant';
import { DscCertificate, DscService } from '../../services/dsc.service';
import { DscPinDuration, DscPinStorageService } from '../../services/dsc-pin-storage.service';
import { ToasterService } from '../../services/toaster.service';
import { GeneralService } from '../../services/general.service';
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
    public rememberPin: boolean = true;
    /** Reactive form control for the chosen retention duration of the remembered PIN. */
    public rememberDurationControl: FormControl<string | null> = new FormControl<string | null>('15m');
    /** Duration options rendered in the retention dropdown */
    public durationOptions: IOption[] = [];
    /** Current signing stage (null when not signing); drives the busy overlay message */
    public signingStage: DscSigningStage = null;
    /** True when the current error is a missing bridge extension, so a go-to-download action is offered. */
    public isExtensionMissing = false;
    /** True when the current error is a missing native host, so an OS-specific download action is offered. */
    public isNativeHostMissing = false;
    /** Detected operating system used to pick the native-host download link. */
    public dscOs: SUPPORTED_OPERATING_SYSTEMS | null = null;
    /** URL of the native-host installer matching the user's OS. */
    public dscDownloadUrl: string = '';
    /** Fallback installer URLs shown when the OS cannot be detected. */
    public dscWindowsAppUrl: string = GIDDH_DSC_WINDOWS_APP_URL;
    public dscMacAppUrl: string = GIDDH_DSC_MAC_APP_URL;
    public dscLinuxAppUrl: string = GIDDH_DSC_LINUX_APP_URL;
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
        private toasterService: ToasterService,
        private router: Router,
        private generalService: GeneralService
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
        if (this.isExtensionMissing) {
            this.dscPinError = this.localeData?.bridge_not_found || this.dscPinError;
        } else if (this.isNativeHostMissing) {
            this.dscPinError = this.localeData?.native_host_missing || this.dscPinError;
        } else if (this.dscPinError) {
            this.dscPinError = this.getFriendlyErrorMessage(this.dscPinError, 'generic_error');
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
        this.isExtensionMissing = false;
        this.isNativeHostMissing = false;
        this.dscOs = null;
        this.dscDownloadUrl = '';

        if (!this.dscService.isBridgeAvailable()) {
            console.info('[DSC Dialog] Bridge extension not available');
            this.dscCertificates = [];
            this.isExtensionMissing = true;
            this.isDscCertificateLoading = false;
            this.dscPinError = this.getFriendlyErrorMessage(null, 'bridge_not_found');
            this.changeDetectorRef.detectChanges();
            return;
        }

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
        this.isExtensionMissing = false;
        this.isNativeHostMissing = false;
        this.dscOs = null;
        this.dscDownloadUrl = '';

        if (this.dscCertificates.length) {
            this.dscCertificates = this.dscCertificates.map((certificate) => ({ ...certificate, connected: false }));
            this.selectedDscCertificateIndex = null;
            this.dscPin = '';
            this.usedRememberedPin = false;
            this.rememberedPinValue = null;
        } else {
            this.selectedDscCertificateIndex = null;
            this.dscPin = '';
            this.usedRememberedPin = false;
            this.rememberedPinValue = null;

            if (!this.dscService.isBridgeAvailable() || this.isBridgeNotAvailableError(message)) {
                this.isExtensionMissing = true;
                this.dscPinError = this.getFriendlyErrorMessage(message, 'bridge_not_found');
            } else if (this.isNativeHostError(message)) {
                this.isNativeHostMissing = true;
                this.dscPinError = this.getFriendlyErrorMessage(message, 'native_host_missing');
                this.setDscDownloadUrl();
            } else if (this.isDriverMissingError(message)) {
                this.dscPinError = this.getFriendlyErrorMessage(message, 'driver_missing');
            } else {
                this.dscPinError = this.getFriendlyErrorMessage(message, 'device_not_connected');
            }
        }
    }

    /**
     * Determines whether an error message indicates the Giddh DSC bridge extension is not present.
     *
     * @private
     * @param {(string | null | undefined)} message Error message to inspect
     * @returns {boolean}
     * @memberof DscPinDialogComponent
     */
    private isBridgeNotAvailableError(message: string | null | undefined): boolean {
        if (!message) {
            return false;
        }
        const normalized = message.toLowerCase();
        return (
            normalized.includes('bridge not available') ||
            normalized.includes('bridge not found') ||
            normalized.includes('giddh dsc bridge not detected')
        );
    }

    /**
     * Determines whether an error message indicates the native host application is missing
     * while the bridge extension itself is installed. This deliberately excludes token/driver
     * "not installed" messages so those are shown as driver issues instead.
     *
     * @private
     * @param {(string | null | undefined)} message Error message to inspect
     * @returns {boolean}
     * @memberof DscPinDialogComponent
     */
    private isNativeHostError(message: string | null | undefined): boolean {
        if (!message) {
            return false;
        }
        const normalized = message.toLowerCase();
        return (
            normalized.includes('native host') ||
            normalized.includes('native messaging host') ||
            normalized.includes('native application not found')
        );
    }

    /**
     * Determines whether an error message indicates a missing or broken token driver/CSP.
     *
     * @private
     * @param {(string | null | undefined)} message Error message to inspect
     * @returns {boolean}
     * @memberof DscPinDialogComponent
     */
    private isDriverMissingError(message: string | null | undefined): boolean {
        if (!message) {
            return false;
        }
        const normalized = message.toLowerCase();
        return (
            normalized.includes('driver') ||
            normalized.includes('dll') ||
            normalized.includes('.dll') ||
            normalized.includes('csp') ||
            normalized.includes('pkcs') ||
            normalized.includes('cryptoki') ||
            normalized.includes('no_token') ||
            normalized.includes('no token') ||
            /\bckr_/.test(normalized) ||
            /\bscard_/.test(normalized) ||
            /\b0x[0-9a-f]{6,}\b/.test(normalized)
        );
    }

    /**
     * Maps a raw extension/native-host error to a short, non-technical, translated message.
     * The raw message is always logged to the console; only the friendly text is returned.
     *
     * @private
     * @param {(string | null | undefined)} rawMessage Raw error from the bridge/extension/API
     * @param {string} fallbackKey Locale key to use when the error type cannot be determined
     * @returns {string}
     * @memberof DscPinDialogComponent
     */
    private getFriendlyErrorMessage(rawMessage: string | null | undefined, fallbackKey: string): string {
        if (rawMessage) {
            console.info('[DSC Dialog] Raw extension error (console only):', rawMessage);
        }

        if (!rawMessage) {
            return this.localeData?.[fallbackKey] || this.localeData?.generic_error || 'Something went wrong. Please try again.';
        }

        const normalized = rawMessage.toLowerCase();
        let key = fallbackKey;

        if (this.isBridgeNotAvailableError(rawMessage) || normalized.includes('giddh dsc bridge not detected')) {
            key = 'bridge_not_found';
        } else if (this.isNativeHostError(rawMessage)) {
            key = 'native_host_missing';
        } else if (normalized.includes('incorrect pin') || normalized.includes('wrong pin') || normalized.includes('invalid pin') || normalized.includes('pin incorrect')) {
            key = 'incorrect_pin';
        } else if (this.isDriverMissingError(rawMessage)) {
            key = 'driver_missing';
        } else if (normalized.includes('certificate') || normalized.includes('certificates')) {
            key = 'certificate_error';
        } else if (normalized.includes('sign') || normalized.includes('signature')) {
            key = 'signing_error';
        }

        return this.localeData?.[key] || this.localeData?.[fallbackKey] || this.localeData?.generic_error || 'Something went wrong. Please try again.';
    }

    /**
     * Sets the OS-specific native-host download URL based on the current operating system.
     *
     * @private
     * @memberof DscPinDialogComponent
     */
    private setDscDownloadUrl(): void {
        this.dscOs = this.generalService.getOperatingSystem();
        switch (this.dscOs) {
            case SUPPORTED_OPERATING_SYSTEMS.Windows:
                this.dscDownloadUrl = GIDDH_DSC_WINDOWS_APP_URL;
                break;
            case SUPPORTED_OPERATING_SYSTEMS.MacOS:
                this.dscDownloadUrl = GIDDH_DSC_MAC_APP_URL;
                break;
            case SUPPORTED_OPERATING_SYSTEMS.Linux:
                this.dscDownloadUrl = GIDDH_DSC_LINUX_APP_URL;
                break;
            default:
                this.dscDownloadUrl = '';
        }
    }

    /**
     * Closes the dialog and navigates to the DSC download page so the user can install
     * the missing native host.
     *
     * @memberof DscPinDialogComponent
     */
    public goToDownload(): void {
        this.dialogRef.close();
        this.router.navigate(['/download'], { queryParams: { module: 'dsc' } });
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
     * - Remembered PIN unchanged: sign directly (already verified when saved).
     * - New/edited PIN with Remember ON: re-read the token, dummy-hash verify the PIN,
     *   save it, then sign.
     * - New/edited PIN with Remember OFF: re-read the token, then sign directly
     *   without dummy-hash verification.
     *
     * @memberof DscPinDialogComponent
     */
    public submitDscPin(): void {
        const certificate = this.getSelectedCertificate();
        console.info('[DSC Dialog] Confirm clicked. Selected certificate:', { subjectCn: certificate?.subjectCn, serial: certificate?.serial, certId: certificate?.certId });

        if (!this.dscPin || !this.voucher || this.isBusy) {
            return;
        }
        if (!certificate) {
            this.dscPinError = this.getFriendlyErrorMessage(null, 'certificate_error');
            return;
        }
        if (!certificate.connected) {
            this.dscPinError = this.getFriendlyErrorMessage(null, 'device_not_connected');
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
                    this.dscPinError = this.getFriendlyErrorMessage(null, 'device_not_connected');
                    this.changeDetectorRef.detectChanges();
                    return EMPTY;
                }

                if (!this.rememberPin) {
                    console.info('[DSC Dialog] Remember toggle off - skipping dummy PIN verification.');
                    this.signingStage = 'preparing';
                    return this.runSigning(freshCertificate);
                }

                console.info('[DSC Dialog] New PIN with remember ON - verifying with dummy hash before saving.');
                this.signingStage = 'verifying_pin';
                this.changeDetectorRef.detectChanges();
                return this.dscService.verifyPin(freshCertificate, this.dscPin).pipe(
                    switchMap(() => {
                        this.dscPinStorage.savePin(freshCertificate, this.dscPin, this.rememberDurationControl.value as DscPinDuration);
                        return this.runSigning(freshCertificate);
                    }),
                    catchError((error) => {
                        this.signingStage = null;
                        this.dscPin = '';
                        this.dscPinError = this.getFriendlyErrorMessage(error?.message, 'incorrect_pin');
                        this.changeDetectorRef.detectChanges();
                        return EMPTY;
                    })
                );
            }),
            catchError((error) => {
                this.signingStage = null;
                this.handleSetupError(error?.message);
                return EMPTY;
            })
        ).subscribe();
    }

    /**
     * Handles bridge/native-host/device errors that occur while reading the token before
     * signing starts. The raw extension message is logged and a friendly message is shown.
     *
     * @private
     * @param {(string | null | undefined)} rawMessage Raw error from the bridge
     * @memberof DscPinDialogComponent
     */
    private handleSetupError(rawMessage: string | null | undefined): void {
        this.dscPinError = this.getFriendlyErrorMessage(rawMessage, 'device_not_connected');
        if (this.dscCertificates.length === 0) {
            this.isExtensionMissing = false;
            this.isNativeHostMissing = false;
            if (!this.dscService.isBridgeAvailable() || this.isBridgeNotAvailableError(rawMessage)) {
                this.isExtensionMissing = true;
            } else if (this.isNativeHostError(rawMessage)) {
                this.isNativeHostMissing = true;
                this.setDscDownloadUrl();
            }
        }
        this.changeDetectorRef.detectChanges();
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
                        // Token sign failed -> wrong PIN, locked token, missing driver, or bridge disappeared.
                        // Keep the dialog open and show only a friendly message; log the raw error.
                        this.signingStage = null;
                        const rawMessage = error?.message || '';
                        console.error('[DSC Dialog] Token sign failed:', rawMessage);

                        if (!this.dscService.isBridgeAvailable() || this.isBridgeNotAvailableError(rawMessage)) {
                            this.dscCertificates = [];
                            this.isExtensionMissing = true;
                            this.dscPinError = this.getFriendlyErrorMessage(rawMessage, 'bridge_not_found');
                        } else {
                            if (this.usedRememberedPin) {
                                this.dscPinStorage.forgetPin(certificate);
                                this.usedRememberedPin = false;
                                this.rememberedPinValue = null;
                            }
                            this.dscPin = '';
                            this.dscPinError = this.getFriendlyErrorMessage(rawMessage, 'incorrect_pin');
                        }
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
                console.error('[DSC Dialog] Prepare/finish signing failed:', error?.message);
                this.closeDscPinDialog();
                this.toasterService.showSnackBar('error', this.localeData?.download_error || 'An error occurred while downloading signed invoice.');
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
