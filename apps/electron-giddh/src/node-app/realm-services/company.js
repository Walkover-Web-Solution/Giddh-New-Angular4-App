const Realm = require('realm');
const Schema = require('../schemas/company');
const generalHelper = require('../helpers/general');

/**
 * This will save the active company information
 *
 * @param {*} request
 * @returns
 */
async function saveCompany(request) {
    if (request && request.status === "success") {
        const config = {
            schema: [Schema.User, Schema.Branch, Schema.Warehouse, Schema.Address, Schema.EcommerceType, Schema.Ecommerce, Schema.Currency, Schema.CountryV2, Schema.FinancialYear, Schema.UserDetails, Schema.Country, Schema.PlanDetails, Schema.CompaniesWithTransactions, Schema.Subscription, Schema.Entity, Schema.Permissions, Schema.Scopes, Schema.Role, Schema.UserEntityRoles, Schema.Company],
            schemaVersion: 1,
            path: 'company.realm'
        };

        const companyData = generalHelper.cleanCompanyData(request.body);

        const realmObject = await Realm.open(config);

        realmObject.write(() => {
            const company = realmObject.objects('Company');
            /** Deleting existing company info */
            if (company) {
                realmObject.delete(realmObject.objects("Company"));
            }
            /** Inserting updated company info */
            realmObject.create("Company", companyData);
        });
        
        realmObject.close();

        return { status: "success", body: companyData };
    } else {
        return { status: "error", message: request.message };
    }
}

/**
 * This will return the active company information
 *
 * @param {*} request
 * @returns
 */
async function getCompany(request) {
    const config = {
        schema: [Schema.User, Schema.Branch, Schema.Warehouse, Schema.Address, Schema.EcommerceType, Schema.Ecommerce, Schema.Currency, Schema.CountryV2, Schema.FinancialYear, Schema.UserDetails, Schema.Country, Schema.PlanDetails, Schema.CompaniesWithTransactions, Schema.Subscription, Schema.Entity, Schema.Permissions, Schema.Scopes, Schema.Role, Schema.UserEntityRoles, Schema.Company],
        schemaVersion: 1,
        path: 'company.realm'
    };

    const realmObject = await Realm.open(config);
    const company = realmObject.objects('Company');

    realmObject.close();

    if (company) {
        return { status: "success", body: company[0] };
    } else {
        return { status: "error", message: "Company details unavailable." };
    }
}

exports.saveCompany = saveCompany;
exports.getCompany = getCompany;