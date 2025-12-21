const dotenv = require('dotenv');
const webpack = require('webpack');
const path = require('path');

module.exports = (config, options) => {
    // Detect build configuration
    const buildConfig = options.configuration || 'local';
    console.log(`🔧 Building environment configuration for: ${buildConfig}`);
    
    // Map configuration to environment file
    const envFileMap = {
        'local': '.env.local',
        'stage': '.env.stage',
        'prod': '.env.prod'
    };
    
    const envFile = envFileMap[buildConfig] || '.env.local';
    const envPath = path.resolve(__dirname, envFile);
    
    console.log(`📁 ${buildConfig === 'local' ? 'Development' : buildConfig.charAt(0).toUpperCase() + buildConfig.slice(1)} environment - loading from: ${envFile}`);
    
    // Load environment variables
    let envVars = {};
    try {
        const result = dotenv.config({ path: envPath });
        if (result.error) {
            console.warn(`⚠️  Warning: Could not load ${envFile}. Using server environment variables as fallback.`);
            console.error(`Error: ${result.error.message}`);
            // Fallback to process.env for CI/CD environments
            envVars = process.env;
        } else {
            envVars = result.parsed;
            console.log(`✅ Successfully loaded ${envFile}`);
        }
    } catch (error) {
        console.warn(`⚠️  Warning: Could not load ${envFile}. Using server environment variables as fallback.`);
        console.error(`Error: ${error.message}`);
        envVars = process.env;
    }
    
    // Define global constants for webpack DefinePlugin
    const globalConstants = {
        // API Configuration
        ApiUrl: JSON.stringify(envVars.API_URL || 'https://apitest.giddh.com/'),
        APP_URL: JSON.stringify(envVars.APP_URL || 'http://localhost:3000/'),
        
        // Authentication & Payment
        GOOGLE_CLIENT_ID: JSON.stringify(envVars.GOOGLE_CLIENT_ID || ''),
        GOOGLE_CLIENT_SECRET: JSON.stringify(envVars.GOOGLE_CLIENT_SECRET || ''),
        RAZORPAY_KEY: JSON.stringify(envVars.RAZORPAY_KEY || ''),
        PAYPAL_CLIENT_ID: JSON.stringify(envVars.PAYPAL_CLIENT_ID || ''),
        
        // OTP Service
        OTP_WIDGET_ID: JSON.stringify(envVars.OTP_WIDGET_ID || ''),
        OTP_TOKEN_AUTH: JSON.stringify(envVars.OTP_TOKEN_AUTH || ''),
        
        // Social Login
        FACEBOOK_APP_ID: JSON.stringify(envVars.FACEBOOK_APP_ID || ''),
        LINKEDIN_CLIENT_ID: JSON.stringify(envVars.LINKEDIN_CLIENT_ID || ''),
        LINKEDIN_SECRET_KEY: JSON.stringify(envVars.LINKEDIN_SECRET_KEY || ''),
        TWITTER_CLIENT_ID: JSON.stringify(envVars.TWITTER_CLIENT_ID || ''),
        TWITTER_SECRET_KEY: JSON.stringify(envVars.TWITTER_SECRET_KEY || ''),
        
        // Analytics & Tracking
        GOOGLE_ANALYTICS_ID: JSON.stringify(envVars.GOOGLE_ANALYTICS_ID || ''),
        HOTJAR_ID: JSON.stringify(envVars.HOTJAR_ID || ''),
        MIXPANEL_TOKEN: JSON.stringify(envVars.MIXPANEL_TOKEN || ''),
        
        // Error Tracking
        ERRLYTIC_KEY: JSON.stringify(envVars.ERRLYTIC_KEY || ''),
        ERRLYTIC_NEEDED: JSON.stringify(envVars.ERRLYTIC_NEEDED || 'false'),
        
        // Editor License
        FROALA_EDITOR_KEY: JSON.stringify(envVars.FROALA_EDITOR_KEY || ''),
        
        // Feature Flags
        PRODUCTION_ENV: JSON.stringify(buildConfig === 'prod'),
        STAGING_ENV: JSON.stringify(buildConfig === 'stage'),
        DEVELOPMENT_ENV: JSON.stringify(buildConfig === 'local'),
        ENABLE_VOUCHER_ADJUSTMENT_MULTI_CURRENCY: JSON.stringify(envVars.ENABLE_VOUCHER_ADJUSTMENT_MULTI_CURRENCY || 'false'),
        
        // Additional Configuration
        SENTRY_DSN: JSON.stringify(envVars.SENTRY_DSN || ''),
        PUSHER_KEY: JSON.stringify(envVars.PUSHER_KEY || ''),
        PUSHER_CLUSTER: JSON.stringify(envVars.PUSHER_CLUSTER || ''),
        
        // Build Information
        BUILD_VERSION: JSON.stringify(envVars.BUILD_VERSION || '1.0.0'),
        BUILD_TIMESTAMP: JSON.stringify(new Date().toISOString())
    };
    
    // Add DefinePlugin to webpack plugins
    config.plugins = config.plugins || [];
    config.plugins.push(
        new webpack.DefinePlugin(globalConstants)
    );
    
    // Generate environment file for Angular
    const fs = require('fs');
    const environmentContent = `// Auto-generated environment file - DO NOT EDIT MANUALLY
// Generated at: ${new Date().toISOString()}
// Configuration: ${buildConfig}

export const environment = {
    production: ${buildConfig === 'prod'},
    staging: ${buildConfig === 'stage'},
    development: ${buildConfig === 'local'},
    
    // API Configuration
    ApiUrl: ApiUrl,
    APP_URL: APP_URL,
    
    // Authentication & Payment
    GOOGLE_CLIENT_ID: GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: GOOGLE_CLIENT_SECRET,
    RAZORPAY_KEY: RAZORPAY_KEY,
    PAYPAL_CLIENT_ID: PAYPAL_CLIENT_ID,
    
    // OTP Service
    OTP_WIDGET_ID: OTP_WIDGET_ID,
    OTP_TOKEN_AUTH: OTP_TOKEN_AUTH,
    
    // Social Login
    FACEBOOK_APP_ID: FACEBOOK_APP_ID,
    LINKEDIN_CLIENT_ID: LINKEDIN_CLIENT_ID,
    LINKEDIN_SECRET_KEY: LINKEDIN_SECRET_KEY,
    TWITTER_CLIENT_ID: TWITTER_CLIENT_ID,
    TWITTER_SECRET_KEY: TWITTER_SECRET_KEY,
    
    // Analytics & Tracking
    GOOGLE_ANALYTICS_ID: GOOGLE_ANALYTICS_ID,
    HOTJAR_ID: HOTJAR_ID,
    MIXPANEL_TOKEN: MIXPANEL_TOKEN,
    
    // Error Tracking
    ERRLYTIC_KEY: ERRLYTIC_KEY,
    ERRLYTIC_NEEDED: ERRLYTIC_NEEDED,
    
    // Editor License
    FROALA_EDITOR_KEY: FROALA_EDITOR_KEY,
    
    // Feature Flags
    ENABLE_VOUCHER_ADJUSTMENT_MULTI_CURRENCY: ENABLE_VOUCHER_ADJUSTMENT_MULTI_CURRENCY,
    
    // Additional Configuration
    SENTRY_DSN: SENTRY_DSN,
    PUSHER_KEY: PUSHER_KEY,
    PUSHER_CLUSTER: PUSHER_CLUSTER,
    
    // Build Information
    BUILD_VERSION: BUILD_VERSION,
    BUILD_TIMESTAMP: BUILD_TIMESTAMP
};

declare const ApiUrl: string;
declare const APP_URL: string;
declare const GOOGLE_CLIENT_ID: string;
declare const GOOGLE_CLIENT_SECRET: string;
declare const RAZORPAY_KEY: string;
declare const PAYPAL_CLIENT_ID: string;
declare const OTP_WIDGET_ID: string;
declare const OTP_TOKEN_AUTH: string;
declare const FACEBOOK_APP_ID: string;
declare const LINKEDIN_CLIENT_ID: string;
declare const LINKEDIN_SECRET_KEY: string;
declare const TWITTER_CLIENT_ID: string;
declare const TWITTER_SECRET_KEY: string;
declare const GOOGLE_ANALYTICS_ID: string;
declare const HOTJAR_ID: string;
declare const MIXPANEL_TOKEN: string;
declare const ERRLYTIC_KEY: string;
declare const ERRLYTIC_NEEDED: string;
declare const FROALA_EDITOR_KEY: string;
declare const ENABLE_VOUCHER_ADJUSTMENT_MULTI_CURRENCY: string;
declare const SENTRY_DSN: string;
declare const PUSHER_KEY: string;
declare const PUSHER_CLUSTER: string;
declare const BUILD_VERSION: string;
declare const BUILD_TIMESTAMP: string;
`;
    
    const environmentPath = path.resolve(__dirname, 'apps/web-giddh/src/environments/environment.generated.ts');
    fs.writeFileSync(environmentPath, environmentContent);
    console.log(`📝 Generated environment file: ${environmentPath}`);
    
    // Log environment configuration
    console.log('🌍 Environment Configuration:');
    console.log(`   Build: ${buildConfig}`);
    console.log(`   App URL: ${envVars.APP_URL || 'http://localhost:3000/'}`);
    console.log(`   API URL: ${envVars.API_URL || 'https://apitest.giddh.com/'}`);
    console.log(`   Production: ${buildConfig === 'prod'}`);
    
    console.log('✅ Environment build completed successfully!');
    
    return config;
};
