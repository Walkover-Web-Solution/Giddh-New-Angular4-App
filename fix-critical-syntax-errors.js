#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Fix critical syntax errors from FormFieldsModule disabling
 */

const criticalFiles = [
    './apps/web-giddh/src/app/shared/header/components/hamburger-menu/hamburger-menu.module.ts',
    './apps/web-giddh/src/app/theme/form-fields/form-fields.module.ts'
];

let fixedCount = 0;

criticalFiles.forEach(filePath => {
    try {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            let newContent = content;
            let hasChanges = false;

            // Fix malformed import statements
            newContent = newContent.replace(
                /import\s*\{\s*\/\/\s*FormFieldsModule[^}]*\}\s*from[^;]*;/g,
                '// import { FormFieldsModule } from "../form-fields/form-fields.module"; // Temporarily disabled'
            );

            // Fix missing closing braces in modules
            if (newContent.includes('export class') && !newContent.includes('}\n\n')) {
                newContent = newContent.replace(
                    /(export class \w+Module\s*\{[^}]*)/,
                    '$1\n}'
                );
                hasChanges = true;
            }

            if (newContent !== content) {
                fs.writeFileSync(filePath, newContent);
                fixedCount++;
                console.log(`✅ Fixed critical syntax errors in ${path.basename(filePath)}`);
            }
        }
    } catch (error) {
        console.error(`❌ Error fixing ${filePath}: ${error.message}`);
    }
});

console.log(`✅ Fixed ${fixedCount} critical files`);
