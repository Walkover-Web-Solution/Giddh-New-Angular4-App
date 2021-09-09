const Realm = require('realm');
const { User, UserDetails, Country, PlanDetails, CompaniesWithTransactions, Subscription } = require('../schemas/company');
const { Companies } = require('../schemas/companies');

/**
 * This will save the companies list
 *
 * @param {*} request
 * @returns
 */
async function saveCompaniesRealm(request) {
    if (request && request.status === "success") {
        const config = {
            schema: [User, UserDetails, Country, PlanDetails, CompaniesWithTransactions, Subscription, Companies],
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
async function getCompaniesRealm(request) {
    const config = {
        schema: [User, UserDetails, Country, PlanDetails, CompaniesWithTransactions, Subscription, Companies],
        schemaVersion: 1,
        path: 'companies.realm'
    };

    const realmObject = await Realm.open(config);
    const companies = realmObject.objects('Companies');
    
    if (companies) {
        return { status: "success", body: companies };
    } else {
        return { status: "error", message: "Companies list unavailable." };
    }
}

module.exports = {
    saveCompaniesRealm,
    getCompaniesRealm
};