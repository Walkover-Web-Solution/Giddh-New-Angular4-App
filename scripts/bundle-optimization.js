#!/usr/bin/env node

/**
 * Bundle Size Optimization Script
 * Analyzes and optimizes Angular bundle sizes for better performance
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Bundle Size Optimization Analysis');
console.log('====================================');

/**
 * Analyze current angular.json for optimization opportunities
 */
function analyzeBundleConfiguration() {
    const angularJsonPath = path.join(__dirname, '..', 'angular.json');
    
    if (!fs.existsSync(angularJsonPath)) {
        console.error('❌ angular.json not found');
        return;
    }

    const angularConfig = JSON.parse(fs.readFileSync(angularJsonPath, 'utf8'));
    const webGiddhConfig = angularConfig.projects['web-giddh'];
    
    console.log('📊 Current Bundle Configuration Analysis:');
    console.log('==========================================');
    
    // Analyze build configurations
    Object.keys(webGiddhConfig.architect.build.configurations).forEach(config => {
        const buildConfig = webGiddhConfig.architect.build.configurations[config];
        console.log(`\n🔧 ${config.toUpperCase()} Configuration:`);
        console.log(`   Optimization: ${JSON.stringify(buildConfig.optimization)}`);
        console.log(`   Vendor Chunk: ${buildConfig.vendorChunk}`);
        console.log(`   Source Maps: ${buildConfig.sourceMap}`);
        console.log(`   Output Hashing: ${buildConfig.outputHashing}`);
        
        if (buildConfig.budgets) {
            console.log(`   Bundle Budgets:`);
            buildConfig.budgets.forEach(budget => {
                console.log(`     ${budget.type}: Warning ${budget.maximumWarning}, Error ${budget.maximumError}`);
            });
        }
    });
}

/**
 * Generate optimized angular.json configuration
 */
function generateOptimizedConfiguration() {
    console.log('\n🔧 Generating Optimized Bundle Configuration...');
    
    const optimizations = {
        // Production optimizations
        prod: {
            optimization: {
                scripts: true,
                styles: {
                    minify: true,
                    inlineCritical: true
                },
                fonts: true
            },
            outputHashing: 'all',
            sourceMap: false,
            extractLicenses: true,
            vendorChunk: true,
            namedChunks: false,
            budgets: [
                {
                    type: 'initial',
                    maximumWarning: '10mb',
                    maximumError: '15mb'
                },
                {
                    type: 'bundle',
                    name: 'vendor',
                    maximumWarning: '5mb',
                    maximumError: '7mb'
                },
                {
                    type: 'anyComponentStyle',
                    maximumWarning: '6kb',
                    maximumError: '10kb'
                }
            ]
        },
        
        // Staging optimizations
        stage: {
            optimization: {
                scripts: true,
                styles: {
                    minify: true,
                    inlineCritical: false
                },
                fonts: true
            },
            outputHashing: 'all',
            sourceMap: false,
            extractLicenses: true,
            vendorChunk: true,
            budgets: [
                {
                    type: 'initial',
                    maximumWarning: '12mb',
                    maximumError: '18mb'
                }
            ]
        },
        
        // Local development (minimal optimization for fast builds)
        local: {
            optimization: false,
            outputHashing: 'none',
            sourceMap: true,
            extractLicenses: false,
            vendorChunk: false
        }
    };
    
    console.log('✅ Optimization recommendations generated');
    return optimizations;
}

/**
 * Analyze package.json for bundle optimization opportunities
 */
function analyzePackageDependencies() {
    console.log('\n📦 Dependency Analysis for Bundle Optimization:');
    console.log('===============================================');
    
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const largeDependencies = [
        '@angular/animations',
        '@angular/material',
        'froala-editor',
        'chart.js',
        'd3',
        'jquery'
    ];
    
    console.log('🔍 Large Dependencies Found:');
    largeDependencies.forEach(dep => {
        if (packageJson.dependencies[dep]) {
            console.log(`   ✓ ${dep}: ${packageJson.dependencies[dep]}`);
        }
    });
    
    // Suggest optimizations
    console.log('\n💡 Bundle Optimization Recommendations:');
    console.log('1. Enable tree-shaking for lodash imports');
    console.log('2. Use Angular Material modules selectively');
    console.log('3. Lazy load Froala editor only when needed');
    console.log('4. Consider Chart.js alternatives for smaller bundle');
    console.log('5. Implement dynamic imports for large libraries');
}

/**
 * Generate webpack optimization configuration
 */
function generateWebpackOptimizations() {
    console.log('\n⚙️  Webpack Optimization Suggestions:');
    console.log('====================================');
    
    const webpackOptimizations = `
// Add to angular.json customWebpackConfig or webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\\\/]node_modules[\\\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10
        },
        material: {
          test: /[\\\\/]node_modules[\\\\/]@angular[\\\\/]material/,
          name: 'angular-material',
          chunks: 'all',
          priority: 20
        },
        froala: {
          test: /[\\\\/]node_modules[\\\\/]froala-editor/,
          name: 'froala',
          chunks: 'async',
          priority: 15
        }
      }
    }
  }
};`;
    
    console.log(webpackOptimizations);
}

/**
 * Main execution
 */
function main() {
    try {
        analyzeBundleConfiguration();
        generateOptimizedConfiguration();
        analyzePackageDependencies();
        generateWebpackOptimizations();
        
        console.log('\n🎉 Bundle Optimization Analysis Complete!');
        console.log('\n📋 Next Steps:');
        console.log('1. Review the optimization recommendations above');
        console.log('2. Update angular.json with suggested configurations');
        console.log('3. Implement selective imports for large libraries');
        console.log('4. Run bundle analyzer: npm run bundle:report');
        console.log('5. Test build sizes after optimizations');
        
    } catch (error) {
        console.error('❌ Bundle optimization analysis failed:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = {
    analyzeBundleConfiguration,
    generateOptimizedConfiguration,
    analyzePackageDependencies,
    generateWebpackOptimizations
};
