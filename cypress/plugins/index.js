/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
const fs = require('fs-extra')
const path = require('path')

function getConfigurationByFile (file) {
    const pathToConfigFile = path.resolve('..', "Giddh-New-Angular4-App/cypress/config", `${file}.json`)

    return fs.readJson(pathToConfigFile)
}
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  //   console.log(config) // see what all is in here!
  //
  //   // modify config values
  //   config.defaultCommandTimeout = 10000
  //   config.baseUrl = 'http://test.giddh.com/'
  //
  //   // modify env var value
  //   config.env.ENVIRONMENT = 'staging'
  //
  //   // return config
  //   return config

    const file = config.env.configFile || 'test'

    return getConfigurationByFile(file)
}
