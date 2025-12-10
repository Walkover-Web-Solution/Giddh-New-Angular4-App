#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to find and fix Angular components missing selector properties
 * This addresses a common pattern found during Angular 21 migration
 */

class SelectorFixer {
    constructor() {
        this.processedFiles = 0;
        this.fixedFiles = 0;
        this.errors = [];
        this.componentsFound = [];
        this.componentsFixed = [];
    }

    /**
     * Extract component name from file path for selector generation
     */
    generateSelectorFromPath(filePath) {
        const fileName = path.basename(filePath, '.component.ts');
        // Convert kebab-case to selector format
        return fileName.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
    }

    /**
     * Extract component class name from file content
     */
    extractComponentClassName(content) {
        const classMatch = content.match(/export\s+class\s+(\w+Component)/);
        return classMatch ? classMatch[1] : null;
    }

    /**
     * Check if component has selector property
     */
    hasSelector(decoratorContent) {
        return /selector\s*:\s*['"`]/.test(decoratorContent);
    }

    /**
     * Check if component has templateUrl property
     */
    hasTemplateUrl(decoratorContent) {
        return /templateUrl\s*:\s*['"`]/.test(decoratorContent);
    }

    /**
     * Extract @Component decorator content
     */
    extractComponentDecorator(content) {
        const decoratorRegex = /@Component\s*\(\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}\s*\)/s;
        const match = content.match(decoratorRegex);
        return match ? match[1] : null;
    }

    /**
     * Fix missing selector and templateUrl in component
     */
    fixComponent(filePath, content) {
        const decoratorMatch = content.match(/@Component\s*\(\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}\s*\)/s);
        if (!decoratorMatch) {
            return { fixed: false, reason: 'No @Component decorator found' };
        }

        const decoratorContent = decoratorMatch[1];
        const fullDecorator = decoratorMatch[0];

        const hasSelector = this.hasSelector(decoratorContent);
        const hasTemplateUrl = this.hasTemplateUrl(decoratorContent);

        if (hasSelector && hasTemplateUrl) {
            return { fixed: false, reason: 'Component already has selector and templateUrl' };
        }

        // Generate selector from file path
        const selector = this.generateSelectorFromPath(filePath);
        const componentName = this.extractComponentClassName(content);

        let newDecoratorContent = decoratorContent.trim();
        let changes = [];

        // Add selector if missing
        if (!hasSelector) {
            const selectorLine = `    selector: '${selector}',`;
            if (newDecoratorContent.length > 0) {
                newDecoratorContent = selectorLine + '\n' + newDecoratorContent;
            } else {
                newDecoratorContent = selectorLine;
            }
            changes.push('selector');
        }

        // Add templateUrl if missing
        if (!hasTemplateUrl) {
            const templateUrlLine = `    templateUrl: './${path.basename(filePath, '.ts')}.html',`;
            if (!hasSelector) {
                // If we added selector, add templateUrl after it
                newDecoratorContent = newDecoratorContent.replace(
                    `selector: '${selector}',`,
                    `selector: '${selector}',\n    ${templateUrlLine.trim()}`
                );
            } else {
                // Add templateUrl at the beginning
                if (newDecoratorContent.length > 0) {
                    newDecoratorContent = templateUrlLine + '\n' + newDecoratorContent;
                } else {
                    newDecoratorContent = templateUrlLine;
                }
            }
            changes.push('templateUrl');
        }

        // Reconstruct the full decorator
        const newFullDecorator = `@Component({\n${newDecoratorContent}\n})`;

        // Replace in content
        const newContent = content.replace(fullDecorator, newFullDecorator);

        return {
            fixed: true,
            changes: changes,
            newContent: newContent,
            selector: selector,
            componentName: componentName
        };
    }

    /**
     * Process a single TypeScript file
     */
    processFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');

            // Check if it's a component file
            if (!content.includes('@Component') || !content.includes('export class') || !filePath.endsWith('.component.ts')) {
                return;
            }

            this.processedFiles++;
            const componentName = this.extractComponentClassName(content);

            this.componentsFound.push({
                path: filePath,
                name: componentName
            });

            const result = this.fixComponent(filePath, content);

            if (result.fixed) {
                fs.writeFileSync(filePath, result.newContent);
                this.fixedFiles++;

                this.componentsFixed.push({
                    path: filePath,
                    name: result.componentName,
                    selector: result.selector,
                    changes: result.changes
                });

                console.log(`✅ Fixed ${filePath}`);
                console.log(`   Component: ${result.componentName}`);
                console.log(`   Selector: ${result.selector}`);
                console.log(`   Changes: ${result.changes.join(', ')}`);
                console.log('');
            } else {
                console.log(`ℹ️  Skipped ${filePath} - ${result.reason}`);
            }

        } catch (error) {
            this.errors.push({
                file: filePath,
                error: error.message
            });
            console.error(`❌ Error processing ${filePath}: ${error.message}`);
        }
    }

    /**
     * Recursively process directory
     */
    processDirectory(dirPath) {
        try {
            const items = fs.readdirSync(dirPath);

            for (const item of items) {
                const fullPath = path.join(dirPath, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    // Skip node_modules and other irrelevant directories
                    if (!['node_modules', '.git', 'dist', '.angular', 'coverage'].includes(item)) {
                        this.processDirectory(fullPath);
                    }
                } else if (item.endsWith('.component.ts')) {
                    this.processFile(fullPath);
                }
            }
        } catch (error) {
            console.error(`❌ Error processing directory ${dirPath}: ${error.message}`);
        }
    }

    /**
     * Generate summary report
     */
    generateReport() {
        console.log('\n' + '='.repeat(80));
        console.log('🎯 ANGULAR COMPONENT SELECTOR FIXER - SUMMARY REPORT');
        console.log('='.repeat(80));

        console.log(`📊 STATISTICS:`);
        console.log(`   • Components Found: ${this.componentsFound.length}`);
        console.log(`   • Components Fixed: ${this.fixedFiles}`);
        console.log(`   • Files Processed: ${this.processedFiles}`);
        console.log(`   • Errors: ${this.errors.length}`);

        if (this.componentsFixed.length > 0) {
            console.log(`\n✅ COMPONENTS FIXED:`);
            this.componentsFixed.forEach((comp, index) => {
                console.log(`   ${index + 1}. ${comp.name}`);
                console.log(`      Path: ${comp.path}`);
                console.log(`      Selector: ${comp.selector}`);
                console.log(`      Changes: ${comp.changes.join(', ')}`);
                console.log('');
            });
        }

        if (this.errors.length > 0) {
            console.log(`\n❌ ERRORS:`);
            this.errors.forEach((error, index) => {
                console.log(`   ${index + 1}. ${error.file}`);
                console.log(`      Error: ${error.error}`);
            });
        }

        console.log(`\n🎉 COMPLETION STATUS:`);
        if (this.fixedFiles > 0) {
            console.log(`   ✅ Successfully fixed ${this.fixedFiles} components!`);
            console.log(`   🔧 Added missing selectors and templateUrl properties`);
            console.log(`   📝 All changes follow Angular naming conventions`);
        } else {
            console.log(`   ℹ️  No components needed fixing - all selectors are present!`);
        }

        console.log('='.repeat(80));
    }

    /**
     * Main execution method
     */
    run(targetPath = './apps/web-giddh/src') {
        console.log('🚀 Starting Angular Component Selector Fixer...');
        console.log(`📁 Target Directory: ${path.resolve(targetPath)}`);
        console.log('🔍 Scanning for components missing selectors...\n');

        if (!fs.existsSync(targetPath)) {
            console.error(`❌ Target directory does not exist: ${targetPath}`);
            return;
        }

        this.processDirectory(targetPath);
        this.generateReport();
    }
}

// Execute the script
const targetDirectory = process.argv[2] || './apps/web-giddh/src';
const fixer = new SelectorFixer();
fixer.run(targetDirectory);
