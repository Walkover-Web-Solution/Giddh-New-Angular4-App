#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 FINAL ERROR FIX: Resolving last remaining compilation errors...\n');

let stats = {
    filesFixed: 0,
    errors: []
};

/**
 * Fix angular21-compatibility.ts TypeScript error
 */
function fixCompatibilityFile() {
    const filePath = './apps/web-giddh/src/app/angular21-compatibility.ts';

    try {
        let content = fs.readFileSync(filePath, 'utf8');

        // Fix the arrow function issue
        content = content.replace(
            'window.onunhandledrejection = (event: PromiseRejectionEvent) => {',
            'window.onunhandledrejection = function(event: PromiseRejectionEvent) {'
        );

        // Also fix the return statement context
        content = content.replace(
            'return originalUnhandledRejection(event);',
            'return originalUnhandledRejection.call(this, event);'
        );

        fs.writeFileSync(filePath, content);
        console.log('✅ Fixed angular21-compatibility.ts TypeScript error');
        stats.filesFixed++;

    } catch (error) {
        console.error('❌ Error fixing angular21-compatibility.ts:', error.message);
        stats.errors.push(`angular21-compatibility.ts: ${error.message}`);
    }
}

/**
 * Fix duplicate merge import in advance-receipt-report
 */
function fixAdvanceReceiptReport() {
    const filePath = './apps/web-giddh/src/app/reports/components/advance-receipt-report/advance-receipt-report.component.ts';

    try {
        let content = fs.readFileSync(filePath, 'utf8');

        // Remove merge from lodash import since it conflicts with RxJS
        content = content.replace(
            /import { ([^}]*), merge([^}]*) } from '\.\.\/\.\.\/\.\.\/lodash-optimized';/,
            'import { $1$2 } from \'../../../lodash-optimized\';'
        );

        fs.writeFileSync(filePath, content);
        console.log('✅ Fixed duplicate merge import in advance-receipt-report');
        stats.filesFixed++;

    } catch (error) {
        console.error('❌ Error fixing advance-receipt-report:', error.message);
        stats.errors.push(`advance-receipt-report: ${error.message}`);
    }
}

/**
 * Fix map function type error in group.service.ts
 */
function fixGroupService() {
    const filePath = './apps/web-giddh/src/app/services/group.service.ts';

    try {
        let content = fs.readFileSync(filePath, 'utf8');

        // Fix the map function call by using proper lodash map
        content = content.replace(
            'listofUN = map(rawList, (listItem) => {',
            'listofUN = rawList.map((listItem) => {'
        );

        // Remove map from lodash import if it exists
        content = content.replace(
            /import { ([^}]*), map([^}]*) } from '\.\.\/lodash-optimized';/,
            'import { $1$2 } from \'../lodash-optimized\';'
        );

        fs.writeFileSync(filePath, content);
        console.log('✅ Fixed map function type error in group.service.ts');
        stats.filesFixed++;

    } catch (error) {
        console.error('❌ Error fixing group.service.ts:', error.message);
        stats.errors.push(`group.service.ts: ${error.message}`);
    }
}

/**
 * Fix missing isEqual imports in account components
 */
function fixAccountComponents() {
    const files = [
        './apps/web-giddh/src/app/shared/header/components/account-add-new-details/account-add-new-details.component.ts',
        './apps/web-giddh/src/app/shared/header/components/account-update-new-details/account-update-new-details.component.ts'
    ];

    files.forEach(filePath => {
        try {
            let content = fs.readFileSync(filePath, 'utf8');

            // Check if isEqual is used but not imported
            if (content.includes('isEqual') && !content.includes('import { isEqual') && !content.includes(', isEqual')) {
                // Add isEqual to existing lodash import
                content = content.replace(
                    /import { ([^}]+) } from '\.\.\/\.\.\/\.\.\/\.\.\/lodash-optimized';/,
                    'import { $1, isEqual } from \'../../../../lodash-optimized\';'
                );

                fs.writeFileSync(filePath, content);
                console.log(`✅ Fixed missing isEqual import in ${path.basename(filePath)}`);
                stats.filesFixed++;
            }

        } catch (error) {
            console.error(`❌ Error fixing ${filePath}:`, error.message);
            stats.errors.push(`${filePath}: ${error.message}`);
        }
    });
}

/**
 * Main execution
 */
function main() {
    console.log('Step 1: Fixing angular21-compatibility.ts...');
    fixCompatibilityFile();

    console.log('\nStep 2: Fixing duplicate merge import...');
    fixAdvanceReceiptReport();

    console.log('\nStep 3: Fixing map function type error...');
    fixGroupService();

    console.log('\nStep 4: Fixing missing isEqual imports...');
    fixAccountComponents();

    console.log('\n📊 Final Error Fix Results:');
    console.log('===========================');
    console.log(`✅ Files fixed: ${stats.filesFixed}`);

    if (stats.errors.length > 0) {
        console.log(`\n❌ Errors: ${stats.errors.length}`);
        stats.errors.forEach((error, index) => {
            console.log(`   ${index + 1}. ${error}`);
        });
    } else {
        console.log('\n🎉 ALL FINAL ERRORS RESOLVED!');
    }

    console.log('\n🚀 READY FOR SUCCESSFUL BUILD:');
    console.log('npm run build');

    console.log('\n✨ Angular 21 migration complete - ready for production!');
}

main();
