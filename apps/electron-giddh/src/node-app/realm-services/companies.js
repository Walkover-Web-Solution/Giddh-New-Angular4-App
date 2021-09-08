const Realm = require('realm');
const CompanySchema = require('../schemas/company');
const Schema = require('../schemas/companies');

/**
 * This will save the companies list
 *
 * @param {*} request
 * @returns
 */
async function saveCompanies(request) {
    if (request && request.status === "success") {
        const config = {
            schema: [CompanySchema.User, CompanySchema.UserDetails, CompanySchema.Country, CompanySchema.PlanDetails, CompanySchema.CompaniesWithTransactions, CompanySchema.Subscription, Schema.Companies],
            schemaVersion: 1,
            path: 'companies.realm'
        };

        const companiesList = request.body;
        const realmObject = await Realm.open(config);

        realmObject.write(() => {
            const companies = realmObject.objects('Companies');
            /** Deleting existing companies info */
            if (companies) {
                realmObject.delete(realmObject.objects("Companies"));
            }
            /** Inserting updated companies info */
            companiesList.forEach(company => {
                realmObject.create("Companies", company);
            });
        });

        realmObject.close();

        return { status: "success", body: companiesList };
    } else {
        return { status: "error", message: request.message };
    }
}

/**
 * This will return the list of companies
 *
 * @param {*} request
 * @returns
 */
async function getCompanies(request) {
    const config = {
        schema: [CompanySchema.User, CompanySchema.UserDetails, CompanySchema.Country, CompanySchema.PlanDetails, CompanySchema.CompaniesWithTransactions, CompanySchema.Subscription, Schema.Companies],
        schemaVersion: 1,
        path: 'companies.realm'
    };

    const realmObject = await Realm.open(config);
    const companies = realmObject.objects('Companies');

    realmObject.close();
    
    if (companies) {
        return { status: "success", body: companies };
    } else {
        return { status: "error", message: "Companies list unavailable." };
    }
}

exports.saveCompanies = saveCompanies;
exports.getCompanies = getCompanies;