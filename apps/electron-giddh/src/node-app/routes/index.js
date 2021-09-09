const companyRoutes = require('./company');
const companiesRoutes = require('./companies');

/**
 * Initializing all routes here
 *
 * @param {*} app
 */
function defineRoutes(app) {
    companyRoutes(app);
    companiesRoutes(app);
}

module.exports = defineRoutes;