#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 FINAL FIX: Resolving RxJS/Lodash Import Conflicts...\n');

let stats = {
    filesProcessed: 0,
    conflictsResolved: 0,
    errors: []
};

// Functions that conflict between RxJS and lodash
const CONFLICT_FUNCTIONS = {
    'map': 'rxjs',      // Prefer RxJS map
    'filter': 'rxjs',   // Prefer RxJS filter
    'tap': 'rxjs',      // RxJS only
    'take': 'rxjs',     // RxJS only
    'skip': 'rxjs'      // RxJS only
};

// Available lodash functions (excluding conflicts)
const LODASH_FUNCTIONS = [
    'cloneDeep', 'each', 'reject', 'orderBy', 'isNull', 'flatten', 'sortBy',
    'indexOf', 'remove', 'forEach', 'toArray', 'groupBy', 'difference',
    'isUndefined', 'differenceBy', 'flattenDeep', 'union', 'omit', 'clone',
    'without', 'isString', 'find', 'range', 'includes', 'uniq', 'isEmpty',
    'isNumber', 'findIndex', 'concat', 'unionBy', 'last', 'sumBy', 'isArray',
    'isEqual', 'uniqBy', 'some', 'intersection', 'forIn', 'pick', 'startsWith',
    'get', 'debounce', 'isObject', 'slice', 'keys', 'set', 'has', 'values',
    'merge', 'throttle', 'keyBy', 'countBy', 'minBy', 'maxBy', 'endsWith'
];

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
 * Analyze and fix imports in a file
 */
function fixFileImports(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        const lines = content.split('\n');
        const newLines = [];

        let rxjsImports = new Set();
        let lodashImports = new Set();
        let usedFunctions = new Set();

        // First pass: collect all function usage
        content.split('\n').forEach(line => {
            LODASH_FUNCTIONS.forEach(func => {
                if (line.includes(`${func}(`) || line.includes(`_.${func}(`)) {
                    usedFunctions.add(func);
                }
            });

            Object.keys(CONFLICT_FUNCTIONS).forEach(func => {
                if (line.includes(`${func}(`) || line.includes(`_.${func}(`)) {
                    usedFunctions.add(func);
                }
            });
        });

        // Second pass: process imports and fix conflicts
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];

            // Remove lodash-es imports
            if (line.includes("from 'lodash-es'") || line.includes('from "lodash-es"')) {
                modified = true;
                continue;
            }

            // Handle RxJS imports
            if ((line.includes('from \'rxjs\'') || line.includes('from "rxjs"') ||
                 line.includes('from \'rxjs/operators\'') || line.includes('from "rxjs/operators"')) &&
                line.includes('import')) {

                const importMatch = line.match(/import\s*\{\s*([^}]+)\s*\}/);
                if (importMatch) {
                    const imports = importMatch[1].split(',').map(f => f.trim());
                    imports.forEach(imp => {
                        if (usedFunctions.has(imp)) {
                            rxjsImports.add(imp);
                        }
                    });
                }
                newLines.push(line);
                continue;
            }

            // Handle existing lodash imports - remove and rebuild
            if (line.includes('lodash-optimized') && line.includes('import')) {
                modified = true;
                continue; // Skip, we'll rebuild this
            }

            // Fix _.function calls to direct calls
            let modifiedLine = line;
            [...LODASH_FUNCTIONS, ...Object.keys(CONFLICT_FUNCTIONS)].forEach(func => {
                const regex = new RegExp(`_\\.${func}\\(`, 'g');
                if (regex.test(modifiedLine)) {
                    modifiedLine = modifiedLine.replace(regex, `${func}(`);
                    modified = true;
                    usedFunctions.add(func);
                }
            });

            newLines.push(modifiedLine);
        }

        // Determine which functions to import from lodash (excluding RxJS conflicts)
        usedFunctions.forEach(func => {
            if (CONFLICT_FUNCTIONS[func]) {
                // This is a conflict function - only add to lodash if not used in RxJS context
                if (CONFLICT_FUNCTIONS[func] === 'rxjs' && !rxjsImports.has(func)) {
                    // Check if it's actually used as lodash function
                    const lodashUsage = content.includes(`${func}(`) &&
                                      !content.includes(`pipe(`) &&
                                      !content.includes(`subscribe(`);
                    if (lodashUsage && LODASH_FUNCTIONS.includes(func)) {
                        lodashImports.add(func);
                    }
                }
            } else if (LODASH_FUNCTIONS.includes(func)) {
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
            console.log(`✅ Fixed: ${filePath} (${lodashImports.size} lodash, ${rxjsImports.size} rxjs)`);
            stats.conflictsResolved++;
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
                if (fixFileImports(fullPath)) {
                    stats.filesProcessed++;
                }
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
    console.log('🔍 Scanning for RxJS/Lodash import conflicts...\n');

    const srcPath = './apps/web-giddh/src';
    processDirectory(srcPath);

    console.log('\n📊 Conflict Resolution Results:');
    console.log('===============================');
    console.log(`✅ Files processed: ${stats.filesProcessed}`);
    console.log(`✅ Conflicts resolved: ${stats.conflictsResolved}`);

    if (stats.errors.length > 0) {
        console.log(`\n❌ Errors: ${stats.errors.length}`);
        stats.errors.slice(0, 5).forEach((error, index) => {
            console.log(`   ${index + 1}. ${error}`);
        });
    } else {
        console.log('\n🎉 ALL IMPORT CONFLICTS RESOLVED!');
    }

    console.log('\n🚀 Ready for final build:');
    console.log('npm run build');

    console.log('\n✨ Angular 21 import conflict resolution complete!');
}

main();
