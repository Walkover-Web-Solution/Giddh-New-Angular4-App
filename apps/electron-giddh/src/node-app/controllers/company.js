const checkInternetConnected = require('check-internet-connected');
const generalHelper = require('../helpers/general');
const realCompanyService = require('../realm-services/company');
const giddhCompanyService = require('../giddh-services/company');

function getCompany(req, res) {
    checkInternetConnected(generalHelper.getInternetConnectedConfig).then(connected => {
        giddhCompanyService.getCompany(req, res).then(response => {
            realCompanyService.saveCompany(response).then(finalResponse => {
                res.json(finalResponse);
            }).catch(error => {
                res.json({ status: "error", "message": error.message });
            });
        }).catch(error => {
            res.json({ status: "error", "message": error.message });
        });
    }).catch(error => {
        realCompanyService.getCompany(req).then(finalResponse => {
            res.json(finalResponse);
        });
    });
}

exports.getCompany = getCompany;