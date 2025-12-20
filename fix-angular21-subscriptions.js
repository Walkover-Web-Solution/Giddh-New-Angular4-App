#!/usr/bin/env node

/**
 * Angular 21 Subscription Pattern Migration Script
 * Fixes the "Cannot read properties of undefined (reading 'onDestroy')" error
 * by updating all components using the problematic destroyed$ + takeUntil pattern
 */

const fs = require('fs');
const path = require('path');

class Angular21SubscriptionFixer {
    constructor() {
        this.processedFiles = 0;
        this.modifiedFiles = 0;
        this.errors = [];
    }

    /**
     * Main execution method
     */
    async run(directory = './apps/web-giddh/src') {
        console.log('🔧 Angular 21 Subscription Pattern Migration Script');
        console.log('=' .repeat(60));
        console.log(`📁 Processing directory: ${directory}`);
        console.log('');

        try {
            await this.processDirectory(directory);
            this.printSummary();
        } catch (error) {
            console.error('❌ Script failed:', error.message);
            process.exit(1);
        }
    }

    /**
     * Process all TypeScript files in directory recursively
     */
    async processDirectory(dir) {
        const items = fs.readdirSync(dir);

        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                // Skip node_modules and other irrelevant directories
                if (!['node_modules', '.git', 'dist', 'build'].includes(item)) {
                    await this.processDirectory(fullPath);
                }
            } else if (item.endsWith('.component.ts') || item.endsWith('.service.ts')) {
                await this.processFile(fullPath);
            }
        }
    }

    /**
     * Process individual TypeScript file
     */
    async processFile(filePath) {
        this.processedFiles++;

        try {
            const content = fs.readFileSync(filePath, 'utf8');

            // Check if file has the problematic pattern
            if (!this.hasProblematicPattern(content)) {
                return;
            }

            console.log(`🔍 Processing: ${filePath}`);

            const modifiedContent = this.fixSubscriptionPattern(content);

            if (modifiedContent !== content) {
                fs.writeFileSync(filePath, modifiedContent, 'utf8');
                this.modifiedFiles++;
                console.log(`✅ Fixed: ${filePath}`);
            }

        } catch (error) {
            this.errors.push(`${filePath}: ${error.message}`);
            console.error(`❌ Error processing ${filePath}:`, error.message);
        }
    }

    /**
     * Check if file has the problematic subscription pattern
     */
    hasProblematicPattern(content) {
        const patterns = [
            /private\s+destroyed\$\s*:\s*ReplaySubject<boolean>\s*=\s*new\s+ReplaySubject\(1\)/,
            /takeUntil\(this\.destroyed\$\)/,
            /this\.destroyed\$\.next\(true\)/
        ];

        return patterns.some(pattern => pattern.test(content));
    }

    /**
     * Fix the subscription pattern in the file content
     */
    fixSubscriptionPattern(content) {
        let modified = content;

        // Step 1: Add Subscription import if not present
        if (modified.includes('ReplaySubject') && !modified.includes('Subscription')) {
            modified = modified.replace(
                /import\s*{\s*([^}]*ReplaySubject[^}]*)\s*}\s*from\s*['"]rxjs['"];?/,
                (match, imports) => {
                    if (!imports.includes('Subscription')) {
                        const cleanImports = imports.trim();
                        return match.replace(cleanImports, `${cleanImports}, Subscription`);
                    }
                    return match;
                }
            );
        }

        // Step 2: Add subscription tracking properties after destroyed$
        const destroyedPattern = /(private\s+destroyed\$\s*:\s*ReplaySubject<boolean>\s*=\s*new\s+ReplaySubject\(1\)\s*;)/;
        if (destroyedPattern.test(modified)) {
            modified = modified.replace(
                destroyedPattern,
                `$1
    /** Track subscriptions manually for Angular 21 compatibility */
    private subscriptions: Subscription[] = [];
    /** Flag to track component destruction state */
    private isDestroying = false;`
            );
        }

        // Step 3: Fix ngOnDestroy method
        const ngOnDestroyPattern = /(public\s+ngOnDestroy\(\)\s*:\s*void\s*{\s*)([\s\S]*?)(this\.destroyed\$\.next\(true\)\s*;\s*this\.destroyed\$\.complete\(\)\s*;)([\s\S]*?)(})/;

        if (ngOnDestroyPattern.test(modified)) {
            modified = modified.replace(
                ngOnDestroyPattern,
                `$1$2this.isDestroying = true;

        // Clean up all tracked subscriptions first
        this.subscriptions.forEach((subscription, index) => {
            try {
                if (subscription && !subscription.closed) {
                    subscription.unsubscribe();
                }
            } catch (error) {
                console.warn(\`Error unsubscribing subscription \${index}:\`, error);
            }
        });
        this.subscriptions = [];

        // Safely complete the destroyed$ subject
        try {
            if (this.destroyed$ && !this.destroyed$.closed) {
                this.destroyed$.next(true);
                this.destroyed$.complete();
            }
        } catch (error) {
            console.warn('Error completing destroyed$ subject:', error);
        }$4$5`
            );
        }

        // Step 4: Add helper method for safe subscription tracking
        if (modified.includes('ngOnDestroy') && !modified.includes('addSubscription')) {
            const classEndPattern = /(\s*)(}\s*$)/;
            modified = modified.replace(
                classEndPattern,
                `$1
    /**
     * Helper method to track subscriptions for Angular 21 compatibility
     */
    protected addSubscription(subscription: Subscription): void {
        if (subscription && !subscription.closed) {
            this.subscriptions.push(subscription);
        }
    }

$1$2`
            );
        }

        return modified;
    }

    /**
     * Print summary of migration results
     */
    printSummary() {
        console.log('');
        console.log('📊 Migration Summary');
        console.log('=' .repeat(40));
        console.log(`📁 Files processed: ${this.processedFiles}`);
        console.log(`✅ Files modified: ${this.modifiedFiles}`);
        console.log(`❌ Errors: ${this.errors.length}`);

        if (this.errors.length > 0) {
            console.log('');
            console.log('❌ Errors encountered:');
            this.errors.forEach(error => console.log(`   ${error}`));
        }

        console.log('');
        if (this.modifiedFiles > 0) {
            console.log('✅ Angular 21 subscription pattern migration completed successfully!');
            console.log('');
            console.log('📝 Next steps:');
            console.log('   1. Test your application to ensure onDestroy errors are resolved');
            console.log('   2. Update any remaining manual subscriptions to use addSubscription() method');
            console.log('   3. Consider extending BaseComponent for new components');
        } else {
            console.log('ℹ️  No files needed modification.');
        }
    }
}

// Run the script
const fixer = new Angular21SubscriptionFixer();
const directory = process.argv[2] || './apps/web-giddh/src';
fixer.run(directory);
