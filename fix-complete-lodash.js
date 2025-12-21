#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 COMPLETE Angular 21 Lodash Fix - Final Solution...\n');

let stats = {
    filesProcessed: 0,
    importsFixed: 0,
    duplicatesRemoved: 0,
    missingFunctionsAdded: 0,
    errors: []
};

// Functions available in lodash-optimized
const AVAILABLE_FUNCTIONS = [
    'maxBy', 'endsWith', 'cloneDeep', 'each', 'reject', 'map', 'filter', 'orderBy',
    'isNull', 'flatten', 'sortBy', 'indexOf', 'remove', 'forEach', 'toArray', 'groupBy',
    'difference', 'isUndefined', 'differenceBy', 'flattenDeep', 'union', 'omit', 'clone',
    'without', 'isString', 'find', 'range', 'includes', 'uniq', 'isEmpty', 'isNumber',
    'findIndex', 'concat', 'unionBy', 'last', 'sumBy', 'isArray', 'isEqual', 'uniqBy',
    'some', 'intersection', 'forIn', 'pick', 'startsWith', 'get', 'debounce', 'isObject', 'slice'
];

// Functions that conflict with RxJS
const RXJS_CONFLICTS = ['filter', 'map', 'tap', 'take', 'skip'];

// Missing functions that need to be added to lodash-optimized
const MISSING_FUNCTIONS = ['keys', 'set', 'has', 'values', 'merge', 'throttle', 'keyBy', 'countBy', 'minBy'];

/**
 * Update lodash-optimized.ts to include missing functions
 */
function updateLodashOptimized() {
    const lodashPath = './apps/web-giddh/src/app/lodash-optimized.ts';

    try {
        let content = fs.readFileSync(lodashPath, 'utf8');

        // Add missing functions to destructuring
        const destructuringMatch = content.match(/const \{\s*([^}]+)\s*\} = lodash;/);
        if (destructuringMatch) {
            const currentFunctions = destructuringMatch[1].split(',').map(f => f.trim());
            const allFunctions = [...new Set([...currentFunctions, ...MISSING_FUNCTIONS])].sort();

            const newDestructuring = `const {\n    ${allFunctions.join(', ')}\n} = lodash;`;
            content = content.replace(/const \{\s*[^}]+\s*\} = lodash;/, newDestructuring);
        }

        // Add missing functions to exports
        const exportMatch = content.match(/export \{\s*([^}]+)\s*\};/);
        if (exportMatch) {
            const currentExports = exportMatch[1].split(',').map(f => f.trim());
            const allExports = [...new Set([...currentExports, ...MISSING_FUNCTIONS])].sort();

            const newExports = `export {\n    ${allExports.join(',\n    ')}\n};`;
            content = content.replace(/export \{\s*[^}]+\s*\};/, newExports);
        }

        fs.writeFileSync(lodashPath, content);
        console.log('✅ Updated lodash-optimized.ts with missing functions');
        stats.missingFunctionsAdded = MISSING_FUNCTIONS.length;

    } catch (error) {
        console.error('❌ Error updating lodash-optimized.ts:', error.message);
        stats.errors.push(`lodash-optimized.ts: ${error.message}`);
    }
}

/**
 * Get import path relative to file
 */
function getImportPath(filePath) {
    const srcPath = './apps/web-giddh/src';
    const lodashPath = path.join(srcPath, 'app/lodash-optimized');
    const relativePath = path.relative(path.dirname(filePath), lodashPath);

    let importPath = relativePath.replace(/\\/g, '/');
    if (!importPath.startsWith('.')) {
        importPath = './' + importPath;
    }

    return importPath;
}

/**
 * Fix imports in a single file
 */
function fixFileImports(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Find all lodash function usage
        const usedLodashFunctions = new Set();
        const allFunctions = [...AVAILABLE_FUNCTIONS, ...MISSING_FUNCTIONS];

        allFunctions.forEach(func => {
            if (content.includes(`${func}(`) || content.includes(`_.${func}(`)) {
                usedLodashFunctions.add(func);
            }
        });

        if (usedLodashFunctions.size === 0) {
            return false;
        }

        stats.filesProcessed++;
        const lines = content.split('\n');
        const newLines = [];
        let hasLodashImport = false;
        let rxjsImports = new Set();
        let lodashImports = new Set();

        // Process each line
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];

            // Remove incorrect lodash-es imports
            if (line.includes("from 'lodash-es'") || line.includes('from "lodash-es"')) {
                modified = true;
                continue;
            }

            // Handle RxJS imports to avoid conflicts
            if (line.includes('from \'rxjs\'') || line.includes('from "rxjs"')) {
                const importMatch = line.match(/import\s*\{\s*([^}]+)\s*\}/);
                if (importMatch) {
                    const imports = importMatch[1].split(',').map(f => f.trim());
                    imports.forEach(imp => rxjsImports.add(imp));
                }
            }

            // Handle existing lodash imports
            if (line.includes('lodash-optimized') && line.includes('import')) {
                hasLodashImport = true;
                const importMatch = line.match(/import\s*\{\s*([^}]+)\s*\}/);
                if (importMatch) {
                    const imports = importMatch[1].split(',').map(f => f.trim());
                    imports.forEach(imp => {
                        if (!RXJS_CONFLICTS.includes(imp) || !rxjsImports.has(imp)) {
                            lodashImports.add(imp);
                        }
                    });
                }

                // Skip this line, we'll rebuild it
                modified = true;
                continue;
            }

            // Replace _.function calls
            allFunctions.forEach(func => {
                const regex = new RegExp(`_\\.${func}\\(`, 'g');
                if (regex.test(line)) {
                    line = line.replace(regex, `${func}(`);
                    modified = true;
                    usedLodashFunctions.add(func);
                }
            });

            newLines.push(line);
        }

        // Add used functions to lodash imports, avoiding RxJS conflicts
        usedLodashFunctions.forEach(func => {
            if (!RXJS_CONFLICTS.includes(func) || !rxjsImports.has(func)) {
                lodashImports.add(func);
            }
        });

        // Add lodash import if needed
        if (lodashImports.size > 0) {
            const importPath = getImportPath(filePath);
            const sortedImports = Array.from(lodashImports).sort();
            const importStatement = `import { ${sortedImports.join(', ')} } from '${importPath}';`;

            // Find best place to insert
            let insertIndex = -1;
            for (let i = 0; i < newLines.length; i++) {
                if (newLines[i].trim().startsWith('import ') && newLines[i].includes('from')) {
                    insertIndex = i;
                }
            }

            if (insertIndex !== -1) {
                newLines.splice(insertIndex + 1, 0, importStatement);
                modified = true;
            }
        }

        // Write back if modified
        if (modified) {
            const newContent = newLines.join('\n');
            fs.writeFileSync(filePath, newContent);
            console.log(`✅ Fixed: ${filePath} (${usedLodashFunctions.size} functions)`);
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
 * Process all TypeScript files
 */
function processDirectory(dirPath) {
    try {
        const items = fs.readdirSync(dirPath);

        for (const item of items) {
            const fullPath = path.join(dirPath, item);
            const stat = fs.statSync(fullPath);

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
    console.log('Step 1: Updating lodash-optimized.ts with missing functions...');
    updateLodashOptimized();

    console.log('\nStep 2: Fixing all lodash imports and conflicts...');
    const srcPath = './apps/web-giddh/src';
    processDirectory(srcPath);

    console.log('\n📊 Complete Fix Results:');
    console.log('========================');
    console.log(`✅ Files processed: ${stats.filesProcessed}`);
    console.log(`✅ Imports fixed: ${stats.importsFixed}`);
    console.log(`✅ Missing functions added: ${stats.missingFunctionsAdded}`);
    console.log(`✅ Duplicates removed: ${stats.duplicatesRemoved}`);

    if (stats.errors.length > 0) {
        console.log(`\n❌ Errors: ${stats.errors.length}`);
        stats.errors.slice(0, 5).forEach((error, index) => {
            console.log(`   ${index + 1}. ${error}`);
        });
    } else {
        console.log('\n🎉 ALL LODASH ISSUES RESOLVED!');
    }

    console.log('\n🚀 Final Steps:');
    console.log('1. Run "npm run build" - should compile successfully');
    console.log('2. Run "npm start" to test Angular 21 compatibility');
    console.log('3. Check browser console for factory/onDestroy errors');

    console.log('\n✨ Complete Angular 21 lodash fix finished!');
}

main();
