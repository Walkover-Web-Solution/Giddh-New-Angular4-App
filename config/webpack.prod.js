/**
 * @author: @AngularClass
 */
const helpers = require('./helpers');
const buildUtils = require('./build-utils');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
/**
 * Used to merge webpack configs
 */
const webpackMerge = require('webpack-merge');
/**
 * The settings that are common to prod and dev
 */
const commonConfig = require('./webpack.common.js');

/**
 * Webpack Plugins
 */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HashedModuleIdsPlugin = require('webpack/lib/HashedModuleIdsPlugin');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');


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

module.exports = function(env) {
    const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
    const supportES2015 = buildUtils.supportES2015(buildUtils.DEFAULT_METADATA.tsConfigPath);
    const METADATA = Object.assign({}, buildUtils.DEFAULT_METADATA, {
        host: process.env.HOST || 'localhost',
        port: process.env.PORT || 8080,
        ENV: ENV,
        HMR: false
    });

    // set environment suffix so these environments are loaded.
    METADATA.envFileSuffix = process.env.envFileSuffix;

    return webpackMerge(commonConfig({ env: ENV, metadata: METADATA }), {
        mode: 'production',
        devtool: 'none',
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
            filename: '[name].[hash].bundle.js',

            /**
             * The filename of the SourceMaps for the JavaScript files.
             * They are inside the output.path directory.
             *
             * See: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
             */
            // sourceMapFilename: '[file].map',

            /**
             * The filename of non-entry chunks as relative path
             * inside the output.path directory.
             *
             * See: http://webpack.github.io/docs/configuration.html#output-chunkfilename
             */
            chunkFilename: '[name].[hash].chunk.js'

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
                    include: [helpers.root('src', 'styles', 'node_modules')]
                },

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
                    sourceMap: false,
                    parallel: true,
                    cache: helpers.root('webpack-cache/uglify-cache'),
                    uglifyOptions: getUglifyOptions(supportES2015)
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
            new MiniCssExtractPlugin({ filename: '[name]-[hash].css', chunkFilename: '[name]-[hash].css' }),
            // ================ commmenting due to search module crash
            // new HashedModuleIdsPlugin(),
            // ================ //
            // new BundleAnalyzerPlugin({generateStatsFile: true}),
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
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