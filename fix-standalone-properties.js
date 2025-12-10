#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to find and fix Angular components, pipes, and directives missing standalone properties
 * This addresses Angular 21 compatibility requirements for explicit standalone declarations
 */

class StandaloneFixer {
    constructor() {
        this.processedFiles = 0;
        this.fixedFiles = 0;
        this.errors = [];
        this.componentsFound = [];
        this.componentsFixed = [];
        this.skippedFiles = [];

        // Statistics by type
        this.stats = {
            components: { found: 0, fixed: 0, skipped: 0 },
            pipes: { found: 0, fixed: 0, skipped: 0 },
            directives: { found: 0, fixed: 0, skipped: 0 }
        };
    }

    /**
     * Extract decorator content and type
     */
    extractDecoratorInfo(content) {
        const decorators = [];

        // Match @Component decorators
        const componentRegex = /@Component\s*\(\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}\s*\)/gs;
        let match;
        while ((match = componentRegex.exec(content)) !== null) {
            decorators.push({
                type: 'component',
                fullMatch: match[0],
                decoratorContent: match[1],
                startIndex: match.index
            });
        }

        // Match @Pipe decorators
        const pipeRegex = /@Pipe\s*\(\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}\s*\)/gs;
        while ((match = pipeRegex.exec(content)) !== null) {
            decorators.push({
                type: 'pipe',
                fullMatch: match[0],
                decoratorContent: match[1],
                startIndex: match.index
            });
        }

        // Match @Directive decorators
        const directiveRegex = /@Directive\s*\(\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}\s*\)/gs;
        while ((match = directiveRegex.exec(content)) !== null) {
            decorators.push({
                type: 'directive',
                fullMatch: match[0],
                decoratorContent: match[1],
                startIndex: match.index
            });
        }

        return decorators;
    }

    /**
     * Check if decorator has standalone property
     */
    hasStandalone(decoratorContent) {
        return /standalone\s*:\s*(true|false)/.test(decoratorContent);
    }

    /**
     * Extract class name from content
     */
    extractClassName(content, decoratorType) {
        const patterns = {
            component: /export\s+class\s+(\w+Component)/,
            pipe: /export\s+class\s+(\w+Pipe)/,
            directive: /export\s+class\s+(\w+Directive)/
        };

        const pattern = patterns[decoratorType] || /export\s+class\s+(\w+)/;
        const match = content.match(pattern);
        return match ? match[1] : null;
    }

    /**
     * Determine if component should be standalone based on context
     */
    shouldBeStandalone(filePath, decoratorContent, className) {
        // Check for indicators that suggest standalone: true
        const standaloneIndicators = [
            /imports\s*:\s*\[/, // Has imports array
            /CommonModule/, // Imports CommonModule
            /FormsModule/, // Imports FormsModule
            /ReactiveFormsModule/, // Imports ReactiveFormsModule
            /Mat\w+Module/ // Imports Material modules
        ];

        // Check for indicators that suggest standalone: false (NgModule-based)
        const ngModuleIndicators = [
            filePath.includes('/shared/'), // Shared components often in modules
            filePath.includes('/theme/'), // Theme components often in modules
            className && className.includes('Dialog'), // Dialog components often in modules
            className && className.includes('Modal') // Modal components often in modules
        ];

        // Check if decorator content suggests standalone
        const hasImports = standaloneIndicators.some(indicator => indicator.test(decoratorContent));
        const suggestsNgModule = ngModuleIndicators.some(indicator => indicator);

        // Default strategy: Use standalone: false for NgModule-based architecture
        // This is safer for large existing applications
        if (hasImports && !suggestsNgModule) {
            return true; // standalone: true
        }

        return false; // standalone: false (default for NgModule-based apps)
    }

    /**
     * Fix missing standalone property in decorator
     */
    fixStandaloneProperty(decoratorInfo, filePath, className) {
        const { decoratorContent, fullMatch, type } = decoratorInfo;

        if (this.hasStandalone(decoratorContent)) {
            return {
                fixed: false,
                reason: `${type} already has standalone property`
            };
        }

        const shouldBeStandalone = this.shouldBeStandalone(filePath, decoratorContent, className);
        const standaloneValue = shouldBeStandalone ? 'true' : 'false';

        // Add standalone property
        let newDecoratorContent = decoratorContent.trim();
        const standaloneProperty = `    standalone: ${standaloneValue},`;

        // Find the best place to insert standalone property
        if (newDecoratorContent.length > 0) {
            // Try to insert after selector if it exists
            if (/selector\s*:\s*['"`]/.test(newDecoratorContent)) {
                newDecoratorContent = newDecoratorContent.replace(
                    /(selector\s*:\s*['"`][^'"`]*['"`],?)/,
                    `$1\n    ${standaloneProperty.trim()}`
                );
            } else {
                // Insert at the beginning
                newDecoratorContent = standaloneProperty + '\n' + newDecoratorContent;
            }
        } else {
            newDecoratorContent = standaloneProperty;
        }

        // Reconstruct the full decorator
        const decoratorName = type.charAt(0).toUpperCase() + type.slice(1);
        const newFullDecorator = `@${decoratorName}({\n${newDecoratorContent}\n})`;

        return {
            fixed: true,
            newDecorator: newFullDecorator,
            standaloneValue: standaloneValue,
            oldDecorator: fullMatch
        };
    }

    /**
     * Process a single TypeScript file
     */
    processFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');

            // Check if it's an Angular file with decorators
            if (!content.includes('@Component') && !content.includes('@Pipe') && !content.includes('@Directive')) {
                return;
            }

            this.processedFiles++;
            const decorators = this.extractDecoratorInfo(content);

            if (decorators.length === 0) {
                return;
            }

            let newContent = content;
            let fileFixed = false;
            const fixedDecorators = [];

            // Process decorators in reverse order to maintain string indices
            decorators.reverse().forEach(decoratorInfo => {
                const className = this.extractClassName(content, decoratorInfo.type);

                this.componentsFound.push({
                    path: filePath,
                    name: className,
                    type: decoratorInfo.type
                });

                this.stats[decoratorInfo.type].found++;

                const result = this.fixStandaloneProperty(decoratorInfo, filePath, className);

                if (result.fixed) {
                    newContent = newContent.replace(result.oldDecorator, result.newDecorator);
                    fileFixed = true;

                    fixedDecorators.push({
                        name: className,
                        type: decoratorInfo.type,
                        standaloneValue: result.standaloneValue
                    });

                    this.stats[decoratorInfo.type].fixed++;
                } else {
                    this.skippedFiles.push({
                        path: filePath,
                        name: className,
                        type: decoratorInfo.type,
                        reason: result.reason
                    });

                    this.stats[decoratorInfo.type].skipped++;
                }
            });

            if (fileFixed) {
                fs.writeFileSync(filePath, newContent);
                this.fixedFiles++;

                this.componentsFixed.push({
                    path: filePath,
                    decorators: fixedDecorators
                });

                console.log(`✅ Fixed ${filePath}`);
                fixedDecorators.forEach(decorator => {
                    console.log(`   ${decorator.type}: ${decorator.name} → standalone: ${decorator.standaloneValue}`);
                });
                console.log('');
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
                } else if (item.endsWith('.ts') && !item.endsWith('.d.ts') && !item.endsWith('.spec.ts')) {
                    this.processFile(fullPath);
                }
            }
        } catch (error) {
            console.error(`❌ Error processing directory ${dirPath}: ${error.message}`);
        }
    }

    /**
     * Generate comprehensive report
     */
    generateReport() {
        console.log('\n' + '='.repeat(80));
        console.log('🎯 ANGULAR STANDALONE PROPERTY FIXER - COMPREHENSIVE REPORT');
        console.log('='.repeat(80));

        console.log(`📊 OVERALL STATISTICS:`);
        console.log(`   • Files Processed: ${this.processedFiles}`);
        console.log(`   • Files Fixed: ${this.fixedFiles}`);
        console.log(`   • Errors: ${this.errors.length}`);

        console.log(`\n📈 BREAKDOWN BY TYPE:`);
        Object.entries(this.stats).forEach(([type, stats]) => {
            console.log(`   ${type.toUpperCase()}:`);
            console.log(`     • Found: ${stats.found}`);
            console.log(`     • Fixed: ${stats.fixed}`);
            console.log(`     • Skipped: ${stats.skipped}`);
        });

        if (this.componentsFixed.length > 0) {
            console.log(`\n✅ FILES FIXED (${this.componentsFixed.length}):`);
            this.componentsFixed.slice(0, 20).forEach((file, index) => {
                console.log(`   ${index + 1}. ${path.basename(file.path)}`);
                file.decorators.forEach(decorator => {
                    console.log(`      ${decorator.type}: ${decorator.name} → standalone: ${decorator.standaloneValue}`);
                });
            });

            if (this.componentsFixed.length > 20) {
                console.log(`   ... and ${this.componentsFixed.length - 20} more files`);
            }
        }

        if (this.errors.length > 0) {
            console.log(`\n❌ ERRORS (${this.errors.length}):`);
            this.errors.forEach((error, index) => {
                console.log(`   ${index + 1}. ${error.file}`);
                console.log(`      Error: ${error.error}`);
            });
        }

        console.log(`\n🎯 STRATEGY APPLIED:`);
        console.log(`   • Default: standalone: false (NgModule-based architecture)`);
        console.log(`   • Exception: standalone: true (when imports array detected)`);
        console.log(`   • Approach: Conservative for large existing applications`);

        console.log(`\n🎉 COMPLETION STATUS:`);
        if (this.fixedFiles > 0) {
            console.log(`   ✅ Successfully processed ${this.fixedFiles} files!`);
            console.log(`   🔧 Added missing standalone properties`);
            console.log(`   📝 Applied Angular 21 compatibility standards`);
            console.log(`   🏗️  Maintained NgModule-based architecture`);
        } else {
            console.log(`   ℹ️  No files needed fixing - all standalone properties are present!`);
        }

        console.log('='.repeat(80));
    }

    /**
     * Main execution method
     */
    run(targetPath = './apps/web-giddh/src') {
        console.log('🚀 Starting Angular Standalone Property Fixer...');
        console.log(`📁 Target Directory: ${path.resolve(targetPath)}`);
        console.log('🔍 Scanning for components, pipes, and directives missing standalone properties...\n');

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
const fixer = new StandaloneFixer();
fixer.run(targetDirectory);
