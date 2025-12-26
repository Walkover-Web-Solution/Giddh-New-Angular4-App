#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Clean old Electron builds before creating new ones
 * This prevents confusion between old and new builds with same version
 */

const COLORS = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

function log(message, color = 'reset') {
    console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function getPackageVersion() {
    try {
        const packagePath = path.join(__dirname, '..', 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        return packageJson.version;
    } catch (error) {
        log(`❌ Error reading package.json: ${error.message}`, 'red');
        process.exit(1);
    }
}

function cleanBuildDirectory() {
    const buildDir = path.join(__dirname, '..', 'dist', 'apps', 'electrongiddh-packages');

    if (!fs.existsSync(buildDir)) {
        log(`📁 Build directory doesn't exist: ${buildDir}`, 'yellow');
        return;
    }

    const version = getPackageVersion();
    log(`🧹 Cleaning existing builds with same version ${version}...`, 'cyan');

    try {
        const files = fs.readdirSync(buildDir);
        let cleanedCount = 0;

        files.forEach(file => {
            const filePath = path.join(buildDir, file);
            const stat = fs.statSync(filePath);

            // Only remove files/directories that match the EXACT current version
            const matchesVersion = file.includes(version);
            const isGiddhSetup = file.startsWith('giddh Setup') && file.includes(version);
            const isGiddhZip = file.startsWith('giddh-') && file.includes(version);
            const isVersionBlockmap = file.includes(version) && file.endsWith('.blockmap');

            if (matchesVersion || isGiddhSetup || isGiddhZip || isVersionBlockmap) {
                if (stat.isDirectory()) {
                    log(`🗂️  Removing directory with same version: ${file}`, 'yellow');
                    fs.rmSync(filePath, { recursive: true, force: true });
                    cleanedCount++;
                } else {
                    log(`🗑️  Removing file with same version: ${file}`, 'yellow');
                    fs.unlinkSync(filePath);
                    cleanedCount++;
                }
            }
        });

        if (cleanedCount > 0) {
            log(`✅ Cleaned ${cleanedCount} files/directories with version ${version}`, 'green');
        } else {
            log(`ℹ️  No existing files found with version ${version}`, 'blue');
        }

    } catch (error) {
        log(`❌ Error cleaning build directory: ${error.message}`, 'red');
        process.exit(1);
    }
}

function cleanNodeModulesInDist() {
    const distWebDir = path.join(__dirname, '..', 'dist', 'apps', 'web-giddh');
    const nodeModulesPath = path.join(distWebDir, 'node_modules');

    if (fs.existsSync(nodeModulesPath)) {
        log(`🗑️  Removing dist node_modules...`, 'yellow');
        try {
            fs.rmSync(nodeModulesPath, { recursive: true, force: true });
            log(`✅ Removed dist node_modules`, 'green');
        } catch (error) {
            log(`⚠️  Warning: Could not remove dist node_modules: ${error.message}`, 'yellow');
        }
    }
}

function main() {
    log(`${COLORS.bold}🚀 Electron Build Cleaner${COLORS.reset}`, 'cyan');
    log(`${COLORS.bold}=========================${COLORS.reset}`, 'cyan');

    const version = getPackageVersion();
    log(`📦 Current version: ${version}`, 'blue');

    // Clean old builds
    cleanBuildDirectory();

    // Clean dist node_modules
    cleanNodeModulesInDist();

    log(`${COLORS.bold}✨ Build cleanup completed!${COLORS.reset}`, 'green');
    log(`${COLORS.bold}Ready for fresh build...${COLORS.reset}`, 'green');
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { cleanBuildDirectory, cleanNodeModulesInDist, getPackageVersion };
