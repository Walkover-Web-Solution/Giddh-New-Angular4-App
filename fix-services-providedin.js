#!/usr/bin/env node

/**
 * Angular 21 Compatibility Fix Script 1: Services ProvidedIn Configuration
 * Fixes services missing providedIn: 'root' configuration
 */

const fs = require('fs');
const path = require('path');

class ServiceProvidedInFixer {
    constructor() {
        this.processedFiles = 0;
        this.fixedFiles = 0;
        this.errors = [];
    }

    async run(directory = './apps/web-giddh/src') {
        console.log('🔧 Angular 21 Fix: Adding providedIn: root to Services');
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
            } else if (item.endsWith('.service.ts') || item.endsWith('.interceptor.ts') || item.endsWith('.resolver.ts')) {
                await this.processFile(fullPath);
            }
        }
    }

    async processFile(filePath) {
        this.processedFiles++;

        try {
            const content = fs.readFileSync(filePath, 'utf8');

            // Skip if already has providedIn
            if (content.includes('providedIn:') || content.includes('providedIn ')) {
                return;
            }

            // Check if it has @Injectable() without providedIn
            if (!this.shouldFix(content)) {
                return;
            }

            console.log(`🔍 Fixing: ${filePath}`);

            const fixedContent = this.fixServiceProvidedIn(content);

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
        // Check for @Injectable() without providedIn
        const injectablePattern = /@Injectable\(\s*\)/;
        const hasInjectableEmpty = injectablePattern.test(content);

        // Check for export class that extends or implements service patterns
        const serviceClassPattern = /export\s+class\s+\w+(?:Service|Interceptor|Resolver|Guard)\s*(?:extends|implements|\{)/;
        const hasServiceClass = serviceClassPattern.test(content);

        return hasInjectableEmpty && hasServiceClass;
    }

    fixServiceProvidedIn(content) {
        let modified = content;

        // Replace @Injectable() with @Injectable({ providedIn: 'root' })
        const injectablePattern = /@Injectable\(\s*\)/g;

        modified = modified.replace(injectablePattern, `@Injectable({
    providedIn: 'root'
})`);

        return modified;
    }

    printSummary() {
        console.log('');
        console.log('📊 Services ProvidedIn Fix Summary');
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
            console.log('✅ Services ProvidedIn fix completed successfully!');
            console.log('');
            console.log('📝 Benefits:');
            console.log('   • Fixed Angular 21 DI factory resolution');
            console.log('   • Proper tree-shaking configuration');
            console.log('   • Eliminated factory undefined errors');
            console.log('   • Services now properly injectable');
        } else {
            console.log('ℹ️  No services needed ProvidedIn fixes.');
        }
    }
}

// Run the script
const fixer = new ServiceProvidedInFixer();
const directory = process.argv[2] || './apps/web-giddh/src';
fixer.run(directory);
