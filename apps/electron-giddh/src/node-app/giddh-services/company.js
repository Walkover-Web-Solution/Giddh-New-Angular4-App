const { callApi } = require("../helpers/apicall");
const { getApiUrl } = require("../helpers/env");

/**
 * This will get the company details
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function getCompanyGiddh(req, res) {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Session-Id': req.headers['session-id']
        }
    }

    const url = getApiUrl(req) + 'company/' + req.params.companyUniqueName;
    return callApi(url, options);
}

module.exports = {
    getCompanyGiddh
};