#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Adding cloneDeep imports to all reducer files...\n');

// Find all reducer files that use cloneDeep
function findReducerFiles(dir) {
    const reducerFiles = [];

    function scanDirectory(currentDir) {
        try {
            const items = fs.readdirSync(currentDir);

            for (const item of items) {
                const fullPath = path.join(currentDir, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory() && !item.includes('node_modules')) {
                    scanDirectory(fullPath);
                } else if (item.endsWith('.reducer.ts')) {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    if (content.includes('cloneDeep(') && !content.includes('import { cloneDeep }') && !content.includes('import {cloneDeep')) {
                        reducerFiles.push(fullPath);
                    }
                }
            }
        } catch (error) {
            // Skip directories we can't read
        }
    }

    scanDirectory(dir);
    return reducerFiles;
}

function addCloneDeepImport(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');

        // Find the last import statement
        let lastImportIndex = -1;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim().startsWith('import ') && lines[i].includes('from')) {
                lastImportIndex = i;
            }
        }

        if (lastImportIndex !== -1) {
            // Add cloneDeep import after the last import
            const importStatement = "import { cloneDeep } from 'lodash-es';";
            lines.splice(lastImportIndex + 1, 0, importStatement);

            const newContent = lines.join('\n');
            fs.writeFileSync(filePath, newContent);
            console.log(`✅ Added cloneDeep import to: ${filePath}`);
            return true;
        }
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        return false;
    }
    return false;
}

// Main execution
const storeDir = './apps/web-giddh/src/app/store';
const reducerFiles = findReducerFiles(storeDir);

console.log(`Found ${reducerFiles.length} reducer files that need cloneDeep imports:\n`);

let fixedCount = 0;
reducerFiles.forEach(filePath => {
    if (addCloneDeepImport(filePath)) {
        fixedCount++;
    }
});

console.log(`\n📊 Results:`);
console.log(`✅ Files fixed: ${fixedCount}`);
console.log(`📁 Total files processed: ${reducerFiles.length}`);

if (fixedCount > 0) {
    console.log('\n🎉 All reducer imports fixed! Run "npm run build" to verify.');
} else {
    console.log('\n⚠️  No files needed fixing.');
}
