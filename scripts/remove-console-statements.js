#!/usr/bin/env node

/**
 * Console Statement Removal Script
 * Safely removes console.log, console.warn, console.error statements while preserving code structure
 */

import fs from 'fs';
import path from 'path';

// Files to process
const filesToProcess = [
    '/Users/dilpreetsingh/Desktop/Projects/Update Angular/Giddh-New-Angular4-App/apps/web-giddh/src/app/app.module.ts',
    '/Users/dilpreetsingh/Desktop/Projects/Update Angular/Giddh-New-Angular4-App/apps/web-giddh/src/app/shared/template-froala/template-froala.component.ts',
    '/Users/dilpreetsingh/Desktop/Projects/Update Angular/Giddh-New-Angular4-App/apps/web-giddh/src/app/shared/services/froala-loader.service.ts',
    '/Users/dilpreetsingh/Desktop/Projects/Update Angular/Giddh-New-Angular4-App/apps/web-giddh/src/assets/js/electron-init.js',
    '/Users/dilpreetsingh/Desktop/Projects/Update Angular/Giddh-New-Angular4-App/scripts/advanced-bundle-optimizer.js',
    '/Users/dilpreetsingh/Desktop/Projects/Update Angular/Giddh-New-Angular4-App/scripts/application-improvement-suite.js',
    '/Users/dilpreetsingh/Desktop/Projects/Update Angular/Giddh-New-Angular4-App/scripts/build-electron-env.js',
    '/Users/dilpreetsingh/Desktop/Projects/Update Angular/Giddh-New-Angular4-App/scripts/build-env.js',
    '/Users/dilpreetsingh/Desktop/Projects/Update Angular/Giddh-New-Angular4-App/scripts/build-success-message.js',
    '/Users/dilpreetsingh/Desktop/Projects/Update Angular/Giddh-New-Angular4-App/scripts/bundle-optimization.js',
    '/Users/dilpreetsingh/Desktop/Projects/Update Angular/Giddh-New-Angular4-App/scripts/clean-old-builds.js',
    '/Users/dilpreetsingh/Desktop/Projects/Update Angular/Giddh-New-Angular4-App/scripts/debug-cleanup.js',
    '/Users/dilpreetsingh/Desktop/Projects/Update Angular/Giddh-New-Angular4-App/scripts/detect-branch-env.js',
    '/Users/dilpreetsingh/Desktop/Projects/Update Angular/Giddh-New-Angular4-App/scripts/documentation-generator.js',
    '/Users/dilpreetsingh/Desktop/Projects/Update Angular/Giddh-New-Angular4-App/scripts/fix-electron-build.js',
    '/Users/dilpreetsingh/Desktop/Projects/Update Angular/Giddh-New-Angular4-App/scripts/focused-bundle-optimizer.js',
    '/Users/dilpreetsingh/Desktop/Projects/Update Angular/Giddh-New-Angular4-App/scripts/heavy-dependency-optimizer.js',
    '/Users/dilpreetsingh/Desktop/Projects/Update Angular/Giddh-New-Angular4-App/scripts/inject-env-vars.js',
    '/Users/dilpreetsingh/Desktop/Projects/Update Angular/Giddh-New-Angular4-App/scripts/material-import-optimizer.js',
    '/Users/dilpreetsingh/Desktop/Projects/Update Angular/Giddh-New-Angular4-App/scripts/quick-bundle-reducer.js',
    '/Users/dilpreetsingh/Desktop/Projects/Update Angular/Giddh-New-Angular4-App/scripts/safe-debug-cleanup.js',
    '/Users/dilpreetsingh/Desktop/Projects/Update Angular/Giddh-New-Angular4-App/scripts/targeted-debug-cleanup.js',
    '/Users/dilpreetsingh/Desktop/Projects/Update Angular/Giddh-New-Angular4-App/scripts/targeted-documentation.js',
    '/Users/dilpreetsingh/Desktop/Projects/Update Angular/Giddh-New-Angular4-App/scripts/tree-shaking-optimizer.js'
];

function removeConsoleStatements(content) {
    // Remove various console statement patterns
    const patterns = [
        // Single line console statements
        /^\s*console\.(log|warn|error|info|debug)\([^;]*\);\s*$/gm,
        // Multi-line console statements
        /^\s*console\.(log|warn|error|info|debug)\([^)]*\n[^)]*\);\s*$/gm,
        // Console statements with template literals
        /^\s*console\.(log|warn|error|info|debug)\(`[^`]*`[^;]*\);\s*$/gm,
        // Console statements with string concatenation
        /^\s*console\.(log|warn|error|info|debug)\([^;]*\+[^;]*\);\s*$/gm,
    ];

    let result = content;

    patterns.forEach(pattern => {
        result = result.replace(pattern, '');
    });

    // Remove empty lines that were left behind
    result = result.replace(/^\s*\n/gm, '');

    return result;
}

function processFile(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            return;
        }

        const content = fs.readFileSync(filePath, 'utf8');
        const originalLines = content.split('\n').length;

        const cleanedContent = removeConsoleStatements(content);
        const cleanedLines = cleanedContent.split('\n').length;

        if (content !== cleanedContent) {
            fs.writeFileSync(filePath, cleanedContent, 'utf8');
            const linesRemoved = originalLines - cleanedLines;
            console.log(`✅ ${path.basename(filePath)}: Removed ${linesRemoved} lines with console statements`);
        }
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
    }
}

// Process all files
filesToProcess.forEach(processFile);

console.log('🎯 Console statement removal completed for all specified files');
