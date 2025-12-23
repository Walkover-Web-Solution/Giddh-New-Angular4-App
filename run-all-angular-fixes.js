#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * Master script to run all Angular transformation scripts in the correct order
 */

class AngularFixRunner {
    constructor() {
        this.scripts = [
            {
                name: 'Replace ng-container with appTranslate',
                file: 'replace-ng-container-app-translate.js',
                description: 'Replaces ng-container tags that have appTranslate directive with div tags'
            },
            {
                name: 'Add standalone: false to Components',
                file: 'add-standalone-false-components.js',
                description: 'Adds standalone: false to @Component decorators where missing'
            },
            {
                name: 'Add providedIn: root to Injectables',
                file: 'add-provided-in-root-injectables.js',
                description: 'Adds providedIn: \'root\' to @Injectable decorators where missing'
            },
            {
                name: 'Enable Commented Modules',
                file: 'enable-commented-modules.js',
                description: 'Enables commented/disabled modules in routing files if modules exist'
            },
            {
                name: 'Angular 21 Compatibility Check',
                file: 'angular-21-compatibility-checker.js',
                description: 'Checks codebase for Angular 21 compatibility issues'
            }
        ];
        this.results = [];
    }

    runScript(script) {
        console.log(`\n🔄 Running: ${script.name}`);
        console.log(`📝 ${script.description}`);
        console.log('=' .repeat(60));
        
        try {
            const scriptPath = path.join(__dirname, script.file);
            
            if (!fs.existsSync(scriptPath)) {
                throw new Error(`Script file not found: ${scriptPath}`);
            }
            
            const startTime = Date.now();
            const output = execSync(`node "${scriptPath}"`, { 
                encoding: 'utf8',
                cwd: process.cwd(),
                maxBuffer: 1024 * 1024 * 10 // 10MB buffer
            });
            
            const duration = Date.now() - startTime;
            
            console.log(output);
            
            this.results.push({
                name: script.name,
                success: true,
                duration,
                output: output.trim()
            });
            
            console.log(`✅ ${script.name} completed successfully in ${duration}ms`);
            
        } catch (error) {
            console.error(`❌ ${script.name} failed:`);
            console.error(error.message);
            
            this.results.push({
                name: script.name,
                success: false,
                error: error.message,
                output: error.stdout || ''
            });
        }
    }

    generateSummaryReport() {
        console.log('\n' + '='.repeat(80));
        console.log('📊 ANGULAR TRANSFORMATION SUMMARY REPORT');
        console.log('='.repeat(80));
        
        const successful = this.results.filter(r => r.success).length;
        const failed = this.results.filter(r => !r.success).length;
        const totalDuration = this.results.reduce((sum, r) => sum + (r.duration || 0), 0);
        
        console.log(`\n📈 Overall Statistics:`);
        console.log(`   Total scripts run: ${this.results.length}`);
        console.log(`   Successful: ${successful}`);
        console.log(`   Failed: ${failed}`);
        console.log(`   Total execution time: ${totalDuration}ms`);
        
        console.log(`\n📋 Script Results:`);
        this.results.forEach((result, index) => {
            const status = result.success ? '✅' : '❌';
            const duration = result.duration ? ` (${result.duration}ms)` : '';
            console.log(`   ${index + 1}. ${status} ${result.name}${duration}`);
            
            if (!result.success && result.error) {
                console.log(`      Error: ${result.error}`);
            }
        });
        
        if (successful === this.results.length) {
            console.log(`\n🎉 All transformations completed successfully!`);
            console.log(`\n📝 Next Steps:`);
            console.log(`   1. Review the Angular 21 compatibility report above`);
            console.log(`   2. Address any critical issues found`);
            console.log(`   3. Test your application thoroughly`);
            console.log(`   4. Run 'ng build' to ensure everything compiles`);
            console.log(`   5. Consider running 'ng update @angular/core @angular/cli' for Angular 21 upgrade`);
        } else {
            console.log(`\n⚠️  Some transformations failed. Please review the errors above.`);
        }
        
        console.log('\n' + '='.repeat(80));
    }

    run() {
        console.log('🚀 Starting Angular Codebase Transformation');
        console.log('==========================================');
        console.log(`📁 Working directory: ${process.cwd()}`);
        console.log(`📅 Started at: ${new Date().toISOString()}`);
        
        // Verify we're in the right directory
        const angularJsonPath = path.join(process.cwd(), 'angular.json');
        if (!fs.existsSync(angularJsonPath)) {
            console.error('❌ angular.json not found. Please run this script from the Angular project root.');
            process.exit(1);
        }
        
        // Run all scripts in order
        this.scripts.forEach(script => {
            this.runScript(script);
        });
        
        // Generate summary report
        this.generateSummaryReport();
        
        // Exit with appropriate code
        const hasFailures = this.results.some(r => !r.success);
        process.exit(hasFailures ? 1 : 0);
    }
}

function main() {
    const runner = new AngularFixRunner();
    runner.run();
}

if (require.main === module) {
    main();
}

module.exports = AngularFixRunner;
