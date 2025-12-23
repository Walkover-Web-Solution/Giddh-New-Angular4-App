#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to add providedIn: 'root' to @Injectable decorators where it's missing
 * Handles services, directives, and pipes with @Injectable decorator
 * Skips if providedIn already exists
 */

function findInjectableFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            // Skip node_modules and other irrelevant directories
            if (!['node_modules', '.git', 'dist', 'build', '.angular'].includes(file)) {
                findInjectableFiles(filePath, fileList);
            }
        } else if (file.endsWith('.service.ts') || 
                   file.endsWith('.directive.ts') || 
                   file.endsWith('.pipe.ts') ||
                   (file.endsWith('.ts') && !file.endsWith('.spec.ts') && !file.endsWith('.module.ts'))) {
            fileList.push(filePath);
        }
    });
    
    return fileList;
}

function addProvidedInToInjectable(content) {
    let modifiedContent = content;
    let changesMade = false;
    
    // Pattern to match @Injectable decorator
    const injectablePattern = /@Injectable\s*\(\s*\{([^}]*)\}\s*\)/gs;
    
    modifiedContent = modifiedContent.replace(injectablePattern, (match, decoratorContent) => {
        // Check if providedIn property already exists
        if (/providedIn\s*:/i.test(decoratorContent)) {
            console.log('  - Injectable already has providedIn property, skipping');
            return match;
        }
        
        changesMade = true;
        console.log('  - Adding providedIn: \'root\' to @Injectable decorator');
        
        // Clean up the decorator content and add providedIn: 'root'
        let cleanContent = decoratorContent.trim();
        
        // If content is empty, just add providedIn
        if (!cleanContent) {
            cleanContent = 'providedIn: \'root\'';
        } else {
            // If the content doesn't end with a comma, add one
            if (!cleanContent.endsWith(',')) {
                cleanContent += ',';
            }
            // Add providedIn: 'root' as the last property
            cleanContent += '\n    providedIn: \'root\'';
        }
        
        return `@Injectable({\n    ${cleanContent}\n})`;
    });
    
    // Also handle @Injectable() without parameters
    const emptyInjectablePattern = /@Injectable\s*\(\s*\)/g;
    modifiedContent = modifiedContent.replace(emptyInjectablePattern, (match) => {
        changesMade = true;
        console.log('  - Adding providedIn: \'root\' to empty @Injectable decorator');
        return '@Injectable({\n    providedIn: \'root\'\n})';
    });
    
    return { content: modifiedContent, changed: changesMade };
}

function processFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check if file contains @Injectable decorator
        if (!/@Injectable/i.test(content)) {
            return false;
        }
        
        const result = addProvidedInToInjectable(content);
        
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
    
    console.log('🔍 Finding injectable files (services, directives, pipes)...');
    const injectableFiles = findInjectableFiles(srcDir);
    
    console.log(`📁 Found ${injectableFiles.length} potential injectable files`);
    console.log('🔄 Processing files...\n');
    
    let processedCount = 0;
    let modifiedCount = 0;
    
    injectableFiles.forEach(filePath => {
        processedCount++;
        console.log(`[${processedCount}/${injectableFiles.length}] Processing: ${path.relative(process.cwd(), filePath)}`);
        
        if (processFile(filePath)) {
            modifiedCount++;
        }
    });
    
    console.log('\n📊 Summary:');
    console.log(`   Total files processed: ${processedCount}`);
    console.log(`   Files modified: ${modifiedCount}`);
    console.log(`   Files unchanged: ${processedCount - modifiedCount}`);
    
    if (modifiedCount > 0) {
        console.log('\n✅ Injectable providedIn: \'root\' addition completed successfully!');
    } else {
        console.log('\n ℹ️  No injectables found that needed providedIn: \'root\' added.');
    }
}

if (require.main === module) {
    main();
}

module.exports = { addProvidedInToInjectable, processFile };
