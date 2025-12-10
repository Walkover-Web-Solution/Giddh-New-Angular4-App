#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Add Essential Form Components to modules missing FormFieldsModule
 */

class FormComponentAdder {
    constructor() {
        this.processedFiles = 0;
        this.fixedFiles = 0;
        this.componentsAdded = 0;
        
        // Essential form field components
        this.essentialComponents = [
            {
                name: 'TextFieldComponent',
                import: `import { TextFieldComponent } from "../theme/form-fields/text-field/text-field.component";`,
                altImport: `import { TextFieldComponent } from "../../theme/form-fields/text-field/text-field.component";`
            },
            {
                name: 'ReactiveDropdownFieldComponent', 
                import: `import { ReactiveDropdownFieldComponent } from "../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";`,
                altImport: `import { ReactiveDropdownFieldComponent } from "../../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";`
            },
            {
                name: 'InputFieldComponent',
                import: `import { InputFieldComponent } from "../theme/form-fields/input-field/input-field.component";`,
                altImport: `import { InputFieldComponent } from "../../theme/form-fields/input-field/input-field.component";`
            },
            {
                name: 'AmountFieldComponent',
                import: `import { AmountFieldComponent } from "../shared/amount-field/amount-field.component";`,
                altImport: `import { AmountFieldComponent } from "../../shared/amount-field/amount-field.component";`
            }
        ];
        
        // Modules that commonly need form components
        this.targetModules = [
            'vouchers.module.ts',
            'voucher.module.ts',
            'invoice.module.ts',
            'ledger.module.ts',
            'purchase.module.ts',
            'sales.module.ts',
            'vat-report.module.ts',
            'tax-authority.module.ts'
        ];
    }

    /**
     * Check if module needs form components
     */
    needsFormComponents(content, filePath) {
        // Check if FormFieldsModule is commented out
        const hasCommentedFormFields = content.includes('// FormFieldsModule') || 
                                      content.includes('FormFieldsModule, // Temporarily disabled');
        
        // Check if it's a target module
        const isTargetModule = this.targetModules.some(target => 
            path.basename(filePath) === target
        );
        
        // Check if it uses form field components in templates (heuristic)
        const usesFormComponents = content.includes('text-field') || 
                                  content.includes('reactive-dropdown-field') ||
                                  content.includes('input-field') ||
                                  content.includes('amount-field');
        
        return hasCommentedFormFields || isTargetModule || usesFormComponents;
    }

    /**
     * Determine correct import path based on file location
     */
    getCorrectImportPath(component, filePath) {
        const depth = filePath.split('/').length - 4; // Adjust based on project structure
        
        if (filePath.includes('/shared/') || filePath.includes('/theme/')) {
            return component.altImport;
        }
        return component.import;
    }

    /**
     * Add essential components to a module
     */
    addComponentsToModule(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            
            if (!this.needsFormComponents(content, filePath)) {
                return false;
            }
            
            let newContent = content;
            let changes = [];
            let hasChanges = false;

            // Add imports for missing components
            this.essentialComponents.forEach(component => {
                if (!newContent.includes(component.name)) {
                    const importPath = this.getCorrectImportPath(component, filePath);
                    
                    // Find the last import statement
                    const importMatches = newContent.match(/^import.*from.*['"];$/gm);
                    if (importMatches && importMatches.length > 0) {
                        const lastImport = importMatches[importMatches.length - 1];
                        newContent = newContent.replace(lastImport, `${lastImport}\n${importPath}`);
                        changes.push(`Added ${component.name} import`);
                        hasChanges = true;
                    }
                }
            });

            // Add to declarations if not present
            const declarationsMatch = newContent.match(/(declarations:\s*\[)([\s\S]*?)(\s*\])/);
            if (declarationsMatch) {
                let declarations = declarationsMatch[2];
                
                this.essentialComponents.forEach(component => {
                    if (!declarations.includes(component.name)) {
                        // Add component to declarations
                        if (declarations.trim()) {
                            declarations += `,\n        ${component.name} // Added since FormFieldsModule is disabled`;
                        } else {
                            declarations = `\n        ${component.name} // Added since FormFieldsModule is disabled\n    `;
                        }
                        changes.push(`Added ${component.name} to declarations`);
                        this.componentsAdded++;
                        hasChanges = true;
                    }
                });
                
                if (hasChanges) {
                    newContent = newContent.replace(
                        /(declarations:\s*\[)[\s\S]*?(\s*\])/,
                        `$1${declarations}$2`
                    );
                }
            }

            if (hasChanges) {
                fs.writeFileSync(filePath, newContent);
                this.fixedFiles++;
                
                console.log(`✅ Enhanced ${path.basename(filePath)}`);
                changes.forEach(change => {
                    console.log(`   • ${change}`);
                });
            }

            return hasChanges;

        } catch (error) {
            console.error(`❌ Error processing ${filePath}: ${error.message}`);
            return false;
        }
    }

    /**
     * Process all module files
     */
    processAllModules(dirPath) {
        try {
            const items = fs.readdirSync(dirPath);
            
            for (const item of items) {
                const fullPath = path.join(dirPath, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    if (!['node_modules', '.git', 'dist', '.angular', 'coverage'].includes(item)) {
                        this.processAllModules(fullPath);
                    }
                } else if (item.endsWith('.module.ts')) {
                    this.processedFiles++;
                    this.addComponentsToModule(fullPath);
                }
            }
        } catch (error) {
            console.error(`❌ Error processing directory ${dirPath}: ${error.message}`);
        }
    }

    /**
     * Generate report
     */
    generateReport() {
        console.log('\n' + '='.repeat(60));
        console.log('🧩 FORM COMPONENT ADDER - REPORT');
        console.log('='.repeat(60));
        
        console.log(`📊 RESULTS:`);
        console.log(`   • Modules Processed: ${this.processedFiles}`);
        console.log(`   • Modules Enhanced: ${this.fixedFiles}`);
        console.log(`   • Components Added: ${this.componentsAdded}`);
        
        if (this.fixedFiles > 0) {
            console.log(`\n✅ SUCCESS: Enhanced ${this.fixedFiles} modules with essential form components!`);
            console.log(`🧩 Added ${this.componentsAdded} component declarations`);
            console.log(`🚀 Form field templates should now work correctly`);
        } else {
            console.log(`\nℹ️  No modules needed form component enhancement`);
        }
        
        console.log('='.repeat(60));
    }

    /**
     * Main execution
     */
    run(targetPath = './apps/web-giddh/src') {
        console.log('🧩 Starting Form Component Adder...');
        console.log(`📁 Target: ${path.resolve(targetPath)}\n`);
        
        this.processAllModules(targetPath);
        this.generateReport();
        
        return this.fixedFiles > 0;
    }
}

// Execute
const adder = new FormComponentAdder();
const success = adder.run();
process.exit(success ? 0 : 1);
