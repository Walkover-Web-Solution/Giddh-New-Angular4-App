#!/usr/bin/env node

/**
 * Angular 21 Fix: Replace barrel imports with direct imports
 * Fixes DI factory resolution issues caused by complex barrel exports
 */

const fs = require('fs');
const path = require('path');

class BarrelImportsFixer {
    constructor() {
        this.processedFiles = 0;
        this.fixedFiles = 0;
        this.errors = [];
        this.barrelMappings = {
            // Store barrel mappings
            '../store': '../store/roots',
            './store': './store/roots',
            '../../store': '../../store/roots',
            '../../../store': '../../../store/roots',

            // Theme barrel mappings
            '../theme': '../theme/confirmation-modal/confirmation-modal.component',
            './theme': './theme/confirmation-modal/confirmation-modal.component',

            // Shared helpers barrel mappings
            '../shared/helpers': '../shared/helpers/customValidationHelper',
            './shared/helpers': './shared/helpers/customValidationHelper',
            '../../shared/helpers': '../../shared/helpers/customValidationHelper',
        };
    }

    async run(directory = './apps/web-giddh/src') {
        console.log('🔧 Angular 21 Fix: Replacing Barrel Imports with Direct Imports');
        console.log('=' .repeat(70));
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
            } else if (item.endsWith('.ts') && !item.endsWith('.d.ts') && !item.includes('index.ts')) {
                await this.processFile(fullPath);
            }
        }
    }

    async processFile(filePath) {
        this.processedFiles++;

        try {
            const content = fs.readFileSync(filePath, 'utf8');

            if (!this.needsBarrelImportFix(content)) {
                return;
            }

            console.log(`🔍 Fixing: ${filePath}`);

            const fixedContent = this.fixBarrelImports(content);

            if (fixedContent !== content) {
                fs.writeFileSync(filePath, fixedContent, 'utf8');
                this.fixedFiles++;
                console.log(`✅ Fixed: ${filePath}`);
            }

        } catch (error) {
            this.errors.push(`${filePath}: ${error.message}`);
            console.error(`❌ Error processing ${filePath}:`, error.message);
        }
    }

    needsBarrelImportFix(content) {
        // Check for barrel imports that need to be replaced
        return Object.keys(this.barrelMappings).some(barrel =>
            content.includes(`from '${barrel}'`) || content.includes(`from "${barrel}"`)
        );
    }

    fixBarrelImports(content) {
        let modified = content;

        // Replace barrel imports with direct imports
        Object.entries(this.barrelMappings).forEach(([barrel, direct]) => {
            // Handle single quotes
            modified = modified.replace(
                new RegExp(`from '${barrel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`, 'g'),
                `from '${direct}'`
            );

            // Handle double quotes
            modified = modified.replace(
                new RegExp(`from "${barrel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g'),
                `from "${direct}"`
            );
        });

        // Fix specific common barrel import patterns

        // Fix AppState imports from store barrel
        modified = modified.replace(
            /import\s*{\s*([^}]*AppState[^}]*)\s*}\s*from\s*['"]\.\.?\/\.\.?\/store['"]/g,
            "import { $1 } from '../store/roots'"
        );

        // Fix reducers imports from store barrel
        modified = modified.replace(
            /import\s*{\s*([^}]*reducers[^}]*)\s*}\s*from\s*['"]\.\.?\/\.\.?\/store['"]/g,
            "import { $1 } from '../store/roots'"
        );

        return modified;
    }

    printSummary() {
        console.log('');
        console.log('📊 Barrel Imports Fix Summary');
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
            console.log('✅ Barrel imports fix completed successfully!');
            console.log('');
            console.log('📝 Benefits:');
            console.log('   • Replaced barrel imports with direct imports');
            console.log('   • Fixed Angular 21 DI factory resolution issues');
            console.log('   • Improved tree-shaking and bundle optimization');
            console.log('   • Eliminated circular dependency risks from barrel exports');
        } else {
            console.log('ℹ️  No barrel imports found that needed fixing.');
        }
    }
}

// Run the script
const fixer = new BarrelImportsFixer();
const directory = process.argv[2] || './apps/web-giddh/src';
fixer.run(directory);
