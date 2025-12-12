#!/usr/bin/env node

/**
 * Fix CSS Syntax Errors Script
 * Fixes malformed CSS selectors introduced by the CSS variable script
 *
 * Usage: node fix-css-syntax-errors.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    searchDir: './apps/web-giddh/src/assets/styles',
    fileExtensions: ['.scss', '.css'],
    backupDir: './css-syntax-fix-backup',
    dryRun: false
};

class CSSyntaxFixer {
    constructor(config) {
        this.config = config;
        this.processedFiles = 0;
        this.changedFiles = 0;
        this.totalChanges = 0;
        this.errors = [];
        this.allFiles = [];
    }

    async process() {
        console.log('🔧 CSS Syntax Error Fixer');
        console.log('==========================');
        console.log(`Target Directory: ${this.config.searchDir}`);
        console.log(`Dry Run Mode: ${this.config.dryRun ? 'ON' : 'OFF'}`);
        console.log('');

        try {
            if (!this.config.dryRun) {
                await this.createBackupDirectory();
            }

            await this.findAllFiles(this.config.searchDir);
            console.log(`📁 Found ${this.allFiles.length} CSS/SCSS files`);
            console.log('');

            for (const file of this.allFiles) {
                await this.processFile(file);
            }

            this.printSummary();

        } catch (error) {
            console.error('❌ Error:', error.message);
            process.exit(1);
        }
    }

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

    async createBackupDirectory() {
        if (!fs.existsSync(this.config.backupDir)) {
            fs.mkdirSync(this.config.backupDir, { recursive: true });
            console.log(`📦 Created backup directory: ${this.config.backupDir}`);
        }
    }

    async processFile(filePath) {
        try {
            this.processedFiles++;

            const content = fs.readFileSync(filePath, 'utf8');
            const result = this.fixCSSyntaxErrors(content);

            if (result.changes > 0) {
                this.changedFiles++;
                this.totalChanges += result.changes;

                console.log(`✏️  ${path.relative(process.cwd(), filePath)} (${result.changes} fixes)`);

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

    fixCSSyntaxErrors(content) {
        let changes = 0;
        let modifiedContent = content;

        // Fix patterns like "selector: pseudo-class" -> "selector:pseudo-class"
        const patterns = [
            // Pattern 1: Fix spaces before pseudo-classes
            {
                regex: /(\S+)\s*:\s*(hover|focus|active|visited|first-child|last-child|nth-child|before|after|checked|disabled|enabled|focus-visible|focus-within)/gi,
                replacement: '$1:$2',
                description: 'Fix spaces before pseudo-classes'
            },

            // Pattern 2: Fix spaces before pseudo-elements
            {
                regex: /(\S+)\s*:\s*:(before|after|first-line|first-letter)/gi,
                replacement: '$1::$2',
                description: 'Fix spaces before pseudo-elements'
            },

            // Pattern 3: Fix multiple spaces in selectors
            {
                regex: /(\S+)\s{2,}(\S+)/g,
                replacement: '$1 $2',
                description: 'Fix multiple spaces in selectors'
            }
        ];

        for (const pattern of patterns) {
            const beforeCount = (modifiedContent.match(pattern.regex) || []).length;
            modifiedContent = modifiedContent.replace(pattern.regex, pattern.replacement);
            const afterCount = (modifiedContent.match(pattern.regex) || []).length;
            const patternChanges = beforeCount - afterCount;

            if (patternChanges > 0) {
                changes += patternChanges;
                console.log(`    - ${pattern.description}: ${patternChanges} fixes`);
            }
        }

        return { content: modifiedContent, changes };
    }

    async createBackup(filePath, content) {
        const relativePath = path.relative(this.config.searchDir, filePath);
        const backupPath = path.join(this.config.backupDir, relativePath);
        const backupDir = path.dirname(backupPath);

        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        fs.writeFileSync(backupPath, content, 'utf8');
    }

    printSummary() {
        console.log('');
        console.log('📊 CSS Syntax Fix Summary');
        console.log('=========================');
        console.log(`Files Processed: ${this.processedFiles}`);
        console.log(`Files Fixed: ${this.changedFiles}`);
        console.log(`Total Fixes: ${this.totalChanges}`);
        console.log(`Errors: ${this.errors.length}`);

        if (this.config.dryRun) {
            console.log('');
            console.log('🔍 DRY RUN MODE - No files were actually modified');
        } else {
            console.log('');
            console.log('✅ CSS syntax errors fixed successfully!');
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

// Main execution
if (require.main === module) {
    const fixer = new CSSyntaxFixer(CONFIG);
    fixer.process().catch(console.error);
}

module.exports = { CSSyntaxFixer, CONFIG };
