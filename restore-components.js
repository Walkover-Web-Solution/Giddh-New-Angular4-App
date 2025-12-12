#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to restore original Angular components from backup files
 * Restores: input-field, select-field, reactive-dropdown-field, text-field, select-multiple-fields, cdk-scroll
 */

const BACKUP_SUFFIX = '.backup-template';

function restoreFromBackup(filePath) {
    const backupPath = filePath + BACKUP_SUFFIX;

    if (!fs.existsSync(backupPath)) {
        console.log(`⚠️  No backup found for: ${filePath}`);
        return false;
    }

    try {
        const backupContent = fs.readFileSync(backupPath, 'utf8');
        fs.writeFileSync(filePath, backupContent, 'utf8');
        console.log(`✅ Restored: ${filePath}`);
        return true;
    } catch (error) {
        console.error(`❌ Error restoring ${filePath}:`, error.message);
        return false;
    }
}

function removeComments(content) {
    // Remove commented out component tags
    const commentPattern = /<!--\s*COMMENTED OUT - COMPILATION ERROR:\s*(<[^>]+>)\s*-->/gi;
    let modifiedContent = content;
    let changesMade = false;

    modifiedContent = modifiedContent.replace(commentPattern, (match, originalTag) => {
        changesMade = true;
        return originalTag;
    });

    return { content: modifiedContent, changed: changesMade };
}

function restoreFile(filePath, useBackup = true) {
    try {
        if (useBackup) {
            return restoreFromBackup(filePath);
        } else {
            // Alternative: uncomment in-place
            const content = fs.readFileSync(filePath, 'utf8');
            const result = removeComments(content);

            if (result.changed) {
                fs.writeFileSync(filePath, result.content, 'utf8');
                console.log(`✅ Uncommented components in: ${filePath}`);
                return true;
            } else {
                console.log(`ℹ️  No commented components found in: ${filePath}`);
                return false;
            }
        }
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        return false;
    }
}

function findHtmlFiles(dir) {
    const files = [];

    function scanDirectory(currentDir) {
        try {
            const items = fs.readdirSync(currentDir);

            items.forEach(item => {
                const fullPath = path.join(currentDir, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
                    scanDirectory(fullPath);
                } else if (stat.isFile() && item.endsWith('.html') && !item.includes('.backup')) {
                    files.push(fullPath);
                }
            });
        } catch (error) {
            console.warn(`⚠️  Cannot read directory ${currentDir}:`, error.message);
        }
    }

    scanDirectory(dir);
    return files;
}

function findBackupFiles(dir) {
    const files = [];

    function scanDirectory(currentDir) {
        try {
            const items = fs.readdirSync(currentDir);

            items.forEach(item => {
                const fullPath = path.join(currentDir, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
                    scanDirectory(fullPath);
                } else if (stat.isFile() && item.endsWith(BACKUP_SUFFIX)) {
                    const originalPath = fullPath.replace(BACKUP_SUFFIX, '');
                    files.push(originalPath);
                }
            });
        } catch (error) {
            console.warn(`⚠️  Cannot read directory ${currentDir}:`, error.message);
        }
    }

    scanDirectory(dir);
    return files;
}

function cleanupBackups(dir) {
    console.log('🧹 Cleaning up backup files...');

    function scanDirectory(currentDir) {
        try {
            const items = fs.readdirSync(currentDir);

            items.forEach(item => {
                const fullPath = path.join(currentDir, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
                    scanDirectory(fullPath);
                } else if (stat.isFile() && item.endsWith(BACKUP_SUFFIX)) {
                    try {
                        fs.unlinkSync(fullPath);
                        console.log(`🗑️  Deleted backup: ${fullPath}`);
                    } catch (error) {
                        console.error(`❌ Error deleting ${fullPath}:`, error.message);
                    }
                }
            });
        } catch (error) {
            console.warn(`⚠️  Cannot read directory ${currentDir}:`, error.message);
        }
    }

    scanDirectory(dir);
}

function main() {
    const args = process.argv.slice(2);
    const targetDir = args[0] || './apps/web-giddh/src';
    const mode = args[1] || 'backup'; // 'backup' or 'uncomment' or 'cleanup'

    console.log('🔧 Angular Component Restoration Script');
    console.log('=======================================');
    console.log(`📁 Target directory: ${targetDir}`);
    console.log(`🎯 Mode: ${mode}`);
    console.log('');

    if (!fs.existsSync(targetDir)) {
        console.error(`❌ Directory not found: ${targetDir}`);
        process.exit(1);
    }

    if (mode === 'cleanup') {
        cleanupBackups(targetDir);
        console.log('✨ Backup cleanup completed!');
        return;
    }

    let filesToProcess = [];

    if (mode === 'backup') {
        filesToProcess = findBackupFiles(targetDir);
        console.log(`📄 Found ${filesToProcess.length} files with backups to restore`);
    } else if (mode === 'uncomment') {
        filesToProcess = findHtmlFiles(targetDir);
        console.log(`📄 Found ${filesToProcess.length} HTML files to uncomment`);
    }

    console.log('');

    let successCount = 0;
    filesToProcess.forEach(file => {
        console.log(`🔍 Processing: ${file}`);
        const success = restoreFile(file, mode === 'backup');
        if (success) successCount++;
        console.log('');
    });

    console.log(`✨ Component restoration completed!`);
    console.log(`📊 Successfully processed: ${successCount}/${filesToProcess.length} files`);

    if (mode === 'backup') {
        console.log('💡 Run with "cleanup" mode to remove backup files');
        console.log('💡 Example: node restore-components.js ./apps/web-giddh/src cleanup');
    }
}

if (require.main === module) {
    main();
}

module.exports = {
    restoreFromBackup,
    removeComments,
    restoreFile,
    findHtmlFiles,
    findBackupFiles,
    cleanupBackups
};
