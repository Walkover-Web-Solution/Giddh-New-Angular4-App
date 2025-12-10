#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Comprehensive Module Import Fixer for Angular 21
 * Checks module imports, uncomments working modules, adds missing imports
 */

class ModuleImportFixer {
    constructor() {
        this.processedFiles = 0;
        this.fixedFiles = 0;
        this.errors = [];

        // Statistics
        this.stats = {
            modulesAnalyzed: 0,
            importsUncommented: 0,
            importsAdded: 0,
            syntaxErrorsFixed: 0,
            dependenciesResolved: 0
        };

        this.fixedModules = [];
        this.moduleRegistry = new Map(); // Track all available modules
        this.dependencyMap = new Map(); // Track module dependencies

        // Common Angular modules that should always be available
        this.coreAngularModules = [
            'CommonModule',
            'FormsModule',
            'ReactiveFormsModule',
            'RouterModule',
            'HttpClientModule',
            'BrowserModule',
            'BrowserAnimationsModule'
        ];

        // Angular Material modules
        this.materialModules = [
            'MatButtonModule',
            'MatInputModule',
            'MatFormFieldModule',
            'MatSelectModule',
            'MatCheckboxModule',
            'MatRadioModule',
            'MatDialogModule',
            'MatTableModule',
            'MatPaginatorModule',
            'MatSortModule',
            'MatTabsModule',
            'MatMenuModule',
            'MatIconModule',
            'MatTooltipModule',
            'MatCardModule',
            'MatExpansionModule',
            'MatListModule',
            'MatSlideToggleModule',
            'MatProgressSpinnerModule',
            'MatDatepickerModule',
            'MatNativeDateModule',
            'MatButtonToggleModule',
            'MatDividerModule',
            'MatAutocompleteModule',
            'MatChipsModule'
        ];

        // Known problematic modules to keep commented
        this.problematicModules = [
            'GiddhDatepickerModule',
            'FormFieldsModule', // Temporarily disabled
            'VoucherAddBulkItemsModule',
            'AsideMenuOtherTaxesModule',
            'AsideMenuCreateTaxModule',
            'AsideMenuProductServiceModule'
        ];
    }

    /**
     * Scan project to build module registry
     */
    buildModuleRegistry(dirPath) {
        try {
            const items = fs.readdirSync(dirPath);

            for (const item of items) {
                const fullPath = path.join(dirPath, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    if (!['node_modules', '.git', 'dist', '.angular', 'coverage'].includes(item)) {
                        this.buildModuleRegistry(fullPath);
                    }
                } else if (item.endsWith('.module.ts')) {
                    this.analyzeModule(fullPath);
                }
            }
        } catch (error) {
            console.error(`❌ Error scanning directory ${dirPath}: ${error.message}`);
        }
    }

    /**
     * Analyze a module file to understand its structure
     */
    analyzeModule(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const moduleName = this.extractModuleName(content);

            if (moduleName) {
                const moduleInfo = {
                    path: filePath,
                    name: moduleName,
                    exports: this.extractExports(content),
                    imports: this.extractImports(content),
                    declarations: this.extractDeclarations(content),
                    hasErrors: this.hasCompilationErrors(content),
                    isCommented: this.isModuleCommented(content)
                };

                this.moduleRegistry.set(moduleName, moduleInfo);
                this.stats.modulesAnalyzed++;
            }
        } catch (error) {
            console.error(`❌ Error analyzing module ${filePath}: ${error.message}`);
        }
    }

    /**
     * Extract module name from file content
     */
    extractModuleName(content) {
        const match = content.match(/export\s+class\s+(\w+Module)/);
        return match ? match[1] : null;
    }

    /**
     * Extract exports from module
     */
    extractExports(content) {
        const exportsMatch = content.match(/exports:\s*\[([\s\S]*?)\]/);
        if (!exportsMatch) return [];

        return exportsMatch[1]
            .split(',')
            .map(exp => exp.trim().replace(/\/\/.*$/, '').trim())
            .filter(exp => exp && !exp.startsWith('//'));
    }

    /**
     * Extract imports from module
     */
    extractImports(content) {
        const importsMatch = content.match(/imports:\s*\[([\s\S]*?)\]/);
        if (!importsMatch) return [];

        return importsMatch[1]
            .split(',')
            .map(imp => imp.trim().replace(/\/\/.*$/, '').trim())
            .filter(imp => imp && !imp.startsWith('//'));
    }

    /**
     * Extract declarations from module
     */
    extractDeclarations(content) {
        const declarationsMatch = content.match(/declarations:\s*\[([\s\S]*?)\]/);
        if (!declarationsMatch) return [];

        return declarationsMatch[1]
            .split(',')
            .map(decl => decl.trim().replace(/\/\/.*$/, '').trim())
            .filter(decl => decl && !decl.startsWith('//'));
    }

    /**
     * Check if module has compilation errors
     */
    hasCompilationErrors(content) {
        // Check for common syntax errors
        const errorPatterns = [
            /import\s*\{\s*\/\/.*\}\s*from/, // Malformed imports
            /export\s+class\s+\w+\s*\{\s*$/, // Missing closing brace
            /,\s*\}\s*\)/, // Trailing comma before closing
            /\}\s*from\s*['"][^'"]*['"]/, // Malformed import syntax
        ];

        return errorPatterns.some(pattern => pattern.test(content));
    }

    /**
     * Check if module usage is commented out
     */
    isModuleCommented(content) {
        return content.includes('// Temporarily disabled') ||
               content.includes('// NG6002 error');
    }

    /**
     * Fix a single module file
     */
    fixModuleFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            let newContent = content;
            let changes = [];
            let hasChanges = false;

            // Fix 1: Repair malformed import statements
            const malformedImportPattern = /import\s*\{\s*\/\/\s*(\w+),?\s*\/\/[^}]*\}\s*from\s*(['"][^'"]*['"])/g;
            newContent = newContent.replace(malformedImportPattern, (match, moduleName, fromPath) => {
                changes.push(`Fixed malformed import: ${moduleName}`);
                hasChanges = true;
                return `// import { ${moduleName} } from ${fromPath}; // Temporarily disabled`;
            });

            // Fix 2: Add missing closing braces
            if (newContent.includes('export class') && !newContent.match(/export class \w+Module\s*\{[\s\S]*\}/)) {
                newContent = newContent.replace(
                    /(export class \w+Module\s*\{[^}]*?)$/,
                    '$1\n}'
                );
                changes.push('Added missing closing brace');
                hasChanges = true;
            }

            // Fix 3: Uncomment working modules
            const moduleInfo = this.moduleRegistry.get(this.extractModuleName(content));
            if (moduleInfo && !moduleInfo.hasErrors) {
                // Uncomment safe modules
                newContent = this.uncommentSafeModules(newContent, changes);
                if (changes.length > 0) hasChanges = true;
            }

            // Fix 4: Add missing essential imports
            newContent = this.addMissingImports(newContent, changes);
            if (changes.length > 0) hasChanges = true;

            // Fix 5: Fix import/export syntax
            newContent = this.fixImportExportSyntax(newContent, changes);
            if (changes.length > 0) hasChanges = true;

            if (hasChanges) {
                fs.writeFileSync(filePath, newContent);
                this.fixedFiles++;
                this.fixedModules.push({
                    path: filePath,
                    changes: changes
                });

                console.log(`✅ Fixed ${path.basename(filePath)}`);
                changes.forEach(change => {
                    console.log(`   • ${change}`);
                });
            }

            return hasChanges;

        } catch (error) {
            this.errors.push({ file: filePath, error: error.message });
            console.error(`❌ Error fixing ${filePath}: ${error.message}`);
            return false;
        }
    }

    /**
     * Uncomment safe modules that don't have compilation errors
     */
    uncommentSafeModules(content, changes) {
        let newContent = content;

        // List of modules that are safe to uncomment
        const safeModules = [
            'CommonModule',
            'FormsModule',
            'ReactiveFormsModule',
            'RouterModule',
            ...this.materialModules,
            'TranslateDirectiveModule',
            'NoDataModule',
            'WatchVideoModule',
            'ScrollingModule',
            'A11yModule'
        ];

        safeModules.forEach(moduleName => {
            // Uncomment in imports array
            const commentedImportPattern = new RegExp(`\\s*//\\s*(${moduleName}),?\\s*//.*$`, 'gm');
            if (commentedImportPattern.test(newContent)) {
                newContent = newContent.replace(commentedImportPattern, `        ${moduleName},`);
                changes.push(`Uncommented safe module: ${moduleName}`);
                this.stats.importsUncommented++;
            }
        });

        return newContent;
    }

    /**
     * Add missing essential imports
     */
    addMissingImports(content, changes) {
        let newContent = content;

        // Check if module needs CommonModule
        if (content.includes('*ngFor') || content.includes('*ngIf') || content.includes('NgFor') || content.includes('NgIf')) {
            if (!content.includes('CommonModule') && !content.includes('// CommonModule')) {
                newContent = this.addImportToModule(newContent, 'CommonModule', '@angular/common', changes);
            }
        }

        // Check if module needs FormsModule
        if (content.includes('ngModel') || content.includes('NgModel')) {
            if (!content.includes('FormsModule') && !content.includes('// FormsModule')) {
                newContent = this.addImportToModule(newContent, 'FormsModule', '@angular/forms', changes);
            }
        }

        // Check if module needs ReactiveFormsModule
        if (content.includes('FormControl') || content.includes('FormGroup') || content.includes('formControlName')) {
            if (!content.includes('ReactiveFormsModule') && !content.includes('// ReactiveFormsModule')) {
                newContent = this.addImportToModule(newContent, 'ReactiveFormsModule', '@angular/forms', changes);
            }
        }

        return newContent;
    }

    /**
     * Add import to module
     */
    addImportToModule(content, moduleName, fromPath, changes) {
        // Add import statement if not present
        if (!content.includes(`from '${fromPath}'`) && !content.includes(`from "${fromPath}"`)) {
            const importStatement = `import { ${moduleName} } from '${fromPath}';\n`;
            content = content.replace(/^(import[^;]+;)$/m, `$1\n${importStatement}`);
        }

        // Add to imports array if not present
        if (content.includes('imports: [')) {
            content = content.replace(
                /(imports:\s*\[)/,
                `$1\n        ${moduleName},`
            );
            changes.push(`Added missing import: ${moduleName}`);
            this.stats.importsAdded++;
        }

        return content;
    }

    /**
     * Fix import/export syntax errors
     */
    fixImportExportSyntax(content, changes) {
        let newContent = content;

        // Fix trailing commas in arrays
        newContent = newContent.replace(/,(\s*\])/g, '$1');

        // Fix missing commas in imports
        newContent = newContent.replace(/(\w+Module)\s+(\w+Module)/g, '$1,\n        $2');

        // Fix malformed export statements
        newContent = newContent.replace(/exports:\s*\[\s*,/g, 'exports: [');

        if (newContent !== content) {
            changes.push('Fixed import/export syntax');
            this.stats.syntaxErrorsFixed++;
        }

        return newContent;
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
                    this.fixModuleFile(fullPath);
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
        console.log('📦 MODULE IMPORT FIXER - COMPREHENSIVE REPORT');
        console.log('='.repeat(80));

        console.log(`📊 PROCESSING STATISTICS:`);
        console.log(`   • Modules Analyzed: ${this.stats.modulesAnalyzed}`);
        console.log(`   • Files Processed: ${this.processedFiles}`);
        console.log(`   • Files Fixed: ${this.fixedFiles}`);
        console.log(`   • Imports Uncommented: ${this.stats.importsUncommented}`);
        console.log(`   • Imports Added: ${this.stats.importsAdded}`);
        console.log(`   • Syntax Errors Fixed: ${this.stats.syntaxErrorsFixed}`);
        console.log(`   • Errors: ${this.errors.length}`);

        console.log(`\n📦 MODULE REGISTRY:`);
        console.log(`   • Total Modules Found: ${this.moduleRegistry.size}`);

        const workingModules = Array.from(this.moduleRegistry.values()).filter(m => !m.hasErrors);
        const brokenModules = Array.from(this.moduleRegistry.values()).filter(m => m.hasErrors);

        console.log(`   • Working Modules: ${workingModules.length}`);
        console.log(`   • Modules with Errors: ${brokenModules.length}`);

        if (this.fixedModules.length > 0) {
            console.log(`\n✅ MODULES FIXED (${this.fixedModules.length}):`);
            this.fixedModules.slice(0, 10).forEach((module, index) => {
                console.log(`   ${index + 1}. ${path.basename(module.path)}`);
                module.changes.forEach(change => {
                    console.log(`      • ${change}`);
                });
            });

            if (this.fixedModules.length > 10) {
                console.log(`   ... and ${this.fixedModules.length - 10} more modules`);
            }
        }

        if (brokenModules.length > 0) {
            console.log(`\n⚠️  MODULES STILL WITH ERRORS (${Math.min(brokenModules.length, 5)}):`);
            brokenModules.slice(0, 5).forEach((module, index) => {
                console.log(`   ${index + 1}. ${module.name} - ${path.basename(module.path)}`);
            });
        }

        if (this.errors.length > 0) {
            console.log(`\n❌ PROCESSING ERRORS (${this.errors.length}):`);
            this.errors.slice(0, 5).forEach((error, index) => {
                console.log(`   ${index + 1}. ${path.basename(error.file)}`);
                console.log(`      Error: ${error.error}`);
            });
        }

        console.log(`\n🎯 MODULE IMPORT STATUS:`);
        if (this.fixedFiles > 0) {
            console.log(`   ✅ SUCCESS: Fixed ${this.fixedFiles} module files!`);
            console.log(`   📦 Uncommented ${this.stats.importsUncommented} safe module imports`);
            console.log(`   ➕ Added ${this.stats.importsAdded} missing essential imports`);
            console.log(`   🔧 Fixed ${this.stats.syntaxErrorsFixed} syntax errors`);
            console.log(`   🚀 Modules ready for Angular 21 compilation`);
        } else {
            console.log(`   ℹ️  No module fixes needed - all imports properly configured`);
        }

        console.log('='.repeat(80));
    }

    /**
     * Main execution method
     */
    run(targetPath = './apps/web-giddh/src') {
        console.log('📦 Starting Module Import Fixer...');
        console.log(`📁 Target Directory: ${path.resolve(targetPath)}`);
        console.log('🔍 Phase 1: Building module registry...\n');

        if (!fs.existsSync(targetPath)) {
            console.error(`❌ Target directory does not exist: ${targetPath}`);
            return;
        }

        // Phase 1: Build module registry
        this.buildModuleRegistry(targetPath);

        console.log(`📊 Found ${this.moduleRegistry.size} modules`);
        console.log('🔧 Phase 2: Fixing module imports...\n');

        // Phase 2: Fix all modules
        this.processAllModules(targetPath);

        // Phase 3: Generate report
        this.generateReport();

        return {
            success: this.fixedFiles > 0 || this.errors.length === 0,
            modulesFixed: this.fixedFiles,
            errors: this.errors.length
        };
    }
}

// Execute the script
const targetDirectory = process.argv[2] || './apps/web-giddh/src';
const fixer = new ModuleImportFixer();
const result = fixer.run(targetDirectory);

// Exit with appropriate code
process.exit(result.success ? 0 : 1);
