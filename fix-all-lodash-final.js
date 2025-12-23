#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 FINAL Angular 21 Lodash Fix - Complete Solution...\n');

let stats = {
    filesProcessed: 0,
    importsFixed: 0,
    functionsFixed: 0,
    errors: []
};

// All lodash functions that might be used in the project
const LODASH_FUNCTIONS = [
    'cloneDeep', 'each', 'reject', 'orderBy', 'map', 'filter', 'find', 'forEach',
    'isArray', 'isEmpty', 'isNull', 'isUndefined', 'sortBy', 'uniq', 'flatten',
    'merge', 'omit', 'pick', 'keys', 'values', 'has', 'get', 'set', 'debounce',
    'throttle', 'groupBy', 'keyBy', 'maxBy', 'minBy', 'sumBy', 'countBy'
];

/**
 * Analyze file and determine which lodash functions are used
 */
function analyzeLodashUsage(content) {
    const usedFunctions = new Set();

    LODASH_FUNCTIONS.forEach(func => {
        // Check for direct usage like cloneDeep(
        if (content.includes(`${func}(`)) {
            usedFunctions.add(func);
        }
        // Check for _.function usage
        if (content.includes(`_.${func}(`)) {
            usedFunctions.add(func);
        }
    });

    return Array.from(usedFunctions);
}

/**
 * Get the correct import path based on file location
 */
function getImportPath(filePath) {
    const srcPath = './apps/web-giddh/src';
    const lodashPath = path.join(srcPath, 'app/lodash-optimized');
    const relativePath = path.relative(path.dirname(filePath), lodashPath);

    // Normalize path for cross-platform compatibility
    let importPath = relativePath.replace(/\\/g, '/');
    if (!importPath.startsWith('.')) {
        importPath = './' + importPath;
    }

    return importPath;
}

/**
 * Fix lodash imports in a single file
 */
function fixFileImports(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const usedFunctions = analyzeLodashUsage(content);

        if (usedFunctions.length === 0) {
            return false; // No lodash usage
        }

        stats.filesProcessed++;
        let modified = false;
        const lines = content.split('\n');
        const newLines = [];
        let hasLodashImport = false;
        let existingImportIndex = -1;
        let existingFunctions = new Set();

        // Process each line to find and fix imports
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Remove incorrect lodash-es imports
            if (line.includes("from 'lodash-es'") || line.includes('from "lodash-es"')) {
                modified = true;
                continue;
            }

            // Find existing lodash-optimized import
            if (line.includes('lodash-optimized') && line.includes('import')) {
                hasLodashImport = true;
                existingImportIndex = newLines.length;

                // Extract existing functions from import
                const importMatch = line.match(/import\s*\{\s*([^}]+)\s*\}/);
                if (importMatch) {
                    const functions = importMatch[1].split(',').map(f => f.trim());
                    functions.forEach(f => existingFunctions.add(f));
                }
            }

            // Replace _.function calls with direct function calls
            let modifiedLine = line;
            usedFunctions.forEach(func => {
                const regex = new RegExp(`_\\.${func}\\(`, 'g');
                if (regex.test(modifiedLine)) {
                    modifiedLine = modifiedLine.replace(regex, `${func}(`);
                    modified = true;
                    stats.functionsFixed++;
                }
            });

            newLines.push(modifiedLine);
        }

        // Determine which functions need to be imported
        const neededFunctions = new Set(usedFunctions);
        existingFunctions.forEach(f => neededFunctions.add(f));
        const allFunctions = Array.from(neededFunctions).sort();

        if (hasLodashImport && existingImportIndex !== -1) {
            // Update existing import
            const importPath = getImportPath(filePath);
            const newImportLine = `import { ${allFunctions.join(', ')} } from '${importPath}';`;
            newLines[existingImportIndex] = newImportLine;
            modified = true;
        } else if (!hasLodashImport && allFunctions.length > 0) {
            // Add new import
            let insertIndex = -1;

            // Find the best place to insert import
            for (let i = 0; i < newLines.length; i++) {
                if (newLines[i].trim().startsWith('import ') && newLines[i].includes('from')) {
                    insertIndex = i;
                }
            }

            if (insertIndex !== -1) {
                const importPath = getImportPath(filePath);
                const newImportLine = `import { ${allFunctions.join(', ')} } from '${importPath}';`;
                newLines.splice(insertIndex + 1, 0, newImportLine);
                modified = true;
            }
        }

        // Write back if modified
        if (modified) {
            const newContent = newLines.join('\n');
            fs.writeFileSync(filePath, newContent);
            console.log(`✅ Fixed: ${filePath} (${usedFunctions.length} functions)`);
            stats.importsFixed++;
            return true;
        }

        return false;

    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        stats.errors.push(`${filePath}: ${error.message}`);
        return false;
    }
}

/**
 * Process all TypeScript files recursively
 */
function processDirectory(dirPath) {
    try {
        const items = fs.readdirSync(dirPath);

        for (const item of items) {
            const fullPath = path.join(dirPath, item);
            const stat = fs.statSync(fullPath);

            // Skip excluded directories
            if (stat.isDirectory()) {
                if (!item.includes('node_modules') &&
                    !item.includes('.git') &&
                    !item.includes('dist') &&
                    !item.includes('build')) {
                    processDirectory(fullPath);
                }
            } else if (item.endsWith('.ts') && !item.endsWith('.d.ts')) {
                fixFileImports(fullPath);
            }
        }
    } catch (error) {
        // Skip directories we can't read
    }
}

/**
 * Main execution
 */
function main() {
    console.log('🔍 Scanning for lodash usage across the entire project...\n');

    const srcPath = './apps/web-giddh/src';
    processDirectory(srcPath);

    console.log('\n📊 Final Results:');
    console.log('==================');
    console.log(`✅ Files processed: ${stats.filesProcessed}`);
    console.log(`✅ Imports fixed: ${stats.importsFixed}`);
    console.log(`✅ Function calls fixed: ${stats.functionsFixed}`);

    if (stats.errors.length > 0) {
        console.log(`\n❌ Errors encountered: ${stats.errors.length}`);
        stats.errors.slice(0, 10).forEach((error, index) => {
            console.log(`   ${index + 1}. ${error}`);
        });
        if (stats.errors.length > 10) {
            console.log(`   ... and ${stats.errors.length - 10} more errors`);
        }
    } else {
        console.log('\n🎉 All lodash import issues resolved successfully!');
    }

    console.log('\n🚀 Next Steps:');
    console.log('1. Run "npm run build" to verify compilation');
    console.log('2. Start development server to test Angular 21 compatibility');
    console.log('3. Check for factory and onDestroy errors in browser console');

    console.log('\n✨ Angular 21 lodash compatibility fix complete!');
}

main();
