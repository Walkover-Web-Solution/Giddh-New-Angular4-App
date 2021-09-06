const companyRoutes = require('./company');

function defineRoutes(app) {
    companyRoutes(app);
}

module.exports = defineRoutes;