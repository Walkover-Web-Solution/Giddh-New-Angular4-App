const fs = require('fs');
const path = require('path');

/**
 * Script to replace mat-raised-button color="primary" with matButton="filled" in HTML files
 * This updates Angular Material button syntax for newer versions
 */

class MatButtonReplacer {
    constructor() {
        this.processedFiles = 0;
        this.modifiedFiles = 0;
        this.totalReplacements = 0;
        this.errors = [];
    }

    /**
     * Recursively find all HTML files in a directory
     */
    findHtmlFiles(dir, htmlFiles = []) {
        try {
            const files = fs.readdirSync(dir);

            for (const file of files) {
                const fullPath = path.join(dir, file);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    // Skip node_modules, dist, and other build directories
                    if (!['node_modules', 'dist', '.git', '.angular', 'coverage'].includes(file)) {
                        this.findHtmlFiles(fullPath, htmlFiles);
                    }
                } else if (file.endsWith('.html')) {
                    htmlFiles.push(fullPath);
                }
            }
        } catch (error) {
            this.errors.push(`Error reading directory ${dir}: ${error.message}`);
        }

        return htmlFiles;
    }

    /**
     * Process a single HTML file and replace mat-raised-button patterns
     */
    processFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            let modifiedContent = content;
            let fileReplacements = 0;

            // Pattern 1: mat-raised-button color="primary" (with spaces and line breaks)
            const pattern1 = /mat-raised-button\s+color="primary"/gi;
            const matches1 = content.match(pattern1);
            if (matches1) {
                modifiedContent = modifiedContent.replace(pattern1, 'matButton="filled"');
                fileReplacements += matches1.length;
            }

            // Pattern 2: color="primary" mat-raised-button (reverse order)
            const pattern2 = /color="primary"\s+mat-raised-button/gi;
            const matches2 = modifiedContent.match(pattern2);
            if (matches2) {
                modifiedContent = modifiedContent.replace(pattern2, 'matButton="filled"');
                fileReplacements += matches2.length;
            }

            // Pattern 3: mat-raised-button with color="primary" on different lines
            const pattern3 = /mat-raised-button[\s\n\r]*color="primary"/gi;
            const matches3 = modifiedContent.match(pattern3);
            if (matches3) {
                modifiedContent = modifiedContent.replace(pattern3, 'matButton="filled"');
                fileReplacements += matches3.length;
            }

            // Pattern 4: color="primary" with mat-raised-button on different lines
            const pattern4 = /color="primary"[\s\n\r]*mat-raised-button/gi;
            const matches4 = modifiedContent.match(pattern4);
            if (matches4) {
                modifiedContent = modifiedContent.replace(pattern4, 'matButton="filled"');
                fileReplacements += matches4.length;
            }

            // Write back if changes were made
            if (fileReplacements > 0) {
                fs.writeFileSync(filePath, modifiedContent, 'utf8');
                this.modifiedFiles++;
                this.totalReplacements += fileReplacements;
                console.log(`✅ Modified: ${filePath} (${fileReplacements} replacements)`);
            }

            this.processedFiles++;

        } catch (error) {
            this.errors.push(`Error processing file ${filePath}: ${error.message}`);
        }
    }

    /**
     * Main execution function
     */
    run(targetDirectory = './apps/web-giddh/src') {
        console.log('🔄 Starting mat-raised-button to matButton="filled" replacement...');
        console.log(`📁 Target directory: ${targetDirectory}`);
        console.log('');

        // Check if target directory exists
        if (!fs.existsSync(targetDirectory)) {
            console.error(`❌ Target directory does not exist: ${targetDirectory}`);
            return;
        }

        // Find all HTML files
        console.log('🔍 Finding HTML files...');
        const htmlFiles = this.findHtmlFiles(targetDirectory);
        console.log(`📄 Found ${htmlFiles.length} HTML files`);
        console.log('');

        // Process each file
        console.log('🔄 Processing files...');
        for (const filePath of htmlFiles) {
            this.processFile(filePath);
        }

        // Print summary
        console.log('');
        console.log('📊 SUMMARY:');
        console.log(`📄 Total files processed: ${this.processedFiles}`);
        console.log(`✅ Files modified: ${this.modifiedFiles}`);
        console.log(`🔄 Total replacements made: ${this.totalReplacements}`);

        if (this.errors.length > 0) {
            console.log(`❌ Errors encountered: ${this.errors.length}`);
            this.errors.forEach(error => console.log(`   ${error}`));
        }

        console.log('');
        console.log('✅ Replacement process completed!');

        if (this.modifiedFiles > 0) {
            console.log('');
            console.log('📝 NEXT STEPS:');
            console.log('1. Review the changes in your version control system');
            console.log('2. Test the application to ensure buttons work correctly');
            console.log('3. Update any related CSS/SCSS if needed');
            console.log('4. Consider updating Angular Material imports if required');
        }
    }
}

// Execute the script
const replacer = new MatButtonReplacer();

// Get target directory from command line argument or use default
const targetDir = process.argv[2] || './apps/web-giddh/src';
replacer.run(targetDir);
