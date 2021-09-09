const apiHelper = require("../helpers/apicall");
const env = require("../helpers/env");

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