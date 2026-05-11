import { Injectable } from '@angular/core';
import { EnvironmentService } from './environment.service';
import { BANK_STATEMENT_HELP_DOC_URL, GIDDH_CALENDLY_URL, GIDDH_ANDROID_APP_URL, GIDDH_API_DOC_URL, GIDDH_HELP_DOC_URL, GIDDH_INTERNAL_DOMAINS, GIDDH_IOS_APP_URL, GIDDH_SUPPORT_EMAIL, GIDDH_SUPPORT_PHONE_NUMBER, GiddhUiDomain, ICICI_ALLOWED_COMPANIES, SYNC_TALLY_HELP_DOC_URL } from '../app.constant';

export interface WhiteLabelConfig {
    status?: string;
    body?: {
        googleClientId?: string;
        googleClientSecret?: string;
        otpWidgetIdWeb?: string;
        otpWidgetTokenWeb?: string;
        otpWidgetIdElectron?: string;
        otpWidgetTokenElectron?: string;
        calendlyUrl?: string;
        emailDomains?: string[];
        iciciSupportedCompanies?: string[];
        razorpayPaymentDetails?: {
            keyId?: string;
        };
        stripePaymentDetails?: {
            stripePublishablekey?: string
        },
        payuPaymentDetails?: any;
        proxyReferenceId?: string;
        proxyUrl?: string;
        proxyApiUrl?: string;
        proxyReferenceIdUk?: string;
        proxyApiUrlUk?: string;
        websiteDomain?: string;
        brandName?: string;
        legalName?: string;
        supportEmail?: string;
        supportPhone?: string;
        gstCredentials?: any;
        vayanaCredentials?: any;
        logos?: {
            icon?: string;
            primary?: string;
            light?: string;
            favicon?: string;
            dark?: string;
        };
        giddhWhiteLabel?: {
            id?: number;
            uniqueName?: string;
            baseDomain?: string;
            certificateRequired?: boolean;
            certificateStatus?: string;
            domainName?: string;
            portalDomain?: string;
            apiDomain?: string;
            adminDomain?: string;
            uiDomains?: string[];
            theme?: any;
            isActive?: number;
            isDefault?: boolean;
            createdAt?: string;
            updatedAt?: string;
        };
    };
}

/**
 * White Label Service
 *
 * Manages white label configuration overrides while using EnvironmentService
 * as the fallback for default values. This maintains multi-tenant capability
 * while leveraging our centralized environment management.
 */
@Injectable({
    providedIn: 'root'
})
export class WhiteLabelService {

    private whiteLabelConfig: WhiteLabelConfig | null = null;

    constructor(private environmentService: EnvironmentService) {}

    /**
     * Set white label configuration
     */
    setWhiteLabelConfig(config: WhiteLabelConfig): void {
        this.whiteLabelConfig = config;
        this.validateWhiteLabelConfig();
    }

    /**
     * Get white label configuration
     */
    getWhiteLabelConfig(): WhiteLabelConfig | null {
        return this.whiteLabelConfig;
    }

    /**
     * Get API URL with white label override
     */
    getApiUrl(region?: string): string {
        const whiteLabelApiDomain = this.whiteLabelConfig?.body?.giddhWhiteLabel?.apiDomain;

        if (whiteLabelApiDomain) {
            return `${whiteLabelApiDomain}/`;
        }

        return this.environmentService.getApiUrlByRegion(region);
    }

    /**
     * Get App URL with white label override
     */
    getAppUrl(): string {
        const whiteLabelDomain = this.whiteLabelConfig?.body?.giddhWhiteLabel?.domainName;

        if (whiteLabelDomain) {
            return `${whiteLabelDomain}/`;
        }

        return this.environmentService.appUrl;
    }

    /**
     * Get Portal URL with white label override
     */
    getPortalUrl(): string {
        const whiteLabelPortal = this.whiteLabelConfig?.body?.giddhWhiteLabel?.portalDomain;

        if (whiteLabelPortal) {
            return `${whiteLabelPortal}/`;
        }

        return this.environmentService.portalUrl;
    }

    /**
     * Get Google Client ID with white label override
     */
    getGoogleClientId(): string {
        const whiteLabelGoogleId = this.whiteLabelConfig?.body?.googleClientId;

        if (whiteLabelGoogleId) {
            return whiteLabelGoogleId;
        }

        return this.environmentService.googleClientId;
    }

    /**
     * Get Google Client Secret with white label override
     */
    getGoogleClientSecret(): string {
        const whiteLabelGoogleSecret = this.whiteLabelConfig?.body?.googleClientSecret;

        if (whiteLabelGoogleSecret) {
            return whiteLabelGoogleSecret;
        }

        return this.environmentService.googleClientSecret;
    }

    /**
     * Get OTP Widget ID with white label override (platform-specific)
     */
    getOtpWidgetId(): string {
        const isElectron = this.environmentService.isElectron;
        const whiteLabelOtpId = isElectron
            ? this.whiteLabelConfig?.body?.otpWidgetIdElectron
            : this.whiteLabelConfig?.body?.otpWidgetIdWeb;

        if (whiteLabelOtpId) {
            return whiteLabelOtpId;
        }

        return this.environmentService.otpWidgetId;
    }

    /**
     * Get OTP Token Auth with white label override (platform-specific)
     */
    getOtpTokenAuth(): string {
        const isElectron = this.environmentService.isElectron;
        const whiteLabelOtpToken = isElectron
            ? this.whiteLabelConfig?.body?.otpWidgetTokenElectron
            : this.whiteLabelConfig?.body?.otpWidgetTokenWeb;

        if (whiteLabelOtpToken) {
            return whiteLabelOtpToken;
        }

        return this.environmentService.otpTokenAuth;
    }

    /**
     * Get Razorpay Key with white label override
     */
    getRazorpayKey(): string {
        const whiteLabelRazorpay = this.whiteLabelConfig?.body?.razorpayPaymentDetails?.keyId;

        if (whiteLabelRazorpay) {
            return whiteLabelRazorpay;
        }

        return this.environmentService.razorpayKey;
    }

    /**
     * Get Stripe Publishable Key with white label
     */
    getStripeKey(): string {
        const whiteLabelStripeKey = this.whiteLabelConfig?.body?.stripePaymentDetails?.stripePublishablekey;

        if (whiteLabelStripeKey) {
            return whiteLabelStripeKey;
        }
        // Hardcoded value NOT for PROD
        return 'pk_test_51TH166C633IiX3tNahGBDHzERIFl1xqM4dusNYN0bjgdAxOUJaLhviUqd4dMeeJVwYn2MaSsbCdoOlNsLz6TFDBh00Psvqk3Yg';
    }

    /**
     * Generic method to get value with white label override and fallback
     * @param whiteLabelValue - Value from white label config
     * @param fallbackValue - Fallback value if white label is not available
     * @param defaultValue - Default value if both are not available (optional)
     */
    private getValueWithFallback<T>(whiteLabelValue: T | undefined, fallbackValue: T, defaultValue?: T): T {
        if (whiteLabelValue !== undefined && whiteLabelValue !== null) {
            return whiteLabelValue;
        }
        if (fallbackValue !== undefined && fallbackValue !== null) {
            return fallbackValue;
        }
        return defaultValue as T;
    }

    /**
     * Get complete service configuration (replacement for getServiceConfig)
     */
    getServiceConfig(): any {
        // Apply dynamic theme if white label configuration exists
        if (this.whiteLabelConfig?.body?.giddhWhiteLabel?.theme) {
            this.applyWhiteLabelTheme();
        }

        const region = localStorage.getItem('Country-Region') || undefined;
        const body = this.whiteLabelConfig?.body || {};

        const isGiddhDomain = [GiddhUiDomain.LOCAL, GiddhUiDomain.TEST, GiddhUiDomain.PRODUCTION].includes(this.getAppUrl() as GiddhUiDomain);

        return {
            // API URLs (both cases for backward compatibility)
            apiUrl: this.getApiUrl(region),
            ApiUrl: this.getApiUrl(region),

            // App URLs (both cases for backward compatibility)
            appUrl: this.getAppUrl(),
            AppUrl: this.getAppUrl(),

            // Portal URL
            PORTAL_URL: this.getPortalUrl(),

            // Authentication
            GOOGLE_CLIENT_ID: this.getGoogleClientId(),
            GOOGLE_CLIENT_SECRET: this.getGoogleClientSecret(),

            // OTP Configuration (Web and Electron)
            OTP_WIDGET_ID: this.getOtpWidgetId(),
            OTP_TOKEN_AUTH: this.getOtpTokenAuth(),
            OTP_WIDGET_ID_WEB: this.getValueWithFallback(body.otpWidgetIdWeb, isGiddhDomain ? this.environmentService.otpWidgetId : ''),
            OTP_WIDGET_TOKEN_WEB: this.getValueWithFallback(body.otpWidgetTokenWeb, isGiddhDomain ? this.environmentService.otpTokenAuth : ''),
            OTP_WIDGET_ID_ELECTRON: this.getValueWithFallback(body.otpWidgetIdElectron, isGiddhDomain ? this.environmentService.otpWidgetId : ''),
            OTP_WIDGET_TOKEN_ELECTRON: this.getValueWithFallback(body.otpWidgetTokenElectron, isGiddhDomain ? this.environmentService.otpTokenAuth : ''),

            // Payment
            RAZORPAY_KEY: this.getRazorpayKey(),
            STRIPE_PUBLISHABLE_KEY: this.getStripeKey(),
            
            // Is Giddh domain
            IS_GIDDH_DOMAIN: isGiddhDomain,

            // All other properties from whiteLabel body object with fallbacks
            CALENDLY_URL: this.getValueWithFallback(body.calendlyUrl, isGiddhDomain ? GIDDH_CALENDLY_URL : ''),
            EMAIL_DOMAINS: this.getValueWithFallback(body.emailDomains, isGiddhDomain ? GIDDH_INTERNAL_DOMAINS : []),
            ICICI_SUPPORTED_COMPANIES: this.getValueWithFallback(body.iciciSupportedCompanies, isGiddhDomain ? ICICI_ALLOWED_COMPANIES : []),
            PAYU_PAYMENT_DETAILS: this.getValueWithFallback(body.payuPaymentDetails, {}),
            // Below commented values come in whitelabel but not use here this is for portal domain only
            // PROXY_REFERENCE_ID: this.getValueWithFallback(body.proxyReferenceId, ''),
            // PROXY_URL: this.getValueWithFallback(body.proxyUrl, ''),
            // PROXY_API_URL: this.getValueWithFallback(body.proxyApiUrl, ''),
            // PROXY_REFERENCE_ID_UK: this.getValueWithFallback(body.proxyReferenceIdUk, ''),
            // PROXY_API_URL_UK: this.getValueWithFallback(body.proxyApiUrlUk, ''),
            WEBSITE_DOMAIN: this.getValueWithFallback(body.websiteDomain, this.environmentService.appUrl),
            BRAND_NAME: this.getValueWithFallback(body.brandName, isGiddhDomain ? 'Giddh' : ''),
            LEGAL_NAME: this.getValueWithFallback(body.legalName, isGiddhDomain ? 'Walkover Web Solutions Private Limited' : ''),
            SUPPORT_EMAIL: this.getValueWithFallback(body.supportEmail, isGiddhDomain ? GIDDH_SUPPORT_EMAIL : ''),
            SUPPORT_PHONE: this.getValueWithFallback(body.supportPhone, isGiddhDomain ? GIDDH_SUPPORT_PHONE_NUMBER : ''),
            GST_CREDENTIALS: this.getValueWithFallback(body.gstCredentials, {}),
            VAYANA_CREDENTIALS: this.getValueWithFallback(body.vayanaCredentials, {}),
            LOGOS: {
                icon: body.logos?.icon || (isGiddhDomain ? this.environmentService.getAssetPath('images/giddh-big-logo.svg') : ''),
                primary: body.logos?.primary || (isGiddhDomain ? this.environmentService.getAssetPath('images/giddh-big-logo.svg') : ''),
                light: body.logos?.light || (isGiddhDomain ? this.environmentService.getAssetPath('images/giddh-white-logo.svg') : ''),
                favicon: body.logos?.favicon || (isGiddhDomain ? this.environmentService.getAssetPath('images/favicons.png') : ''),
                dark: body.logos?.dark || (isGiddhDomain ? this.environmentService.getAssetPath('images/giddh-big-logo.svg') : '')
            },
            GIDDH_WHITE_LABEL: this.getValueWithFallback(body.giddhWhiteLabel, {}),

            // Resolved image folder path - works for both Electron and Web
            IMG_PATH: this.environmentService.getAssetPath('images/'),

            // Giddh-only URLs - empty string on white label domains
            ANDROID_APP_URL: isGiddhDomain ? GIDDH_ANDROID_APP_URL : '',
            IOS_APP_URL: isGiddhDomain ? GIDDH_IOS_APP_URL : '',
            HELP_DOC_URL: isGiddhDomain ? GIDDH_HELP_DOC_URL : '',
            API_DOC_URL: isGiddhDomain ? GIDDH_API_DOC_URL : '',
            SYNC_TALLY_HELP_DOC_URL: isGiddhDomain ? SYNC_TALLY_HELP_DOC_URL : '',
            BANK_STATEMENT_HELP_DOC_URL: isGiddhDomain ? BANK_STATEMENT_HELP_DOC_URL : ''
        };
    }

    /**
     * Check if white label configuration is active
     */
    isWhiteLabelActive(): boolean {
        return this.whiteLabelConfig !== null &&
               this.whiteLabelConfig.body !== undefined;
    }

    /**
     * Get white label theme configuration
     */
    getWhiteLabelTheme(): any {
        return this.whiteLabelConfig?.body?.giddhWhiteLabel?.theme;
    }

    /**
     * Apply white label theme (placeholder for DynamicThemeService integration)
     */
    private applyWhiteLabelTheme(): void {
        // This would integrate with your existing DynamicThemeService
        // const dynamicThemeService = new DynamicThemeService();
        // dynamicThemeService.applyThemeFromWhiteLabel(this.whiteLabelConfig);

    }

    /**
     * Validate white label configuration
     */
    private validateWhiteLabelConfig(): void {
        if (!this.whiteLabelConfig) {
            return;
        }

        const config = this.whiteLabelConfig;
        const warnings: string[] = [];

        // Validate API domain format
        if (config.body?.giddhWhiteLabel?.apiDomain) {
            const apiDomain = config.body.giddhWhiteLabel.apiDomain;
            if (!this.isValidUrl(apiDomain) && !apiDomain.includes('.')) {
                warnings.push(`Invalid API domain format: ${apiDomain}`);
            }
        }

        // Validate app domain format
        if (config.body?.giddhWhiteLabel?.domainName) {
            const domainName = config.body.giddhWhiteLabel.domainName;
            if (!this.isValidUrl(domainName) && !domainName.includes('.')) {
                warnings.push(`Invalid domain name format: ${domainName}`);
            }
        }

        // Validate Google Client ID format
        if (config.body?.googleClientId) {
            const googleId = config.body.googleClientId;
            if (!googleId.includes('.apps.googleusercontent.com')) {
                warnings.push(`Google Client ID format may be incorrect: ${googleId}`);
            }
        }

        // Log warnings
        if (warnings.length > 0) {
            console.group('⚠️ White Label Configuration Warnings');
            (Array.isArray(warnings) ? warnings : []).forEach(warning => console.warn(`⚠️ ${warning}`));
            console.groupEnd();
        } else {

        }
    }

    /**
     * Check if a string is a valid URL
     */
    private isValidUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Get configuration summary for debugging
     */
    getConfigurationSummary(): string {
        const isActive = this.isWhiteLabelActive();

        return `
🏷️ White Label Configuration Summary:
- Status: ${isActive ? 'Active' : 'Inactive'}
- API Domain: ${isActive ? this.getApiUrl() : 'Using environment default'}
- App Domain: ${isActive ? this.getAppUrl() : 'Using environment default'}
- Portal URL: ${isActive ? this.getPortalUrl() : 'Using environment default'}
- Theme: ${this.getWhiteLabelTheme() ? 'Custom theme applied' : 'Default theme'}
        `.trim();
    }
}
