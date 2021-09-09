const { getCompanyRoutes } = require('./company');
const { getCompaniesRoutes } = require('./companies');

/**
 * Initializing all routes here
 *
 * @param {*} app
 */
function defineRoutes(app) {
    getCompanyRoutes(app);
    getCompaniesRoutes(app);
}

module.exports = {
    defineRoutes
};