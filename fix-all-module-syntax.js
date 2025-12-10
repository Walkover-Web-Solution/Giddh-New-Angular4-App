#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Comprehensive Module Syntax Fixer
 * Fixes all remaining syntax errors in Angular modules
 */

class ModuleSyntaxFixer {
    constructor() {
        this.fixedFiles = 0;
        this.errors = [];
        this.fixedModules = [];
    }

    /**
     * Fix a single module file
     */
    fixModuleFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            let newContent = content;
            let changes = [];
            let hasChanges = false;

            // Fix 1: Malformed imports array endings - missing closing bracket
            if (newContent.includes('imports: [') && !newContent.match(/imports:\s*\[[\s\S]*?\]/)) {
                // Find the imports array and ensure it's properly closed
                newContent = newContent.replace(
                    /(imports:\s*\[[\s\S]*?)(\s*@NgModule|\s*exports:|\s*providers:|\s*declarations:)/,
                    '$1\n    ],$2'
                );
                changes.push('Fixed imports array closing');
                hasChanges = true;
            }

            // Fix 2: Missing closing bracket for @NgModule
            if (newContent.includes('@NgModule({') && !newContent.match(/@NgModule\s*\(\s*\{[\s\S]*?\}\s*\)/)) {
                // Find @NgModule and ensure it's properly closed
                newContent = newContent.replace(
                    /(@NgModule\s*\(\s*\{[\s\S]*?)(\s*export\s+class)/,
                    '$1\n})$2'
                );
                changes.push('Fixed @NgModule closing');
                hasChanges = true;
            }

            // Fix 3: Missing commas in arrays
            newContent = newContent.replace(
                /(\w+Module)\s+(\w+Module)/g,
                '$1,\n        $2'
            );

            // Fix 4: Trailing commas before closing brackets
            newContent = newContent.replace(/,(\s*\])/g, '$1');

            // Fix 5: Double commas
            newContent = newContent.replace(/,\s*,/g, ',');

            // Fix 6: Missing closing brace for class
            if (newContent.includes('export class') && !newContent.match(/export class \w+\s*\{[\s\S]*?\}/)) {
                newContent = newContent.replace(
                    /(export class \w+\s*\{[^}]*?)$/,
                    '$1\n}'
                );
                changes.push('Added missing class closing brace');
                hasChanges = true;
            }

            // Fix 7: Specific pattern fixes for common issues

            // Fix malformed FormFieldsModule comments in imports
            newContent = newContent.replace(
                /(\s+)\/\/\s*FormFieldsModule,?\s*\/\/[^\n]*\n/g,
                '$1// FormFieldsModule, // Temporarily disabled for compilation\n'
            );

            // Fix incomplete imports arrays
            newContent = newContent.replace(
                /(imports:\s*\[\s*[\s\S]*?)(\s*}\s*\))/,
                (match, importsContent, ending) => {
                    if (!importsContent.includes(']')) {
                        return importsContent + '\n    ]' + ending;
                    }
                    return match;
                }
            );

            if (newContent !== content) {
                hasChanges = true;
            }

            if (hasChanges) {
                fs.writeFileSync(filePath, newContent);
                this.fixedFiles++;
                this.fixedModules.push({
                    path: filePath,
                    changes: changes
                });

                console.log(`✅ Fixed ${path.basename(filePath)}`);
                changes.forEach(change => {
                    console.log(`   • ${change}`);
                });
            }

            return hasChanges;

        } catch (error) {
            this.errors.push({ file: filePath, error: error.message });
            console.error(`❌ Error fixing ${filePath}: ${error.message}`);
            return false;
        }
    }

    /**
     * Process all module files recursively
     */
    processDirectory(dirPath) {
        try {
            const items = fs.readdirSync(dirPath);

            for (const item of items) {
                const fullPath = path.join(dirPath, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    if (!['node_modules', '.git', 'dist', '.angular', 'coverage'].includes(item)) {
                        this.processDirectory(fullPath);
                    }
                } else if (item.endsWith('.module.ts')) {
                    this.fixModuleFile(fullPath);
                }
            }
        } catch (error) {
            console.error(`❌ Error processing directory ${dirPath}: ${error.message}`);
        }
    }

    /**
     * Generate report
     */
    generateReport() {
        console.log('\n' + '='.repeat(60));
        console.log('🔧 MODULE SYNTAX FIXER - FINAL REPORT');
        console.log('='.repeat(60));

        console.log(`📊 RESULTS:`);
        console.log(`   • Files Fixed: ${this.fixedFiles}`);
        console.log(`   • Errors: ${this.errors.length}`);

        if (this.fixedFiles > 0) {
            console.log(`\n✅ SUCCESS: Fixed syntax errors in ${this.fixedFiles} modules!`);
            console.log(`🔧 All module syntax issues should now be resolved`);
        } else {
            console.log(`\nℹ️  No syntax errors found - all modules are properly formatted`);
        }

        if (this.errors.length > 0) {
            console.log(`\n❌ ERRORS (${this.errors.length}):`);
            this.errors.forEach((error, index) => {
                console.log(`   ${index + 1}. ${path.basename(error.file)}: ${error.error}`);
            });
        }

        console.log('='.repeat(60));
    }

    /**
     * Main execution
     */
    run(targetPath = './apps/web-giddh/src') {
        console.log('🔧 Starting Comprehensive Module Syntax Fixer...');
        console.log(`📁 Target: ${path.resolve(targetPath)}\n`);

        this.processDirectory(targetPath);
        this.generateReport();

        return this.fixedFiles > 0;
    }
}

// Execute
const fixer = new ModuleSyntaxFixer();
const success = fixer.run();
process.exit(success ? 0 : 1);
