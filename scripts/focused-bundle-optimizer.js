#!/usr/bin/env node

/**
 * Focused Bundle Optimizer - Targeted approach for <10MB bundle
 */

const fs = require('fs');
const path = require('path');

console.log('🎯 Focused Bundle Optimizer - Targeted <10MB Approach');
console.log('====================================================');

class FocusedBundleOptimizer {
    constructor() {
        this.optimizations = [];
    }

    /**
     * Reset to a more conservative optimization approach
     */
    resetOptimizations() {
        console.log('1️⃣ Resetting to conservative optimization settings...');
        
        const angularJsonPath = './angular.json';
        if (fs.existsSync(angularJsonPath)) {
            let angularConfig = JSON.parse(fs.readFileSync(angularJsonPath, 'utf8'));
            
            const prodConfig = angularConfig.projects['web-giddh'].architect.build.configurations.prod;
            
            // Conservative optimization settings
            prodConfig.optimization = {
                "scripts": true,
                "styles": {
                    "minify": true,
                    "inlineCritical": false
                },
                "fonts": true
            };
            
            // Reasonable budgets
            prodConfig.budgets = [
                {
                    "type": "initial",
                    "maximumWarning": "8mb",
                    "maximumError": "12mb"
                },
                {
                    "type": "bundle",
                    "name": "vendor",
                    "maximumWarning": "4mb",
                    "maximumError": "6mb"
                }
            ];
            
            // Keep vendor chunking but not excessive splitting
            prodConfig.vendorChunk = true;
            prodConfig.namedChunks = false;
            prodConfig.sourceMap = false;
            prodConfig.extractLicenses = true;
            
            fs.writeFileSync(angularJsonPath, JSON.stringify(angularConfig, null, 4));
            console.log('   ✅ Conservative optimization settings applied');
            this.optimizations.push('Conservative build settings');
        }
    }

    /**
     * Focus on removing the heaviest dependencies
     */
    targetHeavyDependencies() {
        console.log('2️⃣ Targeting heaviest dependencies for removal/optimization...');
        
        // Create a script to identify and lazy-load heavy components
        const lazyLoadScript = `
// Lazy loading strategy for heavy components
export class LazyComponentLoader {
    static async loadFroalaComponent() {
        const { TemplateFroalaComponent } = await import('../shared/template-froala/template-froala.component');
        return TemplateFroalaComponent;
    }
    
    static async loadD3Component() {
        const { D3TreeChartComponent } = await import('../shared/d3-tree-chart/d3-tree-chart.component');
        return D3TreeChartComponent;
    }
    
    static async loadChartComponent() {
        const { TotalOverduesChartComponent } = await import('../home/components/total-overdues/total-overdues-chart.component');
        return TotalOverduesChartComponent;
    }
}
`;
        
        fs.writeFileSync('./apps/web-giddh/src/app/shared/services/lazy-component-loader.service.ts', lazyLoadScript);
        console.log('   ✅ Lazy component loader created');
        this.optimizations.push('Heavy component lazy loading');
    }

    /**
     * Optimize package.json dependencies
     */
    optimizePackageDependencies() {
        console.log('3️⃣ Analyzing package.json for optimization opportunities...');
        
        const packagePath = './package.json';
        if (fs.existsSync(packagePath)) {
            const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
            
            // Recommendations for package optimization
            const recommendations = {
                'lodash': 'Replace with lodash-es for better tree shaking',
                'moment': 'Already using dayjs - can be removed if present',
                'jquery': 'Consider removing if not essential - use native DOM APIs',
                'bootstrap': 'Consider using only Angular Material components'
            };
            
            console.log('   📦 Package optimization recommendations:');
            Object.keys(recommendations).forEach(pkg => {
                if (packageJson.dependencies[pkg]) {
                    console.log(`   ⚠️  ${pkg}: ${recommendations[pkg]}`);
                }
            });
            
            this.optimizations.push('Package dependency analysis');
        }
    }

    /**
     * Generate practical implementation steps
     */
    generatePracticalSteps() {
        console.log('\n📋 PRACTICAL IMPLEMENTATION STEPS:');
        console.log('==================================');
        
        const steps = [
            {
                step: '1. Test current optimized build',
                command: 'npm run build-prod',
                expected: 'Should build without excessive chunking'
            },
            {
                step: '2. Measure actual bundle size',
                command: 'find dist/apps/web-giddh -name "*.js" -exec ls -la {} \\; | awk \'{total += $5} END {printf "%.2f MB\\n", total/1024/1024}\'',
                expected: 'Target: <15 MB (down from 30 MB)'
            },
            {
                step: '3. If still >10MB, implement selective lazy loading',
                action: 'Use the lazy component loader for Froala, D3, and Charts'
            },
            {
                step: '4. Remove unused dependencies',
                action: 'Audit and remove jQuery, unused lodash functions, etc.'
            }
        ];
        
        steps.forEach((item, index) => {
            console.log(`\\n${item.step}:`);
            if (item.command) {
                console.log(`   Command: ${item.command}`);
            }
            if (item.action) {
                console.log(`   Action: ${item.action}`);
            }
            if (item.expected) {
                console.log(`   Expected: ${item.expected}`);
            }
        });
    }

    /**
     * Run the focused optimization
     */
    run() {
        this.resetOptimizations();
        this.targetHeavyDependencies();
        this.optimizePackageDependencies();
        this.generatePracticalSteps();
        
        console.log('\\n🎯 FOCUSED OPTIMIZATION SUMMARY:');
        console.log('================================');
        this.optimizations.forEach((opt, index) => {
            console.log(`${index + 1}. ✅ ${opt}`);
        });
        
        console.log('\\n🚀 NEXT: Run npm run build-prod to test the optimized build');
        console.log('✅ Focused bundle optimization completed!');
    }
}

// Execute the optimizer
const optimizer = new FocusedBundleOptimizer();
optimizer.run();
