const companyController = require('../controllers/company');

function getCompanyRoutes(app) {
    app.get('/company/:companyUniqueName', companyController.getCompany);
    app.get('/company/save/:companyUniqueName', companyController.saveCompany);
}

module.exports = getCompanyRoutes;