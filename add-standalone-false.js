#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to add standalone: false to Angular components, pipes, and directives
 * that don't already have a standalone property
 * Usage: node add-standalone-false.js [directory]
 * Default directory: ./apps/web-giddh/src
 */

class StandaloneFalseAdder {
    constructor(targetDirectory = './apps/web-giddh/src') {
        this.targetDirectory = path.resolve(targetDirectory);
        this.processedFiles = 0;
        this.modifiedFiles = 0;
        this.totalAdditions = 0;
        this.skippedFiles = 0;
    }

    /**
     * Process all TypeScript files recursively
     */
    async processDirectory(dir = this.targetDirectory) {
        try {
            const entries = fs.readdirSync(dir, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);

                if (entry.isDirectory()) {
                    // Skip node_modules, dist, and other build directories
                    if (!['node_modules', 'dist', '.git', 'coverage', '.angular'].includes(entry.name)) {
                        await this.processDirectory(fullPath);
                    }
                } else if (entry.isFile() && entry.name.endsWith('.ts')) {
                    await this.processFile(fullPath);
                }
            }
        } catch (error) {
            console.error(`Error processing directory ${dir}:`, error.message);
        }
    }

    /**
     * Process individual TypeScript file
     */
    async processFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const modifiedContent = this.addStandaloneFalse(content, filePath);

            this.processedFiles++;

            if (content !== modifiedContent) {
                fs.writeFileSync(filePath, modifiedContent, 'utf8');
                this.modifiedFiles++;
                console.log(`✅ Modified: ${path.relative(this.targetDirectory, filePath)}`);
            }
        } catch (error) {
            console.error(`Error processing file ${filePath}:`, error.message);
        }
    }

    /**
     * Add standalone: false to decorators that don't have standalone property
     */
    addStandaloneFalse(content, filePath) {
        let modifiedContent = content;
        let additions = 0;

        // Find all @Component, @Pipe, and @Directive decorators
        const decoratorPattern = /@(Component|Pipe|Directive)\s*\(\s*\{/g;
        let match;
        const modifications = [];

        while ((match = decoratorPattern.exec(content)) !== null) {
            const decoratorType = match[1];
            const startIndex = match.index;

            // Find the complete decorator object
            const decoratorObject = this.extractDecoratorObject(content, startIndex);

            if (decoratorObject) {
                // Check if standalone property already exists
                if (!this.hasStandaloneProperty(decoratorObject.content)) {
                    // Determine where to insert standalone: false
                    const insertPosition = this.findInsertPosition(decoratorObject.content);

                    if (insertPosition !== -1) {
                        modifications.push({
                            start: decoratorObject.start + insertPosition,
                            insertion: this.createStandaloneInsertion(decoratorObject.content, insertPosition),
                            type: decoratorType
                        });
                        additions++;
                    }
                }
            }
        }

        // Apply modifications in reverse order to maintain correct indices
        modifications.sort((a, b) => b.start - a.start);

        for (const mod of modifications) {
            modifiedContent = modifiedContent.slice(0, mod.start) +
                            mod.insertion +
                            modifiedContent.slice(mod.start);
        }

        this.totalAdditions += additions;

        if (additions > 0) {
            console.log(`   - Added standalone: false to ${additions} decorator(s)`);
        }

        return modifiedContent;
    }

    /**
     * Extract complete decorator object with proper brace matching
     */
    extractDecoratorObject(content, startIndex) {
        const openBraceIndex = content.indexOf('{', startIndex);
        if (openBraceIndex === -1) return null;

        let braceCount = 0;
        let endIndex = openBraceIndex;

        for (let i = openBraceIndex; i < content.length; i++) {
            if (content[i] === '{') {
                braceCount++;
            } else if (content[i] === '}') {
                braceCount--;
                if (braceCount === 0) {
                    endIndex = i;
                    break;
                }
            }
        }

        if (braceCount !== 0) return null;

        return {
            start: openBraceIndex,
            end: endIndex,
            content: content.slice(openBraceIndex, endIndex + 1)
        };
    }

    /**
     * Check if decorator already has standalone property
     */
    hasStandaloneProperty(decoratorContent) {
        // Look for standalone property (with various whitespace patterns)
        const standalonePattern = /standalone\s*:\s*(true|false)/;
        return standalonePattern.test(decoratorContent);
    }

    /**
     * Find the best position to insert standalone: false
     */
    findInsertPosition(decoratorContent) {
        // Try to insert after selector if it exists
        const selectorMatch = decoratorContent.match(/selector\s*:\s*['"'][^'"]*['"],?\s*/);
        if (selectorMatch) {
            const afterSelector = selectorMatch.index + selectorMatch[0].length;
            return afterSelector;
        }

        // Try to insert after templateUrl if it exists
        const templateUrlMatch = decoratorContent.match(/templateUrl\s*:\s*['"'][^'"]*['"],?\s*/);
        if (templateUrlMatch) {
            const afterTemplateUrl = templateUrlMatch.index + templateUrlMatch[0].length;
            return afterTemplateUrl;
        }

        // Try to insert after template if it exists
        const templateMatch = decoratorContent.match(/template\s*:\s*[`'"]/);
        if (templateMatch) {
            // For template, we need to find the end of the template string
            const templateStart = templateMatch.index + templateMatch[0].length - 1;
            const quote = decoratorContent[templateStart];
            let templateEnd = templateStart + 1;

            if (quote === '`') {
                // Handle template literals
                while (templateEnd < decoratorContent.length && decoratorContent[templateEnd] !== '`') {
                    if (decoratorContent[templateEnd] === '\\') templateEnd++; // Skip escaped characters
                    templateEnd++;
                }
                templateEnd++; // Include closing backtick
            } else {
                // Handle regular strings
                while (templateEnd < decoratorContent.length && decoratorContent[templateEnd] !== quote) {
                    if (decoratorContent[templateEnd] === '\\') templateEnd++; // Skip escaped characters
                    templateEnd++;
                }
                templateEnd++; // Include closing quote
            }

            // Skip comma and whitespace
            while (templateEnd < decoratorContent.length &&
                   /[,\s]/.test(decoratorContent[templateEnd])) {
                templateEnd++;
            }

            return templateEnd;
        }

        // Try to insert after name property (for pipes)
        const nameMatch = decoratorContent.match(/name\s*:\s*['"'][^'"]*['"],?\s*/);
        if (nameMatch) {
            const afterName = nameMatch.index + nameMatch[0].length;
            return afterName;
        }

        // Insert at the beginning (after opening brace)
        return 1; // After the opening '{'
    }

    /**
     * Create the standalone: false insertion string
     */
    createStandaloneInsertion(decoratorContent, insertPosition) {
        const beforeInsertion = decoratorContent.slice(0, insertPosition);
        const afterInsertion = decoratorContent.slice(insertPosition);

        // Determine indentation by looking at the current line structure
        const lines = decoratorContent.split('\n');
        let indentation = '  '; // Default indentation

        // Find existing property indentation
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine && !trimmedLine.startsWith('{') && !trimmedLine.startsWith('}')) {
                const match = line.match(/^(\s*)/);
                if (match) {
                    indentation = match[1];
                    break;
                }
            }
        }

        // Check if we need a comma before
        const needsCommaBefore = insertPosition > 1 &&
                                !/[,\s{]$/.test(beforeInsertion.trim());

        // Check if we need a comma after
        const needsCommaAfter = afterInsertion.trim().length > 1 &&
                               !afterInsertion.trim().startsWith(',') &&
                               !afterInsertion.trim().startsWith('}');

        let insertion = '';

        if (needsCommaBefore) {
            insertion += ',';
        }

        insertion += '\n' + indentation + 'standalone: false';

        if (needsCommaAfter) {
            insertion += ',';
        }

        return insertion;
    }

    /**
     * Display summary of processing
     */
    displaySummary() {
        console.log('\n' + '='.repeat(60));
        console.log('STANDALONE: FALSE ADDITION SUMMARY');
        console.log('='.repeat(60));
        console.log(`📁 Target Directory: ${this.targetDirectory}`);
        console.log(`📄 Files Processed: ${this.processedFiles}`);
        console.log(`✏️  Files Modified: ${this.modifiedFiles}`);
        console.log(`➕ Total Additions: ${this.totalAdditions}`);
        console.log('='.repeat(60));

        if (this.modifiedFiles > 0) {
            console.log('✅ Addition completed successfully!');
            console.log('💡 All components/pipes/directives now have explicit standalone: false.');
        } else {
            console.log('ℹ️  No decorators found that needed standalone: false.');
        }

        console.log('\n📋 WHAT WAS PROCESSED:');
        console.log('• @Component decorators without standalone property');
        console.log('• @Pipe decorators without standalone property');
        console.log('• @Directive decorators without standalone property');
        console.log('\n🔒 WHAT WAS PRESERVED:');
        console.log('• Existing standalone: true declarations (unchanged)');
        console.log('• Existing standalone: false declarations (unchanged)');
        console.log('• All other decorator properties (unchanged)');
    }
}

// Main execution
async function main() {
    const targetDir = process.argv[2] || './apps/web-giddh/src';

    console.log('🚀 Starting standalone: false addition...');
    console.log(`📂 Target directory: ${path.resolve(targetDir)}\n`);

    if (!fs.existsSync(targetDir)) {
        console.error(`❌ Error: Directory "${targetDir}" does not exist.`);
        process.exit(1);
    }

    const adder = new StandaloneFalseAdder(targetDir);

    try {
        await adder.processDirectory();
        adder.displaySummary();
    } catch (error) {
        console.error('❌ Fatal error during processing:', error.message);
        process.exit(1);
    }
}

// Run the script
if (require.main === module) {
    main().catch(console.error);
}

module.exports = StandaloneFalseAdder;
