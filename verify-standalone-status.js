#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to verify standalone property status across the entire Angular project
 * Provides comprehensive analysis of Angular 21 compatibility
 */

class StandaloneVerifier {
    constructor() {
        this.results = {
            components: { total: 0, withStandalone: 0, withoutStandalone: 0, standaloneTrue: 0, standaloneFalse: 0 },
            pipes: { total: 0, withStandalone: 0, withoutStandalone: 0, standaloneTrue: 0, standaloneFalse: 0 },
            directives: { total: 0, withStandalone: 0, withoutStandalone: 0, standaloneTrue: 0, standaloneFalse: 0 }
        };
        this.filesProcessed = 0;
        this.missingStandalone = [];
        this.standaloneTrue = [];
        this.standaloneFalse = [];
    }

    /**
     * Analyze a single file for Angular decorators and standalone properties
     */
    analyzeFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');

            // Skip if no Angular decorators
            if (!content.includes('@Component') && !content.includes('@Pipe') && !content.includes('@Directive')) {
                return;
            }

            this.filesProcessed++;

            // Analyze @Component decorators
            this.analyzeDecorator(content, filePath, 'component', /@Component\s*\(\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}\s*\)/gs);

            // Analyze @Pipe decorators
            this.analyzeDecorator(content, filePath, 'pipe', /@Pipe\s*\(\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}\s*\)/gs);

            // Analyze @Directive decorators
            this.analyzeDecorator(content, filePath, 'directive', /@Directive\s*\(\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}\s*\)/gs);

        } catch (error) {
            console.error(`❌ Error analyzing ${filePath}: ${error.message}`);
        }
    }

    /**
     * Analyze specific decorator type
     */
    analyzeDecorator(content, filePath, type, regex) {
        let match;
        while ((match = regex.exec(content)) !== null) {
            this.results[type].total++;

            const decoratorContent = match[1];
            const standaloneMatch = decoratorContent.match(/standalone\s*:\s*(true|false)/);

            const className = this.extractClassName(content, type);
            const fileInfo = {
                path: filePath,
                name: className,
                type: type
            };

            if (standaloneMatch) {
                this.results[type].withStandalone++;
                const standaloneValue = standaloneMatch[1] === 'true';

                if (standaloneValue) {
                    this.results[type].standaloneTrue++;
                    this.standaloneTrue.push({ ...fileInfo, standalone: true });
                } else {
                    this.results[type].standaloneFalse++;
                    this.standaloneFalse.push({ ...fileInfo, standalone: false });
                }
            } else {
                this.results[type].withoutStandalone++;
                this.missingStandalone.push(fileInfo);
            }
        }
    }

    /**
     * Extract class name from content
     */
    extractClassName(content, type) {
        const patterns = {
            component: /export\s+class\s+(\w+Component)/,
            pipe: /export\s+class\s+(\w+Pipe)/,
            directive: /export\s+class\s+(\w+Directive)/
        };

        const pattern = patterns[type] || /export\s+class\s+(\w+)/;
        const match = content.match(pattern);
        return match ? match[1] : 'Unknown';
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
                    if (!['node_modules', '.git', 'dist', '.angular', 'coverage'].includes(item)) {
                        this.processDirectory(fullPath);
                    }
                } else if (item.endsWith('.ts') && !item.endsWith('.d.ts') && !item.endsWith('.spec.ts')) {
                    this.analyzeFile(fullPath);
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
        console.log('📊 ANGULAR STANDALONE PROPERTY VERIFICATION REPORT');
        console.log('='.repeat(80));

        console.log(`📁 Files Processed: ${this.filesProcessed}`);

        console.log(`\n📈 DETAILED BREAKDOWN:`);

        Object.entries(this.results).forEach(([type, stats]) => {
            const total = stats.total;
            const withStandalone = stats.withStandalone;
            const withoutStandalone = stats.withoutStandalone;
            const coverage = total > 0 ? ((withStandalone / total) * 100).toFixed(1) : '0.0';

            console.log(`\n${type.toUpperCase()}S:`);
            console.log(`   • Total Found: ${total}`);
            console.log(`   • With standalone: ${withStandalone} (${coverage}%)`);
            console.log(`   • Without standalone: ${withoutStandalone}`);
            console.log(`   • standalone: true: ${stats.standaloneTrue}`);
            console.log(`   • standalone: false: ${stats.standaloneFalse}`);
        });

        // Calculate totals
        const totalItems = Object.values(this.results).reduce((sum, stats) => sum + stats.total, 0);
        const totalWithStandalone = Object.values(this.results).reduce((sum, stats) => sum + stats.withStandalone, 0);
        const totalWithoutStandalone = Object.values(this.results).reduce((sum, stats) => sum + stats.withoutStandalone, 0);
        const totalStandaloneTrue = Object.values(this.results).reduce((sum, stats) => sum + stats.standaloneTrue, 0);
        const totalStandaloneFalse = Object.values(this.results).reduce((sum, stats) => sum + stats.standaloneFalse, 0);

        console.log(`\n🎯 OVERALL SUMMARY:`);
        console.log(`   • Total Angular Items: ${totalItems}`);
        console.log(`   • With standalone property: ${totalWithStandalone} (${totalItems > 0 ? ((totalWithStandalone / totalItems) * 100).toFixed(1) : '0.0'}%)`);
        console.log(`   • Without standalone property: ${totalWithoutStandalone}`);
        console.log(`   • standalone: true: ${totalStandaloneTrue}`);
        console.log(`   • standalone: false: ${totalStandaloneFalse}`);

        if (this.missingStandalone.length > 0) {
            console.log(`\n❌ MISSING STANDALONE PROPERTY (${this.missingStandalone.length}):`);
            this.missingStandalone.slice(0, 10).forEach((item, index) => {
                console.log(`   ${index + 1}. ${item.type}: ${item.name}`);
                console.log(`      Path: ${item.path}`);
            });
            if (this.missingStandalone.length > 10) {
                console.log(`   ... and ${this.missingStandalone.length - 10} more`);
            }
        }

        if (this.standaloneTrue.length > 0) {
            console.log(`\n✅ STANDALONE: TRUE (${this.standaloneTrue.length}):`);
            this.standaloneTrue.slice(0, 5).forEach((item, index) => {
                console.log(`   ${index + 1}. ${item.type}: ${item.name}`);
            });
            if (this.standaloneTrue.length > 5) {
                console.log(`   ... and ${this.standaloneTrue.length - 5} more`);
            }
        }

        console.log(`\n🏗️  ARCHITECTURE ANALYSIS:`);
        const ngModulePercentage = totalItems > 0 ? ((totalStandaloneFalse / totalItems) * 100).toFixed(1) : '0.0';
        const standalonePercentage = totalItems > 0 ? ((totalStandaloneTrue / totalItems) * 100).toFixed(1) : '0.0';

        console.log(`   • NgModule-based (standalone: false): ${totalStandaloneFalse} (${ngModulePercentage}%)`);
        console.log(`   • Standalone-based (standalone: true): ${totalStandaloneTrue} (${standalonePercentage}%)`);

        if (parseFloat(ngModulePercentage) > 80) {
            console.log(`   • Architecture: Primarily NgModule-based ✅`);
        } else if (parseFloat(standalonePercentage) > 80) {
            console.log(`   • Architecture: Primarily Standalone-based ✅`);
        } else {
            console.log(`   • Architecture: Hybrid (NgModule + Standalone) ✅`);
        }

        console.log(`\n🎉 ANGULAR 21 COMPATIBILITY STATUS:`);
        if (totalWithoutStandalone === 0) {
            console.log(`   ✅ FULLY COMPATIBLE: All components have explicit standalone declarations!`);
            console.log(`   🎯 Ready for Angular 21 production deployment`);
            console.log(`   📝 No action required - excellent compliance!`);
        } else {
            console.log(`   ⚠️  NEEDS ATTENTION: ${totalWithoutStandalone} items missing standalone property`);
            console.log(`   🔧 Run the standalone fixer script to complete compatibility`);
        }

        console.log('='.repeat(80));
    }

    /**
     * Main execution method
     */
    run(targetPath = './apps/web-giddh/src') {
        console.log('🔍 Starting Angular Standalone Property Verification...');
        console.log(`📁 Target Directory: ${path.resolve(targetPath)}`);
        console.log('📊 Analyzing Angular 21 compatibility...\n');

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
const verifier = new StandaloneVerifier();
verifier.run(targetDirectory);
