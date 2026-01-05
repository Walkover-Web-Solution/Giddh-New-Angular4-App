#!/usr/bin/env node

/**
 * Debug Cleanup Script
 * Removes console.log, console.error, console.warn and other debug artifacts from production code
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 Debug Cleanup - Removing Development Artifacts');
console.log('================================================');

class DebugCleaner {
    constructor() {
        this.processedFiles = 0;
        this.modifiedFiles = 0;
        this.totalRemovals = 0;
        this.errors = [];
        this.dryRun = process.argv.includes('--dry-run');
        this.verbose = process.argv.includes('--verbose');
    }

    /**
     * Find all TypeScript and JavaScript files to process
     */
    findSourceFiles(dir, sourceFiles = []) {
        try {
            const files = fs.readdirSync(dir);

            for (const file of files) {
                const fullPath = path.join(dir, file);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    // Skip node_modules, dist, and other build directories
                    if (!['node_modules', 'dist', '.git', '.angular', 'coverage', 'e2e'].includes(file)) {
                        this.findSourceFiles(fullPath, sourceFiles);
                    }
                } else if (file.endsWith('.ts') || file.endsWith('.js')) {
                    // Skip definition files and minified files
                    if (!file.endsWith('.d.ts') && !file.endsWith('.min.js')) {
                        sourceFiles.push(fullPath);
                    }
                }
            }
        } catch (error) {
            this.errors.push(`Error reading directory ${dir}: ${error.message}`);
        }

        return sourceFiles;
    }

    /**
     * Clean debug statements from a single file
     */
    cleanFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            let cleanedContent = content;
            let fileRemovals = 0;

            // Pattern 1: Simple console statements (console.log, console.error, etc.)
            const simpleConsolePattern = /^\s*console\.(log|error|warn|info|debug|trace)\s*\([^;]*\);\s*$/gm;
            const simpleMatches = cleanedContent.match(simpleConsolePattern);
            if (simpleMatches) {
                cleanedContent = cleanedContent.replace(simpleConsolePattern, '');
                fileRemovals += simpleMatches.length;
            }

            // Pattern 2: Multi-line console statements
            const multiLineConsolePattern = /^\s*console\.(log|error|warn|info|debug|trace)\s*\(\s*[\s\S]*?\);\s*$/gm;
            const multiLineMatches = cleanedContent.match(multiLineConsolePattern);
            if (multiLineMatches) {
                cleanedContent = cleanedContent.replace(multiLineConsolePattern, '');
                fileRemovals += multiLineMatches.length;
            }

            // Pattern 3: Debug comments
            const debugCommentPattern = /^\s*\/\/\s*(DEBUG|FIXME|HACK|TODO:.*debug|console\.)/gmi;
            const debugComments = cleanedContent.match(debugCommentPattern);
            if (debugComments) {
                cleanedContent = cleanedContent.replace(debugCommentPattern, '');
                fileRemovals += debugComments.length;
            }

            // Pattern 4: Debug blocks
            const debugBlockPattern = /\/\*\s*(DEBUG|DEBUGGING)[\s\S]*?\*\//gi;
            const debugBlocks = cleanedContent.match(debugBlockPattern);
            if (debugBlocks) {
                cleanedContent = cleanedContent.replace(debugBlockPattern, '');
                fileRemovals += debugBlocks.length;
            }

            // Pattern 5: Development-only code blocks
            const devOnlyPattern = /if\s*\(\s*!?environment\.production\s*\)\s*\{[\s\S]*?console\.[^}]*\}/gi;
            const devOnlyMatches = cleanedContent.match(devOnlyPattern);
            if (devOnlyMatches) {
                // Only remove console statements within dev blocks, not the entire block
                devOnlyMatches.forEach(block => {
                    const cleanedBlock = block.replace(/console\.(log|error|warn|info|debug|trace)\s*\([^;]*\);\s*/g, '');
                    cleanedContent = cleanedContent.replace(block, cleanedBlock);
                });
                fileRemovals += devOnlyMatches.length;
            }

            // Clean up empty lines left by removals
            cleanedContent = cleanedContent.replace(/\n\s*\n\s*\n/g, '\n\n');

            // Write back if changes were made and not in dry run mode
            if (fileRemovals > 0) {
                if (!this.dryRun) {
                    fs.writeFileSync(filePath, cleanedContent, 'utf8');
                }
                this.modifiedFiles++;
                this.totalRemovals += fileRemovals;
                
                const action = this.dryRun ? '[DRY RUN]' : '✅';
                console.log(`${action} ${path.relative(process.cwd(), filePath)} (${fileRemovals} removals)`);
                
                if (this.verbose) {
                    console.log(`   File size: ${content.length} → ${cleanedContent.length} bytes`);
                }
            }

            this.processedFiles++;

        } catch (error) {
            this.errors.push(`Error processing file ${filePath}: ${error.message}`);
        }
    }

    /**
     * Special handling for specific files that need careful cleaning
     */
    cleanSpecialFiles() {
        const specialFiles = [
            'apps/web-giddh/src/app/app.module.ts',
            'apps/web-giddh/src/main.ts',
            'apps/web-giddh/src/main.electron.ts'
        ];

        console.log('\n🔧 Cleaning special files with debug logging...');
        
        specialFiles.forEach(relativePath => {
            const fullPath = path.join(process.cwd(), relativePath);
            if (fs.existsSync(fullPath)) {
                this.cleanFile(fullPath);
            }
        });
    }

    /**
     * Generate a report of what was cleaned
     */
    generateReport() {
        console.log('\n📊 DEBUG CLEANUP REPORT:');
        console.log('========================');
        console.log(`📄 Total files processed: ${this.processedFiles}`);
        console.log(`✅ Files modified: ${this.modifiedFiles}`);
        console.log(`🗑️  Total debug statements removed: ${this.totalRemovals}`);
        
        if (this.dryRun) {
            console.log('\n🔍 DRY RUN MODE - No files were actually modified');
            console.log('Run without --dry-run to apply changes');
        }

        if (this.errors.length > 0) {
            console.log(`\n❌ Errors encountered: ${this.errors.length}`);
            this.errors.forEach(error => console.log(`   ${error}`));
        }

        // Recommendations
        console.log('\n💡 RECOMMENDATIONS:');
        console.log('===================');
        console.log('1. Review modified files to ensure no important logging was removed');
        console.log('2. Consider using Angular environment checks for conditional logging');
        console.log('3. Implement proper error handling instead of console.error');
        console.log('4. Use Angular DevTools for debugging instead of console.log');
        
        if (this.totalRemovals > 0) {
            console.log('\n📝 NEXT STEPS:');
            console.log('1. Test the application to ensure functionality is intact');
            console.log('2. Commit the cleaned files');
            console.log('3. Set up ESLint rules to prevent future debug statements');
            console.log('4. Consider implementing a pre-commit hook for automatic cleanup');
        }
    }

    /**
     * Main execution function
     */
    run(targetDirectory = './apps/web-giddh/src') {
        console.log(`📁 Target directory: ${targetDirectory}`);
        console.log(`🔍 Mode: ${this.dryRun ? 'DRY RUN' : 'CLEANUP'}`);
        console.log('');

        // Check if target directory exists
        if (!fs.existsSync(targetDirectory)) {
            console.error(`❌ Target directory does not exist: ${targetDirectory}`);
            return;
        }

        // Find all source files
        console.log('🔍 Finding source files...');
        const sourceFiles = this.findSourceFiles(targetDirectory);
        console.log(`📄 Found ${sourceFiles.length} source files to process`);
        console.log('');

        // Process each file
        console.log('🧹 Processing files...');
        for (const filePath of sourceFiles) {
            this.cleanFile(filePath);
        }

        // Clean special files
        this.cleanSpecialFiles();

        // Generate report
        this.generateReport();

        console.log('\n✅ Debug cleanup completed!');
    }
}

// Execute the script
const cleaner = new DebugCleaner();

// Get target directory from command line argument or use default
const targetDir = process.argv.find(arg => !arg.startsWith('--') && arg !== __filename && arg !== 'node') || './apps/web-giddh/src';
cleaner.run(targetDir);
