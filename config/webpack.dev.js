/**
 * @author: @AngularClass
 */

var helpers = require('./helpers');
var webpackMerge = require('webpack-merge'); //Used to merge webpack configs
var commonConfig = require('./webpack.common.js'); //The settings that are common to prod and dev


module.exports = webpackMerge(commonConfig, {
  // Switch loaders to debug mode.
  //
  // See: http://webpack.github.io/docs/configuration.html#debug
  debug: true,

  // Developer tool to enhance debugging
  //
  // See: http://webpack.github.io/docs/configuration.html#devtool
  // See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
  devtool: 'cheap-module-eval-source-map',

  // Options affecting the output of the compilation.
  //
  // See: http://webpack.github.io/docs/configuration.html#output
  output: {

    // The output directory as absolute path (required).
    //
    // See: http://webpack.github.io/docs/configuration.html#output-path
    path: helpers.root('dist'),

    // Specifies the name of each output file on disk.
    // IMPORTANT: You must not specify an absolute path here!
    //
    // See: http://webpack.github.io/docs/configuration.html#output-filename
    filename: '[name].bundle.js',

    // The filename of the SourceMaps for the JavaScript files.
    // They are inside the output.path directory.
    //
    // See: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
    sourceMapFilename: '[name].map',

    // The filename of non-entry chunks as relative path
    // inside the output.path directory.
    //
    // See: http://webpack.github.io/docs/configuration.html#output-chunkfilename
    chunkFilename: '[id].chunk.js'

  },

  // Static analysis linter for TypeScript advanced options configuration
  // Description: An extensible linter for the TypeScript language.
  //
  // See: https://github.com/wbuchwalter/tslint-loader
  tslint: {
    emitErrors: false,
    failOnHint: false,
    resourcePath: 'src'
  },

  // Webpack Development Server configuration
  // Description: The webpack-dev-server is a little node.js Express server.
  // The server emits information about the compilation state to the client,
  // which reacts to those events.
  //
  // See: https://webpack.github.io/docs/webpack-dev-server.html
  devServer: {
    port: commonConfig.metadata.port,
    host: commonConfig.metadata.host,
    historyApiFallback: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  },

  node: {
    global: 'window',
    crypto: 'empty',
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
});
