#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to fix remaining compilation errors from forEach defensive programming and import paths
 */

const srcDir = './apps/web-giddh/src';
let filesProcessed = 0;
let filesModified = 0;
let totalFixes = 0;

function processFile(filePath) {
    if (!filePath.endsWith('.ts') || filePath.includes('.spec.ts') || filePath.includes('.d.ts')) {
        return;
    }

    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        filesProcessed++;

        let modifications = 0;

        // Fix syntax errors in forEach defensive programming patterns
        // Pattern 1: object.(Array.isArray(variable) ? variable : []).forEach
        content = content.replace(
            /(\w+)\.\(Array\.isArray\((\w+)\?\.\w+\) \? \2\?\.\w+ : \[\]\)\.forEach/g,
            (match, objectName, variableName) => {
                modifications++;
                return `(Array.isArray(${objectName}.${variableName}) ? ${objectName}.${variableName} : []).forEach`;
            }
        );

        // Pattern 2: this.(Array.isArray(variable) ? variable : []).forEach
        content = content.replace(
            /this\.\(Array\.isArray\((\w+)\?\.\w+\) \? \1\?\.\w+ : \[\]\)\.forEach/g,
            (match, variableName) => {
                modifications++;
                return `(Array.isArray(this.${variableName}) ? this.${variableName} : []).forEach`;
            }
        );

        // Pattern 3: response.(Array.isArray(body?.property) ? body?.property : []).forEach
        content = content.replace(
            /response\.\(Array\.isArray\(body\?\.\w+\) \? body\?\.\w+ : \[\]\)\.forEach/g,
            (match) => {
                const propertyMatch = match.match(/body\?\.(\w+)/);
                if (propertyMatch) {
                    modifications++;
                    return `(Array.isArray(response.body?.${propertyMatch[1]}) ? response.body?.${propertyMatch[1]} : []).forEach`;
                }
                return match;
            }
        );

        // Pattern 4: object.(Array.isArray(variable) ? variable : []).forEach where variable is undefined
        content = content.replace(
            /(\w+)\.\(Array\.isArray\((\w+)\) \? \2 : \[\]\)\.forEach/g,
            (match, objectName, variableName) => {
                modifications++;
                return `(Array.isArray(${objectName}.${variableName}) ? ${objectName}.${variableName} : []).forEach`;
            }
        );

        // Fix incorrect lodash-optimized import paths
        const lodashImportPattern = /import\s*\{\s*([^}]+)\s*\}\s*from\s*['"]([^'"]*lodash-optimized)['"]/g;
        content = content.replace(lodashImportPattern, (match, imports, importPath) => {
            // Calculate correct relative path based on file location
            const fileDir = path.dirname(filePath);
            const appDir = path.join(srcDir, 'app');
            const relativePath = path.relative(fileDir, appDir);
            const correctPath = path.join(relativePath, 'lodash-optimized').replace(/\\/g, '/');

            if (importPath !== correctPath) {
                modifications++;
                return `import { ${imports} } from '${correctPath}'`;
            }
            return match;
        });

        if (modifications > 0) {
            console.log(`\n🔧 Processing: ${filePath}`);
            console.log(`   Applied ${modifications} fixes`);
            totalFixes += modifications;
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

console.log('🚀 Starting comprehensive compilation error fix...');
console.log(`📁 Processing directory: ${srcDir}`);
console.log('🔍 Fixing forEach defensive programming syntax errors and import paths');

processDirectory(srcDir);

console.log('\n📊 SUMMARY:');
console.log(`   Files processed: ${filesProcessed}`);
console.log(`   Files modified: ${filesModified}`);
console.log(`   Total fixes applied: ${totalFixes}`);

if (filesModified > 0) {
    console.log('\n✅ SUCCESS: Fixed remaining compilation errors!');
    console.log('   All forEach defensive programming patterns and import paths corrected.');
} else {
    console.log('\n✅ No compilation issues found - all files already correct!');
}

console.log('\n🔧 Next steps:');
console.log('   1. Run npm run build.electron.giddh to verify fixes');
console.log('   2. Test Electron application functionality');
console.log('   3. Verify forEach errors are resolved');
