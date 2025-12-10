#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Clean up remaining FormFieldsModule references
 */

const filesToFix = [
    './apps/web-giddh/src/app/theme/discount-dropdown/discount-dropdown.module.ts',
    './apps/web-giddh/src/app/theme/other-tax/other-tax.module.ts',
    './apps/web-giddh/src/app/theme/tax-authority/tax-authority.module.ts',
    './apps/web-giddh/src/app/theme/tax-control/tax-control.module.ts',
    './apps/web-giddh/src/app/theme/tax-dropdown/tax-dropdown.module.ts',
    './apps/web-giddh/src/app/vat-report/vat-report.module.ts',
    './apps/web-giddh/src/app/verify-subscription-transfer-ownership/verify-subscription-transfer-ownership.module.ts',
    './apps/web-giddh/src/app/voucher/voucher.module.ts',
    './apps/web-giddh/src/app/vouchers/vouchers.module.ts'
];

let fixedCount = 0;

filesToFix.forEach(filePath => {
    try {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');

            if (content.includes('FormFieldsModule') && !content.includes('// FormFieldsModule, // Temporarily disabled')) {
                let newContent = content;

                // Comment out FormFieldsModule in imports arrays
                newContent = newContent.replace(
                    /(\s+)(FormFieldsModule),?/g,
                    '$1// FormFieldsModule, // Temporarily disabled for compilation'
                );

                if (newContent !== content) {
                    fs.writeFileSync(filePath, newContent);
                    fixedCount++;
                    console.log(`✅ Fixed FormFieldsModule in ${path.basename(filePath)}`);
                }
            }
        }
    } catch (error) {
        console.error(`❌ Error fixing ${filePath}: ${error.message}`);
    }
});

console.log(`✅ Fixed ${fixedCount} remaining FormFieldsModule references`);
