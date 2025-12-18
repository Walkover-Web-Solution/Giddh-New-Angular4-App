#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Final Angular 21 Compilation Fix...\n');

let stats = {
    filesFixed: 0,
    importsAdded: 0,
    duplicatesRemoved: 0,
    errors: []
};

/**
 * Fix all lodash import issues
 */
function fixAllLodashIssues() {
    const srcPath = './apps/web-giddh/src';

    function processDirectory(dirPath) {
        try {
            const items = fs.readdirSync(dirPath);

            for (const item of items) {
                const fullPath = path.join(dirPath, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory() && !item.includes('node_modules') && !item.includes('.git')) {
                    processDirectory(fullPath);
                } else if (item.endsWith('.ts') && !item.endsWith('.d.ts')) {
                    fixFileImports(fullPath);
                }
            }
        } catch (error) {
            // Skip directories we can't read
        }
    }

    function fixFileImports(filePath) {
        try {
            let content = fs.readFileSync(filePath, 'utf8');
            let modified = false;

            // Check if file uses cloneDeep
            if (!content.includes('cloneDeep(')) {
                return;
            }

            const lines = content.split('\n');
            const newLines = [];
            let hasCorrectImport = false;
            let removedDuplicates = false;

            // Process each line
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];

                // Remove incorrect lodash-es imports
                if (line.includes("import { cloneDeep } from 'lodash-es'")) {
                    removedDuplicates = true;
                    continue;
                }

                // Check for existing correct imports
                if (line.includes('cloneDeep') && line.includes('lodash-optimized')) {
                    hasCorrectImport = true;
                }

                // Check for duplicate imports in same file
                if (line.includes('import { cloneDeep') && line.includes('lodash-optimized')) {
                    if (hasCorrectImport) {
                        // This is a duplicate, skip it
                        removedDuplicates = true;
                        continue;
                    }
                    hasCorrectImport = true;
                }

                newLines.push(line);
            }

            // Add correct import if missing
            if (!hasCorrectImport) {
                // Find the best place to add import
                let insertIndex = -1;
                for (let i = 0; i < newLines.length; i++) {
                    if (newLines[i].trim().startsWith('import ') && newLines[i].includes('from')) {
                        insertIndex = i;
                    }
                }

                if (insertIndex !== -1) {
                    // Determine correct import path based on file location
                    const relativePath = path.relative(path.dirname(filePath), path.join(srcPath, 'app/lodash-optimized'));
                    const importPath = relativePath.startsWith('.') ? relativePath : './' + relativePath;
                    const correctedPath = importPath.replace(/\\/g, '/'); // Fix Windows paths

                    const importStatement = `import { cloneDeep } from '${correctedPath}';`;
                    newLines.splice(insertIndex + 1, 0, importStatement);
                    modified = true;
                    stats.importsAdded++;
                }
            }

            if (removedDuplicates) {
                modified = true;
                stats.duplicatesRemoved++;
            }

            // Write back if modified
            if (modified) {
                const newContent = newLines.join('\n');
                fs.writeFileSync(filePath, newContent);
                console.log(`✅ Fixed: ${filePath}`);
                stats.filesFixed++;
            }

        } catch (error) {
            console.error(`❌ Error processing ${filePath}:`, error.message);
            stats.errors.push(`${filePath}: ${error.message}`);
        }
    }

    processDirectory(srcPath);
}

/**
 * Specific fixes for known problematic files
 */
function fixSpecificFiles() {
    const specificFixes = [
        {
            file: './apps/web-giddh/src/app/services/invoice.service.ts',
            importPath: '../lodash-optimized'
        },
        {
            file: './apps/web-giddh/src/app/shared/datepicker-wrapper/datepicker.wrapper.component.ts',
            importPath: '../../lodash-optimized'
        },
        {
            file: './apps/web-giddh/src/app/shared/header/components/group-export-ledger-modal/export-group-ledger.component.ts',
            importPath: '../../../../lodash-optimized'
        }
    ];

    specificFixes.forEach(fix => {
        try {
            if (!fs.existsSync(fix.file)) {
                return;
            }

            let content = fs.readFileSync(fix.file, 'utf8');

            if (!content.includes('cloneDeep(')) {
                return;
            }

            if (content.includes('cloneDeep') && content.includes('import')) {
                return; // Already has import
            }

            const lines = content.split('\n');
            let insertIndex = -1;

            // Find last import
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].trim().startsWith('import ') && lines[i].includes('from')) {
                    insertIndex = i;
                }
            }

            if (insertIndex !== -1) {
                const importStatement = `import { cloneDeep } from '${fix.importPath}';`;
                lines.splice(insertIndex + 1, 0, importStatement);

                const newContent = lines.join('\n');
                fs.writeFileSync(fix.file, newContent);
                console.log(`✅ Fixed specific file: ${fix.file}`);
                stats.filesFixed++;
                stats.importsAdded++;
            }

        } catch (error) {
            console.error(`❌ Error fixing ${fix.file}:`, error.message);
            stats.errors.push(`${fix.file}: ${error.message}`);
        }
    });
}

/**
 * Main execution
 */
function main() {
    console.log('Step 1: Fixing all lodash import issues...');
    fixAllLodashIssues();

    console.log('\nStep 2: Fixing specific problematic files...');
    fixSpecificFiles();

    console.log('\n📊 Final Results:');
    console.log(`✅ Files fixed: ${stats.filesFixed}`);
    console.log(`✅ Imports added: ${stats.importsAdded}`);
    console.log(`✅ Duplicates removed: ${stats.duplicatesRemoved}`);

    if (stats.errors.length > 0) {
        console.log(`\n❌ Errors: ${stats.errors.length}`);
        stats.errors.forEach((error, index) => {
            console.log(`   ${index + 1}. ${error}`);
        });
    }

    console.log('\n🎉 All lodash import issues fixed!');
    console.log('Run "npm run build" to verify compilation.');
}

main();
