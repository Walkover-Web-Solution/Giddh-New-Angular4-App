const ts = require('typescript');
const path = require('path');
const fs = require('fs');
const helpers = require('./helpers');
const environments = require('./environment');
const DEFAULT_METADATA = {
  title: 'Giddh Application',
  baseUrl: '/',
  isDevServer: helpers.isWebpackDevServer(),
  HMR: helpers.hasProcessFlag('hot'),
  AOT: process.env.BUILD_AOT || helpers.hasNpmFlag('aot'),
  E2E: !!process.env.BUILD_E2E,
  WATCH: helpers.hasProcessFlag('watch'),
  tsConfigPath: 'tsconfig.webpack.json',
  envFileSuffix: process.env.envFileSuffix,
  definePluginObject: GetEnvPlugin(process.env.definePluginEnv || 'local'),
  isElectron: helpers.hasNpmFlag('electron')
};

function supportES2015(tsConfigPath) {
  if (!supportES2015.hasOwnProperty('supportES2015')) {
    const tsTarget = readTsConfig(tsConfigPath).options.target;
    supportES2015['supportES2015'] = tsTarget !== ts.ScriptTarget.ES3 && tsTarget !== ts.ScriptTarget.ES5;
  }
  return supportES2015['supportES2015'];
}

function GetEnvPlugin(env) {
  let environment = environments[env];

  console.log(JSON.stringify(environment));
  return environment;
  // let plugin = new DefinePlugin({
  //   'ENV': JSON.stringify(METADATA.ENV),
  //   'HMR': METADATA.HMR,
  //   'isElectron': false,
  //   'errlyticsNeeded': env.errlyticsNeeded,
  //   'errlyticsKey': env.errlyticsKey,
  //   'AppUrl': JSON.stringify(env.AppUrl),
  //   'ApiUrl': JSON.stringify(env.ApiUrl),
  //   'APP_FOLDER': JSON.stringify(env.APP_FOLDER),
  //   'process.env': {
  //     'ENV': JSON.stringify(METADATA.ENV),
  //     'NODE_ENV': JSON.stringify(METADATA.ENV),
  //     'HMR': METADATA.HMR
  //   }
  // }),
}

function readTsConfig(tsConfigPath) {
  const configResult = ts.readConfigFile(tsConfigPath, ts.sys.readFile);
  return ts.parseJsonConfigFileContent(configResult.config, ts.sys,
    path.dirname(tsConfigPath), undefined, tsConfigPath);
}

function getEnvFile(suffix) {
  if (suffix && suffix[0] !== '.') {
    suffix = '.' + suffix;
  }

  if (suffix === null) {
    return;
  }

  let fileName = helpers.root(`src/environments/environment${suffix}.ts`);
  if (fs.existsSync(fileName)) {
    return fileName;
  } else if (fs.existsSync(fileName = helpers.root('src/environments/environment.ts'))) {
    console.warn(`Could not find environment file with suffix ${suffix}, loading default environment file`);
    return fileName;
  } else {
    throw new Error('Environment file not found.')
  }
}

/**
 * Read the tsconfig to determine if we should prefer ES2015 modules.
 * Load rxjs path aliases.
 * https://github.com/ReactiveX/rxjs/blob/master/doc/lettable-operators.md#build-and-treeshaking
 * @param supportES2015 Set to true when the output of typescript is >= ES6
 */
function rxjsAlias(supportES2015) {
  try {
    const rxjsPathMappingImport = supportES2015 ? 'rxjs/_esm2015/path-mapping' : 'rxjs/_esm5/path-mapping';
    const rxPaths = require(rxjsPathMappingImport);
    return rxPaths(helpers.root('node_modules'));
  } catch (e) {
    return {};
  }
}

function ngcWebpackSetup(prod, metadata) {
  if (!metadata) {
    metadata = DEFAULT_METADATA;
  }
  console.log('govinda : prod ', prod)
  const buildOptimizer = prod;
  const sourceMap = !prod; // TODO: apply based on tsconfig value?
  const ngcWebpackPluginOptions = {
    skipCodeGeneration: !metadata.AOT,
    sourceMap
  };

  const environment = getEnvFile(metadata.envFileSuffix);
  if (environment) {
    ngcWebpackPluginOptions.hostReplacementPaths = {
      [helpers.root('src/environments/environment.ts')]: environment
    }
  }

  if (!prod && metadata.WATCH) {
    // Force commonjs module format for TS on dev watch builds.
    ngcWebpackPluginOptions.compilerOptions = {
      module: 'commonjs'
    };
  }

  const buildOptimizerLoader = {
    loader: '@angular-devkit/build-optimizer/webpack-loader',
    options: {
      sourceMap
    }
  };

  const loaders = [
    {
      test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
      use: metadata.AOT && buildOptimizer ? [buildOptimizerLoader, '@ngtools/webpack'] : ['@ngtools/webpack']
    },
    {
      // Mark files inside `@angular/core` as using SystemJS style dynamic imports.
      // Removing this will cause deprecation warnings to appear.
      test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
      parser: {system: true},
    },
    ...buildOptimizer
      ? [{test: /\.js$/, use: [buildOptimizerLoader]}]
      : []
  ];

  return {
    loaders,
    plugin: ngcWebpackPluginOptions
  };
}


exports.DEFAULT_METADATA = DEFAULT_METADATA;
exports.supportES2015 = supportES2015;
exports.readTsConfig = readTsConfig;
exports.getEnvFile = getEnvFile;
exports.rxjsAlias = rxjsAlias;
exports.ngcWebpackSetup = ngcWebpackSetup;

