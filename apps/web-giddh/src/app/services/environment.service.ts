import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.generated';

/**
 * Centralized Environment Service
 *
 * Provides a single point of access to all environment variables
 * with type safety, validation, and consistent API across the application.
 */
@Injectable({
    providedIn: 'root'
})
export class EnvironmentService {

    private readonly _environment = environment;

    constructor() {
        this.validateEnvironment();
    }

    // Core Application URLs
    get appUrl(): string {
        return this._environment.AppUrl;
    }

    get apiUrl(): string {
        return this._environment.ApiUrl;
    }

    get ukApiUrl(): string {
        return this._environment.UkApiUrl;
    }

    get portalUrl(): string {
        return this._environment.PORTAL_URL;
    }

    // Environment Flags
    get isProduction(): boolean {
        return this._environment.production;
    }

    get isElectron(): boolean {
        return this._environment.isElectron;
    }

    get isLocal(): boolean {
        return this._environment.LOCAL_ENV;
    }

    get isStaging(): boolean {
        return this._environment.STAGING_ENV;
    }

    get isTest(): boolean {
        return this._environment.TEST_ENV;
    }

    get showDevModule(): boolean {
        return this._environment.showDevModule;
    }

    // Authentication & Services
    get googleClientId(): string {
        return this._environment.GOOGLE_CLIENT_ID;
    }

    get googleClientSecret(): string {
        return this._environment.GOOGLE_CLIENT_SECRET;
    }

    get razorpayKey(): string {
        return this._environment.RAZORPAY_KEY;
    }

    get otpWidgetId(): string {
        return this._environment.OTP_WIDGET_ID;
    }

    get otpTokenAuth(): string {
        return this._environment.OTP_TOKEN_AUTH;
    }

    // Application Configuration
    get appFolder(): string {
        return this._environment.APP_FOLDER;
    }

    // Utility Methods
    get isDevelopment(): boolean {
        return !this.isProduction;
    }

    get isWebEnvironment(): boolean {
        return !this.isElectron;
    }

    /**
     * Get asset path based on environment (Electron vs Web)
     */
    getAssetPath(relativePath: string): string {
        if (this.isElectron) {
            return `assets/${relativePath}`;
        }
        return `${this.appUrl}${this.appFolder}assets/${relativePath}`;
    }

    /**
     * Get image path for consistent image loading
     */
    getImagePath(imageName: string): string {
        return this.getAssetPath(`images/${imageName}`);
    }

    /**
     * Get icon path for consistent icon loading
     */
    getIconPath(iconName: string): string {
        return this.getAssetPath(`icon/${iconName}`);
    }

    /**
     * Get API URL based on region (UK vs Default)
     */
    getApiUrlByRegion(region?: string): string {
        if (region === 'GB' || localStorage.getItem('Country-Region') === 'GB') {
            return this.ukApiUrl;
        }
        return this.apiUrl;
    }

    /**
     * Check if a feature is enabled based on environment
     */
    isFeatureEnabled(feature: string): boolean {
        switch (feature) {
            case 'devModule':
                return this.showDevModule;
            case 'production':
                return this.isProduction;
            default:
                return false;
        }
    }

    /**
     * Get environment-specific configuration
     */
    getConfig() {
        return {
            appUrl: this.appUrl,
            apiUrl: this.apiUrl,
            ukApiUrl: this.ukApiUrl,
            portalUrl: this.portalUrl,
            isProduction: this.isProduction,
            isElectron: this.isElectron,
            isDevelopment: this.isDevelopment,
            googleClientId: this.googleClientId,
            razorpayKey: this.razorpayKey,
            otpWidgetId: this.otpWidgetId
        };
    }

    /**
     * Validate that all required environment variables are present
     */
    private validateEnvironment(): void {
        const requiredVariables = [
            'AppUrl',
            'ApiUrl',
            'UkApiUrl'
        ];

        const missingVariables = requiredVariables.filter(variable => {
            const value = this._environment[variable as keyof typeof this._environment];
            return !value || value === '';
        });

        if (missingVariables.length > 0) {
            console.error('❌ Missing required environment variables:', missingVariables);
            console.error('🔧 Please check your environment configuration');
        }

        // Validate URLs format
        this.validateUrls();
    }

    /**
     * Validate URL formats
     */
    private validateUrls(): void {
        const urls = [
            { name: 'AppUrl', value: this.appUrl },
            { name: 'ApiUrl', value: this.apiUrl },
            { name: 'UkApiUrl', value: this.ukApiUrl }
        ];

        urls.forEach(({ name, value }) => {
            if (value && !this.isValidUrl(value)) {
                console.warn(`⚠️ Invalid URL format for ${name}: ${value}`);
            }
        });
    }

    /**
     * Check if a string is a valid URL
     */
    private isValidUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch {
            // For relative URLs in development
            return url.startsWith('/') || url.startsWith('./') || url.includes('localhost');
        }
    }

    /**
     * Get environment summary for debugging
     */
    getEnvironmentSummary(): string {
        return `
🌍 Environment Summary:
- Environment: ${this.isProduction ? 'Production' : 'Development'}
- Platform: ${this.isElectron ? 'Electron' : 'Web'}
- App URL: ${this.appUrl}
- API URL: ${this.apiUrl}
- Region API: ${this.ukApiUrl}
- Portal URL: ${this.portalUrl}
        `.trim();
    }
}
