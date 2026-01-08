#!/usr/bin/env node
/**
 * Advanced Bundle Optimizer
 * Implements lazy loading and import optimizations for large libraries
 */
const fs = require('fs');
const path = require('path');
class AdvancedBundleOptimizer {
    constructor() {
        this.processedFiles = 0;
        this.optimizedFiles = 0;
        this.totalOptimizations = 0;
        this.dryRun = process.argv.includes('--dry-run');
    }
    /**
     * Find files that import large libraries
     */
    findFilesWithLargeImports(dir, files = []) {
        try {
            const items = fs.readdirSync(dir);
            for (const item of items) {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                    if (!['node_modules', 'dist', '.git', '.angular', 'coverage'].includes(item)) {
                        this.findFilesWithLargeImports(fullPath, files);
                    }
                } else if (item.endsWith('.ts') && !item.endsWith('.d.ts')) {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    // Check for large library imports
                    if (this.hasLargeLibraryImports(content)) {
                        files.push(fullPath);
                    }
                }
            }
        } catch (error) {
        }
        return files;
    }
    /**
     * Check if file has imports from large libraries
     */
    hasLargeLibraryImports(content) {
        const largeLibraryPatterns = [
            /import.*from\s+['"]froala-editor/,
            /import.*from\s+['"]chart\.js/,
            /import.*from\s+['"]d3/,
            /import.*from\s+['"]@angular\/material['"](?!\/)/,
            /import.*from\s+['"]lodash['"]/,
            /import.*from\s+['"]jquery/
        ];
        return largeLibraryPatterns.some(pattern => pattern.test(content));
    }
    /**
     * Optimize imports in a file
     */
    optimizeFileImports(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            let optimizedContent = content;
            let optimizations = 0;
            // Optimize Angular Material imports
            const materialOptimizations = this.optimizeAngularMaterialImports(optimizedContent);
            optimizedContent = materialOptimizations.content;
            optimizations += materialOptimizations.count;
            // Optimize lodash imports
            const lodashOptimizations = this.optimizeLodashImports(optimizedContent);
            optimizedContent = lodashOptimizations.content;
            optimizations += lodashOptimizations.count;
            // Add dynamic imports for heavy libraries
            const dynamicImportOptimizations = this.addDynamicImports(optimizedContent, filePath);
            optimizedContent = dynamicImportOptimizations.content;
            optimizations += dynamicImportOptimizations.count;
            if (optimizations > 0) {
                if (!this.dryRun) {
                    fs.writeFileSync(filePath, optimizedContent, 'utf8');
                }
                this.optimizedFiles++;
                this.totalOptimizations += optimizations;
                const action = this.dryRun ? '[DRY RUN]' : '✅';
            }
            this.processedFiles++;
            return optimizations;
        } catch (error) {
            return 0;
        }
    }
    /**
     * Optimize Angular Material imports to specific modules
     */
    optimizeAngularMaterialImports(content) {
        let optimizedContent = content;
        let count = 0;
        // Replace barrel imports with specific imports
        const barrelImportPattern = /import\s*\{\s*([^}]+)\s*\}\s*from\s*['"]@angular\/material['"];?/g;
        optimizedContent = optimizedContent.replace(barrelImportPattern, (match, imports) => {
            const importList = imports.split(',').map(imp => imp.trim());
            const specificImports = [];
            const moduleMap = {
                'MatButtonModule': '@angular/material/button',
                'MatCardModule': '@angular/material/card',
                'MatFormFieldModule': '@angular/material/form-field',
                'MatInputModule': '@angular/material/input',
                'MatSelectModule': '@angular/material/select',
                'MatDialogModule': '@angular/material/dialog',
                'MatIconModule': '@angular/material/icon',
                'MatToolbarModule': '@angular/material/toolbar',
                'MatSidenavModule': '@angular/material/sidenav',
                'MatListModule': '@angular/material/list',
                'MatTableModule': '@angular/material/table',
                'MatPaginatorModule': '@angular/material/paginator',
                'MatSortModule': '@angular/material/sort',
                'MatCheckboxModule': '@angular/material/checkbox',
                'MatRadioModule': '@angular/material/radio',
                'MatSlideToggleModule': '@angular/material/slide-toggle',
                'MatProgressSpinnerModule': '@angular/material/progress-spinner',
                'MatProgressBarModule': '@angular/material/progress-bar',
                'MatSnackBarModule': '@angular/material/snack-bar',
                'MatTooltipModule': '@angular/material/tooltip',
                'MatMenuModule': '@angular/material/menu',
                'MatTabsModule': '@angular/material/tabs',
                'MatStepperModule': '@angular/material/stepper',
                'MatExpansionModule': '@angular/material/expansion',
                'MatChipsModule': '@angular/material/chips',
                'MatAutocompleteModule': '@angular/material/autocomplete',
                'MatDatepickerModule': '@angular/material/datepicker',
                'MatSliderModule': '@angular/material/slider'
            };
            importList.forEach(imp => {
                if (moduleMap[imp]) {
                    specificImports.push(`import { ${imp} } from '${moduleMap[imp]}';`);
                } else {
                    // Keep unknown imports as is
                    specificImports.push(`import { ${imp} } from '@angular/material';`);
                }
            });
            if (specificImports.length > 0) {
                count++;
                return specificImports.join('\n');
            }
            return match;
        });
        return { content: optimizedContent, count };
    }
    /**
     * Optimize lodash imports for better tree shaking
     */
    optimizeLodashImports(content) {
        let optimizedContent = content;
        let count = 0;
        // Replace default lodash import with specific imports
        const lodashDefaultPattern = /import\s+_\s+from\s+['"]lodash['"];?\s*\n/g;
        if (lodashDefaultPattern.test(optimizedContent)) {
            // Find lodash usage patterns
            const lodashUsagePattern = /_\.(\w+)/g;
            const usedMethods = new Set();
            let match;
            while ((match = lodashUsagePattern.exec(optimizedContent)) !== null) {
                usedMethods.add(match[1]);
            }
            if (usedMethods.size > 0) {
                // Replace with specific imports
                const specificImports = Array.from(usedMethods).map(method => method).join(', ');
                optimizedContent = optimizedContent.replace(
                    lodashDefaultPattern,
                    `import { ${specificImports} } from 'lodash-es';\n`
                );
                // Update usage from _.method to method
                usedMethods.forEach(method => {
                    const usagePattern = new RegExp(`_\\.${method}`, 'g');
                    optimizedContent = optimizedContent.replace(usagePattern, method);
                });
                count++;
            }
        }
        return { content: optimizedContent, count };
    }
    /**
     * Add dynamic imports for heavy libraries
     */
    addDynamicImports(content, filePath) {
        let optimizedContent = content;
        let count = 0;
        // Only apply to specific component types that use heavy libraries
        if (filePath.includes('froala') || content.includes('FroalaEditor')) {
            // Convert Froala imports to dynamic imports
            const froalaImportPattern = /import.*from\s+['"]froala-editor[^'"]*['"];?\s*\n/g;
            if (froalaImportPattern.test(optimizedContent)) {
                // Add dynamic import method
                const dynamicImportMethod = `
    private async loadFroalaEditor() {
        if (!this.froalaEditorLoaded) {
            const froalaModule = await import('froala-editor');
            this.froalaEditorLoaded = true;
            return froalaModule;
        }
    }`;
                // Remove static imports
                optimizedContent = optimizedContent.replace(froalaImportPattern, '');
                // Add dynamic import method before the last closing brace
                const lastBraceIndex = optimizedContent.lastIndexOf('}');
                if (lastBraceIndex > -1) {
                    optimizedContent = optimizedContent.slice(0, lastBraceIndex) + 
                                    dynamicImportMethod + '\n' + 
                                    optimizedContent.slice(lastBraceIndex);
                }
                count++;
            }
        }
        return { content: optimizedContent, count };
    }
    /**
     * Generate optimization report
     */
    generateReport() {
        if (this.dryRun) {
        }
    }
    /**
     * Main execution
     */
    run() {
        const targetDir = './apps/web-giddh/src';
        // Find files with large library imports
        const filesToOptimize = this.findFilesWithLargeImports(targetDir);
        // Optimize each file
        filesToOptimize.forEach(filePath => {
            this.optimizeFileImports(filePath);
        });
        // Generate report
        this.generateReport();
    }
}
// Execute the optimizer
const optimizer = new AdvancedBundleOptimizer();
optimizer.run();
