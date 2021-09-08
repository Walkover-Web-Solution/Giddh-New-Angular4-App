const companyController = require('../controllers/company');

function getCompanyRoutes(app) {
    app.get('/company/:companyUniqueName', companyController.getCompany);
    app.get('/users/:userUniqueName/v2/companies', companyController.getCompanies);
}

module.exports = getCompanyRoutes;