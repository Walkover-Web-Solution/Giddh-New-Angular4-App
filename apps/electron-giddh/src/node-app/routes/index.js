const companyRoutes = require('./company');
const companiesRoutes = require('./companies');

function defineRoutes(app) {
    companyRoutes(app);
    companiesRoutes(app);
}

module.exports = defineRoutes;