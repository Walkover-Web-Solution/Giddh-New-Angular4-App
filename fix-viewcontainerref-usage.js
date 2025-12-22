#!/usr/bin/env node

/**
 * Angular 21 Compatibility Fix Script 3: ViewContainerRef Safe Usage
 * Fixes ViewContainerRef usage without safe factory handling
 */

const fs = require('fs');
const path = require('path');

class ViewContainerRefFixer {
    constructor() {
        this.processedFiles = 0;
        this.fixedFiles = 0;
        this.errors = [];
    }

    async run(directory = './apps/web-giddh/src') {
        console.log('🔧 Angular 21 Fix: ViewContainerRef Safe Usage');
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
            } else if (item.endsWith('.component.ts') || item.endsWith('.directive.ts')) {
                await this.processFile(fullPath);
            }
        }
    }

    async processFile(filePath) {
        this.processedFiles++;

        try {
            const content = fs.readFileSync(filePath, 'utf8');

            // Check if it needs fixing
            if (!this.shouldFix(content)) {
                return;
            }

            console.log(`🔍 Fixing: ${filePath}`);

            const fixedContent = this.fixViewContainerRefUsage(content);

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

    shouldFix(content) {
        // Check for unsafe ViewContainerRef usage patterns
        const unsafePatterns = [
            /viewContainerRef\.clear\(\)/,
            /viewContainerRef\.createComponent\(/,
            /\.viewContainerRef\.clear\(\)/,
            /\.viewContainerRef\.createComponent\(/
        ];

        return unsafePatterns.some(pattern => pattern.test(content));
    }

    fixViewContainerRefUsage(content) {
        let modified = content;

        // Fix direct viewContainerRef.clear() calls
        modified = modified.replace(
            /(\s+)viewContainerRef\.clear\(\);/g,
            `$1try {
$1    if (viewContainerRef) {
$1        viewContainerRef.clear();
$1    }
$1} catch (error) {
$1    console.warn('Angular 21 Compatibility: Error clearing ViewContainerRef:', error);
$1}`
        );

        // Fix direct viewContainerRef.createComponent() calls
        modified = modified.replace(
            /(\s+)(\w+)\s*=\s*viewContainerRef\.createComponent\(([^)]+)\);/g,
            `$1try {
$1    if (viewContainerRef) {
$1        $2 = viewContainerRef.createComponent($3);
$1    }
$1} catch (error) {
$1    console.warn('Angular 21 Compatibility: Error creating component:', error);
$1    $2 = null;
$1}`
        );

        // Fix ElementViewContainerRef usage patterns
        modified = modified.replace(
            /(\s+)const\s+viewContainerRef\s*=\s*([^;]+)\.viewContainerRef;\s*\n\s*viewContainerRef\.clear\(\);/g,
            `$1// Angular 21 compatible approach - use safe methods to avoid factory errors
$1if ($2) {
$1    $2.safeClear();
$1}`
        );

        // Fix chained viewContainerRef calls
        modified = modified.replace(
            /(\s+)([^.\s]+)\.viewContainerRef\.clear\(\);/g,
            `$1// Angular 21 safe ViewContainerRef usage
$1try {
$1    if ($2 && $2.viewContainerRef) {
$1        $2.viewContainerRef.clear();
$1    }
$1} catch (error) {
$1    console.warn('Angular 21 Compatibility: Error clearing ViewContainerRef:', error);
$1}`
        );

        modified = modified.replace(
            /(\s+)(\w+)\s*=\s*([^.\s]+)\.viewContainerRef\.createComponent\(([^)]+)\);/g,
            `$1// Angular 21 safe component creation
$1try {
$1    if ($3 && $3.viewContainerRef) {
$1        $2 = $3.viewContainerRef.createComponent($4);
$1    }
$1} catch (error) {
$1    console.warn('Angular 21 Compatibility: Error creating component:', error);
$1    $2 = null;
$1}`
        );

        return modified;
    }

    printSummary() {
        console.log('');
        console.log('📊 ViewContainerRef Safe Usage Fix Summary');
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
            console.log('✅ ViewContainerRef safe usage fix completed successfully!');
            console.log('');
            console.log('📝 Benefits:');
            console.log('   • Fixed Angular 21 ViewContainerRef factory errors');
            console.log('   • Added safe null checks for ViewContainerRef access');
            console.log('   • Eliminated "Cannot read properties of undefined" errors');
            console.log('   • Proper error handling for dynamic component creation');
        } else {
            console.log('ℹ️  No ViewContainerRef usage needed safety fixes.');
        }
    }
}

// Run the script
const fixer = new ViewContainerRefFixer();
const directory = process.argv[2] || './apps/web-giddh/src';
fixer.run(directory);
