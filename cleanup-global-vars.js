#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Comprehensive cleanup script to fix malformed syntax created by global variable replacement
 */

class GlobalVariableCleanup {
    constructor() {
        this.processedFiles = 0;
        this.fixedIssues = 0;
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

        // Patterns to fix malformed syntax
        this.cleanupPatterns = [
            // Fix malformed import statements
            {
                pattern: /import\s*{\s*([^}]*),\s*environment\.([A-Z_]+),\s*([^}]*)\s*}\s*from/g,
                replacement: 'import { $1, $2, $3 } from',
                description: 'Fix malformed import with environment.PROPERTY'
            },
            // Fix malformed variable declarations
            {
                pattern: /export\s+(let|const)\s+environment\.([A-Z_]+)\s*=/g,
                replacement: 'export $1 $2 =',
                description: 'Fix malformed variable declaration with environment.PROPERTY'
            },
            // Fix malformed interface properties
            {
                pattern: /(\s+)environment\.([A-Z_]+):\s*([^;]+);/g,
                replacement: '$1$2: $3;',
                description: 'Fix malformed interface property with environment.PROPERTY'
            },
            // Fix malformed object properties
            {
                pattern: /(\s+)'environment\.([A-Z_]+)':\s*([^,\n]+)/g,
                replacement: "$1'$2': $3",
                description: 'Fix malformed object property with environment.PROPERTY'
            },
            // Fix serviceConfig.environment references
            {
                pattern: /serviceConfig\?\.environment\.([A-Z_]+)/g,
                replacement: 'serviceConfig?.$1',
                description: 'Fix serviceConfig.environment.PROPERTY references'
            },
            // Fix config.environment references
            {
                pattern: /config\.environment\.([A-Z_]+)/g,
                replacement: 'config.$1',
                description: 'Fix config.environment.PROPERTY references'
            },
            // Fix Configuration.environment references
            {
                pattern: /Configuration\.environment\.([A-Z_]+)/g,
                replacement: 'Configuration.$1',
                description: 'Fix Configuration.environment.PROPERTY references'
            }
        ];
    }

    /**
     * Main execution function
     */
    run(targetDirectory = './apps/web-giddh/src') {
        console.log('🧹 Starting global variable cleanup...');
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
            let fixesInFile = 0;

            // Apply cleanup patterns
            this.cleanupPatterns.forEach(cleanupPattern => {
                cleanupPattern.pattern.lastIndex = 0; // Reset regex state
                const matches = content.match(cleanupPattern.pattern);
                if (matches) {
                    content = content.replace(cleanupPattern.pattern, cleanupPattern.replacement);
                    fixesInFile += matches.length;
                    fileModified = true;
                }
            });

            // Write the modified content back to file if changes were made
            if (fileModified) {
                fs.writeFileSync(filePath, content, 'utf8');

                this.processedFiles++;
                this.fixedIssues += fixesInFile;

                console.log(`🔧 Fixed: ${path.relative(process.cwd(), filePath)} (${fixesInFile} issues)`);
            }

        } catch (error) {
            this.errors.push(`Error processing ${filePath}: ${error.message}`);
            console.error(`❌ Error processing ${filePath}: ${error.message}`);
        }
    }

    /**
     * Print summary of operations
     */
    printSummary() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 GLOBAL VARIABLE CLEANUP SUMMARY');
        console.log('='.repeat(60));
        console.log(`✅ Files processed: ${this.processedFiles}`);
        console.log(`🔧 Issues fixed: ${this.fixedIssues}`);

        if (this.errors.length > 0) {
            console.log(`❌ Errors encountered: ${this.errors.length}`);
            this.errors.forEach(error => console.log(`   ${error}`));
        } else {
            console.log('✅ No errors encountered');
        }

        console.log('='.repeat(60));

        if (this.processedFiles > 0) {
            console.log('🎉 Global variable cleanup completed successfully!');
            console.log('💡 All malformed syntax has been fixed');
            console.log('📋 Next steps:');
            console.log('   1. Restart the development server');
            console.log('   2. Check for any remaining compilation errors');
            console.log('   3. Test the application functionality');
        } else {
            console.log('ℹ️  No files needed cleanup - syntax already correct');
        }
    }
}

// Execute the script
if (require.main === module) {
    const cleaner = new GlobalVariableCleanup();
    const targetDir = process.argv[2] || './apps/web-giddh/src';
    cleaner.run(targetDir);
}

module.exports = GlobalVariableCleanup;
