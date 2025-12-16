#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Script to replace div elements that use appTranslate directive with span elements
 * In Angular 21, directives cannot be used on ng-container, so we use span with CSS to minimize DOM impact
 */

function replaceDivWithSpan(content) {
    let modified = false;

    // Pattern 1: Replace opening div tags that have appTranslate directive with span
    const openingTagPattern = /<div(\s[^>]*?\sappTranslate[^>]*?)>/g;
    const openingTagPatternStart = /<div(\sappTranslate[^>]*?)>/g;

    // Check if content has div tags with appTranslate
    let hasAppTranslateDiv = false;
    let openingMatches = [];

    // Find all div tags with appTranslate directive and replace with span
    content = content.replace(openingTagPattern, (match, attributes) => {
        hasAppTranslateDiv = true;
        openingMatches.push(match);
        // Add a CSS class to make the span invisible/minimal
        return `<span${attributes} class="translate-wrapper">`;
    });

    // Also check for div tags that start with appTranslate
    content = content.replace(openingTagPatternStart, (match, attributes) => {
        hasAppTranslateDiv = true;
        openingMatches.push(match);
        return `<span${attributes} class="translate-wrapper">`;
    });

    if (hasAppTranslateDiv) {
        modified = true;

        // Replace corresponding closing div tags with span
        let replacementCount = 0;
        content = content.replace(/<\/div>/g, (match) => {
            if (replacementCount < openingMatches.length) {
                replacementCount++;
                return '</span>';
            }
            return match;
        });
    }

    return { content, modified };
}

function processFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const result = replaceDivWithSpan(content);

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

function createCSSFile() {
    const cssContent = `/* CSS for translate-wrapper spans to minimize DOM impact */
.translate-wrapper {
    display: contents; /* Makes the span behave like it's not there for layout */
}

/* Fallback for browsers that don't support display: contents */
@supports not (display: contents) {
    .translate-wrapper {
        display: inline;
        margin: 0;
        padding: 0;
        border: none;
        background: none;
    }
}
`;

    const cssPath = './apps/web-giddh/src/assets/styles/translate-wrapper.css';
    fs.writeFileSync(cssPath, cssContent, 'utf8');
    console.log(`📝 Created CSS file: ${cssPath}`);
    console.log('   Please import this CSS file in your main styles or component styles.');
}

function main() {
    const args = process.argv.slice(2);
    const isPreview = !args.includes('--apply');
    const createCSS = args.includes('--create-css');
    const targetDirectory = args.find(arg => !arg.startsWith('--')) || './apps/web-giddh/src';

    if (createCSS) {
        createCSSFile();
        return;
    }

    console.log(`🔍 Searching for HTML files in: ${targetDirectory}`);
    console.log('📋 This script replaces div elements with appTranslate directive with span elements');
    console.log('   (Angular 21 compatible - directives cannot be used on ng-container)');

    if (!fs.existsSync(targetDirectory)) {
        console.error(`❌ Directory not found: ${targetDirectory}`);
        process.exit(1);
    }

    if (isPreview) {
        console.log('🔍 Preview mode - showing files that would be changed:\n');

        const htmlFiles = findHtmlFiles(targetDirectory);
        let previewCount = 0;

        htmlFiles.forEach(filePath => {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const result = replaceDivWithSpan(content);

                if (result.modified) {
                    previewCount++;
                    console.log(`📝 Would modify: ${filePath}`);

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

        console.log(`📊 Preview Summary: ${previewCount} files would be modified`);
        console.log('\nTo apply changes, run: node replace-div-with-span-app-translate.js --apply');
        console.log('To create CSS file, run: node replace-div-with-span-app-translate.js --create-css');
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
        console.log('   All div elements with appTranslate directive have been replaced with span elements.');
        console.log('   📝 Don\'t forget to run: node replace-div-with-span-app-translate.js --create-css');
        console.log('   📝 Then import the generated CSS file in your main styles.');
    } else {
        console.log('\n✅ No files needed modification.');
    }
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = {
    replaceDivWithSpan,
    processFile,
    findHtmlFiles
};
