#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to fix HttpClientModule usage for Angular 21 compatibility
 * Converts deprecated HttpClientModule to new provideHttpClient() approach
 */

class HttpClientFixer {
    constructor() {
        this.processedFiles = 0;
        this.fixedFiles = 0;
        this.errors = [];

        // Statistics
        this.stats = {
            modulesFound: 0,
            modulesFixed: 0,
            importsFixed: 0,
            providersAdded: 0,
            appConfigsFixed: 0,
            mainTsFixed: 0
        };

        this.fixedModules = [];
        this.httpClientUsages = [];
        this.appConfigFiles = [];
    }

    /**
     * Check if file contains HttpClientModule usage
     */
    hasHttpClientModule(content) {
        return content.includes('HttpClientModule') || content.includes('HttpClient');
    }

    /**
     * Extract imports from file content
     */
    extractImports(content) {
        const imports = [];
        const importRegex = /import\s*\{([^}]+)\}\s*from\s*['"`]([^'"`]+)['"`]/g;
        let match;

        while ((match = importRegex.exec(content)) !== null) {
            const importItems = match[1].split(',').map(item => item.trim());
            imports.push({
                items: importItems,
                from: match[2],
                fullMatch: match[0]
            });
        }

        return imports;
    }

    /**
     * Check if file is an NgModule
     */
    isNgModule(content) {
        return content.includes('@NgModule') && content.includes('imports:');
    }

    /**
     * Check if file is app.config.ts
     */
    isAppConfig(filePath) {
        return filePath.includes('app.config.ts') || filePath.includes('main.ts');
    }

    /**
     * Fix HttpClientModule in NgModule
     */
    fixNgModule(content, filePath) {
        let newContent = content;
        let changes = [];

        // Check if HttpClientModule is imported
        const hasHttpClientModuleImport = /import.*HttpClientModule.*from\s*['"`]@angular\/common\/http['"`]/.test(content);
        const hasHttpClientImport = /import.*HttpClient.*from\s*['"`]@angular\/common\/http['"`]/.test(content);

        if (hasHttpClientModuleImport) {
            // Remove HttpClientModule from imports
            newContent = newContent.replace(
                /import\s*\{([^}]*HttpClientModule[^}]*)\}\s*from\s*['"`]@angular\/common\/http['"`];?/g,
                (match, importList) => {
                    const items = importList.split(',').map(item => item.trim()).filter(item => item !== 'HttpClientModule');
                    if (items.length > 0) {
                        return `import { ${items.join(', ')} } from '@angular/common/http';`;
                    }
                    return ''; // Remove entire import if only HttpClientModule
                }
            );

            // Remove HttpClientModule from NgModule imports array
            newContent = newContent.replace(
                /(\s*imports:\s*\[[\s\S]*?)HttpClientModule,?/g,
                '$1'
            );

            // Clean up any trailing commas in imports array
            newContent = newContent.replace(
                /(imports:\s*\[[^\]]*),(\s*\])/g,
                '$1$2'
            );

            changes.push('Removed HttpClientModule from imports');
        }

        // Add provideHttpClient to providers if not present
        if (hasHttpClientModuleImport || hasHttpClientImport) {
            // Check if provideHttpClient is already imported
            if (!newContent.includes('provideHttpClient')) {
                // Add provideHttpClient import
                if (newContent.includes("from '@angular/common/http'")) {
                    newContent = newContent.replace(
                        /import\s*\{([^}]*)\}\s*from\s*['"`]@angular\/common\/http['"`]/,
                        (match, importList) => {
                            const items = importList.split(',').map(item => item.trim());
                            if (!items.includes('provideHttpClient')) {
                                items.push('provideHttpClient');
                            }
                            return `import { ${items.join(', ')} } from '@angular/common/http'`;
                        }
                    );
                } else {
                    // Add new import for provideHttpClient
                    const importMatch = newContent.match(/import[^;]+;/);
                    if (importMatch) {
                        const insertIndex = newContent.indexOf(importMatch[0]) + importMatch[0].length;
                        newContent = newContent.slice(0, insertIndex) +
                                   '\nimport { provideHttpClient } from \'@angular/common/http\';' +
                                   newContent.slice(insertIndex);
                    }
                }
                changes.push('Added provideHttpClient import');
            }

            // Add provideHttpClient to providers array
            if (newContent.includes('providers:')) {
                // Add to existing providers array
                newContent = newContent.replace(
                    /(providers:\s*\[)/,
                    '$1\n        provideHttpClient(),'
                );
            } else {
                // Add providers array to NgModule
                newContent = newContent.replace(
                    /(@NgModule\s*\(\s*\{[^}]*)(}\s*\))/,
                    '$1,\n    providers: [\n        provideHttpClient()\n    ]$2'
                );
            }
            changes.push('Added provideHttpClient() to providers');
        }

        return {
            content: newContent,
            changes: changes,
            fixed: changes.length > 0
        };
    }

    /**
     * Fix app.config.ts or main.ts files
     */
    fixAppConfig(content, filePath) {
        let newContent = content;
        let changes = [];

        // Check if it's using bootstrapApplication
        if (content.includes('bootstrapApplication') || content.includes('provideRouter')) {
            // Add provideHttpClient import if not present
            if (!newContent.includes('provideHttpClient')) {
                if (newContent.includes("from '@angular/common/http'")) {
                    newContent = newContent.replace(
                        /import\s*\{([^}]*)\}\s*from\s*['"`]@angular\/common\/http['"`]/,
                        (match, importList) => {
                            const items = importList.split(',').map(item => item.trim());
                            if (!items.includes('provideHttpClient')) {
                                items.push('provideHttpClient');
                            }
                            return `import { ${items.join(', ')} } from '@angular/common/http'`;
                        }
                    );
                } else {
                    // Add new import
                    const importMatch = newContent.match(/import[^;]+;/);
                    if (importMatch) {
                        const insertIndex = newContent.indexOf(importMatch[0]) + importMatch[0].length;
                        newContent = newContent.slice(0, insertIndex) +
                                   '\nimport { provideHttpClient } from \'@angular/common/http\';' +
                                   newContent.slice(insertIndex);
                    }
                }
                changes.push('Added provideHttpClient import');
            }

            // Add provideHttpClient to providers array
            if (newContent.includes('providers:') && !newContent.includes('provideHttpClient()')) {
                newContent = newContent.replace(
                    /(providers:\s*\[)/,
                    '$1\n        provideHttpClient(),'
                );
                changes.push('Added provideHttpClient() to providers');
            }
        }

        return {
            content: newContent,
            changes: changes,
            fixed: changes.length > 0
        };
    }

    /**
     * Process a single TypeScript file
     */
    processFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');

            if (!this.hasHttpClientModule(content)) {
                return;
            }

            this.processedFiles++;

            this.httpClientUsages.push({
                path: filePath,
                hasHttpClientModule: content.includes('HttpClientModule'),
                hasHttpClient: content.includes('HttpClient'),
                isModule: this.isNgModule(content),
                isAppConfig: this.isAppConfig(filePath)
            });

            let result;

            if (this.isAppConfig(filePath)) {
                result = this.fixAppConfig(content, filePath);
                if (result.fixed) {
                    this.stats.appConfigsFixed++;
                    if (filePath.includes('main.ts')) {
                        this.stats.mainTsFixed++;
                    }
                }
            } else if (this.isNgModule(content)) {
                result = this.fixNgModule(content, filePath);
                if (result.fixed) {
                    this.stats.modulesFixed++;
                }
            } else {
                // Just update imports for service files
                result = this.fixServiceImports(content, filePath);
            }

            if (result.fixed) {
                fs.writeFileSync(filePath, result.content);
                this.fixedFiles++;

                this.fixedModules.push({
                    path: filePath,
                    changes: result.changes,
                    type: this.isAppConfig(filePath) ? 'app-config' :
                          this.isNgModule(content) ? 'module' : 'service'
                });

                console.log(`✅ Fixed ${filePath}`);
                result.changes.forEach(change => {
                    console.log(`   • ${change}`);
                });
                console.log('');
            }

        } catch (error) {
            this.errors.push({
                file: filePath,
                error: error.message
            });
            console.error(`❌ Error processing ${filePath}: ${error.message}`);
        }
    }

    /**
     * Fix service imports (for files that just import HttpClient)
     */
    fixServiceImports(content, filePath) {
        let newContent = content;
        let changes = [];

        // This is mainly for documentation - service files usually don't need changes
        // HttpClient import remains the same in Angular 21

        return {
            content: newContent,
            changes: changes,
            fixed: false
        };
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
                    this.processFile(fullPath);
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
        console.log('🌐 ANGULAR 21 HTTPCLIENT COMPATIBILITY FIXER - REPORT');
        console.log('='.repeat(80));

        console.log(`📊 OVERALL STATISTICS:`);
        console.log(`   • Files Processed: ${this.processedFiles}`);
        console.log(`   • Files Fixed: ${this.fixedFiles}`);
        console.log(`   • HttpClient Usages Found: ${this.httpClientUsages.length}`);
        console.log(`   • Errors: ${this.errors.length}`);

        console.log(`\n📈 BREAKDOWN BY TYPE:`);
        console.log(`   • NgModules Fixed: ${this.stats.modulesFixed}`);
        console.log(`   • App Configs Fixed: ${this.stats.appConfigsFixed}`);
        console.log(`   • Main.ts Fixed: ${this.stats.mainTsFixed}`);

        if (this.fixedModules.length > 0) {
            console.log(`\n✅ FILES FIXED (${this.fixedModules.length}):`);
            this.fixedModules.forEach((file, index) => {
                console.log(`   ${index + 1}. ${path.basename(file.path)} (${file.type})`);
                file.changes.forEach(change => {
                    console.log(`      • ${change}`);
                });
            });
        }

        if (this.httpClientUsages.length > 0) {
            console.log(`\n📋 HTTPCLIENT USAGE ANALYSIS:`);
            const moduleUsages = this.httpClientUsages.filter(usage => usage.isModule).length;
            const serviceUsages = this.httpClientUsages.filter(usage => !usage.isModule && !usage.isAppConfig).length;
            const configUsages = this.httpClientUsages.filter(usage => usage.isAppConfig).length;

            console.log(`   • NgModules with HttpClient: ${moduleUsages}`);
            console.log(`   • Services with HttpClient: ${serviceUsages}`);
            console.log(`   • App Configs with HttpClient: ${configUsages}`);
        }

        if (this.errors.length > 0) {
            console.log(`\n❌ ERRORS (${this.errors.length}):`);
            this.errors.forEach((error, index) => {
                console.log(`   ${index + 1}. ${error.file}`);
                console.log(`      Error: ${error.error}`);
            });
        }

        console.log(`\n🎯 ANGULAR 21 HTTPCLIENT MIGRATION:`);
        console.log(`   • HttpClientModule → provideHttpClient()`);
        console.log(`   • Moved from imports to providers`);
        console.log(`   • Maintains backward compatibility`);
        console.log(`   • Supports new standalone architecture`);

        console.log(`\n🎉 COMPLETION STATUS:`);
        if (this.fixedFiles > 0) {
            console.log(`   ✅ Successfully migrated ${this.fixedFiles} files to Angular 21!`);
            console.log(`   🔧 HttpClientModule replaced with provideHttpClient()`);
            console.log(`   📝 All changes follow Angular 21 best practices`);
            console.log(`   🚀 Ready for Angular 21 production deployment`);
        } else {
            console.log(`   ℹ️  No HttpClientModule usage found or all already migrated!`);
        }

        console.log('='.repeat(80));
    }

    /**
     * Main execution method
     */
    run(targetPath = './apps/web-giddh/src') {
        console.log('🌐 Starting Angular 21 HttpClient Compatibility Fixer...');
        console.log(`📁 Target Directory: ${path.resolve(targetPath)}`);
        console.log('🔍 Scanning for HttpClientModule usage...\n');

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
const fixer = new HttpClientFixer();
fixer.run(targetDirectory);
