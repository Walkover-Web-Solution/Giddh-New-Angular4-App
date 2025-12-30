#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to add maxWidth property to Angular Material dialog.open() calls
 * - If width exists but maxWidth doesn't, adds maxWidth with same value as width
 * - Properly formats dialog configuration objects
 * - Processes TypeScript files recursively
 */

class DialogMaxWidthUpdater {
    constructor() {
        this.processedFiles = 0;
        this.modifiedFiles = 0;
        this.totalModifications = 0;
    }

    /**
     * Process directory recursively
     */
    processDirectory(dirPath) {
        const items = fs.readdirSync(dirPath);

        for (const item of items) {
            const fullPath = path.join(dirPath, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                // Skip node_modules and other irrelevant directories
                if (!['node_modules', '.git', 'dist', 'build', '.angular'].includes(item)) {
                    this.processDirectory(fullPath);
                }
            } else if (stat.isFile() && fullPath.endsWith('.ts')) {
                this.processFile(fullPath);
            }
        }
    }

    /**
     * Process individual TypeScript file
     */
    processFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const modifiedContent = this.updateDialogCalls(content);

            this.processedFiles++;

            if (modifiedContent !== content) {
                fs.writeFileSync(filePath, modifiedContent, 'utf8');
                this.modifiedFiles++;
                console.log(`✅ Modified: ${filePath}`);
            }
        } catch (error) {
            console.error(`❌ Error processing ${filePath}:`, error.message);
        }
    }

    /**
     * Update dialog.open() calls in file content
     */
    updateDialogCalls(content) {
        // More comprehensive regex to handle multiline dialog.open() calls
        const dialogOpenRegex = /(\w+\.dialog\.open\([^,]+,\s*)(\{[\s\S]*?\})/g;

        let modifiedContent = content;
        let match;
        const modifications = [];

        // Find all dialog.open() calls
        while ((match = dialogOpenRegex.exec(content)) !== null) {
            const fullMatch = match[0];
            const prefix = match[1];
            const configObject = match[2];

            // Check if this config object needs modification or formatting
            const updatedConfig = this.updateAndFormatConfigObject(configObject, content, match.index);

            if (updatedConfig !== configObject) {
                modifications.push({
                    original: fullMatch,
                    updated: prefix + updatedConfig,
                    startIndex: match.index
                });
            }
        }

        // Apply modifications in reverse order to maintain string indices
        modifications.reverse().forEach(mod => {
            modifiedContent = modifiedContent.substring(0, mod.startIndex) +
                            mod.updated +
                            modifiedContent.substring(mod.startIndex + mod.original.length);
            this.totalModifications++;
        });

        return modifiedContent;
    }

    /**
     * Update configuration object to add maxWidth if needed and format it properly
     */
    updateAndFormatConfigObject(configStr, content, startIndex) {
        try {
            // Parse the configuration object
            const properties = this.parseConfigProperties(configStr);

            // Check if width exists
            const widthProp = properties.find(p => p.key === 'width');
            if (!widthProp) {
                return configStr; // No width property found
            }

            // Check if maxWidth already exists
            const maxWidthProp = properties.find(p => p.key === 'maxWidth');
            if (maxWidthProp) {
                // maxWidth exists, but check if formatting needs improvement
                return this.formatConfigObject(properties, content, startIndex);
            }

            // Add maxWidth property
            const maxWidthProperty = {
                key: 'maxWidth',
                value: widthProp.value,
                raw: `maxWidth: ${widthProp.value}`
            };

            // Insert maxWidth after width
            const widthIndex = properties.findIndex(p => p.key === 'width');
            properties.splice(widthIndex + 1, 0, maxWidthProperty);

            return this.formatConfigObject(properties, content, startIndex);

        } catch (error) {
            console.warn('Error parsing config object:', configStr, error.message);
            return configStr;
        }
    }

    /**
     * Parse configuration object properties
     */
    parseConfigProperties(configStr) {
        const properties = [];
        const innerConfig = configStr.slice(1, -1).trim();

        // Simple property parsing - handles basic cases
        const propertyRegex = /(\w+):\s*([^,}]+)/g;
        let match;

        while ((match = propertyRegex.exec(innerConfig)) !== null) {
            properties.push({
                key: match[1].trim(),
                value: match[2].trim(),
                raw: match[0].trim()
            });
        }

        return properties;
    }

    /**
     * Format configuration object with proper indentation
     */
    formatConfigObject(properties, content, startIndex) {
        // Detect base indentation from the surrounding code
        const lines = content.substring(0, startIndex).split('\n');
        const currentLine = lines[lines.length - 1];
        const baseIndent = currentLine.match(/^(\s*)/)[1];
        const propertyIndent = baseIndent + '            '; // Add 12 spaces for properties

        // Build formatted config object
        let formatted = '{\n';

        properties.forEach((prop, index) => {
            formatted += `${propertyIndent}${prop.raw}`;
            if (index < properties.length - 1) {
                formatted += ',';
            }
            formatted += '\n';
        });

        formatted += `${baseIndent}        }`; // Close with 8 spaces less than properties

        return formatted;
    }

    /**
     * Run the updater
     */
    run(targetPath = './apps/web-giddh/src') {
        console.log('🚀 Starting Dialog MaxWidth Updater...');
        console.log(`📁 Target directory: ${path.resolve(targetPath)}`);

        if (!fs.existsSync(targetPath)) {
            console.error(`❌ Target directory does not exist: ${targetPath}`);
            process.exit(1);
        }

        this.processDirectory(targetPath);

        console.log('\n📊 Summary:');
        console.log(`📄 Files processed: ${this.processedFiles}`);
        console.log(`✏️  Files modified: ${this.modifiedFiles}`);
        console.log(`🔧 Total modifications: ${this.totalModifications}`);

        if (this.modifiedFiles > 0) {
            console.log('\n✅ Dialog maxWidth properties added and formatted successfully!');
        } else {
            console.log('\n ℹ️  No dialog.open() calls needed maxWidth updates.');
        }
    }
}

// Run the script
const targetDir = process.argv[2] || './apps/web-giddh/src';
const updater = new DialogMaxWidthUpdater();
updater.run(targetDir);
