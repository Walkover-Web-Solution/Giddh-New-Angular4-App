const checkInternetConnected = require('check-internet-connected');
const { getInternetConnectedConfig } = require('../helpers/general');
const { saveCompaniesRealm, getCompaniesRealm } = require('../realm-services/companies');
const { getCompaniesGiddh } = require('../giddh-services/companies');

/**
 * This will return companies list (if internet is available, it will fetch list of companies from giddh otherwise will return list of companies from local db)
 *
 * @param {*} req
 * @param {*} res
 */
function getCompaniesController(req, res) {
    checkInternetConnected(getInternetConnectedConfig).then(async connected => {
        try {
            const response = await getCompaniesGiddh(req, res);
            const finalResponse = await saveCompaniesRealm(response);
            res.json(finalResponse);
        } catch (error) {
            res.json({ status: "error", "message": error.message });
        }
    }).catch(async error => {
        try {
            const finalResponse = await getCompaniesRealm(req);
            res.json(finalResponse);
        } catch (error) {
            res.json({ status: "error", "message": error.message });
        }
    });
}

module.exports = {
    getCompaniesController
};