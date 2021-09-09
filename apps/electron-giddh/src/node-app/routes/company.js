const { getCompanyController } = require('../controllers/company');

/**
 * Company routes
 *
 * @param {*} app
 */
function getCompanyRoutes(app) {
    app.get('/company/:companyUniqueName', getCompanyController);
}

module.exports = {
    getCompanyRoutes
};