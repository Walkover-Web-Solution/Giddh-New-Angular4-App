#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing missing cloneDeep imports in store reducers...\n');

// Store reducer files that need cloneDeep imports
const reducerFiles = [
    './apps/web-giddh/src/app/store/invoice/ewaybill/eway-bill.reducer.ts',
    './apps/web-giddh/src/app/store/invoice/invoice.reducer.ts',
    './apps/web-giddh/src/app/store/invoice/invoice.template.reducer.ts',
    './apps/web-giddh/src/app/store/invoice/Receipt/receipt.reducer.ts',
    './apps/web-giddh/src/app/store/inventory/inventory.reducer.ts',
    './apps/web-giddh/src/app/store/authentication/authentication.reducer.ts',
    './apps/web-giddh/src/app/store/general/general.reducer.ts',
    './apps/web-giddh/src/app/store/gst-r/GstR.reducer.ts',
    './apps/web-giddh/src/app/store/audit-logs/audit-logs.reducer.ts',
    './apps/web-giddh/src/app/store/group-with-accounts/groupwithaccounts.reducer.ts',
    './apps/web-giddh/src/app/store/aging-report/aging-report.reducer.ts',
    './apps/web-giddh/src/app/store/company/company.reducer.ts',
    './apps/web-giddh/src/app/store/general/session.reducer.ts',
    './apps/web-giddh/src/app/store/gst-reconcile/GstReconcile.reducer.ts',
    './apps/web-giddh/src/app/store/inventory-in-out/inventory-in-out.reducer.ts'
];

let fixedCount = 0;
let errorCount = 0;

function addCloneDeepImport(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            console.log(`⚠️  File not found: ${filePath}`);
            return;
        }

        let content = fs.readFileSync(filePath, 'utf8');

        // Check if cloneDeep is already imported
        if (content.includes('cloneDeep') && content.includes('import')) {
            console.log(`✅ ${filePath} - cloneDeep already imported`);
            return;
        }

        // Check if file uses cloneDeep
        if (!content.includes('cloneDeep(')) {
            console.log(`ℹ️  ${filePath} - no cloneDeep usage found`);
            return;
        }

        // Find the best place to add the import
        const lines = content.split('\n');
        let insertIndex = -1;

        // Look for existing lodash imports first
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('lodash') && lines[i].includes('import')) {
                // Add to existing lodash import
                if (lines[i].includes('{') && lines[i].includes('}')) {
                    // Single line import like: import { something } from 'lodash';
                    lines[i] = lines[i].replace(/\{([^}]+)\}/, (match, imports) => {
                        const importList = imports.split(',').map(imp => imp.trim());
                        if (!importList.includes('cloneDeep')) {
                            importList.push('cloneDeep');
                        }
                        return `{${importList.join(', ')}}`;
                    });
                    content = lines.join('\n');
                    fs.writeFileSync(filePath, content);
                    console.log(`✅ ${filePath} - added cloneDeep to existing lodash import`);
                    fixedCount++;
                    return;
                }
            }
        }

        // Find last import statement
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim().startsWith('import ') && lines[i].includes('from')) {
                insertIndex = i;
            }
        }

        if (insertIndex === -1) {
            // No imports found, add at the beginning
            insertIndex = 0;
        } else {
            // Add after the last import
            insertIndex = insertIndex + 1;
        }

        // Add the cloneDeep import
        const importStatement = "import { cloneDeep } from 'lodash-es';";
        lines.splice(insertIndex, 0, importStatement);

        content = lines.join('\n');
        fs.writeFileSync(filePath, content);
        console.log(`✅ ${filePath} - added cloneDeep import`);
        fixedCount++;

    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        errorCount++;
    }
}

// Process all reducer files
reducerFiles.forEach(filePath => {
    addCloneDeepImport(filePath);
});

console.log('\n📊 Results:');
console.log(`✅ Files fixed: ${fixedCount}`);
console.log(`❌ Errors: ${errorCount}`);

if (errorCount === 0) {
    console.log('\n🎉 All reducer imports fixed successfully!');
    console.log('Run "npm run build" to verify compilation.');
} else {
    console.log('\n⚠️  Some files had errors. Please check manually.');
}
