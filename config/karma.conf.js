/**
 * @author: @AngularClass
 */

module.exports = function(config) {
  var testWebpackConfig = require("./webpack.test.js")({ env: "test" });

  var configuration = {
    /**
     * Base path that will be used to resolve all patterns (e.g. files, exclude).
     */
    basePath: "",

    /**
     * Frameworks to use
     *
     * available frameworks: https://npmjs.org/browse/keyword/karma-adapter
     */
    frameworks: ["jasmine"],

    /**
     * List of files to exclude.
     */
    exclude: ["./node_modules_electron/**"],
    exprContextCritical: false,

    client: {
      captureConsole: false
    },

    /**
     * List of files / patterns to load in the browser
     *
     * we are building the test environment in ./spec-bundle.js
     */
    files: [
      "./node_modules/es6-shim/es6-shim.min.js",
      "./src/assets/js/lodash.min.js",
      "./karma.entry.js"
    ],

    /**
     * By default all assets are served at http://localhost:[PORT]/base/
     */
    proxies: {
      "/assets/": "./src/assets/"
    },

    /**
     * Preprocess matching files before serving them to the browser
     * available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
     */
    preprocessors: {
      "./karma.entry.js": ["webpack"]
    },
    phantomJsLauncher: {
      exitOnResourceError: true
    },

    /**
     * Webpack Config at ./webpack.test.js
     */
    webpack: testWebpackConfig,

    coverageReporter: {
      type: "in-memory"
    },

    remapCoverageReporter: {
      "text-summary": null,
      json: "./coverage/coverage.json",
      html: "./coverage/html"
    },

    /**
     * Webpack please don't spam the console when running in karma!
     */
    webpackMiddleware: {
      /**
       * webpack-dev-middleware configuration
       * i.e.
       */
      noInfo: true,
      /**
       * and use stats to turn off verbose output
       */
      stats: {
        /**
         * options i.e.
         */
        chunks: false
      }
    },

    /**
     * Test results reporter to use
     *
     * possible values: 'dots', 'progress'
     * available reporters: https://npmjs.org/browse/keyword/karma-reporter
     */
    reporters: [
      "mocha",
      "progress",
      "kjhtml",
      "coverage",
      "remap-coverage",
      "dots"
    ],

    /**
     * Web server port.
     */
    port: 9876,

    /**
     * enable / disable colors in the output (reporters and logs)
     */
    colors: true,

    /**
     * Level of logging
     * possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
     */
    logLevel: config.LOG_WARN,

    /**
     * enable / disable watching file and executing tests whenever any file changes
     */
    autoWatch: false,

    /**
     * start these browsers
     * available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
     */
    browsers: ["Chrome", "PhantomJS"],

    customLaunchers: {
      ChromeTravisCi: {
        base: "Chrome",
        flags: ["--no-sandbox"]
      }
    },

    /**
     * Continuous Integration mode
     * if true, Karma captures browsers, runs the tests and exits
     */
    singleRun: false,
    webpackServer: {
      noInfo: true
    }
  };

  if (process.env.TRAVIS) {
    configuration.browsers = ["ChromeTravisCi"];
  }

  config.set(configuration);
};
