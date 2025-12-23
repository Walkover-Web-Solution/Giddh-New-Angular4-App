#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to enable commented/disabled modules in app.routes.ts and routes-array.ts
 * This script checks if modules exist before enabling them
 */

function findModuleFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            // Skip node_modules and other irrelevant directories
            if (!['node_modules', '.git', 'dist', 'build', '.angular'].includes(file)) {
                findModuleFiles(filePath, fileList);
            }
        } else if (file.endsWith('.module.ts')) {
            fileList.push(filePath);
        }
    });
    
    return fileList;
}

function checkModuleExists(modulePath, srcDir) {
    // Convert relative import path to actual file path
    const fullPath = path.join(srcDir, modulePath + '.ts');
    return fs.existsSync(fullPath);
}

function enableCommentedRoutes(content, srcDir, fileName) {
    let modifiedContent = content;
    let changesMade = false;
    
    if (fileName === 'app.routes.ts') {
        // Handle commented-out lines in app.routes.ts
        const commentedRoutePattern = /\/\/ \{ path: '([^']+)', loadChildren: \(\) => import\('([^']+)'\)\.then\(module => module\.([^)]+)\)[^}]*\}/g;
        
        modifiedContent = modifiedContent.replace(commentedRoutePattern, (match, routePath, modulePath, moduleClass) => {
            if (checkModuleExists(modulePath, srcDir)) {
                changesMade = true;
                console.log(`  - Enabling route: ${routePath} -> ${modulePath}`);
                return match.substring(3); // Remove "// " prefix
            } else {
                console.log(`  - Skipping route ${routePath}: Module ${modulePath} not found`);
                return match;
            }
        });
        
        // Handle single-line commented imports
        const singleCommentPattern = /\/\/ \{ path: '([^']+)', ([^}]+) \}/g;
        modifiedContent = modifiedContent.replace(singleCommentPattern, (match, routePath, routeContent) => {
            // Check if this contains a loadChildren with module path
            const moduleMatch = routeContent.match(/loadChildren: \(\) => import\('([^']+)'\)/);
            if (moduleMatch) {
                const modulePath = moduleMatch[1];
                if (checkModuleExists(modulePath, srcDir)) {
                    changesMade = true;
                    console.log(`  - Enabling route: ${routePath} -> ${modulePath}`);
                    return match.substring(3); // Remove "// " prefix
                } else {
                    console.log(`  - Skipping route ${routePath}: Module ${modulePath} not found`);
                    return match;
                }
            }
            return match;
        });
    } else if (fileName === 'routes-array.ts') {
        // Handle "COMMENTED OUT - MISSING MODULE" patterns in routes-array.ts
        const commentedModulePattern = /loadChildren: \(\) => \/\* COMMENTED OUT - MISSING MODULE: import\('([^']+)'\) \*\/ Promise\.resolve\(DummyModule\)/g;
        
        modifiedContent = modifiedContent.replace(commentedModulePattern, (match, modulePath) => {
            if (checkModuleExists(modulePath, srcDir)) {
                changesMade = true;
                console.log(`  - Enabling module: ${modulePath}`);
                // Extract module class name from path
                const moduleFileName = path.basename(modulePath);
                const moduleClassName = moduleFileName.split('.')[0]
                    .split('-')
                    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                    .join('') + 'Module';
                
                return `loadChildren: () => import('${modulePath}').then(module => module.${moduleClassName})`;
            } else {
                console.log(`  - Skipping module ${modulePath}: Module file not found`);
                return match;
            }
        });
    }
    
    return { content: modifiedContent, changed: changesMade };
}

function processRouteFile(filePath, srcDir) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const fileName = path.basename(filePath);
        const result = enableCommentedRoutes(content, srcDir, fileName);
        
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
    const srcDir = path.join(process.cwd(), 'apps', 'web-giddh', 'src', 'app');
    
    if (!fs.existsSync(srcDir)) {
        console.error('Source directory not found:', srcDir);
        process.exit(1);
    }
    
    // Find route files
    const routeFiles = [
        path.join(srcDir, 'app.routes.ts'),
        path.join(srcDir, 'routes-array.ts')
    ].filter(filePath => fs.existsSync(filePath));
    
    if (routeFiles.length === 0) {
        console.error('No route files found (app.routes.ts or routes-array.ts)');
        process.exit(1);
    }
    
    console.log('🔍 Finding available modules...');
    const moduleFiles = findModuleFiles(srcDir);
    console.log(`📁 Found ${moduleFiles.length} module files`);
    
    console.log('🔄 Processing route files...\n');
    
    let processedCount = 0;
    let modifiedCount = 0;
    
    routeFiles.forEach(filePath => {
        processedCount++;
        console.log(`[${processedCount}/${routeFiles.length}] Processing: ${path.relative(process.cwd(), filePath)}`);
        
        if (processRouteFile(filePath, srcDir)) {
            modifiedCount++;
        }
    });
    
    console.log('\n📊 Summary:');
    console.log(`   Total route files processed: ${processedCount}`);
    console.log(`   Route files modified: ${modifiedCount}`);
    console.log(`   Route files unchanged: ${processedCount - modifiedCount}`);
    
    if (modifiedCount > 0) {
        console.log('\n✅ Module enabling completed successfully!');
        console.log('\n⚠️  Note: Please verify that the enabled modules compile correctly.');
    } else {
        console.log('\n ℹ️  No commented modules found that could be enabled.');
    }
}

if (require.main === module) {
    main();
}

module.exports = { enableCommentedRoutes, processRouteFile };
