#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Fix remaining syntax errors in specific modules
 */

const problematicFiles = [
    './apps/web-giddh/src/app/audit-logs/audit-logs.module.ts',
    './apps/web-giddh/src/app/company-import-export/company-import-export.module.ts',
    './apps/web-giddh/src/app/daybook/daybook.module.ts',
    './apps/web-giddh/src/app/dns-records/dns-records.module.ts',
    './apps/web-giddh/src/app/downloads/downloads.module.ts',
    './apps/web-giddh/src/app/inventory-in-out/inventory-in-out.module.ts',
    './apps/web-giddh/src/app/login/token-verify.module.ts',
    './apps/web-giddh/src/app/manufacturing/manufacturing.module.ts',
    './apps/web-giddh/src/app/shared/advance-receipt-adjustment/advance-receipt-adjustment.module.ts',
    './apps/web-giddh/src/app/shared/aside-menu-recurring-entry/aside.menu.recurringEntry.module.ts',
    './apps/web-giddh/src/app/shared/bank-integration/bank-integration.module.ts',
    './apps/web-giddh/src/app/shared/header/components/hamburger-menu/hamburger-menu.module.ts',
    './apps/web-giddh/src/app/signup/signup.module.ts',
    './apps/web-giddh/src/app/theme/form-fields/form-fields.module.ts'
];

let fixedCount = 0;

problematicFiles.forEach(filePath => {
    try {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            let newContent = content;
            let hasChanges = false;

            // Fix 1: Add missing closing braces for modules
            if (newContent.includes('export class') && !newContent.match(/export class \w+Module\s*\{[\s\S]*?\}/)) {
                newContent = newContent.replace(
                    /(export class \w+Module\s*\{[^}]*?)$/,
                    '$1\n}'
                );
                hasChanges = true;
            }

            // Fix 2: Fix malformed imports array endings
            newContent = newContent.replace(/,(\s*\]\s*\})/g, '$1');

            // Fix 3: Fix missing commas in imports
            newContent = newContent.replace(/(\w+Module)\s+(\w+Module)/g, '$1,\n        $2');

            // Fix 4: Fix trailing issues in imports arrays
            newContent = newContent.replace(/,\s*,/g, ',');

            // Fix 5: Ensure proper module structure
            if (newContent.includes('@NgModule') && !newContent.includes('})')) {
                newContent = newContent.replace(
                    /(@NgModule\s*\{[\s\S]*?\]\s*)$/,
                    '$1\n})'
                );
                hasChanges = true;
            }

            if (newContent !== content) {
                fs.writeFileSync(filePath, newContent);
                fixedCount++;
                console.log(`✅ Fixed syntax errors in ${path.basename(filePath)}`);
            }
        }
    } catch (error) {
        console.error(`❌ Error fixing ${filePath}: ${error.message}`);
    }
});

console.log(`✅ Fixed syntax errors in ${fixedCount} files`);
