const Realm = require('realm');
const Schema = require('../schemas/company');
const generalHelper = require('../helpers/general');

async function loginAnonymous() {
    // const credentials = realm.Credentials.anonymous();
    // try {
    //     this.realmApp = new realm.App({ id: 'giddh-electron-notmb' }); // create a new instance of the Realm.App
    //     await this.realmApp.logIn(credentials);
    //     return this.realmApp;
    // } catch (err) {
    //     console.error("Failed to log in", err);
    // }
}

async function saveCompany(response) {
    if(response && response.status === "success") {
        const config = {
            schema: [Schema.User, Schema.Branch, Schema.Warehouse, Schema.Address, Schema.EcommerceType, Schema.Ecommerce, Schema.Currency, Schema.CountryV2, Schema.FinancialYear, Schema.UserDetails, Schema.Country, Schema.PlanDetails, Schema.CompaniesWithTransactions, Schema.Subscription, Schema.Entity, Schema.Permissions, Schema.Scopes, Schema.Role, Schema.UserEntityRoles, Schema.Company],
            schemaVersion: 1
        };

        const companyData = generalHelper.cleanCompanyData(response.body);

        const realmObject = await Realm.open(config);

        realmObject.write(() => {
            const company = realmObject.objects('Company');
            /** Deleting existing company info */
            if(company) {
                realmObject.delete(realmObject.objects("Company"));
            }
            /** Inserting updated company info */
            realmObject.create("Company", companyData);
        });

        return { status: "success",  message: "Company details saved successfully." };
    } else {
        return { status: "error",  message: response.message };
    }
}

async function getCompany(request) {
    try {
        const config = {
            schema: [Schema.User, Schema.Branch, Schema.Warehouse, Schema.Address, Schema.EcommerceType, Schema.Ecommerce, Schema.Currency, Schema.CountryV2, Schema.FinancialYear, Schema.UserDetails, Schema.Country, Schema.PlanDetails, Schema.CompaniesWithTransactions, Schema.Subscription, Schema.Entity, Schema.Permissions, Schema.Scopes, Schema.Role, Schema.UserEntityRoles, Schema.Company],
            schemaVersion: 1
        };

        const realmObject = await Realm.open(config);
        const company = realmObject.objects('Company');
        if(company) {
            return { status: "success",  body: company[0] };
        } else {
            return { status: "error",  message: "Company details unavailable." };    
        }
    } catch(error) {
        return { status: "error",  message: error };
    }
}

exports.saveCompany = saveCompany;
exports.getCompany = getCompany;