const realCompanyService = require('../realm-services/company');
const giddhCompanyService = require('../giddh-services/company');

function saveCompany(req, res) {
    giddhCompanyService.getCompany(req, res).then(response => {
        realCompanyService.saveCompany(response).then(finalResponse => {
            res.json(finalResponse);
        });
    }).catch(error => {
        res.json({ status: "error", "message": error });
    });
}

function getCompany(req, res) {
    realCompanyService.getCompany(req).then(finalResponse => {
        res.json(finalResponse);
    });
}

exports.saveCompany = saveCompany;
exports.getCompany = getCompany;