const path = require('path');
const { getAngular21CompatibleConfig, Angular21CompatibilityPlugin } = require('./angular21-webpack-compatibility');

// Base configuration with Angular 21 EPIPE error prevention
const baseConfig = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      // AWS CodePipeline optimized chunk sizes - smaller for constrained environments
      maxSize: process.env.AWS_CODEBUILD ? 200000 : 244000,
      cacheGroups: {
        // Separate Froala Editor into its own chunk - AWS optimized
        froala: {
          test: /[\\/]node_modules[\\/]froala-editor[\\/]/,
          name: 'froala-editor',
          chunks: 'all',
          priority: 20,
          maxSize: process.env.AWS_CODEBUILD ? 400000 : 500000,
          enforce: true
        },
        // Separate Chart.js into its own chunk - AWS optimized
        chartjs: {
          test: /[\\/]node_modules[\\/]chart\.js[\\/]/,
          name: 'chart-js',
          chunks: 'all',
          priority: 15,
          maxSize: process.env.AWS_CODEBUILD ? 250000 : 300000,
          enforce: true
        },
        // Angular framework chunks - AWS optimized
        angular: {
          test: /[\\/]node_modules[\\/]@angular[\\/]/,
          name: 'angular-framework',
          chunks: 'all',
          priority: 10,
          maxSize: process.env.AWS_CODEBUILD ? 300000 : 400000,
          enforce: true
        },
        // Default vendor chunk for other libraries - AWS optimized
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 5,
          maxSize: process.env.AWS_CODEBUILD ? 200000 : 244000,
          minChunks: 1
        },
        // Common application code - AWS optimized
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 1,
          maxSize: process.env.AWS_CODEBUILD ? 200000 : 244000
        }
      }
    },
    // Angular 21 compatible optimization settings
    minimize: true,
    usedExports: true,
    sideEffects: false,
    // Reduce memory pressure during optimization
    concatenateModules: false
  },
  resolve: {
    symlinks: false,
    cacheWithContext: false
  },
  // Angular 21 compatible caching
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    },
    // Reduce cache size to prevent memory issues
    maxMemoryGenerations: 1
  },
  // AWS CodePipeline optimized parallelism - prevent EPIPE errors
  parallelism: process.env.AWS_CODEBUILD ? 1 : 2,
  // Configure module resolution for problematic packages
  module: {
    rules: [
      {
        test: /froala-editor/,
        sideEffects: false
      },
      {
        test: /chart\.js/,
        sideEffects: false
      }
    ]
  },
  // Angular 21 specific performance optimizations
  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
};

// Export Angular 21 compatible configuration to prevent EPIPE regression
module.exports = getAngular21CompatibleConfig(baseConfig);
