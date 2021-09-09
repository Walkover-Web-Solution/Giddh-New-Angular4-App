const checkInternetConnected = require('check-internet-connected');
const generalHelper = require('../helpers/general');
const realCompanyService = require('../realm-services/company');
const giddhCompanyService = require('../giddh-services/company');

/**
 * This will return company data (if internet is available, it will fetch company data from giddh otherwise will return company data from local db)
 *
 * @param {*} req
 * @param {*} res
 */
function getCompany(req, res) {
    checkInternetConnected(generalHelper.getInternetConnectedConfig).then(async connected => {
        try {
            const response = await giddhCompanyService.getCompany(req, res);
            const finalResponse = await realCompanyService.saveCompany(response);
            res.json(finalResponse);
        } catch (error) {
            res.json({ status: "error", "message": error.message });
        }
    }).catch(async error => {
        try {
            const finalResponse = await realCompanyService.getCompany(req);
            res.json(finalResponse);
        } catch (error) {
            res.json({ status: "error", "message": error.message });
        }
    });
}

exports.getCompany = getCompany;