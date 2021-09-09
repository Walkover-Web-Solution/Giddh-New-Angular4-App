const checkInternetConnected = require('check-internet-connected');
const generalHelper = require('../helpers/general');
const realCompaniesService = require('../realm-services/companies');
const giddhCompaniesService = require('../giddh-services/companies');

/**
 * This will return companies list (if internet is available, it will fetch list of companies from giddh otherwise will return list of companies from local db)
 *
 * @param {*} req
 * @param {*} res
 */
function getCompanies(req, res) {
    checkInternetConnected(generalHelper.getInternetConnectedConfig).then( async connected => {
        try {
            const response = await giddhCompaniesService.getCompanies(req, res);
            const finalResponse = realCompaniesService.saveCompanies(response);
            res.json(finalResponse);
        } catch(error) {
            res.json({ status: "error", "message": error.message });
        }
    }).catch(async error => {
        try {
            const finalResponse = await realCompaniesService.getCompanies(req);
            res.json(finalResponse);
        } catch (error) {
            res.json({ status: "error", "message": error.message });
        }
    });
}

exports.getCompanies = getCompanies;