#!/usr/bin/env node

/**
 * CSS Variable !important Script
 * Automatically applies !important to var(--color-white) across all SCSS/CSS files
 *
 * Usage: node css-variable-important-script.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const CONFIG = {
    // Target directory to search
    searchDir: './apps/web-giddh/src/assets/styles',

    // File patterns to include
    filePatterns: ['**/*.scss', '**/*.css'],

    // CSS variables to apply !important to
    targetVariables: [
        'var(--color-white)',
        'var(--color-black)',
        'var(--color-light-gray)',
        'var(--color-medium-gray)',
        'var(--color-dark-gray)',
        'var(--color-red)',
        'var(--color-green)',
        'var(--color-blue)',
        'var(--color-orange)',
        'var(--bg-primary-color)',
        'var(--theme-primary-color)',
        'var(--theme-accent-color)',
        'var(--theme-warn-color)',
        'var(--text-primary-color)',
        'var(--border-color)'
    ],

    // Backup directory
    backupDir: './css-backup',

    // Dry run mode (set to false to actually apply changes)
    dryRun: true
};

class CSSVariableProcessor {
    constructor(config) {
        this.config = config;
        this.processedFiles = 0;
        this.changedFiles = 0;
        this.totalChanges = 0;
        this.errors = [];
    }

    /**
     * Main processing function
     */
    async process() {
        console.log('🎨 CSS Variable !important Script');
        console.log('=====================================');
        console.log(`Target Directory: ${this.config.searchDir}`);
        console.log(`Dry Run Mode: ${this.config.dryRun ? 'ON' : 'OFF'}`);
        console.log(`Target Variables: ${this.config.targetVariables.length}`);
        console.log('');

        try {
            // Create backup directory if not in dry run mode
            if (!this.config.dryRun) {
                await this.createBackupDirectory();
            }

            // Find all CSS/SCSS files
            const files = await this.findFiles();
            console.log(`📁 Found ${files.length} CSS/SCSS files`);
            console.log('');

            // Process each file
            for (const file of files) {
                await this.processFile(file);
            }

            // Print summary
            this.printSummary();

        } catch (error) {
            console.error('❌ Error:', error.message);
            process.exit(1);
        }
    }

    /**
     * Find all CSS/SCSS files
     */
    async findFiles() {
        const files = [];

        for (const pattern of this.config.filePatterns) {
            const fullPattern = path.join(this.config.searchDir, pattern);
            const matchedFiles = glob.sync(fullPattern);
            files.push(...matchedFiles);
        }

        return [...new Set(files)]; // Remove duplicates
    }

    /**
     * Create backup directory
     */
    async createBackupDirectory() {
        if (!fs.existsSync(this.config.backupDir)) {
            fs.mkdirSync(this.config.backupDir, { recursive: true });
            console.log(`📦 Created backup directory: ${this.config.backupDir}`);
        }
    }

    /**
     * Process a single file
     */
    async processFile(filePath) {
        try {
            this.processedFiles++;

            // Read file content
            const content = fs.readFileSync(filePath, 'utf8');
            let modifiedContent = content;
            let fileChanges = 0;

            // Apply transformations for each target variable
            for (const variable of this.config.targetVariables) {
                const result = this.applyImportantToVariable(modifiedContent, variable);
                modifiedContent = result.content;
                fileChanges += result.changes;
            }

            // If changes were made
            if (fileChanges > 0) {
                this.changedFiles++;
                this.totalChanges += fileChanges;

                console.log(`✏️  ${path.relative(process.cwd(), filePath)} (${fileChanges} changes)`);

                if (!this.config.dryRun) {
                    // Create backup
                    await this.createBackup(filePath, content);

                    // Write modified content
                    fs.writeFileSync(filePath, modifiedContent, 'utf8');
                }
            }

        } catch (error) {
            this.errors.push({ file: filePath, error: error.message });
            console.error(`❌ Error processing ${filePath}: ${error.message}`);
        }
    }

    /**
     * Apply !important to a specific CSS variable
     */
    applyImportantToVariable(content, variable) {
        let changes = 0;

        // Regex patterns to match the variable usage
        const patterns = [
            // Pattern 1: color: var(--color-white); -> color: var(--color-white) !important;
            new RegExp(`(\\s*)(color|background-color|background|border-color|fill|stroke):\\s*(${this.escapeRegex(variable)})\\s*;`, 'gi'),

            // Pattern 2: color: var(--color-white) -> color: var(--color-white) !important;
            new RegExp(`(\\s*)(color|background-color|background|border-color|fill|stroke):\\s*(${this.escapeRegex(variable)})(?!\\s*!important)\\s*(?=;|$)`, 'gi')
        ];

        let modifiedContent = content;

        for (const pattern of patterns) {
            modifiedContent = modifiedContent.replace(pattern, (match, indent, property, variableMatch) => {
                changes++;
                return `${indent}${property}: ${variableMatch} !important;`;
            });
        }

        return { content: modifiedContent, changes };
    }

    /**
     * Escape special regex characters
     */
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Create backup of original file
     */
    async createBackup(filePath, content) {
        const relativePath = path.relative(this.config.searchDir, filePath);
        const backupPath = path.join(this.config.backupDir, relativePath);
        const backupDir = path.dirname(backupPath);

        // Create backup directory structure
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        // Write backup file
        fs.writeFileSync(backupPath, content, 'utf8');
    }

    /**
     * Print processing summary
     */
    printSummary() {
        console.log('');
        console.log('📊 Processing Summary');
        console.log('====================');
        console.log(`Files Processed: ${this.processedFiles}`);
        console.log(`Files Changed: ${this.changedFiles}`);
        console.log(`Total Changes: ${this.totalChanges}`);
        console.log(`Errors: ${this.errors.length}`);

        if (this.config.dryRun) {
            console.log('');
            console.log('🔍 DRY RUN MODE - No files were actually modified');
            console.log('   Set CONFIG.dryRun = false to apply changes');
        } else {
            console.log('');
            console.log('✅ Changes applied successfully!');
            console.log(`📦 Backups created in: ${this.config.backupDir}`);
        }

        if (this.errors.length > 0) {
            console.log('');
            console.log('❌ Errors encountered:');
            this.errors.forEach(error => {
                console.log(`   ${error.file}: ${error.error}`);
            });
        }
    }
}

// Additional utility functions for specific CSS variable patterns
class AdvancedCSSProcessor extends CSSVariableProcessor {
    /**
     * Apply !important to all CSS variables, not just specific ones
     */
    applyImportantToAllVariables(content) {
        let changes = 0;

        // Pattern to match any CSS variable usage without !important
        const pattern = /(color|background-color|background|border-color|fill|stroke):\s*(var\([^)]+\))(?!\s*!important)\s*;/gi;

        const modifiedContent = content.replace(pattern, (match, property, variable) => {
            changes++;
            return `${property}: ${variable} !important;`;
        });

        return { content: modifiedContent, changes };
    }

    /**
     * Process file with advanced patterns
     */
    async processFileAdvanced(filePath) {
        try {
            this.processedFiles++;

            const content = fs.readFileSync(filePath, 'utf8');
            const result = this.applyImportantToAllVariables(content);

            if (result.changes > 0) {
                this.changedFiles++;
                this.totalChanges += result.changes;

                console.log(`✏️  ${path.relative(process.cwd(), filePath)} (${result.changes} changes)`);

                if (!this.config.dryRun) {
                    await this.createBackup(filePath, content);
                    fs.writeFileSync(filePath, result.content, 'utf8');
                }
            }

        } catch (error) {
            this.errors.push({ file: filePath, error: error.message });
            console.error(`❌ Error processing ${filePath}: ${error.message}`);
        }
    }
}

// Main execution
if (require.main === module) {
    const processor = new CSSVariableProcessor(CONFIG);
    processor.process().catch(console.error);
}

module.exports = { CSSVariableProcessor, AdvancedCSSProcessor, CONFIG };
