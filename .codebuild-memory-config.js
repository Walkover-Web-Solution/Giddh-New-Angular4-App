// AWS CodeBuild Memory Configuration for Angular 21 builds
// Enhanced EPIPE error prevention for CodePipeline environments

const os = require('os');

// Get system memory info
const totalMemory = os.totalmem();
const freeMemory = os.freemem();
const memoryInGB = Math.floor(totalMemory / (1024 * 1024 * 1024));

// AWS CodeBuild Memory Configuration
// Total system memory: ${memoryInGB}GB
// Free memory: ${Math.floor(freeMemory / (1024 * 1024 * 1024))}GB

// Enhanced memory allocation for EPIPE error prevention
let maxOldSpaceSize;
let maxSemiSpaceSize;

if (memoryInGB >= 15) {
    maxOldSpaceSize = 8192; // 8GB for large CodeBuild instances
    maxSemiSpaceSize = 256;
} else if (memoryInGB >= 8) {
    maxOldSpaceSize = 6144; // 6GB for medium CodeBuild instances
    maxSemiSpaceSize = 128;
} else if (memoryInGB >= 4) {
    maxOldSpaceSize = 3072; // 3GB for small CodeBuild instances
    maxSemiSpaceSize = 64;
} else {
    maxOldSpaceSize = 2048; // 2GB for minimal instances
    maxSemiSpaceSize = 32;
}

// Setting Node.js max-old-space-size to: ${maxOldSpaceSize}MB
// Setting Node.js max-semi-space-size to: ${maxSemiSpaceSize}MB

// AWS CodePipeline optimized Node.js options for EPIPE prevention
const nodeOptions = [
    `--max-old-space-size=${maxOldSpaceSize}`,
    `--max-semi-space-size=${maxSemiSpaceSize}`,
    '--optimize-for-size',
    '--gc-interval=100'
].join(' ');

process.env.NODE_OPTIONS = nodeOptions;
process.env.AWS_CODEBUILD_OPTIMIZED = 'true';

// NODE_OPTIONS: ${nodeOptions}
// AWS CodeBuild memory configuration applied successfully

// Export configuration for use in build scripts
module.exports = {
    maxOldSpaceSize,
    maxSemiSpaceSize,
    totalMemoryGB: memoryInGB,
    freeMemoryGB: Math.floor(freeMemory / (1024 * 1024 * 1024)),
    nodeOptions
};
