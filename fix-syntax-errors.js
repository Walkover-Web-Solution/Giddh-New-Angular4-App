#!/usr/bin/env node

/**
 * Quick Fix Script: Compilation Errors from Angular 21 Compatibility Fixes
 * Fixes syntax errors introduced by the fix scripts
 */

const fs = require('fs');
const path = require('path');

class SyntaxErrorFixer {
    constructor() {
        this.processedFiles = 0;
        this.fixedFiles = 0;
        this.errors = [];
    }

    async run(directory = './apps/web-giddh/src') {
        console.log('🔧 Quick Fix: Compilation Errors from Angular 21 Fixes');
        console.log('=' .repeat(60));

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
            } else if (item.endsWith('.ts')) {
                await this.processFile(fullPath);
            }
        }
    }

    async processFile(filePath) {
        this.processedFiles++;

        try {
            const content = fs.readFileSync(filePath, 'utf8');

            if (!this.hasSyntaxErrors(content)) {
                return;
            }

            console.log(`🔍 Fixing: ${filePath}`);

            const fixedContent = this.fixSyntaxErrors(content);

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

    hasSyntaxErrors(content) {
        const syntaxErrorPatterns = [
            /,\s*,/,  // Double commas
            /ViewChild,\s*,/,  // ViewChild with extra comma
            /import\s*{[^}]*,\s*,/,  // Import with double comma
            /\@Inject\(forwardRef.*\)\s*private.*:\s*\w+Service\s*,?\s*\@Inject/  // Missing Inject import
        ];

        return syntaxErrorPatterns.some(pattern => pattern.test(content));
    }

    fixSyntaxErrors(content) {
        let modified = content;

        // Fix double commas in imports
        modified = modified.replace(/,\s*,/g, ',');

        // Fix ViewChild with extra comma
        modified = modified.replace(/ViewChild,\s*,/g, 'ViewChild,');

        // Fix import statements with double commas
        modified = modified.replace(/(import\s*{[^}]*),\s*,([^}]*})/g, '$1,$2');

        // Add missing Inject import where @Inject is used but not imported
        if (modified.includes('@Inject(') && !modified.includes('import.*Inject')) {
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
        console.log('📊 Syntax Error Fix Summary');
        console.log('=' .repeat(40));
        console.log(`📁 Files processed: ${this.processedFiles}`);
        console.log(`✅ Files fixed: ${this.fixedFiles}`);
        console.log(`❌ Errors: ${this.errors.length}`);

        if (this.fixedFiles > 0) {
            console.log('✅ Syntax errors fixed successfully!');
        } else {
            console.log('ℹ️  No syntax errors found.');
        }
    }
}

// Run the script
const fixer = new SyntaxErrorFixer();
fixer.run();
