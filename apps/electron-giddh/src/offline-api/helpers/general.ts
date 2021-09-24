import electron from "electron";
import fs from "fs";

/**
 * This will assign blank object/array to company data if null/undefined value is received from giddh api
 *
 * @param {*} companyData
 * @returns
 */
export function cleanCompanyData(companyData) {
    if (companyData && companyData.addresses && companyData.addresses.length > 0) {
        companyData.addresses.forEach(address => {
            if (!address.branches) {
                address.branches = [];
            }
            if (!address.warehouses) {
                address.warehouses = [];
            }
        });
    } else {
        companyData.addresses = [];
        companyData.addresses.push = [{ branches: [], warehouses: [] }];
    }

    return companyData;
}

/**
 * This will return the config for internet connectivity check
 *
 * @returns
 */
export function getInternetConnectedConfig() {
    return {
        timeout: 2000, //timeout connecting to each server, each try
        retries: 1, //number of retries to do before failing
        domain: 'https://apple.com', //the domain to check DNS record of
    };
}

/**
 * This will create the database file
 *
 * @export
 * @param {string} filename
 */
export function createDbFile(filename: string): any {
    try {
        const fileExists = fs.existsSync(filename);
        if (!fileExists) {
            fs.writeFileSync(filename, "", "utf8");
            return true;
        }
        return false;
    } catch(error) {
        return error;
    }
}

/**
 * This will return the directory path
 *
 * @export
 * @returns {*}
 */
export function getPath(filename: string): any {
    const app = electron?.app || electron?.remote?.app;
    const path = app.getPath('userData') + "/" + filename;
    createDbFile(path);
    return path;
}