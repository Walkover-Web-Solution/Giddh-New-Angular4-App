#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Module Syntax Validator
 * Validates that all modules have correct syntax after fixes
 */

class ModuleSyntaxValidator {
    constructor() {
        this.processedFiles = 0;
        this.issuesFound = 0;
        this.validModules = 0;
        this.issues = [];
    }

    /**
     * Validate a single module file
     */
    validateModuleFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const fileName = path.basename(filePath);
            let fileIssues = [];

            // Check for basic NgModule structure
            if (!content.includes('@NgModule')) {
                fileIssues.push('Missing @NgModule decorator');
            }

            if (!content.includes('export class')) {
                fileIssues.push('Missing export class declaration');
            }

            // Check for proper array syntax in NgModule
            const ngModuleMatch = content.match(/@NgModule\s*\(\s*\{([\s\S]*?)\}\s*\)/);
            if (ngModuleMatch) {
                const ngModuleContent = ngModuleMatch[1];

                // Check declarations array
                if (ngModuleContent.includes('declarations:')) {
                    const declMatch = ngModuleContent.match(/declarations:\s*\[([\s\S]*?)\]/);
                    if (declMatch) {
                        const declContent = declMatch[1].trim();
                        if (declContent && !this.validateArraySyntax(declContent)) {
                            fileIssues.push('Invalid declarations array syntax');
                        }
                    }
                }

                // Check imports array
                if (ngModuleContent.includes('imports:')) {
                    const importMatch = ngModuleContent.match(/imports:\s*\[([\s\S]*?)\]/);
                    if (importMatch) {
                        const importContent = importMatch[1].trim();
                        if (importContent && !this.validateArraySyntax(importContent)) {
                            fileIssues.push('Invalid imports array syntax');
                        }
                    }
                }

                // Check exports array
                if (ngModuleContent.includes('exports:')) {
                    const exportMatch = ngModuleContent.match(/exports:\s*\[([\s\S]*?)\]/);
                    if (exportMatch) {
                        const exportContent = exportMatch[1].trim();
                        if (exportContent && !this.validateArraySyntax(exportContent)) {
                            fileIssues.push('Invalid exports array syntax');
                        }
                    }
                }

                // Check providers array
                if (ngModuleContent.includes('providers:')) {
                    const providerMatch = ngModuleContent.match(/providers:\s*\[([\s\S]*?)\]/);
                    if (providerMatch) {
                        const providerContent = providerMatch[1].trim();
                        if (providerContent && !this.validateArraySyntax(providerContent)) {
                            fileIssues.push('Invalid providers array syntax');
                        }
                    }
                }
            }

            // Check for common syntax issues
            if (content.includes(',,')) {
                fileIssues.push('Double commas found');
            }

            if (content.match(/\w+Component\s+\w+Component/)) {
                fileIssues.push('Missing comma between components');
            }

            if (fileIssues.length > 0) {
                this.issues.push({ file: fileName, issues: fileIssues });
                this.issuesFound += fileIssues.length;
                console.log(`⚠️  ${fileName}: ${fileIssues.length} issue(s)`);
                fileIssues.forEach(issue => {
                    console.log(`   • ${issue}`);
                });
                return false;
            } else {
                this.validModules++;
                return true;
            }

        } catch (error) {
            this.issues.push({ file: path.basename(filePath), issues: [`Read error: ${error.message}`] });
            console.error(`❌ Error validating ${filePath}: ${error.message}`);
            return false;
        }
    }

    /**
     * Validate array syntax (basic check)
     */
    validateArraySyntax(arrayContent) {
        // Remove comments and whitespace
        const cleaned = arrayContent.replace(/\/\/.*$/gm, '').trim();

        if (!cleaned) return true; // Empty array is valid

        // Split by commas and check each item
        const items = cleaned.split(',').map(item => item.trim()).filter(item => item);

        // Check for valid identifiers (basic validation)
        for (const item of items) {
            if (!item.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*(\.[a-zA-Z_$][a-zA-Z0-9_$]*)*(\(.*\))?$/)) {
                // Allow for complex expressions like Module.forRoot()
                if (!item.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*(\.[a-zA-Z_$][a-zA-Z0-9_$]*)*(\.[a-zA-Z_$][a-zA-Z0-9_$]*\(.*\))?$/)) {
                    return false;
                }
            }
        }

        return true;
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
                    this.validateModuleFile(fullPath);
                }
            }
        } catch (error) {
            console.error(`❌ Error processing directory ${dirPath}: ${error.message}`);
        }
    }

    /**
     * Generate validation report
     */
    generateReport() {
        console.log('\n' + '='.repeat(60));
        console.log('✅ MODULE SYNTAX VALIDATION REPORT');
        console.log('='.repeat(60));

        console.log(`📊 VALIDATION RESULTS:`);
        console.log(`   • Modules Validated: ${this.processedFiles}`);
        console.log(`   • Valid Modules: ${this.validModules}`);
        console.log(`   • Modules with Issues: ${this.issues.length}`);
        console.log(`   • Total Issues Found: ${this.issuesFound}`);

        const successRate = ((this.validModules / this.processedFiles) * 100).toFixed(1);
        console.log(`   • Success Rate: ${successRate}%`);

        if (this.issues.length === 0) {
            console.log(`\n🎉 PERFECT! All ${this.processedFiles} modules have valid syntax!`);
            console.log(`✅ No syntax issues found`);
            console.log(`🚀 All modules are ready for compilation`);
        } else {
            console.log(`\n⚠️  ISSUES SUMMARY:`);
            console.log(`   ${this.issues.length} modules need attention`);

            if (this.issues.length <= 10) {
                console.log(`\n📋 DETAILED ISSUES:`);
                this.issues.forEach((issue, index) => {
                    console.log(`   ${index + 1}. ${issue.file}:`);
                    issue.issues.forEach(prob => {
                        console.log(`      • ${prob}`);
                    });
                });
            }
        }

        console.log('='.repeat(60));
    }

    /**
     * Main execution
     */
    run(targetPath = './apps/web-giddh/src') {
        console.log('✅ Starting Module Syntax Validation...');
        console.log(`📁 Target: ${path.resolve(targetPath)}\n`);

        this.processAllModules(targetPath);
        this.generateReport();

        return this.issues.length === 0;
    }
}

// Execute
const validator = new ModuleSyntaxValidator();
const allValid = validator.run();
process.exit(allValid ? 0 : 1);
