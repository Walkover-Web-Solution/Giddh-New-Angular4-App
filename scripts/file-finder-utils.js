/**
 * Shared file finder utilities
 * Used by build optimization and documentation scripts
 */
const fs = require('fs');
const path = require('path');

/**
 * Find TypeScript files recursively in a directory
 * Excludes common build and dependency directories
 * 
 * @param {string} dir - Directory to search
 * @param {Array} tsFiles - Accumulator array for found files
 * @returns {Array} - Array of TypeScript file paths
 */
function findTypeScriptFiles(dir, tsFiles = []) {
    try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                if (!['node_modules', 'dist', '.git', '.angular', 'coverage'].includes(file)) {
                    findTypeScriptFiles(fullPath, tsFiles);
                }
            } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
                tsFiles.push(fullPath);
            }
        }
    } catch (error) {
        console.error(`Error reading directory ${dir}:`, error.message);
    }
    return tsFiles;
}

module.exports = { findTypeScriptFiles };
