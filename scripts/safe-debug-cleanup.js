#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧹 Safe Debug Cleanup - Removing Only Simple Console Statements');
console.log('===============================================================');

function safeCleanFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        let cleanedContent = content;
        let removals = 0;

        // Only remove simple, standalone console statements
        // Pattern: console.log(...); on its own line
        const simpleConsolePattern = /^\s*console\.(log|error|warn|info|debug|trace)\s*\([^)]*\);\s*$/gm;
        const matches = cleanedContent.match(simpleConsolePattern);
        
        if (matches) {
            cleanedContent = cleanedContent.replace(simpleConsolePattern, '');
            removals = matches.length;
            
            // Clean up multiple empty lines
            cleanedContent = cleanedContent.replace(/\n\s*\n\s*\n/g, '\n\n');
            
            fs.writeFileSync(filePath, cleanedContent, 'utf8');
            console.log(`✅ ${path.relative(process.cwd(), filePath)} (${removals} simple console statements removed)`);
        }
        
        return removals;
    } catch (error) {
        console.error(`❌ Error processing ${filePath}: ${error.message}`);
        return 0;
    }
}

// Process files that are safe to clean
const safeFiles = [
    'apps/web-giddh/src/app/electron-compatibility.ts',
    'apps/web-giddh/src/app/services/environment-validator.service.ts',
    'apps/web-giddh/src/app/services/page-leave-utility.service.ts',
    'apps/web-giddh/src/app/services/angular21-change-detection.service.ts',
    'apps/web-giddh/src/app/services/general.service.ts',
    'apps/web-giddh/src/app/services/environment.service.ts',
    'apps/web-giddh/src/app/services/white-label.service.ts',
    'apps/web-giddh/src/app/angular21-compatibility.ts',
    'apps/web-giddh/src/app/lodash-optimized.ts',
    'apps/web-giddh/src/main.ts',
    'apps/web-giddh/src/main.electron.ts'
];

let totalRemovals = 0;
let filesModified = 0;

safeFiles.forEach(filePath => {
    const fullPath = path.join(__dirname, '..', filePath);
    if (fs.existsSync(fullPath)) {
        const removals = safeCleanFile(fullPath);
        if (removals > 0) {
            filesModified++;
            totalRemovals += removals;
        }
    }
});

console.log(`\n📊 SAFE CLEANUP SUMMARY:`);
console.log(`✅ Files modified: ${filesModified}`);
console.log(`🗑️  Total removals: ${totalRemovals}`);
console.log(`✅ Safe debug cleanup completed!`);
