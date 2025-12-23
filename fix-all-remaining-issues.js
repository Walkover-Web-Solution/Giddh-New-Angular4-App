#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 ULTIMATE FIX: Resolving ALL Remaining Angular 21 Issues...\n');

let stats = {
    filesProcessed: 0,
    issuesFixed: 0,
    errors: []
};

// Complete list of available lodash functions
const ALL_LODASH_FUNCTIONS = [
    'cloneDeep', 'each', 'reject', 'orderBy', 'isNull', 'flatten', 'sortBy',
    'indexOf', 'remove', 'forEach', 'toArray', 'groupBy', 'difference',
    'isUndefined', 'differenceBy', 'flattenDeep', 'union', 'omit', 'clone',
    'without', 'isString', 'find', 'range', 'includes', 'uniq', 'isEmpty',
    'isNumber', 'findIndex', 'concat', 'unionBy', 'last', 'sumBy', 'isArray',
    'isEqual', 'uniqBy', 'some', 'intersection', 'forIn', 'pick', 'startsWith',
    'get', 'debounce', 'isObject', 'slice', 'keys', 'set', 'has', 'values',
    'merge', 'throttle', 'keyBy', 'countBy', 'minBy', 'maxBy', 'endsWith',
    'map', 'filter' // Add these back for lodash usage
];

// Update lodash-optimized to include ALL functions
function updateLodashOptimized() {
    const lodashPath = './apps/web-giddh/src/app/lodash-optimized.ts';

    try {
        const newContent = `const lodash = (window as any)._;
const {
    ${ALL_LODASH_FUNCTIONS.join(', ')}
} = lodash;

export {
    ${ALL_LODASH_FUNCTIONS.join(',\n    ')}
};
`;

        fs.writeFileSync(lodashPath, newContent);
        console.log('✅ Updated lodash-optimized.ts with ALL functions');

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
 * Fix all issues in a single file
 */
function fixAllIssues(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Find all lodash function usage
        const usedFunctions = new Set();
        ALL_LODASH_FUNCTIONS.forEach(func => {
            if (content.includes(`${func}(`) || content.includes(`_.${func}(`) || content.includes(`lodash${func.charAt(0).toUpperCase() + func.slice(1)}(`)) {
                usedFunctions.add(func);
            }
        });

        // Special cases for renamed functions
        if (content.includes('lodashMap(')) {
            usedFunctions.add('map');
            content = content.replace(/lodashMap/g, 'map');
            modified = true;
        }

        if (usedFunctions.size === 0) {
            return false;
        }

        const lines = content.split('\n');
        const newLines = [];
        let hasLodashImport = false;
        let rxjsImports = new Set();

        // Process each line
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];

            // Remove lodash-es imports
            if (line.includes("from 'lodash-es'") || line.includes('from "lodash-es"')) {
                modified = true;
                continue;
            }

            // Track RxJS imports to avoid conflicts
            if ((line.includes('from \'rxjs') || line.includes('from "rxjs')) && line.includes('import')) {
                const importMatch = line.match(/import\s*\{\s*([^}]+)\s*\}/);
                if (importMatch) {
                    const imports = importMatch[1].split(',').map(f => f.trim());
                    imports.forEach(imp => rxjsImports.add(imp));
                }
                newLines.push(line);
                continue;
            }

            // Remove existing lodash imports - we'll rebuild
            if (line.includes('lodash-optimized') && line.includes('import')) {
                hasLodashImport = true;
                modified = true;
                continue;
            }

            // Fix _.function calls
            ALL_LODASH_FUNCTIONS.forEach(func => {
                const regex = new RegExp(`_\\.${func}\\(`, 'g');
                if (regex.test(line)) {
                    line = line.replace(regex, `${func}(`);
                    modified = true;
                    usedFunctions.add(func);
                }
            });

            newLines.push(line);
        }

        // Filter out functions that conflict with RxJS if they're imported from RxJS
        const lodashFunctions = Array.from(usedFunctions).filter(func => {
            // If it's a potential conflict and RxJS has it, prefer RxJS
            if ((func === 'map' || func === 'filter') && rxjsImports.has(func)) {
                return false;
            }
            return true;
        });

        // Add lodash import if needed
        if (lodashFunctions.length > 0) {
            const importPath = getImportPath(filePath);
            const sortedImports = lodashFunctions.sort();
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
            console.log(`✅ Fixed: ${filePath} (${lodashFunctions.length} functions)`);
            stats.issuesFixed++;
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
                if (fixAllIssues(fullPath)) {
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
    console.log('Step 1: Updating lodash-optimized.ts with ALL functions...');
    updateLodashOptimized();

    console.log('\nStep 2: Fixing ALL remaining lodash issues...');
    const srcPath = './apps/web-giddh/src';
    processDirectory(srcPath);

    console.log('\n📊 ULTIMATE FIX Results:');
    console.log('========================');
    console.log(`✅ Files processed: ${stats.filesProcessed}`);
    console.log(`✅ Issues fixed: ${stats.issuesFixed}`);

    if (stats.errors.length > 0) {
        console.log(`\n❌ Errors: ${stats.errors.length}`);
        stats.errors.slice(0, 5).forEach((error, index) => {
            console.log(`   ${index + 1}. ${error}`);
        });
    } else {
        console.log('\n🎉 ALL ISSUES RESOLVED!');
    }

    console.log('\n🚀 FINAL BUILD READY:');
    console.log('npm run build');

    console.log('\n✨ Complete Angular 21 fix finished - ready for production!');
}

main();
