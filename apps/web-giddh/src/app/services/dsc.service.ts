import { Inject, Injectable, Optional } from '@angular/core';
import { HttpWrapperService } from './http-wrapper.service';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { ServiceConfig, IServiceConfigArgs } from './service.config';
import { DSC_API } from './apiurls/dsc.api';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

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
     * Reads certificates from the USB token via the bridge extension.
     *
     * @returns {Observable<DscCertificate[]>}
     */
    public getCertificates(): Observable<DscCertificate[]> {
        if (!this.isBridgeAvailable()) {
            return throwError(() => new Error('Digital signature bridge not found. Please install the Giddh DSC extension and native host, then refresh the page.'));
        }

        return this.callBridge((window.GiddhBridge as GiddhBridge).getCertificate()).pipe(
            switchMap((response) => {
                if (!response?.success) {
                    return throwError(() => new Error(response?.message || 'Failed to read DSC certificates.'));
                }
                const certificates = response.certificates || [];
                return certificates.length ? of(certificates) : throwError(() => new Error('No DSC certificate found on the token.'));
            })
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

        return this.callBridge(
            (window.GiddhBridge as GiddhBridge).signHash(hashBase64, 'SHA256', certificate.certId, pin)
        ).pipe(
            switchMap((response) => {
                if (!response?.success || !response?.signature) {
                    return throwError(() => new Error(response?.message || 'Failed to sign hash with DSC token.'));
                }
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

        return this.http.post(url, model, { responseType: 'blob' }).pipe(
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
     * Orchestrates the complete DSC signing flow:
     * 1. Prepare PDF hash on server
     * 2. Sign hash with token PIN
     * 3. Finish signing and receive the signed PDF Blob
     *
     * @param {*} voucherDetails Voucher data forwarded to the PDF server
     * @param {DscCertificate} certificate Selected DSC certificate
     * @param {string} pin Token PIN
     * @returns {Observable<Blob>}
     */
    public downloadSignedInvoice(voucherDetails: any, certificate: DscCertificate, pin: string): Observable<Blob> {
        return this.prepareDscSigning(voucherDetails, certificate).pipe(
            switchMap((prepareResponse) =>
                this.signHash(prepareResponse.body.hash, certificate, pin).pipe(
                    switchMap((signedSignature) =>
                        this.finishDscSigning(prepareResponse.body.nonce, signedSignature)
                    )
                )
            )
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
                .catch((error) => subscriber.error(this.normalizeBridgeError(error)));
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

        if (normalized.includes('incorrect pin') || normalized.includes('wrong pin')) {
            return new Error('Incorrect PIN. Please try again.');
        }
        if (normalized.includes('pin')) {
            return new Error(`PIN error: ${rawMessage}`);
        }
        if (normalized.includes('certificate')) {
            return new Error(`Certificate error: ${rawMessage}`);
        }
        if (rawMessage) {
            return new Error(rawMessage);
        }
        return new Error('An unexpected error occurred while communicating with the DSC bridge.');
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
