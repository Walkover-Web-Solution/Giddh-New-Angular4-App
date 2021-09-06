function cleanCompanyData(obj) {
    if(obj.addresses && obj.addresses.length > 0) {
        obj.addresses.forEach(address => {
            if(!address.branches) {
                address.branches = [];
            }
            if(!address.warehouses) {
                address.warehouses = [];
            }
        });
    } else {
        obj.addresses = [];
        obj.addresses[0].branches = [];
        obj.addresses[0].warehouses = [];
    }

    return obj;
}

module.exports.cleanCompanyData = cleanCompanyData;