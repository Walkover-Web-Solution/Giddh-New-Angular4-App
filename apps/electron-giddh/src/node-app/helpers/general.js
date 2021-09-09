function cleanCompanyData(companyData) {
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

function getInternetConnectedConfig() {
    return {
        timeout: 2000, //timeout connecting to each server, each try
        retries: 1, //number of retries to do before failing
        domain: 'https://apple.com', //the domain to check DNS record of
    };
}

module.exports.cleanCompanyData = cleanCompanyData;
module.exports.getInternetConnectedConfig = getInternetConnectedConfig;