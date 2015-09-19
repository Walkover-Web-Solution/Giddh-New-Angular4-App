// @AngularClass

// Helper
var sliceArgs = Function.prototype.call.bind(Array.prototype.slice);
var toString  = Function.prototype.call.bind(Object.prototype.toString);
var NODE_ENV  = process.env.NODE_ENV || 'development';
var pkg = require('./package.json');

// Polyfill
Object.assign = require('object-assign');

// Node
var path = require('path');

// NPM
var webpack = require('webpack');

// Webpack Plugins
var OccurenceOrderPlugin = webpack.optimize.OccurenceOrderPlugin;
var CommonsChunkPlugin   = webpack.optimize.CommonsChunkPlugin;
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var DedupePlugin   = webpack.optimize.DedupePlugin;
var DefinePlugin   = webpack.DefinePlugin;
var BannerPlugin   = webpack.BannerPlugin;


/*
 * Config
 */

module.exports = {
  devtool: env({
    'development': 'eval',
    'all': 'source-map'
  }),

  debug: env({
    'development': true,
    'all': false
  }),
  cache: env({
    // 'development': false
    'all': true
  }),
  verbose: true,
  displayErrorDetails: true,
  context: __dirname,
  stats: env({
    'all': {
      colors: true,
      reasons: true
    }
  }),

  // our Development Server config
  devServer: {
    inline: true,
    colors: true,
    historyApiFallback: true,
    contentBase: 'src/public',
    publicPath: '/__build__'
  },

  //
  entry: {
    'angular2': [
      // Angular 2 Deps
      'rx',
      'zone.js',
      'reflect-metadata',
      // to ensure these modules are grouped together in one file
      'angular2/angular2',
      'angular2/forms',
      'angular2/core',
      'angular2/router',
      'angular2/http',
      'angular2/debug',
      'angular2/di'
    ],
    'app': [
      // App

      /*
       * include any 3rd party js lib here
       */

      './src/app/bootstrap'
    ]
  },

  // Config for our build files
  output: {
    path: root('__build__'),
    filename: env({
      'development': '[name].js',
      'all': '[name].[hash].min.js'
    }),
    sourceMapFilename: env({
      'development': '[name].js.map',
      'all': '[name].[hash].min.js.map'
    }),
    chunkFilename: '[id].chunk.js'
    // publicPath: 'http://mycdn.com/'
  },

  resolve: {
    root: __dirname,
    extensions: ['','.ts','.js','.json'],
    alias: {
      // 'app': 'src/app',
      // 'common': 'src/common',
      // 'bindings': 'src/bindings',
      // 'components': 'src/app/components'
      // 'services': 'src/app/services',
      // 'stores': 'src/app/stores'
    }
  },

  module: {
    loaders: [
      // Support for *.json files.
      { test: /\.json$/,  loader: 'json' },

      // Support for CSS as raw text
      { test: /\.css$/,   loader: 'raw' },

      // support for .html as raw text
      { test: /\.html$/,  loader: 'raw' },

      // Support for .ts files.
      { test: /\.ts$/,    loader: 'typescript-simple',
        query: {
          'ignoreWarnings': [
            2300, // 2300 -> Duplicate identifier
            2309, // 2309 -> An export assignment cannot be used in a module with other exported elements.
            2346, // 2346 -> Supplied parameters do not match any signature of call target.
            2432  // 2432 -> In an enum with multiple declarations, only one declaration can omit an initializer for its first enum element.
          ]
        },
        exclude: [
          /\.min\.js$/,
          /\.spec\.ts$/,
          /\.e2e\.ts$/,
          /web_modules/,
          /test/,
          /node_modules/
        ]
      }
    ],
    noParse: [
      /rtts_assert\/src\/rtts_assert/,
      /reflect-metadata/
    ]
  },

  plugins: env({
    'production': [
      new UglifyJsPlugin({
        compress: {
          warnings: false,
          drop_debugger: env({
            'development': false,
            'all': true
          })
        },
        output: {
          comments: false
        },
        beautify: false
      }),
      new BannerPlugin(getBanner(), {entryOnly: true})
    ],
    'development': [
      /* Dev Plugin */
      // new webpack.HotModuleReplacementPlugin(),
    ],
    'all': [
      new DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
        'VERSION': JSON.stringify(pkg.version)
      }),
      new OccurenceOrderPlugin(),
      new DedupePlugin(),

      new CommonsChunkPlugin({
        name: 'angular2',
        minChunks: Infinity,
        filename: env({
          'development': 'angular2.js',
          'all': 'angular2.min.js'
        })
      }),
      new CommonsChunkPlugin({
        name: 'common',
        filename: env({
          'development': 'common.js',
          'all': 'common.min.js'
        })
      })
    ]

  }),

  /*
   * When using `templateUrl` and `styleUrls` please use `__filename`
   * rather than `module.id` for `moduleId` in `@View`
   */
  node: {
    crypto: false,
    __filename: true
  }
};

// Helper functions

function env(configEnv) {
  if (configEnv === undefined) { return configEnv; }
  switch (toString(configEnv[NODE_ENV])) {
    case '[object Object]'    : return Object.assign({}, configEnv.all || {}, configEnv[NODE_ENV]);
    case '[object Array]'     : return [].concat(configEnv.all || [], configEnv[NODE_ENV]);
    case '[object Undefined]' : return configEnv[NODE_ENV];
    default                   : return configEnv.all;
  }
}

function getBanner() {
  return 'Angular2 Webpack Starter v'+ pkg.version +' by @gdi2990 from @AngularClass';
}

function root(args) {
  args = sliceArgs(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}

function rootNode(args) {
  args = sliceArgs(arguments, 0);
  return root.apply(path, ['node_modules'].concat(args));
}

