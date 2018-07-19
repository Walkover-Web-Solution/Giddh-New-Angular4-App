/**
 * @author: @AngularClass
 */
const ERRLYTICS_KEY_PROD = 'eTrTpSiedQC4tLUYVDup3RJpc_wFL2QhCaIc0vzpsQA';
const helpers = require('./helpers');
const buildUtils = require('./build-utils');
/**
 * Used to merge webpack configs
 */
const webpackMerge = require('webpack-merge');
/**
 * The settings that are common to prod and dev
 */
const commonConfig = require('./webpack.common.js');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
/**
 * Webpack Plugins
 */
const SourceMapDevToolPlugin = require('webpack/lib/SourceMapDevToolPlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HashedModuleIdsPlugin = require('webpack/lib/HashedModuleIdsPlugin')
const PurifyPlugin = require('@angular-devkit/build-optimizer').PurifyPlugin;
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * Webpack Constants
 */
// const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
// const HOST = process.env.HOST || 'giddh.com';
// const PORT = process.env.PORT || 80;
// const AppUrl = 'https://giddh.com/new/';
// const ApiUrl = 'https://api.giddh.com/';
// const METADATA = webpackMerge(commonConfig({
//   env: ENV
// }).metadata, {
//     host: HOST,
//     port: PORT,
//     ENV: ENV,
//     HMR: false,
//     isElectron: false,
//     errlyticsNeeded: true,
//     errlyticsKey: ERRLYTICS_KEY_PROD,
//     AppUrl: AppUrl,
//     ApiUrl: ApiUrl
//   });


function getUglifyOptions(supportES2015) {
  const uglifyCompressOptions = {
    pure_getters: true,
    /* buildOptimizer */
    // PURE comments work best with 3 passes.
    // See https://github.com/webpack/webpack/issues/2899#issuecomment-317425926.
    passes: 3 /* buildOptimizer */
  };
  return {
    ecma: supportES2015 ? 6 : 5,
    warnings: false, // TODO verbose based on option?
    ie8: false,
    mangle: true,
    compress: uglifyCompressOptions,
    output: {
      ascii_only: true,
      comments: false
    }
  };
}

module.exports = function (env) {
  const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
  const supportES2015 = buildUtils.supportES2015(buildUtils.DEFAULT_METADATA.tsConfigPath);
  const AppUrl = 'https://giddh.com/';
  // const ApiUrl = 'https://api.giddh.com/';
  const ApiUrl = 'http://giddh-api-prod.eu-west-1.elasticbeanstalk.com/';
  const METADATA = Object.assign({}, buildUtils.DEFAULT_METADATA, {
    host: process.env.HOST || 'giddh.com',
    port: process.env.PORT || 80,
    ENV: ENV,
    HMR: false,
    isElectron: false,
    errlyticsNeeded: true,
    errlyticsKey: ERRLYTICS_KEY_PROD,
    AppUrl: AppUrl,
    ApiUrl: ApiUrl,
    APP_FOLDER: 'app/'
  });

  // set environment suffix so these environments are loaded.
  METADATA.envFileSuffix = METADATA.E2E ? 'e2e.prod' : 'prod';
  return webpackMerge(commonConfig({
    env: ENV,
    metadata: METADATA
  }), {

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
      filename: '[name].[chunkhash].bundle.js',

      /**
       * The filename of the SourceMaps for the JavaScript files.
       * They are inside the output.path directory.
       *
       * See: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
       */
      sourceMapFilename: '[file].map',

      /**
       * The filename of non-entry chunks as relative path
       * inside the output.path directory.
       *
       * See: http://webpack.github.io/docs/configuration.html#output-chunkfilename
       */
      chunkFilename: '[name].[chunkhash].chunk.js'

    },

    module: {

      rules: [

        /**
         * Extract CSS files from .src/styles directory to external CSS file
         */
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader'
          }),
          include: [helpers.root('src', 'styles')]
        },

        /**
         * Extract and compile SCSS files from .src/styles directory to external CSS file
         */
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader!sass-loader'
          }),
          include: [helpers.root('src', 'styles')]
        },
        {
          test: /\.js$/,
          loader: '@angular-devkit/build-optimizer/webpack-loader',
          options: {
            sourceMap: false
          }
        }

      ]

    },

    /**
     * Add additional plugins to the compiler.
     *
     * See: http://webpack.github.io/docs/configuration.html#plugins
     */
    plugins: [
      // new BundleAnalyzerPlugin(), // Arpit: Commented on 3rd Apr 2018
      new SourceMapDevToolPlugin({
        filename: '[file].map[query]',
        moduleFilenameTemplate: '[resource-path]',
        fallbackModuleFilenameTemplate: '[resource-path]?[hash]',
        sourceRoot: 'webpack:///'
      }),

      /**
       * Plugin: ExtractTextPlugin
       * Description: Extracts imported CSS files into external stylesheet
       *
       * See: https://github.com/webpack/extract-text-webpack-plugin
       */
      new ExtractTextPlugin('[name].[contenthash].css'),

      new PurifyPlugin(), /* buildOptimizer */
      new HashedModuleIdsPlugin(),
      new ModuleConcatenationPlugin(),
      /**
       * Plugin: DefinePlugin
       * Description: Define free variables.
       * Useful for having development builds with debug logging or adding global constants.
       *
       * Environment helpers
       *
       * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
       */
      // NOTE: when adding more properties make sure you include them in custom-typings.d.ts
      new DefinePlugin({
        'ENV': JSON.stringify(METADATA.ENV),
        'HMR': METADATA.HMR,
        'isElectron': false,
        'errlyticsNeeded': true,
        'errlyticsKey': ERRLYTICS_KEY_PROD,
        'AppUrl': JSON.stringify(METADATA.AppUrl),
        'ApiUrl': JSON.stringify(METADATA.ApiUrl),
        'APP_FOLDER': JSON.stringify(METADATA.APP_FOLDER),
        'process.env': {
          'ENV': JSON.stringify(METADATA.ENV),
          'NODE_ENV': JSON.stringify(METADATA.ENV),
          'HMR': METADATA.HMR
        }
      }),
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        title: METADATA.title,
        chunksSortMode: 'dependency',
        metadata: METADATA,
        inject: 'body'
      }),
      /**
       * Plugin: UglifyJsPlugin
       * Description: Minimize all JavaScript output of chunks.
       * Loaders are switched into minimizing mode.
       *
       * See: https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
       *
       * NOTE: To debug prod builds uncomment //debug lines and comment //prod lines
       */
      new UglifyJsPlugin({
        uglifyOptions: getUglifyOptions(supportES2015)
      })

    ],

    /**
     * Include polyfills or mocks for various node stuff
     * Description: Node configuration
     *
     * See: https://webpack.github.io/docs/configuration.html#node
     */
    node: {
      global: true,
      crypto: 'empty',
      process: false,
      module: false,
      clearImmediate: false,
      setImmediate: false
    }

  });
}
