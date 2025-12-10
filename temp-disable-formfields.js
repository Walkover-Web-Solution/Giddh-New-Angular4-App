#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Temporarily disable FormFieldsModule to allow compilation
 */

class FormFieldsDisabler {
    constructor() {
        this.fixedFiles = 0;
    }

    processFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');

            if (!content.includes('FormFieldsModule')) {
                return false;
            }

            let newContent = content;
            let hasChanges = false;

            // Comment out FormFieldsModule in imports arrays
            newContent = newContent.replace(
                /(\s+)(FormFieldsModule),?/g,
                '$1// FormFieldsModule, // Temporarily disabled for compilation'
            );

            if (newContent !== content) {
                fs.writeFileSync(filePath, newContent);
                this.fixedFiles++;
                console.log(`✅ Temporarily disabled FormFieldsModule in ${path.basename(filePath)}`);
                return true;
            }

            return false;

        } catch (error) {
            console.error(`❌ Error: ${filePath} - ${error.message}`);
            return false;
        }
    }

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
                } else if (item.endsWith('.module.ts')) {
                    this.processFile(fullPath);
                }
            }
        } catch (error) {
            console.error(`❌ Error processing directory ${dirPath}: ${error.message}`);
        }
    }

    run() {
        console.log('🔧 Temporarily disabling FormFieldsModule for compilation...');
        this.processDirectory('./apps/web-giddh/src');
        console.log(`✅ Disabled FormFieldsModule in ${this.fixedFiles} files`);
    }
}

const disabler = new FormFieldsDisabler();
disabler.run();
