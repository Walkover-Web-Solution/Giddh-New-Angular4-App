#!/usr/bin/env node

/**
 * Electron Build Fix Script
 *
 * This script fixes common Electron build issues including:
 * - isElectron environment variable configuration
 * - File protocol handling
 * - Asset loading issues
 * - CookieYes script conflicts
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Electron build issues...\n');

/**
 * Fix index.html for Electron compatibility
 */
function fixIndexHtml() {
    const indexPath = path.resolve(__dirname, '../dist/apps/web-giddh/index.html');

    if (!fs.existsSync(indexPath)) {
        console.warn('⚠️  Warning: index.html not found. Build the app first.');
        return;
    }

    console.log('📝 Fixing index.html for Electron...');

    let indexContent = fs.readFileSync(indexPath, 'utf8');

    // Remove CookieYes script that causes issues in Electron
    indexContent = indexContent.replace(
        /<script[^>]*cookieyes[^>]*>.*?<\/script>/gi,
        '<!-- CookieYes script removed for Electron compatibility -->'
    );

    // Remove clarity.js that causes file:// protocol issues
    indexContent = indexContent.replace(
        /<script[^>]*clarity[^>]*>.*?<\/script>/gi,
        '<!-- Clarity script removed for Electron compatibility -->'
    );

    // Fix base href for Electron
    indexContent = indexContent.replace(
        /<base href="[^"]*">/,
        '<base href="./">'
    );

    // Add Electron-specific meta tags
    const electronMeta = `
    <!-- Electron-specific configuration -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval' data: https:; img-src 'self' data: https:;">
    <script>
        // Electron environment detection
        window.isElectron = true;
        window.electronAPI = window.require ? window.require('electron') : null;
    </script>
`;

    indexContent = indexContent.replace('</head>', `${electronMeta}</head>`);

    fs.writeFileSync(indexPath, indexContent);
    console.log('✅ Fixed index.html for Electron compatibility');
}

/**
 * Create Electron-specific environment file
 */
function createElectronEnvironment() {
    console.log('🌍 Creating Electron environment configuration...');

    const envContent = `
// Electron-specific environment configuration
(function() {
    if (typeof window !== 'undefined') {
        window.isElectron = true;
        window.electronEnvironment = {
            isElectron: true,
            isDevelopment: true,
            appUrl: 'http://localhost:4200/',
            apiUrl: 'https://apitest.giddh.com/'
        };

        // Disable problematic scripts in Electron
        window.cookieYesDisabled = true;
        window.clarityDisabled = true;
    }
})();
`;

    const envPath = path.resolve(__dirname, '../dist/apps/web-giddh/electron-env.js');
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created electron-env.js');
}

/**
 * Fix package.json for Electron
 */
function fixPackageJson() {
    const packagePath = path.resolve(__dirname, '../dist/apps/web-giddh/package.json');

    if (!fs.existsSync(packagePath)) {
        console.log('📦 Creating package.json for Electron...');

        const packageContent = {
            "name": "giddh-electron",
            "version": "1.0.0",
            "description": "Giddh Electron Application",
            "main": "index.js",
            "homepage": "./",
            "author": "Giddh Team",
            "license": "MIT"
        };

        fs.writeFileSync(packagePath, JSON.stringify(packageContent, null, 2));
        console.log('✅ Created package.json for Electron');
    }
}

/**
 * Copy Electron main files
 */
function copyElectronFiles() {
    console.log('📂 Copying Electron main process files...');

    const electronSrcDir = path.resolve(__dirname, '../apps/electron-giddh/src');
    const electronDistDir = path.resolve(__dirname, '../dist/apps/web-giddh');

    // Copy compiled JavaScript files
    const filesToCopy = [
        'index.js',
        'WindowManager.js',
        'StateManager.js',
        'AppMenuManager.js',
        'main-auth.config.js',
        'util.js'
    ];

    filesToCopy.forEach(file => {
        const srcPath = path.join(electronSrcDir, file);
        const destPath = path.join(electronDistDir, file);

        if (fs.existsSync(srcPath)) {
            fs.copyFileSync(srcPath, destPath);
            console.log(`✅ Copied ${file}`);
        } else {
            console.warn(`⚠️  Warning: ${file} not found in ${electronSrcDir}`);
        }
    });
}

/**
 * Main execution
 */
function main() {
    try {
        fixIndexHtml();
        createElectronEnvironment();
        fixPackageJson();
        copyElectronFiles();

        console.log('\n✅ Electron build fixes completed successfully!');
        console.log('\n📋 Next steps:');
        console.log('1. Run: npm run build:electron');
        console.log('2. Run: npm run electron:build');
        console.log('3. Test the Electron app');

    } catch (error) {
        console.error('\n❌ Error fixing Electron build:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = {
    fixIndexHtml,
    createElectronEnvironment,
    fixPackageJson,
    copyElectronFiles,
    main
};
