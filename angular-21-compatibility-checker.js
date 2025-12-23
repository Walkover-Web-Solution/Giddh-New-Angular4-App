#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Angular 21 Compatibility Checker
 * Checks for common compatibility issues when upgrading to Angular 21
 */

class Angular21CompatibilityChecker {
    constructor() {
        this.issues = [];
        this.warnings = [];
        this.suggestions = [];
        this.fileCount = 0;
    }

    addIssue(type, file, line, message, severity = 'error') {
        this.issues.push({ type, file, line, message, severity });
    }

    addWarning(type, file, line, message) {
        this.warnings.push({ type, file, line, message });
    }

    addSuggestion(type, file, message) {
        this.suggestions.push({ type, file, message });
    }

    findTypeScriptFiles(dir, fileList = []) {
        const files = fs.readdirSync(dir);
        
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory()) {
                if (!['node_modules', '.git', 'dist', 'build', '.angular', 'coverage'].includes(file)) {
                    this.findTypeScriptFiles(filePath, fileList);
                }
            } else if (file.endsWith('.ts') && !file.endsWith('.spec.ts') && !file.endsWith('.d.ts')) {
                fileList.push(filePath);
            }
        });
        
        return fileList;
    }

    checkDeprecatedAPIs(content, filePath) {
        const lines = content.split('\n');
        
        // Angular 21 deprecated/removed APIs
        const deprecatedPatterns = [
            { pattern: /ComponentFactoryResolver/g, message: 'ComponentFactoryResolver is deprecated. Use ViewContainerRef.createComponent() directly.' },
            { pattern: /ModuleWithProviders(?!<)/g, message: 'ModuleWithProviders without generic type is deprecated. Use ModuleWithProviders<T>.' },
            { pattern: /Renderer(?!2)/g, message: 'Renderer is deprecated. Use Renderer2 instead.' },
            { pattern: /ReflectiveInjector/g, message: 'ReflectiveInjector is deprecated. Use Injector.create() instead.' },
            { pattern: /NgProbeToken/g, message: 'NgProbeToken is deprecated.' },
            { pattern: /getDebugNode/g, message: 'getDebugNode is deprecated. Use ng.getDebugNode instead.' },
            { pattern: /ViewEncapsulation\.Native/g, message: 'ViewEncapsulation.Native is deprecated. Use ViewEncapsulation.ShadowDom.' },
            { pattern: /DOCUMENT from @angular\/platform-browser/g, message: 'Import DOCUMENT from @angular/common instead.' },
            { pattern: /entryComponents/g, message: 'entryComponents is deprecated. Angular now resolves entry components automatically.' }
        ];

        lines.forEach((line, index) => {
            deprecatedPatterns.forEach(({ pattern, message }) => {
                if (pattern.test(line)) {
                    this.addIssue('deprecated-api', filePath, index + 1, message, 'warning');
                }
            });
        });
    }

    checkImportPatterns(content, filePath) {
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
            // Check for deprecated import paths
            if (line.includes('import') && line.includes('@angular/')) {
                // Check for deprecated HTTP module
                if (line.includes('@angular/http')) {
                    this.addIssue('deprecated-import', filePath, index + 1, 
                        '@angular/http is removed. Use @angular/common/http instead.', 'error');
                }
                
                // Check for platform-browser-dynamic imports that should be from common
                if (line.includes('@angular/platform-browser') && 
                    (line.includes('DOCUMENT') || line.includes('Location'))) {
                    this.addWarning('import-location', filePath, index + 1, 
                        'Consider importing DOCUMENT and Location from @angular/common instead.');
                }
            }
        });
    }

    checkComponentDecorator(content, filePath) {
        const lines = content.split('\n');
        let inComponentDecorator = false;
        let decoratorStartLine = 0;
        
        lines.forEach((line, index) => {
            if (line.includes('@Component(')) {
                inComponentDecorator = true;
                decoratorStartLine = index + 1;
            }
            
            if (inComponentDecorator) {
                // Check for entryComponents (deprecated)
                if (line.includes('entryComponents')) {
                    this.addWarning('deprecated-property', filePath, index + 1, 
                        'entryComponents is deprecated and can be removed.');
                }
                
                // Check for missing standalone property
                if (line.includes('})') && !content.includes('standalone:')) {
                    this.addSuggestion('missing-standalone', filePath, 
                        'Consider adding standalone: false for non-standalone components or migrate to standalone.');
                }
                
                if (line.includes('})')) {
                    inComponentDecorator = false;
                }
            }
        });
    }

    checkFormControls(content, filePath) {
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
            // Check for deprecated FormControl constructor usage
            if (line.includes('new FormControl(') && !line.includes('FormControl<')) {
                this.addWarning('untyped-form', filePath, index + 1, 
                    'Consider using typed FormControl<T> for better type safety.');
            }
            
            // Check for UntypedFormControl usage
            if (line.includes('UntypedFormControl')) {
                this.addSuggestion('typed-forms', filePath, 
                    'Consider migrating from UntypedFormControl to typed FormControl<T>.');
            }
        });
    }

    checkRxJSPatterns(content, filePath) {
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
            // Check for deprecated RxJS imports
            if (line.includes('import') && line.includes('rxjs/')) {
                if (line.includes('rxjs/add/')) {
                    this.addIssue('deprecated-rxjs', filePath, index + 1, 
                        'Patch imports (rxjs/add/*) are deprecated. Use pipeable operators instead.', 'error');
                }
            }
            
            // Check for deprecated operators
            const deprecatedOperators = ['do', 'catch', 'switch', 'finally'];
            deprecatedOperators.forEach(op => {
                if (line.includes(`.${op}(`)) {
                    this.addWarning('deprecated-operator', filePath, index + 1, 
                        `Operator '${op}' is deprecated. Use modern equivalent (tap, catchError, switchMap, finalize).`);
                }
            });
        });
    }

    checkAngularMaterialPatterns(content, filePath) {
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
            // Check for deprecated Material imports
            if (line.includes('@angular/material/') && line.includes('/index')) {
                this.addWarning('material-import', filePath, index + 1, 
                    'Deep imports from Material modules are deprecated. Import from specific entry points.');
            }
            
            // Check for deprecated Material components
            if (line.includes('md-') || line.includes('<md-')) {
                this.addIssue('material-prefix', filePath, index + 1, 
                    'Material components with "md-" prefix are deprecated. Use "mat-" prefix instead.', 'error');
            }
        });
    }

    checkPackageJson(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const packageJson = JSON.parse(content);
            
            // Check Angular version
            const angularCore = packageJson.dependencies?.['@angular/core'] || 
                              packageJson.devDependencies?.['@angular/core'];
            
            if (angularCore) {
                const version = angularCore.replace(/[^0-9.]/g, '');
                const majorVersion = parseInt(version.split('.')[0]);
                
                if (majorVersion < 21) {
                    this.addSuggestion('angular-version', filePath, 
                        `Angular version ${version} detected. Consider upgrading to Angular 21.`);
                }
            }
            
            // Check for deprecated packages
            const deprecatedPackages = {
                '@angular/http': 'Use @angular/common/http instead',
                'rxjs-compat': 'Consider removing rxjs-compat and updating RxJS usage',
                'codelyzer': 'Codelyzer is deprecated. Use @angular-eslint instead'
            };
            
            Object.keys(deprecatedPackages).forEach(pkg => {
                if (packageJson.dependencies?.[pkg] || packageJson.devDependencies?.[pkg]) {
                    this.addWarning('deprecated-package', filePath, 0, 
                        `Package '${pkg}' is deprecated. ${deprecatedPackages[pkg]}`);
                }
            });
            
        } catch (error) {
            this.addWarning('package-json', filePath, 0, 'Could not parse package.json');
        }
    }

    checkTsConfig(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const tsConfig = JSON.parse(content);
            
            const compilerOptions = tsConfig.compilerOptions || {};
            
            // Check TypeScript version compatibility
            if (compilerOptions.target && !['ES2022', 'ES2023', 'ESNext'].includes(compilerOptions.target)) {
                this.addSuggestion('typescript-target', filePath, 
                    'Consider updating TypeScript target to ES2022 or higher for Angular 21.');
            }
            
            // Check for strict mode
            if (!compilerOptions.strict) {
                this.addSuggestion('typescript-strict', filePath, 
                    'Enable strict mode in TypeScript for better type safety.');
            }
            
        } catch (error) {
            this.addWarning('tsconfig', filePath, 0, 'Could not parse tsconfig.json');
        }
    }

    processFile(filePath) {
        try {
            this.fileCount++;
            const content = fs.readFileSync(filePath, 'utf8');
            const fileName = path.basename(filePath);
            
            if (fileName === 'package.json') {
                this.checkPackageJson(filePath);
                return;
            }
            
            if (fileName.startsWith('tsconfig') && fileName.endsWith('.json')) {
                this.checkTsConfig(filePath);
                return;
            }
            
            if (filePath.endsWith('.ts')) {
                this.checkDeprecatedAPIs(content, filePath);
                this.checkImportPatterns(content, filePath);
                this.checkComponentDecorator(content, filePath);
                this.checkFormControls(content, filePath);
                this.checkRxJSPatterns(content, filePath);
                this.checkAngularMaterialPatterns(content, filePath);
            }
            
        } catch (error) {
            this.addWarning('file-read', filePath, 0, `Error reading file: ${error.message}`);
        }
    }

    generateReport() {
        console.log('\n🔍 Angular 21 Compatibility Report');
        console.log('=====================================\n');
        
        console.log(`📊 Files analyzed: ${this.fileCount}`);
        console.log(`❌ Issues found: ${this.issues.length}`);
        console.log(`⚠️  Warnings: ${this.warnings.length}`);
        console.log(`💡 Suggestions: ${this.suggestions.length}\n`);
        
        if (this.issues.length > 0) {
            console.log('❌ CRITICAL ISSUES:');
            console.log('===================');
            this.issues.forEach(issue => {
                const severity = issue.severity === 'error' ? '🚨' : '⚠️';
                console.log(`${severity} ${path.relative(process.cwd(), issue.file)}:${issue.line}`);
                console.log(`   ${issue.message}\n`);
            });
        }
        
        if (this.warnings.length > 0) {
            console.log('⚠️  WARNINGS:');
            console.log('=============');
            this.warnings.forEach(warning => {
                console.log(`⚠️  ${path.relative(process.cwd(), warning.file)}:${warning.line}`);
                console.log(`   ${warning.message}\n`);
            });
        }
        
        if (this.suggestions.length > 0) {
            console.log('💡 SUGGESTIONS:');
            console.log('===============');
            this.suggestions.forEach(suggestion => {
                console.log(`💡 ${path.relative(process.cwd(), suggestion.file)}`);
                console.log(`   ${suggestion.message}\n`);
            });
        }
        
        // Summary and recommendations
        console.log('📋 SUMMARY & RECOMMENDATIONS:');
        console.log('=============================');
        
        if (this.issues.filter(i => i.severity === 'error').length > 0) {
            console.log('🚨 Critical issues found that must be fixed before upgrading to Angular 21.');
        } else {
            console.log('✅ No critical blocking issues found for Angular 21 upgrade.');
        }
        
        console.log('\n🔧 Recommended upgrade steps:');
        console.log('1. Fix all critical issues (🚨) first');
        console.log('2. Address warnings (⚠️) to ensure smooth operation');
        console.log('3. Consider implementing suggestions (💡) for better code quality');
        console.log('4. Run `ng update @angular/core @angular/cli` to upgrade');
        console.log('5. Test thoroughly after upgrade');
        
        return {
            totalFiles: this.fileCount,
            issues: this.issues.length,
            warnings: this.warnings.length,
            suggestions: this.suggestions.length,
            criticalIssues: this.issues.filter(i => i.severity === 'error').length
        };
    }
}

function main() {
    const srcDir = path.join(process.cwd(), 'apps', 'web-giddh', 'src');
    const rootDir = process.cwd();
    
    if (!fs.existsSync(srcDir)) {
        console.error('Source directory not found:', srcDir);
        process.exit(1);
    }
    
    console.log('🔍 Starting Angular 21 compatibility check...');
    
    const checker = new Angular21CompatibilityChecker();
    
    // Check TypeScript files
    const tsFiles = checker.findTypeScriptFiles(srcDir);
    console.log(`📁 Found ${tsFiles.length} TypeScript files to analyze`);
    
    // Check configuration files
    const configFiles = [
        path.join(rootDir, 'package.json'),
        path.join(rootDir, 'tsconfig.json'),
        path.join(rootDir, 'tsconfig.app.json'),
        path.join(rootDir, 'angular.json')
    ].filter(file => fs.existsSync(file));
    
    console.log('🔄 Analyzing files...\n');
    
    // Process all files
    [...tsFiles, ...configFiles].forEach(filePath => {
        checker.processFile(filePath);
    });
    
    // Generate and display report
    const summary = checker.generateReport();
    
    // Exit with appropriate code
    if (summary.criticalIssues > 0) {
        console.log('\n❌ Compatibility check completed with critical issues.');
        process.exit(1);
    } else {
        console.log('\n✅ Compatibility check completed successfully.');
        process.exit(0);
    }
}

if (require.main === module) {
    main();
}

module.exports = Angular21CompatibilityChecker;
