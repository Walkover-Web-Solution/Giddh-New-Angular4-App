#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// List of modules to comment out temporarily
const MODULES_TO_COMMENT = [
    'FormFieldsModule',
    'GiddhPageLoaderModule',
    'SharedModule'
];

// Function to comment out module imports
function commentOutModules(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        MODULES_TO_COMMENT.forEach(moduleName => {
            // Comment out import statements
            const importRegex = new RegExp(`^(\\s*import\\s+{[^}]*${moduleName}[^}]*}\\s+from[^;]+;)`, 'gm');
            content = content.replace(importRegex, (match) => {
                if (!match.trim().startsWith('//')) {
                    modified = true;
                    return '// ' + match;
                }
                return match;
            });

            // Comment out module usage in imports array
            const usageRegex = new RegExp(`^(\\s*${moduleName}\\s*,?)`, 'gm');
            content = content.replace(usageRegex, (match) => {
                if (!match.trim().startsWith('//')) {
                    modified = true;
                    return '        // ' + match.trim();
                }
                return match;
            });
        });

        if (modified) {
            fs.writeFileSync(filePath, content);
            console.log(`✅ Commented modules in: ${filePath}`);
            return true;
        }
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
    }
    return false;
}

// Function to recursively find .module.ts files
function findModuleFiles(dir) {
    const files = [];

    function traverse(currentDir) {
        const items = fs.readdirSync(currentDir);

        for (const item of items) {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory() && !item.includes('node_modules')) {
                traverse(fullPath);
            } else if (item.endsWith('.module.ts')) {
                files.push(fullPath);
            }
        }
    }

    traverse(dir);
    return files;
}

// Main execution
const srcDir = './apps/web-giddh/src';
console.log('🔍 Finding module files...');

const moduleFiles = findModuleFiles(srcDir);
console.log(`📁 Found ${moduleFiles.length} module files`);

let processedCount = 0;
moduleFiles.forEach(file => {
    if (commentOutModules(file)) {
        processedCount++;
    }
});

console.log(`\n🎉 Processed ${processedCount} files with module comments`);
console.log('📝 Modules commented out:', MODULES_TO_COMMENT.join(', '));
