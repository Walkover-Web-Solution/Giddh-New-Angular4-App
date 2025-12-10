#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Add missing component imports to fix template binding errors
 */

class ComponentImportFixer {
    constructor() {
        this.fixedFiles = 0;
        this.componentsAdded = 0;
    }

    /**
     * Add AmountFieldComponent to VouchersModule
     */
    fixVouchersModule() {
        const filePath = './apps/web-giddh/src/app/vouchers/vouchers.module.ts';

        try {
            const content = fs.readFileSync(filePath, 'utf8');
            let newContent = content;
            let changes = [];

            // Add AmountFieldComponent import
            if (!content.includes('AmountFieldComponent')) {
                // Add import statement
                const importLine = `import { AmountFieldComponent } from "../shared/amount-field/amount-field.component";`;
                newContent = newContent.replace(
                    /import { TextFieldComponent } from[^;]+;/,
                    `$&\n${importLine}`
                );

                // Add to declarations
                newContent = newContent.replace(
                    /(TextFieldComponent, \/\/ Re-added since FormFieldsModule is temporarily disabled)/,
                    `$1\n        AmountFieldComponent, // Re-added since FormFieldsModule is temporarily disabled`
                );

                changes.push('Added AmountFieldComponent');
                this.componentsAdded++;
            }

            // Add HamburgerMenuComponent directly instead of module
            if (!content.includes('HamburgerMenuComponent')) {
                // Add import statement
                const importLine = `import { HamburgerMenuComponent } from "../shared/header/components/hamburger-menu/hamburger-menu.component";`;
                newContent = newContent.replace(
                    /import { AmountFieldComponent } from[^;]+;/,
                    `$&\n${importLine}`
                );

                // Add to declarations
                newContent = newContent.replace(
                    /(AmountFieldComponent, \/\/ Re-added since FormFieldsModule is temporarily disabled)/,
                    `$1\n        HamburgerMenuComponent, // Re-added since HamburgerMenuModule has issues`
                );

                changes.push('Added HamburgerMenuComponent');
                this.componentsAdded++;
            }

            if (changes.length > 0) {
                fs.writeFileSync(filePath, newContent);
                this.fixedFiles++;
                console.log(`✅ Fixed VouchersModule`);
                changes.forEach(change => console.log(`   • ${change}`));
                return true;
            }

            return false;

        } catch (error) {
            console.error(`❌ Error fixing VouchersModule: ${error.message}`);
            return false;
        }
    }

    /**
     * Add missing form field components to other modules that need them
     */
    fixOtherModules() {
        const modulesToFix = [
            {
                path: './apps/web-giddh/src/app/voucher/voucher.module.ts',
                components: ['AmountFieldComponent']
            }
        ];

        modulesToFix.forEach(moduleInfo => {
            try {
                if (fs.existsSync(moduleInfo.path)) {
                    const content = fs.readFileSync(moduleInfo.path, 'utf8');
                    let newContent = content;
                    let changes = [];

                    moduleInfo.components.forEach(componentName => {
                        if (!content.includes(componentName)) {
                            // Determine import path based on component
                            let importPath = '';
                            if (componentName === 'AmountFieldComponent') {
                                importPath = '../shared/amount-field/amount-field.component';
                            }

                            if (importPath) {
                                // Add import statement
                                const importLine = `import { ${componentName} } from "${importPath}";`;
                                newContent = newContent.replace(
                                    /^(import[^;]+;)$/m,
                                    `$1\n${importLine}`
                                );

                                // Add to declarations if module has declarations
                                if (newContent.includes('declarations: [')) {
                                    newContent = newContent.replace(
                                        /(declarations:\s*\[)/,
                                        `$1\n        ${componentName},`
                                    );
                                }

                                changes.push(`Added ${componentName}`);
                                this.componentsAdded++;
                            }
                        }
                    });

                    if (changes.length > 0) {
                        fs.writeFileSync(moduleInfo.path, newContent);
                        this.fixedFiles++;
                        console.log(`✅ Fixed ${path.basename(moduleInfo.path)}`);
                        changes.forEach(change => console.log(`   • ${change}`));
                    }
                }
            } catch (error) {
                console.error(`❌ Error fixing ${moduleInfo.path}: ${error.message}`);
            }
        });
    }

    /**
     * Generate report
     */
    generateReport() {
        console.log('\n' + '='.repeat(60));
        console.log('🧩 COMPONENT IMPORT FIXER - REPORT');
        console.log('='.repeat(60));

        console.log(`📊 RESULTS:`);
        console.log(`   • Modules Fixed: ${this.fixedFiles}`);
        console.log(`   • Components Added: ${this.componentsAdded}`);

        if (this.fixedFiles > 0) {
            console.log(`\n✅ SUCCESS: Added missing components to resolve template errors!`);
            console.log(`🧩 Components now available for template binding`);
            console.log(`🚀 Template errors should be significantly reduced`);
        } else {
            console.log(`\nℹ️  No missing components found - all imports already present`);
        }

        console.log('='.repeat(60));
    }

    /**
     * Main execution
     */
    run() {
        console.log('🧩 Starting Component Import Fixer...');
        console.log('🔧 Adding missing components to resolve template errors...\n');

        // Fix VouchersModule
        this.fixVouchersModule();

        // Fix other modules
        this.fixOtherModules();

        // Generate report
        this.generateReport();

        return this.fixedFiles > 0;
    }
}

// Execute
const fixer = new ComponentImportFixer();
const success = fixer.run();
process.exit(success ? 0 : 1);
