const companyController = require('../controllers/company');

/**
 * Company routes
 *
 * @param {*} app
 */
function getCompanyRoutes(app) {
    app.get('/company/:companyUniqueName', companyController.getCompany);
}

module.exports = getCompanyRoutes;