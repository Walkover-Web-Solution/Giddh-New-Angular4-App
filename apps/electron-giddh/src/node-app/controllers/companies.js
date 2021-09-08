const checkInternetConnected = require("check-internet-connected");
const realCompaniesService = require('../realm-services/companies');
const giddhCompaniesService = require('../giddh-services/companies');

function getCompanies(req, res) {
    checkInternetConnected({
        timeout: 2000,
        retries: 1
    }).then(() => {
        giddhCompaniesService.getCompanies(req, res).then(response => {
            realCompaniesService.saveCompanies(response).then(finalResponse => {
                res.json(finalResponse);
            }).catch(error => {
                res.json({ status: "error", "message": error });
            });
        }).catch(error => {
            res.json({ status: "error", "message": error });
        });
    }).catch(() => {
        realCompaniesService.getCompanies(req).then(finalResponse => {
            res.json(finalResponse);
        });
    });
}

exports.getCompanies = getCompanies;