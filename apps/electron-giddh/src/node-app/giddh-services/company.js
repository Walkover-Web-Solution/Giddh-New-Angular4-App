const apiHelper = require("../helpers/apicall");

async function getCompany(req, res) {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Session-Id': req.headers['session-id'],
        }
    }

    const url = 'https://apitest.giddh.com/company/' + req.params.companyUniqueName;

    return apiHelper.callApi(url, options);
}

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

module.exports.getCompany = getCompany;
module.exports.getCompanies = getCompanies;