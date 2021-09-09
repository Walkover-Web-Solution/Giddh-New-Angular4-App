const apiHelper = require("../helpers/apicall");
const env = require("../helpers/env");

async function getCompanies(req, res) {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Session-Id': req.headers['session-id']
        }
    }

    const url = env.getApiUrl(req) + 'users/' + req.params.userUniqueName + '/v2/companies';
    return apiHelper.callApi(url, options);
}

module.exports.getCompanies = getCompanies;