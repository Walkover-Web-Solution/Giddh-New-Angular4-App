const checkInternetConnected = require('check-internet-connected');
const { getInternetConnectedConfig } = require('../helpers/general');
const { saveCompanyRealm, getCompanyRealm } = require('../realm-services/company');
const { getCompanyGiddh } = require('../giddh-services/company');

/**
 * This will return company data (if internet is available, it will fetch company data from giddh otherwise will return company data from local db)
 *
 * @param {*} req
 * @param {*} res
 */
function getCompanyController(req, res) {
    checkInternetConnected(getInternetConnectedConfig).then(async connected => {
        try {
            const response = await getCompanyGiddh(req, res);
            const finalResponse = await saveCompanyRealm(response);
            res.json(finalResponse);
        } catch (error) {
            res.json({ status: "error", "message": error.message });
        }
    }).catch(async error => {
        try {
            const finalResponse = await getCompanyRealm(req);
            res.json(finalResponse);
        } catch (error) {
            res.json({ status: "error", "message": error.message });
        }
    });
}

module.exports = {
    getCompanyController
};