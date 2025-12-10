#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Comprehensive Angular 21 Compatibility Checker
 * Processes modules in batches of 10 and identifies compatibility issues
 */

class Angular21CompatibilityChecker {
    constructor() {
        this.batchSize = 10;
        this.currentBatch = 1;
        this.totalModules = 0;
        this.processedModules = 0;
        this.totalIssues = 0;

        // Issue categories
        this.issues = {
            critical: [],
            warning: [],
            info: []
        };

        // Statistics
        this.stats = {
            modulesProcessed: 0,
            componentsChecked: 0,
            templatesChecked: 0,
            servicesChecked: 0,
            pipesChecked: 0,
            directivesChecked: 0
        };

        // Angular 21 compatibility patterns
        this.compatibilityPatterns = {
            // Critical issues
            critical: [
                {
                    pattern: /HttpClientModule/g,
                    message: 'HttpClientModule is deprecated - use provideHttpClient()',
                    type: 'HttpClient Migration'
                },
                {
                    pattern: /@Component\s*\(\s*\{[^}]*\}\s*\)\s*(?!.*standalone\s*:)/s,
                    message: 'Component missing standalone property',
                    type: 'Standalone Declaration'
                },
                {
                    pattern: /@Pipe\s*\(\s*\{[^}]*\}\s*\)\s*(?!.*standalone\s*:)/s,
                    message: 'Pipe missing standalone property',
                    type: 'Standalone Declaration'
                },
                {
                    pattern: /@Directive\s*\(\s*\{[^}]*\}\s*\)\s*(?!.*standalone\s*:)/s,
                    message: 'Directive missing standalone property',
                    type: 'Standalone Declaration'
                },
                {
                    pattern: /moduleResolution\s*:\s*['"`]node['"`]/g,
                    message: 'moduleResolution should be "bundler" for Angular 21',
                    type: 'TypeScript Config'
                }
            ],

            // Warning issues
            warning: [
                {
                    pattern: /import.*from\s*['"`]@angular\/common\/http['"`].*HttpClientModule/g,
                    message: 'HttpClientModule import should be removed',
                    type: 'Import Cleanup'
                },
                {
                    pattern: /selector\s*:\s*['"`][^'"`]*['"`]\s*,?\s*$/gm,
                    message: 'Component selector found (good)',
                    type: 'Selector Check',
                    isPositive: true
                },
                {
                    pattern: /templateUrl\s*:\s*['"`][^'"`]*['"`]/g,
                    message: 'TemplateUrl found (good)',
                    type: 'Template Check',
                    isPositive: true
                },
                {
                    pattern: /zone\.js\/dist\/zone/g,
                    message: 'Zone.js import path should be updated to "zone.js"',
                    type: 'Zone.js Import'
                },
                {
                    pattern: /@use\s+['"`][^'"`]*['"`]\s+as\s+\*/g,
                    message: 'SCSS @use syntax detected (good for Angular 21)',
                    type: 'SCSS Modernization',
                    isPositive: true
                }
            ],

            // Info issues
            info: [
                {
                    pattern: /standalone\s*:\s*true/g,
                    message: 'Standalone component detected',
                    type: 'Architecture Info'
                },
                {
                    pattern: /standalone\s*:\s*false/g,
                    message: 'NgModule-based component detected',
                    type: 'Architecture Info'
                },
                {
                    pattern: /provideHttpClient\(\)/g,
                    message: 'Angular 21 provideHttpClient() usage detected (good)',
                    type: 'Modern API Usage',
                    isPositive: true
                },
                {
                    pattern: /bootstrapApplication/g,
                    message: 'Standalone bootstrap detected',
                    type: 'Bootstrap Method'
                }
            ]
        };
    }

    /**
     * Find all module files in the project
     */
    findModuleFiles(dirPath, moduleFiles = []) {
        try {
            const items = fs.readdirSync(dirPath);

            for (const item of items) {
                const fullPath = path.join(dirPath, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    if (!['node_modules', '.git', 'dist', '.angular', 'coverage'].includes(item)) {
                        this.findModuleFiles(fullPath, moduleFiles);
                    }
                } else if (item.endsWith('.module.ts')) {
                    moduleFiles.push(fullPath);
                }
            }
        } catch (error) {
            console.error(`❌ Error scanning directory ${dirPath}: ${error.message}`);
        }

        return moduleFiles;
    }

    /**
     * Find all related files for a module
     */
    findRelatedFiles(moduleFile) {
        const moduleDir = path.dirname(moduleFile);
        const relatedFiles = [moduleFile];

        try {
            const items = fs.readdirSync(moduleDir);

            for (const item of items) {
                const fullPath = path.join(moduleDir, item);
                const stat = fs.statSync(fullPath);

                if (stat.isFile()) {
                    if (item.endsWith('.component.ts') ||
                        item.endsWith('.component.html') ||
                        item.endsWith('.service.ts') ||
                        item.endsWith('.pipe.ts') ||
                        item.endsWith('.directive.ts') ||
                        item.endsWith('.spec.ts') ||
                        item.endsWith('.scss') ||
                        item.endsWith('.css')) {
                        relatedFiles.push(fullPath);
                    }
                }
            }
        } catch (error) {
            console.error(`❌ Error scanning module directory ${moduleDir}: ${error.message}`);
        }

        return relatedFiles;
    }

    /**
     * Check a single file for compatibility issues
     */
    checkFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const fileExtension = path.extname(filePath);
            const fileName = path.basename(filePath);

            // Update statistics
            if (fileName.includes('.component.')) this.stats.componentsChecked++;
            else if (fileName.includes('.service.')) this.stats.servicesChecked++;
            else if (fileName.includes('.pipe.')) this.stats.pipesChecked++;
            else if (fileName.includes('.directive.')) this.stats.directivesChecked++;
            if (fileExtension === '.html') this.stats.templatesChecked++;

            const fileIssues = [];

            // Check all compatibility patterns
            Object.entries(this.compatibilityPatterns).forEach(([severity, patterns]) => {
                patterns.forEach(patternObj => {
                    const matches = content.match(patternObj.pattern);
                    if (matches) {
                        matches.forEach(match => {
                            const issue = {
                                file: filePath,
                                severity: severity,
                                type: patternObj.type,
                                message: patternObj.message,
                                match: match.substring(0, 100), // Truncate long matches
                                isPositive: patternObj.isPositive || false,
                                line: this.getLineNumber(content, match)
                            };

                            fileIssues.push(issue);
                            this.issues[severity].push(issue);

                            if (!patternObj.isPositive) {
                                this.totalIssues++;
                            }
                        });
                    }
                });
            });

            return fileIssues;

        } catch (error) {
            console.error(`❌ Error checking file ${filePath}: ${error.message}`);
            return [];
        }
    }

    /**
     * Get line number for a match in content
     */
    getLineNumber(content, match) {
        const index = content.indexOf(match);
        if (index === -1) return 1;

        const beforeMatch = content.substring(0, index);
        return beforeMatch.split('\n').length;
    }

    /**
     * Process a batch of modules
     */
    processBatch(moduleFiles, batchStart, batchEnd) {
        console.log(`\n🔍 BATCH ${this.currentBatch}: Processing modules ${batchStart + 1}-${Math.min(batchEnd, moduleFiles.length)}`);
        console.log('='.repeat(60));

        const batchModules = moduleFiles.slice(batchStart, batchEnd);
        const batchIssues = [];

        batchModules.forEach((moduleFile, index) => {
            const moduleNumber = batchStart + index + 1;
            const moduleName = path.basename(moduleFile, '.module.ts');

            console.log(`📦 ${moduleNumber}. Checking module: ${moduleName}`);

            // Find all related files for this module
            const relatedFiles = this.findRelatedFiles(moduleFile);

            let moduleIssueCount = 0;
            relatedFiles.forEach(file => {
                const fileIssues = this.checkFile(file);
                moduleIssueCount += fileIssues.filter(issue => !issue.isPositive).length;
                batchIssues.push(...fileIssues);
            });

            if (moduleIssueCount > 0) {
                console.log(`   ⚠️  Found ${moduleIssueCount} issues`);
            } else {
                console.log(`   ✅ No issues found`);
            }

            this.stats.modulesProcessed++;
        });

        return batchIssues;
    }

    /**
     * Generate batch summary
     */
    generateBatchSummary(batchIssues) {
        const criticalCount = batchIssues.filter(i => i.severity === 'critical' && !i.isPositive).length;
        const warningCount = batchIssues.filter(i => i.severity === 'warning' && !i.isPositive).length;
        const positiveCount = batchIssues.filter(i => i.isPositive).length;

        console.log(`\n📊 BATCH ${this.currentBatch} SUMMARY:`);
        console.log(`   🔴 Critical Issues: ${criticalCount}`);
        console.log(`   🟡 Warnings: ${warningCount}`);
        console.log(`   🟢 Positive Findings: ${positiveCount}`);

        if (criticalCount > 0) {
            console.log(`\n🔴 CRITICAL ISSUES IN BATCH ${this.currentBatch}:`);
            const criticalIssues = batchIssues.filter(i => i.severity === 'critical' && !i.isPositive);
            criticalIssues.slice(0, 5).forEach((issue, index) => {
                console.log(`   ${index + 1}. ${path.basename(issue.file)} (Line ${issue.line})`);
                console.log(`      Type: ${issue.type}`);
                console.log(`      Issue: ${issue.message}`);
            });

            if (criticalIssues.length > 5) {
                console.log(`   ... and ${criticalIssues.length - 5} more critical issues`);
            }
        }
    }

    /**
     * Generate final comprehensive report
     */
    generateFinalReport() {
        console.log('\n' + '='.repeat(80));
        console.log('🎯 ANGULAR 21 COMPATIBILITY - COMPREHENSIVE REPORT');
        console.log('='.repeat(80));

        console.log(`📊 PROCESSING STATISTICS:`);
        console.log(`   • Total Modules: ${this.totalModules}`);
        console.log(`   • Modules Processed: ${this.stats.modulesProcessed}`);
        console.log(`   • Components Checked: ${this.stats.componentsChecked}`);
        console.log(`   • Templates Checked: ${this.stats.templatesChecked}`);
        console.log(`   • Services Checked: ${this.stats.servicesChecked}`);
        console.log(`   • Pipes Checked: ${this.stats.pipesChecked}`);
        console.log(`   • Directives Checked: ${this.stats.directivesChecked}`);

        console.log(`\n🎯 ISSUE BREAKDOWN:`);
        const criticalCount = this.issues.critical.filter(i => !i.isPositive).length;
        const warningCount = this.issues.warning.filter(i => !i.isPositive).length;
        const positiveCount = [...this.issues.critical, ...this.issues.warning, ...this.issues.info].filter(i => i.isPositive).length;

        console.log(`   🔴 Critical Issues: ${criticalCount}`);
        console.log(`   🟡 Warnings: ${warningCount}`);
        console.log(`   ℹ️  Info Items: ${this.issues.info.length}`);
        console.log(`   🟢 Positive Findings: ${positiveCount}`);

        // Top critical issues
        if (criticalCount > 0) {
            console.log(`\n🔴 TOP CRITICAL ISSUES:`);
            const criticalIssues = this.issues.critical.filter(i => !i.isPositive);
            const issueTypes = {};

            criticalIssues.forEach(issue => {
                issueTypes[issue.type] = (issueTypes[issue.type] || 0) + 1;
            });

            Object.entries(issueTypes)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .forEach(([type, count]) => {
                    console.log(`   • ${type}: ${count} occurrences`);
                });
        }

        // Architecture analysis
        console.log(`\n🏗️  ARCHITECTURE ANALYSIS:`);
        const standaloneComponents = this.issues.info.filter(i => i.message.includes('Standalone component')).length;
        const ngModuleComponents = this.issues.info.filter(i => i.message.includes('NgModule-based component')).length;
        const modernApis = this.issues.info.filter(i => i.message.includes('provideHttpClient')).length;

        console.log(`   • Standalone Components: ${standaloneComponents}`);
        console.log(`   • NgModule Components: ${ngModuleComponents}`);
        console.log(`   • Modern API Usage: ${modernApis}`);

        if (ngModuleComponents > standaloneComponents) {
            console.log(`   • Architecture: Primarily NgModule-based ✅`);
        } else if (standaloneComponents > ngModuleComponents) {
            console.log(`   • Architecture: Primarily Standalone-based ✅`);
        } else {
            console.log(`   • Architecture: Hybrid (NgModule + Standalone) ✅`);
        }

        console.log(`\n🎉 ANGULAR 21 COMPATIBILITY STATUS:`);
        if (criticalCount === 0) {
            console.log(`   ✅ EXCELLENT: No critical compatibility issues found!`);
            console.log(`   🎯 Project is Angular 21 ready for production`);
            console.log(`   📝 Consider addressing warnings for optimal performance`);
        } else if (criticalCount < 10) {
            console.log(`   🟡 GOOD: Only ${criticalCount} critical issues remaining`);
            console.log(`   🔧 Address critical issues for full Angular 21 compatibility`);
        } else {
            console.log(`   🔴 NEEDS WORK: ${criticalCount} critical issues need attention`);
            console.log(`   🛠️  Systematic fixing required for Angular 21 compatibility`);
        }

        console.log('='.repeat(80));
    }

    /**
     * Main execution method
     */
    run(targetPath = './apps/web-giddh/src') {
        console.log('🔍 Starting Angular 21 Compatibility Check...');
        console.log(`📁 Target Directory: ${path.resolve(targetPath)}`);
        console.log(`📦 Batch Size: ${this.batchSize} modules per batch\n`);

        if (!fs.existsSync(targetPath)) {
            console.error(`❌ Target directory does not exist: ${targetPath}`);
            return;
        }

        // Find all module files
        const moduleFiles = this.findModuleFiles(targetPath);
        this.totalModules = moduleFiles.length;

        console.log(`📊 Found ${this.totalModules} modules to check`);
        console.log(`🔄 Will process in ${Math.ceil(this.totalModules / this.batchSize)} batches\n`);

        // Process modules in batches
        for (let i = 0; i < moduleFiles.length; i += this.batchSize) {
            const batchEnd = Math.min(i + this.batchSize, moduleFiles.length);
            const batchIssues = this.processBatch(moduleFiles, i, batchEnd);
            this.generateBatchSummary(batchIssues);

            this.currentBatch++;

            // Pause between batches for readability
            if (i + this.batchSize < moduleFiles.length) {
                console.log(`\n⏸️  Batch ${this.currentBatch - 1} complete. Press Enter to continue to next batch...`);
                // In a real scenario, you might want to add a pause here
            }
        }

        this.generateFinalReport();
    }
}

// Execute the script
const targetDirectory = process.argv[2] || './apps/web-giddh/src';
const checker = new Angular21CompatibilityChecker();
checker.run(targetDirectory);
