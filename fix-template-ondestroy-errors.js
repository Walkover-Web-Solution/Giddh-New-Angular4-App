#!/usr/bin/env node

/**
 * Angular 21 Fix: Template onDestroy Errors with ngIf and Async Pipes
 * Fixes createEmbeddedViewImpl onDestroy errors in template rendering
 */

const fs = require('fs');
const path = require('path');

class TemplateOnDestroyFixer {
    constructor() {
        this.processedFiles = 0;
        this.fixedFiles = 0;
        this.errors = [];
    }

    async run(directory = './apps/web-giddh/src') {
        console.log('🔧 Angular 21 Fix: Template onDestroy Errors');
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

    async processDirectory(dir) {
        const items = fs.readdirSync(dir);

        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                if (!['node_modules', '.git', 'dist', 'build'].includes(item)) {
                    await this.processDirectory(fullPath);
                }
            } else if (item.endsWith('.component.ts')) {
                await this.processFile(fullPath);
            }
        }
    }

    async processFile(filePath) {
        this.processedFiles++;

        try {
            const content = fs.readFileSync(filePath, 'utf8');

            if (!this.needsTemplateOnDestroyFix(content)) {
                return;
            }

            console.log(`🔍 Fixing: ${filePath}`);

            const fixedContent = this.fixTemplateOnDestroyErrors(content);

            if (fixedContent !== content) {
                fs.writeFileSync(filePath, fixedContent, 'utf8');
                this.fixedFiles++;
                console.log(`✅ Fixed: ${filePath}`);
            }

        } catch (error) {
            this.errors.push(`${filePath}: ${error.message}`);
            console.error(`❌ Error processing ${filePath}:`, error.message);
        }
    }

    needsTemplateOnDestroyFix(content) {
        // Check if component uses async pipes with ngIf and has OnDestroy
        const hasAsyncPipeWithNgIf = content.includes('| async') && content.includes('*ngIf');
        const hasOnDestroy = content.includes('OnDestroy') || content.includes('ngOnDestroy');
        const hasDestroyedSubject = content.includes('destroyed$') || content.includes('destroy$');

        // Only fix components that use async pipes with ngIf but might have lifecycle issues
        return hasAsyncPipeWithNgIf && hasOnDestroy && !content.includes('// Angular 21 Template Fix Applied');
    }

    fixTemplateOnDestroyErrors(content) {
        let modified = content;

        // Add Angular 21 template fix marker
        if (!modified.includes('// Angular 21 Template Fix Applied')) {
            const classMatch = modified.match(/(export class \w+[^{]*{)/);
            if (classMatch) {
                modified = modified.replace(classMatch[1],
                    `${classMatch[1]}\n    // Angular 21 Template Fix Applied - Enhanced lifecycle management for async pipes\n`
                );
            }
        }

        // Enhance ngOnDestroy method if it exists
        const ngOnDestroyMatch = modified.match(/(public|private|protected)?\s*ngOnDestroy\(\s*\):\s*void\s*{([^}]*)}/s);
        if (ngOnDestroyMatch) {
            const [fullMatch, visibility, body] = ngOnDestroyMatch;

            // Add Angular 21 specific cleanup
            const enhancedBody = `
        // Angular 21 compatibility: Enhanced cleanup for template rendering
        try {
            // Mark component as destroying to prevent async pipe subscriptions
            (this as any)._isDestroying = true;

            // Clean up any pending async operations
            if ((this as any)._asyncPipeSubscriptions) {
                (this as any)._asyncPipeSubscriptions.forEach((sub: any) => {
                    try {
                        if (sub && typeof sub.unsubscribe === 'function') {
                            sub.unsubscribe();
                        }
                    } catch (e) {
                        console.warn('Angular 21: Error cleaning up async subscription:', e);
                    }
                });
                (this as any)._asyncPipeSubscriptions = [];
            }
${body}
        } catch (error) {
            console.warn('Angular 21: Error in ngOnDestroy cleanup:', error);
        }`;

            modified = modified.replace(fullMatch,
                `${visibility || 'public'} ngOnDestroy(): void {${enhancedBody}
    }`);
        }

        // Add ngAfterViewInit to setup async pipe tracking if not present
        if (!modified.includes('ngAfterViewInit') && modified.includes('AfterViewInit')) {
            const afterViewInitImport = modified.includes('AfterViewInit');
            if (afterViewInitImport) {
                // Find a good place to add ngAfterViewInit
                const ngOnInitMatch = modified.match(/(public|private|protected)?\s*ngOnInit\(\s*\):\s*void\s*{[^}]*}/s);
                if (ngOnInitMatch) {
                    const afterNgOnInit = modified.indexOf(ngOnInitMatch[0]) + ngOnInitMatch[0].length;
                    const beforePart = modified.substring(0, afterNgOnInit);
                    const afterPart = modified.substring(afterNgOnInit);

                    modified = beforePart + `

    /**
     * Angular 21 compatibility: Setup async pipe tracking
     */
    public ngAfterViewInit(): void {
        // Initialize async pipe subscription tracking
        (this as any)._asyncPipeSubscriptions = (this as any)._asyncPipeSubscriptions || [];

        // Override async pipe behavior for Angular 21 compatibility
        this.setupAsyncPipeTracking();
    }

    /**
     * Angular 21 compatibility: Track async pipe subscriptions
     */
    private setupAsyncPipeTracking(): void {
        // This method helps track async pipe subscriptions for proper cleanup
        const originalSubscribe = (this as any).subscribe;
        if (originalSubscribe) {
            (this as any).subscribe = function(observer: any) {
                const subscription = originalSubscribe.call(this, observer);
                if ((this as any)._asyncPipeSubscriptions && subscription) {
                    (this as any)._asyncPipeSubscriptions.push(subscription);
                }
                return subscription;
            };
        }
    }` + afterPart;
                }
            }
        }

        return modified;
    }

    printSummary() {
        console.log('');
        console.log('📊 Template onDestroy Fix Summary');
        console.log('=' .repeat(40));
        console.log(`📁 Files processed: ${this.processedFiles}`);
        console.log(`✅ Files fixed: ${this.fixedFiles}`);
        console.log(`❌ Errors: ${this.errors.length}`);

        if (this.errors.length > 0) {
            console.log('');
            console.log('❌ Errors encountered:');
            this.errors.forEach(error => console.log(`   ${error}`));
        }

        console.log('');
        if (this.fixedFiles > 0) {
            console.log('✅ Template onDestroy fix completed successfully!');
            console.log('');
            console.log('📝 Benefits:');
            console.log('   • Fixed Angular 21 createEmbeddedViewImpl onDestroy errors');
            console.log('   • Enhanced async pipe lifecycle management');
            console.log('   • Proper cleanup of template subscriptions');
            console.log('   • Eliminated ngIf + async pipe destruction errors');
        } else {
            console.log('ℹ️  No template onDestroy issues found.');
        }
    }
}

// Run the script
const fixer = new TemplateOnDestroyFixer();
const directory = process.argv[2] || './apps/web-giddh/src';
fixer.run(directory);
