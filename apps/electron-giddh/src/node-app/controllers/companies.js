const generalHelper = require('../helpers/general');
const realCompaniesService = require('../realm-services/companies');
const giddhCompaniesService = require('../giddh-services/companies');

function getCompanies(req, res) {
    generalHelper.checkInternet((isConnected) => {
        if (isConnected) {
            giddhCompaniesService.getCompanies(req, res).then(response => {
                realCompaniesService.saveCompanies(response).then(finalResponse => {
                    res.json(finalResponse);
                }).catch(error => {
                    res.json({ status: "error", "message": error.message });
                });
            }).catch(error => {
                res.json({ status: "error", "message": error.message });
            });
        } else {
            realCompaniesService.getCompanies(req).then(finalResponse => {
                res.json(finalResponse);
            });
        }
    });
}

exports.getCompanies = getCompanies;