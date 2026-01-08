const path = require('path');

module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      maxSize: 244000,
      cacheGroups: {
        // Vendor chunk for core Angular and common libraries
        vendor: {
          test: /[\\/]node_modules[\\/](@angular|rxjs|zone\.js)/,
          name: 'vendor',
          chunks: 'all',
          priority: 30,
          enforce: true
        },
        
        // Angular Material separate chunk
        material: {
          test: /[\\/]node_modules[\\/]@angular[\\/]material/,
          name: 'angular-material',
          chunks: 'all',
          priority: 25,
          enforce: true
        },
        
        // Froala Editor - async loading
        froala: {
          test: /[\\/]node_modules[\\/]froala-editor/,
          name: 'froala',
          chunks: 'async',
          priority: 20,
          enforce: true
        },
        
        // Chart.js - async loading
        charts: {
          test: /[\\/]node_modules[\\/](chart\.js|chartjs-)/,
          name: 'charts',
          chunks: 'async',
          priority: 20,
          enforce: true
        },
        
        // D3 - async loading
        d3: {
          test: /[\\/]node_modules[\\/]d3/,
          name: 'd3',
          chunks: 'async',
          priority: 20,
          enforce: true
        },
        
        // jQuery and related
        jquery: {
          test: /[\\/]node_modules[\\/](jquery|bootstrap)/,
          name: 'jquery',
          chunks: 'all',
          priority: 15,
          enforce: true
        },
        
        // Other large libraries
        libs: {
          test: /[\\/]node_modules[\\/](dayjs|moment|lodash|google-libphonenumber)/,
          name: 'libs',
          chunks: 'all',
          priority: 10,
          enforce: true
        },
        
        // Default vendor chunk for remaining node_modules
        default: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 5,
          minChunks: 2
        }
      }
    }
  },
  
  resolve: {
    alias: {
      // Use ES modules version of lodash for better tree shaking
      'lodash': 'lodash-es'
    }
  }
};
