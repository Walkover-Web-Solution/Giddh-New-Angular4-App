#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Script to add standalone: false to all @Component decorators in financial-reports directory
 * This is required for Angular 21 compatibility with NgModule-based architecture
 */

function addStandaloneFalse(content) {
    let modified = false;

    // Pattern to match @Component decorators that don't already have standalone property
    const componentPattern = /@Component\s*\(\s*\{([^}]*)\}\s*\)/gs;

    content = content.replace(componentPattern, (match, componentConfig) => {
        // Check if standalone is already present
        if (componentConfig.includes('standalone')) {
            return match; // Already has standalone property
        }

        // Add standalone: false to the component config
        // Find the last property and add standalone: false after it
        const trimmedConfig = componentConfig.trim();

        // If config ends with a comma, add standalone: false
        if (trimmedConfig.endsWith(',')) {
            const newConfig = trimmedConfig + '\n    standalone: false';
            modified = true;
            return `@Component({\n${newConfig}\n})`;
        } else {
            // Add comma and standalone: false
            const newConfig = trimmedConfig + ',\n    standalone: false';
            modified = true;
            return `@Component({\n${newConfig}\n})`;
        }
    });

    return { content, modified };
}

function processFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const result = addStandaloneFalse(content);

        if (result.modified) {
            fs.writeFileSync(filePath, result.content, 'utf8');
            console.log(`✅ Updated: ${filePath}`);
            return true;
        } else {
            console.log(`⏭️  No changes needed: ${filePath}`);
            return false;
        }
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        return false;
    }
}

function findComponentFiles(directory) {
    const pattern = path.join(directory, '**/*.component.ts');
    return glob.sync(pattern, {
        ignore: [
            '**/node_modules/**',
            '**/dist/**',
            '**/build/**',
            '**/.git/**'
        ]
    });
}

function main() {
    const targetDirectory = './apps/web-giddh/src/app/financial-reports';

    console.log(`🔍 Searching for component files in: ${targetDirectory}`);

    if (!fs.existsSync(targetDirectory)) {
        console.error(`❌ Directory not found: ${targetDirectory}`);
        process.exit(1);
    }

    const componentFiles = findComponentFiles(targetDirectory);
    console.log(`📁 Found ${componentFiles.length} component files`);

    if (componentFiles.length === 0) {
        console.log('No component files found to process.');
        return;
    }

    let processedCount = 0;
    let modifiedCount = 0;

    console.log('\n🚀 Starting standalone: false addition process...\n');

    componentFiles.forEach(filePath => {
        processedCount++;
        const wasModified = processFile(filePath);
        if (wasModified) {
            modifiedCount++;
        }
    });

    console.log('\n📊 Summary:');
    console.log(`   Total files processed: ${processedCount}`);
    console.log(`   Files modified: ${modifiedCount}`);
    console.log(`   Files unchanged: ${processedCount - modifiedCount}`);

    if (modifiedCount > 0) {
        console.log('\n✨ Addition completed successfully!');
        console.log('   All components now have standalone: false for Angular 21 compatibility.');
    } else {
        console.log('\n✅ No files needed modification.');
    }
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = {
    addStandaloneFalse,
    processFile,
    findComponentFiles
};
