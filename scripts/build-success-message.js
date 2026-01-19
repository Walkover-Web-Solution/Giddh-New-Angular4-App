#!/usr/bin/env node
/**
 * Build Success Message Script
 * Displays a success message with environment information after build completion
 */
import fs from 'fs';
import path from 'path';
// Get environment from command line arguments
const args = process.argv.slice(2);
const environment = args[0] || 'prod';
// ANSI color codes for terminal output
const colors = {
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m'
};
// Get current timestamp
const timestamp = new Date().toLocaleString();
// Get package.json version
let version = 'Unknown';
try {
    const packagePath = path.join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    version = packageJson.version;
} catch (error) {
}
// Check if build output exists
const buildPath = path.join(__dirname, '..', 'dist', 'apps', 'electrongiddh-packages');
let buildFiles = [];
try {
    if (fs.existsSync(buildPath)) {
        buildFiles = fs.readdirSync(buildPath).filter(file =>
            file.endsWith('.exe') || file.endsWith('.zip') || file.endsWith('.dmg')
        );
    }
} catch (error) {
}
// Create success message
if (buildFiles.length > 0) {
    buildFiles.forEach(file => {
        const fileSize = getFileSize(path.join(buildPath, file));
    });
} else {
}
// Helper function to get file size
function getFileSize(filePath) {
    try {
        const stats = fs.statSync(filePath);
        const fileSizeInBytes = stats.size;
        const fileSizeInMegabytes = (fileSizeInBytes / (1024 * 1024)).toFixed(2);
        return `${fileSizeInMegabytes} MB`;
    } catch (error) {
        return 'Unknown size';
    }
}
// Exit with success code
process.exit(0);
