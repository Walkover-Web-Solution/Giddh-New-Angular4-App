
// webpack.config.js - Tree Shaking Optimizations
const path = require('path');

module.exports = {
  mode: 'production',
  optimization: {
    usedExports: true,
    sideEffects: false,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10
        },
        lodash: {
          test: /[\\/]node_modules[\\/]lodash/,
          name: 'lodash',
          chunks: 'all',
          priority: 20
        },
        material: {
          test: /[\\/]node_modules[\\/]@angular[\\/]material/,
          name: 'angular-material',
          chunks: 'all',
          priority: 15
        }
      }
    }
  },
  resolve: {
    alias: {
      'lodash': 'lodash-es' // Use ES modules version for better tree shaking
    }
  }
};