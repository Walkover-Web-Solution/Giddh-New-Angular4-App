import { Inject, Injectable, Optional } from '@angular/core';
import { HttpWrapperService } from './http-wrapper.service';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { ServiceConfig, IServiceConfigArgs } from './service.config';
import { DSC_API } from './apiurls/dsc.api';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { BehaviorSubject, from, merge, Observable, of, throwError } from 'rxjs';
import { catchError, delay, filter, finalize, map, retryWhen, scan, shareReplay, switchMap, take, takeWhile, tap } from 'rxjs/operators';

/** Single DSC certificate returned by the Giddh bridge extension. */
export interface DscCertificate {
    /** Certificate identifier from the token. */
    certId: string;
    /** Certificate in base64 encoding. */
    certB64: string;
    /** Subject common name (certificate owner). */
    subjectCn?: string;
    /** Issuer common name. */
    issuerCn?: string;
    /** Certificate serial number. */
    serial?: string;
    /** Validity start date. */
    notBefore?: string;
    /** Validity end date. */
    notAfter?: string;
    /** Whether the certificate is a CA certificate. */
    isCa?: boolean;
    /** Certificate chain as base64 strings. */
    chain?: string[];
}

/** Shape of the GiddhBridge object injected by the Chrome extension / native host. */
export interface GiddhBridge {
    /** Reads certificates from the USB token. */
    getCertificate(): Promise<{ success: boolean; certificates?: DscCertificate[]; message?: string }>;
    /** Signs a base64 SHA-256 hash using the specified certificate and PIN. */
    signHash(hashBase64: string, algorithm: string, certId: string, pin: string): Promise<{ success: boolean; signature?: string; message?: string }>;
    /** Optional diagnostic helper. */
    diagnose?(): Promise<any>;
}

/** Certificate payload forwarded to the .NET PDF server via Java. */
export interface DscCertificatePayload {
    /** Token certificate identifier. */
    certId: string;
    /** Selected certificate in base64. */
    certificateBase64: string;
    /** Full certificate chain as base64 strings. */
    certificateChainBase64: string[];
}

/** Response body from POST /api/v1/dsc/prepare. */
export interface DscPrepareResponse {
    /** SHA-256 hash of the PDF signing placeholder to be signed by the token. */
    hash: string;
    /** Unique nonce identifying the prepared temporary PDF on the server. */
    nonce: string;
}

/** Request body for POST /api/v1/dsc/finish. */
export interface DscFinishRequest {
    /** Nonce returned by /prepare. */
    nonce: string;
    /** Base64 signature produced by the DSC token. */
    signature: string;
}

@Injectable({
    providedIn: 'root'
})
export class DscService {
    /** In-memory cache of certificates read from the token (null until first load). */
    private certificatesCache$: BehaviorSubject<DscCertificate[] | null> = new BehaviorSubject<DscCertificate[] | null>(null);
    /** Shared in-flight token read so concurrent callers don't trigger duplicate bridge reads. */
    private pendingCertificatesRead$: Observable<DscCertificate[]> | null = null;
    /** True once a token read (preload or dialog sync) has completed in this session, regardless of outcome. */
    private certificateSyncCompleted: boolean = false;
    /** True when the last completed token read succeeded. */
    private certificateSyncSucceeded: boolean = false;
    /** Error message from the last failed token read, reused by the dialog without re-reading the token. */
    private certificateSyncError: string | null = null;
    /** localStorage key used to persist the last certificate list for instant rendering. */
    private static readonly CERTIFICATES_STORE_KEY = 'giddh_dsc_certificates';

    constructor(
        private http: HttpWrapperService,
        private errorHandler: GiddhErrorHandler,
        private generalService: GeneralService,
        @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs
    ) { }

    /**
     * Returns true when the Giddh DSC Bridge extension is available on `window`.
     *
     * @returns {boolean}
     */
    public isBridgeAvailable(): boolean {
        return typeof window !== 'undefined' && !!window.GiddhBridge;
    }

    /**
     * Waits briefly for the Giddh DSC Bridge extension to inject `window.GiddhBridge`.
     * This is needed because on a hard page reload the Angular app can boot before the
     * browser extension has finished injecting its content-script global.
     *
     * @private
     * @param {number} [maxWaitMs=2000] Maximum time to wait for the bridge
     * @param {number} [intervalMs=100] Polling interval
     * @returns {Observable<boolean>}
     * @memberof DscService
     */
    private waitForBridge(maxWaitMs: number = 2000, intervalMs: number = 100): Observable<boolean> {
        if (this.isBridgeAvailable()) {
            return of(true);
        }
        return of(null).pipe(
            delay(intervalMs),
            map(() => this.isBridgeAvailable()),
            retryWhen((errors) =>
                errors.pipe(
                    scan((attemptCount) => attemptCount + 1, 0),
                    takeWhile((attemptCount) => attemptCount * intervalMs < maxWaitMs),
                    delay(intervalMs)
                )
            )
        );
    }

    /**
     * Loads the last-read certificate list from localStorage so the dialog can render
     * immediately without waiting for the token. Returns an empty array when nothing
     * is stored or the data is unreadable.
     *
     * @returns {DscCertificate[]}
     * @memberof DscService
     */
    public getStoredCertificates(): DscCertificate[] {
        try {
            const raw = localStorage.getItem(DscService.CERTIFICATES_STORE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    }

    /**
     * Returns true when a certificate list is available from the in-memory cache or
     * localStorage, so callers can render instantly without a preload spinner.
     *
     * @returns {boolean}
     * @memberof DscService
     */
    public hasCachedCertificates(): boolean {
        return (this.certificatesCache$.getValue()?.length ?? 0) > 0 || this.getStoredCertificates().length > 0;
    }

    /**
     * Returns a synchronous snapshot of the cached certificate list (in-memory cache,
     * falling back to localStorage which then seeds the cache). Used by the dialog to
     * render instantly while a fresh token read happens in the background.
     *
     * @returns {DscCertificate[]}
     * @memberof DscService
     */
    public getCachedCertificatesSnapshot(): DscCertificate[] {
        const cached = this.certificatesCache$.getValue();
        if (cached?.length) {
            return cached;
        }
        const stored = this.getStoredCertificates();
        if (stored.length) {
            this.certificatesCache$.next(stored);
        }
        return stored;
    }

    /**
     * Persists the certificate list to localStorage and the in-memory cache.
     *
     * @private
     * @param {DscCertificate[]} certificates Certificates to persist
     * @memberof DscService
     */
    private storeCertificates(certificates: DscCertificate[]): void {
        try {
            localStorage.setItem(DscService.CERTIFICATES_STORE_KEY, JSON.stringify(certificates));
        } catch {
            // ignore private-browsing / quota errors
        }
        console.info('[DSC] Certificate list cached/stored:', certificates.length, 'certificates');
        this.certificatesCache$.next(certificates);
    }

    /**
     * Fetches the real certificate list from the token on parent page init and keeps
     * the cache/localStorage in sync. Runs in the background: on read error the cached
     * list is intentionally kept so the dialog can show those devices as "not connected"
     * instead of dropping them.
     *
     * Returns an observable so the parent page can track when the preload is done.
     *
     * @param {boolean} [force=false] Re-read the token even if already cached
     * @returns {Observable<DscCertificate[]>}
     * @memberof DscService
     */
    public preloadCertificates(force: boolean = false): Observable<DscCertificate[]> {
        return this.waitForBridge().pipe(
            switchMap((available) => {
                if (!available) {
                    console.info('[DSC] preloadCertificates skipped - bridge not available after wait');
                    return of([]);
                }
                console.info('[DSC] preloadCertificates started');
                if (force) {
                    this.clearCertificatesCache();
                }
                return this.syncCertificates().pipe(
                    tap((certificates) => {
                        console.info('[DSC] preloadCertificates loaded real devices:', certificates.length);
                    }),
                    catchError((error) => {
                        console.error('[DSC] preloadCertificates failed - keeping cached list:', error?.message);
                        return of([]);
                    })
                );
            })
        );
    }

    /**
     * Returns cached certificates when available, otherwise falls back to the stored
     * list. If neither exists, triggers a token read.
     *
     * When a parent preload is still in flight, the cached/stored list is emitted
     * immediately for fast rendering and the fresh result is emitted once the preload
     * completes. This avoids duplicating the slow token read inside the dialog.
     *
     * @returns {Observable<DscCertificate[]>}
     * @memberof DscService
     */
    public getCachedCertificates(): Observable<DscCertificate[]> {
        const cached = this.certificatesCache$.getValue();
        const stored = this.getStoredCertificates();

        // Seed cache from localStorage if memory is empty.
        if (cached === null && stored.length) {
            this.certificatesCache$.next(stored);
        }

        // If a real token read is already in flight (e.g. parent preload), show the
        // cache immediately and then update with the fresh result when it arrives.
        if (this.pendingCertificatesRead$) {
            const immediate$ = this.certificatesCache$.pipe(
                filter((value): value is DscCertificate[] => value !== null),
                take(1)
            );
            return merge(
                immediate$,
                this.pendingCertificatesRead$.pipe(
                    catchError(() => of(this.certificatesCache$.getValue() ?? []))
                )
            );
        }

        const current = this.certificatesCache$.getValue();
        if (current !== null) {
            return of(current);
        }

        return this.syncCertificates();
    }

    /**
     * Reads the certificate list from the token in the background, updates the cache
     * and localStorage, and emits the fresh list. Multiple concurrent callers share the
     * same underlying bridge call.
     *
     * @returns {Observable<DscCertificate[]>}
     * @memberof DscService
     */
    public syncCertificates(): Observable<DscCertificate[]> {
        if (!this.isBridgeAvailable()) {
            console.info('[DSC] syncCertificates skipped - bridge not available');
            return throwError(() => new Error('Bridge not available'));
        }
        console.info('[DSC] syncCertificates started');
        if (!this.pendingCertificatesRead$) {
            this.pendingCertificatesRead$ = this.getCertificates().pipe(
                tap(() => {
                    this.certificateSyncCompleted = true;
                    this.certificateSyncSucceeded = true;
                    this.certificateSyncError = null;
                }),
                catchError((error) => {
                    this.certificateSyncCompleted = true;
                    this.certificateSyncSucceeded = false;
                    this.certificateSyncError = error?.message || null;
                    if (this.certificatesCache$.getValue() === null) {
                        this.certificatesCache$.next([]);
                    }
                    return throwError(() => error);
                }),
                finalize(() => { this.pendingCertificatesRead$ = null; }),
                shareReplay({ bufferSize: 1, refCount: false })
            );
        }
        return this.pendingCertificatesRead$;
    }

    /**
     * True once a token read has completed in this session (via preload or any sync),
     * regardless of outcome. Callers can reuse that result instead of re-reading the token.
     *
     * @returns {boolean}
     * @memberof DscService
     */
    public hasCompletedCertificateSync(): boolean {
        return this.certificateSyncCompleted;
    }

    /**
     * True when the last completed token read succeeded.
     *
     * @returns {boolean}
     * @memberof DscService
     */
    public wasLastCertificateSyncSuccessful(): boolean {
        return this.certificateSyncSucceeded;
    }

    /**
     * Error message from the last failed token read, or null when the last read succeeded.
     *
     * @returns {(string | null)}
     * @memberof DscService
     */
    public getCertificateSyncError(): string | null {
        return this.certificateSyncError;
    }

    /**
     * Clears the certificate cache and localStorage so the next read re-queries the token
     * (used by the dialog's manual "refresh certificates" action).
     *
     * @memberof DscService
     */
    public clearCertificatesCache(): void {
        this.certificatesCache$.next(null);
        this.pendingCertificatesRead$ = null;
        this.certificateSyncCompleted = false;
        this.certificateSyncSucceeded = false;
        this.certificateSyncError = null;
        try {
            localStorage.removeItem(DscService.CERTIFICATES_STORE_KEY);
        } catch { /* ignore */ }
    }

    /**
     * Validates the token PIN by signing a fixed dummy hash before running the
     * real signing flow. Emits on success; forwards the raw bridge error message
     * on failure so the caller can show it verbatim.
     *
     * @param {DscCertificate} certificate Selected DSC certificate
     * @param {string} pin Token PIN to verify
     * @returns {Observable<void>}
     * @memberof DscService
     */
    public verifyPin(certificate: DscCertificate, pin: string): Observable<void> {
        console.info('[DSC] verifyPin started for certificate:', {
            subjectCn: certificate.subjectCn,
            serial: certificate.serial,
            certId: certificate.certId
        });
        return from(this.computeDummyHashBase64()).pipe(
            switchMap((hashBase64) => this.signHash(hashBase64, certificate, pin)),
            tap(() => console.info('[DSC] verifyPin successful for certificate:', certificate.certId)),
            map(() => void 0)
        );
    }

    /**
     * Computes the base64 SHA-256 of a constant dummy string used purely to
     * verify the PIN can unlock the token.
     *
     * @private
     * @returns {Promise<string>}
     * @memberof DscService
     */
    private async computeDummyHashBase64(): Promise<string> {
        const data = new TextEncoder().encode('giddh-dsc-pin-check');
        const digest = await crypto.subtle.digest('SHA-256', data);
        const bytes = new Uint8Array(digest);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    /**
     * Removes duplicate certificate entries returned by the bridge. On Windows the native
     * host can enumerate the same token certificate through two CSP provider paths that
     * differ only in casing (e.g. C:\Windows\... vs C:\WINDOWS\...), producing two entries
     * with different certIds but the same certificate serial. The first occurrence wins.
     *
     * @private
     * @param {DscCertificate[]} certificates Raw certificate list from the bridge
     * @returns {DscCertificate[]}
     * @memberof DscService
     */
    private deduplicateCertificates(certificates: DscCertificate[]): DscCertificate[] {
        const seen = new Set<string>();
        return certificates.filter((certificate) => {
            const key = certificate.serial || certificate.certId;
            if (!key || seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    }

    /**
     * Reads certificates from the USB token via the bridge extension.
     *
     * @returns {Observable<DscCertificate[]>}
     */
    public getCertificates(): Observable<DscCertificate[]> {
        if (!this.isBridgeAvailable()) {
            return throwError(() => new Error('Digital signature bridge not found. Please install the Giddh DSC extension and native host, then refresh the page.'));
        }

        return this.callBridge((window.GiddhBridge as GiddhBridge).getCertificate()).pipe(
            tap(() => console.info('[DSC] Reading certificates from token...')),
            switchMap((response) => {
                if (!response?.success) {
                    return throwError(() => this.normalizeBridgeError(new Error(response?.message || 'Failed to read DSC certificates.')));
                }
                const certificates = this.deduplicateCertificates(response.certificates || []);
                if (certificates.length) {
                    console.info('[DSC] Device connected. Certificates found:', certificates.length);
                    certificates.forEach((cert, index) => {
                        console.info(`[DSC] Certificate #${index + 1}:`, {
                            subjectCn: cert.subjectCn,
                            serial: cert.serial,
                            certId: cert.certId,
                            issuerCn: cert.issuerCn,
                            notAfter: cert.notAfter
                        });
                    });
                    return of(certificates);
                }
                return throwError(() => new Error('No DSC certificate found on the token.'));
            }),
            tap((certificates) => this.storeCertificates(certificates))
        );
    }

    /**
     * Calls /api/v1/dsc/prepare. Java creates a PDF signing placeholder and returns the hash + nonce.
     *
     * @param {*} voucherDetails Voucher data forwarded to the PDF server
     * @param {DscCertificate} certificate Selected DSC certificate
     * @returns {Observable<BaseResponse<DscPrepareResponse, any>>}
     */
    public prepareDscSigning(voucherDetails: any, certificate: DscCertificate): Observable<BaseResponse<DscPrepareResponse, any>> {
        console.info('[DSC] prepareDscSigning started for certificate:', {
            subjectCn: certificate.subjectCn,
            serial: certificate.serial,
            certId: certificate.certId
        });
        const payload = this.buildCertificatePayload(certificate);
        const model = { 
            ...voucherDetails,
            ...payload
        };
        const url = `${this.config.apiUrl}${DSC_API.PREPARE.replace(':companyUniqueName', encodeURIComponent(this.generalService.companyUniqueName))}`;

        return this.http.post(url, model).pipe(
            map((res: BaseResponse<DscPrepareResponse, any>) => {
                if (res?.status !== 'success' || !res?.body) {
                    throw new Error(res?.message || 'Failed to prepare DSC signing.');
                }
                return res;
            }),
            catchError((error) => this.errorHandler.HandleCatch<DscPrepareResponse, any>(error, voucherDetails, model))
        );
    }

    /**
     * Signs the SHA-256 hash using the selected certificate and token PIN via the bridge extension.
     *
     * @param {string} hashBase64 Base64 SHA-256 hash to sign
     * @param {DscCertificate} certificate Selected DSC certificate
     * @param {string} pin Token PIN
     * @returns {Observable<string>}
     */
    public signHash(hashBase64: string, certificate: DscCertificate, pin: string): Observable<string> {
        if (!this.isBridgeAvailable()) {
            return throwError(() => new Error('Giddh DSC Bridge not detected.'));
        }
        if (!certificate?.certId) {
            return throwError(() => new Error('Invalid DSC certificate selected.'));
        }
        if (!pin) {
            return throwError(() => new Error('Token PIN is required to sign.'));
        }

        console.info('[DSC] signHash started for certificate:', {
            subjectCn: certificate.subjectCn,
            serial: certificate.serial,
            certId: certificate.certId
        });

        return this.callBridge(
            (window.GiddhBridge as GiddhBridge).signHash(hashBase64, 'SHA256', certificate.certId, pin)
        ).pipe(
            tap((response) => {
                console.info('[DSC] signHash bridge response:', response);
            }),
            switchMap((response) => {
                if (!response?.success || !response?.signature) {
                    return throwError(() => this.normalizeBridgeError(new Error(response?.message || 'Failed to sign hash with DSC token.')));
                }
                console.info('[DSC] signHash successful for certificate:', certificate.certId, 'signature length:', response.signature.length);
                return of(response.signature);
            })
        );
    }

    /**
     * Calls /api/v1/dsc/finish. Java embeds the signature into the temporary PDF and returns the signed PDF bytes.
     *
     * @param {string} nonce Nonce returned by /prepare
     * @param {string} signature Base64 signature produced by the DSC token
     * @returns {Observable<Blob>}
     */
    public finishDscSigning(nonce: string, signature: string): Observable<Blob> {
        const model: DscFinishRequest = { nonce, signature };
        const url = `${this.config.apiUrl}${DSC_API.FINISH.replace(':companyUniqueName', encodeURIComponent(this.generalService.companyUniqueName))}`;

        console.info('[DSC] finishDscSigning started:', { nonce, signatureLength: signature?.length });

        return this.http.post(url, model, { responseType: 'blob', headers: { 'Accept': 'application/pdf' } }).pipe(
            tap((res: Blob) => {
                console.info('[DSC] finishDscSigning response blob size:', res?.size);
            }),
            map((res: Blob) => {
                if (!res || res.size === 0) {
                    throw new Error('Signed PDF is empty.');
                }
                return res;
            }),
            catchError((error) => throwError(() => this.normalizeError(error)))
        );
    }

    /**
     * Builds the certificate payload expected by the Java/.NET PDF pipeline.
     *
     * @private
     * @param {DscCertificate} certificate Selected DSC certificate
     * @returns {DscCertificatePayload}
     */
    private buildCertificatePayload(certificate: DscCertificate): DscCertificatePayload {
        return {
            certId: certificate.certId,
            certificateBase64: certificate.certB64,
            certificateChainBase64: Array.isArray(certificate.chain) ? certificate.chain : [certificate.certB64]
        };
    }

    /**
     * Converts a bridge Promise into an Observable and attaches a catch handler immediately
     * so the browser does not report an uncaught promise rejection.
     *
     * @private
     * @param {Promise<T>} promise Bridge promise to wrap
     * @returns {Observable<T>}
     */
    private callBridge<T>(promise: Promise<T>): Observable<T> {
        return new Observable<T>((subscriber) => {
            promise
                .then((value) => {
                    subscriber.next(value);
                    subscriber.complete();
                })
                .catch((error) => {
                    console.error('[DSC] bridge rejection:', error);
                    subscriber.error(this.normalizeBridgeError(error));
                });
        });
    }

    /**
     * Normalizes an error thrown/rejected by the bridge extension into a user-friendly Error.
     *
     * @private
     * @param {*} error Error returned by the bridge extension
     * @returns {Error}
     */
    private normalizeBridgeError(error: any): Error {
        const rawMessage = error instanceof Error ? error.message : error?.message || String(error);
        const normalized = rawMessage.toLowerCase();

        if (normalized.includes('no_token') || normalized.includes('no token')) {
            return new Error('No token found. Ensure your DSC token is plugged in and its driver is installed.');
        }
        if (normalized.includes('incorrect pin') || normalized.includes('wrong pin')) {
            return new Error('Incorrect PIN. Please try again.');
        }
        const cleanMessage = this.stripTechnicalDetails(rawMessage);
        if (normalized.includes('pin')) {
            return new Error(`PIN error: ${cleanMessage}`);
        }
        if (normalized.includes('certificate')) {
            return new Error(`Certificate error: ${cleanMessage}`);
        }
        if (cleanMessage) {
            return new Error(cleanMessage);
        }
        return new Error('An unexpected error occurred while communicating with the DSC bridge.');
    }

    /**
     * Removes technical detail dumps from a bridge error message (e.g. the
     * "(driver issues: WDPKCS.dll:NO_TOKEN; ...)" suffix the native host appends),
     * keeping only the human-readable part.
     *
     * @private
     * @param {string} message Raw bridge error message
     * @returns {string}
     */
    private stripTechnicalDetails(message: string): string {
        return (message || '')
            .replace(/\s*\([^)]*(?:\.dll|no_token|driver issues|debug)[^)]*\)/gi, '')
            .trim();
    }

    /**
     * Normalizes an error into a plain Error instance with a readable message.
     *
     * @private
     * @param {*} error Error to normalize
     * @returns {Error}
     */
    private normalizeError(error: any): Error {
        if (error instanceof Error) {
            return error;
        }
        return new Error(error?.message || 'An unexpected error occurred during DSC signing.');
    }
}
