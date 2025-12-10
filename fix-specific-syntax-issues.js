#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Fix Specific Syntax Issues in Modules
 * Targets real syntax problems that prevent compilation
 */

class SpecificSyntaxFixer {
    constructor() {
        this.processedFiles = 0;
        this.fixedFiles = 0;
        this.totalFixes = 0;
    }

    /**
     * Fix specific known syntax issues
     */
    fixSpecificIssues(content) {
        let newContent = content;
        let changes = [];

        // Fix 1: Remove trailing dots at end of files
        if (newContent.endsWith('\n.\n') || newContent.endsWith('.\n')) {
            newContent = newContent.replace(/\.\s*$/, '');
            changes.push('Removed trailing dot');
        }

        // Fix 2: Fix malformed comment syntax in declarations
        newContent = newContent.replace(
            /(TextFieldComponent),\s*\/\/\s*Added since FormFieldsModule is disabled,/g,
            '$1, // Added since FormFieldsModule is disabled'
        );

        newContent = newContent.replace(
            /(ReactiveDropdownFieldComponent),\s*\/\/\s*Added since FormFieldsModule is disabled,/g,
            '$1, // Added since FormFieldsModule is disabled'
        );

        newContent = newContent.replace(
            /(InputFieldComponent)\s*,\/\/\s*Added since FormFieldsModule is disabled,/g,
            '$1, // Added since FormFieldsModule is disabled'
        );

        // Fix 3: Fix missing commas in imports with comments
        newContent = newContent.replace(
            /(\w+Module)\s+\/\/\s*(.*)/g,
            '$1, // $2'
        );

        // Fix 4: Fix double slashes in comments
        newContent = newContent.replace(
            /\/\/\s*Temporarily disabled;\s*$/gm,
            '// Temporarily disabled'
        );

        // Fix 5: Fix spacing issues in arrays
        newContent = newContent.replace(
            /(\w+Component)\s*,\s*\/\/\s*Added since FormFieldsModule is disabled\s*,/g,
            '$1, // Added since FormFieldsModule is disabled'
        );

        // Fix 6: Remove extra commas at end of arrays
        newContent = newContent.replace(
            /,(\s*\n\s*\]\s*)/g,
            '$1'
        );

        // Fix 7: Fix malformed module.forRoot() calls
        newContent = newContent.replace(
            /(\w+Module)\.forRoot\(\)\s*,?\s*\/\/\s*(.*)/g,
            '$1.forRoot(), // $2'
        );

        // Fix 8: Ensure proper spacing around commas
        newContent = newContent.replace(
            /,(\w)/g,
            ', $1'
        );

        // Fix 9: Fix imports that are missing from statements
        newContent = newContent.replace(
            /^(\s*)(\/\/\s*import.*from.*['"];)\s*$/gm,
            '$1$2'
        );

        return { content: newContent, changes };
    }

    /**
     * Process a single module file
     */
    processModuleFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const { content: newContent, changes } = this.fixSpecificIssues(content);

            if (newContent !== content && changes.length > 0) {
                fs.writeFileSync(filePath, newContent);
                this.fixedFiles++;
                this.totalFixes += changes.length;

                console.log(`✅ Fixed ${path.basename(filePath)}`);
                changes.forEach(change => {
                    console.log(`   • ${change}`);
                });

                return true;
            }

            return false;

        } catch (error) {
            console.error(`❌ Error processing ${filePath}: ${error.message}`);
            return false;
        }
    }

    /**
     * Process all module files
     */
    processAllModules(dirPath) {
        try {
            const items = fs.readdirSync(dirPath);

            for (const item of items) {
                const fullPath = path.join(dirPath, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    if (!['node_modules', '.git', 'dist', '.angular', 'coverage'].includes(item)) {
                        this.processAllModules(fullPath);
                    }
                } else if (item.endsWith('.module.ts')) {
                    this.processedFiles++;
                    this.processModuleFile(fullPath);
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
        console.log('🔧 SPECIFIC SYNTAX FIXER - REPORT');
        console.log('='.repeat(60));

        console.log(`📊 RESULTS:`);
        console.log(`   • Modules Processed: ${this.processedFiles}`);
        console.log(`   • Modules Fixed: ${this.fixedFiles}`);
        console.log(`   • Total Fixes: ${this.totalFixes}`);

        if (this.fixedFiles > 0) {
            console.log(`\n✅ SUCCESS: Fixed ${this.fixedFiles} modules with specific syntax issues!`);
        } else {
            console.log(`\nℹ️  No specific syntax issues found`);
        }

        console.log('='.repeat(60));
    }

    /**
     * Main execution
     */
    run(targetPath = './apps/web-giddh/src') {
        console.log('🔧 Starting Specific Syntax Fixer...');
        console.log(`📁 Target: ${path.resolve(targetPath)}\n`);

        this.processAllModules(targetPath);
        this.generateReport();

        return this.fixedFiles > 0;
    }
}

// Execute
const fixer = new SpecificSyntaxFixer();
fixer.run();
process.exit(0);
