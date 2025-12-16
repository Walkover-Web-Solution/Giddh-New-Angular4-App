#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Script to replace div elements that use appTranslate directive with ng-container elements
 * This prevents unnecessary DOM elements from being rendered while keeping the directive functionality
 */

function replaceDivWithNgContainer(content) {
    let modified = false;

    // Pattern 1: Replace opening div tags that have appTranslate directive
    // This pattern looks for <div with appTranslate anywhere in the attributes
    const openingTagPattern = /<div(\s[^>]*?\sappTranslate[^>]*?)>/g;
    const openingTagPatternStart = /<div(\sappTranslate[^>]*?)>/g;

    // Check if content has div tags with appTranslate
    let hasAppTranslateDiv = false;
    let openingMatches = [];

    // Find all div tags with appTranslate directive
    content = content.replace(openingTagPattern, (match, attributes) => {
        hasAppTranslateDiv = true;
        openingMatches.push(match);
        return `<ng-container${attributes}>`;
    });

    // Also check for div tags that start with appTranslate
    content = content.replace(openingTagPatternStart, (match, attributes) => {
        hasAppTranslateDiv = true;
        openingMatches.push(match);
        return `<ng-container${attributes}>`;
    });

    if (hasAppTranslateDiv) {
        modified = true;

        // Replace corresponding closing div tags with ng-container
        // We need to be careful to only replace the right number of closing tags
        let replacementCount = 0;
        content = content.replace(/<\/div>/g, (match) => {
            if (replacementCount < openingMatches.length) {
                replacementCount++;
                return '</ng-container>';
            }
            return match;
        });
    }

    return { content, modified };
}

function processFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const result = replaceDivWithNgContainer(content);

        if (result.modified) {
            fs.writeFileSync(filePath, result.content, 'utf8');
            console.log(`✅ Updated: ${filePath}`);
            return true;
        } else {
            console.log(`⏭️  No changes needed: ${filePath}`);
            return false;
        }
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        return false;
    }
}

function findHtmlFiles(directory) {
    const pattern = path.join(directory, '**/*.html');
    return glob.sync(pattern, {
        ignore: [
            '**/node_modules/**',
            '**/dist/**',
            '**/build/**',
            '**/.git/**'
        ]
    });
}

function previewChanges(directory) {
    console.log('🔍 Preview mode - showing files that would be changed:\n');

    const htmlFiles = findHtmlFiles(directory);
    let previewCount = 0;

    htmlFiles.forEach(filePath => {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const result = replaceDivWithNgContainer(content);

            if (result.modified) {
                previewCount++;
                console.log(`📝 Would modify: ${filePath}`);

                // Show a sample of what would change
                const lines = content.split('\n');
                lines.forEach((line, index) => {
                    if (line.includes('<div') && line.includes('appTranslate')) {
                        console.log(`   Line ${index + 1}: ${line.trim()}`);
                    }
                });
                console.log('');
            }
        } catch (error) {
            console.error(`❌ Error reading ${filePath}:`, error.message);
        }
    });

    console.log(`📊 Preview Summary: ${previewCount} files would be modified out of ${htmlFiles.length} HTML files`);
    console.log('\nTo apply changes, run: node replace-div-with-ng-container.js --apply');
}

function main() {
    const args = process.argv.slice(2);
    const isPreview = !args.includes('--apply');
    const targetDirectory = args.find(arg => !arg.startsWith('--')) || './apps/web-giddh/src';

    console.log(`🔍 Searching for HTML files in: ${targetDirectory}`);

    if (!fs.existsSync(targetDirectory)) {
        console.error(`❌ Directory not found: ${targetDirectory}`);
        process.exit(1);
    }

    if (isPreview) {
        previewChanges(targetDirectory);
        return;
    }

    const htmlFiles = findHtmlFiles(targetDirectory);
    console.log(`📁 Found ${htmlFiles.length} HTML files`);

    if (htmlFiles.length === 0) {
        console.log('No HTML files found to process.');
        return;
    }

    let processedCount = 0;
    let modifiedCount = 0;

    console.log('\n🚀 Starting replacement process...\n');

    htmlFiles.forEach(filePath => {
        processedCount++;
        const wasModified = processFile(filePath);
        if (wasModified) {
            modifiedCount++;
        }
    });

    console.log('\n📊 Summary:');
    console.log(`   Total files processed: ${processedCount}`);
    console.log(`   Files modified: ${modifiedCount}`);
    console.log(`   Files unchanged: ${processedCount - modifiedCount}`);

    if (modifiedCount > 0) {
        console.log('\n✨ Replacement completed successfully!');
        console.log('   All div elements with appTranslate directive have been replaced with ng-container elements.');
        console.log('   This will prevent unnecessary DOM elements from being rendered.');
    } else {
        console.log('\n✅ No files needed modification.');
    }
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = {
    replaceDivWithNgContainer,
    processFile,
    findHtmlFiles
};
