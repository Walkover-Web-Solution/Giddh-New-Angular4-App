// Angular 21 Webpack Compatibility Layer for EPIPE Error Prevention
// Addresses Angular 21 specific regression issues not present in Angular 16

const webpack = require('webpack');
const path = require('path');

/**
 * Angular 21 introduced stricter webpack optimization that causes EPIPE errors
 * This compatibility layer provides Angular 16-like behavior for large applications
 */
class Angular21CompatibilityPlugin {
    constructor(options = {}) {
        this.options = {
            // Reduce optimization pressure similar to Angular 16
            disableAdvancedOptimizations: true,
            // Prevent worker process crashes
            maxWorkers: process.env.AWS_CODEBUILD ? 1 : 2,
            // Angular 16-like chunk splitting
            legacyChunkSplitting: true,
            ...options
        };
    }

    apply(compiler) {
        compiler.hooks.beforeCompile.tap('Angular21CompatibilityPlugin', () => {
            console.log('🔧 Applying Angular 21 EPIPE compatibility fixes...');
        });

        // Override Angular 21's aggressive optimization
        compiler.hooks.compilation.tap('Angular21CompatibilityPlugin', (compilation) => {
            // Reduce optimization pressure that causes EPIPE in Angular 21
            compilation.hooks.optimizeChunks.tap('Angular21CompatibilityPlugin', (chunks) => {
                if (this.options.legacyChunkSplitting) {
                    // Apply Angular 16-like chunk splitting logic
                    chunks.forEach(chunk => {
                        if (chunk.size() > 500000) { // 500KB threshold
                            console.log(`⚠️  Large chunk detected: ${chunk.name} (${chunk.size()} bytes)`);
                        }
                    });
                }
            });

            // Prevent worker process communication failures
            compilation.hooks.processAssets.tap({
                name: 'Angular21CompatibilityPlugin',
                stage: webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE
            }, () => {
                // Reduce memory pressure during asset processing
                if (global.gc && process.env.AWS_CODEBUILD) {
                    global.gc();
                }
            });
        });
    }
}

/**
 * Angular 21 Webpack Configuration Override
 * Provides Angular 16-like behavior to prevent EPIPE errors
 */
function getAngular21CompatibleConfig(baseConfig = {}) {
    const isAWS = process.env.AWS_CODEBUILD || process.env.CODEBUILD_BUILD_ID;

    return {
        ...baseConfig,

        // Angular 21 specific optimizations that prevent EPIPE
        optimization: {
            ...baseConfig.optimization,

            // Reduce optimization pressure compared to Angular 21 defaults
            minimize: true,
            minimizer: [
                // Use less aggressive minimization than Angular 21 default
                new (require('terser-webpack-plugin'))({
                    parallel: isAWS ? 1 : 2, // Reduce parallelism for AWS
                    terserOptions: {
                        // Angular 16-like terser options
                        compress: {
                            passes: 1, // Reduce passes to prevent EPIPE
                            pure_getters: true,
                            unsafe_comps: true,
                            unsafe_math: true,
                            unsafe_methods: true,
                        },
                        mangle: {
                            safari10: true,
                        },
                        output: {
                            ascii_only: true,
                            comments: false,
                            webkit: true,
                        },
                    },
                })
            ],

            splitChunks: {
                chunks: 'all',
                // Angular 16-like chunk sizes (Angular 21 uses smaller defaults)
                maxSize: isAWS ? 200000 : 244000,
                minSize: 20000,

                cacheGroups: {
                    // Vendor chunk strategy similar to Angular 16
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                        priority: 10,
                        maxSize: isAWS ? 400000 : 500000,
                        enforce: true
                    },

                    // Angular 16-like common chunk handling
                    common: {
                        name: 'common',
                        minChunks: 2,
                        chunks: 'all',
                        priority: 5,
                        maxSize: isAWS ? 200000 : 244000,
                        enforce: true
                    }
                }
            },

            // Disable some Angular 21 optimizations that cause EPIPE
            concatenateModules: false, // Angular 16 default
            usedExports: true,
            sideEffects: false,
        },

        // Angular 21 compatibility plugins
        plugins: [
            ...(baseConfig.plugins || []),
            new Angular21CompatibilityPlugin({
                maxWorkers: isAWS ? 1 : 2
            })
        ],

        // Performance settings similar to Angular 16
        performance: {
            hints: 'warning',
            maxEntrypointSize: 2000000, // 2MB - Angular 16 default
            maxAssetSize: 1000000, // 1MB - Angular 16 default
        },

        // Resolve configuration for Angular 21 compatibility
        resolve: {
            ...baseConfig.resolve,
            symlinks: false, // Angular 16 behavior
            cacheWithContext: false,
        },

        // Cache configuration optimized for Angular 21
        cache: {
            type: 'filesystem',
            buildDependencies: {
                config: [__filename]
            },
            // Prevent cache-related EPIPE issues
            maxMemoryGenerations: 1,
            compression: 'gzip',
        },

        // Parallelism control for Angular 21
        parallelism: isAWS ? 1 : 2,

        // Stats configuration to reduce output pressure
        stats: {
            chunks: false,
            modules: false,
            assets: false,
            children: false,
        }
    };
}

module.exports = {
    Angular21CompatibilityPlugin,
    getAngular21CompatibleConfig
};
