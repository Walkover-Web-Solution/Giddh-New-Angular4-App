/**
 * @author: @AngularClass
 */

const webpack = require('webpack');
const helpers = require('./helpers');
const buildUtils = require('./build-utils');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.renderer.js');
// the settings that are common to prod and dev
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * Webpack Plugins
 */

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function (options) {

  const ENV = process.env.ENV = process.env.NODE_ENV = 'development:renderer';
  const HOST = process.env.HOST || 'localhost';
  const PORT = process.env.PORT || 3000;
  const AppUrl = 'localhost';
  const METADATA = Object.assign({}, buildUtils.DEFAULT_METADATA, {
    host: HOST,
    port: PORT,
    ENV: ENV,
    HMR: options.HMR,
    PUBLIC: process.env.PUBLIC_DEV || HOST + ':' + PORT,
    isElectron: true,
    AOT: options.AOT,
    errlyticsNeeded: false,
    errlyticsKey: '',
    AppUrl: AppUrl,
  });

  // set environment suffix so these environments are loaded.
  METADATA.envFileSuffix = process.env.envFileSuffix;
  return webpackMerge(commonConfig({
    env: ENV,
    metadata: METADATA
  }), {
    mode: 'development',
    devtool: 'inline-source-map',
    /**
     * Options affecting the output of the compilation.
     *
     * See: http://webpack.github.io/docs/configuration.html#output
     */
    output: {

      /**
       * The output directory as absolute path (required).
       *
       * See: http://webpack.github.io/docs/configuration.html#output-path
       */
      path: helpers.root('dist'),

      /**
       * Specifies the name of each output file on disk.
       * IMPORTANT: You must not specify an absolute path here!
       *
       * See: http://webpack.github.io/docs/configuration.html#output-filename
       */
      filename: '[name].bundle.js',

      /**
       * The filename of the SourceMaps for the JavaScript files.
       * They are inside the output.path directory.
       *
       * See: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
       */
      sourceMapFilename: '[file].map',

      /** The filename of non-entry chunks as relative path
       * inside the output.path directory.
       *
       * See: http://webpack.github.io/docs/configuration.html#output-chunkfilename
       */
      chunkFilename: '[id].chunk.js',

      library: 'ac_[name]',
      libraryTarget: 'var',
    },

    module: {

      rules: [

        /**
         * Css loader support for *.css files (styles directory only)
         * Loads external css styles into the DOM, supports HMR
         *
         */
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
          include: [helpers.root('src', 'styles')]
        },

        /**
         * Sass loader support for *.scss files (styles directory only)
         * Loads external sass styles into the DOM, supports HMR
         *
         */
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
          include: [helpers.root('src', 'styles')]
        },

      ]

    },

    plugins: [
      /**
       * Plugin: DefinePlugin
       * Description: Define free variables.
       * Useful for having development builds with debug logging or adding global constants.
       *
       * Environment helpers
       *
       * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
       *
       * NOTE: when adding more properties, make sure you include them in custom-typings.d.ts
       */
      // new webpack.DefinePlugin(Object.assign({
      //   'ENV': JSON.stringify(METADATA.ENV),
      //   'HMR': METADATA.HMR,
      //   'AOT': METADATA.AOT,
      //   'isElectron': JSON.stringify(true),
      //   'process.env.ENV': JSON.stringify(METADATA.ENV),
      //   'process.env.NODE_ENV': JSON.stringify(METADATA.ENV),
      //   'process.env.HMR': METADATA.HMR,
      //   'process.env.isElectron': JSON.stringify(true)
      // }, METADATA.definePluginObject, {process: {env: {...METADATA.definePluginObject, isElectron: true}}})),



      new webpack.LoaderOptionsPlugin({
        debug: true,
        options: {}
      })

    ],

    /**
     * Webpack Development Server configuration
     * Description: The webpack-dev-server is a little node.js Express server.
     * The server emits information about the compilation state to the client,
     * which reacts to those events.
     *
     * See: https://webpack.github.io/docs/webpack-dev-server.html
     */
    devServer: {
      port: METADATA.port,
      host: METADATA.host,
      hot: METADATA.HMR,
      public: METADATA.PUBLIC,
      historyApiFallback: true,
      watchOptions: {
        // if you're using Docker you may need this
        // aggregateTimeout: 300,
        // poll: 1000,
        ignored: /node_modules/
      },
      /**
       * Here you can access the Express app object and add your own custom middleware to it.
       *
       * See: https://webpack.github.io/docs/webpack-dev-server.html
       */
      before: function (app) {
        // For example, to define custom handlers for some paths:
        // app.get('/some/path', function(req, res) {
        //   res.json({ custom: 'response' });
        // });
      }
    }

  });
}
