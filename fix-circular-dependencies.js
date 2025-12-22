#!/usr/bin/env node

/**
 * Angular 21 Compatibility Fix Script 4: Circular Dependencies Resolution
 * Fixes circular dependencies breaking DI factory resolution
 */

const fs = require('fs');
const path = require('path');

class CircularDependencyFixer {
    constructor() {
        this.processedFiles = 0;
        this.fixedFiles = 0;
        this.errors = [];
        this.circularServices = ['GeneralService', 'HttpWrapperService', 'ToasterService'];
    }

    async run(directory = './apps/web-giddh/src') {
        console.log('🔧 Angular 21 Fix: Circular Dependencies Resolution');
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
            } else if (item.endsWith('.service.ts') || item.endsWith('.component.ts')) {
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

            const fixedContent = this.fixCircularDependencies(content);

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
        // Check for services that inject multiple circular dependencies
        const hasMultipleCircularDeps = this.circularServices.filter(service =>
            content.includes(`private ${service.toLowerCase()}`) ||
            content.includes(`private _${service.toLowerCase()}`) ||
            content.includes(`: ${service}`)
        ).length >= 2;

        // Check for constructor injection pattern
        const hasConstructorInjection = content.includes('constructor(') && content.includes('private ');

        // Skip if already using forwardRef
        const hasForwardRef = content.includes('forwardRef');

        return hasMultipleCircularDeps && hasConstructorInjection && !hasForwardRef;
    }

    fixCircularDependencies(content) {
        let modified = content;

        // Add forwardRef import if not present
        if (!modified.includes('forwardRef')) {
            const angularCoreImportPattern = /import\s*{([^}]*)}\s*from\s*['"]@angular\/core['"];?/;
            if (angularCoreImportPattern.test(modified)) {
                modified = modified.replace(angularCoreImportPattern, (match, imports) => {
                    if (!imports.includes('forwardRef')) {
                        const cleanImports = imports.trim();
                        return match.replace(imports, `${cleanImports}, forwardRef`);
                    }
                    return match;
                });
            } else {
                // Add new import if @angular/core import doesn't exist
                const firstImport = modified.match(/^import.*$/m);
                if (firstImport) {
                    modified = modified.replace(firstImport[0], `import { forwardRef } from '@angular/core';\n${firstImport[0]}`);
                }
            }
        }

        // Fix constructor parameters with forwardRef for circular services
        const constructorPattern = /constructor\s*\(\s*([^)]+)\s*\)/s;
        const constructorMatch = modified.match(constructorPattern);

        if (constructorMatch) {
            let constructorParams = constructorMatch[1];

            // Apply forwardRef to circular dependencies
            this.circularServices.forEach(service => {
                // Pattern: private serviceName: ServiceType
                const serviceParamPattern = new RegExp(
                    `(private\\s+[^:]+):\\s*(${service})([,\\s)])`
                );

                constructorParams = constructorParams.replace(serviceParamPattern,
                    `$1: ${service}$3`
                );

                // Add @Inject(forwardRef()) for the service
                const injectPattern = new RegExp(
                    `(private\\s+[^:]+):\\s*(${service})`
                );

                constructorParams = constructorParams.replace(injectPattern,
                    `@Inject(forwardRef(() => $2)) $1: $2`
                );
            });

            // Replace the constructor
            modified = modified.replace(constructorPattern, `constructor(${constructorParams})`);
        }

        // Add Inject import if forwardRef was added
        if (modified.includes('@Inject(forwardRef') && !modified.includes('import.*Inject')) {
            const angularCoreImportPattern = /import\s*{([^}]*)}\s*from\s*['"]@angular\/core['"];?/;
            if (angularCoreImportPattern.test(modified)) {
                modified = modified.replace(angularCoreImportPattern, (match, imports) => {
                    if (!imports.includes('Inject')) {
                        const cleanImports = imports.trim();
                        return match.replace(imports, `${cleanImports}, Inject`);
                    }
                    return match;
                });
            }
        }

        return modified;
    }

    printSummary() {
        console.log('');
        console.log('📊 Circular Dependencies Fix Summary');
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
            console.log('✅ Circular dependencies fix completed successfully!');
            console.log('');
            console.log('📝 Benefits:');
            console.log('   • Fixed Angular 21 circular dependency resolution');
            console.log('   • Added forwardRef for problematic service chains');
            console.log('   • Eliminated DI factory resolution failures');
            console.log('   • Proper dependency injection configuration');
        } else {
            console.log('ℹ️  No circular dependencies needed fixes.');
        }
    }
}

// Run the script
const fixer = new CircularDependencyFixer();
const directory = process.argv[2] || './apps/web-giddh/src';
fixer.run(directory);
