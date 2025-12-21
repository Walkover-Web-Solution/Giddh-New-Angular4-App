// Global TypeScript declarations for Angular 21 Environment Variables
// These constants are injected at build time via webpack.DefinePlugin

// API Configuration
declare const ApiUrl: string;
declare const APP_URL: string;

// Authentication & Payment
declare const GOOGLE_CLIENT_ID: string;
declare const GOOGLE_CLIENT_SECRET: string;
declare const RAZORPAY_KEY: string;
declare const PAYPAL_CLIENT_ID: string;

// OTP Service
declare const OTP_WIDGET_ID: string;
declare const OTP_TOKEN_AUTH: string;

// Social Login
declare const FACEBOOK_APP_ID: string;
declare const LINKEDIN_CLIENT_ID: string;
declare const LINKEDIN_SECRET_KEY: string;
declare const TWITTER_CLIENT_ID: string;
declare const TWITTER_SECRET_KEY: string;

// Analytics & Tracking
declare const GOOGLE_ANALYTICS_ID: string;
declare const HOTJAR_ID: string;
declare const MIXPANEL_TOKEN: string;

// Error Tracking
declare const ERRLYTIC_KEY: string;
declare const ERRLYTIC_NEEDED: string;

// Editor License
declare const FROALA_EDITOR_KEY: string;

// Feature Flags
declare const PRODUCTION_ENV: boolean;
declare const STAGING_ENV: boolean;
declare const DEVELOPMENT_ENV: boolean;
declare const ENABLE_VOUCHER_ADJUSTMENT_MULTI_CURRENCY: string;

// Additional Configuration
declare const SENTRY_DSN: string;
declare const PUSHER_KEY: string;
declare const PUSHER_CLUSTER: string;

// Build Information
declare const BUILD_VERSION: string;
declare const BUILD_TIMESTAMP: string;

// Environment Interface
export interface Environment {
    production: boolean;
    staging: boolean;
    development: boolean;
    
    // API Configuration
    ApiUrl: string;
    APP_URL: string;
    
    // Authentication & Payment
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    RAZORPAY_KEY: string;
    PAYPAL_CLIENT_ID: string;
    
    // OTP Service
    OTP_WIDGET_ID: string;
    OTP_TOKEN_AUTH: string;
    
    // Social Login
    FACEBOOK_APP_ID: string;
    LINKEDIN_CLIENT_ID: string;
    LINKEDIN_SECRET_KEY: string;
    TWITTER_CLIENT_ID: string;
    TWITTER_SECRET_KEY: string;
    
    // Analytics & Tracking
    GOOGLE_ANALYTICS_ID: string;
    HOTJAR_ID: string;
    MIXPANEL_TOKEN: string;
    
    // Error Tracking
    ERRLYTIC_KEY: string;
    ERRLYTIC_NEEDED: string;
    
    // Editor License
    FROALA_EDITOR_KEY: string;
    
    // Feature Flags
    ENABLE_VOUCHER_ADJUSTMENT_MULTI_CURRENCY: string;
    
    // Additional Configuration
    SENTRY_DSN: string;
    PUSHER_KEY: string;
    PUSHER_CLUSTER: string;
    
    // Build Information
    BUILD_VERSION: string;
    BUILD_TIMESTAMP: string;
}
