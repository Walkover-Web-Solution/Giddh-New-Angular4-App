export const GROUP_API = {
    CREATE: 'company/:companyUniqueName/groups',
    UPDATE_GROUP: 'company/:companyUniqueName/groups/:groupUniqueName',
    UNSHARE: 'company/:companyUniqueName/groups/:groupUniqueName/unshare',
    SHARED_WITH: 'company/:companyUniqueName/groups/:groupUniqueName/shared-with',
    UPDATE: 'company/:companyUniqueName/groups/:groupUniqueName',
    GROUPS_WITH_ACCOUNT: 'company/:companyUniqueName/groups-with-accounts?q=:q',
    GET_GROUP_DETAILS: 'company/:companyUniqueName/groups/:groupUniqueName', // delete method,
    DELETE_GROUP: 'company/:companyUniqueName/groups/:groupUniqueName', // delete method,
    MOVE_GROUP: 'company/:companyUniqueName/groups/:groupUniqueName/move',
    FLATTEN_GROUP_WITH_ACCOUNTS: 'company/:companyUniqueName/flatten-groups-with-accounts?q=:q&page=:page&count=:count&showEmptyGroups=:showEmptyGroups',
    FLATTEN_GROUPS_ACCOUNTS: 'company/:companyUniqueName/groups/flatten-groups-accounts?q=:q&page=:page&count=:count&showEmptyGroups=:showEmptyGroups', // get call
    TAX_HIERARCHY: 'company/:companyUniqueName/groups/:groupUniqueName/tax-hierarchy', // get call
    CREATE_COMPANY_CUSTOM_FIELD: 'company/:companyUniqueName/custom-fields',
    SEARCH_GROUPS: 'company/:companyUniqueName/group-search',
    GET_MASTERS: 'company/:companyUniqueName/groups/:groupUniqueName/masters?page=:page&count=:count',
    GET_TOP_SHARED_GROUPS: 'company/:companyUniqueName/top-shared-groups'
};
