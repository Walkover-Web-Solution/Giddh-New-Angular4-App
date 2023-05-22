const COMMON_URL_FOR_ACCOUNT = 'company/:companyUniqueName/accounts/:accountUniqueName';
const COMMON_URL_FOR_ACCOUNT_V2 = 'v2/company/:companyUniqueName/accounts/:accountUniqueName?source=:source';

export const ACCOUNTS_API_V2 = {
    GET: COMMON_URL_FOR_ACCOUNT_V2,
    UPDATE: 'v2/company/:companyUniqueName/groups/:groupUniqueName/accounts/:accountUniqueName',
    CREATE: 'v2/company/:companyUniqueName/groups/:groupUniqueName/accounts'
};

export const ACCOUNTS_API = {
    UPDATE: COMMON_URL_FOR_ACCOUNT,
    DELETE: COMMON_URL_FOR_ACCOUNT, // delete method,
    MERGE: COMMON_URL_FOR_ACCOUNT + '/merge',
    UNMERGE: COMMON_URL_FOR_ACCOUNT + '/un-merge',
    MOVE: COMMON_URL_FOR_ACCOUNT + '/move',
    SHARE: 'company/:companyUniqueName/role/:roleUniqueName/assign',
    CHANGE_PERMISSION: 'company/:companyUniqueName/uer/:assignRoleEntryUniqueName',
    SHARED_WITH: COMMON_URL_FOR_ACCOUNT + '/shared-with',
    TAX_HIERARCHY: COMMON_URL_FOR_ACCOUNT + '/tax-hierarchy', // get call
    FLATTEN_ACCOUNTS: 'company/:companyUniqueName/flatten-accounts?q=:q&page=:page&count=:count', // get call
};
