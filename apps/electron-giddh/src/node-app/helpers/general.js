function cleanCompanyData(obj) {
    if(obj && obj.addresses && obj.addresses.length > 0) {
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
        obj.addresses[0] = {};
        obj.addresses[0].branches = [];
        obj.addresses[0].warehouses = [];
    }

    return obj;
}

function checkInternet(callback) {
    require('dns').lookup('apple.com', (err) => {
        if (err && err.code == "ENOTFOUND") {
            callback(false);
        } else {
            callback(true);
        }
    })
}

module.exports.cleanCompanyData = cleanCompanyData;
module.exports.checkInternet = checkInternet;