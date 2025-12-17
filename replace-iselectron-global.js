#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to replace all global 'isElectron' references with 'environment.isElectron'
 * and add necessary imports across the entire Angular project
 */

class IsElectronReplacer {
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

        // Patterns to match isElectron usage (excluding already converted ones)
        this.isElectronPatterns = [
            /(?<!Configuration\.|environment\.)isElectron(?!\s*:)/g,
            /window\["isElectron"\]/g,
            /window\['isElectron'\]/g,
            /window\.isElectron/g
        ];
    }

    /**
     * Main execution function
     */
    run(targetDirectory = './apps/web-giddh/src') {
        console.log('🔄 Starting isElectron global variable replacement...');
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
                // Skip excluded directories
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

            // Check if file contains isElectron references that need replacement
            const hasIsElectronReferences = this.isElectronPatterns.some(pattern => {
                pattern.lastIndex = 0; // Reset regex state
                return pattern.test(content);
            });

            if (!hasIsElectronReferences) {
                return; // Skip files without isElectron references
            }

            console.log(`🔍 Processing: ${path.relative(process.cwd(), filePath)}`);

            // Replace isElectron patterns
            this.isElectronPatterns.forEach(pattern => {
                pattern.lastIndex = 0; // Reset regex state
                const matches = content.match(pattern);
                if (matches) {
                    if (pattern.source.includes('window')) {
                        // Replace window["isElectron"], window['isElectron'], window.isElectron
                        content = content.replace(pattern, 'Configuration.isElectron');
                    } else {
                        // Replace standalone isElectron
                        content = content.replace(pattern, 'Configuration.isElectron');
                    }
                    replacementsInFile += matches.length;
                    fileModified = true;
                }
            });

            // Add necessary imports if replacements were made
            if (fileModified) {
                content = this.addNecessaryImports(content, filePath);

                // Write the modified content back to file
                fs.writeFileSync(filePath, content, 'utf8');

                this.processedFiles++;
                this.replacedReferences += replacementsInFile;

                console.log(`  ✅ Replaced ${replacementsInFile} isElectron reference(s)`);
            }

        } catch (error) {
            this.errors.push(`Error processing ${filePath}: ${error.message}`);
            console.error(`❌ Error processing ${filePath}: ${error.message}`);
        }
    }

    /**
     * Add necessary imports for Configuration and environment
     */
    addNecessaryImports(content, filePath) {
        const lines = content.split('\n');
        let hasConfigurationImport = false;
        let hasEnvironmentImport = false;
        let lastImportIndex = -1;

        // Check existing imports
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            if (line.startsWith('import')) {
                lastImportIndex = i;

                if (line.includes('Configuration') && line.includes('./app.constant')) {
                    hasConfigurationImport = true;
                }
                if (line.includes('environment') && line.includes('environments/environment')) {
                    hasEnvironmentImport = true;
                }
            }
        }

        // Calculate relative path to app.constant and environment
        const relativePath = path.relative(path.dirname(filePath), path.join(process.cwd(), 'apps/web-giddh/src/app'));
        const appConstantPath = path.join(relativePath, 'app.constant').replace(/\\/g, '/');
        const environmentPath = path.join(relativePath, '../environments/environment').replace(/\\/g, '/');

        // Add missing imports
        const importsToAdd = [];

        if (!hasConfigurationImport) {
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
        console.log('📊 ISELECTRON REPLACEMENT SUMMARY');
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
            console.log('🎉 isElectron global variable replacement completed successfully!');
            console.log('💡 All isElectron references have been replaced with Configuration.isElectron');
            console.log('📋 Next steps:');
            console.log('   1. Review the changes in your IDE');
            console.log('   2. Test the application to ensure everything works');
            console.log('   3. Commit the changes to version control');
        } else {
            console.log('ℹ️  No files needed processing - all isElectron references already converted');
        }
    }
}

// Execute the script
if (require.main === module) {
    const replacer = new IsElectronReplacer();
    const targetDir = process.argv[2] || './apps/web-giddh/src';
    replacer.run(targetDir);
}

module.exports = IsElectronReplacer;
