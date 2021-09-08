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
            schemaVersion: 1
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
    try {
        const config = {
            schema: [Schema.User, Schema.Branch, Schema.Warehouse, Schema.Address, Schema.EcommerceType, Schema.Ecommerce, Schema.Currency, Schema.CountryV2, Schema.FinancialYear, Schema.UserDetails, Schema.Country, Schema.PlanDetails, Schema.CompaniesWithTransactions, Schema.Subscription, Schema.Entity, Schema.Permissions, Schema.Scopes, Schema.Role, Schema.UserEntityRoles, Schema.Company],
            schemaVersion: 1
        };

        const realmObject = await Realm.open(config);
        const company = realmObject.objects('Company');
        if (company) {
            return { status: "success", body: company[0] };
        } else {
            return { status: "error", message: "Company details unavailable." };
        }
    } catch (error) {
        return { status: "error", message: error };
    }
}

/**
 * This will save the companies list
 *
 * @param {*} request
 * @returns
 */
async function saveCompanies(request) {
    if (request && request.status === "success") {
        const config = {
            schema: [Schema.User, Schema.Subscription, Schema.Companies],
            schemaVersion: 1
        };

        const companiesList = request.body;

        const realmObject = await Realm.open(config);

        realmObject.write(() => {
            const company = realmObject.objects('Companies');
            /** Deleting existing companies info */
            if (company) {
                realmObject.delete(realmObject.objects("Companies"));
            }
            /** Inserting updated companies info */
            realmObject.create("Companies", companiesList);
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
async function getCompanies(request) {
    try {
        const config = {
            schema: [Schema.User, Schema.Subscription, Schema.Companies],
            schemaVersion: 1
        };

        const realmObject = await Realm.open(config);
        const companies = realmObject.objects('Companies');
        if (companies) {
            return { status: "success", body: companies[0] };
        } else {
            return { status: "error", message: "Companies list unavailable." };
        }
    } catch (error) {
        return { status: "error", message: error };
    }
}

exports.saveCompany = saveCompany;
exports.getCompany = getCompany;
exports.saveCompanies = saveCompanies;
exports.getCompanies = getCompanies;