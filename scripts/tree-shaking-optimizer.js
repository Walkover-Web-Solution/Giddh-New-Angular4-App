#!/usr/bin/env node
/**
 * Tree Shaking Optimizer Script
 * Optimizes imports and enables better tree shaking for reduced bundle sizes
 */
const fs = require('fs');
const path = require('path');
const { optimizeLodashImports: optimizeLodashImportsUtil } = require('./lodash-optimizer-utils');
const { MATERIAL_MODULE_MAP } = require('./material-module-map');
const { findTypeScriptFiles: findTypeScriptFilesUtil } = require('./file-finder-utils');
class TreeShakingOptimizer {
    constructor() {
        this.processedFiles = 0;
        this.modifiedFiles = 0;
        this.totalOptimizations = 0;
        this.errors = [];
        this.dryRun = process.argv.includes('--dry-run');
        this.verbose = process.argv.includes('--verbose');
    }
    /**
     * Find TypeScript files for optimization
     * Uses shared utility for consistent file discovery
     */
    findTypeScriptFiles(dir, tsFiles = []) {
        return findTypeScriptFilesUtil(dir, tsFiles);
    }
    /**
     * Optimize imports in a TypeScript file
     */
    optimizeImports(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            let optimizedContent = content;
            let optimizations = 0;
            // Optimize lodash imports
            const lodashOptimizations = this.optimizeLodashImports(optimizedContent);
            optimizedContent = lodashOptimizations.content;
            optimizations += lodashOptimizations.count;
            // Optimize Angular Material imports
            const materialOptimizations = this.optimizeMaterialImports(optimizedContent);
            optimizedContent = materialOptimizations.content;
            optimizations += materialOptimizations.count;
            // Optimize RxJS imports
            const rxjsOptimizations = this.optimizeRxJSImports(optimizedContent);
            optimizedContent = rxjsOptimizations.content;
            optimizations += rxjsOptimizations.count;
            // Optimize barrel imports
            const barrelOptimizations = this.optimizeBarrelImports(optimizedContent);
            optimizedContent = barrelOptimizations.content;
            optimizations += barrelOptimizations.count;
            // Write back if changes were made
            if (optimizations > 0) {
                if (!this.dryRun) {
                    fs.writeFileSync(filePath, optimizedContent, 'utf8');
                }
                this.modifiedFiles++;
                this.totalOptimizations += optimizations;
                const action = this.dryRun ? '[DRY RUN]' : '✅';
            }
            this.processedFiles++;
        } catch (error) {
            this.errors.push(`Error processing file ${filePath}: ${error.message}`);
        }
    }
    /**
     * Optimize lodash imports for better tree shaking
     * Uses shared utility with 'lodash' package
     */
    optimizeLodashImports(content) {
        return optimizeLodashImportsUtil(content, 'lodash');
    }
    /**
     * Optimize Angular Material imports
     */
    optimizeMaterialImports(content) {
        let optimizedContent = content;
        let count = 0;
        // Convert barrel imports to specific module imports
        const materialBarrelPattern = /import\s+\{([^}]+)\}\s+from\s+['"]@angular\/material['"];?\s*\n/g;
        const matches = optimizedContent.match(materialBarrelPattern);
        if (matches) {
            matches.forEach(match => {
                const importsMatch = match.match(/\{([^}]+)\}/);
                if (importsMatch) {
                    const imports = importsMatch[1].split(',').map(imp => imp.trim());
                    const specificImports = imports.map(imp => {
                        return MATERIAL_MODULE_MAP[imp] ? `import { ${imp} } from '${MATERIAL_MODULE_MAP[imp]}';` : null;
                    }).filter(Boolean);
                    if (specificImports.length > 0) {
                        optimizedContent = optimizedContent.replace(match, specificImports.join('\n') + '\n');
                        count += 1;
                    }
                }
            });
        }
        return { content: optimizedContent, count };
    }
    /**
     * Optimize RxJS imports
     */
    optimizeRxJSImports(content) {
        let optimizedContent = content;
        let count = 0;
        // Convert RxJS barrel imports to specific imports
        const rxjsBarrelPattern = /import\s+\{([^}]+)\}\s+from\s+['"]rxjs['"];?\s*\n/g;
        const operatorBarrelPattern = /import\s+\{([^}]+)\}\s+from\s+['"]rxjs\/operators['"];?\s*\n/g;
        // Optimize main RxJS imports
        const rxjsMatches = optimizedContent.match(rxjsBarrelPattern);
        if (rxjsMatches) {
            rxjsMatches.forEach(match => {
                const importsMatch = match.match(/\{([^}]+)\}/);
                if (importsMatch) {
                    const imports = importsMatch[1].split(',').map(imp => imp.trim());
                    const specificImports = imports.map(imp => {
                        const moduleMap = {
                            'Observable': 'rxjs',
                            'Subject': 'rxjs',
                            'BehaviorSubject': 'rxjs',
                            'ReplaySubject': 'rxjs',
                            'of': 'rxjs',
                            'from': 'rxjs',
                            'merge': 'rxjs',
                            'combineLatest': 'rxjs',
                            'forkJoin': 'rxjs'
                        };
                        return moduleMap[imp] ? `import { ${imp} } from '${moduleMap[imp]}';` : null;
                    }).filter(Boolean);
                    if (specificImports.length > 0) {
                        optimizedContent = optimizedContent.replace(match, specificImports.join('\n') + '\n');
                        count += 1;
                    }
                }
            });
        }
        return { content: optimizedContent, count };
    }
    /**
     * Optimize barrel imports from local modules
     */
    optimizeBarrelImports(content) {
        let optimizedContent = content;
        let count = 0;
        // Look for potential barrel imports that could be optimized
        const barrelPattern = /import\s+\{([^}]+)\}\s+from\s+['"]\.\/[^'"]*index['"];?\s*\n/g;
        const matches = optimizedContent.match(barrelPattern);
        if (matches) {
            // This is a placeholder - in a real implementation, you'd need to analyze
            // the actual barrel files to determine the specific module paths
        }
        return { content: optimizedContent, count };
    }
    /**
     * Generate webpack configuration for better tree shaking
     */
    generateWebpackConfig() {
        const webpackConfig = `
// webpack.config.js - Tree Shaking Optimizations
import path from 'path';
module.exports = {
  mode: 'production',
  optimization: {
    usedExports: true,
    sideEffects: false,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\\\/]node_modules[\\\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10
        },
        lodash: {
          test: /[\\\\/]node_modules[\\\\/]lodash/,
          name: 'lodash',
          chunks: 'all',
          priority: 20
        },
        material: {
          test: /[\\\\/]node_modules[\\\\/]@angular[\\\\/]material/,
          name: 'angular-material',
          chunks: 'all',
          priority: 15
        }
      }
    }
  },
  resolve: {
    alias: {
      'lodash': 'lodash-es' // Use ES modules version for better tree shaking
    }
  }
};`;
        const configPath = path.join(process.cwd(), 'webpack.tree-shaking.config.js');
        if (!this.dryRun) {
            fs.writeFileSync(configPath, webpackConfig);
        } else {
        }
    }
    /**
     * Generate package.json optimizations
     */
    generatePackageOptimizations() {
        const optimizations = {
            "sideEffects": false,
            "dependencies": {
                "lodash-es": "^4.17.21", // ES modules version
                "@angular/material": "^20.2.14" // Already using specific imports
            },
            "devDependencies": {
                "webpack-bundle-analyzer": "^4.9.0" // For bundle analysis
            }
        };
    }
    /**
     * Generate summary report
     */
    generateReport() {
        if (this.dryRun) {
        }
        if (this.errors.length > 0) {
            // Error reporting removed for production
        }
        if (this.totalOptimizations > 0) {
        }
    }
    /**
     * Main execution function
     */
    run(targetDirectory = './apps/web-giddh/src') {
        if (!fs.existsSync(targetDirectory)) {
            return;
        }
        // Find all TypeScript files
        const tsFiles = this.findTypeScriptFiles(targetDirectory);
        // Process each file
        for (const filePath of tsFiles) {
            this.optimizeImports(filePath);
        }
        // Generate additional configurations
        this.generateWebpackConfig();
        this.generatePackageOptimizations();
        // Generate report
        this.generateReport();
    }
}
// Execute the script
const optimizer = new TreeShakingOptimizer();
// Get target directory from command line argument or use default
const targetDir = process.argv.find(arg => !arg.startsWith('--') && arg !== __filename && arg !== 'node') || './apps/web-giddh/src';
optimizer.run(targetDir);
