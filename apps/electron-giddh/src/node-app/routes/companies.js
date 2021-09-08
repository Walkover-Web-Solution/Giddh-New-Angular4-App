const companiesController = require('../controllers/companies');

function getCompaniesRoutes(app) {
    app.get('/users/:userUniqueName/v2/companies', companiesController.getCompanies);
}

module.exports = getCompaniesRoutes;