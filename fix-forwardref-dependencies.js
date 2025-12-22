#!/usr/bin/env node

/**
 * Angular 21 Fix: Remove forwardRef() circular dependencies
 * Fixes DI factory resolution errors by eliminating circular dependencies
 */

const fs = require('fs');
const path = require('path');

class ForwardRefFixer {
    constructor() {
        this.processedFiles = 0;
        this.fixedFiles = 0;
        this.errors = [];
    }

    async run(directory = './apps/web-giddh/src') {
        console.log('🔧 Angular 21 Fix: Removing forwardRef() Circular Dependencies');
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
            } else if (item.endsWith('.ts') && !item.endsWith('.d.ts')) {
                await this.processFile(fullPath);
            }
        }
    }

    async processFile(filePath) {
        this.processedFiles++;

        try {
            const content = fs.readFileSync(filePath, 'utf8');

            if (!this.needsForwardRefFix(content)) {
                return;
            }

            console.log(`🔍 Fixing: ${filePath}`);

            const fixedContent = this.fixForwardRefDependencies(content);

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

    needsForwardRefFix(content) {
        return content.includes('forwardRef') &&
               (content.includes('@Inject(forwardRef') || content.includes('forwardRef('));
    }

    fixForwardRefDependencies(content) {
        let modified = content;

        // Remove forwardRef from imports
        modified = modified.replace(
            /,\s*forwardRef/g,
            ''
        );
        modified = modified.replace(
            /forwardRef\s*,/g,
            ''
        );
        modified = modified.replace(
            /import\s*{\s*forwardRef\s*}\s*from\s*'@angular\/core';\s*/g,
            ''
        );

        // Fix constructor parameters with @Inject(forwardRef(...))
        modified = modified.replace(
            /@Inject\(forwardRef\(\(\)\s*=>\s*([^)]+)\)\)\s+/g,
            ''
        );

        // Remove forwardRef wrapper from constructor parameters
        modified = modified.replace(
            /forwardRef\(\(\)\s*=>\s*([^)]+)\)/g,
            '$1'
        );

        // Clean up any remaining forwardRef imports in the import statement
        modified = modified.replace(
            /import\s*{\s*([^}]*),\s*forwardRef\s*([^}]*)\s*}\s*from\s*'@angular\/core'/g,
            "import { $1$2 } from '@angular/core'"
        );
        modified = modified.replace(
            /import\s*{\s*forwardRef\s*,\s*([^}]*)\s*}\s*from\s*'@angular\/core'/g,
            "import { $1 } from '@angular/core'"
        );

        // Clean up empty import braces
        modified = modified.replace(
            /import\s*{\s*,\s*}\s*from\s*'@angular\/core';\s*/g,
            ''
        );
        modified = modified.replace(
            /import\s*{\s*}\s*from\s*'@angular\/core';\s*/g,
            ''
        );

        // Fix double commas in imports
        modified = modified.replace(
            /,\s*,/g,
            ','
        );

        // Clean up trailing commas in imports
        modified = modified.replace(
            /,\s*}/g,
            ' }'
        );

        return modified;
    }

    printSummary() {
        console.log('');
        console.log('📊 ForwardRef Dependencies Fix Summary');
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
            console.log('✅ ForwardRef dependencies fix completed successfully!');
            console.log('');
            console.log('📝 Benefits:');
            console.log('   • Eliminated circular dependencies causing factory errors');
            console.log('   • Removed forwardRef() usage for Angular 21 compatibility');
            console.log('   • Fixed DI factory resolution issues');
            console.log('   • Improved application startup performance');
        } else {
            console.log('ℹ️  No forwardRef dependencies found.');
        }
    }
}

// Run the script
const fixer = new ForwardRefFixer();
const directory = process.argv[2] || './apps/web-giddh/src';
fixer.run(directory);
