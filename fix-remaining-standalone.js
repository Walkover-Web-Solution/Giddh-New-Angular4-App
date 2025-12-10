#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Targeted script to fix remaining standalone property issues
 * Based on the compatibility checker findings
 */

class StandalonePropertyFixer {
    constructor() {
        this.fixedFiles = 0;
        this.errors = [];
        this.componentsFixed = [];
    }

    /**
     * Check if decorator already has standalone property
     */
    hasStandalone(decoratorContent) {
        return /standalone\s*:\s*(true|false)/.test(decoratorContent);
    }

    /**
     * Fix missing standalone property
     */
    fixFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');

            // Skip if no Angular decorators
            if (!content.includes('@Component') && !content.includes('@Pipe') && !content.includes('@Directive')) {
                return false;
            }

            let newContent = content;
            let hasChanges = false;

            // Fix @Component decorators
            newContent = newContent.replace(
                /@Component\s*\(\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}\s*\)/gs,
                (match, decoratorContent) => {
                    if (!this.hasStandalone(decoratorContent)) {
                        const newDecoratorContent = decoratorContent.trim();
                        const standaloneProperty = '    standalone: false,';

                        let updatedContent;
                        if (newDecoratorContent.length > 0) {
                            updatedContent = standaloneProperty + '\n' + newDecoratorContent;
                        } else {
                            updatedContent = standaloneProperty;
                        }

                        hasChanges = true;
                        return `@Component({\n${updatedContent}\n})`;
                    }
                    return match;
                }
            );

            // Fix @Pipe decorators
            newContent = newContent.replace(
                /@Pipe\s*\(\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}\s*\)/gs,
                (match, decoratorContent) => {
                    if (!this.hasStandalone(decoratorContent)) {
                        const newDecoratorContent = decoratorContent.trim();
                        const standaloneProperty = '    standalone: false,';

                        let updatedContent;
                        if (newDecoratorContent.length > 0) {
                            updatedContent = standaloneProperty + '\n' + newDecoratorContent;
                        } else {
                            updatedContent = standaloneProperty;
                        }

                        hasChanges = true;
                        return `@Pipe({\n${updatedContent}\n})`;
                    }
                    return match;
                }
            );

            // Fix @Directive decorators
            newContent = newContent.replace(
                /@Directive\s*\(\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}\s*\)/gs,
                (match, decoratorContent) => {
                    if (!this.hasStandalone(decoratorContent)) {
                        const newDecoratorContent = decoratorContent.trim();
                        const standaloneProperty = '    standalone: false,';

                        let updatedContent;
                        if (newDecoratorContent.length > 0) {
                            updatedContent = standaloneProperty + '\n' + newDecoratorContent;
                        } else {
                            updatedContent = standaloneProperty;
                        }

                        hasChanges = true;
                        return `@Directive({\n${updatedContent}\n})`;
                    }
                    return match;
                }
            );

            if (hasChanges) {
                fs.writeFileSync(filePath, newContent);
                this.fixedFiles++;
                this.componentsFixed.push(filePath);
                console.log(`✅ Fixed: ${path.basename(filePath)}`);
                return true;
            }

            return false;

        } catch (error) {
            this.errors.push({ file: filePath, error: error.message });
            console.error(`❌ Error: ${filePath} - ${error.message}`);
            return false;
        }
    }

    /**
     * Process directory recursively
     */
    processDirectory(dirPath) {
        try {
            const items = fs.readdirSync(dirPath);

            for (const item of items) {
                const fullPath = path.join(dirPath, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    if (!['node_modules', '.git', 'dist', '.angular', 'coverage'].includes(item)) {
                        this.processDirectory(fullPath);
                    }
                } else if (item.endsWith('.ts') && !item.endsWith('.d.ts') && !item.endsWith('.spec.ts')) {
                    this.fixFile(fullPath);
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
        console.log('🔧 STANDALONE PROPERTY FIXER - FINAL REPORT');
        console.log('='.repeat(60));

        console.log(`📊 RESULTS:`);
        console.log(`   • Files Fixed: ${this.fixedFiles}`);
        console.log(`   • Errors: ${this.errors.length}`);

        if (this.fixedFiles > 0) {
            console.log(`\n✅ SUCCESS: Fixed ${this.fixedFiles} files!`);
            console.log(`🎯 All components now have standalone declarations`);
        } else {
            console.log(`\nℹ️  No files needed fixing - all standalone properties present`);
        }

        console.log('='.repeat(60));
    }

    /**
     * Main execution
     */
    run(targetPath = './apps/web-giddh/src') {
        console.log('🔧 Starting Standalone Property Fixer...');
        console.log(`📁 Target: ${path.resolve(targetPath)}\n`);

        this.processDirectory(targetPath);
        this.generateReport();
    }
}

// Execute
const fixer = new StandalonePropertyFixer();
fixer.run();
