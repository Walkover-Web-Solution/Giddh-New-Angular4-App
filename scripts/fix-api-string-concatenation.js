#!/usr/bin/env node
/**
 * Fix API String Concatenation Issues
 * Converts string concatenation to template literals in API URL files
 */
const fs = require('fs');
const path = require('path');

class ApiStringConcatenationFixer {
    constructor() {
        this.apiUrlsDir = path.join(__dirname, '..', 'apps', 'web-giddh', 'src', 'app', 'services', 'apiurls');
        this.results = {
            filesProcessed: 0,
            concatenationsFixed: 0,
            constDeclarationsFixed: 0,
            errors: []
        };
    }

    /**
     * Process all API URL files
     */
    processAllApiFiles() {
        try {
            const files = fs.readdirSync(this.apiUrlsDir)
                .filter(file => file.endsWith('.api.ts') || file.endsWith('.ts'))
                .filter(file => !file.includes('spec'));

            console.log(`🔍 Found ${files.length} API files to process`);

            files.forEach(file => {
                const filePath = path.join(this.apiUrlsDir, file);
                this.processApiFile(filePath);
            });

            this.generateReport();
        } catch (error) {
            console.error('❌ Error processing API files:', error.message);
            this.results.errors.push(error.message);
        }
    }

    /**
     * Process individual API file
     */
    processApiFile(filePath) {
        try {
            console.log(`📝 Processing: ${path.basename(filePath)}`);

            let content = fs.readFileSync(filePath, 'utf8');
            const originalContent = content;

            // Fix let declarations to const
            content = this.fixConstDeclarations(content);

            // Fix string concatenations
            content = this.fixStringConcatenations(content);

            if (content !== originalContent) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`✅ Fixed: ${path.basename(filePath)}`);
            }

            this.results.filesProcessed++;
        } catch (error) {
            console.error(`❌ Error processing ${filePath}:`, error.message);
            this.results.errors.push(`${filePath}: ${error.message}`);
        }
    }

    /**
     * Fix let declarations to const
     */
    fixConstDeclarations(content) {
        const letRegex = /^let\s+([A-Z_][A-Z0-9_]*)\s*=/gm;
        const matches = content.match(letRegex);

        if (matches) {
            content = content.replace(letRegex, 'const $1 =');
            this.results.constDeclarationsFixed += matches.length;
        }

        return content;
    }

    /**
     * Fix string concatenations to template literals
     */
    fixStringConcatenations(content) {
        let fixedCount = 0;

        // Pattern 1: VARIABLE + 'string'
        content = content.replace(/(\w+)\s*\+\s*'([^']+)'/g, (match, variable, string) => {
            fixedCount++;
            return `\`\${${variable}}${string}\``;
        });

        // Pattern 2: VARIABLE + "string"
        content = content.replace(/(\w+)\s*\+\s*"([^"]+)"/g, (match, variable, string) => {
            fixedCount++;
            return `\`\${${variable}}${string}\``;
        });

        // Pattern 3: 'string' + VARIABLE + 'string'
        content = content.replace(/'([^']+)'\s*\+\s*(\w+)\s*\+\s*'([^']+)'/g, (match, str1, variable, str2) => {
            fixedCount++;
            return `\`${str1}\${${variable}}${str2}\``;
        });

        // Pattern 4: VARIABLE + VARIABLE2 + 'string'
        content = content.replace(/(\w+)\s*\+\s*(\w+)\s*\+\s*'([^']+)'/g, (match, var1, var2, string) => {
            fixedCount++;
            return `\`\${${var1}}\${${var2}}${string}\``;
        });

        // Pattern 5: VARIABLE + '/:param' + '/string'
        content = content.replace(/(\w+)\s*\+\s*'([^']+)'\s*\+\s*'([^']+)'/g, (match, variable, str1, str2) => {
            fixedCount++;
            return `\`\${${variable}}${str1}${str2}\``;
        });

        this.results.concatenationsFixed += fixedCount;
        return content;
    }

    /**
     * Generate comprehensive report
     */
    generateReport() {
        console.log('\n📊 API STRING CONCATENATION FIX REPORT');
        console.log('=====================================');
        console.log(`📁 Files Processed: ${this.results.filesProcessed}`);
        console.log(`🔧 String Concatenations Fixed: ${this.results.concatenationsFixed}`);
        console.log(`📝 Const Declarations Fixed: ${this.results.constDeclarationsFixed}`);
        console.log(`❌ Errors: ${this.results.errors.length}`);

        if (this.results.errors.length > 0) {
            console.log('\n❌ ERRORS:');
            this.results.errors.forEach(error => console.log(`  - ${error}`));
        }

        const totalFixes = this.results.concatenationsFixed + this.results.constDeclarationsFixed;
        if (totalFixes > 0) {
            console.log(`\n🎉 Successfully fixed ${totalFixes} code quality issues!`);
        } else {
            console.log('\n✅ No issues found or all files already compliant');
        }
    }
}

// Execute the fixer
const fixer = new ApiStringConcatenationFixer();
fixer.processAllApiFiles();
