const fs = require('fs');
const path = require('path');
const installOrRebuild = require('electron-builder-lib/out/util/yarn').installOrRebuild;
const printErrorAndExit = require('builder-util/out/promise').printErrorAndExit;

const root = process.cwd();

const rootPackage = require(path.join(root, 'package.json'));
const platform = process.platform;
const arch = process.arch;
const appDir = path.join(root, 'node_modules_electron');
const electronVersion = getElectronVersion(root);

writeAppPackage(rootPackage, appDir);

installOrRebuild(rootPackage.build, appDir, { frameworkInfo: { version: electronVersion, useCustomDist: false } }, platform, arch, true)
  .catch(printErrorAndExit);


function getElectronVersion(root) {
  const electronPath = path.join(root, 'node_modules', 'electron');
  const file = path.join(electronPath, 'package.json');
  const package = require(file);
  return { frameworkInfo: { version: package.version, useCustomDist: false } };
}

function writeAppPackage(metadata, appDir) {
  const fields = ['name', 'productName', 'version', 'description', 'keywords',
    'author', 'homepage', 'license', 'dependencies'];
  var output = {};
  fields.forEach(function (field) {
    output[field] = metadata[field];
  });
  const outputPath = path.join(appDir, 'package.json');
  if (!fs.existsSync(appDir)) {
    fs.mkdirSync(appDir);
  }
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
}
