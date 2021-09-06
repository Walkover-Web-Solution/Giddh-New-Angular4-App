const realm = require('realm');
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
            schemaVersion: 16
        };

        const companyData = generalHelper.cleanCompanyData(response.body);

        try {
            const realmObject = await Realm.open(config);

            realmObject.write(() => {
                /** Deleting existing company info */
                realmObject.delete(realmObject.objects("Company"));
                /** Inserting updated company info */
                realmObject.create("Company", companyData);
            });

            return { response: "success",  message: "Company details saved successfully." };
        } catch(error) {
            return { response: "error",  message: error };
        }
    } else {
        return { response: "error",  message: response.message };
    }
}

async function getCompany(request) {
    try {
        const config = {
            schema: [Schema.User, Schema.Branch, Schema.Warehouse, Schema.Address, Schema.EcommerceType, Schema.Ecommerce, Schema.Currency, Schema.CountryV2, Schema.FinancialYear, Schema.UserDetails, Schema.Country, Schema.PlanDetails, Schema.CompaniesWithTransactions, Schema.Subscription, Schema.Entity, Schema.Permissions, Schema.Scopes, Schema.Role, Schema.UserEntityRoles, Schema.Company],
            schemaVersion: 16
        };

        const realmObject = await Realm.open(config);
        const company = realmObject.objects('Company');
        return { response: "success",  body: company };
    } catch(error) {
        return { response: "error",  message: error };
    }
}

exports.saveCompany = saveCompany;
exports.getCompany = getCompany;