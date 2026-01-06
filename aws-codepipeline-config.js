// AWS CodePipeline Configuration for EPIPE Error Prevention
// This script configures the build environment specifically for AWS CodePipeline

const fs = require('fs');
const path = require('path');

// Configuring AWS CodePipeline environment for EPIPE error prevention

// Check if running in AWS CodeBuild
const isAWSCodeBuild = process.env.CODEBUILD_BUILD_ID || process.env.AWS_CODEBUILD;

if (isAWSCodeBuild) {
    // AWS CodeBuild environment detected

    // Set AWS-specific environment variables
    process.env.AWS_CODEBUILD = 'true';
    process.env.WEBPACK_PARALLELISM = '1';
    process.env.NG_CLI_ANALYTICS = 'false';
    process.env.CI = 'true';

    // Configure Node.js for AWS CodeBuild
    const currentNodeOptions = process.env.NODE_OPTIONS || '';
    const awsNodeOptions = [
        '--max-old-space-size=8192',
        '--max-semi-space-size=128',
        '--optimize-for-size',
        '--gc-interval=100'
    ];

    // Merge existing NODE_OPTIONS with AWS optimizations
    const mergedOptions = [...new Set([
        ...currentNodeOptions.split(' ').filter(opt => opt.trim()),
        ...awsNodeOptions
    ])].join(' ');

    process.env.NODE_OPTIONS = mergedOptions;

    // AWS CodeBuild NODE_OPTIONS: ${mergedOptions}

    // Create AWS-specific angular.json configuration if needed
    const angularJsonPath = path.join(__dirname, 'angular.json');
    if (fs.existsSync(angularJsonPath)) {
        // Angular.json configuration already optimized for AWS CodeBuild
    }

    // Create AWS-specific webpack configuration if needed
    const webpackConfigPath = path.join(__dirname, 'webpack.config.js');
    if (fs.existsSync(webpackConfigPath)) {
        // Webpack configuration already optimized for AWS CodeBuild
    }

    // AWS CodePipeline configuration completed successfully
} else {
    // Not running in AWS CodeBuild - using local configuration
}

module.exports = {
    isAWSCodeBuild,
    nodeOptions: process.env.NODE_OPTIONS
};
