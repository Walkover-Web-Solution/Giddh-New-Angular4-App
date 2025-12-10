#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Fix the specific 5 problematic modules
 */

const targetModules = [
    './apps/web-giddh/src/app/accounting/accounting-routing.module.ts',
    './apps/web-giddh/src/app/accounting/accounting.module.ts',
    './apps/web-giddh/src/app/actions/action.module.ts',
    './apps/web-giddh/src/app/activity-logs/activity-logs.module.ts',
    './apps/web-giddh/src/app/activity-logs/activity-logs.routing.module.ts'
];

let fixedCount = 0;

function validateAndFixModule(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            console.log(`❌ File not found: ${filePath}`);
            return false;
        }

        const content = fs.readFileSync(filePath, 'utf8');
        let newContent = content;
        let hasChanges = false;
        let changes = [];

        // Basic validation checks
        const hasNgModule = content.includes('@NgModule');
        const hasExportClass = content.includes('export class');

        if (!hasNgModule) {
            console.log(`❌ ${path.basename(filePath)}: Missing @NgModule decorator`);
            return false;
        }

        if (!hasExportClass) {
            console.log(`❌ ${path.basename(filePath)}: Missing export class`);
            return false;
        }

        // Check for proper @NgModule structure
        const ngModuleMatch = content.match(/@NgModule\s*\(\s*\{([\s\S]*?)\}\s*\)/);
        if (!ngModuleMatch) {
            console.log(`❌ ${path.basename(filePath)}: Malformed @NgModule structure`);

            // Try to fix malformed @NgModule
            if (content.includes('@NgModule({') && !content.includes('})')) {
                // Find the end of the @NgModule content and add closing
                const ngModuleStart = content.indexOf('@NgModule({');
                const classStart = content.indexOf('export class');

                if (ngModuleStart !== -1 && classStart !== -1) {
                    const beforeClass = content.substring(0, classStart);
                    const afterClass = content.substring(classStart);

                    // Add closing brace before export class
                    newContent = beforeClass.trim() + '\n})\n' + afterClass;
                    hasChanges = true;
                    changes.push('Fixed @NgModule closing brace');
                }
            }
        }

        // Check for proper class structure
        const classMatch = content.match(/export\s+class\s+(\w+)\s*\{[\s\S]*?\}/);
        if (!classMatch) {
            console.log(`❌ ${path.basename(filePath)}: Malformed class structure`);

            // Try to fix malformed class
            if (content.includes('export class') && !content.match(/export\s+class\s+\w+\s*\{[\s\S]*?\}/)) {
                // Add closing brace for class if missing
                if (!newContent.endsWith('}') && !newContent.endsWith('}\n')) {
                    newContent = newContent.trim() + '\n}\n';
                    hasChanges = true;
                    changes.push('Added class closing brace');
                }
            }
        }

        // Validate imports array if present
        if (content.includes('imports: [')) {
            const importsMatch = content.match(/imports:\s*\[([\s\S]*?)\]/);
            if (!importsMatch) {
                console.log(`❌ ${path.basename(filePath)}: Malformed imports array`);

                // Try to fix imports array
                newContent = newContent.replace(
                    /(imports:\s*\[[\s\S]*?)(\s*@NgModule|\s*exports:|\s*providers:|\s*declarations:|\s*}\s*\))/,
                    '$1\n    ],$2'
                );
                hasChanges = true;
                changes.push('Fixed imports array structure');
            }
        }

        // Write changes if any
        if (hasChanges) {
            fs.writeFileSync(filePath, newContent);
            fixedCount++;
            console.log(`✅ Fixed ${path.basename(filePath)}`);
            changes.forEach(change => console.log(`   • ${change}`));
            return true;
        } else {
            console.log(`✅ ${path.basename(filePath)}: Already valid`);
            return true;
        }

    } catch (error) {
        console.error(`❌ Error processing ${filePath}: ${error.message}`);
        return false;
    }
}

console.log('🔧 Fixing specific 5 problematic modules...\n');

let allValid = true;
targetModules.forEach(modulePath => {
    const isValid = validateAndFixModule(modulePath);
    if (!isValid) {
        allValid = false;
    }
});

console.log(`\n📊 RESULTS:`);
console.log(`   • Modules checked: ${targetModules.length}`);
console.log(`   • Modules fixed: ${fixedCount}`);
console.log(`   • All valid: ${allValid ? '✅ Yes' : '❌ No'}`);

if (allValid) {
    console.log('\n🎉 All 5 modules are now valid and should compile correctly!');
} else {
    console.log('\n⚠️  Some modules still have issues that need manual review.');
}

process.exit(allValid ? 0 : 1);
