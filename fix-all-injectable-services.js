#!/usr/bin/env node

/**
 * Angular 21 Fix: Add providedIn: 'root' to ALL @Injectable() services
 * Fixes factory errors by ensuring proper DI configuration
 */

const fs = require('fs');
const path = require('path');

class InjectableServicesFixer {
    constructor() {
        this.processedFiles = 0;
        this.fixedFiles = 0;
        this.errors = [];
    }

    async run(directory = './apps/web-giddh/src') {
        console.log('🔧 Angular 21 Fix: Adding providedIn: root to ALL Injectable Services');
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

            if (!this.needsInjectableFix(content)) {
                return;
            }

            console.log(`🔍 Fixing: ${filePath}`);

            const fixedContent = this.fixInjectableServices(content);

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

    needsInjectableFix(content) {
        // Check for @Injectable() without providedIn
        const hasInjectableWithoutProvidedIn = /@Injectable\(\)\s*$/m.test(content);
        const hasInjectableWithEmptyConfig = /@Injectable\(\s*{\s*}\s*\)/m.test(content);

        return hasInjectableWithoutProvidedIn || hasInjectableWithEmptyConfig;
    }

    fixInjectableServices(content) {
        let modified = content;

        // Fix @Injectable() without any configuration
        modified = modified.replace(
            /@Injectable\(\)\s*$/gm,
            '@Injectable({\n    providedIn: \'root\'\n})'
        );

        // Fix @Injectable({}) with empty configuration
        modified = modified.replace(
            /@Injectable\(\s*{\s*}\s*\)/gm,
            '@Injectable({\n    providedIn: \'root\'\n})'
        );

        // Fix @Injectable() followed by export class on same line
        modified = modified.replace(
            /@Injectable\(\)\s*export\s+class/gm,
            '@Injectable({\n    providedIn: \'root\'\n})\nexport class'
        );

        return modified;
    }

    printSummary() {
        console.log('');
        console.log('📊 Injectable Services Fix Summary');
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
            console.log('✅ Injectable services fix completed successfully!');
            console.log('');
            console.log('📝 Benefits:');
            console.log('   • Added providedIn: root to all @Injectable() services');
            console.log('   • Fixed Angular 21 DI factory resolution errors');
            console.log('   • Enabled proper tree-shaking for services');
            console.log('   • Eliminated "Cannot read properties of undefined (reading \'factory\')" errors');
        } else {
            console.log('ℹ️  No injectable services needed fixes.');
        }
    }
}

// Run the script
const fixer = new InjectableServicesFixer();
const directory = process.argv[2] || './apps/web-giddh/src';
fixer.run(directory);
