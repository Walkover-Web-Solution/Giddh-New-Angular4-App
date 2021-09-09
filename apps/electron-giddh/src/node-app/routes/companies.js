const companiesController = require('../controllers/companies');

/**
 * Companies routes
 *
 * @param {*} app
 */
function getCompaniesRoutes(app) {
    app.get('/users/:userUniqueName/v2/companies', companiesController.getCompanies);
}

module.exports = getCompaniesRoutes;