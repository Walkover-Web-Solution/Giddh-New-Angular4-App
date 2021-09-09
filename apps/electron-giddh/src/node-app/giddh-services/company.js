const apiHelper = require("../helpers/apicall");
const env = require("../helpers/env");

/**
 * This will get the company details
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function getCompany(req, res) {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Session-Id': req.headers['session-id']
        }
    }

    const url = env.getApiUrl(req) + 'company/' + req.params.companyUniqueName;
    return apiHelper.callApi(url, options);
}

module.exports.getCompany = getCompany;