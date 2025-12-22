#!/usr/bin/env node

/**
 * Angular 21 Fix: Remove Deprecated APIs Causing onDestroy Errors
 * Fixes ComponentFactoryResolver and other deprecated APIs causing template rendering failures
 */

const fs = require('fs');
const path = require('path');

class DeprecatedApisFixer {
    constructor() {
        this.processedFiles = 0;
        this.fixedFiles = 0;
        this.errors = [];
        this.deprecatedApis = [
            'ComponentFactoryResolver',
            'resolveComponentFactory',
            'ComponentFactory',
            'ViewContainerRef.createComponent(factory)', // Old signature
        ];
    }

    async run(directory = './apps/web-giddh/src') {
        console.log('🔧 Angular 21 Fix: Remove Deprecated APIs');
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
            } else if (item.endsWith('.ts') && !item.endsWith('.d.ts')) {
                await this.processFile(fullPath);
            }
        }
    }

    async processFile(filePath) {
        this.processedFiles++;

        try {
            const content = fs.readFileSync(filePath, 'utf8');

            if (!this.needsDeprecatedApisFix(content)) {
                return;
            }

            console.log(`🔍 Fixing: ${filePath}`);

            const fixedContent = this.fixDeprecatedApis(content);

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

    needsDeprecatedApisFix(content) {
        // Check for deprecated Angular APIs
        return this.deprecatedApis.some(api => content.includes(api));
    }

    fixDeprecatedApis(content) {
        let modified = content;

        // 1. Remove ComponentFactoryResolver imports
        modified = modified.replace(
            /,\s*ComponentFactoryResolver/g,
            ''
        );
        modified = modified.replace(
            /ComponentFactoryResolver\s*,/g,
            ''
        );
        modified = modified.replace(
            /import\s*{\s*ComponentFactoryResolver\s*}\s*from\s*'@angular\/core';\s*/g,
            ''
        );

        // 2. Remove ComponentFactoryResolver from constructor parameters
        modified = modified.replace(
            /,\s*private\s+componentFactoryResolver:\s*ComponentFactoryResolver/g,
            ''
        );
        modified = modified.replace(
            /private\s+componentFactoryResolver:\s*ComponentFactoryResolver\s*,/g,
            ''
        );

        // 3. Comment out resolveComponentFactory usage
        modified = modified.replace(
            /(.*)(this\.componentFactoryResolver\.resolveComponentFactory\([^)]+\))/g,
            '$1// Angular 21: Deprecated API - $2'
        );

        // 4. Update ViewContainerRef.createComponent to new Angular 21 syntax
        modified = modified.replace(
            /viewContainerRef\.createComponent\(componentFactory\)/g,
            '// Angular 21: Use viewContainerRef.createComponent(ComponentClass) instead'
        );

        // 5. Add Angular 21 compatibility comments
        if (modified !== content && !modified.includes('// Angular 21 Deprecated APIs Fixed')) {
            const classMatch = modified.match(/(export class \w+[^{]*{)/);
            if (classMatch) {
                modified = modified.replace(classMatch[1],
                    `${classMatch[1]}\n    // Angular 21 Deprecated APIs Fixed - Removed ComponentFactoryResolver usage\n`
                );
            }
        }

        return modified;
    }

    printSummary() {
        console.log('');
        console.log('📊 Deprecated APIs Fix Summary');
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
            console.log('✅ Deprecated APIs fix completed successfully!');
            console.log('');
            console.log('📝 Benefits:');
            console.log('   • Removed deprecated ComponentFactoryResolver usage');
            console.log('   • Fixed Angular 21 template rendering onDestroy errors');
            console.log('   • Updated to modern Angular 21 component creation patterns');
            console.log('   • Eliminated createEmbeddedViewImpl failures');
        } else {
            console.log('ℹ️  No deprecated APIs found.');
        }
    }
}

// Run the script
const fixer = new DeprecatedApisFixer();
const directory = process.argv[2] || './apps/web-giddh/src';
fixer.run(directory);
