#!/usr/bin/env node
/**
 * Documentation Generator Script
 * Enhances code documentation by adding JSDoc comments and improving code readability
 */
import fs from 'fs';
import path from 'path';
class DocumentationGenerator {
    constructor() {
        this.processedFiles = 0;
        this.modifiedFiles = 0;
        this.totalAdditions = 0;
        this.errors = [];
        this.dryRun = process.argv.includes('--dry-run');
        this.verbose = process.argv.includes('--verbose');
    }
    /**
     * Find TypeScript files that need documentation
     */
    findTypeScriptFiles(dir, tsFiles = []) {
        try {
            const files = fs.readdirSync(dir);
            for (const file of files) {
                const fullPath = path.join(dir, file);
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                    // Skip node_modules, dist, and other build directories
                    if (!['node_modules', 'dist', '.git', '.angular', 'coverage'].includes(file)) {
                        this.findTypeScriptFiles(fullPath, tsFiles);
                    }
                } else if (file.endsWith('.ts') && !file.endsWith('.d.ts') && !file.endsWith('.spec.ts')) {
                    tsFiles.push(fullPath);
                }
            }
        } catch (error) {
            this.errors.push(`Error reading directory ${dir}: ${error.message}`);
        }
        return tsFiles;
    }
    /**
     * Analyze TypeScript file and add missing documentation
     */
    enhanceDocumentation(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            let enhancedContent = content;
            const additions = 0;
            // Add file header documentation if missing
            if (!content.startsWith('/**') && !content.startsWith('/*')) {
                const fileName = path.basename(filePath);
                const fileHeader = this.generateFileHeader(fileName);
                enhancedContent = fileHeader + '\n\n' + enhancedContent;
                additions += 1;
            }
            // Add class documentation
            enhancedContent = this.addClassDocumentation(enhancedContent);
            // Add method documentation
            const methodsAdded = this.addMethodDocumentation(enhancedContent);
            enhancedContent = methodsAdded.content;
            additions += methodsAdded.count;
            // Add property documentation
            const propertiesAdded = this.addPropertyDocumentation(enhancedContent);
            enhancedContent = propertiesAdded.content;
            additions += propertiesAdded.count;
            // Add interface documentation
            const interfacesAdded = this.addInterfaceDocumentation(enhancedContent);
            enhancedContent = interfacesAdded.content;
            additions += interfacesAdded.count;
            // Write back if changes were made and not in dry run mode
            if (additions > 0) {
                if (!this.dryRun) {
                    fs.writeFileSync(filePath, enhancedContent, 'utf8');
                }
                this.modifiedFiles++;
                this.totalAdditions += additions;
                const action = this.dryRun ? '[DRY RUN]' : '✅';
            }
            this.processedFiles++;
        } catch (error) {
            this.errors.push(`Error processing file ${filePath}: ${error.message}`);
        }
    }
    /**
     * Generate file header documentation
     */
    generateFileHeader(fileName) {
        const currentDate = new Date().getFullYear();
        return `/**
 * @fileoverview ${this.generateFileDescription(fileName)}
 * @author Giddh Development Team
 * @since ${currentDate}
 */`;
    }
    /**
     * Generate file description based on filename
     */
    generateFileDescription(fileName) {
        const baseName = fileName.replace(/\.(component|service|directive|pipe|guard|interceptor|module)\.ts$/, '');
        const type = fileName.match(/\.(component|service|directive|pipe|guard|interceptor|module)\.ts$/)?.[1] || 'utility';
        const descriptions = {
            component: `${this.capitalize(baseName)} component for handling user interface and interactions`,
            service: `${this.capitalize(baseName)} service for business logic and data management`,
            directive: `${this.capitalize(baseName)} directive for DOM manipulation and behavior`,
            pipe: `${this.capitalize(baseName)} pipe for data transformation`,
            guard: `${this.capitalize(baseName)} guard for route protection and access control`,
            interceptor: `${this.capitalize(baseName)} interceptor for HTTP request/response handling`,
            module: `${this.capitalize(baseName)} module for feature organization and dependency management`,
            utility: `${this.capitalize(baseName)} utility functions and helpers`
        };
        return descriptions[type];
    }
    /**
     * Add class documentation
     */
    addClassDocumentation(content) {
        // Match class declarations without preceding JSDoc
        const classPattern = /(?<!\/\*\*[\s\S]*?\*\/\s*)\n(export\s+)?(abstract\s+)?class\s+(\w+)/g;
        return content.replace(classPattern, (match, exportKeyword, abstractKeyword, className) => {
            const classDoc = `
/**
 * ${className} class
 *
 * @description Handles ${className.toLowerCase()} functionality and operations
 * @export
 * @class ${className}
 */
${match}`;
            return classDoc;
        });
    }
    /**
     * Add method documentation
     */
    addMethodDocumentation(content) {
        let modifiedContent = content;
        let count = 0;
        // Match method declarations without preceding JSDoc
        const methodPattern = /(?<!\/\*\*[\s\S]*?\*\/\s*)\n\s*(public|private|protected)?\s*(static\s+)?(async\s+)?(\w+)\s*\([^)]*\)\s*:\s*([^{]+)\s*\{/g;
        modifiedContent = modifiedContent.replace(methodPattern, (match, visibility, staticKeyword, asyncKeyword, methodName, returnType) => {
            // Skip constructors and lifecycle methods
            if (methodName === 'constructor' || this.isAngularLifecycleMethod(methodName)) {
                return match;
            }
            const methodDoc = `
    /**
     * ${this.generateMethodDescription(methodName)}
     *
     * @memberof ${this.extractClassName(content)}
     * @returns {${returnType.trim()}} ${this.generateReturnDescription(returnType)}
     */
${match}`;
            count += 1;
            return methodDoc;
        });
        return { content: modifiedContent, count };
    }
    /**
     * Add property documentation
     */
    addPropertyDocumentation(content) {
        let modifiedContent = content;
        let count = 0;
        // Match property declarations without preceding JSDoc
        const propertyPattern = /(?<!\/\*\*[\s\S]*?\*\/\s*)\n\s*(public|private|protected)?\s*(readonly\s+)?(\w+)\s*:\s*([^=;]+)[=;]/g;
        modifiedContent = modifiedContent.replace(propertyPattern, (match, visibility, readonly, propertyName, propertyType) => {
            // Skip simple properties and Angular decorators
            if (propertyName.startsWith('_') || this.isSimpleProperty(propertyName)) {
                return match;
            }
            const propertyDoc = `
    /**
     * ${this.generatePropertyDescription(propertyName)}
     * @type {${propertyType.trim()}}
     * @memberof ${this.extractClassName(content)}
     */
${match}`;
            count += 1;
            return propertyDoc;
        });
        return { content: modifiedContent, count };
    }
    /**
     * Add interface documentation
     */
    addInterfaceDocumentation(content) {
        let modifiedContent = content;
        let count = 0;
        // Match interface declarations without preceding JSDoc
        const interfacePattern = /(?<!\/\*\*[\s\S]*?\*\/\s*)\n(export\s+)?interface\s+(\w+)/g;
        modifiedContent = modifiedContent.replace(interfacePattern, (match, exportKeyword, interfaceName) => {
            const interfaceDoc = `
/**
 * ${interfaceName} interface
 *
 * @description Defines the structure and contract for ${interfaceName.toLowerCase()} objects
 * @export
 * @interface ${interfaceName}
 */
${match}`;
            count += 1;
            return interfaceDoc;
        });
        return { content: modifiedContent, count };
    }
    /**
     * Helper methods
     */
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    isAngularLifecycleMethod(methodName) {
        const lifecycleMethods = [
            'ngOnInit', 'ngOnDestroy', 'ngOnChanges', 'ngDoCheck',
            'ngAfterContentInit', 'ngAfterContentChecked', 'ngAfterViewInit', 'ngAfterViewChecked'
        ];
        return lifecycleMethods.includes(methodName);
    }
    isSimpleProperty(propertyName) {
        const simpleProperties = ['id', 'name', 'value', 'type', 'data', 'config'];
        return simpleProperties.includes(propertyName);
    }
    extractClassName(content) {
        const classMatch = content.match(/class\s+(\w+)/);
        return classMatch ? classMatch[1] : 'UnknownClass';
    }
    generateMethodDescription(methodName) {
        // Convert camelCase to readable description
        const readable = methodName.replace(/([A-Z])/g, ' $1').toLowerCase();
        return `Handles ${readable} functionality`;
    }
    generatePropertyDescription(propertyName) {
        const readable = propertyName.replace(/([A-Z])/g, ' $1').toLowerCase();
        return `${this.capitalize(readable)} property`;
    }
    generateReturnDescription(returnType) {
        const type = returnType.trim().toLowerCase();
        if (type.includes('observable')) return 'Observable stream of data';
        if (type.includes('promise')) return 'Promise that resolves with result';
        if (type === 'void') return 'No return value';
        if (type === 'boolean') return 'True if successful, false otherwise';
        return `The ${type} result`;
    }
    /**
     * Generate summary report
     */
    generateReport() {
        if (this.dryRun) {
        }
        if (this.errors.length > 0) {
            // Error reporting removed for production
        }
        if (this.totalAdditions > 0) {
        }
    }
    /**
     * Main execution function
     */
    run(targetDirectory = './apps/web-giddh/src/app') {
        // Check if target directory exists
        if (!fs.existsSync(targetDirectory)) {
            return;
        }
        // Find all TypeScript files
        const tsFiles = this.findTypeScriptFiles(targetDirectory);
        // Process each file
        for (const filePath of tsFiles) {
            this.enhanceDocumentation(filePath);
        }
        // Generate report
        this.generateReport();
    }
}
// Execute the script
const generator = new DocumentationGenerator();
// Get target directory from command line argument or use default
const targetDir = process.argv.find(arg => !arg.startsWith('--') && arg !== __filename && arg !== 'node') || './apps/web-giddh/src/app';
generator.run(targetDir);
