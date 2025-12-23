#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Script to fix standalone property in Angular components
 * - Adds standalone: false if missing
 * - Ensures proper comma placement
 * - Does not modify existing standalone properties
 */

class StandaloneComponentFixer {
    constructor() {
        this.processedFiles = 0;
        this.modifiedFiles = 0;
        this.errors = [];
    }

    /**
     * Find all component TypeScript files
     */
    findComponentFiles(rootDir) {
        const pattern = path.join(rootDir, '**/*.component.ts');
        return glob.sync(pattern, { ignore: ['**/node_modules/**'] });
    }

    /**
     * Check if file content has standalone property
     */
    hasStandaloneProperty(content) {
        // Look for standalone property in @Component decorator
        const componentDecoratorRegex = /@Component\s*\(\s*\{([^}]+)\}\s*\)/s;
        const match = content.match(componentDecoratorRegex);

        if (!match) {
            return { hasProperty: false, decoratorContent: null };
        }

        const decoratorContent = match[1];
        const hasStandalone = /standalone\s*:\s*(true|false)/i.test(decoratorContent);

        return {
            hasProperty: hasStandalone,
            decoratorContent: decoratorContent.trim(),
            fullMatch: match[0]
        };
    }

    /**
     * Add standalone: false to component decorator
     */
    addStandaloneProperty(content) {
        const componentDecoratorRegex = /@Component\s*\(\s*\{([^}]+)\}\s*\)/s;
        const match = content.match(componentDecoratorRegex);

        if (!match) {
            throw new Error('Could not find @Component decorator');
        }

        let decoratorContent = match[1].trim();

        // Check if the last property has a comma
        const lastChar = decoratorContent.trim().slice(-1);
        const needsComma = lastChar !== ',' && decoratorContent.trim().length > 0;

        // Add comma if needed, then add standalone property
        const standaloneProperty = needsComma ? ',\n    standalone: false' : '\n    standalone: false';

        // Insert standalone property at the end, before the closing brace
        const newDecoratorContent = decoratorContent + standaloneProperty;

        // Replace the entire decorator
        const newDecorator = `@Component({\n    ${newDecoratorContent.replace(/^\s+/, '').replace(/\n\s*/g, '\n    ')}\n})`;

        return content.replace(componentDecoratorRegex, newDecorator);
    }

    /**
     * Process a single component file
     */
    processFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const standaloneCheck = this.hasStandaloneProperty(content);

            this.processedFiles++;

            if (!standaloneCheck.hasProperty) {
                console.log(`Adding standalone: false to ${filePath}`);
                const modifiedContent = this.addStandaloneProperty(content);
                fs.writeFileSync(filePath, modifiedContent, 'utf8');
                this.modifiedFiles++;
                return true;
            } else {
                console.log(`✓ ${filePath} already has standalone property`);
                return false;
            }
        } catch (error) {
            this.errors.push({ file: filePath, error: error.message });
            console.error(`Error processing ${filePath}: ${error.message}`);
            return false;
        }
    }

    /**
     * Process all component files in the given directory
     */
    processAllFiles(rootDir) {
        console.log(`Searching for component files in: ${rootDir}`);
        const componentFiles = this.findComponentFiles(rootDir);

        console.log(`Found ${componentFiles.length} component files`);

        componentFiles.forEach(filePath => {
            this.processFile(filePath);
        });

        this.printSummary();
    }

    /**
     * Process a single file (for testing)
     */
    processSingleFile(filePath) {
        console.log(`Processing single file: ${filePath}`);
        const result = this.processFile(filePath);
        this.printSummary();
        return result;
    }

    /**
     * Print processing summary
     */
    printSummary() {
        console.log('\n=== PROCESSING SUMMARY ===');
        console.log(`Total files processed: ${this.processedFiles}`);
        console.log(`Files modified: ${this.modifiedFiles}`);
        console.log(`Errors: ${this.errors.length}`);

        if (this.errors.length > 0) {
            console.log('\nErrors encountered:');
            this.errors.forEach(error => {
                console.log(`  - ${error.file}: ${error.error}`);
            });
        }

        console.log('\n=== PROCESSING COMPLETE ===');
    }
}

// Main execution
if (require.main === module) {
    const args = process.argv.slice(2);
    const fixer = new StandaloneComponentFixer();

    if (args.length === 0) {
        console.log('Usage:');
        console.log('  node fix-standalone.js <directory>     - Process all component files in directory');
        console.log('  node fix-standalone.js --file <path>   - Process single file');
        process.exit(1);
    }

    if (args[0] === '--file' && args[1]) {
        fixer.processSingleFile(args[1]);
    } else {
        const rootDir = args[0];
        if (!fs.existsSync(rootDir)) {
            console.error(`Directory does not exist: ${rootDir}`);
            process.exit(1);
        }
        fixer.processAllFiles(rootDir);
    }
}

module.exports = StandaloneComponentFixer;
