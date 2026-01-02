#!/usr/bin/env node

/**
 * Fix Angular configuration to use environment.generated.ts everywhere
 * Remove all fileReplacements that replace environment.ts with environment.generated.ts
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Angular configuration to use environment.generated.ts everywhere...');

// Read angular.json
const angularJsonPath = path.join(__dirname, 'angular.json');
let angularConfig;

try {
    angularConfig = JSON.parse(fs.readFileSync(angularJsonPath, 'utf8'));
} catch (error) {
    console.error('❌ Error reading angular.json:', error.message);
    process.exit(1);
}

// Function to remove fileReplacements for environment.ts
function removeEnvironmentFileReplacements(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(removeEnvironmentFileReplacements);
    }

    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        if (key === 'fileReplacements' && Array.isArray(value)) {
            // Filter out environment.ts replacements
            const filteredReplacements = value.filter(replacement => {
                return !(replacement.replace && replacement.replace.includes('environment.ts'));
            });

            // Only keep fileReplacements if there are other replacements
            if (filteredReplacements.length > 0) {
                result[key] = filteredReplacements;
            }
            // If no replacements left, don't include the fileReplacements key
        } else {
            result[key] = removeEnvironmentFileReplacements(value);
        }
    }

    return result;
}

// Remove all environment.ts file replacements
const updatedConfig = removeEnvironmentFileReplacements(angularConfig);

// Write the updated angular.json
try {
    fs.writeFileSync(angularJsonPath, JSON.stringify(updatedConfig, null, 4));
    console.log('✅ Successfully removed all environment.ts file replacements from angular.json');
} catch (error) {
    console.error('❌ Error writing angular.json:', error.message);
    process.exit(1);
}

// Now update all TypeScript files to import from environment.generated.ts
const srcPath = path.join(__dirname, 'apps', 'web-giddh', 'src');

function updateEnvironmentImports(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
        const fullPath = path.join(dir, file.name);

        if (file.isDirectory() && file.name !== 'node_modules' && file.name !== 'dist') {
            updateEnvironmentImports(fullPath);
        } else if (file.isFile() && file.name.endsWith('.ts')) {
            try {
                let content = fs.readFileSync(fullPath, 'utf8');
                const originalContent = content;

                // Replace environment.ts imports with environment.generated.ts
                content = content.replace(
                    /from\s+['"]\.\.?\/.*?environments\/environment['"]/g,
                    "from '../environments/environment.generated'"
                );

                content = content.replace(
                    /from\s+['"]\.\.?\/.*?environments\/environment\.ts['"]/g,
                    "from '../environments/environment.generated'"
                );

                // Handle absolute imports
                content = content.replace(
                    /from\s+['"].*?\/environments\/environment['"]/g,
                    "from '../environments/environment.generated'"
                );

                if (content !== originalContent) {
                    fs.writeFileSync(fullPath, content);
                    console.log(`✅ Updated imports in: ${fullPath.replace(__dirname, '.')}`);
                }
            } catch (error) {
                console.log(`⚠️  Could not process file: ${fullPath} - ${error.message}`);
            }
        }
    }
}

console.log('🔧 Updating TypeScript imports to use environment.generated.ts...');
updateEnvironmentImports(srcPath);

console.log('\n🎉 Environment configuration fixes completed successfully!');
console.log('\n📋 Changes made:');
console.log('   • Removed all fileReplacements for environment.ts from angular.json');
console.log('   • Updated TypeScript imports to use environment.generated.ts');
console.log('\n🚀 The application will now use environment.generated.ts everywhere.');
