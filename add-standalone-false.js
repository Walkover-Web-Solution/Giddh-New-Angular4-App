#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to add standalone: false to Angular components, pipes, and directives
 * that don't already have a standalone property defined.
 *
 * Features:
 * - Preserves existing standalone: true declarations
 * - Avoids duplicate standalone: false declarations
 * - Supports both NgModule and standalone architectures
 * - Processes .ts files recursively
 */

class StandaloneProcessor {
    constructor() {
        this.processedFiles = 0;
        this.modifiedFiles = 0;
        this.skippedFiles = 0;
        this.errors = [];
    }

    /**
     * Main entry point
     */
    async process(directory = './apps/web-giddh/src') {
        console.log('🚀 Starting Angular 21 Standalone Compatibility Script');
        console.log(`📁 Processing directory: ${directory}`);
        console.log('');

        await this.processDirectory(directory);
        this.printSummary();
    }

    /**
     * Process all TypeScript files in directory recursively
     */
    async processDirectory(dir) {
        try {
            const entries = fs.readdirSync(dir, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);

                if (entry.isDirectory()) {
                    // Skip node_modules and other irrelevant directories
                    if (!this.shouldSkipDirectory(entry.name)) {
                        await this.processDirectory(fullPath);
                    }
                } else if (entry.isFile() && entry.name.endsWith('.ts')) {
                    await this.processFile(fullPath);
                }
            }
        } catch (error) {
            this.errors.push(`Error processing directory ${dir}: ${error.message}`);
        }
    }

    /**
     * Check if directory should be skipped
     */
    shouldSkipDirectory(dirName) {
        const skipDirs = ['node_modules', '.git', 'dist', 'build', 'coverage', '.angular'];
        return skipDirs.includes(dirName);
    }

    /**
     * Process individual TypeScript file
     */
    async processFile(filePath) {
        try {
            this.processedFiles++;

            const content = fs.readFileSync(filePath, 'utf8');
            const modifiedContent = this.addStandaloneFalse(content, filePath);

            if (modifiedContent !== content) {
                fs.writeFileSync(filePath, modifiedContent, 'utf8');
                this.modifiedFiles++;
                console.log(`✅ Modified: ${this.getRelativePath(filePath)}`);
            } else {
                this.skippedFiles++;
            }
        } catch (error) {
            this.errors.push(`Error processing file ${filePath}: ${error.message}`);
            console.log(`❌ Error: ${this.getRelativePath(filePath)} - ${error.message}`);
        }
    }

    /**
     * Add standalone: false to decorators that need it
     */
    addStandaloneFalse(content, filePath) {
        let result = content;
        let modified = false;

        // Find all decorator patterns
        const decoratorRegex = /@(Component|Pipe|Directive)\s*\(\s*\{/g;
        let match;
        const modifications = [];

        // Collect all matches first to avoid issues with string replacement
        while ((match = decoratorRegex.exec(content)) !== null) {
            const decoratorType = match[1];
            const matchStart = match.index;

            // Find the complete decorator object
            const decoratorObj = this.extractDecoratorObject(content, matchStart);

            if (decoratorObj) {
                const { startIndex, endIndex, objectContent } = decoratorObj;

                // Check if standalone property already exists
                if (!this.hasStandaloneProperty(objectContent)) {
                    // Add standalone: false
                    const modifiedDecorator = this.insertStandaloneFalse(objectContent, decoratorType);

                    if (modifiedDecorator !== objectContent) {
                        modifications.push({
                            startIndex,
                            endIndex,
                            newContent: modifiedDecorator,
                            decoratorType
                        });
                    }
                }
            }
        }

        // Apply modifications in reverse order to maintain correct indices
        modifications.reverse().forEach(mod => {
            console.log(`  📝 Adding standalone: false to ${mod.decoratorType} in ${this.getRelativePath(filePath)}`);
            result = result.substring(0, mod.startIndex) + mod.newContent + result.substring(mod.endIndex);
            modified = true;
        });

        return result;
    }

    /**
     * Extract the complete decorator object from the content
     */
    extractDecoratorObject(content, startOffset) {
        let braceCount = 0;
        let startIndex = -1;
        let endIndex = -1;

        // Find the opening brace
        for (let i = startOffset; i < content.length; i++) {
            if (content[i] === '{') {
                if (startIndex === -1) {
                    startIndex = i;
                }
                braceCount++;
            } else if (content[i] === '}') {
                braceCount--;
                if (braceCount === 0) {
                    endIndex = i + 1;
                    break;
                }
            }
        }

        if (startIndex !== -1 && endIndex !== -1) {
            const objectContent = content.substring(startIndex, endIndex);
            return { startIndex, endIndex, objectContent };
        }

        return null;
    }

    /**
     * Check if the decorator object already has a standalone property
     */
    hasStandaloneProperty(decoratorContent) {
        // Look for standalone property (true or false)
        const standalonePattern = /standalone\s*:\s*(true|false)/;
        return standalonePattern.test(decoratorContent);
    }

    /**
     * Insert standalone: false into the decorator object
     */
    insertStandaloneFalse(decoratorContent, decoratorType) {
        // Find a good place to insert standalone: false
        // Try to insert after selector if it exists, otherwise at the beginning

        const selectorMatch = decoratorContent.match(/selector\s*:\s*['"'][^'"]*['"][,]?/);

        if (selectorMatch) {
            // Insert after selector
            const insertIndex = selectorMatch.index + selectorMatch[0].length;
            const needsComma = !selectorMatch[0].endsWith(',');
            const insertion = needsComma ? ',\n  standalone: false' : '\n  standalone: false';

            return decoratorContent.substring(0, insertIndex) +
                   insertion +
                   decoratorContent.substring(insertIndex);
        } else {
            // Insert at the beginning (after opening brace)
            const openBraceIndex = decoratorContent.indexOf('{');
            if (openBraceIndex !== -1) {
                const insertion = '\n  standalone: false,';
                return decoratorContent.substring(0, openBraceIndex + 1) +
                       insertion +
                       decoratorContent.substring(openBraceIndex + 1);
            }
        }

        return decoratorContent;
    }

    /**
     * Get relative path for display
     */
    getRelativePath(fullPath) {
        return path.relative(process.cwd(), fullPath);
    }

    /**
     * Print processing summary
     */
    printSummary() {
        console.log('\n📊 Processing Summary:');
        console.log('='.repeat(50));
        console.log(`📁 Total files processed: ${this.processedFiles}`);
        console.log(`✅ Files modified: ${this.modifiedFiles}`);
        console.log(`⏭️  Files skipped: ${this.skippedFiles}`);
        console.log(`❌ Errors: ${this.errors.length}`);

        if (this.errors.length > 0) {
            console.log('\n❌ Errors encountered:');
            this.errors.forEach(error => console.log(`  - ${error}`));
        }

        console.log('\n🎉 Angular 21 Standalone Compatibility Complete!');
        console.log('✨ Your application now supports both NgModule and Standalone architectures');
    }
}

// CLI execution
if (require.main === module) {
    const processor = new StandaloneProcessor();
    const targetDir = process.argv[2] || './apps/web-giddh/src';

    processor.process(targetDir).catch(error => {
        console.error('❌ Script failed:', error);
        process.exit(1);
    });
}

module.exports = StandaloneProcessor;
