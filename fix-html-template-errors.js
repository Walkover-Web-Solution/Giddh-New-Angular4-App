#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to fix HTML template errors found during Angular compilation
 * Fixes mismatched tags, unclosed containers, and other HTML structure issues
 */

function findHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            if (!['node_modules', '.git', 'dist', 'build', '.angular'].includes(file)) {
                findHtmlFiles(filePath, fileList);
            }
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    });
    
    return fileList;
}

function validateHtmlStructure(content, filePath) {
    const lines = content.split('\n');
    const stack = [];
    const errors = [];
    
    lines.forEach((line, index) => {
        const lineNum = index + 1;
        
        // Find opening tags
        const openingTags = line.match(/<(?!\/)[^>]*>/g) || [];
        openingTags.forEach(tag => {
            const tagName = tag.match(/<([^\s>]+)/)?.[1];
            if (tagName && !['input', 'img', 'br', 'hr', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'].includes(tagName)) {
                // Skip self-closing tags
                if (!tag.endsWith('/>')) {
                    stack.push({ tag: tagName, line: lineNum, fullTag: tag });
                }
            }
        });
        
        // Find closing tags
        const closingTags = line.match(/<\/[^>]+>/g) || [];
        closingTags.forEach(tag => {
            const tagName = tag.match(/<\/([^>]+)>/)?.[1];
            if (tagName) {
                if (stack.length === 0) {
                    errors.push({ type: 'unexpected_closing', tag: tagName, line: lineNum });
                } else {
                    const lastOpen = stack.pop();
                    if (lastOpen.tag !== tagName) {
                        errors.push({ 
                            type: 'mismatched', 
                            expected: lastOpen.tag, 
                            found: tagName, 
                            line: lineNum,
                            openLine: lastOpen.line 
                        });
                        // Try to find the correct closing tag
                        stack.push(lastOpen);
                    }
                }
            }
        });
    });
    
    // Check for unclosed tags
    stack.forEach(openTag => {
        errors.push({ 
            type: 'unclosed', 
            tag: openTag.tag, 
            line: openTag.line 
        });
    });
    
    return errors;
}

function fixSpecificKnownIssues(content, filePath) {
    let modifiedContent = content;
    let changesMade = false;
    
    const fileName = path.basename(filePath);
    
    // Fix bulk-export-voucher.component.html specific issues
    if (fileName === 'bulk-export-voucher.component.html') {
        // The file structure should be properly nested
        const fixes = [
            {
                // Fix the ng-container structure for sales type
                pattern: /<ng-container \*ngIf="type === 'sales'">\s*<div class="row mb-2">[\s\S]*?<\/div>\s*<\/ng-container>/g,
                replacement: (match) => {
                    // Ensure proper closing of ng-container
                    if (!match.includes('</ng-container>')) {
                        return match.replace(/(<\/div>\s*)$/, '$1</ng-container>');
                    }
                    return match;
                }
            }
        ];
        
        fixes.forEach(fix => {
            if (fix.pattern.test(modifiedContent)) {
                modifiedContent = modifiedContent.replace(fix.pattern, fix.replacement);
                changesMade = true;
            }
        });
    }
    
    // Fix ngx-daterangepicker.component.html specific issues
    if (fileName === 'ngx-daterangepicker.component.html') {
        // Fix mismatched ng-container tags
        modifiedContent = modifiedContent.replace(
            /<ng-container([^>]*)>\s*([\s\S]*?)\s*<\/div>/g,
            '<ng-container$1>\n$2\n</ng-container>'
        );
        
        modifiedContent = modifiedContent.replace(
            /<div([^>]*)>\s*([\s\S]*?)\s*<\/ng-container>/g,
            '<div$1>\n$2\n</div>'
        );
        
        changesMade = true;
    }
    
    // Fix trial-balance-report-grid.component.html specific issues
    if (fileName === 'trial-balance-report-grid.component.html') {
        // Fix unclosed ng-container and ng-template tags
        const lines = modifiedContent.split('\n');
        const fixedLines = [];
        const stack = [];
        
        lines.forEach((line, index) => {
            let fixedLine = line;
            
            // Track opening tags
            const openTags = line.match(/<(ng-container|ng-template)[^>]*>/g) || [];
            openTags.forEach(tag => {
                const tagName = tag.includes('ng-container') ? 'ng-container' : 'ng-template';
                if (!tag.endsWith('/>')) {
                    stack.push(tagName);
                }
            });
            
            // Track closing tags
            const closeTags = line.match(/<\/(ng-container|ng-template)>/g) || [];
            closeTags.forEach(() => {
                if (stack.length > 0) {
                    stack.pop();
                }
            });
            
            fixedLines.push(fixedLine);
        });
        
        // Add missing closing tags
        while (stack.length > 0) {
            const tag = stack.pop();
            fixedLines.push(`</${tag}>`);
            changesMade = true;
        }
        
        modifiedContent = fixedLines.join('\n');
    }
    
    return { content: modifiedContent, changed: changesMade };
}

function processHtmlFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const fileName = path.basename(filePath);
        
        console.log(`Checking: ${fileName}`);
        
        // Validate HTML structure
        const errors = validateHtmlStructure(content, filePath);
        
        if (errors.length > 0) {
            console.log(`  Found ${errors.length} HTML structure issues:`);
            errors.forEach(error => {
                switch (error.type) {
                    case 'unexpected_closing':
                        console.log(`    Line ${error.line}: Unexpected closing tag </${error.tag}>`);
                        break;
                    case 'mismatched':
                        console.log(`    Line ${error.line}: Expected </${error.expected}> but found </${error.found}> (opened on line ${error.openLine})`);
                        break;
                    case 'unclosed':
                        console.log(`    Line ${error.line}: Unclosed tag <${error.tag}>`);
                        break;
                }
            });
        }
        
        // Apply specific fixes for known problematic files
        const result = fixSpecificKnownIssues(content, filePath);
        
        if (result.changed) {
            fs.writeFileSync(filePath, result.content, 'utf8');
            console.log(`  ✓ Applied fixes to ${fileName}`);
            return true;
        } else if (errors.length > 0) {
            console.log(`  ⚠️  ${fileName} has issues but no automatic fixes applied`);
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
    
    console.log('🔍 Finding HTML template files...');
    const htmlFiles = findHtmlFiles(srcDir);
    
    // Focus on the problematic files first
    const problematicFiles = [
        'bulk-export-voucher.component.html',
        'ngx-daterangepicker.component.html', 
        'trial-balance-report-grid.component.html'
    ];
    
    const targetFiles = htmlFiles.filter(file => 
        problematicFiles.some(problemFile => file.endsWith(problemFile))
    );
    
    console.log(`📁 Found ${targetFiles.length} problematic HTML files to fix`);
    console.log('🔄 Processing files...\n');
    
    let processedCount = 0;
    let modifiedCount = 0;
    
    targetFiles.forEach(filePath => {
        processedCount++;
        console.log(`[${processedCount}/${targetFiles.length}] Processing: ${path.relative(process.cwd(), filePath)}`);
        
        if (processHtmlFile(filePath)) {
            modifiedCount++;
        }
    });
    
    console.log('\n📊 Summary:');
    console.log(`   Files processed: ${processedCount}`);
    console.log(`   Files modified: ${modifiedCount}`);
    console.log(`   Files unchanged: ${processedCount - modifiedCount}`);
    
    if (modifiedCount > 0) {
        console.log('\n✅ HTML template fixes completed!');
        console.log('   Run ng build again to check for remaining issues.');
    } else {
        console.log('\n ℹ️  No automatic fixes could be applied.');
        console.log('   Manual review of HTML templates may be required.');
    }
}

if (require.main === module) {
    main();
}

module.exports = { validateHtmlStructure, fixSpecificKnownIssues, processHtmlFile };
