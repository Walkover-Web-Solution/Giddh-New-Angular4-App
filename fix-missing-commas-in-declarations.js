#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Fix Missing Commas in Module Declarations
 * Specifically targets the pattern where components are missing commas
 */

class DeclarationCommaFixer {
    constructor() {
        this.processedFiles = 0;
        this.fixedFiles = 0;
        this.totalFixes = 0;
        this.errors = [];
    }

    /**
     * Fix missing commas in declarations array
     */
    fixDeclarationCommas(content) {
        let newContent = content;
        let changes = [];

        // Pattern 1: Fix missing commas after components with comments
        const patterns = [
            // TextFieldComponent // Added since FormFieldsModule is disabled,
            {
                pattern: /(TextFieldComponent)\s*(\/\/\s*Added since FormFieldsModule is disabled),?/g,
                replacement: '$1, $2',
                description: 'Fixed TextFieldComponent comma'
            },
            // ReactiveDropdownFieldComponent // Added since FormFieldsModule is disabled,
            {
                pattern: /(ReactiveDropdownFieldComponent)\s*(\/\/\s*Added since FormFieldsModule is disabled),?/g,
                replacement: '$1, $2',
                description: 'Fixed ReactiveDropdownFieldComponent comma'
            },
            // InputFieldComponent // Added since FormFieldsModule is disabled,
            {
                pattern: /(InputFieldComponent)\s*(\/\/\s*Added since FormFieldsModule is disabled),?/g,
                replacement: '$1, $2',
                description: 'Fixed InputFieldComponent comma'
            },
            // AmountFieldComponent // Added since FormFieldsModule is disabled
            {
                pattern: /(AmountFieldComponent)\s*(\/\/\s*Added since FormFieldsModule is disabled)/g,
                replacement: '$1 $2',
                description: 'Fixed AmountFieldComponent comma'
            },
            // General pattern for any component followed by comment without comma
            {
                pattern: /(\w+Component)\s+(\/\/[^\n]*)/g,
                replacement: '$1, $2',
                description: 'Fixed component comment comma'
            },
            // Pattern for components on separate lines without commas
            {
                pattern: /(\w+Component)\s*\n\s*(\w+Component)/g,
                replacement: '$1,\n        $2',
                description: 'Added comma between components'
            }
        ];

        patterns.forEach(({ pattern, replacement, description }) => {
            const before = newContent;
            newContent = newContent.replace(pattern, replacement);
            if (newContent !== before) {
                changes.push(description);
            }
        });

        // Specific fix for declarations array structure
        newContent = newContent.replace(
            /(declarations:\s*\[[\s\S]*?)(\w+Component)\s*(\n\s*\])/g,
            (match, start, lastComponent, end) => {
                // Don't add comma if it's the last item
                return `${start}${lastComponent}${end}`;
            }
        );

        // Fix double commas that might have been created
        newContent = newContent.replace(/,,+/g, ',');

        return { content: newContent, changes };
    }

    /**
     * Process a single module file
     */
    processModuleFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const { content: newContent, changes } = this.fixDeclarationCommas(content);

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
            this.errors.push({ file: filePath, error: error.message });
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
        console.log('\n' + '='.repeat(70));
        console.log('🔧 DECLARATION COMMA FIXER - REPORT');
        console.log('='.repeat(70));

        console.log(`📊 PROCESSING STATISTICS:`);
        console.log(`   • Modules Processed: ${this.processedFiles}`);
        console.log(`   • Modules Fixed: ${this.fixedFiles}`);
        console.log(`   • Total Fixes Applied: ${this.totalFixes}`);
        console.log(`   • Processing Errors: ${this.errors.length}`);

        if (this.fixedFiles > 0) {
            console.log(`\n✅ SUCCESS SUMMARY:`);
            console.log(`   🔧 Fixed ${this.fixedFiles} modules with missing commas`);
            console.log(`   📝 Applied ${this.totalFixes} comma corrections`);
            console.log(`   🎯 Focus: Component declarations with comments`);
            console.log(`   🚀 All declaration arrays should now have proper syntax`);
        } else {
            console.log(`\nℹ️  No missing commas found in declarations`);
        }

        if (this.errors.length > 0) {
            console.log(`\n❌ PROCESSING ERRORS (${this.errors.length}):`);
            this.errors.slice(0, 5).forEach((error, index) => {
                console.log(`   ${index + 1}. ${path.basename(error.file)}: ${error.error}`);
            });
        }

        console.log('='.repeat(70));
    }

    /**
     * Main execution
     */
    run(targetPath = './apps/web-giddh/src') {
        console.log('🔧 Starting Declaration Comma Fixer...');
        console.log(`📁 Target Directory: ${path.resolve(targetPath)}`);
        console.log('🔍 Scanning for missing commas in declarations...\n');

        if (!fs.existsSync(targetPath)) {
            console.error(`❌ Target directory does not exist: ${targetPath}`);
            return false;
        }

        this.processAllModules(targetPath);
        this.generateReport();

        return this.fixedFiles > 0;
    }
}

// Execute the script
const targetDirectory = process.argv[2] || './apps/web-giddh/src';
const fixer = new DeclarationCommaFixer();
const success = fixer.run(targetDirectory);

process.exit(success ? 0 : 1);
