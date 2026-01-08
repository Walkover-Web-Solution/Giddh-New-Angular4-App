#!/usr/bin/env node

/**
 * Prettier Code Formatter Script
 * Formats TypeScript, HTML, and SCSS files across the entire Angular application
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class PrettierFormatter {
    constructor() {
        this.processedFiles = 0;
        this.skippedFiles = 0;
        this.errors = [];
        this.startTime = Date.now();

        // File extensions to format
        this.targetExtensions = ['.ts', '.html', '.scss', '.css', '.js'];

        // Directories to exclude
        this.excludeDirs = [
            'node_modules',
            'dist',
            '.git',
            '.angular',
            'coverage',
            '.nyc_output',
            'tmp',
            'temp'
        ];

        // Files to exclude
        this.excludeFiles = [
            '*.min.js',
            '*.min.css',
            '*.d.ts',
            'environment.generated.ts'
        ];
    }

    /**
     * Check if Prettier is installed
     */
    checkPrettierInstallation() {
        try {
            execSync('npx prettier --version', { stdio: 'pipe' });
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Install Prettier if not available
     */
    installPrettier() {
        try {
            execSync('npm install --save-dev prettier @prettier/plugin-php', { stdio: 'inherit' });
            return true;
        } catch (error) {
            this.errors.push(`Failed to install Prettier: ${error.message}`);
            return false;
        }
    }

    /**
     * Check if file should be excluded
     */
    shouldExcludeFile(filePath) {
        const fileName = path.basename(filePath);
        const dirName = path.dirname(filePath);

        // Check excluded directories
        for (const excludeDir of this.excludeDirs) {
            if (dirName.includes(excludeDir)) {
                return true;
            }
        }

        // Check excluded file patterns
        for (const pattern of this.excludeFiles) {
            if (pattern.includes('*')) {
                const regex = new RegExp(pattern.replace('*', '.*'));
                if (regex.test(fileName)) {
                    return true;
                }
            } else if (fileName === pattern) {
                return true;
            }
        }

        return false;
    }

    /**
     * Find all files to format recursively
     */
    findFilesToFormat(directory) {
        const files = [];

        if (!fs.existsSync(directory)) {
            return files;
        }

        const items = fs.readdirSync(directory);

        for (const item of items) {
            const fullPath = path.join(directory, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                // Skip excluded directories
                if (!this.excludeDirs.includes(item)) {
                    files.push(...this.findFilesToFormat(fullPath));
                }
            } else if (stat.isFile()) {
                const ext = path.extname(fullPath);

                // Check if file should be formatted
                if (this.targetExtensions.includes(ext) && !this.shouldExcludeFile(fullPath)) {
                    files.push(fullPath);
                }
            }
        }

        return files;
    }

    /**
     * Format a single file with Prettier
     */
    formatFile(filePath) {
        try {
            // Check if file exists and is readable
            if (!fs.existsSync(filePath)) {
                this.skippedFiles++;
                return false;
            }

            // Run Prettier on the file
            execSync(`npx prettier --write "${filePath}"`, {
                stdio: 'pipe',
                timeout: 30000 // 30 second timeout per file
            });

            this.processedFiles++;
            return true;
        } catch (error) {
            this.errors.push(`Error formatting ${filePath}: ${error.message}`);
            this.skippedFiles++;
            return false;
        }
    }

    /**
     * Format files in batches for better performance
     */
    formatFilesBatch(files, batchSize = 50) {
        const batches = [];
        for (let i = 0; i < files.length; i += batchSize) {
            batches.push(files.slice(i, i + batchSize));
        }

        for (let i = 0; i < batches.length; i++) {
            const batch = batches[i];
            const fileList = batch.map(f => `"${f}"`).join(' ');

            try {
                execSync(`npx prettier --write ${fileList}`, {
                    stdio: 'pipe',
                    timeout: 120000 // 2 minute timeout per batch
                });
                this.processedFiles += batch.length;
            } catch (error) {
                // Fallback to individual file processing for this batch
                for (const file of batch) {
                    this.formatFile(file);
                }
            }
        }
    }

    /**
     * Generate formatting report
     */
    generateReport() {
        const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);

        // Success summary
        if (this.processedFiles > 0) {
            // Files formatted successfully
        }

        // Skipped files
        if (this.skippedFiles > 0) {
            // Files skipped during formatting
        }

        // Errors
        if (this.errors.length > 0) {
            // Formatting errors encountered
        }

        // Performance stats
        const filesPerSecond = this.processedFiles > 0 ? (this.processedFiles / parseFloat(duration)).toFixed(2) : 0;

        return {
            processedFiles: this.processedFiles,
            skippedFiles: this.skippedFiles,
            errors: this.errors.length,
            duration: duration,
            filesPerSecond: filesPerSecond
        };
    }

    /**
     * Format specific file types
     */
    formatByType(directory, fileType) {
        const extensions = {
            'typescript': ['.ts'],
            'html': ['.html'],
            'styles': ['.scss', '.css'],
            'javascript': ['.js']
        };

        if (!extensions[fileType]) {
            this.errors.push(`Unknown file type: ${fileType}`);
            return;
        }

        const originalExtensions = this.targetExtensions;
        this.targetExtensions = extensions[fileType];

        const files = this.findFilesToFormat(directory);
        this.formatFilesBatch(files);

        this.targetExtensions = originalExtensions;
    }

    /**
     * Main execution function
     */
    run(targetDirectory = './apps/web-giddh/src', options = {}) {
        // Check if Prettier is available
        if (!this.checkPrettierInstallation()) {
            if (!this.installPrettier()) {
                return false;
            }
        }

        // Handle specific file type formatting
        if (options.fileType) {
            this.formatByType(targetDirectory, options.fileType);
            return this.generateReport();
        }

        // Find all files to format
        const files = this.findFilesToFormat(targetDirectory);

        if (files.length === 0) {
            return { processedFiles: 0, skippedFiles: 0, errors: 0, duration: 0 };
        }

        // Format files in batches for better performance
        this.formatFilesBatch(files);

        // Generate and return report
        return this.generateReport();
    }
}

// CLI execution
if (require.main === module) {
    const formatter = new PrettierFormatter();

    // Parse command line arguments
    const args = process.argv.slice(2);
    const targetDir = args[0] || './apps/web-giddh/src';
    const fileType = args.find(arg => arg.startsWith('--type='))?.split('=')[1];

    const options = {
        fileType: fileType
    };

    // Run formatter
    const report = formatter.run(targetDir, options);

    if (report) {
        process.exit(0);
    } else {
        process.exit(1);
    }
}

module.exports = PrettierFormatter;
