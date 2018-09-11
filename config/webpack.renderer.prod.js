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
const commonConfig = require('./webpack.renderer.js');

/**
 * Webpack Plugins
 */
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HashedModuleIdsPlugin = require('webpack/lib/HashedModuleIdsPlugin');


function getUglifyOptions(supportES2015) {
  const uglifyCompressOptions = {
    pure_getters: true, /* buildOptimizer */
    // PURE comments work best with 3 passes.
    // See https://github.com/webpack/webpack/issues/2899#issuecomment-317425926.
    passes: 3         /* buildOptimizer */
  };

  return {
    ecma: supportES2015 ? 6 : 5,
    warnings: false,    // TODO verbose based on option?
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
  const AppUrl = './';
  const METADATA = Object.assign({}, buildUtils.DEFAULT_METADATA, {
    baseUrl: '',
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 80,
    ENV: ENV,
    HMR: false,
    isElectron: true,
    errlyticsNeeded: false,
    errlyticsKey: ERRLYTICS_KEY_PROD,
    AppUrl: AppUrl
  });

  // set environment suffix so these environments are loaded.
  METADATA.envFileSuffix = process.env.envFileSuffix;
  return webpackMerge(commonConfig({env: ENV, metadata: METADATA}), {
    mode: 'production', /**
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
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
          include: [helpers.root('src', 'styles')]
        },

        /**
         * Extract and compile SCSS files from .src/styles directory to external CSS file
         */
        {
          test: /\.scss$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
          include: [helpers.root('src', 'styles')]
        }
      ]

    },
    optimization: {
      minimizer: [
        /**
         * Plugin: UglifyJsPlugin
         * Description: Minimize all JavaScript output of chunks.
         * Loaders are switched into minimizing mode.
         *
         * See: https://webpack.js.org/plugins/uglifyjs-webpack-plugin/
         *
         * NOTE: To debug prod builds uncomment //debug lines and comment //prod lines
         */
        new UglifyJsPlugin({
          sourceMap: true,
          parallel: true,
          cache: helpers.root('webpack-cache/uglify-cache'),
          uglifyOptions: getUglifyOptions(supportES2015, true)
        })
      ],
      splitChunks: {
        chunks: 'all'
      }
    },
    /**
     * Add additional plugins to the compiler.
     *
     * See: http://webpack.github.io/docs/configuration.html#plugins
     */
    plugins: [

      new MiniCssExtractPlugin({filename: '[name]-[hash].css', chunkFilename: '[name]-[chunkhash].css'}),
      new HashedModuleIdsPlugin(),

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
      // new webpack.DefinePlugin({
      //   'ENV': JSON.stringify(METADATA.ENV),
      //   'HMR': JSON.stringify(METADATA.HMR),
      //   'isElectron': JSON.stringify(true),
      //   'errlyticsNeeded': JSON.stringify(false),
      //   'errlyticsKey': ERRLYTICS_KEY_PROD,
      //   'AppUrl': JSON.stringify(METADATA.AppUrl),
      //   'process.env': {
      //     'ENV': JSON.stringify(METADATA.ENV),
      //     'NODE_ENV': JSON.stringify(METADATA.ENV),
      //     'HMR': JSON.stringify(METADATA.HMR)
      //   }
      // }),
      // new HtmlWebpackPlugin({
      //   template: 'src/index.html',
      //   title: METADATA.title,
      //   chunksSortMode: 'dependency',
      //   metadata: METADATA,
      //   inject: 'body'
      // }),
      /**
       * Plugin: UglifyJsPlugin
       * Description: Minimize all JavaScript output of chunks.
       * Loaders are switched into minimizing mode.
       *
       * See: https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
       *
       * NOTE: To debug prod builds uncomment //debug lines and comment //prod lines
       //  */
      // new UglifyJsPlugin({
      //   uglifyOptions: getUglifyOptions(supportES2015)
      // })

    ],

    /**
     * Include polyfills or mocks for various node stuff
     * Description: Node configuration
     *
     * See: https://webpack.github.io/docs/configuration.html#node
     */
    // node: {
    //   global: true,
    //   crypto: 'empty',
    //   process: false,
    //   module: false,
    //   clearImmediate: false,
    //   setImmediate: false
    // }

  });
}
