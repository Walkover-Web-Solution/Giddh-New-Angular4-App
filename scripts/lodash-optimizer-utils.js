/**
 * Shared Lodash optimization utilities
 * Used by build optimization scripts to convert default lodash imports to specific imports
 */

/**
 * Optimize lodash imports for better tree shaking
 * Converts default lodash imports (import _ from 'lodash') to specific imports
 * 
 * @param {string} content - File content to optimize
 * @param {string} lodashPackage - Lodash package name ('lodash' or 'lodash-es')
 * @returns {Object} - { content: optimized content, count: number of optimizations }
 */
function optimizeLodashImports(content, lodashPackage = 'lodash') {
    let optimizedContent = content;
    let count = 0;
    
    // Convert default lodash imports to specific imports
    const lodashDefaultPattern = /import\s+_\s+from\s+['"]lodash['"];?\s*\n/g;
    if (lodashDefaultPattern.test(optimizedContent)) {
        // Find lodash usage patterns
        const lodashUsagePattern = /_\.(\w+)/g;
        const usedMethods = new Set();
        let match;
        while ((match = lodashUsagePattern.exec(optimizedContent)) !== null) {
            usedMethods.add(match[1]);
        }
        if (usedMethods.size > 0) {
            const specificImports = Array.from(usedMethods).map(method => method).join(', ');
            optimizedContent = optimizedContent.replace(
                lodashDefaultPattern,
                `import { ${specificImports} } from '${lodashPackage}';\n`
            );
            // Update usage from _.method to method
            usedMethods.forEach(method => {
                const usagePattern = new RegExp(`_\\.${method}`, 'g');
                optimizedContent = optimizedContent.replace(usagePattern, method);
            });
            count++;
        }
    }
    return { content: optimizedContent, count };
}

module.exports = { optimizeLodashImports };
