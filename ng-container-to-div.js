#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to convert ng-container tags to div tags with proper start/end format
 * Usage: node ng-container-to-div.js [directory]
 * Default directory: ./apps/web-giddh/src
 */

class NgContainerToDivConverter {
    constructor(targetDirectory = './apps/web-giddh/src') {
        this.targetDirectory = path.resolve(targetDirectory);
        this.processedFiles = 0;
        this.modifiedFiles = 0;
        this.totalReplacements = 0;
    }

    /**
     * Process all HTML and TypeScript template files recursively
     */
    async processDirectory(dir = this.targetDirectory) {
        try {
            const entries = fs.readdirSync(dir, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);

                if (entry.isDirectory()) {
                    // Skip node_modules and dist directories
                    if (!['node_modules', 'dist', '.git'].includes(entry.name)) {
                        await this.processDirectory(fullPath);
                    }
                } else if (entry.isFile()) {
                    // Process HTML files and TypeScript files with templates
                    if (entry.name.endsWith('.html') || entry.name.endsWith('.component.ts')) {
                        await this.processFile(fullPath);
                    }
                }
            }
        } catch (error) {
            console.error(`Error processing directory ${dir}:`, error.message);
        }
    }

    /**
     * Process individual file
     */
    async processFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const modifiedContent = this.convertNgContainerToDiv(content);

            this.processedFiles++;

            if (content !== modifiedContent) {
                fs.writeFileSync(filePath, modifiedContent, 'utf8');
                this.modifiedFiles++;
                console.log(`✅ Modified: ${path.relative(this.targetDirectory, filePath)}`);
            }
        } catch (error) {
            console.error(`Error processing file ${filePath}:`, error.message);
        }
    }

    /**
     * Convert ng-container tags to div tags
     */
    convertNgContainerToDiv(content) {
        let modifiedContent = content;
        let replacements = 0;

        // Pattern 1: Self-closing ng-container tags
        // <ng-container *ngIf="condition" /> -> <div *ngIf="condition"></div>
        const selfClosingPattern = /<ng-container([^>]*?)\/>/g;
        modifiedContent = modifiedContent.replace(selfClosingPattern, (match, attributes) => {
            replacements++;
            return `<div${attributes}></div>`;
        });

        // Pattern 2: Opening and closing ng-container tags
        // <ng-container *ngIf="condition">content</ng-container> -> <div *ngIf="condition">content</div>
        const openClosePattern = /<ng-container([^>]*?)>([\s\S]*?)<\/ng-container>/g;
        modifiedContent = modifiedContent.replace(openClosePattern, (match, attributes, content) => {
            replacements++;
            return `<div${attributes}>${content}</div>`;
        });

        // Pattern 3: Just opening ng-container tags (in case of malformed HTML)
        const openingPattern = /<ng-container([^>]*?)>/g;
        modifiedContent = modifiedContent.replace(openingPattern, (match, attributes) => {
            // Only replace if it's not already part of a self-closing or complete tag
            if (!match.includes('/>') && !modifiedContent.includes(`${match}`) ||
                modifiedContent.indexOf(`${match}`) === modifiedContent.lastIndexOf(`${match}`)) {
                replacements++;
                return `<div${attributes}>`;
            }
            return match;
        });

        // Pattern 4: Closing ng-container tags
        const closingPattern = /<\/ng-container>/g;
        modifiedContent = modifiedContent.replace(closingPattern, () => {
            return '</div>';
        });

        this.totalReplacements += replacements;

        if (replacements > 0) {
            console.log(`   - Replaced ${replacements} ng-container tags`);
        }

        return modifiedContent;
    }

    /**
     * Display summary of processing
     */
    displaySummary() {
        console.log('\n' + '='.repeat(60));
        console.log('NG-CONTAINER TO DIV CONVERSION SUMMARY');
        console.log('='.repeat(60));
        console.log(`📁 Target Directory: ${this.targetDirectory}`);
        console.log(`📄 Files Processed: ${this.processedFiles}`);
        console.log(`✏️  Files Modified: ${this.modifiedFiles}`);
        console.log(`🔄 Total Replacements: ${this.totalReplacements}`);
        console.log('='.repeat(60));

        if (this.modifiedFiles > 0) {
            console.log('✅ Conversion completed successfully!');
            console.log('💡 All ng-container tags have been converted to div tags.');
        } else {
            console.log('ℹ️  No ng-container tags found to convert.');
        }
    }
}

// Main execution
async function main() {
    const targetDir = process.argv[2] || './apps/web-giddh/src';

    console.log('🚀 Starting ng-container to div conversion...');
    console.log(`📂 Target directory: ${path.resolve(targetDir)}\n`);

    if (!fs.existsSync(targetDir)) {
        console.error(`❌ Error: Directory "${targetDir}" does not exist.`);
        process.exit(1);
    }

    const converter = new NgContainerToDivConverter(targetDir);

    try {
        await converter.processDirectory();
        converter.displaySummary();
    } catch (error) {
        console.error('❌ Fatal error during conversion:', error.message);
        process.exit(1);
    }
}

// Run the script
if (require.main === module) {
    main().catch(console.error);
}

module.exports = NgContainerToDivConverter;
