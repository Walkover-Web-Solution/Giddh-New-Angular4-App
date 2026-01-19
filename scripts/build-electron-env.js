#!/usr/bin/env node
/**
 * Electron Environment Builder with Git Branch Detection
 *
 * This script automatically detects the current Git branch and builds
 * the Electron app with the appropriate environment configuration.
 *
 * Usage:
 * - node scripts/build-electron-env.js (auto-detect branch)
 * - node scripts/build-electron-env.js --force-env=prod (override environment)
 * - node scripts/build-electron-env.js --branch=giddh-2.0 (simulate branch)
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
const dotenv = require('dotenv');
// Import our branch detection utility
const { getCurrentBranch, mapBranchToEnvironment, getEnvFilePath, validateEnvFile } = require('./detect-branch-env');
/**
 * Parse command line arguments
 */
function parseArguments() {
    const args = process.argv.slice(2);
    const options = {
        forceEnv: null,
        simulateBranch: null,
        verbose: false,
        dryRun: false
    };
    args.forEach(arg => {
        if (arg.startsWith('--force-env=')) {
            options.forceEnv = arg.split('=')[1];
        } else if (arg.startsWith('--branch=')) {
            options.simulateBranch = arg.split('=')[1];
        } else if (arg === '--verbose' || arg === '-v') {
            options.verbose = true;
        } else if (arg === '--dry-run') {
            options.dryRun = true;
        }
    });
    return options;
}
/**
 * Load environment variables from the detected .env file
 */
function loadEnvironmentVariables(envFile) {
    const envPath = path.resolve(process.cwd(), envFile);
    // Load environment variables
    const result = dotenv.config({ path: envPath });
    if (result.error) {
        throw new Error(`Failed to load environment file: ${envFile}`);
    }
    return result.parsed;
}
/**
 * Update Electron main process with environment configuration
 */
function updateElectronMainProcess(environment, envVars) {
    const electronMainPath = path.resolve(process.cwd(), 'apps/electron-giddh/src/index.ts');
    if (!fs.existsSync(electronMainPath)) {
        return;
    }
    // Read current file
    let mainContent = fs.readFileSync(electronMainPath, 'utf8');
    // Update environment flags based on detected environment
    const envFlags = {
        STAGING_ENV: environment === 'stage',
        TEST_ENV: environment === 'test',
        LOCAL_ENV: environment === 'local',
        PRODUCTION_ENV: environment === 'prod'
    };
    // Update environment variables in the main process
    Object.keys(envFlags).forEach(flag => {
        const regex = new RegExp(`let ${flag} = .*?;`, 'g');
        const replacement = `let ${flag} = ${envFlags[flag]};`;
        mainContent = mainContent.replace(regex, replacement);
    });
    // Update APP_URL based on environment
    const appUrl = envVars.APP_URL || getDefaultAppUrl(environment);
    const appUrlRegex = /let APP_URL = '.*?';/g;
    mainContent = mainContent.replace(appUrlRegex, `let APP_URL = '${appUrl}';`);
    // Update APP_FOLDER if specified
    if (envVars.APP_FOLDER) {
        const appFolderRegex = /let APP_FOLDER = '.*?';/g;
        mainContent = mainContent.replace(appFolderRegex, `let APP_FOLDER = '${envVars.APP_FOLDER}';`);
    }
    // Write updated content back
    fs.writeFileSync(electronMainPath, mainContent);
}
/**
 * Get default app URL based on environment
 */
function getDefaultAppUrl(environment) {
    const urls = {
        'prod': 'https://books.giddh.com',
        'stage': 'https://stage.giddh.com',
        'local': 'http://localhost:3000/',
        'test': 'http://localhost:3000/'
    };
    return urls[environment] || urls.local;
}
/**
 * Update Electron auth configuration
 */
function updateElectronAuthConfig(environment, envVars) {
    const authConfigPath = path.resolve(process.cwd(), 'apps/electron-giddh/src/main-auth.config.ts');
    if (!fs.existsSync(authConfigPath)) {
        return;
    }
    // Read current file
    let authContent = fs.readFileSync(authConfigPath, 'utf8');
    // Update Google OAuth credentials if available
    if (envVars.GOOGLE_CLIENT_ID && envVars.GOOGLE_CLIENT_SECRET) {
        const clientIdRegex = /clientId:\s*['"].*?['"]/g;
        const clientSecretRegex = /clientSecret:\s*['"].*?['"]/g;
        authContent = authContent.replace(clientIdRegex, `clientId: '${envVars.GOOGLE_CLIENT_ID}'`);
        authContent = authContent.replace(clientSecretRegex, `clientSecret: '${envVars.GOOGLE_CLIENT_SECRET}'`);
    }
    // Write updated content back
    fs.writeFileSync(authConfigPath, authContent);
}
/**
 * Build Electron application
 */
function buildElectronApp(environment, options) {
    if (options.dryRun) {
        return;
    }
    try {
        // Set environment variables for the build process
        const buildEnv = {
            ...process.env,
            NODE_ENV: environment === 'prod' ? 'production' : 'development',
            ELECTRON_ENV: environment
        };
        // Build the Angular app first
        execSync('npm run build:electron', {
            stdio: 'inherit',
            env: buildEnv
        });
        // Build the Electron app
        execSync('npm run electron:build', {
            stdio: 'inherit',
            env: buildEnv
        });
    } catch (error) {
        process.exit(1);
    }
}
/**
 * Display build summary
 */
function displayBuildSummary(branch, environment, envFile, envVars) {
}
/**
 * Main execution function
 */
function main() {
    // Parse command line options
    const options = parseArguments();
    try {
        // Detect current branch (or use simulated branch)
        const currentBranch = options.simulateBranch || getCurrentBranch();
        // Determine environment (or use forced environment)
        const environment = options.forceEnv || mapBranchToEnvironment(currentBranch);
        // Get environment file path
        const envFile = getEnvFilePath(environment);
        // Validate environment file exists
        if (!validateEnvFile(envFile)) {
            process.exit(1);
        }
        // Load environment variables
        const envVars = loadEnvironmentVariables(envFile);
        // Update Electron configuration files
        updateElectronMainProcess(environment, envVars);
        updateElectronAuthConfig(environment, envVars);
        // Display build summary
        displayBuildSummary(currentBranch, environment, envFile, envVars);
        // Build Electron app
        if (!options.dryRun) {
            buildElectronApp(environment, options);
        } else {
        }
    } catch (error) {
        if (options.verbose) {
        }
        process.exit(1);
    }
}
// Run if called directly
if (require.main === module) {
    main();
}
module.exports = {
    parseArguments,
    loadEnvironmentVariables,
    updateElectronMainProcess,
    updateElectronAuthConfig,
    buildElectronApp,
    main
};
