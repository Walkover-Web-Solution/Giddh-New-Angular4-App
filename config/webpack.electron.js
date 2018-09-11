
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const helpers = require('./helpers');
const buildUtils = require('./build-utils');
/**
 * Webpack Plugins
 */
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const NoEmitOnErrorsPlugin = require('webpack/lib/NoEmitOnErrorsPlugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ElectronConnectWebpackPlugin = require('electron-connect-webpack-plugin');
const SpecifyTsFilesPlugin = require('./specify-ts-files-plugin');

function getUglifyOptions (supportES2015) {
  const uglifyCompressOptions = {
    pure_getters: true,
    passes: 3
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

/**
 * Webpack Constants
 */
const supportES2015 = buildUtils.supportES2015(buildUtils.DEFAULT_METADATA.tsConfigPath);
const PROD = helpers.hasNpmFlag('prod');
const ENV = JSON.stringify(process.env.NODE_ENV = process.env.ENV = PROD ? 'production' : 'development');
const HOST = JSON.stringify(process.env.HOST || 'localhost');
const PORT = process.env.PORT || 3000;
const AppUrl = 'localhost';
module.exports = function (options) {

  DEV_SERVER = options && options['live'] || false;
  const METADATA = {
    host: HOST,
    port: PORT,
    ENV: ENV,
    DEV_SERVER: DEV_SERVER,
    isElectron: true,
    AppUrl: AppUrl
  };

  const entry = {
    'index': './src/main.electron.ts'
  };

  const otherFilesToCompile = [];

  const tsConfigBase = 'tsconfig.webpack.json';
  const customTsConfigFileName = 'tsconfig.main.temp.json';

  const atlConfig = {
    configFileName: customTsConfigFileName
  };

  // devtool: PROD ? 'source-map' : 'cheap-module-source-map',
  return {
    name: "main",

    mode: 'production',

    devtool: PROD ? 'none' : 'cheap-module-source-map',

    entry: entry,

    output: {
      path: DEV_SERVER ? helpers.root('dev') : helpers.root('dist'),
      filename: '[name].js',
      sourceMapFilename: '[file].map'
    },

    resolve: {
      extensions: ['.ts', '.js', 'json']
    },

    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'awesome-typescript-loader?' + JSON.stringify(atlConfig)
        },
        {
          // Mark files inside `@angular/core` as using SystemJS style dynamic imports.
          // Removing this will cause deprecation warnings to appear.
          test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
          parser: { system: true },
        }
      ]
    },

    node: {
      __dirname: false,
      __filename: false
    },

    externals: [nodeExternals()],

    plugins: [
      PROD ? new NoEmitOnErrorsPlugin() : null,
      new webpack.DefinePlugin({
        'ENV': JSON.stringify(METADATA.ENV),
        'HMR': JSON.stringify(METADATA.HMR),
        'DEV_SERVER': METADATA.DEV_SERVER,
        'isElectron': JSON.stringify(METADATA.isElectron),
        'AppUrl': JSON.stringify(METADATA.AppUrl),
        'process.env': {
          'ENV': JSON.stringify(METADATA.ENV),
          'NODE_ENV': JSON.stringify(METADATA.ENV),
          'HMR': JSON.stringify(METADATA.HMR)
        }
      }),
      // new CheckerPlugin(),
      new webpack.IgnorePlugin(new RegExp("^(spawn-sync|bufferutil|utf-8-validate)$")),
      new SpecifyTsFilesPlugin({
        root: helpers.root('.'),
        entry: entry,
        otherFilesToCompile: otherFilesToCompile,
        tsConfigBase: tsConfigBase,
        customTsConfigFileName: customTsConfigFileName
      }),

      PROD ? new UglifyJsPlugin({
        sourceMap: true,
        uglifyOptions: getUglifyOptions(supportES2015)
      }) : null,
      DEV_SERVER ? new ElectronConnectWebpackPlugin({
        path: helpers.root('dev'),
        stopOnClose: true,
        logLevel: 0
      }) : null,
    ].filter(plugin => plugin !== null),

    target: "electron-main"
  };

}
