#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to add standalone: false to @Component decorators where it's missing
 * Avoids adding duplicates if standalone property already exists
 */

function findComponentFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            // Skip node_modules and other irrelevant directories
            if (!['node_modules', '.git', 'dist', 'build', '.angular'].includes(file)) {
                findComponentFiles(filePath, fileList);
            }
        } else if (file.endsWith('.component.ts')) {
            fileList.push(filePath);
        }
    });
    
    return fileList;
}

function addStandaloneToComponent(content) {
    let modifiedContent = content;
    let changesMade = false;
    
    // Pattern to match @Component decorator
    const componentPattern = /@Component\s*\(\s*\{([^}]*)\}\s*\)/gs;
    
    modifiedContent = modifiedContent.replace(componentPattern, (match, decoratorContent) => {
        // Check if standalone property already exists
        if (/standalone\s*:/i.test(decoratorContent)) {
            console.log('  - Component already has standalone property, skipping');
            return match;
        }
        
        changesMade = true;
        console.log('  - Adding standalone: false to @Component decorator');
        
        // Clean up the decorator content and add standalone: false
        let cleanContent = decoratorContent.trim();
        
        // If the content doesn't end with a comma, add one
        if (!cleanContent.endsWith(',')) {
            cleanContent += ',';
        }
        
        // Add standalone: false as the last property
        cleanContent += '\n    standalone: false';
        
        return `@Component({\n${cleanContent}\n})`;
    });
    
    return { content: modifiedContent, changed: changesMade };
}

function processFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check if file contains @Component decorator
        if (!/@Component\s*\(/i.test(content)) {
            return false;
        }
        
        const result = addStandaloneToComponent(content);
        
        if (result.changed) {
            fs.writeFileSync(filePath, result.content, 'utf8');
            console.log(`✓ Updated: ${filePath}`);
            return true;
        }
        return false;
    } catch (error) {
        console.error(`✗ Error processing ${filePath}:`, error.message);
        return false;
    }
}

function main() {
    const srcDir = path.join(process.cwd(), 'apps', 'web-giddh', 'src');
    
    if (!fs.existsSync(srcDir)) {
        console.error('Source directory not found:', srcDir);
        process.exit(1);
    }
    
    console.log('🔍 Finding component files...');
    const componentFiles = findComponentFiles(srcDir);
    
    console.log(`📁 Found ${componentFiles.length} component files`);
    console.log('🔄 Processing files...\n');
    
    let processedCount = 0;
    let modifiedCount = 0;
    
    componentFiles.forEach(filePath => {
        processedCount++;
        console.log(`[${processedCount}/${componentFiles.length}] Processing: ${path.relative(process.cwd(), filePath)}`);
        
        if (processFile(filePath)) {
            modifiedCount++;
        }
    });
    
    console.log('\n📊 Summary:');
    console.log(`   Total files processed: ${processedCount}`);
    console.log(`   Files modified: ${modifiedCount}`);
    console.log(`   Files unchanged: ${processedCount - modifiedCount}`);
    
    if (modifiedCount > 0) {
        console.log('\n✅ Component standalone: false addition completed successfully!');
    } else {
        console.log('\n ℹ️  No components found that needed standalone: false added.');
    }
}

if (require.main === module) {
    main();
}

module.exports = { addStandaloneToComponent, processFile };
