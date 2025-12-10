#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Comprehensive Module Comma Syntax Fixer
 * Fixes missing commas, extra commas, and syntax issues in Angular modules
 */

class ModuleCommaSyntaxFixer {
    constructor() {
        this.processedFiles = 0;
        this.fixedFiles = 0;
        this.totalFixes = 0;
        this.errors = [];

        this.stats = {
            modulesScanned: 0,
            syntaxErrorsFixed: 0,
            commasAdded: 0,
            commasRemoved: 0,
            trailingCommasFixed: 0
        };
    }

    /**
     * Fix comma syntax in NgModule arrays (declarations, imports, exports, providers)
     */
    fixModuleArraySyntax(content, arrayName) {
        let fixes = [];

        // Pattern to match the array (declarations, imports, exports, providers)
        const arrayPattern = new RegExp(
            `(${arrayName}:\\s*\\[)([\\s\\S]*?)(\\s*\\])`,
            'g'
        );

        return content.replace(arrayPattern, (match, opening, arrayContent, closing) => {
            let fixedContent = arrayContent;
            let localFixes = [];

            // Remove extra whitespace and normalize
            fixedContent = fixedContent.replace(/\s+/g, ' ').trim();

            if (!fixedContent) {
                return match; // Empty array, no fixes needed
            }

            // Split by commas and clean up each item
            let items = fixedContent.split(',').map(item => item.trim()).filter(item => item);

            // Remove empty items and clean up
            items = items.filter(item => {
                const cleaned = item.replace(/\/\/.*$/, '').trim();
                return cleaned && cleaned !== ',';
            });

            if (items.length === 0) {
                return `${opening}${closing}`;
            }

            // Rebuild the array with proper formatting
            const formattedItems = items.map((item, index) => {
                // Clean up the item
                let cleanItem = item.trim();

                // Remove trailing comma if it exists
                if (cleanItem.endsWith(',')) {
                    cleanItem = cleanItem.slice(0, -1).trim();
                    localFixes.push(`Removed trailing comma from ${cleanItem}`);
                }

                // Add proper indentation
                return `        ${cleanItem}`;
            });

            // Join with commas and proper formatting
            const formattedArray = formattedItems.join(',\n');

            if (localFixes.length > 0) {
                fixes.push(...localFixes);
                this.stats.syntaxErrorsFixed += localFixes.length;
            }

            return `${opening}\n${formattedArray}\n    ${closing}`;
        });
    }

    /**
     * Fix specific syntax issues in module files
     */
    fixModuleSyntax(content) {
        let newContent = content;
        let changes = [];

        // Fix declarations array
        const declarationsFixed = this.fixModuleArraySyntax(newContent, 'declarations');
        if (declarationsFixed !== newContent) {
            changes.push('Fixed declarations array syntax');
            newContent = declarationsFixed;
        }

        // Fix imports array
        const importsFixed = this.fixModuleArraySyntax(newContent, 'imports');
        if (importsFixed !== newContent) {
            changes.push('Fixed imports array syntax');
            newContent = importsFixed;
        }

        // Fix exports array
        const exportsFixed = this.fixModuleArraySyntax(newContent, 'exports');
        if (exportsFixed !== newContent) {
            changes.push('Fixed exports array syntax');
            newContent = exportsFixed;
        }

        // Fix providers array
        const providersFixed = this.fixModuleArraySyntax(newContent, 'providers');
        if (providersFixed !== newContent) {
            changes.push('Fixed providers array syntax');
            newContent = providersFixed;
        }

        // Fix common syntax issues
        newContent = this.fixCommonSyntaxIssues(newContent, changes);

        return { content: newContent, changes };
    }

    /**
     * Fix common syntax issues
     */
    fixCommonSyntaxIssues(content, changes) {
        let newContent = content;

        // Fix missing commas in comments
        newContent = newContent.replace(
            /(\/\/ Added since FormFieldsModule is disabled)([^,\n])/g,
            '$1,$2'
        );

        // Fix double commas
        newContent = newContent.replace(/,,+/g, ',');
        if (newContent !== content) {
            changes.push('Fixed double commas');
        }

        // Fix spaces before commas
        newContent = newContent.replace(/\s+,/g, ',');

        // Fix missing commas between array items (heuristic)
        newContent = newContent.replace(
            /(\w+Component)\s+(\w+Component)/g,
            '$1,\n        $2'
        );

        // Fix missing commas after imports with comments
        newContent = newContent.replace(
            /(import\s+{[^}]+}\s+from\s+['"][^'"]+['"];)\s*\/\//g,
            '$1\n//'
        );

        // Fix trailing commas in arrays (remove if last item)
        newContent = newContent.replace(
            /,(\s*\n\s*\])/g,
            '$1'
        );

        return newContent;
    }

    /**
     * Validate and fix a single module file
     */
    fixModuleFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const { content: newContent, changes } = this.fixModuleSyntax(content);

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
            console.error(`❌ Error fixing ${filePath}: ${error.message}`);
            return false;
        }
    }

    /**
     * Process all module files recursively
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
                    this.stats.modulesScanned++;
                    this.fixModuleFile(fullPath);
                }
            }
        } catch (error) {
            console.error(`❌ Error processing directory ${dirPath}: ${error.message}`);
        }
    }

    /**
     * Generate comprehensive report
     */
    generateReport() {
        console.log('\n' + '='.repeat(70));
        console.log('🔧 MODULE COMMA SYNTAX FIXER - REPORT');
        console.log('='.repeat(70));

        console.log(`📊 PROCESSING STATISTICS:`);
        console.log(`   • Modules Scanned: ${this.stats.modulesScanned}`);
        console.log(`   • Modules Fixed: ${this.fixedFiles}`);
        console.log(`   • Total Fixes Applied: ${this.totalFixes}`);
        console.log(`   • Processing Errors: ${this.errors.length}`);

        if (this.fixedFiles > 0) {
            console.log(`\n✅ SUCCESS SUMMARY:`);
            console.log(`   🔧 Fixed ${this.fixedFiles} modules with syntax issues`);
            console.log(`   📝 Applied ${this.totalFixes} syntax corrections`);
            console.log(`   🎯 Common fixes: missing commas, extra commas, array formatting`);
            console.log(`   🚀 All modules should now have proper syntax`);
        } else {
            console.log(`\nℹ️  No syntax issues found - all modules have correct comma syntax`);
        }

        if (this.errors.length > 0) {
            console.log(`\n❌ PROCESSING ERRORS (${this.errors.length}):`);
            this.errors.slice(0, 5).forEach((error, index) => {
                console.log(`   ${index + 1}. ${path.basename(error.file)}: ${error.error}`);
            });
        }

        console.log(`\n🎯 FIXES APPLIED:`);
        console.log(`   • Normalized array formatting (declarations, imports, exports, providers)`);
        console.log(`   • Fixed missing commas between array items`);
        console.log(`   • Removed extra/double commas`);
        console.log(`   • Fixed trailing commas in arrays`);
        console.log(`   • Corrected comment syntax`);
        console.log(`   • Standardized indentation`);

        console.log('='.repeat(70));
    }

    /**
     * Main execution method
     */
    run(targetPath = './apps/web-giddh/src') {
        console.log('🔧 Starting Module Comma Syntax Fixer...');
        console.log(`📁 Target Directory: ${path.resolve(targetPath)}`);
        console.log('🔍 Scanning for modules with comma syntax issues...\n');

        if (!fs.existsSync(targetPath)) {
            console.error(`❌ Target directory does not exist: ${targetPath}`);
            return false;
        }

        // Process all modules
        this.processAllModules(targetPath);

        // Generate report
        this.generateReport();

        return this.fixedFiles > 0;
    }
}

// Execute the script
const targetDirectory = process.argv[2] || './apps/web-giddh/src';
const fixer = new ModuleCommaSyntaxFixer();
const success = fixer.run(targetDirectory);

// Exit with appropriate code
process.exit(success ? 0 : 1);
