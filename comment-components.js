#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to comment out problematic Angular components for Angular 21 compatibility
 * Components: input-field, select-field, reactive-dropdown-field, text-field, select-multiple-fields, cdk-scroll
 */

const COMPONENTS_TO_COMMENT = [
    'input-field',
    'select-field',
    'reactive-dropdown-field',
    'text-field',
    'select-multiple-fields',
    'cdk-scroll'
];

const BACKUP_SUFFIX = '.backup-template';

function createBackup(filePath) {
    const backupPath = filePath + BACKUP_SUFFIX;
    if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(filePath, backupPath);
        console.log(`✅ Created backup: ${backupPath}`);
    } else {
        console.log(`ℹ️  Backup already exists: ${backupPath}`);
    }
}

function commentOutComponent(content, componentName) {
    // Pattern to match opening and closing tags with all content between
    const openTagPattern = new RegExp(`(<${componentName}[^>]*>)`, 'gi');
    const closeTagPattern = new RegExp(`(<\/${componentName}>)`, 'gi');

    // Self-closing tag pattern
    const selfClosingPattern = new RegExp(`(<${componentName}[^>]*\/>)`, 'gi');

    let modifiedContent = content;
    let changesMade = false;

    // Handle self-closing tags first
    modifiedContent = modifiedContent.replace(selfClosingPattern, (match) => {
        changesMade = true;
        return `<!-- COMMENTED OUT - COMPILATION ERROR: ${match} -->`;
    });

    // Handle opening tags
    modifiedContent = modifiedContent.replace(openTagPattern, (match) => {
        changesMade = true;
        return `<!-- COMMENTED OUT - COMPILATION ERROR: ${match} -->`;
    });

    // Handle closing tags
    modifiedContent = modifiedContent.replace(closeTagPattern, (match) => {
        changesMade = true;
        return `<!-- COMMENTED OUT - COMPILATION ERROR: ${match} -->`;
    });

    return { content: modifiedContent, changed: changesMade };
}

function processFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        let modifiedContent = content;
        let totalChanges = 0;

        // Create backup before making changes
        createBackup(filePath);

        // Process each component
        COMPONENTS_TO_COMMENT.forEach(component => {
            const result = commentOutComponent(modifiedContent, component);
            modifiedContent = result.content;
            if (result.changed) {
                totalChanges++;
                console.log(`  📝 Commented out <${component}> components`);
            }
        });

        if (totalChanges > 0) {
            fs.writeFileSync(filePath, modifiedContent, 'utf8');
            console.log(`✅ Updated: ${filePath} (${totalChanges} component types commented)`);
        } else {
            console.log(`ℹ️  No changes needed: ${filePath}`);
        }

    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
    }
}

function findHtmlFiles(dir) {
    const files = [];

    function scanDirectory(currentDir) {
        try {
            const items = fs.readdirSync(currentDir);

            items.forEach(item => {
                const fullPath = path.join(currentDir, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
                    scanDirectory(fullPath);
                } else if (stat.isFile() && item.endsWith('.html') && !item.includes('.backup')) {
                    files.push(fullPath);
                }
            });
        } catch (error) {
            console.warn(`⚠️  Cannot read directory ${currentDir}:`, error.message);
        }
    }

    scanDirectory(dir);
    return files;
}

function main() {
    const args = process.argv.slice(2);
    const targetDir = args[0] || './apps/web-giddh/src';

    console.log('🔧 Angular Component Commenting Script');
    console.log('=====================================');
    console.log(`📁 Target directory: ${targetDir}`);
    console.log(`🎯 Components to comment: ${COMPONENTS_TO_COMMENT.join(', ')}`);
    console.log('');

    if (!fs.existsSync(targetDir)) {
        console.error(`❌ Directory not found: ${targetDir}`);
        process.exit(1);
    }

    const htmlFiles = findHtmlFiles(targetDir);
    console.log(`📄 Found ${htmlFiles.length} HTML files to process`);
    console.log('');

    htmlFiles.forEach(file => {
        console.log(`🔍 Processing: ${file}`);
        processFile(file);
        console.log('');
    });

    console.log('✨ Component commenting completed!');
    console.log('💡 Use restore-components.js to restore original components');
}

if (require.main === module) {
    main();
}

module.exports = {
    commentOutComponent,
    processFile,
    findHtmlFiles,
    COMPONENTS_TO_COMMENT
};
