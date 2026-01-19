#!/usr/bin/env node
/**
 * Debug Cleanup Script
 * Removes console.log, console.error, console.warn and other debug artifacts from production code
 */
import fs from 'fs';
import path from 'path';
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
     * Sanitize file path to prevent path traversal
     */
    sanitizePath(basePath, userPath) {
        // Resolve paths to absolute paths
        const resolvedBase = path.resolve(basePath);
        const resolvedUser = path.resolve(basePath, userPath);

        // Check if the resolved user path is within the base path
        if (!resolvedUser.startsWith(resolvedBase + path.sep) && resolvedUser !== resolvedBase) {
            throw new Error(`Path traversal attempt detected: ${userPath}`);
        }

        return resolvedUser;
    }

    /**
     * Find all TypeScript and JavaScript files to process
     */
    findSourceFiles(dir, sourceFiles = []) {
        try {
            // Validate that dir is within allowed paths
            const allowedPaths = [
                path.resolve('./apps'),
                path.resolve('./libs'),
                path.resolve('./scripts'),
                path.resolve('./tools')
            ];

            const resolvedDir = path.resolve(dir);
            const isAllowed = allowedPaths.some(allowedPath =>
                resolvedDir.startsWith(allowedPath)
            );

            if (!isAllowed) {
                throw new Error(`Directory not in allowed paths: ${dir}`);
            }

            const files = fs.readdirSync(dir);
            for (const file of files) {
                // Sanitize the file path to prevent path traversal
                const fullPath = this.sanitizePath(dir, file);
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
            const fileRemovals = 0;
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
                if (this.verbose) {
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
        if (this.dryRun) {
        }
        if (this.errors.length > 0) {
            // Error reporting removed for production
        }
        // Recommendations
        if (this.totalRemovals > 0) {
        }
    }
    /**
     * Main execution function
     */
    run(targetDirectory = './apps/web-giddh/src') {
        // Check if target directory exists
        if (!fs.existsSync(targetDirectory)) {
            return;
        }
        // Find all source files
        const sourceFiles = this.findSourceFiles(targetDirectory);
        // Process each file
        for (const filePath of sourceFiles) {
            this.cleanFile(filePath);
        }
        // Clean special files
        this.cleanSpecialFiles();
        // Generate report
        this.generateReport();
    }
}
// Execute the script
const cleaner = new DebugCleaner();
// Get target directory from command line argument or use default
const targetDir = process.argv.find(arg => !arg.startsWith('--') && arg !== __filename && arg !== 'node') || './apps/web-giddh/src';
cleaner.run(targetDir);
