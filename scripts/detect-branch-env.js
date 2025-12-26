#!/usr/bin/env node

/**
 * Git Branch-Based Environment Detection Script
 *
 * Automatically detects the current Git branch and maps it to the appropriate
 * environment configuration for Electron builds.
 *
 * Branch Mapping:
 * - giddh-2.0 -> local environment (.env.local)
 * - production -> prod environment (.env.prod)
 * - master/main -> prod environment (.env.prod)
 * - stage/staging -> stage environment (.env.stage)
 * - develop/dev -> local environment (.env.local)
 * - feature/* -> local environment (.env.local)
 * - Any other branch -> local environment (.env.local)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Get current Git branch name
 */
function getCurrentBranch() {
    try {
        // Try multiple methods to get branch name
        let branch;

        try {
            // Method 1: git rev-parse --abbrev-ref HEAD
            branch = execSync('git rev-parse --abbrev-ref HEAD', {
                encoding: 'utf8',
                stdio: ['pipe', 'pipe', 'ignore']
            }).trim();
        } catch (error) {
            // Method 2: git branch --show-current (Git 2.22+)
            branch = execSync('git branch --show-current', {
                encoding: 'utf8',
                stdio: ['pipe', 'pipe', 'ignore']
            }).trim();
        }

        if (!branch || branch === 'HEAD') {
            // Method 3: Parse .git/HEAD file
            const gitHeadPath = path.resolve(process.cwd(), '.git/HEAD');
            if (fs.existsSync(gitHeadPath)) {
                const headContent = fs.readFileSync(gitHeadPath, 'utf8').trim();
                if (headContent.startsWith('ref: refs/heads/')) {
                    branch = headContent.replace('ref: refs/heads/', '');
                }
            }
        }

        return branch || 'unknown';
    } catch (error) {
        console.warn('⚠️  Warning: Could not detect Git branch. Using default environment.');
        console.warn('Error:', error.message);
        return 'unknown';
    }
}

/**
 * Map Git branch to environment configuration
 */
function mapBranchToEnvironment(branch) {
    const branchMappings = {
        // Production branches
        'production': 'prod',
        'master': 'prod',
        'main': 'prod',

        // Staging branches
        'stage': 'stage',
        'staging': 'stage',

        // Development branches
        'giddh-2.0': 'local',  // Your specific branch for local development
        'develop': 'local',
        'dev': 'local',

        // Default fallback
        'unknown': 'local'
    };

    // Check exact match first
    if (branchMappings[branch]) {
        return branchMappings[branch];
    }

    // Check pattern matches
    if (branch.startsWith('feature/') || branch.startsWith('bugfix/') || branch.startsWith('hotfix/')) {
        return 'local';
    }

    if (branch.includes('stage') || branch.includes('staging')) {
        return 'stage';
    }

    if (branch.includes('prod') || branch.includes('production')) {
        return 'prod';
    }

    // Default to local for any unrecognized branch
    return 'local';
}

/**
 * Get environment file path based on environment
 */
function getEnvFilePath(environment) {
    const envFiles = {
        'local': '.env.local',
        'stage': '.env.stage',
        'prod': '.env.prod',
        'electron': '.env.electron'
    };

    return envFiles[environment] || '.env.local';
}

/**
 * Validate that environment file exists
 */
function validateEnvFile(envFile) {
    const envPath = path.resolve(process.cwd(), envFile);
    if (!fs.existsSync(envPath)) {
        console.warn(`⚠️  Warning: Environment file ${envFile} not found at ${envPath}`);
        console.warn('Please create this file or check your branch mapping configuration.');
        return false;
    }
    return true;
}

/**
 * Main execution
 */
function main() {
    console.log('🔍 Detecting Git branch and environment configuration...\n');

    // Get current branch
    const currentBranch = getCurrentBranch();
    console.log(`📋 Current Git branch: ${currentBranch}`);

    // Map to environment
    const environment = mapBranchToEnvironment(currentBranch);
    console.log(`🌍 Mapped environment: ${environment}`);

    // Get environment file
    const envFile = getEnvFilePath(environment);
    console.log(`📁 Environment file: ${envFile}`);

    // Validate environment file exists
    const isValid = validateEnvFile(envFile);

    console.log('\n' + '='.repeat(50));
    console.log('🎯 BRANCH-ENVIRONMENT MAPPING RESULT:');
    console.log('='.repeat(50));
    console.log(`Branch: ${currentBranch}`);
    console.log(`Environment: ${environment}`);
    console.log(`Config File: ${envFile}`);
    console.log(`File Exists: ${isValid ? '✅ Yes' : '❌ No'}`);
    console.log('='.repeat(50));

    // Output for script consumption
    if (process.argv.includes('--json')) {
        const result = {
            branch: currentBranch,
            environment: environment,
            envFile: envFile,
            isValid: isValid
        };
        console.log('\n' + JSON.stringify(result, null, 2));
    }

    // Output environment for shell scripts
    if (process.argv.includes('--env-only')) {
        console.log(environment);
        return;
    }

    // Output env file for shell scripts
    if (process.argv.includes('--file-only')) {
        console.log(envFile);
        return;
    }

    return {
        branch: currentBranch,
        environment: environment,
        envFile: envFile,
        isValid: isValid
    };
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = {
    getCurrentBranch,
    mapBranchToEnvironment,
    getEnvFilePath,
    validateEnvFile,
    main
};
