const Companies = {
    name: "Companies",
    properties: {
        alias: "string?",
        branchCount: "int?",
        createdBy: {
            type: "object",
            objectType: "User"
        },
        name: "string",
        showOnSubscription: "bool",
        subscription: {
            type: "object?",
            objectType: "Subscription"
        },
        uniqueName: "string"
    }
}

module.exports.Companies = Companies;