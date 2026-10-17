import { Inject, Injectable, Optional } from '@angular/core';
import { Observable, of, shareReplay, switchMap, throwError } from 'rxjs';
import { Configuration, ELECTRON_OTP_PROVIDER_URL, OTP_PROVIDER_URL } from '../app.constant';
import { IServiceConfigArgs, ServiceConfig } from './service.config';

/** MSG91 resend channel from widget processes */
export interface Msg91OtpChannel {
    name: string;
    value: string | number;
}

/** Optional overrides when initializing the MSG91 widget */
export interface Msg91OtpInitOptions {
    widgetId?: string;
    tokenAuth?: string;
    onFailure?: (error: { message?: string }) => void;
}

export interface Msg91OtpSendResponse {
    requestId: string;
}

export interface Msg91OtpVerifyResponse {
    accessToken: string;
}

interface Msg91WidgetWindow {
    initSendOTP?: (config: Record<string, unknown>) => void;
    sendOtp?: (
        identifier: string,
        success: (data: { message?: string }) => void,
        failure: (error: { message?: string } | string) => void
    ) => void;
    verifyOtp?: (
        otp: string,
        success: (data: { message?: string }) => void,
        failure: (error: { message?: string } | string) => void,
        requestId: string
    ) => void;
    retryOtp?: (
        channel: string | number,
        success: (data?: unknown) => void,
        failure: (error: { message?: string } | string) => void,
        requestId: string
    ) => void;
    getWidgetData?: () => {
        processes?: Array<{ channel?: { name?: string; value?: string | number } }>;
    };
}

/**
 * Reusable MSG91 OTP widget service (send / verify / retry / resend channels).
 * Default widget credentials come from ServiceConfig (web, with fallbacks).
 */
@Injectable({
    providedIn: 'root'
})
export class Msg91OtpService {
    /** MSG91 email channel (used for email OTP resend) */
    public readonly emailChannel = 3;
    /** MSG91 SMS channel (common mobile default) */
    public readonly smsChannel = 11;

    private isWidgetReady = false;
    private initInFlight$: Observable<void> | null = null;
    private channelsLoadDelayMs = 2000;

    constructor(
        @Optional() @Inject(ServiceConfig) private readonly serviceConfig: IServiceConfigArgs
    ) { }

    /**
     * Loads and initializes the MSG91 OTP widget script with default app settings.
     * Safe to call multiple times; subsequent calls reuse the ready state.
     *
     * @param {Msg91OtpInitOptions} [options] Optional widget overrides
     * @returns {Observable<void>}
     * @memberof Msg91OtpService
     */
    public init(options?: Msg91OtpInitOptions): Observable<void> {
        const win = this.getWindow();
        if (this.isWidgetReady && typeof win.sendOtp === 'function') {
            return of(undefined);
        }
        if (this.initInFlight$) {
            return this.initInFlight$;
        }

        this.initInFlight$ = new Observable<void>((subscriber) => {
            const configuration = {
                widgetId: options?.widgetId || this.serviceConfig?.OTP_WIDGET_ID_WEB || this.serviceConfig?.OTP_WIDGET_ID,
                tokenAuth: options?.tokenAuth || this.serviceConfig?.OTP_WIDGET_TOKEN_WEB || this.serviceConfig?.OTP_TOKEN_AUTH,
                exposeMethods: true,
                success: () => { },
                failure: (error: { message?: string }) => {
                    options?.onFailure?.(error);
                }
            };

            const finishInit = (): void => {
                if (typeof win.initSendOTP === 'function') {
                    win.initSendOTP(configuration);
                }
                this.isWidgetReady = true;
                this.initInFlight$ = null;
                subscriber.next();
                subscriber.complete();
            };

            if (typeof win.initSendOTP === 'undefined') {
                const scriptTag = document.createElement('script');
                scriptTag.src = Configuration.isElectron ? ELECTRON_OTP_PROVIDER_URL : OTP_PROVIDER_URL;
                scriptTag.type = 'text/javascript';
                scriptTag.defer = true;
                scriptTag.onload = () => finishInit();
                scriptTag.onerror = () => {
                    this.initInFlight$ = null;
                    subscriber.error(new Error('Failed to load MSG91 OTP widget script'));
                };
                document.body.appendChild(scriptTag);
            } else {
                finishInit();
            }
        }).pipe(shareReplay(1));

        return this.initInFlight$;
    }

    /**
     * Sends OTP to email or mobile (digits with country code, no +).
     * Ensures the widget is initialized first.
     *
     * @param {string} identifier Email or mobile number
     * @returns {Observable<Msg91OtpSendResponse>}
     * @memberof Msg91OtpService
     */
    public sendOtp(identifier: string): Observable<Msg91OtpSendResponse> {
        return this.init().pipe(
            switchMap(() => new Observable<Msg91OtpSendResponse>((subscriber) => {
                const win = this.getWindow();
                if (typeof win.sendOtp !== 'function') {
                    subscriber.error(new Error('MSG91 sendOtp is not available'));
                    return;
                }
                win.sendOtp(
                    identifier,
                    (data) => {
                        subscriber.next({ requestId: data?.message ?? '' });
                        subscriber.complete();
                    },
                    (error) => {
                        subscriber.error(new Error(this.normalizeError(error)));
                    }
                );
            }))
        );
    }

    /**
     * Verifies OTP and returns MSG91 access token (message field).
     *
     * @param {string} otp OTP entered by user
     * @param {string} requestId Request id from sendOtp
     * @returns {Observable<Msg91OtpVerifyResponse>}
     * @memberof Msg91OtpService
     */
    public verifyOtp(otp: string, requestId: string): Observable<Msg91OtpVerifyResponse> {
        if (!otp?.trim() || !requestId) {
            return throwError(() => new Error('OTP and requestId are required'));
        }

        return this.init().pipe(
            switchMap(() => new Observable<Msg91OtpVerifyResponse>((subscriber) => {
                const win = this.getWindow();
                if (typeof win.verifyOtp !== 'function') {
                    subscriber.error(new Error('MSG91 verifyOtp is not available'));
                    return;
                }
                win.verifyOtp(
                    otp.trim(),
                    (data) => {
                        subscriber.next({ accessToken: data?.message ?? '' });
                        subscriber.complete();
                    },
                    (error) => {
                        subscriber.error(new Error(this.normalizeError(error)));
                    },
                    requestId
                );
            }))
        );
    }

    /**
     * Resends OTP on a MSG91 channel (email = 3, or VOICE / SMS / WHATSAPP values from getResendChannels).
     *
     * @param {string | number} channel Channel value
     * @param {string} requestId Request id from sendOtp
     * @returns {Observable<void>}
     * @memberof Msg91OtpService
     */
    public retryOtp(channel: string | number, requestId: string): Observable<void> {
        if (channel == null || !requestId) {
            return throwError(() => new Error('Channel and requestId are required'));
        }

        return this.init().pipe(
            switchMap(() => new Observable<void>((subscriber) => {
                const win = this.getWindow();
                if (typeof win.retryOtp !== 'function') {
                    subscriber.error(new Error('MSG91 retryOtp is not available'));
                    return;
                }
                win.retryOtp(
                    channel,
                    () => {
                        subscriber.next();
                        subscriber.complete();
                    },
                    (error) => {
                        subscriber.error(new Error(this.normalizeError(error)));
                    },
                    requestId
                );
            }))
        );
    }

    /**
     * Returns mobile resend channels from the widget (VOICE / SMS / WHATSAPP).
     * Email channel (3) is excluded by default — same as website signup.
     * Call after init; channels may be empty until the widget finishes loading processes.
     *
     * @param {{ excludeEmail?: boolean }} [options]
     * @returns {Msg91OtpChannel[]}
     * @memberof Msg91OtpService
     */
    public getResendChannels(options?: { excludeEmail?: boolean }): Msg91OtpChannel[] {
        const excludeEmail = options?.excludeEmail !== false;
        const win = this.getWindow();
        if (typeof win.getWidgetData !== 'function') {
            return [];
        }
        const widgetData = win.getWidgetData();
        if (!widgetData?.processes?.length) {
            return [];
        }

        const seen = new Set<string>();
        const channels: Msg91OtpChannel[] = [];
        widgetData.processes.forEach((process) => {
            const channel = process?.channel;
            if (!channel || channel.value == null) {
                return;
            }
            const valueKey = String(channel.value);
            if (excludeEmail && valueKey === String(this.emailChannel)) {
                return;
            }
            if (seen.has(valueKey)) {
                return;
            }
            seen.add(valueKey);
            channels.push({
                name: channel.name ?? valueKey,
                value: channel.value
            });
        });
        return channels;
    }

    /**
     * Loads resend channels after the widget process list is available (short delay post-init).
     *
     * @param {{ excludeEmail?: boolean }} [options]
     * @returns {Observable<Msg91OtpChannel[]>}
     * @memberof Msg91OtpService
     */
    public loadResendChannels(options?: { excludeEmail?: boolean }): Observable<Msg91OtpChannel[]> {
        return this.init().pipe(
            switchMap(() => new Observable<Msg91OtpChannel[]>((subscriber) => {
                const emitChannels = (): void => {
                    subscriber.next(this.getResendChannels(options));
                    subscriber.complete();
                };
                const channels = this.getResendChannels(options);
                if (channels.length) {
                    emitChannels();
                    return;
                }
                const timer = setTimeout(() => emitChannels(), this.channelsLoadDelayMs);
                return () => clearTimeout(timer);
            }))
        );
    }

    /**
     * @private
     * @returns {Msg91WidgetWindow}
     * @memberof Msg91OtpService
     */
    private getWindow(): Msg91WidgetWindow {
        return window as unknown as Msg91WidgetWindow;
    }

    /**
     * @private
     * @param {{ message?: string } | string} error
     * @returns {string}
     * @memberof Msg91OtpService
     */
    private normalizeError(error: { message?: string } | string): string {
        return typeof error === 'string' ? error : (error?.message ?? '');
    }
}
