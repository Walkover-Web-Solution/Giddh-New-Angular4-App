/**
 * @author: @AngularClass
 */

const webpack = require('webpack');
const helpers = require('./helpers');
const buildUtils = require('./build-utils');
const webpackMerge = require('webpack-merge'); // used to merge webpack configs

const commonConfig = require('./webpack.common.js'); // the settings that are common to prod and dev
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * Webpack Plugins
 */
const DefinePlugin = require('webpack/lib/DefinePlugin');

const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const EvalSourceMapDevToolPlugin = require('webpack/lib/EvalSourceMapDevToolPlugin');

const ERRLYTICS_KEY_DEV = '';
/**
 * Webpack Constants
 */


/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function(options) {
    const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
    const HOST = process.env.HOST || 'localapp.giddh.com';
    const PORT = process.env.PORT || 3000;
    const AppUrl = 'http://localapp.giddh.com:3000/';
    const ApiUrl = 'http://apitest.giddh.com/';
    // const ApiUrl = 'http://apidev.giddh.com/';
    const METADATA = Object.assign({}, buildUtils.DEFAULT_METADATA, {
        host: HOST,
        port: PORT,
        ENV: ENV,
        HMR: helpers.hasProcessFlag('hot'),
        PUBLIC: process.env.PUBLIC_DEV || HOST + ':' + PORT,
        isElectron: false,
        errlyticsNeeded: false,
        errlyticsKey: ERRLYTICS_KEY_DEV,
        AppUrl: AppUrl,
        ApiUrl: ApiUrl,
        APP_FOLDER: ''
    });

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
            new DefinePlugin({
                'ENV': JSON.stringify(METADATA.ENV),
                'HMR': METADATA.HMR,
                'isElectron': false,
                'errlyticsNeeded': false,
                'errlyticsKey': ERRLYTICS_KEY_DEV,
                'AppUrl': JSON.stringify(METADATA.AppUrl),
                'ApiUrl': JSON.stringify(METADATA.ApiUrl),
                'APP_FOLDER': JSON.stringify(METADATA.APP_FOLDER),
                'process.env': {
                    'ENV': JSON.stringify(METADATA.ENV),
                    'NODE_ENV': JSON.stringify(METADATA.ENV),
                    'HMR': METADATA.HMR
                }
            }),
            new EvalSourceMapDevToolPlugin({
                moduleFilenameTemplate: '[resource-path]',
                sourceRoot: 'webpack:///'
            }),
            new HtmlWebpackPlugin({
                template: 'src/index.html',
                title: METADATA.title,
                chunksSortMode: 'dependency',
                metadata: METADATA,
                inject: 'body'
            }),


            /**
             * Plugin: NamedModulesPlugin (experimental)
             * Description: Uses file names as module name.
             *
             * See: https://github.com/webpack/webpack/commit/a04ffb928365b19feb75087c63f13cadfc08e1eb
             */
            new NamedModulesPlugin(),

            /**
             * Plugin LoaderOptionsPlugin (experimental)
             *
             * See: https://gist.github.com/sokra/27b24881210b56bbaff7
             */
            new LoaderOptionsPlugin({
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
            setup: function(app) {
                // For example, to define custom handlers for some paths:
                // app.get('/some/path', function(req, res) {
                //   res.json({ custom: 'response' });
                // });
            }
        },

        /**
         * Include polyfills or mocks for various node stuff
         * Description: Node configuration
         *
         * See: https://webpack.github.io/docs/configuration.html#node
         */
        node: {
            global: true,
            crypto: 'empty',
            process: true,
            module: false,
            clearImmediate: false,
            setImmediate: false
        }

    });
}