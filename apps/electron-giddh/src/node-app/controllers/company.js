const internetAvailable = require("internet-available");
const realCompanyService = require('../realm-services/company');
const giddhCompanyService = require('../giddh-services/company');

function getCompany(req, res) {
    internetAvailable({
        timeout: 2000, // Provide maximum execution time for the verification
        retries: 1 // If it tries 5 times and it fails, then it will throw no internet
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

function getCompanies(req, res) {
    internetAvailable({
        timeout: 2000, // Provide maximum execution time for the verification
        retries: 1 // If it tries 5 times and it fails, then it will throw no internet
    }).then(() => {
        giddhCompanyService.getCompanies(req, res).then(response => {
            realCompanyService.saveCompanies(response).then(finalResponse => {
                res.json(finalResponse);
            }).catch(error => {
                res.json({ status: "error", "message": error });
            });
        }).catch(error => {
            res.json({ status: "error", "message": error });
        });
    }).catch(() => {
        realCompanyService.getCompanies(req).then(finalResponse => {
            res.json(finalResponse);
        });
    });
}

exports.getCompany = getCompany;
exports.getCompanies = getCompanies;