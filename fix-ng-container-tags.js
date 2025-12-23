#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Script to properly replace ng-container with div where appTranslate directive is present
 * This script handles proper tag matching and replacement
 */

class NgContainerTagFixer {
    constructor() {
        this.processedFiles = 0;
        this.modifiedFiles = 0;
        this.errors = [];
    }

    /**
     * Analyze and fix ng-container/div tag mismatches with appTranslate directive
     * @param {string} content - File content
     * @returns {object} - {modified: boolean, content: string, issues: array}
     */
    fixNgContainerTags(content) {
        let modified = false;
        let newContent = content;
        let issues = [];

        // Find lines with appTranslate directive
        const lines = content.split('\n');
        let appTranslateLineIndex = -1;
        let openingTagType = null;

        // Find the opening tag with appTranslate
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('appTranslate')) {
                // Look backwards to find the opening tag
                for (let j = i; j >= 0; j--) {
                    const line = lines[j].trim();
                    if (line.startsWith('<ng-container')) {
                        appTranslateLineIndex = j;
                        openingTagType = 'ng-container';
                        break;
                    } else if (line.startsWith('<div')) {
                        appTranslateLineIndex = j;
                        openingTagType = 'div';
                        break;
                    }
                }
                break;
            }
        }

        if (appTranslateLineIndex === -1) {
            return { modified: false, content: newContent, issues: ['No appTranslate directive found'] };
        }

        console.log(`Found appTranslate with opening tag: ${openingTagType}`);

        // If opening tag is ng-container, replace it with div
        if (openingTagType === 'ng-container') {
            // Replace ng-container opening tag with div
            newContent = newContent.replace(/<ng-container(\s+[^>]*appTranslate[^>]*)>/i, '<div$1>');

            // Find and replace the corresponding closing tag
            // Count nested containers to find the right closing tag
            let containerCount = 0;
            let foundClosing = false;

            const updatedLines = newContent.split('\n');
            for (let i = 0; i < updatedLines.length; i++) {
                const line = updatedLines[i];

                // Count opening containers
                const openMatches = line.match(/<ng-container[^>]*>/g) || [];
                const divOpenMatches = line.match(/<div[^>]*>/g) || [];
                containerCount += openMatches.length;

                // Count closing containers
                const closeMatches = line.match(/<\/ng-container>/g) || [];
                const divCloseMatches = line.match(/<\/div>/g) || [];

                // If we find closing ng-container tags and our container count allows it
                if (closeMatches.length > 0 && !foundClosing) {
                    // Replace the last </ng-container> with </div>
                    updatedLines[i] = line.replace(/<\/ng-container>$/, '</div>');
                    foundClosing = true;
                    break;
                }
            }

            newContent = updatedLines.join('\n');
            modified = true;
            console.log('Replaced ng-container with div tags');
        }

        // Verify tag consistency
        const divOpenCount = (newContent.match(/<div[^>]*appTranslate[^>]*>/g) || []).length;
        const ngContainerOpenCount = (newContent.match(/<ng-container[^>]*appTranslate[^>]*>/g) || []).length;

        if (divOpenCount > 0 && ngContainerOpenCount > 0) {
            issues.push('Mixed ng-container and div tags with appTranslate found');
        }

        return { modified, content: newContent, issues };
    }

    /**
     * Process a single file
     * @param {string} filePath - Path to the file
     */
    processFile(filePath) {
        try {
            this.processedFiles++;
            console.log(`\nProcessing: ${filePath}`);

            const content = fs.readFileSync(filePath, 'utf8');
            const result = this.fixNgContainerTags(content);

            if (result.issues.length > 0) {
                console.log(`⚠️  Issues found: ${result.issues.join(', ')}`);
            }

            if (result.modified) {
                fs.writeFileSync(filePath, result.content, 'utf8');
                this.modifiedFiles++;
                console.log(`✅ Modified: ${filePath}`);
            } else {
                console.log(`⏭️  No changes needed: ${filePath}`);
            }
        } catch (error) {
            const errorMsg = `Error processing ${filePath}: ${error.message}`;
            console.error(`❌ ${errorMsg}`);
            this.errors.push(errorMsg);
        }
    }

    /**
     * Process all HTML files in the given directory that contain appTranslate
     * @param {string} baseDir - Base directory to search
     */
    processDirectory(baseDir) {
        console.log(`🔍 Searching for HTML files with appTranslate in: ${baseDir}`);

        const files = glob.sync('**/*.html', {
            cwd: baseDir,
            absolute: true,
            ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
        });

        console.log(`📁 Found ${files.length} HTML files`);

        // Filter files that contain appTranslate
        const appTranslateFiles = files.filter(file => {
            try {
                const content = fs.readFileSync(file, 'utf8');
                return content.includes('appTranslate');
            } catch (error) {
                return false;
            }
        });

        console.log(`🎯 Found ${appTranslateFiles.length} files with appTranslate directive`);

        if (appTranslateFiles.length === 0) {
            console.log('⚠️  No HTML files found with appTranslate directive');
            return;
        }

        appTranslateFiles.forEach(file => this.processFile(file));
    }

    /**
     * Process a single specific file
     * @param {string} filePath - Path to the specific file
     */
    processSingleFile(filePath) {
        if (!fs.existsSync(filePath)) {
            console.error(`❌ File not found: ${filePath}`);
            return;
        }

        if (!filePath.endsWith('.html')) {
            console.error(`❌ File is not an HTML file: ${filePath}`);
            return;
        }

        console.log(`🎯 Processing single file: ${filePath}`);
        this.processFile(filePath);
    }

    /**
     * Print summary of the operation
     */
    printSummary() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 OPERATION SUMMARY');
        console.log('='.repeat(60));
        console.log(`📁 Files processed: ${this.processedFiles}`);
        console.log(`✅ Files modified: ${this.modifiedFiles}`);
        console.log(`❌ Errors: ${this.errors.length}`);

        if (this.errors.length > 0) {
            console.log('\n🚨 ERRORS:');
            this.errors.forEach(error => console.log(`   ${error}`));
        }

        if (this.modifiedFiles > 0) {
            console.log('\n🎉 SUCCESS: ng-container tags with appTranslate directive have been properly replaced with div tags!');
        } else {
            console.log('\n💡 INFO: No files needed modification.');
        }
    }
}

// Main execution
function main() {
    const args = process.argv.slice(2);
    const fixer = new NgContainerTagFixer();

    console.log('🚀 Starting ng-container tag fixing script...');
    console.log('🎯 Target: Properly replace ng-container with div where appTranslate directive is present');

    if (args.length === 0) {
        console.log('❌ Usage:');
        console.log('   node fix-ng-container-tags.js <file-path>           # Process single file');
        console.log('   node fix-ng-container-tags.js <directory-path>     # Process all HTML files in directory');
        process.exit(1);
    }

    const targetPath = path.resolve(args[0]);

    if (fs.statSync(targetPath).isFile()) {
        fixer.processSingleFile(targetPath);
    } else if (fs.statSync(targetPath).isDirectory()) {
        fixer.processDirectory(targetPath);
    } else {
        console.error(`❌ Invalid path: ${targetPath}`);
        process.exit(1);
    }

    fixer.printSummary();
}

// Export for testing or module usage
if (require.main === module) {
    main();
} else {
    module.exports = NgContainerTagFixer;
}
