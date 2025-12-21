#!/usr/bin/env node

/**
 * Fix Angular 21 Migration Compilation Errors
 * Addresses issues created by the subscription migration script
 */

const fs = require('fs');
const path = require('path');

class CompilationErrorFixer {
    constructor() {
        this.processedFiles = 0;
        this.fixedFiles = 0;
        this.errors = [];
    }

    async run(directory = './apps/web-giddh/src') {
        console.log('🔧 Fixing Angular 21 Migration Compilation Errors');
        console.log('=' .repeat(60));
        console.log(`📁 Processing directory: ${directory}`);
        console.log('');

        try {
            await this.processDirectory(directory);
            this.printSummary();
        } catch (error) {
            console.error('❌ Script failed:', error.message);
            process.exit(1);
        }
    }

    async processDirectory(dir) {
        const items = fs.readdirSync(dir);

        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                if (!['node_modules', '.git', 'dist', 'build'].includes(item)) {
                    await this.processDirectory(fullPath);
                }
            } else if (item.endsWith('.component.ts') || item.endsWith('.service.ts')) {
                await this.processFile(fullPath);
            }
        }
    }

    async processFile(filePath) {
        this.processedFiles++;

        try {
            const content = fs.readFileSync(filePath, 'utf8');
            let modifiedContent = content;
            let hasChanges = false;

            // Fix 1: Remove duplicate property declarations
            const duplicateSubscriptionsPattern = /(private\s+subscriptions:\s*Subscription\[\]\s*=\s*\[\];\s*[\s\S]*?)(private\s+subscriptions:\s*Subscription\[\]\s*=\s*\[\];)/g;
            if (duplicateSubscriptionsPattern.test(modifiedContent)) {
                modifiedContent = modifiedContent.replace(duplicateSubscriptionsPattern, '$1');
                hasChanges = true;
                console.log(`🔧 Fixed duplicate subscriptions in: ${filePath}`);
            }

            const duplicateIsDestroyingPattern = /(private\s+isDestroying\s*=\s*false;\s*[\s\S]*?)(private\s+isDestroying\s*=\s*false;)/g;
            if (duplicateIsDestroyingPattern.test(modifiedContent)) {
                modifiedContent = modifiedContent.replace(duplicateIsDestroyingPattern, '$1');
                hasChanges = true;
                console.log(`🔧 Fixed duplicate isDestroying in: ${filePath}`);
            }

            // Fix 2: Add missing Subscription import
            if (modifiedContent.includes('Subscription[]') && !modifiedContent.includes('import { Subscription }') && !modifiedContent.includes('import {') && !modifiedContent.includes('Subscription')) {
                const rxjsImportPattern = /import\s*{\s*([^}]*)\s*}\s*from\s*['"]rxjs['"];?/;
                if (rxjsImportPattern.test(modifiedContent)) {
                    modifiedContent = modifiedContent.replace(
                        rxjsImportPattern,
                        (match, imports) => {
                            if (!imports.includes('Subscription')) {
                                return match.replace(imports, `${imports.trim()}, Subscription`);
                            }
                            return match;
                        }
                    );
                    hasChanges = true;
                    console.log(`🔧 Added Subscription import to: ${filePath}`);
                } else if (modifiedContent.includes('from \'rxjs\'')) {
                    // Add Subscription to existing rxjs import
                    modifiedContent = modifiedContent.replace(
                        /import\s*{\s*([^}]*)\s*}\s*from\s*['"]rxjs['"];?/,
                        (match, imports) => {
                            if (!imports.includes('Subscription')) {
                                return match.replace(imports, `${imports.trim()}, Subscription`);
                            }
                            return match;
                        }
                    );
                    hasChanges = true;
                    console.log(`🔧 Added Subscription to existing rxjs import in: ${filePath}`);
                } else {
                    // Add new rxjs import
                    const firstImportPattern = /^(import\s+[^;]+;)/m;
                    if (firstImportPattern.test(modifiedContent)) {
                        modifiedContent = modifiedContent.replace(
                            firstImportPattern,
                            `$1\nimport { Subscription } from 'rxjs';`
                        );
                        hasChanges = true;
                        console.log(`🔧 Added new Subscription import to: ${filePath}`);
                    }
                }
            }

            // Fix 3: Add missing property declarations for components that have ngOnDestroy logic but missing properties
            if (modifiedContent.includes('this.subscriptions.forEach') && !modifiedContent.includes('private subscriptions: Subscription[]')) {
                // Find the class declaration and add missing properties
                const classPattern = /(export\s+class\s+\w+[^{]*{)/;
                if (classPattern.test(modifiedContent)) {
                    modifiedContent = modifiedContent.replace(
                        classPattern,
                        `$1
    /** Track subscriptions manually for Angular 21 compatibility */
    private subscriptions: Subscription[] = [];
    /** Flag to track component destruction state */
    private isDestroying = false;`
                    );
                    hasChanges = true;
                    console.log(`🔧 Added missing properties to: ${filePath}`);
                }
            }

            // Fix 4: Add missing isDestroying property
            if (modifiedContent.includes('this.isDestroying = true') && !modifiedContent.includes('private isDestroying')) {
                const subscriptionsPattern = /(private\s+subscriptions:\s*Subscription\[\]\s*=\s*\[\];)/;
                if (subscriptionsPattern.test(modifiedContent)) {
                    modifiedContent = modifiedContent.replace(
                        subscriptionsPattern,
                        `$1
    /** Flag to track component destruction state */
    private isDestroying = false;`
                    );
                    hasChanges = true;
                    console.log(`🔧 Added missing isDestroying property to: ${filePath}`);
                }
            }

            if (hasChanges) {
                fs.writeFileSync(filePath, modifiedContent, 'utf8');
                this.fixedFiles++;
                console.log(`✅ Fixed compilation errors in: ${filePath}`);
            }

        } catch (error) {
            this.errors.push(`${filePath}: ${error.message}`);
            console.error(`❌ Error processing ${filePath}:`, error.message);
        }
    }

    printSummary() {
        console.log('');
        console.log('📊 Compilation Error Fix Summary');
        console.log('=' .repeat(40));
        console.log(`📁 Files processed: ${this.processedFiles}`);
        console.log(`✅ Files fixed: ${this.fixedFiles}`);
        console.log(`❌ Errors: ${this.errors.length}`);

        if (this.errors.length > 0) {
            console.log('');
            console.log('❌ Errors encountered:');
            this.errors.forEach(error => console.log(`   ${error}`));
        }

        console.log('');
        if (this.fixedFiles > 0) {
            console.log('✅ Compilation errors fixed successfully!');
            console.log('');
            console.log('📝 Next steps:');
            console.log('   1. Run npm run build to verify compilation');
            console.log('   2. Test the application for onDestroy errors');
        } else {
            console.log('ℹ️  No compilation errors found to fix.');
        }
    }
}

// Run the script
const fixer = new CompilationErrorFixer();
const directory = process.argv[2] || './apps/web-giddh/src';
fixer.run(directory);
