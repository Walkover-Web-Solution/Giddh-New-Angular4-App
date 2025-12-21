#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to replace ALL remaining global variable references with environment/Configuration equivalents
 * Handles: APP_FOLDER, AppUrl, PRODUCTION_ENV, LOCAL_ENV, STAGING_ENV, TEST_ENV, etc.
 */

class GlobalVariableFixer {
    constructor() {
        this.processedFiles = 0;
        this.replacedReferences = 0;
        this.addedImports = 0;
        this.errors = [];

        // Files to exclude from processing
        this.excludePatterns = [
            /node_modules/,
            /\.d\.ts$/,
            /environment\.ts$/,
            /environment\.generated\.ts$/,
            /\.spec\.ts$/,
            /\.test\.ts$/,
            /\.backup/,
            /\.bak$/,
            /dist\//,
            /\.git\//
        ];

        // Global variable patterns to replace
        this.globalVarPatterns = [
            // APP_FOLDER patterns
            {
                pattern: /(?<!environment\.|Configuration\.)APP_FOLDER(?!\s*:)/g,
                replacement: 'environment.APP_FOLDER',
                needsEnvironmentImport: true
            },
            // AppUrl patterns
            {
                pattern: /(?<!environment\.|Configuration\.|serviceConfig\.)AppUrl(?!\s*:)/g,
                replacement: 'environment.AppUrl',
                needsEnvironmentImport: true
            },
            // Environment flags
            {
                pattern: /(?<!environment\.)PRODUCTION_ENV(?!\s*:)/g,
                replacement: 'environment.production',
                needsEnvironmentImport: true
            },
            {
                pattern: /(?<!environment\.)LOCAL_ENV(?!\s*:)/g,
                replacement: '!environment.production',
                needsEnvironmentImport: true
            },
            {
                pattern: /(?<!environment\.)STAGING_ENV(?!\s*:)/g,
                replacement: 'environment.production',
                needsEnvironmentImport: true
            },
            {
                pattern: /(?<!environment\.)TEST_ENV(?!\s*:)/g,
                replacement: '!environment.production',
                needsEnvironmentImport: true
            },
            // Other global variables
            {
                pattern: /(?<!environment\.)PORTAL_URL(?!\s*:)/g,
                replacement: 'environment.PORTAL_URL',
                needsEnvironmentImport: true
            },
            {
                pattern: /(?<!environment\.)GOOGLE_CLIENT_ID(?!\s*:)/g,
                replacement: 'environment.GOOGLE_CLIENT_ID',
                needsEnvironmentImport: true
            },
            {
                pattern: /(?<!environment\.)GOOGLE_CLIENT_SECRET(?!\s*:)/g,
                replacement: 'environment.GOOGLE_CLIENT_SECRET',
                needsEnvironmentImport: true
            },
            {
                pattern: /(?<!environment\.)OTP_WIDGET_ID(?!\s*:)/g,
                replacement: 'environment.OTP_WIDGET_ID',
                needsEnvironmentImport: true
            },
            {
                pattern: /(?<!environment\.)OTP_TOKEN_AUTH(?!\s*:)/g,
                replacement: 'environment.OTP_TOKEN_AUTH',
                needsEnvironmentImport: true
            },
            {
                pattern: /(?<!environment\.)RAZORPAY_KEY(?!\s*:)/g,
                replacement: 'environment.RAZORPAY_KEY',
                needsEnvironmentImport: true
            }
        ];
    }

    /**
     * Main execution function
     */
    run(targetDirectory = './apps/web-giddh/src') {
        console.log('🔄 Starting global variable replacement...');
        console.log(`📁 Target directory: ${targetDirectory}`);

        if (!fs.existsSync(targetDirectory)) {
            console.error(`❌ Directory not found: ${targetDirectory}`);
            process.exit(1);
        }

        this.processDirectory(targetDirectory);
        this.printSummary();
    }

    /**
     * Process all files in a directory recursively
     */
    processDirectory(dirPath) {
        const items = fs.readdirSync(dirPath);

        for (const item of items) {
            const fullPath = path.join(dirPath, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                if (!this.shouldExclude(fullPath)) {
                    this.processDirectory(fullPath);
                }
            } else if (stat.isFile() && this.shouldProcessFile(fullPath)) {
                this.processFile(fullPath);
            }
        }
    }

    /**
     * Check if file/directory should be excluded
     */
    shouldExclude(filePath) {
        return this.excludePatterns.some(pattern => pattern.test(filePath));
    }

    /**
     * Check if file should be processed (TypeScript files only)
     */
    shouldProcessFile(filePath) {
        return filePath.endsWith('.ts') && !this.shouldExclude(filePath);
    }

    /**
     * Process a single TypeScript file
     */
    processFile(filePath) {
        try {
            let content = fs.readFileSync(filePath, 'utf8');
            const originalContent = content;
            let fileModified = false;
            let replacementsInFile = 0;
            let needsEnvironmentImport = false;
            let needsConfigurationImport = false;

            // Check if file contains global variable references that need replacement
            const hasGlobalReferences = this.globalVarPatterns.some(varPattern => {
                varPattern.pattern.lastIndex = 0; // Reset regex state
                return varPattern.pattern.test(content);
            });

            if (!hasGlobalReferences) {
                return; // Skip files without global variable references
            }

            console.log(`🔍 Processing: ${path.relative(process.cwd(), filePath)}`);

            // Replace global variable patterns
            this.globalVarPatterns.forEach(varPattern => {
                varPattern.pattern.lastIndex = 0; // Reset regex state
                const matches = content.match(varPattern.pattern);
                if (matches) {
                    content = content.replace(varPattern.pattern, varPattern.replacement);
                    replacementsInFile += matches.length;
                    fileModified = true;

                    if (varPattern.needsEnvironmentImport) {
                        needsEnvironmentImport = true;
                    }
                    if (varPattern.needsConfigurationImport) {
                        needsConfigurationImport = true;
                    }
                }
            });

            // Add necessary imports if replacements were made
            if (fileModified) {
                content = this.addNecessaryImports(content, filePath, needsEnvironmentImport, needsConfigurationImport);

                // Write the modified content back to file
                fs.writeFileSync(filePath, content, 'utf8');

                this.processedFiles++;
                this.replacedReferences += replacementsInFile;

                console.log(`  ✅ Replaced ${replacementsInFile} global variable reference(s)`);
            }

        } catch (error) {
            this.errors.push(`Error processing ${filePath}: ${error.message}`);
            console.error(`❌ Error processing ${filePath}: ${error.message}`);
        }
    }

    /**
     * Add necessary imports for environment and Configuration
     */
    addNecessaryImports(content, filePath, needsEnvironmentImport, needsConfigurationImport) {
        const lines = content.split('\n');
        let hasEnvironmentImport = false;
        let hasConfigurationImport = false;
        let lastImportIndex = -1;

        // Check existing imports
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            if (line.startsWith('import')) {
                lastImportIndex = i;

                if (line.includes('environment') && line.includes('environments/environment')) {
                    hasEnvironmentImport = true;
                }
                if (line.includes('Configuration') && line.includes('app.constant')) {
                    hasConfigurationImport = true;
                }
            }
        }

        // Calculate relative paths
        const relativePath = path.relative(path.dirname(filePath), path.join(process.cwd(), 'apps/web-giddh/src/app'));
        const appConstantPath = path.join(relativePath, 'app.constant').replace(/\\/g, '/');
        const environmentPath = path.join(relativePath, '../environments/environment').replace(/\\/g, '/');

        // Add missing imports
        const importsToAdd = [];

        if (needsEnvironmentImport && !hasEnvironmentImport) {
            importsToAdd.push(`import { environment } from '${environmentPath.startsWith('.') ? environmentPath : './' + environmentPath}';`);
            this.addedImports++;
        }

        if (needsConfigurationImport && !hasConfigurationImport) {
            importsToAdd.push(`import { Configuration } from '${appConstantPath.startsWith('.') ? appConstantPath : './' + appConstantPath}';`);
            this.addedImports++;
        }

        if (importsToAdd.length > 0) {
            // Insert imports after the last existing import, or at the beginning
            const insertIndex = lastImportIndex >= 0 ? lastImportIndex + 1 : 0;
            lines.splice(insertIndex, 0, ...importsToAdd);

            console.log(`  📦 Added ${importsToAdd.length} import(s)`);
        }

        return lines.join('\n');
    }

    /**
     * Print summary of operations
     */
    printSummary() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 GLOBAL VARIABLE REPLACEMENT SUMMARY');
        console.log('='.repeat(60));
        console.log(`✅ Files processed: ${this.processedFiles}`);
        console.log(`🔄 Total replacements: ${this.replacedReferences}`);
        console.log(`📦 Imports added: ${this.addedImports}`);

        if (this.errors.length > 0) {
            console.log(`❌ Errors encountered: ${this.errors.length}`);
            this.errors.forEach(error => console.log(`   ${error}`));
        } else {
            console.log('✅ No errors encountered');
        }

        console.log('='.repeat(60));

        if (this.processedFiles > 0) {
            console.log('🎉 Global variable replacement completed successfully!');
            console.log('💡 All global variables have been replaced with environment/Configuration references');
            console.log('📋 Next steps:');
            console.log('   1. Review the changes in your IDE');
            console.log('   2. Test the application to ensure everything works');
            console.log('   3. Commit the changes to version control');
        } else {
            console.log('ℹ️  No files needed processing - all global variables already converted');
        }
    }
}

// Execute the script
if (require.main === module) {
    const fixer = new GlobalVariableFixer();
    const targetDir = process.argv[2] || './apps/web-giddh/src';
    fixer.run(targetDir);
}

module.exports = GlobalVariableFixer;
