#!/usr/bin/env node
/**
 * Environment Variable Injection Script
 *
 * This script dynamically loads environment variables from the appropriate .env file
 * and injects them into the HTML file at build time, ensuring sensitive credentials
 * are not hardcoded in the repository.
 */
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
/**
 * Determine which .env file to use based on build environment
 */
function getEnvFile() {
    const args = process.argv.slice(2);
    const isElectron = args.includes('--electron') || process.env.ELECTRON_ENV;
    const environment = process.env.NODE_ENV || 'local';
    if (isElectron) {
        return '.env.electron';
    }
    // Map environment to appropriate .env file
    const envFileMap = {
        'production': '.env.prod',
        'staging': '.env.stage',
        'test': '.env.test',
        'local': '.env'
    };
    return envFileMap[environment] || '.env';
}
/**
 * Load environment variables from the determined .env file
 */
function loadEnvironmentVariables() {
    const envFile = getEnvFile();
    const envPath = path.resolve(process.cwd(), envFile);
    if (!fs.existsSync(envPath)) {
        return {};
    }
    const result = dotenv.config({ path: envPath });
    if (result.error) {
        return {};
    }
    return result.parsed || {};
}
/**
 * Generate JavaScript code to set global variables
 */
function generateEnvScript(envVars) {
    const isElectron = process.argv.includes('--electron') || process.env.ELECTRON_ENV;
    // Set default values with Electron-specific handling
    const config = {
        PRODUCTION_ENV: envVars.PRODUCTION_ENV === 'true' || false,
        STAGING_ENV: envVars.STAGING_ENV === 'true' || false,
        LOCAL_ENV: envVars.LOCAL_ENV === 'true' || true,
        TEST_ENV: envVars.TEST_ENV === 'true' || false,
        AppUrl: isElectron ? './' : (envVars.APP_URL || 'http://localhost:3000/'),
        ApiUrl: envVars.API_URL || 'https://apitest.giddh.com/',
        UkApiUrl: envVars.UK_API_URL || 'https://gbapi.giddh.com/',
        PORTAL_URL: envVars.PORTAL_URL || 'https://master.d2n1i21e52r793.amplifyapp.com/',
        isElectron: isElectron,
        APP_FOLDER: envVars.APP_FOLDER || '',
        GOOGLE_CLIENT_ID: envVars.GOOGLE_CLIENT_ID || envVars.GOOGLE_CLIENT_ID_TEST || '',
        GOOGLE_CLIENT_SECRET: envVars.GOOGLE_CLIENT_SECRET || envVars.GOOGLE_CLIENT_SECRET_TEST || '',
        OTP_WIDGET_ID: envVars.OTP_WIDGET_ID || '',
        OTP_TOKEN_AUTH: envVars.OTP_TOKEN_AUTH || '',
        RAZORPAY_KEY: envVars.RAZORPAY_KEY || envVars.RAZORPAY_KEY_TEST || ''
    };
    // Generate script content
    let script = '<!-- Environment Variables - Injected at Build Time -->\n<script>\n';
    Object.keys(config).forEach(key => {
        const value = typeof config[key] === 'string' ? `"${config[key]}"` : config[key];
        script += `  window.${key} = ${value};\n`;
    });
    script += '</script>\n';
    return script;
}
/**
 * Inject environment variables into HTML file
 */
function injectIntoHtml(htmlFilePath, envScript) {
    if (!fs.existsSync(htmlFilePath)) {
        return false;
    }
    let htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
    // Remove any existing environment script
    htmlContent = htmlContent.replace(/<!-- Environment Variables - Injected at Build Time -->[\s\S]*?<\/script>\n/g, '');
    // Inject new environment script before closing </head> tag
    htmlContent = htmlContent.replace('</head>', `  ${envScript}</head>`);
    fs.writeFileSync(htmlFilePath, htmlContent);
    return true;
}
/**
 * Main execution function
 */
function main() {
    try {
        // Load environment variables
        const envVars = loadEnvironmentVariables();
        // Generate environment script
        const envScript = generateEnvScript(envVars);
        // Determine HTML file path
        const args = process.argv.slice(2);
        const htmlFile = args.find(arg => arg.endsWith('.html')) || 'dist/apps/web-giddh/index.html';
        const htmlPath = path.resolve(process.cwd(), htmlFile);
        // Inject into HTML
        if (injectIntoHtml(htmlPath, envScript)) {
        } else {
            process.exit(1);
        }
    } catch (error) {
        process.exit(1);
    }
}
// Run if called directly
if (require.main === module) {
    main();
}
module.exports = {
    getEnvFile,
    loadEnvironmentVariables,
    generateEnvScript,
    injectIntoHtml,
    main
};
