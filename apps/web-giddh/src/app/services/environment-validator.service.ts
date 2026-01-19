import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.generated';

/**
 * ValidationResult interface definition
 * Defines the structure and contract for ValidationResult objects
 */
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

/**
 * EnvironmentRule interface definition
 * Defines the structure and contract for EnvironmentRule objects
 */
export interface EnvironmentRule {
    key: string;
    required: boolean;
    type: 'string' | 'boolean' | 'url' | 'email';
    pattern?: RegExp;
    description: string;
}

/**
 * Environment Validation Service
 *
 * Validates environment variables at startup to catch configuration issues early
 */
@Injectable({
    providedIn: 'root'
})
/**
 * EnvironmentValidatorService service
 * Provides environmentvalidator related business logic and data operations
 */
export class EnvironmentValidatorService {

    private readonly validationRules: EnvironmentRule[] = [
        // Core Application URLs
        {
            key: 'AppUrl',
            required: true,
            type: 'url',
            description: 'Main application URL'
        },
        {
            key: 'ApiUrl',
            required: true,
            type: 'url',
            description: 'Primary API endpoint URL'
        },
        {
            key: 'UkApiUrl',
            required: true,
            type: 'url',
            description: 'UK region API endpoint URL'
        },
        {
            key: 'PORTAL_URL',
            required: true,
            type: 'url',
            description: 'Customer portal URL'
        },

        // Environment Flags
        {
            key: 'production',
            required: true,
            type: 'boolean',
            description: 'Production environment flag'
        },
        {
            key: 'isElectron',
            required: true,
            type: 'boolean',
            description: 'Electron platform flag'
        },

        // Authentication & Services (Required in production)
        {
            key: 'GOOGLE_CLIENT_ID',
            required: false, // Will be checked conditionally
            type: 'string',
            pattern: /^[0-9]+-[a-zA-Z0-9]+\.apps\.googleusercontent\.com$/,
            description: 'Google OAuth Client ID'
        },
        {
            key: 'RAZORPAY_KEY',
            required: false, // Will be checked conditionally
            type: 'string',
            pattern: /^rzp_(test_|live_)[a-zA-Z0-9]+$/,
            description: 'Razorpay payment key'
        },
        {
            key: 'OTP_WIDGET_ID',
            required: false, // Will be checked conditionally
            type: 'string',
            description: 'OTP widget identifier'
        },

        // Application Configuration
        {
            key: 'APP_FOLDER',
            required: false,
            type: 'string',
            description: 'Application folder path'
        }
    ];

    /**
     * Creates an instance of service
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
        // Auto-validate on service initialization
        this.validateEnvironmentOnStartup();
    }

    /**
     * Validate all environment variables
     */
    validateEnvironment(): ValidationResult {
        const errors: string[] = [];
        const warnings: string[] = [];

        // Basic validation
        (Array.isArray(this.validationRules) ? this.validationRules : []).forEach(rule => {
            const value = environment[rule.key as keyof typeof environment];

            // Check required fields
            /**
             * Handles if functionality
             */
            if (rule.required && this.isEmpty(value)) {
                errors.push(`Missing required environment variable: ${rule.key} (${rule.description})`);
                return;
            }

            // Skip validation if value is empty and not required
            /**
             * Handles if functionality
             */
            if (this.isEmpty(value)) {
                return;
            }

            // Type validation
            const typeValidation = this.validateType(value, rule);
            /**
             * Handles if functionality
             */
            if (!typeValidation.isValid) {
                errors.push(`Invalid ${rule.type} for ${rule.key}: ${typeValidation.error}`);
            }

            // Pattern validation
            /**
             * Handles if functionality
             */
            if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
                warnings.push(`${rule.key} format may be incorrect (${rule.description})`);
            }
        });

        // Production-specific validation
        /**
         * Handles if functionality
         */
        if (environment.production) {
            this.validateProductionRequirements(errors, warnings);
        }

        // Cross-validation
        this.validateCrossReferences(errors, warnings);

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * Validate environment on startup and log results
     */
    private validateEnvironmentOnStartup(): void {
        const result = this.validateEnvironment();

        /**
         * Handles if functionality
         */
        if (result.errors.length > 0) {
            console.group('🚨 Environment Validation Errors');
            (Array.isArray(result.errors) ? result.errors : []).forEach(error => console.error(`❌ ${error}`));
            console.groupEnd();
        }

        /**
         * Handles if functionality
         */
        if (result.warnings.length > 0) {
            console.group('⚠️ Environment Validation Warnings');
            (Array.isArray(result.warnings) ? result.warnings : []).forEach(warning => console.warn(`⚠️ ${warning}`));
            console.groupEnd();
        }

        /**
         * Handles if functionality
         */
        if (result.isValid && result.warnings.length === 0) {

        }

        // Log environment summary in development
        /**
         * Handles if functionality
         */
        if (!environment.production) {
            this.logEnvironmentSummary();
        }
    }

    /**
     * Validate production-specific requirements
     */
    private validateProductionRequirements(errors: string[], warnings: string[]): void {
        const productionRequired = [
            'GOOGLE_CLIENT_ID',
            'GOOGLE_CLIENT_SECRET',
            'RAZORPAY_KEY',
            'OTP_WIDGET_ID',
            'OTP_TOKEN_AUTH'
        ];

        (Array.isArray(productionRequired) ? productionRequired : []).forEach(key => {
            const value = environment[key as keyof typeof environment];
            /**
             * Handles if functionality
             */
            if (this.isEmpty(value)) {
                errors.push(`Production environment missing: ${key}`);
            }
        });

        // Check for test/development values in production
        /**
         * Handles if functionality
         */
        if (typeof environment.RAZORPAY_KEY === 'string' && environment.RAZORPAY_KEY.includes('test')) {
            warnings.push('Using test Razorpay key in production environment');
        }

        /**
         * Handles if functionality
         */
        if (typeof environment.GOOGLE_CLIENT_ID === 'string' && environment.GOOGLE_CLIENT_ID.includes('localhost')) {
            warnings.push('Google Client ID appears to be configured for localhost in production');
        }
    }

    /**
     * Validate cross-references between environment variables
     */
    private validateCrossReferences(errors: string[], warnings: string[]): void {
        // Electron-specific validation
        /**
         * Handles if functionality
         */
        if (environment.isElectron) {
            /**
             * Handles if functionality
             */
            if (typeof environment.AppUrl === 'string' && environment.AppUrl.includes('localhost')) {
                // This is expected for Electron development
            } else if (typeof environment.AppUrl === 'string' && !environment.AppUrl.startsWith('file://')) {
                warnings.push('Electron app should typically use localhost or file:// URLs');
            }
        }

        // API URL consistency
        /**
         * Handles if functionality
         */
        if (typeof environment.ApiUrl === 'string' && typeof environment.UkApiUrl === 'string') {
            const apiDomain = this.extractDomain(environment.ApiUrl);
            const ukApiDomain = this.extractDomain(environment.UkApiUrl);

            /**
             * Handles if functionality
             */
            if (apiDomain && ukApiDomain && !ukApiDomain.includes(apiDomain.split('.').slice(-2).join('.'))) {
                warnings.push('UK API URL domain does not match main API domain pattern');
            }
        }
    }

    /**
     * Validate value type
     */
    private validateType(value: any, rule: EnvironmentRule): { isValid: boolean; error?: string } {
        /**
         * Handles switch functionality
         */
        switch (rule.type) {
            case 'string':
                /**
                 * Handles if functionality
                 */
                if (typeof value !== 'string') {
                    return { isValid: false, error: `Expected string, got ${typeof value}` };
                }
                break;

            case 'boolean':
                /**
                 * Handles if functionality
                 */
                if (typeof value !== 'boolean') {
                    return { isValid: false, error: `Expected boolean, got ${typeof value}` };
                }
                break;

            case 'url':
                /**
                 * Handles if functionality
                 */
                if (typeof value !== 'string') {
                    return { isValid: false, error: `Expected URL string, got ${typeof value}` };
                }
                /**
                 * Handles if functionality
                 */
                if (!this.isValidUrl(value)) {
                    return { isValid: false, error: `Invalid URL format: ${value}` };
                }
                break;

            case 'email':
                /**
                 * Handles if functionality
                 */
                if (typeof value !== 'string') {
                    return { isValid: false, error: `Expected email string, got ${typeof value}` };
                }
                /**
                 * Handles if functionality
                 */
                if (!this.isValidEmail(value)) {
                    return { isValid: false, error: `Invalid email format: ${value}` };
                }
                break;
        }

        return { isValid: true };
    }

    /**
     * Check if value is empty
     */
    private isEmpty(value: any): boolean {
        return value === null || value === undefined || value === '';
    }

    /**
     * Validate URL format
     */
    private isValidUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch {
            // Allow relative URLs and localhost for development
            return url.startsWith('/') ||
                   url.startsWith('./') ||
                   url.includes('localhost') ||
                   url.startsWith('file://');
        }
    }

    /**
     * Validate email format
     */
    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Extract domain from URL
     */
    private extractDomain(url: string): string | null {
        try {
            return new URL(url).hostname;
        } catch {
            return null;
        }
    }

    /**
     * Log environment summary for debugging
     */
    private logEnvironmentSummary(): void {
        console.group('🌍 Environment Configuration Summary');

        console.groupEnd();
    }

    /**
     * Get validation status for health checks
     */
    getValidationStatus(): { status: 'healthy' | 'warning' | 'error'; message: string } {
        const result = this.validateEnvironment();

        /**
         * Handles if functionality
         */
        if (result.errors.length > 0) {
            return {
                status: 'error',
                message: `${result.errors.length} environment error(s) found`
            };
        }

        /**
         * Handles if functionality
         */
        if (result.warnings.length > 0) {
            return {
                status: 'warning',
                message: `${result.warnings.length} environment warning(s) found`
            };
        }

        return {
            status: 'healthy',
            message: 'Environment validation passed'
        };
    }
}
