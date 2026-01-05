#!/usr/bin/env node

/**
 * Tree Shaking Optimizer Script
 * Optimizes imports and enables better tree shaking for reduced bundle sizes
 */

const fs = require('fs');
const path = require('path');

console.log('🌲 Tree Shaking Optimization - Improving Import Efficiency');
console.log('=========================================================');

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
     */
    findTypeScriptFiles(dir, tsFiles = []) {
        try {
            const files = fs.readdirSync(dir);

            for (const file of files) {
                const fullPath = path.join(dir, file);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    if (!['node_modules', 'dist', '.git', '.angular', 'coverage'].includes(file)) {
                        this.findTypeScriptFiles(fullPath, tsFiles);
                    }
                } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
                    tsFiles.push(fullPath);
                }
            }
        } catch (error) {
            this.errors.push(`Error reading directory ${dir}: ${error.message}`);
        }

        return tsFiles;
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
                console.log(`${action} ${path.relative(process.cwd(), filePath)} (${optimizations} optimizations)`);
            }

            this.processedFiles++;

        } catch (error) {
            this.errors.push(`Error processing file ${filePath}: ${error.message}`);
        }
    }

    /**
     * Optimize lodash imports for better tree shaking
     */
    optimizeLodashImports(content) {
        let optimizedContent = content;
        let count = 0;

        // Convert default lodash imports to specific imports
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
                const specificImports = Array.from(usedMethods).map(method => method).join(', ');
                optimizedContent = optimizedContent.replace(
                    lodashDefaultPattern,
                    `import { ${specificImports} } from 'lodash';\n`
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
                            'MatSortModule': '@angular/material/sort'
                        };
                        
                        return moduleMap[imp] ? `import { ${imp} } from '${moduleMap[imp]}';` : null;
                    }).filter(Boolean);

                    if (specificImports.length > 0) {
                        optimizedContent = optimizedContent.replace(match, specificImports.join('\n') + '\n');
                        count++;
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
                        count++;
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
            console.log(`   Found ${matches.length} potential barrel imports to review manually`);
        }

        return { content: optimizedContent, count };
    }

    /**
     * Generate webpack configuration for better tree shaking
     */
    generateWebpackConfig() {
        const webpackConfig = `
// webpack.config.js - Tree Shaking Optimizations
const path = require('path');

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
            console.log('✅ Generated webpack tree-shaking configuration');
        } else {
            console.log('[DRY RUN] Would generate webpack tree-shaking configuration');
        }
    }

    /**
     * Generate package.json optimizations
     */
    generatePackageOptimizations() {
        console.log('\n📦 Package.json Optimizations for Tree Shaking:');
        console.log('===============================================');
        
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

        console.log('Recommended package.json additions:');
        console.log(JSON.stringify(optimizations, null, 2));
    }

    /**
     * Generate summary report
     */
    generateReport() {
        console.log('\n📊 TREE SHAKING OPTIMIZATION REPORT:');
        console.log('====================================');
        console.log(`📄 Total files processed: ${this.processedFiles}`);
        console.log(`✅ Files optimized: ${this.modifiedFiles}`);
        console.log(`🌲 Total optimizations applied: ${this.totalOptimizations}`);
        
        if (this.dryRun) {
            console.log('\n🔍 DRY RUN MODE - No files were actually modified');
            console.log('Run without --dry-run to apply changes');
        }

        if (this.errors.length > 0) {
            console.log(`\n❌ Errors encountered: ${this.errors.length}`);
            this.errors.forEach(error => console.log(`   ${error}`));
        }

        console.log('\n💡 TREE SHAKING BEST PRACTICES:');
        console.log('===============================');
        console.log('1. Use specific imports instead of barrel imports');
        console.log('2. Prefer ES modules over CommonJS');
        console.log('3. Mark packages as side-effect free in package.json');
        console.log('4. Use webpack-bundle-analyzer to verify optimizations');
        console.log('5. Avoid importing entire libraries when only using specific functions');
        
        if (this.totalOptimizations > 0) {
            console.log('\n📝 NEXT STEPS:');
            console.log('1. Test the application to ensure functionality is intact');
            console.log('2. Run bundle analyzer to measure size improvements');
            console.log('3. Update build configuration with webpack optimizations');
            console.log('4. Monitor bundle sizes in CI/CD pipeline');
            console.log('5. Establish import guidelines for the team');
        }
    }

    /**
     * Main execution function
     */
    run(targetDirectory = './apps/web-giddh/src') {
        console.log(`📁 Target directory: ${targetDirectory}`);
        console.log(`🔍 Mode: ${this.dryRun ? 'DRY RUN' : 'OPTIMIZE'}`);
        console.log('');

        if (!fs.existsSync(targetDirectory)) {
            console.error(`❌ Target directory does not exist: ${targetDirectory}`);
            return;
        }

        // Find all TypeScript files
        console.log('🔍 Finding TypeScript files...');
        const tsFiles = this.findTypeScriptFiles(targetDirectory);
        console.log(`📄 Found ${tsFiles.length} TypeScript files to process`);
        console.log('');

        // Process each file
        console.log('🌲 Optimizing imports for tree shaking...');
        for (const filePath of tsFiles) {
            this.optimizeImports(filePath);
        }

        // Generate additional configurations
        this.generateWebpackConfig();
        this.generatePackageOptimizations();

        // Generate report
        this.generateReport();

        console.log('\n✅ Tree shaking optimization completed!');
    }
}

// Execute the script
const optimizer = new TreeShakingOptimizer();

// Get target directory from command line argument or use default
const targetDir = process.argv.find(arg => !arg.startsWith('--') && arg !== __filename && arg !== 'node') || './apps/web-giddh/src';
optimizer.run(targetDir);
