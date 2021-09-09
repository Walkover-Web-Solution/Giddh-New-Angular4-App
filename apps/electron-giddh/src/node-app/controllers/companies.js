const checkInternetConnected = require('check-internet-connected');
const generalHelper = require('../helpers/general');
const realCompaniesService = require('../realm-services/companies');
const giddhCompaniesService = require('../giddh-services/companies');

function getCompanies(req, res) {
    checkInternetConnected(generalHelper.getInternetConnectedConfig).then(connected => {
        giddhCompaniesService.getCompanies(req, res).then(response => {
            realCompaniesService.saveCompanies(response).then(finalResponse => {
                res.json(finalResponse);
            }).catch(error => {
                res.json({ status: "error", "message": error.message });
            });
        }).catch(error => {
            res.json({ status: "error", "message": error.message });
        });
    }).catch(error => {
        realCompaniesService.getCompanies(req).then(finalResponse => {
            res.json(finalResponse);
        });
    });
}

exports.getCompanies = getCompanies;