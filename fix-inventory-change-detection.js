#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to add manual change detection to inventory components
 * Fixes Angular 21 data display issues where data loads but doesn't show
 */

const INVENTORY_FOLDER = './apps/web-giddh/src/app/new-inventory';

// Patterns to identify where manual change detection is needed
const SERVICE_CALL_PATTERNS = [
    /\.subscribe\s*\(\s*(?:response|data|result|res)\s*=>/g,
    /\.pipe\([^)]*\)\.subscribe/g,
    /this\.\w+Service\.\w+\([^)]*\)\.subscribe/g,
    /this\.store\.dispatch/g,
    /this\.store\.select/g,
    /\.select\([^)]*\)\.subscribe/g
];

// Components that need change detection after data operations
const CHANGE_DETECTION_METHODS = [
    'subscribe',
    'next',
    'complete',
    'dispatch'
];

function findTsFiles(dir) {
    const files = [];

    function traverse(currentDir) {
        const items = fs.readdirSync(currentDir);

        for (const item of items) {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                traverse(fullPath);
            } else if (item.endsWith('.component.ts')) {
                files.push(fullPath);
            }
        }
    }

    traverse(dir);
    return files;
}

function needsChangeDetectorRef(content) {
    // Check if ChangeDetectorRef is already imported
    return !content.includes('ChangeDetectorRef');
}

function hasServiceCalls(content) {
    return SERVICE_CALL_PATTERNS.some(pattern => pattern.test(content));
}

function addChangeDetectorRefImport(content) {
    // Add ChangeDetectorRef to existing Angular core imports
    const coreImportRegex = /import\s*{\s*([^}]*)\s*}\s*from\s*['"]@angular\/core['"]/;
    const match = content.match(coreImportRegex);

    if (match) {
        const imports = match[1];
        if (!imports.includes('ChangeDetectorRef')) {
            const newImports = imports.trim() + ', ChangeDetectorRef';
            return content.replace(coreImportRegex, `import { ${newImports} } from '@angular/core'`);
        }
    } else {
        // Add new import if @angular/core import doesn't exist
        const firstImport = content.match(/^import\s+.*$/m);
        if (firstImport) {
            const newImport = `import { ChangeDetectorRef } from '@angular/core';\n`;
            return content.replace(firstImport[0], newImport + firstImport[0]);
        }
    }

    return content;
}

function addChangeDetectorRefToConstructor(content) {
    // Find constructor and add ChangeDetectorRef parameter
    const constructorRegex = /constructor\s*\(\s*([^)]*)\s*\)\s*{/;
    const match = content.match(constructorRegex);

    if (match) {
        const params = match[1].trim();
        if (!params.includes('cdr: ChangeDetectorRef') && !params.includes('changeDetectorRef')) {
            const newParams = params ? params + ',\n        private cdr: ChangeDetectorRef' : 'private cdr: ChangeDetectorRef';
            return content.replace(constructorRegex, `constructor(\n        ${newParams}\n    ) {`);
        }
    }

    return content;
}

function addManualChangeDetection(content) {
    // Add manual change detection after subscribe callbacks
    const subscribePatterns = [
        // Pattern 1: .subscribe(response => { ... })
        /\.subscribe\s*\(\s*(?:response|data|result|res)\s*=>\s*{\s*([^}]*(?:{[^}]*}[^}]*)*)\s*}\s*\)/g,
        // Pattern 2: .subscribe({ next: (response) => { ... } })
        /\.subscribe\s*\(\s*{\s*next:\s*\([^)]*\)\s*=>\s*{\s*([^}]*(?:{[^}]*}[^}]*)*)\s*}\s*[^}]*}\s*\)/g
    ];

    let updatedContent = content;

    subscribePatterns.forEach(pattern => {
        updatedContent = updatedContent.replace(pattern, (match, callbackBody) => {
            // Only add change detection if it's not already there
            if (!callbackBody.includes('this.cdr.detectChanges()') &&
                !callbackBody.includes('detectChanges()')) {

                // Find the end of the callback body and add change detection
                const lines = callbackBody.split('\n');
                const lastLine = lines[lines.length - 1];
                const indent = lastLine.match(/^(\s*)/)?.[1] || '            ';

                const changeDetectionLine = `${indent}// Manual change detection for Angular 21\n${indent}this.cdr.detectChanges();`;
                const newCallbackBody = callbackBody.trim() + '\n' + changeDetectionLine;

                return match.replace(callbackBody, newCallbackBody);
            }
            return match;
        });
    });

    return updatedContent;
}

function processComponent(filePath) {
    console.log(`Processing: ${filePath}`);

    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Check if this component needs change detection fixes
        if (!hasServiceCalls(content)) {
            console.log(`  ⏭️  No service calls found, skipping`);
            return;
        }

        // Add ChangeDetectorRef import if needed
        if (needsChangeDetectorRef(content)) {
            content = addChangeDetectorRefImport(content);
            modified = true;
            console.log(`  ✅ Added ChangeDetectorRef import`);
        }

        // Add ChangeDetectorRef to constructor if needed
        if (!content.includes('cdr: ChangeDetectorRef') && !content.includes('changeDetectorRef')) {
            content = addChangeDetectorRefToConstructor(content);
            modified = true;
            console.log(`  ✅ Added ChangeDetectorRef to constructor`);
        }

        // Add manual change detection after service calls
        const originalContent = content;
        content = addManualChangeDetection(content);
        if (content !== originalContent) {
            modified = true;
            console.log(`  ✅ Added manual change detection calls`);
        }

        // Write back if modified
        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`  💾 File updated successfully`);
        } else {
            console.log(`  ✅ No changes needed`);
        }

    } catch (error) {
        console.error(`  ❌ Error processing ${filePath}:`, error.message);
    }
}

function main() {
    console.log('🔧 Starting Inventory Change Detection Fix for Angular 21...\n');

    if (!fs.existsSync(INVENTORY_FOLDER)) {
        console.error(`❌ Inventory folder not found: ${INVENTORY_FOLDER}`);
        process.exit(1);
    }

    const componentFiles = findTsFiles(INVENTORY_FOLDER);
    console.log(`📁 Found ${componentFiles.length} component files to process\n`);

    let processedCount = 0;
    let modifiedCount = 0;

    componentFiles.forEach(filePath => {
        const originalContent = fs.readFileSync(filePath, 'utf8');
        processComponent(filePath);
        const newContent = fs.readFileSync(filePath, 'utf8');

        processedCount++;
        if (originalContent !== newContent) {
            modifiedCount++;
        }

        console.log(''); // Empty line for readability
    });

    console.log('📊 Summary:');
    console.log(`   📁 Total files processed: ${processedCount}`);
    console.log(`   ✏️  Files modified: ${modifiedCount}`);
    console.log(`   ✅ Files unchanged: ${processedCount - modifiedCount}`);
    console.log('\n🎉 Inventory change detection fix completed!');
    console.log('\n📝 Next steps:');
    console.log('   1. Run: npm run build');
    console.log('   2. Test the inventory pages');
    console.log('   3. Verify data displays correctly');
}

if (require.main === module) {
    main();
}
