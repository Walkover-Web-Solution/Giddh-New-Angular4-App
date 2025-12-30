import { Injectable } from '@angular/core';
import { EnvironmentService } from './environment.service';
import { Configuration } from '../app.constant';

export interface WhiteLabelConfig {
    body?: {
        giddhWhiteLabel?: {
            theme?: any;
            apiDomain?: string;
            domainName?: string;
            portalDomain?: string;
        };
        otpWidgetIdWeb?: string;
        otpWidgetTokenWeb?: string;
        otpWidgetIdElectron?: string;
        otpWidgetTokenElectron?: string;
        googleClientId?: string;
        googleClientSecret?: string;
        razorpayPaymentDetails?: {
            keyId?: string;
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
            return whiteLabelPortal;
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
     * Get complete service configuration (replacement for getServiceConfig)
     */
    getServiceConfig(): any {
        // Apply dynamic theme if white label configuration exists
        if (this.whiteLabelConfig?.body?.giddhWhiteLabel?.theme) {
            this.applyWhiteLabelTheme();
        }

        const region = localStorage.getItem('Country-Region') || undefined;

        return {
            // API URLs
            apiUrl: this.getApiUrl(region),
            ApiUrl: this.getApiUrl(region),

            // App URLs
            appUrl: this.getAppUrl(),
            AppUrl: this.getAppUrl(),

            // Portal URL
            PORTAL_URL: this.getPortalUrl(),

            // Authentication
            GOOGLE_CLIENT_ID: this.getGoogleClientId(),
            GOOGLE_CLIENT_SECRET: this.getGoogleClientSecret(),

            // OTP Configuration
            OTP_WIDGET_ID: this.getOtpWidgetId(),
            OTP_TOKEN_AUTH: this.getOtpTokenAuth(),

            // Payment
            RAZORPAY_KEY: this.getRazorpayKey(),

            // Legacy support for hardcoded Electron values
            OTP_WIDGET_ID_NEW: this.whiteLabelConfig?.body?.otpWidgetIdElectron || '33686b716134333831313239',
            OTP_TOKEN_AUTH_NEW: this.whiteLabelConfig?.body?.otpWidgetTokenElectron || '205968TmXguUAwoD633af103P1'
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

        console.log('🎨 Applying white label theme configuration');
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
            console.log('✅ White label configuration validated successfully');
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
