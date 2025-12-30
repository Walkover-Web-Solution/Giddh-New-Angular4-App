// AWS CodeBuild Memory Configuration for Angular 21 builds
// This configuration helps prevent EPIPE errors during optimization

const os = require('os');

// Get system memory info
const totalMemory = os.totalmem();
const freeMemory = os.freemem();
const memoryInGB = Math.floor(totalMemory / (1024 * 1024 * 1024));

console.log(`Total system memory: ${memoryInGB}GB`);
console.log(`Free memory: ${Math.floor(freeMemory / (1024 * 1024 * 1024))}GB`);

// Set Node.js memory limits based on available memory
let maxOldSpaceSize;
if (memoryInGB >= 8) {
    maxOldSpaceSize = 6144; // 6GB for systems with 8GB+ RAM
} else if (memoryInGB >= 4) {
    maxOldSpaceSize = 3072; // 3GB for systems with 4-8GB RAM
} else {
    maxOldSpaceSize = 2048; // 2GB for systems with less than 4GB RAM
}

console.log(`Setting Node.js max-old-space-size to: ${maxOldSpaceSize}MB`);

// Set environment variables for the build process
process.env.NODE_OPTIONS = `--max-old-space-size=${maxOldSpaceSize}`;

// Export configuration for use in build scripts
module.exports = {
    maxOldSpaceSize,
    totalMemoryGB: memoryInGB,
    freeMemoryGB: Math.floor(freeMemory / (1024 * 1024 * 1024))
};
