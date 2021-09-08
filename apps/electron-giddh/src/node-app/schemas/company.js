const User = {
    name: "User",
    properties: {
        name: "string",
        email: "string?",
        uniqueName: "string",
        mobileNo: "string?",
        isVerified: "bool"
    }
}

const Branch = {
    name: "Branch",
    properties: {
        isDefault: "bool",
        isHeadQuarter: "bool",
        uniqueName: "string",
        alias: "string?",
        name: "string"
    }
}

const Warehouse = {
    name: "Warehouse",
    properties: {
        countryCode: "string?",
        currencyCode: "string?",
        isDefault: "bool",
        callingCode: "string?",
        uniqueName: "string",
        mobileNumber: "string?",
        alias: "string?",
        name: "string"
    }
}

const Address = {
    name: "Address",
    properties: {
        branches: {
            type: "list",
            objectType: "Branch",
            default: [],
            items: {
                type: "object?",
                objectType: "Branch"
            }
        },
        warehouses: {
            type: "list",
            objectType: "Warehouse",
            default: [],
            items: {
                type: "object?",
                objectType: "Warehouse"
            }
        },
        linkEntity: "string?",
        uniqueName: "string?",
        pincode: "string?",
        address: "string?",
        stateName: "string?",
        stateCode: "string?",
        taxNumber: "string?",
        taxType: "string?",
        name: "string?"
    }
}

const EcommerceType = {
    name: "EcommerceType",
    properties: {
        name: "string"
    }
}

const Ecommerce = {
    name: "Ecommerce",
    properties: {
        uniqueName: "string",
        ecommerceType: {
            type: "object",
            objectType: "EcommerceType"
        }
    }
}

const Currency = {
    name: "Currency",
    properties: {
        code: "string",
        symbol: "string?"
    }
}

const CountryV2 = {
    name: "CountryV2",
    properties: {
        alpha3CountryCode: "string",
        alpha2CountryCode: "string",
        countryName: "string",
        callingCode: "string",
        currency: {
            type: "object",
            objectType: "Currency"
        },
        countryIndia: "bool"
    }
}

const FinancialYear = {
    name: "FinancialYear",
    properties: {
        uniqueName: "string",
        isLocked: "bool",
        financialYearStarts: "string?",
        financialYearEnds: "string?"
    }
}

const UserDetails = {
    name: "UserDetails",
    properties: {
        name: "string",
        uniqueName: "string",
        email: "string?",
        signUpOn: "string?",
        mobileno: "string?",
        lastSeen: "string?",
        managerDetails: "string?"
    }
}

const Country = {
    name: "Country",
    properties: {
        countryName: "string",
        countryCode: "string"
    }
}

const PlanDetails = {
    name: "PlanDetails",
    properties: {
        countries: {
            type: "list",
            objectType: "string"
        },
        currency: "string?",
        duration: "int?",
        uniqueName: "string",
        durationUnit: "string?",
        createdAt: "string",
        amount: "double",
        companiesLimit: "int?",
        transactionLimit: "int?",
        ratePerExtraTransaction: "double?",
        isCommonPlan: "bool",
        name: "string"
    }
}

const CompaniesWithTransactions = {
    name: "CompaniesWithTransactions",
    properties: {
        uniqueName: "string",
        name: "string",
        transactions: "int"
    }
}

const Subscription = {
    name: "Subscription",
    properties: {
        companiesWithTransactions: {
            type: "CompaniesWithTransactions",
            optional: true,
            objectType: "CompaniesWithTransactions"
        },
        companies: "string?", // need to check
        totalTransactions: "int?",
        totalCompanies: "int?",
        overdraftTransactions: "int?",
        transactionsRemaining: "int?",
        userDetails: {
            type: "object",
            objectType: "UserDetails"
        },
        addOnTransactions: "int?",
        subscriptionStatus: "string?",
        country: {
            type: "object",
            objectType: "Country"
        },
        status: "string?",
        createdAt: "string?",
        balance: "double",
        companyCount: "int",
        subscriptionId: "string",
        companyTotalTransactions: "int?",
        expiry: "string?",
        startedAt: "string?",
        planDetails: {
            type: "object",
            objectType: "PlanDetails"
        },
        remainingTransactions: "int?",
        additionalCharges: "double?"
    }
}

const Entity = {
    name: "Entity",
    properties: {
        uniqueName: "string",
        name: "string",
        entity: "string?"
    }
}

const Permissions = {
    name: "Permissions",
    properties: {
        code: "string?"
    }
}

const Scopes = {
    name: "Scopes",
    properties: {
        permissions: {
            type: "list",
            objectType: "Permissions",
            items: {
                type: "object",
                objectType: "Permissions"
            }
        },
        name: "string"
    }
}

const Role = {
    name: "Role",
    properties: {
        uniqueName: "string",
        isFixed: "bool",
        scopes: {
            type: "list",
            objectType: "Scopes",
            items: {
                type: "object",
                objectType: "Scopes"
            }
        },
        name: "string"
    }
}

const UserEntityRoles = {
    name: "UserEntityRoles",
    properties: {
        duration: "string?",
        from: "string?",
        entity: {
            type: "object",
            objectType: "Entity"
        },
        uniqueName: "string",
        role: {
            type: "object",
            objectType: "Role"
        },
        to: "string?",
        period: "string?",
        allowedIps: {
            type: "list",
            objectType: "string"
        },
        allowedCidrs: {
            type: "list",
            objectType: "string"
        },
        sharedWith: {
            type: "object",
            objectType: "User"
        },
        sharedBy: {
            type: "object",
            objectType: "User"
        }
    }
}

const Company = {
    name: "Company",
    properties: {
        companyTotals: "string?",
        headQuarterAlias: "string?",
        country: "string",
        state: "string?",
        uniqueName: "string",
        city: "string?",
        email: "string?",
        createdBy: {
            type: "object",
            objectType: "User"
        },
        createdAt: "string",
        addresses: {
            type: "list",
            objectType: "Address",
            items: {
                type: "object?",
                objectType: "Address"
            }
        },
        contactNo: "string?",
        pincode: "string?",
        updatedAt: "string?",
        address: "string?",
        ecommerceDetails: {
            type: "list",
            objectType: "Ecommerce",
            items: {
                type: "object?",
                objectType: "Ecommerce"
            }
        },
        baseCurrency: "string?",
        balanceDisplayFormat: "string?",
        businessNature: "string?",
        updatedBy: {
            type: "object?",
            objectType: "User"
        },
        balanceDecimalPlaces: "int?",
        businessType: "string?",
        alias: "string?",
        subscription: {
            type: "object?",
            objectType: "Subscription"
        },
        userEntityRoles: {
            type: "list",
            objectType: "UserEntityRoles",
            items: {
                type: "object?",
                objectType: "UserEntityRoles"
            }
        },
        nameAlias: "string?",
        activeFinancialYear: {
            type: "object?",
            objectType: "FinancialYear"
        },
        licenceKey: "string?",
        panNumber: "string?",
        financialYears: {
            type: "list",
            objectType: "FinancialYear",
            items: {
                type: "object?",
                objectType: "FinancialYear"
            }
        },
        voucherVersion: "int?",
        companyIdentity: {
            type: "list",
            objectType: "string"
        },
        baseCurrencySymbol: "string?",
        countryV2: {
            type: "object?",
            objectType: "CountryV2"
        },
        lastAccessDetails: "string?",
        name: "string?"
    },
    primaryKey: "uniqueName"
};

module.exports.User = User;
module.exports.Branch = Branch;
module.exports.Warehouse = Warehouse;
module.exports.Address = Address;
module.exports.EcommerceType = EcommerceType;
module.exports.Ecommerce = Ecommerce;
module.exports.Currency = Currency;
module.exports.CountryV2 = CountryV2;
module.exports.FinancialYear = FinancialYear;
module.exports.UserDetails = UserDetails;
module.exports.Country = Country;
module.exports.PlanDetails = PlanDetails;
module.exports.CompaniesWithTransactions = CompaniesWithTransactions;
module.exports.Subscription = Subscription;
module.exports.Entity = Entity;
module.exports.Permissions = Permissions;
module.exports.Scopes = Scopes;
module.exports.Role = Role;
module.exports.UserEntityRoles = UserEntityRoles;
module.exports.Company = Company;