#!/usr/bin/env node

/**
 * Apply !important to ALL CSS Variables Script
 * Automatically applies !important to all var(--*) usage across all SCSS/CSS files
 *
 * Usage: node apply-all-css-variables-important.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    // Target directory to search
    searchDir: './apps/web-giddh/src/assets/styles',

    // File extensions to process
    fileExtensions: ['.scss', '.css'],

    // Backup directory
    backupDir: './css-backup-all-variables',

    // Dry run mode (set to false to actually apply changes)
    dryRun: false,

    // Properties to apply !important to when using CSS variables
    targetProperties: [
        'color',
        'background-color',
        'background',
        'border-color',
        'border',
        'fill',
        'stroke',
        'outline-color',
        'text-decoration-color',
        'box-shadow',
        'text-shadow'
    ]
};

class AllCSSVariableProcessor {
    constructor(config) {
        this.config = config;
        this.processedFiles = 0;
        this.changedFiles = 0;
        this.totalChanges = 0;
        this.errors = [];
        this.allFiles = [];
    }

    /**
     * Main processing function
     */
    async process() {
        console.log('🎨 Apply !important to ALL CSS Variables');
        console.log('==========================================');
        console.log(`Target Directory: ${this.config.searchDir}`);
        console.log(`Dry Run Mode: ${this.config.dryRun ? 'ON' : 'OFF'}`);
        console.log('');

        try {
            // Create backup directory if not in dry run mode
            if (!this.config.dryRun) {
                await this.createBackupDirectory();
            }

            // Find all CSS/SCSS files
            await this.findAllFiles(this.config.searchDir);
            console.log(`📁 Found ${this.allFiles.length} CSS/SCSS files`);
            console.log('');

            // Process each file
            for (const file of this.allFiles) {
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
     * Recursively find all CSS/SCSS files
     */
    async findAllFiles(dir) {
        const items = fs.readdirSync(dir);

        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                await this.findAllFiles(fullPath);
            } else if (this.config.fileExtensions.includes(path.extname(item))) {
                this.allFiles.push(fullPath);
            }
        }
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
            const result = this.applyImportantToAllCSSVariables(content);

            // If changes were made
            if (result.changes > 0) {
                this.changedFiles++;
                this.totalChanges += result.changes;

                console.log(`✏️  ${path.relative(process.cwd(), filePath)} (${result.changes} changes)`);

                if (!this.config.dryRun) {
                    // Create backup
                    await this.createBackup(filePath, content);

                    // Write modified content
                    fs.writeFileSync(filePath, result.content, 'utf8');
                }
            }

        } catch (error) {
            this.errors.push({ file: filePath, error: error.message });
            console.error(`❌ Error processing ${filePath}: ${error.message}`);
        }
    }

    /**
     * Apply !important to ALL CSS variables in the content
     */
    applyImportantToAllCSSVariables(content) {
        let changes = 0;
        let modifiedContent = content;

        // Pattern 1: Match any CSS property with var(--*) that doesn't already have !important
        const pattern1 = /(\s*)([\w-]+):\s*(var\(--[^)]+\))(?!\s*!important)\s*;/gi;

        modifiedContent = modifiedContent.replace(pattern1, (match, indent, property, variable) => {
            changes++;
            return `${indent}${property}: ${variable} !important;`;
        });

        // Pattern 2: Match CSS properties with multiple values including var(--*)
        const pattern2 = /(\s*)([\w-]+):\s*([^;]*var\(--[^)]+\)[^;]*)(?!\s*!important)\s*;/gi;

        modifiedContent = modifiedContent.replace(pattern2, (match, indent, property, value) => {
            // Only apply if it contains var(--) and doesn't already have !important
            if (value.includes('var(--') && !value.includes('!important')) {
                changes++;
                return `${indent}${property}: ${value.trim()} !important;`;
            }
            return match;
        });

        return { content: modifiedContent, changes };
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
            console.log('   Edit the script and set CONFIG.dryRun = false to apply changes');
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

        console.log('');
        console.log('📋 Examples of changes made:');
        console.log('   color: var(--color-white); → color: var(--color-white) !important;');
        console.log('   background: var(--bg-primary-color); → background: var(--bg-primary-color) !important;');
        console.log('   border-color: var(--theme-border-color); → border-color: var(--theme-border-color) !important;');
    }
}

// Additional utility class for advanced processing
class AdvancedAllCSSProcessor extends AllCSSVariableProcessor {
    /**
     * More sophisticated pattern matching for complex CSS
     */
    applyImportantToAllCSSVariables(content) {
        let changes = 0;
        let modifiedContent = content;

        // Pattern 1: Simple var(--*) usage
        const simplePattern = /(\s*)([\w-]+):\s*(var\(--[^)]+\))(?!\s*!important)\s*;/gi;

        modifiedContent = modifiedContent.replace(simplePattern, (match, indent, property, variable) => {
            changes++;
            return `${indent}${property}: ${variable} !important;`;
        });

        // Pattern 2: Complex values with var(--*) - like box-shadow, gradients, etc.
        const complexPattern = /(\s*)([\w-]+):\s*([^;]*?)(?<!!)(\s*);/gi;

        modifiedContent = modifiedContent.replace(complexPattern, (match, indent, property, value, endSpace) => {
            // Check if value contains var(--) and doesn't already have !important
            if (value.includes('var(--') && !value.includes('!important')) {
                changes++;
                return `${indent}${property}: ${value.trim()} !important;`;
            }
            return match;
        });

        // Pattern 3: Multi-line CSS properties
        const multilinePattern = /(\s*)([\w-]+):\s*([^;]*var\(--[^)]+\)[^;]*?)(?!\s*!important)\s*;/gis;

        modifiedContent = modifiedContent.replace(multilinePattern, (match, indent, property, value) => {
            if (!value.includes('!important')) {
                changes++;
                return `${indent}${property}: ${value.trim()} !important;`;
            }
            return match;
        });

        return { content: modifiedContent, changes };
    }
}

// Main execution
if (require.main === module) {
    console.log('Select processing mode:');
    console.log('1. Standard processing (recommended)');
    console.log('2. Advanced processing (more aggressive)');
    console.log('');

    // For now, use standard processing
    const processor = new AllCSSVariableProcessor(CONFIG);
    processor.process().catch(console.error);
}

module.exports = { AllCSSVariableProcessor, AdvancedAllCSSProcessor, CONFIG };
