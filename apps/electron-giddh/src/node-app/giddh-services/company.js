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

module.exports.getCompany = getCompany;