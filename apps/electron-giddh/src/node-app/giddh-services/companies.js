const { callApi } = require("../helpers/apicall");
const { getApiUrl } = require("../helpers/env");

/**
 * This will get the list of companies
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function getCompaniesGiddh(req, res) {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Session-Id': req.headers['session-id']
        }
    }

    const url = getApiUrl(req) + 'users/' + req.params.userUniqueName + '/v2/companies';
    return callApi(url, options);
}

module.exports = {
    getCompaniesGiddh
};