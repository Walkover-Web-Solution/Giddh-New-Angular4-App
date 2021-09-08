const companyController = require('../controllers/company');

function getCompanyRoutes(app) {
    app.get('/company/:companyUniqueName', companyController.getCompany);
}

module.exports = getCompanyRoutes;