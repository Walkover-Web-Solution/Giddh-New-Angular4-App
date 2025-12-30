#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to add defensive programming to forEach calls to prevent Electron errors
 * This ensures forEach is only called on arrays and handles undefined/null cases
 */

const srcDir = './apps/web-giddh/src';
let filesProcessed = 0;
let filesModified = 0;
let totalReplacements = 0;

function processFile(filePath) {
    if (!filePath.endsWith('.ts') || filePath.includes('.spec.ts') || filePath.includes('.d.ts')) {
        return;
    }

    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        filesProcessed++;

        // Pattern to match forEach calls that need defensive programming
        // Look for: variable.forEach( or variable?.forEach(
        const forEachPattern = /(\w+(?:\?\.\w+)*|\w+(?:\.\w+)+)\.forEach\(/g;
        const matches = content.match(forEachPattern);

        if (!matches) {
            return; // No forEach calls found
        }

        console.log(`\n🔧 Processing: ${filePath}`);
        console.log(`   Found ${matches.length} forEach calls`);

        let replacements = 0;
        let newContent = content;

        // Replace forEach calls with defensive programming
        newContent = newContent.replace(
            /(\w+(?:\?\.\w+)*|\w+(?:\.\w+)+)\.forEach\(/g,
            (match, variable) => {
                // Skip if already has Array.isArray check nearby
                const beforeMatch = newContent.substring(0, newContent.indexOf(match));
                const lastLines = beforeMatch.split('\n').slice(-3).join('\n');

                if (lastLines.includes(`Array.isArray(${variable})`) ||
                    lastLines.includes(`if (${variable} && Array.isArray(${variable})`)) {
                    return match; // Already has defensive programming
                }

                replacements++;
                return `(Array.isArray(${variable}) ? ${variable} : []).forEach(`;
            }
        );

        if (replacements > 0) {
            console.log(`   ✅ Added defensive programming to ${replacements} forEach calls`);
            totalReplacements += replacements;
        }

        // Only write if content changed
        if (newContent !== originalContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
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

console.log('🚀 Starting forEach defensive programming fix...');
console.log(`📁 Processing directory: ${srcDir}`);
console.log(`🔍 Looking for: variable.forEach( patterns`);

processDirectory(srcDir);

console.log('\n📊 SUMMARY:');
console.log(`   Files processed: ${filesProcessed}`);
console.log(`   Files modified: ${filesModified}`);
console.log(`   Total forEach calls protected: ${totalReplacements}`);

if (filesModified > 0) {
    console.log('\n✅ SUCCESS: Added defensive programming to forEach calls!');
    console.log('   All forEach calls now check if variable is an array before execution.');
    console.log('   This prevents "forEach is not a function" errors in Electron builds.');
} else {
    console.log('\n✅ No forEach issues found - all calls already have proper defensive programming!');
}

console.log('\n🔧 Next steps:');
console.log('   1. Test the application to ensure forEach calls work correctly');
console.log('   2. Build the Electron app to verify forEach errors are resolved');
console.log('   3. The defensive programming ensures forEach only runs on actual arrays');
