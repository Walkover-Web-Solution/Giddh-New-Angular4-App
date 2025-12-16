#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Script to replace ng-container elements that use appTranslate directive with div elements
 * This is needed because ng-container doesn't render in the DOM but the appTranslate directive needs a DOM element
 */

function replaceNgContainerWithAppTranslate(content) {
    let modified = false;
    
    // Pattern 1: Replace opening ng-container tags that have appTranslate directive
    const openingTagPattern = /<ng-container([^>]*appTranslate[^>]*)>/g;
    if (openingTagPattern.test(content)) {
        content = content.replace(openingTagPattern, '<div$1>');
        modified = true;
    }
    
    // Pattern 2: Replace closing ng-container tags (but only if we found opening tags with appTranslate)
    if (modified) {
        // Count opening and closing tags to ensure we replace the right ones
        const openingMatches = content.match(/<div[^>]*appTranslate[^>]*>/g) || [];
        const closingMatches = content.match(/<\/ng-container>/g) || [];
        
        if (openingMatches.length > 0 && closingMatches.length > 0) {
            // Replace closing ng-container tags with closing div tags
            // We need to be careful to only replace the ones that correspond to our converted opening tags
            let replacementCount = 0;
            content = content.replace(/<\/ng-container>/g, (match) => {
                if (replacementCount < openingMatches.length) {
                    replacementCount++;
                    return '</div>';
                }
                return match;
            });
        }
    }
    
    return { content, modified };
}

function processFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const result = replaceNgContainerWithAppTranslate(content);
        
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

function main() {
    const args = process.argv.slice(2);
    const targetDirectory = args[0] || './apps/web-giddh/src';
    
    console.log(`🔍 Searching for HTML files in: ${targetDirectory}`);
    
    if (!fs.existsSync(targetDirectory)) {
        console.error(`❌ Directory not found: ${targetDirectory}`);
        process.exit(1);
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
        console.log('   All ng-container elements with appTranslate directive have been replaced with div elements.');
    } else {
        console.log('\n✅ No files needed modification.');
    }
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = {
    replaceNgContainerWithAppTranslate,
    processFile,
    findHtmlFiles
};
