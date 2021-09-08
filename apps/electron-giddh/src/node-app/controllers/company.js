const checkInternetConnected = require("check-internet-connected");
const realCompanyService = require('../realm-services/company');
const giddhCompanyService = require('../giddh-services/company');

function getCompany(req, res) {
    checkInternetConnected({
        timeout: 2000,
        retries: 1
    }).then(() => {
        giddhCompanyService.getCompany(req, res).then(response => {
            realCompanyService.saveCompany(response).then(finalResponse => {
                res.json(finalResponse);
            }).catch(error => {
                res.json({ status: "error", "message": error });
            });
        }).catch(error => {
            res.json({ status: "error", "message": error });
        });
    }).catch(() => {
        realCompanyService.getCompany(req).then(finalResponse => {
            res.json(finalResponse);
        });
    });
}

exports.getCompany = getCompany;