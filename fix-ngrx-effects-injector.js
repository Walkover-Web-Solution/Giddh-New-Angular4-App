#!/usr/bin/env node

/**
 * Angular 21 Compatibility Fix Script 2: NgRx Effects Injector Context
 * Fixes NgRx effects without proper injector context
 */

const fs = require('fs');
const path = require('path');

class NgRxEffectsInjectorFixer {
    constructor() {
        this.processedFiles = 0;
        this.fixedFiles = 0;
        this.errors = [];
    }

    async run(directory = './apps/web-giddh/src') {
        console.log('🔧 Angular 21 Fix: NgRx Effects Injector Context');
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
            } else if (item.endsWith('.actions.ts') || item.endsWith('.effects.ts')) {
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

            const fixedContent = this.fixNgRxEffects(content);

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
        // Check for createEffect with this.action$ pattern
        const hasCreateEffect = content.includes('createEffect(') && content.includes('this.action$');

        // Check for constructor with Actions injection
        const hasConstructorActions = content.includes('constructor(') && content.includes('Actions');

        // Skip if already using inject()
        const hasInjectFunction = content.includes('inject(Actions)') || content.includes('= inject(');

        return hasCreateEffect && hasConstructorActions && !hasInjectFunction;
    }

    fixNgRxEffects(content) {
        let modified = content;

        // Add inject import if not present
        if (!modified.includes("import { inject }")) {
            const angularCoreImportPattern = /import\s*{([^}]*)}\s*from\s*['"]@angular\/core['"];?/;
            if (angularCoreImportPattern.test(modified)) {
                modified = modified.replace(angularCoreImportPattern, (match, imports) => {
                    if (!imports.includes('inject')) {
                        const cleanImports = imports.trim();
                        return match.replace(imports, `${cleanImports}, inject`);
                    }
                    return match;
                });
            } else {
                // Add new import if @angular/core import doesn't exist
                const firstImport = modified.match(/^import.*$/m);
                if (firstImport) {
                    modified = modified.replace(firstImport[0], `import { inject } from '@angular/core';\n${firstImport[0]}`);
                }
            }
        }

        // Find constructor and extract injected services
        const constructorPattern = /constructor\s*\(\s*([^)]+)\s*\)\s*\{[^}]*\}/s;
        const constructorMatch = modified.match(constructorPattern);

        if (constructorMatch) {
            const constructorParams = constructorMatch[1];
            const injectedServices = this.parseConstructorParams(constructorParams);

            // Replace constructor with inject() calls
            const injectStatements = injectedServices.map(service =>
                `    private ${service.name} = inject(${service.type});`
            ).join('\n');

            // Remove constructor
            modified = modified.replace(constructorPattern, '');

            // Add inject statements after class declaration
            const classPattern = /(export\s+class\s+\w+[^{]*\{)/;
            modified = modified.replace(classPattern, `$1\n${injectStatements}\n`);
        }

        return modified;
    }

    parseConstructorParams(paramsString) {
        const services = [];

        // Split by comma but handle nested generics
        const params = this.splitParameters(paramsString);

        params.forEach(param => {
            const trimmed = param.trim();

            // Match patterns like: private action$: Actions, private _toasty: ToasterService
            const paramPattern = /(?:private|public|protected)?\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*([a-zA-Z_$][a-zA-Z0-9_$<>,\s]*)/;
            const match = trimmed.match(paramPattern);

            if (match) {
                const [, name, type] = match;
                // Clean up type (remove generics for inject)
                const cleanType = type.split('<')[0].trim();
                services.push({ name: name.trim(), type: cleanType });
            }
        });

        return services;
    }

    splitParameters(paramsString) {
        const params = [];
        let current = '';
        let depth = 0;

        for (let i = 0; i < paramsString.length; i++) {
            const char = paramsString[i];

            if (char === '<' || char === '(') {
                depth++;
            } else if (char === '>' || char === ')') {
                depth--;
            } else if (char === ',' && depth === 0) {
                params.push(current.trim());
                current = '';
                continue;
            }

            current += char;
        }

        if (current.trim()) {
            params.push(current.trim());
        }

        return params;
    }

    printSummary() {
        console.log('');
        console.log('📊 NgRx Effects Injector Fix Summary');
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
            console.log('✅ NgRx Effects injector fix completed successfully!');
            console.log('');
            console.log('📝 Benefits:');
            console.log('   • Fixed Angular 21 effects dependency injection');
            console.log('   • Proper injector context for effects');
            console.log('   • Eliminated effects factory resolution errors');
            console.log('   • Modern Angular 21 injection pattern');
        } else {
            console.log('ℹ️  No NgRx effects needed injector fixes.');
        }
    }
}

// Run the script
const fixer = new NgRxEffectsInjectorFixer();
const directory = process.argv[2] || './apps/web-giddh/src';
fixer.run(directory);
