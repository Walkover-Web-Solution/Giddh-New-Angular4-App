#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to replace ng-container tags with appTranslate directive with div tags
 * This handles multi-line ng-container opening and closing tags
 */

function findHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            // Skip node_modules and other irrelevant directories
            if (!['node_modules', '.git', 'dist', 'build', '.angular'].includes(file)) {
                findHtmlFiles(filePath, fileList);
            }
        } else if (file.endsWith('.component.html')) {
            fileList.push(filePath);
        }
    });
    
    return fileList;
}

function replaceNgContainerWithAppTranslate(content) {
    let modifiedContent = content;
    let changesMade = false;
    
    // Pattern to match ng-container with appTranslate directive (multi-line support)
    // This matches opening ng-container tag with appTranslate and its corresponding closing tag
    const ngContainerPattern = /<ng-container\s+([^>]*appTranslate[^>]*)>([\s\S]*?)<\/ng-container>/gi;
    
    modifiedContent = modifiedContent.replace(ngContainerPattern, (match, attributes, innerContent) => {
        changesMade = true;
        console.log('  - Found ng-container with appTranslate, replacing with div');
        
        // Clean up the attributes - remove extra whitespace and newlines
        const cleanAttributes = attributes
            .replace(/\s+/g, ' ')
            .trim();
        
        return `<div ${cleanAttributes}>${innerContent}</div>`;
    });
    
    return { content: modifiedContent, changed: changesMade };
}

function processFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const result = replaceNgContainerWithAppTranslate(content);
        
        if (result.changed) {
            fs.writeFileSync(filePath, result.content, 'utf8');
            console.log(`✓ Updated: ${filePath}`);
            return true;
        }
        return false;
    } catch (error) {
        console.error(`✗ Error processing ${filePath}:`, error.message);
        return false;
    }
}

function main() {
    const srcDir = path.join(process.cwd(), 'apps', 'web-giddh', 'src');
    
    if (!fs.existsSync(srcDir)) {
        console.error('Source directory not found:', srcDir);
        process.exit(1);
    }
    
    console.log('🔍 Finding HTML component files...');
    const htmlFiles = findHtmlFiles(srcDir);
    
    console.log(`📁 Found ${htmlFiles.length} HTML component files`);
    console.log('🔄 Processing files...\n');
    
    let processedCount = 0;
    let modifiedCount = 0;
    
    htmlFiles.forEach(filePath => {
        processedCount++;
        console.log(`[${processedCount}/${htmlFiles.length}] Processing: ${path.relative(process.cwd(), filePath)}`);
        
        if (processFile(filePath)) {
            modifiedCount++;
        }
    });
    
    console.log('\n📊 Summary:');
    console.log(`   Total files processed: ${processedCount}`);
    console.log(`   Files modified: ${modifiedCount}`);
    console.log(`   Files unchanged: ${processedCount - modifiedCount}`);
    
    if (modifiedCount > 0) {
        console.log('\n✅ ng-container with appTranslate replacement completed successfully!');
    } else {
        console.log('\n ℹ️  No ng-container tags with appTranslate found to replace.');
    }
}

if (require.main === module) {
    main();
}

module.exports = { replaceNgContainerWithAppTranslate, processFile };
