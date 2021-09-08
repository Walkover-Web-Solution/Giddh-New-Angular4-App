const apiHelper = require("../helpers/apicall");

async function getCompanies(req, res) {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Session-Id': req.headers['session-id'],
        }
    }

    const url = 'https://apitest.giddh.com/users/' + req.params.userUniqueName + '/v2/companies';

    return apiHelper.callApi(url, options);
}

module.exports.getCompanies = getCompanies;