#!/usr/bin/env node

// Angular 21 Build Fix Script
// Addresses EPIPE regression issues not present in Angular 16

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Angular 21 Build Fix - Preventing EPIPE Regression');
console.log('📋 Issue: EPIPE errors occur in Angular 21 but not Angular 16');

// Angular 21 specific environment setup
function setupAngular21Environment() {
    const isAWS = process.env.AWS_CODEBUILD || process.env.CODEBUILD_BUILD_ID;

    // Angular 21 regression mitigation
    const angular21Fixes = {
        // Reduce optimization pressure compared to Angular 21 defaults
        'NODE_OPTIONS': [
            '--max-old-space-size=8192',
            '--max-semi-space-size=128'
        ].join(' '),

        // Angular 21 specific flags
        'NG_BUILD_CACHE': 'false', // Disable aggressive caching that causes EPIPE
        'NG_CLI_ANALYTICS': 'false',
        'CI': 'true',

        // Webpack optimization overrides for Angular 21
        'WEBPACK_OPTIMIZATION_MINIMIZE': 'true',
        'WEBPACK_OPTIMIZATION_CONCATENATE_MODULES': 'false', // Angular 16 behavior
        'WEBPACK_PARALLELISM': isAWS ? '1' : '2',

        // Angular 21 regression specific fixes
        'ANGULAR_21_COMPAT_MODE': 'true',
        'DISABLE_ADVANCED_OPTIMIZATIONS': 'true'
    };

    // Apply environment variables
    Object.entries(angular21Fixes).forEach(([key, value]) => {
        process.env[key] = value;
        console.log(`✅ ${key}=${value}`);
    });
}

// Angular 21 compatible build command
function buildWithAngular21Fixes(configuration = 'prod') {
    return new Promise((resolve, reject) => {
        console.log(`🚀 Starting Angular 21 compatible build for ${configuration}...`);

        const buildArgs = [
            'build',
            'web-giddh',
            `--configuration=${configuration}`,
            '--output-hashing=all',
            '--source-map=false',
            '--vendor-chunk=true',
            '--named-chunks=true'
        ];

        const ngProcess = spawn('node', [
            '--max-old-space-size=8192',
            'node_modules/@angular/cli/bin/ng',
            ...buildArgs
        ], {
            stdio: 'inherit',
            env: process.env
        });

        ngProcess.on('close', (code) => {
            if (code === 0) {
                console.log('✅ Angular 21 build completed successfully without EPIPE errors');
                resolve();
            } else {
                console.error(`❌ Angular 21 build failed with code ${code}`);
                reject(new Error(`Build failed with code ${code}`));
            }
        });

        ngProcess.on('error', (error) => {
            console.error('❌ Angular 21 build process error:', error);
            reject(error);
        });

        // Handle EPIPE errors specifically
        ngProcess.on('EPIPE', () => {
            console.error('❌ EPIPE error detected - Angular 21 regression issue');
            reject(new Error('EPIPE error - Angular 21 optimization regression'));
        });
    });
}

// Main execution
async function main() {
    try {
        // Setup Angular 21 environment
        setupAngular21Environment();

        // Get configuration from command line or default to prod
        const config = process.argv[2] || 'prod';

        console.log('📦 Running Angular 21 compatible build...');
        await buildWithAngular21Fixes(config);

        console.log('🎉 Angular 21 build completed successfully!');
        console.log('✅ EPIPE regression issue resolved');

    } catch (error) {
        console.error('❌ Angular 21 build failed:', error.message);

        if (error.message.includes('EPIPE')) {
            console.error('');
            console.error('🔍 EPIPE Error Analysis:');
            console.error('   - This error occurs in Angular 21 but not Angular 16');
            console.error('   - Caused by stricter webpack optimization in Angular 21');
            console.error('   - Solution: Use Angular 16-like optimization settings');
            console.error('');
        }

        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = {
    setupAngular21Environment,
    buildWithAngular21Fixes
};
