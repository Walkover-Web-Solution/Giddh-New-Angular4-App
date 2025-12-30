#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Comprehensive script to fix all lodash usage patterns that bypass the fallback system
 * This ensures all lodash functions use the lodash-optimized.ts fallback for Electron compatibility
 */

const srcDir = './apps/web-giddh/src';
let filesProcessed = 0;
let filesModified = 0;
let totalReplacements = 0;

// Common lodash functions that need to be imported from lodash-optimized
const lodashFunctions = [
    'cloneDeep', 'clone', 'map', 'filter', 'find', 'findIndex', 'forEach', 'each',
    'orderBy', 'sortBy', 'groupBy', 'uniq', 'uniqBy', 'isEmpty', 'isNull', 'isUndefined',
    'isArray', 'isString', 'isNumber', 'isObject', 'isEqual', 'get', 'set', 'has',
    'keys', 'values', 'omit', 'pick', 'flatten', 'flattenDeep', 'union', 'unionBy',
    'difference', 'differenceBy', 'intersection', 'without', 'concat', 'includes',
    'indexOf', 'last', 'first', 'slice', 'range', 'sumBy', 'maxBy', 'minBy',
    'startsWith', 'endsWith', 'debounce', 'throttle', 'remove', 'reject', 'some',
    'every', 'forIn', 'forOwn', 'merge', 'assign', 'extend'
];

function processFile(filePath) {
    if (!filePath.endsWith('.ts') || filePath.includes('.spec.ts') || filePath.includes('.d.ts')) {
        return;
    }

    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        filesProcessed++;

        // Check if file has any _.functionName usage
        const lodashUsagePattern = new RegExp(`_\\.(${lodashFunctions.join('|')})\\b`, 'g');
        const matches = content.match(lodashUsagePattern);

        if (!matches) {
            return; // No lodash usage found
        }

        console.log(`\n🔧 Processing: ${filePath}`);
        console.log(`   Found ${matches.length} lodash usage patterns: ${[...new Set(matches)].join(', ')}`);

        // Extract unique function names used
        const usedFunctions = [...new Set(matches.map(match => match.replace('_.', '')))];

        // Check if file already imports from lodash-optimized
        const hasLodashOptimizedImport = content.includes("from '../lodash-optimized'") ||
                                       content.includes("from '../../lodash-optimized'") ||
                                       content.includes("from '../../../lodash-optimized'") ||
                                       content.includes("from '../../../../lodash-optimized'") ||
                                       content.includes("from '../../../../../lodash-optimized'");

        let importPath = '../lodash-optimized';

        // Determine correct import path based on file location
        const relativePath = path.relative(srcDir, filePath);
        const depth = relativePath.split('/').length - 1;
        if (depth > 1) {
            importPath = '../'.repeat(depth - 1) + 'lodash-optimized';
        }

        // Add import statement if not present
        if (!hasLodashOptimizedImport) {
            const importStatement = `import { ${usedFunctions.join(', ')} } from '${importPath}';\n`;

            // Find the best place to insert the import
            const lines = content.split('\n');
            let insertIndex = 0;

            // Find last import statement
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].trim().startsWith('import ') && !lines[i].includes('//')) {
                    insertIndex = i + 1;
                }
            }

            lines.splice(insertIndex, 0, importStatement);
            content = lines.join('\n');
            console.log(`   ✅ Added import: ${importStatement.trim()}`);
        } else {
            // Update existing import to include missing functions
            const importRegex = /import\s*\{\s*([^}]+)\s*\}\s*from\s*['"][^'"]*lodash-optimized['"];?/;
            const importMatch = content.match(importRegex);

            if (importMatch) {
                const existingImports = importMatch[1].split(',').map(s => s.trim()).filter(s => s);
                const newImports = [...new Set([...existingImports, ...usedFunctions])].sort();
                const newImportStatement = `import { ${newImports.join(', ')} } from '${importPath}';`;
                content = content.replace(importRegex, newImportStatement);
                console.log(`   ✅ Updated import: ${newImportStatement}`);
            }
        }

        // Replace all _.functionName with functionName
        let replacements = 0;
        usedFunctions.forEach(func => {
            const pattern = new RegExp(`_\\.${func}\\b`, 'g');
            const beforeCount = (content.match(pattern) || []).length;
            content = content.replace(pattern, func);
            const afterCount = (content.match(pattern) || []).length;
            replacements += (beforeCount - afterCount);
        });

        if (replacements > 0) {
            console.log(`   ✅ Replaced ${replacements} lodash function calls`);
            totalReplacements += replacements;
        }

        // Remove any declare var _: any; statements
        const declarePattern = /declare\s+var\s+_\s*:\s*any\s*;?\s*\n?/g;
        if (content.match(declarePattern)) {
            content = content.replace(declarePattern, '');
            console.log(`   ✅ Removed 'declare var _: any;' statement`);
        }

        // Only write if content changed
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            filesModified++;
            console.log(`   ✅ File updated successfully`);
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

console.log('🚀 Starting comprehensive lodash usage fix...');
console.log(`📁 Processing directory: ${srcDir}`);
console.log(`🔍 Looking for patterns: ${lodashFunctions.map(f => `_.${f}`).join(', ')}`);

processDirectory(srcDir);

console.log('\n📊 SUMMARY:');
console.log(`   Files processed: ${filesProcessed}`);
console.log(`   Files modified: ${filesModified}`);
console.log(`   Total replacements: ${totalReplacements}`);

if (filesModified > 0) {
    console.log('\n✅ SUCCESS: All lodash usage patterns have been fixed!');
    console.log('   All _.functionName calls now use imports from lodash-optimized.ts');
    console.log('   This ensures the Electron fallback system works properly.');
} else {
    console.log('\n✅ No lodash usage issues found - all files already use proper imports!');
}

console.log('\n🔧 Next steps:');
console.log('   1. Test the application to ensure no functionality is broken');
console.log('   2. Build the Electron app to verify cloneDeep errors are resolved');
console.log('   3. The lodash-optimized.ts fallback system should handle all lodash functions in Electron');
