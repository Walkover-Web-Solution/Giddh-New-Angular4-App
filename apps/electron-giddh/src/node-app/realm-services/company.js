const Realm = require('realm');
const { User, Branch, Warehouse, Address, EcommerceType, Ecommerce, Currency, CountryV2, FinancialYear, UserDetails, Country, PlanDetails, CompaniesWithTransactions, Subscription, Entity, Permissions, Scopes, Role, UserEntityRoles, Company } = require('../schemas/company');
const { cleanCompanyData } = require('../helpers/general');

/**
 * This will save the active company information
 *
 * @param {*} request
 * @returns
 */
async function saveCompanyRealm(request) {
    if (request && request.status === "success") {
        const config = {
            schema: [User, Branch, Warehouse, Address, EcommerceType, Ecommerce, Currency, CountryV2, FinancialYear, UserDetails, Country, PlanDetails, CompaniesWithTransactions, Subscription, Entity, Permissions, Scopes, Role, UserEntityRoles, Company],
            schemaVersion: 2,
            path: 'company.realm'
        };

        const companyData = cleanCompanyData(request.body);

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
async function getCompanyRealm(request) {
    const config = {
        schema: [User, Branch, Warehouse, Address, EcommerceType, Ecommerce, Currency, CountryV2, FinancialYear, UserDetails, Country, PlanDetails, CompaniesWithTransactions, Subscription, Entity, Permissions, Scopes, Role, UserEntityRoles, Company],
        schemaVersion: 2,
        path: 'company.realm'
    };

    const realmObject = await Realm.open(config);
    const company = realmObject.objects('Company');

    if (company) {
        return { status: "success", body: company[0] };
    } else {
        return { status: "error", message: "Company details unavailable." };
    }
}

module.exports = {
    saveCompanyRealm,
    getCompanyRealm
};