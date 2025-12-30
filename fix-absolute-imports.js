#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to fix absolute lodash-optimized import paths to relative paths
 * This ensures proper import resolution in Electron builds
 */

const srcDir = './apps/web-giddh/src';
let filesProcessed = 0;
let filesModified = 0;

function calculateRelativePath(filePath, targetPath) {
    const fileDir = path.dirname(filePath);
    const relativePath = path.relative(fileDir, targetPath);
    return relativePath.startsWith('.') ? relativePath : './' + relativePath;
}

function processFile(filePath) {
    if (!filePath.endsWith('.ts') || filePath.includes('.spec.ts') || filePath.includes('.d.ts')) {
        return;
    }

    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        filesProcessed++;

        // Check for absolute lodash-optimized imports
        const absoluteImportPattern = /from ['"]apps\/web-giddh\/src\/app\/lodash-optimized['"]/g;
        const matches = content.match(absoluteImportPattern);

        if (!matches) {
            return; // No absolute imports found
        }

        console.log(`\n🔧 Processing: ${filePath}`);
        console.log(`   Found ${matches.length} absolute lodash-optimized imports`);

        // Calculate the correct relative path
        const targetPath = path.join(srcDir, 'app', 'lodash-optimized.ts');
        const relativePath = calculateRelativePath(filePath, targetPath);
        const relativeImportPath = relativePath.replace('.ts', '');

        // Replace absolute imports with relative imports
        const newContent = content.replace(
            /from ['"]apps\/web-giddh\/src\/app\/lodash-optimized['"]/g,
            `from '${relativeImportPath}'`
        );

        if (newContent !== originalContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            filesModified++;
            console.log(`   ✅ Updated import path to: '${relativeImportPath}'`);
        }

    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
    }
}

function processDirectory(dir) {
    try {
        const items = fs.readdirSync(dir);

        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
                processDirectory(fullPath);
            } else if (stat.isFile()) {
                processFile(fullPath);
            }
        }
    } catch (error) {
        console.error(`❌ Error processing directory ${dir}:`, error.message);
    }
}

console.log('🚀 Starting absolute import path fix...');
console.log(`📁 Processing directory: ${srcDir}`);
console.log(`🔍 Looking for: from 'apps/web-giddh/src/app/lodash-optimized'`);

processDirectory(srcDir);

console.log('\n📊 SUMMARY:');
console.log(`   Files processed: ${filesProcessed}`);
console.log(`   Files modified: ${filesModified}`);

if (filesModified > 0) {
    console.log('\n✅ SUCCESS: All absolute lodash-optimized import paths have been fixed!');
    console.log('   All imports now use relative paths for proper Electron build resolution.');
} else {
    console.log('\n✅ No absolute import issues found - all files already use relative paths!');
}

console.log('\n🔧 Next steps:');
console.log('   1. Test the application to ensure imports work correctly');
console.log('   2. Build the Electron app to verify cloneDeep errors are resolved');
console.log('   3. Relative paths should resolve properly in all build environments');
