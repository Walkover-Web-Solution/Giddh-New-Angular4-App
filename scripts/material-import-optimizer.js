#!/usr/bin/env node
/**
 * Angular Material Import Optimizer
 * Converts barrel imports to specific module imports for better tree shaking
 */
const fs = require('fs');
const path = require('path');
class MaterialImportOptimizer {
    constructor() {
        this.processedFiles = 0;
        this.optimizedFiles = 0;
        this.totalSavings = 0;
    }
    /**
     * Find all TypeScript files that import Angular Material
     */
    findMaterialImports(dir, files = []) {
        try {
            const items = fs.readdirSync(dir);
            for (const item of items) {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                    if (!['node_modules', 'dist', '.git', '.angular', 'coverage'].includes(item)) {
                        this.findMaterialImports(fullPath, files);
                    }
                } else if (item.endsWith('.ts') && !item.endsWith('.d.ts')) {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    // Check for Angular Material barrel imports
                    if (content.includes('@angular/material') && !content.includes('@angular/material/')) {
                        files.push(fullPath);
                    }
                }
            }
        } catch (error) {
        }
        return files;
    }
    /**
     * Optimize Material imports in a file
     */
    optimizeFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            let optimizedContent = content;
            let optimizations = 0;
            // Material module mapping
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
                'MatSliderModule': '@angular/material/slider',
                'MatGridListModule': '@angular/material/grid-list',
                'MatBadgeModule': '@angular/material/badge',
                'MatBottomSheetModule': '@angular/material/bottom-sheet',
                'MatButtonToggleModule': '@angular/material/button-toggle',
                'MatDividerModule': '@angular/material/divider',
                'MatRippleModule': '@angular/material/core',
                'MatNativeDateModule': '@angular/material/core',
                'MatCommonModule': '@angular/material/core'
            };
            // Replace barrel imports with specific imports
            const barrelImportPattern = /import\s*\{\s*([^}]+)\s*\}\s*from\s*['"]@angular\/material['"];?\s*\n/g;
            optimizedContent = optimizedContent.replace(barrelImportPattern, (match, imports) => {
                const importList = imports.split(',').map(imp => imp.trim());
                const specificImports = [];
                importList.forEach(imp => {
                    if (moduleMap[imp]) {
                        specificImports.push(`import { ${imp} } from '${moduleMap[imp]}';`);
                    } else {
                        // Keep unknown imports as barrel import
                        specificImports.push(`import { ${imp} } from '@angular/material';`);
                    }
                });
                if (specificImports.length > 0) {
                    optimizations++;
                    return specificImports.join('\n') + '\n';
                }
                return match;
            });
            if (optimizations > 0) {
                fs.writeFileSync(filePath, optimizedContent, 'utf8');
                this.optimizedFiles++;
                this.totalSavings += optimizations;
            }
            this.processedFiles++;
            return optimizations;
        } catch (error) {
            return 0;
        }
    }
    /**
     * Run the optimization
     */
    run() {
        const targetDir = './apps/web-giddh/src';
        // Find files with Material imports
        const filesToOptimize = this.findMaterialImports(targetDir);
        // Optimize each file
        filesToOptimize.forEach(filePath => {
            this.optimizeFile(filePath);
        });
        // Generate report
    }
}
// Execute the optimizer
const optimizer = new MaterialImportOptimizer();
optimizer.run();
