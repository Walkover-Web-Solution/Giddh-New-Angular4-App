#!/usr/bin/env node

/**
 * Angular 21 Compatibility Master Script
 * Executes all four critical compatibility fixes in the correct order
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class Angular21CompatibilityMaster {
    constructor() {
        this.scripts = [
            {
                name: 'Services ProvidedIn Configuration',
                file: './fix-services-providedin.js',
                priority: 1,
                description: 'Fixes services missing providedIn: root configuration'
            },
            {
                name: 'NgRx Effects Injector Context',
                file: './fix-ngrx-effects-injector.js',
                priority: 2,
                description: 'Fixes NgRx effects without proper injector context'
            },
            {
                name: 'ViewContainerRef Safe Usage',
                file: './fix-viewcontainerref-usage.js',
                priority: 3,
                description: 'Fixes ViewContainerRef usage without safe factory handling'
            },
            {
                name: 'Circular Dependencies Resolution',
                file: './fix-circular-dependencies.js',
                priority: 4,
                description: 'Fixes circular dependencies breaking DI factory resolution'
            }
        ];
        this.results = [];
    }

    async run() {
        console.log('🚀 Angular 21 Compatibility Master Fix Script');
        console.log('=' .repeat(70));
        console.log('📋 This script will fix all critical Angular 21 compatibility issues:');
        console.log('');

        this.scripts.forEach(script => {
            console.log(`   ${script.priority}. ${script.name}`);
            console.log(`      ${script.description}`);
        });

        console.log('');
        console.log('⚠️  IMPORTANT: Make sure you have a backup of your code before proceeding!');
        console.log('');

        // Check if all script files exist
        const missingScripts = this.scripts.filter(script => !fs.existsSync(script.file));
        if (missingScripts.length > 0) {
            console.error('❌ Missing script files:');
            missingScripts.forEach(script => console.error(`   - ${script.file}`));
            process.exit(1);
        }

        console.log('🔧 Starting Angular 21 compatibility fixes...');
        console.log('');

        // Execute scripts in priority order
        for (const script of this.scripts) {
            await this.executeScript(script);
        }

        this.printFinalSummary();
    }

    async executeScript(script) {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`🔄 Executing: ${script.name}`);
        console.log(`📁 Script: ${script.file}`);
        console.log(`${'='.repeat(60)}\n`);

        try {
            const startTime = Date.now();

            // Make script executable
            execSync(`chmod +x ${script.file}`);

            // Execute the script
            const output = execSync(`node ${script.file}`, {
                encoding: 'utf8',
                stdio: 'pipe'
            });

            const endTime = Date.now();
            const duration = ((endTime - startTime) / 1000).toFixed(2);

            console.log(output);

            this.results.push({
                ...script,
                status: 'success',
                duration: duration,
                output: output
            });

            console.log(`\n✅ ${script.name} completed successfully in ${duration}s`);

        } catch (error) {
            console.error(`\n❌ ${script.name} failed:`);
            console.error(error.message);

            this.results.push({
                ...script,
                status: 'failed',
                error: error.message
            });

            // Continue with other scripts even if one fails
            console.log('\n⚠️  Continuing with remaining fixes...');
        }
    }

    printFinalSummary() {
        console.log('\n' + '='.repeat(70));
        console.log('📊 ANGULAR 21 COMPATIBILITY FIX SUMMARY');
        console.log('='.repeat(70));

        const successful = this.results.filter(r => r.status === 'success');
        const failed = this.results.filter(r => r.status === 'failed');

        console.log(`\n📈 Overall Results:`);
        console.log(`   ✅ Successful fixes: ${successful.length}/${this.scripts.length}`);
        console.log(`   ❌ Failed fixes: ${failed.length}/${this.scripts.length}`);

        if (successful.length > 0) {
            console.log(`\n✅ Successfully Applied Fixes:`);
            successful.forEach(result => {
                console.log(`   • ${result.name} (${result.duration}s)`);
            });
        }

        if (failed.length > 0) {
            console.log(`\n❌ Failed Fixes:`);
            failed.forEach(result => {
                console.log(`   • ${result.name}: ${result.error}`);
            });
        }

        console.log('\n🎯 Next Steps:');

        if (successful.length === this.scripts.length) {
            console.log('   ✅ All Angular 21 compatibility fixes applied successfully!');
            console.log('   🚀 Your application should now be fully Angular 21 compatible');
            console.log('   📋 Recommended actions:');
            console.log('      1. Run: npm run build (to verify compilation)');
            console.log('      2. Run: npm start (to test runtime behavior)');
            console.log('      3. Test critical application features');
            console.log('      4. Monitor browser console for any remaining errors');
        } else if (successful.length > 0) {
            console.log('   ⚠️  Some fixes were applied, but others failed');
            console.log('   📋 Recommended actions:');
            console.log('      1. Review failed fixes above');
            console.log('      2. Manually apply failed fixes if needed');
            console.log('      3. Run: npm run build (to check current status)');
            console.log('      4. Test the application');
        } else {
            console.log('   ❌ No fixes were successfully applied');
            console.log('   📋 Recommended actions:');
            console.log('      1. Check script permissions and file paths');
            console.log('      2. Review error messages above');
            console.log('      3. Try running individual scripts manually');
        }

        console.log('\n🔍 Key Angular 21 Compatibility Issues Addressed:');
        console.log('   • Services missing providedIn: root configuration');
        console.log('   • NgRx effects without proper injector context');
        console.log('   • ViewContainerRef usage without safe factory handling');
        console.log('   • Circular dependencies breaking DI factory resolution');

        console.log('\n📝 These fixes should resolve:');
        console.log('   • "Cannot read properties of undefined (reading \'factory\')" errors');
        console.log('   • DI factory resolution failures');
        console.log('   • NgRx effects dependency injection issues');
        console.log('   • ViewContainerRef runtime errors');
        console.log('   • Service circular dependency problems');

        console.log('\n' + '='.repeat(70));
        console.log('🎉 Angular 21 Compatibility Fix Process Complete!');
        console.log('='.repeat(70));
    }
}

// Run the master script
const master = new Angular21CompatibilityMaster();
master.run().catch(error => {
    console.error('💥 Master script failed:', error);
    process.exit(1);
});
